'use client';

/**
 * CTW K-3b — một phiên ĐỒNG SOẠN THẢO cho trang Docs (Hocuspocus + Yjs), chép khuôn NoteRealtimeEditor của Notes.
 *
 *   - Hỏi REST trước (`GET …/collab`): không được vào / collab tắt / gateway chưa chạy ⇒ `state: 'off'` ⇒ DocView dùng
 *     trình soạn REST như cũ (tự lưu + khoá lạc quan 409).
 *   - Được vào ⇒ dựng Y.Doc, nạp bản OFFLINE còn lưu (localStorage, theo trang + dòng dõi Yjs + người) rồi mới nối
 *     WebSocket. Mất mạng giữa chừng: gõ tiếp vào Y.Doc cục bộ, bản đó được lưu xuống máy; có mạng lại thì provider
 *     tự nối + tự đồng bộ (CRDT ⇒ không đè ai). Đóng tab lúc đang offline ⇒ lần mở sau vẫn gộp lại phần đã gõ.
 *   - Kết nối không lên trong BOOT_TIMEOUT_MS và chưa có bản offline ⇒ `degraded`: DocView lùi về REST (máy chủ gộp
 *     bản REST vào Yjs theo khối nên không đè người đang sửa).
 *   - Mã phiên 5 phút: lần nối lại nào cũng xin mã MỚI (không trả lại mã cũ đã hết hạn — bài học của Notes).
 */

import { useEffect, useState } from 'react';
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { workCollabApi, type CollabSession } from '@/lib/work-collab-api';

const BOOT_TIMEOUT_MS = 8000;
const SAVE_LOCAL_MS = 800;
/** Bản offline lớn hơn mức này thì không ghi vào localStorage (trần ~5 MB của trình duyệt). */
const MAX_LOCAL_BYTES = 1_500_000;

export interface CollabPeer { id: number; name: string; color: string; avatarUrl: string | null; clientId: number; typing: boolean }

export type CollabState =
  | { state: 'loading' }
  | { state: 'off'; session: CollabSession | null; error?: string }
  | { state: 'degraded'; session: CollabSession; error?: string }
  | {
    state: 'live';
    session: Extract<CollabSession, { enabled: true }>;
    doc: Y.Doc;
    provider: HocuspocusProvider;
    status: WebSocketStatus;
    synced: boolean;
    /** đang không nối được máy chủ — chữ vẫn lưu ở máy, nối lại thì tự đồng bộ */
    offline: boolean;
    /** có thay đổi cục bộ chưa được máy chủ xác nhận */
    unsynced: boolean;
    peers: CollabPeer[];
    error?: string;
  };

/** URL WebSocket cùng gốc (nginx) — local dev nối thẳng cổng backend; app desktop dùng `__ctWebOrigin` (xem Notes). */
export function collabUrl(path: string): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = configured ? new URL(configured, window.location.origin) : null;
  const isLocalApi = apiUrl ? ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname) : false;
  const laWeb = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const gocNgoai = (globalThis as { __ctWebOrigin?: string }).__ctWebOrigin;
  const goc = isLocalApi && apiUrl ? apiUrl.origin : laWeb ? window.location.origin : (gocNgoai ?? 'https://cuongthai.com');
  const base = new URL(goc);
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  base.pathname = path;
  base.search = '';
  base.hash = '';
  return base.toString();
}

