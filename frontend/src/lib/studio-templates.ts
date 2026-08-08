// studio-templates.ts — built-in script skeletons for the Content
// Studio, in Vietnamese and English.
//
// These ship in the bundle rather than the database because they
// are part of the product, not user data: they version with the
// app, need no migration to change, and are available on a fresh
// install with an empty `script_templates` table. Templates the
// USER saves from their own scripts do live in the DB — the picker
// merges both lists.
//
// ── What makes these different from "insert a heading" ──────────
// Every template carries three things a bare outline does not:
//
//   1. TIME BUDGETS. Each section is annotated with how long it
//      should run. A 15-minute lecture that spends 6 minutes on
//      setup is a lecture nobody finishes, and you cannot see that
//      until you are already editing.
//   2. PROMPTS, not placeholders. Lines read "state the ONE thing
//      they should be able to do after this", not "<intro here>".
//      The prompt does the teaching; the writer answers it.
//   3. FORMAT-SPECIFIC STRUCTURE. Solving an exam paper and
//      teaching a chapter are genuinely different jobs — the exam
//      template loops per question and forces a "why this answer
//      is wrong" beat, which a lecture template has no use for.
//
// Keep the `##` heading convention: the Script tab's outline pane
// and the per-section timing readout both parse it.

import type { ContentType } from '@/types';
import type { StudioText } from './studio-i18n';

export interface BuiltinScriptTemplate {
  /** Stable id — used as a React key and to remember the last
   *  template applied. Never reuse an id for different content. */
  id: string;
  /** Which content type this is written for. `null` = generic. */
  contentType: ContentType | null;
  name: StudioText;
  description: StudioText;
  /** Rough runtime this skeleton is paced for, in minutes.
   *  Shown in the picker so a 60-second Shorts template is never
   *  mistaken for the 20-minute lecture one. */
  minutes: number;
  body: StudioText;
}

// ─── LECTURE ─────────────────────────────────────────────────────
const LECTURE_VI = `## Mở đầu — móc câu (0:00–0:20)
- Nêu MỘT câu hỏi mà người học chưa trả lời được trước khi xem bài này.
- Không chào hỏi dài dòng. Vào thẳng vấn đề.

## Bài này bạn sẽ làm được gì (0:20–0:50)
- Nêu đúng 1–3 mục tiêu, mỗi mục tiêu bắt đầu bằng một ĐỘNG TỪ:
  "viết được…", "phân biệt được…", "gỡ lỗi được…".
- Nói rõ bài này KHÔNG nói gì (để người xem không chờ đợi hụt).

## Kiến thức cần có trước (0:50–1:20)
- Liệt kê những gì người xem phải biết trước.
- Nếu có bài trước trong loạt: nhắc tên và số tập.

## Khái niệm cốt lõi (1:20–5:00)
- Định nghĩa bằng lời của bạn TRƯỚC, định nghĩa sách vở SAU.
- Một hình vẽ / sơ đồ duy nhất cho khái niệm này.
- Câu hỏi kiểm tra nhanh: "nếu ... thì chuyện gì xảy ra?"

## Ví dụ chạy được (5:00–10:00)
- Bắt đầu từ đoạn code NGẮN NHẤT còn chạy được.
- Chạy thật, cho thấy kết quả thật trên màn hình.
- Thêm từng phần một. Sau mỗi lần thêm: chạy lại.

## Lỗi thường gặp (10:00–13:00)
- Cố tình viết sai 2–3 lỗi mà sinh viên hay mắc.
- Cho xem THÔNG BÁO LỖI thật, rồi đọc nó ra thành lời.
- Giải thích vì sao trình biên dịch/thông dịch lại nói như vậy.

## Chốt lại (13:00–14:30)
- Nhắc lại đúng 1–3 mục tiêu ở đầu bài, lần này ở dạng đã hoàn thành.
- Một câu tóm tắt mà người xem có thể chép vào vở.

## Bài tập về nhà + tập sau (14:30–15:00)
- Giao 1 bài tập cụ thể, có thể làm trong 10 phút.
- Nói tập sau là gì và vì sao nên xem tiếp.
`;

