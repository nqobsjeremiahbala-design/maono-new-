/**
 * WordPress phpass verifier — pure Node.js crypto, no external deps.
 *
 * Supports:
 *   $P$B...  — portable MD5-iterated hash (most WP users)
 *   $wp$2y$  — WordPress bcrypt wrapper (WP 6+); strip prefix → bcrypt.compare
 *
 * On successful phpass verify, auth.ts re-hashes to bcrypt and clears
 * legacyPasswordHash — seamless one-time migration per user.
 */
import { createHash } from 'crypto'

const ITOA64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function encode64(input: Buffer): string {
  let out = ''
  let i = 0
  const len = 16 // MD5 = 16 bytes
  do {
    let v = input[i++]
    out += ITOA64[v & 0x3f]
    if (i < len) v |= input[i] << 8
    out += ITOA64[(v >> 6) & 0x3f]
    if (i++ >= len) break
    if (i < len) v |= input[i] << 16
    out += ITOA64[(v >> 12) & 0x3f]
    if (i++ >= len) break
    out += ITOA64[(v >> 18) & 0x3f]
  } while (i < len)
  return out
}

function md5(data: Buffer): Buffer {
  return createHash('md5').update(data).digest()
}

/**
 * Returns true if `password` matches a WordPress phpass storedHash ($P$...).
 * The $wp$2y$ bcrypt variant is handled separately in auth.ts by stripping
 * the $wp$ prefix and calling bcrypt.compare directly.
 */
export function verifyPhpass(password: string, storedHash: string): boolean {
  // Very old WordPress: plain MD5
  if (storedHash.length === 32 && /^[0-9a-f]{32}$/.test(storedHash)) {
    return createHash('md5').update(password).digest('hex') === storedHash
  }

  if (!storedHash.startsWith('$P$') && !storedHash.startsWith('$H$')) {
    return false
  }

  const countLog2 = ITOA64.indexOf(storedHash[3])
  if (countLog2 < 7 || countLog2 > 30) return false

  const salt = Buffer.from(storedHash.substring(4, 12), 'utf8')
  const pass = Buffer.from(password, 'utf8')

  let count = 1 << countLog2
  let h = md5(Buffer.concat([salt, pass]))
  do {
    h = md5(Buffer.concat([h, pass]))
  } while (--count)

  return encode64(h) === storedHash.substring(12, 34)
}
