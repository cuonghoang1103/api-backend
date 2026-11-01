/**
 * Máy chấm `mutation` — chấm BỘ TEST người học viết (01/11/2026, khoá Testing).
 *
 * Đề khai `impl` (code ĐÚNG) + danh sách đột biến (mỗi cái = bản code có một lỗi cài sẵn). Chấm:
 *   1. chạy bộ test của người học với `impl` ⇒ phải XANH HẾT và có ≥ `toiThieuTest` test (kiểm #0, nhom 'xanh');
 *   2. chạy lại với TỪNG đột biến (kiểm #1…, nhom 'dot-bien') ⇒ bộ test ĐỎ = "đã diệt", vẫn xanh = "còn sống".
 *   Bước 1 trượt ⇒ không chấm đột biến (test sai thì đỏ với mọi thứ — "diệt" khi đó là giả).
 * Điểm = tỉ lệ diệt; đạt khi bước 1 xanh và diệt ≥ `nguong` (mặc định: tất cả) — `diem.ts › chapNhan`.
 *
 *   3. (tuỳ đề) kiểm 'vo-hai' (nhom 'xanh'): bản code có một thay đổi VÔ HẠI (refactor) ⇒ bộ test phải VẪN XANH —
 *      bắt bộ test quá chi tiết (bài 3.3). Trượt ⇒ như bước 1 trượt: chưa đạt.
 * Ảnh chụp tệp (`toMatchFileSnapshot`) ghi ở lượt code ĐÚNG được đưa vào mọi lượt sau (đột biến so với nó).
 * Tuỳ chọn của đề chuyển vào bộ chạy: `thuVien` (gói npm đi kèm, vd yaml), `xaoTron` (hạt giống --sequence.shuffle),
 * `lapLai` (--repeats), `tranTestMs` (--testTimeout), `restoreMocks` (mặc định bật như cấu hình khoá).
 * Mỗi lượt chạy = một Worker MỚI (realm sạch), giờ THẬT do trang giữ: quá `timeoutMs` ⇒ terminate().
 * Với code đúng: quá giờ = trượt ("vòng lặp vô hạn trong test?"); với đột biến: quá giờ = DIỆT (như Stryker).
 * App desktop: worker hộp cát (`__CT_HOP_CAT_WORKER__`, CSP riêng cho eval, không mạng) — cùng mã, vì bộ chạy
 * tự biến đổi import/export thành hàm (không cần import(blob:) mà app chặn).
 * Toàn vẹn: như mọi loại code — trình duyệt báo, máy chủ kiểm hình dạng ⇒ tiến độ cá nhân (codeLab.cham.ts).
 */
import { RUNNER_SRC } from './mutationRunner';
import type { Kiem, KetQuaKiem, TepMap, TestsJson } from './kieu';

const WORKER_SRC = `${RUNNER_SRC}
// Promise bị từ chối không ai bắt (đột biến làm hỏng luồng async) — không để nó thành lỗi worker
self.addEventListener('unhandledrejection', function (e) { e.preventDefault(); });
self.onmessage = function (ev) {
  var d = ev.data || {};
  if (!d.files) return;
  globalThis.__ctMutation.chay(d).then(function (r) { self.postMessage(r); }, function (e) {
    self.postMessage({ tests: [], loiNap: 'grader error: ' + (e && e.message ? e.message : String(e)) });
  });
};
`;

export interface TestChay { ten: string; dat: boolean; loi?: string }
export interface LuotChay { tests: TestChay[]; loiNap?: string; quaGio?: boolean; ms: number; anhChup?: TepMap }
/** Tuỳ chọn bộ chạy lấy từ đề (xem đầu tệp). */
export interface TuyChonChay { thuVien?: TepMap; xaoTron?: number; lapLai?: number; restoreMocks?: boolean }

const MAC_DINH_MS = 4000;
const TRAN_MS = 15000;

function taoWorker(): { w: Worker; don: () => void } {
  const hopCat = (globalThis as { __CT_HOP_CAT_WORKER__?: string }).__CT_HOP_CAT_WORKER__;
  if (hopCat) {
    const w = new Worker(hopCat);
    w.postMessage({ __napMa: WORKER_SRC });
    return { w, don: () => w.terminate() };
  }
  const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'application/javascript' }));
  const w = new Worker(url);
  return { w, don: () => { w.terminate(); URL.revokeObjectURL(url); } };
}

