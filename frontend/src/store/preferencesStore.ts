/**
 * User preferences for notification sounds.
 *
 * State shape:
 *   masterEnabled  — global kill-switch (one toggle for all 4 sounds)
 *   volume         — 0..1 master volume
 *   enabled        — { message, notification, login, post } individual toggles
 *
 * Custom MP3s are NOT stored here — they're Blobs in IndexedDB (see
 * lib/soundStorage.ts). This store just remembers which kinds have a
 * custom file uploaded, plus the file name for display in the UI.
 *
 * Persistence:
 *   localStorage key `cuong-sound-prefs-v1`. Zustand persist middleware
 *   with a custom SSR-safe storage (the default `createJSONStorage`
 *   wraps localStorage, which is fine because we read it on the
 *   client only — see `partialize` for the fields that round-trip).
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SoundKind } from '@/lib/soundStorage';
import { configureSoundSources, invalidateCustomSoundCache, stopAll, applyVolume } from '@/lib/sound';
import type { PrefNotifyType, ServerPreferences, ServerPreferencesPatch } from '@/lib/api';

export type { SoundKind };
export type NotifyType = PrefNotifyType;

const ALL_KINDS: SoundKind[] = ['message', 'notification', 'login', 'post', 'like', 'admin-notification'];

/** Bell categories the user can mute individually. Muting one hides new
 *  notifications of that type from the bell AND suppresses its sound;
 *  rows already stored on the server are untouched. */
export const ALL_NOTIFY_TYPES: NotifyType[] = [
  'NEW_REACTION', 'NEW_COMMENT', 'NEW_REPLY', 'NEW_MENTION', 'NEW_MESSAGE',
  'FRIEND_REQUEST', 'FRIEND_ACCEPT', 'NEW_FOLLOW',
  'NOTE_SHARE', 'HUB_SHARE', 'NEW_POST', 'ADMIN_ANNOUNCEMENT',
];

export interface NotifyTypeMeta {
  label: string;
  description: string;
  icon: string;
}

export const NOTIFY_TYPE_META: Record<NotifyType, NotifyTypeMeta> = {
  NEW_REACTION: { label: 'Cảm xúc bài viết', description: 'Ai đó thả tim / cảm xúc vào bài của bạn', icon: 'Heart' },
  NEW_COMMENT: { label: 'Bình luận mới', description: 'Ai đó bình luận về bài viết của bạn', icon: 'MessageCircle' },
  NEW_REPLY: { label: 'Trả lời bình luận', description: 'Ai đó trả lời bình luận của bạn', icon: 'CornerDownRight' },
  NEW_MENTION: { label: 'Được nhắc tên', description: 'Ai đó nhắc @bạn trong một bình luận', icon: 'AtSign' },
  NEW_MESSAGE: { label: 'Tin nhắn mới', description: 'Có tin nhắn mới trong hộp thư', icon: 'MessageSquare' },
  FRIEND_REQUEST: { label: 'Lời mời kết bạn', description: 'Ai đó gửi lời mời kết bạn', icon: 'UserPlus' },
  FRIEND_ACCEPT: { label: 'Chấp nhận kết bạn', description: 'Lời mời kết bạn của bạn được chấp nhận', icon: 'UserCheck' },
  NEW_FOLLOW: { label: 'Người theo dõi mới', description: 'Ai đó bắt đầu theo dõi bạn', icon: 'UserPlus' },
  NOTE_SHARE: { label: 'Chia sẻ ghi chú', description: 'Ai đó chia sẻ một môn ghi chú với bạn', icon: 'FolderOpen' },
  HUB_SHARE: { label: 'Chia sẻ tài liệu', description: 'Ai đó chia sẻ thư mục tài liệu với bạn', icon: 'Share2' },
  NEW_POST: { label: 'Bài viết mới', description: 'Người bạn theo dõi đăng bài mới', icon: 'Send' },
  ADMIN_ANNOUNCEMENT: { label: 'Thông báo từ Admin', description: 'Admin đăng thông báo mới ở diễn đàn', icon: 'Crown' },
};

export interface SoundKindMeta {
  /** human-readable label, used in the settings UI */
  label: string;
  /** single-line description shown under the label */
  description: string;
  /** lucide icon name (string, since this store shouldn't pull
   *  client-only deps). The settings component maps it to an icon. */
  icon: string;
}

