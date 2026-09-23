'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectTemplate, type ProjectType } from '@/lib/work-api';
import { wk } from '../hooks';
import { Dialog, Field, Spinner } from '../ui';
import { Select } from '../settings/shared';

const TEMPLATES: Array<{ key: ProjectTemplate; name: string; body: string; type: 'SCRUM' | 'KANBAN' }> = [
  { key: 'BLANK', name: 'Blank project', body: 'To Do, In Progress, Done. Configure the rest yourself.', type: 'SCRUM' },
  { key: 'SWP391', name: 'Software project (SWP391)', body: 'Scrum with epics and stories, bug lifecycle with retest.', type: 'SCRUM' },
  { key: 'SWR302', name: 'Requirements (SWR302)', body: 'Requirement issues with MoSCoW prioritisation.', type: 'SCRUM' },
  { key: 'SWT301', name: 'Software testing (SWT301)', body: 'Test cases and a full bug lifecycle.', type: 'SCRUM' },
  { key: 'FREELANCE', name: 'Client project', body: 'Weekly sprints and hour estimates for client work.', type: 'SCRUM' },
  { key: 'COMPANY', name: 'Team project', body: 'Code review and QA columns before Done.', type: 'SCRUM' },
];

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
  open, onClose, workspaceId, slug,
}: { open: boolean; onClose: () => void; workspaceId: number; slug: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [template, setTemplate] = useState<ProjectTemplate>('BLANK');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [keyTouched, setKeyTouched] = useState(false);
  const [type, setType] = useState<ProjectType>('SCRUM');
  const [typeTouched, setTypeTouched] = useState(false);
  const [visibility, setVisibility] = useState<'WORKSPACE' | 'PRIVATE'>('WORKSPACE');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return;
    setTemplate('BLANK'); setName(''); setKey(''); setKeyTouched(false);
    setType('SCRUM'); setTypeTouched(false); setVisibility('WORKSPACE'); setDescription('');
  }, [open]);

  const create = useMutation({
    mutationFn: () => workApi.createProject(workspaceId, {
      name: name.trim(), key, type, template, visibility, description: description.trim() || null,
    }),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: wk.workspace(slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
      toast.success(`Project ${p.key} created`);
      router.push(`/work/${slug}/${p.key}/board`);
    },
    onError: (err) => toast.error(workError(err, 'Could not create the project')),
  });

  const keyValid = PROJECT_KEY_RE.test(key);
  const canSubmit = name.trim().length > 0 && keyValid && !create.isPending && !create.isSuccess;

  const pickTemplate = (t: (typeof TEMPLATES)[number]) => {
    setTemplate(t.key);
    if (!typeTouched) setType(t.type);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Create project" width={620}>
      <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) create.mutate(); }}>
        <div className="mb-4">
          <label className="w-label">Template</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const on = template === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => pickTemplate(t)}
                  aria-pressed={on}
                  className={cn(
                    'relative rounded-[8px] border px-3 py-2.5 text-left transition-colors',
                    on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
                  )}
                >
                  <div className="pr-5 text-[13px] font-medium">{t.name}</div>
                  <div className="mt-0.5 text-[12px] leading-snug text-[var(--w-text-2)]">{t.body}</div>
                  {on && <Check size={14} className="absolute right-2.5 top-2.5 text-[var(--w-accent-text)]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_160px]">
          <Field label="Name">
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
            : `Used as the prefix of issue keys, e.g. ${keyValid ? key : 'SWP'}-12`}
        </p>

        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Field label="Type">
            <div className="flex h-8 rounded-[6px] border border-[var(--w-border-strong)] p-0.5">
              {(['SCRUM', 'KANBAN'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setTypeTouched(true); }}
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

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!canSubmit}>
            {(create.isPending || create.isSuccess) && <Spinner size={12} />}
            Create project
          </button>
        </div>
      </form>
    </Dialog>
  );
}
