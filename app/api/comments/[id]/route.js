import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getCommentModel, getStatsModel;

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await comment.deleteOne();
    await Stats.findOneAndUpdate(
      { entityType: 'post', entityId: comment.post },
      { $inc: { comments: -1 }, $set: { updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}