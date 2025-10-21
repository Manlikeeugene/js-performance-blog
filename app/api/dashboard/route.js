import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getStatsModel;

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Stats = getStatsModel();

    const userStats = await Stats.findOne({
      entityType: 'user',
      entityId: session.user.id,
    }).lean();

    return NextResponse.json({
      totalViews: userStats?.views || 0,
      totalPosts: userStats?.posts || 0,
      totalLikes: userStats?.likes || 0,
      followers: userStats?.followers || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}