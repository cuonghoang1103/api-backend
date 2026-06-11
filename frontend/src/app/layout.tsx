import '@/app/globals.css'
import type { Metadata } from 'next'
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

const GlobalMusicPlayer = dynamic(
  () => import('@/components/music/GlobalMusicPlayer'),
  { ssr: false }
)

const FloatingAIAssistant = dynamic(
  () => import('@/components/chat/FloatingAIAssistant'),
  { ssr: false }
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuonghoang.xyz'),
  title: 'CuongThai V2',
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
    <html lang="en" suppressHydrationWarning>
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
            </ClientOnly>
          </LocaleWrapper>
        </TanStackQueryProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
