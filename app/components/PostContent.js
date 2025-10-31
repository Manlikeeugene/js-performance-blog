import React from 'react';

export default function PostContent({ content }) {
  return (
    <div 
      className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-h2:text-2xl prose-h3:text-xl prose-code:bg-slate-800/50 prose-pre:bg-slate-800/50 prose-a:text-emerald-400"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}