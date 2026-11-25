/**
 * agile-teamwork/_chung.mjs — tiện ích chung cho các chương soạn chi tiết của khoá "Làm việc nhóm phần mềm" (agl-*), 24/11/2026.
 * Dùng lại bộ tô màu + khối output + khối lời giải của khoá Spring Boot. KHÔNG backtick trần trong nội dung.
 */
export { esc, bash, js, out, giai, tl } from '../spring-boot/_chung.mjs';
import { esc } from '../spring-boot/_chung.mjs';

/** Liên kết bài khoá khác trên /courses (mở đúng bài). */
export const cs = (course, slug, text) => `<a href="/courses/${course}/learn?lessonSlug=${slug}">${text}</a>`;
/** Liên kết bài Academy (mở đúng bài). */
export const ac = (course, slug, text) => `<a href="/academy/courses/${course}/learn?lessonSlug=${slug}">${text}</a>`;
/** Liên kết bài trong chính khoá này. */
export const ag = (slug, text) => cs('agile-teamwork', slug, text);
/** Nguồn ngoài. */
export const ng = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

/**
 * Tệp mẫu .xlsx (scratchpad/agl/web/mau/*.xlsx) — CHƯA tải lên R2. Điều phối tải lên media.cuongthai.com/files/agile-teamwork/
 * rồi đặt CO_TEP_MAU = true; khi false, bài chỉ hiện bảng + khối TSV chép dán (vẫn dùng được, không có liên kết hỏng).
 */
export const CO_TEP_MAU = false;
export const URL_MAU = 'https://media.cuongthai.com/files/agile-teamwork/';
export const taiMau = (ten, en) => (CO_TEP_MAU
  ? `<p>📥 <a href="${URL_MAU}${ten}" download>${ten}</a> ${en ? '(Excel, opens in LibreOffice/Google Sheets too)' : '(Excel, mở được bằng LibreOffice/Google Sheets)'}</p>`
  : '');

/** Câu quiz. */
export const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });

/** Bảng đơn giản: cot = [tiêu đề…], hang = [[ô…]…]. Ô viết sẵn HTML. */
export const bang = (cot, hang) => `<div class="table-wrap"><table>
<thead><tr>${cot.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
<tbody>
${hang.map((h) => `<tr>${h.map((o) => `<td>${o}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table></div>`;

/** Khối "phỏng vấn viên sẽ hỏi": [[câu hỏi, gợi ý trả lời]…]. */
export const phongVan = (ds, en) => `
<h3>🎤 ${en ? 'What an interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
${ds.map(([h, d]) => `<li><strong>${h}</strong>\n<details><summary>${en ? 'A strong answer' : 'Gợi ý trả lời tốt'}</summary><p>${d}</p></details></li>`).join('\n')}
</ol>`;

/** Bảng thuật ngữ: [[thuật ngữ, nghĩa]…]. */
export const thuatNgu = (ds, en) => `
<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ'}</h3>
${bang([en ? 'Term' : 'Thuật ngữ', en ? 'Meaning' : 'Nghĩa'], ds.map(([a, b]) => [`<strong>${a}</strong>`, b]))}`;

/** Tóm tắt cuối bài. */
export const tomTat = (ds, en) => `
<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
${ds.map((x) => `<li>${x}</li>`).join('\n')}
</ul>`;

/** Hộp ghi chú. */
export const note = (html) => `<p class="note-ct">${html}</p>`;

/** Vỏ bài: hai khối ml-en / ml-vi từ một hàm L(en). */
export const haiNgu = (L) => L(true) + L(false);
export const vo = (en, eyebrowEn, eyebrowVi, body) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? eyebrowEn : eyebrowVi}</span>
${body}
</div>
`;
export { esc as e };
/** Hộp nhấn: kieu = 'ok' | 'warn' | 'danger' | 'info' | 'tip'. */
export const cl = (kieu, html) => `<div class="callout ${kieu}">${html}</div>`;
