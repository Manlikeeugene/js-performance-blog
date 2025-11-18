'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  PlusCircle, Upload, X, 
  Bold, Italic, List, ListOrdered, Code, Quote, Eye, Edit3
} from 'lucide-react';
import { useTransition } from 'react';
import LoadingSpinner from './LoadingSpinner';

const EditPostForm = ({ id, userId, baseUrl }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // WYSIWYG Editor State
  const editorRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState('');
  const [viewMode, setViewMode] = useState('split');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    authorBio: '',
    readTime: '',
    category: 'Performance',
    tags: '',
    image: '',
    status: 'draft',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updating, setUpdating] = useState(false);

  // HTML to Markdown converter
  const htmlToMarkdown = (html) => {
    let md = html;
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
    md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');
    md = md.replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img[^>]*src="(.*?)"[^>]*>/gi, '![]($1)');
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
    md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '\n```\n$1\n```\n');
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match) => {
      return match.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    });
    md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match) => {
      let i = 1;
      return match.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${i++}. $1\n`);
    });
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<[^>]+>/g, '');
    md = md.replace(/\n{3,}/g, '\n\n');
    return md.trim();
  };

  // Markdown to HTML converter (for initializing editor)
  const markdownToHtml = (markdown) => {
    let html = markdown;
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[h|u|o|p|b|l]/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');
    return html;
  };

  // WYSIWYG format handlers
  const formatHandlers = {
    bold: () => { document.execCommand('bold', false); editorRef.current?.focus(); },
    italic: () => { document.execCommand('italic', false); editorRef.current?.focus(); },
    heading1: () => { document.execCommand('formatBlock', false, 'h1'); editorRef.current?.focus(); },
    heading2: () => { document.execCommand('formatBlock', false, 'h2'); editorRef.current?.focus(); },
    heading3: () => { document.execCommand('formatBlock', false, 'h3'); editorRef.current?.focus(); },
    bulletList: () => { document.execCommand('insertUnorderedList', false); editorRef.current?.focus(); },
    numberedList: () => { document.execCommand('insertOrderedList', false); editorRef.current?.focus(); },
    code: () => { document.execCommand('formatBlock', false, 'pre'); editorRef.current?.focus(); },
    quote: () => { document.execCommand('formatBlock', false, 'blockquote'); editorRef.current?.focus(); },
  };

  // Handle editor input
  const handleEditorInput = (e) => {
    const html = e.currentTarget.innerHTML;
    setEditorHtml(html);
    const markdown = htmlToMarkdown(html);
    setFormData(prev => ({ ...prev, content: markdown }));
  };

  // Convert HTML to styled markdown preview - MATCHES ClientPostView styling
  const htmlToMarkdownPreview = (html) => {
    if (!html || html.trim() === '') {
      return '<p class="text-slate-500 italic text-center py-8">Start typing to see preview...</p>';
    }

    let preview = html;
    
    // H2 - Main sections (matches ClientPostView)
    preview = preview.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2 class="text-2xl sm:text-3xl lg:text-4xl mt-16 mb-8 text-emerald-400 font-bold border-b border-slate-800 pb-4">$1</h2>');
    
    // H3 - Subsections (matches ClientPostView)
    preview = preview.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3 class="text-xl sm:text-2xl lg:text-3xl mt-12 mb-6 text-cyan-400 font-bold">$1</h3>');
    
    // H4 - Minor headings (matches ClientPostView)
    preview = preview.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '<h4 class="text-lg sm:text-xl mt-8 mb-4 font-bold">$1</h4>');
    
    // H1 - Title level (rarely used in content, but styled)
    preview = preview.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-emerald-400 leading-tight">$1</h1>');
    
    // Inline formatting
    preview = preview.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<strong class="font-bold">$1</strong>');
    preview = preview.replace(/<b[^>]*>(.*?)<\/b>/gi, '<strong class="font-bold">$1</strong>');
    preview = preview.replace(/<em[^>]*>(.*?)<\/em>/gi, '<em class="italic">$1</em>');
    preview = preview.replace(/<i[^>]*>(.*?)<\/i>/gi, '<em class="italic">$1</em>');
    
    // Blockquotes (matches ClientPostView)
    preview = preview.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '<blockquote class="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg mb-6">$1</blockquote>');
    
    // Code blocks (matches ClientPostView)
    preview = preview.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '<pre class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-lg overflow-x-auto"><code class="block text-sm sm:text-base text-slate-300">$1</code></pre>');
    
    // Inline code (matches ClientPostView)
    preview = preview.replace(/<code[^>]*>(.*?)<\/code>/gi, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm sm:text-base">$1</code>');
    
    // Lists (matches ClientPostView)
    preview = preview.replace(/<ul[^>]*>/gi, '<ul class="my-6 list-disc list-inside marker:text-emerald-400 text-slate-300">');
    preview = preview.replace(/<ol[^>]*>/gi, '<ol class="my-6 list-decimal list-inside marker:text-emerald-400 text-slate-300">');
    preview = preview.replace(/<li[^>]*>(.*?)<\/li>/gi, '<li class="text-slate-300 my-3">$1</li>');
    
    // Paragraphs (matches ClientPostView)
    preview = preview.replace(/<p[^>]*>(.*?)<\/p>/gi, '<p class="text-slate-300 leading-relaxed mb-6 text-base sm:text-lg">$1</p>');
    
    // Links (matches ClientPostView)
    preview = preview.replace(/<a([^>]*)href="([^"]*)"([^>]*)>(.*?)<\/a>/gi, '<a href="$2" class="text-emerald-400 no-underline hover:text-emerald-300 hover:underline">$4</a>');
    
    // Images
    preview = preview.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, '<img src="$2" class="max-w-full rounded-lg my-4" />');
    
    return preview;
  };

  // Sync editor content when switching views
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== editorHtml) {
      editorRef.current.innerHTML = editorHtml;
    }
  }, [viewMode]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Post fetch failed:', res.status, await res.text());
          throw new Error('Post not found');
        }

        const data = await res.json();
        const formattedPost = {
          ...data,
          author: typeof data.author === 'object' ? data.author.name || 'Unknown' : data.author,
          date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data.date,
        };

        // Owner check
        if (formattedPost.author_id !== userId) {
          startTransition(() => {
            router.push('/dashboard');
          });
          return;
        }

        setPost(formattedPost);
        setFormData({
          title: formattedPost.title || '',
          content: formattedPost.content || '',
          excerpt: formattedPost.excerpt || '',
          authorBio: formattedPost.authorBio || '',
          readTime: formattedPost.readTime || '',
          category: formattedPost.category || 'Performance',
          tags: formattedPost.tags ? formattedPost.tags.join(', ') : '',
          image: formattedPost.image || '',
          status: formattedPost.status || 'draft',
        });
        
        // Convert markdown content to HTML for editor
        const htmlContent = markdownToHtml(formattedPost.content || '');
        setEditorHtml(htmlContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
        }
        
        setImagePreview(formattedPost.image || '');
        setError('');
      } catch (err) {
        console.error('Edit post fetch error:', err);
        setError('Failed to load post.');
        startTransition(() => {
          router.push('/dashboard');
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, userId, baseUrl, router]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload`, { method: 'POST', body: formData });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        setImagePreview(data.url);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    
    // Ensure content is converted from HTML to Markdown
    const markdown = htmlToMarkdown(editorHtml);
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: markdown, // Use converted markdown
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          author: userId,
          authorBio: formData.authorBio || 'Content Creator',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        startTransition(() => {
          router.push('/dashboard');
        });
      } else {
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      setError('Error updating post');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner message="Loading post..." />
      </section>
    );
  }

  if (error && !post) {
    return (
      <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <LoadingSpinner message={error} />
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Post Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 transition"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt *</label>
          <textarea
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows="3"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 resize-none transition"
          />
        </div>

        {/* Author Bio & Read Time */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Author Bio</label>
            <input
              type="text"
              value={formData.authorBio}
              onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              placeholder="e.g., 5 min read"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* WYSIWYG Content Editor */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Content *
            </label>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700 w-fit">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded text-xs sm:text-sm transition ${
                  viewMode === 'split' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs sm:text-sm transition ${
                  viewMode === 'editor' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs sm:text-sm transition ${
                  viewMode === 'preview' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                Preview
              </button>
            </div>
          </div>

          {/* Toolbar */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-t-lg p-2 flex flex-wrap gap-1">
              <button 
                type="button" 
                onClick={formatHandlers.heading1} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Heading 1"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">H1</div>
              </button>
              <button 
                type="button" 
                onClick={formatHandlers.heading2} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Heading 2"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">H2</div>
              </button>
              <button 
                type="button" 
                onClick={formatHandlers.heading3} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Heading 3"
              >
                <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">H3</div>
              </button>
              <div className="w-px bg-slate-700 mx-1" />
              <button 
                type="button" 
                onClick={formatHandlers.bold} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={formatHandlers.italic} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px bg-slate-700 mx-1" />
              <button 
                type="button" 
                onClick={formatHandlers.bulletList} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={formatHandlers.numberedList} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Numbered List"
              >
                {/* <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-px bg-slate-700 mx-1" />
              <button 
                type="button" 
                onClick={formatHandlers.code} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Code Block"
              > */}
                <Code className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={formatHandlers.quote} 
                className="p-2 hover:bg-slate-800 rounded transition" 
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className={`grid gap-4 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Editor */}
            <div 
              className={`border border-slate-700 rounded-b-lg overflow-hidden bg-slate-900 ${
                viewMode === 'preview' ? 'hidden' : ''
              }`}
            >
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="w-full min-h-[400px] px-4 py-3 text-white focus:outline-none overflow-y-auto editor-content"
                suppressContentEditableWarning={true}
              />
            </div>

            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="border border-slate-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-800/50">
                <div className="bg-slate-900/80 border-b border-slate-700 px-4 py-2 text-xs text-slate-400 flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  Live Preview
                </div>
                <div className="min-h-[400px] px-4 py-3 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: htmlToMarkdownPreview(editorHtml) }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 cursor-pointer transition">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400">{uploadingImage ? 'Uploading...' : 'Update Image'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
            </label>
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-slate-700">
                <div className="relative w-full h-48 sm:h-64">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 transition"
            >
              <option value="Performance">Performance</option>
              <option value="React">React</option>
              <option value="Optimization">Optimization</option>
              <option value="Best Practices">Best Practices</option>
              <option value="Tutorials">Tutorials</option>
              <option value="News">News</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="react, performance, web-vitals"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 transition"
            />
            <p className="text-xs text-slate-400 mt-1">Comma-separated</p>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-300">Status:</label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="draft"
              checked={formData.status === 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="text-emerald-500"
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="published"
              checked={formData.status === 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="text-emerald-500"
            />
            <span>Published</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            disabled={updating || uploadingImage || isPending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium transition disabled:opacity-50"
          >
            {updating || isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            {updating || isPending ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => startTransition(() => router.push('/dashboard'))}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </form>

      <style jsx>{`
        .editor-content:empty:before {
          content: "Start editing your post...";
          color: #64748b;
          pointer-events: none;
        }
        
        .editor-content h1 { 
          font-size: 2em;
          font-weight: bold; 
          color: #10b981; 
          margin: 1em 0 0.5em;
          line-height: 1.2;
        }
        
        .editor-content h2 { 
          font-size: 1.5em; 
          font-weight: bold; 
          color: #10b981; 
          margin: 0.8em 0 0.4em;
          line-height: 1.3;
        }
        
        .editor-content h3 { 
          font-size: 1.25em; 
          font-weight: bold; 
          color: #06b6d4; 
          margin: 0.6em 0 0.3em;
          line-height: 1.4;
        }
        
        .editor-content strong { 
          font-weight: bold; 
        }
        
        .editor-content em { 
          font-style: italic; 
        }
        
        .editor-content blockquote { 
          border-left: 4px solid #10b981; 
          padding-left: 1em; 
          font-style: italic; 
          margin: 1em 0; 
          color: #cbd5e1; 
        }
        
        .editor-content ul, 
        .editor-content ol { 
          margin: 1em 0; 
          padding-left: 2em; 
        }
        
        .editor-content li { 
          margin: 0.25em 0; 
        }
        
        .editor-content pre { 
          background: #0f172a; 
          padding: 1em; 
          border-radius: 0.5em; 
          overflow-x: auto; 
          margin: 1em 0; 
          font-family: monospace;
        }
        
        .editor-content code { 
          background: #1e293b; 
          padding: 0.2em 0.4em; 
          border-radius: 0.25em; 
          font-size: 0.9em;
          font-family: monospace;
        }
        
        .editor-content p {
          margin: 0.5em 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default EditPostForm;