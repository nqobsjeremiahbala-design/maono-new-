import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || adminPassword.length < 8) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_PASSWORD must be set and at least 8 characters in production')
    }
    console.warn('WARNING: Using default admin password. Set ADMIN_PASSWORD for production.')
  }
  const hashedPassword = await bcrypt.hash(adminPassword || 'admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@maonoforextrading.co.za' },
    update: {},
    create: {
      name: 'Maono Admin',
      email: process.env.ADMIN_EMAIL || 'admin@maonoforextrading.co.za',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log(`Admin user: ${admin.email}`)

  // 2. Import courses from MDX content
  const coursesDir = path.join(process.cwd(), 'content', 'courses')
  if (!fs.existsSync(coursesDir)) {
    console.log('No content/courses directory found, skipping course seed')
    return
  }

  const mdxFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.mdx'))

  for (const file of mdxFiles) {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(coursesDir, file), 'utf8')
    const { data } = matter(raw)

    const course = await prisma.course.upsert({
      where: { slug },
      update: {
        title: data.title,
        description: data.description,
        level: data.level,
        price: Math.round((data.price || 0) * 100), // Convert rands to cents
        duration: data.duration || '',
        image: data.image || null,
        featured: data.featured || false,
      },
      create: {
        slug,
        title: data.title,
        description: data.description,
        level: data.level,
        price: Math.round((data.price || 0) * 100),
        duration: data.duration || '',
        image: data.image || null,
        featured: data.featured || false,
      },
    })
    console.log(`Course: ${course.title} (${course.slug})`)
  }

  // 3. Seed modules and lessons (video + text)
  type SeedLesson = {
    slug: string
    title: string
    duration: string
    description?: string
  } & (
    | { type?: 'video'; videoUrl: string; content?: undefined }
    | { type: 'text'; content: string; videoUrl?: undefined }
  )
  const courseModules: Record<string, { title: string; lessons: SeedLesson[] }[]> = {
    'forex-trading-introduction': [
      {
        title: 'Forex Fundamentals',
        lessons: [
          { slug: 'forex-terminology-intro', title: 'Forex Terminology Introduction', videoUrl: 'forex-trading-introduction/01-forex-terminology-intro.m4v', duration: '52 min' },
          { slug: 'order-types', title: 'Order Types', videoUrl: 'forex-trading-introduction/02-order-types.m4v', duration: '45 min' },
          { slug: 'types-of-trading', title: 'Types of Trading', videoUrl: 'forex-trading-introduction/03-types-of-trading.m4v', duration: '21 min' },
          { slug: 'types-of-charts', title: 'Types of Charts', videoUrl: 'forex-trading-introduction/04-types-of-charts.mp4', duration: '61 min' },
          { slug: 'candlestick-patterns', title: 'Candlestick Patterns', videoUrl: 'forex-trading-introduction/05-candlestick-patterns.m4v', duration: '34 min' },
        ],
      },
    ],
    'price-action-trading': [
      {
        title: 'Price Action Fundamentals',
        lessons: [
          { slug: 'intro-to-price-action', title: 'Introduction to Price Action', videoUrl: 'price-action-trading/01-intro-to-price-action.m4v', duration: '30 min' },
          { slug: 'trendlines-and-structure', title: 'Trendlines and Structure', videoUrl: 'price-action-trading/02-trendlines-and-structure.m4v', duration: '45 min' },
          { slug: 'market-structure-part-2', title: 'Market Structure Part 2', videoUrl: 'price-action-trading/03-market-structure-part2.m4v', duration: '61 min' },
          { slug: 'impulse-moves', title: 'Impulse Moves', videoUrl: 'price-action-trading/04-impulse-moves.mp4', duration: '83 min' },
          { slug: 'support-and-resistance', title: 'Support and Resistance', videoUrl: 'price-action-trading/05-support-and-resistance.m4v', duration: '98 min' },
          { slug: 'chart-patterns', title: 'Chart Patterns', videoUrl: 'price-action-trading/06-chart-patterns.m4v', duration: '44 min' },
        ],
      },
    ],
    'trading-tools': [
      {
        title: 'TradingView & Fibonacci Tools',
        lessons: [
          { slug: 'tradingview-setup', title: 'TradingView Setup', videoUrl: 'trading-tools/01-tradingview-setup.mp4', duration: '90 min' },
          { slug: 'tradingview-tools', title: 'TradingView Tools', videoUrl: 'trading-tools/02-tradingview-tools.mp4', duration: '139 min' },
          { slug: 'fib-retracement', title: 'Fibonacci Retracement', videoUrl: 'trading-tools/03-fib-retracement.m4v', duration: '63 min' },
          { slug: 'fib-expansion', title: 'Fibonacci Expansion', videoUrl: 'trading-tools/04-fib-expansion.m4v', duration: '56 min' },
          { slug: 'fib-with-structure', title: 'Fibonacci with Structure', videoUrl: 'trading-tools/05-fib-with-structure.m4v', duration: '69 min' },
          { slug: 'fib-channel', title: 'Fibonacci Channel', videoUrl: 'trading-tools/06-fib-channel.m4v', duration: '46 min' },
          { slug: 'fib-fan', title: 'Fibonacci Fan', videoUrl: 'trading-tools/07-fib-fan.mp4', duration: '65 min' },
        ],
      },
    ],
    'trading-strategies': [
      {
        title: 'Breakout Strategies',
        lessons: [
          { slug: 'box-breakout', title: 'Box Breakout Strategy', videoUrl: 'trading-strategies/01-box-breakout.mp4', duration: '235 min' },
          { slug: 'trendline-breakout', title: 'Trendline Breakout Strategy', videoUrl: 'trading-strategies/02-trendline-breakout.mp4', duration: '225 min' },
          { slug: 'abcd-pattern', title: 'ABCD Pattern', videoUrl: 'trading-strategies/03-abcd-pattern.mp4', duration: '205 min' },
        ],
      },
    ],
    'institutional-trading-concepts': [
      {
        title: 'Smart Money Concepts',
        lessons: [
          { slug: 'intro-to-smart-money', title: 'Introduction to Smart Money', videoUrl: 'institutional-trading-concepts/01-intro-to-smart-money.m4v', duration: '64 min' },
          { slug: 'order-blocks', title: 'Order Blocks', videoUrl: 'institutional-trading-concepts/02-order-blocks.mp4', duration: '166 min' },
        ],
      },
    ],
    'trading-psychology': [
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

  for (const [courseSlug, modules] of Object.entries(courseModules)) {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
    if (!course) {
      console.log(`Course not found: ${courseSlug}, skipping modules`)
      continue
    }

    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi]
      const courseModule = await prisma.module.upsert({
        where: { id: `${courseSlug}-mod-${mi + 1}` },
        update: { title: mod.title, position: mi + 1 },
        create: {
          id: `${courseSlug}-mod-${mi + 1}`,
          courseId: course.id,
          title: mod.title,
          position: mi + 1,
        },
      })

      for (let li = 0; li < mod.lessons.length; li++) {
        const les = mod.lessons[li]
        const lessonType = les.type ?? 'video'
        await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: courseModule.id, slug: les.slug } },
          update: {
            title: les.title,
            type: lessonType,
            videoUrl: les.videoUrl ?? null,
            content: les.content ?? null,
            duration: les.duration,
            description: les.description ?? les.title,
            position: li + 1,
          },
          create: {
            moduleId: courseModule.id,
            slug: les.slug,
            title: les.title,
            type: lessonType,
            duration: les.duration,
            description: les.description ?? les.title,
            videoUrl: les.videoUrl ?? null,
            content: les.content ?? null,
            position: li + 1,
          },
        })
      }
      console.log(`  Module: ${mod.title} (${mod.lessons.length} lessons)`)
    }
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
