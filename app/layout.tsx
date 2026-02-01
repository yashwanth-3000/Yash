import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: "Yashwanth's Portfolio",
  description:
    'Pavushetty Yashwanth Krishna - Generative AI Developer based in India. Building intelligent applications with AI, Machine Learning, RAG, and cutting-edge technology. Portfolio showcasing projects in GenAI, Computer Vision, and Full-Stack Development.',
  keywords: [
    'Pavushetty Yashwanth Krishna',
    'Yashwanth Krishna',
    'Yashwanth',
    'Generative AI Developer',
    'AI Developer India',
    'Machine Learning Engineer',
    'Full Stack Developer',
    'GenAI',
    'RAG',
    'Computer Vision',
    'LLM',
    'Portfolio',
  ],
  authors: [{ name: 'Pavushetty Yashwanth Krishna' }],
  creator: 'Pavushetty Yashwanth Krishna',
  publisher: 'Pavushetty Yashwanth Krishna',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: "Pavushetty Yashwanth Krishna - Generative AI Developer",
    description: 'Generative AI Developer building intelligent applications with AI, Machine Learning, and cutting-edge technology.',
    siteName: "Pavushetty Yashwanth Krishna's Portfolio",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pavushetty Yashwanth Krishna - Generative AI Developer",
    description: 'Generative AI Developer building intelligent applications with AI, Machine Learning, and cutting-edge technology.',
    creator: '@yashwanth3000',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-zinc-50 tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
