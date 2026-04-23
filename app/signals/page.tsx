import { SignalsForm } from '@/components/shared/SignalsForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Free Forex Signals Group',
  description: 'Join the Maono free signals group. Get real market analysis and trade ideas on WhatsApp daily. Zero cost.',
  path: '/signals',
})

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-navy-950 py-16 md:py-20 px-5 sm:px-6">
      <div className="max-w-lg mx-auto">
        <p className="text-gold-500 text-xs sm:text-sm font-medium uppercase tracking-widest text-center mb-4">
          Free · No commitment
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-white text-center mb-4 leading-tight">
          Join the free signals group
        </h1>
        <p className="text-navy-300 text-base sm:text-lg text-center mb-8 md:mb-10">
          Real market analysis. Daily trade ideas. A community of SA traders growing together.
          WhatsApp-based. Zero cost. Cancel anytime.
        </p>
        <div className="bg-navy-900 rounded-xl p-6 sm:p-8 mb-8">
          <SignalsForm />
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm text-navy-400">
          <div><p className="text-white font-semibold mb-1">Daily</p><p>Market analysis</p></div>
          <div><p className="text-white font-semibold mb-1">Live</p><p>Trade setups</p></div>
          <div><p className="text-white font-semibold mb-1">Free</p><p>Forever</p></div>
        </div>
      </div>
    </div>
  )
}
