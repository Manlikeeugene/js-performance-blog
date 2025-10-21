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
];

export default function PostsPage() {
  // Pass baseUrl as a prop to ClientPostsList
  const baseUrl = process.env.NEXTAUTH_URL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={false} showFeatures={false} showTech={false} />
      <ClientPostsList initialPosts={dummyPosts} baseUrl={baseUrl} />
      <Footer />
    </div>
  );
}