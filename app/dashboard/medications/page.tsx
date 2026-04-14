'use client';

import { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddMedicationModal from '@/components/medications/AddMedicationModal';
import { Pill, Search, LayoutGrid, List, Plus, Trash2 } from 'lucide-react';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { MedicationsPageSkeleton } from '@/components/skeletons';

export default function MedicationsPage() {
  const { medications, deleteMedication } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const isLoading = useMinimumLoading(2000);

  if (isLoading) return <MedicationsPageSkeleton />;

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Medications</h1>
          <p className="text-slate-500 mt-1">Manage your active prescriptions and dosages</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Controls */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white pl-10 h-11 rounded-xl focus:ring-primary/20"
          />
        </div>
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'cards'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm font-medium">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              viewMode === 'table'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List</span>
          </button>
        </div>
      </div>

      {/* Medications List */}
      {filteredMedications.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedications.map((med) => (
              <div
                key={med.id}
                className="glass-card rounded-3xl p-6 relative group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center p-2.5">
                    <div className="w-full h-full rounded-lg" style={{ backgroundColor: med.color }} />
                  </div>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">{med.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Dosage</p>
                    <p className="text-sm text-slate-200 font-semibold">{med.dosage} {med.unit}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Frequency</p>
                    <p className="text-sm text-slate-200 font-semibold capitalize">{med.frequency.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-500 px-1">Effective for: <span className="text-slate-300">{med.reason}</span></p>
                  
                  {med.sideEffects && med.sideEffects.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {med.sideEffects.map((effect, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-1 bg-red-400/10 text-red-300 rounded-lg border border-red-400/20">
                          {effect}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Medication</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Dosage</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Frequency</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Reason</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMedications.map((med) => (
                    <tr key={med.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: med.color }} />
                          <span className="font-bold text-slate-200">{med.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-400 text-sm font-medium">{med.dosage} {med.unit}</td>
                      <td className="px-8 py-6 text-slate-400 text-sm font-medium capitalize">{med.frequency.replace('-', ' ')}</td>
                      <td className="px-8 py-6 text-slate-500 text-sm">{med.reason}</td>
                      <td className="px-8 py-6 text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="glass-card rounded-3xl p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5">
            <Pill className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No medications found</h3>
          <p className="text-slate-500 mb-8 max-w-sm ml-auto mr-auto">Start tracking your health today by adding your medications and dosages.</p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground font-bold h-12 px-8 rounded-2xl shadow-lg shadow-primary/20"
          >
            + Add Your First Medication
          </Button>
        </div>
      )}

      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
