/**
 * academy-so-slug-prod.mjs — so slug trong spec với slug đang có trên PRODUCTION.
 *
 *   node scripts/academy-so-slug-prod.mjs
 *
 * Viết lại một môn mà bỏ slug cũ thì `pruneSections: true` sẽ XOÁ bài đó khỏi
 * production, cascade xoá luôn `lesson_progress`. Script in ra đúng những slug
 * sắp mất.
 *
 * ⚠️ ĐỪNG hoảng rồi đi vá: ĐẾM TRƯỚC. 20/09/2026 có 61 slug sắp mất ở 6 môn,
 * nhưng đếm trên DB thì cả 9 môn đều 0 dòng `lesson_progress` ⇒ không mất gì
 * của ai, và việc gắn lại slug là công vô ích. Cách đếm (container không có
 * psql, /app/package.json là "type":"module" nên file phải .cjs):
 *   docker cp dem.cjs cuonghoangdev_backend:/app/ && \
 *   docker exec -w /app cuonghoangdev_backend node dem.cjs
 */
import path from 'path';
const MON = ['SSA101','PFP191','DTG102','VCM202','EEI101','SDI101m','DRP101','DRS102','ASI101'];
for (const ma of MON) {
  let s;
  try { const m = await import(path.resolve('content/academy/' + ma + '.mjs')); s = m.default || m.spec || m; }
  catch (e) { console.log(ma + ': KHÔNG NẠP ĐƯỢC — ' + e.message.slice(0,50)); continue; }
  const c = s.course || s;
  const secs = s.sections || c.sections || [];
  const moi = new Set();
  secs.forEach(sec => (sec.lessons || []).forEach(l => moi.add(l.slug)));
  let prod;
  try {
    const r = await fetch('https://cuongthai.com/api/v1/courses/' + c.slug);
    if (!r.ok) { console.log(ma + ' (' + c.slug + '): prod HTTP ' + r.status + ' — chưa có trên production, không có gì để mất'); continue; }
    const d = await r.json();
    const pc = d.data || d.course || d;
    prod = [];
    (pc.sections || []).forEach(sec => (sec.lessons || []).forEach(l => prod.push(l.slug)));
  } catch (e) { console.log(ma + ': lỗi gọi API — ' + e.message); continue; }
  const mat = prod.filter(x => !moi.has(x));
  console.log(ma.padEnd(8) + ' prod ' + String(prod.length).padStart(3) + ' bài · spec ' + String(moi.size).padStart(3) + ' bài · ' +
    (mat.length ? '⛔ MẤT ' + mat.length + ': ' + mat.join(' ') : '✓ không mất slug nào'));
}
