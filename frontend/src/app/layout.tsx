import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import DockLayout from '@/components/layout/DockLayout'
import CartDrawer from '@/components/shop/CartDrawer'
import AuthProvider from '@/components/providers/AuthProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider'
import ServiceWorkerRegister from '@/components/providers/ServiceWorkerRegister'
import AuthBoot from '@/components/providers/AuthBoot'
import MusicAudioController from '@/components/music/MusicAudioController'
import MusicHistoryRecorder from '@/components/music/MusicHistoryRecorder'
import CyberCursor from '@/components/ui/CyberCursor'
import LocaleWrapper from '@/components/providers/LocaleWrapper'
import ClientOnly from '@/components/providers/ClientOnly'
import { ThemeProvider } from '@/context/ThemeContext'

// Self-host Google Fonts via next/font so the CSS bundle does
// NOT @import fonts.googleapis.com at runtime — that request
// was being blocked / slow from Vietnam, which caused the
// whole stylesheet to fail parsing and left the page unstyled
// (a black screen with a centered spinner, which the user
// described as "stuck loading"). next/font downloads the
// font files at build time and serves them from the same
// origin as the app.
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

const GlobalMusicPlayer = dynamic(
  () => import('@/components/music/GlobalMusicPlayer'),
  { ssr: false }
)

// Phase 3: Listen Together realtime bridge. Renders nothing; reuses the
// existing socket. Mounted once here so sync survives route changes.
const ListenTogetherSync = dynamic(
  () => import('@/components/music/ListenTogetherSync'),
  { ssr: false }
)

const FloatingAIAssistant = dynamic(
  () => import('@/components/chat/FloatingAIAssistant'),
  { ssr: false }
)

const SoundInitializer = dynamic(
  () => import('@/components/providers/SoundInitializer'),
  { ssr: false }
)

const PWAInstallPrompt = dynamic(
  () => import('@/components/providers/PWAInstallPrompt'),
  { ssr: false }
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuongthai.com'),
  title: {
    default: 'CuongThai — Portfolio, Academy & E-commerce with AI',
    template: '%s | CuongThai',
  },
  description:
    'Portfolio, courses, music, blog & e-commerce platform built by Cuong Hoang. ' +
    'AI-powered chatbot, real-time messaging, and a hand-curated dev hub.',
  keywords: [
    'CuongThai',
    'Cuong Hoang',
    'portfolio',
    'e-commerce',
    'AI chatbot',
    'online courses',
    'Vietnam developer',
    'Next.js',
    'Spring Boot',
  ],
  authors: [{ name: 'Cuong Hoang', url: 'https://cuongthai.com' }],
  creator: 'Cuong Hoang',
  publisher: 'CuongThai',
  applicationName: 'CuongThai',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CuongThai',
  },
  icons: {
    // PNG multi-resolution set (from /favicon_io): 16x16 is the
    // browser tab favicon, 32x32 is the high-DPI tab/bookmark icon,
    // apple-touch-icon is the iOS home-screen icon (180x180 is the
    // iOS recommendation). android-chrome-* are PWA install icons
    // declared in /public/manifest.json.
    //
    // Note: we no longer ship a SVG variant — the original SVG was a
    // generic 'C' gradient placeholder from a code-generation tool
    // (commit 7690cdc). Replaced with the actual brand mark
    // (sleeping-cat with laptop + Zzz).
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  // Open Graph (Facebook, LinkedIn, Discord, …) — used when someone
  // shares the homepage on social. The og:image MUST be a 1200x630
  // PNG/JPG. We use Next.js's dynamic <AppRouter> OG image route
  // (./opengraph-image.tsx) which auto-generates a branded card so
  // we never have to ship a binary asset. Per-page OG overrides go
  // in each page's metadata export.
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://cuongthai.com',
    siteName: 'CuongThai',
    title: 'CuongThai — Portfolio, Academy & E-commerce with AI',
    description:
      'Portfolio, courses, music, blog & e-commerce platform built by Cuong Hoang.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CuongThai — Portfolio, Academy & E-commerce with AI',
      },
    ],
  },
  // Twitter card — large_image shows the branded image we generate
  // in ./twitter-image.tsx. Same renderer as the OG card so both
  // previews look identical.
  twitter: {
    card: 'summary_large_image',
    title: 'CuongThai — Portfolio, Academy & E-commerce with AI',
    description:
      'Portfolio, courses, music, blog & e-commerce platform built by Cuong Hoang.',
    creator: '@cuonghoang1103',
    images: ['/twitter-image'],
  },
  // Robots: opt in to indexing by default. Pages that should NOT
  // be indexed (admin, auth, etc.) override this with their own
  // `robots: { index: false }` in their page-level metadata.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Canonical URL — prevents duplicate-content penalties from
  // /, /index.html, and any future aliases. Sitemap's own
  // <loc> values match this.
  alternates: {
    canonical: 'https://cuongthai.com',
  },
}

