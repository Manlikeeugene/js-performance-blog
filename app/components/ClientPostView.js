'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Clock, User, Calendar, TrendingUp, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageCircle, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import CustomLink from './CustomLink';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

// Custom markdown processing functions (unchanged from your original)
const processInline = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 no-underline hover:text-emerald-300 hover:underline">$1</a>')
    .replace(/`(.*?)`/g, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm sm:text-base">$1</code>');
};

const extractHeadings = (content) => {
  const lines = content.split('\n');
  const headings = [];
  let index = 0;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      headings.push({
        id: `heading-${index++}`,
        text: trimmed.substring(3).trim(),
        level: 'h2',
      });
    } else if (trimmed.startsWith('### ')) {
      headings.push({
        id: `heading-${index++}`,
        text: trimmed.substring(4).trim(),
        level: 'h3',
      });
    } else if (trimmed.startsWith('#### ')) {
      headings.push({
        id: `heading-${index++}`,
        text: trimmed.substring(5).trim(),
        level: 'h4',
      });
    }
  });
  return headings;
};

const parseContent = (content) => {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let headingIndex = 0;
  while (i < lines.length) {
    let line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Headings (unchanged)
    if (line.startsWith('## ')) {
      const headingText = line.substring(3).trim();
      elements.push(
        <h2
          key={`h2-${elements.length}-${headingIndex}`}
          id={`heading-${headingIndex}`}
          className="text-2xl sm:text-3xl lg:text-4xl mt-16 mb-8 text-emerald-400 font-bold border-b border-slate-800 pb-4 scroll-mt-20"
        >
          {processInline(headingText)}
        </h2>
      );
      headingIndex++;
      i++;
      continue;
    } else if (line.startsWith('### ')) {
      const headingText = line.substring(4).trim();
      elements.push(
        <h3
          key={`h3-${elements.length}-${headingIndex}`}
          id={`heading-${headingIndex}`}
          className="text-xl sm:text-2xl lg:text-3xl mt-12 mb-6 text-cyan-400 font-bold scroll-mt-20"
        >
          {processInline(headingText)}
        </h3>
      );
      headingIndex++;
      i++;
      continue;
    } else if (line.startsWith('#### ')) {
      const headingText = line.substring(5).trim();
      elements.push(
        <h4
          key={`h4-${elements.length}-${headingIndex}`}
          id={`heading-${headingIndex}`}
          className="text-lg sm:text-xl mt-8 mb-4 font-bold scroll-mt-20"
        >
          {processInline(headingText)}
        </h4>
      );
      headingIndex++;
      i++;
      continue;
    } else if (line.startsWith('> ')) {
      // Blockquote
      let quoteLines = [line.substring(2).trim()];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().substring(2));
        i++;
      }
      let quoteText = quoteLines.join(' ').trim();
      quoteText = processInline(quoteText);
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          className="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg mb-6"
          dangerouslySetInnerHTML={{ __html: quoteText }}
        />
      );
      continue;
    } else if (line.startsWith('```')) {
      // Code block
      const langMatch = line.match(/```(\w+)?/);
      const lang = langMatch ? langMatch[1] : '';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      const code = codeLines.join('\n');
      elements.push(
        <pre
          key={`pre-${elements.length}`}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 relative shadow-lg overflow-x-auto group"
          style={{ position: 'relative' }}
        >
          <code className={`block text-sm sm:text-base ${lang ? `language-${lang}` : ''} text-slate-300`}>
            {code}
          </code>
        </pre>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Unordered list
      const listItems = [];
      let listKey = elements.length;
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        let liText = lines[i].trim().substring(2).trim();
        liText = processInline(liText);
        listItems.push(
          <li
            key={`${listKey}-li-${listItems.length}`}
            className="text-slate-300 my-3 flex items-start gap-2"
            dangerouslySetInnerHTML={{ __html: liText }}
          />
        );
        i++;
      }
      elements.push(<ul key={`${listKey}-ul`} className="my-6 list-disc list-inside marker:text-emerald-400 text-slate-300">{listItems}</ul>);
      continue;
    } else {
      // Paragraph
      let paraLines = [lines[i]];
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (nextLine === '' || nextLine.startsWith('#') || nextLine.startsWith('> ') || nextLine.startsWith('```') || nextLine.startsWith('- ') || nextLine.startsWith('* ')) {
          break;
        }
        paraLines.push(lines[i]);
        i++;
      }
      let paraText = paraLines.join(' ').trim();
      paraText = processInline(paraText);
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="text-slate-300 leading-relaxed mb-6 text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: paraText }}
        />
      );
    }
  }
  return elements;
};

