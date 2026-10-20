'use client';

/** "Create with CuongMini" — tiến độ job (đọc, lập kế hoạch, tạo). Tải lại trang vẫn thấy (máy chủ giữ tiến độ). */

import { Check, CircleDashed, Loader2, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgressStep, SetupDraft } from '@/lib/work-setup-api';
import { wt } from '@/components/work/i18n';

export function stepLabel(key: string): string {
  const [head, , sub] = key.split(':');
  switch (head) {
    case 'read': return wt('tcm.stRead');
    case 'understand': return wt('tcm.stUnderstand');
    case 'prepare': return wt('tcm.stPrepare');
    case 'outline': return wt('tcm.stOutline');
    case 'epics': return wt('tcm.stEpics');
    case 'tests': return wt('tcm.stTests');
    case 'pages': return wt('tcm.stPages');
    case 'assemble': return wt('tcm.stAssemble');
    case 'revise': return wt('tcm.stRevise');
    case 'create': return wt('tcm.stCreate');
    case 'project': return wt('tcm.stProject');
    case 'invites': return wt('tcm.stInvites');
    default: return sub ? `${head} ${sub}` : head;
  }
}

export default function ProgressView({ draft, onCancel, cancelling }: { draft: SetupDraft; onCancel: () => void; cancelling: boolean }) {
  const steps: ProgressStep[] = draft.progress ?? [];
  const title = draft.status === 'READING' ? wt('tcm.progReading') : draft.status === 'APPLYING' ? wt('tcm.progApplying') : wt('tcm.progPlanning');
  return (
    <div className="w-card mx-auto max-w-[640px] p-5">
      <div className="mb-1 flex items-center gap-2">
        <Loader2 size={16} className="animate-spin text-[var(--w-accent-text)]" />
        <h2 className="text-[15px] font-semibold">{title}</h2>
      </div>
      <p className="mb-4 text-[12.5px] text-[var(--w-text-2)]">{wt('tcm.progLeave')}</p>
      <ol className="space-y-1.5" aria-live="polite">
        {steps.length === 0 && <li className="flex items-center gap-2 text-[13px] text-[var(--w-text-2)]"><CircleDashed size={14} /> {wt('tcm.progStarting')}</li>}
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-2 text-[13px]">
            <span className={cn('mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center', s.status === 'done' ? 'text-[var(--w-green)]' : s.status === 'error' ? 'text-[var(--w-red)]' : 'text-[var(--w-accent-text)]')}>
              {s.status === 'done' ? <Check size={14} /> : s.status === 'error' ? <X size={14} /> : <Loader2 size={13} className="animate-spin" />}
            </span>
            <span className="min-w-0">
              <span className={cn(s.status === 'done' && 'text-[var(--w-text-2)]')}>{stepLabel(s.key)}</span>
              {s.detail && <span className="ml-1.5 text-[12px] text-[var(--w-text-3)] [overflow-wrap:anywhere]">{s.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-[var(--w-border)] pt-3">
        <span className="text-[11.5px] text-[var(--w-text-3)]">{draft.status === 'APPLYING' ? wt('tcm.progApplyNote') : wt('tcm.progCallsNote', { n: draft.usage.calls })}</span>
        <button type="button" className="w-btn w-btn-sm" disabled={cancelling} onClick={onCancel}><Square size={12} /> {wt('tcm.cancelJob')}</button>
      </div>
    </div>
  );
}
