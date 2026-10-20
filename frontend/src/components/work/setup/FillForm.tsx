'use client';

/**
 * "Create with CuongMini" — bước 1: điền + tải lên. Mọi mục đều tuỳ chọn (cần ít nhất tên hoặc đề bài). Mỗi mục có
 * "vì sao hỏi" + ví dụ. Chế độ không gian thêm mục H (danh sách nhóm). Lưu tự động (cha lo việc lưu).
 */

import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectTemplate } from '@/lib/work-api';
import type { AssignRule, DetailLevel, SetupDraft, SetupInput } from '@/lib/work-setup-api';
import { Field } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import { wt, type WKey } from '@/components/work/i18n';
import { TEMPLATES, deriveKey } from '../workspace/CreateProjectDialog';
import { Check2, Grid2, ListEditor, Section } from './bits';
import RosterEditor from './RosterEditor';
import SourcesBox from './SourcesBox';

const DOC_ACCEPT = '.pdf,.docx,.xlsx,.pptx,.md,.txt,.csv,.json,.png,.jpg,.jpeg,.webp';
const CODE_ACCEPT = '.zip,.sql,.json,.md,.txt,.java,.ts,.js,.py,.cs,.xml,.yml,.yaml';
const SAMPLE_ACCEPT = '.sql,.csv,.json,.xlsx,.pdf,.docx,.md,.txt,.zip,.png,.jpg,.jpeg';
const RULES: AssignRule[] = ['BY_LEVEL', 'EQUAL_LOAD', 'MODULE_OWNER', 'LEADER_REVIEWS'];
const DAYS = [1, 2, 3, 4, 5, 6, 0];

export const SECTIONS = ['overview', 'brief', 'team', 'timeline', 'code', 'samples', 'split', 'groups'] as const;
export type SectionId = (typeof SECTIONS)[number];

