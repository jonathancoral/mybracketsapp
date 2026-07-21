import { useState, useEffect } from 'react';
import { GAS_URL, MAX_CONTROLS } from '../config';

const INITIAL_HISTORY = [
  { id: '0', controlNumber: 0, title: 'Segmentación', targetDate: '2026-02-20', actualDate: '2026-02-20', paymentAmount: 150000, notes: 'Montaje inicial autoligado', status: 'completed' },
  { id: '1', controlNumber: 1, title: 'Control 1', targetDate: '2026-03-20', actualDate: '2026-03-20', paymentAmount: 50000, notes: 'Revisión general', status: 'completed' },
  { id: '2', controlNumber: 2, title: 'Control 2', targetDate: '2026-04-20', actualDate: '2026-04-20', paymentAmount: 50000, notes: 'Revisión general', status: 'completed' },
];

export function useAppData() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [brushes, setBrushes] = useState([]);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isBrushModalOpen, setIsBrushModalOpen] = useState(false);

  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [scheduleData, setScheduleData] = useState({ actualDate: '', appointmentTime: '', controlNumber: 0 });
  const [completeData, setCompleteData] = useState({ paymentAmount: '', notes: '' });
  const [brushData, setBrushData] = useState({ name: '', purchaseDate: '', lifespanMonths: 3 });

  const [expandedNotes, setExpandedNotes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [toast, setToast] = useState(null);

  // --- API ---

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const sendToGAS = async (action, data) => {
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, data }),
      });
    } catch (error) {
      console.error('Error guardando en Sheets:', error);
    }
  };

  const seedInitialData = async () => {
    await sendToGAS('seed', INITIAL_HISTORY);
    setAppointments(INITIAL_HISTORY);
  };

  const fetchData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(GAS_URL);
      const data = await response.json();
      if (!data.citas || data.citas.length === 0) {
        await seedInitialData();
      } else {
        const formattedCitas = data.citas
          .map(item => ({
            ...item,
            controlNumber: Number(item.controlNumber),
            paymentAmount: Number(item.paymentAmount),
          }))
          .sort((a, b) => a.controlNumber - b.controlNumber);
        setAppointments(formattedCitas);
        setBrushes(data.cepillos || []);
      }
    } catch (error) {
      console.error('Error conectando a Sheets:', error);
    }
    setLoading(false);
    setIsSyncing(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- Derived state ---

  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const lastCompleted = completedAppointments.length > 0
    ? completedAppointments[completedAppointments.length - 1]
    : null;
  const currentControlNumber = lastCompleted ? lastCompleted.controlNumber : 0;
  const nextControlNumber = currentControlNumber + 1;

  let nextTargetDate = new Date();
  if (lastCompleted?.targetDate) {
    const lastDate = new Date(lastCompleted.targetDate);
    nextTargetDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 20);
  } else {
    nextTargetDate.setDate(20);
  }

  const scheduledNext = appointments.find(
    a => a.controlNumber === nextControlNumber && a.status === 'scheduled'
  );

  const today = new Date();
  const daysUntil20th = nextTargetDate.getDate() - today.getDate();
  const isMonthMatch =
    today.getMonth() === nextTargetDate.getMonth() &&
    today.getFullYear() === nextTargetDate.getFullYear();
  const needsReminder = isMonthMatch && daysUntil20th <= 7 && daysUntil20th >= -5 && !scheduledNext;

  const progressPercentage = Math.min((currentControlNumber / MAX_CONTROLS) * 100, 100);

  // --- Actions ---

  const toggleNote = (id) => {
    setExpandedNotes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsSyncing(true);
    const newAppointment = {
      id: Date.now().toString(),
      controlNumber: nextControlNumber,
      title: `Control ${nextControlNumber}`,
      targetDate: nextTargetDate.toISOString().split('T')[0],
      actualDate: scheduleData.appointmentTime
        ? `${scheduleData.actualDate}T${scheduleData.appointmentTime}`
        : scheduleData.actualDate,
      paymentAmount: 0,
      notes: '',
      status: 'scheduled',
    };
    setAppointments(prev =>
      [...prev, newAppointment].sort((a, b) => a.controlNumber - b.controlNumber)
    );
    setIsScheduleModalOpen(false);
    showToast('Control agendado ✓');
    await sendToGAS('add_cita', newAppointment);
    setIsSyncing(false);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setIsSyncing(true);
    const updated = appointments.map(apt =>
      apt.id === appointmentToComplete.id
        ? { ...apt, status: 'completed', paymentAmount: Number(completeData.paymentAmount), notes: completeData.notes }
        : apt
    );
    setAppointments(updated);
    setIsCompleteModalOpen(false);
    showToast('Sesión completada ✓');
    await sendToGAS('complete_cita', {
      id: appointmentToComplete.id,
      paymentAmount: Number(completeData.paymentAmount),
      notes: completeData.notes,
    });
    setAppointmentToComplete(null);
    setIsSyncing(false);
  };

  const handleAddBrush = async (e) => {
    e.preventDefault();
    setIsSyncing(true);
    const newBrush = {
      id: Date.now().toString(),
      name: brushData.name,
      purchaseDate: brushData.purchaseDate,
      lifespanMonths: Number(brushData.lifespanMonths),
    };
    setBrushes(prev => [...prev, newBrush]);
    setIsBrushModalOpen(false);
    showToast('Accesorio añadido ✓');
    await sendToGAS('add_cepillo', newBrush);
    setIsSyncing(false);
  };

  const handleDeleteBrush = async (id) => {
    setIsSyncing(true);
    setBrushes(prev => prev.filter(b => b.id !== id));
    await sendToGAS('delete_cepillo', { id });
    showToast('Accesorio eliminado');
    setIsSyncing(false);
  };

  const getBrushStatus = (brush) => {
    const purchase = new Date(brush.purchaseDate);
    purchase.setMinutes(purchase.getMinutes() + purchase.getTimezoneOffset());
    const replacement = new Date(purchase);
    replacement.setMonth(replacement.getMonth() + brush.lifespanMonths);
    const totalDays = (replacement - purchase) / (1000 * 60 * 60 * 24);
    const daysLeft = Math.ceil((replacement - today) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft <= 0;
    const progress = isExpired ? 100 : Math.max(0, 100 - (daysLeft / totalDays) * 100);
    return { replacementDate: replacement, daysLeft, progress, isExpired };
  };

  return {
    // UI state
    activeTab, setActiveTab,
    loading,
    isSyncing,
    // Data
    appointments,
    brushes,
    // Modal open state
    isScheduleModalOpen, setIsScheduleModalOpen,
    isCompleteModalOpen, setIsCompleteModalOpen,
    isBrushModalOpen, setIsBrushModalOpen,
    // Form state
    appointmentToComplete, setAppointmentToComplete,
    scheduleData, setScheduleData,
    completeData, setCompleteData,
    brushData, setBrushData,
    // Misc
    expandedNotes,
    currentMonth, setCurrentMonth,
    // Derived
    completedAppointments,
    totalSpent: appointments.reduce((sum, a) => sum + (Number(a.paymentAmount) || 0), 0),
    currentControlNumber,
    nextControlNumber,
    nextTargetDate,
    scheduledNext,
    needsReminder,
    progressPercentage,
    // Actions
    fetchData,
    toggleNote,
    handleScheduleSubmit,
    handleCompleteSubmit,
    handleAddBrush,
    handleDeleteBrush,
    getBrushStatus,
    toast,
  };
}