/** Một lượt: nạp `files`, chạy các tệp `tepTest` trong Worker mới; quá `timeoutMs` (giờ thật) ⇒ huỷ worker. */
export function chayLuot(files: TepMap, tepTest: string[], timeoutMs: number, tranTestMs?: number, tuy: TuyChonChay = {}): Promise<LuotChay> {
  const t0 = performance.now();
  return new Promise((resolve) => {
    let xong = false;
    let don = () => {};
    const ket = (r: Omit<LuotChay, 'ms'>) => {
      if (xong) return;
      xong = true;
      clearTimeout(hen);
      don();
      resolve({ ...r, ms: Math.round(performance.now() - t0) });
    };
    const hen = setTimeout(() => ket({ tests: [], quaGio: true }), timeoutMs);
    try {
      const tw = taoWorker();
      don = tw.don;
      tw.w.onmessage = (ev: MessageEvent) => {
        const d = ev.data as { tests?: TestChay[]; loiNap?: string; anhChup?: TepMap } | null;
        ket({ tests: Array.isArray(d?.tests) ? d!.tests : [], ...(d?.loiNap ? { loiNap: String(d.loiNap) } : {}), ...(d?.anhChup ? { anhChup: d.anhChup } : {}) });
      };
      tw.w.onerror = (ev: ErrorEvent) => { ev.preventDefault?.(); ket({ tests: [], loiNap: ev.message || 'worker crashed' }); };
      tw.w.postMessage({ files, tepTest, tranTestMs: tranTestMs ?? Math.min(2000, timeoutMs), ...tuy });
    } catch (e) {
      ket({ tests: [], loiNap: `cannot start worker: ${e instanceof Error ? e.message : String(e)}` });
    }
  });
}

/** Tệp test của người học: `tj.tepTest` (nếu khai) hoặc mọi `*.test.js` / `*.spec.js` trong bài. */
export function timTepTest(tj: TestsJson, files: TepMap): string[] {
  const khai = Array.isArray(tj.tepTest) ? (tj.tepTest as unknown[]).map(String) : typeof tj.tepTest === 'string' ? [tj.tepTest] : null;
  const ds = khai ? khai.filter((t) => files[t] != null) : Object.keys(files).filter((t) => /\.(test|spec)\.m?js$/.test(t));
  return ds.sort();
}

/** Tệp cho một lượt: tệp người học (TRỪ bản sao code cần test — luôn lấy của đề) + `ma` (impl hoặc đột biến). */
export function tepChoLuot(files: TepMap, impl: TepMap, ma: TepMap): TepMap {
  const out: TepMap = {};
  for (const [t, c] of Object.entries(files)) if (!(t in impl)) out[t] = c;
  return { ...out, ...impl, ...ma };
}

const ngan = (s: string, n = 240) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);

/** Kết quả kiểm #0 (bộ test với code đúng) từ một lượt. */
export function ketQuaXanh(l: LuotChay, toiThieu: number, coTep: boolean, timeoutMs: number): Omit<KetQuaKiem, 'i'> {
  if (!coTep) return { dat: false, thay: 'Không thấy tệp test nào (*.test.js) — viết test vào tệp .test.js của đề.' };
  if (l.quaGio) return { dat: false, thay: `Quá ${timeoutMs / 1000}s với code ĐÚNG — vòng lặp vô hạn trong test?`, ms: l.ms };
  if (l.loiNap) return { dat: false, thay: `Không nạp được tệp test: ${ngan(l.loiNap)}`, ms: l.ms };
  const truot = l.tests.filter((t) => !t.dat);
  if (truot.length) {
    const ds = truot.slice(0, 3).map((t) => `✗ ${t.ten} — ${t.loi ?? 'failed'}`).join(' · ');
    return { dat: false, thay: ngan(`Test của bạn SAI với code đúng (code đúng không có lỗi — sửa test): ${truot.length}/${l.tests.length} đỏ. ${ds}`, 400), ms: l.ms };
  }
  if (l.tests.length < toiThieu) return { dat: false, thay: `Có ${l.tests.length} test, cần ít nhất ${toiThieu} (mỗi hàng it.each tính là một test; test không có expect bị tính đỏ).`, ms: l.ms };
  return { dat: true, thay: `${l.tests.length} test — tất cả xanh với code đúng`, ms: l.ms };
}

/** Kết quả một kiểm 'vo-hai' (thay đổi vô hại — bộ test phải VẪN xanh). */
export function ketQuaVoHai(l: LuotChay): Omit<KetQuaKiem, 'i'> {
  if (l.quaGio) return { dat: false, thay: 'Quá giờ với một thay đổi VÔ HẠI — test của bạn phụ thuộc vào cách viết code?', ms: l.ms };
  if (l.loiNap) return { dat: false, thay: `Không nạp được tệp test với thay đổi vô hại: ${ngan(l.loiNap, 200)}`, ms: l.ms };
  const do1 = l.tests.filter((t) => !t.dat);
  if (do1.length) return { dat: false, thay: ngan(`Test của bạn ĐỎ với một thay đổi VÔ HẠI (hành vi không đổi) — test quá chi tiết, khoá vào cách cài đặt: ✗ ${do1[0].ten} — ${do1[0].loi ?? ''}`, 400), ms: l.ms };
  return { dat: true, thay: `Vẫn xanh (${l.tests.length} test) — test của bạn kiểm hành vi, không khoá vào cách viết`, ms: l.ms };
}

