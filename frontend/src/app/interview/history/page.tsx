'use client';

/** /interview/history — past sessions + score trend (STATIC phase: a clean list). */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { interviewApi } from '@/lib/interview-api';
import type { HistoryItem } from '@/types/interview';

const gradeColor = (g?: string | null) =>
  g === 'A' ? '#10b981' : g === 'B' ? '#84cc16' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : g ? '#ef4444' : 'var(--text-secondary)';

export default function InterviewHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewApi.history().then((res) => setItems(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/interview" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"><ArrowLeft className="w-4 h-4" /> Phòng luyện</Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Lịch sử luyện tập</h1>

        {loading ? (
          <div className="flex items-center gap-2 text-[var(--text-secondary)]"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : !items.length ? (
          <div className="rounded-xl border border-[var(--border-light)] p-6 text-[var(--text-secondary)]">Chưa có buổi nào. <Link href="/interview" className="text-amber-600 dark:text-amber-400">Bắt đầu ngay →</Link></div>
        ) : (
          <div className="space-y-2">
            {items.map((s) => (
              <Link key={s.id} href={s.status === 'COMPLETED' ? `/interview/report/${s.id}` : `/interview/session/${s.id}`} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[var(--border-light)] hover:border-[var(--text-secondary)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{s.track}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{s.level} · {s.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang làm'} · {new Date(s.createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
                {s.letterGrade ? (
                  <span className="text-lg font-bold font-mono" style={{ color: gradeColor(s.letterGrade) }}>{s.letterGrade}</span>
                ) : (
                  <span className="text-xs text-[var(--text-secondary)]">—</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
