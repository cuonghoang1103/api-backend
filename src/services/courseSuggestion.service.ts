/**
 * Góp ý & bổ sung cho MỌI khoá học (14/11/2026) — docs/gop-y-khoa-hoc.md.
 * ─────────────────────────────────────────────────────────────────────────
 * Chuyên gia, thầy cô, học viên — hoặc một AI/agent — thấy bài thiếu, sai, có liên tưởng hay, muốn nâng cấp…
 * thì viết vào /courses/<slug>/gop-y. Sau đó chủ kênh / Claude điều phối ĐỐI CHIẾU với nội dung khoá:
 *   · đã có trong bài nào chưa (DA_CO + bằng chứng là trích đoạn bài),
 *   · có đúng không (KHONG_CHINH_XAC + nguồn chứng minh),
 *   · có đáng bổ sung không (NEN_BO_SUNG → DA_LEN_KE_HOACH → DA_BO_SUNG).
 *
 * Ba lối vào, MỘT tầng dịch vụ (file này):
 *   · công khai  — src/routes/courseSuggestion.routes.ts (`/api/v1/courses/:slug/suggestions`)
 *   · admin      — cùng file, `/api/v1/admin/course-suggestions`
 *   · máy        — src/routes/internal.routes.ts (`x-internal-token`), dùng bởi scripts/gop-y/*.mjs
 *
 * ⚠️ Không bao giờ trả email người gửi ra ngoài — kể cả cho admin ở đường công khai.
 */
import crypto from 'crypto';
import { z, ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { baoAdmin } from './thongBaoAdmin.service.js';

export const VAI_TRO = ['HOC_VIEN', 'THAY_CO', 'CHUYEN_GIA', 'AI_AGENT'] as const;
/** DOC_SAI (giọng đọc sai/vấp) + KHONG_HIEU (chưa hiểu chỗ này) — thêm 14/11/2026 cho ô góp ý nhanh trong trang học. */
export const LOAI = ['THIEU_KIEN_THUC', 'SAI_SOT', 'LIEN_TUONG', 'NANG_CAP', 'KHAC', 'DOC_SAI', 'KHONG_HIEU'] as const;
/** Track video của trang học (VI = giọng chủ kênh, EN = bản tiếng Anh, YT = video YouTube tuyển chọn). */
export const NGUON_VIDEO = ['VI', 'EN', 'YT'] as const;
export const TRANG_THAI = [
  'MOI', 'DANG_DOI_CHIEU', 'DA_CO', 'NEN_BO_SUNG', 'DA_LEN_KE_HOACH', 'DA_BO_SUNG', 'KHONG_CHINH_XAC', 'TRUNG', 'AN',
] as const;
export type VaiTro = (typeof VAI_TRO)[number];
export type LoaiGopYKhoa = (typeof LOAI)[number];
export type TrangThaiGopYKhoa = (typeof TRANG_THAI)[number];

/** Trần gửi của MỘT người: 5 góp ý / giờ (đếm trong CSDL ⇒ đúng cả khi chạy nhiều tiến trình). */
export const TRAN_GOP_Y_MOI_GIO = 5;
/**
 * Trần của ô góp ý NHANH trong trang học: 20 / giờ / người (cùng bộ đếm với trần trên — đếm MỌI góp ý của người đó
 * trong một giờ). Vì sao nới: một lượt xem video 15 phút có thể vấp 5–10 chỗ đọc sai/khó hiểu, mỗi chỗ một dòng ngắn
 * gắn mốc — trần 5 sẽ chặn đúng người học chăm nhất. Không nới hơn: 20 câu/giờ đã là một câu mỗi 3 phút, và mỗi góp ý
 * đều nằm trong bài có thật của khoá + bị chặn trùng (vân tay gồm bài + mốc), nên spam không rẻ.
 */
export const TRAN_GOP_Y_NHANH_MOI_GIO = 20;
/** Mốc video tối đa: 24 giờ (giây). */
export const MOC_TOI_DA_GIAY = 86400;

const TEN_LOAI: Record<LoaiGopYKhoa, string> = {
  THIEU_KIEN_THUC: 'Thiếu kiến thức',
  SAI_SOT: 'Sai sót',
  LIEN_TUONG: 'Liên tưởng hay',
  NANG_CAP: 'Nâng cấp',
  KHAC: 'Khác',
  DOC_SAI: 'Đọc sai / vấp',
  KHONG_HIEU: 'Chưa hiểu',
};

/** 754 ⇒ "12:34", 3723 ⇒ "1:02:03". */
export function dinhDangMoc(giay: number): string {
  const t = Math.max(0, Math.floor(giay));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), x = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
}

