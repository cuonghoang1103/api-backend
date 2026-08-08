/**
 * CV công khai — cho phép khách trên trang /about tải CV của CHỦ SITE mà không
 * cần đăng nhập.
 *
 * ─── VÌ SAO LÀM THẾ NÀY ─────────────────────────────────────────────────────
 * Toàn bộ `/api/v1/cv` nằm sau `authenticate`, đúng như phải thế: CV là dữ liệu
 * cá nhân. Nhưng trang giới thiệu bản thân cần đúng MỘT cái CV tải được. Nên
 * thay vì mở rộng quyền, module này mở một cửa hẹp:
 *
 *   · TẮT mặc định. Không cấu hình gì thì mọi endpoint công khai trả 404.
 *   · Chỉ phục vụ ĐÚNG MỘT `userId` ghi trong cấu hình. Không có tham số nào
 *     từ client chọn được người khác — không thể duyệt id để moi CV người lạ.
 *   · `redactContact` (mặc định BẬT) xoá số điện thoại + địa chỉ trước khi
 *     render. Email và link nghề nghiệp thì giữ, vì đó là mục đích của CV.
 *   · Cấu hình nằm ở bảng `app_settings` sẵn có (cùng cách `cv_rules_overrides`
 *     đang làm) nên KHÔNG cần migration, và bật/tắt được ngay trong lúc chạy.
 *
 * ─── VÌ SAO KHOÁ TIẾNG VIỆT ────────────────────────────────────────────────
 * `exportCvData` dịch sang EN bằng LLM. Endpoint này ai gọi cũng được, nên cho
 * phép EN đồng nghĩa với việc mở một nút "đốt token" công khai. Muốn có bản EN
 * thì phải cache bản dịch chứ không dịch theo từng lượt tải.
 */
import { prisma } from '../../config/database.js';
import { findProfile } from './profile.service.js';
import { exportCvData, type ExportFormat } from './export.service.js';
import { toRenderCv, type RenderCv } from './export/cvData.js';

const KEY = 'public_cv';

/** Định dạng cho tải công khai. Cố tình KHÔNG có `json`: JSON Resume là bản sao
 *  máy-đọc-được đầy đủ của hồ sơ, tiện cho việc thu thập dữ liệu hàng loạt hơn
 *  là cho một người đang đọc CV. */
const ALLOWED_FORMATS = ['pdf', 'docx', 'txt'] as const;
export type PublicCvFormat = (typeof ALLOWED_FORMATS)[number];

export function isPublicCvFormat(v: string): v is PublicCvFormat {
  return (ALLOWED_FORMATS as readonly string[]).includes(v);
}

export interface PublicCvConfig {
  enabled: boolean;
  userId: number | null;
  /** Tên hiện trên nút tải. Rỗng thì lấy `fullName` trong hồ sơ. */
  displayName: string;
  /** Một dòng mô tả dưới nút. Rỗng thì lấy `headline` trong hồ sơ. */
  headline: string;
  template: string;
  market: 'VN' | 'INTERNATIONAL';
  /** Ẩn số điện thoại + địa chỉ khỏi bản công khai. */
  redactContact: boolean;
}

export const DEFAULT_PUBLIC_CV: PublicCvConfig = {
  enabled: false,
  userId: null,
  displayName: '',
  headline: '',
  template: 'technical',
  market: 'VN',
  redactContact: true,
};

/** Nhận bất cứ thứ gì từ DB / form admin và ép về đúng hình dạng.
 *  Cấu hình hỏng phải rơi về "tắt", không được ném lỗi làm sập trang about. */
export function sanitizeConfig(raw: unknown): PublicCvConfig {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PUBLIC_CV };
  const o = raw as Record<string, unknown>;
  const userId = Number(o.userId);
  const str = (v: unknown, max: number): string =>
    typeof v === 'string' ? v.trim().slice(0, max) : '';
  return {
    enabled: o.enabled === true,
    userId: Number.isInteger(userId) && userId > 0 ? userId : null,
    displayName: str(o.displayName, 120),
    headline: str(o.headline, 200),
    template: str(o.template, 40) || DEFAULT_PUBLIC_CV.template,
    market: o.market === 'INTERNATIONAL' ? 'INTERNATIONAL' : 'VN',
    // Mặc định BẬT: thiếu trường (cấu hình cũ, JSON gõ tay) phải nghiêng về phía
    // giấu PII, không phải phía để lộ.
    redactContact: o.redactContact !== false,
  };
}

export async function getConfig(): Promise<PublicCvConfig> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
    return row?.value ? sanitizeConfig(JSON.parse(row.value)) : { ...DEFAULT_PUBLIC_CV };
  } catch {
    // JSON hỏng hoặc DB lỗi → coi như chưa bật. Không bao giờ để trạng thái lỗi
    // biến thành trạng thái "đang mở".
    return { ...DEFAULT_PUBLIC_CV };
  }
}

export async function setConfig(raw: unknown): Promise<PublicCvConfig> {
  const cfg = sanitizeConfig(raw);
  const value = JSON.stringify(cfg);
  await prisma.appSetting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
  cache = null; // cấu hình đổi ⇒ file đã dựng không còn đúng
  return cfg;
}

/** Hồ sơ có đủ chất để đưa cho người lạ đọc chưa. Có tên + ít nhất một mục nội
 *  dung. Ngăn đúng cái tệ nhất: nút "Tải CV" dẫn tới một file trắng. */
