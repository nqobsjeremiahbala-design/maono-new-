import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@maonoforextrading.co.za' },
    update: {},
    create: {
      name: 'Maono Admin',
      email: process.env.ADMIN_EMAIL || 'admin@maonoforextrading.co.za',
      passwordHash: adminPassword,
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
