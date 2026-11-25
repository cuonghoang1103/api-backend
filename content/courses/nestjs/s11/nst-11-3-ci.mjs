/**
 * 11.3 — CI với GitHub Actions: lint, test đơn vị, e2e với dịch vụ Postgres, build image (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: moc11/.github/workflows/ci.yml chạy bằng lab/c11/ci-cuc-bo.py trên máy nhà (job trong node:22, service gắn chung
 * network namespace với job như runner GitHub; job anh chạy trên máy nhà). KHÔNG phải lượt chạy trên GitHub — bài ghi rõ.
 * ⇒ lab/c11/o/113-*.txt. Nguồn đã GET 24/11/2026: GHSA-mrrh-fwg8-r2c3 (tj-actions/changed-files, CVE-2025-30066).
 * Ghép: gen.mjs rồi ghep.sh 113 nst-11-3-ci.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions 15.1 — CI cho pull request: bốn job, một Postgres thật', sub: 'Toàn bộ nền CI; bài này chỉ thêm phần riêng của một dự án Nest + Prisma.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-13-3-bao-mat-self-hosted', title: 'GitHub Actions 13.3 — Container job và service container', sub: 'Service container chạy thế nào trên runner.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-1-1-la-yaml', title: 'GitHub Actions 1.1 — Nó là YAML, và bẫy nằm ở đó', sub: 'Bẫy YAML gặp thật ở bài này: ${{ }} trong mapping dạng { }.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-4-2-ghim', title: 'GitHub Actions 4.2 — @v4 là một con trỏ, không phải một phiên bản', sub: 'Ghim action theo SHA — bài học của vụ tj-actions 2025.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'GitHub Actions 14.1 — Check bắt buộc và ruleset', sub: 'Chặn merge khi CI đỏ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-8-3-e2e', title: 'NestJS 8.3 — Test e2e', sub: 'Bộ test db mà job e2e chạy.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🛡', 'GitHub Advisory GHSA-mrrh-fwg8-r2c3 — tj-actions/changed-files (CVE-2025-30066)', '14–15/03/2025: tag phiên bản bị trỏ lại vào commit độc, in bí mật CI ra log của hơn 23.000 repo; vá ở 46.0.1.', 'https://github.com/advisories/GHSA-mrrh-fwg8-r2c3'),
  nguon('📘', 'GitHub Docs — About service containers', 'services:, ports, options truyền cho docker create.', 'https://docs.github.com/en/actions/use-cases-and-examples/using-containerized-services/about-service-containers'),
].join('\n');
const MA_CI = "# ci.yml — lab-booking: mỗi push / pull request ⇒ kiểm tĩnh + test đơn vị, e2e với Postgres + Redis thật, rồi dựng ảnh và chạy thử\nname: ci\non:\n  push: { branches: [main] }\n  pull_request:\npermissions: { contents: read }\nconcurrency:                 # ${{ }} trong mapping dạng { … } làm vỡ YAML ⇒ viết dạng khối\n  group: ci-${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  kiem:\n    runs-on: ubuntu-24.04\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-node@v5\n        with: { node-version: 22, cache: npm }\n      - run: npm ci\n      - run: DATABASE_URL=postgresql://ci:ci@localhost:5432/ci npx prisma generate\n      - run: npm run lint\n      - run: npm run typecheck\n      - run: npm run test:unit\n\n  e2e:\n    runs-on: ubuntu-24.04\n    timeout-minutes: 15\n    services:\n      postgres:\n        image: postgres:16\n        env: { POSTGRES_USER: ci, POSTGRES_PASSWORD: ci, POSTGRES_DB: lab_test }\n        ports: ['5432:5432']\n        options: >-\n          --health-cmd \"pg_isready -U ci\" --health-interval 2s --health-timeout 5s --health-retries 20\n      redis:\n        image: redis:7-alpine\n        ports: ['6379:6379']\n        options: >-\n          --health-cmd \"redis-cli ping\" --health-interval 2s --health-timeout 5s --health-retries 20\n    env:\n      DATABASE_URL_TEST: postgresql://ci:ci@localhost:5432/lab_test\n      REDIS_URL_TEST: redis://localhost:6379\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-node@v5\n        with: { node-version: 22, cache: npm }\n      - run: npm ci\n      - run: DATABASE_URL=$DATABASE_URL_TEST npx prisma generate\n      - run: npm run test:db\n\n  anh:\n    needs: [kiem, e2e]\n    runs-on: ubuntu-24.04\n    timeout-minutes: 15\n    steps:\n      - uses: actions/checkout@v5\n      - uses: docker/setup-buildx-action@v3\n      - run: docker build -t lab-booking:${{ github.sha }} .\n      - run: test \"$(docker image inspect -f '{{.Config.User}}' lab-booking:${{ github.sha }})\" = node\n      - run: |\n          echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env\n          IMAGE=lab-booking:${{ github.sha }} docker compose up -d --wait --wait-timeout 120\n          docker compose exec -T api1 wget -qO- http://127.0.0.1:3000/health/ready   # /health/ bị nginx chặn từ ngoài (404)\n          curl -fsS http://127.0.0.1:42150/rooms\n      - if: failure()\n        run: docker compose logs --no-color --tail 80";
const MA_RUN = "#!/usr/bin/env python3\n\"\"\"ci-cuc-bo.py <job> — chạy MỘT job của moc11/.github/workflows/ci.yml trên máy nhà, bám sát cách runner GitHub làm:\n- checkout = chép cây mã TRỪ những gì .gitignore loại (giống git clone: không node_modules, dist, src/generated, .env)\n- job chạy trong container node:22 (Debian/glibc như ubuntu-24.04); services = container gắn CHUNG network namespace\n  với job ⇒ 'localhost:5432' đúng như trên runner; chuỗi 'options' truyền thẳng cho docker run (GitHub cũng làm vậy)\n- mỗi 'run' chạy bằng bash -e -o pipefail; bước hỏng ⇒ dừng job (như GitHub). 'uses' không chạy được ⇒ ghi rõ.\nĐây là bản TÁI LẬP để học, không phải GitHub Actions.\"\"\"\nimport os, shlex, subprocess as sp, sys, time, yaml\nGOC = os.path.expanduser('~/vbg-dp/scratchpad/nst/lab/c11/moc11')\njob_ten = sys.argv[1]\nwf = yaml.safe_load(open(f'{GOC}/.github/workflows/ci.yml'))\njob = wf['jobs'][job_ten]\nws = os.path.expanduser(f'~/.rtq-nst/ci/{job_ten}')\nSHA = 'c11local'\ndef sh(cmd, **kw): return sp.run(cmd, shell=isinstance(cmd, str), **kw)\ndef don():\n    sh(['docker', 'rm', '-f', f'nst-ci-{job_ten}', *[f'nst-ci-{job_ten}-{s}' for s in job.get('services', {})]], capture_output=True)\ndon(); sh(['rm', '-rf', ws]); os.makedirs(ws)\nsh(['rsync', '-a', '--filter=:- .gitignore', '--exclude', 'node_modules', f'{GOC}/', ws + '/'], check=True)\nprint(f'▶ checkout: {sum(len(f) for _, _, f in os.walk(ws))} tệp (đã bỏ thứ .gitignore loại)')\nenv = {'CI': 'true', 'NO_COLOR': '1', **{k: str(v) for k, v in (job.get('env') or {}).items()}}   # runner GitHub đặt CI=true\nTREN_MAY = os.environ.get('TREN_MAY') == '1'   # job cần docker (dựng ảnh, compose) ⇒ chạy bước trên máy nhà, trong thư mục checkout\nif not TREN_MAY: sh(['docker', 'run', '-d', '--name', f'nst-ci-{job_ten}', '--user', f'{os.getuid()}:{os.getgid()}', '-e', 'HOME=/tmp',\n    '-v', f'{ws}:/w', '-w', '/w', 'node:22', 'sleep', 'infinity'], check=True, capture_output=True)\nfor ten, s in (job.get('services') or {}).items():\n    cmd = ['docker', 'run', '-d', '--name', f'nst-ci-{job_ten}-{ten}', '--network', f'container:nst-ci-{job_ten}']\n    for k, v in (s.get('env') or {}).items(): cmd += ['-e', f'{k}={v}']\n    if os.environ.get('BO_HEALTH'): cmd += [s['image']]; sh(cmd, check=True, capture_output=True); print(f'▶ service {ten}: THỬ PHÁ — bỏ options health, không chờ'); continue\n    cmd += shlex.split(s.get('options', '')) + [s['image']]\n    sh(cmd, check=True, capture_output=True); t = time.time()\n    while sh(['docker', 'inspect', '-f', '{{.State.Health.Status}}', f'nst-ci-{job_ten}-{ten}'], capture_output=True, text=True).stdout.strip() != 'healthy':\n        time.sleep(0.5)\n    print(f'▶ service {ten} ({s[\"image\"]}) healthy sau {time.time() - t:.1f} s')\nok = True\nfor st in job['steps']:\n    if 'uses' in st:\n        u = st['uses']\n        if u.startswith('actions/setup-node'):\n            v = sh(['docker', 'exec', f'nst-ci-{job_ten}', 'node', '-v'], capture_output=True, text=True).stdout.strip()\n            print(f'▶ {u}: ảnh node:22 có sẵn {v} (cache npm của GitHub không tái lập)')\n        else: print(f'▶ {u}: {\"đã làm ở trên\" if \"checkout\" in u else \"bỏ qua khi chạy cục bộ\"}')\n        continue\n    if st.get('if') == 'failure()':\n        if ok: continue\n    elif not ok: continue                         # job đã đỏ: GitHub bỏ các bước thường, vẫn chạy bước if: failure()\n    lenh = st['run'].replace('${{ github.sha }}', SHA).rstrip()\n    if os.environ.get('BO_BUOC') and os.environ['BO_BUOC'] in lenh: print(f'▶ run: {lenh} — THỬ PHÁ: bỏ bước này'); continue\n    print(f'▶ run: {lenh.splitlines()[0]}{\" …\" if len(lenh.splitlines()) > 1 else \"\"}', flush=True); t = time.time()\n    e = sum((['-e', f'{k}={v}'] for k, v in env.items()), [])\n    r = (sh(['bash', '-e', '-o', 'pipefail', '-c', lenh], cwd=ws, env={**os.environ, **env}, capture_output=True, text=True) if TREN_MAY\n         else sh(['docker', 'exec', *e, f'nst-ci-{job_ten}', 'bash', '-e', '-o', 'pipefail', '-c', lenh], capture_output=True, text=True))\n    out = (r.stdout + r.stderr).rstrip().splitlines()\n    for l in out[-int(os.environ.get('DUOI', 6)):]: print('   ' + l)\n    print(f'  ⏱ {time.time() - t:.1f} s · mã thoát {r.returncode}')\n    if r.returncode and ok: ok = False; print(f'✗ job {job_ten} ĐỎ ở bước trên')\nif ok: print(f'✓ job {job_ten} XANH')\nif TREN_MAY: sp.run('docker compose down -v --remove-orphans', shell=True, cwd=ws, capture_output=True)\ndon(); sh(['rm', '-rf', ws])\nsys.exit(0 if ok else 1)";
const OUT_YAML = "            \"expected ',' or '}', but got %r\" % token.id, token.start_mark)\nyaml.parser.ParserError: while parsing a flow mapping\n  in \".github/workflows/ci.yml\", line 7, column 14\nexpected ',' or '}', but got '{'\n  in \".github/workflows/ci.yml\", line 7, column 27";
const OUT_KIEM = "▶ checkout: 89 tệp (đã bỏ thứ .gitignore loại)\n▶ actions/checkout@v5: đã làm ở trên\n▶ actions/setup-node@v5: ảnh node:22 có sẵn v22.23.5 (cache npm của GitHub không tái lập)\n▶ run: npm ci\n  ⏱ 20.4 s · mã thoát 0\n▶ run: DATABASE_URL=postgresql://ci:ci@localhost:5432/ci npx prisma generate\n  ⏱ 0.9 s · mã thoát 0\n▶ run: npm run lint\n  ⏱ 0.4 s · mã thoát 0\n▶ run: npm run typecheck\n  ⏱ 1.8 s · mã thoát 0\n▶ run: npm run test:unit\n         Tests  5 passed (5)\n  ⏱ 0.5 s · mã thoát 0\n✓ job kiem XANH";
const OUT_E2E = "▶ checkout: 89 tệp (đã bỏ thứ .gitignore loại)\n▶ service postgres (postgres:16) healthy sau 2.6 s\n▶ service redis (redis:7-alpine) healthy sau 2.0 s\n▶ actions/checkout@v5: đã làm ở trên\n▶ actions/setup-node@v5: ảnh node:22 có sẵn v22.23.5 (cache npm của GitHub không tái lập)\n▶ run: npm ci\n  ⏱ 16.7 s · mã thoát 0\n▶ run: DATABASE_URL=$DATABASE_URL_TEST npx prisma generate\n  ⏱ 1.1 s · mã thoát 0\n▶ run: npm run test:db\n         Tests  46 passed (46)\n  ⏱ 6.7 s · mã thoát 0\n✓ job e2e XANH";
const OUT_GEN = "▶ checkout: 89 tệp (đã bỏ thứ .gitignore loại)\n▶ actions/checkout@v5: đã làm ở trên\n▶ actions/setup-node@v5: ảnh node:22 có sẵn v22.23.5 (cache npm của GitHub không tái lập)\n▶ run: npm ci\n  ⏱ 19.7 s · mã thoát 0\n▶ run: DATABASE_URL=postgresql://ci:ci@localhost:5432/ci npx prisma generate — THỬ PHÁ: bỏ bước này\n▶ run: npm run lint\n  ⏱ 0.8 s · mã thoát 0\n▶ run: npm run typecheck\n   src/realtime/availability.gateway.ts(44,30): error TS2339: Property 'booking' does not exist on type 'PrismaService'.\n   src/realtime/availability.gateway.ts(48,39): error TS7006: Parameter 'b' implicitly has an 'any' type.\n   src/realtime/ws-auth.ts(24,29): error TS2339: Property 'user' does not exist on type 'PrismaService'.\n   src/rooms/rooms.service.ts(17,20): error TS2339: Property 'room' does not exist on type 'PrismaService'.\n   src/rooms/rooms.service.ts(17,117): error TS7006: Parameter 'e' implicitly has an 'any' type.";
const OUT_HEALTH = "▶ checkout: 89 tệp (đã bỏ thứ .gitignore loại)\n▶ service postgres: THỬ PHÁ — bỏ options health, không chờ\n▶ service redis: THỬ PHÁ — bỏ options health, không chờ\n▶ actions/checkout@v5: đã làm ở trên\n▶ actions/setup-node@v5: ảnh node:22 có sẵn v22.23.5 (cache npm của GitHub không tái lập)\n▶ run: npm ci\n  ⏱ 19.5 s · mã thoát 0\n▶ run: DATABASE_URL=$DATABASE_URL_TEST npx prisma generate\n  ⏱ 1.4 s · mã thoát 0\n▶ run: npm run test:db\n         Tests  46 passed (46)\n  ⏱ 7.5 s · mã thoát 0\n✓ job e2e XANH";
const OUT_ANH_DO = "▶ checkout: 91 tệp (đã bỏ thứ .gitignore loại)\n▶ actions/checkout@v5: đã làm ở trên\n▶ docker/setup-buildx-action@v3: bỏ qua khi chạy cục bộ\n▶ run: docker build -t lab-booking:c11local .\n  ⏱ 31.7 s · mã thoát 0\n▶ run: test \"$(docker image inspect -f '{{.Config.User}}' lab-booking:c11local)\" = node\n  ⏱ 0.1 s · mã thoát 0\n▶ run: echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env …\n   curl: (22) The requested URL returned error: 404\n  ⏱ 19.7 s · mã thoát 22\n✗ job anh ĐỎ ở bước trên";
const OUT_ANH = "▶ checkout: 91 tệp (đã bỏ thứ .gitignore loại)\n▶ actions/checkout@v5: đã làm ở trên\n▶ docker/setup-buildx-action@v3: bỏ qua khi chạy cục bộ\n▶ run: docker build -t lab-booking:c11local .\n  ⏱ 2.2 s · mã thoát 0\n▶ run: test \"$(docker image inspect -f '{{.Config.User}}' lab-booking:c11local)\" = node\n  ⏱ 0.0 s · mã thoát 0\n▶ run: echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env …\n  ⏱ 13.4 s · mã thoát 0\n✓ job anh XANH";

export default {
  title: '11.3 — CI with GitHub Actions: lint, unit, e2e with a Postgres service, build image|||11.3 — CI với GitHub Actions: lint, test đơn vị, e2e với dịch vụ Postgres, build image',
  slug: 'nst-11-3-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một workflow ba job cho lab-booking: kiem (lint oxlint, tsc, test đơn vị), e2e (Postgres 16 + Redis 7 làm service, 46 test), anh (docker build, kiểm USER, compose --wait, smoke test). Chạy thật bằng một bộ chạy tự viết đọc chính tệp YAML. Ba lần đỏ có thật: YAML vỡ vì ${{ }} trong mapping dạng { }; thiếu prisma generate ⇒ TS2307 vì src/generated nằm trong .gitignore; smoke test gọi /health/ready qua nginx ⇒ 404. Và một lần "thử phá" vẫn xanh — kèm lý do.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>11.3 — A CI pipeline for lab-booking, and the three times it went red for real reasons</h2>
<p class="lead">How GitHub Actions works — triggers, runners, caching, secrets, required checks — is the GitHub Actions course (links below). This lesson writes the workflow for <em>this</em> project and focuses on what is specific to Nest + Prisma + Vitest: generating the Prisma client on a clean checkout, a real PostgreSQL and Redis for the <code>db</code> project, and a smoke test of the image built in 11.1.</p>

<h3>Honest note: how this workflow was run</h3>
<p>The home machine cannot run GitHub's hosted runners. Instead of pasting a workflow nobody executed, <code>ci-cuc-bo.py</code> reads <code>ci.yml</code> and runs each job the way the runner does: a fresh checkout without anything <code>.gitignore</code> excludes, the job inside <code>node:22</code> (Debian/glibc like <code>ubuntu-24.04</code>), service containers sharing the job's network namespace so <code>localhost:5432</code> works exactly as on GitHub, the <code>options</code> string passed straight to <code>docker run</code> (GitHub does the same), every <code>run</code> under <code>bash -e -o pipefail</code>, <code>if: failure()</code> steps still executed after a red step. What it cannot reproduce: GitHub's npm cache, the hosted runner's speed, <code>concurrency</code>. Push the same file to a GitHub repo and it runs unchanged.</p>

<h3>Everyday analogy: the quality gate at a factory exit</h3>
<p>Every pallet passes the same three checks before the truck: labels correct (lint, types), each part works (unit tests), the assembled product works with real power and water (e2e with a real DB), and the boxed product starts when plugged in (image smoke test). A worker's word "it worked on my bench" does not open the gate.</p>

<h3>1. The workflow</h3>
<pre><code class="language-yaml">${esc(MA_CI)}</code></pre>
<ul>
<li><strong>kiem</strong> needs no database: lint, <code>tsc --noEmit</code>, the <code>unit</code> Vitest project — the fastest feedback.</li>
<li><strong>e2e</strong> runs the <code>db</code> project (8.3) against service containers; the health options make the runner wait until PostgreSQL and Redis answer.</li>
<li><strong>anh</strong> runs only when both pass: builds the image, asserts it runs as <code>node</code>, starts the whole Compose stack with <code>--wait</code> and calls the API through the load balancer.</li>
<li><code>prisma generate</code> appears in two jobs because each job is a fresh machine and <code>src/generated</code> is not in git.</li>
</ul>

<h3>2. Green runs</h3>
<pre><code class="language-text">${esc(OUT_KIEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_E2E)}</code></pre>

<h3>3. Red run #1 — the YAML did not parse</h3>
<p>The first version had <code>concurrency: { group: ci-\${{ github.ref }}, cancel-in-progress: true }</code>:</p>
<pre><code class="language-text">${esc(OUT_YAML)}</code></pre>
<p>Inside a flow mapping <code>{ … }</code>, the <code>{</code> of <code>\${{</code> starts another mapping. Block style fixes it. The same trap hit <code>compose.yaml</code> in 11.5 with <code>\${GRACE:-3000}</code>. (Side note: PyYAML reads the key <code>on</code> as boolean <code>True</code> — YAML 1.1; GitHub's parser does not.)</p>

<h3>4. Red run #2 — "works on my machine": the generated client</h3>
<p>Removing the <code>prisma generate</code> step (flag <code>BO_BUOC</code>):</p>
<pre><code class="language-text">${esc(OUT_GEN)}</code></pre>
<p>On your laptop <code>src/generated/prisma</code> exists from the last <code>generate</code>, so everything compiles. A clean checkout does not have it, and <code>PrismaService extends PrismaClient</code> suddenly has no <code>booking</code>, <code>room</code>, <code>user</code>. This is the most common first CI failure on Prisma projects. A <code>postinstall: "prisma generate"</code> script is the other common fix; here it is an explicit step so the dummy URL stays visible.</p>

<h3>5. A break that stayed green — and why</h3>
<p>Removing the services' health options (flag <code>BO_HEALTH</code>) should let tests start before PostgreSQL is ready:</p>
<pre><code class="language-text">${esc(OUT_HEALTH)}</code></pre>
<p>It stayed green. PostgreSQL becomes healthy in about 2 s (measured above), and <code>npm ci</code> took 19.5 s before any test touched it — the slow step hid the race. On GitHub with a warm npm cache, or with a job whose first step touches the DB, the same workflow fails intermittently. A test that passes for the wrong reason is still a hole: keep the health options.</p>

<h3>6. Red run #3 — the smoke test hit a door we locked ourselves</h3>
<pre><code class="language-text">${esc(OUT_ANH_DO)}</code></pre>
<p>The smoke test called <code>/health/ready</code> through nginx — and 11.5's nginx returns 404 for <code>/health/</code> on purpose. Fix: check readiness inside the container (<code>docker compose exec -T api1 wget …</code>) and call a real route through the LB.</p>
<pre><code class="language-text">${esc(OUT_ANH)}</code></pre>

<h3>🕵️ Hacker corner — tj-actions/changed-files (CVE-2025-30066, March 2025)</h3>
<p>Between 14 and 15 March 2025 attackers moved the version tags of a popular action to a malicious commit; the action printed CI secrets into workflow logs of more than 23,000 repositories (GitHub advisory GHSA-mrrh-fwg8-r2c3; fixed in 46.0.1). A tag like <code>@v45</code> is a pointer, not a version. For this pipeline: <code>permissions: contents: read</code> (the token cannot push), no secrets in the PR jobs at all, and for third-party actions pin the full commit SHA (lesson ga-4.2).</p>

<h3>🧪 Lab (30 min)</h3>
<ol>
<li>Push your milestone project to a GitHub repo with this workflow. Make it red on purpose three ways: a type error, a failing e2e test, a Dockerfile that runs as root. Check that each job fails at the step you expect.</li>
<li>Turn on branch protection: <code>kiem</code>, <code>e2e</code>, <code>anh</code> required. Open a PR that breaks a test — confirm the merge button is blocked.</li>
<li>Measure: total time with a cold and a warm npm cache. Which step dominates?</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>Type error ⇒ <code>kiem</code> fails at <code>npm run typecheck</code>, <code>anh</code> is skipped (needs). Failing e2e ⇒ <code>e2e</code> red at <code>test:db</code>. Root image ⇒ <code>anh</code> fails at the <code>test "$(… .Config.User)" = node</code> step — the assertion is the whole point of that line.</li>
<li>Settings → Branches (or Rulesets) → require status checks <code>kiem</code>, <code>e2e</code>, <code>anh</code>. The PR shows "Required statuses must pass before merging".</li>
<li>Locally, <code>npm ci</code> was 17–24 s of a 33–37 s job; tests were 0.5 s (unit) and 6–7.5 s (db). Expect the same shape on GitHub: dependency install dominates, so the cache (ga-5.x) is the first optimization, not parallel tests.</li>
</ol>
</details>
<details><summary>The local runner (ci-cuc-bo.py) — read before reusing</summary>
<pre><code class="language-python">${esc(MA_RUN)}</code></pre>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you run e2e tests against a real database in CI?</strong> Service containers (or Testcontainers), health-checked, a disposable DB per run; migrations applied by the test setup; never a shared staging DB.</li>
<li><strong>Your CI passes locally but fails on GitHub — first suspects?</strong> Files that exist only locally (generated client, <code>.env</code>), timing (services not ready), OS/libc differences, Node version.</li>
<li><strong>How do you make CI block a bad merge?</strong> Required status checks on the protected branch; a job that only warns does not protect anything.</li>
<li><strong>How do you limit damage from a compromised action?</strong> Minimal <code>permissions</code>, no secrets in PR workflows, pin third-party actions by SHA, review updates.</li>
</ol>

<h3>💼 On the job</h3>
<p>On a project at an outsourcing company the client often owns the repository and the CI settings. Your workflow change goes through a pull request reviewed by someone who does not know Nest. Write the PR description as this lesson does: what each job checks, one red run per job proving it catches something, and the time added. A reviewer approves evidence faster than a YAML file.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job / step</span><span class="v">A job is a fresh machine; steps share its file system. Jobs share nothing unless you pass artifacts.</span></div>
  <div class="kv"><span class="k">Service container</span><span class="v">A container started next to the job (PostgreSQL, Redis), reachable on <code>localhost</code> through its mapped ports.</span></div>
  <div class="kv"><span class="k">needs</span><span class="v">Makes a job wait for others and skips it if they fail.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">The smallest check that the built artifact starts and answers.</span></div>
  <div class="kv"><span class="k">Required check</span><span class="v">A job whose success is required to merge into a protected branch.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Three jobs: <code>kiem</code> (lint, tsc, unit), <code>e2e</code> (PostgreSQL + Redis services, 46 db tests), <code>anh</code> (build, non-root assert, Compose <code>--wait</code>, smoke test).</li>
<li>Prisma on CI: <code>prisma generate</code> in every job that compiles or tests — <code>src/generated</code> is not in git.</li>
<li>Real reds: YAML flow mapping + <code>\${{ }}</code>; missing generate ⇒ TS2307/TS2339; smoke test through a door nginx closes.</li>
<li>A slow step can hide a race (no health options still green); keep the guard anyway.</li>
<li>Least-privilege token, no secrets in PR jobs, pin actions by SHA (tj-actions, 2025).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>11.3 — Pipeline CI cho lab-booking, và ba lần nó đỏ vì lý do thật</h2>
<p class="lead">GitHub Actions hoạt động thế nào — kích hoạt, runner, cache, bí mật, check bắt buộc — là khoá GitHub Actions (liên kết bên dưới). Bài này viết workflow cho <em>chính dự án này</em> và tập trung vào phần riêng của Nest + Prisma + Vitest: sinh Prisma client trên bản checkout sạch, PostgreSQL và Redis thật cho project <code>db</code>, và smoke test cho ảnh đã dựng ở 11.1.</p>

<h3>Nói thật: workflow này đã được chạy thế nào</h3>
<p>Máy nhà không chạy được runner của GitHub. Thay vì dán một workflow chưa ai chạy, <code>ci-cuc-bo.py</code> đọc <code>ci.yml</code> rồi chạy từng job theo cách runner làm: checkout mới, không có những gì <code>.gitignore</code> loại; job chạy trong <code>node:22</code> (Debian/glibc như <code>ubuntu-24.04</code>); service container dùng chung network namespace với job nên <code>localhost:5432</code> chạy y như trên GitHub; chuỗi <code>options</code> truyền thẳng cho <code>docker run</code> (GitHub cũng làm vậy); mọi bước <code>run</code> chạy bằng <code>bash -e -o pipefail</code>; bước <code>if: failure()</code> vẫn chạy sau một bước đỏ. Thứ nó không tái lập được: cache npm của GitHub, tốc độ runner, <code>concurrency</code>. Đẩy cùng tệp lên một repo GitHub là chạy nguyên vậy.</p>

<h3>Liên hệ đời thường: cổng kiểm hàng ở cửa nhà máy</h3>
<p>Mọi kiện hàng qua cùng ba cửa trước khi lên xe: nhãn đúng (lint, kiểu), từng linh kiện chạy (test đơn vị), sản phẩm lắp xong chạy với điện nước thật (e2e với DB thật), và sản phẩm đã đóng thùng cắm vào là chạy (smoke test ảnh). Câu "trên bàn em chạy được" của người thợ không mở được cổng.</p>

<h3>1. Workflow</h3>
<pre><code class="language-yaml">${esc(MA_CI)}</code></pre>
<ul>
<li><strong>kiem</strong> không cần DB: lint, <code>tsc --noEmit</code>, project Vitest <code>unit</code> — phản hồi nhanh nhất.</li>
<li><strong>e2e</strong> chạy project <code>db</code> (8.3) với service container; options health bắt runner chờ tới khi PostgreSQL và Redis trả lời.</li>
<li><strong>anh</strong> chỉ chạy khi hai job kia xanh: dựng ảnh, khẳng định ảnh chạy bằng <code>node</code>, bật cả stack Compose với <code>--wait</code> rồi gọi API qua bộ cân bằng tải.</li>
<li><code>prisma generate</code> có ở hai job vì mỗi job là một máy mới và <code>src/generated</code> không nằm trong git.</li>
</ul>

<h3>2. Các lượt xanh</h3>
<pre><code class="language-text">${esc(OUT_KIEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_E2E)}</code></pre>

<h3>3. Lần đỏ thứ nhất — YAML không đọc được</h3>
<p>Bản đầu viết <code>concurrency: { group: ci-\${{ github.ref }}, cancel-in-progress: true }</code>:</p>
<pre><code class="language-text">${esc(OUT_YAML)}</code></pre>
<p>Bên trong mapping dạng <code>{ … }</code>, dấu <code>{</code> của <code>\${{</code> mở thêm một mapping nữa. Viết dạng khối là hết. Cùng cái bẫy này gặp lại ở <code>compose.yaml</code> bài 11.5 với <code>\${GRACE:-3000}</code>. (Bên lề: PyYAML đọc khoá <code>on</code> thành boolean <code>True</code> — chuẩn YAML 1.1; bộ đọc của GitHub thì không.)</p>

<h3>4. Lần đỏ thứ hai — "máy em chạy được": client sinh ra</h3>
<p>Bỏ bước <code>prisma generate</code> (cờ <code>BO_BUOC</code>):</p>
<pre><code class="language-text">${esc(OUT_GEN)}</code></pre>
<p>Trên laptop, <code>src/generated/prisma</code> còn từ lần <code>generate</code> trước nên mọi thứ biên dịch được. Bản checkout sạch không có, và <code>PrismaService extends PrismaClient</code> bỗng không còn <code>booking</code>, <code>room</code>, <code>user</code>. Đây là lỗi CI đầu tiên phổ biến nhất của dự án dùng Prisma. Script <code>postinstall: "prisma generate"</code> là cách sửa phổ biến còn lại; ở đây để thành bước riêng cho URL giả hiện rõ.</p>

<h3>5. Một lần thử phá vẫn xanh — và vì sao</h3>
<p>Bỏ options health của service (cờ <code>BO_HEALTH</code>) lẽ ra làm test chạy trước khi PostgreSQL sẵn sàng:</p>
<pre><code class="language-text">${esc(OUT_HEALTH)}</code></pre>
<p>Vẫn xanh. PostgreSQL khoẻ sau khoảng 2 giây (đo ở trên), còn <code>npm ci</code> mất 19,5 giây trước khi test nào chạm tới DB — bước chậm che mất cuộc đua. Trên GitHub với cache npm nóng, hoặc job có bước đầu chạm DB, cùng workflow sẽ đỏ lúc có lúc không. Test qua vì lý do sai vẫn là một lỗ hổng: giữ options health.</p>

<h3>6. Lần đỏ thứ ba — smoke test gõ vào cánh cửa chính mình đã khoá</h3>
<pre><code class="language-text">${esc(OUT_ANH_DO)}</code></pre>
<p>Smoke test gọi <code>/health/ready</code> qua nginx — mà nginx của 11.5 cố ý trả 404 cho <code>/health/</code>. Sửa: kiểm readiness bên trong container (<code>docker compose exec -T api1 wget …</code>) và gọi một route thật qua bộ cân bằng tải.</p>
<pre><code class="language-text">${esc(OUT_ANH)}</code></pre>

<h3>🕵️ Góc hacker — tj-actions/changed-files (CVE-2025-30066, tháng 3/2025)</h3>
<p>Từ 14 đến 15/03/2025, kẻ tấn công dời các tag phiên bản của một action phổ biến sang commit độc; action in bí mật CI ra log workflow của hơn 23.000 repo (khuyến cáo GitHub GHSA-mrrh-fwg8-r2c3; vá ở 46.0.1). Tag như <code>@v45</code> là một con trỏ, không phải một phiên bản. Với pipeline này: <code>permissions: contents: read</code> (token không push được), job của PR không có bí mật nào, và action bên thứ ba thì ghim theo SHA đầy đủ của commit (bài ga-4.2).</p>

<h3>🧪 Lab (30 phút)</h3>
<ol>
<li>Đẩy dự án mốc của bạn lên một repo GitHub kèm workflow này. Cố tình làm đỏ theo ba cách: lỗi kiểu, một test e2e hỏng, Dockerfile chạy bằng root. Kiểm từng job hỏng đúng ở bước bạn đoán.</li>
<li>Bật bảo vệ nhánh: bắt buộc <code>kiem</code>, <code>e2e</code>, <code>anh</code>. Mở một PR làm hỏng test — xác nhận nút merge bị khoá.</li>
<li>Đo: tổng thời gian khi cache npm lạnh và khi nóng. Bước nào chiếm nhiều nhất?</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>Lỗi kiểu ⇒ <code>kiem</code> đỏ ở <code>npm run typecheck</code>, <code>anh</code> bị bỏ qua (needs). Test e2e hỏng ⇒ <code>e2e</code> đỏ ở <code>test:db</code>. Ảnh chạy root ⇒ <code>anh</code> đỏ ở bước <code>test "$(… .Config.User)" = node</code> — dòng đó có mặt chính là để khẳng định điều này.</li>
<li>Settings → Branches (hoặc Rulesets) → bắt buộc status check <code>kiem</code>, <code>e2e</code>, <code>anh</code>. PR hiện "Required statuses must pass before merging".</li>
<li>Ở máy nhà, <code>npm ci</code> chiếm 17–24 giây trong job 33–37 giây; test chỉ 0,5 giây (unit) và 6–7,5 giây (db). Trên GitHub hình dạng cũng vậy: cài phụ thuộc chiếm phần lớn, nên cache (ga-5.x) là tối ưu đầu tiên, chưa phải chạy test song song.</li>
</ol>
</details>
<details><summary>Bộ chạy cục bộ (ci-cuc-bo.py) — đọc kỹ trước khi dùng lại</summary>
<pre><code class="language-python">${esc(MA_RUN)}</code></pre>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Chạy test e2e với DB thật trong CI thế nào?</strong> Service container (hoặc Testcontainers), có kiểm sức khoẻ, mỗi lượt một DB dùng-một-lần; migration do phần setup của test chạy; không bao giờ dùng chung DB staging.</li>
<li><strong>CI qua ở máy mà đỏ trên GitHub — nghi đầu tiên?</strong> Tệp chỉ có ở máy (client sinh ra, <code>.env</code>), thời điểm (service chưa sẵn sàng), khác biệt OS/libc, phiên bản Node.</li>
<li><strong>Làm sao để CI chặn được merge xấu?</strong> Status check bắt buộc trên nhánh được bảo vệ; job chỉ cảnh báo thì không bảo vệ được gì.</li>
<li><strong>Hạn chế thiệt hại khi một action bị chiếm thế nào?</strong> <code>permissions</code> tối thiểu, workflow của PR không có bí mật, ghim action bên thứ ba theo SHA, xem xét kỹ khi cập nhật.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở công ty outsourcing, khách hàng thường sở hữu repo và cấu hình CI. Thay đổi workflow của bạn đi qua một pull request do người không biết Nest duyệt. Viết mô tả PR như bài này: mỗi job kiểm gì, mỗi job một lượt đỏ chứng minh nó bắt được lỗi, và thời gian tăng thêm. Người duyệt chấp nhận bằng chứng nhanh hơn chấp nhận một tệp YAML.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job / bước</span><span class="v">Mỗi job là một máy mới; các bước dùng chung hệ tệp của nó. Các job không chia sẻ gì trừ khi truyền artifact.</span></div>
  <div class="kv"><span class="k">Service container</span><span class="v">Container chạy cạnh job (PostgreSQL, Redis), gọi qua <code>localhost</code> bằng cổng đã ánh xạ.</span></div>
  <div class="kv"><span class="k">needs</span><span class="v">Bắt một job chờ các job khác, và bỏ qua nó nếu chúng đỏ.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">Lần kiểm nhỏ nhất cho thấy sản phẩm vừa dựng khởi động được và trả lời được.</span></div>
  <div class="kv"><span class="k">Check bắt buộc</span><span class="v">Job phải xanh thì mới merge vào nhánh được bảo vệ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba job: <code>kiem</code> (lint, tsc, unit), <code>e2e</code> (service PostgreSQL + Redis, 46 test db), <code>anh</code> (dựng ảnh, khẳng định không root, Compose <code>--wait</code>, smoke test).</li>
<li>Prisma trên CI: <code>prisma generate</code> ở mọi job có biên dịch hay chạy test — <code>src/generated</code> không nằm trong git.</li>
<li>Các lần đỏ thật: mapping YAML dạng <code>{ }</code> + <code>\${{ }}</code>; thiếu generate ⇒ TS2307/TS2339; smoke test đi qua cánh cửa nginx đã đóng.</li>
<li>Bước chậm có thể che một cuộc đua (bỏ options health vẫn xanh); vẫn giữ lớp bảo vệ.</li>
<li>Token quyền tối thiểu, job PR không có bí mật, ghim action theo SHA (tj-actions, 2025).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
