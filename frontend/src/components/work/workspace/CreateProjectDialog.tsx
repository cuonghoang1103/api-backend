'use client';

/**
 * Tạo dự án — trình hướng dẫn:
 *   0. Chọn LOẠI dự án (lớp studio S1): Personal · School · Software · Client —
 *      mỗi loại kèm mô-đun mặc định (chỉ Client bật Teams/Stages/Approvals/Handoffs)
 *      và một mẫu gợi ý ⇒ chọn loại là sang thẳng bước đặt tên.
 *   1. (tuỳ chọn) Đổi mẫu (thẻ có biểu tượng, một dòng mô tả, "Best for …").
 *   2. Tên + mã (tự sinh từ tên) + "Add sample data" (mặc định BẬT cho dự án đầu tiên).
 * Không truyền workspaceId (người mới chưa có không gian) ⇒ tự dùng không gian
 * đầu tiên được phép tạo dự án, hoặc lặng lẽ tạo "<Tên>'s workspace" — người
 * mới không phải hiểu khái niệm workspace mới bắt đầu được.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft, Briefcase, Building2, Check, ChevronDown, ChevronRight, Code2, FlaskConical, GraduationCap, ListChecks, Square, User, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { workApi, workError, type ModuleMap, type ProjectKind, type ProjectTemplate, type ProjectType, type StudioModule } from '@/lib/work-api';
import { KIND_INFO, KINDS, S1_MODULES } from '../studio/shared';
import { Switch } from '../settings/shared';
import { wk } from '../hooks';
import { Dialog, Field, Spinner } from '../ui';
import { Select } from '../settings/shared';

interface TemplateCard {
  key: ProjectTemplate;
  name: string;
  body: string;
  bestFor: string;
  type: 'SCRUM' | 'KANBAN';
  icon: LucideIcon;
  color: string;
}

export const TEMPLATES: TemplateCard[] = [
  { key: 'SWP391', name: 'Software project', body: 'Scrum with epics, stories, Sprint 1 ready and a bug lifecycle with retest.', bestFor: 'SWP391 capstone teams', type: 'SCRUM', icon: GraduationCap, color: '#2563eb' },
  { key: 'SWR302', name: 'Requirements', body: 'Requirement issues with a MoSCoW field and Sprint 1 ready.', bestFor: 'SWR302 requirement engineering', type: 'SCRUM', icon: ListChecks, color: '#0891b2' },
  { key: 'SWT301', name: 'Software testing', body: 'Test cases with steps, test plans, cycles and a full bug lifecycle.', bestFor: 'SWT301 testing labs', type: 'SCRUM', icon: FlaskConical, color: '#ca8a04' },
  { key: 'FREELANCE', name: 'Client project', body: 'Weekly sprints and hour estimates you can report to a client.', bestFor: 'Freelancers and small agencies', type: 'SCRUM', icon: Briefcase, color: '#16a34a' },
  { key: 'COMPANY', name: 'Team project', body: 'Code review and QA columns before Done.', bestFor: 'Product teams at work', type: 'SCRUM', icon: Building2, color: '#7c3aed' },
  { key: 'BLANK', name: 'Blank project', body: 'To Do, In Progress, Done. Configure the rest yourself.', bestFor: 'Anything else', type: 'SCRUM', icon: Square, color: '#64748b' },
];

const KIND_ICON: Record<ProjectKind, LucideIcon> = { PERSONAL: User, SCHOOL: GraduationCap, SOFTWARE: Code2, CLIENT: Briefcase };
/** Mẫu gợi ý cho từng loại (đổi được ở bước mẫu). */
const KIND_TEMPLATE: Record<ProjectKind, ProjectTemplate> = { PERSONAL: 'BLANK', SCHOOL: 'SWP391', SOFTWARE: 'COMPANY', CLIENT: 'FREELANCE' };
/** Mẫu ⇒ loại (khớp kindFromTemplate ở backend) khi mở thẳng bằng initialTemplate. */
const TEMPLATE_KIND: Record<ProjectTemplate, ProjectKind> = { SWR302: 'SCHOOL', SWT301: 'SCHOOL', SWP391: 'SCHOOL', FREELANCE: 'CLIENT', BLANK: 'SOFTWARE', COMPANY: 'SOFTWARE' };
const modulesFor = (k: ProjectKind): Partial<ModuleMap> => Object.fromEntries(S1_MODULES.map((m) => [m.key, KIND_INFO[k].modules.includes(m.key)]));

