'use client';

import { useEffect, useMemo, useState } from 'react';
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { AlertTriangle, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { noteShareApi } from '@/lib/api';
import type { NoteFull, NoteSubjectTree } from '@/types';
import NoteEditor, {
  type NoteRealtimeEditorState,
  type NoteSavePatch,
} from '@/components/notes/NoteEditor';

interface NoteRealtimeEditorProps {
  note: NoteFull;
  tree: NoteSubjectTree[];
  onSave: (patch: NoteSavePatch) => Promise<void>;
  onDuplicate?: () => Promise<void>;
  ownerControls?: boolean;
  contextLabel?: string;
}

type BootState = 'connecting' | 'ready' | 'error' | 'degraded';

/**
 * How long the CRDT room gets to come up before a PRIVATE page gives up and
 * edits over plain REST instead. Without this the whole Notes module is
 * hostage to the WebSocket gateway: one bad nginx reload or a Redis blip and
 * no note is editable at all, including the ones nobody else can even see.
 *
 * Shared pages deliberately never degrade — REST writes go through
 * `beginNoteCollaborationReset`, which wipes the compacted Yjs state, so a
 * second writer's in-flight session would be destroyed rather than merged.
 */
const REALTIME_BOOT_TIMEOUT_MS = 8000;

function collaborationUrl(path: string): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = configured
    ? new URL(configured, window.location.origin)
    : null;
  const isLocalApi = apiUrl
    ? ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)
    : false;

  // Production uses the public, same-origin nginx gateway. Besides avoiding
  // cross-origin CSP exceptions, this gives WebSocket traffic the same DNS,
  // TLS and Cloudflare path as the page. Local development still connects
  // directly to the backend port from NEXT_PUBLIC_API_URL.
  /**
   * ⚠️ `window.location.origin` KHÔNG dùng được trong app desktop.
   *
   * App chạy ở origin `app://cuongthai`. Dựng URL từ đó thì nhánh
   * `protocol === 'https:'` sai, nên nó ra `ws://cuongthai/notes-collaboration`
   * — một host không tồn tại. Kết quả: Notes trong app desktop LUÔN báo
   * "Không nối được máy chủ cộng tác · đang lưu theo cách thường", trong khi
   * chính websocket đó trên máy chủ trả 101 bình thường.
   *
   * Renderer của desktop đặt sẵn `__ctWebOrigin` (lấy từ main lúc khởi động).
   * Web thường không có biến đó và đi nguyên đường cũ.
   */
  const laWeb = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const gocNgoai = (globalThis as { __ctWebOrigin?: string }).__ctWebOrigin;
  const goc = isLocalApi && apiUrl
    ? apiUrl.origin
    : laWeb
      ? window.location.origin
      : (gocNgoai ?? 'https://cuongthai.com');

  const base = new URL(goc);
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  base.pathname = path;
  base.search = '';
  base.hash = '';
  return base.toString();
}

