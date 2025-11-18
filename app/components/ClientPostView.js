// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { Clock, User, Calendar, TrendingUp, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageCircle, Zap, ChevronDown, ChevronRight } from 'lucide-react';
// import Image from 'next/image';
// import CustomLink from './CustomLink';
// import LoadingSpinner from './LoadingSpinner';
// import toast from 'react-hot-toast';

// // Custom markdown processing functions (unchanged from your original)
// const processInline = (text) => {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 no-underline hover:text-emerald-300 hover:underline">$1</a>')
//     .replace(/`(.*?)`/g, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm sm:text-base">$1</code>');
// };

// const extractHeadings = (content) => {
//   const lines = content.split('\n');
//   const headings = [];
//   let index = 0;
//   lines.forEach((line) => {
//     const trimmed = line.trim();
//     if (trimmed.startsWith('## ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(3).trim(),
//         level: 'h2',
//       });
//     } else if (trimmed.startsWith('### ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(4).trim(),
//         level: 'h3',
//       });
//     } else if (trimmed.startsWith('#### ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(5).trim(),
//         level: 'h4',
//       });
//     }
//   });
//   return headings;
// };

// const parseContent = (content) => {
//   const lines = content.split('\n');
//   const elements = [];
//   let i = 0;
//   let headingIndex = 0;
//   while (i < lines.length) {
//     let line = lines[i].trim();
//     if (!line) {
//       i++;
//       continue;
//     }

//     // Headings (unchanged)
//     if (line.startsWith('## ')) {
//       const headingText = line.substring(3).trim();
//       elements.push(
//         <h2
//           key={`h2-${elements.length}-${headingIndex}`}
//           id={`heading-${headingIndex}`}
//           className="text-2xl sm:text-3xl lg:text-4xl mt-16 mb-8 text-emerald-400 font-bold border-b border-slate-800 pb-4 scroll-mt-20"
//         >
//           {processInline(headingText)}
//         </h2>
//       );
//       headingIndex++;
//       i++;
//       continue;
//     } else if (line.startsWith('### ')) {
//       const headingText = line.substring(4).trim();
//       elements.push(
//         <h3
//           key={`h3-${elements.length}-${headingIndex}`}
//           id={`heading-${headingIndex}`}
//           className="text-xl sm:text-2xl lg:text-3xl mt-12 mb-6 text-cyan-400 font-bold scroll-mt-20"
//         >
//           {processInline(headingText)}
//         </h3>
//       );
//       headingIndex++;
//       i++;
//       continue;
//     } else if (line.startsWith('#### ')) {
//       const headingText = line.substring(5).trim();
//       elements.push(
//         <h4
//           key={`h4-${elements.length}-${headingIndex}`}
//           id={`heading-${headingIndex}`}
//           className="text-lg sm:text-xl mt-8 mb-4 font-bold scroll-mt-20"
//         >
//           {processInline(headingText)}
//         </h4>
//       );
//       headingIndex++;
//       i++;
//       continue;
//     } else if (line.startsWith('> ')) {
//       // Blockquote
//       let quoteLines = [line.substring(2).trim()];
//       i++;
//       while (i < lines.length && lines[i].trim().startsWith('> ')) {
//         quoteLines.push(lines[i].trim().substring(2));
//         i++;
//       }
//       let quoteText = quoteLines.join(' ').trim();
//       quoteText = processInline(quoteText);
//       elements.push(
//         <blockquote
//           key={`bq-${elements.length}`}
//           className="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg mb-6"
//           dangerouslySetInnerHTML={{ __html: quoteText }}
//         />
//       );
//       continue;
//     } else if (line.startsWith('```')) {
//       // Code block
//       const langMatch = line.match(/```(\w+)?/);
//       const lang = langMatch ? langMatch[1] : '';
//       const codeLines = [];
//       i++;
//       while (i < lines.length && !lines[i].trim().startsWith('```')) {
//         codeLines.push(lines[i]);
//         i++;
//       }
//       i++; // Skip closing ```
//       const code = codeLines.join('\n');
//       elements.push(
//         <pre
//           key={`pre-${elements.length}`}
//           className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 relative shadow-lg overflow-x-auto group"
//           style={{ position: 'relative' }}
//         >
//           <code className={`block text-sm sm:text-base ${lang ? `language-${lang}` : ''} text-slate-300`}>
//             {code}
//           </code>
//         </pre>
//       );
//       continue;
//     } else if (line.startsWith('- ') || line.startsWith('* ')) {
//       // Unordered list
//       const listItems = [];
//       let listKey = elements.length;
//       while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
//         let liText = lines[i].trim().substring(2).trim();
//         liText = processInline(liText);
//         listItems.push(
//           <li
//             key={`${listKey}-li-${listItems.length}`}
//             className="text-slate-300 my-3 flex items-start gap-2"
//             dangerouslySetInnerHTML={{ __html: liText }}
//           />
//         );
//         i++;
//       }
//       elements.push(<ul key={`${listKey}-ul`} className="my-6 list-disc list-inside marker:text-emerald-400 text-slate-300">{listItems}</ul>);
//       continue;
//     } else {
//       // Paragraph
//       let paraLines = [lines[i]];
//       i++;
//       while (i < lines.length) {
//         const nextLine = lines[i].trim();
//         if (nextLine === '' || nextLine.startsWith('#') || nextLine.startsWith('> ') || nextLine.startsWith('```') || nextLine.startsWith('- ') || nextLine.startsWith('* ')) {
//           break;
//         }
//         paraLines.push(lines[i]);
//         i++;
//       }
//       let paraText = paraLines.join(' ').trim();
//       paraText = processInline(paraText);
//       elements.push(
//         <p
//           key={`p-${elements.length}`}
//           className="text-slate-300 leading-relaxed mb-6 text-base sm:text-lg"
//           dangerouslySetInnerHTML={{ __html: paraText }}
//         />
//       );
//     }
//   }
//   return elements;
// };

// export default function ClientPostView({ id, dummyPost, dummyRelatedPosts, baseUrl }) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [post, setPost] = useState(dummyPost);
//   const [relatedPosts, setRelatedPosts] = useState(dummyRelatedPosts);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [tocOpen, setTocOpen] = useState(false);
//   const [copiedCode, setCopiedCode] = useState(null);
//   const [likes, setLikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const tocItems = useMemo(() => extractHeadings(post?.content || ''), [post?.content]);

//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => setSuccessMessage(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   // useEffect(() => {
//   //   if (!id) return;

//   //   const trackView = async () => {
//   //     console.log('Tracking view for postId:', id);
//   //     try {
//   //       const response = await fetch('/api/views', {
//   //         method: 'POST',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify({ postId: id }),
//   //       });

//   //       console.log('View track response:', response.status, response.statusText);
//   //       if (!response.ok) {
//   //         const errorData = await response.json();
//   //         console.error('Error data:', errorData);
//   //         throw new Error(errorData.error || `Failed to track view (Status: ${response.status})`);
//   //       }

//   //       const data = await response.json();
//   //       console.log('View track success:', data);
//   //       setPost((prev) => ({ ...prev, views: data.views || prev.views }));
//   //     } catch (err) {
//   //       console.error('View tracking error:', err.message);
//   //       setError(`Failed to track view: ${err.message}`);
//   //     }
//   //   };

//   //   trackView();
//   // }, [id]);


//   useEffect(() => {
//     if (!id) return;

//     const trackView = async () => {
//       console.log('Tracking view for postId:', id);
//       try {
//         const response = await fetch('/api/views', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ postId: id }),
//         });

//         console.log('View track response:', response.status, response.statusText);
//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error('Error data:', errorData);
//           throw new Error(errorData.details || errorData.error || `Failed to track view (Status: ${response.status})`);
//         }

//         const data = await response.json();
//         console.log('View track success:', data);
//         setPost((prev) => ({ ...prev, views: data.views || prev.views }));
//       } catch (err) {
//         console.error('View tracking error:', err.message);
//         toast.error(`Failed to track view: ${err.message}`);
//         setError(`Failed to track view: ${err.message}`);
//       }
//     };

//     trackView();
//   }, [id]);

