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
// To re-open enrollment for everyone later, set NEXT_PUBLIC_ENROLLMENT_OPEN=true
// (a build/env var) and redeploy. Defaults to CLOSED when unset.
export const ENROLLMENT_OPEN =
  (process.env.NEXT_PUBLIC_ENROLLMENT_OPEN ?? 'false').toLowerCase() === 'true'

/** True when this user may complete a checkout / enrol right now. */
export function canEnroll(role: string | undefined): boolean {
  return ENROLLMENT_OPEN || role === 'ADMIN'
}
