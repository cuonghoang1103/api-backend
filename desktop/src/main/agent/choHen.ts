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
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { xemDauRaNen } from './lenhNen';
import { docCron, lanKe, type Cron } from './cron';

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
  /** Đợt 4: biểu thức cron 5 trường (thay cho "mỗi `phut` phút"). */
  cron?: string;
  /** Đợt 4: phiên trên đĩa của cuộc — để hẹn SỐNG QUA LÚC TẮT (mở lại thì gắn về đúng việc). */
  phienId?: string;
  goc?: string | null;
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

/*
 * ── ĐỢT 4: HẸN SỐNG QUA LÚC TẮT ──
 * Mỗi lần đổi ⇒ ghi `agent-hen.json` (thư mục dữ liệu: userData của app,
 * `~/.cuongmini/data` của CLI, kho riêng của extension). Mỗi mục mang PID chủ:
 * hai CLI dùng chung thư mục thì mỗi bên chỉ giữ hẹn của mình; mở lại sau khi
 * tắt ⇒ mục của PID đã chết được NHẬN LẠI — đến hạn rồi thì vào danh sách
 * "đã lỡ" (hỏi người dùng chạy bù hay bỏ), chưa đến hạn thì lên lịch lại.
 * Hẹn chưa gắn cuộc (`cuocId === ''`) ⇒ `boChay` tự mở cuộc từ `phienId`.
 */
let noiLuu: string | null = null;
let timPhien: (cuocId: string) => { phienId: string; goc: string | null } | null = () => null;
const daLo: Hen[] = [];
interface MucLuu extends Hen { pid: number }

/** Bật lưu đĩa (gọi một lần lúc đăng ký IPC). `null` = tắt (test). */
export function datNoiLuuHen(file: string | null): void { noiLuu = file; }
/** `loop.ts` cho biết phiên trên đĩa của một cuộc — để ghi kèm hẹn. */
export function datBoTimPhien(f: (cuocId: string) => { phienId: string; goc: string | null } | null): void { timPhien = f; }

function conSong(pid: number): boolean {
  if (pid === process.pid) return true;
  try { process.kill(pid, 0); return true; } catch (e) { return (e as NodeJS.ErrnoException).code === 'EPERM'; }
}

function docFile(): MucLuu[] {
  if (!noiLuu) return [];
  try {
    const j = JSON.parse(readFileSync(noiLuu, 'utf8')) as { hen?: unknown };
    return Array.isArray(j.hen) ? (j.hen as MucLuu[]).filter((h) => h && typeof h.id === 'string' && typeof h.luc === 'number') : [];
  } catch { return []; }
}

function luuDia(): void {
  if (!noiLuu) return;
  try {
    const cuaKhac = docFile().filter((h) => h.pid !== process.pid && conSong(h.pid));
    const cuaToi: MucLuu[] = [...[...henCua.values()].flat(), ...daLo].map((h) => {
      const p = h.cuocId ? timPhien(h.cuocId) : null;
      return { ...h, ...(p ? { phienId: p.phienId, goc: p.goc } : {}), pid: process.pid };
    }).filter((h) => h.phienId);
    mkdirSync(path.dirname(noiLuu), { recursive: true, mode: 0o700 });
    const tam = `${noiLuu}.${process.pid}.tmp`;
    writeFileSync(tam, JSON.stringify({ hen: [...cuaKhac, ...cuaToi] }, null, 1), { mode: 0o600 });
    renameSync(tam, noiLuu);
  } catch { /* ghi đĩa hỏng không được làm hỏng hẹn đang chạy */ }
}

function baoVaLuu(cuocId: string): void { if (cuocId) bao(cuocId); luuDia(); }

/**
 * Nạp hẹn đã lưu của các tiến trình đã tắt. Trả số hẹn LỠ (đến hạn trong lúc
 * tắt) và số hẹn được lên lịch lại. Gọi một lần lúc khởi động.
 */
export function napHenDaLuu(bayGio = Date.now()): { lo: number; lenLich: number } {
  let lo = 0; let lich = 0;
  for (const m of docFile()) {
    if (conSong(m.pid)) continue;
    const { pid: _pid, ...h0 } = m;
    const id = `h${++demHen}`;
    const h: Hen = { ...h0, id, cuocId: '' };
    if (h.luc <= bayGio) { daLo.push(h); lo++; continue; }
    themVaoCuoc(h);
    lenLich(h, h.luc - bayGio);
    lich++;
  }
  luuDia();
  return { lo, lenLich: lich };
}

