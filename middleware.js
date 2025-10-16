// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';

// export default async function middleware(req) {
//   // Get the secret from env or header (for NextAuth)
//   const secret = req.headers.get('x-secret') || process.env.NEXTAUTH_SECRET;
//   const token = await getToken({ req, secret });

//   const isLoggedIn = !!token;
//   const { pathname } = req.nextUrl;

//   // Protected routes
//   const protectedRoutes = ['/dashboard', '/posts/create'];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || 
//                           pathname.match(/^\/posts\/[^\/]+\/edit$/);

//   if (isProtectedRoute && !isLoggedIn) {
//     const loginUrl = new URL('/login', req.url);
//     loginUrl.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/posts/create',
//     '/posts/:id/edit',
//   ]
// };

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Ensure Node.js runtime for Vercel serverless

export default async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error('Middleware: NEXTAUTH_SECRET is missing');
    return NextResponse.next(); // Fallback to avoid breaking
  }

  const token = await getToken({ req, secret });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  console.log('Middleware: Checking path:', pathname, 'isLoggedIn:', isLoggedIn); // Debug

  // Protected routes
  const protectedRoutes = ['/dashboard', '/posts/create'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || 
                          pathname.match(/^\/posts\/[^\/]+\/edit$/);

  if (isProtectedRoute && !isLoggedIn) {
    console.log('Middleware: Redirecting to /auth/login for', pathname); // Debug
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/posts/create',
    '/posts/:id/edit',
  ],
};