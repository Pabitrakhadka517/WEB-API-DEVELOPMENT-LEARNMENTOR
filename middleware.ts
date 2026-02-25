import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Role-Based Access Control (RBAC).
 *
 * Reads the persisted auth store from cookies/localStorage (via the
 * `auth-storage` cookie that Zustand persist writes) and enforces:
 *
 * 1. Unauthenticated users cannot access /dashboard/* or /admin/*
 * 2. STUDENT users cannot access /dashboard/tutor/*
 * 3. TUTOR users cannot access /dashboard/student/*
 * 4. Only ADMIN users can access /admin/*
 *
 * NOTE: Since Zustand persists to localStorage (client-side only),
 * this middleware reads a lightweight `user-role` cookie that is set
 * client-side after login. For full server-side enforcement, the
 * dashboard layout component also validates roles client-side.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the role cookie set by the client after login
  const roleCookie = request.cookies.get('user-role')?.value;

  // Protected dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    // If no role cookie, redirect to login
    if (!roleCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = roleCookie.toUpperCase();

    // Enforce STUDENT cannot access tutor dashboard
    if (pathname.startsWith('/dashboard/tutor') && role === 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard/student?error=role_mismatch', request.url));
    }

    // Enforce TUTOR cannot access student dashboard
    if (pathname.startsWith('/dashboard/student') && role === 'TUTOR') {
      return NextResponse.redirect(new URL('/dashboard/tutor?error=role_mismatch', request.url));
    }

    // Admin routes - only ADMIN allowed
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      const dashboardPath = role === 'TUTOR' ? '/dashboard/tutor' : '/dashboard/student';
      return NextResponse.redirect(new URL(`${dashboardPath}?error=role_mismatch`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
