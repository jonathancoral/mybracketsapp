import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarTab({ appointments, brushes, currentMonth, setCurrentMonth, getBrushStatus }) {
  const today = new Date();

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${period}`;
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthEvents = {};

  appointments.forEach(apt => {
    if (!apt.actualDate) return;
    const d = new Date(apt.actualDate);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      monthEvents[day] = monthEvents[day] || [];
      monthEvents[day].push({ type: 'cita', data: apt, status: apt.status });
    }
  });

  brushes.forEach(b => {
    const { replacementDate } = getBrushStatus(b);
    if (replacementDate.getMonth() === month && replacementDate.getFullYear() === year) {
      const d = replacementDate.getDate();
      monthEvents[d] = monthEvents[d] || [];
      monthEvents[d].push({ type: 'cepillo', data: b });
    }
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const citaEvent = monthEvents[day]?.find(e => e.type === 'cita');
    const hasCepillo = monthEvents[day]?.some(e => e.type === 'cepillo');
    const citaDotClass = citaEvent
      ? (citaEvent.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500')
      : '';

    days.push(
      <div key={day} className="relative h-11 flex items-center justify-center">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
          ${isToday ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold' : 'text-zinc-700 dark:text-zinc-300'}
        `}>
          {day}
        </div>
        <div className="absolute bottom-1 flex space-x-1">
          {citaEvent && <div className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-500" />}
          {hasCepillo && <div className="w-1 h-1 rounded-full bg-rose-500" />}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="py-2">

        {/* Month navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 capitalize tracking-tight">
            {MONTH_NAMES[month]} <span className="text-zinc-400 font-medium ml-1">{year}</span>
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-3">{days}</div>

        {/* Events list */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Eventos del mes</h4>
          {Object.keys(monthEvents).length === 0 ? (
            <div className="text-center p-4">
              <p className="text-sm text-zinc-500 font-medium">No hay eventos programados.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(monthEvents)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([day, events]) => (
                  <div key={day} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center font-bold text-zinc-900 dark:text-zinc-50 shrink-0">
                      {day}
                    </div>
                    <div className="flex-1 space-y-3 pt-1">
                      {events.map((e, idx) =>
                        e.type === 'cita' ? (
                          <div key={idx} className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                              {e.data.controlNumber === 0 ? 'Segmentación' : `Control ${e.data.controlNumber}`}
                            </span>
                            {e.data.actualDate?.includes('T') && (
                              <span className="text-xs font-medium text-zinc-500 mt-0.5">
                                {formatTime(e.data.actualDate.split('T')[1])}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${e.data.status === 'completed' ? 'text-zinc-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                              {e.data.status === 'completed' ? 'Asistida' : 'Programada'}
                            </span>
                          </div>
                        ) : (
                          <div key={idx} className="flex items-center text-xs font-bold text-rose-500 uppercase tracking-widest pt-1">
                            <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                            Cambiar {e.data.name}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
