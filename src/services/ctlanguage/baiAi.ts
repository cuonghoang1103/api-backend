/**
 * CT Language — BÀI HỌC AI THEO CHỦ ĐỀ (Đợt E, 14/11/2026 — docs/ct-language-khao-sat-hanzii.md mục 3).
 *
 * Người học gõ chủ đề ("đi phỏng vấn ở công xưởng") + chọn trình độ ⇒ model dựng bài: 12 từ vựng · hội thoại theo vai ·
 * 4 mẫu câu · 6 câu quiz · gợi ý gọi CuongMini luyện nói. Có ≥ 30 BÀI GỢI Ý mỗi ngôn ngữ (`GOI_Y`) — sinh MỘT lần
 * lúc người đầu tiên mở, lưu `ctl_bai_ai` (userId null) rồi DÙNG CHUNG cho mọi người, hiện "n người đã học".
 *
 * Model: cổng LLM chung `llmComplete`, purpose `language_tutor` (như mọi tính năng AI của CT Language), JSON thuần, kiểm
 * bằng `kiemBaiAi`; mọi chữ đi qua `kiemNoiDung` (chủ đề người gõ + toàn bộ bài model viết).
 * Lượt TỰ TẠO/ngày (giờ VN): free `LUOT_FREE`=1 · Pro `LUOT_PRO`=20 — đếm từ CSDL (bài đã lưu), nên model lỗi / JSON hỏng
 * không tốn lượt; khoá RAM theo người chặn hai yêu cầu song song. Bài gợi ý không tốn lượt (trần cả web `TRAN_GOI_Y_NGAY`).
 * Báo cáo nội dung AI (App Store 4.7): `baoCao` ⇒ hộp thư admin; admin gỡ (`adminAn`) — bài gợi ý bị gỡ thì XOÁ để lần
 * mở sau sinh lại bản mới.
 * App: đường sinh bài có `/ai/` ⇒ app gọi `DongYChiaSeAI.batBuoc()` trước khi gửi (5.1.2(i)).
 */
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { docJsonCham } from '../ielts/thiMay.service.js';
import { logger } from '../../utils/logger.js';
import { laAdmin } from './congDong.js';
import { idAm } from './chuDeTu.js';
import { ngayVn } from './khamPhaThuan.js';
import {
  GOI_Y, TRINH_DO, docTrinhDo, kiemBaiAi, nhacBaiAi, nhanTrinhDo, tenGoiCuongMini, toanBoChu,
  type NnBai, type NoiDungBaiAi,
} from './baiAiThuan.js';

export const LUOT_FREE = 1;
export const LUOT_PRO = 20;
export const TRAN_GOI_Y_NGAY = 150;

export interface PhuThuocBaiAi {
  laPro: (userId: number) => Promise<boolean>;
  /** Văn bản thô của model. Ném lỗi khi AI hỏng. */
  goi: (o: { system: string; user: string; userId: number }) => Promise<string>;
  baoAdmin: (tb: { tieuDe: string; noiDung: string; userId: number; khoaChongTrung: string }) => Promise<unknown>;
}

const THAT: PhuThuocBaiAi = {
  laPro: isProEffective,
  goi: async ({ system, user, userId }) => {
    const { llmComplete, isAiAvailable } = await import('../interview/llm/index.js');
    if (!isAiAvailable('language')) throw new AppError('AI đang tạm nghỉ, bạn thử lại sau ít phút nhé.', 503, 'CTL_BAI_AI_NGHI');
    const r = await llmComplete({
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId,
      // ~12 từ + 10 câu hội thoại + 4 mẫu + 6 quiz, mỗi thứ có chữ + cách đọc + nghĩa Việt ≈ 2.800 token.
      maxTokens: 4200, maxRetries: 1, timeoutMs: 100_000,
      system, messages: [{ role: 'user', content: user }],
    });
    return r.text ?? '';
  },
  baoAdmin: async (tb) => {
    const { baoAdmin } = await import('../thongBaoAdmin.service.js');
    return baoAdmin({ loai: 'BAO_CAO', mucDo: 'can_xu_ly', ...tb });
  },
};

