import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token');
	const isAuthPage =
		request.nextUrl.pathname.startsWith('/signin') ||
		request.nextUrl.pathname.startsWith('/signup');

	if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
		return NextResponse.redirect(new URL('/signin', request.url));
	}

	if (token && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
