/**
 * du-an-mot-minh-5-vai/_chung.mjs — tiện ích chung của khoá "Đồ án một mình đóng 5 vai" (dm5-*), 26/11/2026.
 * Dùng lại bộ helper của khoá agile-teamwork (tô màu, bảng, quiz, hộp ghi chú, khung hai ngôn ngữ). KHÔNG backtick trần trong nội dung.
 */
export * from '../agile-teamwork/_chung.mjs';
import { cs } from '../agile-teamwork/_chung.mjs';

/** Liên kết bài trong chính khoá này. */
export const dm = (slug, text) => cs('du-an-mot-minh-5-vai', slug, text);
/** Liên kết trang dự án LabFlow AI (mục theo tiêu đề h2 của trang, vd 'Use case và phân quyền màn hình'). */
export const lf = (text) => `<a href="/projects/labflow-ai">${text}</a>`;
/** Nhãn vai (C1–C5) — tô màu thống nhất cả khoá. */
const MAU = { C1: '#7C3AED', C2: '#0EA5E9', C3: '#16A34A', C4: '#F59E0B', C5: '#DC2626' };
const TEN = { C1: ['Leader/PM', 'Leader/PM'], C2: ['BA', 'BA'], C3: ['Dev BE', 'Dev BE'], C4: ['Dev FE', 'Dev FE'], C5: ['QA/Tester', 'QA/Tester'] };
export const mu = (c, en) => `<span style="display:inline-block;padding:1px 8px;border-radius:10px;background:${MAU[c]};color:#fff;font-weight:600;font-size:.85em">🎩 ${c} · ${TEN[c][en ? 0 : 1]}</span>`;
/** Khối "Việc của bạn trên LabFlow": viec = [[việc, đạt khi]…]. */
export const viecLabflow = (viec, en) => `
<div class="callout tip"><h3>🛠 ${en ? 'Your task on LabFlow' : 'Việc của bạn trên LabFlow'}</h3>
<ol>
${viec.map(([v, d]) => `<li>${v}<br><em>${en ? 'Done when' : 'Đạt khi'}:</em> ${d}</li>`).join('\n')}
</ol></div>`;
/**
 * Khối "🔁 Áp sang đề tài khác / đi làm": quy trình trong bài KHÔNG gắn với LabFlow. ds = [[bối cảnh, cách áp]…],
 * vd ['Sàn thương mại điện tử (đổi đề tài)', '…'], ['Đồ án SEP490 nhóm 5 người', '…'], ['Công ty lớn (FPT Software, dự án 50 người)', '…'].
 */
export const apDung = (ds, en) => `
<div class="callout info"><h3>🔁 ${en ? 'Reuse it on another project or at work' : 'Áp sang đề tài khác và khi đi làm'}</h3>
<ul>
${ds.map(([a, b]) => `<li><strong>${a}:</strong> ${b}</li>`).join('\n')}
</ul></div>`;
