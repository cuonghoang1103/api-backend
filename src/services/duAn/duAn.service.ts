/**
 * "Dự án xuyên suốt khoá" (21/11/2026) — tầng dịch vụ: đề tài (gợi ý / tự chọn + AI duyệt), mốc, phòng bảo vệ AI.
 * Đặc tả: docs/du-an-xuyen-suot-khoa.md · hợp đồng + quyết định lưu DB: docs/du-an-hop-dong.md §4.
 * Route: src/routes/courseProject.routes.ts (`/api/v1/courses/:slug/du-an…`). Luật thuần: ./quyTac.ts.
 *
 * Chi phí (người dùng đang cần tiết kiệm): AI chỉ chạy ở hai chỗ — duyệt đề tài tự chọn (1 lời gọi, trần lượt/ngày)
 * và phòng bảo vệ (≤ soCau + 1 lời gọi/phiên, trần phiên/ngày). Mọi lời gọi qua `llmComplete` ⇒ có sổ chi phí,
 * trần token/người/ngày (`checkTokenQuota`) và trần tiền/ngày của web (`budget.ts`). Không chấm code repo bằng AI.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { chanSapRaMat } from '../khoaSapRaMat.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { docDuAn, type AiDuyet, type BanDeTai, type DuAnKhoa, type LuotHoiDong, type TrangThaiBaoVe } from './kieu.js';
import {
  dayLichSu, demTrongNgay, docKetQuaCham, docKetQuaDuyet, dungPromptBaoVe, dungPromptCham, dungPromptDuyet,
  gioiHan, hoiThoaiChoModel, kiemNopMoc, PHIEN_HET_HAN_MS, soCauDaHoi, soCauDaTraLoi, tinhTienDo, dauNgayVN,
  type NguCanhBaoVe, type schemaNopMoc, type schemaTuChon,
} from './quyTac.js';
import type { z } from 'zod';

/** Chỗ cắm model — test thay bằng hàm giả để không bao giờ gọi LLM thật. */
export const _ai = { goi: llmComplete };

type Khoa = { id: number; slug: string; title: string; courseCode: string | null; status: string; isPublished: boolean; duAn: DuAnKhoa | null };

/* ── Khoá ───────────────────────────────────────────────────────────── */

export async function timKhoaDuAn(slug: string): Promise<Khoa> {
  const k = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true, slug: true, title: true, courseCode: true, status: true, isPublished: true,
      duAn: { select: { noiDung: true } },
    },
  });
  if (!k || (!k.isPublished && k.status !== 'COMING_SOON')) throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');
  return { ...k, duAn: docDuAn(k.duAn?.noiDung) };
}

function canDuAn(k: Khoa): DuAnKhoa {
  if (!k.duAn) throw new AppError('Khoá này chưa có dự án xuyên suốt.', 404, 'DU_AN_KHONG_CO');
  return k.duAn;
}

/** Ghi (chọn đề tài, nộp mốc, bảo vệ) chỉ mở cho khoá đã xuất bản — "Sắp ra mắt" chưa có bài để học. */
function canGhi(k: Khoa): DuAnKhoa {
  chanSapRaMat(k);
  if (!k.isPublished) throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');
  return canDuAn(k);
}

/* ── Khoá xử lý trong tiến trình: chặn bấm đúp gọi AI hai lần ──────── */

const dangXuLy = new Set<string>();
async function motLuot<T>(khoa: string, fn: () => Promise<T>): Promise<T> {
  if (dangXuLy.has(khoa)) throw new AppError('Đang xử lý lượt trước — đợi một chút nhé.', 409, 'DU_AN_DANG_XU_LY');
  dangXuLy.add(khoa);
  try {
    return await fn();
  } finally {
    dangXuLy.delete(khoa);
  }
}

