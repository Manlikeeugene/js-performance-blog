import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            <span className="font-semibold text-base sm:text-lg">JS Performance Blog</span>
          </div>
          <div className="text-slate-400 text-xs sm:text-sm text-center">
            © 2025 JS Performance Blog. Built with Next.js & Optimized for Speed.
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link href="#" className="text-slate-400 hover:text-emerald-400 transition">Terms</Link>
            <Link href="#" className="text-slate-400 hover:text-emerald-400 transition">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-emerald-400 transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}