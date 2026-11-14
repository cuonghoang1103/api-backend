/**
 * CT Language — ĐỒNG BỘ SỔ TAY: phần CSDL (bảng `ctl_so_tu_muc`). Luật kiểm + gộp: `soTuDongBoThuan.ts`.
 *
 *   day(userId, muc)  — nhận một lô ≤ 500 bản ghi; bản mới hơn thắng theo từng bản ghi; trả mốc mới.
 *   keo(userId, tu)   — mọi bản ghi có `phien_ban > tu` (kể cả bia mộ), tối đa 2.000 / lần, `conNua` ⇒ kéo tiếp.
 *   trangThai(userId) — số sổ / thẻ / ngày + mốc hiện tại.
 *
 * Mọi lần ghi của MỘT người chạy tuần tự (`pg_advisory_xact_lock`) ⇒ `phien_ban` của người đó tăng đúng theo thứ tự
 * commit, nên app kéo theo mốc không bao giờ bỏ sót một lần ghi đang dở của chính máy khác.
 * Xoá tài khoản: `dataRights.service.ts › anonymizeAccount` xoá hết các dòng (user không bị xoá hẳn nên FK CASCADE
 * không chạy tới).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import {
  GIOI_HAN_SO_TU, KEO_TOI_DA, LOAI_SO_TU, LO_TOI_DA, TONG_DONG_TOI_DA, apTran, chuanLo,
  type BanGhiCo, type LoaiSoTu,
} from './soTuDongBoThuan.js';

/** Khoá tư vấn theo người (không đụng khoá khác của hệ thống: không gian riêng 0x5c7). */
const KHONG_GIAN_KHOA = 0x5c7;

