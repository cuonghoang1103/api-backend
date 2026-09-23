'use client';

/**
 * Ô nhập JQL: phông đơn cách, Enter để chạy, gợi ý trường/giá trị khi gõ,
 * hộp "Syntax help", và lỗi cú pháp hiện ngay dưới ô kèm dấu ^ đúng vị trí.
 */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CircleHelp, CornerDownLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig } from '@/lib/work-api';
import { Popover, useToggle } from '../ui';
import { JQL_EXAMPLES, JQL_FIELDS, JQL_FUNCTIONS, JQL_OPERATORS, suggest, type JqlSuggestConfig, type Suggestion } from './jql';

export interface JqlInputHandle { focus: () => void }

export const JqlInput = forwardRef<JqlInputHandle, {
  value: string;
  onChange: (v: string) => void;
  onRun: (v: string) => void;
  config: JqlSuggestConfig;
  error?: { message: string; position: number } | null;
  /** Câu truy vấn đã chạy (để biết lỗi đang nói về câu nào). */
  ranQuery?: string;
  placeholder?: string;
  className?: string;
  /** Nhãn nút chạy (mặc định "Search"). */
  runLabel?: string;
}>(function JqlInput({ value, onChange, onRun, config, error, ranQuery, placeholder, className, runLabel = 'Search' }, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const helpRef = useRef<HTMLButtonElement>(null);
  const help = useToggle();
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hi, setHi] = useState(-1);

  useImperativeHandle(ref, () => ({ focus: () => { inputRef.current?.focus(); inputRef.current?.select(); } }), []);

  const sug = useMemo(() => (focused ? suggest(value, caret, config) : { from: caret, items: [] as Suggestion[] }), [focused, value, caret, config]);
  const open = focused && !dismissed && sug.items.length > 0;
  useEffect(() => setHi(-1), [sug.items.length, sug.from]);

  const syncCaret = () => setCaret(inputRef.current?.selectionStart ?? value.length);

  const accept = (s: Suggestion) => {
    const after = value.slice(caret);
    const needsSpace = !after.startsWith(' ');
    const next = value.slice(0, sug.from) + s.insert + (needsSpace ? ' ' : '') + after;
    const pos = sug.from + s.insert.length + 1;
    onChange(next);
    setDismissed(false);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      // "IN ()" / hàm: để con trỏ vào giữa ngoặc thì tiện hơn — ở đây giữ đơn giản, đặt sau khoảng trắng.
      el.setSelectionRange(pos, pos);
      setCaret(pos);
    });
  };

  // Lỗi chỉ gạch chân khi ô vẫn đang giữ đúng câu vừa chạy.
  const showCaret = !!error && (ranQuery === undefined || ranQuery === value);
  // Tô cả từ bắt đầu tại vị trí lỗi (ít nhất 1 ký tự).
  const errLen = error ? Math.max(1, /^\S+/.exec(value.slice(error.position))?.[0].length ?? 1) : 1;

  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={value}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="JQL query"
            aria-invalid={!!error}
            placeholder={placeholder ?? 'e.g. assignee = currentUser() AND statusCategory != Done'}
            onChange={(e) => { onChange(e.target.value); setCaret(e.target.selectionStart ?? e.target.value.length); setDismissed(false); }}
            onKeyUp={syncCaret}
            onClick={syncCaret}
            onFocus={() => { setFocused(true); syncCaret(); }}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (open && e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, sug.items.length - 1)); return; }
              if (open && e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); return; }
              if (open && e.key === 'Tab') { e.preventDefault(); accept(sug.items[Math.max(hi, 0)]); return; }
              if (e.key === 'Enter') {
                e.preventDefault();
                if (open && hi >= 0) accept(sug.items[hi]);
                else { setDismissed(true); onRun(value.trim()); }
                return;
              }
              if (e.key === 'Escape') {
                if (open) { e.preventDefault(); e.stopPropagation(); setDismissed(true); }
                else (e.target as HTMLInputElement).blur();
              }
            }}
            className={cn(
              'w-input !h-[30px] !pr-7 font-mono !text-[12.5px]',
              error && '!border-[var(--w-red)] focus:!shadow-[0_0_0_3px_color-mix(in_srgb,var(--w-red)_18%,transparent)]',
            )}
          />
          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); inputRef.current?.focus(); }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--w-text-3)] hover:text-[var(--w-text)]"
              aria-label="Clear query"
            >
              <X size={12} />
            </button>
          )}
          {open && (
            <div
              role="listbox"
              className="absolute left-0 top-full z-[40] mt-1 w-full max-w-[420px] overflow-hidden rounded-[8px] bg-[var(--w-raised)] p-1"
              style={{ boxShadow: 'var(--w-shadow-pop)' }}
            >
              {sug.items.map((s, i) => (
                <button
                  key={`${s.label}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === hi}
                  onMouseDown={(e) => { e.preventDefault(); accept(s); }}
                  onMouseEnter={() => setHi(i)}
                  className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1 text-left text-[12.5px]', i === hi && 'bg-[var(--w-hover)]')}
                >
                  <span className="truncate font-mono">{s.label}</span>
                  {s.hint && <span className="ml-auto shrink-0 truncate pl-2 text-[11px] text-[var(--w-text-3)]">{s.hint}</span>}
                </button>
              ))}
              <div className="mt-0.5 border-t border-[var(--w-border)] px-2 pt-1 text-[10.5px] text-[var(--w-text-3)]">
                <kbd className="w-kbd">Tab</kbd> to complete · <kbd className="w-kbd">↵</kbd> to search
              </div>
            </div>
          )}
        </div>
        <button type="button" className="w-btn w-btn-primary w-btn-sm shrink-0" onClick={() => onRun(value.trim())} title={`${runLabel} (Enter)`}>
          <CornerDownLeft size={13} /> <span className="max-sm:!hidden">{runLabel}</span>
        </button>
        <button ref={helpRef} type="button" onClick={help.toggle} className="w-btn w-btn-ghost w-btn-icon w-btn-sm shrink-0" aria-label="Syntax help" title="Syntax help">
          <CircleHelp size={14} />
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-1.5 min-w-0 text-[12px]">
          <div className="text-[var(--w-red)]">{error.message}{showCaret && <span className="text-[var(--w-text-3)]"> · at character {error.position + 1}</span>}</div>
          {showCaret && value && (
            <pre className="mt-1 overflow-x-auto rounded-[5px] bg-[var(--w-sunken)] px-2 py-1 font-mono text-[11.5px] leading-[1.45] text-[var(--w-text-2)]">
              {value.slice(0, error.position)}
              <mark className="rounded-[2px] bg-[color-mix(in_srgb,var(--w-red)_22%,transparent)] text-[var(--w-red)]">
                {value.slice(error.position, error.position + errLen) || ' '}
              </mark>
              {value.slice(error.position + errLen)}
              {'\n'}
              <span className="text-[var(--w-red)]">{' '.repeat(Math.min(error.position, value.length))}^</span>
            </pre>
          )}
        </div>
      )}

      <Popover open={help.on} onClose={help.close} anchorRef={helpRef} width={380} align="end">
        <SyntaxHelp config={config} onPick={(q) => { onChange(q); help.close(); onRun(q); }} />
      </Popover>
    </div>
  );
});

function SyntaxHelp({ config, onPick }: { config: ProjectConfig; onPick: (q: string) => void }) {
  return (
    <div className="max-h-[70vh] overflow-y-auto p-3 text-[12px]">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Examples</div>
      <div className="mb-3 space-y-0.5">
        {JQL_EXAMPLES.map((ex) => (
          <button key={ex.q} type="button" onClick={() => onPick(ex.q)} className="block w-full rounded-[5px] px-2 py-1 text-left hover:bg-[var(--w-hover)]">
            <div className="text-[var(--w-text-2)]">{ex.hint}</div>
            <div className="break-words font-mono text-[11.5px] text-[var(--w-accent-text)]">{ex.q}</div>
          </button>
        ))}
      </div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Fields</div>
      <div className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 px-2">
        {JQL_FIELDS.map((f) => (
          <div key={f.name} className="contents">
            <span className="font-mono">{f.name}</span>
            <span className="truncate text-[var(--w-text-3)]">{f.hint}</span>
          </div>
        ))}
        {config.customFields.map((f) => (
          <div key={f.id} className="contents">
            <span className="truncate font-mono">{/\s/.test(f.name) ? `"${f.name}"` : f.name}</span>
            <span className="truncate text-[var(--w-text-3)]">Custom field · {f.kind.toLowerCase()}</span>
          </div>
        ))}
      </div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Operators</div>
      <div className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 px-2">
        {JQL_OPERATORS.map((o) => (
          <div key={o.op} className="contents">
            <span className="whitespace-pre font-mono">{o.op}</span>
            <span className="text-[var(--w-text-3)]">{o.hint}</span>
          </div>
        ))}
      </div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Functions & dates</div>
      <p className="mb-2 px-2 font-mono text-[11.5px] leading-relaxed text-[var(--w-text-2)]">{JQL_FUNCTIONS.join('  ')}</p>
      <p className="px-2 leading-relaxed text-[var(--w-text-3)]">
        Dates accept <span className="font-mono">2026-09-01</span>, relative values like <span className="font-mono">-7d</span> or <span className="font-mono">2w</span>, and the functions above.
        Combine clauses with <span className="font-mono">AND</span>, <span className="font-mono">OR</span>, <span className="font-mono">NOT</span> and parentheses; quote values with spaces.
        Sort with <span className="font-mono">ORDER BY field ASC|DESC</span>.
      </p>
    </div>
  );
}
