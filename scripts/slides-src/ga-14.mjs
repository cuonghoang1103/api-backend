/**
 * GitHub Actions · Deck ga-14 — Chương 14: Cổng chất lượng, bảo mật chuỗi cung ứng & phát hành.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 (UTC 23:49–23:56) trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap (runner 2.337.0, ubuntu-24.04 20260920.314.1):
 *   nhánh ch14-chat-luong (0212ab0) + PR #5–#9:
 *     36074689448 cong PR#5 xanh · 36074691713 cong PR#6 đỏ · 36074693058 cong PR#7 (không có run ch14-paths)
 *     36074698667 tiem PR#8 · 36074691722 kiem-tinh (actionlint + zizmor + SARIF) · 36074649064 codeql
 *     36074689504 / 36074699591 dependency-review (dependency graph chưa bật) · pull_request_target: 0 run
 *   nhánh ch14-phat-hanh: 36074744064 / 36074930320 / 36075147042 (gh release + semantic-release)
 *                         36074744157 / 36074930318 (GHCR + npm GitHub Packages + attestation)
 *   nhánh ch14-mono: 36074983305 · 36075010880 · 36075040711 · 36075069166 · 36075097613 · 36075069163 (ma trận rỗng)
 * Docs kiểm từ mã nguồn github/docs (commit f71cc2a và d5e9a63, 24/09/2026). actionlint 1.7.12 · zizmor 1.30.1 · CodeQL 2.27.1.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, kpis, pipe, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-14', code: 'GITHUB ACTIONS · CHƯƠNG 14', title: 'Chất lượng, chuỗi cung ứng & phát hành', sub: 'GitHub Actions · Chương 14' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 4 — hai kiểu job tổng hợp, hai PR ───────────── */
const haiCong = () => {
  let s = '';
  const job = (x, y, w, name, st, d) => {
    const c = { ok: 'grn', fail: 'red', skip: 'dim' }[st];
    const ic = { ok: '✓', fail: '✗', skip: '⊘' }[st];
    return R(x, y, w, 44, { c, fill: '#0f182a', r: 10 }) + `<circle cx="${x + 20}" cy="${y + 22}" r="10" fill="${D[c]}"/>` +
      T(x + 20, y + 28, ic, { fs: 14, c: '#08101e', a: 'middle', b: true }) + T(x + 38, y + 28, name, { fs: 15, mono: true, b: true }) +
      (d ? T(x + w - 10, y + 28, d, { fs: 13.5, c: 'mu', a: 'end', mono: true }) : '');
  };
  const cot = (x, tieuDe, runId, test, tong) => {
    let o = R(x, 0, 560, 290, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.02)' }) + T(x + 16, 28, tieuDe, { fs: 16, b: true }) +
      T(x + 16, 52, runId, { fs: 14, c: 'mu', mono: true });
    o += job(x + 16, 70, 250, 'lint', 'ok') + job(x + 16, 124, 250, 'test (22)', test) + job(x + 16, 178, 250, 'test (24)', test) +
      job(x + 16, 232, 250, 'e2e-dem', 'skip', 'if: nhãn');
    o += job(x + 294, 110, 250, 'cong-ngay-tho', 'skip') + job(x + 294, 200, 250, 'cong-tong', tong);
    o += T(x + 294, 172, 'không có if: always()', { fs: 13.5, c: 'mu' }) + T(x + 294, 262, 'if: always() + đọc needs', { fs: 13.5, c: 'mu' });
    return o;
  };
  s += cot(0, 'PR #5 — mọi thứ xanh', 'run 36074689448', 'ok', 'ok');
  s += cot(600, 'PR #6 — test đỏ', 'run 36074691713', 'fail', 'fail');
  s += R(0, 300, 1160, 100, { c: 'amb', fill: 'rgba(255,194,51,.08)' }) +
    T(20, 332, 'cong-ngay-tho bị SKIP ở CẢ HAI PR — vì một job nó needs (e2e-dem) bị skip, chứ không phải vì test đỏ.', { fs: 16.5, b: true, c: 'amb' }) +
    T(20, 362, 'Docs: “A job that is skipped will report its status as Success … even if it is a required check.”', { fs: 15.5 }) +
    T(20, 388, '⇒ đặt cong-ngay-tho làm check bắt buộc thì PR #6 (test đỏ) vẫn merge được. cong-tong mới chặn đúng.', { fs: 15.5, c: 'mu' });
  return sv(1160, 405, s);
};

/* ───────────── Slide 6 — paths: check bắt buộc treo mãi ───────────── */
const pathsTreo = () => {
  let s = '';
  const hop = (x, y, w, h, c, a, b, d) => R(x, y, w, h, { c, fill: '#0f182a' }) + T(x + 16, y + 30, a, { fs: 17, b: true, c }) +
    T(x + 16, y + 56, b, { fs: 14.5, c: 'mu', mono: true }) + (d ? T(x + 16, y + 80, d, { fs: 14.5, c: 'mu' }) : '');
  s += hop(0, 0, 360, 96, 'dk', 'PR #7 chỉ sửa ch14/docs', 'ch14/docs/README.md', '');
  s += hop(0, 150, 360, 96, 'vio', 'ch14-paths.yml', "paths: ['ch14/backend/**']", 'không khớp ⇒ workflow KHÔNG được tạo');
  s += A(180, 96, 180, 146, { c: 'mu' });
  s += hop(420, 0, 740, 96, 'grn', 'Không bảo vệ nhánh (sân tập hôm nay)', 'list runs PR #7: cong ✓, tiem ✓, kiem-tinh …', 'không có dòng ch14-paths nào — và cũng không ai đòi nó');
  s += hop(420, 150, 740, 96, 'red', 'Nếu “backend-test” là check BẮT BUỘC', 'Expected — Waiting for status to be reported', 'docs: check “sẽ nằm ở trạng thái Pending” ⇒ PR không merge được');
  s += A(360, 198, 416, 198, { c: 'red' });
  s += R(0, 280, 1160, 130, { c: 'tea', fill: 'rgba(45,212,191,.07)' }) +
    T(20, 312, 'Ba cách thoát, xếp theo độ chắc:', { fs: 17, b: true, c: 'tea' }) +
    T(20, 342, '① Bỏ paths ở workflow; lọc ở MỨC JOB (job bị skip = “Success”) — rồi gom bằng một job tổng hợp.', { fs: 15.5 }) +
    T(20, 370, '② Chỉ đặt check tổng hợp (luôn chạy) làm bắt buộc; các job con để tự do.', { fs: 15.5 }) +
    T(20, 398, '③ Workflow “anh em” cùng tên job với paths-ignore ngược lại — cách cũ, dễ lệch, đừng bắt đầu từ đây.', { fs: 15.5, c: 'mu' });
  return sv(1160, 415, s);
};

