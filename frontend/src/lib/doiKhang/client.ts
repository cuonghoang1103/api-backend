'use client';

/**
 * ĐỐI KHÁNG — lớp bọc socket + REST cho giao diện (05/10/2026). Đặc tả: docs/doi-khang-spec.md §2–3.
 *
 * Khớp máy chủ thật `src/socket/doiKhang.socket.ts` (hàm `dto` là chuẩn của PhongDTO). Sự kiện có ack
 * (`dk:tao/vao/moi/ghep/them-bot/nuoc/ban-online`) chờ tối đa 6 giây (`socket.timeout(6000)`); các
 * sự kiện còn lại máy chủ không ack ⇒ gửi xong là trả `{ ok: true }`, kết quả tới qua `dk:phong`.
 * Không hàm nào ném. `nghe(ten, fn)` gắn listener và trả hàm huỷ (gọi được cả khi socket chưa nối
 * xong). Dùng `connectSocket()` nên chạy được cả web lẫn app desktop (`datNguonSocket`).
 */
import type { Socket } from 'socket.io-client';
import { connectSocket } from '@/lib/socket';
import api from '@/lib/api';
import type { KetQua, MaTro, CapDoBot } from './luat';

// ─── Kiểu theo đặc tả ─────────────────────────────────────────────────────────
export interface GheDTO {
  userId: number | null;
  ten: string;
  avatar: string | null;
  elo?: number | null;
  bot?: CapDoBot;
  online: boolean;
  sanSang: boolean;
  taiDau?: boolean;
}
export interface VanDTO {
  nhin: unknown;
  soNuoc: number;
  /** Máy chủ: `{ ghe, nuoc, moTa }` của nước cuối. */
  nuocCuoi: { ghe: number; nuoc: unknown; moTa: string } | null;
  /** Ghế tới lượt; -1 khi không đang đánh. */
  luot: number;
  /** Mô tả từng nước (lịch sử). */
  lichSu?: string[];
}
export interface PhongDTO {
  maPhong: string;
  tro: MaTro;
  trangThai: 'cho' | 'dang-danh' | 'xong';
  chuId?: number;
  rieng?: boolean;
  ghe: GheDTO[];
  nguoiXem: number;
  thoiGian: { phut: number; congGiay: number };
  /** ms còn lại mỗi ghế, tính tại mốc `dongHoLuc` (giờ máy chủ). */
  dongHo: number[];
  dongHoLuc: number;
  tiSo: number[];
  van: VanDTO | null;
  ketQua: KetQua | null;
  /** Elo +/− theo ghế — tới một nhịp SAU khi ván xong (máy chủ ghi DB xong mới gửi). */
  doiElo?: number[] | null;
  /** Ghế đang xin hoà, hoặc null. */
  xinHoa?: number | null;
  gheCuaToi: number | null;
  /** Date.now() của máy chủ lúc gửi — để bù lệch đồng hồ. */
  gioMayChu?: number;
}
export interface Ack {
  ok: boolean;
  loi?: string;
  phong?: PhongDTO;
  maPhong?: string;
  [k: string]: unknown;
}
export interface NguoiMoi {
  id: number;
  ten: string;
  avatar: string | null;
}
export interface LoiMoiDen {
  maPhong: string;
  tro: MaTro;
  tu: NguoiMoi;
}
/** Dữ liệu `dk:nuoc` — đặc tả chỉ nói "nước vừa đi + đồng hồ", nên đọc phòng thủ. */
export interface SuKienNuoc {
  maPhong?: string;
  nuoc: unknown;
  ghe?: number;
  soNuoc?: number;
  moTa?: string;
  dongHo?: number[];
  dongHoLuc?: number;
  van?: VanDTO;
}
export interface SuKienKetThuc {
  maPhong?: string;
  ketQua: KetQua;
  /** Elo thay đổi — máy chủ có thể gửi theo ghế (mảng) hoặc theo userId (object). */
  elo?: number[] | Record<string, number>;
  doiElo?: number[] | Record<string, number>;
  phong?: PhongDTO;
}
export interface SuKienChat {
  maPhong?: string;
  ghe?: number | null;
  userId?: number;
  ten?: string;
  text: string;
  luc?: number;
}
export interface SuKienCamXuc {
  maPhong?: string;
  ghe?: number | null;
  userId?: number;
  emoji: string;
}

/** Sự kiện máy chủ → client. Máy chủ hiện phát mọi thay đổi ván qua `dk:phong` (dk:nuoc/dk:ket-thuc giữ để tương thích). */
export interface SuKienMayChu {
  'dk:phong': PhongDTO;
  'dk:nuoc': SuKienNuoc;
  'dk:ket-thuc': SuKienKetThuc;
  'dk:loi-moi': LoiMoiDen;
  'dk:chat': SuKienChat;
  'dk:cam-xuc': SuKienCamXuc;
  'dk:ghep-xong': { maPhong: string; tro?: MaTro; phong?: PhongDTO };
  'dk:dong': { maPhong: string };
  'dk:tu-choi': { maPhong: string; userId: number; ten: string };
}

// ─── Socket ──────────────────────────────────────────────────────────────────
const HET_GIO = 6000;

async function guiAck(ten: string, duLieu: unknown): Promise<Ack> {
  let s: Socket;
  try {
    s = await connectSocket();
  } catch {
    return { ok: false, loi: 'Chưa nối được máy chủ realtime' };
  }
  return new Promise<Ack>((resolve) => {
    try {
      s.timeout(HET_GIO).emit(ten, duLieu, (err: Error | null, res: Ack | undefined) => {
        if (err) resolve({ ok: false, loi: 'Máy chủ không trả lời (quá 6 giây)' });
        else if (!res || typeof res !== 'object') resolve({ ok: false, loi: 'Phản hồi lạ từ máy chủ' });
        else resolve(res);
      });
    } catch {
      resolve({ ok: false, loi: 'Không gửi được' });
    }
  });
}

/** Sự kiện không ack: gửi xong là xong. */
async function gui(ten: string, duLieu: unknown): Promise<Ack> {
  try {
    const s = await connectSocket();
    s.emit(ten, duLieu);
    return { ok: true };
  } catch {
    return { ok: false, loi: 'Chưa nối được máy chủ realtime' };
  }
}

export const taoPhong = (d: { tro: MaTro; thoiGian: { phut: number; congGiay: number }; rieng?: boolean; soGhe?: number }) =>
  guiAck('dk:tao', d);
export const vaoPhong = (maPhong: string) => guiAck('dk:vao', { maPhong });
export const roiPhong = (maPhong: string) => gui('dk:roi', { maPhong });
export const moi = (maPhong: string, userId: number) => guiAck('dk:moi', { maPhong, userId });
export const traLoiMoi = (maPhong: string, dongY: boolean) => gui('dk:tra-loi-moi', { maPhong, dongY });
/** Ack `{ ok, dangCho: true }` = đang chờ (đối thủ tới thì nhận `dk:ghep-xong`); `{ ok, maPhong }` = ghép xong ngay. */
export const ghep = (tro: MaTro) => guiAck('dk:ghep', { tro });
export const huyGhep = (tro: MaTro) => gui('dk:huy-ghep', { tro });
/** Tiến lên: chủ phòng cho máy ngồi ghế trống (không truyền ghế ⇒ máy chủ tự chọn / thêm ghế). */
export const themBot = (maPhong: string, capDo: CapDoBot, ghe?: number) =>
  guiAck('dk:them-bot', ghe === undefined ? { maPhong, capDo } : { maPhong, capDo, ghe });
export const boBot = (maPhong: string, ghe: number) => gui('dk:bo-bot', { maPhong, ghe });
export const sanSang = (maPhong: string, san = true) => gui('dk:san-sang', { maPhong, sanSang: san });
/** Ack lỗi có thể kèm `phong` mới (soNuoc lệch) — dùng để đồng bộ lại. */
export const diNuoc = (maPhong: string, nuoc: unknown, soNuoc: number) => guiAck('dk:nuoc', { maPhong, nuoc, soNuoc });
export const dauHang = (maPhong: string) => gui('dk:dau-hang', { maPhong });
export const xinHoa = (maPhong: string) => gui('dk:xin-hoa', { maPhong });
export const traLoiHoa = (maPhong: string, dongY: boolean) => gui('dk:tra-loi-hoa', { maPhong, dongY });
export const taiDau = (maPhong: string) => gui('dk:tai-dau', { maPhong });
export const chat = (maPhong: string, text: string) => gui('dk:chat', { maPhong, text: text.slice(0, 200) });
export const camXuc = (maPhong: string, emoji: string) => gui('dk:cam-xuc', { maPhong, emoji });

/** Gắn listener; trả hàm huỷ. An toàn khi gọi trước lúc socket nối xong. */
export function nghe<K extends keyof SuKienMayChu>(ten: K, fn: (d: SuKienMayChu[K]) => void): () => void {
  let huy = false;
  let s: Socket | null = null;
  const h = (d: SuKienMayChu[K]) => {
    if (!huy) fn(d);
  };
  connectSocket()
    .then((sk) => {
      if (huy) return;
      s = sk;
      sk.on(ten as string, h as (...a: unknown[]) => void);
    })
    .catch(() => undefined);
  return () => {
    huy = true;
    s?.off(ten as string, h as (...a: unknown[]) => void);
  };
}

