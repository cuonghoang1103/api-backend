/**
 * Kiểm cấu trúc nội dung khoá học TRƯỚC KHI seed lên prod.
 *
 *   node scripts/course-content-check.mjs ./content/courses/nodejs.mjs
 *   node scripts/course-content-check.mjs ./content/courses/nodejs/s08-auth.mjs
 *
 * Kiểm 6 thứ cho mỗi bài:
 *   1. count(class="ml-en") === count(class="ml-vi") và > 0   (song ngữ đủ cặp)
 *   2. cân bằng <div>/</div>
 *   3. cân bằng <p>/</p>        ← bắt được lỗi mà bước 2 KHÔNG bắt
 *   4. cân bằng <pre>/</pre>, <code>/</code>, <span>/</span>
 *   5. title bài có dấu ngăn |||
 *   6. quiz: câu hỏi có |||, correctIndex nằm trong khoảng options
 *   7. dấu gạch chéo ngược đơn trong template literal (đọc MÃ NGUỒN, không
 *      phải module đã nạp — lúc nạp xong thì JS đã ăn mất chúng rồi)
 *
 * Lưu ý dương tính giả đã xử lý: phương án quiz chỉ gồm code/output
 * ("3, 3, 3", "undefined") cố tình giống nhau ở 2 ngôn ngữ nên KHÔNG cần |||;
 * chỉ báo lỗi khi phương án có chữ tiếng Việt CÓ DẤU mà thiếu |||.
 */
import path from 'node:path';
import fs from 'node:fs';
const file = path.resolve(process.cwd(), process.argv[2] ?? './content/courses/nodejs.mjs');
const mod = (await import(file)).default;
const sections = mod.sections ?? [mod];
let bad = 0, chars = 0, n = 0;
const cnt = (s, re) => (s.match(re) ?? []).length;
for (const sec of sections) {
  for (const l of sec.lessons) {
    n++; chars += l.content.length;
    const c = l.content;
    const en = cnt(c, /class="ml-en"/g), vi = cnt(c, /class="ml-vi"/g);
    const errs = [];
    if (en === 0 || en !== vi) errs.push(`ml-en=${en} ml-vi=${vi}`);
    const o = cnt(c, /<div\b/g), cl = cnt(c, /<\/div>/g);
    if (o !== cl) errs.push(`div ${o}/${cl}`);
    const po = cnt(c, /<p\b/g), pc = cnt(c, /<\/p>/g);
    if (po !== pc) errs.push(`p ${po}/${pc}`);
    const preo = cnt(c, /<pre\b/g), prec = cnt(c, /<\/pre>/g);
    if (preo !== prec) errs.push(`pre ${preo}/${prec}`);
    const co = cnt(c, /<code\b/g), cc = cnt(c, /<\/code>/g);
    if (co !== cc) errs.push(`code ${co}/${cc}`);
    const so = cnt(c, /<span\b/g), sc = cnt(c, /<\/span>/g);
    if (so !== sc) errs.push(`span ${so}/${sc}`);
    if (!l.title.includes('|||')) errs.push('title thiếu |||');
    if (l.quiz) {
      l.quiz.questions.forEach((q, i) => {
        if (!q.question.includes('|||')) errs.push(`q${i} thiếu |||`);
        if (q.correctIndex < 0 || q.correctIndex >= q.options.length) errs.push(`q${i} correctIndex ${q.correctIndex}/${q.options.length}`);
        // Phương án chỉ gồm code/output thì giống nhau ở 2 ngôn ngữ → không cần |||.
        // Chỉ báo lỗi khi có chữ tiếng Việt có dấu mà lại thiếu |||.
        q.options.forEach((o, j) => {
          if (!o.includes('|||') && /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(o))
            errs.push(`q${i}.opt${j} thiếu |||`);
        });
      });
    }
    if (errs.length) { bad++; console.log(`❌ ${l.slug}: ${errs.join(' | ')}`); }
  }
}

// ── 7. Gạch chéo ngược đơn trong template literal ────────────────────────────
// Trong `...` chỉ \\ \$ \` là hợp lệ. Mọi \X khác bị JS NUỐT: \d thành d, còn
// \n thành ký tự xuống dòng THẬT. Cả hai đều lọt qua mọi phép kiểm ở trên vì
// chúng xảy ra lúc phân tích cú pháp — nội dung đã nạp trông hoàn toàn hợp lệ.
// Đo thật 22/08/2026: `printf '9\n10\n'` hiện ra thành ba dòng rời trong bài,
// và một dấu \ cuối dòng trong Dockerfile của khoá Node.js nối liền hai dòng
// lệnh làm một. Vì vậy phép kiểm này đọc MÃ NGUỒN, không đọc module.
const SAFE_AFTER = new Set(['\\', '$', '`', "'", '"']);
const srcFiles = [file];
for (const m of fs.readFileSync(file, 'utf8').matchAll(/^import\s+\w+\s+from\s+'(\.[^']+)'/gm)) {
  srcFiles.push(path.resolve(path.dirname(file), m[1]));
}
let esc = 0;
for (const f of srcFiles) {
  if (!fs.existsSync(f)) continue;
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const t = line.trimStart();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
    for (let k = 0; k < line.length; k++) {
      if (line[k] !== '\\') continue;
      const nxt = k + 1 < line.length ? line[k + 1] : '\n';
      if (SAFE_AFTER.has(nxt)) { k++; continue; }
      esc++;
      console.log(`❌ ${path.basename(f)}:${i + 1} gạch chéo đơn ${JSON.stringify('\\' + nxt)} — JS sẽ nuốt nó, hãy viết \\\\`);
    }
  });
}

console.log(`${bad || esc ? '❌' : '✅'} ${n} bài, ${chars.toLocaleString('vi-VN')} ký tự, `
  + `${bad} bài lỗi, ${esc} chỗ gạch chéo đơn`);
// Thoát khác 0 khi có lỗi: nếu không, một chuỗi `check && git commit` sẽ commit
// đè lên lỗi mà bộ kiểm vừa in ra. Đo thật 22/08/2026 — đúng chuyện đó đã xảy ra.
process.exit(bad || esc ? 1 : 0);
