export interface Course {
  slug: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  currency: 'ZAR'
  duration: string
  lessons: number
  topics: string[]
  image: string
  featured: boolean
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  image: string
  readTime: number
}

export interface Resource {
  slug: string
  title: string
  description: string
  type: 'lesson' | 'breakdown' | 'guide'
  date: string
  image: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  years: number
}

export interface MembershipTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  highlighted: boolean
}

export interface Seminar {
  title: string
  date: string
  location: string
  city: string
  description: string
  registrationUrl: string
  isFree: boolean
}

export type PathLevel = 'beginner' | 'intermediate' | 'advanced'
