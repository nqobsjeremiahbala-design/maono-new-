import { ForgotPasswordForm } from './ForgotPasswordForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = {
  ...generatePageMetadata({
    title: 'Forgot password',
    description: 'Reset your Maono Forex Trading password.',
    path: '/forgot-password',
  }),
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <section className="bg-navy-950 min-h-dvh px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-md">
        <div className="mb-6 h-0.5 w-12 bg-gold-500" />
        <h1 className="mb-3 font-serif text-3xl text-white sm:text-4xl">Forgot your password?</h1>
        <p className="mb-8 text-navy-300">Enter the email on your account and we&apos;ll send you a link to reset your password.</p>
        <ForgotPasswordForm />
      </div>
    </section>
  )
}
