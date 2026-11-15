/**
 * _pv.mjs — khối HTML dùng chung cho khoá "IT Interview Prep" (/courses/interview-prep), soạn 15/11/2026.
 * Khoá CHỮ (không slide ảnh) theo khuôn khoá Redis; mọi khối sinh ra đều qua bộ kiểm
 * scripts/course-content-check.mjs (cân thẻ) + scripts/course-depth-audit.mjs (lz-flow, pitfall, link-card).
 *
 * Mỗi hàm nhận `L` = 'en' | 'vi' để in nhãn đúng ngôn ngữ (gọi hai lần: một trong khối .ml-en, một trong .ml-vi).
 * Chuỗi đưa vào là HTML (tự viết &amp; &lt; &gt;), trừ ma()/ra() tự thoát.
 */
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Khối mã (tự thoát < > &). */
export const ma = (lang, src) => `<pre><code class="language-${lang}">${escHtml(src.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`;
/** Khối kết quả / văn bản mẫu đơn cách. */
export const ra = (text) => `<div class="out">${escHtml(text.replace(/^\n/, '').replace(/\n$/, ''))}</div>`;

/** Thẻ liên kết chéo tới bài khác trên trang. academy:true ⇒ /academy/courses/<khoa>. */
export function lienKet({ khoa, bai, title, sub, academy = false, L = 'vi' }) {
  const href = `/${academy ? 'academy/courses' : 'courses'}/${khoa}/learn?lessonSlug=${bai}`;
  return `<a class="link-card lien-ket-cheo" href="${href}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">${academy ? '🎓' : '🔗'}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${L === 'en' ? 'OPEN LESSON →' : 'MỞ BÀI →'}</span>\n</a>`;
}

/** Thẻ nguồn ngoài (URL đã GET thật → 200). */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

/** Thẻ video YouTube ngoài (id đã qua yt-check + playabilityStatus OK + có phụ đề EN). */
export const yt = (id, kenh, tieuDe, phut, L = 'vi') => nguon('🎬', `YouTube · ${tieuDe}`,
  L === 'en' ? `${kenh} · ${phut} min · English captions — watch after reading, as a second explanation` : `${kenh} · ${phut} phút · có phụ đề tiếng Anh — xem sau khi đọc bài, như một cách giảng thứ hai`,
  `https://www.youtube.com/watch?v=${id}`);

/** Sơ đồ bước: rows = [[nhãn, tiêu đề, mô tả], …]. */
export const flow = (rows) => `<div class="lz-flow">\n${rows.map(([k, t, d]) => `  <div class="lz-step"><span class="lz-k">${k}</span><span class="lz-t">${t}</span><span class="lz-d">${d}</span></div>`).join('\n')}\n</div>`;

/** Chồng tầng: rows = [[tên, ghi chú], …] (trên → dưới). */
export const stack = (rows) => `<div class="lz-stack">\n${rows.map(([n, d]) => `<div class="lz-layer"><span class="lz-lname">${n}</span><span class="lz-lnote">${d}</span></div>`).join('\n')}\n</div>`;

/** Lưới khoá–giá trị: rows = [[khoá, giải thích], …]. */
export const kv = (rows) => `<div class="kv-grid">\n${rows.map(([k, v]) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('\n')}\n</div>`;

/** Bảng có khung cuộn riêng (điện thoại/iPad không vỡ). head = [...], rows = [[...], …]. */
export const bang = (head, rows) => `<div class="table-scroll"><table>\n<thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>\n<tbody>\n${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}\n</tbody>\n</table></div>`;

/** Bẫy (pitfall có tiêu đề). */
export const bay = (L, tieuDe, than) => `<div class="pitfall co-tieu-de"><p><strong>${L === 'en' ? 'Trap' : 'Bẫy'} — ${tieuDe}</strong> ${than}</p></div>`;

/** Góc kẻ xấu: lừa đảo / tấn công nhắm vào người tìm việc + cách phòng. */
export const keXau = (L, than) => `<div class="callout danger"><p><strong>${L === 'en' ? '🕵️ The bad-actor angle:' : '🕵️ Góc kẻ xấu:'}</strong> ${than}</p></div>`;

