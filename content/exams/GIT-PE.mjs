/**
 * Git & GitHub — Practical Exam (PE): 5 bài thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/git/s00…s13`. Khác đề FE (50 câu trắc
 * nghiệm, đọc lệnh), đề này bắt GÕ LỆNH: ba cây và .gitignore, xung đột merge
 * ba chiều, bản đồ hoàn tác (stash · amend · revert), khảo cổ lịch sử (pickaxe ·
 * --follow · bisect), và một vòng remote đầy đủ (bị từ chối · pull --rebase ·
 * tag có chú giải · describe).
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `starterCode` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 *   **git 2.51.1** (macOS Darwin 25.6, Node v22.21.0). `expectedOutput` là
 *   nguyên văn stdout, không phải dự đoán.
 *   Kiểm lại: `node scripts/exam-check.mjs ./content/exams/GIT-PE.mjs`
 *
 * ⚠️ VÌ SAO BÀI NỘP LÀ MỘT FILE `.js` CHỨ KHÔNG PHẢI `.sh`.
 *   Bộ kiểm chạy mọi `sampleSolution` bằng `node`, nên mỗi câu là một file
 *   CommonJS gồm SÁU dòng khung (mkdtemp + spawn bash) và BA chuỗi:
 *     • `CHUAN_BI` — đề dựng sẵn kho mã, không sửa;
 *     • `LOI_GIAI` — **phần bài làm của bạn, và là phần duy nhất được chấm**;
 *     • `KIEM`     — đề in ra trạng thái để đối chiếu, không sửa.
 *   Cái khung ấy không phải trang trí: nó chạy bài làm trong một thư mục tạm
 *   dùng một lần, với `GIT_CONFIG_GLOBAL=/dev/null` và định danh cố định, nên
 *   kết quả không phụ thuộc vào cấu hình Git trên máy ai — và học viên tự chấm
 *   được bài mình trước khi nộp bằng đúng một lệnh `node Q1.js`.
 *
 * ⚠️ KHÔNG in mã băm trong `KIEM`. SHA của commit phụ thuộc dấu thời gian, nên
 *   mọi phép đối chiếu đều đi qua `--format=%s`, `ls`, `git status --short`,
 *   `git cat-file -t` hoặc số đếm. Chỗ duy nhất chạm tới SHA là `git describe`
 *   ở câu 5, và nó bị `sed` thay bằng `XXXXXXX` ngay tại đó.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/GIT-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/git-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 * `weight` giữ nguyên vai trò cũ (bộ chấm AI in ra kèm tiêu chí).
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/** Sáu dòng khung ở cuối mỗi file — giống hệt nhau ở cả năm câu. */
const KHUNG_CHAY =
  'const thuMuc = mkdtempSync(path.join(tmpdir(), \'git-pe-\'));\n' +
  'process.stdout.write(execFileSync(\'bash\', [\'-eu\', \'-c\', CHUAN_BI + LOI_GIAI + KIEM], {\n' +
  '  cwd: thuMuc, encoding: \'utf8\', timeout: 15000,\n' +
  '  env: { ...process.env,\n' +
  '    GIT_CONFIG_GLOBAL: \'/dev/null\', GIT_CONFIG_SYSTEM: \'/dev/null\',\n' +
  '    GIT_AUTHOR_NAME: \'An\', GIT_AUTHOR_EMAIL: \'an@example.com\',\n' +
  '    GIT_COMMITTER_NAME: \'An\', GIT_COMMITTER_EMAIL: \'an@example.com\' },\n' +
  '}));\n';

/** Bốn dòng require ở đầu mỗi file. */
const KHUNG_DAU =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "const { execFileSync } = require('node:child_process');\n" +
  "const { mkdtempSync } = require('node:fs');\n" +
  "const { tmpdir } = require('node:os');\n" +
  "const path = require('node:path');\n" +
  '\n';

const MOC_GIAI = '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n';
const MOC_CHO = '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n';

/** Khung mặc định của phần bài làm: chạy được ngay, chỉ là chưa làm gì. */
const LOI_GIAI_TRONG =
  'const LOI_GIAI = `\n' +
  "echo 'TODO: viet cac lenh git cua ban o day' >&2\n" +
  '`;\n';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor. Each question shows a <b>Starter</b> block — copy it into the file <b>verbatim</b> and write your answer only in the middle region, between the two <code>ĐỀ CHO SẴN</code> markers. That region is a single string called <code>LOI_GIAI</code>, and <b>its contents are ordinary shell: one git command per line</b>. Everything outside it is part of the grading; changing it is how you fail a question you actually solved.</li>' +
  '<li><b>Why a .js file and not a .sh file.</b> The six framework lines at the bottom run your commands with <code>bash</code> inside a fresh throwaway directory, with <code>GIT_CONFIG_GLOBAL=/dev/null</code> and a fixed author identity. That means your answer behaves the same on your machine and on the grader\'s, and it means you can check your own work before submitting. You never edit those lines; you only fill the string.</li>' +
  '<li><b>No npm packages.</b> Only <code>git</code> itself, plus the ordinary shell built-ins <code>echo</code>, <code>cat</code>, <code>ls</code>, <code>wc</code> and <code>grep</code>. No <code>gh</code>, no network — every remote in this exam is a directory on the same disk, which is exactly what lesson 5.1 means when it says a remote is just a saved URL.</li>' +
  '<li>Run it with <code>node Q1.js</code> and compare with the "expected output" block, <b>line for line</b>. The script runs from an empty directory every single time, so you can run it as often as you like and nothing accumulates.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a script that prints the wrong lines cannot pass. But this is a Git exam, so the <b>commands</b> are graded too: undoing a shared commit with <code>reset --hard</code> instead of <code>revert</code>, reaching for <code>--force</code> where fetching first was the answer, or hard-coding a value that the question asked you to find with a search all cost marks <em>even when the output matches</em>. Two mechanical rules to save you an afternoon: the script runs under <code>set -eu</code>, so a command that exits non-zero stops everything — put <code>|| true</code> after the ones you expect to fail, such as the <code>git merge</code> that is supposed to conflict; and <b>never open an interactive editor</b>, because there is no terminal — use <code>-m</code>, <code>--no-edit</code> or <code>--format</code> instead.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn. Mỗi câu có khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào file và chỉ viết lời giải ở vùng giữa, nằm giữa hai mốc <code>ĐỀ CHO SẴN</code>. Vùng đó là một chuỗi duy nhất tên <code>LOI_GIAI</code>, và <b>nội dung bên trong là shell bình thường: mỗi dòng một lệnh git</b>. Mọi thứ nằm ngoài nó là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Vì sao là file .js chứ không phải .sh.</b> Sáu dòng khung ở cuối file chạy các lệnh của bạn bằng <code>bash</code> trong một thư mục tạm dùng một lần, với <code>GIT_CONFIG_GLOBAL=/dev/null</code> và một danh tính tác giả cố định. Nhờ vậy bài làm của bạn cho ra kết quả giống nhau trên máy bạn và trên máy người chấm, và nhờ vậy bạn tự chấm được bài mình trước khi nộp. Bạn không bao giờ sửa mấy dòng đó; bạn chỉ điền vào chuỗi.</li>' +
  '<li><b>Không dùng gói npm nào.</b> Chỉ <code>git</code>, cộng vài lệnh shell thông thường <code>echo</code>, <code>cat</code>, <code>ls</code>, <code>wc</code> và <code>grep</code>. Không <code>gh</code>, không mạng — mọi remote trong đề này đều là một thư mục trên cùng cái đĩa, đúng như bài 5.1 nói rằng remote chỉ là một URL được đặt tên.</li>' +
  '<li>Chạy bằng <code>node Q1.js</code> rồi đối chiếu với khối "kết quả mong đợi", <b>từng dòng một</b>. Kịch bản luôn chạy từ một thư mục rỗng, nên bạn chạy bao nhiêu lần cũng được và không có gì dồn lại.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — kịch bản in sai dòng thì không thể qua. Nhưng đây là bài thi Git, nên <b>lệnh</b> cũng bị chấm: hoàn tác một commit dùng chung bằng <code>reset --hard</code> thay vì <code>revert</code>, với tay tới <code>--force</code> ở chỗ đáng lẽ chỉ cần fetch trước, hay gõ cứng một giá trị mà đề yêu cầu phải TÌM RA bằng một phép tìm — tất cả đều bị trừ điểm <em>ngay cả khi kết quả in ra đúng</em>. Hai luật cơ học giúp bạn tiết kiệm cả buổi chiều: kịch bản chạy dưới <code>set -eu</code>, nên một lệnh thoát khác 0 là dừng tất cả — hãy thêm <code>|| true</code> sau những lệnh bạn BIẾT là sẽ hỏng, chẳng hạn lệnh <code>git merge</code> vốn được thiết kế để xung đột; và <b>đừng bao giờ mở trình soạn thảo tương tác</b>, vì ở đó không có terminal nào — hãy dùng <code>-m</code>, <code>--no-edit</code> hoặc <code>--format</code>.</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_CHUAN_BI =
  'const CHUAN_BI = `\n' +
  'git init -q -b main\n' +
  '`;\n' +
  '\n';