/* ───────────── Slide 8 — ba tầng kiểm theo thời gian ───────────── */
const baTang = () => diagram({
  w: 1160, h: 420,
  nodes: [
    { id: 'pr', x: 0, y: 20, w: 330, h: 120, t: 'Mỗi PR (pull_request)', d: 'lint · typecheck · unit test\nmục tiêu < 10 phút\ncheck tổng hợp = BẮT BUỘC', c: 'dk' },
    { id: 'mq', x: 415, y: 20, w: 330, h: 120, t: 'Hàng đợi merge (merge_group)', d: 'chạy lại trên bản ĐÃ GỘP\ncần merge queue — chỉ kho\ncủa TỔ CHỨC (public/Enterprise)', c: 'vio' },
    { id: 'dem', x: 830, y: 20, w: 330, h: 120, t: 'Hằng đêm (schedule)', d: 'e2e dài · quét sâu · ma trận rộng\nchạy trên NHÁNH MẶC ĐỊNH\nkhông chặn PR nào', c: 'amb' },
    { id: 'do1', x: 0, y: 250, w: 330, h: 110, t: 'Đỏ ⇒ PR không merge', d: 'người viết PR sửa ngay\ntốn phút cho MỌI commit', c: 'red' },
    { id: 'do2', x: 415, y: 250, w: 330, h: 110, t: 'Đỏ ⇒ PR bị đẩy khỏi hàng', d: 'bắt lỗi “hai PR xanh riêng\nnhưng đỏ khi gộp”', c: 'red' },
    { id: 'do3', x: 830, y: 250, w: 330, h: 110, t: 'Đỏ ⇒ mở issue / báo', d: 'ai đó phải ĐỌC — nếu không\nthì nó chỉ là tiếng ồn', c: 'amb' },
  ],
  edges: [{ from: 'pr', to: 'do1' }, { from: 'mq', to: 'do2' }, { from: 'dem', to: 'do3' }, { from: 'pr', to: 'mq', t: 'merge' }, { from: 'mq', to: 'dem', t: 'main' }],
});

/* ───────────── Slide 9 — pull_request vs pull_request_target ───────────── */
const prVsPrt = () => {
  let s = '';
  const col = (x, c, h, rows) => R(x, 0, 560, 318, { c, fill: 'rgba(255,255,255,.03)' }) + T(x + 20, 34, h, { fs: 19, b: true, c, mono: true }) +
    rows.map(([a, b], i) => T(x + 20, 76 + i * 44, a, { fs: 15, c: 'mu' }) + T(x + 230, 76 + i * 44, b, { fs: 15, b: true })).join('');
  s += col(0, 'grn', 'pull_request', [['Tệp workflow lấy từ', 'merge commit của PR'], ['Token từ fork', 'CHỈ ĐỌC'], ['Secret (từ fork)', 'KHÔNG có'], ['checkout mặc định', 'mã của PR'], ['Hợp cho', 'build + test mã lạ'], ['Chạy ở mọi nhánh base?', 'có (PR #5–#9: có run)']]);
  s += col(600, 'red', 'pull_request_target', [['Tệp workflow lấy từ', 'NHÁNH MẶC ĐỊNH'], ['Token', 'đọc/ghi của kho gốc'], ['Secret', 'CÓ'], ['checkout mặc định', 'nhánh mặc định'], ['Hợp cho', 'gắn nhãn, bình luận'], ['Ở nhánh ch14-* (sân tập)', '0 run — không có ở main']]);
  s += R(0, 332, 1160, 96, { c: 'amb', fill: 'rgba(255,194,51,.07)' }) +
    T(20, 364, '“pwn request” = pull_request_target + checkout head của PR + CHẠY mã đó (npm install, make test…) với secret.', { fs: 16, b: true, c: 'amb' }) +
    T(20, 394, 'Docs 09/2026: kho public có chính sách mặc định CHẶN pull_request_target — đang “evaluate”, bật thật từ 02/11/2026.', { fs: 15 }) +
    T(20, 418, 'checkout còn có cờ allow-unsafe-pr-checkout — cố ý đặt tên dễ thấy khi review.', { fs: 14.5, c: 'mu' });
  return sv(1160, 432, s);
};

/* ───────────── Slide 12 — SARIF đi đâu ───────────── */
const sarif = () => diagram({
  w: 1160, h: 300,
  nodes: [
    { id: 'z', x: 0, y: 20, w: 250, h: 90, t: 'zizmor (SARIF)', d: 'job zizmor · 2 high', c: 'vio' },
    { id: 'c', x: 0, y: 180, w: 250, h: 90, t: 'CodeQL (actions, js)', d: '7/7 tệp workflow\n2.27.1 · 16–35 giây', c: 'dk' },
    { id: 'u', x: 315, y: 90, w: 320, h: 110, t: 'Tải SARIF lên', d: 'upload-sarif (zizmor) · analyze (CodeQL)\nsecurity-events: write', c: 'tea' },
    { id: 'tab', x: 680, y: 20, w: 480, h: 90, t: 'Tab Security → Code scanning', d: 'cảnh báo theo NHÁNH, có vân tay chống trùng', c: 'grn' },
    { id: 'chk', x: 680, y: 180, w: 480, h: 110, t: 'Check trên PR: “zizmor”', d: '“No new alerts in code changed by\nthis pull request” — chỉ tính cảnh báo MỚI', c: 'amb' },
  ],
  edges: [{ from: 'z', to: 'u' }, { from: 'c', to: 'u' }, { from: 'u', to: 'tab' }, { from: 'u', to: 'chk' }],
}) + box('warn', 'PR #6 có <strong>hai check cùng tên “zizmor”</strong>: một là job, một là check của code scanning. Docs: tên check bắt buộc = tên job, <em>không</em> phân biệt workflow ⇒ đặt tên job khác nhau trên toàn kho.');

