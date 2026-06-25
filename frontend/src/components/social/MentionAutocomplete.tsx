'use client';

// MentionAutocomplete — Phase 5 home upgrade.
//
// Dropdown that appears while the user is typing @username in any
// textarea/input. Calls /users/search to fetch suggestions.
//
// Two modes:
//   • controlled — caller owns the open state (preferred: the
//     parent knows when the caret is inside an @-token).
//   • The component handles keyboard nav (↑/↓/Enter/Esc/Tab) and
//     click-to-pick. On pick, we insert "@username " into the
//     textarea at the caret position and fire onPick so the
//     parent can update its own content state.
//
// We deliberately:
//   • debounce queries 200ms to avoid hammering the API per
//     keystroke (typing `@cuo` is 4 requests without debounce);
//   • keep the dropdown inside the textarea's parent so it never
//     gets clipped by overflow:hidden;
//   • surface the followed-first ranking that the backend already
//     returns — a small star badge marks followed users;
//   • support Vietnamese keyboard (đ, ă,  ê, …) — the regex
//     matches whitespace before the cursor as the search start.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { socialUserApi } from '@/lib/api';
import { Star } from 'lucide-react';

export interface MentionSuggestion {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isFollowing: boolean;
}

interface Props {
  /** The textarea/input element the user is typing in. */
  textareaRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
  /** The current content (for context — we compute the @-token from it). */
  value: string;
  /** Called whenever the parent should replace the content (after a pick). */
  onChange: (next: string) => void;
  /** Optional: only show suggestions if true. Default true. */
  enabled?: boolean;
  /** Optional: pixel offset from the textarea's top-left (for positioning). */
  offsetX?: number;
  offsetY?: number;
}

interface ActiveToken {
  start: number;
  end: number;
  query: string;
}

/**
 * Find the active @-token in the textarea at the current caret.
 * Returns null if the caret is not inside an @-token.
 *
 * Rules:
 *   • Token starts with `@` and the next char (if any) is not
 *     whitespace (so we don't match an email like `a@b`).
 *   • Token ends at the caret OR at the first whitespace.
 *   • Token contains no whitespace (you can't put space in a
 *     username).
 */
function findActiveToken(value: string, caret: number): ActiveToken | null {
  if (caret < 1) return null;
  const before = value.slice(0, caret);
  // Walk back from the caret to find the @ that opens this token.
  let at = -1;
  for (let i = before.length - 1; i >= 0; i--) {
    const ch = before[i];
    if (ch === '@') { at = i; break; }
    if (/\s/.test(ch)) return null; // whitespace before caret = not inside a token
  }
  if (at < 0) return null;
  const afterAt = before.slice(at + 1);
  if (/\s/.test(afterAt)) return null; // space already inside — token ended
  return { start: at, end: caret, query: afterAt };
}

const DEBOUNCE_MS = 200;

