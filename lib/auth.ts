/**
 * Auth configuration — NextAuth.js v5 (Auth.js)
 *
 * Architecture decisions:
 * - Credentials provider for email/password (SA market — social login optional later)
 * - Prisma adapter for session + user persistence
 * - JWT strategy (stateless, works with Vercel serverless)
 * - Role field on User for ADMIN/STUDENT gating
 *
 * Setup steps (when ready to activate):
 * 1. npm install next-auth@beta @auth/prisma-adapter
 * 2. npx auth secret (generates AUTH_SECRET)
 * 3. npx prisma migrate dev
 * 4. Uncomment the code below and wire into app/api/auth/[...nextauth]/route.ts
 */

// ─── Types ───────────────────────────────────────────────────
export type SessionUser = {
  id: string
  email: string
  name: string | null
  role: 'STUDENT' | 'ADMIN'
}

// ─── Placeholder until NextAuth is installed ─────────────────
// This file exports stubs so other code can import from '@/lib/auth'
// without breaking the build before the auth dependency is added.

export async function getServerSession(): Promise<{ user: SessionUser } | null> {
  // TODO: Replace with real NextAuth getServerSession once installed
  return null
}

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === 'ADMIN'
}

/*
 * ─── Real implementation (uncomment after installing next-auth) ───
 *
 * import NextAuth from 'next-auth'
 * import Credentials from 'next-auth/providers/credentials'
 * import { PrismaAdapter } from '@auth/prisma-adapter'
 * import { prisma } from './db'
 * import bcrypt from 'bcryptjs'
 *
 * export const { handlers, auth, signIn, signOut } = NextAuth({
 *   adapter: PrismaAdapter(prisma),
 *   session: { strategy: 'jwt' },
 *   providers: [
 *     Credentials({
 *       credentials: {
 *         email: { label: 'Email', type: 'email' },
 *         password: { label: 'Password', type: 'password' },
 *       },
 *       async authorize(credentials) {
 *         if (!credentials?.email || !credentials?.password) return null
 *         const user = await prisma.user.findUnique({
 *           where: { email: credentials.email as string },
 *         })
 *         if (!user?.passwordHash) return null
 *         const valid = await bcrypt.compare(
 *           credentials.password as string,
 *           user.passwordHash,
 *         )
 *         if (!valid) return null
 *         return { id: user.id, email: user.email, name: user.name, role: user.role }
 *       },
 *     }),
 *   ],
 *   callbacks: {
 *     async jwt({ token, user }) {
 *       if (user) {
 *         token.role = (user as any).role
 *         token.id = user.id
 *       }
 *       return token
 *     },
 *     async session({ session, token }) {
 *       if (session.user) {
 *         session.user.id = token.id as string
 *         session.user.role = token.role as string
 *       }
 *       return session
 *     },
 *   },
 *   pages: {
 *     signIn: '/login',
 *     error: '/login',
 *   },
 * })
 */