/* ───────────── Slide 16 — hai dòng phát hành ───────────── */
const haiDong = () => {
  let s = '';
  const X = (i) => 160 + i * 330;
  s += `<line x1="140" y1="120" x2="1150" y2="120" stroke="${D.dim}" stroke-width="2"/>` + `<line x1="140" y1="300" x2="1150" y2="300" stroke="${D.dim}" stroke-width="2"/>`;
  s += T(0, 126, 'gh release', { fs: 17, b: true, c: 'blu', mono: true }) + T(0, 306, 'semantic-', { fs: 17, b: true, c: 'vio', mono: true }) + T(0, 328, 'release', { fs: 17, b: true, c: 'vio', mono: true });
  const commits = [['25e8f3f', 'feat(phat-hanh): …'], ['d5ff3f5', 'fix(anh): …'], ['7c3e444', 'chore: …']];
  commits.forEach(([sha, m], i) => {
    s += R(X(i) - 10, 180, 300, 60, { c: 'dim', fill: '#0f182a' }) + T(X(i), 206, sha, { fs: 15, mono: true, b: true }) + T(X(i), 228, m, { fs: 14, c: 'mu', mono: true });
  });
  const tag = (i, y, txt, c) => R(X(i) - 10, y - 26, 300, 40, { c, fill: '#0f182a', r: 8 }) + T(X(i) + 2, y, txt, { fs: 15, mono: true, b: true, c });
  s += tag(0, 126, 'ch14-v0.1.1', 'blu') + tag(1, 126, 'ch14-v0.1.2', 'blu') + tag(2, 126, 'ch14-v0.1.3', 'blu');
  s += tag(0, 306, 'ch14-sr-v1.0.0  (minor)', 'vio') + tag(1, 306, 'ch14-sr-v1.0.1  (patch)', 'vio') + tag(2, 306, '— không phát hành —', 'dim');
  s += T(160, 60, 'MỖI push = một bản, kể cả commit “chore” — số bản do run_number quyết định', { fs: 15, c: 'mu' });
  s += T(160, 372, 'Số bản do NỘI DUNG commit quyết định: feat → minor, fix → patch, chore → không có gì', { fs: 15, c: 'mu' });
  s += R(0, 392, 1160, 44, { c: 'amb', fill: 'rgba(255,194,51,.07)', r: 8 }) + T(20, 420, 'runs 36074744064 · 36074930320 · 36075147042 — cả hai job chỉ dùng GITHUB_TOKEN (contents: write)', { fs: 15, c: 'amb' });
  return sv(1160, 440, s);
};

/* ───────────── Slide 20 — attestation đi qua đâu ───────────── */
const chungThuc = () => diagram({
  w: 1160, h: 440,
  nodes: [
    { id: 'job', x: 0, y: 30, w: 260, h: 110, t: 'job dung-anh', d: 'id-token: write\nattestations: write\npackages: write', c: 'dk', mono: true },
    { id: 'oidc', x: 0, y: 250, w: 260, h: 100, t: 'Token OIDC (bài 6.3)', d: 'ai · kho nào · workflow nào\nref nào · commit nào', c: 'tea' },
    { id: 'sig', x: 340, y: 250, w: 280, h: 100, t: 'Sigstore (public good)', d: 'cấp chứng chỉ sống 10 phút\n23:51:13 → 00:01:13', c: 'vio' },
    { id: 'rek', x: 340, y: 30, w: 280, h: 110, t: 'Rekor (nhật ký công khai)', d: 'logIndex 2946211424\nai cũng tra được', c: 'amb' },
    { id: 'api', x: 700, y: 30, w: 460, h: 110, t: 'attestations API + GHCR (run 1)', d: '…/ga-san-tap/attestations/50029606\nghcr.io/…@sha256:d72977a4… (bản đính kèm ảnh)', c: 'grn', mono: true },
    { id: 'ver', x: 700, y: 250, w: 460, h: 100, t: 'gh attestation verify (run 2)', d: 'oci://…@sha256:35e48f0f… --repo …\nverify exit=0 · buildSignerURI = ch14-anh.yml', c: 'grn', mono: true },
  ],
  edges: [{ from: 'job', to: 'oidc', t: 'xin' }, { from: 'oidc', to: 'sig', t: 'trao' }, { from: 'sig', to: 'rek', t: 'ký + ghi' }, { from: 'rek', to: 'api' }, { from: 'api', to: 'ver', t: 'tra theo DIGEST' }],
});

/* ───────────── Slide 23 — paths-filter vs git diff ───────────── */

/* ───────────── Slide 25 — đồ thị monorepo ───────────── */
const doThiMono = () => pipe({
  w: 1160, h: 150,
  cols: [[{ n: 'thay-doi', s: 'ok', d: '6s' }], [{ n: 'kiem (backend)', s: 'ok' }], [{ n: 'ket-luan', s: 'ok', d: '2s' }]],
  needs: [['thay-doi', 'kiem (backend)'], ['kiem (backend)', 'ket-luan']],
}) + box('info', 'Ma trận chỉ có <code>["backend"]</code> ⇒ desktop và frontend <strong>không có job nào</strong> — không phải “skipped”, mà không tồn tại. Push <code>docs</code> (run 36075069166): cả job <code>kiem</code> skipped, <code>ket-luan</code> vẫn chạy và báo “DAT”.');

