'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddDependentModal from '@/components/dependents/AddDependentModal';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { DependentsPageSkeleton } from '@/components/skeletons';

export default function DependentsPage() {
  const { user } = useAuth();
  const { dependents, deleteDependent } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoading = useMinimumLoading(2000);

  if (isLoading) return <DependentsPageSkeleton />;

  if (user?.role !== 'caregiver') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This page is only available for caregiver accounts.</p>
        </div>
      </div>
    );
  }

  const filteredDependents = dependents.filter(
    (dep) =>
      dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.relationshipType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dependents</h1>
              <p className="text-muted-foreground mt-2">Manage the people you care for</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              + Add Dependent
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="glass-dark rounded-xl p-4 md:p-6 border border-slate-700/30 mb-6">
          <Input
            placeholder="Search dependents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900/30 border-slate-700/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Dependents Grid */}
        {filteredDependents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredDependents.map((dependent) => (
              <div
                key={dependent.id}
                className="glass-dark rounded-xl p-6 border border-slate-700/30 hover:border-primary/30 transition-all group"
              >
                {/* Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      {dependent.name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteDependent(dependent.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-foreground mb-2">{dependent.name}</h3>
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-semibold text-foreground capitalize">
                      {dependent.relationshipType}
                    </p>
                  </div>
                  {dependent.dateOfBirth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-semibold text-foreground">
                        {Math.floor(
                          (new Date().getTime() - new Date(dependent.dateOfBirth).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )}{' '}
                        years old
                      </p>
                    </div>
                  )}
                </div>

                {/* Conditions */}
                {dependent.conditions && dependent.conditions.length > 0 && (
                  <div className="mb-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-xs text-muted-foreground mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {dependent.conditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-foreground border-slate-700/50 hover:bg-slate-900/30 text-sm"
                    size="sm"
                  >
                    View Meds
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-foreground border-slate-700/50 hover:bg-slate-900/30 text-sm"
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-dark rounded-xl p-12 border border-slate-700/30 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No dependents yet</h3>
            <p className="text-muted-foreground mb-6">
              Add people you care for to monitor their medication adherence.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              + Add Your First Dependent
            </Button>
          </div>
        )}
      </div>

      {/* Add Dependent Modal */}
      <AddDependentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
