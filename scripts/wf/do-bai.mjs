// node scripts/wf/do-bai.mjs [lọc slug] — độ dài từng bài khoá web-foundations: HTML + chữ (bỏ thẻ), cờ MỎNG theo chữ < 6000
const m = (await import('../../content/courses/web-foundations.mjs')).default;
const loc = process.argv[2];
let mong = 0;
for (const s of m.sections) for (const l of s.lessons) {
  const c = l.content || '', t = c.replace(/<[^>]+>/g, '');
  if (t.length < 6000) mong++;
  if (loc && !l.slug.includes(loc)) continue;
  const d = (c.match(/class="lz-(map|flow|stack)"/g) || []).length, p = (c.match(/class="pitfall[" ]/g) || []).length;
  console.log(`${l.slug.padEnd(34)} html ${String(c.length).padStart(6)} · chữ ${String(t.length).padStart(6)} · sơ đồ ${d} · bẫy ${p}${t.length < 6000 ? ' · MỎNG' : ''}`);
}
console.log('MỎNG (chữ < 6000):', mong);