export const slides = S([
  /* 1 */ cover({ t: 'Chương 14 — Cổng chất lượng, chuỗi cung ứng & phát hành', sub: 'check bắt buộc · ruleset · injection · CodeQL · Dependabot · release tự động · GHCR · attestation · monorepo', chap: 'CHƯƠNG 14' }),

  /* 2 */ { t: 'Bản đồ chương: từ “CI chạy” tới “CI được TIN”', body: mindmap('Được tin', 'một thay đổi chỉ vào main khi đã qua cổng, đến tay người dùng kèm bằng chứng', [
    { t: '14.1 Cổng chất lượng', d: 'check bắt buộc · job tổng hợp · paths · ruleset · merge queue', c: 'dk' },
    { t: '14.2 Chuỗi cung ứng', d: 'pull_request_target · injection · actionlint/zizmor/CodeQL · Dependabot', c: 'red' },
    { t: '14.3 Phát hành', d: 'gh release · semantic-release · GHCR · npm · attestation', c: 'vio' },
    { t: '14.4 Monorepo', d: 'paths-filter vs git diff · ma trận động · một check duy nhất', c: 'amb' },
  ]) },

  /* ───── 14.1 ───── */
  /* 3 */ { t: 'Check bắt buộc là TÊN JOB — PR #6 có hai “zizmor”', body: two(
    table(['Check trên PR #6', 'Kết luận', 'Nguồn'], [
      ['lint', '+success', 'job ch14-cong'],
      ['test (22) · test (24)', '!failure', 'job ma trận'],
      ['e2e-dem', 'skipped', 'job có if:'],
      ['cong-ngay-tho', 'skipped', 'job tổng hợp SAI'],
      ['cong-tong', '!failure', 'job tổng hợp ĐÚNG'],
      ['actionlint', '!failure', 'job ch14-kiem-tinh'],
      ['zizmor', '+success', 'job ch14-kiem-tinh'],
      ['zizmor', '+success', 'code scanning (SARIF)'],
      ['GitGuardian Security Checks', '+success', 'app bên thứ ba'],
    ], { sm: true }),
    list([
      'Tên check của một job = <code>name:</code> của job (hoặc id), cộng giá trị ma trận: <code>test (22)</code>. Reusable: <code>gọi / trong</code>.',
      'Docs: check bắt buộc <strong>không phân biệt workflow, ma trận hay sự kiện</strong> — hai job cùng tên ở hai workflow là hai check không tách được.',
      '<code>mergeable_state</code> của PR #6 = <code>unstable</code>: đỏ nhưng <strong>vẫn merge được</strong>, vì chưa có luật nào đòi.',
      'Ruleset cho chọn <em>nguồn</em> của check (một GitHub App) — cách chặn một job cùng tên “giả” check.',
    ])) },

  /* 4 */ { t: 'Job tổng hợp thiếu always() bị SKIP — skip = ĐẠT', body: haiCong() },

  /* 5 */ { t: 'cong-tong: luôn chạy, chỉ đỏ khi failure/cancelled', body: two(
    yaml([['cong-tong:', ''], ['  if: always()', 'chạy cả khi cha đỏ'], ['  needs: [lint, test, e2e-dem]', ''], ['  runs-on: ubuntu-24.04', ''], ['  steps:', ''], ['    - env:', ''], ['        KQ: ${{ toJSON(needs) }}', 'kết quả mọi cha'], ['      run: |', ''], ['        echo "$KQ" | jq -e \\', ''], ["          'any(.[]; .result == \"failure\"", 'skipped = đạt'], ["            or .result == \"cancelled\")'", ''], ['        && exit 1', 'đỏ ⇒ chặn']], { fs: 14 }),
    t(['# PR #6 · job cong-tong', 'KQ: {', '  "lint":    { "result": "success" },', '  "test":    { "result": "failure" },', '  "e2e-dem": { "result": "skipped" }', '}', 'lint = success', '! test = failure', 'e2e-dem = skipped', '! ##[error]co job do hoac bi huy', '! ##[error]Process completed with exit code 1.', '# PR #5: "khong co job nao do" -> success'], 'run 36074691713', 14.5)) },

  /* 6 */ { t: 'paths ở workflow: không chạy = check bắt buộc treo', body: pathsTreo() },

  /* 7 */ { t: 'Branch protection, ruleset, merge queue (09/2026)', body: table(['', 'Branch protection', 'Ruleset', 'Merge queue'], [
    ['Kho public, tài khoản Free', '+có', '+có', '-KHÔNG (chỉ kho của tổ chức)'],
    ['Kho private', 'Pro / Team / Enterprise', 'Pro / Team / Enterprise', 'tổ chức dùng Enterprise Cloud'],
    ['Mấy luật cùng áp một nhánh', 'MỘT luật', 'nhiều ruleset, gộp — luật CHẶT NHẤT thắng', 'bật trong luật của nhánh'],
    ['Tắt tạm không xoá', '-không', '+Active / Disabled (Evaluate: Enterprise)', '—'],
    ['Ai xem được luật', 'admin', '+ai có quyền đọc kho', '—'],
    ['Workflow phải nghe', 'pull_request', 'pull_request', '!pull_request + merge_group'],
  ], { sm: true }) + box('info', 'Sân tập là kho <strong>cá nhân, public</strong>: ruleset bật được — nhưng cần quyền admin qua giao diện/API, phiên dựng bài không có ⇒ phần bật luật để ở mục “⏳ chưa chạy thật”. Merge queue thì kho cá nhân <strong>không có</strong>.') },

  /* 8 */ { t: 'Ba tầng kiểm: PR nhanh chặn, hàng đợi gộp chặn, đêm chỉ báo', body: baTang() },

  /* ───── 14.2 ───── */
  /* 9 */ { t: 'pull_request_target chạy tệp của NHÁNH MẶC ĐỊNH, với secret', body: prVsPrt() },

  /* 10 */ { t: 'Tiêm lệnh qua tiêu đề PR — dựng lại VÔ HẠI, permissions: {}', body: two(
    t(['# tieu de PR #8:', '#   ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)', 'GITHUB_TOKEN Permissions', '  Metadata: read', '##[group]Run echo "Tieu de PR la - ch14: thu', '  tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)"', '! Tieu de PR la - ch14: thu tieu de DA-CHAY-LENH-TU-TIEU-DE', '', '##[group]Run echo "Tieu de PR la - $TIEU_DE"', 'env:', '  TIEU_DE: ch14: thu tieu de $(echo DA-CHAY-...)', '+ Tieu de PR la - ch14: thu tieu de $(echo DA-CHAY-', '+   LENH-TU-TIEU-DE)'], 'run 36074698667 · job tieu-de', 14),
    list([
      '<strong>Cách sai</strong>: <code>${{ github.event.pull_request.title }}</code> được thay vào script <em>trước</em> khi bash đọc ⇒ <code>$(…)</code> trong tiêu đề thành lệnh — dòng đỏ là bằng chứng lệnh đã chạy.',
      '<strong>Cách đúng</strong>: đưa qua <code>env:</code>, dùng <code>"$TIEU_DE"</code> ⇒ bash thấy một chuỗi, in nguyên văn.',
      'Ai mở PR cũng đặt được tiêu đề. Bài 3.1 đã dựng cùng cơ chế bằng TÊN NHÁNH; ở đây là trường khác, cùng một cách vá.',
      'Lớp thứ hai: <code>permissions: {}</code> — job chỉ còn <code>Metadata: read</code>, lệnh lạ có chạy cũng không cầm được gì.',
    ])) },

  /* 11 */ { t: 'Ba máy quét tĩnh, mỗi cái bắt một kiểu lỗi', body: two(
    t(['$ ./actionlint .github/workflows/ch14-*.yml', '! ch14-tiem.yml:15:40: "github.event.pull_request.title"', '!   is potentially untrusted. avoid using it directly', '!   in inline scripts ... [expression]', '', '$ pipx run zizmor==1.30.1 --offline …', '! error[dangerous-triggers]: ch14-prt.yml:3:1', '!   pull_request_target is almost always used insecurely', '! error[template-injection]: ch14-tiem.yml:15:40', '!   = note: audit confidence -> High', '21 findings (19 suppressed, 1 unsafe fixes):', '  0 informational, 0 low, 0 medium, 2 high', '! ##[error]Process completed with exit code 14.'], 'run 36074691722 · job actionlint + zizmor', 13.5),
    table(['Công cụ', 'Bắt được', 'Giá'], [
      ['actionlint 1.7.12', 'cú pháp, kiểu biểu thức, input không tin cậy trong run:', '+5 giây, 1 tệp nhị phân'],
      ['zizmor 1.30.1', '+ trigger nguy hiểm, quyền thừa, uses: chưa ghim, checkout giữ token', '+~5 giây qua pipx'],
      ['CodeQL “actions”', 'luồng dữ liệu: injection, untrusted checkout, cache/artifact poisoning', '16–35 giây / ngôn ngữ'],
    ], { sm: true }) + box('tip', 'Không có cái nào thay được cái nào: actionlint không thấy <code>pull_request_target</code> là nguy hiểm; zizmor không kiểm cú pháp biểu thức sâu như actionlint.')) },

  /* 12 */ { t: 'SARIF: kết quả quét thành cảnh báo và thành một check trên PR', body: sarif() },

  /* 13 */ { t: 'Dependabot sửa phụ thuộc CŨ, review chặn cái MỚI', body: two(
    table(['', 'Việc', 'Bật ở đâu'], [
      ['Dependabot alerts', 'báo lỗ hổng trong phụ thuộc đang có', 'Settings (cần dependency graph)'],
      ['Security updates', 'tự mở PR lên bản vá TỐI THIỂU', 'Settings'],
      ['Version updates', 'mở PR theo lịch lên bản mới nhất', '<code>.github/dependabot.yml</code> ở nhánh mặc định'],
      ['Dependency review', 'PR THÊM phụ thuộc có lỗ hổng ⇒ đỏ', 'action trong workflow PR'],
    ], { sm: true }),
    t(['# PR #9 them lodash 4.17.20', '- uses: actions/dependency-review-action@a1d2…b294', '  with: { fail-on-severity: moderate }', '! ##[error]Dependency review is not supported on', '!   this repository. Please ensure that Dependency', '!   graph is enabled, see https://github.com/', '!   cuonghoang1103/ga-san-tap/settings/security_analysis', '# -> action can DEPENDENCY GRAPH; bat trong Settings', '#    (quyen admin) -- xem muc "chua chay that"'], 'run 36074699591', 14)) },

  /* 14 */ { t: 'Secret scanning: chặn TRƯỚC khi vào kho, không phải báo sau', body: two(
    table(['Lớp', 'Mặc định', 'Làm gì'], [
      ['Push protection cho NGƯỜI DÙNG', '+bật sẵn (tài khoản github.com)', 'chặn chính bạn đẩy secret lên kho public'],
      ['Push protection cho KHO', '-tắt, admin bật', 'chặn mọi người đẩy vào kho đó; bypass để lại cảnh báo'],
      ['Secret scanning alerts', 'theo cài đặt của kho', 'báo SAU khi secret đã nằm trong lịch sử'],
      ['App bên thứ ba (GitGuardian)', 'tuỳ cài', 'một check nữa trên PR — thấy trên PR #6'],
    ], { sm: true }),
    list([
      'Chặn áp dụng cho: push dòng lệnh, commit trên giao diện, tải tệp lên, REST API, và MCP server của GitHub (kho public).',
      'Secret đã lọt vào một commit: <strong>thu hồi trước</strong>, xoá lịch sử sau — bài 6.1 “làm theo thứ tự nào”.',
      'Sân tập KHÔNG thử đẩy secret — kể cả secret giả đúng định dạng cũng là thói quen xấu. Cách tự thử an toàn nằm trong bài.',
    ])) },

  /* 15 */ { t: 'Phòng thủ nhiều lớp cho chuỗi cung ứng — mỗi lớp một chỗ đặt', body: cards([
    { ic: '📌', t: 'Ghim SHA', d: '<code>uses: x@&lt;40 ký tự&gt; # vX.Y.Z</code> — tj-actions 03/2025 đổi thẻ, SHA thì không đổi được (bài 4.2).', c: 'blu' },
    { ic: '🤖', t: 'Dependabot github-actions', d: 'giữ SHA tươi bằng PR có changelog (bài 12.4).', c: 'tea' },
    { ic: '🔒', t: 'permissions tối thiểu', d: '<code>permissions: {}</code> ở đầu tệp, job xin đúng cái cần.', c: 'grn' },
    { ic: '🧪', t: 'env: thay vì ${{ }} trong run:', d: 'mọi trường người ngoài đặt được: tiêu đề, thân PR, tên nhánh, commit message.', c: 'vio' },
    { ic: '🔎', t: 'Quét tĩnh là check', d: 'actionlint + zizmor mỗi PR; CodeQL “actions” trên nhánh chính.', c: 'amb' },
    { ic: '🚪', t: 'Không pull_request_target', d: 'trừ khi chỉ gắn nhãn/bình luận và KHÔNG chạy mã của PR.', c: 'red' },
  ], 3) },

  /* ───── 14.3 ───── */
  /* 16 */ { t: 'Hai cách đánh số bản: theo lần chạy, hay theo nội dung commit', body: haiDong() },

  /* 17 */ { t: 'semantic-release đọc commit, tự chọn số, tự tạo thẻ và release', body: two(
    t(['# lan 1 · run 36074744064', 'No git tag version found on branch ch14-phat-hanh', 'Found 7 commits since last release', 'feat(phat-hanh): ... -> The release type is minor', '(6 commit khac) should not trigger a release', 'There is no previous release, the next', '  release version is 1.0.0', '+ Created tag ch14-sr-v1.0.0', '# lan 2 · run 36074930320', 'Found git tag ch14-sr-v1.0.0 ...', 'fix(anh): ... -> patch', '+ Created tag ch14-sr-v1.0.1', '# lan 3 · run 36075147042', 'chore: ... should not trigger a release', 'There are no relevant changes, so no new', '  version is released.'], 'semantic-release 25.0.9', 13.5),
    `${yaml([['{ "branches": ["ch14-phat-hanh"],', ''], ['  "tagFormat": "ch14-sr-v${version}",', 'tiền tố riêng'], ['  "plugins": [', ''], ['    "@semantic-release/commit-analyzer",', 'feat/fix/…'], ['    "@semantic-release/release-notes-generator",', ''], ['    ["@semantic-release/github", {', 'tạo release'], ['      "successComment": false } ] ] }', 'không bình luận']], { fs: 13.5 })}
     ${box('info', 'Job cần <code>fetch-depth: 0</code> (đọc hết lịch sử + thẻ) và <code>contents: write</code>. Lần 1 mất 17 giây, 10 giây là <code>npx</code> tải gói.')}`) },

  /* 18 */ { t: 'Notes tự sinh so với thẻ “mới nhất” — kể cả thẻ của dòng KHÁC', body: two(
    t(['$ gh release create ch14-v0.1.2 \\', '    --target $GITHUB_SHA \\', '    --title "ch14 ban thu ch14-v0.1.2" \\', '    --generate-notes --prerelease', '# notes GitHub tu sinh:', '! Full Changelog: ch14-sr-v1.0.0...ch14-v0.1.2', '#   ^ the cua semantic-release, khong phai', '#     ch14-v0.1.1 cua chinh dong nay', '', '# semantic-release, cung commit d5ff3f5:', '+ 1.0.1 (2026-09-24)', '+ ### Bug Fixes', '+ * anh: in ket qua gh attestation verify ...'], 'run 36074930320', 14),
    list([
      '<code>--generate-notes</code> để GitHub tự chọn “bản trước” — và nó chọn <code>ch14-sr-v1.0.0</code>, thẻ của công cụ kia.',
      'Hai hệ đánh số trong một kho là chuyện thường (app + thư viện, desktop + web). Vá: <code>--notes-start-tag ch14-v0.1.1</code>, hoặc mỗi dòng một tiền tố và một công cụ.',
      'Kho thật <code>desktop-release.yml</code> tạo release <strong>nháp</strong>, tải tệp, rồi mới công bố — đúng trình tự docs khuyên cho <em>immutable releases</em>.',
      'Release ở KHO KHÁC (<code>cuongthai-desktop</code>) thì <code>GITHUB_TOKEN</code> không với tới — vì thế kho thật phải dùng <code>RELEASE_TOKEN</code>.',
    ])) },

  /* 19 */ { t: 'Đẩy ảnh lên GHCR chỉ bằng GITHUB_TOKEN, không PAT', body: two(
    yaml([['permissions:', ''], ['  contents: read', ''], ['  packages: write', 'đẩy GHCR'], ['  id-token: write', 'xin chứng chỉ'], ['  attestations: write', 'lưu attestation'], ['  artifact-metadata: write', 'storage record'], ['steps:', ''], ['  - uses: docker/login-action@dbcb…679f', ''], ['    with: { registry: ghcr.io,', ''], ['      username: ${{ github.actor }},', ''], ['      password: ${{ github.token }} }', 'không cần PAT'], ['  - id: dung', ''], ['    uses: docker/build-push-action@c3c9…b0dc', 'outputs.digest']], { fs: 13.5 }),
    t(['Logging into ghcr.io...', '+ Login Succeeded!', '#6 [1/3] FROM docker.io/library/busybox:1.37@sha256:bdf5…', '#7 [2/3] COPY chao.txt /chao.txt', '#8 [3/3] RUN echo "phien ban: ch14-anh-1" >> /chao.txt', '#11 pushing ghcr.io/cuonghoang1103/ga-san-tap:ch14-anh-1', '#11 DONE 4.0s', 'Digest', '  sha256:979f5f0d4eda8cda436a97d47685e1f83efd7e38…', '# job sau, KHONG dang nhap:', '$ docker run --rm ghcr.io/…/ga-san-tap@sha256:979f…', '+ Xin chao tu anh ch14 tren GHCR', '+ phien ban: ch14-anh-1'], 'run 36074744157', 13.5)) },

  /* 20 */ { t: 'Attestation: bằng chứng ảnh được dựng ở đâu', body: chungThuc() },

  /* 21 */ { t: 'Sửa MỘT byte là mất bằng chứng — và gói npm', body: two(
    t(['$ gh attestation verify \\', '    ./cuonghoang1103-ch14-chao-0.1.2.tgz \\', '    --repo cuonghoang1103/ga-san-tap --format json | jq …', '+ cuonghoang1103-ch14-chao-0.1.2.tgz b55162b2f2fe…0a1e', '$ cp goc.tgz sua.tgz && printf x >> sua.tgz', '3afdf3c191a8…ee25  sua.tgz', '$ gh attestation verify sua.tgz --repo …', '! Error: HTTP 404: Not Found (…/attestations/', '!   sha256:3afdf3c1…?predicate_type=…slsa.dev', '!   %2Fprovenance%2Fv1)'], 'run 36074930318 · job goi-npm', 13.5),
    `${t(['npm notice 📦  @cuonghoang1103/ch14-chao@0.1.1', 'npm notice package size: 394 B', 'npm notice Publishing to https://npm.pkg.github.com/', '+ + @cuonghoang1103/ch14-chao@0.1.1'], 'run 36074744157', 13.5)}
     ${box('warn', 'Attestation tra theo <strong>digest</strong>, không theo tên: khác một byte là một vật khác, và không có bằng chứng nào cho nó. Tên gói phải có scope đúng chủ kho (<code>@cuonghoang1103/…</code>); mỗi số phiên bản chỉ đăng được một lần.')}`) },

  /* ───── 14.4 ───── */
  /* 22 */ { t: 'api-backend là monorepo: ba gói, một CI chạy hết', body: two(
    yaml([['api-backend/', ''], ['  src/  prisma/  package.json', 'backend Express/TS'], ['  frontend/', 'Next.js'], ['  desktop/', 'Electron'], ['  .github/workflows/ci-lint.yml', ''], ['on:', ''], ['  pull_request: { branches: [main] }', 'KHÔNG paths'], ['  push:', ''], ['    branches: [main]', ''], ['    paths: [src/**, frontend/src/**, …]', 'CÓ paths'], ['jobs:', ''], ['  backend-lint:  { name: Backend Type Check }', ''], ['  frontend-lint: { name: Frontend Type Check }', '']], { fs: 13.5 }),
    table(['Cách', 'Ở đâu', 'Nhược'], [
      ['<code>on.*.paths</code>', 'mức WORKFLOW', '!không chạy = không báo (slide 6)'],
      ['<code>dorny/paths-filter</code>', 'một job “thay-doi”', 'mặc định so với nhánh MẶC ĐỊNH'],
      ['<code>git diff --name-only</code>', 'một job “thay-doi”', 'tự lo nhánh mới, force-push'],
      ['Nx / Turborepo “affected”', 'công cụ build', 'thêm một hệ phụ thuộc'],
    ], { sm: true })) },

  /* 23 */ { t: 'Cùng năm push: paths-filter nói “đổi hết”, git diff nói đúng gói', body: table(['Push (nhánh ch14-mono)', 'git diff before..sha', 'paths-filter (mặc định)', 'Job kiem chạy', 'Run'], [
    ['ci(mono) — nhánh MỚI, before = 000…0', '["backend","desktop","frontend"]', 'cả ba (so với main)', 'backend · desktop · frontend', '36074983305'],
    ['feat(backend)', '+["backend"]', '!cả ba — “between main and ch14-mono”', 'backend', '36075010880'],
    ['feat(frontend,desktop)', '+["desktop","frontend"]', '!cả ba', 'desktop · frontend', '36075040711'],
    ['docs', '+[]', '!cả ba', '— (kiem: skipped)', '36075069166'],
    ['chore: sửa ch14/kiem-ma.js (dùng chung)', '+cả ba', 'cả ba', 'backend · desktop · frontend', '36075097613'],
  ], { sm: true }) + box('tip', 'paths-filter không sai — docs của nó ghi: <code>base</code> mặc định là nhánh mặc định. Trên nhánh sống lâu, đặt <code>base: ${{ github.ref }}</code> để so với commit trước push. Trên <code>pull_request</code> nó dùng base của PR và đúng ngay.') },

  /* 24 */ { t: 'Ma trận động từ JSON — và mảng rỗng làm cả job hỏng', body: two(
    yaml([['kiem:', ''], ['  needs: thay-doi', ''], ["  if: needs.thay-doi.outputs.goi != '[]'", 'CHẶN mảng rỗng'], ['  strategy:', ''], ['    fail-fast: false', ''], ['    matrix:', ''], ['      goi: ${{ fromJSON(', ''], ['        needs.thay-doi.outputs.goi) }}', '["backend", …]'], ['  steps:', ''], ['    - working-directory: ch14/${{ matrix.goi }}', ''], ['      run: npm run -s lint && npm test', '']], { fs: 14 }),
    t(['# ch14-mono-rong.yml: cung ma tran, KHONG co if', '# push "docs: ..." -> goi = []', '! Error when evaluating \'strategy\' for job', "!   'kiem-khong-chan'. .github/workflows/", '!   ch14-mono-rong.yml (Line: 24, Col: 14):', "!   Matrix vector 'goi' does not contain any values", '', '# ch14-mono.yml, cung push:', 'goi bi doi: []', 'thay-doi=success kiem=skipped', '+ ket-luan: DAT'], 'runs 36075069163 · 36075069166', 14)) },

  /* 25 */ { t: 'Monorepo chỉ cần MỘT check bắt buộc: ket-luan', body: `${doThiMono()}${two(
    list(['Push <code>feat(backend)</code> (run 36075010880): chỉ <code>kiem (backend)</code> chạy; hai gói kia không tốn phút nào.', '<code>ket-luan</code>: <code>if: always()</code>, đỏ nếu <code>thay-doi</code> không <code>success</code> hoặc <code>kiem</code> là <code>failure/cancelled</code>.']),
    list(['Ruleset chỉ cần đòi <strong>một tên</strong>: <code>ket-luan</code>. Thêm gói thứ tư không phải sửa luật.', 'Tệp dùng chung (<code>kiem-ma.js</code>, lockfile gốc) ⇒ coi như đổi hết — push <code>chore</code> ở run 36075097613 chạy cả ba.']))}` },

  /* 26 */ { t: 'Áp vào ci-lint.yml của api-backend: năm thay đổi, theo thứ tự', body: table(['#', 'Thay đổi', 'Vì sao (đo ở chương này)'], [
    ['1', '<code>permissions: contents: read</code> đầu tệp', 'hôm nay không khai ⇒ token theo mặc định của kho'],
    ['2', 'Ghim 8 lượt <code>@v4</code> sang SHA + Dependabot', 'slide 15; bài 12.4 đã tra sẵn SHA'],
    ['3', 'Job <code>thay-doi</code> + ma trận động thay cho <code>push.paths</code>', 'slide 6, 23 — PR không có paths nhưng push có: hai hành vi'],
    ['4', 'Job tổng hợp <code>ci-xanh</code> (<code>if: always()</code>) làm check bắt buộc DUY NHẤT', 'slide 4 — tên job đổi không làm hỏng luật'],
    ['5', 'Job <code>kiem-tinh</code>: actionlint + zizmor', 'slide 11 — 5 giây, bắt được cả injection lẫn trigger nguy hiểm'],
  ], { sm: true }) + box('warn', 'Chưa bật ruleset trên <code>main</code> của api-backend trước khi bước 4 xanh ổn định vài ngày: một check bắt buộc tên sai = mọi PR treo ở “Expected — Waiting”.') },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 14', body: cards([
    { ic: '⊘', t: 'Job tổng hợp không always()', d: 'Một cha skip/đỏ là nó skip — và skip = đạt. Luật bắt buộc thành trang trí.', c: 'red' },
    { ic: '⏳', t: 'paths trên workflow bắt buộc', d: 'PR không khớp ⇒ check không bao giờ tới ⇒ PR treo mãi.', c: 'amb' },
    { ic: '💉', t: '${{ github.event.* }} trong run:', d: 'Tiêu đề, thân PR, tên nhánh là do NGƯỜI NGOÀI viết. Qua env: rồi "$BIEN".', c: 'ora' },
    { ic: '🎯', t: 'pull_request_target + checkout head', d: '“pwn request”: mã của fork chạy với secret của bạn.', c: 'pnk' },
    { ic: '🏷', t: 'Hai hệ thẻ, một --generate-notes', d: 'Notes so với thẻ của dòng kia. Dùng --notes-start-tag.', c: 'vio' },
    { ic: '🧮', t: 'Ma trận từ JSON không chặn []', d: '“Matrix vector … does not contain any values” — thêm if: … != \'[]\'.', c: 'blu' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 14', body: table(['Muốn', 'Viết / làm'], [
    ['Một check bắt buộc tin được', 'job <code>if: always()</code> + <code>needs</code> + đỏ khi có <code>failure|cancelled</code>'],
    ['Lọc theo đường dẫn', 'lọc ở MỨC JOB (paths-filter / git diff), không ở <code>on.*.paths</code> của workflow bắt buộc'],
    ['Dùng dữ liệu từ PR trong script', '<code>env: { X: ${{ github.event.pull_request.title }} }</code> → <code>"$X"</code>'],
    ['Quét workflow', '<code>actionlint</code> · <code>zizmor --format sarif</code> + <code>upload-sarif</code> · CodeQL <code>languages: actions</code>'],
    ['Chặn phụ thuộc có lỗ hổng', '<code>actions/dependency-review-action</code> (cần dependency graph)'],
    ['Release tay', '<code>gh release create TAG --target $GITHUB_SHA --generate-notes --notes-start-tag …</code>'],
    ['Release theo commit', 'semantic-release: <code>fetch-depth: 0</code>, <code>contents: write</code>, <code>tagFormat</code>'],
    ['Ảnh lên GHCR', '<code>packages: write</code> + login bằng <code>github.token</code> + <code>build-push-action</code> → <code>digest</code>'],
    ['Bằng chứng nguồn gốc', '<code>actions/attest</code> (id-token, attestations) → <code>gh attestation verify … --repo</code>'],
    ['Ma trận động', '<code>matrix: x: ${{ fromJSON(needs.a.outputs.list) }}</code> + <code>if: … != \'[]\'</code>'],
  ], { sm: true }) },

  /* 29 */ { t: 'Thực hành Chương 14 (60 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Thêm job <code>ci-xanh</code> (<code>if: always()</code>, đọc <code>toJSON(needs)</code>) vào CI của bạn; mở một PR làm đỏ test và xem nó đỏ theo.',
    '<strong>2.</strong> Bật ruleset trên <code>main</code>: đòi PR + đúng MỘT check <code>ci-xanh</code>. Thử merge PR đỏ.',
    '<strong>3.</strong> Chạy <code>actionlint</code> và <code>zizmor</code> trên <code>.github/workflows</code>; sửa mọi dòng <code>${{ github.event… }}</code> trong <code>run:</code>.',
    '<strong>4.</strong> Thêm một job release: <code>gh release create</code> với thẻ có tiền tố riêng; đẩy một ảnh nhỏ lên GHCR + <code>actions/attest</code>; kiểm bằng <code>gh attestation verify</code>.',
  ]), box('good', '<strong>Đạt khi</strong>: PR đỏ hiện “Merging is blocked”; <code>zizmor</code> không còn <code>template-injection</code>; trang Releases có thẻ của bạn; <code>gh attestation verify oci://ghcr.io/&lt;bạn&gt;/…@sha256:… --repo &lt;bạn&gt;/&lt;kho&gt;</code> thoát 0.<br><br>Soi: <code>gh pr checks &lt;N&gt;</code> · <code>gh api repos/&lt;bạn&gt;/&lt;kho&gt;/rulesets</code>.')) },
]);
