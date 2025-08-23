"use client";
import { useState, useEffect } from "react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  description?: string;
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const subjects = [
  "Mathematik",
  "Deutsch",
  "Englisch",
  "Französisch",
  "Wirtschaft und Recht",
  "Finanz und Rechnungswesen",
  "Geschichte",
  "Informatik",
];

export default function Calendar() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalExam, setModalExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Exam>({
    id: "",
    title: "",
    subject: "",
    date: "",
    description: "",
  });

  // Laden beim Start
  useEffect(() => {
    const saved = localStorage.getItem("calendar-exams");
    if (saved) setExams(JSON.parse(saved));
  }, []);

  const saveExams = (newExams: Exam[]) => {
    localStorage.setItem("calendar-exams", JSON.stringify(newExams));
    setExams(newExams);
  };

  const formatDateForInput = (dateStr: string) => {
    // Parse the date string and format it for input field
    const date = new Date(dateStr);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const openModal = (exam?: Exam, date?: Date) => {
    setModalExam(exam || null);
    setFormData(
      exam
        ? { ...exam, date: formatDateForInput(exam.date) }
        : {
            id: "",
            title: "",
            subject: "",
            date: date
              ? date.getFullYear() +
                "-" +
                String(date.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(date.getDate()).padStart(2, "0")
              : "",
            description: "",
          }
    );
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.date) return;
    const newExam = modalExam
      ? formData
      : { ...formData, id: Date.now().toString() };
    const updated = modalExam
      ? exams.map((e) => (e.id === modalExam.id ? newExam : e))
      : [...exams, newExam];
    saveExams(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    saveExams(exams.filter((e) => e.id !== id));
    setShowModal(false);
  };

  const getMonthDays = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => new Date(y, m, i + 1)),
    ];
  };

  const examsForDate = (date: Date) =>
    exams.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 tracking-tight">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <button
          onClick={() => openModal()}
          className="group relative bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
        >
          <span className="relative z-10">+ Neue Prüfung</span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-3 mb-4 text-center">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-3">
        {getMonthDays().map((day, i) =>
          !day ? (
            <div
              key={i}
              className="h-28 bg-gray-100/30 dark:bg-gray-700/30 rounded-2xl"
            ></div>
          ) : (
            <div
              key={i}
              className={`h-28 border-2 rounded-2xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                day.toDateString() === new Date().toDateString()
                  ? "bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 border-indigo-300 dark:border-indigo-600 shadow-lg"
                  : "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
              }`}
              onClick={() => openModal(undefined, day)}
            >
              <div className="text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {examsForDate(day)
                  .slice(0, 2)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="text-xs p-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white truncate relative group shadow-sm hover:shadow-md transition-all duration-200"
                      title={`${e.subject}: ${e.title}`}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openModal(e);
                      }}
                    >
                      <div className="font-medium">{e.subject}</div>
                      <div className="text-xs opacity-90">{e.title}</div>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleDelete(e.id);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 text-xs rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                {examsForDate(day).length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    +{examsForDate(day).length - 2} weitere
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() =>
            setCurrentDate(
              (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
            )
          }
          className="w-12 h-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 hover:shadow-lg transition-all duration-300"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Heute
        </button>
        <button
          onClick={() =>
            setCurrentDate(
              (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
            )
          }
          className="w-12 h-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110 hover:shadow-lg transition-all duration-300"
        >
          →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 mb-6">
              {modalExam ? "Prüfung bearbeiten" : "Neue Prüfung"}
            </h3>
            <div className="space-y-6">
              {/* Titel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Prüfungstitel
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-300 placeholder-gray-400 hover:bg-white/90 dark:hover:bg-gray-700/90"
                  placeholder="z.B. Klassenarbeit Analysis"
                />
              </div>

              {/* Fach als Auswahl */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Fach
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-700/90"
                >
                  <option value="">Fach auswählen...</option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datum */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Prüfungsdatum
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-700/90"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Notizen (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all duration-300 placeholder-gray-400 hover:bg-white/90 dark:hover:bg-gray-700/90 resize-none"
                  rows={3}
                  placeholder="Zusätzliche Informationen zur Prüfung..."
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              {modalExam && (
                <button
                  onClick={() => handleDelete(modalExam.id)}
                  className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10">Löschen</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="group relative bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden"
                >
                  <span className="relative z-10">
                    {modalExam ? "Aktualisieren" : "Hinzufügen"}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
