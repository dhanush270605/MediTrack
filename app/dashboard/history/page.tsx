'use client';

import { useMemo } from 'react';
import { useData } from '@/lib/context/DataContext';
import { Activity, History, Calendar, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { HistoryPageSkeleton } from '@/components/skeletons';

export default function HistoryPage() {
  const { medications, history, getAdherenceStats } = useData();

  const stats = getAdherenceStats();
  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [history]
  );

  // Group history by medication
  const historyByMedication = useMemo(() => {
    const grouped: Record<string, typeof history> = {};
    medications.forEach((med) => {
      grouped[med.id] = history.filter((h) => h.medicationId === med.id);
    });
    return grouped;
  }, [medications, history]);

  const isLoading = useMinimumLoading(2000);
  if (isLoading) return <HistoryPageSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Adherence History</h1>
        <p className="text-slate-500 mt-1">Detailed tracking of your health journey over time</p>
      </div>

      {/* Statistics Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const medication = medications.find((m) => m.id === stat.medicationId);
            return (
              <div key={stat.medicationId} className="glass-card rounded-3xl p-6 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-12 rounded-full" style={{ backgroundColor: medication?.color || '#00f5ff' }} />
                  <div>
                    <h3 className="text-xl font-bold text-white">{stat.medicationName}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                      {medication?.dosage} {medication?.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">ADHERENCE RATE</span>
                      <span className="text-sm font-bold text-primary neon-glow">{stat.adherenceRate}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,245,255,0.5)] transition-all duration-1000" 
                        style={{ width: `${stat.adherenceRate}%` }} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Taken</p>
                      <p className="text-xl font-bold text-green-400">{stat.totalDosesTaken}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Scheduled</p>
                      <p className="text-xl font-bold text-slate-300">{stat.totalDosesScheduled}</p>
                    </div>
                  </div>

                  {stat.lastTaken && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-2 px-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      Last taken: <span className="text-slate-300">{new Date(stat.lastTaken).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Grid: Activity & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <span className="text-xs text-slate-500 font-medium">Last 20 entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medication</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedHistory.slice(0, 20).map((entry) => {
                  const medication = medications.find((m) => m.id === entry.medicationId);
                  return (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medication?.color || '#00f5ff' }} />
                          <span className="font-bold text-slate-200">{medication?.name || 'Deleted'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                          entry.taken ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}>
                          {entry.taken ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {entry.taken ? 'Taken' : 'Missed'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium font-mono">
                        {entry.time || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar info / mini charts */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-bold text-white mb-4">Quick Insights</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5 shadow-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Stability Index</p>
                  <p className="text-xs text-slate-500 mt-1">Your adherence is 12% higher than last week. Great job!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Calendar className="w-5 h-5 shadow-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Next Review</p>
                  <p className="text-xs text-slate-500 mt-1">Recommended health checkup in 14 days based on trends.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedHistory.length === 0 && (
        <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500 mb-6">
            <History className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No history logs</h3>
          <p className="text-slate-500 max-w-sm">When you record your medications, they will appear here in your health timeline.</p>
        </div>
      )}
    </div>
  );
}
