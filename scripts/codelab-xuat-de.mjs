#!/usr/bin/env node
/**
 * codelab-xuat-de.mjs — XUẤT bộ đề Code Lab từ nguồn .mjs sang JSON nạp được (đợt Academy 28/10/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * Dùng cho MỌI track mới (fer202-practice, swt301-practice, swr302-practice…). Track
 * web-foundations-practice giữ bộ xuất riêng (scripts/codelab-kiem-de-web.mjs — có chạy jsdom).
 *
 *   node scripts/codelab-xuat-de.mjs --track fer202-practice            # kiểm trường + ghi JSON
 *   node scripts/codelab-xuat-de.mjs --track fer202-practice --kho      # chỉ kiểm, báo nếu JSON lệch nguồn
 *   node scripts/codelab-xuat-de.mjs --track fer202-practice --chi <module-slug>
 *
 * Nguồn: content/codelab/<track>/nguon/<module-slug>.mjs (bỏ qua tệp bắt đầu bằng _). Định dạng đầy đủ:
 * content/codelab/README.md. Ra: content/codelab/<track>/<track>__<module-slug>.json (payload của
 * scripts/codelab-seed-authored.mjs). Sau khi xuất, LUÔN chạy máy chấm trình duyệt thật:
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track <track>
 * (lời giải đạt 100% mọi kiểm, code khởi đầu trượt ≥ 1).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dungBanIn, dungDemoReact, thangDiemTu } from '../content/codelab/_chung/deLon.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const lay = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const TRACK = lay('--track');
const CHI = lay('--chi');
const CHI_KIEM = args.includes('--kho');
if (!TRACK) { console.error('cần --track <slug>'); process.exit(2); }

const THU_MUC = path.join(GOC, 'content/codelab', TRACK);
const NGUON = path.join(THU_MUC, 'nguon');
if (!fs.existsSync(NGUON)) { console.error(`không có ${path.relative(GOC, NGUON)}`); process.exit(2); }

const DIEM = { EASY: 10, MEDIUM: 20, HARD: 30 };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** chuỗi | { en, vi } ⇒ [en, vi|null] */
function hai(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'vi' in v)) return [v.en ?? v.vi, v.vi ?? null];
  return [v ?? null, null];
}
/** "EN|||VI" khi có cả hai (trang đọc bằng pickLang) — cho các cột không có bản VI riêng. */
function gop(v) {
  const [en, vi] = hai(v);
  if (en == null) return null;
  return vi && vi !== en ? `${en}|||${vi}` : en;
}
/** danh sách: [..] của chuỗi/{en,vi} hoặc { en:[..], vi:[..] } ⇒ [[en..],[vi..]|null] */
function haiDs(v) {
  if (!v) return [[], null];
  if (Array.isArray(v)) {
    const en = v.map((x) => hai(x)[0]);
    const vi = v.some((x) => hai(x)[1]) ? v.map((x) => hai(x)[1] ?? hai(x)[0]) : null;
    return [en, vi];
  }
  return [v.en ?? [], v.vi ?? null];
}

function ngonNguTep(ten) {
  if (/\.css$/.test(ten)) return 'css';
  if (/\.(jsx|tsx)$/.test(ten)) return 'jsx';
  if (/\.tsx?$/.test(ten)) return 'typescript';
  if (/\.m?js$/.test(ten)) return 'javascript';
  if (/\.json$/.test(ten)) return 'json';
  if (/\.java$/.test(ten)) return 'java';
  if (/\.sql$/.test(ten)) return 'sql';
  if (/\.py$/.test(ten)) return 'python';
  if (/\.html?$/.test(ten)) return 'html';
  return 'text';
}
const khoiCode = (map) => Object.entries(map || {}).map(([name, c]) => ({
  name, language: ngonNguTep(name), code: String(c).replace(/^\n/, '').replace(/[ \t]+$/gm, '').replace(/\s*$/, '\n'),
}));

function dungDeNho(moTa, yeuCau, lang) {
  const h = lang === 'vi' ? 'Yêu cầu' : 'Requirements';
  return `${String(moTa).trim()}\n<h4>${h}</h4>\n<ul>\n${yeuCau.map((y) => `  <li>${y}</li>`).join('\n')}\n</ul>`;
}

