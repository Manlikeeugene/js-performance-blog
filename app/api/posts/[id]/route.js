// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import { auth } from '@/auth';
// // Dynamic models
// let getPostModel, getUserModel;

// export async function GET(request, context) {
//   const { params } = await context; // Await context for params in Next.js 15
//   const { id } = await params;

//   try {
//     await connectDB();

//     // Load User model early for populate
//     if (!getUserModel) {
//       const userMod = await import('@/models/User');
//       getUserModel = userMod.default;
//     }
//     getUserModel(); // Register schema

//     if (!getPostModel) {
//       const mod = await import('@/models/Post');
//       getPostModel = mod.default;
//     }
//     const Post = getPostModel();

//     let post = await Post.findById(id)
//       .populate('author', 'name image bio') // For full post view
//       .lean();

//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     // Public: Allow if published; else require auth + ownership
//     if (post.status !== 'published') {
//       const session = await auth();
//       if (!session?.user || post.author._id.toString() !== session.user.id) {
//         return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
//       }
//     }

//     // Save author_id before flattening
//     const authorId = post.author?._id?.toString() || '';
//     // Flatten author to string (for React safety)
//     post.author = post.author?.name || 'Unknown';
//     post.author_id = authorId; // Now safe
//     // Format date
//     post.date = post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date;
//     // Ensure content is string
//     post.content = post.content || '';

//     // Simulate delay
//     await new Promise(resolve => setTimeout(resolve, 300));

//     return NextResponse.json(post);
//   } catch (error) {
//     console.error('Error fetching post:', error);
//     return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
//   }
// }

// export async function DELETE(request, { params }) {
//   const { id } = await params; // Await for consistency

//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     if (!getPostModel) {
//       const mod = await import('@/models/Post');
//       getPostModel = mod.default;
//     }
//     if (!getUserModel) {
//       const userMod = await import('@/models/User');
//       getUserModel = userMod.default;
//     }
//     const Post = getPostModel();
//     const User = getUserModel();

//     const post = await Post.findById(id);

//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     if (post.author.toString() !== session.user.id) {
//       return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
//     }

//     // Remove from user's posts array
//     const user = await User.findById(session.user.id);
//     user.posts = user.posts.filter(p => p.toString() !== id);
//     await user.save();

//     await Post.findByIdAndDelete(id);

//     return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   const { id } = await params; // Await for consistency

//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { title, content, excerpt, image, category, tags = [], status, readTime, authorBio } = body;

//     // Validation
//     if (!title || !content || !excerpt || !category) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     await connectDB();

//     if (!getPostModel) {
//       const mod = await import('@/models/Post');
//       getPostModel = mod.default;
//     }
//     const Post = getPostModel();

//     const post = await Post.findById(id);

//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     if (post.author.toString() !== session.user.id) {
//       return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
//     }

//     // Update fields
//     post.title = title;
//     post.content = content;
//     post.excerpt = excerpt;
//     post.image = image || post.image;
//     post.category = category;
//     post.tags = tags;
//     post.status = status || post.status;
//     post.readTime = readTime || post.readTime;
//     post.authorBio = authorBio || post.authorBio;

//     await post.save();

//     // Populate for return
//     await post.populate('author', 'name image bio');
//     const authorId = post.author?._id?.toString() || '';
//     post.author = post.author?.name || 'Unknown';
//     post.author_id = authorId;
//     post.date = new Date(post.updatedAt).toISOString().split('T')[0];

//     return NextResponse.json({ message: 'Post updated successfully', post }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating post:', error);
//     return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
//   }
// }










import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';

let getPostModel, getUserModel, getStatsModel;

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();

    // Load User model for populate
    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    getUserModel();

    if (!getPostModel) {
      const mod = await import('@/models/Post');
      getPostModel = mod.default;
    }
    const Post = getPostModel();

    let post = await Post.findById(id)
      .populate('author', 'name image bio')
      .lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Public: Allow if published; else require auth + ownership
    if (post.status !== 'published') {
      const session = await auth();
      if (!session?.user || post.author._id.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }
    }

    // Save author_id before flattening
    const authorId = post.author?._id?.toString() || '';
    // Flatten author
    post.author = post.author?.name || 'Unknown';
    post.author_id = authorId;
    // Format date
    post.date = post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date;
    // Ensure content is string
    post.content = post.content || '';

    // Simulate delay (remove in prod)
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (!getPostModel) {
      const mod = await import('@/models/Post');
      getPostModel = mod.default;
    }
    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    if (!getStatsModel) {
      const statsMod = await import('@/models/Stats');
      getStatsModel = statsMod.default;
    }
    const Post = getPostModel();
    const User = getUserModel();
    const Stats = getStatsModel();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Delete post stats
    await Stats.deleteOne({ entityType: 'post', entityId: id });

    // Update user stats (decrement posts)
    await Stats.findOneAndUpdate(
      { entityType: 'user', entityId: session.user.id },
      { $inc: { posts: -1 }, $set: { updatedAt: new Date() } }
    );

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}


// export async function DELETE(request, { params }) {
//   const { id } = await params();  // Note: params() returns a Promise in some Next.js versions—unwrap it.

//   try {
//     const session = await auth();
//     if (!session?.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     // Declare variables first
//     let getPostModel;
//     let getUserModel;
//     let getStatsModel;

//     if (!getPostModel) {
//       const mod = await import('@/models/Post');
//       getPostModel = mod.default;
//     }
//     if (!getUserModel) {
//       const userMod = await import('@/models/User');
//       getUserModel = userMod.default;
//     }
//     if (!getStatsModel) {
//       const statsMod = await import('@/models/Stats');
//       getStatsModel = statsMod.default;
//     }
//     const Post = getPostModel();
//     const User = getUserModel();
//     const Stats = getStatsModel();

//     const post = await Post.findById(id);

//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }

//     if (post.author.toString() !== session.user.id) {
//       return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
//     }

//     // Delete post stats
//     await Stats.deleteOne({ entityType: 'post', entityId: id });

//     // Update user stats (decrement posts)
//     await Stats.findOneAndUpdate(
//       { entityType: 'user', entityId: session.user.id },
//       { $inc: { posts: -1 }, $set: { updatedAt: new Date() } }
//     );

//     await Post.findByIdAndDelete(id);

//     return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
//   }
// }

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, image, category, tags = [], status, readTime, authorBio } = body;

    // Validation
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    if (!getPostModel) {
      const mod = await import('@/models/Post');
      getPostModel = mod.default;
    }
    const Post = getPostModel();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Calculate readTime if content changed
    let finalReadTime = readTime;
    if (content && !readTime) {
      const words = content.split(/\s+/).length;
      finalReadTime = `${Math.max(1, Math.round(words / 200))} min read`;
    }

    // Update fields
    post.title = title;
    post.content = content;
    post.excerpt = excerpt;
    post.image = image || post.image;
    post.category = category;
    post.tags = tags;
    post.status = status || post.status;
    post.readTime = finalReadTime || post.readTime;
    post.authorBio = authorBio || post.authorBio;
    post.updatedAt = new Date();

    await post.save();

    // Populate for return
    await post.populate('author', 'name image bio');
    const updatedPost = {
      ...post.toObject(),
      author: post.author?.name || 'Unknown',
      author_id: post.author?._id?.toString() || '',
      date: new Date(post.updatedAt).toISOString().split('T')[0]
    };

    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}