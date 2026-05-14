import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News Feed | Maono Forex Trading',
  description: 'Live forex news and economic calendar for South African traders.',
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
