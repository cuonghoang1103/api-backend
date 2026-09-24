/**
 * GitHub Actions · Deck ga-03 — Chương 3: Biểu thức, context, và lúc nào thứ gì tồn tại.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch03-bieu-thuc (runner 2.337.0, ubuntu-24.04):
 *   36000179987 ép kiểu + hàm (56 biểu thức in ra) · 36000180005 17 cách viết if: · 36000677288 if: với chuỗi lúc chạy
 *   36000534865 / 36000816501 / 36000176328 / 36000178561 / 36000817664 lỗi "Invalid workflow file" (context sai chỗ, off/no, nháy kép)
 *   36000179986 hàm trạng thái sau một bước hỏng · 36000179989 bấm huỷ · 36000179955 lúc nào tính cái gì (ma trận động)
 *   36000955142 tiêm lệnh qua tiêu đề PR + tên nhánh (PR #3, tự tạo giữa hai nhánh của sân tập, vô hại, đã đóng)
 *   actionlint 1.7.12 trên Mac. Bảng context: docs.github.com …/workflows-and-actions/contexts#context-availability (09/2026).
 * Số của kho api-backend: đếm lại .github/workflows/ ngày 24/09/2026 (14 workflow, 94 biểu thức, 9 if:).
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, pipe, bars, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-03', code: 'GITHUB ACTIONS · CHƯƠNG 3', title: 'Biểu thức và context', sub: 'GitHub Actions · Chương 3' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 3 — dòng thời gian một run: cái gì được tính ở đâu ───────────── */
const dongThoiGian = () => {
  const W = 170, G = 24, Y = 64, H = 228;
  const col = ['blu', 'vio', 'dk', 'dim', 'grn', 'amb'];
  const box = [
    ['① Sự kiện', ['push · PR · tay', 'github.event', 'đã chốt xong']],
    ['② Đọc YAML', ['on: KHÔNG có', '  biểu thức', 'kiểm context', 'sai chỗ → ✗', '  run 0 giây']],
    ['③ Lập job', ['if: của job', 'strategy.matrix', 'runs-on', 'name · env', 'timeout-minutes', 'concurrency']],
    ['④ Chờ máy', ['if: false → ⊘', 'không xin máy', 'runner = null', 'hàng đợi 2–6s']],
    ['⑤ Mỗi bước', ['if: của bước', 'name · env', 'with · run', 'hashFiles()', 'steps.* có rồi']],
    ['⑥ Shell', ['chạy tệp {0}', 'biểu thức đã', 'biến mất', 'chỉ còn chữ']],
  ];
  let s = '';
  s += R(0, 8, 4 * W + 3 * G, 40, { c: 'dk', fill: 'rgba(32,136,255,.10)', r: 8 }) + T((4 * W + 3 * G) / 2, 34, 'TRÊN GITHUB — trước khi có máy', { fs: 17, a: 'middle', b: true, c: 'dk' });
  s += R(4 * (W + G), 8, 2 * W + G, 40, { c: 'grn', fill: 'rgba(63,185,80,.10)', r: 8 }) + T(4 * (W + G) + (2 * W + G) / 2, 34, 'TRÊN RUNNER — lúc bước chạy', { fs: 17, a: 'middle', b: true, c: 'grn' });
  box.forEach(([h, ls], i) => {
    const x = i * (W + G);
    s += R(x, Y, W, H, { c: col[i], fill: '#0f182a' }) + T(x + W / 2, Y + 32, h, { fs: 18, a: 'middle', b: true, c: col[i] });
    ls.forEach((l, j) => { s += T(x + 14, Y + 66 + j * 27, l, { fs: 15, mono: true, c: '#dbe7f7' }); });
    if (i < 5) s += A(x + W + 2, Y + H / 2, x + W + G - 2, Y + H / 2, { c: 'mu', sw: 2.5 });
  });
  const xd = 4 * (W + G) - G / 2;
  s += `<line x1="${xd}" y1="4" x2="${xd}" y2="${Y + H + 20}" stroke="${D.amb}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  s += T(xd, Y + H + 40, 'runner nhận job', { fs: 15, a: 'middle', c: 'amb', b: true });
  s += R(0, 350, 1160, 84, { c: 'dim', fill: 'rgba(255,255,255,.03)', dash: true });
  s += T(18, 380, '③ chỉ thấy: github · needs · vars · inputs · matrix · strategy (+ secrets trong env của job)', { fs: 16.5 });
  s += T(18, 412, '⑤ thấy thêm: runner · job · env · steps · secrets — vì chỉ lúc này mới CÓ máy và CÓ bước trước', { fs: 16.5, c: 'grn' });
  return sv(1160, 440, s);
};

/* ───────────── Slide 17 — if: được đọc qua ba ngả ───────────── */
const baNgaIf = () => {
  let s = '';
  const row = (y, viet, qua, kq, c, ghi) =>
    R(0, y, 330, 76, { c: 'dim', fill: '#0f182a' }) + T(16, y + 46, viet, { fs: 17, mono: true }) +
    A(334, y + 38, 388, y + 38, { c }) +
    R(392, y, 380, 76, { c, fill: '#0f182a' }) + T(410, y + 32, qua[0], { fs: 16, b: true, c }) + T(410, y + 58, qua[1], { fs: 15, mono: true, c: '#dbe7f7' }) +
    A(776, y + 38, 830, y + 38, { c }) +
    R(834, y, 326, 76, { c, fill: 'rgba(255,255,255,.03)' }) + T(852, y + 32, kq, { fs: 17, b: true, c }) + T(852, y + 58, ghi, { fs: 14.5, c: 'mu' });
  s += row(10, "if: 'false'", ['YAML bỏ nháy → chuỗi', "đọc chuỗi như BIỂU THỨC: false"], '⊘ bỏ qua', 'grn', 'nháy YAML vô hại');
  s += row(104, "if: ${{ 'false' }}", ['hằng chuỗi bị “gập” lại', "rồi đọc như biểu thức: false"], '⊘ bỏ qua', 'grn', "${{ 'abc' }} → lỗi: 'abc' lạ");
  s += row(198, '${{ x }} == \'y\'', ['có chữ NGOÀI ${{ }}', "→ ghép chuỗi: \"false == 'y'\""], '✓ LUÔN chạy', 'red', 'chuỗi khác rỗng = đúng');
  s += row(292, 'if: steps.x.outputs.co', ["giá trị LÚC CHẠY = 'false'", 'là dữ liệu, không đọc lại'], '✓ CHẠY', 'red', "so == 'true' hoặc fromJSON()");
  s += T(580, 408, 'Chữ trong file được đọc như biểu thức; giá trị sinh LÚC CHẠY thì không — chuỗi \'false\' lúc chạy là ĐÚNG.', { fs: 16.5, a: 'middle', c: 'amb', b: true });
  return sv(1160, 420, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 3 — Biểu thức, context, và lúc nào thứ gì tồn tại', sub: 'ranh giới ${{ }} và shell · context ở đâu · ép kiểu · hàm · điều kiện if:', chap: 'CHƯƠNG 3' }),

  /* 2 */ { t: 'Bản đồ chương: biểu thức được tính TRƯỚC khi shell thấy', body: mindmap('Biểu thức ${{ }}', 'tính ở GitHub hoặc ở runner — không bao giờ ở shell', [
    { t: '3.1 Ranh giới', d: 'thay chữ vào script · tiêm lệnh · vá bằng env:', c: 'red' },
    { t: '3.2 Context', d: 'github · env · steps · needs… · có ở ĐÂU · vắng = rỗng', c: 'tea' },
    { t: '3.3 Ép kiểu', d: "'0' == 0 · chuỗi 'false' · hoa/thường · if: đọc thế nào", c: 'amb' },
    { t: '3.4 Hàm', d: 'contains · format · fromJSON · case · hashFiles', c: 'vio' },
    { t: '3.5 Điều kiện', d: 'success/failure/always/cancelled · điều kiện chết', c: 'grn' },
  ]) },

  /* ───── 3.1 ───── */
  /* 3 */ { t: 'Một run có hai lượt tính: trên GitHub trước, trên runner sau', body: dongThoiGian() },

  /* 4 */ { t: 'Bằng chứng: tên bước mang giá trị bước trước vừa ghi ra', body: two(
    yaml([
      ['- id: dau', ''],
      ['  run: echo "luc=$(date …)" >> "$GITHUB_OUTPUT"', 'ghi lúc chạy'],
      ["- name: ${{ format('Buoc sau thay {0} luc {1}',", 'TÊN bước'],
      ['    steps.dau.outputs.may, steps.dau.outputs.luc) }}', 'là biểu thức'],
      ["  run: echo \"${{ hashFiles('ghi-luc-chay.txt') }}\"", 'tệp chưa có'],
      ['- run: echo xin-chao > ghi-luc-chay.txt', 'giờ mới tạo'],
      ["- run: echo \"${{ hashFiles('ghi-luc-chay.txt') }}\"", ''],
    ], { fs: 13.5 }),
    t(['$ gh api …/runs/36000179955/jobs', '2 Buoc dau ghi output', '+ 3 Buoc sau thay x86_64 luc 12:37:12.558', '4 Run echo xin-chao > ghi-luc-chay.txt', '# job arm64 cùng run:', '+ 3 Buoc sau thay aarch64 luc 12:37:15.058', '# log bước 3 và bước 5:', 'hashFiles luc nay = ', '! (rỗng — tệp chưa tồn tại)', 'hashFiles bay gio = 27c99b3d29fa…544696'], 'run 36000179955', 14.5)) +
    box('info', 'GitHub không thể biết trước <code>12:37:12.558</code>: biểu thức ở mức BƯỚC được tính trên runner, ngay lúc bước bắt đầu — rồi mới ghi tệp script cho shell.') },

  /* 5 */ { t: 'Nhét ${{ github.event… }} vào run: là để người lạ viết mã', body:
    yaml([
      ['on: { pull_request: { branches: [ch03-bieu-thuc] } }', 'PR giữa hai nhánh của chính sân tập'],
      ['- run: |', 'HỎNG: ghép thẳng vào script'],
      ['    echo "Tieu de PR: ${{ github.event.pull_request.title }}"', 'tiêu đề do người mở PR gõ'],
      ['    echo "Nhanh: ${{ github.head_ref }}"', 'tên nhánh cũng vậy'],
    ], { fs: 14.5 }) +
    t(['# PR #3 · tiêu đề: Thu tiem: $(echo DA-CHAY-LENH-CUA-NGUOI-LA) va "nhay kep" · nhánh: ch03-tiem-$(id)', '# script runner nhận được (log “Run”):', 'echo "Tieu de PR: Thu tiem: $(echo DA-CHAY-LENH-CUA-NGUOI-LA) va "nhay kep""', 'echo "Nhanh: ch03-tiem-$(id)"', '# shell chạy nó:', '! Tieu de PR: Thu tiem: DA-CHAY-LENH-CUA-NGUOI-LA va nhay kep', '! Nhanh: ch03-tiem-uid=1001(runner) gid=1001(runner) groups=1001(runner),4(adm),…,118(docker),…'], 'run 36000955142 · job de-bi-tiem', 14) +
    box('bad', 'Hai lệnh <code>$( )</code> đã CHẠY trên runner; dấu nháy kép của tiêu đề đã đóng chuỗi của bạn. Ai mở được PR thì chọn được tiêu đề và tên nhánh.') },

  /* 6 */ { t: 'Vá: đưa giá trị qua env: — shell đọc nó như DỮ LIỆU', body: two(
    yaml([
      ['  - env:', 'thay vào ĐÂY'],
      ['      TIEU_DE: ${{ github.event.pull_request.title }}', 'thành biến'],
      ['      NHANH: ${{ github.head_ref }}', ''],
      ['    run: |', ''],
      ['      echo "Tieu de PR: $TIEU_DE"', 'shell đọc'],
      ['      echo "Nhanh: $NHANH"', 'lúc chạy'],
    ], { fs: 14 }),
    t(['# job da-va · cùng PR, cùng run', '= echo "Tieu de PR: $TIEU_DE"', '= echo "Nhanh: $NHANH"', '+ Tieu de PR: Thu tiem: $(echo DA-CHAY-…) va "nhay kep"', '+ Nhanh: ch03-tiem-$(id)', '# y nguyên từng ký tự, không lệnh nào chạy'], 'run 36000955142 · job da-va', 14.5)) +
    box('good', 'Phép thay VẪN xảy ra, nhưng vào khối <code>env:</code>, nơi kết quả thành giá trị một biến. Script chỉ chứa <code>$TIEU_DE</code> — thứ shell không bao giờ đọc như mã.') },

  /* 7 */ { t: 'actionlint bắt tiêu đề PR nhưng bỏ sót tên nhánh', body: two(
    t(['$ docker run --rm -v "$PWD":/repo -w /repo \\', '    rhysd/actionlint:latest ch03-tiem.yml', '! ch03-tiem.yml:12:36: "github.event.pull_request', '!   .title" is potentially untrusted. avoid using', '!   it directly in inline scripts. instead, pass', '!   it through an environment variable.', '# dòng 13 (github.head_ref): KHÔNG cảnh báo', '# nhưng log thật: $(id) đã chạy từ tên nhánh'], 'actionlint 1.7.12 · trên Mac', 14.5),
    table(['Người ngoài gõ được', 'Ví dụ'], [
      ['-tiêu đề / thân PR, issue', '<code>github.event.pull_request.title</code>'],
      ['-tên nhánh', '<code>github.head_ref</code>'],
      ['-thông điệp commit', '<code>github.event.head_commit.message</code>'],
      ['-bình luận, review', '<code>github.event.comment.body</code>'],
      ['-tên, email tác giả', '<code>…author.name</code>, <code>…email</code>'],
      ['+an toàn trong run:', '<code>runner.os</code>, <code>matrix.*</code> bạn tự viết'],
    ], { sm: true })) },

  /* 8 */ { t: 'Chỉ nháy ĐƠN; lỗi cú pháp hỏng cả file trước khi có máy', body: two(
    t(['# run 36000817664 · 0 giây · 0 job', '! Invalid workflow file:', '!   .github/workflows/ch03-sai-cho-2.yml', "! (Line: 20, Col: 9): Unexpected symbol:", "!   '\"refs/heads/main\"'. Located at position 15", '!   within expression:', '!   github.ref == "refs/heads/main"'], 'trang run trên GitHub', 14.5),
    list([
      "Chuỗi trong biểu thức: <code>'…'</code>. Nháy đơn bên trong: viết đôi <code>'it''s'</code>.",
      'Mở đầu bằng <code>!</code> (phủ định) thì bọc: <code>if: ${{ !cancelled() }}</code> hoặc <code>\'!cancelled()\'</code> — <code>!</code> là ký hiệu của YAML.',
      'Không có biểu thức nào trong <code>on:</code> — cả <code>branches</code>, <code>paths</code>, <code>cron</code>.',
      'Lỗi cú pháp/context bị bắt lúc ĐỌC FILE: run đỏ 0 giây, không job nào, không log — chỉ có dòng chữ trên trang run.',
    ])) },

  /* ───── 3.2 ───── */
  /* 9 */ { t: 'Mỗi khoá chỉ thấy một số context — bảng “Context availability”', body: table(['Khoá trong workflow', 'github needs vars inputs', 'matrix strategy', 'secrets', 'env runner job steps'], [
    ['<code>run-name</code>, <code>concurrency</code> (mức workflow)', '+github vars inputs', '-', '-', '-'],
    ['<code>env</code> (mức workflow)', '+github vars inputs', '-', '+có', '-'],
    ['<code>jobs.&lt;id&gt;.if</code>', '+đủ bốn', '-', '-', '-'],
    ['<code>strategy</code>', '+đủ bốn', '-', '-', '-'],
    ['<code>runs-on</code>, <code>name</code>, <code>timeout-minutes</code> (job)', '+đủ bốn', '+có', '-', '-'],
    ['<code>jobs.&lt;id&gt;.env</code>', '+đủ bốn', '+có', '+có', '-'],
    ['<code>steps.if</code>', '+đủ bốn', '+có', '-KHÔNG', '+có'],
    ['<code>steps.run</code> / <code>env</code> / <code>with</code> / <code>name</code>', '+đủ bốn', '+có', '+có', '+có'],
  ], { sm: true }) + box('tip', 'Đọc theo dòng thời gian slide 3: càng về phía runner, càng thấy nhiều. <code>secrets</code> không dùng được trong <code>if:</code> ở BẤT KỲ mức nào — đưa nó vào <code>env:</code> rồi kiểm <code>env.X != \'\'</code>.') },

  /* 10 */ { t: 'Dùng context sai chỗ: GitHub từ chối cả file, actionlint báo trước', body: two(
    t(['# run 36000178561 và 36000817664 (0 giây)', "! (Line: 10) Unrecognized named-value: 'env'", '!   … expression: env.MAY      ← env: workflow', "! (Line: 18) Unrecognized named-value: 'env'", '!   … expression: env.MAY      ← runs-on', "! (Line: 10) Unrecognized named-value: 'runner'", "!   … expression: runner.os == 'Linux'  ← if job", "! (Line: 17) Unrecognized named-value: 'secrets'", "!   … expression: secrets.KHONG_CO != ''"], 'trang run · Invalid workflow file', 13.5),
    t(['$ actionlint ch03-sai-cho.yml ch03-sai-cho-2.yml', '! 10:13 context "env" is not allowed here.', '!   available contexts are "github",', '!   "inputs", "secrets", "vars"', '! 13:9 context "runner" is not allowed here.', '!   available: "github", "inputs",', '!   "needs", "vars"', '! 24:13 context "secrets" is not allowed here.', '# cùng 5 lỗi, bắt được TRƯỚC khi push'], 'actionlint 1.7.12', 13.5)) +
    box('warn', 'GitHub dừng ở LOẠI lỗi đầu: lượt đầu chỉ báo hai lỗi <code>env</code>; sửa xong mới hiện <code>runner</code>/<code>secrets</code>/nháy kép. actionlint báo đủ một lượt.') },

  /* 11 */ { t: 'api-backend: 94 biểu thức, phần lớn là CẤU HÌNH', body: two(
    bars([
      { l: 'secrets', v: 56, c: 'red' }, { l: 'inputs', v: 9, c: 'vio' }, { l: 'env', v: 9, c: 'tea' },
      { l: 'runner', v: 5, c: 'grn' }, { l: 'github', v: 5, c: 'blu' }, { l: 'steps', v: 4, c: 'amb' },
      { l: 'matrix', v: 4, c: 'ora' }, { l: 'hashFiles', v: 2, c: 'pnk' },
    ], { lw: 130 }),
    list([
      '<strong>94</strong> biểu thức trong <strong>14</strong> workflow của api-backend (đếm lại 24/09/2026; bài cũ đếm 74/11).',
      '<code>secrets</code> = 60% — vì phần lớn workflow đi deploy.',
      '<code>github.event.*</code> = <strong>0</strong> lần: chưa có chỗ nào để tiêm lệnh. Giữ như thế.',
      '<code>if: &#36;{{ inputs.lesson }}</code> trong <code>ship-lab211.yml</code> ĐÚNG — context <code>inputs</code> giữ boolean thật.',
    ])) },

  /* 12 */ { t: 'Context vắng mặt không báo lỗi — nó ra RỖNG', body: two(
    table(['Biểu thức (run 36000179987)', 'Kết quả'], [
      ['<code>github.event.khong.co.gi</code>', '![] rỗng'],
      ['<code>toJSON(github.event.khong.co.gi)</code>', 'null'],
      ["<code>github.event.khong.co.gi == null</code>", 'true'],
      ["<code>github.event.khong.co.gi == ''</code>", '!true'],
      ["<code>hashFiles('ch03/khong-co/**')</code>", '![] rỗng'],
      ["<code>format('cache-{0}-{1}', runner.os, hashFiles(…))</code>", '-cache-Linux-'],
    ], { sm: true }),
    list([
      'Đi sâu vào thuộc tính không có: không lỗi, chỉ ra <code>null</code> — in ra thành chuỗi rỗng.',
      '<code>null == \'\'</code> là <strong>true</strong> (cả hai ép thành 0): không phân biệt được “không có” với “rỗng”.',
      'id bước gõ sai, output chưa ghi, job không nằm trong <code>needs:</code> — đều ra rỗng như nhau.',
      'Khoá cache đuôi <code>-</code> nghĩa là <code>hashFiles</code> không khớp gì.',
    ])) },

  /* 13 */ { t: 'steps: cần id + GITHUB_OUTPUT; outcome ≠ conclusion', body: two(
    yaml([
      ['- id: dung_thu', 'bắt buộc có id'],
      ['  continue-on-error: true', 'được phép hỏng'],
      ['  run: exit 3', ''],
      ['- run: echo "outcome=${{ steps.dung_thu.outcome }}', ''],
      ['    conclusion=${{ steps.dung_thu.conclusion }}"', ''],
      ["- if: steps.dung_thu.conclusion == 'failure'", 'B'],
      ["- if: steps.dung_thu.outcome == 'failure'", 'C'],
    ], { fs: 13.5 }),
    t(['# run 36000179986 · job sau-khi-hong', '2 dung-thu (continue-on-error)   success', '3 A: outcome=failure conclusion=success', "4 B if …conclusion == 'failure'  skipped", "+ 5 C if …outcome == 'failure'     success", '# outcome = TRƯỚC khi tha thứ', '# conclusion = SAU khi tha thứ'], 'gh run view --json jobs', 14.5)) +
    box('tip', 'Muốn phản ứng với cú hỏng THẬT của một bước được tha → đọc <code>outcome</code>. Đọc <code>conclusion</code> cho ra một điều kiện không bao giờ đúng.') },

  /* 14 */ { t: 'Muốn biết context chứa gì: in nó ra — qua env:', body: two(
    yaml([
      ['- env:', 'qua env, KHÔNG vào run'],
      ['    GH: ${{ toJSON(github) }}', 'cả payload sự kiện'],
      ['    RUNNER: ${{ toJSON(runner) }}', ''],
      ['  run: |', ''],
      ["    echo \"$GH\" | jq -c '{event_name, ref_name, run_number}'", 'lọc bằng jq'],
      ['    echo "token: $(echo "$GH" | jq -r .token)"', ''],
      ['    echo "${#GH}"   # số byte', ''],
      ['    echo "$RUNNER" | jq -c .', ''],
    ], { fs: 13.5 }),
    t(['# run 36001779915', '{"event_name":"push","ref_name":"ch03-bieu-thuc",', '  "run_number":"1"}          ← số mà là CHUỖI', '+ token: ***                 ← tự che', 'so khoa cap 1 cua github: 34', 'event.pull_request: null     ← push thì không có', 'so byte cua toJSON(github): 10997', '{"os":"Linux","arch":"X64",', ' "environment":"github-hosted",', ' "temp":"/home/runner/work/_temp", …}'], 'log thật', 14)) +
    box('warn', 'Khối <code>env:</code> được in NGUYÊN VĂN trong tiêu đề nhóm của log — 11 KB JSON hiện ra trước cả lệnh. Token bị che, nhưng mọi thứ khác trong payload thì không.') },

  /* ───── 3.3 ───── */
  /* 15 */ { t: 'So sánh khác kiểu: cả hai bị ép thành SỐ', body: two(
    table(['Biểu thức', 'Thật'], [
      ["<code>'0' == 0</code>", '+true'], ["<code>'' == 0</code>", '+true'], ['<code>null == 0</code>', '+true'],
      ["<code>null == ''</code>", '!true'], ["<code>' 1 ' == 1</code>", '!true'], ["<code>'0x1' == 1</code>", '!true'],
      ["<code>'1e2' == 100</code>", '+true'], ["<code>'1.0' == 1</code>", '+true'],
    ], { sm: true }),
    table(['Biểu thức', 'Thật'], [
      ["<code>'abc' == 0</code>", '-false'], ["<code>'abc' != 0</code>", '+true'], ["<code>'abc' &lt; 1</code>", '-false'], ["<code>'abc' &gt;= 1</code>", '-false'],
      ["<code>'false' == false</code>", '-false'], ["<code>'true' == true</code>", '-false'], ["<code>fromJSON('[]') == fromJSON('[]')</code>", '-false'], ["<code>'abc' == 'ABC'</code>", '!true'],
    ], { sm: true })) +
    `<p class="c-note">Run 36000179987. <code>'true' == true</code> SAI: chuỗi <code>'true'</code> không phải số → NaN. Mảng/đối tượng chỉ bằng chính nó. So chuỗi KHÔNG phân biệt hoa/thường.</p>` },

  /* 16 */ { t: 'Đúng/sai: chỉ năm giá trị là SAI — chuỗi \'false\' thì ĐÚNG', body: two(
    table(['Biểu thức', 'Thật'], [
      ["<code>!''</code>", 'true'], ["<code>!'false'</code>", '-false → chuỗi này ĐÚNG'], ["<code>!'0'</code>", '-false → chuỗi này ĐÚNG'],
      ['<code>!0</code> · <code>!null</code>', 'true'], ["<code>!fromJSON('[]')</code>", '-false → mảng rỗng ĐÚNG'],
    ], { sm: true }),
    table(['&& / || trả về TOÁN HẠNG', 'Thật'], [
      ["<code>'a' &amp;&amp; 'b'</code>", 'b'], ["<code>'' || 'mac-dinh'</code>", '+mac-dinh'], ["<code>'false' || 'mac-dinh'</code>", '!false'],
      ["<code>true &amp;&amp; '' || 'X'</code>", '-X  (ba ngôi vỡ)'], ["<code>false &amp;&amp; '' || 'X'</code>", 'X'],
    ], { sm: true })) +
    box('info', 'SAI: <code>false</code>, <code>0</code>, <code>-0</code>, <code>\'\'</code>, <code>null</code>. Mọi thứ khác ĐÚNG. <code>a &amp;&amp; B || C</code> chỉ là “ba ngôi” khi <code>B</code> đúng — muốn chọn giá trị an toàn hơn dùng hàm <code>case()</code> (slide 22).') },

  /* 17 */ { t: 'if: chữ trong FILE là biểu thức — giá trị LÚC CHẠY thì không', body: baNgaIf() },

  /* 18 */ { t: '17 cách viết if: và kết quả thật trên runner', body: two(
    table(['Viết (run 36000180005)', 'Bước'], [
      ["<code>if: false</code> · <code>'false'</code> · <code>\"false\"</code>", '+⊘ bỏ qua'],
      ["<code>if: 0</code> · <code>'0'</code> · <code>${{ '0' }}</code>", '+⊘ bỏ qua'],
      ["<code>${{ false }}</code> · <code>${{ 'false' }}</code>", '+⊘ bỏ qua'],
      ["<code>${{ false }} == true</code>", '-✓ CHẠY'],
      ["<code>${{ github.ref_name }} == 'khong-phai'</code>", '-✓ CHẠY'],
      ["<code>github.ref_name == 'khong-phai'</code>", '+⊘ bỏ qua'],
    ], { sm: true }),
    table(['Viết', 'Bước'], [
      ["<code>github.ref == 'ch03-bieu-thuc'</code>", '!⊘ (ref là refs/heads/…)'],
      ["<code>github.ref_name == 'CH03-BIEU-THUC'</code>", '!✓ chạy (hoa/thường)'],
      ["<code>'!cancelled()'</code> · <code>${{ !cancelled() }}</code>", '+✓ chạy'],
      ['<code>github.event.khong.co</code>', '⊘ (null)'],
      ['<code>toJSON(github.event.khong.co)</code>', "-✓ ('null' là chuỗi)"],
      ['<code>if: off</code> · <code>if: no</code>', "-✗ file hỏng: 'off' lạ"],
    ], { sm: true })) +
    box('warn', 'Bài cũ nói <code>if: \'false\'</code> CHẠY bước và <code>if: off</code> tắt được bước — đo thật thì cả hai SAI: cái đầu bị bỏ qua, cái sau làm hỏng cả file (GitHub đọc YAML kiểu 1.2, <code>off</code> chỉ là chữ).') },

  /* 19 */ { t: "Bẫy thật: chuỗi 'false' sinh ra LÚC CHẠY làm if: luôn đúng", body: two(
    yaml([
      ['- id: x', ''],
      ['  run: echo "co=false" >> "$GITHUB_OUTPUT"', "output LUÔN là chuỗi"],
      ['- if: steps.x.outputs.co', '15'],
      ['- if: ${{ steps.x.outputs.co }}', '16'],
      ["- if: steps.x.outputs.co == 'true'", '17'],
      ['- if: fromJSON(steps.x.outputs.co)', '18'],
      ["# env: TAT: 'false' → if: env.TAT", '06'],
    ], { fs: 14 }),
    t(['# run 36000677288', '! 15 if: steps.x.outputs.co          success', '! 16 if: ${{ steps.x.outputs.co }}  success', "+ 17 … == 'true'                     skipped", '+ 18 fromJSON(steps.x.outputs.co)   skipped', '! 06 if: env.TAT                    success', "# Chương 1 (run 35987558284):", '+ inputs.bo_qua_test = false  → skipped', '! github.event.inputs.… = false → success'], 'gh run view --json jobs', 14.5)) +
    box('tip', 'Output của bước, <code>env</code>, <code>github.event.inputs</code> luôn là CHUỖI. So tường minh <code>== \'true\'</code> hoặc đổi kiểu bằng <code>fromJSON()</code>. Riêng context <code>inputs</code> giữ boolean thật.') },

  /* 20 */ { t: 'So chuỗi không phân biệt hoa thường — cả == lẫn contains', body: two(
    table(['Biểu thức (run 36000179987)', 'Thật'], [
      ["<code>'abc' == 'ABC'</code>", '!true'],
      ["<code>github.ref_name == 'CH03-BIEU-THUC'</code>", '!true'],
      ["<code>contains('Hello world', 'LLO')</code>", '!true'],
      ["<code>contains(ds, 'PUSH')</code>", '!true'],
      ["<code>contains(ds, 'pull')</code>", '-false'],
      ["<code>startsWith(github.ref, 'REFS/HEADS/')</code>", '!true'],
    ], { sm: true }),
    list([
      'Tên nhánh <code>Release</code> và <code>release</code> là HAI nhánh trong git — nhưng <code>==</code> coi là MỘT.',
      'Cần phân biệt hoa/thường thì so trong shell: <code>[ "$A" = "$B" ]</code>.',
      '<code>ds</code> = <code>fromJSON(\'["push","pull_request"]\')</code>. Trên chuỗi, <code>contains</code> tìm chuỗi con; trên MẢNG, nó cần một phần tử BẰNG — <code>\'pull\'</code> không khớp.',
    ])) },

  /* ───── 3.4 ───── */
  /* 21 */ { t: 'Bảng hàm với kết quả thật', body: table(['Hàm (run 36000179987)', 'Ra', 'Nhớ'], [
    ["<code>format('{0}-{1}-{2}', 'v', 1, true)</code>", 'v-1-true', 'số, boolean thành chữ'],
    ["<code>format('{{khong thay}} {0}', 'x')</code>", '{khong thay} x', 'ngoặc nhọn thật: gấp đôi'],
    ["<code>format('[{0}]', null)</code>", '[]', 'null thành rỗng'],
    ["<code>join(fromJSON('[1,2,3]'), '+')</code>", '1+2+3', 'mặc định nối bằng dấu phẩy'],
    ["<code>join(github.event.commits.*.author.name, ', ')</code>", 'CuongHoang', '<code>.*</code> gom thuộc tính'],
    ["<code>fromJSON('3') == 3</code>", '+true', 'lấy KIỂU thật từ chuỗi'],
    ["<code>fromJSON('true') == 'true'</code>", '-false', 'boolean ≠ chuỗi (NaN)'],
    ['<code>0xff</code>', '255', 'hằng số hex được phép'],
  ], { sm: true }) },

  /* 22 */ { t: 'case(): chọn giá trị theo điều kiện, không còn bẫy && ||', body: two(
    yaml([
      ['env:', ''],
      ['  MOI_TRUONG: ${{ case(', 'hàm MỚI (docs 09/2026)'],
      ["    github.ref_name == 'main', 'production',", 'cặp 1'],
      ["    startsWith(github.ref_name, 'ch03'), 'thu-nghiem',", 'cặp 2'],
      ["    'khac') }}", 'mặc định'],
    ], { fs: 14.5 }),
    t(['# run 36000179987 · nhánh ch03-bieu-thuc', '+ MOI_TRUONG = thu-nghiem', '# run 36001492952 · giá trị giữa rỗng:', "! true && '' || 'X'      → X   (vỡ)", "+ case(true, '', 'X')    → ''  (đúng ý)", "+ case(false, 'a', 'mac-dinh') → mac-dinh"], 'kết quả thật', 15)) +
    box('info', '<code>case(đk1, gt1, đk2, gt2, …, mặc_định)</code> trả giá trị của điều kiện ĐÚNG đầu tiên. actionlint 1.7.12 chưa biết hàm này nhưng không báo lỗi; GitHub chạy nó bình thường.') },

  /* 23 */ { t: 'hashFiles(): thứ tự MẪU đổi thì khoá đổi — đo thật', body: two(
    t(["$ # GitHub (run 36000179987)", "hashFiles('ch03/a.txt')", '  = eaa47f2fa5d6…7f125826', "hashFiles('ch03/a.txt', 'ch03/b.txt')", '! = 1f218639f46f…9518dc73', "hashFiles('ch03/b.txt', 'ch03/a.txt')", '! = fb7d2a24f465…2a408c8', "hashFiles('ch03/*.txt')   # run 36001492952", '+ = 1f218639f46f…9518dc73  (= a rồi b)', "hashFiles('ch03/khong-co/**')", '! = (rỗng)'], 'GitHub', 14),
    t(['$ python3 tai-lap.py   # nối digest NHỊ PHÂN', 'a    eaa47f2fa5d6…7f125826', '+ ab   1f218639f46f…9518dc73  khớp', '+ ba   fb7d2a24f465…2a408c8   khớp', '# nối theo THỨ TỰ MẪU; trong 1 glob: a trước b', '# bài cũ in “GIỐNG NHAU” từ bản Python', '# có sorted() — GitHub thì không'], 'trên Mac', 14.5)) +
    box('warn', 'Khoá cache nhiều mẫu: giữ thứ tự mẫu cố định giữa các workflow, nếu không hai khoá cùng nội dung sẽ khác nhau. Mẫu không khớp gì → chuỗi rỗng, không lỗi.') },

  /* 24 */ { t: 'fromJSON(): ma trận và timeout tính từ output của job trước', body: two(
    `${pipe({ w: 560, h: 260, cols: [[{ n: 'ke-hoach', s: 'ok', d: '3s' }], [{ n: 'x64', s: 'ok', d: '3s' }, { n: 'arm64', s: 'ok', d: '3s' }, { n: 'bo-qua', s: 'skip' }]], needs: [['ke-hoach', 'x64'], ['ke-hoach', 'arm64'], ['ke-hoach', 'bo-qua']] })}
     <p class="c-note">Run 36000179955. <code>bo-qua</code>: <code>if: needs.ke-hoach.outputs.phut == '99'</code> → ⊘, <code>runner = null</code>.</p>`,
    yaml([
      ['ke-hoach:', ''],
      ['  outputs: { ds: …, phut: … }', 'chuỗi'],
      ['chay:', ''],
      ['  needs: ke-hoach', ''],
      ['  strategy:', ''],
      ['    matrix:', ''],
      ['      may: ${{ fromJSON(needs.ke-hoach.outputs.ds) }}', 'mảng'],
      ['  runs-on: ${{ matrix.may }}', ''],
      ['  timeout-minutes: ${{ fromJSON(', 'số'],
      ['    needs.ke-hoach.outputs.phut) }}', ''],
    ], { fs: 13.5 }), 'r') },

  /* 25 */ { t: 'Ba hàm cần đúng chỗ: hashFiles ở bước, trạng thái ở if:', body: table(['Hàm', 'Dùng được ở', 'Vì sao'], [
    ['<code>hashFiles()</code>', '<code>steps.*</code> (run, env, with, if, name…)', 'đọc TỆP trên đĩa runner — trước khi có máy thì không có tệp'],
    ['<code>success()</code> <code>failure()</code>', '<code>jobs.&lt;id&gt;.if</code>, <code>steps.if</code>', 'hỏi trạng thái các bước/job TRƯỚC'],
    ['<code>always()</code> <code>cancelled()</code>', '<code>jobs.&lt;id&gt;.if</code>, <code>steps.if</code>', '—'],
    ['mọi hàm khác', 'mọi chỗ có biểu thức', 'thuần tính toán'],
  ]) + t(['$ actionlint ch03-if.yml', '! 54:28: calling function "cancelled" is not allowed here. "cancelled" is only available in', '!   "jobs.<job_id>.if", "jobs.<job_id>.steps.if"      ← tôi lỡ viết ${{ !cancelled() }} trong name:'], 'actionlint · một lỗi của chính bài này', 14) },

  /* ───── 3.5 ───── */
  /* 26 */ { t: 'Sau một bước hỏng: mỗi hàm trạng thái làm gì', body: two(
    table(['Bước sau “hong-that” (exit 1)', 'Kết quả'], [
      ['(không ghi if) = <code>success()</code>', '-⊘ skipped'],
      ['<code>if: success()</code>', '-⊘ skipped'],
      ['<code>if: failure()</code>', '+✓ chạy'],
      ['<code>if: always()</code>', '+✓ chạy'],
      ['<code>if: cancelled()</code>', '-⊘ skipped'],
      ["<code>if: '!cancelled()'</code>", '+✓ chạy'],
    ], { sm: true }),
    table(['Kết hợp', 'Kết quả'], [
      ["<code>github.ref_name == 'ch03-bieu-thuc'</code>", '-⊘ skipped'],
      ["<code>always() &amp;&amp; github.ref_name == …</code>", '!✓ chạy dù đã hỏng'],
      ["<code>failure() &amp;&amp; steps.hong.outcome == …</code>", '+✓ chạy'],
      ['… in <code>job.status</code>', 'failure'],
    ], { sm: true })) +
    `<p class="c-note">Run 36000179986. Có hàm trạng thái nào trong điều kiện thì <code>success()</code> ngầm bị GỠ — <code>always() &amp;&amp; …</code> chạy cả khi đã hỏng.</p>` },

  /* 27 */ { t: 'Bấm huỷ: chỉ always() và cancelled() còn chạy', body: two(
    table(['Bước (run 36000179989, huỷ lúc 12:37:39)', 'Kết quả'], [
      ['<code>sleep 300</code>', '⊘ cancelled'],
      ['<code>if: success()</code>', '-⊘ skipped'],
      ['<code>if: failure()</code>', '-⊘ skipped'],
      ['<code>if: always()</code>', '!✓ chạy'],
      ['<code>if: cancelled()</code>', '+✓ chạy'],
      ["<code>if: '!cancelled()'</code>", '-⊘ skipped'],
    ], { sm: true }),
    t(['! ##[error]The operation was canceled.   12:37:54', '= Run echo "chay, job.status=cancelled"', 'chay, job.status=cancelled', 'Terminate orphan process: pid (1915) (sleep)'], 'log · 15 giây sau khi bấm', 14.5)) +
    box('warn', '<code>always()</code> chạy CẢ khi người ta bấm huỷ — đừng dùng cho deploy. Báo cáo/dọn dẹp: <code>!cancelled()</code>. Việc riêng lúc huỷ: <code>cancelled()</code>.') },

  /* 28 */ { t: 'Đặt điều kiện ở đâu: bốn tầng, bốn cái giá', body: cards([
    { ic: '🚪', t: 'on: (branches, paths)', d: 'Rẻ nhất — không tạo run. Nhưng ô kiểm bắt buộc không bao giờ báo cáo ⇒ PR kẹt (bài 1.5).', c: 'blu' },
    { ic: '🧱', t: 'if: của JOB', d: 'Tính trên GitHub trước khi xin máy: ⊘ không tốn giây nào. Nhưng skip LAN TRUYỀN xuống mọi job needs nó.', c: 'vio' },
    { ic: '🪜', t: 'if: của BƯỚC', d: 'Job vẫn chạy nên ô kiểm vẫn báo. Bước bị bỏ qua tốn 0 giây và HIỆN trên trang run.', c: 'grn' },
    { ic: '🐚', t: 'if trong bash', d: 'Linh hoạt nhất, nhưng bước luôn xanh — trang run không cho biết đã đi nhánh nào.', c: 'amb' },
  ], 2) },

  /* 29 */ { t: 'Năm điều kiện chết — cả năm đã chạy thật', body: table(['Điều kiện', 'Hỏng thế nào', 'Viết lại'], [
    ["<code>${{ x }} == 'y'</code>", '-luôn chạy (chữ ngoài ${{ }})', "<code>x == 'y'</code>"],
    ['<code>if: steps.x.outputs.co</code> (co=false)', '-luôn chạy (chuỗi lúc chạy)', "<code>== 'true'</code> / <code>fromJSON()</code>"],
    ["<code>github.ref == 'main'</code>", '!không bao giờ chạy', "<code>github.ref_name == 'main'</code>"],
    ["<code>steps.x.conclusion == 'failure'</code> (bước được tha)", '!không bao giờ chạy', '<code>steps.x.outcome</code>'],
    ['<code>always() &amp;&amp; …</code> cho deploy', '-chạy cả khi hỏng / bị huỷ', 'bỏ <code>always()</code>'],
  ], { sm: true }) + box('tip', 'Điều kiện TẮT một thứ gì đó thì kiểm bằng một run có hiện ⊘, không bằng đọc file. Chạy <code>actionlint</code> trước mỗi push: nó bắt được ca 1 và mọi lỗi context sai chỗ.') },

  /* 30 */ { t: 'Sai lầm hay gặp ở Chương 3', body: cards([
    { ic: '💉', t: '${{ github.event… }} trong run:', d: 'Người lạ chọn được mã. Đưa qua env:.', c: 'red' },
    { ic: '🔤', t: "Tin chuỗi 'false' là sai", d: 'Output bước, env, event.inputs là chuỗi. So == \'true\'.', c: 'amb' },
    { ic: '🧩', t: 'Chữ ngoài ${{ }} trong if:', d: 'Thành chuỗi ghép ⇒ luôn đúng. Bỏ ${{ }} đi.', c: 'ora' },
    { ic: '📍', t: 'Context sai chỗ', d: 'runner trong if job, env trong runs-on, secrets trong if ⇒ file hỏng.', c: 'vio' },
    { ic: '🔑', t: 'hashFiles không khớp', d: 'Ra rỗng ⇒ khoá hằng, cache cũ mãi. Soi đuôi “-”.', c: 'pnk' },
    { ic: '🟢', t: 'always() && …', d: 'Gỡ success() ngầm: chạy cả khi hỏng/huỷ.', c: 'blu' },
  ], 3) },

  /* 31 */ { t: 'Bảng tra nhanh Chương 3', body: table(['Muốn', 'Viết'], [
    ['Giá trị người ngoài gõ vào script', '<code>env: X: ${{ github.event… }}</code> rồi <code>"$X"</code>'],
    ['So nhánh', "<code>github.ref_name == 'main'</code> · tag: <code>startsWith(github.ref, 'refs/tags/')</code>"],
    ['Output / env là boolean', "<code>steps.x.outputs.co == 'true'</code> · <code>fromJSON(…)</code>"],
    ['Chọn giá trị theo điều kiện', "<code>case(đk, 'a', 'b')</code> · cũ: <code>đk &amp;&amp; 'a' || 'b'</code> (a phải khác rỗng)"],
    ['Mặc định khi rỗng', "<code>inputs.tag || 'latest'</code>"],
    ['Báo cáo luôn chạy (trừ huỷ)', "<code>if: ${{ !cancelled() }}</code>"],
    ['Phản ứng bước được tha đã hỏng', "<code>if: steps.x.outcome == 'failure'</code>"],
    ['Xem context', '<code>env: J: ${{ toJSON(github) }}</code> → <code>echo "$J"</code>'],
    ['Kiểm trước khi push', '<code>docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint</code>'],
  ], { sm: true }) },

  /* 32 */ { t: 'Thực hành Chương 3 (45 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Một bước in 10 biểu thức ép kiểu qua <code>env:</code> (<code>\'0\' == 0</code>, <code>\'abc\' == \'ABC\'</code>, <code>\'true\' == true</code>…). Đoán trước, rồi đối chiếu log.',
    '<strong>2.</strong> Ghi <code>co=false</code> vào <code>$GITHUB_OUTPUT</code>; ba bước sau: <code>if: steps.x.outputs.co</code>, <code>== \'true\'</code>, <code>fromJSON()</code>. Đếm ✓ ⊘.',
    '<strong>3.</strong> Tạo nhánh <code>thu-$(id)</code>, mở PR vào nhánh thử của bạn; workflow <code>pull_request</code> in <code>github.head_ref</code> thẳng trong <code>run:</code>, rồi vá bằng <code>env:</code>.',
    '<strong>4.</strong> Một bước <code>exit 1</code> + sáu bước <code>success/failure/always/cancelled/!cancelled/always() &amp;&amp; …</code>.',
    '<strong>5.</strong> Chạy actionlint trên mọi file trước khi push.',
  ]), box('good', '<strong>Đạt khi</strong> bạn chỉ ra được trong log: dòng <code>uid=</code> của bản hỏng và chuỗi nguyên văn của bản vá; bảng ✓/⊘ khớp dự đoán; và giải thích được vì sao <code>if: steps.x.outputs.co</code> CHẠY.<br><br>Soi: <code>gh run view &lt;id&gt; --log</code> · <code>gh run view &lt;id&gt; --json jobs</code>.<br><br>Xong: đóng PR, không merge.')) },
]);
