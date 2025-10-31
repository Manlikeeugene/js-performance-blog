import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardPage({ searchParams }) {
  // No auth() call here—handle in client component
  // const baseUrl = process.env.NEXTAUTH_URL || 'https://js-performance-blog.vercel.app';

  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    // Log or throw in dev; on prod, fallback gracefully
    console.error('NEXTAUTH_URL missing—check env vars');
    const baseUrl = new URL(req.url).origin; // Dynamic fallback if needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      <Dashboard initialPosts={[]} baseUrl={baseUrl} /> {/* Remove userId prop */}
      <Footer />
    </div>
  );
}