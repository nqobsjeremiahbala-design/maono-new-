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

  // 3. Seed modules and lessons with video files
  const courseModules: Record<string, { title: string; lessons: { slug: string; title: string; videoUrl: string; duration: string }[] }[]> = {
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
        await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: courseModule.id, slug: les.slug } },
          update: {
            title: les.title,
            videoUrl: les.videoUrl,
            duration: les.duration,
            position: li + 1,
          },
          create: {
            moduleId: courseModule.id,
            slug: les.slug,
            title: les.title,
            type: 'video',
            duration: les.duration,
            description: les.title,
            videoUrl: les.videoUrl,
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
