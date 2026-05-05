import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )
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
