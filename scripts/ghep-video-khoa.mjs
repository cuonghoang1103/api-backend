/**
 * ghep-video-khoa.mjs — ghép kết quả agent tìm video (TSV) vào content/course-videos/<khoá>.mjs.
 *
 *   node scripts/ghep-video-khoa.mjs --course docker --tsv a.tsv [--tsv b.tsv] [--write]
 *
 * TSV: slug<TAB>MOI|THAY|GIU|TRONG<TAB>videoId<TAB>credit<TAB>lý do
 * Không --write ⇒ chỉ kiểm + in thống kê. DỪNG, KHÔNG GHI gì khi:
 *   slug không có trong khoá · slug là bài QUIZ · slug lặp giữa các dòng · id không đúng 11 ký tự [A-Za-z0-9_-]
 *   · một id dùng cho hai bài · credit thiếu " — " · GIU mà id khác bản đang có · MOI mà bài đã có video
 * File ra: mọi bài không-quiz theo ĐÚNG thứ tự khoá, nhóm theo chương; bài chưa có video (TRONG hoặc thiếu) bị bỏ
 * và được liệt kê. Mục cũ không có dòng TSV nào ⇒ giữ nguyên. Phần chú thích đầu file cũ được giữ.
 * (Bộ kiểm tự thử đường SAI: --tu-thu chạy một TSV hỏng và yêu cầu mình phải từ chối.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const COURSE = val('--course');
const TSVS = args.flatMap((a, i) => (a === '--tsv' ? [args[i + 1]] : []));
const WRITE = args.includes('--write');
if (!COURSE) { console.error('cần --course <slug>'); process.exit(2); }

const spec = (await import(pathToFileURL(path.resolve(`content/courses/${COURSE}.mjs`)).href)).default;
const vfile = path.resolve(`content/course-videos/${COURSE}.mjs`);
const cur = fs.existsSync(vfile) ? (await import(pathToFileURL(vfile).href + '?t=' + Date.now())).default : { lessons: {} };

const order = []; // { slug, sec }
const quiz = new Set();
for (const s of spec.sections) for (const l of s.lessons) {
  if (l.type === 'QUIZ') quiz.add(l.slug); else order.push({ slug: l.slug, sec: s.title.split('|||').pop() });
}
const known = new Set(order.map((o) => o.slug));

export function kiem(rows, base) {
  const errs = [];
  const out = { ...base };
  const seen = new Set();
  for (const [n, r] of rows.entries()) {
    const [slug, kind, id, credit] = r;
    const at = `dòng ${n + 1} (${slug})`;
    if (quiz.has(slug)) { errs.push(`${at}: bài QUIZ không gắn video`); continue; }
    if (!known.has(slug)) { errs.push(`${at}: slug không có trong khoá`); continue; }
    if (seen.has(slug)) { errs.push(`${at}: slug lặp`); continue; }
    seen.add(slug);
    if (!['MOI', 'THAY', 'GIU', 'TRONG'].includes(kind)) { errs.push(`${at}: loại lạ "${kind}"`); continue; }
    if (kind === 'TRONG') { delete out[slug]; continue; }
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) { errs.push(`${at}: id sai dạng "${id}"`); continue; }
    if (!credit || !credit.includes(' — ')) { errs.push(`${at}: credit thiếu " — "`); continue; }
    if (kind === 'GIU' && base[slug]?.yt !== id) errs.push(`${at}: GIU nhưng id ${id} khác bản đang có ${base[slug]?.yt}`);
    if (kind === 'MOI' && base[slug]) errs.push(`${at}: MOI nhưng bài đã có video ${base[slug].yt} (dùng THAY)`);
    out[slug] = { yt: id, credit };
  }
  const byId = {};
  for (const [s, v] of Object.entries(out)) (byId[v.yt] ||= []).push(s);
  for (const [id, ss] of Object.entries(byId)) if (ss.length > 1) errs.push(`id ${id} dùng cho ${ss.length} bài: ${ss.join(', ')}`);
  return { errs, out };
}

if (args.includes('--tu-thu')) {
  const s0 = order[0].slug, s1 = order[1].slug;
  const bad = [[s0, 'THAY', 'aaaaaaaaaaa', 'X — Y'], [s1, 'THAY', 'aaaaaaaaaaa', 'X — Y'], ['khong-co', 'MOI', 'bbbbbbbbbbb', 'X — Y'], [s0, 'THAY', 'ngan', 'thieu']];
  const { errs } = kiem(bad, {});
  if (errs.length < 3) { console.error('✗ bộ kiểm KHÔNG bắt được TSV hỏng:', errs); process.exit(2); }
  console.log(`✓ tự thử: bắt được ${errs.length} lỗi trong TSV hỏng`);
  process.exit(0);
}

const rows = TSVS.flatMap((f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.split('\t').map((x) => x.trim())));
const { errs, out } = kiem(rows, cur.lessons || {});
const stat = rows.reduce((a, r) => ((a[r[1]] = (a[r[1]] || 0) + 1), a), {});
console.log(`TSV: ${rows.length} dòng`, stat);
const missing = order.filter((o) => !out[o.slug]).map((o) => o.slug);
const orphan = Object.keys(cur.lessons || {}).filter((s) => !known.has(s));
if (orphan.length) console.log(`⚠ mục mồ côi trong file cũ (bị bỏ khi ghi): ${orphan.join(', ')}`);
console.log(`bài không-quiz: ${order.length} · có video: ${order.length - missing.length} · thiếu: ${missing.length}${missing.length ? '\n  ' + missing.join('\n  ') : ''}`);
if (errs.length) { console.log(`✗ ${errs.length} lỗi — KHÔNG ghi:\n  ` + errs.join('\n  ')); process.exit(1); }
if (!WRITE) { console.log('✓ sạch (chạy lại với --write để ghi)'); process.exit(0); }

const old = fs.existsSync(vfile) ? fs.readFileSync(vfile, 'utf8') : '';
const head = old.slice(0, old.indexOf('export default')) || `/** Curated YouTube track for the "${COURSE}" course. */\n`;
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
let body = `export default {\n  courseSlug: ${q(cur.courseSlug || COURSE)},\n  defaultVideoTrack: ${q(cur.defaultVideoTrack || 'YT')},\n  lessons: {\n`;
let lastSec = null;
for (const o of order) {
  if (!out[o.slug]) continue;
  if (o.sec !== lastSec) { body += `${lastSec === null ? '' : '\n'}    /* ── ${o.sec} ── */\n`; lastSec = o.sec; }
  body += `    ${q(o.slug)}: { yt: ${q(out[o.slug].yt)}, credit: ${JSON.stringify(out[o.slug].credit)} },\n`;
}
body += '  },\n};\n';
fs.writeFileSync(vfile, head + body);
console.log(`✓ đã ghi ${vfile}`);
