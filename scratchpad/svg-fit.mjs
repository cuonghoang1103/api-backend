import fs from 'node:fs';
// Ước lượng bề rộng chữ: monospace ~0.60em/ký tự, sans ~0.52em/ký tự.
// Mục đích DUY NHẤT là bắt text tràn khỏi viewBox — không phải đo pixel chính xác.
// Kiểm bộ kiểm: chạy trên một SVG có text cố tình dài để chắc nó BẮT được (dưới cùng).
function check(file) {
  const s = fs.readFileSync(file, 'utf8');
  const [, w, h] = s.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  const out = [];
  for (const m of s.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const attrs = m[1], inner = m[2];
    const x = Number((attrs.match(/\bx="([\d.]+)"/) ?? [])[1] ?? 0);
    const y = Number((attrs.match(/\by="([\d.]+)"/) ?? [])[1] ?? 0);
    const size = Number((attrs.match(/font-size="([\d.]+)"/) ?? [])[1] ?? 13);
    const mono = /monospace/.test(attrs);
    const anchor = (attrs.match(/text-anchor="(\w+)"/) ?? [])[1];
    const text = inner.replace(/<[^>]+>/g, '');
    const est = text.length * size * (mono ? 0.60 : 0.52);
    const left = anchor === 'middle' ? x - est / 2 : x;
    const right = left + est;
    if (right > w - 4) out.push(`  ✗ tràn PHẢI ${Math.round(right - w)}px: "${text.slice(0, 46)}"`);
    if (left < 0) out.push(`  ✗ tràn TRÁI: "${text.slice(0, 46)}"`);
    if (y > h - 2) out.push(`  ✗ tràn ĐÁY: "${text.slice(0, 46)}"`);
  }
  console.log(`${file.split('/').pop().padEnd(26)} ${w}×${h}  ${out.length ? '' : '✓ vừa khung'}`);
  out.forEach(l => console.log(l));
  return out.length;
}
let bad = 0;
for (const f of process.argv.slice(2)) bad += check(f);
// tự kiểm bộ kiểm
const probe = '/tmp/probe-overflow.svg';
fs.writeFileSync(probe, `<svg viewBox="0 0 700 100"><text x="600" y="50" font-size="14">${'x'.repeat(60)}</text></svg>`);
const caught = check(probe);
console.log(caught ? '✓ bộ kiểm CÓ bắt được trường hợp tràn (tự kiểm)' : '✗ BỘ KIỂM HỎNG — không bắt được text tràn rõ ràng');
process.exit(bad ? 1 : 0);
