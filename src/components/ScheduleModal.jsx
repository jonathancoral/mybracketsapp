import React from 'react';
import Modal from './Modal';
import { inputClass } from '../config';

export default function ScheduleModal({ scheduleData, setScheduleData, onSubmit, onClose, isSyncing }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Agendar Control</h2>
      <p className="text-sm text-zinc-500 mb-6">
        Selecciona la fecha para la sesión {scheduleData.controlNumber}.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Día de la Cita
          </label>
          <input
            type="date"
            required
            value={scheduleData.actualDate}
            onChange={(e) => setScheduleData({ ...scheduleData, actualDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Hora (opcional)
          </label>
          <input
            type="time"
            value={scheduleData.appointmentTime}
            onChange={(e) => setScheduleData({ ...scheduleData, appointmentTime: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-3 rounded-lg font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
