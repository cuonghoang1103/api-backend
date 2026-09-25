import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 15 (MỚI, 09/2026): Dự án cuối khoá — một pipeline CI/CD hoàn chỉnh từ số 0.
 * App "Đặt lịch phòng khám" (ch15/app: Express 5 + pg 8, Postgres 17) trên nhánh ch15-capstone của sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap. Mọi log là run THẬT 24–25/09/2026 (runner 2.337.0, ubuntu-24.04 20260920.314.1).
 * Deploy 15.3 là MÔ PHỎNG: "VPS" là một container sshd dựng trong chính job, không SSH ra máy thật nào.
 * Run đã dùng: CI/PR #10 36074874676 (hủy) · 36074887634 · 36075106581 (đỏ cố ý) · 36075189881
 *   CD 36074781609 (environment not found) · 36075156166 (tạo environment qua API) · 36075225804 (PREV bẩn)
 *   36075460464 · 36075733214 (v1.1.0) · 36075892650 (CMD sai → tự quay lui) · 36076249655 (v1.2.1)
 *   36076482487 (khoá CI theo ref hủy mất bản trước) · 36076491163 · 36076856479 · 36076881355 (chờ rồi bị thay) · 36076899299
 *   vận hành 36074955148. Docs kiểm từ mã nguồn github/docs (commit f71cc2a, 24/09/2026).
 */

const RUN = (id, t) => `<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/${id}" target="_blank" rel="noopener">${t || id}</a>`;

