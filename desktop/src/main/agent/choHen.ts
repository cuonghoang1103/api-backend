/**
 * ============================================================
 * CHỜ / THEO DÕI / HẸN GIỜ — `cho_doi`, `hen_goi_lai`, `huy_hen` (đợt 3, 18/10/2026)
 * ============================================================
 *
 * Trước đợt 3 agent chỉ có `chay_lenh_nen` + `doc_dau_ra_nen`: muốn biết dev
 * server lên chưa thì nó phải tự hỏi lại — mỗi lần hỏi là một lượt gọi cổng
 * (tiền thật) chỉ để nghe "chưa có gì mới". Claude Code có Monitor/ScheduleWakeup.
 *
 * ─── HAI THỨ KHÁC NHAU ───
 * 1. `cho_doi` — CHỜ NGAY TRONG LƯỢT tới khi một điều kiện đạt (lệnh nền in ra
 *    mẫu X / kết thúc, file xuất hiện, URL trả 2xx, tiến trình chết, hoặc chỉ là
 *    N giây). Chạy ở APP giữa hai lần gọi máy chủ ⇒ KHÔNG giữ kết nối nào, KHÔNG
 *    tốn token khi chờ. Trần 15 phút; người dùng huỷ/kết thúc chờ sớm được.
 * 2. `hen_goi_lai` — HẸN quay lại sau N phút: lượt hiện tại kết thúc, app tự
 *    gửi một lượt "[Đánh thức] …" vào ĐÚNG cuộc này khi tới giờ (lặp được).
 *    Chỉ sống khi tiến trình còn mở (desktop/CLI/extension) — tắt là mất hẹn,
 *    và giao diện nói thẳng điều đó. Mỗi lần thức là một lượt tính tiền ⇒ trần
 *    3 hẹn/cuộc, lặp tối đa 50 lần, hiện trên màn hình kèm nút huỷ.
 */
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { xemDauRaNen } from './lenhNen';

export type DieuKien =
  | { loai: 'lenh_nen'; id: string; khop: RegExp | null }
  | { loai: 'file'; duong: string; hienThi: string }
  | { loai: 'url'; url: string }
  | { loai: 'tien_trinh'; pid: number }
  | { loai: 'thoi_gian' };

export interface TrangThaiCho { id: string; moTa: string; batDau: number; hetLuc: number }
export interface Hen {
  id: string; cuocId: string; lyDo: string;
  /** Lần thức KẾ TIẾP (ms epoch). */
  luc: number;
  phut: number; lap: boolean;
  /** Còn bao nhiêu lần thức (kể cả lần kế tiếp). */
  conLai: number;
}

export const TRAN_CHO_GIAY = 900;
export const CHO_MAC_DINH_GIAY = 120;
export const TRAN_HEN_MOI_CUOC = 3;
export const TRAN_LAP = 50;

// ─── đọc tham số ─────────────────────────────────────────────────

