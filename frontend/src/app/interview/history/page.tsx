'use client';

/** /interview/history — past sessions + score trend (STATIC phase: a clean list). */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Brain, Flame } from 'lucide-react';
import ParticleBackground from '@/components/repos/ParticleBackground';
import { interviewApi } from '@/lib/interview-api';
import type { HistoryItem, MasteryResponse, MasteryLevel } from '@/types/interview';

const MASTERY_META: Record<MasteryLevel, { label: string; color: string }> = {
  UNSEEN: { label: 'Chưa gặp', color: '#475569' },
  SHAKY: { label: 'Lung lay', color: '#ef4444' },
  LEARNING: { label: 'Đang học', color: '#f59e0b' },
  SOLID: { label: 'Vững', color: '#84cc16' },
  MASTERED: { label: 'Thành thạo', color: '#10b981' },
};
const MASTERY_ORDER: MasteryLevel[] = ['SHAKY', 'LEARNING', 'SOLID', 'MASTERED'];

const gradeColor = (g?: string | null) =>
  g === 'A' ? '#10b981' : g === 'B' ? '#84cc16' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : g ? '#ef4444' : '#94a3b8';

export default function InterviewHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [mastery, setMastery] = useState<MasteryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      interviewApi.history().then((res) => setItems(res.data.data)).catch(() => {}),
      interviewApi.mastery().then((res) => setMastery(res.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="low" followPointer={false} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <Link href="/interview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 mb-6"><ArrowLeft className="w-4 h-4" /> Phòng luyện</Link>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Lịch sử luyện tập</h1>

        {/* Drill CTA + mastery heatmap */}
        {mastery && mastery.totalCards > 0 && (
          <div className="mb-8 space-y-4">
            <Link href="/interview/drill" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 transition-colors">
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-200">{mastery.totalDue > 0 ? `${mastery.totalDue} thẻ tới hạn ôn hôm nay` : 'Chưa có thẻ tới hạn — ghé lại sau nhé'}</div>
                <div className="text-xs text-amber-200/70">Ôn nhanh 5–10 phút để kiến thức không rơi rụng</div>
              </div>
              <span className="text-sm text-amber-300">Ôn ngay →</span>
            </Link>

            <div className="rounded-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-slate-400" /><span className="text-sm font-semibold">Bản đồ thành thạo theo chủ đề</span></div>
              <div className="space-y-2">
                {mastery.topics.map((t) => (
                  <div key={t.topicId} className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 w-32 shrink-0 truncate">{t.topic}</span>
                    <div className="flex-1 flex h-4 rounded-md overflow-hidden bg-white/5">
                      {MASTERY_ORDER.map((m) => {
                        const n = t.byMastery[m] || 0;
                        if (!n) return null;
                        return <div key={m} title={`${MASTERY_META[m].label}: ${n}`} style={{ width: `${(n / t.total) * 100}%`, background: MASTERY_META[m].color }} />;
                      })}
                    </div>
                    {t.due > 0 && <span className="text-[10px] text-amber-400 shrink-0">{t.due} tới hạn</span>}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/10">
                {MASTERY_ORDER.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: MASTERY_META[m].color }} />{MASTERY_META[m].label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : !items.length ? (
          <div className="rounded-xl border border-white/10 p-6 text-slate-400">Chưa có buổi nào. <Link href="/interview" className="text-amber-400">Bắt đầu ngay →</Link></div>
        ) : (
          <div className="space-y-2">
            {items.map((s) => (
              <Link key={s.id} href={s.status === 'COMPLETED' ? `/interview/report/${s.id}` : `/interview/session/${s.id}`} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/10 hover:border-slate-500 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-100 truncate">{s.track}</div>
                  <div className="text-xs text-slate-400">{s.level} · {s.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang làm'} · {new Date(s.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
                {s.letterGrade ? (
                  <span className="text-lg font-bold font-mono" style={{ color: gradeColor(s.letterGrade) }}>{s.letterGrade}</span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
