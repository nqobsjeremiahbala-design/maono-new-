import { Hero } from '@/components/sections/Hero'
import { LevelSegmenter } from '@/components/sections/LevelSegmenter'
import { MethodologyBelt } from '@/components/sections/MethodologyBelt'
import { SampleLesson } from '@/components/sections/SampleLesson'
import { CoursesPreview } from '@/components/sections/CoursesPreview'
import { ForWhom } from '@/components/sections/ForWhom'
import { TeamSnapshot } from '@/components/sections/TeamSnapshot'
import { MembershipsPreview } from '@/components/sections/MembershipsPreview'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { JsonLd } from '@/components/shared/JsonLd'
import { organizationJsonLd } from '@/lib/jsonld'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Maono Forex Trading',
  description: 'Institutional-grade forex education for South African traders. Free signals group, structured courses, and 1-on-1 mentorship.',
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero />
      <LevelSegmenter />
      <MethodologyBelt />
      <SampleLesson />
      <CoursesPreview />
      <ForWhom />
      <TeamSnapshot />
      <MembershipsPreview />
      <FinalCTA />
    </>
  )
}
