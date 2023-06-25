import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'
import { locales } from './app/[lang]/layout'

function getLocale (request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value
  if (locale && locales.includes(locale)) return locale
  const negotiator = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') ?? '' } })
  // get locale from cookies
  return negotiator.language(locales)
}

export function middleware (request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) ?? 'en'
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url))
  }
  // return NextResponse.redirect(new URL('/en', request.url))
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
