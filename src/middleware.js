import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/splash'];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Root redirects to splash or discover depending on auth
  if (path === '/') {
    const token = request.cookies.get('token')?.value || '';
    if (token && await verifyToken(token) !== null) {
      return NextResponse.redirect(new URL('/discover', request.url));
    } else {
      return NextResponse.redirect(new URL('/splash', request.url));
    }
  }

  const isPublicPath = publicPaths.includes(path) || path.startsWith('/api/auth');
  const token = request.cookies.get('token')?.value || '';

  let isVerified = false;
  if (token) {
    isVerified = await verifyToken(token) !== null;
  }

  // Redirect to splash/login if path is not public and token is missing or invalid
  if (!isPublicPath && !isVerified) {
    return NextResponse.redirect(new URL('/splash', request.url));
  }

  // Redirect to discover if path is public (like login/register) but user is already logged in
  if (isPublicPath && isVerified && path !== '/api/auth/logout') {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
