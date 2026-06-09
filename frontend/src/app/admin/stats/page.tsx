'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Users,
  FileText,
  MessageSquare,
  Database,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Clock,
  Eye,
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  totalPosts: number;
  totalViews: number;
  totalProjects: number;
  totalSkills: number;
  activeSessions: number;
  totalMessages: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  memoryPercent: number;
  uptimeSeconds: number;
  uptimeFormatted: string;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats/overview');
        const data = res.data?.data || {};
        setStats({
          totalUsers: data.totalUsers || 0,
          totalPosts: data.totalPosts || 0,
          totalViews: data.totalViews || 0,
          totalProjects: data.totalProjects || 0,
          totalSkills: data.totalSkills || 0,
          activeSessions: data.activeSessions || 0,
          totalMessages: data.totalMessages || 0,
          memoryUsedMB: data.memoryUsedMB || 0,
          memoryTotalMB: data.memoryTotalMB || 0,
          memoryPercent: data.memoryPercent || 0,
          uptimeSeconds: data.uptimeSeconds || 0,
          uptimeFormatted: data.uptimeFormatted || 'N/A',
        });
      } catch {
        toast.error('Lỗi tải system stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Tổng Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-neon-indigo to-neon-violet' },
    { label: 'Tổng Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'from-neon-fuchsia to-neon-pink' },
    { label: 'Tổng Projects', value: stats?.totalProjects || 0, icon: Server, color: 'from-neon-emerald to-neon-green' },
    { label: 'AI Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'from-neon-cyan to-neon-blue' },
  ];

  const resourceCards = [
    { label: 'Memory Usage', value: `${stats?.memoryUsedMB || 0}MB / ${stats?.memoryTotalMB || 0}MB`, icon: Cpu, percent: stats?.memoryPercent || 0 },
    { label: 'Disk Usage', value: 'N/A', icon: HardDrive, percent: 0 },
    { label: 'Uptime', value: stats?.uptimeFormatted || 'N/A', icon: Clock, percent: 0 },
    { label: 'Tổng cuộc trò chuyện', value: stats?.totalSessions || 0, icon: Activity, percent: 0 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">System Stats</h1>
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
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">System Statistics</h1>
        <p className="text-text-secondary mt-1">Thống kê hệ thống & tài nguyên</p>
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

      <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
        <h2 className="font-heading font-bold text-text-primary mb-4">Tài nguyên hệ thống</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resourceCards.map((card, i) => (
            <div key={i} className="bg-darkbg rounded-xl p-4 border border-darkborder">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <card.icon className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">{card.label}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{card.value}</span>
              </div>
              {card.percent > 0 && (
                <div className="h-2 bg-darkcard rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      card.percent > 80 ? 'bg-red-500' : card.percent > 60 ? 'bg-yellow-500' : 'bg-neon-violet'
                    }`}
                    style={{ width: `${Math.min(card.percent, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
