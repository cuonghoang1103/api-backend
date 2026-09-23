'use client';

/** Chọn nhiều test (có ô tìm) — dùng khi tạo cycle và khi thêm test vào cycle. */

import { useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '../hooks';
import { PickerList, Popover, PriorityIcon, Spinner, useToggle, type PickOption } from '../ui';

export function useTestList(pid: number) {
  return useQuery({ queryKey: [...wk.tests(pid), 'picker-tests'], queryFn: () => workApi.tests(pid), staleTime: 30_000 });
}

export default function TestPicker({ pid, projectKey, value, onChange, exclude = [], autoOpen }: {
  pid: number;
  projectKey: string;
  value: number[];
  onChange: (numbers: number[]) => void;
  /** Test đã có trong cycle — không cho chọn lại. */
  exclude?: number[];
  autoOpen?: boolean;
}) {
  const tests = useTestList(pid);
  const pop = useToggle(!!autoOpen);
  const ref = useRef<HTMLButtonElement>(null);
  const key = (n: number) => `${projectKey}-${n}`;

  const options = useMemo<PickOption<number>[]>(() => (tests.data ?? [])
    .filter((t) => !exclude.includes(t.number))
    .map((t) => ({
      value: t.number,
      label: `${key(t.number)}  ${t.title}`,
      icon: <PriorityIcon priority={t.priority} size={13} />,
      hint: t.stepCount ? `${t.stepCount} step${t.stepCount === 1 ? '' : 's'}` : t.kind === 'GHERKIN' ? 'Gherkin' : undefined,
      keywords: t.requirements.map((r) => `${key(r.number)} ${r.title}`).join(' '),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })), [tests.data, exclude, projectKey]);

  const titleOf = (n: number) => tests.data?.find((t) => t.number === n)?.title;
  const toggle = (n: number) => onChange(value.includes(n) ? value.filter((x) => x !== n) : [...value, n]);
  const allVisible = options.map((o) => o.value);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button ref={ref} type="button" onClick={pop.toggle} className="w-btn w-btn-sm">
          {value.length ? `${value.length} test${value.length === 1 ? '' : 's'} selected` : 'Select tests'} <ChevronDown size={12} />
        </button>
        {tests.isLoading && <Spinner size={12} />}
        {!!value.length && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onChange([])}>Clear</button>
        )}
        {!!options.length && value.length < allVisible.length && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onChange([...new Set([...value, ...allVisible])])}>Select all ({allVisible.length})</button>
        )}
      </div>
      {tests.error && <p className="mt-1 text-[12px] text-[var(--w-red)]">{workError(tests.error, 'Could not load tests')}</p>}
      {!!value.length && (
        <div className="mt-2 flex max-h-[132px] flex-wrap gap-1.5 overflow-y-auto">
          {value.map((n) => (
            <span key={n} className="inline-flex h-[22px] max-w-full items-center gap-1 rounded-[4px] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] pl-1.5 pr-0.5 text-[12px]">
              <span className="shrink-0 font-medium text-[var(--w-text-2)]">{key(n)}</span>
              <span className="max-w-[180px] truncate">{titleOf(n) ?? ''}</span>
              <button type="button" onClick={() => toggle(n)} aria-label={`Remove ${key(n)}`} className="rounded-[3px] p-0.5 text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={380}>
        <PickerList
          options={options}
          selected={value}
          onPick={toggle}
          multi
          placeholder="Search tests by key, title or requirement…"
          empty={tests.isLoading ? 'Loading…' : tests.data?.length ? 'No matching tests' : 'No tests in this project yet'}
        />
      </Popover>
    </div>
  );
}
