const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 10: Chẩn đoán bằng ca thật.
 * Số đo: sáu sự cố có ngày lấy từ CLAUDE.md, mỗi bài dạy một khuôn mẫu
 * chẩn đoán khác nhau — cái smoke test không kiểm được, cái seed vỡ dù
 * qua checklist, cái build xanh mà không chạy được...
 */

export default {
  title: 'Chapter 10 — Diagnosing by real cases|||Chương 10 — Chẩn đoán bằng ca thật',
  slug: 'ga-ch10-chan-doan',
  description: 'Sáu sự cố có ngày tháng lấy từ chính CLAUDE.md của kho này. Mỗi bài trình bày một khuôn mẫu chẩn đoán khác nhau — cách smoke test không kiểm được gì, cách seed vỡ dù qua toàn bộ checklist, và một lần "diệt server không chết" tốn hai phiên.',
  sortOrder: 11,
  lessons: [

    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Stale build, and 404 versus 401 as diagnosis|||10.1 — Bản dựng cũ, và 404 với 401 như phép chẩn đoán',
      slug: 'ga-10-1-build-cu',
      type: 'VIDEO',
      description: 'Sự cố 2026-07-02: hai chức năng chết cùng lúc, sống sót qua re-login. Chẩn đoán bằng một cú `curl -sI` không xác thực — 404 = ROUTE KHÔNG MOUNT, tức bản dựng CŨ. Đây là phép chẩn đoán rẻ nhất trong sổ vận hành của kho.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Stale build, and 404 versus 401 as diagnosis</h2>
<p class="lead">CLAUDE.md records the 2026-07-02 incident in a single line, and the diagnosis is one <code>curl</code> command. It is worth reading in full because the technique generalises.</p>

<h3>The symptoms</h3>
<div class="out">02/07/2026:
  GIF picker chet
  chats "bien mat" khoi /messages
  ca hai song sot qua re-login</div>

<p>Two separate features broken at the same time, both persistent across a fresh login. The instinct is a shared auth or session bug, because the two symptoms overlap where auth would. That instinct produces a two-hour investigation of the auth code and finds nothing wrong.</p>

<h3>The diagnosis, one command each</h3>
<pre><code>$ curl -sI https://api.cuongthai.com/api/v1/gifs
HTTP/1.1 404 Not Found              <- KHONG mount

$ curl -sI https://api.cuongthai.com/messages/threads
HTTP/1.1 401 Unauthorized           <- CO mount, doi xac thuc</code></pre>

<div class="callout warn">
<p><strong>Two different failure modes wearing the same clothes.</strong> The GIF endpoint answered <code>404</code> — the router had no handler for that path. The messages endpoint answered <code>401</code> — the router had a handler, it just required auth. Two symptoms, one auth explanation, and a single command revealed they were unrelated: one was a stale build, the other was a per-viewer <code>deletedAt</code> filter working exactly as designed.</p>
</div>

<h3>Why 404 is the interesting number</h3>
<div class="kv-grid">
<div class="kv"><span class="k">200</span><span class="v">the route is mounted and public. Rarely useful — most authenticated APIs never see 200 without a token</span></div>
<div class="kv"><span class="k">401</span><span class="v">the route is mounted and requires auth. This is what a healthy authenticated endpoint returns to an unauth request, and it means <em>the deploy shipped that route</em></span></div>
<div class="kv"><span class="k">403</span><span class="v">the route is mounted, you are authenticated, and you are refused. Different failure — a permissions problem, not a deploy one</span></div>
<div class="kv"><span class="k">404</span><span class="v">the route is not mounted. The deploy either did not include it or was rolled back before it arrived. This is the specific fingerprint of a stale build</span></div>
</div>

<div class="callout ok">
<p><strong>The rule this repository extracted, and codified in <code>deploy.sh</code>&#39;s smoke test:</strong> after every deploy, <code>curl</code> the core routes without auth. 401 and 200 are both fine — they mean the route mounted. 404 fails the deploy. Chapter 5 measured what happens when this check is added later ("check the checker before the content" is why the smoke test caught the next stale build within a week).</p>
</div>

<h3>What caused the stale build</h3>
<p>CLAUDE.md is precise about it: a partial or <code>--no-build</code> deploy shipped an old image even though the new source was present. The image on the VPS did not include <code>dist/routes/gifs.routes.js</code>, so the router had no handler for <code>/api/v1/gifs</code>. Everything else about the deploy looked fine — the container was up, health checks passed, the wrong image was serving traffic without complaint.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what the browser saw</span><span class="lz-t">two things broken</span><span class="lz-d">and a plausible shared cause (auth), which is where investigation went first</span></div>
<div class="lz-step"><span class="lz-k">what one curl showed</span><span class="lz-t">the two things are different</span><span class="lz-d">401 versus 404 separated the symptoms; the auth theory died in one command</span></div>
<div class="lz-step"><span class="lz-k">what the fix was</span><span class="lz-t">a full clean deploy</span><span class="lz-d">and a smoke test added to the deploy script so a stale build fails the deploy rather than reaching production</span></div>
</div>

<h3>The general technique</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">separate symptoms with a single measurement</span><span class="lz-lnote">two failures with a plausible shared cause is a hypothesis, not a fact. One measurement per symptom is enough to test it, and the technique above is one <code>curl</code> per route</span></div>
<div class="lz-layer"><span class="lz-lname">test the layer under the browser</span><span class="lz-lnote">a browser response is code, network, storage and auth all combined. A raw request removes three of the four and gets to the router by itself</span></div>
<div class="lz-layer"><span class="lz-lname">read the number, not the message</span><span class="lz-lnote">401 and 404 both look like "does not work" in a browser. As HTTP codes they mean different things and require different fixes. The number is more informative than the page</span></div>
<div class="lz-layer"><span class="lz-lname">codify the check</span><span class="lz-lnote">once one 404 has caused an incident, the smoke test is a permanent part of the deploy. This is 8.5&#39;s pattern applied at the deploy layer</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating the browser as the diagnostic tool.</strong> A browser retries, follows redirects, applies cookies, runs JavaScript, and presents an error page for anything from a network hiccup to a 404. It is the worst possible tool for isolating a fault, and it is the default tool for reporting one. Every real diagnosis in this chapter uses <code>curl</code> or a log line instead — the browser is what the user saw, not what you should use to find the cause.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Two symptoms with a plausible shared cause is a hypothesis to test with one measurement per symptom, and for HTTP the measurement is a raw <code>curl</code>: 401 means the deploy mounted the route, 404 means it did not, and reading the wrong one costs a two-hour investigation of code that is fine.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-02 incident row</span><span class="lc-sub">the source of every measurement in this lesson, including the specific rule for reading HTTP responses added afterwards.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7231 — HTTP status code definitions</span><span class="lc-sub">tools.ietf.org/html/rfc7231 — the specification behind the distinction between 404 and 401 that made the diagnosis possible.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — -I, -s, -o, and -w for scripted probes</span><span class="lc-sub">curl.se/docs/manpage.html — the flags that turn <code>curl</code> into a health probe, including <code>-w &#39;%{http_code}&#39;</code> for the number by itself.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the smoke test that came out of this incident</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deploy script&#39;s post-deploy checks and the specific routes it probes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reading status codes in access logs</span><span class="lc-sub">/courses/nginx/learn${REF} — the server-side view of the same diagnosis, including where 404 is served by nginx versus by the app.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Bản dựng cũ, và 404 với 401 như phép chẩn đoán</h2>
<p class="lead">CLAUDE.md ghi lại sự cố 2026-07-02 trong một dòng, và phần chẩn đoán là MỘT lệnh <code>curl</code>. Đáng đọc trọn vì kỹ thuật này TỔNG QUÁT HOÁ được.</p>

<h3>Các triệu chứng</h3>
<div class="out">02/07/2026:
  GIF picker chet
  chats "bien mat" khoi /messages
  ca hai song sot qua re-login</div>

<p>Hai tính năng riêng biệt hỏng cùng lúc, cả hai đều bền qua một lần đăng nhập lại. Bản năng là một bug auth hoặc session chung, bởi hai triệu chứng ấy CHỒNG LÊN NHAU ở chỗ mà auth SẼ chồng. Bản năng ấy đẻ ra một cuộc điều tra hai tiếng vào mã auth và không tìm ra gì sai.</p>

<h3>Chẩn đoán, mỗi cái một lệnh</h3>
<pre><code>$ curl -sI https://api.cuongthai.com/api/v1/gifs
HTTP/1.1 404 Not Found              <- KHONG mount

$ curl -sI https://api.cuongthai.com/messages/threads
HTTP/1.1 401 Unauthorized           <- CO mount, doi xac thuc</code></pre>

<div class="callout warn">
<p><strong>Hai kiểu hỏng KHÁC NHAU mặc CÙNG một bộ đồ.</strong> Endpoint GIF trả <code>404</code> — router KHÔNG có handler cho path đó. Endpoint messages trả <code>401</code> — router CÓ handler, chỉ là đòi auth. Hai triệu chứng, MỘT lời giải thích auth, và một lệnh duy nhất phơi bày rằng chúng KHÔNG liên quan: một là bản dựng cũ, cái kia là bộ lọc <code>deletedAt</code> theo từng viewer đang chạy ĐÚNG như thiết kế.</p>
</div>

<h3>Vì sao 404 là con số ĐÁNG chú ý</h3>
<div class="kv-grid">
<div class="kv"><span class="k">200</span><span class="v">route đã mount và CÔNG KHAI. Hiếm khi hữu ích — phần lớn API có xác thực không bao giờ thấy 200 nếu không có token</span></div>
<div class="kv"><span class="k">401</span><span class="v">route đã mount và ĐÒI auth. Đây là thứ một endpoint có xác thực KHOẺ trả về cho một lời gọi không xác thực, và nó nghĩa là <em>CUỘC DEPLOY ĐÃ SHIP route ấy</em></span></div>
<div class="kv"><span class="k">403</span><span class="v">route đã mount, bạn đã xác thực, và bạn bị từ chối. Kiểu hỏng KHÁC — vấn đề QUYỀN, không phải vấn đề deploy</span></div>
<div class="kv"><span class="k">404</span><span class="v">route CHƯA mount. Deploy hoặc không bao gồm nó, hoặc bị rollback trước khi nó tới. Đây là DẤU VÂN TAY CỤ THỂ của bản dựng cũ</span></div>
</div>

<div class="callout ok">
<p><strong>Quy tắc kho này rút ra và mã hoá trong smoke test của <code>deploy.sh</code>:</strong> sau mỗi cuộc deploy, <code>curl</code> các route lõi mà KHÔNG xác thực. 401 và 200 đều ổn — chúng nghĩa là route ĐÃ mount. 404 làm HỎNG cuộc deploy. Chương 5 đo được chuyện gì xảy ra khi phép kiểm này được thêm sau ("kiểm bộ kiểm trước khi tin nó" là lý do smoke test bắt được bản dựng cũ tiếp theo trong vòng một tuần).</p>
</div>

<h3>Cái gì gây ra bản dựng cũ</h3>
<p>CLAUDE.md nói chính xác: một cuộc deploy TỪNG PHẦN hoặc <code>--no-build</code> đã ship một ảnh CŨ dù mã nguồn mới đã có mặt. Ảnh trên VPS không bao gồm <code>dist/routes/gifs.routes.js</code>, nên router không có handler cho <code>/api/v1/gifs</code>. Mọi thứ khác về cuộc deploy TRÔNG có vẻ ổn — container đang chạy, health check qua, cái ảnh SAI đang phục vụ lưu lượng mà không kêu ca gì.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">trình duyệt THẤY GÌ</span><span class="lz-t">hai thứ hỏng</span><span class="lz-d">và một nguyên nhân chung HỢP LÝ (auth), là chỗ điều tra ĐI ĐẦU TIÊN</span></div>
<div class="lz-step"><span class="lz-k">một cú curl CHO THẤY GÌ</span><span class="lz-t">hai thứ ấy khác nhau</span><span class="lz-d">401 so với 404 tách hai triệu chứng; lý thuyết auth chết trong một lệnh</span></div>
<div class="lz-step"><span class="lz-k">bản vá là gì</span><span class="lz-t">một cuộc deploy sạch đầy đủ</span><span class="lz-d">và một smoke test thêm vào script deploy để bản dựng cũ LÀM HỎNG deploy chứ không TỚI production</span></div>
</div>

<h3>Kỹ thuật tổng quát</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tách các triệu chứng bằng MỘT phép đo</span><span class="lz-lnote">hai cú hỏng có một nguyên nhân chung hợp lý là một GIẢ THUYẾT, không phải sự thật. Một phép đo cho mỗi triệu chứng là đủ để kiểm nó, và kỹ thuật trên là MỘT <code>curl</code> cho mỗi route</span></div>
<div class="lz-layer"><span class="lz-lname">kiểm TẦNG DƯỚI trình duyệt</span><span class="lz-lnote">phản hồi trình duyệt là mã, mạng, lưu trữ và auth kết hợp. Một lời gọi thô GỠ BỎ ba trong bốn và tới thẳng ROUTER</span></div>
<div class="lz-layer"><span class="lz-lname">đọc CON SỐ, không đọc thông báo</span><span class="lz-lnote">401 và 404 đều TRÔNG như "không hoạt động" trong một trình duyệt. Dưới dạng mã HTTP chúng nghĩa là những thứ KHÁC NHAU và đòi những cách vá KHÁC NHAU. Con số nhiều thông tin hơn cái trang</span></div>
<div class="lz-layer"><span class="lz-lname">MÃ HOÁ phép kiểm</span><span class="lz-lnote">một khi một cú 404 đã gây một sự cố, smoke test trở thành phần VĨNH VIỄN của cuộc deploy. Đây là khuôn mẫu của bài 8.5 áp ở TẦNG DEPLOY</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi trình duyệt là công cụ CHẨN ĐOÁN.</strong> Một trình duyệt thử lại, đi theo redirect, áp cookie, chạy JavaScript, và hiện một trang lỗi cho MỌI thứ từ tiếng ồn mạng tới một cú 404. Nó là công cụ tệ nhất có thể để cô lập một cú vỡ, và là công cụ mặc định để BÁO CÁO một cú vỡ. Mọi cuộc chẩn đoán thật trong chương này dùng <code>curl</code> hoặc một dòng log thay vào đó — trình duyệt là thứ NGƯỜI DÙNG THẤY, không phải thứ bạn nên dùng để tìm NGUYÊN NHÂN.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hai triệu chứng với một nguyên nhân chung hợp lý là một GIẢ THUYẾT để KIỂM với MỘT phép đo cho mỗi triệu chứng, và với HTTP thì phép đo là một cú <code>curl</code> THÔ: 401 nghĩa là deploy đã mount route, 404 nghĩa là không, và đọc nhầm một trong hai tốn một cuộc điều tra hai tiếng vào mã VỐN ỔN.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — dòng sự cố 2026-07-02</span><span class="lc-sub">nguồn của mọi phép đo trong bài này, gồm cả quy tắc cụ thể để đọc phản hồi HTTP đã thêm sau đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7231 — định nghĩa các mã trạng thái HTTP</span><span class="lc-sub">tools.ietf.org/html/rfc7231 — đặc tả đứng sau CHỖ PHÂN BIỆT 404 với 401 đã khiến cuộc chẩn đoán khả thi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — -I, -s, -o, và -w cho các phép thăm dò kịch bản</span><span class="lc-sub">curl.se/docs/manpage.html — các cờ biến <code>curl</code> thành một phép thăm dò sức khoẻ, gồm cả <code>-w &#39;%{http_code}&#39;</code> cho MỘT con số duy nhất.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke test ra từ sự cố này</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — các phép kiểm SAU-deploy của script deploy và các route cụ thể nó thăm dò.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — đọc mã trạng thái trong access log</span><span class="lc-sub">/courses/nginx/learn${REF} — góc nhìn PHÍA MÁY CHỦ của cùng phép chẩn đoán, gồm cả chỗ mà 404 được phục vụ bởi nginx thay vì bởi app.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — The seed that passed everything and broke prod|||10.2 — Cái seed qua sạch checklist và vỡ ở prod',
      slug: 'ga-10-2-seed-vo',
      type: 'VIDEO',
      description: 'Sự cố 2026-08-08: đổi tên một giá trị enum, qua sạch pre-push checklist, vẫn vỡ seed trên production. Nguyên nhân: `tsconfig.json` exclude `prisma/` và union enum được CHÉP TAY nên nó tự kiểm với chính nó. Bài học tổng quát về checklist đo cái NÓ chọn để đo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The seed that passed everything and broke prod</h2>
<p class="lead">On 2026-08-08 an enum value was renamed to match the frontend&#39;s existing constant. Every step of the pre-push checklist was run and passed. The seed script broke on production. CLAUDE.md records the two configuration decisions that let a green checklist coexist with a red production.</p>

<h3>The change and its checklist</h3>
<div class="out">Thay doi: enum ContentType.CODE  ->  CODE_REVIEW

Chay pre-push checklist:
  npx tsc --noEmit          -> XANH
  (cd frontend && tsc)      -> XANH
  (cd frontend && npm run build)  -> XANH
  npx prisma format         -> XANH
  npx prisma generate       -> XANH

Deploy production          -> npx prisma db seed HONG</div>

<div class="callout warn">
<p><strong>Every checklist item passed. Production was still broken by the same commit.</strong> The reason is two configuration decisions that make sense individually and combine into a hole: <code>tsconfig.json</code> excludes <code>prisma/**</code>, so <code>tsc --noEmit</code> literally never opened the seed file, and the seed file carried a hand-written copy of the enum union — <code>'VLOG' | ... | 'CODE' | ...</code> — so it typechecked <em>against itself</em>. Rename <code>CODE</code> to <code>CODE_REVIEW</code> in <code>schema.prisma</code>, and the string literals in the seed and the type-alias union in the seed remained perfectly consistent with each other.</p>
</div>

<h3>Two decisions, each defensible</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tsconfig excludes prisma/</span><span class="lz-t">defensible</span><span class="lz-d">the main <code>tsconfig.json</code> has <code>rootDir: ./src</code>; the seed is under <code>prisma/</code>. Including it there would force a lot of unrelated compilation. So it went in <code>exclude</code></span></div>
<div class="lz-step"><span class="lz-k">seed hand-writes the enum union</span><span class="lz-t">defensible</span><span class="lz-d">at the time it was written, importing from <code>@prisma/client</code> in a seed script had a bootstrap awkwardness. Copying the union was faster</span></div>
<div class="lz-step"><span class="lz-k">together</span><span class="lz-t">a checklist that verifies nothing about the seed</span><span class="lz-d">the union is not the real one, and no compilation ever compares it to the real one. Every rename produces a silent divergence, and the checklist declares success</span></div>
</div>

<h3>The two fixes, in order</h3>
<pre><code><span class="tok-comment"># 1. tsconfig.seed.json — kiem THAT seed script</span>
{ "extends": "./tsconfig.json",
  "include": ["prisma/**/*.ts"],
  "exclude": [] }
<span class="tok-comment"># npm run typecheck:seed</span>

<span class="tok-comment"># 2. seed.ts — bo union chep tay, import tu source of truth</span>
import { ContentType } from '@prisma/client';
<span class="tok-comment"># thay: type ContentType = 'VLOG' | ... | 'CODE' | ...;</span></code></pre>

<div class="callout ok">
<p><strong>The fix is not one thing, it is two.</strong> Adding <code>typecheck:seed</code> without removing the hand-written union just means the false type is now type-checked against itself in two places rather than one. Removing the hand-written union without adding the check means the enum-value-that-does-not-exist error would only appear at runtime, exactly as it did. Both changes are necessary; either alone leaves the hole open.</p>
</div>

<h3>The generalisable failure mode</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a checklist has coverage</span><span class="lz-lnote">the set of files or behaviours it actually examines. This is a property of the checklist, not of the codebase</span></div>
<div class="lz-layer"><span class="lz-lname">the codebase has surface</span><span class="lz-lnote">the set of files or behaviours that can break in production. This is a property of the code, not of the checklist</span></div>
<div class="lz-layer"><span class="lz-lname">the gap between them is where surprise lives</span><span class="lz-lnote">every file the checklist does not examine is a file that can break without the checklist noticing. The pre-push checklist covered <code>src/**</code> and both frontends; it did not cover <code>prisma/**</code>, and that was the file that broke</span></div>
<div class="lz-layer"><span class="lz-lname">a duplicated type is a type nobody checks</span><span class="lz-lnote">the union in <code>seed.ts</code> was a claim about what the enum was — a claim that had no relationship to <code>schema.prisma</code> after typechecking. Duplicated schemas are the specific version of this problem, and they always drift</span></div>
</div>

<h3>The audit question this produces</h3>
<div class="kv-grid">
<div class="kv"><span class="k">what does the checklist include</span><span class="v">read <code>tsconfig.json</code>&#39;s <code>include</code> and <code>exclude</code> literally. Files outside that set are unchecked by <code>tsc --noEmit</code>, regardless of what the pre-push doc says</span></div>
<div class="kv"><span class="k">what code is duplicated across those boundaries</span><span class="v">grep for enum values, DTO types, route paths, config keys. Anything named twice in two files typechecked separately is a divergence waiting to happen</span></div>
<div class="kv"><span class="k">what runs against production data during deploy</span><span class="v">the seed, migrations, background jobs. These are the files where a silent divergence produces a crash — and where they are excluded from the checklist, add them explicitly</span></div>
<div class="kv"><span class="k">did anything RUN the file, ever</span><span class="v">typechecking is not running. A file the checklist typechecks but does not execute can still fail at runtime for reasons the type system does not see. <code>npx prisma db seed</code> against a local database catches this, and the pre-push checklist now includes it</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — trusting the checklist because it exists.</strong> A pre-push checklist that passes is evidence of exactly what it says: those steps ran and did not error. It is silent about everything else. This incident&#39;s honest post-mortem is not "the checklist was wrong" but "the checklist covered the files we thought were important, and the file that broke was outside it". Adding items to the checklist is the correct response; treating an existing checklist as sufficient is not.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A checklist covers what it explicitly examines and nothing else, so a green checklist is only evidence for the files it opened — and a hand-written duplicate of a schema is a file that <em>looks</em> checked but is not being compared against anything real.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-08-08 seed incident</span><span class="lc-sub">the row that produced this lesson, including the <code>typecheck:seed</code> command and the explicit warning "run it to know, reading is not enough".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript — tsconfig include, exclude, and files</span><span class="lc-sub">typescriptlang.org/tsconfig#include — the mechanism that decides what <code>tsc</code> reads, which is the specific setting that let this hole exist.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — the seed script and importing from @prisma/client</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/seeding — the recommended pattern that would have made the enum type authoritative in the seed.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — the union that typechecks against itself</span><span class="lc-sub">/courses/typescript/learn${REF} — the general pattern of a duplicated type union, and why literal string enums are particularly prone to this.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the pre-push checklist, and adding to it after each incident</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — how the checklist grew, and the specific items added after each dated incident.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Cái seed qua sạch checklist và vỡ ở prod</h2>
<p class="lead">Ngày 2026-08-08 một giá trị enum được đổi tên cho khớp với hằng số đã có ở frontend. Từng bước của pre-push checklist đều chạy và qua. Script seed vỡ trên production. CLAUDE.md ghi lại hai quyết định cấu hình cho phép một checklist XANH cùng tồn tại với một production ĐỎ.</p>

<h3>Thay đổi và checklist của nó</h3>
<div class="out">Thay doi: enum ContentType.CODE  ->  CODE_REVIEW

Chay pre-push checklist:
  npx tsc --noEmit          -> XANH
  (cd frontend && tsc)      -> XANH
  (cd frontend && npm run build)  -> XANH
  npx prisma format         -> XANH
  npx prisma generate       -> XANH

Deploy production          -> npx prisma db seed HONG</div>

<div class="callout warn">
<p><strong>Mọi mục checklist đều qua. Production vẫn hỏng do cùng cái commit.</strong> Lý do là hai quyết định cấu hình có nghĩa riêng lẻ và kết hợp thành một CÁI LỖ: <code>tsconfig.json</code> exclude <code>prisma/**</code>, nên <code>tsc --noEmit</code> theo nghĩa đen chưa bao giờ MỞ file seed, và tệp seed mang một bản chép tay của union enum — <code>'VLOG' | ... | 'CODE' | ...</code> — nên nó typecheck <em>VỚI CHÍNH NÓ</em>. Đổi tên <code>CODE</code> thành <code>CODE_REVIEW</code> trong <code>schema.prisma</code>, và các chuỗi ký tự trong seed và union kiểu-alias trong seed vẫn HOÀN TOÀN NHẤT QUÁN với nhau.</p>
</div>

<h3>Hai quyết định, mỗi cái BẢO VỆ ĐƯỢC</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tsconfig exclude prisma/</span><span class="lz-t">bảo vệ được</span><span class="lz-d"><code>tsconfig.json</code> chính có <code>rootDir: ./src</code>; seed nằm dưới <code>prisma/</code>. Bao gồm nó ở đó sẽ ép nhiều biên dịch không liên quan. Nên nó đi vào <code>exclude</code></span></div>
<div class="lz-step"><span class="lz-k">seed CHÉP TAY union enum</span><span class="lz-t">bảo vệ được</span><span class="lz-d">lúc nó được viết, import từ <code>@prisma/client</code> trong một script seed có một chỗ vướng bootstrap. Chép union nhanh hơn</span></div>
<div class="lz-step"><span class="lz-k">cộng lại</span><span class="lz-t">một checklist KHÔNG kiểm được gì về seed</span><span class="lz-d">cái union không phải cái thật, và không có phép biên dịch nào so nó với cái thật. Mọi lần đổi tên đẻ ra một sự trôi dạt ÂM THẦM, và checklist tuyên bố thành công</span></div>
</div>

<h3>Hai bản vá, theo thứ tự</h3>
<pre><code><span class="tok-comment"># 1. tsconfig.seed.json — kiem THAT seed script</span>
{ "extends": "./tsconfig.json",
  "include": ["prisma/**/*.ts"],
  "exclude": [] }
