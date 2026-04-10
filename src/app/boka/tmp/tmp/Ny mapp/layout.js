import './globals.css'

export const metadata = {
  title: {
    default: 'Artrill Berg — Exklusiv Frisör & Salong',
    template: '%s | Artrill Berg',
  },
  description:
    'Exklusiv frisörsalong med fokus på hantverk och personlig service. Boka din tid idag och upplev skillnaden.',
  keywords: [
    'frisör',
    'salong',
    'klippning',
    'färgning',
    'balayage',
    'slingor',
    'brud frisyr',
    'herrklippning',
    'damklippning',
    'exklusiv frisör',
    'premium salong',
    'boka frisör',
  ],
  authors: [{ name: 'Artrill Berg' }],
  creator: 'Artrill Berg',
  publisher: 'Artrill Berg',
  category: 'Beauty & Hair',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    siteName: 'Artrill Berg',
    title: 'Artrill Berg — Exklusiv Frisör & Salong',
    description:
      'Exklusiv frisörsalong med fokus på hantverk och personlig service. Boka din tid idag.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artrill Berg — Exklusiv Frisör',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artrill Berg — Exklusiv Frisör',
    description: 'Exklusiv frisörsalong. Boka din tid idag.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F0E8',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HairSalon',
              name: 'Artrill Berg',
              description: 'Exklusiv frisörsalong med fokus på hantverk och personlig service.',
              priceRange: '$$',
              openingHours: ['Mo-Fr 09:00-19:00', 'Sa 10:00-17:00'],
              sameAs: ['https://instagram.com/artrilberg'],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}