function xuat(de, m) {
  const lon = !!de.banIn;
  const kind = de.dangBai || (lon ? 'lab' : 'practice');
  const tests = de.tests ? { ...de.tests } : null;
  if (lon && tests && !tests.thangDiem) tests.thangDiem = thangDiemTu(de.banIn);
  let problemHtml, problemHtmlVi;
  if (lon) {
    problemHtml = dungBanIn(de.banIn, 'en');
    problemHtmlVi = dungBanIn(de.banIn, 'vi');
  } else {
    const [moEn, moVi] = hai(de.moTa);
    const [ycEn, ycVi] = haiDs(de.yeuCau);
    problemHtml = dungDeNho(moEn, ycEn, 'en');
    problemHtmlVi = moVi || ycVi ? dungDeNho(moVi ?? moEn, ycVi ?? ycEn, 'vi') : null;
  }
  const [giaiEn, giaiVi] = hai(de.giaiThich);
  const viDu = (de.viDu || []).map((v) => ({ input: gop(v.input), output: gop(v.output), explanation: gop(v.explanation) }));
  if (!viDu.length && lon) {
    const c = de.banIn.chucNang.find((x) => x.viDu);
    if (c) viDu.push({ input: gop(c.ten), output: gop(c.viDu), explanation: 'See the brief / Xem đề.' });
  }
  const files = Object.fromEntries(khoiCode(de.loiGiai).map((b) => [b.name, b.code]));
  let demoHtml;
  if (de.demo && tests?.loai === 'react') {
    // de.demo.thay: [[chữ cũ, chữ mới]] — chỉ áp cho Live demo (vd đổi ảnh trong public/ thành data: URI, vì demo chỉ có mã).
    const tepDemo = Object.fromEntries(Object.entries(files).map(([ten, ma]) => [ten, (de.demo.thay || []).reduce((s, [cu, moi]) => s.split(cu).join(moi), ma)]));
    demoHtml = dungDemoReact(tepDemo, { cssThem: de.demo.css, tepChinh: de.demo.tepChinh || tests.tepChinh || 'src/index.js', thuVien: tests.thuVien || [], tieuDe: `${hai(de.tieuDe)[0]} — Live demo`, jsonServer: de.demo.jsonServer ?? tests.jsonServer ?? null, url: de.demo.url ?? tests.url ?? null });
  }
  return {
    title: hai(de.tieuDe)[0],
    language: de.ngonNgu || m.ngonNgu || 'javascript',
    difficulty: de.doKho,
    estimatedMinutes: de.phut,
    points: de.diem ?? DIEM[de.doKho],
    concepts: de.khaiNiem || [],
    prerequisites: de.tienQuyet || [],
    tags: de.the || [],
    problemHtml,
    problemHtmlVi,
    inputSpec: gop(de.dauVao) ?? (lon ? 'A React project — see the brief (folder structure, data model, features).|||Một dự án React — xem đề (cây thư mục, mô hình dữ liệu, chức năng).' : null),
    outputSpec: gop(de.dauRa) ?? (lon ? 'A working app that passes every check of every feature in the rubric.|||Ứng dụng chạy đúng, đạt mọi kiểm của từng chức năng trong thang điểm.' : null),
    constraints: (de.rangBuoc || (lon ? de.banIn.yeuCauChung : []) || []).map(gop).join('\n'),
    examplesJson: viDu,
    hintsJson: (de.goiY || []).map(gop),
    starterCodeJson: khoiCode(de.khoiDau),
    solutionCodeJson: khoiCode(de.loiGiai),
    solutionExplanationHtml: giaiEn,
    solutionExplanationHtmlVi: giaiVi,
    diagramMermaid: de.soDo ?? null,
    referenceUrl: de.thamKhao ?? null,
    testsJson: tests,
    gradeKind: tests?.loai ?? de.loaiKiem ?? 'manual',
    kind,
    mistakesJson: (de.loiHayGap || []).map((x) => ({ loi: gop(x) })),
    ...(de.thuatNgu ? { glossaryJson: de.thuatNgu } : {}),
    ...(de.videoRef ? { videoRef: de.videoRef } : {}),
    ...(demoHtml ? { demoHtml } : {}),
    // SQL: câu SAI mẫu (lỗi hay gặp) — bộ xuất chạy thử, phải trượt ≥ 1 kiểm; KHÔNG ghi vào JSON
    ...(de.saiMau ? { __saiMau: de.saiMau } : {}),
  };
}

// ─── kiểm trường (khớp luật của codelab-seed-authored.mjs + luật bộ luyện) ───
function kiemTruong(ex) {
  const loi = [];
  for (const t of ['title', 'problemHtml', 'solutionExplanationHtml']) if (!String(ex[t] ?? '').trim()) loi.push(`thiếu ${t}`);
  if (!['EASY', 'MEDIUM', 'HARD'].includes(ex.difficulty)) loi.push(`độ khó lạ ${ex.difficulty}`);
  if (String(ex.problemHtml).length < 300) loi.push('problemHtml < 300 ký tự (seed từ chối)');
  if (!ex.examplesJson.length) loi.push('cần ≥ 1 ví dụ');
  if (ex.hintsJson.length < 2) loi.push('cần ≥ 2 gợi ý');
  if (!ex.starterCodeJson.length) loi.push('thiếu code khởi đầu');
  if (!ex.solutionCodeJson.length) loi.push('thiếu lời giải');
  if (ex.mistakesJson.length < 2) loi.push('cần ≥ 2 lỗi hay gặp');
  const tj = ex.testsJson;
  if (!tj?.loai) loi.push('thiếu bộ kiểm (tests.loai)');
  const n = tj ? (tj.kiem?.length ?? tj.cauHoi?.length ?? (tj.bang ? tj.bang.length : 0)) : 0;
  if (tj && n < 3 && !['choice', 'order', 'table'].includes(tj.loai)) loi.push('bộ kiểm cần ≥ 3 kiểm');
  if (tj?.thangDiem) {
    const ma = new Set(tj.thangDiem.map((t) => t.ma));
    for (const t of tj.thangDiem) if (!tj.kiem.some((k) => k.nhom === t.ma)) loi.push(`chức năng ${t.ma} không có kiểm nào`);
    for (const k of tj.kiem || []) if (k.nhom && !ma.has(k.nhom)) loi.push(`kiểm "${k.moTa}" gắn nhóm lạ ${k.nhom}`);
  }
  if (ex.kind !== 'practice' && !ex.problemHtmlVi) loi.push('đề lớn nên có bản Tiếng Việt (banIn {en, vi})');
  return loi;
}