async function chanTokenVaAi(userId: number): Promise<void> {
  if (!isAiAvailable('chat')) throw new AppError('AI đang tạm nghỉ, thử lại sau ít phút nhé.', 503, 'DU_AN_AI_NGHI');
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Bạn đã dùng hết hạn mức AI hôm nay — quay lại ngày mai nhé.', 429, 'DU_AN_HET_TOKEN');
  }
}

/* ── Đề tài đang hiệu lực ───────────────────────────────────────────── */

export interface LuaChonHieuLuc {
  loai: 'GOI_Y' | 'TU_CHON';
  deTaiSlug: string | null;
  ten: string;
  moTa: string;
  tinhNang: string[];
  chotLuc: string | null;
}

function luaChonTuDong(
  row: { deTaiSlug: string | null; tuChon: Prisma.JsonValue; chotLuc: Date | null } | null,
  duAn: DuAnKhoa,
): LuaChonHieuLuc | null {
  if (!row) return null;
  if (row.deTaiSlug) {
    const d = duAn.deTai.find((x) => x.slug === row.deTaiSlug);
    // Đề tài gợi ý bị gỡ khỏi khoá sau khi người học đã chọn: vẫn giữ lựa chọn, hiện slug thay vì sập.
    return {
      loai: 'GOI_Y', deTaiSlug: row.deTaiSlug, ten: d?.ten ?? row.deTaiSlug, moTa: d?.moTa ?? '', tinhNang: d?.tinhNang ?? [],
      chotLuc: row.chotLuc?.toISOString() ?? null,
    };
  }
  const tc = row.tuChon as unknown as BanDeTai | null;
  if (tc && typeof tc === 'object' && typeof tc.ten === 'string') {
    return { loai: 'TU_CHON', deTaiSlug: null, ten: tc.ten, moTa: tc.moTa ?? '', tinhNang: Array.isArray(tc.tinhNang) ? tc.tinhNang : [], chotLuc: row.chotLuc?.toISOString() ?? null };
  }
  return null;
}

/** Mục lịch sử cho đề tài sắp bị thay. */
function banLichSu(ht: LuaChonHieuLuc) {
  return { loai: ht.loai, deTaiSlug: ht.deTaiSlug, ten: ht.ten, tuLuc: ht.chotLuc, denLuc: new Date().toISOString() };
}

/* ── GET: dự án của khoá + của tôi ─────────────────────────────────── */

async function demPhienBaoVeHomNay(userId: number): Promise<number> {
  return prisma.courseProjectDefence.count({ where: { userId, batDauLuc: { gte: dauNgayVN() } } });
}

/** Phiên DANG_HOI quá hạn ⇒ BO_DO (lười, lúc đọc). */
async function donPhienQuaHan(userId: number, courseId: number): Promise<void> {
  await prisma.courseProjectDefence.updateMany({
    where: { userId, courseId, trangThai: 'DANG_HOI', updatedAt: { lt: new Date(Date.now() - PHIEN_HET_HAN_MS) } },
    data: { trangThai: 'BO_DO', ketThucLuc: new Date() },
  });
}