const LECTURE_EN = `## Cold open — the hook (0:00–0:20)
- Ask ONE question the learner cannot answer yet.
- No long greeting. Start with the problem.

## What you'll be able to do (0:20–0:50)
- State 1–3 objectives, each starting with a VERB:
  "write…", "tell apart…", "debug…".
- Say what this lesson does NOT cover, so nobody waits for it.

## Prerequisites (0:50–1:20)
- List what the viewer must already know.
- If this is part of a series, name the previous episode.

## The core concept (1:20–5:00)
- Your own words FIRST, the textbook definition second.
- Exactly one diagram for this concept.
- A quick check: "what happens if…?"

## A worked, running example (5:00–10:00)
- Start from the SHORTEST code that still runs.
- Run it for real. Show the real output on screen.
- Add one piece at a time. Re-run after every addition.

## Common mistakes (10:00–13:00)
- Deliberately make the 2–3 mistakes students actually make.
- Show the REAL error message, then read it out loud.
- Explain why the compiler/runtime phrased it that way.

## Wrap up (13:00–14:30)
- Restate the 1–3 objectives, now in the past tense.
- One summary sentence the viewer can copy into their notes.

## Homework + next episode (14:30–15:00)
- Assign one concrete exercise doable in 10 minutes.
- Say what the next episode is and why it follows.
`;

// ─── EXAM SOLVING ────────────────────────────────────────────────
const EXAM_VI = `## Mở đầu (0:00–0:30)
- Nói rõ: đề nào, môn nào, kỳ nào, bao nhiêu câu, bao nhiêu phút.
- Cam kết: "hết video bạn sẽ tự làm lại được đề này."

## Cách đọc đề (0:30–1:30)
- Lướt toàn đề trước khi làm câu nào — chỉ ra câu dễ ăn điểm.
- Phân bổ thời gian: bao nhiêu phút cho mỗi phần.
- Quy tắc bỏ qua: khi nào thì để lại câu khó và quay lại sau.

## Câu 1 — <chép nguyên văn đề>
**Đề hỏi gì:** diễn đạt lại câu hỏi bằng lời của bạn.
**Kiến thức dùng:** nêu tên khái niệm cần dùng.
**Bài giải:** trình bày từng bước, không nhảy bước.
**Đáp án:** <đáp án>
**Vì sao các đáp án khác sai:** nêu rõ từng phương án nhiễu sai ở đâu.
**Bẫy:** người ra đề đang cố lừa bạn ở chỗ nào?

## Câu 2 — <chép nguyên văn đề>
**Đề hỏi gì:**
**Kiến thức dùng:**
**Bài giải:**
**Đáp án:**
**Vì sao các đáp án khác sai:**
**Bẫy:**

<!-- Nhân bản khối trên cho mỗi câu. Giữ nguyên 6 mục —
     phần "vì sao đáp án khác sai" mới là phần dạy được nhiều
     nhất, đừng bỏ. -->

## Những lỗi khiến mất điểm oan
- 3 lỗi trình bày / tính toán hay gặp nhất trong đề này.

## Ôn gì tiếp theo
- Đề này kiểm tra những chủ đề nào → link tới bài giảng tương ứng.
- Đề tiếp theo nên luyện là đề nào.
`;

const EXAM_EN = `## Opening (0:00–0:30)
- State exactly which paper: course, term, question count, time limit.
- Promise: "by the end you'll be able to sit this paper yourself."

## How to read the paper (0:30–1:30)
- Skim every question before answering any — flag the cheap marks.
- Budget the clock: how many minutes per section.
- Skip rule: when to leave a hard question and come back.

## Question 1 — <quote the question verbatim>
**What it's really asking:** restate it in your own words.
**Concept under test:** name it.
**Working:** every step, no jumps.
**Answer:** <answer>
**Why the other options are wrong:** take each distractor apart.
**The trap:** what was the examiner hoping you'd do?

## Question 2 — <quote the question verbatim>
**What it's really asking:**
**Concept under test:**
**Working:**
**Answer:**
**Why the other options are wrong:**
**The trap:**

<!-- Duplicate the block above per question. Keep all six
     headings — "why the other options are wrong" is where most
     of the teaching happens. Don't drop it. -->

## Marks people throw away
- The 3 presentation/arithmetic slips this paper punishes most.

## What to revise next
- Which topics this paper tested → link the matching lectures.
- Which paper to attempt next.
`;

