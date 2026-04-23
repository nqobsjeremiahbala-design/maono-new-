const PILLARS = [
  {
    title: 'Structured & proven approach',
    body: 'High-quality trade insights alongside in-depth education, giving you both practical experience and the skills to trade consistently in live markets.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <rect x="3" y="5" width="6" height="4" rx="1" />
        <rect x="3" y="13" width="6" height="4" rx="1" />
        <path d="M12 7h9M12 15h9" />
        <path d="m5 6 1 1 2-2M5 14l1 1 2-2" />
      </svg>
    ),
  },
  {
    title: 'Risk-first trading mindset',
    body: 'Capital protection comes first. We teach strict risk management so you can survive losing trades and grow over time, not blow an account chasing one win.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <path d="M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7" />
      </svg>
    ),
  },
  {
    title: 'Built for real traders',
    body: "Whether you're a beginner or refining your edge, our course is designed to help you trade calmly, confidently, and consistently, for the long run.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
        <path d="M3 20V10M9 20V4M15 20v-7M21 20v-12" />
      </svg>
    ),
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4 leading-tight">
            Why choose us
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
          <p className="text-navy-600 text-base sm:text-lg max-w-2xl mx-auto">
            Our approach combines practical strategies, solid risk management, and trader psychology to help you trade with confidence in real market conditions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {PILLARS.map(p => (
            <div key={p.title} className="text-center">
              <div className="flex justify-center text-gold-500 mb-5">{p.icon}</div>
              <h3 className="font-serif text-xl text-navy-900 mb-3">{p.title}</h3>
              <p className="text-navy-600 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