export function docNnBai(v: unknown): NnBai {
  if (v === 'en' || v === 'ja' || v === 'zh') return v;
  throw new BadRequestError('Ngôn ngữ phải là en, ja hoặc zh.', 'CTL_BAI_AI_NN');
}

const dauNgay = () => new Date(`${ngayVn()}T00:00:00.000+07:00`);

// ─── Lượt ────────────────────────────────────────────────────────────────────────────────────────────────────────
export async function luot(userId: number, pt: PhuThuocBaiAi = THAT) {
  const laPro = await pt.laPro(userId);
  const tran = laPro ? LUOT_PRO : LUOT_FREE;
  const daDung = await prisma.ctlBaiAi.count({ where: { userId, goiYMa: null, createdAt: { gte: dauNgay() } } });
  return { laPro, tran, conLai: Math.max(0, tran - daDung) };
}

// ─── Gắn mục từ điển ─────────────────────────────────────────────────────────────────────────────────────────────
async function lamGiau(nn: NnBai, b: NoiDungBaiAi): Promise<NoiDungBaiAi> {
  const muc = await prisma.ctlTu.findMany({
    where: { nn, chu: { in: b.tuVung.map((t) => t.chu) } }, orderBy: { uuTien: 'desc' },
    select: { id: true, chu: true, doc: true, hanViet: true },
  });
  const theoChu = new Map<string, (typeof muc)[number]>();
  for (const m of muc) if (!theoChu.has(m.chu)) theoChu.set(m.chu, m);
  for (const t of b.tuVung) {
    const m = theoChu.get(t.chu);
    t.id = m?.id ?? idAm(nn, t.chu);
    t.hanViet = m?.hanViet ?? null;
    if (m?.doc && nn === 'zh') t.doc = m.doc;   // pinyin chuẩn của từ điển thắng pinyin model viết
  }
  return b;
}

async function sinh(nn: NnBai, chuDe: string, trinhDo: string, userId: number, pt: PhuThuocBaiAi): Promise<NoiDungBaiAi> {
  let tho = '';
  let kq: ReturnType<typeof kiemBaiAi> = null;
  try {
    tho = await pt.goi({ system: nhacBaiAi(nn, trinhDo), user: `Chủ đề người học chọn: ${chuDe}`, userId });
    kq = kiemBaiAi(docJsonCham(tho), nn);
  } catch (e) {
    if (e instanceof AppError) throw e;
    logger.warn('[ctl-bai-ai] AI lỗi', { userId, nn, loi: (e as Error)?.message });
  }
  if (kq && 'tuChoi' in kq) throw new AppError(kq.tuChoi || 'Chủ đề này AI không soạn được bài — bạn thử chủ đề khác nhé.', 422, 'CTL_BAI_AI_TU_CHOI');
  if (!kq) {
    logger.warn('[ctl-bai-ai] JSON hỏng / thiếu phần', { userId, nn, dai: tho.length, duoi: tho.slice(-160) });
    throw new AppError('AI chưa soạn được bài này. Bạn thử lại sau ít phút nhé (lượt chưa bị trừ).', 503, 'CTL_BAI_AI_LOI');
  }
  if (kiemNoiDung(toanBoChu(kq)).chan) throw new AppError('Bài AI soạn có nội dung không phù hợp nên không hiển thị. Bạn thử chủ đề khác nhé.', 422, 'CTL_BAI_AI_NOI_DUNG');
  return lamGiau(nn, kq);
}

type DongBai = { id: number; nn: string; userId: number | null; goiYMa: string | null; chuDe: string; trinhDo: string; noiDung: unknown; createdAt: Date; anLuc?: Date | null };

