'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  TrendingUp,
  Activity,
  Star,
  BarChart3,
} from 'lucide-react';

export default function AdminAIAnalyticsPage() {
  const [stats, setStats] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [overviewRes, feedbackRes, usersRes] = await Promise.all([
          api.get('/ai/analytics/overview').catch(() => ({ data: { data: {} } })),
          api.get('/ai/feedback/stats').catch(() => ({ data: { data: {} } })),
          api.get('/ai/admin/usage/users').catch(() => ({ data: { data: [] } })),
        ]);
        setStats(overviewRes.data?.data || {});
        setFeedback(feedbackRes.data?.data || {});
        setUsers(Array.isArray(usersRes.data?.data) ? usersRes.data.data : []);
      } catch {
        toast.error('Lỗi tải AI analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">AI Chat Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-darkcard rounded-2xl animate-pulse border border-darkborder" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Tổng cuộc trò chuyện',
      value: stats.totalSessions || 0,
      icon: MessageSquare,
      color: 'from-neon-indigo to-neon-violet',
    },
    {
      label: 'Tổng tin nhắn',
      value: stats.totalMessages || 0,
      icon: Activity,
      color: 'from-neon-cyan to-neon-blue',
    },
    {
      label: 'Phản hồi tích cực',
      value: `${stats.positiveFeedbackPercent || 0}%`,
      icon: ThumbsUp,
      color: 'from-neon-emerald to-neon-green',
    },
    {
      label: 'Trung bình response',
      value: `${stats.avgResponseTimeMs || 'N/A'}ms`,
      icon: Clock,
      color: 'from-neon-fuchsia to-neon-pink',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">AI Chat Analytics</h1>
        <p className="text-text-secondary mt-1">Thống kê chatbot AI</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-darkcard border border-darkborder rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-heading font-bold text-text-primary">{card.value}</p>
              <p className="text-sm text-text-muted mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback breakdown */}
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <h2 className="font-heading font-bold text-text-primary mb-4">Phản hồi người dùng</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">Tích cực</span>
                  <span className="text-sm font-medium text-emerald-400">{feedback.positiveCount || 0}</span>
                </div>
                <div className="h-2 bg-darkbg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    style={{ width: `${(feedback.positiveCount || 0) / Math.max(feedback.totalFeedbacks || 1, 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">Tiêu cực</span>
                  <span className="text-sm font-medium text-red-400">{feedback.negativeCount || 0}</span>
                </div>
                <div className="h-2 bg-darkbg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                    style={{ width: `${(feedback.negativeCount || 0) / Math.max(feedback.totalFeedbacks || 1, 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">Trung bình</span>
                  <span className="text-sm font-medium text-blue-400">{(feedback.averageRating || 0).toFixed(1)} / 5</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= Math.round(feedback.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-darkborder'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top queries */}
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <h2 className="font-heading font-bold text-text-primary mb-4">Tổng quan hiệu suất</h2>
          <div className="space-y-4">
            <div className="bg-darkbg rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Tổng feedback</span>
                <span className="text-lg font-heading font-bold text-text-primary">{feedback.totalFeedbacks || 0}</span>
              </div>
            </div>
            <div className="bg-darkbg rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Tin nhắn trung bình/session</span>
                <span className="text-lg font-heading font-bold text-text-primary">
                  {stats.totalSessions ? (stats.totalMessages / stats.totalSessions).toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="bg-darkbg rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Thời gian phản hồi TB</span>
                <span className="text-lg font-heading font-bold text-text-primary">{stats.avgResponseTimeMs || 'N/A'}ms</span>
              </div>
            </div>
            <div className="bg-darkbg rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Token usage</span>
                <span className="text-lg font-heading font-bold text-text-primary">{stats.totalTokens || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-user usage (Pro/Max management) */}
      <div className="bg-darkcard rounded-2xl border border-darkborder p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-text-primary">Người dùng theo mức sử dụng</h2>
          <span className="text-xs text-text-secondary">{users.length} người dùng · sắp theo token</span>
        </div>
        {users.length === 0 ? (
          <p className="text-sm text-text-secondary">Chưa có dữ liệu sử dụng theo người dùng.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-secondary border-b border-darkborder">
                  <th className="py-2 pr-3 font-medium">Người dùng</th>
                  <th className="py-2 px-3 font-medium">Gói</th>
                  <th className="py-2 px-3 font-medium text-right">Tin nhắn</th>
                  <th className="py-2 px-3 font-medium text-right">Token</th>
                  <th className="py-2 px-3 font-medium text-right">Phiên</th>
                  <th className="py-2 pl-3 font-medium">Hoạt động gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId} className="border-b border-darkborder/50">
                    <td className="py-2 pr-3">
                      <div className="text-text-primary font-medium">{u.username || `#${u.userId}`}</div>
                      {u.email && <div className="text-xs text-text-secondary">{u.email}</div>}
                    </td>
                    <td className="py-2 px-3">
                      {u.isPro ? (
                        <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300">
                          PRO{u.proExpiresAt ? '' : ' ∞'}
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary">Free</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-text-primary">{u.messages?.toLocaleString?.() ?? u.messages}</td>
                    <td className="py-2 px-3 text-right font-mono text-text-primary">{u.tokens?.toLocaleString?.() ?? u.tokens}</td>
                    <td className="py-2 px-3 text-right font-mono text-text-secondary">{u.sessions}</td>
                    <td className="py-2 pl-3 text-xs text-text-secondary">{u.lastActive ? new Date(u.lastActive).toLocaleString('vi-VN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
