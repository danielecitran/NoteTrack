'use client';
import { useState, useEffect } from 'react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  description?: string;
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const subjects = [
  'Mathematik',
  'Deutsch',
  'Englisch',
  'Französisch',
  'Wirtschaft und Recht',
  'Finanz und Rechnungswesen',
  'Geschichte',
  'Informatik'
]

export default function Calendar() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalExam, setModalExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Exam>({
    id: '',
    title: '',
    subject: '',
    date: '',
    description: ''
  });

  // Laden beim Start
  useEffect(() => {
    const saved = localStorage.getItem('calendar-exams');
    if (saved) setExams(JSON.parse(saved));
  }, []);

  const saveExams = (newExams: Exam[]) => {
    localStorage.setItem('calendar-exams', JSON.stringify(newExams));
    setExams(newExams);
  };

  const openModal = (exam?: Exam, date?: Date) => {
    setModalExam(exam || null);
    setFormData(
      exam
        ? { ...exam, date: exam.date.split('T')[0] }
        : { id: '', title: '', subject: '', date: date?.toISOString().split('T')[0] || '', description: '' }
    );
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.date) return;
    const newExam = modalExam ? formData : { ...formData, id: Date.now().toString() };
    const updated = modalExam
      ? exams.map(e => (e.id === modalExam.id ? newExam : e))
      : [...exams, newExam];
    saveExams(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Prüfung wirklich löschen?')) {
      saveExams(exams.filter(e => e.id !== id));
      setShowModal(false);
    }
  };

  const getMonthDays = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => new Date(y, m, i + 1))
    ];
  };

  const examsForDate = (date: Date) =>
    exams.filter(e => new Date(e.date).toDateString() === date.toDateString());

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <p className="text-gray-600">Prüfungskalender</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Neuer Eintrag
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center font-semibold text-gray-600">
        {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-1">
        {getMonthDays().map((day, i) =>
          !day ? (
            <div key={i} className="h-24 bg-gray-50 rounded"></div>
          ) : (
            <div
              key={i}
              className={`h-24 border rounded p-1 cursor-pointer ${
                day.toDateString() === new Date().toDateString() ? 'bg-blue-100 border-blue-300' : ''
              }`}
              onClick={() => openModal(undefined, day)}
            >
              <div className="text-sm font-medium mb-1">{day.getDate()}</div>
              {examsForDate(day).map(e => (
                <div
                  key={e.id}
                  className="text-xs p-1 rounded bg-gray-700 text-white truncate relative group"
                  title={`${e.subject}: ${e.title}`}
                  onClick={ev => { ev.stopPropagation(); openModal(e); }}
                >
                  <span className="font-medium">{e.subject}:</span> {e.title}
                  <button
                    onClick={ev => { ev.stopPropagation(); handleDelete(e.id); }}
                    className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 text-xs rounded-full text-white opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="px-3 py-2 bg-gray-200 rounded">←</button>
        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-blue-600 text-white rounded">Heute</button>
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="px-3 py-2 bg-gray-200 rounded">→</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{modalExam ? 'Prüfung bearbeiten' : 'Neue Prüfung'}</h3>
            <div className="space-y-4">
              {/* Titel */}
              <div>
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Fach als Auswahl */}
              <div>
                <label className="block text-sm font-medium mb-1">Fach</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Fach auswählen...</option>
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Datum */}
              <div>
                <label className="block text-sm font-medium mb-1">Datum</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              {modalExam && (
                <button onClick={() => handleDelete(modalExam.id)} className="px-4 py-2 bg-red-600 text-white rounded">
                  Löschen
                </button>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Abbrechen</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {modalExam ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}