import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { auth } from '@/auth';
// Dynamic imports for models
let getPostModel, getUserModel;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectDB();

    // Load User model early for populate registration
    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    getUserModel(); // Call to register schema

    if (!getPostModel) {
      const mod = await import('@/models/Post');
      getPostModel = mod.default;
    }
    const Post = getPostModel();

    let posts;
    if (userId) {
      // User-specific: Require auth
      const session = await auth();
      if (!session?.user || userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      posts = await Post.find({ author: userId })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .lean();

      // Flatten author to string
      posts = posts.map(post => ({
        ...post,
        author: post.author?.name || 'Unknown',
        author_id: post.author?._id || userId // Add for owner checks
      }));
    } else {
      // Public: No auth needed, only published
      posts = await Post.find({ status: 'published' })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .lean();

      // Flatten author to string
      posts = posts.map(post => ({
        ...post,
        author: post.author?.name || 'Unknown',
        author_id: post.author?._id // Add for consistency
      }));
    }

    // Simulate delay for realism (remove in prod)
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, image, category, tags = [], readTime, authorBio } = body;

    // Validation
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json({ error: 'Missing required fields: title, content, excerpt, category' }, { status: 400 });
    }

    if (title.length < 5 || content.length < 50) {
      return NextResponse.json({ error: 'Title must be at least 5 chars, content at least 50 chars' }, { status: 400 });
    }

    await connectDB();

    // Dynamic models
    if (!getPostModel) {
      const postMod = await import('@/models/Post');
      getPostModel = postMod.default;
    }
    if (!getUserModel) {
      const userMod = await import('@/models/User');
      getUserModel = userMod.default;
    }
    const Post = getPostModel();
    const User = getUserModel();

    // Get user and ensure exists
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate readTime if not provided
    let finalReadTime = readTime;
    if (!finalReadTime) {
      const words = content.split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      finalReadTime = `${minutes} min read`;
    }

    // Create post
    const newPost = await Post.create({
      title,
      content,
      excerpt,
      image: image || '',
      category,
      tags,
      author: user._id,
      status: 'published', // Default to draft
      views: 0,
      likes: 0,
      readTime: finalReadTime,
      authorBio: authorBio || user.bio || ''
    });

    // Add to user's posts array
    user.posts.push(newPost._id);
    await user.save();

    // Populate for return
    await newPost.populate('author', 'name image');

    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}