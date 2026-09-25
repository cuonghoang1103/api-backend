/**
 * GitHub Actions · Deck ga-13 — Chương 13: Runner của riêng bạn.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch13-runner (runner 2.337.0, ubuntu-24.04 20260920.314.1):
 *   36074805297 ch13-ben-trong (tiến trình, thư mục, kết nối, nhật ký _diag — x64 + arm64)
 *   36074652076 ch13-dung-anh-runner (dựng ảnh runner ephemeral, config.sh --help, ba lỗi đăng ký)
 *   36074706877 ch13-ban (máy sạch giữa hai job, tiến trình mồ côi, đối số dòng lệnh) · 36074652145 (bản đầu, đỏ)
 *   36074652000 ch13-dich-vu (services: Postgres trên máy / trong container / không health-check)
 * Job self-hosted (ch13-tu-host.yml, workflow_dispatch, nhãn ch13-tam-thoi) CHƯA chạy: phiên dựng bài không có
 * Docker daemon, không có token đăng ký runner (API cần quyền admin), và dispatch trả 404 vì tệp chưa có trên main.
 * Giá: github/docs (billing/reference/actions-runner-pricing, 09/2026). Docs khác: bản clone github/docs f71cc2a.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, kpis, steps, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-13', code: 'GITHUB ACTIONS · CHƯƠNG 13', title: 'Runner của riêng bạn', sub: 'GitHub Actions · Chương 13' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 3 — runner KÉO việc về (long-poll ra ngoài) ───────────── */
const keoViec = () => diagram({
  w: 1160, h: 430,
  nodes: [
    { id: 'ev', x: 0, y: 20, w: 250, h: 84, t: 'push / PR / dispatch', d: 'sự kiện trên GitHub', c: 'dim' },
    { id: 'gh', x: 0, y: 180, w: 250, h: 110, t: 'Actions service', d: 'xếp job vào hàng\ntheo nhãn runs-on', c: 'dk' },
    { id: 'lis', x: 470, y: 180, w: 280, h: 110, t: 'Runner.Listener', d: 'giữ MỘT kết nối HTTPS :443\nra ngoài, chờ việc', c: 'tea', mono: false },
    { id: 'wk', x: 880, y: 180, w: 280, h: 110, t: 'Runner.Worker', d: 'một tiến trình / một job\nchạy từng bước', c: 'grn' },
    { id: 'st', x: 880, y: 340, w: 280, h: 80, t: 'các bước run / uses', d: 'trong thư mục _work', c: 'amb' },
    { id: 'fw', x: 470, y: 20, w: 280, h: 84, t: 'Tường lửa của bạn', d: 'KHÔNG cần mở cổng vào', c: 'red', dash: true },
  ],
  edges: [
    { from: 'ev', to: 'gh', t: 'tạo run' },
    { from: 'lis', to: 'gh', t: 'long-poll 443', c: 'tea', bend: -70, off: -6 },
    { from: 'gh', to: 'lis', t: 'Job request', c: 'dk', bend: 70, off: 14 },
    { from: 'lis', to: 'wk', t: 'spawn' },
    { from: 'wk', to: 'st' },
  ],
});

/* ───────────── Slide 9 — vòng đời runner ephemeral ───────────── */
const vongDoi = () => {
  let s = '';
  const X = (k) => 40 + k * 215;
  const st = (k, h, d, c) => R(X(k), 60, 190, 120, { c, fill: '#0f182a' }) + T(X(k) + 95, 100, h, { fs: 18, b: true, a: 'middle', c }) +
    T(X(k) + 95, 130, d[0], { fs: 15, a: 'middle', c: 'mu' }) + T(X(k) + 95, 154, d[1] || '', { fs: 15, a: 'middle', c: 'mu' });
  s += st(0, '① Xin token', ['API, quyền admin', 'sống 1 giờ'], 'amb');
  s += st(1, '② config.sh', ['--ephemeral', '--labels ch13-tam-thoi'], 'dk');
  s += st(2, '③ run.sh', ['Listening for Jobs', 'long-poll 443'], 'tea');
  s += st(3, '④ Một job', ['runs-on khớp nhãn', 'Worker chạy bước'], 'grn');
  s += st(4, '⑤ Tự gỡ', ['GitHub huỷ đăng ký', 'container --rm biến mất'], 'vio');
  for (let k = 0; k < 4; k++) s += A(X(k) + 192, 120, X(k + 1) - 4, 120, { c: 'mu' });
  s += R(0, 220, 1160, 200, { c: 'dim', fill: 'rgba(255,255,255,.02)' });
  s += T(20, 256, 'Vì sao ephemeral:', { fs: 18, b: true, c: 'dk' });
  s += T(20, 290, '• GitHub gán cho nó ĐÚNG MỘT job — docs: không bảo đảm được điều này với runner bền (persistent).', { fs: 16 });
  s += T(20, 320, '• Job sau không bao giờ thấy tệp, tiến trình, token của job trước: máy chết theo job.', { fs: 16 });
  s += T(20, 350, '• Runner ephemeral không kết nối quá 1 ngày thì GitHub tự xoá (runner thường: 14 ngày).', { fs: 16 });
  s += T(20, 390, 'Không có ⑤ thì runner nằm lại trong Settings → Actions → Runners và tiếp tục nhận job — đó là rủi ro.', { fs: 16, c: 'amb', b: true });
  return sv(1160, 425, s);
};

