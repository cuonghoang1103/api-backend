'use client';

/**
 * "Create with CuongMini" — bước 2: "CuongMini đã hiểu gì". Mọi phần sửa tại chỗ; câu hỏi còn mở trả lời ngay dưới câu
 * hỏi (nổi bật lên đầu). Người dùng bấm Accept ở thanh dưới (SetupWizard) — bản đã sửa đi kèm.
 */

import type { ReactNode } from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { Understanding } from '@/lib/work-setup-api';
import { wt } from '@/components/work/i18n';
import { ListEditor } from './bits';

function Block({ title, children, tone }: { title: string; children: ReactNode; tone?: 'warn' }) {
  return (
    <section className={tone === 'warn' ? 'w-card border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-4' : 'w-card p-4'}>
      <h3 className="mb-2 text-[13.5px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export default function UnderstandingView({ u, onChange, disabled }: { u: Understanding; onChange: (u: Understanding) => void; disabled?: boolean }) {
  const set = <K extends keyof Understanding>(k: K, v: Understanding[K]) => onChange({ ...u, [k]: v });
  const open = u.questions.filter((q) => !q.answer.trim()).length;
  return (
    <div className="space-y-3">
      {u.questions.length > 0 && (
        <Block title={open ? wt('tcm.uQuestionsOpen', { n: open }) : wt('tcm.uQuestions')} tone={open ? 'warn' : undefined}>
          <ul className="space-y-2.5">
            {u.questions.map((q, i) => (
              <li key={i}>
                <p className="flex gap-1.5 text-[13px] font-medium"><HelpCircle size={14} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" /> {q.q}</p>
                <textarea className="w-input mt-1 text-[13px]" rows={1} value={q.answer} disabled={disabled} placeholder={wt('tcm.uAnswerPh')} aria-label={q.q}
                  onChange={(e) => set('questions', u.questions.map((x, k) => (k === i ? { ...x, answer: e.target.value } : x)))} />
              </li>
            ))}
          </ul>
        </Block>
      )}
      <Block title={wt('tcm.uGoal')}>
        <textarea className="w-input text-[13px]" rows={3} value={u.goal} disabled={disabled} aria-label={wt('tcm.uGoal')} onChange={(e) => set('goal', e.target.value)} />
      </Block>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Block title={wt('tcm.uScopeIn')}><ListEditor value={u.scopeIn} disabled={disabled} onChange={(v) => set('scopeIn', v)} /></Block>
        <Block title={wt('tcm.uScopeOut')}><ListEditor value={u.scopeOut} disabled={disabled} onChange={(v) => set('scopeOut', v)} /></Block>
      </div>
      <Block title={wt('tcm.uDeliverables')}>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[560px] text-[12.5px]">
            <thead className="text-left text-[11.5px] text-[var(--w-text-2)]"><tr><th className="py-1 pr-2 font-medium">{wt('tcm.uDeliverable')}</th><th className="w-[130px] py-1 pr-2 font-medium">{wt('tcm.uDue')}</th><th className="py-1 pr-2 font-medium">{wt('tcm.uCriteria')}</th><th className="w-8" /></tr></thead>
            <tbody>
              {u.deliverables.map((d0, i) => (
                <tr key={i} className="border-t border-[var(--w-border)]">
                  {(['name', 'due', 'criteria'] as const).map((k) => (
                    <td key={k} className="py-0.5 pr-1">
                      <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)]" value={d0[k]} disabled={disabled} aria-label={k}
                        onChange={(e) => set('deliverables', u.deliverables.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} />
                    </td>
                  ))}
                  <td><button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => set('deliverables', u.deliverables.filter((_, j) => j !== i))}><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="w-btn w-btn-sm mt-1.5" disabled={disabled} onClick={() => set('deliverables', [...u.deliverables, { name: '', due: '', criteria: '' }])}><Plus size={13} /> {wt('tcm.add')}</button>
        <div className="mt-3"><p className="mb-1 text-[12.5px] font-medium">{wt('tcm.uGrading')}</p><ListEditor value={u.grading} disabled={disabled} onChange={(v) => set('grading', v)} /></div>
      </Block>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Block title={wt('tcm.uStack')}><ListEditor value={u.tech.stack} disabled={disabled} onChange={(v) => set('tech', { ...u.tech, stack: v })} /></Block>
        <Block title={wt('tcm.uRepo')}><ListEditor value={u.tech.repoFindings} disabled={disabled} onChange={(v) => set('tech', { ...u.tech, repoFindings: v })} /></Block>
      </div>
      {u.team.length > 0 && (
        <Block title={wt('tcm.uTeam')}>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[600px] text-[12.5px]">
              <thead className="text-left text-[11.5px] text-[var(--w-text-2)]"><tr><th className="py-1 pr-2 font-medium">{wt('tcm.colName')}</th><th className="w-[160px] py-1 pr-2 font-medium">{wt('tcm.uRole')}</th><th className="py-1 font-medium">{wt('tcm.uWhy')}</th></tr></thead>
              <tbody>
                {u.team.map((m, i) => (
                  <tr key={i} className="border-t border-[var(--w-border)] align-top">
                    <td className="py-1.5 pr-2"><span className="font-medium">{m.name}</span>{m.studentId && <span className="block text-[11px] text-[var(--w-text-3)]">{m.studentId}{m.group ? ` · ${m.group}` : ''}</span>}</td>
                    <td className="py-0.5 pr-1">
                      <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)]" value={m.proposedRole} disabled={disabled} aria-label={wt('tcm.uRole')}
                        onChange={(e) => set('team', u.team.map((x, j) => (j === i ? { ...x, proposedRole: e.target.value } : x)))} />
                    </td>
                    <td className="py-0.5">
                      <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" value={m.why} disabled={disabled} aria-label={wt('tcm.uWhy')}
                        onChange={(e) => set('team', u.team.map((x, j) => (j === i ? { ...x, why: e.target.value } : x)))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      )}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Block title={wt('tcm.uTimeline')}><ListEditor value={u.timeline} disabled={disabled} onChange={(v) => set('timeline', v)} /></Block>
        <Block title={wt('tcm.uStrategy')}><ListEditor value={u.strategy} disabled={disabled} onChange={(v) => set('strategy', v)} /></Block>
        <Block title={wt('tcm.uAssumptions')}><ListEditor value={u.assumptions} disabled={disabled} onChange={(v) => set('assumptions', v)} /></Block>
        <Block title={wt('tcm.uRisks')}><ListEditor value={u.risks} disabled={disabled} onChange={(v) => set('risks', v)} /></Block>
      </div>
      <Block title={wt('tcm.uNotes')}>
        <textarea className="w-input text-[13px]" rows={3} value={u.notes} disabled={disabled} placeholder={wt('tcm.uNotesPh')} aria-label={wt('tcm.uNotes')} onChange={(e) => set('notes', e.target.value)} />
      </Block>
    </div>
  );
}