export const PROJECT_KEY_RE = /^[A-Z][A-Z0-9]{1,9}$/;

/** "SWP391 Group 3" ⇒ "SG3"; "Website" ⇒ "WEB". Bỏ dấu tiếng Việt trước. */
export function deriveKey(name: string): string {
  const words = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'D')
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
  if (!words.length) return '';
  let key = words.length > 1 ? words.map((w) => w[0]).join('') : words[0].slice(0, 3);
  key = key.replace(/^[0-9]+/, '');
  if (key.length < 2) {
    const firstAlpha = words.find((w) => /^[A-Z]/.test(w)) ?? '';
    key = (key + firstAlpha.slice(key.length ? 1 : 0)).slice(0, 3);
  }
  return key.slice(0, 10);
}

export default function CreateProjectDialog({
  open, onClose, workspaceId, slug, initialTemplate,
}: {
  open: boolean;
  onClose: () => void;
  /** Bỏ trống ⇒ tự chọn / tự tạo không gian (xem chú thích đầu file). */
  workspaceId?: number;
  slug?: string;
  initialTemplate?: ProjectTemplate;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [kind, setKind] = useState<ProjectKind>('SCHOOL');
  const [modules, setModules] = useState<Partial<ModuleMap>>({});
  const [template, setTemplate] = useState<ProjectTemplate>('SWP391');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [keyTouched, setKeyTouched] = useState(false);
  const [type, setType] = useState<ProjectType>('SCRUM');
  const [visibility, setVisibility] = useState<'WORKSPACE' | 'PRIVATE'>('WORKSPACE');
  const [description, setDescription] = useState('');
  const [sample, setSample] = useState(false);
  const [sampleTouched, setSampleTouched] = useState(false);
  const [more, setMore] = useState(false);

  // Dự án đầu tiên của người dùng ⇒ mặc định bật dữ liệu mẫu.
  const wsList = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, enabled: open, staleTime: 30_000 });
  const firstProject = wsList.data ? wsList.data.reduce((n, w) => n + w.projectCount, 0) === 0 : !workspaceId;

  useEffect(() => {
    if (!open) return;
    setStep(initialTemplate ? 2 : 0);
    const k0 = initialTemplate ? TEMPLATE_KIND[initialTemplate] : 'SCHOOL';
    setKind(k0);
    setModules(modulesFor(k0));
    setTemplate(initialTemplate ?? 'SWP391');
    setName(''); setKey(''); setKeyTouched(false);
    setType(TEMPLATES.find((t) => t.key === (initialTemplate ?? 'SWP391'))?.type ?? 'SCRUM');
    setVisibility('WORKSPACE'); setDescription(''); setSampleTouched(false); setMore(false);
  }, [open, initialTemplate]);
  useEffect(() => {
    if (open && !sampleTouched) setSample(firstProject);
  }, [open, firstProject, sampleTouched]);

  /** Không gian để tạo dự án: được truyền vào, hoặc cái đầu tiên được phép, hoặc tạo mới. */
  const ensureWorkspace = async (): Promise<{ id: number; slug: string }> => {
    if (workspaceId && slug) return { id: workspaceId, slug };
    const list = wsList.data ?? await workApi.workspaces();
    const usable = list.find((w) => w.role !== 'GUEST');
    if (usable) return { id: usable.id, slug: usable.slug };
    const who = (me?.displayName || me?.fullName || me?.username || 'My').trim();
    const ws = await workApi.createWorkspace({ name: `${who}'s workspace`.slice(0, 100) });
    qc.invalidateQueries({ queryKey: wk.workspaces });
    return { id: ws.id, slug: ws.slug };
  };

  const create = useMutation({
    mutationFn: async () => {
      const ws = await ensureWorkspace();
      const p = await workApi.createProject(ws.id, {
        name: name.trim(), key, type, template, visibility, description: description.trim() || null,
        kind, modules,
      });
      let sampled = 0;
      if (sample) {
        try { sampled = (await workApi.addSampleData(p.id)).issues; } catch (err) {
          toast.error(workError(err, 'The project was created, but sample data could not be added'));
        }
      }
      return { ...p, slug: ws.slug, sampled };
    },
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: wk.workspace(p.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
      toast.success(p.sampled ? `Project ${p.key} created with ${p.sampled} sample issues` : `Project ${p.key} created`);
      router.push(`/work/${p.slug}/${p.key}/board`);
    },
    onError: (err) => toast.error(workError(err, 'Could not create the project')),
  });

  const keyValid = PROJECT_KEY_RE.test(key);
  const canSubmit = name.trim().length > 0 && keyValid && !create.isPending && !create.isSuccess;
  const picked = TEMPLATES.find((t) => t.key === template)!;

  const pickTemplate = (t: TemplateCard) => {
    setTemplate(t.key);
    setType(t.type);
    setStep(2);
  };
  const pickKind = (k: ProjectKind) => {
    setKind(k);
    setModules(modulesFor(k));
    const t = TEMPLATES.find((x) => x.key === KIND_TEMPLATE[k])!;
    setTemplate(t.key);
    setType(t.type);
    setStep(2);
  };
  const onModules = S1_MODULES.filter((m) => modules[m.key]);

  return (
    <Dialog open={open} onClose={onClose} title={step === 0 ? 'Create project · what kind of project?' : step === 1 ? 'Create project · choose a template' : 'Create project · name it'} width={660}>
      {step === 0 ? (
        <div>
          <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
            The type decides which modules start on. Everything can be changed later in Project settings → Project type &amp; modules.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Project type">
            {KINDS.map((k) => {
              const Icon = KIND_ICON[k];
              const info = KIND_INFO[k];
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={kind === k}
                  onClick={() => pickKind(k)}
                  className={cn(
                    'group relative flex gap-3 rounded-[8px] border px-3 py-3 text-left transition-colors',
                    kind === k ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
                  )}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-sunken)] text-[var(--w-text-2)]"><Icon size={16} /></span>
                  <span className="min-w-0 flex-1 pr-4">
                    <span className="block text-[13px] font-medium">{info.label}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--w-text-2)]">{info.body}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {info.modules.length ? info.modules.map((m) => (
                        <span key={m} className="rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-accent-text)]">{S1_MODULES.find((x) => x.key === m)?.label}</span>
                      )) : <span className="text-[11px] text-[var(--w-text-3)]">No extra modules</span>}
                    </span>
                  </span>
                  <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)] opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      ) : step === 1 ? (
        <div>
          <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
            Templates set up columns, issue types and settings for you. You can change everything later.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const on = template === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => pickTemplate(t)}
                  aria-pressed={on}
                  className={cn(
                    'group relative flex gap-3 rounded-[8px] border px-3 py-2.5 text-left transition-colors',
                    on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
                  )}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px]" style={{ background: `color-mix(in srgb, ${t.color} 14%, transparent)`, color: t.color }}>
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1 pr-4">
                    <span className="block text-[13px] font-medium">{t.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--w-text-2)]">{t.body}</span>
                    <span className="mt-1 block text-[11px] text-[var(--w-text-3)]">Best for: {t.bestFor}</span>
                  </span>
                  <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)] opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="w-btn mr-auto" onClick={() => setStep(2)}><ArrowLeft size={13} /> Back</button>
            <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) create.mutate(); }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-3 flex w-full items-center gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-left hover:bg-[var(--w-hover)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]" style={{ background: `color-mix(in srgb, ${picked.color} 14%, transparent)`, color: picked.color }}>
              <picked.icon size={14} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium">{picked.name}</span>
              <span className="block truncate text-[11px] text-[var(--w-text-3)]">Best for: {picked.bestFor}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[12px] text-[var(--w-accent-text)]">Change template</span>
          </button>
          <p className="-mt-1 mb-3 flex flex-wrap items-center gap-x-1.5 text-[12px] text-[var(--w-text-3)]">
            <span>Type: <b className="font-medium text-[var(--w-text-2)]">{KIND_INFO[kind].label}</b></span>
            <span aria-hidden="true">·</span>
            <span>{onModules.length ? `Modules: ${onModules.map((m) => m.label).join(', ')}` : 'No extra modules'}</span>
            <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => setStep(0)}>Change type</button>
          </p>

          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_160px]">
            <Field label="Project name">
              <input
                className="w-input"
                value={name}
                maxLength={120}
                autoFocus
                placeholder="e.g. Online Bookstore"
                onChange={(e) => {
                  setName(e.target.value);
                  if (!keyTouched) setKey(deriveKey(e.target.value));
                }}
              />
            </Field>
            <Field label="Key">
              <input
                className="w-input font-mono uppercase"
                value={key}
                maxLength={10}
                spellCheck={false}
                aria-invalid={!!key && !keyValid}
                onChange={(e) => {
                  setKeyTouched(true);
                  setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                }}
              />
            </Field>
          </div>
          <p className={cn('-mt-2 mb-4 text-[12px]', key && !keyValid ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
            {key && !keyValid
              ? 'Key must be 2–10 letters or digits and start with a letter.'
              : `Filled in from the name. Issue keys will look like ${keyValid ? key : 'SWP'}-12.`}
          </p>

          <label className="mb-4 flex cursor-pointer items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] px-3 py-2.5 hover:bg-[var(--w-hover)]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--w-accent)]"
              checked={sample}
              onChange={(e) => { setSample(e.target.checked); setSampleTouched(true); }}
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium">Add sample data so I can explore</span>
              <span className="block text-[12px] leading-snug text-[var(--w-text-2)]">
                {template === 'SWT301'
                  ? 'Example requirements, 6 test cases with steps and a test plan.'
                  : type === 'KANBAN'
                    ? 'Example tasks and bugs, a few already in progress.'
                    : 'Example epics, stories with story points and acceptance criteria, bugs and a planned Sprint 1.'}
                {' '}Remove it with one click when you are ready.
              </span>
            </span>
          </label>

          <button type="button" className="mb-2 flex items-center gap-1 text-[12px] text-[var(--w-text-2)] hover:text-[var(--w-text)]" onClick={() => setMore((v) => !v)} aria-expanded={more}>
            {more ? <ChevronDown size={13} /> : <ChevronRight size={13} />} More options
          </button>
          {more && (
            <div className="mb-2">
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                <Field label="Type">
                  <div className="flex h-8 rounded-[6px] border border-[var(--w-border-strong)] p-0.5">
                    {(['SCRUM', 'KANBAN'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          'flex-1 rounded-[4px] text-[12px] font-medium transition-colors',
                          type === t ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                        )}
                      >
                        {t === 'SCRUM' ? 'Scrum' : 'Kanban'}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Access">
                  <Select value={visibility} onChange={(e) => setVisibility(e.target.value as 'WORKSPACE' | 'PRIVATE')}>
                    <option value="WORKSPACE">Everyone in the workspace</option>
                    <option value="PRIVATE">Only invited members</option>
                  </Select>
                </Field>
              </div>
              <p className="-mt-2 mb-4 text-[12px] text-[var(--w-text-3)]">
                {type === 'SCRUM' ? 'Plan work in sprints from a backlog.' : 'Continuous flow on a board, no sprints.'}
              </p>
              <Field label="Description (optional)">
                <textarea className="w-input" rows={2} value={description} maxLength={5000} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              <Field label="Modules">
                <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
                  {S1_MODULES.map((m) => (
                    <li key={m.key} className="flex items-center gap-3 px-3 py-2">
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium">{m.label}</span>
                        <span className="block text-[12px] leading-snug text-[var(--w-text-2)]">{m.body}</span>
                      </span>
                      <Switch checked={!!modules[m.key]} onChange={(v) => setModules((x) => ({ ...x, [m.key as StudioModule]: v }))} label={`${m.label} module`} />
                    </li>
                  ))}
                </ul>
              </Field>
            </div>
          )}

          <div className="mt-2 flex items-center justify-end gap-2">
            <button type="button" className="w-btn mr-auto" onClick={() => setStep(0)}>
              <ArrowLeft size={13} /> Back
            </button>
            <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="w-btn w-btn-primary" disabled={!canSubmit}>
              {(create.isPending || create.isSuccess) ? <Spinner size={12} /> : <Check size={13} />}
              {create.isPending && sample ? 'Creating & adding samples…' : 'Create project'}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
