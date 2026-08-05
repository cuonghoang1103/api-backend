'use client';

/**
 * Bảng khai báo đầu tệp component (YAML frontmatter).
 *
 * Đây là phần Claude Code THẬT SỰ đọc để quyết định khi nào kích hoạt
 * component, nên nó đáng được bày rõ chứ không giấu đi — trang gốc chọn cách
 * giấu hẳn và chỉ để bốn nút nhỏ, mất luôn thông tin hữu ích nhất.
 *
 * Ba việc phải làm cho nó ĐỌC ĐƯỢC (bản đầu tiên bỏ cả ba và ra một bức tường
 * chữ có `\n` lẫn `<example>` — lỗi đã lên production ngày 05/08/2026):
 *
 * 1. `description` của agent nhét sẵn vài đoạn hội thoại mẫu bằng thẻ giả
 *    `<example>`. Bóc ra thành thẻ riêng, mỗi vai một dòng.
 * 2. Giá trị dài thì thu gọn — có `description` lên tới 3.000 ký tự, để nguyên
 *    là đẩy nội dung thật xuống dưới màn hình thứ hai.
 * 3. `\n` còn sót do tệp gốc escape hai lần → đổi thành xuống dòng thật
 *    (`normalizeEscapes`, xem chú thích ở `examples.ts`).
 */

import { useMemo, useState } from 'react';
import { ChevronDown, MessageSquare, Quote, User, Bot, Lightbulb } from 'lucide-react';
import type { FrontmatterEntry } from '@/lib/ai-templates/frontmatter';
import {
  normalizeEscapes,
  parseAgentDescription,
  type AgentExample,
} from '@/lib/ai-templates/examples';

/** Quá ngưỡng này thì gấp lại. Đủ cho một đoạn mô tả bình thường. */
const CLAMP_AT = 320;

function ExampleCard({ ex, index }: { ex: AgentExample; index: number }) {
  const rows: { icon: React.ReactNode; label: string; text: string; mono?: boolean }[] = [];
  if (ex.context) rows.push({ icon: <Quote size={11} />, label: 'Bối cảnh', text: ex.context });
  if (ex.user) rows.push({ icon: <User size={11} />, label: 'Người dùng', text: ex.user });
  if (ex.assistant) rows.push({ icon: <Bot size={11} />, label: 'Claude', text: ex.assistant });
  if (ex.rest) rows.push({ icon: <MessageSquare size={11} />, label: 'Khác', text: ex.rest });

  return (
    <li className="min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]">
        Ví dụ {index + 1}
      </p>
      <dl className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)]">
              {r.icon}
              {r.label}
            </dt>
            <dd className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              {r.text}
            </dd>
          </div>
        ))}
      </dl>
      {ex.commentary && (
        <p className="mt-2.5 flex gap-1.5 rounded-md border-l-2 border-[var(--accent-color)] bg-[var(--bg-surface)] px-2.5 py-2 text-[12px] leading-relaxed text-[var(--text-muted)]">
          <Lightbulb size={12} className="mt-0.5 shrink-0 text-[var(--accent-color)]" />
          <span className="whitespace-pre-wrap">{ex.commentary}</span>
        </p>
      )}
    </li>
  );
}

function LongValue({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > CLAMP_AT;

  return (
    <>
      <span className="whitespace-pre-wrap">
        {long && !open ? `${text.slice(0, CLAMP_AT).trimEnd()}…` : text}
      </span>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-1.5 whitespace-nowrap text-[12px] text-[var(--accent-color)] underline-offset-2 hover:underline"
        >
          {open ? 'Thu gọn' : 'Xem đầy đủ'}
        </button>
      )}
    </>
  );
}

function DescriptionValue({ value }: { value: string }) {
  const parsed = useMemo(() => parseAgentDescription(value), [value]);
  const [showEx, setShowEx] = useState(false);

  if (parsed.examples.length === 0) {
    return <LongValue text={normalizeEscapes(value).trim()} />;
  }

  return (
    <div className="min-w-0">
      <LongValue text={parsed.intro} />

      <button
        type="button"
        onClick={() => setShowEx((v) => !v)}
        aria-expanded={showEx}
        className="mt-2 flex items-center gap-1.5 rounded-md border border-[var(--border-color)] px-2 py-1 text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
      >
        <ChevronDown size={12} className={`transition-transform ${showEx ? 'rotate-180' : ''}`} />
        {parsed.examples.length} ví dụ về lúc nào component này được gọi
      </button>

      {showEx && (
        <ul className="mt-2.5 grid gap-2">
          {parsed.examples.map((ex, i) => (
            <ExampleCard key={i} ex={ex} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FrontmatterPanel({ entries }: { entries: FrontmatterEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <dl className="mb-3 grid gap-x-4 gap-y-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
      {entries.map((e) => (
        <div key={e.key} className="contents">
          <dt className="font-mono text-[11.5px] uppercase tracking-wide text-[var(--text-muted)]">
            {e.key}
          </dt>
          <dd className="mb-2 min-w-0 text-[12.5px] leading-relaxed text-[var(--text-secondary)] sm:mb-0">
            {e.key === 'description' ? (
              <DescriptionValue value={e.value} />
            ) : (
              <LongValue text={normalizeEscapes(e.value).trim()} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
