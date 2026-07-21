import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useAppData } from './hooks/useAppData';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import CalendarTab from './components/CalendarTab';
import BrushesTab from './components/BrushesTab';
import ScheduleModal from './components/ScheduleModal';
import CompleteModal from './components/CompleteModal';
import BrushModal from './components/BrushModal';

const TAB_TITLES = { home: 'Brackets', calendar: 'Calendario', brushes: 'Higiene' };

export default function App() {
  const data = useAppData();

  if (data.loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors">
        <Activity className="w-6 h-6 text-zinc-900 dark:text-zinc-50 animate-pulse mb-3" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cargando</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors">
      <div className="max-w-md mx-auto p-5 pb-32 relative z-10">

        <header className="flex justify-between items-center mb-8 mt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {TAB_TITLES[data.activeTab]}
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Autoligado • 15 meses</p>
          </div>
          <button
            onClick={data.fetchData}
            disabled={data.isSyncing}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${data.isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {data.activeTab === 'home' && (
          <HomeTab
            currentControlNumber={data.currentControlNumber}
            progressPercentage={data.progressPercentage}
            needsReminder={data.needsReminder}
            nextControlNumber={data.nextControlNumber}
            scheduledNext={data.scheduledNext}
            nextTargetDate={data.nextTargetDate}
            completedAppointments={data.completedAppointments}
            totalSpent={data.totalSpent}
            expandedNotes={data.expandedNotes}
            toggleNote={data.toggleNote}
            setAppointmentToComplete={data.setAppointmentToComplete}
            setCompleteData={data.setCompleteData}
            setIsCompleteModalOpen={data.setIsCompleteModalOpen}
            setScheduleData={data.setScheduleData}
            setIsScheduleModalOpen={data.setIsScheduleModalOpen}
          />
        )}

        {data.activeTab === 'calendar' && (
          <CalendarTab
            appointments={data.appointments}
            brushes={data.brushes}
            currentMonth={data.currentMonth}
            setCurrentMonth={data.setCurrentMonth}
            getBrushStatus={data.getBrushStatus}
          />
        )}

        {data.activeTab === 'brushes' && (
          <BrushesTab
            brushes={data.brushes}
            getBrushStatus={data.getBrushStatus}
            handleDeleteBrush={data.handleDeleteBrush}
            setBrushData={data.setBrushData}
            setIsBrushModalOpen={data.setIsBrushModalOpen}
          />
        )}

      </div>

      <BottomNav activeTab={data.activeTab} setActiveTab={data.setActiveTab} />

      {data.isScheduleModalOpen && (
        <ScheduleModal
          scheduleData={data.scheduleData}
          setScheduleData={data.setScheduleData}
          onSubmit={data.handleScheduleSubmit}
          onClose={() => data.setIsScheduleModalOpen(false)}
          isSyncing={data.isSyncing}
        />
      )}

      {data.isCompleteModalOpen && (
        <CompleteModal
          completeData={data.completeData}
          setCompleteData={data.setCompleteData}
          onSubmit={data.handleCompleteSubmit}
          onClose={() => data.setIsCompleteModalOpen(false)}
          isSyncing={data.isSyncing}
        />
      )}

      {data.isBrushModalOpen && (
        <BrushModal
          brushData={data.brushData}
          setBrushData={data.setBrushData}
          onSubmit={data.handleAddBrush}
          onClose={() => data.setIsBrushModalOpen(false)}
          isSyncing={data.isSyncing}
        />
      )}

      {data.toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-full shadow-lg animate-fade-in whitespace-nowrap pointer-events-none">
          {data.toast}
        </div>
      )}
    </div>
  );
}