const Q1_KIEM =
  'const KIEM = `\n' +
  "echo '== status =='   ; git status --short\n" +
  "echo '== log =='      ; git log --format=%s || true\n" +
  "echo '== HEAD:app ==' ; git show HEAD:app.txt || true\n" +
  "echo '== staged =='   ; git diff --staged --name-only\n" +
  "echo '== tracked ==' ; git ls-files\n" +
  '`;\n' +
  '\n';

const Q1_STARTER = KHUNG_DAU + Q1_CHUAN_BI + MOC_GIAI + LOI_GIAI_TRONG + '\n' + MOC_CHO + Q1_KIEM + KHUNG_CHAY;

const Q1_SOLUTION =
  'const LOI_GIAI = `\n' +
  "echo 'v1' > app.txt\n" +
  'git add app.txt\n' +
  "git commit -q -m 'feat: khoi tao app'\n" +
  '\n' +
  "echo '*.log' > .gitignore\n" +
  'git add .gitignore\n' +
  "git commit -q -m 'chore: them gitignore'\n" +
  '\n' +
  "# debug.log khop *.log nen no khong bao gio xuat hien trong status.\n" +
  "echo 'dong log' > debug.log\n" +
  "echo 'ghi chu' > notes.txt\n" +
  '\n' +
  '# Hai lan sua lien tiep: lan dau di vao index, lan sau chi nam tren dia.\n' +
  "echo 'v2' > app.txt\n" +
  'git add app.txt\n' +
  "echo 'v3' > app.txt\n" +
  '`;\n';

const Q1_OUTPUT =
  '== status ==\n' +
  'MM app.txt\n' +
  '?? notes.txt\n' +
  '== log ==\n' +
  'chore: them gitignore\n' +
  'feat: khoi tao app\n' +
  '== HEAD:app ==\n' +
  'v1\n' +
  '== staged ==\n' +
  'app.txt\n' +
  '== tracked ==\n' +
  '.gitignore\n' +
  'app.txt';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_CHUAN_BI =
  'const CHUAN_BI = `\n' +
  'git init -q -b main\n' +
  "{ echo 'HOST=api.local'; echo 'TIMEOUT=30'; echo 'RETRIES=3'; } > config.txt\n" +
  'git add config.txt\n' +
  "git commit -q -m 'chore: cau hinh ban dau'\n" +
  '`;\n' +
  '\n';

const Q2_KIEM =
  'const KIEM = `\n' +
  "echo '== config.txt ==' ; cat config.txt\n" +
  "echo '== so cha =='     ; git cat-file -p HEAD | grep -c '^parent' || true\n" +
  "echo '== log =='        ; git log --format=%s\n" +
  "echo '== first-parent ==' ; git log --first-parent --format=%s\n" +
  "echo '== con dau xung dot ==' ; git grep -c '<<<<<<<' -- config.txt || echo 'khong con'\n" +
  '`;\n' +
  '\n';

const Q2_STARTER = KHUNG_DAU + Q2_CHUAN_BI + MOC_GIAI + LOI_GIAI_TRONG + '\n' + MOC_CHO + Q2_KIEM + KHUNG_CHAY;

const Q2_SOLUTION =
  'const LOI_GIAI = `\n' +
  'git switch -q -c feature/timeout\n' +
  "{ echo 'HOST=api.local'; echo 'TIMEOUT=60'; echo 'RETRIES=3'; } > config.txt\n" +
  "git commit -q -am 'feat: tang timeout len 60'\n" +
  '\n' +
  'git switch -q main\n' +
  "{ echo 'HOST=api.local'; echo 'TIMEOUT=90'; echo 'RETRIES=3'; } > config.txt\n" +
  "git commit -q -am 'fix: tang timeout len 90'\n" +
  '\n' +
  '# Hai nhanh cung sua mot dong => merge ba chieu va xung dot.\n' +
  '# git merge thoat 1 khi xung dot, nen phai co || true duoi set -e.\n' +
  'git merge --no-edit feature/timeout > /dev/null 2>&1 || true\n' +
  '\n' +
  '# Ket qua khong phai ben nao ca — la mot gia tri thu ba.\n' +
  "{ echo 'HOST=api.local'; echo 'TIMEOUT=120'; echo 'RETRIES=3'; } > config.txt\n" +
  'git add config.txt\n' +
  'git commit -q --no-edit\n' +
  '`;\n';

