/**
 * CT Language — KHÁM PHÁ ở tab Hôm nay (Đợt C, 14/11/2026 — docs/ct-language-khao-sat-hanzii.md mục 3).
 *
 *   · Từ vựng theo chủ đề — nội dung tĩnh `chuDeTu.ts`, gắn id mục từ điển thật khi khớp chữ.
 *   · Từ được tra nhiều — đếm lượt MỞ mục từ điển (`GET /tu-dien/muc/:id`) ẨN DANH theo (ngôn ngữ, chữ, ngày); gom trong
 *     RAM rồi ghi dồn mỗi 30 giây (`xaLuotTra`) — một lượt tra không tốn một câu ghi CSDL. Top 20 của 7 ngày gần nhất.
 *   · Phút học hôm nay + xếp hạng ngày/tuần — app đo thời gian ở màn học/luyện, gửi TỔNG của ngày (máy chủ giữ GREATEST).
 *     Người chặn nhau (user_blocks, hai chiều) không thấy nhau; người tự ẩn (`ctl_xep_hang_an`) không lên bảng;
 *     tài khoản khoá/vô hiệu không lên bảng.
 *   · Cuộc gọi CuongMini — máy chủ tự đếm ở lượt MỞ ĐẦU (không âm thanh) của `/ai/goi/luong` (`demCuocGoi`).
 */
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { dsChan, TAC_GIA, TAC_GIA_SONG, tacGiaGon } from './congDong.js';
import { CHU_DE_TU, idAm, type NnChuDe } from './chuDeTu.js';
import { congNgay, docNgay, kiemHoatDong, ngayVn, type NnKP } from './khamPhaThuan.js';
import { kiemNn } from './tuDien.js';

// ─── Từ vựng theo chủ đề ─────────────────────────────────────────────────────────────────────────────────────────
export function dsChuDe(nnGoc: string) {
  const nn = kiemNn(nnGoc) as NnChuDe;
  return { items: CHU_DE_TU.map((c) => ({ ma: c.ma, ten: c.ten, bieuTuong: c.bieuTuong, soTu: c.tu[nn].length, mau: c.tu[nn].slice(0, 3).map((t) => t[0]) })) };
}

const DEM_CHU_DE = new Map<string, { luc: number; v: unknown }>();

export async function chuDe(nnGoc: string, ma: string) {
  const nn = kiemNn(nnGoc) as NnChuDe;
  const c = CHU_DE_TU.find((x) => x.ma === ma);
  if (!c) throw new NotFoundError('Không có chủ đề này.');
  const k = `${nn}:${ma}`, dem = DEM_CHU_DE.get(k);
  if (dem && Date.now() - dem.luc < 6 * 3600_000) return dem.v;
  const ds = c.tu[nn];
  const muc = await prisma.ctlTu.findMany({
    where: { nn, chu: { in: ds.map((t) => t[0]) } }, orderBy: { uuTien: 'desc' },
    select: { id: true, chu: true, doc: true, hanViet: true, nghiaVi: true },
  });
  const theoChu = new Map<string, (typeof muc)[number]>();
  for (const m of muc) if (!theoChu.has(m.chu)) theoChu.set(m.chu, m);
  const v = {
    ma: c.ma, ten: c.ten, bieuTuong: c.bieuTuong,
    tu: ds.map(([chu, doc, nghia]) => {
      const m = theoChu.get(chu);
      return {
        id: m?.id ?? idAm(nn, chu), chu,
        // zh: pinyin chuẩn của từ điển thắng bản soạn tay · en: IPA của từ điển · ja: kana soạn tay (từ điển có thể ghi katakana).
        doc: (nn === 'ja' ? doc : m?.doc) || doc || null,
        hanViet: m?.hanViet ?? null,
        nghiaVi: nghia,
      };
    }),
  };
  DEM_CHU_DE.set(k, { luc: Date.now(), v });
  return v;
}

// ─── Từ được tra nhiều (ẩn danh) ─────────────────────────────────────────────────────────────────────────────────
const CHO_GHI = new Map<string, number>();   // "nn\u0000chữ\u0000ngày" ⇒ số lượt chưa ghi
let henGio: NodeJS.Timeout | null = null;

/** Ghi một lượt mở mục từ (không chặn yêu cầu, không lưu người tra). */
export function ghiLuotTra(nn: string, chu: string, luc = new Date()) {
  if (!['en', 'ja', 'zh'].includes(nn) || !chu || chu.length > 160) return;
  const k = `${nn}\u0000${chu}\u0000${ngayVn(luc)}`;
  if (CHO_GHI.size > 20_000) return;   // bão lượt tra: bỏ bớt còn hơn phình RAM
  CHO_GHI.set(k, (CHO_GHI.get(k) ?? 0) + 1);
  if (!henGio) {
    henGio = setTimeout(() => { henGio = null; void xaLuotTra(); }, 30_000);
    henGio.unref?.();
  }
}

