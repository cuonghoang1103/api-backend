'use client';

/**
 * CT Work — ngăn trợ lý AI bên phải. Gắn MỘT lần ở layout; mọi nút "Ask AI" /
 * menu AI của thẻ chỉ gọi openAiPanel() trong store.
 *
 * AI không tự ghi gì: câu trả lời đi kèm các đề xuất (ActionCard) và chỉ khi
 * người dùng bấm Apply thì thay đổi mới xảy ra.
 *
 * Lịch sử hội thoại giữ theo từng dự án (state + sessionStorage, bọc try/catch
 * vì trình duyệt riêng tư có thể ném lỗi) và chỉ gửi 10 lượt gần nhất.
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import { toast } from 'sonner';
import { AlertTriangle, ArrowUp, Sparkles, Trash2, X } from 'lucide-react';
import {
  isAiQuotaError, workApi, workError, workErrorStatus,
  type AiAnswer, type AiQuickTask, type AiQuota, type ProjectConfig,
} from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { wk } from '../hooks';
import { Spinner, WorkPortal } from '../ui';
import { ActionGroup, type ActionItem } from './ActionCard';
import UpgradeDialog from './UpgradeDialog';
import { useAiPanel, type AiQuickRequest } from './store';

// ─── Kiểu + lưu trữ ──────────────────────────────────────────────

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Tiêu đề cho lượt do việc một chạm sinh ra ("Split into sub-tasks"). */
  title?: string;
  actions?: ActionItem[];
}

const QUOTA_KEY = ['work', 'ai-quota'] as const;
const MAX_HISTORY = 10;
const MAX_STORED = 40;
const storeKey = (pid: number) => `ctwork-ai:${pid}`;

export const QUICK_TITLES: Record<AiQuickTask, string> = {
  write_story: 'Write a user story',
  split: 'Split into sub-tasks',
  generate_tests: 'Generate test cases',
  improve_bug: 'Improve bug report',
  summarize: 'Summarize',
  review_story: 'Review story quality',
  meeting_notes: 'Meeting notes to tasks',
};

let seq = 0;
const uid = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

function loadTurns(pid: number): Turn[] {
  try {
    const raw = sessionStorage.getItem(storeKey(pid));
    if (!raw) return [];
    const turns = JSON.parse(raw) as Turn[];
    if (!Array.isArray(turns)) return [];
    // Một lượt Apply đang chạy dở khi tải lại trang thì không biết kết quả — cho bấm lại.
    return turns.map((t) => ({
      ...t,
      actions: t.actions?.map((a) => (a.status === 'applying' ? { ...a, status: 'pending' as const } : a)),
    }));
  } catch {
    return [];
  }
}

function saveTurns(pid: number, turns: Turn[]) {
  try {
    if (!turns.length) sessionStorage.removeItem(storeKey(pid));
    else sessionStorage.setItem(storeKey(pid), JSON.stringify(turns.slice(-MAX_STORED)));
  } catch { /* hết chỗ / chế độ riêng tư — chỉ mất lịch sử khi tải lại */ }
}

function toActionItems(a: AiAnswer): ActionItem[] {
  return (a.actions ?? []).map((action) => ({ id: uid(), action, status: 'pending' }));
}

// ─── Markdown ────────────────────────────────────────────────────

/** Chữ của AI luôn đi qua bộ dựng markdown (không bao giờ in thô); HTML thô bị lọc. */
const AiMarkdown = memo(function AiMarkdown({ text }: { text: string }) {
  return (
    <div className="w-prose !text-[13.5px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ node: _n, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          table: ({ node: _n, ...props }) => (
            <div className="mb-2 overflow-x-auto">
              <table {...props} className="w-full border-collapse text-[12.5px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:bg-[var(--w-sunken)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left" />
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
});

// ─── Host ────────────────────────────────────────────────────────

export default function AiPanelHost() {
  const { open, pid, issueNumber, quick, closeAiPanel, clearIssue, clearQuick } = useAiPanel();
  const { data: config } = useQuery({
    queryKey: wk.project(pid ?? 0),
    queryFn: () => workApi.project(pid!),
    enabled: open && !!pid,
    staleTime: 60_000,
  });
  if (!open || !pid) return null;
  return (
    <AiPanel
      pid={pid}
      config={config}
      issueNumber={issueNumber}
      quick={quick}
      onClose={closeAiPanel}
      onClearIssue={clearIssue}
      onQuickTaken={clearQuick}
    />
  );
}

function AiPanel({ pid, config, issueNumber, quick, onClose, onClearIssue, onQuickTaken }: {
  pid: number;
  config: ProjectConfig | undefined;
  issueNumber: number | null;
  quick: AiQuickRequest | null;
  onClose: () => void;
  onClearIssue: () => void;
  onQuickTaken: () => void;
}) {
  const qc = useQueryClient();
  const [conv, setConv] = useState<{ pid: number; turns: Turn[] }>(() => ({ pid, turns: loadTurns(pid) }));
  const [draft, setDraft] = useState('');
  const [waiting, setWaiting] = useState<string | null>(null); // nhãn của việc đang chờ
  const [unavailable, setUnavailable] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const pidRef = useRef(pid);
  pidRef.current = pid;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: quota } = useQuery({ queryKey: QUOTA_KEY, queryFn: workApi.aiQuota, staleTime: 30_000 });

  // Đổi dự án ⇒ nạp hội thoại của dự án đó.
  useEffect(() => {
    setConv((c) => (c.pid === pid ? c : { pid, turns: loadTurns(pid) }));
    setUnavailable(false);
  }, [pid]);
  useEffect(() => saveTurns(conv.pid, conv.turns), [conv]);

  const turns = useMemo(() => (conv.pid === pid ? conv.turns : []), [conv, pid]);
  const key = config?.key ?? '';
  const issueKey = issueNumber ? `${key}-${issueNumber}` : null;

  /** Thêm lượt vào đúng dự án đã hỏi (người dùng có thể đã chuyển dự án hoặc đóng ngăn khi chờ). */
  const append = useCallback((forPid: number, ...add: Turn[]) => {
    if (mounted.current && pidRef.current === forPid) setConv((c) => (c.pid === forPid ? { ...c, turns: [...c.turns, ...add] } : c));
    else saveTurns(forPid, [...loadTurns(forPid), ...add]);
  }, []);

  const removeTurn = useCallback((id: string) => {
    setConv((c) => ({ ...c, turns: c.turns.filter((t) => t.id !== id) }));
  }, []);

  const updateAction = useCallback((turnId: string, actionId: string, patch: Partial<ActionItem>) => {
    setConv((c) => ({
      ...c,
      turns: c.turns.map((t) => (t.id !== turnId ? t : {
        ...t,
        actions: t.actions?.map((a) => (a.id === actionId ? { ...a, ...patch } : a)),
      })),
    }));
  }, []);

  const onQuota = useCallback((q: AiQuota | undefined) => {
    if (q) qc.setQueryData(QUOTA_KEY, q);
    else qc.invalidateQueries({ queryKey: QUOTA_KEY });
  }, [qc]);

  const handleError = useCallback((err: unknown) => {
    if (isAiQuotaError(err)) setUpgrade(true);
    else if (workErrorStatus(err) === 503) setUnavailable(true);
    else toast.error(workError(err, 'The AI assistant could not answer'));
    qc.invalidateQueries({ queryKey: QUOTA_KEY });
  }, [qc]);

  // ── Hỏi tự do ──
  const send = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || waiting) return;
    const forPid = pid;
    const history = turns.slice(-MAX_HISTORY).map((t) => ({ role: t.role, content: t.content }));
    const userTurn: Turn = { id: uid(), role: 'user', content: message };
    append(forPid, userTurn);
    setDraft('');
    setWaiting('Thinking');
    setUnavailable(false);
    try {
      const a = await workApi.aiChat(forPid, { message, history, issueNumber });
      append(forPid, { id: uid(), role: 'assistant', content: a.reply, actions: toActionItems(a) });
      onQuota(a.quota);
    } catch (err) {
      // Hỏi hỏng thì trả câu hỏi về ô soạn để gửi lại, không để một lượt "treo" trong lịch sử.
      if (pidRef.current === forPid) {
        removeTurn(userTurn.id);
        setDraft((d) => d || message);
      }
      handleError(err);
    } finally {
      setWaiting(null);
    }
  }, [waiting, pid, turns, issueNumber, append, removeTurn, onQuota, handleError]);

  // ── Việc một chạm từ store: chạy ngay khi mở ──
  const ranQuick = useRef<AiQuickRequest | null>(null);
  useEffect(() => {
    if (!quick || ranQuick.current === quick) return;
    ranQuick.current = quick;
    onQuickTaken();
    const forPid = pid;
    const title = quick.label ?? QUICK_TITLES[quick.task];
    setWaiting(title);
    setUnavailable(false);
    workApi.aiQuick(forPid, { task: quick.task, issueNumber: quick.issueNumber ?? null, text: quick.text ?? null })
      .then((a) => {
        append(forPid, { id: uid(), role: 'assistant', title, content: a.reply, actions: toActionItems(a) });
        onQuota(a.quota);
      })
      .catch(handleError)
      .finally(() => setWaiting(null));
  }, [quick, pid, onQuickTaken, append, onQuota, handleError]);

  // ── Cuộn xuống cuối khi có lượt mới ──
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length, waiting]);

  // ── Focus + Esc ──
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => prev?.focus?.();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return; // hộp thoại (Upgrade…) đóng trước
      e.preventDefault(); // IssueDrawer phía dưới bỏ qua Esc này
      onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const clearConversation = () => {
    if (waiting) return;
    setConv({ pid, turns: [] });
    inputRef.current?.focus();
  };

  const fill = (text: string) => {
    setDraft(text);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const suggestions = [
    'What should I work on next?',
    'Is our sprint on track?',
    'Write user stories for a login feature',
    'Turn these meeting notes into tasks:\n\n',
    'Who is overloaded right now?',
    issueKey ? `Draft test cases for ${issueKey}` : 'Draft test cases for the selected issue',
  ];

  const aiOff = unavailable || quota?.available === false;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[65] bg-black/20 sm:hidden" onMouseDown={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="AI assistant"
        className="fixed inset-y-0 right-0 z-[66] flex w-full flex-col border-l border-[var(--w-border)] bg-[var(--w-bg)] sm:w-[420px]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        {/* Đầu ngăn */}
        <div className="flex shrink-0 items-start gap-2 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
            <Sparkles size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold">AI assistant</h2>
              {key && <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-mono text-[11px] text-[var(--w-text-2)]">{key}</span>}
            </div>
            <div className="mt-0.5 h-[18px] text-[12px] text-[var(--w-text-3)]">
              {quota ? <QuotaChip quota={quota} /> : null}
            </div>
          </div>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={clearConversation} disabled={!turns.length || !!waiting} aria-label="Clear conversation" title="Clear conversation">
            <Trash2 size={14} />
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label="Close AI assistant" title="Close (Esc)">
            <X size={15} />
          </button>
        </div>

        {/* Hội thoại */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
          {!turns.length && !waiting ? (
            <EmptyState suggestions={suggestions} onPick={fill} disabled={aiOff} />
          ) : (
            <div className="space-y-4">
              {turns.map((t) => (t.role === 'user' ? (
                <div key={t.id} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[12px] rounded-br-[4px] bg-[var(--w-accent)] px-3 py-2 text-[13.5px] leading-relaxed text-white">
                    {t.content}
                  </div>
                </div>
              ) : (
                <div key={t.id}>
                  <div className="rounded-[12px] rounded-bl-[4px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
                    {t.title && (
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]">
                        <Sparkles size={11} /> {t.title}
                      </div>
                    )}
                    {t.content ? <AiMarkdown text={t.content} /> : <span className="text-[13px] text-[var(--w-text-3)]">No answer.</span>}
                  </div>
                  {config && t.actions?.length ? (
                    <ActionGroup config={config} items={t.actions} onUpdate={(id, patch) => updateAction(t.id, id, patch)} />
                  ) : null}
                </div>
              )))}
              {waiting && <Typing label={waiting} />}
            </div>
          )}
        </div>

        {/* Soạn */}
        <div className="shrink-0 border-t border-[var(--w-border)] bg-[var(--w-panel)] px-4 pb-3 pt-2.5">
          {aiOff && (
            <div className="mb-2 flex items-start gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-2.5 py-2 text-[12px] text-[var(--w-text)]">
              <AlertTriangle size={14} className="mt-[1px] shrink-0 text-[var(--w-orange)]" />
              AI is temporarily unavailable. Please try again in a little while.
            </div>
          )}
          {issueKey && (
            <div className="mb-2 flex">
              <span className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] pl-2 pr-0.5 text-[11.5px] text-[var(--w-accent-text)]">
                About <span className="font-mono">{issueKey}</span>
                <button type="button" onClick={onClearIssue} aria-label={`Stop asking about ${issueKey}`} className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full hover:bg-[var(--w-hover)]">
                  <X size={11} />
                </button>
              </span>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-[8px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] p-1.5 focus-within:border-[var(--w-accent-border)] focus-within:shadow-[0_0_0_3px_var(--w-accent-soft)]">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              disabled={!!waiting}
              rows={3}
              maxLength={8000}
              placeholder={issueKey ? `Ask about ${issueKey}…` : 'Ask anything about this project…'}
              aria-label="Message the AI assistant"
              className="max-h-[200px] min-h-[64px] flex-1 resize-none bg-transparent px-1.5 py-1 text-[13.5px] leading-relaxed text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)] disabled:opacity-60"
            />
            <button
              type="button"
              className="w-btn w-btn-primary w-btn-icon !h-[30px] !w-[30px] shrink-0"
              onClick={() => send(draft)}
              disabled={!draft.trim() || !!waiting}
              aria-label="Send"
              title="Send (⌘/Ctrl+Enter)"
            >
              {waiting ? <Spinner size={13} /> : <ArrowUp size={15} />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-[var(--w-text-3)]">
            The AI only suggests changes. Nothing happens until you click Apply. <span className="max-sm:hidden">⌘/Ctrl+Enter to send.</span>
          </p>
        </div>
      </div>

      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} limit={quota?.limit} />
    </WorkPortal>
  );
}

// ─── Mảnh nhỏ ────────────────────────────────────────────────────

function QuotaChip({ quota }: { quota: AiQuota }) {
  if (quota.pro) {
    return (
      <span className="inline-flex h-[18px] items-center gap-1 rounded-full bg-[var(--w-accent-soft)] px-2 text-[11px] font-semibold text-[var(--w-accent-text)]">
        <Sparkles size={10} /> Pro
      </span>
    );
  }
  if (quota.limit == null) return null;
  const left = Math.max(0, quota.remaining ?? quota.limit - quota.used);
  return (
    <span className={cn('text-[12px]', left === 0 ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
      {left} of {quota.limit} free request{quota.limit === 1 ? '' : 's'} left today
    </span>
  );
}

function Typing({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-[var(--w-text-3)]" role="status">
      <span className="inline-flex items-center gap-1 rounded-[12px] rounded-bl-[4px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--w-text-3)]" style={{ animationDelay: `${d}ms` }} />
        ))}
      </span>
      {label}…
    </div>
  );
}

function EmptyState({ suggestions, onPick, disabled }: { suggestions: string[]; onPick: (s: string) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-col items-center px-2 pt-6 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
        <Sparkles size={19} />
      </span>
      <div className="mt-3 text-[14px] font-semibold">How can I help with this project?</div>
      <p className="mt-1 max-w-[320px] text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
        I can plan work, write stories and test cases, and check sprint health. I&apos;ll propose changes for you to review.
      </p>
      <div className="mt-5 flex w-full flex-col gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s)}
            className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left text-[13px] text-[var(--w-text)] transition-colors hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)] disabled:opacity-50"
          >
            {s.trim().replace(/:$/, '')}
          </button>
        ))}
      </div>
    </div>
  );
}
