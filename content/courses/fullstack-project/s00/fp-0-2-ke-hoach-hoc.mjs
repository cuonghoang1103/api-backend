/**
 * 0.2 — Cấu trúc 11 chương (soạn 24/11/2026, agent fsp).
 * Output THẬT: luồng nhánh-mỗi-chương trong repo tạm /tmp/fsp-nhanh (Git 2.55.0). Bảng chương bám khung fullstack-project.mjs.
 */
import { lienKet, spring } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'git', bai: 'git-3-1-nhanh-la-gi', title: 'Git Chương 3 — Nhánh & hợp nhất', sub: 'Nhánh là gì bên trong, merge --no-ff khác fast-forward thế nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'agile-teamwork', bai: 'agl-2-3-uoc-luong', title: 'Agile 2.3 — Ước lượng: story point và planning poker', sub: 'Khi làm nhóm (SWP391), ước lượng theo cả nhóm thay vì theo giờ của một người.', cta: 'Mở bài →' }),
].join('\n');

const OUT_NHANH = `$ git switch -c ch1/ke-hoach
Switched to a new branch 'ch1/ke-hoach'
$ # … làm bài 1.1–1.3, mỗi bước một commit …
$ git switch main &amp;&amp; git merge --no-ff ch1/ke-hoach -m "Merge chương 1: kế hoạch và khung repo"
$ git tag -a ch1 -m "Checkpoint 1: repo chạy được, kế hoạch đã viết"
$ git log --graph --oneline --decorate
*   02fb734 (HEAD -&gt; main, tag: ch1) Merge chương 1: kế hoạch và khung repo
|\\
| * f4be3c4 (ch1/ke-hoach) chore: workspace npm, TypeScript, oxlint, Prettier
| * 3552c60 docs: ERD và SQL nháp
| * d8212e4 docs: user story và Definition of Done
|/
* 540d59e (tag: ch0) chore: khởi tạo repo`;

