'use client';

/**
 * CTW đợt 5 — "Tuần 1 làm gì" cho dự án môn học (D6). Mỗi bước đọc từ dữ liệu thật của dự án (máy chủ: classroom.service
 * `week1`), làm ở đâu cũng tự tích; nút "Mở" dẫn thẳng tới đúng tính năng (Môn học & nhóm, Docs, GitHub, chat, việc định
 * kỳ, họp, Q&A, Requirements/Tests). Chữ qua i18n miền `classroom` (có bản tiếng Việt).
 */

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { useWT, type WKey } from '@/components/work/i18n';
import { teachingApi, teachingKeys, type Week1 } from '@/components/work/teaching/teachingApi';

const keyOf = (i: Week1['items'][number]) => (i.id === 'subject' ? `subject_${i.variant ?? 'requirements'}` : i.id);

export default function Week1Tab({ pid }: { pid: number }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: teachingKeys.week1(pid), queryFn: () => teachingApi.week1(pid) });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const w = q.data;
  const pct = Math.round((w.done / Math.max(1, w.total)) * 100);
  return (
    <div className="w-page max-w-[860px] space-y-4">
      <div>
        <h2 className="text-[17px] font-semibold">{t('classroom.week1Title')}</h2>
        <p className="mt-0.5 text-[13px] text-[var(--w-text-2)]">{t('classroom.week1Sub')}</p>
        {w.class && <p className="mt-1 text-[12px] text-[var(--w-text-2)]">{w.class.subject} · {w.class.classCode} · {w.class.term}</p>}
      </div>
      <div>
        <div className="mb-1 flex justify-between text-[12px] text-[var(--w-text-2)]"><span>{t('classroom.progress', { done: w.done, total: w.total })}</span><span className="tabular-nums">{pct}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuemin={0} aria-valuemax={w.total} aria-valuenow={w.done} aria-label={t('classroom.progress', { done: w.done, total: w.total })}>
          <div className="h-full rounded-full bg-[var(--w-green)] transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ol className="divide-y divide-[var(--w-border)] rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
        {w.items.map((i, n) => {
          const k = keyOf(i);
          return (
            <li key={k} className="flex items-start gap-3 px-4 py-3">
              {i.done
                ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--w-green-text)]" aria-label={t('classroom.done')} />
                : <Circle size={18} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-label={t('classroom.todo')} />}
              <div className="min-w-0 flex-1">
                <div className={cn('text-[14px] font-medium', i.done && 'text-[var(--w-text-2)] line-through decoration-[var(--w-text-3)]')}>{n + 1}. {t(`classroom.w1_${k}` as WKey)}</div>
                <p className="text-[12.5px] leading-snug text-[var(--w-text-2)]">{t(`classroom.w1_${k}_body` as WKey)}</p>
              </div>
              <Link href={i.href} className="w-btn w-btn-sm shrink-0" aria-label={`${t('classroom.go')}: ${t(`classroom.w1_${k}` as WKey)}`}>{t('classroom.go')}</Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
