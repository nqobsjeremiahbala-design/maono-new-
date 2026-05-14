import { Hero } from '@/components/sections/Hero'
import { MembershipsPreview } from '@/components/sections/MembershipsPreview'
import { TradingViewTicker } from '@/components/sections/TradingViewTicker'
import { TelegramTestimonials } from '@/components/sections/TelegramTestimonials'
import { NewsFeed } from '@/components/sections/NewsFeed'
import { BrokerOfChoice } from '@/components/sections/BrokerOfChoice'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ConfidenceSplit } from '@/components/sections/ConfidenceSplit'
import { MidCTA } from '@/components/sections/MidCTA'
import { StructuredLearningSplit } from '@/components/sections/StructuredLearningSplit'
import { AboutUs } from '@/components/sections/AboutUs'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Maono Forex Trading',
  description: 'Institutional-grade forex education for South African traders. Telegram channel, structured courses, and live seminars.',
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <TradingViewTicker />
      <MembershipsPreview />
      <BrokerOfChoice />
      <TelegramTestimonials />
      <NewsFeed />
      <Testimonials />
      <WhyChooseUs />
      <MidCTA />
      <StructuredLearningSplit />
      <AboutUs />
      <ConfidenceSplit />
      <FinalCTA />
    </>
  )
}