export async function layDuAn(slug: string, userId: number | null) {
  const k = await timKhoaDuAn(slug);
  const khoa = { id: k.id, slug: k.slug, title: k.title, courseCode: k.courseCode };
  if (!k.duAn) return { coDuAn: false, khoa, duAn: null, cuaToi: null, daDangNhap: !!userId };
  const duAn = k.duAn;
  if (!userId) return { coDuAn: true, khoa, duAn, cuaToi: null, daDangNhap: false };

  await donPhienQuaHan(userId, k.id);
  const [row, moc, phien, phienHomNay] = await Promise.all([
    prisma.courseProjectChoice.findUnique({ where: { userId_courseId: { userId, courseId: k.id } } }),
    prisma.courseProjectMilestone.findMany({ where: { userId, courseId: k.id } }),
    prisma.courseProjectDefence.findMany({
      where: { userId, courseId: k.id }, orderBy: { batDauLuc: 'desc' }, take: 5,
      select: { id: true, trangThai: true, diem: true, batDauLuc: true, ketThucLuc: true },
    }),
    demPhienBaoVeHomNay(userId),
  ]);
  const gh = gioiHan();
  const luotDuyet = Array.isArray(row?.luotDuyet) ? (row!.luotDuyet as Array<{ luc?: string }>) : [];
  const tienDo = tinhTienDo(duAn, moc);
  return {
    coDuAn: true,
    khoa,
    duAn,
    daDangNhap: true,
    cuaToi: {
      luaChon: luaChonTuDong(row, duAn),
      aiDuyet: (row?.aiDuyet as unknown as AiDuyet | null) ?? null,
      lichSu: Array.isArray(row?.lichSu) ? row!.lichSu : [],
      moc: Object.fromEntries(moc.map((m) => [m.mocSlug, {
        trangThai: m.trangThai, repoUrl: m.repoUrl, demoUrl: m.demoUrl, anhUrl: m.anhUrl, ghiChu: m.ghiChu,
        tuKiem: Array.isArray(m.tuKiem) ? m.tuKiem : [], deTaiTen: m.deTaiTen,
        nopLuc: m.nopLuc?.toISOString() ?? null, xongLuc: m.xongLuc?.toISOString() ?? null,
      }])),
      tienDo,
      baoVe: {
        phien: phien.map((p) => ({ ...p, diem: p.diem == null ? null : Number(p.diem) })),
        dangMo: phien.find((p) => p.trangThai === 'DANG_HOI')?.id ?? null,
        diemCaoNhat: phien.reduce<number | null>((m, p) => (p.diem == null ? m : Math.max(m ?? 0, Number(p.diem))), null),
      },
      gioiHan: {
        duyetToiDa: gh.duyetMoiNgay,
        duyetConLai: Math.max(0, gh.duyetMoiNgay - demTrongNgay(luotDuyet)),
        baoVeToiDa: gh.baoVeMoiNgay,
        baoVeConLai: Math.max(0, gh.baoVeMoiNgay - phienHomNay),
        soCau: gh.soCau,
        mocToiThieu: gh.mocToiThieu,
      },
    },
  };
}

/* ── POST /chon ─────────────────────────────────────────────────────── */

export async function chonDeTai(userId: number, slug: string, v: { deTaiSlug: string } | { tuChonDaDuyet: true }) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  const row = await prisma.courseProjectChoice.findUnique({ where: { userId_courseId: { userId, courseId: k.id } } });
  const ht = luaChonTuDong(row, duAn);
  let data: { deTaiSlug: string | null; tuChon: Prisma.InputJsonValue | typeof Prisma.DbNull };
  if ('deTaiSlug' in v) {
    if (!duAn.deTai.some((d) => d.slug === v.deTaiSlug)) throw new AppError('Đề tài không thuộc khoá này.', 400, 'DU_AN_DE_TAI_SAI');
    if (ht?.loai === 'GOI_Y' && ht.deTaiSlug === v.deTaiSlug) return layDuAn(slug, userId); // chọn lại đúng đề tài: không đổi gì
    data = { deTaiSlug: v.deTaiSlug, tuChon: Prisma.DbNull };
  } else {
    const ai = row?.aiDuyet as unknown as AiDuyet | null;
    if (!ai || ai.ketQua !== 'DUYET') throw new AppError('Đề tài tự chọn chưa được AI duyệt.', 409, 'DU_AN_CHUA_DUYET');
    data = { deTaiSlug: null, tuChon: ai.ban as unknown as Prisma.InputJsonValue };
  }
  const lichSu = ht ? dayLichSu(row?.lichSu, banLichSu(ht)) : (row?.lichSu ?? []);
  await prisma.courseProjectChoice.upsert({
    where: { userId_courseId: { userId, courseId: k.id } },
    create: { userId, courseId: k.id, ...data, chotLuc: new Date(), lichSu: lichSu as Prisma.InputJsonValue },
    update: { ...data, chotLuc: new Date(), lichSu: lichSu as Prisma.InputJsonValue },
  });
  return layDuAn(slug, userId);
}

