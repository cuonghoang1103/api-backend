'use client';

/**
 * CT Work — ngăn trợ lý AI bên phải. Gắn MỘT lần ở layout; mọi nút "Ask AI" /
 * menu AI của thẻ chỉ gọi openAiPanel() trong store.
 *
 * AI không tự ghi gì: câu trả lời đi kèm các đề xuất (ActionCard) và chỉ khi
 * người dùng bấm Apply thì thay đổi mới xảy ra.
 *
 * Hội thoại LƯU Ở SERVER theo dự án (25/09/2026): đóng khung / tải lại / đổi máy
 * không mất; cả nhóm xem được hội thoại của nhau (ghi tên người hỏi) và hỏi tiếp.
 * Người tạo có thể đặt hội thoại thành riêng tư. Đề xuất AI lưu kèm trạng thái
 * "đã áp dụng bởi @ai" — server khoá để hai người không áp dụng trùng.
 */

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize from 'rehype-sanitize';
import { toast } from 'sonner';
import { AlertTriangle, ArrowUp, History, Lock, RotateCcw, Search, Sparkles, Square, SquarePen, Trash2, Users, X } from 'lucide-react';
import {
  isAiQuotaError, workApi, workError, workErrorStatus,
  type AiMessage, type AiQuickTask, type AiQuota, type ProjectConfig,
} from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { wk } from '../hooks';
import { relativeTime, Spinner, UserAvatar, WorkPortal } from '../ui';
import { ActionGroup, type ActionItem } from './ActionCard';
import UpgradeDialog from './UpgradeDialog';
import { useAiPanel, type AiQuickRequest } from './store';

// ─── Kiểu + lưu trữ ──────────────────────────────────────────────

const QUOTA_KEY = ['work', 'ai-quota'] as const;
const threadKey = (pid: number, tid: number) => ['work', 'ai-thread', pid, tid] as const;
const threadsKey = (pid: number) => ['work', 'ai-threads', pid] as const;

export const QUICK_TITLES: Record<AiQuickTask, string> = {
  write_story: 'Write a user story',
  split: 'Split into sub-tasks',
  generate_tests: 'Generate test cases',
  improve_bug: 'Improve bug report',
  summarize: 'Summarize',
  review_story: 'Review story quality',
  meeting_notes: 'Meeting notes to tasks',
};

/**
 * Hội thoại đang mở của từng dự án — chỉ là tiện ích PER-VIEWER (mở lại khung
 * thì về đúng chỗ đang đọc). Nội dung hội thoại nằm ở SERVER, không ở đây.
 */
const lastKey = (pid: number) => `ctwork-ai-thread:${pid}`;
function loadLast(pid: number): number | null {
  try {
    const n = Number(localStorage.getItem(lastKey(pid)));
    return Number.isInteger(n) && n > 0 ? n : null;
  } catch { return null; }
}
function saveLast(pid: number, tid: number | null) {
  try {
    if (tid) localStorage.setItem(lastKey(pid), String(tid));
    else localStorage.removeItem(lastKey(pid));
    sessionStorage.removeItem(`ctwork-ai:${pid}`); // lịch sử kiểu cũ (chỉ trong tab) — dọn đi
  } catch { /* chế độ riêng tư — chỉ mất chỗ đang đọc */ }
}

