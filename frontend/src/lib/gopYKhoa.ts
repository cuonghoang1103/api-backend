/**
 * Góp ý & bổ sung cho khoá học (14/11/2026) — kiểu dữ liệu + nhãn song ngữ dùng chung cho trang
 * /courses/<slug>/gop-y, nút ở hero khoá và link "Góp ý cho bài này" trong trang học.
 * Backend: src/services/courseSuggestion.service.ts · tài liệu: docs/gop-y-khoa-hoc.md.
 */

export const VAI_TRO = ['HOC_VIEN', 'THAY_CO', 'CHUYEN_GIA', 'AI_AGENT'] as const;
export const LOAI = ['THIEU_KIEN_THUC', 'SAI_SOT', 'LIEN_TUONG', 'NANG_CAP', 'KHAC'] as const;
export const TRANG_THAI = [
  'MOI', 'DANG_DOI_CHIEU', 'DA_CO', 'NEN_BO_SUNG', 'DA_LEN_KE_HOACH', 'DA_BO_SUNG', 'KHONG_CHINH_XAC', 'TRUNG', 'AN',
] as const;
export type VaiTroGopY = (typeof VAI_TRO)[number];
export type LoaiGopY = (typeof LOAI)[number];
export type TrangThaiGopY = (typeof TRANG_THAI)[number];

export interface BangChungGopY {
  lessonSlug?: string | null;
  lessonId?: number | null;
  tieuDe?: string | null;
  trichDoan?: string | null;
  tep?: string | null;
}

export interface GopYKhoa {
  id: number;
  vaiTro: VaiTroGopY;
  tenAi: string | null;
  loai: LoaiGopY;
  noiDung: string;
  nguon: string | null;
  trangThai: TrangThaiGopY;
  ketQuaDoiChieu: string | null;
  bangChung: BangChungGopY[] | null;
  nguoiDoiChieu: string | null;
  doiChieuLuc: string | null;
  soPhieu: number;
  daBau: boolean;
  createdAt: string;
  updatedAt: string;
  course: { slug: string; title: string; courseCode: string | null; academyType: string };
  lesson: { id: number; slug: string | null; title: string } | null;
  nguoiGui: { id: number; username: string; ten: string; avatarUrl: string | null } | null;
}