/** Tham số model gửi ⇒ điều kiện. Chuỗi = lỗi để model sửa. */
export function docDieuKien(args: Record<string, unknown>, goc: string | null): DieuKien | string {
  const loai = String(args.loai ?? 'thoi_gian');
  switch (loai) {
    case 'lenh_nen': {
      const id = typeof args.id === 'string' ? args.id.trim() : '';
      if (!id) return 'loai "lenh_nen" cần "id" (mã do chay_lenh_nen trả).';
      let khop: RegExp | null = null;
      if (typeof args.khop === 'string' && args.khop) {
        if (args.khop.length > 300) return '"khop" quá dài (trần 300 ký tự).';
        try { khop = new RegExp(args.khop, 'i'); } catch (e) { return `"khop" không phải regex hợp lệ: ${(e as Error).message}`; }
      }
      return { loai, id, khop };
    }
    case 'file': {
      const d = typeof args.duong === 'string' ? args.duong.trim() : '';
      if (!d) return 'loai "file" cần "duong".';
      if (!path.isAbsolute(d) && !goc) return 'chưa mở dự án ⇒ "duong" phải là đường dẫn tuyệt đối.';
      return { loai, duong: path.isAbsolute(d) ? d : path.resolve(goc!, d), hienThi: d };
    }
    case 'url': {
      const u = typeof args.url === 'string' ? args.url.trim() : '';
      if (!/^https?:\/\//i.test(u)) return 'loai "url" cần "url" bắt đầu bằng http:// hoặc https://.';
      return { loai, url: u.slice(0, 2000) };
    }
    case 'tien_trinh': {
      const pid = Number(args.pid);
      if (!Number.isInteger(pid) || pid <= 1) return 'loai "tien_trinh" cần "pid" (số nguyên > 1).';
      return { loai, pid };
    }
    case 'thoi_gian': return { loai };
    default: return `loai "${loai}" không có. Dùng: lenh_nen | file | url | tien_trinh | thoi_gian.`;
  }
}

export function moTaDieuKien(dk: DieuKien, giay: number): string {
  switch (dk.loai) {
    case 'lenh_nen': return dk.khop ? `lệnh nền ${dk.id} in ra /${dk.khop.source}/` : `lệnh nền ${dk.id} kết thúc`;
    case 'file': return `file ${dk.hienThi} xuất hiện`;
    case 'url': return `${dk.url} trả 2xx`;
    case 'tien_trinh': return `tiến trình ${dk.pid} kết thúc`;
    case 'thoi_gian': return `${giay} giây`;
  }
}

export function giayChoTu(args: Record<string, unknown>, dk: DieuKien): number {
  const g = Number(args.giay);
  const macDinh = dk.loai === 'thoi_gian' ? 30 : CHO_MAC_DINH_GIAY;
  return Number.isFinite(g) && g > 0 ? Math.min(TRAN_CHO_GIAY, Math.max(1, Math.round(g))) : macDinh;
}

// ─── CHỜ ─────────────────────────────────────────────────────────

interface DangCho extends TrangThaiCho { cuocId: string; xong: (cach: 'boCho' | 'xongNgay') => void }
const dangCho = new Map<string, DangCho>();
let demCho = 0;

let bao: (cuocId: string) => void = () => {};
/** ipc/agent.ts cắm vào: mỗi lần danh sách chờ/hẹn của một cuộc đổi ⇒ phát `henCho`. */
export function datBoBao(f: (cuocId: string) => void): void { bao = f; }

export function dsCho(cuocId: string): TrangThaiCho[] {
  return [...dangCho.values()].filter((c) => c.cuocId === cuocId)
    .map(({ id, moTa, batDau, hetLuc }) => ({ id, moTa, batDau, hetLuc }));
}

/** Người dùng bấm "Bỏ chờ" (agent nhận "người dùng huỷ") hoặc "Tiếp ngay" (coi như hết giờ, đi tiếp). */
export function huyCho(cuocId: string, id: string, cach: 'boCho' | 'xongNgay' = 'boCho'): boolean {
  const c = dangCho.get(id);
  if (!c || c.cuocId !== cuocId) return false;
  c.xong(cach);
  return true;
}

export interface KetQuaCho { dat: boolean; lyDo: 'dat' | 'hetGio' | 'huy' | 'boCho' | 'xongNgay'; chiTiet: string; giay: number }

async function kiemMotLan(dk: DieuKien, tuTong: number, signal: AbortSignal): Promise<{ dat: boolean; chiTiet?: string; dung?: string }> {
  switch (dk.loai) {
    case 'lenh_nen': {
      const r = xemDauRaNen(dk.id, tuTong);
      if (!r.ok) return { dat: false, dung: `không có lệnh nền "${dk.id}"` };
      if (dk.khop) {
        const dong = (r.moi ?? '').split('\n').find((d) => dk.khop!.test(d));
        if (dong !== undefined) return { dat: true, chiTiet: `dòng khớp: ${dong.trim().slice(0, 300)}` };
        if (!r.dangChay) return { dat: false, dung: `lệnh nền đã KẾT THÚC (mã thoát ${r.ma ?? 'bị giết'}) mà chưa in ra mẫu cần chờ. Đầu ra cuối:\n${(r.moi ?? '').slice(-1500)}` };
        return { dat: false };
      }
      return r.dangChay ? { dat: false } : { dat: true, chiTiet: `lệnh nền kết thúc, mã thoát ${r.ma ?? 'bị giết'}. Đầu ra cuối:\n${(r.moi ?? '').slice(-1500)}` };
    }
    case 'file':
      return await stat(dk.duong).then((s) => ({ dat: true, chiTiet: `${dk.hienThi} đã có (${s.size} byte)` }), () => ({ dat: false }));
    case 'url': {
      try {
        const r = await fetch(dk.url, { method: 'GET', redirect: 'manual', signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]) });
        void r.body?.cancel().catch(() => {});
        return r.status >= 200 && r.status < 300 ? { dat: true, chiTiet: `${dk.url} trả HTTP ${r.status}` } : { dat: false, chiTiet: `HTTP ${r.status}` };
      } catch { return { dat: false }; }
    }
    case 'tien_trinh':
      try { process.kill(dk.pid, 0); return { dat: false }; } catch (e) {
        // EPERM = tiến trình CÒN (của người khác) — chưa kết thúc.
        return (e as NodeJS.ErrnoException).code === 'EPERM' ? { dat: false } : { dat: true, chiTiet: `tiến trình ${dk.pid} đã kết thúc` };
      }
    case 'thoi_gian': return { dat: false };
  }
}

