/**
 * studioStore — UI state for the /creator/* area that needs
 * to be shared across multiple components.
 *
 * Why a store and not URL search params?
 * 1. URL search params are the right choice for the dashboard
 * (deep-linkable, browser-back works). We keep that for
 * "open the modal on the dashboard".
 * 2. But the StudioTopbar's "New project" button lives in
 * the layout — it appears on every /creator/* route, including
 * /creator/projects/[id] (the editor). When the user clicks
 * "New project" from inside the editor, we want a modal to
 * open OVER the editor without navigating away. That means
 * a global UI flag, not a route change.
 * 3. Also used to pre-fill the modal from a "Plan a project
 * on this day" click on the Calendar.
 *
 * Persistence: NONE. This is purely ephemeral UI state.
 * If the user reloads, the modal closes — that's correct.
 */

'use client';

import { create } from 'zustand';

export interface PreFillPayload {
 /** ISO date string (yyyy-MM-dd) for the ideaDate / filmDate. */
 filmDate?: string;
 /** ISO date string (yyyy-MM-dd) for the publishDate. */
 publishDate?: string;
 /** Optional default type from the Calendar's "Plan" menu. */
 type?:
 | 'VLOG'
 | 'AFFILIATE'
 | 'CODE_REVIEW'
 | 'REVIEW'
 | 'IDEA'
 | 'OTHER';
}

interface StudioState {
 isCreateModalOpen: boolean;
 /** When set, the modal pre-fills these fields (used by Calendar). */
 preFill: PreFillPayload | null;

 openCreateModal: (preFill?: PreFillPayload) => void;
 closeCreateModal: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
 isCreateModalOpen: false,
 preFill: null,

 openCreateModal: (preFill) =>
 set({ isCreateModalOpen: true, preFill: preFill ?? null }),
 closeCreateModal: () =>
 set({ isCreateModalOpen: false, preFill: null }),
}));