// ─── EXERCISE ────────────────────────────────────────────────────
const EXERCISE_VI = `## Đề bài (0:00–0:45)
- Đọc nguyên văn đề. Không diễn giải vội.
- Nêu rõ đầu vào, đầu ra, ràng buộc.

## Hiểu đề trước khi code (0:45–2:00)
- Tự tay chạy 1 ví dụ nhỏ trên giấy / bảng.
- Trường hợp biên: rỗng, 1 phần tử, giá trị lớn nhất, âm.
- Nói ra thành lời: "vậy bài này thực chất là bài ..."

## Hướng làm ngây thơ trước (2:00–4:00)
- Trình bày cách làm đơn giản nhất, kể cả khi chậm.
- CHẠY nó. Cho thấy nó ra đúng kết quả.
- Vì sao vẫn nên viết bản ngây thơ trước: có mốc để so sánh.

## Cải tiến (4:00–8:00)
- Chỉ ra chỗ chậm/xấu trong bản ngây thơ.
- Sửa từng bước, chạy lại sau mỗi bước.
- So sánh trước/sau bằng số đo thật, không nói chung chung.

## Kiểm thử (8:00–9:30)
- Chạy lại toàn bộ trường hợp biên đã liệt kê ở đầu.
- Cố tình phá: nhập sai kiểu, nhập rỗng.

## Bài tương tự để tự luyện (9:30–10:00)
- Giao 1–2 bài cùng dạng nhưng khác chi tiết.
- Gợi ý: dạng này còn xuất hiện ở đâu trong đề thi.
`;

const EXERCISE_EN = `## The problem (0:00–0:45)
- Read it verbatim. Don't paraphrase yet.
- State the inputs, the outputs, the constraints.

## Understand before coding (0:45–2:00)
- Work one small example by hand, on paper or a whiteboard.
- Edge cases: empty, single element, maximum, negative.
- Say it out loud: "so this is really a … problem".

## The naive solution first (2:00–4:00)
- Write the simplest thing that works, even if it's slow.
- RUN it. Show that it produces the right answer.
- Why bother: it's the baseline everything else is measured against.

## Improve it (4:00–8:00)
- Point at exactly what's slow or ugly in the naive version.
- Fix one thing at a time, re-running after each.
- Compare before/after with real measurements, not adjectives.

## Test it (8:00–9:30)
- Re-run every edge case listed at the top.
- Try to break it: wrong types, empty input.

## Practice problems (9:30–10:00)
- Assign 1–2 problems of the same shape but different details.
- Note where this pattern shows up in the exam.
`;

// ─── PROJECT BUILD ───────────────────────────────────────────────
const PROJECT_VI = `## Sẽ dựng cái gì (0:00–1:00)
- CHO XEM sản phẩm cuối chạy thật, ngay giây đầu tiên.
- Nói rõ: dùng gì, mất bao lâu, cần biết trước những gì.

## Vì sao dựng theo cách này (1:00–2:30)
- Nêu 2 phương án khác và lý do KHÔNG chọn.
- Ràng buộc thật: thời gian, chi phí, quy mô người dùng.

## Chuẩn bị (2:30–4:00)
- Cài đặt, phiên bản chính xác của từng công cụ.
- Cấu trúc thư mục ban đầu.
- Điểm dừng: đến đây phải chạy được "hello world" của dự án.

## Cột mốc 1 — <chức năng nhỏ nhất chạy được>
- Chỉ làm đúng một chức năng, làm cho nó chạy.
- Chạy thử, cho xem kết quả.
- Commit tại đây.

## Cột mốc 2 — <chức năng tiếp theo>
- Làm gì, vì sao thứ tự này.
- Chạy thử.
- Commit.

## Cột mốc 3 — <chức năng tiếp theo>

<!-- Mỗi cột mốc phải KẾT THÚC bằng một trạng thái chạy được.
     Đừng để người xem theo dõi 20 phút rồi mới biết code có chạy
     hay không. -->

## Khi hỏng thì gỡ thế nào (…)
- Giữ lại một lỗi thật xảy ra khi quay — đừng cắt đi.
- Đọc thông báo lỗi, suy luận, sửa.

## Triển khai / bàn giao (…)
- Đưa lên đâu, cấu hình gì, biến môi trường nào.
- Danh sách kiểm tra trước khi coi là xong.

## Mở rộng tiếp (…)
- 3 hướng phát triển tiếp, xếp theo độ khó.
- Link mã nguồn.
`;