const tepNguon = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
let soLoi = 0, soDe = 0;
for (const f of tepNguon) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  if (CHI && m.slug !== CHI) continue;
  if (`${m.slug}.mjs` !== f) { soLoi++; console.log(`✗ ${f}: slug "${m.slug}" không trùng tên tệp`); }
  const payload = {
    trackSlug: TRACK,
    moduleSlug: m.slug,
    lesson: { course: m.khoa, slug: m.baiHoc || m.slug },
    exercises: m.de.map((d) => xuat(d, m)),
  };
  // SQL (29/10/2026): `mongDoi` của mọi kiểm dựng bằng cách chạy LỜI GIẢI qua đúng máy chấm SQL (PGlite trong
  // Node — scripts/codelab-sql-node.mjs) + ví dụ trong đề lấy từ bảng mong đợi của kiểm mẫu đầu tiên.
  const loiSql = new Map();
  for (const ex of payload.exercises) {
    if (ex.testsJson?.loai !== 'sql') continue;
    const sqlNode = await import('./codelab-sql-node.mjs');
    const saiMau = ex.__saiMau;
    delete ex.__saiMau;
    loiSql.set(ex, await sqlNode.dienMongDoiSql(ex, saiMau));
    if (!ex.examplesJson.length) {
      const k = ex.testsJson.kiem.find((x) => !x.an && x.mongDoi?.cot);
      if (k) {
        const { soSanh } = await sqlNode.napMayCham();
        ex.examplesJson.push({
          input: gop(ex.testsJson.viDuVao ?? { en: 'The sample database of this task (schema above).', vi: 'CSDL mẫu của bài (lược đồ ở trên).' }),
          output: soSanh.bangChu(k.mongDoi, 8),
          explanation: gop({ en: `Expected result of check "${k.moTa}"${k.thuTu ? ' (row order matters)' : ' (row order does not matter)'}.`, vi: `Kết quả mong đợi của kiểm "${k.moTa}"${k.thuTu ? ' (đúng thứ tự dòng)' : ' (thứ tự dòng không quan trọng)'}.` }),
        });
      }
      const t = !k && ex.testsJson.kiem.find((x) => !x.an && (x.kiem === 'chay-duoc' || x.kiem === 'bi-chan'));
      if (t) {
        ex.examplesJson.push({
          input: gop({ en: `After your statement(s), the grader runs: ${t.thu}`, vi: `Sau (các) lệnh của bạn, máy chấm chạy: ${t.thu}` }),
          output: gop(t.kiem === 'chay-duoc' ? { en: 'Accepted (the statement succeeds).', vi: 'Chạy được (câu lệnh thành công).' } : { en: 'Rejected by a constraint (error).', vi: 'Bị ràng buộc chặn (báo lỗi).' }),
          explanation: gop({ en: `Check "${t.moTa}".`, vi: `Kiểm "${t.moTa}".` }),
        });
      }
    }
  }
  for (const ex of payload.exercises) {
    soDe++;
    const l = [...kiemTruong(ex), ...(loiSql.get(ex) ?? [])];
    if (l.length) { soLoi += l.length; console.log(`  ✗ [${m.slug}] "${ex.title}"`); for (const x of l) console.log(`      - ${x}`); }
    else console.log(`  ✓ [${m.slug}] ${ex.kind} ${ex.difficulty} "${ex.title}" — ${ex.testsJson.kiem?.length ?? '?'} kiểm${ex.demoHtml ? ` · demo ${(ex.demoHtml.length / 1024).toFixed(0)} KB` : ''}`);
  }
  const tep = path.join(THU_MUC, `${TRACK}__${m.slug}.json`);
  const moi = `${JSON.stringify(payload, null, 2)}\n`;
  if (!CHI_KIEM) fs.writeFileSync(tep, moi);
  else if (!fs.existsSync(tep) || fs.readFileSync(tep, 'utf8') !== moi) { soLoi++; console.log(`  ✗ ${path.relative(GOC, tep)} lệch nguồn — chạy không có --kho`); }
}
console.log(soLoi ? `\n✗ ${soLoi} lỗi · ${soDe} đề` : `\n✓ ${soDe} đề sạch${CHI_KIEM ? '' : ' — đã ghi JSON'}. Tiếp: npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track ${TRACK}`);
process.exit(soLoi ? 1 : 0);
void esc;