function isServeable(p: { fullName: string | null; items: unknown[]; skills: unknown[] }): boolean {
  return Boolean(p.fullName?.trim()) && (p.items.length > 0 || p.skills.length > 0);
}

export interface PublicCvMeta {
  available: boolean;
  displayName: string;
  headline: string;
  formats: readonly PublicCvFormat[];
  /** Lần sửa hồ sơ gần nhất — để khách biết CV mới tới đâu. */
  updatedAt: string | null;
}

const UNAVAILABLE: PublicCvMeta = {
  available: false,
  displayName: '',
  headline: '',
  formats: [],
  updatedAt: null,
};

/** Metadata cho trang about quyết định HIỆN hay ẨN nút tải.
 *  Không bao giờ ném lỗi — trang about thiếu nút thì vẫn đọc được bình thường. */
export async function getPublicCvMeta(): Promise<PublicCvMeta> {
  try {
    const cfg = await getConfig();
    if (!cfg.enabled || !cfg.userId) return UNAVAILABLE;
    const profile = await findProfile(cfg.userId);
    if (!profile || !isServeable(profile)) return UNAVAILABLE;
    return {
      available: true,
      displayName: cfg.displayName || profile.fullName || '',
      headline: cfg.headline || profile.headline || '',
      formats: ALLOWED_FORMATS,
      updatedAt: profile.updatedAt.toISOString(),
    };
  } catch {
    return UNAVAILABLE;
  }
}

/**
 * Bản CV để XEM trên web (trang /cv/xem), khác với bản tải về.
 *
 * Đi qua ĐÚNG cùng một chỗ lược PII với đường tải file — `redactedProfile()`
 * bên dưới. Nếu tách hai đường thì sớm muộn một đường sẽ quên xoá số điện
 * thoại, và cái quên đó không ai thấy cho tới lúc đã lộ.
 */
export interface PublicCvView {
  cv: RenderCv;
  updatedAt: string;
  formats: readonly PublicCvFormat[];
}

/** Bản sao hồ sơ đã lược PII. MỘT chỗ duy nhất quyết định giấu gì. */
function redactedProfile<T extends { phone: string | null; location: string | null }>(
  profile: T,
  redact: boolean,
): T {
  return redact ? { ...profile, phone: null, location: null } : profile;
}

/**
 * Dữ liệu CV cho trang xem online, hoặc `null` khi chưa bật / hồ sơ chưa đủ.
 * Trả `RenderCv` — đúng cấu trúc mà bộ render PDF/DOCX dùng — nên trang web và
 * file tải về không bao giờ lệch nội dung.
 */
export async function getPublicCvView(): Promise<PublicCvView | null> {
  const cfg = await getConfig();
  if (!cfg.enabled || !cfg.userId) return null;

  const profile = await findProfile(cfg.userId);
  if (!profile || !isServeable(profile)) return null;

  const cv = toRenderCv(redactedProfile(profile, cfg.redactContact));
  // Ngày sinh chỉ có trong mẫu thị trường VN, và trang xem công khai thì không
  // có lý do gì phải khoe — đây là dữ liệu dùng để giả mạo danh tính.
  cv.dateOfBirth = null;
  return { cv, updatedAt: profile.updatedAt.toISOString(), formats: ALLOWED_FORMATS };
}

export interface PublicCvFile {
  buffer: Buffer;
  mime: string;
  filename: string;
}

// Dựng PDF là việc nặng: pdfkit render + nhúng font + đọc ngược lại bằng unpdf
// để kiểm round-trip. Endpoint này công khai nên một cái vòng lặp tải là đủ ghim
// CPU của VPS. Nhớ tạm theo (định dạng + thời điểm sửa hồ sơ): sửa CV là khoá
// đổi ⇒ bản mới ra ngay, không phải chờ hết hạn.
const cacheTtlMs = 15 * 60 * 1000;
let cache: { key: string; at: number; file: PublicCvFile } | null = null;

/**
 * Trả file CV công khai, hoặc `null` khi chưa bật / hồ sơ chưa đủ dữ liệu.
 * `null` để tầng route đổi thành 404 — không tiết lộ là có cấu hình hay không.
 */
export async function getPublicCvFile(format: PublicCvFormat): Promise<PublicCvFile | null> {
  const cfg = await getConfig();
  if (!cfg.enabled || !cfg.userId) return null;

  const profile = await findProfile(cfg.userId);
  if (!profile || !isServeable(profile)) return null;

  const key = `${format}:${cfg.template}:${cfg.market}:${cfg.redactContact}:${profile.updatedAt.getTime()}`;
  if (cache && cache.key === key && Date.now() - cache.at < cacheTtlMs) return cache.file;

  // Bản công khai là một BẢN SAO đã lược PII, không phải hồ sơ gốc. Xoá ở đây,
  // trước khi render, nên không định dạng nào (pdf/docx/txt) rò ra được. Dùng
  // chung hàm với trang xem online để hai đường không thể lệch nhau.
  const publicProfile = redactedProfile(profile, cfg.redactContact);

  const { buffer, mime, filename } = await exportCvData(cfg.userId, publicProfile, format as ExportFormat, {
    template: cfg.template,
    market: cfg.market,
    language: 'VI', // xem ghi chú đầu file — KHÔNG mở EN cho endpoint công khai
    photoUrl: profile.photoR2Key,
  });

  const file: PublicCvFile = { buffer, mime, filename };
  cache = { key, at: Date.now(), file };
  return file;
}
