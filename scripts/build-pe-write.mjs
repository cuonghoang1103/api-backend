/**
 * build-pe-write.mjs — dựng một đề PE dạng WRITE (thực hành viết: SRS, test case,
 * review code, thiết kế sơ đồ) từ bank JSON do agent soạn, ra content/exams/<CODE>.mjs.
 *
 * Bank JSON:
 * {
 *   "system_en": "...", "system_vi": "...",   // mô tả hệ thống/bối cảnh chung (tuỳ chọn)
 *   "questions": [
 *     { "points": 3,
 *       "prompt_en": "html/plain", "prompt_vi": "...",
 *       "sample_en": "html/plain (đáp án mẫu; sơ đồ dùng <pre class=\"mermaid\">…</pre>)", "sample_vi": "...",
 *       "rubric": [ { "criterion_en":"...", "criterion_vi":"...", "weight":1, "maxScore":3 } ]
 *     }
 *   ]
 * }
 *
 *  node scripts/build-pe-write.mjs --bank <bank.json> --course SWT301 --code PE1-FA25 \
 *     --title "EN|||VI" --desc "EN|||VI" --duration 90 --pass 5 --subject "Software Testing" \
 *     --out content/exams/SWT301-PE1.mjs
 */
import fs from 'node:fs';
const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const BANK = val('--bank'), COURSE = val('--course'), CODE = val('--code'), TITLE = val('--title');
const DESC = val('--desc', ''), OUT = val('--out'), SUBJECT = val('--subject', 'this subject');
const DURATION = parseInt(val('--duration', '90'), 10), PASS = parseFloat(val('--pass', '5'));
if (!BANK || !COURSE || !CODE || !TITLE || !OUT) { console.error('cần --bank --course --code --title --out'); process.exit(1); }

const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const qs = bank.questions || [];
const totalPoints = qs.reduce((s, q) => s + (q.points || 0), 0);

const bl = (en, vi) => `<div class="ml-en">${en || ''}</div><div class="ml-vi">${vi || ''}</div>`;
// nếu text chưa có thẻ khối thì bọc <p>
const wrap = (s) => (s && /^\s*<(p|div|table|pre|ol|ul|h[1-6]|img)/i.test(s.trim()) ? s : `<p>${s || ''}</p>`);

const sysBlock = (bank.system_en || bank.system_vi)
  ? bl(`<div class="pe-system"><b>System / Context:</b><br/>${wrap(bank.system_en)}</div>`,
       `<div class="pe-system"><b>Hệ thống / Bối cảnh:</b><br/>${wrap(bank.system_vi)}</div>`)
  : '';

const instructions =
  bl(`<p><b>How to take this practical exam.</b></p><ol>` +
     `<li>This is a real FPTU <b>Practical Exam</b> for <b>${SUBJECT}</b>. Read the system/context, then answer each question <b>in writing</b> (English) in the answer box.</li>` +
     `<li>For diagrams (context / use-case / ERD), describe them clearly in text or list form — the model answer shows the reference diagram.</li>` +
     `<li>When you submit, AI grades each answer against a <b>rubric</b> and a reference solution, then shows a bilingual model answer.</li>` +
     `</ol>`,
     `<p><b>Cách làm bài thi thực hành.</b></p><ol>` +
     `<li>Đây là đề <b>thi thực hành (PE)</b> thật của FPTU môn <b>${SUBJECT}</b>. Đọc hệ thống/bối cảnh, rồi trả lời mỗi câu <b>bằng chữ</b> (tiếng Anh) trong ô trả lời.</li>` +
     `<li>Với sơ đồ (context / use-case / ERD), mô tả rõ bằng chữ hoặc liệt kê — đáp án mẫu có sơ đồ tham chiếu.</li>` +
     `<li>Khi nộp, AI chấm từng câu theo <b>rubric</b> và một đáp án mẫu, rồi hiện đáp án mẫu song ngữ.</li>` +
     `</ol>`);

const questions = qs.map((q, i) => {
  const rubric = (q.rubric || []).map((r, j) => ({
    id: r.id || `c${j + 1}`,
    criterion: `${r.criterion_en || ''}|||${r.criterion_vi || ''}`,
    weight: r.weight ?? 1,
    maxScore: r.maxScore ?? q.points ?? 1,
  }));
  return {
    kind: 'WRITE',
    points: q.points ?? 1,
    // KHÔNG tự thêm tiêu đề "Question N" — prompt của agent đã có, và WriteRunner
    // (frontend) cũng hiện "Câu N/total · Xđ". Thêm nữa gây lặp (sửa 26/08).
    prompt: (i === 0 ? sysBlock : '') + bl(wrap(q.prompt_en), wrap(q.prompt_vi)),
    sampleSolution: bl(wrap(q.sample_en), wrap(q.sample_vi)),
    rubric,
  };
});

const spec = {
  course: { courseCode: COURSE },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: CODE,
    title: TITLE,
    description: DESC || undefined,
    durationMinutes: DURATION,
    totalPoints: totalPoints || 10,
    passMark: PASS,
    source: 'FUOverflow',
    instructions,
    isPublished: true,
    questions,
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${questions.length} câu, ${totalPoints} điểm`);
const low = qs.filter((q) => q.conf === 'low').length;
if (low) console.log(`  ⚠ ${low} câu conf thấp`);
