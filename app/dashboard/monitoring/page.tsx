'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function MonitoringPage() {
  const { user } = useAuth();
  const { dependents, medications } = useData();
  const isLoading = useMinimumLoading(2000);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-5 w-60" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="p-4 bg-white/5 rounded-2xl space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-12" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, k) => (
                <div key={k} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Monitoring</h1>
          <p className="text-muted-foreground">Monitor medication adherence for your dependents</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dependents.length > 0 ? (
          <div className="space-y-6">
            {dependents.map((dependent) => (
              <div
                key={dependent.id}
                className="glass-dark rounded-xl p-6 border border-slate-700/30"
              >
                {/* Dependent Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      {dependent.name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{dependent.name}</h2>
                    <p className="text-sm text-muted-foreground capitalize">
                      {dependent.relationshipType}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-sm text-muted-foreground mb-1">Medications</p>
                    <p className="text-2xl font-bold text-foreground">
                      {medications.length}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-sm text-muted-foreground mb-1">Today&apos;s Adherence</p>
                    <p className="text-2xl font-bold text-accent">75%</p>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-sm text-muted-foreground mb-1">Last Update</p>
                    <p className="text-lg font-bold text-foreground">Just now</p>
                  </div>
                </div>

                {/* Medications for Dependent */}
                {medications.length > 0 ? (
                  <div>
                    <h3 className="font-bold text-foreground mb-4">Current Medications</h3>
                    <div className="space-y-3">
                      {medications.slice(0, 5).map((med) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: med.color }}
                            />
                            <div>
                              <p className="font-medium text-foreground">{med.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.dosage} {med.unit} • {med.frequency}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-accent">✓ On Track</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-900/30 rounded-lg border border-slate-700/30 text-center">
                    <p className="text-muted-foreground">No medications assigned yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-dark rounded-xl p-12 border border-slate-700/30 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No dependents to monitor</h3>
            <p className="text-muted-foreground">
              Add dependents to start monitoring their medication adherence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
