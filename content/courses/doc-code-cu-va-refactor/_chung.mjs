/**
 * doc-code-cu-va-refactor/_chung.mjs — tiện ích chung của khoá "Đọc code cũ và refactor" (soạn 22/11/2026).
 *
 * Tô màu mã dùng lại bộ của khoá Spring Boot (cùng lớp CSS tok-*): java/xml/sql/bash/props/yml/out/tl/giai.
 * Viết bài song ngữ bằng MỘT hàm nhận cờ `en` rồi bọc: ml((en) => `…${en ? 'EN' : 'VI'}…`)
 *   ⇒ <div class="ml-en">…</div><div class="ml-vi">…</div> — mã và output dùng chung, chỉ lời giảng tách đôi.
 *
 * Repo lab: ./lab/legacy-thu-vien (nguồn) + ./lab/_tao-lich-su.py (dựng lịch sử git 13 commit 2016–2019).
 * Gói cho người học: python3 lab/_tao-lich-su.py lab/legacy-thu-vien /tmp/x/legacy-thu-vien && (cd /tmp/x && zip -qr legacy-thu-vien.zip legacy-thu-vien)
 * rồi đẩy lên R2 đúng đường ZIP_LAB bên dưới.
 *
 * ⚠️ Trong template literal: `${` của EL/JSP/shell viết \${ ; không backtick trần (dùng &#96;); gạch chéo ngược viết \\.
 */
export { java, xml, sql, bash, props, yml, out, tl, giai, esc } from '../spring-boot/_chung.mjs';

export const ZIP_LAB = 'https://media.cuongthai.com/files/courses/doc-code-cu-va-refactor/legacy-thu-vien-v1.zip';

/** Môi trường đã chạy thật mọi output trong khoá (ghi ở đầu mỗi bài có output). */
export const MOI_TRUONG = 'Mac M1 (arm64) · Zulu JDK 8.0.514 · OpenJDK 21.0.9 · Maven 3.9.11 · Tomcat 9.0.124 / 10.1.62 · MySQL 8.0.46 · Docker Desktop (Engine 29) · Node 26.8.1';

/** Bọc một hàm (en) => html thành hai khối ngôn ngữ. */
export const ml = (f) => `\n<div class="ml-en">\n${f(true)}\n</div>\n<div class="ml-vi">\n${f(false)}\n</div>\n`;

/** Thẻ liên kết sang bài/khoá khác trên trang (không mở tab mới). */
export const lk = (href, ico, title, sub) => `<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
</a>`;

/** Đường dẫn tới một bài của khoá khác. */
export const bai = (khoa, slug) => `/courses/${khoa}/learn?lessonSlug=${slug}`;

/** Bảng thuật ngữ: [[gốc, nghĩa Việt, giải thích VI, giải thích EN], …] */
export const thuatNgu = (en, rows) => `<div class="kv-grid">${rows.map(([goc, viet, vi, eng]) =>
  `<div class="kv"><div class="k">${en ? goc : `${goc} (${viet})`}</div><div class="v">${en ? eng : vi}</div></div>`).join('')}</div>`;

/** Câu hỏi quiz. */
export const Q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });
