'use client';

/**
 * Luật của MỘT mũi tên trong quy trình (lớp studio S1 — WorkTransition.rules):
 *   · requireApproval — thẻ phải có yêu cầu phê duyệt ĐÃ DUYỆT mới đi được
 *     (mô-đun approvals; ADMIN cũng không vượt);
 *   · notAssignee — người đang được giao thẻ không tự chuyển được (không tự duyệt
 *     việc của mình; luôn có, không cần mô-đun — 26/11/2026);
 *   · teamIds — chỉ thành viên các bộ phận này mới chuyển được (mô-đun teams;
 *     ADMIN dự án vượt được);
 *   · requireComment — bình luận xác nhận của bộ phận X (hoặc ai khác người được giao) SAU khi
 *     vào trạng thái nguồn; minHoursInFrom — làm nguội N giờ (dm5 G1 · A6, luôn có, không cần mô-đun).
 * Server kiểm ở issueChange.ts; ở đây chỉ sửa bản nháp (lưu cùng nút Save
 * transitions). Mô-đun tắt ⇒ không vẽ gì.
 */

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { PickerList, Popover, useToggle } from '../ui';
import { TeamChip, studioOn, useWorkspaceTeams } from '../studio/shared';
import type { TransitionDraft } from './useTransitionDraft';
import { wt } from '@/components/work/i18n';

// notAssignee không cần mô-đun nào ⇒ luôn có ít nhất một luật để đặt.
export function rulesAvailable(_config: ProjectConfig): boolean {
  return true;
}

