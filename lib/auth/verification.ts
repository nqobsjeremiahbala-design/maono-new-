// Email-verification token helpers. Reuses the NextAuth `verification_tokens`
// table but namespaces the identifier as `verify:<email>` so it never collides
// with password-reset tokens (which use `identifier = <email>`).
import { prisma } from '@/lib/db'

const VERIFY_PREFIX = 'verify:'
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

const identifierFor = (email: string) => `${VERIFY_PREFIX}${email}`

function genToken(): string {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '')
}

// Create (replacing any existing) a verification token for an email. Returns the token.
export async function createVerificationToken(email: string): Promise<string> {
  const identifier = identifierFor(email)
  const token = genToken()
  const expires = new Date(Date.now() + TTL_MS)
  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({ data: { identifier, token, expires } })
  return token
}

// Validate + consume a verification token. True only if it matches the email,
// is the verification namespace, and hasn't expired. Deletes the token on success.
export async function consumeVerificationToken(email: string, token: string): Promise<boolean> {
  const identifier = identifierFor(email)
  const vt = await prisma.verificationToken.findUnique({ where: { token } })
  if (!vt || vt.identifier !== identifier || vt.expires < new Date()) return false
  await prisma.verificationToken.deleteMany({ where: { identifier } })
  return true
}
