/**
 * _chung.mjs — tiện ích nhỏ cho khoá nestjs (thẻ nguồn ngoài, thẻ liên kết chéo sang khoá khác).
 * Cùng markup với web-foundations/_slides.mjs (nguon / lienKet) để giao diện giống nhau.
 */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

export function lienKet({ khoa, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Ghép bài đã soạn (cùng slug) vào chương khung; bài chưa soạn giữ khung. */
export const ghep = (sec, soan) => {
  const m = new Map(soan.map((l) => [l.slug, l]));
  for (const l of soan) if (!sec.lessons.some((x) => x.slug === l.slug)) throw new Error(`nestjs: bài soạn ${l.slug} không có trong khung`);
  return { ...sec, lessons: sec.lessons.map((l) => m.get(l.slug) ?? l) };
};

/** Thẻ liên kết chéo sang một bài Academy (deep link đúng bài). */
export function lienKetAcademy({ mon, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/academy/courses/${mon}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🎓</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}
