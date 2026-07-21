import React from 'react';
import Modal from './Modal';
import { inputClass } from '../config';

export default function CompleteModal({ completeData, setCompleteData, onSubmit, onClose, isSyncing }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Registro Médico</h2>
      <p className="text-sm text-zinc-500 mb-6">Detalla el pago y los procedimientos de hoy.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Monto Pagado (COP)
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            placeholder="Ej: 50000"
            value={completeData.paymentAmount}
            onChange={(e) => setCompleteData({ ...completeData, paymentAmount: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Observaciones
          </label>
          <textarea
            required
            placeholder="Cambio a arco NiTi..."
            value={completeData.notes}
            onChange={(e) => setCompleteData({ ...completeData, notes: e.target.value })}
            className={`${inputClass} min-h-[120px] resize-none`}
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
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}
