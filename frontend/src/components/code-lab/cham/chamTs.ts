/**
 * Máy chấm `ts` (TypeScript) trong TRÌNH DUYỆT — 01/11/2026, khoá TypeScript (đề: content/courses/typescript/_de-codelab-ts.json,
 * track content/codelab/typescript-practice). Bộ chạy: tsRunner.ts.
 *
 * Bộ kiểm (`testsJson`):
 *   { loai: 'ts', tsconfig: { …compilerOptions chuẩn của khoá }, coDinh: { tệp của đề — test, kiem/sai.ts… },
 *     tepHoc: [tệp người học sửa], timeoutMs?, kiem: [
 *       { kiem: 'sach', tep: [...] }                       tsc (tệp người học + tep) ⇒ 0 lỗi
 *       { kiem: 'phai-loi', tep, dong, ma: ['TS2345'] }   dòng đó PHẢI bị tsc từ chối với một trong các mã
 *       { kiem: 'khong-loi-la', tep }                      các dòng còn lại của tep vẫn biên dịch
 *       { kiem: 'co-ma', ma } · { kiem: 'chi-ma', ma: [] } đề "đọc lỗi": phải có mã / chỉ được có các mã này
 *       { kiem: 'chay', lenh: 'node --test test/x.test.ts', ra? }   chạy như Node 22 (bỏ kiểu), exit 0 (+ stdout chứa ra)
 *       { kiem: 'cam', mau: [regex] }                      lối tắt bị cấm (any, @ts-ignore, as…)
 *   ]}
 *
 * Tải LƯỜI: TypeScript 6.0.3 (typescript.js 8,9 MB / gzip 1,6 MB) + khai báo (lib-ts.json 3,1 MB / gzip 0,44 MB — chú thích tài liệu đã bỏ) tự lưu ở
 * /vendor/typescript-6.0.3/ (scripts/codelab-ts-vendor.mjs) — CHỈ khi mở một đề loại `ts` (`moTruocTs`) hoặc bấm chấm.
 * Một worker biên dịch sống suốt phiên (tệp lib phân tích một lần); mã người học CHẠY trong một worker nhẹ MỚI cho mỗi
 * lệnh, trang giữ giờ thật ⇒ vòng lặp vô hạn bị terminate() mà không mất trình biên dịch đã nạp.
 *
 * TypeScript 6.0.3 thay cho 7.0.2 của khoá (7 là binary Go, không có JS API): đo trên 48 đề, 47 cho cùng kết quả; đề
 * ts-cl-1-2-d lệch MÃ ở một dòng (7: TS2739, 6: TS2345 bọc ngoài) ⇒ kiểm đó nhận cả hai mã (khai trong nguồn đề).
 * Web: CSP có sẵn `worker-src 'self' blob:` + `script-src 'self'` ⇒ worker blob importScripts() tệp cùng nguồn.
 * App desktop: CSP renderer cấm blob/eval ⇒ worker HỘP CÁT (`__CT_HOP_CAT_WORKER__`, cho eval, cấm mạng): trang tải
 * typescript.js + lib-ts.json từ https://cuongthai.com/vendor/… (nginx gắn CORS *) rồi gửi chữ vào worker.
 * Toàn vẹn: như mọi loại code — trình duyệt báo, máy chủ kiểm hình dạng ⇒ tiến độ cá nhân (src/services/codeLab.cham.ts).
 */
import { TS_CHAY_SRC, TS_KIEU_SRC, TS_VENDOR_DUONG } from './tsRunner';
import type { Kiem, KetQuaKiem, TepMap, TestsJson } from './kieu';

export interface KqChay { ma: number; stdout: string; stderr: string; tests: Array<{ ten: string; dat: boolean; loi?: string; boQua?: boolean }>; loi?: string; quaGio?: boolean; loiMay?: string }
export interface KqKieu { ketQua?: Array<{ i: number; dat: boolean; thay: string }>; js?: TepMap; loiMay?: string }
/** "Máy" chấm — trình duyệt (Worker) hoặc Node (vm, khi xuất đề/test). */
export interface MayTs {
  kieu(req: { tsconfig: unknown; hoc: TepMap; coDinh: TepMap; kiem: Kiem[]; dich: boolean }): Promise<KqKieu>;
  chay(js: TepMap, lenh: string, timeoutMs: number): Promise<KqChay>;
}

