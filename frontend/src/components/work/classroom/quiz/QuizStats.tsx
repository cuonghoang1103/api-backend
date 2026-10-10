'use client';

/**
 * CTW đợt 9c — THỐNG KÊ quiz (giảng viên): ô KPI (TB, trung vị, độ lệch chuẩn, số SV, tự nộp, rời tab), phân bố điểm theo
 * dải 10% (ChartFrame — xuất PNG/CSV, bảng ẩn cho trình đọc màn hình), bảng phân tích câu: độ khó p, độ phân biệt D, phương
 * án nhiễu bị chọn nhiều, số lần chọn từng phương án. Tính trên lượt ĐẦU TIÊN đã nộp của mỗi sinh viên (máy chủ).
 */

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { EmptyState, PageLoading } from '@/components/work/ui';
import KpiTile, { KpiRow } from '@/components/work/KpiTile';
import ChartFrame from '@/components/work/charts/ChartFrame';
import { useWT } from '@/components/work/i18n';
import { TypeChip } from './QuestionBank';
import QuizText from './QuizText';
import { quizApi, quizKeys } from './quizApi';

const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 1000) / 10}%`);

export default function QuizStats({ cid, qid }: { cid: number; qid: number }) {
  const { t } = useWT();
  const s = useQuery({ queryKey: quizKeys.stats(cid, qid), queryFn: () => quizApi.stats(cid, qid) });
  if (s.isLoading) return <PageLoading rows={4} />;
  if (s.error || !s.data) return <EmptyState title={workError(s.error)} />;
  const d = s.data;
  if (!d.attempts) return <EmptyState title={t('c9c.noResults')} body={t('c9c.noResultsBody')} />;
  const peak = Math.max(1, ...d.bins.map((b) => b.count));
  return (
    <div className="space-y-4">
      <KpiRow min={130} label={t('c9c.tab_stats')}>
        <KpiTile label={t('c9c.mean')} value={pct(d.mean)} />
        <KpiTile label={t('c9c.median')} value={pct(d.median)} />
        <KpiTile label={t('c9c.sd')} value={pct(d.sd)} tone="muted" />
        <KpiTile label={t('c9c.studentsKpi')} value={d.attempts} hint={t('c9c.attemptsAll', { n: d.totalAttempts })} />
        <KpiTile label={t('c9c.autoKpi')} value={d.autoSubmitted} tone={d.autoSubmitted ? 'orange' : 'muted'} />
        <KpiTile label={t('c9c.tabSwitches')} value={d.blurEvents} tone={d.blurEvents ? 'orange' : 'muted'} />
      </KpiRow>

      <ChartFrame
        title={t('c9c.distribution')} description={t('c9c.distributionDesc')} height={180} fileName="quiz-score-distribution"
        rows={d.bins} columns={[{ key: 'band', label: t('c9c.band'), value: (b) => `${b.from}-${b.to}%` }, { key: 'count', label: t('c9c.studentsKpi') }]}
        summary={d.bins.filter((b) => b.count).map((b) => `${b.from}–${b.to}%: ${b.count}`).join(', ')}
      >
        {() => (
          <div className="flex h-[180px] items-end gap-1.5 px-1 pb-5 pt-2">
            {d.bins.map((b) => (
              <div key={b.from} className="relative flex h-full flex-1 flex-col justify-end">
                {b.count > 0 && <span className="mb-0.5 text-center text-[11px] tabular-nums text-[var(--w-text-2)]">{b.count}</span>}
                <div className="rounded-t-[3px] bg-[var(--w-accent)]" style={{ height: `${(b.count / peak) * 100}%`, minHeight: b.count ? 3 : 0 }} />
                <span className="absolute -bottom-5 left-0 right-0 text-center text-[10.5px] tabular-nums text-[var(--w-text-3)]">{b.from}</span>
              </div>
            ))}
          </div>
        )}
      </ChartFrame>

      <section className="w-card overflow-hidden" aria-labelledby="quiz-items-stats-h">
        <div className="border-b border-[var(--w-border)] px-4 py-3">
          <h4 id="quiz-items-stats-h" className="w-section-title">{t('c9c.itemAnalysis')}</h4>
          <p className="mt-0.5 text-[12px] text-[var(--w-text-2)]">{t('c9c.difficultyHelp')} {t('c9c.discriminationHelp')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead className="bg-[var(--w-sunken)] text-left text-[12px] text-[var(--w-text-2)]">
              <tr>
                <th scope="col" className="px-3 py-2">{t('c9c.qPrompt')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.answeredCol')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.difficulty')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.discrimination')}</th>
                <th scope="col" className="px-3 py-2">{t('c9c.optionCounts')}</th>
              </tr>
            </thead>
            <tbody>
              {d.questions.map((q) => {
                const weak = q.discrimination !== null && q.discrimination < 0.2;
                const hard = q.difficulty !== null && q.difficulty < 0.3;
                return (
                  <tr key={q.questionId} className="border-t border-[var(--w-border)] align-top">
                    <td className="max-w-[340px] px-3 py-2">
                      <div className="mb-0.5"><TypeChip type={q.type} /></div>
                      <QuizText text={q.prompt} className="line-clamp-3 text-[13px]" />
                      {q.topDistractor && <div className="mt-1 text-[12px] text-[var(--w-orange-text)]"><AlertTriangle size={12} aria-hidden="true" className="mr-1 inline" />{t('c9c.distractorLine', { text: q.topDistractor.text, p: Math.round(q.topDistractor.share * 100) })}</div>}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{q.n - q.blank}/{q.n}</td>
                    <td className={cn('px-3 py-2 text-right tabular-nums', hard && 'text-[var(--w-orange-text)]')}>{q.difficulty ?? '—'}{hard && <span className="ml-1 text-[11px]">({t('c9c.flagHard')})</span>}</td>
                    <td className={cn('px-3 py-2 text-right tabular-nums', weak && 'text-[var(--w-red-text)]')}>{q.discrimination ?? t('c9c.na')}{weak && <span className="ml-1 text-[11px]">({t('c9c.flagWeak')})</span>}</td>
                    <td className="px-3 py-2">
                      {q.choices.length ? (
                        <ul className="space-y-0.5 text-[12.5px]">
                          {q.choices.map((c) => (
                            <li key={c.src} className="flex items-center gap-2">
                              <span className={cn('w-4 shrink-0', c.correct ? 'text-[var(--w-green-text)]' : 'text-[var(--w-text-3)]')} aria-label={c.correct ? t('c9c.correctBadge') : undefined}>{c.correct ? '✓' : ''}</span>
                              <span className="min-w-0 flex-1 truncate">{c.text}</span>
                              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className={cn('block h-full', c.correct ? 'bg-[var(--w-green)]' : 'bg-[var(--w-text-3)]')} style={{ width: `${q.n ? (c.count / q.n) * 100 : 0}%` }} /></span>
                              <span className="w-6 text-right tabular-nums">{c.count}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <span className="text-[var(--w-text-3)]">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