export interface TrangGopYKhoa {
  items: GopYKhoa[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  laAdmin?: boolean;
}

export interface GuiGopYKhoa {
  vaiTro: VaiTroGopY;
  laAi?: boolean;
  tenAi?: string | null;
  loai: LoaiGopY;
  noiDung: string;
  nguon?: string | null;
  lessonId?: number | null;
}

export interface DoiChieuGopYKhoa {
  trangThai?: TrangThaiGopY;
  ketQuaDoiChieu?: string | null;
  bangChung?: BangChungGopY[] | null;
  nguoiDoiChieu?: string | null;
}

/** Màu huy hiệu trạng thái — chỉ dùng biến --k-* (tự đổi theo theme-dark). */
export const TONE_TRANG_THAI: Record<TrangThaiGopY, { bg: string; ink: string }> = {
  MOI: { bg: 'var(--k-accent-soft)', ink: 'var(--k-accent)' },
  DANG_DOI_CHIEU: { bg: 'var(--k-cyan-soft)', ink: 'var(--k-accent-2)' },
  DA_CO: { bg: 'var(--k-green-soft)', ink: 'var(--k-green)' },
  NEN_BO_SUNG: { bg: 'var(--k-amber-soft)', ink: 'var(--k-amber)' },
  DA_LEN_KE_HOACH: { bg: 'var(--k-cyan-soft)', ink: 'var(--k-accent-2)' },
  DA_BO_SUNG: { bg: 'var(--k-green-soft)', ink: 'var(--k-green)' },
  KHONG_CHINH_XAC: { bg: 'var(--k-rose-soft)', ink: 'var(--k-rose)' },
  TRUNG: { bg: 'var(--k-card-2)', ink: 'var(--k-ink-3)' },
  AN: { bg: 'var(--k-card-2)', ink: 'var(--k-ink-3)' },
};

export const CHU_GOP_Y = {
  vi: {
    nut: 'Góp ý & bổ sung',
    nutDem: (n: number) => `Góp ý & bổ sung (${n})`,
    tieuDe: 'Góp ý & bổ sung',
    veKhoa: 'Về trang khoá',
    gioiThieu:
      'Thấy bài thiếu kiến thức, có chỗ sai, có một liên tưởng hay hay muốn nâng cấp khoá? Viết vào đây — chuyên gia, thầy cô, học viên, hay một AI/agent đều được. Mỗi góp ý sẽ được đối chiếu với nội dung khoá: đã có ở bài nào, có chính xác không, có nên bổ sung không — rồi đưa vào kế hoạch nâng cấp khoá.',
    quyTrinh: ['Bạn gửi góp ý', 'Đối chiếu với bài trong khoá', 'Kết luận + bằng chứng', 'Lên kế hoạch & bổ sung'],
    formTieuDe: 'Gửi góp ý',
    vaiTro: 'Bạn là',
    loai: 'Loại góp ý',
    bai: 'Bài liên quan (tuỳ chọn)',
    caKhoa: '— Cả khoá / không rõ bài —',
    noiDung: 'Nội dung',
    noiDungGoiY: 'Thiếu gì, sai ở đâu, nên bổ sung thế nào… Càng cụ thể (dẫn câu trong bài, ví dụ) càng dễ đối chiếu.',
    nguon: 'Link nguồn (tuỳ chọn)',
    nguonGoiY: 'https://… (tài liệu chính thức, bài báo, đặc tả)',
    laAi: 'Tôi là AI/agent',
    tenAi: 'Tên model / agent',
    tenAiGoiY: 'vd: Claude Opus 5.5, GPT-6, agent nội bộ…',
    gui: 'Gửi góp ý',
    dangGui: 'Đang gửi…',
    canDangNhap: 'Đăng nhập để gửi góp ý và bấm "Tôi cũng thấy cần".',
    dangNhap: 'Đăng nhập',
    camOn: 'Cảm ơn bạn! Góp ý đã được ghi nhận và sẽ được đối chiếu.',
    kyTu: (n: number) => `${n}/5000 ký tự`,
    danhSach: 'Góp ý đã gửi',
    tatCa: 'Tất cả',
    locTrangThai: 'Trạng thái',
    locLoai: 'Loại',
    sapXep: 'Sắp xếp',
    moiNhat: 'Mới nhất',
    nhieuPhieu: 'Nhiều phiếu nhất',
    rong: 'Chưa có góp ý nào ở đây. Hãy là người đầu tiên!',
    cungThayCan: 'Tôi cũng thấy cần',
    phieu: (n: number) => `${n} phiếu`,
    ketQua: 'Kết quả đối chiếu',
    bangChung: 'Bằng chứng',
    moBai: 'Mở bài',
    doiChieuBoi: (ai: string, luc: string) => `Đối chiếu bởi ${ai} · ${luc}`,
    nguonLink: 'Nguồn',
    bai_: 'Bài',
    an: 'Ẩn danh',
    xemThem: 'Xem thêm',
    truoc: 'Trước',
    sau: 'Sau',
    adminTieuDe: 'Đối chiếu (admin)',
    adminTrangThai: 'Trạng thái',
    adminKetQua: 'Kết luận đối chiếu',
    adminBangChung: 'Bằng chứng — mỗi dòng: slug-bài | trích đoạn',
    adminLuu: 'Lưu đối chiếu',
    daLuu: 'Đã lưu',
    gopYChoBai: 'Góp ý cho bài này',
    loiTai: 'Không tải được góp ý',
    tenVaiTro: {
      HOC_VIEN: 'Học viên', THAY_CO: 'Thầy cô', CHUYEN_GIA: 'Chuyên gia', AI_AGENT: 'AI / agent',
    } as Record<VaiTroGopY, string>,
    tenLoai: {
      THIEU_KIEN_THUC: 'Thiếu kiến thức', SAI_SOT: 'Sai sót', LIEN_TUONG: 'Liên tưởng hay', NANG_CAP: 'Nâng cấp', KHAC: 'Khác',
    } as Record<LoaiGopY, string>,
    tenTrangThai: {
      MOI: 'Mới', DANG_DOI_CHIEU: 'Đang đối chiếu', DA_CO: 'Đã có trong bài', NEN_BO_SUNG: 'Nên bổ sung',
      DA_LEN_KE_HOACH: 'Đã lên kế hoạch', DA_BO_SUNG: 'Đã bổ sung', KHONG_CHINH_XAC: 'Chưa chính xác', TRUNG: 'Trùng',
      AN: 'Đã ẩn',
    } as Record<TrangThaiGopY, string>,
  },
  en: {
    nut: 'Suggest & improve',
    nutDem: (n: number) => `Suggest & improve (${n})`,
    tieuDe: 'Suggestions & additions',
    veKhoa: 'Back to the course',
    gioiThieu:
      'Spotted missing knowledge, a mistake, a great connection, or a way to level the course up? Write it here — experts, teachers, learners and AI agents are all welcome. Every suggestion is checked against the course: is it already covered (and where), is it accurate, is it worth adding — then it goes into the course upgrade plan.',
    quyTrinh: ['You suggest', 'Checked against the lessons', 'Verdict + evidence', 'Planned & added'],
    formTieuDe: 'Send a suggestion',
    vaiTro: 'You are',
    loai: 'Type',
    bai: 'Related lesson (optional)',
    caKhoa: '— Whole course / not sure —',
    noiDung: 'Details',
    noiDungGoiY: 'What is missing, what is wrong, how to improve it… Quote the lesson or give an example — the more specific, the easier to check.',
    nguon: 'Source link (optional)',
    nguonGoiY: 'https://… (official docs, paper, spec)',
    laAi: 'I am an AI/agent',
    tenAi: 'Model / agent name',
    tenAiGoiY: 'e.g. Claude Opus 5.5, GPT-6, in-house agent…',
    gui: 'Send suggestion',
    dangGui: 'Sending…',
    canDangNhap: 'Sign in to send suggestions and upvote them.',
    dangNhap: 'Sign in',
    camOn: 'Thank you! Your suggestion is recorded and will be checked.',
    kyTu: (n: number) => `${n}/5000 characters`,
    danhSach: 'Suggestions',
    tatCa: 'All',
    locTrangThai: 'Status',
    locLoai: 'Type',
    sapXep: 'Sort',
    moiNhat: 'Newest',
    nhieuPhieu: 'Most upvoted',
    rong: 'No suggestions here yet. Be the first!',
    cungThayCan: 'I need this too',
    phieu: (n: number) => `${n} vote${n === 1 ? '' : 's'}`,
    ketQua: 'Review result',
    bangChung: 'Evidence',
    moBai: 'Open lesson',
    doiChieuBoi: (ai: string, luc: string) => `Checked by ${ai} · ${luc}`,
    nguonLink: 'Source',
    bai_: 'Lesson',
    an: 'Anonymous',
    xemThem: 'Show more',
    truoc: 'Previous',
    sau: 'Next',
    adminTieuDe: 'Review (admin)',
    adminTrangThai: 'Status',
    adminKetQua: 'Review conclusion',
    adminBangChung: 'Evidence — one per line: lesson-slug | excerpt',
    adminLuu: 'Save review',
    daLuu: 'Saved',
    gopYChoBai: 'Suggest for this lesson',
    loiTai: 'Could not load suggestions',
    tenVaiTro: {
      HOC_VIEN: 'Learner', THAY_CO: 'Teacher', CHUYEN_GIA: 'Expert', AI_AGENT: 'AI / agent',
    } as Record<VaiTroGopY, string>,
    tenLoai: {
      THIEU_KIEN_THUC: 'Missing knowledge', SAI_SOT: 'Mistake', LIEN_TUONG: 'Great connection', NANG_CAP: 'Upgrade', KHAC: 'Other',
    } as Record<LoaiGopY, string>,
    tenTrangThai: {
      MOI: 'New', DANG_DOI_CHIEU: 'Under review', DA_CO: 'Already covered', NEN_BO_SUNG: 'Worth adding',
      DA_LEN_KE_HOACH: 'Planned', DA_BO_SUNG: 'Added', KHONG_CHINH_XAC: 'Not accurate', TRUNG: 'Duplicate', AN: 'Hidden',
    } as Record<TrangThaiGopY, string>,
  },
};

/** Đường tới đúng bài trong trang học — ưu tiên id, không có thì slug (trang học nhận `?lessonSlug=`). */
export function duongBaiGopY(courseSlug: string, b: { lessonId?: number | null; lessonSlug?: string | null; id?: number | null; slug?: string | null }): string | null {
  const id = b.lessonId ?? b.id ?? null;
  const slug = b.lessonSlug ?? b.slug ?? null;
  if (id) return `/courses/${courseSlug}/learn?lessonId=${id}`;
  if (slug) return `/courses/${courseSlug}/learn?lessonSlug=${encodeURIComponent(slug)}`;
  return null;
}
