import React, { useState } from 'react';
import { Plus, Sparkles, Syringe, AlertTriangle, Trash2 } from 'lucide-react';
import { badgeBase } from '../config';

export default function BrushesTab({ brushes, getBrushStatus, handleDeleteBrush, setBrushData, setIsBrushModalOpen }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  return (
    <div className="space-y-4 animate-fade-in">

      <button
        onClick={() => {
          setBrushData({ name: '', purchaseDate: new Date().toISOString().split('T')[0], lifespanMonths: 3 });
          setIsBrushModalOpen(true);
        }}
        className="w-full py-3.5 rounded-lg font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center justify-center mb-4 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" /> Agregar Accesorio
      </button>

      {brushes.length === 0 ? (
        <div className="text-center p-10 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl">
          <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-zinc-400" />
          </div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mb-1">Kit Vacío</h4>
          <p className="text-sm text-zinc-500 font-medium">Monitoriza la vida útil de tus accesorios.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {brushes.map(brush => {
            const status = getBrushStatus(brush);
            const { isExpired } = status;
            return (
              <div
                key={brush.id}
                className="py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpired ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50'}`}>
                      {isExpired ? <AlertTriangle className="w-5 h-5" /> : <Syringe className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                        {brush.name}
                      </h4>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">
                        Inició: {new Date(brush.purchaseDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                      </p>
                    </div>
                  </div>
                  {confirmDeleteId === brush.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => { handleDeleteBrush(brush.id); setConfirmDeleteId(null); }}
                        className="px-3 py-1.5 rounded-md text-xs font-bold bg-rose-500 text-white transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 rounded-md text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(brush.id)}
                      className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 px-4 py-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Estado</span>
                    {isExpired ? (
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Reemplazar Hoy</span>
                    ) : (
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{status.daysLeft} días útiles</span>
                    )}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Vence</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      {status.replacementDate.toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