/* ── POST /tu-chon (AI duyệt) ───────────────────────────────────────── */

export async function tuChonDeTai(userId: number, slug: string, v: z.infer<typeof schemaTuChon>) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  return motLuot(`duyet:${userId}`, async () => {
    const row = await prisma.courseProjectChoice.findUnique({ where: { userId_courseId: { userId, courseId: k.id } } });
    const luot = Array.isArray(row?.luotDuyet) ? (row!.luotDuyet as Array<{ luc?: string }>) : [];
    const gh = gioiHan();
    if (demTrongNgay(luot) >= gh.duyetMoiNgay) {
      throw new AppError(`Hôm nay bạn đã gửi AI duyệt ${gh.duyetMoiNgay} lần — sửa kỹ theo góp ý rồi gửi lại vào ngày mai nhé.`, 429, 'DU_AN_HET_LUOT_DUYET');
    }
    await chanTokenVaAi(userId);

    const ban: BanDeTai = { ten: v.ten, moTa: v.moTa, tinhNang: v.tinhNang };
    const { system, user } = dungPromptDuyet({ tieuDe: k.title, maMon: k.courseCode }, duAn, ban, v.ngonNgu ?? 'vi');
    const kq = await _ai.goi({
      step: 'generation', feature: 'chat', purpose: 'du_an_duyet', system,
      messages: [{ role: 'user', content: user }], maxTokens: 900, maxRetries: 1, timeoutMs: 60_000, userId,
    });
    // Đã tốn tiền ⇒ tính lượt, kể cả khi model trả JSON hỏng.
    const luotMoi = dayLichSu(luot, { luc: new Date().toISOString(), ketQua: null as string | null, ten: ban.ten.slice(0, 120) });
    const ai = docKetQuaDuyet(kq.text, ban, kq.model);
    if (!ai) {
      await prisma.courseProjectChoice.upsert({
        where: { userId_courseId: { userId, courseId: k.id } },
        create: { userId, courseId: k.id, luotDuyet: luotMoi as Prisma.InputJsonValue },
        update: { luotDuyet: luotMoi as Prisma.InputJsonValue },
      });
      logger.warn('du-an: AI duyệt trả JSON không đọc được', { userId, courseId: k.id, model: kq.model, dau: kq.text.slice(0, 200) });
      throw new AppError('AI chưa trả được kết quả duyệt — thử lại sau ít phút.', 502, 'DU_AN_AI_LOI');
    }
    luotMoi[0].ketQua = ai.ketQua;
    const ht = luaChonTuDong(row, duAn);
    // DUYỆT + chưa có đề tài ⇒ chốt luôn. Đã có đề tài ⇒ chỉ lưu kết quả; người học tự bấm "Chuyển sang đề tài này".
    const chotNgay = ai.ketQua === 'DUYET' && !ht;
    await prisma.courseProjectChoice.upsert({
      where: { userId_courseId: { userId, courseId: k.id } },
      create: {
        userId, courseId: k.id, aiDuyet: ai as unknown as Prisma.InputJsonValue, luotDuyet: luotMoi as Prisma.InputJsonValue,
        ...(chotNgay ? { tuChon: ban as unknown as Prisma.InputJsonValue, chotLuc: new Date() } : {}),
      },
      update: {
        aiDuyet: ai as unknown as Prisma.InputJsonValue, luotDuyet: luotMoi as Prisma.InputJsonValue,
        ...(chotNgay ? { tuChon: ban as unknown as Prisma.InputJsonValue, deTaiSlug: null, chotLuc: new Date() } : {}),
      },
    });
    return { ...(await layDuAn(slug, userId)), vuaDuyet: { ketQua: ai.ketQua, daChot: chotNgay } };
  });
}

/* ── POST /moc/:mocSlug ─────────────────────────────────────────────── */

