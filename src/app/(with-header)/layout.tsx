import '@/app/globals.css'
import Header from '@/components/Header'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Task Tracking',
  description: 'Intern tech demo for Daily Raiser',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <Header />
        <main className="p-6">{children}
          
        </main>
    </>
  )
}