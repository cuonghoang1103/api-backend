/**
 * cr-ghep-chuong.mjs — kiểm một chương khoá Content Creator trước khi ghép.
 *   node scripts/cr-ghep-chuong.mjs <file chương .mjs> [--cdn] [--fix] [--render <thư mục ảnh đã render>]
 * (--render mặc định: $CR_RENDER hoặc /tmp/cr-render — nơi _render-slides.mjs --out đã ghi <deck>/NNN.webp)
 * 1. import được, content là chuỗi, title ≤ 180, slug đúng dạng cr-NN-M-…, type hợp lệ
 * 2. đếm bài: N.0 DOCUMENT, 4 bài VIDEO, N.5 QUIZ 10 câu có explanation
 * 3. mọi ảnh slide được tham chiếu tồn tại trong <render>/<deck>/NNN.webp
 * 4. --cdn: GET từng ảnh trên CDN = 200 và content-length khớp file trên đĩa
 * 5. pitfall có <strong> đầu mà thiếu co-tieu-de → báo (sửa tự động bằng --fix)
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file = path.resolve(process.argv[2]);
const CDN = process.argv.includes('--cdn');
const FIX = process.argv.includes('--fix');
const rI = process.argv.indexOf('--render');
const RENDER = rI >= 0 ? process.argv[rI + 1] : (process.env.CR_RENDER || '/tmp/cr-render');
let bad = 0;
const err = (m) => { bad++; console.log('  ✗', m); };

if (FIX) {
  let s = fs.readFileSync(file, 'utf8');
  const n = (s.match(/<div class="pitfall"><p><strong>/g) || []).length;
  s = s.replace(/<div class="pitfall"><p><strong>/g, '<div class="pitfall co-tieu-de"><p><strong>');
  fs.writeFileSync(file, s);
  console.log(`  ~ pitfall → co-tieu-de: ${n}`);
}

const mod = (await import(pathToFileURL(file).href + '?t=' + Date.now())).default;
const ls = mod.lessons || [];
const m = path.basename(file).match(/^s(\d\d)-/);
const NN = m ? m[1] : '??';
console.log(`── ${path.basename(file)} · ${ls.length} bài · "${mod.title}"`);
if (!mod.title?.includes('|||')) err('section title thiếu |||');
const types = ls.map((l) => l.type);
if (ls[0]?.slug !== `cr-${NN}-0-slides` || ls[0]?.type !== 'DOCUMENT') err('bài đầu phải là cr-NN-0-slides DOCUMENT');
const last = ls[ls.length - 1];
if (last?.slug !== `cr-${NN}-5-quiz` || last?.type !== 'QUIZ') err('bài cuối phải là cr-NN-5-quiz QUIZ');
if (types.filter((t) => t === 'VIDEO').length !== 4) err(`số bài VIDEO = ${types.filter((t) => t === 'VIDEO').length} (cần 4)`);
const imgs = new Map();
for (const l of ls) {
  if (typeof l.content !== 'string') err(`${l.slug}: content không phải chuỗi`);
  if (!l.title?.includes('|||')) err(`${l.slug}: title thiếu |||`);
  if ((l.title || '').length > 180) err(`${l.slug}: title ${l.title.length} > 180`);
  if (!new RegExp(`^cr-${NN}-\\d-`).test(l.slug)) err(`${l.slug}: slug sai dạng`);
  if (l.isFreePreview !== true) err(`${l.slug}: thiếu isFreePreview:true`);
  if (l.video || l.videos) err(`${l.slug}: KHÔNG được tự thêm video (dùng file map)`);
  const c = l.content || '';
  const en = (c.match(/class="ml-en"/g) || []).length, vi = (c.match(/class="ml-vi"/g) || []).length;
  if (en !== vi || !en) err(`${l.slug}: ml-en ${en} / ml-vi ${vi}`);
  const pf = (c.match(/<div class="pitfall"><p><strong>/g) || []).length;
  if (pf) console.log(`  ! ${l.slug}: ${pf} pitfall có tiêu đề riêng nhưng thiếu co-tieu-de (chạy --fix)`);
  for (const mm of c.matchAll(/images\/academy\/CR\/(v\d+)\/(cr-[\w-]+)\/(\d{3})\.webp/g)) imgs.set(mm[0], { v: mm[1], deck: mm[2], n: mm[3] });
  if (l.type === 'VIDEO') {
    const slides = (c.match(/class="anh-slide"/g) || []).length;
    if (slides < 2) console.log(`  ! ${l.slug}: chỉ ${slides} ảnh slide (khuyên 2–4 mỗi ngôn ngữ)`);
    const lenVi = (c.split('class="ml-vi"')[1] || '').length;
    console.log(`  · ${l.slug}: ${c.length.toLocaleString('vi-VN')} ký tự (vi ≈ ${lenVi.toLocaleString('vi-VN')}), ${slides} ảnh`);
  }
  if (l.type === 'QUIZ') {
    const q = l.quiz?.questions || [];
    if (q.length < 8) err(`${l.slug}: ${q.length} câu`);
    const noEx = q.filter((x) => !x.explanation || !x.explanation.includes('|||')).length;
    if (noEx) err(`${l.slug}: ${noEx} câu thiếu explanation song ngữ`);
    const dist = [0, 0, 0, 0];
    q.forEach((x) => { dist[x.correctIndex] = (dist[x.correctIndex] || 0) + 1; });
    console.log(`  · quiz ${q.length} câu, phân bố đáp án A/B/C/D = ${dist.join('/')}`);
  }
}
const decks = new Set([...imgs.values()].map((x) => x.deck));
for (const [url, x] of imgs) {
  const local = path.join(RENDER, x.deck, `${x.n}.webp`);
  if (!fs.existsSync(local)) { err(`ảnh ${x.deck}/${x.n} không có trong ${RENDER}`); continue; }
  if (CDN) {
    const r = await fetch('https://media.cuongthai.com/' + url);
    const len = Number(r.headers.get('content-length'));
    const size = fs.statSync(local).size;
    if (r.status !== 200) err(`CDN ${x.deck}/${x.n} HTTP ${r.status}`);
    else if (len && len !== size) err(`CDN ${x.deck}/${x.n} ${len} B ≠ đĩa ${size} B (bản cũ trong cache?)`);
  }
}
for (const d of decks) {
  const dir = path.join(RENDER, d);
  const have = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).length : 0;
  const used = new Set([...imgs.values()].filter((x) => x.deck === d).map((x) => x.n)).size;
  console.log(`  · deck ${d}: ${have} ảnh render, ${used} ảnh được dùng${used < have ? ` — ${have - used} ảnh CHƯA được nhúng ở đâu` : ''}`);
}
console.log(bad ? `❌ ${bad} lỗi` : '✅ sạch');
process.exit(bad ? 1 : 0);
