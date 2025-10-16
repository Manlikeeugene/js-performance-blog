'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlusCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTransition } from 'react';

const EditPostForm = ({ initialPost, userId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  // Form state from initial post
  const [formData, setFormData] = useState({
    title: initialPost.title || '',
    content: initialPost.content || '',
    excerpt: initialPost.excerpt || '',
    authorBio: initialPost.authorBio || '',
    readTime: initialPost.readTime || '',
    category: initialPost.category || 'Performance',
    tags: initialPost.tags ? initialPost.tags.join(', ') : '',
    image: initialPost.image || '',
    status: initialPost.status || 'draft'
  });
  const [imagePreview, setImagePreview] = useState(initialPost.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialPost) {
      setFormData({
        title: initialPost.title || '',
        content: initialPost.content || '',
        excerpt: initialPost.excerpt || '',
        authorBio: initialPost.authorBio || '',
        readTime: initialPost.readTime || '',
        category: initialPost.category || 'Performance',
        tags: initialPost.tags ? initialPost.tags.join(', ') : '',
        image: initialPost.image || '',
        status: initialPost.status || 'draft'
      });
      setImagePreview(initialPost.image || '');
    }
  }, [initialPost]);

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

      const baseUrl = process.env.NEXTAUTH_URL
      const response = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: formData });

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
    try {
      const baseUrl = process.env.NEXTAUTH_URL
      const response = await fetch(`${baseUrl}/api/posts/${initialPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          author: userId,
          authorBio: formData.authorBio || session.user.bio || 'Content Creator'
        })
      });

      const data = await response.json();
      if (response.ok) {
        startTransition(() => {
          router.push('/dashboard'); // Redirect to dashboard posts
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

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Post Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500"
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
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Author Bio & Read Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Author Bio</label>
            <input
              type="text"
              value={formData.authorBio}
              onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Content * (Markdown supported)</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="20"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500 resize-none font-mono text-sm"
          />
          <p className="text-xs text-slate-400 mt-2">Supports Markdown: headers, lists, code blocks, etc.</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 cursor-pointer">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400">{uploadingImage ? 'Uploading...' : 'Update Image'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
            </label>
            {imagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-slate-700">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400">Max 5MB. Current: {formData.image ? 'Uploaded' : 'None'}</p>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500"
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
              placeholder="Performance, React, Web Vitals"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-2">Comma-separated</p>
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
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={updating || uploadingImage}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium transition disabled:opacity-50"
          >
            {updating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            {updating ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default EditPostForm;