export default function ClientPostView({ id, dummyPost, dummyRelatedPosts, baseUrl }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState(dummyPost);
  const [relatedPosts, setRelatedPosts] = useState(dummyRelatedPosts);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [tocOpen, setTocOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const tocItems = useMemo(() => extractHeadings(post?.content || ''), [post?.content]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // useEffect(() => {
  //   if (!id) return;

  //   const trackView = async () => {
  //     console.log('Tracking view for postId:', id);
  //     try {
  //       const response = await fetch('/api/views', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ postId: id }),
  //       });

  //       console.log('View track response:', response.status, response.statusText);
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.error('Error data:', errorData);
  //         throw new Error(errorData.error || `Failed to track view (Status: ${response.status})`);
  //       }

  //       const data = await response.json();
  //       console.log('View track success:', data);
  //       setPost((prev) => ({ ...prev, views: data.views || prev.views }));
  //     } catch (err) {
  //       console.error('View tracking error:', err.message);
  //       setError(`Failed to track view: ${err.message}`);
  //     }
  //   };

  //   trackView();
  // }, [id]);


  useEffect(() => {
    if (!id) return;

    const trackView = async () => {
      console.log('Tracking view for postId:', id);
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: id }),
        });

        console.log('View track response:', response.status, response.statusText);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error data:', errorData);
          throw new Error(errorData.details || errorData.error || `Failed to track view (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('View track success:', data);
        setPost((prev) => ({ ...prev, views: data.views || prev.views }));
      } catch (err) {
        console.error('View tracking error:', err.message);
        toast.error(`Failed to track view: ${err.message}`);
        setError(`Failed to track view: ${err.message}`);
      }
    };

    trackView();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error('Post not found');
        }

        const data = await res.json();
        return {
          ...data,
          author: typeof data.author === 'object' ? data.author : { name: data.author || 'Unknown', id: data.authorId },
          date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data.date,
          content: data.content || '',
        };
      } catch (err) {
        throw err;
      }
    }

    async function fetchRelatedPosts(category, currentId) {
      try {
        const res = await fetch(`/api/posts?category=${category}&excludeId=${currentId}&limit=3`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.map(p => ({
          ...p,
          author: typeof p.author === 'object' ? p.author.name || 'Unknown' : p.author,
          date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : p.date,
        }));
      } catch (err) {
        return [];
      }
    }

    async function fetchLikes() {
      try {
        const res = await fetch(`/api/likes?postId=${id}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch likes');
        const data = await res.json();
        return { likes: data.likes, userLiked: data.userLiked || false };
      } catch (err) {
        return { likes: 0, userLiked: false };
      }
    }

    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?postId=${id}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        return data.map(comment => ({
          ...comment,
          author: typeof comment.author === 'object' ? comment.author.name || 'Unknown' : comment.author,
          date: new Date(comment.createdAt).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          }),
        }));
      } catch (err) {
        return [];
      }
    }

    async function fetchFollowStatus(authorId) {
      if (!session?.user || !authorId) return false;
      try {
        const res = await fetch(`/api/users/${session.user.id}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch user data');
        const userData = await res.json();
        return userData.following?.includes(authorId) || false;
      } catch (err) {
        console.error('Error fetching follow status:', err);
        return false;
      }
    }

  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const [postRes, likesRes, commentsRes, followStatus] = await Promise.allSettled([
  //         fetchPost(),
  //         fetchLikes(),
  //         fetchComments(),
  //         fetchFollowStatus(dummyPost.authorId),
  //       ]);

  //       const fetchedPost = postRes.status === 'fulfilled' ? postRes.value : dummyPost;
  //       const fetchedLikes = likesRes.status === 'fulfilled' ? likesRes.value : { likes: 0, userLiked: false };
  //       const fetchedComments = commentsRes.status === 'fulfilled' ? commentsRes.value : [];
  //       const fetchedFollowStatus = followStatus.status === 'fulfilled' ? followStatus.value : false;

  //       setPost(fetchedPost);
  //       setLikes(fetchedLikes.likes);
  //       setUserLiked(fetchedLikes.userLiked);
  //       setComments(fetchedComments);
  //       setIsFollowing(fetchedFollowStatus);

  //       const fetchedRelated = await fetchRelatedPosts(fetchedPost.category, id);
  //       setRelatedPosts(fetchedRelated.length > 0 ? fetchedRelated : dummyRelatedPosts);
  //       setError(null);
  //     } catch (err) {
  //       console.error('Error fetching data:', err);
  //       setPost(dummyPost);
  //       setRelatedPosts(dummyRelatedPosts);
  //       setComments([]);
  //       setIsFollowing(false);
  //       setError('Failed to load post data. Showing demo data.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   if (id) fetchData();
  // }, [id, baseUrl, dummyPost, dummyRelatedPosts, session?.user?.id]);



  async function fetchData() {
    // Skip fetching if post is already loaded and not the dummyPost
    if (post && post._id === id && post._id !== dummyPost._id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [postRes, likesRes, commentsRes, followStatus] = await Promise.allSettled([
        fetchPost(),
        fetchLikes(),
        fetchComments(),
        fetchFollowStatus(dummyPost.authorId),
      ]);

      const fetchedPost = postRes.status === 'fulfilled' ? postRes.value : dummyPost;
      const fetchedLikes = likesRes.status === 'fulfilled' ? likesRes.value : { likes: 0, userLiked: false };
      const fetchedComments = commentsRes.status === 'fulfilled' ? commentsRes.value : [];
      const fetchedFollowStatus = followStatus.status === 'fulfilled' ? followStatus.value : false;

      setPost(fetchedPost);
      setLikes(fetchedLikes.likes);
      setUserLiked(fetchedLikes.userLiked);
      setComments(fetchedComments);
      setIsFollowing(fetchedFollowStatus);

      const fetchedRelated = await fetchRelatedPosts(fetchedPost.category, id);
      setRelatedPosts(fetchedRelated.length > 0 ? fetchedRelated : dummyRelatedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setPost(dummyPost);
      setRelatedPosts(dummyRelatedPosts);
      setComments([]);
      setIsFollowing(false);
      setError('Failed to load post data. Showing demo data.');
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [id, baseUrl, dummyPost, dummyRelatedPosts, session?.user?.id, post]); // Added post to dependencies




  useEffect(() => {
    const pres = document.querySelectorAll('pre');
    pres.forEach(pre => {
      if (!pre.querySelector('button.copy-btn')) {
        const button = document.createElement('button');
        button.className = 'copy-btn absolute top-2 right-2 p-2 min-w-[32px] h-[32px] bg-slate-700/80 hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-300 flex items-center justify-center z-10';
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
        button.onclick = (e) => {
          e.stopPropagation();
          const code = pre.querySelector('code').textContent;
          navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(pre);
            setTimeout(() => setCopiedCode(null), 2000);
          });
        };
        pre.appendChild(button);
      }
    });

    return () => {
      const buttons = document.querySelectorAll('.copy-btn');
      buttons.forEach(btn => btn.remove());
    };
  }, [post?.content]);

  const handleLike = async () => {
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to toggle like');
      }

      const data = await res.json();
      setUserLiked(data.liked);
      setLikes(prev => prev + (data.liked ? 1 : -1));
      toast.success(data.liked ? 'Liked!' : 'Unliked!');
    } catch (err) {
      toast.error(err.message || 'Error toggling like');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Check out this post!',
      url: `${baseUrl}/posts/${id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
      toast.success('Link shared/copied!');
    } catch (err) {
      toast.error('Failed to share');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (newComment.length > 500) {
      toast.error('Comment must be 500 characters or less');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: id,
          content: newComment,
          parent: null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      const data = await res.json();
      setComments(prev => [data, ...prev]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.message || 'Error posting comment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = () => {
    toast.success('Saved! (Feature coming soon)');
  };

  const handleFollow = async () => {
    console.log("handleFollow called");
    if (!session?.user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!post.author.id) {
      toast.error('Author ID not available');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: post.author.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to toggle follow');
      }

      const data = await res.json();
      setIsFollowing(data.following);
      toast.success(data.following ? 'Followed!' : 'Unfollowed!');
    } catch (err) {
      toast.error(err.message || 'Error toggling follow');
    } finally {
      setActionLoading(false);
    }
  };

  const authorInitial = post?.author?.name ? post.author.name.charAt(0).toUpperCase() : '?';

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
    <>
      {/* Back Button */}
      <div className="pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <CustomLink href="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition group mb-8 text-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span className="break-words">Back to all posts</span>
          </CustomLink>
        </div>
      </div>

      {/* Global Error/Success Messages */}
      {(error || successMessage) && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm mb-2">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
              {successMessage}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* TOC Sidebar */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 self-start">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              On This Page
            </h3>
            <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1 px-2 rounded text-sm transition ${
                    item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC */}
        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700 text-emerald-400 font-medium transition"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Table of Contents
            </span>
            {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {tocOpen && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 mt-2 max-h-48 overflow-y-auto">
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-2 px-3 rounded text-sm transition ${
                      item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
                    }`}
                    onClick={() => setTocOpen(false)}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Article Header */}
        <article className="flex-1">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
                {post?.category || 'Uncategorized'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post?.title || 'Untitled Post'}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm text-slate-300">{post?.author?.name || 'Unknown Author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post?.readTime || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{post?.views?.toLocaleString() || 0} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {post?.image && (
              <div className="relative h-48 sm:h-64 lg:h-96 rounded-2xl overflow-hidden mb-12 bg-slate-900">
                <Image src={post.image} alt={post.title || 'Post Image'} fill className="object-cover" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={handleLike}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border text-sm ${
                  userLiked
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-slate-300'
                } disabled:opacity-50`}
              >
                <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </button>
              {/* <button onClick={handleSave} disabled className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button> */}
              <button onClick={handleShare} disabled={actionLoading} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300 disabled:opacity-50">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Article Content */}
            <div id="article-content" className="mb-12 space-y-6">
              {post?.content ? parseContent(post.content) : <p className="text-slate-400">Content not available.</p>}
            </div>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
              {session ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 transition resize-none"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !newComment.trim()}
                    className="mt-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium disabled:opacity-50 transition"
                  >
                    {actionLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <p className="text-slate-400 mb-4">
                  <CustomLink href="/auth/login" className="text-emerald-400">Sign in</CustomLink> to comment.
                </p>
              )}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, idx) => (
                    <div key={comment._id || `comment-${idx}`} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {(comment.author?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-slate-200">{comment.author || 'Anonymous'}</h5>
                          <p className="text-xs text-slate-400">{comment.date || 'Unknown Date'}</p>
                        </div>
                      </div>
                      <p className="text-slate-300">{comment.content || 'No content'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No comments yet. Be the first!</p>
              )}
            </div>

            {/* Quick Tip */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 mb-8 mt-8">
              <h4 className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm sm:text-base">
                <Zap className="w-5 h-5 flex-shrink-0" />
                Quick Tip
              </h4>
              <p className="text-slate-300 text-sm sm:text-base">For immediate LCP wins, prioritize above-the-fold images with `picture` elements supporting WebP/AVIF.</p>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post?.tags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-700 cursor-pointer transition">
                    #{tag}
                  </span>
                )) || <p className="text-slate-400">No tags</p>}
              </div>
            </div>

            {/* Author Card */}
            <div className="mt-12 p-4 sm:p-6 lg:p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
                  {authorInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{post?.author?.name || 'Unknown Author'}</h3>
                  <p className="text-slate-400 mb-4 text-sm leading-relaxed">{post?.authorBio || 'Author bio not available'}</p>
                  {/* <button
                    onClick={handleFollow}
                    disabled={actionLoading || !post?.author?.id || session?.user?.id === post.author.id}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      isFollowing
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    } disabled:opacity-50`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button> */}
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <h3 className="text-xl sm:text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {relatedPosts?.map((p) => (
                  <CustomLink key={p._id} href={`/posts/${p._id}`} className="group p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
                    <span className="text-xs text-emerald-400 font-medium">{p.category}</span>
                    <h4 className="text-base sm:text-lg font-semibold mt-2 mb-2 group-hover:text-emerald-400 transition">
                      {p.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">{p.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{p.readTime}</span>
                      <span>{p.views?.toLocaleString() || 0} views</span>
                    </div>
                  </CustomLink>
                )) || <p className="text-slate-400 col-span-full">No related posts available.</p>}
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Login Prompt Dialog */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-4">Sign In Required</h3>
            <p className="text-slate-400 mb-6">Please log in to like, comment, or follow users.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium">
                Cancel
              </button>
              <button onClick={() => router.push('/auth/login')} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {copiedCode && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-emerald-500/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm z-50 animate-fade-in">
          Copied to clipboard!
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .scroll-mt-20 { scroll-margin-top: 5rem; }
      `
      }</style>
    </>
  );
};