/** Hẹn ĐÃ LỠ trong lúc app/CLI tắt — chờ người dùng quyết. */
export function dsHenLo(): Hen[] { return [...daLo]; }

/** Chạy bù (`chay`) hoặc bỏ (`bo`) mọi hẹn đã lỡ. Trả số đã xử lý. */
export function xuLyHenLo(cach: 'chay' | 'bo'): number {
  const ds = daLo.splice(0, daLo.length);
  if (cach === 'chay') {
    for (const h of ds) { themVaoCuoc(h); lenLich(h, 0); }
  }
  luuDia();
  return ds.length;
}

/** Cuộc vừa mở phiên `phienId` ⇒ gắn các hẹn chưa có chủ của phiên đó vào cuộc. */
export function ganHenChoCuoc(cuocId: string, phienId: string): number {
  const tho = henCua.get('') ?? [];
  const cua = tho.filter((h) => h.phienId === phienId);
  if (!cua.length) return 0;
  henCua.set('', tho.filter((h) => h.phienId !== phienId));
  if (!henCua.get('')!.length) henCua.delete('');
  for (const h of cua) h.cuocId = cuocId;
  henCua.set(cuocId, [...(henCua.get(cuocId) ?? []), ...cua]);
  baoVaLuu(cuocId);
  return cua.length;
}

/** Có hẹn nào đang chờ không (desktop: còn hẹn ⇒ chạy nền khi đóng cửa sổ). */
export function soHenDangCho(): number { return [...henCua.values()].reduce((a, d) => a + d.length, 0); }

function themVaoCuoc(h: Hen): void { henCua.set(h.cuocId, [...(henCua.get(h.cuocId) ?? []), h]); }

export function dsHen(cuocId: string): Hen[] { return [...(henCua.get(cuocId) ?? [])]; }

function lenLich(h: Hen, sauMs: number): void {
  const cu = dongHoHen.get(h.id);
  if (cu) clearTimeout(cu);
  // setTimeout tràn ở ~24,8 ngày ⇒ chia nhịp (hẹn cron hằng tháng).
  const cho = Math.max(0, Math.min(sauMs, 2 ** 31 - 1));
  const t = setTimeout(() => { if (cho < sauMs) lenLich(h, sauMs - cho); else void thuc(h.id); }, cho);
  (t as unknown as { unref?: () => void }).unref?.();
  dongHoHen.set(h.id, t);
}

function timHen(id: string): Hen | undefined {
  for (const ds of henCua.values()) { const h = ds.find((x) => x.id === id); if (h) return h; }
  return undefined;
}

async function thuc(id: string): Promise<void> {
  const h = timHen(id);
  if (!h) return;
  let kq: 'chay' | 'hoan' = 'hoan';
  try { kq = await boChay(h); } catch { kq = 'hoan'; }
  if (kq === 'hoan') { h.luc = Date.now() + 15_000; lenLich(h, 15_000); baoVaLuu(h.cuocId); return; }
  h.conLai -= 1;
  const ke = h.lap && h.conLai > 0 ? luotKe(h, Date.now()) : null;
  if (ke !== null) {
    h.luc = ke;
    lenLich(h, ke - Date.now());
  } else {
    xoaMotHen(h.cuocId, id);
  }
  baoVaLuu(h.cuocId);
}