/** Ghi dồn các lượt đang chờ xuống CSDL (một câu UPSERT cho cả mẻ). Dọn dòng > 10 ngày. */
export async function xaLuotTra() {
  if (!CHO_GHI.size) return 0;
  const me = [...CHO_GHI.entries()];
  CHO_GHI.clear();
  const nn = me.map(([k]) => k.split('\u0000')[0]!), chu = me.map(([k]) => k.split('\u0000')[1]!);
  const ngay = me.map(([k]) => k.split('\u0000')[2]!), so = me.map(([, v]) => v);
  try {
    await prisma.$executeRaw`
      INSERT INTO ctl_luot_tra (nn, chu, ngay, so)
      SELECT * FROM UNNEST(${nn}::varchar[], ${chu}::varchar[], ${ngay}::date[], ${so}::int[])
      ON CONFLICT (nn, chu, ngay) DO UPDATE SET so = ctl_luot_tra.so + EXCLUDED.so`;
    if (Math.random() < 0.05) await prisma.$executeRaw`DELETE FROM ctl_luot_tra WHERE ngay < ${docNgay(congNgay(ngayVn(), -10))}`;
  } catch (e) {
    logger.warn('[ctl-kham-pha] ghi lượt tra lỗi — bỏ mẻ này', { error: (e as Error).message, so: me.length });
  }
  return me.length;
}

const DEM_TRA_NHIEU = new Map<string, { luc: number; v: unknown }>();

/** Top 20 chữ được mở nhiều nhất 7 ngày qua (giờ VN), gắn mục từ điển hiện tại. Lọc chữ/nghĩa thô tục. */
export async function traNhieu(nnGoc: string) {
  const nn = kiemNn(nnGoc);
  const dem = DEM_TRA_NHIEU.get(nn);
  if (dem && Date.now() - dem.luc < 5 * 60_000) return dem.v;
  const tu = docNgay(congNgay(ngayVn(), -6))!;
  const top = await prisma.$queryRaw<{ chu: string; so: number }[]>`
    SELECT chu, SUM(so)::int AS so FROM ctl_luot_tra WHERE nn = ${nn} AND ngay >= ${tu}
    GROUP BY chu ORDER BY so DESC, chu LIMIT 40`;
  const muc = top.length
    ? await prisma.ctlTu.findMany({
        where: { nn, chu: { in: top.map((t) => t.chu) } }, orderBy: { uuTien: 'desc' },
        select: { id: true, chu: true, doc: true, hanViet: true, nghiaVi: true, nghiaEn: true },
      })
    : [];
  const theoChu = new Map<string, (typeof muc)[number]>();
  for (const m of muc) if (!theoChu.has(m.chu)) theoChu.set(m.chu, m);
  const items = top
    .map((t) => ({ t, m: theoChu.get(t.chu) }))
    .filter(({ t, m }) => m && !kiemNoiDung(`${t.chu} ${m.nghiaVi ?? ''} ${m.nghiaEn ?? ''}`).chan)
    .slice(0, 20)
    .map(({ t, m }, i) => ({
      hang: i + 1, soLuot: Number(t.so),
      muc: { id: m!.id, chu: m!.chu, doc: m!.doc, hanViet: m!.hanViet, nghiaVi: m!.nghiaVi, nghiaEn: m!.nghiaEn },
    }));
  const v = { tu: ngayVn(new Date(tu.getTime())), items };
  DEM_TRA_NHIEU.set(nn, { luc: Date.now(), v });
  return v;
}

// ─── Hoạt động học mỗi ngày ──────────────────────────────────────────────────────────────────────────────────────
/** App gửi tổng của ngày ⇒ giữ GREATEST từng cột (gửi lại không cộng dồn, máy khác chậm hơn không kéo lùi). */
export async function ghiHoatDong(userId: number, than: unknown) {
  const ds = kiemHoatDong(than);
  for (const m of ds) {
    await prisma.$executeRaw`
      INSERT INTO ctl_hoat_dong_ngay (user_id, nn, ngay, giay, the_on, thi, updated_at)
      VALUES (${userId}, ${m.nn}, ${docNgay(m.ngay)}, ${m.giay}, ${m.theOn}, ${m.thi}, NOW())
      ON CONFLICT (user_id, nn, ngay) DO UPDATE SET
        giay = GREATEST(ctl_hoat_dong_ngay.giay, EXCLUDED.giay),
        the_on = GREATEST(ctl_hoat_dong_ngay.the_on, EXCLUDED.the_on),
        thi = GREATEST(ctl_hoat_dong_ngay.thi, EXCLUDED.thi),
        updated_at = NOW()`;
  }
  return { daGhi: ds.length };
}

