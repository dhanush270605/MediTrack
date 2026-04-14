'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Pill, 
  Calendar, 
  History, 
  Users, 
  Settings, 
  Activity,
  LayoutDashboard,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Medications', href: '/dashboard/medications', icon: Pill },
    { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    { label: 'History', href: '/dashboard/history', icon: History },
    ...(user?.role === 'caregiver' 
      ? [
          { label: 'Dependents', href: '/dashboard/dependents', icon: Users },
          { label: 'Monitoring', href: '/dashboard/monitoring', icon: Activity },
        ]
      : []),
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0b14] border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Activity className="w-6 h-6 text-primary neon-glow" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">MediTrack</span>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-primary neon-glow" : "group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary neon-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-white/5">
        <Button 
          onClick={logout}
          variant="ghost" 
          className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