export async function nopMoc(userId: number, slug: string, mocSlug: string, v: z.infer<typeof schemaNopMoc>) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  const moc = duAn.moc.find((m) => m.slug === mocSlug);
  if (!moc) throw new AppError('Mốc không thuộc dự án của khoá này.', 404, 'DU_AN_MOC_SAI');
  const row = await prisma.courseProjectChoice.findUnique({ where: { userId_courseId: { userId, courseId: k.id } } });
  const ht = luaChonTuDong(row, duAn);
  if (!ht) throw new AppError('Chọn đề tài dự án trước rồi mới nộp mốc.', 409, 'DU_AN_CHUA_CHON_DE_TAI');
  const loi = kiemNopMoc(moc, v);
  if (loi) throw new AppError(loi.thongBao, 400, loi.ma);

  const cu = await prisma.courseProjectMilestone.findUnique({
    where: { userId_courseId_mocSlug: { userId, courseId: k.id, mocSlug } },
    select: { xongLuc: true },
  });
  const now = new Date();
  const tuKiem = [...new Set(v.tuKiem)].filter((i) => i < moc.datKhi.length).sort((a, b) => a - b);
  const data = {
    mocSo: moc.so,
    trangThai: v.xong ? 'XONG' : 'DANG_LAM',
    repoUrl: v.repoUrl ?? null,
    demoUrl: v.demoUrl ?? null,
    anhUrl: v.anhUrl ?? null,
    ghiChu: v.ghiChu || null,
    tuKiem,
    deTaiTen: ht.ten.slice(0, 255),
    nopLuc: v.xong ? now : undefined,
    // Mốc từng xong rồi nộp lại vẫn giữ mốc thời gian XONG đầu tiên; bỏ đánh dấu ⇒ xoá.
    xongLuc: v.xong ? (cu?.xongLuc ?? now) : null,
  };
  await prisma.courseProjectMilestone.upsert({
    where: { userId_courseId_mocSlug: { userId, courseId: k.id, mocSlug } },
    create: { userId, courseId: k.id, mocSlug, ...data },
    update: data,
  });
  return layDuAn(slug, userId);
}

/* ── Phòng bảo vệ ───────────────────────────────────────────────────── */

type PhienRow = NonNullable<Awaited<ReturnType<typeof prisma.courseProjectDefence.findFirst>>>;

function phienRa(p: PhienRow) {
  return {
    id: p.id,
    trangThai: p.trangThai as TrangThaiBaoVe,
    deTai: p.deTai,
    phien: (Array.isArray(p.phien) ? p.phien : []) as unknown as LuotHoiDong[],
    soCau: p.soCau,
    diem: p.diem == null ? null : Number(p.diem),
    diemChiTiet: p.diemChiTiet,
    nhanXet: p.nhanXet,
    batDauLuc: p.batDauLuc.toISOString(),
    ketThucLuc: p.ketThucLuc?.toISOString() ?? null,
  };
}

async function nguCanhBaoVe(k: Khoa, duAn: DuAnKhoa, userId: number, deTai: { ten: string; moTa: string; tinhNang: string[] }, soCau: number, ngonNgu: 'vi' | 'en'): Promise<NguCanhBaoVe> {
  const moc = await prisma.courseProjectMilestone.findMany({ where: { userId, courseId: k.id }, orderBy: { mocSo: 'asc' } });
  return {
    khoa: { tieuDe: k.title, maMon: k.courseCode },
    duAn,
    deTai,
    soCau,
    ngonNgu,
    mocDaNop: moc.map((m) => {
      const dm = duAn.moc.find((x) => x.slug === m.mocSlug);
      return { so: m.mocSo, ten: dm?.ten ?? m.mocSlug, yeuCau: dm?.yeuCau ?? [], trangThai: m.trangThai, repoUrl: m.repoUrl, demoUrl: m.demoUrl, ghiChu: m.ghiChu };
    }),
  };
}

