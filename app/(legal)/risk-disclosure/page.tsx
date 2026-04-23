import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Risk Disclosure',
  description: 'Forex trading risk disclosure statement for Maono Forex Trading.',
  path: '/risk-disclosure',
})

export default function RiskDisclosurePage() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">Risk Disclosure</h1>
        <p className="text-navy-400 text-sm mb-8">Last updated: 2026-04-21</p>
        <p className="text-navy-600 mb-4">
          Trading forex and financial instruments carries a high level of risk. You could lose some
          or all of your invested capital. You should not trade with money you cannot afford to lose.
        </p>
        <p className="text-navy-600 mb-4">
          Maono Forex Trading provides educational content only and does not constitute financial
          advice or investment recommendations.
        </p>
        <p className="text-navy-600">
          Past performance of signals, strategies, or course content is not indicative of future results.
          All trading involves risk. Full legal risk disclosure to be reviewed by a qualified professional before launch.
        </p>
      </div>
    </section>
  )
}
