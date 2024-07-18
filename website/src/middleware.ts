import { NextRequest, NextResponse } from 'next/server'
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const token = request.cookies.get("token")?.value || '';

    if(token && 
        (
            url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') 
        )
    ) {
        return NextResponse.redirect(new URL('/extension', request.url))
    }
    if(!token && url.pathname.startsWith('/extension')) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/signin',
        '/signup',
        '/extension',
        '/verify/:path*'
    ],
}