// ─────────────────────────── Zod ───────────────────────────

const urlHttp = z
  .string()
  .trim()
  .max(1000)
  .refine((s) => /^https?:\/\/[^\s]+$/i.test(s), 'Link nguồn phải bắt đầu bằng http:// hoặc https://');

/**
 * `nhanh: true` = gửi từ ô góp ý nhanh trong trang học: BẮT BUỘC gắn bài; nội dung được ngắn (≥ 3 ký tự) hoặc bỏ trống
 * khi đã có mốc video / từ đọc sai (máy chủ tự soạn một câu tóm tắt); trần 20/giờ thay vì 5.
 * Trang góp ý chung (không `nhanh`) giữ luật cũ: nội dung 10–5000 ký tự.
 */
export const schemaTao = z
  .object({
    vaiTro: z.enum(VAI_TRO).default('HOC_VIEN'),
    laAi: z.boolean().optional(),
    tenAi: z.string().trim().max(100).optional().nullable(),
    loai: z.enum(LOAI),
    noiDung: z.string().trim().max(5000, 'Nội dung tối đa 5000 ký tự').optional().nullable(),
    nguon: z.union([urlHttp, z.literal('')]).optional().nullable(),
    lessonId: z.coerce.number().int().positive().optional().nullable(),
    lessonSlug: z.string().trim().max(255).optional().nullable(),
    nhanh: z.boolean().optional(),
    thoiDiemGiay: z.coerce
      .number()
      .min(0, 'Mốc video không được âm')
      .max(MOC_TOI_DA_GIAY, 'Mốc video tối đa 24 giờ')
      .transform((n) => Math.floor(n))
      .optional()
      .nullable(),
    nguonVideo: z.enum(NGUON_VIDEO).optional().nullable(),
    tuSai: z.string().trim().max(300, 'Từ/câu đọc sai tối đa 300 ký tự').optional().nullable(),
    nenDoc: z.string().trim().max(300, '"Nên đọc là" tối đa 300 ký tự').optional().nullable(),
  })
  .superRefine((v, ctx) => {
    const nd = v.noiDung?.trim() ?? '';
    if (!v.nhanh) {
      if (nd.length < 10) ctx.addIssue({ code: 'custom', path: ['noiDung'], message: 'Nội dung tối thiểu 10 ký tự' });
      return;
    }
    if (!v.lessonId && !v.lessonSlug?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['lessonId'], message: 'Góp ý nhanh phải gắn với một bài (lessonId)' });
    }
    if (nd.length > 2000) ctx.addIssue({ code: 'custom', path: ['noiDung'], message: 'Góp ý nhanh tối đa 2000 ký tự' });
    const coDauMoc = v.thoiDiemGiay != null || !!v.tuSai?.trim();
    if (nd.length < 3 && !coDauMoc) {
      ctx.addIssue({ code: 'custom', path: ['noiDung'], message: 'Viết vài chữ, hoặc gắn mốc video / từ bị đọc sai' });
    }
  })
  .transform((v) => {
    const laAi = v.laAi === true || v.vaiTro === 'AI_AGENT';
    const tuSai = v.tuSai?.trim() || null;
    const nenDoc = v.nenDoc?.trim() || null;
    let noiDung = v.noiDung?.trim() ?? '';
    if (!noiDung) {
      // Ô nhanh bỏ trống nội dung ⇒ một câu tóm tắt đọc được ở mọi nơi (thông báo admin, trang chung, script).
      const moc = v.thoiDiemGiay != null ? ` ở ${dinhDangMoc(v.thoiDiemGiay)}` : '';
      noiDung = tuSai
        ? `Đọc sai "${tuSai}"${nenDoc ? ` — nên đọc "${nenDoc}"` : ''}${moc}`
        : `${TEN_LOAI[v.loai]}${moc}`;
    }
    return {
      vaiTro: (laAi ? 'AI_AGENT' : v.vaiTro) as VaiTro,
      tenAi: laAi ? (v.tenAi?.trim() || null) : null,
      loai: v.loai,
      noiDung,
      nguon: v.nguon ? v.nguon : null,
      lessonId: v.lessonId ?? null,
      lessonSlug: v.lessonSlug?.trim() || null,
      nhanh: v.nhanh === true,
      thoiDiemGiay: v.thoiDiemGiay ?? null,
      nguonVideo: v.nguonVideo ?? null,
      tuSai,
      nenDoc,
    };
  })
  .refine((v) => v.vaiTro !== 'AI_AGENT' || !!v.tenAi, {
    message: 'Góp ý từ AI/agent phải ghi tên model/agent (tenAi)',
    path: ['tenAi'],
  });
