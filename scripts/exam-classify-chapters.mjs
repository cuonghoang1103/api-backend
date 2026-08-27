/**
 * exam-classify-chapters.mjs — gán mỗi câu hỏi Exam Room của MỘT khoá vào đúng
 * CHƯƠNG (CourseSection) bằng AI, để Academy "học chương nào luyện câu chương đó".
 *
 * Ghi ExamQuestion.sectionId khi độ tự tin ≥ ngưỡng; thấp hơn thì để NULL + log
 * cho người duyệt tay. Dùng model RẺ (codelab_bulk) vì đây là việc nền hàng loạt.
 * Admin userId 1 → không đụng trần token. Chạy qua container tạm từ image backend
 * (có /app/dist + prisma + env cổng), giống các script seed khác.
 *
 *   node scripts/exam-classify-chapters.mjs --course SWR302              # DRY RUN
 *   node scripts/exam-classify-chapters.mjs --course SWR302 --apply
 *   node scripts/exam-classify-chapters.mjs --course SWR302 --apply --min 0.6 --limit 20
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const COURSE = val('--course', '');
const MIN = Number(val('--min', '0.55')) || 0.55;
const LIMIT = Number(val('--limit', '0')) || 0;
if (!COURSE) { console.error('Cần --course <MÃ MÔN>. Ví dụ: --course SWR302'); process.exit(1); }

const plain = (html) => String(html || '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim().slice(0, 700);

const course = await prisma.course.findFirst({
  where: { courseCode: COURSE },
  select: { id: true, courseCode: true, title: true,
    sections: { select: { id: true, title: true }, orderBy: { sortOrder: 'asc' } } },
});
if (!course) { console.error(`Không tìm thấy khoá "${COURSE}"`); process.exit(1); }
if (!course.sections.length) { console.error(`Khoá ${COURSE} chưa có chương (CourseSection).`); process.exit(1); }

// Danh sách chương đánh số 1..N làm nhãn ứng viên cho AI.
const sections = course.sections;
const sectionList = sections.map((s, i) => `${i + 1}. ${plain(s.title).slice(0, 120)}`).join('\n');

let questions = await prisma.examQuestion.findMany({
  where: { exam: { courseId: course.id } },
  select: { id: true, prompt: true, sectionId: true },
  orderBy: { id: 'asc' },
});
if (LIMIT) questions = questions.slice(0, LIMIT);

console.log(`Khoá ${course.courseCode} (id ${course.id}) — ${sections.length} chương · ${questions.length} câu. APPLY=${APPLY} MIN=${MIN}`);
console.log('Chương:\n' + sectionList + '\n');

const SYSTEM = `You map ONE exam question to the single best matching chapter of a university course.
You are given a numbered list of chapters and one question. Reply with ONLY a JSON object,
no prose: {"section": <chapter number 1..N>, "confidence": <0..1>}. confidence = how sure you
are it belongs to that chapter (0.9 clearly, 0.5 unsure, <0.4 could be several). Judge by the
TOPIC the question tests, not by wording.`;

let assigned = 0, low = 0, fail = 0, done = 0;
const perSection = {};
for (const q of questions) {
  try {
    const res = await llmComplete({
      step: 'generation', feature: 'codelab', purpose: 'codelab_bulk',
      system: SYSTEM,
      messages: [{ role: 'user', content: `CHAPTERS:\n${sectionList}\n\nQUESTION:\n${plain(q.prompt)}` }],
      maxTokens: 120, maxRetries: 2, timeoutMs: 60_000, userId: 1,
    });
    const m = res.text.match(/\{[\s\S]*\}/);
    const obj = m ? JSON.parse(m[0]) : null;
    const idx = Number(obj?.section);
    const conf = Number(obj?.confidence);
    done++;
    if (!Number.isInteger(idx) || idx < 1 || idx > sections.length) { low++; console.log(`  ? #${q.id} — AI trả về section lạ (${obj?.section})`); continue; }
    if (!(conf >= MIN)) { low++; console.log(`  ~ #${q.id} → ch.${idx} conf=${conf} (< ${MIN}, để trống)`); continue; }
    const sectionId = sections[idx - 1].id;
    perSection[idx] = (perSection[idx] || 0) + 1;
    assigned++;
    if (APPLY) await prisma.examQuestion.update({ where: { id: q.id }, data: { sectionId } });
  } catch (e) {
    fail++; done++;
    console.log(`  ✗ #${q.id} — ${e?.message || e}`);
  }
  await new Promise((r) => setTimeout(r, 800));
}

console.log(`\nXONG (${done}/${questions.length}): gán ${assigned} · tự tin thấp ${low} · lỗi ${fail}${APPLY ? '' : '  (DRY RUN — thêm --apply để ghi)'}`);
console.log('Phân bố theo chương: ' + Object.entries(perSection).map(([k, v]) => `ch.${k}=${v}`).join(' · '));
await prisma.$disconnect();
