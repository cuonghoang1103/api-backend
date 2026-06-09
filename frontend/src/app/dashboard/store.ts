'use client';

/**
 * Per-user dashboard state — module-level singleton with per-user localStorage keys.
 *
 * Key per user: "{userId}_dashboard"  (e.g. "42_dashboard", "guest_dashboard")
 *
 * Rules:
 *  - State starts as defaults (no localStorage on init)
 *  - switchUser(userId) is called EXACTLY once per auth session to load from localStorage
 *  - Actions (addTask, etc.) always read/write currentState.userId
 *  - On logout → window.location.href → new JS context → clean defaults
 *
 * Why NOT useSyncExternalStore:
 *  The noop-snapshot pattern (noop during loading, real after) makes the initial
 *  render return empty defaults even when user data exists in localStorage.
 *  Instead we use a Zustand-style subscribe + useState pattern: always read real
 *  state, only switchUser once per auth session.
 */
import type { DashboardState, Task, TimelineSlot, TaskScope, ActivityType } from './types';

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
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - (day - 1));
    return d.toISOString().slice(0, 10);
  }
  return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}-01`;
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

function storageKey(userId: string): string {
  return `${userId}_dashboard`;
}

// ── Module-level singleton ────────────────────────────────────────────────────

let currentState: DashboardState & { userId: string } = makeDefault();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      const key = storageKey(currentState.userId);
      localStorage.setItem(key, JSON.stringify(currentState));
      console.log(`[Dashboard] saveToStorage: key="${key}", tasks=${currentState.tasks.length}, level=${currentState.level}, exp=${currentState.exp}`);
    } catch { /* private mode / quota */ }
  }
  listeners.forEach((l) => l());
}

function loadFromStorage(userId: string): DashboardState & { userId: string } {
  if (typeof window === 'undefined') return { ...makeDefault(), userId };
  try {
    const key = storageKey(userId);
    const raw = localStorage.getItem(key);
    console.log(`[Dashboard] loadFromStorage: key="${key}", found=${!!raw}`);
    if (!raw) return { ...makeDefault(), userId };
    const parsed = JSON.parse(raw) as DashboardState & { userId: string };
    if (parsed.userId === userId) {
      console.log(`[Dashboard] loadFromStorage: tasks=${parsed.tasks.length}, level=${parsed.level}`);
      return parsed;
    }
    console.log(`[Dashboard] Key mismatch for "${userId}" (found "${parsed.userId}"), using defaults`);
    return { ...makeDefault(), userId };
  } catch {
    return { ...makeDefault(), userId };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getState(): DashboardState & { userId: string } {
  return currentState;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Load state for the given user from their localStorage key.
 * Called exactly once when auth resolves (from useDashboardStore hook).
 */
export function switchUser(newUserId: string): void {
  const oldId = currentState.userId;
  if (oldId === newUserId) return;
  console.log(`[Dashboard] switchUser: "${oldId}" → "${newUserId}"`);
  // Save current user
  try {
    localStorage.setItem(storageKey(oldId), JSON.stringify(currentState));
  } catch { /* ignore */ }
  // Load new user
  currentState = loadFromStorage(newUserId);
  notify();
}

// ── Actions ──────────────────────────────────────────────────────────────────

export function setActivity(hour: number, activity: TimelineSlot['activity']): void {
  const next = [...currentState.timeline];
  next[hour] = { hour, activity };
  currentState = { ...currentState, timeline: next };
  notify();
}

export function setActivityFilter(filter: ActivityType | null): void {
  currentState = { ...currentState, activityFilter: filter };
  notify();
}

export function addTask(title: string, scope: TaskScope, activityType?: ActivityType): Task {
  const t: Task = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    scope,
    done: false,
    date: scopeDate(scope),
    exp: EXP_PER_TASK,
    activityType,
  };
  currentState = { ...currentState, tasks: [...currentState.tasks, t] };
  notify();
  return t;
}

export function toggleTask(id: string): void {
  currentState = {
    ...currentState,
    tasks: currentState.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  };
  notify();
}

export function removeTask(id: string): void {
  currentState = { ...currentState, tasks: currentState.tasks.filter((t) => t.id !== id) };
  notify();
}

export function awardExp(amount: number): void {
  let exp = currentState.exp + amount;
  let level = currentState.level;
  let needed = expToNextLevel(level);
  while (exp >= needed) {
    exp -= needed;
    level += 1;
    needed = expToNextLevel(level);
  }
  currentState = { ...currentState, exp, level };
  notify();
}

export function markCelebrated(): void {
  currentState = { ...currentState, lastCelebrationDate: todayIso() };
  notify();
}

export function planTomorrow(titles: string[]): void {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = tomorrow.toISOString().slice(0, 10);
  const newOnes: Task[] = titles
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((title, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
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
}

export function ensureScopeSeeded(scope: TaskScope): void {
  const target = scopeDate(scope);
  if (currentState.tasks.some((t) => t.scope === scope && t.date === target)) return;
  const fresh: Task[] = seedTitles[scope].map((title, idx) => ({
    id: `${Date.now()}-${scope}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    scope,
    done: false,
    date: target,
    exp: EXP_PER_TASK,
  }));
  currentState = { ...currentState, tasks: [...currentState.tasks, ...fresh] };
  notify();
}

const seedTitles: Record<TaskScope, string[]> = {
  today: ['Học 1 chương sách / khóa học', 'Hoàn thành 1 task công việc', 'Tập thể dục 30 phút'],
  week:  ['Đọc xong 2 chương sách', 'Hoàn thành project cá nhân', 'Dọn dẹp phòng / không gian làm việc'],
  month: ['Hoàn thành mục tiêu lớn tháng này', 'Tiết kiệm đủ ngân sách', 'Học được kỹ năng mới'],
};