function luotKe(h: Hen, tu: number): number | null {
  if (h.cron) { const c = docCron(h.cron); return typeof c === 'string' ? null : lanKe(c, tu); }
  return tu + h.phut * 60_000;
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
  const lyDo = typeof args.ly_do === 'string' ? args.ly_do.trim().slice(0, 500) : '';
  if (!lyDo) return 'thiếu "ly_do" — câu này sẽ là lời nhắc gửi lại cho chính bạn khi thức dậy.';
  const ds = henCua.get(cuocId) ?? [];
  if (ds.length >= TRAN_HEN_MOI_CUOC) return `đã có ${ds.length} hẹn ở cuộc này (trần ${TRAN_HEN_MOI_CUOC}). Huỷ bớt bằng huy_hen trước.`;
  const cronTho = typeof args.cron === 'string' ? args.cron.trim() : '';
  let cron: Cron | null = null;
  let phut = Number(args.phut);
  let luc: number;
  if (cronTho) {
    const c = docCron(cronTho);
    if (typeof c === 'string') return c;
    const ke = lanKe(c, Date.now());
    if (ke === null) return 'biểu thức cron không có lần chạy nào trong 5 năm tới.';
    cron = c; luc = ke; phut = Math.max(1, Math.round((ke - Date.now()) / 60_000));
  } else {
    if (!Number.isFinite(phut) || phut < 1 || phut > 1440) return '"phut" phải từ 1 tới 1440 (hoặc dùng "cron").';
    luc = Date.now() + phut * 60_000;
  }
  const lap = cron !== null || args.lap === true;
  const soLan = lap ? Math.min(TRAN_LAP, Math.max(cron ? 1 : 2, Math.round(Number(args.so_lan) || 10))) : 1;
  const p = timPhien(cuocId);
  const h: Hen = {
    id: `h${++demHen}`, cuocId, lyDo, luc, phut, lap, conLai: soLan,
    ...(cron ? { cron: cron.nguon } : {}),
    ...(p ? { phienId: p.phienId, goc: p.goc } : {}),
  };
  henCua.set(cuocId, [...ds, h]);
  lenLich(h, luc - Date.now());
  baoVaLuu(cuocId);
  return h;
}

/** Huỷ một hẹn (`id`) hoặc mọi hẹn của cuộc. Trả số đã huỷ. */
export function huyHen(cuocId: string, id?: string): number {
  if (id) { const ok = xoaMotHen(cuocId, id); if (ok) baoVaLuu(cuocId); return ok ? 1 : 0; }
  const ds = henCua.get(cuocId) ?? [];
  for (const h of ds) xoaMotHen(cuocId, h.id);
  if (ds.length) baoVaLuu(cuocId);
  return ds.length;
}

/**
 * Đóng/xoá cuộc ⇒ bỏ chờ của nó. Hẹn: `giuHen` (đóng app/tab — hẹn đã có
 * phiên trên đĩa) ⇒ THÁO khỏi cuộc nhưng giữ (chạy được ở lần mở sau);
 * không ⇒ huỷ hẳn (người dùng xoá việc).
 */
export function donCuaCuoc(cuocId: string, giuHen = false): void {
  for (const c of [...dangCho.values()]) if (c.cuocId === cuocId) c.xong('boCho');
  if (giuHen) {
    const ds = (henCua.get(cuocId) ?? []).filter((h) => h.phienId);
    for (const h of henCua.get(cuocId) ?? []) if (!h.phienId) xoaMotHen(cuocId, h.id);
    henCua.delete(cuocId);
    for (const h of ds) { h.cuocId = ''; themVaoCuoc(h); }
    luuDia();
    return;
  }
  huyHen(cuocId);
}

/** Câu gửi vào cuộc khi hẹn tới giờ. */
export function cauDanhThuc(h: Hen, bayGio = new Date()): string {
  const gio = `${String(bayGio.getHours()).padStart(2, '0')}:${String(bayGio.getMinutes()).padStart(2, '0')}`;
  const lap = h.lap && h.conLai > 1 ? ` Hẹn lặp ${h.cron ? `theo cron "${h.cron}"` : `mỗi ${h.phut} phút`}, còn ${h.conLai - 1} lần — xong việc thì gọi huy_hen {id:"${h.id}"} nếu không cần nữa.` : '';
  return `[Đánh thức — hẹn #${h.id} lúc ${gio}] ${h.lyDo}\n(Lượt này do APP tự gửi theo lời hẹn của chính bạn, không phải người dùng vừa gõ. Làm đúng việc đã hẹn, báo ngắn rồi dừng.${lap})`;
}

/** Chỉ cho test. */
export function _datLai(): void {
  for (const t of dongHoHen.values()) clearTimeout(t);
  dongHoHen.clear(); henCua.clear(); dangCho.clear(); demHen = 0; demCho = 0; daLo.length = 0;
  bao = () => {}; boChay = async () => 'hoan'; noiLuu = null; timPhien = () => null;
}