const PROJECT_EN = `## What we're building (0:00–1:00)
- SHOW the finished thing running, in the first few seconds.
- State the stack, the time it takes, the assumed knowledge.

## Why build it this way (1:00–2:30)
- Name two alternatives and why you rejected them.
- The real constraints: time, cost, scale.

## Setup (2:30–4:00)
- Installs, with exact versions.
- Starting folder structure.
- Checkpoint: the project's "hello world" must run here.

## Milestone 1 — <smallest thing that works>
- Build exactly one capability, end to end.
- Run it. Show it working.
- Commit here.

## Milestone 2 — <next capability>
- What and why this order.
- Run it.
- Commit.

## Milestone 3 — <next capability>

<!-- Every milestone must END in a running state. Never make the
     viewer follow 20 minutes of typing before finding out whether
     any of it works. -->

## When it breaks (…)
- Keep one real failure that happened while recording. Don't cut it.
- Read the error, reason about it, fix it.

## Ship it (…)
- Where it deploys, what config, which environment variables.
- The pre-launch checklist.

## Where to take it next (…)
- Three extensions, ordered by difficulty.
- Link the source.
`;

// ─── TUTORIAL ────────────────────────────────────────────────────
const TUTORIAL_VI = `## Vấn đề (0:00–0:30)
- Mô tả tình huống bực bội mà công cụ này giải quyết.
- Cho xem "trước khi có nó" trong 10 giây.

## Kết quả (0:30–1:00)
- Cho xem "sau khi có nó". Chính là lý do xem tiếp.

## Cài đặt (1:00–2:00)
- Từng lệnh một, kèm phiên bản.
- Lỗi cài đặt hay gặp và cách xử lý.

## Dùng cơ bản (2:00–5:00)
- Ba thao tác hay dùng nhất, mỗi thao tác một ví dụ chạy thật.

## Mẹo nâng cao (5:00–7:30)
- 2–3 thứ mà tài liệu chính thức không nói rõ.

## Khi nào KHÔNG nên dùng (7:30–8:30)
- Giới hạn thật. Trường hợp nên chọn công cụ khác.

## Tóm tắt (8:30–9:00)
- Bảng lệnh gọn để người xem chụp màn hình.
`;

const TUTORIAL_EN = `## The problem (0:00–0:30)
- Describe the specific frustration this tool removes.
- Show "before" in 10 seconds.

## The payoff (0:30–1:00)
- Show "after". This is what buys the next 8 minutes.

## Install (1:00–2:00)
- One command at a time, with versions.
- The install errors people actually hit, and the fix.

## The basics (2:00–5:00)
- The three things you'll do most, each with a real run.

## Beyond the docs (5:00–7:30)
- 2–3 things the official documentation doesn't make obvious.

## When NOT to use it (7:30–8:30)
- The real limits. When to reach for something else.

## Cheat sheet (8:30–9:00)
- A compact command table worth screenshotting.
`;

