/**
 * Kiểm MỌI tour trên mô phỏng THẬT (React + jsdom), bằng đúng đường mã người học chạy (run.ts):
 *   • vào từng bước: làm `do` — mọi hành động phải có mô phỏng nhận (không "hành động lạ");
 *   • vùng `target` phải tồn tại trong mô phỏng sau khi làm `do`;
 *   • bước có việc: làm `solve` rồi điều kiện `until` PHẢI đạt (lời giải tự động đi tới được);
 *   • tour kết thúc ở trạng thái mà lời thoại hứa (vd. "Output 15", "chờ TB 6,5").
 * Kèm kiểm tĩnh: id duy nhất & dùng được làm class, đủ hai thứ tiếng, đáp án hợp lệ.
 *
 *   cd frontend && npx tsx --test src/components/labs/tour/tours.test.ts
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createRequire, register } from 'node:module';

// jsdom có sẵn trong node_modules (phụ thuộc gián tiếp) nhưng không có @types — khai đúng phần ta dùng
interface JsdomCtor { new (html: string, opts: Record<string, unknown>): { window: Window & { close(): void } } }
const { JSDOM } = createRequire(import.meta.url)('jsdom') as { JSDOM: JsdomCtor };

// .css / .module.css ⇒ đối tượng trả lại đúng tên lớp (đủ cho querySelector và để mô phỏng chạy)
const HOOKS = `
export async function resolve(spec, ctx, next) {
  if (spec.endsWith('.css')) return { url: 'labstub:' + spec, shortCircuit: true };
  return next(spec, ctx);
}
export async function load(url, ctx, next) {
  if (url.startsWith('labstub:')) return { format: 'module', shortCircuit: true, source: 'export default new Proxy({}, { get: (_, k) => (typeof k === "string" ? k : undefined) });' };
  return next(url, ctx);
}`;
register('data:text/javascript,' + encodeURIComponent(HOOKS), import.meta.url);

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const W = dom.window as unknown as Window & typeof globalThis;
// bộ phát của mô phỏng hẹn giờ bằng window.setTimeout (900 ms/bước…) — ép còn ≤ 3 ms để "Chạy" xong trong tích tắc
const realSetTimeout = W.setTimeout.bind(W);
(W as unknown as { setTimeout: unknown }).setTimeout = (fn: TimerHandler, ms?: number, ...a: unknown[]) => realSetTimeout(fn, Math.min(ms ?? 0, 3), ...a);
const g = globalThis as Record<string, unknown>;
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'SVGElement', 'getComputedStyle', 'localStorage', 'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent', 'DocumentFragment']) {
  if (k === 'navigator') Object.defineProperty(globalThis, 'navigator', { value: W.navigator, configurable: true });
  else g[k] = (W as unknown as Record<string, unknown>)[k];
}
g.requestAnimationFrame = (f: FrameRequestCallback) => realSetTimeout(() => f(Date.now()), 4);
g.cancelAnimationFrame = (id: number) => W.clearTimeout(id);
W.requestAnimationFrame = g.requestAnimationFrame as typeof W.requestAnimationFrame;
W.cancelAnimationFrame = g.cancelAnimationFrame as typeof W.cancelAnimationFrame;
W.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof W.matchMedia;
class Obs { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
g.ResizeObserver = Obs; g.IntersectionObserver = Obs;
(W as unknown as Record<string, unknown>).ResizeObserver = Obs;
g.IS_REACT_ACT_ENVIRONMENT = false;

type Mod = Record<string, unknown>;
let React: typeof import('react');
let createRoot: typeof import('react-dom/client').createRoot;
let busMod: typeof import('../bus');
let run: typeof import('./run');
let index: typeof import('./index');
let LABS: typeof import('../registry').LABS;

before(async () => {
  React = await import('react');
  g.React = React; // tsx dịch JSX theo kiểu cổ điển (React.createElement) vì tsconfig để jsx: preserve
  ({ createRoot } = await import('react-dom/client'));
  busMod = await import('../bus');
  run = await import('./run');
  index = await import('./index');
  ({ LABS } = await import('../registry'));
});
after(() => dom.window.close());

const L_OK = (x: readonly [string, string]) => x.length === 2 && x[0].trim().length > 0 && x[1].trim().length > 0;

describe('tours — static checks', () => {
  it('ids are unique, class-safe, and every tour belongs to a known sim', () => {
    const seen = new Set<string>();
    for (const t of index.TOURS) {
      assert.match(t.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, t.id);
      assert.ok(!seen.has(t.id), `duplicate ${t.id}`);
      seen.add(t.id);
      assert.ok(LABS[t.ns].labs[t.sim], `${t.id}: unknown sim ${t.ns}/${t.sim}`);
      for (const p of t.presets) assert.ok(LABS[t.ns].labs[t.sim].presets.includes(p), `${t.id}: unknown preset ${p}`);
    }
  });
  it('every sim has an orientation tour and a default', () => {
    for (const ns of Object.keys(LABS) as Array<keyof typeof LABS>) {
      for (const sim of Object.keys(LABS[ns].labs)) {
        assert.ok(index.TOUR_BY_ID.get(`${sim}-start`), `${ns}/${sim} has no -start tour`);
        for (const p of LABS[ns].labs[sim].presets) assert.ok(index.defaultTour(ns, sim, p), `${ns}/${sim}/${p}`);
      }
    }
  });
  it('text is bilingual, every task has a solution, the quiz is well formed', () => {
    for (const t of index.TOURS) {
      assert.ok(L_OK(t.title) && L_OK(t.summary), t.id);
      assert.ok(t.steps.length >= 3, `${t.id}: too short`);
      for (const [k, st] of t.steps.entries()) {
        assert.ok(L_OK(st.title) && L_OK(st.body), `${t.id}#${k}`);
        if (st.task) { assert.ok(L_OK(st.task.text), `${t.id}#${k} task text`); assert.ok(st.task.solve.length > 0, `${t.id}#${k} no solve`); }
        for (const a of [...(st.do ?? []), ...(st.task?.solve ?? [])]) assert.match(a.a, /^[a-z]+\.[a-zA-Z]+$/, `${t.id}#${k} ${a.a}`);
      }
      assert.ok(L_OK(t.quiz.q) && L_OK(t.quiz.why) && t.quiz.options.every(L_OK), `${t.id} quiz`);
      assert.ok(t.quiz.answer >= 0 && t.quiz.answer < t.quiz.options.length, `${t.id} quiz answer`);
    }
  });
  it('hand-written tours make the learner DO something (at least one task each)', () => {
    for (const t of index.TOURS.filter((x) => x.presets.length)) assert.ok(t.steps.some((s) => s.task), `${t.id} has no task`);
  });
});

/** Lời thoại hứa gì ở cuối tour thì trạng thái phải đúng như vậy. */
const FINAL: Record<string, (s: Record<string, Record<string, unknown> | undefined>) => boolean> = {
  'cpu-first': (s) => s.cpu?.out === 12,
  'fetch-decode': (s) => s.cpu?.out === 15,
  'cpu-bus': (s) => s.cpu?.out === 9,
  'bits-basics': (s) => s.signed?.result === -128 && s.signed?.V === 1,
  'bits-convert': (s) => s.convert?.result === 'C8',
  'logic-ripple': (s) => s.ripple?.done === true && s.ripple?.carryOut === 0,
  'cache-mapping': (s) => s.cache?.hits === 12 && s.cache?.ways === 2,
  'cache-basics': (s) => s.cache?.hits === 24 && s.cache?.misses === 8,
  'sched-policies': (s) => s.sched?.avgWait === 6.5,
  'race-lost-update': (s) => s.race?.mode === 'none' && s.race?.hist === true,
  'race-deadlock': (s) => s.race?.mode === 'ordered' && s.race?.deadlock === false && s.race?.finished === true,
  'vm-thrash': (s) => s.thrash?.faults === 5,
  'deadlock-detect': (s) => s.detect?.key === 'pool' && s.detect?.stuck === 2,
  'deadlock-banker': (s) => s.banker?.verdict === 'deny',
  'eventloop-block': (s) => s.el?.offload === true,
  'process-shell': (s) => s.process?.zombies === 0 && (s.process?.i as number) === 7,
  'syscall-journey': (s) => s.sys?.scenario === 'vdso' && s.sys?.atEnd === true && s.sys?.mode === 'user',
  'perm-check': (s) => s.perm?.path === '/srv/drop/bob-session' && s.perm?.ok === true,
  'perm-acl': (s) => s.perm?.capsDrop === true && s.perm?.ok === false,
  'fdtable-offsets': (s) => s.fd?.preset === 'append' && s.fd?.pos4 === 39 && s.fd?.file === 'worker A: order 1001 paid\nworker B: hi\n',
  'fdtable-deleted': (s) => s.fd?.preset === 'emfile' && (s.fd?.fds as number) >= 1024 && String(s.fd?.term).includes('EMFILE'),
  'nslayers-views': (s) => s.ns?.user === true && s.ns?.insidePid === 1,
  'nslayers-pod': (s) => s.ns?.podNet === true && s.ns?.podPid === true && s.ns?.curlOk === true,
  'syscall-errno': (s) => s.sys?.kind === 'clone3' && s.sys?.raw === -38 && s.sys?.atEnd === true,
};

