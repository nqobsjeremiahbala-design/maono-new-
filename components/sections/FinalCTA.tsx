import { SignalsForm } from '@/components/shared/SignalsForm'

export function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-navy-950">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
          Start free today
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Join the signals group. Zero cost.
        </h2>
        <p className="text-navy-300 mb-10">
          Get real market analysis in your WhatsApp daily. No commitment. Cancel anytime.
        </p>
        <SignalsForm />
      </div>
    </section>
  )
}
