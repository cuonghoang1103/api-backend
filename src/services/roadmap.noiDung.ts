/**
 * Nội dung "tự đủ" cho từng bước lộ trình (12/11/2026).
 *
 * Trước đây một bước chỉ có 1–2 câu mô tả + link ra ngoài (roadmap.sh, MDN…), người học phải rời web mới học
 * được. Nay mỗi bước có thêm:
 *   body    — bài đọc tiếng Việt (Markdown) đủ để HIỂU bước đó ngay trên trang lộ trình;
 *   lessons — bài học / slide / mô phỏng / Code Lab NGAY TRÊN cuongthai.com dạy đúng bước đó (bấm là mở thẳng);
 *   more    — tài liệu ngoài bổ sung (cộng thêm, không thay link cũ — link ngoài cũ giữ nguyên để đọc thêm).
 *
 * Nguồn: content/roadmap/<slug>.json = { "<chặng> › <tiêu đề bước>": NoiDungBuoc }. Sinh bằng
 * scripts/roadmap-*.{mts,py} + agent soạn, rồi kiểm bằng `kiemNoiDung` (link nội bộ phải trỏ đúng tuyến có thật).
 * Seeder (`seedRoadmaps`) đọc file này mỗi lần chạy, nên sửa nội dung = sửa JSON rồi deploy.
 */
import fs from 'node:fs';
import path from 'node:path';

export type KieuBai = 'slide' | 'video' | 'bai-doc' | 'quiz' | 'lab' | 'mo-phong' | 'code-lab' | 'trang';

/** Một chỗ học ngay trên web. `href` luôn là đường dẫn NỘI BỘ (bắt đầu bằng "/"). */
export interface BaiHocLienKet {
  href: string;
  ten: string;
  /** Tên khoá / nguồn hiển thị phụ ("Khoá React · Chương 2", "Xưởng mô phỏng"…). */
  nguon?: string;
  kieu: KieuBai;
  /** Môn trường (Academy) hay khoá Courses — để hiện nhãn. */
  academy?: boolean;
  /** Mã môn trường nếu có (FER202…). */
  ma?: string;
}

export interface TaiLieuThem { type: 'article' | 'video' | 'course' | 'official' | 'feed'; title: string; url: string; premium?: boolean }

export interface NoiDungBuoc {
  body?: string;
  lessons?: BaiHocLienKet[];
  more?: TaiLieuThem[];
}

export const khoaBuoc = (chang: string, tieuDe: string) => `${chang.trim()} › ${tieuDe.trim()}`;

const THU_MUC = () => path.resolve(process.env.ROADMAP_CONTENT_DIR || 'content/roadmap');

const boNho = new Map<string, Record<string, NoiDungBuoc>>();

/** Đọc nội dung của một lộ trình. Không có file ⇒ {} (lộ trình vẫn seed như cũ). */
export function docNoiDung(slug: string): Record<string, NoiDungBuoc> {
  if (boNho.has(slug)) return boNho.get(slug)!;
  const f = path.join(THU_MUC(), `${slug}.json`);
  let d: Record<string, NoiDungBuoc> = {};
  if (fs.existsSync(f)) d = JSON.parse(fs.readFileSync(f, 'utf8'));
  boNho.set(slug, d);
  return d;
}

const TUYEN_NOI_BO = /^\/(courses|simulation|code-lab|algorithms|cpu-lab|net-lab|os-lab|roadmap|interview|exp-hub|toc-do-mang|exam)(\/|\?|$)/;

/** Lỗi cấu trúc của một mục nội dung (rỗng = hợp lệ). Không kiểm tồn tại bài — việc đó làm ở script với chỉ mục bài. */
export function kiemNoiDung(nd: NoiDungBuoc): string[] {
  const loi: string[] = [];
  if (nd.body !== undefined && typeof nd.body !== 'string') loi.push('body không phải chuỗi');
  for (const l of nd.lessons ?? []) {
    if (!l || typeof l.href !== 'string' || !TUYEN_NOI_BO.test(l.href)) loi.push(`href nội bộ sai: ${l?.href}`);
    if (!l?.ten) loi.push(`thiếu tên bài: ${l?.href}`);
  }
  for (const r of nd.more ?? []) {
    if (!/^https?:\/\//.test(r?.url || '')) loi.push(`link thêm sai: ${r?.url}`);
  }
  return loi;
}