const cacheKey = (s: Extract<CollabSession, { enabled: true }>) => `ctw-collab:${s.pageId}:${s.lineage}:${s.user.id}`;
function readCache(key: string): Uint8Array | null {
  try {
    const v = window.localStorage.getItem(key);
    if (!v) return null;
    const bin = atob(v);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}
function writeCache(key: string, update: Uint8Array) {
  try {
    if (update.byteLength > MAX_LOCAL_BYTES) { window.localStorage.removeItem(key); return; }
    let s = '';
    for (let i = 0; i < update.length; i += 0x8000) s += String.fromCharCode(...update.subarray(i, i + 0x8000));
    window.localStorage.setItem(key, btoa(s));
  } catch { /* hết chỗ / chế độ riêng tư — bỏ qua, phiên vẫn chạy */ }
}

export function useDocCollab(pid: number, num: number, enabled: boolean, attempt = 0): CollabState {
  const [st, setSt] = useState<CollabState>({ state: 'loading' });

  useEffect(() => {
    if (!enabled) { setSt({ state: 'off', session: null }); return; }
    let cancelled = false;
    let provider: HocuspocusProvider | null = null;
    let doc: Y.Doc | null = null;
    let bootTimer: ReturnType<typeof setTimeout> | null = null;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let onUpdate: ((u: Uint8Array, origin: unknown) => void) | null = null;
    let detachNet: (() => void) | null = null;
    const typingAt = new Map<number, number>();
    setSt({ state: 'loading' });

    void (async () => {
      let session: CollabSession;
      try {
        session = await workCollabApi.session(pid, num);
      } catch (err) {
        if (!cancelled) setSt({ state: 'off', session: null, error: (err as Error)?.message });
        return;
      }
      if (cancelled) return;
      if (!session.enabled) { setSt({ state: 'off', session }); return; }
      const live = session;
      const key = cacheKey(live);
      doc = new Y.Doc();
      const cached = live.canEdit ? readCache(key) : null;
      if (cached) {
        try { Y.applyUpdate(doc, cached, 'local-cache'); } catch { /* bản hỏng ⇒ bỏ */ }
      }
      let unsynced = !!cached;
      onUpdate = (_u, origin) => {
        // Ghi bản offline (trạng thái đầy đủ, gộp được) — chỉ người sửa được, có trễ cho đỡ tốn.
        if (live.canEdit) {
          if (saveTimer) clearTimeout(saveTimer);
          saveTimer = setTimeout(() => doc && writeCache(key, Y.encodeStateAsUpdate(doc)), SAVE_LOCAL_MS);
        }
      };
      doc.on('update', onUpdate);

      let primed: string | null = live.token;
      const token = async () => {
        if (primed) { const t = primed; primed = null; return t; }
        const next = await workCollabApi.session(pid, num);
        if (!next.enabled) throw new Error(next.reason || 'Live editing is off');
        return next.token;
      };

      const publish = (patch: Partial<Extract<CollabState, { state: 'live' }>> = {}) => {
        if (cancelled || !provider || !doc) return;
        setSt((cur) => {
          const base = cur.state === 'live' ? cur : {
            state: 'live' as const, session: live, doc: doc!, provider: provider!, status: provider!.status,
            synced: false, offline: false, unsynced, peers: [] as CollabPeer[],
          };
          return { ...base, unsynced, ...patch };
        });
      };

      provider = new HocuspocusProvider({
        url: collabUrl(live.websocketPath),
        name: live.documentName,
        document: doc,
        token,
        connect: false,
        broadcast: true,
        quiet: true,
        onStatus: ({ status }) => publish({ status, offline: status === WebSocketStatus.Disconnected }),
        onSynced: ({ state }) => {
          if (!state) return;
          if (bootTimer) { clearTimeout(bootTimer); bootTimer = null; }
          unsynced = !!provider?.hasUnsyncedChanges;
          publish({ synced: true, offline: false });
        },
        onAwarenessChange: ({ states }) => {
          const now = Date.now();
          const peers: CollabPeer[] = [];
          const seen = new Set<number>();
          for (const s of states as Array<{ clientId: number; user?: { id: number; name: string; color: string; avatarUrl: string | null }; typingAt?: number }>) {
            const u = s.user;
            if (!u || !Number.isInteger(u.id) || seen.has(u.id)) continue;
            seen.add(u.id);
            if (s.typingAt) typingAt.set(u.id, s.typingAt);
            peers.push({ ...u, clientId: s.clientId, typing: now - (typingAt.get(u.id) ?? 0) < 4000 });
          }
          publish({ peers });
        },
        onAuthenticationFailed: ({ reason }) => {
          if (cancelled) return;
          setSt({ state: 'off', session: live, error: reason || 'Could not open the live session' });
        },
      });
      provider.on('unsyncedChanges', (n: number) => { unsynced = n > 0; publish({}); });
      provider.setAwarenessField('user', { id: live.user.id, name: live.user.name, color: live.user.color, avatarUrl: live.user.avatarUrl });
      publish({ status: WebSocketStatus.Connecting });
      // Trình duyệt báo mất mạng ⇒ đóng socket NGAY (provider tự nhận ra sau ~30 giây không có tin — người dùng sẽ tưởng
      // chữ đang được gửi). Có mạng lại ⇒ nối lại, Yjs đồng bộ phần gõ lúc offline.
      const wsp = provider.configuration.websocketProvider;
      const goOffline = () => { publish({ offline: true }); wsp.disconnect(); };
      const goOnline = () => { void wsp.connect(); };
      window.addEventListener('offline', goOffline);
      window.addEventListener('online', goOnline);
      detachNet = () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
      if (typeof navigator !== 'undefined' && navigator.onLine === false) goOffline();
      bootTimer = setTimeout(() => {
        if (cancelled) return;
        // Chưa từng đồng bộ và không có bản offline ⇒ lùi về REST (đừng bắt người dùng nhìn khung trống).
        setSt((cur) => (cur.state === 'live' && !cur.synced && !cached ? { state: 'degraded', session: live } : cur));
      }, BOOT_TIMEOUT_MS);
      await provider.connect();
    })();

    return () => {
      cancelled = true;
      if (bootTimer) clearTimeout(bootTimer);
      if (saveTimer) clearTimeout(saveTimer);
      if (doc && onUpdate) doc.off('update', onUpdate);
      detachNet?.();
      provider?.destroy();
      doc?.destroy();
    };
  }, [pid, num, enabled, attempt]);

  return st;
}

/** Báo "đang gõ" qua awareness (dải hiện diện bên kia thấy chấm gõ) — gọi khi editor đổi. */
let lastTyping = 0;
export function markTyping(provider: HocuspocusProvider | null | undefined) {
  const now = Date.now();
  // Một nhịp mỗi 1,5 giây là đủ cho chấm "đang gõ" (awareness phát cho cả phòng — đừng phát mỗi phím).
  if (!provider || now - lastTyping < 1500) return;
  lastTyping = now;
  provider.setAwarenessField('typingAt', now);
}