// ─── VLOG ────────────────────────────────────────────────────────
const VLOG_VI = `## Hook (0:00–0:05)
- Một câu gây tò mò. Không giới thiệu tên, chưa vội.

## Bối cảnh (0:05–0:20)
- Bạn là ai, chuyện này xảy ra khi nào, vì sao đáng nghe.
- Hứa hẹn: xem hết sẽ được gì.

## Diễn biến (0:20–...)
- Đoạn 1: điều đã xảy ra.
- Đoạn 2: chỗ mọi thứ đi chệch.
- Đoạn 3: bạn đã làm gì.
- Đoạn 4: kết quả thật, kể cả khi không đẹp.

## Bài học (…)
- Một điều bạn sẽ làm khác đi.

## Kêu gọi (…)
- Đúng MỘT hành động: theo dõi / bình luận / bấm link.

## Kết (…)
- Nhắc lại lời hứa ở đầu. Chào.
`;

const VLOG_EN = `## Hook (0:00–0:05)
- One curious line. No name-drop yet.

## Context (0:05–0:20)
- Who you are, when this happened, why it's worth hearing.
- The promise: what they get by staying.

## The story (0:20–…)
- Beat 1: what happened.
- Beat 2: where it went sideways.
- Beat 3: what you did about it.
- Beat 4: the real outcome, including the unflattering part.

## The lesson (…)
- One thing you'd do differently.

## Call to action (…)
- Exactly ONE ask: subscribe / comment / link.

## Outro (…)
- Restate the opening promise. Sign off.
`;

// ─── CODE REVIEW ─────────────────────────────────────────────────
const CODE_REVIEW_VI = `## Đang đọc code gì (0:00–0:45)
- Dự án nào, làm gì, bao nhiêu dòng, ai viết.
- Nói rõ tiêu chí đánh giá: đúng đắn, dễ đọc, hiệu năng, bảo mật?

## Nhìn tổng thể trước (0:45–2:30)
- Cấu trúc thư mục. Điểm vào chương trình.
- Luồng dữ liệu đi từ đâu đến đâu.

## Chỗ làm tốt (2:30–4:30)
- Nêu 2–3 điểm tốt TRƯỚC khi chê. Nói rõ vì sao tốt.

## Vấn đề — theo mức độ nghiêm trọng (4:30–…)
### Nghiêm trọng: <tên vấn đề>
- Đoạn code: <file:dòng>
- Vì sao hỏng: kịch bản cụ thể làm nó sai.
- Sửa thế nào: cho xem code sửa, chạy thật.

### Trung bình: <tên vấn đề>
### Nhỏ / phong cách: <tên vấn đề>

## Nếu tôi viết lại (…)
- Một thay đổi kiến trúc đáng làm, và cái giá của nó.

## Rút ra (…)
- Bài học áp dụng được cho code của chính người xem.
`;

const CODE_REVIEW_EN = `## What we're reading (0:00–0:45)
- Which project, what it does, how many lines, who wrote it.
- State the lens: correctness, readability, performance, security?

## The map first (0:45–2:30)
- Folder structure. Entry point.
- How data flows from end to end.

## What's good (2:30–4:30)
- Two or three genuine strengths BEFORE any criticism, with reasons.

## Problems — by severity (4:30–…)
### Critical: <name>
- The code: <file:line>
- How it breaks: the concrete scenario that makes it wrong.
- The fix: show the corrected code, run it.

### Moderate: <name>
### Minor / style: <name>

## If I were rewriting it (…)
- One architectural change worth making, and what it costs.

## Takeaway (…)
- The lesson that transfers to the viewer's own code.
`;

// ─── SHORTS ──────────────────────────────────────────────────────
const SHORTS_VI = `## Hook (0:00–0:03)
- Câu đầu tiên phải nêu KẾT QUẢ hoặc mâu thuẫn. Không mở bài.
- VD: "90% sinh viên viết vòng lặp này sai."

## Vấn đề (0:03–0:10)
- Cho xem cái sai. Trên màn hình, không kể lể.

## Lời giải (0:10–0:40)
- Đúng MỘT ý. Không rẽ nhánh, không "à mà".
- Chữ to trên màn hình cho ý chính.

## Chốt (0:40–0:50)
- Nhắc lại ý chính bằng đúng một câu.

## Kêu gọi (0:50–0:60)
- Một hành động duy nhất. Ngắn.

<!-- Ngân sách: ~150 từ cho 60 giây. Viết xong hãy đếm. -->
`;