/** Đề xuất lưu ở server ⇒ thẻ ActionCard. "Đã áp dụng bởi @ai" để cả nhóm biết ai đã bấm. */
function storedItems(m: AiMessage): ActionItem[] {
  return m.actions.map((a) => ({
    id: `${m.id}:${a.index}`,
    action: a.action,
    status: a.status,
    summary: a.status === 'done' ? `${a.summary ?? 'Applied'}${a.byName ? ` · by @${a.byName}` : ''}` : a.summary,
    number: a.number,
    error: a.status === 'applying' && a.byName ? `@${a.byName} is applying this…` : a.error,
  }));
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
  const meId = useAuthStore((s) => s.user?.id);
  const [threadId, setThreadId] = useState<number | null>(() => loadLast(pid));
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [draft, setDraft] = useState('');
  /** Câu vừa gửi, hiện ngay trong lúc chờ server lưu + AI trả lời. */
  const [pendingQ, setPendingQ] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<string | null>(null);
  const [newPrivate, setNewPrivate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const waitGen = useRef(0);
  const [unavailable, setUnavailable] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  /** Sửa tại chỗ của người đang xem (ô sửa đề xuất, trạng thái đang bấm) — phủ lên trạng thái server. */
  const [overlay, setOverlay] = useState<Record<string, Partial<ActionItem>>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: quota } = useQuery({ queryKey: QUOTA_KEY, queryFn: workApi.aiQuota, staleTime: 30_000 });

  const selectThread = useCallback((tid: number | null) => {
    setThreadId(tid);
    saveLast(pid, tid);
    setOverlay({});
    setConfirmDelete(false);
  }, [pid]);

  // Đổi dự án ⇒ về hội thoại đang mở của dự án đó.
  const shownPid = useRef(pid);
  useEffect(() => {
    if (shownPid.current === pid) return;
    shownPid.current = pid;
    setThreadId(loadLast(pid));
    setView('chat');
    setOverlay({});
    setUnavailable(false);
  }, [pid]);

  // Hội thoại đang mở — đọc từ server, tự làm mới để thấy người khác vừa hỏi gì.
  const threadQ = useQuery({
    queryKey: threadKey(pid, threadId ?? 0),
    queryFn: () => workApi.aiThread(pid, threadId!),
    enabled: !!threadId && view === 'chat',
    refetchInterval: waiting ? false : 15_000,
    retry: (n, err) => workErrorStatus(err) !== 404 && n < 2,
  });
  // Hội thoại đã bị xoá / chuyển riêng tư ⇒ về màn trống, không kẹt lỗi.
  useEffect(() => {
    if (threadQ.isError && workErrorStatus(threadQ.error) === 404) selectThread(null);
  }, [threadQ.isError, threadQ.error, selectThread]);
  const thread = threadId && threadQ.data?.id === threadId ? threadQ.data : null;
  const messages = thread?.messages ?? [];

  const key = config?.key ?? '';
  const issueKey = issueNumber ? `${key}-${issueNumber}` : null;

  const refresh = useCallback(async (tid: number | null) => {
    await Promise.all([
      tid ? qc.invalidateQueries({ queryKey: threadKey(pid, tid) }) : Promise.resolve(),
      qc.invalidateQueries({ queryKey: threadsKey(pid) }),
    ]);
  }, [qc, pid]);

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

  /** Hội thoại để ghi vào: đang mở thì dùng, chưa có thì tạo (TRƯỚC câu hỏi — xem createThread). */
  const ensureThread = useCallback(async (title: string): Promise<number> => {
    if (threadId) return threadId;
    const t = await workApi.aiCreateThread(pid, { title, issueNumber, visibility: newPrivate ? 'PRIVATE' : 'PROJECT' });
    qc.setQueryData(threadKey(pid, t.id), t);
    selectThread(t.id);
    return t.id;
  }, [threadId, pid, issueNumber, newPrivate, qc, selectThread]);

  // ── Hỏi tự do ──
  const send = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || waiting) return;
    setPendingQ(message);
    setDraft('');
    setWaiting(CHAT_WAIT);
    setUnavailable(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const gen = ++waitGen.current;
    let tid: number | null = threadId;
    try {
      tid = await ensureThread(message);
      const a = await workApi.aiChatAbortable(pid, { message, issueNumber, threadId: tid }, ctrl.signal);
      onQuota(a.quota);
    } catch (err) {
      // Server đã LƯU câu hỏi (kèm dấu lỗi + nút Retry) nếu request tới được nó.
      // Chỉ khi câu hỏi không có trong hội thoại mới trả nó về ô soạn để khỏi gõ lại.
      const fresh = tid ? await workApi.aiThread(pid, tid).catch(() => null) : null;
      const saved = fresh?.messages.slice(-3).some((m) => m.role === 'user' && m.content === message);
      if (!saved) setDraft((d) => d || message);
      if (ctrl.signal.aborted) {
        toast.message('Stopped waiting. If the AI still answers, the reply is saved in this conversation.');
        qc.invalidateQueries({ queryKey: QUOTA_KEY });
      } else handleError(err);
    } finally {
      if (abortRef.current === ctrl) abortRef.current = null;
      if (waitGen.current === gen) { setWaiting(null); setPendingQ(null); }
      await refresh(tid);
    }
  }, [waiting, threadId, pid, issueNumber, ensureThread, onQuota, handleError, qc, refresh]);

  const retry = useCallback(async (mid: number) => {
    if (waiting || !threadId) return;
    const gen = ++waitGen.current;
    setWaiting('Asking again');
    setUnavailable(false);
    try {
      const a = await workApi.aiRetry(pid, mid);
      onQuota(a.quota);
    } catch (err) {
      handleError(err);
    } finally {
      if (waitGen.current === gen) setWaiting(null);
      await refresh(threadId);
    }
  }, [waiting, threadId, pid, onQuota, handleError, refresh]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    waitGen.current += 1; // kết quả việc một chạm về muộn: vẫn được lưu ở server, chỉ không chờ nữa
    setWaiting(null);
    setPendingQ(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // ── Việc một chạm từ store: chạy ngay khi mở, ghi vào hội thoại đang mở ──
  const ranQuick = useRef<AiQuickRequest | null>(null);
  useEffect(() => {
    if (!quick || ranQuick.current === quick) return;
    ranQuick.current = quick;
    onQuickTaken();
    const title = quick.label ?? QUICK_TITLES[quick.task];
    setView('chat');
    setWaiting(title);
    setUnavailable(false);
    const gen = ++waitGen.current;
    let tid: number | null = threadId;
    (async () => {
      try {
        tid = await ensureThread(`${title}${quick.issueNumber && key ? ` · ${key}-${quick.issueNumber}` : ''}`);
        const a = await workApi.aiQuick(pid, { task: quick.task, issueNumber: quick.issueNumber ?? null, text: quick.text ?? null, threadId: tid, label: title });
        onQuota(a.quota);
      } catch (err) {
        if (waitGen.current === gen) handleError(err);
      } finally {
        if (waitGen.current === gen) setWaiting(null);
        await refresh(tid);
      }
    })();
  }, [quick, pid, key, threadId, onQuickTaken, ensureThread, onQuota, handleError, refresh]);

  // ── Cuộn xuống cuối khi có lượt mới ──
  useEffect(() => {
    const el = scrollRef.current;
    if (el && view === 'chat') el.scrollTop = el.scrollHeight;
  }, [messages.length, pendingQ, waiting, view, threadId]);

  // ── Focus + Esc ──
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => prev?.focus?.();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      e.preventDefault();
      if (view === 'history') setView('chat');
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, view]);

  const newConversation = () => {
    if (waiting) return;
    selectThread(null);
    setView('chat');
    setNewPrivate(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const toggleVisibility = async () => {
    if (!thread) return;
    try {
      const t = await workApi.aiUpdateThread(pid, thread.id, { visibility: thread.visibility === 'PRIVATE' ? 'PROJECT' : 'PRIVATE' });
      qc.setQueryData(threadKey(pid, t.id), t);
      qc.invalidateQueries({ queryKey: threadsKey(pid) });
      toast.success(t.visibility === 'PRIVATE' ? 'Only you can see this conversation now' : 'Everyone in this project can see this conversation now');
    } catch (err) { toast.error(workError(err, 'Could not change who can see this')); }
  };

  const deleteThread = async () => {
    if (!thread) return;
    try {
      await workApi.aiDeleteThread(pid, thread.id);
      qc.invalidateQueries({ queryKey: threadsKey(pid) });
      selectThread(null);
      toast.success('Conversation deleted');
    } catch (err) { toast.error(workError(err, 'Could not delete this conversation')); }
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
  const isPrivate = thread ? thread.visibility === 'PRIVATE' : newPrivate;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[65] bg-black/20 sm:hidden" onMouseDown={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label="AI assistant"
        className="fixed inset-y-0 right-0 z-[66] flex w-full flex-col border-l border-[var(--w-border)] bg-[var(--w-bg)] sm:w-[440px]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        {/* Đầu ngăn */}
        <div className="flex shrink-0 items-start gap-2 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
            <Sparkles size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[14px] font-semibold" title={view === 'chat' && thread ? thread.title : undefined}>
                {view === 'history' ? 'Team conversations' : thread ? thread.title : 'AI assistant'}
              </h2>
              {key && <span className="shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-mono text-[11px] text-[var(--w-text-2)]">{key}</span>}
            </div>
            <div className="mt-0.5 flex h-[18px] items-center gap-2 text-[12px] text-[var(--w-text-3)]">
              {view === 'chat' && thread?.createdBy ? (
                <span className="truncate">Started by {thread.createdById === meId ? 'you' : `@${thread.createdBy.username}`} · {relativeTime(thread.createdAt)}</span>
              ) : quota ? <QuotaChip quota={quota} /> : null}
            </div>
          </div>
          <button type="button" className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', view === 'history' && 'bg-[var(--w-active)]')} onClick={() => setView(view === 'history' ? 'chat' : 'history')} aria-label="Conversation history" title="Team conversations">
            <History size={14} />
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={newConversation} disabled={!!waiting} aria-label="New conversation" title="New conversation">
            <SquarePen size={14} />
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label="Close AI assistant" title="Close (Esc)">
            <X size={15} />
          </button>
        </div>

        {view === 'history' ? (
          <ThreadList pid={pid} projectKey={key} meId={meId} currentId={threadId} onOpen={(tid) => { selectThread(tid); setView('chat'); }} onNew={newConversation} />
        ) : (
          <>
            {/* Thanh hội thoại: ai thấy được + quản lý */}
            {thread && (
              <div className="flex shrink-0 items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-1.5 text-[12px] text-[var(--w-text-2)]">
                {thread.visibility === 'PRIVATE'
                  ? <span className="inline-flex items-center gap-1"><Lock size={12} /> Only you</span>
                  : <span className="inline-flex items-center gap-1"><Users size={12} /> Shared with the project</span>}
                <span className="text-[var(--w-text-3)]">· {thread.messageCount} message{thread.messageCount === 1 ? '' : 's'}</span>
                {thread.canManage && (
                  <span className="ml-auto flex items-center gap-1">
                    <button type="button" className="w-btn w-btn-ghost w-btn-sm !h-6 !px-1.5 text-[12px]" onClick={toggleVisibility}>
                      {thread.visibility === 'PRIVATE' ? <><Users size={12} /> Share</> : <><Lock size={12} /> Make private</>}
                    </button>
                    {confirmDelete ? (
                      <>
                        <button type="button" className="w-btn w-btn-sm !h-6 !px-1.5 text-[12px] text-[var(--w-red)]" onClick={deleteThread}>Delete</button>
                        <button type="button" className="w-btn w-btn-ghost w-btn-sm !h-6 !px-1.5 text-[12px]" onClick={() => setConfirmDelete(false)}>Keep</button>
                      </>
                    ) : (
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm !h-6 !w-6" onClick={() => setConfirmDelete(true)} aria-label="Delete conversation" title="Delete conversation">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </span>
                )}
              </div>
            )}

            {/* Hội thoại */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
              {threadId && !thread && threadQ.isLoading ? (
                <div className="flex justify-center pt-10"><Spinner size={16} /></div>
              ) : !messages.length && !pendingQ && !waiting ? (
                <EmptyState suggestions={suggestions} onPick={fill} disabled={aiOff} onBrowse={() => setView('history')} />
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (m.role === 'user' ? (
                    <UserTurn key={m.id} m={m} mine={m.author?.id === meId} projectKey={key} onRetry={() => retry(m.id)} busy={!!waiting} />
                  ) : (
                    <div key={m.id}>
                      <div className="rounded-[12px] rounded-bl-[4px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
                        {m.title && (
                          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]">
                            <Sparkles size={11} /> {m.title}
                          </div>
                        )}
                        {m.content ? <AiMarkdown text={m.content} /> : <span className="text-[13px] text-[var(--w-text-3)]">No answer.</span>}
                      </div>
                      <div className="mt-1 px-1 text-[11px] text-[var(--w-text-3)]" title={new Date(m.createdAt).toLocaleString('en-US')}>{relativeTime(m.createdAt)}</div>
                      {config && m.actions.length ? (
                        <ActionGroup
                          config={config}
                          items={storedItems(m).map((it) => ({ ...it, ...overlay[it.id] }))}
                          onUpdate={(id, patch) => setOverlay((o) => ({ ...o, [id]: { ...o[id], ...patch } }))}
                          applyFn={async (it) => {
                            const idx = Number(it.id.split(':')[1]);
                            const edited = overlay[it.id]?.action;
                            try {
                              const r = await workApi.aiApplyStored(pid, m.id, idx, edited);
                              return { summary: `${r.summary ?? 'Applied'}${r.byName ? ` · by @${r.byName}` : ''}`, number: r.number };
                            } finally {
                              refresh(m.threadId);
                            }
                          }}
                          dismissFn={async (it) => {
                            await workApi.aiSetStoredStatus(pid, m.id, Number(it.id.split(':')[1]), 'dismissed');
                            refresh(m.threadId);
                          }}
                        />
                      ) : null}
                    </div>
                  )))}
                  {pendingQ && (
                    <div className="flex justify-end opacity-70">
                      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[12px] rounded-br-[4px] bg-[var(--w-accent)] px-3 py-2 text-[13.5px] leading-relaxed text-white">{pendingQ}</div>
                    </div>
                  )}
                  {waiting && <Typing label={waiting} onCancel={cancel} />}
                </div>
              )}
            </div>

            {/* Soạn */}
            <div className="shrink-0 border-t border-[var(--w-border)] bg-[var(--w-panel)] px-4 pb-3 pt-2.5">
              {aiOff && (
                <div className="mb-2 flex items-start gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_10%,transparent)] px-2.5 py-2 text-[12px] text-[var(--w-text)]">
                  <AlertTriangle size={14} className="mt-[1px] shrink-0 text-[var(--w-orange)]" />
                  AI is temporarily unavailable. Your question is kept — press Retry on it in a little while.
                </div>
              )}
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {issueKey && (
                  <span className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] pl-2 pr-0.5 text-[11.5px] text-[var(--w-accent-text)]">
                    About <span className="font-mono">{issueKey}</span>
                    <button type="button" onClick={onClearIssue} aria-label={`Stop asking about ${issueKey}`} className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full hover:bg-[var(--w-hover)]">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {!thread && (
                  <button
                    type="button"
                    onClick={() => setNewPrivate((v) => !v)}
                    className={cn('inline-flex h-[22px] items-center gap-1 rounded-full border px-2 text-[11.5px]', newPrivate ? 'border-[var(--w-border-strong)] bg-[var(--w-sunken)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}
                    title="Choose who can see this new conversation"
                  >
                    {newPrivate ? <><Lock size={11} /> Private — only you</> : <><Users size={11} /> Shared with the project</>}
                  </button>
                )}
              </div>
              <div className="flex items-end gap-2 rounded-[8px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] p-1.5 focus-within:border-[var(--w-accent-border)] focus-within:shadow-[0_0_0_3px_var(--w-accent-soft)]">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    // Đang gõ bộ gõ tiếng Việt/IME thì Enter là chốt chữ, không phải gửi.
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      send(draft);
                    }
                  }}
                  disabled={!!waiting}
                  rows={3}
                  maxLength={8000}
                  placeholder={thread ? 'Continue this conversation…' : issueKey ? `Ask about ${issueKey}…` : 'Ask anything about this project…'}
                  aria-label="Message the AI assistant"
                  className="max-h-[200px] min-h-[64px] flex-1 resize-none bg-transparent px-1.5 py-1 text-[13.5px] leading-relaxed text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)] disabled:opacity-60"
                />
                {waiting ? (
                  <button type="button" className="w-btn w-btn-icon !h-[30px] !w-[30px] shrink-0" onClick={cancel} aria-label="Stop waiting" title="Stop waiting">
                    <Square size={11} fill="currentColor" />
                  </button>
                ) : (
                  <button type="button" className="w-btn w-btn-primary w-btn-icon !h-[30px] !w-[30px] shrink-0" onClick={() => send(draft)} disabled={!draft.trim()} aria-label="Send" title="Send (Enter)">
                    <ArrowUp size={15} />
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--w-text-3)]">
                {isPrivate ? 'Saved privately for you.' : 'Saved for your team — anyone in this project can read and continue it.'} Don&apos;t paste passwords or keys. The AI only suggests changes; nothing happens until someone clicks Apply.
              </p>
            </div>
          </>
        )}
      </div>

      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} limit={quota?.limit} />
    </WorkPortal>
  );
}

