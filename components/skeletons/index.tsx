import { Skeleton } from '@/components/ui/skeleton';

// ─────────────────────────────────────────────────────────────────────────────
// Primitive building blocks
// ─────────────────────────────────────────────────────────────────────────────

export function SkeletonText({ className = 'w-full' }: { className?: string }) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonHeading({ className = 'w-2/3' }: { className?: string }) {
  return <Skeleton className={`h-8 ${className}`} />;
}

export function SkeletonButton({ className = 'w-32' }: { className?: string }) {
  return <Skeleton className={`h-10 rounded-2xl ${className}`} />;
}

export function SkeletonBadge() {
  return <Skeleton className="h-6 w-20 rounded-full" />;
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-20 w-20' };
  return <Skeleton className={`${sizes[size]} rounded-2xl flex-shrink-0`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function SidebarSkeleton() {
  return (
    <div className="w-72 h-screen bg-slate-900/40 border-r border-white/5 flex flex-col p-6 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <Skeleton className="h-5 w-24" />
      </div>
      {/* Nav items */}
      <div className="space-y-2 flex-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl">
            <Skeleton className="w-5 h-5 rounded-lg flex-shrink-0" />
            <Skeleton className="h-4 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
      {/* User profile at bottom */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
        <SkeletonAvatar size="sm" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP HEADER SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function TopHeaderSkeleton() {
  return (
    <div className="h-16 border-b border-white/5 bg-slate-900/20 flex items-center px-8 gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Search bar */}
      <Skeleton className="h-9 w-64 rounded-2xl" />
      {/* AI badge */}
      <Skeleton className="h-7 w-24 rounded-full" />
      {/* Avatar */}
      <Skeleton className="h-9 w-9 rounded-2xl" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD SKELETON (Dashboard Overview)
// ─────────────────────────────────────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-2xl" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART SKELETON (Area + Pie)
// ─────────────────────────────────────────────────────────────────────────────

export function AreaChartSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      {/* Mock area chart bars */}
      <div className="flex items-end gap-2 h-40 pt-4">
        {[60, 80, 55, 90, 70, 85, 65, 95, 75, 88, 72, 92].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
      {/* X axis labels */}
      <div className="flex gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 h-3" />
        ))}
      </div>
    </div>
  );
}

export function PieChartSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-center gap-8">
        {/* Circle */}
        <Skeleton className="w-36 h-36 rounded-full flex-shrink-0" />
        {/* Legend */}
        <div className="space-y-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-3 h-3 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><AreaChartSkeleton /></div>
        <PieChartSkeleton />
      </div>
      {/* Today's Schedule Preview */}
      <TodaySchedulePreviewSkeleton />
    </div>
  );
}

export function TodaySchedulePreviewSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-24 rounded-2xl" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
          <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDICATION CARD SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function MedicationCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-5">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
      <Skeleton className="h-6 w-36" />
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/5 rounded-2xl space-y-1">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="p-3 bg-white/5 rounded-2xl space-y-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-lg" />
        <Skeleton className="h-5 w-14 rounded-lg" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDICATIONS PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function MedicationsPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <SkeletonButton className="w-40" />
      </div>
      {/* Controls */}
      <div className="glass-card rounded-2xl p-4 flex gap-4">
        <Skeleton className="flex-1 h-11 rounded-xl" />
        <Skeleton className="w-40 h-11 rounded-xl" />
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <MedicationCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function ScheduleTimelineItemSkeleton() {
  return (
    <div className="flex gap-6">
      <Skeleton className="w-16 h-16 rounded-3xl flex-shrink-0" />
      <div className="flex-1 glass-card rounded-3xl p-6 flex items-center gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SchedulePageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header + Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-12 w-72 rounded-2xl" />
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card rounded-3xl p-6 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      {/* Timeline items */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => <ScheduleTimelineItemSkeleton key={i} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function AdherenceStatCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-4 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-2xl space-y-1">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="p-4 bg-white/5 rounded-2xl space-y-1">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-6 w-8" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <Skeleton className={`h-4 ${i === 0 ? 'w-32' : i === cols - 1 ? 'w-20' : 'w-24'}`} />
        </td>
      ))}
    </tr>
  );
}

export function HistoryPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-56" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <AdherenceStatCardSkeleton key={i} />)}
      </div>
      {/* Table + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
          <table className="w-full">
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)}
            </tbody>
          </table>
        </div>
        <div className="glass-card rounded-3xl p-8 space-y-6">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Nav */}
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-2xl" />
          ))}
        </div>
        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile card */}
          <div className="glass-card rounded-3xl p-8 space-y-8">
            <Skeleton className="h-6 w-44" />
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-3xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
          {/* Toggle card */}
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <Skeleton className="h-6 w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPENDENTS PAGE SKELETON
// ─────────────────────────────────────────────────────────────────────────────

export function DependentCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 bg-white/5 rounded-2xl space-y-1">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-2xl" />
        <Skeleton className="h-10 w-10 rounded-2xl" />
      </div>
    </div>
  );
}

export function DependentsPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-5 w-56" />
        </div>
        <SkeletonButton className="w-36" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <DependentCardSkeleton key={i} />)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGE SKELETON (Login / Signup)
// ─────────────────────────────────────────────────────────────────────────────

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-2xl" />
          <Skeleton className="h-6 w-28" />
        </div>
        {/* Heading */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex justify-center">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL LAYOUT SKELETON (Sidebar + Header + Content area)
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardLayoutSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeaderSkeleton />
        <main className="flex-1 overflow-auto p-8">
          {children ?? <DashboardPageSkeleton />}
        </main>
      </div>
    </div>
  );
}