export type DuLieuTao = z.output<typeof schemaTao>;

const bangChungItem = z.object({
  lessonSlug: z.string().trim().max(255).optional().nullable(),
  lessonId: z.coerce.number().int().positive().optional().nullable(),
  tieuDe: z.string().trim().max(300).optional().nullable(),
  trichDoan: z.string().trim().max(2000).optional().nullable(),
  tep: z.string().trim().max(400).optional().nullable(),
});
export type BangChung = z.output<typeof bangChungItem>;

export const schemaDoiChieu = z
  .object({
    trangThai: z.enum(TRANG_THAI).optional(),
    ketQuaDoiChieu: z.string().trim().max(10000).optional().nullable(),
    bangChung: z.array(bangChungItem).max(30).optional().nullable(),
    nguoiDoiChieu: z.string().trim().max(100).optional().nullable(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), 'Không có gì để cập nhật');
export type DuLieuDoiChieu = z.output<typeof schemaDoiChieu>;

export const schemaLoc = z.object({
  trangThai: z.string().trim().optional(),
  loai: z.enum(LOAI).optional(),
  lessonId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sapXep: z.enum(['moi', 'phieu']).default('moi'),
});

/** Ném ZodError thành 400 tiếng Việt — errorHandler của kho không biết ZodError. */
export function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.output<T> {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      const dau = e.issues[0];
      throw new AppError(dau ? `${dau.path.join('.') || 'dữ liệu'}: ${dau.message}` : 'Dữ liệu không hợp lệ', 400, 'VALIDATION', {
        issues: e.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    throw e;
  }
}

/** "a,b" ⇒ danh sách trạng thái hợp lệ. Trạng thái lạ ⇒ 400 (đừng âm thầm trả rỗng). */
export function tachTrangThai(s: string | undefined): TrangThaiGopYKhoa[] | undefined {
  if (!s) return undefined;
  const ds = s.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean);
  const sai = ds.filter((x) => !(TRANG_THAI as readonly string[]).includes(x));
  if (sai.length) throw new AppError(`Trạng thái không hợp lệ: ${sai.join(', ')}`, 400, 'VALIDATION');
  return ds as TrangThaiGopYKhoa[];
}

// ─────────────────────────── tiện ích ───────────────────────────

/** Vân tay nội dung: thường hoá, bỏ dấu câu/khoảng trắng thừa — "Thiếu X." và "thiếu  x" là một. */
export function vanTay(noiDung: string): string {
  const chuan = noiDung
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\s\p{P}]+/gu, ' ')
    .trim();
  return crypto.createHash('sha256').update(chuan).digest('hex');
}

