// ── Go-live gating ──────────────────────────────────────────────────────────
// When enrollment is CLOSED, only admins can complete a checkout and enrol in a
// course. This is the launch state the client asked for:
//
//   • Existing clients (migrated from the WordPress DB) already have enrollments,
//     so they sign in and watch their courses as normal — unaffected by this flag.
//   • New clients can register, sign in and browse, but cannot complete checkout
//     or enrol — every course stays paywalled with nothing behind it for them.
//   • Admins bypass the gate, so they can run the demo checkout and see courses
//     play in their dashboard (for testing / demos).
//
// The site is LIVE (launched 2026-06-30): registration + checkout are open to all.
// Hardcoded true on purpose — NEXT_PUBLIC_ENROLLMENT_OPEN resolved INCONSISTENTLY
// between OpenNext's client build (inlined) and the Worker server runtime (read from
// process.env, where it was absent), so the Register button + register API/checkout
// disagreed. A literal keeps client and server identical. To gate again, set to false.
export const ENROLLMENT_OPEN = true

/** True when this user may complete a checkout / enrol right now. */
export function canEnroll(role: string | undefined): boolean {
  return ENROLLMENT_OPEN || role === 'ADMIN'
}
