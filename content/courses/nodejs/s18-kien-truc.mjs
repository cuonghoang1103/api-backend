/**
 * Node.js — Chương 18: Kiến trúc (chương kết).
 * Số đo lấy từ chính codebase production của cuongthai.com: 244 file .ts,
 * 80.454 dòng, 62 file route, 159 file service, 248 model Prisma,
 * 95 migration, 76 điểm gắn route, khởi động thật 3,63 giây.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 18 — Architecture|||Chương 18 — Kiến trúc',
  description: 'Tầng nào chịu trách nhiệm gì và chuyện gì xảy ra khi ranh giới bị rò — đo trên một codebase 80.454 dòng đang chạy thật: 28 trên 62 file route đi thẳng xuống cơ sở dữ liệu, 248 model trong một lược đồ, và một file 3.607 dòng.',
  lessons: [
    /* ─────────────────────────── 18.1 ─────────────────────────── */
    {
      title: '18.1 — Layers, and the 28 files that skip one|||18.1 — Các tầng, và 28 file đã bỏ qua một tầng',
      slug: 'nodejs-18-1-tang-va-trach-nhiem',
      type: 'VIDEO',
      description: 'Ba tầng của một backend, việc mỗi tầng được phép biết gì, và một phép đếm trên codebase thật cho thấy chính xác 28 trên 62 file route đã xuyên thủng tầng giữa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.1</span>
<h2>Layers, and the 28 files that skip one</h2>
<p class="lead">Seventeen chapters built pieces. This one is about how the pieces are arranged, which is the difference between a codebase you can still change in year three and one everybody is afraid of. Architecture is not diagrams — it is a small number of rules about who is allowed to know what, plus the discipline to notice when a rule has quietly stopped being followed. This lesson measures exactly that on a real 80.454-line backend.</p>

<h3>The three layers, and what each is allowed to know</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Route (HTTP)</span><span class="lz-d">Knows HTTP: paths, status codes, headers, input validation. Knows NO SQL and NO business rules</span></div>
  <div class="lz-layer"><span class="lz-t">Service (business)</span><span class="lz-d">Knows the rules: who may edit what, how the price is calculated, the order of the steps. Does NOT know whether it was called from HTTP or from a background job</span></div>
  <div class="lz-layer"><span class="lz-t">Data (storage)</span><span class="lz-d">Knows how to read and write. Does NOT know why. Prisma, raw SQL, Redis, R2</span></div>
</div>

<p>The value is in the negatives. A service that does not know it was called over HTTP can be reused by a queue worker (chapter 13), a cron job, a CLI script and a test (chapter 14) without changing a line. A route that does not know SQL cannot accidentally ship a query that scans a million rows. Each "does not know" is a class of bug that becomes impossible rather than merely unlikely.</p>

<pre><code>// route — chỉ nói chuyện HTTP
router.post('/notes', requireAuth, async (req, res, next) =&gt; {
  const parsed = createNoteSchema.safeParse(req.body);      // validate (chương 6)
  if (!parsed.success) return res.status(400).json({ fields: parsed.error.issues });
  try {
    const note = await notesService.create(req.user, parsed.data);   // giao việc
    res.status(201).json(note);                                       // dịch sang HTTP
  } catch (e) { next(e); }                                            // lỗi đi ra chỗ khác (chương 5)
});

// service — chỉ nói chuyện sleepệp vụ
async function create(actor, data) {
  if (!actor) throw new AppError('UNAUTHENTICATED', 401);
  if (await repo.slugExists(data.slug)) throw new AppError('SLUG_TAKEN', 409);
  return repo.insert({ ...data, authorId: actor.id });
}</code></pre>

<p>Note what the service throws: <code>AppError('SLUG_TAKEN', 409)</code>, not <code>res.status(409)</code>. It names a business condition and lets the HTTP layer decide how to express it. That is the boundary doing its job — and it is what makes the same service callable from a queue worker where there is no <code>res</code> at all.</p>

<h3>Measuring whether the boundary actually holds</h3>
<p>Layers are easy to draw and easy to leak. The way to know is to count. On the production backend behind this course:</p>

<div class="out">file route có import trực tiếp prisma:     28 / 62   (45%)
file service có import trực tiếp prisma:   61 / 77   (79%)</div>

<div class="danger">
<p><strong>Nearly half the route files talk to the database directly.</strong> The architecture on the whiteboard says route → service → data. The architecture in the repository says that 45% of the time it is route → data, with the middle layer skipped entirely. Nobody decided this. It happened one endpoint at a time, each time for a good local reason — "it is just one query", "there is no business logic here yet" — and each of those judgements was individually defensible.</p>
</div>

<p>The cost arrives later, and it arrives in a specific shape: <strong>the day a rule has to apply everywhere.</strong> Soft-delete, an audit log, a tenant filter, a permission check, a cache. Each of those is one change in a service layer and twenty-eight changes scattered through route files — twenty-eight chances to miss one. Chapter 8 measured what missing one looks like: an IDOR where Binh could read An's note, found because someone went looking, not because anything failed.</p>

<div class="callout">
<p><strong>When skipping the layer is genuinely fine.</strong> A read-only endpoint with no authorisation beyond "logged in", no business rule and no reuse — a dropdown's list of categories, say — gains nothing from a service that only forwards a call. The honest test is not "is there logic today" but <strong>"if a rule had to apply to every note, would this endpoint get it automatically?"</strong> If the answer is no, the layer is load-bearing even when it looks empty.</p>
</div>

<h3>Where the code actually lives</h3>
<div class="out">src/config        5 file      960 dòng
src/middleware    5 file      727 dòng
src/routes       62 file   26.279 dòng
src/services    159 file   49.389 dòng
src/socket        2 file      793 dòng
src/storage       4 file    1.070 dòng
src/utils         5 file      336 dòng
                244 file   80.454 dòng</div>

<p>The ratio is the interesting part: <strong>49.389 lines of service against 26.279 of route, roughly 1,9 to 1.</strong> That is a healthy shape — the business rules outweigh the HTTP plumbing, which is what you want, because the plumbing is the part that is nearly identical in every application and the rules are the part that is yours. A repository where routes outweigh services is usually one where the logic is sitting inside the route handlers.</p>

<h3>The layer nobody names</h3>
<p>There is a fourth thing in that list — <code>src/middleware</code>, 727 lines across 5 files — and it is architecturally distinct from all three layers. Middleware is where <em>cross-cutting</em> concerns live: the things that must happen for every request regardless of what it does. Authentication (chapter 8), the rate limiter (chapter 9), the request id (chapter 15), the error handler (chapter 5).</p>

<p>Cross-cutting concerns belong in middleware precisely because they are the ones you would otherwise have to remember 62 times. The rule of thumb: <strong>if forgetting it in one place is a security bug, it should not be something you can forget.</strong></p>

<div class="pitfall">
<p><strong>A real trap:</strong> middleware order is architecture, not configuration. The request-id middleware in this project sits at position 1b — before helmet, before CORS, before the rate limiter — so that even a request rejected with 429 carries an id. Move it three lines down and every rate-limited request becomes untraceable. There is no test that catches this and no error message; it just quietly stops working on the day you need it.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The layering is real but not enforced, and the 28-of-62 count is the honest measure of that. What holds the system together despite the leak is that the <em>cross-cutting</em> layer is not leaked at all: authentication, the request id, rate limiting and error handling all live in middleware mounted once in <code>src/index.ts</code>, so no route can accidentally opt out of them. That is the right thing to have been strict about — a route that skips the service layer writes a slightly awkward query, while a route that skips <code>requireAuth</code> is an incident. Being deliberate about <em>which</em> boundary is load-bearing is more valuable than being uniformly strict about all of them.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Layering, boundaries and dependency direction</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.1</span>
<h2>Các tầng, và 28 file đã bỏ qua một tầng</h2>
<p class="lead">Mười bảy chương vừa rồi dựng lên các mảnh ghép. Chương này nói về cách sắp xếp các mảnh ấy, vốn là khác biệt giữa một codebase mà năm thứ ba bạn vẫn sửa được với một codebase mà ai cũng sợ. Kiến trúc không phải mấy cái sơ đồ — nó là một số ít quy tắc về việc <em>ai được phép biết cái gì</em>, cộng với kỷ luật để nhận ra lúc một quy tắc đã âm thầm không còn được tuân theo. Bài này đo đúng chuyện đó trên một backend thật 80.454 dòng.</p>

<h3>Ba tầng, và mỗi tầng được phép biết gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Route (HTTP)</span><span class="lz-d">Biết về HTTP: đường dẫn, mã trạng thái, header, validate đầu vào. KHÔNG biết SQL, KHÔNG biết quy tắc nghiệp vụ</span></div>
  <div class="lz-layer"><span class="lz-t">Service (nghiệp vụ)</span><span class="lz-d">Biết quy tắc: ai được sửa cái gì, giá tính thế nào, thứ tự các bước. KHÔNG biết mình đang được gọi từ HTTP hay từ một job nền</span></div>
  <div class="lz-layer"><span class="lz-t">Data (lưu trữ)</span><span class="lz-d">Biết cách đọc và ghi. KHÔNG biết vì sao. Prisma, SQL thô, Redis, R2</span></div>
</div>

<p>Giá trị nằm ở những vế phủ định. Một service không biết mình được gọi qua HTTP thì dùng lại được bởi một worker hàng đợi (chương 13), một job định kỳ, một script dòng lệnh và một bài test (chương 14) mà không phải đổi một dòng. Một route không biết SQL thì không thể vô tình đưa lên một câu truy vấn quét một triệu dòng. Mỗi vế "không biết" là một lớp lỗi trở nên <em>bất khả thi</em> chứ không chỉ là ít xảy ra.</p>

<pre><code>// route — chỉ nói chuyện HTTP
router.post('/notes', requireAuth, async (req, res, next) =&gt; {
  const parsed = createNoteSchema.safeParse(req.body);      // validate (chương 6)
  if (!parsed.success) return res.status(400).json({ fields: parsed.error.issues });
  try {
    const note = await notesService.create(req.user, parsed.data);   // giao việc
    res.status(201).json(note);                                       // dịch sang HTTP
  } catch (e) { next(e); }                                            // lỗi đi ra chỗ khác (chương 5)
});

// service — chỉ nói chuyện sleepệp vụ
async function create(actor, data) {
  if (!actor) throw new AppError('UNAUTHENTICATED', 401);
  if (await repo.slugExists(data.slug)) throw new AppError('SLUG_TAKEN', 409);
  return repo.insert({ ...data, authorId: actor.id });
}</code></pre>

<p>Để ý cái mà service ném ra: <code>AppError('SLUG_TAKEN', 409)</code>, chứ không phải <code>res.status(409)</code>. Nó <em>gọi tên một điều kiện nghiệp vụ</em> và để tầng HTTP quyết định diễn đạt điều đó thế nào. Đó là lúc ranh giới đang làm đúng việc của nó — và đó là thứ khiến cùng service ấy gọi được từ một worker hàng đợi nơi hoàn toàn không có <code>res</code>.</p>

<h3>Đo xem ranh giới có thật sự đứng vững không</h3>
<p>Tầng thì dễ vẽ và dễ rò. Cách để biết là đi đếm. Trên chính cái backend production đứng sau khoá học này:</p>

<div class="out">file route có import trực tiếp prisma:     28 / 62   (45%)
file service có import trực tiếp prisma:   61 / 77   (79%)</div>

<div class="danger">
<p><strong>Gần một nửa số file route nói chuyện thẳng với cơ sở dữ liệu.</strong> Kiến trúc trên bảng trắng nói route → service → data. Kiến trúc trong kho mã nói rằng 45% số lần nó là route → data, tầng giữa bị bỏ qua hoàn toàn. Không ai quyết định chuyện này. Nó xảy ra từng endpoint một, mỗi lần đều có một lý do cục bộ chính đáng — "có mỗi một câu truy vấn thôi mà", "chỗ này chưa có logic nghiệp vụ gì" — và mỗi phán đoán ấy, đứng riêng, đều bảo vệ được.</p>
</div>

<p>Cái giá tới sau, và nó tới theo một hình dạng rất cụ thể: <strong>đúng cái ngày một quy tắc phải áp dụng ở mọi nơi.</strong> Xoá mềm, nhật ký kiểm toán, bộ lọc theo tổ chức, một phép kiểm quyền, một lớp cache. Mỗi thứ đó là <em>một</em> thay đổi ở tầng service và <em>hai mươi tám</em> thay đổi rải rác trong các file route — hai mươi tám cơ hội để sót một chỗ. Chương 8 đã đo cái sót một chỗ ấy trông ra sao: một lỗ IDOR khiến Bình đọc được ghi chú của An, phát hiện ra vì có người đi tìm chứ không phải vì có gì hỏng.</p>

<div class="callout">
<p><strong>Khi nào bỏ qua tầng là thật sự ổn.</strong> Một endpoint chỉ đọc, không có phân quyền nào ngoài "đã đăng nhập", không có quy tắc nghiệp vụ và không được dùng lại ở đâu — ví dụ danh sách danh mục cho một cái dropdown — chẳng được gì từ một service chỉ chuyển tiếp lời gọi. Phép thử trung thực không phải "hôm nay có logic hay không" mà là <strong>"nếu có một quy tắc phải áp cho MỌI ghi chú, endpoint này có tự động được áp không?"</strong> Nếu câu trả lời là không thì cái tầng ấy đang chịu lực ngay cả khi nó trông rỗng.</p>
</div>

<h3>Code thật ra nằm ở đâu</h3>
<div class="out">src/config        5 file      960 dòng
src/middleware    5 file      727 dòng
src/routes       62 file   26.279 dòng
src/services    159 file   49.389 dòng
src/socket        2 file      793 dòng
src/storage       4 file    1.070 dòng
src/utils         5 file      336 dòng
                244 file   80.454 dòng</div>

<p>Tỉ lệ mới là phần thú vị: <strong>49.389 dòng service chọi 26.279 dòng route, khoảng 1,9 trên 1.</strong> Đó là một hình dạng lành mạnh — quy tắc nghiệp vụ nặng hơn phần ống nước HTTP, đúng như bạn muốn, vì phần ống nước là phần gần như giống hệt nhau ở mọi ứng dụng còn quy tắc là phần thuộc về bạn. Một kho mã mà route nặng hơn service thường là kho mã có logic đang nằm bên trong các route handler.</p>

<h3>Cái tầng không ai gọi tên</h3>
<p>Trong danh sách đó có một thứ thứ tư — <code>src/middleware</code>, 727 dòng trong 5 file — và về mặt kiến trúc nó khác hẳn cả ba tầng kia. Middleware là nơi các mối quan tâm <em>cắt ngang</em> trú ngụ: những thứ phải xảy ra ở mọi request bất kể request đó làm gì. Xác thực (chương 8), bộ giới hạn tần suất (chương 9), mã request (chương 15), bộ xử lý lỗi (chương 5).</p>

<p>Mối quan tâm cắt ngang thuộc về middleware chính vì chúng là những thứ mà nếu không thì bạn phải nhớ tới 62 lần. Quy tắc bỏ túi: <strong>nếu quên nó ở một chỗ là một lỗ bảo mật thì nó không nên là thứ bạn có thể quên.</strong></p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> thứ tự middleware là kiến trúc, không phải cấu hình. Middleware mã request trong dự án này nằm ở vị trí 1b — trước helmet, trước CORS, trước bộ giới hạn tần suất — để cả một request bị từ chối bằng 429 cũng mang theo một mã số. Dời nó xuống ba dòng và mọi request bị giới hạn tần suất trở nên không truy vết được. Không có bài test nào bắt được chuyện này và không có thông điệp lỗi nào; nó chỉ lặng lẽ thôi hoạt động vào đúng cái ngày bạn cần tới nó.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Việc phân tầng là có thật nhưng không được cưỡng chế, và con số 28 trên 62 là phép đo trung thực cho điều đó. Cái giữ cho hệ thống đứng vững bất chấp chỗ rò ấy là tầng <em>cắt ngang</em> thì hoàn toàn không rò: xác thực, mã request, giới hạn tần suất và xử lý lỗi đều nằm trong middleware gắn đúng một lần ở <code>src/index.ts</code>, nên không route nào có thể vô tình chọn không dùng chúng. Đó chính là thứ đáng phải nghiêm khắc — một route bỏ qua tầng service thì viết ra một câu truy vấn hơi vụng, còn một route bỏ qua <code>requireAuth</code> là một sự cố. Việc <em>chủ đích</em> chọn ranh giới nào là ranh giới chịu lực có giá trị hơn việc nghiêm khắc đồng đều với tất cả.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Phân tầng, ranh giới và chiều phụ thuộc</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.2 ─────────────────────────── */
    {
      title: '18.2 — Organising by feature, and the 3.607-line file|||18.2 — Tổ chức theo tính năng, và cái file 3.607 dòng',
      slug: 'nodejs-18-2-to-chuc-ma-nguon',
      type: 'VIDEO',
      description: 'Chia thư mục theo loại hay theo tính năng, đo trên phân bố cỡ file thật của 62 route, và cái ngưỡng cho biết khi nào một file đã quá to.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2</span>
<h2>Organising by feature, and the 3.607-line file</h2>
<p class="lead">Where a file lives determines what a developer reads before changing it. Two organising principles compete, both are defensible, and the one you pick early is nearly impossible to change later — so this lesson lays out the trade with numbers from a codebase that has lived with the choice for a year.</p>

<h3>By type, or by feature</h3>
<pre><code>// theo LOẠI — mọi route ở một chỗ, mọi service ở một chỗ
src/routes/notes.routes.ts       src/services/notes.service.ts
src/routes/messages.routes.ts    src/services/messages.service.ts
src/routes/courses.routes.ts     src/services/courses.service.ts

// theo TÍNH NĂNG — mọi thứ của một tính năng ở cùng một chỗ
src/features/notes/    { routes.ts, service.ts, repo.ts, schema.ts, notes.test.ts }
src/features/messages/ { routes.ts, service.ts, repo.ts, schema.ts, messages.test.ts }</code></pre>

<div class="kv-grid">
  <div class="kv"><span>By TYPE — what you gain</span><b>Easy to answer "what does a route look like in this project". Matches most tutorials. A fast start</b></div>
  <div class="kv"><span>By TYPE — what you lose</span><b>Editing ONE feature means opening 4-5 directories. Deleting a feature means hunting it down everywhere</b></div>
  <div class="kv"><span>By FEATURE — what you gain</span><b>One directory = one thing. Deleting the directory deletes the feature. The boundary is visible to the eye</b></div>
  <div class="kv"><span>By FEATURE — what you lose</span><b>Easy to duplicate code between features. It demands discipline about where SHARED code lives</b></div>
</div>

<p>The rule that decides it: <strong>optimise for the change you actually make.</strong> Almost nobody edits "all the routes" — they edit "the notes feature". Organising by type optimises for a navigation pattern that does not match how work arrives. Below roughly ten features the difference is noise; above it, by-feature wins clearly and the migration cost has grown to the point where it will not happen.</p>

<h3>The real distribution</h3>
<p>The backend behind this course is organised by type. Sixty-two route files, sized:</p>

<div class="out">&lt;200 dòng:    28 file
200-500:      19 file
500-1000:      8 file
&gt;1000:         7 file

file to nhất:
  3.607 dòng  src/services/roadmap.seed.ts
  2.554 dòng  src/routes/course.routes.ts
  2.262 dòng  src/services/social.service.ts
  1.764 dòng  src/routes/payment.routes.ts
  1.570 dòng  src/services/messages.service.ts</div>

<p>The shape is healthy at the bottom and honest at the top. <strong>Forty-seven of sixty-two route files are under 500 lines</strong> — those are fine, and they are fine because each corresponds to one feature that stayed one feature. The seven above a thousand are where by-type organisation stopped paying: <code>course.routes.ts</code> at 2.554 lines is not "the courses route", it is enrolment, lessons, progress, quizzes and admin all sharing a file because they all happened to be routes.</p>

<div class="callout">
<p><strong>The threshold that is worth having.</strong> There is no magic number, but there is a useful test: <strong>can you find the function you came for without searching?</strong> Under ~300 lines, scrolling works. Past ~500, you search. Past ~1000, you search and then read carefully because you are no longer sure the thing you found is the only one like it. When a file crosses that last line, it has usually also crossed from "one thing" into "several things that share a prefix" — and that, not the line count, is the real reason to split it.</p>
</div>

<h3>The 3.607-line file, and why it is fine</h3>
<p>The largest file in the repository is <code>roadmap.seed.ts</code> — seed data for 33 learning roadmaps, 1.286 nodes. It is enormous and it is not a problem, which is worth saying out loud because line-count rules applied without judgement generate a lot of pointless refactoring.</p>

<p><strong>Data files and logic files have different rules.</strong> Splitting 3.607 lines of seed data across twelve files makes it harder to read, not easier: nobody navigates it, they search it, and the search works the same either way. Its complexity is <em>flat</em> — 1.286 similar entries, no branching, no interaction between them. Compare with a 2.262-line service file, where complexity is <em>tangled</em>: every function can call every other, and understanding one may require understanding six.</p>

<div class="kv-grid">
  <div class="kv"><span>Flat data (seeds, constants, translations)</span><b>As large as you like. No branching, no interaction. You read it by SEARCHING</b></div>
  <div class="kv"><span>Logic (service, route)</span><b>Starts to hurt around 500 lines. Every function can call every other one</b></div>
  <div class="kv"><span>Configuration (index.ts)</span><b>Allowed to be long if it is STRAIGHT-LINE. 808 lines mounting 76 routes is readable; 808 lines of logic is not</b></div>
</div>

<h3>What actually makes a file hard</h3>
<p>Three signals that matter more than length:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">The number of REASONS to change</span><span class="lz-d">A file that must change when pricing changes, when email changes, and when the schema changes is three features sharing one house</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Import depth</span><span class="lz-d">How many other files must you open to understand this one? Three is fine, ten is not</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">How many people edit it at once</span><span class="lz-d">A file that causes merge conflicts every time is a bottleneck, however long it is</span></div>
</div>

<p>Signal 1 is the useful one and it is old advice with a bad name — "single responsibility" sounds like a rule about size and is actually a rule about <em>reasons to change</em>. A 900-line file that only ever changes when the payment provider changes its API is a good file. A 200-line file that gets touched by three unrelated tickets a week is not.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> splitting a large file by moving functions into new files, with no change to who calls what, produces a codebase that is worse — the same tangle, now spread across eight files so you cannot see it. If the extracted piece still needs to reach back into the original, you have not found a boundary, you have found a page break. A real split leaves both halves independently understandable; if that is not true, leave it as one file until you know where the seam is.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Organised by type at the top level, but with a partial migration toward by-feature visible inside <code>src/services</code>: eight subdirectories — <code>cv/</code>, <code>finance/</code>, <code>games/</code>, <code>interview/</code>, <code>payment/</code>, <code>srs/</code>, <code>techTrends/</code>, <code>voiceHub/</code> — hold 82 of the 159 service files. Those are exactly the features that grew large enough to make the flat directory painful. Nobody planned a migration; the structure bent where the pressure was. That is how organisation usually evolves in a codebase that is being used, and it is a healthier signal than a scheme imposed on day one that nothing has tested.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Project structure and module boundaries</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.2</span>
<h2>Tổ chức theo tính năng, và cái file 3.607 dòng</h2>
<p class="lead">File nằm ở đâu quyết định lập trình viên phải đọc những gì trước khi sửa nó. Hai nguyên tắc tổ chức cạnh tranh nhau, cả hai đều bảo vệ được, và cái bạn chọn sớm thì gần như không đổi được về sau — nên bài này bày ra phép đánh đổi kèm số liệu từ một codebase đã sống chung với lựa chọn ấy suốt một năm.</p>

<h3>Theo loại, hay theo tính năng</h3>
<pre><code>// theo LOẠI — mọi route ở một chỗ, mọi service ở một chỗ
src/routes/notes.routes.ts       src/services/notes.service.ts
src/routes/messages.routes.ts    src/services/messages.service.ts
src/routes/courses.routes.ts     src/services/courses.service.ts

// theo TÍNH NĂNG — mọi thứ của một tính năng ở cùng một chỗ
src/features/notes/    { routes.ts, service.ts, repo.ts, schema.ts, notes.test.ts }
src/features/messages/ { routes.ts, service.ts, repo.ts, schema.ts, messages.test.ts }</code></pre>

<div class="kv-grid">
  <div class="kv"><span>Theo LOẠI — được gì</span><b>Dễ trả lời "route ở dự án này trông thế nào". Khớp với hầu hết bài hướng dẫn. Khởi đầu nhanh</b></div>
  <div class="kv"><span>Theo LOẠI — mất gì</span><b>Sửa MỘT tính năng phải mở 4-5 thư mục. Xoá một tính năng thì phải đi săn khắp nơi</b></div>
  <div class="kv"><span>Theo TÍNH NĂNG — được gì</span><b>Một thư mục = một thứ. Xoá thư mục là xoá xong tính năng. Ranh giới nhìn thấy được bằng mắt</b></div>
  <div class="kv"><span>Theo TÍNH NĂNG — mất gì</span><b>Dễ lặp code giữa các tính năng. Cần kỷ luật về chỗ để mã DÙNG CHUNG</b></div>
</div>

<p>Quy tắc quyết định: <strong>hãy tối ưu cho phép thay đổi mà bạn thật sự làm.</strong> Gần như không ai đi sửa "tất cả các route" — người ta sửa "tính năng ghi chú". Tổ chức theo loại đang tối ưu cho một kiểu điều hướng không khớp với cách công việc thật sự tới. Dưới khoảng mười tính năng thì khác biệt là nhiễu; trên mức đó, theo tính năng thắng rõ rệt và chi phí chuyển đổi đã lớn tới mức sẽ không bao giờ được làm.</p>

<h3>Phân bố thật</h3>
<p>Backend đứng sau khoá học này tổ chức theo loại. Sáu mươi hai file route, xếp theo cỡ:</p>

<div class="out">&lt;200 dòng:    28 file
200-500:      19 file
500-1000:      8 file
&gt;1000:         7 file

file to nhất:
  3.607 dòng  src/services/roadmap.seed.ts
  2.554 dòng  src/routes/course.routes.ts
  2.262 dòng  src/services/social.service.ts
  1.764 dòng  src/routes/payment.routes.ts
  1.570 dòng  src/services/messages.service.ts</div>

<p>Hình dạng này lành mạnh ở phần đáy và trung thực ở phần đỉnh. <strong>Bốn mươi bảy trên sáu mươi hai file route dưới 500 dòng</strong> — chúng ổn, và ổn vì mỗi cái ứng với một tính năng đã ở yên là một tính năng. Bảy cái trên một nghìn dòng là chỗ mà cách tổ chức theo loại thôi có lời: <code>course.routes.ts</code> ở mức 2.554 dòng không phải "route khoá học", nó là ghi danh, bài giảng, tiến độ, bài kiểm tra và phần quản trị dùng chung một file chỉ vì tất cả tình cờ đều là route.</p>

<div class="callout">
<p><strong>Ngưỡng đáng có.</strong> Không có con số thần kỳ, nhưng có một phép thử hữu dụng: <strong>bạn có tìm được cái hàm mình cần mà không phải dùng chức năng tìm kiếm không?</strong> Dưới khoảng 300 dòng, cuộn là ra. Quá 500, bạn phải tìm kiếm. Quá 1000, bạn tìm kiếm rồi còn phải đọc kỹ vì không còn chắc thứ mình tìm ra là thứ duy nhất kiểu đó. Khi một file vượt qua lằn ranh cuối, thường nó cũng đã vượt từ "một thứ" sang "nhiều thứ dùng chung một tiền tố" — và <em>đó</em>, chứ không phải số dòng, mới là lý do thật sự để tách nó.</p>
</div>

<h3>Cái file 3.607 dòng, và vì sao nó ổn</h3>
<p>File to nhất trong kho mã là <code>roadmap.seed.ts</code> — dữ liệu mồi cho 33 lộ trình học, 1.286 node. Nó khổng lồ và nó <em>không</em> phải vấn đề, điều này đáng nói to lên vì những quy tắc đếm dòng áp dụng mà không kèm phán đoán sẽ đẻ ra rất nhiều lần tái cấu trúc vô nghĩa.</p>

<p><strong>File dữ liệu và file logic có luật khác nhau.</strong> Chia 3.607 dòng dữ liệu mồi thành mười hai file làm nó khó đọc hơn chứ không dễ hơn: không ai điều hướng trong đó, người ta tìm kiếm, mà tìm kiếm thì chạy như nhau ở cả hai cách. Độ phức tạp của nó <em>phẳng</em> — 1.286 mục giống nhau, không nhánh rẽ, không tương tác lẫn nhau. So với một file service 2.262 dòng, nơi độ phức tạp là <em>rối</em>: mọi hàm gọi được mọi hàm khác, và hiểu một cái có thể đòi hỏi hiểu sáu cái.</p>

<div class="kv-grid">
  <div class="kv"><span>Dữ liệu phẳng (seed, hằng số, bản dịch)</span><b>To bao nhiêu cũng được. Không nhánh rẽ, không tương tác. Đọc bằng cách TÌM KIẾM</b></div>
  <div class="kv"><span>Logic (service, route)</span><b>Bắt đầu thấy đau quanh 500 dòng. Mỗi hàm gọi được mọi hàm khác</b></div>
  <div class="kv"><span>Cấu hình (index.ts)</span><b>Được phép dài nếu nó THẲNG TUỘT. 808 dòng gắn 76 route thì đọc được; 808 dòng logic thì không</b></div>
</div>

<h3>Cái gì thật sự làm một file trở nên khó</h3>
<p>Ba tín hiệu quan trọng hơn độ dài:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Số LÝ DO để thay đổi</span><span class="lz-d">Một file phải sửa khi giá đổi, khi email đổi, và khi lược đồ đổi = ba tính năng đang trọ chung nhà</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Chiều sâu import</span><span class="lz-d">Phải mở bao nhiêu file khác mới hiểu được file này? Ba là ổn, mười thì không</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Số người sửa nó cùng lúc</span><span class="lz-d">File nào cũng gây xung đột merge thì đó là một điểm nghẽn, bất kể dài bao nhiêu</span></div>
</div>

<p>Tín hiệu 1 là cái hữu dụng nhất và nó là một lời khuyên cũ mang một cái tên tồi — "trách nhiệm đơn nhất" nghe như một quy tắc về kích thước trong khi thực chất nó là quy tắc về <em>lý do để thay đổi</em>. Một file 900 dòng chỉ đổi khi nhà cung cấp thanh toán đổi API là một file tốt. Một file 200 dòng bị ba ticket không liên quan đụng vào mỗi tuần thì không.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> tách một file lớn bằng cách chuyển các hàm sang file mới mà không đổi gì về việc ai gọi cái gì sẽ cho ra một codebase <em>tệ hơn</em> — vẫn mớ rối ấy, giờ trải trên tám file nên bạn không nhìn thấy nó nữa. Nếu mảnh vừa tách ra vẫn phải với ngược về file gốc thì bạn chưa tìm được một ranh giới, bạn mới tìm được một chỗ ngắt trang. Một phép tách thật để lại hai nửa đều hiểu được độc lập; nếu điều đó không đúng thì cứ để nguyên một file cho tới khi biết đường nối nằm ở đâu.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Tổ chức theo loại ở cấp cao nhất, nhưng có một cuộc di cư bán phần sang theo-tính-năng nhìn thấy được bên trong <code>src/services</code>: tám thư mục con — <code>cv/</code>, <code>finance/</code>, <code>games/</code>, <code>interview/</code>, <code>payment/</code>, <code>srs/</code>, <code>techTrends/</code>, <code>voiceHub/</code> — chứa 82 trên 159 file service. Đó chính xác là những tính năng đã lớn tới mức làm cái thư mục phẳng trở nên đau đớn. Không ai lên kế hoạch di cư cả; cấu trúc tự uốn ở chỗ có áp lực. Đó là cách tổ chức thường tiến hoá trong một codebase đang được dùng thật, và nó là tín hiệu lành mạnh hơn một sơ đồ áp đặt từ ngày đầu mà chưa có gì kiểm chứng.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Cấu trúc dự án và ranh giới mô-đun</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.3 ─────────────────────────── */
    {
      title: '18.3 — Coupling: 248 models in one schema|||18.3 — Ghép nối: 248 model trong một lược đồ',
      slug: 'nodejs-18-3-ghep-noi-ranh-gioi',
      type: 'VIDEO',
      description: 'Đo mức ghép nối thật giữa các mô-đun — service nào bị nhiều nơi phụ thuộc nhất, 248 model dùng chung một lược đồ — và ranh giới nào là thật, ranh giới nào chỉ là thư mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>Coupling: 248 models in one schema</h2>
<p class="lead">Two modules are coupled when changing one forces you to change the other. Some coupling is necessary — that is what "the system works together" means. The question architecture answers is <em>which</em> couplings you accept and which you refuse, because the ones you accept quietly determine what you can change later and how expensive every future decision is.</p>

<h3>Measuring it instead of guessing</h3>
<p>Coupling is visible in the import graph. Counting which services other code depends on, in the production backend:</p>

<div class="out">service bị nhiều nơi import nhất:
  7×  pro.service              (kiểm tài storeản Pro)
  5×  social.service
  3×  projectMarkdown.service
  3×  notification.service
  3×  music.service
  2×  quota.service

service gọi service khác:
  6×  myLanguage.ai.service
  5×  pro.service
  4×  email.service
  3×  notification.service</div>

<p><code>pro.service</code> appearing at the top of both lists is the interesting result. Seven modules depend on it, and it depends on five others. That makes it a <strong>hub</strong>: a change to how "is this user Pro" is answered ripples into seven features, and a change in any of its five dependencies ripples back into it. Hubs are not automatically bad — a shared authorisation concept <em>should</em> be shared — but they are where a codebase becomes hard to change without anyone deciding it should.</p>

<div class="kv-grid">
  <div class="kv"><span>HEALTHY coupling</span><b>Many places depending on a STABLE concept: authentication, logging, configuration. They rarely change</b></div>
  <div class="kv"><span>PAINFUL coupling</span><b>Many places depending on something CONSTANTLY CHANGING: a feature service still evolving</b></div>
  <div class="kv"><span>CIRCULAR coupling</span><b>A calls B, B calls A. Neither can be tested alone, neither can be understood alone. Always worth fixing</b></div>
  <div class="kv"><span>HIDDEN coupling</span><b>Two modules sharing a table without importing each other. The import graph CANNOT see it</b></div>
</div>

<h3>The coupling the import graph cannot see</h3>
<p>The last row is the one that matters most and the one no tool reports. Here is the measurement:</p>

<div class="out">prisma/schema.prisma:  248 model, 6.980 dòng, 95 migration
điểm gắn route:        76 app.use('/api/v1/...')</div>

<div class="danger">
<p><strong>248 models in one schema, shared by 76 route groups.</strong> Every feature in the system — courses, messages, music, finance, language, interview, CV builder, games — reads and writes tables in the same database, through the same generated client. Two features that never import each other are still coupled if one adds a column the other's <code>SELECT *</code> now returns, or renames a table the other queries, or holds a lock the other waits on. <strong>The database is the largest shared mutable object in most systems, and it is invisible to every dependency analysis you will run.</strong></p>
</div>

<p>This is not an argument for splitting the database. It is an argument for knowing that the boundary between your modules is only as real as the schema underneath allows. Two "independent" modules sharing a table are one module with two names.</p>

<h3>Which boundaries are real</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">A directory</span><span class="lz-d">is NOT a boundary. Nothing stops you importing straight through it. It is an arrangement for human eyes</span></div>
  <div class="lz-node"><span class="lz-t">A module with explicit exports</span><span class="lz-d">A WEAK boundary. There is a public facade, but people can still import directly into its interior</span></div>
  <div class="lz-node"><span class="lz-t">A separate package / workspace</span><span class="lz-d">A REAL boundary. Importing through it is a compile error. The price: you now manage versions</span></div>
  <div class="lz-node"><span class="lz-t">A separate process (a service)</span><span class="lz-d">The HARDEST boundary. They speak only over the network. And now every call can fail (chapter 16)</span></div>
  <div class="lz-node"><span class="lz-t">A separate database</span><span class="lz-d">The final real boundary. No more JOINs. This is where the pain genuinely begins</span></div>
</div>

<p>Each step down that list makes the boundary harder to violate and makes ordinary work more expensive. The mistake is picking a level for how it sounds rather than for what you need enforced. <strong>A folder called <code>domain/</code> that anything can import from is not a boundary; it is a wish.</strong></p>

<h3>Reducing coupling without splitting anything</h3>
<p>Three techniques that cost nothing structurally:</p>

<p><strong>Depend on a shape, not on a module.</strong> If <code>notesService</code> needs to send email, have it accept a function rather than import <code>emailService</code> — the dependency inverts, the test (chapter 14) passes a fake, and the email module can change freely.</p>

<pre><code>// ghép chặt: notes BIẾT về email
import { sendEmail } from './email.service.js';
async function share(note, to) { await sendEmail(to, 'Ghi chú mới', note.title); }

// ghép lỏng: notes chỉ biết "có một hàm nhận (to, subject, body)"
async function share(note, to, notify) { await notify(to, 'Ghi chú mới', note.title); }</code></pre>

<p><strong>Communicate by event where the caller does not need an answer.</strong> "A note was shared" is a fact; who cares about it — email, notifications, analytics — is not the note module's business. Chapter 13's queue is exactly this boundary made durable: the publisher does not know the subscribers, and a subscriber failing does not fail the request.</p>

<p><strong>Push shared concepts down, not sideways.</strong> If two feature services both need "is this user Pro", that belongs in a layer <em>below</em> both, not in one of them that the other imports. The measured <code>pro.service</code> hub is the right idea; what makes a hub dangerous is when it also depends upward on the features that use it.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the cheapest possible coupling reduction is deleting code. A feature nobody uses still constrains every schema change, appears in every dependency scan, breaks every refactor and must be kept compiling. This project removed the old <code>/admin/messages</code> page on purpose when support threads merged into <code>/messages</code> — and the note "do not recreate it" is in its own instructions, because the strongest force in any codebase is somebody helpfully adding back the thing you deliberately removed.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> One schema, 248 models, 95 migrations, 76 route groups — a monolith by any measure, and coherent because the coupling is mostly one-directional: features depend on shared concepts (<code>pro</code>, <code>notification</code>, <code>quota</code>) and shared concepts do not depend on features. The place this shows strain is exactly where you would predict: <code>social.service.ts</code> at 2.262 lines is imported by five other modules, so it is both a hub and a large file, which is the combination that makes changes slow. Nothing is broken — but that pairing is the single most useful thing an import-graph count tells you about where to look first.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-615"><span class="lc-t">Code Lab · Microservices Architecture with Node.js</span><span class="lc-d">Service boundaries and what they cost</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Decoupling by event instead of by call</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3</span>
<h2>Ghép nối: 248 model trong một lược đồ</h2>
<p class="lead">Hai mô-đun bị ghép nối khi đổi cái này buộc bạn phải đổi cái kia. Một phần ghép nối là cần thiết — đó chính là nghĩa của câu "hệ thống hoạt động cùng nhau". Câu hỏi mà kiến trúc trả lời là bạn <em>chấp nhận</em> những ghép nối nào và <em>từ chối</em> những cái nào, vì những cái bạn chấp nhận sẽ âm thầm quyết định sau này bạn đổi được gì và mỗi quyết định tương lai đắt tới đâu.</p>

<h3>Đo nó thay vì đoán</h3>
<p>Ghép nối nhìn thấy được trong đồ thị import. Đếm xem những service nào bị code khác phụ thuộc vào, trên backend production:</p>

<div class="out">service bị nhiều nơi import nhất:
  7×  pro.service              (kiểm tài storeản Pro)
  5×  social.service
  3×  projectMarkdown.service
  3×  notification.service
  3×  music.service
  2×  quota.service

service gọi service khác:
  6×  myLanguage.ai.service
  5×  pro.service
  4×  email.service
  3×  notification.service</div>

<p>Việc <code>pro.service</code> đứng đầu <em>cả hai</em> danh sách mới là kết quả thú vị. Bảy mô-đun phụ thuộc vào nó, và nó phụ thuộc vào năm cái khác. Điều đó biến nó thành một <strong>đầu mối</strong>: một thay đổi trong cách trả lời câu "người dùng này có phải Pro không" lan ra bảy tính năng, và một thay đổi ở bất kỳ cái nào trong năm phụ thuộc của nó lại lan ngược vào nó. Đầu mối không tự động là xấu — một khái niệm phân quyền dùng chung thì <em>nên</em> được dùng chung — nhưng chúng là nơi một codebase trở nên khó đổi mà không ai quyết định là nó nên thế.</p>

<div class="kv-grid">
  <div class="kv"><span>Ghép nối LÀNH</span><b>Nhiều nơi phụ thuộc vào một khái niệm ỔN ĐỊNH: xác thực, log, cấu hình. Chúng hiếm khi đổi</b></div>
  <div class="kv"><span>Ghép nối ĐAU</span><b>Nhiều nơi phụ thuộc vào một thứ THAY ĐỔI LIÊN TỤC: một service tính năng còn đang tiến hoá</b></div>
  <div class="kv"><span>Ghép nối VÒNG TRÒN</span><b>A gọi B, B gọi A. Không test riêng được cái nào, không hiểu riêng được cái nào. Luôn phải sửa</b></div>
  <div class="kv"><span>Ghép nối ẨN</span><b>Hai mô-đun chia nhau một bảng mà không import nhau. Đồ thị import KHÔNG nhìn thấy nó</b></div>
</div>

<h3>Cái ghép nối mà đồ thị import không nhìn thấy</h3>
<p>Dòng cuối mới là dòng quan trọng nhất và là dòng không công cụ nào báo cáo. Đây là phép đo:</p>

<div class="out">prisma/schema.prisma:  248 model, 6.980 dòng, 95 migration
điểm gắn route:        76 app.use('/api/v1/...')</div>

<div class="danger">
<p><strong>248 model trong một lược đồ, dùng chung bởi 76 nhóm route.</strong> Mọi tính năng trong hệ thống — khoá học, tin nhắn, nhạc, tài chính, ngôn ngữ, phỏng vấn, dựng CV, trò chơi — đều đọc và ghi các bảng trong cùng một cơ sở dữ liệu, qua cùng một client được sinh ra. Hai tính năng chưa bao giờ import lẫn nhau vẫn bị ghép nối nếu một bên thêm một cột mà lệnh <code>SELECT *</code> của bên kia giờ trả về, hoặc đổi tên một bảng bên kia đang truy vấn, hoặc giữ một cái khoá mà bên kia đang chờ. <strong>Cơ sở dữ liệu là object dùng chung có thể thay đổi lớn nhất trong hầu hết hệ thống, và nó vô hình với mọi phép phân tích phụ thuộc bạn sẽ chạy.</strong></p>
</div>

<p>Đây không phải lý lẽ để đi tách cơ sở dữ liệu. Đây là lý lẽ để <em>biết rằng</em> ranh giới giữa các mô-đun của bạn chỉ thật đúng tới mức mà cái lược đồ bên dưới cho phép. Hai mô-đun "độc lập" dùng chung một bảng là một mô-đun mang hai cái tên.</p>

<h3>Ranh giới nào là thật</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Thư mục</span><span class="lz-d">KHÔNG phải ranh giới. Không có gì ngăn bạn import xuyên qua. Chỉ là cách sắp xếp cho mắt người</span></div>
  <div class="lz-node"><span class="lz-t">Mô-đun có export tường minh</span><span class="lz-d">Ranh giới YẾU. Có một mặt tiền công khai, nhưng người ta vẫn import thẳng vào trong được</span></div>
  <div class="lz-node"><span class="lz-t">Gói riêng / workspace</span><span class="lz-d">Ranh giới THẬT. Import xuyên qua là lỗi biên dịch. Cái giá: phải quản lý phiên bản</span></div>
  <div class="lz-node"><span class="lz-t">Tiến trình riêng (dịch vụ)</span><span class="lz-d">Ranh giới CỨNG NHẤT. Chỉ nói chuyện qua mạng. Và giờ mọi lời gọi đều hỏng được (chương 16)</span></div>
  <div class="lz-node"><span class="lz-t">Cơ sở dữ liệu riêng</span><span class="lz-d">Ranh giới thật sự cuối cùng. Không JOIN được nữa. Đây là chỗ cái đau thật sự bắt đầu</span></div>
</div>

<p>Mỗi bước đi xuống trong danh sách đó làm ranh giới khó vi phạm hơn và làm công việc thường ngày đắt hơn. Sai lầm là chọn một mức vì nó <em>nghe hay</em> chứ không phải vì bạn cần cưỡng chế điều gì. <strong>Một thư mục tên <code>domain/</code> mà thứ gì cũng import vào được thì không phải một ranh giới; đó là một điều ước.</strong></p>

<h3>Giảm ghép nối mà không tách gì cả</h3>
<p>Ba kỹ thuật không tốn gì về mặt cấu trúc:</p>

<p><strong>Phụ thuộc vào một HÌNH DẠNG, đừng phụ thuộc vào một mô-đun.</strong> Nếu <code>notesService</code> cần gửi email, hãy để nó nhận vào một hàm thay vì import <code>emailService</code> — chiều phụ thuộc đảo lại, bài test (chương 14) truyền vào một hàng giả, và mô-đun email được tự do thay đổi.</p>

<pre><code>// ghép chặt: notes BIẾT về email
import { sendEmail } from './email.service.js';
async function share(note, to) { await sendEmail(to, 'Ghi chú mới', note.title); }

// ghép lỏng: notes chỉ biết "có một hàm nhận (to, subject, body)"
async function share(note, to, notify) { await notify(to, 'Ghi chú mới', note.title); }</code></pre>

<p><strong>Giao tiếp bằng SỰ KIỆN ở nơi bên gọi không cần câu trả lời.</strong> "Một ghi chú vừa được chia sẻ" là một sự thật; còn ai quan tâm tới nó — email, thông báo, phân tích — không phải việc của mô-đun ghi chú. Hàng đợi của chương 13 chính là cái ranh giới này được làm cho bền: bên phát không biết bên nhận là ai, và một bên nhận hỏng không làm hỏng cái request.</p>

<p><strong>Đẩy khái niệm dùng chung XUỐNG DƯỚI, đừng đẩy sang ngang.</strong> Nếu hai service tính năng cùng cần "người dùng này có Pro không" thì thứ đó thuộc về một tầng <em>bên dưới</em> cả hai, chứ không phải nằm trong một cái rồi cái kia import sang. Đầu mối <code>pro.service</code> đo được ở trên là ý tưởng đúng; cái làm một đầu mối trở nên nguy hiểm là khi nó lại phụ thuộc ngược lên các tính năng đang dùng nó.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> phép giảm ghép nối rẻ nhất có thể có là <em>xoá code đi</em>. Một tính năng không ai dùng vẫn ràng buộc mọi thay đổi lược đồ, vẫn hiện ra trong mọi lần quét phụ thuộc, vẫn làm hỏng mọi lần tái cấu trúc và vẫn phải giữ cho biên dịch được. Dự án này đã cố ý xoá trang <code>/admin/messages</code> cũ khi luồng hỗ trợ được gộp vào <code>/messages</code> — và dòng ghi chú "đừng dựng lại nó" nằm trong chính tài liệu hướng dẫn của nó, vì lực mạnh nhất trong bất kỳ codebase nào là một người tốt bụng thêm trở lại cái thứ bạn đã cố ý bỏ đi.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Một lược đồ, 248 model, 95 migration, 76 nhóm route — một khối nguyên (monolith) theo mọi thước đo, và nó mạch lạc được là vì phần ghép nối phần lớn đi một chiều: các tính năng phụ thuộc vào khái niệm dùng chung (<code>pro</code>, <code>notification</code>, <code>quota</code>) còn khái niệm dùng chung thì không phụ thuộc ngược vào tính năng. Chỗ lộ ra sức căng đúng như bạn đoán được: <code>social.service.ts</code> ở mức 2.262 dòng bị năm mô-đun khác import, nên nó vừa là một đầu mối vừa là một file lớn, đúng cái tổ hợp làm cho việc thay đổi trở nên chậm. Chưa có gì hỏng cả — nhưng cặp đôi ấy là thứ hữu dụng nhất mà một phép đếm đồ thị import nói cho bạn biết về việc nên nhìn vào đâu trước.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-615"><span class="lc-t">Code Lab · Microservices Architecture with Node.js</span><span class="lc-d">Ranh giới dịch vụ và cái giá của chúng</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Gỡ ghép nối bằng sự kiện thay vì bằng lời gọi</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.4 ─────────────────────────── */
    {
      title: '18.4 — Monolith or services: deciding with numbers|||18.4 — Khối nguyên hay tách dịch vụ: quyết định bằng số',
      slug: 'nodejs-18-4-monolith-hay-tach',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-18-4-monolith-hay-tach.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-18-4-monolith-hay-tach.jpg',
        scenario: 'microservices',
        durationSeconds: 14,
        caption: { en: "Splitting the monolith: the broker, and the retry storm", vi: "Tách khối nguyên: broker, và cơn bão thử lại" },
      },
      type: 'VIDEO',
      description: 'Dùng chính số đo của các chương trước để trả lời câu hỏi kiến trúc bị hỏi sai nhiều nhất, và ba dấu hiệu THẬT cho biết đã tới lúc tách một dịch vụ ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4</span>
<h2>Monolith or services: deciding with numbers</h2>
<p class="lead">This is the architecture question people ask first and should ask last. It is usually argued with adjectives — scalable, modern, maintainable — when every input needed to answer it is a number, and most of those numbers are already in this course.</p>

<h3>What splitting actually buys and costs</h3>
<div class="kv-grid">
  <div class="kv"><span>You gain: independent scaling</span><b>Scale the CPU-heavy part on its own. But chapter 16 measured it: for an I/O-bound app, extra processes buy you +5.7%</b></div>
  <div class="kv"><span>You gain: fault isolation</span><b>One service dying does not take the system with it. TRUE — and it needs circuit breakers, retries and fallbacks at every call</b></div>
  <div class="kv"><span>You gain: independent teams</span><b>The only GENUINELY good reason. Service boundaries matching the boundaries of human communication</b></div>
  <div class="kv"><span>You lose: every function call can now FAIL</span><b>Timeouts, retries, partial success. Every network call is a new failure mode</b></div>
  <div class="kv"><span>You lose: no more JOINs</span><b>One query becomes three network calls plus an in-memory join at the application layer</b></div>
  <div class="kv"><span>You lose: transactions disappear</span><b>Chapter 7 proved rollback experimentally. Across two services there is no rollback</b></div>
</div>

<p>The measured numbers from earlier chapters settle several of these without argument. Tracing across service boundaries costs <strong>39,6% of throughput</strong> (chapter 16) and is not optional once a request spans processes — without it, "where did the time go" has no answer at all. A local function call is nanoseconds; the same call over HTTP was measured at <strong>0,14ms with keep-alive and 1,29ms without</strong> (chapter 16), and that is on loopback, not across a network.</p>

<div class="danger">
<p><strong>The cost that is never in the diagram: partial failure.</strong> In a monolith, <code>createOrder()</code> either happens or does not — chapter 7 demonstrated a real transaction rolling back cleanly. Split payment and inventory into two services and there is a state where payment succeeded and inventory failed. That state has to be designed for: idempotency keys, compensating actions, reconciliation jobs, and an operations process for the cases automation misses. Chapter 13 measured a single instance of this class of bug — a non-idempotent job with <code>attempts: 3</code> charged a customer <strong>300,000 dong instead of 100,000</strong>. Distributed systems make that shape of bug the normal case rather than the exception.</p>
</div>

<h3>The three real signals</h3>
<p>None of them is "the codebase is big".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Wildly DIFFERENT scaling profiles</span><span class="lz-d">One part needs 16 cores for CPU-heavy work and the rest needs 2. Chapter 16: clustering wins 3.4× on a CPU route and 1.06× on an I/O one</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Different release cadences</span><span class="lz-d">One part changes daily, the other quarterly and under audit. A shared deploy forces the slow part to bear the fast part's risk</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Teams treading on each other</span><span class="lz-d">Merge conflicts, waiting on each other to deploy, nobody daring to touch the other's file. This is the BEST reason and the least discussed one</span></div>
</div>

<p>Signal 3 is decisive and the other two are usually solvable without splitting. Conway's observation — that systems end up shaped like the organisation that builds them — is the practical core of this decision: <strong>a service boundary that does not match a team boundary is pure cost.</strong> One person maintaining six services has all the failure modes and none of the benefit.</p>

<h3>The middle option nobody names</h3>
<p>Between "one file" and "twelve services" there is a modular monolith: one deployable unit, hard internal boundaries. It gets most of the organisational benefit at none of the network cost:</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">One process, one deploy</span><span class="lz-d">You keep transactions, you keep JOINs, and a function call is still nanoseconds</span></div>
  <div class="lz-layer"><span class="lz-t">Modules with EXPLICIT facades</span><span class="lz-d">Each feature exports a narrow API. Cross-importing into each other's internals is forbidden and enforced by lint</span></div>
  <div class="lz-layer"><span class="lz-t">Tables have owners</span><span class="lz-d">Each module OWNS its tables; other modules read through the facade rather than querying directly</span></div>
  <div class="lz-layer"><span class="lz-t">Splittable later if needed</span><span class="lz-d">The boundaries are already in the right places. Splitting is then just turning function calls into network calls</span></div>
</div>

<p>The third layer is the one that makes the difference and the one that gets skipped. Enforcing "only the courses module queries course tables" is what makes a future split possible; without it, the boundaries exist in the folder tree and not in the data, and the split will be rewritten from scratch.</p>

<div class="callout">
<p><strong>The default that is right far more often than it is chosen.</strong> Start as a monolith with clean internal boundaries. Split only when a specific measured pain arrives — a deploy queue, a scaling profile that genuinely differs, a team that cannot ship. Splitting is reversible in theory and almost never in practice, so the option to wait has real value. Every hour spent on distributed-systems machinery before you have distributed-systems problems is an hour not spent on the product.</p>
</div>

<h3>What the system already does that is service-shaped</h3>
<p>Worth noticing: several things in this course are already boundaries without being separate services.</p>

<div class="kv-grid">
  <div class="kv"><span>The job queue (chapter 13)</span><b>Producer and consumer are loosely coupled through Redis. The worker can become its own process at any time</b></div>
  <div class="kv"><span>R2 / object storage (chapter 10)</span><b>Your files already live in another service. You are already making network calls and already handling their failures</b></div>
  <div class="kv"><span>Redis (chapter 12)</span><b>Shared state living outside the process. This is what makes running multiple replicas possible at all</b></div>
  <div class="kv"><span>Payment gateways, AI APIs</span><b>Already external services. Timeouts, retries, idempotency keys — you have written all of it already</b></div>
</div>

<p>That is the honest framing: <strong>you are already running a distributed system.</strong> The question is not whether to have network boundaries but whether to add more of them <em>inside</em> code you control, where they buy the least and cost the most.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> One backend process, one frontend process, one database, one Redis, on one VPS. By the signals above that is correct on all three counts: the workload is I/O-bound (chapter 16 measured 97,8% of request time inside a database call, and forking gains 5,7% on that shape), everything ships on the same cadence, and there is one person. What the system does have is the <em>useful</em> boundaries — R2 for files, Redis for shared state, external APIs for payments and AI — each of which was adopted because something specific required it. The two places that would split first if the constraints changed are already visible: <code>embedQueue.service.ts</code> (an in-process array queue that its own comments admit loses in-flight jobs on crash) and <code>cron.service.ts</code> (eleven schedules guarded by a single-process flag). Both are correct today and both are the exact pieces a second process would break — which is a much more useful thing to know than an opinion about microservices.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-615"><span class="lc-t">Code Lab · Microservices Architecture with Node.js</span><span class="lc-d">When to split, and what it costs</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Modular monoliths and reversible decisions</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.4</span>
<h2>Khối nguyên hay tách dịch vụ: quyết định bằng số</h2>
<p class="lead">Đây là câu hỏi kiến trúc người ta hỏi đầu tiên và lẽ ra nên hỏi sau cùng. Nó thường được tranh luận bằng tính từ — mở rộng được, hiện đại, dễ bảo trì — trong khi mọi dữ liệu đầu vào cần để trả lời đều là con số, và phần lớn những con số ấy đã có sẵn trong khoá học này.</p>

<h3>Việc tách thật ra mua được gì và tốn gì</h3>
<div class="kv-grid">
  <div class="kv"><span>Được: mở rộng độc lập</span><b>Mở rộng riêng phần nặng CPU. Nhưng chương 16 đo được: app nghẽn I/O thì thêm tiến trình chỉ được +5,7%</b></div>
  <div class="kv"><span>Được: cô lập lỗi</span><b>Một dịch vụ chết không kéo cả hệ thống. THẬT — và cần bộ ngắt mạch, thử lại, phương án dự phòng ở mọi lời gọi</b></div>
  <div class="kv"><span>Được: đội độc lập</span><b>Lý do THẬT SỰ tốt duy nhất. Ranh giới dịch vụ khớp với ranh giới giao tiếp giữa người với người</b></div>
  <div class="kv"><span>Mất: mọi lời gọi hàm giờ HỎNG ĐƯỢC</span><b>Timeout, thử lại, thành công một phần. Mỗi lời gọi mạng là một chế độ hỏng mới</b></div>
  <div class="kv"><span>Mất: không JOIN được nữa</span><b>Một truy vấn duy nhất thành ba lời gọi mạng cộng phép gộp trong bộ nhớ ở tầng ứng dụng</b></div>
  <div class="kv"><span>Mất: transaction biến mất</span><b>Chương 7 chứng minh rollback bằng thực nghiệm. Xuyên qua hai dịch vụ thì không có rollback</b></div>
</div>

<p>Các con số đo được ở những chương trước giải quyết vài mục trong đó mà không cần tranh cãi. Trace xuyên qua ranh giới dịch vụ tốn <strong>39,6% throughput</strong> (chương 16) và nó không còn là tuỳ chọn một khi request trải qua nhiều tiến trình — không có nó thì câu "thời gian đi đâu mất" hoàn toàn không có lời đáp. Một lời gọi hàm cục bộ là nano-giây; cùng lời gọi ấy qua HTTP đo được <strong>0,14ms khi có keep-alive và 1,29ms khi không</strong> (chương 16), mà đó là trên loopback chứ chưa qua mạng thật.</p>

<div class="danger">
<p><strong>Cái giá không bao giờ có trong sơ đồ: hỏng một phần.</strong> Trong một khối nguyên, <code>createOrder()</code> hoặc xảy ra hoặc không — chương 7 đã chứng minh một transaction cuộn ngược sạch sẽ bằng thực nghiệm. Tách thanh toán và kho hàng thành hai dịch vụ thì tồn tại một trạng thái mà thanh toán thành công còn kho hàng thất bại. Trạng thái ấy phải được thiết kế cho: khoá idempotency, hành động bù trừ, job đối soát, và một quy trình vận hành cho những ca mà tự động hoá bỏ sót. Chương 13 đã đo một trường hợp thuộc lớp lỗi này — một job không idempotent với <code>attempts: 3</code> đã trừ của khách <strong>300.000đ thay vì 100.000đ</strong>. Hệ phân tán biến hình dạng lỗi ấy thành trường hợp <em>bình thường</em> chứ không còn là ngoại lệ.</p>
</div>

<h3>Ba dấu hiệu thật</h3>
<p>Không dấu hiệu nào trong đó là "codebase đã to".</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Hồ sơ mở rộng KHÁC HẲN nhau</span><span class="lz-d">Một phần cần 16 nhân cho việc nặng CPU, phần còn lại cần 2. Chương 16: cluster ăn 3,4× ở route CPU và 1,06× ở route I/O</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Nhịp phát hành khác nhau</span><span class="lz-d">Một phần đổi mỗi ngày, phần kia mỗi quý và bị kiểm toán. Deploy chung buộc phần chậm phải gánh rủi ro của phần nhanh</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Đội đang giẫm chân nhau</span><span class="lz-d">Xung đột merge, chờ nhau để deploy, không ai dám sửa file kia. Đây là lý do TỐT NHẤT và là lý do ít được nói tới nhất</span></div>
</div>

<p>Dấu hiệu 3 mang tính quyết định còn hai cái kia thường giải được mà không cần tách. Nhận xét của Conway — rằng hệ thống rốt cuộc mang hình dạng của tổ chức đã xây ra nó — là phần cốt lõi thực dụng của quyết định này: <strong>một ranh giới dịch vụ không khớp với ranh giới của một đội là chi phí thuần tuý.</strong> Một người bảo trì sáu dịch vụ thì có đủ mọi chế độ hỏng mà không có chút lợi ích nào.</p>

<h3>Lựa chọn ở giữa mà không ai gọi tên</h3>
<p>Giữa "một file" và "mười hai dịch vụ" có một khối nguyên có mô-đun: một đơn vị triển khai duy nhất, ranh giới nội bộ cứng. Nó lấy được phần lớn lợi ích về mặt tổ chức mà không phải trả chi phí mạng nào:</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Một tiến trình, một lần deploy</span><span class="lz-d">Vẫn transaction được, vẫn JOIN được, gọi hàm vẫn là nano-giây</span></div>
  <div class="lz-layer"><span class="lz-t">Mô-đun có mặt tiền TƯỜNG MINH</span><span class="lz-d">Mỗi tính năng export một API hẹp. Cấm import chéo vào ruột nhau, cưỡng chế bằng lint</span></div>
  <div class="lz-layer"><span class="lz-t">Bảng thuộc quyền sở hữu</span><span class="lz-d">Mỗi mô-đun SỞ HỮU bảng của mình; mô-đun khác đọc qua mặt tiền chứ không truy vấn thẳng</span></div>
  <div class="lz-layer"><span class="lz-t">Tách được sau này nếu cần</span><span class="lz-d">Ranh giới đã nằm đúng chỗ. Tách chỉ còn là đổi lời gọi hàm thành lời gọi mạng</span></div>
</div>

<p>Tầng thứ ba mới là thứ tạo ra khác biệt và cũng là thứ hay bị bỏ qua. Việc cưỡng chế "chỉ mô-đun khoá học được truy vấn các bảng khoá học" chính là thứ làm cho một lần tách trong tương lai trở nên khả thi; không có nó thì ranh giới tồn tại trong cây thư mục chứ không tồn tại trong dữ liệu, và lần tách ấy sẽ phải viết lại từ đầu.</p>

<div class="callout">
<p><strong>Mặc định đúng thường xuyên hơn nhiều so với số lần nó được chọn.</strong> Hãy bắt đầu bằng một khối nguyên với ranh giới nội bộ sạch sẽ. Chỉ tách khi một nỗi đau <em>cụ thể, đo được</em> xuất hiện — một hàng đợi chờ deploy, một hồ sơ mở rộng thật sự khác nhau, một đội không ship được. Tách thì trên lý thuyết là đảo ngược được và trên thực tế thì gần như không, nên cái quyền được chờ có giá trị thật. Mỗi giờ dành cho bộ máy hệ phân tán trước khi bạn có vấn đề của hệ phân tán là một giờ không dành cho sản phẩm.</p>
</div>

<h3>Những thứ hệ thống đã làm sẵn mà mang hình dạng dịch vụ</h3>
<p>Đáng để ý: vài thứ trong khoá học này vốn đã là ranh giới mà không cần là dịch vụ riêng.</p>

<div class="kv-grid">
  <div class="kv"><span>Hàng đợi job (chương 13)</span><b>Bên phát và bên xử lý ghép lỏng qua Redis. Worker tách ra thành tiến trình riêng lúc nào cũng được</b></div>
  <div class="kv"><span>R2 / object storage (chương 10)</span><b>File đã nằm ở một dịch vụ khác rồi. Bạn đã đang gọi mạng và đã đang xử lý lỗi của nó</b></div>
  <div class="kv"><span>Redis (chương 12)</span><b>Trạng thái dùng chung nằm ngoài tiến trình. Đây là thứ khiến việc chạy nhiều bản sao trở nên khả thi</b></div>
  <div class="kv"><span>Cổng thanh toán, API AI</span><b>Đã là dịch vụ bên ngoài. Timeout, thử lại, khoá idempotency — bạn đã viết cả rồi</b></div>
</div>

<p>Đó là cách nhìn trung thực: <strong>bạn vốn đã đang vận hành một hệ phân tán.</strong> Câu hỏi không phải là có nên có ranh giới mạng hay không, mà là có nên thêm nữa những ranh giới ấy vào <em>bên trong</em> đoạn code bạn kiểm soát hay không, nơi chúng mua được ít nhất và tốn nhiều nhất.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Một tiến trình backend, một tiến trình frontend, một cơ sở dữ liệu, một Redis, trên một VPS. Theo các dấu hiệu ở trên thì điều đó đúng ở cả ba mặt: khối lượng công việc nghẽn ở I/O (chương 16 đo được 97,8% thời gian request nằm trong một lời gọi cơ sở dữ liệu, và rẽ nhánh chỉ được 5,7% với dạng đó), mọi thứ phát hành cùng một nhịp, và chỉ có một người. Cái hệ thống <em>có</em> là những ranh giới <em>hữu dụng</em> — R2 cho file, Redis cho trạng thái dùng chung, API bên ngoài cho thanh toán và AI — mỗi cái được nhận vào vì có một thứ cụ thể đòi hỏi nó. Hai chỗ sẽ tách ra đầu tiên nếu các ràng buộc thay đổi thì đã nhìn thấy được rồi: <code>embedQueue.service.ts</code> (một hàng đợi bằng mảng trong tiến trình mà chính chú thích của nó thừa nhận là mất job đang chạy khi tiến trình sập) và <code>cron.service.ts</code> (mười một lịch chạy được canh bằng một cờ trong một tiến trình). Cả hai đều đúng ở hiện tại và cả hai đều đúng là những mảnh mà một tiến trình thứ hai sẽ phá vỡ — thứ đó hữu dụng hơn nhiều so với một ý kiến về microservices.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-615"><span class="lc-t">Code Lab · Microservices Architecture with Node.js</span><span class="lc-d">Khi nào nên tách, và tách tốn gì</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Khối nguyên có mô-đun và những quyết định đảo ngược được</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.5 ─────────────────────────── */
    {
      title: '18.5 — Decisions you cannot take back|||18.5 — Những quyết định không rút lại được',
      slug: 'nodejs-18-5-quyet-dinh-kho-dao-nguoc',
      type: 'VIDEO',
      description: 'Phân biệt quyết định đảo ngược được với quyết định không, ghi lại LÝ DO chứ không phải cái gì, và cách nợ kỹ thuật thật sự tính lãi — có ví dụ thật từ chính dự án.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.5</span>
<h2>Decisions you cannot take back</h2>
<p class="lead">Most technical decisions are cheap to reverse and get argued about for hours. A few are permanent and get made in five minutes by whoever was typing. This lesson is about telling the two apart, and about the one habit that makes a codebase survivable for the person who inherits it — including you, in eighteen months.</p>

<h3>Two kinds of door</h3>
<div class="kv-grid">
  <div class="kv"><span>A two-way door</span><b>Reversible in an afternoon: the logging library, directory naming, compression level, pool size. DECIDE FAST and fix it if wrong</b></div>
  <div class="kv"><span>A one-way door</span><b>Reversing it costs months: the DB schema, a public API contract, the language, the auth model. DECIDE SLOWLY and write down why</b></div>
</div>

<p>The failure mode is treating them the same. Weeks spent on a two-way door — the eternal ORM debate — while a one-way door is walked through casually: an id exposed in a public URL, an auth model that assumes one user has one role, a table designed for the shape of today's screen.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">The DB schema</span><span class="lz-d">Data OUTLIVES code. Chapter 7 measured it: one failed migration gives you P3018 the first time and then P3009 BLOCKING every deploy after</span></div>
  <div class="lz-node"><span class="lz-t">A public API</span><span class="lz-d">Once external clients use it you cannot change it — you can only add a version. Chapter 6 talks about contracts for exactly this reason</span></div>
  <div class="lz-node"><span class="lz-t">The auth model</span><span class="lz-d">Changing how tokens are generated logs out every user. Chapter 8 measured it: logout-all 401s the very caller who requested it</span></div>
  <div class="lz-node"><span class="lz-t">Identifiers in URLs</span><span class="lz-d">Sequential ids leak your volumes and invite IDOR (chapter 8). Switching to UUIDs later kills every old link</span></div>
  <div class="lz-node"><span class="lz-t">Timezones &amp; time types</span><span class="lz-d">Storing <code>timestamp</code> instead of <code>timestamptz</code> corrupts data in a way you cannot undo. This project has been bitten by it</span></div>
</div>

<h3>Write down why, not what</h3>
<p>The code already says what. Six months later the question is always <em>why</em>, and the answer is usually gone. The cheapest possible fix is a comment that records the alternative you rejected and the reason:</p>

<pre><code>// Vì sao KHÔNG dùng BullMQ ở đây?
// Hàng đợi này chỉ chạy 1 tiến trình và mỗi lần chỉ 1 job. BullMQ thêm
// 22 gói + 13MB và một phụ thuộc Redis nữa cho một thứ mà một cái mảng
// đã làm được. Đánh đổi: nếu tiến trình sập giữa job thì job đang chạy MẤT.
// Giảm nhẹ bằng embeddingStatus + recoverPendingJobs() lúc khởi động.
// Đổi ý khi: có tiến trình thứ hai, hoặc khi mất job trở nên không chấp nhận được.</code></pre>

<p>That comment is worth more than a diagram. It states the decision, the cost that was accepted, the mitigation, and — crucially — <strong>the condition under which the decision should be revisited</strong>. Without that last line, a deliberate trade-off is indistinguishable from an oversight, and the next person either preserves it out of superstition or removes it without knowing what it was protecting.</p>

<div class="callout">
<p><strong>The lightweight version of an ADR.</strong> For decisions bigger than a comment, four headings in a markdown file: <em>Context</em> (what forced a choice), <em>Options</em> (what was considered), <em>Decision</em> (what was chosen), <em>Consequences</em> (what you now cannot do). Ten minutes each, and the point is not the document — it is that writing "what we now cannot do" makes people notice one-way doors before walking through them.</p>
</div>

<h3>How technical debt actually accrues</h3>
<p>The metaphor is good and usually applied to the wrong things. Debt is <strong>a decision that makes future changes more expensive</strong> — not "code I do not like". Ugly code that never changes costs nothing. Clean code with the wrong boundary costs every week.</p>

<div class="kv-grid">
  <div class="kv"><span>DELIBERATE debt</span><b>"Ship it to make the date, knowing it has to be fixed." Fine — if it is written down and somebody remembers</b></div>
  <div class="kv"><span>ACCIDENTAL debt</span><b>"Only now do I see how it should have been done." Unavoidable. This is how you learn</b></div>
  <div class="kv"><span>debt from ROT</span><b>A decision that was right, in circumstances that have changed. Feature flags, backward-compatibility code, a workaround for a bug that has since been fixed</b></div>
  <div class="kv"><span>NOT debt</span><b>Ugly code nobody touches that blocks nothing. Leave it alone</b></div>
</div>

<p>The useful question is never "is this good code" but <strong>"what does this make expensive?"</strong>. The 28 route files bypassing the service layer (lesson 18.1) are debt precisely because they make one specific future change — applying a rule everywhere — cost twenty-eight edits instead of one. A 3.607-line seed file is not debt, because it makes nothing expensive.</p>

<h3>Three that were paid in this project, with receipts</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">The GIPHY key in the client bundle</span><span class="lz-d">Fast and convenient at first. The price: a revoked key, 403s in production, and a backend proxy to write. It is now a permanent rule: a third-party key is NEVER NEXT_PUBLIC_</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Class <code>dark</code> globally for theming</span><span class="lz-d">Right when there is only one theming system. The price: it activated every Tailwind <code>dark:</code> utility inside Notes, breaking that module's own 3-theme switcher. The global theme class is now <code>theme-dark</code></span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Schema drifting away from the migration history</span><span class="lz-d">One manual patch on production. The price: P3009 BLOCKING EVERY subsequent deploy until 6 migrations were resolved by hand</span></div>
</div>

<p>Every one of those was a reasonable local decision that became expensive at a distance. That is what debt is — not carelessness, but a cost deferred to a moment when it will be someone else's problem, frequently your own.</p>

<div class="pitfall">
<p><strong>A real trap:</strong> the most dangerous debt is the kind that <em>works</em>. A schema that is subtly wrong keeps serving requests correctly for a year while every feature built on it inherits the flaw, and by the time it hurts there are 95 migrations and a million rows on top of it. Code that is merely ugly announces itself. Structure that is wrong stays silent until it is expensive.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> This project keeps its decisions in an unusual place: a <code>CLAUDE.md</code> at the repo root with a "Known Error Patterns" table — date, what broke, lesson learned — plus <em>forbidden actions</em> written as absolutes ("never run <code>migrate reset</code>", "never <code>db push</code> against production", "never auto-resolve a failed migration"). Each of those rules is a scar. It works because the rules live next to the code and are read before every change, rather than in a wiki that is written once and never opened. The habit generalises: <strong>a decision record is only useful where the decision is being made.</strong></p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Reversible decisions, ADRs and debt</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.5</span>
<h2>Những quyết định không rút lại được</h2>
<p class="lead">Phần lớn quyết định kỹ thuật đều rẻ để đảo ngược và bị tranh cãi hàng giờ. Một vài quyết định là vĩnh viễn và được đưa ra trong năm phút bởi bất kỳ ai đang gõ. Bài này nói về việc phân biệt hai loại đó, và về một thói quen duy nhất làm cho codebase sống nổi với người thừa kế nó — kể cả bạn, mười tám tháng sau.</p>

<h3>Hai loại cửa</h3>
<div class="kv-grid">
  <div class="kv"><span>Cửa hai chiều</span><b>Đổi lại được trong một buổi chiều: thư viện log, cách đặt tên thư mục, mức nén, cỡ pool. QUYẾT NHANH, sai thì sửa</b></div>
  <div class="kv"><span>Cửa một chiều</span><b>Chi phí đổi lại là nhiều tháng: lược đồ CSDL, hợp đồng API công khai, ngôn ngữ, mô hình xác thực. QUYẾT CHẬM, viết lại lý do</b></div>
</div>

<p>Kiểu hỏng là đối xử với cả hai như nhau. Hàng tuần dành cho một cái cửa hai chiều — cuộc tranh luận bất tận về ORM — trong khi một cái cửa một chiều thì bước qua rất tuỳ tiện: một id lộ ra trong URL công khai, một mô hình phân quyền giả định mỗi người dùng có đúng một vai trò, một cái bảng thiết kế theo hình dạng của cái màn hình hôm nay.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Lược đồ CSDL</span><span class="lz-d">Dữ liệu SỐNG LÂU HƠN code. Chương 7 đã đo: một migration hỏng cho ra P3018 lần đầu rồi P3009 CHẶN mọi lần deploy sau</span></div>
  <div class="lz-node"><span class="lz-t">API công khai</span><span class="lz-d">Một khi có client bên ngoài dùng, bạn không đổi được nữa — chỉ thêm phiên bản. Chương 6 nói về hợp đồng vì lý do này</span></div>
  <div class="lz-node"><span class="lz-t">Mô hình xác thực</span><span class="lz-d">Đổi cách sinh token nghĩa là đăng xuất toàn bộ người dùng. Chương 8 đo được: logout-all làm chính người gọi cũng bị 401</span></div>
  <div class="lz-node"><span class="lz-t">Định danh trong URL</span><span class="lz-d">Id tuần tự lộ số lượng và mời gọi IDOR (chương 8). Đổi sang UUID về sau = mọi link cũ chết</span></div>
  <div class="lz-node"><span class="lz-t">Múi giờ &amp; kiểu thời gian</span><span class="lz-d">Lưu <code>timestamp</code> thay vì <code>timestamptz</code> làm hỏng dữ liệu theo cách không sửa ngược được. Dự án này đã dính</span></div>
</div>

<h3>Ghi lại VÌ SAO, đừng ghi CÁI GÌ</h3>
<p>Code đã nói cái gì rồi. Sáu tháng sau, câu hỏi luôn là <em>vì sao</em>, và câu trả lời thường đã biến mất. Phép sửa rẻ nhất có thể là một dòng chú thích ghi lại phương án bạn đã từ chối và lý do:</p>

<pre><code>// Vì sao KHÔNG dùng BullMQ ở đây?
// Hàng đợi này chỉ chạy 1 tiến trình và mỗi lần chỉ 1 job. BullMQ thêm
// 22 gói + 13MB và một phụ thuộc Redis nữa cho một thứ mà một cái mảng
// đã làm được. Đánh đổi: nếu tiến trình sập giữa job thì job đang chạy MẤT.
// Giảm nhẹ bằng embeddingStatus + recoverPendingJobs() lúc khởi động.
// Đổi ý khi: có tiến trình thứ hai, hoặc khi việc mất job trở nên không chấp nhận được.</code></pre>

<p>Dòng chú thích đó đáng giá hơn một cái sơ đồ. Nó nêu quyết định, cái giá đã chấp nhận, cách giảm nhẹ, và — quan trọng nhất — <strong>điều kiện để xem xét lại quyết định ấy</strong>. Không có dòng cuối đó, một phép đánh đổi có chủ đích trông không khác gì một sự sơ suất, và người tiếp theo hoặc giữ nguyên nó vì mê tín hoặc gỡ nó đi mà không biết nó đang bảo vệ cái gì.</p>

<div class="callout">
<p><strong>Phiên bản nhẹ của một ADR.</strong> Với những quyết định lớn hơn một dòng chú thích, hãy dùng bốn đề mục trong một file markdown: <em>Bối cảnh</em> (cái gì buộc phải chọn), <em>Phương án</em> (đã cân nhắc những gì), <em>Quyết định</em> (chọn gì), <em>Hệ quả</em> (giờ bạn KHÔNG làm được gì nữa). Mỗi cái mười phút, và điểm mấu chốt không nằm ở cái tài liệu — nó nằm ở chỗ việc phải viết ra "giờ chúng ta không làm được gì nữa" khiến người ta nhận ra những cái cửa một chiều <em>trước khi</em> bước qua.</p>
</div>

<h3>Nợ kỹ thuật thật sự tích luỹ như thế nào</h3>
<p>Phép ẩn dụ này hay và thường bị áp vào sai thứ. Nợ là <strong>một quyết định làm cho những thay đổi tương lai đắt hơn</strong> — không phải "code mà tôi không thích". Code xấu mà không bao giờ đổi thì chẳng tốn gì. Code sạch mà sai ranh giới thì tốn tiền mỗi tuần.</p>

<div class="kv-grid">
  <div class="kv"><span>Nợ CÓ CHỦ ĐÍCH</span><b>"Ship trước cho kịp, biết là phải sửa." Ổn — nếu có ghi lại và có ai đó nhớ</b></div>
  <div class="kv"><span>Nợ VÔ TÌNH</span><b>"Giờ mới biết lẽ ra nên làm thế kia." Không tránh được. Đây là cách bạn học</b></div>
  <div class="kv"><span>Nợ do THỐI RỮA</span><b>Quyết định vốn đúng, nhưng hoàn cảnh đã đổi. Cờ tính năng, code tương thích ngược, giải pháp tạm cho một bug đã được sửa</b></div>
  <div class="kv"><span>KHÔNG phải nợ</span><b>Code xấu mà không ai đụng tới, và không chặn thứ gì. Bỏ qua đi</b></div>
</div>

<p>Câu hỏi hữu dụng không bao giờ là "code này có tốt không" mà là <strong>"cái này làm cho việc gì trở nên đắt?"</strong>. 28 file route bỏ qua tầng service (bài 18.1) là nợ chính vì chúng làm cho một thay đổi tương lai cụ thể — áp một quy tắc ở mọi nơi — tốn hai mươi tám lần sửa thay vì một. Một file seed 3.607 dòng thì không phải nợ, vì nó không làm gì trở nên đắt cả.</p>

<h3>Ba khoản đã trả trong dự án này, kèm hoá đơn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Khoá GIPHY nằm trong bundle client</span><span class="lz-d">Nhanh và tiện lúc đầu. Trả giá: khoá bị thu hồi, 403 ở production, phải viết proxy backend. Giờ thành quy tắc vĩnh viễn: khoá bên thứ ba KHÔNG bao giờ là NEXT_PUBLIC_</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Class <code>dark</code> toàn cục cho theme</span><span class="lz-d">Đúng khi chỉ có một hệ theme. Trả giá: nó kích hoạt mọi utility <code>dark:</code> của Tailwind bên trong Notes, phá vỡ bộ chuyển 3 theme của chính module đó. Giờ theme toàn cục là <code>theme-dark</code></span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Lược đồ trôi khỏi lịch sử migration</span><span class="lz-d">Vá tay lên production một lần. Trả giá: P3009 CHẶN MỌI lần deploy về sau cho tới khi 6 migration được resolve thủ công</span></div>
</div>

<p>Mỗi cái trong số đó đều là một quyết định cục bộ hợp lý mà trở nên đắt đỏ từ xa. Nợ là như vậy — không phải sự cẩu thả, mà là một cái giá được hoãn lại tới một khoảnh khắc mà nó sẽ là vấn đề của người khác, và thường xuyên là của chính bạn.</p>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> khoản nợ nguy hiểm nhất là loại vẫn <em>chạy tốt</em>. Một lược đồ sai một cách tinh vi vẫn phục vụ request đúng đắn suốt một năm trong khi mọi tính năng xây trên nó đều thừa hưởng cái khiếm khuyết ấy, và tới lúc nó gây đau thì đã có 95 migration và một triệu dòng dữ liệu nằm đè lên. Code chỉ xấu thôi thì nó tự tố cáo mình. Cấu trúc sai thì im lặng cho tới lúc nó đắt.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Dự án này giữ các quyết định ở một chỗ khá lạ: một file <code>CLAUDE.md</code> ở gốc kho mã với một bảng "Known Error Patterns" — ngày tháng, cái gì hỏng, bài học rút ra — cộng với các <em>hành động bị cấm</em> viết dưới dạng tuyệt đối ("không bao giờ chạy <code>migrate reset</code>", "không bao giờ <code>db push</code> lên production", "không bao giờ tự động resolve một migration hỏng"). Mỗi quy tắc trong đó là một vết sẹo. Nó hiệu quả vì các quy tắc nằm <em>ngay cạnh code</em> và được đọc trước mỗi lần thay đổi, chứ không nằm trong một wiki viết một lần rồi không ai mở nữa. Thói quen này tổng quát hoá được: <strong>một bản ghi quyết định chỉ hữu dụng ở nơi quyết định đang được đưa ra.</strong></p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Quyết định đảo ngược được, ADR và nợ kỹ thuật</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.6 ─────────────────────────── */
    {
      title: '18.6 — Eighteen chapters, one system|||18.6 — Mười tám chương, một hệ thống',
      slug: 'nodejs-18-6-tong-ket-khoa-hoc',
      type: 'VIDEO',
      description: 'Bản đồ toàn khoá: mỗi chương đã thêm gì vào hệ thống, những phép đo đáng nhớ nhất, và một danh sách kiểm trước khi đưa backend Node đầu tiên của bạn lên production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.6</span>
<h2>Eighteen chapters, one system</h2>
<p class="lead">This course started with <code>var</code> in a loop printing 3 3 3 and ends here. Along the way it built one backend and measured it at every layer — never quoting a number that was not produced by running something. This closing lesson is a map: what each chapter added, and the single measurement from each that is worth carrying.</p>

<h3>The system, chapter by chapter</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">1-4 · Foundations</span><span class="lz-d">JavaScript for the backend · V8 + libuv + the event loop · core modules · npm and the lockfile. <strong>Đo:</strong> a blocking 3e9-iteration loop costs 2,873ms of lag; streaming 348MB uses 120MB of RAM against readFileSync's 395MB</span></div>
  <div class="lz-layer"><span class="lz-t">5-6 · HTTP</span><span class="lz-d">Express, middleware, error handling · REST design, validation, pagination. <strong>Đo:</strong> Express 4 hangs the request on an async throw while Express 5 returns 500; OFFSET 999980 scans all 1 million rows where a cursor takes 0.015ms</span></div>
  <div class="lz-layer"><span class="lz-t">7 · Data</span><span class="lz-d">PostgreSQL + Prisma, relations, transactions, indexes. <strong>Đo:</strong> an index turns 28.6ms into 0.129ms (222×); N+1 goes from 51 queries to 2</span></div>
  <div class="lz-layer"><span class="lz-t">8-9 · Security</span><span class="lz-d">Password hashing, JWTs, authorisation · headers, XSS, ReDoS, SSRF, secrets. <strong>Đo:</strong> bcrypt at cost 12 is 328,000× slower than sha256 — that is the point; XSS steals a session cookie end to end</span></div>
  <div class="lz-layer"><span class="lz-t">10-11 · Content &amp; realtime</span><span class="lz-d">Uploads, object storage, image processing · WebSocket, Socket.IO, adapters. <strong>Đo:</strong> a pre-signed URL does NOT constrain Content-Type; polling burns 8.93GB an hour where WebSocket uses 68 bytes a message</span></div>
  <div class="lz-layer"><span class="lz-t">12-13 · Scale</span><span class="lz-d">Redis: caching, TTLs, atomicity · queues, retries, idempotency. <strong>Đo:</strong> a pipeline is 63× faster; a non-idempotent job charges the customer 3 times</span></div>
  <div class="lz-layer"><span class="lz-t">14-15 · Confidence</span><span class="lz-d">Testing · logs, metrics, traces, alerts. <strong>Đo:</strong> 100% coverage in all four columns still lets a privilege-escalation hole through; one misplaced metric label eats 939MB</span></div>
  <div class="lz-layer"><span class="lz-t">16-18 · Operations</span><span class="lz-d">Performance · Docker and deployment · architecture. <strong>Đo:</strong> 285 → 3,550 req/s without changing a single library; a deploy loses 1.5% of requests until a proxy stands in front</span></div>
</div>

<h3>The five ideas that keep recurring</h3>
<p>Different chapters, same lesson, arrived at from different directions:</p>

<div class="kv-grid">
  <div class="kv"><span>1. Measure, do not guess</span><b>The regex everyone suspected is 0.5% of CPU. A healthy p95 hides an 8,241ms request. Intuition is wrong systematically</b></div>
  <div class="kv"><span>2. Doing less beats going faster</span><b>A cache is 120×, an index 222×, sending fewer fields 2.8× — against a faster library's 1.39×</b></div>
  <div class="kv"><span>3. Defaults are decisions</span><b>pino-http logs your tokens. A <code>connectionTimeoutMillis: 0</code> pool hangs forever. <code>docker stop</code> kills after 1.26s</b></div>
  <div class="kv"><span>4. Types do not substitute for authorisation</span><b><code>typeof threadId === 'number'</code> checks the TYPE, not the PERMISSION — that is the real socket IDOR found while writing chapter 11</b></div>
  <div class="kv"><span>5. Failing quietly costs more than failing loudly</span><b>A stale build returns 404 while the health check reports green. A missing environment variable should KILL the process at startup</b></div>
</div>

<h3>What a real Node backend looks like when it boots</h3>
<p>The production log of the system this course has been describing, from process start to serving traffic:</p>

<div class="out">03:57:56.014  Sentry initialized                     environment=production
03:57:59.297  redis connection ready
03:57:59.386  Socket.IO Redis adapter attached
03:57:59.481  Database connected                     elapsedMs=10
03:57:59.548  document_chunks table + embedding column OK
03:57:59.567  social_posts GIN trigram index OK
03:57:59.638  embed queue recovery scan
03:57:59.638  cron all jobs registered               jobs=[7 nhóm]
03:57:59.641  CuongHoangDev API running              port=3001 env=production

khởi động toàn bộ: 3,63 giây</div>

<p>Every line is a chapter. Sentry is chapter 15. Redis and the Socket.IO adapter are 12 and 11. The database connection with its measured 10ms is chapter 7. The index check is 7 again. The queue recovery scan is chapter 13 — the mitigation for the in-process queue whose trade-off was written down in the code. The cron registration is 13 as well. Nine lines, 3,63 seconds, and everything that must be true before a single request is served.</p>

<h3>Before your first production deploy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Secrets</span><span class="lz-d">Nothing in git, nothing in the Docker image, required variables checked at startup and the process DIES if any is missing (17.4)</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Authentication &amp; authorisation</span><span class="lz-d">Hash passwords with argon2/bcrypt, expire your JWTs, authorise in EVERY handler including sockets (8, 9, 11)</span></div>
  <div class="lz-layer lz-step"><span class="lz-n">3</span><span class="lz-t">Input</span><span class="lz-d">Validate every request body with zod, cap the body size, redact secrets in logs, check files' magic bytes (6, 9, 10, 15)</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">The database</span><span class="lz-d">Additive, reversible migrations, indexes on the columns you filter by, a measured pool, and NO string-concatenated SQL (7, 16)</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Observability</span><span class="lz-d">JSON logs plus a request id, error tracking, an EXTERNAL uptime check, disk alerts (15)</span></div>
  <div class="lz-step"><span class="lz-n">6</span><span class="lz-t">Lifecycle</span><span class="lz-d">The exec form of CMD, a graceful SIGTERM shutdown, an explicit stop_grace_period, and a liveness probe that does NOT touch the DB (15, 17)</span></div>
  <div class="lz-step"><span class="lz-n">7</span><span class="lz-t">Deploy</span><span class="lz-d">The proxy holds the port, health-check BEFORE switching, smoke-test that routes are mounted, and know the way back (17)</span></div>
</div>

<div class="callout">
<p><strong>What was deliberately not covered.</strong> GraphQL, gRPC, serverless, Kubernetes, event sourcing, CQRS — all real, all with a place, none of them the thing that decides whether your first backend survives. Every one of them is easier to learn once the layers underneath are measured rather than assumed, which is what these eighteen chapters were for.</p>
</div>

<h3>How to keep going</h3>
<p>The habit this course was built on transfers to everything after it: <strong>when you do not know, run it.</strong> Every number in these eighteen chapters came from a script that was executed, and several of them contradicted what the documentation implied — Docker's stop timeout, brotli's maximum quality, the cost of AsyncLocalStorage, whether vitest is faster than jest. Two of them were security holes in the production system, found not by auditing but by measuring something for a lesson.</p>

<p>Build something and put it in front of people. Every measurement here exists because a real system was serving real users and something needed explaining. That is the only reliable source of the questions worth answering.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> This course is not written about a demo. It is written about the system serving the page you are reading — 244 TypeScript files, 80.454 lines, 248 database models, 95 migrations, 76 route groups, one VPS. Every "how this site does it" box in eighteen chapters was checked against the running code, including the parts where the honest answer was "it does not do this yet": no <code>/metrics</code>, no OpenTelemetry, no <code>AsyncLocalStorage</code>, 28 of 62 route files skipping the service layer, no <code>stop_grace_period</code>. A system you can describe accurately, including its gaps, is one you can improve. That is the last idea in the course, and the one the other seventeen chapters were quietly building toward.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}"><span class="lc-t">Code Lab · Node.js (Express)</span><span class="lc-d">16 modules, 160 exercises with solutions</span></a>
</div>
<div class="link-card exphub">
  <a href="/exp-hub${REF}"><span class="lc-t">Exp Hub</span><span class="lc-d">Setup guides, commands and snippets per technology</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.6</span>
<h2>Mười tám chương, một hệ thống</h2>
<p class="lead">Khoá học này bắt đầu bằng một biến <code>var</code> trong vòng lặp in ra 3 3 3 và kết thúc ở đây. Trên đường đi, nó dựng một backend và đo nó ở mọi tầng — chưa bao giờ trích một con số không sinh ra từ việc chạy thật một thứ gì đó. Bài kết này là một tấm bản đồ: mỗi chương đã thêm gì, và phép đo duy nhất từ mỗi chương đáng mang theo.</p>

<h3>Hệ thống, theo từng chương</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">1-4 · Nền tảng</span><span class="lz-d">JavaScript cho backend · V8 + libuv + event loop · module lõi · npm và lockfile. <strong>Đo:</strong> chặn loop 3e9 vòng = trễ 2.873ms; stream 348MB dùng 120MB RAM so với readFileSync 395MB</span></div>
  <div class="lz-layer"><span class="lz-t">5-6 · HTTP</span><span class="lz-d">Express, middleware, xử lý lỗi · thiết kế REST, validate, phân trang. <strong>Đo:</strong> Express 4 TREO request khi async throw còn Express 5 trả 500; OFFSET 999980 quét đủ 1 triệu dòng còn cursor mất 0,015ms</span></div>
  <div class="lz-layer"><span class="lz-t">7 · Dữ liệu</span><span class="lz-d">PostgreSQL + Prisma, quan hệ, transaction, chỉ mục. <strong>Đo:</strong> chỉ mục biến 28,6ms thành 0,129ms (222×); N+1 từ 51 truy vấn còn 2</span></div>
  <div class="lz-layer"><span class="lz-t">8-9 · Bảo mật</span><span class="lz-d">Băm mật khẩu, JWT, phân quyền · header, XSS, ReDoS, SSRF, bí mật. <strong>Đo:</strong> bcrypt cost 12 chậm hơn sha256 328.000 lần — đó chính là mục đích; XSS lấy được cookie phiên end-to-end</span></div>
  <div class="lz-layer"><span class="lz-t">10-11 · Nội dung &amp; realtime</span><span class="lz-d">Upload, object storage, xử lý ảnh · WebSocket, Socket.IO, adapter. <strong>Đo:</strong> URL ký sẵn KHÔNG ràng buộc Content-Type; polling ngốn 8,93GB/giờ ở chỗ WebSocket chỉ dùng 68 byte mỗi tin</span></div>
  <div class="lz-layer"><span class="lz-t">12-13 · Quy mô</span><span class="lz-d">Redis: cache, TTL, tính nguyên tử · hàng đợi, thử lại, idempotent. <strong>Đo:</strong> pipeline nhanh hơn 63×; một job không idempotent trừ tiền 3 lần</span></div>
  <div class="lz-layer"><span class="lz-t">14-15 · Niềm tin</span><span class="lz-d">Kiểm thử · log, metric, trace, cảnh báo. <strong>Đo:</strong> độ phủ 100% cả bốn cột vẫn để lọt một lỗ leo thang quyền; một nhãn metric đặt sai chỗ ngốn 939MB</span></div>
  <div class="lz-layer"><span class="lz-t">16-18 · Vận hành</span><span class="lz-d">Hiệu năng · Docker và triển khai · kiến trúc. <strong>Đo:</strong> 285 → 3.550 req/giây mà không đổi thư viện nào; deploy mất 1,5% request cho tới khi có proxy đứng trước</span></div>
</div>

<h3>Năm ý tưởng cứ lặp đi lặp lại</h3>
<p>Chương khác nhau, cùng một bài học, đi tới từ những hướng khác nhau:</p>

<div class="kv-grid">
  <div class="kv"><span>1. Đo, đừng đoán</span><b>Cái regex ai cũng nghi = 0,5% CPU. p95 đẹp đẽ giấu một request 8.241ms. Trực giác sai một cách có hệ thống</b></div>
  <div class="kv"><span>2. Bỏ bớt việc thắng làm nhanh hơn</span><b>Cache 120×, chỉ mục 222×, gửi ít trường 2,8× — so với thư viện nhanh hơn 1,39×</b></div>
  <div class="kv"><span>3. Mặc định là một quyết định</span><b>pino-http ghi token vào log. Pool <code>connectionTimeoutMillis: 0</code> treo vô hạn. <code>docker stop</code> giết sau 1,26s</b></div>
  <div class="kv"><span>4. Kiểu dữ liệu không thay được phân quyền</span><b><code>typeof threadId === 'number'</code> là kiểm KIỂU chứ không kiểm QUYỀN — đó là lỗ IDOR socket thật đã tìm ra khi soạn chương 11</b></div>
  <div class="kv"><span>5. Hỏng im lặng đắt hơn hỏng ầm ĩ</span><b>Build cũ trả 404 trong khi health check báo xanh. Thiếu biến môi trường thì nên GIẾT tiến trình ngay lúc khởi động</b></div>
</div>

<h3>Một backend Node thật trông thế nào lúc khởi động</h3>
<p>Log production của chính hệ thống mà khoá học này mô tả, từ lúc tiến trình bắt đầu tới lúc phục vụ request:</p>

<div class="out">03:57:56.014  Sentry initialized                     environment=production
03:57:59.297  redis connection ready
03:57:59.386  Socket.IO Redis adapter attached
03:57:59.481  Database connected                     elapsedMs=10
03:57:59.548  document_chunks table + embedding column OK
03:57:59.567  social_posts GIN trigram index OK
03:57:59.638  embed queue recovery scan
03:57:59.638  cron all jobs registered               jobs=[7 nhóm]
03:57:59.641  CuongHoangDev API running              port=3001 env=production

khởi động toàn bộ: 3,63 giây</div>

<p>Mỗi dòng là một chương. Sentry là chương 15. Redis và adapter Socket.IO là 12 và 11. Kết nối cơ sở dữ liệu với con số 10ms đo được là chương 7. Phép kiểm chỉ mục cũng là 7. Lượt quét khôi phục hàng đợi là chương 13 — chính là biện pháp giảm nhẹ cho cái hàng đợi trong tiến trình mà phép đánh đổi của nó đã được ghi lại trong code. Việc đăng ký cron cũng là 13. Chín dòng, 3,63 giây, và mọi thứ phải đúng trước khi một request duy nhất được phục vụ.</p>

<h3>Trước lần deploy production đầu tiên của bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Bí mật</span><span class="lz-d">Không có gì trong git, không có gì trong ảnh Docker, kiểm biến bắt buộc lúc khởi động và CHẾT nếu thiếu (17.4)</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Xác thực &amp; phân quyền</span><span class="lz-d">Băm mật khẩu bằng argon2/bcrypt, JWT có hạn, phân quyền ở TỪNG handler kể cả socket (8, 9, 11)</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Đầu vào</span><span class="lz-d">Validate mọi thân request bằng zod, giới hạn cỡ body, che bí mật trong log, kiểm magic byte của file (6, 9, 10, 15)</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Cơ sở dữ liệu</span><span class="lz-d">Migration cộng thêm và đảo ngược được, chỉ mục cho cột đang lọc, pool đã đo, KHÔNG nối chuỗi SQL (7, 16)</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Quan sát</span><span class="lz-d">Log JSON + mã request, theo dõi lỗi, uptime check từ BÊN NGOÀI, cảnh báo đĩa (15)</span></div>
  <div class="lz-step"><span class="lz-n">6</span><span class="lz-t">Vòng đời</span><span class="lz-d">CMD dạng exec, tắt êm khi SIGTERM, stop_grace_period đặt rõ, liveness KHÔNG chạm cơ sở dữ liệu (15, 17)</span></div>
  <div class="lz-step"><span class="lz-n">7</span><span class="lz-t">Triển khai</span><span class="lz-d">Proxy giữ cổng, kiểm khoẻ TRƯỚC khi đổi, smoke-test route đã gắn, biết đường quay lui (17)</span></div>
</div>

<div class="callout">
<p><strong>Những gì cố ý không được nhắc tới.</strong> GraphQL, gRPC, serverless, Kubernetes, event sourcing, CQRS — đều có thật, đều có chỗ đứng, và không cái nào là thứ quyết định xem backend đầu tiên của bạn có sống sót hay không. Mỗi cái trong số đó đều dễ học hơn khi các tầng bên dưới đã được <em>đo</em> chứ không phải được <em>giả định</em>, và đó là mục đích của mười tám chương này.</p>
</div>

<h3>Đi tiếp thế nào</h3>
<p>Cái thói quen mà khoá học này được dựng trên đó chuyển giao được sang mọi thứ về sau: <strong>khi không biết thì chạy thử.</strong> Mọi con số trong mười tám chương này đều đến từ một script đã được thực thi, và nhiều con số trong đó mâu thuẫn với điều tài liệu ngụ ý — thời gian chờ dừng của Docker, mức chất lượng cao nhất của brotli, chi phí của AsyncLocalStorage, chuyện vitest có nhanh hơn jest không. Hai trong số đó là những lỗ bảo mật thật trong hệ thống production, tìm ra không phải bằng cách đi audit mà bằng cách đo một thứ gì đó cho một bài học.</p>

<p>Hãy làm ra một thứ và đặt nó trước mặt người dùng. Mọi phép đo ở đây tồn tại vì có một hệ thống thật đang phục vụ người dùng thật và có một chuyện gì đó cần được giải thích. Đó là nguồn đáng tin cậy duy nhất cho những câu hỏi đáng trả lời.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Khoá học này không viết về một bản demo. Nó viết về chính cái hệ thống đang phục vụ trang bạn đang đọc — 244 file TypeScript, 80.454 dòng, 248 model cơ sở dữ liệu, 95 migration, 76 nhóm route, một cái VPS. Mọi khung "site này làm thế nào" trong mười tám chương đều được đối chiếu với code đang chạy, kể cả những chỗ mà câu trả lời trung thực là "cái này chưa làm": không có <code>/metrics</code>, không có OpenTelemetry, không có <code>AsyncLocalStorage</code>, 28 trên 62 file route bỏ qua tầng service, không đặt <code>stop_grace_period</code>. Một hệ thống mà bạn mô tả được chính xác, kể cả những lỗ hổng của nó, là một hệ thống bạn cải thiện được. Đó là ý tưởng cuối cùng của khoá học, và là thứ mà mười bảy chương kia đã lặng lẽ hướng tới.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}"><span class="lc-t">Code Lab · Node.js (Express)</span><span class="lc-d">16 module, 160 bài tập có lời giải</span></a>
</div>
<div class="link-card exphub">
  <a href="/exp-hub${REF}"><span class="lc-t">Exp Hub</span><span class="lc-d">Hướng dẫn cài đặt, lệnh và đoạn mã theo từng công nghệ</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 18.7 ─────────────────────────── */
    {
      title: '18.7 — Chapter 18 quiz|||18.7 — Kiểm tra chương 18',
      slug: 'nodejs-18-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu cuối cùng của khoá: phân tầng, ghép nối, tổ chức mã nguồn, khối nguyên hay dịch vụ, quyết định khó đảo ngược — và vài câu nối lại các phép đo xuyên suốt mười tám chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Quiz</span>
<h2>The last check</h2>
<p class="lead">Ten questions to close the course. Some are settled by measurements in this chapter — 28 of 62 route files skipping a layer, 248 models in one schema, a hub service that both depends on five things and is depended on by seven. Others reach back across all eighteen chapters, because architecture is where the earlier measurements turn into decisions. Take your time; this one is meant to be harder than the others.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Kiểm tra</span>
<h2>Phép kiểm cuối cùng</h2>
<p class="lead">Mười câu để khép lại khoá học. Vài câu được phân định bởi các phép đo trong chương này — 28 trên 62 file route bỏ qua một tầng, 248 model trong một lược đồ, một service đầu mối vừa phụ thuộc vào năm thứ vừa bị bảy nơi phụ thuộc vào. Vài câu khác với ngược lại cả mười tám chương, vì kiến trúc là nơi những phép đo trước đó biến thành quyết định. Cứ từ từ; bài này cố ý khó hơn các bài trước.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A count on the production backend found 28 of 62 route files importing Prisma directly, bypassing the service layer. Why is that a problem even though every one of those endpoints works correctly today?|||Một phép đếm trên backend production cho thấy 28 trên 62 file route import Prisma trực tiếp, bỏ qua tầng service. Vì sao đó là vấn đề dù mọi endpoint trong số đó hôm nay đều chạy đúng?',
            options: [
              'Direct database access from a route is always a security vulnerability|||Truy cập cơ sở dữ liệu trực tiếp từ route luôn luôn là một lỗ hổng bảo mật',
              'Prisma should only be instantiated once, and 28 imports create 28 connection pools|||Prisma chỉ nên được khởi tạo một lần, và 28 lượt import tạo ra 28 pool kết nối',
              'The cost arrives the day a rule must apply everywhere — soft delete, an audit log, a permission check — which becomes one change in a service layer and 28 scattered edits, with 28 chances to miss one|||Cái giá tới vào ngày một quy tắc phải áp ở mọi nơi — xoá mềm, nhật ký kiểm toán, một phép kiểm quyền — vốn là MỘT thay đổi ở tầng service thì thành 28 chỗ sửa rải rác, với 28 cơ hội để sót một chỗ',
              'It makes the route files longer than the recommended 500-line limit|||Nó làm các file route dài hơn giới hạn khuyến nghị 500 dòng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'The largest file in the repository is a 3.607-line seed file, and the lesson argues it is fine while a 2.262-line service file is a concern. What distinguishes them?|||File to nhất trong kho mã là một file seed 3.607 dòng, và bài học lập luận rằng nó ổn trong khi một file service 2.262 dòng thì đáng lo. Điều gì phân biệt chúng?',
            options: [
              'Seed files are not compiled, so their size does not affect the build|||File seed không được biên dịch nên kích thước của nó không ảnh hưởng tới việc build',
              'The seed file’s complexity is flat — similar entries, no branching, no interaction — and it is read by searching; the service file’s complexity is tangled, where understanding one function may require understanding six|||Độ phức tạp của file seed là PHẲNG — các mục giống nhau, không nhánh rẽ, không tương tác — và nó được đọc bằng cách tìm kiếm; còn độ phức tạp của file service là RỐI, nơi hiểu một hàm có thể đòi hỏi hiểu sáu hàm',
              'The seed file has fewer imports, so its dependency depth is lower|||File seed có ít import hơn nên chiều sâu phụ thuộc của nó thấp hơn',
              'Seed files change rarely, so line count rules do not apply to files that are stable|||File seed hiếm khi đổi nên quy tắc đếm dòng không áp dụng cho những file ổn định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'pro.service is imported by 7 modules and itself imports 5 others, making it the top entry on both lists. What does that combination indicate?|||pro.service bị 7 mô-đun import và bản thân nó import 5 cái khác, khiến nó đứng đầu cả hai danh sách. Tổ hợp đó cho biết điều gì?',
            options: [
              'It is a hub: a change to it ripples into seven features and a change in any of its five dependencies ripples back — shared concepts should be depended on, but should not depend upward on the features that use them|||Nó là một ĐẦU MỐI: một thay đổi ở nó lan ra bảy tính năng và một thay đổi ở bất kỳ cái nào trong năm phụ thuộc lại lan ngược vào — khái niệm dùng chung thì NÊN được phụ thuộc vào, nhưng KHÔNG nên phụ thuộc ngược lên các tính năng đang dùng nó',
              'It is a circular dependency and will fail to compile under strict module resolution|||Đó là một phụ thuộc vòng tròn và sẽ không biên dịch được với chế độ phân giải module nghiêm ngặt',
              'It is well-designed: high reuse is the goal of a service layer|||Nó được thiết kế tốt: tái sử dụng cao chính là mục tiêu của một tầng service',
              'It should be split into seven copies, one per consuming module|||Nên tách nó thành bảy bản sao, mỗi mô-đun tiêu thụ một bản',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '248 Prisma models in one schema are shared by 76 route groups. Two feature modules that never import each other are described as still coupled. Through what?|||248 model Prisma trong một lược đồ được dùng chung bởi 76 nhóm route. Hai mô-đun tính năng chưa bao giờ import lẫn nhau vẫn được mô tả là bị ghép nối. Qua cái gì?',
            options: [
              'The Prisma client singleton, which serialises all queries through one connection|||Singleton của Prisma client, thứ tuần tự hoá mọi truy vấn qua một kết nối',
              'Nothing — modules that do not import each other are by definition decoupled|||Không qua gì cả — các mô-đun không import lẫn nhau thì theo định nghĩa là đã tách rời',
              'The database itself: a column added by one changes what the other’s SELECT * returns, a renamed table breaks its queries, a held lock blocks it — and no dependency analysis of the import graph can see any of it|||Qua chính cơ sở dữ liệu: một cột do bên này thêm làm đổi thứ mà SELECT * của bên kia trả về, một bảng bị đổi tên làm hỏng truy vấn của nó, một cái khoá bị giữ làm nó chờ — và không phép phân tích phụ thuộc nào trên đồ thị import nhìn thấy được điều đó',
              'The shared HTTP server, since both are mounted on the same Express app|||Qua máy chủ HTTP dùng chung, vì cả hai đều gắn trên cùng một app Express',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A team is considering splitting their I/O-bound Node monolith into services. Chapter 16 measured that forking that workload into 10 processes gained 5,7%, and chapter 16 measured OpenTelemetry costing 39,6% of throughput. Which of the three real signals for splitting is decisive?|||Một đội đang cân nhắc tách khối nguyên Node nghẽn I/O của họ thành các dịch vụ. Chương 16 đo được rằng rẽ khối lượng công việc đó thành 10 tiến trình chỉ được thêm 5,7%, và cũng chương 16 đo được OpenTelemetry tốn 39,6% throughput. Trong ba dấu hiệu thật để tách, dấu hiệu nào mang tính quyết định?',
            options: [
              'The codebase has passed 80.000 lines, which is the practical limit for a monolith|||Codebase đã vượt 80.000 dòng, vốn là giới hạn thực tế của một khối nguyên',
              'Teams stepping on each other — merge conflicts, waiting to deploy, nobody daring to touch the other file; a service boundary that does not match a team boundary is pure cost|||Các đội giẫm chân nhau — xung đột merge, chờ nhau để deploy, không ai dám đụng vào file của người kia; một ranh giới dịch vụ không khớp với ranh giới của một đội là chi phí thuần tuý',
              'Independent scaling, since every system eventually needs to scale parts separately|||Mở rộng độc lập, vì hệ thống nào rồi cũng cần mở rộng từng phần riêng',
              'Fault isolation, because a monolith has a single point of failure by definition|||Cô lập lỗi, vì một khối nguyên theo định nghĩa là có một điểm chết duy nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Chapter 7 demonstrated a transaction rolling back cleanly, and chapter 13 measured a non-idempotent job with attempts:3 charging a customer 300.000đ instead of 100.000đ. How do those two results bear on the decision to split services?|||Chương 7 chứng minh một transaction cuộn ngược sạch sẽ, và chương 13 đo được một job không idempotent với attempts:3 đã trừ của khách 300.000đ thay vì 100.000đ. Hai kết quả đó liên quan thế nào tới quyết định tách dịch vụ?',
            options: [
              'They show queues are unreliable and should be avoided in favour of synchronous calls|||Chúng cho thấy hàng đợi không đáng tin và nên tránh, thay bằng lời gọi đồng bộ',
              'They are unrelated: transactions are a database concern and idempotency is a queue concern|||Chúng không liên quan: transaction là chuyện của cơ sở dữ liệu còn idempotent là chuyện của hàng đợi',
              'Splitting removes the transaction: what was one atomic operation becomes a state where payment succeeded and inventory failed — turning that class of bug from an exception into the normal case that must be designed for|||Việc tách XOÁ BỎ transaction: cái từng là một thao tác nguyên tử trở thành một trạng thái mà thanh toán thành công còn kho hàng thất bại — biến lớp lỗi đó từ ngoại lệ thành trường hợp BÌNH THƯỜNG phải thiết kế cho',
              'They prove services need stronger consistency guarantees than a monolith, which distributed transactions provide|||Chúng chứng minh dịch vụ cần bảo đảm nhất quán mạnh hơn khối nguyên, thứ mà transaction phân tán cung cấp',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which of these is a one-way door — a decision whose reversal cost is measured in months rather than an afternoon?|||Cái nào dưới đây là một cửa MỘT CHIỀU — một quyết định mà chi phí đảo ngược tính bằng tháng chứ không phải một buổi chiều?',
            options: [
              'Choosing pino over a hand-rolled console.log wrapper|||Chọn pino thay vì một lớp bọc console.log tự viết',
              'Setting the gzip compression level for dynamic responses|||Đặt mức nén gzip cho các phản hồi động',
              'Organising src/ by type rather than by feature|||Tổ chức src/ theo loại thay vì theo tính năng',
              'Exposing sequential integer ids in public URLs — changing to UUIDs later breaks every existing link, and the ids meanwhile leak record counts and invite IDOR|||Lộ id số nguyên tuần tự trong URL công khai — đổi sang UUID về sau làm chết mọi link đang tồn tại, và trong lúc đó các id ấy làm lộ số lượng bản ghi và mời gọi IDOR',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'The lesson recommends a code comment that records not just the decision but "the condition under which the decision should be revisited". Why is that last part the important one?|||Bài học khuyến nghị một dòng chú thích ghi lại không chỉ quyết định mà cả "điều kiện để xem xét lại quyết định ấy". Vì sao phần cuối đó mới là phần quan trọng?',
            options: [
              'Without it, a deliberate trade-off is indistinguishable from an oversight, so the next person either preserves it out of superstition or removes it without knowing what it protected|||Không có nó, một phép đánh đổi có chủ đích trông không khác gì một sự sơ suất, nên người tiếp theo hoặc giữ nó vì mê tín hoặc gỡ nó đi mà không biết nó đang bảo vệ cái gì',
              'It satisfies audit requirements for regulated systems|||Nó thoả mãn yêu cầu kiểm toán cho các hệ thống bị quản lý',
              'It allows automated tooling to flag outdated decisions|||Nó cho phép công cụ tự động đánh dấu những quyết định đã lỗi thời',
              'It makes the comment long enough that people will actually read it|||Nó làm dòng chú thích đủ dài để người ta thật sự chịu đọc',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Across eighteen chapters, several measurements contradicted what documentation or common advice implied: Docker’s stop timeout killed a container after 1,26s, brotli quality 11 produced a larger file 490× slower, AsyncLocalStorage added no measurable cost, and node:test beat both vitest and jest. What is the transferable habit?|||Xuyên suốt mười tám chương, nhiều phép đo mâu thuẫn với điều mà tài liệu hoặc lời khuyên phổ biến ngụ ý: thời gian chờ dừng của Docker giết container sau 1,26s, brotli mức 11 cho ra file to hơn mà chậm gấp 490 lần, AsyncLocalStorage không thêm chi phí đo được, và node:test thắng cả vitest lẫn jest. Thói quen chuyển giao được ở đây là gì?',
            options: [
              'Documentation is generally unreliable and should be ignored in favour of source code|||Tài liệu nhìn chung không đáng tin và nên bỏ qua, thay bằng đọc mã nguồn',
              'Benchmarks are environment-specific, so no measurement generalises and each team must start from zero|||Benchmark phụ thuộc môi trường nên không phép đo nào tổng quát hoá được, mỗi đội phải bắt đầu lại từ đầu',
              'When you do not know, run it — defaults and popular claims are hypotheses, and the cost of checking one is usually minutes while the cost of assuming wrongly is an incident|||Khi không biết thì CHẠY THỬ — các giá trị mặc định và những khẳng định phổ biến là giả thuyết, và giá của việc kiểm một cái thường là vài phút trong khi giá của việc giả định sai là một sự cố',
              'Always choose the option with the fewest dependencies, since that is what won most comparisons|||Luôn chọn phương án có ít phụ thuộc nhất, vì đó là thứ thắng ở phần lớn các phép so sánh',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'The closing lesson lists what the production system does NOT have: no /metrics, no OpenTelemetry, no AsyncLocalStorage, 28 of 62 route files skipping the service layer, no stop_grace_period. Why present the gaps rather than only the good parts?|||Bài kết liệt kê những gì hệ thống production KHÔNG có: không /metrics, không OpenTelemetry, không AsyncLocalStorage, 28 trên 62 file route bỏ qua tầng service, không đặt stop_grace_period. Vì sao lại bày ra các lỗ hổng thay vì chỉ nói phần tốt?',
            options: [
              'To lower expectations before users encounter the limitations themselves|||Để hạ thấp kỳ vọng trước khi người dùng tự gặp phải các giới hạn đó',
              'Because a system you can describe accurately, including its gaps, is one you can improve — and a named gap is a task, while an unnamed one is a future incident|||Vì một hệ thống bạn mô tả được chính xác, kể cả các lỗ hổng, là hệ thống bạn cải thiện được — và một lỗ hổng đã được gọi tên là một đầu việc, còn một lỗ hổng chưa gọi tên là một sự cố tương lai',
              'Because listing gaps is required by the observability practices in chapter 15|||Vì việc liệt kê lỗ hổng là bắt buộc theo các thực hành quan sát ở chương 15',
              'Because a production system should have every item on the checklist before launching|||Vì một hệ thống production phải có đủ mọi mục trong danh sách kiểm trước khi ra mắt',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