const LOAI_KIEU = new Set(['sach', 'phai-loi', 'khong-loi-la', 'co-ma', 'chi-ma', 'cam']);
const MAC_DINH_MS = 5000;
const TRAN_MS = 20000;
const MO_TOI_DA_MS = 180000; // lần đầu: tải ~2 MB nén + phân tích lib
const KIEU_TOI_DA_MS = 60000;

const ngan = (s: string, n = 400) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);

/** Tệp người học = mọi tệp trong editor TRỪ tệp của đề (coDinh luôn lấy bản gốc của đề). */
export function tepNguoiHoc(tj: TestsJson, files: TepMap): TepMap {
  const coDinh = (tj.coDinh && typeof tj.coDinh === 'object' ? tj.coDinh : {}) as TepMap;
  return Object.fromEntries(Object.entries(files).filter(([t]) => !(t in coDinh)));
}

/** Kết quả một lệnh chạy ⇒ một kiểm. */
export function ketQuaChay(k: Kiem, r: KqChay, timeoutMs: number): Omit<KetQuaKiem, 'i'> {
  const lenh = String(k.lenh);
  if (r.loiMay) return { dat: false, thay: `grader error: ${r.loiMay}` };
  if (r.quaGio) return { dat: false, thay: `${lenh}: still running after ${timeoutMs / 1000}s — infinite loop?` };
  const ra = typeof k.ra === 'string' ? k.ra : null;
  const out = r.ma === 0 ? r.stdout : `${r.stdout}\n${r.stderr}`;
  if (r.ma !== 0) {
    const truot = r.tests.filter((t) => !t.dat);
    if (truot.length) {
      const ds = truot.slice(0, 2).map((t) => `✖ ${t.ten} — ${t.loi ?? 'failed'}`).join(' · ');
      return { dat: false, thay: ngan(`${lenh}: ${truot.length}/${r.tests.length} test(s) failed. ${ds}`) };
    }
    return { dat: false, thay: ngan(`${lenh}: exit ${r.ma} — ${r.loi ?? (r.stderr.split('\n').find(Boolean) || 'error')}`) };
  }
  if (ra != null && !out.includes(ra)) {
    return { dat: false, thay: ngan(`${lenh}: output does not contain "${ra.replace(/\n/g, '⏎')}" — got: ${r.stdout.trim().replace(/\n/g, '⏎') || '(nothing)'}`) };
  }
  const daChay = r.tests.filter((t) => !t.boQua).length;
  return { dat: true, thay: daChay ? `${lenh}: ${daChay} test(s) passed` : `${lenh}: exit 0${ra != null ? ' · output matches' : ''}` };
}

export async function chamTs(tj: TestsJson, kiem: Kiem[], files: TepMap, onTung?: (r: KetQuaKiem) => void, may: MayTs = mayTrinhDuyet()): Promise<KetQuaKiem[]> {
  const coDinh = (tj.coDinh && typeof tj.coDinh === 'object' ? tj.coDinh : {}) as TepMap;
  const hoc = tepNguoiHoc(tj, files);
  const timeoutMs = Math.min(TRAN_MS, Math.max(500, Number(tj.timeoutMs) || MAC_DINH_MS));
  const dsKieu = kiem.map((k, idx) => ({ ...k, i: typeof k.i === 'number' ? k.i : idx })).filter((k) => LOAI_KIEU.has(String(k.kiem)));
  const coChay = kiem.some((k) => k.kiem === 'chay');

  let kieu: KqKieu = {};
  if (dsKieu.length || coChay) kieu = await may.kieu({ tsconfig: tj.tsconfig ?? {}, hoc, coDinh, kiem: dsKieu, dich: coChay });
  const theoI = new Map((kieu.ketQua ?? []).map((r) => [r.i, r]));

  const out: KetQuaKiem[] = [];
  for (const [idx, k] of kiem.entries()) {
    const i = typeof k.i === 'number' ? k.i : idx;
    let r: Omit<KetQuaKiem, 'i'>;
    if (kieu.loiMay) r = { dat: false, thay: `TypeScript compiler could not start: ${kieu.loiMay}` };
    else if (LOAI_KIEU.has(String(k.kiem))) {
      const x = theoI.get(i);
      r = x ? { dat: !!x.dat, thay: x.thay } : { dat: false, thay: 'not checked (grader error)' };
    } else if (k.kiem === 'chay') {
      const rr = await may.chay(kieu.js ?? {}, String(k.lenh), timeoutMs);
      r = ketQuaChay(k, rr, timeoutMs);
    } else r = { dat: false, thay: `unknown check "${String(k.kiem)}" in a ts exercise` };
    const kq: KetQuaKiem = { ...r, i, an: !!k.an, nhom: (k.nhom as string) ?? null, moTa: k.moTa };
    out.push(kq);
    onTung?.(kq);
  }
  return out;
}

