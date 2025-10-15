// import NextAuth from 'next-auth';
// import { NextResponse } from 'next/server';
// import { authConfig } from './auth.config';

// const { auth: middlewareFn } = NextAuth(authConfig);

// export default middlewareFn((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//   // if (isOnDashboard) {
//   //   if (!isLoggedIn) {
//   //     return NextResponse.redirect(new URL('/login', nextUrl));
//   //   }
//   //   return NextResponse.next();  // Allow
//   // }

//   // // Redirect logged-in from public to dashboard
//   // if (isLoggedIn && !isOnDashboard) {
//   //   return NextResponse.redirect(new URL('/dashboard', nextUrl));
//   // }

//   return NextResponse.next();  // Public access
// });

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
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
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/posts/create',
    '/posts/:id/edit',
  ]
};