const SHORTS_EN = `## Hook (0:00–0:03)
- The first line states the RESULT or a contradiction. No preamble.
- e.g. "90% of students write this loop wrong."

## The problem (0:03–0:10)
- Show the broken thing on screen. Don't narrate around it.

## The fix (0:10–0:40)
- Exactly ONE idea. No tangents, no "by the way".
- Big on-screen text for the key line.

## The point (0:40–0:50)
- Restate the one idea in a single sentence.

## Call to action (0:50–0:60)
- One ask. Short.

<!-- Budget: ~150 words for 60 seconds. Count when you're done. -->
`;

// ─── LIVESTREAM ──────────────────────────────────────────────────
const LIVE_VI = `<!-- Phát trực tiếp cần KHUNG, không cần từng chữ. Đọc nguyên
     văn khi live nghe rất giả. Mỗi mục dưới đây là một mốc, không
     phải một câu thoại. -->

## Trước khi lên sóng — kiểm tra
- [ ] Micro, mức âm thanh, tai nghe
- [ ] Ánh sáng, khung hình, nền
- [ ] Chia sẻ màn hình đúng cửa sổ cần chia sẻ
- [ ] Tắt thông báo, ẩn tab riêng tư
- [ ] Mạng dự phòng

## Chờ khán giả (0–5 phút)
- Nhạc nền, màn hình chờ, nhắc chủ đề hôm nay.

## Chào + chủ đề (5–8 phút)
- Hôm nay làm gì, bao lâu, có gì đáng ở lại.

## Phần chính — các mốc
- Mốc 1:
- Mốc 2:
- Mốc 3:

## Hỏi đáp
- Câu hỏi chuẩn bị sẵn (phòng khi chat im).

## Kết
- Tóm tắt, hẹn buổi sau, nhắc lưu lại video.
`;

const LIVE_EN = `<!-- A livestream needs a FRAME, not a word-for-word script.
     Reading a script live sounds fake. Each item below is a
     landmark, not a line. -->

## Pre-flight checks
- [ ] Mic, levels, headphones
- [ ] Lighting, framing, background
- [ ] Screen share pointed at the right window
- [ ] Notifications off, private tabs closed
- [ ] Backup connection

## Waiting room (0–5 min)
- Music, holding screen, today's topic on the card.

## Welcome + topic (5–8 min)
- What we're doing, how long, why it's worth staying.

## Main segment — landmarks
- Landmark 1:
- Landmark 2:
- Landmark 3:

## Q&A
- Pre-written questions, in case chat goes quiet.

## Close
- Recap, next session, remind them the VOD stays up.
`;

