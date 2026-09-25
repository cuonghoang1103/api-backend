/**
 * rx-ghep-chuong.mjs — kiểm một chương khoá "React" trước khi ghép (chép từ ga-ghep-chuong.mjs, 25/09/2026).
 *   node scripts/rx-ghep-chuong.mjs <file chương .mjs> [--render <thư mục ảnh đã render>] [--cdn] [--base <git ref>]
 *
 * (--render mặc định: $RX_RENDER hoặc /tmp/rx-render — nơi _render-slides.mjs --out đã ghi rx-NN/NNN.webp)
 * (--base mặc định: $RX_BASE hoặc origin/main — bản react.mjs dùng làm MỐC "khung cũ")
 *
 * Khác ga-ghep-chuong: khoá React bắt đầu từ KHUNG (content/courses/react.mjs sinh bằng khung('rx', …)), nên phép
 * "KHÔNG CẮT" so với CHƯƠNG CÙNG SỐ trong react.mjs của --base, không so với file chương trong HEAD:
 *   · mọi slug bài của chương đó trong khung còn nguyên, type giữ nguyên (LESSON)
 *   · tiêu đề chương KHÔNG đổi (seeder neo chương bằng slug bài ĐẦU, rồi mới tới tiêu đề — bài đầu là bài mới
 *     rx-N-0-slides ⇒ đổi tiêu đề là seeder tạo CHƯƠNG MỚI). Ngoại lệ an toàn: bài đầu chương là một slug CŨ ⇒ cảnh báo.
 *   · content bài cũ không ngắn đi
 *   Chương chưa có trong khung (Ch11–14 thêm mới) ⇒ bỏ qua phép so, in "chương mới".
 *
 * 1. import được; content là chuỗi; title ≤ 180 ký tự và có |||; slug dạng rx-N-M-…
 * 2. bài slide rx-N-0-slides DOCUMENT trong 3 bài đầu; đứng trước nó chỉ được là bài "bat-dau" của Mục 0 hoặc
 *    một slug cũ của khung (neo chương); đúng MỘT bài QUIZ ở cuối, 10 câu (slug có "cuoi-khoa": 20 câu),
 *    explanation song ngữ, 4 phương án, đáp án rải ≥ 3 vị trí, không vị trí nào quá 40%
 * 3. mọi bài dạy (không QUIZ/DOCUMENT) có ở CẢ HAI khối: ≥ 3 slide, 🧪, 🗂, 📌, và callout FER202
 * 3b. cả chương: có mục "🛠" (tự gõ tiếp dự án) ở cả hai khối, có "phỏng vấn"/"interview" (câu hỏi phỏng vấn)
 * 4. KHÔNG CẮT — như trên
 * 4b. bài N.0 liệt kê ĐỦ mọi slide đã render của deck rx-NN
 * 5. mọi ảnh slide được tham chiếu có trong <render>/<deck>/NNN.webp; --cdn: GET trên CDN = 200
 * 6. pitfall mở bằng <strong> mà thiếu co-tieu-de → cảnh báo
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const file = path.resolve(process.argv[2] || '');
if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { console.error('cần đường dẫn file chương'); process.exit(2); }
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const CDN = process.argv.includes('--cdn');
const RENDER = arg('--render', process.env.RX_RENDER || '/tmp/rx-render');
const BASE = arg('--base', process.env.RX_BASE || 'origin/main');
let bad = 0, warn = 0;
const err = (m) => { bad++; console.log('  ✗', m); };
const wn = (m) => { warn++; console.log('  ⚠', m); };

const mod = (await import(pathToFileURL(file).href + '?t=' + Date.now())).default;
const ls = mod.lessons || [];
console.log(`── ${path.basename(file)} · ${ls.length} bài · "${mod.title}"`);
if (!mod.title?.includes('|||')) err('section title thiếu |||');

/* Khung cũ: react.mjs ở --base, chương cùng số (nhận ra bằng tiền tố slug rx-N-). */
const i0 = ls.findIndex((l) => /^rx-\d+-0-slides$/.test(l.slug || ''));
const m0 = ls[i0]?.slug?.match(/^rx-(\d+)-0-slides$/);
const N = m0 ? m0[1] : (ls[0]?.slug?.match(/^rx-(\d+)-/) || [])[1] || '?';
let old = null;
try {
  const src = execFileSync('git', ['show', `${BASE}:content/courses/react.mjs`], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const tmp = path.resolve('content/courses', `.__cu-react-${process.pid}.mjs`);
  fs.writeFileSync(tmp, src);
  try {
    const all = (await import(pathToFileURL(tmp).href + '?t=' + Date.now())).default;
    old = (all.sections || []).find((s) => (s.lessons || []).some((l) => (l.slug || '').startsWith(`rx-${N}-`))) || null;
  } finally { fs.unlinkSync(tmp); }
} catch (e) { err(`không đọc được content/courses/react.mjs ở ${BASE} (${String(e.message).split('\n')[0]})`); }
const oldSlugs = new Set((old?.lessons || []).map((l) => l.slug));

if (i0 < 0) err('không thấy bài rx-N-0-slides');
else if (i0 > 2) err('bài slide phải nằm trong 3 bài đầu chương');
else ls.slice(0, i0).forEach((l, k) => {
  const ok = /^rx-0-\d+-bat-dau/.test(l.slug) || (k === 0 && oldSlugs.has(l.slug));
  if (!ok) err(`${l.slug}: bài đứng trước bài slide không hợp lệ (chỉ bài "bat-dau" của Mục 0, hoặc MỘT slug cũ để neo chương)`);
});
if (m0 && ls[i0].type !== 'DOCUMENT') err('bài rx-N-0-slides phải là type DOCUMENT');
const quizzes = ls.filter((l) => l.type === 'QUIZ');
if (quizzes.length !== 1 || ls[ls.length - 1]?.type !== 'QUIZ') err('phải có đúng MỘT bài QUIZ và nằm cuối chương');

const slugs = new Set();
let du = { EN: false, VI: false }, pv = false;
for (const l of ls) {
  const tag = l.slug || '(không slug)';
  if (!/^rx-\d+-\d+-[a-z0-9-]+$/.test(l.slug || '')) err(`${tag}: slug sai dạng`);
  else if (!l.slug.startsWith(`rx-${N}-`)) err(`${tag}: slug không thuộc chương ${N}`);
  if (slugs.has(l.slug)) err(`${tag}: slug trùng`); slugs.add(l.slug);
  if (typeof l.content !== 'string') { err(`${tag}: content không phải chuỗi`); continue; }
  if (!l.title?.includes('|||')) err(`${tag}: title thiếu |||`);
  if ((l.title || '').length > 180) err(`${tag}: title ${l.title.length} > 180 ký tự`);
  if (/\$\{|`/.test(l.content)) err(`${tag}: content còn \${ hoặc backtick trần (thiếu thoát)`);
  const en = l.content.indexOf('<div class="ml-en">'), vi = l.content.indexOf('<div class="ml-vi">');
  if (en < 0 || vi < 0) err(`${tag}: thiếu khối .ml-en hoặc .ml-vi`);
  const E = l.content.slice(en, vi), V = l.content.slice(vi);
  if (E.includes('🛠')) du.EN = true;
  if (V.includes('🛠')) du.VI = true;
  if (/phỏng vấn/i.test(V) && /interview/i.test(E)) pv = true;
  if (l.type !== 'QUIZ' && l.type !== 'DOCUMENT') {
    for (const [nm, part] of [['EN', E], ['VI', V]]) {
      const ns = (part.match(/anh-slide/g) || []).length;
      if (ns < 3) err(`${tag}: khối ${nm} mới nhúng ${ns} slide (cần ≥ 3)`);
      if (!part.includes('<h3>🧪')) err(`${tag}: khối ${nm} thiếu mục 🧪 thực hành`);
      if (!part.includes('<h3>🗂')) err(`${tag}: khối ${nm} thiếu mục 🗂 thuật ngữ`);
      if (!part.includes('<h3>📌')) err(`${tag}: khối ${nm} thiếu mục 📌 tóm tắt`);
      if (!part.includes('FER202')) err(`${tag}: khối ${nm} thiếu callout "Ở FER202 … — đi làm …" (chữ FER202)`);
    }
  }
  const pf = (l.content.match(/<div class="pitfall"><p><strong>/g) || []).length;
  if (pf) wn(`${tag}: ${pf} pitfall mở bằng <strong> thiếu co-tieu-de`);
  if (l.type === 'QUIZ') {
    const qs = l.quiz?.questions || [];
    const can = /cuoi-khoa/.test(l.slug) ? 20 : 10;
    if (qs.length !== can) err(`${tag}: quiz có ${qs.length} câu (cần ${can})`);
    qs.forEach((q, i) => {
      if (!q.explanation || !q.explanation.includes('|||')) err(`${tag} câu ${i + 1}: thiếu explanation song ngữ`);
      if (!q.question?.includes('|||')) err(`${tag} câu ${i + 1}: question thiếu |||`);
      if ((q.options || []).length !== 4) err(`${tag} câu ${i + 1}: cần 4 phương án`);
      if (!(q.correctIndex >= 0 && q.correctIndex < (q.options || []).length)) err(`${tag} câu ${i + 1}: correctIndex sai`);
    });
    const dist = [0, 0, 0, 0]; qs.forEach((q) => dist[q.correctIndex]++);
    console.log(`  · phân bố đáp án A/B/C/D: ${dist.join('/')}`);
    if (dist.filter((x) => x > 0).length < 3 || Math.max(...dist) > Math.ceil(qs.length * 0.4)) err(`${tag}: đáp án dồn một chỗ (${dist.join('/')})`);
    if (can === 20 && dist.some((x) => x !== 5)) err(`${tag}: bài thi cuối khoá cần đáp án 5/5/5/5 (đang ${dist.join('/')})`);
    if (can === 20 && l.quiz?.timeLimitSeconds !== 1800) err(`${tag}: bài thi cuối khoá cần timeLimitSeconds 1800`);
  }
}
if (!du.EN || !du.VI) err(`chương thiếu mục "🛠 Tự gõ tiếp dự án" ở khối ${!du.EN ? 'EN' : ''}${!du.EN && !du.VI ? '+' : ''}${!du.VI ? 'VI' : ''}`);
if (!pv) err('chương chưa có chỗ nào nói tới câu hỏi phỏng vấn (EN "interview" + VI "phỏng vấn")');

/* 4. không cắt — so với chương cùng số trong khung ở --base */
if (!old) console.log(`  · chương ${N} chưa có trong khung ở ${BASE} ⇒ chương MỚI, bỏ qua phép so`);
else {
  if (old.title !== mod.title) {
    if (oldSlugs.has(ls[0]?.slug)) wn(`tiêu đề chương đổi nhưng bài đầu (${ls[0].slug}) là bài cũ ⇒ seeder neo bằng slug, an toàn`);
    else err(`tiêu đề chương ĐỔI so với khung — seeder sẽ tạo CHƯƠNG MỚI:\n      cũ: ${old.title}\n      mới: ${mod.title}`);
  }
  const now = Object.fromEntries(ls.map((l) => [l.slug, l]));
  for (const o of old.lessons) {
    const n = now[o.slug];
    if (!n) { err(`slug cũ BIẾN MẤT: ${o.slug} (mất tiến độ người học)`); continue; }
    if (n.type !== o.type) err(`${o.slug}: type ĐỔI ${o.type} → ${n.type} (giữ nguyên type bài cũ)`);
    if (o.type !== 'QUIZ' && n.content.length < o.content.length) err(`${o.slug}: content NGẮN đi ${o.content.length} → ${n.content.length}`);
    else if (o.type !== 'QUIZ') console.log(`  · ${o.slug}: ${o.content.length} → ${n.content.length} (+${n.content.length - o.content.length})`);
  }
}

/* 4b. bài N.0 phải liệt kê ĐỦ mọi slide đã render của deck */
if (ls[i0]?.type === 'DOCUMENT') {
  const deck = `rx-${String(N).padStart(2, '0')}`;
  const dir = path.join(RENDER, deck);
  const have = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d{3}\.webp$/.test(f)).length : 0;
  const inGal = new Set([...ls[i0].content.matchAll(new RegExp(`${deck}/(\\d{3})\\.webp`, 'g'))].map((m) => m[1])).size;
  if (!have) err(`chưa render deck ${deck} vào ${dir}`);
  else if (inGal !== have) err(`bài N.0 liệt kê ${inGal} slide nhưng deck ${deck} có ${have}`);
  else console.log(`  · N.0 liệt kê đủ ${have} slide`);
}

/* 5. ảnh slide */
const refs = new Set();
for (const l of ls) for (const m of (l.content || '').matchAll(/images\/academy\/RX\/(v\d+)\/(rx-\d\d)\/(\d{3})\.webp/g)) refs.add(m[0]);
let miss = 0;
for (const r of refs) {
  const [, , , , deck, nnn] = r.split('/');
  const fp = path.join(RENDER, deck, nnn);
  if (!fs.existsSync(fp)) { miss++; err(`ảnh chưa render: ${fp}`); }
}
console.log(`  · ${refs.size} ảnh slide được tham chiếu${miss ? '' : ', đủ file trong ' + RENDER}`);
if (CDN) {
  for (const r of refs) {
    const url = `https://media.cuongthai.com/${r}`;
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status !== 200) err(`CDN ${res.status}: ${url}`);
  }
  console.log('  · CDN đã kiểm');
}

console.log(bad ? `✗ ${bad} lỗi, ${warn} cảnh báo` : `✓ sạch (${warn} cảnh báo)`);
process.exit(bad ? 1 : 0);
