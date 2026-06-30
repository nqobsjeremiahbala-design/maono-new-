'use server'

import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'

// Strong, readable one-time password (ambiguous characters like 0/O/1/l removed).
function genTempPassword(len = 16): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  let out = ''
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return out
}

// Admin-initiated password reset. We NEVER store or reveal a client's existing
// password (it's a one-way bcrypt hash by design). Instead we SET a fresh strong
// temporary password, return it ONCE for the admin to relay, and the client can
// change it afterwards. This is the secure way to recover a locked-out account.
export async function resetUserPassword(
  userId: string,
): Promise<{ ok: true; tempPassword: string } | { ok: false; error: string }> {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) return { ok: false, error: 'Unauthorized' }

  const myId = (session.user as { id?: string }).id
  if (userId === myId) return { ok: false, error: 'Use “Forgot password” for your own account.' }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!target) return { ok: false, error: 'User not found.' }

  const tempPassword = genTempPassword()
  const passwordHash = await bcrypt.hash(tempPassword, 12)
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, legacyPasswordHash: null },
  })
  return { ok: true, tempPassword }
}

// Permanently delete a client account. Cascades remove their enrollments,
// progress, and purchase records (onDelete: Cascade in the schema).
// Guards: an admin can't delete themselves or another admin from here.
export async function deleteUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session || !isAdmin(session.user as SessionUser)) return { ok: false, error: 'Unauthorized' }

  const myId = (session.user as { id?: string }).id
  if (userId === myId) return { ok: false, error: 'You can’t delete your own account.' }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (!target) return { ok: false, error: 'User not found.' }
  if (target.role === 'ADMIN') return { ok: false, error: 'Admin accounts can’t be deleted here.' }

  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
  return { ok: true }
}
