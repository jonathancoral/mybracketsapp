import React from 'react';

export default function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-zinc-950 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up border border-zinc-100 dark:border-zinc-800">
        <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6 sm:hidden" />
        {children}
      </div>
    </div>
  );
}
