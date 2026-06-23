'use client'

import { useState, useTransition } from 'react'
import { resolvePlan } from '@/lib/plan'
import { setCourseAccess, assignBundle, clearAccess } from './actions'

type Props = {
  user: { id: string; email: string; name: string | null }
  courses: [string, string][] // [slug, title] in learning order
  enrolledSlugs: string[]
  planTier?: string | null
  bundles: { id: string; name: string; slugs: string[] }[]
}

export function AccessManager({ user, courses, enrolledSlugs, planTier = null, bundles }: Props) {
  const [slugs, setSlugs] = useState<Set<string>>(new Set(enrolledSlugs))
  // Explicit plan tier (set when a bundle is assigned) — shown in the badge and
  // on the client's dashboard. Tracked locally so the badge updates instantly.
  const [tier, setTier] = useState<string | null>(planTier)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const toggle = (slug: string) => {
    const grant = !slugs.has(slug)
    const next = new Set(slugs)
    grant ? next.add(slug) : next.delete(slug)
    setSlugs(next)
    startTransition(async () => {
      await setCourseAccess(user.id, slug, grant)
      flash()
    })
  }

  const applyBundle = (b: { id: string; name: string; slugs: string[] }) => {
    setSlugs(new Set(b.slugs))
    setTier(b.name)
    startTransition(async () => {
      await assignBundle(user.id, b.id)
      flash()
    })
  }

  const clearAll = () => {
    setSlugs(new Set())
    setTier(null)
    startTransition(async () => {
      await clearAccess(user.id)
      flash()
    })
  }

  const plan = resolvePlan(tier, slugs.size)

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-white font-medium">{user.name || '—'}</p>
          <p className="text-navy-400 text-sm">{user.email}</p>
        </div>
        <div className="text-right shrink-0">
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${
              slugs.size === 0
                ? 'bg-navy-800 text-navy-400'
                : 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
            }`}
          >
            {plan ? plan.name : 'No access'}
          </span>
          <p className="text-navy-500 text-xs mt-1">
            {slugs.size} {slugs.size === 1 ? 'course' : 'courses'}
            {pending && <span className="text-gold-400"> · saving…</span>}
            {saved && !pending && <span className="text-green-400"> · saved ✓</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {courses.map(([slug, title]) => {
          const on = slugs.has(slug)
          return (
            <button
              key={slug}
              type="button"
              onClick={() => toggle(slug)}
              disabled={pending}
              className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-60 ${
                on
                  ? 'bg-green-900/30 border border-green-700/50 text-white'
                  : 'bg-navy-800/50 border border-navy-700 text-navy-300 hover:bg-navy-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] shrink-0 ${
                  on ? 'bg-green-500 text-navy-950' : 'border border-navy-600'
                }`}
              >
                {on ? '✓' : ''}
              </span>
              {title}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-navy-800">
        <span className="text-navy-500 text-xs mr-1">Assign bundle:</span>
        {bundles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => applyBundle(b)}
            disabled={pending}
            className="text-xs px-3 py-1.5 rounded-md bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700 transition-colors disabled:opacity-60"
          >
            {b.name}
          </button>
        ))}
        <button
          type="button"
          onClick={clearAll}
          disabled={pending || slugs.size === 0}
          className="text-xs px-3 py-1.5 rounded-md text-red-400 hover:bg-red-900/30 border border-red-900/50 transition-colors disabled:opacity-40 ml-auto"
        >
          Clear all
        </button>
      </div>
    </div>
  )
}
