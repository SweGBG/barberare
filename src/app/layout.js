import './globals.css'

export const metadata = {
  title: 'Atilli Berg — Frisör',
  description: 'Premiärfrisör på Linnégatan. Boka din tid idag.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
