'use client';

/**
 * Maker Lab — sổ tay làm việc.
 *
 * Lệnh hay dùng, lỗi đã gặp, đoạn code hay copy. Thứ tốn hàng giờ để
 * tìm ra và mất 30 giây để quên.
 *
 * Mục lỗi là phần đáng giá nhất, và nó được cấu trúc theo đúng cách
 * người ta TRA CỨU chứ không phải cách người ta viết ra: bạn gặp một
 * triệu chứng, gõ vào ô tìm, rồi mới đọc nguyên nhân. Vì vậy TRIỆU
 * CHỨNG luôn là dòng đầu tiên và in đậm.
 */

import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy, Search, Terminal, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export interface NotebookCommand {
  group: string;
  cmd: string;
  what: string;
  note?: string;
}
export interface NotebookError {
  symptom: string;
  cause: string;
  fix: string;
  costMe?: string;
  tags?: string[];
}
export interface NotebookSnippet {
  title: string;
  lang: string;
  why: string;
  code: string;
}
export interface NotebookData {
  commands: NotebookCommand[];
  errors: NotebookError[];
  snippets: NotebookSnippet[];
}

type Tab = 'commands' | 'errors' | 'snippets';

export function ProjectNotebook({ data }: { data: NotebookData | null }) {
  const [tab, setTab] = useState<Tab>('commands');
  const [q, setQ] = useState('');

  if (!data) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Sổ tay còn trống — sẽ đầy dần trong lúc làm.
      </p>
    );
  }

  const needle = q.trim().toLowerCase();
  const match = (...fields: (string | undefined)[]) =>
    !needle || fields.some((f) => f?.toLowerCase().includes(needle));

  const commands = data.commands.filter((c) => match(c.cmd, c.what, c.group, c.note));
  const errors = data.errors.filter((e) =>
    match(e.symptom, e.cause, e.fix, e.tags?.join(' ')),
  );
  const snippets = data.snippets.filter((s) => match(s.title, s.why, s.code));

  const TABS: Array<{ id: Tab; label: string; icon: typeof Terminal; count: number }> = [
    { id: 'commands', label: 'Lệnh hay dùng', icon: Terminal, count: commands.length },
    { id: 'errors', label: 'Lỗi đã gặp', icon: AlertTriangle, count: errors.length },
    { id: 'snippets', label: 'Đoạn code', icon: Wrench, count: snippets.length },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Sổ tay
        </h2>
        <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
          Ghi lại trong lúc làm — lệnh, lỗi, code. Ba tháng nữa không ai nhớ vì sao{' '}
          <code className="font-mono text-xs">memory_type</code> phải là{' '}
          <code className="font-mono text-xs">qio_opi</code>; chỗ này là để nhớ hộ.
        </p>
      </div>

      {/* ── Tìm kiếm ── */}
      <div
        className="flex items-center gap-2 rounded-xl border px-3 py-2"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <Search size={15} style={{ color: 'var(--text-muted)' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo triệu chứng, tên lệnh, từ khoá…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {q && (
          <button onClick={() => setQ('')} className="text-xs" style={{ color: 'var(--text-muted)' }}>
            xoá
          </button>
        )}
      </div>

      {/* ── Chuyển mục ── */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
              style={{
                borderColor: on ? '#22d3ee' : 'var(--border-color)',
                background: on ? 'rgba(34,211,238,0.1)' : 'transparent',
                color: on ? '#0891b2' : 'var(--text-secondary)',
              }}
            >
              <Icon size={14} />
              {t.label}
              <span className="text-xs opacity-70">{t.count}</span>
            </button>
          );
        })}
      </div>

      {tab === 'commands' && <CommandList items={commands} />}
      {tab === 'errors' && <ErrorList items={errors} />}
      {tab === 'snippets' && <SnippetList items={snippets} />}
    </div>
  );
}

// ─── Lệnh ──────────────────────────────────────────────────

function CommandList({ items }: { items: NotebookCommand[] }) {
  if (!items.length) return <Empty />;

  const groups = [...new Set(items.map((c) => c.group))];
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g}>
          <h4 className="mb-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {g}
          </h4>
          <div className="space-y-2">
            {items
              .filter((c) => c.group === g)
              .map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-3"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
                >
                  <div className="flex items-start gap-2">
                    <code
                      className="min-w-0 flex-1 break-all rounded-lg px-3 py-2 font-mono text-[12.5px]"
                      style={{ background: '#0b0d10', color: '#a5f3fc' }}
                    >
                      {c.cmd}
                    </code>
                    <CopyButton text={c.cmd} />
                  </div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {c.what}
                  </p>
                  {c.note && (
                    <p className="mt-1 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                      {c.note}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Lỗi ───────────────────────────────────────────────────

function ErrorList({ items }: { items: NotebookError[] }) {
  if (!items.length) return <Empty />;
  return (
    <div className="space-y-3">
      {items.map((e, i) => (
        <article
          key={i}
          className="rounded-xl border p-4"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          {/* Triệu chứng đứng đầu vì đó là thứ người ta gõ vào ô tìm */}
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
            <p className="font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {e.symptom}
            </p>
          </div>

          <div className="mt-3 space-y-2 pl-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#f59e0b' }}>
                Vì sao
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {e.cause}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#34d399' }}>
                Cách sửa
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {e.fix}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pl-6">
            {e.costMe && (
              <span
                className="rounded px-2 py-0.5 text-[11px]"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
              >
                mất {e.costMe}
              </span>
            )}
            {e.tags?.map((t) => (
              <span
                key={t}
                className="rounded px-2 py-0.5 text-[11px]"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── Code ──────────────────────────────────────────────────

function SnippetList({ items }: { items: NotebookSnippet[] }) {
  if (!items.length) return <Empty />;
  return (
    <div className="space-y-3">
      {items.map((s, i) => (
        <section
          key={i}
          className="rounded-xl border p-4"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          <div className="mb-1 flex items-start justify-between gap-3">
            <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {s.title}
            </h4>
            <CopyButton text={s.code} />
          </div>
          <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {s.why}
          </p>
          <pre
            className="overflow-x-auto rounded-lg p-3 text-[12px] leading-relaxed"
            style={{ background: '#0b0d10', color: '#c9d6e4' }}
          >
            <code>{s.code}</code>
          </pre>
        </section>
      ))}
    </div>
  );
}

// ─── Bits ──────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setDone(true);
        toast.success('Đã sao chép');
        setTimeout(() => setDone(false), 1500);
      }}
      className="shrink-0 rounded-lg p-2"
      style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
      aria-label="Sao chép"
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function Empty() {
  return (
    <p className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
      Không có mục nào khớp.
    </p>
  );
}
