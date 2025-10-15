// import { cookies } from 'next/headers';
// import ClientPostsList from '../components/ClientPostsList';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// // Dummy data fallback (exact match to original)
// const dummyPosts = [
//   {
//     _id: "1",
//     title: "Optimizing React Performance: Core Web Vitals Deep Dive",
//     excerpt: "Learn how to improve your React application's Core Web Vitals scores with practical optimization techniques including code splitting, lazy loading, and efficient rendering strategies.",
//     author: "Sarah Johnson",
//     date: "2025-10-10",
//     readTime: "8 min read",
//     category: "React",
//     tags: ["Performance", "React", "Web Vitals"],
//     image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
//     views: 2450
//   },
//   {
//     _id: "2",
//     title: "JavaScript Bundle Size Optimization in 2025",
//     excerpt: "Discover modern techniques to reduce JavaScript bundle sizes including tree shaking, dynamic imports, and understanding what really matters for your application's performance.",
//     author: "Michael Chen",
//     date: "2025-10-08",
//     readTime: "12 min read",
//     category: "JavaScript",
//     tags: ["Bundle Size", "Webpack", "Optimization"],
//     image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
//     views: 3120
//   },
//   {
//     _id: "3",
//     title: "Lighthouse CI: Automated Performance Testing",
//     excerpt: "Set up continuous performance monitoring with Lighthouse CI in your deployment pipeline. Catch performance regressions before they reach production.",
//     author: "Emily Rodriguez",
//     date: "2025-10-05",
//     readTime: "10 min read",
//     category: "DevOps",
//     tags: ["Lighthouse", "CI/CD", "Testing"],
//     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
//     views: 1890
//   },
//   {
//     _id: "4",
//     title: "Next.js App Router: Performance Best Practices",
//     excerpt: "Maximize the performance benefits of Next.js 14 App Router with server components, streaming, and intelligent data fetching patterns.",
//     author: "David Park",
//     date: "2025-10-03",
//     readTime: "15 min read",
//     category: "Next.js",
//     tags: ["Next.js", "Server Components", "SSR"],
//     image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=400&fit=crop",
//     views: 4230
//   },
//   {
//     _id: "5",
//     title: "Understanding Cumulative Layout Shift (CLS)",
//     excerpt: "Master CLS optimization with real-world examples and solutions. Learn how to prevent layout shifts that frustrate users and hurt your Core Web Vitals.",
//     author: "Jennifer Lee",
//     date: "2025-10-01",
//     readTime: "7 min read",
//     category: "Web Vitals",
//     tags: ["CLS", "UX", "Performance"],
//     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
//     views: 2780
//   },
//   {
//     _id: "6",
//     title: "Image Optimization: WebP, AVIF, and Beyond",
//     excerpt: "Modern image formats and optimization strategies that can reduce your page weight by 50% or more while maintaining visual quality.",
//     author: "Alex Kumar",
//     date: "2025-09-28",
//     readTime: "11 min read",
//     category: "Images",
//     tags: ["Images", "WebP", "Optimization"],
//     image: "https://images.unsplash.com/photo-1616499452844-59f5c2f47b8d?w=800&h=400&fit=crop",
//     views: 3450
//   },
//   {
//     _id: "7",
//     title: "First Input Delay (FID): Interactive Performance",
//     excerpt: "Improve user interaction responsiveness by understanding and optimizing FID. Learn about event handling, main thread blocking, and JavaScript execution timing.",
//     author: "Rachel Martinez",
//     date: "2025-09-25",
//     readTime: "9 min read",
//     category: "Web Vitals",
//     tags: ["FID", "Interactivity", "JavaScript"],
//     image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
//     views: 2150
//   },
//   {
//     _id: "8",
//     title: "Server-Side Rendering vs Static Generation",
//     excerpt: "Compare SSR and SSG performance characteristics. Learn when to use each approach for optimal performance in your Next.js applications.",
//     author: "Thomas Anderson",
//     date: "2025-09-22",
//     readTime: "13 min read",
//     category: "Next.js",
//     tags: ["SSR", "SSG", "Performance"],
//     image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
//     views: 3890
//   },
//   {
//     _id: "9",
//     title: "CSS Performance: Selector Efficiency and Critical CSS",
//     excerpt: "Optimize your CSS delivery and selector performance. Learn about critical CSS extraction and modern CSS loading strategies.",
//     author: "Lisa Wang",
//     date: "2025-09-20",
//     readTime: "8 min read",
//     category: "CSS",
//     tags: ["CSS", "Critical CSS", "Performance"],
//     image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=400&fit=crop",
//     views: 1670
//   }
// ];

// async function fetchPosts() {
//   // Use full URL to avoid parsing issues in server components
//   const baseUrl = process.env.VERCEL_URL 
//     ? `https://${process.env.VERCEL_URL}` 
//     : 'http://localhost:3000';
  
//   // Forward cookies for session (public fetches still work)
//   const cookieStore = cookies();
//   const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
//   const res = await fetch(`${baseUrl}/api/posts`, { 
//     cache: 'no-store',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(cookieHeader && { 'Cookie': cookieHeader }), // Only if cookies exist
//     },
//   });
  
//   if (!res.ok) {
//     console.error('Posts fetch failed:', res.status, await res.text()); // Debug: Log body
//     throw new Error('Failed to fetch posts');
//   }
  
//   const data = await res.json();
//   // Format date if from DB
//   return data.map(post => ({
//     ...post,
//     date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
//   }));
// }

// export default async function PostsPage() {
//   let posts = [];
//   let error = null;
//   try {
//     posts = await fetchPosts();
//   } catch (err) {
//     console.error('Posts fetch error:', err);
//     // Fallback to dummy data instead of error state
//     posts = dummyPosts;
//     error = null; // Hide the spinner; use dummy to display something
//     // Optional: You could add a banner like <div className="p-4 bg-yellow-900/50 text-center">Using demo data (API unavailable)</div>
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
//       <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
//       <ClientPostsList initialPosts={posts} error={error} />
//       <Footer />
//     </div>
//   );
// }

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
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
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