'use client';

/**
 * Admin — per-user My Language learning analytics.
 * Overview stat cards + a searchable per-user table with drill-down.
 */
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Users, Trophy, ListChecks, NotebookPen, Flame, Search, X, Loader2, GraduationCap } from 'lucide-react';
import { languageAdminApi, type LangAnalyticsOverview, type LangAnalyticsUser, type LangAnalyticsUserDetail } from '@/lib/language-api';

const SECTION_LABEL: Record<string, string> = {
  VOCAB: 'Từ vựng', ALPHABET: 'Bảng chữ', GRAMMAR: 'Ngữ pháp', LISTENING: 'Nghe', CONVERSATION: 'Giao tiếp', READING: 'Đọc', QNA: 'Q&A',
};

function fmtDate(s: string | null): string {
  if (!s) return '—';
  const d = new Date(s);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function LanguageAnalyticsPage() {
  const [overview, setOverview] = useState<LangAnalyticsOverview | null>(null);
  const [users, setUsers] = useState<LangAnalyticsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [detail, setDetail] = useState<LangAnalyticsUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async (kw = '') => {
    setLoading(true);
    try {
      const [o, u] = await Promise.all([
        languageAdminApi.analyticsOverview().catch(() => ({ data: { data: null } })),
        languageAdminApi.analyticsUsers(kw || undefined).catch(() => ({ data: { data: [] } })),
      ]);
      setOverview((o.data.data as LangAnalyticsOverview) ?? null);
      setUsers(Array.isArray(u.data.data) ? u.data.data : []);
    } catch {
      toast.error('Lỗi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setDetail({ user: null, perSection: {}, quizzes: [], notebookByKind: [] });
    try {
      const r = await languageAdminApi.analyticsUser(id);
      setDetail(r.data.data ?? null);
    } catch {
      toast.error('Lỗi tải chi tiết');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const cards = useMemo(() => [
    { label: 'Học viên', value: overview?.learners ?? 0, icon: Users, color: 'text-neon-violet' },
    { label: 'Đã thành thạo', value: overview?.mastered ?? 0, icon: Trophy, color: 'text-neon-green' },
    { label: 'Lượt quiz', value: overview?.quizzes ?? 0, icon: ListChecks, color: 'text-neon-cyan' },
    { label: 'Mục sổ tay', value: overview?.notebookEntries ?? 0, icon: NotebookPen, color: 'text-neon-blue' },
    { label: 'Thẻ đến hạn', value: overview?.dueCards ?? 0, icon: Flame, color: 'text-neon-orange' },
  ], [overview]);

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-text-primary"><GraduationCap className="text-neon-violet" /> Thống kê học tập ngôn ngữ</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-darkborder bg-darkcard p-4">
              <Icon className={`${c.color} mb-2`} size={22} />
              <p className="text-2xl font-bold text-text-primary">{loading ? '…' : c.value.toLocaleString()}</p>
              <p className="text-xs text-text-muted">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void load(keyword); }}
          placeholder="Tìm theo tên / email… (Enter)"
          className="w-full rounded-lg border border-darkborder bg-darkcard px-3 py-2 pl-9 text-sm text-text-primary outline-none focus:border-neon-violet/50"
        />
      </div>

      {/* Per-user table */}
      <div className="overflow-x-auto rounded-2xl border border-darkborder bg-darkcard">
        <table className="w-full text-sm">
          <thead className="border-b border-darkborder text-text-muted">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Người dùng</th>
              <th className="px-3 py-2.5 text-right font-medium">Thành thạo</th>
              <th className="px-3 py-2.5 text-right font-medium">Đang học</th>
              <th className="px-3 py-2.5 text-right font-medium">Quiz</th>
              <th className="px-3 py-2.5 text-right font-medium">Sổ tay</th>
              <th className="px-3 py-2.5 text-right font-medium">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-neon-violet" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-text-muted">Chưa có dữ liệu học tập.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId} onClick={() => openDetail(u.userId)} className="cursor-pointer border-b border-darkborder/50 transition hover:bg-white/5">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-violet/20 text-xs font-bold text-neon-violet">{(u.fullName || u.username).charAt(0).toUpperCase()}</span>}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-text-primary">{u.fullName || u.username}{u.isAdmin && <span className="ml-1 rounded bg-neon-orange/20 px-1 text-[9px] font-bold text-neon-orange">ADMIN</span>}</p>
                        <p className="truncate text-xs text-text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-neon-green">{u.mastered}</td>
                  <td className="px-3 py-2.5 text-right text-text-secondary">{u.learning + u.reviewing}</td>
                  <td className="px-3 py-2.5 text-right text-text-secondary">{u.quizzes > 0 ? `${u.quizzes} · ${u.quizAvg}%` : '—'}</td>
                  <td className="px-3 py-2.5 text-right text-text-secondary">{u.notebook}{u.due > 0 && <span className="ml-1 text-neon-orange">({u.due})</span>}</td>
                  <td className="px-3 py-2.5 text-right text-xs text-text-muted">{fmtDate(u.lastActive)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drill-down */}
      {detail && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-darkborder bg-darkcard sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-darkborder px-4 py-3">
              <p className="font-heading font-semibold text-text-primary">{detail.user ? (detail.user.fullName || detail.user.username) : 'Chi tiết'}</p>
              <button onClick={() => setDetail(null)} className="rounded-full p-1.5 text-text-muted hover:bg-white/5"><X size={18} /></button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {detailLoading ? (
                <div className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-neon-violet" /></div>
              ) : (
                <>
                  {detail.user && <p className="text-xs text-text-muted">{detail.user.email}</p>}
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Tiến độ theo mục</h3>
                    <div className="space-y-1.5">
                      {Object.entries(detail.perSection).filter(([, s]) => s.total > 0).map(([k, s]) => (
                        <div key={k} className="flex items-center gap-2 text-sm">
                          <span className="w-24 shrink-0 text-text-secondary">{SECTION_LABEL[k] ?? k}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-surface)]">
                            <div className="h-full bg-neon-green" style={{ width: `${s.total ? (s.mastered / s.total) * 100 : 0}%` }} />
                          </div>
                          <span className="w-16 shrink-0 text-right text-xs text-text-muted">{s.mastered}/{s.total}</span>
                        </div>
                      ))}
                      {Object.values(detail.perSection).every((s) => s.total === 0) && <p className="text-sm text-text-muted">Chưa có tiến độ.</p>}
                    </div>
                  </div>
                  {detail.notebookByKind.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Sổ tay</h3>
                      <div className="flex flex-wrap gap-2">
                        {detail.notebookByKind.map((n) => (
                          <span key={n.kind} className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs text-text-secondary ring-1 ring-darkborder">{n.kind}: {n.count}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {detail.quizzes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Quiz gần đây</h3>
                      <div className="space-y-1">
                        {detail.quizzes.map((q) => (
                          <div key={q.id} className="flex items-center justify-between text-sm">
                            <span className="text-text-muted">{fmtDate(q.createdAt)}</span>
                            <span className="font-medium text-text-primary">{q.score}/{q.total} ({q.total ? Math.round((q.score / q.total) * 100) : 0}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