const Q2_OUTPUT =
  '== config.txt ==\n' +
  'HOST=api.local\n' +
  'TIMEOUT=120\n' +
  'RETRIES=3\n' +
  '== so cha ==\n' +
  '2\n' +
  '== log ==\n' +
  "Merge branch 'feature/timeout'\n" +
  'fix: tang timeout len 90\n' +
  'feat: tang timeout len 60\n' +
  'chore: cau hinh ban dau\n' +
  '== first-parent ==\n' +
  "Merge branch 'feature/timeout'\n" +
  'fix: tang timeout len 90\n' +
  'chore: cau hinh ban dau\n' +
  '== con dau xung dot ==\n' +
  'khong con';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_CHUAN_BI =
  'const CHUAN_BI = `\n' +
  'git init -q -b main\n' +
  "echo 'a' > a.txt ; git add a.txt ; git commit -q -m 'feat: them a.txt'\n" +
  "echo 'b' > b.txt ; git add b.txt ; git commit -q -m 'feat: them b.txt'\n" +
  "echo 'c' > c.txt ; git add c.txt ; git commit -q -m 'wip'\n" +
  "echo 'a da sua' > a.txt\n" +
  "echo 'nhap' > scratch.txt\n" +
  '`;\n' +
  '\n';

const Q3_KIEM =
  'const KIEM = `\n' +
  "echo '== log =='       ; git log --format=%s\n" +
  "echo '== so commit ==' ; git rev-list --count HEAD\n" +
  "echo '== file =='      ; ls\n" +
  "echo '== status =='    ; git status --short\n" +
  "echo '== so stash ==' ; git stash list | wc -l | tr -d ' '\n" +
  "echo '== a.txt =='     ; cat a.txt\n" +
  '`;\n' +
  '\n';

const Q3_STARTER = KHUNG_DAU + Q3_CHUAN_BI + MOC_GIAI + LOI_GIAI_TRONG + '\n' + MOC_CHO + Q3_KIEM + KHUNG_CHAY;

const Q3_SOLUTION =
  'const LOI_GIAI = `\n' +
  '# 1. Cat viec dang do. -u la bat buoc: scratch.txt chua duoc theo doi,\n' +
  '#    git stash tran se de no nam lai tren dia.\n' +
  "git stash push -u -q -m 'wip: dang do'\n" +
  '\n' +
  '# 2. Doi loi nhan cua commit cuoi. amend dung mot commit MOI cung cha,\n' +
  '#    nen so commit khong tang.\n' +
  "git commit -q --amend -m 'feat: them c.txt'\n" +
  '\n' +
  '# 3. b.txt nam trong commit da chia se => revert, khong bao gio reset.\n' +
  '#    revert them mot commit nghich dao; lich su tang chu khong co lai.\n' +
  'git revert --no-edit HEAD~1 > /dev/null\n' +
  '\n' +
  '# 4. Lay lai viec dang do, ke ca file chua duoc theo doi.\n' +
  'git stash pop -q\n' +
  '`;\n';

const Q3_OUTPUT =
  '== log ==\n' +
  'Revert "feat: them b.txt"\n' +
  'feat: them c.txt\n' +
  'feat: them b.txt\n' +
  'feat: them a.txt\n' +
  '== so commit ==\n' +
  '4\n' +
  '== file ==\n' +
  'a.txt\n' +
  'c.txt\n' +
  'scratch.txt\n' +
  '== status ==\n' +
  ' M a.txt\n' +
  '?? scratch.txt\n' +
  '== so stash ==\n' +
  '0\n' +
  '== a.txt ==\n' +
  'a da sua';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_CHUAN_BI =
  'const CHUAN_BI = `\n' +
  'git init -q -b main\n' +
  "echo 'export function tai() {}' > src.js\n" +
  "git add . ; git commit -q -m 'feat: ham tai'\n" +
  "git tag -a v1.0.0 -m 'phat hanh 1.0.0'\n" +
  "{ echo 'export function tai() {}'; echo 'const MAX_RETRIES = 3;'; } > src.js\n" +
  "git commit -q -am 'feat: them MAX_RETRIES'\n" +
  "{ echo 'export function tai() {}'; echo 'const MAX_RETRIES = 5;'; } > src.js\n" +
  "git commit -q -am 'chore: nang MAX_RETRIES len 5'\n" +
  "{ echo 'export function tai() {}'; echo 'const MAX_RETRIES = 5;'; echo 'BUG'; } > src.js\n" +
  "git commit -q -am 'refactor: don dep ham tai'\n" +
  "{ echo 'export function tai() {}'; echo 'BUG'; } > src.js\n" +
  "git commit -q -am 'chore: bo MAX_RETRIES'\n" +
  "git mv src.js app.js ; git commit -q -m 'refactor: doi ten src.js thanh app.js'\n" +
  "{ echo 'export function tai() {}'; echo 'BUG'; echo 'export function luu() {}'; } > app.js\n" +
  "git commit -q -am 'feat: ham luu'\n" +
  '`;\n' +
  '\n';

const Q4_KIEM =
  'const KIEM = `\n' +
  "echo '== trang thai cuoi ==' ; git status -sb\n" +
  '`;\n' +
  '\n';

const Q4_STARTER = KHUNG_DAU + Q4_CHUAN_BI + MOC_GIAI + LOI_GIAI_TRONG + '\n' + MOC_CHO + Q4_KIEM + KHUNG_CHAY;

const Q4_SOLUTION =
  'const LOI_GIAI = `\n' +
  "echo '== 1 pickaxe =='\n" +
  '# -S dem SO LAN xuat hien: chi commit them vao va commit xoa di.\n' +
  "git log -S'MAX_RETRIES' --format=%s\n" +
  '\n' +
  "echo '== 2 moi lan cham vao =='\n" +
  '# -G khop moi dong diff, nen bat them ca lan sua than dong.\n' +
  "git log -G'MAX_RETRIES' --format=%s\n" +
  '\n' +
  "echo '== 3 lich su file =='\n" +
  '# --follow suy ra phep doi ten; thieu no thi lich su dung o cho doi ten.\n' +
  "git log --follow --format=%s -- app.js | wc -l | tr -d ' '\n" +
  '\n' +
  "echo '== 4 file cu =='\n" +
  '# Doc file ra khoi mot tag, khong checkout, khong dung toi cay lam viec.\n' +
  'git show v1.0.0:src.js\n' +
  '\n' +
  "echo '== 5 commit gay loi =='\n" +
  'git bisect start HEAD v1.0.0 > /dev/null 2>&1\n' +
  "git bisect run sh -c 'F=app.js; [ -f \"$F\" ] || F=src.js; grep -q BUG \"$F\" && exit 1 || exit 0' > /dev/null 2>&1\n" +
  'git log -1 --format=%s refs/bisect/bad\n' +
  '# Luon ket thuc bang reset, neu khong ban nam lai o HEAD lia canh.\n' +
  'git bisect reset > /dev/null 2>&1\n' +
  '`;\n';

