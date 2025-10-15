
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StatsGrid from './components/StatsGrid';
import LoadingSpinner from './components/LoadingSpinner';
import CustomLink from './components/CustomLink';
import { ArrowRight, Zap, TrendingUp, Users, BookOpen, Github, Menu, X, Code, Activity, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (status === 'loading') return <LoadingSpinner />;

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance Insights",
      description: "Deep dive into Core Web Vitals, LCP, FID, CLS, and TTFB metrics with real-world examples"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-Time Monitoring",
      description: "Track and analyze performance with integrated Lighthouse and WebPageTest tools"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert Content",
      description: "In-depth articles on JavaScript optimization, bundle sizes, and loading strategies"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Share insights, collaborate on posts, and learn from developer experiences"
    }
  ];

  const metrics = [
    { value: '150+', label: 'Performance Articles', color: 'emerald', icon: BookOpen, change: '+20%' },
    { value: '<100ms', label: 'Time to Interactive', color: 'cyan', icon: TrendingUp, change: '-15%' },
    { value: '99', label: 'Lighthouse Score', color: 'blue', icon: Zap, change: '+5' },
    { value: '5K+', label: 'Active Readers', color: 'purple', icon: Users, change: '+30%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-35 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Master JavaScript
              <br />
              <span className="text-5xl sm:text-7xl lg:text-8xl">Performance</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Unlock lightning-fast web experiences. Deep dives into Core Web Vitals, optimization techniques, and real-world case studies for modern developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CustomLink href="/posts" className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-2xl font-semibold shadow-2xl shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                <span>Explore Articles</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              </CustomLink>
              {status !== 'loading' && (
                <CustomLink href={session ? '/dashboard' : '/auth/signup'} className="px-8 py-4 border-2 border-slate-700 hover:border-emerald-500 rounded-2xl font-semibold transition-colors">
                  {session ? 'My Dashboard' : 'Get Started'}
                </CustomLink>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StatsGrid stats={metrics} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose JS Performance?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to build faster, more efficient web applications</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition">
                <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powered By Modern Tech</h2>
            <p className="text-xl text-slate-400">Built with the latest tools for optimal performance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-400">Frontend</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Next.js 14 App Router
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  React 18 with Server Components
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  Tailwind CSS with Typography
                </li>
              </ul>
            </div>
            
            <div className="p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-400">Content</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  React Markdown for Posts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  Syntax Highlighting
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  Image Optimization
                </li>
              </ul>
            </div>
            
            <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-400">Performance</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Core Web Vitals Tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Lighthouse CI Integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  WebPageTest Automation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl border border-emerald-500/30 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to Level Up?</h2>
              <p className="text-slate-300 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of developers mastering web performance optimization
              </p>
              {status !== 'loading' && (
                <CustomLink href={session ? '/dashboard' : '/auth/signup'} className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl transition font-medium shadow-2xl shadow-emerald-500/30 text-base sm:text-lg group">
                  {session ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </CustomLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}