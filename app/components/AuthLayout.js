import Navbar from './Navbar';
// import Footer from './Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        {children}
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}