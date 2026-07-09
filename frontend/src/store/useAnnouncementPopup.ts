'use client';

/**
 * useAnnouncementPopup (added 2026-07-09)
 * ========================================
 *
 * Tiny, STANDALONE zustand store that drives the realtime "robot flies
 * in from the top" popup (AnnouncementBotPopup) whenever an admin posts
 * a new announcement to /forum.
 *
 * IMPORTANT — keep this store dependency-free. It must NOT import the
 * sound service, the notification store, or any other store. The socket
 * hook (useNotificationSocket) is the ONE place that wires everything
 * together and calls `show()` here; keeping this store a pure leaf avoids
 * circular imports (socket hook → sound/notification store → …).
 */

import { create } from 'zustand';

export interface AnnouncementPopupPayload {
  /** Short message shown in the robot's speech bubble. */
  message: string;
  /** Where clicking the popup should navigate (e.g. `/forum/12`). */
  href: string;
}

interface AnnouncementPopupState {
  popup: AnnouncementPopupPayload | null;
  show: (p: AnnouncementPopupPayload) => void;
  clear: () => void;
}

export const useAnnouncementPopup = create<AnnouncementPopupState>((set) => ({
  popup: null,
  show: (p) => set({ popup: p }),
  clear: () => set({ popup: null }),
}));
