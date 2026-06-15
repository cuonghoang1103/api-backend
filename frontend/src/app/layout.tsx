import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import DockLayout from '@/components/layout/DockLayout'
import CartDrawer from '@/components/shop/CartDrawer'
import AuthProvider from '@/components/providers/AuthProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider'
import MusicAudioController from '@/components/music/MusicAudioController'
import MusicHistoryRecorder from '@/components/music/MusicHistoryRecorder'
import CyberCursor from '@/components/ui/CyberCursor'
import LocaleWrapper from '@/components/providers/LocaleWrapper'
import ClientOnly from '@/components/providers/ClientOnly'

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

const FloatingAIAssistant = dynamic(
  () => import('@/components/chat/FloatingAIAssistant'),
  { ssr: false }
)

const MessagingWidget = dynamic(
  () => import('@/components/messaging/MessagingWidget'),
  { ssr: false }
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuonghoang.xyz'),
  title: 'CuongThai',
  description: 'Portfolio & E-commerce Platform with AI Integration',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="bg-darkbg text-text-primary antialiased">
      <AuthProvider>
        <ToasterProvider />
        <TanStackQueryProvider>
          <LocaleWrapper>
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
              <FloatingAIAssistant />
              <MessagingWidget />
            </ClientOnly>
          </LocaleWrapper>
        </TanStackQueryProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
