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
let getPostModel;

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

    // Also increment views on the Post document (best-effort; don't fail the whole request if this errors)
    let updatedPost = null;
    try {
      if (!getPostModel) {
        const postMod = await import('@/models/Post');
        getPostModel = postMod.default;
      }
      const Post = getPostModel();
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { views: 1 } },
        { new: true }
      );
    } catch (postErr) {
      console.error('Error updating post views:', postErr);
      // continue — we still return the stats views
    }

    // Also increment the author's user-level stats.views so dashboard reflects total views
    try {
      if (updatedPost && updatedPost.author) {
        await Stats.findOneAndUpdate(
          { entityType: 'user', entityId: updatedPost.author },
          { $inc: { views: 1 }, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (userStatsErr) {
      console.error('Error updating user stats views:', userStatsErr);
      // best-effort: don't fail the request
    }

    return NextResponse.json({ views: updatedStat.views, postViews: updatedPost ? updatedPost.views : null }, { status: 200 });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view', details: error.message }, { status: 500 });
  }
}