export default function TransitionRulesFields({ config, draft, edgeKey, canEdit }: { config: ProjectConfig; draft: TransitionDraft; edgeKey: string; canEdit: boolean }) {
  const approvalsOn = studioOn(config, 'approvals');
  const teamsOn = studioOn(config, 'teams');
  const teams = useWorkspaceTeams(config.workspace.id, teamsOn);
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const r = draft.rules.get(edgeKey) ?? {};
  const restricted = draft.mode === 'restricted';
  const set = (patch: Partial<typeof r>) => draft.setRule(edgeKey, { ...r, ...patch });
  const picked = (teams.data ?? []).filter((t) => r.teamIds?.includes(t.id));
  // dm5 G1 (A6)
  const cpop = useToggle();
  const cref = useRef<HTMLButtonElement>(null);
  const commentTeams = (teams.data ?? []).filter((t) => r.requireComment?.teamIds.includes(t.id));
  const [hours, setHours] = useState<string>(r.minHoursInFrom ? String(r.minHoursInFrom) : '');
  // Đổi mũi tên đang sửa ⇒ nạp lại ô số giờ của mũi tên đó.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setHours(r.minHoursInFrom ? String(r.minHoursInFrom) : ''); }, [edgeKey]);

  return (
    <div className="space-y-2.5">
      {!restricted && <p className="text-[12px] text-[var(--w-text-3)]">{wt('wf.rulesApply')}</p>}
      <label className={`flex items-start gap-2 text-[13px] ${canEdit && restricted ? 'cursor-pointer' : ''}`}>
        <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={!!r.notAssignee} disabled={!canEdit || !restricted} onChange={(e) => set({ notAssignee: e.target.checked })} />
        <span>
          {wt('wf.notAssignee')}
          <span className="block text-[12px] text-[var(--w-text-3)]">{wt('wf.notAssigneeDesc')}</span>
        </span>
      </label>
      {approvalsOn && (
        <label className={`flex items-start gap-2 text-[13px] ${canEdit && restricted ? 'cursor-pointer' : ''}`}>
          <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={!!r.requireApproval} disabled={!canEdit || !restricted} onChange={(e) => set({ requireApproval: e.target.checked })} />
          <span>
            {wt('wf.requireApproval')}
            <span className="block text-[12px] text-[var(--w-text-3)]">{wt('wf.requireApprovalDesc')}</span>
          </span>
        </label>
      )}
      {teamsOn && (
        <div>
          <div className="mb-1 text-[13px]">{wt('wf.onlyTeams')}</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {picked.map((t) => <TeamChip key={t.id} team={t} full />)}
            {!picked.length && <span className="text-[12px] text-[var(--w-text-3)]">{wt('wf.anyoneMove')}</span>}
            {canEdit && restricted && (
              <>
                <button ref={ref} type="button" className="w-btn w-btn-sm" onClick={pop.toggle} aria-haspopup="listbox" aria-expanded={pop.on}>
                  {wt('wf.teams')} <ChevronDown size={12} className="opacity-60" />
                </button>
                <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={240}>
                  <PickerList
                    multi
                    options={(teams.data ?? []).filter((t) => !t.archivedAt).map((t) => ({ value: t.id, label: t.name, hint: t.key, keywords: t.key, icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> }))}
                    selected={r.teamIds ?? []}
                    onPick={(id) => set({ teamIds: r.teamIds?.includes(id) ? r.teamIds.filter((x) => x !== id) : [...(r.teamIds ?? []), id] })}
                    placeholder={wt('wf.findTeam')}
                    empty={wt('wf.noTeams')}
                  />
                </Popover>
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('wf.adminsStill')}</p>
        </div>
      )}
      {/* dm5 G1 (A6): bình luận xác nhận của bộ phận + làm nguội */}
      <div>
        <label className={`flex items-start gap-2 text-[13px] ${canEdit && restricted ? 'cursor-pointer' : ''}`}>
          <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={!!r.requireComment} disabled={!canEdit || !restricted}
            onChange={(e) => set({ requireComment: e.target.checked ? { teamIds: r.requireComment?.teamIds ?? [] } : undefined })} />
          <span>
            {wt('wf.requireComment')}
            <span className="block text-[12px] text-[var(--w-text-3)]">{wt('wf.requireCommentDesc')}</span>
          </span>
        </label>
        {r.requireComment && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
            <span className="text-[12px] text-[var(--w-text-2)]">{wt('wf.commentFrom')}</span>
            {commentTeams.map((t) => <TeamChip key={t.id} team={t} full />)}
            {!commentTeams.length && <span className="text-[12px] text-[var(--w-text-3)]">{wt('wf.commentAnyone')}</span>}
            {teamsOn && canEdit && restricted && (
              <>
                <button ref={cref} type="button" className="w-btn w-btn-sm" onClick={cpop.toggle} aria-haspopup="listbox" aria-expanded={cpop.on}>
                  {wt('wf.teams')} <ChevronDown size={12} className="opacity-60" />
                </button>
                <Popover open={cpop.on} onClose={cpop.close} anchorRef={cref} width={240}>
                  <PickerList
                    multi
                    options={(teams.data ?? []).filter((t) => !t.archivedAt).map((t) => ({ value: t.id, label: t.name, hint: t.key, keywords: t.key, icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> }))}
                    selected={r.requireComment.teamIds}
                    onPick={(id) => {
                      const cur = r.requireComment?.teamIds ?? [];
                      set({ requireComment: { teamIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } });
                    }}
                    placeholder={wt('wf.findTeam')}
                    empty={wt('wf.noTeams')}
                  />
                </Popover>
              </>
            )}
          </div>
        )}
      </div>
      <div>
        <label className="block text-[13px]" htmlFor={`cool-${edgeKey}`}>{wt('wf.coolOff')}</label>
        <input
          id={`cool-${edgeKey}`} type="number" min={0} max={720} step={1} inputMode="numeric"
          className="w-input mt-1 h-8 w-[120px] text-[13px]" value={hours} disabled={!canEdit || !restricted}
          onChange={(e) => {
            setHours(e.target.value);
            const n = Number(e.target.value);
            set({ minHoursInFrom: Number.isFinite(n) && n > 0 ? n : undefined });
          }}
        />
        <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('wf.coolOffDesc')}</p>
      </div>
    </div>
  );
}

/** Tóm tắt luật cho một dòng danh sách ("Approval · BA, QA"). */
export function rulesSummary(config: ProjectConfig, draft: TransitionDraft, key: string, teamKeys: Map<number, string>): string {
  const r = draft.rules.get(key);
  if (!r) return '';
  const parts: string[] = [];
  if (r.notAssignee) parts.push(wt('wf.byOthers'));
  if (r.requireApproval && studioOn(config, 'approvals')) parts.push(wt('wf.needsApproval'));
  if (r.teamIds?.length && studioOn(config, 'teams')) parts.push(wt('wf.onlyX', { x: r.teamIds.map((id) => teamKeys.get(id) ?? '?').join(', ') }));
  if (r.requireComment) parts.push(r.requireComment.teamIds.length ? `${wt('wf.needsComment')} (${r.requireComment.teamIds.map((id) => teamKeys.get(id) ?? '?').join(', ')})` : wt('wf.needsComment'));
  if (r.minHoursInFrom) parts.push(wt('wf.coolOffN', { n: r.minHoursInFrom }));
  return parts.join(' · ');
}
