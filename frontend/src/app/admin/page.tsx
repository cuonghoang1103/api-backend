'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
  source?: 'api' | 'placeholder';
}

interface RecentPost {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  createdAt: string;
}

// Initial placeholder stats. They get replaced with real values after
// the API call resolves; if an endpoint doesn't return a total, we keep
// the "—" placeholder rather than fabricate a number.
const PLACEHOLDER_STATS: StatCard[] = [
  { label: 'Tổng bài viết', value: '—', icon: FileText, color: 'from-neon-indigo to-neon-violet', source: 'placeholder' },
  { label: 'Tổng người dùng', value: '—', icon: Users, color: 'from-neon-fuchsia to-neon-pink', source: 'placeholder' },
  { label: 'Cuộc trò chuyện AI', value: 0, icon: MessageSquare, color: 'from-neon-cyan to-neon-blue', source: 'api' },
  { label: 'Tin nhắn AI', value: 0, icon: Activity, color: 'from-neon-emerald to-neon-green', source: 'api' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>(PLACEHOLDER_STATS);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [chatStats, setChatStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lightweight per-resource endpoints in parallel so the
        // dashboard never blocks on a slow query, and never has to lie
        // about totals by computing them from a paginated subset.
        const [postsPage, chat, usersPage] = await Promise.allSettled([
          api.get('/admin/posts?page=0&size=5'),
          api.get('/ai/analytics/overview').catch(() => ({ data: { data: {} } })),
          api.get('/admin/users?page=0&size=1').catch(() => ({ data: { data: [], pagination: { total: null } } })),
        ]);

        const postsRows = postsPage.status === 'fulfilled' && Array.isArray(postsPage.value.data?.data)
          ? postsPage.value.data.data
          : [];
        const postsPagination = postsPage.status === 'fulfilled' ? postsPage.value.data?.pagination : null;
        setRecentPosts(
          postsRows.map((p: any) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            viewCount: p.viewCount || 0,
            createdAt: p.createdAt,
          }))
        );

        const chatData = chat.status === 'fulfilled' ? chat.value.data?.data || {} : {};
        setChatStats(chatData);

        // Prefer backend-reported totals. If the endpoint doesn't return
        // pagination.total, fall back to "—" so we never show a partial
        // count as if it were a true total.
        const totalPosts = postsPagination?.total;
        const totalUsers = usersPage.status === 'fulfilled'
          ? usersPage.value.data?.pagination?.total
          : null;

        setStats([
          {
            label: 'Tổng bài viết',
            value: typeof totalPosts === 'number' ? totalPosts : '—',
            icon: FileText,
            color: 'from-neon-indigo to-neon-violet',
            source: 'api',
          },
          {
            label: 'Tổng người dùng',
            value: typeof totalUsers === 'number' ? totalUsers : '—',
            icon: Users,
            color: 'from-neon-fuchsia to-neon-pink',
            source: 'api',
          },
          {
            label: 'Cuộc trò chuyện AI',
            value: chatData.totalSessions || 0,
            icon: MessageSquare,
            color: 'from-neon-cyan to-neon-blue',
            source: 'api',
          },
          {
            label: 'Tin nhắn AI',
            value: chatData.totalMessages || 0,
            icon: Activity,
            color: 'from-neon-emerald to-neon-green',
            source: 'api',
          },
        ]);
      } catch {
        toast.error('Lỗi tải dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500/15 text-emerald-400',
    DRAFT: 'bg-yellow-500/15 text-yellow-400',
    SCHEDULED: 'bg-blue-500/15 text-blue-400',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-darkcard rounded-2xl animate-pulse border border-darkborder" />
          ))}
        </div>
        <div className="bg-darkcard rounded-2xl border border-darkborder h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-darkcard border border-darkborder rounded-2xl p-5 hover:border-darkborder/80 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-heading font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-darkborder flex items-center justify-between">
            <h2 className="font-heading font-bold text-text-primary">Bài viết gần đây</h2>
            <a href="/admin/posts" className="text-sm text-neon-violet hover:underline">Xem tất cả</a>
          </div>
          <div className="divide-y divide-darkborder">
            {recentPosts.length === 0 ? (
              <p className="text-center text-text-muted py-8">Chưa có bài viết nào</p>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-neon-violet" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{post.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status] || 'bg-gray-500/10 text-gray-400'}`}>
                      {post.status}
                    </span>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Chat overview */}
        <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-darkborder flex items-center justify-between">
            <h2 className="font-heading font-bold text-text-primary">AI Chat Overview</h2>
            <a href="/admin/ai-analytics" className="text-sm text-neon-violet hover:underline">Chi tiết</a>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-darkbg rounded-xl p-4 text-center">
                <MessageSquare className="w-6 h-6 text-neon-violet mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-text-primary">
                  {chatStats.totalSessions || 0}
                </p>
                <p className="text-xs text-text-muted mt-1">Tổng cuộc trò chuyện</p>
              </div>
              <div className="bg-darkbg rounded-xl p-4 text-center">
                <Activity className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-text-primary">
                  {chatStats.totalMessages || 0}
                </p>
                <p className="text-xs text-text-muted mt-1">Tin nhắn</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Phản hồi tích cực</span>
                <span className="text-neon-emerald font-medium">
                  {chatStats.positiveFeedbackPercent || 0}%
                </span>
              </div>
              <div className="h-2 bg-darkbg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-emerald to-neon-green rounded-full transition-all"
                  style={{ width: `${chatStats.positiveFeedbackPercent || 0}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Clock className="w-4 h-4 text-text-muted" />
              <span className="text-xs text-text-muted">
                Avg. response time: {chatStats.avgResponseTimeMs || 'N/A'}ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