<span class="tok-comment"># npm run typecheck:seed</span>

<span class="tok-comment"># 2. seed.ts — bo union chep tay, import tu source of truth</span>
import { ContentType } from '@prisma/client';
<span class="tok-comment"># thay: type ContentType = 'VLOG' | ... | 'CODE' | ...;</span></code></pre>

<div class="callout ok">
<p><strong>Bản vá KHÔNG phải một thứ, mà là HAI.</strong> Thêm <code>typecheck:seed</code> mà không gỡ union chép tay thì chỉ có nghĩa là cái kiểu SAI giờ được typecheck với chính nó ở HAI CHỖ chứ không phải một. Gỡ union chép tay mà không thêm phép kiểm thì lỗi giá-trị-enum-không-tồn-tại sẽ chỉ xuất hiện lúc chạy, đúng như đã xảy ra. Cả hai thay đổi đều CẦN THIẾT; một mình cái nào cũng để CÁI LỖ đó mở.</p>
</div>

<h3>Kiểu hỏng có thể tổng quát hoá</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một checklist có ĐỘ PHỦ</span><span class="lz-lnote">tập tệp hay hành vi nó THẬT SỰ soi. Đây là tính chất của CHECKLIST, không phải của codebase</span></div>
<div class="lz-layer"><span class="lz-lname">codebase có BỀ MẶT</span><span class="lz-lnote">tập tệp hay hành vi CÓ THỂ vỡ trong production. Đây là tính chất của MÃ, không phải của checklist</span></div>
<div class="lz-layer"><span class="lz-lname">khoảng CÁCH giữa hai cái là chỗ BẤT NGỜ SỐNG</span><span class="lz-lnote">mọi tệp checklist không soi là tệp CÓ THỂ vỡ mà checklist không NHẬN RA. Pre-push checklist phủ <code>src/**</code> và cả hai frontend; nó không phủ <code>prisma/**</code>, và đó là tệp đã vỡ</span></div>
<div class="lz-layer"><span class="lz-lname">một kiểu ĐƯỢC CHÉP là một kiểu KHÔNG AI kiểm</span><span class="lz-lnote">cái union trong <code>seed.ts</code> là một LỜI KHẲNG ĐỊNH về enum là gì — một lời khẳng định KHÔNG có mối quan hệ nào với <code>schema.prisma</code> sau khi typecheck. Schema bị chép là phiên bản CỤ THỂ của vấn đề này, và chúng LUÔN trôi dạt</span></div>
</div>

<h3>Câu hỏi SOÁT ra từ đây</h3>
<div class="kv-grid">
<div class="kv"><span class="k">checklist BAO GỒM gì</span><span class="v">đọc <code>include</code> và <code>exclude</code> của <code>tsconfig.json</code> theo NGHĨA ĐEN. Các tệp ngoài tập ấy KHÔNG được <code>tsc --noEmit</code> kiểm, bất kể tài liệu pre-push nói gì</span></div>
<div class="kv"><span class="k">mã nào được CHÉP xuyên ranh giới ấy</span><span class="v">grep tìm giá trị enum, kiểu DTO, đường route, khoá cấu hình. Bất cứ thứ gì được ĐẶT TÊN hai lần trong hai tệp được typecheck RIÊNG là một sự trôi dạt CHỜ XẢY RA</span></div>
<div class="kv"><span class="k">mã nào CHẠY với dữ liệu production lúc deploy</span><span class="v">seed, migration, job nền. Đây là các tệp mà một sự trôi dạt ÂM THẦM đẻ ra một cú sập — và ở chỗ chúng bị exclude khỏi checklist, hãy THÊM chúng TƯỜNG MINH</span></div>
<div class="kv"><span class="k">có gì CHẠY tệp đó, bao giờ</span><span class="v">typecheck KHÔNG phải chạy. Một tệp checklist typecheck nhưng không thực thi vẫn có thể hỏng LÚC CHẠY vì những lý do hệ kiểu không thấy. <code>npx prisma db seed</code> đối chiếu với một cơ sở dữ liệu cục bộ bắt được cái này, và pre-push checklist giờ có nó</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — TIN checklist vì nó tồn tại.</strong> Một pre-push checklist qua là bằng chứng cho ĐÚNG thứ nó nói: các bước ấy đã chạy và không lỗi. Nó IM LẶNG về mọi thứ khác. Post-mortem trung thực của sự cố này KHÔNG phải "checklist sai" mà là "checklist phủ các tệp CHÚNG TA NGHĨ là quan trọng, và tệp VỠ nằm NGOÀI nó". THÊM MỤC vào checklist là đáp trả đúng; coi một checklist đã có là ĐỦ thì không.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một checklist phủ CÁI NÓ TƯỜNG MINH SOI và không gì khác, nên một checklist XANH chỉ là bằng chứng cho các tệp nó ĐÃ MỞ — và một bản chép TAY của một schema là một tệp <em>TRÔNG</em> được kiểm nhưng KHÔNG được so với thứ gì THẬT.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố seed 2026-08-08</span><span class="lc-sub">dòng đẻ ra bài này, gồm cả câu lệnh <code>typecheck:seed</code> và cảnh báo tường minh "chạy thật mới biết, đọc không ra".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript — tsconfig include, exclude, và files</span><span class="lc-sub">typescriptlang.org/tsconfig#include — cơ chế QUYẾT ĐỊNH <code>tsc</code> đọc cái gì, chính là thiết lập cho phép cái lỗ này tồn tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — script seed và import từ @prisma/client</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/seeding — khuôn mẫu khuyến nghị lẽ ra sẽ khiến kiểu enum trở thành nguồn CHÍNH trong seed.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — union tự typecheck với CHÍNH NÓ</span><span class="lc-sub">/courses/typescript/learn${REF} — khuôn mẫu tổng quát của một union kiểu bị chép, và vì sao literal string enum ĐẶC BIỆT dễ dính chuyện này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — pre-push checklist, và cách thêm vào sau mỗi sự cố</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cách checklist lớn lên, và các mục cụ thể được thêm sau mỗi sự cố có ngày.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — The smoke test that could not smoke|||10.3 — Cái smoke test không phát khói được',
      slug: 'ga-10-3-checker-hong',
      type: 'VIDEO',
      description: 'Sự cố 2026-07-30: chốt kiểm frontend trong `deploy.sh` gọi `wget` bên trong container KHÔNG cài wget. 6 vòng lặp fail liên tục, ~25s mỗi deploy, không bắt được cái gì. "Kiểm bộ kiểm TRƯỚC khi tin nó" — đo được ở đây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>The smoke test that could not smoke</h2>
<p class="lead">A check that cannot fail is worse than no check, because it looks like a check. CLAUDE.md records the 2026-07-30 incident where the frontend smoke test in <code>deploy.sh</code> called <code>wget</code> inside a container that has neither <code>wget</code> nor <code>curl</code> installed — and did so for weeks before anybody noticed.</p>

<h3>What the deploy did</h3>
<div class="out">deploy.sh, chot kiem frontend:
  for i in 1..6:
    docker exec frontend wget -q -O - localhost:3000/  || sleep 5
  done

Ket qua:
  wget: not found            (Dockerfile khong cai wget lan curl)
  vong lap chay du 6 lan     (~25 giay moi deploy)
  bao "check failed" moi lan
  KHONG bat duoc gi that su vi khong chay duoc</div>

<div class="callout warn">
<p><strong>The check ran, failed, and did not fail the deploy.</strong> Because it was written as best-effort — the <code>|| sleep 5</code> swallowed the failure and moved on — every deploy passed the check by virtue of ignoring it. The Dockerfile deliberately excluded <code>wget</code> and <code>curl</code> because the compose healthcheck used Node&#39;s <code>http</code> module. Nobody who wrote the check knew that.</p>
</div>

<h3>The generalisable pattern</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a check depends on a tool</span><span class="lz-t">wget in the container</span><span class="lz-d">and that tool being present is a separate claim from the check being correct</span></div>
<div class="lz-step"><span class="lz-k">the tool is absent</span><span class="lz-t">Dockerfile omitted it deliberately</span><span class="lz-d">the removal was correct — the image was smaller. The check just happened to depend on what got removed</span></div>
<div class="lz-step"><span class="lz-k">the check fails silently</span><span class="lz-t">a retry loop that always exhausts</span><span class="lz-d">looks like a robustness feature; is actually the specific mechanism that hides the diagnostic</span></div>
</div>

<h3>The fix, and the meta-fix</h3>
<pre><code><span class="tok-comment"># fix cu the: dung node -e (image LUON co node)</span>
docker exec frontend node -e "
  require('http').get('http://localhost:3000/', r =&gt; process.exit(r.statusCode&lt;400?0:1));
"

<span class="tok-comment"># fix meta: "kiem bo kiem TRUOC khi tin no"</span>
<span class="tok-comment"># Deploy mot commit LAM HONG duong smoke, xem check co DO khong</span>
<span class="tok-comment"># Neu no van XANH, cai check ay khong ton tai</span></code></pre>

<div class="callout ok">
<p><strong>The specific fix is trivial; the meta-fix is the point.</strong> A check that has never been observed failing is a check whose behaviour is unknown. The discipline is: after adding any check, deliberately break the thing it checks and confirm the check turns red. If it does not, the check is decoration.</p>
</div>

<h3>Where this pattern shows up elsewhere in this course</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the dead cache (5.3)</span><span class="v"><code>node_modules/.cache</code> never existed, so <code>actions/cache</code> never saved. The <em>test</em> for that check is to observe a cache hit — and if you never observe one, the cache does not exist</span></div>
<div class="kv"><span class="k">the audit script bug (6.5)</span><span class="v"><code>grep -c</code> undercounted by nine; found only because the same number was measured twice by different methods. Two independent measurements is the meta-fix</span></div>
<div class="kv"><span class="k">the pipe trap, three times (2.4, 6.5, 8.1)</span><span class="v">a check&#39;s exit code disappeared through a <code>|</code>. Same shape as this lesson: the mechanism reported nothing, and nothing looked like success</span></div>
<div class="kv"><span class="k">the SSH block that drifted (4.5)</span><span class="v">nine copies, in two versions, with no automation confirming they were the same. A test that any changed copy fires an alarm would have surfaced it</span></div>
</div>

<h3>Reading this as a workflow rule</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">check your check with a broken input</span><span class="lz-lnote">the smoke test above should refuse a deploy where the container returns 500. Deploy such a container deliberately, once, and confirm the deploy refuses. Then trust the check</span></div>
<div class="lz-layer"><span class="lz-lname">have the check FAIL LOUDLY</span><span class="lz-lnote">exit non-zero. Print the specific reason. Never <code>|| sleep</code> or <code>|| true</code> on a check — that flag pattern is for optional cleanup, not for evidence</span></div>
<div class="lz-layer"><span class="lz-lname">reject checks whose absence is invisible</span><span class="lz-lnote">a check with no output when it works is a check nobody notices when it stops working. Print at least "ok" — cheap, and readable when scrolling back through a deploy log</span></div>
<div class="lz-layer"><span class="lz-lname">the deploy&#39;s log is where you find out</span><span class="lz-lnote">Chapter 5&#39;s three-run rule applies here: after adding a check, watch three deploys&#39; output for it. If it does not appear or does not fire on any of them, the check has not been verified</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the check whose failure means "flake, ignore".</strong> A smoke test that intermittently fails will be ignored the first time and disabled the second — CLAUDE.md&#39;s history has several checks that were removed because they were unreliable. That is a rational response to noise, and it is also how a real regression eventually reaches production. If a check is noisy, fix the noise or delete the check; leaving it in place with instructions to ignore it is the worst option.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A check that never fails is not a check, so verify every check by breaking the thing it checks and watching it turn red — and if it will not turn red, the check is decoration and the reader who trusts it is the second victim of the same silent failure.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-30 wget-not-installed incident</span><span class="lc-sub">the row that produced this lesson, including the specific note that the frontend container uses Node&#39;s http module for its own healthcheck.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: setting a job as failing</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the specific commands that fail a step loudly, which is what a check must do to be evidence.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring distributed systems: alerting</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — the industry version of the rule above: a check whose absence is not measured is a check that failed silently at some point in the past.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke tests, and the checker check</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the specific smoke test this repository now uses, and how each check was verified against a deliberately broken deploy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — minimal images and the tools they lack</span><span class="lc-sub">/courses/docker/learn${REF} — why production containers omit debug tools, and the pattern for health probes that work with only what is present.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Cái smoke test không phát khói được</h2>
<p class="lead">Một phép kiểm KHÔNG THỂ hỏng còn TỆ HƠN không có phép kiểm nào, bởi nó TRÔNG như một phép kiểm. CLAUDE.md ghi lại sự cố 2026-07-30 nơi smoke test frontend trong <code>deploy.sh</code> gọi <code>wget</code> bên trong một container KHÔNG cài <code>wget</code> lẫn <code>curl</code> — và làm thế suốt nhiều tuần trước khi ai nhận ra.</p>

<h3>Deploy đã làm gì</h3>
<div class="out">deploy.sh, chot kiem frontend:
  for i in 1..6:
    docker exec frontend wget -q -O - localhost:3000/  || sleep 5
  done

Ket qua:
  wget: not found            (Dockerfile khong cai wget lan curl)
  vong lap chay du 6 lan     (~25 giay moi deploy)
  bao "check failed" moi lan
  KHONG bat duoc gi that su vi khong chay duoc</div>

<div class="callout warn">
<p><strong>Phép kiểm CÓ chạy, CÓ hỏng, và KHÔNG làm hỏng deploy.</strong> Bởi nó được viết dưới dạng cố-gắng-hết-sức — cái <code>|| sleep 5</code> nuốt cú hỏng và đi tiếp — mọi cuộc deploy QUA phép kiểm bằng cách BỎ QUA nó. Dockerfile CỐ Ý bỏ <code>wget</code> và <code>curl</code> vì healthcheck của compose dùng module <code>http</code> của Node. Không ai viết phép kiểm biết chuyện đó.</p>
</div>

<h3>Khuôn mẫu tổng quát hoá được</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một phép kiểm PHỤ THUỘC một công cụ</span><span class="lz-t">wget trong container</span><span class="lz-d">và việc công cụ ấy CÓ MẶT là một LỜI KHẲNG ĐỊNH RIÊNG với việc phép kiểm ĐÚNG</span></div>
<div class="lz-step"><span class="lz-k">công cụ VẮNG MẶT</span><span class="lz-t">Dockerfile CỐ Ý bỏ nó</span><span class="lz-d">việc gỡ là ĐÚNG — ảnh nhỏ hơn. Phép kiểm chỉ tình cờ phụ thuộc vào cái BỊ GỠ</span></div>
<div class="lz-step"><span class="lz-k">phép kiểm hỏng ÂM THẦM</span><span class="lz-t">một vòng retry luôn CẠN</span><span class="lz-d">TRÔNG như một tính năng bền bỉ; THẬT RA là cơ chế CỤ THỂ giấu đi phần chẩn đoán</span></div>
</div>

<h3>Bản vá, và bản vá META</h3>
<pre><code><span class="tok-comment"># fix cu the: dung node -e (image LUON co node)</span>
docker exec frontend node -e "
  require('http').get('http://localhost:3000/', r =&gt; process.exit(r.statusCode&lt;400?0:1));
"

<span class="tok-comment"># fix meta: "kiem bo kiem TRUOC khi tin no"</span>
<span class="tok-comment"># Deploy mot commit LAM HONG duong smoke, xem check co DO khong</span>
<span class="tok-comment"># Neu no van XANH, cai check ay khong ton tai</span></code></pre>

<div class="callout ok">
<p><strong>Bản vá cụ thể thì tầm thường; bản vá META mới là điểm chính.</strong> Một phép kiểm CHƯA BAO GIỜ được quan sát HỎNG là một phép kiểm mà HÀNH VI của nó CHƯA BIẾT. Kỷ luật là: sau khi thêm bất kỳ phép kiểm nào, CỐ Ý làm hỏng thứ nó kiểm và xác nhận phép kiểm chuyển ĐỎ. Nếu không, phép kiểm là ĐỒ TRANG TRÍ.</p>
</div>

<h3>Chỗ khuôn mẫu này xuất hiện ở NƠI KHÁC trong khoá này</h3>
<div class="kv-grid">
<div class="kv"><span class="k">cái cache chết (bài 5.3)</span><span class="v"><code>node_modules/.cache</code> chưa bao giờ tồn tại, nên <code>actions/cache</code> chưa bao giờ lưu. <em>PHÉP THỬ</em> cho phép kiểm ấy là QUAN SÁT một lần trúng cache — và nếu bạn KHÔNG BAO GIỜ quan sát được một lần, thì cache KHÔNG tồn tại</span></div>
<div class="kv"><span class="k">lỗi script soát (bài 6.5)</span><span class="v"><code>grep -c</code> đếm thiếu 9; tìm ra CHỈ vì cùng con số được đo HAI LẦN bằng hai cách. HAI phép đo ĐỘC LẬP là bản vá META</span></div>
<div class="kv"><span class="k">cái bẫy ống, BA lần (bài 2.4, 6.5, 8.1)</span><span class="v">mã thoát của một phép kiểm BIẾN MẤT qua một <code>|</code>. Cùng hình dạng với bài này: cơ chế báo cáo con số không, và con số không TRÔNG như thành công</span></div>
<div class="kv"><span class="k">khối SSH trôi dạt (bài 4.5)</span><span class="v">chín bản chép, hai phiên bản, không có tự động hoá nào xác nhận chúng giống nhau. Một phép kiểm mà bất kỳ bản chép nào đổi thì báo động sẽ đã phơi nó ra</span></div>
</div>

<h3>Đọc cái này thành một quy tắc workflow</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">kiểm phép kiểm với ĐẦU VÀO HỎNG</span><span class="lz-lnote">smoke test bên trên phải TỪ CHỐI một cuộc deploy nơi container trả 500. Deploy một container như thế CÓ CHỦ Ý, một lần, và xác nhận cuộc deploy TỪ CHỐI. Rồi mới TIN phép kiểm</span></div>
<div class="lz-layer"><span class="lz-lname">phép kiểm phải HỎNG TO</span><span class="lz-lnote">thoát khác không. In ra lý do CỤ THỂ. Không bao giờ <code>|| sleep</code> hay <code>|| true</code> trên một phép kiểm — khuôn mẫu cờ ấy là cho DỌN DẸP tuỳ chọn, không cho bằng chứng</span></div>
<div class="lz-layer"><span class="lz-lname">TỪ CHỐI phép kiểm mà sự VẮNG MẶT là VÔ HÌNH</span><span class="lz-lnote">một phép kiểm không có đầu ra khi nó chạy là một phép kiểm không ai để ý khi nó THÔI chạy. In ít nhất "ok" — rẻ, và ĐỌC ĐƯỢC khi cuộn ngược qua log deploy</span></div>
<div class="lz-layer"><span class="lz-lname">log của DEPLOY là nơi bạn PHÁT HIỆN</span><span class="lz-lnote">Quy tắc ba-lần-chạy của Chương 5 áp ở đây: sau khi thêm một phép kiểm, XEM đầu ra của ba cuộc deploy cho nó. Nếu nó KHÔNG xuất hiện hay KHÔNG nổ ở lần nào trong ba, phép kiểm chưa được KIỂM CHỨNG</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — phép kiểm mà hỏng nghĩa là "flake, bỏ qua".</strong> Một smoke test hỏng chập chờn sẽ bị BỎ QUA lần đầu và TẮT lần thứ hai — lịch sử CLAUDE.md có vài phép kiểm bị GỠ vì chúng không đáng tin. Đó là đáp trả hợp lý với tiếng ồn, và cũng là cách một cú THOÁI LUI THẬT rốt cuộc tới production. Nếu một phép kiểm ồn, hãy vá cái ồn hoặc XOÁ phép kiểm; để nó tại chỗ với chỉ dẫn bỏ qua là lựa chọn TỆ NHẤT.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một phép kiểm không bao giờ hỏng KHÔNG PHẢI phép kiểm, nên hãy KIỂM CHỨNG mọi phép kiểm bằng cách LÀM HỎNG thứ nó kiểm và XEM nó chuyển đỏ — và nếu nó không chịu chuyển đỏ, phép kiểm là ĐỒ TRANG TRÍ và người đọc TIN nó là NẠN NHÂN THỨ HAI của cùng một cú hỏng âm thầm.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố wget-không-cài 2026-07-30</span><span class="lc-sub">dòng đẻ ra bài này, gồm cả ghi chú cụ thể rằng container frontend dùng module http của Node cho healthcheck của chính nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: đặt job là hỏng</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — các lệnh cụ thể để làm một bước HỎNG TO, đó là thứ một phép kiểm PHẢI làm để thành BẰNG CHỨNG.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — giám sát hệ phân tán: cảnh báo</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — bản ngành công nghiệp của quy tắc bên trên: một phép kiểm mà SỰ VẮNG MẶT không được đo là một phép kiểm đã hỏng ÂM THẦM ở một thời điểm nào đó trong quá khứ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke test, và phép kiểm CỦA phép kiểm</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — smoke test cụ thể kho này giờ dùng, và cách mỗi phép kiểm được kiểm chứng đối chiếu với một cuộc deploy CỐ Ý hỏng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh tối thiểu và các công cụ chúng THIẾU</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao container production BỎ các công cụ debug, và khuôn mẫu cho phép thăm dò sức khoẻ chạy được với CHỈ những gì có mặt.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Killing by name misses; kill by port|||10.4 — Diệt theo tên trượt; hãy diệt theo cổng',
      slug: 'ga-10-4-diet-cong',
      type: 'VIDEO',
      description: 'Sự cố 2026-07-30: `/playground` kẹt màn hình tải suốt hai phiên, không lỗi nào. Nguyên do là Next.js chốt danh sách `public/` lúc SERVER KHỞI ĐỘNG — dựng lại đổi tên gói JS ⇒ server cũ trả 404 dù file có thật trên đĩa. Rồi bẫy diệt tiến trình: `pkill -f "next start"` KHÔNG khớp vì Node đổi tên tiến trình thành `next-server`. Bài dạy luật: diệt theo CỔNG, không theo TÊN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Killing by name misses; kill by port</h2>
<p class="lead">CLAUDE.md records the 2026-07-30 Playground incident with an unusual amount of detail — two whole sessions were spent on it. Reading it as a diagnostic exercise recovers two rules: <em>restart Next when anything in <code>public/</code> changes</em>, and <em>kill by port, never by process name</em>. This lesson demonstrates both, with the raw measurements that make them believable.</p>

<h3>The symptom that looked like nothing</h3>
<div class="out">30/07/2026:
  /playground = trang HTML tinh, spinner quay mai
  Network:  200 OK cho HTML, 200 OK cho .ktx preload
  Console:  khong loi
  Server:   khong loi
Chan doan sai lan 1:  "chac trinh duyet bi cache" -> ctrl+F5, van the
Chan doan sai lan 2:  "chac WebGL vo trong headless" -> dung Chrome that, van the
Thoi gian mat:        hai phien Claude, ~90 phut
</div>

<p>Two false leads, and both were fed by <strong>200 OK</strong>. The browser reported success on every request the Network tab actually showed. The trap was that the Network tab did not show every request — the JavaScript chunk that would have registered <code>Loading.tsx</code> to disappear was requested by a URL that returned <em>404</em>, and the loader (a plain HTML/CSS spinner) had no error handler because it was never expecting to be alive long enough for the JS to fail.</p>

<h3>What Next.js actually does with <code>public/</code></h3>
<p>The mechanism, extracted from Next 15's source, is one sentence: <em>Next.js reads the file list of <code>public/</code> once, at server startup, and answers requests from that snapshot for the rest of the server's lifetime</em>. Files added to <code>public/</code> after startup are on disk but not on the map — they return <strong>404</strong>. This is the same shape as the stale-build symptom in lesson 10.1, and yields to the same <code>curl</code> test:</p>

<pre><code class="language-bash">$ curl -sI localhost:3000/_next/static/chunks/app/playground-a7c8f2.js
HTTP/1.1 404 Not Found
$ ls -la frontend/public/_next/static/chunks/app/playground-a7c8f2.js
-rw-r--r-- 1 user user 187294 Jul 30 14:22 playground-a7c8f2.js
</code></pre>

<div class="out">File CO tren dia (187 KB, gio phut khop).  Server tra 404.
Ket luan:  server dang tra loi tu MOT DANH SACH FILE cu, khong tu dia.
Bien phap:  KHOI DONG LAI Next.
</div>

<p>That diagnostic is worth memorising. Any time a static asset returns 404 while <code>ls</code> shows it exists, the process serving it is holding a snapshot from before the file was created. For Next.js in dev/start mode the trigger is a rebuild that renames content-hashed chunks; for Nginx it is a <code>root</code> or <code>alias</code> that resolved once. Same shape, same fix.</p>

<h3>The second trap: killing a process by its name</h3>
<p>Restarting is one line — unless the kill misses. CLAUDE.md notes that both <code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> silently matched nothing. To see why, measure what Node actually calls the process:</p>

<pre><code class="language-bash">$ npm start &amp;
$ sleep 3
$ ps -eo pid,comm,args | grep -v grep | grep -Ei 'next|node'
</code></pre>

<div class="out">14872 npm start         npm start
14893 node              node /home/user/app/frontend/node_modules/.bin/next start
14905 next-server       next-server (v15.3.4)
</div>

<p>The child that actually holds port 3000 is PID 14905, and its <code>comm</code> (the short name shown to <code>pkill</code> and <code>pgrep</code>) is <strong><code>next-server</code></strong>. Neither <code>next start</code> nor <code>standalone/server.js</code> appears in that column. <code>pkill -f</code> matches against the full argv, and Node has rewritten argv to <code>"next-server (v15.3.4)"</code> — so <code>-f "next start"</code> matches the launcher (14893) but leaves the actual server (14905) alive. Once the launcher dies, the actual server is inherited by <code>init</code> and keeps holding the port.</p>

<div class="callout warn">
<p><strong>The failure mode.</strong> A restart script that runs <code>pkill</code> and then <code>npm start</code> sees the new process crash immediately with <code>EADDRINUSE: address already in use :::3000</code>. Read backwards: the crash is the <em>new</em> server dying because the <em>old</em> server, which the kill was supposed to hit, is still there. The kill's exit status was zero because <code>pkill -f</code> without matches returns 1 and the script probably swallowed it (<code>|| true</code>), and even without <code>|| true</code>, matching the launcher counts as a success.</p>
</div>

<h3>The rule that survives</h3>
<p>Kill by the invariant of what you actually want to release. For a network daemon that invariant is a <strong>port</strong>, not a name. The one line that always works:</p>

<pre><code class="language-bash">$ lsof -ti:3000 | xargs -r kill -9
</code></pre>

<p><code>lsof -ti:3000</code> prints the PIDs of every process currently listening on port 3000 — one PID per line, no header. <code>xargs -r</code> refuses to run <code>kill</code> when no PIDs came through, so the command is safe to run when nothing is listening. <code>kill -9</code> is deliberately blunt: a <code>next-server</code> that ignored SIGTERM will not ignore SIGKILL. This is one of the few places where <code>-9</code> is the right first choice — a listening daemon that will not release its socket is exactly the case the signal was designed for.</p>

<h3>Measuring the rule against the wrong tools</h3>
<div class="out">$ npm start &amp;                              # server 1
$ sleep 3
$ pkill -f "next start"                     # cach cu
$ echo "exit: $?"
exit: 0                                     # bao 0 nhu tam sat
$ lsof -ti:3000
14905                                       # server VAN song
$ npm start                                 # thu chay lai
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1898:16)
</div>

<div class="out">$ lsof -ti:3000 | xargs -r kill -9         # cach dung
$ lsof -ti:3000
                                            # rong
$ npm start
&gt; Ready in 1.3s                             # server 2 khoi dong sach
</div>

<p>Two lines, one measurement each, and the exit code of the wrong one is the punchline: it lies. <code>pkill -f "next start"</code> returned zero, <em>and</em> left the actual server alive, <em>and</em> then blocked the next start with a port collision. Every layer of the system reported success.</p>

<h3>Why production does not have this bug</h3>
<p>Production is spared because its restart mechanism is <em>replace the container</em>, not <em>kill the process</em>. In <code>Dockerfile.frontend</code>, <code>COPY . .</code> happens <strong>before</strong> <code>next build</code>, so every deploy produces a fresh image with the new <code>public/</code> baked in and the new bundle names known at startup. The old container is destroyed by <code>docker compose up -d</code>, which releases its port as a side effect of removing the process namespace it lived in. No <code>pkill</code>, no name matching, no orphan child inheriting a socket.</p>

<div class="callout ok">
<p><strong>The generalisation.</strong> When you can, replace processes instead of restarting them. Containers, systemd units with <code>Restart=always</code>, PM2 in <code>graceful-reload</code> mode — all avoid the kill-by-name trap because the manager tracks the process by an identifier the manager itself assigned, not by a name Node might rewrite. Kill-by-port is the fallback for interactive dev, not the primary mechanism for prod.</p>
</div>

<h3>Why the diagnosis took two sessions</h3>
<p>The retrospective is worth extracting because it is the same shape as most of the incidents in this chapter. The evidence pattern was:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">what was visible</span><span class="lz-d">Loading spinner. Network tab: 200 OK for HTML and for the one preload (a <code>.ktx</code> file, whose name is fixed in source and therefore did not change across rebuilds).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">what was invisible</span><span class="lz-d">The JavaScript chunk that would have rendered the loading state away. Its URL was not in the initial HTML — it was loaded by another chunk — and no error reached <code>window.onerror</code> because the fetch was suppressed by the browser as a normal 404.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">why the first fix seemed to work</span><span class="lz-d">A hard reload cleared the browser cache and made the failure appear to change — sometimes the page rendered for a beat before spinning, sometimes not — reinforcing the false hypothesis that this was a client-side race.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">the disproof</span><span class="lz-d">One <code>curl -sI</code> to the failing URL returned 404. The server was the liar, not the browser. Everything else fell out of that.</span></div>
</div>

<p>The pattern to internalise: <strong>when a symptom survives all the client-side fixes you can think of, the server is the last place you looked and it will be the answer</strong>. The 404-with-file-on-disk from lesson 10.1 and the spinner-with-200s here are the same bug wearing different clothes.</p>

<h3>The one-line runbook</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">any static asset returns 404</span><span class="lz-lnote">check the disk with <code>ls</code>. If it is there, restart the server that serves it. Do not investigate further before that step.</span></div>
<div class="lz-layer"><span class="lz-lname">restarting a daemon that binds a port</span><span class="lz-lnote">kill by port (<code>lsof -ti:PORT | xargs -r kill -9</code>) and start the new one. Never <code>pkill -f</code> a Node process — Node renames itself.</span></div>
<div class="lz-layer"><span class="lz-lname">writing a restart script</span><span class="lz-lnote">the script is not done until you have watched it kill an old server, seen the new one start on the same port, and verified the port count went 1 → 0 → 1. If the middle step was 1 → 1 → 1, the kill did not work.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — assume the exit code is the truth.</strong> <code>pkill -f "next start"</code> returning zero means <em>at least one process was matched and signalled</em>, not <em>the process I wanted is gone</em>. The correct post-condition is <code>lsof -ti:PORT</code> printing nothing. A test that does not check its post-condition is not a test — same rule as the smoke test in lesson 10.3.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A process's name is a label the process can rewrite, so a kill script that matches on the name will silently miss a process that renamed itself — kill by the invariant of what you actually want to release, which for a network daemon is the <em>port</em>, and verify with <code>lsof</code> that the port is free before starting the replacement.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — 2026-07-30 Playground incident</span><span class="lc-sub">the raw record: two sessions of failed diagnosis, and the specific note that <code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> both silently miss because Node renames the process to <code>next-server</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js docs — process.title and how it rewrites argv</span><span class="lc-sub">nodejs.org/api/process.html#processtitle — the mechanism behind the rename: Node overwrites the memory <code>ps</code> reads from, so <code>pkill -f</code>, <code>ps</code>, <code>htop</code> all show the new name.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Next.js docs — the public folder</span><span class="lc-sub">nextjs.org/docs/app/building-your-application/optimizing/static-assets — the sentence about the folder being served from disk buries the caveat about the file list being fixed at startup; you have to read the source to see it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof — the exact flags used here</span><span class="lc-sub">man7.org/linux/man-pages/man8/lsof.8.html — <code>-t</code> gives terse output (PID only), <code>-i:PORT</code> filters to processes bound to a port. Together they are one of the shortest useful shell idioms.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — signals and process lifecycles</span><span class="lc-sub">/courses/linux-bash/learn${REF} — SIGTERM versus SIGKILL, orphaned processes, why <code>init</code> inherits them, and when a <code>-9</code> is the right first choice instead of the last.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — image immutability as a restart strategy</span><span class="lc-sub">/courses/docker/learn${REF} — why <em>replace the container</em> beats <em>restart the process</em>, and why prod does not have the bug this lesson taught you to survive in dev.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Diệt theo tên trượt; hãy diệt theo cổng</h2>
<p class="lead">CLAUDE.md ghi sự cố Playground 30/07/2026 với lượng chi tiết bất thường — hai phiên nguyên bị đốt vào nó. Đọc như bài tập chẩn đoán thì rút ra hai quy tắc: <em>khởi động lại Next khi bất cứ thứ gì trong <code>public/</code> đổi</em>, và <em>diệt theo cổng, không bao giờ theo tên tiến trình</em>. Bài này trình diễn cả hai, với các số đo thô làm chúng đáng tin.</p>

<h3>Triệu chứng trông như không có gì</h3>
<div class="out">30/07/2026:
  /playground = trang HTML tinh, spinner quay mai
  Network:  200 OK cho HTML, 200 OK cho .ktx preload
  Console:  khong loi
  Server:   khong loi
Chan doan sai lan 1:  "chac trinh duyet bi cache" -> ctrl+F5, van the
Chan doan sai lan 2:  "chac WebGL vo trong headless" -> dung Chrome that, van the
Thoi gian mat:        hai phien Claude, ~90 phut
</div>

<p>Hai lối mòn sai, và cả hai đều được nuôi bởi <strong>200 OK</strong>. Trình duyệt báo thành công trên mọi yêu cầu mà tab Network THẬT SỰ hiện. Cái bẫy nằm ở chỗ tab Network KHÔNG hiện mọi yêu cầu — đoạn JavaScript đáng lẽ đăng ký <code>Loading.tsx</code> biến đi được yêu cầu bằng một URL trả về <em>404</em>, và cái loader (một spinner HTML/CSS thuần) không có xử lý lỗi vì nó không hề trông đợi mình còn sống đủ lâu để JS hỏng.</p>

<h3>Next.js thật sự làm gì với <code>public/</code></h3>
<p>Cơ chế, trích từ mã nguồn Next 15, gói vào một câu: <em>Next.js đọc danh sách file của <code>public/</code> một lần, lúc SERVER KHỞI ĐỘNG, và trả lời yêu cầu từ ảnh chụp đó cho toàn bộ thời gian sống của server</em>. File được thêm vào <code>public/</code> sau khi khởi động có trên đĩa nhưng không có trên bản đồ — chúng trả <strong>404</strong>. Đây cùng hình dạng với triệu chứng bản-dựng-cũ ở bài 10.1, và chịu cùng phép kiểm bằng <code>curl</code>:</p>

<pre><code class="language-bash">$ curl -sI localhost:3000/_next/static/chunks/app/playground-a7c8f2.js
HTTP/1.1 404 Not Found
$ ls -la frontend/public/_next/static/chunks/app/playground-a7c8f2.js
-rw-r--r-- 1 user user 187294 Jul 30 14:22 playground-a7c8f2.js
</code></pre>

<div class="out">File CO tren dia (187 KB, gio phut khop).  Server tra 404.
Ket luan:  server dang tra loi tu MOT DANH SACH FILE cu, khong tu dia.
Bien phap:  KHOI DONG LAI Next.
</div>

<p>Phép chẩn đoán ấy đáng thuộc lòng. Bất cứ khi nào một tài sản tĩnh trả 404 trong khi <code>ls</code> thấy nó tồn tại, tiến trình đang phục vụ nó đang giữ một ảnh chụp TỪ TRƯỚC khi file được tạo. Với Next.js ở chế độ dev/start, tác nhân là một cuộc dựng lại đổi tên các chunk băm-theo-nội-dung; với Nginx là một <code>root</code> hay <code>alias</code> phân giải một lần. Cùng hình dạng, cùng cách vá.</p>

<h3>Cái bẫy thứ hai: diệt tiến trình bằng tên</h3>
<p>Khởi động lại là một dòng — trừ khi cú diệt trượt. CLAUDE.md ghi rằng cả <code>pkill -f "next start"</code> lẫn <code>pkill -f "standalone/server.js"</code> ÂM THẦM không khớp gì. Để thấy tại sao, đo xem Node THẬT SỰ gọi tiến trình là gì:</p>

<pre><code class="language-bash">$ npm start &amp;
$ sleep 3
$ ps -eo pid,comm,args | grep -v grep | grep -Ei 'next|node'
</code></pre>

<div class="out">14872 npm start         npm start
14893 node              node /home/user/app/frontend/node_modules/.bin/next start
14905 next-server       next-server (v15.3.4)
</div>

<p>Đứa con THẬT SỰ giữ cổng 3000 là PID 14905, và <code>comm</code> của nó (tên ngắn mà <code>pkill</code> và <code>pgrep</code> thấy) là <strong><code>next-server</code></strong>. Cả <code>next start</code> lẫn <code>standalone/server.js</code> đều KHÔNG xuất hiện ở cột đó. <code>pkill -f</code> đối chiếu với toàn argv, và Node đã ghi đè argv thành <code>"next-server (v15.3.4)"</code> — nên <code>-f "next start"</code> khớp bộ khởi động (14893) nhưng bỏ lại server thật (14905) sống. Một khi bộ khởi động chết, server thật được <code>init</code> nhận nuôi và tiếp tục giữ cổng.</p>

<div class="callout warn">
<p><strong>Kiểu hỏng.</strong> Một script khởi-động-lại chạy <code>pkill</code> rồi <code>npm start</code> sẽ thấy tiến trình mới sập ngay lập tức với <code>EADDRINUSE: address already in use :::3000</code>. Đọc ngược lại: cú sập là server <em>mới</em> chết vì server <em>cũ</em>, thứ đáng lẽ cú diệt phải đánh trúng, vẫn còn đó. Mã thoát của cú diệt là số không vì <code>pkill -f</code> không khớp gì trả 1 và script có lẽ đã nuốt (<code>|| true</code>), và ngay cả không có <code>|| true</code>, khớp trúng bộ khởi động cũng được tính là thành công.</p>
</div>

<h3>Luật sống sót</h3>
<p>Diệt theo bất biến của thứ bạn THẬT SỰ muốn giải phóng. Với một daemon mạng, bất biến ấy là một <strong>cổng</strong>, không phải một tên. Một dòng luôn chạy được:</p>

<pre><code class="language-bash">$ lsof -ti:3000 | xargs -r kill -9
</code></pre>

<p><code>lsof -ti:3000</code> in ra PID của mọi tiến trình đang nghe cổng 3000 — một PID mỗi dòng, không có tiêu đề. <code>xargs -r</code> từ chối chạy <code>kill</code> khi không có PID nào đến, nên lệnh an toàn để chạy cả khi không có gì đang nghe. <code>kill -9</code> cố ý cùn: một <code>next-server</code> lờ đi SIGTERM sẽ không lờ được SIGKILL. Đây là một trong số ít chỗ mà <code>-9</code> là chọn lựa đầu tiên đúng — một daemon nghe cổng không chịu nhả socket là chính trường hợp mà tín hiệu ấy được thiết kế cho.</p>

<h3>Đo luật đối chiếu với công cụ SAI</h3>
<div class="out">$ npm start &amp;                              # server 1
$ sleep 3
$ pkill -f "next start"                     # cach cu
$ echo "exit: $?"
exit: 0                                     # bao 0 nhu tam sat
$ lsof -ti:3000
14905                                       # server VAN song
$ npm start                                 # thu chay lai
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1898:16)
</div>

<div class="out">$ lsof -ti:3000 | xargs -r kill -9         # cach dung
$ lsof -ti:3000
                                            # rong
$ npm start
&gt; Ready in 1.3s                             # server 2 khoi dong sach
</div>

<p>Hai dòng, mỗi dòng một số đo, và mã thoát của dòng SAI là điểm nhấn: nó nói dối. <code>pkill -f "next start"</code> trả số không, <em>và</em> để server thật sống, <em>và</em> chặn cú khởi động kế bằng một cú đụng cổng. Mọi tầng của hệ báo cáo thành công.</p>

<h3>Tại sao production không dính lỗi này</h3>
<p>Production được tha vì cơ chế khởi động lại của nó là <em>thay container</em>, không phải <em>diệt tiến trình</em>. Trong <code>Dockerfile.frontend</code>, <code>COPY . .</code> xảy ra <strong>trước</strong> <code>next build</code>, nên mỗi cuộc deploy sinh ra một ảnh mới với <code>public/</code> mới nướng vào và tên gói mới biết-lúc-khởi-động. Container cũ bị <code>docker compose up -d</code> huỷ, và cổng của nó được giải phóng như một hệ quả phụ của việc gỡ không gian tên tiến trình mà nó sống trong. Không <code>pkill</code>, không đối chiếu tên, không đứa con mồ côi thừa hưởng một socket.</p>

<div class="callout ok">
<p><strong>Cách tổng quát hoá.</strong> Khi có thể, THAY tiến trình thay vì KHỞI ĐỘNG LẠI nó. Container, đơn vị systemd với <code>Restart=always</code>, PM2 ở chế độ <code>graceful-reload</code> — tất cả tránh bẫy diệt-theo-tên vì bộ quản lý theo dõi tiến trình bằng một mã định danh do CHÍNH bộ quản lý gán, không phải bằng một tên Node có thể ghi đè. Diệt-theo-cổng là đường lùi cho dev tương tác, không phải cơ chế chính cho prod.</p>
</div>

<h3>Vì sao chẩn đoán mất hai phiên</h3>
<p>Bản hồi cứu đáng trích vì nó có cùng hình dạng với hầu hết sự cố trong chương này. Khuôn mẫu bằng chứng là:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cái NHÌN THẤY được</span><span class="lz-d">Spinner tải. Tab Network: 200 OK cho HTML và cho một preload duy nhất (file <code>.ktx</code>, tên cố định trong mã nguồn nên KHÔNG đổi qua các cuộc dựng lại).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cái KHÔNG NHÌN THẤY được</span><span class="lz-d">Đoạn JavaScript đáng lẽ dựng trạng thái tải biến đi. URL của nó không có trong HTML gốc — nó được tải bởi một đoạn khác — và không lỗi nào tới được <code>window.onerror</code> vì cú fetch bị trình duyệt nén như một 404 bình thường.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">vì sao cú vá đầu TRÔNG có tác dụng</span><span class="lz-d">Một cuộc tải-lại-cứng dọn cache trình duyệt và làm cú hỏng có vẻ ĐỔI — có lúc trang hiện lên một nhịp trước khi xoay, có lúc không — củng cố giả thuyết sai rằng đây là một cuộc đua bên máy khách.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bằng chứng phản</span><span class="lz-d">Một cú <code>curl -sI</code> tới URL hỏng trả 404. SERVER mới là kẻ nói dối, không phải trình duyệt. Mọi thứ khác rơi ra khỏi đó.</span></div>
</div>

<p>Khuôn mẫu cần khắc: <strong>khi một triệu chứng sống sót qua mọi cú vá bên máy khách bạn có thể nghĩ ra, SERVER là nơi cuối cùng bạn nhìn tới và sẽ là câu trả lời</strong>. 404-với-file-trên-đĩa ở bài 10.1 và spinner-với-200-mọi-nơi ở đây là cùng một lỗi mặc quần áo khác.</p>

<h3>Sổ vận hành một-dòng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">bất kỳ tài sản tĩnh nào trả 404</span><span class="lz-lnote">kiểm đĩa với <code>ls</code>. Nếu nó ở đó, khởi động lại server phục vụ nó. Đừng điều tra thêm trước bước ấy.</span></div>
<div class="lz-layer"><span class="lz-lname">khởi động lại một daemon bám cổng</span><span class="lz-lnote">diệt theo cổng (<code>lsof -ti:PORT | xargs -r kill -9</code>) rồi khởi cái mới. KHÔNG BAO GIỜ <code>pkill -f</code> một tiến trình Node — Node tự đổi tên nó.</span></div>
<div class="lz-layer"><span class="lz-lname">viết một script khởi động lại</span><span class="lz-lnote">script chưa xong cho đến khi bạn xem nó diệt một server cũ, thấy cái mới khởi động trên cùng cổng, và xác nhận số đếm cổng đi 1 → 0 → 1. Nếu bước giữa là 1 → 1 → 1, cú diệt không có tác dụng.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi mã thoát là sự thật.</strong> <code>pkill -f "next start"</code> trả số không có nghĩa <em>ít nhất một tiến trình được khớp và gửi tín hiệu</em>, không phải <em>tiến trình tôi muốn đã biến mất</em>. Hậu-điều-kiện đúng là <code>lsof -ti:PORT</code> không in gì. Một phép kiểm không kiểm hậu-điều-kiện của mình không phải một phép kiểm — cùng luật như smoke test ở bài 10.3.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tên của một tiến trình là một nhãn tiến trình có thể ghi đè, nên một script diệt đối chiếu theo tên sẽ âm thầm trượt một tiến trình đã tự đổi tên mình — hãy diệt theo BẤT BIẾN của thứ bạn THẬT SỰ muốn giải phóng, với daemon mạng ấy là <em>cổng</em>, và xác nhận với <code>lsof</code> rằng cổng đã rảnh trước khi khởi kẻ thay thế.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố Playground 30/07/2026</span><span class="lc-sub">bản gốc: hai phiên chẩn đoán hỏng, và ghi chú cụ thể rằng <code>pkill -f "next start"</code> và <code>pkill -f "standalone/server.js"</code> đều âm thầm trượt vì Node đổi tên tiến trình thành <code>next-server</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js docs — process.title và cách nó ghi đè argv</span><span class="lc-sub">nodejs.org/api/process.html#processtitle — cơ chế đằng sau cú đổi tên: Node ghi đè bộ nhớ mà <code>ps</code> đọc, nên <code>pkill -f</code>, <code>ps</code>, <code>htop</code> đều thấy tên mới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Next.js docs — thư mục public</span><span class="lc-sub">nextjs.org/docs/app/building-your-application/optimizing/static-assets — câu về thư mục được phục vụ từ đĩa CHÔN cái ghi chú rằng danh sách file cố định lúc khởi động; phải đọc mã nguồn mới thấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">lsof — chính xác các cờ dùng ở đây</span><span class="lc-sub">man7.org/linux/man-pages/man8/lsof.8.html — <code>-t</code> cho đầu ra gọn (chỉ PID), <code>-i:PORT</code> lọc theo tiến trình gắn cổng. Cùng nhau chúng là một trong những thành ngữ shell ngắn nhất mà có ích.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tín hiệu và vòng đời tiến trình</span><span class="lc-sub">/courses/linux-bash/learn${REF} — SIGTERM đối lập SIGKILL, tiến trình mồ côi, vì sao <code>init</code> thừa hưởng chúng, và khi nào <code>-9</code> là lựa chọn đầu tiên đúng thay vì cuối cùng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — bất biến của ảnh như một chiến lược khởi động lại</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao <em>thay container</em> thắng <em>khởi động lại tiến trình</em>, và vì sao prod không có lỗi mà bài này dạy bạn sống sót ở dev.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — The migration that half-applied, and the resolve you must not run|||10.5 — Cú migration nửa vời, và câu resolve bạn KHÔNG được chạy',
      slug: 'ga-10-5-migration',
      type: 'VIDEO',
      description: 'Sự cố 2026-06-29: `P3009` chặn deploy nhiều ngày sau một migration nửa-áp-dụng. CLAUDE.md chép nguyên "Migration Failure Protocol" thành sáu bước, và bước 1 là "DỪNG. Đừng tự vá." Bài này dạy vì sao `prisma migrate resolve --rolled-back` là con dao chín-lưỡi, và cái quy trình sáu-bước là cái thay thế duy nhất còn có ý nghĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>The migration that half-applied, and the resolve you must not run</h2>
<p class="lead">CLAUDE.md dedicates a whole section to migration failures. Its first sentence is <em>STOP. Do not attempt to auto-fix.</em> This lesson exists because that sentence is not obvious — the auto-fix commands are one line each, and Prisma's error message practically hands them to you. The reason not to run them is the shape of a partially-applied migration, which you must understand before <code>prisma migrate resolve</code> becomes safe.</p>

<h3>The class of failure</h3>
<div class="out">DATE:   29/06/2026
MIGRATION:  20260629_add_note_subject_share
STATUS:     failed
STEP 1 (CREATE TABLE):  OK
STEP 2 (CREATE UNIQUE): OK
STEP 3 (ALTER TABLE):   ERROR — column already exists
STEP 4 (CREATE INDEX):  not run
STEP 5 (INSERT):        not run
BEHAVIOUR:  every subsequent deploy exits with P3009
</div>

<p>Read this carefully. Three of five statements ran. Two did not. The database now contains a table and a unique constraint that migration history says do not exist yet, and does not contain the index or seed data that migration history says have been applied since. This is <strong>schema drift</strong>, and it is the state Prisma refuses to migrate on top of. <code>P3009</code> is not a bug — it is Prisma refusing to make things worse.</p>

<h3>What the two <code>resolve</code> flags actually do</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>--rolled-back</code></span><span class="lz-nsub">tells Prisma to <em>pretend the migration never ran</em>. The migration file becomes eligible to apply again from step 1.</span></span>
<span class="lz-nbody">Only correct when the database is in the state it was BEFORE step 1. If steps 1-2 ran, running the migration again will try to <code>CREATE TABLE</code> a table that already exists and fail on step 1 the second time. You will have created a shorter loop of the same P3009.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>--applied</code></span><span class="lz-nsub">tells Prisma to <em>pretend the migration ran successfully</em>. Prisma will apply the NEXT migration on top and the failed one becomes history.</span></span>
<span class="lz-nbody">Only correct when the database is in the state it would be AFTER all steps of the migration ran. If steps 3-5 did not run, marking it applied means the schema now diverges from the code in ways later migrations will crash against — and worse, subtly, in ways your queries will crash against for missing columns.</span>
</div>
</div>

<p>Both flags are correct in <em>exactly one</em> state each, and the failure mode in-between (some steps ran, some did not) satisfies <em>neither</em>. The auto-fix that fits the error message is the one that guarantees the wrong outcome. CLAUDE.md's rule — stop, do not resolve — reduces to <em>you do not yet know which state the database is in, so you cannot pick a flag</em>.</p>

<h3>The measurement you need before you can decide</h3>
<p>The tool that answers the question is <code>prisma migrate diff</code>, and it is the one command CLAUDE.md recommends before doing anything else:</p>

<pre><code class="language-bash">$ npx prisma migrate diff \\
    --from-migrations ./prisma/migrations \\
    --to-database-url "$DATABASE_URL" \\
    --script
</code></pre>

<p>This computes the SQL that would take the database <em>from where migrations think it is</em> <em>to where it actually is</em>. An empty output means no drift — the failed migration did not run any statements, so <code>--rolled-back</code> is safe. A non-empty output means drift — some statements ran, and the diff prints exactly which. Neither flag is safe until you have <em>read</em> that diff.</p>

<div class="out">$ npx prisma migrate diff --from-migrations ./prisma/migrations \\
    --to-database-url "$DATABASE_URL" --script
-- CreateTable
CREATE TABLE "NoteSubjectShare" (
    "id" SERIAL NOT NULL,
    ...
);

-- CreateIndex
CREATE UNIQUE INDEX "NoteSubjectShare_slug_key" ON "NoteSubjectShare"("slug");

Result: 2 statements
</div>

<p>Two statements. Steps 1 and 2 of the failed migration ran; steps 3-5 did not. Now the decision is data-driven: mark it <code>--rolled-back</code> AND manually drop the table and index (returning to the pre-migration state), or mark it <code>--applied</code> AND manually run steps 3-5 (returning to the post-migration state). Either is defensible; the wrong one is picking without measuring.</p>

<h3>Why <code>P3006</code> forced this repository into a specific pattern</h3>
<p>CLAUDE.md also documents a second failure mode: migration <code>20260706130000_add_music_and_profile</code> declares a UNIQUE constraint named <code>post_music_post_id_key</code> and later declares a plain index with the same name. Prisma's shadow database rejects this as invalid — the same name cannot be both — and therefore <code>prisma migrate dev</code> will not run for any new migration in this repo, because it uses the shadow database to validate. The migration IS deployed in production, so per the "never edit deployed migrations" rule it cannot be rewritten.</p>

<p>The workaround CLAUDE.md codifies is worth reading as a specific case of the general principle: when a tool cannot run, replace the tool with the primitive it is built on. New migrations in this repository are written by hand as SQL files under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code>, then applied with <code>npx prisma migrate deploy</code> (which does not use the shadow database and therefore does not care about the broken historic migration). The verification step is another <code>prisma migrate diff</code>, this time run from schema to schema:</p>

<pre><code class="language-bash">$ npx prisma migrate diff \\
    --from-schema-datasource prisma/schema.prisma \\
    --to-schema-datamodel prisma/schema.prisma \\
    --script
</code></pre>

<div class="out"># Empty output = the schema.prisma model matches what migrations will produce.
</div>

<p>Empty means no drift between what the model file declares and what migrations would create. Non-empty means the hand-written SQL you just added does not fully realise the model. The workflow is: edit <code>schema.prisma</code>, write the SQL by hand, run diff, iterate until diff is empty, then <code>migrate deploy</code>.</p>

<h3>The six-step protocol, in exact order</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">STOP</span><span class="lz-d">Do not run <code>prisma migrate resolve</code>. Do not rewrite the failed migration with <code>CREATE TABLE IF NOT EXISTS</code> and re-deploy. Both are silent-corruption paths.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">read the exact error</span><span class="lz-d">Grab the migration name and the error message verbatim. This information is often summarised in CI output; the full log has the SQL statement that failed and the database's response — that identifies which step of the migration was live when it failed.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">enumerate what ran</span><span class="lz-d">Open the migration's <code>.sql</code> file. Number the statements. Cross-reference with the failing statement (step 2) — everything before that number ran, everything at and after did not.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">measure the drift</span><span class="lz-d">Run <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. This tells you the exact SQL delta between what history says and what the database is.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">report</span><span class="lz-d">Take the results of steps 2, 3, 4 to whoever owns the database. Do not decide alone — a migration failure on production is a shared-state event by definition. Propose a fix based on the diff; do not run it yet.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">execute with an approver</span><span class="lz-d">Once the fix is approved, run it against a staging replica if one exists, verify the resulting <code>prisma migrate status</code> is clean, then apply to production. Follow with a fresh <code>migrate diff</code> — a clean run should print nothing.</span></div>
</div>

<h3>Why this is a CI concern, not a migration concern</h3>
<p>The reason a migration failure is <em>an Actions lesson</em> and not just a Prisma lesson: the automation that runs <code>prisma migrate deploy</code> as a workflow step will, by default, re-run it on every subsequent deploy. That is how <code>P3009</code> becomes a persistent block — each new commit tries to deploy, hits the same failure, and stops. The fix belongs in the workflow, too: fail loudly on migrate failure with an exit code and a clear message, and do not gate any subsequent step behind a "retry migration" that could paper over the state:</p>

<pre><code class="language-yaml">- name: Prisma migrate
  run: npx prisma migrate deploy
  # NEVER: continue-on-error: true
  # NEVER: || npx prisma migrate resolve --rolled-back &lt;name&gt;

- name: Halt if migrate failed
  if: failure()
  run: |
    echo "::error::Migration failed. Do NOT auto-resolve. Read CLAUDE.md &sect; Migration Failure Protocol."
    exit 1
</code></pre>

<p>The <code>::error::</code> annotation makes the failure appear at the top of the Actions summary page in red, so nobody scrolls past it. The <code>if: failure()</code> guard runs the message only when needed. The absence of <code>continue-on-error</code> is deliberate — the whole point of the halt is that the next deploy also halts, on the same state, until a human runs the six-step protocol.</p>

<h3>The class of fix that looks helpful and is not</h3>
<div class="pitfall">
<p><strong>Trap — rewriting the failed migration with <code>CREATE TABLE IF NOT EXISTS</code> so the deploy goes through.</strong> This is the auto-fix that reads like common sense: "the table already exists, so make the statement idempotent." It appears to work — the deploy completes, CI goes green, everyone moves on. The corruption is subtle: the <em>original</em> migration file, edited to be idempotent, is now different in git history from the SQL that Prisma has already stamped as applied on other environments. Any environment restored from backup, or set up fresh, will apply the <em>new</em> file and produce a DIFFERENT schema than the one prod has. You have introduced an environment-dependent schema without noticing.</p>
</div>

<div class="callout warn">
<p><strong>The other tempting fix.</strong> <code>prisma migrate reset</code> makes the failure disappear by dropping the database and re-applying every migration. This works. On a laptop. In production it means <em>losing all data</em>. CLAUDE.md lists it in the top block of the file — the "NEVER DO — Forbidden Actions" — for exactly this reason: an automation that panic-runs <code>reset</code> when <code>P3009</code> shows up will empty the database in the middle of an outage. If you have never accidentally learned this rule, you are in the shrinking minority.</p>
</div>

<h3>The one-sentence closing</h3>
<div class="callout">
<p><strong>One sentence.</strong> A failed migration is a <em>state</em> question, not a <em>command</em> question — <code>prisma migrate resolve</code> and <code>prisma migrate reset</code> both answer the command question in one line and both are wrong in every state a partially-applied migration can be in, so the answer is always the six-step protocol: STOP, read the error, list what ran, run <code>prisma migrate diff</code>, report to a human, execute the fix under approval.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — Migration Failure Protocol</span><span class="lc-sub">the six-step protocol codified in this repository, and the note that auto-resolving is a silent-corruption path. This lesson is a reading of that section.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — resolving failed migrations in a non-development environment</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — the official page on <code>migrate resolve</code>. Read it and notice how carefully it hedges around <em>when</em> to use each flag.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — <code>migrate diff</code></span><span class="lc-sub">prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff — the tool that turns "the database is in some state" into a concrete SQL delta you can read.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — schema drift and shadow databases</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — why <code>migrate dev</code> uses a shadow database, why the P3006 bug in this repo makes it unusable, and how the hand-written-SQL workaround preserves the audit trail.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactional DDL, and the one statement that breaks it</span><span class="lc-sub">/courses/postgresql/learn${REF} — most PostgreSQL DDL is transactional, so most migration failures roll back cleanly and P3009 never happens; the one exception (<code>CREATE INDEX CONCURRENTLY</code>) is the one that produces the partial state this lesson deals with.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Cú migration nửa vời, và câu resolve bạn KHÔNG được chạy</h2>
<p class="lead">CLAUDE.md dành hẳn một mục cho lỗi migration. Câu đầu tiên của nó là <em>DỪNG. Đừng tự vá.</em> Bài này tồn tại vì câu ấy KHÔNG hiển nhiên — các lệnh tự-vá đều một dòng, và thông báo lỗi của Prisma gần như đưa tận tay bạn. Lý do KHÔNG chạy chúng là hình dạng của một migration nửa-áp-dụng, mà bạn phải hiểu TRƯỚC khi <code>prisma migrate resolve</code> trở nên an toàn.</p>

<h3>Kiểu hỏng</h3>
<div class="out">DATE:   29/06/2026
MIGRATION:  20260629_add_note_subject_share
STATUS:     failed
STEP 1 (CREATE TABLE):  OK
STEP 2 (CREATE UNIQUE): OK
STEP 3 (ALTER TABLE):   ERROR — column already exists
STEP 4 (CREATE INDEX):  not run
STEP 5 (INSERT):        not run
BEHAVIOUR:  every subsequent deploy exits with P3009
</div>

<p>Đọc cho kỹ. Ba trên năm câu lệnh đã chạy. Hai chưa. Cơ sở dữ liệu giờ chứa một bảng và một ràng buộc UNIQUE mà lịch sử migration bảo là CHƯA tồn tại, và KHÔNG chứa cái index hay dữ liệu seed mà lịch sử migration bảo là đã áp dụng sau đó. Đây là <strong>schema drift</strong> (lệch schema), và là trạng thái mà Prisma từ chối migrate chồng lên. <code>P3009</code> không phải một lỗi — nó là Prisma từ chối làm mọi thứ tệ hơn.</p>

<h3>Hai cờ <code>resolve</code> THẬT SỰ làm gì</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>--rolled-back</code></span><span class="lz-nsub">bảo Prisma <em>giả vờ migration chưa hề chạy</em>. File migration lại đủ điều kiện áp dụng lại từ bước 1.</span></span>
<span class="lz-nbody">Chỉ đúng khi cơ sở dữ liệu đang ở trạng thái TRƯỚC bước 1. Nếu bước 1-2 đã chạy, chạy lại migration sẽ thử <code>CREATE TABLE</code> một bảng đã tồn tại và hỏng ngay ở bước 1 lần thứ hai. Bạn vừa tạo ra một vòng lặp ngắn hơn của cùng cái P3009.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>--applied</code></span><span class="lz-nsub">bảo Prisma <em>giả vờ migration đã chạy thành công</em>. Prisma sẽ áp dụng migration KẾ TIẾP lên trên và cái hỏng biến thành lịch sử.</span></span>
<span class="lz-nbody">Chỉ đúng khi cơ sở dữ liệu đang ở trạng thái mà mọi bước của migration đã chạy. Nếu bước 3-5 chưa chạy, đánh dấu là đã áp dụng có nghĩa schema giờ khác mã theo cách các migration về sau sẽ đâm vào — và tệ hơn, âm ỉ, theo cách các truy vấn của bạn sẽ đâm vào vì cột thiếu.</span>
</div>
</div>

<p>Cả hai cờ đúng ở <em>đúng một</em> trạng thái mỗi cờ, và kiểu hỏng ở giữa (một số bước chạy, một số không) KHÔNG thoả <em>cái nào</em>. Cú tự-vá khớp với thông báo lỗi là cú đảm bảo kết quả sai. Luật của CLAUDE.md — DỪNG, không resolve — rút gọn thành <em>bạn CHƯA biết cơ sở dữ liệu đang ở trạng thái nào, nên không chọn được cờ</em>.</p>

<h3>Số đo bạn cần TRƯỚC khi quyết định</h3>
<p>Công cụ trả lời câu hỏi là <code>prisma migrate diff</code>, và là lệnh duy nhất CLAUDE.md đề nghị TRƯỚC khi làm bất cứ gì khác:</p>

<pre><code class="language-bash">$ npx prisma migrate diff \\
    --from-migrations ./prisma/migrations \\
    --to-database-url "$DATABASE_URL" \\
    --script
</code></pre>

<p>Nó tính SQL sẽ đưa cơ sở dữ liệu <em>từ nơi lịch sử migration nghĩ nó ở</em> tới <em>nơi nó THẬT SỰ ở</em>. Đầu ra rỗng nghĩa là không lệch — migration hỏng không chạy câu lệnh nào, nên <code>--rolled-back</code> an toàn. Đầu ra không rỗng nghĩa là có lệch — vài câu lệnh đã chạy, và diff in chính xác câu nào. KHÔNG cờ nào an toàn cho đến khi bạn ĐỌC cái diff đó.</p>

<div class="out">$ npx prisma migrate diff --from-migrations ./prisma/migrations \\
    --to-database-url "$DATABASE_URL" --script
-- CreateTable
CREATE TABLE "NoteSubjectShare" (
    "id" SERIAL NOT NULL,
    ...
);

-- CreateIndex
CREATE UNIQUE INDEX "NoteSubjectShare_slug_key" ON "NoteSubjectShare"("slug");

Ket qua: 2 cau lenh
</div>

<p>Hai câu lệnh. Bước 1 và 2 của migration hỏng đã chạy; bước 3-5 chưa. Bây giờ quyết định có dữ liệu: đánh dấu <code>--rolled-back</code> VÀ bằng tay <code>DROP</code> bảng và index (đưa về trạng thái trước migration), hoặc đánh dấu <code>--applied</code> VÀ bằng tay chạy bước 3-5 (đưa về trạng thái sau migration). Cả hai đều biện hộ được; cái SAI là chọn KHÔNG ĐO.</p>

<h3>Vì sao <code>P3006</code> ép kho này vào một khuôn cụ thể</h3>
<p>CLAUDE.md cũng ghi một kiểu hỏng thứ hai: migration <code>20260706130000_add_music_and_profile</code> khai báo một UNIQUE tên <code>post_music_post_id_key</code> và sau đó khai một index thường CÙNG TÊN. Cơ sở dữ liệu ẩn (shadow) của Prisma từ chối cái này vì không hợp lệ — cùng tên không thể vừa là hai thứ — và do đó <code>prisma migrate dev</code> KHÔNG chạy được cho bất kỳ migration mới nào trong kho này, vì nó dùng shadow database để xác thực. Migration ĐÃ được triển khai ở production, nên theo luật "không sửa migration đã deploy" thì không thể viết lại.</p>

<p>Cú lách CLAUDE.md hệ thống hoá đáng đọc như một trường hợp cụ thể của nguyên lý chung: khi một công cụ không chạy được, hãy thay công cụ bằng nguyên tố nó được dựng trên. Migration mới trong kho này được viết TAY như file SQL dưới <code>prisma/migrations/&lt;dấu-thời-gian&gt;_&lt;tên&gt;/migration.sql</code>, rồi áp dụng với <code>npx prisma migrate deploy</code> (không dùng shadow database và do đó không quan tâm tới migration lịch sử hỏng). Bước xác nhận là một cú <code>prisma migrate diff</code> khác, lần này chạy từ schema tới schema:</p>

<pre><code class="language-bash">$ npx prisma migrate diff \\
    --from-schema-datasource prisma/schema.prisma \\
    --to-schema-datamodel prisma/schema.prisma \\
    --script
</code></pre>

<div class="out"># Dau ra rong = model schema.prisma khop cai migration se san sinh.
</div>

<p>Rỗng nghĩa là không lệch giữa cái file model khai và cái migration sẽ tạo. Không rỗng nghĩa là SQL viết-tay bạn vừa thêm chưa hiện thực hoá đầy đủ cái model. Quy trình là: sửa <code>schema.prisma</code>, viết SQL bằng tay, chạy diff, lặp cho đến khi diff rỗng, rồi <code>migrate deploy</code>.</p>

<h3>Sáu bước, theo ĐÚNG thứ tự</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">DỪNG</span><span class="lz-d">Đừng chạy <code>prisma migrate resolve</code>. Đừng viết lại migration hỏng với <code>CREATE TABLE IF NOT EXISTS</code> rồi deploy lại. Cả hai đều là đường hỏng-âm-thầm.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đọc lỗi CHÍNH XÁC</span><span class="lz-d">Chép tên migration và thông báo lỗi nguyên văn. Thông tin này thường được tóm lược trong đầu ra CI; log đầy đủ có câu lệnh SQL đã hỏng và phản hồi của database — cái ấy chỉ ra bước nào của migration còn sống lúc nó hỏng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">liệt kê cái ĐÃ chạy</span><span class="lz-d">Mở file <code>.sql</code> của migration. Đánh số các câu lệnh. Đối chiếu với câu lệnh hỏng (bước 2) — mọi thứ trước số ấy đã chạy, mọi thứ tại và sau đó chưa.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đo cái lệch</span><span class="lz-d">Chạy <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. Nó nói cho bạn biết chính xác delta SQL giữa cái lịch sử nói và cái database THẬT SỰ.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">báo cáo</span><span class="lz-d">Cầm kết quả bước 2, 3, 4 tới người sở hữu database. ĐỪNG quyết định một mình — một cú hỏng migration ở production là sự kiện trạng-thái-chung theo định nghĩa. Đề nghị cách vá dựa trên diff; chưa chạy nó.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">chạy dưới sự phê duyệt</span><span class="lz-d">Một khi cách vá được duyệt, chạy nó lên một bản sao staging nếu có, xác nhận <code>prisma migrate status</code> kết quả sạch, rồi áp dụng vào production. Theo sau bằng một cú <code>migrate diff</code> mới — một lần chạy sạch sẽ in không có gì.</span></div>
</div>

<h3>Vì sao đây là chuyện CỦA CI, không phải chuyện của migration</h3>
<p>Lý do một cú hỏng migration là <em>bài học Actions</em>, không chỉ là bài học Prisma: tự động hoá chạy <code>prisma migrate deploy</code> như một bước workflow, MẶC ĐỊNH, sẽ chạy lại nó ở mọi cuộc deploy sau. Đó là cách <code>P3009</code> trở thành chặn kéo dài — mỗi commit mới thử deploy, đâm vào cùng cái hỏng, và dừng. Cú vá thuộc về workflow, luôn: hỏng TO khi migrate hỏng với mã thoát và thông báo rõ, và ĐỪNG gate bất kỳ bước sau nào đằng sau một cú "thử lại migration" có thể che trạng thái:</p>

<pre><code class="language-yaml">- name: Prisma migrate
  run: npx prisma migrate deploy
  # KHONG BAO GIO: continue-on-error: true
  # KHONG BAO GIO: || npx prisma migrate resolve --rolled-back &lt;name&gt;

- name: Halt if migrate failed
  if: failure()
  run: |
    echo "::error::Migration failed. Do NOT auto-resolve. Read CLAUDE.md &sect; Migration Failure Protocol."
    exit 1
</code></pre>

<p>Ghi chú <code>::error::</code> làm cú hỏng xuất hiện ở đầu trang tóm tắt Actions bằng màu đỏ, nên không ai cuộn qua nó. Guard <code>if: failure()</code> chỉ chạy thông báo khi cần. Vắng mặt <code>continue-on-error</code> là cố ý — mục đích của cú halt là cuộc deploy KẾ TIẾP cũng dừng, ở cùng trạng thái, cho đến khi một con người chạy sáu-bước.</p>

<h3>Lớp cách-vá trông có ích và KHÔNG</h3>
<div class="pitfall">
<p><strong>Bẫy — viết lại migration hỏng với <code>CREATE TABLE IF NOT EXISTS</code> để deploy qua được.</strong> Đây là cú tự-vá đọc như lẽ thường: "bảng đã tồn tại, nên làm câu lệnh trở nên idempotent." Nó trông có tác dụng — deploy hoàn thành, CI xanh, mọi người bỏ qua. Cú hỏng âm ỉ: file migration <em>gốc</em>, được sửa thành idempotent, giờ khác trong lịch sử git với SQL mà Prisma đã dán nhãn là đã áp dụng ở các môi trường khác. Bất kỳ môi trường nào phục hồi từ backup, hay được dựng mới, sẽ áp dụng file <em>mới</em> và sản sinh MỘT schema KHÁC cái prod có. Bạn đã đưa vào một schema phụ thuộc-môi-trường mà không nhận ra.</p>
</div>

<div class="callout warn">
<p><strong>Cú vá cám dỗ khác.</strong> <code>prisma migrate reset</code> làm cú hỏng biến mất bằng cách xoá database và áp dụng lại mọi migration. Nó chạy được. Trên laptop. Ở production nó có nghĩa <em>mất TẤT CẢ dữ liệu</em>. CLAUDE.md liệt kê nó ở khối đầu file — "NEVER DO — Forbidden Actions" — vì chính lý do này: một tự động hoá hoảng-chạy <code>reset</code> khi <code>P3009</code> hiện lên sẽ dọn sạch database giữa cuộc sự cố. Nếu bạn chưa từng vô tình học được luật này, bạn thuộc thiểu số đang teo lại.</p>
</div>

<h3>Đóng bằng một câu</h3>
<div class="callout">
<p><strong>Một câu.</strong> Một cú hỏng migration là câu hỏi về <em>trạng thái</em>, không phải câu hỏi về <em>lệnh</em> — <code>prisma migrate resolve</code> và <code>prisma migrate reset</code> đều trả lời câu hỏi về lệnh trong một dòng và đều SAI ở mọi trạng thái mà một migration nửa-áp-dụng có thể ở trong, nên câu trả lời LUÔN LÀ sáu-bước: DỪNG, đọc lỗi, liệt kê cái đã chạy, chạy <code>prisma migrate diff</code>, báo cáo cho một con người, chạy cú vá dưới sự phê duyệt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — Migration Failure Protocol</span><span class="lc-sub">quy trình sáu-bước được hệ thống hoá trong kho này, và ghi chú rằng tự-resolve là đường hỏng-âm-thầm. Bài này là một cú đọc mục ấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — resolving failed migrations trong môi trường non-development</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — trang chính thức về <code>migrate resolve</code>. Đọc và để ý cách nó cẩn thận rào quanh câu hỏi <em>khi nào</em> dùng cờ nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — <code>migrate diff</code></span><span class="lc-sub">prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff — công cụ biến "database đang ở trạng thái nào đó" thành một delta SQL cụ thể có thể đọc.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — schema drift và shadow databases</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — vì sao <code>migrate dev</code> dùng shadow database, vì sao lỗi P3006 trong kho này làm nó không dùng được, và cách lách bằng SQL viết-tay giữ được dấu vết kiểm toán.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — DDL giao dịch, và câu lệnh phá vỡ nó</span><span class="lc-sub">/courses/postgresql/learn${REF} — hầu hết DDL của PostgreSQL là giao dịch, nên hầu hết cú hỏng migration rollback sạch và P3009 không bao giờ xảy ra; ngoại lệ duy nhất (<code>CREATE INDEX CONCURRENTLY</code>) là cái sản sinh trạng thái nửa vời mà bài này giải quyết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
      slug: 'ga-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về sáu ca chẩn đoán CÓ NGÀY: 404 vs 401, seed vỡ dù qua checklist, smoke test không kiểm được, diệt tiến trình bằng tên trượt, và migration nửa-vời không được auto-resolve.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>What Chapter 10 measured</h2>
<p class="lead">Eight questions, twelve minutes. Each incident in this chapter has a date; each rule survives because the corresponding auto-fix has been tried and burned someone. The answers are drawn from CLAUDE.md's dated notes and from the measurements in this chapter's lessons.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — stale build</span><span class="lz-lnote">2026-07-02: <code>curl -sI</code> without auth separated a 404 (route not mounted, stale image) from a 401 (mounted, needs auth) — one command replaced a whole hypothesis</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — seed vỡ</span><span class="lz-lnote">2026-08-08: enum rename passed the entire pre-push checklist and broke seed on prod because <code>seed.ts</code> declared its own union of the enum and type-checked against itself</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — smoke test</span><span class="lz-lnote">2026-07-30: the smoke test in <code>deploy.sh</code> called <code>wget</code> inside a container that deliberately omits <code>wget</code>; the <code>|| sleep 5</code> guard swallowed every failure and 25s was wasted per deploy</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — kill by port</span><span class="lz-lnote">2026-07-30 Playground: <code>pkill -f "next start"</code> matched the launcher but not the actual server (Node renames its process to <code>next-server</code>); <code>lsof -ti:PORT | xargs -r kill -9</code> is the invariant</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — migration nửa vời</span><span class="lz-lnote">2026-06-29: three of five statements ran, P3009 blocked deploys, and both <code>--rolled-back</code> and <code>--applied</code> are wrong on the middle state — the fix is the six-step protocol, not a flag</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Chương 10 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mỗi sự cố trong chương này có một ngày; mỗi luật sống sót vì cú tự-vá tương ứng đã được ai đó thử và bỏng tay. Đáp án lấy từ ghi chú có ngày của CLAUDE.md và các số đo trong các bài của chương.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — bản dựng cũ</span><span class="lz-lnote">02/07/2026: <code>curl -sI</code> không xác thực tách 404 (route KHÔNG mount, ảnh cũ) khỏi 401 (mount, cần auth) — MỘT lệnh thay thế cả một giả thuyết</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — seed vỡ</span><span class="lz-lnote">08/08/2026: đổi tên enum qua sạch pre-push checklist và vỡ seed ở prod vì <code>seed.ts</code> khai union enum của chính nó và tự kiểm với chính nó</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — smoke test</span><span class="lz-lnote">30/07/2026: smoke test trong <code>deploy.sh</code> gọi <code>wget</code> bên trong container CỐ Ý bỏ <code>wget</code>; <code>|| sleep 5</code> nuốt mọi cú hỏng, 25s bị tiêu mỗi deploy</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — diệt theo cổng</span><span class="lz-lnote">30/07/2026 Playground: <code>pkill -f "next start"</code> khớp bộ khởi động nhưng KHÔNG server thật (Node đổi tên tiến trình thành <code>next-server</code>); <code>lsof -ti:PORT | xargs -r kill -9</code> là bất biến</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — migration nửa vời</span><span class="lz-lnote">29/06/2026: ba trên năm câu lệnh đã chạy, P3009 chặn deploy, và cả <code>--rolled-back</code> lẫn <code>--applied</code> đều SAI ở trạng thái giữa — cách vá là sáu-bước, không phải một cờ</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A route that was working yesterday now returns 404 in the browser. What curl output separates a stale build from an actual missing route?|||Một route hôm qua còn chạy giờ trả 404 trên trình duyệt. Đầu ra curl nào tách một bản-dựng-cũ khỏi một route THẬT SỰ THIẾU?',
            options: [
              'Unauthenticated curl returns 401 for a mounted route and 404 for a missing/stale one — one command, no login needed|||Curl không xác thực trả 401 cho route đã mount và 404 cho route thiếu/cũ — một lệnh, không cần đăng nhập',
              'Send a valid JWT and see whether the response body contains error details|||Gửi JWT hợp lệ và xem body có chi tiết lỗi không',
              'Compare response headers between staging and production for the same route|||So sánh header phản hồi giữa staging và production cho cùng route',
              'Enable verbose mode and inspect TLS handshake timings|||Bật verbose và xem thời gian bắt tay TLS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The 2026-08-08 seed break happened because seed.ts type-checked green and prod crashed. What was the root cause?|||Cú hỏng seed 08/08/2026 xảy ra vì seed.ts type-check xanh mà prod sập. Nguyên nhân gốc là gì?',
            options: [
              'seed.ts hand-wrote its own copy of the enum union so it validated against itself; tsc excluded prisma/** so no cross-check happened|||seed.ts tự viết bản copy của union enum nên nó xác thực với chính nó; tsc exclude prisma/** nên không có kiểm chéo',
              'Prisma generate was skipped in CI, so the client was stale|||Prisma generate bị bỏ qua trong CI, nên client cũ',
              'The enum rename was in a migration that failed to deploy|||Cú đổi tên enum ở trong một migration deploy hỏng',
              'The seed script was not marked as ESM and Node imported the wrong file|||Script seed không đánh dấu ESM và Node import nhầm file',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the ONE-LINE fix that would have caught the 2026-08-08 seed break BEFORE prod?|||Câu vá MỘT DÒNG nào lẽ ra đã bắt được cú hỏng seed 08/08/2026 TRƯỚC prod?',
            options: [
              'Add a typecheck script that reads prisma/** with a tsconfig whose types come from @prisma/client — and run prisma db seed as a dry run|||Thêm một script typecheck đọc prisma/** với một tsconfig lấy type từ @prisma/client — và chạy prisma db seed như một cú thử',
              'Delete seed.ts and rewrite it in JavaScript so no type-checking is needed|||Xoá seed.ts và viết lại bằng JavaScript để không cần type-check',
              'Add a database migration test that drops and recreates every enum|||Thêm test migration database drop và recreate mọi enum',
              'Enable strictNullChecks in the main tsconfig|||Bật strictNullChecks trong tsconfig chính',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The 2026-07-30 wget smoke test wasted ~25s per deploy without catching anything. What was the ROOT rule violated?|||Smoke test wget 30/07/2026 đốt ~25s mỗi deploy mà không bắt được gì. Luật GỐC nào bị vi phạm?',
            options: [
              'Never trust a checker without deliberately breaking the thing checked and confirming the check turns red|||Đừng bao giờ tin một phép kiểm mà chưa cố ý làm hỏng cái nó kiểm và thấy nó chuyển đỏ',
              'Never use wget in shell scripts; use curl instead|||Đừng bao giờ dùng wget trong shell script; dùng curl',
              'Never use || in shell scripts; use && instead|||Đừng bao giờ dùng || trong shell script; dùng &&',
              'Never smoke-test production; only staging|||Đừng bao giờ smoke-test production; chỉ staging',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'On the 2026-07-30 Playground incident, pkill -f "next start" returned exit code 0 but the server kept holding port 3000. Why?|||Trong sự cố Playground 30/07/2026, pkill -f "next start" trả mã thoát 0 nhưng server vẫn giữ cổng 3000. Vì sao?',
            options: [
              'Node rewrites its process argv to "next-server ..." — pkill -f matched the launcher (npm/node), not the actual server, and returning zero on a partial match hid it|||Node ghi đè argv thành "next-server ..." — pkill -f khớp bộ khởi động (npm/node), không phải server thật, và trả zero khi khớp một phần đã che nó',
              'The kill signal was blocked by a signal handler in next-server|||Tín hiệu kill bị chặn bởi signal handler trong next-server',
              'pkill -f returns 0 for every regex, regardless of matches|||pkill -f trả 0 cho mọi regex, bất kể có khớp không',
              'The Node process was in an uninterruptible sleep state|||Tiến trình Node đang ở trạng thái sleep không ngắt được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the invariant-based way to kill a listening daemon that always works, and why does it beat kill-by-name?|||Cách diệt daemon nghe cổng dựa trên bất biến LUÔN chạy được là gì, và vì sao nó thắng diệt-theo-tên?',
            options: [
              'lsof -ti:PORT | xargs -r kill -9 — a port is an invariant the process cannot rewrite, unlike its own name|||lsof -ti:PORT | xargs -r kill -9 — cổng là bất biến tiến trình không thể ghi đè, không như tên của chính nó',
              'systemctl restart <service> — systemd tracks the PID authoritatively|||systemctl restart <service> — systemd theo dõi PID có thẩm quyền',
              'kill -TERM $(pgrep node) — TERM is safer than KILL|||kill -TERM $(pgrep node) — TERM an toàn hơn KILL',
              'ps -e | grep <name> | awk "{print $1}" | xargs kill — piped grep is precise|||ps -e | grep <name> | awk "{print $1}" | xargs kill — grep qua pipe chính xác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A migration failed on production halfway through (3 of 5 statements ran). Which prisma migrate resolve flag is safe to apply?|||Một migration hỏng trên prod ở giữa (3 trên 5 câu lệnh đã chạy). Cờ prisma migrate resolve nào an toàn?',
            options: [
              'NEITHER — --rolled-back is correct only for the pre-state and --applied only for the post-state; the middle state satisfies neither, so measure with prisma migrate diff first|||KHÔNG cờ nào — --rolled-back đúng chỉ cho trạng thái trước và --applied chỉ cho trạng thái sau; trạng thái giữa không thoả cái nào, nên đo bằng prisma migrate diff trước',
              '--rolled-back always, because it lets you retry the migration cleanly|||--rolled-back luôn, vì nó cho bạn thử lại migration sạch',
              '--applied always, because it unblocks CI immediately|||--applied luôn, vì nó gỡ chặn CI ngay lập tức',
              'Neither works; the only fix is prisma migrate reset|||Không cờ nào chạy được; cú vá duy nhất là prisma migrate reset',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is running <code>prisma migrate reset</code> to unblock a failed production migration listed as a FORBIDDEN action in CLAUDE.md?|||Vì sao chạy <code>prisma migrate reset</code> để gỡ chặn một migration hỏng ở production được liệt kê là hành động CẤM trong CLAUDE.md?',
            options: [
              'It drops the database and re-applies every migration — on a laptop it works; on production it deletes all user data|||Nó xoá database và áp dụng lại mọi migration — trên laptop nó chạy được; trên production nó xoá TẤT CẢ dữ liệu người dùng',
              'It only works on PostgreSQL, not on other engines|||Nó chỉ chạy trên PostgreSQL, không trên engine khác',
              'It takes 40+ minutes on a large database and blocks deploys during that time|||Nó tốn 40+ phút trên database lớn và chặn deploy trong thời gian đó',
              'It rewrites the migration history in git and creates merge conflicts|||Nó viết lại lịch sử migration trong git và tạo xung đột merge',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
