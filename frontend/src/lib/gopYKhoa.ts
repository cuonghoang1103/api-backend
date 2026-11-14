/**
 * Góp ý & bổ sung cho khoá học (14/11/2026) — kiểu dữ liệu + nhãn song ngữ dùng chung cho trang
 * /courses/<slug>/gop-y, nút ở hero khoá và link "Góp ý cho bài này" trong trang học.
 * Backend: src/services/courseSuggestion.service.ts · tài liệu: docs/gop-y-khoa-hoc.md.
 */

export const VAI_TRO = ['HOC_VIEN', 'THAY_CO', 'CHUYEN_GIA', 'AI_AGENT'] as const;
export const LOAI = ['THIEU_KIEN_THUC', 'SAI_SOT', 'LIEN_TUONG', 'NANG_CAP', 'KHAC', 'DOC_SAI', 'KHONG_HIEU'] as const;
/** Loại hiện thành CHIP trong ô góp ý nhanh dưới video (trang học) — thứ tự = thứ tự chip. */
export const LOAI_NHANH = ['DOC_SAI', 'KHONG_HIEU', 'THIEU_KIEN_THUC', 'KHAC'] as const;
export type NguonVideoGopY = 'VI' | 'EN' | 'YT';
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
  /** Mốc video (giây từ đầu video) lúc góp ý — ô góp ý nhanh trong trang học. */
  thoiDiemGiay: number | null;
  nguonVideo: NguonVideoGopY | null;
  tuSai: string | null;
  nenDoc: string | null;
  trangThai: TrangThaiGopY;
  ketQuaDoiChieu: string | null;
  bangChung: BangChungGopY[] | null;
  nguoiDoiChieu: string | null;
  doiChieuLuc: string | null;
  soPhieu: number;
  daBau: boolean;
  /** Góp ý của chính người đang xem. */
  cuaBan?: boolean;
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
  /** true = ô góp ý nhanh trong trang học (bắt buộc lessonId, nội dung được ngắn, trần 20/giờ). */
  nhanh?: boolean;
  thoiDiemGiay?: number | null;
  nguonVideo?: NguonVideoGopY | null;
  tuSai?: string | null;
  nenDoc?: string | null;
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
      DOC_SAI: 'Đọc sai / vấp', KHONG_HIEU: 'Chưa hiểu',
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
      DOC_SAI: 'Mispronounced / stumble', KHONG_HIEU: 'Not clear',
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

/** 754 ⇒ "12:34", 3723 ⇒ "1:02:03" (khớp `dinhDangMoc` ở backend). */
export function dinhDangMoc(giay: number): string {
  const t = Math.max(0, Math.floor(giay));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), x = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
}

/** "12:34" / "1:02:03" / "754" ⇒ giây; sai dạng ⇒ null. Giây/phút phải < 60 khi có dấu ":". */
export function docMoc(chu: string): number | null {
  const s = chu.trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number(s) <= 86400 ? Number(s) : null;
  const m = /^(?:(\d+):)?(\d{1,2}):(\d{1,2})$/.exec(s);
  if (!m) return null;
  const h = Number(m[1] ?? 0), p = Number(m[2]), g = Number(m[3]);
  if (g >= 60 || (m[1] !== undefined && p >= 60)) return null;
  const tong = h * 3600 + p * 60 + g;
  return tong <= 86400 ? tong : null;
}

