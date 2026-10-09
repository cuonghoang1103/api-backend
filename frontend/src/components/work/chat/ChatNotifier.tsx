'use client';

/**
 * CT Work K-3 — THÔNG BÁO TIN CHAT, chung cho web và app desktop (một hệ, không làm hệ thứ hai):
 *
 *   · Badge số chưa đọc: sidebar dự án (`ChatNavBadge`) + tiêu đề tab trình duyệt "(3) CT Work".
 *   · Tin đến (`work:chat:notify` trên phòng riêng `user:<id>` — server đã tính `alert` theo tắt tiếng / chế độ
 *     "chỉ khi @nhắc" / giờ im lặng của CHÍNH người nhận): toast trong ứng dụng khi đang ở trang khác, âm báo tự tổng hợp
 *     bằng WebAudio (không tệp có bản quyền), thông báo hệ thống khi cửa sổ ở nền. App desktop: `Notification` trong
 *     renderer của Electron = thông báo NATIVE của hệ điều hành (cùng đường ThongBaoHost đang dùng). Bấm ⇒ mở đúng
 *     kênh, đúng tin.
 *   · Không báo tin của chính mình; đang mở đúng kênh + cửa sổ focus ⇒ không âm.
 *
 * Gắn ở WorkShell (web + CT Work trong app) VÀ ThongBaoHost (app desktop, mọi trang). Chỉ MỘT bản thật sự nghe socket
 * (khoá cấp module) ⇒ không bao giờ kêu hai lần.
 */

import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { create } from 'zustand';
import { connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { chatApi, chatKeys, type ChatNotify } from '@/lib/work-chat-api';
import { localAlert, titleWithBadge } from '@/lib/work-chat-rules';

// ─── Kênh đang xem (ChatView đặt) ────────────────────────────────

export const useChatViewing = create<{ pid: number | null; cid: number | null; set: (pid: number | null, cid: number | null) => void }>((set) => ({
  pid: null, cid: null, set: (pid, cid) => set({ pid, cid }),
}));

// ─── Âm báo tự tổng hợp (WebAudio) ───────────────────────────────

let audioCtx: AudioContext | null = null;
/** Hai nốt ngắn (A5 → E6), ~180ms, âm lượng nhỏ — tự tạo, không tệp nào. */
export function playChatBlip(volume = 0.18): void {
  try {
    if (typeof window === 'undefined') return;
    if (usePreferencesStore.getState().masterEnabled === false) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx ?? new AC();
    if (audioCtx.state === 'suspended') void audioCtx.resume().catch(() => undefined);
    const t0 = audioCtx.currentTime + 0.01;
    for (const [freq, at] of [[880, 0], [1318.5, 0.085]] as const) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t0 + at);
      gain.gain.linearRampToValueAtTime(volume, t0 + at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 0.16);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0 + at);
      osc.stop(t0 + at + 0.18);
    }
  } catch { /* trình duyệt chặn âm khi chưa tương tác — bỏ qua */ }
}

// ─── Badge chưa đọc ──────────────────────────────────────────────

export function useChatUnread(enabled = true) {
  const q = useQuery({ queryKey: chatKeys.unread, queryFn: chatApi.unread, enabled, staleTime: 30_000, refetchInterval: 120_000, retry: false });
  const byProject = new Map((q.data?.projects ?? []).map((p) => [p.projectId, p]));
  return { total: q.data?.total ?? 0, byProject };
}

export function ChatNavBadge({ pid }: { pid: number }) {
  const { byProject } = useChatUnread();
  const p = byProject.get(pid);
  if (!p || (!p.unread && !p.mentions)) return null;
  const n = p.unread || p.mentions;
  return (
    <span
      className="w-rail-hide ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--w-accent)] px-1.5 text-[11px] font-semibold tabular-nums text-[var(--w-on-accent,#fff)]"
      aria-label={`${n} unread${p.mentions ? `, ${p.mentions} mentioning you` : ''}`}
      data-testid="chat-nav-badge"
    >
      {n > 99 ? '99+' : n}
    </span>
  );
}

