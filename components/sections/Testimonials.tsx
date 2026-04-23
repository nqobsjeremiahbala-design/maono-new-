const TESTIMONIALS = [
  {
    quote:
      'Absolute amazing team to work with. The course is easy to understand and to the point. Only had a great experience with Maono, they never turn you down when you ask for help. Definitely recommend.',
    name: 'Michaela',
  },
  {
    quote:
      "Never stopped following the Maono team since the day I joined the community back in 2022. What a journey, watching myself grow as an independent trader while the mentors grow with me. Huge blessing.",
    name: 'Shermanale',
  },
  {
    quote:
      "I bought a lot of courses in the past but Maono is the real one. Especially their story and how they started, it's relatable. I decided to buy their course and my trading game changed.",
    name: 'Jager',
  },
  {
    quote:
      "Best price action strategies by far. After years of wasting money on other people's bad signals, I found Maono. The setups and guidance helped me succeed without needing signals to boost my confidence.",
    name: 'Chad',
  },
  {
    quote:
      "What a legend! Had a great experience with Maono. The course is well-structured, and the community is really supportive. Their insights have helped me a lot with my trading. Highly recommend.",
    name: 'Justice',
  },
  {
    quote:
      "Thank you Maono for the easy-to-learn and understandable course. The daily guidance gave me more confidence to trade the FX market. Not just in trading but in life in general. Truly one of a kind.",
    name: 'Muller',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gold-600 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4 leading-tight">
            Success stories that speak
          </h2>
          <p className="text-navy-500 text-base sm:text-lg max-w-xl mx-auto">
            Traders who built the process, not the hype.
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
