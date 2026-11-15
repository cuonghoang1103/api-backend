/**
 * CT Language — TRÒ CHƠI (khung game dùng chung, 16/11/2026): phần THUẦN (không CSDL) — luật điểm của từng game,
 * kiểm điểm gửi lên có hợp lý không, kiểm bộ đề thách đấu, sinh mã thách đấu, mốc "tuần này".
 *
 * ➕ THÊM GAME MỚI: thêm một mục vào `GAME_CTL` (mã trùng `MoTaGameCTL.ma` bên app — `Modules/TroChoi/Khung/GameCTL.swift`).
 * `diemMoiCau` = điểm TỐI ĐA một câu đúng có thể ăn (gồm mọi thưởng combo/độ cao); `cauMoiGiay` = trần số câu đúng mỗi
 * giây một người thật làm được (lỏng tay — chỉ để chặn số bịa, không phải để bắt người giỏi).
 */
import { randomInt } from 'node:crypto';

export type CheDoGame = 'vuot-chang' | '60-giay' | 'thach-dau';
export const CHE_DO: readonly CheDoGame[] = ['vuot-chang', '60-giay', 'thach-dau'];
export type NnGame = 'ja' | 'zh' | 'en';
export const NN_GAME: readonly NnGame[] = ['ja', 'zh', 'en'];

export interface LuatGame {
  ten: string;
  /** Điểm tối đa của MỘT câu đúng (gồm thưởng combo, thưởng hạ sớm…). */
  diemMoiCau: number;
  /** Thưởng khi qua chặng k = thuongChang × k (chế độ vượt chặng). */
  thuongChang: number;
  /** Trần câu đúng mỗi giây. */
  cauMoiGiay: number;
  cheDo: readonly CheDoGame[];
}

export const GAME_CTL: Record<string, LuatGame> = {
  // Gấu Canh Trời: chữ rơi, gõ cách đọc để Gấu bắn hạ. 10 + combo×2 (trần +10) + 5 hạ ở nửa trên + 10 hạ "ngay đầu".
  'canh-troi': { ten: 'Gấu Canh Trời', diemMoiCau: 35, thuongChang: 20, cauMoiGiay: 2.5, cheDo: CHE_DO },
  // Gấu Câu Chữ: cá mang chữ bơi dưới hồ, thả câu đúng con cá của đề. 10 + combo×2 (trần +10) + 5 câu nhanh + 15 cá vàng.
  'cau-chu': { ten: 'Gấu Câu Chữ', diemMoiCau: 40, thuongChang: 20, cauMoiGiay: 2, cheDo: CHE_DO },
  // Bếp Gấu Bận Rộn: khách gọi món bằng ngoại ngữ, kéo đúng món vào khay. Mỗi MÓN đặt đúng là một câu:
  // 10 + combo×2 (trần +10) + kiên nhẫn còn lại (≤ 10) + 5 khi đủ một đơn nhiều món.
  'bep-gau': { ten: 'Bếp Gấu Bận Rộn', diemMoiCau: 35, thuongChang: 20, cauMoiGiay: 3, cheDo: CHE_DO },
  // Gấu Thư Pháp: chữ trôi xuống, VIẾT TAY đúng chữ để Gấu vung bút hạ. 12 + combo×2 (trần +10) + 5 nửa trên + 5 "ngay đầu"
  // + 4 mỗi chữ thêm của từ nhiều chữ (trần +8). Viết tay chậm hơn gõ nhiều ⇒ trần tốc độ thấp.
  'viet-tay': { ten: 'Gấu Thư Pháp', diemMoiCau: 40, thuongChang: 20, cauMoiGiay: 1.2, cheDo: CHE_DO },
  // Gấu Chạy Ghép Câu: Gấu chạy, nhảy/lướt giữa 3 làn ăn đúng MẢNH tiếp theo của câu. Mỗi MẢNH ăn đúng là một câu:
  // 10 + combo×2 (trần +10) + 5 khi cả câu ghép xong + 5 nếu câu đó không trượt mảnh nào ⇒ tối đa 30/mảnh.
  // Mảnh tới theo đợt (≥ 0,6 s/đợt lúc nhanh nhất, chưa kể lúc qua cổng) ⇒ trần 2 mảnh/giây là lỏng tay.
  'chay-ghep-cau': { ten: 'Gấu Chạy Ghép Câu', diemMoiCau: 30, thuongChang: 20, cauMoiGiay: 2, cheDo: CHE_DO },
};

/** Khung tên (vật phẩm tủ đồ) hiện được trên bảng xếp hạng — mã lạ ⇒ bỏ (không lưu chuỗi tuỳ ý của app). */
export const KHUNG_TEN = ['vang', 'may-ngoc', 'cau-vong', 'pixel', 'hoa-dao', 'den-long', 'sao-dem'] as const;

export const CACH_HIEN = ['chu-doc', 'chu', 'doc', 'nghia'] as const;

