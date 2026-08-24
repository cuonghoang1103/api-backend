#!/usr/bin/env node
/**
 * course-lang-check.mjs — bắt khối `ml-en` chứa văn xuôi tiếng Việt.
 *
 * VÌ SAO CẦN: course-content-check.mjs chỉ ĐẾM số khối ml-en/ml-vi cho khớp.
 * Nó không nhìn vào bên trong, nên một bài có ml-en toàn tiếng Việt vẫn qua
 * sạch — và người học chọn tiếng Anh nhận về tiếng Việt. Phát hiện 24/08/2026.
 *
 * CÁCH ĐO: đếm số ĐOẠN TEXT (giữa hai thẻ) trong khối ml-en, rồi tính tỷ lệ
 * đoạn có dấu tiếng Việt. Bỏ qua ba vùng mà tiếng Việt là HỢP LỆ:
 *   <pre>…</pre>              trích nguyên văn mã/comment tiếng Việt của kho
 *   <div class="out">…</div>  kết quả chạy thật
 *   <span class="lc-sub">…    phụ đề thẻ nguồn (quy ước sẵn có)
 * và bỏ qua nhãn hộp cố định (Bẫy —, Một câu.) vốn là quy ước xuyên khoá.
 *
 *   node scripts/course-lang-check.mjs                  # mọi khoá
 *   node scripts/course-lang-check.mjs <file.mjs> [...] # khoá cụ thể
 *   node scripts/course-lang-check.mjs --list           # liệt kê từng bài
 */
import { readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIAC = /[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ]/;
const LABELS = [/^Bẫy\b/, /^Một câu\.?$/, /^Đo:?$/, /^Bài học:?$/, /^Nguồn$/, /^Kiểm tra/];

const argv = process.argv.slice(2);
const list = argv.includes('--list');
const files = argv.filter(a => !a.startsWith('--'));

const enBlocks = (c) => {
  const out = []; const re = /<div class="ml-en">/g; let m;
  while ((m = re.exec(c))) {
    const s = m.index + m[0].length;
    const n = c.indexOf('<div class="ml-vi">', s);
    out.push(c.slice(s, n === -1 ? c.length : n));
  }
  return out;
};

const segments = (b) => b
  .replace(/<pre>[\s\S]*?<\/pre>/g, ' ')
  .replace(/<div class="out">[\s\S]*?<\/div>/g, ' ')
  .replace(/<span class="lc-sub">[\s\S]*?<\/span>/g, ' ')
  .split(/<[^>]+>/)
  .map(t => t.replace(/&[a-z]+;|&#\d+;/g, ' ').trim())
  .filter(t => t.length > 2 && !LABELS.some(re => re.test(t)));

const targets = files.length
  ? files
  : readdirSync('content/courses').filter(f => f.endsWith('.mjs')).map(f => join('content/courses', f));

const rows = [];
for (const file of targets) {
  const course = (await import(pathToFileURL(file).href)).default;
  if (!course?.sections) continue;
  const hits = [];
  let total = 0;
  for (const sec of course.sections) for (const l of sec.lessons ?? []) {
    total++;
    let vi = 0, all = 0, first = '';
    for (const b of enBlocks(l.content ?? '')) {
      for (const s of segments(b)) {
        all++;
        if (DIAC.test(s)) { vi++; if (!first) first = s.slice(0, 90); }
      }
    }
    if (vi > 0) hits.push({ slug: l.slug, vi, all, pct: all ? Math.round(vi / all * 100) : 0, first });
  }
  rows.push({ name: basename(file, '.mjs'), total, hits });
}

rows.sort((a, b) => {
  const sev = r => r.hits.filter(h => h.pct >= 20).length;
  return sev(b) - sev(a);
});

console.log('khoá'.padEnd(19) + 'bài'.padStart(5) + '  nặng≥20%'.padStart(11) + '  nhẹ<20%'.padStart(10) + '  sạch'.padStart(7));
let gHeavy = 0, gLight = 0, gTotal = 0;
for (const r of rows) {
  const heavy = r.hits.filter(h => h.pct >= 20).length;
  const light = r.hits.length - heavy;
  gHeavy += heavy; gLight += light; gTotal += r.total;
  const mark = heavy ? '❌' : light ? '⚠️ ' : '✅';
  console.log(`${mark} ${r.name.padEnd(17)}${String(r.total).padStart(5)}${String(heavy).padStart(11)}${String(light).padStart(10)}${String(r.total - r.hits.length).padStart(7)}`);
  if (list) for (const h of r.hits.filter(x => x.pct >= 20).sort((a, b) => b.pct - a.pct)) {
    console.log(`     ${String(h.pct).padStart(3)}%  ${h.slug.padEnd(26)} “${h.first}”`);
  }
}
console.log('\n' + '─'.repeat(58));
console.log(`Nặng (≥20% đoạn text là tiếng Việt): ${gHeavy} bài`);
console.log(`Nhẹ  (<20%, thường là nhãn/tham chiếu): ${gLight} bài`);
console.log(`Tổng số bài: ${gTotal}`);
process.exit(gHeavy > 0 ? 1 : 0);
