/**
 * git-ghep-chuong.mjs — kiểm một chương khoá "Git & GitHub" trước khi ghép.
 *   node scripts/git-ghep-chuong.mjs <file chương .mjs> [--render <thư mục ảnh đã render>] [--cdn] [--moi]
 *
 * (--render mặc định: $GIT_RENDER hoặc /tmp/git-render — nơi _render-slides.mjs --out đã ghi git-NN/NNN.webp)
 * (--moi: chương MỚI, chưa có trong git HEAD ⇒ bỏ qua phép so với bản cũ)
 *
 * 1. import được; content là chuỗi; title ≤ 180 ký tự và có |||; slug dạng git-N-M-…
 * 2. bài đầu = git-N-0-slides DOCUMENT; có đúng MỘT bài QUIZ ở cuối, 10 câu, câu nào cũng có explanation,
 *    options 4 phương án, đáp án đúng rải ≥ 3 vị trí khác nhau
 * 3. mọi bài LESSON có: slide() nhúng ở cả hai khối ngôn ngữ, "🧪" (thực hành), "🗂" (thuật ngữ), "📌" (tóm tắt)
 * 4. KHÔNG CẮT: so với bản trong git HEAD — mọi slug cũ còn nguyên, tiêu đề chương (section) không đổi
 *    (seeder neo chương bằng tiêu đề khi bài đầu là bài mới!), và độ dài content từng bài cũ KHÔNG giảm
 * 5. mọi ảnh slide được tham chiếu có trong <render>/<deck>/NNN.webp; --cdn: GET trên CDN = 200
 * 6. pitfall mở bằng <strong> mà thiếu co-tieu-de → cảnh báo (site tự chèn nhãn "⚠️ Bẫy thường gặp")
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const file = path.resolve(process.argv[2] || '');
if (!fs.existsSync(file)) { console.error('cần đường dẫn file chương'); process.exit(2); }
const CDN = process.argv.includes('--cdn');
const MOI = process.argv.includes('--moi');
const rI = process.argv.indexOf('--render');
const RENDER = rI >= 0 ? process.argv[rI + 1] : (process.env.GIT_RENDER || '/tmp/git-render');
let bad = 0, warn = 0;
const err = (m) => { bad++; console.log('  ✗', m); };
const wn = (m) => { warn++; console.log('  ⚠', m); };

const mod = (await import(pathToFileURL(file).href + '?t=' + Date.now())).default;
const ls = mod.lessons || [];
console.log(`── ${path.basename(file)} · ${ls.length} bài · "${mod.title}"`);
if (!mod.title?.includes('|||')) err('section title thiếu |||');

// Mục 0 được có tối đa 2 bài "Bắt đầu tại đây" (slug …-bat-dau-…) đứng TRƯỚC bài slide — trang đầu tiên người mới bấm vào.
const i0 = ls.findIndex((l) => !/^git-0-\d+-bat-dau/.test(l.slug || ''));
if (i0 > 2) err('Mục 0: tối đa 2 bài bat-dau trước bài slide');
const m0 = ls[i0]?.slug?.match(/^git-(\d+)-0-slides$/);
if (!m0 || ls[i0].type !== 'DOCUMENT') err('bài đầu phải là git-N-0-slides, type DOCUMENT');
const N = m0 ? m0[1] : '?';
const quizzes = ls.filter((l) => l.type === 'QUIZ');
if (N === '0') { if (quizzes.length) err('Mục 0 không có quiz'); }
else if (quizzes.length !== 1 || ls[ls.length - 1].type !== 'QUIZ') err('phải có đúng MỘT bài QUIZ và nằm cuối chương');

const slugs = new Set();
for (const l of ls) {
  const tag = l.slug || '(không slug)';
  if (!/^git-\d+-\d+-[a-z0-9-]+$/.test(l.slug || '')) err(`${tag}: slug sai dạng`);
  else if (!l.slug.startsWith(`git-${N}-`)) err(`${tag}: slug không thuộc chương ${N}`);
  if (slugs.has(l.slug)) err(`${tag}: slug trùng`); slugs.add(l.slug);
  if (typeof l.content !== 'string') { err(`${tag}: content không phải chuỗi`); continue; }
  if (!l.title?.includes('|||')) err(`${tag}: title thiếu |||`);
  if ((l.title || '').length > 180) err(`${tag}: title ${l.title.length} > 180 ký tự`);
  if (/\$\{|`/.test(l.content)) err(`${tag}: content còn \${ hoặc backtick trần (thiếu thoát)`);
  const en = l.content.indexOf('<div class="ml-en">'), vi = l.content.indexOf('<div class="ml-vi">');
  if (en < 0 || vi < 0) err(`${tag}: thiếu khối .ml-en hoặc .ml-vi`);
  if (l.type === 'LESSON') {
    const E = l.content.slice(en, vi), V = l.content.slice(vi);
    for (const [nm, part] of [['EN', E], ['VI', V]]) {
      if (!/anh-slide/.test(part)) err(`${tag}: khối ${nm} chưa nhúng slide nào`);
      if (!part.includes('🧪')) err(`${tag}: khối ${nm} thiếu mục 🧪 thực hành`);
      if (!part.includes('🗂')) err(`${tag}: khối ${nm} thiếu mục 🗂 thuật ngữ`);
      if (!part.includes('📌')) err(`${tag}: khối ${nm} thiếu mục 📌 tóm tắt`);
    }
  }
  const pf = (l.content.match(/<div class="pitfall"><p><strong>/g) || []).length;
  if (pf) wn(`${tag}: ${pf} pitfall mở bằng <strong> thiếu co-tieu-de`);
  if (l.type === 'QUIZ') {
    const qs = l.quiz?.questions || [];
    const can = /cuoi-khoa/.test(l.slug) && N !== '13' ? 20 : 10;
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
  }
}

/* 4. không cắt — so với bản trong git HEAD */
if (!MOI) {
  const rel = path.relative(process.cwd(), file);
  let old;
  try {
    const src = execFileSync('git', ['show', `HEAD:${rel}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
    const tmp = path.join(path.dirname(file), `.__cu-${path.basename(file)}`);
    fs.writeFileSync(tmp, src);
    try { old = (await import(pathToFileURL(tmp).href + '?t=' + Date.now())).default; } finally { fs.unlinkSync(tmp); }
  } catch (e) { err(`không đọc được bản HEAD để so (${String(e.message).split('\n')[0]}) — chương mới thì thêm --moi`); }
  if (old) {
    if (old.title !== mod.title) err(`tiêu đề chương ĐỔI so với HEAD — seeder sẽ tạo CHƯƠNG MỚI:\n      cũ: ${old.title}\n      mới: ${mod.title}`);
    const now = Object.fromEntries(ls.map((l) => [l.slug, l]));
    for (const o of old.lessons) {
      const n = now[o.slug];
      if (!n) { err(`slug cũ BIẾN MẤT: ${o.slug} (mất tiến độ người học + video)`); continue; }
      if (o.type !== 'QUIZ' && n.content.length < o.content.length) err(`${o.slug}: content NGẮN đi ${o.content.length} → ${n.content.length} (chỉ được thêm, không cắt)`);
      else if (o.type !== 'QUIZ') console.log(`  · ${o.slug}: ${o.content.length} → ${n.content.length} (+${n.content.length - o.content.length})`);
    }
  }
}

/* 5. ảnh slide */
const refs = new Set();
for (const l of ls) for (const m of l.content.matchAll(/images\/academy\/GIT\/(v\d+)\/(git-\d\d)\/(\d{3})\.webp/g)) refs.add(m[0]);
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
