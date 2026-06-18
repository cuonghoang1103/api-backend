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
import { configureSoundSources, invalidateCustomSoundCache } from '@/lib/sound';

export type { SoundKind };

const ALL_KINDS: SoundKind[] = ['message', 'notification', 'login', 'post', 'like', 'admin-notification'];

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

interface PreferencesState {
  masterEnabled: boolean;
  volume: number;
  enabled: Record<SoundKind, boolean>;
  /** Map of kind → uploaded file name. The blob itself is in
   *  IndexedDB; this is just for display in the UI ("Currently
   *  using: my-chime.mp3"). An empty string means "use default". */
  customFileName: Record<SoundKind, string>;

  // actions
  setMasterEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  setKindEnabled: (kind: SoundKind, v: boolean) => void;
  setCustomFileName: (kind: SoundKind, name: string) => void;
  reset: () => void;
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

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      masterEnabled: true,
      volume: 0.5,
      enabled: defaultEnabled(),
      customFileName: defaultCustomFileName(),

      setMasterEnabled: (v) => set({ masterEnabled: v }),
      setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
      setKindEnabled: (kind, v) =>
        set((s) => ({ enabled: { ...s.enabled, [kind]: v } })),
      setCustomFileName: (kind, name) =>
        set((s) => ({ customFileName: { ...s.customFileName, [kind]: name } })),
      reset: () =>
        set({
          masterEnabled: true,
          volume: 0.5,
          enabled: defaultEnabled(),
          customFileName: defaultCustomFileName(),
        }),
    }),
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
      partialize: (s) => ({
        masterEnabled: s.masterEnabled,
        volume: s.volume,
        enabled: s.enabled,
        customFileName: s.customFileName,
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
