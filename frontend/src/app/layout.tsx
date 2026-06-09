import '@/app/globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/shop/CartDrawer'
import AuthProvider from '@/components/providers/AuthProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import MusicAudioController from '@/components/music/MusicAudioController'
import LocaleWrapper from '@/components/providers/LocaleWrapper'
import ClientOnly from '@/components/providers/ClientOnly'

// GlobalMusicPlayer reads from localStorage — never runs on the server.
const GlobalMusicPlayer = dynamic(
  () => import('@/components/music/GlobalMusicPlayer'),
  { ssr: false }
)

// FloatingAIAssistant reads from Zustand + localStorage — never runs on the server.
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
          <LocaleWrapper>
            {/*
              Navbar reads authStore + cartStore (persisted Zustand stores).
              Wrap in ClientOnly so it only renders after hydration — prevents
              React #300 hydration mismatch when navigating between pages.
            */}
            <ClientOnly>
              <Navbar />
              <CartDrawer />
            </ClientOnly>
            {children}
            <ClientOnly>
              <MusicAudioController />
              <GlobalMusicPlayer />
              <FloatingAIAssistant />
            </ClientOnly>
          </LocaleWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
