'use client';

import { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
  '#dfe6e9', '#a29bfe', '#fd79a8', '#fdcb6e', '#6c5ce7',
];

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMedicationModal({ isOpen, onClose }: AddMedicationModalProps) {
  const { addMedication } = useData();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'tablet' as const,
    frequency: 'daily' as const,
    reason: '',
    sideEffects: '',
    notes: '',
    color: COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addMedication({
      name: formData.name,
      dosage: formData.dosage,
      unit: formData.unit,
      frequency: formData.frequency,
      reason: formData.reason,
      sideEffects: formData.sideEffects
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      notes: formData.notes,
      color: formData.color,
      prescribedDate: new Date(),
    });

    setFormData({
      name: '',
      dosage: '',
      unit: 'tablet',
      frequency: 'daily',
      reason: '',
      sideEffects: '',
      notes: '',
      color: COLORS[0],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-dark rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700/30">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-slate-700/30 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Add Medication</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Medication Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Medication Name *
            </label>
            <Input
              required
              placeholder="e.g., Aspirin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Dosage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Dosage *
              </label>
              <Input
                required
                placeholder="e.g., 500"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Unit *</label>
              <select
                required
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value as 'mg' | 'ml' | 'tablet' | 'capsule' | 'injection',
                  })
                }
                className="w-full bg-slate-900/30 border border-slate-700/50 text-foreground rounded-lg px-3 py-2"
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="tablet">tablet</option>
                <option value="capsule">capsule</option>
                <option value="injection">injection</option>
              </select>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Frequency *
            </label>
            <select
              required
              value={formData.frequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frequency: e.target.value as
                    | 'daily'
                    | 'twice-daily'
                    | 'three-times-daily'
                    | 'weekly'
                    | 'as-needed',
                })
              }
              className="w-full bg-slate-900/30 border border-slate-700/50 text-foreground rounded-lg px-3 py-2"
            >
              <option value="daily">Once Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="three-times-daily">Three Times Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason for Use *
            </label>
            <Input
              required
              placeholder="e.g., Pain relief"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Side Effects */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Side Effects (comma-separated)
            </label>
            <Input
              placeholder="e.g., Headache, Nausea"
              value={formData.sideEffects}
              onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900/30 border border-slate-700/50 text-foreground rounded-lg px-3 py-2 resize-none"
              rows={3}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-10 rounded-lg transition-all border-2 ${
                    formData.color === color
                      ? 'border-foreground scale-110'
                      : 'border-slate-700/30 hover:border-slate-700/50'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 text-foreground border-slate-700/50 hover:bg-slate-900/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Medication
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
