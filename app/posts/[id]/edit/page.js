import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import EditPostForm from '../../../components/EditPostForm';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

async function fetchPost(id, cookieHeader) {
  const baseUrl = process.env.NEXTAUTH_URL
  
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { 
    cache: 'no-store',
    headers: { 
      'Content-Type': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader }),
    },
  });
  
  if (!res.ok) {
    console.error('Edit fetch failed:', res.status);
    throw new Error('Post not found');
  }
  
  const post = await res.json();
  // Flatten author if needed
  if (post.author && typeof post.author === 'object') {
    post.author = post.author.name || 'Unknown';
  }
  // Format date
  post.date = post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date;
  return post;
}

export default async function EditPostPage({ params }) {
  const { id } = await params; // Await for async resolution in Next.js 15

  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  let post = null;
  try {
    // Await cookies for session forward
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    
    post = await fetchPost(id, cookieHeader);
    
    // Owner check (use author ID from post; assume API sends authorId or use post.author_id if flattened)
    if (post.author_id !== session.user.id) { // Adjust if your API flattens to author_id
      redirect('/dashboard');
    }
  } catch (err) {
    console.error('Edit post fetch error:', err);
    redirect('/dashboard'); // Or 404 page
  }

  if (!post) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      <EditPostForm initialPost={post} userId={session.user.id} />
      <Footer />
    </div>
  );
}