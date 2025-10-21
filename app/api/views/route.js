// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';

// let getStatsModel;

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { postId } = body;
//     if (!postId) {
//       return NextResponse.json({ error: 'postId is required' }, { status: 400 });
//     }

//     await connectDB();

//     if (!getStatsModel) {
//       const statsMod = await import('@/models/Stats');
//       getStatsModel = statsMod.default;
//     }
//     const Stats = getStatsModel();

//     await Stats.findOneAndUpdate(
//       { entityType: 'post', entityId: postId },
//       { $inc: { views: 1 }, $set: { updatedAt: new Date() } },
//       { upsert: true }
//     );

//     return NextResponse.json({}, { status: 204 });
//   } catch (error) {
//     console.error('Error tracking view:', error);
//     return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

let getStatsModel;

export async function POST(request) {
  try {
    const body = await request.json();
    const { postId } = body;
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    await connectDB();

    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Stats = getStatsModel();

    const updatedStat = await Stats.findOneAndUpdate(
      { entityType: 'post', entityId: postId },
      { $inc: { views: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true, new: true } // Return the updated document
    );

    return NextResponse.json({ views: updatedStat.views }, { status: 200 });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view', details: error.message }, { status: 500 });
  }
}