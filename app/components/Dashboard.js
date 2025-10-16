// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession, signOut } from 'next-auth/react';
// import Image from 'next/image'; // For image optimization
// import { 
//   Zap, Menu, X, Home, FileText, PlusCircle, Settings, User, 
//   TrendingUp, Eye, ThumbsUp, MessageCircle, BarChart3, 
//   Clock, Edit, Trash2, Search, Filter, Bell, LogOut,
//   Activity, Users, BookOpen, Calendar, Upload, Image as ImageIcon // Alias Image to ImageIcon
// } from 'lucide-react';
// import Link from 'next/link';
// import PostCard from './PostCard';
// import StatsGrid from './StatsGrid';
// import CustomLink from './CustomLink';

// const stats = [
//   { label: "Total Views", value: "0", change: "+0%", icon: Eye, color: "emerald" },
//   { label: "Total Posts", value: "0", change: "+0", icon: FileText, color: "cyan" },
//   { label: "Total Likes", value: "0", change: "+0%", icon: ThumbsUp, color: "blue" },
//   { label: "Followers", value: "0", change: "+0%", icon: Users, color: "purple" }
// ];

// const recentActivity = [];

// export default function Dashboard({ initialPosts = [], userId }) {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showDiscardDialog, setShowDiscardDialog] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   const [userPosts, setUserPosts] = useState(initialPosts);
//   const [loadingPosts, setLoadingPosts] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

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

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) {
//       router.push('/login');
//     }
//     setUserPosts(initialPosts);
//   }, [session, status, router, initialPosts]);

//   const fetchUserPosts = async () => {
//     if (!userId) return;
//     setLoadingPosts(true);
//     try {
//       const res = await fetch(`/api/posts?userId=${userId}`);
//       if (res.ok) {
//         const posts = await res.json();
//         setUserPosts(posts);
//       } else {
//         console.error('Failed to fetch posts');
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       setLoadingPosts(false);
//     }
//   };

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
//     await signOut({ callbackUrl: '/auth/login' });
//   };

//   const handleDeletePost = async (postId) => {
//     if (postToDelete?._id === postId) {
//       setSubmitting(true);
//       try {
//         const response = await fetch(`/api/posts/${postId}`, {
//           method: 'DELETE',
//         });
//         if (response.ok) {
//           await fetchUserPosts();
//           console.log('Post deleted:', postId);
//         } else {
//           console.error('Failed to delete post');
//         }
//       } catch (error) {
//         console.error('Delete error:', error);
//       } finally {
//         setSubmitting(false);
//       }
//       setShowDeleteDialog(false);
//       setPostToDelete(null);
//     }
//   };

//   const handleEditPost = (postId) => {
//     router.push(`/posts/${postId}/edit`);
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image size should be less than 5MB');
//       return;
//     }

//     setUploadingImage(true);
    
//     try {
//       // Create FormData for image upload
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch(`/api/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setNewPost(prev => ({...prev, image: data.url})); // secure_url
//         setImagePreview(data.url);
//         console.log('Uploaded:', data.public_id); // Optional: Log public_id for ref
//       } else {
//         alert('Failed to upload image');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Error uploading image');
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleCreatePost = async (e) => {
//     e.preventDefault();
//     setCreating(true);
//     try {
//       const response = await fetch(`/api/posts`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...newPost,
//           tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//           author: userId, // Use ID, not name
//           authorBio: newPost.authorBio || 'Content Creator'
//         })
//       });
      
//       console.log('Create response status:', response.status); // Debug log
//       const responseData = await response.json();
//       console.log('Create response data:', responseData); // Debug: Check for {post, message}
      
//       if (response.ok && responseData.post) {
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
//         await fetchUserPosts();
//         setActiveTab('posts');
//         alert('Post created successfully!'); // Optional success feedback
//       } else {
//         console.error('Failed to create post:', responseData.error || 'Unknown error');
//         alert(`Failed to create post: ${responseData.error || 'Server error'}`);
//       }
//     } catch (error) {
//       console.error('Create error:', error);
//       alert('Error creating post');
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (status === 'loading') {
//     return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
//   }

//   if (!session) return null;

//   const handleDeleteClick = (post) => {
//     setPostToDelete(post);
//     setShowDeleteDialog(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-16 sm:pt-20">
//       {/* Sidebar - Adjusted to start below navbar */}
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

//       {/* Main Content - Adjusted padding for navbar and sidebar */}
//       <main className="lg:ml-64 p-4 sm:p-6 min-h-screen">
//         {/* Header with Menu Button and Title */}
//         <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             {/* Mobile Menu Button - Now inside main content */}
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden p-2 bg-slate-800/50 rounded-lg border border-slate-700"
//             >
//               <Menu className="w-6 h-6 text-slate-300" />
//             </button>
//             <h1 className="text-2xl font-bold">Dashboard</h1>
//           </div>
//           {/* User Greeting */}
//           <div className="flex items-center gap-2 text-sm text-slate-400">
//             <User className="w-4 h-4" />
//             <span className="hidden sm:inline">Welcome back,</span> {session.user.name || session.user.email}
//           </div>
//         </div>

//         {/* Tabs Content */}
//         {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
//         {activeTab === 'posts' && <PostsTab posts={filteredPosts} searchQuery={searchQuery} onSearchChange={setSearchQuery} onEdit={handleEditPost} onDelete={handleDeleteClick} loading={loadingPosts} />}
//         {activeTab === 'create' && <CreateTab newPost={newPost} setNewPost={setNewPost} onCreate={handleCreatePost} creating={creating} imagePreview={imagePreview} setImagePreview={setImagePreview} onImageUpload={handleImageUpload} uploadingImage={uploadingImage} />}
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
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => { setShowDeleteDialog(false); setPostToDelete(null); }}
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
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition"
//                 >
//                   Log Out
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showDiscardDialog && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//             <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
//                   <X className="w-6 h-6 text-yellow-400" />
//                 </div>
//                 <h3 className="text-xl font-bold">Discard Changes</h3>
//               </div>
//               <p className="text-slate-400 mb-6">Are you sure you want to discard this draft? All unsaved changes will be lost.</p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowDiscardDialog(false)}
//                   className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
//                 >
//                   Keep Editing
//                 </button>
//                 <button
//                   onClick={() => {
//                     console.log('Draft discarded');
//                     setShowDiscardDialog(false);
//                     setActiveTab('overview');
//                   }}
//                   className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-xl font-medium transition"
//                 >
//                   Discard
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
// function OverviewTab({ setActiveTab }) {
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

// function CreateTab({ newPost, setNewPost, onCreate, creating, imagePreview, setImagePreview, onImageUpload, uploadingImage }) {
//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
//         <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <PlusCircle className="w-6 h-6 text-emerald-400" />
//           Create New Post
//         </h3>
        
//         <form onSubmit={onCreate} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">
//               Post Title *
//             </label>
//             <input
//               type="text"
//               required
//               value={newPost.title}
//               onChange={(e) => setNewPost({...newPost, title: e.target.value})}
//               placeholder="e.g., Optimizing React Performance: Core Web Vitals Deep Dive"
//               className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//             />
//           </div>

//           {/* Excerpt */}
//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">
//               Excerpt *
//             </label>
//             <textarea
//               required
//               value={newPost.excerpt}
//               onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
//               placeholder="Brief description that appears in post previews..."
//               rows="3"
//               className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
//             />
//           </div>

//           {/* Author Bio and Read Time Row */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Author Bio
//               </label>
//               <input
//                 type="text"
//                 value={newPost.authorBio}
//                 onChange={(e) => setNewPost({...newPost, authorBio: e.target.value})}
//                 placeholder="e.g., Senior Frontend Engineer at TechCorp"
//                 className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Read Time
//               </label>
//               <input
//                 type="text"
//                 value={newPost.readTime}
//                 onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
//                 placeholder="e.g., 8 min read"
//                 className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
//               />
//             </div>
//           </div>

//           {/* Content */}
//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">
//               Content * (Markdown supported)
//             </label>
//             <textarea
//               required
//               value={newPost.content}
//               onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//               placeholder="Write your post content here using Markdown...&#10;&#10;## Section Heading&#10;Your content here...&#10;&#10;```jsx&#10;// Code blocks supported&#10;```"
//               rows="16"
//               className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none font-mono text-sm"
//             />
//             <p className="text-xs text-slate-400 mt-2">Supports Markdown formatting including headers, lists, code blocks, and more</p>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-slate-300 mb-2">
//               Featured Image
//             </label>
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 transition cursor-pointer">
//                   <ImageIcon className="w-5 h-5 text-slate-400" /> {/* Changed from Image to ImageIcon */}
//                   <span className="text-slate-400">
//                     {uploadingImage ? 'Uploading...' : 'Upload Image'}
//                   </span>
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

//           {/* Category and Tags */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Category *
//               </label>
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
//               <label className="block text-sm font-medium text-slate-300 mb-2">
//                 Tags
//               </label>
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

//           {/* Buttons */}
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
//               }}
//               className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition disabled:opacity-50"
//             >
//               Clear
//             </button>
//           </div>
//         </form>
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

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  Zap, Menu, X, Home, FileText, PlusCircle, Settings, User,
  TrendingUp, Eye, ThumbsUp, MessageCircle, BarChart3,
  Clock, Edit, Trash2, Search, Filter, Bell, LogOut,
  Activity, Users, BookOpen, Calendar, Upload, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import PostCard from './PostCard';
import StatsGrid from './StatsGrid';
import CustomLink from './CustomLink';

const stats = [
  { label: "Total Views", value: "0", change: "+0%", icon: Eye, color: "emerald" },
  { label: "Total Posts", value: "0", change: "+0", icon: FileText, color: "cyan" },
  { label: "Total Likes", value: "0", change: "+0%", icon: ThumbsUp, color: "blue" },
  { label: "Followers", value: "0", change: "+0%", icon: Users, color: "purple" }
];

const recentActivity = [];

export default function Dashboard({ initialPosts = [], userId, baseUrl }) {
  const router = useRouter();
  const { data: session, status } = useSession();
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

  // Create post form states
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

  useEffect(() => {
    if (!userId || !baseUrl) return;

    async function fetchUserPosts() {
      setLoadingPosts(true);
      try {
        const res = await fetch(`/api/posts?userId=${userId}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Posts fetch failed:', res.status, await res.text());
          throw new Error('Failed to fetch user posts');
        }

        const data = await res.json();
        // Format date if from DB
        const formattedPosts = data.map(post => ({
          ...post,
          date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date
        }));

        setUserPosts(formattedPosts.length > 0 ? formattedPosts : initialPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setUserPosts(initialPosts); // Fallback to empty array
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchUserPosts();
  }, [userId, baseUrl, initialPosts]);

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
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleDeletePost = async (postId) => {
    if (postToDelete?._id === postId) {
      setSubmitting(true);
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchUserPosts();
          console.log('Post deleted:', postId);
        } else {
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setSubmitting(false);
      }
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleEditPost = (postId) => {
    router.push(`/posts/${postId}/edit`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewPost(prev => ({...prev, image: data.url}));
        setImagePreview(data.url);
        console.log('Uploaded:', data.public_id);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPost,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          author: userId,
          authorBio: newPost.authorBio || 'Content Creator'
        })
      });

      console.log('Create response status:', response.status);
      const responseData = await response.json();
      console.log('Create response data:', responseData);

      if (response.ok && responseData.post) {
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
        await fetchUserPosts();
        setActiveTab('posts');
        alert('Post created successfully!');
      } else {
        console.error('Failed to create post:', responseData.error || 'Unknown error');
        alert(`Failed to create post: ${responseData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Error creating post');
    } finally {
      setCreating(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-16 sm:pt-20">
      {/* Sidebar */}
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 min-h-screen">
        {/* Header with Menu Button and Title */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <Menu className="w-6 h-6 text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Welcome back,</span> {session?.user?.name || session?.user?.email}
          </div>
        </div>

        {/* Tabs Content */}
        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'posts' && <PostsTab posts={filteredPosts} searchQuery={searchQuery} onSearchChange={setSearchQuery} onEdit={handleEditPost} onDelete={handleDeleteClick} loading={loadingPosts} />}
        {activeTab === 'create' && <CreateTab newPost={newPost} setNewPost={setNewPost} onCreate={handleCreatePost} creating={creating} imagePreview={imagePreview} setImagePreview={setImagePreview} onImageUpload={handleImageUpload} uploadingImage={uploadingImage} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}

        {/* Delete Dialog */}
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
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteDialog(false); setPostToDelete(null); }}
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

        {/* Logout Dialog */}
        {showLogoutDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
              <h3 className="text-xl font-bold mb-4">Log out?</h3>
              <p className="text-slate-400 mb-6">You will be redirected to the login page.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {showDiscardDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <X className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold">Discard Changes</h3>
              </div>
              <p className="text-slate-400 mb-6">Are you sure you want to discard this draft? All unsaved changes will be lost.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiscardDialog(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                >
                  Keep Editing
                </button>
                <button
                  onClick={() => {
                    console.log('Draft discarded');
                    setShowDiscardDialog(false);
                    setActiveTab('overview');
                  }}
                  className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-xl font-medium transition"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-Tab Components
function OverviewTab({ setActiveTab }) {
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
  if (loading) {
    return <div className="text-center py-16">Loading posts...</div>;
  }

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

function CreateTab({ newPost, setNewPost, onCreate, creating, imagePreview, setImagePreview, onImageUpload, uploadingImage }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          Create New Post
        </h3>

        <form onSubmit={onCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Post Title *</label>
            <input
              type="text"
              required
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="e.g., Optimizing React Performance: Core Web Vitals Deep Dive"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt *</label>
            <textarea
              required
              value={newPost.excerpt}
              onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
              placeholder="Brief description that appears in post previews..."
              rows="3"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Author Bio</label>
              <input
                type="text"
                value={newPost.authorBio}
                onChange={(e) => setNewPost({...newPost, authorBio: e.target.value})}
                placeholder="e.g., Senior Frontend Engineer at TechCorp"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Read Time</label>
              <input
                type="text"
                value={newPost.readTime}
                onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                placeholder="e.g., 8 min read"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Content * (Markdown supported)</label>
            <textarea
              required
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Write your post content here using Markdown...&#10;&#10;## Section Heading&#10;Your content here...&#10;&#10;```jsx&#10;// Code blocks supported&#10;```"
              rows="16"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none font-mono text-sm"
            />
            <p className="text-xs text-slate-400 mt-2">Supports Markdown formatting including headers, lists, code blocks, and more</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Featured Image</label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-emerald-500 transition cursor-pointer">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-slate-700">
                  <div className="relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPost(prev => ({...prev, image: ''}));
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-400">Max size: 5MB. Supports JPG, PNG, WebP, GIF</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
              <select
                required
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition"
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
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                placeholder="Performance, React, Web Vitals"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-xs text-slate-400 mt-2">Separate tags with commas</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={creating || uploadingImage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </button>
            <button
              type="button"
              disabled={creating}
              onClick={() => {
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
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
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