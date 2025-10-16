import { cookies } from 'next/headers';
import ClientPostView from '../../components/ClientPostView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
// import CustomLink from '../../components/CustomLink'

// Dummy post data for fallback (markdown content to match original)
const dummyPost = {
  _id: "1",
  title: "Optimizing React Performance: Core Web Vitals Deep Dive",
  excerpt: "Learn how to improve your React application's Core Web Vitals scores with practical optimization techniques including code splitting, lazy loading, and efficient rendering strategies.",
  author: "Sarah Johnson",
  authorBio: "Senior Frontend Engineer at TechCorp, passionate about web performance",
  date: "2025-10-10T00:00:00Z",
  readTime: "8 min read",
  category: "React",
  tags: ["Performance", "React", "Web Vitals"],
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
  views: 2450,
  likes: 187,
  comments: 23,
  content: `## Understanding Core Web Vitals

Core Web Vitals are a set of specific factors that Google considers important in a webpage's overall user experience. These metrics focus on three aspects of user experience: loading performance, interactivity, and visual stability.

### The Three Pillars

Let's break down each of the Core Web Vitals metrics:

#### 1. Largest Contentful Paint (LCP)

LCP measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading. Here's how to optimize it:

- Optimize and compress images using modern formats like WebP or AVIF
- Implement lazy loading for images below the fold
- Use a Content Delivery Network (CDN) to reduce server response times
- Minimize render-blocking JavaScript and CSS

#### 2. First Input Delay (FID)

FID measures interactivity and responsiveness. A good FID score is less than 100 milliseconds. To improve FID:

- Break up long JavaScript tasks into smaller, asynchronous tasks
- Use web workers for heavy computations
- Minimize JavaScript execution time
- Implement code splitting to reduce initial bundle size

#### 3. Cumulative Layout Shift (CLS)

CLS measures visual stability. Pages should maintain a CLS of less than 0.1. Key strategies include:

- Always include size attributes on images and video elements
- Reserve space for ad slots
- Avoid inserting content above existing content
- Use CSS transforms instead of properties that trigger layout shifts

## React-Specific Optimizations

### Code Splitting with React.lazy()

React's lazy loading feature allows you to render dynamic imports as regular components. This helps reduce the initial bundle size significantly:

\`\`\`jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function MyApp() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

### Memoization Techniques

Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders:

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
\`\`\`

### Virtual Scrolling for Long Lists

When rendering large lists, implement virtual scrolling using libraries like react-window or react-virtualized to only render visible items.

## Measuring Performance

Use these tools to measure and monitor your Core Web Vitals:

- **Lighthouse:** Built into Chrome DevTools for detailed performance audits
- **Web Vitals Extension:** Real-time metrics in your browser
- **PageSpeed Insights:** Analyze both lab and field data
- **Chrome UX Report:** Real user experience data from the field

## Real-World Case Study

We recently optimized a React e-commerce application and achieved:

- LCP improved from 4.2s to 1.8s (57% improvement)
- FID reduced from 180ms to 45ms (75% improvement)
- CLS decreased from 0.25 to 0.05 (80% improvement)

These improvements resulted in a 34% increase in conversion rate and 28% reduction in bounce rate.

## Conclusion

Optimizing Core Web Vitals in React applications requires a holistic approach combining modern React patterns, efficient resource loading, and continuous monitoring. Start with the biggest impact items and gradually refine your application's performance.

Remember, performance optimization is an ongoing process. Regularly audit your application, stay updated with best practices, and always prioritize user experience.`
};

// Dummy related posts (with excerpt for preview)
const dummyRelatedPosts = [
  {
    _id: "2",
    title: "JavaScript Bundle Size Optimization in 2025",
    excerpt: "Discover modern techniques to reduce JavaScript bundle sizes including tree shaking, dynamic imports, and understanding what really matters for your application's performance.",
    author: "Michael Chen",
    date: "2025-10-08T00:00:00Z",
    readTime: "12 min read",
    category: "JavaScript",
    tags: ["Bundle Size", "Webpack", "Optimization"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    views: 3120,
    likes: 245,
    comments: 31
  },
  {
    _id: "3",
    title: "Lighthouse CI: Automated Performance Testing",
    excerpt: "Set up continuous performance monitoring with Lighthouse CI in your deployment pipeline. Catch performance regressions before they reach production.",
    author: "Emily Rodriguez",
    date: "2025-10-05T00:00:00Z",
    readTime: "10 min read",
    category: "DevOps",
    tags: ["Lighthouse", "CI/CD", "Testing"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    views: 1890,
    likes: 156,
    comments: 18
  },
  {
    _id: "4",
    title: "Next.js App Router: Performance Best Practices",
    excerpt: "Maximize the performance benefits of Next.js 14 App Router with server components, streaming, and intelligent data fetching patterns.",
    author: "David Park",
    date: "2025-10-03T00:00:00Z",
    readTime: "15 min read",
    category: "Next.js",
    tags: ["Next.js", "Server Components", "SSR"],
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=400&fit=crop",
    views: 4230,
    likes: 203,
    comments: 42
  }
];

async function fetchPost(id) {
  
  // Await cookies() for async resolution in Next.js 15
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  const res = await fetch(`/api/posts/${id}`, { 
    cache: 'no-store',
    headers: { 
      'Content-Type': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader }), // Forward session if logged in
    },
  });
  
  if (!res.ok) {
    console.error('Post fetch failed:', res.status, await res.text()); // Debug
    throw new Error('Post not found');
  }
  
  const data = await res.json();
  // Flatten author if populated object
  if (data.author && typeof data.author === 'object') {
    data.author = data.author.name || 'Unknown';
  }
  // Format date if from DB
  data.date = data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data.date;
  // Ensure content is string (markdown)
  data.content = data.content || '';
  return data;
}

async function fetchRelatedPosts(category, currentId) {
   
  // Await cookies()
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  const res = await fetch(`/api/posts?category=${category}&excludeId=${currentId}&limit=3`, { 
    cache: 'no-store',
    headers: { 
      'Content-Type': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader }),
    },
  });
  
  if (!res.ok) {
    console.error('Related posts fetch failed:', res.status);
    return []; // Fallback to empty
  }
  
  const data = await res.json();
  // Flatten authors
  return data.map(post => ({
    ...post,
    author: typeof post.author === 'object' ? post.author.name || 'Unknown' : post.author,
    date: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : post.date,
  }));
}

export default async function PostPage({ params }) {
  const {id} = await params;
  
  let post = null;
  let relatedPosts = [];
  let error = null;
  try {
    post = await fetchPost(id);
    relatedPosts = await fetchRelatedPosts(post.category, id);
  } catch (err) {
    console.error('Fetch error:', err);
    post = dummyPost;
    relatedPosts = dummyRelatedPosts;
    error = null;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <LoadingSpinner message={error || 'Post not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar showPostsLink={true} showFeatures={false} showTech={false} />
      <ClientPostView post={post} relatedPosts={relatedPosts} />
      <Footer />
    </div>
  );
}