import { NextResponse, type NextRequest } from 'next/server'

const BLANK_HOSTS = new Set(['yashwanthkrishna.com', 'www.yashwanthkrishna.com'])

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase()

  if (host && BLANK_HOSTS.has(host)) {
    return new NextResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
