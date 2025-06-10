'use client';

import Link from 'next/link'
import React from 'react'

//Permanent header bar
export default function Header() {
  return (
    //Title and basic navigation
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <nav className="display: flex flex-direction: space-x-2">
            <h1 className="text-xl font-bold ">Task Tracking:</h1>
            <h1 className="text-xl">A Tech Demo</h1>
        </nav>
      
    
      <nav className="space-x-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link href="/profile" className="text-blue-600 hover:underline">Profile</Link>
        <Link href="/auth" className="text-red-500 hover:underline">Logout</Link>
      </nav>
    </header>
  )
}