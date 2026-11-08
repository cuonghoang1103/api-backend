/**
 * ĐỐI KHÁNG REALTIME — cờ vua · cờ tướng · tiến lên · caro (05/10/2026). Đặc tả: docs/doi-khang-spec.md.
 *
 * Máy chủ là TRỌNG TÀI: mọi nước đi qua `LUAT[tro].kiemTra` rồi mới áp dụng, đồng hồ do máy chủ
 * giữ, bài trên tay chỉ gửi cho đúng ghế (`nhinTu`). Client không thể đi hộ người khác, đi sai
 * luật, sửa đồng hồ hay nhìn bài đối thủ.
 *
 * Tự chứa như `registerListenTogether`: phòng trong RAM (ván đang đánh là trạng thái sống, không
 * cần bền), chỉ ván XONG mới ghi DB (`doiKhang.service.ts` — lịch sử + Elo). Máy chủ khởi động lại
 * thì ván đang đánh mất — chấp nhận được với quy mô hiện tại (vài chục bàn cùng lúc).
 *
 * Chơi với máy KHÔNG đi qua đây (chạy ở máy người chơi). Bot ở đây chỉ để lấp ghế tiến lên.
 */
import type { Server as IOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { LUAT, type CapDoBot, type KetQua, type MaTro } from '../services/doiKhang/luat/index.js';
import { banOnline, layElo, layNguoi, luuVan, moiDuoc, tenHienThi } from '../services/doiKhang/doiKhang.service.js';

interface ConnUser { id: number; username: string }

type TrangThaiPhong = 'cho' | 'dang-danh' | 'xong';
interface Ghe {
  userId: number | null; ten: string; avatar: string | null; elo: number | null;
  bot?: CapDoBot; sanSang: boolean; taiDau: boolean; roiLuc: number | null;
}
interface Phong {
  ma: string; tro: MaTro; chuId: number; rieng: boolean;
  thoiGian: { phut: number; congGiay: number };
  ghe: Ghe[];
  /** socketId → userId của MỌI socket đang ở phòng (người chơi + người xem). */
  nghe: Map<string, number>;
  trangThai: TrangThaiPhong;
  state: unknown; seed: number; soNuoc: number;
  lichSu: { ghe: number; nuoc: unknown; moTa: string }[];
  dongHo: number[]; dongHoLuc: number;
  tiSo: number[];
  ketQua: KetQua | null; doiElo: number[] | null;
  batDau: Date | null; xinHoa: number | null;
  nguoiDiTruoc: number | null;
  henGio: NodeJS.Timeout | null; henBot: NodeJS.Timeout | null; henRoi: Map<number, NodeJS.Timeout>;
  chamLuc: number;
}

const TRO_HOP_LE: MaTro[] = ['co-vua', 'co-tuong', 'tien-len', 'caro'];
const THOI_GIAN_GHEP: Record<MaTro, { phut: number; congGiay: number }> = {
  'co-vua': { phut: 10, congGiay: 0 }, 'co-tuong': { phut: 15, congGiay: 0 }, 'tien-len': { phut: 5, congGiay: 3 }, caro: { phut: 5, congGiay: 0 },
};
const CHO_QUAY_LAI_MS = 60_000;
/**
 * Giữ ghế ở phòng CHỜ / phòng vừa XONG khi người chơi rời trang (08/11/2026).
 *
 * Trước đó rời trang là mất ghế NGAY, người cuối rời là phòng bị xoá NGAY. Chủ phòng tạo phòng,
 * mời bạn, rồi mở Tin nhắn để nhắn "vào đi" ⇒ phòng biến mất ⇒ bạn bấm Nhận được "Không tìm thấy
 * phòng". Điện thoại khoá màn hình (socket rớt) cũng vậy. Ba phút đủ cho một lượt nhắn tin; bấm
 * "Rời phòng" thật (`dk:roi { han: true }`) thì vẫn rời ngay.
 */
const GIU_PHONG_CHO_MS = 3 * 60_000;
/** Lời mời sống bao lâu. Hết hạn ⇒ máy chủ báo người mời "không phản hồi" và tắt thẻ ở người được mời. */
const LOI_MOI_HAN_MS = 60_000;
const phongs = new Map<string, Phong>();

/** Lời mời đang chờ trả lời — máy chủ giữ để mọi thiết bị của hai bên thấy CÙNG một trạng thái. */
interface LoiMoi {
  id: string; maPhong: string; tro: MaTro; tuId: number; denId: number; denTen: string; het: number;
  hen: NodeJS.Timeout;
}
/** khoá `${maPhong}:${denId}` — mời lại cùng người cùng phòng thì thay lời mời cũ. */
const loiMois = new Map<string, LoiMoi>();
const khoaMoi = (maPhong: string, denId: number) => `${maPhong}:${denId}`;
/** Chống spam theo NGƯỜI (trước đây theo socket — mở thêm tab là lách được). */
const moiGanNhat = new Map<number, number>();
const TEN_TRO_VI: Record<MaTro, string> = { 'co-vua': 'Cờ vua', 'co-tuong': 'Cờ tướng', 'tien-len': 'Tiến lên', caro: 'Caro' };

type Phat = { to(room: string): { emit(ev: string, payload: unknown): unknown } };

/**
 * Kết thúc một lời mời: báo người MỜI kết quả (`dk:moi-ket-qua`) và tắt thẻ ở MỌI thiết bị của người
 * được mời (`dk:loi-moi-xong`). `ketQua = null` ⇒ chỉ tắt thẻ (phòng đóng/đủ người), không báo người mời.
 * Xuất ra để test được không cần socket thật.
 */
export function dongLoiMoi(
  io: Phat, m: LoiMoi, ketQua: 'nhan' | 'tu-choi' | 'het-han' | null, lyDo?: string,
): void {
  clearTimeout(m.hen);
  loiMois.delete(khoaMoi(m.maPhong, m.denId));
  io.to(`user:${m.denId}`).emit('dk:loi-moi-xong', { id: m.id, maPhong: m.maPhong, ketQua, lyDo });
  if (ketQua) {
    io.to(`user:${m.tuId}`).emit('dk:moi-ket-qua', { id: m.id, maPhong: m.maPhong, userId: m.denId, ten: m.denTen, ketQua });
    // Bản cũ (app ≤ 0.5.212, tab web chưa tải lại) chỉ nghe `dk:tu-choi`.
    if (ketQua === 'tu-choi') io.to(`user:${m.tuId}`).emit('dk:tu-choi', { maPhong: m.maPhong, userId: m.denId, ten: m.denTen });
  }
}

/** Đóng mọi lời mời còn treo của một phòng (phòng đóng / đủ người / đã bắt đầu). */
function dongMoiCuaPhong(io: Phat, maPhong: string, lyDo: string): void {
  for (const m of [...loiMois.values()]) if (m.maPhong === maPhong) dongLoiMoi(io, m, null, lyDo);
}

const gheTrong = (): Ghe => ({ userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null });
/** Phòng còn chỗ cho người mới không (tiến lên được thêm ghế tới tối đa). */
function conCho(p: Phong): boolean {
  if (p.trangThai !== 'cho') return false;
  if (p.ghe.some((g) => g.userId == null && !g.bot)) return true;
  return p.tro === 'tien-len' && p.ghe.length < LUAT['tien-len'].soNguoi.max;
}
const hangGhep = new Map<MaTro, { userId: number; socketId: string }[]>();
const khoa = (ma: string) => `dk:${ma}`;

function taoMa(): string {
  const chu = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (;;) {
    let m = '';
    for (let i = 0; i < 6; i++) m += chu[Math.floor(Math.random() * chu.length)];
    if (!phongs.has(m)) return m;
  }
}

const tenBot = (cap: CapDoBot) => (cap === 1 ? 'Máy · Dễ' : cap === 2 ? 'Máy · Vừa' : 'Máy · Khó');

function dto(p: Phong, viewerId: number | null) {
  const gheCuaToi = viewerId == null ? null : p.ghe.findIndex((g) => g.userId === viewerId);
  const ghe = gheCuaToi != null && gheCuaToi >= 0 ? gheCuaToi : null;
  const luat = LUAT[p.tro];
  const online = new Set(p.nghe.values());
  return {
    maPhong: p.ma, tro: p.tro, trangThai: p.trangThai, chuId: p.chuId, rieng: p.rieng,
    ghe: p.ghe.map((g) => ({
      userId: g.userId, ten: g.ten, avatar: g.avatar, elo: g.elo, bot: g.bot,
      online: g.bot ? true : g.userId != null && online.has(g.userId), sanSang: g.sanSang, taiDau: g.taiDau,
    })),
    nguoiXem: new Set([...p.nghe.values()].filter((id) => !p.ghe.some((g) => g.userId === id))).size,
    thoiGian: p.thoiGian, dongHo: p.dongHo, dongHoLuc: p.dongHoLuc, tiSo: p.tiSo,
    van: p.state == null ? null : {
      nhin: luat.nhinTu(p.state, ghe), soNuoc: p.soNuoc, luot: p.trangThai === 'dang-danh' ? luat.luot(p.state) : -1,
      nuocCuoi: p.lichSu.length ? p.lichSu[p.lichSu.length - 1] : null, lichSu: p.lichSu.map((l) => l.moTa),
    },
    ketQua: p.ketQua, doiElo: p.doiElo, xinHoa: p.xinHoa, gheCuaToi: ghe, gioMayChu: Date.now(),
    /** Lời mời đang chờ trả lời của phòng — để mọi người trong phòng thấy "đang chờ X…" (08/11/2026). */
    dangMoi: [...loiMois.values()].filter((m) => m.maPhong === p.ma).map((m) => ({ userId: m.denId, ten: m.denTen, het: m.het })),
  };
}

/**
 * Những gì đụng DB / dịch vụ ngoài — tách ra để test dựng được máy chủ socket.io THẬT với nhiều client
 * mà không cần Postgres (`doiKhang.socket.test.ts`). Mặc định là bản thật.
 */
export interface DichVuDoiKhang {
  layNguoi: typeof layNguoi;
  layElo: typeof layElo;
  luuVan: typeof luuVan;
  moiDuoc: typeof moiDuoc;
  banOnline: typeof banOnline;
  baoMoiOffline: (den: number, tu: number, phong: { maPhong: string; tro: string; tenTro: string }) => Promise<void>;
  /** Thời hạn lời mời (ms) — test đặt ngắn. */
  hanMoiMs?: number;
  /** Giữ ghế phòng chờ khi rời trang (ms) — test đặt ngắn. */
  giuPhongMs?: number;
}
const DICH_VU_THAT: DichVuDoiKhang = {
  layNguoi, layElo, luuVan, moiDuoc, banOnline,
  baoMoiOffline: async (den, tu, phong) => {
    const { notifyGameInvite } = await import('../services/notification.service.js');
    await notifyGameInvite(den, tu, phong);
  },
};

export function registerDoiKhang(io: IOServer, socket: Socket, user: ConnUser, dvTruyen?: Partial<DichVuDoiKhang>): void {
  const dv: DichVuDoiKhang = { ...DICH_VU_THAT, ...dvTruyen };
  const hanMoi = dv.hanMoiMs ?? LOI_MOI_HAN_MS;
  const giuPhong = dv.giuPhongMs ?? GIU_PHONG_CHO_MS;
  const phat = (p: Phong) => {
    p.chamLuc = Date.now();
    for (const [sid, uid] of p.nghe) io.to(sid).emit('dk:phong', dto(p, uid));
  };
  const traLoi = (cb: unknown, data: unknown) => { if (typeof cb === 'function') (cb as (d: unknown) => void)(data); };
  const layPhong = (raw: unknown) => phongs.get(String((raw as { maPhong?: unknown })?.maPhong ?? '').toUpperCase());

  /**
   * Ngồi vào ghế `idx`. GIỮ GHẾ NGAY (đồng bộ) rồi mới đọc DB lấy tên/Elo — trước đây ghế chỉ được
   * ghi SAU `await`, nên hai người bấm vào cùng lúc cùng thấy ghế trống và cùng ngồi: người đầu bị
   * ghi đè, im lặng thành người xem (08/11/2026).
   */
  async function ngoiVao(p: Phong, idx: number, userId: number) {
    const ten = userId === user.id ? user.username : '';
    p.ghe[idx] = { userId, ten, avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null };
    const [nguoi, elo] = await Promise.all([dv.layNguoi([userId]), dv.layElo(p.tro, [userId])]);
    const u = nguoi.get(userId);
    const g = p.ghe[idx];
    if (!g || g.userId !== userId) return; // ghế đã đổi trong lúc chờ DB (rời ngay) — đừng ghi đè
    g.ten = u ? tenHienThi(u) : g.ten || user.username;
    g.avatar = u?.avatarUrl ?? null;
    g.elo = elo.get(userId) ?? 1200;
  }

  function dungHen(p: Phong) {
    if (p.henGio) clearTimeout(p.henGio);
    if (p.henBot) clearTimeout(p.henBot);
    p.henGio = null; p.henBot = null;
  }

  /** Đặt hẹn hết giờ cho người đang tới lượt + cho bot đi nếu tới lượt bot. */
  function henLuot(p: Phong) {
    dungHen(p);
    if (p.trangThai !== 'dang-danh') return;
    const luot = LUAT[p.tro].luot(p.state);
    p.henGio = setTimeout(() => ketThuc(p, { thang: p.ghe.map((_, i) => i).filter((i) => i !== luot), hoa: false, lyDo: 'het-gio', thuHang: undefined }, luot), Math.max(0, p.dongHo[luot]!) + 50);
    const g = p.ghe[luot];
    if (g?.bot) {
      const cap = g.bot;
      p.henBot = setTimeout(() => {
        try {
          const nuoc = LUAT[p.tro].nuocBot(p.state, cap, Math.random);
          diNuoc(p, luot, nuoc);
        } catch (e) { logger.error('[doiKhang] bot lỗi', { err: String(e) }); }
      }, 700 + Math.random() * 700);
    }
  }

  function batDau(p: Phong) {
    const luat = LUAT[p.tro];
    p.seed = Math.floor(Math.random() * 2 ** 31);
    const s = luat.khoiTao(p.ghe.length, p.seed) as Record<string, unknown>;
    if (p.tro === 'tien-len' && p.nguoiDiTruoc != null) s.nguoiDiTruoc = p.nguoiDiTruoc;
    p.state = s; p.soNuoc = 0; p.lichSu = []; p.ketQua = null; p.doiElo = null; p.xinHoa = null;
    p.dongHo = p.ghe.map(() => p.thoiGian.phut * 60_000); p.dongHoLuc = Date.now();
    p.trangThai = 'dang-danh'; p.batDau = new Date();
    p.ghe.forEach((g) => { g.taiDau = false; });
    dongMoiCuaPhong(io, p.ma, 'da-bat-dau');
    henLuot(p);
    phat(p);
  }

  function thuBatDau(p: Phong) {
    if (p.trangThai !== 'cho') return;
    if (p.ghe.length < LUAT[p.tro].soNguoi.min) return;
    // Người đang vắng (rời trang, ghế còn giữ) thì CHƯA bắt đầu — không để ván chạy đồng hồ khi họ không ở đó.
    const coMat = new Set(p.nghe.values());
    if (p.ghe.every((g) => g.bot || (g.userId != null && g.sanSang && coMat.has(g.userId)))) batDau(p);
  }

  function diNuoc(p: Phong, ghe: number, nuoc: unknown): string | null {
    if (p.trangThai !== 'dang-danh') return 'Ván chưa bắt đầu hoặc đã xong.';
    const luat = LUAT[p.tro];
    if (luat.luot(p.state) !== ghe) return 'Chưa tới lượt bạn.';
    const loi = luat.kiemTra(p.state, ghe, nuoc);
    if (loi) return loi;
    const now = Date.now();
    p.dongHo[ghe] = p.dongHo[ghe]! - (now - p.dongHoLuc);
    if (p.dongHo[ghe]! <= 0) { ketThuc(p, { thang: p.ghe.map((_, i) => i).filter((i) => i !== ghe), hoa: false, lyDo: 'het-gio' }, ghe); return null; }
    p.dongHo[ghe] = p.dongHo[ghe]! + p.thoiGian.congGiay * 1000;
    p.dongHoLuc = now;
    const moTa = luat.moTa(p.state, nuoc);
    p.state = luat.apDung(p.state, ghe, nuoc);
    p.soNuoc++;
    p.lichSu.push({ ghe, nuoc, moTa });
    p.xinHoa = null;
    const kq = luat.ketThuc(p.state);
    if (kq) { ketThuc(p, kq, null); return null; }
    henLuot(p);
    phat(p);
    return null;
  }

  /** `nguoiThua`: ghế thua vì hết giờ/đầu hàng/thoát ở ván NHIỀU người (tiến lên) — người còn lại xếp theo số lá. */
  function ketThuc(p: Phong, kq: KetQua, nguoiThua: number | null) {
    if (p.trangThai !== 'dang-danh') return;
    dungHen(p);
    if (nguoiThua != null && p.tro === 'tien-len') {
      const nhin = LUAT['tien-len'].nhinTu(p.state, null) as { soLa: number[]; daVe: number[] };
      const conLai = p.ghe.map((_, i) => i).filter((i) => i !== nguoiThua && !nhin.daVe.includes(i)).sort((a, b) => nhin.soLa[a]! - nhin.soLa[b]!);
      const thuHang = [...nhin.daVe, ...conLai, nguoiThua];
      kq = { thang: [thuHang[0]!], hoa: false, lyDo: kq.lyDo, thuHang };
    }
    p.trangThai = 'xong'; p.ketQua = kq;
    if (!kq.hoa) for (const g of kq.thang) p.tiSo[g] = (p.tiSo[g] ?? 0) + 1;
    if (kq.thuHang?.length) p.nguoiDiTruoc = kq.thuHang[0]!;
    phat(p);
    const nguoiChoi = p.ghe.map((g) => (g.bot ? 0 : g.userId ?? 0));
    void dv.luuVan({ tro: p.tro, maPhong: p.ma, nguoiChoi, ketQua: kq, soNuoc: p.soNuoc, lichSu: p.lichSu.map((l) => ({ g: l.ghe, n: l.nuoc })), batDau: p.batDau ?? new Date() })
      .then((r) => {
        if (!r) return;
        p.doiElo = r.sau.map((e, i) => e - r.truoc[i]!);
        p.ghe.forEach((g, i) => { if (!g.bot) g.elo = r.sau[i]!; });
        phat(p);
      })
      .catch((e) => logger.error('[doiKhang] lưu ván lỗi', { err: String(e) }));
  }

  function roiGhe(p: Phong, userId: number, han = false) {
    const idx = p.ghe.findIndex((g) => g.userId === userId);
    if (idx < 0) return;
    if (!han && p.trangThai !== 'dang-danh') {
      // Phòng chờ / vừa xong: GIỮ GHẾ một lúc (xem GIU_PHONG_CHO_MS). Quay lại trong hạn ⇒ `vaoNghe` huỷ hẹn.
      p.ghe[idx]!.roiLuc = Date.now();
      if (!p.henRoi.has(userId)) {
        p.henRoi.set(userId, setTimeout(() => {
          p.henRoi.delete(userId);
          if (!phongs.has(p.ma) || [...p.nghe.values()].includes(userId)) return;
          roiGhe(p, userId, true);
          if (phongs.has(p.ma)) phat(p);
        }, giuPhong));
      }
      return;
    }
    const henCu = p.henRoi.get(userId);
    if (han && henCu && p.trangThai !== 'dang-danh') { clearTimeout(henCu); p.henRoi.delete(userId); }
    if (p.trangThai === 'dang-danh') {
      // Đang đánh: giữ ghế 60 giây cho nối lại, quá hạn xử thua.
      p.ghe[idx]!.roiLuc = Date.now();
      if (!p.henRoi.has(userId)) {
        p.henRoi.set(userId, setTimeout(() => {
          p.henRoi.delete(userId);
          const g = p.ghe[idx];
          if (!g || g.userId !== userId || [...p.nghe.values()].includes(userId)) return;
          ketThuc(p, { thang: p.ghe.map((_, i) => i).filter((i) => i !== idx), hoa: false, lyDo: 'thoat' }, idx);
        }, CHO_QUAY_LAI_MS));
      }
    } else if (p.tro === 'tien-len' && p.ghe.length > 2 && p.trangThai === 'cho') {
      p.ghe.splice(idx, 1); p.tiSo.splice(idx, 1);
    } else {
      p.ghe[idx] = gheTrong();
    }
    if (!p.ghe.some((g) => g.userId != null && !g.bot)) { xoaPhong(p); return; }
    if (p.trangThai === 'xong') {
      // Ván đã xong mà đối thủ rời hẳn: người còn lại đừng đứng chờ "đấu lại" vô hạn — về phòng chờ, mời người khác.
      p.trangThai = 'cho'; p.state = null; p.ketQua = null; p.doiElo = null; p.xinHoa = null;
      p.ghe.forEach((x) => { x.sanSang = !!x.bot; x.taiDau = false; });
    }
    if (p.chuId === userId) p.chuId = p.ghe.find((g) => g.userId != null && !g.bot)!.userId!;
  }

  function xoaPhong(p: Phong) {
    dungHen(p);
    p.henRoi.forEach((t) => clearTimeout(t));
    dongMoiCuaPhong(io, p.ma, 'phong-dong');
    for (const sid of p.nghe.keys()) io.to(sid).emit('dk:dong', { maPhong: p.ma });
    io.in(khoa(p.ma)).socketsLeave(khoa(p.ma));
    phongs.delete(p.ma);
  }

  function vaoNghe(p: Phong) {
    p.nghe.set(socket.id, user.id);
    void socket.join(khoa(p.ma));
    const g = p.ghe.find((x) => x.userId === user.id);
    if (g) { g.roiLuc = null; const t = p.henRoi.get(user.id); if (t) { clearTimeout(t); p.henRoi.delete(user.id); } }
  }

  function taoPhongMoi(tro: MaTro, thoiGian: { phut: number; congGiay: number }, rieng: boolean, soGhe: number): Phong {
    const p: Phong = {
      ma: taoMa(), tro, chuId: user.id, rieng, thoiGian,
      ghe: Array.from({ length: soGhe }, () => ({ userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null })),
      nghe: new Map(), trangThai: 'cho', state: null, seed: 0, soNuoc: 0, lichSu: [], dongHo: [], dongHoLuc: Date.now(),
      tiSo: new Array<number>(soGhe).fill(0), ketQua: null, doiElo: null, batDau: null, xinHoa: null, nguoiDiTruoc: null,
      henGio: null, henBot: null, henRoi: new Map(), chamLuc: Date.now(),
    };
    phongs.set(p.ma, p);
    return p;
  }

  const docTro = (raw: unknown): MaTro | null => (TRO_HOP_LE.includes(raw as MaTro) ? (raw as MaTro) : null);
  const docThoiGian = (raw: unknown, tro: MaTro) => {
    const t = raw as { phut?: unknown; congGiay?: unknown } | undefined;
    const phut = Math.min(60, Math.max(1, Math.round(Number(t?.phut) || THOI_GIAN_GHEP[tro].phut)));
    const congGiay = Math.min(60, Math.max(0, Math.round(Number(t?.congGiay) || 0)));
    return { phut, congGiay };
  };

  // ─── Sự kiện ───────────────────────────────────────────────────────
  socket.on('dk:tao', async (raw: any, cb: unknown) => {
    try {
      const tro = docTro(raw?.tro);
      if (!tro) return traLoi(cb, { ok: false, loi: 'Trò không hợp lệ.' });
      const { min, max } = LUAT[tro].soNguoi;
      const soGhe = Math.min(max, Math.max(min, Math.round(Number(raw?.soGhe) || min)));
      const p = taoPhongMoi(tro, docThoiGian(raw?.thoiGian, tro), !!raw?.rieng, soGhe);
      await ngoiVao(p, 0, user.id);
      vaoNghe(p);
      traLoi(cb, { ok: true, phong: dto(p, user.id) });
    } catch (e) { logger.error('[doiKhang] tao', { err: String(e) }); traLoi(cb, { ok: false, loi: 'Không tạo được phòng.' }); }
  });

  socket.on('dk:vao', async (raw: any, cb: unknown) => {
    try {
      const p = layPhong(raw);
      if (!p) return traLoi(cb, { ok: false, loi: 'Không tìm thấy phòng — mã sai hoặc phòng đã đóng.' });
      if (!p.ghe.some((g) => g.userId === user.id) && p.trangThai === 'cho') {
        const trong = p.ghe.findIndex((g) => g.userId == null && !g.bot);
        if (trong >= 0) await ngoiVao(p, trong, user.id);
        else if (p.tro === 'tien-len' && p.ghe.length < LUAT['tien-len'].soNguoi.max) { p.ghe.push(gheTrong()); p.tiSo.push(0); await ngoiVao(p, p.ghe.length - 1, user.id); }
      }
      vaoNghe(p);
      // Vào phòng mình đang được mời (kể cả mở từ link/thông báo, không bấm "Nhận") = đã nhận lời mời.
      const m = loiMois.get(khoaMoi(p.ma, user.id));
      if (m && p.ghe.some((g) => g.userId === user.id)) dongLoiMoi(io, m, 'nhan');
      if (!conCho(p)) dongMoiCuaPhong(io, p.ma, 'da-du');
      traLoi(cb, { ok: true, phong: dto(p, user.id) });
      phat(p);
      thuBatDau(p); // người vắng vừa quay lại — mọi người đã sẵn sàng thì vào ván luôn
    } catch (e) { logger.error('[doiKhang] vao', { err: String(e) }); traLoi(cb, { ok: false, loi: 'Không vào được phòng.' }); }
  });

  /** `{ han: true }` = người chơi bấm "Rời phòng" thật ⇒ rời ngay. Không có ⇒ chỉ rời trang, ghế được giữ. */
  socket.on('dk:roi', (raw: any) => {
    const p = layPhong(raw);
    if (!p) return;
    p.nghe.delete(socket.id);
    void socket.leave(khoa(p.ma));
    if (![...p.nghe.values()].includes(user.id)) roiGhe(p, user.id, raw?.han === true);
    if (phongs.has(p.ma)) phat(p);
  });

  /**
   * Mời một người BẠN vào phòng (viết lại 08/11/2026).
   *
   * Bản cũ: phát `dk:loi-moi` rồi trả `{ ok: true }` bất kể người kia có kết nối hay không, phòng
   * còn chỗ hay không, có phải bạn hay không ⇒ nút hiện "Đã mời" mà không gì xảy ra. Giờ:
   * - chỉ mời được bạn bè, không chặn nhau, phòng còn chỗ, người kia chưa ngồi trong phòng;
   * - lời mời có id + hạn, máy chủ giữ ⇒ Nhận / Từ chối / Hết hạn báo lại người mời, và thẻ ở MỌI
   *   thiết bị của người được mời tắt cùng lúc (trước đây tab kia hết 30 s tự gửi "từ chối" oan);
   * - người kia không có kết nối nào ⇒ thêm thông báo vào chuông (+ đẩy ra điện thoại) thay vì mất.
   */
  socket.on('dk:moi', async (raw: any, cb: unknown) => {
    try {
      const p = layPhong(raw);
      const den = Number(raw?.userId);
      if (!p || !p.ghe.some((g) => g.userId === user.id) || !Number.isInteger(den) || den === user.id) return traLoi(cb, { ok: false, loi: 'Không mời được.' });
      if (p.ghe.some((g) => g.userId === den)) return traLoi(cb, { ok: false, loi: 'Bạn ấy đã ở trong phòng.' });
      if (!conCho(p)) return traLoi(cb, { ok: false, loi: p.trangThai === 'cho' ? 'Phòng đã đủ người.' : 'Ván đã bắt đầu — mời ở ván sau nhé.' });
      const truoc = moiGanNhat.get(user.id) ?? 0;
      if (Date.now() - truoc < 1200) return traLoi(cb, { ok: false, loi: 'Chậm lại một chút nhé.' });
      moiGanNhat.set(user.id, Date.now());
      if (!(await dv.moiDuoc(user.id, den))) return traLoi(cb, { ok: false, loi: 'Chỉ mời được bạn bè.' });

      const nguoi = await dv.layNguoi([user.id, den]).catch(() => new Map());
      const u = nguoi.get(user.id); const v = nguoi.get(den);
      const tu = { id: user.id, ten: u ? tenHienThi(u) : user.username, avatar: u?.avatarUrl ?? null };
      const cu = loiMois.get(khoaMoi(p.ma, den));
      if (cu) clearTimeout(cu.hen);
      const m: LoiMoi = {
        id: `${p.ma}-${den}-${Date.now().toString(36)}`, maPhong: p.ma, tro: p.tro, tuId: user.id, denId: den,
        denTen: v ? tenHienThi(v) : 'Bạn ấy', het: Date.now() + hanMoi,
        hen: setTimeout(() => {
          if (loiMois.get(khoaMoi(m.maPhong, den)) !== m) return;
          dongLoiMoi(io, m, 'het-han');
          const ph = phongs.get(m.maPhong); if (ph) phat(ph);
        }, hanMoi),
      };
      m.hen.unref?.();
      loiMois.set(khoaMoi(p.ma, den), m);

      // Đếm qua adapter (Redis) — đúng cả khi người kia nối vào tiến trình khác.
      const soThietBi = (await io.in(`user:${den}`).fetchSockets().catch(() => [])).length;
      io.to(`user:${den}`).emit('dk:loi-moi', { id: m.id, maPhong: p.ma, tro: p.tro, tu, hetLuc: m.het });
      if (soThietBi === 0) {
        void dv.baoMoiOffline(den, user.id, { maPhong: p.ma, tro: p.tro, tenTro: TEN_TRO_VI[p.tro] })
          .catch((e) => logger.warn('[doiKhang] báo lời mời offline lỗi', { err: String(e) }));
      }
      traLoi(cb, { ok: true, id: m.id, online: soThietBi > 0, het: m.het });
      phat(p);
    } catch (e) {
      logger.error('[doiKhang] moi', { err: String(e) });
      traLoi(cb, { ok: false, loi: 'Không gửi được lời mời.' });
    }
  });

  /** Chủ phòng huỷ lời mời đã gửi. */
  socket.on('dk:huy-moi', (raw: any) => {
    const p = layPhong(raw);
    const m = p ? loiMois.get(khoaMoi(p.ma, Number(raw?.userId))) : undefined;
    if (!p || !m || m.tuId !== user.id) return;
    dongLoiMoi(io, m, null, 'huy');
    phat(p);
  });

  socket.on('dk:tra-loi-moi', async (raw: any) => {
    const p = layPhong(raw);
    if (!p) return;
    const m = loiMois.get(khoaMoi(p.ma, user.id));
    // Đã ngồi trong phòng rồi ⇒ mọi "từ chối" là của một tab/thiết bị khác hết giờ — bỏ qua.
    if (p.ghe.some((g) => g.userId === user.id)) { if (m) dongLoiMoi(io, m, 'nhan'); return; }
    if (raw?.dongY) return; // "Nhận" được xác nhận khi người đó thật sự vào phòng (`dk:vao`).
    if (m) { dongLoiMoi(io, m, 'tu-choi'); phat(p); return; }
    // Lời mời không còn trong bộ nhớ (đã hết hạn / máy chủ vừa khởi động lại): vẫn báo chủ phòng như cũ.
    const nguoi = await dv.layNguoi([user.id]).catch(() => new Map());
    const u = nguoi.get(user.id);
    io.to(`user:${p.chuId}`).emit('dk:tu-choi', { maPhong: p.ma, userId: user.id, ten: u ? tenHienThi(u) : user.username });
  });

  /**
   * Danh sách phòng CÔNG KHAI đang chờ người / đang đánh (để vào chơi hoặc xem) — sảnh hiện để người
   * chơi không phải có mã mới vào được (08/11/2026; cờ `rieng` lưu từ đầu mà chưa từng được dùng).
   */
  socket.on('dk:ds-phong', (raw: any, cb: unknown) => {
    const tro = docTro(raw?.tro);
    const ds = [...phongs.values()]
      .filter((p) => !p.rieng && (tro == null || p.tro === tro) && p.trangThai !== 'xong')
      .filter((p) => p.ghe.some((g) => g.userId != null && !g.bot && [...p.nghe.values()].includes(g.userId)))
      .sort((a, b) => Number(conCho(b)) - Number(conCho(a)) || b.chamLuc - a.chamLuc)
      .slice(0, 30)
      .map((p) => ({
        maPhong: p.ma, tro: p.tro, trangThai: p.trangThai, conCho: conCho(p),
        ghe: p.ghe.map((g) => ({ ten: g.ten, avatar: g.avatar, bot: !!g.bot, trong: g.userId == null && !g.bot })),
        nguoiXem: new Set([...p.nghe.values()].filter((id) => !p.ghe.some((g) => g.userId === id))).size,
        thoiGian: p.thoiGian,
      }));
    traLoi(cb, { ok: true, phong: ds });
  });

  socket.on('dk:ghep', async (raw: any, cb: unknown) => {
    const tro = docTro(raw?.tro);
    if (!tro) return traLoi(cb, { ok: false, loi: 'Trò không hợp lệ.' });
    const hang = (hangGhep.get(tro) ?? []).filter((h) => h.userId !== user.id && io.sockets.sockets.has(h.socketId));
    const doiThu = hang.shift();
    if (!doiThu) {
      hang.push({ userId: user.id, socketId: socket.id });
      hangGhep.set(tro, hang);
      return traLoi(cb, { ok: true, dangCho: true });
    }
    hangGhep.set(tro, hang);
    const p = taoPhongMoi(tro, THOI_GIAN_GHEP[tro], true, 2);
    p.chuId = doiThu.userId;
    // Ngẫu nhiên ai cầm Trắng/Đỏ/đi trước.
    const [a, b] = Math.random() < 0.5 ? [doiThu.userId, user.id] : [user.id, doiThu.userId];
    await Promise.all([ngoiVao(p, 0, a), ngoiVao(p, 1, b)]);
    p.ghe.forEach((g) => { g.sanSang = true; });
    p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));
    const s2 = io.sockets.sockets.get(doiThu.socketId);
    if (s2) { p.nghe.set(s2.id, doiThu.userId); void s2.join(khoa(p.ma)); }
    io.to(doiThu.socketId).emit('dk:ghep-xong', { maPhong: p.ma });
    traLoi(cb, { ok: true, maPhong: p.ma });
    batDau(p);
  });

  socket.on('dk:huy-ghep', (raw: any) => {
    const tro = docTro(raw?.tro);
    if (tro) hangGhep.set(tro, (hangGhep.get(tro) ?? []).filter((h) => h.socketId !== socket.id));
  });

  socket.on('dk:them-bot', (raw: any, cb: unknown) => {
    const p = layPhong(raw);
    if (!p || p.chuId !== user.id || p.trangThai !== 'cho' || p.tro !== 'tien-len') return traLoi(cb, { ok: false, loi: 'Chỉ chủ phòng tiến lên mới thêm máy được.' });
    const cap = ([1, 2, 3].includes(Number(raw?.capDo)) ? Number(raw.capDo) : 2) as CapDoBot;
    let idx = Number.isInteger(raw?.ghe) ? Number(raw.ghe) : p.ghe.findIndex((g) => g.userId == null && !g.bot);
    if (idx < 0 || idx >= p.ghe.length) {
      if (p.ghe.length >= 4) return traLoi(cb, { ok: false, loi: 'Bàn đã đủ 4 ghế.' });
      p.ghe.push({ userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null }); p.tiSo.push(0); idx = p.ghe.length - 1;
    }
    if (p.ghe[idx]!.userId != null) return traLoi(cb, { ok: false, loi: 'Ghế đã có người.' });
    p.ghe[idx] = { userId: null, ten: tenBot(cap), avatar: null, elo: null, bot: cap, sanSang: true, taiDau: true, roiLuc: null };
    traLoi(cb, { ok: true });
    phat(p);
    thuBatDau(p);
  });

  socket.on('dk:bo-bot', (raw: any) => {
    const p = layPhong(raw);
    const idx = Number(raw?.ghe);
    if (!p || p.chuId !== user.id || p.trangThai !== 'cho' || !p.ghe[idx]?.bot) return;
    if (p.ghe.length > 2) { p.ghe.splice(idx, 1); p.tiSo.splice(idx, 1); } else p.ghe[idx] = { userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null };
    phat(p);
  });

  socket.on('dk:san-sang', (raw: any) => {
    const p = layPhong(raw);
    const g = p?.ghe.find((x) => x.userId === user.id);
    if (!p || !g || p.trangThai !== 'cho') return;
    g.sanSang = raw?.sanSang !== false;
    phat(p);
    thuBatDau(p);
  });

  socket.on('dk:nuoc', (raw: any, cb: unknown) => {
    const p = layPhong(raw);
    if (!p) return traLoi(cb, { ok: false, loi: 'Phòng đã đóng.' });
    const ghe = p.ghe.findIndex((g) => g.userId === user.id);
    if (ghe < 0) return traLoi(cb, { ok: false, loi: 'Bạn đang xem, không phải người chơi.' });
    if (Number(raw?.soNuoc) !== p.soNuoc) return traLoi(cb, { ok: false, loi: 'Bàn đã đổi — đang tải lại.', phong: dto(p, user.id) });
    try {
      const loi = diNuoc(p, ghe, raw?.nuoc);
      traLoi(cb, loi ? { ok: false, loi } : { ok: true });
    } catch (e) { logger.error('[doiKhang] nuoc', { err: String(e) }); traLoi(cb, { ok: false, loi: 'Nước đi lỗi.' }); }
  });

  socket.on('dk:dau-hang', (raw: any) => {
    const p = layPhong(raw);
    const ghe = p ? p.ghe.findIndex((g) => g.userId === user.id) : -1;
    if (!p || ghe < 0 || p.trangThai !== 'dang-danh') return;
    ketThuc(p, { thang: p.ghe.map((_, i) => i).filter((i) => i !== ghe), hoa: false, lyDo: 'dau-hang' }, ghe);
  });

  socket.on('dk:xin-hoa', (raw: any) => {
    const p = layPhong(raw);
    const ghe = p ? p.ghe.findIndex((g) => g.userId === user.id) : -1;
    if (!p || ghe < 0 || p.trangThai !== 'dang-danh' || p.ghe.length !== 2 || p.ghe.some((g) => g.bot)) return;
    p.xinHoa = ghe;
    phat(p);
  });

  socket.on('dk:tra-loi-hoa', (raw: any) => {
    const p = layPhong(raw);
    const ghe = p ? p.ghe.findIndex((g) => g.userId === user.id) : -1;
    if (!p || ghe < 0 || p.xinHoa == null || p.xinHoa === ghe || p.trangThai !== 'dang-danh') return;
    if (raw?.dongY) ketThuc(p, { thang: [], hoa: true, lyDo: 'thoa-thuan' }, null);
    else { p.xinHoa = null; phat(p); }
  });

  socket.on('dk:tai-dau', (raw: any) => {
    const p = layPhong(raw);
    const g = p?.ghe.find((x) => x.userId === user.id);
    if (!p || !g || p.trangThai !== 'xong') return;
    g.taiDau = true;
    // Ghế đã trống (đối thủ rời hẳn) ⇒ đừng treo "chờ đối thủ" mãi: về phòng chờ để mời người khác.
    if (p.ghe.some((x) => x.userId == null && !x.bot)) {
      p.trangThai = 'cho'; p.state = null; p.ketQua = null; p.doiElo = null;
      p.ghe.forEach((x) => { x.sanSang = !!x.bot; x.taiDau = false; });
      phat(p);
      return;
    }
    if (p.ghe.every((x) => x.bot || x.taiDau)) {
      // Hai người: đổi bên mỗi ván (Trắng/Đỏ/đi trước luân phiên) — đảo ghế cùng tỷ số.
      if (p.ghe.length === 2 && p.tro !== 'tien-len' && !p.ghe.some((x) => x.bot)) { p.ghe.reverse(); p.tiSo.reverse(); }
      p.trangThai = 'cho';
      p.ghe.forEach((x) => { x.sanSang = true; });
      batDau(p);
    } else phat(p);
  });

  let chatGanNhat = 0;
  socket.on('dk:chat', (raw: any) => {
    const p = layPhong(raw);
    const text = String(raw?.text ?? '').trim().slice(0, 200);
    if (!p || !p.nghe.has(socket.id) || !text || Date.now() - chatGanNhat < 600) return;
    chatGanNhat = Date.now();
    io.to(khoa(p.ma)).emit('dk:chat', { maPhong: p.ma, userId: user.id, ten: p.ghe.find((g) => g.userId === user.id)?.ten ?? user.username, text, luc: Date.now() });
  });

  let camXucGanNhat = 0;
  socket.on('dk:cam-xuc', (raw: any) => {
    const p = layPhong(raw);
    const emoji = String(raw?.emoji ?? '').slice(0, 8);
    if (!p || !p.nghe.has(socket.id) || !emoji || Date.now() - camXucGanNhat < 300) return;
    camXucGanNhat = Date.now();
    io.to(khoa(p.ma)).emit('dk:cam-xuc', { maPhong: p.ma, userId: user.id, emoji });
  });

  socket.on('dk:ban-online', async (_raw: unknown, cb: unknown) => {
    try {
      const { getOnlineUserIds } = await import('./messaging.socket.js');
      traLoi(cb, { ok: true, ban: await dv.banOnline(user.id, new Set(getOnlineUserIds())) });
    } catch { traLoi(cb, { ok: false, ban: [] }); }
  });

  socket.on('disconnect', () => {
    for (const [tro, hang] of hangGhep) hangGhep.set(tro, hang.filter((h) => h.socketId !== socket.id));
    for (const p of [...phongs.values()]) {
      if (!p.nghe.delete(socket.id)) continue;
      if (![...p.nghe.values()].includes(user.id)) roiGhe(p, user.id);
      if (phongs.has(p.ma)) phat(p);
    }
  });
}

// Dọn phòng bỏ hoang: không ai nghe và không đổi gì 10 phút (phòng 'cho'/'xong').
setInterval(() => {
  const now = Date.now();
  for (const p of phongs.values()) {
    if (p.trangThai !== 'dang-danh' && p.nghe.size === 0 && now - p.chamLuc > 10 * 60_000) {
      if (p.henGio) clearTimeout(p.henGio);
      if (p.henBot) clearTimeout(p.henBot);
      phongs.delete(p.ma);
    }
  }
}, 60_000).unref();

/** Cho REST/quản trị: số bàn đang mở. */
export function thongKeDoiKhang() {
  let dangDanh = 0;
  for (const p of phongs.values()) if (p.trangThai === 'dang-danh') dangDanh++;
  return { phong: phongs.size, dangDanh };
}