/** "EN|||VI" ⇒ phần tiếng Việt (tiêu đề bài/khoá trong kho song ngữ). */
export function tieuDeVi(s: string | null | undefined): string {
  if (!s) return '';
  const i = s.indexOf('|||');
  return i >= 0 ? s.slice(i + 3).trim() || s.slice(0, i).trim() : s;
}

export type KhoaGon = {
  id: number; slug: string; title: string; courseCode: string | null; academyType: string;
  isPublished: boolean; status: string;
};

/** Tìm khoá theo slug. `choNguoiNgoai` ⇒ khoá nháp (chưa xuất bản, không phải "Sắp ra mắt") coi như không có. */
export async function timKhoa(slug: string, choNguoiNgoai = true): Promise<KhoaGon> {
  const k = await prisma.course.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, courseCode: true, academyType: true, isPublished: true, status: true },
  });
  if (!k) throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');
  if (choNguoiNgoai && !k.isPublished && k.status !== 'COMING_SOON') {
    throw new AppError('Không tìm thấy khoá học', 404, 'COURSE_NOT_FOUND');
  }
  return k;
}

/** Bài phải thuộc đúng khoá — chặn gắn góp ý vào bài của khoá khác. Nhận id HOẶC slug. */
async function timBaiTrongKhoa(courseId: number, lessonId: number | null, lessonSlug: string | null) {
  if (!lessonId && !lessonSlug) return null;
  const bai = await prisma.lesson.findFirst({
    where: {
      section: { courseId },
      ...(lessonId ? { id: lessonId } : { slug: lessonSlug! }),
    },
    select: { id: true },
  });
  if (!bai) throw new AppError('Bài học không thuộc khoá này', 400, 'LESSON_NOT_IN_COURSE');
  return bai.id;
}

export async function laAdmin(userId: number | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: { select: { name: true } } } } },
  });
  return (u?.roles ?? []).some((ur) => /^(role_)?(admin|superadmin)$/i.test(ur.role.name));
}

// ─────────────────────────── đọc ───────────────────────────

const CHON = {
  id: true,
  courseId: true,
  vaiTro: true,
  tenAi: true,
  loai: true,
  noiDung: true,
  nguon: true,
  thoiDiemGiay: true,
  nguonVideo: true,
  tuSai: true,
  nenDoc: true,
  trangThai: true,
  ketQuaDoiChieu: true,
  bangChung: true,
  nguoiDoiChieu: true,
  doiChieuLuc: true,
  soPhieu: true,
  createdAt: true,
  updatedAt: true,
  lesson: { select: { id: true, slug: true, title: true } },
  user: { select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } },
  course: { select: { id: true, slug: true, title: true, courseCode: true, academyType: true } },
} satisfies Prisma.CourseSuggestionSelect;

type HangGopY = Prisma.CourseSuggestionGetPayload<{ select: typeof CHON }>;

/**
 * Hình dạng trả ra ngoài — KHÔNG email; tên người gửi = displayName → fullName → username.
 * `cuaBan` = góp ý của chính người đang xem (ô góp ý nhanh đánh dấu "của bạn").
 */
