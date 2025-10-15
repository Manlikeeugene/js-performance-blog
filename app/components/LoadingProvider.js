
// 'use client';

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import LoadingSpinner from './LoadingSpinner'; // Your spinner

// export default function LoadingProvider({ children }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     let timer;
//     setIsLoading(true); // Show on path change
//     document.body.style.overflow = 'hidden'; // Prevent scroll

//     // Min 300ms show, then hide
//     timer = setTimeout(() => {
//       setIsLoading(false);
//       document.body.style.overflow = 'unset';
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [pathname]); // Triggers on every route change

//   return (
//     <>
//       {children}
//       {isLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
//           <LoadingSpinner message="Navigating..." />
//         </div>
//       )}
//     </>
//   );
// }


'use client';

import { useState, useEffect, createContext } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true); // Show on path change
    const minDuration = 800; // Min ms spinner shows (adjust for feel)

    // Wait for full page load (assets + data)
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, minDuration - elapsed);
      setTimeout(() => setIsLoading(false), delay);
    };

    const startTime = Date.now();
    if (document.readyState === 'complete') {
      handleLoad(); // Already loaded
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
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