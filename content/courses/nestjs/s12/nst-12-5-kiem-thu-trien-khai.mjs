/**
 * 12.5 — Test, Docker và CI cho dự án cuối: test theo user story, compose một lệnh (+ seed), CI chạy CHÍNH bộ chấm của hội đồng,
 * README tiếng Anh (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22 / node:22 22.23.5, Docker BuildKit, Compose v2, Nest 12.6.0, Vitest 4.1.12): lab/c12/moc12 —
 * CI cục bộ ../ci-cuc-bo.py kiem|e2e|anh (TREN_MAY=1 cho anh) ⇒ lab/c12/o/125-*.txt. Ghép: gen.mjs rồi ghep.sh 125 nst-12-5-kiem-thu-trien-khai.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-11-3-ci', title: 'NestJS 11.3 — CI ba job', sub: 'Bộ chạy CI cục bộ và ba lần đỏ thật — chương này nối thêm bước chấm.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-8-3-e2e', title: 'NestJS 8.3 — Test e2e với cơ sở dữ liệu thật', sub: 'Mỗi worker một DB, đồng hồ tiêm vào — nền của 70 test.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Tư duy test chung: kim tự tháp, test nghiệm thu.', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('📘', 'Docker Docs — Using profiles with Compose', 'Dịch vụ chỉ chạy khi gọi profile.', 'https://docs.docker.com/compose/how-tos/profiles/'),
  nguon('📘', 'Docker Docs — Interpolation (required variables)', 'Cú pháp ${VAR:?lỗi} và ${VAR:-mặc định}.', 'https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/'),
].join('\n');
const MA_SEED = "  seed:                             # mốc 12: tài khoản + phòng mẫu cho demo / bộ chấm — CHỈ chạy khi gọi: docker compose run --rm seed\n    <<: *app\n    profiles: [demo]\n    restart: 'no'\n    command: [node, dist/seed.js]\n    environment:\n      <<: *env\n      # KHÔNG dùng ${…:?}: compose nội suy MỌI dịch vụ kể cả profile chưa bật ⇒ `up` cũng hỏng. seed.ts tự từ chối khi thiếu (bài 12.5)\n      SEED_PASSWORD: ${SEED_PASSWORD:-}";
const OUT_PROFILE = "error while interpolating services.seed.environment.SEED_PASSWORD: required variable SEED_PASSWORD is missing a value: đặt SEED_PASSWORD (≥ 12 ký tự) trong .env";
const MA_ENVEX = "# .env.example — chép thành .env rồi đặt giá trị thật. .env KHÔNG vào git.\n# Khoá ký JWT: ngẫu nhiên, ≥ 32 ký tự — ví dụ: openssl rand -base64 33\nJWT_SECRET=\n# Mật khẩu cho tài khoản mẫu (admin@fpt.edu.vn, gv.lan@fpt.edu.vn, an.se170001@fpt.edu.vn) — chỉ dùng cho demo\nSEED_PASSWORD=\n# Giới hạn request/phút/IP cho MỌI bản API (đếm chung trong Redis). Bộ chấm cham.mjs bắn ~120 request/phút ⇒ đặt 1000 khi chấm\nRATE_LIMIT_PER_MIN=100";
const MA_CI_ANH = "  anh:\n    needs: [kiem, e2e]\n    runs-on: ubuntu-24.04\n    timeout-minutes: 15\n    env:\n      IMAGE: lab-booking:${{ github.sha }}\n    steps:\n      - uses: actions/checkout@v5\n      - uses: docker/setup-buildx-action@v3\n      - run: docker build -t $IMAGE .\n      - run: test \"$(docker image inspect -f '{{.Config.User}}' $IMAGE)\" = node\n      - run: |\n          echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env\n          echo \"SEED_PASSWORD=$(openssl rand -hex 12)\" >> .env\n          echo \"RATE_LIMIT_PER_MIN=1000\" >> .env          # bộ chấm bắn > 100 request/phút từ một IP\n          docker compose up -d --wait --wait-timeout 120\n          docker compose exec -T api1 wget -qO- http://127.0.0.1:3000/health/ready   # /health/ bị nginx chặn từ ngoài (404)\n          curl -fsS http://127.0.0.1:42150/rooms\n      # mốc 12: chạy CHÍNH bộ chấm của hội đồng trên stack vừa dựng — đề bài trở thành một bước CI\n      - run: docker compose run --rm seed\n      - uses: actions/setup-node@v5\n        with: { node-version: 22 }\n      - run: npm ci --prefix cham\n      - run: |\n          set -a; . ./.env; set +a\n          CHAM_URL=http://127.0.0.1:42150 CHAM_MK=$SEED_PASSWORD \\\n          CHAM_HOP_THU=\"docker compose exec -T redis redis-cli LRANGE hopthu 0 -1\" node cham/cham.mjs\n      - if: failure()\n        run: docker compose logs --no-color --tail 80";
const OUT_KIEM = "▶ checkout: 112 tệp (đã bỏ thứ .gitignore loại)\n▶ run: npm ci\n  ⏱ 19.5 s · mã thoát 0\n▶ run: DATABASE_URL=postgresql://ci:ci@localhost:5432/ci npx prisma generate\n  ⏱ 1.6 s · mã thoát 0\n▶ run: npm run lint\n   Found 7 warnings and 0 errors.\n  ⏱ 0.9 s · mã thoát 0\n▶ run: npm run typecheck\n  ⏱ 3.8 s · mã thoát 0\n▶ run: npm run test:unit\n         Tests  10 passed (10)\n  ⏱ 1.2 s · mã thoát 0\n▶ run: npm run build && npm run openapi\n   openapi.json: 16 đường dẫn, 12 schema\n  ⏱ 6.2 s · mã thoát 0\n▶ run: git diff --no-index --exit-code /w0/openapi-checkout.json openapi.json\n  ⏱ 0.1 s · mã thoát 0\n✓ job kiem XANH";
const OUT_E2E = "▶ service postgres (postgres:16) healthy sau 4.7 s\n▶ service redis (redis:7-alpine) healthy sau 2.1 s\n▶ run: npm run test:db\n    Test Files  12 passed (12)\n         Tests  58 passed (58)\n✓ job e2e XANH";
const OUT_ANH = "▶ run: docker build -t $IMAGE .\n  ⏱ 45.6 s · mã thoát 0\n▶ run: test \"$(docker image inspect -f '{{.Config.User}}' $IMAGE)\" = node\n  ⏱ 0.1 s · mã thoát 0\n▶ run: echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env …\n  ⏱ 66.3 s · mã thoát 0\n▶ run: docker compose run --rm seed\n   seed: tài khoản = 3 · phòng = 3\n  ⏱ 6.2 s · mã thoát 0\n▶ run: npm ci --prefix cham\n  ⏱ 1.2 s · mã thoát 0\n▶ run: set -a; . ./.env; set +a …\n   ✓ B1 [Bảo mật] đặt lịch không token ⇒ 401 — nhận 401\n   ✓ B2 [Bảo mật] mass assignment (status, userId trong body) ⇒ 400 — nhận 400\n   ✓ B3 [Bảo mật] Bình xem lịch của An ⇒ 404 — nhận 404\n   ✓ B4 [Bảo mật] Bình huỷ lịch của An ⇒ 404 — nhận 404\n   ✓ B5 [Bảo mật] sinh viên tự duyệt lịch mình ⇒ 403 — nhận 403\n   ✓ L1 [Lõi] 50 request đồng thời cùng khung ⇒ đúng một 201 — {\"201\":1,\"409\":49}\n   ✓ L2 [Lõi] giảng viên duyệt lịch phòng KHÔNG phụ trách ⇒ 404 — nhận 404\n   ✓ L3 [Lõi] duyệt ⇒ APPROVED; duyệt lần hai ⇒ 403 — nhận 200 APPROVED, rồi 403\n   ✓ L4 [Lõi] đặt 02:00 (ngoài giờ mở cửa 07:00–21:00) ⇒ 400 — nhận 400\n   ✓ L5 [Lõi] đặt giờ mở cửa: SV ⇒ 403, admin ⇒ 200 — nhận 403, 200\n   ✓ L6 [Lõi] một SV giữ 6 khung chờ duyệt liên tiếp ⇒ chỉ 3 được nhận — 201 201 201 409 409 409\n   ✓ L7 [Lõi] một SV bắn 10 khung khác nhau CÙNG LÚC ⇒ chỉ 3 được nhận — {\"201\":3,\"409\":7}\n   ✓ T1 [Thời gian thực] socket không token ⇒ bị từ chối — từ chối (unauthorized)\n   ✓ T2 [Thời gian thực] người xem phòng thấy lịch mới qua socket ≤ 3 s — nhận slot #59 PENDING sau 50 ms\n   ✓ T3 [Bất đồng bộ] duyệt ⇒ đúng MỘT email \"đã được duyệt\" trong 10 s — 1 email sau 223 ms\n   KẾT QUẢ: 15/15 đạt\n  ⏱ 3.7 s · mã thoát 0\n✓ job anh XANH";
const OUT_LIST = {"src/notifications/moc9.e2e.spec.ts":4,"src/common/moc4.e2e.spec.ts":5,"src/bookings/dac-ta.e2e.spec.ts":6,"src/common/pipeline.e2e.spec.ts":4,"src/common/moc7.e2e.spec.ts":10,"src/common/moc5.e2e.spec.ts":2,"src/notifications/moc12.e2e.spec.ts":3,"src/bookings/moc12.e2e.spec.ts":8,"src/health/moc11.e2e.spec.ts":5,"src/common/moc6.e2e.spec.ts":3,"src/realtime/moc10.e2e.spec.ts":5,"src/bookings/bookings.service.db.spec.ts":3,"src/config/env.schema.spec.ts":5,"src/auth/redis-throttler.storage.spec.ts":2,"src/bookings/luat/gio-mo-cua.spec.ts":5};
const MA_README = "## Rules the system guarantees\n\n| Rule | Enforced by |\n|---|---|\n| Two active bookings of one room never overlap | PostgreSQL `EXCLUDE USING gist` constraint (`bookings_khong_trung`) — not application code |\n| Bookings fit the room's opening hours (Vietnam time, UTC+7) | `ngoaiGioMoCua()` in `src/bookings/luat/` + `CHECK` on `rooms` |\n| At most 3 pending requests per user, even under concurrent requests | transaction + `pg_advisory_xact_lock(1, userId)` |\n| Only the owner (or an admin) sees and cancels a booking; only the room's lecturer approves | CASL policy `src/auth/booking.policy.ts`; hidden ⇒ 404, visible but not allowed ⇒ 403 |\n| Unknown body fields are rejected (no mass assignment) | global `ValidationPipe({ whitelist, forbidNonWhitelisted })` |\n| An approval sends exactly one email, even if the worker crashes mid-job | job id + `email_log` primary key + provider idempotency key |\n\n## Run it (one command)\n\nRequirements: Docker 24+ with Compose v2.\n\n```bash\ncp .env.example .env          # then set JWT_SECRET and SEED_PASSWORD\ndocker compose up -d --build --wait\ndocker compose run --rm seed  # demo accounts and rooms (optional)\ncurl -s http://127.0.0.1:42150/rooms\n```\n\nThe stack: `db`, `redis`, one-shot `migrate`, two API replicas (`api1`, `api2`), a `worker` for queued jobs, and `nginx` on port 42150. `/health/*` is only reachable inside the Docker network.";

const MAP = [
  ['US-01', 'common/moc7.e2e (10)'], ['US-02', 'common/moc4.e2e (5), realtime/moc10.e2e'], ['US-03', 'bookings.service.db (3), common/moc6.e2e (3)'],
  ['US-04', 'common/moc7.e2e'], ['US-05', 'luat/gio-mo-cua.spec (5, unit), bookings/moc12.e2e (4)'], ['US-06', 'bookings/moc12.e2e (4)'],
  ['US-07', 'bookings/dac-ta.e2e (6)'], ['US-08', 'notifications/moc9.e2e (4), notifications/moc12.e2e (3)'], ['US-09', 'realtime/moc10.e2e (5)'],
  ['US-10', 'health/moc11.e2e (5), config/env.schema.spec (5), common/pipeline.e2e (4), common/moc5.e2e (2), auth/redis-throttler.storage.spec (2)'],
];
const bangMap = (vi) => `<table>
<thead><tr><th>Story</th><th>${vi ? 'Tệp test (số test)' : 'Test files (count)'}</th><th>${vi ? 'Bộ chấm' : 'Grader'}</th></tr></thead>
<tbody>
${MAP.map(([us, f], i) => `<tr><td>${us}</td><td><code>${f}</code></td><td>${['B1 B2', '—', 'L1', 'L2 L3', 'L4 L5', 'L6 L7', '—', 'T3', 'T1 T2', '—'][i]}</td></tr>`).join('\n')}
</tbody>
</table>`;

export default {
  title: '12.5 — Tests, Docker and CI for the capstone|||12.5 — Test, Docker và CI cho dự án cuối',
  slug: 'nst-12-5-kiem-thu-trien-khai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gom 70 test theo 10 user story, thêm dịch vụ seed vào compose (và gặp bẫy ${VAR:?} làm hỏng cả stack dù profile chưa bật), viết README tiếng Anh, rồi cho CI chạy chính bộ chấm của hội đồng trên stack vừa dựng: dựng ảnh 46 giây, compose 66 giây, 15/15 qua nginx và hai bản API. Chạy bằng bộ chạy CI cục bộ, ghi rõ không phải GitHub.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 5</span>
<h2>12.5 — The brief becomes a CI step</h2>
<p class="lead">Rubric: "Tests: unit + e2e, run in CI" (15 points) and "Operations: docker compose up on a clean machine" (10). Both are about proof, not effort. This lesson maps every user story to tests, makes the stack start with one command including demo data, and adds the panel's grader to CI so every push re-runs the acceptance check on a freshly built stack.</p>

<h3>Everyday analogy: the handover of a new flat</h3>
<p>At handover the owner does not read the builder's diary; they walk through, switch on every light and run every tap. The grader is that walk-through, done by a script on every push — and the README is the sheet on the door that tells the next person where the main switch is.</p>

<h3>1. Seventy tests, ten stories</h3>
${bangMap(false)}
<p>Totals: 10 unit tests (no infrastructure, milliseconds), 60 tests against real PostgreSQL + Redis (one database per worker, 8.3), and 15 grader checks against a running stack. A story with no test (none here) would be the first thing to fix; a test that maps to no story is either infrastructure (US-10) or dead weight.</p>

<h3>2. One command — plus demo data</h3>
<p>The panel needs accounts to try things. A <code>seed</code> service in a profile runs only when asked:</p>
<pre><code class="language-yaml">${esc(MA_SEED)}</code></pre>
<p>The first version required the password with <code>\${SEED_PASSWORD:?…}</code>. Result:</p>
<pre><code class="language-text">${esc(OUT_PROFILE)}</code></pre>
<p>Compose interpolates <strong>every</strong> service, including those in profiles that are not enabled — so a reviewer without <code>SEED_PASSWORD</code> could not even run <code>docker compose up</code>. The check moved to where it belongs: <code>seed.ts</code> refuses to run without a 12+ character password. Variables are documented in <code>.env.example</code> (the only env file in git):</p>
<pre><code class="language-bash">${esc(MA_ENVEX)}</code></pre>

<h3>3. CI runs the grader</h3>
<pre><code class="language-yaml">${esc(MA_CI_ANH)}</code></pre>
<p>Run with the local CI runner from 11.3 (same YAML; jobs in <code>node:22</code> containers, services sharing the job's network; <code>anh</code> runs on the host because it needs Docker). <em>This is a reproduction for learning, not GitHub Actions.</em></p>
<pre><code class="language-text">${esc(OUT_KIEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_E2E)}</code></pre>
<pre><code class="language-text">${esc(OUT_ANH)}</code></pre>
<p>Every check passed through nginx, with requests spread over two API replicas — so T2 (a socket on one replica sees a booking created via the other) also proves the Redis adapter from 10.2. Building took 46 s and bringing the stack to healthy 66 s. The secrets in CI are generated per run (<code>openssl rand</code>); nothing secret is stored in the repository or the workflow.</p>

<h3>4. README in English</h3>
<p>Reviewers, recruiters and future teammates read the README first, and most of them read English. Lead with what the system <em>guarantees</em> and how, then how to run it:</p>
<pre><code class="language-markdown">${esc(MA_README)}</code></pre>

<h3>🧪 Exercise (45 min)</h3>
<ol>
<li>Make your own story ↔ test table. Any story without a test? Write it.</li>
<li>Add a <code>seed</code> profile and run <code>docker compose config -q</code> <em>without</em> the seed variable set — it must still succeed.</li>
<li>Add your grader to the image job of your CI. Break one rule (e.g. remove a guard) and confirm the job goes red at the grader step, not earlier.</li>
</ol>
<details><summary>Show what a red grader step looks like</summary>
<p>The grader exits with code 1 when any check fails and prints the failed ids on the last line (<code>KẾT QUẢ: 14/15 đạt — trượt: B4</code>). Because the step runs after <code>docker compose up --wait</code>, a red here means "the system runs but breaks a rule" — a different message from a red build or a red e2e job, and the <code>if: failure()</code> step prints the container logs to read next.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"What does your CI do?"</strong> — Three jobs: static checks + unit + contract diff; e2e with PostgreSQL and Redis services; build the image, start the stack, run the acceptance script.</li>
<li><strong>"How do you test something that needs two replicas?"</strong> — Run the real topology in CI (compose with nginx and two APIs) and check behaviour from outside.</li>
<li><strong>"Where are your secrets?"</strong> — Not in git: <code>.env.example</code> documents names; CI generates throwaway values; production uses the platform's secret store.</li>
</ol>

<h3>💼 On the job</h3>
<p>In many outsourcing projects the customer runs an acceptance test (UAT) before paying a milestone. Teams that automate the UAT checklist and run it in CI rarely have surprises at UAT — and when the customer reports "it doesn't work", the first answer is the link to the green run on the same commit.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Compose profile</span><span class="v">A label that keeps a service off unless <code>--profile</code> or <code>run</code> names it.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Compose replacing <code>\${VAR}</code> in the whole file before starting anything.</span></div>
  <div class="kv"><span class="k">UAT</span><span class="v">User acceptance testing — the customer's check before accepting a delivery.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>70 tests mapped to 10 stories; 15 grader checks on a live stack.</li>
<li>Seed as a compose profile; <code>\${VAR:?}</code> in a profile service breaks <code>up</code> for everyone.</li>
<li>CI: kiem (with contract diff) ✓, e2e 58 ✓, anh: build 46 s, up 66 s, grader 15/15 through nginx + 2 replicas.</li>
<li>English README that starts with guarantees.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 5</span>
<h2>12.5 — Đề bài trở thành một bước CI</h2>
<p class="lead">Rubric: "Test: đơn vị + e2e, chạy trong CI" (15 điểm) và "Vận hành: docker compose up trên máy sạch" (10). Cả hai đều chấm bằng chứng, không chấm công sức. Bài này gắn mọi user story vào test, cho stack chạy bằng một lệnh kèm dữ liệu demo, và đưa bộ chấm của hội đồng vào CI để mỗi lần đẩy mã lại nghiệm thu trên một stack dựng mới.</p>

<h3>Liên hệ đời thường: nhận bàn giao căn hộ mới</h3>
<p>Lúc nhận bàn giao, chủ nhà không đọc nhật ký của thợ; họ đi một vòng, bật từng bóng đèn, mở từng vòi nước. Bộ chấm chính là vòng đi đó, do một script làm mỗi lần đẩy mã — còn README là tờ giấy dán cửa cho người sau biết cầu dao tổng ở đâu.</p>

<h3>1. Bảy mươi test, mười câu chuyện</h3>
${bangMap(true)}
<p>Tổng: 10 test đơn vị (không cần hạ tầng, tính bằng mili giây), 60 test chạy trên PostgreSQL + Redis thật (mỗi worker một cơ sở dữ liệu, bài 8.3), và 15 mục của bộ chấm chạy trên stack đang chạy. Câu chuyện nào chưa có test (ở đây không có) là thứ phải sửa đầu tiên; test nào không gắn với câu chuyện nào thì hoặc là hạ tầng (US-10), hoặc là đồ thừa.</p>

<h3>2. Một lệnh — cộng dữ liệu demo</h3>
<p>Hội đồng cần tài khoản để thử. Một dịch vụ <code>seed</code> nằm trong profile, chỉ chạy khi được gọi:</p>
<pre><code class="language-yaml">${esc(MA_SEED)}</code></pre>
<p>Bản đầu bắt buộc mật khẩu bằng <code>\${SEED_PASSWORD:?…}</code>. Kết quả:</p>
<pre><code class="language-text">${esc(OUT_PROFILE)}</code></pre>
<p>Compose nội suy <strong>mọi</strong> dịch vụ, kể cả dịch vụ thuộc profile chưa bật — nên người chấm không có <code>SEED_PASSWORD</code> thì đến <code>docker compose up</code> cũng không chạy được. Phép kiểm được dời về đúng chỗ: <code>seed.ts</code> tự từ chối khi thiếu mật khẩu từ 12 ký tự. Các biến được ghi trong <code>.env.example</code> (tệp env duy nhất nằm trong git):</p>
<pre><code class="language-bash">${esc(MA_ENVEX)}</code></pre>

<h3>3. CI chạy bộ chấm</h3>
<pre><code class="language-yaml">${esc(MA_CI_ANH)}</code></pre>
<p>Chạy bằng bộ chạy CI cục bộ từ bài 11.3 (cùng tệp YAML; job chạy trong container <code>node:22</code>, service dùng chung mạng với job; <code>anh</code> chạy trên máy vì cần Docker). <em>Đây là bản tái lập để học, không phải GitHub Actions.</em></p>
<pre><code class="language-text">${esc(OUT_KIEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_E2E)}</code></pre>
<pre><code class="language-text">${esc(OUT_ANH)}</code></pre>
<p>Mọi mục đều đi qua nginx, request được chia cho hai bản API — nên T2 (socket nối vào một bản thấy lịch tạo qua bản kia) cũng chứng minh luôn Redis adapter của bài 10.2. Dựng ảnh mất 46 giây, đưa stack tới trạng thái healthy mất 66 giây. Bí mật trong CI sinh mới mỗi lượt (<code>openssl rand</code>); không có gì bí mật nằm trong repo hay trong workflow.</p>

<h3>4. README tiếng Anh</h3>
<p>Người chấm, nhà tuyển dụng và đồng đội tương lai đọc README đầu tiên, và phần lớn họ đọc tiếng Anh. Mở đầu bằng những gì hệ thống <em>bảo đảm</em> và bảo đảm bằng cách nào, rồi mới tới cách chạy:</p>
<pre><code class="language-markdown">${esc(MA_README)}</code></pre>

<h3>🧪 Thực hành (45 phút)</h3>
<ol>
<li>Lập bảng câu chuyện ↔ test của bạn. Có câu chuyện nào chưa có test? Viết nó.</li>
<li>Thêm profile <code>seed</code> và chạy <code>docker compose config -q</code> khi <em>chưa</em> đặt biến của seed — lệnh vẫn phải thành công.</li>
<li>Thêm bộ chấm vào job dựng ảnh trong CI của bạn. Phá một luật (ví dụ gỡ một guard) và xác nhận job đỏ đúng ở bước chấm, không đỏ sớm hơn.</li>
</ol>
<details><summary>Xem bước chấm đỏ trông thế nào</summary>
<p>Bộ chấm thoát với mã 1 khi có mục trượt và in id các mục trượt ở dòng cuối (<code>KẾT QUẢ: 14/15 đạt — trượt: B4</code>). Vì bước này chạy sau <code>docker compose up --wait</code>, đỏ ở đây nghĩa là "hệ thống chạy nhưng phá luật" — khác hẳn thông điệp của build đỏ hay job e2e đỏ, và bước <code>if: failure()</code> in log container để đọc tiếp.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"CI của bạn làm gì?"</strong> — Ba job: kiểm tĩnh + test đơn vị + so hợp đồng; e2e với service PostgreSQL và Redis; dựng ảnh, bật stack, chạy script nghiệm thu.</li>
<li><strong>"Test thứ cần hai bản chạy song song thế nào?"</strong> — Dựng đúng mô hình thật trong CI (compose có nginx và hai API) và kiểm hành vi từ bên ngoài.</li>
<li><strong>"Bí mật của bạn để ở đâu?"</strong> — Không trong git: <code>.env.example</code> ghi tên biến; CI sinh giá trị dùng một lần; production dùng kho bí mật của nền tảng.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở nhiều dự án outsourcing, khách hàng chạy nghiệm thu (UAT) trước khi thanh toán một mốc. Nhóm nào tự động hoá danh sách UAT và chạy nó trong CI thì hiếm khi bất ngờ lúc UAT — và khi khách báo "không chạy", câu trả lời đầu tiên là đường dẫn tới lượt CI xanh trên đúng commit đó.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profile của Compose</span><span class="v">Nhãn giữ một dịch vụ tắt, trừ khi <code>--profile</code> hoặc <code>run</code> gọi tên nó.</span></div>
  <div class="kv"><span class="k">Nội suy</span><span class="v">Compose thay <code>\${VAR}</code> trong toàn bộ tệp trước khi chạy bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k">UAT</span><span class="v">Nghiệm thu của người dùng — khách hàng kiểm trước khi nhận bàn giao.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>70 test gắn với 10 câu chuyện; 15 mục chấm trên stack đang chạy.</li>
<li>Seed là một profile compose; <code>\${VAR:?}</code> ở dịch vụ thuộc profile làm hỏng <code>up</code> của mọi người.</li>
<li>CI: kiem (có so hợp đồng) ✓, e2e 58 ✓, anh: dựng 46 giây, bật 66 giây, chấm 15/15 qua nginx + 2 bản API.</li>
<li>README tiếng Anh mở đầu bằng những điều được bảo đảm.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
