import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { buildOzowPaymentUrl } from '@/lib/payments/ozow'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { itemKey, courseSlug } = await request.json()
  if (!itemKey) {
    return NextResponse.json({ error: 'Missing itemKey' }, { status: 400 })
  }

  // Look up course if this is a course purchase
  let courseId: string | null = null
  let amountCents = 0

  if (courseSlug) {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    courseId = course.id
    amountCents = course.price
  }

  // If no course price, check if we have a catalog entry (paths, memberships)
  // For now, require courseSlug — extend later for paths/bundles
  if (!amountCents) {
    return NextResponse.json({ error: 'Unable to determine price' }, { status: 400 })
  }

  const userId = (session.user as { id: string }).id

  // Create a purchase record
  const purchase = await prisma.purchase.create({
    data: {
      userId,
      courseId,
      itemKey,
      amountCents,
    },
  })

  // Build Ozow payment URL
  const ozowUrl = buildOzowPaymentUrl({
    transactionReference: purchase.id,
    amount: amountCents / 100, // Ozow takes rands, not cents
    customerEmail: session.user.email || undefined,
    description: `Maono: ${itemKey}`,
  })

  return NextResponse.json({ paymentUrl: ozowUrl, purchaseId: purchase.id })
}