export default {
  title: 'Chapter 15 — Capstone: a complete CI/CD pipeline from zero|||Chương 15 — Dự án cuối khoá: một pipeline CI/CD hoàn chỉnh từ số 0',
  slug: 'ga-ch15-du-an-cuoi-khoa',
  description: 'Dựng từ số 0 một pipeline CI/CD cho app Đặt lịch phòng khám, chạy thật trên sân tập: CI cho PR với Postgres thật, ảnh hai kiến trúc có chữ ký, deploy mô phỏng qua SSH có khoá và tự quay lui, vận hành pipeline — rồi thi cuối khoá 20 câu.',
  sortOrder: 16,
  lessons: [
    {
      title: '15.0 — Chapter 15 slides: the capstone pipeline in pictures|||15.0 — Slide Chương 15: pipeline dự án cuối khoá bằng hình',
      slug: 'ga-15-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Chương 15: CI cho PR với Postgres thật, cache đo được chậm hơn, check tổng hợp, ảnh hai kiến trúc có attestation, deploy mô phỏng qua SSH với khoá và tự quay lui, đọc CI đỏ, test chập chờn, chi phí và checklist sẵn sàng production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Slides</span>
<h2>The whole capstone in 30 slides</h2>
<p class="lead">Fourteen chapters taught one mechanism at a time. This chapter builds one pipeline from zero — for a small but real app, "Clinic booking" (Express 5 + Postgres 17) — and runs every piece of it for real: PR checks, a two-architecture signed image, a deploy with a lock and an automatic rollback, and the day-to-day work of keeping it healthy. Skim the slides first to see the shape; come back after the final exam to revise.</p>
<p>Slides 3–8 belong to Lesson 15.1 (CI for pull requests), 9–14 to 15.2 (building the image), 15–22 to 15.3 (deploying safely), and 23–27 to 15.4 (running the pipeline). The last three are the chapter&#39;s common mistakes, a cheat sheet and a practice session. Every log is real: recorded on 24–25 September 2026 on GitHub-hosted runners (runner 2.337.0, <code>ubuntu-24.04</code> 20260920.314.1) in the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch15-capstone</code>. The deploy target is SIMULATED — a container reached over SSH inside the job — and the slides say so where it matters. Four results surprised us, and the slides show the run for each: the npm cache made jobs slower, a missing environment was not auto-created, a test job dirtied production&#39;s deploy history, and the CI lock cancelled a commit that then never reached production.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Slide</span>
<h2>Cả dự án cuối khoá trong 30 slide</h2>
<p class="lead">Mười bốn chương dạy từng cơ chế một. Chương này dựng một pipeline từ số 0 — cho một app nhỏ nhưng thật, "Đặt lịch phòng khám" (Express 5 + Postgres 17) — và chạy thật từng mảnh của nó: check cho PR, một ảnh hai kiến trúc có chữ ký, một lần deploy có khoá và tự quay lui, và việc hằng ngày giữ nó khoẻ. Lướt bộ slide trước để nắm hình dạng; làm xong bài thi cuối khoá thì quay lại đây để ôn.</p>
<p>Slide 3–8 thuộc Bài 15.1 (CI cho pull request), 9–14 thuộc 15.2 (dựng ảnh), 15–22 thuộc 15.3 (deploy an toàn), 23–27 thuộc 15.4 (vận hành pipeline). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành. Mọi log là THẬT: ghi ngày 24–25/09/2026 trên runner của GitHub (runner 2.337.0, <code>ubuntu-24.04</code> 20260920.314.1) trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch15-capstone</code>. Đích deploy là MÔ PHỎNG — một container vào bằng SSH ngay trong job — và slide ghi rõ chỗ nào quan trọng. Có bốn kết quả làm chính chúng tôi bất ngờ, và slide dẫn run cho từng cái: cache npm làm job chậm hơn, environment chưa có không được tự tạo, một job thử làm bẩn lịch sử deploy của production, và khoá của CI hủy mất một commit để rồi commit đó không bao giờ lên production.</p>
</div>
${gallery('ga-15', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Một push = một run'], [4, 'ch15-ci.yml có ghi chú'], [5, 'Service container Postgres'], [6, 'Cache npm đo thật'], [7, 'concurrency theo số PR'], [8, 'Check tổng hợp: skip vs đỏ'],
  [9, 'Dockerfile hai tầng'], [10, 'buildx + QEMU: hai kiến trúc'], [11, 'Ba tag cho một ảnh'], [12, 'Cache type=gha: ba lần dựng'], [13, 'Attestation'], [14, 'Quyền tối thiểu từng job'],
  [15, 'Deploy mô phỏng qua SSH'], [16, 'Environment: not found và Deployments API'], [17, 'SSH đúng cách'], [18, 'Bản trước = bản đang chạy'], [19, 'Deploy xanh và smoke test'], [20, 'Deploy hỏng, tự quay lui'], [21, 'Khoá CI và khoá deploy'], [22, 'So với deploy-nha.sh'],
  [23, 'Đọc CI đỏ bốn lớp'], [24, 'Test chập chờn đo được'], [25, 'Chi phí phút và thời gian chờ'], [26, 'Dọn cache và artifact'], [27, 'Checklist sẵn sàng production'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh'], [30, 'Thực hành Chương 15'],
])}
`,
    },
    {
      title: '15.1 — CI for pull requests: four jobs, a real Postgres, one required check|||15.1 — CI cho pull request: bốn job, một Postgres thật, một check bắt buộc',
      slug: 'ga-15-1-ci-cho-pr',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Workflow PR cho app capstone, đo thật: service container Postgres, ma trận Node 22/24, cache npm làm job chậm hơn 1,2 giây, concurrency hủy run cũ sau 27 giây, và job tổng hợp ci-ok chặn được PR đỏ mà job ngây thơ để lọt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>CI for pull requests: four jobs, a real Postgres, and one check you dare to make required</h2>
<p class="lead">Fourteen chapters taught the pieces one at a time. This one assembles them into a single thing a hiring manager can open and click through: a real app, a real repository, and a pipeline that goes from pull request to production without a single manual step. The first lesson builds the pipeline&#39;s front door — CI for pull requests — and measures each decision instead of trusting it.</p>

<p>The project app is <strong>"Clinic booking"</strong> (<em>Đặt lịch phòng khám</em>): a patient picks a doctor and a 30-minute slot, the system rejects slots outside working hours and refuses two bookings for the same doctor at the same time. It is deliberately small — about 150 lines of Express 5 plus the <code>pg</code> library, one static HTML page, one Postgres table — because what is graded in this chapter is the <em>pipeline</em>, not the app. But it has exactly the things that make CI real: a database, a <code>UNIQUE</code> constraint that only a real Postgres can check, two Node versions, and a Dockerfile.</p>
<p>All the code lives on branch <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone" target="_blank" rel="noopener"><code>ch15-capstone</code></a> of the public sandbox. Every run, log and number in this chapter comes from that branch, on 24–25 September 2026, runner 2.337.0, image <code>ubuntu-24.04</code> version 20260920.314.1.</p>
<div class="out">ch15/
├── app/                      # the "Dat lich phong kham" app
│   ├── src/lich.js           # booking rules — a PURE function, tested in milliseconds
│   ├── src/db.js             # pg pool + CREATE TABLE ... UNIQUE (bac_si, bat_dau)
│   ├── src/app.js            # Express 5: /healthz, GET/POST /api/lich, /api/bac-si
│   ├── src/server.js         # waits for Postgres up to 10 times, then listens
│   ├── public/index.html     # static "frontend"
│   ├── test/lich.test.js     # 4 unit tests
│   ├── test/api.test.js      # 5 integration tests — need a REAL Postgres
│   ├── Dockerfile            # multi-stage (lesson 15.2)
│   └── package.json          # lint / typecheck / test
└── deploy/                   # simulated "VPS" for lesson 15.3
.github/workflows/
├── ch15-ci.yml               # this lesson
└── ch15-cd.yml               # 15.2 + 15.3</div>

<h3>The whole pipeline in one picture</h3>
${slide('ga-15', 3, 'One push = one run: CI → build the image ONCE → deploy that image')}
<p>Before the first line of YAML, look at the destination. The pipeline has two entrances, and both go through the same CI file:</p>
<ul>
<li><strong>A pull request into <code>ch15-capstone</code></strong> — runs <code>ch15-ci.yml</code> and nothing else. No image, no deploy. This lesson builds that part.</li>
<li><strong>A push to <code>ch15-capstone</code></strong> (that is, a merge) — runs <code>ch15-cd.yml</code>, whose first job is <code>uses: ./.github/workflows/ch15-ci.yml</code>: it <em>calls</em> the same CI file through <code>workflow_call</code> (Lesson 12.1). Only when all four CI jobs are green do <code>anh</code> (15.2) and <code>trien-khai</code> (15.3) start.</li>
</ul>
<p>Why run CI twice — once on the PR and once after the merge? Because what gets deployed is the <em>merged commit</em>, not the commit on the PR branch. Two PRs that are green on their own can be red together. Re-running CI on exactly the commit you will deploy is the cheapest way to be able to say "nothing reaches production without CI having checked it". The branch&#39;s first run, ${RUN(36074781609)}, shows that shape in the graph: four <code>ci / …</code> jobs in a group, then <code>anh</code> for 54 seconds, then <code>trien-khai</code>.</p>

<h3><code>ch15-ci.yml</code>, block by block</h3>
${slide('ga-15', 4, 'ch15-ci.yml: three parallel jobs, one aggregate job, one lock per PR')}
<pre><code class="language-yaml">name: ch15 · CI
on:
  pull_request:
    branches: [ch15-capstone]
    paths: ['ch15/app/**', '.github/workflows/ch15-ci.yml']
  workflow_call:

permissions:
  contents: read

concurrency:
  group: ch15-ci-&#36;{{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

defaults:
  run:
    working-directory: ch15/app

jobs:
  lint:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: ch15/app/package-lock.json
      - run: npm ci --no-audit --no-fund
      - run: npm run lint
  # typecheck: identical, only the last step differs: npm run typecheck
  test:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    strategy:
      fail-fast: false
      matrix:
        node: [22, 24]
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_HOST_AUTH_METHOD: trust
        ports: ['5432:5432']
        options: &gt;-
          --health-cmd "pg_isready -U postgres"
          --health-interval 2s
          --health-timeout 3s
          --health-retries 15
    env:
      DATABASE_URL: postgres://postgres@localhost:5432/postgres
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: &#36;{{ matrix.node }}
          cache: npm
          cache-dependency-path: ch15/app/package-lock.json
      - run: npm ci --no-audit --no-fund
      - run: npm test
  ci-ok:
    if: always()
    needs: [lint, typecheck, test]
    runs-on: ubuntu-24.04
    steps:
      - name: Doc ket qua cac job
        working-directory: .
        env:
          KQ: &#36;{{ join(needs.*.result, ' ') }}
        run: |
          echo "ket qua: $KQ"
          for r in $KQ; do
            if [ "$r" != "success" ]; then
              echo "::error title=CI chua xanh::co job ket thuc voi '$r' (lint typecheck test = $KQ)"
              exit 1
            fi
          done</code></pre>
<table>
<thead><tr><th>Block</th><th>What it says</th><th>Why (and which chapter it comes from)</th></tr></thead>
<tbody>
<tr><td><code>on.pull_request.branches</code></td><td><code>[ch15-capstone]</code></td><td>Filters on the PR&#39;s <em>target</em> branch, not its source (Lesson 1.3). In a real repository this is <code>[main]</code>.</td></tr>
<tr><td><code>on.pull_request.paths</code></td><td><code>ch15/app/**</code> + the workflow file itself</td><td>A docs-only PR costs zero minutes. But read the "pending forever" trap at the end before making a check required.</td></tr>
<tr><td><code>on.workflow_call</code></td><td>(empty)</td><td>So that <code>ch15-cd.yml</code> can call this exact file (Lesson 12.1) — one source of truth for "CI is green".</td></tr>
<tr><td><code>permissions</code></td><td><code>contents: read</code></td><td>CI only reads code. The "Set up job" log of <code>ci-ok</code> prints exactly two lines: <code>Contents: read</code>, <code>Metadata: read</code> (Lesson 6.3).</td></tr>
<tr><td><code>concurrency</code></td><td>one group per PR number</td><td>A new push to the PR cancels the old run — measured below.</td></tr>
<tr><td><code>defaults.run.working-directory</code></td><td><code>ch15/app</code></td><td>The app sits deep inside a repository that holds other things, just like api-backend&#39;s <code>frontend/</code>. Say it once instead of ten times.</td></tr>
<tr><td><code>timeout-minutes</code></td><td><code>10</code></td><td>The default is 360 minutes. A hung test burns six runner-hours without this line (Lesson 10.2).</td></tr>
</tbody>
</table>
<p>The three jobs <code>lint</code>, <code>typecheck</code> and <code>test</code> run in parallel because none needs another&#39;s result. Splitting them costs two extra <code>npm ci</code> runs, but in exchange the PR&#39;s check list tells you the <em>kind</em> of failure — "typecheck is red" says more than "ci is red". In run ${RUN(36074781609)} all three started in the same second (23:51:21); lint and typecheck finished after 7 seconds, the two test jobs after 16 and 20.</p>
<p>The <code>typecheck</code> command deserves a sentence: the app is plain JavaScript with JSDoc comments and a <code>// @ts-check</code> line, and <code>tsc -p jsconfig.json</code> with <code>checkJs: true</code> checks types without compiling anything. That is the cheapest way to get a "type check" in CI for a JS project — and it is the same kind of step as the <code>npx tsc --noEmit</code> that api-backend&#39;s <code>ci-lint.yml</code> labels <em>"TypeScript type-check (required)"</em>.</p>

<h3>A real Postgres in CI: service containers</h3>
${slide('ga-15', 5, 'Service container: a real Postgres for each test job, 7–10 seconds')}
<p>The app&#39;s integration tests (<code>test/api.test.js</code>) open a real Postgres connection, create the table and call the API over HTTP. No mocks: what is being tested is a real <code>INSERT</code> hitting a real <code>UNIQUE (bac_si, bat_dau)</code> constraint and returning the real error code <code>23505</code>, so that the API answers 409. A mock would only test what the mock&#39;s author believed Postgres would do.</p>
<p><code>services:</code> tells the runner to start a <code>postgres:17-alpine</code> container before the job&#39;s first step and remove it after the last. The real log of job <code>test (24)</code>:</p>
<div class="out">Initialize containers                         23:51:24 → 23:51:34   (10 seconds)
...
LOG:  starting PostgreSQL 17.11 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
LOG:  database system is ready to accept connections
...
✔ healthz noi chuyen duoc voi Postgres (99.61961ms)
✔ dat lich roi doc lai (32.09624ms)
✔ trung khung gio cua cung bac si thi 409 (12.353354ms)
✔ yeu cau sai thi 400 kem danh sach loi (8.793627ms)
✔ lich hop le thi khong co loi (1.50792ms)
...
ℹ tests 8
ℹ pass 8
ℹ duration_ms 356.416741
Print service container logs: 9bc91dd8283a45c2abee671a0a6b4055_postgres17alpine_cc9a51
 ERROR:  duplicate key value violates unique constraint "lich_hen_bac_si_bat_dau_key"
 DETAIL:  Key (bac_si, bat_dau)=(BS Lan, 2026-10-01 09:30:00+00) already exists.</div>
<ul>
<li><strong>The three <code>--health-*</code> lines matter most.</strong> Without them the runner considers the container "up" as soon as the process starts — before Postgres accepts connections — and the first test fails now and then with <code>ECONNREFUSED</code>. With them, "Initialize containers" waits until <code>pg_isready</code> returns 0. The ten seconds above are exactly that wait (pull + initdb + ready).</li>
<li><strong><code>ports: ['5432:5432']</code> + <code>localhost</code></strong> because the job runs directly on the runner machine. If the job ran <em>inside</em> a container (<code>container:</code>, Lesson 13.3) you would drop <code>ports</code> and use the service name <code>postgres</code> as the host name.</li>
<li><strong>At the end of the job the runner prints the service container&#39;s log.</strong> The <code>duplicate key</code> line above looks like an error — it is the 409 test doing its job. Learn to read this block: when an integration test fails mysteriously, the answer is often here, not in Node&#39;s output.</li>
<li><strong>No password at all — on purpose.</strong> The database lives for seconds, listens only on that runner and is then deleted; <code>POSTGRES_HOST_AUTH_METHOD: trust</code> lets every connection in without a password. The file&#39;s first version wrote a fake password inline in the YAML — it protected nothing, and secret scanners (GitGuardian on this very course&#39;s PR) still flag strings of that shape as "Generic Password". Making it a secret would be worse: fork PRs cannot read secrets (Lesson 6.2), so they could not run the tests. Commit <code>acd5829</code> switched to <code>trust</code>; every run from ${RUN(36076856479)} on uses it.</li>
</ul>
<table>
<thead><tr><th>Getting a database for tests</th><th>Speed</th><th>Like production</th><th>When</th></tr></thead>
<tbody>
<tr><td>Mock the <code>pg</code> library</td><td>very fast</td><td>no — no constraints, no real types</td><td>pure logic; here it is split into <code>src/lich.js</code>, tested without a DB</td></tr>
<tr><td>In-memory SQLite</td><td>fast</td><td>half — different syntax and types from Postgres</td><td>almost never, if production is Postgres</td></tr>
<tr><td><strong><code>services: postgres</code></strong></td><td>+7–10 s per job</td><td><strong>yes — same major version as production</strong></td><td>the default for integration tests in CI</td></tr>
<tr><td>Testcontainers in test code</td><td>+a few seconds</td><td>yes</td><td>when you need several different databases, or the same setup on dev machines</td></tr>
</tbody>
</table>
<p>One more detail in <code>test/api.test.js</code>: every integration test has <code>{ skip: !process.env.DATABASE_URL }</code>. On a laptop without Postgres, <code>npm test</code> still runs the four unit tests and reports four tests <em>skipped</em> — not red. In CI, <code>DATABASE_URL</code> is always set at job level, so nothing is skipped. That is how one command works in both places without lying: the "skipped" count is printed right there on the screen.</p>

<h3>A Node 22/24 matrix, and why <code>fail-fast: false</code></h3>
<p>The app&#39;s production image is <code>node:22-alpine</code> (Lesson 15.2), the same as api-backend. Why test Node 24 too? Because 24 is the next LTS, and on the day you bump the base image you want a month of green CI history on 24 — not an evening of debugging. Two versions in the matrix mean "current" and "next", nothing more: each extra version costs another runner and another Postgres on every push.</p>
<p><code>fail-fast: false</code> has a concrete reason too. By default one red matrix entry cancels the others (Lesson 2.3). For a <em>version</em> matrix that loses information: "red on 24, green on 22" is a diagnosis; "red on 24, 22 cancelled" is not. In run ${RUN(36075106581)} below, both went red with the same assertion — and because you see both, you know at once that the bug has nothing to do with the Node version.</p>
<div class="callout"><p><strong>Look at your own repository.</strong> api-backend&#39;s <code>ci-lint.yml</code> installs Node <code>'22'</code> for the backend but <code>'20'</code> for the frontend — two jobs, two versions, no matrix. Node 20 is end-of-life; a <code>[22, 24]</code> matrix on the frontend would warn you before the day Next.js drops it.</p></div>

<h3>npm caching: measure before you trust it</h3>
${slide('ga-15', 6, 'npm cache, measured: for a small app the cache is SLOWER than installing')}
<p>The project brief says "cache npm, measure before and after". Here are the measurements, from two jobs of the same run ${RUN(36074781609)} — the branch&#39;s first run, when no cache existed yet:</p>
<table>
<thead><tr><th></th><th>job <code>lint</code> (cold)</th><th>job <code>test (24)</code> (warm)</th></tr></thead>
<tbody>
<tr><td>setup-node says</td><td><code>npm cache is not found</code></td><td><code>Cache hit for: node-cache-Linux-x64-npm-1da59f56…</code></td></tr>
<tr><td>setup-node step</td><td>0.8 s</td><td>2.7 s (download 8,284,009 bytes at 5.9 MB/s + extract)</td></tr>
<tr><td><code>npm ci</code></td><td>2.27 s — <code>added 172 packages in 2s</code></td><td>1.57 s — <code>added 172 packages in 1s</code></td></tr>
<tr><td><strong>Total</strong></td><td><strong>≈ 3.1 s</strong></td><td><strong>≈ 4.3 s</strong></td></tr>
<tr><td>End of job</td><td><code>Cache saved with the key: node-cache-…-1da59f56…</code></td><td><code>Cache hit occurred on the primary key …, not saving cache.</code></td></tr>
</tbody>
</table>
<p>With 172 packages, <strong>the cache makes the job about 1.2 seconds slower</strong>. Downloading and extracting an 8 MB tarball from the cache service takes longer than letting npm fetch the packages from the registry over Azure&#39;s very fast network. That is not a misconfiguration; it is physics. Caching <code>~/.npm</code> only starts to win when a cold <code>npm ci</code> takes twenty-odd seconds or more — projects the size of api-backend or a Next.js frontend, not the size of this app.</p>
<p>Three more things the measurements show, which you will meet again in real repositories:</p>
<ul>
<li><strong>A cache is saved in the middle of a run, and later jobs use it immediately.</strong> <code>lint</code> finished and saved at 23:51:27; <code>test (24)</code> started setup-node at 23:51:35 and <em>hit</em>. So "the first run is always cold" is only true for the jobs that start together.</li>
<li><strong>The key is a hash of <code>package-lock.json</code>.</strong> This lesson&#39;s PR bumps <code>version</code> to 1.1.0 — and <code>npm install</code> writes that number into the lockfile too. No package changed, but the hash did: the new key is <code>…-682e28bd…</code>, and the PR&#39;s first job was cold again. setup-node has no <code>restore-keys</code> to fall back to a near match; a hand-written <code>actions/cache</code> does (Lesson 5.2).</li>
<li><strong>setup-node v7 turns on package-manager caching by default.</strong> The <code>with:</code> block in the log shows a line nobody wrote: <code>package-manager-cache: true</code>. Reading the <code>with:</code> block helped you once in Lesson 12.2; here it tells you a new action version changed a default.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — adding a cache because "everyone does".</strong> A cache is not free: it uses the repository&#39;s 10 GB allowance (the default as of 09/2026; entries not read for 7 days are evicted), it adds a step that can break, and, as measured above, it can slow you down. Rule: measure the cold job first. If <code>npm ci</code> is under ~10 seconds, leave it alone. Over ~20 seconds, turn the cache on and measure again. Put both numbers in the PR description — that is what a reviewer needs, not "added caching".</div>

<h3>concurrency: cancel the old run of the same PR</h3>
${slide('ga-15', 7, 'concurrency per PR number: a new push cancels the old run within seconds')}
<p>People push to a PR in bursts: fix, push, spot a typo, fix, push. Without <code>concurrency</code>, every push is a full run, and nobody needs the old run&#39;s result. Tested on PR <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/10" target="_blank" rel="noopener">#10</a>: commit <code>67c8475</code> opened the PR at 23:52:29 and commit <code>c251002</code> was pushed eight seconds later.</p>
<div class="out">run 36074874676  67c8475  created 23:52:29  → cancelled 23:52:56  (27 seconds)
  lint        Canceling since a higher priority waiting request for ch15-ci-10 exists
  typecheck   Canceling since a higher priority waiting request for ch15-ci-10 exists
  test (22)   Canceling since a higher priority waiting request for ch15-ci-10 exists
  test (24)   Canceling since a higher priority waiting request for ch15-ci-10 exists
  ci-ok       co job ket thuc voi 'cancelled' (lint typecheck test = cancelled cancelled cancelled)
run 36074887634  c251002  created 23:52:37  → success   23:54:00  (83 seconds)</div>
<p>The group name is <code>ch15-ci-10</code>: <code>github.event.pull_request.number</code> is 10. The <code>|| github.ref</code> part is only used when CI is called from <code>ch15-cd.yml</code> on a push — there is no PR number then, and the group becomes <code>ch15-ci-refs/heads/ch15-capstone</code>. Two different PRs get two different groups, so they never cancel each other. Had you set the group to <code>&#36;{{ github.workflow }}</code>, your PR would cancel your colleague&#39;s runs — a bug that is very hard to spot because it looks like "CI sometimes gets cancelled".</p>
<p>Notice the last line of the cancelled run: <strong><code>ci-ok</code> still ran, and went red</strong>. That is because <code>if: always()</code> really means always — even while the run is being cancelled. On an old commit that red mark is harmless (nobody merges an old commit). If it bothers you, <code>if: &#36;{{ !cancelled() }}</code> makes the job skip when the run is cancelled — but read the next section before changing it, because "skipped" is precisely the dangerous state.</p>
<div class="callout"><p><strong>When NOT to use <code>cancel-in-progress: true</code>.</strong> CI on PRs: yes. Deploy workflows: <em>never</em> — cancelling a deploy halfway leaves production half old, half new. api-backend itself is the evidence: <code>deploy-ghcr.yml</code> still has <code>cancel-in-progress: true</code> with the comment "cancel older in-flight runs so a fast follow-up commit doesn&#39;t queue". Lesson 15.3 builds the deploy lock with <code>false</code> and measures it.</p></div>

<h3>One aggregate check to make required</h3>
${slide('ga-15', 8, 'Aggregate check: a “skip” slips through, only an always() job blocks a red PR')}
<p>A required status check (Lesson 14.1) blocks merging until the chosen checks are green. You could pick every job — <code>lint</code>, <code>typecheck</code>, <code>test (22)</code>, <code>test (24)</code> — but that list drifts the first time someone adds Node 26 to the matrix: the new check is not required, and the old <code>test (22)</code> stays required forever without ever appearing again. The standard answer is <strong>one</strong> aggregate job that reads every other job&#39;s result, and making only that job required.</p>
<p>Writing that aggregate job has a trap the docs state in one sentence: <em>"A job that is skipped will report its status as "Success". It will not prevent a pull request from merging, even if it is a required check."</em> To show it, <code>ch15-ci.yml</code> has two aggregate jobs — one naive, one correct — and PR #10 has a commit that breaks a test on purpose:</p>
<div class="out">commit f28d29a  "bo ::int cho gon"   (drop ::int to tidy up)
- 'SELECT bac_si AS "bacSi", count(*)::int AS "soLich" ...'
+ 'SELECT bac_si AS "bacSi", count(*) AS "soLich" ...'

run 36075106581:
  lint                 ✓  7s
  typecheck            ✓  8s
  test (22)            ✗  AssertionError [ERR_ASSERTION]
  test (24)            ✗  AssertionError [ERR_ASSERTION]
      actual:   [ { bacSi: 'BS Hoa', soLich: '1' }, { bacSi: 'BS Lan', soLich: '1' } ],
      expected: [ { bacSi: 'BS Hoa', soLich: 1 }, { bacSi: 'BS Lan', soLich: 1 } ],
      operator: 'deepStrictEqual'
  tong-hop-ngay-tho    ⊘  skipped (0s)
  ci-ok                ✗  ket qua: success success failure
                          co job ket thuc voi 'failure' (lint typecheck test = success success failure)</div>
<ul>
<li><strong><code>tong-hop-ngay-tho</code></strong> ("naive aggregate") only has <code>needs:</code>. When a job it needs fails, it is <em>skipped</em> — and skipped counts as Success. Were it the required check, this red PR could be merged.</li>
<li><strong><code>ci-ok</code></strong> has <code>if: always()</code>, so it always runs and reads <code>join(needs.*.result, ' ')</code> itself. Note that the <code>test</code> matrix collapses into <em>one</em> result (<code>failure</code>) — enough to decide, with no need to list <code>test (22)</code> and <code>test (24)</code>.</li>
<li><strong>And the bug it caught is real.</strong> Postgres&#39;s <code>count(*)</code> is a <code>bigint</code>; the <code>pg</code> library returns <code>bigint</code> as a <em>string</em> so no precision is lost. Dropping <code>::int</code> "to tidy up" turns the API&#39;s <code>1</code> into <code>"1"</code> — a frontend that checks <code>soLich &gt; 0</code> still works, one that sums <code>total + soLich</code> starts concatenating strings. Without integration tests against a real Postgres, this goes straight to production.</li>
</ul>
<p>Commit <code>d26f4f8</code> put <code>::int</code> back, run ${RUN(36075189881)} went green in 28 seconds, and the PR was ready to merge.</p>
<div class="pitfall co-tieu-de"><strong>Second trap — a required check inside a workflow that has <code>paths</code>.</strong> Same docs page: if the whole <em>workflow</em> is skipped by a <code>paths</code> or branch filter, its checks stay <strong>Pending</strong> forever, and the PR is blocked — the opposite of a skipped job. A PR that only touches the README can never merge. Two ways out: remove <code>paths</code> from the workflow that holds the required check and filter inside it (a small job decides whether the heavy part runs, Lesson 14.4), or use a ruleset setting that fits the case. The sandbox keeps <code>paths</code> because no rule is required there yet — see the note below.</div>
<div class="callout warn"><p><strong>⏳ Not yet run for real in the cloud: making <code>ci-ok</code> a required status check.</strong> Creating a ruleset or branch protection needs admin rights on the repository, and the session that built this lesson had no tool that reaches that API. Everything above — both aggregate jobs, the skipped and failure results — is a real run; only GitHub refusing the Merge button has not been recorded. How to do it on your repository: Settings → Rules → Rulesets → New branch ruleset → branch <code>main</code> → enable "Require status checks to pass" → add <code>ci-ok</code>.</p></div>

<h3>Step by step: CI for an app with a database</h3>
<ol>
<li>Build a small app with at least one test that needs a real database (one <code>UNIQUE</code> constraint is enough). Move pure logic into its own file so some tests need no DB.</li>
<li>Write <code>.github/workflows/ci.yml</code> with <code>on: pull_request: branches: [main]</code> and <code>workflow_call:</code>.</li>
<li>Add three jobs <code>lint</code>, <code>typecheck</code>, <code>test</code>; <code>test</code> gets <code>services: postgres</code> with the three <code>--health-*</code> lines, and a <code>node: [22, 24]</code> matrix with <code>fail-fast: false</code>.</li>
<li>Add <code>concurrency</code> grouped by <code>github.event.pull_request.number || github.ref</code>, <code>cancel-in-progress: true</code>.</li>
<li>Add a <code>ci-ok</code> job with <code>if: always()</code> that reads <code>join(needs.*.result, ' ')</code>.</li>
<li>Open a PR; push two commits a few seconds apart and find the line <code>Canceling since a higher priority waiting request</code>.</li>
<li>Push a commit that breaks a test; confirm <code>ci-ok</code> is red. Then make <code>ci-ok</code> required and confirm the Merge button is blocked.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How does your CI run integration tests against a database?</strong><br>A: A service container on the same major version as production, with a health check so the job waits for the database, and data reset at the start of each suite. Pure logic is split out so it can be tested without a DB. No mocking the DB driver in integration tests — a mock only tests its author&#39;s assumptions.</p>
<p><strong>Q: Your CI has eight jobs. Which one do you make required?</strong><br>A: One aggregate job that runs with <code>if: always()</code> and fails itself if any result is not <code>success</code>. Not each job: the list drifts as soon as the matrix changes, and a skipped job counts as Success.</p>
<p><strong>Q: Two people keep pushing to the same PR. How do you avoid wasting runners?</strong><br>A: <code>concurrency</code> grouped by PR number with <code>cancel-in-progress: true</code>. The group must contain the PR number, not just the workflow name, or one PR cancels another&#39;s runs. And never <code>cancel-in-progress: true</code> for deployments.</p>
<p><strong>Q: Does caching always make CI faster?</strong><br>A: No. Measured: with 172 npm packages, an 8 MB cache made the job ~1.2 seconds slower because download + extract took longer than installing. Measure the cold job first, cache only when installing is slow enough, and remember the key changes whenever the lockfile changes.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your repository has CI running on every push, but nothing blocks a merge. Turn it into a real front door for PRs.</p><ol>
<li>Add (or edit) <code>.github/workflows/ci.yml</code> so it runs on <code>pull_request</code> into <code>main</code>, with <code>concurrency</code> per PR number and <code>timeout-minutes</code> on every job.</li>
<li>If the app has a database: add <code>services:</code> with a health check. If not: add a two-version Node matrix with <code>fail-fast: false</code>.</li>
<li>Add a <code>ci-ok</code> job (<code>if: always()</code>, reading <code>needs.*.result</code>).</li>
<li>Open a PR, push twice in a row, then push a commit that breaks a test.</li>
<li>Write down the <code>npm ci</code> step time of one cold job and one job with a cache hit.</li>
</ol><p><strong>Done when:</strong> <code>gh run list --branch &lt;pr-branch&gt;</code> shows a <code>cancelled</code> run with the annotation <code>Canceling since a higher priority waiting request</code>; the run with a failing test shows <code>ci-ok</code> ✗ (not ⊘); and you have the two cold/warm numbers to decide whether to keep the cache.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">service container</span><span class="v">a side container (DB, Redis…) the runner starts before a job&#39;s first step and removes after its last</span></div>
<div class="kv"><span class="k">health check</span><span class="v"><code>--health-cmd</code>, so the runner waits until the service actually accepts connections</span></div>
<div class="kv"><span class="k">version matrix</span><span class="v">the same job on several runtime versions; pairs with <code>fail-fast: false</code></span></div>
<div class="kv"><span class="k">cache hit / miss</span><span class="v">key exists (download it) / does not (install cold, save at job end)</span></div>
<div class="kv"><span class="k">concurrency group</span><span class="v">a lock name; same name ⇒ at most one running and one pending run</span></div>
<div class="kv"><span class="k">required status check</span><span class="v">a check that must be green before merging; a skipped job counts as green</span></div>
<div class="kv"><span class="k">aggregate job</span><span class="v">an <code>if: always()</code> job that reads every other job&#39;s result — the one required check</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>PR CI = lint + typecheck + test in parallel, <code>permissions: contents: read</code>, <code>timeout-minutes</code>, and called again by CD via <code>workflow_call</code> on exactly the commit to deploy.</li>
<li>Integration tests use <code>services: postgres</code> on the production version; the three <code>--health-*</code> lines are what keeps them from flaking.</li>
<li>A Node 22/24 matrix with <code>fail-fast: false</code> tells you whether a failure depends on the version.</li>
<li>With 172 packages the npm cache made the job 1.2 s slower — measure the cold job first; the key changes with every lockfile change.</li>
<li><code>concurrency</code> per PR number cancels the old run within seconds; never <code>cancel-in-progress: true</code> for deploys.</li>
<li>Make ONE <code>if: always()</code> aggregate job the required check: a skipped job counts as green, and a workflow filtered out by <code>paths</code> stays Pending forever.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating PostgreSQL service containers</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers — <code>services:</code>, <code>ports</code>, health options, running on the runner or in a container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using conditions to control job execution</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions — "A job that is skipped will report its status as Success… even if it is a required check".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control the concurrency of workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency — "at most one running and one pending job in a concurrency group".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — the 10 GB per-repository limit, eviction after 7 days unused (09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch15-capstone and PR #10</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone · /pull/10 — the app, <code>ch15-ci.yml</code>, the PR&#39;s four runs (cancelled, green, red, green).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — containers, ports and health checks</span><span class="lc-sub">/courses/docker/learn${REF} — the same mechanism <code>services:</code> uses underneath.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>CI cho pull request: bốn job, một Postgres thật, và một check bạn dám đặt làm bắt buộc</h2>
<p class="lead">Mười bốn chương trước dạy từng mảnh. Chương này ghép chúng thành một thứ duy nhất mà một nhà tuyển dụng có thể mở ra và bấm vào: một app thật, một kho thật, một pipeline đi từ pull request tới production mà không bước nào phải làm tay. Bài đầu tiên dựng cổng vào của pipeline — CI cho pull request — và đo từng quyết định thay vì tin nó.</p>

<p>App của dự án là <strong>"Đặt lịch phòng khám"</strong>: bệnh nhân chọn bác sĩ và khung giờ 30 phút, hệ thống từ chối lịch ngoài giờ làm việc và từ chối hai người cùng đặt một bác sĩ vào cùng một giờ. Nó cố ý nhỏ — khoảng 150 dòng Express 5 + thư viện <code>pg</code>, một trang HTML tĩnh, một bảng Postgres — vì thứ được chấm ở chương này là <em>pipeline</em>, không phải app. Nhưng nó có đúng những thứ làm CI trở nên thật: một cơ sở dữ liệu, một ràng buộc <code>UNIQUE</code> mà chỉ Postgres thật mới kiểm được, hai phiên bản Node, và một Dockerfile.</p>
<p>Toàn bộ mã nằm ở nhánh <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone" target="_blank" rel="noopener"><code>ch15-capstone</code></a> của sân tập công khai. Mọi run, mọi log, mọi con số trong chương đều lấy từ nhánh đó, ngày 24–25/09/2026, runner 2.337.0, ảnh <code>ubuntu-24.04</code> bản 20260920.314.1.</p>
<div class="out">ch15/
├── app/                      # app "Dat lich phong kham"
│   ├── src/lich.js           # luat dat lich — ham THUAN, test trong vai ms
│   ├── src/db.js             # pool pg + CREATE TABLE ... UNIQUE (bac_si, bat_dau)
│   ├── src/app.js            # Express 5: /healthz, GET/POST /api/lich, /api/bac-si
│   ├── src/server.js         # doi Postgres toi 10 lan roi moi nghe cong
│   ├── public/index.html     # "frontend" tinh
│   ├── test/lich.test.js     # 4 test don vi
│   ├── test/api.test.js      # 5 test tich hop — can Postgres THAT
│   ├── Dockerfile            # multi-stage (bai 15.2)
│   └── package.json          # lint / typecheck / test
└── deploy/                   # "VPS" gia lap cho bai 15.3
.github/workflows/
├── ch15-ci.yml               # bai nay
└── ch15-cd.yml               # 15.2 + 15.3</div>

<h3>Cả pipeline trong một hình</h3>
${slide('ga-15', 3, 'Một push = một run: CI → dựng ảnh MỘT lần → deploy ảnh đó')}
<p>Trước khi viết dòng YAML đầu tiên, hãy nhìn đích đến. Pipeline có hai đường vào, và cả hai đều đi qua cùng một tệp CI:</p>
<ul>
<li><strong>Pull request vào <code>ch15-capstone</code></strong> — chạy <code>ch15-ci.yml</code> và chỉ thế thôi. Không dựng ảnh, không deploy. Đây là phần bài này dựng.</li>
<li><strong>Push vào <code>ch15-capstone</code></strong> (tức là merge PR) — chạy <code>ch15-cd.yml</code>, và job đầu tiên của nó là <code>uses: ./.github/workflows/ch15-ci.yml</code> — <em>gọi lại</em> đúng tệp CI qua <code>workflow_call</code> (Bài 12.1). Chỉ khi cả bốn job CI xanh thì mới tới job <code>anh</code> (15.2) và <code>trien-khai</code> (15.3).</li>
</ul>
<p>Tại sao lại chạy CI hai lần — một lần trên PR, một lần sau merge? Vì thứ được deploy là <em>commit sau merge</em>, không phải commit trên nhánh PR. Hai PR xanh riêng lẻ vẫn có thể đỏ khi ghép lại. Chạy lại CI trên đúng commit sẽ deploy là cái giá rẻ nhất để có câu "không có đường nào deploy một thứ CI chưa kiểm". Run đầu tiên của nhánh, ${RUN(36074781609)}, cho thấy hình dạng ấy trong đồ thị: bốn job <code>ci / …</code> trong một nhóm, rồi <code>anh</code> 54 giây, rồi <code>trien-khai</code>.</p>

<h3>Tệp <code>ch15-ci.yml</code>, từng khối</h3>
${slide('ga-15', 4, 'ch15-ci.yml: ba job song song, một job tổng hợp, một khoá theo PR')}
<pre><code class="language-yaml">name: ch15 · CI
on:
  pull_request:
    branches: [ch15-capstone]
    paths: ['ch15/app/**', '.github/workflows/ch15-ci.yml']
  workflow_call:

permissions:
  contents: read

concurrency:
  group: ch15-ci-&#36;{{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

defaults:
  run:
    working-directory: ch15/app

jobs:
  lint:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: ch15/app/package-lock.json
      - run: npm ci --no-audit --no-fund
      - run: npm run lint
  # typecheck: giong het, chi khac buoc cuoi: npm run typecheck
  test:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    strategy:
      fail-fast: false
      matrix:
        node: [22, 24]
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_HOST_AUTH_METHOD: trust
        ports: ['5432:5432']
        options: &gt;-
          --health-cmd "pg_isready -U postgres"
          --health-interval 2s
          --health-timeout 3s
          --health-retries 15
    env:
      DATABASE_URL: postgres://postgres@localhost:5432/postgres
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: &#36;{{ matrix.node }}
          cache: npm
          cache-dependency-path: ch15/app/package-lock.json
      - run: npm ci --no-audit --no-fund
      - run: npm test
  ci-ok:
    if: always()
    needs: [lint, typecheck, test]
    runs-on: ubuntu-24.04
    steps:
      - name: Doc ket qua cac job
        working-directory: .
        env:
          KQ: &#36;{{ join(needs.*.result, ' ') }}
        run: |
          echo "ket qua: $KQ"
          for r in $KQ; do
            if [ "$r" != "success" ]; then
              echo "::error title=CI chua xanh::co job ket thuc voi '$r' (lint typecheck test = $KQ)"
              exit 1
            fi
          done</code></pre>
<table>
<thead><tr><th>Khối</th><th>Viết gì</th><th>Vì sao (và nó đến từ chương nào)</th></tr></thead>
<tbody>
<tr><td><code>on.pull_request.branches</code></td><td><code>[ch15-capstone]</code></td><td>Lọc theo nhánh <em>đích</em> của PR, không phải nhánh nguồn (Bài 1.3). Trong kho thật đây là <code>[main]</code>.</td></tr>
<tr><td><code>on.pull_request.paths</code></td><td><code>ch15/app/**</code> + chính tệp workflow</td><td>PR chỉ sửa tài liệu không tốn phút nào. Nhưng xem cái bẫy "Pending mãi" ở cuối bài trước khi đặt check bắt buộc.</td></tr>
<tr><td><code>on.workflow_call</code></td><td>(rỗng)</td><td>Để <code>ch15-cd.yml</code> gọi lại đúng tệp này (Bài 12.1) — một nguồn sự thật cho "CI xanh nghĩa là gì".</td></tr>
<tr><td><code>permissions</code></td><td><code>contents: read</code></td><td>CI chỉ cần đọc mã. Log "Set up job" của job <code>ci-ok</code> in đúng hai dòng: <code>Contents: read</code>, <code>Metadata: read</code> (Bài 6.3).</td></tr>
<tr><td><code>concurrency</code></td><td>một nhóm cho mỗi số PR</td><td>Push mới vào PR hủy run cũ — đo ở mục dưới.</td></tr>
<tr><td><code>defaults.run.working-directory</code></td><td><code>ch15/app</code></td><td>App nằm sâu trong một kho nhiều thứ, y như <code>frontend/</code> của api-backend. Viết một lần thay vì mười lần.</td></tr>
<tr><td><code>timeout-minutes</code></td><td><code>10</code></td><td>Mặc định là 360 phút. Một test treo sẽ đốt sáu giờ runner nếu không có dòng này (Bài 10.2).</td></tr>
</tbody>
</table>
<p>Ba job <code>lint</code>, <code>typecheck</code>, <code>test</code> chạy song song vì không job nào cần kết quả của job nào. Tách ra tốn thêm hai lần <code>npm ci</code> nhưng đổi lại bạn thấy ngay <em>loại</em> lỗi trên danh sách check của PR — "typecheck đỏ" nói nhiều hơn "ci đỏ". Ở run ${RUN(36074781609)} cả ba bắt đầu trong cùng một giây (23:51:21); lint và typecheck xong sau 7 giây, hai job test sau 16 và 20 giây.</p>
<p>Lệnh <code>typecheck</code> đáng một dòng giải thích: app viết bằng JavaScript thuần có chú thích JSDoc và dòng <code>// @ts-check</code>, rồi <code>tsc -p jsconfig.json</code> với <code>checkJs: true</code> kiểm kiểu mà không cần biên dịch. Đó là cách rẻ nhất để có "type check" trong CI cho một dự án JS — và là cùng một bước <code>npx tsc --noEmit</code> mà <code>ci-lint.yml</code> của api-backend đặt tên là <em>"TypeScript type-check (required)"</em>.</p>

<h3>Postgres thật trong CI: service container</h3>
${slide('ga-15', 5, 'Service container: Postgres thật cho mỗi job test, 7–10 giây')}
<p>Test tích hợp của app (<code>test/api.test.js</code>) mở một kết nối Postgres thật, tạo bảng, rồi gọi API qua HTTP. Không mock: cái được kiểm là câu <code>INSERT</code> thật đụng vào ràng buộc <code>UNIQUE (bac_si, bat_dau)</code> thật và trả về mã lỗi <code>23505</code> thật, để API trả 409. Một mock sẽ chỉ kiểm cái mà người viết mock nghĩ Postgres sẽ làm.</p>
<p><code>services:</code> bảo runner khởi động một container <code>postgres:17-alpine</code> trước bước đầu tiên của job, và gỡ nó sau bước cuối. Log thật của job <code>test (24)</code>:</p>
<div class="out">Initialize containers                         23:51:24 → 23:51:34   (10 giay)
...
LOG:  starting PostgreSQL 17.11 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
LOG:  database system is ready to accept connections
...
✔ healthz noi chuyen duoc voi Postgres (99.61961ms)
✔ dat lich roi doc lai (32.09624ms)
✔ trung khung gio cua cung bac si thi 409 (12.353354ms)
✔ yeu cau sai thi 400 kem danh sach loi (8.793627ms)
✔ lich hop le thi khong co loi (1.50792ms)
...
ℹ tests 8
ℹ pass 8
ℹ duration_ms 356.416741
Print service container logs: 9bc91dd8283a45c2abee671a0a6b4055_postgres17alpine_cc9a51
 ERROR:  duplicate key value violates unique constraint "lich_hen_bac_si_bat_dau_key"
 DETAIL:  Key (bac_si, bat_dau)=(BS Lan, 2026-10-01 09:30:00+00) already exists.</div>
<ul>
<li><strong>Ba dòng <code>--health-*</code> là thứ quan trọng nhất.</strong> Không có chúng, runner coi container "đã chạy" ngay khi tiến trình khởi động — trước khi Postgres nhận kết nối — và test đầu tiên sẽ thỉnh thoảng đỏ với <code>ECONNREFUSED</code>. Có chúng, bước "Initialize containers" chờ tới khi <code>pg_isready</code> trả 0. Mười giây ở trên chính là thời gian chờ ấy (kéo ảnh + initdb + sẵn sàng).</li>
<li><strong><code>ports: ['5432:5432']</code> + <code>localhost</code></strong> vì job chạy thẳng trên máy runner. Nếu job chạy <em>trong</em> một container (<code>container:</code>, Bài 13.3), bạn bỏ <code>ports</code> và dùng tên service <code>postgres</code> làm hostname.</li>
<li><strong>Cuối job, runner tự in log của service container.</strong> Dòng <code>duplicate key</code> ở trên trông như lỗi — nhưng đó chính là test 409 đang làm việc của nó. Học cách đọc khối này: khi test tích hợp đỏ khó hiểu, câu trả lời thường nằm ở đây, không nằm ở log của Node.</li>
<li><strong>Không có mật khẩu nào — và đó là cố ý.</strong> DB chỉ sống vài giây, chỉ nghe trên runner đó, rồi bị xoá; <code>POSTGRES_HOST_AUTH_METHOD: trust</code> cho mọi kết nối vào mà không cần mật khẩu. Bản đầu của tệp viết thẳng một mật khẩu giả vào YAML — nó chẳng bảo vệ gì, và máy quét secret (GitGuardian trên PR của chính khoá học này) vẫn báo "Generic Password" với chuỗi dạng ấy. Biến nó thành secret thì còn tệ hơn: PR từ fork không đọc được secret (Bài 6.2) nên không chạy được test. Commit <code>acd5829</code> đổi sang <code>trust</code>; mọi run từ ${RUN(36076856479)} trở đi dùng bản này.</li>
</ul>
<table>
<thead><tr><th>Cách có DB cho test</th><th>Nhanh</th><th>Giống production</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td>Mock thư viện <code>pg</code></td><td>rất nhanh</td><td>không — không có ràng buộc, không có kiểu thật</td><td>logic thuần; ở đây đã tách ra <code>src/lich.js</code> và test không cần DB</td></tr>
<tr><td>SQLite trong bộ nhớ</td><td>nhanh</td><td>một nửa — cú pháp và kiểu khác Postgres</td><td>hầu như không bao giờ, nếu production là Postgres</td></tr>
<tr><td><strong><code>services: postgres</code></strong></td><td>+7–10 giây/job</td><td><strong>có — cùng phiên bản chính với production</strong></td><td>mặc định cho test tích hợp trong CI</td></tr>
<tr><td>Testcontainers trong mã test</td><td>+vài giây</td><td>có</td><td>khi cần nhiều DB khác nhau hoặc chạy giống hệt trên máy dev</td></tr>
</tbody>
</table>
<p>Còn một chi tiết trong <code>test/api.test.js</code>: mọi test tích hợp có <code>{ skip: !process.env.DATABASE_URL }</code>. Trên máy không bật Postgres, <code>npm test</code> vẫn chạy bốn test đơn vị và báo bốn test <em>skipped</em> — không đỏ. Trong CI, <code>DATABASE_URL</code> luôn được đặt ở mức job, nên không test nào bị bỏ qua. Đó là cách để cùng một lệnh dùng được ở cả hai nơi mà không nói dối: con số "skipped" hiện ngay trên màn hình.</p>

<h3>Ma trận Node 22/24, và vì sao <code>fail-fast: false</code></h3>
<p>Production của app chạy <code>node:22-alpine</code> (Bài 15.2), giống hệt api-backend. Vậy tại sao test cả Node 24? Vì 24 là bản LTS kế tiếp, và cái ngày bạn nâng cấp ảnh nền, bạn muốn đã có một tháng lịch sử CI xanh trên 24 — không phải một buổi tối dò lỗi. Hai phiên bản trong ma trận là "hiện tại" và "sắp tới", không hơn: mỗi phiên bản thêm là thêm một runner và một Postgres cho mỗi lần push.</p>
<p><code>fail-fast: false</code> cũng có lý do cụ thể. Mặc định, một phần tử ma trận đỏ sẽ hủy các phần tử còn lại (Bài 2.3). Với ma trận <em>phiên bản</em>, đó là mất thông tin: "đỏ trên 24 nhưng xanh trên 22" là một chẩn đoán, "đỏ trên 24, 22 bị hủy" thì không. Ở run ${RUN(36075106581)} bên dưới, cả hai đều đỏ với cùng một assertion — và nhờ thấy cả hai, bạn biết ngay lỗi không liên quan tới phiên bản Node.</p>
<div class="callout"><p><strong>Soi repo của chính bạn.</strong> <code>ci-lint.yml</code> của api-backend cài Node <code>'22'</code> cho backend nhưng <code>'20'</code> cho frontend — hai job, hai phiên bản, không có ma trận nào. Node 20 đã hết hỗ trợ; một ma trận <code>[22, 24]</code> ở frontend sẽ báo trước cái ngày Next.js bỏ hỗ trợ nó.</p></div>

<h3>Cache npm: đo trước khi tin</h3>
${slide('ga-15', 6, 'Cache npm đo thật: với app nhỏ, cache CHẬM hơn tự cài')}
<p>Brief của dự án nói "cache npm, đo thời gian trước/sau". Đây là số đo, lấy từ hai job của cùng run ${RUN(36074781609)} — run đầu tiên của nhánh, khi chưa có cache nào:</p>
<table>
<thead><tr><th></th><th>job <code>lint</code> (lạnh)</th><th>job <code>test (24)</code> (nóng)</th></tr></thead>
<tbody>
<tr><td>setup-node nói</td><td><code>npm cache is not found</code></td><td><code>Cache hit for: node-cache-Linux-x64-npm-1da59f56…</code></td></tr>
<tr><td>Bước setup-node</td><td>0,8 giây</td><td>2,7 giây (tải 8 284 009 byte ở 5,9 MB/s + giải nén)</td></tr>
<tr><td><code>npm ci</code></td><td>2,27 giây — <code>added 172 packages in 2s</code></td><td>1,57 giây — <code>added 172 packages in 1s</code></td></tr>
<tr><td><strong>Cộng</strong></td><td><strong>≈ 3,1 giây</strong></td><td><strong>≈ 4,3 giây</strong></td></tr>
<tr><td>Cuối job</td><td><code>Cache saved with the key: node-cache-…-1da59f56…</code></td><td><code>Cache hit occurred on the primary key …, not saving cache.</code></td></tr>
</tbody>
</table>
<p>Với 172 gói, <strong>cache làm job chậm hơn khoảng 1,2 giây</strong>. Tải và giải nén một tarball 8 MB từ dịch vụ cache tốn nhiều thời gian hơn để npm tự tải các gói từ registry qua mạng rất nhanh của Azure. Đây không phải lỗi cấu hình; đây là vật lý. Cache <code>~/.npm</code> chỉ bắt đầu thắng khi <code>npm ci</code> lạnh mất cỡ hai chục giây trở lên — tức là các dự án cỡ api-backend hay một frontend Next.js, không phải cỡ app này.</p>
<p>Ba điều khác mà số đo cho thấy, và bạn sẽ gặp lại ở repo thật:</p>
<ul>
<li><strong>Cache được lưu giữa chừng một run, và job sau dùng được ngay.</strong> Job <code>lint</code> xong và lưu cache lúc 23:51:27; job <code>test (24)</code> bắt đầu setup-node lúc 23:51:35 và đã <em>hit</em>. Nên "run đầu tiên luôn lạnh" chỉ đúng cho các job khởi động cùng lúc.</li>
<li><strong>Khoá là hash của <code>package-lock.json</code>.</strong> PR của bài này nâng <code>version</code> lên 1.1.0 — và <code>npm install</code> ghi con số đó vào cả lockfile. Không gói nào đổi, nhưng hash đổi: khoá mới là <code>…-682e28bd…</code>, và job đầu tiên của PR lại lạnh. setup-node không có <code>restore-keys</code> để rơi về khoá gần đúng; <code>actions/cache</code> viết tay thì có (Bài 5.2).</li>
<li><strong>setup-node v7 bật cache cho trình quản lý gói theo mặc định.</strong> Khối <code>with:</code> trong log in thêm một dòng không ai viết: <code>package-manager-cache: true</code>. Đọc khối <code>with:</code> đã giúp bạn một lần ở Bài 12.2; ở đây nó cho biết phiên bản mới của action đã đổi hành vi mặc định.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — thêm cache vì "ai cũng thêm".</strong> Cache không miễn phí: nó chiếm hạn mức 10 GB của kho (mặc định, tính đến 09/2026; entry không được đọc trong 7 ngày bị xoá), nó thêm một bước có thể hỏng, và như đo ở trên, nó có thể làm chậm. Quy tắc: đo job lạnh trước. Nếu <code>npm ci</code> dưới ~10 giây, để nguyên. Nếu trên ~20 giây, bật cache rồi đo lại. Ghi hai con số vào mô tả PR — đó là thứ người review cần, không phải "đã thêm cache".</div>

<h3>concurrency: hủy run cũ của cùng một PR</h3>
${slide('ga-15', 7, 'concurrency theo số PR: push mới hủy run cũ trong vài giây')}
<p>Người ta push vào PR theo từng đợt: sửa, push, thấy lỗi chính tả, sửa, push. Không có <code>concurrency</code>, mỗi lần push là một run đầy đủ, và kết quả của run cũ chẳng còn ai cần. Thử thật trên PR <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/10" target="_blank" rel="noopener">#10</a>: commit <code>67c8475</code> mở PR lúc 23:52:29, commit <code>c251002</code> được push tám giây sau.</p>
<div class="out">run 36074874676  67c8475  created 23:52:29  → cancelled 23:52:56  (27 giay)
  lint        Canceling since a higher priority waiting request for ch15-ci-10 exists
  typecheck   Canceling since a higher priority waiting request for ch15-ci-10 exists
  test (22)   Canceling since a higher priority waiting request for ch15-ci-10 exists
  test (24)   Canceling since a higher priority waiting request for ch15-ci-10 exists
  ci-ok       co job ket thuc voi 'cancelled' (lint typecheck test = cancelled cancelled cancelled)
run 36074887634  c251002  created 23:52:37  → success   23:54:00  (83 giay)</div>
<p>Tên nhóm là <code>ch15-ci-10</code>: <code>github.event.pull_request.number</code> là 10. Vế <code>|| github.ref</code> chỉ dùng khi CI được gọi từ <code>ch15-cd.yml</code> trên push — lúc đó không có số PR, và nhóm thành <code>ch15-ci-refs/heads/ch15-capstone</code>. Hai PR khác nhau có hai nhóm khác nhau, nên chúng không bao giờ hủy lẫn nhau. Nếu bạn lỡ đặt nhóm là <code>&#36;{{ github.workflow }}</code>, PR của bạn sẽ hủy run của PR đồng nghiệp — một lỗi rất khó nhận ra vì nó trông như "CI thỉnh thoảng bị hủy".</p>
<p>Để ý dòng cuối của run bị hủy: <strong><code>ci-ok</code> vẫn chạy, và đỏ</strong>. Đó là vì <code>if: always()</code> nghĩa đúng là "luôn luôn" — kể cả khi run đang bị hủy. Trên commit cũ, cái dấu đỏ ấy vô hại (không ai merge commit cũ). Nếu nó làm bạn khó chịu, <code>if: &#36;{{ !cancelled() }}</code> cho job bỏ qua khi run bị hủy — nhưng hãy đọc mục kế tiếp trước khi đổi, vì "bỏ qua" chính là thứ nguy hiểm.</p>
<div class="callout"><p><strong>Khi nào KHÔNG dùng <code>cancel-in-progress: true</code>.</strong> CI trên PR: dùng. Workflow deploy: <em>không bao giờ</em> — hủy một deploy đang dở là để production ở trạng thái nửa cũ nửa mới. Chính api-backend là bằng chứng: <code>deploy-ghcr.yml</code> vẫn còn <code>cancel-in-progress: true</code> với chú thích "cancel older in-flight runs so a fast follow-up commit doesn't queue". Bài 15.3 dựng khoá deploy với <code>false</code> và đo nó.</p></div>

<h3>Một check tổng hợp để đặt làm bắt buộc</h3>
${slide('ga-15', 8, 'Check tổng hợp: “skip” lọt qua, job always() mới chặn PR đỏ')}
<p>Required status check (Bài 14.1) chặn merge cho tới khi các check được chọn xanh. Bạn có thể chọn từng job — <code>lint</code>, <code>typecheck</code>, <code>test (22)</code>, <code>test (24)</code> — nhưng danh sách ấy sẽ lệch ngay lần đầu có người thêm Node 26 vào ma trận: check mới không bắt buộc, check <code>test (22)</code> cũ thì bắt buộc mãi mà không bao giờ xuất hiện nữa. Cách chuẩn là <strong>một</strong> job tổng hợp đọc kết quả của mọi job khác, và chỉ đặt job đó làm bắt buộc.</p>
<p>Cách viết job tổng hợp ấy có một cái bẫy mà docs ghi rõ bằng một câu: <em>"A job that is skipped will report its status as "Success". It will not prevent a pull request from merging, even if it is a required check."</em> Để thấy nó, <code>ch15-ci.yml</code> có hai job tổng hợp — một viết ngây thơ, một viết đúng — và PR #10 có một commit cố ý làm đỏ test:</p>
<div class="out">commit f28d29a  "bo ::int cho gon"
- 'SELECT bac_si AS "bacSi", count(*)::int AS "soLich" ...'
+ 'SELECT bac_si AS "bacSi", count(*) AS "soLich" ...'

run 36075106581:
  lint                 ✓  7s
  typecheck            ✓  8s
  test (22)            ✗  AssertionError [ERR_ASSERTION]
  test (24)            ✗  AssertionError [ERR_ASSERTION]
      actual:   [ { bacSi: 'BS Hoa', soLich: '1' }, { bacSi: 'BS Lan', soLich: '1' } ],
      expected: [ { bacSi: 'BS Hoa', soLich: 1 }, { bacSi: 'BS Lan', soLich: 1 } ],
      operator: 'deepStrictEqual'
  tong-hop-ngay-tho    ⊘  skipped (0s)
  ci-ok                ✗  ket qua: success success failure
                          co job ket thuc voi 'failure' (lint typecheck test = success success failure)</div>
<ul>
<li><strong><code>tong-hop-ngay-tho</code></strong> chỉ có <code>needs:</code>. Khi một job nó cần đỏ, nó bị <em>skip</em> — và skip được tính là Success. Nếu đây là check bắt buộc, PR đỏ này merge được.</li>
<li><strong><code>ci-ok</code></strong> có <code>if: always()</code> nên luôn chạy, rồi tự đọc <code>join(needs.*.result, ' ')</code>. Để ý ma trận <code>test</code> gộp lại thành <em>một</em> kết quả (<code>failure</code>) — đủ để quyết định, không cần liệt kê <code>test (22)</code>, <code>test (24)</code>.</li>
<li><strong>Và cái lỗi được bắt là lỗi thật.</strong> <code>count(*)</code> trong Postgres có kiểu <code>bigint</code>; thư viện <code>pg</code> trả <code>bigint</code> dưới dạng <em>chuỗi</em> để không mất độ chính xác. Bỏ <code>::int</code> "cho gọn" là API đổi <code>1</code> thành <code>"1"</code> — frontend so <code>soLich &gt; 0</code> vẫn chạy, cộng dồn <code>tong + soLich</code> thì thành nối chuỗi. Không test tích hợp với Postgres thật, lỗi này đi thẳng lên production.</li>
</ul>
<p>Commit <code>d26f4f8</code> trả lại <code>::int</code>, run ${RUN(36075189881)} xanh sau 28 giây, và PR sẵn sàng merge.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy thứ hai — check bắt buộc nằm trong một workflow có <code>paths</code>.</strong> Cùng trang docs ấy: nếu cả <em>workflow</em> bị bỏ qua vì lọc <code>paths</code> hay nhánh, check của nó ở trạng thái <strong>Pending</strong> mãi mãi, và PR bị chặn — ngược hẳn với job bị skip. Một PR chỉ sửa README sẽ không bao giờ merge được. Hai cách thoát: bỏ <code>paths</code> khỏi workflow chứa check bắt buộc và lọc bên trong (một job nhỏ quyết định có chạy phần nặng không, Bài 14.4), hoặc dùng ruleset với "do not require status checks on creation" cho đúng trường hợp. Sân tập giữ <code>paths</code> vì ở đây chưa có luật bắt buộc nào — xem ghi chú bên dưới.</div>
<div class="callout warn"><p><strong>⏳ Chưa chạy thật trên cloud: đặt <code>ci-ok</code> làm required status check.</strong> Tạo ruleset hay branch protection cần quyền admin của kho, và phiên dựng bài này không có công cụ nào tới được API đó. Mọi thứ ở trên — hai job tổng hợp, kết quả skip và failure — là run thật; riêng việc GitHub từ chối nút Merge thì chưa được quay lại. Cách làm, trên kho của bạn: Settings → Rules → Rulesets → New branch ruleset → nhánh <code>main</code> → bật "Require status checks to pass" → thêm <code>ci-ok</code>.</p></div>
<!-- CHAY-O-MAY: tren ga-san-tap, tao ruleset cho nhanh ch15-capstone bat buoc check "ci-ok"; mo PR tu mot commit do (vd bo ::int lan nua) va chup lai nut Merge bi chan; roi xoa ruleset. -->

<h3>Chạy thử từng bước: CI cho một app có cơ sở dữ liệu</h3>
<ol>
<li>Tạo một app nhỏ có ít nhất một test cần DB thật (một ràng buộc <code>UNIQUE</code> là đủ). Tách phần logic thuần ra tệp riêng để có test không cần DB.</li>
<li>Viết <code>.github/workflows/ci.yml</code> với <code>on: pull_request: branches: [main]</code> và <code>workflow_call:</code>.</li>
<li>Thêm ba job <code>lint</code>, <code>typecheck</code>, <code>test</code>; job <code>test</code> có <code>services: postgres</code> với ba dòng <code>--health-*</code>, và ma trận <code>node: [22, 24]</code> với <code>fail-fast: false</code>.</li>
<li>Thêm <code>concurrency</code> nhóm theo <code>github.event.pull_request.number || github.ref</code>, <code>cancel-in-progress: true</code>.</li>
<li>Thêm job <code>ci-ok</code> với <code>if: always()</code> đọc <code>join(needs.*.result, ' ')</code>.</li>
<li>Mở một PR; push hai commit cách nhau vài giây và tìm dòng <code>Canceling since a higher priority waiting request</code>.</li>
<li>Push một commit làm đỏ một test; xác nhận <code>ci-ok</code> đỏ. Rồi đặt <code>ci-ok</code> làm check bắt buộc và xác nhận nút Merge bị chặn.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: CI của bạn chạy test tích hợp với cơ sở dữ liệu thế nào?</strong><br>Đ: Service container cùng phiên bản chính với production, có health check để job chờ DB sẵn sàng, dữ liệu dọn ở đầu mỗi bộ test. Logic thuần tách ra để test không cần DB. Không mock driver DB cho test tích hợp — mock chỉ kiểm giả định của người viết mock.</p>
<p><strong>H: Có tám job trong CI. Bạn đặt check bắt buộc nào?</strong><br>Đ: Một job tổng hợp chạy với <code>if: always()</code> và tự fail nếu có kết quả nào khác <code>success</code>. Không đặt từng job: danh sách lệch ngay khi ma trận đổi, và một job bị skip được tính là Success.</p>
<p><strong>H: Hai người push liên tục vào cùng một PR. Làm sao không tốn runner?</strong><br>Đ: <code>concurrency</code> với nhóm theo số PR và <code>cancel-in-progress: true</code>. Nhóm phải chứa số PR, không chỉ tên workflow, nếu không PR này hủy run của PR kia. Và không bao giờ dùng <code>cancel-in-progress: true</code> cho deploy.</p>
<p><strong>H: Cache có luôn làm CI nhanh hơn không?</strong><br>Đ: Không. Đo được: với 172 gói npm, cache 8 MB làm job chậm hơn ~1,2 giây vì tải + giải nén lâu hơn cài. Đo job lạnh trước, chỉ cache khi bước cài đặt đủ lâu, và nhớ khoá đổi mỗi lần lockfile đổi.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> repo của bạn đang có CI chạy mỗi push mà không có check nào chặn merge. Biến nó thành cổng vào thật cho PR.</p><ol>
<li>Thêm (hoặc sửa) <code>.github/workflows/ci.yml</code> để chạy trên <code>pull_request</code> vào <code>main</code>, có <code>concurrency</code> theo số PR và <code>timeout-minutes</code> cho mọi job.</li>
<li>Nếu app có DB: thêm <code>services:</code> với health check. Nếu không: thêm một ma trận hai phiên bản Node với <code>fail-fast: false</code>.</li>
<li>Thêm job <code>ci-ok</code> (<code>if: always()</code>, đọc <code>needs.*.result</code>).</li>
<li>Mở PR, push hai lần liên tiếp, rồi push một commit làm đỏ một test.</li>
<li>Ghi lại thời gian bước <code>npm ci</code> của một job lạnh và một job có cache hit.</li>
</ol><p><strong>Đạt khi:</strong> <code>gh run list --branch &lt;nhánh-PR&gt;</code> có một run <code>cancelled</code> với annotation <code>Canceling since a higher priority waiting request</code>; run có test đỏ cho thấy <code>ci-ok</code> ✗ (không phải ⊘); và bạn có hai con số lạnh/nóng để quyết định giữ cache hay bỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">service container</span><span class="v">container phụ (DB, Redis…) runner khởi động trước bước đầu và gỡ sau bước cuối của job</span></div>
<div class="kv"><span class="k">health check (kiểm sức khoẻ)</span><span class="v"><code>--health-cmd</code> để runner chờ tới khi service thật sự nhận kết nối</span></div>
<div class="kv"><span class="k">ma trận phiên bản</span><span class="v">cùng job chạy trên nhiều phiên bản runtime; đi với <code>fail-fast: false</code></span></div>
<div class="kv"><span class="k">cache hit / miss</span><span class="v">khoá có sẵn (tải về) / chưa có (cài lạnh rồi lưu cuối job)</span></div>
<div class="kv"><span class="k">concurrency group</span><span class="v">tên khoá; cùng tên ⇒ tối đa một run đang chạy và một đang chờ</span></div>
<div class="kv"><span class="k">required status check</span><span class="v">check phải xanh thì mới merge được; job bị skip được tính là xanh</span></div>
<div class="kv"><span class="k">job tổng hợp (aggregator)</span><span class="v">job <code>if: always()</code> đọc kết quả mọi job khác — check bắt buộc duy nhất</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CI cho PR = lint + typecheck + test song song, <code>permissions: contents: read</code>, <code>timeout-minutes</code>, và được CD gọi lại qua <code>workflow_call</code> trên đúng commit sẽ deploy.</li>
<li>Test tích hợp dùng <code>services: postgres</code> cùng phiên bản với production; ba dòng <code>--health-*</code> là thứ khiến nó không chập chờn.</li>
<li>Ma trận Node 22/24 với <code>fail-fast: false</code> cho bạn biết lỗi có phụ thuộc phiên bản hay không.</li>
<li>Cache npm với 172 gói làm job chậm hơn 1,2 giây — đo job lạnh trước; khoá đổi mỗi lần lockfile đổi.</li>
<li><code>concurrency</code> theo số PR hủy run cũ sau vài giây; không bao giờ dùng <code>cancel-in-progress: true</code> cho deploy.</li>
<li>Đặt MỘT job tổng hợp <code>if: always()</code> làm check bắt buộc: job bị skip tính là xanh, workflow bị lọc <code>paths</code> thì Pending mãi.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Creating PostgreSQL service containers</span><span class="lc-sub">docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers — <code>services:</code>, <code>ports</code>, health options, chạy trên runner hay trong container.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using conditions to control job execution</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions — "A job that is skipped will report its status as Success… even if it is a required check".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control the concurrency of workflows and jobs</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency — "tối đa một đang chạy và một đang chờ trong một nhóm".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — hạn mức 10 GB/kho, xoá entry không dùng quá 7 ngày (09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch15-capstone và PR #10</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone · /pull/10 — app, <code>ch15-ci.yml</code>, bốn run của PR (hủy, xanh, đỏ, xanh).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — container, cổng và health check</span><span class="lc-sub">/courses/docker/learn${REF} — cùng cơ chế mà <code>services:</code> dùng phía sau.</span></span></div>
</div>
`,
    },
    {
      title: '15.2 — Building the image once: multi-stage, two architectures, three tags, a signature|||15.2 — Dựng ảnh một lần: multi-stage, hai kiến trúc, ba tag, một chữ ký',
      slug: 'ga-15-2-build-anh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dockerfile hai tầng, buildx + QEMU đẩy một chỉ mục amd64/arm64 lên GHCR, tag SHA + semver, cache type=gha đo 27/7/25 giây, và attestation SLSA kiểm lại được bằng gh attestation verify.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Build the image once: multi-stage, two architectures, three tags, and a signature anyone can verify</h2>
<p class="lead">Green CI says "this code is right". This lesson turns that code into something deployable — a container image — and adds three guarantees a hand-run <code>docker build</code> script does not give: the image runs on both x86 and ARM machines, every image is tied to exactly one commit, and anyone can check which workflow produced it. Every number here comes from the <code>anh</code> job in <code>ch15-cd.yml</code>.</p>

<p>You learned Dockerfiles in the <a href="/courses/docker/learn?ref=%2Fcourses%2Fgithub-actions%2Flearn&amp;reflabel=GitHub%20Actions">Docker</a> course and read api-backend&#39;s GHCR workflow, <code>deploy-ghcr.yml</code>, in Chapter 9. This lesson does not repeat the syntax; it answers the questions that only appear when image builds run <em>in CI, on every merge</em>: which layers get cached and why a version bump breaks the cache, which tag is safe to deploy, and how to prove the image in the registry was not built by hand on someone&#39;s laptop.</p>

<h3>A two-stage Dockerfile, read with CI eyes</h3>
${slide('ga-15', 9, 'Two-stage Dockerfile: the runtime stage holds only what production needs')}
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
USER node
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"
CMD ["node", "src/server.js"]</code></pre>
<ul>
<li><strong>The <code>deps</code> stage copies two files before <code>npm ci</code>.</strong> Changing a line in <code>src/</code> does not rebuild the install layer — that is the whole reason a warm build takes 7 seconds (measured below). Copying the whole directory before <code>npm ci</code> is the most common way to turn every build into a cold build.</li>
<li><strong><code>--omit=dev</code></strong>: 90 of the 172 packages are devDependencies (eslint, typescript, the <code>@types</code> packages). CI needs them, production does not. The runtime stage gets 82 packages, a 5.3 MB <code>node_modules</code> (measured with <code>npm ci --omit=dev</code> on the authoring machine).</li>
<li><strong><code>.dockerignore</code> excludes <code>test/</code> and lint config.</strong> The image contains no tests — so tests never run inside the image, and that is right: they already ran in the <code>ci</code> job, before this one started.</li>
<li><strong><code>ARG APP_VERSION</code> → <code>ENV</code></strong>: CD passes <code>1.1.0+&lt;full sha&gt;</code> and <code>/healthz</code> echoes it. Lesson 15.3 uses it so the smoke test checks "the version we just deployed is answering", not merely "something is answering".</li>
<li><strong><code>USER node</code></strong>: <code>node:*-alpine</code> images ship this user. A hole in the app does not become root inside the container.</li>
<li><strong>The last <code>CMD</code> line — remember it.</strong> Lesson 15.3 renames <code>src/server.js</code> and forgets this line, and every CI check stays green.</li>
</ul>
<div class="callout"><p><strong>Look at your own repository.</strong> The 18/08/2026 lesson in api-backend&#39;s CLAUDE.md — "a green build does not mean the image runs" — came from building <code>Dockerfile</code> instead of <code>Dockerfile.backend</code>: a musl base carrying a glibc Prisma engine, and the API down with 502 for seven minutes. In CI, the <code>context:</code> and <code>file:</code> inputs of <code>build-push-action</code> are where that decision lives; spell both out whenever a repository has more than one Dockerfile.</p></div>

<h3>One step, two architectures: buildx and QEMU</h3>
${slide('ga-15', 10, 'buildx + QEMU: one digest, two manifests, two architectures')}
<pre><code class="language-yaml">      - uses: docker/setup-qemu-action@99012661954931238ded8c8b007157a8430204e1 # v4.4.0
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1
      - uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}
      - name: Tinh tag va nhan
        id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6.2.0
        with:
          images: &#36;{{ env.ANH_GOC }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=v&#36;{{ steps.ten.outputs.phien-ban }}
            type=raw,value=v&#36;{{ steps.ten.outputs.mm }}
      - name: Dung va day (amd64 + arm64)
        id: dung
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: ch15/app
          platforms: linux/amd64,linux/arm64
          push: true
          tags: &#36;{{ steps.meta.outputs.tags }}
          labels: &#36;{{ steps.meta.outputs.labels }}
          build-args: APP_VERSION=&#36;{{ steps.ten.outputs.phien-ban }}+&#36;{{ github.sha }}
          cache-from: type=gha,scope=ch15-phong-kham
          cache-to: type=gha,scope=ch15-phong-kham,mode=max
          provenance: false
          sbom: false</code></pre>
<p>The <code>ubuntu-24.04</code> runner is x86-64. <code>setup-qemu-action</code> installs an emulator so the same buildx can run the <code>RUN</code> lines of an arm64 base; <code>platforms:</code> tells buildx to build twice and merge the result. What gets pushed is not two images but <strong>one image index</strong> pointing at two manifests:</p>
<div class="out">$ docker buildx imagetools inspect ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41

Manifests:
  Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:a2e3fa6747c9d03463a370981cf9285a84ad9186e6dfc4be2afa57baafe0541a
  MediaType: application/vnd.oci.image.manifest.v1+json
  Platform:  linux/amd64

  Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:3d2a7db40545c186f09263418f604822b3a433dd26dc65417b64d2ba3af06cad
  MediaType: application/vnd.oci.image.manifest.v1+json
  Platform:  linux/arm64</div>
<p>When you <code>docker pull</code> that name on an M1 Mac, Docker reads the index and takes the arm64 manifest; an x86 VPS takes amd64. Same tag, same index digest, two binaries. That is why this project builds two architectures even though "production" is x86: the learner&#39;s dev machine is ARM, and "try exactly the production image" only means something if that image runs there without emulation.</p>
<table>
<thead><tr><th>Getting an arm64 image</th><th>Cost</th><th>When</th></tr></thead>
<tbody>
<tr><td>QEMU on an x86 runner (this lesson)</td><td>slow for heavy compile steps; here <code>npm ci</code> is pure JS, so negligible</td><td>Node/Python apps without native code to compile</td></tr>
<tr><td>GitHub&#39;s arm64 runner (<code>ubuntu-24.04-arm</code>) + a manifest merge</td><td>two jobs, one merge step</td><td>native code (sharp, bcrypt, Prisma engines) where QEMU is too slow</td></tr>
<tr><td>amd64 only</td><td>cheapest</td><td>nobody runs the image on ARM — but M1 Macs then emulate the other way</td></tr>
</tbody>
</table>
<p>The last two lines, <code>provenance: false</code> and <code>sbom: false</code>, have a reason: by default build-push-action attaches a BuildKit attestation to the index itself, which adds <code>unknown/unknown</code> entries to the manifest list. This project signs with <code>actions/attest</code> (below), so it turns the default off and the index lists exactly two platforms.</p>

<h3>Three tags for one image — and which one gets deployed</h3>
${slide('ga-15', 11, 'Three tags for one image — deploy with a tag that NEVER moves')}
<p><code>docker/metadata-action</code> computes tags from the run context. In run ${RUN(36075733214)} (version 1.1.0, commit <code>39c37de</code>) it produced three tags and the OCI labels:</p>
<div class="out">DOCKER_METADATA_OUTPUT_TAGS:
  ghcr.io/cuonghoang1103/ch15-phong-kham:v1.1.0
  ghcr.io/cuonghoang1103/ch15-phong-kham:v1.1
  ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
DOCKER_METADATA_OUTPUT_LABELS:
  org.opencontainers.image.revision=39c37de04a4a8612cf63281a661a18a52bc3e67d
  org.opencontainers.image.source=https://github.com/cuonghoang1103/ga-san-tap
  org.opencontainers.image.version=v1.1.0
  org.opencontainers.image.created=2026-09-25T00:04:10.664Z</div>
<table>
<thead><tr><th>Tag</th><th>Can it move?</th><th>Used for</th></tr></thead>
<tbody>
<tr><td><code>sha-39c37de</code></td><td>no — one commit, one image</td><td><strong>deploy and roll back</strong>: Lesson 15.3 derives the image of "the version running now" from the previous deployment&#39;s SHA by plain string concatenation</td></tr>
<tr><td><code>v1.1.0</code></td><td>in principle no — but the registry allows overwriting</td><td>humans, release notes</td></tr>
<tr><td><code>v1.1</code></td><td>yes — every 1.1.x patch moves it</td><td>users who want "the latest 1.1"</td></tr>
<tr><td><code>latest</code></td><td>always</td><td>this project does not create it — no reason to deploy something unknown</td></tr>
<tr><td>digest <code>@sha256:…</code></td><td>never</td><td>attestations, absolute pinning</td></tr>
</tbody>
</table>
<p>The semver here is read from <code>package.json</code> (step "Doc phien ban"), not from a git tag. The honest reason: the authoring session could not push git tags to the sandbox (the proxy blocks it). But the approach has its own merit: the version lives in the code, is reviewed in the PR like any other change, and does not depend on someone remembering to tag. If your repository releases by tag, use <code>type=semver,pattern={{version}}</code> on a <code>push: tags</code> event — Lesson 14.3 builds that path.</p>
<div class="pitfall co-tieu-de"><strong>Trap — deploying a moving tag.</strong> <code>docker compose pull &amp;&amp; up</code> with <code>image: …:latest</code> or <code>:v1</code> means "whatever is newest when pulled" — two machines pulling a minute apart can run two different versions, and "roll back to the previous version" has no address to go back to. Deploy by <code>sha-…</code> or by digest; leave moving tags for humans.</div>

<h3>The <code>type=gha</code> cache: three builds measured</h3>
${slide('ga-15', 12, 'type=gha cache: 27 seconds cold, 7 warm, 25 when the lockfile changes')}
<p><code>cache-to: type=gha,mode=max</code> stores <em>every</em> layer (including the intermediate <code>deps</code> stage) in the GitHub Actions cache service — the same place as the npm cache in Lesson 15.1, the same 10 GB allowance. <code>scope=</code> gives it its own name so other images in the repository do not trample it. The "Dung va day" step in three consecutive runs of the branch:</p>
<table>
<thead><tr><th>Run</th><th>Change</th><th>Build step (amd64 + arm64)</th><th>Why</th></tr></thead>
<tbody>
<tr><td>${RUN(36074781609)}</td><td>first build</td><td><strong>27 seconds</strong></td><td>cold: pull <code>node:22-alpine</code> for two architectures, <code>npm ci</code> twice (once under QEMU)</td></tr>
<tr><td>${RUN(36075460464)}</td><td>workflow file only</td><td><strong>7 seconds</strong></td><td>the <code>ch15/app</code> context did not change ⇒ every layer came from cache (inferred from the step time; the detailed BuildKit log is not quoted here); most of the 7 seconds is fetching cache and pushing manifests</td></tr>
<tr><td>${RUN(36075733214)}</td><td>added <code>/api/bac-si</code>, version 1.1.0</td><td><strong>25 seconds</strong></td><td>the version in <code>package-lock.json</code> changed ⇒ the <code>COPY package.json package-lock.json</code> layer changed ⇒ <code>npm ci</code> ran again for both architectures</td></tr>
</tbody>
</table>
<p>The third row is this section&#39;s most expensive lesson: <strong>a version bump invalidates the install layer</strong>, even though no package changed. It is exactly the npm cache key from Lesson 15.1 — same file, same cause. If a project bumps its version on every release (here: every PR), you pay 18 seconds each time. Two ways to cut it: do not store the version in <code>package.json</code> (inject it from the git tag at build time), or pass the lockfile through a normalising step that drops the <code>version</code> field before <code>COPY</code>. For this app 18 seconds is not worth the complexity — for a Next.js project whose install takes 90 seconds, it is.</p>
<p>The clean-up job in Lesson 15.4 lists the entries this cache leaves in the repository: one index entry <code>index-ch15-phong-kham-1-5c45fc59#1</code> (10,701 bytes) and dozens of <code>buildkit-blob-1-sha256:…</code> entries, the largest 55,585,204 bytes — the <code>node:22-alpine</code> layer. Image caches eat the allowance much faster than npm caches.</p>
<div class="callout"><p><strong>A harmless warning you will see.</strong> At the end of the job in run ${RUN(36075733214)}, the Post step of <code>setup-qemu-action</code> printed: <em>Failed to save: Unable to reserve cache with key docker.io--tonistiigi--binfmt-latest-linux-x64, another job may be creating this cache.</em> The action caches its own binfmt image; two runs close together both tried to save the same key and one lost. It does not affect your image — do not spend an afternoon on it.</p></div>

<h3>Attestation: proving where an image came from</h3>
${slide('ga-15', 13, 'Attestation: “this image was built from this commit, by this workflow”')}
<p>The image is on GHCR. How does whoever pulls it — or you, six months later — know it was built by <code>ch15-cd.yml</code> from commit <code>39c37de</code>, and not by someone with package write access building on a laptop and pushing? OCI labels cannot answer that: anyone who builds can fill in labels. An <strong>attestation</strong> can, because it is signed with a certificate that only that workflow can obtain.</p>
<pre><code class="language-yaml">      - name: Ky attestation nguon goc (SLSA provenance)
        uses: actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6 # v4.2.2
        with:
          subject-name: &#36;{{ env.ANH_GOC }}
          subject-digest: &#36;{{ steps.dung.outputs.digest }}
          push-to-registry: true</code></pre>
<div class="out">Attestation type: Build Provenance
Attestation created for ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
Attestation signed using certificate from Public Good Sigstore instance
Attestation signature uploaded to Rekor transparency log
https://search.sigstore.dev?logIndex=2946244881
Attestation uploaded to repository
https://github.com/cuonghoang1103/ga-san-tap/attestations/50030102
Attestation uploaded to registry
ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:93642a390f0ba97bdd81b080e18221cb1c417eab3bad1cbe807af1377655c554</div>
<ol>
<li>The job requests an <strong>OIDC token</strong> (<code>id-token: write</code>, Lesson 6.4). The token records <code>workflow_ref</code>, <code>sha</code>, the event and the repository.</li>
<li>Sigstore exchanges it for a <strong>short-lived certificate</strong> — the one in the log is valid from 23:53:10 to 00:03:10, exactly ten minutes — whose fields copy the workflow&#39;s identity.</li>
<li>The signature is written to <strong>Rekor</strong>, a public append-only log (<code>logIndex=2946244881</code>), so nobody can erase the trace.</li>
<li>The attestation is stored by GitHub (<code>/attestations/50030102</code>) and, with <code>push-to-registry: true</code>, pushed next to the image on GHCR as an object with its own digest (<code>@sha256:93642a39…</code>).</li>
</ol>
<p>Verifying from the image consumer&#39;s side is one command. The first time (run ${RUN(36074781609)}) the check ran for 4 seconds, exited 0 — and printed not a single line to the log. A silent check teaches nobody, so the next version prints the fields worth reading:</p>
<div class="out">$ gh attestation verify "oci://ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:3532003b…" \\
    --repo cuonghoang1103/ga-san-tap --format json | jq -r '…certificate…'
da ky boi: https://github.com/cuonghoang1103/ga-san-tap/.github/workflows/ch15-cd.yml@refs/heads/ch15-capstone
kich hoat: push · commit 39c37de · runner github-hosted
gh attestation verify: exit 0</div>
<p>"Signed by <code>ch15-cd.yml</code> on branch <code>ch15-capstone</code>, triggered by a push, commit <code>39c37de</code>, on a GitHub runner" — four facts a hand builder cannot fake. Add <code>--signer-workflow</code> or <code>--source-ref refs/heads/main</code> and you have a gate: the deploy step refuses any image not signed by the right workflow on the right branch.</p>
<table>
<thead><tr><th>Limits (<code>actions/attest</code> README, 09/2026)</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Public repositories: every current plan</td><td>the sandbox can sign, and so can your public repositories</td></tr>
<tr><td>Private/internal repositories: GitHub Enterprise Cloud only</td><td>a private repository on a personal plan — like api-backend, if it stays private — cannot use it — worth knowing when interviewing at a company on Enterprise</td></tr>
<tr><td>Since v4, <code>attest-build-provenance</code> is only a wrapper around <code>actions/attest</code></td><td>new code should use <code>actions/attest</code> directly</td></tr>
</tbody>
</table>

<h3>Least privilege per job</h3>
${slide('ga-15', 14, 'Least privilege: only the image job may write packages and request OIDC')}
<p>The workflow sets <code>permissions: contents: read</code> at the top, and only the <code>anh</code> job asks for more: <code>packages: write</code> (push to GHCR), <code>id-token: write</code> (request a certificate), <code>attestations: write</code> (store the attestation) and <code>artifact-metadata: write</code> (the storage record <code>actions/attest</code> v4 creates). The <code>trien-khai</code> job only needs <code>packages: read</code> and <code>deployments: read</code>. Why not grant everything at workflow level: if an action in the deploy job were compromised (Lesson 14.2 — the tj-actions case), it could not push a fake image to GHCR or sign a fake attestation, because that job&#39;s token has neither permission.</p>
<p>And no PAT anywhere: <code>docker/login-action</code> uses <code>secrets.GITHUB_TOKEN</code>, a token that expires when the job ends. The <code>ch15-phong-kham</code> package was first created by this repository&#39;s own workflow, so it is linked to the repository — later jobs in the same repository can pull it with <code>GITHUB_TOKEN</code> with no extra setup.</p>

<h3>Step by step: a signed, two-architecture image</h3>
<ol>
<li>Write a two-stage Dockerfile: the <code>deps</code> stage copies only <code>package.json</code> + lockfile and runs <code>npm ci --omit=dev</code>; the runtime stage uses <code>USER node</code> and takes <code>ARG APP_VERSION</code>.</li>
<li>Add an <code>anh</code> job with <code>needs: ci</code> and job-level <code>permissions</code> as above.</li>
<li>setup-qemu → setup-buildx → login (GITHUB_TOKEN) → metadata-action (sha + semver) → build-push-action with <code>platforms: linux/amd64,linux/arm64</code> and <code>cache-from/to: type=gha</code>.</li>
<li>Add <code>actions/attest</code> with <code>subject-digest: &#36;{{ steps.&lt;id&gt;.outputs.digest }}</code> and <code>push-to-registry: true</code>.</li>
<li>Add a check step: <code>docker buildx imagetools inspect</code> (two Platforms) and <code>gh attestation verify … --format json</code> printing <code>buildSignerURI</code>.</li>
<li>Push three times: first build, a workflow-only change, a version bump. Record the build step time for each.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How do you tag images, and which tag do you deploy?</strong><br>A: A commit-SHA tag (immutable) for deploys and rollbacks; semver tags for humans; never deploy <code>latest</code>. Where it must be absolute (verifying signatures, pinning), use the digest.</p>
<p><strong>Q: Why build the image ONCE and deploy it, instead of building on the server?</strong><br>A: So that what runs in production is exactly what passed CI and was signed; rebuilding on the server is a new build — possibly with different package versions or base — and it spends RAM and disk on the production machine itself (api-backend once filled its disk with build cache on the VPS).</p>
<p><strong>Q: What does an artifact attestation prove, and what does it not?</strong><br>A: It proves that the image with digest X was built by workflow Y at commit Z on a GitHub runner — unforgeable because the certificate is bound to that workflow&#39;s OIDC token. It does not prove that the code at commit Z is safe: a malicious commit that got merged is still validly signed.</p>
<p><strong>Q: Docker builds in CI are slow. What do you check first?</strong><br>A: The <code>COPY</code> order (lockfile first, code later), the buildx cache (<code>type=gha</code> or registry, <code>mode=max</code>), and what is invalidating the install layer — in this project, version bumps written into the lockfile.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your app&#39;s image is built by hand on a laptop and pushed to a registry. Move that into CI.</p><ol>
<li>Add an image-build job to your repository&#39;s CD workflow (or a public test repository), with <code>needs</code> on the CI job.</li>
<li>Build <code>linux/amd64,linux/arm64</code> and push to <code>ghcr.io/&lt;you&gt;/&lt;app&gt;</code> with a <code>sha-</code> tag and a semver tag read from <code>package.json</code>.</li>
<li>Turn on <code>cache-from/to: type=gha</code>; push twice in a row without changing the app code.</li>
<li>If the repository is public: add <code>actions/attest</code> and a <code>gh attestation verify</code> step.</li>
</ol><p><strong>Done when:</strong> <code>docker buildx imagetools inspect ghcr.io/&lt;you&gt;/&lt;app&gt;:sha-&lt;7&gt;</code> lists both <code>linux/amd64</code> and <code>linux/arm64</code>; the second push&#39;s build step is clearly shorter than the first; and (public repository) <code>gh attestation verify</code> prints your workflow file&#39;s name.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">multi-stage build</span><span class="v">a Dockerfile with several <code>FROM</code>s; the last stage copies only results from earlier ones</span></div>
<div class="kv"><span class="k">buildx / QEMU</span><span class="v">Docker&#39;s multi-platform builder / a CPU emulator that runs arm64 commands on x86</span></div>
<div class="kv"><span class="k">image index</span><span class="v">one digest pointing at several manifests, one per platform</span></div>
<div class="kv"><span class="k">digest</span><span class="v">the <code>sha256:…</code> of the content — an image&#39;s immutable address</span></div>
<div class="kv"><span class="k"><code>type=gha</code> cache</span><span class="v">BuildKit layers stored in the GitHub Actions cache service; <code>mode=max</code> keeps intermediate stages too</span></div>
<div class="kv"><span class="k">artifact attestation</span><span class="v">a signed provenance statement (SLSA) binding a digest to a workflow + commit</span></div>
<div class="kv"><span class="k">Sigstore / Rekor</span><span class="v">a service issuing short-lived signing certificates / a public log of every signature</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two-stage Dockerfile: copy the lockfile first, <code>npm ci --omit=dev</code>, runtime stage as <code>USER node</code> — 82 packages instead of 172.</li>
<li>buildx + QEMU push one index pointing at amd64 and arm64 manifests; the same tag runs on an x86 VPS and an M1 Mac.</li>
<li>Deploy with the <code>sha-</code> tag (immutable); semver for humans; never deploy <code>latest</code>.</li>
<li><code>type=gha</code> cache: 27 s cold, 7 s when only the workflow changed, 25 s when a version bump changed the lockfile.</li>
<li><code>actions/attest</code> signs the image with a Sigstore certificate obtained from the OIDC token; <code>gh attestation verify</code> tells you the workflow, branch and commit that built it.</li>
<li>Package write and <code>id-token</code> live only on the image job; no PAT — <code>GITHUB_TOKEN</code> is enough.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Publishing Docker images</span><span class="lc-sub">docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images — GHCR with <code>GITHUB_TOKEN</code>, metadata-action, build-push-action, attestations.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/attest — README (v4.2.2)</span><span class="lc-sub">github.com/actions/attest — required permissions, <code>push-to-registry</code>, plan requirements (public vs Enterprise Cloud).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Docs — Cache management with GitHub Actions</span><span class="lc-sub">docs.docker.com/build/ci/github-actions/cache — <code>type=gha</code>, <code>scope</code>, <code>mode=max</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Docs — Multi-platform image with GitHub Actions</span><span class="lc-sub">docs.docker.com/build/ci/github-actions/multi-platform — QEMU versus native ARM runners.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — ch15-cd.yml, the anh job</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/blob/ch15-capstone/.github/workflows/ch15-cd.yml — and runs 36074781609 · 36075460464 · 36075733214.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — multi-stage, .dockerignore, USER</span><span class="lc-sub">/courses/docker/learn${REF} — every instruction in the Dockerfile above, explained from scratch.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Dựng ảnh một lần: multi-stage, hai kiến trúc, ba tag, và một chữ ký kiểm chứng được</h2>
<p class="lead">CI xanh nói "mã này đúng". Bài này biến mã đúng ấy thành một thứ deploy được — một ảnh container — và thêm ba bảo đảm mà một script <code>docker build</code> chạy tay không cho: ảnh chạy được trên cả máy x86 lẫn ARM, mỗi ảnh gắn chặt với đúng một commit, và bất kỳ ai cũng kiểm được ảnh ấy đến từ workflow nào. Mọi con số là của job <code>anh</code> trong <code>ch15-cd.yml</code>.</p>

<p>Bạn đã học Dockerfile ở khoá <a href="/courses/docker/learn?ref=%2Fcourses%2Fgithub-actions%2Flearn&amp;reflabel=GitHub%20Actions">Docker</a> và đã đọc workflow đẩy GHCR của api-backend, <code>deploy-ghcr.yml</code>, ở Chương 9. Bài này không lặp lại cú pháp; nó trả lời những câu hỏi chỉ xuất hiện khi việc dựng ảnh chạy <em>trong CI, mỗi lần merge</em>: tầng nào được cache và vì sao một lần bump version làm hỏng cache, tag nào an toàn để deploy, và làm sao chứng minh ảnh trên registry không phải do ai đó dựng tay rồi đẩy lên.</p>

<h3>Dockerfile hai tầng, đọc bằng con mắt CI</h3>
${slide('ga-15', 9, 'Dockerfile hai tầng: tầng chạy chỉ có thứ production cần')}
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
USER node
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=&gt;process.exit(r.ok?0:1)).catch(()=&gt;process.exit(1))"
CMD ["node", "src/server.js"]</code></pre>
<ul>
<li><strong>Tầng <code>deps</code> chỉ chép hai tệp rồi mới <code>npm ci</code>.</strong> Đổi một dòng trong <code>src/</code> không làm tầng cài đặt dựng lại — đó là toàn bộ lý do bước dựng nóng chỉ mất 7 giây (đo ở dưới). Chép cả thư mục trước <code>npm ci</code> là cách phổ biến nhất để biến mọi lần dựng thành lần dựng lạnh.</li>
<li><strong><code>--omit=dev</code></strong>: 90 trong 172 gói là devDependencies (eslint, typescript, các gói <code>@types</code>). Chúng cần cho CI, không cần cho production. Tầng chạy nhận 82 gói, <code>node_modules</code> 5,3 MB (đo bằng <code>npm ci --omit=dev</code> trên máy dựng bài).</li>
<li><strong><code>.dockerignore</code> loại <code>test/</code> và cấu hình lint.</strong> Ảnh không chứa test — nên test không bao giờ chạy trong ảnh, và đó là đúng: test đã chạy ở job <code>ci</code>, trước khi job này bắt đầu.</li>
<li><strong><code>ARG APP_VERSION</code> → <code>ENV</code></strong>: CD truyền <code>1.1.0+&lt;sha đầy đủ&gt;</code>, và <code>/healthz</code> in lại chuỗi đó. Bài 15.3 dùng nó để smoke test kiểm "đúng bản vừa deploy đang trả lời", không chỉ "có cái gì đó đang trả lời".</li>
<li><strong><code>USER node</code></strong>: ảnh <code>node:*-alpine</code> có sẵn user này. Một lỗ hổng trong app không thành quyền root trong container.</li>
<li><strong>Dòng <code>CMD</code> cuối — nhớ nó.</strong> Bài 15.3 đổi tên <code>src/server.js</code> mà quên dòng này, và mọi phép kiểm của CI vẫn xanh.</li>
</ul>
<div class="callout"><p><strong>Soi repo của chính bạn.</strong> Bài học 18/08/2026 trong CLAUDE.md của api-backend — "build xanh không có nghĩa là ảnh chạy được" — đến từ việc dựng nhầm <code>Dockerfile</code> thay vì <code>Dockerfile.backend</code>: nền musl mang engine Prisma glibc, API chết 502 bảy phút. Trong CI, dòng <code>context:</code> và <code>file:</code> của <code>build-push-action</code> là chỗ quyết định điều đó; hãy viết cả hai tường minh khi kho có nhiều hơn một Dockerfile.</p></div>

<h3>Một bước, hai kiến trúc: buildx và QEMU</h3>
${slide('ga-15', 10, 'buildx + QEMU: một digest, hai manifest, hai kiến trúc')}
<pre><code class="language-yaml">      - uses: docker/setup-qemu-action@99012661954931238ded8c8b007157a8430204e1 # v4.4.0
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1
      - uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}
      - name: Tinh tag va nhan
        id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6.2.0
        with:
          images: &#36;{{ env.ANH_GOC }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=v&#36;{{ steps.ten.outputs.phien-ban }}
            type=raw,value=v&#36;{{ steps.ten.outputs.mm }}
      - name: Dung va day (amd64 + arm64)
        id: dung
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: ch15/app
          platforms: linux/amd64,linux/arm64
          push: true
          tags: &#36;{{ steps.meta.outputs.tags }}
          labels: &#36;{{ steps.meta.outputs.labels }}
          build-args: APP_VERSION=&#36;{{ steps.ten.outputs.phien-ban }}+&#36;{{ github.sha }}
          cache-from: type=gha,scope=ch15-phong-kham
          cache-to: type=gha,scope=ch15-phong-kham,mode=max
          provenance: false
          sbom: false</code></pre>
