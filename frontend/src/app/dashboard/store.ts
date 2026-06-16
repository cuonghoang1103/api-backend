'use client';

/**
 * Per-user dashboard state — server is the source of truth.
 *
 * Storage strategy:
 *   - The server (POST /api/v1/dashboard/...) holds the canonical
 *     state in PostgreSQL: level, exp, timeline, tasks (per
 *     user, indexed by user_id).
 *   - On every auth-resolve we fetch the snapshot once via
 *     `dashboardApi.get()` and hydrate the in-memory store.
 *   - The localStorage mirror is a write-through cache for
 *     offline-first behavior. We write on every mutation so a
 *     re-mount (or a reload while the network is flaky) shows
 *     the same data the server eventually returns. We never
 *     trust the mirror on the read path if a server snapshot
 *     is available — the server is the only source of truth
 *     for level/exp (otherwise a user could inflate their own
 *     stats by editing localStorage).
 *   - If the network is unreachable and there's no cached
 *     snapshot, we fall back to a per-user localStorage key
 *     (e.g. "dashboard_mirror_42") so the user still sees
 *     their last-known state until the server comes back.
 *
 * Per-user keying:
 *   - Storage key: `dashboard_mirror_${userId}` for logged-in
 *     users, `dashboard_mirror_guest` for anonymous visitors.
 *   - `switchUser(userId)` flushes the current mirror and
 *     loads the new one. Auth changes (login/logout) flow
 *     through this hook.
 *
 * Why NOT a Zustand store with `persist`:
 *   - The dashboard is structurally similar to other Zustand
 *     stores, but it has hard server-side constraints that
 *     the persist middleware can't enforce: one-celebration-
 *     per-day, idempotent bulk-seed, etc. A thin subscribe +
 *     useState pattern (like the old store) keeps the
 *     mutations auditable in one place.
 */
import type { DashboardState, Task, TimelineSlot, TaskScope, ActivityType } from './types';
import { dashboardApi, type DashboardSnapshot, type DashboardTask as ApiTask, type DashboardActivityType } from '@/lib/api';

const EXP_PER_TASK = 25;
const EXP_PER_LEVEL_BASE = 200;