/** Ván tính giờ: 60 s + 2 s trễ mạng/khung hình. */
const TRAN_MS_60 = 62_000;
/** Vượt chặng: ván dài nhất 3 giờ. */
const TRAN_MS_CHANG = 3 * 3600_000;

export class LoiTroChoi extends Error {
  constructor(public ma: string, msg: string) { super(msg); }
}

export interface DiemGui {
  game: string; cheDo: CheDoGame; nn: NnGame;
  diem: number; dung: number; sai: number; chang: number; thoiGianMs: number;
  maVan: string; maThachDau: string | null; khung: string | null;
}

const soNguyen = (v: unknown, ten: string, max: number): number => {
  const n = Number(v ?? 0);
  if (!Number.isInteger(n) || n < 0 || n > max) throw new LoiTroChoi('CTL_TC_SO', `${ten} không hợp lệ.`);
  return n;
};

export function kiemGame(game: unknown): LuatGame {
  const l = typeof game === 'string' ? GAME_CTL[game] : undefined;
  if (!l) throw new LoiTroChoi('CTL_TC_GAME', 'Không có trò chơi này.');
  return l;
}

export function kiemNnGame(nn: unknown): NnGame {
  if (!NN_GAME.includes(nn as NnGame)) throw new LoiTroChoi('CTL_NN_SAI', 'Ngôn ngữ không hỗ trợ.');
  return nn as NnGame;
}

export function kiemCheDo(cd: unknown, luat?: LuatGame): CheDoGame {
  if (!CHE_DO.includes(cd as CheDoGame) || (luat && !luat.cheDo.includes(cd as CheDoGame))) throw new LoiTroChoi('CTL_TC_CHE_DO', 'Chế độ chơi không hợp lệ.');
  return cd as CheDoGame;
}

/** Điểm cao nhất có thể với số câu đúng + số chặng đã qua. */
export function diemToiDa(l: LuatGame, dung: number, chang: number): number {
  return dung * l.diemMoiCau + l.thuongChang * (chang * (chang + 1)) / 2;
}

/**
 * Kiểm điểm gửi lên: số nguyên không âm, thời gian khớp chế độ, điểm ≤ trần theo số câu, số câu ≤ trần theo thời gian.
 * Không đúng ⇒ ném `LoiTroChoi` (route đổi thành 400). Trả bản đã chuẩn hoá.
 */
export function kiemDiem(goc: Record<string, unknown>): DiemGui {
  const game = String(goc.game ?? '');
  const l = kiemGame(game);
  const cheDo = kiemCheDo(goc.cheDo, l);
  const nn = kiemNnGame(goc.nn);
  const diem = soNguyen(goc.diem, 'Điểm', 1_000_000);
  const dung = soNguyen(goc.dung, 'Số câu đúng', 5000);
  const sai = soNguyen(goc.sai, 'Số câu sai', 5000);
  const chang = soNguyen(goc.chang, 'Số chặng', 500);
  const thoiGianMs = soNguyen(goc.thoiGianMs, 'Thời gian', TRAN_MS_CHANG);
  const maVan = String(goc.maVan ?? '');
  if (!/^[A-Za-z0-9-]{8,40}$/.test(maVan)) throw new LoiTroChoi('CTL_TC_MA_VAN', 'Mã ván không hợp lệ.');

  const tinhGio = cheDo !== 'vuot-chang';
  if (tinhGio && thoiGianMs > TRAN_MS_60) throw new LoiTroChoi('CTL_TC_GIO', 'Ván 60 giây không thể dài hơn thế.');
  if (tinhGio && chang > 0) throw new LoiTroChoi('CTL_TC_CHANG', 'Ván tính giờ không có chặng.');
  if (thoiGianMs < 1000 && dung > 0) throw new LoiTroChoi('CTL_TC_GIO', 'Ván quá ngắn.');
  if (dung > Math.ceil((thoiGianMs / 1000) * l.cauMoiGiay) + 3) throw new LoiTroChoi('CTL_TC_NHANH', 'Số câu đúng vượt quá tốc độ một người gõ được.');
  if (diem > diemToiDa(l, dung, chang)) throw new LoiTroChoi('CTL_TC_DIEM', 'Điểm vượt quá mức tối đa của số câu đúng.');
  // Mỗi chặng cần ít nhất một câu đúng.
  if (chang > dung) throw new LoiTroChoi('CTL_TC_CHANG', 'Số chặng không khớp số câu đúng.');

  const maTD = goc.maThachDau == null || goc.maThachDau === '' ? null : chuanMa(goc.maThachDau);
  if (cheDo === 'thach-dau' && !maTD) throw new LoiTroChoi('CTL_TC_THACH_DAU', 'Thiếu mã thách đấu.');
  if (cheDo !== 'thach-dau' && maTD) throw new LoiTroChoi('CTL_TC_THACH_DAU', 'Mã thách đấu chỉ đi với chế độ thách đấu.');
  const khung = typeof goc.khung === 'string' && (KHUNG_TEN as readonly string[]).includes(goc.khung) ? goc.khung : null;
  return { game, cheDo, nn, diem, dung, sai, chang, thoiGianMs, maVan, maThachDau: maTD, khung };
}

