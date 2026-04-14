'use client';

import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Pill, 
  CheckCircle2, 
  TrendingUp, 
  Bell, 
  Plus, 
  RefreshCcw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { DashboardPageSkeleton } from '@/components/skeletons';

export default function DashboardPage() {
  const { medications, dailySchedule, getAdherenceStats, history } = useData();
  const { user } = useAuth();
  const isLoading = useMinimumLoading(2000);

  if (isLoading) return <DashboardPageSkeleton />;

  const adherenceStats = getAdherenceStats();
  const todayReminders = dailySchedule?.reminders || [];
  const completedToday = todayReminders.filter((r) => r.completed).length;
  const adherenceRate = dailySchedule?.adherenceRate || 0;

  // Mock data for charts - in a real app, this would be computed from 'history'
  const trendData = [
    { name: 'May 24', spend: 4000, savings: 2400 },
    { name: 'Jul 24', spend: 3000, savings: 1398 },
    { name: 'Sep 24', spend: 2000, savings: 9800 },
    { name: 'Nov 24', spend: 2780, savings: 3908 },
    { name: 'Jan 25', spend: 1890, savings: 4800 },
    { name: 'Mar 25', spend: 2390, savings: 3800 },
    { name: 'Apr 25', spend: 3490, savings: 4300 },
  ];

  const distributionData = [
    { name: 'Tablets', value: 400, color: '#00f5ff' },
    { name: 'Inhalers', value: 300, color: '#8b5cf6' },
    { name: 'Liquids', value: 200, color: '#f59e0b' },
    { name: 'Injectables', value: 100, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
          <p className="text-slate-500">Welcome back, <span className="text-slate-300">{user?.name}</span> — Saturday, 4 April</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/medications">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="ACTIVE MEDICATIONS" 
          value={medications.length.toString()} 
          trend="+12%" 
          trendUp={true} 
          icon={<Pill className="w-6 h-6" />}
          color="primary"
        />
        <StatCard 
          label="MONTHLY ADHERENCE" 
          value={`${adherenceRate}%`} 
          trend="-5%" 
          trendUp={false} 
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="accent"
        />
        <StatCard 
          label="COMPLETED TODAY" 
          value={`${completedToday}/${todayReminders.length}`} 
          trend="+8%" 
          trendUp={true} 
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
        <StatCard 
          label="REMAINING DOSES" 
          value={(todayReminders.length - completedToday).toString()} 
          trend="+2%" 
          trendUp={true} 
          icon={<Bell className="w-6 h-6" />}
          color="pink"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending/Adherence Trend */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Adherence Trend</h3>
              <p className="text-sm text-slate-500">Compliance over the last 12 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-slate-400">Taken</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-slate-400">Missed</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#11121e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#00f5ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost/Category Distribution */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Distribution</h3>
              <p className="text-sm text-slate-500">By medication type</p>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="h-[240px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-6">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-slate-200 font-bold">{(item.value / 10).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule Section (Simplified for match) */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Today&apos;s Schedule</h2>
          <Link href="/dashboard/schedule" className="text-sm text-primary hover:underline">
            View full report
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayReminders.slice(0, 3).map((reminder, i) => {
            const med = medications.find(m => m.id === reminder.medicationId);
            return (
              <div key={reminder.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{med?.name || 'Medication'}</h4>
                    <p className="text-xs text-slate-500">{reminder.time} — {med?.dosage} {med?.unit}</p>
                  </div>
                </div>
                {reminder.completed ? (
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full">Taken</div>
                ) : (
                  <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase rounded-full">Pending</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, trendUp, icon, color }: {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">{label}</p>
          <h2 className={cn("text-4xl font-bold mt-2", color === 'primary' ? 'neon-glow text-white' : 'text-white')}>{value}</h2>
        </div>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", colorStyles[color])}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
          trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
        <span className="text-xs text-slate-500">vs last month</span>
      </div>
      
      {/* Decorative background glow */}
      <div className={cn(
        "absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-20 rounded-full",
        color === 'primary' ? 'bg-primary' : color === 'accent' ? 'bg-accent' : color === 'orange' ? 'bg-orange-500' : 'bg-pink-500'
      )} />
    </div>
  );
}