/**
 * Chờ tới khi điều kiện đạt / hết giờ / bị huỷ. KHÔNG ném.
 * `nhip` (ms) chỉ để test chạy nhanh.
 */
export async function choDieuKien(
  cuocId: string, dk: DieuKien, giay: number, signal: AbortSignal, nhip = 1000,
): Promise<KetQuaCho> {
  const id = `cho${++demCho}`;
  const batDau = Date.now();
  const hetLuc = batDau + giay * 1000;
  const tuTong = dk.loai === 'lenh_nen' ? (xemDauRaNen(dk.id).tong ?? 0) : 0;
  let cachNguoiDung: 'boCho' | 'xongNgay' | null = null;
  let danhThuc: (() => void) | null = null;
  dangCho.set(id, {
    id, cuocId, moTa: moTaDieuKien(dk, giay), batDau, hetLuc,
    xong: (cach) => { cachNguoiDung = cach; danhThuc?.(); },
  });
  bao(cuocId);
  const ngu = (ms: number): Promise<void> => new Promise((ok) => {
    const h = setTimeout(() => { danhThuc = null; ok(); }, ms);
    danhThuc = () => { clearTimeout(h); danhThuc = null; ok(); };
    signal.addEventListener('abort', () => danhThuc?.(), { once: true });
  });
  const tg = (): number => Math.round((Date.now() - batDau) / 1000);
  let lanCuoi = '';
  try {
    for (let lan = 0; ; lan++) {
      if (signal.aborted) return { dat: false, lyDo: 'huy', chiTiet: 'người dùng bấm Dừng', giay: tg() };
      if (cachNguoiDung) return { dat: false, lyDo: cachNguoiDung, chiTiet: '', giay: tg() };
      // URL: nhịp thưa hơn (3s) — đừng dội server dev của người dùng.
      if (dk.loai !== 'url' || lan % 3 === 0) {
        const k = await kiemMotLan(dk, tuTong, signal);
        if (k.dat) return { dat: true, lyDo: 'dat', chiTiet: k.chiTiet ?? '', giay: tg() };
        if (k.dung) return { dat: false, lyDo: 'hetGio', chiTiet: k.dung, giay: tg() };
        if (k.chiTiet) lanCuoi = k.chiTiet;
      }
      if (Date.now() >= hetLuc) {
        if (dk.loai === 'thoi_gian') return { dat: true, lyDo: 'dat', chiTiet: `đã chờ ${giay} giây`, giay: tg() };
        const duoi = dk.loai === 'lenh_nen' ? (xemDauRaNen(dk.id, tuTong).moi ?? '').slice(-1500) : lanCuoi;
        return { dat: false, lyDo: 'hetGio', chiTiet: duoi, giay: tg() };
      }
      await ngu(Math.min(nhip, Math.max(0, hetLuc - Date.now())));
    }
  } finally {
    dangCho.delete(id);
    bao(cuocId);
  }
}

/** Chữ đưa lại cho model. */
export function moTaKetQuaCho(dk: DieuKien, giay: number, k: KetQuaCho): string {
  const ve = moTaDieuKien(dk, giay);
  switch (k.lyDo) {
    case 'dat': return `ĐIỀU KIỆN ĐÃ ĐẠT sau ${k.giay}s (${ve}).${k.chiTiet ? `\n${k.chiTiet}` : ''}`;
    case 'hetGio': return `CHƯA ĐẠT sau ${k.giay}s (${ve}).${k.chiTiet ? `\n${k.chiTiet}` : ''}\nĐọc chẩn đoán rồi quyết định — đừng chờ lại y hệt nếu lệnh đã chết.`;
    case 'huy': return 'Việc chờ bị huỷ vì người dùng bấm Dừng.';
    case 'boCho': return `NGƯỜI DÙNG BỎ CHỜ sau ${k.giay}s (${ve}). Đừng chờ lại cùng điều kiện — hỏi họ hoặc làm hướng khác.`;
    case 'xongNgay': return `Người dùng bấm "Tiếp ngay" sau ${k.giay}s (điều kiện chưa chắc đã đạt: ${ve}). Kiểm trạng thái thật rồi đi tiếp.`;
  }
}

// ─── HẸN ─────────────────────────────────────────────────────────

const henCua = new Map<string, Hen[]>();
const dongHoHen = new Map<string, ReturnType<typeof setTimeout>>();
let demHen = 0;
/** `chay`: đã gửi lượt thức. `hoan`: cuộc đang bận/không có giao diện ⇒ thử lại sau 15s. */
let boChay: (hen: Hen) => Promise<'chay' | 'hoan'> = async () => 'hoan';
export function datBoChayHen(f: (hen: Hen) => Promise<'chay' | 'hoan'>): void { boChay = f; }

