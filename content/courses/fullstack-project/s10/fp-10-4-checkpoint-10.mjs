/**
 * 10.4 — Checkpoint 10: một test lỗi thật sự chặn được PR (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * scripts/checkpoint-10.mjs: phần 1 đọc ci.yml (kích hoạt, quyền, ghim SHA, timeout, persist-credentials, không tiêm dữ liệu PR,
 * job tổng ci-xanh, actionlint); phần 2 chạy act (sự kiện pull_request) trên BẢN CHÉP SẠCH: lượt xanh + lượt cài lỗi IDOR;
 * phần 3 dựng cổng giữ main cục bộ (scripts/cong-main) và thử bốn đường đưa mã vào main. Output THẬT trên máy nhà.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CP = `== 1. Đọc .github/workflows/ci.yml (chưa chạy gì)
  ✔ chạy khi push lên main VÀ khi có pull request
  ✔ không workflow nào dùng pull_request_target (chạy mã của PR kèm secret ⇒ "pwn request")
  ✔ quyền gốc của GITHUB_TOKEN chỉ là contents: read
  ✔ chỉ job image được packages: write (đang có: image)
  ✔ mọi uses: ghim mã commit 40 ký tự (8 chỗ)
  ✔ job nào cũng có timeout-minutes (4 job)
  ✔ checkout không để token lại trong .git/config (3/3)
  ✔ không chèn dữ liệu do người gửi PR kiểm soát (tiêu đề, nội dung, tên nhánh) thẳng vào workflow
  ✔ job tổng ci-xanh: if: always() và needs đủ check, test, image (job bị skip được tính là ĐẠT)
  ✔ actionlint không báo lỗi
== 2. Chạy CI thật bằng act trên một bản chép sạch
  ✔ bản sạch: check ✅ · test ✅ · image (api) ✅ · image (api-migrate) ✅ · image (web) ✅ · ci-xanh ✅ (233 s)
  ✔ tìm thấy đoạn kiểm tác giả trong post.service.ts để cài lỗi
  ✔ cài lỗi IDOR ⇒ test ĐỎ, image không chạy, ci-xanh ĐỎ, act thoát mã 1
  ✔ Vitest in annotation ::error trỏ đúng tệp test (2 dòng) — PR sẽ hiện ô đỏ ngay dòng hỏng
== 3. Cổng giữ main (máy chủ git cục bộ, scripts/cong-main)
  ✔ push commit XANH lên main ⇒ cổng nhận
  ✔ push commit ĐỎ lên main ⇒ cổng TỪ CHỐI, main trên máy chủ vẫn là commit xanh
  ✔ cùng commit đỏ đó lên nhánh tinh-nang ⇒ nhận (chỉ main được giữ)
  ✔ force push đè main và xoá main ⇒ cả hai bị từ chối mà KHÔNG chạy CI, main vẫn là commit xanh
      remote: cổng: chạy CI cho 85fb08c4dcbd (act, sự kiện pull_request)…
      remote:   test: succeeded
      remote:   check: succeeded
      remote:   image (web): succeeded
      remote:   image (api-migrate): succeeded
      remote:   image (api): succeeded
      remote:   ci-xanh: succeeded
      remote: cổng: ci-xanh ✅ ⇒ NHẬN 85fb08c4dcbd vào main
      remote: cổng: chạy CI cho 95a8236d0695 (act, sự kiện pull_request)…
      remote:   check: succeeded
      remote:   test: failed
      remote:   ci-xanh: failed
      remote: cổng: ci-xanh ❌ ⇒ TỪ CHỐI 95a8236d0695, main giữ nguyên 85fb08c4dcbd (log: ci-95a8236d0695.log)
       ! [remote rejected] main -&gt; main (pre-receive hook declined)
      remote: cổng: TỪ CHỐI force push — 2d07f9dc68c4 không nối tiếp main hiện tại 85fb08c4dcbd
       ! [remote rejected] HEAD -&gt; main (pre-receive hook declined)
      remote: cổng: TỪ CHỐI xoá main
       ! [remote rejected] main (pre-receive hook declined)
  ✔ dọn sạch: không còn container act nào, thư mục tạm đã xoá

Checkpoint 10: 19/19 tiêu chí đạt`;

const KIEM_TINH = `console.log('== 1. Đọc .github/workflows/ci.yml (chưa chạy gì)');
const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
const tatCaWorkflow = readdirSync('.github/workflows')
  .filter((t) =&gt; /\\.ya?ml$/.test(t))
  .map((t) =&gt; readFileSync(join('.github/workflows', t), 'utf8'))
  .join('\\n');
kiem(
  'chạy khi push lên main VÀ khi có pull request',
  /^on:\\s*\\n(?:.*\\n)*?\\s+push:\\s*\\n\\s+branches: \\[main\\]/m.test(ci) &amp;&amp; /^\\s+pull_request:/m.test(ci),
);
kiem(
  'không workflow nào dùng pull_request_target (chạy mã của PR kèm secret ⇒ "pwn request")',
  !/^\\s*pull_request_target\\s*:/m.test(tatCaWorkflow),
);
kiem(
  'quyền gốc của GITHUB_TOKEN chỉ là contents: read',
  /^permissions:\\s*\\n\\s+contents: read\\s*\\n(?!\\s+\\w+:)/m.test(ci),
);
const khoiJob = ci.slice(ci.indexOf('\\njobs:'));
const cacJob = [...khoiJob.matchAll(/^ {2}([\\w-]+):\\s*$/gm)].map((m) =&gt; m[1]);
const thanJob = (ten) =&gt; {
  const a = khoiJob.indexOf(\`\\n  \${ten}:\`);
  const sau = cacJob[cacJob.indexOf(ten) + 1];
  return khoiJob.slice(a, sau ? khoiJob.indexOf(\`\\n  \${sau}:\`) : undefined);
};
const ghiGoi = cacJob.filter((j) =&gt; /packages: write/.test(thanJob(j)));
kiem(
  \`chỉ job image được packages: write (đang có: \${ghiGoi.join(', ') || 'không job nào'})\`,
  ghiGoi.length === 1 &amp;&amp; ghiGoi[0] === 'image',
);
const uses = [...tatCaWorkflow.matchAll(/uses:\\s*([^\\s#]+)/g)]
  .map((m) =&gt; m[1])
  .filter((u) =&gt; !u.startsWith('./'));
const khongGhim = uses.filter((u) =&gt; !/@[0-9a-f]{40}$/.test(u));
kiem(
  \`mọi uses: ghim mã commit 40 ký tự (\${uses.length} chỗ\${khongGhim.length ? \`; chưa ghim: \${khongGhim.join(', ')}\` : ''})\`,
  uses.length &gt; 0 &amp;&amp; khongGhim.length === 0,
);
const thieuTimeout = cacJob.filter((j) =&gt; !/timeout-minutes: \\d+/.test(thanJob(j)));
kiem(
  \`job nào cũng có timeout-minutes (\${cacJob.length} job\${thieuTimeout.length ? \`; thiếu: \${thieuTimeout.join(', ')}\` : ''})\`,
  thieuTimeout.length === 0,
);
const soCheckout = (ci.match(/uses: actions\\/checkout@/g) ?? []).length;
const soKhongLuu = (ci.match(/persist-credentials: false/g) ?? []).length;
kiem(
  \`checkout không để token lại trong .git/config (\${soKhongLuu}/\${soCheckout})\`,
  soCheckout &gt; 0 &amp;&amp; soKhongLuu === soCheckout,
);
kiem(
  'không chèn dữ liệu do người gửi PR kiểm soát (tiêu đề, nội dung, tên nhánh) thẳng vào workflow',
  !/github\\.event\\.(pull_request|issue|comment|review)\\.(title|body)|github\\.head_ref|pull_request\\.head\\.ref/.test(
    tatCaWorkflow,
  ),
);
const tong = thanJob('ci-xanh');
kiem(
  'job tổng ci-xanh: if: always() và needs đủ check, test, image (job bị skip được tính là ĐẠT)',
  /if: always\\(\\)/.test(tong) &amp;&amp;
    /needs: \\[check, test, image\\]/.test(tong) &amp;&amp;
    /needs\\.image\\.result/.test(tong),
);
const al = chay('docker', [
  'run',
  '--rm',
  '--memory',
  '512m',
  '-v',
  \`\${GOC}:/repo\`,
  '-w',
  '/repo',
  'rhysd/actionlint:latest',
  '-color=false',
]);
kiem(\`actionlint không báo lỗi\${al.status ? \`:\\n\${al.stdout}\${al.stderr}\` : ''}\`, al.status === 0);`;

const BAT_LOI = `$ git checkout -q --orphan viet-lai &amp;&amp; git commit -qm "viết lại lịch sử" &amp;&amp; git push -f cong viet-lai:main
remote: cổng: chạy CI cho 7d8ed490d06f (act, sự kiện pull_request)…
remote:   check: succeeded
remote:   test: failed
remote:   ci-xanh: failed
remote: cổng: ci-xanh ❌ ⇒ TỪ CHỐI 7d8ed490d06f, main giữ nguyên e96913ce83d0 (log: ci-7d8ed490d06f.log)
To /tmp/fsp-cong/chiase.git
 ! [remote rejected] viet-lai -&gt; main (pre-receive hook declined)
error: failed to push some refs to '/tmp/fsp-cong/chiase.git'
(mã thoát 1)

$ git push cong :main
remote: fatal: not a tree object: 0000000000000000000000000000000000000000
remote: tar: This does not look like a tar archive
remote: tar: Exiting with failure status due to previous errors
remote: On branch main
remote:
remote: Initial commit
remote:
remote: nothing to commit (create/copy files and use "git add" to track)
remote: grep: /tmp/tmp.…/log.txt: No such file or directory
remote: cp: cannot stat '/tmp/tmp.…/log.txt': No such file or directory
remote: cổng: ci-xanh ❌ ⇒ TỪ CHỐI 000000000000, main giữ nguyên e96913ce83d0 (log: ci-000000000000.log)
To /tmp/fsp-cong/chiase.git
 ! [remote rejected] main (pre-receive hook declined)
error: failed to push some refs to '/tmp/fsp-cong/chiase.git'
(mã thoát 1)

e96913ce83d04a82b6debdd980bf20e78289c42c	HEAD
e96913ce83d04a82b6debdd980bf20e78289c42c	refs/heads/main
efa418451772c967204cbfc3c4186b98d0ac1491	refs/heads/tinh-nang
(mã thoát 0)`;

const CI_DU = `# CI của ChiaSe (Chương 10). Hai job song song: "check" (lint + kiểm kiểu + định dạng) và "test" (Vitest, Postgres thật).
# Tên job (name:) là TÊN CHECK mà branch protection bắt buộc (bài 10.3) — đổi tên ở đây phải đổi ở đó.
name: CI

on:
  push:
    branches: [main]
  pull_request: # KHÔNG dùng pull_request_target: nó chạy mã của PR với quyền + secret của repo (bài 10.1, góc hacker)

# Quyền tối thiểu cho GITHUB_TOKEN: chỉ đọc mã. Job nào cần hơn thì tự xin (bài 10.2: packages: write).
permissions:
  contents: read

# Push mới lên cùng một PR ⇒ huỷ lượt cũ đang chạy. Trên main thì KHÔNG huỷ: mỗi commit main phải có kết quả riêng.
concurrency:
  group: ci-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  check:
    name: check
    runs-on: ubuntu-latest
    timeout-minutes: 10 # mặc định là 360 phút: một bước treo đốt 6 giờ runner
    steps:
      # Ghim action theo mã commit đầy đủ, không theo tag: tag di chuyển được (vụ tj-actions/changed-files, 03/2025).
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false # không để token nằm trong .git/config cho các bước sau
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version-file: .nvmrc
          cache: npm # cache ~/.npm theo băm package-lock.json
      - run: npm ci
      - run: npm run check

  test:
    name: test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    services:
      postgres:
        image: postgres:18-alpine
        env:
          POSTGRES_USER: chiase
          POSTGRES_PASSWORD: chiase
          POSTGRES_DB: chiase
        # Cổng máy 41855 (không phải 5432): máy chạy act đã có một Postgres khác ở 5432. Trên GitHub cách "chuẩn" là
        # cổng ngẫu nhiên + job.services.postgres.ports[5432], nhưng act để job.services = null (đo 25/11) ⇒ cổng cố định
        # chạy được ở CẢ HAI nơi (runner GitHub là máy ảo mới tinh, 41855 luôn trống).
        ports:
          - 41855:5432
        # Runner chờ service "healthy" rồi mới chạy bước đầu tiên.
        options: &gt;-
          --health-cmd "pg_isready -h 127.0.0.1 -U chiase -d chiase"
          --health-interval 2s --health-timeout 5s --health-retries 30
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm test
        env:
          # Có TEST_DATABASE_URL ⇒ globalSetup (test/pg-mot-lan.ts) KHÔNG tự bật Docker, dùng service này.
          TEST_DATABASE_URL: postgresql://chiase:chiase@localhost:41855/chiase

  # Bài 10.2 — dựng ảnh Docker SAU KHI check + test xanh. PR: chỉ dựng (chứng minh Dockerfile còn dựng được), KHÔNG đẩy.
  # Push lên main: dựng + đẩy lên GHCR, tag theo mã commit (bất biến) — Chương 11 deploy đúng tag đó.
  image:
    name: image (\${{ matrix.ten }})
    needs: [check, test]
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
      packages: write # CHỈ job này được ghi vào registry
    strategy:
      fail-fast: false
      matrix:
        include:
          - { ten: api, dockerfile: apps/api/Dockerfile, target: runtime }
          - { ten: api-migrate, dockerfile: apps/api/Dockerfile, target: cong-cu } # ảnh chạy prisma migrate deploy (Ch11)
          - { ten: web, dockerfile: apps/web/Dockerfile, target: runtime }
    env:
      # vars.REGISTRY để trống trên GitHub ⇒ ghcr.io. Khi chạy bằng act, trỏ vào registry cục bộ (bài 10.2 giải thích).
      REGISTRY: \${{ vars.REGISTRY || 'ghcr.io' }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1
        with:
          # Trên GitHub để trống. act: mạng host (với tới registry cục bộ) + giới hạn RAM cho container buildkit.
          driver-opts: \${{ vars.BUILDX_DRIVER_OPTS }}
          buildkitd-config-inline: \${{ vars.BUILDKITD_CONFIG }}
      - name: Đăng nhập GHCR
        if: env.REGISTRY == 'ghcr.io' &amp;&amp; github.event_name == 'push'
        uses: docker/login-action@8aa5831fb8d48d8f76594c7ddde61ae58019f550 # v4.8.0
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }} # token tự cấp cho lượt chạy, hết hạn khi job xong — không cần PAT
      # Tên ảnh: registry/chủ-repo/chiase-&lt;ten&gt;, tag = mã commit đầy đủ (bất biến) + latest khi là main.
      # Tự tính bằng một dòng shell thay cho docker/metadata-action: ít một action bên thứ ba, và metadata-action
      # gọi REST API của GitHub (chạy bằng act không có token ⇒ "Bad credentials"). \${OWNER,,} = chữ thường:
      # GHCR từ chối tên có chữ hoa ("repository name must be lowercase").
      - id: ten
        env:
          OWNER: \${{ github.repository_owner }}
        run: |
          anh="\${REGISTRY}/\${OWNER,,}/chiase-\${{ matrix.ten }}"
          {
            echo "tags&lt;&lt;EOF"
            echo "\${anh}:\${GITHUB_SHA}"
            if [ "\${GITHUB_REF}" = refs/heads/main ]; then echo "\${anh}:latest"; fi
            echo "EOF"
          } &gt;&gt; "$GITHUB_OUTPUT"
      - uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: .
          file: \${{ matrix.dockerfile }}
          target: \${{ matrix.target }}
          push: \${{ github.event_name == 'push' }}
          tags: \${{ steps.ten.outputs.tags }}
          labels: org.opencontainers.image.revision=\${{ github.sha }}
          cache-from: type=gha,scope=\${{ matrix.ten }}
          cache-to: type=gha,mode=max,scope=\${{ matrix.ten }}

  # Bài 10.3 — MỘT check tổng duy nhất để branch protection bắt buộc. Vì sao không bắt buộc thẳng "image":
  # job bị bỏ qua (skipped) được GitHub tính là ĐẠT ⇒ test đỏ ⇒ image skipped ⇒ PR vẫn merge được.
  # if: always() ⇒ job này LUÔN chạy và tự đỏ nếu có job nào phía trước không "success".
  ci-xanh:
    name: ci-xanh
    if: always()
    needs: [check, test, image]
    runs-on: ubuntu-latest
    timeout-minutes: 2
    steps:
      - name: Mọi job phía trước phải success
        run: |
          echo "check=\${{ needs.check.result }} test=\${{ needs.test.result }} image=\${{ needs.image.result }}"
          [ "\${{ needs.check.result }}" = success ] &amp;&amp; [ "\${{ needs.test.result }}" = success ] &amp;&amp; [ "\${{ needs.image.result }}" = success ]`;


const NGUON = [
  nguon('🧰', 'act — chạy GitHub Actions trên máy của bạn', 'nektosact.com', 'https://nektosact.com/'),
  nguon('🔍', 'actionlint — kiểm tĩnh workflow GitHub Actions', 'github.com/rhysd/actionlint', 'https://github.com/rhysd/actionlint'),
  nguon('📘', 'GitHub Docs — Troubleshooting required status checks', 'docs.github.com', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks'),
].join('\n');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-9-5-lab-ci', title: 'Testing Lab 9 — Sửa một pipeline hỏng tới khi check bắt buộc chặn được', sub: 'Thêm một bài tập cùng dạng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-6-5-soat', title: 'GitHub Actions 6.5 — Một script soát cả kho bằng một câu lệnh', sub: 'Phần 1 của checkpoint này, làm cho mọi repo.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions 15.1 — CI cho pull request: bốn job, một Postgres thật', sub: 'Dự án cuối khoá GitHub Actions, cùng hình dạng.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.4 — Checkpoint 10: a failing test actually blocks the PR|||10.4 — Checkpoint 10: một test lỗi thật sự chặn được PR',
  slug: 'fp-10-4-checkpoint-10',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một lệnh tự chấm cả chương: node scripts/checkpoint-10.mjs. Đọc ci.yml (kích hoạt, quyền tối thiểu, ghim SHA, timeout, không lưu token, không chèn dữ liệu PR, job tổng ci-xanh, actionlint); chạy CI thật bằng act trên một bản chép sạch — lượt xanh hết, rồi cài lại lỗi IDOR để test đỏ, image không chạy, ci-xanh đỏ, có annotation; rồi dựng cổng giữ main cục bộ và thử bốn đường: push xanh (nhận), push đỏ (từ chối, main giữ nguyên), nhánh khác (nhận), force push và xoá main (git từ chối). Kèm cách đọc khi một tiêu chí trượt và một bài tập phá thử để chứng minh checkpoint không giả vờ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Checkpoint</span>
<h2>"CI blocks bad code" is a claim — prove it with a bad commit</h2>
<p class="lead">A green pipeline proves nothing about protection: a workflow that always exits 0 is green too. The chapter's promise is that a failing test <em>stops</em> code from reaching <code>main</code>. Checkpoint 10 tries to break that promise in every way it can, on a clean copy of your repository, and fails if any attempt succeeds.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">read</span><span class="lz-d">ci.yml: triggers, permissions, SHAs, timeouts, ci-xanh, actionlint</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">clean copy</span><span class="lz-d">only files git would ship ⇒ act pull_request ⇒ all green</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">plant a bug</span><span class="lz-d">IDOR from Chapter 4 ⇒ test red, image skipped, ci-xanh red</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">gate</span><span class="lz-d">green push accepted · red push refused · force push / delete refused</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">clean up</span><span class="lz-d">no act container, temp dirs removed</span></div>
</div>

<h3>1. Run it</h3>
<pre><code class="language-bash">node scripts/checkpoint-10.mjs            # all three parts, ~10 min (most of it Docker builds)
node scripts/checkpoint-10.mjs --bo-act   # part 1 only, seconds
ACT=/path/to/your-act node scripts/checkpoint-10.mjs   # your own act wrapper (RAM limits, caches)</code></pre>
<p>Needs Docker, <code>act</code> and the runner image <code>catthehacker/ubuntu:act-24.04</code> (about 2.3 GB, pulled once). Close the dev stack first only if your machine is short on RAM — nothing here uses its ports.</p>

<h3>2. A real run</h3>
<div class="out">${CP}</div>

<h3>3. What each part proves</h3>
<p><strong>Part 1 reads before it runs.</strong> Cheap checks catch the expensive mistakes: a <code>pull_request_target</code>, a tag instead of a SHA, a job without timeout, a <code>\${{ github.event.pull_request.title }}</code> inside a script, a required job that is not in <code>ci-xanh</code>'s <code>needs</code>. The regular expressions are blunt on purpose — they encode the rules of 10.1–10.3 as text you can read:</p>
<pre><code class="language-js">${KIEM_TINH}</code></pre>
<p><strong>Part 2 runs on a clean copy.</strong> Your working directory has <code>node_modules</code>, a <code>.env</code> and a warm cache; CI has none of that. The copy contains exactly <code>git ls-files -co --exclude-standard</code> — tracked files plus new files git would add — so a forgotten <code>git add</code> or a test that only passes because of your <code>.env</code> shows up here, not in your first PR.</p>
<p><strong>Part 3 attacks the gate.</strong> Four routes to <code>main</code>: green (must pass), red (must be refused <em>and</em> leave <code>main</code> on the green commit), another branch (must pass — protection is for <code>main</code>), and the two shortcuts people take under pressure, <code>git push -f</code> and deleting the branch.</p>

<h3>4. When the checkpoint itself is wrong</h3>
<p>The first runs of this checkpoint caught its own mistakes before they caught anything else:</p>
<div class="out">${BAT_LOI}</div>
<p>Same lesson as Checkpoint 9: a checker is code, and it lies until you have seen it fail for the right reason. That is why the IDOR run is part of the checkpoint — it is the proof that "red" is reachable.</p>

<h3>5. The workflow at the end of the chapter</h3>
<p>For reference — the whole <code>.github/workflows/ci.yml</code> that Checkpoint 10 passed, comments included (they record <em>why</em> each line exists, which is what a reviewer asks):</p>
<pre><code class="language-yaml">${CI_DU}</code></pre>

<h3>🧪 Prove the checkpoint does not pretend</h3>
<div class="callout ok">
<ol>
<li>Remove <code>if: always()</code> from <code>ci-xanh</code>. Which criterion goes red, and why does the planted-bug run now look "green enough"?</li>
<li>Change one <code>uses:</code> back to <code>@v7</code>. Run with <code>--bo-act</code>.</li>
<li>Make <code>npm test</code> always pass: <code>"test": "vitest run || true"</code> in <code>apps/api/package.json</code>. What does part 2 say?</li>
<li>Delete the hook symlink from the bare repo that <code>dung-cong.sh</code> creates and push a red commit: does git still refuse?</li>
</ol>
<p><strong>Done when:</strong> every criterion is ✔ on your repository, and each of the four sabotages above turns at least one criterion ✘.</p>
</div>
<details><summary>Solution</summary>
<ol>
<li>"job tổng ci-xanh…" fails at once (part 1). Without <code>always()</code>, <code>ci-xanh</code> is <em>skipped</em> when test fails — and skipped counts as passed on GitHub.</li>
<li>"mọi uses: ghim mã commit…" lists <code>actions/checkout@v7</code>.</li>
<li>The planted IDOR no longer reddens <code>test</code>: "test vẫn succeeded" — the classic CI that cannot fail.</li>
<li>No: without the hook only force push and deletion are refused (those are git config). A protected branch is configuration on the <em>server</em>; your laptop cannot enforce it.</li>
</ol>
</details>

${spring(true, 'Checkpoint 9 of the Spring course has the same shape; for Spring keep part 1 as is, and in part 2 plant the same IDOR in your PostService and expect mvn verify to go red.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Chapter 17 lab + interview questions'],
])}

<h3>On the job</h3>
<p>Write "CI blocks a failing test: verified by checkpoint-10 (planted IDOR ⇒ ci-xanh red, push to main refused)" in your OJT weekly report. A mentor reads "set up CI" a hundred times a year; "proved CI blocks a real bug" is rarer.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How do you know your CI can fail?"</strong> — I plant a known bug and watch it go red, as part of the check itself.</li>
<li><strong>"How do you test a workflow before pushing it?"</strong> — actionlint for syntax and expressions, act for a local run, then a draft PR.</li>
<li><strong>"Why a clean copy?"</strong> — The working tree has caches, env files and untracked files CI will not have.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">checkpoint</span><span class="v">A script that proves the chapter's promise, including the failure path.</span></div>
  <div class="kv"><span class="k">planted bug</span><span class="v">A deliberate, known defect used to show a check can go red.</span></div>
  <div class="kv"><span class="k">clean copy</span><span class="v">Files git would ship, without node_modules/.env.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">Static checker for workflow syntax, expressions and shell.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Part 1 encodes the rules of 10.1–10.3 as readable checks.</li>
<li>Part 2: green on a clean copy, red with a planted bug — both required.</li>
<li>Part 3: only a green commit reaches main; force push and deletion refused.</li>
<li>A checker must be seen failing for the right reason before you trust it.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Checkpoint</span>
<h2>"CI chặn được mã hỏng" là một lời khẳng định — chứng minh bằng một commit hỏng</h2>
<p class="lead">Pipeline xanh không chứng minh được gì về việc bảo vệ: một workflow lúc nào cũng thoát 0 thì cũng xanh. Lời hứa của chương là một test đỏ <em>ngăn</em> được mã đi vào <code>main</code>. Checkpoint 10 tìm mọi cách phá lời hứa đó, trên một bản chép sạch của repo, và trượt nếu có cách nào thành công.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">đọc</span><span class="lz-d">ci.yml: kích hoạt, quyền, SHA, timeout, ci-xanh, actionlint</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bản chép sạch</span><span class="lz-d">chỉ tệp git sẽ đưa lên ⇒ act pull_request ⇒ xanh hết</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">cài lỗi</span><span class="lz-d">IDOR của Chương 4 ⇒ test đỏ, image bỏ qua, ci-xanh đỏ</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">cổng</span><span class="lz-d">push xanh nhận · push đỏ từ chối · force push / xoá từ chối</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">dọn</span><span class="lz-d">không còn container act, thư mục tạm đã xoá</span></div>
</div>

<h3>1. Chạy</h3>
<pre><code class="language-bash">node scripts/checkpoint-10.mjs            # đủ ba phần, ~10 phút (phần lớn là dựng Docker)
node scripts/checkpoint-10.mjs --bo-act   # chỉ phần 1, vài giây
ACT=/đường/tới/act-của-bạn node scripts/checkpoint-10.mjs   # lệnh act riêng (giới hạn RAM, cache)</code></pre>
<p>Cần Docker, <code>act</code> và ảnh runner <code>catthehacker/ubuntu:act-24.04</code> (khoảng 2,3 GB, kéo một lần). Chỉ cần tắt stack dev nếu máy thiếu RAM — ở đây không dùng cổng nào của nó.</p>

<h3>2. Một lượt chạy thật</h3>
<div class="out">${CP}</div>

<h3>3. Mỗi phần chứng minh điều gì</h3>
<p><strong>Phần 1 đọc trước khi chạy.</strong> Kiểm rẻ bắt được lỗi đắt: một <code>pull_request_target</code>, một tag thay cho SHA, một job thiếu timeout, một <code>\${{ github.event.pull_request.title }}</code> trong script, một job bắt buộc không nằm trong <code>needs</code> của <code>ci-xanh</code>. Biểu thức chính quy cố ý thô — chúng viết luật của 10.1–10.3 thành chữ đọc được:</p>
<pre><code class="language-js">${KIEM_TINH}</code></pre>
<p><strong>Phần 2 chạy trên bản chép sạch.</strong> Thư mục làm việc của bạn có <code>node_modules</code>, có <code>.env</code> và cache còn nóng; CI không có gì trong số đó. Bản chép chứa đúng <code>git ls-files -co --exclude-standard</code> — tệp đã theo dõi cộng tệp mới mà git sẽ thêm — nên một lần quên <code>git add</code> hay một test chỉ xanh nhờ <code>.env</code> của bạn hiện ra ở đây, không phải ở PR đầu tiên.</p>
<p><strong>Phần 3 tấn công cổng.</strong> Bốn đường vào <code>main</code>: xanh (phải qua), đỏ (phải bị từ chối <em>và</em> để <code>main</code> nằm yên ở commit xanh), nhánh khác (phải qua — bảo vệ là cho <code>main</code>), và hai lối tắt người ta hay đi khi bị dí: <code>git push -f</code> và xoá nhánh.</p>

<h3>4. Khi chính checkpoint sai</h3>
<p>Những lượt chạy đầu của checkpoint này bắt được lỗi của chính nó trước khi bắt được gì khác:</p>
<div class="out">${BAT_LOI}</div>
<p>Cùng bài học với Checkpoint 9: bộ kiểm cũng là mã, và nó nói dối cho tới khi bạn thấy nó hỏng vì đúng lý do. Đó là lý do lượt IDOR là một phần của checkpoint — nó là bằng chứng "đỏ" là chạm tới được.</p>

<h3>5. Workflow cuối chương</h3>
<p>Để tra cứu — toàn bộ <code>.github/workflows/ci.yml</code> đã qua Checkpoint 10, giữ cả chú thích (chúng ghi lại <em>vì sao</em> từng dòng tồn tại, đúng câu người review sẽ hỏi):</p>
<pre><code class="language-yaml">${CI_DU}</code></pre>

<h3>🧪 Chứng minh checkpoint không giả vờ</h3>
<div class="callout ok">
<ol>
<li>Bỏ <code>if: always()</code> khỏi <code>ci-xanh</code>. Tiêu chí nào đỏ, và vì sao lượt cài lỗi giờ trông "đủ xanh"?</li>
<li>Đổi một <code>uses:</code> về <code>@v7</code>. Chạy với <code>--bo-act</code>.</li>
<li>Làm <code>npm test</code> luôn qua: <code>"test": "vitest run || true"</code> trong <code>apps/api/package.json</code>. Phần 2 báo gì?</li>
<li>Xoá liên kết hook khỏi repo trần mà <code>dung-cong.sh</code> tạo rồi push một commit đỏ: git còn từ chối không?</li>
</ol>
<p><strong>Xong khi:</strong> mọi tiêu chí đều ✔ trên repo của bạn, và mỗi lần phá ở trên làm ít nhất một tiêu chí thành ✘.</p>
</div>
<details><summary>Lời giải</summary>
<ol>
<li>"job tổng ci-xanh…" trượt ngay (phần 1). Thiếu <code>always()</code>, <code>ci-xanh</code> bị <em>bỏ qua</em> khi test đỏ — mà trên GitHub bỏ qua được tính là đạt.</li>
<li>"mọi uses: ghim mã commit…" liệt kê <code>actions/checkout@v7</code>.</li>
<li>IDOR cài vào không còn làm <code>test</code> đỏ: "test vẫn succeeded" — kiểu CI kinh điển không bao giờ hỏng được.</li>
<li>Không: thiếu hook thì chỉ force push và xoá bị từ chối (hai cái đó là cấu hình git). Nhánh được bảo vệ là cấu hình ở <em>máy chủ</em>; laptop của bạn không thi hành được.</li>
</ol>
</details>

${spring(false, 'Checkpoint 9 của khoá Spring có cùng hình dạng; với Spring giữ nguyên phần 1, còn phần 2 cài đúng lỗi IDOR vào PostService và chờ mvn verify đỏ.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI với GitHub Actions'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Lab chương 17 + câu hỏi phỏng vấn'],
])}

<h3>Tình huống đi làm thật</h3>
<p>Ghi vào báo cáo tuần OJT: "CI chặn được test đỏ: đã kiểm bằng checkpoint-10 (cài IDOR ⇒ ci-xanh đỏ, push lên main bị từ chối)". Người hướng dẫn đọc "đã dựng CI" cả trăm lần một năm; "đã chứng minh CI chặn được một lỗi thật" thì hiếm hơn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao biết CI của bạn hỏng được?"</strong> — Tôi cài một lỗi biết trước và nhìn nó đỏ, ngay trong bộ kiểm.</li>
<li><strong>"Kiểm workflow trước khi push thế nào?"</strong> — actionlint cho cú pháp và biểu thức, act để chạy ở máy, rồi một PR nháp.</li>
<li><strong>"Sao phải chép sạch?"</strong> — Cây làm việc có cache, tệp env và tệp chưa theo dõi mà CI sẽ không có.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">checkpoint</span><span class="v">Script chứng minh lời hứa của chương, kể cả đường hỏng.</span></div>
  <div class="kv"><span class="k">lỗi cài sẵn</span><span class="v">Một lỗi cố ý, biết trước, để chứng tỏ check đỏ được.</span></div>
  <div class="kv"><span class="k">bản chép sạch</span><span class="v">Tệp git sẽ đưa lên, không node_modules/.env.</span></div>
  <div class="kv"><span class="k">actionlint</span><span class="v">Bộ kiểm tĩnh cho cú pháp, biểu thức và shell của workflow.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần 1 viết luật của 10.1–10.3 thành phép kiểm đọc được.</li>
<li>Phần 2: xanh trên bản sạch, đỏ khi cài lỗi — cần cả hai.</li>
<li>Phần 3: chỉ commit xanh vào được main; force push và xoá bị từ chối.</li>
<li>Bộ kiểm phải được thấy hỏng vì đúng lý do rồi mới tin.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
