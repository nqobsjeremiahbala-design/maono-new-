import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import { Nav } from '@/components/layout/Nav'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { Providers } from '@/components/Providers'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Maono Forex Trading, Trading Insights Re-defined',
  description: 'Institutional-grade forex education for South African traders. Free signals group, structured courses, and 1-on-1 mentorship.',
  metadataBase: new URL('https://maonoforextrading.co.za'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={rubik.variable}>
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <SiteChrome />
        </Providers>
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
