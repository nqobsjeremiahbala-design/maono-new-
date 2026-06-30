'use client'

import { useState, useTransition } from 'react'
import { resetUserPassword } from './actions'

// Sets a NEW temporary password and reveals it once for the admin to relay to the
// client. The old password is never shown (it isn't recoverable, by design).
export function ResetPasswordButton({ userId, email }: { userId: string; email: string }) {
  const [pending, startTransition] = useTransition()
  const [temp, setTemp] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const onClick = () => {
    if (
      !confirm(
        `Reset password for ${email}?\n\nThis sets a NEW temporary password and invalidates the current one. ` +
          `You'll be shown the new password once to give to the client.`,
      )
    )
      return
    startTransition(async () => {
      const res = await resetUserPassword(userId)
      if (!res.ok) {
        alert(res.error || 'Could not reset password.')
        return
      }
      setTemp(res.tempPassword)
    })
  }

  if (temp) {
    return (
      <span className="inline-flex items-center gap-2">
        <code className="select-all rounded bg-navy-800 px-2 py-0.5 text-xs text-gold-300">{temp}</code>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(temp)
            setCopied(true)
          }}
          className="text-xs text-navy-400 hover:text-white"
        >
          {copied ? 'copied' : 'copy'}
        </button>
        <button type="button" onClick={() => setTemp(null)} className="text-xs text-navy-500 hover:text-white">
          done
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-gold-400 hover:text-gold-300 disabled:opacity-50"
    >
      {pending ? 'Resetting…' : 'Reset password'}
    </button>
  )
}
