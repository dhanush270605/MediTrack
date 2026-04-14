'use client';

import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';

import NotificationDropdown from './NotificationDropdown';

export default function TopHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(p => p);
  const breadcrumb = pathParts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: '/' + pathParts.slice(0, i + 1).join('/'),
    isLast: i === pathParts.length - 1
  }));

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#0a0b14]/50 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">MediTrack</span>
        {breadcrumb.map((item, i) => (
          <div key={item.href} className="flex items-center gap-2">
            <span className="text-slate-700">›</span>
            <span className={item.isLast ? "text-slate-200 font-medium" : "text-slate-500 hover:text-slate-300 transition-colors"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search medications, health records..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          AI ACTIVE
        </div>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center overflow-hidden">
            <span className="text-primary font-bold">{user?.name?.[0].toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
