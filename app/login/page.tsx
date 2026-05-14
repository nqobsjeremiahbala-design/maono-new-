import { AuthForm } from '@/components/shared/AuthForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Login',
  description: 'Sign in to your Maono Forex Trading dashboard.',
  path: '/login',
})

export default function LoginPage() {
  return (
    <section className="bg-navy-950 min-h-dvh py-16 md:py-20 px-5 sm:px-6">
      <div className="max-w-md mx-auto">
        <AuthForm mode="login" />
      </div>
    </section>
  )
}
