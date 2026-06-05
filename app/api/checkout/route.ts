import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { buildOzowPaymentUrl } from '@/lib/payments/ozow'
import { CATALOG, enrollSlugsForItem } from '@/lib/checkout'
import { canEnroll } from '@/lib/flags'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Go-live gate: only admins may start a checkout while enrollment is closed.
  const role = (session.user as { role?: string }).role
  if (!canEnroll(role)) {
    return NextResponse.json({ error: 'Enrollment is currently closed to new students.' }, { status: 403 })
  }

  const { itemKey } = (await request.json()) as { itemKey?: string }
  if (!itemKey) {
    return NextResponse.json({ error: 'Missing itemKey' }, { status: 400 })
  }

  // Price every purchasable item from the shared catalog — the single source of
  // truth the webhook re-validates against. Covers courses, paths, tiers and
  // bundles, so multi-course bundles can be bought through Ozow.
  const item = CATALOG[itemKey]
  if (!item) {
    return NextResponse.json({ error: 'Unknown item' }, { status: 400 })
  }
  const amountCents = Math.round(item.price * 100)

  // For a single-course purchase, record the courseId too (nice for reporting).
  // Bundles/paths/tiers leave it null and are expanded from itemKey on payment.
  const unlockSlugs = enrollSlugsForItem(itemKey)
  let courseId: string | null = null
  if (unlockSlugs.length === 1) {
    const course = await prisma.course.findUnique({
      where: { slug: unlockSlugs[0] },
      select: { id: true },
    })
    courseId = course?.id ?? null
  }

  const userId = (session.user as { id: string }).id

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
    description: `Maono: ${item.label}`,
  })

  return NextResponse.json({ paymentUrl: ozowUrl, purchaseId: purchase.id })
}