const Q4_OUTPUT =
  '== 1 pickaxe ==\n' +
  'chore: bo MAX_RETRIES\n' +
  'feat: them MAX_RETRIES\n' +
  '== 2 moi lan cham vao ==\n' +
  'chore: bo MAX_RETRIES\n' +
  'chore: nang MAX_RETRIES len 5\n' +
  'feat: them MAX_RETRIES\n' +
  '== 3 lich su file ==\n' +
  '7\n' +
  '== 4 file cu ==\n' +
  'export function tai() {}\n' +
  '== 5 commit gay loi ==\n' +
  'refactor: don dep ham tai\n' +
  '== trang thai cuoi ==\n' +
  '## main';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_CHUAN_BI =
  'const CHUAN_BI = `\n' +
  'BASE=$PWD\n' +
  'git init -q --bare -b main "$BASE/srv.git"\n' +
  'git init -q -b main "$BASE/an"\n' +
  'cd "$BASE/an"\n' +
  "echo 'doc 1' > readme.txt\n" +
  "git add . ; git commit -q -m 'docs: khoi tao readme'\n" +
  'git remote add origin "$BASE/srv.git"\n' +
  'git push -q -u origin main\n' +
  '\n' +
  '# Binh clone ve, them mot dong va push TRUOC.\n' +
  'git clone -q "$BASE/srv.git" "$BASE/binh"\n' +
  'cd "$BASE/binh"\n' +
  "{ echo 'doc 1'; echo 'doc 2 cua Binh'; } > readme.txt\n" +
  "git commit -q -am 'docs: Binh them dong 2'\n" +
  'git push -q origin main\n' +
  '\n' +
  '# An chua fetch, va commit tren ban sao da cu cua minh.\n' +
  'cd "$BASE/an"\n' +
  "echo 'ghi chu cua An' > note.txt\n" +
  "git add note.txt ; git commit -q -m 'docs: An them note.txt'\n" +
  '`;\n' +
  '\n';

const Q5_KIEM =
  'const KIEM = `\n' +
  "echo '== log cua An =='      ; git log --format=%s\n" +
  "echo '== so cha cua HEAD ==' ; git cat-file -p HEAD | grep -c '^parent' || true\n" +
  "echo '== tag tren may chu ==' ; git --git-dir=\"$BASE/srv.git\" tag\n" +
  "echo '== loai doi tuong tag ==' ; git cat-file -t v1.0.0 || echo '(chua co tag)'\n" +
  "echo '== describe =='         ; git describe --tags || echo '(chua co tag)'\n" +
  "echo 'them dong' >> note.txt ; git commit -q -am 'docs: bo sung note'\n" +
  "echo '== describe sau 1 commit ==' ; git describe --tags | sed 's/-g[0-9a-f]*$/-gXXXXXXX/' || echo '(chua co tag)'\n" +
  '`;\n' +
  '\n';

const Q5_STARTER = KHUNG_DAU + Q5_CHUAN_BI + MOC_GIAI + LOI_GIAI_TRONG + '\n' + MOC_CHO + Q5_KIEM + KHUNG_CHAY;

const Q5_SOLUTION =
  'const LOI_GIAI = `\n' +
  "echo '== 1 push dau tien =='\n" +
  '# May chu dang co commit cua Binh ma An chua co => bi tu choi.\n' +
  "git push origin main 2>&1 | grep -F '[rejected]' || echo '(khong bi tu choi)'\n" +
  '\n' +
  "echo '== 2 gop roi push lai =='\n" +
  '# --rebase phat lai commit cua An LEN TREN commit cua Binh:\n' +
  '# lich su thang, khong sinh commit merge.\n' +
  'git pull -q --rebase origin main\n' +
  'git push -q origin main\n' +
  '\n' +
  "echo '== 3 tag va day tag =='\n" +
  '# -a de tao doi tuong tag that; --follow-tags de tag di cung lan push.\n' +
  "git tag -a v1.0.0 -m 'phat hanh 1.0.0'\n" +
  'git push -q --follow-tags origin main\n' +
  '`;\n';

const Q5_OUTPUT =
  '== 1 push dau tien ==\n' +
  ' ! [rejected]        main -> main (fetch first)\n' +
  '== 2 gop roi push lai ==\n' +
  '== 3 tag va day tag ==\n' +
  '== log cua An ==\n' +
  'docs: An them note.txt\n' +
  'docs: Binh them dong 2\n' +
  'docs: khoi tao readme\n' +
  '== so cha cua HEAD ==\n' +
  '1\n' +
  '== tag tren may chu ==\n' +
  'v1.0.0\n' +
  '== loai doi tuong tag ==\n' +
  'tag\n' +
  '== describe ==\n' +
  'v1.0.0\n' +
  '== describe sau 1 commit ==\n' +
  'v1.0.0-1-gXXXXXXX';