export function expToNextLevel(level: number): number {
  return EXP_PER_LEVEL_BASE + (level - 1) * 50;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function scopeDate(scope: TaskScope, ref = new Date()): string {
  if (scope === 'today') return todayIso();
  if (scope === 'week') {
    const d = new Date(ref);
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() - (day - 1));
    return d.toISOString().slice(0, 10);
  }
  return `${ref.getUTCFullYear()}-${String(ref.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

function makeEmptyTimeline(): TimelineSlot[] {
  return Array.from({ length: 24 }, (_, h) => ({ hour: h }));
}

function makeDefault(): DashboardState & { userId: string } {
  return {
    userId: 'guest',
    level: 1,
    exp: 0,
    lastCelebrationDate: null,
    tomorrowPlanLockedDate: null,
    timeline: makeEmptyTimeline(),
    activityFilter: null,
    tasks: [],
  };
}

function mirrorKey(userId: string): string {
  return `dashboard_mirror_${userId}`;
}

// ── Module-level singleton ─────────────────────────────────────────

let currentState: DashboardState & { userId: string } = makeDefault();
const listeners = new Set<() => void>();

function notify() {
  // Persist a mirror to localStorage for offline reads. The
  // mirror is keyed per user so a login/logout cycle never
  // leaks data across accounts. We only write the parts of
  // the state that are local (timeline, activity filter) and
  // the public numbers (level, exp). The tasks list is
  // mirrored too so a reload in airplane mode still shows
  // the user's todo list.
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(mirrorKey(currentState.userId), JSON.stringify({
        level: currentState.level,
        exp: currentState.exp,
        timeline: currentState.timeline,
        activityFilter: currentState.activityFilter,
        tasks: currentState.tasks,
        lastCelebrationDate: currentState.lastCelebrationDate,
        tomorrowPlanLockedDate: currentState.tomorrowPlanLockedDate,
      }));
    } catch { /* private mode / quota */ }
  }
  listeners.forEach((l) => l());
}

function loadMirror(userId: string): DashboardState & { userId: string } {
  if (typeof window === 'undefined') return { ...makeDefault(), userId };
  try {
    const raw = localStorage.getItem(mirrorKey(userId));
    if (!raw) return { ...makeDefault(), userId };
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    return {
      ...makeDefault(),
      userId,
      level: typeof parsed.level === 'number' ? parsed.level : 1,
      exp: typeof parsed.exp === 'number' ? parsed.exp : 0,
      timeline: Array.isArray(parsed.timeline) && parsed.timeline.length === 24
        ? parsed.timeline as TimelineSlot[]
        : makeEmptyTimeline(),
      activityFilter: (parsed.activityFilter as ActivityType | null) ?? null,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks as Task[] : [],
      lastCelebrationDate: parsed.lastCelebrationDate ?? null,
      tomorrowPlanLockedDate: parsed.tomorrowPlanLockedDate ?? null,
    };
  } catch {
    return { ...makeDefault(), userId };
  }
}

function apiTaskToTask(t: ApiTask): Task {
  return {
    id: String(t.id),
    title: t.title,
    scope: t.scope,
    done: t.done,
    date: t.date,
    exp: t.exp,
    activityType: (t.activityType ?? undefined) as ActivityType | undefined,
  };
}

function snapshotToState(snap: DashboardSnapshot, userId: string): DashboardState & { userId: string } {
  return {
    userId,
    level: snap.level,
    exp: snap.exp,
    timeline: snap.timeline.length === 24
      ? snap.timeline.map((s) => ({ hour: s.hour, activity: s.activity }))
      : makeEmptyTimeline(),
    activityFilter: currentState.userId === userId ? currentState.activityFilter : null,
    tasks: snap.tasks.map(apiTaskToTask),
    // The server returns ISO timestamps. We store just the date
    // part for the local mirror because the rest of the app
    // only checks "did we celebrate today?" which is a
    // YYYY-MM-DD compare.
    lastCelebrationDate: snap.lastCelebratedAt
      ? snap.lastCelebratedAt.slice(0, 10)
      : null,
    tomorrowPlanLockedDate: snap.tomorrowPlanLockedDate
      ? snap.tomorrowPlanLockedDate.slice(0, 10)
      : null,
  };
}

// ── Public API ─────────────────────────────────────────────────────

export function getState(): DashboardState & { userId: string } {
  return currentState;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setActivityFilter(filter: ActivityType | null): void {
  currentState = { ...currentState, activityFilter: filter };
  notify();
}

/**
 * Load the user's snapshot from the server. Called by the
 * dashboard hook after auth resolves (and after every login
 * / logout / account switch).
 *
 * On success: replace the entire local state with the server
 * snapshot — this is the single source of truth refresh.
 *
 * On network failure: fall back to the localStorage mirror
 * so the page still renders something usable.
 */
export async function hydrateFromServer(userId: string): Promise<void> {
  // Flush the current user's mirror before swapping so the
  // data we just wrote doesn't get clobbered by a stale read.
  if (typeof window !== 'undefined' && currentState.userId !== 'guest') {
    try {
      localStorage.setItem(mirrorKey(currentState.userId), JSON.stringify({
        level: currentState.level,
        exp: currentState.exp,
        timeline: currentState.timeline,
        activityFilter: currentState.activityFilter,
        tasks: currentState.tasks,
        lastCelebrationDate: currentState.lastCelebrationDate,
        tomorrowPlanLockedDate: currentState.tomorrowPlanLockedDate,
      }));
    } catch { /* ignore */ }
  }

  try {
    const res = await dashboardApi.get();
    if (res.data?.data) {
      currentState = snapshotToState(res.data.data, userId);
      notify();
      return;
    }
  } catch (err) {
    // Network error / 401 / 5xx — fall through to mirror.
    console.warn('[Dashboard] hydrateFromServer failed, using local mirror', err);
  }

  // Fallback: load the per-user local mirror. This keeps
  // the user productive when offline and degrades gracefully
  // when the server is briefly unreachable.
  currentState = loadMirror(userId);
  notify();
}

/**
 * One-time auth-triggered user switch. We don't fetch the
 * server here directly because the auth store may not have
 * the access token ready at the moment the userId is known.
 * The hook calls `hydrateFromServer` after switchUser.
 */
export function switchUser(newUserId: string): void {
  const oldId = currentState.userId;
  if (oldId === newUserId) return;
  // Persist current mirror so a quick user-switch-then-switch-
  // back doesn't lose what we were doing.
  notify();
  currentState = { ...makeDefault(), userId: newUserId };
  listeners.forEach((l) => l());
}

// ── Actions (optimistic + background sync) ────────────────────────
//
// Every action does two things:
//   1. Apply the change to local state immediately (optimistic).
//   2. Fire-and-forget the server call to persist it.
// If the server call fails, the local mirror is still consistent
// with the last successful server snapshot, and the user can
// reload to retry. We never block the UI on the network.

/** Set a timeline slot. Local-only — the server's timeline is
 *  pushed on every state update, not per-slot, to keep the
 *  payload small. The next debounced state push will catch
 *  this up. */
export function setActivity(hour: number, activity: TimelineSlot['activity']): void {
  const next = [...currentState.timeline];
  next[hour] = { hour, activity };
  currentState = { ...currentState, timeline: next };
  notify();
  // Fire-and-forget state push. We do it inline here (no
  // debounce) because timeline edits are infrequent — the
  // user is clicking once per minute at most.
  void syncState();
}

async function syncState(): Promise<void> {
  if (currentState.userId === 'guest') return;
  try {
    await dashboardApi.updateState({
      level: currentState.level,
      exp: currentState.exp,
      timeline: currentState.timeline,
      tomorrowPlanLockedDate: currentState.tomorrowPlanLockedDate,
    });
  } catch (err) {
    console.warn('[Dashboard] syncState failed', err);
  }
}

/** Add a single task. Server assigns the id; we update the
 *  local state with the returned row so the React key is
 *  stable. If the server call fails we still have the
 *  optimistic row in local state; the next hydrateFromServer
 *  will reconcile. */
export async function addTask(
  title: string,
  scope: TaskScope,
  activityType?: ActivityType,
): Promise<Task> {
  const trimmed = title.trim();
  // Optimistic placeholder so the UI doesn't flicker. The
  // real id comes back from the server in a few hundred ms.
  const optimistic: Task = {
    id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: trimmed,
    scope,
    done: false,
    date: scopeDate(scope),
    exp: EXP_PER_TASK,
    activityType,
  };
  currentState = { ...currentState, tasks: [...currentState.tasks, optimistic] };
  notify();

  if (currentState.userId === 'guest') return optimistic;

  try {
    const res = await dashboardApi.addTask({
      scope,
      title: trimmed,
      activityType: (activityType ?? null) as DashboardActivityType | null,
    });
    if (res.data?.data) {
      const real = apiTaskToTask(res.data.data);
      currentState = {
        ...currentState,
        tasks: currentState.tasks.map((t) => (t.id === optimistic.id ? real : t)),
      };
      notify();
      return real;
    }
  } catch (err) {
    console.warn('[Dashboard] addTask sync failed', err);
  }
  return optimistic;
}

export async function toggleTask(id: string): Promise<void> {
  const before = currentState.tasks.find((t) => t.id === id);
  if (!before) return;
  const nextDone = !before.done;
  currentState = {
    ...currentState,
    tasks: currentState.tasks.map((t) => (t.id === id ? { ...t, done: nextDone } : t)),
  };
  notify();
  if (currentState.userId === 'guest' || id.startsWith('optimistic-')) return;
  try {
    await dashboardApi.patchTask(Number(id), { done: nextDone });
  } catch (err) {
    console.warn('[Dashboard] toggleTask sync failed', err);
  }
}

export async function removeTask(id: string): Promise<void> {
  currentState = { ...currentState, tasks: currentState.tasks.filter((t) => t.id !== id) };
  notify();
  if (currentState.userId === 'guest' || id.startsWith('optimistic-')) return;
  try {
    await dashboardApi.removeTask(Number(id));
  } catch (err) {
    console.warn('[Dashboard] removeTask sync failed', err);
  }
}

export async function awardExp(amount: number): Promise<void> {
  let exp = currentState.exp + amount;
  let level = currentState.level;
  let needed = expToNextLevel(level);
  let safety = 0;
  while (exp >= needed && safety < 1000) {
    exp -= needed;
    level += 1;
    needed = expToNextLevel(level);
    safety += 1;
  }
  currentState = { ...currentState, exp, level };
  notify();
  await syncState();
}

export function markCelebrated(): void {
  currentState = { ...currentState, lastCelebrationDate: todayIso() };
  notify();
}

export async function planTomorrow(titles: string[]): Promise<void> {
  if (currentState.userId === 'guest') {
    // Local-only path for guests — the server endpoint
    // requires auth. We keep the same data shape so the UI
    // behaves identically.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 10);
    const newOnes: Task[] = titles
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((title) => ({
        id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        scope: 'today' as TaskScope,
        done: false,
        date: iso,
        exp: EXP_PER_TASK,
      }));
    currentState = {
      ...currentState,
      tasks: [...currentState.tasks, ...newOnes],
      tomorrowPlanLockedDate: todayIso(),
    };
    notify();
    return;
  }
  try {
    const res = await dashboardApi.planTomorrow({ titles });
    if (res.data?.data) {
      const newTasks = res.data.data.tasks.map(apiTaskToTask);
      // Remove any old "tomorrow" tasks we had locally and
      // append the server's version. This keeps the timeline
      // continuous if the user re-plans twice in a day.
      const tomorrow = res.data.data.tomorrowDate;
      currentState = {
        ...currentState,
        tasks: [
          ...currentState.tasks.filter((t) => !(t.scope === 'today' && t.date === tomorrow)),
          ...newTasks,
        ],
        tomorrowPlanLockedDate: todayIso(),
      };
      notify();
    }
  } catch (err) {
    console.warn('[Dashboard] planTomorrow sync failed', err);
    throw err;
  }
}

export async function celebrate(): Promise<{
  ok: boolean;
  alreadyCelebrated?: boolean;
  expGained?: number;
}> {
  if (currentState.userId === 'guest') {
    return { ok: false, alreadyCelebrated: Boolean(currentState.lastCelebrationDate === todayIso()) };
  }
  try {
    const res = await dashboardApi.celebrate();
    if (res.data?.data) {
      const d = res.data.data;
      currentState = {
        ...currentState,
        level: d.state.level,
        exp: d.state.exp,
        lastCelebrationDate: todayIso(),
      };
      notify();
      return { ok: true, expGained: d.todayStats.expGained };
    }
    return { ok: false };
  } catch (err: any) {
    // 409 = already celebrated today. Treat as success-no-op
    // so the modal can re-render in the locked state.
    const status = err?.response?.status;
    if (status === 409) {
      currentState = { ...currentState, lastCelebrationDate: todayIso() };
      notify();
      return { ok: true, alreadyCelebrated: true };
    }
    console.warn('[Dashboard] celebrate failed', err);
    return { ok: false };
  }
}

/** Seed default tasks for the current (scope, date) if the
 *  user doesn't have any yet. We delegate to the server's
 *  bulk-seed endpoint because it's idempotent — repeated
 *  calls for the same (scope, date) just return the existing
 *  rows. This is the fix for the old `ensureScopeSeeded`
 *  bug that re-seeded defaults whenever the user had
 *  manually deleted every task. */
export async function ensureScopeSeeded(scope: TaskScope): Promise<void> {
  const target = scopeDate(scope);
  // Quick local check so we don't even hit the network when
  // the user already has tasks for today. This is just an
  // optimization — the server would return { skipped: true }
  // for free, but skipping saves a round-trip on every page
  // load.
  const hasLocal = currentState.tasks.some((t) => t.scope === scope && t.date === target);
  if (hasLocal) return;

  const seedTitles = SEED_TITLES[scope];
  try {
    if (currentState.userId !== 'guest') {
      const res = await dashboardApi.bulkSeedTasks({ scope, titles: seedTitles });
      if (res.data?.data) {
        const seeded = res.data.data.tasks.map(apiTaskToTask);
        // If the server says "skipped" (someone else wrote in
        // the meantime) we still want to merge their rows into
        // our local state so the UI is consistent.
        currentState = {
          ...currentState,
          tasks: [
            ...currentState.tasks,
            ...seeded.filter((s) => !currentState.tasks.some((t) => t.id === s.id)),
          ],
        };
        notify();
        return;
      }
    } else {
      // Guest path: insert locally so the demo has something
      // to look at. Guests don't persist across reloads by
      // design (they're not logged in).
      const newOnes: Task[] = seedTitles.map((title, idx) => ({
        id: `optimistic-${Date.now()}-${scope}-${idx}`,
        title,
        scope,
        done: false,
        date: target,
        exp: EXP_PER_TASK,
      }));
      currentState = { ...currentState, tasks: [...currentState.tasks, ...newOnes] };
      notify();
    }
  } catch (err) {
    console.warn('[Dashboard] ensureScopeSeeded failed', err);
  }
}

/** Replace the current active tasks for a (scope, date) with
 *  the given titles. Used by the "Reset to defaults" button
 *  on the dashboard when the user has wiped everything. */
export async function replaceSeedTasks(scope: TaskScope, titles: string[]): Promise<void> {
  if (currentState.userId === 'guest') return;
  try {
    const res = await dashboardApi.bulkSeedTasks({ scope, titles, replace: true });
    if (res.data?.data) {
      // Re-fetch the whole snapshot so server-side state
      // and local state are in lock-step.
      await hydrateFromServer(currentState.userId);
    }
  } catch (err) {
    console.warn('[Dashboard] replaceSeedTasks failed', err);
  }
}

const SEED_TITLES: Record<TaskScope, string[]> = {
  today: ['Học 1 chương sách / khóa học', 'Hoàn thành 1 task công việc', 'Tập thể dục 30 phút'],
  week:  ['Đọc xong 2 chương sách', 'Hoàn thành project cá nhân', 'Dọn dẹp phòng / không gian làm việc'],
  month: ['Hoàn thành mục tiêu lớn tháng này', 'Tiết kiệm đủ ngân sách', 'Học được kỹ năng mới'],
};
