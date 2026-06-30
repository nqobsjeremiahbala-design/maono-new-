'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markPurchasePaid } from './actions'

// Admin override: complete an order after confirming the payment on Netcash.
export function MarkPaidButton({ purchaseId, summary }: { purchaseId: string; summary: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const onClick = () => {
    if (
      !confirm(
        `Mark this order as PAID?\n\n${summary}\n\n` +
          `Only do this once you've confirmed the payment succeeded on Netcash. ` +
          `It grants course access and sends the receipt email.`,
      )
    )
      return
    startTransition(async () => {
      const res = await markPurchasePaid(purchaseId)
      if (!res.ok) alert(res.error || 'Could not update the order.')
      else router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-gold-400 hover:text-gold-300 disabled:opacity-50"
    >
      {pending ? 'Updating…' : 'Mark as paid'}
    </button>
  )
}
