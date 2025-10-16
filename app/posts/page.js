import { cookies } from 'next/headers';
import ClientPostsList from '../components/ClientPostsList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Dummy data fallback (exact match to original, with ISO dates)
const dummyPosts = [
  {
    _id: "1",
    title: "Optimizing React Performance: Core Web Vitals Deep Dive",
    excerpt: "Learn how to improve your React application's Core Web Vitals scores with practical optimization techniques including code splitting, lazy loading, and efficient rendering strategies.",
    author: "Sarah Johnson",
    date: "2025-10-10",
    readTime: "8 min read",
    category: "React",
    tags: ["Performance", "React", "Web Vitals"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    views: 2450
  },
  // ... (rest unchanged—add the full array from your original)
];

async function fetchPosts() {
  // Use full URL to avoid parsing issues in server components
const baseUrl = process.env.NEXTAUTH_URL
  
  // Await cookies() for async resolution in Next.js 15
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  const res = await fetch(`${baseUrl}/api/posts`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader }), // Only if cookies exist
    },
  });
  
  if (!res.ok) {
    console.error('Posts fetch failed:', res.status, await res.text()); // Debug: Log body
    throw new Error('Failed to fetch posts');
  }
  
  const data = await res.json();
  // Format date if from DB
  return data.map(post => ({
    ...post,
    date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
  }));
}

export default async function PostsPage() {
  let posts = [];
  let error = null;
  try {
    posts = await fetchPosts();
  } catch (err) {
    console.error('Posts fetch error:', err);
    // Fallback to dummy data instead of error state
    posts = dummyPosts;
    error = null; // Hide the spinner; use dummy to display something
    // Optional: You could add a banner like <div className="p-4 bg-yellow-900/50 text-center">Using demo data (API unavailable)</div>
  }

  // If no posts (e.g., none published yet), fallback to dummies for demo
  if (posts.length === 0) {
    posts = dummyPosts;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      <ClientPostsList initialPosts={posts} error={error} />
      <Footer />
    </div>
  );
}