export default function FillForm({ draft, input, setInput, onDraft, wsId, disabled }: {
  draft: SetupDraft; input: SetupInput; setInput: (f: (x: SetupInput) => SetupInput) => void; onDraft: (d: SetupDraft) => void; wsId: number; disabled?: boolean;
}) {
  const ws = draft.mode === 'WORKSPACE';
  const o = input.overview;
  const up = <K extends keyof SetupInput>(k: K, patch: Partial<SetupInput[K]>) => setInput((x) => ({ ...x, [k]: { ...(x[k] as object), ...patch } }));
  const letters = ws ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="space-y-4">
      <Section id="overview" letter={letters[0]} title={wt('tcm.secOverview')} why={wt('tcm.whyOverview')} example={wt('tcm.exOverview')}>
        <Grid2 className="sm:grid-cols-[1fr_140px]">
          <Field label={ws ? wt('tcm.wsPlanName') : wt('tcm.projectName')}>
            <input className="w-input" value={o.name} maxLength={120} disabled={disabled} placeholder={wt('tcm.projectNamePh')}
              onChange={(e) => up('overview', { name: e.target.value, ...(o.key && o.key !== deriveKey(o.name) ? {} : { key: deriveKey(e.target.value) }) })} />
          </Field>
          {!ws && (
            <Field label={wt('tcm.key')}>
              <input className="w-input font-mono uppercase" value={o.key} maxLength={10} disabled={disabled} spellCheck={false}
                onChange={(e) => up('overview', { key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) })} />
            </Field>
          )}
        </Grid2>
        <Grid2>
          <Field label={wt('tcm.template')}>
            <Select value={o.template} disabled={disabled} onChange={(e) => up('overview', { template: e.target.value as ProjectTemplate })}>
              {TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label={wt('tcm.boardType')}>
            <Select value={o.type} disabled={disabled} onChange={(e) => up('overview', { type: e.target.value as 'SCRUM' | 'KANBAN' })}>
              <option value="SCRUM">Scrum</option>
              <option value="KANBAN">Kanban</option>
            </Select>
          </Field>
        </Grid2>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
          <Field label={wt('tcm.courseCode')}><input className="w-input" value={o.courseCode} disabled={disabled} placeholder="SWP391" onChange={(e) => up('overview', { courseCode: e.target.value })} /></Field>
          <Field label={wt('tcm.className')}><input className="w-input" value={o.className} disabled={disabled} placeholder="SE1801" onChange={(e) => up('overview', { className: e.target.value })} /></Field>
          <Field label={wt('tcm.semester')}><input className="w-input" value={o.semester} disabled={disabled} placeholder="Fall 2026" onChange={(e) => up('overview', { semester: e.target.value })} /></Field>
        </div>
        <Grid2>
          <Field label={wt('tcm.stakeholders')}><input className="w-input" value={o.stakeholders} disabled={disabled} placeholder={wt('tcm.stakeholdersPh')} onChange={(e) => up('overview', { stakeholders: e.target.value })} /></Field>
          <Field label={wt('tcm.language')}>
            <Select value={o.language} disabled={disabled} onChange={(e) => up('overview', { language: e.target.value as 'vi' | 'en' | 'both' })}>
              <option value="vi">{wt('tcm.langVi')}</option>
              <option value="en">{wt('tcm.langEn')}</option>
              <option value="both">{wt('tcm.langBoth')}</option>
            </Select>
          </Field>
        </Grid2>
        <Field label={wt('tcm.goal')}>
          <textarea className="w-input" rows={2} value={o.goal} maxLength={4000} disabled={disabled} placeholder={wt('tcm.goalPh')} onChange={(e) => up('overview', { goal: e.target.value })} />
        </Field>
      </Section>

      <Section id="brief" letter={letters[1]} title={wt('tcm.secBrief')} why={wt('tcm.whyBrief')} example={wt('tcm.exBrief')}>
        <SourcesBox draft={draft} category="BRIEF" accept={DOC_ACCEPT} onDraft={onDraft} disabled={disabled} linkPlaceholder={wt('tcm.briefLinkPh')} />
        <div className="mt-3">
          <Field label={wt('tcm.briefText')}>
            <textarea className="w-input" rows={4} value={input.brief.text} disabled={disabled} placeholder={wt('tcm.briefTextPh')} onChange={(e) => up('brief', { text: e.target.value })} />
          </Field>
          <Grid2>
            <Field label={wt('tcm.functional')}><textarea className="w-input" rows={3} value={input.brief.functional} disabled={disabled} onChange={(e) => up('brief', { functional: e.target.value })} /></Field>
            <Field label={wt('tcm.nonFunctional')}><textarea className="w-input" rows={3} value={input.brief.nonFunctional} disabled={disabled} onChange={(e) => up('brief', { nonFunctional: e.target.value })} /></Field>
          </Grid2>
          <Field label={wt('tcm.rubric')}><textarea className="w-input" rows={2} value={input.brief.rubric} disabled={disabled} placeholder={wt('tcm.rubricPh')} onChange={(e) => up('brief', { rubric: e.target.value })} /></Field>
          <Field label={wt('tcm.deliverables')} hint={wt('tcm.deliverablesHint')}>
            <ListEditor value={input.brief.deliverables} disabled={disabled} placeholder={wt('tcm.deliverablePh')} onChange={(v) => up('brief', { deliverables: v })} />
          </Field>
        </div>
        <div className="mt-3">
          <p className="mb-1.5 text-[12.5px] font-medium">{wt('tcm.templatesTitle')}</p>
          <SourcesBox draft={draft} category="TEMPLATE" accept={DOC_ACCEPT} onDraft={onDraft} disabled={disabled} notePlaceholder={wt('tcm.templateNotePh')} />
        </div>
      </Section>

      <Section id="team" letter={letters[2]} title={wt('tcm.secTeam')} why={wt('tcm.whyTeam')} example={ws ? wt('tcm.exTeamWs') : wt('tcm.exTeam')}>
        <RosterEditor wsId={wsId} rows={input.team.members} showGroup={ws} disabled={disabled} onChange={(rows) => up('team', { members: rows })} />
        <p className="mb-1 mt-4 text-[12.5px] font-medium">{wt('tcm.rulesTitle')}</p>
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {RULES.map((r) => (
            <Check2 key={r} checked={input.team.rules.includes(r)} disabled={disabled} label={wt(`tcm.rule_${r}` as const)} hint={wt(`tcm.ruleHint_${r}` as const)}
              onChange={(v) => up('team', { rules: v ? [...input.team.rules, r] : input.team.rules.filter((x) => x !== r) })} />
          ))}
        </div>
        <Field label={wt('tcm.rulesText')}>
          <textarea className="w-input" rows={2} value={input.team.rulesText} disabled={disabled} placeholder={wt('tcm.rulesTextPh')} onChange={(e) => up('team', { rulesText: e.target.value })} />
        </Field>
        <Check2 checked={input.team.sendInvites} disabled={disabled} label={wt('tcm.sendInvites')} hint={wt('tcm.sendInvitesHint')} onChange={(v) => up('team', { sendInvites: v })} />
      </Section>

      <Section id="timeline" letter={letters[3]} title={wt('tcm.secTimeline')} why={wt('tcm.whyTimeline')} example={wt('tcm.exTimeline')}>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
          <Field label={wt('tcm.startDate')}><input type="date" className="w-input" value={input.timeline.startDate} disabled={disabled} onChange={(e) => up('timeline', { startDate: e.target.value })} /></Field>
          <Field label={wt('tcm.endDate')}><input type="date" className="w-input" value={input.timeline.endDate} disabled={disabled} onChange={(e) => up('timeline', { endDate: e.target.value })} /></Field>
          <Field label={wt('tcm.sprintLength')}>
            <Select value={input.timeline.sprintWeeks} disabled={disabled || o.type === 'KANBAN'} onChange={(e) => up('timeline', { sprintWeeks: Number(e.target.value) })}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{wt('tcm.weeks', { n })}</option>)}
            </Select>
          </Field>
        </div>
        <DatedList title={wt('tcm.milestones')} hint={wt('tcm.milestonesHint')} rows={input.timeline.milestones.map((m) => ({ name: m.name, a: m.date }))} disabled={disabled}
          onChange={(rows) => up('timeline', { milestones: rows.map((r) => ({ name: r.name, date: r.a })) })} />
        <DatedList title={wt('tcm.avoid')} hint={wt('tcm.avoidHint')} range rows={input.timeline.avoid.map((m) => ({ name: m.name, a: m.from, b: m.to }))} disabled={disabled}
          onChange={(rows) => up('timeline', { avoid: rows.map((r) => ({ name: r.name, from: r.a, to: r.b || r.a })) })} />
        <p className="mb-1 mt-3 text-[12.5px] font-medium">{wt('tcm.workingDays')}</p>
        <div className="flex flex-wrap gap-1">
          {DAYS.map((dnum) => {
            const on = input.timeline.workingDays.includes(dnum);
            return (
              <button key={dnum} type="button" disabled={disabled} aria-pressed={on}
                className={cn('h-8 min-w-[44px] rounded-[6px] border px-2 text-[12px] font-medium', on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
                onClick={() => up('timeline', { workingDays: on ? input.timeline.workingDays.filter((x) => x !== dnum) : [...input.timeline.workingDays, dnum] })}>
                {wt(`tcm.day${dnum}` as WKey)}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-x-3 sm:grid-cols-3">
          <Field label={wt('tcm.meetingDay')}>
            <Select value={input.timeline.meeting?.weekday ?? ''} disabled={disabled}
              onChange={(e) => up('timeline', { meeting: e.target.value === '' ? null : { weekday: Number(e.target.value), time: input.timeline.meeting?.time ?? '20:00', durationMin: input.timeline.meeting?.durationMin ?? 45 } })}>
              <option value="">{wt('tcm.meetingAuto')}</option>
              {DAYS.map((dnum) => <option key={dnum} value={dnum}>{wt(`tcm.dayLong${dnum}` as WKey)}</option>)}
            </Select>
          </Field>
          <Field label={wt('tcm.meetingTime')}>
            <input type="time" className="w-input" disabled={disabled || !input.timeline.meeting} value={input.timeline.meeting?.time ?? '20:00'}
              onChange={(e) => input.timeline.meeting && up('timeline', { meeting: { ...input.timeline.meeting, time: e.target.value || '20:00' } })} />
          </Field>
          <Field label={wt('tcm.meetingMinutes')}>
            <input type="number" min={10} max={240} className="w-input" disabled={disabled || !input.timeline.meeting} value={input.timeline.meeting?.durationMin ?? 45}
              onChange={(e) => input.timeline.meeting && up('timeline', { meeting: { ...input.timeline.meeting, durationMin: Math.max(10, Math.min(240, Number(e.target.value) || 45)) } })} />
          </Field>
        </div>
      </Section>

      <Section id="code" letter={letters[4]} title={wt('tcm.secCode')} why={wt('tcm.whyCode')} example={wt('tcm.exCode')}>
        <Grid2 className="sm:grid-cols-[1fr_160px]">
          <Field label={wt('tcm.repoUrl')}><input className="w-input" value={input.code.repoUrl} disabled={disabled} placeholder="https://github.com/team/project" onChange={(e) => up('code', { repoUrl: e.target.value })} /></Field>
          <Field label={wt('tcm.branch')}><input className="w-input" value={input.code.branch} disabled={disabled} placeholder="main" onChange={(e) => up('code', { branch: e.target.value })} /></Field>
        </Grid2>
        <p className="-mt-2 mb-3 text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.repoHint')}</p>
        <SourcesBox draft={draft} category="CODE" accept={CODE_ACCEPT} onDraft={onDraft} disabled={disabled} linkPlaceholder="https://github.com/…" notePlaceholder={wt('tcm.codeNotePh')} />
        <div className="mt-3">
          <Grid2>
            <Field label={wt('tcm.stack')}><input className="w-input" value={input.code.stack} disabled={disabled} placeholder={wt('tcm.stackPh')} onChange={(e) => up('code', { stack: e.target.value })} /></Field>
            <Field label={wt('tcm.conventions')}><input className="w-input" value={input.code.conventions} disabled={disabled} placeholder={wt('tcm.conventionsPh')} onChange={(e) => up('code', { conventions: e.target.value })} /></Field>
          </Grid2>
        </div>
      </Section>

      <Section id="samples" letter={letters[5]} title={wt('tcm.secSamples')} why={wt('tcm.whySamples')} example={wt('tcm.exSamples')}>
        <SourcesBox draft={draft} category="SAMPLE" accept={SAMPLE_ACCEPT} onDraft={onDraft} disabled={disabled} notePlaceholder={wt('tcm.sampleNotePh')} linkPlaceholder={wt('tcm.sampleLinkPh')} />
      </Section>

      <Section id="split" letter={letters[6]} title={wt('tcm.secSplit')} why={wt('tcm.whySplit')} example={wt('tcm.exSplit')}>
        <Field label={wt('tcm.splitPrompt')}>
          <textarea className="w-input" rows={4} value={input.split.prompt} disabled={disabled} placeholder={wt('tcm.splitPromptPh')} onChange={(e) => up('split', { prompt: e.target.value })} />
        </Field>
        <p className="mb-1 text-[12.5px] font-medium">{wt('tcm.detail')}</p>
        <div className="mb-3 flex flex-wrap gap-1" role="radiogroup" aria-label={wt('tcm.detail')}>
          {(['EPICS', 'STORIES', 'SUBTASKS'] as DetailLevel[]).map((dl) => (
            <button key={dl} type="button" role="radio" aria-checked={input.split.detail === dl} disabled={disabled}
              className={cn('h-8 rounded-[6px] border px-2.5 text-[12.5px] font-medium', input.split.detail === dl ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
              onClick={() => up('split', { detail: dl })}>
              {wt(`tcm.detail_${dl}` as const)}
            </button>
          ))}
        </div>
        <p className="mb-1 text-[12.5px] font-medium">{wt('tcm.generate')}</p>
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {(['criteria', 'points', 'assign', 'tests', 'pages', 'risks', 'meetings', 'onboarding'] as const).map((k) => (
            <Check2 key={k} checked={input.split[k]} disabled={disabled} label={wt(`tcm.gen_${k}` as const)} onChange={(v) => up('split', { [k]: v } as Partial<SetupInput['split']>)} />
          ))}
        </div>
      </Section>

      {ws && (
        <Section id="groups" letter={letters[7]} title={wt('tcm.secGroups')} why={wt('tcm.whyGroups')} example={wt('tcm.exGroups')}>
          {input.groups.length > 0 && (
            <ul className="mb-2 space-y-2">
              {input.groups.map((g, i) => (
                <li key={i} className="rounded-[8px] border border-[var(--w-border)] p-2.5">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_1fr_auto]">
                    <input className="w-input h-8" value={g.name} disabled={disabled} placeholder={wt('tcm.groupName')} aria-label={wt('tcm.groupName')}
                      onChange={(e) => setInput((x) => ({ ...x, groups: x.groups.map((y, k) => (k === i ? { ...y, name: e.target.value } : y)) }))} />
                    <input className="w-input h-8 font-mono uppercase" value={g.key} disabled={disabled} placeholder={wt('tcm.key')} aria-label={wt('tcm.key')} maxLength={10}
                      onChange={(e) => setInput((x) => ({ ...x, groups: x.groups.map((y, k) => (k === i ? { ...y, key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') } : y)) }))} />
                    <input className="w-input h-8" value={g.leader} disabled={disabled} placeholder={wt('tcm.groupLeader')} aria-label={wt('tcm.groupLeader')}
                      onChange={(e) => setInput((x) => ({ ...x, groups: x.groups.map((y, k) => (k === i ? { ...y, leader: e.target.value } : y)) }))} />
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => setInput((x) => ({ ...x, groups: x.groups.filter((_, k) => k !== i) }))}><Trash2 size={13} /></button>
                  </div>
                  <textarea className="w-input mt-2 text-[12.5px]" rows={2} value={g.topic} disabled={disabled} placeholder={wt('tcm.groupTopicPh')} aria-label={wt('tcm.groupTopic')}
                    onChange={(e) => setInput((x) => ({ ...x, groups: x.groups.map((y, k) => (k === i ? { ...y, topic: e.target.value } : y)) }))} />
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="w-btn w-btn-sm" disabled={disabled || input.groups.length >= 30}
              onClick={() => setInput((x) => ({ ...x, groups: [...x.groups, { name: `${x.overview.courseCode || wt('tcm.group')} ${x.groups.length + 1}`, key: '', topic: '', leader: '' }] }))}>
              <Plus size={13} /> {wt('tcm.addGroup')}
            </button>
            <span className="text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.groupsHint')}</span>
          </div>
        </Section>
      )}
    </div>
  );
}

/** Danh sách (tên + ngày) hoặc (tên + từ ngày–tới ngày). */
function DatedList({ title, hint, rows, onChange, range, disabled }: {
  title: string; hint: string; rows: Array<{ name: string; a: string; b?: string }>; onChange: (r: Array<{ name: string; a: string; b?: string }>) => void; range?: boolean; disabled?: boolean;
}) {
  const set = (i: number, p: Partial<{ name: string; a: string; b: string }>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));
  return (
    <div className="mb-2">
      <p className="text-[12.5px] font-medium">{title}</p>
      <p className="mb-1.5 text-[11.5px] text-[var(--w-text-3)]">{hint}</p>
      <ul className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={i} className={cn('grid grid-cols-[1fr_auto] gap-1.5', range ? 'sm:grid-cols-[1fr_150px_150px_auto]' : 'sm:grid-cols-[1fr_150px_auto]')}>
            <input className="w-input h-8 max-sm:col-span-2" value={r.name} disabled={disabled} aria-label={title} onChange={(e) => set(i, { name: e.target.value })} />
            <input type="date" className="w-input h-8" value={r.a} disabled={disabled} aria-label={wt('tcm.date')} onChange={(e) => set(i, { a: e.target.value })} />
            {range && <input type="date" className="w-input h-8" value={r.b ?? ''} disabled={disabled} aria-label={wt('tcm.dateTo')} onChange={(e) => set(i, { b: e.target.value })} />}
            <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => onChange(rows.filter((_, k) => k !== i))}><Trash2 size={13} /></button>
          </li>
        ))}
      </ul>
      <button type="button" className="w-btn w-btn-sm mt-1.5" disabled={disabled} onClick={() => onChange([...rows, { name: '', a: '', b: '' }])}><Plus size={13} /> {wt('tcm.add')}</button>
    </div>
  );
}
