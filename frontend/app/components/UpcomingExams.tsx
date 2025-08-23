"use client";
import { useState, useEffect } from "react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  description?: string;
}

export default function UpcomingExams() {
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);

  useEffect(() => {
    const loadUpcomingExams = () => {
      const saved = localStorage.getItem("calendar-exams");
      if (saved) {
        const allExams: Exam[] = JSON.parse(saved);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        // Filter exams that are within the next 30 days
        const upcoming = allExams.filter((exam) => {
          const examDate = new Date(exam.date);
          return examDate >= today && examDate <= thirtyDaysFromNow;
        });

        // Sort by date (closest first)
        upcoming.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setUpcomingExams(upcoming);
      }
    };

    // Load initially
    loadUpcomingExams();

    // Listen for storage changes (when exams are added/removed in Calendar component)
    const handleStorageChange = () => {
      loadUpcomingExams();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check for changes every 5 seconds as fallback
    const interval = setInterval(loadUpcomingExams, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getNextExam = () => {
    if (upcomingExams.length === 0) return null;
    return upcomingExams[0]; // Already sorted by date
  };

  const nextExam = getNextExam();

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">!</span>
        </div>
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300">
          Bevorstehende Prüfung:
        </h3>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-700">
        {nextExam ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Sie haben im Fach{" "}
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {nextExam.subject}
                </span>{" "}
                in{" "}
                <span className="text-red-600 dark:text-red-400 font-bold">
                  {getDaysUntilExam(nextExam.date)} Tag
                  {getDaysUntilExam(nextExam.date) !== 1 ? "en" : ""}
                </span>{" "}
                eine Prüfung
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {nextExam.title} -{" "}
                {new Date(nextExam.date).toLocaleDateString("de-DE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full border border-red-200 dark:border-red-700">
                <span className="text-sm font-bold text-red-700 dark:text-red-300">
                  {getDaysUntilExam(nextExam.date)} Tag
                  {getDaysUntilExam(nextExam.date) !== 1 ? "e" : ""}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Sie haben keine bevorstehende Prüfung
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Keine Prüfungen in den nächsten 30 Tagen geplant
            </p>
          </div>
        )}
      </div>

      {upcomingExams.length > 1 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Weitere bevorstehende Prüfungen:
          </p>
          <div className="space-y-2">
            {upcomingExams.slice(1, 4).map((exam) => (
              <div
                key={exam.id}
                className="flex justify-between items-center bg-gray-50/70 dark:bg-gray-700/50 rounded-xl p-3"
              >
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {exam.subject}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {exam.title}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {getDaysUntilExam(exam.date)} Tag
                  {getDaysUntilExam(exam.date) !== 1 ? "e" : ""}
                </span>
              </div>
            ))}
            {upcomingExams.length > 4 && (
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                +{upcomingExams.length - 4} weitere Prüfungen
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

