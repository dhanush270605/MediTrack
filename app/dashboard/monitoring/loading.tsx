import { Skeleton } from '@/components/ui/skeleton';

function MonitoringPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-60" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="glass-card rounded-3xl p-6 space-y-6">
          {/* Dependent header */}
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="p-4 bg-white/5 rounded-2xl space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </div>
            ))}
          </div>
          {/* Medication list */}
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

export default function Loading() {
  return <MonitoringPageSkeleton />;
}
