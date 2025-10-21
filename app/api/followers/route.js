import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

let getUserModel;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'followers' or 'following'

    if (!userId || !['followers', 'following'].includes(type)) {
      return NextResponse.json({ error: 'userId and type (followers/following) are required' }, { status: 400 });
    }

    await connectDB();

    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    const User = getUserModel();

    const user = await User.findById(userId)
      .populate(type, 'name image')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formattedUsers = user[type].map(u => ({
      ...u,
      id: u._id.toString(),
      name: u.name || 'Unknown',
    }));

    return NextResponse.json(formattedUsers || []);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 });
  }
}