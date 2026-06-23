// Derive a client's plan tier from how many courses they're enrolled in.
// Migrated WordPress clients have enrollments but no purchase record, so the
// plan must come from their course entitlement, not a bundle purchase.
//
// Bundle course counts: Bronze=3, Silver=5, Gold=6. Anyone with at least one
// course is NOT on the free plan.
export function planForCourseCount(count: number): { tier: string; name: string } | null {
  if (count >= 6) return { tier: 'Gold', name: 'Gold' }
  if (count === 5) return { tier: 'Silver', name: 'Silver' }
  if (count >= 3) return { tier: 'Bronze', name: 'Bronze' }
  if (count >= 1) return { tier: 'Member', name: 'Lifetime access' }
  return null
}

// The plan to DISPLAY: an explicitly-provisioned tier (set when an admin assigns
// a bundle, or on purchase) wins — this is the only way to tell Platinum from
// Gold, since both unlock the same 6 courses. Falls back to the derived plan for
// migrated clients with no explicit tier.
export function resolvePlan(
  planTier: string | null | undefined,
  count: number,
): { tier: string; name: string } | null {
  if (planTier) return { tier: planTier, name: planTier }
  return planForCourseCount(count)
}
