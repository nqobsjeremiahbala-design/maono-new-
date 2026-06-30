import { VerifyEmailClient } from './VerifyEmailClient'

export const dynamic = 'force-dynamic'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await searchParams
  return (
    <section className="bg-navy-950 min-h-dvh py-16 md:py-24 px-5 sm:px-6">
      <div className="max-w-md mx-auto text-center hero-reveal">
        <VerifyEmailClient token={token ?? ''} email={email ?? ''} />
      </div>
    </section>
  )
}