//   useEffect(() => {
//     if (!id) return;
//     async function fetchPost() {
//       try {
//         const res = await fetch(`/api/posts/${id}`, {
//           cache: 'no-store',
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (!res.ok) {
//           throw new Error('Post not found');
//         }

//         const data = await res.json();
//         return {
//           ...data,
//           author: typeof data.author === 'object' ? data.author : { name: data.author || 'Unknown', id: data.authorId },
//           date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data.date,
//           content: data.content || '',
//         };
//       } catch (err) {
//         throw err;
//       }
//     }

//     async function fetchRelatedPosts(category, currentId) {
//       try {
//         const res = await fetch(`/api/posts?category=${category}&excludeId=${currentId}&limit=3`, {
//           cache: 'no-store',
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (!res.ok) return [];
//         const data = await res.json();
//         return data.map(p => ({
//           ...p,
//           author: typeof p.author === 'object' ? p.author.name || 'Unknown' : p.author,
//           date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : p.date,
//         }));
//       } catch (err) {
//         return [];
//       }
//     }

//     async function fetchLikes() {
//       try {
//         const res = await fetch(`/api/likes?postId=${id}`, {
//           cache: 'no-store',
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (!res.ok) throw new Error('Failed to fetch likes');
//         const data = await res.json();
//         return { likes: data.likes, userLiked: data.userLiked || false };
//       } catch (err) {
//         return { likes: 0, userLiked: false };
//       }
//     }

//     async function fetchComments() {
//       try {
//         const res = await fetch(`/api/comments?postId=${id}`, {
//           cache: 'no-store',
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (!res.ok) throw new Error('Failed to fetch comments');
//         const data = await res.json();
//         return data.map(comment => ({
//           ...comment,
//           author: typeof comment.author === 'object' ? comment.author.name || 'Unknown' : comment.author,
//           date: new Date(comment.createdAt).toLocaleDateString('en-US', {
//             month: 'long', day: 'numeric', year: 'numeric'
//           }),
//         }));
//       } catch (err) {
//         return [];
//       }
//     }

//     async function fetchFollowStatus(authorId) {
//       if (!session?.user || !authorId) return false;
//       try {
//         const res = await fetch(`/api/users/${session.user.id}`, {
//           cache: 'no-store',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (!res.ok) throw new Error('Failed to fetch user data');
//         const userData = await res.json();
//         return userData.following?.includes(authorId) || false;
//       } catch (err) {
//         console.error('Error fetching follow status:', err);
//         return false;
//       }
//     }

//   //   async function fetchData() {
//   //     setLoading(true);
//   //     try {
//   //       const [postRes, likesRes, commentsRes, followStatus] = await Promise.allSettled([
//   //         fetchPost(),
//   //         fetchLikes(),
//   //         fetchComments(),
//   //         fetchFollowStatus(dummyPost.authorId),
//   //       ]);

//   //       const fetchedPost = postRes.status === 'fulfilled' ? postRes.value : dummyPost;
//   //       const fetchedLikes = likesRes.status === 'fulfilled' ? likesRes.value : { likes: 0, userLiked: false };
//   //       const fetchedComments = commentsRes.status === 'fulfilled' ? commentsRes.value : [];
//   //       const fetchedFollowStatus = followStatus.status === 'fulfilled' ? followStatus.value : false;

//   //       setPost(fetchedPost);
//   //       setLikes(fetchedLikes.likes);
//   //       setUserLiked(fetchedLikes.userLiked);
//   //       setComments(fetchedComments);
//   //       setIsFollowing(fetchedFollowStatus);

//   //       const fetchedRelated = await fetchRelatedPosts(fetchedPost.category, id);
//   //       setRelatedPosts(fetchedRelated.length > 0 ? fetchedRelated : dummyRelatedPosts);
//   //       setError(null);
//   //     } catch (err) {
//   //       console.error('Error fetching data:', err);
//   //       setPost(dummyPost);
//   //       setRelatedPosts(dummyRelatedPosts);
//   //       setComments([]);
//   //       setIsFollowing(false);
//   //       setError('Failed to load post data. Showing demo data.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   if (id) fetchData();
//   // }, [id, baseUrl, dummyPost, dummyRelatedPosts, session?.user?.id]);



//   async function fetchData() {
//     // Skip fetching if post is already loaded and not the dummyPost
//     if (post && post._id === id && post._id !== dummyPost._id) {
//       setLoading(false);
//       return;
//     }

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

//   fetchData();
// }, [id, baseUrl, dummyPost, dummyRelatedPosts, session?.user?.id, post]); // Added post to dependencies




//   useEffect(() => {
//     const pres = document.querySelectorAll('pre');
//     pres.forEach(pre => {
//       if (!pre.querySelector('button.copy-btn')) {
//         const button = document.createElement('button');
//         button.className = 'copy-btn absolute top-2 right-2 p-2 min-w-[32px] h-[32px] bg-slate-700/80 hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-300 flex items-center justify-center z-10';
//         button.innerHTML = `
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//           </svg>
//         `;
//         button.onclick = (e) => {
//           e.stopPropagation();
//           const code = pre.querySelector('code').textContent;
//           navigator.clipboard.writeText(code).then(() => {
//             setCopiedCode(pre);
//             setTimeout(() => setCopiedCode(null), 2000);
//           });
//         };
//         pre.appendChild(button);
//       }
//     });

//     return () => {
//       const buttons = document.querySelectorAll('.copy-btn');
//       buttons.forEach(btn => btn.remove());
//     };
//   }, [post?.content]);

//   const handleLike = async () => {
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/likes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to toggle like');
//       }

//       const data = await res.json();
//       setUserLiked(data.liked);
//       setLikes(prev => prev + (data.liked ? 1 : -1));
//       toast.success(data.liked ? 'Liked!' : 'Unliked!');
//     } catch (err) {
//       toast.error(err.message || 'Error toggling like');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: post?.title || 'Check out this post!',
//       url: `${baseUrl}/posts/${id}`,
//     };
//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(shareData.url);
//       }
//       toast.success('Link shared/copied!');
//     } catch (err) {
//       toast.error('Failed to share');
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     if (!newComment.trim()) {
//       toast.error('Comment cannot be empty');
//       return;
//     }
//     if (newComment.length > 500) {
//       toast.error('Comment must be 500 characters or less');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/comments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           postId: id,
//           content: newComment,
//           parent: null,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to post comment');
//       }

//       const data = await res.json();
//       setComments(prev => [data, ...prev]);
//       setNewComment('');
//       toast.success('Comment posted!');
//     } catch (err) {
//       toast.error(err.message || 'Error posting comment');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleSave = () => {
//     toast.success('Saved! (Feature coming soon)');
//   };

//   const handleFollow = async () => {
//     console.log("handleFollow called");
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     if (!post.author.id) {
//       toast.error('Author ID not available');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/follow', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ targetUserId: post.author.id }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to toggle follow');
//       }

//       const data = await res.json();
//       setIsFollowing(data.following);
//       toast.success(data.following ? 'Followed!' : 'Unfollowed!');
//     } catch (err) {
//       toast.error(err.message || 'Error toggling follow');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const authorInitial = post?.author?.name ? post.author.name.charAt(0).toUpperCase() : '?';

//   if (loading) {
//     return (
//       <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
//         <LoadingSpinner message="Loading post..." />
//       </section>
//     );
//   }

//   if (error && !post) {
//     return (
//       <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
//         <LoadingSpinner message={error} />
//       </section>
//     );
//   }

//   return (
//     <>
//       {/* Back Button */}
//       <div className="pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <CustomLink href="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition group mb-8 text-sm">
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
//             <span className="break-words">Back to all posts</span>
//           </CustomLink>
//         </div>
//       </div>

//       {/* Global Error/Success Messages */}
//       {(error || successMessage) && (
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
//           {error && (
//             <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm mb-2">
//               {error}
//             </div>
//           )}
//           {successMessage && (
//             <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
//               {successMessage}
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
//         {/* TOC Sidebar */}
//         <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 self-start">
//           <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
//             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Zap className="w-4 h-4" />
//               On This Page
//             </h3>
//             <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
//               {tocItems.map((item) => (
//                 <a
//                   key={item.id}
//                   href={`#${item.id}`}
//                   className={`block py-1 px-2 rounded text-sm transition ${
//                     item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                   }`}
//                 >
//                   {item.text}
//                 </a>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Mobile TOC */}
//         <div className="lg:hidden w-full mb-4">
//           <button
//             onClick={() => setTocOpen(!tocOpen)}
//             className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700 text-emerald-400 font-medium transition"
//           >
//             <span className="flex items-center gap-2">
//               <Zap className="w-4 h-4" />
//               Table of Contents
//             </span>
//             {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//           </button>
//           {tocOpen && (
//             <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 mt-2 max-h-48 overflow-y-auto">
//               <nav className="space-y-2">
//                 {tocItems.map((item) => (
//                   <a
//                     key={item.id}
//                     href={`#${item.id}`}
//                     className={`block py-2 px-3 rounded text-sm transition ${
//                       item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                     }`}
//                     onClick={() => setTocOpen(false)}
//                   >
//                     {item.text}
//                   </a>
//                 ))}
//               </nav>
//             </div>
//           )}
//         </div>

//         {/* Article Header */}
//         <article className="flex-1">
//           <div className="max-w-4xl mx-auto">
//             {/* Category Badge */}
//             <div className="mb-4">
//               <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
//                 {post?.category || 'Uncategorized'}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
//               {post?.title || 'Untitled Post'}
//             </h1>

//             {/* Meta Information */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-800">
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span className="text-sm text-slate-300">{post?.author?.name || 'Unknown Author'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span className="text-sm">
//                   {post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span className="text-sm">{post?.readTime || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 <span className="text-sm">{post?.views?.toLocaleString() || 0} views</span>
//               </div>
//             </div>

//             {/* Featured Image */}
//             {post?.image && (
//               <div className="relative h-48 sm:h-64 lg:h-96 rounded-2xl overflow-hidden mb-12 bg-slate-900">
//                 <Image src={post.image} alt={post.title || 'Post Image'} fill className="object-cover" />
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-2 mb-12">
//               <button
//                 onClick={handleLike}
//                 disabled={actionLoading}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border text-sm ${
//                   userLiked
//                     ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
//                     : 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-slate-300'
//                 } disabled:opacity-50`}
//               >
//                 <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`} />
//                 <span>{likes}</span>
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300">
//                 <MessageCircle className="w-4 h-4" />
//                 <span>{comments.length}</span>
//               </button>
//               {/* <button onClick={handleSave} disabled className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300">
//                 <Bookmark className="w-4 h-4" />
//                 <span>Save</span>
//               </button> */}
//               <button onClick={handleShare} disabled={actionLoading} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300 disabled:opacity-50">
//                 <Share2 className="w-4 h-4" />
//                 <span>Share</span>
//               </button>
//             </div>

//             {/* Article Content */}
//             <div id="article-content" className="mb-12 space-y-6">
//               {post?.content ? parseContent(post.content) : <p className="text-slate-400">Content not available.</p>}
//             </div>

//             {/* Comments Section */}
//             <div className="mt-12 pt-8 border-t border-slate-800">
//               <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
//               {session ? (
//                 <form onSubmit={handleCommentSubmit} className="mb-8">
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Add a comment..."
//                     rows="3"
//                     className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 transition resize-none"
//                   />
//                   <button
//                     type="submit"
//                     disabled={actionLoading || !newComment.trim()}
//                     className="mt-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium disabled:opacity-50 transition"
//                   >
//                     {actionLoading ? 'Posting...' : 'Post Comment'}
//                   </button>
//                 </form>
//               ) : (
//                 <p className="text-slate-400 mb-4">
//                   <CustomLink href="/auth/login" className="text-emerald-400">Sign in</CustomLink> to comment.
//                 </p>
//               )}
//               {comments.length > 0 ? (
//                 <div className="space-y-4">
//                   {comments.map((comment, idx) => (
//                     <div key={comment._id || `comment-${idx}`} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
//                           {(comment.author?.charAt(0) || '?').toUpperCase()}
//                         </div>
//                         <div>
//                           <h5 className="text-sm font-medium text-slate-200">{comment.author || 'Anonymous'}</h5>
//                           <p className="text-xs text-slate-400">{comment.date || 'Unknown Date'}</p>
//                         </div>
//                       </div>
//                       <p className="text-slate-300">{comment.content || 'No content'}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-slate-400">No comments yet. Be the first!</p>
//               )}
//             </div>

//             {/* Quick Tip */}
//             <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 mb-8 mt-8">
//               <h4 className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm sm:text-base">
//                 <Zap className="w-5 h-5 flex-shrink-0" />
//                 Quick Tip
//               </h4>
//               <p className="text-slate-300 text-sm sm:text-base">For immediate LCP wins, prioritize above-the-fold images with `picture` elements supporting WebP/AVIF.</p>
//             </div>

//             {/* Tags */}
//             <div className="mt-12 pt-8 border-t border-slate-800">
//               <h3 className="text-lg font-semibold mb-4">Tags</h3>
//               <div className="flex flex-wrap gap-2">
//                 {post?.tags?.map((tag, idx) => (
//                   <span key={idx} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-700 cursor-pointer transition">
//                     #{tag}
//                   </span>
//                 )) || <p className="text-slate-400">No tags</p>}
//               </div>
//             </div>

//             {/* Author Card */}
//             <div className="mt-12 p-4 sm:p-6 lg:p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
//                   {authorInitial}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg sm:text-xl font-bold mb-2">{post?.author?.name || 'Unknown Author'}</h3>
//                   <p className="text-slate-400 mb-4 text-sm leading-relaxed">{post?.authorBio || 'Author bio not available'}</p>
//                   {/* <button
//                     onClick={handleFollow}
//                     disabled={actionLoading || !post?.author?.id || session?.user?.id === post.author.id}
//                     className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
//                       isFollowing
//                         ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
//                         : 'bg-emerald-500 hover:bg-emerald-600 text-white'
//                     } disabled:opacity-50`}
//                   >
//                     {isFollowing ? 'Following' : 'Follow'}
//                   </button> */}
//                 </div>
//               </div>
//             </div>

//             {/* Related Posts */}
//             <div className="mt-16">
//               <h3 className="text-xl sm:text-2xl font-bold mb-8">Related Articles</h3>
//               <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
//                 {relatedPosts?.map((p) => (
//                   <CustomLink key={p._id} href={`/posts/${p._id}`} className="group p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
//                     <span className="text-xs text-emerald-400 font-medium">{p.category}</span>
//                     <h4 className="text-base sm:text-lg font-semibold mt-2 mb-2 group-hover:text-emerald-400 transition">
//                       {p.title}
//                     </h4>
//                     <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">{p.excerpt}</p>
//                     <div className="flex items-center gap-4 text-xs text-slate-500">
//                       <span>{p.readTime}</span>
//                       <span>{p.views?.toLocaleString() || 0} views</span>
//                     </div>
//                   </CustomLink>
//                 )) || <p className="text-slate-400 col-span-full">No related posts available.</p>}
//               </div>
//             </div>
//           </div>
//         </article>
//       </div>

//       {/* Login Prompt Dialog */}
//       {showLoginPrompt && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
//           <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-center">
//             <h3 className="text-xl font-bold mb-4">Sign In Required</h3>
//             <p className="text-slate-400 mb-6">Please log in to like, comment, or follow users.</p>
//             <div className="flex gap-3">
//               <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium">
//                 Cancel
//               </button>
//               <button onClick={() => router.push('/auth/login')} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium">
//                 Sign In
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Copy Toast */}
//       {copiedCode && (
//         <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-emerald-500/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm z-50 animate-fade-in">
//           Copied to clipboard!
//         </div>
//       )}

//       <style jsx global>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.2s ease-out; }
//         .scroll-mt-20 { scroll-margin-top: 5rem; }
//       `
//       }</style>
//     </>
//   );
// };








// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { Clock, User, Calendar, TrendingUp, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageCircle, Zap, ChevronDown, ChevronRight } from 'lucide-react';
// import Image from 'next/image';
// import CustomLink from './CustomLink';
// import LoadingSpinner from './LoadingSpinner';
// import toast from 'react-hot-toast';

// // Updated inline processor to match CreateTab preview exactly
// const processInline = (text) => {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>')
//     .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline">$1</a>')
//     .replace(/`(.*?)`/g, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm">$1</code>');
// };

// const extractHeadings = (content) => {
//   const lines = content.split('\n');
//   const headings = [];
//   let index = 0;
//   lines.forEach((line) => {
//     const trimmed = line.trim();
//     if (trimmed.startsWith('# ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(3).trim(),
//         level: 'h2',
//       });
//     } else if (trimmed.startsWith('## ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(4).trim(),
//         level: 'h3',
//       });
//     } else if (trimmed.startsWith('### ')) {
//       headings.push({
//         id: `heading-${index++}`,
//         text: trimmed.substring(5).trim(),
//         level: 'h4',
//       });
//     }
//   });
//   return headings;
// };

// // Fully updated parseContent — now 100% matches CreateTab live preview
// const parseContent = (content) => {
//   const lines = content.split('\n');
//   const elements = [];
//   let i = 0;
//   let headingIndex = 0;

//   while (i < lines.length) {
//     let line = lines[i].trim();
//     if (!line) {
//       i++;
//       continue;
//     }

//     // Headings
//     if (line.startsWith('# ')) {
//       const headingText = line.substring(3).trim();
//       elements.push(
//         <h2
//           key={`h2-${headingIndex}`}
//           id={`heading-${headingIndex++}`}
//           className="text-3xl font-bold text-emerald-400 mt-10 mb-5 border-b border-slate-800 pb-4 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(headingText) }}
//         />
//       );
//       i++;
//       continue;
//     }
//     if (line.startsWith('## ')) {
//       const headingText = line.substring(4).trim();
//       elements.push(
//         <h3
//           key={`h3-${headingIndex}`}
//           id={`heading-${headingIndex++}`}
//           className="text-2xl font-bold text-emerald-400 mt-8 mb-4 border-b border-slate-800 pb-4 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(headingText) }}
//         />
//       );
//       i++;
//       continue;
//     }
//     if (line.startsWith('### ')) {
//       const headingText = line.substring(5).trim();
//       elements.push(
//         <h4
//           key={`h4-${headingIndex}`}
//           id={`heading-${headingIndex++}`}
//           className="text-xl font-bold text-cyan-400 mt-6 mb-3 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(headingText) }}
//         />
//       );
//       i++;
//       continue;
//     }

//     // Blockquote
//     if (line.startsWith('> ')) {
//       let quoteLines = [];
//       while (i < lines.length && lines[i].trim().startsWith('> ')) {
//         quoteLines.push(lines[i].trim().substring(2));
//         i++;
//       }
//       const quoteText = processInline(quoteLines.join(' '));
//       elements.push(
//         <blockquote
//           key={`bq-${elements.length}`}
//           className="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg my-4"
//           dangerouslySetInnerHTML={{ __html: quoteText }}
//         />
//       );
//       continue;
//     }

//     // Code block
//     if (line.startsWith('```')) {
//       const langMatch = line.match(/```(\w+)?/);
//       const lang = langMatch ? langMatch[1] : '';
//       i++;
//       const codeLines = [];
//       while (i < lines.length && !lines[i].trim().startsWith('```')) {
//         codeLines.push(lines[i]);
//         i++;
//       }
//       i++; // skip closing ```
//       const code = codeLines.join('\n');
//       elements.push(
//         <pre
//           key={`pre-${elements.length}`}
//           className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 my-4 overflow-x-auto group relative"
//         >
//           <code className={`text-sm text-slate-300 block ${lang ? `language-${lang}` : ''}`}>
//             {code}
//           </code>
//         </pre>
//       );
//       continue;
//     }

//     // Unordered list
//     if (line.startsWith('- ') || line.startsWith('* ')) {
//       const listItems = [];
//       while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
//         const liText = processInline(lines[i].trim().substring(2).trim());
//         listItems.push(
//           <li
//             key={`li-${listItems.length}`}
//             className="text-slate-300"
//             dangerouslySetInnerHTML={{ __html: liText }}
//           />
//         );
//         i++;
//       }
//       elements.push(
//         <ul key={`ul-${elements.length}`} className="my-4 list-disc list-inside marker:text-emerald-400 text-slate-300 space-y-2">
//           {listItems}
//         </ul>
//       );
//       continue;
//     }

//     // Paragraph fallback
//     let paraLines = [lines[i]];
//     i++;
//     while (i < lines.length) {
//       const nextLine = lines[i].trim();
//       if (!nextLine || nextLine.startsWith('#') || nextLine.startsWith('> ') || nextLine.startsWith('```') || nextLine.startsWith('- ') || nextLine.startsWith('* ')) {
//         break;
//       }
//       paraLines.push(lines[i]);
//       i++;
//     }
//     const paraText = processInline(paraLines.join(' ').trim());
//     elements.push(
//       <p
//         key={`p-${elements.length}`}
//         className="text-slate-300 leading-relaxed mb-4"
//         dangerouslySetInnerHTML={{ __html: paraText }}
//       />
//     );
//   }

//   return elements;
// };

// export default function ClientPostView({ id, dummyPost, dummyRelatedPosts, baseUrl }) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [post, setPost] = useState(dummyPost);
//   const [relatedPosts, setRelatedPosts] = useState(dummyRelatedPosts);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [tocOpen, setTocOpen] = useState(false);
//   const [copiedCode, setCopiedCode] = useState(null);
//   const [likes, setLikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const tocItems = useMemo(() => extractHeadings(post?.content || ''), [post?.content]);

//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => setSuccessMessage(''), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   useEffect(() => {
//     if (!id) return;

//     const trackView = async () => {
//       try {
//         const response = await fetch('/api/views', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ postId: id }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.details || errorData.error || `Failed to track view (Status: ${response.status})`);
//         }

//         const data = await response.json();
//         setPost((prev) => ({ ...prev, views: data.views || prev.views }));
//       } catch (err) {
//         toast.error(`Failed to track view: ${err.message}`);
//         setError(`Failed to track view: ${err.message}`);
//       }
//     };

//     trackView();
//   }, [id]);

//   useEffect(() => {
//     if (!id) return;

//     async function fetchPost() {
//       try {
//         const res = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
//         if (!res.ok) throw new Error('Post not found');
//         const data = await res.json();
//         return {
//           ...data,
//           author: typeof data.author === 'object' ? data.author : { name: data.author || 'Unknown', id: data.authorId },
//           date: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data.date,
//           content: data.content || '',
//         };
//       } catch (err) {
//         throw err;
//       }
//     }

//     async function fetchRelatedPosts(category, currentId) {
//       try {
//         const res = await fetch(`/api/posts?category=${category}&excludeId=${currentId}&limit=3`, { cache: 'no-store' });
//         if (!res.ok) return [];
//         const data = await res.json();
//         return data.map(p => ({
//           ...p,
//           author: typeof p.author === 'object' ? p.author.name || 'Unknown' : p.author,
//           date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : p.date,
//         }));
//       } catch (err) {
//         return [];
//       }
//     }

//     async function fetchLikes() {
//       try {
//         const res = await fetch(`/api/likes?postId=${id}`, { cache: 'no-store' });
//         if (!res.ok) throw new Error('Failed to fetch likes');
//         const data = await res.json();
//         return { likes: data.likes, userLiked: data.userLiked || false };
//       } catch (err) {
//         return { likes: 0, userLiked: false };
//       }
//     }

//     async function fetchComments() {
//       try {
//         const res = await fetch(`/api/comments?postId=${id}`, { cache: 'no-store' });
//         if (!res.ok) throw new Error('Failed to fetch comments');
//         const data = await res.json();
//         return data.map(comment => ({
//           ...comment,
//           author: typeof comment.author === 'object' ? comment.author.name || 'Unknown' : comment.author,
//           date: new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
//         }));
//       } catch (err) {
//         return [];
//       }
//     }

//     async function fetchFollowStatus(authorId) {
//       if (!session?.user || !authorId) return false;
//       try {
//         const res = await fetch(`/api/users/${session.user.id}`, { cache: 'no-store' });
//         if (!res.ok) throw new Error('Failed to fetch user data');
//         const userData = await res.json();
//         return userData.following?.includes(authorId) || false;
//       } catch (err) {
//         return false;
//       }
//     }

//     async function fetchData() {
//       if (post && post._id === id && post._id !== dummyPost._id) {
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const [postRes, likesRes, commentsRes, followStatus] = await Promise.allSettled([
//           fetchPost(),
//           fetchLikes(),
//           fetchComments(),
//           fetchFollowStatus(dummyPost.authorId),
//         ]);

//         const fetchedPost = postRes.status === 'fulfilled' ? postRes.value : dummyPost;
//         const fetchedLikes = likesRes.status === 'fulfilled' ? likesRes.value : { likes: 0, userLiked: false };
//         const fetchedComments = commentsRes.status === 'fulfilled' ? commentsRes.value : [];
//         const fetchedFollowStatus = followStatus.status === 'fulfilled' ? followStatus.value : false;

//         setPost(fetchedPost);
//         setLikes(fetchedLikes.likes);
//         setUserLiked(fetchedLikes.userLiked);
//         setComments(fetchedComments);
//         setIsFollowing(fetchedFollowStatus);

//         const fetchedRelated = await fetchRelatedPosts(fetchedPost.category, id);
//         setRelatedPosts(fetchedRelated.length > 0 ? fetchedRelated : dummyRelatedPosts);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setPost(dummyPost);
//         setRelatedPosts(dummyRelatedPosts);
//         setComments([]);
//         setIsFollowing(false);
//         setError('Failed to load post data. Showing demo data.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [id, baseUrl, dummyPost, dummyRelatedPosts, session?.user?.id, post]);

//   useEffect(() => {
//     const pres = document.querySelectorAll('pre');
//     pres.forEach(pre => {
//       if (!pre.querySelector('button.copy-btn')) {
//         const button = document.createElement('button');
//         button.className = 'copy-btn absolute top-2 right-2 p-2 min-w-[32px] h-[32px] bg-slate-700/80 hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-300 flex items-center justify-center z-10';
//         button.innerHTML = `
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//           </svg>
//         `;
//         button.onclick = (e) => {
//           e.stopPropagation();
//           const code = pre.querySelector('code').textContent;
//           navigator.clipboard.writeText(code).then(() => {
//             setCopiedCode(pre);
//             setTimeout(() => setCopiedCode(null), 2000);
//           });
//         };
//         pre.appendChild(button);
//       }
//     });

//     return () => {
//       const buttons = document.querySelectorAll('.copy-btn');
//       buttons.forEach(btn => btn.remove());
//     };
//   }, [post?.content]);

//   const handleLike = async () => {
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/likes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ postId: id }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to toggle like');
//       }

//       const data = await res.json();
//       setUserLiked(data.liked);
//       setLikes(prev => prev + (data.liked ? 1 : -1));
//       toast.success(data.liked ? 'Liked!' : 'Unliked!');
//     } catch (err) {
//       toast.error(err.message || 'Error toggling like');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: post?.title || 'Check out this post!',
//       url: `${baseUrl}/posts/${id}`,
//     };
//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(shareData.url);
//         toast.success('Link copied to clipboard!');
//       }
//     } catch (err) {
//       toast.error('Failed to share');
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     if (!newComment.trim()) {
//       toast.error('Comment cannot be empty');
//       return;
//     }
//     if (newComment.length > 500) {
//       toast.error('Comment must be 500 characters or less');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/comments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           postId: id,
//           content: newComment,
//           parent: null,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to post comment');
//       }

//       const data = await res.json();
//       setComments(prev => [data, ...prev]);
//       setNewComment('');
//       toast.success('Comment posted!');
//     } catch (err) {
//       toast.error(err.message || 'Error posting comment');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleSave = () => {
//     toast.success('Saved! (Feature coming soon)');
//   };

//   const handleFollow = async () => {
//     if (!session?.user) {
//       setShowLoginPrompt(true);
//       return;
//     }
//     if (!post.author.id) {
//       toast.error('Author ID not available');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await fetch('/api/follow', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ targetUserId: post.author.id }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to toggle follow');
//       }

//       const data = await res.json();
//       setIsFollowing(data.following);
//       toast.success(data.following ? 'Followed!' : 'Unfollowed!');
//     } catch (err) {
//       toast.error(err.message || 'Error toggling follow');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const authorInitial = post?.author?.name ? post.author.name.charAt(0).toUpperCase() : '?';

//   if (loading) {
//     return (
//       <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
//         <LoadingSpinner message="Loading post..." />
//       </section>
//     );
//   }

//   if (error && !post) {
//     return (
//       <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-[calc(100vh-8rem)]">
//         <LoadingSpinner message={error} />
//       </section>
//     );
//   }

//   return (
//     <>
//       {/* Back Button */}
//       <div className="pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <CustomLink href="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition group mb-8 text-sm">
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
//             <span className="break-words">Back to all posts</span>
//           </CustomLink>
//         </div>
//       </div>

//       {/* Messages */}
//       {(error || successMessage) && (
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
//           {error && (
//             <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm mb-2">
//               {error}
//             </div>
//           )}
//           {successMessage && (
//             <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
//               {successMessage}
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
//         {/* TOC Sidebar */}
//         <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 self-start">
//           <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
//             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Zap className="w-4 h-4" />
//               On This Page
//             </h3>
//             <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
//               {tocItems.map((item) => (
//                 <a
//                   key={item.id}
//                   href={`#${item.id}`}
//                   className={`block py-1 px-2 rounded text-sm transition ${
//                     item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                   }`}
//                 >
//                   {item.text}
//                 </a>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Mobile TOC */}
//         <div className="lg:hidden w-full mb-4">
//           <button
//             onClick={() => setTocOpen(!tocOpen)}
//             className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700 text-emerald-400 font-medium transition"
//           >
//             <span className="flex items-center gap-2">
//               <Zap className="w-4 h-4" />
//               Table of Contents
//             </span>
//             {tocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//           </button>
//           {tocOpen && (
//             <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 mt-2 max-h-48 overflow-y-auto">
//               <nav className="space-y-2">
//                 {tocItems.map((item) => (
//                   <a
//                     key={item.id}
//                     href={`#${item.id}`}
//                     className={`block py-2 px-3 rounded text-sm transition ${
//                       item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                     }`}
//                     onClick={() => setTocOpen(false)}
//                   >
//                     {item.text}
//                   </a>
//                 ))}
//               </nav>
//             </div>
//           )}
//         </div>

//         {/* Article */}
//         <article className="flex-1">
//           <div className="max-w-4xl mx-auto">
//             <div className="mb-4">
//               <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
//                 {post?.category || 'Uncategorized'}
//               </span>
//             </div>

//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
//               {post?.title || 'Untitled Post'}
//             </h1>

//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-800">
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span className="text-sm text-slate-300">{post?.author?.name || 'Unknown Author'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span className="text-sm">
//                   {post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span className="text-sm">{post?.readTime || 'N/A'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 <span className="text-sm">{post?.views?.toLocaleString() || 0} views</span>
//               </div>
//             </div>

//             {post?.image && (
//               <div className="relative h-48 sm:h-64 lg:h-96 rounded-2xl overflow-hidden mb-12 bg-slate-900">
//                 <Image src={post.image} alt={post.title || 'Post Image'} fill className="object-cover" />
//               </div>
//             )}

//             <div className="flex flex-wrap gap-2 mb-12">
//               <button
//                 onClick={handleLike}
//                 disabled={actionLoading}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border text-sm ${
//                   userLiked
//                     ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
//                     : 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-slate-300'
//                 } disabled:opacity-50`}
//               >
//                 <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`} />
//                 <span>{likes}</span>
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300">
//                 <MessageCircle className="w-4 h-4" />
//                 <span>{comments.length}</span>
//               </button>
//               <button onClick={handleShare} disabled={actionLoading} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition border border-slate-700 text-sm text-slate-300 disabled:opacity-50">
//                 <Share2 className="w-4 h-4" />
//                 <span>Share</span>
//               </button>
//             </div>

//             {/* Article Content - Now matches CreateTab preview perfectly */}
//             <div id="article-content" className="mb-12 space-y-6">
//               {post?.content ? parseContent(post.content) : <p className="text-slate-400">Content not available.</p>}
//             </div>

//             {/* Comments, Tags, Author Card, Related Posts... (unchanged) */}
//             {/* ... all the rest of your JSX remains exactly the same ... */}

//             <div className="mt-12 pt-8 border-t border-slate-800">
//               <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
//               {session ? (
//                 <form onSubmit={handleCommentSubmit} className="mb-8">
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Add a comment..."
//                     rows="3"
//                     className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 transition resize-none"
//                   />
//                   <button
//                     type="submit"
//                     disabled={actionLoading || !newComment.trim()}
//                     className="mt-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium disabled:opacity-50 transition"
//                   >
//                     {actionLoading ? 'Posting...' : 'Post Comment'}
//                   </button>
//                 </form>
//               ) : (
//                 <p className="text-slate-400 mb-4">
//                   <CustomLink href="/auth/login" className="text-emerald-400">Sign in</CustomLink> to comment.
//                 </p>
//               )}
//               {comments.length > 0 ? (
//                 <div className="space-y-4">
//                   {comments.map((comment, idx) => (
//                     <div key={comment._id || `comment-${idx}`} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
//                           {(comment.author?.charAt(0) || '?').toUpperCase()}
//                         </div>
//                         <div>
//                           <h5 className="text-sm font-medium text-slate-200">{comment.author || 'Anonymous'}</h5>
//                           <p className="text-xs text-slate-400">{comment.date || 'Unknown Date'}</p>
//                         </div>
//                       </div>
//                       <p className="text-slate-300">{comment.content || 'No content'}</p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-slate-400">No comments yet. Be the first!</p>
//               )}
//             </div>

//             <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 mb-8 mt-8">
//               <h4 className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm sm:text-base">
//                 <Zap className="w-5 h-5 flex-shrink-0" />
//                 Quick Tip
//               </h4>
//               <p className="text-slate-300 text-sm sm:text-base">For immediate LCP wins, prioritize above-the-fold images with `picture` elements supporting WebP/AVIF.</p>
//             </div>

//             <div className="mt-12 pt-8 border-t border-slate-800">
//               <h3 className="text-lg font-semibold mb-4">Tags</h3>
//               <div className="flex flex-wrap gap-2">
//                 {post?.tags?.map((tag, idx) => (
//                   <span key={idx} className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-700 cursor-pointer transition">
//                     #{tag}
//                   </span>
//                 )) || <p className="text-slate-400">No tags</p>}
//               </div>
//             </div>

//             <div className="mt-12 p-4 sm:p-6 lg:p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
//               <div className="flex items-start gap-4">
//                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
//                   {authorInitial}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg sm:text-xl font-bold mb-2">{post?.author?.name || 'Unknown Author'}</h3>
//                   <p className="text-slate-400 mb-4 text-sm leading-relaxed">{post?.authorBio || 'Author bio not available'}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-16">
//               <h3 className="text-xl sm:text-2xl font-bold mb-8">Related Articles</h3>
//               <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
//                 {relatedPosts?.map((p) => (
//                   <CustomLink key={p._id} href={`/posts/${p._id}`} className="group p-4 sm:p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition">
//                     <span className="text-xs text-emerald-400 font-medium">{p.category}</span>
//                     <h4 className="text-base sm:text-lg font-semibold mt-2 mb-2 group-hover:text-emerald-400 transition">
//                       {p.title}
//                     </h4>
//                     <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">{p.excerpt}</p>
//                     <div className="flex items-center gap-4 text-xs text-slate-500">
//                       <span>{p.readTime}</span>
//                       <span>{p.views?.toLocaleString() || 0} views</span>
//                     </div>
//                   </CustomLink>
//                 )) || <p className="text-slate-400 col-span-full">No related posts available.</p>}
//               </div>
//             </div>
//           </div>
//         </article>
//       </div>

//       {/* Login Prompt & Copy Toast */}
//       {showLoginPrompt && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
//           <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-center">
//             <h3 className="text-xl font-bold mb-4">Sign In Required</h3>
//             <p className="text-slate-400 mb-6">Please log in to like, comment, or follow users.</p>
//             <div className="flex gap-3">
//               <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium">
//                 Cancel
//               </button>
//               <button onClick={() => router.push('/auth/login')} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium">
//                 Sign In
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {copiedCode && (
//         <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-emerald-500/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm z-50 animate-fade-in">
//           Copied to clipboard!
//         </div>
//       )}

//       <style jsx global>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in { animation: fade-in 0.2s ease-out; }
//         .scroll-mt-20 { scroll-margin-top: 5rem; }
//       `}</style>
//     </>
//   );
// }


















// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import {
//   Clock, User, Calendar, TrendingUp, ArrowLeft, Share2,
//   ThumbsUp, MessageCircle, Zap, ChevronDown, ChevronRight
// } from 'lucide-react';
// import Image from 'next/image';
// import CustomLink from './CustomLink';
// import LoadingSpinner from './LoadingSpinner';
// import toast from 'react-hot-toast';

// // [Your existing processInline, extractHeadings, parseContent functions — unchanged]
// const processInline = (text) => {
//   let result = text;
//   result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
//   result = result.replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>');
//   result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline">$1</a>');
//   result = result.replace(/`(.*?)`/g, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm">$1</code>');
//   return result;
// };

// const extractHeadings = (content = '') => {
//   const lines = content.split('\n');
//   const headings = [];
//   let index = 0;
//   lines.forEach(line => {
//     const t = line.trim();
//     if (t.startsWith('# ')) headings.push({ id: `heading-${index++}`, text: t.slice(2).trim(), level: 'h1' });
//     else if (t.startsWith('## ')) headings.push({ id: `heading-${index++}`, text: t.slice(3).trim(), level: 'h2' });
//     else if (t.startsWith('### ')) headings.push({ id: `heading-${index++}`, text: t.slice(4).trim(), level: 'h3' });
//     else if (t.startsWith('#### ')) headings.push({ id: `heading-${index++}`, text: t.slice(5).trim(), level: 'h4' });
//   });
//   return headings;
// };

// const parseContent = (content) => {
//   const lines = content.split('\n');
//   const elements = [];
//   let i = 0;
//   let headingIndex = 0;

//   while (i < lines.length) {
//     const line = lines[i];
//     const trimmed = line.trim();
//     if (!trimmed) { i++; continue; }

//     if (trimmed.startsWith('# ')) {
//       elements.push(
//         <h1 key={`h1-${headingIndex}`} id={`heading-${headingIndex++}`}
//           className="text-3xl font-bold text-emerald-400 mt-10 mb-5 border-b border-slate-800 pb-4 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(2)) }} />
//       );
//       i++; continue;
//     }
//     if (trimmed.startsWith('## ')) {
//       elements.push(
//         <h2 key={`h2-${headingIndex}`} id={`heading-${headingIndex++}`}
//           className="text-2xl font-bold text-emerald-400 mt-8 mb-4 border-b border-slate-800 pb-4 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(3)) }} />
//       );
//       i++; continue;
//     }
//     if (trimmed.startsWith('### ')) {
//       elements.push(
//         <h3 key={`h3-${headingIndex}`} id={`heading-${headingIndex++}`}
//           className="text-xl font-bold text-cyan-400 mt-6 mb-3 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(4)) }} />
//       );
//       i++; continue;
//     }
//     if (trimmed.startsWith('#### ')) {
//       elements.push(
//         <h4 key={`h4-${headingIndex}`} id={`heading-${headingIndex++}`}
//           className="text-lg font-bold mt-4 mb-2 scroll-mt-20"
//           dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(5)) }} />
//       );
//       i++; continue;
//     }

//     if (trimmed.startsWith('> ')) {
//       let quote = [];
//       while (i < lines.length && lines[i].trim().startsWith('> ')) {
//         quote.push(lines[i].trim().slice(2));
//         i++;
//       }
//       elements.push(
//         <blockquote key={`bq-${elements.length}`}
//           className="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg my-4"
//           dangerouslySetInnerHTML={{ __html: processInline(quote.join(' ')) }} />
//       );
//       continue;
//     }

//     if (trimmed.startsWith('```')) {
//       i++;
//       const codeLines = [];
//       while (i < lines.length && !lines[i].trim().startsWith('```')) {
//         codeLines.push(lines[i]);
//         i++;
//       }
//       i++;
//       elements.push(
//         <pre key={`pre-${elements.length}`}
//           className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 my-6 overflow-x-auto group relative">
//           <code className="text-sm text-slate-300 whitespace-pre">{codeLines.join('\n')}</code>
//         </pre>
//       );
//       continue;
//     }

//     if (/^\d+\.\s/.test(trimmed) || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
//       const isOrdered = /^\d+\.\s/.test(trimmed);
//       const items = [];
//       while (i < lines.length) {
//         const curr = lines[i].trim();
//         if ((isOrdered && /^\d+\.\s/.test(curr)) || (!isOrdered && (curr.startsWith('- ') || curr.startsWith('* ')))) {
//           const text = curr.replace(isOrdered ? /^\d+\.\s+/ : /^[-*]\s+/, '');
//           items.push(
//             <li key={`li-${items.length}`} className="text-slate-300"
//               dangerouslySetInnerHTML={{ __html: processInline(text) }} />
//           );
//           i++;
//         } else break;
//       }
//       if (isOrdered) {
//         elements.push(<ol key={`ol-${elements.length}`} className="my-6 list-decimal list-inside marker:text-emerald-400 text-slate-300 space-y-2 pl-4">{items}</ol>);
//       } else {
//         elements.push(<ul key={`ul-${elements.length}`} className="my-6 list-disc list-inside marker:text-emerald-400 text-slate-300 space-y-2 pl-4">{items}</ul>);
//       }
//       continue;
//     }

//     let para = [line];
//     i++;
//     while (i < lines.length) {
//       const next = lines[i].trim();
//       if (!next || next.startsWith('#') || next.startsWith('> ') || next.startsWith('```') || /^\d+\.\s/.test(next) || next.startsWith('- ') || next.startsWith('* ')) break;
//       para.push(lines[i]);
//       i++;
//     }
//     elements.push(
//       <p key={`p-${elements.length}`} className="text-slate-300 leading-relaxed mb-6"
//         dangerouslySetInnerHTML={{ __html: processInline(para.join(' ').trim()) }} />
//     );
//   }
//   return elements;
// };

// export default function ClientPostView({ id, dummyPost, dummyRelatedPosts, baseUrl }) {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [post, setPost] = useState(null);           // ← will be filled from API
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [copiedCode, setCopiedCode] = useState(null);
//   const [likes, setLikes] = useState(0);
//   const [userLiked, setUserLiked] = useState(false);
//   const [tocOpen, setTocOpen] = useState(false);

//   const tocItems = useMemo(() => extractHeadings(post?.content), [post?.content]);

//   // === FETCH REAL POST + LIKES + RELATED ===
//   useEffect(() => {
//     if (!id) return;

//     async function loadData() {
//       setLoading(true);
//       setError(null);

//       try {
//         // 1. Fetch the actual post
//         const postRes = await fetch(`/api/posts/${id}`, { cache: 'no-store' });
//         if (!postRes.ok) throw new Error('Post not found');

//         const postData = await postRes.json();

//         // Normalize author & date
//         const normalizedPost = {
//           ...postData,
//           author: typeof postData.author === 'object' ? postData.author : { name: postData.author || 'Unknown' },
//           date: postData.createdAt ? new Date(postData.createdAt).toISOString().split('T')[0] : postData.date,
//         };

//         setPost(normalizedPost);
//         setLikes(postData.likes || 0);

//         // 2. Fetch likes status (if user logged in)
//         if (session?.user) {
//           try {
//             const likeRes = await fetch(`/api/likes?postId=${id}`);
//             if (likeRes.ok) {
//               const likeData = await likeRes.json();
//               setUserLiked(likeData.userLiked || false);
//             }
//           } catch (e) { /* ignore */ }
//         }

//         // 3. Fetch related posts
//         try {
//           const relRes = await fetch(`/api/posts?category=${normalizedPost.category}&excludeId=${id}&limit=3`);
//           if (relRes.ok) {
//             const rel = await relRes.json();
//             setRelatedPosts(rel.length ? rel : dummyRelatedPosts);
//           }
//         } catch (e) {
//           setRelatedPosts(dummyRelatedPosts);
//         }

//       } catch (err) {
//         console.error(err);
//         setError('Failed to load post');
//         setPost(dummyPost);               // ← fallback
//         setRelatedPosts(dummyRelatedPosts);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [id, session?.user, dummyPost, dummyRelatedPosts]);

//   // === COPY BUTTONS FOR CODE BLOCKS ===
//   useEffect(() => {
//     const pres = document.querySelectorAll('pre');
//     pres.forEach(pre => {
//       if (!pre.querySelector('.copy-btn')) {
//         const btn = document.createElement('button');
//         btn.className = 'copy-btn absolute top-2 right-2 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition text-slate-300 z-10';
//         btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
//         btn.onclick = (e) => {
//           e.stopPropagation();
//           const code = pre.querySelector('code')?.textContent || '';
//           navigator.clipboard.writeText(code).then(() => {
//             setCopiedCode(pre);
//             setTimeout(() => setCopiedCode(null), 2000);
//           });
//         };
//         pre.appendChild(btn);
//       }
//     });

//     return () => document.querySelectorAll('.copy-btn').forEach(b => b.remove());
//   }, [post?.content]);

//   // === LIKE HANDLER ===
//   const handleLike = async () => {
//     if (!session) {
//       toast.error('Log in to like posts');
//       return;
//     }

//     try {
//       const res = await fetch('/api/likes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ postId: id }),
//       });

//       const data = await res.json();
//       setUserLiked(data.liked);
//       setLikes(prev => data.liked ? prev + 1 : prev - 1);
//       toast.success(data.liked ? 'Liked!' : 'Unliked');
//     } catch (err) {
//       toast.error('Failed to update like');
//     }
//   };

//   // === SHARE HANDLER ===
//   const handleShare = async () => {
//     const url = `${baseUrl || ''}/posts/${id}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: post.title, url }); }
//       catch { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
//     } else {
//       navigator.clipboard.writeText(url);
//       toast.success('Link copied!');
//     }
//   };

//   // Loading & Error States
//   if (loading) return <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-screen"><LoadingSpinner message="Loading post..." /></section>;
//   if (error && !post) return <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-screen text-red-400">{error}</section>;

//   return (
//     <>
//       {/* Back Button */}
//       <div className="pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <CustomLink href="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition group mb-8 text-sm">
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" /> Back to all posts
//           </CustomLink>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">

//         {/* Desktop TOC */}
//         <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 self-start">
//           <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
//             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> On This Page</h3>
//             <nav className="space-y-2">
//               {tocItems.map(item => (
//                 <a key={item.id} href={`#${item.id}`} className={`block py-1 px-2 rounded text-sm transition hover:bg-slate-700/50 ${
//                   item.level === 'h3' ? 'ml-4 text-slate-400' :
//                   item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                 }`}>{item.text}</a>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Mobile TOC */}
//         <div className="lg:hidden mb-6">
//           <button onClick={() => setTocOpen(!tocOpen)} className="w-full flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700 text-emerald-400 font-medium">
//             <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Table of Contents</span>
//             {tocOpen ? <ChevronDown /> : <ChevronRight />}
//           </button>
//           {tocOpen && (
//             <div className="mt-2 bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
//               {tocItems.map(item => (
//                 <a key={item.id} href={`#${item.id}`} onClick={() => setTocOpen(false)} className={`block py-2 px-3 text-sm ${
//                   item.level === 'h3' ? 'ml-4 text-slate-400' :
//                   item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'
//                 }`}>{item.text}</a>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Main Article */}
//         <article className="flex-1">
//           <div className="max-w-4xl mx-auto">
//             <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
//               {post?.category || 'Uncategorized'}
//             </span>

//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 mb-6 leading-tight">
//               {post?.title || 'Untitled Post'}
//             </h1>

//             <div className="flex flex-wrap gap-4 text-slate-400 pb-8 border-b border-slate-800 mb-8">
//               <div className="flex items-center gap-2"><User className="w-4 h-4" /><span className="text-sm text-slate-300">{post?.author?.name || 'Unknown'}</span></div>
//               <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="text-sm">{post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}</span></div>
//               <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span className="text-sm">{post?.readTime || 'N/A'}</span></div>
//               <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span className="text-sm">{post?.views?.toLocaleString() || 0} views</span></div>
//             </div>

//             {post?.image && (
//               <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-12">
//                 <Image src={post.image} alt={post.title} fill className="object-cover" />
//               </div>
//             )}

//             <div className="flex flex-wrap gap-3 mb-12">
//               <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${userLiked ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700'}`}>
//                 <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-emerald-400' : ''}`} /> {likes}
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm">
//                 <MessageCircle className="w-4 h-4" /> Comments
//               </button>
//               <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm hover:bg-slate-700/70 transition">
//                 <Share2 className="w-4 h-4" /> Share
//               </button>
//             </div>

//             <div className="prose prose-invert max-w-none">
//               {post?.content ? parseContent(post.content) : <p className="text-slate-400">No content available.</p>}
//             </div>
//           </div>
//         </article>
//       </div>

//       {/* Copy success toast */}
//       {copiedCode && (
//         <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg z-50 animate-pulse">
//           Copied!
//         </div>
//       )}
//     </>
//   );
// }













'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Clock, User, Calendar, TrendingUp, ArrowLeft, Share2,
  ThumbsUp, MessageCircle, Zap, ChevronDown, ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import CustomLink from './CustomLink';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const processInline = (text) => {
  let result = text;
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  result = result.replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>');
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline">$1</a>');
  result = result.replace(/`(.*?)`/g, '<code class="text-emerald-400 bg-slate-900/50 px-2 py-1 rounded text-sm">$1</code>');
  return result;
};

const extractHeadings = (content = '') => {
  const lines = content.split('\n');
  const headings = [];
  let index = 0;
  lines.forEach(line => {
    const t = line.trim();
    if (t.startsWith('# ')) headings.push({ id: `heading-${index++}`, text: t.slice(2).trim(), level: 'h1' });
    else if (t.startsWith('## ')) headings.push({ id: `heading-${index++}`, text: t.slice(3).trim(), level: 'h2' });
    else if (t.startsWith('### ')) headings.push({ id: `heading-${index++}`, text: t.slice(4).trim(), level: 'h3' });
    else if (t.startsWith('#### ')) headings.push({ id: `heading-${index++}`, text: t.slice(5).trim(), level: 'h4' });
  });
  return headings;
};

const parseContent = (content) => {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let headingIndex = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${headingIndex}`} id={`heading-${headingIndex++}`}
          className="text-3xl font-bold text-emerald-400 mt-10 mb-5 border-b border-slate-800 pb-4 scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(2)) }} />
      );
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${headingIndex}`} id={`heading-${headingIndex++}`}
          className="text-2xl font-bold text-emerald-400 mt-8 mb-4 border-b border-slate-800 pb-4 scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(3)) }} />
      );
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${headingIndex}`} id={`heading-${headingIndex++}`}
          className="text-xl font-bold text-cyan-400 mt-6 mb-3 scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(4)) }} />
      );
      i++; continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${headingIndex}`} id={`heading-${headingIndex++}`}
          className="text-lg font-bold mt-4 mb-2 scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(5)) }} />
      );
      i++; continue;
    }

    if (trimmed.startsWith('> ')) {
      let quote = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quote.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${elements.length}`}
          className="bg-emerald-500/10 border-l-4 border-emerald-500 pl-4 py-3 italic text-slate-200 rounded-r-lg my-4"
          dangerouslySetInnerHTML={{ __html: processInline(quote.join(' ')) }} />
      );
      continue;
    }

    if (trimmed.startsWith('```')) {
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre key={`pre-${elements.length}`}
          className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 my-6 overflow-x-auto group relative">
          <code className="text-sm text-slate-300 whitespace-pre">{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    if (/^\d+\.\s/.test(trimmed) || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const isOrdered = /^\d+\.\s/.test(trimmed);
      const items = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        if ((isOrdered && /^\d+\.\s/.test(curr)) || (!isOrdered && (curr.startsWith('- ') || curr.startsWith('* ')))) {
          const text = curr.replace(isOrdered ? /^\d+\.\s+/ : /^[-*]\s+/, '');
          items.push(
            <li key={`li-${items.length}`} className="text-slate-300"
              dangerouslySetInnerHTML={{ __html: processInline(text) }} />
          );
          i++;
        } else break;
      }
      if (isOrdered) {
        elements.push(<ol key={`ol-${elements.length}`} className="my-6 list-decimal list-inside marker:text-emerald-400 text-slate-300 space-y-2 pl-4">{items}</ol>);
      } else {
        elements.push(<ul key={`ul-${elements.length}`} className="my-6 list-disc list-inside marker:text-emerald-400 text-slate-300 space-y-2 pl-4">{items}</ul>);
      }
      continue;
    }

    let para = [line];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next || next.startsWith('#') || next.startsWith('> ') || next.startsWith('```') || /^\d+\.\s/.test(next) || next.startsWith('- ') || next.startsWith('* ')) break;
      para.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={`p-${elements.length}`} className="text-slate-300 leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: processInline(para.join(' ').trim()) }} />
    );
  }
  return elements;
};

export default function ClientPostView({ id, dummyPost, dummyRelatedPosts, baseUrl }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const tocItems = useMemo(() => extractHeadings(post?.content), [post?.content]);

  // FIXED: No more infinite refresh + correct related posts category
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setLoading(true);
      try {
        // Use dummy category only on first load, then real post.category
        const categoryToUse = post?.category || dummyPost?.category || 'general';

        const [postRes, commentsRes, likesRes, relatedRes] = await Promise.all([
          fetch(`/api/posts/${id}`, { cache: 'no-store' }),
          fetch(`/api/comments?postId=${id}`, { cache: 'no-store' }),
          session?.user ? fetch(`/api/likes?postId=${id}`) : Promise.resolve(null),
          fetch(`/api/posts?category=${categoryToUse}&excludeId=${id}&limit=3`, { cache: 'no-store' })
        ]);

        if (!postRes.ok) throw new Error('Post not found');
        const postData = await postRes.json();

        const normalizedPost = {
          ...postData,
          author: typeof postData.author === 'object' 
            ? postData.author 
            : { name: postData.author || 'Unknown', id: postData.authorId },
          date: postData.createdAt 
            ? new Date(postData.createdAt).toISOString().split('T')[0] 
            : postData.date,
        };
        setPost(normalizedPost);
        setLikes(postData.likes || 0);

        // Comments with real names
        const commentsData = commentsRes.ok ? await commentsRes.json() : [];
        setComments(commentsData.map(c => ({
          ...c,
          authorName: typeof c.author === 'object' ? c.author.name : c.author || 'Anonymous',
          authorInitial: (typeof c.author === 'object' ? c.author.name?.[0] : c.author?.[0]) || '?',
          date: new Date(c.createdAt).toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
          })
        })));

        if (likesRes && likesRes.ok) {
          const likesData = await likesRes.json();
          setUserLiked(likesData.userLiked || false);
        }

        const relatedData = relatedRes.ok ? await relatedRes.json() : dummyRelatedPosts;
        setRelatedPosts(relatedData.length ? relatedData : dummyRelatedPosts);

      } catch (err) {
        console.error(err);
        setError('Failed to load post');
        setPost(dummyPost);
        setRelatedPosts(dummyRelatedPosts);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, session?.user]); // ← Only these two dependencies! No dummyPost, no post.category

  useEffect(() => {
    const pres = document.querySelectorAll('pre');
    pres.forEach(pre => {
      if (!pre.querySelector('.copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn absolute top-2 right-2 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition text-slate-300 z-10';
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        btn.onclick = (e) => {
          e.stopPropagation();
          const code = pre.querySelector('code')?.textContent || '';
          navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(pre);
            setTimeout(() => setCopiedCode(null), 2000);
          });
        };
        pre.appendChild(btn);
      }
    });
    return () => document.querySelectorAll('.copy-btn').forEach(b => b.remove());
  }, [post?.content]);

  const handleLike = async () => {
    if (!session) {
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
      const data = await res.json();
      setUserLiked(data.liked);
      setLikes(prev => data.liked ? prev + 1 : prev - 1);
      toast.success(data.liked ? 'Liked!' : 'Unliked');
    } catch {
      toast.error('Failed to update like');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${baseUrl || ''}/posts/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {}
    }
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  // const handleCommentSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!session) {
  //     setShowLoginPrompt(true);
  //     return;
  //   }
  //   if (!newComment.trim()) return toast.error('Comment cannot be empty');
  //   setActionLoading(true);
  //   try {
  //     const res = await fetch('/api/comments', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ postId: id, content: newComment }),
  //     });
  //     const data = await res.json();
  //     setComments(prev => [data, ...prev]);
  //     setNewComment('');
  //     toast.success('Comment posted!');
  //   } catch {
  //     toast.error('Failed to post comment');
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };


    const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, content: newComment }),
      });
      if (!res.ok) throw new Error('Failed to post');
      
      const data = await res.json();
      
      // Add new comment instantly with correct name
      setComments(prev => [{
        ...data,
        authorName: session.user.name || 'You',
        authorInitial: session.user.name?.[0]?.toUpperCase() || '?',
        date: 'Just now'
      }, ...prev]);
      
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-screen"><LoadingSpinner message="Loading post..." /></section>;
  if (error && !post) return <section className="pt-24 sm:pt-32 flex items-center justify-center min-h-screen text-red-400">{error}</section>;

  const authorInitial = post?.author?.name?.[0]?.toUpperCase() || '?';

  return (
    <>
      <div className="pt-24 sm:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <CustomLink href="/posts" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition group mb-8 text-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" /> Back to all posts
          </CustomLink>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 self-start">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> On This Page</h3>
            <nav className="space-y-2">
              {tocItems.map(item => (
                <a key={item.id} href={`#${item.id}`} className={`block py-1 px-2 rounded text-sm transition hover:bg-slate-700/50 ${item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'}`}>
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="lg:hidden mb-6">
          <button onClick={() => setTocOpen(!tocOpen)} className="w-full flex justify-between items-center px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700 text-emerald-400 font-medium">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Table of Contents</span>
            {tocOpen ? <ChevronDown /> : <ChevronRight />}
          </button>
          {tocOpen && (
            <div className="mt-2 bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              {tocItems.map(item => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setTocOpen(false)} className={`block py-2 px-3 text-sm ${item.level === 'h3' ? 'ml-4 text-slate-400' : item.level === 'h4' ? 'ml-8 text-slate-500' : 'text-slate-300 hover:text-emerald-400'}`}>
                  {item.text}
                </a>
              ))}
            </div>
          )}
        </div>

        <article className="flex-1">
          <div className="max-w-4xl mx-auto">
            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
              {post?.category || 'Uncategorized'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 mb-6 leading-tight">{post?.title || 'Untitled Post'}</h1>

            <div className="flex flex-wrap gap-4 text-slate-400 pb-8 border-b border-slate-800 mb-8">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /><span className="text-sm text-slate-300">{post?.author?.name || 'Unknown'}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="text-sm">{post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span className="text-sm">{post?.readTime || 'N/A'}</span></div>
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span className="text-sm">{post?.views?.toLocaleString() || 0} views</span></div>
            </div>

            {post?.image && (
              <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-12">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-12">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${userLiked ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700'}`}>
                <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-emerald-400' : ''}`} /> {likes}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm">
                <MessageCircle className="w-4 h-4" /> {comments.length}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm hover:bg-slate-700/70 transition">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              {post?.content ? parseContent(post.content) : <p className="text-slate-400">No content available.</p>}
            </div>

            {/* === ALL RICH SECTIONS BELOW === */}
            <div className="mt-16 space-y-16">

            {/* Comments Section - Now shows real names! */}
            <div className="mt-16 pt-8 border-t border-slate-800 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-8">Comments ({comments.length})</h3>

              {session ? (
                <form onSubmit={handleCommentSubmit} className="mb-10">
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your thoughts..."
                    rows="4" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 transition resize-none" />
                  <button type="submit" disabled={actionLoading || !newComment.trim()}
                    className="mt-3 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium disabled:opacity-50">
                    {actionLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <p className="text-slate-400 mb-8">Sign in to comment.</p>
              )}

              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map(c => (
                    <div key={c._id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {c.authorInitial.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{c.authorName}</p>
                          <p className="text-xs text-slate-400">{c.date}</p>
                        </div>
                      </div>
                      <p className="text-slate-300">{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No comments yet. Be the first!</p>
              )}
            </div>

              {/* Quick Tip */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-cyan-400 font-semibold mb-3"><Zap className="w-5 h-5" /> Quick Tip</h4>
                <p className="text-slate-300">Use modern image formats and lazy loading for instant LCP gains.</p>
              </div>

              {/* Tags */}
              {post?.tags?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-300">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Card */}
              <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    {authorInitial}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{post?.author?.name}</h3>
                    <p className="text-slate-400 mt-2">{post?.authorBio || 'Passionate developer sharing knowledge.'}</p>
                  </div>
                </div>
              </div>


              {/* Related Posts - Always shows up to 3 */}
              {relatedPosts.length > 0 && (
                <div className="mt-20">
                  <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.slice(0, 3).map(p => (
                      <CustomLink 
                        key={p._id} 
                        href={`/posts/${p._id}`} 
                        className="group block bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-5">
                          {p.image && (
                            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                              <Image 
                                src={p.image} 
                                alt={p.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <h4 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition line-clamp-2 mb-2">
                            {p.title}
                          </h4>
                          <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                            {p.excerpt || 'No preview available'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{p.readTime || '5 min read'}</span>
                            <span>•</span>
                            <span>{p.views?.toLocaleString() || 0} views</span>
                          </div>
                        </div>
                      </CustomLink>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </article>
      </div>

      

      {/* Login Prompt & Copy Toast */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-4">Sign In Required</h3>
            <p className="text-slate-400 mb-8">You need to be logged in to like or comment.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-3 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={() => router.push('/auth/login')} className="flex-1 py-3 bg-emerald-500 rounded-lg font-medium">Sign In</button>
            </div>
          </div>
        </div>
      )}

      {copiedCode && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg z-50 animate-pulse">
          Copied!
        </div>
      )}
    </>
  );
}