// ─── máy trình duyệt ─────────────────────────────────────────────────────────────────────────────

const WORKER_KIEU = `${TS_KIEU_SRC}
var __sanSang = null;
function __mo(d) {
  if (__sanSang) return __sanSang;
  __sanSang = Promise.resolve().then(function () {
    var t0 = Date.now();
    if (d.tsSrc) { (0, eval)(d.tsSrc); } else { importScripts(d.tsUrl); }
    var tsApi = self.ts;
    if (!tsApi || !tsApi.createProgram) throw new Error('typescript.js did not define ts');
    return (d.lib ? Promise.resolve(d.lib) : fetch(d.libUrl).then(function (r) { if (!r.ok) throw new Error('lib-ts.json HTTP ' + r.status); return r.json(); }))
      .then(function (lib) { var r = globalThis.__CL_TS__.khoiTao(tsApi, lib); r.ms = Date.now() - t0; return r; });
  });
  __sanSang.catch(function () { __sanSang = null; });
  return __sanSang;
}
self.onmessage = function (ev) {
  var d = ev.data || {};
  if (d.mo) {
    __mo(d.mo).then(function (r) { self.postMessage({ id: d.id, san: r }); }, function (e) { self.postMessage({ id: d.id, loiMay: String(e && e.message || e) }); });
  } else if (d.kieu) {
    try {
      var kq = d.kieu.kiem.length ? globalThis.__CL_TS__.kiemKieu(d.kieu) : [];
      var js = d.kieu.dich ? globalThis.__CL_TS__.dich({ tep: Object.assign({}, d.kieu.hoc, d.kieu.coDinh) }).js : undefined;
      self.postMessage({ id: d.id, ketQua: kq, js: js });
    } catch (e) { self.postMessage({ id: d.id, loiMay: String(e && e.message || e) }); }
  }
};
`;

const WORKER_CHAY = `${TS_CHAY_SRC}
self.addEventListener('unhandledrejection', function (e) { e.preventDefault(); });
self.onmessage = function (ev) {
  var d = ev.data || {};
  if (!d.js) return;
  globalThis.__CL_TS_CHAY__.chay(d).then(function (r) { self.postMessage(r); }, function (e) {
    self.postMessage({ ma: 1, stdout: '', stderr: String(e && e.message || e), tests: [], loiMay: String(e && e.message || e) });
  });
};
`;

type G = { __CT_HOP_CAT_WORKER__?: string; __CT_TS_VENDOR__?: string };

/** Gốc tải TypeScript: web = cùng nguồn; app desktop (app://…) = web thật (CORS * ở nginx). */
function vendorGoc(): string {
  const g = globalThis as G;
  if (g.__CT_TS_VENDOR__) return g.__CT_TS_VENDOR__;
  if (g.__CT_HOP_CAT_WORKER__) return `https://cuongthai.com${TS_VENDOR_DUONG}`;
  return new URL(TS_VENDOR_DUONG, globalThis.location?.href ?? 'https://cuongthai.com/').href;
}

function taoWorker(src: string, ten: string): { w: Worker; don: () => void } {
  const hopCat = (globalThis as G).__CT_HOP_CAT_WORKER__;
  if (hopCat) {
    const w = new Worker(hopCat);
    w.postMessage({ __napMa: src });
    return { w, don: () => w.terminate() };
  }
  const url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
  const w = new Worker(url, { name: ten });
  return { w, don: () => { w.terminate(); URL.revokeObjectURL(url); } };
}

interface PhienKieu { gui(du: Record<string, unknown>, hetMs: number): Promise<Record<string, unknown> | null>; huy(): void; san: Promise<{ phienBan?: string; ms?: number } | { loiMay: string }> }
let phien: PhienKieu | null = null;
let henDong: ReturnType<typeof setTimeout> | null = null;
let demTin = 0;

