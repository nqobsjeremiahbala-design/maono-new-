'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getServerSession, isAdmin, type SessionUser } from '@/lib/auth'

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
