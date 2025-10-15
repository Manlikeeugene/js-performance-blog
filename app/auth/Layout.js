import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Navbar showPostsLink={false} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}