// ─── Lượt hỏi (có tên người hỏi — hội thoại dùng chung) ───────────

function UserTurn({ m, mine, projectKey, onRetry, busy }: { m: AiMessage; mine: boolean; projectKey: string; onRetry: () => void; busy: boolean }) {
  const name = mine ? 'You' : m.author ? `@${m.author.username}` : 'Former member';
  return (
    <div className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
      <div className={cn('mb-1 flex items-center gap-1.5 px-1 text-[11.5px] text-[var(--w-text-3)]', mine && 'flex-row-reverse')}>
        <UserAvatar user={m.author} size={16} />
        <span className="font-medium text-[var(--w-text-2)]">{name}</span>
        <span title={new Date(m.createdAt).toLocaleString('en-US')}>{relativeTime(m.createdAt)}</span>
        {m.issueNumber && projectKey ? <span className="rounded-[4px] bg-[var(--w-sunken)] px-1 font-mono text-[10.5px]">{projectKey}-{m.issueNumber}</span> : null}
      </div>
      <div className={cn(
        'max-w-[85%] whitespace-pre-wrap break-words rounded-[12px] px-3 py-2 text-[13.5px] leading-relaxed',
        mine ? 'rounded-br-[4px] bg-[var(--w-accent)] text-white' : 'rounded-bl-[4px] border border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text)]',
      )}>
        {m.content}
      </div>
      {m.error && (
        <div className="mt-1 flex max-w-[85%] items-center gap-2 px-1 text-[12px] text-[var(--w-red)]">
          <AlertTriangle size={12} className="shrink-0" />
          <span className="min-w-0">Not answered yet — the question is saved.</span>
          <button type="button" className="w-btn w-btn-sm !h-6 shrink-0" onClick={onRetry} disabled={busy}>
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Danh sách hội thoại của cả nhóm ─────────────────────────────

function ThreadList({ pid, projectKey, meId, currentId, onOpen, onNew }: {
  pid: number; projectKey: string; meId: number | undefined; currentId: number | null;
  onOpen: (tid: number) => void; onNew: () => void;
}) {
  const [scope, setScope] = useState<'all' | 'mine'>('all');
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 250);
    return () => window.clearTimeout(t);
  }, [q]);
  const { data, isLoading, isError } = useQuery({
    queryKey: [...threadsKey(pid), scope, debounced],
    queryFn: () => workApi.aiThreads(pid, { scope, q: debounced || undefined }),
    refetchInterval: 30_000,
  });
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-2 border-b border-[var(--w-border)] px-4 py-3">
        <div className="flex items-center gap-2 rounded-[6px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] px-2 focus-within:border-[var(--w-accent-border)]">
          <Search size={13} className="text-[var(--w-text-3)]" />
          <input
            id="ai-thread-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions and answers…"
            className="h-8 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--w-text-3)]"
            aria-label="Search conversations"
          />
        </div>
        <div className="flex items-center gap-1" role="tablist" aria-label="Which conversations">
          {(['all', 'mine'] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={scope === s} onClick={() => setScope(s)}
              className={cn('rounded-[5px] px-2.5 py-1 text-[12.5px]', scope === s ? 'bg-[var(--w-active)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {s === 'all' ? 'Everyone' : 'I took part'}
            </button>
          ))}
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={onNew}><SquarePen size={12} /> New</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center pt-10"><Spinner size={16} /></div>
        ) : isError ? (
          <p className="px-4 pt-8 text-center text-[13px] text-[var(--w-text-2)]">Could not load conversations. Try again in a moment.</p>
        ) : !data?.length ? (
          <p className="px-6 pt-10 text-center text-[13px] leading-relaxed text-[var(--w-text-2)]">
            {debounced ? `Nothing matches “${debounced}”.` : scope === 'mine' ? 'You have not asked the AI anything in this project yet.' : 'No conversations yet. Questions anyone asks here are saved for the whole team.'}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--w-border)]">
            {data.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => onOpen(t.id)}
                  className={cn('flex w-full flex-col gap-1 px-4 py-2.5 text-left hover:bg-[var(--w-hover)]', t.id === currentId && 'bg-[var(--w-accent-soft)]')}>
                  <span className="flex items-center gap-1.5">
                    {t.visibility === 'PRIVATE' && <Lock size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label="Private" />}
                    <span className="line-clamp-2 text-[13.5px] font-medium text-[var(--w-text)]">{t.title}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[11.5px] text-[var(--w-text-3)]">
                    <span className="flex -space-x-1">
                      {t.participants.slice(0, 4).map((u) => <UserAvatar key={u.id} user={u} size={16} className="ring-2 ring-[var(--w-bg)]" />)}
                    </span>
                    <span className="truncate">
                      {t.createdById === meId ? 'You' : t.createdBy ? `@${t.createdBy.username}` : 'Former member'}
                      {t.participants.length > 1 ? ` + ${t.participants.length - 1}` : ''} · {t.messageCount} msg · {relativeTime(t.lastMessageAt)}
                    </span>
                    {t.issueNumber && projectKey ? <span className="ml-auto shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1 font-mono text-[10.5px]">{projectKey}-{t.issueNumber}</span> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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

/** Nhãn chờ của câu hỏi tự do (việc một chạm dùng tên việc làm nhãn). */
const CHAT_WAIT = 'chat';

/** Các giai đoạn hiển thị theo thời gian chờ — model không báo tiến độ thật. */
function stageOf(sec: number): string {
  if (sec < 3) return 'Reading your project…';
  if (sec < 10) return 'Thinking…';
  return 'Writing the answer…';
}

function Typing({ label, onCancel }: { label: string; onCancel: () => void }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const id = window.setInterval(() => setSec(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => window.clearInterval(id);
  }, [label]);
  const stage = stageOf(sec);
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]" role="status" aria-live="polite">
      <span className="inline-flex items-center gap-1 rounded-[12px] rounded-bl-[4px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5" aria-hidden>
        {[0, 150, 300].map((d) => (
          <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--w-text-3)]" style={{ animationDelay: `${d}ms` }} />
        ))}
      </span>
      <span>
        {label === CHAT_WAIT ? stage : <><span className="font-medium text-[var(--w-text-2)]">{label}</span> · {stage}</>}
        <span className="ml-1 tabular-nums">{sec}s</span>
      </span>
      <button type="button" onClick={onCancel} className="rounded-[4px] px-1.5 py-0.5 text-[12px] text-[var(--w-accent-text)] hover:bg-[var(--w-hover)]">
        Cancel
      </button>
      {sec >= 30 && <span className="w-full text-[11.5px]">Big projects can take up to a minute.</span>}
    </div>
  );
}

function EmptyState({ suggestions, onPick, disabled, onBrowse }: { suggestions: string[]; onPick: (s: string) => void; disabled?: boolean; onBrowse?: () => void }) {
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
      {onBrowse && (
        <button type="button" onClick={onBrowse} className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--w-accent-text)] hover:underline">
          <History size={13} /> See what your team already asked
        </button>
      )}
    </div>
  );
}
