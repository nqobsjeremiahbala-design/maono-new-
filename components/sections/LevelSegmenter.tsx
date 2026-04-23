import Link from 'next/link'

const levels = [
  {
    href: '/paths/beginner',
    label: 'Beginner',
    emoji: '🌱',
    description: "You've heard about forex and want to start right, with a real foundation, not YouTube shortcuts.",
  },
  {
    href: '/paths/intermediate',
    label: 'Intermediate',
    emoji: '📈',
    description: 'You know the basics but your results are inconsistent. You need structure, psychology, and a system.',
  },
  {
    href: '/paths/advanced',
    label: 'Advanced',
    emoji: '🏦',
    description: "You're serious about institutional concepts, prop firms, and treating this as a career.",
  },
]

export function LevelSegmenter() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Choose your path
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          Wherever you are in your trading journey, we have a structured path for you.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {levels.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="group block bg-white border border-navy-100 rounded-lg p-6 hover:border-gold-500 hover:shadow-elevated transition-all"
            >
              <span className="text-3xl block mb-4">{l.emoji}</span>
              <h3 className="font-serif text-xl text-navy-900 mb-2 group-hover:text-gold-500 transition-colors">
                {l.label}
              </h3>
              <p className="text-sm text-navy-500">{l.description}</p>
              <span className="inline-block mt-4 text-sm text-gold-500 font-medium">
                View path →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
