'use client';

/**
 * Nhóm "Fields" trong cột thuộc tính của thẻ: trường tuỳ chỉnh của dự án áp
 * cho loại thẻ này. Mỗi lần sửa gửi đúng MỘT trường (PUT custom-values) —
 * null = xoá giá trị. Backend kiểm kiểu + bắt buộc, lỗi hiện bằng toast.
 */

import { useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type CustomField, type CustomValue, type CustomValues, type ProjectConfig,
} from '@/lib/work-api';
import { DateInput } from './fields';
import { wk } from './hooks';
import { PickerList, Popover, Spinner, UserAvatar, useToggle, type PickOption } from './ui';

function Row({ field, children }: { field: CustomField; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[108px_1fr] items-center gap-2 py-0.5">
      <div className="truncate text-[12px] text-[var(--w-text-3)]" title={field.name}>
        {field.name}{field.required && <span className="text-[var(--w-red)]"> *</span>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Ô chữ/số sửa tại chỗ: lưu khi rời ô hoặc Enter, Esc để huỷ. */
function CommitInput({ value, onCommit, disabled, placeholder = 'None', inputMode, validate }: {
  value: string; onCommit: (v: string) => void; disabled?: boolean; placeholder?: string;
  inputMode?: 'text' | 'decimal' | 'url'; validate?: (v: string) => string | null;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const t = draft.trim();
    setDraft(null);
    if (t === value) return;
    const err = t ? validate?.(t) : null;
    if (err) { toast.error(err); return; }
    onCommit(t);
  };
  return (
    <input
      value={draft ?? value}
      disabled={disabled}
      inputMode={inputMode}
      placeholder={disabled ? '' : placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) (e.target as HTMLInputElement).blur();
        if (e.key === 'Escape') { setDraft(null); (e.target as HTMLInputElement).blur(); }
      }}
      className={cn('w-input w-input-bare', inputMode === 'decimal' && 'tabular')}
    />
  );
}

/** Nút mở popover chọn (giống Trigger trong fields.tsx, bản trần). */
function PickTrigger({ children, disabled, onClick, triggerRef }: { children: ReactNode; disabled?: boolean; onClick: () => void; triggerRef: RefObject<HTMLButtonElement> }) {
  return (
    <button
      ref={triggerRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn('flex min-h-[30px] w-full flex-wrap items-center gap-1.5 rounded-[6px] px-2 py-1 text-left text-[13px] transition-colors hover:bg-[var(--w-hover)]', disabled && 'cursor-default hover:bg-transparent')}
    >
      {children}
    </button>
  );
}

function OptionChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex h-[20px] max-w-full items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[11px] text-[var(--w-text-2)]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="truncate">{label}</span>
    </span>
  );
}

const None = () => <span className="text-[var(--w-text-3)]">None</span>;

function SelectEditor({ field, value, onChange, disabled }: { field: CustomField; value: CustomValue; onChange: (v: CustomValue) => void; disabled?: boolean }) {
  const p = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const multi = field.kind === 'MULTISELECT';
  const selected = multi ? (Array.isArray(value) ? value : []) : typeof value === 'string' ? [value] : [];
  const chosen = field.options.filter((o) => selected.includes(o.id));
  const options: PickOption<string>[] = [
    ...(multi ? [] : [{ value: '', label: 'None' }]),
    ...field.options.map((o) => ({ value: o.id, label: o.label, icon: <span className="h-2 w-2 rounded-full" style={{ background: o.color }} /> })),
  ];
  return (
    <>
      <PickTrigger triggerRef={ref} onClick={p.toggle} disabled={disabled}>
        {chosen.length ? chosen.map((o) => <OptionChip key={o.id} label={o.label} color={o.color} />) : <None />}
      </PickTrigger>
      <Popover open={p.on} onClose={p.close} anchorRef={ref} width={240}>
        <PickerList
          multi={multi}
          options={options}
          selected={multi ? selected : [selected[0] ?? '']}
          onPick={(id) => {
            if (multi) {
              const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
              onChange(next.length ? next : null);
            } else {
              onChange(id || null);
              p.close();
            }
          }}
          placeholder={`${field.name}…`}
          empty="No options"
        />
      </Popover>
    </>
  );
}

function UserEditor({ field, value, config, onChange, disabled }: { field: CustomField; value: CustomValue; config: ProjectConfig; onChange: (v: CustomValue) => void; disabled?: boolean }) {
  const p = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const cur = typeof value === 'number' ? config.members.find((m) => m.id === value) : undefined;
  const options: PickOption<number>[] = [
    { value: 0, label: 'None', icon: <UserAvatar user={null} size={16} /> },
    ...config.members.map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} /> })),
  ];
  return (
    <>
      <PickTrigger triggerRef={ref} onClick={p.toggle} disabled={disabled}>
        {cur ? (
          <><UserAvatar user={cur} size={18} /><span className="min-w-0 flex-1 truncate">{userName(cur)}</span></>
        ) : typeof value === 'number' ? <span className="text-[var(--w-text-3)]">Former member</span> : <None />}
      </PickTrigger>
      <Popover open={p.on} onClose={p.close} anchorRef={ref} width={240}>
        <PickerList options={options} selected={[typeof value === 'number' ? value : 0]} onPick={(id) => { onChange(id || null); p.close(); }} placeholder={`${field.name}…`} />
      </Popover>
    </>
  );
}

