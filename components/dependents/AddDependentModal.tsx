'use client';

import { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddDependentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDependentModal({ isOpen, onClose }: AddDependentModalProps) {
  const { addDependent } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    relationshipType: 'parent' as const,
    dateOfBirth: '',
    conditions: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addDependent({
      caregiverId: user.id,
      name: formData.name,
      relationshipType: formData.relationshipType,
      dateOfBirth: new Date(formData.dateOfBirth),
      conditions: formData.conditions
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c),
      notes: formData.notes,
    });

    setFormData({
      name: '',
      relationshipType: 'parent',
      dateOfBirth: '',
      conditions: '',
      notes: '',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-dark rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700/30">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-slate-700/30 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Add Dependent</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <Input
              required
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Relationship Type *
            </label>
            <select
              required
              value={formData.relationshipType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  relationshipType: e.target.value as
                    | 'parent'
                    | 'child'
                    | 'sibling'
                    | 'spouse'
                    | 'other',
                })
              }
              className="w-full bg-slate-900/30 border border-slate-700/50 text-foreground rounded-lg px-3 py-2"
            >
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="spouse">Spouse</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date of Birth
            </label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground"
            />
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Medical Conditions (comma-separated)
            </label>
            <Input
              placeholder="e.g., Diabetes, Hypertension"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              placeholder="Additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-900/30 border border-slate-700/50 text-foreground rounded-lg px-3 py-2 resize-none"
              rows={3}
            />
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
              Add Dependent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
