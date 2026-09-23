'use client';

/** Menu AI của một thẻ: việc một chạm tuỳ theo loại thẻ, mở ngăn AI và chạy ngay. */

import { useRef, type ReactNode } from 'react';
import { BookOpenCheck, Bug, FileText, FlaskConical, MessageCircleQuestion, Sparkles, Split } from 'lucide-react';
import type { AiQuickTask, ProjectConfig } from '@/lib/work-api';
import { Popover, useToggle } from '../ui';
import { openAiPanel } from './store';

interface Item { label: string; icon: ReactNode; task?: AiQuickTask }

function itemsFor(typeKey: string): Item[] {
  const t = typeKey.toUpperCase();
  const items: Item[] = [{ label: 'Summarize', icon: <FileText size={14} />, task: 'summarize' }];
  if (t === 'EPIC') items.push({ label: 'Break into stories', icon: <Split size={14} />, task: 'split' });
  if (t === 'STORY' || t === 'TASK' || t === 'BUG') items.push({ label: 'Split into sub-tasks', icon: <Split size={14} />, task: 'split' });
  if (t === 'STORY' || t === 'REQUIREMENT') items.push({ label: 'Generate test cases', icon: <FlaskConical size={14} />, task: 'generate_tests' });
  if (t === 'BUG') items.push({ label: 'Improve bug report', icon: <Bug size={14} />, task: 'improve_bug' });
  if (t === 'STORY' || t === 'REQUIREMENT') items.push({ label: 'Review story quality', icon: <BookOpenCheck size={14} />, task: 'review_story' });
  items.push({ label: 'Ask about this issue', icon: <MessageCircleQuestion size={14} /> });
  return items;
}

export default function AiIssueMenu({ config, issueNumber, typeKey }: { config: ProjectConfig; issueNumber: number; typeKey: string }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const menu = useToggle();
  if (!config.permissions.useAi) return null;
  const items = itemsFor(typeKey);

  const run = (it: Item) => {
    menu.close();
    openAiPanel({
      pid: config.id,
      issueNumber,
      quick: it.task ? { task: it.task, issueNumber, label: it.label } : null,
    });
  };

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className="w-btn w-btn-sm"
        onClick={menu.toggle}
        aria-haspopup="menu"
        aria-expanded={menu.on}
        title="AI actions"
      >
        <Sparkles size={13} className="text-[var(--w-accent-text)]" />
        <span className="max-md:hidden">AI</span>
      </button>
      <Popover open={menu.on} onClose={menu.close} anchorRef={anchor} width={224} align="end">
        <div
          role="menu"
          aria-label={`AI actions for ${config.key}-${issueNumber}`}
          className="p-1"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            e.preventDefault();
            const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
            const i = btns.indexOf(document.activeElement as HTMLButtonElement);
            const next = e.key === 'ArrowDown' ? (i + 1) % btns.length : (i - 1 + btns.length) % btns.length;
            btns[next]?.focus();
          }}
        >
          {items.map((it, i) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              autoFocus={i === 0}
              onClick={() => run(it)}
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] text-[var(--w-text)] outline-none hover:bg-[var(--w-hover)] focus:bg-[var(--w-hover)]"
            >
              <span className="flex w-4 shrink-0 justify-center text-[var(--w-text-2)]">{it.icon}</span>
              {it.label}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
