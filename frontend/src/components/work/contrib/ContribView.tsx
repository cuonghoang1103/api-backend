'use client';

/**
 * CTW Đóng góp — tab "Contributions" của Reports (thay bảng cũ). Bốn chế độ xem trong cùng một trang, đều nằm trong URL:
 *   Team (bảng + biểu đồ) · Member (chi tiết một người) · By task (ai đã làm gì trên một thẻ) · Peer review (đánh giá chéo).
 * Thanh công cụ: khoảng thời gian (hôm nay / 7 / 30 ngày / tuần này / sprint / giai đoạn / cả dự án / tuỳ chọn) + so kỳ trước,
 * xuất Excel/PDF (người thấy từng thành viên), cài đặt (ADMIN).
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, FileText, Settings2 } from 'lucide-react';
import { workApi, workError, workStudioApi, workStudioKeys, type ProjectConfig } from '@/lib/work-api';
import { contribKeys, workContribApi, type ContribRange, type RangePreset } from '@/lib/work-contrib-api';
import { saveBlob } from '@/components/work/tests/fpt/fptApi';
import { wk } from '@/components/work/hooks';
import { studioOn } from '@/components/work/studio/shared';
import { cn } from '@/lib/utils';
import { useContribUrl, type ContribSub } from './shared';
import TeamView from './TeamView';
import MemberView from './MemberView';
import TaskView from './TaskView';
import PeerView from './PeerView';
import SettingsDialog from './SettingsDialog';

const PRESET_LABEL: Record<RangePreset, string> = {
  today: 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', week: 'This week', sprint: 'Sprint…', stage: 'Stage…', project: 'Whole project', custom: 'Custom dates…',
};
const SUBS: Array<{ id: ContribSub; label: string }> = [
  { id: 'team', label: 'Team' }, { id: 'member', label: 'Member' }, { id: 'task', label: 'By task' }, { id: 'peer', label: 'Peer review' },
];

export default function ContribView({ pid, config }: { pid: number; config: ProjectConfig }) {
  const url = useContribUrl();
  const { range, sub } = url;
  const [busy, setBusy] = useState<'xlsx' | 'pdf' | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const stagesOn = studioOn(config, 'stages');
  const sprintsQ = useQuery({ queryKey: [...wk.sprints(pid), 'all'], queryFn: () => workApi.sprints(pid, true) });
  const stagesQ = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: stagesOn });
  // Quyền + cài đặt đi kèm bản tóm tắt (cùng khoá với TeamView ⇒ một lần gọi).
  const summaryQ = useQuery({
    queryKey: contribKeys.summary(pid, range),
    queryFn: () => workContribApi.summary(pid, range),
    enabled: range.preset !== 'sprint' || !!range.sprintId,
  });
  const access = summaryQ.data?.access;
  const sprints = (sprintsQ.data ?? []).filter((s) => s.startAt).sort((a, b) => new Date(b.startAt!).getTime() - new Date(a.startAt!).getTime());
  const stages = (stagesQ.data ?? []).filter((s) => s.startedAt);

  const setRange = (r: Partial<ContribRange>) => {
    const next = { ...range, ...r };
    url.set({
      rp: next.preset === '30d' ? null : next.preset,
      rf: next.preset === 'custom' ? next.from : null, rt: next.preset === 'custom' ? next.to : null,
      rs: next.preset === 'sprint' ? next.sprintId : null, rg: next.preset === 'stage' ? next.stageId : null,
      rc: next.compare === false ? 0 : null,
    });
  };
  const onPreset = (p: RangePreset) => {
    if (p === 'sprint') setRange({ preset: p, sprintId: range.sprintId ?? sprints.find((s) => s.state === 'ACTIVE')?.id ?? sprints[0]?.id });
    else if (p === 'stage') setRange({ preset: p, stageId: range.stageId ?? stages.find((s) => s.status === 'ACTIVE')?.id ?? stages[0]?.id });
    else if (p === 'custom') {
      const to = new Date().toISOString().slice(0, 10);
      setRange({ preset: p, from: range.from ?? new Date(Date.now() - 13 * 86_400_000).toISOString().slice(0, 10), to: range.to ?? to });
    } else setRange({ preset: p });
  };

  const exportFile = async (kind: 'xlsx' | 'pdf') => {
    setBusy(kind);
    try {
      const f = kind === 'xlsx' ? await workContribApi.exportXlsx(pid, range) : await workContribApi.exportPdf(pid, range);
      saveBlob(f.blob, f.fileName);
    } catch (err) {
      toast.error(workError(err, 'Could not export the report'));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3" data-testid="contrib-view">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-0.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-0.5" role="tablist" aria-label="Contribution views">
          {SUBS.map((s) => (
            <button key={s.id} type="button" role="tab" aria-selected={sub === s.id}
              onClick={() => url.set({ cv: s.id === 'team' ? null : s.id })}
              className={cn('rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors', sub === s.id ? 'bg-[var(--w-raised)] text-[var(--w-text)] shadow-[var(--w-shadow-card)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {s.label}
            </button>
          ))}
        </div>

        {sub !== 'task' && sub !== 'peer' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <select aria-label="Time range" value={range.preset} onChange={(e) => onPreset(e.target.value as RangePreset)} className="w-input h-[28px] w-auto py-0 pr-7 text-[12px]">
              {(Object.keys(PRESET_LABEL) as RangePreset[]).filter((p) => p !== 'stage' || stagesOn).map((p) => <option key={p} value={p}>{PRESET_LABEL[p]}</option>)}
            </select>
            {range.preset === 'sprint' && (
              <select aria-label="Sprint" value={range.sprintId ?? ''} onChange={(e) => setRange({ sprintId: Number(e.target.value) })} className="w-input h-[28px] w-auto py-0 pr-7 text-[12px]">
                {!sprints.length && <option value="">No started sprints</option>}
                {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}{s.state === 'ACTIVE' ? ' (active)' : ''}</option>)}
              </select>
            )}
            {range.preset === 'stage' && (
              <select aria-label="Stage" value={range.stageId ?? ''} onChange={(e) => setRange({ stageId: Number(e.target.value) })} className="w-input h-[28px] w-auto py-0 pr-7 text-[12px]">
                {!stages.length && <option value="">No started stages</option>}
                {stages.map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}
              </select>
            )}
            {range.preset === 'custom' && (
              <>
                <input type="date" aria-label="From" value={range.from ?? ''} max={range.to} onChange={(e) => setRange({ from: e.target.value })} className="w-input h-[28px] w-[136px] py-0 text-[12px]" />
                <span className="text-[12px] text-[var(--w-text-3)]" aria-hidden="true">→</span>
                <input type="date" aria-label="To" value={range.to ?? ''} min={range.from} onChange={(e) => setRange({ to: e.target.value })} className="w-input h-[28px] w-[136px] py-0 text-[12px]" />
              </>
            )}
            {range.preset !== 'project' && (
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-[var(--w-text-2)]">
                <input type="checkbox" checked={range.compare !== false} onChange={(e) => setRange({ compare: e.target.checked })} />
                Compare with previous
              </label>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {access?.export && (
            <>
              <button type="button" className="w-btn w-btn-sm" onClick={() => void exportFile('xlsx')} disabled={busy !== null} data-testid="contrib-export-xlsx">
                <Download size={12} /> {busy === 'xlsx' ? 'Exporting…' : 'Excel'}
              </button>
              <button type="button" className="w-btn w-btn-sm" onClick={() => void exportFile('pdf')} disabled={busy !== null} title="One-page summary for the teacher">
                <FileText size={12} /> {busy === 'pdf' ? 'Exporting…' : 'PDF summary'}
              </button>
            </>
          )}
          {access?.manage && (
            <button type="button" className="w-btn w-btn-sm w-btn-icon" aria-label="Contribution settings" title="Contribution settings" onClick={() => setSettingsOpen(true)}>
              <Settings2 size={13} />
            </button>
          )}
        </div>
      </div>

      {sub === 'team' && <TeamView pid={pid} config={config} q={summaryQ} onOpenMember={(id) => url.set({ cv: 'member', cm: id })} />}
      {sub === 'member' && <MemberView pid={pid} config={config} range={range} memberId={url.memberId} summary={summaryQ.data} onPick={(id) => url.set({ cm: id })} onOpenTask={(n) => url.set({ cv: 'task', ci: n })} />}
      {sub === 'task' && <TaskView pid={pid} config={config} num={url.issueNum} onPick={(n) => url.set({ ci: n })} onOpenMember={(id) => url.set({ cv: 'member', cm: id })} />}
      {sub === 'peer' && <PeerView pid={pid} sprints={sprints} stages={stages} roundId={url.roundId} onRound={(id) => url.set({ cr: id })} />}

      {access?.manage && summaryQ.data && (
        <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} pid={pid} settings={summaryQ.data.settings} />
      )}
    </div>
  );
}
