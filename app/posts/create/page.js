// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import Navbar from '@/app/components/Navbar';
// import Footer from '@/app/components/Footer';
// import LoadingSpinner from '@/app/components/LoadingSpinner';
// import { Save, X, ArrowLeft } from 'lucide-react';

// export default function CreatePostPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session) {
//       router.push('/login');
//     }
//   }, [session, status, router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     const formData = new FormData(e.currentTarget);
//     const data = {
//       title: formData.get('title'),
//       excerpt: formData.get('excerpt'),
//       content: formData.get('content'),
//       image: formData.get('image'),
//       category: formData.get('category'),
//       tags: formData.get('tags')?.split(',').map(t => t.trim()).filter(Boolean) || [],
//       status: formData.get('status') ? 'published' : 'draft'
//     };

//     try {
//       const res = await fetch('/api/posts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (res.ok) {
//         router.push('/dashboard');
//       } else {
//         const errorData = await res.json();
//         setError(errorData.message || 'Failed to create post');
//       }
//     } catch (err) {
//       setError('Network error occurred');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (status === 'loading') {
//     return ;
//   }

//   if (!session) {
//     return null;
//   }

//   return (
    
      
      
//         {/* Header */}
        
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition mb-4"
//           >
            
//             Back
          
//           Create New Post
//           Share your JavaScript performance insights
        
        
        
//           {/* Title */}
          
            
//               Title *
            
            
          

//           {/* Excerpt */}
          
            
//               Excerpt *
            
            
          

//           {/* Image URL */}
          
            
//               Featured Image URL
            
            
//             Optional: Add a featured image URL
          

//           {/* Category */}
          
            
//               Category *
            
            
//               Select a category
//               React
//               JavaScript
//               Next.js
//               Web Vitals
//               DevOps
//               Images
//               CSS
//               Other
            
          

//           {/* Content */}
          
            
//               Content (Markdown) *
            
            
            
//               Supports Markdown syntax including code blocks, tables, and more
            
          

//           {/* Tags */}
          
            
//               Tags
            
            
//             Separate tags with commas
          

//           {/* Publish Status */}
          
            
              
              
//                 Publish immediately
                
//                   Uncheck to save as draft
                
              
            
          

//           {/* Error Message */}
//           {error && (
            
              
              
//                 Error
//                 {error}
              
            
//           )}

//           {/* Action Buttons */}
          
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
//               disabled={submitting}
//             >
              
//               Cancel
            
            
              
//               {submitting ? 'Creating...' : 'Create Post'}
            
          
        
      
      
    
//   );
// }