export const SOUND_KINDS: Record<SoundKind, SoundKindMeta> = {
  message: {
    label: 'Tin nhắn mới chưa đọc',
    description: 'Phát khi có tin nhắn chưa đọc trong chat',
    icon: 'MessageCircle',
  },
  notification: {
    label: 'Có thông báo mới (user thường)',
    description: 'Phát khi có thông báo mới dành cho mọi user',
    icon: 'Bell',
  },
  'admin-notification': {
    label: 'Thông báo từ admin (riêng Cuong03dx)',
    description: 'Phát khi admin đăng bài post / upload tài liệu / khoá học mới',
    icon: 'Crown',
  },
  login: {
    label: 'Đăng nhập thành công',
    description: 'Phát sau khi đăng nhập tài khoản thành công',
    icon: 'LogIn',
  },
  post: {
    label: 'Đăng bài post thành công',
    description: 'Phát sau khi bạn đăng một bài post mới lên feed',
    icon: 'Send',
  },
  like: {
    label: 'Tym bài viết',
    description: 'Phát khi bạn (hoặc ai đó) tym một bài viết trong feed',
    icon: 'Heart',
  },
};

/** Where the local copy stands relative to the server. Rendered as a
 *  small status pill in /settings/notifications so the user can tell
 *  "saved to my account" from "saved in this browser only". */
export type SyncStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error' | 'offline';

interface PreferencesState {
  masterEnabled: boolean;
  volume: number;
  enabled: Record<SoundKind, boolean>;
  /** Map of kind → uploaded file name. The blob itself is in
   *  IndexedDB; this is just for display in the UI ("Currently
   *  using: my-chime.mp3"). An empty string means "use default". */
  customFileName: Record<SoundKind, string>;

  // ─── Cross-device additions (2026-08-08) ─────────────────────
  /** Per-category bell switches. Muting a type hides new items of
   *  that type and suppresses its sound. */
  notifyTypes: Record<NotifyType, boolean>;
  /** User asked for OS-level notifications. The browser permission
   *  itself is per-device and is NOT part of the synced blob. */
  browserPush: boolean;
  /** Honour prefers-reduced-motion manually (some users want it on
   *  this site only, without changing an OS setting). */
  reduceMotion: boolean;

  /** Server sync bookkeeping. Not persisted — recomputed each load. */
  syncStatus: SyncStatus;
  /** ISO stamp of the server copy we last reconciled against. */
  serverUpdatedAt: string | null;
  /** ISO stamp of the last LOCAL edit. Persisted, and compared against
   *  the server's stamp on login to decide which side is newer. */
  localUpdatedAt: string | null;

  // actions
  setMasterEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  setKindEnabled: (kind: SoundKind, v: boolean) => void;
  setCustomFileName: (kind: SoundKind, name: string) => void;
  setNotifyType: (type: NotifyType, v: boolean) => void;
  setBrowserPush: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  reset: () => void;

  /** Pull the account copy and reconcile (newest wins). Called once
   *  after login. Safe to call repeatedly. */
  pullFromServer: () => Promise<void>;
  /** Push the current local state up. Debounced — the volume slider
   *  fires this on every pixel of drag. */
  schedulePush: () => void;
}

const defaultEnabled = (): Record<SoundKind, boolean> => ({
  message: true,
  notification: true,
  'admin-notification': true,
  login: true,
  post: true,
  like: true,
});

const defaultCustomFileName = (): Record<SoundKind, string> => ({
  message: '',
  notification: '',
  'admin-notification': '',
  login: '',
  post: '',
  like: '',
});

const defaultNotifyTypes = (): Record<NotifyType, boolean> =>
  Object.fromEntries(ALL_NOTIFY_TYPES.map((t) => [t, true])) as Record<NotifyType, boolean>;

/* ─── Server sync plumbing ──────────────────────────────────────────
 *
 * Rules:
 *   - localStorage stays the source of truth for RENDERING. It's
 *     synchronous, so the settings page paints the user's real values on
 *     the first frame instead of flashing defaults while a fetch lands.
 *   - The server copy is the source of truth for RECONCILIATION on login.
 *     Whichever side has the newer `updatedAt` wins as a whole — a field
 *     level merge would let a stale tab resurrect settings the user
 *     deliberately changed elsewhere.
 *   - Every push is debounced. Dragging the volume slider fires ~100
 *     state updates; without this that's 100 PATCHes.
 */

const PUSH_DEBOUNCE_MS = 900;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pushInFlight = false;
/** Set while pullFromServer() is applying remote values, so the setters
 *  it triggers don't immediately schedule a push back to the server
 *  (which would be a pointless round-trip, and on a slow link a race). */
