import { NextRequest, NextResponse } from 'next/server';
import { isSaaSProtectedPath } from '@/lib/config/protected-routes';

function isSaaSModeEnabled() {
  return (process.env.NEXT_PUBLIC_APP_MODE || 'oss') === 'saas';
}

export function proxy(request: NextRequest) {
  if (!isSaaSModeEnabled()) {
    return NextResponse.next();
  }

  if (!isSaaSProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('next', request.nextUrl.pathname);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
