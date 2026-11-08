/**
 * academy-slide-flm.mjs — SINH các chương "📑 Slide của trường" cho một môn Academy từ bản đồ slide
 * mà scripts/flm-tai-lieu.py dựng (ảnh đã nằm trên R2).
 *
 *   node scripts/academy-slide-flm.mjs --kho ~/Documents/FLM-nguon/_kho --ma CHI111
 *   node scripts/academy-slide-flm.mjs --kho ~/Documents/FLM-nguon/_kho --tatca
 *
 * Vào : <kho>/<MÃ>/slide-map.json   { ma, prefix, base, decks:[{key,file,chuong,ten,n,w,h,chu[]}] }
 * Ra  : content/academy/_slide-flm/<MÃ>.mjs   (mảng section; ghép vào môn lúc seed bằng
 *       scripts/lib/academy-muc0-flm.mjs — đứng ngay SAU Mục 0, TRƯỚC các chương cũ của web)
 *
 * Giai đoạn này CHỈ gắn slide (user chốt 09/11/2026: "chưa cần viết bài giảng, sau này nâng cấp
 * bổ sung bài giảng chi tiết sau"). Mỗi slide: ảnh + chữ nguyên văn trên slide (để tìm/đọc/chép).
 * Deck cùng thư mục trong zip của trường ⇒ cùng một chương; mỗi deck = một bài.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const KHO = (val('--kho') || '~/Documents/FLM-nguon/_kho').replace(/^~/, os.homedir());
const OUT = 'content/academy/_slide-flm';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Email/điện thoại trong chữ slide: che ở phần CHỮ (ảnh giữ nguyên như trường phát).
const che = (s) => String(s ?? '').replace(/\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}/g, '').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]').replace(/(?<!\d)(?:\+?84|0)(?:[\s.-]?\d){8,10}(?!\d)/g, '[sđt]');
const cat = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

export function dungSlide(map, spec) {
  const ma = map.ma;
  const lo = ma.toLowerCase();
  const nhom = [];
  for (const d of map.decks.filter((x) => x.n > 0)) {
    const k = d.chuong || '';
    if (!nhom.length || nhom.at(-1).chuong !== k) nhom.push({ chuong: k, decks: [] });
    nhom.at(-1).decks.push(d);
  }
  const tong = map.decks.reduce((a, d) => a + (d.n || 0), 0);
  return nhom.map((g, gi) => {
    const so = `S${gi + 1}`;
    const ten = g.chuong || (nhom.length === 1 ? 'Course slides' : `Part ${gi + 1}`);
    const tenVi = g.chuong || (nhom.length === 1 ? 'Slide môn học' : `Phần ${gi + 1}`);
    return {
      title: cat(`📑 ${so} · ${ten} — school slides|||📑 ${so} · ${tenVi} — slide của trường`, 250),
      description: `Official FLM slides of ${ma}, as the university distributes them (${g.decks.length} deck, ${g.decks.reduce((a, d) => a + d.n, 0)} slides).|||Slide chính thức của ${ma} trên FLM, đúng như trường phát (${g.decks.length} deck, ${g.decks.reduce((a, d) => a + d.n, 0)} slide).`,
      lessons: g.decks.map((d, di) => {
        const anh = Array.from({ length: d.n }, (_, i) => {
          const n = i + 1;
          const src = `${map.base}/${d.key}/${String(n).padStart(3, '0')}.webp`;
          const chu = d.chu && d.chu[i] ? che(d.chu[i]).trim() : '';
          const alt = cat(`${ma} · ${d.ten} · slide ${n}${chu ? ': ' + chu.split('\n')[0] : ''}`, 180);
          return `<div class="anh-slide"><img src="${src}" alt="${esc(alt)}" loading="lazy" width="${d.w || 1280}" height="${d.h || 720}" /><p class="chu-thich">Slide ${n}/${d.n}</p></div>` +
            (chu ? `\n<div class="trich-slide"><p class="nhan">Trên slide · On the slide</p><p>${esc(chu).replace(/\n/g, '<br>')}</p></div>` : '');
        }).join('\n');
        const dau = `<div class="ml-en"><span class="eyebrow">${esc(ma)} · ${so}.${di + 1} · school slides</span>\n<h2>${esc(d.ten)}</h2>\n<p class="lead">${d.n} slides, exactly as the university distributes them on FLM. A full lecture for this deck will be added later — for now, study the slides together with the session plan in Section 0 (lesson 0.5).</p></div>\n<div class="ml-vi"><span class="eyebrow">${esc(ma)} · ${so}.${di + 1} · slide của trường</span>\n<h2>${esc(d.ten)}</h2>\n<p class="lead">${d.n} slide, đúng như trường phát trên FLM. Bài giảng chi tiết cho deck này sẽ bổ sung sau — trước mắt học theo slide cùng kế hoạch buổi ở Mục 0 (bài 0.5).</p></div>\n<p class="nhan">Nguồn: FLM · tài liệu sinh viên · ${esc(d.file.split('/').pop())}</p>`;
        return {
          title: cat(`📑 ${so}.${di + 1} — ${d.ten} (${d.n} slides)|||📑 ${so}.${di + 1} — ${d.ten} (${d.n} slide)`, 250),
          slug: `${lo}-slide-flm-${d.key}`,
          type: 'DOCUMENT',
          isFreePreview: gi === 0 && di === 0,
          description: `${d.n} slide của trường.`,
          content: `${dau}\n${anh}`,
        };
      }),
    };
  });
}

async function main() {
  let ds;
  if (val('--ma')) ds = val('--ma').split(',');
  else if (has('--tatca')) ds = fs.readdirSync(KHO).filter((m) => fs.existsSync(path.join(KHO, m, 'slide-map.json')));
  else { console.error('cần --ma <MÃ> hoặc --tatca'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  for (const ma of ds.sort()) {
    const f = path.join(KHO, ma, 'slide-map.json');
    const fMon = `content/academy/${ma}.mjs`;
    if (!fs.existsSync(f) || !fs.existsSync(fMon)) { console.log(`  – ${ma}: thiếu slide-map hoặc file môn`); continue; }
    const map = JSON.parse(fs.readFileSync(f, 'utf8'));
    const spec = (await import(path.resolve(fMon))).default;
    const secs = dungSlide(map, spec);
    const slugCu = new Set((spec.sections || spec.course.sections || []).flatMap((s) => (s.lessons || []).map((l) => l.slug)));
    const trung = secs.flatMap((s) => s.lessons).filter((l) => slugCu.has(l.slug));
    if (trung.length) { console.log(`  ⛔ ${ma}: slug trùng bài cũ ${trung.map((l) => l.slug).join(',')}`); process.exitCode = 1; continue; }
    fs.writeFileSync(path.join(OUT, `${ma}.mjs`), `// SINH TỰ ĐỘNG bởi scripts/academy-slide-flm.mjs từ <kho>/${ma}/slide-map.json — ĐỪNG SỬA TAY.\n// Ảnh: ${map.base}/<deck>/NNN.webp. Ghép vào môn lúc seed: scripts/lib/academy-muc0-flm.mjs\nexport default ${JSON.stringify(secs, null, 1)};\n`);
    console.log(`  ✓ ${ma}: ${secs.length} chương · ${secs.reduce((a, s) => a + s.lessons.length, 0)} bài · ${map.decks.reduce((a, d) => a + (d.n || 0), 0)} slide`);
  }
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
