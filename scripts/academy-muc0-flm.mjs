/**
 * academy-muc0-flm.mjs — SINH "Mục 0 — Khung môn học chính thức theo syllabus FLM"
 * cho các môn Academy, từ dữ liệu syllabus thu trên flm.fpt.edu.vn.
 *
 *   node scripts/academy-muc0-flm.mjs --ma CEA201          # một môn
 *   node scripts/academy-muc0-flm.mjs --tatca              # mọi môn có JSON, trừ DANH SÁCH BỎ QUA
 *   node scripts/academy-muc0-flm.mjs --tatca --ky 1,2     # chỉ các kỳ (semester.ordinal) này
 *   node scripts/academy-muc0-flm.mjs ... --dry            # chỉ in, không ghi file
 *
 * Vào : content/academy/_syllabus-flm/<MÃ>.json  (bản web đầy đủ của SyllabusDetails)
 * Ra  : content/academy/_muc0-flm/<MÃ>.mjs       (một section, ghép vào môn bằng
 *       scripts/lib/academy-muc0-flm.mjs lúc seed — file môn KHÔNG bị sửa)
 *
 * PURE DATA — không LLM. Mọi chữ của trường in NGUYÊN VĂN (sinh viên phải đối chiếu
 * được với bản trường phát); phần web tự tính (tổng trọng số, số buổi vắng tối đa…)
 * gắn nhãn rõ. Ô trường để trống ⇒ ghi "trường không công bố", không đoán.
 *
 * Bỏ qua (không sinh) khi: môn đã có Mục 0 FLM làm tay (file môn đã chứa sylID),
 * hoặc nằm trong BO_QUA (môn user xác nhận đã đầy đủ, 09/11/2026).
 */
import fs from 'node:fs';
import path from 'node:path';
import { MUC0_FLM_TITLE } from './lib/academy-muc0-flm.mjs';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const DIR = 'content/academy';
const SYL = path.join(DIR, '_syllabus-flm');
const OUT = path.join(DIR, '_muc0-flm');
const DRY = has('--dry');

// Môn user xác nhận đã soạn đầy đủ (09/11/2026): FER202, chuyên ngành hẹp Node.js kỳ 5,
// và các môn đã dựng lại trọn theo slide trường. Môn đã có sylID trong file cũng tự bỏ qua.
export const BO_QUA = new Set([
  'FER202', 'SDN302', 'MMA301', 'WDP301',
  'PRF192', 'PRF193', 'CSI106', 'CEA201', 'SSL101c', 'MAE101', 'CSD201', 'DBI202', 'PRJ301', 'PRO192',
  'SWD392', 'OSG202', 'NWC204', 'SWR302', 'SWT301', 'SWP391', 'LAB211',
]);

