/**
 * _chung.mjs — thư viện dựng bài cho khoá "Coding Interview Prep" (/courses/dsa-interview), 15/11/2026.
 *
 * NGUYÊN TẮC: mọi đoạn mã và output trong bài ĐỌC TỪ TỆP THẬT trong ./ma/ — không chép tay vào bài.
 *   ma/chNN/<ten>.ts        lời giải TypeScript (chạy bằng tsx)         ⇒ output: <ten>.ts.out
 *   ma/chNN/<Ten>.java      lời giải Java (javac --release 17 + java)    ⇒ output: <Ten>.java.out
 *   ma/chNN/<ten>.sim.js    chương trình mô phỏng cho trang /algorithms  ⇒ link ?code=<base64>
 *   ma/chNN/<ten>.vet.mjs   hàm dựng BẢNG VẾT (chạy thuật toán thật, ghi trạng thái từng vòng)
 * `node content/courses/dsa-interview/_chay.mjs` chạy lại tất cả và ghi .out; `--kiem` so với .out đang có.
 * Mã nằm ngoài template literal nên KHÔNG phải thoát backtick, ${ hay gạch chéo ngược.
 *
 * Bài viết dạng XEN KẼ: khối ngôn ngữ (.ml-en / .ml-vi) cho lời giảng, còn mã, output, bảng vết đặt GIỮA hai cặp
 * khối (ngoài khối ngôn ngữ) ⇒ hiện ở cả hai ngôn ngữ, không nhân đôi. Mẫu: walkObj của khoá object-storage.
 */
import fs from 'node:fs';

const GOC = new URL('./ma/', import.meta.url);
export const KHOA = 'dsa-interview';
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Đọc một tệp trong ./ma/ (đường dẫn tương đối, vd 'ch01/two-sum.ts'). */
export function doc(rel) {
  return fs.readFileSync(new URL(rel, GOC), 'utf8');
}

