/** Kiểm cấu trúc spec Academy: giới hạn 255, song ngữ, quiz, escape HTML.
 *   node kiem-cau-truc.mjs ./partA.mjs
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const FILE = process.argv[2];
const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const sections = Array.isArray(spec) ? spec : spec.sections;
const err = [], warn = [];
const seen = new Map();
let nLes = 0;

for (const s of sections) {
  if (!s.title.includes('|||')) err.push(`SECTION không song ngữ: ${s.title}`);
  if (s.title.length > 255) err.push(`SECTION title ${s.title.length} ký tự: ${s.title}`);
  for (const l of s.lessons || []) {
    nLes++;
    const id = l.slug;
    if (seen.has(id)) err.push(`SLUG TRÙNG: ${id}`);
    seen.set(id, true);
    if (!/^[a-z0-9-]+$/.test(id)) err.push(`slug sai định dạng: ${id}`);
    if (id.length > 255) err.push(`slug ${id.length} ký tự: ${id}`);
    if (l.title.length > 255) err.push(`TITLE ${l.title.length} ký tự (>255): ${id}`);
    if (l.title.length > 170) warn.push(`title dài ${l.title.length}: ${id}`);
    if (!l.title.includes('|||')) err.push(`title không song ngữ: ${id}`);
    if (!l.description) warn.push(`thiếu description: ${id}`);
    if (l.description && l.description.includes('|||')) warn.push(`description có ||| (chỉ nên tiếng Việt): ${id}`);

    if (l.type === 'QUIZ') {
      const qs = l.quiz?.questions || [];
      if (qs.length < 5) warn.push(`quiz ${id} chỉ ${qs.length} câu`);
      qs.forEach((q, i) => {
        const tag = `${id} q${i + 1}`;
        if (!q.id) err.push(`${tag}: thiếu id`);
        if (!q.question?.includes('|||')) err.push(`${tag}: question không song ngữ`);
        if (!Array.isArray(q.options) || q.options.length !== 4) err.push(`${tag}: cần đúng 4 options (đang ${q.options?.length})`);
        (q.options || []).forEach((o, j) => { if (!String(o).includes('|||')) err.push(`${tag} opt${j}: không song ngữ`); });
        if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= (q.options || []).length) err.push(`${tag}: correctIndex sai (${q.correctIndex})`);
        if (!q.explanation) err.push(`${tag}: thiếu explanation`);
        else if (!q.explanation.includes('|||')) err.push(`${tag}: explanation không song ngữ`);
        if (q.code && /&lt;|&amp;|&gt;/.test(q.code)) warn.push(`${tag}: code quiz KHÔNG nên escape HTML`);
      });
      continue;
    }

    const c = l.content || '';
    const en = (c.match(/<div class="ml-en">/g) || []).length;
    const vi = (c.match(/<div class="ml-vi">/g) || []).length;
    if (en === 0 || en !== vi) err.push(`${id}: ml-en=${en} ml-vi=${vi}`);
    // độ dài hai nửa
    const parts = c.split('<div class="ml-vi">');
    const lenEn = c.length - parts.slice(1).join('').length, lenVi = parts.slice(1).join('').length;
    const ratio = lenEn && lenVi ? Math.max(lenEn, lenVi) / Math.min(lenEn, lenVi) : 99;
    if (ratio > 1.6) warn.push(`${id}: hai nửa lệch ${ratio.toFixed(2)}x (en≈${lenEn} vi≈${lenVi})`);
    if (c.length < 4000) warn.push(`${id}: nội dung ngắn (${c.length} ký tự cả hai nửa)`);
    if (/<script|<style[ >]|\sstyle="/.test(c)) err.push(`${id}: có script/style`);
    if (/<h1[ >]/.test(c)) warn.push(`${id}: dùng <h1>`);
    if (c.includes('|||')) warn.push(`${id}: có ||| trong content`);
    // escape trong khối code
    const re = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g; let m;
    while ((m = re.exec(c))) {
      if (/<(?!\/?(b|i|em|strong|span)[ >])/.test(m[1])) err.push(`${id}: khối code có '<' CHƯA escape → ${m[1].slice(0, 80).replace(/\n/g, ' ')}`);
      if (/&(?!lt;|gt;|amp;|quot;|#39;|nbsp;)/.test(m[1])) err.push(`${id}: khối code có '&' CHƯA escape`);
    }
    // thẻ mở/đóng cân nhau cho vài thẻ khối
    for (const t of ['table', 'thead', 'tbody', 'tr', 'pre', 'ul', 'ol', 'div']) {
      const o = (c.match(new RegExp('<' + t + '[ >]', 'g')) || []).length;
      const cl = (c.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== cl) err.push(`${id}: thẻ <${t}> lệch (${o} mở / ${cl} đóng)`);
    }
    for (const cls of ['out', 'pitfall', 'dap-an', 'nhan']) {
      if (!c.includes('class="' + cls)) warn.push(`${id}: không có .${cls}`);
    }
  }
}
const titles = [...seen.keys()];
console.log(`${FILE}: ${sections.length} section · ${nLes} bài · ${err.length} LỖI · ${warn.length} cảnh báo`);
err.forEach((e) => console.log('  ✗ ' + e));
warn.forEach((w) => console.log('  ~ ' + w));
