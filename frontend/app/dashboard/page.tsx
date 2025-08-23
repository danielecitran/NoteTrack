"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Calendar from "../components/Calendar";
import UpcomingExams from "../components/UpcomingExams";

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // redirect handled by useEffect

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden relative">
      <div className="relative">
        {/* Header */}
        <header className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 tracking-tight hover:scale-105 transition-transform duration-300 cursor-pointer">
                  NoteTrack
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.user_metadata?.first_name?.charAt(0) || "S"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.user_metadata?.first_name || "Schüler"}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group relative bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-2xl text-sm font-medium border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <span className="relative z-10">Abmelden</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 tracking-tight leading-none mb-4">
              Guten Tag, {user.user_metadata?.first_name || "Schüler"}!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Hier können Sie Ihre bevorstehenden Prüfungen eintragen und
              verwalten.
            </p>
          </div>

          {/* Upcoming Exams Notification */}
          <UpcomingExams />

          {/* Calendar */}
          <Calendar />
        </main>
      </div>
    </div>
  );
}
