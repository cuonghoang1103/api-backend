'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Cpu, Terminal, Package, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import {
  cyberApi as api,
  type CyberTask,
  type CyberProfile,
  type CyberInventory,
  type CyberAnalytics,
  type DiscountCode,
} from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { CyberWindow } from '@/components/cyber/Window';
import { TimelineGrid } from '@/components/cyber/TimelineGrid';
import { ProfileWindow } from '@/components/cyber/ProfileWindow';
import { InventoryWindow } from '@/components/cyber/InventoryWindow';
import { CommandPalette } from '@/components/cyber/CommandPalette';
import { LaserStrike } from '@/components/cyber/LaserStrike';
import { CyberAnalyticsChart } from '@/components/cyber/AnalyticsChart';
import CyberTerminal from '@/components/cyber/CyberTerminal';
import '@/styles/cyber.css';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function CyberTasksPage() {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [cliOpen, setCliOpen] = useState(false);
  const [laserTrigger, setLaserTrigger] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<number | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [lastProfile, setLastProfile] = useState<CyberProfile | null>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [lastMintedCoupon, setLastMintedCoupon] = useState<import('@/lib/api').DiscountCode | null>(null);

  // ── Security Guard ────────────────────────────────────────────────────────
  if (authStore.isLoading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="font-mono text-neon-green animate-pulse">[ AUTHENTICATING... ]</div>
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    useEffect(() => {
      window.location.href = '/login';
    }, []);
    return null;
  }

  // ── Data Fetching ────────────────────────────────────────────────────────
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['cyber-tasks', selectedDate],
    queryFn: () => api.getTasks(selectedDate).then((r) => r.data.data ?? []),
    staleTime: 30_000,
  });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['cyber-profile'],
    queryFn: () => api.getProfile().then((r) => r.data.data!),
    staleTime: 30_000,
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['cyber-inventory'],
    queryFn: () => api.getInventory().then((r) => r.data.data!),
    staleTime: 30_000,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['cyber-analytics'],
    queryFn: () => api.getAnalytics('month').then((r) => r.data.data!),
    staleTime: 60_000,
  });

  // Sync lastProfile for level-up detection
  useEffect(() => {
    if (profileData) {
      if (lastProfile && profileData.level > lastProfile.level) {
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 3000);
      }
      setLastProfile(profileData);
    }
  }, [profileData]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: (taskId: number) => api.toggleTask(taskId).then((r) => r.data.data!),
    onMutate: (id) => setTogglingIds((s) => new Set([...s, id])),
    onSuccess: (result) => {
      if (result.expGranted > 0 && !result.dailyCapHit) {
        setCompletedTaskId(result.task.id);
        setLaserTrigger((v) => !v);
      }
      queryClient.setQueryData(['cyber-profile'], result.profile);
      queryClient.setQueryData(['cyber-inventory'], (old: CyberInventory | undefined) => {
        if (!old) return old;
        return { ...old, pointBalance: old.pointBalance + Math.floor(result.expGranted / 2) };
      });
      queryClient.invalidateQueries({ queryKey: ['cyber-tasks', selectedDate] });
    },
    onSettled: (_, __, id) => {
      setTogglingIds((s) => { const n = new Set(s); n.delete(id); return n; });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof api.createTask>[0]) =>
      api.createTask(data).then((r) => r.data.data!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cyber-tasks', selectedDate] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTask(id).then((r) => r.data.data!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cyber-tasks', selectedDate] }),
  });

  const mintMutation = useMutation({
    mutationFn: (amount: number) => api.mintCoupon(amount).then((r) => r.data.data!),
    onSuccess: (coupon) => {
      setLastMintedCoupon(coupon);
      queryClient.invalidateQueries({ queryKey: ['cyber-inventory'] });
    },
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggle = useCallback((id: number) => {
    toggleMutation.mutate(id);
  }, [toggleMutation]);

  const handleDelete = useCallback((id: number) => {
    if (confirm('Delete this task?')) deleteMutation.mutate(id);
  }, [deleteMutation]);

  // ── CLI Command Processing ────────────────────────────────────────────────
  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim().toLowerCase();
    const today = formatDate(new Date());

    if (trimmed.startsWith('task add') || trimmed.startsWith('add')) {
      const titleMatch = input.match(/add\s+"([^"]+)"/) || input.match(/add\s+(\S+)/);
      const title = titleMatch ? titleMatch[1] : 'New Task';
      const typeMatch = input.match(/--type\s+(\w+)/);
      const timeMatch = input.match(/--time\s+(\d{2}:\d{2})/);
      const endMatch = input.match(/--end\s+(\d{2}:\d{2})/);
      const expMatch = input.match(/--exp\s+(\d+)/);

      const type = (typeMatch?.[1]?.toUpperCase() || 'TASK') as CyberTask['type'];
      if (!['TASK', 'STUDY', 'ROUTINE'].includes(type)) return;

      createMutation.mutate({
        title,
        type,
        startTime: timeMatch?.[1] || '09:00',
        endTime: endMatch?.[1] || '10:00',
        expReward: parseInt(expMatch?.[1] || '20'),
        date: today,
      });
    }
  }, [createMutation]);

  // ── Keyboard Shortcut (Ctrl+`) ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && e.ctrlKey) {
        e.preventDefault();
        setCliOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Cyber:add-task event (from TimelineGrid inline form) ──────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      createMutation.mutate(detail);
    };
    window.addEventListener('cyber:add-task', handler);
    return () => window.removeEventListener('cyber:add-task', handler);
  }, [createMutation]);

  const tasks: CyberTask[] = tasksData ?? [];
  const profile: CyberProfile | null = profileData ?? null;
  const inventory: CyberInventory | null = inventoryData ?? null;
  const analytics: CyberAnalytics | null = analyticsData ?? null;

  const displayDate = new Date(selectedDate + 'T00:00:00');
  const formattedDate = displayDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-cyber-bg relative overflow-hidden">
      {/* CRT Scanlines Overlay */}
      <div className="crt-overlay pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 p-4 md:p-6 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-2xl font-black tracking-wider">
              <span className="text-neon-green">&gt; CYBER_OS</span>
              <span className="text-white/30 font-light">/TASK_MANAGER</span>
            </h1>
            <p className="font-mono text-xs text-white/30 mt-0.5">
              {authStore.user?.username}@{authStore.user?.email} :: SESSION_ACTIVE
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Picker */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neon-green/30 bg-neon-green/5">
              <Calendar size={14} className="text-neon-green flex-shrink-0" />
              <label className="relative cursor-pointer">
                <span className="font-mono text-xs text-neon-green">{selectedDate}</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                />
              </label>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const d = new Date(selectedDate + 'T00:00:00');
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(formatDate(d));
                }}
                className="p-2 rounded border border-white/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all"
              >
                <ChevronLeft size={14} className="text-white/50" />
              </button>
              <button
                onClick={() => setSelectedDate(formatDate(new Date()))}
                className="px-3 py-1.5 font-mono text-xs text-white/50 border border-white/10 rounded hover:border-neon-green/30 hover:text-neon-green transition-all"
              >
                TODAY
              </button>
              <button
                onClick={() => {
                  const d = new Date(selectedDate + 'T00:00:00');
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(formatDate(d));
                }}
                className="p-2 rounded border border-white/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all"
              >
                <ChevronRight size={14} className="text-white/50" />
              </button>
            </div>

            {/* CLI Toggle */}
            <button
              onClick={() => setCliOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 transition-colors"
              title="Command Palette (Ctrl+`)"
            >
              <Terminal size={14} className="text-neon-green" />
              <span className="font-mono text-xs text-neon-green hidden sm:inline">CLI</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['cyber-tasks', selectedDate] });
                queryClient.invalidateQueries({ queryKey: ['cyber-profile'] });
                queryClient.invalidateQueries({ queryKey: ['cyber-inventory'] });
              }}
              className="p-2 rounded border border-white/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all"
            >
              <RefreshCw size={14} className="text-white/50" />
            </button>
          </div>
        </div>

        {/* Date Display */}
        <div className="font-mono text-xs text-white/40 mb-4 uppercase tracking-widest">
          &gt; {formattedDate}
        </div>

        {/* Windows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Timeline (spans 2 columns) */}
          <div className="lg:col-span-2">
            <CyberWindow
              title={`TIMELINE — ${selectedDate}`}
              icon={<Cpu size={12} />}
              neonColor="cyan"
              className="max-h-[70vh]"
            >
              {tasksLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <TimelineGrid
                  tasks={tasks}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onAddTask={() => {}}
                  togglingIds={togglingIds}
                  completedId={completedTaskId}
                />
              )}
            </CyberWindow>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Profile */}
            <CyberWindow
              title="PROFILE"
              icon={<Package size={12} />}
              neonColor="green"
            >
              <ProfileWindow profile={profile} loading={profileLoading} />
            </CyberWindow>

            {/* Inventory */}
            <CyberWindow
              title="INVENTORY"
              icon={<Package size={12} />}
              neonColor="amber"
            >
              <InventoryWindow
                inventory={inventory}
                loading={inventoryLoading}
                onMintCoupon={(amount) => mintMutation.mutateAsync(amount)}
                onMintSuccess={(coupon) => setLastMintedCoupon(coupon)}
              />
            </CyberWindow>

            {/* Analytics */}
            <CyberWindow
              title="ANALYTICS"
              icon={<BarChart3 size={12} />}
              neonColor="cyan"
            >
              <CyberAnalyticsChart data={analytics} loading={analyticsLoading} />
            </CyberWindow>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="mt-4 flex items-center gap-4 font-mono text-[10px] text-white/20">
          <span>CYBER_OS v1.0.0</span>
          <span>NODE: ACTIVE</span>
          <span>SESSION: {authStore.user?.username?.toUpperCase()}</span>
          <span>KEYBIND: Ctrl+` = CLI PALETTE</span>
        </div>
      </div>

      {/* Level Up Overlay */}
      {levelUp && profile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 animate-levelup-overlay">
          <div className="text-center">
            <div className="font-mono text-6xl font-black text-neon-green animate-pulse tracking-widest">
              LEVEL UP!
            </div>
            <div className="font-mono text-3xl text-neon-amber mt-2">LVL {profile.level}</div>
            <div className="font-mono text-sm text-white/50 mt-4">
              {profile.currentExp} / {profile.requiredExp} EXP
            </div>
          </div>
        </div>
      )}

      {/* Laser Effect */}
      <LaserStrike
        trigger={laserTrigger}
        onComplete={() => setCompletedTaskId(null)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={cliOpen}
        onClose={() => setCliOpen(false)}
        onCommand={processCommand}
      />

      {/* CuongMini AI Terminal */}
      <CyberTerminal />
    </div>
  );
}