async function timPhien(userId: number, courseId: number, id: number): Promise<PhienRow> {
  const p = await prisma.courseProjectDefence.findFirst({ where: { id, userId, courseId } });
  if (!p) throw new AppError('Không tìm thấy phiên bảo vệ.', 404, 'DU_AN_PHIEN_SAI');
  return p;
}

export async function layPhienBaoVe(userId: number, slug: string, id: number) {
  const k = await timKhoaDuAn(slug);
  canDuAn(k);
  return phienRa(await timPhien(userId, k.id, id));
}

/** Mở phiên (hoặc trả lại phiên đang dở — không tốn lượt), AI chào + hỏi câu 1. */
export async function batDauBaoVe(userId: number, slug: string, ngonNgu: 'vi' | 'en' = 'vi', onToken?: (t: string) => void) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  return motLuot(`baove:${userId}`, async () => {
    await donPhienQuaHan(userId, k.id);
    const dangMo = await prisma.courseProjectDefence.findFirst({ where: { userId, courseId: k.id, trangThai: 'DANG_HOI' }, orderBy: { batDauLuc: 'desc' } });
    if (dangMo && soCauDaHoi(phienRa(dangMo).phien) > 0) return { ...phienRa(dangMo), tiepTuc: true };

    const row = await prisma.courseProjectChoice.findUnique({ where: { userId_courseId: { userId, courseId: k.id } } });
    const ht = luaChonTuDong(row, duAn);
    if (!ht) throw new AppError('Chọn đề tài dự án trước rồi mới vào phòng bảo vệ.', 409, 'DU_AN_CHUA_CHON_DE_TAI');
    const gh = gioiHan();
    const xong = await prisma.courseProjectMilestone.count({ where: { userId, courseId: k.id, trangThai: 'XONG' } });
    if (xong < gh.mocToiThieu) {
      throw new AppError(`Cần hoàn thành ít nhất ${gh.mocToiThieu} mốc dự án trước khi bảo vệ (bạn đang xong ${xong}).`, 409, 'DU_AN_CHUA_DU_MOC');
    }
    if (!dangMo && (await demPhienBaoVeHomNay(userId)) >= gh.baoVeMoiNgay) {
      throw new AppError(`Hôm nay bạn đã mở ${gh.baoVeMoiNgay} phiên bảo vệ — luyện lại vào ngày mai nhé.`, 429, 'DU_AN_HET_PHIEN');
    }
    await chanTokenVaAi(userId);

    const deTai = { loai: ht.loai, slug: ht.deTaiSlug, ten: ht.ten, moTa: ht.moTa, tinhNang: ht.tinhNang, ngonNgu };
    const p = dangMo ?? await prisma.courseProjectDefence.create({
      data: { userId, courseId: k.id, deTai: deTai as unknown as Prisma.InputJsonValue, soCau: gh.soCau, phien: [] },
    });
    const ctx = await nguCanhBaoVe(k, duAn, userId, deTai, p.soCau, ngonNgu);
    const kq = await _ai.goi({
      step: 'interview', feature: 'chat', purpose: 'du_an_bao_ve', system: dungPromptBaoVe(ctx),
      messages: hoiThoaiChoModel([], ngonNgu), maxTokens: 450, maxRetries: 1, timeoutMs: 60_000, userId, onToken,
    });
    const cau = kq.text.trim();
    if (!cau) throw new AppError('Hội đồng AI chưa lên tiếng được — thử lại sau ít phút.', 502, 'DU_AN_AI_LOI');
    const phien: LuotHoiDong[] = [{ role: 'assistant', content: cau, luc: new Date().toISOString() }];
    const moi = await prisma.courseProjectDefence.update({
      where: { id: p.id }, data: { phien: phien as unknown as Prisma.InputJsonValue, model: kq.model },
    });
    return { ...phienRa(moi), tiepTuc: false };
  });
}

