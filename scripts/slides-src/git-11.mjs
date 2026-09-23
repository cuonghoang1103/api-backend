/** Git & GitHub · Deck git-11 — Chương 11: Nền tảng GitHub.
 *  Output terminal dưới đây là output THẬT, chạy trong kho thử scratchpad/ch11-lab (dung.sh, ngày commit cố định
 *  2026-09-22 nên chạy lại ra đúng mã băm): git 2.51.1, node 22.21 (`npm test` = node --test), actionlint 1.7.12.
 *  Dòng gh lấy từ `gh … --help` (gh 2.93.0) — KHÔNG gọi GitHub. Việc GitHub làm trên máy chủ (issue tự đóng,
 *  bảng Projects, lượt chạy Actions, push protection) vẽ bằng sơ đồ, không bịa output máy chủ.
 *  Tính năng GitHub kiểm trên docs.github.com — tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, two, list, code, mindmap, term, diagram, G } from './_git-chung.mjs';

export const deck = { key: 'git-11', code: 'GIT · CHƯƠNG 11', title: 'Nền tảng GitHub', sub: 'Git & GitHub · Chương 11' };

/* ── Bảng Projects kiểu kanban (HTML thuần, vẽ lại cho dễ đọc — không phải ảnh chụp) ── */
const chip = (t, c) => `<span style="font-family:SF Mono,Menlo,monospace;font-size:12.5px;color:${c};border:1px solid ${c};border-radius:10px;padding:0 7px;margin-right:4px;white-space:nowrap">${t}</span>`;
const card = (n, t, tags = '', who = '', pr = '') => `<div style="background:#0f141b;border:1.5px solid ${G.bd};border-radius:9px;padding:7px 10px;margin-top:8px">
  <div style="font-size:13px;color:${G.mu}">thu-git <b style="color:${G.tx}">#${n}</b>${who ? ` · ${who}` : ''}</div>
  <div style="font-size:16px;font-weight:700;color:#fff;margin:2px 0 4px;line-height:1.25">${t}</div>
  <div>${tags}${pr}</div></div>`;
const col = (name, n, c, body) => `<div style="background:#141a22;border:1.5px solid ${G.bd};border-top:4px solid ${c};border-radius:10px;padding:8px 10px;min-height:300px">
  <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px;color:#fff">● <span style="color:${c}">${name}</span></b><span style="font-size:13px;color:${G.mu}">${n}</span></div>${body}</div>`;
const kanban = () => `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:left">
  ${col('Todo', 2, G.mu, card(15, 'Trang đặt lịch thiếu ô ghi chú', chip('type:feature', G.blu) + chip('area:ui', G.vio), '@lan') + card(16, 'Viết test cho API đăng nhập', chip('type:chore', G.mu), '@minh'))}
  ${col('In progress', 1, G.amb, card(14, 'Lọc lịch theo bác sĩ', chip('type:feature', G.blu) + chip('prio:high', G.red), '@hoa'))}
  ${col('In review', 1, G.vio, card(12, 'Giỏ âm tiền khi số lượng âm', chip('type:bug', G.red), '@cuong', chip('PR #13 · CI ✓', G.grn)))}
  ${col('Done', 2, G.grn, card(9, 'Khởi tạo repo + CI', chip('type:chore', G.mu), '@cuong') + card(11, 'Mẫu issue báo lỗi', chip('type:docs', G.tea), '@lan'))}
</div>`;