/** Theo dõi trạng thái kết nối (để hiện băng "Đang nối lại…"). Gọi `fn(true)` khi nối lại được. */
export function ngheKetNoi(fn: (ketNoi: boolean) => void): () => void {
  let huy = false;
  let s: Socket | null = null;
  const len = () => !huy && fn(true);
  const xuong = () => !huy && fn(false);
  connectSocket()
    .then((sk) => {
      if (huy) return;
      s = sk;
      sk.on('connect', len);
      sk.on('disconnect', xuong);
      fn(sk.connected);
    })
    .catch(() => !huy && fn(false));
  return () => {
    huy = true;
    s?.off('connect', len);
    s?.off('disconnect', xuong);
  };
}

// ─── REST (đường /api/v1/doi-khang/…, bọc `{ success, data }`) ──────────────────
export interface DongXepHang {
  hang: number;
  userId: number;
  ten: string;
  avatar: string | null;
  elo: number;
  thang: number;
  thua: number;
  hoa: number;
  chuoi: number;
}
export interface HangCuaToi {
  tro: MaTro;
  elo: number;
  thang: number;
  thua: number;
  hoa: number;
  chuoi: number;
}
export interface VanCuaToi {
  id: number | string;
  tro: MaTro;
  ketQua: 'thang' | 'thua' | 'hoa' | null;
  lyDo: string;
  doiThu: string;
  coBot: boolean;
  soNuoc: number;
  luc: string | null;
}
export interface BanOnline {
  id: number;
  ten: string;
  avatar: string | null;
  online: boolean;
}

type Tho = Record<string, unknown>;
const boc = (x: unknown): unknown => {
  const d = (x as Tho | null)?.data;
  return d !== undefined ? d : x;
};
const mangTu = (d: unknown, khoa?: string): Tho[] => {
  if (Array.isArray(d)) return d as Tho[];
  const v = khoa ? (d as Tho | null)?.[khoa] : undefined;
  return Array.isArray(v) ? (v as Tho[]) : [];
};
const chu = (...v: unknown[]) => {
  for (const x of v) if (typeof x === 'string' && x.trim()) return x;
  return '';
};
const so = (v: unknown, mac = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : mac);

export async function layXepHang(tro: MaTro): Promise<DongXepHang[]> {
  try {
    const res = await api.get('/doi-khang/xep-hang', { params: { tro } });
    return mangTu(boc(res.data)).map((r, i) => ({
      hang: so(r.hang, i + 1),
      userId: so(r.userId),
      ten: chu(r.ten, r.username, 'Người chơi'),
      avatar: chu(r.avatar) || null,
      elo: so(r.elo, 1200),
      thang: so(r.thang),
      thua: so(r.thua),
      hoa: so(r.hoa),
      chuoi: so(r.chuoi),
    }));
  } catch {
    return [];
  }
}

export async function layCuaToi(): Promise<{ hang: HangCuaToi[]; van: VanCuaToi[] }> {
  try {
    const res = await api.get('/doi-khang/cua-toi');
    const d = boc(res.data);
    const hang = mangTu(d, 'hang').map((r) => ({
      tro: (chu(r.tro) || 'co-vua') as MaTro,
      elo: so(r.elo, 1200),
      thang: so(r.thang),
      thua: so(r.thua),
      hoa: so(r.hoa),
      chuoi: so(r.chuoi),
    }));
    const van = mangTu(d, 'van').map((r, i) => {
      const kq = chu(r.ketQua);
      const doi = Array.isArray(r.doiThu) ? (r.doiThu as unknown[]).filter((x) => typeof x === 'string').join(', ') : chu(r.doiThu);
      return {
        id: (r.id as number) ?? i,
        tro: (chu(r.tro) || 'co-vua') as MaTro,
        ketQua: kq === 'thang' || kq === 'thua' || kq === 'hoa' ? kq : null,
        lyDo: chu(r.lyDo),
        doiThu: doi || 'Đối thủ',
        coBot: !!r.coBot,
        soNuoc: so(r.soNuoc),
        luc: chu(r.ketThuc, r.batDau) || null,
      } as VanCuaToi;
    });
    return { hang, van };
  } catch {
    return { hang: [], van: [] };
  }
}

export async function layBanOnline(): Promise<BanOnline[]> {
  try {
    const res = await api.get('/doi-khang/ban-online');
    return mangTu(boc(res.data)).map((r) => ({
      id: so(r.userId ?? r.id),
      ten: chu(r.ten, r.username, 'Bạn'),
      avatar: chu(r.avatar) || null,
      online: !!r.online,
    }));
  } catch {
    return [];
  }
}