/** Cắt một vùng `// #region ten` … `// #endregion` (không có ten ⇒ cả tệp, bỏ mọi dòng đánh dấu vùng). */
function trich(src, vung, rel) {
  const lines = src.replace(/\r/g, '').split('\n');
  const laDanhDau = (l) => /^\s*\/\/\s*#(end)?region\b/.test(l) || /^\s*\/\/\s*@(java|ts|thoi-gian|bo-qua)\b/.test(l);
  if (!vung) return lines.filter((l) => !laDanhDau(l)).join('\n').replace(/\n+$/, '');
  const a = lines.findIndex((l) => new RegExp(`^\\s*//\\s*#region\\s+${vung}\\s*$`).test(l));
  if (a < 0) throw new Error(`${rel}: không có vùng #region ${vung}`);
  let b = a + 1, sau = 0;
  for (; b < lines.length; b++) {
    if (/^\s*\/\/\s*#region\b/.test(lines[b])) sau++;
    if (/^\s*\/\/\s*#endregion\b/.test(lines[b])) { if (sau === 0) break; sau--; }
  }
  if (b >= lines.length) throw new Error(`${rel}: vùng ${vung} không đóng`);
  const body = lines.slice(a + 1, b).filter((l) => !laDanhDau(l));
  const thut = Math.min(...body.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return body.map((l) => l.slice(thut)).join('\n').replace(/\n+$/, '');
}

const NGON_NGU = { ts: 'typescript', java: 'java', js: 'javascript', mjs: 'javascript', txt: 'text', sh: 'bash', py: 'python' };

/** Khối mã đọc từ tệp. opts.vung = tên vùng; opts.nhan = nhãn nhỏ phía trên (vd 'TypeScript'). */
export function ma(rel, opts = {}) {
  const ext = rel.split('.').pop();
  const src = trich(doc(rel), opts.vung, rel);
  const nhan = opts.nhan ? `<p class="ma-nhan"><strong>${esc(opts.nhan)}</strong> <small>· ${esc(rel.split('/').pop())}</small></p>\n` : '';
  return `${nhan}<pre><code class="language-${NGON_NGU[ext] ?? ext}">${esc(src)}</code></pre>`;
}

/** Cặp lời giải TypeScript + Java của CÙNG một bài (đặt ngoài khối ngôn ngữ). */
export function maHai(tsRel, javaRel, opts = {}) {
  return `<div class="ma-hai">\n${ma(tsRel, { vung: opts.vungTs ?? opts.vung, nhan: 'TypeScript' })}\n` +
    `${ma(javaRel, { vung: opts.vungJava ?? opts.vung, nhan: 'Java' })}\n</div>`;
}

/** Output THẬT của một tệp (đọc <rel>.out do _chay.mjs ghi). opts.dau = dòng lệnh in phía trên. */
export function ketQua(rel, opts = {}) {
  const out = doc(`${rel}.out`).replace(/\n+$/, '');
  const lenh = opts.lenh ?? (rel.endsWith('.java') ? `$ java ${rel.split('/').pop()}` : `$ npx tsx ${rel.split('/').pop()}`);
  return `<div class="out">${esc(lenh)}\n${esc(out)}</div>`;
}

/* ── Mảng nhìn thấy được ─────────────────────────────────────────────────────────────────────────────── */
const NEN = {
  cs: 'rgba(47,158,107,.28)',   // trong cửa sổ / đoạn đang xét
  l: 'rgba(66,133,244,.30)',    // con trỏ trái
  r: 'rgba(214,146,32,.32)',    // con trỏ phải
  x: 'rgba(224,85,75,.28)',     // vừa bị loại / lỗi
  ok: 'rgba(47,158,107,.55)',   // đáp án
  mo: 'rgba(127,127,127,.12)',  // đã bỏ qua
};
const O = 'display:inline-block;min-width:1.9em;text-align:center;border:1px solid var(--border-color);' +
  'padding:1px 4px;margin:1px;border-radius:5px;font-family:var(--font-mono,monospace);font-size:.86rem;line-height:1.5';

/**
 * Vẽ một mảng thành hàng ô. to = { [chỉSố]: 'cs'|'l'|'r'|'x'|'ok'|'mo' } (màu nền), nhan = { [chỉSố]: 'L' } (chữ nhỏ trên số).
 * tu/den: tô 'cs' cho cả đoạn [tu..den]. Trả về HTML một dòng.
 */
export function oMang(arr, { to = {}, nhan = {}, tu = null, den = null, chiSo = false } = {}) {
  return arr.map((v, i) => {
    let mau = to[i];
    if (!mau && tu !== null && i >= tu && i <= den) mau = 'cs';
    const bg = mau ? `background:${NEN[mau]};` : '';
    const sup = nhan[i] ? `<sup>${esc(nhan[i])}</sup>` : '';
    const idx = chiSo ? `<sub>${i}</sub>` : '';
    return `<span style="${O};${bg}">${esc(v)}${sup}${idx}</span>`;
  }).join('');
}

/** Bảng vết: cot = ['vòng', 'i', …] (nhãn trung tính, dùng chung hai ngôn ngữ), hang = [[ô HTML…]…]. */
export function bangVet(cot, hang) {
  return `<table class="bang-vet">\n<thead><tr>${cot.map((c) => `<th>${c}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    hang.map((h) => `<tr>${h.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n') + `\n</tbody></table>`;
}

/* ── Liên kết ─────────────────────────────────────────────────────────────────────────────────────────── */

/**
 * Đề LeetCode. _kiem.mjs đọc lại chuỗi "LC <số> · <tên>" + slug trong href rồi hỏi GraphQL của LeetCode xem có đúng
 * số, đúng tên, đúng độ khó, có bị khoá Premium không. Đừng viết tay thẻ <a> LeetCode — luôn qua hàm này.
 */
export function lc(id, slug, ten, doKho, { premium = false } = {}) {
  if (!['Easy', 'Medium', 'Hard'].includes(doKho)) throw new Error(`lc ${id}: độ khó lạ ${doKho}`);
  return `<a class="lc" href="https://leetcode.com/problems/${slug}/" target="_blank" rel="noopener">LC ${id} · ${esc(ten)}</a>` +
    ` <small>(${doKho}${premium ? ' · 🔒 Premium' : ''})</small>`;
}

/** Bảng đề luyện. de = [[lc(...), 'dấu hiệu/gợi ý EN', 'dấu hiệu/gợi ý VI'], …]; lang = 'en' | 'vi'. */
export function bangDe(de, lang) {
  const en = lang === 'en';
  const dau = en ? ['#', 'Problem', 'Why this pattern / first hint'] : ['#', 'Đề', 'Vì sao là mẫu này / gợi ý đầu tiên'];
  return `<table class="bang-de">\n<thead><tr>${dau.map((c) => `<th>${c}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    de.map((d, i) => `<tr><td>${i + 1}</td><td>${d[0]}</td><td>${en ? d[1] : d[2]}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

/** Link mô phỏng tương tác trên /algorithms (mã sim nằm ở ma/…/*.sim.js, nhúng base64 vào ?code=). */
export function moPhong(rel, lang, tieuDe, phu) {
  const b64 = Buffer.from(doc(rel), 'utf8').toString('base64');
  const href = `/algorithms?code=${encodeURIComponent(b64)}`;
  const cta = lang === 'en' ? 'Open the simulation ▶' : 'Mở mô phỏng ▶';
  return `<a class="link-card codelab" href="${href}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🎬</span>\n  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Deep link tới một bài của chính khoá này. */
export const baiNay = (slug) => `/courses/${KHOA}/learn?lessonSlug=${slug}`;

/** Thẻ liên kết sang một bài khác trên /courses (khoa = slug khoá). */
export function lienKet({ khoa = KHOA, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Thẻ nguồn ngoài (URL phải GET 200 — _kiem.mjs kiểm). */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

/**
 * Hộp "Bạn đã gặp ở CSD201" — đặt TRONG khối ngôn ngữ. slug = slug bài CSD201 thật (kiểm bằng _kiem.mjs).
 * noiDung = câu ôn nhanh + "ở đây đi sâu thêm gì" (đúng ngôn ngữ của khối).
 */
export function csd(slug, lang, tenBai, noiDung) {
  const href = `/academy/courses/data-structures-and-algorithms/learn?lessonSlug=${slug}`;
  const dau = lang === 'en' ? `You met this in CSD201 — ${tenBai}` : `Bạn đã gặp ở CSD201 — ${tenBai}`;
  const cta = lang === 'en' ? 'Open the CSD201 lesson' : 'Mở bài CSD201';
  return `<div class="callout">\n<p><strong>🎓 ${dau}</strong></p>\n${noiDung}\n` +
    `<p><a href="${href}" target="_blank" rel="noopener">${cta} →</a></p>\n</div>`;
}

/**
 * Kịch bản hội thoại phỏng vấn. dong = [['I'|'C'|'N', 'câu'], …] — I = người phỏng vấn, C = ứng viên (bạn), N = ghi chú
 * của khoá (vì sao nói câu đó). lang chọn nhãn.
 */
export function hoiThoai(dong, lang) {
  const nhan = lang === 'en'
    ? { I: '🧑‍💼 Interviewer', C: '🙋 You', N: '💡 Why' }
    : { I: '🧑‍💼 Người phỏng vấn', C: '🙋 Bạn', N: '💡 Vì sao' };
  return `<div class="hoi-thoai">\n` + dong.map(([ai, cau]) => ai === 'N'
    ? `<p style="margin:.2em 0 .8em 1.6em;font-size:.88rem;opacity:.85"><em>${nhan.N}: ${cau}</em></p>`
    : `<p style="margin:.35em 0"><strong>${nhan[ai]}:</strong> ${cau}</p>`).join('\n') + `\n</div>`;
}

/** Lời giải/gợi ý gập lại (người học tự nghĩ trước). */
export const gap = (tieuDe, noiDung) => `<details>\n<summary>${tieuDe}</summary>\n${noiDung}\n</details>`;
