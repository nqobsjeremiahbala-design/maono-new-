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

const INSTRUCTOR = {
  name: 'Maono Team',
  role: 'Lead Trading Educators',
  bio: 'Seven years trading live markets and teaching South African traders the process behind consistent, risk-managed results.',
}

const FOREX_INTRO: CourseCurriculum = {
  slug: 'forex-trading-introduction',
  intro:
    'A complete start-to-trade path for absolute beginners. Learn forex terminology, order types, chart types, and candlestick patterns — everything you need to read a chart and understand the market.',
  instructor: INSTRUCTOR,
  modules: [
    {
      title: 'Module 1 · Forex Fundamentals',
      lessons: [
        {
          slug: 'forex-terminology-intro',
          title: 'Forex Terminology Introduction',
          type: 'video',
          duration: '52 min',
          description: 'The language of forex: pips, lots, leverage, spread, and every term you need before placing a trade.',
          videoUrl: 'forex-trading-introduction/01-forex-terminology-intro.m4v',
        },
        {
          slug: 'order-types',
          title: 'Order Types',
          type: 'video',
          duration: '45 min',
          description: 'Market orders, limit orders, stop orders — when to use each and how they execute.',
          videoUrl: 'forex-trading-introduction/02-order-types.m4v',
        },
        {
          slug: 'types-of-trading',
          title: 'Types of Trading',
          type: 'video',
          duration: '21 min',
          description: 'Scalping, day trading, swing trading, and position trading — find the style that fits your life.',
          videoUrl: 'forex-trading-introduction/03-types-of-trading.m4v',
        },
        {
          slug: 'types-of-charts',
          title: 'Types of Charts',
          type: 'video',
          duration: '61 min',
          description: 'Line charts, bar charts, and candlestick charts — how to read each and why candlesticks win.',
          videoUrl: 'forex-trading-introduction/04-types-of-charts.mp4',
        },
        {
          slug: 'candlestick-patterns',
          title: 'Candlestick Patterns',
          type: 'video',
          duration: '34 min',
          description: 'The essential candlestick patterns every trader must recognise: doji, engulfing, hammer, and more.',
          videoUrl: 'forex-trading-introduction/05-candlestick-patterns.m4v',
        },
      ],
    },
  ],
}

const PRICE_ACTION: CourseCurriculum = {
  slug: 'price-action-trading',
  intro:
    'Learn to read the market through pure price action. No indicators, just structure, trendlines, support and resistance, impulse moves, and chart patterns.',
  instructor: INSTRUCTOR,
  modules: [
    {
      title: 'Module 1 · Price Action Fundamentals',
      lessons: [
        {
          slug: 'intro-to-price-action',
          title: 'Introduction to Price Action',
          type: 'video',
          duration: '30 min',
          description: 'What price action is, why it works, and how to read raw price without indicators.',
          videoUrl: 'price-action-trading/01-intro-to-price-action.m4v',
        },
        {
          slug: 'trendlines-and-structure',
          title: 'Trendlines and Structure',
          type: 'video',
          duration: '45 min',
          description: 'Drawing trendlines that matter and identifying market structure — higher highs, higher lows, and trend shifts.',
          videoUrl: 'price-action-trading/02-trendlines-and-structure.m4v',
        },
        {
          slug: 'market-structure-part-2',
          title: 'Market Structure Part 2',
          type: 'video',
          duration: '61 min',
          description: 'Advanced structure concepts: break of structure, change of character, and reading multi-timeframe structure.',
          videoUrl: 'price-action-trading/03-market-structure-part2.m4v',
        },
        {
          slug: 'impulse-moves',
          title: 'Impulse Moves',
          type: 'video',
          duration: '83 min',
          description: 'Identifying and trading impulse moves — the strong directional legs that reveal institutional intent.',
          videoUrl: 'price-action-trading/04-impulse-moves.mp4',
        },
        {
          slug: 'support-and-resistance',
          title: 'Support and Resistance',
          type: 'video',
          duration: '98 min',
          description: 'Finding real support and resistance levels, how they flip, and how to trade the reactions.',
          videoUrl: 'price-action-trading/05-support-and-resistance.m4v',
        },
        {
          slug: 'chart-patterns',
          title: 'Chart Patterns',
          type: 'video',
          duration: '44 min',
          description: 'Head and shoulders, double tops and bottoms, triangles, wedges, and flags — pattern recognition that works.',
          videoUrl: 'price-action-trading/06-chart-patterns.m4v',
        },
      ],
    },
  ],
}

