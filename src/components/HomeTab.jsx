import React, { useState } from 'react';
import { Calendar as CalendarIcon, Bell, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { MAX_CONTROLS, badgeBase } from '../config';

export default function HomeTab({
  currentControlNumber,
  progressPercentage,
  needsReminder,
  nextControlNumber,
  scheduledNext,
  nextTargetDate,
  completedAppointments,
  totalSpent,
  expandedNotes,
  toggleNote,
  setAppointmentToComplete,
  setCompleteData,
  setIsCompleteModalOpen,
  setScheduleData,
  setIsScheduleModalOpen,
}) {
  const [showAllHistory, setShowAllHistory] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${period}`;
  };

  const historyToShow = showAllHistory
    ? [...completedAppointments].reverse()
    : [...completedAppointments].reverse().slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Progress */}
      <section className="pt-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">Progreso Total</p>
            <div className="flex items-baseline">
              <h2 className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">{currentControlNumber}</h2>
              <span className="text-2xl text-zinc-300 dark:text-zinc-700 font-bold ml-1">/{MAX_CONTROLS}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-md">
            Faltan {MAX_CONTROLS - currentControlNumber}
          </span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-[2px] overflow-hidden">
          <div
            className="bg-zinc-900 dark:bg-zinc-50 h-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {totalSpent > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Invertido</p>
            <p className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
              ${totalSpent.toLocaleString('es-CO')} COP
            </p>
          </div>
        )}
      </section>

      {/* Reminder */}
      {needsReminder && (
        <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start space-x-3">
          <div className="mt-0.5 text-zinc-900 dark:text-zinc-50">
            <Bell className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight">Acción Requerida</h3>
            <p className="text-sm text-zinc-500 mt-1 font-medium leading-relaxed">
              Es día 20. Agenda la fecha de tu control {nextControlNumber}.
            </p>
          </div>
        </div>
      )}

      {/* Next appointment */}
      {nextControlNumber <= MAX_CONTROLS && (
        <section className="py-6 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Siguiente Sesión</h3>

          {scheduledNext ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">Control {scheduledNext.controlNumber}</h4>
                  <p className="text-sm text-zinc-500 mt-1 font-medium">
                    {new Date(scheduledNext.actualDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' })}
                  </p>
                  {scheduledNext.actualDate?.includes('T') && (
                    <p className="text-sm text-zinc-900 dark:text-zinc-50 font-bold mt-0.5">
                      {formatTime(scheduledNext.actualDate.split('T')[1])}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 rounded-md">Agendado</span>
              </div>
              <button
                onClick={() => {
                  setAppointmentToComplete(scheduledNext);
                  setCompleteData({ paymentAmount: '', notes: '' });
                  setIsCompleteModalOpen(true);
                }}
                className="w-full py-3.5 rounded-lg font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Completar Sesión
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-1">Control {nextControlNumber}</h4>
                <p className="text-sm text-zinc-500 font-medium">Fecha sugerida para asistir</p>
              </div>
              <button
                onClick={() => {
                  setScheduleData({ actualDate: nextTargetDate.toISOString().split('T')[0], appointmentTime: '', controlNumber: nextControlNumber });
                  setIsScheduleModalOpen(true);
                }}
                className="w-full py-3.5 rounded-lg font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
              >
                Agendar Fecha
              </button>
            </div>
          )}
        </section>
      )}

      {/* Recent history */}
      <section className="pt-6">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Historial Reciente</h3>
        <div className="space-y-0">
          {historyToShow.map((apt) => {
            const isExpanded = expandedNotes.includes(apt.id);
            return (
              <div
                key={apt.id}
                onClick={() => apt.notes && toggleNote(apt.id)}
                className={`py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 ${apt.notes ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors -mx-4 px-4 rounded-lg' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                      {apt.controlNumber === 0 ? 'Segmentación' : `Control ${apt.controlNumber}`}
                    </h4>
                    <span className="text-xs text-zinc-500 font-medium">
                      {new Date(apt.actualDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {apt.paymentAmount > 0 && (
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                        ${Number(apt.paymentAmount).toLocaleString('es-CO')}
                      </span>
                    )}
                    {apt.notes && (
                      <div className="text-zinc-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>

                {apt.notes && isExpanded && (
                  <div className="mt-2 animate-fade-in">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {apt.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {completedAppointments.length > 3 && (
          <button
            onClick={() => setShowAllHistory(v => !v)}
            className="w-full mt-4 py-3 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
          >
            {showAllHistory ? 'Ver menos' : `Ver todo (${completedAppointments.length})`}
          </button>
        )}
      </section>

    </div>
  );
}
