'use client';
/**
 * "Dây nối" giữa một mô phỏng và bộ hướng dẫn từng bước (tour). Mô phỏng KHÔNG biết tour nào đang chạy: nó chỉ
 *   • công bố trạng thái nhỏ cần cho tour đọc  — useLabBridge('cpu', { pc, phase, done }, …)
 *   • đăng ký các hành động tour được phép bấm  — useLabBridge('cpu', …, { load: (k) => …, mode: (m) => … })
 * Tour đọc trạng thái gộp `{ cpu: {...}, player: {...} }` và gọi hành động bằng tên 'cpu.load'. Không có Provider
 * (mô phỏng dùng ở chỗ khác) ⇒ mọi hook là no-op.
 *
 * Bộ phát (usePlayer / useLivePlayer trong os-lab) tự đăng ký dưới tên 'player' ⇒ mọi mô phỏng có nút Chạy/Bước
 * đều tour được mà không phải sửa gì.
 */
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

export type LabState = Record<string, Record<string, unknown> | undefined>;
export type LabAction = (v?: unknown) => void;

export class LabBus {
  private states = new Map<string, Record<string, unknown>>();
  private acts = new Map<string, Record<string, LabAction>>();
  private subs = new Set<() => void>();
  /** chế độ quay video: không ngẫu nhiên, tour tự chạy theo dòng thời gian cố định */
  record = false;
  /** số mô phỏng tự phát tiếng cho mỗi bước (khi > 0 bộ phát không kêu "tick" chung) */
  ownStepSound = 0;

  publish(id: string, state: Record<string, unknown>) {
    const prev = this.states.get(id);
    if (prev && shallowEq(prev, state)) return;
    this.states.set(id, state);
    this.emit();
  }
  register(id: string, acts: Record<string, LabAction>) { this.acts.set(id, acts); this.emit(); }
  unregister(id: string, acts?: Record<string, LabAction>) {
    if (acts && this.acts.get(id) !== acts) return; // một bản mới đã thay chỗ — đừng xoá nhầm
    this.acts.delete(id); this.states.delete(id); this.emit();
  }
  get state(): LabState { return Object.fromEntries(this.states); }
  has(name: string) { const [id, a] = split(name); return !!this.acts.get(id)?.[a]; }
  act(name: string, v?: unknown): boolean {
    const [id, a] = split(name);
    const f = this.acts.get(id)?.[a];
    if (!f) return false;
    f(v);
    return true;
  }
  subscribe(fn: () => void) { this.subs.add(fn); return () => { this.subs.delete(fn); }; }
  private emit() { for (const f of Array.from(this.subs)) f(); }
}

const split = (name: string): [string, string] => { const k = name.indexOf('.'); return [name.slice(0, k), name.slice(k + 1)]; };
function shallowEq(a: Record<string, unknown>, b: Record<string, unknown>) {
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.is(a[k], b[k])) return false;
  return true;
}

export const LabBusContext = createContext<LabBus | null>(null);
export const useLabBus = () => useContext(LabBusContext);
export function LabBusProvider({ bus, children }: { bus: LabBus; children: ReactNode }) {
  return <LabBusContext.Provider value={bus}>{children}</LabBusContext.Provider>;
}

/**
 * Công bố `state` (so nông — chỉ dùng số/chuỗi/boolean) và đăng ký `actions` dưới tên `id`. Hành động luôn gọi bản
 * closure MỚI NHẤT (qua ref), nên không cần useCallback.
 */
export function useLabBridge(id: string, state: Record<string, unknown>, actions?: Record<string, LabAction>) {
  const bus = useLabBus();
  const ref = useRef(actions);
  ref.current = actions;
  const names = actions ? Object.keys(actions).sort().join(',') : '';
  useEffect(() => {
    if (!bus || !names) return;
    const proxy: Record<string, LabAction> = {};
    for (const n of names.split(',')) proxy[n] = (v) => ref.current?.[n]?.(v);
    bus.register(id, proxy);
    return () => bus.unregister(id, proxy);
  }, [bus, id, names]);
  useEffect(() => { bus?.publish(id, state); });
  useEffect(() => () => { bus?.unregister(id); }, [bus, id]);
}

/** Mô phỏng tự phát tiếng cho mỗi bước ⇒ tắt tiếng "tick" chung của bộ phát. */
export function useOwnStepSound() {
  const bus = useLabBus();
  useEffect(() => {
    if (!bus) return;
    bus.ownStepSound++;
    return () => { bus.ownStepSound--; };
  }, [bus]);
}

/** Đang ở chế độ quay video (không ngẫu nhiên). */
export const useLabRecord = () => useLabBus()?.record ?? false;