async function soNguoiHoc(ids: number[]) {
  if (!ids.length) return new Map<number, number>();
  const g = await prisma.ctlBaiAiHoc.groupBy({ by: ['baiId'], where: { baiId: { in: ids } }, _count: { _all: true } });
  return new Map(g.map((x) => [x.baiId, x._count._all]));
}

function trinhBay(b: DongBai, extra: { soNguoiHoc?: number; daLuu?: boolean; xong?: boolean; diem?: number | null } = {}) {
  const nd = b.noiDung as NoiDungBaiAi;
  const nn = b.nn as NnBai;
  return {
    id: b.id, nn, goiYMa: b.goiYMa, laGoiY: !!b.goiYMa, chuDe: b.chuDe, trinhDo: b.trinhDo, nhanTrinhDo: nhanTrinhDo(nn, b.trinhDo),
    createdAt: b.createdAt.toISOString(), noiDung: nd,
    goiNoi: { id: `bai-ai-${b.id}`, ten: tenGoiCuongMini(b.chuDe, nd) },
    soNguoiHoc: extra.soNguoiHoc ?? 0, daLuu: extra.daLuu ?? false, xong: extra.xong ?? false, diem: extra.diem ?? null,
  };
}

// ─── Tạo bài theo chủ đề tự gõ ───────────────────────────────────────────────────────────────────────────────────
const DANG_TAO = new Set<number>();

export async function taoBai(userId: number, nnGoc: unknown, b: { chuDe?: unknown; trinhDo?: unknown }, pt: PhuThuocBaiAi = THAT) {
  const nn = docNnBai(nnGoc);
  const chuDe = String(b.chuDe ?? '').replace(/\s+/g, ' ').trim();
  if (chuDe.length < 3) throw new BadRequestError('Gõ chủ đề dài hơn chút nhé (ví dụ: "gọi đồ ăn ở quán Nhật").', 'CTL_BAI_AI_NGAN');
  if (chuDe.length > 120) throw new BadRequestError('Chủ đề tối đa 120 ký tự.', 'CTL_BAI_AI_DAI');
  const trinhDo = docTrinhDo(nn, b.trinhDo) ?? TRINH_DO[nn][0]!.ma;
  if (kiemNoiDung(chuDe).chan) throw new AppError('Chủ đề có từ ngữ không được phép. Bạn sửa lại nhé.', 422, 'CONTENT_BLOCKED');
  if (DANG_TAO.has(userId)) throw new AppError('Gấu đang soạn bài trước của bạn — đợi xong rồi tạo tiếp nhé.', 429, 'CTL_BAI_AI_DANG_TAO');
  DANG_TAO.add(userId);
  try {
    const l = await luot(userId, pt);
    if (l.conLai <= 0) {
      throw new AppError(
        l.laPro ? `Hôm nay bạn đã tạo đủ ${l.tran} bài — mai tạo tiếp nhé.`
          : `Bản miễn phí tạo được ${LUOT_FREE} bài AI mỗi ngày. Học các bài gợi ý (miễn phí) hoặc nâng Pro để tạo ${LUOT_PRO} bài/ngày.`,
        429, 'CTL_BAI_AI_HET_LUOT', { laPro: l.laPro, tran: l.tran },
      );
    }
    const nd = await sinh(nn, chuDe, trinhDo, userId, pt);
    const bai = await prisma.ctlBaiAi.create({ data: { nn, userId, chuDe, trinhDo, noiDung: nd as unknown as object } });
    await prisma.ctlBaiAiHoc.createMany({ data: [{ userId, baiId: bai.id }], skipDuplicates: true });
    return { ...trinhBay(bai, { soNguoiHoc: 1, daLuu: true }), luot: { ...l, conLai: l.conLai - 1 } };
  } finally {
    DANG_TAO.delete(userId);
  }
}

