'use client';
import { useState, useEffect } from 'react';

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  description?: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Calendar() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalExam, setModalExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Lade Prüfungen aus localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calendar-exams');
    if (saved) setExams(JSON.parse(saved));
  }, []);

  const saveExams = (newExams: Exam[]) => {
    localStorage.setItem('calendar-exams', JSON.stringify(newExams));
    setExams(newExams);
  };

  const getColor = (priority: Exam['priority']) =>
    priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981';

  const openModal = (exam?: Exam) => {
    if (exam) {
      setModalExam(exam);
      setFormData({
        title: exam.title,
        subject: exam.subject,
        date: exam.date.split('T')[0],
        description: exam.description || '',
        priority: exam.priority
      });
    } else {
      setModalExam(null);
      setFormData({ title: '', subject: '', date: '', description: '', priority: 'medium' });
    }
    setShowModal(true);
  };

  const addOrEditExam = () => {
    if (!formData.title || !formData.subject || !formData.date) return;

    const newExam: Exam = {
      id: modalExam ? modalExam.id : Date.now().toString(),
      ...formData,
      color: getColor(formData.priority)
    };

    const updatedExams = modalExam
      ? exams.map(e => (e.id === modalExam.id ? newExam : e))
      : [...exams, newExam];

    saveExams(updatedExams);
    setShowModal(false);
  };

  const deleteExam = (id: string) => {
    if (confirm('Prüfung wirklich löschen?')) saveExams(exams.filter(e => e.id !== id));
  };

  const monthDays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => new Date(year, month, i + 1))
    ];
  })();

  const examsForDate = (date: Date) => exams.filter(e => new Date(e.date).toDateString() === date.toDateString());
  const monthNames = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <p className="text-gray-600">Prüfungskalender</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()-1,1))} className="px-3 py-2 bg-gray-200 rounded">←</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-blue-600 text-white rounded">Heute</button>
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()+1,1))} className="px-3 py-2 bg-gray-200 rounded">→</button>
          <button onClick={() => openModal()} className="px-4 py-2 bg-green-600 text-white rounded">+ Neuer Eintrag</button>
        </div>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center font-semibold text-gray-600">
        {['So','Mo','Di','Mi','Do','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) =>
          !day ? <div key={i} className="h-24 bg-gray-50 rounded"></div> :
          <div key={i} className={`h-24 border rounded p-1 ${day.toDateString()===new Date().toDateString()?'bg-blue-100 border-blue-300':''} ${day.getMonth()!==currentDate.getMonth()?'text-gray-400':''}`}>
            <div className="text-sm font-medium mb-1">{day.getDate()}</div>
            <div className="space-y-1">
              {examsForDate(day).map(e => (
                <div key={e.id} className="text-xs p-1 rounded text-white truncate relative group cursor-pointer" style={{backgroundColor:e.color}} title={`${e.subject}: ${e.title}`} onClick={() => openModal(e)}>
                  <span className="font-medium">{e.subject}:</span> {e.title}
                  <button onClick={ev=>{ev.stopPropagation(); deleteExam(e.id)}} className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 text-xs rounded-full text-white opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{modalExam?'Prüfung bearbeiten':'Neue Prüfung'}</h3>
            <div className="space-y-4">
              {['title','subject','date','description'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{field==='date'?'Datum':field==='title'?'Titel':field==='subject'?'Fach':'Beschreibung'}</label>
                  {field==='description' ? 
                    <textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full border rounded px-3 py-2" rows={3}/> :
                    <input type={field==='date'?'date':'text'} value={(formData as any)[field]} onChange={e=>setFormData({...formData,[field]:e.target.value})} className="w-full border rounded px-3 py-2"/>
                  }
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Priorität</label>
                <select value={formData.priority} onChange={e=>setFormData({...formData, priority:e.target.value as any})} className="w-full border rounded px-3 py-2">
                  <option value="low">Niedrig (Grün)</option>
                  <option value="medium">Mittel (Orange)</option>
                  <option value="high">Hoch (Rot)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Abbrechen</button>
              <button onClick={addOrEditExam} className="px-4 py-2 bg-blue-600 text-white rounded">{modalExam?'Aktualisieren':'Hinzufügen'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
