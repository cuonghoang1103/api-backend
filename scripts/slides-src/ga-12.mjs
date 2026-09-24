/**
 * GitHub Actions · Deck ga-12 — Chương 12: Tái sử dụng ở quy mô đội.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch12-tai-su-dung (runner 2.337.0, ubuntu-24.04 20260920.314.1):
 *   36029548881 ch12-goi (reusable: inputs/secrets/outputs, ma trận, chuỗi thường làm secret)
 *   36029549322 / 36029944118 ch12-long / ch12-long2 (A → B → C, secrets: inherit)
 *   36029549200 ch12-quyen-ha · 36029549264 ch12-quyen-nang (startup_failure) · 36029548974 ch12-dua (deadlock)
 *   36029947653 ch12-sau-11 (11 tầng chạy) · 36030076095 ch12-do-sau-12 (vượt độ sâu)
 *   36029548510 ch12-composite · 36029548521 ch12-composite-do · 36029943782 ch12-tu-xa
 *   36029943388 ch12-action (JS 3 hệ, kiem-dist, node20, Docker, quên đóng gói)
 *   36030257162 / 36030357449 ch12-dung-ban (con trỏ di động vs ghim SHA)
 *   36029548603 ch12-neo · 36029546312 ch12-neo-gop (merge key) · actionlint 1.7.12 · ncc 0.45.0.
 * Docs kiểm từ mã nguồn github/docs (commit f71cc2a, 24/09/2026).
 * api-backend: 14 workflow, 24 lượt uses: (origin/main da88704e) — ghim-sha.sh bằng git ls-remote.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, kpis, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-12', code: 'GITHUB ACTIONS · CHƯƠNG 12', title: 'Tái sử dụng ở quy mô đội', sub: 'GitHub Actions · Chương 12' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 3 — đồ thị run ch12-goi: job gọi = một nhóm job ───────────── */
const doThiGoi = () => {
  let s = '';
  const job = (x, y, w, name, d, c = 'grn') => R(x, y, w, 50, { c, fill: '#0f182a', r: 10 }) +
    `<circle cx="${x + 22}" cy="${y + 25}" r="10" fill="${D[c]}"/>` + T(x + 22, y + 31, '✓', { fs: 14, c: '#08101e', a: 'middle', b: true }) +
    T(x + 40, y + 31, name, { fs: 15.5, mono: true, b: true }) + (d ? T(x + w - 10, y + 31, d, { fs: 14, c: 'mu', a: 'end', mono: true }) : '');
  // nhóm bên gọi
  s += R(0, 0, 760, 440, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.02)' }) + T(16, 28, 'run 36029548881 · ch12-goi (bên GỌI)', { fs: 15, c: 'mu', b: true });
  s += job(20, 48, 400, 'mot-lan / dung', '5s');
  s += job(20, 118, 400, 'chuoi-thuong / dung', '5s');
  s += R(20, 190, 400, 236, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.05)', r: 12 }) + T(34, 214, 'ma-tran (3 lần gọi)', { fs: 15, c: 'vio', b: true });
  s += job(34, 226, 372, 'ma-tran (dev, 1) / dung', '5s');
  s += job(34, 290, 372, 'ma-tran (stage, 25) / dung', '29s');
  s += job(34, 354, 372, 'ma-tran (prod, 8) / dung', '11s');
  s += job(480, 200, 260, 'doc-ket-qua', '3s', 'grn');
  s += `<path d="M420 73 C460 73 440 225 476 225" stroke="${D.mu}" stroke-width="2.3" fill="none" marker-end="url(#m-mu)"/>`;
  s += `<path d="M420 308 C460 308 440 225 476 225" stroke="${D.mu}" stroke-width="2.3" fill="none" marker-end="url(#m-mu)"/>`;
  s += T(480, 290, 'needs: [mot-lan, ma-tran]', { fs: 14.5, c: 'mu', mono: true });
  // chú giải bên phải
  const note = (y, a, b, c) => T(790, y, a, { fs: 17, b: true, c }) + T(790, y + 26, b, { fs: 15, c: 'mu' });
  s += note(40, '“mot-lan / dung”', 'tên job BÊN GỌI / tên job BÊN TRONG', 'dk');
  s += note(120, 'Mỗi lần gọi = một job riêng', 'một runner riêng, xếp hàng 2–4 giây', 'tea');
  s += note(200, 'Workflow được gọi KHÔNG', 'có run riêng, không có trang riêng', 'amb');
  s += note(280, 'Log Set up job ghi rõ:', 'Uses: …/ch12-r-dung.yml@refs/heads/…', 'vio');
  s += T(790, 332, '(55b77f9d…) + khối “Inputs”', { fs: 15, c: 'mu', mono: true });
  return sv(1160, 445, s);
};