// ─── Bài gợi ý dùng chung ────────────────────────────────────────────────────────────────────────────────────────
export async function dsGoiY(nnGoc: unknown, userId: number | null) {
  const nn = docNnBai(nnGoc);
  const co = await prisma.ctlBaiAi.findMany({ where: { nn, goiYMa: { not: null }, anLuc: null }, select: { id: true, goiYMa: true } });
  const theoMa = new Map(co.map((x) => [x.goiYMa!, x.id]));
  const [dem, cuaToi] = await Promise.all([
    soNguoiHoc(co.map((x) => x.id)),
    userId ? prisma.ctlBaiAiHoc.findMany({ where: { userId, baiId: { in: co.map((x) => x.id) } }, select: { baiId: true, xongLuc: true } }) : Promise.resolve([]),
  ]);
  const toi = new Map(cuaToi.map((x) => [x.baiId, x]));
  return {
    trinhDo: TRINH_DO[nn],
    items: GOI_Y[nn].map((g) => {
      const id = theoMa.get(g.ma) ?? null;
      return { ...g, nhanTrinhDo: nhanTrinhDo(nn, g.trinhDo), id, daCo: id != null, soNguoiHoc: id ? dem.get(id) ?? 0 : 0, daHoc: id ? toi.has(id) : false, xong: id ? !!toi.get(id)?.xongLuc : false };
    }),
  };
}

const DANG_SINH_GOI_Y = new Map<string, Promise<DongBai>>();

/** Mở một bài gợi ý: có rồi ⇒ trả luôn; chưa ⇒ sinh MỘT lần (hai người mở cùng lúc ⇒ model chạy một lần). */
export async function moGoiY(userId: number, nnGoc: unknown, ma: string, pt: PhuThuocBaiAi = THAT) {
  const nn = docNnBai(nnGoc);
  const g = GOI_Y[nn].find((x) => x.ma === ma);
  if (!g) throw new NotFoundError('Không có bài gợi ý này.');
  let bai: DongBai | null = await prisma.ctlBaiAi.findFirst({ where: { nn, goiYMa: ma, anLuc: null } });
  if (!bai) {
    const k = `${nn}:${ma}`;
    let hua = DANG_SINH_GOI_Y.get(k);
    if (!hua) {
      hua = (async () => {
        const homNay = await prisma.ctlBaiAi.count({ where: { goiYMa: { not: null }, createdAt: { gte: dauNgay() } } });
        if (homNay >= TRAN_GOI_Y_NGAY) throw new AppError('Hôm nay Gấu soạn nhiều bài quá rồi — bạn mở bài đã có sẵn hoặc quay lại mai nhé.', 429, 'CTL_BAI_AI_TRAN_NGAY');
        const nd = await sinh(nn, g.ten, g.trinhDo, userId, pt);
        // Bài gợi ý bị admin gỡ còn nằm đó (anLuc) ⇒ xoá trước để tạo lại đúng mã (ràng buộc duy nhất nn + mã).
        await prisma.ctlBaiAi.deleteMany({ where: { nn, goiYMa: ma, anLuc: { not: null } } });
        try {
          return await prisma.ctlBaiAi.create({ data: { nn, goiYMa: ma, chuDe: g.ten, trinhDo: g.trinhDo, noiDung: nd as unknown as object } });
        } catch (e) {
          if ((e as { code?: string }).code === 'P2002') {
            const co = await prisma.ctlBaiAi.findFirst({ where: { nn, goiYMa: ma } });
            if (co) return co;
          }
          throw e;
        }
      })().finally(() => DANG_SINH_GOI_Y.delete(k));
      DANG_SINH_GOI_Y.set(k, hua);
    }
    bai = await hua;
  }
  return chiTiet(bai.id, userId);
}

