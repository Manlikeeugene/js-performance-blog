import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getLikeModel, getStatsModel;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const session = await auth();

    await connectDB();

    if (!getLikeModel) {
      const likeMod = await import('@/models/Like');
      getLikeModel = likeMod.default;
    }
    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Like = getLikeModel();
    const Stats = getStatsModel();

    const stats = await Stats.findOne({ entityType: 'post', entityId: postId }).lean();
    const userLiked = session?.user
      ? !!(await Like.findOne({ post: postId, user: session.user.id }))
      : false;

    return NextResponse.json({ likes: stats?.likes || 0, userLiked });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    await connectDB();

    if (!getLikeModel) {
      const likeMod = await import('@/models/Like');
      getLikeModel = likeMod.default;
    }
    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Like = getLikeModel();
    const Stats = getStatsModel();

    const existingLike = await Like.findOne({ post: postId, user: session.user.id });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      await Stats.findOneAndUpdate(
        { entityType: 'post', entityId: postId },
        { $inc: { likes: -1 }, $set: { updatedAt: new Date() } }
      );
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      // Like
      const like = new Like({ post: postId, user: session.user.id });
      await like.save();
      await Stats.findOneAndUpdate(
        { entityType: 'post', entityId: postId },
        { $inc: { likes: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}