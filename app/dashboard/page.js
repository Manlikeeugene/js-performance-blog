// import { redirect } from 'next/navigation';
// import { auth } from '@/auth';
// import { cookies } from 'next/headers';
// import Dashboard from '../components/Dashboard';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// async function fetchUserPosts(userId) {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

// const baseUrl = process.env.NEXTAUTH_URL
  
//   const res = await fetch(`${baseUrl}/api/posts?userId=${userId}`, { 
//     cache: 'no-store',
//     headers: { 
//       'Content-Type': 'application/json',
//       ...(cookieHeader && { 'Cookie': cookieHeader })
//     },
//   });
  
//   if (!res.ok) {
//     console.error('API response status:', res.status);
//     throw new Error('Failed to fetch user posts');
//   }
//   return res.json();
// }

// export default async function DashboardPage({ searchParams }) {
//   const session = await auth();
//   if (!session?.user) {
//     redirect('/login');
//   }

//   let initialPosts = [];
//   try {
//     initialPosts = await fetchUserPosts(session.user.id);
//   } catch (err) {
//     console.error('Fetch error:', err);
//     initialPosts = [];
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
//       <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
//       <Dashboard initialPosts={initialPosts} userId={session.user.id} isLoading={false} /> {/* Pass isLoading=false for server */}
//       <Footer />
//     </div>
//   );
// }





// app/dashboard/page.js
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default async function DashboardPage({ searchParams }) {
  let session;
  try {
    session = await auth();
    if (!session?.user) {
      console.log('DashboardPage: No session found, redirecting to /auth/login');
      redirect('/auth/login');
    }
  } catch (error) {
    console.error('DashboardPage: auth() error:', error);
    redirect('/auth/login');
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://js-performance-blog.vercel.app';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      <Dashboard initialPosts={[]} userId={session.user.id} baseUrl={baseUrl} />
      <Footer />
    </div>
  );
}