export const slides = S([
  cover({ t: 'Chương 11 — Nền tảng GitHub', sub: 'Issue &amp; Projects · CLI gh · GitHub Actions từ số 0 · bảo mật &amp; quản trị kho', chap: 'CHƯƠNG 11' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('GitHub quanh Git', 'việc · máy tự kiểm · khoá cửa', [
    { t: '11.1 Issue &amp; Projects', d: 'issue viết đúng · nhãn 3 trục · bảng kanban tự chạy', c: 'grn' },
    { t: '11.1 CLI gh', d: 'issue · pr · run · project — không rời terminal', c: 'tea' },
    { t: '11.2 Workflow YAML', d: 'on → jobs → steps · runs-on · actionlint', c: 'blu' },
    { t: '11.2 Nhanh &amp; an toàn', d: 'matrix · cache · secrets · permissions', c: 'vio' },
    { t: '11.2 CI chặn merge', d: 'tên job = tên check bắt buộc', c: 'amb' },
    { t: '11.3 Bảo mật kho', d: '2FA/passkey · Dependabot · push protection · quyền', c: 'git' },
  ]) },

  /* 3 */
  { t: 'Issue → nhánh → PR “Closes #12” → tự đóng', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'i', x: 0, y: 20, w: 200, h: 86, t: '① Issue #12', d: 'giỏ âm tiền', c: 'grn' },
      { id: 'b', x: 240, y: 20, w: 200, h: 86, t: '② Nhánh', d: 'fix/12-gio-am', c: 'tea', mono: true },
      { id: 'p', x: 480, y: 20, w: 200, h: 86, t: '③ PR #13', d: 'mô tả: Closes #12', c: 'blu' },
      { id: 'c', x: 720, y: 20, w: 200, h: 86, t: '④ CI + review', d: 'check xanh, 1 duyệt', c: 'amb' },
      { id: 'm', x: 960, y: 20, w: 200, h: 86, t: '⑤ Merge', d: 'vào main', c: 'git' },
      { id: 'x', x: 620, y: 176, w: 540, h: 66, t: '⑥ #12 tự Closed · thẻ Projects → Done', c: 'vio' },
    ], edges: [
      { from: 'i', to: 'b', c: 'tea' }, { from: 'b', to: 'p', c: 'blu' }, { from: 'p', to: 'c', c: 'amb' }, { from: 'c', to: 'm', c: 'git' },
      { from: 'm', to: 'x', c: 'vio', fs: 'b', ts: 't', t: 'khi tới nhánh mặc định', off: 2 },
    ] })}
    ${two(
      term([
        '$ git log -1 --format="%h %s%n%n%b"',
        '7422e4e fix(gio): số lượng âm không làm tổng tiền âm',
        '',
        '+ Closes #12',
      ], { title: 'output thật — kho thử ch11-lab', branch: 'fix/12-gio-am', dir: '~/thu-git' }),
      list(['Từ khoá: <code>close(s/d)</code> · <code>fix(es/ed)</code> · <code>resolve(s/d)</code>', 'Chỉ có hiệu lực trong <b>mô tả PR</b> hoặc <b>lời nhắn commit</b> — bình luận thì không', 'Chỉ <code>#12</code> = liên kết, KHÔNG đóng']), 'l')}` },

  /* 4 */
  { t: 'Một issue làm được việc — và nhãn ba trục', body: two(
    code(`# Tiêu đề = TRIỆU CHỨNG, không phải phỏng đoán
Giỏ hàng ra tổng âm khi số lượng âm