export function chuanHoa(r: HangGopY, daBau = false, viewerId: number | null = null) {
  return {
    id: r.id,
    vaiTro: r.vaiTro,
    tenAi: r.tenAi,
    loai: r.loai,
    noiDung: r.noiDung,
    nguon: r.nguon,
    thoiDiemGiay: r.thoiDiemGiay,
    nguonVideo: r.nguonVideo,
    tuSai: r.tuSai,
    nenDoc: r.nenDoc,
    trangThai: r.trangThai,
    ketQuaDoiChieu: r.ketQuaDoiChieu,
    bangChung: (Array.isArray(r.bangChung) ? r.bangChung : null) as BangChung[] | null,
    nguoiDoiChieu: r.nguoiDoiChieu,
    doiChieuLuc: r.doiChieuLuc,
    soPhieu: r.soPhieu,
    daBau,
    cuaBan: viewerId != null && r.user?.id === viewerId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    course: { slug: r.course.slug, title: r.course.title, courseCode: r.course.courseCode, academyType: r.course.academyType },
    lesson: r.lesson ? { id: r.lesson.id, slug: r.lesson.slug, title: r.lesson.title } : null,
    nguoiGui: r.user
      ? {
          id: r.user.id,
          username: r.user.username,
          ten: r.user.displayName || r.user.fullName || r.user.username,
          avatarUrl: r.user.avatarUrl,
        }
      : null,
  };
}
export type GopYKhoaRa = ReturnType<typeof chuanHoa>;

export interface LocDanhSach {
  courseId?: number;
  trangThai?: TrangThaiGopYKhoa[];
  loai?: LoaiGopYKhoa;
  lessonId?: number;
  page: number;
  limit: number;
  sapXep: 'moi' | 'phieu';
  /** false ⇒ không bao giờ trả trạng thái AN (đường công khai cho người thường). */
  thayAn: boolean;
  viewerId?: number | null;
}

export async function danhSach(loc: LocDanhSach) {
  const where: Prisma.CourseSuggestionWhereInput = {
    ...(loc.courseId ? { courseId: loc.courseId } : {}),
    ...(loc.loai ? { loai: loc.loai } : {}),
    ...(loc.lessonId ? { lessonId: loc.lessonId } : {}),
  };
  let ds = loc.trangThai;
  if (!loc.thayAn) ds = (ds ?? TRANG_THAI.filter((t) => t !== 'AN')).filter((t) => t !== 'AN');
  if (ds) where.trangThai = { in: ds };

  const [tong, hang] = await Promise.all([
    prisma.courseSuggestion.count({ where }),
    prisma.courseSuggestion.findMany({
      where,
      select: CHON,
      orderBy: loc.sapXep === 'phieu' ? [{ soPhieu: 'desc' }, { createdAt: 'desc' }] : [{ createdAt: 'desc' }],
      skip: (loc.page - 1) * loc.limit,
      take: loc.limit,
    }),
  ]);

  let daBau = new Set<number>();
  if (loc.viewerId && hang.length) {
    const phieu = await prisma.courseSuggestionVote.findMany({
      where: { userId: loc.viewerId, suggestionId: { in: hang.map((h) => h.id) } },
      select: { suggestionId: true },
    });
    daBau = new Set(phieu.map((p) => p.suggestionId));
  }

  return {
    items: hang.map((h) => chuanHoa(h, daBau.has(h.id), loc.viewerId ?? null)),
    total: tong,
    page: loc.page,
    limit: loc.limit,
    totalPages: Math.max(1, Math.ceil(tong / loc.limit)),
  };
}

/** Số góp ý theo trạng thái của MỘT khoá (không đếm AN cho người thường) — cho nút ở hero + bộ lọc. */
export async function demTheoTrangThai(courseId: number, thayAn: boolean) {
  const nhom = await prisma.courseSuggestion.groupBy({
    by: ['trangThai'],
    where: { courseId, ...(thayAn ? {} : { trangThai: { not: 'AN' } }) },
    _count: { _all: true },
  });
  const theo: Record<string, number> = {};
  let tong = 0;
  for (const n of nhom) {
    theo[n.trangThai] = n._count._all;
    tong += n._count._all;
  }
  return { tong, theoTrangThai: theo };
}

export async function layMot(id: number) {
  const r = await prisma.courseSuggestion.findUnique({ where: { id }, select: CHON });
  if (!r) throw new AppError('Không tìm thấy góp ý', 404, 'SUGGESTION_NOT_FOUND');
  return r;
}