function FieldEditor({ field, value, config, onChange, disabled }: {
  field: CustomField; value: CustomValue; config: ProjectConfig; onChange: (v: CustomValue) => void; disabled?: boolean;
}) {
  switch (field.kind) {
    case 'TEXT':
      return <CommitInput value={typeof value === 'string' ? value : ''} onCommit={(v) => onChange(v || null)} disabled={disabled} />;
    case 'URL': {
      const url = typeof value === 'string' ? value : '';
      return (
        <div className="flex min-w-0 items-center gap-1">
          <div className="min-w-0 flex-1">
            <CommitInput
              value={url}
              inputMode="url"
              placeholder="https://…"
              onCommit={(v) => onChange(v || null)}
              disabled={disabled}
              validate={(v) => (/^https?:\/\/\S+$/i.test(v) ? null : 'Enter a full link that starts with http:// or https://')}
            />
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" title="Open link" className="w-btn w-btn-ghost w-btn-icon w-btn-sm shrink-0"><ExternalLink size={12} /></a>
          )}
        </div>
      );
    }
    case 'NUMBER':
      return (
        <CommitInput
          value={typeof value === 'number' ? String(value) : ''}
          inputMode="decimal"
          onCommit={(v) => onChange(v === '' ? null : Number(v))}
          disabled={disabled}
          validate={(v) => (Number.isFinite(Number(v)) ? null : `${field.name} must be a number`)}
        />
      );
    case 'DATE':
      return <DateInput value={typeof value === 'string' ? value : null} onChange={(v) => onChange(v)} disabled={disabled} />;
    case 'CHECKBOX':
      return (
        <label className={cn('flex h-[30px] items-center gap-2 px-2 text-[13px]', !disabled && 'cursor-pointer')}>
          <input type="checkbox" checked={value === true} disabled={disabled} onChange={(e) => onChange(e.target.checked ? true : null)} className="h-3.5 w-3.5 accent-[var(--w-accent)]" />
          <span className={value === true ? '' : 'text-[var(--w-text-3)]'}>{value === true ? 'Yes' : 'No'}</span>
        </label>
      );
    case 'SELECT':
    case 'MULTISELECT':
      return <SelectEditor field={field} value={value} onChange={onChange} disabled={disabled} />;
    case 'USER':
      return <UserEditor field={field} value={value} config={config} onChange={onChange} disabled={disabled} />;
    default:
      return <None />;
  }
}

export default function CustomFieldsGroup({ pid, num, typeKey, config, editable }: {
  pid: number; num: number; typeKey: string | undefined; config: ProjectConfig; editable: boolean;
}) {
  const qc = useQueryClient();
  const fields = useMemo(
    () => (config.customFields ?? [])
      .filter((f) => !f.typeKeys?.length || (typeKey !== undefined && f.typeKeys.includes(typeKey)))
      .sort((a, b) => a.position - b.position),
    [config.customFields, typeKey],
  );
  const q = useQuery({
    queryKey: wk.customValues(pid, num),
    queryFn: () => workApi.customValues(pid, num),
    enabled: fields.length > 0,
    staleTime: 15_000,
  });
  const save = useMutation({
    mutationFn: (values: CustomValues) => workApi.setCustomValues(pid, num, values),
    onMutate: async (values) => {
      // Cập nhật lạc quan: checkbox/select phải đổi ngay khi bấm.
      await qc.cancelQueries({ queryKey: wk.customValues(pid, num) });
      const prev = qc.getQueryData<CustomValues>(wk.customValues(pid, num));
      qc.setQueryData<CustomValues>(wk.customValues(pid, num), (old) => ({ ...(old ?? {}), ...values }));
      return { prev };
    },
    onSuccess: (data) => {
      qc.setQueryData(wk.customValues(pid, num), data);
      qc.invalidateQueries({ queryKey: wk.history(pid, num) });
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(wk.customValues(pid, num), ctx.prev);
      toast.error(workError(err, 'Could not save the field'));
    },
  });

  if (!fields.length) return null;
  const values = q.data ?? {};

  return (
    <div className="mt-3 border-t border-[var(--w-border)] pt-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
        Fields {(q.isLoading || save.isPending) && <Spinner size={10} />}
      </div>
      {q.isError ? (
        <p className="py-1 text-[12px] text-[var(--w-red)]">{workError(q.error, 'Could not load fields')}</p>
      ) : (
        fields.map((f) => (
          <Row key={f.id} field={f}>
            <FieldEditor
              field={f}
              value={values[String(f.id)] ?? null}
              config={config}
              disabled={!editable || q.isLoading}
              onChange={(v) => save.mutate({ [String(f.id)]: v })}
            />
          </Row>
        ))
      )}
    </div>
  );
}