const TRADING_TOOLS: CourseCurriculum = {
  slug: 'trading-tools',
  intro:
    'Master the platforms and tools professional traders use daily. Full TradingView setup plus a deep dive into Fibonacci tools — retracement, expansion, channels, and fans.',
  instructor: INSTRUCTOR,
  modules: [
    {
      title: 'Module 1 · TradingView & Fibonacci Tools',
      lessons: [
        {
          slug: 'tradingview-setup',
          title: 'TradingView Setup',
          type: 'video',
          duration: '90 min',
          description: 'Setting up TradingView from scratch — layout, chart settings, watchlists, and alerts.',
          videoUrl: 'trading-tools/01-tradingview-setup.mp4',
        },
        {
          slug: 'tradingview-tools',
          title: 'TradingView Tools',
          type: 'video',
          duration: '139 min',
          description: 'Every drawing tool you need: trendlines, channels, rectangles, and how to use them effectively.',
          videoUrl: 'trading-tools/02-tradingview-tools.mp4',
        },
        {
          slug: 'fib-retracement',
          title: 'Fibonacci Retracement',
          type: 'video',
          duration: '63 min',
          description: 'How to draw Fibonacci retracements correctly and identify the key levels where price reacts.',
          videoUrl: 'trading-tools/03-fib-retracement.m4v',
        },
        {
          slug: 'fib-expansion',
          title: 'Fibonacci Expansion',
          type: 'video',
          duration: '56 min',
          description: 'Using Fibonacci expansions to project price targets and find where moves are likely to end.',
          videoUrl: 'trading-tools/04-fib-expansion.m4v',
        },
        {
          slug: 'fib-with-structure',
          title: 'Fibonacci with Structure',
          type: 'video',
          duration: '69 min',
          description: 'Combining Fibonacci levels with market structure for high-probability confluences.',
          videoUrl: 'trading-tools/05-fib-with-structure.m4v',
        },
        {
          slug: 'fib-channel',
          title: 'Fibonacci Channel',
          type: 'video',
          duration: '46 min',
          description: 'Drawing and trading Fibonacci channels — identifying parallel trend boundaries.',
          videoUrl: 'trading-tools/06-fib-channel.m4v',
        },
        {
          slug: 'fib-fan',
          title: 'Fibonacci Fan',
          type: 'video',
          duration: '65 min',
          description: 'Using Fibonacci fans to identify dynamic support and resistance across time.',
          videoUrl: 'trading-tools/07-fib-fan.mp4',
        },
      ],
    },
  ],
}

const TRADING_STRATEGIES: CourseCurriculum = {
  slug: 'trading-strategies',
  intro:
    'Build and test rule-based trading strategies. Three complete breakout strategies you can apply immediately — box breakout, trendline breakout, and the ABCD pattern.',
  instructor: INSTRUCTOR,
  modules: [
    {
      title: 'Module 1 · Breakout Strategies',
      lessons: [
        {
          slug: 'box-breakout',
          title: 'Box Breakout Strategy',
          type: 'video',
          duration: '235 min',
          description: 'The complete box breakout system — identifying consolidation ranges and trading the breakout with defined risk.',
          videoUrl: 'trading-strategies/01-box-breakout.mp4',
        },
        {
          slug: 'trendline-breakout',
          title: 'Trendline Breakout Strategy',
          type: 'video',
          duration: '225 min',
          description: 'How to identify and trade trendline breaks — entries, stops, and targets with live examples.',
          videoUrl: 'trading-strategies/02-trendline-breakout.mp4',
        },
        {
          slug: 'abcd-pattern',
          title: 'ABCD Pattern',
          type: 'video',
          duration: '205 min',
          description: 'The ABCD harmonic pattern — identifying the setup, measuring the legs, and executing the trade.',
          videoUrl: 'trading-strategies/03-abcd-pattern.mp4',
        },
      ],
    },
  ],
}

const INSTITUTIONAL_CONCEPTS: CourseCurriculum = {
  slug: 'institutional-trading-concepts',
  intro:
    'Understand how banks and funds actually move markets. Learn smart money concepts and order blocks — the institutional footprints that retail traders miss.',
  instructor: INSTRUCTOR,
  modules: [
    {
      title: 'Module 1 · Smart Money Concepts',
      lessons: [
        {
          slug: 'intro-to-smart-money',
          title: 'Introduction to Smart Money',
          type: 'video',
          duration: '64 min',
          description: 'What smart money is, how institutions accumulate and distribute, and how to read their footprint on the chart.',
          videoUrl: 'institutional-trading-concepts/01-intro-to-smart-money.m4v',
        },
        {
          slug: 'order-blocks',
          title: 'Order Blocks',
          type: 'video',
          duration: '166 min',
          description: 'Identifying order blocks — the zones where institutional orders cluster — and trading the reactions.',
          videoUrl: 'institutional-trading-concepts/02-order-blocks.mp4',
        },
      ],
    },
  ],
}

const TRADING_PSYCHOLOGY: CourseCurriculum = {
  slug: 'trading-psychology',
  intro:
    'Master the mental game of trading. Eliminate emotional decisions, build discipline, and trade your plan consistently.',
  instructor: INSTRUCTOR,
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

**Strategy is what you know. Psychology is what you do when you know it.**`,
        },
        {
          slug: 'overtrading',
          title: 'Why overtrading happens',
          type: 'text',
          duration: '5 min',
          description: 'Overtrading is a symptom. Here is the real cause and the fix.',
          content: `Overtrading almost always comes from one of three emotional states:

- **Revenge** — trying to recover a loss immediately.
- **Boredom** — the market is flat and you feel like you should be doing something.
- **FOMO** — price is moving without you and you cannot stand it.

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
          content: `Before you click the button, ask three questions:

1. **Does this setup match my written plan?**
2. **What is the worst case?** How much am I losing, in rands, if this hits the stop?
3. **Am I taking this trade for the right reason?**

The three questions introduce friction at exactly the moment you need it. Friction at the entry button is the cheapest risk management tool you will ever find.`,
        },
        {
          slug: 'the-sunday-review',
          title: 'The Sunday review',
          type: 'text',
          duration: '4 min',
          description: 'Ten minutes on a Sunday that compound into consistency.',
          content: `Ten minutes. Four questions:

- What did I do well this week?
- Which trades broke my rules?
- What emotion was driving the rule-breaking?
- What is one thing to change next week?

After ten weeks, those small observations become a map of who you are as a trader. That map is the difference between random results and improving ones.`,
        },
      ],
    },
  ],
}

const CURRICULA: Record<string, CourseCurriculum> = {
  'forex-trading-introduction': FOREX_INTRO,
  'price-action-trading': PRICE_ACTION,
  'trading-tools': TRADING_TOOLS,
  'trading-strategies': TRADING_STRATEGIES,
  'institutional-trading-concepts': INSTITUTIONAL_CONCEPTS,
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
