import Link from 'next/link'

type Props = {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: Props) {
  const isLogin = mode === 'login'
  return (
    <div className="bg-navy-900 border border-navy-800 rounded-2xl p-7 sm:p-9">
      <p className="text-gold-400 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
        Wireframe preview · Auth coming soon
      </p>
      <h1 className="font-serif font-extrabold text-3xl text-white mb-2">
        {isLogin ? 'Welcome back.' : 'Create your account.'}
      </h1>
      <p className="text-navy-300 text-sm mb-7">
        {isLogin
          ? 'Sign in to access your dashboard, courses, and Telegram links.'
          : 'Register to track your courses, plans, and Telegram access in one place.'}
      </p>
      <form className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-300 mb-2">
              Full name
            </label>
            <input
              type="text"
              disabled
              placeholder="Your name"
              className="w-full bg-navy-950 border border-navy-700 rounded-md px-4 py-3 text-white placeholder:text-navy-500 disabled:opacity-60"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-300 mb-2">
            Email
          </label>
          <input
            type="email"
            disabled
            placeholder="you@example.com"
            className="w-full bg-navy-950 border border-navy-700 rounded-md px-4 py-3 text-white placeholder:text-navy-500 disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-300 mb-2">
            Password
          </label>
          <input
            type="password"
            disabled
            placeholder="••••••••"
            className="w-full bg-navy-950 border border-navy-700 rounded-md px-4 py-3 text-white placeholder:text-navy-500 disabled:opacity-60"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center px-6 py-3 min-h-[48px] bg-gold-500 text-navy-950 font-bold rounded-md disabled:opacity-60 cursor-not-allowed"
        >
          {isLogin ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <p className="text-navy-400 text-sm text-center mt-6">
        {isLogin ? "Don't have an account? " : 'Already a member? '}
        <Link
          href={isLogin ? '/register' : '/login'}
          className="text-gold-400 hover:text-gold-300 font-semibold"
        >
          {isLogin ? 'Register' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
