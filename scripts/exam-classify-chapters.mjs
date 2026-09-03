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
import { promptHash } from './_exam-hash.mjs';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const APPLY = has('--apply');
const COURSE = val('--course', '');
const MIN = Number(val('--min', '0.55')) || 0.55;
const LIMIT = Number(val('--limit', '0')) || 0;
const CONC = Math.max(1, Number(val('--conc', '1')) || 1); // số câu chạy song song
if (!COURSE) { console.error('Cần --course <MÃ MÔN>. Ví dụ: --course SWR302'); process.exit(1); }

const plain = (html) => String(html || '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim().slice(0, 700);

const course = await prisma.course.findFirst({
  where: { courseCode: COURSE },
  select: { id: true, courseCode: true, title: true,
    sections: { select: { id: true, title: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } } },
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

// Bỏ qua câu ĐÃ có trong bản đồ bền (chỉ gán câu còn thiếu) → chạy lại nhanh +
// không tốn AI cho câu đã map. Thêm --force để gán lại tất.
const FORCE = has('--force');
const mappedHashes = new Set(
  (await prisma.examChapterMap.findMany({ where: { courseCode: course.courseCode }, select: { promptHash: true } })).map((r) => r.promptHash),
);
let skipped = 0;
if (!FORCE && mappedHashes.size) {
  const before = questions.length;
  questions = questions.filter((q) => !mappedHashes.has(promptHash(q.prompt)));
  skipped = before - questions.length;
}

console.log(`Khoá ${course.courseCode} (id ${course.id}) — ${sections.length} chương · còn ${questions.length} câu cần gán (đã map ${skipped}). APPLY=${APPLY} MIN=${MIN} CONC=${CONC}`);
console.log('Chương:\n' + sectionList + '\n');

const SYSTEM = `You map ONE exam question to the single best matching chapter of a university course.
You are given a numbered list of chapters and one question. Reply with ONLY a JSON object,
no prose: {"section": <chapter number 1..N>, "confidence": <0..1>}. confidence = how sure you
are it belongs to that chapter (0.9 clearly, 0.5 unsure, <0.4 could be several). Judge by the
TOPIC the question tests, not by wording.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Tách rõ 3 loại hỏng: LLM lỗi (429/timeout), AI trả section lạ, GHI DB lỗi —
// và RETRY cả bước gọi LLM lẫn bước ghi. `assigned` chỉ ++ sau khi GHI THẬT
// (bản trước đếm assigned trước lúc ghi nên "gán 620" mà DB 0 câu).
let assigned = 0, low = 0, llmFail = 0, writeFail = 0, done = 0;
const perSection = {};

// Phân loại + ghi MỘT câu (an toàn khi chạy xen kẽ: JS đơn luồng nên các biến
// đếm không đua). Không throw ra ngoài — mọi lỗi đếm nội bộ.
async function classifyOne(q) {
  done++;
  let idx, conf;
  try {
    const res = await llmComplete({
      step: 'generation', feature: 'codelab', purpose: 'codelab_bulk',
      system: SYSTEM,
      messages: [{ role: 'user', content: `CHAPTERS:\n${sectionList}\n\nQUESTION:\n${plain(q.prompt)}` }],
      maxTokens: 120, maxRetries: 3, timeoutMs: 60_000, userId: 1,
    });
    const m = res.text.match(/\{[\s\S]*\}/);
    const obj = m ? JSON.parse(m[0]) : null;
    idx = Number(obj?.section); conf = Number(obj?.confidence);
  } catch (e) {
    llmFail++; if (llmFail <= 8) console.log(`  ✗LLM #${q.id} — ${String(e?.message || e).slice(0, 120)}`);
    return;
  }
  if (!Number.isInteger(idx) || idx < 1 || idx > sections.length) { low++; return; }
  if (!(conf >= MIN)) { low++; return; }
  const sec = sections[idx - 1];
  const sectionId = sec.id;
  if (APPLY) {
    const ph = promptHash(q.prompt);
    let wrote = false;
    for (let a = 0; a < 3 && !wrote; a++) {
      try {
        await prisma.examQuestion.update({ where: { id: q.id }, data: { sectionId } });
        // Ghi BẢN ĐỒ BỀN theo nội dung câu → vị trí chương (sortOrder). Re-seed
        // xoá câu này thì reapply sẽ khớp câu mới cùng nội dung về đúng chương.
        await prisma.examChapterMap.upsert({
          where: { uk_exam_chapter_map: { courseCode: course.courseCode, promptHash: ph } },
          create: { courseCode: course.courseCode, promptHash: ph, sectionOrder: sec.sortOrder },
          update: { sectionOrder: sec.sortOrder },
        });
        wrote = true;
      }
      catch (e) { if (a === 2) { writeFail++; if (writeFail <= 8) console.log(`  ✗WRITE #${q.id}→${sectionId} — ${String(e?.message || e).slice(0, 150)}`); } else await sleep(600); }
    }
    if (!wrote) return;
  }
  perSection[idx] = (perSection[idx] || 0) + 1; assigned++;
}

// Chạy CONC câu song song một lô → nhanh gấp ~CONC lần.
for (let i = 0; i < questions.length; i += CONC) {
  await Promise.all(questions.slice(i, i + CONC).map(classifyOne));
  if (i > 0 && i % 200 < CONC) console.log(`  ...${done}/${questions.length} (gán ${assigned}, LLM lỗi ${llmFail})`);
  await sleep(150);
}

console.log(`\nXONG (${done}/${questions.length}) [conc ${CONC}]: GÁN ${assigned} · thấp ${low} · LLM lỗi ${llmFail} · GHI lỗi ${writeFail}${APPLY ? '' : '  (DRY RUN)'}`);
console.log('Phân bố theo chương: ' + Object.entries(perSection).map(([k, v]) => `ch.${k}=${v}`).join(' · '));
await prisma.$disconnect();