// ─────────────────────────── ghi ───────────────────────────

export interface NguonTao {
  userId: number | null;
  /** true ⇒ đường máy (internal): bỏ trần 5/giờ của người, nhưng vẫn chặn trùng. */
  quaNoiBo?: boolean;
}

export async function tao(khoa: KhoaGon, duLieu: DuLieuTao, nguon: NguonTao) {
  const lessonId = await timBaiTrongKhoa(khoa.id, duLieu.lessonId, duLieu.lessonSlug);

  if (nguon.userId && !nguon.quaNoiBo) {
    const motGioTruoc = new Date(Date.now() - 60 * 60 * 1000);
    const daGui = await prisma.courseSuggestion.count({
      where: { userId: nguon.userId, createdAt: { gte: motGioTruoc } },
    });
    const tran = duLieu.nhanh ? TRAN_GOP_Y_NHANH_MOI_GIO : TRAN_GOP_Y_MOI_GIO;
    if (daGui >= tran) {
      throw new AppError(
        duLieu.nhanh
          ? `Bạn đã gửi ${tran} góp ý trong một giờ qua — nghỉ chút rồi gửi tiếp nhé.`
          : `Bạn đã gửi ${tran} góp ý trong một giờ qua — nghỉ chút rồi gửi tiếp nhé (góp ý nhanh ngay dưới video trong bài vẫn gửi được tới ${TRAN_GOP_Y_NHANH_MOI_GIO}/giờ).`,
        429,
        'GOP_Y_KHOA_RATE_LIMIT',
      );
    }
  }

  // Vân tay: góp ý có mốc / từ đọc sai ⇒ gồm cả bài + mốc + từ, để "chỗ này khó hiểu" ở 2 chỗ khác nhau không bị coi là
  // trùng. Góp ý thường giữ đúng vân tay cũ (chỉ nội dung) ⇒ dữ liệu đã có vẫn chặn trùng như trước.
  const coDinhVi = duLieu.thoiDiemGiay != null || !!duLieu.tuSai;
  const vt = vanTay(
    coDinhVi
      ? `${duLieu.noiDung}\n#bai:${lessonId ?? ''}#t:${duLieu.thoiDiemGiay ?? ''}#v:${duLieu.nguonVideo ?? ''}#tu:${duLieu.tuSai ?? ''}`
      : duLieu.noiDung,
  );
  const trung = await prisma.courseSuggestion.findFirst({
    where: { courseId: khoa.id, vanTay: vt },
    select: { id: true, trangThai: true },
  });
  if (trung) {
    throw new AppError(
      'Góp ý này đã có người gửi cho khoá — bấm "Tôi cũng thấy cần" ở góp ý đó thay vì gửi lại.',
      409,
      'GOP_Y_KHOA_TRUNG',
      { trungVoiId: trung.id },
    );
  }

  const row = await prisma.courseSuggestion.create({
    data: {
      courseId: khoa.id,
      lessonId,
      userId: nguon.userId,
      vaiTro: duLieu.vaiTro,
      tenAi: duLieu.tenAi,
      loai: duLieu.loai,
      noiDung: duLieu.noiDung,
      nguon: duLieu.nguon,
      thoiDiemGiay: duLieu.thoiDiemGiay,
      nguonVideo: duLieu.nguonVideo,
      tuSai: duLieu.tuSai,
      nenDoc: duLieu.nenDoc,
      vanTay: vt,
    },
    select: CHON,
  });

  // Báo admin — chạy nền, NGOÀI giao dịch, nuốt lỗi (baoAdmin tự nuốt; bọc thêm cho chắc).
  void baoAdmin({
    loai: 'GOP_Y',
    tieuDe: `Góp ý khoá ${khoa.courseCode || khoa.slug} · ${TEN_LOAI[duLieu.loai]}${
      duLieu.vaiTro === 'AI_AGENT' ? ` · 🤖 ${duLieu.tenAi}` : ''
    }`.slice(0, 190),
    noiDung: `${tieuDeVi(khoa.title)}${row.lesson ? ` › ${tieuDeVi(row.lesson.title)}` : ''}${
      duLieu.thoiDiemGiay != null ? ` · ⏱ ${dinhDangMoc(duLieu.thoiDiemGiay)}${duLieu.nguonVideo ? ` (${duLieu.nguonVideo})` : ''}` : ''
    }\n${duLieu.noiDung.slice(0, 400)}`,
    duongDan: `/courses/${khoa.slug}/gop-y?id=${row.id}`,
    mucDo: duLieu.loai === 'SAI_SOT' || duLieu.loai === 'DOC_SAI' ? 'can_xu_ly' : 'thuong',
    userId: nguon.userId,
    entityId: row.id,
    khoaChongTrung: `GOP_Y_KHOA:${row.id}`,
  }).catch((err: unknown) => logger.warn('[gop-y-khoa] báo admin hỏng (góp ý vẫn đã lưu)', { id: row.id, error: String(err) }));

  return chuanHoa(row, false, nguon.userId);
}