/** Kết quả một kiểm đột biến từ một lượt (bộ test đã xanh với code đúng). */
export function ketQuaDotBien(l: LuotChay, goiY: string | null): Omit<KetQuaKiem, 'i'> {
  if (l.quaGio) return { dat: true, thay: 'Đã diệt — quá giờ (đột biến gây vòng lặp vô hạn, tính là diệt)', ms: l.ms };
  if (l.loiNap) return { dat: true, thay: `Đã diệt — tệp test không nạp được với đột biến: ${ngan(l.loiNap, 160)}`, ms: l.ms };
  const do1 = l.tests.find((t) => !t.dat);
  if (do1) return { dat: true, thay: ngan(`Đã diệt — đỏ ở: ${do1.ten} — ${do1.loi ?? ''}`), ms: l.ms };
  return { dat: false, thay: `Còn sống — cả ${l.tests.length} test vẫn xanh với đột biến này.${goiY ? ` Gợi ý: ${goiY}` : ''}`, ms: l.ms };
}

export type ChayLuot = typeof chayLuot;

/** Tuỳ chọn bộ chạy khai trong đề. */
export function tuyChonTu(tj: TestsJson): TuyChonChay {
  const o: TuyChonChay = {};
  if (tj.thuVien && typeof tj.thuVien === 'object') o.thuVien = tj.thuVien as TepMap;
  if (Number(tj.xaoTron)) o.xaoTron = Number(tj.xaoTron);
  if (Number(tj.lapLai)) o.lapLai = Number(tj.lapLai);
  if (tj.restoreMocks === false) o.restoreMocks = false;
  return o;
}

/** `chay` thay được (test đơn vị / bộ xuất Node chạy bằng `vm` thay cho Worker). */
export async function chamMutation(tj: TestsJson, kiem: Kiem[], files: TepMap, onTung?: (r: KetQuaKiem) => void, chay: ChayLuot = chayLuot): Promise<KetQuaKiem[]> {
  const impl = (tj.impl && typeof tj.impl === 'object' ? tj.impl : {}) as TepMap;
  const timeoutMs = Math.min(TRAN_MS, Math.max(500, Number(tj.timeoutMs) || MAC_DINH_MS));
  const tranTestMs = Number(tj.tranTestMs) || undefined;
  const toiThieu = Math.max(1, Number(tj.toiThieuTest) || 1);
  const tepTest = timTepTest(tj, files);
  const tuy = tuyChonTu(tj);

  let xanh: Omit<KetQuaKiem, 'i'> | null = null;
  let anhChup: TepMap = {};
  const layXanh = async () => {
    if (xanh) return xanh;
    const l: LuotChay = tepTest.length ? await chay(tepChoLuot(files, impl, {}), tepTest, timeoutMs, tranTestMs, tuy) : { tests: [], ms: 0 };
    xanh = ketQuaXanh(l, toiThieu, tepTest.length > 0, timeoutMs);
    anhChup = l.anhChup ?? {};
    return xanh;
  };

  const out: KetQuaKiem[] = [];
  for (const [idx, k] of kiem.entries()) {
    const i = typeof k.i === 'number' ? k.i : idx;
    let r: Omit<KetQuaKiem, 'i'>;
    if (k.kiem === 'xanh') {
      r = await layXanh();
    } else if (k.kiem === 'diet') {
      const x = await layXanh();
      if (!x.dat) r = { dat: false, thay: 'Chưa chấm — bộ test phải XANH với code đúng trước (xem kiểm "code đúng").' };
      else {
        const ma = (k.ma && typeof k.ma === 'object' ? k.ma : {}) as TepMap;
        const l = await chay({ ...tepChoLuot(files, impl, ma), ...anhChup }, tepTest, timeoutMs, tranTestMs, tuy);
        r = ketQuaDotBien(l, typeof k.goiY === 'string' ? k.goiY : null);
      }
    } else if (k.kiem === 'vo-hai') {
      const x = await layXanh();
      if (!x.dat) r = { dat: false, thay: 'Chưa chấm — bộ test phải XANH với code đúng trước.' };
      else {
        const ma = (k.ma && typeof k.ma === 'object' ? k.ma : {}) as TepMap;
        r = ketQuaVoHai(await chay({ ...tepChoLuot(files, impl, ma), ...anhChup }, tepTest, timeoutMs, tranTestMs, tuy));
      }
    } else {
      r = { dat: false, thay: `kiểm lạ "${String(k.kiem)}" trong đề mutation` };
    }
    const kq: KetQuaKiem = { ...r, i, an: !!k.an, nhom: (k.nhom as string) ?? null, moTa: k.moTa };
    out.push(kq);
    onTung?.(kq);
  }
  return out;
}
