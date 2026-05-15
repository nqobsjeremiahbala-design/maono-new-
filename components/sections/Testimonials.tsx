const TESTIMONIALS = [
  {
    quote:
      "I've been with Maono since the early days and have grown so much as a trader. Jody and the team are always there when you need them. The way they break things down makes forex feel less intimidating.",
    name: 'Qaaseem',
  },
  {
    quote:
      'Best decision I made was joining Maono. The course material is well-structured, the community is supportive, and the mentorship is real. Worth every cent.',
    name: 'Praveen Kumat',
  },
  {
    quote:
      "Maono changed how I see the market. The institutional approach made me unlearn a lot of bad retail habits. I'm a completely different trader now.",
    name: 'Caleb Barkes',
  },
  {
    quote:
      'Honest, transparent, and genuinely cares about your growth. The Maono team doesn’t sell hype, they teach you the process. That’s rare in this space.',
    name: 'Alverique',
  },
  {
    quote:
      'I tried other mentors before and wasted thousands. Maono is the only one that actually delivered on what they promised. Highly recommend the course bundles.',
    name: 'Greg Schuurman',
  },
  {
    quote:
      'The structured learning path took me from zero to executing my own setups with confidence. Jody is the real deal, the community is gold.',
    name: 'Kyle Fisher',
  },
  {
    quote:
      "What I appreciate most is the accountability. You're not just buying a course, you're joining a team that pushes you to take this seriously.",
    name: 'Ryan Jacobs',
  },
  {
    quote:
      'Maono is the most professional forex education team in South Africa. The content quality and ongoing support are unmatched.',
    name: 'Comforted Phiri',
  },
  {
    quote:
      'Joined as a complete beginner. Six months in, I understand structure, liquidity, and risk in a way I never thought I would. Thank you Maono.',
    name: 'Kelly Frans',
  },
  {
    quote:
      'Real traders teaching real concepts. The Telegram channel alone has been worth more than most paid courses I’ve bought elsewhere.',
    name: 'Brady Layman',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gold-600 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Student Stories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4 leading-tight">
            Real traders. Real results.
          </h2>
          <p className="text-navy-500 text-base sm:text-lg max-w-xl mx-auto">
            Hundreds of students. Years of compounding growth. These are their words, not ours.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              className="bg-white rounded-lg p-6 sm:p-8 flex flex-col items-center text-center shadow-sm border border-navy-100"
            >
              <span className="text-gold-500 text-5xl font-serif leading-none mb-5" aria-hidden>
                &ldquo;
              </span>
              <p className="text-navy-600 text-sm leading-relaxed mb-6 flex-1">
                {t.quote}
              </p>
              <p className="text-navy-900 font-semibold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
