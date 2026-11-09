/**
 * academy-kiem-tu-soan.mjs — chấm file khoá TỰ SOẠN content/academy/_tu-soan/<MÃ>.mjs theo _HOP-DONG-TU-SOAN.md.
 *
 *   node scripts/academy-kiem-tu-soan.mjs --ma CAL111
 *   node scripts/academy-kiem-tu-soan.mjs --tatca
 *
 * Mã thoát 0 = đạt; 1 = có lỗi (phải sửa trước khi gom).
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const DIR = 'content/academy';
const ds = val('--ma') ? val('--ma').split(',') : fs.readdirSync(path.join(DIR, '_tu-soan')).filter((f) => f.endsWith('.mjs')).map((f) => f.replace('.mjs', ''));

let hong = 0;
for (const ma of ds) {
  const loi = [], canh = [];
  const f = path.join(DIR, '_tu-soan', `${ma}.mjs`);
  if (!fs.existsSync(f)) { console.log(`✗ ${ma}: chưa có ${f}`); hong++; continue; }
  const raw = fs.readFileSync(f, 'utf8');
  if (raw.includes('${')) loi.push('có "${" trong file');
  let secs;
  try { secs = (await import(path.resolve(f) + '?t=' + Date.now())).default; } catch (e) { console.log(`✗ ${ma}: không nạp được — ${e.message}`); hong++; continue; }
  if (!Array.isArray(secs) || secs.length < 9) loi.push(`cần Mục 0 + ≥8 chương, đang có ${secs?.length} mục`);
  const spec = (await import(path.resolve(DIR, `${ma}.mjs`))).default;
  const slugCu = new Set((spec.sections || spec.course.sections || []).flatMap((s) => (s.lessons || []).map((l) => l.slug)));
  const lo = ma.toLowerCase();
  const slugs = new Set();
  let bai = 0, quiz = 0, link = 0;
  const kiemTitle = (t, ten) => {
    const p = String(t || '').split('|||');
    if (p.length !== 2) loi.push(`${ten}: title phải dạng EN|||VI`);
    else if (p.some((x) => x.length > 120)) loi.push(`${ten}: một nửa title > 120 ký tự`);
  };
  secs.forEach((s, si) => {
    kiemTitle(s.title, `mục ${si}`);
    const ls = s.lessons || [];
    if (si > 0 && !ls.some((l) => l.type === 'QUIZ')) loi.push(`chương ${si}: thiếu quiz`);
    for (const l of ls) {
      kiemTitle(l.title, l.slug);
      if (!l.slug || !l.slug.startsWith(`${lo}-ts-`) || l.slug.length > 80) loi.push(`slug sai khuôn: ${l.slug}`);
      if (slugs.has(l.slug)) loi.push(`slug trùng: ${l.slug}`); slugs.add(l.slug);
      if (slugCu.has(l.slug)) loi.push(`slug trùng bài cũ: ${l.slug}`);
      if (l.type === 'QUIZ') {
        quiz++;
        const qs = l.quiz?.questions || [];
        if (qs.length < 8) canh.push(`${l.slug}: quiz chỉ ${qs.length} câu`);
        for (const q of qs) {
          if (!String(q.question).includes('|||') || !String(q.explanation || '').includes('|||')) loi.push(`${l.slug}/${q.id}: câu hỏi/giải thích thiếu EN|||VI`);
          if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => !String(o).includes('|||'))) loi.push(`${l.slug}/${q.id}: cần 4 lựa chọn EN|||VI`);
          if (!(q.correctIndex >= 0 && q.correctIndex < 4)) loi.push(`${l.slug}/${q.id}: correctIndex sai`);
        }
        continue;
      }
      bai++;
      const c = String(l.content || '');
      if (!/<div class="ml-en">/.test(c) || !/<div class="ml-vi">/.test(c)) loi.push(`${l.slug}: thiếu khối ml-en/ml-vi`);
      if (/\\\(|\\\[|\$\$|\\frac|\\sum|\\int/.test(c)) loi.push(`${l.slug}: có LaTeX (web không render)`);
      if (/<script|<style|style=/i.test(c)) loi.push(`${l.slug}: có script/style`);
      const n = (c.match(/href="https?:\/\//g) || []).length; link += n;
      if (si > 0 && n < 2) canh.push(`${l.slug}: chỉ ${n} link ngoài`);
      const chu = c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length;
      if (si > 0 && chu < 3500) canh.push(`${l.slug}: ngắn (${chu} ký tự cả hai thứ tiếng)`);
      const mo = (c.match(/<(div|p|ul|ol|li|table|pre|code|h[1-6])\b/g) || []).length, dong = (c.match(/<\/(div|p|ul|ol|li|table|pre|code|h[1-6])>/g) || []).length;
      if (mo !== dong) loi.push(`${l.slug}: thẻ HTML lệch (${mo} mở / ${dong} đóng)`);
    }
  });
  const nhan = loi.length ? '✗' : (canh.length ? '!' : '✓');
  console.log(`${nhan} ${ma}: ${secs.length} mục · ${bai} bài · ${quiz} quiz · ${link} link ngoài`);
  loi.slice(0, 15).forEach((x) => console.log('    ✗ ' + x));
  canh.slice(0, 8).forEach((x) => console.log('    ! ' + x));
  if (loi.length) hong++;
}
process.exitCode = hong ? 1 : 0;