let applyingRemote = false;

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => {
      /** Stamp the local edit time and queue a debounced push. Every
       *  user-driven setter routes through here so no setter can forget
       *  to sync (the class of bug where one toggle silently stays
       *  browser-local while the rest follow the account). */
      const touch = () => {
        if (applyingRemote) return;
        set({ localUpdatedAt: new Date().toISOString() });
        get().schedulePush();
      };

      return {
        masterEnabled: true,
        volume: 0.5,
        enabled: defaultEnabled(),
        customFileName: defaultCustomFileName(),
        notifyTypes: defaultNotifyTypes(),
        browserPush: false,
        reduceMotion: false,
        syncStatus: 'idle' as SyncStatus,
        serverUpdatedAt: null,
        localUpdatedAt: null,

        setMasterEnabled: (v) => {
          set({ masterEnabled: v });
          // The kill-switch should silence whatever's currently
          // playing too — the user expects "off" to be silent, not
          // "wait for the next event". pause() on each cached
          // element; the audio instance stays in cache so flipping
          // the switch back on resumes the same source.
          if (!v) stopAll();
          touch();
        },
        setVolume: (v) => {
          const clamped = Math.max(0, Math.min(1, v));
          set({ volume: clamped });
          // Live-update the volume of any sound already mid-play.
          // playSound reads the getter on every call so future
          // plays pick up the new value automatically; this call
          // covers the case where the slider is moved while a
          // previous sound is still audible.
          applyVolume(clamped);
          touch();
        },
        setKindEnabled: (kind, v) => {
          set((s) => ({ enabled: { ...s.enabled, [kind]: v } }));
          touch();
        },
        setCustomFileName: (kind, name) => {
          set((s) => ({ customFileName: { ...s.customFileName, [kind]: name } }));
          touch();
        },
        setNotifyType: (type, v) => {
          set((s) => ({ notifyTypes: { ...s.notifyTypes, [type]: v } }));
          touch();
        },
        setBrowserPush: (v) => {
          set({ browserPush: v });
          touch();
        },
        setReduceMotion: (v) => {
          set({ reduceMotion: v });
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('reduce-motion', v);
          }
          touch();
        },
        reset: () => {
          set({
            masterEnabled: true,
            volume: 0.5,
            enabled: defaultEnabled(),
            customFileName: defaultCustomFileName(),
            notifyTypes: defaultNotifyTypes(),
            browserPush: false,
            reduceMotion: false,
          });
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('reduce-motion');
          }
          touch();
        },

        /* ─── Server sync ──────────────────────────────────────── */

        pullFromServer: async () => {
          if (typeof window === 'undefined') return;
          set({ syncStatus: 'loading' });
          try {
            const { preferencesApi } = await import('@/lib/api');
            const res = await preferencesApi.get();
            const remote = res.data?.data?.preferences as ServerPreferences | undefined;
            if (!remote) {
              set({ syncStatus: 'idle' });
              return;
            }

            const local = get().localUpdatedAt;
            const remoteAt = remote.updatedAt;

            // Newest wins, whole-blob. If the server has never been
            // written (remoteAt null) but this browser has local
            // settings, push ours up instead of overwriting them with
            // server defaults — that's the "first login on an account
            // that predates this feature" case.
            const remoteIsNewer =
              !!remoteAt && (!local || new Date(remoteAt).getTime() > new Date(local).getTime());

            if (!remoteIsNewer) {
              set({ syncStatus: 'idle', serverUpdatedAt: remoteAt });
              if (local) get().schedulePush();
              return;
            }

            applyingRemote = true;
            set({
              masterEnabled: remote.sound.masterEnabled,
              volume: remote.sound.volume,
              enabled: { ...defaultEnabled(), ...remote.sound.enabled },
              // Custom file NAMES come from the server, but the blobs live
              // in this browser's IndexedDB. KindRow re-checks IndexedDB on
              // mount and clears any name whose blob isn't here, so a name
              // synced from another device degrades to "default" rather
              // than claiming a file we can't play.
              customFileName: { ...defaultCustomFileName(), ...remote.sound.customFileName },
              notifyTypes: { ...defaultNotifyTypes(), ...remote.notify.types },
              browserPush: remote.notify.browserPush,
              reduceMotion: remote.ui.reduceMotion,
              serverUpdatedAt: remoteAt,
              localUpdatedAt: remoteAt,
              syncStatus: 'idle',
            });
            applyingRemote = false;

            applyVolume(remote.sound.volume);
            if (!remote.sound.masterEnabled) stopAll();
            if (typeof document !== 'undefined') {
              document.documentElement.classList.toggle('reduce-motion', remote.ui.reduceMotion);
            }
          } catch {
            applyingRemote = false;
            // 401 (guest), offline, or the endpoint is unreachable. The
            // local copy keeps working exactly as it did before this
            // feature existed — settings simply stay browser-local.
            set({ syncStatus: 'offline' });
          }
        },

        schedulePush: () => {
          if (typeof window === 'undefined') return;
          if (pushTimer) clearTimeout(pushTimer);
          set({ syncStatus: 'saving' });
          pushTimer = setTimeout(async () => {
            pushTimer = null;
            if (pushInFlight) {
              // A push is already in the air; re-arm so the newest state
              // still lands rather than being dropped.
              get().schedulePush();
              return;
            }
            pushInFlight = true;
            try {
              const s = get();
              const { preferencesApi } = await import('@/lib/api');
              const patch: ServerPreferencesPatch = {
                sound: {
                  masterEnabled: s.masterEnabled,
                  volume: s.volume,
                  enabled: s.enabled,
                  customFileName: s.customFileName,
                },
                notify: { types: s.notifyTypes, browserPush: s.browserPush },
                ui: { reduceMotion: s.reduceMotion },
              };
              const res = await preferencesApi.update({ preferences: patch });
              const updatedAt = res.data?.data?.preferences?.updatedAt ?? null;
              set({ syncStatus: 'saved', serverUpdatedAt: updatedAt, localUpdatedAt: updatedAt });
            } catch {
              // Guests hit 401 here on every toggle. That's not an error
              // worth shouting about — their settings still persist in
              // localStorage, so we mark it 'offline', not 'error'.
              set({ syncStatus: 'offline' });
            } finally {
              pushInFlight = false;
            }
          }, PUSH_DEBOUNCE_MS);
        },
      };
    },
    {
      name: 'cuong-sound-prefs-v1',
      // Wrap localStorage lazily so this module is safe to import
      // during SSR (window is undefined). zustand's persist
      // middleware only calls `getItem` / `setItem` from the
      // browser, but the `createJSONStorage(() => ...)` factory
      // itself runs at module-init time, so we still need to
      // guard against the SSR case.
      storage: createJSONStorage(() => (typeof window !== 'undefined'
        ? window.localStorage
        : ({
            length: 0,
            clear: () => { /* noop for SSR */ },
            getItem: () => null,
            key: () => null,
            removeItem: () => { /* noop for SSR */ },
            setItem: () => { /* noop for SSR */ },
          } as Storage))),
      // Only persist the actual user choices. Methods and meta live
      // on every fresh load from the imports above.
      //
      // NOTE: the first four keys are the shape lib/sound.ts reads
      // straight out of localStorage (readSoundPrefs) when the service
      // getters haven't been wired yet. Do not rename or nest them.
      // `syncStatus` is deliberately NOT persisted — it describes this
      // session's connection to the server, not a user choice.
      partialize: (s) => ({
        masterEnabled: s.masterEnabled,
        volume: s.volume,
        enabled: s.enabled,
        customFileName: s.customFileName,
        notifyTypes: s.notifyTypes,
        browserPush: s.browserPush,
        reduceMotion: s.reduceMotion,
        localUpdatedAt: s.localUpdatedAt,
        serverUpdatedAt: s.serverUpdatedAt,
      }),
      // zustand persist v4 fires this after rehydrate. We use it to
      // rewire the sound service getters (the store changed, so the
      // service's closures would otherwise point to the stale
      // initial state) and to drop the custom-audio cache so a
      // replaced file gets reloaded on next play.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        wireServiceGetters();
        invalidateCustomSoundCache();
        // A browser that stored prefs before notifyTypes existed
        // rehydrates with the key missing — backfill so every consumer
        // can read `notifyTypes[x]` without a null check.
        if (!state.notifyTypes) {
          usePreferencesStore.setState({ notifyTypes: defaultNotifyTypes() });
        }
        if (typeof document !== 'undefined' && state.reduceMotion) {
          document.documentElement.classList.add('reduce-motion');
        }
      },
    },
  ),
);

// Lazy-initialize the storage so SSR doesn't try to touch
// `window.localStorage`. We always create the wrapper on the client;
// on the server zustand's persist middleware simply skips writes.
const isBrowser = typeof window !== 'undefined';
const storageAdapter: Storage = isBrowser
  ? (window.localStorage as Storage)
  : ({
      length: 0,
      clear: () => { /* noop for SSR */ },
      getItem: () => null,
      key: () => null,
      removeItem: () => { /* noop for SSR */ },
      setItem: () => { /* noop for SSR */ },
    } as Storage);



// Wire up the sound service to read live values from this store on
// every play(). Called on first import (so plays that happen before
// persist rehydration still respect the defaults) and again from
// `onRehydrateStorage` once the persisted state is loaded.
function wireServiceGetters() {
  configureSoundSources({
    getMasterVolume: () => usePreferencesStore.getState().volume,
    getMasterEnabled: () => usePreferencesStore.getState().masterEnabled,
    getKindEnabled: (kind) => Boolean(usePreferencesStore.getState().enabled[kind]),
  });
}
wireServiceGetters();

export { ALL_KINDS };
