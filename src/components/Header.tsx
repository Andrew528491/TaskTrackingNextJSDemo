'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

//Permanent header bar
export default function Header() {
  const router = useRouter()

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
  } else {
    router.push('/auth') // redirect to auth page after logout
  }
};
  return (
    //Title and basic navigation
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <nav className="display: flex flex-direction: space-x-2">
            <h1 className="text-xl font-bold ">Task Tracking:</h1>
            <h1 className="text-xl">A Tech Demo</h1>
        </nav>
      
    
      <nav className="space-x-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link href="/calendar" className="text-blue-600 hover:underline">Calendar</Link>
        <Link href="/profile" className="text-blue-600 hover:underline">Profile</Link>
        <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
      </nav>
    </header>
  )
}