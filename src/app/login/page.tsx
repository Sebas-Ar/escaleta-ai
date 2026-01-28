'use client'

import { login } from './actions'
import { useActionState } from 'react'
import { AuthListener } from '@/components/auth-listener'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <AuthListener />
      <form action={formAction} className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-center text-slate-900">Escaleta.ai Editor</h1>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600 text-center">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
