/**
 * academy-ra-soat.mjs — RÀ SOÁT TOÀN BỘ nội dung Academy trước khi deploy.
 *
 *   node scripts/academy-ra-soat.mjs
 *
 * Nạp MỌI spec trong content/academy/*.mjs (bỏ file _*) rồi soi giá trị RUNTIME
 * — không grep văn bản, vì phần lớn tiêu đề được dựng qua helper doc()/quiz()
 * nên grep theo tên trường bỏ sót gần hết (đo thật: grep thấy 12/853 ca).
 *
 * Bắt được (đo 20/09/2026 trên 575 môn):
 *  - thực thể HTML thô trong `title` → in ra nguyên chữ "&amp;" cho sinh viên
 *  - khối <pre><code> thiếu `language-`
 *  - mermaid SAI dạng: chỉ `<pre><code class="language-mermaid">` mới được vẽ
 *  - bài rỗng · slug trùng · title>255 · shortDescription>500 · mục thiếu title
 *  - "undefined" / "[object Object]" trong nội dung → ⚠️ HAY BÁO ĐỘNG GIẢ,
 *    phải đọc ngữ cảnh: "f(a) is undefined" và cảnh báo quên JSON.stringify
 *    đều là nội dung dạy THẬT.
 *
 * Ghi danh sách ảnh ra /tmp/anh-academy.txt để kiểm CDN (xem cuối file).
 * ⚠️ Kiểm ảnh đừng chạy quá 16 luồng song song — trên 24 luồng có vài ca báo
 * ERR giả, thử lại từng cái đều 200.
 */
import fs from 'node:fs';
import path from 'node:path';
const dir = 'content/academy';
const RE_ENT = /&(amp|lt|gt|quot|#39|nbsp);/;
const loi = { entTitle: [], codeNoLang: [], mermaidSai: [], rong: [], titleDai: [], slugDai: [], shortDai: [], dupSlug: [], undef: [], objObj: [], secKhongTitle: [] };
const anhURL = new Map();   // url -> [môn]
let soMon = 0, soBai = 0, nap = 0;

for (const f of fs.readdirSync(dir).sort()) {
  if (!f.endsWith('.mjs') || f.startsWith('_')) continue;
  let m;
  try { m = await import(path.resolve(dir, f)); } catch (e) { loi.rong.push(f + ' KHÔNG NẠP ĐƯỢC: ' + e.message.slice(0, 60)); continue; }
  nap++;
  const s = m.default || m.spec || m;
  const c = s.course || s;
  const ma = f.replace('.mjs', '');
  soMon++;
  if ((c.shortDescription || '').length > 500) loi.shortDai.push(ma + ' ' + c.shortDescription.length);
  const slugs = [];
  for (const sec of (s.sections || c.sections || [])) {
    if (!sec.title) loi.secKhongTitle.push(ma);
    if (sec.title && RE_ENT.test(sec.title)) loi.entTitle.push(ma + ' [MỤC] ' + sec.title.slice(0, 50));
    for (const l of (sec.lessons || [])) {
      soBai++;
      slugs.push(l.slug);
      const t = l.content || '';
      if (l.title && RE_ENT.test(l.title)) loi.entTitle.push(ma + ' ' + l.slug);
      if ((l.title || '').length > 255) loi.titleDai.push(ma + ' ' + l.slug + ' ' + l.title.length);
      if ((l.slug || '').length > 255) loi.slugDai.push(ma + ' ' + l.slug.length);
      if (!t.trim() && l.type !== 'QUIZ') loi.rong.push(ma + ' ' + l.slug);
      if (/\bundefined\b/.test(t)) loi.undef.push(ma + ' ' + l.slug);
      if (t.includes('[object Object]')) loi.objObj.push(ma + ' ' + l.slug);
      if (/<pre[^>]*class="[^"]*mermaid/.test(t) || /```mermaid/.test(t)) loi.mermaidSai.push(ma + ' ' + l.slug);
      for (const mm of (t.match(/<pre[^>]*>\s*<code[^>]*>/g) || [])) if (!/language-/.test(mm)) loi.codeNoLang.push(ma + ' ' + l.slug);
      for (const u of (t.match(/https:\/\/media\.cuongthai\.com\/[^"'\s)]+\.(webp|png|jpg|jpeg|gif|svg)/g) || [])) {
        if (!anhURL.has(u)) anhURL.set(u, ma);
      }
    }
  }
  const d = slugs.filter((x, i) => slugs.indexOf(x) !== i);
  if (d.length) loi.dupSlug.push(ma + ': ' + [...new Set(d)].join(','));
}

console.log('Đã nạp ' + nap + ' môn · ' + soBai + ' bài · ' + anhURL.size + ' ảnh khác nhau\n');
const ten = { entTitle: 'Tiêu đề còn thực thể HTML thô', codeNoLang: 'Khối code THIẾU nhãn language-', mermaidSai: 'Mermaid SAI dạng (web không vẽ được)', rong: 'Bài rỗng / file không nạp được', titleDai: 'title > 255', slugDai: 'slug > 255', shortDai: 'shortDescription > 500', dupSlug: 'Trùng slug trong cùng môn', undef: 'Nội dung có chữ "undefined"', objObj: 'Nội dung có "[object Object]"', secKhongTitle: 'Mục không có title' };
for (const [k, v] of Object.entries(loi)) {
  console.log((v.length ? '⛔ ' : '✓  ') + ten[k] + ': ' + v.length);
  if (v.length) v.slice(0, 12).forEach((x) => console.log('     ' + x));
  if (v.length > 12) console.log('     … còn ' + (v.length - 12));
}
fs.writeFileSync('/tmp/anh-academy.txt', [...anhURL.keys()].join('\n'));
console.log('\nDanh sách ảnh đã ghi ra /tmp/anh-academy.txt');