/* ── tiện ích ─────────────────────────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const URL_RE = /https?:\/\/[^\s<>"')]+[^\s<>"').,;]/g;
/** Ô chữ của trường: escape, giữ xuống dòng, biến URL thành link (giữ nguyên văn URL). */
function o(s) {
  const t = String(s ?? '').trim();
  if (!t) return '';
  return esc(t)
    .replace(URL_RE, (u) => `<a href="${u.replace(/&amp;/g, '&')}" target="_blank" rel="noopener">${u}</a>`)
    .replace(/\n/g, '<br>');
}
const TRONG = { en: '<em>not published by the university</em>', vi: '<em>trường không công bố</em>' };
const oHoacTrong = (s, L) => (String(s ?? '').trim() ? o(s) : TRONG[L]);
/** Tiêu đề cột song ngữ — bảng dữ liệu NGUYÊN VĂN chỉ in MỘT lần (ngoài khối ml-en/ml-vi). */
const hh = (en, vi) => (en === vi ? en : `${en}<br><small>${vi}</small>`);
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const pct = (s) => { const m = String(s || '').match(/([\d.]+)\s*%/); return m ? parseFloat(m[1]) : null; };
/** "932/QĐ-ĐHFPT dated 08/22/2025" (MM/dd/yyyy) ⇒ { so, ngay:'22/08/2025' } */
function quyetDinh(s) {
  const t = String(s || '').trim();
  if (!t) return null;
  const m = t.match(/^(.*?)\s*dated\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (!m) return { so: t, ngay: '', goc: t };
  return { so: m[1].trim(), ngay: `${m[3].padStart(2, '0')}/${m[2].padStart(2, '0')}/${m[4]}`, goc: t };
}
function table(header, rows) {
  return `<table>\n  <thead><tr>${header.map((h) => `<th>${h}</th>`).join('')}</tr></thead>\n  <tbody>\n${rows.map((r) => `    <tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`;
}
/** Bảng FLM dạng [[header…],[row…]…] ⇒ mảng object theo tên cột. */
function rowsOf(tbl) {
  if (!Array.isArray(tbl) || tbl.length < 2) return [];
  const h = tbl[0];
  return tbl.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}
const truthy = (s) => /^true$/i.test(String(s || '').trim());
function hash(s) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }

/* ── dựng một môn ─────────────────────────────────────────────────────────── */
export function dungMuc0(syl, spec) {
  const ma = syl.ma;
  const lo = ma.toLowerCase();
  const c = syl.chung || {};
  const qd = quyetDinh(syl.quyetDinh || c['DecisionNo MM/dd/yyyy']);
  const thu = syl.thuNgay ? syl.thuNgay.split('-').reverse().join('/') : '';
  const flmUrl = `https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=${syl.sylID}`;
  const nguonEn = `Source: FLM · Syllabus ID ${esc(syl.sylID)}${qd ? ` · Decision ${esc(qd.so)}${qd.ngay ? ` dated ${esc(qd.ngay)}` : ''}` : ''}${thu ? ` · collected ${thu}` : ''}`;
  const nguonVi = `Nguồn: FLM · Syllabus ID ${esc(syl.sylID)}${qd ? ` · QĐ ${esc(qd.so)}${qd.ngay ? ` ngày ${esc(qd.ngay)}` : ''}` : ''}${thu ? ` · thu ngày ${thu}` : ''}`;
  const tenMon = String(spec?.course?.title || c['Course Name English'] || ma).split('|||').pop();

  const danhGia = rowsOf(syl.danhGia);
  const clo = rowsOf(syl.clo);
  const taiLieu = rowsOf(syl.taiLieu);
  const buoi = (syl.buoi || []).map((r) => Object.fromEntries((syl.buoiCotHeader || []).map((k, i) => [k, r[i] ?? ''])));
  const cq = rowsOf(syl.cauHoiKienTao);
  const soBuoi = buoi.length;
  const tongTS = danhGia.reduce((a, r) => a + (pct(r.Weight) || 0), 0);
  const tongTron = Math.round(tongTS * 10) / 10;
  // Dòng TỔNG HỢP: FLM hay in cả "Thi cuối kỳ 40%" lẫn ba phần 15+15+10 của nó ⇒ cộng thẳng ra 140%.
  // Nhận ra khi trọng số dòng = tổng các dòng KHÁC cùng Type và bỏ nó đi thì tổng về 100.
  const tongHop = new Set();
  if (Math.abs(tongTron - 100) > 0.05) {
    const w = danhGia.map((r) => pct(r.Weight));
    // ứng viên: trọng số = tổng các dòng KHÁC cùng Type (ít nhất 2 dòng)
    const ung = danhGia.map((r, i) => i).filter((i) => {
      if (w[i] == null) return false;
      const cung = danhGia.map((x, j) => j).filter((j) => j !== i && String(danhGia[j].Type).trim() === String(danhGia[i].Type).trim());
      const sum = cung.reduce((a, j) => a + (w[j] || 0), 0);
      return cung.length >= 2 && Math.abs(sum - w[i]) < 0.05;
    });
    // chỉ nhận khi bỏ đúng 1 (hoặc 2) ứng viên thì tổng về ĐÚNG 100
    const mot = ung.filter((i) => Math.abs(tongTS - w[i] - 100) < 0.05);
    if (mot.length === 1) tongHop.add(mot[0]);
    else if (!mot.length) {
      const hai = [];
      for (const i of ung) for (const j of ung) if (i < j && Math.abs(tongTS - w[i] - w[j] - 100) < 0.05) hai.push([i, j]);
      if (hai.length === 1) hai[0].forEach((i) => tongHop.add(i));
    }
  }

  const dau = (n, en, vi, leadEn, leadVi) => bi(
    `<span class="eyebrow">${esc(ma)} · Section 0 · Lesson 0.${n}</span>\n<h2>${en}</h2>\n${leadEn ? `<p class="lead">${leadEn}</p>\n` : ''}<p class="nhan">${nguonEn}</p>`,
    `<span class="eyebrow">${esc(ma)} · Mục 0 · Bài 0.${n}</span>\n<h2>${vi}</h2>\n${leadVi ? `<p class="lead">${leadVi}</p>\n` : ''}<p class="nhan">${nguonVi}</p>`,
  );
  const cuoi = bi(
    `<div class="note-ct">Everything in the tables above is copied <strong>verbatim</strong> from the university's FLM page (in English, as published) so you can check it against the copy your lecturer gives you: <a href="${flmUrl}" target="_blank" rel="noopener">${esc(flmUrl)}</a> (needs your FPT login). If FLM publishes a newer syllabus, FLM wins.</div>`,
    `<div class="note-ct">Mọi thứ trong các bảng trên được chép <strong>nguyên văn</strong> từ trang FLM của trường (bằng tiếng Anh, đúng như trường công bố) để bạn đối chiếu với bản giảng viên phát: <a href="${flmUrl}" target="_blank" rel="noopener">${esc(flmUrl)}</a> (cần đăng nhập tài khoản FPT). Nếu FLM công bố bản syllabus mới hơn thì theo FLM.</div>`,
  );

  /* 0.1 Hồ sơ môn */
  const kv = (k, v) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  const hoSo = (L) => {
    const T = L === 'en'
      ? ['Subject code', 'Syllabus name', 'Credits', 'Degree level', 'Time allocation', 'Prerequisite', 'Teaching method', 'Scoring scale', 'Minimum average to pass', 'Syllabus ID', 'Decision', 'Approved date', 'Sessions in the plan']
      : ['Mã môn', 'Tên syllabus', 'Số tín chỉ', 'Bậc đào tạo', 'Phân bổ thời gian', 'Môn tiên quyết', 'Phương pháp dạy – học', 'Thang điểm', 'Điểm trung bình tối thiểu để qua', 'Syllabus ID', 'Quyết định ban hành', 'Ngày duyệt', 'Số buổi trong kế hoạch'];
    const v = [c['Subject Code'] || ma, c['Syllabus Name'], c.NoCredit, c['Degree Level'], c['Time Allocation'], c['Pre-Requisite'], c['Learning-Teaching Method'], c['Scoring Scale'], c.MinAvgMarkToPass, syl.sylID, qd?.goc, c.ApprovedDate, soBuoi ? String(soBuoi) : ''];
    return `<div class="kv-grid">\n${T.map((t, i) => kv(t, oHoacTrong(v[i], L))).join('\n')}\n</div>`;
  };
  const moTa = String(c.Description || '').trim();
  const ghiChu = String(c.Note || '').trim();
  const l1 = [
    dau(1, 'Course profile, as the university publishes it', 'Hồ sơ môn học, đúng như trường công bố',
      `${esc(tenMon)} — the official numbers: credits, hours, prerequisite and the decision that issued this syllabus.`,
      `${esc(tenMon)} — các con số chính thức: tín chỉ, giờ học, môn tiên quyết và quyết định ban hành syllabus.`),
    bi(hoSo('en'), hoSo('vi')),
    bi(`<h3>Description (verbatim)</h3>\n<p>${oHoacTrong(moTa, 'en')}</p>${ghiChu ? `\n<h3>Note from the university</h3>\n<p>${o(ghiChu)}</p>` : ''}`,
      `<h3>Mô tả môn học (nguyên văn)</h3>\n<p>${oHoacTrong(moTa, 'vi')}</p>${ghiChu ? `\n<h3>Ghi chú của trường</h3>\n<p>${o(ghiChu)}</p>` : ''}`),
    cuoi,
  ].join('\n');

  /* 0.2 Cách tính điểm */
  const hdrDG = [hh('#', '#'), hh('Category', 'Đầu điểm'), hh('Type', 'Loại'), hh('Parts', 'Số phần'), hh('Weight', 'Trọng số'), hh('Completion criteria', 'Điều kiện hoàn thành'), hh('Duration', 'Thời lượng'), 'CLO', hh('Question type', 'Dạng câu hỏi'), hh('No. of questions', 'Số câu')];
  const dongDG = danhGia.map((r, i) => [String(i + 1), `<strong>${o(r.Category)}</strong>${tongHop.has(i) ? '<br><small>Σ</small>' : ''}`, o(r.Type), o(r.Part), `<strong>${o(r.Weight)}</strong>`, o(r['Completion Criteria']), o(r.Duration), o(r.CLO), o(r['Question Type']), o(r['No Question'])]);
  const chiTietDG = (L) => {
    const x = danhGia.filter((r) => String(r['Knowledge and Skill'] || r['Grading Guide'] || r.Note || '').trim());
    if (!x.length) return '';
    const n = L === 'en' ? ['The fine print per mark (verbatim)', 'Knowledge & skill', 'Grading guide', 'Note'] : ['Chi tiết từng đầu điểm (nguyên văn)', 'Kiến thức & kỹ năng', 'Hướng dẫn chấm', 'Ghi chú'];
    return `<h3>${n[0]}</h3>\n<ul>\n${x.map((r) => `<li><strong>${o(r.Category)}</strong>${r['Knowledge and Skill'] ? ` — <em>${n[1]}:</em> ${o(r['Knowledge and Skill'])}` : ''}${r['Grading Guide'] ? `<br><em>${n[2]}:</em> ${o(r['Grading Guide'])}` : ''}${r.Note ? `<br><em>${n[3]}:</em> ${o(r.Note)}` : ''}</li>`).join('\n')}\n</ul>`;
  };
  const tongEn = tongHop.size ? `The row${tongHop.size > 1 ? 's' : ''} marked <strong>Σ</strong> (${[...tongHop].map((i) => o(danhGia[i].Category)).join(', ')}) ${tongHop.size > 1 ? 'are totals' : 'is the total'} of the parts of the same type listed with it, so ${tongHop.size > 1 ? 'they are' : 'it is'} not counted twice: the remaining weights add up to <strong>100%</strong> (the website's reading — FLM prints all ${danhGia.length} rows, summing to ${tongTron}%).` : danhGia.length ? (Math.abs(tongTron - 100) < 0.05 ? `The weights add up to <strong>100%</strong>.` : `⚠️ The weights published on FLM add up to <strong>${tongTron}%</strong>, not 100% — ask your lecturer how the rest is counted.`) : '';
  const tongVi = tongHop.size ? `Dòng đánh dấu <strong>Σ</strong> (${[...tongHop].map((i) => o(danhGia[i].Category)).join(', ')}) là TỔNG của các phần cùng loại ghi kèm, nên không cộng hai lần: các trọng số còn lại cộng đúng <strong>100%</strong> (cách đọc của web — FLM in cả ${danhGia.length} dòng, cộng thẳng ra ${tongTron}%).` : danhGia.length ? (Math.abs(tongTron - 100) < 0.05 ? `Tổng trọng số đúng <strong>100%</strong>.` : `⚠️ Tổng trọng số FLM công bố là <strong>${tongTron}%</strong>, không phải 100% — hỏi giảng viên phần còn lại được tính thế nào.`) : '';
  const l2 = [
    dau(2, 'Grading: every mark and its weight', 'Cách tính điểm: đủ mọi đầu điểm và trọng số',
      'Read this in week one — part of the grade is earned in class long before any exam.',
      'Đọc ngay tuần đầu — một phần điểm được tính trong lớp từ rất sớm, trước mọi kỳ thi.'),
    danhGia.length
      ? table(hdrDG, dongDG)
      : bi(`<p>${TRONG.en} — FLM lists no assessment table for this syllabus.</p>`, `<p>${TRONG.vi} — syllabus này trên FLM không có bảng đánh giá.</p>`),
    bi(`<p>${tongEn}${c.MinAvgMarkToPass ? ` Minimum average to pass: <strong>${o(c.MinAvgMarkToPass)}</strong>.` : ''}</p>
<p class="ghi-chu"><em>How to read "Completion criteria":</em> it is the minimum score that one mark must reach (e.g. <code>&gt;0</code> = you must not get zero / must sit it; <code>4</code> = at least 4/10). Missing it can mean failing the subject even with a good average — this reading is the website's explanation, the table itself is the university's.</p>`,
    `<p>${tongVi}${c.MinAvgMarkToPass ? ` Điểm trung bình tối thiểu để qua môn: <strong>${o(c.MinAvgMarkToPass)}</strong>.` : ''}</p>
<p class="ghi-chu"><em>Cách đọc cột "Điều kiện hoàn thành":</em> là điểm tối thiểu đầu điểm đó phải đạt (vd <code>&gt;0</code> = không được 0 / phải dự; <code>4</code> = tối thiểu 4/10). Không đạt có thể trượt môn dù điểm trung bình cao — phần giải thích này là của web, bảng là của trường.</p>`),
    bi(chiTietDG('en'), chiTietDG('vi')),
    cuoi,
  ].join('\n');

  /* 0.3 CLO */
  const l3 = [
    dau(3, `The ${clo.length || ''} course learning outcomes (CLO), verbatim`.replace('  ', ' '), `${clo.length || ''} chuẩn đầu ra môn học (CLO), nguyên văn`.trim(),
      'Exam questions are written against these outcomes — use them as your checklist.',
      'Đề thi được ra theo các chuẩn đầu ra này — dùng chúng làm danh sách tự kiểm.'),
    clo.length
      ? table(['#', 'CLO', hh('Details (verbatim)', 'Nội dung (nguyên văn)')], clo.map((r, i) => [String(i + 1), `<strong>${o(r['CLO Name'])}</strong>`, o(r['CLO Details'])]))
      : bi(`<p>${TRONG.en}.</p>`, `<p>${TRONG.vi}.</p>`),
    cuoi,
  ].join('\n');

  /* 0.4 Giáo trình & công cụ */
  const yn = (s) => (truthy(s) ? '✔' : '—');
  const hdrTL = ['#', hh('Material', 'Tài liệu'), hh('Author', 'Tác giả'), hh('Publisher', 'NXB'), hh('Year', 'Năm'), hh('Edition', 'Lần xuất bản'), 'ISBN', hh('Main', 'Chính'), hh('Hard copy', 'Bản in'), 'Online', hh('Note', 'Ghi chú')];
  const dongTL = taiLieu.map((r, i) => [String(i + 1), `<strong>${o(r['Material Description'])}</strong>`, o(r.Author), o(r.Publisher), o(r['Published Date']), o(r.Edition), r.ISBN ? `<code>${esc(r.ISBN)}</code>` : '', yn(r['Is Main Material']), yn(r['Is Hard Copy']), yn(r['Is Online']), o(r.Note)]);
  const chinh = taiLieu.filter((r) => truthy(r['Is Main Material']));
  const tools = String(c.Tools || '').trim();
  const l4 = [
    dau(4, 'Textbooks, materials & tools the university names', 'Giáo trình, tài liệu & công cụ trường quy định',
      chinh.length ? `Main textbook${chinh.length > 1 ? 's' : ''}: ${chinh.map((r) => `<strong>${o(r['Material Description'])}</strong>`).join('; ')}.` : 'No material is flagged as the main textbook on FLM.',
      chinh.length ? `Giáo trình chính: ${chinh.map((r) => `<strong>${o(r['Material Description'])}</strong>`).join('; ')}.` : 'FLM không đánh dấu tài liệu nào là giáo trình chính.'),
    taiLieu.length
      ? table(hdrTL, dongTL)
      : bi(`<p>${TRONG.en} — no materials listed.</p>`, `<p>${TRONG.vi} — không có danh mục tài liệu.</p>`),
    bi(`<h3>Tools</h3>\n<p>${oHoacTrong(tools, 'en')}</p>\n<p class="ghi-chu">Materials with no author/ISBN (slides, exercise packs…) are usually internal files you download inside FLM with your FPT account. Buy the exact <strong>edition</strong> listed — page and exercise numbers change between editions.</p>`,
      `<h3>Công cụ</h3>\n<p>${oHoacTrong(tools, 'vi')}</p>\n<p class="ghi-chu">Tài liệu không có tác giả/ISBN (slide, bộ bài tập…) thường là file nội bộ, tải trong FLM bằng tài khoản FPT. Mua đúng <strong>lần xuất bản</strong> ghi trong bảng — số trang, số bài tập đổi giữa các bản.</p>`),
    cuoi,
  ].join('\n');

  /* 0.5 Kế hoạch buổi */
  const colB = [['Session', '#', 'Buổi'], ['Topic', 'Topic', 'Chủ đề'], ['Learning-Teaching Type', 'Type', 'Hình thức'], ['LO', 'LO', 'LO'], ['ITU', 'ITU', 'ITU'], ['Student Materials', 'Materials', 'Tài liệu'], ["Student's Tasks", 'Student tasks', 'Nhiệm vụ SV'], ['URLs', 'Links', 'Link']]
    .filter(([k]) => buoi.some((r) => String(r[k] || '').trim()));
  const bangBuoi = table(colB.map((x) => hh(x[1], x[2])), buoi.map((r) => colB.map(([k]) => (k === 'Session' ? `<strong>${esc(r[k])}</strong>` : o(r[k])))));
  const vang = soBuoi ? Math.floor(soBuoi * 0.2) : 0;
  const l5 = [
    dau(5, `All ${soBuoi} sessions, as published by FLM`, `Kế hoạch đủ ${soBuoi} buổi, đúng như FLM công bố`,
      `Session by session: what is taught, which outcome it serves and what you must prepare.${vang ? ` (If your campus applies the usual 80% attendance rule, ${soBuoi} sessions means at most ${vang} absences — the website's arithmetic, check the student tasks in 0.6.)` : ''}`,
      `Từng buổi: học gì, phục vụ chuẩn đầu ra nào, bạn phải chuẩn bị gì.${vang ? ` (Nếu áp quy định dự ≥80% thường gặp, ${soBuoi} buổi nghĩa là vắng tối đa ${vang} buổi — số học của web, không phải quy định của trường; xem nhiệm vụ SV ở 0.6.)` : ''}`),
    soBuoi ? bangBuoi : bi(`<p>${TRONG.en} — FLM lists no session plan.</p>`, `<p>${TRONG.vi} — FLM không có kế hoạch buổi.</p>`),
    bi('<p class="ghi-chu"><em>ITU</em> = Introduce / Teach / Utilize — how deeply the session handles each outcome. The lessons after Section 0 on this website cover the same topics; where a chapter is still thin, follow this plan and the main textbook.</p>',
      '<p class="ghi-chu"><em>ITU</em> = Introduce (giới thiệu) / Teach (dạy) / Utilize (vận dụng) — mức độ buổi học xử lý chuẩn đầu ra. Các bài sau Mục 0 trên web phủ cùng chủ đề; chương nào còn mỏng thì bám kế hoạch này và giáo trình chính.</p>'),
    cuoi,
  ].join('\n');

  /* 0.6 Nhiệm vụ SV + câu hỏi kiến tạo */
  const nv = String(c.StudentTasks || '').trim();
  const l6 = [
    dau(6, 'Student tasks & constructive questions', 'Nhiệm vụ sinh viên & câu hỏi kiến tạo',
      'The rules you are held to (attendance, preparation, exam eligibility) — verbatim.',
      'Những quy định bạn phải tuân theo (chuyên cần, chuẩn bị bài, điều kiện dự thi) — nguyên văn.'),
    bi(`<h3>Student tasks (verbatim)</h3>\n<p>${oHoacTrong(nv, 'en')}</p>`, `<h3>Nhiệm vụ sinh viên (nguyên văn)</h3>\n<p>${oHoacTrong(nv, 'vi')}</p>`),
    cq.length
      ? bi(`<h3>Constructive questions (${cq.length})</h3>\n<p>Questions the syllabus asks you to think through before or during the session — try answering them yourself first.</p>`,
        `<h3>Câu hỏi kiến tạo (${cq.length})</h3>\n<p>Câu hỏi syllabus yêu cầu bạn suy nghĩ trước/trong buổi học — tự trả lời trước khi xem bài.</p>`) + '\n' + table([hh('Session', 'Buổi'), hh('Code', 'Mã'), hh('Question (verbatim)', 'Câu hỏi (nguyên văn)')], cq.map((r) => [esc(r['Session No']), esc(r.Name), o(r.Details)]))
      : '',
    cuoi,
  ].filter(Boolean).join('\n');

  const lessons = [
    { slug: `${lo}-flm-0-1-ho-so-mon`, en: '0.1 — Course profile (official FLM syllabus)', vi: '0.1 — Hồ sơ môn học (syllabus FLM chính thức)', content: l1 },
    { slug: `${lo}-flm-0-2-cach-tinh-diem`, en: '0.2 — Grading: marks, weights, pass conditions', vi: '0.2 — Cách tính điểm: đầu điểm, trọng số, điều kiện qua môn', content: l2 },
    { slug: `${lo}-flm-0-3-clo`, en: '0.3 — Course learning outcomes (CLO)', vi: '0.3 — Chuẩn đầu ra môn học (CLO)', content: l3 },
    { slug: `${lo}-flm-0-4-giao-trinh`, en: '0.4 — Textbooks, materials & tools', vi: '0.4 — Giáo trình, tài liệu & công cụ', content: l4 },
    { slug: `${lo}-flm-0-5-ke-hoach-buoi`, en: `0.5 — Session plan (${soBuoi} sessions)`, vi: `0.5 — Kế hoạch ${soBuoi} buổi học`, content: l5 },
    { slug: `${lo}-flm-0-6-nhiem-vu-sv`, en: '0.6 — Student tasks & constructive questions', vi: '0.6 — Nhiệm vụ sinh viên & câu hỏi kiến tạo', content: l6 },
  ].map((x) => ({ title: `${x.en}|||${x.vi}`, slug: x.slug, type: 'DOCUMENT', isFreePreview: true, description: 'Khung môn học theo syllabus FLM chính thức.', content: x.content }));

  const quiz = quizMuc0({ ma, c, danhGia: tongHop.size ? [] : danhGia, soBuoi, clo });
  if (quiz) lessons.push({ title: 'Quiz 0 — Do you know the rules of this subject?|||Quiz 0 — Bạn đã nắm luật chơi của môn chưa?', slug: `${lo}-flm-quiz-0`, type: 'QUIZ', description: 'Kiểm tra nhanh khung môn học theo syllabus FLM.', quiz });

  return {
    title: MUC0_FLM_TITLE,
    description: `Official FLM syllabus ${syl.sylID}: profile, grading, CLOs, textbooks, all ${soBuoi} sessions.|||Syllabus FLM chính thức ${syl.sylID}: hồ sơ môn, cách tính điểm, CLO, giáo trình, đủ ${soBuoi} buổi.`,
    lessons,
  };
}

/* Quiz 0: chỉ hỏi những điều CHẮC từ dữ liệu, đáp án xoay vị trí theo mã môn. */
function quizMuc0({ ma, c, danhGia, soBuoi, clo }) {
  const qs = [];
  const tron = (arr, dung, seed) => { const k = hash(ma + seed) % arr.length; const a = arr.filter((x) => x !== dung); a.splice(k, 0, dung); return { options: a, correctIndex: k }; };
  const tc = parseInt(c.NoCredit, 10);
  if (tc > 0) {
    const opts = [...new Set([tc, tc + 1, tc > 1 ? tc - 1 : tc + 2, tc + 3])].slice(0, 4).map(String);
    const t = tron(opts, String(tc), 'tc');
    qs.push({ question: `How many credits is ${ma} worth?|||${ma} có bao nhiêu tín chỉ?`, options: t.options.map((x) => `${x}|||${x}`), correctIndex: t.correctIndex, explanation: `FLM: NoCredit = ${tc}.|||FLM ghi NoCredit = ${tc}.` });
  }
  const w = danhGia.map((r) => ({ ten: String(r.Category || '').trim(), p: pct(r.Weight) })).filter((x) => x.ten && x.p != null);
  const max = Math.max(...w.map((x) => x.p));
  const top = w.filter((x) => x.p === max);
  if (w.length >= 3 && top.length === 1) {
    const ten = [...new Set(w.map((x) => x.ten))];
    const opts = [top[0].ten, ...ten.filter((x) => x !== top[0].ten)].slice(0, 4);
    const t = tron(opts, top[0].ten, 'w');
    qs.push({ question: `Which mark carries the LARGEST weight in ${ma}?|||Đầu điểm nào có trọng số LỚN NHẤT trong ${ma}?`, options: t.options.map((x) => `${x}|||${x}`), correctIndex: t.correctIndex, explanation: `${top[0].ten} = ${max}%. Weights on FLM: ${w.map((x) => `${x.ten} ${x.p}%`).join(' · ')}.|||${top[0].ten} = ${max}%. Trọng số trên FLM: ${w.map((x) => `${x.ten} ${x.p}%`).join(' · ')}.` });
  }
  if (soBuoi >= 10) {
    const opts = [...new Set([soBuoi, soBuoi === 30 ? 45 : 30, soBuoi === 60 ? 45 : 60, soBuoi === 20 ? 40 : 20])].slice(0, 4).map(String);
    if (opts.length === 4) {
      const t = tron(opts, String(soBuoi), 'b');
      qs.push({ question: `How many sessions does the FLM plan of ${ma} have?|||Kế hoạch FLM của ${ma} có bao nhiêu buổi?`, options: t.options.map((x) => `${x}|||${x}`), correctIndex: t.correctIndex, explanation: `The session plan in lesson 0.5 lists ${soBuoi} sessions.|||Kế hoạch ở bài 0.5 liệt kê ${soBuoi} buổi.` });
    }
  }
  if (clo.length >= 2) {
    const n = clo.length;
    const opts = [...new Set([n, n + 2, n > 2 ? n - 1 : n + 3, n + 4])].slice(0, 4).map(String);
    const t = tron(opts, String(n), 'c');
    qs.push({ question: `How many course learning outcomes (CLO) does ${ma} define?|||${ma} có bao nhiêu chuẩn đầu ra (CLO)?`, options: t.options.map((x) => `${x}|||${x}`), correctIndex: t.correctIndex, explanation: `FLM lists ${n} CLOs (lesson 0.3).|||FLM liệt kê ${n} CLO (bài 0.3).` });
  }
  if (qs.length < 2) return null;
  return { timeLimitSeconds: 60 * qs.length, questions: qs.map((q, i) => ({ id: `q${i + 1}`, points: 1, ...q })) };
}

/* ── chạy ─────────────────────────────────────────────────────────────────── */
async function main() {
  const ky = val('--ky') ? new Set(val('--ky').split(',').map(Number)) : null;
  let ds;
  if (val('--ma')) ds = [val('--ma')];
  else if (has('--tatca')) ds = fs.readdirSync(SYL).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  else { console.error('cần --ma <MÃ> hoặc --tatca'); process.exit(1); }
  if (!DRY) fs.mkdirSync(OUT, { recursive: true });
  const kq = { ghi: [], boQua: [], daCo: [], khongFLM: [], khongMon: [], loi: [], khacKy: 0 };
  for (const ma of ds.sort()) {
    const fMon = path.join(DIR, `${ma}.mjs`);
    if (!fs.existsSync(fMon)) { kq.khongMon.push(ma); continue; }
    const syl = JSON.parse(fs.readFileSync(path.join(SYL, `${ma}.json`), 'utf8'));
    if (syl.khongCo) { kq.khongFLM.push(ma); continue; }
    const spec = (await import(path.resolve(fMon))).default;
    if (ky && !ky.has(spec.semester?.ordinal)) { kq.khacKy++; continue; }
    if (!val('--ma') && BO_QUA.has(ma)) { kq.boQua.push(ma); continue; }
    const chu = JSON.stringify(spec);
    if (!val('--ma') && (chu.includes(`sylID ${syl.sylID}`) || chu.includes(`Syllabus ID ${syl.sylID}`) || chu.includes(`Syllabus ${syl.sylID}`) || chu.includes(`sylID=${syl.sylID}`))) { kq.daCo.push(ma); continue; }
    try {
      const sec = dungMuc0(syl, spec);
      const slugCu = new Set((spec.sections || spec.course.sections || []).flatMap((s) => (s.lessons || []).map((l) => l.slug)));
      const trung = sec.lessons.filter((l) => slugCu.has(l.slug)).map((l) => l.slug);
      if (trung.length) throw new Error('slug trùng bài cũ: ' + trung.join(','));
      for (const l of sec.lessons) if (l.title.length > 255) throw new Error('title > 255: ' + l.slug);
      const body = `// SINH TỰ ĐỘNG bởi scripts/academy-muc0-flm.mjs từ _syllabus-flm/${ma}.json — ĐỪNG SỬA TAY, sửa dữ liệu rồi sinh lại.\n// Ghép vào môn lúc seed: scripts/lib/academy-muc0-flm.mjs\nexport default ${JSON.stringify(sec, null, 1)};\n`;
      if (!DRY) fs.writeFileSync(path.join(OUT, `${ma}.mjs`), body);
      kq.ghi.push(`${ma}(${sec.lessons.length})`);
    } catch (e) { kq.loi.push(`${ma}: ${e.message}`); }
  }
  console.log(`${DRY ? '[DRY] ' : ''}Sinh Mục 0: ${kq.ghi.length} môn`);
  console.log(`  bỏ qua (đã đầy đủ): ${kq.boQua.length} ${kq.boQua.join(' ')}`);
  console.log(`  đã có Mục 0 FLM làm tay: ${kq.daCo.length} ${kq.daCo.join(' ')}`);
  console.log(`  FLM không có syllabus: ${kq.khongFLM.length}`);
  if (kq.khacKy) console.log(`  khác kỳ đã chọn: ${kq.khacKy}`);
  if (kq.khongMon.length) console.log(`  không có file môn: ${kq.khongMon.join(' ')}`);
  if (kq.loi.length) { console.log(`  ⛔ lỗi: ${kq.loi.length}`); kq.loi.forEach((x) => console.log('    ' + x)); process.exitCode = 1; }
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
