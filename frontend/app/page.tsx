'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="text-center space-y-12 max-w-md w-full">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            NoteTrack
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Organisiere deine Notizen intelligent
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full">
          {/* Login Button */}
          <Link href="/login" className="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105 hover:shadow-lg transform text-center">
            Anmelden
          </Link>

          {/* Register Button */}
          <Link href="/register" className="block w-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 hover:shadow-lg transform text-center">
            Registrieren
          </Link>
        </div>

        {/* Optional subtle decoration */}
        <div className="flex justify-center space-x-2 opacity-30">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