/** Liên tưởng đời thường. */
export const doiThuong = (L, than) => `<div class="callout ok"><p><strong>${L === 'en' ? '🏠 Everyday picture:' : '🏠 Liên tưởng đời thường:'}</strong> ${than}</p></div>`;

/** Tình huống giả định "nếu… thì sao". */
export const neu = (L, than) => `<div class="callout warn"><p><strong>${L === 'en' ? '🤔 What if…' : '🤔 Nếu… thì sao?'}</strong> ${than}</p></div>`;

/**
 * Một câu hỏi phỏng vấn: câu hỏi · câu trả lời mẫu (ẩn trong <details> — tự trả lời trước rồi mới mở) ·
 * câu hỏi đào sâu tiếp · lỗi trả lời hay gặp.
 *   qa(L, { so: '4.2-3', q: '…', a: '<p>…</p>', sau: ['…'], loi: '…', chu: 'ghi chú người phỏng vấn đang chấm gì' })
 */
export function qa(L, { so, q, a, sau = [], loi = '', chu = '' }) {
  const en = L === 'en';
  return `<div class="callout">\n<p><strong>❓ ${so ? so + ' · ' : ''}${q}</strong></p>\n` +
    (chu ? `<p><em>${en ? 'What they are really checking:' : 'Người phỏng vấn thật ra đang chấm:'}</em> ${chu}</p>\n` : '') +
    `<details><summary>${en ? '💬 Sample answer — say yours out loud first, then open' : '💬 Câu trả lời mẫu — tự nói câu của bạn thành tiếng trước, rồi mới mở'}</summary>\n${a}\n</details>\n` +
    (sau.length ? `<p><strong>${en ? '↪ Likely follow-ups:' : '↪ Câu đào sâu hay gặp tiếp theo:'}</strong></p>\n<ul>${sau.map((x) => `<li>${x}</li>`).join('')}</ul>\n` : '') +
    (loi ? `<p><strong>${en ? '✗ Common weak answer:' : '✗ Lỗi trả lời hay gặp:'}</strong> ${loi}</p>\n` : '') +
    `</div>`;
}

/** 🧪 Thực hành: steps = ['…', …], dat = tiêu chí kiểm được. extra = HTML chèn sau danh sách (mẫu, bảng). */
export function thucHanh(L, { phut = '20–30', steps, dat, extra = '' }) {
  const en = L === 'en';
  return `<h3>🧪 ${en ? `Practice (${phut} min)` : `Thực hành (${phut} phút)`}</h3>\n<div class="callout ok"><ol>\n${steps.map((s) => `<li>${s}</li>`).join('\n')}\n</ol>\n${extra}` +
    `<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${dat}</p></div>`;
}

/** 🗂 Thuật ngữ. */
export const thuatNgu = (L, rows) => `<h3>🗂 ${L === 'en' ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>\n${kv(rows)}`;

/** 📌 Tóm tắt. */
export const tomTat = (L, items) => `<h3>📌 ${L === 'en' ? 'Summary' : 'Tóm tắt'}</h3>\n<ul>\n${items.map((x) => `<li>${x}</li>`).join('\n')}\n</ul>`;

/** 🔗 Phần liên kết cuối bài. */
export const lienQuan = (L, cards) => `<h3>🔗 ${L === 'en' ? 'Connected lessons and sources' : 'Bài liên quan và nguồn đọc thêm'}</h3>\n${cards.join('\n')}`;

/** Bảng tự chấm: rows = [[tiêu chí, 0 điểm, 1 điểm, 2 điểm], …]. */
export const rubric = (L, rows) => bang(
  L === 'en' ? ['Criterion', '0 — missing', '1 — partly', '2 — solid'] : ['Tiêu chí', '0 — chưa có', '1 — một phần', '2 — chắc chắn'],
  rows,
);

/** Câu quiz: cùng khuôn bộ kiểm (question EN|||VI, options EN|||VI, explanation 'EN: …|||VI: …'). */
export const cau = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });
