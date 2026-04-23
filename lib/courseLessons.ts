export type Lesson = {
  slug: string
  title: string
  type: 'video' | 'text'
  duration: string
  description: string
  videoUrl?: string
  content?: string
}

export type CourseModule = {
  title: string
  lessons: Lesson[]
}

export type CourseCurriculum = {
  slug: string
  intro: string
  instructor: {
    name: string
    role: string
    bio: string
  }
  modules: CourseModule[]
}

// Demo video: Big Buck Bunny hosted by Google — stable placeholder
const DEMO_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

const FOREX_INTRO: CourseCurriculum = {
  slug: 'forex-trading-introduction',
  intro:
    'A complete start-to-trade path for absolute beginners. By the end you will understand how the forex market works, how to read a chart, and how to place a risk-managed trade with confidence.',
  instructor: {
    name: 'Maono Team',
    role: 'Lead Trading Educators',
    bio: 'Seven years trading live markets and teaching South African traders the process behind consistent, risk-managed results.',
  },
  modules: [
    {
      title: 'Module 1 · The forex market',
      lessons: [
        {
          slug: 'welcome',
          title: 'Welcome to the course',
          type: 'video',
          duration: '3 min',
          description: 'What to expect, how to use the platform, and a note before you begin.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'what-is-forex',
          title: 'What is forex, really?',
          type: 'video',
          duration: '8 min',
          description: 'The global currency market explained without jargon: who trades it, when, and why.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'market-hours',
          title: 'Market sessions and timing',
          type: 'text',
          duration: '6 min',
          description: 'Why London and New York matter, and why the Asian session behaves differently.',
          content: `The forex market trades 24 hours a day, five days a week. But not every hour is worth trading.

## The four major sessions

There are four main sessions: **Sydney, Tokyo, London, and New York**. Each one has its own personality.

- **Sydney** — the opener. Low volume, tight ranges.
- **Tokyo** — Asian session proper. Ranges and consolidation, good for mean-reversion on pairs like AUD/JPY.
- **London** — the start of "real" volume. Roughly 35% of all daily forex volume passes through London. Volatility spikes.
- **New York** — the second wave. The London/New York overlap (roughly 14:00–17:00 SAST) is the most active window in the entire day.

## What this means for you

Most South African traders should focus on the **London open (09:00–11:00 SAST)** and the **London/New York overlap (14:00–17:00 SAST)**. This is where institutional flow is most active and where clean setups tend to form.

Trading the Asian session is possible, but the ranges are tighter and the edge is harder to define for a beginner.

## Rule of thumb

If you are not sure whether it is worth sitting at the chart right now, check the clock. Outside 09:00–17:00 SAST on a weekday, the answer is usually no.`,
        },
        {
          slug: 'who-moves-the-market',
          title: 'Who actually moves price',
          type: 'text',
          duration: '5 min',
          description: 'Central banks, institutional funds, corporations, and where retail traders fit in.',
          content: `It is easy to imagine that the chart moves because of the traders you can see on Twitter. It does not.

## The real players

In order of size:

- **Central banks** — set interest rates and intervene in their own currencies. Biggest single movers.
- **Commercial banks and interbank market** — where most forex actually transacts, between institutions.
- **Hedge funds and asset managers** — large directional bets based on macro views.
- **Corporations** — hedging currency exposure for imports and exports.
- **Retail traders** — you and everyone on YouTube. Smallest bucket.

## Why this matters

Retail flow is tiny compared to institutional flow. When you read a chart, you are reading the aftermath of decisions made by players far larger than you.

The implication is simple: you do not need to predict price. You need to read where the big players are positioned and align with them.

That is what the rest of this course teaches.`,
        },
      ],
    },
    {
      title: 'Module 2 · Reading a chart',
      lessons: [
        {
          slug: 'candlesticks',
          title: 'Candlestick anatomy',
          type: 'video',
          duration: '9 min',
          description: 'Open, high, low, close — and what each wick actually tells you.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'timeframes',
          title: 'Choosing your timeframes',
          type: 'text',
          duration: '4 min',
          description: 'Why most beginners trade too low and how to structure a higher-timeframe-first approach.',
          content: `One of the most common beginner mistakes is trading exclusively on the 5-minute chart.

## The three-timeframe approach

Professional traders almost always use at least two, usually three, timeframes:

- **Context (HTF)** — daily or 4-hour. Used to mark structure, key levels, and overall trend.
- **Setup** — 1-hour or 15-minute. Used to identify where the trade idea forms.
- **Entry** — 5-minute or 1-minute. Used to time the entry once the setup is in play.

You do not enter trades on the context timeframe. You build ideas there.

## Pick your combination

For this course, we will use **4H for context, 1H for setup, 5M for entry**. This suits intraday and short swing trades, which is where most new traders make progress fastest.

If you cannot explain what is happening on the 4H before entering, you are trading blind on the 5M.`,
        },
        {
          slug: 'support-resistance',
          title: 'Support, resistance, and structure',
          type: 'video',
          duration: '12 min',
          description: 'Drawing levels that matter — higher highs, higher lows, and how to tell a real level from a noisy one.',
          videoUrl: DEMO_VIDEO,
        },
      ],
    },
    {
      title: 'Module 3 · Your first trade',
      lessons: [
        {
          slug: 'risk-management',
          title: 'Position sizing and the 1% rule',
          type: 'video',
          duration: '10 min',
          description: 'How to size a position so a losing trade costs you exactly what you planned, every time.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'trade-plan',
          title: 'Writing your trade plan',
          type: 'text',
          duration: '7 min',
          description: 'A one-page plan you will actually follow on a Monday morning.',
          content: `A trade plan should fit on one page. If it does not, nobody will read it, including you.

## The one-page plan

Your plan should answer five questions:

- **When** will I trade? Sessions, days, conditions to avoid.
- **What** will I trade? Which pairs, which timeframes.
- **Why** will I enter? Your A+ setup, described in a paragraph.
- **How much** will I risk? Per trade, per day, total open risk.
- **What then?** Your review process.

## The setup paragraph

Write your A+ setup in a paragraph a friend could read and understand:

> "I take a trade when price breaks a 4-hour structural high with momentum, pulls back into the broken level, and shows a rejection candle on the 1-hour. Stop goes above the recent swing, target is the next daily level. Risk per trade is 1%."

If you cannot write that paragraph, you do not have a setup. You have a vibe.

## Review

Every Sunday, spend ten minutes reviewing the week. Which trades followed the plan? Which did not? What emotion was driving the ones that broke rules? Write one thing to fix next week.

That is the entire plan. One page, five questions, reviewed weekly. It will do more for your results than any new indicator.`,
        },
        {
          slug: 'placing-the-trade',
          title: 'Placing your first live trade',
          type: 'video',
          duration: '14 min',
          description: 'A walkthrough of a full trade: setup, entry, stop, target, and post-trade review.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'next-steps',
          title: 'Where to go from here',
          type: 'text',
          duration: '3 min',
          description: 'The habits that separate the traders who make it through year one from those who do not.',
          content: `You have reached the end of the introduction course. Congratulations.

## What changes now

For the next month, your job is simple: trade the setup from Module 3, journal every trade, and do nothing else. Not a new strategy. Not a new pair. Not a new timeframe. The same setup, executed cleanly, fifty times.

## What to look for

At the end of the month, review the journal. Look for:

- Which trades followed the plan?
- Which trades broke the rules, and what was the emotion behind them?
- Is there a time of day or pair that performs noticeably better?

## The next course

When you are consistently following your plan on the introduction setup, move on to **Price Action Trading** or **Institutional Concepts**. Not before. Discipline compounds. Strategy-hopping does not.

Trade safe. We are here when you need us.`,
        },
      ],
    },
  ],
}

