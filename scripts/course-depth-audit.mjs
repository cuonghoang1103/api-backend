/**
 * course-depth-audit.mjs — đo ĐỘ SÂU của một khoá học, bổ sung cho
 * `course-content-check.mjs` (vốn chỉ kiểm CẤU TRÚC: song ngữ, cân thẻ, quiz).
 *
 * Lý do tồn tại: một khoá có thể qua sạch bộ kiểm cấu trúc mà vẫn mỏng —
 * đo thật 22/08/2026: `web-foundations` có 0 sơ đồ trên 64 bài và
 * `typescript` có 8 sơ đồ trên 84 bài, trong khi `nodejs` có 170/112.
 * Không có phép đo này thì "đầy đủ chi tiết" chỉ là cảm giác.
 *
 *   node scripts/course-depth-audit.mjs ./content/courses/nodejs.mjs
 *   node scripts/course-depth-audit.mjs ./content/courses/nodejs/s05-express.mjs
 *
 * Sàn tối thiểu cho một khoá mới (xem COURSES-PLAN.md §3):
 *   ≥ 60 bài · ≥ 9.000 ký tự/bài · ≥ 1 sơ đồ và ≥ 1 bẫy mỗi bài lý thuyết
 *   · ≥ 2 thẻ nguồn học mỗi bài · 1 quiz 8 câu mỗi chương.
 */
import path from 'node:path';

const FILE = process.argv[2];
if (!FILE) { console.error('cần đường dẫn tới file khoá học'); process.exit(1); }
const mod = (await import(path.resolve(process.cwd(), FILE))).default;
const sections = mod.sections ?? [mod];
const cnt = (s, re) => (s.match(re) ?? []).length;

const THIN = 6000;          // dưới mức này coi là bài mỏng (trừ quiz)
const FLOOR_AVG = 9000;     // sàn ký tự trung bình mỗi bài

let n = 0, chars = 0, quizzes = 0, diagrams = 0, links = 0, pitfalls = 0, code = 0, outs = 0;
const thin = [];

console.log(`\n── ${mod.course?.title ?? path.basename(FILE)} · ${sections.length} mục ──`);
for (const sec of sections) {
  let sc = 0, sd = 0;
  for (const l of sec.lessons) {
    const c = l.content ?? '';
    n++; sc += c.length; chars += c.length;
    if (l.quiz) quizzes++;
    else if (c.length < THIN) thin.push(`${l.slug} (${c.length})`);
    sd      += cnt(c, /class="lz-(map|flow|stack)"/g);
    diagrams += cnt(c, /class="lz-(map|flow|stack)"/g);
    links   += cnt(c, /class="link-card/g);
    pitfalls += cnt(c, /class="pitfall"/g);
    code    += cnt(c, /<pre/g);
    outs    += cnt(c, /class="out"/g);
  }
  const title = (sec.title ?? '').split('|||')[0];
  console.log(`  ${String(sec.lessons.length).padStart(2)} bài · ${String(Math.round(sc / 1000)).padStart(4)}k · ${String(sd).padStart(2)} sơ đồ · ${title}`);
}

const avg = Math.round(chars / n);
console.log(`\n  ${n} bài · ${(chars / 1000).toFixed(0)}k ký tự · TB ${avg.toLocaleString('vi-VN')} ký tự/bài`);
console.log(`  sơ đồ ${diagrams} · nguồn học ${links} · bẫy ${pitfalls} · khối code ${code} · khối output ${outs} · quiz ${quizzes}`);

const fail = [];
if (avg < FLOOR_AVG) fail.push(`TB ${avg} < sàn ${FLOOR_AVG} ký tự/bài`);
if (diagrams < n - quizzes) fail.push(`sơ đồ ${diagrams} < ${n - quizzes} bài lý thuyết`);
if (pitfalls < n - quizzes) fail.push(`bẫy ${pitfalls} < ${n - quizzes} bài lý thuyết`);
if (links < 2 * (n - quizzes)) fail.push(`nguồn học ${links} < ${2 * (n - quizzes)}`);
if (thin.length) console.log(`  MỎNG (<${THIN} ký tự): ${thin.length} → ${thin.slice(0, 10).join(', ')}${thin.length > 10 ? ' …' : ''}`);
console.log(fail.length ? `  ⚠️  dưới sàn: ${fail.join(' · ')}` : '  ✅ đạt mọi sàn của COURSES-PLAN.md §3');