export default {
  course: { slug: 'git' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — run the commands, do not describe them',
        'Thi thực hành — gõ lệnh thật, không mô tả suông',
      ),
      description: B(
        'Five practical Git exercises, submitted as a .zip. The three trees and .gitignore, a real three-way merge conflict resolved to a third value, the undo map (stash, amend, revert), history archaeology with the pickaxe and bisect, and a full remote round trip: a rejected push, pull --rebase, an annotated tag and describe — chapters 1, 2, 3, 4, 5, 7, 8 and 13.',
        'Năm bài thực hành Git, nộp dưới dạng .zip. Ba cái cây và .gitignore, một xung đột merge ba chiều thật được giải quyết bằng một giá trị thứ ba, bản đồ hoàn tác (stash, amend, revert), khảo cổ lịch sử bằng cuốc chim và bisect, và một vòng remote đầy đủ: một lượt push bị từ chối, pull --rebase, một tag có chú giải và describe — các chương 1, 2, 3, 4, 5, 7, 8 và 13.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 1 ───────────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q1 — The three trees, on purpose (chapter 1).</b> The starter hands you an empty repository already on <code>main</code>. Write the commands that leave it in this exact state:</p>' +
            '<ul>' +
            '<li>Two commits: <code>feat: khoi tao app</code>, which adds <code>app.txt</code> containing <code>v1</code>, and then <code>chore: them gitignore</code>, which adds a <code>.gitignore</code> whose only line is ' + c('*.log') + '.</li>' +
            '<li>A file <code>debug.log</code> on disk. It matches the ignore rule, so it must <b>not</b> appear anywhere in <code>git status</code>.</li>' +
            '<li>A file <code>notes.txt</code> on disk, untracked.</li>' +
            '<li><code>app.txt</code> holding <code>v3</code> on disk while the <b>index</b> holds <code>v2</code> — so <code>git status --short</code> prints <code>MM app.txt</code>, with one <code>M</code> in each column.</li>' +
            '</ul>' +
            '<p>That last item is the whole question. The two columns of <code>git status --short</code> are the two gaps between the three trees: the left compares <code>HEAD</code> with the index, the right compares the index with the working directory. Producing <code>MM</code> takes <b>two edits with a <code>git add</code> between them</b>, and no other order gets there.</p>' +
            '<p>The verification block also prints <code>git show HEAD:app.txt</code>, which must still be <code>v1</code>: neither <code>v2</code> nor <code>v3</code> was ever committed. Use <code>echo</code> and redirection to write files; do not open an editor.</p>',

            '<p><b>Câu 1 — Ba cái cây, một cách có chủ ý (chương 1).</b> Khung đề đưa cho bạn một kho mã rỗng đã ở trên nhánh <code>main</code>. Hãy viết các lệnh để nó còn lại đúng trạng thái sau:</p>' +
            '<ul>' +
            '<li>Hai commit: <code>feat: khoi tao app</code> thêm <code>app.txt</code> chứa <code>v1</code>, rồi <code>chore: them gitignore</code> thêm một file <code>.gitignore</code> chỉ có đúng một dòng ' + c('*.log') + '.</li>' +
            '<li>Một file <code>debug.log</code> trên đĩa. Nó khớp luật bỏ qua, nên nó <b>không</b> được xuất hiện ở bất cứ đâu trong <code>git status</code>.</li>' +
            '<li>Một file <code>notes.txt</code> trên đĩa, chưa được theo dõi.</li>' +
            '<li><code>app.txt</code> chứa <code>v3</code> trên đĩa trong khi <b>index</b> giữ <code>v2</code> — để <code>git status --short</code> in ra <code>MM app.txt</code>, mỗi cột một chữ <code>M</code>.</li>' +
            '</ul>' +
            '<p>Gạch đầu dòng cuối cùng chính là toàn bộ câu hỏi. Hai cột của <code>git status --short</code> là hai khe hở giữa ba cái cây: cột trái so <code>HEAD</code> với index, cột phải so index với thư mục làm việc. Muốn ra <code>MM</code> thì phải <b>sửa hai lần, với một lệnh <code>git add</code> ở giữa</b>, và không thứ tự nào khác cho ra kết quả đó.</p>' +
            '<p>Khối kiểm còn in <code>git show HEAD:app.txt</code>, và nó phải vẫn là <code>v1</code>: cả <code>v2</code> lẫn <code>v3</code> đều chưa từng được commit. Hãy dùng <code>echo</code> và chuyển hướng để ghi file; đừng mở trình soạn thảo.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['trees',
              '<code>app.txt</code> reaches the <code>MM</code> state through two real edits separated by a <code>git add</code>, and <code>git show HEAD:app.txt</code> still prints <code>v1</code> — neither intermediate version was committed.',
              '<code>app.txt</code> đạt trạng thái <code>MM</code> nhờ hai lần sửa thật cách nhau một lệnh <code>git add</code>, và <code>git show HEAD:app.txt</code> vẫn in ra <code>v1</code> — không phiên bản trung gian nào bị commit.',
              0.6],
            ['ignore',
              '<code>.gitignore</code> is committed and contains the glob, <code>debug.log</code> exists on disk and appears nowhere in the status, while <code>notes.txt</code> is correctly listed as untracked.',
              '<code>.gitignore</code> đã được commit và chứa đúng mẫu, <code>debug.log</code> có mặt trên đĩa và không xuất hiện ở đâu trong status, còn <code>notes.txt</code> được liệt kê đúng là chưa theo dõi.',
              0.5],
            ['output',
              'Exactly two commits, in order, with the given messages; the five verification sections print exactly the expected lines.',
              'Đúng hai commit, đúng thứ tự, đúng lời nhắn đề cho; năm mục kiểm in ra đúng các dòng mong đợi.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 3 ───────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'bash',
          prompt: B(
            '<p><b>Q2 — Make a conflict happen, then resolve it properly (chapter 3).</b> The starter gives you one commit holding <code>config.txt</code> with <code>TIMEOUT=30</code> between two other lines. Produce this history:</p>' +
            '<ul>' +
            '<li>Branch <code>feature/timeout</code> off <code>main</code>, set <code>TIMEOUT=60</code>, commit as <code>feat: tang timeout len 60</code>.</li>' +
            '<li>Back on <code>main</code>, set <code>TIMEOUT=90</code>, commit as <code>fix: tang timeout len 90</code>. Now both branches have changed the same line, which is the only way to get a genuine content conflict.</li>' +
            '<li>Merge <code>feature/timeout</code> into <code>main</code>. It <b>must</b> conflict — that is the point, not an accident.</li>' +
            '<li>Resolve it to <code>TIMEOUT=120</code>, a value on <b>neither</b> side, and complete the merge keeping Git\'s default message.</li>' +
            '</ul>' +
            '<p>Three things the verification checks. <code>git cat-file -p HEAD</code> must show <b>two</b> parent lines, which is what makes it a real merge commit rather than a fast-forward or a squash. <code>git log --first-parent</code> must print three lines while the full log prints four — that difference <em>is</em> the branch, recorded in the graph. And no conflict marker may survive in <code>config.txt</code>: the other two lines of the file must come through untouched.</p>' +
            '<p>Two traps. The script runs under <code>set -eu</code> and <code>git merge</code> exits non-zero when it conflicts, so that line needs <code>|| true</code> or the whole script dies at exactly the moment it was working correctly. And the final commit must not open an editor — <code>--no-edit</code> accepts the message Git prepared.</p>',

            '<p><b>Câu 2 — Tạo ra xung đột, rồi giải quyết cho đàng hoàng (chương 3).</b> Khung đề cho bạn một commit chứa <code>config.txt</code> với <code>TIMEOUT=30</code> nằm giữa hai dòng khác. Hãy dựng ra lịch sử sau:</p>' +
            '<ul>' +
            '<li>Tách nhánh <code>feature/timeout</code> từ <code>main</code>, đặt <code>TIMEOUT=60</code>, commit với lời nhắn <code>feat: tang timeout len 60</code>.</li>' +
            '<li>Quay về <code>main</code>, đặt <code>TIMEOUT=90</code>, commit với lời nhắn <code>fix: tang timeout len 90</code>. Giờ hai nhánh cùng sửa một dòng, và đó là cách duy nhất để có một xung đột nội dung thật.</li>' +
            '<li>Merge <code>feature/timeout</code> vào <code>main</code>. Nó <b>bắt buộc</b> phải xung đột — đó là chủ ý, không phải tai nạn.</li>' +
            '<li>Giải quyết thành <code>TIMEOUT=120</code>, một giá trị <b>không thuộc</b> bên nào, rồi hoàn tất phép merge và giữ nguyên lời nhắn mặc định của Git.</li>' +
            '</ul>' +
            '<p>Ba thứ mà khối kiểm soi. <code>git cat-file -p HEAD</code> phải hiện <b>hai</b> dòng parent, đó mới là một commit merge thật chứ không phải fast-forward hay squash. <code>git log --first-parent</code> phải in ba dòng trong khi log đầy đủ in bốn — chính khoảng chênh ấy <em>là</em> cái nhánh, được ghi lại trong đồ thị. Và không được sót dấu xung đột nào trong <code>config.txt</code>: hai dòng còn lại của file phải đi qua nguyên vẹn.</p>' +
            '<p>Hai cái bẫy. Kịch bản chạy dưới <code>set -eu</code> mà <code>git merge</code> thoát khác 0 khi xung đột, nên dòng đó cần <code>|| true</code>, không thì cả kịch bản chết đúng vào lúc nó đang chạy đúng. Và lệnh commit cuối không được mở trình soạn thảo — <code>--no-edit</code> nhận luôn lời nhắn Git đã soạn sẵn.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['divergence',
              'Both branches genuinely modify the same line before merging, so a real content conflict occurs — the two commits exist with the given messages and neither branch was fast-forwarded past the other.',
              'Hai nhánh thật sự cùng sửa một dòng trước khi merge, nên có một xung đột nội dung thật — hai commit tồn tại với đúng lời nhắn đề cho và không nhánh nào bị fast-forward vượt qua nhánh kia.',
              0.6],
            ['mergecommit',
              'The merge is completed as a merge commit with <b>two</b> parents and Git\'s default message; <code>--squash</code>, a rebase or a manual re-commit would all print the wrong parent count.',
              'Phép merge kết thúc bằng một commit merge có <b>hai</b> cha và giữ lời nhắn mặc định của Git; dùng <code>--squash</code>, rebase hay tự commit lại đều cho ra số cha sai.',
              0.6],
            ['resolution',
              'The resolved file holds <code>TIMEOUT=120</code>, keeps the <code>HOST</code> and <code>RETRIES</code> lines intact, and contains no leftover conflict marker.',
              'File sau khi giải quyết giữ <code>TIMEOUT=120</code>, giữ nguyên hai dòng <code>HOST</code> và <code>RETRIES</code>, và không còn sót dấu xung đột nào.',
              0.5],
            ['output',
              'All five verification sections match line for line, including the three-line <code>--first-parent</code> log against the four-line full log.',
              'Cả năm mục kiểm khớp từng dòng, kể cả log <code>--first-parent</code> ba dòng đối với log đầy đủ bốn dòng.',
              0.3],
          ]),
        }),

        /* ── Q3 · chương 4 + 8 ───────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'bash',
          prompt: B(
            '<p><b>Q3 — Four undos, each with the right tool (chapters 4 and 8).</b> The starter leaves you with three commits — <code>feat: them a.txt</code>, <code>feat: them b.txt</code>, <code>wip</code> — plus a modified <code>a.txt</code> and an untracked <code>scratch.txt</code>. The first two commits have <b>already been shared with the team</b>; the third is still local. In this order:</p>' +
            '<ol>' +
            '<li><b>Park the work in progress</b> under the message <code>wip: dang do</code>, so the tree is clean before you touch history. Both files must go — and one of them is untracked, which plain <code>git stash</code> leaves behind on disk.</li>' +
            '<li><b>Rename the last commit</b> from <code>wip</code> to <code>feat: them c.txt</code>. Its content must not change, and the commit count must not grow.</li>' +
            '<li><b>Undo the effect of <code>feat: them b.txt</code></b>. It is shared, so history must not be rewritten: <code>b.txt</code> disappears while <code>a.txt</code> and <code>c.txt</code> stay, and the log grows to four entries with a <code>Revert "…"</code> on top.</li>' +
            '<li><b>Bring the work in progress back</b>, both files, and leave the stash list empty.</li>' +
            '</ol>' +
            '<p>The counts are the grading. Four commits, not two and not five: step 2 must not add one, step 3 must add exactly one. And <code>git status --short</code> must end with <code> M a.txt</code> and <code>?? scratch.txt</code> — the same two lines you started with, which is what proves the stash round trip was faithful rather than lossy.</p>' +
            '<p>Do not use <code>reset --hard</code> anywhere. On a shared commit it is the wrong answer, and on an uncommitted tree it is the one command in daily use that destroys work the reflog cannot get back.</p>',

            '<p><b>Câu 3 — Bốn phép hoàn tác, mỗi phép một công cụ đúng (chương 4 và 8).</b> Khung đề để lại cho bạn ba commit — <code>feat: them a.txt</code>, <code>feat: them b.txt</code>, <code>wip</code> — cộng một <code>a.txt</code> đã sửa và một <code>scratch.txt</code> chưa được theo dõi. Hai commit đầu <b>đã được chia sẻ cho cả nhóm</b>; commit thứ ba vẫn còn cục bộ. Theo đúng thứ tự này:</p>' +
            '<ol>' +
            '<li><b>Cất việc đang làm dở</b> dưới lời nhắn <code>wip: dang do</code>, để cây làm việc sạch trước khi bạn động vào lịch sử. Cả hai file đều phải đi — mà một trong hai chưa được theo dõi, thứ mà <code>git stash</code> trần sẽ để lại trên đĩa.</li>' +
            '<li><b>Đổi tên commit cuối</b> từ <code>wip</code> thành <code>feat: them c.txt</code>. Nội dung của nó không được đổi, và số commit không được tăng.</li>' +
            '<li><b>Hoàn tác tác dụng của <code>feat: them b.txt</code></b>. Nó đã được chia sẻ, nên không được viết lại lịch sử: <code>b.txt</code> biến mất trong khi <code>a.txt</code> và <code>c.txt</code> ở lại, và log tăng lên bốn dòng với một dòng <code>Revert "…"</code> trên cùng.</li>' +
            '<li><b>Lấy lại việc đang làm dở</b>, cả hai file, và để danh sách stash rỗng.</li>' +
            '</ol>' +
            '<p>Mấy con số chính là chỗ chấm. Bốn commit, không phải hai và cũng không phải năm: bước 2 không được thêm cái nào, bước 3 phải thêm đúng một cái. Và <code>git status --short</code> cuối cùng phải là <code> M a.txt</code> cùng <code>?? scratch.txt</code> — đúng hai dòng bạn có lúc đầu, và đó là bằng chứng vòng đi-về của stash trung thực chứ không làm rơi mất gì.</p>' +
            '<p>Đừng dùng <code>reset --hard</code> ở bất cứ đâu. Trên một commit đã chia sẻ thì nó là câu trả lời sai, còn trên một cây làm việc chưa commit thì nó là lệnh thường ngày duy nhất phá huỷ phần việc mà reflog không lấy lại được.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['stash',
              'The stash carries <b>both</b> the tracked modification and the untracked file, and popping it restores exactly the two original status lines, leaving the stash list empty.',
              'Phép stash mang theo <b>cả</b> sửa đổi trên file đang theo dõi lẫn file chưa được theo dõi, và khi lấy lại thì khôi phục đúng hai dòng status ban đầu, để danh sách stash rỗng.',
              0.6],
            ['amend',
              'The <code>wip</code> commit is renamed without adding a commit and without changing its content — <code>c.txt</code> is still present and the tally is four, not five.',
              'Commit <code>wip</code> được đổi tên mà không thêm commit nào và không đổi nội dung — <code>c.txt</code> vẫn còn và tổng số là bốn chứ không phải năm.',
              0.5],
            ['revert',
              'The shared commit is undone with <code>revert</code>, so history grows by one inverse commit; <code>reset</code> in any mode would shrink the log and print the wrong count.',
              'Commit đã chia sẻ được hoàn tác bằng <code>revert</code>, nên lịch sử tăng thêm một commit nghịch đảo; dùng <code>reset</code> ở bất kỳ chế độ nào cũng làm log co lại và in ra số sai.',
              0.6],
            ['output',
              'All six verification sections match, including the file listing in which <code>b.txt</code> is gone while <code>a.txt</code>, <code>c.txt</code> and <code>scratch.txt</code> remain.',
              'Cả sáu mục kiểm đều khớp, kể cả danh sách file trong đó <code>b.txt</code> đã biến mất còn <code>a.txt</code>, <code>c.txt</code> và <code>scratch.txt</code> vẫn ở lại.',
              0.3],
          ]),
        }),

        /* ── Q4 · chương 2 ───────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'bash',
          prompt: B(
            '<p><b>Q4 — Archaeology on a history you did not write (chapter 2).</b> The starter builds seven commits and a tag <code>v1.0.0</code>. Somewhere along the way a line <code>BUG</code> appeared in the source file, and the file was also renamed from <code>src.js</code> to <code>app.js</code>. Print five answers, each under the label shown, in this order:</p>' +
            '<ol>' +
            '<li><code>== 1 pickaxe ==</code> — the subjects of the commits where the string <code>MAX_RETRIES</code> <b>appeared or vanished</b>. Exactly two lines. The commit that merely edited the value must not be here.</li>' +
            '<li><code>== 2 moi lan cham vao ==</code> — the subjects of <b>every</b> commit whose diff touches that string. Three lines. The difference between this and the previous answer is one flag.</li>' +
            '<li><code>== 3 lich su file ==</code> — how many commits are in the history of <code>app.js</code>, counting <b>across the rename</b>. A bare path filter stops at the rename and answers 2; the right answer is 7.</li>' +
            '<li><code>== 4 file cu ==</code> — the contents of <code>src.js</code> as it was at tag <code>v1.0.0</code>, printed <b>without checking anything out</b>.</li>' +
            '<li><code>== 5 commit gay loi ==</code> — the subject of the first commit that contains <code>BUG</code>, found by <b>binary search</b>, not by reading the log.</li>' +
            '</ol>' +
            '<p>For the last one: start the search with the tag as the known-good end, and give <code>git bisect run</code> a check that exits 0 when the file is clean and non-zero when it contains <code>BUG</code>. Careful — the file is called <code>src.js</code> in the early commits and <code>app.js</code> later, so the check has to look for whichever exists. When the search ends, the answer is on the ref <code>refs/bisect/bad</code>, and you print its subject with <code>git log -1 --format=%s</code>.</p>' +
            '<p>The verification block prints <code>git status -sb</code> and it must say <code>## main</code>. A bisect leaves you on a detached <code>HEAD</code> until you run <code>git bisect reset</code>, so forgetting that one line is visible in the output.</p>',

            '<p><b>Câu 4 — Khảo cổ trên một lịch sử không phải bạn viết (chương 2).</b> Khung đề dựng ra bảy commit và một tag <code>v1.0.0</code>. Đâu đó dọc đường, một dòng <code>BUG</code> đã xuất hiện trong file mã nguồn, và file cũng bị đổi tên từ <code>src.js</code> thành <code>app.js</code>. Hãy in ra năm câu trả lời, mỗi câu dưới đúng nhãn được cho, theo thứ tự sau:</p>' +
            '<ol>' +
            '<li><code>== 1 pickaxe ==</code> — tiêu đề những commit mà chuỗi <code>MAX_RETRIES</code> <b>xuất hiện hoặc biến mất</b>. Đúng hai dòng. Commit chỉ sửa giá trị thì không được có mặt ở đây.</li>' +
            '<li><code>== 2 moi lan cham vao ==</code> — tiêu đề <b>mọi</b> commit có diff chạm vào chuỗi đó. Ba dòng. Khác biệt giữa câu này và câu trên chỉ là một chữ cờ.</li>' +
            '<li><code>== 3 lich su file ==</code> — lịch sử của <code>app.js</code> có bao nhiêu commit, tính <b>xuyên qua phép đổi tên</b>. Bộ lọc đường dẫn trần dừng lại ở chỗ đổi tên và trả lời 2; đáp án đúng là 7.</li>' +
            '<li><code>== 4 file cu ==</code> — nội dung của <code>src.js</code> hồi ở tag <code>v1.0.0</code>, in ra <b>mà không checkout thứ gì</b>.</li>' +
            '<li><code>== 5 commit gay loi ==</code> — tiêu đề của commit đầu tiên có chứa <code>BUG</code>, tìm ra bằng <b>tìm nhị phân</b>, không phải bằng cách đọc log.</li>' +
            '</ol>' +
            '<p>Với câu cuối: hãy bắt đầu phép tìm với cái tag làm đầu chắc chắn tốt, và đưa cho <code>git bisect run</code> một phép kiểm thoát 0 khi file sạch và khác 0 khi file chứa <code>BUG</code>. Cẩn thận — file tên là <code>src.js</code> ở các commit đầu và <code>app.js</code> về sau, nên phép kiểm phải tìm cái nào đang tồn tại. Khi phép tìm kết thúc, đáp án nằm ở ref <code>refs/bisect/bad</code>, và bạn in tiêu đề của nó bằng <code>git log -1 --format=%s</code>.</p>' +
            '<p>Khối kiểm in ra <code>git status -sb</code> và nó phải ghi <code>## main</code>. Một phiên bisect để bạn nằm lại ở <code>HEAD</code> lìa cành cho tới khi bạn chạy <code>git bisect reset</code>, nên quên đúng một dòng ấy là thấy ngay trong kết quả.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['pickaxe',
              'Sections 1 and 2 use the two different search flags — the count-changing one for "appeared or vanished" and the diff-matching one for "every touch" — rather than one search plus a hand-picked subset.',
              'Mục 1 và 2 dùng hai cờ tìm khác nhau — cờ đếm số lần xuất hiện cho câu "xuất hiện hoặc biến mất" và cờ khớp dòng diff cho câu "mọi lần chạm" — chứ không phải một phép tìm rồi tự chọn tay ra một phần.',
              0.5],
            ['rename',
              'Section 3 crosses the rename and answers 7, and section 4 reads the old file straight out of the tag without checking out or restoring anything.',
              'Mục 3 đi xuyên qua phép đổi tên và trả lời 7, còn mục 4 đọc file cũ thẳng ra khỏi cái tag mà không checkout hay khôi phục thứ gì.',
              0.5],
            ['bisect',
              'Section 5 finds the commit by an actual <code>git bisect run</code> started from the tag, with a check that handles both file names, and reads the result from the bisect ref — not from a hard-coded subject or a <code>git log --grep</code>.',
              'Mục 5 tìm ra commit bằng một phiên <code>git bisect run</code> thật bắt đầu từ cái tag, với phép kiểm xử lý được cả hai tên file, và đọc kết quả từ ref của bisect — không phải từ một tiêu đề gõ cứng hay một lệnh <code>git log --grep</code>.',
              0.7],
            ['cleanup',
              'The bisect session is closed with <code>git bisect reset</code>, so the final status line is <code>## main</code> and not a detached <code>HEAD</code>; all six sections match line for line.',
              'Phiên bisect được đóng lại bằng <code>git bisect reset</code>, nên dòng trạng thái cuối là <code>## main</code> chứ không phải <code>HEAD</code> lìa cành; cả sáu mục khớp từng dòng.',
              0.3],
          ]),
        }),

        /* ── Q5 · chương 5 + 7 + 8 ───────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q5 — A full remote round trip (chapters 5, 7 and 8).</b> The starter builds three directories on the same disk: a bare repository <code>srv.git</code> playing the part of GitHub, and two clones, <code>an</code> and <code>binh</code>. Bình has already pushed a commit that An has never fetched, and An has committed on top of his stale copy. Your commands run <b>inside An\'s clone</b>. Do three things, each under the label shown:</p>' +
            '<ol>' +
            '<li><code>== 1 push dau tien ==</code> — push, and let it fail. Capture the rejection line so it appears in the output: it should read ' + c('! [rejected]        main -> main (fetch first)') + '. Since the push exits non-zero, the pipeline needs an <code>|| echo</code> tail or <code>set -e</code> ends the script here.</li>' +
            '<li><code>== 2 gop roi push lai ==</code> — integrate Bình\'s work and push successfully. Integrate in the way that keeps the history <b>linear</b>: the verification prints the number of parents of <code>HEAD</code> and it must be <b>1</b>. A plain <code>git pull</code> would create a merge commit and print 2.</li>' +
            '<li><code>== 3 tag va day tag ==</code> — create <b>v1.0.0</b> as a real tag object with the message <code>phat hanh 1.0.0</code>, and get it onto the server in the same push as the commits.</li>' +
            '</ol>' +
            '<p>Four checks follow. The log must read, newest first: An\'s commit, then Bình\'s, then the initial one — An\'s work replayed on top of Bình\'s, which is what "linear" means here. The server must list the tag, which fails if you only pushed the branch. <code>git cat-file -t v1.0.0</code> must print <code>tag</code>, which is only true for an annotated tag. And <code>git describe --tags</code> must print <code>v1.0.0</code> exactly, then <code>v1.0.0-1-g…</code> after one more commit — the count of commits since the tag, and the reason a lightweight tag would have been invisible here.</p>' +
            '<p>Nothing in this question needs <code>--force</code>. The rejection in step 1 is information, not an obstacle: the server holds a colleague\'s commit, and the correct response is always to fetch it first.</p>',

            '<p><b>Câu 5 — Một vòng remote đầy đủ (chương 5, 7 và 8).</b> Khung đề dựng ba thư mục trên cùng một đĩa: một kho trần <code>srv.git</code> đóng vai GitHub, và hai bản clone, <code>an</code> và <code>binh</code>. Bình đã push một commit mà An chưa hề fetch, còn An thì đã commit lên trên bản sao cũ của mình. Các lệnh của bạn chạy <b>bên trong kho của An</b>. Hãy làm ba việc, mỗi việc dưới đúng nhãn được cho:</p>' +
            '<ol>' +
            '<li><code>== 1 push dau tien ==</code> — push, và để nó hỏng. Hãy bắt lấy dòng từ chối sao cho nó hiện ra trong kết quả: nó phải là ' + c('! [rejected]        main -> main (fetch first)') + '. Vì lệnh push thoát khác 0, đường ống cần một đuôi <code>|| echo</code>, không thì <code>set -e</code> kết thúc kịch bản ngay tại đây.</li>' +
            '<li><code>== 2 gop roi push lai ==</code> — gộp phần việc của Bình vào rồi push thành công. Hãy gộp theo cách giữ cho lịch sử <b>thẳng</b>: khối kiểm in ra số commit cha của <code>HEAD</code> và nó phải bằng <b>1</b>. Một lệnh <code>git pull</code> trần sẽ tạo commit merge và in ra 2.</li>' +
            '<li><code>== 3 tag va day tag ==</code> — tạo <b>v1.0.0</b> dưới dạng một đối tượng tag thật với lời nhắn <code>phat hanh 1.0.0</code>, và đưa nó lên máy chủ trong cùng lượt push với các commit.</li>' +
            '</ol>' +
            '<p>Sau đó có bốn phép kiểm. Log phải đọc từ mới nhất: commit của An, rồi của Bình, rồi commit khởi tạo — phần việc của An được phát lại lên trên phần của Bình, và đó chính là ý nghĩa của chữ "thẳng" ở đây. Máy chủ phải liệt kê được cái tag, thứ sẽ hỏng nếu bạn chỉ push nhánh. <code>git cat-file -t v1.0.0</code> phải in ra <code>tag</code>, điều chỉ đúng với một tag có chú giải. Và <code>git describe --tags</code> phải in đúng <code>v1.0.0</code>, rồi <code>v1.0.0-1-g…</code> sau một commit nữa — con số đếm số commit kể từ cái tag, và cũng là lý do một tag nhẹ sẽ vô hình ở đây.</p>' +
            '<p>Không chỗ nào trong câu này cần tới <code>--force</code>. Lời từ chối ở bước 1 là thông tin chứ không phải chướng ngại: máy chủ đang giữ commit của một đồng nghiệp, và phản ứng đúng luôn là fetch nó về trước.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['rejection',
              'The first push is genuinely attempted and genuinely refused, and the <code>(fetch first)</code> line reaches the output; the script survives the non-zero exit instead of stopping there.',
              'Lượt push đầu tiên được thực hiện thật và bị từ chối thật, và dòng <code>(fetch first)</code> đi tới được đầu ra; kịch bản sống sót qua mã thoát khác 0 thay vì dừng lại ở đó.',
              0.6],
            ['rebase',
              'Bình\'s commit is integrated by replaying An\'s work on top of it, so <code>HEAD</code> has exactly one parent and the log reads An, Bình, initial — no merge commit anywhere, and no <code>--force</code> used.',
              'Commit của Bình được gộp vào bằng cách phát lại phần việc của An lên trên nó, nên <code>HEAD</code> có đúng một cha và log đọc thành An, Bình, khởi tạo — không có commit merge nào, và không dùng <code>--force</code>.',
              0.7],
            ['tag',
              'The tag is annotated, so <code>git cat-file -t</code> reports <code>tag</code> and <code>git describe</code> can see it; a lightweight tag would report <code>commit</code> and fail both checks.',
              'Cái tag là loại có chú giải, nên <code>git cat-file -t</code> báo <code>tag</code> và <code>git describe</code> nhìn thấy nó; một tag nhẹ sẽ báo <code>commit</code> và trượt cả hai phép kiểm.',
              0.6],
            ['pushtag',
              'The tag reaches the server in the same push as the commits, so listing tags in the bare repository shows <code>v1.0.0</code> — a branch-only push would leave the server with no tag at all.',
              'Cái tag lên tới máy chủ trong cùng lượt push với các commit, nên liệt kê tag trong kho trần thấy <code>v1.0.0</code> — một lượt push chỉ có nhánh sẽ để máy chủ không có tag nào.',
              0.6],
          ]),
        }),
      ],
    },
  ],
};