export async function day(userId: number, muc: unknown, bayGio: Date = new Date()) {
  if (!Array.isArray(muc)) throw new BadRequestError('muc phải là mảng', 'CTL_SO_TU_SAI');
  if (muc.length > LO_TOI_DA) throw new BadRequestError(`Mỗi lần gửi tối đa ${LO_TOI_DA} mục.`, 'CTL_SO_TU_LO_LON');
  const { nhan, loi } = chuanLo(muc, bayGio);
  const kq = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${KHONG_GIAN_KHOA}::int, ${userId}::int)`;
    const dem = await tx.$queryRaw<{ loai: string; song: bigint; tong: bigint }[]>`
      SELECT loai, COUNT(*) FILTER (WHERE NOT xoa) AS song, COUNT(*) AS tong
      FROM ctl_so_tu_muc WHERE user_id = ${userId} GROUP BY loai`;
    const dangSong = Object.fromEntries(LOAI_SO_TU.map((l) => [l, 0])) as Record<LoaiSoTu, number>;
    let tongDong = 0;
    for (const d of dem) {
      if ((LOAI_SO_TU as readonly string[]).includes(d.loai)) dangSong[d.loai as LoaiSoTu] = Number(d.song);
      tongDong += Number(d.tong);
    }
    if (tongDong >= TONG_DONG_TOI_DA * 0.9) {
      // Sắp chạm trần tổng ⇒ dọn bia mộ cũ (máy nào offline > 90 ngày có thể thấy lại mục đã xoá — chấp nhận).
      const don = await tx.$executeRaw`
        DELETE FROM ctl_so_tu_muc WHERE user_id = ${userId} AND xoa AND cap_nhat < ${new Date(bayGio.getTime() - 90 * 86_400_000)}`;
      tongDong -= don;
    }
    const co = new Map<string, BanGhiCo>();
    if (nhan.length) {
      const hang = await tx.$queryRaw<{ loai: string; khoa: string; cap_nhat: Date; xoa: boolean }[]>`
        SELECT m.loai, m.khoa, m.cap_nhat, m.xoa FROM ctl_so_tu_muc m
        JOIN jsonb_to_recordset(${JSON.stringify(nhan.map((b) => ({ loai: b.loai, khoa: b.khoa })))}::jsonb) AS x(loai text, khoa text)
          ON m.loai = x.loai AND m.khoa = x.khoa
        WHERE m.user_id = ${userId}`;
      for (const h of hang) co.set(`${h.loai}\u0000${h.khoa}`, { capNhat: h.cap_nhat, xoa: h.xoa });
    }
    const { ghi, boQua, day: tuChoi } = apTran(nhan, co, dangSong, tongDong);
    let daGhi = 0;
    if (ghi.length) {
      const lo = JSON.stringify(ghi.map((b) => ({ loai: b.loai, khoa: b.khoa, du_lieu: b.duLieu, cap_nhat: b.capNhat.toISOString(), xoa: b.xoa })));
      // WHERE ở nhánh UPDATE chốt lại "mới hơn thắng" ngay trong câu lệnh (phòng khi luật ở trên lệch với CSDL).
      daGhi = await tx.$executeRaw`
        INSERT INTO ctl_so_tu_muc (user_id, loai, khoa, du_lieu, cap_nhat, xoa)
        SELECT ${userId}, x.loai, x.khoa, x.du_lieu, x.cap_nhat, x.xoa
        FROM jsonb_to_recordset(${lo}::jsonb) AS x(loai text, khoa text, du_lieu jsonb, cap_nhat timestamptz, xoa boolean)
        ON CONFLICT (user_id, loai, khoa) DO UPDATE
          SET du_lieu = EXCLUDED.du_lieu, cap_nhat = EXCLUDED.cap_nhat, xoa = EXCLUDED.xoa,
              phien_ban = nextval('ctl_so_tu_muc_phien_ban_seq')
          WHERE EXCLUDED.cap_nhat > ctl_so_tu_muc.cap_nhat`;
    }
    const [m] = await tx.$queryRaw<{ moc: bigint | null }[]>`SELECT MAX(phien_ban) AS moc FROM ctl_so_tu_muc WHERE user_id = ${userId}`;
    return { daGhi, boQua: boQua + (ghi.length - daGhi), tuChoi, moc: String(m?.moc ?? 0) };
  }, { timeout: 30_000 });
  return { ...kq, loi: [...loi, ...kq.tuChoi].slice(0, 50), soLoi: loi.length + kq.tuChoi.length };
}

/** Mốc app gửi: chuỗi số nguyên ≥ 0 (bigint — không ép qua Number). */
export function docMoc(v: unknown): bigint {
  if (v === undefined || v === null || v === '') return 0n;
  const s = String(v);
  if (!/^\d{1,19}$/.test(s)) throw new BadRequestError('tu phải là mốc số', 'CTL_SO_TU_SAI');
  return BigInt(s);
}

export async function keo(userId: number, tuV: unknown, gioiHanV?: unknown) {
  const tu = docMoc(tuV);
  const n = Math.min(KEO_TOI_DA, Math.max(1, Number(gioiHanV) || KEO_TOI_DA));
  const hang = await prisma.$queryRaw<{ loai: string; khoa: string; du_lieu: unknown; cap_nhat: Date; xoa: boolean; phien_ban: bigint }[]>`
    SELECT loai, khoa, du_lieu, cap_nhat, xoa, phien_ban FROM ctl_so_tu_muc
    WHERE user_id = ${userId} AND phien_ban > ${tu}
    ORDER BY phien_ban LIMIT ${n + 1}`;
  const conNua = hang.length > n;
  const ds = hang.slice(0, n);
  return {
    muc: ds.map((h) => ({
      loai: h.loai, khoa: h.khoa, capNhat: h.cap_nhat.toISOString(),
      ...(h.xoa ? { xoa: true } : { duLieu: h.du_lieu }),
    })),
    moc: String(ds.length ? ds[ds.length - 1].phien_ban : tu),
    conNua,
  };
}

export async function trangThai(userId: number) {
  const dem = await prisma.$queryRaw<{ loai: string; song: bigint; moc: bigint | null; luc: Date | null }[]>`
    SELECT loai, COUNT(*) FILTER (WHERE NOT xoa) AS song, MAX(phien_ban) AS moc, MAX(cap_nhat) AS luc
    FROM ctl_so_tu_muc WHERE user_id = ${userId} GROUP BY loai`;
  const so = (l: string) => Number(dem.find((d) => d.loai === l)?.song ?? 0);
  const moc = dem.reduce((a, d) => (d.moc != null && d.moc > a ? d.moc : a), 0n);
  const luc = dem.reduce<Date | null>((a, d) => (d.luc && (!a || d.luc > a) ? d.luc : a), null);
  return { soSo: so('so'), soThe: so('the'), soNgay: so('ngay'), moc: String(moc), suaCuoi: luc?.toISOString() ?? null, gioiHan: GIOI_HAN_SO_TU };
}