export const BUILTIN_SCRIPT_TEMPLATES: BuiltinScriptTemplate[] = [
  {
    id: 'lecture-standard',
    contentType: 'LECTURE',
    minutes: 15,
    name: { vi: 'Bài giảng một chương (15 phút)', en: 'Chapter lecture (15 min)' },
    description: {
      vi: 'Khung chuẩn cho một bài giảng Academy: mục tiêu → khái niệm → ví dụ chạy được → lỗi thường gặp → bài tập.',
      en: 'The standard Academy lecture arc: objectives → concept → running example → common mistakes → homework.',
    },
    body: { vi: LECTURE_VI, en: LECTURE_EN },
  },
  {
    id: 'exam-solving',
    contentType: 'EXAM_SOLVING',
    minutes: 20,
    name: { vi: 'Chữa đề thi (theo từng câu)', en: 'Exam paper walkthrough' },
    description: {
      vi: 'Lặp 6 mục cho mỗi câu, trong đó có "vì sao các đáp án khác sai" — phần dạy được nhiều nhất.',
      en: 'Six repeating headings per question, including "why the other options are wrong" — where the teaching is.',
    },
    body: { vi: EXAM_VI, en: EXAM_EN },
  },
  {
    id: 'exercise-walkthrough',
    contentType: 'EXERCISE',
    minutes: 10,
    name: { vi: 'Chữa bài tập / lab', en: 'Exercise / lab walkthrough' },
    description: {
      vi: 'Hiểu đề → làm ngây thơ trước → cải tiến → kiểm thử. Dạy cách nghĩ, không chỉ đáp án.',
      en: 'Understand → naive first → improve → test. Teaches the reasoning, not just the answer.',
    },
    body: { vi: EXERCISE_VI, en: EXERCISE_EN },
  },
  {
    id: 'project-build',
    contentType: 'PROJECT_BUILD',
    minutes: 30,
    name: { vi: 'Làm dự án từ đầu đến cuối', en: 'End-to-end project build' },
    description: {
      vi: 'Chia theo cột mốc, mỗi cột mốc kết thúc ở trạng thái chạy được. Giữ lại một lỗi thật.',
      en: 'Milestone-based; every milestone ends in a running state. Keeps one real failure in.',
    },
    body: { vi: PROJECT_VI, en: PROJECT_EN },
  },
  {
    id: 'tutorial-tool',
    contentType: 'TUTORIAL',
    minutes: 9,
    name: { vi: 'Hướng dẫn một công cụ', en: 'Tool tutorial' },
    description: {
      vi: 'Vấn đề → kết quả → cài đặt → cơ bản → mẹo → khi nào không nên dùng.',
      en: 'Problem → payoff → install → basics → beyond the docs → when not to use it.',
    },
    body: { vi: TUTORIAL_VI, en: TUTORIAL_EN },
  },
  {
    id: 'vlog-story',
    contentType: 'VLOG',
    minutes: 8,
    name: { vi: 'Vlog kể chuyện', en: 'Story vlog' },
    description: {
      vi: 'Hook → bối cảnh → 4 đoạn diễn biến → bài học → một lời kêu gọi duy nhất.',
      en: 'Hook → context → four story beats → the lesson → exactly one call to action.',
    },
    body: { vi: VLOG_VI, en: VLOG_EN },
  },
  {
    id: 'code-review',
    contentType: 'CODE_REVIEW',
    minutes: 15,
    name: { vi: 'Đọc và nhận xét code', en: 'Code review' },
    description: {
      vi: 'Tổng thể trước → khen trước → vấn đề xếp theo mức nghiêm trọng → nếu viết lại.',
      en: 'Map first → strengths first → problems by severity → the rewrite.',
    },
    body: { vi: CODE_REVIEW_VI, en: CODE_REVIEW_EN },
  },
  {
    id: 'shorts-one-idea',
    contentType: 'SHORTS',
    minutes: 1,
    name: { vi: 'Video ngắn — một ý duy nhất', en: 'Shorts — single idea' },
    description: {
      vi: 'Hook 3 giây, đúng một ý, ~150 từ. Đếm chữ trước khi quay.',
      en: '3-second hook, exactly one idea, ~150 words. Count before you record.',
    },
    body: { vi: SHORTS_VI, en: SHORTS_EN },
  },
  {
    id: 'livestream-frame',
    contentType: 'LIVESTREAM',
    minutes: 60,
    name: { vi: 'Khung phát trực tiếp', en: 'Livestream frame' },
    description: {
      vi: 'Danh sách kiểm tra trước sóng + các mốc. Cố ý KHÔNG viết từng câu.',
      en: 'Pre-flight checklist + landmarks. Deliberately NOT word-for-word.',
    },
    body: { vi: LIVE_VI, en: LIVE_EN },
  },
];

/**
 * Templates relevant to a content type: the ones written for it,
 * then every generic one.
 *
 * Nothing is hidden — a user making a VLOG can still pick the
 * lecture skeleton if that is the shape they want. Relevance only
 * controls the order.
 */
export function templatesForType(type: ContentType | null): BuiltinScriptTemplate[] {
  if (!type) return BUILTIN_SCRIPT_TEMPLATES;
  const matching = BUILTIN_SCRIPT_TEMPLATES.filter((t) => t.contentType === type);
  const rest = BUILTIN_SCRIPT_TEMPLATES.filter((t) => t.contentType !== type);
  return [...matching, ...rest];
}

// ─── Checklist presets ───────────────────────────────────────────
// The production tasks that differ by format. A lecture needs
// "slides exported"; a vlog does not. Loaded from the Checklist
// tab, additively — existing items are never removed.

