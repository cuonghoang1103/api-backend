/**
 * CV Builder — kiểu dữ liệu và lời gọi API.
 *
 * Hình dạng đối chiếu với:
 *   • `prisma/schema.prisma` → model `CvProfile` (dòng 6445)
 *   • `src/services/cv/profile.service.ts` → `updateProfileSchema` (dòng 62)
 *   • `src/routes/cvBuilder.routes.ts`, mount `/api/v1/cv` (src/index.ts:582)
 * Đối chiếu ngày 16/08/2026.
 *
 * Chỉ khai báo những trường mà `updateProfileSchema` THẬT SỰ nhận. Gửi thừa một
 * trường thì zod phía máy chủ đá cả request, và lỗi trả về ("Unrecognized key")
 * chẳng gợi ý gì cho người dùng.
 */
import type { ApiClient } from '../../api/client';

/** Khớp `CvExperienceLevel` trong schema. */
export type Seniority = string;

export interface CvLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
}

/** Trả về từ `GET /api/v1/cv/profile`. */
export interface CvProfile {
  id: number;
  userId: number;
  fullName: string | null;
  headline: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  links: CvLinks;
  summary: string | null;
  targetRoles: string[];
  seniority: Seniority | null;
  locationsPref: string[];
  remotePref: string | null;
  updatedAt: string;
}

/**
 * Phần hồ sơ mà màn hình này sửa được.
 *
 * CỐ Ý hẹp hơn `updateProfileSchema`. Ảnh đại diện đi qua multipart
 * (`POST /profile/photo`) nên không xếp hàng offline được; ngày sinh chỉ dùng
 * cho mẫu CV Việt Nam và cần bộ chọn ngày riêng. Cả hai để lần sau — khai báo
 * rồi không làm sẽ thành trường ma trong payload.
 */
export interface CvProfileDraft {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  links: CvLinks;
}

export const EMPTY_DRAFT: CvProfileDraft = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  links: {},
};

/** `null` từ máy chủ → chuỗi rỗng cho ô nhập. Ô nhập không nhận `null`. */
export function toDraft(profile: CvProfile): CvProfileDraft {
  return {
    fullName: profile.fullName ?? '',
    headline: profile.headline ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    summary: profile.summary ?? '',
    links: profile.links ?? {},
  };
}

/**
 * Bỏ các link rỗng trước khi gửi.
 *
 * `links` là `z.record(z.string())` nên chuỗi rỗng vẫn hợp lệ về kiểu — nhưng
 * lưu `{ github: "" }` sẽ khiến mẫu CV in ra một dòng GitHub trống.
 */
export function toPayload(draft: CvProfileDraft): Record<string, unknown> {
  const links: CvLinks = {};
  for (const [key, value] of Object.entries(draft.links)) {
    if (typeof value === 'string' && value.trim() !== '') {
      links[key as keyof CvLinks] = value.trim();
    }
  }

  return {
    fullName: draft.fullName.trim(),
    headline: draft.headline.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    location: draft.location.trim(),
    summary: draft.summary.trim(),
    links,
  };
}

export function fetchProfile(api: ApiClient): Promise<CvProfile> {
  return api.request<CvProfile>('/api/v1/cv/profile');
}

/** Khoá cache. Có `userId` để hai tài khoản trên cùng máy không đọc nhầm nhau. */
export function profileCacheKey(): string {
  return 'cv:profile';
}