describe('tours — run on the real simulations', () => {
  for (const ns of ['cpu-lab', 'os-lab'] as const) {
    it(`${ns}: every tour reaches every target and every task`, async () => {
      const failures: string[] = [];
      for (const tour of index.TOURS.filter((t) => t.ns === ns)) {
        const def = LABS[ns].labs[tour.sim];
        const Comp = ((await def.load()) as Mod).default as React.ComponentType<{ lang: 'vi'; preset?: string }>;
        const bus = new busMod.LabBus();
        bus.record = true;
        const host = document.createElement('div');
        document.body.appendChild(host);
        const root = createRoot(host);
        root.render(React.createElement(busMod.LabBusProvider, { bus }, React.createElement(Comp, { lang: 'vi', preset: tour.presets[0] ?? def.presets[0] })));
        const ctx = { bus, rate: 1, alive: () => true, sleep: (ms: number) => new Promise<void>((r) => realSetTimeout(r, Math.min(ms, 12))) };
        await run.waitUntil(ctx, () => Object.keys(bus.state).length > 0, 5000);
        for (const [k, st] of tour.steps.entries()) {
          const tag = `${tour.id}#${k}`;
          if (st.when && !run.holds(st.when, bus)) continue;
          const miss = await run.runActs(ctx, st.do);
          if (miss.length) failures.push(`${tag}: no simulation handles ${miss.join(', ')}`);
          await run.pause(ctx, 30);
          if (st.target && !host.querySelector(`[data-tour="${st.target}"]`)) failures.push(`${tag}: target "${st.target}" not found`);
          if (st.task) {
            const m2 = await run.runActs(ctx, st.task.solve, () => run.holds(st.task!.until, bus));
            if (m2.length) failures.push(`${tag}: solve uses unknown ${m2.join(', ')}`);
            const ok = await run.waitUntil(ctx, () => run.holds(st.task!.until, bus), 15000);
            if (!ok) failures.push(`${tag}: task never satisfied — state ${JSON.stringify(bus.state)}`);
          }
        }
        if (FINAL[tour.id]) {
          const ok = await run.waitUntil(ctx, () => FINAL[tour.id](bus.state), 5000);
          if (!ok) failures.push(`${tour.id}: final state does not match the narration — ${JSON.stringify(bus.state)}`);
        }
        root.unmount();
        host.remove();
      }
      assert.deepEqual(failures, []);
    });
  }
});

describe('narrated numbers come from the engines', () => {
  it('scheduler textbook: FCFS waits 8.75 on average, SRTF 6.5', async () => {
    const { simulate, PRESETS } = await import('../../os-lab/engine/scheduler');
    const P = PRESETS.textbook;
    assert.equal(simulate(P.procs, { policy: 'fcfs', cores: 1, quantum: 4, cs: 0 }).avg.waiting, 8.75);
    assert.equal(simulate(P.procs, { policy: 'srtf', cores: 1, quantum: 4, cs: 0 }).avg.waiting, 6.5);
  });
});
