import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { verifyPhpass } from './phpass'

export type SessionUser = {
  id: string
  email: string
  name: string | null
  role: 'STUDENT' | 'ADMIN'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null

        let valid = false

        if (user.passwordHash) {
          // WordPress 6+ wraps bcrypt with a $wp$ prefix — strip it before comparing
          const hash = user.passwordHash.startsWith('$wp$')
            ? user.passwordHash.slice(4)
            : user.passwordHash
          valid = await bcrypt.compare(password, hash)
        }

        // Fallback: legacy WordPress phpass hash from migration
        if (!valid && user.legacyPasswordHash) {
          // WordPress 6+ bcrypt stored in legacyPasswordHash
          if (user.legacyPasswordHash.startsWith('$wp$')) {
            valid = await bcrypt.compare(password, user.legacyPasswordHash.slice(4))
          } else {
            valid = verifyPhpass(password, user.legacyPasswordHash)
          }

          if (valid) {
            // Seamlessly re-hash to bcrypt and clear the legacy hash
            const newHash = await bcrypt.hash(password, 12)
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: newHash, legacyPasswordHash: null },
            })
          }
        }

        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Credentials provider includes role; OAuth does not — look it up
        const role = (user as SessionUser).role
        if (role) {
          token.role = role
        } else {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id! }, select: { role: true } })
          token.role = dbUser?.role ?? 'STUDENT'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as unknown as SessionUser
        user.id = token.id as string
        user.role = token.role as 'STUDENT' | 'ADMIN'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})

export async function getServerSession() {
  const session = await auth()
  return session
}

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === 'ADMIN'
}