// ─── Host ────────────────────────────────────────────────────────

let owner: symbol | null = null;

function osAllowed(): boolean {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

/** Xin quyền thông báo hệ thống — CHỈ gọi khi người dùng tự bấm "Enable notifications". */
export async function requestChatNotifications(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try { return await Notification.requestPermission(); } catch { return Notification.permission; }
}

export function ChatNotifierHost({ go }: { go?: (url: string) => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const { total } = useChatUnread(!!meId);
  const goRef = useRef(go ?? ((u: string) => router.push(u)));
  goRef.current = go ?? ((u: string) => router.push(u));
  const mine = useRef(Symbol('chat-notifier'));

  // Tiêu đề tab "(3) CT Work" — Next đổi <title> khi chuyển trang ⇒ theo dõi và gắn lại số.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const apply = () => {
      const t = titleWithBadge(document.title, total);
      if (t !== document.title) document.title = t;
    };
    apply();
    const el = document.querySelector('title');
    const mo = el ? new MutationObserver(apply) : null;
    if (el && mo) mo.observe(el, { childList: true, characterData: true, subtree: true });
    return () => { mo?.disconnect(); document.title = titleWithBadge(document.title, 0); };
  }, [total]);

  useEffect(() => {
    if (!meId) return;
    if (owner && owner !== mine.current) return; // một bản khác đã nghe
    owner = mine.current;
    let alive = true;
    let sock: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const refresh = (pid?: number) => {
      void qc.invalidateQueries({ queryKey: chatKeys.unread });
      if (pid) void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) });
    };
    const onNotify = (n: ChatNotify) => {
      if (!n || n.author?.id === meId) return;
      refresh(n.projectId);
      const viewing = useChatViewing.getState();
      const focused = typeof document !== 'undefined' && document.visibilityState === 'visible' && document.hasFocus();
      const what = localAlert(n, { viewingChannelId: viewing.pid === n.projectId ? viewing.cid : null, focused, osAllowed: osAllowed() }, n.channelId);
      const head = `${n.mention ? '@' : '#'}${n.channelName} · ${n.projectKey}`;
      const body = `${n.authorName}: ${n.excerpt || 'sent a message'}`;
      if (what.sound) playChatBlip();
      if (what.toast) {
        toast(head, { description: body.slice(0, 160), action: { label: 'Open', onClick: () => goRef.current(n.url) }, duration: 6000 });
      }
      if (what.os) {
        try {
          const note = new Notification(`${n.mention ? 'Mentioned in ' : ''}#${n.channelName} — ${n.projectName}`, { body: body.slice(0, 180), tag: `ctw-chat-${n.channelId}`, silent: true });
          note.onclick = () => { try { window.focus(); } catch { /* */ } goRef.current(n.url); note.close(); };
        } catch { /* trình duyệt không cho tạo — bỏ qua */ }
      }
    };
    const onRead = (e: { projectId: number }) => refresh(e?.projectId);
    const onChanged = (e: { projectId: number }) => refresh(e?.projectId);
    const onPrefs = (e: { projectId?: number }) => {
      void qc.invalidateQueries({ queryKey: chatKeys.prefs });
      refresh(e?.projectId);
    };
    connectSocket().then((s) => {
      if (!alive) return;
      sock = s;
      s.on('work:chat:notify', onNotify);
      s.on('work:chat:read', onRead);
      s.on('work:chat:changed', onChanged);
      s.on('work:chat:prefs', onPrefs);
    }).catch(() => undefined);
    return () => {
      alive = false;
      sock?.off('work:chat:notify', onNotify);
      sock?.off('work:chat:read', onRead);
      sock?.off('work:chat:changed', onChanged);
      sock?.off('work:chat:prefs', onPrefs);
      if (owner === mine.current) owner = null;
    };
  }, [meId, qc]);

  return null;
}
