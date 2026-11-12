/**
 * Lập chỉ mục MỌI bài học công khai (Courses + Academy) từ production để gắn bước lộ trình (/roadmap) ↔ bài học.
 *   node scripts/roadmap-chi-muc-bai.mjs [--ra ~/Documents/roadmap-lam/chi-muc-bai.jsonl] [--goc https://cuongthai.com]
 * Mỗi dòng = một bài: khoá, chương, slug bài, tiêu đề EN/VI, loại (VIDEO/DOCUMENT/QUIZ…), có video thật chưa,
 * đề mục h2/h3 trong bài (để khớp theo nội dung, không chỉ tiêu đề), link nội bộ tới mô phỏng/lab.
 * Chỉ đọc API công khai — không cần khoá, không ghi gì lên máy chủ.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const GOC = arg('--goc', 'https://cuongthai.com');
const RA = arg('--ra', path.join(os.homedir(), 'Documents/roadmap-lam/chi-muc-bai.jsonl'));

const layJson = async (url, lan = 0) => {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'cuongthai-roadmap-index' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    if (lan < 3) { await new Promise((s) => setTimeout(s, 2000 * (lan + 1))); return layJson(url, lan + 1); }
    throw e;
  }
};
const tach = (s) => { const [en, vi] = String(s || '').split('|||'); return { en: (en || '').trim(), vi: (vi ?? en ?? '').trim() }; };
const tron = (h) => String(h || '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

function phanTich(html) {
  const h = String(html || '');
  // Ưu tiên phần tiếng Việt nếu bài song ngữ (div.ml-vi).
  const viIdx = h.indexOf('class="ml-vi"');
  const vi = viIdx >= 0 ? h.slice(viIdx) : h;
  const deMuc = [...vi.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => tron(m[1])).filter(Boolean).slice(0, 25);
  const noi = [...new Set([...h.matchAll(/href="(\/(?:simulation|algorithms|cpu-lab|net-lab|os-lab|code-lab|toc-do-mang)[^"#]*)"/g)].map((m) => m[1]))].slice(0, 10);
  const coMoPhong = /<iframe|data-mo-phong|class="[^"]*(?:mo-phong|sim-)/i.test(h) || noi.some((u) => !u.startsWith('/code-lab'));
  return { deMuc, noi, coMoPhong, doDai: tron(vi).length, mo: tron(vi).slice(0, 280) };
}

const ds = [
  ...(await layJson(`${GOC}/api/v1/courses?gon=1&size=1000`)).data.map((c) => ({ ...c, academy: false })),
  ...(await layJson(`${GOC}/api/v1/courses?academy=1&gon=1&size=1000`)).data.map((c) => ({ ...c, academy: true })),
];
console.log(`${ds.length} khoá`);
fs.mkdirSync(path.dirname(RA), { recursive: true });
const out = fs.createWriteStream(RA);
let so = 0, i = 0;
async function lam(c) {
  const d = (await layJson(`${GOC}/api/v1/courses/${encodeURIComponent(c.slug)}`)).data;
  const kt = tach(d.title);
  for (const s of d.sections || []) {
    const ct = tach(s.title);
    for (const l of s.lessons || []) {
      if (l.isPublished === false) continue;
      const t = tach(l.title);
      const p = phanTich(l.content);
      out.write(JSON.stringify({
        khoa: d.slug, khoaTen: kt.vi || kt.en, ma: d.courseCode || null, academy: c.academy,
        chuong: ct.vi || ct.en, bai: l.slug, id: l.id, en: t.en, vi: t.vi, loai: l.lessonType,
        video: !!(l.videoUrl || (l.videoTracks && Object.keys(l.videoTracks).length)),
        moTa: tron(tach(l.description).vi).slice(0, 300), ...p,
      }) + '\n');
      so++;
    }
  }
}
const hang = [...ds];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (hang.length) {
    const c = hang.shift();
    try { await lam(c); } catch (e) { console.error(`✗ ${c.slug}: ${e.message}`); }
    if (++i % 50 === 0) console.log(`  ${i}/${ds.length} khoá · ${so} bài`);
  }
}));
out.end();
console.log(`✓ ${so} bài ⇒ ${RA}`);