// Separate `viewport` export (Next.js 14 way — keeps it
// from clashing with the static `metadata` object above).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // `cover` lets content extend under the iOS notch / home
  // indicator so we can pad with env(safe-area-inset-*).
  // Desktop browsers ignore viewport-fit, so this is a
  // mobile-only change with no effect on desktop layout.
  viewportFit: 'cover',
  themeColor: '#0a0a14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for the homepage. This is a
  // Schema.org/Person + WebSite + Organization triple that
  // gives Google rich-result data for the site owner.
  //
  // - Person: anchors the "author" of the portfolio
  // - WebSite: declares the site's canonical name + search
  //   target (we don't have a search results page yet, so we
  //   point at the homepage as a fallback)
  // - Organization: links the Person to the brand
  //
  // Note: This is the SITE-WIDE block. Page-level JSON-LD
  // (Course, BlogPosting, Product) should be added inside
  // each page component as its own <Script type="ld+json">
  // element, so the data is per-page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://cuongthai.com/#website',
        url: 'https://cuongthai.com',
        name: 'CuongThai',
        description:
          'Portfolio, courses, music, blog & e-commerce platform built by Cuong Hoang.',
        inLanguage: 'vi-VN',
        publisher: { '@id': 'https://cuongthai.com/#person' },
      },
      {
        '@type': 'Person',
        '@id': 'https://cuongthai.com/#person',
        name: 'Cuong Hoang',
        url: 'https://cuongthai.com',
        jobTitle: 'Full-Stack Developer & AI Engineer',
        knowsAbout: [
          'Next.js',
          'React',
          'TypeScript',
          'Spring Boot',
          'PostgreSQL',
          'Docker',
          'AI / LLM',
        ],
        sameAs: [
          'https://github.com/cuonghoang1103',
          'https://www.facebook.com/hoangnghiacuong',
        ],
      },
      {
        '@type': 'Organization',
        '@id': 'https://cuongthai.com/#org',
        name: 'CuongThai',
        url: 'https://cuongthai.com',
        logo: 'https://cuongthai.com/favicon.png',
        founder: { '@id': 'https://cuongthai.com/#person' },
      },
    ],
  }

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        {/* No-flash theme boot: runs synchronously BEFORE first paint
            so the html element already carries .dark/.light when the
            CSS variables in globals.css resolve. Without this, SSR
            ships a class-less <html> (= light :root variables) and
            ThemeProvider only applies the stored theme in a useEffect
            — a visible wrong-theme flash on every load. Default is
            'dark' to match ThemeContext's getServerSnapshot(). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='light'?'light':'theme-dark')}catch(e){document.documentElement.classList.add('theme-dark')}",
          }}
        />
        {/* Site-wide JSON-LD. The next/script wrapper defers it
            so it doesn't block first paint. Pages that need
            per-page structured data (Course, BlogPosting,
            Product) add their own <script type="application/
            ld+json"> inside the page component. */}
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML is required because Next
          // would otherwise escape the JSON braces and break
          // the parser. The payload is a static const above,
          // so there's no XSS surface.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <AuthProvider>
        {/* Must be inside AuthProvider so useAuth() works if any future
            callers need it, and inside SessionProvider for consistency. */}
        <AuthBoot />
        <ToasterProvider />
        <TanStackQueryProvider>
       <ThemeProvider>
          <LocaleWrapper>
            <ServiceWorkerRegister />
            <ClientOnly>
              <Navbar />
              <CartDrawer />
              <CyberCursor />
            </ClientOnly>

            {/* DockLayout provides the collapsible left sidebar + animated content shift */}
            <DockLayout>
              {children}
            </DockLayout>

            <ClientOnly>
              <MusicAudioController />
              <MusicHistoryRecorder />
              <GlobalMusicPlayer />
              <ListenTogetherSync />
              <FloatingAIAssistant />
              <SoundInitializer />
              <PWAInstallPrompt />
            </ClientOnly>
          </LocaleWrapper>
        </ThemeProvider>
        </TanStackQueryProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
