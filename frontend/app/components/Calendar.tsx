'use client';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  user_id?: string;
}

export default function Calendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: 'create' | 'delete' | null;
    event?: CalendarEvent;
    date?: string;
  }>({ type: null });
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start');
      if (error) console.error(error);
      else setEvents(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const createEvent = async () => {
    if (!user || !selectedDate || !title) return;
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, start: selectedDate, user_id: user.id }])
      .select();
    if (!error && data) setEvents([...events, data[0]]);
    setTitle('');
  };

  const createEventFromDate = async () => {
    if (!user || !modal.date || !title) return;
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, start: modal.date, user_id: user.id }])
      .select();
    if (!error && data) setEvents([...events, data[0]]);
    setModal({ type: null });
    setTitle('');
  };

  const deleteEvent = async () => {
    if (!user || !modal.event) return;
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', modal.event.id)
      .eq('user_id', user.id);
    if (!error) setEvents(events.filter(e => e.id !== modal.event?.id));
    setModal({ type: null });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Lädt...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      {/* Termin erstellen Bereich */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Neue Prüfungsdatum erstellen
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Datum
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prüfung
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Termin Titel eingeben"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
          <button 
            onClick={createEvent} 
            disabled={!title || !selectedDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Termin erstellen
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 w-80">
            {modal.type === 'create' && (
              <>
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Neuen Termin für {new Date(modal.date!).toLocaleDateString('de-DE')}
                </h3>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Termin Titel eingeben"
                  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setModal({ type: null })} className="px-3 py-1 rounded-md bg-gray-200">Abbrechen</button>
                  <button 
                    onClick={createEventFromDate} 
                    disabled={!title}
                    className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Erstellen
                  </button>
                </div>
              </>
            )}
            {modal.type === 'delete' && (
              <>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Termin löschen</h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
                  Möchten Sie <strong>{modal.event?.title}</strong> löschen?
                </p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setModal({ type: null })} className="px-3 py-1 rounded-md bg-gray-200">Abbrechen</button>
                  <button onClick={deleteEvent} className="px-3 py-1 rounded-md bg-red-600 text-white">Löschen</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable
        select={info => {
          setSelectedDate(info.startStr);
          setModal({ type: 'create', date: info.startStr });
        }}
        events={events}
        eventClick={info => setModal({ type: 'delete', event: { id: info.event.id, title: info.event.title, start: info.event.startStr } })}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        locale="de"
        height="auto"
      />
    </div>
  );
}
