/**
 * Web Foundations — Chương 10 (CAPSTONE): Tư duy lập trình, gỡ lỗi & quy trình Git.
 * Đóng khoá: chia nhỏ vấn đề, đọc lỗi + vòng lặp debug, git workflow (branch/PR/merge/conflict),
 * cách học tiếp, và bức tranh full-stack nối mọi chương lại + trỏ sang khoá Node.js/Next.js.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L105 from './s10/wf-10-5-full-stack-picture.mjs';
import L104 from './s10/wf-10-4-keep-learning.mjs';
import L103 from './s10/wf-10-3-git-workflow.mjs';
import L102 from './s10/wf-10-2-reading-errors-debugging.mjs';
import L101 from './s10/wf-10-1-think-like-a-programmer.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 10 — Thinking, debugging & Git workflow|||Chương 10 — Tư duy lập trình, gỡ lỗi & quy trình Git',
  description: 'Chương cuối khoá gói lại thứ quan trọng nhất: cách nghĩ về một vấn đề trước khi gõ code, cách đọc một lỗi thay vì sợ nó, cách làm việc với Git như một lập trình viên thật (nhánh, Pull Request, merge), cách tự học sau khi hết khoá, và một bức tranh tổng kết nối mọi mảnh — trình duyệt, HTTP, server, database — lại với nhau.',
  lessons: [
    /* ─────────────────── 10.0 slide bài giảng ─────────────────── */
    {
      title: '10.0 — Lecture slides: thinking & debugging in 12 slides|||10.0 — Slide bài giảng: tư duy & gỡ lỗi trong 12 slide',
      slug: 'wf-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Chia nhỏ vấn đề, đọc lỗi, vòng lặp gỡ lỗi, quy trình Git và lộ trình học tiếp.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: thinking & debugging in 12 slides</h2>
<p>No new syntax in this deck — it is about how to work. Slides 5 and 6 (reading an error, the debugging loop) are the ones worth rereading whenever you feel stuck.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: tư duy & gỡ lỗi trong 12 slide</h2>
<p>Deck này không có cú pháp mới — nó nói về cách làm việc. Slide 5 và 6 (đọc lỗi, vòng lặp gỡ lỗi) đáng đọc lại mỗi khi bạn thấy bí.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-think', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Chia nhỏ — kỹ năng quan trọng nhất"],
  [4, "Bốn bước trước khi gõ dòng nào"],
  [5, "Đọc thông báo lỗi — từ trên xuống ⭐"],
  [6, "Vòng lặp gỡ lỗi — năm bước"],
  [7, "console.log cho ra thông tin, không phải tiếng ồn"],
  [8, "Rubber duck — nói thành lời"],
  [9, "Quy trình Git thật"],
  [10, "Viết lời nhắn commit"],
  [11, "Bức tranh full-stack"],
  [12, "Học tiếp gì sau khoá này"],
])}
`,
    },

    /* ─────────────────────────── 10.1 ─────────────────────────── */
    L101,

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    L102,

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    L103,

    /* ─────────────────────────── 10.4 ─────────────────────────── */
    L104,

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    L105,

    /* ─────────────────────────── 10.6 quiz ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz (capstone)|||10.6 — Kiểm tra chương 10 (khép khoá)',
      slug: 'wf-10-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về chia nhỏ vấn đề, đọc lỗi, quy trình Git (branch/PR/merge/xung đột), và thói quen tự học — khép lại toàn khoá Web Foundations.',
      content: `
