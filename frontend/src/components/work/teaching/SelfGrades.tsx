'use client';

/**
 * dm5 G3 (27/11/2026) — D17: sinh viên TỰ CHẤM theo rubric (s10/b6 · s11/b4) trước buổi bảo vệ.
 *   - Rubric: rubric giảng viên đã dùng trong dự án, hoặc mẫu SWP391/SEP490 theo môn (máy chủ tạo bản riêng của sinh viên).
 *   - Lưu kind SELF — không bao giờ đè/sửa điểm giảng viên; hiện cạnh điểm GV cùng mốc (nếu sinh viên đã được thấy điểm đó).
 *   - Giảng viên thấy danh sách tự chấm (chỉ đọc) để so với điểm mình chấm.
 */

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { g3Api } from '@/lib/work-g3-api';
import { useWT } from '@/components/work/i18n';
import { useAuthStore } from '@/store/authStore';
import { teachingKeys, type GradesView, type RubricCriterion } from './teachingApi';

type Source = { kind: 'rubric'; id: number } | { kind: 'template'; key: string };

export default function SelfGrades({ pid, view }: { pid: number; view: GradesView }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const self = view.selfRubrics;
  const options = useMemo(() => [
    ...(self?.used ?? []).map((r) => ({ src: { kind: 'rubric', id: r.id } as Source, label: r.name, criteria: r.criteria, scaleMax: r.scaleMax, milestones: [] as string[] })),
    ...(self?.templates ?? []).map((tp) => ({ src: { kind: 'template', key: tp.key } as Source, label: t('teacher.selfTemplate', { n: tp.name }), criteria: tp.criteria, scaleMax: tp.scaleMax, milestones: tp.milestones })),
  ], [self, t]);
  const [pick, setPick] = useState(0);
  const opt = options[pick];
  const [milestone, setMilestone] = useState('');
  const [forMe, setForMe] = useState(false);
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [comment, setComment] = useState('');
  const save = useMutation({
    mutationFn: () => g3Api.saveSelfGrade(pid, {
      ...(opt!.src.kind === 'rubric' ? { rubricId: opt!.src.id } : { templateKey: opt!.src.key }),
      milestone: milestone.trim() || opt!.milestones[0] || 'Self-check', subjectUserId: forMe && meId ? Number(meId) : null, scores, comment: comment.trim() || null,
    }),
    onSuccess: () => { toast.success(t('teacher.selfSaved')); qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const del = useMutation({
    mutationFn: (gid: number) => g3Api.deleteSelfGrade(pid, gid),
    onSuccess: () => qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }),
    onError: (err) => toast.error(workError(err)),
  });
  const list = view.selfGrades ?? [];
  if (!view.canSelfGrade && !list.length) return null;
  const teacherTotal = (rubricId: number, m: string) => view.grades.find((g) => g.rubricId === rubricId && g.milestone === m && g.total != null)?.total ?? null;
  const total = (crit: RubricCriterion[]) => (crit.some((c) => scores[c.key] == null) ? null : Math.round(crit.reduce((a, c) => a + (c.weight / 100) * Number(scores[c.key]), 0) * 100) / 100);
  return (
    <section className="w-card p-4" aria-labelledby="g3-self-title" data-testid="g3-self-grades">
      <h3 id="g3-self-title" className="text-[15px] font-semibold">{t('teacher.selfTitle')}</h3>
      <p className="mb-3 max-w-[720px] text-[12.5px] text-[var(--w-text-2)]">{t('teacher.selfDesc')}</p>
      {view.canSelfGrade && opt && (
        <div className="mb-4 space-y-3 rounded-[8px] border border-[var(--w-border)] p-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('teacher.selfRubric')}
              <select className="w-input w-[280px]" value={pick} onChange={(e) => { setPick(Number(e.target.value)); setScores({}); }}>
                {options.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('teacher.milestone')}
              <input className="w-input w-[180px]" value={milestone} onChange={(e) => setMilestone(e.target.value)} list="g3-self-ms" placeholder={opt.milestones[0] ?? ''} />
              <datalist id="g3-self-ms">{[...new Set([...opt.milestones, ...view.milestoneHints])].map((m) => <option key={m} value={m} />)}</datalist>
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('teacher.selfFor')}
              <select className="w-input w-[140px]" value={forMe ? 'me' : 'team'} onChange={(e) => setForMe(e.target.value === 'me')}>
                <option value="team">{t('teacher.selfTeam')}</option><option value="me">{t('teacher.selfMe')}</option>
              </select>
            </label>
          </div>
          <table className="w-full border-collapse text-[13px]">
            <tbody>
              {opt.criteria.map((c) => (
                <tr key={c.key} className="border-t border-[var(--w-border)] align-top">
                  <th scope="row" className="py-1.5 pr-2 text-left font-normal">{c.name} <span className="text-[var(--w-text-2)]">· {c.weight}%</span></th>
                  <td className="w-24 py-1">
                    <input type="number" className="w-input text-right" min={0} max={opt.scaleMax} step={0.25} aria-label={c.name} value={scores[c.key] ?? ''}
                      onChange={(e) => setScores({ ...scores, [c.key]: e.target.value === '' ? null : Number(e.target.value) })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <textarea className="w-input min-h-[56px]" value={comment} onChange={(e) => setComment(e.target.value)} aria-label={t('teacher.selfTitle')} />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] tabular-nums">{total(opt.criteria) ?? '—'} / {opt.scaleMax}</span>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="g3-self-save">{t('teacher.selfSave')}</button>
          </div>
        </div>
      )}
      {!list.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('teacher.selfNone')}</p> : (
        <ul className="grid gap-2 lg:grid-cols-2">
          {list.map((g) => {
            const tt = teacherTotal(g.rubricId, g.milestone);
            return (
              <li key={g.id} className="rounded-[8px] border border-[var(--w-border)] p-3 text-[13px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium">{g.milestone} · {g.subjectUserId ? t('teacher.selfMe') : t('teacher.selfTeam')}</div>
                    <div className="text-[12px] text-[var(--w-text-2)]">{g.rubric.name}{g.grader ? ` · ${t('teacher.selfBy', { n: g.grader.displayName || g.grader.username })}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-semibold tabular-nums">{g.total ?? '—'}<span className="text-[12px] font-normal text-[var(--w-text-2)]"> / {g.rubric.scaleMax}</span></div>
                    {tt != null && <div className="text-[11.5px] text-[var(--w-text-2)]">{t('teacher.selfVsTeacher', { t: tt })}</div>}
                  </div>
                </div>
                {g.comment && <p className="mt-1 whitespace-pre-wrap text-[12.5px] text-[var(--w-text-2)]">{g.comment}</p>}
                {g.mine && <button type="button" className="mt-2 inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-red-text)]" disabled={del.isPending} onClick={() => del.mutate(g.id)}><Trash2 size={12} /> {t('teacher.selfDelete')}</button>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
