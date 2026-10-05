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
import { banOnline, layElo, layNguoi, luuVan, tenHienThi } from '../services/doiKhang/doiKhang.service.js';

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
const phongs = new Map<string, Phong>();
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
  };
}

export function registerDoiKhang(io: IOServer, socket: Socket, user: ConnUser): void {
  const phat = (p: Phong) => {
    p.chamLuc = Date.now();
    for (const [sid, uid] of p.nghe) io.to(sid).emit('dk:phong', dto(p, uid));
  };
  const traLoi = (cb: unknown, data: unknown) => { if (typeof cb === 'function') (cb as (d: unknown) => void)(data); };
  const layPhong = (raw: unknown) => phongs.get(String((raw as { maPhong?: unknown })?.maPhong ?? '').toUpperCase());

  async function ngoiVao(p: Phong, idx: number, userId: number) {
    const [nguoi, elo] = await Promise.all([layNguoi([userId]), layElo(p.tro, [userId])]);
    const u = nguoi.get(userId);
    p.ghe[idx] = { userId, ten: u ? tenHienThi(u) : user.username, avatar: u?.avatarUrl ?? null, elo: elo.get(userId) ?? 1200, sanSang: false, taiDau: false, roiLuc: null };
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
    henLuot(p);
    phat(p);
  }

  function thuBatDau(p: Phong) {
    if (p.trangThai !== 'cho') return;
    if (p.ghe.length < LUAT[p.tro].soNguoi.min) return;
    if (p.ghe.every((g) => g.bot || (g.userId != null && g.sanSang))) batDau(p);
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
    void luuVan({ tro: p.tro, maPhong: p.ma, nguoiChoi, ketQua: kq, soNuoc: p.soNuoc, lichSu: p.lichSu.map((l) => ({ g: l.ghe, n: l.nuoc })), batDau: p.batDau ?? new Date() })
      .then((r) => {
        if (!r) return;
        p.doiElo = r.sau.map((e, i) => e - r.truoc[i]!);
        p.ghe.forEach((g, i) => { if (!g.bot) g.elo = r.sau[i]!; });
        phat(p);
      })
      .catch((e) => logger.error('[doiKhang] lưu ván lỗi', { err: String(e) }));
  }

  function roiGhe(p: Phong, userId: number) {
    const idx = p.ghe.findIndex((g) => g.userId === userId);
    if (idx < 0) return;
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
      p.ghe[idx] = { userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null };
    }
    if (!p.ghe.some((g) => g.userId != null && !g.bot)) { xoaPhong(p); return; }
    if (p.chuId === userId) p.chuId = p.ghe.find((g) => g.userId != null && !g.bot)!.userId!;
  }

  function xoaPhong(p: Phong) {
    dungHen(p);
    p.henRoi.forEach((t) => clearTimeout(t));
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
        else if (p.tro === 'tien-len' && p.ghe.length < LUAT['tien-len'].soNguoi.max) { p.ghe.push({ userId: null, ten: '', avatar: null, elo: null, sanSang: false, taiDau: false, roiLuc: null }); p.tiSo.push(0); await ngoiVao(p, p.ghe.length - 1, user.id); }
      }
      vaoNghe(p);
      traLoi(cb, { ok: true, phong: dto(p, user.id) });
      phat(p);
    } catch (e) { logger.error('[doiKhang] vao', { err: String(e) }); traLoi(cb, { ok: false, loi: 'Không vào được phòng.' }); }
  });

  socket.on('dk:roi', (raw: any) => {
    const p = layPhong(raw);
    if (!p) return;
    p.nghe.delete(socket.id);
    void socket.leave(khoa(p.ma));
    if (![...p.nghe.values()].includes(user.id)) roiGhe(p, user.id);
    if (phongs.has(p.ma)) phat(p);
  });

  let moiGanNhat = 0;
  socket.on('dk:moi', async (raw: any, cb: unknown) => {
    const p = layPhong(raw);
    const den = Number(raw?.userId);
    if (!p || !p.ghe.some((g) => g.userId === user.id) || !Number.isInteger(den) || den === user.id) return traLoi(cb, { ok: false, loi: 'Không mời được.' });
    if (Date.now() - moiGanNhat < 1500) return traLoi(cb, { ok: false, loi: 'Chậm lại một chút nhé.' });
    moiGanNhat = Date.now();
    const nguoi = await layNguoi([user.id]).catch(() => new Map());
    const u = nguoi.get(user.id);
    io.to(`user:${den}`).emit('dk:loi-moi', { maPhong: p.ma, tro: p.tro, tu: { id: user.id, ten: u ? tenHienThi(u) : user.username, avatar: u?.avatarUrl ?? null } });
    traLoi(cb, { ok: true });
  });

  socket.on('dk:tra-loi-moi', (raw: any) => {
    const p = layPhong(raw);
    if (!p || raw?.dongY) return;
    io.to(`user:${p.chuId}`).emit('dk:tu-choi', { maPhong: p.ma, userId: user.id, ten: user.username });
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
      traLoi(cb, { ok: true, ban: await banOnline(user.id, new Set(getOnlineUserIds())) });
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
