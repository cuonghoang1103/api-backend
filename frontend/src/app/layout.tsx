import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
// Self-hosted fonts via @fontsource (npm) instead of next/font/google.
// The Google-Fonts build-time fetch (fonts.gstatic.com) was flaky from
// the VPS and repeatedly failed the deploy ("Failed to fetch Poppins from
// Google Fonts"). @fontsource ships the woff2 in node_modules, so the
// build is fully offline. We import the per-WEIGHT css (not the
// per-subset one): each weight file declares every subset with its own
// `unicode-range`, so the browser still downloads only latin+vietnamese
// on demand AND Vietnamese renders correctly. (The per-subset files omit
// unicode-range, which would make same-weight faces override each other
// and drop Vietnamese glyphs.) Families 'Inter'/'Poppins'/'JetBrains
// Mono' are wired to --font-* in globals.css :root.
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import DockLayout from '@/components/layout/DockLayout'
import CartDrawer from '@/components/shop/CartDrawer'
import { CART_ENABLED } from '@/lib/featureFlags'
import AuthProvider from '@/components/providers/AuthProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider'
import ServiceWorkerRegister from '@/components/providers/ServiceWorkerRegister'
import AppBootSplash from '@/components/ui/AppBootSplash'
import AuthBoot from '@/components/providers/AuthBoot'
import MusicAudioController from '@/components/music/MusicAudioController'
import MusicHistoryRecorder from '@/components/music/MusicHistoryRecorder'
import CyberCursor from '@/components/ui/CyberCursor'
import LocaleWrapper from '@/components/providers/LocaleWrapper'
import ClientOnly from '@/components/providers/ClientOnly'
import { ThemeProvider } from '@/context/ThemeContext'

// Font families are self-hosted via the @fontsource CSS imports above
// and exposed as --font-inter / --font-poppins / --font-jetbrains-mono
// in globals.css :root (consumed by tailwind fontFamily + globals).

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

const ProExpiryReminder = dynamic(
  () => import('@/components/pro/ProExpiryReminder'),
  { ssr: false }
)

const LangReviewReminder = dynamic(
  () => import('@/components/language/LangReviewReminder'),
  { ssr: false }
)

const PWAInstallPrompt = dynamic(
  () => import('@/components/providers/PWAInstallPrompt'),
  { ssr: false }
)

// Facebook-style comment modal. Store-driven, mounted once so it's
// available on every surface (feed, profile, saved). Opens whenever
// a PostCard's "Bình luận" button (or a ?comment=N deep-link) fires.
const PostCommentModal = dynamic(
  () => import('@/components/social/PostCommentModal'),
  { ssr: false }
)

// Realtime admin-announcement robot popup (2026-07-09). Store-driven,
// mounted once so an admin announcement flies in on EVERY page — even
// where the FloatingAIAssistant idle bubble is hidden (mobile/admin).
const AnnouncementBotPopup = dynamic(
  () => import('@/components/social/AnnouncementBotPopup'),
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
  // Google Search Console verification. Set the meta token from
  // Search Console via NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (baked
  // at build time). When unset, no tag is emitted. Registering the
  // site + submitting sitemap.xml in Search Console is what actually
  // gets "cuongthai" to show up when searched — the code side is ready.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
        // Brand aliases so a search for "cuongthai" / "cuong thai"
        // maps to this site.
        alternateName: ['cuongthai', 'Cuong Thai', 'cuongthai.com'],
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
    >
      <body suppressHydrationWarning className="antialiased">
        {/* Boot splash — rendered in the server HTML so it paints INSTANTLY
            on first load / PWA launch (before React hydrates). AppBootSplash
            (a client component below) fades it out once the app is ready.
            A tiny inline script is the hard fallback so it can never stick. */}
        <div id="app-splash" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="" width={96} height={96} />
          <div className="app-splash__bar" />
          <div className="app-splash__brand">CuongThai</div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "setTimeout(function(){var s=document.getElementById('app-splash');if(s)s.remove();},7000)",
          }}
        />

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
            <AppBootSplash />
            <ClientOnly>
              <Navbar />
              {CART_ENABLED && <CartDrawer />}
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
              <ProExpiryReminder />
              <LangReviewReminder />
              <SoundInitializer />
              <PWAInstallPrompt />
              <PostCommentModal />
              <AnnouncementBotPopup />
            </ClientOnly>
          </LocaleWrapper>
        </ThemeProvider>
        </TanStackQueryProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
