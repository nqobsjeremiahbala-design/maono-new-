import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Course } from '@/lib/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 bg-navy-800">
        <Image
          src={course.image || `/images/courses/${course.slug}.jpg`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={course.level === 'advanced' ? 'navy' : course.level === 'intermediate' ? 'gold' : 'default'}>
            {course.level}
          </Badge>
          <span className="text-xs text-navy-400">{course.duration} · {course.lessons} lessons</span>
        </div>
        <h3 className="font-serif text-lg text-navy-900 mb-2">{course.title}</h3>
        <p className="text-sm text-navy-500 mb-4 flex-1">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-navy-900">R{course.price.toLocaleString()}</span>
          <Button asChild size="sm">
            <Link href={`/courses/${course.slug}`}>View course</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
