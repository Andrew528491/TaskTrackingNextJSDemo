'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginData?.session) {
    // ✅ Successful login
    router.push('/dashboard');
    return;
    }

    if (loginError?.message === 'Invalid Login Credentials') {
      alert('Invalid email or password. Try again or reset your password.');
      return;
    } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`
  }
  });
    if (error) {
      setError(error.message)
    } else {
      router.push('auth/callback')
    }
  }

  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login / Signup</h1>
      <form className="flex flex-col gap-4">
        <input
          className="p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-slate-600 text-white rounded p-2 hover:bg-slate-800"
          onClick={handleLogin}
        >
          Log In
        </button>
        <button
          className="bg-slate-600 text-white rounded p-2 hover:bg-slate-800"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}