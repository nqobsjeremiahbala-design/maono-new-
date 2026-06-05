import { ResetPasswordForm } from './ResetPasswordForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = {
  ...generatePageMetadata({
    title: 'Reset password',
    description: 'Choose a new password for your Maono Forex Trading account.',
    path: '/reset-password',
  }),
  robots: { index: false, follow: false },
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await searchParams

  return (
    <section className="bg-navy-950 min-h-dvh px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-md">
        <div className="mb-6 h-0.5 w-12 bg-gold-500" />
        <h1 className="mb-3 font-serif text-3xl text-white sm:text-4xl">Set a new password</h1>
        <p className="mb-8 text-navy-300">Choose a new password for your account.</p>
        <ResetPasswordForm token={token} email={email} />
      </div>
    </section>
  )
}
