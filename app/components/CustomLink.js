'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { LoadingContext } from './LoadingProvider'; // We'll create this context

export default function CustomLink({ children, href, className, ...props }) {
  const router = useRouter();
  const { setIsLoading } = useContext(LoadingContext);

  const handleClick = (e) => {
    e.preventDefault(); // Stop default for control
    console.log('Navigating to:', href);
    setIsLoading(true); // Instant spinner
    router.push(href); // Start route
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}