/** Chữ của ô góp ý nhanh dưới video (trang học). */
export const CHU_GOP_Y_NHANH = {
  vi: {
    tieuDe: 'Góp ý nhanh cho bài này',
    moTa: 'Thấy chỗ nào đọc sai, vấp, khó hiểu hay thiếu — bấm một nút, mốc video tự điền.',
    chip: { DOC_SAI: '🔊 Đọc sai / vấp', KHONG_HIEU: '🤔 Chưa hiểu chỗ này', THIEU_KIEN_THUC: '➕ Cần bổ sung', KHAC: '🐞 Lỗi khác' } as Record<string, string>,
    moc: 'Mốc video',
    mocGoiY: 'mm:ss',
    layLai: 'Lấy lại thời điểm hiện tại',
    boMoc: 'Bỏ mốc',
    khongDocDuocMoc: 'Video này không cho đọc mốc tự động — gõ tay mm:ss nhé.',
    mocSai: 'Mốc phải dạng mm:ss (vd 3:12) hoặc số giây.',
    tuSai: 'Từ/câu bị đọc sai',
    tuSaiGoiY: 'vd: TypeScript',
    nenDoc: 'Nên đọc là (tuỳ chọn)',
    nenDocGoiY: 'vd: tai-xcríp',
    noiDungGoiY: {
      DOC_SAI: 'Ghi thêm nếu cần (tuỳ chọn)…',
      KHONG_HIEU: 'Chỗ nào chưa hiểu? Hỏi cụ thể giúp mình bổ sung đúng chỗ…',
      THIEU_KIEN_THUC: 'Cần bổ sung gì ở chỗ này?…',
      KHAC: 'Lỗi gì? (hình, chữ trên slide, âm thanh, code…)',
    } as Record<string, string>,
    phimTat: 'Enter để gửi · Shift+Enter xuống dòng',
    gui: 'Gửi',
    dangGui: 'Đang gửi…',
    huy: 'Đóng',
    camOn: 'Đã ghi nhận — cảm ơn bạn! Góp ý sẽ được đối chiếu và sửa đúng chỗ.',
    canDangNhap: 'Đăng nhập để góp ý',
    danhSach: (n: number) => `Góp ý của bài này (${n})`,
    rong: 'Chưa có góp ý nào cho bài này.',
    cuaBan: 'của bạn',
    tuaToi: (m: string) => `Tua tới ${m}`,
    trackKhac: (t: string) => `Mốc của video ${t} — bấm để chuyển sang ${t} và tua`,
    docSai: 'Đọc sai',
    nenDocLa: 'nên đọc',
    trangChung: 'Góp ý dài / có nguồn? Mở trang góp ý của khoá',
    thuGon: 'Thu gọn',
    moRong: 'Mở',
    ketQua: 'Kết quả',
    xemThem: (n: number) => `Xem thêm ${n} góp ý`,
  },
  en: {
    tieuDe: 'Quick feedback on this lesson',
    moTa: 'Mispronounced word, a stumble, something unclear or missing? Tap a button — the video time fills in itself.',
    chip: { DOC_SAI: '🔊 Mispronounced', KHONG_HIEU: '🤔 Not clear here', THIEU_KIEN_THUC: '➕ Needs more', KHAC: '🐞 Other issue' } as Record<string, string>,
    moc: 'Video time',
    mocGoiY: 'mm:ss',
    layLai: 'Use the current time',
    boMoc: 'No time',
    khongDocDuocMoc: 'This video does not expose its time — type mm:ss.',
    mocSai: 'Time must be mm:ss (e.g. 3:12) or seconds.',
    tuSai: 'Word/phrase read wrong',
    tuSaiGoiY: 'e.g. TypeScript',
    nenDoc: 'Should be read as (optional)',
    nenDocGoiY: 'e.g. TYPE-script',
    noiDungGoiY: {
      DOC_SAI: 'Anything to add (optional)…',
      KHONG_HIEU: 'What is unclear? Ask precisely so the right spot gets fixed…',
      THIEU_KIEN_THUC: 'What should be added here?…',
      KHAC: 'What is wrong? (picture, slide text, audio, code…)',
    } as Record<string, string>,
    phimTat: 'Enter to send · Shift+Enter for a new line',
    gui: 'Send',
    dangGui: 'Sending…',
    huy: 'Close',
    camOn: 'Recorded — thank you! It will be checked and fixed at that spot.',
    canDangNhap: 'Sign in to give feedback',
    danhSach: (n: number) => `Feedback on this lesson (${n})`,
    rong: 'No feedback on this lesson yet.',
    cuaBan: 'yours',
    tuaToi: (m: string) => `Jump to ${m}`,
    trackKhac: (t: string) => `Time on the ${t} video — click to switch to ${t} and jump`,
    docSai: 'Read wrong',
    nenDocLa: 'should be',
    trangChung: 'Longer note or a source? Open the course feedback page',
    thuGon: 'Collapse',
    moRong: 'Open',
    ketQua: 'Result',
    xemThem: (n: number) => `Show ${n} more`,
  },
};
