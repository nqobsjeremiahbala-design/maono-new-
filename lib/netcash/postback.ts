// Inbound Netcash postback parsing + logging (Workers/Web-standard APIs only).
import { prisma } from '@/lib/db'
import type { NetcashPostback, PostbackKind } from './types'

export async function readUrlEncoded(
  request: Request,
): Promise<{ raw: string; obj: Record<string, string> }> {
  const raw = await request.text()
  const obj: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(raw).entries()) obj[k] = v
  return { raw, obj }
}

// Case-insensitive field lookup (Netcash casing varies across rails).
export function pick(obj: Record<string, string>, ...names: string[]): string | undefined {
  for (const n of names) {
    const hit = Object.keys(obj).find((k) => k.toLowerCase() === n.toLowerCase())
    if (hit && obj[hit] !== undefined) return obj[hit]
  }
  return undefined
}

export function parsePostback(obj: Record<string, string>): NetcashPostback {
  return {
    TransactionAccepted: pick(obj, 'TransactionAccepted'),
    CardHolderIpAddr: pick(obj, 'CardHolderIpAddr'),
    RequestTrace: pick(obj, 'RequestTrace'),
    Reference: pick(obj, 'Reference', 'p2'),
    Extra1: pick(obj, 'Extra1', 'm4'),
    Extra2: pick(obj, 'Extra2', 'm5'),
    Extra3: pick(obj, 'Extra3', 'm6'),
    Amount: pick(obj, 'Amount', 'p4'),
    Method: pick(obj, 'Method'),
    Reason: pick(obj, 'Reason'),
  }
}

export function isAccepted(p: NetcashPostback): boolean {
  return String(p.TransactionAccepted).toLowerCase() === 'true'
}

// 303-redirect the browser to our status page (Accept/Decline/Redirect are UI-only).
export function statusRedirect(state: 'success' | 'declined' | 'pending', ref?: string): Response {
  const q = ref ? `&ref=${encodeURIComponent(ref)}` : ''
  return new Response(null, { status: 303, headers: { Location: `/checkout/status?state=${state}${q}` } })
}

// Always log the raw postback (best-effort) — our source of truth for UAT even
// if our parsing has a bug.
export async function logPostback(kind: PostbackKind, raw: string, p: NetcashPostback): Promise<void> {
  try {
    await prisma.netcashPostback.create({
      data: {
        kind,
        reference: p.Reference ?? null,
        requestTrace: p.RequestTrace ?? null,
        method: p.Method ?? null,
        accepted: p.TransactionAccepted ? isAccepted(p) : null,
        amount: p.Amount ?? null,
        rawPayload: raw.slice(0, 8000),
      },
    })
  } catch (e) {
    console.error('[netcash] postback log failed', e)
  }
}
