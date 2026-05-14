import { AuthForm } from '@/components/shared/AuthForm'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Register',
  description: 'Create your Maono Forex Trading account.',
  path: '/register',
})

export default function RegisterPage() {
  return (
    <section className="bg-navy-950 min-h-dvh py-16 md:py-20 px-5 sm:px-6">
      <div className="max-w-md mx-auto">
        <AuthForm mode="register" />
      </div>
    </section>
  )
}
