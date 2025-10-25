

'use client';

import React from 'react';
import { Clock, User, TrendingUp, ArrowRight, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CustomLink from './CustomLink';

export default function PostCard({ post, isAdmin = false, onEdit, onDelete }) {
  return (
    <article className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition shadow-lg hover:shadow-emerald-500/10" role="article">
      {post.image && (
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority={false} // Set true if this is above-fold hero
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{post.views?.toLocaleString()}</span>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-3 text-slate-100 group-hover:text-emerald-400 transition line-clamp-2 break-words">
          {post.title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 break-words">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-slate-900/50 text-slate-300 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-700/50 gap-2 sm:gap-0 mb-2 sm:mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">{post.author}</span>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {isAdmin && (
          <div 
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 flex justify-end md:justify-end gap-1 mb-3 md:mb-4"
            role="group"
            aria-label="Post actions"
          >
            <div className="flex gap-1 bg-black/50 rounded-full p-1 w-full md:w-auto">
              <button
                onClick={() => onEdit(post._id)}
                className="flex-1 md:flex-none p-2 md:p-1 text-emerald-400 hover:text-emerald-300 active:scale-95 rounded-full hover:bg-white/10 transition-all md:hover:bg-white/10"
                title="Edit"
                aria-label="Edit post"
              >
                <Edit className="w-4 h-4 mx-auto md:mx-0" />
              </button>
              <button
                onClick={() => onDelete(post._id)}
                className="flex-1 md:flex-none p-2 md:p-1 text-red-400 hover:text-red-300 active:scale-95 rounded-full hover:bg-white/10 transition-all md:hover:bg-white/10"
                title="Delete"
                aria-label="Delete post"
              >
                <Trash2 className="w-4 h-4 mx-auto md:mx-0" />
              </button>
            </div>
          </div>
        )}

        <CustomLink href={`/posts/${post._id}`}>
          <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 rounded-lg transition group/btn text-xs sm:text-sm">
            <span className="font-medium">Read Article</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
          </button>
        </CustomLink>
      </div>
    </article>
  );
}