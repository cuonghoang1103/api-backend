/**
 * Ghép phần SINH TỰ ĐỘNG theo FLM vào spec một môn Academy:
 *   1. "Mục 0 — Khung môn học chính thức theo syllabus FLM"  ← content/academy/_muc0-flm/<MÃ>.mjs
 *      (scripts/academy-muc0-flm.mjs sinh từ content/academy/_syllabus-flm/<MÃ>.json)
 *   2. KHOÁ FLM: chương ↔ buổi + slide đúng buổi + thi + tài liệu ← content/academy/_khoa-flm/<MÃ>.mjs
 *      (scripts/academy-khoa-flm.mjs); môn có Mục 0 làm tay chỉ có chương slide ← _slide-flm/ (academy-slide-flm.mjs)
 *
 * Hai phần này KHÔNG nằm trong file môn (content/academy/<MÃ>.mjs) vì:
 *   - 500+ file môn có cấu trúc khác nhau, chèn tay vào từng file dễ vỡ;
 *   - đây là dữ liệu máy sinh, sinh lại bất cứ lúc nào mà không đụng bài giảng viết tay.
 *
 * Mọi chỗ NẠP spec (seeder, bộ rà soát, bộ đối chiếu) phải đi qua hàm này,
 * không thì cái họ thấy khác cái lên production.
 *
 * Thứ tự: Mục 0 FLM → chương slide → các mục sẵn có của file môn. Có phần ghép ⇒ bật
 * course.syncOrder (để thứ tự trên CSDL theo đúng file; syncOrder chỉ đánh số lại, không xoá gì).
 * Mục cùng tiêu đề đã có trong file ⇒ không chèn hai lần.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const MUC0_FLM_TITLE = 'Section 0 — Official FLM syllabus (school framework)|||Mục 0 — Khung môn học chính thức theo syllabus FLM';

async function napNeuCo(f) {
  if (!fs.existsSync(f)) return [];
  const v = (await import(pathToFileURL(f).href)).default;
  return Array.isArray(v) ? v : [v];
}

export async function ganMuc0Flm(spec, specFile) {
  const ma = spec?.course?.courseCode;
  if (!ma || !specFile) return spec;
  const dir = path.dirname(path.resolve(specFile));
  const trongCourse = !spec.sections && Array.isArray(spec.course.sections);
  const secs = (trongCourse ? spec.course.sections : spec.sections) || [];
  const daCo = new Set(secs.map((s) => s.title));
  const muc0 = (await napNeuCo(path.join(dir, '_muc0-flm', `${ma}.mjs`))).filter((s) => !daCo.has(s.title));
  // KHOÁ FLM trọn (chương ↔ buổi, slide đặt đúng buổi, thi, tài liệu) — academy-khoa-flm.mjs — thắng
  // chương slide rời (academy-slide-flm.mjs, chỉ dùng cho môn có Mục 0 làm tay).
  const khoa = await napNeuCo(path.join(dir, '_khoa-flm', `${ma}.mjs`));
  const slide = (khoa.length ? khoa : await napNeuCo(path.join(dir, '_slide-flm', `${ma}.mjs`))).filter((s) => !daCo.has(s.title));
  if (!muc0.length && !slide.length) return spec;
  // Môn đã có Mục 0 / tài liệu / giới thiệu làm tay ở đầu ⇒ chương slide đứng SAU khối mở đầu đó, trước nội dung.
  let mo = 0;
  for (let i = 0; i < Math.min(secs.length, 4); i++) {
    if (/(Mục 0|Section 0|Tài liệu|Resource|Giới thiệu|Introduction|Course materials|Bắt đầu)/i.test(secs[i].title || '')) mo = i + 1;
  }
  const sections = [...muc0, ...secs.slice(0, mo), ...slide, ...secs.slice(mo)];
  const course = { ...spec.course, syncOrder: true };
  if (trongCourse) return { ...spec, course: { ...course, sections } };
  return { ...spec, course, sections };
}
