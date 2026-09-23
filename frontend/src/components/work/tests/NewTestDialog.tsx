'use client';

/** Hộp thoại tạo test case: tiêu đề, requirement, loại, 3 bước khởi đầu. */

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { PriorityPicker } from '../fields';
import { wk } from '../hooks';
import { Dialog, Field, Spinner } from '../ui';
import StepsTable, { emptyStep, stepsForSave, stepsProblem, type DraftStep } from './StepsTable';
import { isTestsDisabledError, parseIssueKeys } from './testing-ui';

export default function NewTestDialog({ open, onClose, config, pid, onCreated, defaultRequirement }: {
  open: boolean;
  onClose: () => void;
  config: ProjectConfig;
  pid: number;
  onCreated: (num: number) => void;
  defaultRequirement?: string;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [reqs, setReqs] = useState('');
  const [kind, setKind] = useState<'MANUAL' | 'GHERKIN'>('MANUAL');
  const [priority, setPriority] = useState(3);
  const [steps, setSteps] = useState<DraftStep[]>(() => [emptyStep(), emptyStep(), emptyStep()]);
  const [gherkin, setGherkin] = useState('');
  const [pending, setPending] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(''); setReqs(defaultRequirement ?? ''); setKind('MANUAL'); setPriority(3);
    setSteps([emptyStep(), emptyStep(), emptyStep()]); setGherkin(''); setTried(false);
  }, [open, defaultRequirement]);

  const submit = async () => {
    setTried(true);
    if (!title.trim()) return;
    const problem = kind === 'MANUAL' ? stepsProblem(steps) : null;
    if (problem) { toast.error(problem); return; }
    setPending(true);
    try {
      const res = await workApi.createTest(pid, {
        title: title.trim(),
        kind,
        priority,
        requirementKeys: parseIssueKeys(reqs, config.key),
        ...(kind === 'MANUAL' ? { steps: stepsForSave(steps) } : { gherkin: gherkin.trim() || null }),
      });
      qc.invalidateQueries({ queryKey: wk.tests(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      if (res.failedLinks.length) toast.warning(`Test created, but these requirements could not be linked: ${res.failedLinks.join(', ')}`);
      else toast.success(`${config.key}-${res.number} created`);
      onClose();
      onCreated(res.number);
    } catch (e) {
      toast.error(isTestsDisabledError(e) ? 'Test management is not enabled for this project.' : workError(e, 'Could not create the test'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !pending && onClose()}
      title="New test"
      width={760}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose} disabled={pending}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={pending}>
            {pending && <Spinner size={12} />} Create test
          </button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field label="Title">
          <input
            autoFocus
            className={cn('w-input', tried && !title.trim() && '!border-[var(--w-red)]')}
            value={title}
            maxLength={255}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Login with valid credentials"
          />
          {tried && !title.trim() && <p className="mt-1 text-[12px] text-[var(--w-red)]">Title is required.</p>}
        </Field>
        <div className="grid gap-x-4 sm:grid-cols-[1fr_auto]">
          <Field label="Covers requirements" hint={`Issue keys separated by commas, e.g. ${config.key}-12, ${config.key}-15`}>
            <input className="w-input" value={reqs} onChange={(e) => setReqs(e.target.value)} placeholder={`${config.key}-12`} />
          </Field>
          <Field label="Priority">
            <div className="w-[160px] rounded-[6px] border border-[var(--w-border-strong)]">
              <PriorityPicker value={priority} onChange={setPriority} bare />
            </div>
          </Field>
        </div>
        <Field label="Test type">
          <KindToggle value={kind} onChange={setKind} />
        </Field>
        {/* nút submit ẩn để Enter trong ô tiêu đề tạo test */}
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
      {kind === 'MANUAL' ? (
        <div>
          <label className="w-label">Steps</label>
          <StepsTable steps={steps} onChange={setSteps} showErrors={tried} />
        </div>
      ) : (
        <div>
          <label className="w-label">Scenario (Gherkin)</label>
          <textarea
            className="w-input min-h-[160px] font-mono text-[12.5px]"
            value={gherkin}
            onChange={(e) => setGherkin(e.target.value)}
            spellCheck={false}
            placeholder={'Scenario: Successful login\n  Given a registered user\n  When they sign in with valid credentials\n  Then the dashboard is shown'}
          />
        </div>
      )}
    </Dialog>
  );
}

export function KindToggle({ value, onChange, disabled }: { value: 'MANUAL' | 'GHERKIN'; onChange: (v: 'MANUAL' | 'GHERKIN') => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Test type" className="inline-flex rounded-[6px] border border-[var(--w-border-strong)] p-0.5">
      {(['MANUAL', 'GHERKIN'] as const).map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={value === k}
          disabled={disabled}
          onClick={() => onChange(k)}
          className={cn(
            'h-[24px] rounded-[4px] px-3 text-[12px] font-medium transition-colors disabled:cursor-not-allowed',
            value === k ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
          )}
        >
          {k === 'MANUAL' ? 'Manual' : 'Gherkin'}
        </button>
      ))}
    </div>
  );
}
