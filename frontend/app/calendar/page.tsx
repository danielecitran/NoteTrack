'use client'

import Calendar from "../components/Calendar"

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Mein Kalender
      </h1>
      <Calendar />
    </div>
  )
}
