'use client';

/**
 * Content Creator TanStack Query hooks.
 *
 * Phase 2 — pairs with `contentApi` in `@/lib/api.ts`. The
 * shape mirrors `useSocialQueries.ts`:
 * • one query key prefix (`content`) + per-resource factories
 * • list/detail queries with reasonable staleTime + gcTime
 * • mutations that invalidate the list on success
 *
 * The editor is the only heavy user of these hooks and it
 * calls `useSaveContentProject` (PUT) on every keystroke
 * (debounced). The mutation does NOT invalidate on success —
 * the editor owns the cache and updates the local query data
 * directly so the user sees their typed value, not a
 * server-normalised echo.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, type ContentListParams } from '@/lib/api';
import type {
 ContentIdea,
 ContentIdeaCreate,
 ContentIdeaUpdate,
 ContentProject,
 ContentProjectCreate,
 ContentProjectSummary,
 ContentProjectUpdate,
 ContentStatus,
 IdeaListParams,
} from '@/types';

// ─── Query Keys ─────────────────────────────────────────────────────────────

export const contentKeys = {
 all: ['content'] as const,
 list: (params?: ContentListParams) => [...contentKeys.all, 'list', params ?? {}] as const,
 detail: (id: number) => [...contentKeys.all, 'detail', id] as const,
};

// ─── List Query ─────────────────────────────────────────────────────────────

/**
 * List all content projects for the kanban / pipeline / list
 * views. Accepts the same `status` / `type` / `q` filters the
 * backend supports. We use `placeholderData: keepPrevious` so
 * switching between status filters doesn't flash an empty
 * grid.
 */
export function useContentProjects(params?: ContentListParams) {
 return useQuery({
 queryKey: contentKeys.list(params),
 queryFn: () =>
 contentApi.list(params).then((r) => r.data as unknown as ContentProjectSummary[]),
 staleTime: 30_000,
 gcTime: 5 * 60_000,
 placeholderData: (prev) => prev,
 });
}

// ─── Detail Query ───────────────────────────────────────────────────────────

/**
 * Full nested project (days > scenes, products, posts,
 * checklist, performance). Enabled only when we have a
 * positive id — guards against the "create new" flow where
 * the id is null until the first save.
 */
export function useContentProject(id: number | null) {
 return useQuery({
 queryKey: contentKeys.detail(id ?? -1),
 queryFn: () => contentApi.get(id as number).then((r) => r.data as unknown as ContentProject),
 enabled: id != null && id > 0,
 staleTime: 60_000,
 gcTime: 10 * 60_000,
 });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

/**
 * Create a new project. On success, invalidates the list so
 * the kanban / dashboard refetch the new card.
 */
export function useCreateContentProject() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (payload: ContentProjectCreate) => contentApi.create(payload),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: contentKeys.all, refetchType: 'all' });
 },
 });
}

/**
 * Save a project (full upsert). The editor calls this on
 * every debounced save — we DO NOT invalidate the list on
 * success because:
 * 1. the editor already mutates the detail cache via
 * `setQueryData` in the editor's onSave handler, so the
 * detail view is always in sync;
 * 2. invalidating the list would force a refetch and shake
 * the kanban (column counts, ordering) under the user.
 * If the title / status changed the editor can call
 * `invalidateContentList` manually.
 */
export function useSaveContentProject() {
 return useMutation({
 mutationFn: ({ id, payload }: { id: number; payload: ContentProjectUpdate }) =>
 contentApi.update(id, payload),
 });
}

/**
 * Quick status change for kanban drag-drop. Invalidates the
 * list so the column membership updates across the UI.
 */
export function useUpdateContentStatus() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, status }: { id: number; status: ContentStatus }) =>
 contentApi.updateStatus(id, status),
 // Optimistic update: move the card to the new column
 // immediately, rollback on error.
 onMutate: async ({ id, status }) => {
 await qc.cancelQueries({ queryKey: contentKeys.all });
 const prevLists = qc.getQueriesData<ContentProjectSummary[]>({
 queryKey: contentKeys.all,
 });
 qc.setQueriesData<ContentProjectSummary[] | undefined>(
 { queryKey: contentKeys.all },
 (old) => {
 if (!old) return old;
 return old.map((p) => (p.id === id ? { ...p, status } : p));
 },
 );
 return { prevLists };
 },
 onError: (_err, _vars, ctx) => {
 if (ctx?.prevLists) {
 for (const [key, value] of ctx.prevLists) {
 qc.setQueryData(key, value);
 }
 }
 },
 onSettled: () => {
 qc.invalidateQueries({ queryKey: contentKeys.list() });
 },
 });
}