// ─── Đọc / Bài của tôi ───────────────────────────────────────────────────────────────────────────────────────────
export async function chiTiet(id: number, userId: number | null) {
  const bai = await prisma.ctlBaiAi.findUnique({ where: { id } });
  const admin = await laAdmin(userId);
  const conNoiDung = Array.isArray((bai?.noiDung as { tuVung?: unknown } | undefined)?.tuVung);
  if (!bai || !conNoiDung || (bai.anLuc && !admin) || (!bai.goiYMa && bai.userId !== userId && !admin)) throw new NotFoundError('Không tìm thấy bài học này.');
  const [dem, toi] = await Promise.all([
    soNguoiHoc([id]),
    userId ? prisma.ctlBaiAiHoc.findUnique({ where: { userId_baiId: { userId, baiId: id } } }) : Promise.resolve(null),
  ]);
  return trinhBay(bai, { soNguoiHoc: dem.get(id) ?? 0, daLuu: !!toi, xong: !!toi?.xongLuc, diem: toi?.diem ?? null });
}

export async function cuaToi(userId: number, nnGoc: unknown) {
  const nn = nnGoc === 'en' || nnGoc === 'ja' || nnGoc === 'zh' ? nnGoc : null;
  const ds = await prisma.ctlBaiAiHoc.findMany({
    where: { userId, bai: { anLuc: null, ...(nn ? { nn } : {}) } }, orderBy: { createdAt: 'desc' }, take: 100,
    select: { xongLuc: true, diem: true, bai: { select: { id: true, nn: true, userId: true, goiYMa: true, chuDe: true, trinhDo: true, createdAt: true, noiDung: true } } },
  });
  const dem = await soNguoiHoc(ds.map((x) => x.bai.id));
  return {
    items: ds.map((x) => {
      const nd = x.bai.noiDung as unknown as NoiDungBaiAi;
      return {
        id: x.bai.id, nn: x.bai.nn, laGoiY: !!x.bai.goiYMa, cuaToiTao: x.bai.userId === userId, chuDe: x.bai.chuDe,
        tieuDe: nd.tieuDe || x.bai.chuDe, tieuDeGoc: nd.tieuDeGoc, trinhDo: x.bai.trinhDo, nhanTrinhDo: nhanTrinhDo(x.bai.nn as NnBai, x.bai.trinhDo),
        soTu: nd.tuVung.length, soNguoiHoc: dem.get(x.bai.id) ?? 0, xong: !!x.xongLuc, diem: x.diem, createdAt: x.bai.createdAt.toISOString(),
      };
    }),
  };
}

async function baiXemDuoc(id: number, userId: number) {
  const bai = await prisma.ctlBaiAi.findUnique({ where: { id }, select: { id: true, userId: true, goiYMa: true, anLuc: true } });
  if (!bai || bai.anLuc || (!bai.goiYMa && bai.userId !== userId)) throw new NotFoundError('Không tìm thấy bài học này.');
  return bai;
}

export async function luu(userId: number, id: number, co: boolean) {
  await baiXemDuoc(id, userId);
  if (co) await prisma.ctlBaiAiHoc.createMany({ data: [{ userId, baiId: id }], skipDuplicates: true });
  else await prisma.ctlBaiAiHoc.deleteMany({ where: { userId, baiId: id } });
  return { daLuu: co };
}

/** Làm xong quiz ⇒ ghi điểm (giữ điểm cao nhất), đánh dấu xong (trạm "bài-ai" của sự kiện). */
export async function xong(userId: number, id: number, b: { diem?: unknown }) {
  await baiXemDuoc(id, userId);
  const diem = Math.max(0, Math.min(100, Math.round(Number(b.diem) || 0)));
  const cu = await prisma.ctlBaiAiHoc.findUnique({ where: { userId_baiId: { userId, baiId: id } } });
  if (cu) {
    await prisma.ctlBaiAiHoc.update({ where: { userId_baiId: { userId, baiId: id } }, data: { xongLuc: cu.xongLuc ?? new Date(), diem: Math.max(cu.diem ?? 0, diem) } });
  } else {
    await prisma.ctlBaiAiHoc.create({ data: { userId, baiId: id, xongLuc: new Date(), diem } });
  }
  return { xong: true, diem: Math.max(cu?.diem ?? 0, diem) };
}

