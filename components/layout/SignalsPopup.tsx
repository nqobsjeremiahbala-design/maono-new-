'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'maono-signals-popup-dismissed'

export function SignalsPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      // localStorage blocked — fall through and show once
    }
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Join the free signals group"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] animate-[slide-up_320ms_cubic-bezier(0.23,1,0.32,1)_both]"
    >
      <div className="relative bg-navy-900 border border-navy-800 rounded-2xl shadow-elevated p-5 pr-12">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="press absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <p className="text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
          Free · No signup
        </p>
        <p className="text-white font-serif text-lg leading-snug mb-1">
          Join the free signals group.
        </p>
        <p className="text-navy-300 text-sm leading-snug mb-4">
          Daily market analysis on WhatsApp. Cancel anytime.
        </p>
        <Link
          href="/signals"
          onClick={dismiss}
          className="press inline-flex w-full items-center justify-center px-5 py-3 min-h-[44px] rounded-md bg-gold-500 text-navy-950 font-semibold hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
        >
          Join the signals group →
        </Link>
      </div>
    </div>
  )
}