<p>Runner <code>ubuntu-24.04</code> là x86-64. <code>setup-qemu-action</code> cài bộ giả lập để cùng một buildx chạy được lệnh <code>RUN</code> của nền arm64; <code>platforms:</code> bảo buildx dựng hai lần và gộp kết quả. Thứ được đẩy lên không phải hai ảnh mà là <strong>một chỉ mục (image index)</strong> trỏ tới hai manifest:</p>
<div class="out">$ docker buildx imagetools inspect ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41

Manifests:
  Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:a2e3fa6747c9d03463a370981cf9285a84ad9186e6dfc4be2afa57baafe0541a
  MediaType: application/vnd.oci.image.manifest.v1+json
  Platform:  linux/amd64

  Name:      ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:3d2a7db40545c186f09263418f604822b3a433dd26dc65417b64d2ba3af06cad
  MediaType: application/vnd.oci.image.manifest.v1+json
  Platform:  linux/arm64</div>
<p>Khi bạn <code>docker pull</code> tên ấy trên Mac M1, Docker đọc chỉ mục và lấy manifest arm64; VPS x86 lấy amd64. Cùng một tag, cùng một digest chỉ mục, hai hệ nhị phân. Đó là lý do dự án này dựng hai kiến trúc dù "production" là x86: máy dev của người học là ARM, và "chạy thử đúng cái ảnh production" chỉ có nghĩa khi ảnh ấy chạy được trên máy dev mà không cần giả lập.</p>
<table>
<thead><tr><th>Cách có ảnh arm64</th><th>Chi phí</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td>QEMU trên runner x86 (bài này)</td><td>chậm với bước biên dịch nặng; ở đây <code>npm ci</code> thuần JS nên không đáng kể</td><td>app Node/Python không có mã native cần biên dịch</td></tr>
<tr><td>Runner arm64 của GitHub (<code>ubuntu-24.04-arm</code>) + gộp manifest</td><td>hai job, một bước gộp</td><td>khi có mã native (sharp, bcrypt, Prisma engine) và QEMU quá chậm</td></tr>
<tr><td>Chỉ amd64</td><td>rẻ nhất</td><td>khi không ai chạy ảnh trên ARM — nhưng Mac M1 sẽ phải giả lập ngược lại</td></tr>
</tbody>
</table>
<p>Hai dòng cuối <code>provenance: false</code>, <code>sbom: false</code> có lý do: mặc định build-push-action gắn một attestation của BuildKit vào chính chỉ mục, làm danh sách manifest có thêm các mục <code>unknown/unknown</code>. Dự án này ký bằng <code>actions/attest</code> (mục dưới), nên tắt cái mặc định để chỉ mục chỉ có đúng hai nền tảng.</p>

<h3>Ba tag cho một ảnh — và cái nào được deploy</h3>
${slide('ga-15', 11, 'Ba tag cho một ảnh — deploy bằng tag KHÔNG bao giờ dời')}
<p><code>docker/metadata-action</code> tính tag từ ngữ cảnh run. Ở run ${RUN(36075733214)} (bản 1.1.0, commit <code>39c37de</code>), nó sinh ba tag và bộ nhãn OCI:</p>
<div class="out">DOCKER_METADATA_OUTPUT_TAGS:
  ghcr.io/cuonghoang1103/ch15-phong-kham:v1.1.0
  ghcr.io/cuonghoang1103/ch15-phong-kham:v1.1
  ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
DOCKER_METADATA_OUTPUT_LABELS:
  org.opencontainers.image.revision=39c37de04a4a8612cf63281a661a18a52bc3e67d
  org.opencontainers.image.source=https://github.com/cuonghoang1103/ga-san-tap
  org.opencontainers.image.version=v1.1.0
  org.opencontainers.image.created=2026-09-25T00:04:10.664Z</div>
