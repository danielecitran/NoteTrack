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
  end?: string;
  user_id?: string;
}

export default function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load existing events from Supabase
  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (selectInfo: any) => {
    if (!user) return;
    
    const title = prompt('Termin Titel:');
    if (title) {
      try {
        // Save event to Supabase
        const { data, error } = await supabase
          .from('events')
          .insert([
            {
              title,
              start: selectInfo.startStr,
              end: selectInfo.endStr,
              user_id: user.id,
            },
          ])
          .select();

        if (error) {
          console.error('Error saving event:', error);
          alert('Fehler beim Speichern des Termins');
          return;
        }

        // Add to local state
        if (data && data[0]) {
          setEvents([...events, data[0]]);
        }
      } catch (error) {
        console.error('Error saving event:', error);
        alert('Fehler beim Speichern des Termins');
      }
    }
    selectInfo.view.calendar.unselect(); // clear date selection
  };

  const handleEventClick = async (clickInfo: any) => {
    if (!user) return;
    
    if (confirm(`Termin '${clickInfo.event.title}' löschen?`)) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', clickInfo.event.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting event:', error);
          alert('Fehler beim Löschen des Termins');
          return;
        }

        // Remove from local state
        setEvents(events.filter(event => event.id !== clickInfo.event.id));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Fehler beim Löschen des Termins');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale="de"
        firstDay={1}
        buttonText={{
          today: 'Heute',
          month: 'Monat',
          week: 'Woche',
          day: 'Tag'
        }}
        weekText="KW"
        allDayText="Ganztägig"
        moreLinkText="mehr"
        noEventsText="Keine Termine anzuzeigen"
      />
    </div>
  );
}