/** +1 cuộc gọi CuongMini hôm nay (giờ VN). Không bao giờ ném — đếm hỏng không được làm hỏng cuộc gọi. */
export async function demCuocGoi(userId: number, nnGoc: unknown) {
  const nn = nnGoc === 'ja' || nnGoc === 'zh' ? nnGoc : 'en';
  try {
    await prisma.$executeRaw`
      INSERT INTO ctl_hoat_dong_ngay (user_id, nn, ngay, goi, updated_at) VALUES (${userId}, ${nn}, ${docNgay(ngayVn())}, 1, NOW())
      ON CONFLICT (user_id, nn, ngay) DO UPDATE SET goi = ctl_hoat_dong_ngay.goi + 1, updated_at = NOW()`;
  } catch (e) {
    logger.warn('[ctl-kham-pha] đếm cuộc gọi lỗi', { userId, error: (e as Error).message });
  }
}

/** Phút học của tôi: hôm nay + 7 ngày (cho máy mới đăng nhập, khác máy đang đo). */
export async function hoatDongCuaToi(userId: number, nnGoc: string) {
  const nn = kiemNn(nnGoc);
  const homNay = ngayVn();
  const rows = await prisma.ctlHoatDongNgay.findMany({
    where: { userId, nn, ngay: { gte: docNgay(congNgay(homNay, -6))! } }, select: { ngay: true, giay: true, theOn: true, goi: true },
  });
  return { homNay, ngay: rows.map((r) => ({ ngay: r.ngay.toISOString().slice(0, 10), giay: r.giay, theOn: r.theOn, goi: r.goi })) };
}

// ─── Xếp hạng phút học ───────────────────────────────────────────────────────────────────────────────────────────
export type KyXepHang = 'ngay' | 'tuan';
export const docKy = (v: unknown): KyXepHang => (v === 'tuan' ? 'tuan' : 'ngay');

export async function xepHangPhut(nnGoc: string, kyGoc: unknown, xem: number | null) {
  const nn = kiemNn(nnGoc) as NnKP;
  const ky = docKy(kyGoc);
  const homNay = ngayVn();
  const tuNgay = ky === 'ngay' ? homNay : congNgay(homNay, -6);
  const chan = await dsChan(xem);
  const dieuKien = {
    nn, ngay: { gte: docNgay(tuNgay)!, lte: docNgay(homNay)! },
    ...(chan.length ? { userId: { notIn: chan } } : {}),
    user: { ...TAC_GIA_SONG, ctlXepHangAn: { is: null } },
  };
  const nhom = await prisma.ctlHoatDongNgay.groupBy({
    by: ['userId'], where: dieuKien, _sum: { giay: true },
    having: { giay: { _sum: { gte: 60 } } },
    orderBy: [{ _sum: { giay: 'desc' } }, { userId: 'asc' }], take: 50,
  });
  const us = nhom.length ? await prisma.user.findMany({ where: { id: { in: nhom.map((x) => x.userId) } }, select: TAC_GIA }) : [];
  const theoId = new Map(us.map((u) => [u.id, u]));
  const items = nhom.filter((x) => theoId.has(x.userId)).map((x, i) => ({
    hang: i + 1, phut: Math.floor((x._sum.giay ?? 0) / 60), nguoi: tacGiaGon(theoId.get(x.userId)!),
  }));

  let cuaToi: { hang: number | null; phut: number; an: boolean } | null = null;
  if (xem) {
    const [toi, an] = await Promise.all([
      prisma.ctlHoatDongNgay.aggregate({ where: { userId: xem, nn, ngay: dieuKien.ngay }, _sum: { giay: true } }),
      prisma.ctlXepHangAn.findUnique({ where: { userId: xem }, select: { userId: true } }),
    ]);
    const giay = toi._sum.giay ?? 0;
    let hang: number | null = items.find((x) => x.nguoi.id === xem)?.hang ?? null;
    if (!hang && !an && giay >= 60) {
      const hon = await prisma.ctlHoatDongNgay.groupBy({ by: ['userId'], where: dieuKien, _sum: { giay: true }, having: { giay: { _sum: { gt: giay } } } });
      hang = hon.length + 1;
    }
    cuaToi = { hang, phut: Math.floor(giay / 60), an: !!an };
  }
  return { ky, tuNgay, denNgay: homNay, items, cuaToi };
}

export async function datAnXepHang(userId: number, an: boolean) {
  if (an) await prisma.ctlXepHangAn.createMany({ data: [{ userId }], skipDuplicates: true });
  else await prisma.ctlXepHangAn.deleteMany({ where: { userId } });
  return { an };
}

/** Chỉ cho test. */
export function __datLaiKhamPha() { CHO_GHI.clear(); DEM_TRA_NHIEU.clear(); DEM_CHU_DE.clear(); }