<table>
<thead><tr><th>Tag</th><th>Dời được?</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>sha-39c37de</code></td><td>không — một commit, một ảnh</td><td><strong>deploy và quay lui</strong>: Bài 15.3 suy ra ảnh của "bản đang chạy" từ SHA của deployment trước, chỉ bằng cách ghép chuỗi</td></tr>
<tr><td><code>v1.1.0</code></td><td>về nguyên tắc không — nhưng registry cho ghi đè</td><td>người đọc, ghi chú phát hành</td></tr>
<tr><td><code>v1.1</code></td><td>có — mỗi bản vá 1.1.x dời nó</td><td>người dùng muốn "1.1 mới nhất"</td></tr>
<tr><td><code>latest</code></td><td>luôn luôn</td><td>dự án này không tạo — không có lý do deploy một thứ không biết là gì</td></tr>
<tr><td>digest <code>@sha256:…</code></td><td>không bao giờ</td><td>attestation, ghim tuyệt đối</td></tr>
</tbody>
</table>
<p>Semver ở đây đọc từ <code>package.json</code> (bước "Doc phien ban"), không từ thẻ git. Lý do thật, nói thẳng: phiên dựng bài không đẩy được thẻ git lên sân tập (proxy chặn). Nhưng cách này có lợi riêng: số phiên bản nằm trong mã, được review trong PR như mọi thay đổi khác, và không phụ thuộc ai đó nhớ gắn thẻ. Nếu kho của bạn phát hành bằng thẻ, dùng <code>type=semver,pattern={{version}}</code> trên sự kiện <code>push: tags</code> — Bài 14.3 dựng đường ấy.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — deploy bằng tag dời.</strong> <code>docker compose pull &amp;&amp; up</code> với <code>image: …:latest</code> hay <code>:v1</code> nghĩa là "bản mới nhất ở thời điểm pull" — hai máy pull cách nhau một phút có thể chạy hai bản khác nhau, và "quay lui về bản trước" không có địa chỉ nào để quay về. Deploy bằng <code>sha-…</code> hoặc digest; để tag dời cho con người đọc.</div>

<h3>Cache <code>type=gha</code>: đo ba lần dựng</h3>
${slide('ga-15', 12, 'cache type=gha: 27 giây lạnh, 7 giây nóng, 25 giây khi lockfile đổi')}
<p><code>cache-to: type=gha,mode=max</code> lưu <em>mọi</em> tầng (kể cả tầng <code>deps</code> trung gian) vào dịch vụ cache của GitHub Actions — cùng chỗ với cache npm ở Bài 15.1, cùng hạn mức 10 GB. <code>scope=</code> đặt tên riêng để các ảnh khác trong kho không giẫm lên nhau. Bước "Dung va day" ở ba run liên tiếp của nhánh:</p>
<table>
<thead><tr><th>Run</th><th>Thay đổi</th><th>Bước build (amd64 + arm64)</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>${RUN(36074781609)}</td><td>lần đầu</td><td><strong>27 giây</strong></td><td>lạnh: kéo <code>node:22-alpine</code> hai kiến trúc, <code>npm ci</code> hai lần (một lần qua QEMU)</td></tr>
<tr><td>${RUN(36075460464)}</td><td>chỉ sửa tệp workflow</td><td><strong>7 giây</strong></td><td>ngữ cảnh <code>ch15/app</code> không đổi ⇒ mọi tầng lấy từ cache (suy từ thời gian bước; log chi tiết của BuildKit không được trích ở đây); phần lớn 7 giây là kéo cache và đẩy manifest</td></tr>
<tr><td>${RUN(36075733214)}</td><td>thêm <code>/api/bac-si</code>, version 1.1.0</td><td><strong>25 giây</strong></td><td>version trong <code>package-lock.json</code> đổi ⇒ tầng <code>COPY package.json package-lock.json</code> đổi ⇒ <code>npm ci</code> chạy lại cho cả hai kiến trúc</td></tr>
</tbody>
</table>
<p>Hàng thứ ba là bài học đắt nhất của mục này: <strong>bump version làm hỏng cache tầng cài đặt</strong>, dù không gói nào đổi. Giống hệt cái khoá cache npm ở Bài 15.1 — cùng một tệp, cùng một nguyên nhân. Nếu dự án bump version mỗi bản phát hành (ở đây: mỗi PR), bạn trả 18 giây mỗi lần. Hai cách giảm: không ghi version vào <code>package.json</code> (lấy từ thẻ git lúc dựng), hoặc chép lockfile qua một bước chuẩn hoá bỏ trường <code>version</code> trước khi <code>COPY</code>. Với app này, 18 giây không đáng thêm độ phức tạp — nhưng với một Next.js cài 90 giây, nó đáng.</p>
<p>Job dọn dẹp ở Bài 15.4 liệt kê các entry mà cache này để lại trong kho: một entry chỉ mục <code>index-ch15-phong-kham-1-5c45fc59#1</code> (10 701 byte) và hàng chục entry <code>buildkit-blob-1-sha256:…</code>, lớn nhất 55 585 204 byte — đó là tầng <code>node:22-alpine</code>. Cache của ảnh chiếm hạn mức nhanh hơn cache npm nhiều.</p>
<div class="callout"><p><strong>Một cảnh báo vô hại mà bạn sẽ thấy.</strong> Cuối job ở run ${RUN(36075733214)}, bước Post của <code>setup-qemu-action</code> in: <em>Failed to save: Unable to reserve cache with key docker.io--tonistiigi--binfmt-latest-linux-x64, another job may be creating this cache.</em> Action tự cache ảnh binfmt của nó; hai run gần nhau cùng muốn lưu một khoá, một bên thua. Không ảnh hưởng tới ảnh của bạn — đừng mất một buổi chiều dò nó.</p></div>

<h3>Attestation: chứng minh ảnh đến từ đâu</h3>
${slide('ga-15', 13, 'Attestation: “ảnh này dựng từ commit này, bởi workflow này”')}
<p>Ảnh đã lên GHCR. Làm sao người kéo nó — hay chính bạn sáu tháng sau — biết nó được dựng bởi <code>ch15-cd.yml</code> từ commit <code>39c37de</code>, chứ không phải bởi ai đó có quyền ghi gói dựng tay trên laptop rồi đẩy lên? Nhãn OCI không trả lời được: ai dựng cũng tự điền nhãn được. <strong>Attestation</strong> trả lời được, vì nó được ký bằng một chứng chỉ mà chỉ chính workflow ấy xin được.</p>
<pre><code class="language-yaml">      - name: Ky attestation nguon goc (SLSA provenance)
        uses: actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6 # v4.2.2
        with:
          subject-name: &#36;{{ env.ANH_GOC }}
          subject-digest: &#36;{{ steps.dung.outputs.digest }}
          push-to-registry: true</code></pre>
<div class="out">Attestation type: Build Provenance
Attestation created for ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d606010bafc0547b045a2d3a3d062ffb2833bcd7a786a3731af0fe8481ee41
Attestation signed using certificate from Public Good Sigstore instance
Attestation signature uploaded to Rekor transparency log
https://search.sigstore.dev?logIndex=2946244881
Attestation uploaded to repository
https://github.com/cuonghoang1103/ga-san-tap/attestations/50030102
Attestation uploaded to registry
ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:93642a390f0ba97bdd81b080e18221cb1c417eab3bad1cbe807af1377655c554</div>
<ol>
<li>Job xin một <strong>token OIDC</strong> (quyền <code>id-token: write</code>, Bài 6.4). Token ghi <code>workflow_ref</code>, <code>sha</code>, sự kiện, kho.</li>
<li>Sigstore đổi token ấy lấy một <strong>chứng chỉ ngắn hạn</strong> — chứng chỉ trong log có hiệu lực từ 23:53:10 tới 00:03:10, đúng mười phút — mà các trường của nó chép lại danh tính workflow.</li>
<li>Chữ ký được ghi vào <strong>Rekor</strong>, một sổ công khai chỉ-thêm-vào (<code>logIndex=2946244881</code>), để không ai xoá dấu vết được.</li>
<li>Bản attestation lưu ở GitHub (<code>/attestations/50030102</code>) và, với <code>push-to-registry: true</code>, được đẩy cạnh ảnh trên GHCR thành một đối tượng có digest riêng (<code>@sha256:93642a39…</code>).</li>
</ol>
<p>Kiểm từ phía người dùng ảnh là một lệnh. Lần đầu (run ${RUN(36074781609)}) bước kiểm chạy 4 giây, exit 0 — và không in một dòng nào ra log. Một phép kiểm im lặng không dạy được ai, nên lần sau nó in ra những trường đáng đọc:</p>
<div class="out">$ gh attestation verify "oci://ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:3532003b…" \\
    --repo cuonghoang1103/ga-san-tap --format json | jq -r '…certificate…'
da ky boi: https://github.com/cuonghoang1103/ga-san-tap/.github/workflows/ch15-cd.yml@refs/heads/ch15-capstone
kich hoat: push · commit 39c37de · runner github-hosted
gh attestation verify: exit 0</div>
<p>"Ký bởi <code>ch15-cd.yml</code> trên nhánh <code>ch15-capstone</code>, kích hoạt bởi push, commit <code>39c37de</code>, runner của GitHub" — bốn sự thật mà người dựng tay không làm giả được. Thêm cờ <code>--signer-workflow</code> hoặc <code>--source-ref refs/heads/main</code> là bạn có một cổng: bước deploy từ chối ảnh không được ký bởi đúng workflow trên đúng nhánh.</p>
<table>
<thead><tr><th>Giới hạn (README <code>actions/attest</code>, 09/2026)</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td>Kho public: mọi gói hiện hành</td><td>sân tập ký được, kho public của bạn ký được</td></tr>
<tr><td>Kho private/internal: chỉ GitHub Enterprise Cloud</td><td>một kho private trên gói cá nhân — như api-backend nếu nó vẫn private — chưa dùng được — hãy ghi nhớ khi phỏng vấn ở công ty dùng Enterprise</td></tr>
<tr><td>Từ v4, <code>attest-build-provenance</code> chỉ là lớp bọc của <code>actions/attest</code></td><td>viết mới thì dùng thẳng <code>actions/attest</code></td></tr>
</tbody>
</table>

<h3>Quyền tối thiểu cho từng job</h3>
${slide('ga-15', 14, 'Quyền tối thiểu: chỉ job anh được ghi gói và xin OIDC')}
<p>Workflow đặt <code>permissions: contents: read</code> ở mức trên cùng, và chỉ job <code>anh</code> xin thêm: <code>packages: write</code> (đẩy GHCR), <code>id-token: write</code> (xin chứng chỉ), <code>attestations: write</code> (lưu attestation) và <code>artifact-metadata: write</code> (bản ghi lưu trữ mà <code>actions/attest</code> v4 tạo). Job <code>trien-khai</code> chỉ cần <code>packages: read</code> và <code>deployments: read</code>. Lý do không đặt tất cả ở mức workflow: nếu một action trong bước deploy bị chiếm quyền (Bài 14.2 — vụ tj-actions), nó không thể đẩy một ảnh giả lên GHCR hay ký một attestation giả, vì token của job ấy không có hai quyền đó.</p>
<p>Và không có PAT nào: <code>docker/login-action</code> dùng <code>secrets.GITHUB_TOKEN</code>, token tự hết hạn khi job xong. Gói <code>ch15-phong-kham</code> được tạo lần đầu bởi chính workflow của kho nên tự liên kết với kho — job sau của cùng kho kéo được nó bằng <code>GITHUB_TOKEN</code> mà không cần cấu hình gì thêm.</p>