export function dsHen(cuocId: string): Hen[] { return [...(henCua.get(cuocId) ?? [])]; }

function lenLich(h: Hen, sauMs: number): void {
  const cu = dongHoHen.get(h.id);
  if (cu) clearTimeout(cu);
  const t = setTimeout(() => { void thuc(h.cuocId, h.id); }, Math.max(0, sauMs));
  (t as unknown as { unref?: () => void }).unref?.();
  dongHoHen.set(h.id, t);
}

async function thuc(cuocId: string, id: string): Promise<void> {
  const h = (henCua.get(cuocId) ?? []).find((x) => x.id === id);
  if (!h) return;
  let kq: 'chay' | 'hoan' = 'hoan';
  try { kq = await boChay(h); } catch { kq = 'hoan'; }
  if (kq === 'hoan') { h.luc = Date.now() + 15_000; lenLich(h, 15_000); bao(cuocId); return; }
  h.conLai -= 1;
  if (h.lap && h.conLai > 0) {
    h.luc = Date.now() + h.phut * 60_000;
    lenLich(h, h.phut * 60_000);
  } else {
    xoaMotHen(cuocId, id);
  }
  bao(cuocId);
}

function xoaMotHen(cuocId: string, id: string): boolean {
  const ds = henCua.get(cuocId) ?? [];
  const con = ds.filter((x) => x.id !== id);
  if (con.length === ds.length) return false;
  if (con.length) henCua.set(cuocId, con); else henCua.delete(cuocId);
  const t = dongHoHen.get(id);
  if (t) clearTimeout(t);
  dongHoHen.delete(id);
  return true;
}

export function datHen(cuocId: string, args: Record<string, unknown>): Hen | string {
  const phut = Number(args.phut);
  if (!Number.isFinite(phut) || phut < 1 || phut > 1440) return '"phut" phải từ 1 tới 1440.';
  const lyDo = typeof args.ly_do === 'string' ? args.ly_do.trim().slice(0, 500) : '';
  if (!lyDo) return 'thiếu "ly_do" — câu này sẽ là lời nhắc gửi lại cho chính bạn khi thức dậy.';
  const ds = henCua.get(cuocId) ?? [];
  if (ds.length >= TRAN_HEN_MOI_CUOC) return `đã có ${ds.length} hẹn ở cuộc này (trần ${TRAN_HEN_MOI_CUOC}). Huỷ bớt bằng huy_hen trước.`;
  const lap = args.lap === true;
  const soLan = lap ? Math.min(TRAN_LAP, Math.max(2, Math.round(Number(args.so_lan) || 10))) : 1;
  const h: Hen = { id: `h${++demHen}`, cuocId, lyDo, luc: Date.now() + phut * 60_000, phut, lap, conLai: soLan };
  henCua.set(cuocId, [...ds, h]);
  lenLich(h, phut * 60_000);
  bao(cuocId);
  return h;
}

/** Huỷ một hẹn (`id`) hoặc mọi hẹn của cuộc. Trả số đã huỷ. */
export function huyHen(cuocId: string, id?: string): number {
  if (id) { const ok = xoaMotHen(cuocId, id); if (ok) bao(cuocId); return ok ? 1 : 0; }
  const ds = henCua.get(cuocId) ?? [];
  for (const h of ds) xoaMotHen(cuocId, h.id);
  if (ds.length) bao(cuocId);
  return ds.length;
}

/** Đóng/xoá cuộc ⇒ bỏ hết chờ + hẹn của nó. */
export function donCuaCuoc(cuocId: string): void {
  for (const c of [...dangCho.values()]) if (c.cuocId === cuocId) c.xong('boCho');
  huyHen(cuocId);
}

/** Câu gửi vào cuộc khi hẹn tới giờ. */
export function cauDanhThuc(h: Hen, bayGio = new Date()): string {
  const gio = `${String(bayGio.getHours()).padStart(2, '0')}:${String(bayGio.getMinutes()).padStart(2, '0')}`;
  const lap = h.lap && h.conLai > 1 ? ` Hẹn lặp mỗi ${h.phut} phút, còn ${h.conLai - 1} lần — xong việc thì gọi huy_hen {id:"${h.id}"} nếu không cần nữa.` : '';
  return `[Đánh thức — hẹn #${h.id} lúc ${gio}] ${h.lyDo}\n(Lượt này do APP tự gửi theo lời hẹn của chính bạn, không phải người dùng vừa gõ. Làm đúng việc đã hẹn, báo ngắn rồi dừng.${lap})`;
}

/** Chỉ cho test. */
export function _datLai(): void {
  for (const t of dongHoHen.values()) clearTimeout(t);
  dongHoHen.clear(); henCua.clear(); dangCho.clear(); demHen = 0; demCho = 0;
  bao = () => {}; boChay = async () => 'hoan';
}