async function cham(k: Khoa, duAn: DuAnKhoa, userId: number, p: PhienRow, phien: LuotHoiDong[]) {
  const dt = p.deTai as unknown as { ten: string; moTa: string; tinhNang: string[]; ngonNgu?: 'vi' | 'en' };
  const ngonNgu = dt.ngonNgu === 'en' ? 'en' : 'vi';
  const ctx = await nguCanhBaoVe(k, duAn, userId, dt, p.soCau, ngonNgu);
  const kq = await _ai.goi({
    step: 'report', feature: 'chat', purpose: 'du_an_bao_ve', system: dungPromptCham(ctx),
    messages: [...hoiThoaiChoModel(phien, ngonNgu), { role: 'user', content: ngonNgu === 'en' ? 'The Q&A is over. Grade now (JSON only).' : 'Hết phần hỏi đáp. Mời hội đồng chấm (chỉ JSON).' }],
    maxTokens: 1800, maxRetries: 1, timeoutMs: 90_000, userId,
  });
  const ket = docKetQuaCham(kq.text, duAn);
  if (!ket) {
    // Lưu hội thoại để người học chấm lại được (bấm "Kết thúc & chấm" lần nữa) — không mất bài làm.
    await prisma.courseProjectDefence.update({ where: { id: p.id }, data: { phien: phien as unknown as Prisma.InputJsonValue } });
    logger.warn('du-an: AI chấm bảo vệ trả JSON không đọc được', { userId, phienId: p.id, dau: kq.text.slice(0, 200) });
    throw new AppError('Hội đồng AI chưa chấm được — bấm "Kết thúc & chấm" để thử lại.', 502, 'DU_AN_AI_LOI');
  }
  const moi = await prisma.courseProjectDefence.update({
    where: { id: p.id },
    data: {
      phien: phien as unknown as Prisma.InputJsonValue,
      trangThai: 'DA_CHAM', diem: ket.tong, diemChiTiet: ket.diemChiTiet as unknown as Prisma.InputJsonValue,
      nhanXet: ket.nhanXet as unknown as Prisma.InputJsonValue, ketThucLuc: new Date(),
    },
  });
  return phienRa(moi);
}

/** Người học trả lời câu đang hỏi ⇒ hội đồng hỏi câu kế, hoặc (đủ câu) chấm luôn. */
export async function traLoiBaoVe(
  userId: number, slug: string, id: number, traLoi: string,
  cb: { onToken?: (t: string) => void; onDangCham?: () => void } = {},
) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  return motLuot(`baove:${userId}`, async () => {
    const p = await timPhien(userId, k.id, id);
    if (p.trangThai !== 'DANG_HOI') throw new AppError('Phiên bảo vệ đã kết thúc.', 409, 'DU_AN_PHIEN_DA_DONG');
    const phien = phienRa(p).phien;
    if (!phien.length || phien[phien.length - 1].role !== 'assistant') {
      throw new AppError('Hội đồng chưa hỏi câu kế — tải lại phiên nhé.', 409, 'DU_AN_CHUA_TOI_LUOT');
    }
    await chanTokenVaAi(userId);
    phien.push({ role: 'user', content: traLoi, luc: new Date().toISOString() });
    // Lưu câu trả lời TRƯỚC khi gọi AI: model hỏng/mạng đứt giữa chừng thì người học không mất bài — giao diện hiện
    // "Hỏi lại" (phiên kết thúc bằng lượt của người học) / "Kết thúc & chấm".
    await prisma.courseProjectDefence.update({ where: { id: p.id }, data: { phien: phien as unknown as Prisma.InputJsonValue } });

    if (soCauDaTraLoi(phien) >= p.soCau) {
      cb.onDangCham?.();
      return cham(k, duAn, userId, p, phien);
    }
    const dt = p.deTai as unknown as { ten: string; moTa: string; tinhNang: string[]; ngonNgu?: 'vi' | 'en' };
    const ngonNgu = dt.ngonNgu === 'en' ? 'en' : 'vi';
    const ctx = await nguCanhBaoVe(k, duAn, userId, dt, p.soCau, ngonNgu);
    const kq = await _ai.goi({
      step: 'interview', feature: 'chat', purpose: 'du_an_bao_ve', system: dungPromptBaoVe(ctx),
      messages: hoiThoaiChoModel(phien, ngonNgu), maxTokens: 450, maxRetries: 1, timeoutMs: 60_000, userId, onToken: cb.onToken,
    });
    const cau = kq.text.trim();
    if (!cau) throw new AppError('Hội đồng AI chưa hỏi tiếp được — bấm "Hỏi lại" để thử lại.', 502, 'DU_AN_AI_LOI');
    phien.push({ role: 'assistant', content: cau, luc: new Date().toISOString() });
    const moi = await prisma.courseProjectDefence.update({ where: { id: p.id }, data: { phien: phien as unknown as Prisma.InputJsonValue } });
    return phienRa(moi);
  });
}