function moPhien(): PhienKieu {
  const { w, don } = taoWorker(WORKER_KIEU, 'cl-ts');
  const cho = new Map<number, (v: Record<string, unknown> | null) => void>();
  let chet = false;
  w.onmessage = (ev: MessageEvent) => { const d = ev.data as { id: number }; cho.get(d.id)?.(d as unknown as Record<string, unknown>); cho.delete(d.id); };
  w.onerror = (ev: ErrorEvent) => { ev.preventDefault?.(); const loiMay = ev.message || 'TypeScript worker crashed'; cho.forEach((f) => f({ loiMay })); cho.clear(); };
  const gui = (du: Record<string, unknown>, hetMs: number) => {
    if (chet) return Promise.resolve(null);
    const id = ++demTin;
    return new Promise<Record<string, unknown> | null>((resolve) => {
      const hen = setTimeout(() => { cho.delete(id); resolve(null); }, hetMs);
      cho.set(id, (v) => { clearTimeout(hen); resolve(v); });
      w.postMessage({ id, ...du });
    });
  };
  const goc = vendorGoc();
  const san = (async () => {
    let mo: Record<string, unknown>;
    if ((globalThis as G).__CT_HOP_CAT_WORKER__) {
      // app: worker hộp cát không ra mạng ⇒ trang tải rồi gửi chữ vào
      const [a, b] = await Promise.all([fetch(`${goc}typescript.js`), fetch(`${goc}lib-ts.json`)]);
      if (!a.ok || !b.ok) throw new Error(`cannot download TypeScript (${a.status}/${b.status})`);
      mo = { tsSrc: await a.text(), lib: await b.json() };
    } else mo = { tsUrl: `${goc}typescript.js`, libUrl: `${goc}lib-ts.json` };
    const r = await gui({ mo }, MO_TOI_DA_MS);
    if (!r) return { loiMay: 'loading TypeScript timed out' };
    if (r.loiMay) return { loiMay: String(r.loiMay) };
    return r.san as { phienBan?: string; ms?: number };
  })().catch((e: unknown) => ({ loiMay: e instanceof Error ? e.message : String(e) }));
  return {
    gui, san,
    huy() { chet = true; don(); cho.forEach((f) => f(null)); cho.clear(); },
  };
}

function layPhien(): PhienKieu {
  if (!phien) phien = moPhien();
  if (henDong) clearTimeout(henDong);
  // rảnh 15 phút ⇒ trả bộ nhớ (~150 MB với trình biên dịch + lib đã phân tích)
  henDong = setTimeout(() => { phien?.huy(); phien = null; }, 15 * 60 * 1000);
  return phien;
}

/** Mở trước trình biên dịch khi trang một đề `ts` mở (không đợi bấm Chạy). Đề loại khác KHÔNG gọi ⇒ không tải gì. */
export function moTruocTs(): void {
  if (typeof Worker === 'undefined') return;
  void layPhien().san;
}

function chayMotLenh(js: TepMap, lenh: string, timeoutMs: number): Promise<KqChay> {
  return new Promise((resolve) => {
    let xong = false;
    let don = () => {};
    const ket = (r: KqChay) => { if (xong) return; xong = true; clearTimeout(hen); don(); resolve(r); };
    const hen = setTimeout(() => ket({ ma: 1, stdout: '', stderr: '', tests: [], quaGio: true }), timeoutMs);
    try {
      const tw = taoWorker(WORKER_CHAY, 'cl-ts-chay');
      don = tw.don;
      tw.w.onmessage = (ev: MessageEvent) => ket(ev.data as KqChay);
      tw.w.onerror = (ev: ErrorEvent) => { ev.preventDefault?.(); ket({ ma: 1, stdout: '', stderr: ev.message, tests: [], loi: ev.message || 'worker crashed' }); };
      tw.w.postMessage({ js, lenh });
    } catch (e) {
      ket({ ma: 1, stdout: '', stderr: '', tests: [], loiMay: `cannot start worker: ${e instanceof Error ? e.message : String(e)}` });
    }
  });
}

export function mayTrinhDuyet(): MayTs {
  return {
    async kieu(req) {
      const p = layPhien();
      const s = await p.san;
      if ('loiMay' in s) { p.huy(); phien = null; return { loiMay: s.loiMay }; }
      const r = await p.gui({ kieu: req }, KIEU_TOI_DA_MS);
      if (!r) { p.huy(); phien = null; return { loiMay: `type check took longer than ${KIEU_TOI_DA_MS / 1000}s` }; }
      if (r.loiMay) return { loiMay: String(r.loiMay) };
      return { ketQua: r.ketQua as KqKieu['ketQua'], js: r.js as TepMap | undefined };
    },
    chay: chayMotLenh,
  };
}
