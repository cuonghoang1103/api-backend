/**
 * CT Work UX-D (09/10/2026) — ẢNH BÌA dự án: danh mục id + mẫu → bìa mặc định + kiểm giá trị.
 *
 * Giá trị lưu ở `work_projects.cover_url`:
 *   - `preset:<id>`   ảnh trong thư viện có sẵn (frontend/public/images/work-covers/<id>.svg — SVG tự vẽ,
 *                     sinh bằng frontend/scripts/work-covers/gen-work-covers.mjs);
 *   - `https://…`     ảnh người dùng tải lên (đã nén lại thành JPEG bằng sharp — projectCover.service.ts);
 *   - NULL            không có bìa ⇒ giao diện tô dải màu của dự án.
 * Danh sách id PHẢI khớp frontend/src/lib/work-covers.json — covers.test.ts đối chiếu cả tệp SVG.
 */

export const COVER_PRESETS = [
  'gradient-indigo', 'gradient-sunset', 'gradient-ocean', 'gradient-forest', 'gradient-mono', 'gradient-dawn',
  'geo-triangles', 'geo-hexagons', 'geo-blocks', 'abstract-waves', 'abstract-orbs',
  'theme-code', 'theme-testing', 'theme-data', 'theme-ai', 'theme-design', 'theme-game', 'theme-study', 'theme-mobile', 'theme-devops',
  'cute-clouds', 'cute-cat', 'cute-rocket', 'cute-plants', 'cute-stars',
  'school-swt301', 'school-swr302', 'school-swp391', 'school-capstone',
] as const;
export type CoverPreset = (typeof COVER_PRESETS)[number];

const PRESET_SET = new Set<string>(COVER_PRESETS);
export const isCoverPreset = (id: string): id is CoverPreset => PRESET_SET.has(id);

/** Mẫu dự án ⇒ bìa hợp chủ đề (người dùng đổi được ở Project settings → Details). */
const TEMPLATE_COVER: Record<string, CoverPreset> = {
  SWT301: 'school-swt301',
  SWR302: 'school-swr302',
  SWP391: 'school-swp391',
  CAPSTONE: 'school-capstone',
  FREELANCE: 'gradient-ocean',
  COMPANY: 'gradient-indigo',
};
const KIND_COVER: Record<string, CoverPreset> = { SCHOOL: 'theme-study', CLIENT: 'gradient-ocean', SOFTWARE: 'theme-code', PERSONAL: 'abstract-waves' };

export function defaultCoverFor(template: string, kind?: string | null): string {
  return `preset:${TEMPLATE_COVER[template] ?? (kind ? KIND_COVER[kind] : undefined) ?? 'gradient-indigo'}`;
}

/** `preset:<id>` hợp lệ ⇒ id; còn lại ⇒ null. */
export function presetIdOf(value: string | null | undefined): CoverPreset | null {
  if (!value?.startsWith('preset:')) return null;
  const id = value.slice(7);
  return isCoverPreset(id) ? id : null;
}

/** Điểm lấy nét dọc: số nguyên 0–100; thiếu/sai ⇒ 50 (giữa). */
export function clampCoverY(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : 50;
}
