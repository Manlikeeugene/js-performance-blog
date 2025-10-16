// import { auth } from '@/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const isLoggedIn = !!req.auth;
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
// });

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/posts/create',
//     '/posts/:id/edit',
//   ]
// };



import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default async function middleware(req) {
  // Get the secret from env or header (for NextAuth)
  const secret = req.headers.get('x-secret') || process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/posts/create'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || 
                          pathname.match(/^\/posts\/[^\/]+\/edit$/);

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
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
  ]
};