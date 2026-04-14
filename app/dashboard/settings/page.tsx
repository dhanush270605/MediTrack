'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield, Database, LogOut, ChevronRight, Camera, Key, Lock, FileText, Trash2, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMinimumLoading } from '@/hooks/use-minimum-loading';
import { SettingsPageSkeleton } from '@/components/skeletons';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoading = useMinimumLoading(2000);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Configure your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Local) */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'data', label: 'Data Management', icon: Database },
          ].map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                item.id === 'profile' 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h2>

            <div className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center border-2 border-white/10 overflow-hidden">
                    <span className="text-4xl font-bold text-primary neon-glow">
                      {user?.name[0]?.toUpperCase()}
                    </span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-white">Profile Picture</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px]">PNG or JPG. Maximum size allowed is 2MB.</p>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 text-xs font-bold p-0 h-auto mt-2">
                    Replace Image
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full bg-white/5 border border-white/10 text-slate-400 rounded-2xl px-4 py-3 text-sm cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Shield className="w-5 h-5 shadow-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white capitalize">
                      {user?.role === 'caregiver' ? 'Caregiver Mode Active' : 'Patient Mode Active'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {user?.role === 'caregiver'
                        ? 'Priority access to dependent medication logs and emergency notifications is enabled.'
                        : 'Your personal health data is encrypted and synced across all your verified devices.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              Notifications & UI
            </h2>

            <div className="space-y-4">
              {[
                { label: 'Push Notifications', desc: 'Alerts for medication times and refills.', enabled: true },
                { label: 'Email Reports', desc: 'Weekly summary of your adherence trends.', enabled: false },
                { label: 'Dark Mode', desc: 'Optimized high-contrast interface for eye-care.', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{pref.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                  </div>
                  <button className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300",
                    pref.enabled ? "bg-primary" : "bg-white/10"
                  )}>
                    <span className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
                      pref.enabled ? "translate-x-6" : "translate-x-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Data Actions */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Security & Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white justify-start px-6">
                <Key className="w-4 h-4 mr-3 text-primary" />
                Change Password
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white justify-start px-6">
                <Smartphone className="w-4 h-4 mr-3 text-primary" />
                Active Devices
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white justify-start px-6">
                <FileText className="w-4 h-4 mr-3 text-slate-500" />
                Privacy Policy
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-red-500/10 bg-red-500/5 text-red-400 hover:bg-red-500/10 justify-start px-6">
                <Trash2 className="w-4 h-4 mr-3" />
                Clear Local Data
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center py-6 text-slate-600">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              MediTrack Enterprise
              <div className="w-1 h-1 rounded-full bg-primary" />
            </div>
            <p className="text-[10px] font-medium opacity-50">Build Version 2.4.12-Stable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
