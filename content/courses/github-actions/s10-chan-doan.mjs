import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 10: Chẩn đoán bằng ca thật.
 * Năm sự cố có ngày của api-backend (CLAUDE.md + git log + gh run view, chỉ đọc), mỗi ca dựng lại
 * thu nhỏ trên sân tập ga-san-tap nhánh ch10-chan-doan (24/09/2026). Deck: scripts/slides-src/ga-10.mjs.
 */

export default {
  title: 'Chapter 10 — Diagnosing by real cases|||Chương 10 — Chẩn đoán bằng ca thật',
  slug: 'ga-ch10-chan-doan',
  description: 'Năm sự cố có ngày tháng của chính kho này (CLAUDE.md, git log, gh run view), mỗi ca dựng lại thu nhỏ trên sân tập và ghi theo cùng một hồ sơ: triệu chứng, chẩn đoán sai đầu tiên, chẩn đoán đúng, cách vá, phép kiểm chặn tái diễn — bản dựng cũ, seed vỡ, bộ kiểm không biết đỏ, diệt server không chết, và migration P3018/P3009.',
  sortOrder: 11,
  lessons: [

    /* ─────────────────────────── 10.0 ─────────────────────────── */
    {
      title: '10.0 — Chapter 10 slides: five real incidents in pictures|||10.0 — Slide Chương 10: năm sự cố thật bằng hình',
      slug: 'ga-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 10: năm hồ sơ sự cố của chính kho này, mỗi ca kèm log dựng lại trên sân tập — bản dựng cũ 404, seed vỡ, bộ kiểm không biết đỏ, diệt server theo cổng, và migration P3018/P3009 — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Five real incidents from this repository, each filed in the same five-part record — symptom, first wrong diagnosis, right diagnosis, fix, and the check that stops it coming back — and each rebuilt small enough to run on a public runner: a stale image that is healthy and still returns 404, a seed that tsc never opened, a frontend check that stayed green for seven weeks whatever the frontend did, a Next.js server that survives <code>pkill</code>, and a Prisma migration that two workflows fought over.</p>
<p>Slides 3–4 open the chapter, 5–8 belong to Lesson 10.1, 9–13 to 10.2, 14–17 to 10.3, 18–22 to 10.4 and 23–29 to 10.5. The last three are the chapter&#39;s common mistakes, a cheat sheet and a practice session. Dates, commits and api-backend run numbers come from the repository&#39;s own history (read-only). Every other log was produced on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code> runners in the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch10-chan-doan" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap, branch ch10-chan-doan</a>. Several of those measurements contradicted the previous version of the lessons — the lessons say where.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Năm sự cố THẬT của chính kho này, mỗi ca ghi vào cùng một hồ sơ năm phần — triệu chứng, chẩn đoán sai đầu tiên, chẩn đoán đúng, cách vá, và phép kiểm chặn tái diễn — và mỗi ca được dựng lại đủ nhỏ để chạy trên một runner công khai: một image cũ vẫn healthy mà vẫn trả 404, một cái seed mà tsc chưa từng mở, một chốt kiểm frontend xanh suốt bảy tuần bất kể frontend ra sao, một server Next.js sống sót qua <code>pkill</code>, và một migration Prisma bị hai workflow tranh nhau.</p>
<p>Slide 3–4 mở chương, 5–8 thuộc Bài 10.1, 9–13 thuộc 10.2, 14–17 thuộc 10.3, 18–22 thuộc 10.4 và 23–29 thuộc 10.5. Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và buổi thực hành của chương. Ngày tháng, commit và số run của api-backend lấy từ lịch sử của chính kho (chỉ đọc). Mọi log còn lại được tạo ngày 24/09/2026 trên runner <code>ubuntu-24.04</code> của GitHub, trong sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch10-chan-doan" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap, nhánh ch10-chan-doan</a>. Vài phép đo trong số đó nói ngược với bản cũ của các bài — các bài đã ghi rõ chỗ nào.</p>
</div>
${gallery('ga-10', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Năm sự cố trong 60 ngày'], [4, 'Khuôn năm câu hỏi'],
  [5, 'Hồ sơ 10.1'], [6, '401 và 404 trên production'], [7, 'Tái lập deploy --no-build'], [8, 'Healthcheck và smoke-test'],
  [9, 'Hồ sơ 10.2'], [10, 'tsc chưa từng mở seed.ts'], [11, 'TS6059 và tsconfig.seed.json thật'], [12, 'Seed in ✗ mà thoát 0'],
  [13, 'Ba lớp vá'], [14, 'Hồ sơ 10.3'], [15, 'Vòng thử cạn trong im lặng'], [16, 'Kiểm bộ kiểm 4 × 3'],
  [17, 'Danh sách đen và danh sách trắng'], [18, 'Hồ sơ 10.4'], [19, 'Tệp có trên đĩa mà 404'], [20, 'next-server tự đổi tên'],
  [21, 'lsof mù trên runner'], [22, 'Khởi động lại có hậu điều kiện'], [23, 'Hồ sơ 10.5'], [24, 'Hai workflow đua nhau 28/06'],
  [25, 'Tái lập P3018 → P3009 → P3012'], [26, 'Giao dịch và CONCURRENTLY'], [27, 'IF NOT EXISTS làm prod lệch'], [28, 'migrate diff đo từng dòng'],
  [29, 'Workflow hiện tại'], [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 10'],
])}
`,
    },

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

<h3>How this chapter reads an incident</h3>
<p>Chapter 8 taught you to read one red run: annotation, first red job, red step, the real error line. This chapter is about the harder cases — the ones where CI was <em>green</em>, or where the check that should have gone red did not exist, or existed and could not fail. Every lesson is one real incident from the api-backend repository between 11 June and 8 August 2026, taken from <code>CLAUDE.md</code>, <code>git log</code> and <code>gh run view</code> (read-only), and every lesson rebuilds a small, safe copy of the incident on the public sandbox so that each log you see was produced on a real runner, not remembered.</p>
${slide('ga-10', 3, 'Five incidents in sixty days of the same repository — four of them share one root')}
<p>The dates are worth a second look. The frontend check that could not fail (Lesson 10.3) was written on 11 June and quietly did nothing for seven weeks, spanning three of the other incidents. The migration that failed on 28 June (Lesson 10.5) was "fixed" by a workflow that auto-resolved it; that auto-fix stayed in the workflow until 10 July. None of these are exotic. They are what a working project looks like when checks are added in a hurry and never shown a failure.</p>
${slide('ga-10', 4, 'Every case is filed in the same five questions: symptom, first wrong diagnosis, right diagnosis, fix, and the check that stops it coming back')}
<p>Each lesson files its incident in the same five-part record, and the order matters. The <strong>symptom</strong> is written exactly, as seen — "/api/v1/gifs returns 404", never "the site is broken". The <strong>first wrong diagnosis</strong> is recorded on purpose: it is the most plausible explanation, which is why it came first, and naming it is how you recognise it faster next time. The <strong>right diagnosis</strong> is always one measurement that killed the wrong one — a <code>curl</code>, a <code>psql</code> query, an <code>ss</code>. The <strong>fix</strong> repairs the layer that broke, not the symptom. And the last part is the one most post-mortems skip: an <strong>automated check that has been seen red at least once</strong>, so the same incident cannot come back quietly.</p>
<div class="callout"><p><strong>What "real" means in this chapter.</strong> Dates, commit hashes and api-backend run numbers come from the repository&#39;s own history. The terminal output on the slides and in the lessons is new: on 24 September 2026 each incident was rebuilt in miniature on <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch10-chan-doan" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap, branch ch10-chan-doan</a>, on GitHub-hosted <code>ubuntu-24.04</code> runners. Where a measurement contradicted what an earlier version of a lesson said, the lesson was corrected and says so.</p></div>

<h3>The symptoms</h3>
${slide('ga-10', 5, 'Case file 10.1: two features dead at once, and the one curl per route that separated them')}
<div class="out">02/07/2026:
  GIF picker chet
  chats "bien mat" khoi /messages
  ca hai song sot qua re-login</div>

<p>Two separate features broken at the same time, both persistent across a fresh login. The instinct is a shared auth or session bug, because the two symptoms overlap where auth would. That instinct sends the investigation into the auth code, which turns out to be fine.</p>

<h3>The diagnosis, one command each</h3>
${slide('ga-10', 6, '401 means the route exists, 404 means it does not — measured against production on 24 September 2026')}
<pre><code>$ curl -sI https://api.cuongthai.com/api/v1/gifs
HTTP/1.1 404 Not Found              <- KHONG mount

$ curl -sI https://api.cuongthai.com/api/v1/messages/threads
HTTP/1.1 401 Unauthorized           <- CO mount, doi xac thuc</code></pre>

<div class="callout warn">
<p><strong>Two different failure modes wearing the same clothes.</strong> The GIF endpoint answered <code>404</code> — the router had no handler for that path. The messages endpoint answered <code>401</code> — the router had a handler, it just required auth. Two symptoms, one auth explanation, and a single command revealed they were unrelated: one was a stale build, the other was a per-viewer <code>deletedAt</code> filter working exactly as designed.</p>
</div>

<h3>Run the diagnosis yourself, today</h3>
<p>The same measurement still works against production, and it takes ten seconds. Run on 24 September 2026, unauthenticated:</p>
<pre><code class="language-bash">$ curl -s -o /dev/null -w "%{http_code}\\n" https://cuongthai.com/api/v1/gifs
401
$ curl -s https://cuongthai.com/api/v1/gifs
{"success":false,"message":"No authentication token provided","code":"UNAUTHORIZED"}
$ curl -s https://cuongthai.com/api/v1/khong-ton-tai-xyz
{"success":false,"message":"Route GET /api/v1/khong-ton-tai-xyz not found"}
$ curl -s -o /dev/null -w "%{http_code}\\n" https://api.cuongthai.com/messages/threads
404</code></pre>
<p>Three details in that output are worth more than the numbers. First, <code>-o /dev/null -w "%{http_code}"</code> prints the status code and nothing else, which is what you want in a script. Second, the <em>body</em> of the 404 tells you who answered: <code>Route GET … not found</code> is the Express app&#39;s own not-found handler, so the request reached the backend and the backend has no such route. Third, the last line is a trap that an earlier version of this lesson fell into: the path is missing <code>/api/v1</code>, so it returns 404 — the same number a stale build returns. Before you conclude "stale build", check the path against a route you <em>know</em> is mounted under the same prefix. A 404 has two meanings, and one of them is a typo.</p>

<h3>Why 404 is the interesting number</h3>
<div class="kv-grid">
<div class="kv"><span class="k">200</span><span class="v">the route is mounted and public. Rarely useful — most authenticated APIs never see 200 without a token</span></div>
<div class="kv"><span class="k">401</span><span class="v">the route is mounted and requires auth. This is what a healthy authenticated endpoint returns to an unauth request, and it means <em>the deploy shipped that route</em></span></div>
<div class="kv"><span class="k">403</span><span class="v">the route is mounted, you are authenticated, and you are refused. Different failure — a permissions problem, not a deploy one</span></div>
<div class="kv"><span class="k">404</span><span class="v">the route is not mounted. The deploy either did not include it or was rolled back before it arrived. This is the specific fingerprint of a stale build</span></div>
</div>

<div class="callout ok">
<p><strong>The rule this repository extracted, and codified in <code>deploy.sh</code>&#39;s smoke test:</strong> after every deploy, <code>curl</code> the core routes without auth. 401 and 200 are both fine — they mean the route mounted. 404 fails the deploy. The check was committed the same afternoon: <code>e9c36ead</code> at 17:07 on 2 July with three routes (<code>gifs</code>, <code>messages/threads</code>, <code>profile</code>), widened to 13 routes at 18:04 (<code>fb51c58d</code>). On 24 September 2026 the list in <code>deploy.sh</code> has 67 routes.</p>
</div>

<h3>What caused the stale build</h3>
${slide('ga-10', 7, 'Rebuilt in the sandbox: the --no-build deploy is healthy and still returns 404 for the new route; the full rebuild returns 401')}
<p>CLAUDE.md is precise about it: a partial or <code>--no-build</code> deploy shipped an old image even though the new source was present. The image on the VPS did not include <code>dist/routes/gifs.routes.js</code>, so the router had no handler for <code>/api/v1/gifs</code>. Everything else about the deploy looked fine — the container was up, health checks passed, the wrong image was serving traffic without complaint.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">what the browser saw</span><span class="lz-t">two things broken</span><span class="lz-d">and a plausible shared cause (auth), which is where investigation went first</span></div>
<div class="lz-step"><span class="lz-k">what one curl showed</span><span class="lz-t">the two things are different</span><span class="lz-d">401 versus 404 separated the symptoms; the auth theory died in one command</span></div>
<div class="lz-step"><span class="lz-k">what the fix was</span><span class="lz-t">a full clean deploy</span><span class="lz-d">and a smoke test added to the deploy script so a stale build fails the deploy rather than reaching production</span></div>
</div>

<h3>Rebuilding the incident in forty seconds</h3>
<p>The mechanism is small enough to rebuild. The sandbox has a miniature API (<code>ch10/ban-cu</code>) whose "build" is simply the set of route files copied into the image: one file per router, exactly like <code>dist/routes/*.js</code>. The workflow <code>ch10-ban-cu.yml</code> first builds the image <em>before</em> the new feature, then lets a "commit" add <code>gifs.js</code>, then deploys in two ways side by side with a matrix:</p>
<pre><code class="language-yaml">strategy:
  fail-fast: false
  matrix:
    cach: [no-build, day-du]
steps:
  - name: Lan deploy TRUOC — anh cu, chua co /gifs
    run: docker build -q -t ch10-api:latest . &amp;&amp; docker run --rm ch10-api:latest ls routes
  - name: Commit MOI toi — them route gifs
    run: cp moi/gifs.js src/routes/
  - name: Deploy (&#36;{{ matrix.cach }})
    run: |
      if [ "&#36;{{ matrix.cach }}" = "day-du" ]; then docker build -q -t ch10-api:latest .; fi
      docker run -d --name ch10-api -p 19100:3001 ch10-api:latest
  - name: Smoke-test (chep tu deploy.sh)
    run: ./smoke.sh ch10-api</code></pre>
<div class="out">deploy (no-build)   health: healthy
                    mounted: courses messages/threads profile
/health                  200  {"ok":true}
/api/v1/profile          401  {"success":false,"message":"No authentication token provided",…}
/api/v1/gifs             404  {"success":false,"message":"Route GET /api/v1/gifs not found"}

deploy (day-du)     health: healthy
                    mounted: courses gifs messages/threads profile
/api/v1/gifs             401  {"success":false,"message":"No authentication token provided",…}</div>
<p>Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018017458" target="_blank" rel="noopener">36018017458</a> shows the whole incident in one screen. Both deploys report <code>healthy</code>: the Docker <code>HEALTHCHECK</code> asks <code>/health</code>, and <code>/health</code> is in both images. The only difference is a file that was on disk and never made it into the image — the source had <code>gifs.js</code>, the running container did not. That is the definition of a stale build: <strong>the code you are reading is not the code that is running</strong>. Nothing inside the container can tell you, because the container is perfectly consistent with itself.</p>

<h3>The smoke test, line by line</h3>
${slide('ga-10', 8, 'The health check asks one route; the smoke test asks each core route and fails the deploy on any 404')}
<pre><code class="language-bash">smoke_failed=false
for route in gifs messages/threads profile courses; do
  code=$(docker exec "$C" node -e "require('http').get('http://127.0.0.1:3001/api/v1/&#36;{route}',r=&gt;{console.log(r.statusCode)}).on('error',()=&gt;console.log('000'))" 2&gt;/dev/null)
  if [ "$code" = "404" ]; then
    echo "✗ Route /api/v1/&#36;{route} → 404 (NOT mounted — stale/partial build)"
    smoke_failed=true
  else
    echo "✓ Route /api/v1/&#36;{route} mounted (HTTP &#36;{code})"
  fi
done
if [ "$smoke_failed" = true ]; then
  echo "::error title=Smoke-test FAILED::route loi 404 → anh dang chay la ban dung CU."
  exit 1
fi</code></pre>
<p>This is the logic of <code>deploy.sh</code>&#39;s step 4b, with <code>curl</code> swapped for <code>node -e</code> because the sandbox image, like the real frontend image, ships without curl. Each line has a reason:</p>
<div class="kv-grid">
<div class="kv"><span class="k">docker exec, not the public URL</span><span class="v">the request starts <em>inside</em> the container, so nginx, TLS and DNS are out of the picture. If it fails, it is the app, not the path to the app</span></div>
<div class="kv"><span class="k">no token on purpose</span><span class="v">an authenticated route answers 401 to an anonymous request — which proves the route is mounted without needing a secret in the deploy script</span></div>
<div class="kv"><span class="k">collect, then fail once</span><span class="v"><code>smoke_failed=true</code> keeps looping so the log lists <em>every</em> missing route, not just the first one</span></div>
<div class="kv"><span class="k">exit 1 at the end</span><span class="v">the step turns red, the deploy stops, and <code>::error</code> puts the reason at the top of the run page</span></div>
</div>
<div class="out">✗ Route /api/v1/gifs → 404 (NOT mounted — stale/partial build)
✓ Route /api/v1/messages/threads mounted (HTTP 401)
✓ Route /api/v1/profile mounted (HTTP 401)
✓ Route /api/v1/courses mounted (HTTP 200)
##[error]route loi 404 → anh dang chay la ban dung CU. Chay lai deploy DAY DU (khong --no-build).
##[error]Process completed with exit code 1.</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — this checker has a hole, and Lesson 10.3 measures it.</strong> "Anything that is not 404 counts as mounted" also passes a route that answers 500, and a container that answers nothing at all (the code comes back empty). In the real <code>deploy.sh</code> the backend health wait runs first, so a fully dead backend is caught earlier; a route that crashes with 500 still sails through. Lesson 10.3 runs this exact checker against a 500 page and a stopped container and shows it green both times.</p></div>

<h3>The general technique</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">separate symptoms with a single measurement</span><span class="lz-lnote">two failures with a plausible shared cause is a hypothesis, not a fact. One measurement per symptom is enough to test it, and the technique above is one <code>curl</code> per route</span></div>
<div class="lz-layer"><span class="lz-lname">test the layer under the browser</span><span class="lz-lnote">a browser response is code, network, storage and auth all combined. A raw request removes three of the four and gets to the router by itself</span></div>
<div class="lz-layer"><span class="lz-lname">read the number, not the message</span><span class="lz-lnote">401 and 404 both look like "does not work" in a browser. As HTTP codes they mean different things and require different fixes. The number is more informative than the page</span></div>
<div class="lz-layer"><span class="lz-lname">codify the check</span><span class="lz-lnote">once one 404 has caused an incident, the smoke test is a permanent part of the deploy. This is 8.5&#39;s pattern applied at the deploy layer</span></div>
</div>

<h3>When to use a route smoke test — and when not</h3>
<table>
<thead><tr><th>Question</th><th>Route smoke test answers it?</th><th>Use instead</th></tr></thead>
<tbody>
<tr><td>Did this deploy ship the router for X?</td><td>Yes — 401/200 versus 404</td><td>—</td></tr>
<tr><td>Does X return the right data?</td><td>No — it never sends a token or a body</td><td>integration tests in CI (Chapter 7)</td></tr>
<tr><td>Did the frontend ship its new static files?</td><td>No — static assets are not API routes</td><td>fetch the hashed bundle itself (<code>deploy.sh</code> step 4c, Lesson 10.4)</td></tr>
<tr><td>Is the database schema the one the code expects?</td><td>Rarely — a missing column is a 500 on one query</td><td><code>prisma migrate status</code> as a deploy step (Lesson 10.5)</td></tr>
<tr><td>Is the site reachable from the internet?</td><td>No — it runs inside the container</td><td>an external probe of the public URL after nginx reloads</td></tr>
</tbody>
</table>
<p>A smoke test is deliberately shallow: it answers "is the thing I just deployed actually the thing I think I deployed?" in a few seconds, for every deploy. Deep correctness belongs to tests that run <em>before</em> the deploy. Keeping the two apart is what lets the smoke test stay fast enough to run on every single deploy — which is the only way it catches the one deploy that went wrong.</p>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: A deploy finished green, the container is healthy, but a new endpoint returns 404. Where do you look first?</strong><br>A: I suspect the running image is not the one I built. I compare a known route with the new one using an unauthenticated <code>curl -w "%{http_code}"</code>: if the old route answers 401 and the new one 404 with the app&#39;s own "not found" body, the router is missing from the image. Then I check how the deploy ran — a skipped build step, a cached tag, a partial deploy — and redeploy with a real build. Afterwards I add the route to the post-deploy smoke test.</p>
<p><strong>Q: Why does your smoke test call authenticated routes without a token?</strong><br>A: Because a 401 is proof the route is mounted, and it needs no secret. A mounted route rejects anonymous requests; a missing route returns 404. That separates "not deployed" from "deployed" without putting credentials in the deploy script.</p>
<p><strong>Q: What is the difference between a health check and a smoke test?</strong><br>A: A health check answers "is this process alive?" — usually one endpoint, polled forever, used by the orchestrator to restart it. A smoke test runs once after a deploy and answers "did we deploy what we meant to?" — many endpoints, and it fails the deploy. The 2 July incident had a green health check and a stale image; only the smoke test could have seen it.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating the browser as the diagnostic tool.</strong> A browser retries, follows redirects, applies cookies, runs JavaScript, and presents an error page for anything from a network hiccup to a 404. It is the worst possible tool for isolating a fault, and it is the default tool for reporting one. Every real diagnosis in this chapter uses <code>curl</code> or a log line instead — the browser is what the user saw, not what you should use to find the cause.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Two symptoms with a plausible shared cause is a hypothesis to test with one measurement per symptom, and for HTTP the measurement is a raw <code>curl</code>: 401 means the deploy mounted the route, 404 means it did not, and reading the wrong one sends you to investigate code that is fine.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want the deploy of your own project to fail the next time it ships an image that is missing a route — and you want to see it fail once, on purpose, before you trust it.</p><ol>
<li>Pick three routes of your own API: one public (expect 200) and two that need login (expect 401). Check each by hand: <code>curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:PORT/api/…</code>, plus one path that does not exist (expect 404). Write the four numbers down.</li>
<li>Write <code>smoke.sh</code> with the loop from this lesson, using your three routes. Run it against your running app: all three lines should start with ✓ and the script should exit 0 (<code>echo $?</code>).</li>
<li>Stop the app, comment out one router (or rename its file), start the app again, and run <code>smoke.sh</code>. It must print ✗ for that route and exit 1.</li>
<li>Add it to a workflow in your repository as a step after the app starts in the job (<code>npm start &amp;</code> then wait for the port). Push once with the router commented out and once with it restored.</li>
</ol>
<p><strong>Done when:</strong> you have one red run whose annotation names the missing route and one green run on the next commit; and your note lists 200 / 401 / 401 / 404 for the four hand-made requests.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stale build (bản dựng cũ)</span><span class="v">A running image or bundle that was built from older code than the code you are reading. Everything inside it is consistent, which is why it looks healthy.</span></div>
  <div class="kv"><span class="k">Mounted route (route đã gắn)</span><span class="v">A path the router has a handler for. Unauthenticated, it answers 200 (public) or 401 (needs login) — never 404.</span></div>
  <div class="kv"><span class="k">Smoke test (phép thử khói)</span><span class="v">A fast, shallow check run right after a deploy to confirm the deploy delivered what was intended. It fails the deploy, it does not test logic.</span></div>
  <div class="kv"><span class="k">Health check (kiểm sức khoẻ)</span><span class="v">A repeated probe — often one endpoint — used by Docker or an orchestrator to decide whether a process is alive. Passing it says nothing about which code is inside.</span></div>
  <div class="kv"><span class="k"><code>--no-build</code></span><span class="v">A deploy mode that reuses the existing image. Correct only when nothing in the image needed to change; after a code change it ships the old code.</span></div>
  <div class="kv"><span class="k"><code>-w "%{http_code}"</code></span><span class="v">The curl option that prints only the HTTP status. With <code>-s -o /dev/null</code> it turns curl into a one-number probe for scripts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two symptoms with a plausible shared cause are a hypothesis; one unauthenticated <code>curl</code> per symptom tests it.</li>
<li>Unauthenticated, 401 and 200 mean "the route is in this build"; 404 means it is not — or that you typed the path wrong, so compare with a known route.</li>
<li>A stale image passes every health check, because the health check only asks one route and the image is consistent with itself.</li>
<li>The fix for a stale build is a real rebuild; the protection is a post-deploy smoke test that fails the deploy on 404.</li>
<li>Collect all failures, then exit 1 once, and put the reason in an <code>::error</code> annotation.</li>
<li>"Not 404 means OK" is a blacklist with holes (500, no answer) — Lesson 10.3 measures them.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-02 incident row</span><span class="lc-sub">the source of every measurement in this lesson, including the specific rule for reading HTTP responses added afterwards.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36018017458 — --no-build versus a full rebuild</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018017458 — both deploys healthy; the stale one returns 404 for /api/v1/gifs and the smoke test fails it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7231 — HTTP status code definitions</span><span class="lc-sub">tools.ietf.org/html/rfc7231 — the specification behind the distinction between 404 and 401 that made the diagnosis possible.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — -I, -s, -o, and -w for scripted probes</span><span class="lc-sub">curl.se/docs/manpage.html — the flags that turn <code>curl</code> into a health probe, including <code>-w &#39;%{http_code}&#39;</code> for the number by itself.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the smoke test that came out of this incident</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deploy script&#39;s post-deploy checks and the specific routes it probes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reading status codes in access logs</span><span class="lc-sub">/courses/nginx/learn${REF} — the server-side view of the same diagnosis, including where 404 is served by nginx versus by the app.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Bản dựng cũ, và 404 với 401 như phép chẩn đoán</h2>
<p class="lead">CLAUDE.md ghi lại sự cố 2026-07-02 trong một dòng, và phần chẩn đoán là MỘT lệnh <code>curl</code>. Đáng đọc trọn vì kỹ thuật này TỔNG QUÁT HOÁ được.</p>

<h3>Chương này đọc một sự cố như thế nào</h3>
<p>Chương 8 dạy bạn đọc MỘT run đỏ: annotation, job đỏ đầu tiên, bước đỏ, dòng lỗi thật. Chương này dành cho những ca khó hơn — những lần CI <em>xanh</em>, hoặc phép kiểm lẽ ra phải đỏ thì không tồn tại, hoặc tồn tại mà không thể đỏ. Mỗi bài là một sự cố THẬT của kho api-backend trong khoảng 11/06 – 08/08/2026, lấy từ <code>CLAUDE.md</code>, <code>git log</code> và <code>gh run view</code> (chỉ đọc), và mỗi bài dựng lại một bản thu nhỏ, an toàn của sự cố trên sân tập công khai — để mọi dòng log bạn thấy là do một runner thật in ra, không phải do ai đó nhớ lại.</p>
${slide('ga-10', 3, 'Năm sự cố trong 60 ngày của cùng một kho — bốn ca có chung một gốc')}
<p>Hãy nhìn kỹ các ngày. Chốt kiểm frontend không thể hỏng (bài 10.3) ra đời ngày 11/06 và âm thầm không làm gì suốt bảy tuần, trùm lên ba sự cố khác. Cú migration hỏng ngày 28/06 (bài 10.5) được "vá" bằng một workflow tự resolve; cú tự vá ấy nằm trong workflow tới tận 10/07. Không ca nào kỳ quặc cả. Chúng là hình dạng bình thường của một dự án đang chạy khi phép kiểm được thêm vội và chưa bao giờ được cho thấy một lần hỏng.</p>
${slide('ga-10', 4, 'Mỗi ca được ghi theo cùng năm câu hỏi: triệu chứng, chẩn đoán sai đầu tiên, chẩn đoán đúng, cách vá, và phép kiểm chặn tái diễn')}
<p>Mỗi bài ghi sự cố của nó vào cùng một hồ sơ năm phần, và thứ tự là có ý. <strong>Triệu chứng</strong> được chép chính xác như đã thấy — "/api/v1/gifs trả 404", không bao giờ là "web hỏng". <strong>Chẩn đoán sai đầu tiên</strong> được ghi lại CÓ CHỦ Ý: nó là lời giải thích hợp lý nhất, vì thế nó đến trước, và gọi được tên nó là cách để lần sau nhận ra nó nhanh hơn. <strong>Chẩn đoán đúng</strong> luôn là MỘT phép đo đã giết chẩn đoán sai — một <code>curl</code>, một câu <code>psql</code>, một lệnh <code>ss</code>. <strong>Cách vá</strong> sửa đúng tầng bị hỏng, không sửa triệu chứng. Và phần cuối là phần hầu hết bản hồi cứu bỏ qua: một <strong>phép kiểm tự động đã từng được thấy ĐỎ ít nhất một lần</strong>, để cùng sự cố ấy không thể âm thầm quay lại.</p>
<div class="callout"><p><strong>"Thật" nghĩa là gì trong chương này.</strong> Ngày tháng, mã commit và số run của api-backend lấy từ lịch sử của chính kho. Output terminal trên slide và trong bài là MỚI: ngày 24/09/2026 mỗi sự cố được dựng lại thu nhỏ trên <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch10-chan-doan" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap, nhánh ch10-chan-doan</a>, trên runner <code>ubuntu-24.04</code> của GitHub. Chỗ nào phép đo nói ngược với bản cũ của bài, bài đã được sửa và nói rõ ra.</p></div>

<h3>Các triệu chứng</h3>
${slide('ga-10', 5, 'Hồ sơ 10.1: hai tính năng chết cùng lúc, và mỗi route một cú curl đã tách chúng ra')}
<div class="out">02/07/2026:
  GIF picker chet
  chats "bien mat" khoi /messages
  ca hai song sot qua re-login</div>

<p>Hai tính năng riêng biệt hỏng cùng lúc, cả hai đều bền qua một lần đăng nhập lại. Bản năng là một bug auth hoặc session chung, bởi hai triệu chứng ấy CHỒNG LÊN NHAU ở chỗ mà auth SẼ chồng. Bản năng ấy lôi cuộc điều tra vào mã auth — và mã auth hoá ra không hỏng gì.</p>

<h3>Chẩn đoán, mỗi cái một lệnh</h3>
${slide('ga-10', 6, '401 nghĩa là route có, 404 nghĩa là route không có — đo trên production ngày 24/09/2026')}
<pre><code>$ curl -sI https://api.cuongthai.com/api/v1/gifs
HTTP/1.1 404 Not Found              <- KHONG mount

$ curl -sI https://api.cuongthai.com/api/v1/messages/threads
HTTP/1.1 401 Unauthorized           <- CO mount, doi xac thuc</code></pre>

<div class="callout warn">
<p><strong>Hai kiểu hỏng KHÁC NHAU mặc CÙNG một bộ đồ.</strong> Endpoint GIF trả <code>404</code> — router KHÔNG có handler cho path đó. Endpoint messages trả <code>401</code> — router CÓ handler, chỉ là đòi auth. Hai triệu chứng, MỘT lời giải thích auth, và một lệnh duy nhất phơi bày rằng chúng KHÔNG liên quan: một là bản dựng cũ, cái kia là bộ lọc <code>deletedAt</code> theo từng viewer đang chạy ĐÚNG như thiết kế.</p>
</div>

<h3>Tự chạy phép chẩn đoán, ngay hôm nay</h3>
<p>Phép đo ấy vẫn chạy được với production, và mất mười giây. Chạy ngày 24/09/2026, không token:</p>
<pre><code class="language-bash">$ curl -s -o /dev/null -w "%{http_code}\\n" https://cuongthai.com/api/v1/gifs
401
$ curl -s https://cuongthai.com/api/v1/gifs
{"success":false,"message":"No authentication token provided","code":"UNAUTHORIZED"}
$ curl -s https://cuongthai.com/api/v1/khong-ton-tai-xyz
{"success":false,"message":"Route GET /api/v1/khong-ton-tai-xyz not found"}
$ curl -s -o /dev/null -w "%{http_code}\\n" https://api.cuongthai.com/messages/threads
404</code></pre>
<p>Ba chi tiết trong output đó đáng giá hơn các con số. Một, <code>-o /dev/null -w "%{http_code}"</code> chỉ in mã trạng thái, không gì khác — đúng thứ bạn cần trong script. Hai, <em>thân</em> của cú 404 cho biết AI đã trả lời: <code>Route GET … not found</code> là bộ xử lý not-found của chính app Express, nghĩa là yêu cầu đã tới backend và backend không có route đó. Ba, dòng cuối là cái bẫy mà bản cũ của bài này đã rơi vào: đường dẫn thiếu <code>/api/v1</code>, nên nó trả 404 — đúng con số mà một bản dựng cũ trả. Trước khi kết luận "bản dựng cũ", hãy so đường dẫn với một route bạn BIẾT CHẮC đã mount dưới cùng tiền tố. 404 có hai nghĩa, và một trong hai là gõ sai.</p>

<h3>Vì sao 404 là con số ĐÁNG chú ý</h3>
<div class="kv-grid">
<div class="kv"><span class="k">200</span><span class="v">route đã mount và CÔNG KHAI. Hiếm khi hữu ích — phần lớn API có xác thực không bao giờ thấy 200 nếu không có token</span></div>
<div class="kv"><span class="k">401</span><span class="v">route đã mount và ĐÒI auth. Đây là thứ một endpoint có xác thực KHOẺ trả về cho một lời gọi không xác thực, và nó nghĩa là <em>CUỘC DEPLOY ĐÃ SHIP route ấy</em></span></div>
<div class="kv"><span class="k">403</span><span class="v">route đã mount, bạn đã xác thực, và bạn bị từ chối. Kiểu hỏng KHÁC — vấn đề QUYỀN, không phải vấn đề deploy</span></div>
<div class="kv"><span class="k">404</span><span class="v">route CHƯA mount. Deploy hoặc không bao gồm nó, hoặc bị rollback trước khi nó tới. Đây là DẤU VÂN TAY CỤ THỂ của bản dựng cũ</span></div>
</div>

<div class="callout ok">
<p><strong>Quy tắc kho này rút ra và mã hoá trong smoke test của <code>deploy.sh</code>:</strong> sau mỗi cuộc deploy, <code>curl</code> các route lõi mà KHÔNG xác thực. 401 và 200 đều ổn — chúng nghĩa là route ĐÃ mount. 404 làm HỎNG cuộc deploy. Phép kiểm được commit ngay chiều hôm đó: <code>e9c36ead</code> lúc 17:07 ngày 02/07 với ba route (<code>gifs</code>, <code>messages/threads</code>, <code>profile</code>), mở rộng lên 13 route lúc 18:04 (<code>fb51c58d</code>). Ngày 24/09/2026, danh sách trong <code>deploy.sh</code> có 67 route.</p>
</div>

<h3>Cái gì gây ra bản dựng cũ</h3>
${slide('ga-10', 7, 'Dựng lại trên sân tập: deploy --no-build vẫn healthy mà route mới vẫn 404; dựng lại đầy đủ thì 401')}
<p>CLAUDE.md nói chính xác: một cuộc deploy TỪNG PHẦN hoặc <code>--no-build</code> đã ship một ảnh CŨ dù mã nguồn mới đã có mặt. Ảnh trên VPS không bao gồm <code>dist/routes/gifs.routes.js</code>, nên router không có handler cho <code>/api/v1/gifs</code>. Mọi thứ khác về cuộc deploy TRÔNG có vẻ ổn — container đang chạy, health check qua, cái ảnh SAI đang phục vụ lưu lượng mà không kêu ca gì.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">trình duyệt THẤY GÌ</span><span class="lz-t">hai thứ hỏng</span><span class="lz-d">và một nguyên nhân chung HỢP LÝ (auth), là chỗ điều tra ĐI ĐẦU TIÊN</span></div>
<div class="lz-step"><span class="lz-k">một cú curl CHO THẤY GÌ</span><span class="lz-t">hai thứ ấy khác nhau</span><span class="lz-d">401 so với 404 tách hai triệu chứng; lý thuyết auth chết trong một lệnh</span></div>
<div class="lz-step"><span class="lz-k">bản vá là gì</span><span class="lz-t">một cuộc deploy sạch đầy đủ</span><span class="lz-d">và một smoke test thêm vào script deploy để bản dựng cũ LÀM HỎNG deploy chứ không TỚI production</span></div>
</div>

<h3>Dựng lại sự cố trong bốn mươi giây</h3>
<p>Cơ chế đủ nhỏ để dựng lại. Sân tập có một API thu nhỏ (<code>ch10/ban-cu</code>) mà "bản dựng" của nó đơn giản là tập tệp route được chép vào image: mỗi router một tệp, y như <code>dist/routes/*.js</code>. Workflow <code>ch10-ban-cu.yml</code> dựng image TRƯỚC khi có tính năng mới, rồi cho một "commit" thêm <code>gifs.js</code>, rồi deploy theo hai cách song song bằng ma trận:</p>
<pre><code class="language-yaml">strategy:
  fail-fast: false
  matrix:
    cach: [no-build, day-du]
steps:
  - name: Lan deploy TRUOC — anh cu, chua co /gifs
    run: docker build -q -t ch10-api:latest . &amp;&amp; docker run --rm ch10-api:latest ls routes
  - name: Commit MOI toi — them route gifs
    run: cp moi/gifs.js src/routes/
  - name: Deploy (&#36;{{ matrix.cach }})
    run: |
      if [ "&#36;{{ matrix.cach }}" = "day-du" ]; then docker build -q -t ch10-api:latest .; fi
      docker run -d --name ch10-api -p 19100:3001 ch10-api:latest
  - name: Smoke-test (chep tu deploy.sh)
    run: ./smoke.sh ch10-api</code></pre>
<div class="out">deploy (no-build)   health: healthy
                    mounted: courses messages/threads profile
/health                  200  {"ok":true}
/api/v1/profile          401  {"success":false,"message":"No authentication token provided",…}
/api/v1/gifs             404  {"success":false,"message":"Route GET /api/v1/gifs not found"}

deploy (day-du)     health: healthy
                    mounted: courses gifs messages/threads profile
/api/v1/gifs             401  {"success":false,"message":"No authentication token provided",…}</div>
<p>Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018017458" target="_blank" rel="noopener">36018017458</a> gói cả sự cố vào một màn hình. Cả hai cách deploy đều báo <code>healthy</code>: <code>HEALTHCHECK</code> của Docker hỏi <code>/health</code>, và <code>/health</code> có trong cả hai image. Khác biệt duy nhất là một tệp có trên đĩa mà không bao giờ vào image — mã nguồn có <code>gifs.js</code>, container đang chạy thì không. Đó chính là định nghĩa của bản dựng cũ: <strong>mã bạn đang đọc không phải mã đang chạy</strong>. Không gì bên trong container nói được điều đó, vì container hoàn toàn nhất quán với chính nó.</p>

<h3>Smoke-test, từng dòng một</h3>
${slide('ga-10', 8, 'Healthcheck hỏi một route; smoke-test hỏi từng route lõi và làm hỏng deploy khi gặp bất kỳ 404 nào')}
<pre><code class="language-bash">smoke_failed=false
for route in gifs messages/threads profile courses; do
  code=$(docker exec "$C" node -e "require('http').get('http://127.0.0.1:3001/api/v1/&#36;{route}',r=&gt;{console.log(r.statusCode)}).on('error',()=&gt;console.log('000'))" 2&gt;/dev/null)
  if [ "$code" = "404" ]; then
    echo "✗ Route /api/v1/&#36;{route} → 404 (NOT mounted — stale/partial build)"
    smoke_failed=true
  else
    echo "✓ Route /api/v1/&#36;{route} mounted (HTTP &#36;{code})"
  fi
done
if [ "$smoke_failed" = true ]; then
  echo "::error title=Smoke-test FAILED::route loi 404 → anh dang chay la ban dung CU."
  exit 1
fi</code></pre>
<p>Đây là logic của bước 4b trong <code>deploy.sh</code>, chỉ đổi <code>curl</code> thành <code>node -e</code> vì image của sân tập, giống image frontend thật, không có curl. Mỗi dòng có lý do của nó:</p>
<div class="kv-grid">
<div class="kv"><span class="k">docker exec, không qua URL công khai</span><span class="v">yêu cầu xuất phát TỪ TRONG container, nên nginx, TLS và DNS bị loại khỏi bức tranh. Nếu nó hỏng, là app hỏng, không phải đường tới app</span></div>
<div class="kv"><span class="k">cố ý không gửi token</span><span class="v">route cần đăng nhập trả 401 cho yêu cầu vô danh — chứng minh route đã mount mà không cần để bí mật nào trong script deploy</span></div>
<div class="kv"><span class="k">gom lại, rồi hỏng một lần</span><span class="v"><code>smoke_failed=true</code> để vòng lặp chạy tiếp, nên log liệt kê MỌI route thiếu chứ không chỉ cái đầu tiên</span></div>
<div class="kv"><span class="k">exit 1 ở cuối</span><span class="v">bước chuyển đỏ, deploy dừng, và <code>::error</code> đặt lý do lên đầu trang run</span></div>
</div>
<div class="out">✗ Route /api/v1/gifs → 404 (NOT mounted — stale/partial build)
✓ Route /api/v1/messages/threads mounted (HTTP 401)
✓ Route /api/v1/profile mounted (HTTP 401)
✓ Route /api/v1/courses mounted (HTTP 200)
##[error]route loi 404 → anh dang chay la ban dung CU. Chay lai deploy DAY DU (khong --no-build).
##[error]Process completed with exit code 1.</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bộ kiểm này có lỗ, và bài 10.3 đo được nó.</strong> "Cứ không phải 404 là coi như đã mount" cũng cho qua một route trả 500, và một container không trả lời gì (mã trả về rỗng). Trong <code>deploy.sh</code> thật, vòng chờ backend khoẻ chạy trước nên backend chết hẳn bị chặn sớm hơn; còn route vỡ với 500 thì vẫn lọt. Bài 10.3 chạy đúng bộ kiểm này qua một trang 500 và một container đã dừng, và cho thấy nó xanh cả hai lần.</p></div>

<h3>Kỹ thuật tổng quát</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tách các triệu chứng bằng MỘT phép đo</span><span class="lz-lnote">hai cú hỏng có một nguyên nhân chung hợp lý là một GIẢ THUYẾT, không phải sự thật. Một phép đo cho mỗi triệu chứng là đủ để kiểm nó, và kỹ thuật trên là MỘT <code>curl</code> cho mỗi route</span></div>
<div class="lz-layer"><span class="lz-lname">kiểm TẦNG DƯỚI trình duyệt</span><span class="lz-lnote">phản hồi trình duyệt là mã, mạng, lưu trữ và auth kết hợp. Một lời gọi thô GỠ BỎ ba trong bốn và tới thẳng ROUTER</span></div>
<div class="lz-layer"><span class="lz-lname">đọc CON SỐ, không đọc thông báo</span><span class="lz-lnote">401 và 404 đều TRÔNG như "không hoạt động" trong một trình duyệt. Dưới dạng mã HTTP chúng nghĩa là những thứ KHÁC NHAU và đòi những cách vá KHÁC NHAU. Con số nhiều thông tin hơn cái trang</span></div>
<div class="lz-layer"><span class="lz-lname">MÃ HOÁ phép kiểm</span><span class="lz-lnote">một khi một cú 404 đã gây một sự cố, smoke test trở thành phần VĨNH VIỄN của cuộc deploy. Đây là khuôn mẫu của bài 8.5 áp ở TẦNG DEPLOY</span></div>
</div>

<h3>Khi nào dùng smoke-test theo route — khi nào KHÔNG</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Smoke-test theo route trả lời được?</th><th>Dùng thay</th></tr></thead>
<tbody>
<tr><td>Deploy này có mang router X lên không?</td><td>Có — 401/200 so với 404</td><td>—</td></tr>
<tr><td>X có trả đúng dữ liệu không?</td><td>Không — nó không gửi token hay thân yêu cầu</td><td>test tích hợp trong CI (Chương 7)</td></tr>
<tr><td>Frontend có mang tệp tĩnh mới lên không?</td><td>Không — tài sản tĩnh không phải route API</td><td>tải chính gói có mã băm (<code>deploy.sh</code> bước 4c, bài 10.4)</td></tr>
<tr><td>Schema CSDL có đúng cái mã mong đợi?</td><td>Hiếm khi — thiếu một cột là 500 ở một câu truy vấn</td><td><code>prisma migrate status</code> làm một bước deploy (bài 10.5)</td></tr>
<tr><td>Web có vào được từ Internet không?</td><td>Không — nó chạy trong container</td><td>một phép thăm dò từ ngoài vào URL công khai sau khi nginx nạp lại</td></tr>
</tbody>
</table>
<p>Smoke-test cố ý NÔNG: nó trả lời "thứ tôi vừa deploy có đúng là thứ tôi nghĩ tôi đã deploy không?" trong vài giây, cho mọi lần deploy. Tính đúng đắn sâu thuộc về các bài test chạy TRƯỚC deploy. Giữ hai thứ tách nhau là điều cho phép smoke-test đủ nhanh để chạy ở MỌI lần deploy — và đó là cách duy nhất để nó bắt được đúng lần deploy bị hỏng.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Deploy xanh, container healthy, nhưng một endpoint mới trả 404. Bạn nhìn vào đâu trước?</strong><br>Đ: Tôi nghi image đang chạy không phải image tôi vừa dựng. Tôi so một route cũ với route mới bằng <code>curl -w "%{http_code}"</code> không xác thực: route cũ trả 401 còn route mới trả 404 kèm thân "not found" của chính app thì router không có trong image. Rồi tôi xem deploy đã chạy thế nào — bước build bị bỏ, tag bị cache, deploy dở dang — và deploy lại có build thật. Sau đó tôi thêm route vào smoke-test sau deploy.</p>
<p><strong>H: Vì sao smoke-test của bạn gọi route cần đăng nhập mà không gửi token?</strong><br>Đ: Vì 401 là bằng chứng route đã mount, và nó không cần bí mật nào. Route đã mount từ chối yêu cầu vô danh; route không có trả 404. Nhờ vậy tách được "chưa deploy" với "đã deploy" mà không phải để thông tin đăng nhập trong script deploy.</p>
<p><strong>H: Health check khác smoke-test chỗ nào?</strong><br>Đ: Health check trả lời "tiến trình này còn sống không?" — thường một endpoint, hỏi mãi, để bộ điều phối khởi động lại khi cần. Smoke-test chạy MỘT lần sau deploy và trả lời "ta có deploy đúng thứ định deploy không?" — nhiều endpoint, và nó làm hỏng deploy. Sự cố 02/07 có health check xanh và image cũ; chỉ smoke-test mới thấy được.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi trình duyệt là công cụ CHẨN ĐOÁN.</strong> Một trình duyệt thử lại, đi theo redirect, áp cookie, chạy JavaScript, và hiện một trang lỗi cho MỌI thứ từ tiếng ồn mạng tới một cú 404. Nó là công cụ tệ nhất có thể để cô lập một cú vỡ, và là công cụ mặc định để BÁO CÁO một cú vỡ. Mọi cuộc chẩn đoán thật trong chương này dùng <code>curl</code> hoặc một dòng log thay vào đó — trình duyệt là thứ NGƯỜI DÙNG THẤY, không phải thứ bạn nên dùng để tìm NGUYÊN NHÂN.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hai triệu chứng với một nguyên nhân chung hợp lý là một GIẢ THUYẾT để KIỂM với MỘT phép đo cho mỗi triệu chứng, và với HTTP thì phép đo là một cú <code>curl</code> THÔ: 401 nghĩa là deploy đã mount route, 404 nghĩa là không, và đọc nhầm một trong hai đẩy bạn đi điều tra mã VỐN ỔN.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn lần deploy tới của chính dự án mình PHẢI hỏng nếu nó mang lên một image thiếu route — và muốn thấy nó hỏng một lần, có chủ ý, trước khi tin nó.</p><ol>
<li>Chọn ba route API của bạn: một công khai (mong 200) và hai cần đăng nhập (mong 401). Kiểm bằng tay từng cái: <code>curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:CỔNG/api/…</code>, cộng một đường dẫn không tồn tại (mong 404). Ghi lại bốn con số.</li>
<li>Viết <code>smoke.sh</code> với vòng lặp trong bài, dùng ba route của bạn. Chạy nó với app đang chạy: cả ba dòng phải bắt đầu bằng ✓ và script thoát 0 (<code>echo $?</code>).</li>
<li>Dừng app, comment một router (hoặc đổi tên tệp của nó), bật app lại, chạy <code>smoke.sh</code>. Nó phải in ✗ cho route đó và thoát 1.</li>
<li>Đưa nó vào một workflow trong kho của bạn, làm một bước sau khi app khởi động trong job (<code>npm start &amp;</code> rồi chờ cổng). Push một lần với router bị comment và một lần đã trả lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một run đỏ mà annotation gọi đúng tên route thiếu và một run xanh ở commit kế tiếp; và ghi chú của bạn có 200 / 401 / 401 / 404 cho bốn yêu cầu làm bằng tay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stale build (bản dựng cũ)</span><span class="v">Image hay gói đang chạy được dựng từ mã CŨ hơn mã bạn đang đọc. Mọi thứ bên trong nó nhất quán, nên nó trông khoẻ.</span></div>
  <div class="kv"><span class="k">Mounted route (route đã gắn)</span><span class="v">Đường dẫn mà router có hàm xử lý. Không xác thực thì nó trả 200 (công khai) hoặc 401 (cần đăng nhập) — không bao giờ 404.</span></div>
  <div class="kv"><span class="k">Smoke test (phép thử khói)</span><span class="v">Phép kiểm nhanh, nông, chạy ngay sau deploy để xác nhận deploy mang lên đúng thứ định mang. Nó làm hỏng deploy, không kiểm logic.</span></div>
  <div class="kv"><span class="k">Health check (kiểm sức khoẻ)</span><span class="v">Phép thăm dò lặp lại — thường một endpoint — để Docker hay bộ điều phối quyết định tiến trình còn sống không. Qua nó không nói gì về MÃ NÀO đang ở trong.</span></div>
  <div class="kv"><span class="k"><code>--no-build</code></span><span class="v">Chế độ deploy dùng lại image đang có. Chỉ đúng khi không gì trong image cần đổi; sau khi sửa mã, nó mang mã cũ lên.</span></div>
  <div class="kv"><span class="k"><code>-w "%{http_code}"</code></span><span class="v">Tuỳ chọn curl chỉ in mã HTTP. Đi với <code>-s -o /dev/null</code> nó biến curl thành phép dò một-con-số cho script.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai triệu chứng có một nguyên nhân chung hợp lý là GIẢ THUYẾT; mỗi triệu chứng một cú <code>curl</code> không xác thực là đủ để kiểm nó.</li>
<li>Không xác thực: 401 và 200 nghĩa là "route có trong bản dựng này"; 404 nghĩa là không có — hoặc bạn gõ sai đường, nên hãy so với một route đã biết.</li>
<li>Image cũ qua mọi health check, vì health check chỉ hỏi một route và image nhất quán với chính nó.</li>
<li>Vá bản dựng cũ là dựng lại thật; bảo vệ là smoke-test sau deploy làm hỏng deploy khi gặp 404.</li>
<li>Gom mọi cú hỏng, rồi exit 1 một lần, và đặt lý do trong annotation <code>::error</code>.</li>
<li>"Không phải 404 là ổn" là một danh sách đen có lỗ (500, không trả lời) — bài 10.3 đo chúng.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — dòng sự cố 2026-07-02</span><span class="lc-sub">nguồn của mọi phép đo trong bài này, gồm cả quy tắc cụ thể để đọc phản hồi HTTP đã thêm sau đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36018017458 — --no-build so với dựng lại đầy đủ</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018017458 — cả hai cách deploy đều healthy; bản cũ trả 404 cho /api/v1/gifs và smoke-test đánh hỏng nó.</span></span></div>
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
${slide('ga-10', 9, 'Case file 10.2: an enum rename that passed every checklist item and broke the seed step on production')}
<p>The timeline in the repository is short. Commit <code>1da59865</code> (18:17, 8 August 2026) renamed the value as part of a larger bilingual Content Creator change. The deploy at 18:32 printed <code>Seed reported errors (rc=0)</code> at the Content Creator step — a <em>warning</em>, not a failure, because the seed process exited 0 and the deploy script only flagged the text. Commit <code>f2f36e1f</code> at 18:39 fixed it, and its message states the verification plainly: <code>typecheck:seed</code> 0 errors, <code>tsc --noEmit</code> 0 errors, <code>prisma db seed</code> ran to the end on a local database, and the <code>CODE_REVIEW</code> row was checked in <code>content_ideas</code> with <code>psql</code>, "not just by reading code".</p>
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
${slide('ga-10', 10, 'tsc was green because it never opened seed.ts: 1 file under src/, 0 under prisma/')}
<p>You do not have to take "tsc never opened the seed" on trust — tsc will tell you which files it read. The sandbox rebuilds the repository&#39;s layout (<code>ch10/seed</code>: the same <code>rootDir: "./src"</code>, the same <code>exclude</code>, Prisma 5.22 and a Postgres 16 service) and asks:</p>
<pre><code class="language-bash">$ npx tsc --noEmit
  → rc=0
$ npx tsc --listFilesOnly | grep -c '/prisma/'
0
$ npx tsc --listFilesOnly | grep -c '/src/'
1</code></pre>
<p><code>--listFilesOnly</code> prints every file in the program (your sources plus the type declarations they pull in) and exits. Zero files under <code>prisma/</code> is the whole incident in one number: a green <code>tsc</code> was never evidence about the seed. The same question works for any configuration you are about to trust — ESLint has <code>--debug</code> to show which files it lints, Jest has <code>--listTests</code>, and <code>git ls-files</code> answers "which files does CI even check out?"</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tsconfig excludes prisma/</span><span class="lz-t">defensible</span><span class="lz-d">the main <code>tsconfig.json</code> has <code>rootDir: ./src</code>; the seed is under <code>prisma/</code>. Including it there would force a lot of unrelated compilation. So it went in <code>exclude</code></span></div>
<div class="lz-step"><span class="lz-k">seed hand-writes the enum union</span><span class="lz-t">defensible</span><span class="lz-d">a hand-written union is quick to type and reads clearly right next to the seed data, so the seed described its own rows with its own copy of the enum</span></div>
<div class="lz-step"><span class="lz-k">together</span><span class="lz-t">a checklist that verifies nothing about the seed</span><span class="lz-d">the union is not the real one, and no compilation ever compares it to the real one. Every rename produces a silent divergence, and the checklist declares success</span></div>
</div>

<h3>The two fixes, in order</h3>
${slide('ga-10', 11, 'Copying a naive tsconfig.seed.json gives TS6059 immediately; the real one needs noEmit and rootDir "."')}
<p>The configuration shown in an earlier version of this lesson — <code>extends</code> plus <code>include: ["prisma/**/*.ts"]</code> — does not work, and the sandbox shows why (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018893376" target="_blank" rel="noopener">36018893376</a>):</p>
<div class="out">$ npx tsc -p tsconfig.seed.ngay-tho.json --noEmit
error TS6059: File '…/ch10/seed/prisma/seed.ts' is not under 'rootDir' '…/ch10/seed/src'.
  'rootDir' is expected to contain all source files.
  → rc=2</div>
<p>The child config inherits <code>rootDir: "./src"</code>, and a seed file outside it is rejected before any type is checked. That rejection is exactly why <code>prisma/**</code> went into <code>exclude</code> in the first place. The real <code>tsconfig.seed.json</code> in api-backend overrides two things: <code>"noEmit": true</code> (it never writes output, so where output would go stops mattering) and <code>"rootDir": "."</code>. With that config, and the hand-written union still present:</p>
<div class="out">$ npm run typecheck:seed
prisma/seed.ts(17,41): error TS2322: Type 'Idea' is not assignable to type '(Without&lt;ContentIdeaCreateInput, …
      Types of property 'suggestedType' are incompatible.
        Type '"VLOG" | "AFFILIATE" | "CODE" | "REVIEW" | "IDEA" | "OTHER" | null' is not assignable to type 'ContentType | null | undefined'.
          Type '"CODE"' is not assignable to type 'ContentType | null | undefined'.
  → rc=2

# sau khi import ContentType tu @prisma/client (van con 'CODE'):
prisma/seed.ts(7,34): error TS2322: Type '"CODE"' is not assignable to type 'ContentType | null'.</div>
<p>Read the two errors side by side. The first points at line 17 — the <code>create()</code> call — and makes you dig six lines deep to find the word <code>"CODE"</code>. The second points at line 7, column 34, which is the literal itself. Both fail the build; one of them tells you where to look.</p>

<h3>Running the seed: one row fails, the process exits 0</h3>
${slide('ga-10', 12, 'The seed printed a cross for one row and still exited 0 — the table ended with 2 of 3 rows')}
<p>Type checking is not running, so the sandbox also runs the old seed against the renamed enum, exactly as the deploy did:</p>
<div class="out">$ npx prisma db seed
Running seed command &#96;tsx prisma/seed.ts&#96; ...
✓ Vlog mot ngay hoc
✗ Review PR dau tien — Invalid value for argument &#96;suggestedType&#96;. Expected ContentType.
✓ Y tuong chua phan loai
seed xong: 2/3
🌱  The seed command has been executed.
  → rc=0

$ psql -c "select suggested_type, title from content_ideas"
VLOG | Vlog mot ngay hoc
     | Y tuong chua phan loai
(2 rows)</div>
<p>Three things in that output are easy to miss. The error text <code>Invalid value for argument … Expected ContentType</code> comes from <strong>Prisma Client</strong>, which validates enum values before sending SQL — Postgres never sees the query. The seed catches the error per row and carries on, so <code>prisma db seed</code> reports success and the exit code is 0. And the database ends up with two of three rows: nothing is corrupt, something is simply missing, and nobody notices unless they count. That is why api-backend&#39;s deploy only printed a warning: its seed reporter checks the exit code <em>and</em> searches the output for <code>✗</code> or <code>Error:</code>, and with <code>rc=0</code> it can only warn.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a script that logs its failures and exits 0.</strong> Catching errors per row is reasonable for a seed that should load as much as it can. But then the script must still end with a non-zero exit code when anything failed — <code>process.exitCode = 1</code> after the loop — or every caller, from <code>deploy.sh</code> to a CI step, will read it as success. This is the same shape as Lesson 10.3&#39;s checker: the information existed, printed on screen, and the exit code threw it away.</p></div>

<h3>Three layers, and the CI job that runs them</h3>
${slide('ga-10', 13, 'Three layers of fix, each stopping a different gap: one source of truth, a wider type check, and actually running the seed')}
<p>Each layer closes a different gap, so none replaces the others. Put all three in the workflow that runs on every pull request, against a real database in a service container (Chapter 7 showed how cheap a Postgres service is):</p>
<pre><code class="language-yaml">jobs:
  seed-check:
    runs-on: ubuntu-24.04
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: prod }
        ports: ['5432:5432']
        options: &gt;-
          --health-cmd "pg_isready -U postgres" --health-interval 2s --health-retries 20
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/prod
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 22 }
      - run: npm ci
      - run: npx prisma migrate deploy      # schema moi nhat, dung duong cua prod
      - run: npx tsc --noEmit                # lop cu: src/**
      - run: npm run typecheck:seed          # lop 2: prisma/** cung duoc doc
      - run: npx prisma db seed              # lop 3: CHAY that; seed hong phai thoat khac 0</code></pre>
<p>The order is deliberate: <code>migrate deploy</code> first, so the seed runs against the schema the migration history produces rather than whatever <code>db push</code> would invent (Lesson 10.5 is about why those differ). The last step only protects you if the seed exits non-zero on failure — the sandbox&#39;s fixed seed ends with <code>process.exitCode = 1</code> in a <code>catch</code>, and after correcting <code>'CODE'</code> to <code>'CODE_REVIEW'</code> it writes all three rows and exits 0.</p>

<h3>When a type check is enough — and when you must run it</h3>
<table>
<thead><tr><th>Kind of breakage</th><th>Caught by tsc?</th><th>Caught only by running</th></tr></thead>
<tbody>
<tr><td>Enum value that no longer exists, written as a literal</td><td>Yes — if the file is in the program</td><td>—</td></tr>
<tr><td>Value built at runtime (read from JSON, CSV, an API)</td><td>No — its type is <code>string</code></td><td>Prisma&#39;s runtime validation, or the database</td></tr>
<tr><td>Unique constraint violated by seed data</td><td>No</td><td>running against a database</td></tr>
<tr><td>Column length exceeded (e.g. 560 characters into <code>VARCHAR(500)</code>)</td><td>No</td><td>running against a database</td></tr>
<tr><td>Seed imports a module that no longer exists</td><td>Yes — if the file is in the program</td><td>—</td></tr>
</tbody>
</table>
<p>The pattern: the type checker sees <em>shapes</em> of code it opens; only the database sees <em>data</em>. api-backend met the fourth row again on 19 September 2026 (commit <code>543e565a</code>: a 560-character description into a 500-character column killed a seed), which is why <code>npx prisma db seed</code> is on the checklist next to <code>typecheck:seed</code> and not instead of it.</p>


<pre><code><span class="tok-comment"># 1. tsconfig.seed.json — kiem THAT seed script</span>
{ "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": true, "rootDir": "." },
  "include": ["prisma/**/*.ts", "src/**/*"],
  "exclude": ["node_modules", "dist"] }
<span class="tok-comment"># npm run typecheck:seed</span>

<span class="tok-comment"># 2. seed.ts — bo union chep tay, import tu source of truth</span>
import { ContentType } from '@prisma/client';
<span class="tok-comment"># thay: type ContentType = 'VLOG' | ... | 'CODE' | ...;</span></code></pre>

<div class="callout ok">
<p><strong>The fix is two things, and they do different jobs.</strong> An earlier version of this paragraph claimed that <code>typecheck:seed</code> alone would only type-check the false union "against itself in two places". The sandbox measured otherwise: with the hand-written union still in place, <code>npm run typecheck:seed</code> fails with <code>TS2322</code>, because the union flows into <code>prisma.contentIdea.create()</code>, and <em>that call</em> compares it with the real generated type. So the <strong>check</strong> is what closes the hole. The <strong>import</strong> does two other things: the error lands on the exact line that says <code>'CODE'</code> instead of on a 6-line type error at the call, and there is no second copy left to drift — a copy used in a <code>switch</code> or a label map would never meet a Prisma call at all. Without the check, removing the union changes nothing: the wrong value would still only fail at runtime, exactly as it did.</p>
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

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: Your type check passes but a script fails in production with an invalid enum value. How is that possible?</strong><br>A: Either the file was never part of the type-checked program — excluded in <code>tsconfig</code>, or outside <code>rootDir</code> — or the value arrived at runtime as a plain string. I check the first with <code>tsc --listFilesOnly</code>; for the second I rely on runtime validation and on actually running the script against a database in CI.</p>
<p><strong>Q: Why is a hand-written copy of an enum dangerous even if it compiles?</strong><br>A: It is a second source of truth. When the real enum changes, the copy still agrees with itself, so nothing fails where the copy is used on its own. Importing the generated type makes every rename a compile error at the exact line.</p>
<p><strong>Q: How would you test a database seed in CI?</strong><br>A: A job with a Postgres service container, <code>migrate deploy</code> to build the schema the same way production does, then run the seed and assert on the result — at minimum the exit code, better a row count. And the seed must exit non-zero if any row fails, or the job cannot see it.</p>
</div>

<div class="pitfall">
<p><strong>Trap — trusting the checklist because it exists.</strong> A pre-push checklist that passes is evidence of exactly what it says: those steps ran and did not error. It is silent about everything else. This incident&#39;s honest post-mortem is not "the checklist was wrong" but "the checklist covered the files we thought were important, and the file that broke was outside it". Adding items to the checklist is the correct response; treating an existing checklist as sufficient is not.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A checklist covers what it explicitly examines and nothing else, so a green checklist is only evidence for the files it opened — and a hand-written duplicate of a schema is a file that <em>looks</em> checked but is not being compared against anything real.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want to know which of your repository&#39;s TypeScript files your CI type check has never opened, and close the gap for the one that touches the database.</p><ol>
<li>In your project run <code>npx tsc --listFilesOnly | grep -v node_modules</code>. Compare it with <code>git ls-files '*.ts'</code> and list every tracked <code>.ts</code> file that is missing (seed scripts, one-off scripts, config files).</li>
<li>For the missing folder that touches the database, add a <code>tsconfig.seed.json</code> that <code>extends</code> your main config and sets <code>noEmit: true</code>, <code>rootDir: "."</code> and an <code>include</code> for that folder. Add <code>"typecheck:seed": "tsc -p tsconfig.seed.json"</code> to <code>package.json</code>.</li>
<li>Break it on purpose: in the seed, write an enum value that does not exist in your schema. Run <code>npm run typecheck:seed</code> and read the error line and column.</li>
<li>Undo the break. Make the seed exit non-zero on any failed row (<code>process.exitCode = 1</code>). Add a CI job with a <code>postgres:16</code> service that runs <code>migrate deploy</code>, <code>typecheck:seed</code> and the seed.</li>
</ol>
<p><strong>Done when:</strong> you have the list of files tsc skipped before and after; a screenshot of the <code>TS2322</code> line for your broken value; and one green CI run of the seed job on your repository.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Seed script (script gieo dữ liệu)</span><span class="v">A program that fills a database with starting data. It runs against real tables, so it fails on real constraints — often in the deploy, where nobody is watching.</span></div>
  <div class="kv"><span class="k"><code>rootDir</code></span><span class="v">The folder that must contain every source file when tsc emits output. A file outside it is error TS6059, which is why seeds end up excluded.</span></div>
  <div class="kv"><span class="k"><code>noEmit</code></span><span class="v">Type check only, write nothing. It frees a separate config from output rules such as <code>rootDir</code>.</span></div>
  <div class="kv"><span class="k"><code>--listFilesOnly</code></span><span class="v">tsc option that prints every file in the program and exits — the direct answer to "did the checker even open this file?"</span></div>
  <div class="kv"><span class="k">Source of truth (nguồn sự thật)</span><span class="v">The one place a fact is defined. For a Prisma enum it is <code>schema.prisma</code>, surfaced as the generated type in <code>@prisma/client</code>; a copy is a second, drifting claim.</span></div>
  <div class="kv"><span class="k">Service container</span><span class="v">A Docker container that GitHub Actions starts next to a job (<code>services:</code>), such as <code>postgres:16</code>, so tests can use a real database.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A green checklist is evidence only for the files it opened; <code>tsc --listFilesOnly</code> showed 0 files under <code>prisma/</code>.</li>
<li>Extending the main tsconfig to <code>prisma/**</code> fails with TS6059; a separate config needs <code>noEmit</code> and <code>rootDir: "."</code>.</li>
<li>Once the seed is in the program, tsc catches the stale value even through a hand-written union — at the Prisma call.</li>
<li>Importing the generated enum moves the error to the exact line and removes the copy that would drift again.</li>
<li>Type checks see code shapes; only running the seed against a database sees data problems.</li>
<li>A script that logs a failure and exits 0 is a silent failure — end with a non-zero exit code.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-08-08 seed incident</span><span class="lc-sub">the row that produced this lesson, including the <code>typecheck:seed</code> command and the explicit warning "run it to know, reading is not enough".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36018893376 — the seed incident rebuilt</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018893376 — tsc green with 0 files under prisma/, TS6059 from the naive config, TS2322 from the real one, and the seed printing ✗ with exit code 0.</span></span></div>
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
${slide('ga-10', 9, 'Hồ sơ 10.2: đổi tên một giá trị enum, qua mọi mục checklist và làm vỡ bước seed trên production')}
<p>Dòng thời gian trong kho rất ngắn. Commit <code>1da59865</code> (18:17, 08/08/2026) đổi tên giá trị như một phần của thay đổi lớn hơn cho Xưởng nội dung song ngữ. Lần deploy 18:32 in <code>Seed reported errors (rc=0)</code> ở bước Content Creator — một <em>cảnh báo</em>, không phải hỏng, vì tiến trình seed thoát 0 và script deploy chỉ bắt được chữ. Commit <code>f2f36e1f</code> lúc 18:39 vá nó, và thông điệp commit ghi rõ phép nghiệm thu: <code>typecheck:seed</code> 0 lỗi, <code>tsc --noEmit</code> 0 lỗi, <code>prisma db seed</code> chạy hết trên DB local, và bản ghi <code>CODE_REVIEW</code> được kiểm trong <code>content_ideas</code> bằng <code>psql</code>, "không chỉ đọc code".</p>
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
${slide('ga-10', 10, 'tsc xanh vì nó chưa bao giờ mở seed.ts: 1 tệp trong src/, 0 tệp trong prisma/')}
<p>Bạn không cần TIN câu "tsc chưa bao giờ mở seed" — tsc tự nói nó đã đọc những tệp nào. Sân tập dựng lại đúng bố cục của kho (<code>ch10/seed</code>: cùng <code>rootDir: "./src"</code>, cùng <code>exclude</code>, Prisma 5.22 và một service Postgres 16) rồi hỏi:</p>
<pre><code class="language-bash">$ npx tsc --noEmit
  → rc=0
$ npx tsc --listFilesOnly | grep -c '/prisma/'
0
$ npx tsc --listFilesOnly | grep -c '/src/'
1</code></pre>
<p><code>--listFilesOnly</code> in mọi tệp trong chương trình (mã của bạn cộng các tệp khai báo kiểu mà chúng kéo vào) rồi thoát. Không tệp nào dưới <code>prisma/</code> — cả sự cố gói trong một con số: một <code>tsc</code> xanh chưa bao giờ là bằng chứng gì về seed. Cùng câu hỏi ấy dùng được cho mọi cấu hình bạn sắp tin — ESLint có <code>--debug</code> để xem nó lint tệp nào, Jest có <code>--listTests</code>, còn <code>git ls-files</code> trả lời "CI có checkout tệp đó không?"</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tsconfig exclude prisma/</span><span class="lz-t">bảo vệ được</span><span class="lz-d"><code>tsconfig.json</code> chính có <code>rootDir: ./src</code>; seed nằm dưới <code>prisma/</code>. Bao gồm nó ở đó sẽ ép nhiều biên dịch không liên quan. Nên nó đi vào <code>exclude</code></span></div>
<div class="lz-step"><span class="lz-k">seed CHÉP TAY union enum</span><span class="lz-t">bảo vệ được</span><span class="lz-d">một union viết tay gõ nhanh và đọc rõ ngay cạnh dữ liệu seed, nên seed mô tả các dòng của nó bằng bản chép enum của riêng nó</span></div>
<div class="lz-step"><span class="lz-k">cộng lại</span><span class="lz-t">một checklist KHÔNG kiểm được gì về seed</span><span class="lz-d">cái union không phải cái thật, và không có phép biên dịch nào so nó với cái thật. Mọi lần đổi tên đẻ ra một sự trôi dạt ÂM THẦM, và checklist tuyên bố thành công</span></div>
</div>

<h3>Hai bản vá, theo thứ tự</h3>
${slide('ga-10', 11, 'Chép tsconfig.seed.json ngây thơ thì gặp TS6059 ngay; bản thật cần noEmit và rootDir "."')}
<p>Cấu hình trong bản cũ của bài này — <code>extends</code> cộng <code>include: ["prisma/**/*.ts"]</code> — không chạy được, và sân tập cho thấy vì sao (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018893376" target="_blank" rel="noopener">36018893376</a>):</p>
<div class="out">$ npx tsc -p tsconfig.seed.ngay-tho.json --noEmit
error TS6059: File '…/ch10/seed/prisma/seed.ts' is not under 'rootDir' '…/ch10/seed/src'.
  'rootDir' is expected to contain all source files.
  → rc=2</div>
<p>Cấu hình con thừa kế <code>rootDir: "./src"</code>, và một tệp seed nằm ngoài nó bị từ chối trước khi kiểu nào được kiểm. Chính lời từ chối ấy là lý do <code>prisma/**</code> bị đưa vào <code>exclude</code> ngay từ đầu. <code>tsconfig.seed.json</code> thật của api-backend ghi đè hai thứ: <code>"noEmit": true</code> (không bao giờ ghi output, nên output đi đâu không còn quan trọng) và <code>"rootDir": "."</code>. Với cấu hình đó, và union chép tay VẪN còn:</p>
<div class="out">$ npm run typecheck:seed
prisma/seed.ts(17,41): error TS2322: Type 'Idea' is not assignable to type '(Without&lt;ContentIdeaCreateInput, …
      Types of property 'suggestedType' are incompatible.
        Type '"VLOG" | "AFFILIATE" | "CODE" | "REVIEW" | "IDEA" | "OTHER" | null' is not assignable to type 'ContentType | null | undefined'.
          Type '"CODE"' is not assignable to type 'ContentType | null | undefined'.
  → rc=2

# sau khi import ContentType tu @prisma/client (van con 'CODE'):
prisma/seed.ts(7,34): error TS2322: Type '"CODE"' is not assignable to type 'ContentType | null'.</div>
<p>Đọc hai lỗi cạnh nhau. Lỗi thứ nhất chỉ vào dòng 17 — lời gọi <code>create()</code> — và bắt bạn đào sâu sáu dòng mới thấy chữ <code>"CODE"</code>. Lỗi thứ hai chỉ vào dòng 7, cột 34, chính là giá trị viết sai. Cả hai đều làm build hỏng; chỉ một cái nói cho bạn biết nhìn vào đâu.</p>

<h3>Chạy seed: một dòng hỏng, tiến trình vẫn thoát 0</h3>
${slide('ga-10', 12, 'Seed in dấu ✗ cho một dòng mà vẫn thoát 0 — bảng chỉ còn 2 trên 3 dòng')}
<p>Kiểm kiểu không phải là CHẠY, nên sân tập còn chạy seed cũ với enum đã đổi tên, đúng như deploy đã làm:</p>
<div class="out">$ npx prisma db seed
Running seed command &#96;tsx prisma/seed.ts&#96; ...
✓ Vlog mot ngay hoc
✗ Review PR dau tien — Invalid value for argument &#96;suggestedType&#96;. Expected ContentType.
✓ Y tuong chua phan loai
seed xong: 2/3
🌱  The seed command has been executed.
  → rc=0

$ psql -c "select suggested_type, title from content_ideas"
VLOG | Vlog mot ngay hoc
     | Y tuong chua phan loai
(2 rows)</div>
<p>Ba điều trong output ấy dễ bị bỏ sót. Câu lỗi <code>Invalid value for argument … Expected ContentType</code> đến từ <strong>Prisma Client</strong>, thứ kiểm giá trị enum TRƯỚC khi gửi SQL — Postgres không hề thấy câu truy vấn. Seed bắt lỗi từng dòng rồi đi tiếp, nên <code>prisma db seed</code> báo thành công và mã thoát là 0. Và CSDL kết thúc với hai trên ba dòng: không gì hỏng, chỉ là THIẾU, và không ai thấy nếu không đếm. Đó là lý do deploy của api-backend chỉ in cảnh báo: bộ báo seed của nó xem mã thoát VÀ dò output tìm <code>✗</code> hay <code>Error:</code>, mà với <code>rc=0</code> thì nó chỉ cảnh báo được thôi.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — script ghi lại lỗi rồi thoát 0.</strong> Bắt lỗi từng dòng là hợp lý với một seed nên nạp được càng nhiều càng tốt. Nhưng khi đó script vẫn PHẢI kết thúc bằng mã thoát khác 0 nếu có gì hỏng — <code>process.exitCode = 1</code> sau vòng lặp — bằng không mọi nơi gọi nó, từ <code>deploy.sh</code> tới một bước CI, đều đọc thành thành công. Đây cùng hình dạng với bộ kiểm ở bài 10.3: thông tin CÓ tồn tại, in ngay trên màn hình, và mã thoát đã vứt nó đi.</p></div>

<h3>Ba lớp vá, và job CI chạy cả ba</h3>
${slide('ga-10', 13, 'Ba lớp vá, mỗi lớp chặn một chỗ hở khác: một nguồn sự thật, vùng kiểm kiểu rộng hơn, và chạy seed thật')}
<p>Mỗi lớp bịt một chỗ hở khác, nên không lớp nào thay được lớp nào. Đặt cả ba vào workflow chạy ở mọi pull request, với một CSDL thật trong service container (Chương 7 đã cho thấy một service Postgres rẻ thế nào):</p>
<pre><code class="language-yaml">jobs:
  seed-check:
    runs-on: ubuntu-24.04
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: prod }
        ports: ['5432:5432']
        options: &gt;-
          --health-cmd "pg_isready -U postgres" --health-interval 2s --health-retries 20
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/prod
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 22 }
      - run: npm ci
      - run: npx prisma migrate deploy      # schema moi nhat, dung duong cua prod
      - run: npx tsc --noEmit                # lop cu: src/**
      - run: npm run typecheck:seed          # lop 2: prisma/** cung duoc doc
      - run: npx prisma db seed              # lop 3: CHAY that; seed hong phai thoat khac 0</code></pre>
<p>Thứ tự là có chủ ý: <code>migrate deploy</code> trước, để seed chạy trên schema mà lịch sử migration tạo ra chứ không phải thứ <code>db push</code> tự nghĩ ra (bài 10.5 nói vì sao hai thứ đó khác nhau). Bước cuối chỉ bảo vệ bạn nếu seed thoát khác 0 khi hỏng — seed đã vá của sân tập kết thúc bằng <code>process.exitCode = 1</code> trong <code>catch</code>, và sau khi sửa <code>'CODE'</code> thành <code>'CODE_REVIEW'</code> nó ghi đủ ba dòng và thoát 0.</p>

<h3>Khi nào kiểm kiểu là đủ — khi nào PHẢI chạy thật</h3>
<table>
<thead><tr><th>Kiểu hỏng</th><th>tsc bắt được?</th><th>Chỉ chạy thật mới bắt được</th></tr></thead>
<tbody>
<tr><td>Giá trị enum không còn tồn tại, viết thành chữ trong mã</td><td>Có — nếu tệp nằm trong chương trình</td><td>—</td></tr>
<tr><td>Giá trị dựng lúc chạy (đọc từ JSON, CSV, API)</td><td>Không — kiểu của nó là <code>string</code></td><td>kiểm tra lúc chạy của Prisma, hoặc CSDL</td></tr>
<tr><td>Dữ liệu seed vi phạm ràng buộc unique</td><td>Không</td><td>chạy trên một CSDL</td></tr>
<tr><td>Vượt độ dài cột (vd 560 ký tự vào <code>VARCHAR(500)</code>)</td><td>Không</td><td>chạy trên một CSDL</td></tr>
<tr><td>Seed import một module không còn tồn tại</td><td>Có — nếu tệp nằm trong chương trình</td><td>—</td></tr>
</tbody>
</table>
<p>Khuôn chung: bộ kiểm kiểu thấy <em>hình dạng</em> của mã mà nó mở; chỉ CSDL thấy <em>dữ liệu</em>. api-backend gặp lại đúng dòng thứ tư ngày 19/09/2026 (commit <code>543e565a</code>: một mô tả 560 ký tự vào cột 500 ký tự làm chết seed), và đó là lý do <code>npx prisma db seed</code> nằm trong checklist CẠNH <code>typecheck:seed</code> chứ không thay cho nó.</p>


<pre><code><span class="tok-comment"># 1. tsconfig.seed.json — kiem THAT seed script</span>
{ "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": true, "rootDir": "." },
  "include": ["prisma/**/*.ts", "src/**/*"],
  "exclude": ["node_modules", "dist"] }
<span class="tok-comment"># npm run typecheck:seed</span>

<span class="tok-comment"># 2. seed.ts — bo union chep tay, import tu source of truth</span>
import { ContentType } from '@prisma/client';
<span class="tok-comment"># thay: type ContentType = 'VLOG' | ... | 'CODE' | ...;</span></code></pre>

<div class="callout ok">
<p><strong>Bản vá là HAI thứ, và chúng làm hai việc khác nhau.</strong> Bản cũ của đoạn này nói rằng chỉ thêm <code>typecheck:seed</code> thì cái union SAI chỉ "được typecheck với chính nó ở hai chỗ". Sân tập đo ra điều ngược lại: union chép tay vẫn còn đó mà <code>npm run typecheck:seed</code> vẫn hỏng với <code>TS2322</code>, vì union chảy vào <code>prisma.contentIdea.create()</code>, và CHÍNH lời gọi đó so nó với kiểu thật được sinh ra. Vậy <strong>phép kiểm</strong> mới là thứ bịt cái lỗ. Còn <strong>câu import</strong> làm hai việc khác: lỗi rơi đúng vào dòng có chữ <code>'CODE'</code> thay vì một lỗi kiểu dài 6 dòng ở chỗ gọi, và không còn bản chép thứ hai để trôi dạt — một bản chép dùng trong <code>switch</code> hay bảng nhãn sẽ không bao giờ gặp lời gọi Prisma nào. Không có phép kiểm thì gỡ union cũng chẳng đổi gì: giá trị sai vẫn chỉ hỏng lúc chạy, y như đã xảy ra.</p>
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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Kiểm kiểu qua hết nhưng một script hỏng trên production vì giá trị enum không hợp lệ. Sao có thể thế?</strong><br>Đ: Hoặc tệp đó chưa từng nằm trong chương trình được kiểm — bị exclude trong <code>tsconfig</code>, hoặc nằm ngoài <code>rootDir</code> — hoặc giá trị tới lúc chạy dưới dạng chuỗi thường. Cái đầu tôi kiểm bằng <code>tsc --listFilesOnly</code>; cái sau tôi dựa vào kiểm tra lúc chạy và vào việc CHẠY script trên một CSDL trong CI.</p>
<p><strong>H: Vì sao bản chép tay của một enum nguy hiểm dù nó biên dịch được?</strong><br>Đ: Nó là nguồn sự thật thứ hai. Khi enum thật đổi, bản chép vẫn đồng ý với chính nó, nên không gì hỏng ở những chỗ bản chép được dùng riêng. Import kiểu được sinh ra biến mọi lần đổi tên thành một lỗi biên dịch ở ĐÚNG dòng.</p>
<p><strong>H: Bạn kiểm một seed CSDL trong CI thế nào?</strong><br>Đ: Một job có service container Postgres, <code>migrate deploy</code> để dựng schema giống cách production dựng, rồi chạy seed và kiểm kết quả — tối thiểu là mã thoát, tốt hơn là đếm dòng. Và seed phải thoát khác 0 nếu có dòng nào hỏng, không thì job không thể thấy.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — TIN checklist vì nó tồn tại.</strong> Một pre-push checklist qua là bằng chứng cho ĐÚNG thứ nó nói: các bước ấy đã chạy và không lỗi. Nó IM LẶNG về mọi thứ khác. Post-mortem trung thực của sự cố này KHÔNG phải "checklist sai" mà là "checklist phủ các tệp CHÚNG TA NGHĨ là quan trọng, và tệp VỠ nằm NGOÀI nó". THÊM MỤC vào checklist là đáp trả đúng; coi một checklist đã có là ĐỦ thì không.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một checklist phủ CÁI NÓ TƯỜNG MINH SOI và không gì khác, nên một checklist XANH chỉ là bằng chứng cho các tệp nó ĐÃ MỞ — và một bản chép TAY của một schema là một tệp <em>TRÔNG</em> được kiểm nhưng KHÔNG được so với thứ gì THẬT.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn biết những tệp TypeScript nào trong kho của mình mà bước kiểm kiểu trên CI chưa từng mở, và bịt chỗ hở cho tệp đụng tới CSDL.</p><ol>
<li>Trong dự án chạy <code>npx tsc --listFilesOnly | grep -v node_modules</code>. So với <code>git ls-files '*.ts'</code> và liệt kê mọi tệp <code>.ts</code> được theo dõi mà bị thiếu (script seed, script chạy một lần, tệp cấu hình).</li>
<li>Với thư mục thiếu có đụng tới CSDL, thêm <code>tsconfig.seed.json</code> <code>extends</code> cấu hình chính và đặt <code>noEmit: true</code>, <code>rootDir: "."</code>, cùng một <code>include</code> cho thư mục đó. Thêm <code>"typecheck:seed": "tsc -p tsconfig.seed.json"</code> vào <code>package.json</code>.</li>
<li>Làm hỏng có chủ ý: trong seed, viết một giá trị enum không có trong schema. Chạy <code>npm run typecheck:seed</code> và đọc dòng, cột của lỗi.</li>
<li>Hoàn tác chỗ hỏng. Cho seed thoát khác 0 khi có dòng nào hỏng (<code>process.exitCode = 1</code>). Thêm một job CI có service <code>postgres:16</code> chạy <code>migrate deploy</code>, <code>typecheck:seed</code> và seed.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có danh sách tệp tsc bỏ qua trước và sau; ảnh chụp dòng <code>TS2322</code> cho giá trị sai của bạn; và một run CI xanh của job seed trên kho của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Seed script (script gieo dữ liệu)</span><span class="v">Chương trình đổ dữ liệu khởi đầu vào CSDL. Nó chạy trên bảng thật nên hỏng vì ràng buộc thật — thường là trong lúc deploy, khi không ai đang nhìn.</span></div>
  <div class="kv"><span class="k"><code>rootDir</code></span><span class="v">Thư mục phải chứa mọi tệp nguồn khi tsc ghi output. Tệp nằm ngoài là lỗi TS6059 — lý do seed hay bị exclude.</span></div>
  <div class="kv"><span class="k"><code>noEmit</code></span><span class="v">Chỉ kiểm kiểu, không ghi gì. Nó giải phóng một cấu hình riêng khỏi các luật về output như <code>rootDir</code>.</span></div>
  <div class="kv"><span class="k"><code>--listFilesOnly</code></span><span class="v">Tuỳ chọn tsc in mọi tệp trong chương trình rồi thoát — câu trả lời thẳng cho "bộ kiểm có mở tệp này không?"</span></div>
  <div class="kv"><span class="k">Source of truth (nguồn sự thật)</span><span class="v">Nơi DUY NHẤT định nghĩa một sự thật. Với enum Prisma đó là <code>schema.prisma</code>, lộ ra thành kiểu sinh sẵn trong <code>@prisma/client</code>; bản chép là lời khẳng định thứ hai, sẽ trôi dạt.</span></div>
  <div class="kv"><span class="k">Service container</span><span class="v">Container Docker mà GitHub Actions khởi động cạnh một job (<code>services:</code>), như <code>postgres:16</code>, để test dùng được CSDL thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checklist xanh chỉ là bằng chứng cho những tệp nó đã mở; <code>tsc --listFilesOnly</code> cho thấy 0 tệp trong <code>prisma/</code>.</li>
<li>Mở rộng tsconfig chính sang <code>prisma/**</code> sẽ gặp TS6059; cấu hình riêng cần <code>noEmit</code> và <code>rootDir: "."</code>.</li>
<li>Một khi seed nằm trong chương trình, tsc bắt được giá trị cũ kể cả qua union chép tay — ở lời gọi Prisma.</li>
<li>Import enum sinh sẵn đưa lỗi về đúng dòng và xoá bản chép sẽ lại trôi dạt.</li>
<li>Kiểm kiểu thấy hình dạng mã; chỉ chạy seed trên CSDL mới thấy lỗi dữ liệu.</li>
<li>Script in lỗi rồi thoát 0 là một cú hỏng câm — hãy kết thúc bằng mã thoát khác 0.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố seed 2026-08-08</span><span class="lc-sub">dòng đẻ ra bài này, gồm cả câu lệnh <code>typecheck:seed</code> và cảnh báo tường minh "chạy thật mới biết, đọc không ra".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36018893376 — dựng lại sự cố seed</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018893376 — tsc xanh với 0 tệp trong prisma/, TS6059 từ cấu hình ngây thơ, TS2322 từ cấu hình thật, và seed in ✗ mà mã thoát 0.</span></span></div>
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
<p class="lead">A check that cannot fail is worse than no check, because it looks like a check. CLAUDE.md records the 2026-07-30 incident where the frontend smoke test in <code>deploy.sh</code> called <code>wget</code> inside a container that has neither <code>wget</code> nor <code>curl</code> installed — and did so for seven weeks, from 11 June to 30 July, before anybody noticed.</p>

<h3>What the deploy did</h3>
${slide('ga-10', 14, 'Case file 10.3: a frontend check with no symptoms at all — just 25 silent seconds on every deploy for seven weeks')}
<p>The history is in two commits. <code>ea0126ce</code> (11 June 2026, "3-stage frontend build, resource limits") introduced the check. <code>0fd0c0c6</code> (30 July 2026) replaced it, and left a comment in <code>deploy.sh</code> that is the best one-paragraph post-mortem in the repository: the frontend image deliberately does not install <code>wget</code> — the compose healthcheck uses Node&#39;s <code>http</code> module, so the install step was removed — "which means the command always failed, the loop turned the full 6 times and then silently went on: every deploy lost ~25 seconds and did NOT check whether the frontend was alive or dead."</p>
<div class="out">deploy.sh (11/06 → 30/07/2026), chot kiem frontend:
  for i in $(seq 1 6); do
      if docker exec cuonghoangdev_frontend \\
             sh -c "wget -qO- http://localhost:3000/ &gt;/dev/null 2&gt;&amp;1"; then
          ok "Frontend healthy"
          break
      fi
      [ "$i" -lt 6 ] &amp;&amp; sleep 5
  done
  # (khong co dong nao sau vong lap)

Ket qua:
  wget khong co trong anh  → dieu kien cua if sai ca 6 lan (loi bi 2&gt;&amp;1 nuot)
  vong lap chay du 6 lan   → ~25 giay moi deploy
  KHONG in "healthy", cung KHONG in loi nao
  deploy di tiep sang buoc 4b — du frontend song hay chet</div>

<div class="callout warn">
<p><strong>The check ran, failed, and did not fail the deploy.</strong> The loop was written as "try six times, stop at the first success" — and it had no line for the case where all six tries fail. The failing command sat inside an <code>if</code> condition with its output sent to <code>/dev/null</code>, so each failure was silent, and when the loop ran out the script simply went on to the next step. Every deploy passed the check by never reaching a verdict. (An earlier version of this lesson described this as an <code>|| sleep 5</code> and said the check printed "check failed"; the real code in <code>git show ea0126ce</code> has neither — it printed nothing at all.) The Dockerfile deliberately excluded <code>wget</code> and <code>curl</code> because the compose healthcheck used Node&#39;s <code>http</code> module. Nobody who wrote the check knew that.</p>
</div>

<h3>Rebuilding it: 25 seconds, and a green step</h3>
${slide('ga-10', 15, 'The retry loop runs dry in silence: 25 seconds, no verdict, and the step is still green — set -e does not help')}
<p>The sandbox copies the old block line for line into <code>ch10/bo-kiem/kiem-cu.sh</code>, including <code>set -euo pipefail</code> at the top as in <code>deploy.sh</code>, and runs it against a healthy "frontend" built from <code>node:22-slim</code>, the same base family as the real image (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018697476" target="_blank" rel="noopener">36018697476</a>):</p>
<div class="out">$ docker exec ch10-web-song sh -c 'for t in wget curl node; do command -v $t || echo "$t (KHONG CO)"; done'
wget  (KHONG CO)
curl  (KHONG CO)
node  /usr/local/bin/node

Checking frontend...
→ sang buoc 4b
rc=0 · mat 25 giay</div>
<p>Twenty-five seconds, exit code 0, and not one line saying either "healthy" or "failed". The frontend in this run was <em>alive</em> — the check could not see that either. It is worth understanding why <code>set -e</code>, which is supposed to stop the script at the first failing command, did nothing:</p>
<div class="kv-grid">
<div class="kv"><span class="k">a command inside <code>if</code></span><span class="v">bash never exits on a command whose status is being tested — that is the point of testing it. The failing <code>docker exec … wget</code> is the condition, so errexit is suspended for it</span></div>
<div class="kv"><span class="k">the left side of <code>&amp;&amp;</code></span><span class="v"><code>[ "$i" -lt 6 ] &amp;&amp; sleep 5</code> returns 1 on the sixth pass, but a failure anywhere except the last command of an <code>&amp;&amp;</code> list is exempt too</span></div>
<div class="kv"><span class="k">no verdict after the loop</span><span class="v">nothing tested a variable like <code>frontend_ok</code> after <code>done</code>. With no line that can fail, <code>set -e</code> has nothing to stop on</span></div>
</div>
<p>The fix in <code>0fd0c0c6</code> addresses all three. It swaps <code>wget</code> for <code>node -e</code> (the image always has Node), records success in a flag, and ends with an explicit verdict. It also carries a comment about the opposite trap, which is worth copying verbatim into your own scripts: it must be an <code>if</code>, not <code>[ … ] &amp;&amp; fail …</code>, because under <code>set -e</code> an <code>&amp;&amp;</code> list whose left side is false returns non-zero and would kill the deploy <em>exactly when the frontend is healthy</em>.</p>
<pre><code class="language-bash">frontend_ok=false
for i in $(seq 1 6); do
    if docker exec cuonghoangdev_frontend node -e '
const req = require("http").get({ host: "127.0.0.1", port: 3000, path: "/" }, (res) =&gt; {
    process.exit(res.statusCode &gt;= 200 &amp;&amp; res.statusCode &lt; 500 ? 0 : 1)
})
req.on("error", () =&gt; process.exit(1))
req.setTimeout(10000, () =&gt; { req.destroy(); process.exit(1) })
' &gt;/dev/null 2&gt;&amp;1; then
        ok "Frontend healthy"; frontend_ok=true; break
    fi
    [ "$i" -lt 6 ] &amp;&amp; sleep 5
done
if [ "$frontend_ok" = false ]; then
    fail "Frontend không phản hồi sau 6 lần thử — xem 'docker logs cuonghoangdev_frontend'"
fi</code></pre>

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

<h3>Checking the checker: four checkers, three scenarios</h3>
${slide('ga-10', 16, 'Four checkers run through three scenarios: a trustworthy checker is green on the healthy column and red on both broken ones')}
<p>"Break the thing and watch the check go red" is easy to say and easy to skip, so the sandbox turns it into a script. <code>kiem-bo-kiem.sh</code> starts three containers — one healthy, one that answers every request with 500, one that has been stopped — and runs four checkers through all three. A checker earns trust only if it is green on the first and red on the other two:</p>
<pre><code class="language-bash">for bk in kiem-cu kiem-moi smoke-404 smoke-danh-sach-trang; do
  for kb in song loi500 chet; do
    mong=do; [ "$kb" = song ] &amp;&amp; mong=xanh
    t0=$SECONDS
    if ./$bk.sh "ch10-web-$kb" &gt;/dev/null 2&gt;&amp;1; then that=xanh; else that=do; fi
    dt=$((SECONDS - t0))
    if [ "$that" = "$mong" ]; then kl="ok"; else kl="SAI — bo kiem khong tin duoc"; loi=1; fi
    printf '%-26s %-10s %-8s %-8s %s (%ss)\\n' "$bk" "$kb" "$mong" "$that" "$kl" "$dt"
  done
done
exit $loi</code></pre>
<div class="out">bo kiem                    kich ban   mong     that     ket luan
kiem-cu                    song       xanh     xanh     ok (25s)
kiem-cu                    loi500     do       xanh     SAI — bo kiem khong tin duoc (26s)
kiem-cu                    chet       do       xanh     SAI — bo kiem khong tin duoc (25s)
kiem-moi                   song       xanh     xanh     ok (0s)
kiem-moi                   loi500     do       do       ok (5s)
kiem-moi                   chet       do       do       ok (5s)
smoke-404                  song       xanh     xanh     ok (6s)
smoke-404                  loi500     do       xanh     SAI — bo kiem khong tin duoc (7s)
smoke-404                  chet       do       xanh     SAI — bo kiem khong tin duoc (0s)
smoke-danh-sach-trang      song       xanh     xanh     ok (6s)
smoke-danh-sach-trang      loi500     do       do       ok (6s)
smoke-danh-sach-trang      chet       do       do       ok (0s)</div>
<p>The old wget check is green in all three columns — healthy, broken, dead — which is the precise meaning of "a check that measures nothing". The meta-test job itself exits 1, and that red run is the useful artefact: it is a permanent, re-runnable proof of which checkers can be trusted. Put a job like it next to any deploy script you care about, and re-run it whenever the checker changes.</p>

<h3>The route smoke test from 10.1 has the same hole</h3>
${slide('ga-10', 17, '"Only 404 is broken" lets both a 500 page and a dead container through; a whitelist of 200, 401 and 403 does not')}
<p>Row three of that table is the checker from Lesson 10.1: the <code>deploy.sh</code> logic "if the code is 404, fail; otherwise say mounted". It is a <em>blacklist</em> — it names the one bad answer it expects. Anything else passes, including answers nobody thought about:</p>
<div class="out"># loi 500 — route vo ben trong:
✓ /api/v1/gifs mounted (HTTP 500)
# container da dung — docker exec that bai, bien code rong:
✓ /api/v1/gifs mounted (HTTP )</div>
<p>The fix is to invert the list and name the answers that mean healthy:</p>
<pre><code class="language-bash">case "$code" in
  200|401|403) echo "✓ /api/v1/gifs mounted (HTTP &#36;{code})" ;;
  *) echo "✗ /api/v1/gifs → '&#36;{code:-rong}' (khong phai 200/401/403)"; exit 1 ;;
esac</code></pre>
<p>In the real <code>deploy.sh</code> the "dead container" case is caught earlier by the backend health wait, so only the 500 case slips through in practice. That is still a real gap: a route that throws on every request because a column is missing (the Lesson 10.5 kind of failure) would be reported as "mounted". A whitelist closes it for free. The general rule: <strong>list what healthy looks like, not what broken looks like</strong> — there are always more ways to be broken than you have listed (000, empty, 502 from nginx, a redirect to a login page).</p>

<h3>Five rules for a checker you can trust</h3>
<ol>
<li><strong>Every path ends in a verdict.</strong> After any retry loop, test a flag and <code>exit 1</code>. A loop that can run dry without saying so is not a check.</li>
<li><strong>Whitelist healthy answers.</strong> 200/401/403 for a route, an exact string for a version endpoint, a row count for a seed.</li>
<li><strong>Depend only on what the target is guaranteed to have.</strong> The frontend image always has <code>node</code>; it never promised <code>wget</code>. Check the tool exists (<code>command -v</code>) or use the runtime itself.</li>
<li><strong>Print one line on success too.</strong> "Frontend healthy" in the log is how you notice the day it stops appearing.</li>
<li><strong>Keep a meta-test.</strong> A job that runs the checker through at least one broken scenario, and fails if the checker stays green.</li>
</ol>

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

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: How do you know a health check or smoke test in your pipeline actually works?</strong><br>A: I make it fail on purpose. I run it against a broken target — a stopped container, an endpoint that returns 500, an image missing a route — and confirm the step goes red. Ideally that is automated as a small meta-test job, so the proof is re-run whenever the checker changes.</p>
<p><strong>Q: Your deploy script uses <code>set -euo pipefail</code>. Can a failing command still be ignored?</strong><br>A: Yes. Commands inside an <code>if</code> or <code>while</code> condition, on the left of <code>&amp;&amp;</code> or <code>||</code>, or negated with <code>!</code> do not trigger errexit. A retry loop whose command sits in an <code>if</code> needs an explicit verdict after the loop, or a total failure passes silently.</p>
<p><strong>Q: Blacklist or whitelist for status codes in a smoke test?</strong><br>A: Whitelist. A blacklist of 404 lets 500, 502 and "no response at all" through. Listing 200/401/403 as healthy turns every unexpected answer into a failure, which is what you want right after a deploy.</p>
</div>

<div class="pitfall">
<p><strong>Trap — the check whose failure means "flake, ignore".</strong> A smoke test that intermittently fails will be ignored the first time and disabled the second — a noisy check is ignored the first time it goes red and deleted the second. That is a rational response to noise, and it is also how a real regression eventually reaches production. If a check is noisy, fix the noise or delete the check; leaving it in place with instructions to ignore it is the worst option.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A check that never fails is not a check, so verify every check by breaking the thing it checks and watching it turn red — and if it will not turn red, the check is decoration and the reader who trusts it is the second victim of the same silent failure.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your project has at least one check you have never seen fail — a health check, a smoke test, a "wait until ready" loop. You will prove, one way or the other, whether it can.</p><ol>
<li>Find one such check in your scripts or workflows. Write down the exact command and what it considers "healthy".</li>
<li>Start three targets: healthy; broken (return 500 — for a Node app a one-line <code>http.createServer((q,s)=&gt;{s.writeHead(500);s.end()})</code> is enough); and dead (<code>docker stop</code> the container, or no process on the port).</li>
<li>Run the check against each and record the exit code (<code>echo $?</code>) and the time it took.</li>
<li>If any broken scenario came back 0, fix the check: a verdict after every loop, a whitelist of healthy answers, and a tool the target is guaranteed to have. Run all three again.</li>
</ol>
<p><strong>Done when:</strong> you have a 3-row table for your check before and after the fix, and the "after" table reads 0 / non-zero / non-zero.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Checker (bộ kiểm)</span><span class="v">Any script whose job is to say "ok" or "not ok" about something else — a health check, smoke test, linter, or verification step.</span></div>
  <div class="kv"><span class="k">Meta-test (kiểm bộ kiểm)</span><span class="v">A test of the checker itself: run it against known-broken targets and require it to fail.</span></div>
  <div class="kv"><span class="k">errexit (<code>set -e</code>)</span><span class="v">Bash option to stop at the first failing command — except inside conditions, on the left of <code>&amp;&amp;</code>/<code>||</code>, and after <code>!</code>.</span></div>
  <div class="kv"><span class="k">Whitelist / blacklist (danh sách trắng / đen)</span><span class="v">Naming the answers that are allowed versus the answers that are forbidden. For checks, whitelists fail closed; blacklists fail open.</span></div>
  <div class="kv"><span class="k">Verdict (phán quyết)</span><span class="v">The final line of a check that decides pass or fail — an <code>exit 1</code> after testing a flag. Without it, a loop can end in silence.</span></div>
  <div class="kv"><span class="k">Minimal image (ảnh tối giản)</span><span class="v">A container image without debugging tools such as curl and wget. Checks against it must use what the runtime provides — <code>node -e</code> here.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The wget check ran for seven weeks, cost ~25 s per deploy, and could not report anything — healthy, broken or dead.</li>
<li><code>set -e</code> does not stop failures inside <code>if</code> conditions or on the left of <code>&amp;&amp;</code>; a retry loop needs an explicit verdict.</li>
<li>Four checkers × three scenarios: only the ones red on both broken columns deserve trust.</li>
<li>"Only 404 is broken" also passes 500 and an empty answer; whitelist 200/401/403 instead.</li>
<li>A check must depend only on tools the target is guaranteed to have.</li>
<li>Keep the proof: a meta-test job that fails if the checker stays green against a broken target.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-30 wget-not-installed incident</span><span class="lc-sub">the row that produced this lesson, including the specific note that the frontend container uses Node&#39;s http module for its own healthcheck.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36018697476 — the old check, the new check, and the meta-test</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018697476 — 25 silent seconds from the wget loop, and the 4 × 3 table of checkers against healthy, 500 and dead targets.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow commands: setting a job as failing</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the specific commands that fail a step loudly, which is what a check must do to be evidence.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring distributed systems: alerting</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — the industry version of the rule above: a check whose absence is not measured is a check that failed silently at some point in the past.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke tests, and the checker check</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the specific smoke test this repository now uses, and how each check was verified against a deliberately broken deploy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — minimal images and the tools they lack</span><span class="lc-sub">/courses/docker/learn${REF} — why production containers omit debug tools, and the pattern for health probes that work with only what is present.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Cái smoke test không phát khói được</h2>
<p class="lead">Một phép kiểm KHÔNG THỂ hỏng còn TỆ HƠN không có phép kiểm nào, bởi nó TRÔNG như một phép kiểm. CLAUDE.md ghi lại sự cố 2026-07-30 nơi smoke test frontend trong <code>deploy.sh</code> gọi <code>wget</code> bên trong một container KHÔNG cài <code>wget</code> lẫn <code>curl</code> — và làm thế suốt bảy tuần, từ 11/06 tới 30/07, trước khi ai nhận ra.</p>

<h3>Deploy đã làm gì</h3>
${slide('ga-10', 14, 'Hồ sơ 10.3: một chốt kiểm frontend không có triệu chứng nào — chỉ 25 giây im lặng mỗi lần deploy, suốt bảy tuần')}
<p>Lịch sử nằm trong hai commit. <code>ea0126ce</code> (11/06/2026, "3-stage frontend build, resource limits") đưa chốt kiểm vào. <code>0fd0c0c6</code> (30/07/2026) thay nó, và để lại trong <code>deploy.sh</code> một ghi chú là bản hồi cứu một đoạn hay nhất của cả kho: image frontend CỐ Ý không cài <code>wget</code> — healthcheck của compose dùng module <code>http</code> của node nên bước cài đã bị bỏ — "nghĩa là lệnh luôn thất bại, vòng lặp quay đủ 6 lần rồi âm thầm đi tiếp: mỗi lần deploy mất không ~25 giây và KHÔNG hề kiểm được frontend sống hay chết."</p>
<div class="out">deploy.sh (11/06 → 30/07/2026), chot kiem frontend:
  for i in $(seq 1 6); do
      if docker exec cuonghoangdev_frontend \\
             sh -c "wget -qO- http://localhost:3000/ &gt;/dev/null 2&gt;&amp;1"; then
          ok "Frontend healthy"
          break
      fi
      [ "$i" -lt 6 ] &amp;&amp; sleep 5
  done
  # (khong co dong nao sau vong lap)

Ket qua:
  wget khong co trong anh  → dieu kien cua if sai ca 6 lan (loi bi 2&gt;&amp;1 nuot)
  vong lap chay du 6 lan   → ~25 giay moi deploy
  KHONG in "healthy", cung KHONG in loi nao
  deploy di tiep sang buoc 4b — du frontend song hay chet</div>

<div class="callout warn">
<p><strong>Phép kiểm CÓ chạy, CÓ hỏng, và KHÔNG làm hỏng deploy.</strong> Vòng lặp được viết theo kiểu "thử sáu lần, dừng ở lần thành công đầu tiên" — và KHÔNG có dòng nào cho trường hợp cả sáu lần đều hỏng. Lệnh hỏng nằm trong điều kiện của <code>if</code>, output bị đẩy vào <code>/dev/null</code>, nên mỗi lần hỏng đều im lặng, và khi vòng lặp cạn thì script cứ thế sang bước kế. Mọi cuộc deploy QUA phép kiểm vì phép kiểm không bao giờ đi tới một phán quyết. (Bản cũ của bài mô tả chỗ này là một <code>|| sleep 5</code> và nói phép kiểm in "check failed"; mã thật trong <code>git show ea0126ce</code> không có cả hai — nó không in gì hết.) Dockerfile CỐ Ý bỏ <code>wget</code> và <code>curl</code> vì healthcheck của compose dùng module <code>http</code> của Node. Không ai viết phép kiểm biết chuyện đó.</p>
</div>

<h3>Dựng lại: 25 giây, và một bước xanh</h3>
${slide('ga-10', 15, 'Vòng thử cạn trong im lặng: 25 giây, không phán quyết, bước vẫn xanh — set -e không cứu được')}
<p>Sân tập chép khối cũ từng dòng vào <code>ch10/bo-kiem/kiem-cu.sh</code>, kể cả <code>set -euo pipefail</code> ở đầu như <code>deploy.sh</code>, rồi chạy nó với một "frontend" KHOẺ dựng từ <code>node:22-slim</code>, cùng họ ảnh nền với ảnh thật (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018697476" target="_blank" rel="noopener">36018697476</a>):</p>
<div class="out">$ docker exec ch10-web-song sh -c 'for t in wget curl node; do command -v $t || echo "$t (KHONG CO)"; done'
wget  (KHONG CO)
curl  (KHONG CO)
node  /usr/local/bin/node

Checking frontend...
→ sang buoc 4b
rc=0 · mat 25 giay</div>
<p>Hai mươi lăm giây, mã thoát 0, và không một dòng nào nói "healthy" hay "hỏng". Frontend trong run này ĐANG SỐNG — phép kiểm cũng không thấy được điều đó. Đáng hiểu vì sao <code>set -e</code>, thứ lẽ ra dừng script ở lệnh hỏng đầu tiên, không làm gì cả:</p>
<div class="kv-grid">
<div class="kv"><span class="k">lệnh nằm trong <code>if</code></span><span class="v">bash không bao giờ thoát vì một lệnh mà trạng thái của nó đang được KIỂM — kiểm nó chính là mục đích. <code>docker exec … wget</code> hỏng chính là điều kiện, nên errexit tạm ngưng với nó</span></div>
<div class="kv"><span class="k">vế trái của <code>&amp;&amp;</code></span><span class="v"><code>[ "$i" -lt 6 ] &amp;&amp; sleep 5</code> trả 1 ở vòng thứ sáu, nhưng hỏng ở bất kỳ đâu trừ lệnh CUỐI của danh sách <code>&amp;&amp;</code> cũng được miễn</span></div>
<div class="kv"><span class="k">không có phán quyết sau vòng lặp</span><span class="v">không gì kiểm một biến kiểu <code>frontend_ok</code> sau <code>done</code>. Không có dòng nào có thể hỏng thì <code>set -e</code> chẳng có gì để dừng</span></div>
</div>
<p>Bản vá trong <code>0fd0c0c6</code> xử lý cả ba. Nó đổi <code>wget</code> sang <code>node -e</code> (ảnh luôn có Node), ghi lần thành công vào một cờ, và kết thúc bằng một phán quyết tường minh. Nó còn mang một ghi chú về cái bẫy NGƯỢC LẠI, đáng chép nguyên văn vào script của bạn: phải là <code>if</code>, không dùng <code>[ … ] &amp;&amp; fail …</code>, vì dưới <code>set -e</code> một danh sách <code>&amp;&amp;</code> có vế trái sai sẽ trả mã khác 0 và giết deploy <em>ĐÚNG LÚC frontend khoẻ mạnh</em>.</p>
<pre><code class="language-bash">frontend_ok=false
for i in $(seq 1 6); do
    if docker exec cuonghoangdev_frontend node -e '
const req = require("http").get({ host: "127.0.0.1", port: 3000, path: "/" }, (res) =&gt; {
    process.exit(res.statusCode &gt;= 200 &amp;&amp; res.statusCode &lt; 500 ? 0 : 1)
})
req.on("error", () =&gt; process.exit(1))
req.setTimeout(10000, () =&gt; { req.destroy(); process.exit(1) })
' &gt;/dev/null 2&gt;&amp;1; then
        ok "Frontend healthy"; frontend_ok=true; break
    fi
    [ "$i" -lt 6 ] &amp;&amp; sleep 5
done
if [ "$frontend_ok" = false ]; then
    fail "Frontend không phản hồi sau 6 lần thử — xem 'docker logs cuonghoangdev_frontend'"
fi</code></pre>

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

<h3>Kiểm bộ kiểm: bốn bộ kiểm, ba kịch bản</h3>
${slide('ga-10', 16, 'Bốn bộ kiểm qua ba kịch bản: bộ kiểm đáng tin phải xanh ở cột khoẻ và đỏ ở cả hai cột hỏng')}
<p>"Làm hỏng thứ đó rồi xem phép kiểm chuyển đỏ" thì dễ nói và dễ bỏ qua, nên sân tập biến nó thành một script. <code>kiem-bo-kiem.sh</code> khởi động ba container — một khoẻ, một trả 500 cho mọi yêu cầu, một đã bị dừng — rồi cho bốn bộ kiểm chạy qua cả ba. Một bộ kiểm chỉ đáng tin khi nó xanh ở cái đầu và đỏ ở hai cái sau:</p>
<pre><code class="language-bash">for bk in kiem-cu kiem-moi smoke-404 smoke-danh-sach-trang; do
  for kb in song loi500 chet; do
    mong=do; [ "$kb" = song ] &amp;&amp; mong=xanh
    t0=$SECONDS
    if ./$bk.sh "ch10-web-$kb" &gt;/dev/null 2&gt;&amp;1; then that=xanh; else that=do; fi
    dt=$((SECONDS - t0))
    if [ "$that" = "$mong" ]; then kl="ok"; else kl="SAI — bo kiem khong tin duoc"; loi=1; fi
    printf '%-26s %-10s %-8s %-8s %s (%ss)\\n' "$bk" "$kb" "$mong" "$that" "$kl" "$dt"
  done
done
exit $loi</code></pre>
<div class="out">bo kiem                    kich ban   mong     that     ket luan
kiem-cu                    song       xanh     xanh     ok (25s)
kiem-cu                    loi500     do       xanh     SAI — bo kiem khong tin duoc (26s)
kiem-cu                    chet       do       xanh     SAI — bo kiem khong tin duoc (25s)
kiem-moi                   song       xanh     xanh     ok (0s)
kiem-moi                   loi500     do       do       ok (5s)
kiem-moi                   chet       do       do       ok (5s)
smoke-404                  song       xanh     xanh     ok (6s)
smoke-404                  loi500     do       xanh     SAI — bo kiem khong tin duoc (7s)
smoke-404                  chet       do       xanh     SAI — bo kiem khong tin duoc (0s)
smoke-danh-sach-trang      song       xanh     xanh     ok (6s)
smoke-danh-sach-trang      loi500     do       do       ok (6s)
smoke-danh-sach-trang      chet       do       do       ok (0s)</div>
<p>Chốt wget cũ xanh ở cả ba cột — khoẻ, hỏng, chết — đó là nghĩa CHÍNH XÁC của "một phép kiểm không đo gì". Bản thân job kiểm bộ kiểm thoát 1, và chính run đỏ đó là thứ có ích: nó là bằng chứng vĩnh viễn, chạy lại được, về bộ kiểm nào tin được. Đặt một job như thế cạnh bất kỳ script deploy nào bạn quan tâm, và chạy lại mỗi khi bộ kiểm thay đổi.</p>

<h3>Smoke-test theo route ở bài 10.1 có cùng cái lỗ</h3>
${slide('ga-10', 17, '"Chỉ 404 là hỏng" cho qua cả trang 500 lẫn container chết; danh sách trắng 200, 401, 403 thì không')}
<p>Hàng ba của bảng trên là bộ kiểm của bài 10.1: logic <code>deploy.sh</code> "mã là 404 thì hỏng; còn lại thì báo đã mount". Nó là một <em>danh sách đen</em> — nó gọi tên MỘT câu trả lời xấu mà nó chờ. Mọi thứ khác đều qua, kể cả những câu trả lời không ai nghĩ tới:</p>
<div class="out"># loi 500 — route vo ben trong:
✓ /api/v1/gifs mounted (HTTP 500)
# container da dung — docker exec that bai, bien code rong:
✓ /api/v1/gifs mounted (HTTP )</div>
<p>Cách vá là lật ngược danh sách và gọi tên những câu trả lời nghĩa là KHOẺ:</p>
<pre><code class="language-bash">case "$code" in
  200|401|403) echo "✓ /api/v1/gifs mounted (HTTP &#36;{code})" ;;
  *) echo "✗ /api/v1/gifs → '&#36;{code:-rong}' (khong phai 200/401/403)"; exit 1 ;;
esac</code></pre>
<p>Trong <code>deploy.sh</code> thật, ca "container chết" bị vòng chờ backend bắt sớm hơn, nên trên thực tế chỉ ca 500 lọt qua. Đó vẫn là một chỗ hở thật: một route ném lỗi ở mọi yêu cầu vì thiếu một cột (kiểu hỏng của bài 10.5) sẽ được báo là "mounted". Danh sách trắng bịt nó mà không tốn gì. Luật chung: <strong>liệt kê hình dạng của KHOẺ, đừng liệt kê hình dạng của HỎNG</strong> — cách để hỏng luôn nhiều hơn những gì bạn đã liệt kê (000, rỗng, 502 của nginx, một cú chuyển hướng tới trang đăng nhập).</p>

<h3>Năm luật cho một bộ kiểm tin được</h3>
<ol>
<li><strong>Mọi nhánh đều kết thúc bằng phán quyết.</strong> Sau mọi vòng thử lại, kiểm một cờ và <code>exit 1</code>. Vòng lặp có thể cạn mà không nói gì thì không phải phép kiểm.</li>
<li><strong>Danh sách trắng cho câu trả lời khoẻ.</strong> 200/401/403 cho route, một chuỗi chính xác cho endpoint phiên bản, một số dòng cho seed.</li>
<li><strong>Chỉ dựa vào thứ đích chắc chắn có.</strong> Ảnh frontend luôn có <code>node</code>; nó chưa bao giờ hứa có <code>wget</code>. Kiểm công cụ tồn tại (<code>command -v</code>) hoặc dùng chính runtime.</li>
<li><strong>Khi thành công cũng in một dòng.</strong> "Frontend healthy" trong log là cách bạn nhận ra ngày nó thôi xuất hiện.</li>
<li><strong>Giữ một phép kiểm bộ kiểm.</strong> Một job cho bộ kiểm đi qua ít nhất một kịch bản hỏng, và hỏng nếu bộ kiểm vẫn xanh.</li>
</ol>

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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao bạn biết health check hay smoke-test trong pipeline thật sự chạy đúng?</strong><br>Đ: Tôi làm nó hỏng có chủ ý. Tôi chạy nó với một đích hỏng — container đã dừng, endpoint trả 500, image thiếu route — và xác nhận bước chuyển đỏ. Tốt nhất là tự động hoá thành một job kiểm bộ kiểm nhỏ, để bằng chứng được chạy lại mỗi khi bộ kiểm đổi.</p>
<p><strong>H: Script deploy của bạn có <code>set -euo pipefail</code>. Một lệnh hỏng vẫn có thể bị lờ đi không?</strong><br>Đ: Có. Lệnh nằm trong điều kiện <code>if</code> hay <code>while</code>, ở vế trái của <code>&amp;&amp;</code> hay <code>||</code>, hoặc bị phủ định bằng <code>!</code> đều không kích hoạt errexit. Vòng thử lại có lệnh nằm trong <code>if</code> cần một phán quyết tường minh sau vòng lặp, bằng không một cú hỏng toàn phần sẽ qua trong im lặng.</p>
<p><strong>H: Danh sách đen hay danh sách trắng cho mã trạng thái trong smoke-test?</strong><br>Đ: Danh sách trắng. Danh sách đen chỉ có 404 sẽ cho 500, 502 và "không trả lời gì" đi qua. Liệt kê 200/401/403 là khoẻ biến mọi câu trả lời bất ngờ thành hỏng — đúng điều bạn muốn ngay sau một lần deploy.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — phép kiểm mà hỏng nghĩa là "flake, bỏ qua".</strong> Một smoke test hỏng chập chờn sẽ bị BỎ QUA lần đầu và TẮT lần thứ hai — một phép kiểm ồn bị lờ đi lần đầu nó đỏ và bị xoá lần thứ hai. Đó là đáp trả hợp lý với tiếng ồn, và cũng là cách một cú THOÁI LUI THẬT rốt cuộc tới production. Nếu một phép kiểm ồn, hãy vá cái ồn hoặc XOÁ phép kiểm; để nó tại chỗ với chỉ dẫn bỏ qua là lựa chọn TỆ NHẤT.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một phép kiểm không bao giờ hỏng KHÔNG PHẢI phép kiểm, nên hãy KIỂM CHỨNG mọi phép kiểm bằng cách LÀM HỎNG thứ nó kiểm và XEM nó chuyển đỏ — và nếu nó không chịu chuyển đỏ, phép kiểm là ĐỒ TRANG TRÍ và người đọc TIN nó là NẠN NHÂN THỨ HAI của cùng một cú hỏng âm thầm.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> dự án của bạn có ít nhất một phép kiểm bạn chưa từng thấy hỏng — một health check, một smoke-test, một vòng "chờ tới khi sẵn sàng". Bạn sẽ chứng minh, theo hướng này hay hướng kia, liệu nó có biết hỏng không.</p><ol>
<li>Tìm một phép kiểm như thế trong script hoặc workflow của bạn. Ghi lại lệnh chính xác và thứ nó coi là "khoẻ".</li>
<li>Dựng ba đích: khoẻ; hỏng (trả 500 — với app Node chỉ cần một dòng <code>http.createServer((q,s)=&gt;{s.writeHead(500);s.end()})</code>); và chết (<code>docker stop</code> container, hoặc không tiến trình nào nghe cổng).</li>
<li>Chạy phép kiểm với từng đích và ghi mã thoát (<code>echo $?</code>) cùng thời gian nó chạy.</li>
<li>Nếu kịch bản hỏng nào trả về 0, sửa phép kiểm: một phán quyết sau mọi vòng lặp, danh sách trắng cho câu trả lời khoẻ, và một công cụ đích chắc chắn có. Chạy lại cả ba.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng 3 hàng cho phép kiểm của mình trước và sau khi sửa, và bảng "sau" ghi 0 / khác 0 / khác 0.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Checker (bộ kiểm)</span><span class="v">Bất kỳ script nào có việc là nói "ổn" hay "không ổn" về một thứ khác — health check, smoke-test, linter, bước nghiệm thu.</span></div>
  <div class="kv"><span class="k">Meta-test (kiểm bộ kiểm)</span><span class="v">Phép kiểm dành cho chính bộ kiểm: chạy nó với những đích đã biết là hỏng và đòi nó phải hỏng.</span></div>
  <div class="kv"><span class="k">errexit (<code>set -e</code>)</span><span class="v">Tuỳ chọn bash dừng ở lệnh hỏng đầu tiên — trừ khi lệnh nằm trong điều kiện, ở vế trái của <code>&amp;&amp;</code>/<code>||</code>, hay sau <code>!</code>.</span></div>
  <div class="kv"><span class="k">Whitelist / blacklist (danh sách trắng / đen)</span><span class="v">Gọi tên câu trả lời được phép so với câu trả lời bị cấm. Với phép kiểm, danh sách trắng hỏng về phía đóng; danh sách đen hỏng về phía mở.</span></div>
  <div class="kv"><span class="k">Verdict (phán quyết)</span><span class="v">Dòng cuối của phép kiểm quyết định qua hay hỏng — một <code>exit 1</code> sau khi kiểm cờ. Không có nó, vòng lặp có thể kết thúc trong im lặng.</span></div>
  <div class="kv"><span class="k">Minimal image (ảnh tối giản)</span><span class="v">Ảnh container không có công cụ gỡ lỗi như curl, wget. Phép kiểm với nó phải dùng thứ runtime cung cấp — ở đây là <code>node -e</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chốt wget chạy bảy tuần, tốn ~25 giây mỗi deploy, và không thể báo gì — khoẻ, hỏng hay chết.</li>
<li><code>set -e</code> không dừng lệnh hỏng trong điều kiện <code>if</code> hay ở vế trái <code>&amp;&amp;</code>; vòng thử lại cần phán quyết tường minh.</li>
<li>Bốn bộ kiểm × ba kịch bản: chỉ bộ nào đỏ ở cả hai cột hỏng mới đáng tin.</li>
<li>"Chỉ 404 là hỏng" cũng cho qua 500 và câu trả lời rỗng; hãy dùng danh sách trắng 200/401/403.</li>
<li>Phép kiểm chỉ được dựa vào công cụ mà đích chắc chắn có.</li>
<li>Giữ lại bằng chứng: một job kiểm bộ kiểm hỏng nếu bộ kiểm vẫn xanh trước một đích hỏng.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố wget-không-cài 2026-07-30</span><span class="lc-sub">dòng đẻ ra bài này, gồm cả ghi chú cụ thể rằng container frontend dùng module http của Node cho healthcheck của chính nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36018697476 — chốt cũ, chốt mới và phép kiểm bộ kiểm</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018697476 — 25 giây im lặng của vòng wget, và bảng 4 × 3 bộ kiểm trước đích khoẻ, 500 và chết.</span></span></div>
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
${slide('ga-10', 18, 'Case file 10.4: the 3D playground stuck on its loading screen, no error anywhere, and a kill that did not kill')}
<div class="out">30/07/2026:
  /playground = trang HTML tinh, spinner quay mai
  Network:  200 OK cho HTML, 200 OK cho .ktx preload
  Console:  khong loi
  Server:   khong loi
Nghi ngo dau tien:    goi JS vua bat lai minify (commit 0fd0c0c6:
                      "hoa ra ... khong phai minify")
Thoi gian mat:        hai phien lam viec (CLAUDE.md)
</div>

<p>The false lead was fed by <strong>200 OK</strong>. The HTML answered 200 and the one preload the Network tab made obvious — a <code>.ktx</code> texture, whose name is fixed in the source — answered 200 as well. The request that mattered was the playground&#39;s JavaScript bundle, whose file name carries a content hash: the rebuild had given it a new name, and the running server answered that new name with <em>404</em>. With no JavaScript running, the loading screen — plain HTML and CSS — simply stayed, and there was no script left to report anything. (An earlier version of this lesson listed two other wrong guesses and "~90 minutes"; neither is in the record. What the record has is the commit that fixed it, noting that the stall "turned out not to be minify".)</p>

<h3>What Next.js actually does with <code>public/</code></h3>
${slide('ga-10', 19, 'The file is on disk and the server still answers 404 — the same on all six combinations of Next version and start mode')}
<p>The mechanism, as CLAUDE.md records it and as the sandbox measured on Next 14.2.35 (the version the frontend runs) and 15.5.26, is one sentence: <em>Next.js reads the file list of <code>public/</code> once, at server startup, and answers requests from that snapshot for the rest of the server's lifetime</em>. Files added to <code>public/</code> after startup are on disk but not on the map — they return <strong>404</strong>. This is the same shape as the stale-build symptom in lesson 10.1, and yields to the same <code>curl</code> test:</p>

<pre><code class="language-bash"># next build xong, public/cu.txt co tu truoc; server da chay tren cong 19101
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:19101/cu.txt
200
$ echo "tep MOI, ghi sau khi server da chay" &gt; public/moi.txt
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:19101/moi.txt
404
$ ls -la public/moi.txt | awk '{print "tren dia:", $5, "byte", $NF}'
tren dia: 36 byte public/moi.txt
</code></pre>

<div class="out">File CO tren dia (36 byte).  Server tra 404.
Ket luan:  server dang tra loi tu MOT DANH SACH FILE cu, khong tu dia.
Bien phap:  KHOI DONG LAI Next.
</div>

<p>That diagnostic is worth memorising. Any time a static asset returns 404 while <code>ls</code> shows it exists, the process serving it is holding a snapshot from before the file was created. For <code>next start</code> and the standalone <code>server.js</code> the trigger is anything that adds or renames a file in <code>public/</code> after start-up — and a rebuilt playground bundle with a new content hash is exactly that. The sandbox measured the same 404 on all six combinations it tried. (An earlier version of this lesson said nginx behaves the same way with a <code>root</code> or <code>alias</code>; it does not — nginx looks at the disk on each request unless you enable <code>open_file_cache</code>.)</p>

<h3>The second trap: killing a process by its name</h3>
${slide('ga-10', 20, 'next-server renames itself: pkill -f "next start" matches nothing, or matches only the npm wrapper and reports success')}
<p>Restarting is one line — unless the kill misses. CLAUDE.md notes that both <code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> silently matched nothing. To see why, measure what Node actually calls the process:</p>

<pre><code class="language-bash">$ npm start &amp;          # "start": "next start -p 19101"
$ ps -eo pid,ppid,comm,args | awk 'NR==1 || /next|npm start/'
</code></pre>

<div class="out">    PID    PPID COMMAND         COMMAND
   2477    2284 npm start       npm start
   2491    2477 sh              sh -c next start -p 19101
   2492    2491 next-server (v1 next-server (v14.2.35)

# chay THANG ./node_modules/.bin/next start -p 19101 (khong qua npm):
   2256    2063 next-server (v1 next-server (v14.2.35)     ← MOT tien trinh duy nhat
</div>

<p>The process that holds the port is the one named <strong><code>next-server (v14.2.35)</code></strong>, in both columns: Next sets <code>process.title</code>, and on Linux that overwrites the whole command line that <code>ps</code> and <code>pkill -f</code> read. Neither <code>next start</code> nor <code>standalone/server.js</code> appears anywhere in the server&#39;s own entry. That gives two different failures depending on how you started it. Run directly, there is <em>one</em> process and nothing matches: <code>pkill -f "next start"</code> exits 1 and kills nothing. Run through <code>npm start</code>, the pattern matches the <code>sh -c next start …</code> wrapper that npm created: pkill kills the wrapper, exits <strong>0</strong>, and the real server is re-parented to PID 1 and keeps the port. (An earlier version of this lesson showed a <code>node … next start</code> launcher with a separate child; the sandbox found no such process on Next 14.2.35 or 15.5.26.)</p>

<div class="callout warn">
<p><strong>The failure mode.</strong> A restart script that runs <code>pkill</code> and then <code>npm start</code> sees the new process crash immediately with <code>EADDRINUSE: address already in use :::3000</code>. Read backwards: the crash is the <em>new</em> server dying because the <em>old</em> server, which the kill was supposed to hit, is still there. Whether the kill "succeeded" depends on the launcher: started directly, <code>pkill</code> matched nothing and returned 1 — which a script with <code>|| true</code> hides; started through <code>npm start</code>, it matched the <code>sh</code> wrapper and returned 0 — which nothing can hide, because it looks exactly like success.</p>
</div>

<h3>The rule that survives</h3>
<p>Kill by the invariant of what you actually want to release. For a network daemon that invariant is a <strong>port</strong>, not a name. The one line CLAUDE.md records — measured on the course&#39;s Mac, and <em>not</em> reliable everywhere, as the next section shows:</p>

<pre><code class="language-bash">$ lsof -ti:3000 | xargs -r kill -9
</code></pre>

<p><code>lsof -ti:3000</code> prints the PIDs of every process currently listening on port 3000 — one PID per line, no header. <code>xargs -r</code> refuses to run <code>kill</code> when no PIDs came through, so the command is safe to run when nothing is listening. <code>kill -9</code> is deliberately blunt: a <code>next-server</code> that ignored SIGTERM will not ignore SIGKILL. This is one of the few places where <code>-9</code> is the right first choice — a listening daemon that will not release its socket is exactly the case the signal was designed for.</p>

<h3>Measuring the rule against the wrong tools</h3>
<div class="out">$ npm start &amp;                               # server 1 (next 14.2.35)
$ pgrep -af "next start"
2491 sh -c next start -p 19101               ← chi khop LOP VO sh
$ pkill -f "next start"; echo "pkill rc=$?"
pkill rc=0                                   ← "thanh cong"
$ sleep 3; ss -ltnpH "sport = :19101"        # ai con giu cong?
… users:(("next-server (v1",pid=2492,fd=21))
   2492       1 next-server (v1 next-server (v14.2.35)   ← cha gio la PID 1
$ npm start                                  # khoi dong lai ngay
Error: listen EADDRINUSE: address already in use :::19101
moi.txt luc nay: HTTP 404                    ← van la server CU tra loi
</div>

<div class="out">$ fuser -k 19101/tcp                         # diet theo CONG (Linux)
$ ss -ltnpH "sport = :19101"                 # hau dieu kien: KHONG AI
$ npm start
server 3 len: pid=2614 (khac 2492)
moi.txt sau khi khoi dong lai: HTTP 200
</div>

<p>Two blocks, one measurement each, and the exit code of the wrong one is the punchline: it lies. Through <code>npm start</code>, <code>pkill -f "next start"</code> returned zero, <em>and</em> left the actual server alive, <em>and</em> then blocked the next start with a port collision — while the old server kept answering <code>moi.txt</code> with 404, so the symptom looked untouched. Every layer reported success.</p>

<h3>The one line that did not work on the runner</h3>
${slide('ga-10', 21, 'Kill by port — then ask again whether the port is free: lsof saw nothing on the Linux runner, ss and fuser did')}
<p>The sandbox ran the CLAUDE.md line on GitHub&#39;s <code>ubuntu-24.04</code> runner, in all six jobs of run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018797092" target="_blank" rel="noopener">36018797092</a>, and asked several tools the same question — who holds port 19101?</p>
<div class="out">lsof la: /usr/bin/lsof ·     revision: 4.95.0
lsof -ti:19101 (user runner): '' rc=1
lsof -nP -iTCP:19101 -sTCP:LISTEN:                       (trong)
sudo lsof -ti:19101: ''
ss -ltnpH sport = :19101 → pid=2256
fuser 19101/tcp → '  2256'
sau 'lsof -ti:19101 | xargs -r kill -9': ss con thay pid=2256
sau 'fuser -k 19101/tcp': ss con thay KHONG AI
server 3 len: pid=2352
moi.txt sau khi khoi dong lai: HTTP 200</div>
<p>On that runner, <code>lsof</code> — even with <code>sudo</code>, even asked about the process by PID — did not see the Next server&#39;s socket, while <code>sudo lsof -nP -i</code> still listed system sockets, such as port 22 held by systemd. So <code>lsof -ti:19101</code> printed nothing, <code>xargs -r</code> correctly declined to run <code>kill</code> with no arguments, and the whole line exited as if the job were done. <code>ss</code> and <code>fuser</code> saw PID 2256 straight away, and <code>fuser -k</code> freed the port. On the course&#39;s M1 Mac the lsof line works exactly as CLAUDE.md says. Why lsof is blind to the job&#39;s processes on the runner was not established; what matters is the lesson it forces: <strong>the kill command&#39;s exit code is not the post-condition</strong>. The post-condition is a second tool, asked afterwards, reporting that nobody holds the port.</p>
<table>
<thead><tr><th>Platform</th><th>Who holds the port?</th><th>Kill by port</th></tr></thead>
<tbody>
<tr><td>Linux (VPS, runner, WSL)</td><td><code>ss -ltnp "sport = :3000"</code></td><td><code>fuser -k 3000/tcp</code></td></tr>
<tr><td>macOS</td><td><code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code></td><td><code>lsof -ti:3000 | xargs -r kill -9</code></td></tr>
<tr><td>Windows (teammate)</td><td><code>netstat -ano | findstr :3000</code></td><td><code>taskkill /PID &lt;pid&gt; /F</code></td></tr>
</tbody>
</table>
<p>The Windows row is given for completeness and was not run in this chapter.</p>

<h3>A restart with post-conditions</h3>
${slide('ga-10', 22, 'A restart procedure with two post-conditions: nobody on the port, then the new file answers 200')}
<pre><code class="language-bash">#!/usr/bin/env bash
# restart-next.sh — khoi dong lai Next theo CONG, co hau dieu kien
set -euo pipefail
PORT=&#36;{1:-3000}
holder() { ss -ltnpH "sport = :$PORT" | grep -o 'pid=[0-9]*' | cut -d= -f2 || true; }
old=$(holder); echo "cu: &#36;{old:-khong ai}"
[ -n "$old" ] &amp;&amp; fuser -k "$PORT/tcp" || true
for i in $(seq 1 10); do [ -z "$(holder)" ] &amp;&amp; break; sleep 0.5; done
if [ -n "$(holder)" ]; then echo "cong $PORT van bi giu: $(holder)"; exit 1; fi
nohup npm start &gt; next.log 2&gt;&amp;1 &amp;
for i in $(seq 1 30); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" &amp;&amp; break; sleep 0.5; done
new=$(holder); echo "moi: &#36;{new:-KHONG LEN}"
if [ -z "$new" ] || [ "$new" = "$old" ]; then echo "server khong doi"; exit 1; fi</code></pre>
<p>Every step checks the thing it claims. The PID is read from <code>ss</code>, not from the kill; the loop waits until <em>nobody</em> holds the port and fails loudly if someone still does; and the script only calls it a restart if a <em>different</em> PID now owns the port. Add your own last line for the symptom itself — for the playground, fetch the hashed bundle and require 200.</p>
<div class="out"># run 36021370393 · next 14.2.35 · npm-start · buoc (6)
moi2.txt truoc: HTTP 404
cu: 2442
19101/tcp:            2442          ← fuser in PID no vua diet
moi: 2487
restart-next rc=0
moi2.txt sau: HTTP 200
--- chay lai khi KHONG ai giu cong ---
cu: khong ai
moi: 2536
restart-next rc=0</div>
<p>Run on the runner in the sandbox (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021370393" target="_blank" rel="noopener">36021370393</a>), the script took the file added after start-up from 404 to 200 and reported a new PID, and it also behaved when nobody held the port. Both matter: a restart script is run in a hurry, often when the server is already dead.</p>

<h3>What <code>deploy.sh</code> checks now</h3>
<p>The same commit that fixed the wget check (Lesson 10.3) added step 4c to <code>deploy.sh</code>: after the containers are up, it fetches <code>/playground/</code>, reads the name of the hashed JavaScript bundle out of the HTML, and fetches <em>that</em> file too. It exists because this failure mode is invisible to every other check: the build succeeds, the container is healthy, every API route is mounted — and the page still never loads. A check for a static site has to request the files the page will request, by the names the page will use. It also follows redirects — Next answers <code>/playground/</code> with a 308 to <code>/playground</code>, and the comment in <code>deploy.sh</code> records that the first version of the check treated that 308 as a failure and would have failed every deploy.</p>

<h3>Why production does not have this bug</h3>
<p>Production is spared because its restart mechanism is <em>replace the container</em>, not <em>kill the process</em>. In <code>frontend/Dockerfile</code>, <code>COPY . .</code> happens <strong>before</strong> <code>next build</code>, so every deploy produces a fresh image with the new <code>public/</code> baked in and the new bundle names known at startup. The old container is destroyed by <code>docker compose up -d</code>, which releases its port as a side effect of removing the process namespace it lived in. No <code>pkill</code>, no name matching, no orphan child inheriting a socket.</p>

<div class="callout ok">
<p><strong>The generalisation.</strong> When you can, replace processes instead of restarting them. Containers, systemd units with <code>Restart=always</code>, PM2 in <code>graceful-reload</code> mode — all avoid the kill-by-name trap because the manager tracks the process by an identifier the manager itself assigned, not by a name Node might rewrite. Kill-by-port is the fallback for interactive dev, not the primary mechanism for prod.</p>
</div>

<h3>Why the diagnosis took two sessions</h3>
<p>The retrospective is worth extracting because it is the same shape as most of the incidents in this chapter. The evidence pattern was:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">what was visible</span><span class="lz-d">Loading spinner. Network tab: 200 OK for HTML and for the one preload (a <code>.ktx</code> file, whose name is fixed in source and therefore did not change across rebuilds).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">what was invisible</span><span class="lz-d">The JavaScript bundle. Its name carries a content hash, so the rebuild renamed it; the running server answered the new name with 404, no JavaScript ran, and the loading screen — plain HTML and CSS — had nothing that could report an error.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">why the first fix seemed to work</span><span class="lz-d">The same work had just switched minification back on (6.52 MB → 4.86 MB), so the bundle itself was the natural suspect. The fixing commit records the answer: the stall "turned out not to be minify".</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">the disproof</span><span class="lz-d">One <code>curl -sI</code> to the failing URL returned 404. The server was the liar, not the browser. Everything else fell out of that.</span></div>
</div>

<p>The pattern to internalise: <strong>when a symptom survives all the client-side fixes you can think of, the server is the last place you looked and it will be the answer</strong>. The 404-with-file-on-disk from lesson 10.1 and the spinner-with-200s here are the same bug wearing different clothes.</p>

<h3>The one-line runbook</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">any static asset returns 404</span><span class="lz-lnote">check the disk with <code>ls</code>. If it is there, restart the server that serves it. Do not investigate further before that step.</span></div>
<div class="lz-layer"><span class="lz-lname">restarting a daemon that binds a port</span><span class="lz-lnote">kill by port (<code>fuser -k PORT/tcp</code> on Linux, <code>lsof -ti:PORT | xargs -r kill -9</code> on macOS), confirm the port is free with a second tool, then start the new one. Never <code>pkill -f</code> a Node process — Node renames itself.</span></div>
<div class="lz-layer"><span class="lz-lname">writing a restart script</span><span class="lz-lnote">the script is not done until you have watched it kill an old server, seen the new one start on the same port, and verified the port count went 1 → 0 → 1. If the middle step was 1 → 1 → 1, the kill did not work.</span></div>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: You restart a Node server and the new one fails with EADDRINUSE. What happened, and how do you restart reliably?</strong><br>A: The old process is still listening — the kill missed it. Killing by name is fragile because Node processes can rename themselves (Next shows up as <code>next-server (vX)</code>), and a wrapper like <code>npm start</code> can be killed while its child survives. I kill by port instead — <code>fuser -k PORT/tcp</code> on Linux — and then confirm with <code>ss</code> that nobody holds the port before starting the new process.</p>
<p><strong>Q: A static file exists on the server&#39;s disk but the app returns 404 for it. What do you suspect?</strong><br>A: That the serving process built its list of files at start-up and has not been restarted since the file appeared — Next.js does this with <code>public/</code>. I restart it and re-request the file. In production this is why each deploy should start a new container from a new image rather than copy files into a running one.</p>
<p><strong>Q: Why does production not suffer from this even though development does?</strong><br>A: Because production does not restart processes, it replaces containers. The image is built with the files already in <code>public/</code>, the new container starts with the new list, and the old container — with its port — disappears when it is removed.</p>
</div>

<div class="pitfall">
<p><strong>Trap — assume the exit code is the truth.</strong> <code>pkill -f "next start"</code> returning zero means <em>at least one process was matched and signalled</em>, not <em>the process I wanted is gone</em>. The correct post-condition is <code>lsof -ti:PORT</code> printing nothing. A test that does not check its post-condition is not a test — same rule as the smoke test in lesson 10.3.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A process's name is a label the process can rewrite, so a kill script that matches on the name will silently miss a process that renamed itself — kill by the invariant of what you actually want to release, which for a network daemon is the <em>port</em>, and verify with a second tool (<code>ss</code> on Linux, <code>lsof</code> on macOS) that the port is free before starting the replacement.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want to see, on your own machine, both halves of the playground incident — a file on disk that the server will not serve, and a kill that does not kill — and leave with a restart script you trust.</p><ol>
<li>In a scratch folder: <code>npm init -y &amp;&amp; npm i next@14 react@18 react-dom@18</code>, add <code>pages/index.js</code>, set <code>"start": "next start -p 3100"</code>, then <code>npx next build</code>.</li>
<li><code>npm start &amp;</code>. Create <code>public/moi.txt</code> and request it with <code>curl -s -o /dev/null -w "%{http_code}\\n" localhost:3100/moi.txt</code>. Write down the code.</li>
<li>Show the process tree (<code>ps -eo pid,ppid,comm,args | grep -E "next|npm"</code> on Linux; <code>ps -o pid,ppid,command</code> on macOS). Run <code>pkill -f "next start"; echo $?</code>, then ask who holds port 3100.</li>
<li>Kill by port with the command for your platform, confirm the port is free with a second tool, start again, and request <code>moi.txt</code>.</li>
</ol>
<p><strong>Done when:</strong> your note has the 404 before the restart and the 200 after; the exit code of <code>pkill</code> and whether the server survived it; and the old and new PID on port 3100, which must differ.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>process.title</code></span><span class="v">The name a Node process gives itself. Next sets it to <code>next-server (vX)</code>; on Linux that replaces the command line that <code>ps</code> and <code>pkill -f</code> read.</span></div>
  <div class="kv"><span class="k">Orphan process (tiến trình mồ côi)</span><span class="v">A child whose parent died. It is re-parented to PID 1 and keeps running — and keeps its port.</span></div>
  <div class="kv"><span class="k"><code>EADDRINUSE</code></span><span class="v">"Address already in use": the new server cannot listen because another process holds the port. Almost always the old server you thought you killed.</span></div>
  <div class="kv"><span class="k">Post-condition (hậu điều kiện)</span><span class="v">What must be true after a command, checked independently — "nobody holds port 3000" — as opposed to the command&#39;s own exit code.</span></div>
  <div class="kv"><span class="k"><code>ss</code> / <code>fuser</code></span><span class="v">Linux tools that show which process holds a socket (<code>ss -ltnp</code>) and kill it by port (<code>fuser -k 3000/tcp</code>).</span></div>
  <div class="kv"><span class="k">Content hash (mã băm nội dung)</span><span class="v">A fingerprint of a file&#39;s content placed in its name, e.g. <code>bundle.3fa9c1.js</code>. Every rebuild with changes produces a new name — which a server that listed files at start-up does not know.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Next.js lists <code>public/</code> once at start-up: a file added later is on disk and still 404 until the server restarts.</li>
<li>A static asset that is 404 while <code>ls</code> shows it means "restart the server first, investigate second".</li>
<li>Next renames itself to <code>next-server (vX)</code>: <code>pkill -f "next start"</code> kills nothing (rc=1), or only the npm wrapper (rc=0) and orphans the server.</li>
<li>Kill by port — <code>fuser -k</code> on Linux, <code>lsof -ti | xargs kill</code> on macOS — and confirm with a second tool.</li>
<li>On the Linux runner <code>lsof -ti:PORT</code> saw nothing; the command exited cleanly and killed nothing.</li>
<li>Production avoids the whole class by replacing containers instead of restarting processes.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — 2026-07-30 Playground incident</span><span class="lc-sub">the raw record: two sessions of failed diagnosis, and the specific note that <code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> both silently miss because Node renames the process to <code>next-server</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36018797092 — public/ snapshot, pkill and kill-by-port</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018797092 — Next 14.2.35 and 15.5.26 × next start, npm start and standalone: the 404, the process trees, pkill exit codes, and lsof versus ss and fuser.</span></span></div>
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
${slide('ga-10', 18, 'Hồ sơ 10.4: sân chơi 3D kẹt ở màn hình tải, không lỗi ở đâu cả, và một cú diệt không diệt được gì')}
<div class="out">30/07/2026:
  /playground = trang HTML tinh, spinner quay mai
  Network:  200 OK cho HTML, 200 OK cho .ktx preload
  Console:  khong loi
  Server:   khong loi
Nghi ngo dau tien:    goi JS vua bat lai minify (commit 0fd0c0c6:
                      "hoa ra ... khong phai minify")
Thoi gian mat:        hai phien lam viec (CLAUDE.md)
</div>

<p>Lối mòn sai được nuôi bởi <strong>200 OK</strong>. HTML trả 200, và cái preload dễ thấy nhất trong tab Network — một texture <code>.ktx</code> có tên cố định trong mã nguồn — cũng trả 200. Yêu cầu quan trọng là gói JavaScript của sân chơi, mà tên tệp mang mã băm nội dung: lần dựng lại đã đặt cho nó một tên MỚI, và server đang chạy trả tên mới ấy bằng <em>404</em>. Không có JavaScript nào chạy, màn hình tải — HTML và CSS thuần — cứ thế đứng yên, và không còn script nào để báo lỗi gì. (Bản cũ của bài liệt kê thêm hai phỏng đoán sai và "~90 phút"; cả hai đều không có trong hồ sơ. Hồ sơ chỉ có commit đã vá nó, ghi rằng cú kẹt "hoá ra không phải do minify".)</p>

<h3>Next.js thật sự làm gì với <code>public/</code></h3>
${slide('ga-10', 19, 'Tệp có trên đĩa mà server vẫn trả 404 — như nhau ở cả sáu tổ hợp phiên bản Next và cách khởi động')}
<p>Cơ chế, như CLAUDE.md ghi và như sân tập đo được trên Next 14.2.35 (bản frontend đang chạy) và 15.5.26, gói vào một câu: <em>Next.js đọc danh sách file của <code>public/</code> một lần, lúc SERVER KHỞI ĐỘNG, và trả lời yêu cầu từ ảnh chụp đó cho toàn bộ thời gian sống của server</em>. File được thêm vào <code>public/</code> sau khi khởi động có trên đĩa nhưng không có trên bản đồ — chúng trả <strong>404</strong>. Đây cùng hình dạng với triệu chứng bản-dựng-cũ ở bài 10.1, và chịu cùng phép kiểm bằng <code>curl</code>:</p>

<pre><code class="language-bash"># next build xong, public/cu.txt co tu truoc; server da chay tren cong 19101
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:19101/cu.txt
200
$ echo "tep MOI, ghi sau khi server da chay" &gt; public/moi.txt
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:19101/moi.txt
404
$ ls -la public/moi.txt | awk '{print "tren dia:", $5, "byte", $NF}'
tren dia: 36 byte public/moi.txt
</code></pre>

<div class="out">File CO tren dia (36 byte).  Server tra 404.
Ket luan:  server dang tra loi tu MOT DANH SACH FILE cu, khong tu dia.
Bien phap:  KHOI DONG LAI Next.
</div>

<p>Phép chẩn đoán ấy đáng thuộc lòng. Bất cứ khi nào một tài sản tĩnh trả 404 trong khi <code>ls</code> thấy nó tồn tại, tiến trình đang phục vụ nó đang giữ một ảnh chụp TỪ TRƯỚC khi file được tạo. Với <code>next start</code> và <code>server.js</code> của bản standalone, tác nhân là BẤT CỨ thứ gì thêm hay đổi tên một tệp trong <code>public/</code> sau khi khởi động — và một gói sân chơi dựng lại với mã băm mới chính là thứ đó. Sân tập đo được cùng cú 404 ở cả sáu tổ hợp đã thử. (Bản cũ của bài nói nginx cũng vậy với <code>root</code> hay <code>alias</code>; không đúng — nginx nhìn đĩa ở mỗi yêu cầu, trừ khi bạn bật <code>open_file_cache</code>.)</p>

<h3>Cái bẫy thứ hai: diệt tiến trình bằng tên</h3>
${slide('ga-10', 20, 'next-server tự đổi tên: pkill -f "next start" không khớp gì, hoặc chỉ khớp lớp vỏ npm rồi báo thành công')}
<p>Khởi động lại là một dòng — trừ khi cú diệt trượt. CLAUDE.md ghi rằng cả <code>pkill -f "next start"</code> lẫn <code>pkill -f "standalone/server.js"</code> ÂM THẦM không khớp gì. Để thấy tại sao, đo xem Node THẬT SỰ gọi tiến trình là gì:</p>

<pre><code class="language-bash">$ npm start &amp;          # "start": "next start -p 19101"
$ ps -eo pid,ppid,comm,args | awk 'NR==1 || /next|npm start/'
</code></pre>

<div class="out">    PID    PPID COMMAND         COMMAND
   2477    2284 npm start       npm start
   2491    2477 sh              sh -c next start -p 19101
   2492    2491 next-server (v1 next-server (v14.2.35)

# chay THANG ./node_modules/.bin/next start -p 19101 (khong qua npm):
   2256    2063 next-server (v1 next-server (v14.2.35)     ← MOT tien trinh duy nhat
</div>

<p>Tiến trình giữ cổng là tiến trình tên <strong><code>next-server (v14.2.35)</code></strong>, ở cả hai cột: Next đặt <code>process.title</code>, và trên Linux việc đó ghi đè cả dòng lệnh mà <code>ps</code> và <code>pkill -f</code> đọc. Cả <code>next start</code> lẫn <code>standalone/server.js</code> đều không còn xuất hiện ở dòng của chính server. Từ đó ra hai kiểu hỏng tuỳ cách bạn khởi động. Chạy thẳng, chỉ có MỘT tiến trình và không gì khớp: <code>pkill -f "next start"</code> thoát 1 và không giết gì. Chạy qua <code>npm start</code>, mẫu khớp lớp vỏ <code>sh -c next start …</code> mà npm tạo ra: pkill giết lớp vỏ, thoát <strong>0</strong>, còn server thật được gán cha mới là PID 1 và tiếp tục giữ cổng. (Bản cũ của bài vẽ một tiến trình khởi động <code>node … next start</code> với một đứa con riêng; sân tập không thấy tiến trình nào như thế trên Next 14.2.35 lẫn 15.5.26.)</p>

<div class="callout warn">
<p><strong>Kiểu hỏng.</strong> Một script khởi-động-lại chạy <code>pkill</code> rồi <code>npm start</code> sẽ thấy tiến trình mới sập ngay lập tức với <code>EADDRINUSE: address already in use :::3000</code>. Đọc ngược lại: cú sập là server <em>mới</em> chết vì server <em>cũ</em>, thứ đáng lẽ cú diệt phải đánh trúng, vẫn còn đó. Cú diệt có "thành công" hay không tuỳ vào cách khởi động: chạy thẳng thì <code>pkill</code> không khớp gì và trả 1 — một script có <code>|| true</code> sẽ giấu mất; chạy qua <code>npm start</code> thì nó khớp lớp vỏ <code>sh</code> và trả 0 — thứ không gì giấu được, vì nó trông y hệt thành công.</p>
</div>

<h3>Luật sống sót</h3>
<p>Diệt theo bất biến của thứ bạn THẬT SỰ muốn giải phóng. Với một daemon mạng, bất biến ấy là một <strong>cổng</strong>, không phải một tên. Một dòng CLAUDE.md ghi lại — đo trên máy Mac của khoá, và KHÔNG chạy được ở mọi nơi, như mục sau cho thấy:</p>

<pre><code class="language-bash">$ lsof -ti:3000 | xargs -r kill -9
</code></pre>

<p><code>lsof -ti:3000</code> in ra PID của mọi tiến trình đang nghe cổng 3000 — một PID mỗi dòng, không có tiêu đề. <code>xargs -r</code> từ chối chạy <code>kill</code> khi không có PID nào đến, nên lệnh an toàn để chạy cả khi không có gì đang nghe. <code>kill -9</code> cố ý cùn: một <code>next-server</code> lờ đi SIGTERM sẽ không lờ được SIGKILL. Đây là một trong số ít chỗ mà <code>-9</code> là chọn lựa đầu tiên đúng — một daemon nghe cổng không chịu nhả socket là chính trường hợp mà tín hiệu ấy được thiết kế cho.</p>

<h3>Đo luật đối chiếu với công cụ SAI</h3>
<div class="out">$ npm start &amp;                               # server 1 (next 14.2.35)
$ pgrep -af "next start"
2491 sh -c next start -p 19101               ← chi khop LOP VO sh
$ pkill -f "next start"; echo "pkill rc=$?"
pkill rc=0                                   ← "thanh cong"
$ sleep 3; ss -ltnpH "sport = :19101"        # ai con giu cong?
… users:(("next-server (v1",pid=2492,fd=21))
   2492       1 next-server (v1 next-server (v14.2.35)   ← cha gio la PID 1
$ npm start                                  # khoi dong lai ngay
Error: listen EADDRINUSE: address already in use :::19101
moi.txt luc nay: HTTP 404                    ← van la server CU tra loi
</div>

<div class="out">$ fuser -k 19101/tcp                         # diet theo CONG (Linux)
$ ss -ltnpH "sport = :19101"                 # hau dieu kien: KHONG AI
$ npm start
server 3 len: pid=2614 (khac 2492)
moi.txt sau khi khoi dong lai: HTTP 200
</div>

<p>Hai khối, mỗi khối một số đo, và mã thoát của cách SAI là điểm nhấn: nó nói dối. Qua <code>npm start</code>, <code>pkill -f "next start"</code> trả số không, <em>và</em> để server thật sống, <em>và</em> chặn cú khởi động kế bằng một cú đụng cổng — trong khi server cũ vẫn trả <code>moi.txt</code> bằng 404, nên triệu chứng trông như chưa hề được đụng tới. Mọi tầng đều báo thành công.</p>

<h3>Dòng lệnh không chạy được trên runner</h3>
${slide('ga-10', 21, 'Diệt theo cổng — rồi hỏi lại xem cổng đã trống chưa: lsof không thấy gì trên runner Linux, ss và fuser thì thấy')}
<p>Sân tập chạy dòng lệnh của CLAUDE.md trên runner <code>ubuntu-24.04</code> của GitHub, ở cả sáu job của run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018797092" target="_blank" rel="noopener">36018797092</a>, và hỏi nhiều công cụ cùng một câu — ai đang giữ cổng 19101?</p>
<div class="out">lsof la: /usr/bin/lsof ·     revision: 4.95.0
lsof -ti:19101 (user runner): '' rc=1
lsof -nP -iTCP:19101 -sTCP:LISTEN:                       (trong)
sudo lsof -ti:19101: ''
ss -ltnpH sport = :19101 → pid=2256
fuser 19101/tcp → '  2256'
sau 'lsof -ti:19101 | xargs -r kill -9': ss con thay pid=2256
sau 'fuser -k 19101/tcp': ss con thay KHONG AI
server 3 len: pid=2352
moi.txt sau khi khoi dong lai: HTTP 200</div>
<p>Trên runner đó, <code>lsof</code> — kể cả với <code>sudo</code>, kể cả khi hỏi thẳng theo PID — không thấy socket của server Next, trong khi <code>sudo lsof -nP -i</code> vẫn liệt kê socket hệ thống, như cổng 22 do systemd giữ. Vậy là <code>lsof -ti:19101</code> không in gì, <code>xargs -r</code> đúng luật từ chối chạy <code>kill</code> không đối số, và cả dòng lệnh thoát như thể việc đã xong. <code>ss</code> và <code>fuser</code> thấy PID 2256 ngay, và <code>fuser -k</code> giải phóng được cổng. Trên máy Mac M1 của khoá, dòng lsof chạy đúng như CLAUDE.md ghi. Vì sao lsof mù với tiến trình của job trên runner thì chưa xác định được; điều quan trọng là bài học nó ép ra: <strong>mã thoát của lệnh diệt KHÔNG phải hậu điều kiện</strong>. Hậu điều kiện là một công cụ THỨ HAI, hỏi SAU ĐÓ, báo rằng không ai giữ cổng.</p>
<table>
<thead><tr><th>Nền tảng</th><th>Ai giữ cổng?</th><th>Diệt theo cổng</th></tr></thead>
<tbody>
<tr><td>Linux (VPS, runner, WSL)</td><td><code>ss -ltnp "sport = :3000"</code></td><td><code>fuser -k 3000/tcp</code></td></tr>
<tr><td>macOS</td><td><code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code></td><td><code>lsof -ti:3000 | xargs -r kill -9</code></td></tr>
<tr><td>Windows (bạn cùng nhóm)</td><td><code>netstat -ano | findstr :3000</code></td><td><code>taskkill /PID &lt;pid&gt; /F</code></td></tr>
</tbody>
</table>
<p>Hàng Windows ghi cho đủ, chưa được chạy thử trong chương này.</p>

<h3>Khởi động lại có hậu điều kiện</h3>
${slide('ga-10', 22, 'Quy trình khởi động lại với hai hậu điều kiện: không ai giữ cổng, rồi tệp mới trả 200')}
<pre><code class="language-bash">#!/usr/bin/env bash
# restart-next.sh — khoi dong lai Next theo CONG, co hau dieu kien
set -euo pipefail
PORT=&#36;{1:-3000}
holder() { ss -ltnpH "sport = :$PORT" | grep -o 'pid=[0-9]*' | cut -d= -f2 || true; }
old=$(holder); echo "cu: &#36;{old:-khong ai}"
[ -n "$old" ] &amp;&amp; fuser -k "$PORT/tcp" || true
for i in $(seq 1 10); do [ -z "$(holder)" ] &amp;&amp; break; sleep 0.5; done
if [ -n "$(holder)" ]; then echo "cong $PORT van bi giu: $(holder)"; exit 1; fi
nohup npm start &gt; next.log 2&gt;&amp;1 &amp;
for i in $(seq 1 30); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" &amp;&amp; break; sleep 0.5; done
new=$(holder); echo "moi: &#36;{new:-KHONG LEN}"
if [ -z "$new" ] || [ "$new" = "$old" ]; then echo "server khong doi"; exit 1; fi</code></pre>
<p>Mỗi bước kiểm đúng điều nó tuyên bố. PID được đọc từ <code>ss</code>, không từ lệnh diệt; vòng lặp chờ tới khi KHÔNG AI giữ cổng và hỏng to nếu vẫn còn người giữ; và script chỉ gọi đó là khởi động lại nếu bây giờ một PID KHÁC đang giữ cổng. Thêm dòng cuối của riêng bạn cho chính triệu chứng — với sân chơi, tải gói JS có mã băm và đòi 200.</p>
<div class="out"># run 36021370393 · next 14.2.35 · npm-start · buoc (6)
moi2.txt truoc: HTTP 404
cu: 2442
19101/tcp:            2442          ← fuser in PID no vua diet
moi: 2487
restart-next rc=0
moi2.txt sau: HTTP 200
--- chay lai khi KHONG ai giu cong ---
cu: khong ai
moi: 2536
restart-next rc=0</div>
<p>Chạy trên runner của sân tập (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021370393" target="_blank" rel="noopener">36021370393</a>), script đưa tệp thêm-sau-khi-khởi-động từ 404 lên 200 và báo một PID mới, và cũng chạy đúng khi không ai giữ cổng. Cả hai đều quan trọng: script khởi động lại được chạy lúc vội, thường là khi server đã chết sẵn.</p>

<h3><code>deploy.sh</code> bây giờ kiểm gì</h3>
<p>Chính commit vá chốt wget (bài 10.3) đã thêm bước 4c vào <code>deploy.sh</code>: sau khi container lên, nó tải <code>/playground/</code>, đọc tên gói JavaScript có mã băm từ trong HTML, rồi tải CHÍNH tệp đó. Nó tồn tại vì kiểu hỏng này vô hình với mọi phép kiểm khác: build thành công, container khoẻ, mọi route API đều mount — mà trang vẫn không bao giờ tải xong. Phép kiểm cho một trang tĩnh phải yêu cầu đúng những tệp mà trang sẽ yêu cầu, bằng đúng những cái tên trang sẽ dùng. Nó còn phải đi theo chuyển hướng — Next trả <code>/playground/</code> bằng một 308 về <code>/playground</code>, và ghi chú trong <code>deploy.sh</code> kể rằng bản đầu của phép kiểm coi 308 là hỏng và lẽ ra đã đánh hỏng mọi lần deploy.</p>

<h3>Tại sao production không dính lỗi này</h3>
<p>Production được tha vì cơ chế khởi động lại của nó là <em>thay container</em>, không phải <em>diệt tiến trình</em>. Trong <code>frontend/Dockerfile</code>, <code>COPY . .</code> xảy ra <strong>trước</strong> <code>next build</code>, nên mỗi cuộc deploy sinh ra một ảnh mới với <code>public/</code> mới nướng vào và tên gói mới biết-lúc-khởi-động. Container cũ bị <code>docker compose up -d</code> huỷ, và cổng của nó được giải phóng như một hệ quả phụ của việc gỡ không gian tên tiến trình mà nó sống trong. Không <code>pkill</code>, không đối chiếu tên, không đứa con mồ côi thừa hưởng một socket.</p>

<div class="callout ok">
<p><strong>Cách tổng quát hoá.</strong> Khi có thể, THAY tiến trình thay vì KHỞI ĐỘNG LẠI nó. Container, đơn vị systemd với <code>Restart=always</code>, PM2 ở chế độ <code>graceful-reload</code> — tất cả tránh bẫy diệt-theo-tên vì bộ quản lý theo dõi tiến trình bằng một mã định danh do CHÍNH bộ quản lý gán, không phải bằng một tên Node có thể ghi đè. Diệt-theo-cổng là đường lùi cho dev tương tác, không phải cơ chế chính cho prod.</p>
</div>

<h3>Vì sao chẩn đoán mất hai phiên</h3>
<p>Bản hồi cứu đáng trích vì nó có cùng hình dạng với hầu hết sự cố trong chương này. Khuôn mẫu bằng chứng là:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cái NHÌN THẤY được</span><span class="lz-d">Spinner tải. Tab Network: 200 OK cho HTML và cho một preload duy nhất (file <code>.ktx</code>, tên cố định trong mã nguồn nên KHÔNG đổi qua các cuộc dựng lại).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cái KHÔNG NHÌN THẤY được</span><span class="lz-d">Gói JavaScript. Tên nó mang mã băm nội dung, nên lần dựng lại đã đổi tên nó; server đang chạy trả tên mới bằng 404, không JavaScript nào chạy, và màn hình tải — HTML và CSS thuần — không có gì để báo lỗi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">vì sao cú vá đầu TRÔNG có tác dụng</span><span class="lz-d">Cùng đợt việc đó vừa bật lại minify (6,52 MB → 4,86 MB), nên chính gói JS là nghi phạm tự nhiên. Commit vá ghi câu trả lời: cú kẹt "hoá ra không phải do minify".</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bằng chứng phản</span><span class="lz-d">Một cú <code>curl -sI</code> tới URL hỏng trả 404. SERVER mới là kẻ nói dối, không phải trình duyệt. Mọi thứ khác rơi ra khỏi đó.</span></div>
</div>

<p>Khuôn mẫu cần khắc: <strong>khi một triệu chứng sống sót qua mọi cú vá bên máy khách bạn có thể nghĩ ra, SERVER là nơi cuối cùng bạn nhìn tới và sẽ là câu trả lời</strong>. 404-với-file-trên-đĩa ở bài 10.1 và spinner-với-200-mọi-nơi ở đây là cùng một lỗi mặc quần áo khác.</p>

<h3>Sổ vận hành một-dòng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">bất kỳ tài sản tĩnh nào trả 404</span><span class="lz-lnote">kiểm đĩa với <code>ls</code>. Nếu nó ở đó, khởi động lại server phục vụ nó. Đừng điều tra thêm trước bước ấy.</span></div>
<div class="lz-layer"><span class="lz-lname">khởi động lại một daemon bám cổng</span><span class="lz-lnote">diệt theo cổng (<code>fuser -k CỔNG/tcp</code> trên Linux, <code>lsof -ti:CỔNG | xargs -r kill -9</code> trên macOS), xác nhận cổng đã trống bằng một công cụ thứ hai, rồi khởi cái mới. KHÔNG BAO GIỜ <code>pkill -f</code> một tiến trình Node — Node tự đổi tên nó.</span></div>
<div class="lz-layer"><span class="lz-lname">viết một script khởi động lại</span><span class="lz-lnote">script chưa xong cho đến khi bạn xem nó diệt một server cũ, thấy cái mới khởi động trên cùng cổng, và xác nhận số đếm cổng đi 1 → 0 → 1. Nếu bước giữa là 1 → 1 → 1, cú diệt không có tác dụng.</span></div>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn khởi động lại một server Node và server mới hỏng với EADDRINUSE. Chuyện gì đã xảy ra, và làm sao khởi động lại cho chắc?</strong><br>Đ: Tiến trình cũ vẫn đang nghe cổng — cú diệt đã trượt nó. Diệt theo tên rất mong manh vì tiến trình Node có thể tự đổi tên (Next hiện ra là <code>next-server (vX)</code>), và một lớp vỏ như <code>npm start</code> có thể bị giết trong khi con nó sống sót. Tôi diệt theo cổng — <code>fuser -k CỔNG/tcp</code> trên Linux — rồi xác nhận bằng <code>ss</code> rằng không ai giữ cổng trước khi khởi động tiến trình mới.</p>
<p><strong>H: Một tệp tĩnh có trên đĩa của server mà app trả 404 cho nó. Bạn nghi gì?</strong><br>Đ: Tiến trình phục vụ đã lập danh sách tệp lúc khởi động và chưa được khởi động lại từ khi tệp xuất hiện — Next.js làm vậy với <code>public/</code>. Tôi khởi động lại nó rồi yêu cầu lại tệp. Trên production, đây là lý do mỗi lần deploy nên khởi động một container MỚI từ image mới chứ không chép tệp vào container đang chạy.</p>
<p><strong>H: Vì sao production không dính lỗi này dù môi trường dev thì dính?</strong><br>Đ: Vì production không khởi động lại tiến trình, nó THAY container. Image được dựng với các tệp đã nằm sẵn trong <code>public/</code>, container mới khởi động với danh sách mới, còn container cũ — cùng cổng của nó — biến mất khi bị gỡ.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi mã thoát là sự thật.</strong> <code>pkill -f "next start"</code> trả số không có nghĩa <em>ít nhất một tiến trình được khớp và gửi tín hiệu</em>, không phải <em>tiến trình tôi muốn đã biến mất</em>. Hậu-điều-kiện đúng là <code>lsof -ti:PORT</code> không in gì. Một phép kiểm không kiểm hậu-điều-kiện của mình không phải một phép kiểm — cùng luật như smoke test ở bài 10.3.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tên của một tiến trình là một nhãn tiến trình có thể ghi đè, nên một script diệt đối chiếu theo tên sẽ âm thầm trượt một tiến trình đã tự đổi tên mình — hãy diệt theo BẤT BIẾN của thứ bạn THẬT SỰ muốn giải phóng, với daemon mạng ấy là <em>cổng</em>, và xác nhận bằng một công cụ thứ hai (<code>ss</code> trên Linux, <code>lsof</code> trên macOS) rằng cổng đã rảnh trước khi khởi kẻ thay thế.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn tận mắt thấy, trên máy của mình, cả hai nửa của sự cố sân chơi — một tệp có trên đĩa mà server không chịu phục vụ, và một cú diệt không diệt được — và ra về với một script khởi động lại bạn tin được.</p><ol>
<li>Trong một thư mục nháp: <code>npm init -y &amp;&amp; npm i next@14 react@18 react-dom@18</code>, thêm <code>pages/index.js</code>, đặt <code>"start": "next start -p 3100"</code>, rồi <code>npx next build</code>.</li>
<li><code>npm start &amp;</code>. Tạo <code>public/moi.txt</code> và yêu cầu nó bằng <code>curl -s -o /dev/null -w "%{http_code}\\n" localhost:3100/moi.txt</code>. Ghi lại mã.</li>
<li>Xem cây tiến trình (<code>ps -eo pid,ppid,comm,args | grep -E "next|npm"</code> trên Linux; <code>ps -o pid,ppid,command</code> trên macOS). Chạy <code>pkill -f "next start"; echo $?</code>, rồi hỏi xem ai đang giữ cổng 3100.</li>
<li>Diệt theo cổng bằng lệnh của nền tảng bạn dùng, xác nhận cổng trống bằng công cụ thứ hai, khởi động lại, rồi yêu cầu <code>moi.txt</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> ghi chú của bạn có mã 404 trước khi khởi động lại và 200 sau đó; mã thoát của <code>pkill</code> và server có sống sót qua nó không; và PID cũ, PID mới trên cổng 3100 — hai số phải khác nhau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>process.title</code></span><span class="v">Cái tên tiến trình Node tự đặt cho mình. Next đặt nó thành <code>next-server (vX)</code>; trên Linux việc đó thay cả dòng lệnh mà <code>ps</code> và <code>pkill -f</code> đọc.</span></div>
  <div class="kv"><span class="k">Orphan process (tiến trình mồ côi)</span><span class="v">Tiến trình con có cha đã chết. Nó được gán cho PID 1 và chạy tiếp — và giữ luôn cổng của nó.</span></div>
  <div class="kv"><span class="k"><code>EADDRINUSE</code></span><span class="v">"Địa chỉ đang được dùng": server mới không nghe được vì một tiến trình khác giữ cổng. Gần như luôn là server cũ bạn tưởng đã diệt.</span></div>
  <div class="kv"><span class="k">Post-condition (hậu điều kiện)</span><span class="v">Điều phải đúng SAU một lệnh, được kiểm độc lập — "không ai giữ cổng 3000" — khác với mã thoát của chính lệnh đó.</span></div>
  <div class="kv"><span class="k"><code>ss</code> / <code>fuser</code></span><span class="v">Công cụ Linux cho biết tiến trình nào giữ một socket (<code>ss -ltnp</code>) và diệt nó theo cổng (<code>fuser -k 3000/tcp</code>).</span></div>
  <div class="kv"><span class="k">Content hash (mã băm nội dung)</span><span class="v">Dấu vân tay nội dung tệp đặt trong tên, vd <code>bundle.3fa9c1.js</code>. Mỗi lần dựng lại có thay đổi là ra tên mới — thứ mà server đã lập danh sách tệp lúc khởi động không biết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Next.js lập danh sách <code>public/</code> MỘT lần lúc khởi động: tệp thêm sau có trên đĩa mà vẫn 404 tới khi server khởi động lại.</li>
<li>Tài sản tĩnh 404 trong khi <code>ls</code> thấy nó nghĩa là "khởi động lại server trước, điều tra sau".</li>
<li>Next tự đổi tên thành <code>next-server (vX)</code>: <code>pkill -f "next start"</code> không giết gì (rc=1), hoặc chỉ giết lớp vỏ npm (rc=0) và để server thành mồ côi.</li>
<li>Diệt theo cổng — <code>fuser -k</code> trên Linux, <code>lsof -ti | xargs kill</code> trên macOS — rồi xác nhận bằng công cụ thứ hai.</li>
<li>Trên runner Linux, <code>lsof -ti:CỔNG</code> không thấy gì; lệnh thoát êm và không giết gì cả.</li>
<li>Production tránh được cả lớp lỗi này vì nó thay container chứ không khởi động lại tiến trình.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố Playground 30/07/2026</span><span class="lc-sub">bản gốc: hai phiên chẩn đoán hỏng, và ghi chú cụ thể rằng <code>pkill -f "next start"</code> và <code>pkill -f "standalone/server.js"</code> đều âm thầm trượt vì Node đổi tên tiến trình thành <code>next-server</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36018797092 — ảnh chụp public/, pkill và diệt theo cổng</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36018797092 — Next 14.2.35 và 15.5.26 × next start, npm start, standalone: cú 404, cây tiến trình, mã thoát của pkill, và lsof so với ss, fuser.</span></span></div>
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
      description: 'Sự cố 28–29/06/2026: hai workflow deploy cùng chạy trên một commit, db push tạo bảng trước, migrate deploy đâm vào nó (P3018, 42P07) rồi chặn mọi lần sau (P3009); workflow tự resolve cho xanh sau 16 phút và để prod khác mọi môi trường dựng mới. Dựng lại trên Postgres thật: migration cuộn lại cả khối, CONCURRENTLY để lại chỉ mục dở, và vì sao phải ĐO trước khi chọn cờ resolve.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>The migration that half-applied, and the resolve you must not run</h2>
<p class="lead">CLAUDE.md dedicates a whole section to migration failures. Its first sentence is <em>STOP. Do not attempt to auto-fix.</em> This lesson exists because that sentence is not obvious — the auto-fix commands are one line each, and Prisma's error message practically hands them to you. The reason not to run them is the shape of a partially-applied migration, which you must understand before <code>prisma migrate resolve</code> becomes safe.</p>

<h3>The class of failure</h3>
${slide('ga-10', 23, 'Case file 10.5: P3018 then P3009 — and the real cause was two workflows managing one schema')}
<div class="out"># api-backend · run 28335803831 · deploy-ghcr.yml · 28/06/2026 21:09 UTC (29/06 04:09 gio VN)
27 migrations found in prisma/migrations
Applying migration &#96;20260709120000_add_notes_subject_share&#96;
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20260709120000_add_notes_subject_share
Database error code: 42P07
Database error:
ERROR: relation "note_subject_shares" already exists

# run 28336160068 · commit ke tiep · 21:18 UTC
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The &#96;20260709120000_add_notes_subject_share&#96; migration started at 2026-06-28 21:09:20.938069 UTC failed
</div>

<p>Read it carefully, because an earlier version of this lesson replaced it with an invented log ("three of five statements ran"). The real failure was at the <em>first</em> statement: <code>CREATE TABLE "note_subject_shares"</code> hit a table that already existed. The migration had not half-run — it had run into a database that already contained what it was about to create. That is <strong>schema drift</strong>: the database no longer matches what the migration history says, and Prisma refuses to migrate on top of it. The next deploy got <code>P3009</code>, which is not a bug either — it is Prisma remembering the failure (a row in <code>_prisma_migrations</code> with no <code>finished_at</code>) and refusing to guess.</p>

<h3>What really happened on 28 June</h3>
${slide('ga-10', 24, 'Two workflows, one commit, one schema: db push created the table two minutes before migrate deploy tried to')}
<p>The repository&#39;s own run history tells the story, minute by minute (times UTC; add seven hours for Vietnam, so this was the early morning of 29 June). At that time <em>two</em> workflows deployed on every push to <code>main</code> — the race that Chapter 9 and CLAUDE.md describe:</p>
<table>
<thead><tr><th>UTC</th><th>Commit</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>20:49</td><td><code>6ffffb68</code> "add share migration"</td><td>both deploys red — <code>TS2353</code>, a wrong compound-key name in the service code</td></tr>
<tr><td>21:07:03</td><td><code>63d5d7aa</code></td><td><code>backend-vps.yml</code> runs <code>prisma db push --accept-data-loss</code>: "Your database is now in sync with your Prisma schema" — it <strong>creates</strong> <code>note_subject_shares</code> from <code>schema.prisma</code></td></tr>
<tr><td>21:09:20</td><td><code>63d5d7aa</code></td><td><code>deploy-ghcr.yml</code> runs <code>migrate deploy</code> → <code>P3018</code>, <code>42P07 relation … already exists</code></td></tr>
<tr><td>21:12–21:18</td><td><code>b2aee39e</code> "make migration idempotent with IF NOT EXISTS"</td><td><code>P3009</code> — editing the file cannot help while the failure row is there</td></tr>
<tr><td>21:21–21:28</td><td><code>684742b2</code> "handle P3009 … mark as rolled back"</td><td>the workflow runs <code>resolve --rolled-back</code> on every migration, then <code>migrate deploy</code> → "All migrations have been successfully applied"</td></tr>
<tr><td>10/07</td><td><code>d09e5f20</code></td><td>both auto-fixes removed; <code>db push</code> removed from <code>backend-vps.yml</code></td></tr>
</tbody>
</table>
<p>The first wrong diagnosis was "the migration is not idempotent". It is the natural reading of <code>already exists</code>, and it leads straight to editing the migration. The right diagnosis was one level up: <strong>two tools were managing one schema</strong>. <code>db push</code> writes the database to match <code>schema.prisma</code> and records nothing in <code>_prisma_migrations</code>; <code>migrate deploy</code> replays migration files and trusts that table. Run both against the same database and they will eventually collide — here they collided two minutes apart, on the same commit.</p>
${slide('ga-10', 25, 'Rebuilt on a Postgres service container: db push first, migrate deploy second — P3018, then P3009, then P3012 from the auto-fix loop')}
<p>The sandbox rebuilds it exactly in <code>ch10/mig</code> — a two-model schema, the original migration, a Postgres 16 service container — and replays the evening in order (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160" target="_blank" rel="noopener">36021526160</a>):</p>
<div class="out">## 1. backend-vps.yml (21:07:03): db push --accept-data-loss
🚀  Your database is now in sync with your Prisma schema. Done in 69ms
## 2. deploy-ghcr.yml (21:09:20): migrate deploy
Applying migration &#96;20260709120000_add_notes_subject_share&#96;
Error: P3018
Database error code: 42P07
ERROR: relation "note_subject_shares" already exists
## 3. commit sau (21:12): migrate deploy lan nua
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
migration_name                          | xong | rolled_back | logs
0_init                                  | t    | f           |
20260709120000_add_notes_subject_share  | f    | f           | A migration failed to apply. …
## 4. 'va' 684742b2 (21:21): resolve --rolled-back MOI migration, || true
$ prisma migrate resolve --rolled-back 0_init
Error: P3012
Migration &#96;0_init&#96; cannot be rolled back because it is not in a failed state.
$ prisma migrate resolve --rolled-back 20260709120000_add_notes_subject_share
Migration 20260709120000_add_notes_subject_share marked as rolled back.</div>
<p>The workflow&#39;s loop is worth reading once, because it looks careful and is not:</p>
<pre><code class="language-bash">if echo "$OUT" | grep -q "P3009"; then
  echo "--- P3009: Found failed migrations, marking as rolled back ---"
  for d in prisma/migrations/*/; do
    [ -f "&#36;{d}migration.sql" ] || continue
    name=$(basename "$d")
    npx prisma migrate resolve --rolled-back "$name" || true
  done
  npx prisma migrate deploy
fi</code></pre>
<p>On production that loop issued 27 <code>resolve</code> commands. Twenty-four came back <code>P3012 … not in a failed state</code> and were swallowed by <code>|| true</code>. Three said "marked as rolled back": the notes-share migration, and two older ones — <code>20260704120000_add_hub_shares</code> and <code>20260705120000_add_hub_cover_image_url</code> — which evidently had failed attempts of their own recorded in <code>_prisma_migrations</code>, and which nobody looked at before marking. That is what "auto-resolve" means in practice: a machine changing migration history for reasons nobody reads.</p>

<h3>Does a failed migration leave half its statements behind?</h3>
${slide('ga-10', 26, 'PostgreSQL rolls back the whole migration — except statements that cannot run in a transaction, such as CONCURRENTLY')}
<p>The fear behind "never auto-resolve" is a half-applied migration. It is worth knowing when that can actually happen, so the sandbox measured it on PostgreSQL 16 with Prisma 5.22 (job <code>giao-dich</code>, same run):</p>
<div class="out">## 1. migration 3 cau: CREATE TABLE tags; CREATE INDEX idx_tags_name; ALTER TABLE "khong_ton_tai" …
Error: P3018 · Database error code: 42P01 · relation "khong_ton_tai" does not exist
## 2. hai cau dau con khong?
bang_tags | chi_muc
          |                ← ca hai NULL
20260710120000_add_tags | xong=f | applied_steps_count=0
## 7a. ALTER TABLE tags ADD COLUMN slug; CREATE INDEX CONCURRENTLY …
Database error code: 25001 · CREATE INDEX CONCURRENTLY cannot run inside a transaction block
cot_slug_con = f       ← ALTER cung bi cuon lai
## 7b. MOT cau: CREATE UNIQUE INDEX CONCURRENTLY "tags_name_key" ON tags(name) — tren du lieu trung
Database error code: 23505 · could not create unique index "tags_name_key" · Key (name)=(git) is duplicated.
chi_muc       | hop_le
tags_name_key | f      ← chi muc INVALID o lai trong DB
## 7c. resolve --rolled-back roi deploy lai
Database error code: 42P07 · relation "tags_name_key" already exists</div>
<p>Three results. A normal multi-statement migration is all-or-nothing on PostgreSQL: the failure at statement three took statements one and two with it, and <code>applied_steps_count</code> stayed 0. That also means the database <em>was</em> in the pre-migration state — here <code>--rolled-back</code> (after fixing the file, which was never applied anywhere) is the correct move, and the sandbox did exactly that and deployed cleanly. <code>CONCURRENTLY</code> refuses to run inside the transaction at all. But a migration that is a <em>single</em> <code>CREATE INDEX CONCURRENTLY</code> runs outside any transaction, and when it fails it leaves an <strong>invalid index</strong> behind — a real half-applied state, in which "rolled back and try again" fails with <code>42P07</code>. The fix there is to drop the invalid index by hand first. On databases without transactional DDL (MySQL), every multi-statement migration can stop halfway. So "measure the state" is not paranoia: the same error code can hide three different database states.</p>

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
${slide('ga-10', 28, 'The migrate diff line in CLAUDE.md does not run verbatim on Prisma 5.22 — measured, row by row')}
<p>The tool that answers the question is <code>prisma migrate diff</code>, and it is the one command CLAUDE.md recommends before doing anything else:</p>

<pre><code class="language-bash"># Prisma 5.22: --to-url (khong phai --to-database-url), va --from-migrations CAN shadow DB
$ npx prisma migrate diff \\
    --from-migrations ./prisma/migrations \\
    --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW_DATABASE_URL" \\
    --script
</code></pre>

<p>This computes the SQL that would take the database <em>from where migrations think it is</em> <em>to where it actually is</em>. Be careful with the direction, because an earlier version of this paragraph got it backwards. The shadow database replays <em>every</em> migration in the folder, including the failed one, so the "from" side is the schema you would have <em>if everything had applied</em>. An empty diff therefore means the database already looks as if the failed migration succeeded — that is the case for <code>--applied</code>. A diff that consists of undoing the failed migration (dropping what it creates) means the database is at the state <em>before</em> it — the case for <code>--rolled-back</code>. Anything else is a third state that neither flag describes. And CLAUDE.md&#39;s version of this command does not run at all on Prisma 5.22: <code>--to-database-url</code> is rejected as an unknown option, and without <code>--shadow-database-url</code> the diff refuses to read a migrations folder (measured in run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160" target="_blank" rel="noopener">36021526160</a>). Neither flag is safe until you have <em>read</em> a diff that actually ran.</p>

<div class="out"># san tap, run 36021526160 · DB "prod" dang P3009, ngay sau cu 42P07
$ prisma migrate diff --from-migrations ./prisma/migrations --to-url "$DB" \\
    --shadow-database-url "$SHADOW" --script
-- DropForeignKey
ALTER TABLE "note_subject_shares" DROP CONSTRAINT "fk_note_subject_share_recipient";
-- DropIndex
DROP INDEX "idx_note_subject_share_recipient";
-- AddForeignKey
ALTER TABLE "note_subject_shares" ADD CONSTRAINT "note_subject_shares_recipient_id_fkey"
  FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  → rc=0
</div>

<p>This is the sandbox&#39;s copy of the 28 June database, measured at the moment of <code>P3009</code>. Read it as "to turn the migrated schema into what the database really is, you would drop the migration&#39;s own foreign key and index, and add Prisma&#39;s default-named foreign key". In other words: the table and its unique constraint are <em>already there</em>, built by <code>db push</code> from <code>schema.prisma</code>, and only the names of two secondary objects differ. That is almost the post-migration state — the data points to <code>--applied</code> plus creating the migration&#39;s index by hand, or to a small follow-up migration. It does <em>not</em> point to <code>--rolled-back</code>, which is what the workflow ran. The rest of this lesson shows what that choice cost.</p>

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

<p>Note what this compares: <code>--from-schema-datasource</code> reads the <em>database</em> that the schema&#39;s <code>datasource</code> URL points to, and <code>--to-schema-datamodel</code> reads the <em>models</em> in the same file. (An earlier version of this lesson said it compared the model with "what migrations would create" — it does not look at the migrations folder at all.) Empty means the database already matches the model. So the workflow is: edit <code>schema.prisma</code>, hand-write the SQL, apply it to a local database with <code>migrate deploy</code>, then run this diff. Non-empty means your SQL did not fully realise the model — add a follow-up migration (never edit one that has been applied) and repeat.</p>

<h3>The six-step protocol, in exact order</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">STOP</span><span class="lz-d">Do not run <code>prisma migrate resolve</code>. Do not rewrite the failed migration with <code>CREATE TABLE IF NOT EXISTS</code> and re-deploy. Both are silent-corruption paths.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">read the exact error</span><span class="lz-d">Grab the migration name and the error message verbatim. This information is often summarised in CI output; the full log has the SQL statement that failed and the database's response — that identifies which step of the migration was live when it failed.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">enumerate what ran</span><span class="lz-d">Open the migration's <code>.sql</code> file. Number the statements and find the failing one. On PostgreSQL a multi-statement migration runs in one transaction, so a failure rolls back <em>all</em> of it (measured) — unless it contains a statement that cannot run in a transaction, such as <code>CREATE INDEX CONCURRENTLY</code>, which can leave an invalid index behind.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">measure the drift</span><span class="lz-d">Run <code>prisma migrate diff --from-migrations ./prisma/migrations --to-url "$DATABASE_URL" --shadow-database-url "$SHADOW_DATABASE_URL" --script</code>, and <code>prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-url "$DATABASE_URL" --script</code> for the database against the model. This tells you the exact SQL delta between what history says and what the database is.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">report</span><span class="lz-d">Take the results of steps 2, 3, 4 to whoever owns the database. Do not decide alone — a migration failure on production is a shared-state event by definition. Propose a fix based on the diff; do not run it yet.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">execute with an approver</span><span class="lz-d">Once the fix is approved, run it against a staging replica if one exists, verify the resulting <code>prisma migrate status</code> is clean, then apply to production. Follow with a fresh <code>migrate diff</code> — a clean run should print nothing.</span></div>
</div>

<h3>Why this is a CI concern, not a migration concern</h3>
${slide('ga-10', 29, 'The workflow as it is now: migrate deploy fails loudly, never auto-resolves, and db push is gone')}
<p>This is not only advice: it is the current code. Since <code>d09e5f20</code> (10 July 2026) the migrate step of <code>deploy-ghcr.yml</code> reads:</p>
<pre><code class="language-bash">set +e
OUT=$(npx prisma migrate deploy 2&gt;&amp;1); RC=$?
set -e
echo "$OUT"
if [ "$RC" -ne 0 ]; then
  echo "[FAIL] prisma migrate deploy failed (rc=$RC)."
  echo "NOT auto-resolving — a human must follow the Migration Failure Protocol (CLAUDE.md)."
  echo "--- error output ---"
  echo "$OUT"
  exit 1
fi</code></pre>
<p>The <code>set +e</code> / <code>set -e</code> pair captures the real exit code without the step dying before it can print the output — the same concern as Chapter 8&#39;s pipe traps. The same commit replaced <code>db push --accept-data-loss</code> in <code>backend-vps.yml</code> with <code>migrate deploy</code>, so there is one tool that changes the production schema. And since 6 July both deploy workflows are <code>workflow_dispatch</code> only, so a push can no longer start two deploys that race.</p>
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

<h3>What the IF NOT EXISTS fix did to production</h3>
${slide('ga-10', 27, 'IF NOT EXISTS made the deploy green and left production with a second unique index and a second foreign key')}
<p>The trap above is not hypothetical — it is what happened, and the sandbox measured the result. After the auto-resolve, the edited migration ran against a table that <code>db push</code> had already built, so every <code>IF NOT EXISTS</code> branch took the "create" path for objects that existed under <em>other names</em>:</p>
<div class="out"># "prod" — db push, roi migration IF NOT EXISTS
indexname: idx_note_subject_share_recipient, note_subject_shares_pkey,
           note_subject_shares_subject_id_recipient_id_key,   ← tu db push
           uk_note_subject_share                              ← tu migration: TRUNG cot
conname:   fk_note_subject_share_recipient,                   ← tu migration
           note_subject_shares_recipient_id_fkey,             ← tu db push: TRUNG cot
           note_subject_shares_pkey, uk_note_subject_share

# "moi" — moi truong dung tu dau, chi chay thu muc migrations
indexname: idx_note_subject_share_recipient, note_subject_shares_pkey, uk_note_subject_share
conname:   fk_note_subject_share_recipient, note_subject_shares_pkey, uk_note_subject_share</div>
<p>The check in the edited migration — <code>IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_note_subject_share')</code> — asks about a <em>name</em>. <code>db push</code> had created the same uniqueness under Prisma&#39;s default name, so the check found nothing and added a second one. Production ended with two unique indexes on the same pair of columns and two foreign keys on the same column; a database rebuilt from the migrations folder has one of each. Every write pays for the duplicates, and every future migration diff against production will show objects that no environment built from source has. The deploy was green throughout.</p>

<div class="callout warn">
<p><strong>The other tempting fix.</strong> <code>prisma migrate reset</code> makes the failure disappear by dropping the database and re-applying every migration. This works. On a laptop. In production it means <em>losing all data</em>. CLAUDE.md lists it in the top block of the file — the "NEVER DO — Forbidden Actions" — for exactly this reason: an automation that panic-runs <code>reset</code> when <code>P3009</code> shows up will empty the database in the middle of an outage. If you have never accidentally learned this rule, you are in the shrinking minority.</p>
</div>

<div class="callout">
<p><strong>Interview questions you are likely to get.</strong></p>
<p><strong>Q: A deploy fails with Prisma P3009. What do you do?</strong><br>A: I stop the pipeline and do not resolve anything yet. I read the original failure (P3018 and its database error), check <code>_prisma_migrations</code> and <code>migrate status</code>, and measure the database against both the migration history and the schema with <code>migrate diff</code>. The diff tells me whether the database is at the pre-migration state (<code>--rolled-back</code>), the post-migration state (<code>--applied</code>), or neither — and that decision goes to whoever owns the database before anything runs.</p>
<p><strong>Q: Why not just make the migration idempotent with IF NOT EXISTS?</strong><br>A: Because it changes history to fit one environment. Environments that already applied the original will not re-run it, fresh environments will run the new one, and where objects exist under other names the checks miss and create duplicates. The schema becomes environment-dependent while every check stays green.</p>
<p><strong>Q: What is the difference between prisma db push and prisma migrate deploy, and why should production use only one?</strong><br>A: <code>db push</code> makes the database match the schema file directly and keeps no history; <code>migrate deploy</code> applies versioned migration files and records each one. Mixing them means objects appear that no migration created, and the next migration collides with them — exactly the 28 June P3018.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you want to have seen P3018, P3009 and a drift diff with your own eyes before the day you meet them on a real deploy — and to practise stopping instead of resolving.</p><ol>
<li>Start a throwaway Postgres (a <code>postgres:16</code> service in a workflow, or <code>docker run --rm -d --name thu-pg -e POSTGRES_PASSWORD=pg -p 55432:5432 postgres:16</code> locally) and create two databases, <code>prod</code> and <code>shadow</code>.</li>
<li>In a small Prisma project with one migration already applied, add a model, write its migration by hand, then run <code>prisma db push</code> against <code>prod</code> <em>before</em> <code>prisma migrate deploy</code>. Record the P3018 error code and message.</li>
<li>Run <code>migrate deploy</code> again (P3009), then <code>SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations</code>.</li>
<li>Run <code>migrate diff --from-migrations prisma/migrations --to-url … --shadow-database-url … --script</code> and write one sentence: which state is the database in, and which flag (if any) would be correct?</li>
</ol>
<p><strong>Done when:</strong> your note has the P3018 database error code, the <code>_prisma_migrations</code> row with an empty <code>finished_at</code>, the diff output, and your one-sentence decision — and you have not run <code>resolve</code> on anything. Clean up with <code>docker rm -f thu-pg</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">P3018 / P3009 / P3012</span><span class="v">Prisma errors: a migration failed to apply; failed migrations block new ones; a migration cannot be marked rolled back because it is not in a failed state.</span></div>
  <div class="kv"><span class="k"><code>_prisma_migrations</code></span><span class="v">The table where Prisma records each migration attempt. A row without <code>finished_at</code> is what produces P3009.</span></div>
  <div class="kv"><span class="k">Schema drift (lệch schema)</span><span class="v">The database no longer matches what the migration history says — here because <code>db push</code> created objects no migration recorded.</span></div>
  <div class="kv"><span class="k">Shadow database (CSDL bóng)</span><span class="v">A scratch database Prisma replays migrations into, to compute a diff from a migrations folder. Required by <code>migrate diff --from-migrations</code>.</span></div>
  <div class="kv"><span class="k">Transactional DDL</span><span class="v">Schema changes that run inside a transaction and roll back together. PostgreSQL has it; <code>CREATE INDEX CONCURRENTLY</code> cannot use it.</span></div>
  <div class="kv"><span class="k">Invalid index (chỉ mục không hợp lệ)</span><span class="v">What a failed <code>CREATE INDEX CONCURRENTLY</code> leaves behind: it exists, occupies the name, and is not used. Find with <code>indisvalid = false</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The 28 June P3018 was caused by <code>db push</code> creating the table two minutes before <code>migrate deploy</code> — two tools managing one schema.</li>
<li>P3009 is Prisma remembering a failed migration; it blocks until a human decides.</li>
<li>On PostgreSQL a failed multi-statement migration rolls back entirely; <code>CONCURRENTLY</code> is the exception that can leave an invalid index.</li>
<li>A diff that actually runs needs <code>--to-url</code> and a shadow database; empty means "as if applied", the reverse of the migration means "as if never ran".</li>
<li>The auto-resolve plus IF NOT EXISTS made CI green and left production with duplicate constraints no fresh environment has.</li>
<li>The workflow now fails loudly, never resolves, and <code>db push</code> is gone from every workflow.</li>
</ul>

<h3>The one-sentence closing</h3>
<div class="callout">
<p><strong>One sentence.</strong> A failed migration is a <em>state</em> question, not a <em>command</em> question — <code>prisma migrate resolve</code> and <code>prisma migrate reset</code> both answer the command question in one line and both are wrong in every state a partially-applied migration can be in, so the answer is always the six-step protocol: STOP, read the error, list what ran, run <code>prisma migrate diff</code>, report to a human, execute the fix under approval.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — Migration Failure Protocol</span><span class="lc-sub">the protocol codified in this repository (five items in CLAUDE.md, split into six steps here), and the note that auto-resolving is a silent-corruption path. This lesson is a reading of that section.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandbox run 36021526160 — the 28 June evening rebuilt on Postgres 16</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160 — db push then migrate deploy (P3018, P3009, P3012), the drift diff, duplicate constraints after IF NOT EXISTS, and the transaction and CONCURRENTLY measurements.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — resolving failed migrations in a non-development environment</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — the official page on <code>migrate resolve</code>. Read it and notice how carefully it hedges around <em>when</em> to use each flag.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — <code>migrate diff</code></span><span class="lc-sub">prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff — the tool that turns "the database is in some state" into a concrete SQL delta you can read.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — schema drift and shadow databases</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — why <code>migrate dev</code> uses a shadow database, why the P3006 bug in this repo makes it unusable, and how the hand-written-SQL workaround preserves the audit trail.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — transactional DDL, and the one statement that breaks it</span><span class="lc-sub">/courses/postgresql/learn${REF} — most PostgreSQL DDL is transactional, so a failed migration rolls back cleanly — Prisma still records the failure, so P3009 still blocks the next deploy; the exception (<code>CREATE INDEX CONCURRENTLY</code>) is the one that produces the partial state this lesson deals with.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Cú migration nửa vời, và câu resolve bạn KHÔNG được chạy</h2>
<p class="lead">CLAUDE.md dành hẳn một mục cho lỗi migration. Câu đầu tiên của nó là <em>DỪNG. Đừng tự vá.</em> Bài này tồn tại vì câu ấy KHÔNG hiển nhiên — các lệnh tự-vá đều một dòng, và thông báo lỗi của Prisma gần như đưa tận tay bạn. Lý do KHÔNG chạy chúng là hình dạng của một migration nửa-áp-dụng, mà bạn phải hiểu TRƯỚC khi <code>prisma migrate resolve</code> trở nên an toàn.</p>

<h3>Kiểu hỏng</h3>
${slide('ga-10', 23, 'Hồ sơ 10.5: P3018 rồi P3009 — và nguyên nhân thật là hai workflow cùng quản một schema')}
<div class="out"># api-backend · run 28335803831 · deploy-ghcr.yml · 28/06/2026 21:09 UTC (29/06 04:09 gio VN)
27 migrations found in prisma/migrations
Applying migration &#96;20260709120000_add_notes_subject_share&#96;
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20260709120000_add_notes_subject_share
Database error code: 42P07
Database error:
ERROR: relation "note_subject_shares" already exists

# run 28336160068 · commit ke tiep · 21:18 UTC
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The &#96;20260709120000_add_notes_subject_share&#96; migration started at 2026-06-28 21:09:20.938069 UTC failed
</div>

<p>Đọc cho kỹ, vì bản cũ của bài này đã thay nó bằng một log bịa ("ba trên năm câu đã chạy"). Cú hỏng thật nằm ở câu ĐẦU TIÊN: <code>CREATE TABLE "note_subject_shares"</code> đâm vào một bảng đã tồn tại. Migration không chạy nửa chừng — nó chạy vào một CSDL đã chứa sẵn thứ nó sắp tạo. Đó là <strong>schema drift</strong> (lệch schema): CSDL không còn khớp với điều lịch sử migration nói, và Prisma từ chối migrate chồng lên. Lần deploy kế tiếp gặp <code>P3009</code>, cũng không phải lỗi — đó là Prisma NHỚ cú hỏng (một dòng trong <code>_prisma_migrations</code> không có <code>finished_at</code>) và từ chối đoán.</p>

<h3>Chuyện gì THẬT SỰ xảy ra tối 28/06</h3>
${slide('ga-10', 24, 'Hai workflow, một commit, một schema: db push tạo bảng hai phút trước khi migrate deploy định tạo nó')}
<p>Lịch sử run của chính kho kể lại câu chuyện từng phút (giờ UTC; cộng bảy giờ ra giờ Việt Nam, tức rạng sáng 29/06). Lúc đó có HAI workflow deploy ở mọi lần push lên <code>main</code> — cuộc đua mà Chương 9 và CLAUDE.md mô tả:</p>
<table>
<thead><tr><th>UTC</th><th>Commit</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>20:49</td><td><code>6ffffb68</code> "add share migration"</td><td>cả hai deploy đỏ — <code>TS2353</code>, sai tên khoá kép trong mã service</td></tr>
<tr><td>21:07:03</td><td><code>63d5d7aa</code></td><td><code>backend-vps.yml</code> chạy <code>prisma db push --accept-data-loss</code>: "Your database is now in sync with your Prisma schema" — nó <strong>TẠO</strong> <code>note_subject_shares</code> từ <code>schema.prisma</code></td></tr>
<tr><td>21:09:20</td><td><code>63d5d7aa</code></td><td><code>deploy-ghcr.yml</code> chạy <code>migrate deploy</code> → <code>P3018</code>, <code>42P07 relation … already exists</code></td></tr>
<tr><td>21:12–21:18</td><td><code>b2aee39e</code> "make migration idempotent with IF NOT EXISTS"</td><td><code>P3009</code> — sửa tệp không giúp gì khi dòng hỏng vẫn còn đó</td></tr>
<tr><td>21:21–21:28</td><td><code>684742b2</code> "handle P3009 … mark as rolled back"</td><td>workflow chạy <code>resolve --rolled-back</code> cho MỌI migration, rồi <code>migrate deploy</code> → "All migrations have been successfully applied"</td></tr>
<tr><td>10/07</td><td><code>d09e5f20</code></td><td>gỡ cả hai cú tự vá; gỡ <code>db push</code> khỏi <code>backend-vps.yml</code></td></tr>
</tbody>
</table>
<p>Chẩn đoán sai đầu tiên là "migration không idempotent". Đó là cách đọc tự nhiên của <code>already exists</code>, và nó dẫn thẳng tới việc sửa migration. Chẩn đoán đúng nằm ở tầng trên: <strong>hai công cụ cùng quản một schema</strong>. <code>db push</code> ghi CSDL cho khớp <code>schema.prisma</code> và không ghi gì vào <code>_prisma_migrations</code>; <code>migrate deploy</code> phát lại các tệp migration và tin vào bảng đó. Chạy cả hai trên cùng một CSDL thì sớm muộn chúng sẽ đâm nhau — ở đây chúng đâm nhau cách hai phút, trên cùng một commit.</p>
${slide('ga-10', 25, 'Dựng lại trên service container Postgres: db push trước, migrate deploy sau — P3018, rồi P3009, rồi P3012 từ vòng tự vá')}
<p>Sân tập dựng lại đúng như vậy trong <code>ch10/mig</code> — một schema hai model, migration gốc, một service container Postgres 16 — và phát lại buổi tối đó theo đúng thứ tự (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160" target="_blank" rel="noopener">36021526160</a>):</p>
<div class="out">## 1. backend-vps.yml (21:07:03): db push --accept-data-loss
🚀  Your database is now in sync with your Prisma schema. Done in 69ms
## 2. deploy-ghcr.yml (21:09:20): migrate deploy
Applying migration &#96;20260709120000_add_notes_subject_share&#96;
Error: P3018
Database error code: 42P07
ERROR: relation "note_subject_shares" already exists
## 3. commit sau (21:12): migrate deploy lan nua
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
migration_name                          | xong | rolled_back | logs
0_init                                  | t    | f           |
20260709120000_add_notes_subject_share  | f    | f           | A migration failed to apply. …
## 4. 'va' 684742b2 (21:21): resolve --rolled-back MOI migration, || true
$ prisma migrate resolve --rolled-back 0_init
Error: P3012
Migration &#96;0_init&#96; cannot be rolled back because it is not in a failed state.
$ prisma migrate resolve --rolled-back 20260709120000_add_notes_subject_share
Migration 20260709120000_add_notes_subject_share marked as rolled back.</div>
<p>Vòng lặp của workflow đáng đọc một lần, vì nó trông cẩn thận mà không phải:</p>
<pre><code class="language-bash">if echo "$OUT" | grep -q "P3009"; then
  echo "--- P3009: Found failed migrations, marking as rolled back ---"
  for d in prisma/migrations/*/; do
    [ -f "&#36;{d}migration.sql" ] || continue
    name=$(basename "$d")
    npx prisma migrate resolve --rolled-back "$name" || true
  done
  npx prisma migrate deploy
fi</code></pre>
<p>Trên production vòng lặp ấy phát ra 27 lệnh <code>resolve</code>. Hai mươi bốn lệnh trả về <code>P3012 … not in a failed state</code> và bị <code>|| true</code> nuốt. Ba lệnh báo "marked as rolled back": migration chia sẻ ghi chú, và hai migration cũ hơn — <code>20260704120000_add_hub_shares</code> và <code>20260705120000_add_hub_cover_image_url</code> — hẳn cũng từng có lần chạy hỏng của riêng chúng nằm trong <code>_prisma_migrations</code>, và không ai nhìn tới trước khi đánh dấu. Đó là nghĩa thực tế của "tự resolve": một cái máy sửa lịch sử migration vì những lý do không ai đọc.</p>

<h3>Migration hỏng có để lại nửa số câu lệnh không?</h3>
${slide('ga-10', 26, 'PostgreSQL cuộn lại cả migration — trừ những câu không chạy được trong giao dịch, như CONCURRENTLY')}
<p>Nỗi sợ đằng sau "không bao giờ tự resolve" là một migration chạy nửa chừng. Đáng biết khi nào điều đó THẬT SỰ xảy ra, nên sân tập đo nó trên PostgreSQL 16 với Prisma 5.22 (job <code>giao-dich</code>, cùng run):</p>
<div class="out">## 1. migration 3 cau: CREATE TABLE tags; CREATE INDEX idx_tags_name; ALTER TABLE "khong_ton_tai" …
Error: P3018 · Database error code: 42P01 · relation "khong_ton_tai" does not exist
## 2. hai cau dau con khong?
bang_tags | chi_muc
          |                ← ca hai NULL
20260710120000_add_tags | xong=f | applied_steps_count=0
## 7a. ALTER TABLE tags ADD COLUMN slug; CREATE INDEX CONCURRENTLY …
Database error code: 25001 · CREATE INDEX CONCURRENTLY cannot run inside a transaction block
cot_slug_con = f       ← ALTER cung bi cuon lai
## 7b. MOT cau: CREATE UNIQUE INDEX CONCURRENTLY "tags_name_key" ON tags(name) — tren du lieu trung
Database error code: 23505 · could not create unique index "tags_name_key" · Key (name)=(git) is duplicated.
chi_muc       | hop_le
tags_name_key | f      ← chi muc INVALID o lai trong DB
## 7c. resolve --rolled-back roi deploy lai
Database error code: 42P07 · relation "tags_name_key" already exists</div>
<p>Ba kết quả. Một migration nhiều câu bình thường là tất-cả-hoặc-không trên PostgreSQL: cú hỏng ở câu ba kéo theo câu một và hai, và <code>applied_steps_count</code> vẫn là 0. Nghĩa là CSDL ĐANG ở trạng thái trước migration — ở đây <code>--rolled-back</code> (sau khi sửa tệp, thứ chưa từng được áp ở đâu) là nước đi đúng, và sân tập đã làm đúng vậy rồi deploy sạch. <code>CONCURRENTLY</code> từ chối chạy trong giao dịch luôn. Nhưng một migration chỉ có MỘT câu <code>CREATE INDEX CONCURRENTLY</code> thì chạy ngoài giao dịch, và khi hỏng nó để lại một <strong>chỉ mục không hợp lệ</strong> — một trạng thái dở dang THẬT, trong đó "rolled back rồi chạy lại" hỏng với <code>42P07</code>. Cách vá ở đó là xoá tay chỉ mục hỏng trước. Với CSDL không có DDL giao dịch (MySQL), mọi migration nhiều câu đều có thể dừng giữa chừng. Nên "đo trạng thái" không phải là đa nghi: cùng một mã lỗi có thể che ba trạng thái CSDL khác nhau.</p>

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
${slide('ga-10', 28, 'Câu migrate diff trong CLAUDE.md không chạy nguyên văn trên Prisma 5.22 — đo từng dòng')}
<p>Công cụ trả lời câu hỏi là <code>prisma migrate diff</code>, và là lệnh duy nhất CLAUDE.md đề nghị TRƯỚC khi làm bất cứ gì khác:</p>

<pre><code class="language-bash"># Prisma 5.22: --to-url (khong phai --to-database-url), va --from-migrations CAN shadow DB
$ npx prisma migrate diff \\
    --from-migrations ./prisma/migrations \\
    --to-url "$DATABASE_URL" \\
    --shadow-database-url "$SHADOW_DATABASE_URL" \\
    --script
</code></pre>

<p>Nó tính SQL sẽ đưa cơ sở dữ liệu <em>từ nơi lịch sử migration nghĩ nó ở</em> tới <em>nơi nó THẬT SỰ ở</em>. Cẩn thận với CHIỀU của nó, vì bản cũ của đoạn này nói ngược. Shadow DB phát lại MỌI migration trong thư mục, kể cả cái hỏng, nên phía "from" là schema bạn sẽ có <em>nếu mọi thứ đã áp dụng xong</em>. Vì vậy diff RỖNG nghĩa là CSDL đã trông như thể migration hỏng đã thành công — đó là trường hợp của <code>--applied</code>. Diff chỉ gồm việc hoàn tác migration hỏng (xoá thứ nó tạo) nghĩa là CSDL đang ở trạng thái TRƯỚC nó — trường hợp của <code>--rolled-back</code>. Còn lại là trạng thái thứ ba mà không cờ nào mô tả. Và câu lệnh trong CLAUDE.md không chạy được trên Prisma 5.22: <code>--to-database-url</code> bị từ chối vì không phải tuỳ chọn hợp lệ, và thiếu <code>--shadow-database-url</code> thì diff không chịu đọc thư mục migrations (đo trong run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160" target="_blank" rel="noopener">36021526160</a>). KHÔNG cờ nào an toàn cho đến khi bạn ĐỌC một cái diff đã THẬT SỰ chạy.</p>

<div class="out"># san tap, run 36021526160 · DB "prod" dang P3009, ngay sau cu 42P07
$ prisma migrate diff --from-migrations ./prisma/migrations --to-url "$DB" \\
    --shadow-database-url "$SHADOW" --script
-- DropForeignKey
ALTER TABLE "note_subject_shares" DROP CONSTRAINT "fk_note_subject_share_recipient";
-- DropIndex
DROP INDEX "idx_note_subject_share_recipient";
-- AddForeignKey
ALTER TABLE "note_subject_shares" ADD CONSTRAINT "note_subject_shares_recipient_id_fkey"
  FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  → rc=0
</div>

<p>Đây là bản sao CSDL ngày 28/06 trên sân tập, đo đúng lúc <code>P3009</code>. Đọc nó là "để biến schema-đã-migrate thành CSDL thật, bạn sẽ xoá khoá ngoại và chỉ mục của chính migration, rồi thêm khoá ngoại tên mặc định của Prisma". Nói cách khác: bảng và ràng buộc unique của nó ĐÃ CÓ SẴN, do <code>db push</code> dựng từ <code>schema.prisma</code>, và chỉ tên của hai đối tượng phụ là khác. Đó gần như là trạng thái SAU migration — dữ liệu chỉ về phía <code>--applied</code> cộng tạo tay chỉ mục của migration, hoặc một migration bổ sung nhỏ. Nó KHÔNG chỉ về phía <code>--rolled-back</code>, thứ workflow đã chạy. Phần còn lại của bài cho thấy lựa chọn ấy tốn gì.</p>

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

<p>Để ý nó so cái gì: <code>--from-schema-datasource</code> đọc <em>CSDL</em> mà URL <code>datasource</code> trong schema trỏ tới, còn <code>--to-schema-datamodel</code> đọc <em>các model</em> trong cùng tệp. (Bản cũ của bài nói nó so model với "cái migration sẽ tạo" — nó không hề nhìn vào thư mục migrations.) Rỗng nghĩa là CSDL đã khớp với model. Nên quy trình là: sửa <code>schema.prisma</code>, viết SQL bằng tay, áp nó vào một CSDL local bằng <code>migrate deploy</code>, RỒI chạy diff này. Không rỗng nghĩa là SQL của bạn chưa hiện thực hoá đủ model — thêm một migration bổ sung (không bao giờ sửa migration đã áp) và lặp lại.</p>

<h3>Sáu bước, theo ĐÚNG thứ tự</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">DỪNG</span><span class="lz-d">Đừng chạy <code>prisma migrate resolve</code>. Đừng viết lại migration hỏng với <code>CREATE TABLE IF NOT EXISTS</code> rồi deploy lại. Cả hai đều là đường hỏng-âm-thầm.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đọc lỗi CHÍNH XÁC</span><span class="lz-d">Chép tên migration và thông báo lỗi nguyên văn. Thông tin này thường được tóm lược trong đầu ra CI; log đầy đủ có câu lệnh SQL đã hỏng và phản hồi của database — cái ấy chỉ ra bước nào của migration còn sống lúc nó hỏng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">liệt kê cái ĐÃ chạy</span><span class="lz-d">Mở file <code>.sql</code> của migration. Đánh số các câu lệnh và tìm câu hỏng. Trên PostgreSQL một migration nhiều câu chạy trong MỘT giao dịch, nên hỏng là cuộn lại TẤT CẢ (đã đo) — trừ khi nó chứa câu không chạy được trong giao dịch, như <code>CREATE INDEX CONCURRENTLY</code>, thứ có thể để lại một chỉ mục không hợp lệ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đo cái lệch</span><span class="lz-d">Chạy <code>prisma migrate diff --from-migrations ./prisma/migrations --to-url "$DATABASE_URL" --shadow-database-url "$SHADOW_DATABASE_URL" --script</code>, và <code>prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-url "$DATABASE_URL" --script</code> để so CSDL với model. Nó nói cho bạn biết chính xác delta SQL giữa cái lịch sử nói và cái database THẬT SỰ.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">báo cáo</span><span class="lz-d">Cầm kết quả bước 2, 3, 4 tới người sở hữu database. ĐỪNG quyết định một mình — một cú hỏng migration ở production là sự kiện trạng-thái-chung theo định nghĩa. Đề nghị cách vá dựa trên diff; chưa chạy nó.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">chạy dưới sự phê duyệt</span><span class="lz-d">Một khi cách vá được duyệt, chạy nó lên một bản sao staging nếu có, xác nhận <code>prisma migrate status</code> kết quả sạch, rồi áp dụng vào production. Theo sau bằng một cú <code>migrate diff</code> mới — một lần chạy sạch sẽ in không có gì.</span></div>
</div>

<h3>Vì sao đây là chuyện CỦA CI, không phải chuyện của migration</h3>
${slide('ga-10', 29, 'Workflow hiện tại: migrate deploy hỏng thì dừng to, không bao giờ tự resolve, và db push đã bị gỡ')}
<p>Đây không chỉ là lời khuyên: nó là mã hiện tại. Từ <code>d09e5f20</code> (10/07/2026), bước migrate của <code>deploy-ghcr.yml</code> là:</p>
<pre><code class="language-bash">set +e
OUT=$(npx prisma migrate deploy 2&gt;&amp;1); RC=$?
set -e
echo "$OUT"
if [ "$RC" -ne 0 ]; then
  echo "[FAIL] prisma migrate deploy failed (rc=$RC)."
  echo "NOT auto-resolving — a human must follow the Migration Failure Protocol (CLAUDE.md)."
  echo "--- error output ---"
  echo "$OUT"
  exit 1
fi</code></pre>
<p>Cặp <code>set +e</code> / <code>set -e</code> giữ được mã thoát THẬT mà bước không chết trước khi kịp in output — cùng mối lo với các bẫy ống ở Chương 8. Cùng commit đó thay <code>db push --accept-data-loss</code> trong <code>backend-vps.yml</code> bằng <code>migrate deploy</code>, để chỉ còn MỘT công cụ đổi schema production. Và từ 06/07 cả hai workflow deploy chỉ còn <code>workflow_dispatch</code>, nên một lần push không còn khởi động hai cuộc deploy đua nhau.</p>
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

<h3>Bản vá IF NOT EXISTS đã làm gì với production</h3>
${slide('ga-10', 27, 'IF NOT EXISTS làm deploy xanh và để prod có thêm một chỉ mục unique thứ hai và một khoá ngoại thứ hai')}
<p>Cái bẫy trên không phải giả định — nó là chuyện đã xảy ra, và sân tập đo được kết quả. Sau cú tự resolve, migration đã sửa chạy trên một bảng mà <code>db push</code> đã dựng sẵn, nên mọi nhánh <code>IF NOT EXISTS</code> đều đi đường "tạo" cho những đối tượng đã tồn tại dưới <em>tên khác</em>:</p>
<div class="out"># "prod" — db push, roi migration IF NOT EXISTS
indexname: idx_note_subject_share_recipient, note_subject_shares_pkey,
           note_subject_shares_subject_id_recipient_id_key,   ← tu db push
           uk_note_subject_share                              ← tu migration: TRUNG cot
conname:   fk_note_subject_share_recipient,                   ← tu migration
           note_subject_shares_recipient_id_fkey,             ← tu db push: TRUNG cot
           note_subject_shares_pkey, uk_note_subject_share

# "moi" — moi truong dung tu dau, chi chay thu muc migrations
indexname: idx_note_subject_share_recipient, note_subject_shares_pkey, uk_note_subject_share
conname:   fk_note_subject_share_recipient, note_subject_shares_pkey, uk_note_subject_share</div>
<p>Phép kiểm trong migration đã sửa — <code>IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_note_subject_share')</code> — hỏi về một cái <em>TÊN</em>. <code>db push</code> đã tạo cùng ràng buộc duy nhất ấy dưới tên mặc định của Prisma, nên phép kiểm không thấy gì và thêm cái thứ hai. Production kết thúc với hai chỉ mục unique trên cùng một cặp cột và hai khoá ngoại trên cùng một cột; CSDL dựng lại từ thư mục migrations thì mỗi thứ chỉ có một. Mỗi lần ghi phải trả giá cho bản trùng, và mọi lần diff migration với production về sau sẽ hiện ra những đối tượng mà không môi trường nào dựng từ mã nguồn có. Deploy thì xanh suốt.</p>

<div class="callout warn">
<p><strong>Cú vá cám dỗ khác.</strong> <code>prisma migrate reset</code> làm cú hỏng biến mất bằng cách xoá database và áp dụng lại mọi migration. Nó chạy được. Trên laptop. Ở production nó có nghĩa <em>mất TẤT CẢ dữ liệu</em>. CLAUDE.md liệt kê nó ở khối đầu file — "NEVER DO — Forbidden Actions" — vì chính lý do này: một tự động hoá hoảng-chạy <code>reset</code> khi <code>P3009</code> hiện lên sẽ dọn sạch database giữa cuộc sự cố. Nếu bạn chưa từng vô tình học được luật này, bạn thuộc thiểu số đang teo lại.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Deploy hỏng với Prisma P3009. Bạn làm gì?</strong><br>Đ: Tôi dừng pipeline và chưa resolve gì cả. Tôi đọc cú hỏng gốc (P3018 và lỗi CSDL của nó), xem <code>_prisma_migrations</code> và <code>migrate status</code>, rồi đo CSDL so với cả lịch sử migration lẫn schema bằng <code>migrate diff</code>. Diff cho biết CSDL đang ở trạng thái trước migration (<code>--rolled-back</code>), sau migration (<code>--applied</code>), hay không phải cả hai — và quyết định đó được đưa cho người sở hữu CSDL trước khi bất cứ gì được chạy.</p>
<p><strong>H: Sao không làm migration thành idempotent với IF NOT EXISTS cho nhanh?</strong><br>Đ: Vì nó sửa lịch sử cho khớp MỘT môi trường. Môi trường đã áp bản gốc sẽ không chạy lại, môi trường mới sẽ chạy bản mới, và chỗ nào đối tượng tồn tại dưới tên khác thì phép kiểm trượt và tạo bản trùng. Schema trở nên phụ thuộc môi trường trong khi mọi phép kiểm vẫn xanh.</p>
<p><strong>H: prisma db push khác prisma migrate deploy thế nào, và vì sao production chỉ nên dùng một cái?</strong><br>Đ: <code>db push</code> ép CSDL khớp thẳng với tệp schema và không giữ lịch sử; <code>migrate deploy</code> áp các tệp migration có phiên bản và ghi lại từng cái. Trộn hai cái nghĩa là xuất hiện những đối tượng không migration nào tạo, và migration kế tiếp đâm vào chúng — đúng cú P3018 ngày 28/06.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn tận mắt thấy P3018, P3009 và một cái diff lệch schema trước ngày gặp chúng trong một lần deploy thật — và tập DỪNG thay vì resolve.</p><ol>
<li>Dựng một Postgres dùng-xong-bỏ (một service <code>postgres:16</code> trong workflow, hoặc <code>docker run --rm -d --name thu-pg -e POSTGRES_PASSWORD=pg -p 55432:5432 postgres:16</code> ở máy) và tạo hai CSDL <code>prod</code>, <code>shadow</code>.</li>
<li>Trong một dự án Prisma nhỏ đã áp một migration, thêm một model, viết tay migration của nó, rồi chạy <code>prisma db push</code> vào <code>prod</code> TRƯỚC <code>prisma migrate deploy</code>. Ghi lại mã lỗi và thông báo P3018.</li>
<li>Chạy <code>migrate deploy</code> lần nữa (P3009), rồi <code>SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations</code>.</li>
<li>Chạy <code>migrate diff --from-migrations prisma/migrations --to-url … --shadow-database-url … --script</code> và viết một câu: CSDL đang ở trạng thái nào, và cờ nào (nếu có) là đúng?</li>
</ol>
<p><strong>Đạt khi:</strong> ghi chú của bạn có mã lỗi CSDL của P3018, dòng <code>_prisma_migrations</code> có <code>finished_at</code> rỗng, output của diff, và quyết định một câu của bạn — và bạn chưa chạy <code>resolve</code> lên thứ gì cả. Dọn bằng <code>docker rm -f thu-pg</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">P3018 / P3009 / P3012</span><span class="v">Lỗi Prisma: một migration áp không thành; migration hỏng chặn migration mới; không đánh dấu rolled back được vì migration không ở trạng thái hỏng.</span></div>
  <div class="kv"><span class="k"><code>_prisma_migrations</code></span><span class="v">Bảng nơi Prisma ghi mỗi lần chạy migration. Một dòng không có <code>finished_at</code> là thứ sinh ra P3009.</span></div>
  <div class="kv"><span class="k">Schema drift (lệch schema)</span><span class="v">CSDL không còn khớp điều lịch sử migration nói — ở đây vì <code>db push</code> tạo đối tượng mà không migration nào ghi lại.</span></div>
  <div class="kv"><span class="k">Shadow database (CSDL bóng)</span><span class="v">CSDL nháp mà Prisma phát lại migration vào, để tính diff từ một thư mục migrations. Bắt buộc với <code>migrate diff --from-migrations</code>.</span></div>
  <div class="kv"><span class="k">Transactional DDL (DDL giao dịch)</span><span class="v">Thay đổi schema chạy trong giao dịch và cuộn lại cùng nhau. PostgreSQL có; <code>CREATE INDEX CONCURRENTLY</code> không dùng được nó.</span></div>
  <div class="kv"><span class="k">Invalid index (chỉ mục không hợp lệ)</span><span class="v">Thứ một <code>CREATE INDEX CONCURRENTLY</code> hỏng để lại: nó tồn tại, chiếm tên, và không được dùng. Tìm bằng <code>indisvalid = false</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cú P3018 ngày 28/06 do <code>db push</code> tạo bảng hai phút trước <code>migrate deploy</code> — hai công cụ cùng quản một schema.</li>
<li>P3009 là Prisma NHỚ một migration hỏng; nó chặn cho tới khi con người quyết định.</li>
<li>Trên PostgreSQL migration nhiều câu hỏng thì cuộn lại toàn bộ; <code>CONCURRENTLY</code> là ngoại lệ có thể để lại chỉ mục không hợp lệ.</li>
<li>Một cái diff chạy được cần <code>--to-url</code> và shadow DB; rỗng nghĩa là "như đã áp", ngược của migration nghĩa là "như chưa chạy".</li>
<li>Tự resolve cộng IF NOT EXISTS làm CI xanh và để prod có ràng buộc trùng mà không môi trường mới nào có.</li>
<li>Workflow giờ hỏng to, không bao giờ tự resolve, và <code>db push</code> đã bị gỡ khỏi mọi workflow.</li>
</ul>

<h3>Đóng bằng một câu</h3>
<div class="callout">
<p><strong>Một câu.</strong> Một cú hỏng migration là câu hỏi về <em>trạng thái</em>, không phải câu hỏi về <em>lệnh</em> — <code>prisma migrate resolve</code> và <code>prisma migrate reset</code> đều trả lời câu hỏi về lệnh trong một dòng và đều SAI ở mọi trạng thái mà một migration nửa-áp-dụng có thể ở trong, nên câu trả lời LUÔN LÀ sáu-bước: DỪNG, đọc lỗi, liệt kê cái đã chạy, chạy <code>prisma migrate diff</code>, báo cáo cho một con người, chạy cú vá dưới sự phê duyệt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — Migration Failure Protocol</span><span class="lc-sub">quy trình (năm mục trong CLAUDE.md, bài này tách thành sáu bước), và ghi chú rằng tự-resolve là đường hỏng-âm-thầm. Bài này là một cú đọc mục ấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Run sân tập 36021526160 — dựng lại buổi tối 28/06 trên Postgres 16</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/actions/runs/36021526160 — db push rồi migrate deploy (P3018, P3009, P3012), diff lệch schema, ràng buộc trùng sau IF NOT EXISTS, và các phép đo giao dịch và CONCURRENTLY.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — resolving failed migrations trong môi trường non-development</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing — trang chính thức về <code>migrate resolve</code>. Đọc và để ý cách nó cẩn thận rào quanh câu hỏi <em>khi nào</em> dùng cờ nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma docs — <code>migrate diff</code></span><span class="lc-sub">prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff — công cụ biến "database đang ở trạng thái nào đó" thành một delta SQL cụ thể có thể đọc.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Prisma ORM — schema drift và shadow databases</span><span class="lc-sub">/courses/prisma-orm/learn${REF} — vì sao <code>migrate dev</code> dùng shadow database, vì sao lỗi P3006 trong kho này làm nó không dùng được, và cách lách bằng SQL viết-tay giữ được dấu vết kiểm toán.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — DDL giao dịch, và câu lệnh phá vỡ nó</span><span class="lc-sub">/courses/postgresql/learn${REF} — hầu hết DDL của PostgreSQL là giao dịch, nên migration hỏng được cuộn lại sạch — nhưng Prisma vẫn ghi lại cú hỏng, nên P3009 vẫn chặn lần deploy sau; ngoại lệ (<code>CREATE INDEX CONCURRENTLY</code>) là cái sản sinh trạng thái nửa vời mà bài này giải quyết.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
      slug: 'ga-10-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu, mười lăm phút. Mỗi câu là một khoảnh khắc trong năm sự cố thật khi phải chọn chạy gì tiếp theo: 404 hay 401, tsc đã mở tệp nào, vì sao set -e không cứu, pkill trượt ra sao, và cờ resolve nào hợp với trạng thái CSDL đo được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Five incidents, ten decisions</h2>
<p class="lead">Ten questions, fifteen minutes. Each question is a moment from one of the five incidents where someone had to choose what to run next. The answers come from the measurements in the lessons — the sandbox runs and the repository&#39;s own history — not from general advice.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can tell a stale build from a typo in the path using only unauthenticated <code>curl</code> and the response body.</li>
<li>I can show which files <code>tsc</code> actually opened, and write a <code>tsconfig.seed.json</code> that does not hit TS6059.</li>
<li>I can explain why <code>set -euo pipefail</code> did not stop the old wget loop, and write a retry loop that ends in a verdict.</li>
<li>I can run a checker through a healthy, a 500 and a dead target and say whether it can be trusted.</li>
<li>I can restart a Node server by port on Linux and on macOS, and prove the old process is gone.</li>
<li>I can read a P3018/P3009 pair, measure the database with <code>migrate diff</code>, and say which resolve flag — if any — fits.</li>
</ul>
${slide('ga-10', 31, 'Chapter 10 cheat sheet')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — stale build</span><span class="lz-lnote">2026-07-02: unauthenticated <code>curl</code> separated a 404 (router missing from the image) from a 401 (mounted, needs auth); the smoke test was committed the same afternoon</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — broken seed</span><span class="lz-lnote">2026-08-08: <code>tsc</code> opened 0 files under <code>prisma/</code>; the seed printed ✗ and exited 0; three layers of fix</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — the checker</span><span class="lz-lnote">11/06–30/07/2026: a wget loop in an image without wget ran dry in silence for seven weeks; a checker earns trust only by going red on a broken target</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — kill by port</span><span class="lz-lnote">2026-07-30: Next lists <code>public/</code> at start-up; <code>next-server</code> survives <code>pkill -f "next start"</code>; confirm a free port with a second tool</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — migration</span><span class="lz-lnote">2026-06-28: <code>db push</code> and <code>migrate deploy</code> collided (P3018, then P3009); PostgreSQL rolls a failed migration back entirely; the auto-resolve left duplicate constraints</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Năm sự cố, mười quyết định</h2>
<p class="lead">Mười câu, mười lăm phút. Mỗi câu là một khoảnh khắc trong năm sự cố, khi ai đó phải chọn chạy gì tiếp theo. Đáp án lấy từ các phép đo trong bài — các run trên sân tập và lịch sử của chính kho — không phải từ lời khuyên chung chung.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tách được bản dựng cũ với một đường dẫn gõ sai chỉ bằng <code>curl</code> không xác thực và thân phản hồi.</li>
<li>Tôi chỉ ra được những tệp <code>tsc</code> THẬT SỰ đã mở, và viết được <code>tsconfig.seed.json</code> không dính TS6059.</li>
<li>Tôi giải thích được vì sao <code>set -euo pipefail</code> không dừng vòng wget cũ, và viết được vòng thử lại có phán quyết.</li>
<li>Tôi cho được một bộ kiểm chạy qua đích khoẻ, đích 500 và đích chết, rồi nói nó có tin được không.</li>
<li>Tôi khởi động lại được server Node theo cổng trên Linux và macOS, và chứng minh tiến trình cũ đã biến mất.</li>
<li>Tôi đọc được cặp P3018/P3009, đo CSDL bằng <code>migrate diff</code>, và nói cờ resolve nào — nếu có — là hợp.</li>
</ul>
${slide('ga-10', 31, 'Bảng tra nhanh Chương 10')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.1 — bản dựng cũ</span><span class="lz-lnote">02/07/2026: <code>curl</code> không xác thực tách 404 (router không có trong image) khỏi 401 (đã mount, cần đăng nhập); smoke-test được commit ngay chiều hôm đó</span></div>
<div class="lz-layer"><span class="lz-lname">10.2 — seed vỡ</span><span class="lz-lnote">08/08/2026: <code>tsc</code> mở 0 tệp trong <code>prisma/</code>; seed in ✗ mà thoát 0; ba lớp vá</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — bộ kiểm</span><span class="lz-lnote">11/06–30/07/2026: vòng wget trong image không có wget cạn trong im lặng suốt bảy tuần; bộ kiểm chỉ đáng tin khi đã ĐỎ trước một đích hỏng</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — diệt theo cổng</span><span class="lz-lnote">30/07/2026: Next lập danh sách <code>public/</code> lúc khởi động; <code>next-server</code> sống sót qua <code>pkill -f "next start"</code>; xác nhận cổng trống bằng công cụ thứ hai</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — migration</span><span class="lz-lnote">28/06/2026: <code>db push</code> và <code>migrate deploy</code> đâm nhau (P3018, rồi P3009); PostgreSQL cuộn lại cả migration hỏng; cú tự resolve để lại ràng buộc trùng</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'After a deploy the container is healthy. Unauthenticated, /api/v1/profile returns 401 and /api/v1/gifs returns 404 with the body "Route GET /api/v1/gifs not found". What is the most likely cause?|||Sau một lần deploy, container healthy. Không xác thực, /api/v1/profile trả 401 còn /api/v1/gifs trả 404 kèm thân "Route GET /api/v1/gifs not found". Nguyên nhân khả dĩ nhất?',
            options: [
              'The auth middleware is broken for the GIF route only, so it rejects the request before routing|||Middleware xác thực hỏng riêng ở route GIF, nên nó từ chối yêu cầu trước khi định tuyến',
              'The running image does not contain the GIF router — a stale or partial build|||Image đang chạy không chứa router GIF — một bản dựng cũ hoặc dở dang',
              'nginx is sending /api/v1/gifs to the frontend container instead of the backend|||nginx đang gửi /api/v1/gifs sang container frontend thay vì backend',
              'The GIPHY API key is missing from the runtime environment of the backend|||Khoá API GIPHY bị thiếu trong biến môi trường lúc chạy của backend',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The 401 on /profile proves the request reached the app and that auth works; the 404 body is the app&#39;s own not-found handler, so the backend answered and has no such route — the image was built without it. Broken auth (the tempting answer) would give 401 or 403, never "Route … not found"; a missing key would fail inside a mounted handler, not at routing.|||VI: Cú 401 ở /profile chứng minh yêu cầu đã tới app và xác thực chạy được; thân 404 là bộ xử lý not-found của chính app, nên backend đã trả lời và không có route đó — image được dựng thiếu nó. Xác thực hỏng (phương án hấp dẫn) sẽ cho 401 hoặc 403, không bao giờ "Route … not found"; thiếu khoá thì hỏng BÊN TRONG một handler đã mount, không phải ở bước định tuyến.',
          },
          {
            question: 'A smoke test says: if the status code is 404, fail; otherwise print "mounted". Which situation does it let through that it should not?|||Một smoke-test viết: mã trạng thái là 404 thì hỏng; còn lại in "mounted". Tình huống nào nó cho qua mà lẽ ra không được?',
            options: [
              'A route whose router file was never copied into the image during the build|||Một route mà tệp router chưa bao giờ được chép vào image lúc dựng',
              'A route that returns 401 because the smoke test sends no token with the request|||Một route trả 401 vì smoke-test không gửi token kèm yêu cầu',
              'A route in the list whose path was mistyped, so the app answers 404 for it|||Một route trong danh sách bị gõ sai đường dẫn, nên app trả 404 cho nó',
              'A route that answers 500, and a stopped container where the code comes back empty|||Một route trả 500, và một container đã dừng khiến mã trả về rỗng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The sandbox ran this exact logic: "mounted (HTTP 500)" and "mounted (HTTP )" were both green. A 401 passing is correct (it proves the route exists), and the missing router and the typo both produce 404, which the check does catch. The fix is a whitelist — 200, 401, 403 — so every unexpected answer fails.|||VI: Sân tập chạy đúng logic này: "mounted (HTTP 500)" và "mounted (HTTP )" đều xanh. 401 được qua là đúng (nó chứng minh route tồn tại), còn router thiếu và đường gõ sai đều ra 404, thứ phép kiểm CÓ bắt. Cách vá là danh sách trắng — 200, 401, 403 — để mọi câu trả lời bất ngờ đều hỏng.',
          },
          {
            question: 'npx tsc --noEmit is green, yet the seed fails in production with "Invalid value for argument suggestedType. Expected ContentType." What do you run first?|||npx tsc --noEmit xanh, vậy mà seed hỏng trên production với "Invalid value for argument suggestedType. Expected ContentType." Bạn chạy gì trước tiên?',
            options: [
              'npx tsc --listFilesOnly | grep prisma/ — to see whether the seed was ever part of the program|||npx tsc --listFilesOnly | grep prisma/ — để xem seed đã từng nằm trong chương trình chưa',
              'npx prisma generate — the generated client is probably stale and must be rebuilt first|||npx prisma generate — client sinh ra có lẽ đã cũ và phải dựng lại trước',
              'Re-run the deploy — the enum rename may simply not have reached the database yet|||Chạy lại deploy — có thể cú đổi tên enum chỉ là chưa tới được CSDL',
              'Add a // @ts-ignore above the seed call so the type checker stops complaining|||Thêm // @ts-ignore phía trên lời gọi seed để bộ kiểm kiểu thôi phàn nàn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A green tsc is only evidence for files it opened; in the incident --listFilesOnly showed 0 files under prisma/. Regenerating the client cannot help a file that is never type-checked, and a re-run replays the same wrong literal. The @ts-ignore answer is absurd here — tsc was not complaining at all.|||VI: tsc xanh chỉ là bằng chứng cho những tệp nó đã mở; trong sự cố, --listFilesOnly cho thấy 0 tệp trong prisma/. Sinh lại client không giúp được một tệp chưa bao giờ được kiểm kiểu, và chạy lại chỉ lặp lại đúng giá trị sai. @ts-ignore thì vô lý ở đây — tsc có phàn nàn gì đâu.',
          },
          {
            question: 'The main tsconfig.json has rootDir: "./src". Which tsconfig.seed.json actually type-checks prisma/seed.ts?|||tsconfig.json chính có rootDir: "./src". tsconfig.seed.json nào THẬT SỰ kiểm kiểu được prisma/seed.ts?',
            options: [
              'extends the main config and only adds include: ["prisma/**/*.ts"] with exclude: []|||extends cấu hình chính và chỉ thêm include: ["prisma/**/*.ts"] cùng exclude: []',
              'extends the main config, adds prisma to include and sets outDir to a separate dist-seed|||extends cấu hình chính, thêm prisma vào include và đặt outDir sang một dist-seed riêng',
              'extends the main config with noEmit: true and rootDir: ".", including prisma/** and src/**|||extends cấu hình chính với noEmit: true và rootDir: ".", include cả prisma/** lẫn src/**',
              'no new file — list "prisma/seed.ts" under files in the main tsconfig.json instead|||không cần tệp mới — liệt kê "prisma/seed.ts" trong files của tsconfig.json chính',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The sandbox measured the first option: TS6059, the file is not under rootDir — the inherited rootDir still applies, and changing outDir does not change that either. Adding the seed to the main config breaks the build for the same reason. The real config overrides rootDir and sets noEmit, and then reports TS2322 for the stale value.|||VI: Sân tập đo phương án đầu: TS6059, tệp không nằm dưới rootDir — rootDir thừa kế vẫn áp dụng, và đổi outDir cũng không đổi được điều đó. Thêm seed vào cấu hình chính làm hỏng build vì cùng lý do. Cấu hình thật ghi đè rootDir và đặt noEmit, rồi báo TS2322 cho giá trị cũ.',
          },
          {
            question: 'The seed catches errors per row, prints ✗ for one row and "seed xong: 2/3", and exits 0. What is the right change?|||Seed bắt lỗi từng dòng, in ✗ cho một dòng và "seed xong: 2/3", rồi thoát 0. Thay đổi đúng là gì?',
            options: [
              'Have CI grep the seed output for ✗ and print a warning whenever it finds one|||Cho CI dò output của seed tìm ✗ và in cảnh báo mỗi khi thấy',
              'Append || true to the seed step so a partial seed never blocks the deploy|||Thêm || true vào bước seed để một lần seed dở dang không bao giờ chặn deploy',
              'Set process.exitCode = 1 when any row fails, so every caller sees a non-zero exit|||Đặt process.exitCode = 1 khi có dòng hỏng, để mọi nơi gọi đều thấy mã thoát khác 0',
              'Move the seed out of the deploy entirely so that its failures cannot affect it|||Đưa seed ra khỏi deploy hoàn toàn để lỗi của nó không ảnh hưởng được gì',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The exit code is the only signal every caller understands. Grepping for ✗ is what api-backend&#39;s deploy did, and it could only warn — the deploy went on with 2 of 3 rows. || true makes it worse, and moving the seed out just stops anyone from seeing the failure.|||VI: Mã thoát là tín hiệu duy nhất mọi nơi gọi đều hiểu. Dò ✗ là điều deploy của api-backend đã làm, và nó chỉ cảnh báo được — deploy đi tiếp với 2 trên 3 dòng. || true còn tệ hơn, còn đưa seed ra ngoài chỉ khiến không ai thấy cú hỏng nữa.',
          },
          {
            question: 'The old frontend check ran under set -euo pipefail, took 25 seconds, printed nothing and exited 0 — although wget did not exist in the image. Why did set -e not stop it?|||Chốt kiểm frontend cũ chạy dưới set -euo pipefail, mất 25 giây, không in gì và thoát 0 — dù image không có wget. Vì sao set -e không dừng nó?',
            options: [
              'The failing command was an if condition and [ … ] && sleep is an && list — both exempt — and nothing after the loop could fail|||Lệnh hỏng là điều kiện của if và [ … ] && sleep là danh sách && — cả hai được miễn — và sau vòng lặp không có gì có thể hỏng',
              'set -e is ignored inside for loops, so any command in the loop body can fail silently|||set -e bị bỏ qua bên trong vòng for, nên mọi lệnh trong thân vòng lặp đều có thể hỏng im lặng',
              'docker exec always returns 0 when the container is running, whatever the inner command does|||docker exec luôn trả 0 khi container đang chạy, bất kể lệnh bên trong làm gì',
              'pipefail switches errexit off for any command whose output is redirected to /dev/null|||pipefail tắt errexit cho mọi lệnh có output bị chuyển hướng vào /dev/null',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: errexit does not fire on a command whose status is being tested, nor on the left of &&. The loop ran dry and the script had no verdict line. set -e does apply inside loops (the tempting option), and docker exec does pass the inner exit code through — that is why the node -e version works.|||VI: errexit không kích hoạt với lệnh đang được kiểm trạng thái, cũng như ở vế trái của &&. Vòng lặp cạn và script không có dòng phán quyết nào. set -e VẪN áp dụng trong vòng lặp (phương án hấp dẫn), và docker exec CÓ chuyển mã thoát bên trong ra ngoài — đó là lý do bản node -e chạy được.',
          },
          {
            question: 'A Next.js app was started with npm start. You run pkill -f "next start"; it returns 0, yet restarting fails with EADDRINUSE. Why?|||Một app Next.js được khởi động bằng npm start. Bạn chạy pkill -f "next start"; nó trả 0, vậy mà khởi động lại hỏng với EADDRINUSE. Vì sao?',
            options: [
              'next-server traps SIGTERM and keeps running until its open connections have drained|||next-server bắt SIGTERM và tiếp tục chạy cho tới khi các kết nối đang mở được xả hết',
              'npm notices its child died and immediately restarts the server on the same port|||npm thấy tiến trình con chết và lập tức khởi động lại server trên cùng cổng',
              'The port stays in TIME_WAIT for a minute after the server exits, so it cannot be reused|||Cổng ở trạng thái TIME_WAIT một phút sau khi server thoát, nên chưa dùng lại được',
              'The pattern matched only the sh -c wrapper; the server is named next-server (vX) and survived|||Mẫu chỉ khớp lớp vỏ sh -c; server mang tên next-server (vX) và đã sống sót',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured on Next 14.2.35 and 15.5.26: pgrep matched only "sh -c next start -p 19101"; killing it returned 0 and left next-server running with parent PID 1. The server did not survive because of a signal handler — it was never signalled. With a direct next start, pkill matched nothing at all (rc=1).|||VI: Đo trên Next 14.2.35 và 15.5.26: pgrep chỉ khớp "sh -c next start -p 19101"; giết nó trả 0 và để next-server chạy tiếp với cha là PID 1. Server sống sót không phải nhờ bắt tín hiệu — nó chưa hề nhận tín hiệu nào. Khi chạy thẳng next start, pkill không khớp gì cả (rc=1).',
          },
          {
            question: 'On a GitHub ubuntu-24.04 runner, lsof -ti:3000 | xargs -r kill -9 exits 0, but the old server still holds port 3000. What do you do?|||Trên runner ubuntu-24.04 của GitHub, lsof -ti:3000 | xargs -r kill -9 thoát 0, nhưng server cũ vẫn giữ cổng 3000. Bạn làm gì?',
            options: [
              'Prefix it with sudo, because lsof needs root to see sockets owned by other users|||Thêm sudo phía trước, vì lsof cần quyền root để thấy socket của người dùng khác',
              'Kill with fuser -k 3000/tcp, then confirm with ss that nobody holds the port any more|||Diệt bằng fuser -k 3000/tcp, rồi xác nhận bằng ss rằng không còn ai giữ cổng',
              'Run pkill -9 -f node, which kills every Node process on the runner at once|||Chạy pkill -9 -f node, giết mọi tiến trình Node trên runner một lượt',
              'Wait longer before restarting — the kill has worked, the socket just needs time|||Chờ lâu hơn trước khi khởi động lại — cú diệt đã có tác dụng, socket chỉ cần thời gian',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: In run 36018797092 lsof printed nothing even with sudo, while ss and fuser saw the PID and fuser -k freed the port. The exit code of the kill line is not the post-condition; asking ss afterwards is. pkill -9 -f node would also kill unrelated processes, and waiting does not help a process that was never killed.|||VI: Trong run 36018797092 lsof không in gì kể cả với sudo, trong khi ss và fuser thấy PID và fuser -k giải phóng được cổng. Mã thoát của dòng diệt không phải hậu điều kiện; hỏi lại ss sau đó mới là. pkill -9 -f node còn giết cả tiến trình không liên quan, và chờ thì không giúp gì một tiến trình chưa hề bị diệt.',
          },
          {
            question: 'On 28 June, migrate deploy failed with P3018, 42P07 relation "note_subject_shares" already exists. What was the root cause?|||Ngày 28/06, migrate deploy hỏng với P3018, 42P07 relation "note_subject_shares" already exists. Nguyên nhân gốc là gì?',
            options: [
              'A second workflow ran db push on the same commit two minutes earlier and created the table|||Một workflow thứ hai chạy db push trên cùng commit hai phút trước đó và đã tạo bảng',
              'The migration was not idempotent and needed CREATE TABLE IF NOT EXISTS from the start|||Migration không idempotent và lẽ ra phải có CREATE TABLE IF NOT EXISTS từ đầu',
              'An earlier attempt had half-applied the migration and left the table behind on failure|||Một lần chạy trước đã áp migration nửa chừng và để lại bảng khi hỏng',
              'The migration folder was named with a future date, 20260709, so it ran out of order|||Thư mục migration được đặt tên bằng ngày tương lai, 20260709, nên nó chạy sai thứ tự',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The run history shows backend-vps.yml running db push --accept-data-loss at 21:07:03 on commit 63d5d7aa and deploy-ghcr.yml hitting 42P07 at 21:09:20 on the same commit. "Not idempotent" is the natural reading and led to the IF NOT EXISTS edit, which caused duplicate constraints. A half-applied earlier run is ruled out: this was the first attempt, and PostgreSQL rolls a failed migration back.|||VI: Lịch sử run cho thấy backend-vps.yml chạy db push --accept-data-loss lúc 21:07:03 trên commit 63d5d7aa và deploy-ghcr.yml đâm vào 42P07 lúc 21:09:20 trên cùng commit. "Không idempotent" là cách đọc tự nhiên và dẫn tới bản sửa IF NOT EXISTS, thứ gây ra ràng buộc trùng. Lần chạy nửa chừng trước đó bị loại: đây là lần chạy đầu, và PostgreSQL cuộn lại migration hỏng.',
          },
          {
            question: 'On PostgreSQL 16, a three-statement migration fails at its third statement and the next deploy says P3009. What state is the database in, and what fits?|||Trên PostgreSQL 16, một migration ba câu hỏng ở câu thứ ba và lần deploy sau báo P3009. CSDL đang ở trạng thái nào, và việc gì là hợp?',
            options: [
              'Statements one and two remain, so mark the migration --applied and run the third by hand|||Câu một và hai còn lại, nên đánh dấu --applied và chạy tay câu thứ ba',
              'The state cannot be known, so the only safe move is prisma migrate reset on the database|||Không thể biết trạng thái, nên nước đi an toàn duy nhất là prisma migrate reset trên CSDL',
              'All three rolled back; after confirming it, fix the never-applied file and mark it --rolled-back|||Cả ba đã cuộn lại; sau khi xác nhận, sửa tệp chưa từng được áp và đánh dấu --rolled-back',
              'Run migrate resolve --rolled-back on every migration in the folder, then deploy again|||Chạy migrate resolve --rolled-back cho mọi migration trong thư mục, rồi deploy lại',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: both earlier objects were NULL and applied_steps_count was 0 — the migration ran in one transaction. The pre-migration state is exactly what --rolled-back describes, after a query or diff confirms it. The "statements remain" answer is the invented scenario an earlier version of the lesson used; reset deletes all data; resolving every migration is the loop that produced 24 P3012 errors.|||VI: Đã đo: cả hai đối tượng trước đều NULL và applied_steps_count là 0 — migration chạy trong một giao dịch. Trạng thái trước migration chính là điều --rolled-back mô tả, sau khi một truy vấn hay diff xác nhận. Phương án "câu còn lại" là kịch bản bịa mà bản cũ của bài dùng; reset xoá sạch dữ liệu; resolve mọi migration là vòng lặp đã sinh 24 lỗi P3012.',
          },
        ],
      },
    },

  ],
};
