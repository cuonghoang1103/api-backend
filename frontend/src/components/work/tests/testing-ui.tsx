'use client';

/**
 * Mảnh dùng chung cho trang Tests (thư viện, plan, trang test case):
 * nhãn kết quả chạy, trạng thái "chưa bật kiểm thử", bảng key tiện dụng.
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type RunStatus } from '@/lib/work-api';
import { wk } from '../hooks';
import { Spinner } from '../ui';

export const RUN_STATUS_META: Record<RunStatus, { label: string; cls: string }> = {
  PASS: {
    label: 'Passed',
    cls: 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green)] border-[color-mix(in_srgb,var(--w-green)_40%,transparent)]',
  },
  FAIL: {
    label: 'Failed',
    cls: 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red)] border-[color-mix(in_srgb,var(--w-red)_40%,transparent)]',
  },
  BLOCKED: {
    label: 'Blocked',
    cls: 'bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange)] border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)]',
  },
  RETEST: { label: 'Retest', cls: 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] border-[var(--w-accent-border)]' },
  IN_PROGRESS: { label: 'In progress', cls: 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] border-[var(--w-accent-border)]' },
  SKIP: { label: 'Skipped', cls: 'bg-[var(--w-sunken)] text-[var(--w-text-3)] border-[var(--w-border-strong)]' },
  TODO: { label: 'To do', cls: 'bg-[var(--w-sunken)] text-[var(--w-text-3)] border-[var(--w-border-strong)]' },
};

export function RunStatusPill({ status, title, className }: { status: RunStatus; title?: string; className?: string }) {
  const m = RUN_STATUS_META[status] ?? RUN_STATUS_META.TODO;
  return (
    <span
      title={title}
      className={cn('inline-flex h-[20px] shrink-0 items-center whitespace-nowrap rounded-[4px] border px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.03em]', m.cls, className)}
    >
      {m.label}
    </span>
  );
}

export function testingEnabled(config: ProjectConfig): boolean {
  return config.issueTypes.some((t) => t.key === 'TEST');
}

export function isTestsDisabledError(err: unknown): boolean {
  const e = err as { response?: { data?: { code?: string } } };
  return e?.response?.data?.code === 'WORK_TESTS_DISABLED';
}

/** Dự án chưa có loại thẻ TEST: mời bật (người có quyền cài đặt) hoặc giải thích. */
export function EnableTestingState({ config, pid }: { config: ProjectConfig; pid: number }) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);
  const enable = async () => {
    setPending(true);
    try {
      await workApi.enableTesting(pid);
      await Promise.all([qc.invalidateQueries({ queryKey: wk.project(pid) }), qc.invalidateQueries({ queryKey: wk.tests(pid) })]);
      toast.success('Test management enabled');
    } catch (e) {
      toast.error(workError(e, 'Could not enable test management'));
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
        <FlaskConical size={20} />
      </span>
      <div className="text-[15px] font-semibold">Test management is not enabled</div>
      <p className="mt-1.5 max-w-[460px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
        Enabling it adds a <b>Test</b> issue type to this project so you can write test cases with steps, group them into
        test plans, execute them in test cycles, and trace coverage back to requirements.
      </p>
      <div className="mt-4">
        {config.permissions.settings ? (
          <button type="button" className="w-btn w-btn-primary" onClick={enable} disabled={pending}>
            {pending && <Spinner size={12} />} Enable test management
          </button>
        ) : (
          <p className="text-[12px] text-[var(--w-text-3)]">Ask a project admin to enable test management in this project.</p>
        )}
      </div>
    </div>
  );
}

/** Tách "SWT-12, swt-13 14" thành danh sách key viết hoa; số trần thì gắn key dự án. */
export function parseIssueKeys(raw: string, projectKey: string): string[] {
  const out: string[] = [];
  for (const part of raw.split(/[\s,;]+/)) {
    const t = part.trim().toUpperCase();
    if (!t) continue;
    const key = /^\d+$/.test(t) ? `${projectKey}-${t}` : t;
    if (!out.includes(key)) out.push(key);
  }
  return out;
}
