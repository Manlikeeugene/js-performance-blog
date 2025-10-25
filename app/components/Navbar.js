
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowRight, Zap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import CustomLink from './CustomLink';

export default function Navbar({ showPostsLink = true, showFeatures = true, showTech = true }) {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavButton = () => {
    if (status === 'loading') {
      return (
        <div className="px-5 py-2.5 bg-slate-800 rounded-lg">
          <div className="w-20 h-6 bg-slate-700 rounded animate-pulse" />
        </div>
      );
    }

    if (session) {
      return (
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold">
            {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="hidden md:block text-sm font-medium">{session.user?.name || 'User'}</span>
        </Link>
      );
    }

    return (
      <CustomLink href="/auth/login">
        <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg transition font-medium shadow-lg shadow-emerald-500/25">
          Sign In
        </button>
      </CustomLink>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30"></div>
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 relative" />
            </div>
            <CustomLink href="/" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              JS Performance
            </CustomLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {showFeatures && <a href="#features" className="text-slate-300 hover:text-emerald-400 transition font-medium">Features</a>}
            {showPostsLink && <CustomLink href="/posts" className="text-slate-300 hover:text-emerald-400 transition font-medium">Posts</CustomLink>}
            {showTech && <a href="#tech" className="text-slate-300 hover:text-emerald-400 transition font-medium">Tech</a>}
            {renderNavButton()}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-emerald-400 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-950/95 border-t border-slate-800 p-4 space-y-4">
            {showFeatures && <a href="#features" className="block py-2 text-slate-300 hover:text-emerald-400">Features</a>}
            {showPostsLink && <CustomLink href="/posts" className="block py-2 text-slate-300 hover:text-emerald-400">Posts</CustomLink>}
            {showTech && <a href="#tech" className="block py-2 text-slate-300 hover:text-emerald-400">Tech</a>}
            {renderNavButton()}
          </div>
        )}
      </div>
    </nav>
  );
}