**Chuyện gì xảy ra:** sl = -2 ⇒ tổng -60000
**Mong đợi:** tổng không bao giờ âm
**Tái hiện:** POST /cart {gia:30000, sl:-2}
**Môi trường:** staging, từ 22/09`, 'plaintext') +
    box('tip', 'Mẫu issue (<code>.github/ISSUE_TEMPLATE/bug.yml</code>) biến các dòng trên thành <b>ô bắt buộc</b> — hết issue “không chạy”.'),
    table(['Trục', 'Nhãn'], [
      ['Loại gì', '<code>type:bug</code> · <code>type:feature</code> · <code>type:chore</code> · <code>type:docs</code>'],
      ['Gấp tới đâu', '<code>prio:high</code> · <code>prio:medium</code> · <code>prio:low</code>'],
      ['Phần nào', '<code>area:auth</code> · <code>area:feed</code> · <code>area:ui</code>'],
      ['Trạng thái đặc biệt', '<code>status:blocked</code> · <code>good-first-issue</code>'],
    ], { sm: true }) +
    table(['', 'Dùng khi'], [
      ['<b>Issue</b>', 'việc cụ thể, có “xong” — đóng được'],
      ['<b>Milestone</b>', 'rổ có hạn: “Sprint 2”, “Nộp giữa kỳ”'],
      ['<b>Discussion</b>', 'hỏi, ý tưởng — không đóng'],
    ], { sm: true }), 'r') },

  /* 5 */
  { t: 'Projects — bảng kanban tự chạy theo PR', body: `
    ${kanban()}
    ${box('info', 'Hai workflow có sẵn <b>bật mặc định</b> khi tạo project: issue/PR bị <b>đóng</b> ⇒ Status = <b>Done</b>; PR được <b>merge</b> ⇒ Done. Các luật khác (vd thêm vào ⇒ Todo) bật tay ở menu <b>Workflows</b> (docs GitHub, 09/2026).')}` },

  /* 6 */
  { t: 'CLI gh — những lệnh dùng hằng ngày', body: '<style>.k6 .g-term pre{font-size:14px}</style><div class="k6">' + two(
    table(['Việc', 'Lệnh'], [
      ['Xem issue đang mở', '<code>gh issue list -l type:bug</code>'],
      ['Tạo issue có nhãn + project', '<code>gh issue create -l type:bug -p "Sprint 1"</code>'],
      ['Tạo nhánh gắn issue', '<code>gh issue develop 12 --checkout</code>'],
      ['Mở PR từ commit', '<code>gh pr create --fill</code>'],
      ['Xem check của PR', '<code>gh pr checks --watch</code>'],
      ['Log của bước hỏng', '<code>gh run view --log-failed</code>'],
      ['Chạy lại job hỏng', '<code>gh run rerun &lt;id&gt; --failed</code>'],
      ['Đặt secret cho Actions', '<code>gh secret set VPS_HOST</code>'],
    ], { sm: true }),
    term([
      '$ gh issue develop --help',
      '  -c, --checkout      Checkout the branch after creating it',
      '  -n, --name string   Name of the branch to create',
      '$ gh project --help',
      'The minimum required scope for the token is: `project`.',
      '+ add the `project` scope by running `gh auth refresh -s project`.',
    ], { title: 'gh 2.93 — trích help, khoảng trắng rút gọn', dir: '~/thu-git' }), 'r') + '</div>' },

  /* 7 */
  { t: 'GitHub Actions: sự kiện → workflow → job → step', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'e1', x: 0, y: 20, w: 236, h: 64, t: 'pull_request', c: 'grn', mono: true },
      { id: 'e2', x: 0, y: 110, w: 236, h: 64, t: 'push → main', c: 'grn', mono: true },
      { id: 'e3', x: 0, y: 200, w: 236, h: 64, t: 'workflow_dispatch', c: 'dim', mono: true },
      { id: 'w', x: 290, y: 90, w: 200, h: 104, t: 'Workflow', d: '.github/workflows/\nci.yml', c: 'blu' },
      { id: 'j1', x: 540, y: 20, w: 250, h: 110, t: 'job: test (Node 20)', d: 'runs-on: ubuntu-latest\nmột máy ảo mới tinh', c: 'vio' },
      { id: 'j2', x: 540, y: 170, w: 250, h: 110, t: 'job: test (Node 22)', d: 'máy ảo KHÁC\nchạy SONG SONG', c: 'vio' },
      { id: 's', x: 870, y: 20, w: 290, h: 260, t: 'steps (tuần tự)', d: '1 checkout\n2 setup-node + cache\n3 npm ci\n4 npm run lint\n5 npm test\n⇒ một bước đỏ = job đỏ', c: 'amb', mono: true },
    ], edges: [
      { from: 'e1', to: 'w', c: 'grn' }, { from: 'e2', to: 'w', c: 'grn' }, { from: 'e3', to: 'w', c: 'dim', dash: true },
      { from: 'w', to: 'j1', c: 'vio' }, { from: 'w', to: 'j2', c: 'vio' },
      { from: 'j1', to: 's', c: 'amb' }, { from: 'j2', to: 's', c: 'amb', ts: 'l' },
    ] })}
    ${box('tip', 'Job chạy <b>song song</b> trừ khi có <code>needs:</code>. Mỗi job một máy sạch ⇒ file build ở job này <b>không</b> có ở job kia. Repo public: phút chạy runner chuẩn <b>miễn phí</b>; repo private dùng hạn mức theo gói (docs GitHub, 09/2026).')}` },

  /* 8 */
  { t: 'Giải phẫu một workflow — .github/workflows/ci.yml', body: `<style>.k8 .c-code{font-size:14.5px;line-height:1.28;padding:8px 14px}</style><div class="k8">` + two(
    code(`name: CI
on:                          # ① KHI NÀO chạy
  pull_request:
  push:
    branches: [main]
concurrency:                 # ② commit mới huỷ lượt cũ
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
permissions:
  contents: read             # ③ quyền tối thiểu
jobs:
  test:                      # ④ một job
    name: Test (Node \${{ matrix.node }})
    runs-on: ubuntu-latest   # ⑤ chạy trên máy nào
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
    steps:                   # ⑥ các bước, tuần tự
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test`, 'yaml'),
    list([
      '<b>① on</b> — sự kiện: PR và push vào main',
      '<b>② concurrency</b> — push 3 lần, chỉ lần mới nhất được chạy trọn',
      '<b>③ permissions</b> — <code>GITHUB_TOKEN</code> chỉ được đọc',
      '<b>④ jobs.test.name</b> — thành <b>tên check</b> trên PR',
      '<b>⑤ runs-on</b> — máy ảo GitHub cấp, xoá sau job',
      '<b>⑥ uses</b> = action người khác viết · <b>run</b> = lệnh shell',
      '<code>\${{ … }}</code> — biểu thức GitHub điền lúc chạy',
    ]), 'l2') + '</div>' },

  /* 9 */
  { t: 'Kiểm trên máy TRƯỚC khi push: actionlint + chính lệnh CI chạy', body: two(
    term([
      '$ actionlint',
      '! .github/workflows/ci.yml:3:3: unknown Webhook event "pull-request". [events]',
      '  |',
      '3 |   pull-request:',
      '! .github/workflows/ci.yml:16:29: property "nod" is not defined in object type {node: number} [expression]',
      '16 |           node-version: ${{ matrix.nod }}',
      '# sửa thành pull_request và matrix.node:',
      '$ actionlint; echo "exit=$?"',
      '= exit=0',
    ], { title: 'actionlint 1.7.12 — output thật, cắt bớt', dir: '~/thu-git' }),
    term([
      '$ npm test',
      'ok 1 - giỏ rỗng = 0',
      'ok 2 - cộng đúng giá × số lượng',
      '! not ok 3 - số lượng âm tính là 0',
      '    -60000 !== 0',
      '# pass 2',
      '! # fail 1',
      '$ echo $?',
      '! 1',
      '# exit ≠ 0 ⇒ step đỏ ⇒ job đỏ ⇒ check đỏ',
    ], { title: 'node --test — output thật, trước khi sửa', branch: 'main', dir: '~/thu-git' })) +
    box('info', 'GitHub không có phép màu: một step là một lệnh, <b>mã thoát khác 0 là đỏ</b>. Lệnh nào đỏ trên máy mình thì cũng đỏ trên CI — chạy nó trước khi push.') },

  /* 10 */
  { t: 'Matrix — một khai báo, nhiều job song song', body: two(
    code(`strategy:
  fail-fast: false
  matrix:
    node: [20, 22]
    os: [ubuntu-latest, windows-latest]
runs-on: \${{ matrix.os }}`, 'yaml') +
    box('warn', '<code>fail-fast</code> mặc định là <b>true</b>: một job hỏng ⇒ GitHub huỷ các job còn lại. Đang gỡ lỗi thì đặt <code>false</code> để thấy <b>đủ</b> bức tranh.'),
    diagram({ w: 560, h: 380, nodes: [
      { id: 'm', x: 170, y: 0, w: 220, h: 64, t: 'matrix 2 × 2', c: 'blu' },
      { id: 'a', x: 0, y: 130, w: 260, h: 72, t: 'ubuntu · Node 20', c: 'grn', mono: true },
      { id: 'b', x: 300, y: 130, w: 260, h: 72, t: 'ubuntu · Node 22', c: 'grn', mono: true },
      { id: 'c', x: 0, y: 260, w: 260, h: 72, t: 'windows · Node 20', c: 'red', mono: true, d: '✗ hỏng' },
      { id: 'd', x: 300, y: 260, w: 260, h: 72, t: 'windows · Node 22', c: 'red', mono: true, d: '✗ hỏng' },
    ], edges: [
      { from: 'm', to: 'a', c: 'blu' }, { from: 'm', to: 'b', c: 'blu' },
    ] }) + `<p style="font-size:16px;color:${G.mu};margin:4px 0 0">Hỏng cả hai ô Windows, ubuntu xanh ⇒ lỗi do <b style="color:#fff">hệ điều hành</b> (vd đường dẫn <code>\\</code>, CRLF) chứ không do Node.</p>`, 'r') },

  /* 11 */
  { t: 'Cache — không tải lại thư viện mỗi lần chạy', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'k', x: 0, y: 80, w: 250, h: 90, t: 'Tính key', d: 'OS + hash(package-lock)', c: 'blu' },
      { id: 'h', x: 330, y: 0, w: 250, h: 80, t: 'Trúng key', d: 'khôi phục ~/.npm · nhanh', c: 'grn' },
      { id: 'r', x: 330, y: 170, w: 250, h: 80, t: 'Trượt key', d: 'thử restore-keys (tiền tố)', c: 'amb' },
      { id: 'n', x: 660, y: 170, w: 230, h: 80, t: 'npm ci', d: 'tải phần còn thiếu', c: 'dim' },
      { id: 's', x: 950, y: 170, w: 210, h: 80, t: 'Lưu cache', d: 'dưới key MỚI', c: 'vio' },
    ], edges: [
      { from: 'k', to: 'h', c: 'grn' }, { from: 'k', to: 'r', c: 'amb' }, { from: 'r', to: 'n', c: 'dim' }, { from: 'n', to: 's', c: 'vio' },
    ] })}
    <style>.k11 .c-code{font-size:15px}</style><div class="k11">${two(code(`- uses: actions/setup-node@v4
  with: { node-version: 22, cache: npm }   # 1 dòng

- uses: actions/cache@v4                    # mọi thứ khác
  with:
    path: .next/cache
    key: build-\${{ runner.os }}-\${{ hashFiles('package-lock.json') }}
    restore-keys: build-\${{ runner.os }}-`, 'yaml'),
      list(['Đổi <code>package-lock.json</code> ⇒ key đổi ⇒ cache mới', 'Mặc định tối đa <b>10 GB/kho</b>; entry không dùng quá <b>7 ngày</b> bị xoá', 'Cache chỉ để <b>tăng tốc</b> — không bao giờ để giữ kết quả', '<code>gh cache list</code> · <code>gh cache delete</code>']), 'l2')}</div>` },

  /* 12 */
  { t: 'Secrets &amp; quyền — chìa khoá không nằm trong code', body: two(
    diagram({ w: 560, h: 400, nodes: [
      { id: 'g', x: 0, y: 0, w: 260, h: 84, t: 'gh secret set', d: 'hoặc Settings → Secrets', c: 'blu', mono: true },
      { id: 'v', x: 300, y: 0, w: 260, h: 84, t: '🔒 Kho secret', d: 'mã hoá, không đọc lại được', c: 'vio' },
      { id: 'j', x: 300, y: 150, w: 260, h: 84, t: 'Job', d: 'env: VPS_HOST', c: 'amb', mono: true },
      { id: 'l', x: 300, y: 300, w: 260, h: 84, t: 'Log', d: 'in ra thành ***', c: 'grn' },
      { id: 'b', x: 0, y: 300, w: 260, h: 84, t: 'echo $S | base64', d: 'lọt! che chỉ là khớp chuỗi', c: 'red', dash: true, mono: true },
    ], edges: [
      { from: 'g', to: 'v', c: 'blu' }, { from: 'v', to: 'j', c: 'vio', t: '${{ secrets.X }}', off: -4 },
      { from: 'j', to: 'l', c: 'grn' }, { from: 'j', to: 'b', c: 'red', dash: true, fs: 'l', ts: 't' },
    ] }),
    table(['Quy tắc', ''], [
      ['<code>permissions: contents: read</code> ở đầu file, mở rộng từng job', '+quyền tối thiểu'],
      ['Ưu tiên <code>GITHUB_TOKEN</code> (tự cấp mỗi lượt, hết hạn khi job xong)', '+hơn PAT'],
      ['Action bên thứ ba thấy secret ⇒ ghim <b>SHA đầy đủ</b>, không <code>@v4</code>', '!chuỗi cung ứng'],
      ['PR từ fork: <code>pull_request</code> <b>không</b> nhận secret', '+an toàn'],
      ['<code>pull_request_target</code> + checkout code PR', '-mã lạ chạy với secret'],
      ['<code>.env</code> thật ⇒ <code>gh secret set -f .env</code>', 'không commit'],
    ], { sm: true }), 'r') },

  /* 13 */
  { t: 'CI chặn merge — nối Actions với luật bảo vệ nhánh', body: two(
    diagram({ w: 560, h: 420, nodes: [
      { id: 'p', x: 0, y: 0, w: 260, h: 70, t: 'PR #13 → main', c: 'blu', mono: true },
      { id: 'a', x: 300, y: 0, w: 260, h: 70, t: 'Test (Node 20)', d: '✓ passed', c: 'grn', mono: true },
      { id: 'b', x: 300, y: 100, w: 260, h: 70, t: 'Test (Node 22)', d: '✗ failed', c: 'red', mono: true },
      { id: 'r', x: 0, y: 200, w: 260, h: 90, t: '🛡 Ruleset main', d: 'required checks:\nTest (Node 20), (Node 22)', c: 'amb' },
      { id: 'm', x: 300, y: 320, w: 260, h: 80, t: 'Nút Merge', d: 'KHOÁ tới khi đủ xanh', c: 'git' },
    ], edges: [
      { from: 'p', to: 'a', c: 'grn' }, { from: 'p', to: 'b', c: 'red', fs: 'b', ts: 'l' },
      { from: 'r', to: 'm', c: 'git', fs: 'b', ts: 'l' },
      { from: 'b', to: 'r', c: 'red', dash: true, fs: 'l', ts: 't' },
    ] }),
    steps([
      ['Cho workflow chạy <b>ít nhất một lần</b> trên PR', 'tên check đã từng chạy mới hiện ra để chọn trong luật'],
      ['Settings → Rules → Rulesets → <b>Require status checks to pass</b>', 'chọn đúng tên check — chính là <code>jobs.&lt;id&gt;.name</code>'],
      ['Đổi <code>name:</code> của job ⇒ tên check đổi', 'luật cũ chờ tên cũ ⇒ PR <b>Pending mãi</b>'],
      ['Workflow có <code>paths:</code> mà PR không chạm ⇒ không chạy', 'check bắt buộc cũng <b>Pending</b> (bài 6.4)'],
      ['<code>gh pr checks --required --watch</code>', 'xem đúng những check đang chặn'],
    ]), 'l') },

  /* 14 */
  { t: 'Bảo mật kho — sáu lớp, từ tài khoản tới nhật ký', body: `
    ${cards([
      { ic: '🔑', t: '1 · Tài khoản', d: '2FA bằng app TOTP + mã khôi phục; thêm <strong>passkey</strong> — gắn với tên miền nên chống được trang giả (phishing).', c: 'amb' },
      { ic: '👥', t: '2 · Ai vào được', d: 'Repo cá nhân: collaborator = <strong>ghi</strong>. Tổ chức: Read / Triage / Write / Maintain / Admin.', c: 'blu' },
      { ic: '📦', t: '3 · Thư viện', d: '<strong>Dependabot</strong>: cảnh báo lỗ hổng + tự mở PR nâng bản vá.', c: 'grn' },
      { ic: '🕵️', t: '4 · Bí mật', d: '<strong>Secret scanning</strong> quét lịch sử; <strong>push protection</strong> chặn ngay lúc push.', c: 'red' },
      { ic: '📮', t: '5 · Báo lỗ hổng', d: '<code>SECURITY.md</code> + <strong>Private vulnerability reporting</strong> — đừng để ai báo lỗ hổng bằng issue công khai.', c: 'vio' },
      { ic: '📜', t: '6 · Nhật ký', d: '<strong>Security log</strong> của tài khoản (90 ngày); tổ chức có <strong>audit log</strong>.', c: 'tea' },
    ], 3)}
    ${box('info', 'Bật ở <b>Settings → Advanced Security</b> của kho. Repo <b>public</b>: secret scanning chạy tự động, miễn phí. Repo private cá nhân: chỉ phần Dependabot (tính đến 09/2026).')}` },

  /* 15 */
  { t: 'Dependabot và push protection', body: two(
    `<b style="font-size:20px;color:${G.grn}">Dependabot — hai việc khác nhau</b>
    ${table(['', 'Alerts + security updates', 'Version updates'], [
      ['Bật ở', 'Advanced Security → Enable', 'file <code>.github/dependabot.yml</code>'],
      ['Mở PR khi', 'thư viện có <b>lỗ hổng</b> đã công bố', 'có <b>bản mới</b> theo lịch'],
      ['Nâng tới', 'bản nhỏ nhất đã vá', 'bản mới nhất'],
    ], { sm: true })}
    ${code(`version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"`, 'yaml')}`,
    `<b style="font-size:20px;color:${G.red}">Push protection — chặn TRƯỚC khi lộ</b>
    ${diagram({ w: 560, h: 250, nodes: [
      { id: 'p', x: 0, y: 0, w: 250, h: 70, t: 'git push', d: 'commit có ghp_… / sk_…', c: 'amb', mono: true },
      { id: 'x', x: 310, y: 0, w: 250, h: 70, t: '⛔ bị từ chối', d: 'kèm commit + đường dẫn', c: 'red' },
      { id: 'f', x: 0, y: 160, w: 250, h: 80, t: 'Đúng: gỡ khỏi commit', d: 'commit --amend / rebase -i', c: 'grn' },
      { id: 'b', x: 310, y: 160, w: 250, h: 80, t: 'Bỏ qua (có lý do)', d: 'test · false positive · sửa sau', c: 'dim', dash: true },
    ], edges: [
      { from: 'p', to: 'x', c: 'red' }, { from: 'x', to: 'f', c: 'grn' }, { from: 'x', to: 'b', c: 'dim', dash: true },
    ] })}
    ${box('warn', '“Push protection for users” <b>bật sẵn</b> cho mọi tài khoản khi push lên repo public. Khoá đã lỡ lên GitHub ⇒ <b>thu hồi khoá trước</b>, dọn lịch sử sau (bài 8.3).')}`) },

  /* 16 */
  { t: 'Quyền, SECURITY.md và nhật ký bảo mật', body: two(
    table(['Vai trò (repo tổ chức)', 'Làm được'], [
      ['Read', 'xem, clone, bình luận'],
      ['Triage', 'thêm: gắn nhãn, đóng/mở issue &amp; PR — không push'],
      ['Write', 'thêm: push nhánh, merge PR'],
      ['Maintain', 'thêm: quản lý repo, không đụng bảo mật/xoá'],
      ['!Admin', '!mọi thứ: bảo mật, xoá repo'],
    ], { sm: true }) +
    box('tip', 'Repo <b>cá nhân</b> chỉ có chủ + collaborator (quyền ghi). Nhóm SWP391 cần phân quyền ⇒ tạo <b>Organization</b> (miễn phí) và dùng <b>team</b>.'),
    code(`<!-- đặt ở gốc, docs/ hoặc .github/ -->