const BANG = (en) => {
  const h = en
    ? ['Ch', 'You build', 'Checkpoint proves', 'Hours', 'Spring Boot twin']
    : ['Ch', 'Bạn dựng', 'Checkpoint chứng minh', 'Giờ', 'Bài Spring Boot tương ứng'];
  const r = [
    ['1', en ? 'Scope, data model, repo + tooling' : 'Phạm vi, mô hình dữ liệu, repo + công cụ', en ? 'npm run dev starts API + web; plan in README' : 'npm run dev chạy API + web; kế hoạch nằm trong README', '6–8', 'sb-0-1, sb-0-2'],
    ['2', en ? 'Express + TS + Prisma + first migration' : 'Express + TS + Prisma + migration đầu', en ? 'migration applies; GET /api/health = 200' : 'migration chạy; GET /api/health = 200', '6–8', 'sb-4-1, sb-6-1, sb-8-2'],
    ['3', en ? 'Register, login, JWT + refresh rotation' : 'Đăng ký, đăng nhập, JWT + xoay vòng refresh', en ? 'three curls: register → login → protected' : 'ba lệnh curl: đăng ký → đăng nhập → route bảo vệ', '8–10', 'sb-9-1 … sb-9-6'],
    ['4', en ? 'Posts CRUD + image upload to storage' : 'CRUD bài viết + tải ảnh lên kho', en ? 'post with a real image, end to end' : 'bài có ảnh thật, từ đầu tới cuối', '8–10', 'sb-4-2, sb-10-2'],
    ['5', en ? 'Comments, likes, cursor pagination, errors' : 'Bình luận, thích, phân trang cursor, lỗi', en ? 'paginated feed with correct counts' : 'feed phân trang, số đếm đúng', '8–10', 'sb-6-3, sb-7-1, sb-5-2'],
    ['6', en ? 'React frontend: API client, auth, forms' : 'Frontend React: lớp gọi API, xác thực, form', en ? 'log in → post → see it in the feed' : 'đăng nhập → đăng bài → thấy trong feed', '10–12', 'sb-12-3, sb-21-2'],
    ['7', en ? 'Live comments with Socket.IO' : 'Bình luận tức thời bằng Socket.IO', en ? 'two tabs see the same comment instantly' : 'hai tab thấy cùng bình luận ngay', '6–8', '—'],
    ['8', en ? 'Unit, integration (real DB), API tests' : 'Test đơn vị, tích hợp (CSDL thật), API', en ? 'npm test green, no fake tests' : 'npm test xanh, không test giả', '8–10', 'sb-11-1 … sb-11-5'],
    ['9', en ? 'Dockerfiles + compose' : 'Dockerfile + compose', en ? 'docker compose up from zero' : 'docker compose up từ số 0', '6–8', 'sb-17-1, sb-17-4'],
    ['10', en ? 'GitHub Actions + branch protection' : 'GitHub Actions + bảo vệ nhánh', en ? 'a failing test blocks the PR' : 'một test đỏ chặn được PR', '5–7', 'sb-17-3'],
    ['11', en ? 'VPS, domain, HTTPS, rollback' : 'VPS, tên miền, HTTPS, lùi bản', en ? 'public URL over HTTPS; rollback rehearsed' : 'địa chỉ công khai có HTTPS; đã tập lùi bản', '8–10', 'sb-21-4'],
  ];
  return `<table><thead><tr>${h.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map((x) => `<tr>${x.map((y) => `<td>${y}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
};

export default {
  title: '0.2 — How the 11 chapters are structured|||0.2 — Cấu trúc 11 chương',
  slug: 'fp-0-2-ke-hoach-hoc',
  type: 'LESSON',
  isFreePreview: true,
  description: '11 chương, mỗi chương 4 bài + 1 quiz, bài cuối luôn là checkpoint; vì sao backend trước, frontend sau, hạ tầng cuối (và khi nào nên deploy sớm); nhánh git mỗi chương + tag (output thật); quy ước commit; lịch học 5–7 tuần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · The map</span>
<h2>Eleven chapters, one rhythm: build, check, tag, move on</h2>
<p class="lead">Every chapter has the same shape so you always know where you are: <strong>three building lessons</strong>, then a <strong>checkpoint lesson</strong> (you write the check script and make it pass), then a <strong>10-question quiz</strong>. Each chapter ends with a merge to <code>main</code> and a tag <code>chN</code>.</p>

<h3>The chapters</h3>
${BANG(true)}
<p>Total: roughly 80–100 hours. At 15–20 hours a week next to school, that is 5–7 weeks — the "project month" of a typical internship-preparation plan.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build</span><span class="lz-d">Three lessons, one commit per step on branch chN/…</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check</span><span class="lz-d">Write scripts/checkpoint-N.mjs; run until 0 failed, then on a clean clone.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Quiz</span><span class="lz-d">10 questions; read every explanation.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Close</span><span class="lz-d">merge --no-ff into main, tag -a chN, write the diary.</span></div>
</div>

<h3>Why backend first, frontend second, infrastructure last</h3>
<ul>
<li><strong>The API is the contract.</strong> Once <code>POST /api/posts</code> is stable and tested with curl, the frontend has a fixed target. Building screens against an API that still changes means redoing screens.</li>
<li><strong>You can test a backend without a UI.</strong> curl and, later, automated tests give fast feedback. A UI on top of a broken API hides where the bug is.</li>
<li><strong>Infrastructure needs something to ship.</strong> Docker, CI and deploy are easier to learn once there is a real app with a database and environment variables.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>The honest counter-argument — "walking skeleton".</strong> Many teams deploy a "hello world" on day one, so deployment problems show up early when they are cheap. That is good practice. In this course we keep the order above to learn one layer at a time, but if you already know Docker, feel free to jump to Chapter 9 after Chapter 2 and keep the stack deployable from then on.</p></div>

<h3>Git: one branch per chapter, a tag per checkpoint</h3>
<p>Work on a branch named after the chapter, commit after each step with a clear message, and merge into <code>main</code> only when the checkpoint passes. Real run:</p>
<div class="out">${OUT_NHANH}</div>
<ul>
<li><code>--no-ff</code> keeps a visible merge commit: the graph shows exactly which commits made up Chapter 1.</li>
<li>Commit messages follow a simple convention: <code>feat:</code> new feature, <code>fix:</code> bug fix, <code>docs:</code>, <code>test:</code>, <code>chore:</code> tooling. Reviewers in companies read history this way, and Chapter 10's CI can check it.</li>
<li>From Chapter 10 on, the branch goes through a pull request on GitHub and CI must be green before merging — the same flow as at work.</li>
</ul>

<h3>Weekly rhythm that survives a school week</h3>
<ul>
<li><strong>3 short sessions (1.5–2 h) on weekdays</strong>: one lesson each, ending with a commit.</li>
<li><strong>1 long session (4–5 h) at the weekend</strong>: checkpoint + quiz + diary.</li>
<li>Never end a session in the middle of a broken state without a note: write "next step" in the diary, so tomorrow starts in 2 minutes, not 20.</li>
</ul>

${spring(true, 'Same chapter order applies if your backend is Spring Boot: Initializr + structure (Ch1), controller + JPA + Flyway (Ch2), Spring Security + JWT (Ch3)… the "Spring Boot twin" column lists the lessons.', [
  ['sb-0-1-cai-dat', 'Spring Boot 0.1 — Install the JDK and create a project with Spring Initializr'],
  ['sb-0-2-cau-truc-du-an', 'Spring Boot 0.2 — Anatomy of a Spring Boot project'],
])}

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok">
<ol>
<li>In your <code>chiase</code> repo from lesson 0.9, create the branch for Chapter 1: <code>git switch -c ch1/ke-hoach</code>.</li>
<li>Put a calendar on paper or in your diary: which days, which chapter, target date for Checkpoint 11.</li>
<li>Commit the plan with message <code>docs: lịch học khoá Full-Stack Project</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>git log --oneline --decorate</code> shows your plan commit on <code>ch1/ke-hoach</code>, above <code>tag: ch0</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">walking skeleton</span><span class="v">The thinnest end-to-end version deployed early, then fleshed out.</span></div>
  <div class="kv"><span class="k">--no-ff merge</span><span class="v">A merge that always creates a merge commit, keeping the branch visible in history.</span></div>
  <div class="kv"><span class="k">conventional commits</span><span class="v">Message prefixes like feat:, fix:, docs: that make history readable and checkable.</span></div>
  <div class="kv"><span class="k">API contract</span><span class="v">The agreed paths, inputs and outputs of the API that frontend and backend both rely on.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>11 chapters × (3 lessons + checkpoint + quiz); ~80–100 hours; 5–7 weeks at 15–20 h/week.</li>
<li>Backend → frontend → infrastructure, because the API is the contract; deploying a skeleton early is a valid alternative.</li>
<li>Branch per chapter, merge with --no-ff when the checkpoint passes, then an annotated tag.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bản đồ</span>
<h2>Mười một chương, một nhịp: dựng, kiểm, gắn tag, đi tiếp</h2>
<p class="lead">Mọi chương có cùng một hình dạng để bạn luôn biết mình đang ở đâu: <strong>ba bài dựng</strong>, rồi một <strong>bài checkpoint</strong> (bạn tự viết script kiểm và làm cho nó đạt), rồi một <strong>bài kiểm tra 10 câu</strong>. Mỗi chương kết thúc bằng một lần merge vào <code>main</code> và một tag <code>chN</code>.</p>

<h3>Các chương</h3>
${BANG(false)}
<p>Tổng cộng khoảng 80–100 giờ. Với 15–20 giờ mỗi tuần bên cạnh việc học ở trường, mất 5–7 tuần — đúng "tháng làm dự án" trong một lộ trình chuẩn bị thực tập điển hình.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dựng</span><span class="lz-d">Ba bài, mỗi bước một commit trên nhánh chN/…</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm</span><span class="lz-d">Viết scripts/checkpoint-N.mjs; chạy tới khi 0 trượt, rồi chạy trên bản clone sạch.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Quiz</span><span class="lz-d">10 câu; đọc mọi phần giải thích.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đóng chương</span><span class="lz-d">merge --no-ff vào main, tag -a chN, ghi nhật ký.</span></div>
</div>

<h3>Vì sao backend trước, frontend sau, hạ tầng cuối</h3>
<ul>
<li><strong>API là bản hợp đồng.</strong> Khi <code>POST /api/posts</code> đã ổn định và kiểm bằng curl, frontend có một đích cố định. Dựng màn hình trên một API còn đang đổi nghĩa là làm lại màn hình.</li>
<li><strong>Backend kiểm được mà không cần giao diện.</strong> curl và, về sau, test tự động cho phản hồi nhanh. Giao diện đặt trên một API hỏng sẽ che mất chỗ lỗi.</li>
<li><strong>Hạ tầng cần có thứ để giao.</strong> Docker, CI và deploy dễ học hơn khi đã có một ứng dụng thật, có cơ sở dữ liệu và biến môi trường.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Lập luận ngược, nói cho công bằng — "walking skeleton" (bộ xương biết đi).</strong> Nhiều đội deploy một trang "hello world" ngay ngày đầu, để vấn đề deploy lộ ra sớm khi còn rẻ. Đó là cách làm tốt. Khoá này giữ thứ tự trên để học từng tầng một, nhưng nếu bạn đã biết Docker, cứ nhảy sang Chương 9 ngay sau Chương 2 và giữ cho hệ thống luôn deploy được từ đó.</p></div>

<h3>Git: mỗi chương một nhánh, mỗi checkpoint một tag</h3>
<p>Làm trên nhánh đặt theo tên chương, commit sau mỗi bước với thông điệp rõ ràng, và chỉ merge vào <code>main</code> khi checkpoint đạt. Chạy thật:</p>
<div class="out">${OUT_NHANH}</div>
<ul>
<li><code>--no-ff</code> giữ lại một commit merge nhìn thấy được: đồ thị cho thấy chính xác những commit nào làm nên Chương 1.</li>
<li>Thông điệp commit theo quy ước đơn giản: <code>feat:</code> tính năng mới, <code>fix:</code> sửa lỗi, <code>docs:</code>, <code>test:</code>, <code>chore:</code> việc công cụ. Người review ở công ty đọc lịch sử theo cách này, và CI ở Chương 10 kiểm được nó.</li>
<li>Từ Chương 10, nhánh đi qua một pull request trên GitHub và CI phải xanh mới được merge — đúng quy trình khi đi làm.</li>
</ul>

<h3>Nhịp tuần sống sót được qua một tuần đi học</h3>
<ul>
<li><strong>3 buổi ngắn (1,5–2 giờ) trong tuần</strong>: mỗi buổi một bài, kết thúc bằng một commit.</li>
<li><strong>1 buổi dài (4–5 giờ) cuối tuần</strong>: checkpoint + quiz + nhật ký.</li>
<li>Đừng bao giờ kết thúc buổi học giữa lúc đang hỏng mà không ghi chú: viết "bước kế tiếp" vào nhật ký, để hôm sau bắt đầu trong 2 phút chứ không phải 20.</li>
</ul>

${spring(false, 'Thứ tự chương giữ nguyên nếu backend của bạn là Spring Boot: Initializr + cấu trúc (Ch1), controller + JPA + Flyway (Ch2), Spring Security + JWT (Ch3)… cột "Bài Spring Boot tương ứng" liệt kê đúng bài.', [
  ['sb-0-1-cai-dat', 'Spring Boot 0.1 — Cài JDK và tạo dự án bằng Spring Initializr'],
  ['sb-0-2-cau-truc-du-an', 'Spring Boot 0.2 — Giải phẫu một dự án Spring Boot'],
])}

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong repo <code>chiase</code> từ bài 0.9, tạo nhánh cho Chương 1: <code>git switch -c ch1/ke-hoach</code>.</li>
<li>Lập lịch trên giấy hoặc trong nhật ký: ngày nào, chương nào, ngày dự kiến đạt Checkpoint 11.</li>
<li>Commit lịch với thông điệp <code>docs: lịch học khoá Full-Stack Project</code>.</li>
</ol>
<p><strong>Xong khi:</strong> <code>git log --oneline --decorate</code> hiện commit lịch học của bạn trên <code>ch1/ke-hoach</code>, nằm trên <code>tag: ch0</code>.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">walking skeleton</span><span class="v">Phiên bản đầu-cuối mỏng nhất, deploy sớm, rồi đắp thịt dần.</span></div>
  <div class="kv"><span class="k">merge --no-ff</span><span class="v">Merge luôn tạo commit merge, giữ nhánh nhìn thấy được trong lịch sử.</span></div>
  <div class="kv"><span class="k">conventional commits</span><span class="v">Tiền tố thông điệp như feat:, fix:, docs: giúp lịch sử dễ đọc và kiểm được.</span></div>
  <div class="kv"><span class="k">API contract (hợp đồng API)</span><span class="v">Các đường dẫn, đầu vào, đầu ra đã thống nhất mà cả frontend lẫn backend dựa vào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>11 chương × (3 bài + checkpoint + quiz); khoảng 80–100 giờ; 5–7 tuần với 15–20 giờ/tuần.</li>
<li>Backend → frontend → hạ tầng, vì API là bản hợp đồng; deploy sớm một bộ xương cũng là lựa chọn đúng.</li>
<li>Mỗi chương một nhánh, merge --no-ff khi checkpoint đạt, rồi gắn tag có chú thích.</li>
</ul>
${THE}
</div>
`,
};
