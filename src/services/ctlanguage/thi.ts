/**
 * CT Language — THI THỬ CHUẨN (Đợt B, 14/11/2026): nạp đề từ repo + lượt thi trên CSDL.
 * Luật thuần (khuôn đề, chấm, xếp lớp, giới hạn free) ở `thiThuan.ts`. Tuyến: `routes/ctlanguage.thi.routes.ts`.
 *
 * - Đề: `content/ctlanguage/de-thi/*.json` (tự soạn — KHÔNG chép đề thật), nạp một lần, đề hỏng bị bỏ + ghi log.
 * - Khách (chưa đăng nhập): xem danh mục + tải đề + tự chấm trên máy; KHÔNG lên bảng, không lưu máy chủ.
 * - Đăng nhập: `batDau` tạo dòng lượt (đếm free 1 đề/cấp/tuần — Pro không giới hạn, quyền Pro do máy chủ phán),
 *   `nop` máy chủ CHẤM LẠI từ đề (không tin điểm app gửi), thời gian đo từ `batDauLuc`.
 * - Vinh danh tuần: 7 ngày gần nhất, mỗi người một dòng tốt nhất; chỉ lần nộp ĐẦU của mỗi đề được lên bảng
 *   (nộp xong là thấy đáp án ⇒ thi lại không công bằng), đề phải `xepHang` (đề nói tự chấm thì không).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { logger } from '../../utils/logger.js';
import { TAC_GIA, TAC_GIA_SONG, tacGiaGon } from './congDong.js';
import {
  CAP_THEO_NN, NN_THI, chamDe, dauTuanVn, deChoApp, duocThi, kiemDe, tatCaCau, tomTatDe, xepVinhDanh,
  type DeThi, type NnThi, type TraLoi,
} from './thiThuan.js';

export const THU_MUC_DE = path.join(process.cwd(), 'content', 'ctlanguage', 'de-thi');

let khoDe: Map<string, DeThi> | null = null;

/** Nạp mọi đề hợp lệ (đề lỗi bị bỏ, ghi log — một đề hỏng không được làm sập cả phòng thi). */
export function napDe(thuMuc = THU_MUC_DE): Map<string, DeThi> {
  const ra = new Map<string, DeThi>();
  let tep: string[] = [];
  try { tep = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.json')).sort(); } catch { /* chưa có thư mục */ }
  for (const f of tep) {
    try {
      const de = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8')) as DeThi;
      const loi = kiemDe(de);
      if (loi.length || de.id !== f.replace(/\.json$/, '')) { logger.error('[ctl-thi] bỏ đề không hợp lệ', { tep: f, loi: loi.slice(0, 5) }); continue; }
      ra.set(de.id, de);
    } catch (e) {
      logger.error('[ctl-thi] không đọc được đề', { tep: f, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return ra;
}

function kho(): Map<string, DeThi> { return (khoDe ??= napDe()); }
/** Test: thay kho đề. */
export function _datKhoDe(m: Map<string, DeThi> | null) { khoDe = m; }

export function docNn(v: unknown): NnThi {
  const s = String(v ?? '');
  if (!(NN_THI as readonly string[]).includes(s)) throw new BadRequestError('nn phải là en, ja hoặc zh');
  return s as NnThi;
}

function layDe(id: unknown): DeThi {
  const de = kho().get(String(id ?? ''));
  if (!de) throw new NotFoundError('Không tìm thấy đề thi này.');
  return de;
}

/** Khoảng [thứ Hai 00:00, thứ Hai kế) giờ VN của tuần chứa `bayGio`. */
function trongTuan(bayGio: Date) {
  const tu = dauTuanVn(bayGio);
  return { gte: tu, lt: new Date(tu.getTime() + 7 * 86_400_000) };
}

async function deDaThiTuanNay(userId: number, cap: string, bayGio: Date): Promise<string[]> {
  const ds = await prisma.ctlLuotThi.findMany({
    where: { userId, cap, kyThi: { not: 'XEP-LOP' }, batDauLuc: trongTuan(bayGio) },
    distinct: ['deId'], select: { deId: true },
  });
  return ds.map((d) => d.deId);
}

/** Danh mục phòng thi của một ngôn ngữ: kỳ thi → cấp → đề (+ điểm cao nhất, lượt free còn lại nếu đã đăng nhập). */
export async function danhMuc(nnRaw: unknown, userId: number | null, bayGio = new Date()) {
  const nn = docNn(nnRaw);
  const de = [...kho().values()].filter((d) => d.nn === nn);
  const laPro = userId ? await isProEffective(userId) : false;
  const cua = userId
    ? await prisma.ctlLuotThi.findMany({
      where: { userId, nn, nopLuc: { not: null } },
      select: { deId: true, cap: true, diem: true, batDauLuc: true }, orderBy: { id: 'desc' }, take: 500,
    })
    : [];
  const dauTuan = dauTuanVn(bayGio);
  const tuanNay = userId
    ? await prisma.ctlLuotThi.findMany({ where: { userId, nn, kyThi: { not: 'XEP-LOP' }, batDauLuc: trongTuan(bayGio) }, distinct: ['cap', 'deId'], select: { cap: true, deId: true } })
    : [];
  const caoNhat = new Map<string, number>();
  const soLan = new Map<string, number>();
  for (const l of cua) {
    caoNhat.set(l.deId, Math.max(caoNhat.get(l.deId) ?? 0, l.diem ?? 0));
    soLan.set(l.deId, (soLan.get(l.deId) ?? 0) + 1);
  }
  const xl = de.find((d) => d.kyThi === 'XEP-LOP');
  return {
    nn, laPro, luotFreeMoiCapTuan: 1, hetTuanLuc: new Date(dauTuan.getTime() + 7 * 86_400_000),
    xepLop: xl ? tomTatDe(xl) : null,
    cap: CAP_THEO_NN[nn].map((c) => {
      const daThi = tuanNay.filter((t) => t.cap === c.cap).map((t) => t.deId);
      return {
        ...c,
        deDaThiTuanNay: daThi,
        de: de.filter((d) => d.cap === c.cap).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true })).map((d) => ({
          ...tomTatDe(d),
          diemCaoNhat: caoNhat.get(d.id) ?? null,
          soLanThi: soLan.get(d.id) ?? 0,
          duocThi: duocThi({ laPro, kyThi: d.kyThi, deId: d.id, deDaThiTuanNay: daThi }).duoc,
        })),
      };
    }).filter((c) => c.de.length),
  };
}

/** Đề đầy đủ cho app (free: bỏ giải thích chi tiết, giữ đáp án). */
export async function deCho(id: unknown, userId: number | null) {
  const de = layDe(id);
  const laPro = userId ? await isProEffective(userId) : false;
  return { ...deChoApp(de, laPro), laPro };
}

/** Bắt đầu một lượt (đăng nhập). Free hết lượt của cấp trong tuần ⇒ 403 `CTL_THI_HET_LUOT`. */
export async function batDau(userId: number, deId: unknown, bayGio = new Date()) {
  const de = layDe(deId);
  const laPro = await isProEffective(userId);
  const daThi = await deDaThiTuanNay(userId, de.cap, bayGio);
  const q = duocThi({ laPro, kyThi: de.kyThi, deId: de.id, deDaThiTuanNay: daThi });
  if (!q.duoc) {
    throw new AppError(`Bản miễn phí thi 1 đề ${de.cap.replace(/^([A-Z]+)(\d)$/, '$1 $2')} mỗi tuần (làm lại đúng đề đó thì được). Pro thi không giới hạn.`, 403, 'CTL_THI_HET_LUOT');
  }
  const luot = await prisma.ctlLuotThi.create({ data: { userId, nn: de.nn, deId: de.id, kyThi: de.kyThi, cap: de.cap, batDauLuc: bayGio } });
  return { luotId: luot.id, deId: de.id, laPro, batDauLuc: luot.batDauLuc };
}

function docTraLoi(v: unknown): TraLoi {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new BadRequestError('traLoi phải là đối tượng {idCâu: câu trả lời}');
  const ra: TraLoi = {};
  let n = 0;
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    if (++n > 400 || k.length > 12) throw new BadRequestError('traLoi không hợp lệ');
    if (typeof x === 'number' && Number.isFinite(x)) ra[k] = x;
    else if (typeof x === 'string') ra[k] = x.slice(0, 300);
  }
  return ra;
}

/** Nộp bài: máy chủ chấm lại, lưu, trả phiếu điểm + thứ hạng tuần. Nộp lần hai ⇒ trả lại phiếu đã lưu. */
export async function nop(userId: number, luotIdRaw: unknown, b: { traLoi?: unknown }, bayGio = new Date()) {
  const luotId = Number(luotIdRaw);
  if (!Number.isInteger(luotId) || luotId <= 0) throw new BadRequestError('Lượt thi không hợp lệ');
  const luot = await prisma.ctlLuotThi.findFirst({ where: { id: luotId, userId } });
  if (!luot) throw new NotFoundError('Không tìm thấy lượt thi này.');
  const de = layDe(luot.deId);
  if (luot.nopLuc) return phieu(luot, de, userId, bayGio);

  const traLoi = docTraLoi(b?.traLoi);
  const kq = chamDe(de, traLoi);
  const tranGiay = de.phan.reduce((a, p) => a + p.phut, 0) * 60;
  const giay = Math.min(tranGiay, Math.max(0, Math.round((bayGio.getTime() - luot.batDauLuc.getTime()) / 1000)));
  // Lên bảng: đề có chấm máy + lần nộp ĐẦU của đề này + không nhanh bất thường (< 2 giây/câu = bấm bừa hoặc chép).
  const daNop = await prisma.ctlLuotThi.count({ where: { userId, deId: de.id, nopLuc: { not: null } } });
  const xepHang = de.xepHang && daNop === 0 && giay >= tatCaCau(de).length * 2;
  // Giành quyền nộp bằng điều kiện nopLuc null — bấm "Nộp" hai lần không ghi hai lần.
  const r = await prisma.ctlLuotThi.updateMany({
    where: { id: luot.id, nopLuc: null },
    data: {
      nopLuc: bayGio, diem: kq.diem, diemToiDa: kq.diemToiDa, dung: kq.dung, tong: kq.tong, dat: kq.dat, giay, xepHang,
      chiTiet: { phan: kq.phan, traLoi, ...(kq.xepLop ? { xepLop: kq.xepLop } : {}) } as unknown as Prisma.InputJsonValue,
    },
  });
  const sau = await prisma.ctlLuotThi.findUniqueOrThrow({ where: { id: luot.id } });
  if (r.count === 0) logger.info('[ctl-thi] nộp trùng — trả phiếu đã lưu', { luotId });
  return phieu(sau, de, userId, bayGio);
}

type Luot = Awaited<ReturnType<typeof prisma.ctlLuotThi.findUniqueOrThrow>>;

async function phieu(l: Luot, de: DeThi, userId: number, bayGio: Date) {
  const ct = (l.chiTiet ?? {}) as { phan?: unknown; traLoi?: TraLoi; xepLop?: unknown };
  const kq = chamDe(de, ct.traLoi ?? {});
  const bang = l.xepHang ? await vinhDanh(de.nn, de.cap, userId, bayGio) : null;
  return {
    luotId: l.id, deId: l.deId, cap: l.cap, kyThi: l.kyThi,
    diem: l.diem ?? kq.diem, diemToiDa: l.diemToiDa ?? kq.diemToiDa, dung: l.dung ?? kq.dung, tong: l.tong ?? kq.tong,
    dat: l.dat ?? kq.dat, diemDat: de.diemDat, giay: l.giay ?? 0, nopLuc: l.nopLuc,
    phan: kq.phan, sai: kq.sai, tuCanOn: kq.tuCanOn, xepLop: kq.xepLop ?? null,
    xepHang: l.xepHang, hangTuan: bang?.cuaToi?.hang ?? null,
  };
}

/** Lịch sử các lượt ĐÃ NỘP (mới nhất trước) — biểu đồ tiến bộ ở app. */
export async function lichSu(userId: number, nnRaw: unknown) {
  const nn = docNn(nnRaw);
  const ds = await prisma.ctlLuotThi.findMany({
    where: { userId, nn, nopLuc: { not: null } }, orderBy: { nopLuc: 'desc' }, take: 100,
    select: { id: true, deId: true, kyThi: true, cap: true, diem: true, diemToiDa: true, dung: true, tong: true, dat: true, giay: true, nopLuc: true, chiTiet: true },
  });
  return {
    items: ds.map((l) => {
      const ct = (l.chiTiet ?? {}) as { phan?: unknown; xepLop?: unknown };
      return {
        luotId: l.id, deId: l.deId, tenDe: kho().get(l.deId)?.ten ?? l.deId, kyThi: l.kyThi, cap: l.cap,
        diem: l.diem ?? 0, diemToiDa: l.diemToiDa ?? 0, dung: l.dung ?? 0, tong: l.tong ?? 0, dat: l.dat ?? false,
        giay: l.giay ?? 0, nopLuc: l.nopLuc, phan: ct.phan ?? [], xepLop: ct.xepLop ?? null,
      };
    }),
  };
}

/** Vinh danh tuần của một cấp: 7 ngày gần nhất, mỗi người một dòng tốt nhất, top 50 + dòng của người xem. */
export async function vinhDanh(nnRaw: unknown, capRaw: unknown, userId: number | null, bayGio = new Date()) {
  const nn = docNn(nnRaw);
  const cap = String(capRaw ?? '');
  if (!CAP_THEO_NN[nn].some((c) => c.cap === cap)) throw new BadRequestError('Cấp độ không hợp lệ');
  const tu = new Date(bayGio.getTime() - 7 * 86_400_000);
  const ds = await prisma.ctlLuotThi.findMany({
    where: { nn, cap, xepHang: true, nopLuc: { gte: tu }, user: TAC_GIA_SONG },
    select: { userId: true, deId: true, diem: true, diemToiDa: true, giay: true, nopLuc: true, user: { select: TAC_GIA } },
    orderBy: [{ diem: 'desc' }, { giay: 'asc' }], take: 2000,
  });
  const tatCa = xepVinhDanh(ds.map((d) => ({ ...d, diem: d.diem ?? 0, giay: d.giay ?? 0, luc: d.nopLuc ?? bayGio })), 5000);
  const dong = (d: (typeof tatCa)[number]) => ({
    hang: d.hang, nguoi: tacGiaGon(d.user), diem: d.diem, diemToiDa: d.diemToiDa ?? 0, giay: d.giay,
    deId: d.deId, tenDe: kho().get(d.deId)?.ten ?? d.deId, luc: d.luc, laToi: d.userId === userId,
  });
  const toi = userId ? tatCa.find((d) => d.userId === userId) : undefined;
  return { nn, cap, tuNgay: tu, soNguoi: tatCa.length, items: tatCa.slice(0, 50).map(dong), cuaToi: toi ? dong(toi) : null };
}
