'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Users, FileText, MessageSquare, Database, Server, Cpu, HardDrive,
  Activity, Clock, Eye, Cloud, Gauge, Boxes,
} from 'lucide-react';

interface HostStats {
  uptimeSeconds: number;
  memTotalBytes: number; memUsedBytes: number; memPercent: number;
  cores: number; load1: number; load5: number; load15: number; loadPercent: number;
}
interface DiskStats { totalBytes: number; usedBytes: number; availBytes: number; percent: number }
interface R2Usage { objectCount: number; totalBytes: number; truncated: boolean; sampledAt: string }
interface SystemData {
  host: HostStats;
  process: { heapUsedBytes: number; rssBytes: number; uptimeSeconds: number };
  disk: DiskStats | null;
  r2: R2Usage | null;
  dbSizeBytes: number | null;
  redisMemoryBytes: number | null;
}
interface StatsResponse {
  totalUsers: number; totalPosts: number; totalViews: number; totalProjects: number;
  totalSkills: number; activeSessions: number; totalMessages: number; totalSessions: number;
  uptimeFormatted: string;
  system?: SystemData;
}

function fmtBytes(b?: number | null): string {
  if (b == null) return 'N/A';
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}
function fmtUptime(s?: number): string {
  if (!s) return 'N/A';
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const fetchStats = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const res = await api.get('/admin/stats/overview');
      setStats(res.data?.data || null);
      setRefreshedAt(new Date());
    } catch {
      if (initial) toast.error('Lỗi tải system stats');
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);
    const iv = setInterval(() => fetchStats(false), 8000); // realtime-ish refresh
    return () => clearInterval(iv);
  }, [fetchStats]);

  const sys = stats?.system;
  const host = sys?.host;

  const statCards = [
    { label: 'Tổng Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-neon-indigo to-neon-violet' },
    { label: 'Tổng Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'from-neon-fuchsia to-neon-pink' },
    { label: 'Tổng Projects', value: stats?.totalProjects || 0, icon: Server, color: 'from-neon-emerald to-neon-green' },
    { label: 'AI Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'from-neon-cyan to-neon-blue' },
  ];

  // VPS host resource meters.
  const resourceCards = [
    {
      label: 'RAM (VPS)', icon: Cpu,
      value: host ? `${fmtBytes(host.memUsedBytes)} / ${fmtBytes(host.memTotalBytes)}` : 'N/A',
      percent: host?.memPercent || 0,
    },
    {
      label: 'Đĩa (VPS)', icon: HardDrive,
      value: sys?.disk ? `${fmtBytes(sys.disk.usedBytes)} / ${fmtBytes(sys.disk.totalBytes)}` : 'N/A',
      percent: sys?.disk?.percent || 0,
    },
    {
      label: `CPU load (${host?.cores ?? '?'} nhân)`, icon: Gauge,
      value: host ? `${host.load1} · ${host.load5} · ${host.load15}` : 'N/A',
      percent: host?.loadPercent || 0,
    },
    {
      label: 'Uptime (VPS)', icon: Clock,
      value: fmtUptime(host?.uptimeSeconds), percent: 0,
    },
  ];

  // Storage & services.
  const serviceCards = [
    { label: 'R2 — dung lượng', icon: Cloud, value: sys?.r2 ? `${fmtBytes(sys.r2.totalBytes)}${sys.r2.truncated ? '+' : ''}` : 'N/A' },
    { label: 'R2 — số object', icon: Boxes, value: sys?.r2 ? `${sys.r2.objectCount.toLocaleString('vi-VN')}${sys.r2.truncated ? '+' : ''}` : 'N/A' },
    { label: 'PostgreSQL', icon: Database, value: fmtBytes(sys?.dbSizeBytes) },
    { label: 'Redis (bộ nhớ)', icon: Activity, value: fmtBytes(sys?.redisMemoryBytes) },
    { label: 'Cuộc trò chuyện', icon: MessageSquare, value: (stats?.totalSessions || 0).toLocaleString('vi-VN') },
    { label: 'Heap tiến trình BE', icon: Server, value: fmtBytes(sys?.process.heapUsedBytes) },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">System Statistics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-darkcard rounded-2xl animate-pulse border border-darkborder" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">System Statistics</h1>
          <p className="text-text-secondary mt-1">Thống kê hệ thống & tài nguyên (số liệu thật, tự làm mới mỗi 8s)</p>
        </div>
        {refreshedAt && (
          <span className="text-xs text-text-secondary">Cập nhật: {refreshedAt.toLocaleTimeString('vi-VN')}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-darkcard border border-darkborder rounded-2xl p-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-heading font-bold text-text-primary">{card.value.toLocaleString('vi-VN')}</p>
            <p className="text-sm text-text-muted mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-yellow to-neon-amber flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-heading font-bold text-text-primary">{(stats?.totalViews || 0).toLocaleString('vi-VN')}</p>
          <p className="text-sm text-text-muted mt-1">Tổng Views</p>
        </div>
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-violet flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-heading font-bold text-text-primary">{stats?.totalSkills || 0}</p>
          <p className="text-sm text-text-muted mt-1">Tổng Skills</p>
        </div>
      </div>

      {/* VPS host resources */}
      <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
        <h2 className="font-heading font-bold text-text-primary mb-4">Tài nguyên máy chủ (VPS)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resourceCards.map((card, i) => (
            <div key={i} className="bg-darkbg rounded-xl p-4 border border-darkborder">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <card.icon className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">{card.label}</span>
                </div>
                <span className="text-sm font-medium text-text-primary font-mono">{card.value}</span>
              </div>
              {card.percent > 0 && (
                <div className="h-2 bg-darkcard rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      card.percent > 85 ? 'bg-red-500' : card.percent > 65 ? 'bg-yellow-500' : 'bg-neon-violet'
                    }`}
                    style={{ width: `${Math.min(card.percent, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Storage & services */}
      <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
        <h2 className="font-heading font-bold text-text-primary mb-4">Lưu trữ & dịch vụ</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceCards.map((card, i) => (
            <div key={i} className="bg-darkbg rounded-xl p-4 border border-darkborder">
              <div className="flex items-center gap-2 mb-1.5">
                <card.icon className="w-4 h-4 text-text-muted" />
                <span className="text-xs text-text-secondary">{card.label}</span>
              </div>
              <span className="text-lg font-heading font-bold text-text-primary font-mono">{card.value}</span>
            </div>
          ))}
        </div>
        {sys?.r2?.sampledAt && (
          <p className="text-[11px] text-text-secondary mt-3">
            R2 lấy mẫu lúc {new Date(sys.r2.sampledAt).toLocaleTimeString('vi-VN')} (cache 10 phút){sys.r2.truncated ? ' · đã đạt giới hạn liệt kê, số thực có thể lớn hơn' : ''}.
          </p>
        )}
      </div>
    </div>
  );
}
