"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/20"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Logo & Headline */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  📚 Für und von SchülerInnen entwickelt
                </span>
              </div>

              <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 tracking-tight leading-none">
                NoteTrack
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
                Deine intelligente Plattform für{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  Prüfungsmanagement
                </span>{" "}
                und{" "}
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Notenübersicht
                </span>
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 my-12 max-w-3xl mx-auto">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Prüfungen planen
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trage deine Prüfungstermine ein und behalte den Überblick
                </p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Noten verwalten
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatische Erinnerungen zum Noten eintragen
                </p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Leistungen im Überblick
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Behalte deine Leistungen im Blick mit detaillierter Analyse
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                href="/register"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center overflow-hidden"
              >
                <span className="relative z-10">Jetzt kostenlos starten</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>

              <Link
                href="/login"
                className="group w-full sm:w-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
              >
                Anmelden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