/* ───────────── Slide 15 — PR từ fork chạy trên máy bạn ───────────── */
const forkPR = () => diagram({
  w: 1160, h: 430,
  nodes: [
    { id: 'la', x: 0, y: 30, w: 250, h: 90, t: 'Người lạ', d: 'fork kho PUBLIC của bạn', c: 'red' },
    { id: 'pr', x: 0, y: 220, w: 250, h: 100, t: 'Mở pull request', d: 'sửa workflow hoặc\nscript test/build', c: 'amb' },
    { id: 'wf', x: 440, y: 220, w: 280, h: 100, t: 'on: pull_request', d: 'runs-on: self-hosted', c: 'dk' },
    { id: 'may', x: 880, y: 160, w: 280, h: 220, t: 'Máy của bạn', d: 'mạng nhà / VPS\nkhoá SSH, .env, Docker\nchạy mã của PR\nvà có thể còn lại\nsau khi job xong', c: 'red' },
    { id: 'ch', x: 440, y: 30, w: 280, h: 100, t: 'Cổng duyệt', d: 'Require approval for\nfork PR workflows', c: 'grn', dash: true },
  ],
  edges: [
    { from: 'la', to: 'pr' },
    { from: 'pr', to: 'wf', t: 'sự kiện' },
    { from: 'wf', to: 'may', t: 'job', c: 'red' },
    { from: 'pr', to: 'ch', c: 'grn', dash: true },
  ],
});

