// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession, signOut } from 'next-auth/react';
// import Image from 'next/image';
// import {
//   Zap, Menu, X, Home, FileText, PlusCircle, Settings, User,
//   TrendingUp, Eye, ThumbsUp, MessageCircle, BarChart3,
//   Clock, Edit, Trash2, Search, Filter, Bell, LogOut,
//   Activity, Users, BookOpen, Calendar, Upload, Image as ImageIcon,
//   Bold, Italic, List, ListOrdered, Code, Quote, Link2, Type
// } from 'lucide-react';
// import Link from 'next/link';
// import PostCard from './PostCard';
// import StatsGrid from './StatsGrid';
// import CustomLink from './CustomLink';

// const recentActivity = [];

// export default function Dashboard({ initialPosts = [], baseUrl }) {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   // Compute userId early (before hooks)
//   const currentUserId = session?.user?.id;

//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showDiscardDialog, setShowDiscardDialog] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   const [userPosts, setUserPosts] = useState(initialPosts);
//   const [loadingPosts, setLoadingPosts] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [stats, setStats] = useState([
//     { label: "Total Views", value: "0", change: "+0%", icon: Eye, color: "emerald" },
//     { label: "Total Posts", value: "0", change: "+0", icon: FileText, color: "cyan" },
//     { label: "Total Likes", value: "0", change: "+0%", icon: ThumbsUp, color: "blue" },
//     { label: "Followers", value: "0", change: "+0%", icon: Users, color: "purple" }
//   ]);

//   // Create post form states
//   const [newPost, setNewPost] = useState({
//     title: '',
//     content: '',
//     excerpt: '',
//     authorBio: '',
//     readTime: '',
//     category: 'Performance',
//     tags: '',
//     image: ''
//   });
//   const [imagePreview, setImagePreview] = useState('');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const textareaRef = useRef(null);

//   // Fetch user posts and dashboard stats
//   useEffect(() => {
//     if (!currentUserId || !baseUrl) return;

//     async function fetchUserPosts() {
//       setLoadingPosts(true);
//       try {
//         const res = await fetch(`/api/posts?userId=${currentUserId}`, {
//           cache: 'no-store',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!res.ok) {
//           throw new Error('Failed to fetch user posts');
//         }

//         const data = await res.json();
//         const formattedPosts = data.map(post => ({
//           ...post,
//           date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
//         }));

//         setUserPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
//       } catch (error) {
//         setError(error.message || 'Error fetching posts');
//         setUserPosts(initialPosts);
//       } finally {
//         setLoadingPosts(false);
//       }
//     }

//     async function fetchDashboardStats() {
//       try {
//         const response = await fetch('/api/dashboard', {
//           cache: 'no-store',
//           headers: {
//             // Authorization header added by NextAuth.js
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to fetch stats');
//         }

//         const data = await response.json();
//         setStats([
//           { label: 'Total Views', value: data.totalViews.toLocaleString(), change: '+0%', icon: Eye, color: 'emerald' },
//           { label: 'Total Posts', value: data.totalPosts.toLocaleString(), change: '+0', icon: FileText, color: 'cyan' },
//           { label: 'Total Likes', value: data.totalLikes.toLocaleString(), change: '+0%', icon: ThumbsUp, color: 'blue' },
//           { label: 'Followers', value: data.followers.toLocaleString(), change: '+0%', icon: Users, color: 'purple' },
//         ]);
//       } catch (err) {
//         setError(err.message || 'Error fetching dashboard stats');
//       }
//     }

//     fetchUserPosts();
//     fetchDashboardStats();
//   }, [currentUserId, baseUrl, initialPosts]);

//   // Early return after hooks
//   if (status === 'loading') {
//     return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
//   }

//   if (!session?.user) {
//     router.push('/auth/login');
//     return null;
//   }

