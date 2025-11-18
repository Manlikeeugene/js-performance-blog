import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Upload, X,
  Bold, Italic, List, ListOrdered, Code, Quote, Eye, Edit3
} from 'lucide-react';

export default function CreateTab({
  newPost,
  setNewPost,
  onCreate,
  creating,
  imagePreview,
  setImagePreview,
  onImageUpload,
  uploadingImage,
  editorRef,
  editorHtml,
  setEditorHtml,
  formatHandlers,
  htmlToMarkdown,
}) {
  const [viewMode, setViewMode] = useState('split');

  // Sync editor content when switching views
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== editorHtml) {
      editorRef.current.innerHTML = editorHtml;
    }
  }, [viewMode]);

  const handleEditorInput = (e) => {
    const html = e.currentTarget.innerHTML;
    setEditorHtml(html);
    
    if (htmlToMarkdown) {
      const markdown = htmlToMarkdown(html);
      setNewPost(prev => ({ ...prev, content: markdown }));
    }
  };

  // Convert HTML to styled markdown preview
  const htmlToMarkdownPreview = (html) => {
    if (!html || html.trim() === '') {
      return '<p class="text-slate-500 italic">Start typing to see preview...</p>';
    }

    let preview = html;
    
    // Convert HTML tags to styled markdown-like display
    preview = preview.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h1 class="text-3xl font-bold text-emerald-400 mt-10 mb-5 border-b border-slate-800 pb-4">$1</h1>');
    preview = preview.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2 class="text-2xl font-bold text-emerald-400 mt-8 mb-4 border-b border-slate-800 pb-4">$1</h2>');
    preview = preview.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3 class="text-xl font-bold text-cyan-400 mt-6 mb-3">$1</h3>');
    preview = preview.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
    
    preview = preview.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<strong class="font-bold text-white">$1</strong>');
    preview = preview.replace(/<b[^>]*>(.*?)<\/b>/gi, '<strong class="font-bold text-white">$1</strong>');
    preview = preview.replace(/<em[^>]*>(.*?)<\/em>/gi, '<em class="italic text-slate-200">$1</em>');
    preview = preview.replace(/<i[^>]*>(.*?)<\/i>/gi, '<em class="italic text-slate-200">$1</em>');
    
    preview = preview.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '<blockquote class="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg my-4">$1</blockquote>');
    
    preview = preview.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '<pre class="bg-slate-900/80 border border-slate-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-300">$1</code></pre>');
    preview = preview.replace(/<code[^>]*>(.*?)<\/code>/gi, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm">$1</code>');
    
    preview = preview.replace(/<ul[^>]*>/gi, '<ul class="my-4 list-disc list-inside marker:text-emerald-400 text-slate-300 space-y-2">');
    preview = preview.replace(/<ol[^>]*>/gi, '<ol class="my-4 list-decimal list-inside marker:text-emerald-400 text-slate-300 space-y-2">');
    preview = preview.replace(/<li[^>]*>(.*?)<\/li>/gi, '<li class="text-slate-300">$1</li>');
    
    preview = preview.replace(/<p[^>]*>(.*?)<\/p>/gi, '<p class="text-slate-300 leading-relaxed mb-4">$1</p>');
    
    preview = preview.replace(/<a([^>]*)href="([^"]*)"([^>]*)>(.*?)<\/a>/gi, '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline">$4</a>');
    
    preview = preview.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, '<img src="$2" class="max-w-full rounded-lg my-4 border border-slate-700" />');
    
    return preview;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (htmlToMarkdown && editorHtml) {
      const markdown = htmlToMarkdown(editorHtml);
      setNewPost(prev => ({ ...prev, content: markdown }));
    }
    
    setTimeout(() => {
      onCreate(e);
    }, 0);
  };

  const handleClearAll = () => {
    setNewPost({
      title: '', 
      content: '', 
      excerpt: '', 
      authorBio: '', 
      readTime: '',
      category: 'Performance', 
      tags: '', 
      image: ''
    });
    setImagePreview('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setEditorHtml('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          Create New Post
        </h3>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Post Title *</label>
            <input
              type="text"
              required
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="e.g., Optimizing React Performance"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt *</label>
            <textarea
              required
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              placeholder="Brief description..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
            <input
              type="text"
              value={newPost.readTime}
              onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
              placeholder="e.g., 8 min read"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Content Editor */}
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
              {/* Editor - Always render but hide when not needed */}
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

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
            <div className="space-y-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 transition cursor-pointer">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-400">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onImageUpload} 
                  disabled={uploadingImage} 
                  className="hidden" 
                />
              </label>

              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-slate-700">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewPost(prev => ({ ...prev, image: '' }));
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
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
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option>Performance</option>
                <option>React</option>
                <option>Optimization</option>
                <option>Best Practices</option>
                <option>Tutorials</option>
                <option>News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <input
                type="text"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="react, performance, web-vitals"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={creating || uploadingImage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium transition disabled:opacity-50"
            >
              {creating ? 'Publishing...' : (
                <>
                  <Upload className="w-5 h-5" /> 
                  Publish Post
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-content:empty:before {
          content: "Start writing your post...";
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
}