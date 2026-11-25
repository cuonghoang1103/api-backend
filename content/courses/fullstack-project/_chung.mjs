/**
 * _chung.mjs — tiện ích cho khoá fullstack-project (soạn 24/11/2026, agent fsp).
 * Cùng markup với debug-co-phuong-phap/_chung.mjs (nguon / lienKet) để giao diện giống nhau, thêm:
 *   - spring(): hộp "Nếu làm bằng Spring Boot" trỏ ĐÚNG bài của khoá spring-boot (liên kết chéo, không viết lại);
 *   - esc(): thoát HTML cho output/mã chép nguyên văn;
 *   - ghep(): ghép bài đã soạn vào chương khung, CHO PHÉP thêm bài mới (vd fp-N-5-quiz) — giữ slug bài khung.
 */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

export function lienKet({ khoa, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/**
 * Hộp "Nếu làm bằng Spring Boot". bai = [[slug, nhãn], …] của khoá spring-boot; y = câu so sánh ngắn (đã thoát HTML nếu cần).
 * en=true ⇒ nhãn tiếng Anh.
 */
export function spring(en, y, bai) {
  const tieuDe = en ? 'If you build it with Spring Boot' : 'Nếu làm bằng Spring Boot';
  const mo = en ? 'Open' : 'Mở bài';
  const the = bai.map(([slug, nhan]) =>
    `<li><a href="/courses/spring-boot/learn?lessonSlug=${slug}" target="_blank" rel="noopener">${nhan}</a> — <em>${mo} →</em></li>`).join('');
  return `<div class="callout info"><p><strong>☕ ${tieuDe}.</strong> ${y}</p><ul>${the}</ul></div>`;
}

/** Ghép bài đã soạn (cùng slug) vào chương khung. Nếu bài soạn phủ HẾT bài khung ⇒ dùng đúng thứ tự bài soạn (có thể thêm bài mới).
 *  Nếu chưa phủ hết ⇒ thay bài cùng slug, bài soạn mới (không có trong khung) nối cuối. */
export const ghep = (sec, soan) => {
  const khungSlug = new Set(sec.lessons.map((l) => l.slug));
  const soanSlug = new Set(soan.map((l) => l.slug));
  if ([...khungSlug].every((s) => soanSlug.has(s))) return { ...sec, lessons: soan };
  const m = new Map(soan.map((l) => [l.slug, l]));
  const them = soan.filter((l) => !khungSlug.has(l.slug));
  return { ...sec, lessons: [...sec.lessons.map((l) => m.get(l.slug) ?? l), ...them] };
};