//   const filteredPosts = userPosts.filter(post =>
//     post.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const menuItems = [
//     { id: 'overview', label: 'Overview', icon: Home },
//     { id: 'posts', label: 'My Posts', icon: FileText },
//     { id: 'create', label: 'Create Post', icon: PlusCircle },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3 },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       await signOut({ callbackUrl: '/auth/login' });
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     if (postToDelete?._id === postId) {
//       setSubmitting(true);
//       setError('');
//       setSuccessMessage('');
//       try {
//         const response = await fetch(`/api/posts/${postId}`, {
//           method: 'DELETE',
//           headers: {
//             // Authorization header added by NextAuth.js
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to delete post');
//         }

//         await fetchUserPosts();
//         setSuccessMessage('Post deleted successfully!');
//       } catch (err) {
//         setError(err.message || 'Error deleting post');
//       } finally {
//         setSubmitting(false);
//         setShowDeleteDialog(false);
//         setPostToDelete(null);
//       }
//     }
//   };

//   async function fetchUserPosts() {
//     setLoadingPosts(true);
//     try {
//       const res = await fetch(`/api/posts?userId=${currentUserId}`, {
//         cache: 'no-store',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!res.ok) {
//         throw new Error('Failed to fetch user posts');
//       }

//       const data = await res.json();
//       const formattedPosts = data.map(post => ({
//         ...post,
//         date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
//       }));

//       setUserPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
//     } catch (error) {
//       setError(error.message || 'Error fetching posts');
//       setUserPosts(initialPosts);
//     } finally {
//       setLoadingPosts(false);
//     }
//   }

//   const handleEditPost = (postId) => {
//     router.push(`/posts/${postId}/edit`);
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setError('Please select an image file');
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image size should be less than 5MB');
//       return;
//     }

//     setUploadingImage(true);
//     setError('');
//     setSuccessMessage('');
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to upload image');
//       }

//       const data = await response.json();
//       setNewPost((prev) => ({ ...prev, image: data.url }));
//       setImagePreview(data.url);
//       setSuccessMessage('Image uploaded successfully!');
//     } catch (err) {
//       setError(err.message || 'Error uploading image');
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleCreatePost = async (e) => {
//     e.preventDefault();
//     setCreating(true);
//     setError('');
//     setSuccessMessage('');
//     try {
//       const response = await fetch(`/api/posts`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...newPost,
//           tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//           author: currentUserId,
//           authorBio: newPost.authorBio || 'Content Creator'
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create post');
//       }

//       const responseData = await response.json();
//       if (responseData.post) {
//         setNewPost({
//           title: '',
//           content: '',
//           excerpt: '',
//           authorBio: '',
//           readTime: '',
//           category: 'Performance',
//           tags: '',
//           image: ''
//         });
//         setImagePreview('');
//         setShowPreview(false);
//         await fetchUserPosts();
//         setActiveTab('posts');
//         setSuccessMessage('Post created successfully!');
//       }
//     } catch (error) {
//       setError(error.message || 'Error creating post');
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleDeleteClick = (post) => {
//     setPostToDelete(post);
//     setShowDeleteDialog(true);
//   };

//   // Rich Text Editor Functions
//   const insertFormatting = (before, after = '') => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;
    
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = newPost.content.substring(start, end);
//     const newText = newPost.content.substring(0, start) + before + selectedText + after + newPost.content.substring(end);
    
//     setNewPost(prev => ({ ...prev, content: newText }));
    
//     setTimeout(() => {
//       const newPos = start + before.length + selectedText.length;
//       textarea.setSelectionRange(newPos, newPos);
//       textarea.focus();
//     }, 0);
//   };

//   const formatHandlers = {
//     bold: () => insertFormatting('**', '**'),
//     italic: () => insertFormatting('*', '*'),
//     heading1: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '# ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     heading2: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '## ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     heading3: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '### ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     bulletList: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '- ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     numberedList: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '1. ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     code: () => insertFormatting('`', '`'),
//     codeBlock: () => insertFormatting('\n```\n', '\n```\n'),
//     quote: () => {
//       const textarea = textareaRef.current;
//       if (!textarea) return;
//       const start = textarea.selectionStart;
//       const lineStart = newPost.content.lastIndexOf('\n', start - 1) + 1;
//       const newText = newPost.content.substring(0, lineStart) + '> ' + newPost.content.substring(lineStart);
//       setNewPost(prev => ({ ...prev, content: newText }));
//       textarea.focus();
//     },
//     link: () => {
//       const url = prompt('Enter URL:');
//       if (url) insertFormatting('[', `](${url})`);
//     },
//     image: () => {
//       const url = prompt('Enter image URL:');
//       if (url) insertFormatting(`![Image](${url})\n`);
//     }
//   };

//   const markdownToHtml = (markdown) => {
//     let html = markdown;
//     html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-cyan-400">$1</h3>');
//     html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-emerald-400">$1</h2>');
//     html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 text-emerald-400">$1</h1>');
//     html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
//     html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
//     html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm text-emerald-400">$1</code></pre>');
//     html = html.replace(/`(.*?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-emerald-400 text-sm">$1</code>');
//     html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 underline hover:text-emerald-300">$1</a>');
//     html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />');
//     html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-slate-300 my-4">$1</blockquote>');
//     html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 my-1">$1</li>');
//     html = html.replace(/^- (.*$)/gim, '<li class="ml-6 my-1">$1</li>');
//     html = html.split('\n\n').map(para => {
//       if (!para.match(/^<[h|u|o|p|b|l]/)) {
//         return `<p class="mb-4 text-slate-300 leading-relaxed">${para}</p>`;
//       }
//       return para;
//     }).join('\n');
//     return html;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-16 sm:pt-20">
//       {/* Sidebar */}
//       <aside className={`fixed top-16 sm:top-20 bottom-0 left-0 z-40 w-64 bg-slate-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-slate-700`}>
//         <div className="flex items-center justify-between p-4 border-b border-slate-700">
//           <h2 className="text-xl font-bold">Dashboard</h2>
//           <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         <nav className="mt-6 px-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
//                   activeTab === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>
//         <div className="absolute bottom-4 left-4 right-4">
//           <button onClick={() => setShowLogoutDialog(true)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-lg transition">
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* Main Content */}
//       <main className="lg:ml-64 p-4 sm:p-6 min-h-screen">
//         {/* Header with Menu Button and Title */}
//         <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden p-2 bg-slate-800/50 rounded-lg border border-slate-700"
//             >
//               <Menu className="w-6 h-6 text-slate-300" />
//             </button>
//             <h1 className="text-2xl font-bold">Dashboard</h1>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-slate-400">
//             <User className="w-4 h-4" />
//             <span className="hidden sm:inline">Welcome back,</span> {session?.user?.name || session?.user?.email}
//           </div>
//         </div>

//         {/* Global Error/Success Messages */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
//             {error}
//           </div>
//         )}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
//             {successMessage}
//           </div>
//         )}

//         {/* Tabs Content */}
//         {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} stats={stats} />}
//         {activeTab === 'posts' && <PostsTab posts={filteredPosts} searchQuery={searchQuery} onSearchChange={setSearchQuery} onEdit={handleEditPost} onDelete={handleDeleteClick} loading={loadingPosts} />}
//         {activeTab === 'create' && (
//           <CreateTab 
//             newPost={newPost} 
//             setNewPost={setNewPost} 
//             onCreate={handleCreatePost} 
//             creating={creating} 
//             imagePreview={imagePreview} 
//             setImagePreview={setImagePreview} 
//             onImageUpload={handleImageUpload} 
//             uploadingImage={uploadingImage}
//             showPreview={showPreview}
//             setShowPreview={setShowPreview}
//             textareaRef={textareaRef}
//             formatHandlers={formatHandlers}
//             markdownToHtml={markdownToHtml}
//           />
//         )}
//         {activeTab === 'analytics' && <AnalyticsTab />}
//         {activeTab === 'settings' && <SettingsTab />}

//         {/* Delete Dialog */}
//         {showDeleteDialog && postToDelete && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//             <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
//                   <Trash2 className="w-6 h-6 text-red-400" />
//                 </div>
//                 <h3 className="text-xl font-bold">Delete Post</h3>
//               </div>
//               <p className="text-slate-400 mb-2">Are you sure you want to delete this post?</p>
//               <p className="text-white font-medium mb-4 p-3 bg-slate-800/50 rounded-lg">&quot;{postToDelete.title}&quot;</p>
//               <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
//               {error && (
//                 <p className="text-red-400 text-sm mb-4">{error}</p>
//               )}
//               {successMessage && (
//                 <p className="text-emerald-400 text-sm mb-4">{successMessage}</p>
//               )}
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => { setShowDeleteDialog(false); setPostToDelete(null); setError(''); setSuccessMessage(''); }}
//                   className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeletePost(postToDelete._id)}
//                   disabled={submitting}
//                   className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition disabled:opacity-50"
//                 >
//                   {submitting ? 'Deleting...' : 'Delete Post'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Logout Dialog */}
//         {showLogoutDialog && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//             <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
//               <h3 className="text-xl font-bold mb-4">Log out?</h3>
//               <p className="text-slate-400 mb-6">You will be redirected to the login page.</p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowLogoutDialog(false)}
//                   className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
//                   disabled={isLoggingOut}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   disabled={isLoggingOut}
//                   className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {isLoggingOut ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Logging Out...
//                     </>
//                   ) : (
//                     'Log Out'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// // Sub-Tab Components
// function OverviewTab({ setActiveTab, stats }) {
//   return (
//     <div>
//       <StatsGrid stats={stats} />
//       <div className="grid md:grid-cols-2 gap-6 mt-8">
//         <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
//           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <Activity className="w-5 h-5 text-emerald-400" />
//             Recent Activity
//           </h3>
//           {recentActivity.length === 0 ? (
//             <p className="text-sm text-slate-400">No activity yet. Create a post to get started!</p>
//           ) : (
//             <ul className="space-y-3">
//               {recentActivity.map((activity, idx) => (
//                 <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
//                   <div className="w-2 h-2 bg-emerald-400 rounded-full" />
//                   <span>{activity.user} {activity.action} &quot;{activity.post || 'your profile'}&quot; - {activity.time}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
//           <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//           <div className="space-y-3">
//             <button onClick={() => setActiveTab('create')} className="w-full text-left p-3 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition">
//               <PlusCircle className="inline w-4 h-4 mr-2" /> New Post
//             </button>
//             <button className="w-full text-left p-3 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30 transition">
//               <BarChart3 className="inline w-4 h-4 mr-2" /> View Analytics
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PostsTab({ posts, searchQuery, onSearchChange, onEdit, onDelete, loading }) {
//   if (loading) {
//     return <div className="text-center py-16">Loading posts...</div>;
//   }

//   return (
//     <div>
//       <div className="flex gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search your posts..."
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {posts.map(post => (
//           <PostCard key={post._id} post={post} isAdmin onEdit={onEdit} onDelete={onDelete} />
//         ))}
//       </div>
//       {posts.length === 0 && (
//         <div className="text-center py-16">
//           <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-slate-300 mb-2">No posts yet</h3>
//           <p className="text-sm text-slate-400 mb-4">Create your first post to get started</p>
//         </div>
//       )}
//     </div>
//   );
// }

// function CreateTab({ 
//   newPost, 
//   setNewPost, 
//   onCreate, 
//   creating, 
//   imagePreview, 
//   setImagePreview, 
//   onImageUpload, 
//   uploadingImage,
//   showPreview,
//   setShowPreview,
//   textareaRef,
//   formatHandlers,
//   markdownToHtml
// }) {
//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
//         <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <PlusCircle className="w-6 h-6 text-emerald-400" />
//           Create New Post
//         </h3>

//         <form onSubmit={onCreate} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">Post Title *</label>
//             <input
//               type="text"
//               required
//               value={newPost.title}
//               onChange={(e) => setNewPost({...newPost, title: e.target.value})}
//               placeholder="e.g., Optimizing React Performance: Core Web Vitals Deep Dive"
//               className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt *</label>
//             <textarea
//               required
//               value={newPost.excerpt}
//               onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
//               placeholder="Brief description that appears in post previews..."
//               rows="3"
//               className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
//             />
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
//               <input
//                 type="text"
//                 value={newPost.readTime}
//                 onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
//                 placeholder="e.g., 8 min read"
//                 className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//               />
//             </div>
//           </div>

//           {/* Rich Text Editor Section */}
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <label className="block text-sm font-medium text-slate-300">
//                 Content * (Use toolbar for formatting)
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setShowPreview(!showPreview)}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
//               >
//                 {showPreview ? (
//                   <>
//                     <Type className="w-4 h-4" />
//                     Edit
//                   </>
//                 ) : (
//                   <>
//                     <Eye className="w-4 h-4" />
//                     Preview
//                   </>
//                 )}
//               </button>
//             </div>

//             {!showPreview ? (
//               <>
//                 {/* Formatting Toolbar */}
//                 <div className="bg-slate-900/50 border border-slate-700 rounded-t-lg p-2 flex flex-wrap gap-1">
//                   <button
//                     type="button"
//                     onClick={formatHandlers.heading1}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Heading 1"
//                   >
//                     <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">H1</div>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.heading2}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Heading 2"
//                   >
//                     <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">H2</div>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.heading3}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Heading 3"
//                   >
//                     <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">H3</div>
//                   </button>
//                   <div className="w-px bg-slate-700 mx-1" />
//                   <button
//                     type="button"
//                     onClick={formatHandlers.bold}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Bold"
//                   >
//                     <Bold className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.italic}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Italic"
//                   >
//                     <Italic className="w-5 h-5" />
//                   </button>
//                   <div className="w-px bg-slate-700 mx-1" />
//                   <button
//                     type="button"
//                     onClick={formatHandlers.bulletList}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Bullet List"
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.numberedList}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Numbered List"
//                   >
//                     <ListOrdered className="w-5 h-5" />
//                   </button>
//                   <div className="w-px bg-slate-700 mx-1" />
//                   <button
//                     type="button"
//                     onClick={formatHandlers.code}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Inline Code"
//                   >
//                     <Code className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.quote}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Quote"
//                   >
//                     <Quote className="w-5 h-5" />
//                   </button>
//                   <div className="w-px bg-slate-700 mx-1" />
//                   <button
//                     type="button"
//                     onClick={formatHandlers.link}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Insert Link"
//                   >
//                     <Link2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={formatHandlers.image}
//                     className="p-2 hover:bg-slate-800 rounded transition"
//                     title="Insert Image"
//                   >
//                     <ImageIcon className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Text Area */}
//                 <textarea
//                   ref={textareaRef}
//                   required
//                   value={newPost.content}
//                   onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//                   placeholder="Start writing your post... Use the toolbar above to format text!"
//                   rows="16"
//                   className="w-full px-4 py-3 bg-slate-900 border border-slate-700 border-t-0 rounded-b-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none font-mono text-sm"
//                 />

//                 {/* Helper Text */}
//                 <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
//                   <p className="text-sm text-cyan-400 mb-2 font-semibold">Quick Tips:</p>
//                   <ul className="text-xs text-slate-400 space-y-1">
//                     <li>• Click H1, H2, H3 buttons to add headings at the start of a line</li>
//                     <li>• Select text and click Bold/Italic to wrap it with formatting</li>
//                     <li>• Use list buttons to add bullet points or numbered lists</li>
//                     <li>• Click Preview to see how your post will look</li>
//                   </ul>
//                 </div>
//               </>
//             ) : (
//               /* Preview */
//               <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 min-h-[500px]">
//                 <div 
//                   className="prose prose-invert max-w-none"
//                   dangerouslySetInnerHTML={{ __html: markdownToHtml(newPost.content || '*No content yet. Start writing to see preview!*') }}
//                 />
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 transition cursor-pointer">
//                   <ImageIcon className="w-5 h-5 text-slate-400" />
//                   <span className="text-slate-400">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={onImageUpload}
//                     disabled={uploadingImage}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {imagePreview && (
//                 <div className="relative rounded-lg overflow-hidden border border-slate-700">
//                   <div className="relative w-full h-48">
//                     <Image
//                       src={imagePreview}
//                       alt="Preview"
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setNewPost(prev => ({...prev, image: ''}));
//                       setImagePreview('');
//                     }}
//                     className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//               <p className="text-xs text-slate-400">Max size: 5MB. Supports JPG, PNG, WebP, GIF</p>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
//               <select
//                 required
//                 value={newPost.category}
//                 onChange={(e) => setNewPost({...newPost, category: e.target.value})}
//                 className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
//               >
//                 <option value="Performance">Performance</option>
//                 <option value="React">React</option>
//                 <option value="Optimization">Optimization</option>
//                 <option value="Best Practices">Best Practices</option>
//                 <option value="Tutorials">Tutorials</option>
//                 <option value="News">News</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
//               <input
//                 type="text"
//                 value={newPost.tags}
//                 onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
//                 placeholder="Performance, React, Web Vitals"
//                 className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//               />
//               <p className="text-xs text-slate-400 mt-2">Separate tags with commas</p>
//             </div>
//           </div>

//           <div className="flex gap-4 pt-4">
//             <button
//               type="submit"
//               disabled={creating || uploadingImage}
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {creating ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Publishing...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="w-5 h-5" />
//                   Publish Post
//                 </>
//               )}
//             </button>
//             <button
//               type="button"
//               disabled={creating}
//               onClick={() => {
//                 setNewPost({
//                   title: '',
//                   content: '',
//                   excerpt: '',
//                   authorBio: '',
//                   readTime: '',
//                   category: 'Performance',
//                   tags: '',
//                   image: ''
//                 });
//                 setImagePreview('');
//                 setShowPreview(false);
//               }}
//               className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition disabled:opacity-50"
//             >
//               Clear
//             </button>
//           </div>
//         </form>

//         {/* Markdown Cheatsheet */}
//         <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
//           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <FileText className="w-5 h-5 text-emerald-400" />
//             Markdown Cheatsheet
//           </h3>
//           <div className="grid sm:grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-slate-400 mb-1">Headings:</p>
//               <code className="text-emerald-400"># Heading 1</code><br />
//               <code className="text-emerald-400">## Heading 2</code><br />
//               <code className="text-emerald-400">### Heading 3</code>
//             </div>
//             <div>
//               <p className="text-slate-400 mb-1">Text Formatting:</p>
//               <code className="text-emerald-400">**bold text**</code><br />
//               <code className="text-emerald-400">*italic text*</code><br />
//               <code className="text-emerald-400">`inline code`</code>
//             </div>
//             <div>
//               <p className="text-slate-400 mb-1">Lists:</p>
//               <code className="text-emerald-400">- Bullet item</code><br />
//               <code className="text-emerald-400">1. Numbered item</code>
//             </div>
//             <div>
//               <p className="text-slate-400 mb-1">Links & Images:</p>
//               <code className="text-emerald-400">[text](url)</code><br />
//               <code className="text-emerald-400">![alt](image-url)</code>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AnalyticsTab() {
//   return (
//     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
//       <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
//       <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
//       <p className="text-slate-400">Detailed performance insights will be available here.</p>
//     </div>
//   );
// }

// function SettingsTab() {
//   return (
//     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
//       <Settings className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//       <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
//       <p className="text-slate-400">User settings and preferences will be available here.</p>
//     </div>
//   );
// }




















'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Zap, Menu, X, Home, FileText, PlusCircle, Settings, User,
  TrendingUp, Eye, ThumbsUp, MessageCircle, BarChart3,
  Clock, Edit, Trash2, Search, Filter, Bell, LogOut,
  Activity, Users, BookOpen, Calendar, Upload, Image as ImageIcon,
  Bold, Italic, List, ListOrdered, Code, Quote, Link2, Type
} from 'lucide-react';
import Link from 'next/link';
import PostCard from './PostCard';
import StatsGrid from './StatsGrid';
import CustomLink from './CustomLink';

// Import the new external WYSIWYG CreateTab
import CreateTab from './CreateTab';

const recentActivity = [];

export default function Dashboard({ initialPosts = [], baseUrl }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [userPosts, setUserPosts] = useState(initialPosts);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState([
    { label: "Total Views", value: "0", change: "+0%", icon: Eye, color: "emerald" },
    { label: "Total Posts", value: "0", change: "+0", icon: FileText, color: "cyan" },
    { label: "Total Likes", value: "0", change: "+0%", icon: ThumbsUp, color: "blue" },
    { label: "Followers", value: "0", change: "+0%", icon: Users, color: "purple" }
  ]);

  // WYSIWYG Editor State
  const editorRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState('');

  // Form states
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    authorBio: '',
    readTime: '',
    category: 'Performance',
    tags: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!currentUserId || !baseUrl) return;

    async function fetchUserPosts() {
      setLoadingPosts(true);
      try {
        const res = await fetch(`/api/posts?userId=${currentUserId}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch user posts');
        const data = await res.json();
        const formattedPosts = data.map(post => ({
          ...post,
          date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
        }));
        setUserPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
      } catch (error) {
        setError(error.message || 'Error fetching posts');
        setUserPosts(initialPosts);
      } finally {
        setLoadingPosts(false);
      }
    }

    async function fetchDashboardStats() {
      try {
        const response = await fetch('/api/dashboard', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats([
          { label: 'Total Views', value: data.totalViews.toLocaleString(), change: '+0%', icon: Eye, color: 'emerald' },
          { label: 'Total Posts', value: data.totalPosts.toLocaleString(), change: '+0', icon: FileText, color: 'cyan' },
          { label: 'Total Likes', value: data.totalLikes.toLocaleString(), change: '+0%', icon: ThumbsUp, color: 'blue' },
          { label: 'Followers', value: data.followers.toLocaleString(), change: '+0%', icon: Users, color: 'purple' },
        ]);
      } catch (err) {
        setError(err.message || 'Error fetching dashboard stats');
      }
    }

    fetchUserPosts();
    fetchDashboardStats();
  }, [currentUserId, baseUrl, initialPosts]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  const filteredPosts = userPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'posts', label: 'My Posts', icon: FileText },
    { id: 'create', label: 'Create Post', icon: PlusCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (postToDelete?._id === postId) {
      setSubmitting(true);
      setError(''); setSuccessMessage('');
      try {
        const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete post');
        await fetchUserPosts();
        setSuccessMessage('Post deleted successfully!');
      } catch (err) {
        setError(err.message || 'Error deleting post');
      } finally {
        setSubmitting(false);
        setShowDeleteDialog(false);
        setPostToDelete(null);
      }
    }
  };

  async function fetchUserPosts() {
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/posts?userId=${currentUserId}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch user posts');
      const data = await res.json();
      const formattedPosts = data.map(post => ({
        ...post,
        date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
      }));
      setUserPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
    } catch (error) {
      setError(error.message || 'Error fetching posts');
      setUserPosts(initialPosts);
    } finally {
      setLoadingPosts(false);
    }
  }

  const handleEditPost = (postId) => router.push(`/posts/${postId}/edit`);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return setError('Image size should be less than 5MB');

    setUploadingImage(true);
    setError(''); setSuccessMessage('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      setNewPost(prev => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
      setSuccessMessage('Image uploaded successfully!');
    } catch (err) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  // HTML to Markdown converter
  const htmlToMarkdown = (html) => {
    let md = html;
    md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**');
    md = md.replace(/<(em|i)>(.*?)<\/\1>/gi, '*$2*');
    md = md.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img src="(.*?)".*?>/gi, '![]($1)');
    md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
    md = md.replace(/<pre>(.*?)<\/pre>/gis, '\n```\n$1\n```\n');
    md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<ul>(.*?)<\/ul>/gis, m => m.replace(/<li>(.*?)<\/li>/gi, '- $1\n'));
    md = md.replace(/<ol>(.*?)<\/ol>/gis, m => {
      let i = 1; return m.replace(/<li>(.*?)<\/li>/gi, () => `${i++}. $1\n`);
    });
    md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<[^>]+>/g, '');
    md = md.replace(/\n{3,}/g, '\n\n');
    return md.trim();
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
    link: () => {
      const url = prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
      editorRef.current?.focus();
    },
    image: () => {
      const url = prompt('Enter image URL:');
      if (url) document.execCommand('insertImage', false, url);
      editorRef.current?.focus();
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(''); 
    setSuccessMessage('');

    try {
      // Content is already converted to markdown in real-time
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          // newPost.content already has markdown
          tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
          author: currentUserId,
          authorBio: newPost.authorBio || 'Content Creator'
        })
      });

      if (!response.ok) throw new Error('Failed to create post');

      // Reset form
      if (editorRef.current) editorRef.current.innerHTML = '';
      setEditorHtml('');
      setNewPost({
        title: '', content: '', excerpt: '', authorBio: '', readTime: '',
        category: 'Performance', tags: '', image: ''
      });
      setImagePreview('');
      await fetchUserPosts();
      setActiveTab('posts');
      setSuccessMessage('Post created successfully!');
    } catch (error) {
      setError(error.message || 'Error creating post');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const markdownToHtml = (markdown) => {
    let html = markdown;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-cyan-400">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-emerald-400">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 text-emerald-400">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm text-emerald-400">$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-emerald-400 text-sm">$1</code>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-400 underline hover:text-emerald-300">$1</a>');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />');
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-slate-300 my-4">$1</blockquote>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 my-1">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 my-1">$1</li>');
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[h|u|o|p|b|l]/)) return `<p class="mb-4 text-slate-300 leading-relaxed">${para}</p>`;
      return para;
    }).join('\n');
    return html;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-16 sm:pt-20">
      {/* Sidebar - exactly the same */}
      <aside className={`fixed top-16 sm:top-20 bottom-0 left-0 z-40 w-64 bg-slate-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-slate-700`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => setShowLogoutDialog(true)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-lg transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="lg:ml-64 p-4 sm:p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-800/50 rounded-lg border border-slate-700">
              <Menu className="w-6 h-6 text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Welcome back,</span> {session?.user?.name || session?.user?.email}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
            {successMessage}
          </div>
        )}

        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} stats={stats} />}
        {activeTab === 'posts' && <PostsTab posts={filteredPosts} searchQuery={searchQuery} onSearchChange={setSearchQuery} onEdit={handleEditPost} onDelete={handleDeleteClick} loading={loadingPosts} />}
        {activeTab === 'create' && (
          <CreateTab
            newPost={newPost}
            setNewPost={setNewPost}
            onCreate={handleCreatePost}
            creating={creating}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            onImageUpload={handleImageUpload}
            uploadingImage={uploadingImage}
            editorRef={editorRef}
            editorHtml={editorHtml}
            setEditorHtml={setEditorHtml}
            formatHandlers={formatHandlers}
            htmlToMarkdown={htmlToMarkdown}  // ADD THIS LINE
          />
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}

        {/* Delete Dialog - exactly the same */}
        {showDeleteDialog && postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Delete Post</h3>
              </div>
              <p className="text-slate-400 mb-2">Are you sure you want to delete this post?</p>
              <p className="text-white font-medium mb-4 p-3 bg-slate-800/50 rounded-lg">&quot;{postToDelete.title}&quot;</p>
              <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              {successMessage && <p className="text-emerald-400 text-sm mb-4">{successMessage}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteDialog(false); setPostToDelete(null); setError(''); setSuccessMessage(''); }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(postToDelete._id)}
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Dialog - exactly the same */}
        {showLogoutDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
              <h3 className="text-xl font-bold mb-4">Log out?</h3>
              <p className="text-slate-400 mb-6">You will be redirected to the login page.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging Out...
                    </>
                  ) : (
                    'Log Out'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Your original sub-tabs (unchanged)
function OverviewTab({ setActiveTab, stats }) {
  return (
    <div>
      <StatsGrid stats={stats} />
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet. Create a post to get started!</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span>{activity.user} {activity.action} &quot;{activity.post || 'your profile'}&quot; - {activity.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setActiveTab('create')} className="w-full text-left p-3 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition">
              <PlusCircle className="inline w-4 h-4 mr-2" /> New Post
            </button>
            <button className="w-full text-left p-3 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30 transition">
              <BarChart3 className="inline w-4 h-4 mr-2" /> View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsTab({ posts, searchQuery, onSearchChange, onEdit, onDelete, loading }) {
  if (loading) return <div className="text-center py-16">Loading posts...</div>;

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post._id} post={post} isAdmin onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No posts yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create your first post to get started</p>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
      <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
      <p className="text-slate-400">Detailed performance insights will be available here.</p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
      <Settings className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
      <p className="text-slate-400">User settings and preferences will be available here.</p>
    </div>
  );
}