'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUser } from './actions'

export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const onClick = () => {
    if (
      !confirm(
        `Delete ${email}?\n\nThis permanently removes their account, course access and purchase history. This cannot be undone.`,
      )
    )
      return
    startTransition(async () => {
      const res = await deleteUser(userId)
      if (!res.ok) alert(res.error || 'Could not delete user.')
      else router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
