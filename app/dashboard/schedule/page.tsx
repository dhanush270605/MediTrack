'use client';

import { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { SchedulePageSkeleton } from '@/components/skeletons';

export default function SchedulePage() {
  const { medications, recordMedicationTaken, recordMedicationMissed, getDailySchedule } =
    useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const schedule = getDailySchedule(selectedDate);

  const handleTakeMedication = (medicationId: string) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    recordMedicationTaken(medicationId, time);
  };

  const handleMissedMedication = (medicationId: string) => {
    recordMedicationMissed(medicationId);
  };

  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  const isLoading = useMinimumLoading(2000);
  if (isLoading) return <SchedulePageSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Medication Schedule</h1>
          <p className="text-slate-500 mt-1">Track and manage your daily health routine</p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
          <Button variant="ghost" size="icon" onClick={previousDay} className="text-slate-400 hover:text-white rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="px-4 py-2 flex items-center gap-3">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-slate-200 min-w-[140px] text-center">
              {isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={nextDay} className="text-slate-400 hover:text-white rounded-xl">
            <ChevronRight className="w-5 h-5" />
          </Button>
          {!isToday && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())} className="text-xs text-primary hover:text-primary/80 font-bold px-3">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Adherence Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border-b-4 border-b-primary/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Adherence Rate</p>
          <p className="text-4xl font-bold text-white neon-glow">{schedule.adherenceRate}%</p>
        </div>
        <div className="glass-card rounded-3xl p-6 border-b-4 border-b-green-500/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Doses Taken</p>
          <p className="text-4xl font-bold text-green-400">
            {schedule.reminders.filter((r) => r.completed).length}
          </p>
        </div>
        <div className="glass-card rounded-3xl p-6 border-b-4 border-b-slate-700/30">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Scheduled</p>
          <p className="text-4xl font-bold text-slate-300">{schedule.reminders.length}</p>
        </div>
      </div>

      {/* Schedule Timeline */}
      {schedule.reminders.length > 0 ? (
        <div className="relative space-y-6">
          {/* Vertical path line */}
          <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-slate-800 to-primary/20 hidden sm:block" />

          {schedule.reminders
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((reminder, index) => {
              const medication = medications.find((m) => m.id === reminder.medicationId);
              if (!medication) return null;

              return (
                <div key={reminder.id} className="relative flex flex-col sm:flex-row items-start gap-6 group">
                  {/* Timeline indicator */}
                  <div className="mt-6 z-10 hidden sm:block">
                    <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center border-4 border-[#0a0b14] transition-all duration-300",
                      reminder.completed ? "bg-primary/20 text-primary scale-110" : "bg-white/5 text-slate-500"
                    )}>
                      {reminder.completed ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                    </div>
                  </div>

                  <div className="flex-1 w-full glass-card rounded-3xl p-6 group-hover:border-primary/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: medication.color }} />
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{medication.name}</h3>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-primary tracking-tight">
                              {reminder.time}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-1 text-sm">
                            {medication.dosage} {medication.unit} — {medication.frequency.replace('-', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {reminder.completed ? (
                          <div className="flex flex-col items-end">
                            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Verified Taken</span>
                            <span className="text-slate-500 text-[10px]">
                              {reminder.completedAt && new Date(reminder.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleTakeMedication(medication.id)}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl h-12 px-6"
                            >
                              Mark as Taken
                            </Button>
                            <Button
                              onClick={() => handleMissedMedication(medication.id)}
                              variant="ghost"
                              className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl h-12 px-4"
                            >
                              <XCircle className="w-5 h-5 mr-2" />
                              Missed
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500 mb-6">
            <Clock className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No schedule for this day</h3>
          <p className="text-slate-500 max-w-sm">There are no medications scheduled for the selected date.</p>
        </div>
      )}
    </div>
  );
}
