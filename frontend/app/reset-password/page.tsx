"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Bitte geben Sie Ihre E-Mail-Adresse ein");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      setLoading(false);
      return;
    }

    const { error } = await resetPassword(email);

    if (error) {
      if (error.message.includes("User not found")) {
        setError("Kein Benutzer mit dieser E-Mail-Adresse gefunden");
      } else if (error.message.includes("Email rate limit exceeded")) {
        setError(
          "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut."
        );
      } else {
        setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    } else {
      setSuccess(
        "Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde an Ihre E-Mail-Adresse gesendet."
      );
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden relative">
      {/* Background decoration - positioned relative to viewport */}
      <div className="fixed inset-0 bg-white/40 dark:bg-black/20 pointer-events-none"></div>
      <div className="fixed top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="group inline-block">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 tracking-tight hover:scale-105 transition-transform duration-300">
                NoteTrack
              </h1>
            </Link>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-600 shadow-lg mt-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                🔑 Passwort zurücksetzen
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link
              zum Zurücksetzen Ihres Passworts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-300 placeholder-gray-400 hover:bg-white/90 dark:hover:bg-gray-700/90"
                placeholder="deine@email.com"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-700 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50/80 dark:bg-green-900/30 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    {success}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? "Senden..." : "Reset-Link senden"}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Erinnern Sie sich an Ihr Passwort?{" "}
              <Link
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
              >
                Anmelden
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 font-medium"
            >
              <span className="mr-2">←</span>
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
