import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getCommentModel, getUserModel, getStatsModel;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    await connectDB();

    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    getUserModel();

    if (!getCommentModel) {
      const commentMod = await import('@/models/Comment');
      getCommentModel = commentMod.default;
    }
    const Comment = getCommentModel();

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    // Flatten author
    const formattedComments = comments.map(comment => ({
      ...comment,
      author: comment.author?.name || 'Unknown',
      author_id: comment.author?._id?.toString() || '',
      date: comment.createdAt ? new Date(comment.createdAt).toISOString().split('T')[0] : comment.date
    }));

    return NextResponse.json(formattedComments || []);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, content, parent } = body;
    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 });
    }

    await connectDB();

    if (!getCommentModel) {
      const commentMod = await import('@/models/Comment');
      getCommentModel = commentMod.default;
    }
    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Comment = getCommentModel();
    const Stats = getStatsModel();

    const comment = new Comment({
      post: postId,
      author: session.user.id,
      content,
      parent: parent || null,
    });
    await comment.save();

    await Stats.findOneAndUpdate(
      { entityType: 'post', entityId: postId },
      { $inc: { comments: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    // Populate for return
    await comment.populate('author', 'name image');
    const formattedComment = {
      ...comment.toObject(),
      author: comment.author?.name || 'Unknown',
      author_id: comment.author?._id?.toString() || '',
      date: comment.createdAt ? new Date(comment.createdAt).toISOString().split('T')[0] : comment.date
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
