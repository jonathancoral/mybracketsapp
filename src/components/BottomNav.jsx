import React from 'react';
import { Home, Calendar as CalendarIcon, Syringe } from 'lucide-react';

const TABS = [
  { id: 'home',     icon: Home,        label: 'Inicio'     },
  { id: 'calendar', icon: CalendarIcon, label: 'Calendario' },
  { id: 'brushes',  icon: Syringe,      label: 'Higiene'    },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-900 z-40 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-6">
        {TABS.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center justify-center w-16 h-full transition-colors group"
            >
              <div className={`flex items-center justify-center transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium mt-1 transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