function participantColor(id: number): string {
  const palette = ['#0d9488', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#4f46e5'];
  return palette[Math.abs(id) % palette.length];
}

export default function NoteRealtimeEditor(props: NoteRealtimeEditorProps) {
  const [attempt, setAttempt] = useState(0);
  const [bootState, setBootState] = useState<BootState>('connecting');
  const [error, setError] = useState('');
  const [realtime, setRealtime] = useState<NoteRealtimeEditorState | null>(null);

  useEffect(() => {
    let cancelled = false;
    let provider: HocuspocusProvider | null = null;
    let document: Y.Doc | null = null;
    let bootTimer: ReturnType<typeof setTimeout> | null = null;
    setBootState('connecting');
    setError('');
    setRealtime(null);

    void (async () => {
      try {
        // Fetch once before opening the socket so authorization failures are
        // shown as a normal HTTP error instead of an opaque WebSocket close.
        let session = (await noteShareApi.getCollaborationToken(props.note.id)).data.data;
        if (cancelled) return;
        if (!session.canEdit) throw new Error('Bạn không còn quyền chỉnh sửa ghi chú này');

        document = new Y.Doc();
        const localUser = {
          id: session.user.id,
          name: session.user.name,
          avatarUrl: session.user.avatarUrl,
          color: participantColor(session.user.id),
        };

        // The session above was just minted, so the opening handshake reuses
        // it instead of burning a second request. Every later call is a
        // RECONNECT and must return the token we just fetched — returning the
        // previous one (as this did) hands back a token minted at connect
        // time, which is already past its five-minute TTL in exactly the case
        // that matters: a network drop part-way through a long edit. The
        // socket then fails to authenticate and the editor locks the user out
        // until they press "Thử lại".
        let primedToken: string | null = session.token;
        const refreshToken = async () => {
          if (primedToken) {
            const opening = primedToken;
            primedToken = null;
            return opening;
          }
          const next = (await noteShareApi.getCollaborationToken(props.note.id)).data.data;
          if (!next.canEdit) {
            const message = 'Quyền chỉnh sửa của bạn vừa được thay đổi';
            if (!cancelled) {
              setError(message);
              setBootState('error');
            }
            throw new Error(message);
          }
          session = next;
          return next.token;
        };

        provider = new HocuspocusProvider({
          url: collaborationUrl(session.websocketPath),
          name: session.documentName,
          document,
          token: refreshToken,
          connect: false,
          broadcast: true,
          quiet: true,
          onStatus: ({ status }) => {
            if (cancelled) return;
            setRealtime((current) => current ? { ...current, status } : current);
          },
          onSynced: ({ state }) => {
            if (cancelled || !state || !provider || !document) return;
            const next = buildRealtimeState(document, provider, localUser, provider.status);
            setRealtime(next);
            // A late sync must not yank a degraded session back into CRDT
            // mode: the user is already typing into the REST editor, and
            // swapping editors underneath them would drop what they typed.
            setBootState((current) => (current === 'connecting' ? 'ready' : current));
          },
          onAwarenessChange: ({ states }) => {
            if (cancelled) return;
            const users = states
              .map((state) => state.user)
              .filter((user): user is NoteRealtimeEditorState['users'][number] => (
                Boolean(user && Number.isInteger(user.id) && user.name && user.color)
              ));
            const unique = Array.from(new Map(users.map((user) => [user.id, user])).values());
            setRealtime((current) => current ? { ...current, users: unique } : current);
          },
          onAuthenticationFailed: ({ reason }) => {
            if (cancelled) return;
            setError(reason || 'Không thể xác thực phiên cộng tác');
            setBootState('error');
          },
        });
        // Only a private page may degrade — see REALTIME_BOOT_TIMEOUT_MS.
        if (!session.isShared) {
          bootTimer = setTimeout(() => {
            if (cancelled) return;
            setBootState((current) => (current === 'connecting' ? 'degraded' : current));
          }, REALTIME_BOOT_TIMEOUT_MS);
        }

        provider.setAwarenessField('user', localUser);
        await provider.connect();
      } catch (caught) {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : 'Không thể mở phiên cộng tác');
        setBootState('error');
      }
    })();

    return () => {
      cancelled = true;
      if (bootTimer) clearTimeout(bootTimer);
      provider?.destroy();
      document?.destroy();
    };
  }, [attempt, props.note.id]);

  const editor = useMemo(() => {
    if (bootState === 'ready' && realtime) {
      return <NoteEditor {...props} collaboration={realtime} />;
    }
    if (bootState === 'degraded') {
      // Plain REST autosave, exactly as Notes worked before Phase 4.
      return (
        <>
          <div className="mx-auto mt-4 max-w-[760px] px-4 sm:px-6">
            <span
              role="status"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-200"
            >
              <WifiOff className="h-3 w-3" aria-hidden="true" />
              Không nối được máy chủ cộng tác · đang lưu theo cách thường
            </span>
          </div>
          <NoteEditor {...props} />
        </>
      );
    }
    return null;
  }, [bootState, props, realtime]);

  if (editor) return editor;

  if (bootState === 'error') {
    return (
      <div className="mx-auto flex min-h-[360px] w-full max-w-[760px] items-center justify-center px-4 py-10">
        <div role="alert" className="w-full max-w-md rounded-2xl border border-amber-300/70 bg-amber-50 p-6 text-center shadow-sm dark:border-amber-400/20 dark:bg-amber-500/[0.08]">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">Chưa kết nối được chế độ cùng chỉnh sửa</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Thử lại
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Editor được khóa tạm thời để tránh một bản cục bộ cũ ghi đè lên tài liệu chung.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[360px] w-full max-w-[760px] items-center justify-center px-4" role="status" aria-live="polite">
      <div className="flex flex-col items-center text-center">
        <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
          <Wifi className="h-6 w-6" aria-hidden="true" />
          <Loader2 className="absolute -right-1 -top-1 h-4 w-4 animate-spin rounded-full bg-white text-teal-600 motion-reduce:animate-none dark:bg-slate-950" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">Đang đồng bộ bản mới nhất…</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Editor chỉ mở sau khi CRDT sẵn sàng để tránh nhân đôi nội dung.</p>
      </div>
    </div>
  );
}

function buildRealtimeState(
  document: Y.Doc,
  provider: HocuspocusProvider,
  localUser: NoteRealtimeEditorState['localUser'],
  status: WebSocketStatus,
): NoteRealtimeEditorState {
  const users = Array.from(provider.awareness?.getStates().values() ?? [])
    .map((state) => state.user)
    .filter((user): user is NoteRealtimeEditorState['users'][number] => Boolean(user?.id && user?.name && user?.color));
  if (!users.some((user) => user.id === localUser.id)) users.push(localUser);
  return { document, provider, localUser, users, status };
}