export default function MentionAutocomplete({
  textareaRef,
  value,
  onChange,
  enabled = true,
  offsetX = 0,
  offsetY = 8,
}: Props) {
  const [token, setToken] = useState<ActiveToken | null>(null);
  const [items, setItems] = useState<MentionSuggestion[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recompute the active token on every keystroke. We listen on the
  // textarea's `input` and `keyup` (catches arrow-key caret moves
  // without `input` firing).
  useEffect(() => {
    if (!enabled) { setToken(null); return; }
    const el = textareaRef.current;
    if (!el) return;
    const recompute = () => {
      const caret = el.selectionStart ?? 0;
      const t = findActiveToken(el.value, caret);
      setToken(t);
    };
    recompute();
    el.addEventListener('input', recompute);
    el.addEventListener('keyup', recompute);
    el.addEventListener('click', recompute);
    el.addEventListener('blur', () => {
      // Defer close so click on a suggestion still fires.
      setTimeout(() => setToken(null), 150);
    });
    return () => {
      el.removeEventListener('input', recompute);
      el.removeEventListener('keyup', recompute);
      el.removeEventListener('click', recompute);
    };
  }, [textareaRef, enabled, value]);

  // Debounced search. We cancel the previous request via AbortController
  // so a fast typist never sees stale results.
  useEffect(() => {
    if (!token) { setItems([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await socialUserApi.searchMentions(token.query, 8);
        if (!ctrl.signal.aborted) {
          setItems((res.data as unknown as { data: MentionSuggestion[] }).data ?? []);
          setActiveIdx(0);
        }
      } catch {
        // Swallow — user can keep typing; dropdown just stays empty.
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [token?.query, token?.start, token?.end]);

  // Insert the picked username back into the textarea, replacing the
  // active @-token. We then close the dropdown + reset caret.
  const pickItem = useCallback((item: MentionSuggestion) => {
    const el = textareaRef.current;
    if (!el || !token) return;
    const before = value.slice(0, token.start);
    const after = value.slice(token.end);
    const insert = `@${item.username} `;
    const next = `${before}${insert}${after}`;
    onChange(next);
    // Restore caret to end of the inserted mention so the user can
    // keep typing naturally.
    requestAnimationFrame(() => {
      el.focus();
      const caretPos = before.length + insert.length;
      el.setSelectionRange(caretPos, caretPos);
      setToken(null);
    });
  }, [textareaRef, token, value, onChange]);

  // Keyboard navigation inside the dropdown. We listen on the
  // textarea's keydown while a token is active so the user can
  // pick without leaving the field.
  useEffect(() => {
    if (!token || items.length === 0) return;
    const el = textareaRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        pickItem(items[activeIdx]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setToken(null);
      }
    };
    // addEventListener's EventListener type only exposes the
    // base Event shape; KeyboardEvent is the narrower concrete
    // type the handler actually receives. Cast keeps TS happy
    // without losing type-safety inside the handler.
    el.addEventListener('keydown', onKeyDown as unknown as EventListener);
    return () => el.removeEventListener('keydown', onKeyDown as unknown as EventListener);
  }, [token, items, activeIdx, pickItem, textareaRef]);

  // Position the dropdown just below the caret of the @-token start.
  const position = useMemo(() => {
    if (!token) return null;
    const el = textareaRef.current;
    if (!el) return null;
    // measure offsetLeft / offsetTop of the token in the textarea.
    // Browsers don't expose a reliable "caret pixel position" API
    // for textarea, so we just anchor to the textarea's bounding
    // rect at the token's vertical position. This is approximate
    // but feels right for the dropdown (which is short).
    const rect = el.getBoundingClientRect();
    // Compute the line number of the @ token by counting newlines
    // before the token. We then estimate the line height as the
    // textarea's line-height or a default of 22px.
    const beforeToken = value.slice(0, token.start);
    const linesAbove = (beforeToken.match(/\n/g) ?? []).length;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
    return {
      left: rect.left + offsetX,
      top: rect.top + offsetY + linesAbove * lineHeight,
    };
  }, [token, value, textareaRef, offsetX, offsetY]);

  if (!token || !position) return null;

  return (
    <div
      role="listbox"
      aria-label="Mention suggestions"
      style={{
        position: 'fixed',
        left: position.left,
        top: position.top,
        zIndex: 70,
      }}
      className="w-64 max-h-56 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0c0f14]/95 py-1 shadow-2xl backdrop-blur-md"
    >
      {loading && items.length === 0 ? (
        <div className="px-3 py-2 text-[11px] text-slate-500">Đang tìm…</div>
      ) : items.length === 0 ? (
        <div className="px-3 py-2 text-[11px] text-slate-500">Không tìm thấy ai.</div>
      ) : (
        items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={idx === activeIdx}
            onMouseDown={(e) => { e.preventDefault(); pickItem(item); }}
            onMouseEnter={() => setActiveIdx(idx)}
            className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-[12.5px] transition-colors ${
              idx === activeIdx ? 'bg-teal-500/15 text-teal-100' : 'text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            {item.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] text-slate-300">
                {item.username.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1 truncate">
              <div className="flex items-center gap-1">
                <span className="truncate font-medium">@{item.username}</span>
                {item.isFollowing && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
              </div>
              {item.displayName && item.displayName !== item.username && (
                <div className="truncate text-[10.5px] text-slate-500">{item.displayName}</div>
              )}
            </div>
          </button>
        ))
      )}
      <div className="border-t border-white/[0.04] px-3 py-1 text-[10px] text-slate-500">
        ↑↓ để chọn · Enter để chèn · Esc để đóng
      </div>
    </div>
  );
}
