const pillars = [
  {
    title: 'Institutional approach',
    body: "We teach how banks and funds actually trade — not the retail indicator strategies that keep 90% of traders losing.",
    icon: '🏛️',
  },
  {
    title: 'Real team. Real mentorship.',
    body: 'Named humans with 7+ years of live trading experience. Not a faceless course platform. Not a pre-recorded ghost town.',
    icon: '🤝',
  },
  {
    title: 'Community, not a content library',
    body: 'You trade alongside others. Live signals, market breakdowns, and a community that holds each other accountable.',
    icon: '⚡',
  },
]

export function MethodologyBelt() {
  return (
    <section className="py-20 px-4 bg-navy-900">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        {pillars.map(p => (
          <div key={p.title}>
            <span className="text-3xl block mb-4">{p.icon}</span>
            <h3 className="font-serif text-xl text-cream-50 mb-3">{p.title}</h3>
            <p className="text-navy-300 text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
