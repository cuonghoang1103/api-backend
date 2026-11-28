/**
 * Roadmap sơ đồ đầu khoá (28/11/2026) — dữ liệu mô tả từng bài cho ngăn chi tiết của sơ đồ.
 *
 * Nguồn: `content/roadmap-khoa/<slugKhoa>.json` (sinh bằng scripts/roadmap-khoa/*: Antigravity soạn từ bài web gốc,
 * Claude soát mẫu). Ảnh backend đã COPY `content/` (Dockerfile.backend) ⇒ đọc thẳng từ đĩa, không cần bảng mới.
 * KHÔNG chứa nội dung bài (chỉ 4 câu ngắn mỗi bài) ⇒ phục vụ công khai được — trang giới thiệu khoá cũng dùng.
 *
 * Dạng tệp:
 *   { khoa, ten, phienBan, capNhat, nguon,
 *     chuong: { <slug bài đầu chương>: { hoc, lamDuoc } },
 *     bai:    { <slug bài>: { hoc, canBiet, lamDuoc, ketHop, canBietBai?, ketHopBai?, ketHopKhoa? } },
 *     khoaTen: { <slug khoá>: <tên> } }
 * Web + app dùng lại qua `GET /api/v1/courses/:slug/roadmap`.
 */
import fs from 'fs';
import path from 'path';

export interface MoTaBaiRoadmap {
  hoc: string; canBiet: string; lamDuoc: string; ketHop: string;
  canBietBai?: string[]; ketHopBai?: string[]; ketHopKhoa?: string[];
}
export interface RoadmapKhoaMeta {
  khoa: string; ten?: string; phienBan?: number; capNhat?: string; nguon?: string;
  chuong: Record<string, { hoc: string; lamDuoc: string }>;
  bai: Record<string, MoTaBaiRoadmap>;
  khoaTen?: Record<string, string>;
}

const THU_MUC = () => path.resolve(process.env.ROADMAP_KHOA_DIR || 'content/roadmap-khoa');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const boNho = new Map<string, { mtimeMs: number; data: RoadmapKhoaMeta }>();

/** Đọc mô tả roadmap của một khoá. Không có tệp / slug lạ / JSON hỏng ⇒ null (web tự lùi về mô tả bài). */
export function docRoadmapKhoa(slug: string): RoadmapKhoaMeta | null {
  if (!SLUG.test(slug) || slug.length > 120) return null;
  const tep = path.join(THU_MUC(), `${slug}.json`);
  let st: fs.Stats;
  try { st = fs.statSync(tep); } catch { return null; }
  const cu = boNho.get(slug);
  if (cu && cu.mtimeMs === st.mtimeMs) return cu.data;
  try {
    const data = JSON.parse(fs.readFileSync(tep, 'utf8')) as RoadmapKhoaMeta;
    if (!data || typeof data !== 'object' || typeof data.bai !== 'object') return null;
    boNho.set(slug, { mtimeMs: st.mtimeMs, data });
    return data;
  } catch {
    return null;
  }
}

/** Danh sách khoá đã có tệp roadmap (cho trang quản trị / app). */
export function dsKhoaCoRoadmap(): string[] {
  try {
    return fs.readdirSync(THU_MUC()).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')).sort();
  } catch {
    return [];
  }
}
