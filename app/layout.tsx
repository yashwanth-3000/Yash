import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import { WEBSITE_URL } from '@/lib/constants'
import { SOCIAL_LINKS, EMAIL, PRESS } from './data'

// Person + WebSite structured data. This lets Google (and AI search engines)
// resolve "Yashwanth Krishna" to a single entity backed by his social profiles,
// which is the strongest lever for ranking on name searches.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${WEBSITE_URL}/#person`,
      name: 'Pavushetty Yashwanth Krishna',
      alternateName: ['Yashwanth Krishna', 'P Yashwanth Krishna'],
      url: WEBSITE_URL,
      image: `${WEBSITE_URL}/cover.jpg`,
      email: `mailto:${EMAIL}`,
      jobTitle: 'Generative AI Developer',
      description:
        'Generative AI Developer based in India building intelligent applications with AI, Machine Learning, RAG, and Computer Vision.',
      knowsAbout: [
        'Generative AI',
        'Machine Learning',
        'Retrieval-Augmented Generation',
        'Computer Vision',
        'Large Language Models',
        'Full-Stack Development',
      ],
      sameAs: [
        ...SOCIAL_LINKS.map((social) => social.link),
        'https://medium.com/@yashwanthkrishna169',
      ],
      subjectOf: PRESS.map((item) => ({
        '@type': 'NewsArticle',
        headline: item.title,
        url: item.link,
        publisher: { '@type': 'Organization', name: item.outlet },
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${WEBSITE_URL}/#website`,
      url: WEBSITE_URL,
      name: "Yashwanth Krishna — Portfolio",
      inLanguage: 'en-US',
      publisher: { '@id': `${WEBSITE_URL}/#person` },
    },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  title: {
    default: 'Yashwanth Krishna — Generative AI Developer | Portfolio',
    template: '%s | Yashwanth Krishna',
  },
  description:
    'Pavushetty Yashwanth Krishna - Generative AI Developer based in India. Building intelligent applications with AI, Machine Learning, RAG, and cutting-edge technology. Portfolio showcasing projects in GenAI, Computer Vision, and Full-Stack Development.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'Pavushetty Yashwanth Krishna',
    'Yashwanth Krishna',
    'P Yashwanth Krishna',
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
    url: '/',
    title: "Pavushetty Yashwanth Krishna - Generative AI Developer",
    description: 'Generative AI Developer building intelligent applications with AI, Machine Learning, and cutting-edge technology.',
    siteName: "Pavushetty Yashwanth Krishna's Portfolio",
    images: [
      {
        url: '/cover.jpg',
        width: 1200,
        height: 630,
        alt: "Pavushetty Yashwanth Krishna's portfolio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pavushetty Yashwanth Krishna - Generative AI Developer",
    description: 'Generative AI Developer building intelligent applications with AI, Machine Learning, and cutting-edge technology.',
    creator: '@yashwanth3000',
    images: ['/cover.jpg'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-6 sm:px-4 pt-8">
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
