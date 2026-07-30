import fs from 'node:fs';
const { renderArticle } = await import('/Users/admin/Downloads/api-backend/dist/services/techTrendsRenderer.service.js');
const mdPath = process.argv[2];
const md = fs.readFileSync(mdPath, 'utf8');
const { html, toc } = renderArticle(md);
const c = (re) => (html.match(re) ?? []).length;
console.log(`pre>code ${c(/<pre><code/g)} (fences ${(md.match(/^```/gm).length) / 2}) · img ${c(/<img /g)} (alt ${c(/<img [^>]*alt="/g)}) · table ${c(/<table>/g)} · h2 ${c(/<h2 id="/g)} · h3 ${c(/<h3 id="/g)} · toc ${toc.length} · a ${c(/<a href="/g)}`);
let bad = 0;
html.split('<table>').slice(1).map(t => t.split('</table>')[0]).forEach((t, i) => {
  const cols = (t.match(/<th[ >]/g) ?? []).length;                 // <th[ >] — không phải /<th/ (khớp <thead>)
  const rows = t.split(/<tr>/).slice(1).map(r => (r.match(/<t[dh][ >]/g) ?? []).length);
  const lech = rows.filter(n => n !== cols);
  if (lech.length) { bad++; console.log(`  ✗ bảng ${i + 1}: ${cols} cột nhưng có hàng ${[...new Set(lech)].join(',')} ô`); }
});
console.log(bad ? `✗ ${bad} bảng lệch` : '✓ mọi bảng đủ ô');
const ids = [...html.matchAll(/<h[1-3] id="([^"]+)"/g)].map(m => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
console.log(dup.length ? `✗ id trùng: ${dup.join(',')}` : '✓ không id trùng');
const stray = html.match(/&lt;(figure|details|section|aside|kbd|script)/g);
console.log(stray ? `✗ thẻ bị sanitizer chặn: ${[...new Set(stray)].join(',')}` : '✓ không thẻ nào bị chặn');
fs.writeFileSync(mdPath.replace(/\.md$/, '') .split('/').pop() + '.html', html);
process.stdout.write(`html ${(html.length / 1024).toFixed(1)}KB → ${process.cwd()}/${mdPath.replace(/\.md$/, '').split('/').pop()}.html\n`);