const TRADING_PSYCHOLOGY: CourseCurriculum = {
  slug: 'trading-psychology',
  intro:
    'Trading psychology is not about being positive. It is about building a set of habits and frameworks that let you execute your plan when your emotions are telling you not to. This course is mostly written, because the ideas are best sat with, not watched.',
  instructor: {
    name: 'Maono Team',
    role: 'Lead Trading Educators',
    bio: 'Seven years of live trading, mentoring, and watching what actually separates traders who last from those who do not.',
  },
  modules: [
    {
      title: 'Module 1 · The mindset problem',
      lessons: [
        {
          slug: 'why-psychology-matters',
          title: 'Why psychology is the real edge',
          type: 'text',
          duration: '6 min',
          description: 'Strategy is the ten percent. Execution is the ninety. Here is why.',
          content: `There is a phrase that gets thrown around in trading: "psychology is 90% of the game."

It sounds like a cliché. It is also, unfortunately, true.

## The thought experiment

Imagine two traders using the exact same strategy. Same entries, same stops, same targets.

Trader A follows the plan. Every trade. Even the ones that feel wrong.

Trader B takes the setups that "feel right," skips the ones that "feel off," moves stops when the trade gets uncomfortable, and occasionally doubles down after a loss.

After one hundred trades, Trader A is slightly profitable. Trader B is down thirty percent.

## What this tells us

The edge was not the strategy. Both had the same one. The edge was execution. Trader A's psychology let the strategy produce its results. Trader B's psychology got in the way.

**Strategy is what you know. Psychology is what you do when you know it.**

Most traders work on the first and ignore the second. The ones who make it through year one learn to flip that ratio.`,
        },
        {
          slug: 'fear-and-greed',
          title: 'Fear, greed, and the two mistakes they cause',
          type: 'video',
          duration: '11 min',
          description: 'The two emotional patterns behind almost every losing account, and how to see them in yourself.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'overtrading',
          title: 'Why overtrading happens',
          type: 'text',
          duration: '5 min',
          description: 'Overtrading is a symptom. Here is the real cause.',
          content: `Overtrading is one of the top three reasons accounts blow up. It is also misunderstood.

## What it actually is

Overtrading is taking trades that do not meet your plan's criteria. That is it. The number of trades is not the issue. The quality is.

A trader who takes eight trades in a day that all meet their A+ criteria is not overtrading. A trader who takes two trades in a day that neither met their criteria is.

## The real cause

Overtrading almost always comes from one of three emotional states:

- **Revenge** — trying to recover a loss immediately.
- **Boredom** — the market is flat and you feel like you should be doing something.
- **FOMO** — price is moving without you and you cannot stand it.

None of these have anything to do with the setup.

## The fix

The fix is not willpower. Willpower fails under emotional load. The fix is a rule that removes the decision:

> "After two consecutive losses, I am done for the day."
> "If the market is ranging on the 4H, I do not trade intraday."
> "If a trade has already moved more than halfway to its target without me, I do not chase."

Rules beat willpower. Write them. Follow them. Review them.`,
        },
      ],
    },
    {
      title: 'Module 2 · Building the habit',
      lessons: [
        {
          slug: 'the-pre-trade-ritual',
          title: 'The pre-trade ritual',
          type: 'text',
          duration: '5 min',
          description: 'Three questions that catch most bad trades before they happen.',
          content: `Before you click the button, ask three questions. Out loud if you have to.

## The three questions

1. **Does this setup match my written plan?** If you have to argue with yourself to say yes, the answer is no.
2. **What is the worst case?** Not the expected case. The worst. How much am I losing, in rands, if this hits the stop?
3. **Am I taking this trade for the right reason, or because I am bored, scared, or behind?** If you cannot answer this honestly, step away from the chart for ten minutes.

## Why it works

The three questions introduce friction at exactly the moment you need it. Your instinct is to click first and rationalise later. The ritual inverts that.

A surprising number of the worst trades you will ever take will fail the third question. Most will fail it after a loss.

## Make it physical

Type the three questions into a sticky note on the edge of your monitor. Read them before every entry for a month. By day thirty they will be part of how you trade.

Friction at the entry button is the cheapest risk management tool you will ever find.`,
        },
        {
          slug: 'journaling-habit',
          title: 'The journal that actually works',
          type: 'video',
          duration: '9 min',
          description: 'Why most trading journals fail — and a ten-minute-a-day format that does not.',
          videoUrl: DEMO_VIDEO,
        },
        {
          slug: 'sunday-review',
          title: 'The Sunday review',
          type: 'text',
          duration: '4 min',
          description: 'Ten minutes on a Sunday that compound into consistency.',
          content: `The single habit that separates the traders who survive year one from the ones who do not is not a setup. It is a Sunday review.

## The format

Ten minutes. A notebook or a Google Doc. Four questions:

- What did I do well this week?
- Which trades broke my rules?
- What emotion was driving the rule-breaking?
- What is one thing to change next week?

That is the whole ritual.

## Why Sundays

Sundays work because the markets are closed and you are not in the middle of a trade. You can think honestly. Your account balance is not arguing with you.

Doing this on a Monday morning does not work. You are too close to the next trade. Your ego is already defending the week that just happened.

## The compound effect

Most weeks you will write something small. "I skipped the plan on Tuesday because I was down and wanted to get back." Small observations.

After ten weeks, those small observations become a map of who you are as a trader. You will see patterns you could not see in the moment. That map is the difference between random results and improving ones.

Trade the week. Review on Sunday. Repeat.`,
        },
      ],
    },
    {
      title: 'Module 3 · The long game',
      lessons: [
        {
          slug: 'the-business-of-trading',
          title: 'Trading as a business, not a bet',
          type: 'text',
          duration: '6 min',
          description: 'The mental model that changes everything.',
          content: `The biggest mindset shift in trading is treating it as a business rather than a series of bets.

## The gambler's mindset

A gambler asks: "Will this win?" The answer is binary. Win or lose. The emotion is hope or disappointment.

Each trade feels important. Losses feel personal. Wins feel like proof of skill.

## The business mindset

A business owner asks: "Does my process have a positive expected value over time?" The answer is a distribution. Some weeks good, some weeks bad, overall trending up.

Each trade is a unit of work. Losses are a line item. Wins are a line item. The grade is the quarter, not the transaction.

## What changes when you make the shift

- You stop needing any single trade to work.
- You start caring about rule adherence more than outcomes.
- Losses stop being catastrophic.
- Wins stop being celebrations.
- The emotional amplitude of your trading drops by 80%.

This is what consistent traders mean when they say "detached execution." They are not emotionless. They have just stopped letting single transactions define them.

The business mindset is not natural. It is trained, through repeated exposure to losses that you survived because the sizing was right. That is why the 1% rule exists.`,
        },
        {
          slug: 'closing-lesson',
          title: 'One last thing',
          type: 'video',
          duration: '4 min',
          description: 'The final thought before you close this course.',
          videoUrl: DEMO_VIDEO,
        },
      ],
    },
  ],
}

const CURRICULA: Record<string, CourseCurriculum> = {
  'forex-trading-introduction': FOREX_INTRO,
  'trading-psychology': TRADING_PSYCHOLOGY,
}

export function getCurriculum(slug: string): CourseCurriculum | null {
  return CURRICULA[slug] ?? null
}

export function getAllLessons(slug: string): Lesson[] {
  const c = getCurriculum(slug)
  if (!c) return []
  return c.modules.flatMap(m => m.lessons)
}

export function getLesson(slug: string, lessonSlug: string): Lesson | null {
  return getAllLessons(slug).find(l => l.slug === lessonSlug) ?? null
}
