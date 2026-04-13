import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://barberare.vercel.app'),
  title: {
    default: 'Atilli Berg — Exklusiv Frisör & Salong',
    template: '%s | Atilli Berg',
  },
  description:
    'Exklusiv frisörsalong med fokus på hantverk och personlig service. Boka din tid idag och upplev skillnaden.',
  keywords: [
    'frisör', 'salong', 'klippning', 'färgning', 'balayage',
    'slingor', 'brud frisyr', 'herrklippning', 'damklippning',
    'exklusiv frisör', 'premium salong', 'boka frisör',
  ],
  authors: [{ name: 'Atilli Berg' }],
  creator: 'Atilli Berg',
  publisher: 'Atilli Berg',
  category: 'Beauty & Hair',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Atilli Berg',
    title: 'Atilli Berg — Exklusiv Frisör & Salong',
    description: 'Exklusiv frisörsalong med fokus på hantverk och personlig service. Boka din tid idag.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Atilli Berg — Exklusiv Frisör' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atilli Berg — Exklusiv Frisör',
    description: 'Exklusiv frisörsalong. Boka din tid idag.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F0E8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HairSalon',
              name: 'Atilli Berg',
              description: 'Exklusiv frisörsalong med fokus på hantverk och personlig service.',
              priceRange: '$$',
              openingHours: ['Mo-Fr 09:00-19:00', 'Sa 10:00-17:00'],
              sameAs: ['https://instagram.com/atilliberg'],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