// ─── Thách đấu bất đồng bộ ───────────────────────────────────────────────────────────────────────────────────────

/** Không có 0/O/1/I/L — đọc qua điện thoại không nhầm. */
const BANG_MA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const DAI_MA = 6;

export function sinhMa(): string {
  let s = '';
  for (let i = 0; i < DAI_MA; i++) s += BANG_MA[randomInt(BANG_MA.length)];
  return s;
}

/** Mã người dùng gõ: bỏ khoảng trắng/gạch, chữ hoa. Sai dạng ⇒ ném. */
export function chuanMa(v: unknown): string {
  const s = String(v ?? '').toUpperCase().replace(/[\s-]/g, '');
  if (s.length !== DAI_MA || [...s].some((c) => !BANG_MA.includes(c))) throw new LoiTroChoi('CTL_TC_MA', 'Mã thách đấu không đúng.');
  return s;
}

export interface MucDe { id: number; chu: string; doc: string | null; docLatin: string | null; hanViet: string | null; nghia: string }
export interface ThachDauGui { game: string; nn: NnGame; cachHien: string; seed: number; tenBo: string; de: MucDe[] }

const chuoiGon = (v: unknown, max: number): string | null => {
  if (v == null) return null;
  const s = String(v).replace(/[\u0000-\u001f]/g, ' ').trim();
  return s ? s.slice(0, max) : null;
};

/**
 * Bộ đề thách đấu: 4–80 từ, mỗi trường cắt trần, bỏ từ trùng chữ. Từ do người dùng gửi (vd từ sổ tay) sẽ hiện cho bạn
 * bè ⇒ route chạy bộ lọc nội dung trên `chuLoc()` trước khi lưu.
 */
export function kiemThachDau(goc: Record<string, unknown>): ThachDauGui {
  const game = String(goc.game ?? '');
  kiemGame(game);
  const nn = kiemNnGame(goc.nn);
  const cachHien = (CACH_HIEN as readonly string[]).includes(goc.cachHien as string) ? String(goc.cachHien) : 'chu-doc';
  const seed = Number(goc.seed);
  if (!Number.isInteger(seed) || seed < 1 || seed > 2_147_483_647) throw new LoiTroChoi('CTL_TC_SEED', 'Seed không hợp lệ.');
  const tenBo = chuoiGon(goc.tenBo, 60) ?? 'Bộ từ';
  if (!Array.isArray(goc.de)) throw new LoiTroChoi('CTL_TC_DE', 'Thiếu bộ đề.');
  const daCo = new Set<string>();
  const de: MucDe[] = [];
  for (const x of goc.de.slice(0, 120) as Record<string, unknown>[]) {
    if (!x || typeof x !== 'object') continue;
    const chu = chuoiGon(x.chu, 40), nghia = chuoiGon(x.nghia, 60);
    if (!chu || !nghia || daCo.has(chu)) continue;
    daCo.add(chu);
    const id = Number(x.id);
    de.push({
      id: Number.isSafeInteger(id) ? id : 0, chu, nghia,
      doc: chuoiGon(x.doc, 80), docLatin: chuoiGon(x.docLatin, 80), hanViet: chuoiGon(x.hanViet, 60),
    });
    if (de.length >= 80) break;
  }
  if (de.length < 4) throw new LoiTroChoi('CTL_TC_DE', 'Bộ đề cần ít nhất 4 từ.');
  return { game, nn, cachHien, seed, tenBo, de };
}

/** Toàn bộ chữ người dùng gửi trong một thách đấu — đưa qua bộ lọc nội dung. */
export const chuLoc = (t: ThachDauGui) => [t.tenBo, ...t.de.flatMap((m) => [m.chu, m.nghia, m.doc ?? '', m.hanViet ?? ''])].join(' \n ');

// ─── Kỳ xếp hạng ─────────────────────────────────────────────────────────────────────────────────────────────────

export type KyXepHang = 'tuan' | 'moi';
export const docKyXH = (v: unknown): KyXepHang => (v === 'moi' ? 'moi' : 'tuan');

/** 00:00 thứ Hai (giờ VN) của tuần chứa `luc`, dạng Date UTC. */
export function dauTuanVn(luc: Date = new Date()): Date {
  const VN = 7 * 3600_000;
  const vn = new Date(luc.getTime() + VN);
  const thu = (vn.getUTCDay() + 6) % 7; // 0 = thứ Hai
  const dau = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - thu * 86_400_000;
  return new Date(dau - VN);
}

/** Tên hiện trên bảng: tên hồ sơ nếu qua bộ lọc, không thì "Người học #id" (bảng xếp hạng công khai cho khách). */
export function tenHien(ten: string, id: number, chan: (s: string) => boolean): string {
  const s = ten.trim().slice(0, 40);
  return !s || chan(s) ? `Người học #${id}` : s;
}
