'use client';

/**
 * ============================================================
 * Listen Together store (Phase 3)
 * ============================================================
 *
 * Holds the CURRENT room membership state only. The actual realtime
 * sync (emit-as-host / apply-as-guest) lives in <ListenTogetherSync/>,
 * which reads this store and the music store. Kept tiny + isolated so
 * it can't interfere with the player or chat.
 */

import { create } from 'zustand';
import type { ListenMember } from '@/lib/socket';

export interface ListenTogetherState {
  roomId: string | null;
  isHost: boolean;
  hostId: number | null;
  members: ListenMember[];
  status: 'idle' | 'connecting' | 'active' | 'error';
  error: string | null;
  // True for the brief window while we apply a remote state update, so
  // the host-emit effect can ignore store changes it caused itself.
  applyingRemote: boolean;

  enterRoom: (p: { roomId: string; isHost: boolean; hostId: number | null; members: ListenMember[] }) => void;
  setMembers: (members: ListenMember[], hostId: number | null) => void;
  setStatus: (status: ListenTogetherState['status'], error?: string | null) => void;
  setApplyingRemote: (v: boolean) => void;
  reset: () => void;
}

export const useListenTogetherStore = create<ListenTogetherState>()((set) => ({
  roomId: null,
  isHost: false,
  hostId: null,
  members: [],
  status: 'idle',
  error: null,
  applyingRemote: false,

  enterRoom: ({ roomId, isHost, hostId, members }) =>
    set({
      roomId,
      isHost,
      hostId,
      members: Array.isArray(members) ? members : [],
      status: 'active',
      error: null,
    }),

  setMembers: (members, hostId) =>
    set({
      members: Array.isArray(members) ? members : [],
      ...(hostId != null ? { hostId } : {}),
    }),

  setStatus: (status, error = null) => set({ status, error }),

  setApplyingRemote: (v) => set({ applyingRemote: v }),

  reset: () =>
    set({
      roomId: null,
      isHost: false,
      hostId: null,
      members: [],
      status: 'idle',
      error: null,
      applyingRemote: false,
    }),
}));
