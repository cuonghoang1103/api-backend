'use client';

/**
 * K16 (CTW đợt 5b K-1) — HIỆN DIỆN trên thẻ: ai đang xem / đang gõ bình luận / đang sửa.
 *
 * Socket `work:presence` trên phòng sẵn có `work:project:<id>` (server chỉ phát lại cho nhân viên đã vào phòng —
 * khách cổng và agent không gửi/nhận). Mỗi tab gửi trạng thái khi đổi + nhịp 20 giây; bên nhận tự xoá sau 45 giây
 * nên đóng nắp máy (mất "left") cũng không treo mãi. Không ghi DB.
 *
 * Cờ "typing"/"editing" do chỗ soạn bật/tắt qua `usePresenceFlag` — một kho nhỏ theo thẻ, hook gửi trạng thái
 * mạnh nhất (editing > typing > viewing).
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { userName, type WorkUser } from '@/lib/work-api';
import { UserAvatar } from '../ui';

type State = 'viewing' | 'typing' | 'editing';
type Peer = { user: Pick<WorkUser, 'id' | 'username' | 'fullName' | 'displayName' | 'avatarUrl'>; state: State; at: number };

const HEARTBEAT_MS = 20_000;
const EXPIRE_MS = 45_000;

// ─── Kho cờ cục bộ (typing/editing) theo thẻ ─────────────────────

const flags = new Map<string, Map<string, 'typing' | 'editing'>>();
const subs = new Set<() => void>();
const keyOf = (pid: number, num: number) => `${pid}:${num}`;
function localState(pid: number, num: number): State {
  const f = flags.get(keyOf(pid, num));
  if (!f?.size) return 'viewing';
  return [...f.values()].includes('editing') ? 'editing' : 'typing';
}
function setFlag(pid: number, num: number, id: string, v: 'typing' | 'editing' | null) {
  const k = keyOf(pid, num);
  const f = flags.get(k) ?? new Map();
  if (v) f.set(id, v); else f.delete(id);
  flags.set(k, f);
  subs.forEach((fn) => fn());
}

/** Bật cờ hiện diện khi `on` (vd đang gõ bình luận, đang sửa mô tả). Tự tắt khi rời màn hình. */
export function usePresenceFlag(pid: number | undefined, num: number | undefined, kind: 'typing' | 'editing', on: boolean) {
  const id = useRef(`f${Math.random().toString(36).slice(2)}`).current;
  useEffect(() => {
    if (!pid || !num) return;
    setFlag(pid, num, id, on ? kind : null);
    return () => setFlag(pid, num, id, null);
  }, [pid, num, kind, on, id]);
}

function useLocalState(pid: number, num: number): State {
  return useSyncExternalStore(
    (fn) => { subs.add(fn); return () => { subs.delete(fn); }; },
    () => localState(pid, num),
    () => 'viewing',
  );
}

// ─── Gửi + nhận ──────────────────────────────────────────────────

/** Người khác đang ở thẻ này (không gồm mình). Gửi trạng thái của mình. */
export function useIssuePresence(pid: number, num: number, enabled = true): Peer[] {
  const meId = useAuthStore((s) => s.user?.id);
  const mine = useLocalState(pid, num);
  const [peers, setPeers] = useState<Map<number, Peer>>(new Map());
  const sockRef = useRef<Awaited<ReturnType<typeof connectSocket>> | null>(null);
  const mineRef = useRef(mine);
  mineRef.current = mine;

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const send = (state: State | 'left') => sockRef.current?.emit('work:presence', { projectId: pid, number: num, state });
    const known = new Set<number>();
    const onPresence = (e: { projectId: number; number: number; state: State | 'left'; user: Peer['user']; at: number }) => {
      if (e.projectId !== pid || e.number !== num || !e.user || e.user.id === meId) return;
      const uid = e.user.id;
      if (e.state === 'left') known.delete(uid);
      else if (!known.has(uid)) {
        // Người mới vào ⇒ chào lại để họ thấy mình ngay (không chờ nhịp 20 giây).
        known.add(uid);
        send(mineRef.current);
      }
      setPeers((cur) => {
        const next = new Map(cur);
        if (e.state === 'left') next.delete(uid);
        else next.set(uid, { user: e.user, state: e.state, at: Date.now() });
        return next;
      });
    };
    const onReconnect = () => send(mineRef.current);
    connectSocket()
      .then((s) => {
        if (!alive) return;
        sockRef.current = s;
        s.on('work:presence', onPresence);
        s.on('connect', onReconnect);
        // `work:join` do useProjectRealtime gửi; đợi một nhịp để phòng sẵn sàng.
        setTimeout(() => alive && send(mineRef.current), 300);
      })
      .catch(() => {});
    const beat = setInterval(() => send(mineRef.current), HEARTBEAT_MS);
    const sweep = setInterval(() => {
      setPeers((cur) => {
        const now = Date.now();
        let changed = false;
        const next = new Map(cur);
        for (const [id, p] of cur) if (now - p.at > EXPIRE_MS) { next.delete(id); known.delete(id); changed = true; }
        return changed ? next : cur;
      });
    }, 5_000);
    return () => {
      alive = false;
      clearInterval(beat);
      clearInterval(sweep);
      send('left');
      sockRef.current?.off('work:presence', onPresence);
      sockRef.current?.off('connect', onReconnect);
      setPeers(new Map());
    };
  }, [pid, num, meId, enabled]);

  // Đổi trạng thái của mình (gõ / sửa / thôi) ⇒ báo ngay.
  useEffect(() => {
    if (enabled) sockRef.current?.emit('work:presence', { projectId: pid, number: num, state: mine });
  }, [mine, pid, num, enabled]);

  return [...peers.values()].sort((a, b) => a.user.id - b.user.id);
}

/** Hook + dải hiện diện trong một — đặt MỘT lần mỗi thẻ đang mở (ngay dưới tiêu đề). */
export function IssuePresenceStrip({ pid, num, enabled = true }: { pid: number; num: number; enabled?: boolean }) {
  const peers = useIssuePresence(pid, num, enabled);
  return <PresenceBar peers={peers} />;
}

const VERB: Record<State, string> = { viewing: 'viewing', typing: 'typing a comment', editing: 'editing' };

/** Dải nhỏ "An is typing a comment · Bình is viewing". Rỗng ⇒ không chiếm chỗ. */
export function PresenceBar({ peers }: { peers: Peer[] }) {
  if (!peers.length) return null;
  const active = peers.filter((p) => p.state !== 'viewing');
  const text = (active.length ? active : peers).slice(0, 3).map((p) => `${userName(p.user)} is ${VERB[p.state]}`).join(' · ');
  const more = (active.length ? active : peers).length - 3;
  return (
    <div className="flex min-w-0 items-center gap-2 text-[12px] text-[var(--w-text-2)]" role="status" aria-live="polite" data-testid="issue-presence">
      <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
        {peers.slice(0, 4).map((p) => <UserAvatar key={p.user.id} user={p.user} size={18} className="ring-2 ring-[var(--w-panel)]" />)}
      </span>
      <span className="min-w-0 truncate">{text}{more > 0 ? ` · +${more}` : ''}</span>
      {active.some((p) => p.state === 'typing') && <span className="w-typing-dots shrink-0" aria-hidden="true"><i /><i /><i /></span>}
    </div>
  );
}