/** Lượt hỏi hỏng giữa chừng (người học đã trả lời, hội đồng chưa hỏi tiếp) ⇒ hỏi lại câu kế. */
export async function hoiLaiBaoVe(userId: number, slug: string, id: number, onToken?: (t: string) => void) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  return motLuot(`baove:${userId}`, async () => {
    const p = await timPhien(userId, k.id, id);
    if (p.trangThai !== 'DANG_HOI') throw new AppError('Phiên bảo vệ đã kết thúc.', 409, 'DU_AN_PHIEN_DA_DONG');
    const phien = phienRa(p).phien;
    if (phien.length && phien[phien.length - 1].role === 'assistant') return phienRa(p); // không có gì để hỏi lại
    await chanTokenVaAi(userId);
    if (soCauDaTraLoi(phien) >= p.soCau) return cham(k, duAn, userId, p, phien);
    const dt = p.deTai as unknown as { ten: string; moTa: string; tinhNang: string[]; ngonNgu?: 'vi' | 'en' };
    const ngonNgu = dt.ngonNgu === 'en' ? 'en' : 'vi';
    const ctx = await nguCanhBaoVe(k, duAn, userId, dt, p.soCau, ngonNgu);
    const kq = await _ai.goi({
      step: 'interview', feature: 'chat', purpose: 'du_an_bao_ve', system: dungPromptBaoVe(ctx),
      messages: hoiThoaiChoModel(phien, ngonNgu), maxTokens: 450, maxRetries: 1, timeoutMs: 60_000, userId, onToken,
    });
    const cau = kq.text.trim();
    if (!cau) throw new AppError('Hội đồng AI chưa hỏi tiếp được — thử lại sau ít phút.', 502, 'DU_AN_AI_LOI');
    phien.push({ role: 'assistant', content: cau, luc: new Date().toISOString() });
    return phienRa(await prisma.courseProjectDefence.update({ where: { id: p.id }, data: { phien: phien as unknown as Prisma.InputJsonValue, model: kq.model } }));
  });
}

/** Kết thúc sớm: đã trả lời ≥ 2 câu ⇒ chấm phần đã có; ít hơn ⇒ bỏ dở (không tốn AI). */
export async function ketThucBaoVe(userId: number, slug: string, id: number) {
  const k = await timKhoaDuAn(slug);
  const duAn = canGhi(k);
  return motLuot(`baove:${userId}`, async () => {
    const p = await timPhien(userId, k.id, id);
    if (p.trangThai !== 'DANG_HOI') return phienRa(p);
    const phien = phienRa(p).phien;
    if (soCauDaTraLoi(phien) < 2) {
      return phienRa(await prisma.courseProjectDefence.update({ where: { id: p.id }, data: { trangThai: 'BO_DO', ketThucLuc: new Date() } }));
    }
    await chanTokenVaAi(userId);
    // Câu cuối hội đồng hỏi mà người học chưa trả lời: bỏ khỏi bản chấm (không tính là "không trả lời").
    const daTraLoi = phien[phien.length - 1]?.role === 'assistant' ? phien.slice(0, -1) : phien;
    return cham(k, duAn, userId, p, daTraLoi);
  });
}
