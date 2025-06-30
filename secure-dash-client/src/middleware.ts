import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { decrypt } from '@/lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/app', '/app/dashboard', '/app/ips'];
const publicRoutes = ['/'];

/**
 * Middleware to handle authentication and authorization for protected and public routes.
 *
 * @param req - The incoming request object
 * @returns NextResponse object
 */
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to / (login) if the user is not authenticated
  if (isProtectedRoute && !session?.token) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // 5. Redirect to /app if the user is authenticated
  if (
    isPublicRoute &&
    session?.token &&
    !req.nextUrl.pathname.startsWith('/app')
  ) {
    return NextResponse.redirect(new URL('/app', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