/* ───────────── Slide 6 — ma trận gọi reusable: output của cái xong CUỐI ───────────── */
const maTranOutput = () => {
  let s = '';
  const X = (sec) => 150 + sec * 30; // 0 = 16:45:20
  s += `<line x1="${X(0)}" y1="300" x2="${X(29)}" y2="300" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 5, 10, 15, 20, 25].forEach((k) => { s += T(X(k), 322, `+${k}s`, { fs: 14, c: 'dim', a: 'middle', mono: true }); });
  const bar = (y, lb, a, b, c, note) => R(X(a), y, X(b) - X(a), 44, { c, fill: 'rgba(255,255,255,.03)', r: 8 }) +
    T(20, y + 29, lb, { fs: 17, b: true, c, mono: true }) + T(X(b) + 12, y + 29, note, { fs: 15, c: 'mu', mono: true });
  s += bar(40, 'dev · 1s', 1, 2, 'tea', 'xong 16:45:22');
  s += bar(110, 'prod · 8s', 2, 10, 'blu', 'xong 16:45:30');
  s += bar(180, 'stage · 25s', 1, 27, 'amb', 'xong 16:45:47 ← CUỐI');
  s += R(0, 350, 1160, 96, { c: 'amb', fill: 'rgba(255,194,51,.07)' }) +
    T(20, 384, 'needs.ma-tran.outputs.moi-truong = stage  ·  needs.ma-tran.outputs.ban-dung = 1.4.1-stage', { fs: 17, mono: true, b: true, c: 'amb' }) +
    T(20, 418, 'prod đứng cuối DANH SÁCH nhưng stage xong cuối THỜI GIAN ⇒ output là của stage. Ba giá trị kia mất.', { fs: 16 });
  return sv(1160, 450, s);
};

/* ───────────── Slide 7 — secret đi qua A → B → C ───────────── */
const chuoiSecret = () => diagram({
  w: 560, h: 440,
  nodes: [
    { id: 'a', x: 130, y: 0, w: 300, h: 84, t: 'A · ch12-long2', d: 'secrets: mot, hai (chuỗi thường)', c: 'dk' },
    { id: 'b', x: 130, y: 150, w: 300, h: 84, t: 'B nhận', d: '[github_token, hai, mot]', c: 'vio', mono: true },
    { id: 'c1', x: 0, y: 320, w: 270, h: 108, t: 'C qua inherit', d: '[github_token, hai, mot]\nC chỉ KHAI mot\n⇒ nhận luôn hai', c: 'red', mono: true },
    { id: 'c2', x: 290, y: 320, w: 270, h: 108, t: 'C qua { mot }', d: '[github_token, mot]\nđúng thứ được đưa', c: 'grn', mono: true },
  ],
  edges: [{ from: 'a', to: 'b', t: 'tường minh' }, { from: 'b', to: 'c1', t: 'inherit' }, { from: 'b', to: 'c2', t: 'liệt kê' }],
});

/* ───────────── Slide 12 — cục bộ vs từ xa ───────────── */

/* ───────────── Slide 18 — con trỏ di động ───────────── */
const conTro = () => {
  let s = '';
  s += R(0, 0, 1160, 70, { c: 'dim', fill: '#0f182a' }) + T(20, 30, 'uses: cuonghoang1103/ga-san-tap/actions/ch12-dem-tep@ch12-dem-tep-v1', { fs: 17, mono: true, b: true, c: 'dk' }) +
    T(20, 56, 'tệp workflow KHÔNG đổi dòng này giữa hai lần chạy — chỉ con trỏ phía bên kia dời đi', { fs: 15, c: 'mu' });
  const col = (x, h1, sha, out, c) => R(x, 100, 560, 190, { c, fill: 'rgba(255,255,255,.03)' }) + T(x + 20, 134, h1, { fs: 18, b: true, c }) +
    T(x + 20, 170, 'Download action repository', { fs: 15, c: 'mu', mono: true }) + T(x + 20, 194, `'…@ch12-dem-tep-v1' (SHA:${sha}…)`, { fs: 15, mono: true }) +
    T(x + 20, 236, 'outputs =', { fs: 15, c: 'mu', mono: true }) + T(x + 20, 262, out, { fs: 15, mono: true, c });
  s += col(0, 'Lần 1 · run 36030257162', 'b78ea231', '{ tong, nhieu-nhat }', 'blu');
  s += col(600, 'Lần 2 · run 36030357449', '1716c9fc', '{ tong, nhieu-nhat, so-loai }', 'amb');
  s += A(560, 195, 596, 195, { c: 'amb' });
  s += R(0, 316, 1160, 110, { c: 'grn', fill: 'rgba(63,185,80,.07)' }) +
    T(20, 350, 'Job ghim SHA (@b78ea231… # v1.0.0) trong CÙNG hai run: outputs = { tong, nhieu-nhat } — cả hai lần.', { fs: 16.5, b: true, c: 'grn' }) +
    T(20, 382, 'Con trỏ: người phát hành quyết định lúc nào bạn nhận bản mới. SHA: bạn quyết định (qua PR của Dependabot).', { fs: 16 }) +
    T(20, 410, '(Phiên dựng bài không đẩy được thẻ git ⇒ con trỏ ở đây là một NHÁNH; GitHub giải nhánh và thẻ thành SHA như nhau.)', { fs: 14.5, c: 'mu' });
  return sv(1160, 430, s);
};

/* ───────────── Slide 19 — đồ thị test action ───────────── */
const doThiTest = () => {
  let s = '';
  const job = (x, y, w, name, d, c) => R(x, y, w, 50, { c, fill: '#0f182a', r: 10 }) +
    `<circle cx="${x + 22}" cy="${y + 25}" r="10" fill="${D[c]}"/>` + T(x + 22, y + 31, c === 'red' ? '✗' : '✓', { fs: 14, c: '#08101e', a: 'middle', b: true }) +
    T(x + 40, y + 31, name, { fs: 15.5, mono: true, b: true }) + T(x + w - 10, y + 31, d, { fs: 14, c: 'mu', a: 'end', mono: true });
  s += T(0, 22, 'run 36029943388 · ch12-action — 7 job, mỗi job kiểm MỘT điều', { fs: 16, c: 'mu', b: true });
  s += job(0, 44, 360, 'js-ba-he (ubuntu-24.04)', '7s', 'grn');
  s += job(0, 106, 360, 'js-ba-he (windows-2025)', '14s', 'grn');
  s += job(0, 168, 360, 'js-ba-he (macos-15)', '7s', 'grn');
  s += job(400, 44, 360, 'kiem-dist', '11s', 'grn');
  s += job(400, 106, 360, 'node20', '5s', 'grn');
  s += job(400, 168, 360, 'docker', '8s', 'grn');
  s += job(800, 106, 360, 'quen-dong-goi', '5s', 'red');
  const n = (x, y, a) => T(x, y, a, { fs: 14.5, c: 'mu' });
  s += n(0, 250, 'action chạy trên 3 hệ, output được test');
  s += n(400, 250, 'dist/ commit = dist/ dựng lại? · Node nào?');
  s += n(800, 186, 'CỐ Ý đỏ: minh hoạ lỗi');
  s += R(0, 280, 1160, 120, { c: 'dk', fill: 'rgba(32,136,255,.07)' }) +
    T(20, 314, 'Test một action = một workflow gọi nó bằng uses: ./đường-dẫn rồi KIỂM output:', { fs: 16.5, b: true }) +
    T(20, 346, 'test "$TONG" -gt 0 && test -n "$NHIEU"   ← tong=18 nhieu-nhat=.js trên cả 3 hệ', { fs: 16, mono: true, c: 'grn' }) +
    T(20, 378, 'Logic thuần (src/dem.js) thì test bằng node --test ngay trên máy — không cần push.', { fs: 16, c: 'mu' });
  return sv(1160, 405, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 12 — Tái sử dụng ở quy mô đội', sub: 'workflow dùng lại · composite action · action JavaScript & Docker · mẫu cho tổ chức', chap: 'CHƯƠNG 12' }),

  /* 2 */ { t: 'Bản đồ chương: năm cỡ tái sử dụng, mỗi cỡ một cái giá', body: mindmap('Thôi chép', 'từ bài 4.5 “ba cách thôi chép” tới cách một đội vận hành chúng', [
    { t: '12.1 Reusable workflow', d: 'workflow_call · inputs/secrets/outputs · ma trận · quyền · độ sâu', c: 'dk' },
    { t: '12.2 Composite action', d: 'một bước nhiều bước · if · continue-on-error · cục bộ/từ xa', c: 'tea' },
    { t: '12.3 JS & Docker action', d: 'ncc · dist/ · node24 · Docker · con trỏ vs SHA · test', c: 'vio' },
    { t: '12.4 Mẫu cho tổ chức', d: 'YAML anchor · template · Dependabot · ghim SHA · chi phí', c: 'amb' },
  ]) },

  /* ───── 12.1 ───── */
  /* 3 */ { t: 'Gọi một workflow = thêm một job, chạy trên runner riêng', body: doThiGoi() },

  /* 4 */ { t: 'workflow_call khai ba thứ; output phải nối qua BỐN tầng', body: two(
    yaml([['on:', ''], ['  workflow_call:', 'chỉ chạy khi được GỌI'], ['    inputs:', ''], ['      moi-truong: { type: string, required: true }', ''], ['      cho-giay:   { type: number, default: 1 }', 'kiểu THẬT'], ['      chay-test:  { type: boolean, default: true }', ''], ['    secrets:', ''], ['      ma-thu: { required: true }', 'chỉ kiểm có GHI'], ['    outputs:', ''], ['      ban-dung:', '③'], ['        value: ${{ jobs.dung.outputs.ban }}', ''], ['jobs:', ''], ['  dung:', ''], ['    outputs:', '②'], ['      ban: ${{ steps.b.outputs.ban }}', ''], ['    steps:', ''], ['      - id: b', '① ghi $GITHUB_OUTPUT']], { fs: 13.5 }),
    `${yaml([['# bên gọi', ''], ['jobs:', ''], ['  mot-lan:', ''], ['    uses: ./.github/workflows/ch12-r-dung.yml', ''], ['    with: { moi-truong: dev, cho-giay: 2 }', ''], ['    secrets: { ma-thu: ${{ secrets.X }} }', ''], ['  doc-ket-qua:', ''], ['    needs: [mot-lan]', ''], ['    # ④ needs.mot-lan.outputs.ban-dung', '= 1.4.1-dev']], { fs: 13.5 })}
     ${box('warn', 'Thiếu một mắt xích ①→②→③→④ là bạn nhận <strong>chuỗi rỗng</strong>, không phải lỗi. Job gọi chỉ được dùng <code>uses with secrets strategy needs if concurrency permissions name</code> (+ <code>cache-mode</code>) — không <code>runs-on</code>, không <code>steps</code>.')}`) },

  /* 5 */ { t: 'Bên được gọi thấy github.* của bên GỌI, không thấy env', body: two(
    t(['# log job "mot-lan / dung" · Set up job', 'Uses: cuonghoang1103/ga-san-tap/.github/workflows/', '  ch12-r-dung.yml@refs/heads/ch12-tai-su-dung (55b77f9d…)', '##[group] Inputs', '  moi-truong: dev', '  cho-giay: 2', '  chay-test: true', 'Complete job name: mot-lan / dung', '# bước đầu tiên in:', 'github.workflow     = ch12-goi', 'github.workflow_ref = …/ch12-goi.yml@refs/heads/…', 'github.job          = dung', '! TU_BEN_GOI (env của bên gọi) = \'<rong>\''], 'run 36029548881', 14),
    list([
      '<code>github.workflow</code>, <code>workflow_ref</code>, <code>event_name</code>, <code>sha</code> — đều là của <strong>bên gọi</strong>. Nó chỉ cho bạn biết ai gọi, không cho biết tệp nào đang chạy.',
      '<code>github.job</code> là id job <strong>bên trong</strong> (<code>dung</code>).',
      '<code>env:</code> mức workflow của bên gọi <strong>không sang</strong> — muốn đưa giá trị vào thì dùng <code>inputs</code>; muốn chung cho nhiều workflow thì dùng <code>vars</code>.',
      'Kiểu input là thật: <code>inputs.chay-test == true</code> đúng với boolean <code>true</code>, không phải chuỗi.',
    ])) },

  /* 6 */ { t: 'Ma trận gọi reusable: ba lần chạy, output chỉ còn MỘT', body: maTranOutput() },

  /* 7 */ { t: 'Secret: required chỉ kiểm có GHI tên; inherit đưa TẤT CẢ', body: two(
    t(['# secrets: { ma-thu: ${{ secrets.CH06_GIA }} }', '# (repo KHÔNG có secret này)', 'env:', '  MA: ', 'do dai ma-thu = 0', '+ job XANH — required: true không kêu gì', '', '# secrets: { ma-thu: gia-tri-thu-khong-that-123 }', 'env:', '  MA: ***', 'do dai ma-thu = 26', '+ giá trị thường đưa qua secrets: cũng bị CHE'], 'run 36029548881', 14),
    chuoiSecret()) },

  /* 8 */ { t: 'Ba giới hạn chỉ lộ ra khi CHẠY — actionlint không bắt cái nào', body: table(['Thử', 'GitHub trả lời (nguyên văn)', 'Run'], [
    ['Bên gọi <code>contents: read</code>, bên được gọi xin <code>write</code>', '!“The nested job \'nang\' is requesting \'contents: write\', but is only allowed \'contents: read\'.” — startup_failure, 0 job', '36029549264'],
    ['Bên được gọi tự HẠ quyền', '+bỏ <code>issues: write</code> được; không khai thì nhận nguyên quyền bên gọi', '36029549200'],
    ['<code>concurrency.group: ${{ github.workflow }}</code> ở CẢ hai bên', '!“Canceling since a deadlock was detected for concurrency group: \'ch12-dua\' between \'goi\' and \'goi / ben-trong\'”', '36029548974'],
    ['Lồng 11 tầng (bên gọi + 10)', '+chạy: <code>vao / tang-01 / … / tang-09 / day</code>', '36029947653'],
    ['Lồng 12 tầng', '!“… would exceed the limit on called workflow depth of 10”', '36030076095'],
  ], { sm: true }) + box('info', 'Docs (09/2026) ghi “tối đa mười tầng: bên gọi + chín”. Đo thật: <strong>10 tầng ĐƯỢC GỌI</strong> + bên gọi. Con số của thông báo lỗi mới là con số hệ thống dùng. Giới hạn khác: 50 workflow dùng lại khác nhau / một tệp.') },

  /* ───── 12.2 ───── */
  /* 9 */ { t: 'Composite: MỘT bước trong mắt GitHub, nhiều bước trong log', body: two(
    t(['##[group]Run ./.github/actions/ch12-chuan-bi', 'with: node-version: 24 · thu-muc: ch12/app', '      bo-qua-cai: false   # mặc định cũng in ra', '##[start-action display=Cai Node …;id=cb.__actions_setup-node]', '##[end-action …;outcome=success;duration_ms=345]', '##[start-action display=Cai phu thuoc;id=cb.__run]', 'added 1 package in 438ms', '##[start-action display=Buoc duoc phep hong;id=cb.__run_2]', '! ##[error]Process completed with exit code 3.', '##[end-action id=cb.__run_2;outcome=failure;', '+   conclusion=success;duration_ms=14]', 'outcome cua ca composite = success'], 'run 36029548510 · job cuc-bo', 13.5),
    list([
      'API và giao diện thấy <strong>1 bước</strong> “Run ./.github/actions/ch12-chuan-bi” (2 giây) + 1 bước “Post Run …” (vì setup-node lồng bên trong có <code>post</code>).',
      'Bên trong, mỗi bước được đánh dấu <code>start-action</code>/<code>end-action</code> với <code>outcome</code> và <code>conclusion</code> riêng.',
      '<code>continue-on-error: true</code> trong composite: <em>outcome=failure</em>, <em>conclusion=success</em> — y như ở workflow (bài 2.4).',
      'Cùng việc viết thẳng: job <code>viet-thang</code> mất 7 giây, job composite 6 giây — composite không tốn thêm runner.',
    ])) },

  /* 10 */ { t: 'Composite giờ làm được if, continue-on-error, và uses lồng nhau', body: two(
    yaml([['runs:', ''], ['  using: composite', ''], ['  steps:', ''], ['    - uses: actions/setup-node@8207…5020 # v7.0.0', 'action LỒNG — ghim SHA'], ['      with: { node-version: ${{ inputs.node-version }} }', ''], ['    - if: inputs.bo-qua-cai != \'true\'', 'input là CHUỖI'], ['      shell: bash', ''], ['      working-directory: ${{ inputs.thu-muc }}', ''], ['      run: npm ci', ''], ['    - continue-on-error: true', ''], ['      shell: bash', ''], ['      run: exit 3', ''], ['    - shell: bash', ''], ['      run: bash "$GITHUB_ACTION_PATH/bao-cao.sh"', 'script cạnh action.yml']], { fs: 13.5 }),
    table(['Từ khoá trong bước composite', ''], [
      ['<code>run</code> · <code>shell</code> (bắt buộc với run)', '+có'],
      ['<code>uses</code> · <code>with</code> · <code>env</code> · <code>id</code> · <code>name</code>', '+có'],
      ['<code>if</code> · <code>working-directory</code>', '+có'],
      ['<code>continue-on-error</code>', '+có'],
      ['<code>timeout-minutes</code>', '-không'],
      ['context <code>secrets</code>', '-không — truyền qua input'],
    ], { sm: true }) + box('tip', 'Input của action luôn là <strong>chuỗi</strong>. Đo (run 36031782920): <code>if: inputs.co</code> CHẠY cả khi <code>co=\'false\'</code>; <code>== true</code> KHÔNG chạy cả khi <code>\'true\'</code>. Dùng <code>== \'true\'</code> hoặc <code>fromJSON(inputs.co)</code>.')) },

  /* 11 */ { t: 'Hai lỗi nạp composite hay gặp — job đã checkout xong mới đỏ', body: two(
    t(['# action.yml có run: nhưng không có shell:', '! ##[error]…/ch12-thieu-shell/action.yml', '!   (Line: 7, Col: 7): Required property is', '!   missing: shell', '! ##[error]Failed to load …/action.yml'], 'job thieu-shell · run 36029548521', 14.5) +
    t(['# action.yml đọc ${{ secrets.CH06_GIA }}', '! ##[error]…/ch12-doc-secret/action.yml', "!   (Line: 9, Col: 12): Unrecognized named-value:", "!   'secrets'. Located at position 1 within", '!   expression: secrets.CH06_GIA'], 'job doc-secret · cùng run', 14.5),
    list([
      'Cả hai là lỗi <strong>nạp tệp</strong> (<code>ActionManifestManager…Load</code>): action cục bộ chỉ được đọc khi bước của nó tới lượt, nên checkout và mọi bước trước vẫn chạy.',
      '<strong>actionlint không đọc <code>action.yml</code></strong> của composite cục bộ — lượt lint cùng lúc không báo gì về hai tệp này.',
      'Cách bắt sớm: một workflow “test action” chạy mỗi PR đụng tới <code>.github/actions/**</code> (bài 12.3).',
    ])) },

  /* 12 */ { t: 'Composite cục bộ hay từ xa: tải lúc nào, nằm ở đâu', body: table(['', 'Cục bộ <code>./.github/actions/x</code>', 'Từ xa <code>owner/repo/path@SHA</code>'], [
    ['Cần checkout trước?', '!CÓ — đọc từ workspace', '+Không — run 36029943782 chạy khi workspace có 0 mục'],
    ['Tải ở đâu', 'không tải; action LỒNG bên trong tải khi bước chạy', 'Set up job tải CẢ KHO, rồi tải luôn action lồng'],
    ['<code>GITHUB_ACTION_PATH</code>', '<code>/home/runner/work/ga-san-tap/ga-san-tap/./.github/actions/ch12-chuan-bi</code>', '<code>/home/runner/work/_actions/cuonghoang1103/ga-san-tap/55b77f9d…/.github/actions/ch12-chuan-bi</code>'],
    ['Phiên bản', 'là bất cứ thứ gì commit được checkout chứa — PR sửa action thì chạy bản đã sửa', 'đúng SHA ghi trong <code>uses:</code>'],
    ['Dependabot', '-bỏ qua — docs: tham chiếu cục bộ bị bỏ qua', '+cập nhật được (kể cả dạng @SHA # vX.Y.Z)'],
  ], { sm: true }) },

  /* 13 */ { t: 'Composite hay reusable workflow: chọn theo thứ bạn cần GOM', body: table(['', 'Composite action', 'Reusable workflow'], [
    ['Gọi ở mức', 'bước (<code>steps[].uses</code>)', 'job (<code>jobs.&lt;id&gt;.uses</code>)'],
    ['Runner', '+dùng chung runner + workspace của bên gọi', 'runner riêng cho MỖI job bên trong'],
    ['Input', 'luôn là chuỗi', 'string / number / boolean thật'],
    ['Secret', '-không có context secrets — qua input', 'secrets: tường minh hoặc inherit'],
    ['Quyền token', 'như job bên gọi', 'chỉ hạ được, nâng = startup_failure'],
    ['runs-on / matrix / environment bên trong', '-không', '+có'],
    ['Trong log', '1 bước, các bước con lồng bên dưới', 'job riêng tên “gọi / trong”'],
    ['Hợp cho', '“mấy BƯỚC này lặp lại” (cài, đăng nhập, báo cáo)', '“cả PIPELINE này lặp lại” (build → test → deploy)'],
  ], { sm: true }) },

  /* ───── 12.3 ───── */
  /* 14 */ { t: 'JavaScript action: src/ → ncc → MỘT tệp dist/ commit vào kho', body: two(
    `${yaml([['actions/ch12-dem-tep/', ''], ['  action.yml', 'runs.using: node24'], ['  src/index.js', 'import @actions/core'], ['  src/dem.js', 'logic thuần, test được'], ['  test/dem.test.js', 'node --test'], ['  dist/index.js', '1250 kB — COMMIT'], ['  dist/package.json', '{"type":"module"}'], ['  dist/licenses.txt', ''], ['  package.json', '"type": "module"'], ['  .gitignore', 'node_modules/']], { fs: 14.5 })}
     ${box('info', 'Runner <strong>không chạy <code>npm install</code></strong> cho action. Thứ nó chạy là đúng tệp <code>runs.main</code> — nên mọi thư viện phải nằm sẵn trong đó.')}`,
    t(['$ npm run build', '> ncc build src/index.js -o dist --license licenses.txt', 'ncc: Version 0.45.0', '+ ncc: Compiling file index.js into ESM', '   0kB  dist/package.json', '  30kB  dist/licenses.txt', '1250kB  dist/index.js', '1280kB  [2158ms] - ncc 0.45.0', '# @actions/core 3.0.1, @actions/github 9.1.1:', '#   "type": "module" — ESM thuần, không còn require()'], 'máy dựng bài · 24/09/2026', 14)) },

  /* 15 */ { t: 'Quên đóng gói thì đỏ ngay; kiem-dist bắt dist/ cũ', body: two(
    t(['# main: index.js (import @actions/core), không dist/', "! Error [ERR_MODULE_NOT_FOUND]: Cannot find package", "!   '@actions/core' imported from /home/runner/work/", '!   ga-san-tap/ga-san-tap/actions/ch12-quen-dong-goi/', '!   index.js', 'Node.js v24.19.0'], 'job quen-dong-goi · run 36029943388', 14.5),
    yaml([['kiem-dist:', 'job “dist/ có khớp không”'], ['  steps:', ''], ['    - uses: actions/checkout@3d3c…90b1 # v7.0.1', ''], ['    - uses: actions/setup-node@8207…5020 # v7.0.0', ''], ['    - working-directory: actions/ch12-dem-tep', ''], ['      run: |', ''], ['        npm ci && npm test && npm run build', ''], ['    - run: git diff --stat --exit-code \\', 'khác ⇒ exit 1 ⇒ đỏ'], ['        actions/ch12-dem-tep/dist/', '✓ ở run 36029943388']], { fs: 13.5 })) },

  /* 16 */ { t: 'Khai node20 vẫn chạy — trên Node 24, kèm một cảnh báo', body: two(
    t(['# action.yml: runs.using: node20', 'khai node20, dang chay bang: v24.19.0', '  (/home/runner/actions-runner/cached/2.337.0/', '   externals/node24/bin/node)', '', '! ##[warning]Node.js 20 is deprecated. The following', '!   actions target Node.js 20 but are being forced to', '!   run on Node.js 24: ./actions/ch12-node20.', '#   …/changelog/2025-09-19-deprecation-of-node-20-…'], 'job node20 · run 36029943388', 14.5),
    list([
      'Action JS <strong>không mang Node theo</strong>: nó chạy bằng Node của runner (<code>externals/node24</code>). <code>runs.using</code> chỉ là một lời xin.',
      'Docs 09/2026 liệt kê hai giá trị: <code>node20</code> và <code>node24</code>. Runner 2.337.0 đã ép <code>node20</code> lên 24 (cảnh báo cuối job).',
      'Việc của người viết action: khai <code>node24</code>, test trên Node 24, phát hành major mới — người dùng ghim SHA sẽ thấy cảnh báo này cho tới khi nhận PR cập nhật.',
    ])) },

  /* 17 */ { t: 'Docker action: dựng ảnh NGAY trong bước — 4 giây, và chỉ Linux', body: two(
    t(['#6 [1/3] FROM docker.io/library/alpine:3.20@sha256:d9e853e8…', '#7 [2/3] RUN apk add --no-cache jq bash', '#7 1.088 OK: 11 MiB in 20 packages', '#7 DONE 2.9s', '#9 naming to docker.io/library/4098b3:a112db87…', '$ docker run … --workdir /github/workspace --rm \\', '    -e "INPUT_TEN" … -v "…/ga-san-tap":"/github/workspace" \\', '    4098b3:a112db87… "Cuong"', 'tham so $1  = Cuong  ·  INPUT_TEN = Cuong', 'Alpine Linux v3.20 · jq jq-1.7.1', 'GITHUB_OUTPUT = /github/file_commands/set_output_8a02…', '+ output loi-chao = Xin chao Cuong tu Docker action'], 'job docker · run 36029943388', 13.5),
    list([
      '<code>image: Dockerfile</code> ⇒ dựng lại <strong>mỗi job</strong> (ở đây ~3,5 giây, 2,9 giây là <code>apk add</code>). Muốn nhanh: đẩy ảnh sẵn lên GHCR và dùng <code>image: docker://ghcr.io/…@sha256:…</code>.',
      'Input vào hai đường: <code>args:</code> (thành <code>$1</code>) và biến <code>INPUT_TEN</code>.',
      'Workspace và các tệp lệnh được <strong>mount</strong> vào: ghi <code>$GITHUB_OUTPUT</code> như bình thường.',
      'Chỉ chạy trên Linux (bài 4.1). Mang công cụ riêng (jq, bash) thì hợp; cần chạy mọi hệ thì chọn JS.',
    ])) },

  /* 18 */ { t: 'Con trỏ di động: cùng một tệp, hai SHA, hai bộ output', body: conTro() },

  /* 19 */ { t: 'Test action ngay trong kho của nó, trên mọi hệ nó hứa chạy', body: doThiTest() },

  /* ───── 12.4 ───── */
  /* 20 */ { t: 'Năm cỡ tái sử dụng — chọn cỡ NHỎ NHẤT đủ dùng', body: table(['Cỡ', 'Phạm vi', 'Phiên bản', 'Khi nào'], [
    ['YAML anchor <code>&amp;</code>/<code>*</code>', 'trong MỘT tệp', 'theo tệp', 'hai job cùng env/steps'],
    ['Script trong kho', 'một kho', 'theo commit', 'logic shell, cần test trên máy'],
    ['Composite cục bộ', 'một kho', 'theo commit', 'chuỗi bước lặp ở ≥3 workflow'],
    ['Reusable workflow / action ở kho riêng', 'nhiều kho', 'ghim SHA, Dependabot', 'nhiều đội cùng một pipeline'],
    ['Workflow template (tổ chức)', 'gợi ý cho kho MỚI', '-chép một lần rồi trôi', 'chuẩn khởi đầu, không phải chuẩn duy trì'],
  ], { sm: true }) + box('tip', 'Template chỉ <strong>chép</strong> vào kho mới — sửa template không sửa kho cũ. Cái cần giữ đồng bộ thì phải là reusable workflow/action có phiên bản, không phải template.') },

  /* 21 */ { t: 'YAML anchor: & và * chạy được, merge key << thì không', body: two(
    `${yaml([['jobs:', ''], ['  lint:', ''], ['    env: &env-chung', 'định nghĩa'], ['      NODE_ENV: test', ''], ['    steps: &buoc-chung', ''], ['      - uses: actions/checkout@3d3c…', ''], ['  test:', ''], ['    env: *env-chung', 'dùng lại'], ['    steps: *buoc-chung', '✓ run 36029548603']], { fs: 14.5 })}
     ${yaml([['    env:', ''], ['      <<: *env-goc', 'gộp rồi ghi đè'], ['      NODE_ENV: production', '✗ không hỗ trợ']], { fs: 14.5 })}`,
    t(['# GitHub (run 36029546312):', '! Invalid workflow file: …/ch12-neo-gop.yml#L1', '! (Line: 13, Col: 10): A mapping was not expected', '# dòng 13 cột 10 = nơi ĐỊNH NGHĨA &env-goc,', '#   không phải dòng <<: (dòng 21)', '', '$ actionlint .github/workflows/ch12-neo-gop.yml', '! ch12-neo-gop.yml:21:7: GitHub Actions does not', '!   support YAML merge key "<<" [syntax-check]', '+ actionlint chỉ đúng dòng — GitHub thì không'], 'cùng một sai, hai cách báo', 14)) },

  /* 22 */ { t: 'Workflow template sống trong kho .github của TỔ CHỨC', body: two(
    yaml([['# kho: <to-chuc>/.github', ''], ['workflow-templates/', ''], ['  ci-node.yml', 'workflow mẫu'], ['  ci-node.properties.json', 'CÙNG tên, .properties.json'], ['# trong ci-node.yml:', ''], ['on:', ''], ['  push:', ''], ['    branches: [ $default-branch ]', 'thay khi tạo'], ['# properties.json:', ''], ['{ "name": "CI Node", "description": "…",', ''], ['  "iconName": "…", "categories": ["JavaScript"],', ''], ['  "filePatterns": ["package.json$"] }', 'gốc kho có tệp khớp']], { fs: 13.5 }),
    list([
      'Hiện ra khi ai đó <strong>tạo workflow mới</strong> trong một kho của tổ chức (kho <code>.github</code> public ⇒ mọi kiểu kho; private ⇒ chỉ kho private).',
      '<strong>Chỉ có ở tài khoản TỔ CHỨC.</strong> Sân tập thuộc tài khoản cá nhân nên phần này không chạy thử được — mọi chi tiết trên slide lấy từ docs (09/2026).',
      'Đây là <em>điểm xuất phát</em>, không phải liên kết: kho tạo từ template giữ một bản chép. Template tốt nên chỉ vài dòng — gọi reusable workflow ghim SHA.',
    ])) },

  /* 23 */ { t: 'api-backend: 24 lượt uses:, 0 ghim SHA — tra hết SHA mất 4 giây', body: two(
    `${kpis([{ v: '14', l: 'workflow', c: 'blu' }, { v: '24', l: 'lượt uses:', c: 'amb' }, { v: '0', l: 'ghim SHA', c: 'red' }, { v: '0', l: 'reusable / composite', c: 'dim' }])}
     ${box('info', 'Bài 4.2 đếm được 21 lượt; <code>origin/main</code> hôm nay (da88704e) là 24. Số chỗ phải bảo trì <strong>chỉ tăng</strong> nếu không có gì gom lại.')}`,
    t(['$ bash ghim-sha.sh   # git ls-remote, không cần gh', 'actions/cache             v4 -> 0057852b…  # v4.3.0', 'actions/checkout          v4 -> 11d5960a…  # v4.4.0', 'actions/download-artifact v4 -> d3f86a10…  # v4.3.0', 'actions/setup-java        v4 -> cf277c60…  # v4.9.1', 'actions/setup-node        v4 -> 49933ea5…  # v4.4.0', 'actions/upload-artifact   v4 -> ea165f8d…  # v4.6.2', 'docker/build-push-action  v6 -> 10e90e36…  # v6.19.2', 'docker/login-action       v3 -> c94ce9fb…  # v3.7.0', 'docker/setup-buildx-action v3 -> 8d2750c6… # v3.12.0', '+ real 0m3.921s'], 'api-backend · 24/09/2026', 13.5).replaceAll('~/ga-san-tap', '~/api-backend')) },

  /* 24 */ { t: 'Dependabot giữ SHA tươi — nhưng bỏ qua mọi uses: ./', body: two(
    yaml([['# .github/dependabot.yml', ''], ['version: 2', ''], ['updates:', ''], ['  - package-ecosystem: github-actions', ''], ['    directory: /', 'đọc .github/workflows'], ['    schedule:', ''], ['      interval: weekly', ''], ['    groups:', ''], ['      actions:', 'gộp thành 1 PR'], ['        patterns: ["*"]', '']], { fs: 15 }),
    list([
      'Cập nhật <code>uses:</code> của <strong>action và reusable workflow ở kho khác</strong> — cả dạng <code>@SHA # vX.Y.Z</code> (sửa luôn chú thích cùng dòng).',
      '<strong>Bỏ qua</strong> tham chiếu cục bộ <code>./…</code> và <code>docker://</code> (docs 09/2026).',
      'SHA không gắn thẻ nào ⇒ bot đưa lên <strong>commit mới nhất</strong>, có thể khác bản phát hành mới nhất.',
      'Vì thế action nội bộ của đội nên phát hành bằng thẻ <code>vX.Y.Z</code>: các kho dùng nó nhận PR theo <em>bản phát hành</em>, không theo từng commit.',
    ])) },

  /* 25 */ { t: 'Sai lầm hay gặp ở Chương 12', body: cards([
    { ic: '🔗', t: 'Quên một mắt xích output', d: 'Bước → job → workflow_call → needs. Thiếu một tầng là chuỗi rỗng, không lỗi.', c: 'red' },
    { ic: '🎲', t: 'Đọc output của ma trận', d: 'Chỉ còn giá trị của lần xong CUỐI. Cần cả ba ⇒ artifact hoặc job tổng hợp.', c: 'amb' },
    { ic: '🔑', t: 'Tin required: true', d: 'Secret rỗng/không tồn tại vẫn qua. Kiểm độ dài ngay đầu job.', c: 'ora' },
    { ic: '🌊', t: 'secrets: inherit mặc định', d: 'Đưa MỌI secret, kể cả thứ bên dưới không khai. Liệt kê tường minh.', c: 'vio' },
    { ic: '📦', t: 'Quên ncc / dist cũ', d: 'ERR_MODULE_NOT_FOUND, hoặc dist/ lệch src/. Job kiem-dist.', c: 'blu' },
    { ic: '⛓', t: 'Cùng concurrency group hai bên', d: '“deadlock was detected” — đặt group ở MỘT phía.', c: 'pnk' },
  ], 3) },

  /* 26 */ { t: 'Bảng tra nhanh Chương 12', body: table(['Muốn', 'Viết / làm'], [
    ['Gom cả job', '<code>on: workflow_call</code> + <code>jobs.x.uses: ./.github/workflows/y.yml</code> (hoặc <code>owner/repo/.github/workflows/y.yml@SHA</code>)'],
    ['Trả giá trị ra', 'bước <code>$GITHUB_OUTPUT</code> → <code>jobs.j.outputs</code> → <code>on.workflow_call.outputs.v.value</code> → <code>needs.x.outputs.v</code>'],
    ['Đưa secret', '<code>secrets: { ten: ${{ secrets.X }} }</code> — tránh <code>inherit</code> trừ khi cần tất cả'],
    ['Quyền cho bên được gọi', '<code>permissions:</code> ở job gọi = TRẦN; bên trong chỉ hạ được'],
    ['Gom chuỗi bước', '<code>.github/actions/x/action.yml</code>, <code>using: composite</code>, mỗi <code>run</code> có <code>shell</code>'],
    ['Script cạnh action', '<code>bash "$GITHUB_ACTION_PATH/x.sh"</code>'],
    ['Viết action JS', '<code>runs.using: node24</code> · <code>ncc build</code> · commit <code>dist/</code> · job kiem-dist'],
    ['Lặp trong một tệp', '<code>&amp;ten</code> … <code>*ten</code> (không <code>&lt;&lt;:</code>)'],
    ['Ghim + giữ tươi', '<code>@SHA # vX.Y.Z</code> + Dependabot <code>github-actions</code>'],
  ], { sm: true }) },

  /* 27 */ { t: 'Thực hành Chương 12 (60 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Tách phần “cài + lint + test” thành <code>.github/workflows/ci-dung-chung.yml</code> (<code>workflow_call</code>, 1 input <code>node-version</code>, 1 output <code>ket-qua</code>). Gọi nó từ <code>ci.yml</code>.',
    '<strong>2.</strong> Gọi nó bằng ma trận Node 22/24; in <code>needs.&lt;job&gt;.outputs</code> — đoán trước nó là của bản nào.',
    '<strong>3.</strong> Chuyển 3 bước lặp nhất thành composite trong <code>.github/actions/</code> có một bước <code>if:</code>.',
    '<strong>4.</strong> Chạy <code>ghim-sha.sh</code>; ghim mọi <code>uses:</code> của kho sang <code>@SHA # vX.Y.Z</code>; thêm <code>dependabot.yml</code>.',
  ]), box('good', '<strong>Đạt khi</strong>: đồ thị run có job tên <code>gọi / trong</code>; log Set up job có dòng <code>Uses: …@…</code> và khối <code>Inputs</code>; output ma trận đúng như bạn đoán; <code>grep -l "@v[0-9]" .github/workflows/*.yml</code> không in tệp nào.<br><br>Soi: <code>gh run view &lt;id&gt; --log | grep -E "Uses:|start-action|Download action"</code>.')) },
]);