# Chính sách bảo mật

## Báo lỗ hổng
Đừng mở issue công khai. Dùng nút
**Report a vulnerability** của kho,
hoặc gửi mail cho trưởng nhóm.
Chúng tôi trả lời trong 3 ngày làm việc.`, 'plaintext') +
    list(['Tạo bằng: tab <b>Security and quality</b> → Security policy → <b>Start setup</b>', 'Nhật ký: ảnh đại diện → Settings → <b>Security log</b> (90 ngày) — lọc <code>operation:authentication</code>', 'Bạn rời nhóm ⇒ gỡ collaborator ngay, xoá deploy key họ biết']), 'l') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 11', body: table(['Muốn…', 'Gõ / bật'], [
    ['Tạo nhánh cho issue #12 rồi chuyển sang', '<code>gh issue develop 12 --checkout</code>'],
    ['Merge PR là issue tự đóng', '<code>Closes #12</code> trong mô tả PR hoặc lời nhắn commit'],
    ['Thẻ Projects tự sang Done', 'workflow mặc định: closed / merged ⇒ Done'],
    ['Kiểm workflow trước khi push', '<code>actionlint</code> + chạy đúng lệnh <code>npm test</code>'],
    ['Chỉ chạy commit mới nhất của PR', '<code>concurrency: … cancel-in-progress: true</code>'],
    ['Thử nhiều phiên bản/HĐH', '<code>strategy.matrix</code> + <code>fail-fast: false</code>'],
    ['Đọc lỗi CI trong terminal', '<code>gh run view --log-failed</code> · <code>gh run rerun &lt;id&gt; --failed</code>'],
    ['Để CI chặn merge', 'Ruleset → Require status checks → chọn tên job'],
    ['Cảnh báo + PR vá thư viện', 'Settings → Advanced Security → Dependabot'],
    ['Chặn lộ khoá khi push', 'Secret scanning + push protection'],
    ['Tài khoản an toàn', '2FA (app TOTP) + passkey + cất mã khôi phục'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 11 (60 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo 3 nhãn, 1 milestone “Sprint 1”, 1 project bảng', '<code>gh auth refresh -s project</code> nếu dùng <code>gh project</code>'],
      ['Mở issue lỗi thật, <code>gh issue develop &lt;n&gt; --checkout</code>, sửa + test', 'commit có <code>Closes #&lt;n&gt;</code>'],
      ['Thêm <code>.github/workflows/ci.yml</code> (matrix Node 20/22), chạy <code>actionlint</code> + <code>npm test</code>', 'exit 0 cả hai rồi mới push'],
      ['Mở PR, xem <code>gh pr checks --watch</code>; cố ý làm đỏ một lần, đọc <code>gh run view --log-failed</code>', 'sửa, push lại, xanh'],
      ['Bật Dependabot + thêm <code>SECURITY.md</code>; bật 2FA/passkey cho tài khoản', 'merge PR ⇒ issue tự đóng, thẻ sang Done'],
    ])}
    ${box('good', '<b>Đạt khi:</b> issue Closed bởi PR, thẻ ở cột Done, tab Actions có một lượt đỏ và một lượt xanh cho cùng PR, và Settings → Advanced Security hiện Dependabot alerts “Enabled”.')}` },
]);
