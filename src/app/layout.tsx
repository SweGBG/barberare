import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://barberare.vercel.app'),
  title: {
    default: 'Atilli Berg | Herrfrisör & Barberare i Göteborg',
    template: '%s | Atilli Berg',
  },
  description:
    'Boka herrklippning, skäggtrimning och rakning hos Atilli Berg – din lokala barberare i Göteborg. Professionellt hantverk, personlig service. Boka online nu!',
  keywords: [
    'barberare Göteborg',
    'herrfrisör Göteborg',
    'herrklippning Göteborg',
    'boka barberare',
    'skäggtrimning Göteborg',
    'rakning Göteborg',
    'Atilli Berg',
    'barberare nära mig',
  ],
  authors: [{ name: 'Atilli Berg' }],
  creator: 'Atilli Berg',
  publisher: 'Atilli Berg',
  category: 'Beauty & Hair',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Atilli Berg',
    title: 'Atilli Berg | Herrfrisör & Barberare i Göteborg',
    description:
      'Boka herrklippning & skäggtrimning hos Atilli Berg i Göteborg. Professionell barberare med personlig service.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Atilli Berg — Barberare Göteborg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atilli Berg | Barberare Göteborg',
    description: 'Boka herrklippning & skäggtrimning online hos Atilli Berg.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.ico' },
  alternates: {
    canonical: 'https://barberare.vercel.app',
    languages: { 'sv-SE': 'https://barberare.vercel.app' },
  },
  verification: {
    google: 'UeGhODDdMQ3TXFNRzUgOel8hGvgH5DJ8_6fha1NcFPk',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0908',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  '@id': 'https://barberare.vercel.app/#barberare',
  name: 'Atilli Berg Barberare',
  url: 'https://barberare.vercel.app',
  description: 'Professionell herrfrisör och barberare i Göteborg. Boka herrklippning, skäggtrimning och rakning online.',
  priceRange: '$$',
  image: 'https://barberare.vercel.app/og-image.jpg',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '16:00',
    },
  ],
  sameAs: [
    'https://instagram.com/atilliberg',
  ],
  makesOffer: [
    { '@type': 'Offer', name: 'Herrklippning', priceCurrency: 'SEK' },
    { '@type': 'Offer', name: 'Skäggtrimning', priceCurrency: 'SEK' },
    { '@type': 'Offer', name: 'Rakning', priceCurrency: 'SEK' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <Script
          id="jsonld-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}