<div class="ml-en"><p class="lead">Ten questions covering the whole capstone chapter: problem decomposition, reading errors and the debugging loop, the Git branch/PR/merge/conflict workflow, and habits for learning after the course ends.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading about Git workflow is not the same as living it. On Code Lab, create branches, commit, open pull requests and resolve a real merge conflict on the Git track.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Input, output, one example</span><span class="lz-t">Then the smallest running version</span><span class="lz-d">A hundred untested lines gives you nothing to bisect. Run after every few lines, even if it only prints.</span></div>
<div class="lz-node"><span class="lz-k">Read the whole error</span><span class="lz-t">The first frame in your own code</span><span class="lz-d">Skip <code>node_modules</code>. Then print the suspect value at each frame going back until you find where it should have had one.</span></div>
<div class="lz-node"><span class="lz-k">Never swallow an error</span><span class="lz-t">An empty catch deletes the evidence</span><span class="lz-d">Handle it, or log the whole error and rethrow. "Make it go away" is not "fix it".</span></div>
<div class="lz-node"><span class="lz-k">Branch, commit small, pull first</span><span class="lz-t">And never force-push a shared branch</span><span class="lz-d">Someone else's commits disappear without warning, and they find out during their next pull.</span></div>
</div>
<p class="note-ct"><strong>You have finished the foundations.</strong> The next thing to do is not another course — it is one small application you designed yourself, with users, a database, and a deploy. Everything you were taught here will be tested by it, and the parts you only half-learned will announce themselves.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-10-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 10 practice set (30 auto-graded exercises)</a></div>
<div class="link-card"><a href="/code-lab/git">Go further → the Git track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu bao trọn chương khép khoá: chia nhỏ vấn đề, đọc lỗi và vòng lặp gỡ lỗi, quy trình Git branch/PR/merge/xung đột, và thói quen tự học sau khi khoá kết thúc.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Đọc về quy trình Git không giống như sống với nó. Trên Code Lab, hãy tạo nhánh, commit, mở pull request và giải quyết một xung đột merge thật ở track Git.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Đầu vào, đầu ra, một ví dụ</span><span class="lz-t">Rồi phiên bản nhỏ nhất chạy được</span><span class="lz-d">Một trăm dòng chưa thử thì chẳng có gì để chia đôi. Hãy chạy sau mỗi vài dòng, dù chỉ để in ra một thứ.</span></div>
<div class="lz-node"><span class="lz-k">Đọc cả cái lỗi</span><span class="lz-t">Khung đầu tiên thuộc mã của bạn</span><span class="lz-d">Bỏ qua <code>node_modules</code>. Rồi in giá trị đáng ngờ ở từng khung ngược về cho tới khi tìm ra chỗ lẽ ra nó phải có giá trị.</span></div>
<div class="lz-node"><span class="lz-k">Đừng bao giờ nuốt một lỗi</span><span class="lz-t">Catch rỗng xoá sạch bằng chứng</span><span class="lz-d">Hãy xử nó, hoặc ghi cả cái lỗi ra rồi ném lại. "Cho nó biến mất" không phải "sửa nó".</span></div>
<div class="lz-node"><span class="lz-k">Tạo nhánh, commit nhỏ, pull trước</span><span class="lz-t">Và đừng bao giờ force-push nhánh dùng chung</span><span class="lz-d">Commit của người khác biến mất không một lời báo, và họ phát hiện ra trong lần pull kế tiếp.</span></div>
</div>
<p class="note-ct"><strong>Bạn đã học xong phần nền tảng.</strong> Việc tiếp theo nên làm không phải là thêm một khoá học nữa — mà là một ứng dụng nhỏ do chính bạn thiết kế, có người dùng, có cơ sở dữ liệu, và có triển khai. Mọi thứ được dạy ở đây sẽ bị nó đem ra thử, và những phần bạn mới học được một nửa sẽ tự lộ ra.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-10-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 10 (30 bài, máy chấm tự động)</a></div>
<div class="link-card"><a href="/code-lab/git">Học sâu hơn → track Git</a></div></div>
${onTapBai('wf-10-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What should you do BEFORE writing real code to solve a new problem?|||Bạn nên làm gì TRƯỚC KHI viết code thật để giải một vấn đề mới?',
            options: [
              'Restate the problem and list the steps in plain language (pseudocode)|||Diễn đạt lại vấn đề và liệt kê các bước bằng ngôn ngữ thường (pseudocode)',
              'Write the most complex, general solution first|||Viết lời giải phức tạp, tổng quát nhất trước',
              'Handle every edge case before anything works|||Xử lý mọi trường hợp biên trước khi có gì chạy được',
              'Start typing code and see what happens|||Bắt đầu gõ code và xem chuyện gì xảy ra',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In decomposing a problem, what comes right after solving the simplest version?|||Khi chia nhỏ một vấn đề, cái gì đến ngay sau khi giải phiên bản đơn giản nhất?',
            options: [
              'Extend it: add edge cases and requirements one at a time, testing after each|||Mở rộng: thêm trường hợp biên và yêu cầu từng cái một, kiểm sau mỗi lần',
              'Delete the plan and start over|||Xoá kế hoạch và bắt đầu lại',
              'Immediately ship it to production|||Lập tức đưa lên production',
              'Rewrite it in a different language|||Viết lại bằng ngôn ngữ khác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see "TypeError: Cannot read properties of undefined (reading name) at app.js:14". What should you check FIRST?|||Bạn thấy "TypeError: Cannot read properties of undefined (reading name) at app.js:14". Bạn nên kiểm cái gì TRƯỚC TIÊN?',
            options: [
              'Line 14 of app.js — the exact location the error points to|||Dòng 14 của app.js — vị trí chính xác mà lỗi chỉ tới',
              'A random unrelated file|||Một file ngẫu nhiên không liên quan',
              'Delete the whole function and rewrite it blindly|||Xoá cả hàm và viết lại mù quáng',
              'Ignore it, the app will still work|||Bỏ qua nó, app vẫn sẽ chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a stack trace tell you?|||Một stack trace cho bạn biết điều gì?',
            options: [
              'The chain of function calls that led to the error, most recent call first|||Chuỗi lời gọi hàm dẫn tới lỗi, cuộc gọi gần nhất trước tiên',
              'How many lines of code the project has|||Dự án có bao nhiêu dòng code',
              'The CSS classes applied to an element|||Các class CSS áp lên một phần tử',
              'The database schema|||Schema của database',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the debugging loop this lesson teaches?|||Vòng lặp gỡ lỗi bài này dạy là gì?',
            options: [
              'Form a hypothesis, test it (e.g. with console.log), confirm or reject, repeat|||Đặt giả thuyết, kiểm tra nó (vd bằng console.log), xác nhận hay bác bỏ, lặp lại',
              'Make random edits until something works|||Sửa ngẫu nhiên cho đến khi có gì đó chạy',
              'Rewrite the whole file from scratch every time|||Viết lại toàn bộ file từ đầu mỗi lần',
              'Wait for someone else to fix it|||Chờ người khác sửa giúp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should new work go on a feature branch instead of directly on main?|||Vì sao việc mới nên nằm trên một nhánh tính năng thay vì trực tiếp trên main?',
            options: [
              'If it goes wrong you can discard the branch and main was never touched|||Nếu sai bạn có thể bỏ nhánh và main chưa từng bị đụng vào',
              'Branches make the code run faster|||Nhánh khiến code chạy nhanh hơn',
              'main cannot store any commits|||main không thể lưu commit nào',
              'It is required by JavaScript syntax|||Nó là bắt buộc theo cú pháp JavaScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the purpose of a Pull Request?|||Mục đích của một Pull Request là gì?',
            options: [
              'Propose merging a branch into main so a teammate can review before it lands|||Đề xuất gộp một nhánh vào main để đồng đội review trước khi nó vào',
              'Permanently delete the main branch|||Xoá vĩnh viễn nhánh main',
              'Download the project for the first time|||Tải dự án lần đầu',
              'Skip code review entirely|||Bỏ qua hoàn toàn việc review code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A merge conflict appears in a file with <<<<<<< and >>>>>>> markers. What do you do?|||Một xung đột merge xuất hiện trong file với dấu <<<<<<< và >>>>>>>. Bạn làm gì?',
            options: [
              'Read both versions, decide what the code should say, remove the markers, then add and commit|||Đọc cả hai bản, quyết định code nên nói gì, xoá dấu đánh dấu, rồi add và commit',
              'Delete the entire file to make the conflict go away|||Xoá cả file để xung đột biến mất',
              'Run a destructive git command immediately without reading|||Chạy ngay một lệnh git phá huỷ mà không đọc',
              'Ignore it — Git resolves conflicts automatically|||Bỏ qua nó — Git tự giải quyết xung đột',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is "tutorial hell"?|||"Tutorial hell" là gì?',
            options: [
              'Endlessly following tutorials without ever building something on your own|||Theo tutorial vô tận mà không bao giờ tự dựng thứ gì một mình',
              'A type of runtime error in JavaScript|||Một loại lỗi runtime trong JavaScript',
              'A Git command for reverting commits|||Một lệnh Git để hoàn tác commit',
              'A required step before every deploy|||Một bước bắt buộc trước mỗi lần deploy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What makes a good question when asking for help with a bug?|||Điều gì khiến một câu hỏi tốt khi nhờ giúp đỡ với một lỗi?',
            options: [
              'A minimal reproducible example, plus expected vs actual behavior and the exact error|||Một ví dụ tái hiện tối thiểu, cộng hành vi mong đợi vs thực tế và lỗi chính xác',
              "Just saying \"it doesn't work\"|||Chỉ nói \"nó không chạy\"",
              'Pasting the entire project with no explanation|||Dán cả dự án mà không giải thích gì',
              'Waiting silently and hoping someone notices|||Im lặng chờ và hy vọng ai đó để ý',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
