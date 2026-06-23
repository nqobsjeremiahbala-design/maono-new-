'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from './actions'

type Props = {
  courses: [string, string][] // [slug, title] in learning order
  bundles: { id: string; name: string; slugs: string[] }[]
}

export function AddClientForm({ courses, bundles }: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [slugs, setSlugs] = useState<Set<string>>(new Set())
  const [bundleId, setBundleId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; error?: string; isNew?: boolean; emailSent?: boolean } | null>(null)

  const toggleCourse = (slug: string) => {
    setBundleId(null) // deviating from a bundle = custom selection
    setSlugs((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const pickBundle = (b: { id: string; slugs: string[] }) => {
    setBundleId(b.id)
    setSlugs(new Set(b.slugs))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    startTransition(async () => {
      const res = await createClient({
        email,
        name,
        ...(bundleId ? { bundleId } : { courseSlugs: [...slugs] }),
      })
      setResult(res)
      if (res.ok) {
        setEmail('')
        setName('')
        setSlugs(new Set())
        setBundleId(null)
      }
    })
  }

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-green-700/50 bg-green-900/20 p-6">
        <p className="text-green-300 font-medium mb-2">
          {result.isNew ? 'Client created ✓' : 'Existing client updated ✓'}
        </p>
        <p className="text-navy-300 text-sm mb-4">
          {result.isNew
            ? result.emailSent
              ? 'A set-password invite email was sent. They can also use “Forgot password” on the login page.'
              : 'Account created, but the invite email could not be sent — tell them to use “Forgot password” on the login page to set it.'
            : 'The account already existed; the chosen access was added to it.'}
        </p>
        <div className="flex gap-3">
          <button onClick={() => setResult(null)} className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-400">
            Add another
          </button>
          <Link href="/admin/users" className="rounded-md border border-navy-700 px-4 py-2 text-sm text-white hover:border-gold-400">
            Back to users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ac-email" className="block text-sm font-medium text-navy-300 mb-1.5">Email <span className="text-red-400">*</span></label>
          <input
            id="ac-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@example.com"
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-2.5 text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ac-name" className="block text-sm font-medium text-navy-300 mb-1.5">Name <span className="text-navy-500">(optional)</span></label>
          <input
            id="ac-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-md border border-navy-700 bg-navy-900 px-4 py-2.5 text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-navy-300 mb-2">Assign a bundle</p>
        <div className="flex flex-wrap gap-2">
          {bundles.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => pickBundle(b)}
              className={`rounded-md px-3.5 py-1.5 text-sm border transition-colors ${
                bundleId === b.id
                  ? 'bg-gold-500 text-navy-950 border-gold-500 font-semibold'
                  : 'bg-navy-800 text-navy-200 border-navy-700 hover:bg-navy-700'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-navy-300 mb-2">…or pick courses individually</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {courses.map(([slug, title]) => {
            const on = slugs.has(slug)
            return (
              <button
                key={slug}
                type="button"
                onClick={() => toggleCourse(slug)}
                className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  on
                    ? 'bg-green-900/30 border border-green-700/50 text-white'
                    : 'bg-navy-800/50 border border-navy-700 text-navy-300 hover:bg-navy-800'
                }`}
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded-sm text-[10px] shrink-0 ${on ? 'bg-green-500 text-navy-950' : 'border border-navy-600'}`}>
                  {on ? '✓' : ''}
                </span>
                {title}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-navy-500">
          {bundleId ? `Bundle selected — the client’s plan will show as “${bundles.find((b) => b.id === bundleId)?.name}”.` : `${slugs.size} course${slugs.size === 1 ? '' : 's'} selected (custom — plan derived from course count).`}
        </p>
      </div>

      {result && !result.ok && <p className="text-red-400 text-sm">{result.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !email || slugs.size === 0}
          className="rounded-md bg-gold-500 px-6 py-2.5 font-semibold text-navy-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {pending ? 'Creating…' : 'Create client & send invite'}
        </button>
        <Link href="/admin/users" className="text-sm text-navy-400 hover:text-white">Cancel</Link>
      </div>
    </form>
  )
}
