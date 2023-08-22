import createIntlMiddleware from 'next-intl/middleware'

export default createIntlMiddleware({
  locales: ['en', 'zh-CN'],
  defaultLocale: 'en',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon.ico|assets|studio).*)'],
}
