import type { Metadata } from 'next'

const BASE_URL = 'https://maonoforextrading.co.za'
const SITE_NAME = 'Maono Forex Trading'

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/images/og-default.jpg',
}: {
  title: string
  description: string
  path?: string
  image?: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  const fullTitle = path === '' ? `${SITE_NAME} — Trading Insights Re-defined` : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