/* ───────────── Slide 20 — không health-check: bước đầu tới sớm ───────────── */
const toiSom = () => {
  let s = '';
  const X = (ms) => 60 + ms * 0.75; // 0 = 23:49:59.666 (bước đầu bắt đầu)
  s += `<line x1="${X(-100)}" y1="200" x2="${X(1400)}" y2="200" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 200, 400, 600, 800, 1000, 1200].forEach((k) => { s += T(X(k), 226, `+${k} ms`, { fs: 14, c: 'dim', a: 'middle', mono: true }); });
  [0, 229, 458, 687, 916].forEach((k, i) => {
    s += `<circle cx="${X(k)}" cy="150" r="13" fill="${D.red}"/>` + T(X(k), 156, '✗', { fs: 14, c: '#08101e', a: 'middle', b: true });
    if (i === 0) s += T(X(k), 120, 'pg_isready: chưa', { fs: 14, c: 'red', a: 'middle' });
  });
  s += `<circle cx="${X(1145)}" cy="150" r="13" fill="${D.grn}"/>` + T(X(1145), 156, '✓', { fs: 14, c: '#08101e', a: 'middle', b: true });
  s += T(X(1145) + 20, 156, 'lần thứ 6', { fs: 14, c: 'grn' });
  s += `<line x1="${X(1135)}" y1="60" x2="${X(1135)}" y2="200" stroke="${D.grn}" stroke-width="2" stroke-dasharray="6 5"/>`;
  s += T(X(1135) - 8, 52, 'Postgres: ready to accept connections', { fs: 14.5, c: 'grn', a: 'end', mono: true });
  s += `<line x1="${X(0)}" y1="60" x2="${X(0)}" y2="200" stroke="${D.amb}" stroke-width="2" stroke-dasharray="6 5"/>`;
  s += T(X(0) + 8, 52, 'bước đầu tiên bắt đầu', { fs: 14.5, c: 'amb' });
  s += R(0, 262, 1160, 160, { c: 'amb', fill: 'rgba(255,194,51,.07)' });
  s += T(20, 296, 'Job khong-cho: services: không có options --health-*', { fs: 17, b: true, c: 'amb', mono: false });
  s += T(20, 328, 'Log vẫn in “csdl service is healthy.” — không có health-check thì runner coi như xong ngay.', { fs: 16 });
  s += T(20, 358, 'Đo: “san sang sau 5 lan thu, 1145 ms ke tu buoc dau tien” (mỗi lần ~0,23 s). Bước đầu mà là migrate thì đỏ.', { fs: 16 });
  s += T(20, 390, 'Có --health-cmd: runner tự chờ “starting … waiting 2 seconds” tới “healthy” rồi mới chạy bước.', { fs: 16, c: 'grn' });
  return sv(1160, 425, s);
};

/* ───────────── Slide 21 — ARC ───────────── */
const arc = () => diagram({
  w: 1160, h: 440,
  nodes: [
    { id: 'gh', x: 0, y: 170, w: 230, h: 100, t: 'GitHub Actions', d: 'job chờ nhãn\narc-runner-set', c: 'dk' },
    { id: 'ls', x: 330, y: 170, w: 250, h: 100, t: 'Listener pod', d: 'long-poll HTTPS\nnhận “Job Available”', c: 'tea' },
    { id: 'ct', x: 330, y: 10, w: 250, h: 90, t: 'Controller', d: 'cài bằng Helm', c: 'vio' },
    { id: 'ers', x: 680, y: 170, w: 230, h: 100, t: 'EphemeralRunnerSet', d: 'listener patch replicas\n= số job (min..max)', c: 'amb' },
    { id: 'p1', x: 990, y: 40, w: 170, h: 80, t: 'runner pod', d: '1 job rồi xoá', c: 'grn' },
    { id: 'p2', x: 990, y: 180, w: 170, h: 80, t: 'runner pod', d: 'token JIT', c: 'grn' },
    { id: 'p3', x: 990, y: 320, w: 170, h: 80, t: 'runner pod', d: '0 khi rảnh', c: 'grn', dash: true },
  ],
  edges: [
    { from: 'ls', to: 'gh', c: 'tea' },
    { from: 'ct', to: 'ls', t: 'tạo' },
    { from: 'ls', to: 'ers', c: 'amb' },
    { from: 'ers', to: 'p1' }, { from: 'ers', to: 'p2' }, { from: 'ers', to: 'p3', dash: true },
  ],
});

export const slides = S([
  /* 1 */ cover({ t: 'Chương 13 — Runner của riêng bạn', sub: 'runner làm việc thế nào · tự dựng runner ephemeral · bảo mật self-hosted · container & services · mở rộng', chap: 'CHƯƠNG 13' }),

  /* 2 */ { t: 'Bản đồ chương: từ “máy của GitHub” tới “máy của bạn”', body: mindmap('Runner', 'cái máy thật sự chạy các bước của bạn — và khi nào nên là máy của bạn', [
    { t: '13.1 Runner hoạt động', d: 'long-poll · Listener/Worker · _work · giá · nhãn · nhóm', c: 'dk' },
    { t: '13.2 Tự dựng runner', d: 'container ephemeral · một job · tự gỡ · ba lỗi đăng ký', c: 'tea' },
    { t: '13.3 Bảo mật & container', d: 'fork PR · máy bẩn · container: · services: Postgres', c: 'red' },
    { t: '13.4 Mở rộng', d: 'ARC · autoscaling · máy nhà build · khi nào đáng', c: 'amb' },
  ]) },

  /* ───── 13.1 ───── */
  /* 3 */ { t: 'Runner KÉO việc về: kết nối ra ngoài, không mở cổng vào', body: keoViec() },

  /* 4 */ { t: 'Một runner thật: ba lớp tiến trình, không cổng nào nghe', body: two(
    t(['$ ps -eo pid,ppid,user,etime,args --forest', '1840    1 runner 01:06 /opt/hca/hosted-compute-agent', '1854 1840 root   01:06  \\_ sudo -n ... /tmp/provjobd…', '1869 1840 runner 00:04  \\_ …/2.337.0/bin/Runner.Listener run', '1888 1869 runner 00:02      \\_ …/bin/Runner.Worker spawnclient', '', '$ sudo ss -tnp state established   # Runner', '10.1.0.230:46716 -> 20.209.178.193:443', '10.1.0.230:53068 -> 140.82.114.21:443', '… 7 kết nối, TẤT CẢ tới cổng 443', '$ sudo ss -tlnp | grep -i runner', '+ (khong co — runner khong mo cong nao)'], 'run 36074805297 · ubuntu-24.04', 14),
    list([
      '<strong>Runner.Listener</strong>: tiến trình sống lâu, giữ kết nối tới GitHub và chờ việc. Trên máy của GitHub nó chỉ mới sống <strong>4 giây</strong> — máy được dựng cho đúng job này.',
      '<strong>Runner.Worker</strong>: sinh ra cho MỘT job, chạy các bước rồi thoát.',
      '<code>hosted-compute-agent</code> là lớp của riêng GitHub; máy self-hosted của bạn chỉ có Listener + Worker.',
      'Mọi kết nối đều đi <strong>ra</strong> cổng 443, không có cổng <strong>nghe</strong> nào: máy nhà sau NAT vẫn làm runner được.',
    ])) },

  /* 5 */ { t: '_diag: từ “Listening for Jobs” tới nhận job — 1 giây', body: two(
    t(['# _diag/Runner_20260924-235138-utc.log', '23:51:38 Using BrokerMessageListener', '23:51:38 Attempt to create session.', '23:51:38 Connecting to the Broker Server...', '23:51:39 Session created.', '23:51:39 Listening for Jobs', '23:51:39 JobDispatcher] Job request 0 for plan', '         1519cd73-… job eade6ae5-… received.', '23:51:39 Received job status event. JobState: Busy', '# _diag/Worker_20260924-235140-utc.log', '23:51:40 Receiving message of length 26092', '23:51:40 Worker] Job message:', '!   "lit": "d=$(sudo find /home/runner /opt …', '    "messageType": "RunnerJobRequest"'], 'run 36074805297 · …/cached/2.337.0/_diag', 13.5),
    list([
      'Runner mở một <strong>phiên</strong> với Broker, rồi nằm chờ (long-poll). Có job hợp nhãn thì GitHub trả về ngay trong kết nối đó.',
      'Worker nhận <strong>toàn bộ job</strong> (26 KB JSON) qua kênh nội bộ — trong đó có <strong>nguyên văn script</strong> mọi bước.',
      'Trên self-hosted, tệp <code>_diag</code> này nằm lại trên đĩa của bạn sau job: bằng chứng tốt khi gỡ lỗi, và là thứ phải dọn khi máy dùng chung.',
      'x64 ở <code>…/cached/2.337.0/_diag</code>; arm64 ở <code>/home/runner/extracted/_diag</code> — cùng một chuỗi dòng log.',
    ])) },

  /* 6 */ { t: 'Thư mục _work: còn nguyên cho job sau nếu máy còn sống', body: two(
    yaml([['/home/runner/work/', 'RUNNER_WORKSPACE = …/ga-san-tap'], ['  ga-san-tap/ga-san-tap/', 'GITHUB_WORKSPACE — mã checkout'], ['  _actions/actions/…', 'action đã tải (uses:)'], ['  _temp/', 'RUNNER_TEMP'], ['    <uuid>.sh', 'script của mỗi bước run:'], ['    _runner_file_commands/', 'GITHUB_OUTPUT, GITHUB_ENV…'], ['    _github_workflow/', 'payload sự kiện'], ['  _PipelineMapping/', 'kho nào → thư mục nào'], ['/opt/hostedtoolcache', 'RUNNER_TOOL_CACHE (setup-node…)'], ['~/actions-runner/cached/', '2.336.0  2.337.0'], ['  2.337.0/_diag/', 'Runner_*.log  Worker_*.log']], { fs: 15 }),
    list([
      'Trên runner <strong>self-hosted</strong>, cả cây này là của bạn và <strong>không tự biến mất</strong>: <code>_temp</code> được dọn đầu job, còn workspace, <code>_actions</code>, tool cache, ảnh Docker thì ở lại.',
      'Vì thế job thứ hai chạy nhanh hơn (cache ấm) — và cũng vì thế nó thấy được thứ job trước để lại.',
      'Đường dẫn trong container job khác hẳn: <code>/__w/ga-san-tap/ga-san-tap</code>, <code>/__t</code>, <code>/__e</code> (slide 18).',
    ])) },

  /* 7 */ { t: 'Hosted hay self-hosted: trả tiền phút, hay trả công sức', body: table(['', 'GitHub-hosted chuẩn', 'Larger runner (hosted)', 'Self-hosted'], [
    ['Giá (09/2026)', 'kho public: <strong>miễn phí</strong>; kho riêng: Linux 2 lõi $0,006/phút, Windows $0,010, macOS $0,062 sau hạn mức', 'Linux 4 lõi $0,012 · 8 lõi $0,022 · 16 lõi $0,042 — <strong>không</strong> miễn phí cả ở kho public', '+Actions không tính phí; bạn trả máy, điện, mạng, thời gian'],
    ['Máy', 'kho public: 4 CPU / 16 GB (Linux); riêng tư: 2 CPU / 8 GB', 'tới 96 lõi, GPU, IP tĩnh', 'bất cứ thứ gì bạn có'],
    ['Sạch mỗi job', '+máy mới, huỷ sau job', '+máy mới', '-KHÔNG, trừ khi bạn làm ephemeral'],
    ['Cache / công cụ', 'tải lại mỗi job', 'tải lại mỗi job', '+ấm sẵn trên đĩa'],
    ['Mạng nội bộ', '-không thấy VPS / LAN của bạn', 'mạng riêng (Azure VNET)', '+nằm ngay trong mạng'],
    ['Bảo trì', 'GitHub lo', 'GitHub lo', '-bạn vá OS; runner phải cập nhật trong 30 ngày'],
  ], { sm: true }) + box('info', 'Nguồn: bảng giá runner trong github/docs (09/2026). Làm tròn lên phút <strong>mỗi job</strong>. Hạn mức kho riêng: 2.000 phút (Free), 3.000 (Pro).') },

  /* 8 */ { t: 'runs-on: nhãn cộng dồn; không ai nhận thì chờ 24 giờ', body: two(
    `${yaml([['runs-on: ubuntu-24.04', 'nhãn hosted'], ['runs-on: [self-hosted, linux, x64, gpu]', 'runner phải có ĐỦ 4'], ['runs-on:', ''], ['  group: nha-build', 'nhóm runner (tổ chức)'], ['  labels: [self-hosted, ch13-tam-thoi]', 'nhóm VÀ nhãn']], { fs: 15 })}
     ${box('warn', 'Không runner nào khớp: job <strong>không đỏ</strong>, nó xếp hàng. Self-hosted: tự huỷ sau <strong>24 giờ</strong> chờ. <code>timeout-minutes</code> không tính lúc chờ (đo ở bài 2.1: vẫn queued sau 6m17s).')}`,
    list([
      'Runner mới đăng ký có sẵn 3 nhãn mặc định <code>self-hosted, Linux, X64</code> (<code>--no-default-labels</code> để bỏ) + nhãn bạn thêm bằng <code>--labels</code>.',
      '<strong>Nhóm runner</strong> chỉ có ở <strong>tổ chức</strong> (gói Team trở lên cho GitHub.com): giới hạn kho nào được dùng. Mặc định nhóm chỉ mở cho kho <strong>riêng tư</strong>.',
      'Kho cá nhân như sân tập: runner gắn thẳng vào kho, không có nhóm.',
      'actionlint không biết nhãn tự đặt: khai trong <code>.github/actionlint.yaml</code> → <code>self-hosted-runner.labels</code>.',
    ])) },

  /* ───── 13.2 ───── */
  /* 9 */ { t: 'Runner ephemeral: đăng ký → ĐÚNG MỘT job → biến mất', body: vongDoi() },

  /* 10 */ { t: 'Ảnh runner: tarball chính thức, người dùng không root', body: two(
    yaml([['FROM ubuntu:24.04', ''], ['ARG RUNNER_VERSION=2.337.0', 'ghim bản; --disableupdate'], ['RUN apt-get install -y … curl jq git tini', 'tini: PID 1 chuyển tín hiệu'], ['RUN useradd --create-home --uid 1001 runner', 'config.sh từ chối root'], ['WORKDIR /home/runner', ''], ['RUN curl -fsSL -o runner.tgz \\', ''], ['    …/actions/runner/releases/download/\\', ''], ['    v${RUNNER_VERSION}/actions-runner-linux-…', ''], [' && tar xzf runner.tgz \\', ''], [' && ./bin/installdependencies.sh', 'libicu… của .NET'], ['COPY khoi-dong.sh /home/runner/', ''], ['USER runner', ''], ['ENTRYPOINT ["/usr/bin/tini", "--",', ''], ['            "/home/runner/khoi-dong.sh"]', '']], { fs: 13.5, lang: 'docker' }),
    t(['# dựng thật trên runner GitHub-hosted', '$ gh api repos/actions/runner/releases/latest', 'v2.337.0 2026-08-26T14:33:29Z', '$ docker build -q -t ga13-runner ch13/runner', 'sha256:c048e157f0ca016e…', '+ build xong sau 42s', '$ docker images ga13-runner', '+ ga13-runner:latest 882MB', '$ docker run --rm --entrypoint ./config.sh \\', '    ga13-runner --version', '2.337.0'], 'run 36074652076 · job dung-anh', 14.5)) },

  /* 11 */ { t: 'khoi-dong.sh: --ephemeral, nhãn riêng, lối gỡ khẩn', body: two(
    yaml([['set -euo pipefail', ''], [': "${REPO_URL:?thieu REPO_URL}" …', 'thiếu biến ⇒ dừng ngay'], ['go_bo() {', ''], ['  [ -f .runner ] && [ -n "$REMOVE_TOKEN" ] &&', 'còn đăng ký?'], ['    ./config.sh remove --token "$REMOVE_TOKEN"', 'token GỠ, khác token đăng ký'], ['}', ''], ['trap go_bo EXIT', 'container bị dừng giữa chừng'], ['./config.sh --unattended \\', 'không hỏi gì'], ['  --url "$REPO_URL" --token "$RUNNER_TOKEN" \\', ''], ['  --name "$TEN" --labels "$NHAN" \\', 'ch13-tam-thoi'], ['  --ephemeral --disableupdate --work _work', ''], ['./run.sh', 'thoát sau đúng 1 job']], { fs: 14 }),
    t(['$ ./config.sh --help   # (lọc)', '--unattended   Disable interactive prompts', '--labels       Custom labels that will be added', '--no-default-labels  Disables adding the default', "               labels: 'self-hosted,Linux,X64'", '--runnergroup  Name of the runner group …', '--replace      Replace any existing runner with', '               the same name', '--disableupdate  Disable self-hosted runner', '               automatic update', '--ephemeral    Configure the runner to only take', '               one job and then let the service', '               un-configure the runner after the', '               job finishes (default false)'], 'run 36074652076 · config.sh 2.337.0', 13.5)) },

  /* 12 */ { t: 'Ba cách hỏng lúc đăng ký — dừng ngay, đọc được', body: two(
    t(['# 1. thiếu biến môi trường', '$ docker run --rm ga13-runner', '! /home/runner/khoi-dong.sh: line 5: REPO_URL:', '!   thieu REPO_URL', 'exit=1', '', '# 2. chạy bằng root', '$ docker run --rm --user root \\', '    --entrypoint ./config.sh ga13-runner …', '! Must not run with sudo', 'exit=1'], 'run 36074652076', 14.5),
    t(['# 3. token giả (gia-tri-thu-khong-that-123)', '|        Self-hosted runner registration        |', '# Authentication', "! Http response code: NotFound from", "!   'POST https://api.github.com/actions/", "!   runner-registration'", '! {"message":"Not Found",…,"status":"404"}', '! Response status code does not indicate', '!   success: 404 (Not Found).', '$ docker ps -aq --filter ancestor=ga13-runner \\', '    | wc -l', '+ 0'], 'cùng run · token hỏng/hết hạn cũng ra 404', 14)) },

  /* 13 */ { t: 'Một buổi trên Mac: token → container → một job → biến mất', body: two(
    steps([
      ['Xin <code>registration-token</code> + <code>remove-token</code>', 'API, quyền ADMIN kho, sống 1 giờ'],
      ['<code>docker run -d --rm ga13-runner</code>', 'token qua -e, không ghi vào ảnh'],
      ['Runner <em>online</em> → <code>gh workflow run ch13-tu-host.yml</code>', 'một job, nhãn ch13-tam-thoi'],
      ['<code>docker wait</code>: container tự thoát', 'GitHub huỷ đăng ký, --rm xoá container'],
      ['Liệt kê runner: không còn tên đó', 'kẹt: <code>go-khan-cap.sh</code>'],
    ]),
    `${box('warn', '<strong>⏳ Chưa chạy thật trên cloud</strong> khi dựng bài: không có Docker daemon, không có token (API đăng ký cần quyền admin), và <code>workflow_dispatch</code> trả <strong>404</strong> vì tệp chỉ nằm trên nhánh — dispatch cần tệp có trên nhánh mặc định. Kịch bản <code>chay-mot-job.sh</code> đã sẵn.')}
     ${box('bad', '<code>ch13-tu-host.yml</code> CHỈ có <code>workflow_dispatch</code>. Không workflow <code>pull_request</code> nào được <code>runs-on</code> nhãn này.')}`) },

  /* 14 */ { t: 'Chạy ephemeral trong container: thứ gì mất theo job, thứ gì còn', body: table(['', 'Runner bền trên máy (config.sh một lần)', 'Runner ephemeral trong container --rm'], [
    ['Số job', '-vô hạn, tới khi bạn gỡ', '+đúng 1'],
    ['Tệp job trước để lại (_work, /tmp, ~)', '-còn', '+mất cùng container'],
    ['Tiến trình chạy nền', 'runner giết “orphan” cuối job', '+container chết là hết'],
    ['Token GITHUB_TOKEN / secret trên đĩa', '-có thể còn (.git/config nếu Post không chạy)', '+mất'],
    ['Cache ấm (npm, ảnh Docker)', '+có sẵn', '-lạnh mỗi job — gắn volume cache CÓ CHỦ ĐÍCH'],
    ['Cập nhật runner', 'tự cập nhật', '<code>--disableupdate</code> + dựng lại ảnh ≤ 30 ngày'],
    ['Nhật ký _diag', 'tích lại trên đĩa', '-mất — docs: chuyển log ra ngoài trước khi lên production'],
  ], { sm: true }) },

  /* ───── 13.3 ───── */
  /* 15 */ { t: 'Kho PUBLIC + self-hosted = máy của bạn chạy mã của người lạ', body: forkPR() },

  /* 16 */ { t: 'Hosted sạch sau mỗi job: hai job, hai máy, không dấu vết', body: two(
    t(['# job de-lai · GitHub Actions 1000004724', 'tu job de-lai, run 36074706877', '  -> /tmp/ch13-dau-vet  ~/ch13-dau-vet', 'da chay nen sleep 600, pid 2048', '...', 'Cleaning up orphan processes', '+ Terminate orphan process: pid (2048) (sleep)', '+ Terminate orphan process: pid (2052) (bash)'], 'run 36074706877 · job 1', 14.5),
    t(['# job xem-lai (needs: de-lai)', 'RUNNER_NAME=GitHub Actions 1000004727', '+ sach: khong co /tmp/ch13-dau-vet', '+ sach: khong co /home/runner/ch13-dau-vet', '+ khong co tien trinh sleep nao', '', '# trên runner self-hosted BỀN:', '! tiến trình: bị giết cuối job (như trái)', '! /tmp, ~, _work: VẪN CÒN cho job sau', '! -> job sau đọc được'], 'cùng run · job 2', 14.5)) },

  /* 17 */ { t: 'Máy dùng chung: log che secret, còn ps thì không', body: two(
    t(['# bước 1: echo "::add-mask::gia-tri-thu-…"', '# bước 2:', "$ bash -c 'sleep 20; true' ch13 --token=*** &", '$ ps -eo pid,user,args | grep -- --token', '   2052 runner   bash -c sleep 20; true ch13', '                 --token=***', '! so tien trinh co chuoi that trong doi so: 2', '# log che thành ***, nhưng giá trị nằm nguyên', '# trong /proc của máy: ai cùng máy cũng đọc được'], 'run 36074706877 · giá trị GIẢ', 14),
    list([
      'Docs (Hardening for self-hosted runners): một job dùng secret làm <strong>đối số dòng lệnh</strong> thì job khác chạy cùng runner thấy được bằng <code>ps x -w</code>.',
      'Mask chỉ tác động lên <strong>log</strong>. Bản đầu (run 36074652145) còn lộ: <code>add-mask</code> đặt cùng bước với lệnh, script đã in ra trước khi mask có hiệu lực.',
      'Vá: truyền secret qua <strong>biến môi trường / stdin / tệp tạm</strong>, không qua đối số; mỗi job một máy (ephemeral).',
      '<code>_diag/Worker_*.log</code> cũng lưu nguyên văn script (slide 5). Không đặt secret vào chữ của script.',
    ])) },

  /* 18 */ { t: 'container: không phải ranh giới — docker.sock được mount', body: two(
    t(['/usr/bin/docker create --name 8932…_node22bookwormslim', '  --workdir /__w/ga-san-tap/ga-san-tap', '  --network github_network_d4f5…', '  -e "HOME=/github/home" -e GITHUB_ACTIONS=true', '! -v "/var/run/docker.sock":"/var/run/docker.sock"', '  -v "/home/runner/work":"/__w"', '  -v "…/2.337.0/externals":"/__e":ro', '  -v "/opt/hostedtoolcache":"/__t"', '  --entrypoint "tail" node:22-bookworm-slim', '  "-f" "/dev/null"', '# trong bước:', 'PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"', 'whoami=root · PID 1 = tail -f /dev/null', '+ shell: sh -e {0}   (không phải bash)'], 'run 36074652000 · job trong-container', 13.5),
    list([
      'Runner dựng một container sống suốt job (<code>tail -f /dev/null</code>) rồi <code>docker exec</code> từng bước vào đó.',
      'Workspace, tool cache, <code>externals</code> (Node của runner) được <strong>mount</strong> từ máy vào.',
      '<strong>docker.sock</strong> được mount: bước trong container điều khiển được Docker của máy chủ. Container job <strong>không phải</strong> ranh giới bảo mật.',
      'Shell mặc định trong container là <code>sh</code>. Cần bash: <code>defaults.run.shell: bash</code> và ảnh phải có bash.',
      'Chỉ chạy trên runner <strong>Linux</strong> có Docker.',
    ])) },

  /* 19 */ { t: 'services: Postgres — runner tự chờ health-check', body: two(
    `${yaml([['services:', ''], ['  csdl:', 'tên = hostname trong mạng'], ['    image: postgres:17-alpine', ''], ['    env:', ''], ['      POSTGRES_PASSWORD: gia-tri-thu-…', 'in THẲNG trong log'], ['    ports: [\'5432:5432\']', 'job trên máy: localhost'], ['    options: >-', ''], ['      --health-cmd "pg_isready -U postgres"', ''], ['      --health-interval 2s --health-retries 15', 'runner chờ healthy']], { fs: 14 })}
     ${box('warn', 'Giá trị trong <code>env:</code> của service hiện nguyên văn trong dòng <code>docker create</code>. Mật khẩu thật thì lấy từ <code>secrets.*</code>.')}`,
    t(['##[group]Waiting for all services to be ready', 'starting', 'csdl service is starting, waiting 2 seconds', '  before checking again.', 'healthy', '+ csdl service is healthy.', '# job tren-may (localhost:5432):', 'CREATE TABLE · INSERT 0 2', '2 lich hen · 17.11', '# job trong-container (host csdl):', '172.18.0.3      csdl', '+ ket noi 15 ms · PostgreSQL 17.11', '# cuối job: Print service container logs', '#   -> Stop and remove container -> network rm'], 'run 36074652000', 14)) },

  /* 20 */ { t: 'Không health-check: bước đầu tới TRƯỚC Postgres 1,1 giây', body: toiSom() },

  /* ───── 13.4 ───── */
  /* 21 */ { t: 'ARC: một listener long-poll, số runner pod = số job đang chờ', body: arc() },

  /* 22 */ { t: 'Ba cách tự co giãn runner — chọn theo hạ tầng bạn ĐANG có', body: table(['Cách', 'Chạy ở đâu', 'Cơ chế', 'Hợp khi'], [
    ['<strong>ARC</strong> (Actions Runner Controller)', 'Kubernetes, cài bằng Helm', 'listener long-poll → patch số replica → pod ephemeral dùng token JIT', 'đã có cụm K8s và người biết vận hành'],
    ['<strong>Runner Scale Set Client</strong>', 'VM, container, máy thật — Linux/Windows/macOS', 'thư viện Go mã nguồn mở gọi cùng API scale set; bạn tự viết phần dựng máy', 'không có K8s, muốn tự điều khiển'],
    ['<strong>Webhook <code>workflow_job</code></strong>', 'bất cứ đâu nhận được HTTP', '<code>queued</code> → dựng máy; <code>completed</code> → xoá', '-docs: phụ thuộc độ trễ webhook, kém tin cậy khi đông'],
    ['<strong>Không co giãn</strong>: 1–2 runner cố định', 'một máy', 'config.sh + dịch vụ hệ thống', 'một người, ít job, việc NẶNG cần máy mạnh'],
  ], { sm: true }) + box('tip', 'Docs khuyên tự co giãn bằng runner <strong>ephemeral</strong>: runner bền có thể bị gán job ngay lúc đang tắt. <code>minRunners: 0</code> = không tốn gì khi rảnh, đổi lại job đầu phải chờ pod khởi động.') },

  /* 23 */ { t: 'Máy nhà làm runner build: thay SSH bằng long-poll?', body: two(
    `${kpis([{ v: '12', l: 'nhân máy nhà', c: 'blu' }, { v: '31GB', l: 'RAM', c: 'tea' }, { v: '3–6′', l: 'build song song ở nhà', c: 'grn' }, { v: '~15′', l: 'build tuần tự trên VPS', c: 'amb' }])}
     ${box('info', 'Hôm nay <code>deploy-nha.sh</code> chạy tay: đẩy mã vào kho trần ở máy nhà, build hai ảnh song song, đẩy GHCR, VPS chỉ kéo về và tráo (số liệu trong CLAUDE.md của repo).')}`,
    list([
      '<strong>Được</strong>: runner nhãn <code>nha-build</code> trên máy Fedora thay phần “SSH vào máy nhà rồi build”; kích bằng <code>gh workflow run</code> từ mạng nào cũng được, log nằm trong tab Actions, cache Docker ấm sẵn.',
      '<strong>Điều kiện</strong>: kho <strong>riêng tư</strong> (api-backend); chỉ <code>workflow_dispatch</code> được <code>runs-on</code> nhãn đó; runner chạy bằng người dùng riêng — nhớ: nhóm <code>docker</code> ≈ root trên máy đó.',
      '<strong>Mất</strong>: máy nhà tắt = job chờ (tới 24 giờ) chứ không tự lùi như <code>deploy-nha.sh</code>. Giữ đường lùi.',
      '<strong>Không làm</strong>: đặt runner lên chính VPS sản xuất — job build ăn RAM của Postgres (sự cố OOM 137, đĩa đầy).',
    ])) },

  /* 24 */ { t: 'Khi nào đáng tự host — hỏi năm câu trước khi bật một runner', body: table(['Câu hỏi', 'Nếu “có”', 'Nếu “không”'], [
    ['Kho có công khai không?', '-dừng: dùng hosted (docs: gần như không bao giờ self-hosted cho kho public)', 'đi tiếp'],
    ['Có cần thứ hosted không có? (GPU, LAN nội bộ, ARM riêng, >16 GB RAM, dữ liệu không được rời máy)', '+self-hosted hoặc larger runner', 'hosted chuẩn là đủ'],
    ['Phút hosted có đắt thật không? (kho riêng, >vài nghìn phút/tháng)', '+tính: máy + điện + công vá so với $0,006/phút', 'hosted rẻ hơn công sức của bạn'],
    ['Có ai vá OS, cập nhật runner trong 30 ngày, đọc log _diag?', 'đi tiếp', '-dùng hosted'],
    ['Làm được ephemeral (container/VM mỗi job)?', '+nên làm', '!chấp nhận máy bẩn: chỉ cho kho riêng, một đội tin nhau'],
  ], { sm: true }) },

  /* 25 */ { t: 'Sai lầm hay gặp ở Chương 13', body: cards([
    { ic: '🌍', t: 'Self-hosted cho kho public', d: 'PR từ fork chạy mã lạ trên máy bạn. “Require approval” chỉ là một lớp, không phải tường.', c: 'red' },
    { ic: '♻️', t: 'Runner bền dùng chung', d: '/tmp, ~, _work, _diag còn lại cho job sau. Làm ephemeral.', c: 'amb' },
    { ic: '🔑', t: 'Secret qua đối số lệnh', d: 'Log che, ps thì không. Dùng env/stdin.', c: 'ora' },
    { ic: '🐳', t: 'Coi container: là cách ly', d: 'docker.sock của máy được mount vào. Không phải ranh giới.', c: 'vio' },
    { ic: '⏱', t: 'services không health-check', d: 'Bước đầu tới trước DB 1,1 giây. Thêm health-cmd.', c: 'blu' },
    { ic: '🏷', t: 'Nhãn sai / runner tắt', d: 'Job không đỏ, chỉ chờ tới 24 giờ. Đặt nhãn vào actionlint.yaml.', c: 'pnk' },
  ], 3) },

  /* 26 */ { t: 'Bảng tra nhanh Chương 13', body: table(['Muốn', 'Viết / làm'], [
    ['Xem runner đang làm gì', '<code>ps --forest | grep Runner</code> · <code>_diag/Runner_*.log</code>, <code>Worker_*.log</code>'],
    ['Đăng ký runner một job', '<code>config.sh --unattended --url … --token … --labels x --ephemeral --disableupdate</code> rồi <code>run.sh</code>'],
    ['Token đăng ký / gỡ', '<code>POST repos/{o}/{r}/actions/runners/registration-token</code> · <code>…/remove-token</code> (admin, 1 giờ)'],
    ['Gỡ khẩn cấp', '<code>gh api -X DELETE repos/{o}/{r}/actions/runners/{id}</code>'],
    ['Nhắm runner', '<code>runs-on: [self-hosted, nhan-rieng]</code> · <code>runs-on: { group: g, labels: [...] }</code>'],
    ['Kiểm mạng runner', '<code>./run.sh --check --url … --pat …</code>'],
    ['Đổi môi trường bước', '<code>container: node:22-bookworm-slim</code> (Linux + Docker)'],
    ['CSDL cho test', '<code>services: { csdl: { image, env, ports, options: --health-cmd … } }</code>'],
    ['Tự co giãn', 'ARC (K8s) · Scale Set Client · webhook <code>workflow_job</code> — luôn ephemeral'],
  ], { sm: true }) },

  /* 27 */ { t: 'Thực hành Chương 13 (60 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Chép <code>ch13-ben-trong.yml</code> vào kho thử; đọc ra tên runner, Listener/Worker, số kết nối 443, dòng “Listening for Jobs”.',
    '<strong>2.</strong> Viết job test có <code>services:</code> Postgres + health-check, chạy cả kiểu trên máy (<code>localhost</code>) lẫn trong <code>container:</code> (<code>csdl</code>).',
    '<strong>3.</strong> Xoá health-check, đo xem bước đầu tới sớm bao nhiêu mili-giây.',
    '<strong>4.</strong> (Kho RIÊNG TƯ, Mac có Docker) chạy <code>chay-mot-job.sh</code>: một runner ephemeral, một job <code>workflow_dispatch</code>, rồi kiểm nó đã biến mất.',
  ]), box('good', '<strong>Đạt khi</strong>: bạn chỉ ra được dòng <code>Job request … received</code> trong _diag; job services xanh ở cả hai kiểu; bạn có con số “tới sớm”; và <code>gh api repos/…/actions/runners</code> trả <code>total_count: 0</code> sau bước 4.<br><br>Không có Docker/quyền admin: dừng ở bước 3 — đó đã là phần chạy trên GitHub-hosted.')) },
]);
