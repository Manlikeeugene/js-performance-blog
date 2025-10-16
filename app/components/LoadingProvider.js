// 'use client';

// import { useState, useEffect, createContext } from 'react';
// import { usePathname } from 'next/navigation';
// import LoadingSpinner from './LoadingSpinner';

// export const LoadingContext = createContext();

// export function useLoading() {
//   return useContext(LoadingContext);
// }

// export default function LoadingProvider({ children }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     if (isLoading) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   }, [isLoading]);

//   useEffect(() => {
//     setIsLoading(true); // Show on path change
//     const minDuration = 800; // Min ms spinner shows (adjust for feel)

//     // Wait for full page load (assets + data)
//     const handleLoad = () => {
//       const elapsed = Date.now() - startTime;
//       const delay = Math.max(0, minDuration - elapsed);
//       setTimeout(() => setIsLoading(false), delay);
//     };

//     const startTime = Date.now();
//     if (document.readyState === 'complete') {
//       handleLoad(); // Already loaded
//     } else {
//       window.addEventListener('load', handleLoad);
//       return () => window.removeEventListener('load', handleLoad);
//     }
//   }, [pathname]);

//   const value = { setIsLoading };

//   return (
//     <LoadingContext.Provider value={value}>
//       {children}
//       {isLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
//           <LoadingSpinner message="Navigating..." />
//         </div>
//       )}
//     </LoadingContext.Provider>
//   );
// }


'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Handle body overflow when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  // Handle route changes via pathname
  useEffect(() => {
    let isMounted = true;
    const minDuration = 800; // Minimum loading time for UX
    const startTime = Date.now();

    // Defer setIsLoading(true) to avoid synchronous setState
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(true);
      }

      // Ensure minimum duration before turning off loading
      const elapsed = Date.now() - startTime;
      const remaining = minDuration - elapsed;
      if (remaining <= 0) {
        if (isMounted) {
          setIsLoading(false);
        }
      } else {
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, remaining);
      }
    }, 0); // Run immediately but asynchronously

    // Cleanup on unmount or pathname change
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pathname]);

  const value = { setIsLoading };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <LoadingSpinner message="Navigating..." />
        </div>
      )}
    </LoadingContext.Provider>
  );
}