export interface ChecklistPresetItem {
  phase: 'PRE' | 'PRODUCTION' | 'POST' | 'PUBLISH';
  label: StudioText;
}

const SHARED_PRESET: ChecklistPresetItem[] = [
  { phase: 'PRE', label: { vi: 'Sạc pin máy quay + micro', en: 'Charge camera + mic batteries' } },
  { phase: 'PRE', label: { vi: 'Dọn khung hình, kiểm tra ánh sáng', en: 'Clear the frame, check lighting' } },
  { phase: 'PRE', label: { vi: 'Tắt thông báo trên máy tính và điện thoại', en: 'Silence desktop + phone notifications' } },
  { phase: 'PRODUCTION', label: { vi: 'Quay thử 10 giây, nghe lại tiếng', en: 'Record a 10s test, listen back' } },
  { phase: 'PRODUCTION', label: { vi: 'Quay cảnh chèn (b-roll)', en: 'Shoot the b-roll' } },
  { phase: 'POST', label: { vi: 'Dựng bản thô', en: 'Rough cut' } },
  { phase: 'POST', label: { vi: 'Chuẩn hoá âm lượng', en: 'Normalise audio levels' } },
  { phase: 'POST', label: { vi: 'Thêm phụ đề', en: 'Add captions' } },
  { phase: 'PUBLISH', label: { vi: 'Ảnh bìa', en: 'Thumbnail' } },
  { phase: 'PUBLISH', label: { vi: 'Tiêu đề + mô tả + thẻ', en: 'Title + description + tags' } },
  { phase: 'PUBLISH', label: { vi: 'Đặt lịch đăng', en: 'Schedule the post' } },
];

const TEACHING_PRESET: ChecklistPresetItem[] = [
  { phase: 'PRE', label: { vi: 'Chốt mục tiêu bài học (1–3 mục)', en: 'Lock the learning objectives (1–3)' } },
  { phase: 'PRE', label: { vi: 'Chuẩn bị slide / bảng vẽ', en: 'Prepare slides / whiteboard' } },
  { phase: 'PRE', label: { vi: 'Chạy thử toàn bộ code ví dụ', en: 'Run every code example end to end' } },
  { phase: 'PRE', label: { vi: 'Phóng to cỡ chữ trong trình soạn thảo', en: 'Bump the editor font size' } },
  { phase: 'PRE', label: { vi: 'Mở sẵn tab cần dùng, đóng tab riêng tư', en: 'Open the tabs you need, close private ones' } },
  { phase: 'PRODUCTION', label: { vi: 'Quay màn hình ở độ phân giải gốc', en: 'Screen-record at native resolution' } },
  { phase: 'PRODUCTION', label: { vi: 'Đọc to thông báo lỗi khi gặp', en: 'Read error messages out loud' } },
  { phase: 'POST', label: { vi: 'Thêm chương (timestamps) theo dàn ý', en: 'Add chapters from the outline' } },
  { phase: 'POST', label: { vi: 'Phóng to vùng code khi cần', en: 'Zoom in on the code where needed' } },
  { phase: 'PUBLISH', label: { vi: 'Đính kèm mã nguồn / tài liệu', en: 'Attach the source / handout' } },
  { phase: 'PUBLISH', label: { vi: 'Thêm vào playlist của môn học', en: 'Add to the course playlist' } },
  { phase: 'PUBLISH', label: { vi: 'Gắn link bài trước / bài sau', en: 'Link the previous / next episode' } },
];

/**
 * Checklist preset for a content type: the teaching extras are
 * added on top of the shared production tasks for the four
 * academic formats, so a lecture gets both lists and a vlog gets
 * only the shared one.
 */
export function checklistPresetFor(type: ContentType | null): ChecklistPresetItem[] {
  const isTeaching =
    type === 'LECTURE' || type === 'EXAM_SOLVING' || type === 'EXERCISE' || type === 'PROJECT_BUILD';
  return isTeaching ? [...TEACHING_PRESET, ...SHARED_PRESET] : SHARED_PRESET;
}
