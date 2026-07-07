import { Hero } from '@/components/sections/Hero'
import { TradingViewTicker } from '@/components/sections/TradingViewTicker'
import { MembershipsPreview } from '@/components/sections/MembershipsPreview'
import { BrokerOfChoice } from '@/components/sections/BrokerOfChoice'
import { TelegramTestimonials } from '@/components/sections/TelegramTestimonials'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { MidCTA } from '@/components/sections/MidCTA'
import { StructuredLearningSplit } from '@/components/sections/StructuredLearningSplit'
import { AboutUs } from '@/components/sections/AboutUs'
import { ConfidenceSplit } from '@/components/sections/ConfidenceSplit'
import { Testimonials } from '@/components/sections/Testimonials'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Maono Forex Trading',
  description: 'Institutional-grade forex education for South African traders. Telegram channel, structured course bundles, and real mentorship.',
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
      <WhyChooseUs />
      <MidCTA />
      <StructuredLearningSplit />
      <AboutUs />
      <ConfidenceSplit />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
