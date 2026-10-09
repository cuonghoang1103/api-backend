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
import { Activity, AlertTriangle, ArrowUp, ClipboardCheck, FileText, GraduationCap, History, Lock, Maximize2, Minimize2, RotateCcw, Search, Sparkles, Square, SquarePen, Trash2, Users, X } from 'lucide-react';
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
import { openAiPanel, useAiPanel, type AiQuickRequest } from './store';
import { useLayoutPrefs } from '../shell/panes';
import { wt, wfmt } from '@/components/work/i18n';

// ─── Kiểu + lưu trữ ──────────────────────────────────────────────

const QUOTA_KEY = ['work', 'ai-quota'] as const;
const threadKey = (pid: number, tid: number) => ['work', 'ai-thread', pid, tid] as const;
const threadsKey = (pid: number) => ['work', 'ai-threads', pid] as const;

export const QUICK_TITLES: Record<AiQuickTask, string> = {
  get write_story() { return wt('ai.qWriteStory'); },
  get split() { return wt('ai.qSplit'); },
  get generate_tests() { return wt('ai.qTests'); },
  get improve_bug() { return wt('ai.qBug'); },
  get summarize() { return wt('ai.qSummarize'); },
  get review_story() { return wt('ai.qReviewStory'); },
  get meeting_notes() { return wt('ai.qMeeting'); },
  get req_review() { return wt('ai.qReqReview'); },
  get team_health() { return wt('ai.qHealth'); },
  get draft_srs() { return wt('ai.qDraftSrs'); },
  get summarize_page() { return wt('ai.qSummarizePage'); },
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
    summary: a.status === 'done' ? (a.byName ? wt('ai.appliedBy', { s: a.summary ?? wt('ai.applied'), name: a.byName }) : a.summary ?? wt('ai.applied')) : a.summary,
    number: a.number,
    error: a.status === 'applying' && a.byName ? wt('ai.applyingBy', { name: a.byName }) : a.error,
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
  // UX-E: câu trả lời dài (bảng, code, kế hoạch) trong cột 440px rất khó đọc ⇒ nút mở rộng 760px, nhớ lựa chọn.
  const wide = useLayoutPrefs((s) => s.aiWide);
  useEffect(() => { useLayoutPrefs.getState().load(); }, []);

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
    else toast.error(workError(err, wt('ai.couldNotAnswer')));
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
        toast.message(wt('ai.stoppedWaiting'));
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
    setWaiting(wt('ai.askingAgain'));
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
        tid = await ensureThread(`${title}${quick.issueNumber && key ? ` · ${key}-${quick.issueNumber}` : ''}${quick.pageNumber ? wt('ai.docN', { n: quick.pageNumber }) : ''}`);
        const a = await workApi.aiQuick(pid, { task: quick.task, issueNumber: quick.issueNumber ?? null, pageNumber: quick.pageNumber ?? null, text: quick.text ?? null, threadId: tid, label: title });
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

  // ── Luyện bảo vệ: AI (hội đồng) mở buổi mới và hỏi câu đầu ──
  const startDefense = useCallback(async (focus: string) => {
    if (waiting) return;
    const gen = ++waitGen.current;
    setWaiting(wt('ai.startingDefense'));
    setUnavailable(false);
    try {
      const t = await workApi.aiStartDefense(pid, { focus });
      qc.setQueryData(threadKey(pid, t.id), t);
      selectThread(t.id);
      setView('chat');
      qc.invalidateQueries({ queryKey: threadsKey(pid) });
      qc.invalidateQueries({ queryKey: QUOTA_KEY });
    } catch (err) {
      handleError(err);
    } finally {
      if (waitGen.current === gen) setWaiting(null);
    }
  }, [waiting, pid, qc, selectThread, handleError]);

  /** Soát Req / sức khoẻ nhóm: số liệu do server tính, AI diễn giải — chạy như việc một chạm. */
  const runTool = (task: 'req_review' | 'team_health' | 'draft_srs') => {
    if (waiting) return;
    openAiPanel({ pid, quick: { task } });
  };

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
      toast.success(t.visibility === 'PRIVATE' ? wt('ai.nowPrivate') : wt('ai.nowShared'));
    } catch (err) { toast.error(workError(err, wt('ai.visFailed'))); }
  };

  const deleteThread = async () => {
    if (!thread) return;
    try {
      await workApi.aiDeleteThread(pid, thread.id);
      qc.invalidateQueries({ queryKey: threadsKey(pid) });
      selectThread(null);
      toast.success(wt('ai.convDeleted'));
    } catch (err) { toast.error(workError(err, wt('ai.convDelFailed'))); }
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
    wt('ai.sugNext'),
    wt('ai.sugSprint'),
    wt('ai.sugLogin'),
    `${wt('ai.sugMeeting')}\n\n`,
    wt('ai.sugOverload'),
    issueKey ? wt('ai.sugTestsKey', { key: issueKey }) : wt('ai.sugTests'),
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
        aria-label={wt('ai.assistant')}
        className={cn('fixed inset-y-0 right-0 z-[66] flex w-full flex-col border-l border-[var(--w-border)] bg-[var(--w-bg)] transition-[width] duration-150', wide ? 'sm:w-[min(760px,92vw)]' : 'sm:w-[440px]')}
        data-wide={wide || undefined}
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
                {view === 'history' ? wt('ai.teamConvs') : thread ? thread.title : wt('ai.assistant')}
              </h2>
              {key && <span className="shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1.5 font-mono text-[11px] text-[var(--w-text-2)]">{key}</span>}
            </div>
            <div className="mt-0.5 flex h-[18px] items-center gap-2 text-[12px] text-[var(--w-text-3)]">
              {view === 'chat' && thread?.createdBy ? (
                <span className="truncate">{wt('ai.startedBy', { who: thread.createdById === meId ? wt('common.you') : `@${thread.createdBy.username}`, when: relativeTime(thread.createdAt) })}</span>
              ) : quota ? <QuotaChip quota={quota} /> : null}
            </div>
          </div>
          <button type="button" className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', view === 'history' && 'w-btn-on')} onClick={() => setView(view === 'history' ? 'chat' : 'history')} aria-label={wt('ai.convHistory')} title={wt('ai.teamConvs')}>
            <History size={14} />
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={newConversation} disabled={!!waiting} aria-label={wt('ai.newConv')} title={wt('ai.newConv')}>
            <SquarePen size={14} />
          </button>
          <button
            type="button"
            className="w-btn w-btn-ghost w-btn-icon w-btn-sm max-sm:!hidden"
            onClick={() => useLayoutPrefs.getState().setAiWide(!wide)}
            aria-pressed={wide}
            aria-label={wide ? wt('ai.narrow') : wt('ai.widen')}
            title={wide ? wt('ai.narrowT') : wt('ai.widenT')}
            data-testid="ai-panel-wide"
          >
            {wide ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label={wt('ai.closeAi')} title={wt('ai.closeEsc')}>
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
                {thread.mode === 'DEFENSE' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--w-accent-soft)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--w-accent-text)]"><GraduationCap size={12} /> {wt('ai.defense')}</span>
                )}
                {thread.visibility === 'PRIVATE'
                  ? <span className="inline-flex items-center gap-1"><Lock size={12} /> {wt('ai.onlyYou')}</span>
                  : <span className="inline-flex items-center gap-1"><Users size={12} /> {wt('ai.sharedProject')}</span>}
                <span className="text-[var(--w-text-3)]">· {thread.messageCount} message{thread.messageCount === 1 ? '' : 's'}</span>
                {thread.canManage && (
                  <span className="ml-auto flex items-center gap-1">
                    <button type="button" className="w-btn w-btn-ghost w-btn-sm !h-6 !px-1.5 text-[12px]" onClick={toggleVisibility}>
                      {thread.visibility === 'PRIVATE' ? <><Users size={12} /> {wt('ai.share')}</> : <><Lock size={12} /> {wt('ai.makePrivate')}</>}
                    </button>
                    {confirmDelete ? (
                      <>
                        <button type="button" className="w-btn w-btn-sm !h-6 !px-1.5 text-[12px] text-[var(--w-red)]" onClick={deleteThread}>{wt('common.delete')}</button>
                        <button type="button" className="w-btn w-btn-ghost w-btn-sm !h-6 !px-1.5 text-[12px]" onClick={() => setConfirmDelete(false)}>{wt('ai.keep')}</button>
                      </>
                    ) : (
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm !h-6 !w-6" onClick={() => setConfirmDelete(true)} aria-label={wt('ai.deleteConv')} title={wt('ai.deleteConv')}>
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
                <EmptyState suggestions={suggestions} onPick={fill} disabled={aiOff} onBrowse={() => setView('history')} onTool={runTool} onDefense={startDefense} docsTools={!!config?.modules?.docs && !!config?.permissions.editDocs} />
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
                        {m.content ? <AiMarkdown text={m.content} /> : <span className="text-[13px] text-[var(--w-text-3)]">{wt('ai.noAnswer')}</span>}
                      </div>
                      <div className="mt-1 px-1 text-[11px] text-[var(--w-text-3)]" title={new Date(m.createdAt).toLocaleString(wfmt.intl())}>{relativeTime(m.createdAt)}</div>
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
                              return { summary: r.byName ? wt('ai.appliedBy', { s: r.summary ?? wt('ai.applied'), name: r.byName }) : r.summary ?? wt('ai.applied'), number: r.number };
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
                  {wt('ai.unavailable')}
                </div>
              )}
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {issueKey && (
                  <span className="inline-flex h-[22px] items-center gap-1 rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] pl-2 pr-0.5 text-[11.5px] text-[var(--w-accent-text)]">
                    {wt('ai.about')} <span className="font-mono">{issueKey}</span>
                    <button type="button" onClick={onClearIssue} aria-label={wt('ai.stopAsking', { key: issueKey })} className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full hover:bg-[var(--w-hover)]">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {!thread && (
                  <button
                    type="button"
                    onClick={() => setNewPrivate((v) => !v)}
                    className={cn('inline-flex h-[22px] items-center gap-1 rounded-full border px-2 text-[11.5px]', newPrivate ? 'border-[var(--w-border-strong)] bg-[var(--w-sunken)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}
                    title={wt('ai.chooseWho')}
                  >
                    {newPrivate ? <><Lock size={11} /> {wt('ai.privateOnly')}</> : <><Users size={11} /> {wt('ai.sharedProject')}</>}
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
                  placeholder={thread?.mode === 'DEFENSE' ? wt('ai.phDefense') : thread ? wt('ai.phContinue') : issueKey ? wt('ai.phAboutKey', { key: issueKey }) : wt('ai.phAsk')}
                  aria-label={wt('ai.messageAi')}
                  className="max-h-[200px] min-h-[64px] flex-1 resize-none bg-transparent px-1.5 py-1 text-[13.5px] leading-relaxed text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)] disabled:opacity-60"
                />
                {waiting ? (
                  <button type="button" className="w-btn w-btn-icon !h-[30px] !w-[30px] shrink-0" onClick={cancel} aria-label={wt('ai.stopWaiting')} title={wt('ai.stopWaiting')}>
                    <Square size={11} fill="currentColor" />
                  </button>
                ) : (
                  <button type="button" className="w-btn w-btn-primary w-btn-icon !h-[30px] !w-[30px] shrink-0" onClick={() => send(draft)} disabled={!draft.trim()} aria-label={wt('ai.send')} title={wt('ai.sendEnter')}>
                    <ArrowUp size={15} />
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--w-text-3)]">
                {isPrivate ? wt('ai.savedPrivate') : wt('ai.savedTeam')} {wt('ai.noSecrets')}
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
  const name = mine ? wt('ai.you') : m.author ? `@${m.author.username}` : wt('ai.formerMember');
  return (
    <div className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
      <div className={cn('mb-1 flex items-center gap-1.5 px-1 text-[11.5px] text-[var(--w-text-3)]', mine && 'flex-row-reverse')}>
        <UserAvatar user={m.author} size={16} />
        <span className="font-medium text-[var(--w-text-2)]">{name}</span>
        <span title={new Date(m.createdAt).toLocaleString(wfmt.intl())}>{relativeTime(m.createdAt)}</span>
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
          <span className="min-w-0">{wt('ai.notAnswered')}</span>
          <button type="button" className="w-btn w-btn-sm !h-6 shrink-0" onClick={onRetry} disabled={busy}>
            <RotateCcw size={12} /> {wt('ai.retry')}
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
            placeholder={wt('ai.searchQa')}
            className="h-8 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--w-text-3)]"
            aria-label={wt('ai.searchConvs')}
          />
        </div>
        <div className="flex items-center gap-1" role="tablist" aria-label={wt('ai.whichConvs')}>
          {(['all', 'mine'] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={scope === s} onClick={() => setScope(s)}
              className={cn('rounded-[5px] px-2.5 py-1 text-[12.5px]', scope === s ? 'bg-[var(--w-active)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {s === 'all' ? wt('ai.everyone') : wt('ai.iTookPart')}
            </button>
          ))}
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={onNew}><SquarePen size={12} /> {wt('ai.newBtn')}</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center pt-10"><Spinner size={16} /></div>
        ) : isError ? (
          <p className="px-4 pt-8 text-center text-[13px] text-[var(--w-text-2)]">{wt('ai.loadConvsFailed')}</p>
        ) : !data?.length ? (
          <p className="px-6 pt-10 text-center text-[13px] leading-relaxed text-[var(--w-text-2)]">
            {debounced ? wt('ai.nothingMatches', { q: debounced }) : scope === 'mine' ? wt('ai.noneMine') : wt('ai.noneAll')}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--w-border)]">
            {data.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => onOpen(t.id)}
                  className={cn('flex w-full flex-col gap-1 px-4 py-2.5 text-left hover:bg-[var(--w-hover)]', t.id === currentId && 'bg-[var(--w-accent-soft)]')}>
                  <span className="flex items-center gap-1.5">
                    {t.visibility === 'PRIVATE' && <Lock size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label={wt('ai.private')} />}
                    <span className="line-clamp-2 text-[13.5px] font-medium text-[var(--w-text)]">{t.title}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[11.5px] text-[var(--w-text-3)]">
                    <span className="flex -space-x-1">
                      {t.participants.slice(0, 4).map((u) => <UserAvatar key={u.id} user={u} size={16} className="ring-2 ring-[var(--w-bg)]" />)}
                    </span>
                    <span className="truncate">
                      {t.createdById === meId ? wt('ai.you') : t.createdBy ? `@${t.createdBy.username}` : wt('ai.formerMember')}
                      {t.participants.length > 1 ? ` + ${t.participants.length - 1}` : ''} · {wt('ai.msgCount', { n: t.messageCount })} · {relativeTime(t.lastMessageAt)}
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
      {wt('ai.freeLeft', { left, count: quota.limit })}
    </span>
  );
}

/** Nhãn chờ của câu hỏi tự do (việc một chạm dùng tên việc làm nhãn). */
const CHAT_WAIT = 'chat';

/** Các giai đoạn hiển thị theo thời gian chờ — model không báo tiến độ thật. */
function stageOf(sec: number): string {
  if (sec < 3) return wt('ai.stReading');
  if (sec < 10) return wt('ai.stThinking');
  return wt('ai.stWriting');
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
        {wt('common.cancel')}
      </button>
      {sec >= 30 && <span className="w-full text-[11.5px]">{wt('ai.bigProjects')}</span>}
    </div>
  );
}

const defenseFocus = (): Array<[string, string]> => [['me', wt('ai.focusMe')], ['C1', 'C1'], ['C2', 'C2'], ['C3', 'C3'], ['C4', 'C4'], ['C5', 'C5'], ['all', wt('ai.focusAll')]];

function EmptyState({ suggestions, onPick, disabled, onBrowse, onTool, onDefense, docsTools }: {
  suggestions: string[]; onPick: (s: string) => void; disabled?: boolean; onBrowse?: () => void;
  onTool?: (task: 'req_review' | 'team_health' | 'draft_srs') => void; onDefense?: (focus: string) => void;
  /** Đợt S5c: dự án bật Docs + người xem sửa được tài liệu ⇒ có "Draft SRS from requirements". */
  docsTools?: boolean;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="flex flex-col items-center px-2 pt-6 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
        <Sparkles size={19} />
      </span>
      <div className="mt-3 text-[14px] font-semibold">{wt('ai.howHelp')}</div>
      <p className="mt-1 max-w-[320px] text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
        {wt('ai.iCan')}
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
      {(onTool || onDefense) && (
        <div className="mt-5 w-full text-left">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">{wt('ai.projectTools')}</div>
          <div className="flex flex-col gap-1.5">
            {onDefense && (
              <div className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
                <button type="button" disabled={disabled} onClick={() => setPicking((v) => !v)} aria-expanded={picking}
                  className="flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-[var(--w-hover)] disabled:opacity-50">
                  <GraduationCap size={15} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
                  <span><span className="block text-[13px] font-medium">{wt('ai.practiceDefense')}</span><span className="block text-[12px] text-[var(--w-text-2)]">{wt('ai.practiceDesc')}</span></span>
                </button>
                {picking && (
                  <div className="flex flex-wrap gap-1.5 border-t border-[var(--w-border)] px-3 py-2">
                    <span className="w-full text-[11.5px] text-[var(--w-text-3)]">{wt('ai.whoseScreens')}</span>
                    {defenseFocus().map(([v, label]) => (
                      <button key={v} type="button" onClick={() => { setPicking(false); onDefense(v); }} className="inline-flex h-7 items-center rounded-full border border-[var(--w-border)] px-2.5 text-[12.5px] hover:border-[var(--w-accent-border)] hover:bg-[var(--w-accent-soft)]">{label}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {onTool && (
              <>
                <button type="button" disabled={disabled} onClick={() => onTool('req_review')}
                  className="flex items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left hover:bg-[var(--w-hover)] disabled:opacity-50">
                  <ClipboardCheck size={15} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
                  <span><span className="block text-[13px] font-medium">{wt('ai.checkReq')}</span><span className="block text-[12px] text-[var(--w-text-2)]">{wt('ai.checkReqDesc')}</span></span>
                </button>
                {docsTools && (
                  <button type="button" disabled={disabled} onClick={() => onTool('draft_srs')}
                    className="flex items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left hover:bg-[var(--w-hover)] disabled:opacity-50">
                    <FileText size={15} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
                    <span><span className="block text-[13px] font-medium">{wt('ai.qDraftSrs')}</span><span className="block text-[12px] text-[var(--w-text-2)]">{wt('ai.draftSrsDesc')}</span></span>
                  </button>
                )}
                <button type="button" disabled={disabled} onClick={() => onTool('team_health')}
                  className="flex items-start gap-2.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left hover:bg-[var(--w-hover)] disabled:opacity-50">
                  <Activity size={15} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
                  <span><span className="block text-[13px] font-medium">{wt('ai.qHealth')}</span><span className="block text-[12px] text-[var(--w-text-2)]">{wt('ai.healthDesc')}</span></span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {onBrowse && (
        <button type="button" onClick={onBrowse} className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--w-accent-text)] hover:underline">
          <History size={13} /> {wt('ai.seeAsked')}
        </button>
      )}
    </div>
  );
}
