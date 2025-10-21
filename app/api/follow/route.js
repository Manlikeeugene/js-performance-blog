import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getUserModel, getStatsModel;

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId } = body;
    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }
    if (targetUserId === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    await connectDB();

    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const User = getUserModel();
    const Stats = getStatsModel();

    const currentUser = await User.findById(session.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(session.user.id, { $pull: { following: targetUserId } });
      await Stats.findOneAndUpdate(
        { entityType: 'user', entityId: targetUserId },
        { $inc: { followers: -1 }, $set: { updatedAt: new Date() } }
      );
      return NextResponse.json({ following: false }, { status: 200 });
    } else {
      // Follow
      await User.findByIdAndUpdate(session.user.id, { $addToSet: { following: targetUserId } });
      await Stats.findOneAndUpdate(
        { entityType: 'user', entityId: targetUserId },
        { $inc: { followers: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ following: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}