export function useDeleteContentProject() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (id: number) => contentApi.remove(id),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: contentKeys.all, refetchType: 'all' });
 },
 });
}

// ─── Cache utilities ────────────────────────────────────────────────────────

/** Manual list invalidation — used after editor saves that
 * change title / status / dates. */
export function useInvalidateContentList() {
 const qc = useQueryClient();
 return () => {
 qc.invalidateQueries({ queryKey: contentKeys.list(), refetchType: 'all' });
 };
}

/** Optimistic helper to set the detail cache in-place from
 * the editor without round-tripping. */
export function useSetContentDetail() {
 const qc = useQueryClient();
 return (id: number, project: ContentProject) => {
 qc.setQueryData(contentKeys.detail(id), project);
 };
}

// ============================================================
// Phase 5: Idea Bank hooks
// ============================================================
// Each query/mutation mirrors the project hook shape so the
// `/creator/ideas` page can plug them in directly. We keep
// a separate `ideaKeys` namespace so invalidations don't
// accidentally nuke the project list (and vice versa).

export const ideaKeys = {
 all: ['content-ideas'] as const,
 list: (params?: IdeaListParams) => [...ideaKeys.all, 'list', params ?? {}] as const,
 detail: (id: number) => [...ideaKeys.all, 'detail', id] as const,
};

export function useContentIdeas(params?: IdeaListParams) {
 return useQuery({
 queryKey: ideaKeys.list(params),
 queryFn: () =>
 contentApi.ideas.list(params).then((r) => r.data.data),
 staleTime: 5 * 60_000,
 });
}

export function useContentIdea(id: number | null) {
 return useQuery({
 enabled: id !== null,
 queryKey: ideaKeys.detail(id ?? -1),
 queryFn: () =>
 contentApi.ideas.get(id as number).then((r) => r.data.data),
 staleTime: 5 * 60_000,
 });
}

export function useCreateContentIdea() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (payload: ContentIdeaCreate) =>
 contentApi.ideas.create(payload),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: ideaKeys.all, refetchType: 'all' });
 },
 });
}

export function useUpdateContentIdea() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, payload }: { id: number; payload: ContentIdeaUpdate }) =>
 contentApi.ideas.update(id, payload),
 // Optimistic update of the list cache so the UI
 // reflects the change instantly. On error we roll
 // back to the previous value.
 onMutate: async ({ id, payload }) => {
 await qc.cancelQueries({ queryKey: ideaKeys.all });
 const prevLists = qc.getQueriesData<{
 items: ContentIdea[];
 total: number;
 }>({ queryKey: ideaKeys.all });
 prevLists.forEach(([key, snapshot]) => {
 if (!snapshot?.items) return;
 qc.setQueryData<{ items: ContentIdea[]; total: number }>(key, {
 total: snapshot.total,
 items: snapshot.items.map((i) => (i.id === id ? { ...i, ...payload } : i)),
 });
 });
 return { prevLists };
 },
 onError: (_err, _vars, ctx) => {
 ctx?.prevLists?.forEach(([key, snapshot]) => {
 qc.setQueryData(key, snapshot);
 });
 },
 onSettled: () => {
 qc.invalidateQueries({ queryKey: ideaKeys.all, refetchType: 'all' });
 },
 });
}

export function useDeleteContentIdea() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (id: number) => contentApi.ideas.remove(id),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: ideaKeys.all, refetchType: 'all' });
 },
 });
}

export function usePromoteContentIdea() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (id: number) => contentApi.ideas.promote(id),
 onSuccess: () => {
 // The promote call creates a project, so the
 // project list cache is now stale too. Invalidate
 // both namespaces.
 qc.invalidateQueries({ queryKey: ideaKeys.all, refetchType: 'all' });
 qc.invalidateQueries({ queryKey: contentKeys.all, refetchType: 'all' });
 },
 });
}
