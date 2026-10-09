'use client';

/**
 * CT Work K-3 — trang Chat của dự án: danh sách kênh (thu gọn được — shell/panes.tsx: cột / thanh mảnh / ngăn trượt
 * theo bề ngang ĐO THẬT, nên iPad 1024/1180 và app desktop vẫn còn chỗ đọc) + khung chat + luồng trả lời (cột phải /
 * ngăn trượt).
 *
 * Dữ liệu: danh sách kênh qua TanStack Query (badge dùng chung với sidebar); tin của kênh đang mở giữ ở state cục bộ để
 * chèn tin realtime không tải lại cả trang. Socket chỉ báo "có gì đổi" kèm tin mới (không có thẻ xem trước — thẻ xem
 * trước dựng theo quyền từng người, nên client tự xin lại tin đó khi `hasPreviews`).
 *
 * Phím tắt: ⌘K/Ctrl+K tìm kênh (trên trang chat — bảng lệnh chung vẫn mở từ trang khác) · Enter gửi · Shift+Enter
 * xuống dòng · ↑ sửa tin cuối · `[` ẩn/hiện danh sách kênh · Esc đóng luồng.
 * Mọi hook gọi trước mọi `return` sớm (rules-of-hooks).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowDown, Archive, BellOff, CheckCheck, ExternalLink, Handshake, Hash, Lock, MoreHorizontal, Pencil, Phone, Pin, Plus, Search, Settings2, Users, Video, WifiOff, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { resApi, resKeys } from '@/lib/work-resources-api';
import { chatApi, chatKeys, chatPath, type ChatChannel, type ChatMessage } from '@/lib/work-chat-api';
import { firstUnreadId, isContinuation, muteLabel, newClientKey, typingLine } from '@/lib/work-chat-rules';
import { Dialog, EmptyState, Field, PageLoading, Popover, Spinner, UserAvatar } from '../ui';
import { PaneDrawer, PaneStrip, PaneToggle, usePaneKeys, usePanes } from '../shell/panes';
import { useChatViewing } from './ChatNotifier';
import { ChatSettingsDialog, ChannelMembersDialog, ChannelMuteMenu, CreateChannelDialog, CreateIssueFromMessageDialog, ForwardDialog } from './ChatDialogs';
import { Composer, type ComposerHandle } from './Composer';
import { MessageItem, type MessageActions } from './MessageItem';
import { useChannelRoom, useOnline, useTyping, type ChatEvent } from './realtime';
import { currentWorkLocale, wt, wfmt } from '@/components/work/i18n';

const LIST_W = 248;
const THREAD_W = 400;

const KindIcon = ({ kind, size = 14 }: { kind: string; size?: number }) =>
  kind === 'PRIVATE' ? <Lock size={size} aria-hidden="true" /> : kind === 'CLIENT' ? <Handshake size={size} aria-hidden="true" /> : <Hash size={size} aria-hidden="true" />;

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return wt('common.today');
  if (d.toDateString() === y.toDateString()) return wt('common.yesterday');
  return d.toLocaleDateString(wfmt.intl(), { weekday: 'long', day: 'numeric', month: 'long', ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) });
}

/** Chèn / thay một tin: bỏ bản nháp cục bộ cùng clientKey, không trùng id, giữ thứ tự id. */
function upsert(list: ChatMessage[], m: ChatMessage, clientKey?: string | null): ChatMessage[] {
  const rest = list.filter((x) => x.id !== m.id && !(clientKey && x.local && x.clientKey === clientKey));
  const next = [...rest, m];
  return next.sort((a, b) => (a.local && !b.local ? 1 : !a.local && b.local ? -1 : a.id - b.id));
}

// ─── Hàng chờ ngoại tuyến (localStorage theo kênh) ───────────────

const qKey = (pid: number, cid: number) => `ctw.chat.queue.${pid}.${cid}`;
function readQueue(pid: number, cid: number): ChatMessage[] {
  try { return JSON.parse(window.localStorage.getItem(qKey(pid, cid)) ?? '[]') as ChatMessage[]; } catch { return []; }
}
function writeQueue(pid: number, cid: number, list: ChatMessage[]) {
  try {
    const keep = list.filter((m) => m.local);
    if (keep.length) window.localStorage.setItem(qKey(pid, cid), JSON.stringify(keep.slice(-30)));
    else window.localStorage.removeItem(qKey(pid, cid));
  } catch { /* riêng tư / đầy */ }
}

// ─── Danh sách kênh ──────────────────────────────────────────────