/** Xoá bài TỰ TẠO của mình (bài gợi ý chỉ bỏ khỏi "Bài của tôi"). */
export async function xoa(userId: number, id: number) {
  const bai = await prisma.ctlBaiAi.findUnique({ where: { id }, select: { userId: true, goiYMa: true } });
  if (!bai) throw new NotFoundError('Không tìm thấy bài học này.');
  if (bai.goiYMa || bai.userId !== userId) {
    await prisma.ctlBaiAiHoc.deleteMany({ where: { userId, baiId: id } });
    return { daXoa: false, boKhoiCuaToi: true };
  }
  // KHÔNG xoá hẳn dòng: lượt/ngày đếm theo dòng bài tự tạo — xoá hẳn thì "tạo – xoá – tạo" lách được trần. Xoá sạch
  // nội dung + chủ đề (không còn gì của người dùng), giữ một dòng rỗng để đếm; xoá tài khoản ⇒ CASCADE xoá nốt.
  await prisma.$transaction([
    prisma.ctlBaiAiHoc.deleteMany({ where: { baiId: id } }),
    prisma.ctlBaiAi.update({ where: { id }, data: { anLuc: new Date(), chuDe: '(đã xoá)', noiDung: {} } }),
  ]);
  return { daXoa: true, boKhoiCuaToi: true };
}

// ─── Báo cáo + admin ─────────────────────────────────────────────────────────────────────────────────────────────
export const LY_DO = ['sai', 'khong-phu-hop', 'bia', 'khac'] as const;
const TEN_LY_DO: Record<(typeof LY_DO)[number], string> = { sai: 'Sai kiến thức', 'khong-phu-hop': 'Nội dung không phù hợp', bia: 'AI bịa', khac: 'Khác' };

export async function baoCao(userId: number, b: { id?: unknown; lyDo?: unknown; chiTiet?: unknown; phan?: unknown }, pt: PhuThuocBaiAi = THAT) {
  const id = Math.floor(Number(b.id));
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('Thiếu bài cần báo cáo.', 'CTL_BAI_AI_BAO_CAO');
  const bai = await prisma.ctlBaiAi.findUnique({ where: { id } });
  if (!bai) throw new NotFoundError('Không tìm thấy bài học này.');
  const lyDo = (LY_DO as readonly string[]).includes(String(b.lyDo)) ? (b.lyDo as (typeof LY_DO)[number]) : 'khac';
  const chiTiet = String(b.chiTiet ?? '').trim().slice(0, 500);
  const phan = String(b.phan ?? '').trim().slice(0, 600);
  await pt.baoAdmin({
    tieuDe: `Báo cáo bài học AI #${id} — CT Language (${bai.nn}${bai.goiYMa ? ', bài gợi ý dùng chung' : ''})`,
    noiDung: [
      `Lý do: ${TEN_LY_DO[lyDo]}`, chiTiet && `Chi tiết: ${chiTiet}`, phan && `Phần bị báo:\n${phan}`,
      `Chủ đề: ${bai.chuDe} · trình độ ${bai.trinhDo}`,
      `Gỡ: POST /api/v1/ctlanguage/bai-ai/admin/bai/${id}/an (bài gợi ý gỡ xong sẽ được sinh lại ở lượt mở sau).`,
      `Nội dung (JSON, cắt):\n${JSON.stringify(bai.noiDung).slice(0, 2500)}`,
    ].filter(Boolean).join('\n'),
    userId, khoaChongTrung: `ctl-bai-ai:${id}:${userId}`,
  });
  return { daBao: true };
}

export async function adminAn(id: number) {
  const r = await prisma.ctlBaiAi.updateMany({ where: { id }, data: { anLuc: new Date() } });
  if (!r.count) throw new NotFoundError('Không tìm thấy bài học này.');
  return { daAn: true };
}

/** Chỉ cho test. */
export function __datLaiBaiAi() { DANG_TAO.clear(); DANG_SINH_GOI_Y.clear(); }