/** Bật/tắt phiếu "Tôi cũng thấy cần". Không bầu cho góp ý ẩn; tự bầu cho mình vẫn được (không có hại). */
export async function bau(id: number, userId: number) {
  const g = await prisma.courseSuggestion.findUnique({ where: { id }, select: { id: true, trangThai: true } });
  if (!g || g.trangThai === 'AN') throw new AppError('Không tìm thấy góp ý', 404, 'SUGGESTION_NOT_FOUND');

  return prisma.$transaction(async (tx) => {
    const daCo = await tx.courseSuggestionVote.findUnique({
      where: { suggestionId_userId: { suggestionId: id, userId } },
      select: { id: true },
    });
    if (daCo) {
      await tx.courseSuggestionVote.delete({ where: { id: daCo.id } });
    } else {
      try {
        await tx.courseSuggestionVote.create({ data: { suggestionId: id, userId } });
      } catch (e) {
        // Hai cú bấm song song: cú sau gặp P2002 ⇒ coi như đã bầu.
        if ((e as { code?: string }).code !== 'P2002') throw e;
      }
    }
    const so = await tx.courseSuggestionVote.count({ where: { suggestionId: id } });
    await tx.courseSuggestion.update({ where: { id }, data: { soPhieu: so } });
    return { daBau: !daCo, soPhieu: so };
  });
}

/** Ghi kết quả đối chiếu / đổi trạng thái (admin + đường máy). */
export async function ghiDoiChieu(id: number, d: DuLieuDoiChieu, macDinhNguoi: string) {
  await layMot(id);
  const coNoiDungDoiChieu = d.ketQuaDoiChieu !== undefined || d.bangChung !== undefined;
  const r = await prisma.courseSuggestion.update({
    where: { id },
    data: {
      ...(d.trangThai ? { trangThai: d.trangThai } : {}),
      ...(d.ketQuaDoiChieu !== undefined ? { ketQuaDoiChieu: d.ketQuaDoiChieu || null } : {}),
      ...(d.bangChung !== undefined
        ? { bangChung: d.bangChung && d.bangChung.length ? (d.bangChung as Prisma.InputJsonValue) : Prisma.DbNull }
        : {}),
      ...(coNoiDungDoiChieu || (d.trangThai && d.trangThai !== 'MOI')
        ? { nguoiDoiChieu: d.nguoiDoiChieu || macDinhNguoi, doiChieuLuc: new Date() }
        : d.nguoiDoiChieu
          ? { nguoiDoiChieu: d.nguoiDoiChieu }
          : {}),
    },
    select: CHON,
  });
  return chuanHoa(r);
}
