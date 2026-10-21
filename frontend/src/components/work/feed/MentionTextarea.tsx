'use client';

/**
 * Ô chữ có gợi ý @nhắc cho bảng tin (bài + bình luận). Người gợi ý = người ĐỌC ĐƯỢC phạm vi bài (`/feed/mentionable`, cache
 * theo phạm vi) — gõ đúng tên người ngoài phạm vi thì máy chủ cũng không báo. ↑↓ chọn, Enter/Tab chèn, Esc đóng.
 * `onSubmit` + `submitOnEnter`: Enter gửi (Shift+Enter xuống dòng); đang gõ IME (Telex/VNI) thì Enter không gửi.
 */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { userName } from '@/lib/work-api';
import { applyMention, mentionQuery } from '@/lib/work-chat-rules';
import { feedApi } from '@/lib/work-feed-api';
import { UserAvatar } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

export interface MentionTextareaHandle { focus: () => void; insert: (s: string) => void; el: () => HTMLTextAreaElement | null }

export const MentionTextarea = forwardRef<MentionTextareaHandle, {
  value: string; onChange: (v: string) => void; scope: { workspaceId: number; projectId: number | null } | null;
  placeholder?: string; maxRows?: number; minRows?: number; className?: string; onSubmit?: () => void; submitOnEnter?: boolean;
  onPasteFiles?: (files: File[]) => void; ariaLabel: string; autoFocus?: boolean; maxLength?: number; onEscape?: () => void; id?: string;
}>(function MentionTextarea(p, ref) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [sel, setSel] = useState(0);
  const people = useQuery({
    queryKey: ['work', 'feed', 'mentionable', p.scope?.workspaceId ?? 0, p.scope?.projectId ?? 0],
    queryFn: () => feedApi.mentionable({ workspaceId: p.scope!.workspaceId, projectId: p.scope!.projectId }),
    enabled: !!p.scope && !!mention,
    staleTime: 5 * 60_000,
  });
  const suggestions = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return (people.data?.users ?? []).filter((u) => !q || u.username.toLowerCase().includes(q) || userName(u).toLowerCase().includes(q)).slice(0, 8);
  }, [mention, people.data]);

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    insert: (s: string) => {
      const el = ta.current;
      const start = el?.selectionStart ?? p.value.length;
      const end = el?.selectionEnd ?? p.value.length;
      p.onChange(p.value.slice(0, start) + s + p.value.slice(end));
      requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + s.length, start + s.length); });
    },
    el: () => ta.current,
  }));

  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = 'auto';
    const line = 22;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, (p.minRows ?? 1) * line + 16), (p.maxRows ?? 12) * line + 16)}px`;
  }, [p.value, p.minRows, p.maxRows]);
  useEffect(() => { if (p.autoFocus) setTimeout(() => ta.current?.focus(), 0); }, [p.autoFocus]);

  const pick = (u: { username: string }) => {
    if (!mention) return;
    const r = applyMention(p.value, mention, u.username);
    p.onChange(r.text);
    setMention(null);
    requestAnimationFrame(() => { ta.current?.focus(); ta.current?.setSelectionRange(r.caret, r.caret); });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ime = composing.current || e.nativeEvent.isComposing || e.keyCode === 229;
    if (mention && suggestions.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + suggestions.length) % suggestions.length); return; }
      if ((e.key === 'Enter' || e.key === 'Tab') && !ime) { e.preventDefault(); pick(suggestions[Math.min(sel, suggestions.length - 1)]); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setMention(null); return; }
    }
    if (e.key === 'Escape' && p.onEscape) { e.preventDefault(); p.onEscape(); return; }
    if (e.key === 'Enter' && !ime && ((p.submitOnEnter && !e.shiftKey) || e.metaKey || e.ctrlKey)) { e.preventDefault(); p.onSubmit?.(); }
  };

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length && p.onPasteFiles) { e.preventDefault(); p.onPasteFiles(files); }
  };

  return (
    <div className="relative min-w-0 flex-1">
      <textarea
        id={p.id}
        ref={ta}
        value={p.value}
        rows={p.minRows ?? 1}
        maxLength={p.maxLength}
        aria-label={p.ariaLabel}
        placeholder={p.placeholder}
        onChange={(e) => {
          p.onChange(e.target.value);
          setMention(mentionQuery(e.target.value, e.target.selectionStart ?? e.target.value.length));
          setSel(0);
        }}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onCompositionStart={() => { composing.current = true; }}
        onCompositionEnd={() => { composing.current = false; }}
        onBlur={() => setTimeout(() => setMention(null), 150)}
        className={cn('block w-full resize-none bg-transparent text-[14px] leading-[22px] text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)]', p.className)}
      />
      {mention && suggestions.length > 0 && (
        <ul role="listbox" aria-label={wt('chat.mentionSomeone')} className="absolute left-0 top-full z-40 mt-1 max-h-[260px] w-[300px] max-w-[calc(100vw-48px)] overflow-y-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)] p-1" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
          {suggestions.map((u, i) => (
            <li key={u.id} role="option" aria-selected={i === sel}>
              <button type="button" className={cn('flex h-9 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px]', i === sel ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
                onMouseDown={(e) => { e.preventDefault(); pick(u); }}>
                <UserAvatar user={u} size={22} />
                <span className="min-w-0 flex-1 truncate">{userName(u)}</span>
                <span className="shrink-0 text-[11.5px] text-[var(--w-text-3)]">@{u.username}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
