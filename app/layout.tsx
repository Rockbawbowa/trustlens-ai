import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrustLens AI — Intelligence you can verify.',
  description: 'Verify claims, assess suspicious content, and compare documents with structured AI intelligence.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