function ChannelList({ channels, active, onPick, onCreate, canCreate, onSettings }: {
  channels: ChatChannel[]; active: number | null; onPick: (id: number) => void; onCreate?: () => void; canCreate: boolean; onSettings: () => void;
}) {
  const groups: Array<[string, ChatChannel[]]> = [
    [wt('chat.channels'), channels.filter((c) => c.kind === 'PUBLIC')],
    [wt('chat.privateG'), channels.filter((c) => c.kind === 'PRIVATE')],
    [wt('chat.withClients'), channels.filter((c) => c.kind === 'CLIENT')],
  ];
  return (
    <nav className="flex h-full flex-col" aria-label={wt('chat.channels')}>
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-[var(--w-border)] px-3">
        <span className="flex-1 text-[13px] font-semibold">{wt('chat.channels')}</span>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.notifSettings')} title={wt('chat.notifSettings')} onClick={onSettings}><Settings2 size={14} /></button>
        {canCreate && onCreate && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.createChannel')} title={wt('chat.createChannel')} onClick={onCreate} data-testid="chat-create-channel"><Plus size={15} /></button>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {groups.map(([label, list]) => list.length > 0 && (
          <div key={label} className="mb-2">
            <p className="w-eyebrow px-2 pb-0.5 pt-1.5">{label}</p>
            <ul>
              {list.map((c) => {
                const on = c.id === active;
                const bold = c.unread > 0 && !c.muted;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onPick(c.id)}
                      aria-current={on ? 'page' : undefined}
                      className={cn('flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13.5px] transition-colors',
                        on ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
                        bold && 'font-semibold text-[var(--w-text)]', c.muted && !on && 'opacity-70')}
                      data-testid={`chat-channel-${c.name}`}
                    >
                      <KindIcon kind={c.kind} />
                      <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      {c.call && <Phone size={12} className="shrink-0 text-[var(--w-green-text)]" aria-label={wt('chat.callInProgress')} />}
                      {c.muted && <BellOff size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label={muteLabel(c.mutedUntil, c.mutedForever, undefined, currentWorkLocale()) ?? wt('chat.muted')} />}
                      {c.mentions > 0 ? (
                        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--w-accent)] px-1.5 text-[11px] font-semibold text-[var(--w-on-accent,#fff)]" aria-label={wt('chat.nMentions', { n: c.mentions })}>@{c.mentions}</span>
                      ) : c.unread > 0 && !c.muted ? (
                        <span className="w-count" aria-label={wt('chat.nUnread', { n: c.unread })}>{c.unread > 99 ? '99+' : c.unread}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function ChatView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const ws = config.workspace.slug;
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const search = useSearchParams();
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const meId = me?.id;
  const online = useOnline();

  const chQ = useQuery({ queryKey: chatKeys.channels(pid), queryFn: () => chatApi.channels(pid), refetchInterval: 90_000 });
  const channels = useMemo(() => chQ.data?.channels ?? [], [chQ.data]);
  const urlC = Number(search?.get('c')) || null;
  const urlM = Number(search?.get('m')) || null;
  const urlT = Number(search?.get('t')) || null;
  const cid = urlC && channels.some((c) => c.id === urlC) ? urlC : channels.find((c) => c.isGeneral)?.id ?? channels[0]?.id ?? null;
  const ch = channels.find((c) => c.id === cid) ?? null;

  const panes = usePanes('chat', {
    left: { width: LIST_W, minFrame: 640, strip: true, minMain: 440 },
    right: { width: THREAD_W, minFrame: 1100, minMain: 520 },
    minMain: 440,
  });
  const { left, right } = panes;
  const narrow = panes.frame < 640;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [divider, setDivider] = useState<number>(0);
  const [flash, setFlash] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [newBelow, setNewBelow] = useState(0);
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [thread, setThread] = useState<{ root: ChatMessage; replies: ChatMessage[] } | null>(null);
  const [threadEditing, setThreadEditing] = useState<ChatMessage | null>(null);
  const [confirmDel, setConfirmDel] = useState<ChatMessage | null>(null);
  const [forwardOf, setForwardOf] = useState<ChatMessage | null>(null);
  const [issueOf, setIssueOf] = useState<ChatMessage | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [switcher, setSwitcher] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [pinsOpen, setPinsOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const composer = useRef<ComposerHandle>(null);
  const pinsBtn = useRef<HTMLButtonElement>(null);
  const callBtn = useRef<HTMLButtonElement>(null);
  const moreBtn = useRef<HTMLButtonElement>(null);
  const readTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadSeq = useRef(0);
  const channelsRef = useRef(channels);
  channelsRef.current = channels;

  const membersQ = useQuery({ queryKey: chatKeys.members(pid, cid ?? 0), queryFn: () => chatApi.members(pid, cid!), enabled: !!cid, staleTime: 60_000, refetchInterval: 90_000 });
  const members = useMemo(() => membersQ.data ?? [], [membersQ.data]);
  const known = useMemo(() => new Set(members.map((m) => m.username.toLowerCase())), [members]);
  const pinsQ = useQuery({ queryKey: chatKeys.pinned(pid, cid ?? 0), queryFn: () => chatApi.pinned(pid, cid!), enabled: !!cid });
  const resQ = useQuery({ queryKey: resKeys.sidebar(pid), queryFn: () => resApi.sidebar(pid), enabled: !!config.modules?.resources && chQ.data?.me.audience === 'TEAM', staleTime: 60_000 });
  const searchQ = useQuery({ queryKey: chatKeys.search(pid, cid ?? 0, term.trim()), queryFn: () => chatApi.search(pid, cid!, term.trim()), enabled: !!cid && searchOpen && term.trim().length >= 2 });
  const { typers, ping } = useTyping(pid, cid, meId);

  // Kênh đang xem — thông báo (âm/toast) bỏ qua đúng kênh này.
  useEffect(() => {
    useChatViewing.getState().set(pid, cid);
    return () => useChatViewing.getState().set(null, null);
  }, [pid, cid]);

  const go = useCallback((c: number | null, extra: { m?: number | null; t?: number | null } = {}) => {
    const q = new URLSearchParams();
    if (c) q.set('c', String(c));
    if (extra.m) q.set('m', String(extra.m));
    if (extra.t) q.set('t', String(extra.t));
    router.replace(`${pathname}${q.toString() ? `?${q}` : ''}`, { scroll: false });
  }, [router, pathname]);

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    setNewBelow(0);
  }, []);

  const jumpTo = useCallback((id: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`msg-${id}`);
      if (el) { el.scrollIntoView({ block: 'center' }); setFlash(id); setTimeout(() => setFlash((f) => (f === id ? null : f)), 2000); }
    });
  }, []);

  // Mở kênh: tải trang tin cuối (hoặc quanh ?m=), đặt vạch "New messages", gộp hàng chờ ngoại tuyến của kênh.
  const load = useCallback(async (opts: { around?: number | null } = {}) => {
    if (!cid) return;
    const seq = ++loadSeq.current;
    // Mốc "đã đọc" LÚC MỞ kênh ⇒ vạch "New messages" đứng yên trong lúc xem (đánh dấu đọc không làm nó biến mất).
    const lr = channelsRef.current.find((c) => c.id === cid)?.lastReadId ?? 0;
    setDivider(lr);
    setLoading(true);
    try {
      const page = await chatApi.messages(pid, cid, opts.around ? { around: opts.around, limit: 60 } : { limit: 50 });
      if (seq !== loadSeq.current) return;
      const queued = readQueue(pid, cid).map((m) => ({ ...m, local: 'failed' as const }));
      setMessages([...page.messages, ...queued]);
      setHasMore(page.hasMoreBefore);
      if (opts.around) jumpTo(opts.around);
      else {
        const first = firstUnreadId(page.messages.map((m) => ({ id: m.id, authorId: m.author?.id ?? null })), lr, meId);
        requestAnimationFrame(() => {
          if (first) document.getElementById(`chat-new-${first}`)?.scrollIntoView({ block: 'start' });
          else scrollToBottom();
        });
      }
    } catch (err) {
      if (seq === loadSeq.current) toast.error(workError(err, wt('chat.loadMsgFailed')));
    } finally {
      if (seq === loadSeq.current) setLoading(false);
    }
  }, [pid, cid, meId, jumpTo, scrollToBottom]);

  useEffect(() => {
    setMessages([]);
    setEditing(null);
    setSearchOpen(false);
    setTerm('');
    setNewBelow(0);
  }, [cid]);
  const haveCh = !!ch;
  useEffect(() => {
    if (!cid || !haveCh) return;
    void load({ around: urlM });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, haveCh, urlM]);

  // Đánh dấu đã đọc khi đang nhìn thấy cuối kênh (cửa sổ có focus).
  const markRead = useCallback(() => {
    if (!cid) return;
    if (readTimer.current) clearTimeout(readTimer.current);
    readTimer.current = setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      const last = [...messages].reverse().find((m) => !m.local);
      if (!last) return;
      const cur = channels.find((c) => c.id === cid);
      if (cur && cur.lastReadId >= last.id && !cur.unread && !cur.mentions) return;
      void chatApi.read(pid, cid, last.id).then(() => {
        qc.setQueryData(chatKeys.channels(pid), (old: typeof chQ.data) => old && ({
          ...old,
          channels: old.channels.map((c) => (c.id === cid ? { ...c, unread: 0, mentions: 0, badge: 0, lastReadId: Math.max(c.lastReadId, last.id) } : c)),
          total: old.channels.reduce((a, c) => a + (c.id === cid ? 0 : c.badge), 0),
        }));
        void qc.invalidateQueries({ queryKey: chatKeys.unread });
      }).catch(() => undefined);
    }, 600);
  }, [pid, cid, messages, channels, qc, chQ.data]);
  useEffect(() => { if (atBottom && messages.length) markRead(); }, [atBottom, messages.length, markRead]);
  useEffect(() => {
    const onFocus = () => { if (atBottom) markRead(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [atBottom, markRead]);

  // Luồng (?t=)
  const loadThread = useCallback(async (root: number) => {
    if (!cid) return;
    try { setThread(await chatApi.thread(pid, cid, root)); } catch (err) { toast.error(workError(err, wt('chat.openThreadFailed'))); go(cid); }
  }, [pid, cid, go]);
  useEffect(() => { if (urlT && cid) void loadThread(urlT); else setThread(null); }, [urlT, cid, loadThread]);

  // Thời gian thực
  const refetchOne = useCallback(async (id: number, parentId?: number | null, insert = false) => {
    if (!cid) return;
    try {
      const m = await chatApi.message(pid, cid, id);
      if (!m.parentId) {
        setMessages((list) => (m.deleted && !m.replyCount ? list.filter((x) => x.id !== m.id) : insert || list.some((x) => x.id === m.id) ? upsert(list, m) : list));
      }
      setThread((t) => {
        if (!t) return t;
        if (t.root.id === m.id) return { ...t, root: m };
        if (m.parentId === t.root.id) return { ...t, replies: m.deleted ? t.replies.filter((r) => r.id !== m.id) : upsert(t.replies, m) };
        return t;
      });
    } catch {
      if (!parentId) setMessages((list) => list.filter((x) => x.id !== id));
    }
  }, [pid, cid]);

  const onEvent = useCallback((e: ChatEvent) => {
    if (e.type === 'channel') { void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); return; }
    if (e.type === 'pin') void qc.invalidateQueries({ queryKey: chatKeys.pinned(pid, e.channelId) });
    if (e.type === 'message' && e.messageId) {
      if (e.parentId) {
        void refetchOne(e.parentId);
        if (thread && thread.root.id === e.parentId) void refetchOne(e.messageId, e.parentId);
        return;
      }
      if (e.message) {
        const m = e.message;
        setMessages((list) => upsert(list, m));
        if (m.author?.id !== meId) {
          const el = scroller.current;
          const near = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 120;
          if (near) requestAnimationFrame(() => scrollToBottom(true));
          else setNewBelow((n) => n + 1);
        }
        if (e.hasPreviews) void refetchOne(m.id);
      } else void refetchOne(e.messageId, null, true); // tin hệ thống (gọi nhóm, tạo kênh…) chỉ báo id
      return;
    }
    if (e.messageId) void refetchOne(e.messageId, e.parentId);
  }, [pid, qc, refetchOne, thread, meId, scrollToBottom]);
  useChannelRoom(pid, cid, onEvent, () => { void load(); void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); });

  // ⌘K tìm kênh (trang chat) · `[` danh sách kênh · Esc đóng luồng.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSwitcher((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
  usePaneKeys({ left: left.toggle, escape: () => { if (urlT) { go(cid); return true; } return false; } });

  // Hàng chờ ngoại tuyến: có mạng lại ⇒ gửi lại theo thứ tự (cùng clientKey ⇒ server không tạo trùng).
  const sendNow = useCallback(async (local: ChatMessage, fileIds: number[]) => {
    if (!cid) return;
    setMessages((list) => upsert(list, { ...local, local: 'sending' }, local.clientKey));
    try {
      const m = await chatApi.send(pid, cid, { body: local.body, fileIds, clientKey: local.clientKey, parentId: local.parentId });
      setMessages((list) => {
        const next = local.parentId ? list.filter((x) => !(x.local && x.clientKey === local.clientKey)) : upsert(list, m, local.clientKey);
        writeQueue(pid, cid, next);
        return next;
      });
      if (local.parentId) setThread((t) => (t && t.root.id === local.parentId ? { ...t, replies: upsert(t.replies, m, local.clientKey) } : t));
      requestAnimationFrame(() => scrollToBottom(true));
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setMessages((list) => {
        // Lỗi mạng ⇒ giữ trong hàng chờ để gửi lại; lỗi máy chủ (4xx) ⇒ báo, vẫn giữ để người dùng sửa/bỏ.
        const next = list.map((x) => (x.local && x.clientKey === local.clientKey ? { ...x, local: 'failed' as const } : x));
        if (!local.parentId) writeQueue(pid, cid, next);
        return next;
      });
      if (status) toast.error(workError(err, wt('chat.sendFailed')));
    }
  }, [pid, cid, scrollToBottom]);
  useEffect(() => {
    if (!online || !cid) return;
    const failed = messages.filter((m) => m.local === 'failed' && !m.files.length);
    for (const m of failed) void sendNow(m, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, cid]);

  const send = useCallback((input: { body: string; fileIds: number[]; files: ChatMessage['files'] }, parentId: number | null = null) => {
    if (!cid || !me) return;
    const local: ChatMessage = {
      id: Number.MAX_SAFE_INTEGER - Date.now() % 1_000_000, channelId: cid, kind: 'USER', parentId, replyCount: 0, lastReplyAt: null,
      createdAt: new Date().toISOString(), editedAt: null, deleted: false, clientKey: newClientKey(), body: input.body,
      author: { id: me.id, username: me.username, fullName: me.fullName ?? null, displayName: (me as { displayName?: string | null }).displayName ?? null, avatarUrl: (me as { avatarUrl?: string | null }).avatarUrl ?? null },
      mentions: [], meta: null, pinned: null, reactions: [], files: input.files, links: [], previews: [], local: 'sending',
    };
    ping(parentId, false);
    if (parentId) {
      setThread((t) => (t ? { ...t, replies: [...t.replies, local] } : t));
      void chatApi.send(pid, cid, { body: input.body, fileIds: input.fileIds, parentId, clientKey: local.clientKey })
        .then((m) => setThread((t) => (t ? { ...t, replies: upsert(t.replies, m, local.clientKey) } : t)))
        .catch((err) => { setThread((t) => (t ? { ...t, replies: t.replies.map((r) => (r.clientKey === local.clientKey ? { ...r, local: 'failed' } : r)) } : t)); toast.error(workError(err, wt('chat.replyFailed'))); });
      return;
    }
    if (!online) {
      setMessages((list) => { const next = [...list, { ...local, local: 'failed' as const }]; writeQueue(pid, cid, next); return next; });
      toast.info(wt('chat.offlineQueued'));
      return;
    }
    void sendNow(local, input.fileIds);
  }, [pid, cid, me, online, ping, sendNow]);

  const saveEdit = useCallback(async (m: ChatMessage, body: string) => {
    if (!cid) return;
    try {
      const r = await chatApi.edit(pid, cid, m.id, body);
      if (r.parentId) setThread((t) => (t ? { ...t, replies: upsert(t.replies, r) } : t));
      else setMessages((list) => upsert(list, r));
      setEditing(null);
      setThreadEditing(null);
    } catch (err) { toast.error(workError(err, wt('chat.editFailed'))); }
  }, [pid, cid]);

  const actions: MessageActions = useMemo(() => ({
    onReact: (m, emoji, active) => {
      if (!cid) return;
      void chatApi.react(pid, cid, m.id, emoji, active).then((r) => {
        const apply = (x: ChatMessage) => (x.id === r.messageId ? { ...x, reactions: r.reactions } : x);
        setMessages((list) => list.map(apply));
        setThread((t) => (t ? { root: apply(t.root), replies: t.replies.map(apply) } : t));
      }).catch((err) => toast.error(workError(err, wt('chat.reactFailed'))));
    },
    onReply: (m) => go(cid, { t: m.parentId ?? m.id }),
    onEdit: (m) => (m.parentId ? setThreadEditing(m) : setEditing(m)),
    onDelete: (m) => setConfirmDel(m),
    onPin: (m, pinned) => {
      if (!cid) return;
      void chatApi.pin(pid, cid, m.id, pinned).then(() => { void refetchOne(m.id, m.parentId); void qc.invalidateQueries({ queryKey: chatKeys.pinned(pid, cid) }); toast.success(pinned ? wt('chat.pinned') : wt('chat.unpinned')); })
        .catch((err) => toast.error(workError(err, wt('chat.pinFailed'))));
    },
    onCreateIssue: (m) => setIssueOf(m),
    onForward: (m) => setForwardOf(m),
    onCopyLink: (m) => {
      const url = `${window.location.origin}${chatPath(ws, config.key, cid ?? undefined, m.id, m.parentId)}`;
      void navigator.clipboard?.writeText(url).then(() => toast.success(wt('common.linkCopied'))).catch(() => toast.error(wt('chat.copyFailed')));
    },
    onRetry: (m) => void sendNow(m, []),
    onDiscard: (m) => setMessages((list) => { const next = list.filter((x) => x !== m); if (cid) writeQueue(pid, cid, next); return next; }),
  }), [pid, cid, go, refetchOne, qc, ws, config.key, sendNow]);

  const editLast = useCallback(() => {
    const last = [...messages].reverse().find((m) => m.author?.id === meId && m.kind === 'USER' && !m.deleted && !m.local);
    if (last) setEditing(last);
  }, [messages, meId]);

  const startCall = async (url?: string) => {
    if (!cid) return;
    setCallOpen(false);
    // Mở cửa sổ NGAY trong cú bấm (trình duyệt chặn popup mở sau await), rồi trỏ tới phòng khi máy chủ trả link.
    const w = window.open('about:blank', '_blank');
    try {
      const r = await chatApi.call(pid, cid, url);
      if (w) { w.opener = null; w.location.href = r.url; } else window.open(r.url, '_blank', 'noopener');
      void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) });
    } catch (err) {
      w?.close();
      toast.error(workError(err, wt('chat.callFailed')));
    }
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (bottom !== atBottom) setAtBottom(bottom);
    if (bottom) setNewBelow(0);
    if (el.scrollTop < 120 && hasMore && !loadingOlder && messages.length) void loadOlder();
  };
  const loadOlder = async () => {
    if (!cid) return;
    const first = messages.find((m) => !m.local);
    if (!first) return;
    setLoadingOlder(true);
    const el = scroller.current;
    const before = el ? el.scrollHeight - el.scrollTop : 0;
    try {
      const page = await chatApi.messages(pid, cid, { before: first.id, limit: 50 });
      setMessages((list) => [...page.messages.filter((m) => !list.some((x) => x.id === m.id)), ...list]);
      setHasMore(page.hasMoreBefore);
      requestAnimationFrame(() => { if (el) el.scrollTop = el.scrollHeight - before; });
    } catch { /* thử lại khi cuộn lần sau */ } finally { setLoadingOlder(false); }
  };

  const typingText = typingLine(typers.filter((t) => !t.threadId).map((t) => userName(t.user)), currentWorkLocale());
  const threadTyping = typingLine(typers.filter((t) => thread && t.threadId === thread.root.id).map((t) => userName(t.user)));
  const firstNew = useMemo(() => firstUnreadId(messages.filter((m) => !m.local).map((m) => ({ id: m.id, authorId: m.author?.id ?? null })), divider, meId), [messages, divider, meId]);
  const onlineCount = members.filter((m) => m.online).length;
  const canModerate = !!chQ.data?.me.canModerate;
  const canPin = !!ch?.canPost;
  const threadInline = !!thread && right.mode !== 'drawer';

  // ─── Vẽ ────────────────────────────────────────────────────────
  if (chQ.isLoading) return <PageLoading />;
  if (chQ.error) return <EmptyState title={wt('chat.loadChatFailed')} body={workError(chQ.error)} />;
  if (!channels.length) {
    return (
      <EmptyState
        title={chQ.data?.me.audience === 'CLIENT' ? wt('chat.noTeamChat') : wt('chat.noChannels')}
        body={chQ.data?.me.audience === 'CLIENT' ? wt('chat.noTeamChatBody') : wt('chat.createFirst')}
      />
    );
  }

  const list = (
    <ChannelList channels={channels} active={cid} canCreate={!!chQ.data?.me.canCreate}
      onPick={(id) => { go(id); left.mode === 'drawer' && left.close(); }} onCreate={() => setCreateOpen(true)} onSettings={() => setSettingsOpen(true)} />
  );

  const renderList = (items: ChatMessage[], opts: { inThread?: boolean } = {}) => {
    const out: React.ReactNode[] = [];
    let prev: ChatMessage | null = null;
    for (const m of items) {
      if (!opts.inThread && (!prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString())) {
        out.push(<div key={`d-${m.id}`} className="my-2 flex items-center gap-3 px-5 text-[11.5px] font-medium text-[var(--w-text-3)]" role="separator"><span className="h-px flex-1 bg-[var(--w-border)]" />{dayLabel(m.createdAt)}<span className="h-px flex-1 bg-[var(--w-border)]" /></div>);
        prev = null;
      }
      if (!opts.inThread && firstNew === m.id) out.push(<div key={`n-${m.id}`} id={`chat-new-${m.id}`} className="w-chat-new" role="separator" aria-label={wt('chat.newMessages')}>{wt('chat.newMessages')}</div>);
      const cont = !(firstNew === m.id) && isContinuation(prev && { authorId: prev.author?.id ?? null, createdAt: prev.createdAt, kind: prev.kind }, { authorId: m.author?.id ?? null, createdAt: m.createdAt, kind: m.kind });
      out.push(
        <MessageItem key={m.local ? `l-${m.clientKey}` : m.id} m={m} pid={pid} meId={meId} meUsername={me?.username} known={known} continuation={cont}
          canPost={!!ch?.canPost} canModerate={canModerate} canPin={canPin} inThread={opts.inThread} highlight={flash === m.id} actions={actions} />,
      );
      prev = m;
    }
    return out;
  };

  const threadPanel = thread && ch && (
    <div className="flex h-full min-h-0 flex-col" aria-label={wt('chat.thread')}>
      {threadInline && (
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3">
          <span className="flex-1 text-[13.5px] font-semibold">{wt('chat.thread')} <span className="font-normal text-[var(--w-text-3)]">#{ch.name}</span></span>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.closeThread')} onClick={() => go(cid)}><X size={15} /></button>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {renderList([thread.root], { inThread: true })}
        <div className="my-1 flex items-center gap-3 px-5 text-[11.5px] text-[var(--w-text-3)]"><span className="h-px flex-1 bg-[var(--w-border)]" />{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}<span className="h-px flex-1 bg-[var(--w-border)]" /></div>
        {renderList(thread.replies, { inThread: true })}
      </div>
      <div className="h-5 px-5 text-[12px] text-[var(--w-text-3)]" aria-live="polite">{threadTyping && <span className="inline-flex items-center gap-1.5"><span className="w-typing-dots"><i /><i /><i /></span>{threadTyping}</span>}</div>
      <Composer pid={pid} cid={ch.id} channelName={ch.name} threadId={thread.root.id} members={members} canPost={ch.canPost} compact
        editing={threadEditing} onSend={(i) => send(i, thread.root.id)} onSaveEdit={(m, b) => void saveEdit(m, b)} onCancelEdit={() => setThreadEditing(null)} onTyping={() => ping(thread.root.id)} />
    </div>
  );

  return (
    <div ref={panes.ref} className="flex h-full min-h-0" data-testid="chat-view">
      {left.mode === 'inline' && <aside className="shrink-0 border-r border-[var(--w-border)] bg-[var(--w-bg)]" style={{ width: LIST_W }}>{list}</aside>}
      {left.mode === 'strip' && !narrow && <PaneStrip label={wt('chat.channels')} shortcut="[" onOpen={left.toggle} />}

      <section className="flex min-w-0 flex-1 flex-col" aria-label={ch ? `#${ch.name}` : wt('chat.chat')}>
        {ch && (
          <header className="flex min-h-11 shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-3 py-1.5 sm:px-4">
            {left.mode !== 'inline' && <PaneToggle pane={left} side="left" label={wt('chat.channels')} shortcut="[" showLabel={false} />}
            <button type="button" className="flex min-w-0 items-center gap-1.5 rounded-[6px] px-1 py-0.5 text-left hover:bg-[var(--w-hover)]" onClick={() => setSwitcher(true)} title={wt('chat.switchChannel')}>
              <KindIcon kind={ch.kind} size={15} />
              <h2 className="truncate text-[15px] font-semibold">{ch.name}</h2>
            </button>
            {ch.topic && <span className="hidden min-w-0 max-w-[40%] truncate text-[12.5px] text-[var(--w-text-2)] lg:inline" title={ch.topic}>{ch.topic}</span>}
            {ch.muted && <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--w-text-3)]" title={muteLabel(ch.mutedUntil, ch.mutedForever, undefined, currentWorkLocale()) ?? undefined}><BellOff size={12} aria-hidden="true" /><span className="max-md:hidden">{wt('chat.muted')}</span></span>}
            <div className="ml-auto flex items-center gap-1">
              {!online && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11.5px] text-[var(--w-orange-text)]" role="status"><WifiOff size={12} />{wt('chat.offline')}</span>}
              <button type="button" className="w-btn w-btn-sm" onClick={() => setMembersOpen(true)} aria-label={wt('chat.membersOnline', { n: members.length, o: onlineCount })} title={wt('common.members')}>
                <Users size={14} /><span className="tabular-nums">{members.length}</span>
                {onlineCount > 0 && <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--w-green-text)] max-sm:hidden"><span className="h-1.5 w-1.5 rounded-full bg-[var(--w-green)]" />{onlineCount}</span>}
              </button>
              <button ref={pinsBtn} type="button" className="w-btn w-btn-sm" onClick={() => setPinsOpen((o) => !o)} aria-label={wt('chat.nPinned', { n: pinsQ.data?.length ?? 0 })} title={wt('chat.pinnedMessages')} aria-expanded={pinsOpen}>
                <Pin size={14} /><span className="tabular-nums">{pinsQ.data?.length ?? 0}</span>
              </button>
              <button type="button" className={cn('w-btn w-btn-sm w-btn-icon', searchOpen && 'w-btn-on')} aria-label={wt('chat.searchChannel')} title={wt('chat.searchChannel')} aria-pressed={searchOpen} onClick={() => setSearchOpen((o) => !o)}><Search size={14} /></button>
              {ch.canPost && (
                ch.call ? (
                  <a href={ch.call.url} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-sm border-[var(--w-green)] text-[var(--w-green-text)]" title={wt('chat.joinCallTip')} data-testid="chat-join-call"><Video size={14} /><span className="max-sm:hidden">{wt('chat.joinCall')}</span></a>
                ) : (
                  <button ref={callBtn} type="button" className="w-btn w-btn-sm" onClick={() => setCallOpen((o) => !o)} aria-expanded={callOpen} title={wt('chat.startTeamCall')} data-testid="chat-call"><Phone size={14} /><span className="max-sm:hidden">{wt('chat.call')}</span></button>
                )
              )}
              <ChannelMuteMenu pid={pid} ch={ch} />
              <button ref={moreBtn} type="button" className="w-btn w-btn-sm w-btn-icon" aria-label={wt('chat.channelOptions')} aria-haspopup="menu" aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)}><MoreHorizontal size={14} /></button>
            </div>
          </header>
        )}

        {/* Thanh ghim: tài nguyên đã ghim của dự án (Resources) — bấm là mở. */}
        {(resQ.data?.items.length ?? 0) > 0 && (
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-[var(--w-border)] px-3 py-1.5 sm:px-4" aria-label={wt('chat.pinnedLinks')} data-testid="chat-pinned-links">
            <span className="w-eyebrow shrink-0">{wt('chat.pinnedE')}</span>
            {resQ.data!.items.map((r) => (
              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" onClick={() => { void resApi.open(pid, r.id).catch(() => undefined); }}
                className="inline-flex h-7 max-w-[220px] shrink-0 items-center gap-1.5 rounded-[6px] border border-[var(--w-border)] px-2 text-[12.5px] hover:bg-[var(--w-hover)]" title={r.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.faviconUrl ? <img src={r.faviconUrl} alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-[3px]" referrerPolicy="no-referrer" loading="lazy" /> : <ExternalLink size={12} aria-hidden="true" />}
                <span className="truncate">{r.title}</span>
              </a>
            ))}
          </div>
        )}

        {searchOpen && (
          <div className="shrink-0 border-b border-[var(--w-border)] px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="chat-search">{wt('chat.searchMessages')}</label>
              <input id="chat-search" className="w-input h-8" autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder={wt('chat.searchPh', { name: ch?.name ?? '' })}
                onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setSearchOpen(false); } }} />
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.closeSearch')} onClick={() => setSearchOpen(false)}><X size={14} /></button>
            </div>
            {term.trim().length >= 2 && (
              <div className="mt-2 max-h-[45vh] overflow-y-auto rounded-[8px] border border-[var(--w-border)]" aria-live="polite">
                {searchQ.isLoading ? <div className="flex justify-center p-3"><Spinner /></div> : !searchQ.data?.length ? <p className="p-3 text-[13px] text-[var(--w-text-2)]">{wt('chat.noMatch')}</p> : (
                  <ul>
                    {searchQ.data.map((m) => (
                      <li key={m.id}>
                        <button type="button" className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-[var(--w-hover)]" onClick={() => { setSearchOpen(false); if (m.parentId) go(cid, { t: m.parentId }); else void load({ around: m.id }); }}>
                          <UserAvatar user={m.author} size={20} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] text-[var(--w-text-3)]">{m.author ? userName(m.author) : wt('chat.someone')} · {new Date(m.createdAt).toLocaleString(wfmt.intl(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="line-clamp-2 text-[13px]">{m.body || m.files.map((f) => f.voice?.transcript ?? f.fileName).join(', ')}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative min-h-0 flex-1">
          <div ref={scroller} onScroll={onScroll} className="h-full overflow-y-auto pb-2" data-testid="chat-messages" aria-live="polite" aria-relevant="additions" role="log" aria-label={ch ? wt('chat.messagesIn', { name: ch.name }) : wt('chat.messages')}>
            {loadingOlder && <div className="flex justify-center py-2"><Spinner size={14} /></div>}
            {!hasMore && !loading && ch && (
              <div className="px-5 pb-3 pt-6">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><KindIcon kind={ch.kind} size={20} /></div>
                <p className="text-[16px] font-semibold">{wt('chat.welcome', { name: ch.name })}</p>
                <p className="text-[13px] text-[var(--w-text-2)]">{ch.topic ?? (ch.kind === 'CLIENT' ? wt('chat.clientChannelDesc') : ch.kind === 'PRIVATE' ? wt('chat.privateDesc') : wt('chat.publicDesc'))}</p>
              </div>
            )}
            {loading && !messages.length ? <div className="flex justify-center py-10"><Spinner /></div> : renderList(messages)}
          </div>
          {newBelow > 0 && (
            <button type="button" className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--w-accent)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--w-on-accent,#fff)] shadow" onClick={() => scrollToBottom(true)}>
              <ArrowDown size={13} />{wt('chat.newBelow', { count: newBelow })}
            </button>
          )}
        </div>
        <div className="h-5 shrink-0 px-5 text-[12px] text-[var(--w-text-3)]" aria-live="polite">
          {typingText && <span className="inline-flex items-center gap-1.5"><span className="w-typing-dots" aria-hidden="true"><i /><i /><i /></span>{typingText}</span>}
        </div>
        {ch && (
          <Composer
            ref={composer} pid={pid} cid={ch.id} channelName={ch.name} members={members} canPost={ch.canPost}
            readOnlyReason={ch.archived ? wt('chat.archivedRo') : wt('chat.viewOnlyRo')}
            editing={editing} onSend={(i) => send(i)} onSaveEdit={(m, b) => void saveEdit(m, b)} onCancelEdit={() => setEditing(null)}
            onEditLast={editLast} onTyping={() => ping(null)}
          />
        )}
      </section>

      {threadInline && <aside className="shrink-0 border-l border-[var(--w-border)] bg-[var(--w-panel)]" style={{ width: THREAD_W }}>{threadPanel}</aside>}
      <PaneDrawer open={!!thread && right.mode === 'drawer'} onClose={() => go(cid)} side="right" label={wt('chat.threadIn', { name: ch?.name ?? '' })} width={narrow ? 900 : THREAD_W + 20}>
        {threadPanel}
      </PaneDrawer>
      <PaneDrawer open={left.drawerOpen} onClose={left.close} side="left" label={wt('chat.channels')} width={300}>{list}</PaneDrawer>

      {/* Lớp nổi */}
      <Popover open={pinsOpen} onClose={() => setPinsOpen(false)} anchorRef={pinsBtn} width={360} align="end">
        <div className="max-h-[420px] overflow-y-auto p-1" aria-label={wt('chat.pinnedMessages')}>
          <p className="w-eyebrow px-2 pb-1 pt-1.5">{wt('chat.pinnedMessages')}</p>
          {!pinsQ.data?.length ? <p className="px-2 pb-2 text-[13px] text-[var(--w-text-2)]">{wt('chat.nothingPinned')}</p> : pinsQ.data.map((m) => (
            <button key={m.id} type="button" className="flex w-full items-start gap-2 rounded-[6px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]" onClick={() => { setPinsOpen(false); if (m.parentId) go(cid, { t: m.parentId }); else if (messages.some((x) => x.id === m.id)) jumpTo(m.id); else void load({ around: m.id }); }}>
              <UserAvatar user={m.author} size={18} />
              <span className="min-w-0 flex-1"><span className="block text-[11.5px] text-[var(--w-text-3)]">{m.author ? userName(m.author) : ''}</span><span className="line-clamp-2 text-[13px]">{m.body || m.files.map((f) => f.fileName).join(', ')}</span></span>
            </button>
          ))}
        </div>
      </Popover>
      <Popover open={callOpen} onClose={() => setCallOpen(false)} anchorRef={callBtn} width={300} align="end">
        <CallMenu onJitsi={() => void startCall()} onMeet={(u) => void startCall(u)} />
      </Popover>
      <Popover open={moreOpen} onClose={() => setMoreOpen(false)} anchorRef={moreBtn} width={230} align="end">
        <div role="menu" className="p-1">
          <MenuItem icon={CheckCheck} label={wt('chat.markAllRead')} onClick={() => { setMoreOpen(false); void chatApi.readAll(pid).then(() => { void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); void qc.invalidateQueries({ queryKey: chatKeys.unread }); }); }} />
          <MenuItem icon={Users} label={wt('common.members')} onClick={() => { setMoreOpen(false); setMembersOpen(true); }} />
          {ch?.canManage && <MenuItem icon={Pencil} label={ch.isGeneral ? wt('chat.editTopic') : wt('chat.renameTopic')} onClick={() => { setMoreOpen(false); setRenameOpen(true); }} />}
          {ch?.canManage && !ch.isGeneral && <MenuItem icon={Archive} label={wt('chat.archiveChannel')} danger onClick={() => {
            setMoreOpen(false);
            void chatApi.updateChannel(pid, ch.id, { archived: true }).then(() => { toast.success(`#${ch.name} archived`); void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); go(null); })
              .catch((err) => toast.error(workError(err, wt('chat.archiveFailed'))));
          }} />}
          <MenuItem icon={Settings2} label={wt('chat.notifSettings')} onClick={() => { setMoreOpen(false); setSettingsOpen(true); }} />
        </div>
      </Popover>

      <ChannelSwitcher open={switcher} onClose={() => setSwitcher(false)} channels={channels} onPick={(id) => { setSwitcher(false); go(id); setTimeout(() => composer.current?.focus(), 50); }} />
      <Dialog open={!!confirmDel} onClose={() => setConfirmDel(null)} title={wt('chat.deleteMsgQ')} width={420}
        footer={<><button type="button" className="w-btn" onClick={() => setConfirmDel(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-danger-solid" onClick={() => {
          const m = confirmDel!;
          setConfirmDel(null);
          if (!cid) return;
          void chatApi.remove(pid, cid, m.id).then(() => {
            setMessages((list) => list.filter((x) => x.id !== m.id || x.replyCount > 0).map((x) => (x.id === m.id ? { ...x, deleted: true, body: '' } : x)));
            setThread((t) => (t ? { ...t, replies: t.replies.filter((r) => r.id !== m.id) } : t));
          }).catch((err) => toast.error(workError(err, wt('common.couldNotDelete'))));
        }}>{wt('common.delete')}</button></>}>
        <p className="text-[13.5px] text-[var(--w-text-2)]">{confirmDel?.author?.id === meId ? wt('chat.delOwn') : wt('chat.delOther')}</p>
      </Dialog>
      <ForwardDialog open={!!forwardOf} onClose={() => setForwardOf(null)} pid={pid} from={forwardOf} channels={channels} />
      <CreateIssueFromMessageDialog open={!!issueOf} onClose={() => setIssueOf(null)} pid={pid} msg={issueOf} config={config} />
      <CreateChannelDialog open={createOpen} onClose={() => setCreateOpen(false)} pid={pid} config={config} canClient={!!chQ.data?.me.canCreateClient && !channels.some((c) => c.kind === 'CLIENT')} onCreated={(id) => go(id)} />
      <ChatSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {ch && <ChannelMembersDialog open={membersOpen} onClose={() => setMembersOpen(false)} pid={pid} ch={ch} config={config} />}
      {ch && <RenameDialog open={renameOpen} onClose={() => setRenameOpen(false)} pid={pid} ch={ch} />}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: typeof Pin; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className={cn('flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] hover:bg-[var(--w-hover)]', danger && 'text-[var(--w-red-text)]')}>
      <Icon size={14} aria-hidden="true" />{label}
    </button>
  );
}

function CallMenu({ onJitsi, onMeet }: { onJitsi: () => void; onMeet: (url: string) => void }) {
  const [url, setUrl] = useState('');
  return (
    <div className="space-y-2 p-2">
      <button type="button" className="w-btn w-btn-primary w-full justify-center" onClick={onJitsi} data-testid="chat-call-jitsi"><Video size={14} />{wt('chat.startJitsi')}</button>
      <p className="text-[11.5px] text-[var(--w-text-3)]">{wt('chat.jitsiNote')}</p>
      <div className="border-t border-[var(--w-border)] pt-2">
        <label className="w-label mb-1 block" htmlFor="chat-meet-url">{wt('chat.orMeet')}</label>
        <div className="flex gap-1.5">
          <input id="chat-meet-url" className="w-input h-8" placeholder="https://meet.google.com/…" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" className="w-btn w-btn-sm" disabled={!/^https:\/\//.test(url)} onClick={() => onMeet(url)}>{wt('chat.post')}</button>
        </div>
      </div>
    </div>
  );
}

function ChannelSwitcher({ open, onClose, channels, onPick }: { open: boolean; onClose: () => void; channels: ChatChannel[]; onPick: (id: number) => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  useEffect(() => { if (open) { setQ(''); setSel(0); } }, [open]);
  const list = channels.filter((c) => !q || c.name.includes(q.toLowerCase().replace(/^#/, '')) || (c.topic ?? '').toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open={open} onClose={onClose} title={wt('chat.jumpChannel')} width={460}>
      <label className="sr-only" htmlFor="chat-switch">{wt('chat.channelName')}</label>
      <input id="chat-switch" className="w-input" autoFocus value={q} placeholder={wt('chat.typeChannel')} onChange={(e) => { setQ(e.target.value); setSel(0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
          if (e.key === 'Enter' && list[sel]) { e.preventDefault(); onPick(list[sel].id); }
        }} />
      <ul className="mt-2 max-h-[320px] overflow-y-auto" role="listbox" aria-label={wt('chat.channels')}>
        {list.map((c, i) => (
          <li key={c.id} role="option" aria-selected={i === sel}>
            <button type="button" className={cn('flex h-9 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13.5px]', i === sel ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')} onClick={() => onPick(c.id)}>
              <KindIcon kind={c.kind} /><span className="flex-1 truncate">{c.name}</span>
              {c.unread > 0 && <span className="w-count">{c.unread}</span>}
            </button>
          </li>
        ))}
        {!list.length && <li className="px-2 py-2 text-[13px] text-[var(--w-text-2)]">{wt('chat.noChannelMatch')}</li>}
      </ul>
    </Dialog>
  );
}

function RenameDialog({ open, onClose, pid, ch }: { open: boolean; onClose: () => void; pid: number; ch: ChatChannel }) {
  const qc = useQueryClient();
  const [name, setName] = useState(ch.name);
  const [topic, setTopic] = useState(ch.topic ?? '');
  useEffect(() => { if (open) { setName(ch.name); setTopic(ch.topic ?? ''); } }, [open, ch]);
  const save = async () => {
    try {
      await chatApi.updateChannel(pid, ch.id, { ...(ch.isGeneral ? {} : { name }), topic: topic || null });
      void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) });
      onClose();
    } catch (err) { toast.error(workError(err, wt('common.couldNotSave'))); }
  };
  return (
    <Dialog open={open} onClose={onClose} title={wt('chat.editX', { name: ch.name })} width={460}
      footer={<><button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" onClick={() => void save()}>{wt('common.save')}</button></>}>
      <div className="space-y-3">
        {!ch.isGeneral && <Field label={wt('common.name')}><input className="w-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></Field>}
        <Field label={wt('chat.topic')}><input className="w-input" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={250} /></Field>
      </div>
    </Dialog>
  );
}
