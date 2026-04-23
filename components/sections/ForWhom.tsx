const forYou = [
  "You've tried learning from YouTube and lost money on it",
  'You want a structured system, not scattered tips',
  "You're willing to treat trading as a craft that takes time",
  'You want to understand WHY a trade works, not just copy signals',
  "You're ready to invest in your education seriously",
]

const notForYou = [
  "You want to get rich trading within a month",
  "You're not willing to spend time learning",
  'You want someone to trade your account for you',
  'You believe trading is a shortcut to passive income',
]

export function ForWhom() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-navy-900 text-center mb-4">
          Who Maono is for
        </h2>
        <p className="text-center text-navy-500 mb-12 max-w-lg mx-auto">
          We&apos;d rather be honest with you upfront than sell you something that isn&apos;t the right fit.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8">
            <h3 className="font-serif text-xl text-navy-900 mb-6">This is for you if…</h3>
            <ul className="space-y-3">
              {forYou.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-600">
                  <span className="text-gold-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-navy-950 rounded-lg p-8">
            <h3 className="font-serif text-xl text-white mb-6">This is not for you if…</h3>
            <ul className="space-y-3">
              {notForYou.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-300">
                  <span className="text-navy-500 mt-0.5 shrink-0">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