<h3>Chạy thử từng bước: một ảnh hai kiến trúc có chữ ký</h3>
<ol>
<li>Viết Dockerfile hai tầng: tầng <code>deps</code> chỉ chép <code>package.json</code> + lockfile rồi <code>npm ci --omit=dev</code>; tầng chạy <code>USER node</code>, nhận <code>ARG APP_VERSION</code>.</li>
<li>Thêm job <code>anh</code> với <code>needs: ci</code> và <code>permissions</code> ở mức job như trên.</li>
<li>setup-qemu → setup-buildx → login (GITHUB_TOKEN) → metadata-action (sha + semver) → build-push-action với <code>platforms: linux/amd64,linux/arm64</code> và <code>cache-from/to: type=gha</code>.</li>
<li>Thêm <code>actions/attest</code> với <code>subject-digest: &#36;{{ steps.&lt;id&gt;.outputs.digest }}</code> và <code>push-to-registry: true</code>.</li>
<li>Thêm bước kiểm: <code>docker buildx imagetools inspect</code> (thấy hai Platform) và <code>gh attestation verify … --format json</code> in ra <code>buildSignerURI</code>.</li>
<li>Push ba lần: lần đầu, lần chỉ sửa workflow, lần bump version. Ghi thời gian bước build của cả ba.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn gắn tag ảnh thế nào, và deploy tag nào?</strong><br>Đ: Tag theo SHA commit (bất biến) để deploy và quay lui; tag semver cho con người; không deploy <code>latest</code>. Chỗ cần tuyệt đối (kiểm chữ ký, ghim) thì dùng digest.</p>
<p><strong>H: Vì sao dựng ảnh MỘT lần rồi deploy, thay vì dựng trên server?</strong><br>Đ: Để thứ chạy trên production đúng là thứ đã qua CI và đã được ký; dựng lại trên server là một lần dựng mới — có thể khác phiên bản gói, khác nền — và tốn RAM/đĩa của chính máy chạy production (api-backend từng hết đĩa vì cache build trên VPS).</p>
<p><strong>H: Artifact attestation chứng minh điều gì, và không chứng minh điều gì?</strong><br>Đ: Chứng minh ảnh có digest X được dựng bởi workflow Y ở commit Z trên runner của GitHub — không làm giả được vì chứng chỉ gắn với token OIDC của đúng workflow. Không chứng minh mã ở commit Z là an toàn: một commit độc được merge vẫn được ký hợp lệ.</p>
<p><strong>H: Build Docker trong CI chậm. Bạn kiểm tra gì đầu tiên?</strong><br>Đ: Thứ tự <code>COPY</code> (chép lockfile trước, mã sau), cache của buildx (<code>type=gha</code> hay registry, <code>mode=max</code>), và cái gì đang làm hỏng tầng cài đặt — ở dự án này là việc bump version ghi vào lockfile.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> app của bạn đang được dựng ảnh bằng tay trên laptop rồi đẩy lên registry. Chuyển việc đó vào CI.</p><ol>
<li>Thêm job dựng ảnh vào workflow CD của kho (hoặc một kho thử public), <code>needs</code> job CI.</li>
<li>Dựng <code>linux/amd64,linux/arm64</code>, đẩy lên <code>ghcr.io/&lt;bạn&gt;/&lt;app&gt;</code> với tag <code>sha-</code> và tag semver đọc từ <code>package.json</code>.</li>
<li>Bật <code>cache-from/to: type=gha</code>; push hai lần liên tiếp mà không đổi mã app.</li>
<li>Nếu kho public: thêm <code>actions/attest</code> và bước <code>gh attestation verify</code>.</li>
</ol><p><strong>Đạt khi:</strong> <code>docker buildx imagetools inspect ghcr.io/&lt;bạn&gt;/&lt;app&gt;:sha-&lt;7&gt;</code> liệt kê cả <code>linux/amd64</code> và <code>linux/arm64</code>; bước build của lần push thứ hai ngắn hơn rõ rệt lần đầu; và (kho public) <code>gh attestation verify</code> in ra đúng tên tệp workflow của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">multi-stage build (dựng nhiều tầng)</span><span class="v">Dockerfile nhiều <code>FROM</code>; tầng cuối chỉ chép kết quả từ tầng trước</span></div>
<div class="kv"><span class="k">buildx / QEMU</span><span class="v">bộ dựng đa nền tảng của Docker / bộ giả lập CPU để chạy lệnh arm64 trên máy x86</span></div>
<div class="kv"><span class="k">image index (chỉ mục ảnh)</span><span class="v">một digest trỏ tới nhiều manifest, mỗi manifest một nền tảng</span></div>
<div class="kv"><span class="k">digest</span><span class="v"><code>sha256:…</code> của nội dung — địa chỉ bất biến của một ảnh</span></div>
<div class="kv"><span class="k">cache <code>type=gha</code></span><span class="v">tầng BuildKit lưu vào dịch vụ cache của GitHub Actions; <code>mode=max</code> lưu cả tầng trung gian</span></div>
<div class="kv"><span class="k">artifact attestation</span><span class="v">bản khai nguồn gốc (SLSA provenance) có chữ ký, gắn digest với workflow + commit</span></div>
<div class="kv"><span class="k">Sigstore / Rekor</span><span class="v">dịch vụ cấp chứng chỉ ký ngắn hạn / sổ công khai ghi mọi chữ ký</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dockerfile hai tầng: chép lockfile trước, <code>npm ci --omit=dev</code>, tầng chạy <code>USER node</code> — 82 gói thay vì 172.</li>
<li>buildx + QEMU đẩy một chỉ mục trỏ tới hai manifest amd64/arm64; cùng tag chạy được trên VPS x86 lẫn Mac M1.</li>
<li>Deploy bằng tag <code>sha-</code> (bất biến); semver cho con người; không deploy <code>latest</code>.</li>
<li>Cache <code>type=gha</code>: 27 giây lạnh, 7 giây khi chỉ đổi workflow, 25 giây khi bump version làm đổi lockfile.</li>
<li><code>actions/attest</code> ký ảnh bằng chứng chỉ Sigstore xin từ token OIDC; <code>gh attestation verify</code> cho biết workflow, nhánh, commit đã dựng nó.</li>
<li>Quyền ghi gói và <code>id-token</code> chỉ ở job dựng ảnh; không PAT — <code>GITHUB_TOKEN</code> đủ.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Publishing Docker images</span><span class="lc-sub">docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images — GHCR với <code>GITHUB_TOKEN</code>, metadata-action, build-push-action, attestation.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/attest — README (v4.2.2)</span><span class="lc-sub">github.com/actions/attest — quyền cần có, <code>push-to-registry</code>, điều kiện theo gói (public vs Enterprise Cloud).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Docs — Cache management with GitHub Actions</span><span class="lc-sub">docs.docker.com/build/ci/github-actions/cache — <code>type=gha</code>, <code>scope</code>, <code>mode=max</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Docs — Multi-platform image with GitHub Actions</span><span class="lc-sub">docs.docker.com/build/ci/github-actions/multi-platform — QEMU so với runner ARM gốc.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — ch15-cd.yml, job anh</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/blob/ch15-capstone/.github/workflows/ch15-cd.yml — và các run 36074781609 · 36075460464 · 36075733214.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — multi-stage, .dockerignore, USER</span><span class="lc-sub">/courses/docker/learn${REF} — từng lệnh trong Dockerfile ở trên, giải thích từ đầu.</span></span></div>
</div>
`,
    },
    {
      title: '15.3 — Deploying safely: environment, SSH, a lock, a smoke test, automatic rollback|||15.3 — Deploy an toàn: environment, SSH, khoá, smoke test, tự quay lui',
      slug: 'ga-15-3-deploy-an-toan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Deploy mô phỏng qua SSH vào một container trong job: environment không tự tạo, lịch sử deploy bị ghi bẩn, ảnh CMD sai qua mọi phép kiểm rồi tự quay lui trong 2,7 giây, và hai cái khoá — một hủy mất bản trước, một xếp hàng đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Deploying safely: an environment, SSH, a lock, a smoke test, and an automatic rollback in 2.7 seconds</h2>
<p class="lead">The image is built, signed and on GHCR. This lesson puts it into "production" — and spends most of its time on what happens when things go wrong: two merges close together, an environment that does not exist yet, a deploy history written dirty, and an image that passes every CI check and then dies as soon as it starts. Every one of these happened for real in the sandbox, and each left a run you can open.</p>

<p>One thing first: <strong>the deploy in this lesson is SIMULATED</strong>. There is no real server. The "VPS" is a container running sshd, built inside the <code>trien-khai</code> job itself, and it vanishes with the runner when the job ends. Everything else — SSH with keys, pulling the image from GHCR, swapping containers, Postgres, an HTTP smoke test, the Deployments API, <code>concurrency</code> — is real and behaves exactly as it would against a real VPS. Lessons 9.1–9.4 simulated the same idea with a container and no SSH; this lesson adds the SSH layer, a real image from a registry, and GitHub&#39;s deploy history as the source of truth.</p>

<h3>The picture: SSH into a "VPS" that lives inside the job</h3>
${slide('ga-15', 15, 'Simulation: SSH into a “VPS” that is a container inside the job')}
<p>The sandbox&#39;s <code>ch15/deploy/</code> directory holds three files that make up the "VPS":</p>
<ul>
<li><code>Dockerfile</code>: Alpine + <code>openssh-server</code> + <code>docker-cli</code>; a <code>deployer</code> user (not root); a file <code>/etc/ssh/sshd_config.d/01-chi-khoa.conf</code> that disables password login and forbids root — the same two lines api-backend set on its real VPS on 18/09/2026, including the <code>01-</code> prefix so it beats <code>50-cloud-init.conf</code>.</li>
<li><code>vao.sh</code>: at start-up, installs the allowed public key into <code>authorized_keys</code>, adds <code>deployer</code> to the group owning <code>docker.sock</code>, then runs <code>sshd</code>.</li>
<li><code>trien-khai.sh</code>: the script that runs <em>on</em> the VPS over SSH — create Postgres if missing, record the image currently running, pull the new image, swap the <code>ch15-app</code> container. It does <strong>not</strong> check health itself: the workflow does that from the outside.</li>
</ul>
<p>The Docker CLI inside the VPS talks to the runner&#39;s Docker daemon through the socket, so the app and DB containers actually run on the runner — the app&#39;s port 19153 is open on the runner itself, and the smoke-test step calls <code>http://localhost:19153</code> the way a user calls a domain. Only one thing differs from a real VPS: the fake one dies with the job. So before each deploy the workflow has a step clearly labelled <code>MO PHONG: dua VPS ve trang thai production hien tai</code> ("SIMULATION: bring the VPS back to the current production state") — it recreates the version production is running, so the deploy has something to replace and something to roll back to. On a real VPS that step does not exist: the state is simply there.</p>

<h3>Environments: the first two attempts</h3>
${slide('ga-15', 16, 'Environment: naming it from a job failed, the Deployments API created it')}
<pre><code class="language-yaml">  trien-khai:
    needs: anh
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    environment:
      name: ch15-production
      url: http://localhost:19153/healthz
    concurrency:
      group: ch15-production
      cancel-in-progress: false
    permissions:
      contents: read
      packages: read
      deployments: read</code></pre>
<p>The docs (09/2026) say: <em>"Running a workflow that references an environment that does not exist will create an environment with the referenced name."</em> The branch&#39;s first run, ${RUN(36074781609)}, said otherwise: <code>trien-khai</code> ran no step, had no log (the API returned 404), and the run page had exactly one annotation — <strong><code>environment not found</code></strong>. "Re-run failed jobs" left the re-run waiting forever without starting; cancelling it returned <code>409 Cannot cancel a workflow re-run that has not yet queued</code>.</p>
<p>The sandbox&#39;s environment was created another way, in run ${RUN(36075156166)} on a test branch: a job with <code>permissions: deployments: write</code> called the Deployments API to create a <em>deployment</em> for <code>ch15-production</code>, then marked it <code>inactive</code>:</p>
<div class="out">deployment 6650623893
trang thai: inactive
ch09-production
ch15-production        &lt;- GET /repos/.../environments (with GITHUB_TOKEN)</div>
<p>The run&#39;s second job used <code>environment: ch15-production</code> and ran normally. We do not know for certain why the docs&#39; "auto-create" path did not work here (possibly because of how the authoring session pushed code to the repository); what is certain is: <strong>do not let your first production deploy also be the first time the environment is mentioned</strong>. Create it beforehand — in Settings → Environments if you are an admin, or through the API as above.</p>
<p>An environment created this way is <em>bare</em>: no reviewers, no secrets, no branch restriction. Those are the three things that make environments worth using (Lesson 9.4), and all three need repository admin rights:</p>
<table>
<thead><tr><th>Protection rule</th><th>What it does</th><th>Public repo, Free plan (09/2026)</th></tr></thead>
<tbody>
<tr><td>Required reviewers</td><td>up to 6 people/teams; one approval is enough; the job waits until approved</td><td>yes</td></tr>
<tr><td>Deployment branches and tags</td><td>only chosen branches/tags may deploy to the environment</td><td>yes</td></tr>
<tr><td>Environment secrets</td><td>only jobs referencing the environment can read them, and only after approval</td><td>yes (private repos need Pro/Team or above)</td></tr>
<tr><td>Wait timer</td><td>wait N minutes before the job runs</td><td>yes</td></tr>
</tbody>
</table>
<div class="callout warn"><p><strong>⏳ Not yet run for real in the cloud: reviewers and environment secrets for <code>ch15-production</code>.</strong> Configuring environment protection rules needs admin rights, and the authoring session had no tool that reaches that API. The workflow is already written for when they exist: it reads <code>secrets.CH15_SSH_KEY</code> and <code>secrets.CH15_DB_PASSWORD</code>, and when they are empty it prints <code>::notice title=Khoa SSH tam::environment ch15-production chua co secret CH15_SSH_KEY</code> and generates a temporary key for that run only. Lesson 9.4 ran the approve/reject flow for real on <code>ch09-production</code> — see runs 36018120566 and 36018283303 there.</p></div>

<h3>SSH done properly</h3>
${slide('ga-15', 17, 'SSH done properly: a dedicated key, a pinned host key, no root')}
<pre><code class="language-yaml">    env:
      SSH_KEY: &#36;{{ secrets.CH15_SSH_KEY }}
      DB_PASSWORD: &#36;{{ secrets.CH15_DB_PASSWORD }}
    steps:
      - name: Chuan bi khoa SSH va mat khau DB
        run: |
          mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
          if [ -n "$SSH_KEY" ]; then
            printf '%s\\n' "$SSH_KEY" &gt; ~/.ssh/vps
          else
            ssh-keygen -q -t ed25519 -N '' -C ch15-tam -f ~/.ssh/vps
            echo "::notice title=Khoa SSH tam::environment ch15-production chua co secret CH15_SSH_KEY"
          fi
          chmod 600 ~/.ssh/vps
          # DB password: from the secret; if empty, generate one and mask it in the log
          if [ -z "$DB_PASSWORD" ]; then
            DB_PASSWORD=$(openssl rand -hex 16)
            echo "::add-mask::$DB_PASSWORD"
            echo "DB_PASSWORD=$DB_PASSWORD" &gt;&gt; "$GITHUB_ENV"
          fi
      - name: "MO PHONG: dung 'VPS' (container sshd trong job)"
        run: |
          # ... docker build + docker run ch15-vps ...
          ssh-keyscan -t ed25519 -p 19152 127.0.0.1 2&gt;/dev/null &gt; ~/.ssh/known_hosts
          ssh-keygen -lf ~/.ssh/known_hosts
          printf 'Host vps\\n  HostName 127.0.0.1\\n  Port 19152\\n  User deployer\\n  IdentityFile ~/.ssh/vps\\n  StrictHostKeyChecking yes\\n' &gt; ~/.ssh/config
          ssh vps 'echo "da vao $(hostname) voi user $(whoami)"; docker version --format "docker {{.Server.Version}}"'</code></pre>
<div class="out">256 SHA256:QZfetKJhiTBioVV7zxI2Fs0gNWgycJrNWfrc3U1rMiw [127.0.0.1]:19152 (ED25519)
da vao b4907221cc9e voi user deployer
docker 28.0.4</div>
<ul>
<li><strong>Pin the host key; do not switch the check off.</strong> <code>StrictHostKeyChecking no</code> is the most common line in SSH workflows on the internet, and it turns SSH into "hand my key to whoever answers at this address". Here <code>ssh-keyscan</code> runs right next to the VPS it just built (SIMULATION — two containers on one machine); with a real VPS the <code>known_hosts</code> line is stored in an environment secret/variable and the job only writes it out.</li>
<li><strong>A dedicated user, not root.</strong> <code>deployer</code> only has the rights of the <code>docker.sock</code> group — enough to swap containers, not enough to change sshd.</li>
<li><strong>The DB password travels over stdin</strong>: <code>printf '%s\\n' "$DB_PASSWORD" | ssh vps "read -r DB_PASSWORD &amp;&amp; …"</code>. As a command-line argument it would show in <code>ps</code> on the VPS; as an environment variable SSH would not carry it (unless sshd has <code>AcceptEnv</code>).</li>
<li><strong>Logging in to GHCR on the VPS with <code>GITHUB_TOKEN</code></strong>, also over stdin (<code>--password-stdin</code>). The log prints the warning every real VPS prints too: <em>"Your credentials are stored unencrypted… Configure a credential helper to remove this warning."</em> This token expires when the job ends, so it is harmless here; on a real VPS use a credential helper or <code>docker logout</code> after pulling.</li>
</ul>

<h3>"The previous version" is the one production is running — and the first attempt asked wrong</h3>
${slide('ga-15', 18, '“The previous version” = the one RUNNING — ask the Deployments API')}
<p>A rollback needs an address: the image of what was running before this deploy. Lesson 9.3 exposed the "guess the parent commit" trap (the parent may be the very broken version that was just rolled back). Here the source of truth is the environment&#39;s history: every job with <code>environment:</code> creates a <em>deployment</em>, and GitHub records its final state (<code>success</code>/<code>failure</code>). Version 1 of that step:</p>
<pre><code class="language-bash">for id in $(gh api "repos/$GITHUB_REPOSITORY/deployments?environment=ch15-production&amp;per_page=30" --jq '.[].id'); do
  st=$(gh api "repos/$GITHUB_REPOSITORY/deployments/$id/statuses?per_page=1" --jq '.[0].state // ""')
  if [ "$st" = "success" ]; then PREV_SHA=$(gh api ".../deployments/$id" --jq .sha); break; fi
done
PREV="&#36;{ANH_GOC}:sha-&#36;{PREV_SHA::7}"</code></pre>
<p>Run ${RUN(36075225804)} shows where it goes wrong:</p>
<div class="out">production dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-069ee49 (deployment 6650624512)
[vps] chua co Postgres -&gt; tao ch15-db
[vps] keo: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-069ee49
Error response from daemon: manifest unknown
##[error]Process completed with exit code 1.</div>
<p><code>069ee49</code> is the commit of the test branch that created the environment above. That test run&#39;s second job only ran <code>echo</code> — but it had <code>environment: ch15-production</code>, so GitHub recorded a <strong>success</strong> deployment in production&#39;s history. With an environment that has no branch restriction, <em>any</em> job on <em>any</em> branch naming it writes into the same book. The fix has two layers:</p>
<ul>
<li><strong>In the workflow</strong> (done, commit <code>54cc614</code>): filter <code>&amp;ref=ch15-capstone</code>, and check the image exists with <code>docker buildx imagetools inspect</code> before treating it as "previous"; if it does not, print a <code>::warning</code> and treat it as "no rollback target".</li>
<li><strong>In configuration</strong> (needs admin — see the note above): Deployment branches = the main branch only. One setting blocks the whole class of error, because a job on another branch is refused before it can write anything.</li>
</ul>
<p>After the fix, consecutive deploys show the book being read correctly: the first (${RUN(36075460464)}) <code>chua co lan deploy thanh cong nao tu ch15-capstone — lan dau, khong co dich quay lui</code> ("no successful deploy from ch15-capstone yet — first time, no rollback target"); the second (${RUN(36075733214)}) <code>PREV = sha-54cc614</code>; and the one after the broken deploy (${RUN(36076249655)}) <code>PREV = sha-39c37de</code> — skipping exactly the broken <code>4787c43</code>, because its deployment ended in <code>failure</code>.</p>

<h3>A green deploy, and what the smoke test checks</h3>
${slide('ga-15', 19, 'Green deploy: image swapped in 1 second, smoke test checks the RIGHT version')}
<div class="out">[vps] dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-54cc614
[vps] keo: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
[vps] da trao: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-54cc614 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
curl: (56) Recv failure: Connection reset by peer
lan 1: chua tra loi (container: running restart=0 exit=0)
lan 2: {"ok":true,"phienBan":"1.1.0+39c37de04a4a8612cf63281a661a18a52bc3e67d","db":"ok"}
GET /api/lich -&gt; 200
GET / -&gt; 200
| Thoi gian tu luc deploy | 3 s |</div>
<p>Run ${RUN(36075733214)}, version 1.1.0. The "Deploy qua SSH" step took one second — half the image was already local because it shares layers with the previous version. The smoke test is the part worth reading:</p>
<ul>
<li><strong>The first attempt always fails</strong> (<code>Connection reset by peer</code>): the container is running but the app is still waiting for Postgres (<code>src/server.js</code> retries up to 10 times). That is why the smoke test is a <em>bounded</em> loop (15 × 2 seconds), not a fixed <code>sleep 30</code> — fast when the app is fast, capped when it is dead.</li>
<li><strong>It checks the exact version</strong>: <code>/healthz</code> returns <code>phienBan = &lt;version&gt;+&lt;full SHA&gt;</code> (passed in at build time, Lesson 15.2), and the smoke test matches it against the run&#39;s <code>&#36;{GITHUB_SHA}</code>. If for some reason the old container were still answering — a failed swap, a port pointing at the wrong thing — an "is it answering" check would be green; the version check would not.</li>
<li><strong>It checks the data path</strong>: <code>GET /api/lich</code> 200 means the DB connection, table and query are alive; <code>GET /</code> 200 means the static page is in the image. The smoke test only <strong>reads</strong>: it never writes test data into production.</li>
</ul>

<h3>A broken deploy: everything green except the one thing that matters</h3>
${slide('ga-15', 20, 'Broken deploy: everything green, the container dies — automatic rollback')}
<p>Commit <code>4787c43</code> (version 1.2.0) does an entirely ordinary refactor: rename <code>src/server.js</code> to <code>src/index.js</code>, update <code>main</code> and <code>start</code> in <code>package.json</code> — and forget the <code>CMD ["node", "src/server.js"]</code> line in the Dockerfile. Count how many checks let it through:</p>
<table>
<thead><tr><th>Check</th><th>Result in run ${RUN(36075892650)}</th><th>Why it missed</th></tr></thead>
<tbody>
<tr><td>lint, typecheck</td><td>green</td><td>they do not read the Dockerfile</td></tr>
<tr><td>test (22), test (24)</td><td>green</td><td>tests import <code>src/app.js</code>; they never run the start command</td></tr>
<tr><td>two-architecture image build</td><td>green</td><td>Docker does not check that the file in <code>CMD</code> exists</td></tr>
<tr><td>attestation, <code>gh attestation verify</code></td><td>green</td><td>proves provenance, not that the image runs</td></tr>
<tr><td><strong>smoke test</strong></td><td><strong>red</strong></td><td>—</td></tr>
</tbody>
</table>
<div class="out">curl: (56) Recv failure: Connection reset by peer
lan 1: chua tra loi (container: restarting restart=1 exit=1)
curl: (7) Failed to connect to localhost port 19153 after 0 ms: Couldn't connect to server
lan 2: chua tra loi (container: running restart=4 exit=0)
...
lan 15: chua tra loi (container: restarting restart=9 exit=1)
--- 5 dong log cuoi cua container ---
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}
Node.js v22.23.3
##[error]Process completed with exit code 1.
quay lui: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
[vps] dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43
[vps] da trao: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
{"ok":true,"phienBan":"1.1.0+39c37de04a4a8612cf63281a661a18a52bc3e67d","db":"ok"}
quay lui XONG sau lan 2
| Smoke test | failure |
| Production dang chay | ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de |
| Thoi gian tu luc deploy | 34 s |</div>
<p>Read <code>restart=1 … restart=9</code>: <code>--restart unless-stopped</code> makes Docker restart the container over and over, and between restarts the state flips between <code>running</code> and <code>restarting</code> — one glance at <code>docker ps</code> may show "running" and make you think all is well. That is the exact shape of api-backend&#39;s 18/08/2026 incident: "build green, push green, swap green, then the backend restarted forever and the API was down with 502 for seven minutes". The only difference here is a smoke-test loop standing guard, and the step after it:</p>
<pre><code class="language-yaml">      - name: TU quay lui ve ban truoc
        if: failure() &amp;&amp; (steps.smoke.outcome == 'failure' || steps.theo-doi.outcome == 'failure') &amp;&amp; env.PREV != ''
        run: |
          echo "quay lui: $ANH -&gt; $PREV"
          printf '%s\\n' "$DB_PASSWORD" | ssh vps "read -r DB_PASSWORD &amp;&amp; export DB_PASSWORD &amp;&amp; /srv/phong-kham/trien-khai.sh '$PREV'"
          for i in $(seq 1 15); do
            curl -fsS --max-time 2 http://localhost:19153/healthz &amp;&amp; { echo; echo "quay lui XONG sau lan $i"; exit 0; }
            sleep 2
          done
          echo "::error::quay lui cung khong len — can nguoi vao xem"; exit 1</code></pre>
<ul>
<li><strong>The rollback took 2.7 seconds</strong> (00:08:08.04 → 00:08:10.74): the <code>sha-39c37de</code> image was already local because it had just been running. Compare with the ~40-second manual "tag the orphaned image" procedure in api-backend&#39;s CLAUDE.md, and with the seven minutes of the real incident.</li>
<li><strong>The run is still RED.</strong> Production is healthy again, but version 1.2.0 was not deployed — that is the truth to report, and its deployment is recorded as <code>failure</code> so nobody treats it as "previous" later.</li>
<li><strong>Rollback can fail too</strong> — for instance when the new version already ran a migration that dropped a column. The step has its own way out (<code>::error::quay lui cung khong len — can nguoi vao xem</code>, "rollback did not come up either — a human must look"), and Lesson 9.3 explains why schema changes need two migrations so rollback stays safe.</li>
<li><strong>Read the container log all the way.</strong> "Last 5 lines" only showed the tail of the stack trace (<code>MODULE_NOT_FOUND</code>); commit <code>9b26683</code> changed that step to print the first <code>Error</code> line — where the missing file name is.</li>
</ul>
<p>Commit <code>d161477</code> (1.2.1) fixes <code>CMD</code>; run ${RUN(36076249655)} is green, and the "ask production" step picks <code>sha-39c37de</code> as the rollback target — the broken 1.2.0 is never treated as "previous".</p>

<h3>The production lock: two merges close together</h3>
${slide('ga-15', 21, 'The CI lock cancelled the earlier version; the deploy lock queues')}
<p>api-backend&#39;s 06/07/2026 incident — two deploy workflows running over each other, a container killed with <code>Exited(137)</code> and orphans left behind — is why the <code>trien-khai</code> job has:</p>
<pre><code class="language-yaml">    concurrency:
      group: ch15-production
      cancel-in-progress: false</code></pre>
<p>The docs state the rule: <em>"at most one running and one pending job in a concurrency group at any time"</em>; a new job entering the group replaces the pending one. To watch it work, the sandbox pushed commits close together to <code>ch15-capstone</code> — and the first attempt found a bug before it even reached the deploy lock.</p>
<p><strong>Phase A — two pushes 6 seconds apart, CI lock still keyed on <code>github.ref</code>.</strong> Commit <code>9b26683</code> at 00:12:45, <code>0fef5f5</code> at 00:12:51. Remember that CD calls <code>ch15-ci.yml</code>, whose lock is <code>ch15-ci-&#36;{{ github.event.pull_request.number || github.ref }}</code>. A push has no PR number, so both CD runs share one CI group:</p>
<div class="out">run 36076482487 (9b26683) — CANCELLED after 29 seconds
  ci / lint        Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / typecheck   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / test (22)   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / test (24)   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ch15 · CD        Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  anh 0s · trien-khai 0s
run 36076491163 (0fef5f5) — success</div>
<p>Commit <code>9b26683</code> <strong>was never deployed</strong>. With two consecutive commits that is harmless (the later one contains the earlier), but imagine the earlier one is a security fix and the later one fails CI: the main branch has the fix, production does not, and no run reports red for the fix — it was merely "cancelled". The CI lock only makes sense for PRs; commit <code>acd5829</code> changes the group to <code>&#36;{{ github.event.pull_request.number || github.run_id }}</code>: PRs still lock per PR number, pushes get one group per run.</p>
<p><strong>Phase B — three pushes about 15 seconds apart, after the fix.</strong> Commit <code>acd5829</code> also adds a "Theo doi sau deploy" (post-deploy watch) step that keeps the deploy job 30 more seconds (checking <code>/healthz</code> every 5 seconds — a small test for failures that only show after a few seconds, and room for the lock to queue):</p>
<div class="out">run 36076856479  acd5829  push 00:17:30   trien-khai: created 00:18:57 · ran 00:19:01 → 00:19:55   success
run 36076881355  5c7b348  push 00:17:50   trien-khai: created 00:19:02 · WAITING (pending) ...
                                          00:19:48  Canceling since a higher priority waiting request for ch15-production exists
run 36076899299  c17030d  push 00:18:04   trien-khai: created 00:19:47 · WAITING → ran 00:19:58 → 00:21:00   success
                                          PREV = ghcr.io/cuonghoang1103/ch15-phong-kham:sha-acd5829</div>
<ul>
<li><strong>No deploy was killed halfway.</strong> The <code>c17030d</code> job was created at 00:19:47, while <code>acd5829</code>&#39;s deploy was running; it waited, and started only at 00:19:58 — three seconds after the previous deploy finished (00:19:55). That is the whole meaning of <code>cancel-in-progress: false</code>.</li>
<li><strong>The middle version was skipped, and that is correct.</strong> <code>5c7b348</code>&#39;s deploy waited 46 seconds, then was replaced by a newer one: "at most one running, one pending". Nobody needs production to pass through <code>5c7b348</code> when <code>c17030d</code> contains it. Its run shows grey "cancelled"; its CI and image are still green.</li>
<li><strong>The deploy book stays right.</strong> <code>c17030d</code> asked production and got <code>sha-acd5829</code> as its rollback target — not <code>5c7b348</code>, which was never deployed.</li>
<li><strong>Two locks, two purposes.</strong> The CI lock: only to save runners on PRs, keyed by PR number. The deploy lock: so two swaps never overlap, keyed by environment name, and never cancelling what is running.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — reusing the "cancel old runs" pattern for deploys.</strong> <code>cancel-in-progress: true</code> on a deploy job means a new push can kill a deploy halfway through a container swap — exactly the shape of the 06/07 <code>Exited(137)</code>. And api-backend&#39;s <code>deploy-ghcr.yml</code> still has that line, safe only because that workflow is now manual-only.</div>

<h3>Compared with how the real repository deploys</h3>
${slide('ga-15', 22, 'Compared with deploy-nha.sh: it has a lock, it lacks automatic rollback')}
<p>api-backend does not deploy with Actions: <code>deploy-nha.sh</code> builds the images on a 12-core home machine, pushes to GHCR, then SSHes into the VPS to swap. Side by side, fairly:</p>
<table>
<thead><tr><th></th><th><code>deploy-nha.sh</code> (09/2026)</th><th><code>ch15-cd.yml</code></th></tr></thead>
<tbody>
<tr><td>Who presses</td><td>a person, from the home machine</td><td>a merge into the main branch</td></tr>
<tr><td>Checks before the swap</td><td>tsc, eval, <code>npm test</code> run <em>after</em> the swap; they only decide whether to push to GitHub</td><td>CI re-runs <em>before</em> the image is built (<code>needs: ci</code>)</td></tr>
<tr><td>Image build</td><td>home machine, parallel, ~3× faster than the VPS</td><td>GitHub runner, 2 architectures, gha cache</td></tr>
<tr><td>Lock</td><td><code>flock -n /var/lock/cuongthai-deploy.lock</code> on the VPS: a second session is <strong>refused</strong></td><td><code>concurrency</code>: a second one <strong>queues</strong>, a third replaces it</td></tr>
<tr><td>Knowing what production runs</td><td>reads the SHA from the running image; <strong>blocks deploys that would move code backwards</strong> if the new version does not contain the running one</td><td>Deployments API: the latest <code>success</code> on the main branch</td></tr>
<tr><td>Smoke test</td><td>yes — a route returning 404 means an old/broken image</td><td>yes — version, <code>/api</code>, static page</td></tr>
<tr><td>Rollback</td><td>manual: <code>--cho-lui</code>, or tag an orphaned image (~40 seconds)</td><td>automatic when the smoke test fails (2.7 seconds)</td></tr>
<tr><td>Trail</td><td>the log on the operator&#39;s terminal</td><td>deployment + status on GitHub, readable through the API</td></tr>
</tbody>
</table>
<p>The repository&#39;s script is not "the wrong way": it is the product of three real incidents, and it already has the two hardest things — a lock, and an anti-regression check that <code>ch15-cd.yml</code> lacks. What this chapter brings back to it: <strong>checking before the swap</strong> (today a red <code>npm test</code> still leaves production on the freshly swapped image) and <strong>automatic rollback</strong> when the smoke test fails.</p>

<h3>Step by step: a locked deploy with rollback</h3>
<ol>
<li>Create a <code>production</code> environment (Settings, or the Deployments API); if you are an admin, set Deployment branches = <code>main</code> and one reviewer.</li>
<li>Add a <code>deploy</code> job with <code>needs: anh</code>, <code>environment: production</code>, <code>concurrency: { group: production, cancel-in-progress: false }</code>, permissions <code>packages: read</code> + <code>deployments: read</code>.</li>
<li>First step: query <code>deployments?environment=production&amp;ref=main</code>, take the SHA of the latest <code>success</code>, and check the <code>sha-…</code> image exists.</li>
<li>Deploy over SSH (key from a secret, pinned <code>known_hosts</code>, non-root user); a bounded smoke-test loop that matches the version.</li>
<li>A rollback step with <code>if: failure() &amp;&amp; steps.smoke.outcome == 'failure'</code>.</li>
<li>Deliberately push a version with a wrong <code>CMD</code>; confirm the run is red and production still returns the old version.</li>
<li>Push three commits 15 seconds apart; find <code>Canceling since a higher priority waiting request for production</code> on the middle run.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How does your deploy roll back? How do you know which version is "previous"?</strong><br>A: The previous version is the one production is running, not the parent commit — I ask the environment&#39;s deployment history (filtered to the main branch, latest success), check the SHA-tagged image still exists, and the rollback step swaps exactly that image back in when the smoke test fails. Measured: detected after 30 seconds, rolled back in 2.7 seconds.</p>
<p><strong>Q: Build green, tests green, production still went down. What could it be?</strong><br>A: A wrong start command (CMD pointing at a missing file), an environment variable that only exists in production, a base image with a different libc from a native dependency, a migration... CI does not run the image the way production does. That is why you need a post-deploy smoke test that checks the returned version too, not just "it answers".</p>
<p><strong>Q: Two people merge at almost the same moment. What does your pipeline do?</strong><br>A: The deploy job has its own <code>concurrency</code> with <code>cancel-in-progress: false</code>: one runs, one waits, the waiting one is replaced if a newer one arrives — a running deploy is never killed. And the CI lock must not cancel the previous version&#39;s CI on the main branch (I hit exactly that bug).</p>
<p><strong>Q: How do you SSH from CI into a server safely?</strong><br>A: A dedicated CI key in an environment secret (only the deploy job sees it, after approval), a pinned <code>known_hosts</code> instead of disabling the check, a non-root user with just enough rights, password login off in sshd; better still, no SSH at all — the server pulls the image, or OIDC to a cloud.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your repository already builds an image in CI (Lesson 15.2). Add a simulated deploy with a lock and rollback — no real VPS needed.</p><ol>
<li>Copy the sandbox&#39;s <code>ch15/deploy/</code> into your repository (Dockerfile + <code>vao.sh</code> + <code>trien-khai.sh</code>), changing the image name and port.</li>
<li>Add a <code>deploy</code> job as in "Step by step", using an environment in your repository.</li>
<li>Push a good version, then one with a wrong <code>CMD</code>, then the fix.</li>
<li>Run <code>gh api "repos/&lt;owner&gt;/&lt;repo&gt;/deployments?environment=&lt;name&gt;" --jq '.[] | [.id, .sha[0:7], .ref] | @tsv'</code> and match it against each run&#39;s status.</li>
</ol><p><strong>Done when:</strong> the wrong-<code>CMD</code> run is red and its summary shows "Production dang chay" as the good version&#39;s image; the fix run prints <code>production dang chay: …sha-&lt;good version&gt;</code> in the ask-production step (not the broken SHA); and the API lists all three deployments.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">environment</span><span class="v">a named deploy target carrying protection rules (reviewers, branches, its own secrets) and a deployment history</span></div>
<div class="kv"><span class="k">deployment / deployment status</span><span class="v">the record GitHub creates for each job with <code>environment:</code>, ending in <code>success</code>/<code>failure</code></span></div>
<div class="kv"><span class="k">smoke test</span><span class="v">a few fast, read-only checks right after a deploy — "is it alive, and is it the right version"</span></div>
<div class="kv"><span class="k">rollback</span><span class="v">swapping back the image of the last successful production version</span></div>
<div class="kv"><span class="k"><code>known_hosts</code></span><span class="v">the list of known SSH host keys — pinned so you never connect to the wrong machine</span></div>
<div class="kv"><span class="k"><code>cancel-in-progress: false</code></span><span class="v">a queuing lock: never kills the running job; a new pending job replaces the old pending one</span></div>
<div class="kv"><span class="k">simulation</span><span class="v">the deploy target is a container inside the job; every mechanism is real except a long-lived server</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Simulated deploy: SSH (key, pinned <code>known_hosts</code>, non-root user) into an sshd container inside the job, pull the <code>sha-</code> image from GHCR, swap the container, smoke-test over HTTP.</li>
<li>A missing environment made the job fail with "environment not found"; create it first (Settings or the Deployments API), and add branch restrictions + reviewers when you have admin rights.</li>
<li>"Previous version" = the latest <code>success</code> deployment <em>of the main branch</em>, image still existing — without the branch filter a test job can dirty production&#39;s history.</li>
<li>An image with a wrong <code>CMD</code> passes every CI check and the signature; only the smoke test catches it, and automatic rollback brings production back in 2.7 seconds.</li>
<li>Deploy <code>concurrency</code> with <code>cancel-in-progress: false</code>: one running, one pending, the pending replaced; the CI lock on pushes must key on <code>run_id</code> or it cancels the previous version&#39;s CI.</li>
<li>Compared with <code>deploy-nha.sh</code>: the repository already has a lock and an anti-regression check; what to add is checking before the swap and automatic rollback.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deployments and environments</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — reviewers (up to 6), deployment branches, environment secrets, plan requirements.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments — the "referencing a missing environment creates it" sentence the sandbox measured as not holding.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Concurrency</span><span class="lc-sub">docs.github.com/en/actions/concepts/workflows-and-actions/concurrency — one running, one pending; a new pending job replaces the old one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Deployments</span><span class="lc-sub">docs.github.com/en/rest/deployments/deployments — listing by <code>environment</code>, <code>ref</code>, <code>sha</code>; each deployment&#39;s statuses.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — ch15/deploy and ch15-cd.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone/ch15/deploy — the fake VPS and <code>trien-khai.sh</code>; the runs cited in this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🖥</span><span class="lc-body"><span class="lc-title">Deploying to a VPS — SSH, keys, a deploy user</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the real-server version of what this lesson simulates.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Deploy an toàn: environment, SSH, một cái khoá, smoke test, và cú quay lui tự động mất 2,7 giây</h2>
<p class="lead">Ảnh đã được dựng, ký và đẩy lên GHCR. Bài này đưa nó lên "production" — và dành phần lớn thời gian cho những gì xảy ra khi mọi thứ đi sai: hai lần merge sát nhau, một environment chưa tồn tại, một lịch sử deploy bị ghi bẩn, và một ảnh vượt qua mọi phép kiểm của CI rồi chết ngay khi khởi động. Mọi tình huống đều đã xảy ra thật trên sân tập, và mỗi cái để lại một run để bạn mở ra xem.</p>

<p>Một điều phải nói trước: <strong>deploy trong bài này là MÔ PHỎNG</strong>. Không có máy chủ thật nào. "VPS" là một container chạy sshd, dựng ngay bên trong job <code>trien-khai</code>, và biến mất cùng runner khi job xong. Mọi thứ khác — SSH bằng khoá, kéo ảnh từ GHCR, trao container, Postgres, smoke test qua HTTP, Deployments API, <code>concurrency</code> — là thật và chạy đúng như nó sẽ chạy với một VPS thật. Bài 9.1–9.4 đã mô phỏng cùng ý tưởng bằng một container không có SSH; bài này thêm tầng SSH, ảnh thật từ registry, và lịch sử deploy của GitHub làm nguồn sự thật.</p>

<h3>Bức tranh: SSH vào một "VPS" nằm trong chính job</h3>
${slide('ga-15', 15, 'Deploy mô phỏng: SSH vào một “VPS” là container trong chính job')}
<p>Thư mục <code>ch15/deploy/</code> trên sân tập chứa ba tệp dựng nên "VPS":</p>
<ul>
<li><code>Dockerfile</code>: Alpine + <code>openssh-server</code> + <code>docker-cli</code>; user <code>deployer</code> (không phải root); tệp <code>/etc/ssh/sshd_config.d/01-chi-khoa.conf</code> tắt đăng nhập bằng mật khẩu và cấm root — đúng hai dòng mà api-backend đặt cho VPS thật ngày 18/09/2026, kể cả tiền tố <code>01-</code> để thắng <code>50-cloud-init.conf</code>.</li>
<li><code>vao.sh</code>: lúc khởi động, nạp khoá công khai được phép vào <code>authorized_keys</code>, cho <code>deployer</code> vào nhóm sở hữu <code>docker.sock</code>, rồi chạy <code>sshd</code>.</li>
<li><code>trien-khai.sh</code>: script chạy <em>trên</em> VPS qua SSH — tạo Postgres nếu chưa có, ghi lại ảnh đang chạy, kéo ảnh mới, trao container <code>ch15-app</code>. Nó <strong>không</strong> tự kiểm sức khoẻ: việc đó do workflow làm từ bên ngoài.</li>
</ul>
<p>Docker CLI trong VPS nói chuyện với Docker daemon của runner qua socket, nên container app và DB thật ra chạy trên runner — cổng 19153 của app mở trên chính máy runner, và bước smoke test gọi <code>http://localhost:19153</code> như người dùng gọi tên miền. Chỉ một điều khác hẳn VPS thật: VPS giả chết cùng job. Vì vậy trước mỗi lần deploy, workflow có một bước ghi rõ nhãn <code>MO PHONG: dua VPS ve trang thai production hien tai</code> — dựng lại đúng bản đang chạy trên production, để lần deploy sau có thứ để thay thế và để quay lui về. Với VPS thật, bước ấy không tồn tại: trạng thái nằm sẵn đó.</p>

<h3>Environment: hai lần thử đầu tiên</h3>
${slide('ga-15', 16, 'Environment: gọi tên từ job thì lỗi, Deployments API thì tạo được')}
<pre><code class="language-yaml">  trien-khai:
    needs: anh
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    environment:
      name: ch15-production
      url: http://localhost:19153/healthz
    concurrency:
      group: ch15-production
      cancel-in-progress: false
    permissions:
      contents: read
      packages: read
      deployments: read</code></pre>
<p>Docs (09/2026) viết: <em>"Running a workflow that references an environment that does not exist will create an environment with the referenced name."</em> Run đầu tiên của nhánh, ${RUN(36074781609)}, nói khác: job <code>trien-khai</code> không chạy một bước nào, không có log (API trả 404), và trang run có đúng một annotation — <strong><code>environment not found</code></strong>. Bấm "Re-run failed jobs" thì lần chạy lại treo ở trạng thái chờ và không bao giờ bắt đầu; hủy nó thì API trả <code>409 Cannot cancel a workflow re-run that has not yet queued</code>.</p>
<p>Environment trên sân tập được tạo bằng đường khác, ở run ${RUN(36075156166)} trên một nhánh thử: một job có <code>permissions: deployments: write</code> gọi Deployments API để tạo một <em>deployment</em> cho <code>ch15-production</code>, rồi đánh dấu nó <code>inactive</code>:</p>
<div class="out">deployment 6650623893
trang thai: inactive
ch09-production
ch15-production        &lt;- GET /repos/.../environments (bang GITHUB_TOKEN)</div>
<p>Job thứ hai của cùng run gọi <code>environment: ch15-production</code> và chạy bình thường. Chúng tôi không biết chắc vì sao đường "tự tạo" của docs không hoạt động ở đây (có thể do cách phiên dựng bài đẩy mã lên kho); điều chắc chắn là: <strong>đừng để lần deploy production đầu tiên cũng là lần đầu environment được nhắc tới</strong>. Tạo nó trước — bằng Settings → Environments nếu bạn là admin, hoặc bằng API như trên.</p>
<p>Environment tạo kiểu này là một environment <em>trần</em>: không người duyệt, không secret, không giới hạn nhánh. Đó là ba thứ khiến environment đáng dùng (Bài 9.4), và cả ba cần quyền admin của kho:</p>
<table>
<thead><tr><th>Luật bảo vệ</th><th>Làm gì</th><th>Kho public, gói Free (09/2026)</th></tr></thead>
<tbody>
<tr><td>Required reviewers</td><td>tới 6 người/đội; một người duyệt là đủ; job chờ tới khi được duyệt</td><td>có</td></tr>
<tr><td>Deployment branches and tags</td><td>chỉ nhánh/tag được chọn mới deploy được vào environment</td><td>có</td></tr>
<tr><td>Environment secrets</td><td>chỉ job tham chiếu environment mới đọc được, và chỉ sau khi được duyệt</td><td>có (kho private cần Pro/Team trở lên)</td></tr>
<tr><td>Wait timer</td><td>chờ N phút trước khi job chạy</td><td>có</td></tr>
</tbody>
</table>
<div class="callout warn"><p><strong>⏳ Chưa chạy thật trên cloud: người duyệt và secret theo environment cho <code>ch15-production</code>.</strong> Cấu hình luật bảo vệ environment cần quyền admin, và phiên dựng bài không có công cụ nào tới được API ấy. Workflow đã viết sẵn cho lúc có: nó đọc <code>secrets.CH15_SSH_KEY</code> và <code>secrets.CH15_DB_PASSWORD</code>, và khi chúng trống thì in <code>::notice title=Khoa SSH tam::environment ch15-production chua co secret CH15_SSH_KEY</code> rồi sinh khoá tạm cho đúng lần chạy đó. Bài 9.4 đã chạy thật luồng duyệt/từ chối trên <code>ch09-production</code> — xem các run 36018120566 và 36018283303 ở đó.</p></div>
<!-- CHAY-O-MAY: tren ga-san-tap, Settings -> Environments -> ch15-production: (1) Required reviewers = cuonghoang1103; (2) Deployment branches = ch15-capstone; (3) secret CH15_SSH_KEY = khoa ed25519 thu (khong dung lai o dau), CH15_DB_PASSWORD = chuoi ngau nhien; roi push mot commit vao ch15-capstone, duyet trong tab Actions, va ghi lai: trang thai "waiting", ai duyet, khoang cho, dong "khoa SSH: lay tu environment secret CH15_SSH_KEY". Chup lai lan tu choi (reject) de doi chieu 9.4. -->

<h3>SSH đúng cách</h3>
${slide('ga-15', 17, 'SSH đúng cách: khoá riêng, host key ghim sẵn, user không phải root')}
<pre><code class="language-yaml">    env:
      SSH_KEY: &#36;{{ secrets.CH15_SSH_KEY }}
      DB_PASSWORD: &#36;{{ secrets.CH15_DB_PASSWORD }}
    steps:
      - name: Chuan bi khoa SSH va mat khau DB
        run: |
          mkdir -p ~/.ssh &amp;&amp; chmod 700 ~/.ssh
          if [ -n "$SSH_KEY" ]; then
            printf '%s\\n' "$SSH_KEY" &gt; ~/.ssh/vps
          else
            ssh-keygen -q -t ed25519 -N '' -C ch15-tam -f ~/.ssh/vps
            echo "::notice title=Khoa SSH tam::environment ch15-production chua co secret CH15_SSH_KEY"
          fi
          chmod 600 ~/.ssh/vps
          # mat khau DB: lay tu secret; trong thi sinh ngau nhien va che trong log
          if [ -z "$DB_PASSWORD" ]; then
            DB_PASSWORD=$(openssl rand -hex 16)
            echo "::add-mask::$DB_PASSWORD"
            echo "DB_PASSWORD=$DB_PASSWORD" &gt;&gt; "$GITHUB_ENV"
          fi
      - name: "MO PHONG: dung 'VPS' (container sshd trong job)"
        run: |
          # ... docker build + docker run ch15-vps ...
          ssh-keyscan -t ed25519 -p 19152 127.0.0.1 2&gt;/dev/null &gt; ~/.ssh/known_hosts
          ssh-keygen -lf ~/.ssh/known_hosts
          printf 'Host vps\\n  HostName 127.0.0.1\\n  Port 19152\\n  User deployer\\n  IdentityFile ~/.ssh/vps\\n  StrictHostKeyChecking yes\\n' &gt; ~/.ssh/config
          ssh vps 'echo "da vao $(hostname) voi user $(whoami)"; docker version --format "docker {{.Server.Version}}"'</code></pre>
<div class="out">256 SHA256:QZfetKJhiTBioVV7zxI2Fs0gNWgycJrNWfrc3U1rMiw [127.0.0.1]:19152 (ED25519)
da vao b4907221cc9e voi user deployer
docker 28.0.4</div>
<ul>
<li><strong>Ghim khoá máy chủ, đừng tắt phép kiểm.</strong> <code>StrictHostKeyChecking no</code> là dòng hay gặp nhất trong các workflow SSH trên mạng, và nó biến SSH thành "gửi khoá của tôi cho bất kỳ ai trả lời ở địa chỉ này". Ở đây <code>ssh-keyscan</code> chạy ngay cạnh VPS vừa dựng (MÔ PHỎNG — hai container trên cùng một máy); với VPS thật, dòng <code>known_hosts</code> được lưu sẵn trong một secret/biến của environment và job chỉ việc ghi nó ra.</li>
<li><strong>User riêng, không root.</strong> <code>deployer</code> chỉ có quyền trong nhóm của <code>docker.sock</code> — đủ để trao container, không đủ để sửa sshd.</li>
<li><strong>Mật khẩu DB đi qua stdin</strong>: <code>printf '%s\\n' "$DB_PASSWORD" | ssh vps "read -r DB_PASSWORD &amp;&amp; …"</code>. Truyền nó làm tham số dòng lệnh thì nó hiện trong <code>ps</code> trên VPS; truyền qua biến môi trường thì SSH không mang sang (trừ khi sshd bật <code>AcceptEnv</code>).</li>
<li><strong>Đăng nhập GHCR trên VPS bằng <code>GITHUB_TOKEN</code></strong>, cũng qua stdin (<code>--password-stdin</code>). Log in ra đúng lời cảnh báo mà mọi VPS thật cũng in: <em>"Your credentials are stored unencrypted… Configure a credential helper to remove this warning."</em> Token này hết hạn khi job xong nên ở đây vô hại; trên VPS thật, hãy dùng credential helper hoặc <code>docker logout</code> sau khi kéo ảnh.</li>
</ul>

<h3>"Bản trước" là bản production đang chạy — và lần đầu đã hỏi sai</h3>
${slide('ga-15', 18, '“Bản trước” là bản production ĐANG CHẠY — hỏi Deployments API')}
<p>Quay lui cần một địa chỉ: ảnh của bản đang chạy trước khi deploy. Bài 9.3 đã chỉ ra cái bẫy "đoán bằng commit cha" (commit cha có thể chính là bản hỏng vừa bị quay lui). Ở đây nguồn sự thật là lịch sử của environment: mỗi job có <code>environment:</code> tạo một <em>deployment</em>, và trạng thái cuối của nó (<code>success</code>/<code>failure</code>) được GitHub ghi lại. Bản 1 của bước ấy:</p>
<pre><code class="language-bash">for id in $(gh api "repos/$GITHUB_REPOSITORY/deployments?environment=ch15-production&amp;per_page=30" --jq '.[].id'); do
  st=$(gh api "repos/$GITHUB_REPOSITORY/deployments/$id/statuses?per_page=1" --jq '.[0].state // ""')
  if [ "$st" = "success" ]; then PREV_SHA=$(gh api ".../deployments/$id" --jq .sha); break; fi
done
PREV="&#36;{ANH_GOC}:sha-&#36;{PREV_SHA::7}"</code></pre>
<p>Run ${RUN(36075225804)} cho thấy nó sai ở đâu:</p>
<div class="out">production dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-069ee49 (deployment 6650624512)
[vps] chua co Postgres -&gt; tao ch15-db
[vps] keo: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-069ee49
Error response from daemon: manifest unknown
##[error]Process completed with exit code 1.</div>
<p><code>069ee49</code> là commit của nhánh thử tạo environment ở mục trên. Job thứ hai của run thử ấy chỉ <code>echo</code> — nhưng nó có <code>environment: ch15-production</code>, nên GitHub ghi một deployment <strong>success</strong> vào lịch sử production. Với environment không giới hạn nhánh, <em>bất kỳ</em> job nào trên <em>bất kỳ</em> nhánh nào gọi tên nó đều viết vào cùng một cuốn sổ. Cách sửa có hai lớp:</p>
<ul>
<li><strong>Trong workflow</strong> (đã làm, commit <code>54cc614</code>): lọc <code>&amp;ref=ch15-capstone</code>, và kiểm ảnh tồn tại bằng <code>docker buildx imagetools inspect</code> trước khi coi nó là "bản trước"; không tồn tại thì in <code>::warning</code> và coi như không có đích quay lui.</li>
<li><strong>Trong cấu hình</strong> (cần admin — CHAY-O-MAY ở trên): Deployment branches = chỉ nhánh chính. Một dòng cấu hình chặn cả loại lỗi này, vì job trên nhánh khác sẽ bị từ chối trước khi kịp ghi gì.</li>
</ul>
<p>Sau khi sửa, ba lần deploy liên tiếp cho thấy sổ được đọc đúng: lần đầu (${RUN(36075460464)}) <code>chua co lan deploy thanh cong nao tu ch15-capstone — lan dau, khong co dich quay lui</code>; lần hai (${RUN(36075733214)}) <code>PREV = sha-54cc614</code>; và lần sau cú deploy hỏng (${RUN(36076249655)}) <code>PREV = sha-39c37de</code> — bỏ qua đúng bản hỏng <code>4787c43</code> vì deployment của nó kết thúc <code>failure</code>.</p>

<h3>Deploy xanh, và smoke test kiểm cái gì</h3>
${slide('ga-15', 19, 'Deploy xanh: trao ảnh trong 1 giây, smoke test kiểm ĐÚNG phiên bản')}
<div class="out">[vps] dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-54cc614
[vps] keo: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
[vps] da trao: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-54cc614 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
curl: (56) Recv failure: Connection reset by peer
lan 1: chua tra loi (container: running restart=0 exit=0)
lan 2: {"ok":true,"phienBan":"1.1.0+39c37de04a4a8612cf63281a661a18a52bc3e67d","db":"ok"}
GET /api/lich -&gt; 200
GET / -&gt; 200
| Thoi gian tu luc deploy | 3 s |</div>
<p>Run ${RUN(36075733214)}, bản 1.1.0. Bước "Deploy qua SSH" mất một giây — ảnh đã được kéo sẵn một nửa vì dùng chung tầng với bản trước. Smoke test là phần đáng đọc:</p>
<ul>
<li><strong>Lần thử đầu luôn hỏng</strong> (<code>Connection reset by peer</code>): container đã chạy nhưng app còn đang chờ Postgres (<code>src/server.js</code> thử lại tới 10 lần). Vì thế smoke là một vòng lặp <em>có giới hạn</em> (15 lần × 2 giây), không phải một <code>sleep 30</code> cố định — nhanh khi app nhanh, và có trần khi app chết.</li>
<li><strong>Kiểm đúng phiên bản</strong>: <code>/healthz</code> trả <code>phienBan = &lt;version&gt;+&lt;SHA đầy đủ&gt;</code> (được truyền vào lúc dựng ảnh, Bài 15.2), và smoke so khớp nó với <code>&#36;{GITHUB_SHA}</code> của run. Nếu vì lý do gì đó container cũ vẫn trả lời — trao không thành, cổng trỏ nhầm — phép kiểm "có trả lời" sẽ xanh, phép kiểm phiên bản thì không.</li>
<li><strong>Kiểm đường dữ liệu</strong>: <code>GET /api/lich</code> 200 nghĩa là kết nối DB, bảng và truy vấn đều sống; <code>GET /</code> 200 nghĩa là trang tĩnh có trong ảnh. Smoke chỉ <strong>đọc</strong>: không ghi dữ liệu thử vào production.</li>
</ul>

<h3>Deploy hỏng: mọi thứ xanh, trừ thứ duy nhất quan trọng</h3>
${slide('ga-15', 20, 'Deploy hỏng: CI xanh, ảnh xanh, container chết — tự quay lui sau 34 giây')}
<p>Commit <code>4787c43</code> (bản 1.2.0) làm một việc tái cấu trúc rất bình thường: đổi tên <code>src/server.js</code> thành <code>src/index.js</code>, sửa <code>main</code> và <code>start</code> trong <code>package.json</code> — và quên dòng <code>CMD ["node", "src/server.js"]</code> trong Dockerfile. Hãy đếm xem bao nhiêu phép kiểm đã bỏ qua nó:</p>
<table>
<thead><tr><th>Phép kiểm</th><th>Kết quả ở run ${RUN(36075892650)}</th><th>Vì sao không bắt được</th></tr></thead>
<tbody>
<tr><td>lint, typecheck</td><td>xanh</td><td>không đọc Dockerfile</td></tr>
<tr><td>test (22), test (24)</td><td>xanh</td><td>test import <code>src/app.js</code>, không chạy lệnh khởi động</td></tr>
<tr><td>dựng ảnh 2 kiến trúc</td><td>xanh</td><td>Docker không kiểm tệp trong <code>CMD</code> có tồn tại</td></tr>
<tr><td>attestation, <code>gh attestation verify</code></td><td>xanh</td><td>chứng minh nguồn gốc, không chứng minh ảnh chạy được</td></tr>
<tr><td><strong>smoke test</strong></td><td><strong>đỏ</strong></td><td>—</td></tr>
</tbody>
</table>
<div class="out">curl: (56) Recv failure: Connection reset by peer
lan 1: chua tra loi (container: restarting restart=1 exit=1)
curl: (7) Failed to connect to localhost port 19153 after 0 ms: Couldn't connect to server
lan 2: chua tra loi (container: running restart=4 exit=0)
...
lan 15: chua tra loi (container: restarting restart=9 exit=1)
--- 5 dong log cuoi cua container ---
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}
Node.js v22.23.3
##[error]Process completed with exit code 1.
quay lui: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
[vps] dang chay: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43
[vps] da trao: ghcr.io/cuonghoang1103/ch15-phong-kham:sha-4787c43 -&gt; ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de
{"ok":true,"phienBan":"1.1.0+39c37de04a4a8612cf63281a661a18a52bc3e67d","db":"ok"}
quay lui XONG sau lan 2
| Smoke test | failure |
| Production dang chay | ghcr.io/cuonghoang1103/ch15-phong-kham:sha-39c37de |
| Thoi gian tu luc deploy | 34 s |</div>
<p>Đọc <code>restart=1 … restart=9</code>: <code>--restart unless-stopped</code> khiến Docker khởi động lại container liên tục, và giữa hai lần khởi động, trạng thái lúc thì <code>running</code> lúc thì <code>restarting</code> — nhìn một lần duy nhất bằng <code>docker ps</code> bạn có thể thấy "running" và tưởng mọi thứ ổn. Đó chính là hình dạng của sự cố 18/08/2026 ở api-backend: "build xanh, đẩy xanh, tráo xanh, rồi backend restart vô tận và API chết 502 bảy phút". Khác biệt duy nhất là ở đây có một vòng smoke test đứng chờ, và bước sau nó:</p>
<pre><code class="language-yaml">      - name: TU quay lui ve ban truoc
        if: failure() &amp;&amp; (steps.smoke.outcome == 'failure' || steps.theo-doi.outcome == 'failure') &amp;&amp; env.PREV != ''
        run: |
          echo "quay lui: $ANH -&gt; $PREV"
          printf '%s\\n' "$DB_PASSWORD" | ssh vps "read -r DB_PASSWORD &amp;&amp; export DB_PASSWORD &amp;&amp; /srv/phong-kham/trien-khai.sh '$PREV'"
          for i in $(seq 1 15); do
            curl -fsS --max-time 2 http://localhost:19153/healthz &amp;&amp; { echo; echo "quay lui XONG sau lan $i"; exit 0; }
            sleep 2
          done
          echo "::error::quay lui cung khong len — can nguoi vao xem"; exit 1</code></pre>
<ul>
<li><strong>Quay lui mất 2,7 giây</strong> (00:08:08,04 → 00:08:10,74): ảnh <code>sha-39c37de</code> đã có sẵn trên máy vì chính nó vừa chạy. So với ~40 giây "gắn tag ảnh mồ côi" bằng tay trong CLAUDE.md của api-backend, và với bảy phút của sự cố thật.</li>
<li><strong>Run vẫn ĐỎ.</strong> Production đã khoẻ lại, nhưng bản 1.2.0 không được deploy — đó là sự thật cần báo, và deployment của nó ghi <code>failure</code> để lần sau không ai coi nó là "bản trước".</li>
<li><strong>Quay lui cũng có thể hỏng</strong> — ví dụ khi bản mới đã chạy một migration xoá cột. Bước này có đường thoát riêng (<code>::error::quay lui cung khong len — can nguoi vao xem</code>), và Bài 9.3 giải thích vì sao schema phải đổi bằng hai migration để quay lui luôn an toàn.</li>
<li><strong>Log của container cũng cần được đọc cho tới.</strong> "5 dòng cuối" chỉ cho thấy đuôi stack trace (<code>MODULE_NOT_FOUND</code>); commit <code>9b26683</code> đổi bước ấy để in dòng <code>Error</code> đầu tiên — nơi có tên tệp bị thiếu.</li>
</ul>
<p>Commit <code>d161477</code> (1.2.1) sửa <code>CMD</code>; run ${RUN(36076249655)} xanh, và bước hỏi production chọn đúng <code>sha-39c37de</code> làm đích quay lui — bản 1.2.0 hỏng không bao giờ được coi là "bản trước".</p>

<h3>Khoá production: hai lần merge sát nhau</h3>
${slide('ga-15', 21, 'Hai push sát nhau: khoá CI theo ref hủy mất bản trước; khoá deploy thì xếp hàng')}
<p>Sự cố 06/07/2026 của api-backend — hai workflow deploy chạy chồng nhau, container bị giết <code>Exited(137)</code> và để lại container mồ côi — là lý do job <code>trien-khai</code> có:</p>
<pre><code class="language-yaml">    concurrency:
      group: ch15-production
      cancel-in-progress: false</code></pre>
<p>Docs mô tả luật: <em>"at most one running and one pending job in a concurrency group at any time"</em>; một job mới vào nhóm sẽ thay chỗ job đang chờ. Để thấy luật ấy vận hành, sân tập đẩy các commit sát nhau vào <code>ch15-capstone</code> — và lần thử đầu tiên tìm ra một lỗi trước cả khi tới được khoá deploy.</p>
<p><strong>Pha A — hai push cách nhau 6 giây, khoá CI vẫn theo <code>github.ref</code>.</strong> Commit <code>9b26683</code> lúc 00:12:45, <code>0fef5f5</code> lúc 00:12:51. Nhớ rằng CD gọi lại <code>ch15-ci.yml</code>, và khoá của CI là <code>ch15-ci-&#36;{{ github.event.pull_request.number || github.ref }}</code>. Trên push không có số PR, nên cả hai run CD dùng chung một nhóm CI:</p>
<div class="out">run 36076482487 (9b26683) — CANCELLED sau 29 giay
  ci / lint        Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / typecheck   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / test (22)   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ci / test (24)   Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  ch15 · CD        Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists
  anh 0s · trien-khai 0s
run 36076491163 (0fef5f5) — success</div>
<p>Commit <code>9b26683</code> <strong>không bao giờ được deploy</strong>. Với hai commit liên tiếp thì vô hại (bản sau chứa bản trước), nhưng hãy tưởng tượng bản trước là một bản vá bảo mật và bản sau đỏ CI: nhánh chính đã có bản vá, production thì không, và không có run nào báo đỏ cho bản vá ấy — nó chỉ "bị hủy". Khoá của CI chỉ có nghĩa cho PR; commit <code>acd5829</code> đổi nhóm thành <code>&#36;{{ github.event.pull_request.number || github.run_id }}</code>: trên PR vẫn khoá theo số PR, trên push mỗi run một nhóm riêng.</p>
<p><strong>Pha B — ba push cách nhau khoảng 15 giây, sau khi sửa.</strong> Commit <code>acd5829</code> cũng thêm bước "Theo doi sau deploy" giữ job deploy thêm 30 giây (kiểm <code>/healthz</code> mỗi 5 giây — một bài kiểm nhỏ cho lỗi chỉ lộ ra sau vài giây, và cho khoá có chỗ để xếp hàng):</p>
<div class="out">run 36076856479  acd5829  push 00:17:30   trien-khai: tao 00:18:57 · chay 00:19:01 → 00:19:55   success
run 36076881355  5c7b348  push 00:17:50   trien-khai: tao 00:19:02 · CHO (pending) ...
                                          00:19:48  Canceling since a higher priority waiting request for ch15-production exists
run 36076899299  c17030d  push 00:18:04   trien-khai: tao 00:19:47 · CHO → chay 00:19:58 → 00:21:00   success
                                          PREV = ghcr.io/cuonghoang1103/ch15-phong-kham:sha-acd5829</div>
<ul>
<li><strong>Không deploy nào bị giết giữa chừng.</strong> Job của <code>c17030d</code> được tạo lúc 00:19:47, khi deploy của <code>acd5829</code> đang chạy; nó chờ, và chỉ bắt đầu lúc 00:19:58 — ba giây sau khi deploy trước xong (00:19:55). Đó là toàn bộ ý nghĩa của <code>cancel-in-progress: false</code>.</li>
<li><strong>Bản ở giữa bị bỏ qua, và đó là hành vi đúng.</strong> Deploy của <code>5c7b348</code> chờ 46 giây, rồi bị thay bởi bản mới hơn: "tối đa một đang chạy, một đang chờ". Không ai cần production đi qua <code>5c7b348</code> khi <code>c17030d</code> đã chứa nó. Run của nó hiện màu xám "cancelled", CI và ảnh của nó vẫn xanh.</li>
<li><strong>Sổ deploy vẫn đúng.</strong> Bản <code>c17030d</code> hỏi production và nhận <code>sha-acd5829</code> làm đích quay lui — không phải <code>5c7b348</code>, vì bản ấy chưa bao giờ được deploy.</li>
<li><strong>Hai khoá, hai mục đích.</strong> Khoá CI: chỉ để tiết kiệm runner trên PR, theo số PR. Khoá deploy: để hai lần tráo không bao giờ chồng nhau, theo tên environment, và không bao giờ hủy thứ đang chạy.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — dùng lại mẫu "hủy run cũ" cho deploy.</strong> <code>cancel-in-progress: true</code> ở job deploy nghĩa là một push mới có thể giết cuộc deploy đang trao container dở — đúng hình dạng của <code>Exited(137)</code> ngày 06/07. Và <code>deploy-ghcr.yml</code> của api-backend vẫn còn dòng ấy, chỉ an toàn vì workflow đó giờ chỉ chạy bằng tay.</div>

<h3>So với cách repo thật đang deploy</h3>
${slide('ga-15', 22, 'So với repo thật: deploy-nha.sh đã có khoá, thiếu quay lui tự động')}
<p>api-backend không deploy bằng Actions: <code>deploy-nha.sh</code> dựng ảnh trên máy nhà 12 nhân, đẩy GHCR, rồi SSH vào VPS để trao. Đặt hai cách cạnh nhau, công bằng:</p>
<table>
<thead><tr><th></th><th><code>deploy-nha.sh</code> (09/2026)</th><th><code>ch15-cd.yml</code></th></tr></thead>
<tbody>
<tr><td>Ai bấm</td><td>người chạy từ máy nhà</td><td>merge vào nhánh chính</td></tr>
<tr><td>Kiểm trước khi tráo</td><td>tsc, eval, <code>npm test</code> chạy <em>sau</em> khi đã tráo; chỉ quyết định có push lên GitHub hay không</td><td>CI chạy lại <em>trước</em> khi dựng ảnh (<code>needs: ci</code>)</td></tr>
<tr><td>Dựng ảnh</td><td>máy nhà, song song, nhanh ~3 lần VPS</td><td>runner GitHub, 2 kiến trúc, cache gha</td></tr>
<tr><td>Khoá</td><td><code>flock -n /var/lock/cuongthai-deploy.lock</code> trên VPS: phiên thứ hai bị <strong>từ chối</strong></td><td><code>concurrency</code>: phiên thứ hai <strong>xếp hàng</strong>, phiên thứ ba thay chỗ</td></tr>
<tr><td>Biết production chạy gì</td><td>đọc SHA từ ảnh đang chạy; <strong>chặn deploy làm lùi mã</strong> nếu bản mới không chứa bản đang chạy</td><td>Deployments API: bản <code>success</code> mới nhất của nhánh chính</td></tr>
<tr><td>Smoke test</td><td>có — route trả 404 là ảnh cũ/hỏng</td><td>có — phiên bản, <code>/api</code>, trang tĩnh</td></tr>
<tr><td>Quay lui</td><td>tay: <code>--cho-lui</code>, hoặc gắn tag ảnh mồ côi (~40 giây)</td><td>tự động khi smoke hỏng (2,7 giây)</td></tr>
<tr><td>Dấu vết</td><td>log trên terminal của người chạy</td><td>deployment + status trên GitHub, đọc lại được bằng API</td></tr>
</tbody>
</table>
<p>Script của repo không phải là "cách sai": nó là kết quả của ba sự cố thật, và nó đã có hai thứ khó nhất — khoá, và chốt chống lùi mà <code>ch15-cd.yml</code> không có. Thứ chương này mang lại để chép sang: <strong>kiểm trước khi tráo</strong> (hiện tại <code>npm test</code> đỏ thì production vẫn đang chạy ảnh vừa tráo) và <strong>quay lui tự động</strong> khi smoke hỏng.</p>

<h3>Chạy thử từng bước: deploy có khoá và quay lui</h3>
<ol>
<li>Tạo environment <code>production</code> (Settings, hoặc Deployments API); bật Deployment branches = <code>main</code> và một người duyệt nếu bạn là admin.</li>
<li>Thêm job <code>deploy</code> với <code>needs: anh</code>, <code>environment: production</code>, <code>concurrency: { group: production, cancel-in-progress: false }</code>, quyền <code>packages: read</code> + <code>deployments: read</code>.</li>
<li>Bước đầu: hỏi <code>deployments?environment=production&amp;ref=main</code>, lấy SHA của bản <code>success</code> mới nhất, kiểm ảnh <code>sha-…</code> tồn tại.</li>
<li>Deploy qua SSH (khoá từ secret, <code>known_hosts</code> ghim sẵn, user không root); smoke test vòng lặp có giới hạn, so khớp phiên bản.</li>
<li>Bước quay lui <code>if: failure() &amp;&amp; steps.smoke.outcome == 'failure'</code>.</li>
<li>Cố ý đẩy một bản có <code>CMD</code> sai; xác nhận run đỏ, production vẫn trả phiên bản cũ.</li>
<li>Push ba commit cách nhau 15 giây; tìm dòng <code>Canceling since a higher priority waiting request for production</code> trên run ở giữa.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Deploy của bạn quay lui thế nào? Bạn biết "bản trước" là bản nào bằng cách nào?</strong><br>Đ: Bản trước là bản production đang chạy, không phải commit cha — tôi hỏi lịch sử deployment của environment (lọc theo nhánh chính, lấy bản success mới nhất), kiểm ảnh tag SHA còn tồn tại, và bước quay lui trao lại đúng ảnh đó khi smoke test hỏng. Đo được: phát hiện sau 30 giây, quay lui 2,7 giây.</p>
<p><strong>H: Build xanh, test xanh, vẫn sập production. Chuyện gì có thể xảy ra?</strong><br>Đ: Lệnh khởi động sai (CMD trỏ tệp không tồn tại), biến môi trường chỉ có ở production, ảnh nền khác libc với dependency native, migration... CI không chạy ảnh như production chạy. Vì thế cần smoke test sau deploy, kiểm cả phiên bản trả về, không chỉ "có trả lời".</p>
<p><strong>H: Hai người merge gần như cùng lúc. Pipeline của bạn làm gì?</strong><br>Đ: Deploy có <code>concurrency</code> riêng với <code>cancel-in-progress: false</code>: một chạy, một chờ, bản chờ bị thay nếu có bản mới hơn — không bao giờ giết deploy đang chạy. Và khoá của CI không được làm hủy CI của bản trước trên nhánh chính (tôi đã gặp đúng lỗi đó).</p>
<p><strong>H: Làm sao SSH từ CI vào server an toàn?</strong><br>Đ: Khoá riêng cho CI trong secret của environment (chỉ job deploy thấy, sau khi được duyệt), <code>known_hosts</code> ghim sẵn thay vì tắt kiểm, user không root chỉ đủ quyền deploy, sshd tắt mật khẩu; tốt hơn nữa là không cần SSH — server tự kéo ảnh, hoặc OIDC tới cloud.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> repo của bạn đã dựng được ảnh trong CI (Bài 15.2). Thêm bước deploy mô phỏng có khoá và quay lui — không cần VPS thật.</p><ol>
<li>Chép <code>ch15/deploy/</code> của sân tập vào kho của bạn (Dockerfile + <code>vao.sh</code> + <code>trien-khai.sh</code>), đổi tên ảnh và cổng.</li>
<li>Thêm job <code>deploy</code> như mục "Chạy thử từng bước", dùng một environment của kho bạn.</li>
<li>Push một bản tốt, rồi một bản có <code>CMD</code> sai, rồi bản sửa.</li>
<li>Gọi <code>gh api "repos/&lt;owner&gt;/&lt;repo&gt;/deployments?environment=&lt;tên&gt;" --jq '.[] | [.id, .sha[0:7], .ref] | @tsv'</code> và đối chiếu với trạng thái từng run.</li>
</ol><p><strong>Đạt khi:</strong> run của bản <code>CMD</code> sai đỏ, bản tóm tắt của nó ghi "Production dang chay" là ảnh của bản tốt; run của bản sửa in <code>production dang chay: …sha-&lt;bản tốt&gt;</code> ở bước hỏi production (không phải SHA của bản hỏng); và API liệt kê đủ ba deployment.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">environment</span><span class="v">đích deploy có tên, mang luật bảo vệ (người duyệt, nhánh, secret riêng) và lịch sử deployment</span></div>
<div class="kv"><span class="k">deployment / deployment status</span><span class="v">bản ghi GitHub tạo cho mỗi job có <code>environment:</code>, với trạng thái cuối <code>success</code>/<code>failure</code></span></div>
<div class="kv"><span class="k">smoke test</span><span class="v">vài phép kiểm nhanh, chỉ đọc, ngay sau deploy — "app có sống và đúng bản không"</span></div>
<div class="kv"><span class="k">rollback (quay lui)</span><span class="v">trao lại ảnh của bản production thành công gần nhất</span></div>
<div class="kv"><span class="k"><code>known_hosts</code></span><span class="v">danh sách khoá máy chủ SSH đã biết — ghim sẵn để không kết nối nhầm máy</span></div>
<div class="kv"><span class="k"><code>cancel-in-progress: false</code></span><span class="v">khoá xếp hàng: không giết job đang chạy; job chờ mới thay job chờ cũ</span></div>
<div class="kv"><span class="k">mô phỏng (simulation)</span><span class="v">đích deploy là container trong chính job; mọi cơ chế thật trừ việc máy chủ tồn tại lâu dài</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy mô phỏng: SSH (khoá, <code>known_hosts</code> ghim, user không root) vào một container sshd trong job, kéo ảnh <code>sha-</code> từ GHCR, trao container, smoke test qua HTTP.</li>
<li>Environment chưa tồn tại làm job đỏ "environment not found"; tạo trước (Settings hoặc Deployments API), và bật giới hạn nhánh + người duyệt khi có quyền admin.</li>
<li>"Bản trước" = deployment <code>success</code> mới nhất <em>của nhánh chính</em>, ảnh còn tồn tại — không lọc nhánh thì một job thử có thể ghi bẩn lịch sử production.</li>
<li>Ảnh có <code>CMD</code> sai qua mọi phép kiểm của CI và cả chữ ký; chỉ smoke test bắt được, và quay lui tự động đưa production về bản trước trong 2,7 giây.</li>
<li><code>concurrency</code> deploy với <code>cancel-in-progress: false</code>: một chạy, một chờ, bản chờ bị thay; khoá CI trên push phải theo <code>run_id</code>, nếu không nó hủy CI của bản trước.</li>
<li>So với <code>deploy-nha.sh</code>: repo đã có khoá và chốt chống lùi; thứ nên thêm là kiểm trước khi tráo và quay lui tự động.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deployments and environments</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — người duyệt (tới 6), nhánh được deploy, secret theo environment, điều kiện theo gói.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments — câu "tham chiếu environment chưa có sẽ tạo nó" mà sân tập đo được là không đúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Concurrency</span><span class="lc-sub">docs.github.com/en/actions/concepts/workflows-and-actions/concurrency — một đang chạy, một đang chờ; job chờ mới thay job chờ cũ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Deployments</span><span class="lc-sub">docs.github.com/en/rest/deployments/deployments — liệt kê theo <code>environment</code>, <code>ref</code>, <code>sha</code>; trạng thái của từng deployment.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — ch15/deploy và ch15-cd.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-capstone/ch15/deploy — VPS giả, <code>trien-khai.sh</code>; các run được dẫn trong bài.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🖥</span><span class="lc-body"><span class="lc-title">Deploy lên VPS — SSH, khoá, người dùng deploy</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — phiên bản với máy chủ thật của những gì bài này mô phỏng.</span></span></div>
</div>
`,
    },
    {
      title: '15.4 — Running the pipeline: red CI, flaky tests, cost, clean-up, interview questions|||15.4 — Vận hành pipeline: CI đỏ, test chập chờn, chi phí, dọn dẹp, câu hỏi phỏng vấn',
      slug: 'ga-15-4-van-hanh-pipeline',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đọc CI đỏ theo bốn lớp, đo test chập chờn 20/40 rồi 0/40, phút tính tiền theo job, dọn cache và artifact đúng khoá, huy hiệu, checklist 12 dòng sẵn sàng production và 10 câu phỏng vấn CI/CD kèm ý trả lời.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Running the pipeline: read red CI, catch flaky tests, pay the right bill, clean the right things — and answer the interviewer</h2>
<p class="lead">Building a pipeline takes an afternoon. Keeping it healthy takes the rest of the project&#39;s life. The last teaching lesson is about ordinary days: red CI at 11 p.m., a test that fails half the time, a minutes bill that creeps up, a full cache allowance — and the list of things an interviewer will ask to find out whether you have actually run a pipeline or only written YAML.</p>

<p>The lesson&#39;s data comes from two places: the runs of <code>ch15-ci.yml</code>/<code>ch15-cd.yml</code> in the three previous lessons, and a separate workflow <code>ch15-van-hanh.yml</code> on branch <code>ch15-van-hanh</code> with three jobs — <code>chap-chon</code> measuring a flaky test, <code>don-dep</code> measuring caches and artifacts, <code>thong-bao</code> summarising — in run ${RUN(36074955148)}.</p>

<h3>Red CI: read from the outside in</h3>
${slide('ga-15', 23, 'Red CI: read from the outside in, four layers, stop at the first one that answers')}
<p>Beginners open the longest log and scroll. Experienced people read four layers in order and usually stop before the fourth. Take PR #10&#39;s red run, ${RUN(36075106581)}:</p>
<table>
<thead><tr><th>Layer</th><th>Where</th><th>What this run says</th><th>What it rules out</th></tr></thead>
<tbody>
<tr><td>1 · Annotation</td><td>run summary page (or <code>gh run view &lt;id&gt;</code>)</td><td><code>CI chua xanh: co job ket thuc voi 'failure' (lint typecheck test = success success failure)</code></td><td>the failure is in <code>test</code>, not lint/typecheck</td></tr>
<tr><td>2 · Which job</td><td>job graph</td><td><code>test (22)</code> ✗ and <code>test (24)</code> ✗</td><td>both versions ⇒ not a Node-version bug</td></tr>
<tr><td>3 · Which step</td><td>the job&#39;s step list</td><td>"Run npm test" red; "Initialize containers" green</td><td>not infrastructure, not the DB failing to start</td></tr>
<tr><td>4 · Which line</td><td>step log (<code>gh run view --log-failed</code>)</td><td><code>actual: soLich: '1'</code> / <code>expected: soLich: 1</code></td><td>a type changed — look for the commit that touched the query</td></tr>
</tbody>
</table>
<p>The first three layers take under a minute and narrow "CI is red" down to "one assertion about a type, on every version". Some quick signatures you have met in this chapter:</p>
<ul>
<li><strong>No log at all</strong> — "environment not found" (run ${RUN(36074781609)}), <code>startup_failure</code>, a YAML syntax error (Lesson 12.4): the answer is in the <em>run</em>-level annotation, not in a job. The job-log API returns 404 for those jobs.</li>
<li><strong>Red at "Initialize containers" or "Set up job"</strong>: pulling images, service health checks, downloading actions — infrastructure. A re-run is reasonable, but record that you re-ran.</li>
<li><strong>A puzzling integration-test failure</strong>: scroll to the <code>Print service container logs</code> block at the end of the job — Postgres has often already said why.</li>
<li><strong>Cancelled</strong>: look for <code>Canceling since a higher priority waiting request for …</code> — the group name in that line tells you which lock cancelled it (Lessons 15.1, 15.3).</li>
</ul>
<div class="callout"><p><strong>Use whatever this machine has.</strong> On your Mac: <code>gh run list --workflow ch15-cd.yml</code>, <code>gh run view &lt;id&gt;</code> (annotations + jobs), <code>gh run view &lt;id&gt; --log-failed</code> (only the red step&#39;s log). The session that built this lesson had no <code>gh</code>; it read the same things through the API (job list, job logs, the run page) — the same four layers, different tools.</p></div>

<h3>Flaky tests: measure the rate, do not tell stories</h3>
${slide('ga-15', 24, 'A flaky test, measured: red 20/40 times, fix one await and it is 0/40')}
<p>"This test sometimes fails" is a story. "This test is red 20 times out of 40" is a number, and numbers can be fixed. Branch <code>ch15-van-hanh</code> has a function that sends a booking reminder in 20–80 ms (a simulated network call) and two versions of its test:</p>
<pre><code class="language-javascript">// nhac-lich-chap-chon.test.js — the FLAKY version
test('nhac lich duoc gui (ban chap chon)', async () =&gt; {
  const tt = { daGui: false };
  guiNhacLich(tt);                                  // forgot await
  await new Promise((r) =&gt; setTimeout(r, 50));      // "50 ms is surely enough"
  assert.equal(tt.daGui, true);
});

// nhac-lich-da-sua.test.js — the FIXED version
test('nhac lich duoc gui (ban da sua)', async () =&gt; {
  const tt = { daGui: false };
  await guiNhacLich(tt);
  assert.equal(tt.daGui, true);
});</code></pre>
<p>The <code>chap-chon</code> job runs each version 40 times in a shell loop and counts:</p>
<div class="out">chap-chon: 20/40 lan DO          (23:53:33 → 23:53:39, 6 seconds)
da-sua: 0/40 lan DO              (23:53:39 → 23:53:45)
do o lan thu 1:
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    actual: false,
    expected: true,
##[error]Process completed with exit code 1.</div>
<p>On the authoring machine the same file was red 11/20 times. Both numbers sit around 50% — as designed: 50 ms is the middle of the 20–80 ms range. In real projects the rate is usually much smaller (2%, 0.5%), and being small is exactly why it survives: rare enough that everyone clicks Re-run, frequent enough to turn a few PRs red every week.</p>
<table>
<thead><tr><th>Common cause</th><th>Signature</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>Waiting on time instead of on an event</td><td><code>setTimeout</code>/<code>sleep</code> in a test</td><td><code>await</code> the right promise; bounded polling (like the smoke test in 15.3)</td></tr>
<tr><td>Test order dependence</td><td>green alone, red in the full suite</td><td>each test resets its data (<code>TRUNCATE</code> in <code>before</code>, as in <code>api.test.js</code>)</td></tr>
<tr><td>The real clock</td><td>red around midnight, at month end</td><td>pass the time in; here <code>kiemLich</code> uses the data&#39;s UTC time, not <code>Date.now()</code></td></tr>
<tr><td>Shared resources</td><td>red when matrix entries run in parallel</td><td>one service container per job — why 15.1 does not share a DB</td></tr>
</tbody>
</table>
<p>The procedure: <strong>measure</strong> (an N-times loop, like the job above) → <strong>quarantine</strong> (<code>test.skip</code> with an issue link, never delete) → <strong>fix</strong> → <strong>measure again</strong> down to 0/N. The quarantine step matters more than it looks: a flaky test left inside a required check teaches the whole team that "red means re-run", and that habit will swallow the next real failure.</p>
<div class="pitfall co-tieu-de"><strong>Trap — turning on automatic test retries.</strong> Retries turn 50% red into 25%, then 12.5% — the dashboard looks greener while the bug stays exactly where it was, only harder to see. Retry only what is outside your control (image downloads, the network to a registry), and always print how many retries happened.</div>

<h3>Cost: minutes, and the time of whoever is waiting</h3>
${slide('ga-15', 25, 'Cost: a public repository bills 0 minutes — a private one counts per job')}
<p>The <code>…/runs/&lt;id&gt;/timing</code> API for CD run ${RUN(36075733214)} (version 1.1.0, green):</p>
<div class="out">billable: UBUNTU total_ms: 0 · jobs: 8
run_duration_ms: 106000</div>
<p>Not a minute billed: GitHub&#39;s standard runners are <strong>free and unlimited for public repositories</strong> (docs, as of 09/2026). Private repositories get a plan-dependent free quota and pay for the excess — and what gets counted is <em>each job&#39;s</em> time, not the run&#39;s. The docs are explicit: each job&#39;s billable minutes are <em>rounded up to the next minute</em>. The run above had 8 jobs in 106 seconds; in a private repository it would be billed at least 8 minutes, because every 3–50-second job becomes a minute (check your plan&#39;s quota on your account&#39;s billing page). In practice:</p>
<ul>
<li><strong>Small jobs cost more than they look.</strong> <code>tong-hop-ngay-tho</code> and <code>ci-ok</code> run 3–4 seconds each but are two jobs. A real repository keeps <code>ci-ok</code> and drops the naive job (it is only here to teach).</li>
<li><strong>Splitting jobs has a price.</strong> Three parallel CI jobs give better information (Lesson 15.1) and finish sooner on the wall clock, but pay three times for "Set up job" + checkout + <code>npm ci</code>. For a small private repository, merging lint + typecheck into one job is reasonable.</li>
<li><strong>Runner queue time is a cost too</strong> — for the person waiting on a green PR. In run ${RUN(36074887634)}, <code>test (24)</code> was created at 23:52:55 and only started at 23:53:35: 40 seconds queued, twice its run time. Nobody is billed for the wait, but the reviewer waits.</li>
<li><strong><code>timeout-minutes</code> is a cost ceiling.</strong> The default is 360 minutes. A hung test in a private repository can burn six runner-hours per push.</li>
</ul>
<p>To cut wall-clock time, optimise the jobs on the <strong>critical path</strong> (the longest <code>needs</code> chain): in this CD that is <code>ci / test (24)</code> → <code>anh</code> → <code>trien-khai</code>. Making <code>lint</code> twice as fast does not make the run a second faster.</p>

<h3>Clean-up: caches and artifacts have limits</h3>
${slide('ga-15', 26, 'Clean-up: caches and artifacts have limits — delete exactly what is yours')}
<pre><code class="language-yaml">  don-dep:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      actions: write     # deleting caches / artifacts needs this
    env:
      GH_TOKEN: &#36;{{ github.token }}
      R: &#36;{{ github.repository }}
    steps:
      # ... create cache "ch15-rac-&lt;run_id&gt;" (2 MB) and artifact "ch15-bao-cao" (retention-days: 1) ...
      - name: Kho dang giu bao nhieu cache
        run: |
          gh api "repos/$R/actions/cache/usage" --jq '"tong: \\(.active_caches_count) cache, \\(.active_caches_size_in_bytes) byte"'
          gh cache list --repo "$R" --limit 100 --json key,sizeInBytes,lastAccessedAt --jq '...'
      - name: Xoa DUNG cache rac cua run nay
        run: gh cache delete "ch15-rac-&#36;{GITHUB_RUN_ID}" --repo "$R"</code></pre>
<div class="out">tong: 5 cache, 560614647 byte
--- cache cua chuong 15 ---
2001209    2026-09-24T23:53:33Z  ch15-rac-36074955148
10701      2026-09-24T23:53:09Z  index-ch15-phong-kham-1-5c45fc59#1
55585204   2026-09-24T23:53:09Z  buildkit-blob-1-sha256:f7f2d304681aaa935c9cfd180850cf616ae843efce7682873d6521ded7268937
8284393    2026-09-24T23:53:07Z  node-cache-Linux-x64-npm-682e28bd0c1efaa943c41aefb1157e457d9a5511c3be6d00e7597ca6bda30fd0
55602437   2026-09-24T23:53:05Z  buildkit-blob-1-sha256:87919ed734a39bc185155d715bdcf2ce6c52d112ff642650d9e0e35502b481e9
...
con lai 0 cache ch15-rac-*
ch15-bao-cao    162 byte    het han 2026-09-25T23:53:33Z</div>
<ul>
<li><strong>The aggregate API lags.</strong> <code>cache/usage</code> reported "5 caches, 560 MB" while the list held more than 15 entries from this chapter alone. The total is computed periodically; when deciding what to delete, trust the list.</li>
<li><strong>Delete by your own exact key.</strong> The sandbox is a repository shared by many chapters; <code>gh cache delete --all</code> would make everyone else&#39;s CI cold. This job deletes exactly <code>ch15-rac-36074955148</code> and prints "0 left" to prove it.</li>
<li><strong>Image caches fill up fast.</strong> The two 55 MB blobs are the <code>node:22-alpine</code> layer for two architectures — seven times the whole npm cache. With a 10 GB per-repository allowance (09/2026), a repository with several images evicts old cache entries quickly.</li>
<li><strong><code>retention-days</code></strong>: the temporary artifact is set to 1 day, and the API records an expiry exactly 24 hours after upload. By default artifacts and logs are kept 90 days; public repositories can set 1–90 days. The 09/2026 docs announce that from 1 October 2026 the same retention also applies to runs, checks and commit statuses.</li>
<li><strong>build-push-action uploads an artifact on its own</strong>, <code>…dockerbuild</code> (80–93 KB) per build — the "build record" behind its summary. It follows the same retention as any artifact.</li>
</ul>

<h3>Notifications and badges</h3>
<p>The <code>thong-bao</code> job (<code>needs: [chap-chon, don-dep]</code>, <code>if: always()</code>) does three things whose reasons Lesson 9.5 explained: a <code>::notice</code> annotation on the run page ("ket qua cac job: success success"), a markdown summary with a badge, and a "notification" line only when a job is red. The badge is a fixed URL the docs describe:</p>
<div class="out">https://github.com/cuonghoang1103/ga-san-tap/actions/workflows/ch15-cd.yml/badge.svg?branch=ch15-capstone</div>
<p>Add <code>?branch=</code> so the badge reflects only the main branch (a red PR should not turn the README red), and <code>&amp;event=push</code> if the workflow has several triggers. A badge is not decoration: on the README of a portfolio project it is one-click evidence that the pipeline is real and running.</p>

<h3>The "production-ready pipeline" checklist</h3>
${slide('ga-15', 27, 'A “production-ready pipeline” checklist — 12 lines, each one checkable')}
<table>
<thead><tr><th>#</th><th>Condition</th><th>Check it with</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>1</td><td>Every job has <code>timeout-minutes</code></td><td><code>grep -L timeout-minutes .github/workflows/*.yml</code> prints nothing</td><td>10</td></tr>
<tr><td>2</td><td>Minimal <code>permissions</code>, declared per job</td><td>the "GITHUB_TOKEN Permissions" block in Set up job</td><td>6, 15.2</td></tr>
<tr><td>3</td><td>Actions pinned by SHA + Dependabot <code>github-actions</code></td><td>no <code>uses: …@v</code> left</td><td>12, 14</td></tr>
<tr><td>4</td><td>One required aggregate check</td><td>a red PR cannot be merged</td><td>14, 15.1</td></tr>
<tr><td>5</td><td>Integration tests against real services</td><td><code>services:</code> + health check</td><td>13, 15.1</td></tr>
<tr><td>6</td><td>Image built once, SHA-tagged, signed</td><td><code>gh attestation verify</code></td><td>14, 15.2</td></tr>
<tr><td>7</td><td>Deploys locked, never cancelled halfway</td><td><code>cancel-in-progress: false</code> on the deploy job</td><td>9, 15.3</td></tr>
<tr><td>8</td><td>Smoke test checks the exact version</td><td><code>/healthz</code> returns the SHA</td><td>15.3</td></tr>
<tr><td>9</td><td>Automatic rollback, rehearsed</td><td>there is a red run where production stayed green</td><td>9, 15.3</td></tr>
<tr><td>10</td><td>Environment restricted by branch + reviewers</td><td>Settings → Environments</td><td>9, 15.3</td></tr>
<tr><td>11</td><td>No real secrets in logs or code</td><td>push protection on; logs show only <code>***</code></td><td>6, 14</td></tr>
<tr><td>12</td><td>Someone is told when it is red</td><td>summary + chat channel; test with a deliberately red run</td><td>9</td></tr>
</tbody>
</table>
<p>Scoring api-backend itself against this checklist is a good exercise: <code>ci-lint.yml</code> passes line 1; every workflow fails line 3 (Lesson 12.4 counted 24 <code>uses:</code>, 0 pinned by SHA); line 7 passes thanks to the <code>flock</code> in <code>deploy-nha.sh</code>; line 9 is still a manual procedure.</p>

<h3>10 common CI/CD interview questions — and how to answer</h3>
<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>1. How do CI and CD differ? Continuous Delivery versus Continuous Deployment?</strong><br>A: CI = every change is integrated and checked automatically. Delivery = every green commit is <em>ready</em> to deploy and a human presses the button; Deployment = it deploys automatically with nobody pressing. This project is gated Deployment (smoke + rollback); api-backend is Delivery (a person runs a script).</p>
<p><strong>2. What does your pipeline consist of?</strong><br>A: PR → lint/typecheck/test against a real Postgres → required aggregate check → merge → CI re-run on the merge commit → image built once (2 architectures, SHA tag, attestation) → deploy into a locked environment → smoke test → automatic rollback. Give one measured number for each step.</p>
<p><strong>3. How do you make sure what runs in production is exactly what was tested?</strong><br>A: Build the image once after CI, deploy by SHA tag/digest, have the smoke test read the SHA back from <code>/healthz</code>, and use an attestation to prove which workflow built the image.</p>
<p><strong>4. A deploy breaks at 2 a.m. What does your pipeline do?</strong><br>A: The smoke test goes red → the rollback step puts back the image of the last successful deployment (asked from the Deployments API, not guessed) → the job goes red and notifies. In this project: detected after 30 seconds, rolled back in 2.7 seconds.</p>
<p><strong>5. What if two people merge at the same time?</strong><br>A: <code>concurrency</code> on the deploy job with <code>cancel-in-progress: false</code>: one runs, one waits, and the waiting one is replaced if a newer one arrives. And the CI lock on the main branch must not cancel the CI of the previous version (an incident measured in 15.3).</p>
<p><strong>6. How do you handle secrets?</strong><br>A: Environment secrets (only the deploy job sees them, after approval), a minimally-scoped <code>GITHUB_TOKEN</code> instead of PATs, OIDC instead of long-lived cloud keys, and never interpolating <code>&#36;{{ secrets.X }}</code> straight into <code>run:</code> — pass it through <code>env:</code> + <code>"$VAR"</code>.</p>
<p><strong>7. Are third-party actions safe?</strong><br>A: Pin full SHAs + Dependabot for reviewed updates; minimal permissions so a compromised action can do little; mention the tj-actions/changed-files case of 03/2025 (tags moved to malicious code).</p>
<p><strong>8. CI is slow. Where do you start?</strong><br>A: Measure first: which jobs are on the critical path, how long the runner queue is. Only then caching (measured: for a small app the cache was slower), parallelism, <code>paths</code>, and the <code>COPY</code> order in the Dockerfile.</p>
<p><strong>9. What do you do with flaky tests?</strong><br>A: Measure the rate over N runs, quarantine with an issue, fix the cause (usually waiting on time), measure again to 0/N. No automatic retries to hide it.</p>
<p><strong>10. When should you NOT deploy with GitHub Actions?</strong><br>A: When the build needs hardware the runners lack (api-backend&#39;s 12-core home machine builds ~3× faster than the VPS), when the network to the target is blocked, or when the team must deploy uncommitted work. Answer with trade-offs, not slogans — api-backend is a real example.</p>
</div>

<h3>Step by step: a pipeline "health check-up"</h3>
<ol>
<li>Pick your repository&#39;s latest red run; read all four layers and write a one-sentence conclusion before opening the long log.</li>
<li>Pick a test you suspect is flaky; write a 40-times loop like the <code>chap-chon</code> job and record the rate.</li>
<li>Call <code>gh api repos/&lt;owner&gt;/&lt;repo&gt;/actions/runs/&lt;id&gt;/timing</code> for a long run; find the jobs on the critical path.</li>
<li><code>gh cache list --limit 100</code>; find the largest entry and the one not read for the longest time.</li>
<li>Add the deploy workflow&#39;s badge (with <code>?branch=main</code>) to the README.</li>
<li>Score the repository against the 12-line checklist; open an issue for each failing line.</li>
</ol>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are about to put your repository link on your CV. Make its pipeline survive an interview.</p><ol>
<li>Score the repository against the 12-line checklist; fix at least two failing lines (easiest: <code>timeout-minutes</code> and <code>permissions</code>).</li>
<li>Add a manually-triggered (<code>workflow_dispatch</code>) flakiness job for your test suite: run each test file 20 times and print the red count.</li>
<li>Add a CI/CD badge to the README with <code>?branch=main</code>.</li>
<li>Write down your answers to questions 2 and 4 above, using measurements from your own repository.</li>
</ol><p><strong>Done when:</strong> <code>grep -L timeout-minutes .github/workflows/*.yml</code> prints no file; the flakiness job prints "N/20" for each file; the badge shows the real status on the README; and every answer contains at least one number taken from your own runs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">annotation</span><span class="v">a message attached to a run/job (<code>::error</code>, <code>::warning</code>, <code>::notice</code>) — the first layer to read when CI is red</span></div>
<div class="kv"><span class="k">flaky test</span><span class="v">a test giving different results on the same code; measured as a red rate over N runs</span></div>
<div class="kv"><span class="k">quarantine</span><span class="v">temporarily removing a flaky test from the required check, tracked by an issue, not deleted</span></div>
<div class="kv"><span class="k">critical path</span><span class="v">the longest <code>needs</code> chain — the only thing that decides a run&#39;s duration</span></div>
<div class="kv"><span class="k">billable minutes</span><span class="v">runner minutes charged to private repositories, each job rounded up; standard runners are free for public ones</span></div>
<div class="kv"><span class="k">retention</span><span class="v">days an artifact/log is kept; <code>retention-days</code> shortens it</span></div>
<div class="kv"><span class="k">status badge</span><span class="v">an SVG of a workflow&#39;s status: <code>…/actions/workflows/&lt;file&gt;/badge.svg</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Red CI: annotation → job → step → line; the first three layers are usually enough, and "no log" means read the run-level annotation.</li>
<li>A flaky test is a rate: measured 20/40 → fix one <code>await</code> → 0/40. Do not hide it with retries.</li>
<li>Public repositories: 0 billable minutes; private: paid per job, rounded up — small jobs, hung jobs and queue time are all costs.</li>
<li>Image caches fill the allowance fast; the aggregate API lags; delete your own exact keys with <code>actions: write</code>.</li>
<li>A badge with <code>?branch=</code>, notifications only when red, a summary on the run page.</li>
<li>The 12-line checklist + 10 interview questions: every answer carries a number from a real run.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Adding a workflow status badge</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/add-a-status-badge — the <code>badge.svg</code> URL, <code>branch</code> and <code>event</code> parameters.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — the 10 GB limit, eviction after 7 days unused, managing caches.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow artifacts / retention</span><span class="lc-sub">docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts — 90 days by default; the change from 1 October 2026.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing job execution time</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/view-job-execution-time — per-job billable time, rounded up to the next minute; no billable minutes for public repositories.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch15-van-hanh</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-van-hanh — <code>ch15-van-hanh.yml</code> and the two reminder test files; run 36074955148.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — loops, counting, exit codes</span><span class="lc-sub">/courses/linux-bash/learn${REF} — what sits behind the flakiness and clean-up jobs.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Vận hành pipeline: đọc CI đỏ, bắt test chập chờn, trả đúng chi phí, dọn đúng thứ — và trả lời người phỏng vấn</h2>
<p class="lead">Dựng pipeline mất một buổi chiều. Giữ nó khoẻ thì mất phần còn lại của đời dự án. Bài cuối của phần dạy là về những ngày thường: CI đỏ lúc 11 giờ đêm, một test hỏng một nửa số lần, hoá đơn phút tăng dần, hạn mức cache đầy — và danh sách những gì người phỏng vấn sẽ hỏi để biết bạn đã thật sự vận hành một pipeline hay chỉ viết YAML.</p>

<p>Dữ liệu của bài đến từ hai nơi: các run của <code>ch15-ci.yml</code>/<code>ch15-cd.yml</code> ở ba bài trước, và một workflow riêng <code>ch15-van-hanh.yml</code> trên nhánh <code>ch15-van-hanh</code> với ba job — <code>chap-chon</code> đo test chập chờn, <code>don-dep</code> đo cache và artifact, <code>thong-bao</code> tổng hợp — ở run ${RUN(36074955148)}.</p>

<h3>CI đỏ: đọc từ ngoài vào trong</h3>
${slide('ga-15', 23, 'CI đỏ: đọc từ ngoài vào trong, bốn lớp, dừng ở lớp đầu tiên trả lời được')}
<p>Người mới mở log dài nhất và cuộn. Người có kinh nghiệm đọc bốn lớp theo thứ tự, và thường dừng trước lớp thứ tư. Lấy chính run đỏ của PR #10, ${RUN(36075106581)}:</p>
<table>
<thead><tr><th>Lớp</th><th>Ở đâu</th><th>Run này nói gì</th><th>Đã loại trừ được gì</th></tr></thead>
<tbody>
<tr><td>1 · Annotation</td><td>trang tóm tắt run (hoặc <code>gh run view &lt;id&gt;</code>)</td><td><code>CI chua xanh: co job ket thuc voi 'failure' (lint typecheck test = success success failure)</code></td><td>lỗi nằm ở <code>test</code>, không ở lint/typecheck</td></tr>
<tr><td>2 · Job nào</td><td>đồ thị job</td><td><code>test (22)</code> ✗ và <code>test (24)</code> ✗</td><td>cả hai phiên bản ⇒ không phải lỗi phiên bản Node</td></tr>
<tr><td>3 · Bước nào</td><td>danh sách bước của job</td><td>"Run npm test" đỏ; "Initialize containers" xanh</td><td>không phải hạ tầng, không phải DB không lên</td></tr>
<tr><td>4 · Dòng nào</td><td>log bước (<code>gh run view --log-failed</code>)</td><td><code>actual: soLich: '1'</code> / <code>expected: soLich: 1</code></td><td>kiểu dữ liệu đổi — đi tìm commit đụng tới truy vấn</td></tr>
</tbody>
</table>
<p>Ba lớp đầu mất chưa tới một phút và thu hẹp từ "CI đỏ" xuống "một assertion về kiểu, trên mọi phiên bản". Vài dấu hiệu nhận diện nhanh mà bạn đã gặp trong chương này:</p>
<ul>
<li><strong>Không có log nào cả</strong> — "environment not found" (run ${RUN(36074781609)}), <code>startup_failure</code>, lỗi cú pháp YAML (Bài 12.4): câu trả lời ở annotation mức <em>run</em>, không ở job. <code>get_job_logs</code> trả 404 cho những job ấy.</li>
<li><strong>Đỏ ở "Initialize containers" hay "Set up job"</strong>: kéo ảnh, health check service, tải action — hạ tầng. Chạy lại là hợp lý, nhưng ghi lại lần chạy lại.</li>
<li><strong>Test tích hợp đỏ khó hiểu</strong>: cuộn xuống khối <code>Print service container logs</code> cuối job — Postgres thường đã nói lý do.</li>
<li><strong>Bị hủy</strong>: tìm dòng <code>Canceling since a higher priority waiting request for …</code> — tên nhóm trong dòng ấy cho biết cái khoá nào đã hủy nó (Bài 15.1, 15.3).</li>
</ul>
<div class="callout"><p><strong>Máy này có gì thì dùng nấy.</strong> Trên Mac của bạn: <code>gh run list --workflow ch15-cd.yml</code>, <code>gh run view &lt;id&gt;</code> (annotation + job), <code>gh run view &lt;id&gt; --log-failed</code> (chỉ log của bước đỏ). Phiên dựng bài này không có <code>gh</code>; nó đọc đúng những thứ ấy qua API (danh sách job, log của job, trang run) — cùng bốn lớp, khác công cụ.</p></div>

<h3>Test chập chờn: đo tỉ lệ, đừng kể chuyện</h3>
${slide('ga-15', 24, 'Test chập chờn đo được: 20/40 lần đỏ, sửa một dòng await thì 0/40')}
<p>"Test này thỉnh thoảng hỏng" là một câu chuyện. "Test này đỏ 20 trên 40 lần" là một con số, và con số thì sửa được. Nhánh <code>ch15-van-hanh</code> có một hàm gửi nhắc lịch mất 20–80 ms (giả lập một cuộc gọi mạng) và hai phiên bản test:</p>
<pre><code class="language-javascript">// nhac-lich-chap-chon.test.js — ban CHAP CHON
test('nhac lich duoc gui (ban chap chon)', async () =&gt; {
  const tt = { daGui: false };
  guiNhacLich(tt);                                  // quen await
  await new Promise((r) =&gt; setTimeout(r, 50));      // "cho 50 ms chac du"
  assert.equal(tt.daGui, true);
});

// nhac-lich-da-sua.test.js — ban DA SUA
test('nhac lich duoc gui (ban da sua)', async () =&gt; {
  const tt = { daGui: false };
  await guiNhacLich(tt);
  assert.equal(tt.daGui, true);
});</code></pre>
<p>Job <code>chap-chon</code> chạy mỗi bản 40 lần trong một vòng lặp shell rồi đếm:</p>
<div class="out">chap-chon: 20/40 lan DO          (23:53:33 → 23:53:39, 6 giay)
da-sua: 0/40 lan DO              (23:53:39 → 23:53:45)
do o lan thu 1:
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    actual: false,
    expected: true,
##[error]Process completed with exit code 1.</div>
<p>Trên máy dựng bài, cùng tệp đỏ 11/20 lần. Hai con số khớp nhau quanh 50% — đúng như thiết kế: 50 ms nằm giữa khoảng 20–80 ms. Ở dự án thật, tỉ lệ thường nhỏ hơn nhiều (2%, 0,5%), và chính vì nhỏ nên nó sống lâu: đủ hiếm để ai cũng bấm Re-run, đủ thường để mỗi tuần làm đỏ vài PR.</p>
<table>
<thead><tr><th>Nguyên nhân hay gặp</th><th>Dấu hiệu</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Chờ bằng thời gian thay vì chờ sự kiện</td><td><code>setTimeout</code>/<code>sleep</code> trong test</td><td><code>await</code> đúng promise; thăm dò có giới hạn (như smoke test của 15.3)</td></tr>
<tr><td>Phụ thuộc thứ tự test</td><td>chạy riêng thì xanh, chạy cả bộ thì đỏ</td><td>mỗi test tự dọn dữ liệu (<code>TRUNCATE</code> ở <code>before</code>, như <code>api.test.js</code>)</td></tr>
<tr><td>Đồng hồ thật</td><td>đỏ quanh nửa đêm, cuối tháng</td><td>truyền thời điểm vào hàm; ở đây <code>kiemLich</code> dùng giờ UTC của dữ liệu, không dùng <code>Date.now()</code></td></tr>
<tr><td>Tài nguyên dùng chung</td><td>đỏ khi ma trận chạy song song</td><td>mỗi job một service container riêng — đó là lý do 15.1 không dùng chung một DB</td></tr>
</tbody>
</table>
<p>Quy trình xử lý: <strong>đo</strong> (vòng lặp N lần, như job trên) → <strong>cách ly</strong> (<code>test.skip</code> có ghi rõ issue, không xoá) → <strong>sửa</strong> → <strong>đo lại</strong> tới 0/N. Bước cách ly quan trọng hơn vẻ ngoài của nó: một test chập chờn còn nằm trong check bắt buộc sẽ dạy cả đội rằng "đỏ thì chạy lại", và thói quen ấy sẽ nuốt mất lần đỏ thật tiếp theo.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — bật "retry tự động" cho test.</strong> Retry biến 50% đỏ thành 25%, rồi 12,5% — bảng điều khiển xanh hơn, còn lỗi vẫn nguyên đó, chỉ là khó thấy hơn. Chỉ retry thứ nằm ngoài tầm kiểm soát (tải ảnh, mạng tới registry), và luôn in ra số lần đã retry.</div>

<h3>Chi phí: phút, và thời gian của người chờ</h3>
${slide('ga-15', 25, 'Chi phí: kho public 0 phút tính tiền — kho private thì đếm theo job')}
<p>API <code>…/runs/&lt;id&gt;/timing</code> cho run CD ${RUN(36075733214)} (bản 1.1.0, xanh):</p>
<div class="out">billable: UBUNTU total_ms: 0 · jobs: 8
run_duration_ms: 106000</div>
<p>Không phút nào bị tính: runner chuẩn của GitHub <strong>miễn phí và không giới hạn cho kho public</strong> (docs, tính đến 09/2026). Kho private thì có hạn mức phút miễn phí theo gói rồi tính tiền phần vượt — và thứ bị đếm là thời gian của <em>từng job</em>, không phải thời gian của cả run. Docs nói rõ: phút tính tiền của mỗi job <em>được làm tròn lên phút kế tiếp</em>. Run trên có 8 job trong 106 giây; ở một kho private nó sẽ bị tính ít nhất 8 phút, vì mỗi job 3–50 giây đều thành một phút (hạn mức miễn phí theo gói thì kiểm trên trang billing của tài khoản bạn). Hệ quả thực tế:</p>
<ul>
<li><strong>Job nhỏ đắt hơn vẻ ngoài.</strong> <code>tong-hop-ngay-tho</code> và <code>ci-ok</code> chạy 3–4 giây mỗi cái nhưng là hai job. Kho thật giữ <code>ci-ok</code>, bỏ job ngây thơ (nó chỉ có mặt ở đây để dạy).</li>
<li><strong>Tách job có giá.</strong> Ba job CI song song cho thông tin tốt hơn (Bài 15.1) và nhanh hơn về đồng hồ, nhưng tốn ba lần "Set up job" + checkout + <code>npm ci</code>. Với kho private nhỏ, gộp lint + typecheck vào một job là hợp lý.</li>
<li><strong>Thời gian chờ runner cũng là chi phí</strong> — của người đang đợi PR xanh. Ở run ${RUN(36074887634)}, <code>test (24)</code> được tạo lúc 23:52:55 và chỉ bắt đầu lúc 23:53:35: 40 giây xếp hàng, dài gấp đôi thời gian chạy của nó. Không phút nào tính tiền cho khoảng chờ ấy, nhưng người review thì đợi.</li>
<li><strong><code>timeout-minutes</code> là trần chi phí.</strong> Mặc định 360 phút. Một test treo trong kho private có thể đốt sáu giờ runner mỗi lần push.</li>
</ul>
<p>Muốn giảm thời gian, tối ưu job nằm trên <strong>đường găng</strong> (chuỗi <code>needs</code> dài nhất): ở CD này là <code>ci / test (24)</code> → <code>anh</code> → <code>trien-khai</code>. Làm <code>lint</code> nhanh gấp đôi không làm run nhanh thêm giây nào.</p>

<h3>Dọn dẹp: cache và artifact có hạn mức</h3>
${slide('ga-15', 26, 'Dọn dẹp: cache và artifact có hạn mức — xoá đúng thứ của mình')}
<pre><code class="language-yaml">  don-dep:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      actions: write     # xoa cache / artifact can quyen nay
    env:
      GH_TOKEN: &#36;{{ github.token }}
      R: &#36;{{ github.repository }}
    steps:
      # ... tao cache "ch15-rac-&lt;run_id&gt;" (2 MB) va artifact "ch15-bao-cao" (retention-days: 1) ...
      - name: Kho dang giu bao nhieu cache
        run: |
          gh api "repos/$R/actions/cache/usage" --jq '"tong: \\(.active_caches_count) cache, \\(.active_caches_size_in_bytes) byte"'
          gh cache list --repo "$R" --limit 100 --json key,sizeInBytes,lastAccessedAt --jq '...'
      - name: Xoa DUNG cache rac cua run nay
        run: gh cache delete "ch15-rac-&#36;{GITHUB_RUN_ID}" --repo "$R"</code></pre>
<div class="out">tong: 5 cache, 560614647 byte
--- cache cua chuong 15 ---
2001209    2026-09-24T23:53:33Z  ch15-rac-36074955148
10701      2026-09-24T23:53:09Z  index-ch15-phong-kham-1-5c45fc59#1
55585204   2026-09-24T23:53:09Z  buildkit-blob-1-sha256:f7f2d304681aaa935c9cfd180850cf616ae843efce7682873d6521ded7268937
8284393    2026-09-24T23:53:07Z  node-cache-Linux-x64-npm-682e28bd0c1efaa943c41aefb1157e457d9a5511c3be6d00e7597ca6bda30fd0
55602437   2026-09-24T23:53:05Z  buildkit-blob-1-sha256:87919ed734a39bc185155d715bdcf2ce6c52d112ff642650d9e0e35502b481e9
...
con lai 0 cache ch15-rac-*
ch15-bao-cao    162 byte    het han 2026-09-25T23:53:33Z</div>
<ul>
<li><strong>API tổng hợp trễ.</strong> <code>cache/usage</code> báo "5 cache, 560 MB" trong khi danh sách có hơn 15 mục chỉ riêng của chương này. Con số tổng được tính định kỳ; khi cần quyết định xoá gì, tin danh sách.</li>
<li><strong>Xoá theo khoá chính xác của mình.</strong> Sân tập là kho dùng chung của nhiều chương; <code>gh cache delete --all</code> sẽ làm lạnh CI của người khác. Job này xoá đúng <code>ch15-rac-36074955148</code>, và in ra "còn lại 0" để chứng minh.</li>
<li><strong>Cache ảnh chiếm chỗ nhanh.</strong> Hai blob 55 MB là tầng <code>node:22-alpine</code> của hai kiến trúc — gấp bảy lần toàn bộ cache npm. Với hạn mức 10 GB/kho (09/2026), một kho có nhiều ảnh sẽ tự đẩy cache cũ ra khá nhanh.</li>
<li><strong><code>retention-days</code></strong>: artifact tạm đặt 1 ngày, và API ghi hạn đúng 24 giờ sau lúc tải lên. Mặc định giữ artifact và log 90 ngày; kho public chỉnh được trong khoảng 1–90 ngày. Docs 09/2026 báo trước: từ 01/10/2026, cùng hạn ấy áp cho cả run, check và commit status.</li>
<li><strong>build-push-action tự tải lên một artifact</strong> <code>…dockerbuild</code> (80–93 KB) mỗi lần dựng — "build record" cho bản tóm tắt. Nó cũng tuân <code>retention</code> như mọi artifact.</li>
</ul>

<h3>Thông báo và huy hiệu</h3>
<p>Job <code>thong-bao</code> (<code>needs: [chap-chon, don-dep]</code>, <code>if: always()</code>) làm ba việc mà Bài 9.5 đã giải thích lý do: một annotation <code>::notice</code> trên trang run ("ket qua cac job: success success"), một bản tóm tắt markdown có huy hiệu, và một dòng "thông báo" chỉ khi có job đỏ. Huy hiệu là một URL cố định mà docs mô tả:</p>
<div class="out">https://github.com/cuonghoang1103/ga-san-tap/actions/workflows/ch15-cd.yml/badge.svg?branch=ch15-capstone</div>
<p>Thêm <code>?branch=</code> để huy hiệu chỉ phản ánh nhánh chính (không để PR đỏ làm đỏ README), thêm <code>&amp;event=push</code> nếu workflow có nhiều sự kiện. Huy hiệu không phải trang trí: trên README của một dự án xin việc, nó là bằng chứng một cú nhấp rằng pipeline có thật và đang chạy.</p>

<h3>Checklist "pipeline sẵn sàng production"</h3>
${slide('ga-15', 27, 'Checklist “pipeline sẵn sàng production” — 12 dòng, mỗi dòng kiểm được')}
<table>
<thead><tr><th>#</th><th>Điều kiện</th><th>Kiểm bằng</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mọi job có <code>timeout-minutes</code></td><td><code>grep -L timeout-minutes .github/workflows/*.yml</code> không in gì</td><td>10</td></tr>
<tr><td>2</td><td><code>permissions</code> tối thiểu, khai ở mức job</td><td>khối "GITHUB_TOKEN Permissions" trong Set up job</td><td>6, 15.2</td></tr>
<tr><td>3</td><td>Action ghim SHA + Dependabot <code>github-actions</code></td><td>không còn <code>uses: …@v</code></td><td>12, 14</td></tr>
<tr><td>4</td><td>Một check tổng hợp bắt buộc</td><td>PR đỏ không merge được</td><td>14, 15.1</td></tr>
<tr><td>5</td><td>Test tích hợp với dịch vụ thật</td><td><code>services:</code> + health check</td><td>13, 15.1</td></tr>
<tr><td>6</td><td>Ảnh dựng một lần, tag SHA, có chữ ký</td><td><code>gh attestation verify</code></td><td>14, 15.2</td></tr>
<tr><td>7</td><td>Deploy có khoá, không hủy giữa chừng</td><td><code>cancel-in-progress: false</code> ở job deploy</td><td>9, 15.3</td></tr>
<tr><td>8</td><td>Smoke test kiểm đúng phiên bản</td><td><code>/healthz</code> trả SHA</td><td>15.3</td></tr>
<tr><td>9</td><td>Quay lui tự động, đã diễn tập</td><td>có một run đỏ mà production vẫn xanh</td><td>9, 15.3</td></tr>
<tr><td>10</td><td>Environment giới hạn nhánh + người duyệt</td><td>Settings → Environments</td><td>9, 15.3</td></tr>
<tr><td>11</td><td>Không secret thật trong log hay mã</td><td>push protection bật; log chỉ thấy <code>***</code></td><td>6, 14</td></tr>
<tr><td>12</td><td>Có người nhận tin khi đỏ</td><td>tóm tắt + kênh chat; thử bằng một run cố ý đỏ</td><td>9</td></tr>
</tbody>
</table>
<p>Áp checklist này vào chính api-backend là một bài tập tốt: <code>ci-lint.yml</code> qua dòng 1; mọi workflow đều trượt dòng 3 (Bài 12.4 đếm 24 lượt <code>uses:</code>, 0 ghim SHA); dòng 7 đạt nhờ <code>flock</code> trong <code>deploy-nha.sh</code>; dòng 9 còn là thao tác tay.</p>

<h3>10 câu phỏng vấn CI/CD hay gặp — và ý trả lời</h3>
<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>1. CI và CD khác nhau thế nào? Continuous Delivery và Continuous Deployment?</strong><br>Đ: CI = mỗi thay đổi được tích hợp và kiểm tự động. Delivery = mọi commit xanh đều <em>sẵn sàng</em> deploy, con người bấm nút; Deployment = deploy tự động không cần người bấm. Dự án này là Deployment có cổng (smoke + quay lui); api-backend là Delivery (người chạy script).</p>
<p><strong>2. Pipeline của bạn gồm những gì?</strong><br>Đ: PR → lint/typecheck/test với Postgres thật → check tổng hợp bắt buộc → merge → chạy lại CI trên commit merge → dựng ảnh một lần (2 kiến trúc, tag SHA, attestation) → deploy vào environment có khoá → smoke test → tự quay lui. Kể kèm một con số đo được ở mỗi bước.</p>
<p><strong>3. Làm sao chắc thứ chạy trên production đúng là thứ đã qua test?</strong><br>Đ: Dựng ảnh một lần sau CI, deploy bằng tag SHA/digest, smoke test đọc lại SHA từ <code>/healthz</code>, attestation chứng minh ảnh do workflow nào dựng.</p>
<p><strong>4. Deploy hỏng lúc 2 giờ sáng. Pipeline của bạn làm gì?</strong><br>Đ: Smoke test đỏ → bước quay lui trao lại ảnh của deployment thành công gần nhất (hỏi Deployments API, không đoán) → job đỏ + thông báo. Ở dự án này: phát hiện sau 30 giây, quay lui 2,7 giây.</p>
<p><strong>5. Hai người merge cùng lúc thì sao?</strong><br>Đ: <code>concurrency</code> ở job deploy với <code>cancel-in-progress: false</code>: một chạy, một chờ, bản chờ bị thay nếu có bản mới hơn. Và khoá của CI trên nhánh chính không được hủy CI của bản trước (sự cố đo được ở 15.3).</p>
<p><strong>6. Bạn giữ secret thế nào?</strong><br>Đ: Secret theo environment (chỉ job deploy thấy, sau khi được duyệt), <code>GITHUB_TOKEN</code> với quyền tối thiểu thay cho PAT, OIDC thay cho khoá cloud dài hạn, không bao giờ nội suy <code>&#36;{{ secrets.X }}</code> thẳng vào <code>run:</code>, đưa qua <code>env:</code> + <code>"$BIEN"</code>.</p>
<p><strong>7. Action bên thứ ba có an toàn không?</strong><br>Đ: Ghim SHA đầy đủ + Dependabot để cập nhật có review; quyền tối thiểu để action bị chiếm cũng không làm được nhiều; nhắc vụ tj-actions/changed-files 03/2025 (tag bị dời sang mã độc).</p>
<p><strong>8. CI chậm, bạn bắt đầu từ đâu?</strong><br>Đ: Đo trước: job nào trên đường găng, thời gian chờ runner bao nhiêu. Rồi mới cache (đo được: với app nhỏ cache còn chậm hơn), song song hoá, <code>paths</code>, và thứ tự <code>COPY</code> trong Dockerfile.</p>
<p><strong>9. Làm gì với test chập chờn?</strong><br>Đ: Đo tỉ lệ bằng N lần chạy, cách ly có issue, sửa nguyên nhân (thường là chờ bằng thời gian), đo lại 0/N. Không retry tự động để che.</p>
<p><strong>10. Khi nào KHÔNG nên dùng GitHub Actions để deploy?</strong><br>Đ: Khi dựng cần phần cứng mà runner không có (máy nhà 12 nhân của api-backend dựng nhanh gấp ~3 lần VPS), khi mạng tới đích bị chặn, hay khi đội cần deploy thứ chưa commit. Trả lời bằng đánh đổi, không bằng khẩu hiệu — api-backend chính là ví dụ có thật.</p>
</div>

<h3>Chạy thử từng bước: một buổi "khám sức khoẻ" pipeline</h3>
<ol>
<li>Chọn run đỏ gần nhất của kho; đọc đủ bốn lớp và viết một câu kết luận trước khi mở log dài.</li>
<li>Chọn một test bạn nghi chập chờn; viết vòng lặp 40 lần như job <code>chap-chon</code> và ghi tỉ lệ.</li>
<li>Gọi <code>gh api repos/&lt;owner&gt;/&lt;repo&gt;/actions/runs/&lt;id&gt;/timing</code> cho một run dài; tìm job trên đường găng.</li>
<li><code>gh cache list --limit 100</code>; tìm entry lớn nhất và entry chưa được đọc lâu nhất.</li>
<li>Thêm huy hiệu của workflow deploy (có <code>?branch=main</code>) vào README.</li>
<li>Chấm kho theo checklist 12 dòng; mở issue cho mỗi dòng trượt.</li>
</ol>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn sắp đưa link repo vào CV. Làm cho pipeline của nó chịu được một buổi phỏng vấn.</p><ol>
<li>Chấm repo theo checklist 12 dòng; sửa ít nhất hai dòng đang trượt (gợi ý dễ nhất: <code>timeout-minutes</code> và <code>permissions</code>).</li>
<li>Thêm một job đo test chập chờn chạy tay (<code>workflow_dispatch</code>) cho bộ test của bạn: mỗi tệp test chạy 20 lần, in số lần đỏ.</li>
<li>Thêm huy hiệu CI/CD vào README với <code>?branch=main</code>.</li>
<li>Viết ra giấy câu trả lời cho câu 2 và câu 4 ở trên, dùng số đo của chính repo bạn.</li>
</ol><p><strong>Đạt khi:</strong> <code>grep -L timeout-minutes .github/workflows/*.yml</code> không in tệp nào; job đo chập chờn in được "N/20" cho mỗi tệp; huy hiệu hiện trạng thái thật trên README; và mỗi câu trả lời có ít nhất một con số lấy từ run của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">annotation</span><span class="v">thông báo gắn vào run/job (<code>::error</code>, <code>::warning</code>, <code>::notice</code>) — lớp đọc đầu tiên khi CI đỏ</span></div>
<div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">test cho kết quả khác nhau trên cùng một mã; đo bằng tỉ lệ đỏ qua N lần</span></div>
<div class="kv"><span class="k">quarantine (cách ly)</span><span class="v">tạm bỏ test chập chờn khỏi check bắt buộc, có issue theo dõi, không xoá</span></div>
<div class="kv"><span class="k">đường găng (critical path)</span><span class="v">chuỗi <code>needs</code> dài nhất — thứ duy nhất quyết định thời gian của run</span></div>
<div class="kv"><span class="k">billable minutes (phút tính tiền)</span><span class="v">phút runner bị tính cho kho private; kho public dùng runner chuẩn miễn phí</span></div>
<div class="kv"><span class="k">retention (thời hạn giữ)</span><span class="v">số ngày giữ artifact/log; <code>retention-days</code> để rút ngắn</span></div>
<div class="kv"><span class="k">status badge (huy hiệu)</span><span class="v">ảnh SVG trạng thái workflow: <code>…/actions/workflows/&lt;tệp&gt;/badge.svg</code></span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CI đỏ: annotation → job → bước → dòng; ba lớp đầu thường đủ, và "không có log" nghĩa là đọc annotation mức run.</li>
<li>Test chập chờn là một tỉ lệ: đo được 20/40 → sửa một <code>await</code> → 0/40. Không che bằng retry.</li>
<li>Kho public: 0 phút tính tiền; kho private: trả theo từng job — job nhỏ, job treo, và thời gian chờ đều là chi phí.</li>
<li>Cache ảnh chiếm hạn mức nhanh; API tổng hợp trễ; xoá đúng khoá của mình với <code>actions: write</code>.</li>
<li>Huy hiệu có <code>?branch=</code>, thông báo chỉ khi đỏ, tóm tắt trên trang run.</li>
<li>Checklist 12 dòng + 10 câu phỏng vấn: mỗi câu trả lời kèm một con số từ run thật.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Adding a workflow status badge</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/add-a-status-badge — URL <code>badge.svg</code>, tham số <code>branch</code> và <code>event</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — hạn mức 10 GB, xoá sau 7 ngày không dùng, quản lý cache.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow artifacts / retention</span><span class="lc-sub">docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts — mặc định 90 ngày; thay đổi từ 01/10/2026.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Viewing job execution time</span><span class="lc-sub">docs.github.com/en/actions/how-tos/monitor-workflows/view-job-execution-time — thời gian tính tiền của từng job; runner chuẩn miễn phí cho kho public.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch15-van-hanh</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch15-van-hanh — <code>ch15-van-hanh.yml</code> và hai tệp test nhắc lịch; run 36074955148.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — vòng lặp, đếm, exit code</span><span class="lc-sub">/courses/linux-bash/learn${REF} — thứ đứng sau job đo chập chờn và job dọn dẹp.</span></span></div>
</div>
`,
    },
    {
      title: '15.5 — Final exam: the whole course|||15.5 — Thi cuối khoá: cả khoá học',
      slug: 'ga-15-5-thi-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Hai mươi câu tình huống trải từ Mục 0 tới Chương 15, ba mươi phút, đáp án có giải thích dẫn tới run thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Final exam</span>
<h2>The final exam: the whole course, from Mục 0 to Chapter 15</h2>
<p class="lead">Twenty questions, thirty minutes. They cover the whole course — the "why CI" of Mục 0, YAML and triggers, jobs and matrices, expressions, actions, caches, secrets and tokens, speed and concurrency, reading red CI, deploys and rollbacks, reuse, runners, supply-chain security, and the capstone you just built. Almost every question is a situation, and most answers come from a run that was actually executed; the explanation names it. Answer before you look anything up — the point is to find out what you would do on a real Tuesday.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain CI, Continuous Delivery and Continuous Deployment with an example of each, and why companies pay for them.</li>
<li>I can write a workflow with the right triggers and filters, and I know when a required check will stay Pending forever.</li>
<li>I can predict what an expression, a matrix, a cache key and a concurrency group will do before I push.</li>
<li>I can give a job the minimum permissions, keep secrets out of logs and scripts, and pin third-party actions by SHA.</li>
<li>I can read a red run layer by layer and tell a flaky test from a real failure with numbers.</li>
<li>I can build, sign and deploy an image with a lock, a smoke test and an automatic rollback — and explain each choice in an interview.</li>
</ul>
<div class="callout"><p><strong>How to use your result.</strong> For each wrong answer, open the chapter named at the start of the question and redo that chapter&#39;s 🧪 practice. 16/20 or more: you can walk an interviewer through a real pipeline. Under 12: redo Chapter 15&#39;s practice on your own repository first — the four runs it asks for are the best revision this course has.</p></div>
${slide('ga-15', 29, 'Chapter 15 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Thi cuối khoá</span>
<h2>Bài thi cuối khoá: cả khoá, từ Mục 0 tới Chương 15</h2>
<p class="lead">Hai mươi câu, ba mươi phút. Đề trải khắp khoá — "vì sao cần CI" của Mục 0, YAML và bộ kích hoạt, job và ma trận, biểu thức, action, cache, bí mật và token, tốc độ và concurrency, đọc CI đỏ, deploy và quay lui, tái sử dụng, runner, bảo mật chuỗi cung ứng, và dự án cuối khoá bạn vừa dựng. Gần như câu nào cũng là một tình huống, và phần lớn đáp án lấy từ một run đã chạy thật; lời giải thích ghi rõ run nào. Hãy trả lời trước khi tra cứu — mục đích là biết bạn sẽ làm gì vào một ngày làm việc bình thường.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được CI, Continuous Delivery và Continuous Deployment, mỗi cái một ví dụ, và vì sao công ty trả tiền cho chúng.</li>
<li>Tôi viết được workflow với bộ kích hoạt và bộ lọc đúng, và biết khi nào một check bắt buộc sẽ Pending mãi mãi.</li>
<li>Tôi đoán được một biểu thức, một ma trận, một khoá cache và một nhóm concurrency sẽ làm gì trước khi push.</li>
<li>Tôi cấp được quyền tối thiểu cho job, giữ bí mật khỏi log và script, và ghim action bên thứ ba bằng SHA.</li>
<li>Tôi đọc được một run đỏ theo từng lớp và phân biệt test chập chờn với lỗi thật bằng con số.</li>
<li>Tôi dựng, ký và deploy được một ảnh với khoá, smoke test và quay lui tự động — và giải thích được từng lựa chọn khi phỏng vấn.</li>
</ul>
<div class="callout"><p><strong>Dùng kết quả thế nào.</strong> Với mỗi câu sai, mở chương ghi ở đầu câu và làm lại phần 🧪 của chương đó. Từ 16/20 trở lên: bạn dẫn được người phỏng vấn đi qua một pipeline thật. Dưới 12: làm lại phần thực hành của Chương 15 trên repo của chính bạn trước — bốn run mà nó yêu cầu là bài ôn tốt nhất khoá này có.</p></div>
${slide('ga-15', 29, 'Bảng tra nhanh Chương 15')}
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: 'Mục 0 · In 2012 Knight Capital lost about 460 million USD after a manual deploy in which one of its servers did not receive the new code. Which CI/CD lesson follows most directly?|||Mục 0 · Năm 2012 Knight Capital mất khoảng 460 triệu USD sau một lần deploy tay mà một máy chủ không nhận mã mới. Bài học CI/CD nào rút ra trực tiếp nhất?',
            options: [
              'Write more unit tests for the trading algorithm before each release|||Viết thêm unit test cho thuật toán giao dịch trước mỗi lần phát hành',
              'A deploy must be an automated, identical procedure on every machine, with a check afterwards that every machine runs the new version|||Deploy phải là một quy trình tự động, giống hệt nhau trên mọi máy, và có phép kiểm sau đó rằng mọi máy đều chạy bản mới',
              'Deploy only at weekends, when the market is closed and mistakes cost less|||Chỉ deploy vào cuối tuần, khi thị trường đóng cửa và sai sót rẻ hơn',
              'Add more human approvers who must sign off before each manual deploy|||Thêm người duyệt thủ công phải ký trước mỗi lần deploy tay',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The failure was not in the code under test but in the deploy itself: one machine out of eight kept old code. An automated, repeatable deploy plus a post-deploy check ("which version is every machine running?") removes that class of error — the same idea as the smoke test that reads the SHA back from /healthz in Lesson 15.3. More unit tests are the tempting answer, but no unit test runs on a server that never received the release.|||VI: Chỗ hỏng không nằm ở mã được test mà ở chính việc deploy: một trong tám máy giữ mã cũ. Deploy tự động, lặp lại được, cộng một phép kiểm sau deploy ("mọi máy đang chạy bản nào?") xoá cả loại lỗi này — cùng ý với smoke test đọc lại SHA từ /healthz ở Bài 15.3. Thêm unit test là đáp án hấp dẫn, nhưng không unit test nào chạy trên một máy chưa hề nhận bản phát hành.',
          },
          {
            question: 'Ch1 · "backend-test" is a required check. It comes from a workflow with on.pull_request.paths: ["backend/**"]. A PR only edits README.md. What does the PR show?|||Ch1 · "backend-test" là check bắt buộc. Nó đến từ một workflow có on.pull_request.paths: ["backend/**"]. Một PR chỉ sửa README.md. PR hiện gì?',
            options: [
              'The check is skipped, which counts as success, so the PR can be merged|||Check bị bỏ qua, được tính là thành công, nên PR merge được',
              'GitHub ignores the paths filter for required checks and runs the workflow anyway|||GitHub bỏ qua bộ lọc paths với check bắt buộc và vẫn chạy workflow',
              'The check shows "neutral" and a repository admin must re-run it|||Check hiện "neutral" và admin của kho phải chạy lại',
              '"Expected — Waiting for status to be reported" forever; the PR cannot be merged|||"Expected — Waiting for status to be reported" mãi mãi; PR không merge được',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: When a whole workflow is filtered out by paths or branches, its checks are never created and stay Pending — the PR is blocked. The tempting answer confuses this with a skipped JOB, which does report Success. Fix: drop paths from the workflow holding the required check and decide inside it, or use an aggregate job that always runs (Lessons 1.5, 14.1, 15.1).|||VI: Khi cả workflow bị lọc bởi paths hay nhánh, check của nó không bao giờ được tạo và nằm Pending — PR bị chặn. Đáp án hấp dẫn nhầm với JOB bị skip, thứ báo Success. Cách sửa: bỏ paths khỏi workflow chứa check bắt buộc và quyết định bên trong nó, hoặc dùng một job tổng hợp luôn chạy (Bài 1.5, 14.1, 15.1).',
          },
          {
            question: 'Ch1 · On a PR, the push runs of both branches are green but the pull_request run is red. Which statement about the pull_request run is true?|||Ch1 · Trên một PR, run push của cả hai nhánh đều xanh nhưng run pull_request đỏ. Phát biểu nào về run pull_request là đúng?',
            options: [
              'It tested a merge commit GitHub created from the PR head and the base branch — a commit that exists on neither branch|||Nó kiểm một merge commit GitHub tạo từ đầu nhánh PR và nhánh gốc — một commit không nằm trên nhánh nào',
              'It tested the PR head commit, so the failure must be flaky|||Nó kiểm commit đầu nhánh PR, nên cú hỏng chắc chắn là chập chờn',
              'It tested the base branch only, ignoring the PR changes|||Nó chỉ kiểm nhánh gốc, bỏ qua thay đổi của PR',
              'It ran with the fork’s secrets, which differ from the repository’s|||Nó chạy với secret của fork, khác secret của kho',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: pull_request runs on refs/pull/N/merge — the result of merging the PR into the current base. Two branches that are each green can be red together, which is exactly why Chapter 15 re-runs CI on the merge commit before deploying. "Flaky" is tempting, but the difference is a different commit, not chance.|||VI: pull_request chạy trên refs/pull/N/merge — kết quả gộp PR vào nhánh gốc hiện tại. Hai nhánh xanh riêng lẻ có thể đỏ khi ghép, và đó chính là lý do Chương 15 chạy lại CI trên commit merge trước khi deploy. "Chập chờn" là đáp án hấp dẫn, nhưng khác biệt nằm ở một commit khác, không phải may rủi.',
          },
          {
            question: 'Ch2 · A test job has matrix node: [22, 24] and default settings. test (24) fails; test (22) shows "cancelled". What happened, and what do you change?|||Ch2 · Một job test có matrix node: [22, 24] và thiết lập mặc định. test (24) đỏ; test (22) hiện "cancelled". Chuyện gì xảy ra, và bạn đổi gì?',
            options: [
              'A concurrency group cancelled it; remove concurrency from the workflow|||Một nhóm concurrency đã hủy nó; bỏ concurrency khỏi workflow',
              'The runner ran out of memory; add timeout-minutes|||Runner hết bộ nhớ; thêm timeout-minutes',
              'fail-fast is on by default and cancels the other entries; set fail-fast: false to see both results|||fail-fast bật mặc định và hủy các nhánh còn lại; đặt fail-fast: false để thấy cả hai kết quả',
              'Node 22 is not available on ubuntu-24.04; pin a different image|||Node 22 không có trên ubuntu-24.04; ghim ảnh khác',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: With fail-fast (the default), one failing matrix entry cancels the others. For a version matrix that loses the diagnosis "red on 24 only". In run 36075106581 both versions were red with the same assertion, which is itself information: not a version problem. Concurrency cancellations carry a different annotation ("higher priority waiting request").|||VI: Với fail-fast (mặc định), một nhánh ma trận đỏ hủy các nhánh còn lại. Với ma trận phiên bản, điều đó làm mất chẩn đoán "chỉ đỏ trên 24". Ở run 36075106581 cả hai phiên bản cùng đỏ với một assertion — bản thân đó là thông tin: không phải lỗi phiên bản. Hủy do concurrency có annotation khác ("higher priority waiting request").',
          },
          {
            question: 'Ch3 · Which condition can NEVER be true in a workflow triggered by push?|||Ch3 · Điều kiện nào KHÔNG BAO GIỜ đúng trong một workflow kích hoạt bởi push?',
            options: [
              "if: github.ref_name == 'main'|||if: github.ref_name == 'main'",
              "if: startsWith(github.ref, 'refs/heads/')|||if: startsWith(github.ref, 'refs/heads/')",
              "if: github.ref == 'main'|||if: github.ref == 'main'",
              "if: github.event_name == 'push'|||if: github.event_name == 'push'",
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: github.ref is a full ref such as refs/heads/main, never the bare name, so comparing it with the string main is always false — and silently so: the step is just skipped. github.ref_name is the short name and does match. Lesson 3.5 lists this among "conditions that never fire".|||VI: github.ref là ref đầy đủ như refs/heads/main, không bao giờ là tên trơn, nên so với chuỗi main luôn sai — và sai trong im lặng: bước chỉ bị bỏ qua. github.ref_name mới là tên ngắn và khớp được. Bài 3.5 xếp nó vào nhóm "điều kiện không bao giờ nổ".',
          },
          {
            question: 'Ch4 · After the tj-actions/changed-files incident of March 2025, what protects a workflow against a third-party action whose tags are moved to malicious code?|||Ch4 · Sau vụ tj-actions/changed-files tháng 3/2025, điều gì bảo vệ workflow trước một action bên thứ ba bị dời tag sang mã độc?',
            options: [
              'Pin every action to a full commit SHA and let Dependabot propose reviewed updates|||Ghim mọi action vào SHA commit đầy đủ và để Dependabot đề xuất cập nhật có review',
              'Pin to a major tag such as @v4, which GitHub guarantees is immutable|||Ghim vào tag major như @v4, thứ GitHub bảo đảm là bất biến',
              'Use only actions with many stars on the Marketplace|||Chỉ dùng action có nhiều sao trên Marketplace',
              'Run every workflow with permissions: write-all so failures are visible|||Chạy mọi workflow với permissions: write-all để thấy lỗi rõ hơn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A tag like @v4 is a pointer the owner (or an attacker with their credentials) can move; a full SHA names exact content. Dependabot keeps SHA pins fresh through PRs you review. The @v4 answer is the tempting one — Lesson 4.2 measured that the pointer moves. write-all is the opposite of the least-privilege lesson.|||VI: Tag như @v4 là một con trỏ mà chủ action (hoặc kẻ tấn công có thông tin đăng nhập của họ) dời được; SHA đầy đủ gọi tên đúng nội dung. Dependabot giữ SHA luôn mới qua PR bạn review. @v4 là đáp án hấp dẫn — Bài 4.2 đã đo con trỏ ấy dời. write-all thì ngược với bài học quyền tối thiểu.',
          },
          {
            question: 'Ch5 · A job saves a cache, changes the files, then saves again with the same key. The second save is green but prints "Unable to reserve cache with key …". What is in the cache now?|||Ch5 · Một job lưu cache, sửa tệp, rồi lưu lại với cùng khoá. Lần lưu thứ hai xanh nhưng in "Unable to reserve cache with key …". Cache giờ chứa gì?',
            options: [
              'The newer content, because the last save wins|||Nội dung mới hơn, vì lần lưu sau thắng',
              'Nothing — both entries were deleted because of the conflict|||Không gì — cả hai mục bị xoá vì xung đột',
              'A merge of both versions of the files|||Bản gộp của cả hai phiên bản tệp',
              'The first content: an existing cache entry is immutable|||Nội dung lần đầu: một mục cache đã tồn tại là bất biến',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Cache entries cannot be overwritten; a key that exists keeps its first content, and the second save only warns. That is why keys must change when their inputs change (hashFiles of the lockfile) — and why, in Lesson 15.1, a version bump in package-lock.json produced a new key and a cold job. The same warning appeared from setup-qemu-action in Lesson 15.2, harmlessly.|||VI: Mục cache không ghi đè được; khoá đã có giữ nội dung đầu tiên, lần lưu sau chỉ cảnh báo. Vì thế khoá phải đổi khi đầu vào đổi (hashFiles của lockfile) — và vì thế ở Bài 15.1, bump version trong package-lock.json sinh khoá mới và một job lạnh. Cùng cảnh báo ấy xuất hiện từ setup-qemu-action ở Bài 15.2, vô hại.',
          },
          {
            question: 'Ch6 · A workflow declares permissions: { contents: read, statuses: write }. One job adds permissions: { issues: read } and then creates a commit status. What happens?|||Ch6 · Workflow khai permissions: { contents: read, statuses: write }. Một job thêm permissions: { issues: read } rồi tạo commit status. Chuyện gì xảy ra?',
            options: [
              'It works: job permissions are added on top of the workflow ones|||Chạy được: quyền của job được cộng thêm vào quyền của workflow',
              'HTTP 403: the job block replaces the workflow block, leaving only Issues: read and Metadata: read|||HTTP 403: khối của job thay thế khối của workflow, chỉ còn Issues: read và Metadata: read',
              'The workflow fails to start with a syntax error|||Workflow không khởi động được vì lỗi cú pháp',
              'It works, but only on the default branch|||Chạy được, nhưng chỉ trên nhánh mặc định',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A job-level permissions block replaces the workflow-level one entirely. The real permissions are printed in the "GITHUB_TOKEN Permissions" group of the Set up job log — the place Chapter 15 reads them (ci-ok showed exactly Contents: read, Metadata: read). "Added on top" is the intuitive but wrong reading.|||VI: Khối permissions ở mức job thay THẾ hoàn toàn khối ở mức workflow. Quyền thật được in trong nhóm "GITHUB_TOKEN Permissions" của log Set up job — chỗ Chương 15 đọc chúng (ci-ok in đúng Contents: read, Metadata: read). "Cộng thêm" là cách hiểu trực giác nhưng sai.',
          },
          {
            question: 'Ch6 · An AWS role trusts GitHub OIDC with the condition sub: "repo:my-org/app:*". Why is that a problem?|||Ch6 · Một vai trò AWS tin OIDC của GitHub với điều kiện sub: "repo:my-org/app:*". Vì sao đó là vấn đề?',
            options: [
              'OIDC tokens from GitHub cannot be used with AWS at all|||Token OIDC của GitHub không dùng được với AWS',
              'The wildcard makes tokens live for 24 hours instead of 10 minutes|||Ký tự đại diện làm token sống 24 giờ thay vì 10 phút',
              'It blocks the main branch, because main is not a wildcard match|||Nó chặn nhánh main, vì main không khớp ký tự đại diện',
              'Every branch, pull-request context or environment of that repository gets the role — anyone who can push a branch can deploy|||Mọi nhánh, ngữ cảnh pull request hay environment của kho đó đều nhận được vai trò — ai push được một nhánh cũng deploy được',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The sub claim encodes where the job runs (ref, environment, PR). Trusting repo:org/app:* trusts all of them. Restrict it to the environment or the main ref, e.g. …:environment:production — the cloud-side equivalent of the "deployment branches" rule Chapter 15 could not switch on without admin rights.|||VI: Claim sub mã hoá job chạy ở đâu (ref, environment, PR). Tin repo:org/app:* là tin tất cả. Hãy giới hạn theo environment hay ref chính, ví dụ …:environment:production — bản phía cloud của luật "deployment branches" mà Chương 15 chưa bật được vì thiếu quyền admin.',
          },
          {
            question: 'Ch7 · You add concurrency to a DEPLOY job so two deploys never overlap. Which setting is right, and why?|||Ch7 · Bạn thêm concurrency cho job DEPLOY để hai lần deploy không bao giờ chồng nhau. Thiết lập nào đúng, và vì sao?',
            options: [
              'cancel-in-progress: true, so the newest commit always wins as fast as possible|||cancel-in-progress: true, để commit mới nhất luôn thắng nhanh nhất có thể',
              'cancel-in-progress: false: the running deploy finishes, one waits, a newer waiting one replaces it|||cancel-in-progress: false: deploy đang chạy được làm xong, một bản chờ, bản chờ mới hơn thay chỗ',
              'No concurrency; rely on the order in which pushes arrive|||Không concurrency; dựa vào thứ tự các push tới',
              'concurrency on the whole workflow with the group name github.run_id|||concurrency cho cả workflow với tên nhóm github.run_id',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Cancelling a deploy halfway leaves production half old, half new — the 06/07/2026 Exited(137) incident. With false, run 36076899299 waited and started 3 seconds after the previous deploy finished, while the middle one was replaced. A group of github.run_id is unique per run, so it would lock nothing.|||VI: Hủy một deploy giữa chừng để production nửa cũ nửa mới — sự cố Exited(137) ngày 06/07/2026. Với false, run 36076899299 chờ và bắt đầu 3 giây sau khi deploy trước xong, còn bản ở giữa bị thay. Nhóm github.run_id là duy nhất cho mỗi run nên không khoá được gì.',
          },
          {
            question: 'Ch8 · A step with only run: eslnt . fails with "Process completed with exit code 127." What happened?|||Ch8 · Một bước chỉ có run: eslnt . hỏng với "Process completed with exit code 127." Chuyện gì đã xảy ra?',
            options: [
              'ESLint found 127 problems|||ESLint tìm thấy 127 lỗi',
              'The runner was killed for using too much memory|||Runner bị giết vì dùng quá nhiều bộ nhớ',
              'The shell found no command named eslnt on PATH, so no program started at all|||Shell không tìm thấy lệnh nào tên eslnt trên PATH, nên không chương trình nào khởi động cả',
              'The step timed out after 127 seconds|||Bước hết giờ sau 127 giây',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: 127 is the shell’s "command not found". Exit codes are measured, not guessed (Lesson 8.1): 137 would be SIGKILL (often OOM), 1 a normal tool failure. Reading the code first saves opening the log at all — layer 3 of the reading order in Lesson 15.4.|||VI: 127 là "không tìm thấy lệnh" của shell. Mã thoát phải đo, không đoán (Bài 8.1): 137 là SIGKILL (thường là OOM), 1 là công cụ báo lỗi bình thường. Đọc mã trước giúp khỏi phải mở log — lớp thứ 3 trong thứ tự đọc của Bài 15.4.',
          },
          {
            question: 'Ch9 · Your pipeline must roll back automatically. How should it determine "the previous version"?|||Ch9 · Pipeline phải tự quay lui. Nó nên xác định "bản trước" thế nào?',
            options: [
              'Ask what production is actually running — e.g. the latest successful deployment of the main branch — and check that image still exists|||Hỏi production thật sự đang chạy gì — ví dụ deployment thành công mới nhất của nhánh chính — và kiểm ảnh đó còn tồn tại',
              'Use the parent commit of the one being deployed (HEAD^)|||Dùng commit cha của commit đang deploy (HEAD^)',
              'Use the image tagged latest|||Dùng ảnh gắn tag latest',
              'Use the most recent git tag, whatever branch it is on|||Dùng thẻ git mới nhất, dù nó nằm trên nhánh nào',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: HEAD^ may be the broken version that was just rolled back (Lesson 9.3). Chapter 15 also showed the second trap: without a branch filter, a test job’s deployment (069ee49) was taken as "previous" and the pull failed with "manifest unknown". Filtering ref=main and checking the image fixed it.|||VI: HEAD^ có thể chính là bản hỏng vừa bị quay lui (Bài 9.3). Chương 15 còn cho thấy cái bẫy thứ hai: không lọc nhánh thì deployment của một job thử (069ee49) bị coi là "bản trước" và lệnh kéo hỏng với "manifest unknown". Lọc ref=main và kiểm ảnh đã sửa được.',
          },
          {
            question: 'Ch10 · After a deploy, unauthenticated requests return 401 on /api/v1/profile and 404 on /api/v1/gifs. The container is healthy. Most likely cause?|||Ch10 · Sau một lần deploy, request không xác thực trả 401 ở /api/v1/profile và 404 ở /api/v1/gifs. Container healthy. Nguyên nhân khả dĩ nhất?',
            options: [
              'The running image does not contain the GIF router — a stale or partial build|||Ảnh đang chạy không chứa router GIF — một bản dựng cũ hoặc dở dang',
              'The GIF API key expired|||Khoá API GIF đã hết hạn',
              'nginx is down|||nginx đã chết',
              'The database migration failed|||Migration cơ sở dữ liệu hỏng',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: 401 proves routing reached the app and the route is mounted (it just needs auth); 404 on a known route means that route is not in the running code. An expired key would give an upstream error, not a missing route. That is why smoke tests check routes and, in Chapter 15, the exact version from /healthz.|||VI: 401 chứng minh request tới được app và route đã được gắn (chỉ cần xác thực); 404 ở một route đã biết nghĩa là route đó không có trong mã đang chạy. Khoá hết hạn sẽ cho lỗi từ phía dịch vụ, không phải route vắng mặt. Vì thế smoke test kiểm route, và ở Chương 15 kiểm đúng phiên bản từ /healthz.',
          },
          {
            question: 'Ch12 · A job calls a reusable workflow through a matrix: dev (1 s), stage (25 s), prod (8 s). Each sets the output env to its own name. What does needs.<job>.outputs.env contain?|||Ch12 · Một job gọi reusable workflow bằng ma trận: dev (1 giây), stage (25 giây), prod (8 giây). Mỗi lần đặt output env bằng tên của nó. needs.<job>.outputs.env chứa gì?',
            options: [
              'prod — the last entry of the matrix list|||prod — phần tử cuối của danh sách ma trận',
              'dev,stage,prod joined with commas|||dev,stage,prod nối bằng dấu phẩy',
              'stage — the output of the run that finished last|||stage — output của lần chạy xong sau cùng',
              'An empty string — matrix calls cannot return outputs|||Chuỗi rỗng — gọi bằng ma trận không trả output được',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Outputs are not merged; the value is the one set by the last successfully completing run. Run 36029548881 measured stage finishing at 16:45:47, after prod. "Last in the list" is tempting but the rule is about finishing time. To keep all values, use artifacts or a summary job.|||VI: Output không được gộp; giá trị là của lần chạy hoàn thành thành công sau cùng. Run 36029548881 đo được stage xong lúc 16:45:47, sau prod. "Cuối danh sách" là đáp án hấp dẫn nhưng luật tính theo thời điểm xong. Muốn giữ mọi giá trị thì dùng artifact hoặc job tổng hợp.',
          },
          {
            question: 'Ch13 · An open-source project wants faster CI and proposes a self-hosted runner for pull_request workflows, with "Require approval for first-time contributors" on. Why is that still unsafe?|||Ch13 · Một dự án mã nguồn mở muốn CI nhanh hơn và đề xuất runner self-hosted cho workflow pull_request, có bật "Require approval for first-time contributors". Vì sao vẫn không an toàn?',
            options: [
              'Self-hosted runners cannot run pull_request workflows at all|||Runner self-hosted không chạy được workflow pull_request',
              'The workflow runs the PR’s own code on your machine; approval depends on a reviewer spotting it, and a persistent runner keeps whatever the job left behind|||Workflow chạy chính mã của PR trên máy bạn; việc duyệt phụ thuộc người duyệt nhìn ra, và runner bền giữ lại mọi thứ job để lại',
              'Self-hosted runners are billed per minute for public repositories|||Runner self-hosted bị tính tiền theo phút với kho public',
              'GitHub disables secrets on self-hosted runners|||GitHub tắt secret trên runner self-hosted',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A PR can change the build scripts or tests, and they execute on your hardware with its network access; the approval gate only works if a human catches it every time, and returning contributors skip it. Chapter 13 only ever ran an ephemeral runner in a container, for one workflow_dispatch job with its own label.|||VI: PR có thể sửa script dựng hay test, và chúng chạy trên phần cứng của bạn với quyền mạng của nó; cổng duyệt chỉ hiệu quả khi lần nào con người cũng bắt được, và người đóng góp quen thì bỏ qua cổng. Chương 13 chỉ chạy runner ephemeral trong container, cho đúng một job workflow_dispatch có nhãn riêng.',
          },
          {
            question: 'Ch14 · A step must print the PR title, which anyone opening a PR controls. Which form is safe?|||Ch14 · Một bước cần in tiêu đề PR, thứ mà ai mở PR cũng đặt được. Cách viết nào an toàn?',
            options: [
              'run: echo "Title: ${{ github.event.pull_request.title }}"|||run: echo "Tieu de: ${{ github.event.pull_request.title }}"',
              "run: echo 'Title: ${{ github.event.pull_request.title }}' with single quotes|||run: echo 'Tieu de: ${{ github.event.pull_request.title }}' bọc trong nháy đơn",
              'Wrap the expression in toJSON() inside run:|||Bọc biểu thức trong toJSON() ngay trong run:',
              'env: { TITLE: ${{ github.event.pull_request.title }} } and run: echo "Title: $TITLE"|||env: { TIEU_DE: ${{ github.event.pull_request.title }} } và run: echo "Tieu de: $TIEU_DE"',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Expressions inside run: are substituted into the script text before the shell starts, so a crafted title becomes part of the command; quotes do not help because the title can contain quotes. Passing it through env: makes it data the shell reads from a variable. actionlint/zizmor flag the unsafe forms (Lesson 14.2).|||VI: Biểu thức trong run: được thay vào chữ của script trước khi shell chạy, nên một tiêu đề được dựng sẵn thành một phần của lệnh; nháy không cứu được vì tiêu đề có thể chứa nháy. Đưa qua env: biến nó thành dữ liệu shell đọc từ biến. actionlint/zizmor gắn cờ các dạng không an toàn (Bài 14.2).',
          },
          {
            question: 'Ch15 · In the capstone CI, a cold npm ci (172 packages) took about 3.1 s in total, and a job with an 8 MB cache hit took about 4.3 s. What is the right conclusion?|||Ch15 · Trong CI của dự án cuối khoá, npm ci lạnh (172 gói) mất tổng khoảng 3,1 giây, còn job trúng cache 8 MB mất khoảng 4,3 giây. Kết luận đúng là gì?',
            options: [
              'The cache is misconfigured; add restore-keys and it will be faster|||Cache cấu hình sai; thêm restore-keys là nhanh hơn',
              'For an install this small the cache costs more than it saves; measure the cold job first and cache only when installs are slow|||Với lượt cài nhỏ như vậy cache tốn hơn phần nó tiết kiệm; đo job lạnh trước và chỉ cache khi cài đặt chậm',
              'Caching always pays off on the second run of a workflow|||Cache luôn có lãi từ lần chạy thứ hai của workflow',
              'The runner’s network was slow that day; the numbers mean nothing|||Mạng của runner hôm đó chậm; các con số không có ý nghĩa',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Downloading and extracting the 8 MB tarball (2.7 s for setup-node) cost more than npm fetching 172 packages over Azure’s network. Caching wins when a cold install takes tens of seconds. restore-keys would not help — the key hit exactly. Lesson 5.1 reached the same shape of result with larger numbers.|||VI: Tải và giải nén tarball 8 MB (setup-node mất 2,7 giây) tốn hơn để npm tải 172 gói qua mạng Azure. Cache thắng khi lượt cài lạnh mất hàng chục giây. restore-keys không giúp gì — khoá đã trúng chính xác. Bài 5.1 đi tới cùng dạng kết quả với con số lớn hơn.',
          },
          {
            question: 'Ch15 · Commit 4787c43 renamed src/server.js to src/index.js but left CMD ["node", "src/server.js"] in the Dockerfile. Which check caught it?|||Ch15 · Commit 4787c43 đổi tên src/server.js thành src/index.js nhưng để nguyên CMD ["node", "src/server.js"] trong Dockerfile. Phép kiểm nào bắt được nó?',
            options: [
              'typecheck, because the start file no longer exists|||typecheck, vì tệp khởi động không còn tồn tại',
              'The integration tests with Postgres|||Test tích hợp với Postgres',
              'The docker build step, which validates CMD|||Bước docker build, vốn kiểm CMD',
              'Only the post-deploy smoke test; the automatic rollback then restored the previous version|||Chỉ smoke test sau deploy; rồi quay lui tự động đưa bản trước trở lại',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lint, typecheck, tests (which import src/app.js), the two-architecture build and even the attestation were all green in run 36075892650. Only the smoke test saw the container restarting (restart=1 → 9, MODULE_NOT_FOUND) and triggered the 2.7-second rollback to sha-39c37de. Docker does not check that the CMD file exists.|||VI: Lint, typecheck, test (import src/app.js), bản dựng hai kiến trúc và cả attestation đều xanh ở run 36075892650. Chỉ smoke test thấy container khởi động lại liên tục (restart=1 → 9, MODULE_NOT_FOUND) và kích hoạt cú quay lui 2,7 giây về sha-39c37de. Docker không kiểm tệp trong CMD có tồn tại.',
          },
          {
            question: 'Ch15 · CD calls the CI workflow via workflow_call. CI has concurrency: group: ci-${{ github.event.pull_request.number || github.ref }}, cancel-in-progress: true. Two commits are pushed to main 6 seconds apart. What happens?|||Ch15 · CD gọi workflow CI qua workflow_call. CI có concurrency: group: ci-${{ github.event.pull_request.number || github.ref }}, cancel-in-progress: true. Hai commit được push lên main cách nhau 6 giây. Chuyện gì xảy ra?',
            options: [
              'The first CD run is cancelled inside its CI, so the first commit is never deployed and no run reports it red|||Run CD đầu bị hủy ngay trong phần CI, nên commit đầu không bao giờ được deploy và không run nào báo đỏ cho nó',
              'Both commits are deployed one after the other|||Cả hai commit được deploy lần lượt',
              'The second push is rejected by GitHub until the first run finishes|||Push thứ hai bị GitHub từ chối tới khi run đầu xong',
              'Both CI runs are cancelled and nothing is deployed|||Cả hai run CI bị hủy và không gì được deploy',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: On push there is no PR number, so both runs share the group ci-refs/heads/main and the newer one cancels the older — measured in run 36076482487 ("Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists"). The fix keyed pushes on github.run_id. A CI lock is for PRs; a deploy lock is a separate thing.|||VI: Trên push không có số PR, nên hai run dùng chung nhóm ci-refs/heads/main và run mới hủy run cũ — đo ở run 36076482487 ("Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists"). Cách sửa là cho push theo github.run_id. Khoá CI dành cho PR; khoá deploy là chuyện khác.',
          },
          {
            question: 'Ch15 · With the deploy job locked by concurrency: { group: production, cancel-in-progress: false }, three commits A, B, C reach the deploy job while A is deploying. What happens to B and C?|||Ch15 · Với job deploy khoá bằng concurrency: { group: production, cancel-in-progress: false }, ba commit A, B, C tới job deploy trong lúc A đang deploy. B và C ra sao?',
            options: [
              'B and C both wait and are deployed in order after A|||B và C cùng chờ và được deploy lần lượt sau A',
              'A is cancelled so C can deploy immediately|||A bị hủy để C deploy ngay',
              'B waits, then is cancelled when C arrives; C runs after A finishes|||B chờ, rồi bị hủy khi C tới; C chạy sau khi A xong',
              'B and C fail immediately with "group busy"|||B và C hỏng ngay với "group busy"',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A concurrency group holds at most one running and one pending job; a new pending job replaces the old pending one. Measured: 5c7b348 waited 46 s and was cancelled with "higher priority waiting request for ch15-production", and c17030d started 3 s after acd5829 finished, with PREV = sha-acd5829. Skipping B is correct: C contains it.|||VI: Một nhóm concurrency giữ tối đa một job đang chạy và một đang chờ; job chờ mới thay job chờ cũ. Đo được: 5c7b348 chờ 46 giây rồi bị hủy với "higher priority waiting request for ch15-production", còn c17030d bắt đầu 3 giây sau khi acd5829 xong, với PREV = sha-acd5829. Bỏ qua B là đúng: C đã chứa nó.',
          },
        ],
      },
    },
  ],
};
