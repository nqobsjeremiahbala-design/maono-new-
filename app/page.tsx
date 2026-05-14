import { Hero } from '@/components/sections/Hero'
import { MembershipsPreview } from '@/components/sections/MembershipsPreview'
import { TradingViewTicker } from '@/components/sections/TradingViewTicker'
import { Testimonials } from '@/components/sections/Testimonials'
import { BrokerSection } from '@/components/sections/BrokerSection'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { MidCTA } from '@/components/sections/MidCTA'
import { StructuredLearningSplit } from '@/components/sections/StructuredLearningSplit'
import { AboutUs } from '@/components/sections/AboutUs'
import { ConfidenceSplit } from '@/components/sections/ConfidenceSplit'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Maono Forex Trading',
  description: 'Institutional-grade forex education for South African traders. Join our Telegram channel, structured courses, and membership plans.',
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <TradingViewTicker />
      <MembershipsPreview />
      <Testimonials />
      <BrokerSection />
      <WhyChooseUs />
      <MidCTA />
      <StructuredLearningSplit />
      <AboutUs />
      <ConfidenceSplit />
      <FinalCTA />
    </>
  )
}
