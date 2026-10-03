'use client';

/**
 * Luật của MỘT mũi tên trong quy trình (lớp studio S1 — WorkTransition.rules):
 *   · requireApproval — thẻ phải có yêu cầu phê duyệt ĐÃ DUYỆT mới đi được
 *     (mô-đun approvals; ADMIN cũng không vượt);
 *   · teamIds — chỉ thành viên các bộ phận này mới chuyển được (mô-đun teams;
 *     ADMIN dự án vượt được).
 * Server kiểm ở issueChange.ts; ở đây chỉ sửa bản nháp (lưu cùng nút Save
 * transitions). Mô-đun tắt ⇒ không vẽ gì.
 */

import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import { PickerList, Popover, useToggle } from '../ui';
import { TeamChip, studioOn, useWorkspaceTeams } from '../studio/shared';
import type { TransitionDraft } from './useTransitionDraft';

export function rulesAvailable(config: ProjectConfig): boolean {
  return studioOn(config, 'approvals') || studioOn(config, 'teams');
}

export default function TransitionRulesFields({ config, draft, edgeKey, canEdit }: { config: ProjectConfig; draft: TransitionDraft; edgeKey: string; canEdit: boolean }) {
  const approvalsOn = studioOn(config, 'approvals');
  const teamsOn = studioOn(config, 'teams');
  const teams = useWorkspaceTeams(config.workspace.id, teamsOn);
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  if (!approvalsOn && !teamsOn) return null;
  const r = draft.rules.get(edgeKey) ?? {};
  const restricted = draft.mode === 'restricted';
  const set = (patch: Partial<typeof r>) => draft.setRule(edgeKey, { ...r, ...patch });
  const picked = (teams.data ?? []).filter((t) => r.teamIds?.includes(t.id));

  return (
    <div className="space-y-2.5">
      {!restricted && <p className="text-[12px] text-[var(--w-text-3)]">Rules apply once the workflow only allows the moves you choose.</p>}
      {approvalsOn && (
        <label className={`flex items-start gap-2 text-[13px] ${canEdit && restricted ? 'cursor-pointer' : ''}`}>
          <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={!!r.requireApproval} disabled={!canEdit || !restricted} onChange={(e) => set({ requireApproval: e.target.checked })} />
          <span>
            Require an approved approval
            <span className="block text-[12px] text-[var(--w-text-3)]">The issue needs an approval request that was approved. Admins cannot skip this.</span>
          </span>
        </label>
      )}
      {teamsOn && (
        <div>
          <div className="mb-1 text-[13px]">Only these teams can make this move</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {picked.map((t) => <TeamChip key={t.id} team={t} full />)}
            {!picked.length && <span className="text-[12px] text-[var(--w-text-3)]">Anyone who can move issues</span>}
            {canEdit && restricted && (
              <>
                <button ref={ref} type="button" className="w-btn w-btn-sm" onClick={pop.toggle} aria-haspopup="listbox" aria-expanded={pop.on}>
                  Teams <ChevronDown size={12} className="opacity-60" />
                </button>
                <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={240}>
                  <PickerList
                    multi
                    options={(teams.data ?? []).filter((t) => !t.archivedAt).map((t) => ({ value: t.id, label: t.name, hint: t.key, keywords: t.key, icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> }))}
                    selected={r.teamIds ?? []}
                    onPick={(id) => set({ teamIds: r.teamIds?.includes(id) ? r.teamIds.filter((x) => x !== id) : [...(r.teamIds ?? []), id] })}
                    placeholder="Find a team…"
                    empty="No teams in this workspace yet"
                  />
                </Popover>
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">Project admins can still make the move.</p>
        </div>
      )}
    </div>
  );
}

/** Tóm tắt luật cho một dòng danh sách ("Approval · BA, QA"). */
export function rulesSummary(config: ProjectConfig, draft: TransitionDraft, key: string, teamKeys: Map<number, string>): string {
  const r = draft.rules.get(key);
  if (!r) return '';
  const parts: string[] = [];
  if (r.requireApproval && studioOn(config, 'approvals')) parts.push('Needs approval');
  if (r.teamIds?.length && studioOn(config, 'teams')) parts.push(`Only ${r.teamIds.map((id) => teamKeys.get(id) ?? '?').join(', ')}`);
  return parts.join(' · ');
}
