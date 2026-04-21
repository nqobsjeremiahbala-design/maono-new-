import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StickyBar } from '@/components/layout/StickyBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Maono Forex Trading — Trading Insights Re-defined',
  description: 'Institutional-grade forex education for South African traders. Free signals group, structured courses, and 1-on-1 mentorship.',
  metadataBase: new URL('https://maonoforextrading.co.za'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyBar />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`}
        </Script>
      </body>
    </html>
  )
}
