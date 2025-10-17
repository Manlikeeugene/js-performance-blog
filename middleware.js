// middleware.js
// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';

// export const runtime = 'nodejs';

// export default async function middleware(req) {
//   const secret = process.env.NEXTAUTH_SECRET;
//   if (!secret) {
//     console.error('Middleware: NEXTAUTH_SECRET is missing');
//     return NextResponse.next();
//   }

//   // const token = await getToken({ req, secret });
//   const token = await getToken({ req, secret });
//   console.log('Middleware token check:', { isLoggedIn: !!token, tokenExpiry: token?.exp, now: Date.now() / 1000 });
//   const isLoggedIn = !!token;
//   const { pathname } = req.nextUrl;

//   console.log('Middleware: Checking path:', pathname, 'isLoggedIn:', isLoggedIn);

//   const protectedRoutes = ['/dashboard', '/posts/create'];
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || 
//                           pathname.match(/^\/posts\/[^\/]+\/edit$/);

//   // if (isProtectedRoute && !isLoggedIn) {
//   //   console.log('Middleware: Redirecting to /auth/login for', pathname);
//   //   // const loginUrl = new URL('/auth/login', req.url);
//   //   // loginUrl.searchParams.set('callbackUrl', pathname);
//   //   // return NextResponse.redirect(loginUrl);
//   // }

//   if (isProtectedRoute && !isLoggedIn) {
//   // Quick check: If cookie exists but token decode failed, log & pass (rare race)
//   const cookieHeader = req.headers.get('cookie') || '';
//   const hasSessionCookie = cookieHeader.includes('next-auth.session-token');
//   if (hasSessionCookie && !token) {
//     console.log('Middleware: Token decode failed but cookie present—allowing (race condition?)');
//     return NextResponse.next(); // Graceful pass
//   }
  
//   console.log('Middleware: Redirecting to /auth/login for', pathname);
//   const loginUrl = new URL('/auth/login', req.url);
//   loginUrl.searchParams.set('callbackUrl', pathname);
//   return NextResponse.redirect(loginUrl);
// }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/posts/create',
//     '/posts/:id/edit',
//   ],
// };









// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export default async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error('Middleware: NEXTAUTH_SECRET is missing');
    return NextResponse.next();
  }

  // Specify the correct cookie name for Auth.js v5 + secure prefixes
  const token = await getToken({
    req,
    secret,
    cookie: '__Secure-authjs.session-token', // Primary (secure); falls back to 'authjs.session-token'
  });

  console.log('Middleware token check:', { isLoggedIn: !!token, tokenExpiry: token?.exp, now: Date.now() / 1000 });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  console.log('Middleware: Checking path:', pathname, 'isLoggedIn:', isLoggedIn);

  const protectedRoutes = ['/dashboard', '/posts/create'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || 
                          pathname.match(/^\/posts\/[^\/]+\/edit$/);

  if (isProtectedRoute && !isLoggedIn) {
    // Quick check: If cookie exists but token decode failed, log & pass (rare race)
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('next-auth.session-token') || cookieHeader.includes('authjs.session-token');
    if (hasSessionCookie && !token) {
      console.log('Middleware: Token decode failed but cookie present—allowing (race condition?)');
      return NextResponse.next(); // Graceful pass
    }
    
    console.log('Middleware: Redirecting to /auth/login for', pathname);
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