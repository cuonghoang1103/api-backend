/**
 * academy-add-final-exam.mjs
 * Thêm chương "Final Exam" (PE + FE) vào cuối MỖI file content/academy/*.mjs.
 *  - PE (Practical Exam): chỉ môn CODE / WRITE / JAPANESE (speaking). Khung + prep.
 *  - FE (Multiple Choice): MỌI môn. Khung + vài câu mẫu (lấy từ quiz đã có của môn).
 * Đề thật sẽ được thêm sau (từ ảnh đề thi cũ) khi có trang phòng thi.
 * Idempotent: bỏ qua file đã có section 'Final Exam'.
 * Chèn section dưới dạng JSON literal (an toàn escape) ngay trước anchor '  ],\n};'.
 *
 * Chạy:  node scripts/academy-add-final-exam.mjs [--dry] [--only PRF192,VNR202]
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const ACAD = 'content/academy';
const DRY = process.argv.includes('--dry');
const onlyArg = process.argv.indexOf('--only');
const ONLY = onlyArg > -1 ? new Set(process.argv[onlyArg + 1].split(',')) : null;

const CODE = new Set(['PRF192','PRO192','LAB211','CSD201','DBI202','WED201c','PRJ301','IOT102','FER202','SWT301','SWP391','SWD392','SDN302','MMA301','WDP301','PRM392','INT601','INT602','INT603','INT604','INT605','INT606','INT607','INT608','INT609','INT610']);
const WRITE = new Set(['ENW492c','SWR302','ITE302c','PMG201c','EXE101','EXE201']);
const JP = new Set(['JPD113','JPD123']);
const peType = (code) => CODE.has(code) ? 'code' : WRITE.has(code) ? 'write' : JP.has(code) ? 'japanese' : null;

// ---- Nội dung khung (song ngữ ml-en/ml-vi) ----
function feContent() {
  return `
<div class="ml-en">
<span class="eyebrow">Final Exam · FE</span>
<h2>FE — Final Exam (Multiple Choice)</h2>
<p class="lead">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>
<h3>How to do well</h3>
<ul>
<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>
<li>Eliminate clearly wrong options first, then choose among the rest.</li>
<li>For "what should you do / which is best" items, answer by this subject's method, not gut feeling.</li>
<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>
</ul>
<div class="callout"><span class="badge">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Thi cuối kỳ · FE</span>
<h2>FE — Thi trắc nghiệm cuối kỳ</h2>
<p class="lead">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>
<h3>Cách làm tốt</h3>
<ul>
<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>
<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>
<li>Câu "nên làm gì / cái nào tốt nhất" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>
<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>
</ul>
<div class="callout"><span class="badge">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>
</div>`;
}

function peContent(type) {
  const bodies = {
    code: {
      en: `<p class="lead">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>
<h3>How to prepare</h3>
<ul>
<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>
<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>
<li>Read the requirement twice; build the smallest working version first, then extend.</li>
<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>
</ul>`,
      vi: `<p class="lead">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>
<h3>Cách chuẩn bị</h3>
<ul>
<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>
<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>
<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>
<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>
</ul>`,
    },
    write: {
      en: `<p class="lead">The Practical Exam (PE) is a <strong>writing / report exam</strong>: you are given a prompt (an essay question, a document, or a plan) and must produce a well-structured, well-argued piece within a time limit. It is graded on structure, argument, use of evidence, and clarity.</p>
<h3>How to prepare</h3>
<ul>
<li>Practise the structure: thesis &rarr; evidence &rarr; analysis &rarr; conclusion.</li>
<li>Prepare a few strong examples / sources you can cite quickly.</li>
<li>Plan before you write: 2 minutes outlining saves ten minutes rewriting.</li>
<li>Argue a clear position &mdash; do not just summarize.</li>
</ul>`,
      vi: `<p class="lead">Thi thực hành (PE) là <strong>thi viết / báo cáo</strong>: bạn được giao một đề (câu hỏi luận, một tài liệu, hoặc một kế hoạch) và phải viết một bài có cấu trúc, lập luận tốt trong thời gian quy định. Chấm theo cấu trúc, lập luận, dùng bằng chứng, và sự rõ ràng.</p>
<h3>Cách chuẩn bị</h3>
<ul>
<li>Luyện cấu trúc: luận đề &rarr; bằng chứng &rarr; phân tích &rarr; kết luận.</li>
<li>Chuẩn bị vài ví dụ / nguồn mạnh có thể trích nhanh.</li>
<li>Lập dàn ý trước khi viết: 2 phút dàn ý tiết kiệm mười phút viết lại.</li>
<li>Lập luận một quan điểm rõ &mdash; đừng chỉ tóm tắt.</li>
</ul>`,
    },
    japanese: {
      en: `<p class="lead">The Practical Exam (PE) for this subject is a <strong>speaking exam (kaiwa)</strong>: you talk with the examiner &mdash; self-introduction, a short conversation, or a brief presentation on a given topic &mdash; graded on pronunciation, grammar, vocabulary, fluency and responsiveness.</p>
<h3>How to prepare</h3>
<ul>
<li>Practise speaking aloud daily; record yourself and check pronunciation.</li>
<li>Memorize set phrases for greetings, self-introduction, and asking/answering.</li>
<li>Prepare 3&ndash;5 common topics and be able to speak ~1 minute on each.</li>
<li>When you do not understand, ask politely to repeat (&laquo;mou ichido onegaishimasu&raquo;) &mdash; do not freeze.</li>
</ul>`,
      vi: `<p class="lead">Thi thực hành (PE) của môn này là <strong>thi nói (kaiwa / speaking)</strong>: bạn nói chuyện với giám khảo &mdash; tự giới thiệu, một đoạn hội thoại ngắn, hoặc thuyết trình ngắn về một chủ đề cho sẵn &mdash; chấm theo phát âm, ngữ pháp, từ vựng, độ trôi chảy và khả năng phản hồi.</p>
<h3>Cách chuẩn bị</h3>
<ul>
<li>Luyện nói to mỗi ngày; tự ghi âm và kiểm phát âm.</li>
<li>Thuộc mẫu câu chào hỏi, tự giới thiệu, và hỏi/đáp.</li>
<li>Chuẩn bị 3&ndash;5 chủ đề quen và nói được ~1 phút mỗi chủ đề.</li>
<li>Khi không hiểu, lịch sự xin nhắc lại (&laquo;mou ichido onegaishimasu&raquo;) &mdash; đừng đơ.</li>
</ul>`,
    },
  };
  const b = bodies[type];
  return `
<div class="ml-en">
<span class="eyebrow">Final Exam · PE</span>
<h2>PE — Practical Exam</h2>
${b.en}
<div class="callout"><span class="badge">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Thi cuối kỳ · PE</span>
<h2>PE — Thi thực hành</h2>
${b.vi}
<div class="callout"><span class="badge">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>
</div>`;
}

// Lấy tối đa n câu hỏi mẫu từ các quiz đã có của môn
function sampleQuestions(obj, n = 6) {
  const out = [];
  const seen = new Set();
  for (const sec of obj.sections || []) {
    for (const les of sec.lessons || []) {
      const qs = les.quiz && Array.isArray(les.quiz.questions) ? les.quiz.questions : [];
      for (const q of qs) {
        const key = (q.question || '').slice(0, 60);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ id: 'q' + (out.length + 1), points: 1, question: q.question, options: q.options, correctIndex: q.correctIndex });
        if (out.length >= n) return out;
      }
    }
  }
  return out;
}

function buildSection(code, obj) {
  const lc = code.toLowerCase();
  const pt = peType(code);
  const lessons = [];
  if (pt) {
    lessons.push({
      title: 'PE — Practical Exam|||PE — Thi thực hành',
      slug: `${lc}-final-exam-pe`,
      type: 'article',
      description: 'Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.',
      content: peContent(pt),
    });
  }
  const feLesson = {
    title: 'FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ',
    slug: `${lc}-final-exam-fe`,
    type: 'article',
    description: 'Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.',
    content: feContent(),
  };
  const qs = sampleQuestions(obj, 6);
  if (qs.length) feLesson.quiz = { timeLimitSeconds: Math.max(180, qs.length * 60), questions: qs };
  lessons.push(feLesson);

  return {
    title: 'Final Exam|||Thi cuối kỳ',
    description: pt
      ? 'Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.'
      : 'Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.',
    lessons,
  };
}

function insertBeforeAnchor(text, sectionObj) {
  const anchor = '  ],\n};';
  const i = text.lastIndexOf(anchor);
  if (i < 0) throw new Error('anchor not found');
  const sec = JSON.stringify(sectionObj, null, 2).replace(/^/gm, '    ');
  return text.slice(0, i) + sec + ',\n' + text.slice(i);
}

const files = fs.readdirSync(ACAD).filter((f) => f.endsWith('.mjs'));
let done = 0, skipped = 0;
for (const f of files) {
  const full = path.join(ACAD, f);
  const mod = await import(pathToFileURL(path.resolve(full)).href + '?t=' + Date.now());
  const obj = mod.default;
  const code = obj.course.courseCode;
  if (ONLY && !ONLY.has(code)) continue;
  const already = (obj.sections || []).some((s) => (s.lessons || []).some((l) => (l.slug || '').includes('-final-exam-')));
  if (already) { console.log('skip (đã có)', code); skipped++; continue; }
  const section = buildSection(code, obj);
  const pt = peType(code);
  const text = fs.readFileSync(full, 'utf8');
  const out = insertBeforeAnchor(text, section);
  if (DRY) {
    console.log(`${code.padEnd(8)} PE=${pt || '-'}  FE-samples=${section.lessons.at(-1).quiz ? section.lessons.at(-1).quiz.questions.length : 0}  lessons+${section.lessons.length}`);
  } else {
    fs.writeFileSync(full, out);
    console.log('OK', code, 'PE=' + (pt || '-'), '+' + section.lessons.length + ' lessons');
  }
  done++;
}
console.log(`\n${DRY ? 'DRY ' : ''}done=${done} skipped=${skipped}`);
