/**
 * Linux & Bash — Practical Exam (PE): 5 bài viết script, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/linux-bash/s00…s12`. Khác đề FE (50 câu
 * trắc nghiệm, đọc lệnh), đề này bắt VIẾT script: khai triển tham số và dấu
 * nháy, ống dẫn với sort/uniq/awk, find có -prune và tên file chứa dấu cách,
 * bộ khung script chạy thật (kiểm tham số + mã thoát + mktemp + trap), và một
 * báo cáo gom nhóm bằng mảng liên kết của awk.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `starterCode` DƯỚI ĐÂY ĐÃ CHẠY THẬT, TRÊN
 * LINUX THẬT — không phải macOS:
 *
 *   docker run --rm -v …:/w -w /w debian:bookworm-slim bash /w/pe/Qn.sh
 *   bash 5.2.15 · GNU coreutils 9.1 · GNU findutils 4.9 · GNU sed 4.9
 *   · gawk 5.2.1 (câu 5 đã kiểm lại thêm bằng mawk 1.3.4 — kết quả y hệt)
 *
 * `expectedOutput` là NGUYÊN VĂN stdout của lần chạy đó, không phải dự đoán.
 * Máy soạn đề là macOS, ở đó /bin/bash là bản 3.2 từ 2007 (thiếu `${var^^}`,
 * thiếu mảng liên kết) và find/sed/stat là bản BSD — chạy đề ở đó rồi chép
 * output vào đây là cách chắc chắn để phát đề sai.
 *
 * ⚠️ `node scripts/exam-check.mjs` KHÔNG tự chạy lại được năm lời giải này.
 * Bộ kiểm luôn gọi `execFileSync(process.execPath, [file])` — tức là NODE —
 * và `extFor()` chỉ biết hai đuôi: `.ts` cho TypeScript, `.cjs` cho mọi thứ
 * còn lại. Một script bash đưa cho node thì chết ngay ở `SyntaxError`. Bộ kiểm
 * vì thế chỉ xác nhận được phần CẤU TRÚC của file này (song ngữ, đủ trường,
 * rubric, mốc trong starterCode); phần CHẠY THẬT đã được làm bằng tay trong
 * container Linux, xem lệnh ở trên. Muốn bộ kiểm chạy được bash thì phải sửa
 * `scripts/exam-check.mjs` — đúng như nó đã từng được sửa để chạy TypeScript
 * (commit e1019ad4) — nhưng đó là file dùng chung, không sửa trong phiên này.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/LINUX-BASH-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/linux-bash-exam-kit.mjs';

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

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five files named <code>Q1.sh … Q5.sh</code> in your own editor. Each question shows a <b>Starter</b> block — copy it into the file <b>verbatim</b> and write your answer only in the middle region, between the two <code>ĐỀ CHO SẴN</code> markers. The given data and the printing loop are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li>Assume <b>Linux</b>: <code>bash</code> 5 and GNU coreutils / findutils / awk. Everything here was written and tested on Debian. If you are on macOS, <code>/bin/bash</code> is version 3.2 from 2007 and <code>find</code>, <code>sed</code> and <code>stat</code> are the BSD versions — run the exam inside a container (<code>docker run --rm -it -v "$PWD":/w -w /w debian:bookworm-slim bash</code>) rather than fighting the differences.</li>' +
  '<li><b>No external language.</b> bash, and the standard text tools (<code>grep</code>, <code>sed</code>, <code>awk</code>, <code>sort</code>, <code>uniq</code>, <code>find</code>, <code>wc</code>, <code>cut</code>, <code>tr</code>) only. No Python, no Node, no jq.</li>' +
  '<li>Check each file with <code>bash -n Q1.sh</code> — it must print <b>nothing</b> — and then run it with <code>bash Q1.sh</code> and compare with the "expected output" block, <b>line for line</b>. If you have <code>shellcheck</code>, run it too; the graders read the same warnings you would.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a script that prints the wrong lines cannot pass. But this is a shell exam, so the <b>shell hygiene</b> is graded too: an unquoted <code>$var</code>, a <code>[ ]</code> test that breaks on an empty value, a numeric comparison written with <code>&gt;</code>, a temp file at a predictable path, or a <code>cat file | grep</code> where <code>grep file</code> would do all cost marks <em>even when the output matches</em>. If a filename in the test data contains a space and your script still works, that is not luck — it is the thing being measured.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm file tên <code>Q1.sh … Q5.sh</code> bằng trình soạn thảo của bạn. Mỗi câu có khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào file và chỉ viết lời giải ở vùng giữa, nằm giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần dữ liệu cho sẵn và vòng lặp in kết quả là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li>Hãy giả định <b>Linux</b>: <code>bash</code> 5 và GNU coreutils / findutils / awk. Toàn bộ đề này được viết và kiểm trên Debian. Nếu bạn dùng macOS thì <code>/bin/bash</code> ở đó là bản 3.2 từ 2007 còn <code>find</code>, <code>sed</code>, <code>stat</code> là bản BSD — hãy làm bài bên trong một container (<code>docker run --rm -it -v "$PWD":/w -w /w debian:bookworm-slim bash</code>) thay vì đi vật lộn với những khác biệt đó.</li>' +
  '<li><b>Không dùng ngôn ngữ ngoài.</b> Chỉ bash và bộ công cụ văn bản chuẩn (<code>grep</code>, <code>sed</code>, <code>awk</code>, <code>sort</code>, <code>uniq</code>, <code>find</code>, <code>wc</code>, <code>cut</code>, <code>tr</code>). Không Python, không Node, không jq.</li>' +
  '<li>Kiểm từng file bằng <code>bash -n Q1.sh</code> — nó phải <b>không in ra gì</b> — rồi chạy <code>bash Q1.sh</code> và đối chiếu với khối "kết quả mong đợi", <b>từng dòng một</b>. Có <code>shellcheck</code> thì chạy luôn; người chấm đọc đúng những cảnh báo mà bạn đọc được.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — script in sai dòng thì không thể qua. Nhưng đây là bài thi shell, nên <b>vệ sinh shell</b> cũng bị chấm: một chữ <code>$var</code> không đặt trong nháy, một phép kiểm <code>[ ]</code> vỡ khi giá trị rỗng, một phép so sánh số viết bằng dấu <code>&gt;</code>, một file tạm đặt ở đường dẫn đoán được, hay một cú <code>cat file | grep</code> trong khi <code>grep file</code> là đủ — tất cả đều bị trừ điểm <em>ngay cả khi kết quả in ra đúng</em>. Nếu trong dữ liệu thử có một tên file chứa dấu cách mà script của bạn vẫn chạy đúng, đó không phải may mắn — đó chính là thứ đang được đo.</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'paths=(\n' +
  "  '/srv/app/current/config.yml'\n" +
  "  '/var/log/nginx/access.log'\n" +
  "  '/home/an/My Documents/ghi chu.txt'\n" +
  "  'README'\n" +
  "  '/etc/hosts'\n" +
  "  '/srv/app/'\n" +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'describe() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for p in "${paths[@]}"; do describe "$p"; done\n';

const Q1_SOLUTION =
  'describe() {\n' +
  '  local path=$1\n' +
  '  # ##*/ là phép cắt THAM LAM từ bên trái: ăn tới dấu / cuối cùng.\n' +
  '  local base=${path##*/}\n' +
  '  # %/* cắt NGẮN NHẤT từ bên phải. Không có dấu / nào thì để "." .\n' +
  "  local dir='.'\n" +
  '  [[ $path == */* ]] && dir=${path%/*}\n' +
  "  [[ -z $dir ]] && dir='/'\n" +
  "  local ext='-'\n" +
  '  [[ $base == *.* ]] && ext=${base##*.}\n' +
  "  [[ -z $base ]] && base='(none)'\n" +
  "  printf '%s :: %s :: %s\\n' \"$dir\" \"$base\" \"$ext\"\n" +
  '}\n';

const Q1_OUTPUT =
  '/srv/app/current :: config.yml :: yml\n' +
  '/var/log/nginx :: access.log :: log\n' +
  '/home/an/My Documents :: ghi chu.txt :: txt\n' +
  '. :: README :: -\n' +
  '/etc :: hosts :: -\n' +
  '/srv/app :: (none) :: -';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "log=$(cat <<'EOF'\n" +
  '2026-09-01 10:00:01 INFO  /api/users 200\n' +
  '2026-09-01 10:00:02 ERROR /api/orders 500\n' +
  '2026-09-01 10:00:03 INFO  /api/users 200\n' +
  '2026-09-01 10:00:04 WARN  /api/users 404\n' +
  '2026-09-01 10:00:05 ERROR /api/orders 500\n' +
  '2026-09-01 10:00:06 INFO  /api/health 200\n' +
  '2026-09-01 10:00:07 ERROR /api/users 500\n' +
  '2026-09-01 10:00:08 INFO  /api/health 200\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'report() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'report <<< "$log"\n';

const Q2_SOLUTION =
  'report() {\n' +
  '  # Đọc stdin MỘT lần rồi giữ lại: hàm này phải duyệt dữ liệu ba lượt,\n' +
  '  # mà stdin thì chỉ đọc được một lần.\n' +
  '  local input\n' +
  '  input=$(cat)\n' +
  '\n' +
  "  printf 'total=%s\\n' \"$(printf '%s\\n' \"$input\" | wc -l | tr -d ' ')\"\n" +
  '\n' +
  '  # -k1,1nr: trường 1, SỐ, giảm dần. -k2,2: hoà thì so tên tăng dần.\n' +
  '  # Viết -k1nr (không có ,1) là "từ trường 1 tới hết dòng" — kết quả khác.\n' +
  "  printf '%s\\n' \"$input\" | awk '{ print $3 }' | sort | uniq -c \\\n" +
  "    | sort -k1,1nr -k2,2 | awk '{ printf \"%s=%s\\n\", $2, $1 }'\n" +
  '\n' +
  "  printf '%s\\n' \"$input\" | awk '{ print $4 }' | sort | uniq -c \\\n" +
  "    | sort -k1,1nr -k2,2 | head -2 | awk '{ printf \"top%d=%s(%s)\\n\", NR, $2, $1 }'\n" +
  '}\n';

const Q2_OUTPUT =
  'total=8\n' +
  'INFO=4\n' +
  'ERROR=3\n' +
  'WARN=1\n' +
  'top1=/api/users(4)\n' +
  'top2=/api/health(2)';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'root=$(mktemp -d)\n' +
  'trap \'rm -rf "$root"\' EXIT\n' +
  'mkdir -p "$root/src/lib" "$root/node_modules/pkg" "$root/logs"\n' +
  'printf \'a\\n\'   > "$root/src/app.js"\n' +
  'printf \'bb\\n\'  > "$root/src/lib/util.js"\n' +
  'printf \'ccc\\n\' > "$root/node_modules/pkg/index.js"\n' +
  'printf \'x\\n\'   > "$root/logs/old app.log"\n' +
  'printf \'y\\n\'   > "$root/logs/new.log"\n' +
  'printf \'zz\\n\'  > "$root/.env"\n' +
  'printf \'w\\n\'   > "$root/.gitignore"\n' +
  'printf \'q\\n\'   > "$root/README"\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'scan() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'scan "$root"\n';

const Q3_SOLUTION =
  'scan() {\n' +
  '  local root=$1\n' +
  '\n' +
  '  # -prune phải đứng TRƯỚC -o, và cả nhánh sau -o mới mang -print0.\n' +
  '  # -print0 + read -d \'\' là cặp duy nhất chịu được tên file có dấu cách.\n' +
  '  find "$root" -name node_modules -prune -o -type f -name \'*.js\' -print0 \\\n' +
  '    | sort -z \\\n' +
  "    | while IFS= read -r -d '' f; do\n" +
  '        printf \'js:%s\\n\' "${f#"$root"/}"\n' +
  '      done\n' +
  '\n' +
  '  printf \'logs=%s\\n\' "$(find "$root" -type f -name \'*.log\' | wc -l | tr -d \' \')"\n' +
  '\n' +
  '  # .[!.]* khớp file ẩn mà KHÔNG khớp . và .. ; nullglob để thư mục rỗng\n' +
  '  # không cho ra một phần tử là chính cái mẫu.\n' +
  '  local hidden\n' +
  '  shopt -s nullglob\n' +
  '  hidden=("$root"/.[!.]*)\n' +
  '  shopt -u nullglob\n' +
  '  printf \'hidden=%s\\n\' "${#hidden[@]}"\n' +
  '}\n';

const Q3_OUTPUT =
  'js:src/app.js\n' +
  'js:src/lib/util.js\n' +
  'logs=2\n' +
  'hidden=2';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'set -uo pipefail\n' +
  '\n' +
  'run() {\n' +
  '  local out rc\n' +
  '  out=$(release "$@" 2>&1); rc=$?\n' +
  '  printf \'[%s] rc=%s %s\\n\' "$*" "$rc" "$out"\n' +
  '}\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'release() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'run\n' +
  'run staging\n' +
  'run dev v1.0.0\n' +
  'run production latest\n' +
  'run staging latest\n' +
  'run production v1.2.3\n';

const Q4_SOLUTION =
  'release() {\n' +
  '  # Kiểm TẤT CẢ điều kiện trước khi làm bất cứ việc gì — script kiểm dần\n' +
  '  # có thể hỏng ở bước 7/9 và để hệ thống ở trạng thái dở dang.\n' +
  '  if [[ $# -ne 2 ]]; then\n' +
  "    echo 'usage: release <env> <tag>' >&2\n" +
  '    return 2\n' +
  '  fi\n' +
  '\n' +
  '  local env=$1 tag=$2\n' +
  '\n' +
  '  case $env in\n' +
  '    staging|production) ;;\n' +
  '    *) echo "unknown env: $env" >&2; return 3 ;;\n' +
  '  esac\n' +
  '\n' +
  '  # Chốt chính sách: biến "không được phép xảy ra" thành "không thể xảy ra".\n' +
  '  if [[ $env == production && $tag == latest ]]; then\n' +
  "    echo 'refusing to release latest to production' >&2\n" +
  '    return 4\n' +
  '  fi\n' +
  '\n' +
  '  # Chạy trong shell con để trap EXIT thuộc về riêng lần gọi này.\n' +
  '  # mktemp, KHÔNG BAO GIỜ /tmp/release.$$ — /tmp ai cũng ghi được và PID\n' +
  '  # thì đoán được, đó là một lỗ tấn công symlink có thật.\n' +
  '  (\n' +
  '    tmp=$(mktemp)\n' +
  '    trap \'rm -f "$tmp"\' EXIT\n' +
  '    printf \'%s %s\\n\' "$env" "$tag" > "$tmp"\n' +
  '    # wc -c < file, KHÔNG PHẢI stat -c %s: `stat -c` là cú pháp GNU, BSD/macOS\n' +
  '    # đòi `stat -f%z` và sẽ báo "illegal option -- c". wc -c là POSIX, số y hệt.\n' +
  '    printf \'released %s %s (manifest %s bytes)\\n\' "$env" "$tag" "$(wc -c < "$tmp" | tr -d \' \')"\n' +
  '  )\n' +
  '}\n';

const Q4_OUTPUT =
  '[] rc=2 usage: release <env> <tag>\n' +
  '[staging] rc=2 usage: release <env> <tag>\n' +
  '[dev v1.0.0] rc=3 unknown env: dev\n' +
  '[production latest] rc=4 refusing to release latest to production\n' +
  '[staging latest] rc=0 released staging latest (manifest 15 bytes)\n' +
  '[production v1.2.3] rc=0 released production v1.2.3 (manifest 18 bytes)';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Bốn cột, ngăn bằng dấu phẩy: date,service,status,requests\n' +
  "data=$(cat <<'EOF'\n" +
  '2026-09-01,web,200,120\n' +
  '2026-09-01,api,200,340\n' +
  '2026-09-01,api,500,15\n' +
  '2026-09-02,web,200,90\n' +
  '2026-09-02,api,404,7\n' +
  '2026-09-02,web,500,3\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'summary() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'summary <<< "$data"\n';

const Q5_SOLUTION =
  'summary() {\n' +
  '  local input\n' +
  '  input=$(cat)\n' +
  '\n' +
  '  # Mảng liên kết của awk gom nhóm trong MỘT lượt đọc, không cần sort trước.\n' +
  '  # $3 + 0 ép trường status về số — so chuỗi thì "404" >= "500" là sai.\n' +
  '  # Thứ tự duyệt "for (s in tot)" của awk KHÔNG xác định, nên phải | sort.\n' +
  "  printf '%s\\n' \"$input\" | awk -F, '\n" +
  '    { tot[$2] += $4; if ($3 + 0 >= 500) err[$2] += $4 }\n' +
  '    END {\n' +
  '      for (s in tot)\n' +
  '        printf "%s total=%d errors=%d rate=%.1f%%\\n", s, tot[s], err[s] + 0, (err[s] + 0) * 100 / tot[s]\n' +
  "    }' | sort\n" +
  '\n' +
  '  # Phần trăm phải tính trong awk: $(( )) của bash chỉ có số nguyên,\n' +
  '  # $((15 * 100 / 362)) ra 4 chứ không phải 4.1.\n' +
  "  printf '%s\\n' \"$input\" | awk -F, '\n" +
  '    { day[$1] += $4 }\n' +
  '    END { for (d in day) printf "%d %s\\n", day[d], d }\' \\\n' +
  '    | sort -k1,1nr -k2,2 | head -1 \\\n' +
  '    | awk \'{ printf "peak=%s (%s)\\n", $2, $1 }\'\n' +
  '}\n';

const Q5_OUTPUT =
  'api total=362 errors=15 rate=4.1%\n' +
  'web total=213 errors=3 rate=1.4%\n' +
  'peak=2026-09-01 (475)';

export default {
  course: { slug: 'linux-bash' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the script, not just the command',
        'Thi thực hành — viết script, chứ không chỉ gõ lệnh',
      ),
      description: B(
        'Five scripting questions in bash, submitted as a .zip. Parameter expansion and quoting, a pipeline report with sort/uniq/awk, find with -prune and filenames containing spaces, a production script skeleton with argument validation, exit codes, mktemp and trap, and a grouped report built on awk associative arrays — chapters 2, 3, 6 and 7.',
        'Năm câu viết script bằng bash, nộp dưới dạng .zip. Khai triển tham số và dấu nháy, một báo cáo bằng ống dẫn với sort/uniq/awk, find có -prune và tên file chứa dấu cách, một bộ khung script chạy thật với kiểm tham số, mã thoát, mktemp và trap, và một báo cáo gom nhóm dựng trên mảng liên kết của awk — các chương 2, 3, 6 và 7.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 6.2 + 6.3 ───────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q1 — Take a path apart without forking a single process (chapters 6.2 and 6.3).</b> Implement <code>describe()</code>, which takes one path and prints one line:</p>' +
            code('<directory> :: <basename> :: <extension>') +
            '<ul>' +
            '<li><b>directory</b> — everything before the last <code>/</code>. If the path has no slash at all, print <code>.</code> instead.</li>' +
            '<li><b>basename</b> — everything after the last <code>/</code>. If that is empty (the path ends in a slash), print <code>(none)</code>.</li>' +
            '<li><b>extension</b> — everything after the last <code>.</code> in the basename. If the basename has no dot, print <code>-</code>.</li>' +
            '</ul>' +
            '<p>Use <b>parameter expansion only</b>: ' + c('${p##*/}') + ', ' + c('${p%/*}') + ' and friends. No <code>basename</code>, no <code>dirname</code>, no <code>sed</code>, no <code>awk</code> — the point of the question is that the shell can do this without starting a process, and a loop over 10,000 paths shows the difference.</p>' +
            '<p>Two of the six test paths are the interesting ones. <code>/home/an/My Documents/ghi chu.txt</code> contains spaces, so every expansion has to be quoted; get one wrong and it arrives as several arguments. And <code>/srv/app/</code> ends in a slash, which is exactly where ' + c('${p##*/}') + ' and <code>basename</code> disagree — the expansion gives an empty string, which is why the spec asks for <code>(none)</code>.</p>',

            '<p><b>Câu 1 — Tách một đường dẫn mà không tạo thêm một tiến trình nào (chương 6.2 và 6.3).</b> Cài đặt <code>describe()</code>, nhận vào một đường dẫn và in ra một dòng:</p>' +
            code('<thư mục> :: <tên file> :: <phần mở rộng>') +
            '<ul>' +
            '<li><b>thư mục</b> — mọi thứ trước dấu <code>/</code> cuối cùng. Nếu đường dẫn không có dấu gạch chéo nào thì in <code>.</code>.</li>' +
            '<li><b>tên file</b> — mọi thứ sau dấu <code>/</code> cuối cùng. Nếu phần đó rỗng (đường dẫn kết thúc bằng dấu gạch chéo) thì in <code>(none)</code>.</li>' +
            '<li><b>phần mở rộng</b> — mọi thứ sau dấu <code>.</code> cuối cùng trong tên file. Tên file không có dấu chấm thì in <code>-</code>.</li>' +
            '</ul>' +
            '<p>Chỉ dùng <b>khai triển tham số</b>: ' + c('${p##*/}') + ', ' + c('${p%/*}') + ' và họ hàng. Không <code>basename</code>, không <code>dirname</code>, không <code>sed</code>, không <code>awk</code> — điều câu này muốn nói là shell làm được việc ấy mà không cần khởi động một tiến trình nào, và một vòng lặp qua 10.000 đường dẫn sẽ cho thấy khác biệt.</p>' +
            '<p>Hai trong sáu đường dẫn thử mới là hai cái đáng chú ý. <code>/home/an/My Documents/ghi chu.txt</code> có dấu cách, nên mọi phép khai triển đều phải đặt trong nháy; sai một chỗ là nó tới nơi dưới dạng nhiều tham số. Còn <code>/srv/app/</code> kết thúc bằng dấu gạch chéo, và đó đúng là chỗ ' + c('${p##*/}') + ' với <code>basename</code> bất đồng — phép khai triển cho ra chuỗi rỗng, và vì thế đề yêu cầu in <code>(none)</code>.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['expansion',
              'The whole job is done with parameter expansion — ' + c('${path##*/}') + ' and ' + c('${path%/*}') + ' — with no call to <code>basename</code>, <code>dirname</code>, <code>sed</code> or <code>awk</code>.',
              'Toàn bộ việc được làm bằng khai triển tham số — ' + c('${path##*/}') + ' và ' + c('${path%/*}') + ' — không gọi <code>basename</code>, <code>dirname</code>, <code>sed</code> hay <code>awk</code>.',
              0.5],
            ['quoting',
              'Every expansion is quoted, so the path containing spaces prints as one field rather than being split into several arguments.',
              'Mọi phép khai triển đều đặt trong nháy, nhờ đó đường dẫn có dấu cách in ra thành một trường chứ không bị cắt thành nhiều tham số.',
              0.5],
            ['edges',
              'The three edge cases are right: a path with no slash gives <code>.</code>, a basename with no dot gives <code>-</code>, and a trailing slash gives <code>(none)</code>.',
              'Ba ca biên đều đúng: đường dẫn không có dấu gạch chéo cho <code>.</code>, tên file không có dấu chấm cho <code>-</code>, và dấu gạch chéo cuối cho <code>(none)</code>.',
              0.5],
          ]),
        }),

        /* ── Q2 · chương 3.2 + 3.4 + 3.6 ─────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q2 — A report out of a pipeline (chapters 3.2, 3.4 and 3.6).</b> <code>report()</code> reads an access log on <b>stdin</b> — five whitespace-separated fields: date, time, level, path, status — and prints exactly six lines:</p>' +
            code(
              'total=<number of lines>\n' +
              '<LEVEL>=<count>          one line per level, most frequent first,\n' +
              '                          ties broken alphabetically\n' +
              'top1=<path>(<count>)     the two most requested paths, same ordering\n' +
              'top2=<path>(<count>)',
            ) +
            '<p>Three details decide this question.</p>' +
            '<ul>' +
            '<li><b>Read stdin once.</b> You need three passes over the same data, and stdin can only be read once — capture it into a variable first (' + c('input=$(cat)') + ') and feed that variable to each stage.</li>' +
            '<li><b>Sort numerically, and only on the field you mean.</b> <code>sort -k1,1nr -k2,2</code> means "field 1 as a number, descending; then field 2 ascending". A bare <code>-k1nr</code> means "from field 1 to the end of the line", which quietly gives a different answer, and without <code>n</code> the count <code>10</code> sorts before <code>9</code>.</li>' +
            '<li><b><code>uniq</code> only collapses adjacent lines</b>, so it needs a <code>sort</code> in front of it. There is a second path worth knowing: ' + c("awk '{ c[$3]++ } END { for (k in c) print c[k], k }'") + ' does the counting in one pass with no sorting of the input at all, and on a multi-gigabyte log that is several times faster.</li>' +
            '</ul>' +
            '<p>Note that <code>WARN</code> and <code>ERROR</code> both have padding spaces in the input; the default whitespace splitting of <code>awk</code> collapses runs of spaces, while <code>cut -d\' \'</code> does not — that difference is why one of them is the right tool here.</p>',

            '<p><b>Câu 2 — Một bản báo cáo dựng từ ống dẫn (chương 3.2, 3.4 và 3.6).</b> Hàm <code>report()</code> đọc một access log từ <b>stdin</b> — năm trường ngăn bằng khoảng trắng: ngày, giờ, mức, đường dẫn, mã trạng thái — và in ra đúng sáu dòng:</p>' +
            code(
              'total=<số dòng>\n' +
              '<MỨC>=<số lần>           mỗi mức một dòng, nhiều nhất lên trước,\n' +
              '                          hoà nhau thì so theo thứ tự chữ cái\n' +
              'top1=<đường dẫn>(<số lần>)  hai đường dẫn bị gọi nhiều nhất, cùng cách sắp\n' +
              'top2=<đường dẫn>(<số lần>)',
            ) +
            '<p>Ba chi tiết quyết định câu này.</p>' +
            '<ul>' +
            '<li><b>Đọc stdin đúng một lần.</b> Bạn cần ba lượt duyệt trên cùng một khối dữ liệu, mà stdin thì chỉ đọc được một lần — hãy hứng nó vào một biến trước (' + c('input=$(cat)') + ') rồi đưa biến đó cho từng chặng.</li>' +
            '<li><b>Sắp theo SỐ, và chỉ trên đúng trường bạn muốn.</b> <code>sort -k1,1nr -k2,2</code> nghĩa là "trường 1 xét như số, giảm dần; rồi trường 2 tăng dần". Viết <code>-k1nr</code> trơ trọi nghĩa là "từ trường 1 tới hết dòng", thứ lặng lẽ cho ra câu trả lời khác, còn thiếu chữ <code>n</code> thì số đếm <code>10</code> lại đứng trước <code>9</code>.</li>' +
            '<li><b><code>uniq</code> chỉ gộp những dòng nằm kề nhau</b>, nên nó cần một lệnh <code>sort</code> đứng trước. Có một đường thứ hai đáng biết: ' + c("awk '{ c[$3]++ } END { for (k in c) print c[k], k }'") + ' đếm xong trong một lượt mà không phải sắp xếp đầu vào chút nào, và trên một file log vài gigabyte thì nó nhanh hơn nhiều lần.</li>' +
            '</ul>' +
            '<p>Lưu ý rằng <code>WARN</code> và <code>ERROR</code> trong đầu vào đều có dấu cách đệm; phép cắt theo khoảng trắng mặc định của <code>awk</code> gộp các dãy dấu cách lại, còn <code>cut -d\' \'</code> thì không — chính khác biệt đó quyết định công cụ nào là công cụ đúng ở đây.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['stdin',
              'Stdin is captured once and reused for all three passes; the function does not try to read the same stream twice and does not reach around it to the <code>log</code> variable defined in the given block.',
              'Stdin được hứng một lần rồi dùng lại cho cả ba lượt; hàm không cố đọc cùng một dòng dữ liệu hai lần và cũng không với ra ngoài để lấy thẳng biến <code>log</code> trong khối cho sẵn.',
              0.5],
            ['sorting',
              'Counting and ordering are right: <code>uniq -c</code> has a <code>sort</code> in front of it, the count is sorted numerically and descending, and ties are broken by name ascending.',
              'Việc đếm và sắp thứ tự đều đúng: <code>uniq -c</code> có <code>sort</code> đứng trước, số đếm được sắp theo số và giảm dần, và khi hoà thì so tên tăng dần.',
              0.5],
            ['format',
              'All six lines match the specified format exactly, including <code>total=</code>, the <code>LEVEL=count</code> lines and the <code>topN=path(count)</code> lines.',
              'Cả sáu dòng khớp đúng khuôn đề, kể cả dòng <code>total=</code>, các dòng <code>MỨC=số</code> và các dòng <code>topN=đường dẫn(số)</code>.',
              0.5],
          ]),
        }),

        /* ── Q3 · chương 2.2 + 2.3 + 6.5 ─────────────────────────── */
        codeQ({
          points: 2,
          language: 'bash',
          prompt: B(
            '<p><b>Q3 — Walk a tree that is out to get you (chapters 2.2, 2.3 and 6.5).</b> The given block builds a small project under a temp directory. Implement <code>scan()</code>, which takes the root as its argument and prints:</p>' +
            '<ul>' +
            '<li>one <code>js:&lt;relative path&gt;</code> line for every <code>.js</code> file <b>outside</b> <code>node_modules</code>, sorted, with the root prefix stripped;</li>' +
            '<li><code>logs=&lt;n&gt;</code>, the number of <code>.log</code> files anywhere in the tree;</li>' +
            '<li><code>hidden=&lt;n&gt;</code>, the number of dotfiles directly in the root — not counting <code>.</code> and <code>..</code>, and not descending into subdirectories.</li>' +
            '</ul>' +
            '<p>The tree contains three traps, all of which appear in real projects.</p>' +
            '<ul>' +
            '<li><code>node_modules/pkg/index.js</code> must not appear. Use ' + c('find "$root" -name node_modules -prune -o -type f -name \'*.js\' -print0') + ' — note that <code>-prune</code> comes before <code>-o</code> and that the <code>-print0</code> belongs to the branch after it. Filtering afterwards with <code>grep -v</code> gives the same output here and is still worse: <code>find</code> would have walked the whole dependency tree first.</li>' +
            '<li><code>logs/old app.log</code> contains a space. A ' + c('for f in $(find …)') + ' loop tears that name into two, and so does an unquoted expansion anywhere downstream. The pair that survives it is <code>-print0</code> with ' + c("while IFS= read -r -d '' f") + '.</li>' +
            '<li><code>.env</code> and <code>.gitignore</code> are invisible to <code>*</code>. A glob never matches a leading dot, which is exactly why <code>tar -czf backup.tar.gz *</code> leaves your <code>.env</code> out of the backup. Match them with ' + c('"$root"/.[!.]*') + ' — the ' + c('[!.]') + ' is what stops <code>.</code> and <code>..</code> being counted — and set <code>nullglob</code> so an empty directory yields an empty array instead of one element containing the pattern itself.</li>' +
            '</ul>' +
            '<p>Do not modify the given block: it creates the tree with <code>mktemp -d</code> and removes it with a <code>trap … EXIT</code>, which is the pattern from lesson 7.3 and is worth reading before you write your own.</p>',

            '<p><b>Câu 3 — Duyệt một cây thư mục đang chực chờ bẫy bạn (chương 2.2, 2.3 và 6.5).</b> Khối cho sẵn dựng ra một dự án nhỏ trong một thư mục tạm. Hãy cài đặt <code>scan()</code>, nhận thư mục gốc làm tham số và in ra:</p>' +
            '<ul>' +
            '<li>một dòng <code>js:&lt;đường dẫn tương đối&gt;</code> cho mỗi file <code>.js</code> nằm <b>ngoài</b> <code>node_modules</code>, đã sắp thứ tự, đã cắt bỏ phần tiền tố thư mục gốc;</li>' +
            '<li><code>logs=&lt;n&gt;</code>, số file <code>.log</code> ở bất cứ đâu trong cây;</li>' +
            '<li><code>hidden=&lt;n&gt;</code>, số file ẩn nằm ngay tại thư mục gốc — không tính <code>.</code> và <code>..</code>, và không đi xuống thư mục con.</li>' +
            '</ul>' +
            '<p>Cây thư mục có ba cái bẫy, cả ba đều xuất hiện trong dự án thật.</p>' +
            '<ul>' +
            '<li><code>node_modules/pkg/index.js</code> không được hiện ra. Hãy dùng ' + c('find "$root" -name node_modules -prune -o -type f -name \'*.js\' -print0') + ' — chú ý <code>-prune</code> đứng trước <code>-o</code> và <code>-print0</code> thuộc về nhánh đứng sau. Lọc lại bằng <code>grep -v</code> ở phía sau cũng cho ra đúng kết quả này nhưng vẫn tệ hơn: <code>find</code> đã phải duyệt hết cả cây phụ thuộc trước rồi.</li>' +
            '<li><code>logs/old app.log</code> có dấu cách. Một vòng ' + c('for f in $(find …)') + ' xé cái tên đó làm đôi, và một phép khai triển không đặt trong nháy ở bất cứ chặng nào phía sau cũng vậy. Cặp sống sót được là <code>-print0</code> đi với ' + c("while IFS= read -r -d '' f") + '.</li>' +
            '<li><code>.env</code> và <code>.gitignore</code> vô hình với dấu <code>*</code>. Một glob không bao giờ khớp dấu chấm đứng đầu, và đó đúng là lý do <code>tar -czf backup.tar.gz *</code> bỏ quên <code>.env</code> của bạn. Hãy khớp chúng bằng ' + c('"$root"/.[!.]*') + ' — chính ' + c('[!.]') + ' là thứ ngăn <code>.</code> và <code>..</code> bị đếm — và bật <code>nullglob</code> để một thư mục rỗng cho ra mảng rỗng thay vì một phần tử là chính cái mẫu.</li>' +
            '</ul>' +
            '<p>Đừng sửa khối cho sẵn: nó dựng cây bằng <code>mktemp -d</code> và dọn bằng một <code>trap … EXIT</code>, đúng khuôn của bài 7.3 và đáng đọc trước khi bạn tự viết cái của mình.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['prune',
              '<code>node_modules</code> is skipped with <code>-prune</code> inside <code>find</code> rather than filtered out afterwards, and the <code>-o</code> branch carries the print action.',
              '<code>node_modules</code> bị bỏ qua bằng <code>-prune</code> ngay trong <code>find</code> chứ không phải lọc lại sau, và nhánh sau <code>-o</code> mới mang hành động in.',
              0.5],
            ['nullsafe',
              'The filename containing a space survives: <code>-print0</code> is paired with ' + c("read -r -d ''") + ' (or <code>-exec</code>), and no ' + c('for f in $(find …)') + ' appears anywhere.',
              'Tên file có dấu cách sống sót: <code>-print0</code> đi cặp với ' + c("read -r -d ''") + ' (hoặc <code>-exec</code>), và không có chỗ nào xuất hiện ' + c('for f in $(find …)') + '.',
              0.5],
            ['hidden',
              'Dotfiles are counted with a glob that excludes <code>.</code> and <code>..</code> and does not descend, with <code>nullglob</code> handling the empty case; the answer is 2, not 4 and not 0.',
              'File ẩn được đếm bằng một glob loại trừ <code>.</code> và <code>..</code> và không đi xuống thư mục con, có <code>nullglob</code> lo ca rỗng; đáp số là 2, không phải 4 và không phải 0.',
              0.5],
            ['output',
              'The four lines come out in the specified order with the root prefix stripped from the <code>js:</code> paths, and the two <code>js:</code> lines are sorted.',
              'Bốn dòng ra đúng thứ tự đề nêu, phần tiền tố thư mục gốc đã được cắt khỏi các đường dẫn <code>js:</code>, và hai dòng <code>js:</code> đã được sắp thứ tự.',
              0.5],
          ]),
        }),

        /* ── Q4 · chương 6.4 + 7.1 + 7.2 + 7.3 ───────────────────── */
        codeQ({
          points: 2.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q4 — A script that refuses instead of breaking (chapters 6.4, 7.1, 7.2 and 7.3).</b> Implement <code>release()</code>. The given <code>run()</code> wrapper calls it, captures both output streams and the exit code, and prints one summary line per invocation — so <b>the exit code is part of the answer</b>, not an afterthought.</p>' +
            '<p>Behaviour, in this order:</p>' +
            '<ul>' +
            '<li>Not exactly two arguments → print <code>usage: release &lt;env&gt; &lt;tag&gt;</code> <b>to stderr</b> and return <b>2</b>.</li>' +
            '<li>The environment is neither <code>staging</code> nor <code>production</code> → print <code>unknown env: &lt;env&gt;</code> to stderr and return <b>3</b>.</li>' +
            '<li>The environment is <code>production</code> and the tag is <code>latest</code> → print <code>refusing to release latest to production</code> to stderr and return <b>4</b>.</li>' +
            '<li>Otherwise: create a temp file with <code>mktemp</code>, write <code>&lt;env&gt; &lt;tag&gt;</code> plus a newline into it, print <code>released &lt;env&gt; &lt;tag&gt; (manifest &lt;n&gt; bytes)</code> where <code>&lt;n&gt;</code> is the file\'s size from <code>wc -c</code> (portable; <code>stat -c %s</code> is the GNU-only equivalent and fails on BSD/macOS), remove the temp file, and return <b>0</b>.</li>' +
            '</ul>' +
            '<p>Four things are being measured beyond the output.</p>' +
            '<ul>' +
            '<li><b>Validate everything before doing anything.</b> All three checks run before the temp file is created. A script that validates as it goes can fail on step seven of nine and leave the system half-changed; one that validates first either does the whole job or does nothing, and "nothing" is a state you can recover from.</li>' +
            '<li><b>Errors go to stderr, results go to stdout.</b> That is what makes ' + c('release … > manifest.txt') + ' usable at all.</li>' +
            '<li><b>The <code>production</code> + <code>latest</code> rule is a policy expressed as a check.</b> It turns a thing that must not happen into a thing that cannot — the highest-leverage kind of line in an operations script.</li>' +
            '<li><b><code>mktemp</code>, never <code>/tmp/release.$$</code>.</b> PIDs are reused and <code>/tmp</code> is world-writable, so a predictable path is a real symlink-attack surface. Remove the file with a <code>trap … EXIT</code> so it goes away on every path, not only the happy one — running the body in a subshell <code>( … )</code> keeps that trap local to one call.</li>' +
            '</ul>' +
            '<p>Note that the given block sets <code>set -uo pipefail</code> but deliberately <b>not</b> <code>-e</code>: with <code>-e</code> on, the very first non-zero return from <code>release</code> would kill the whole script before the second test case ran.</p>',

            '<p><b>Câu 4 — Một script biết từ chối thay vì làm hỏng (chương 6.4, 7.1, 7.2 và 7.3).</b> Hãy cài đặt <code>release()</code>. Hàm bọc <code>run()</code> cho sẵn sẽ gọi nó, hứng cả hai dòng ra lẫn mã thoát, rồi in một dòng tóm tắt cho mỗi lượt gọi — nên <b>mã thoát là một phần của đáp án</b>, không phải chuyện phụ.</p>' +
            '<p>Hành vi, theo đúng thứ tự này:</p>' +
            '<ul>' +
            '<li>Không đúng hai tham số → in <code>usage: release &lt;env&gt; &lt;tag&gt;</code> <b>ra stderr</b> rồi trả về <b>2</b>.</li>' +
            '<li>Môi trường không phải <code>staging</code> cũng không phải <code>production</code> → in <code>unknown env: &lt;env&gt;</code> ra stderr rồi trả về <b>3</b>.</li>' +
            '<li>Môi trường là <code>production</code> và nhãn là <code>latest</code> → in <code>refusing to release latest to production</code> ra stderr rồi trả về <b>4</b>.</li>' +
            '<li>Còn lại: tạo một file tạm bằng <code>mktemp</code>, ghi vào đó <code>&lt;env&gt; &lt;tag&gt;</code> kèm một dấu xuống dòng, in <code>released &lt;env&gt; &lt;tag&gt; (manifest &lt;n&gt; bytes)</code> với <code>&lt;n&gt;</code> là kích thước file lấy từ <code>wc -c</code> (chạy được mọi nơi; <code>stat -c %s</code> là bản tương đương chỉ có ở GNU, hỏng trên BSD/macOS), xoá file tạm, và trả về <b>0</b>.</li>' +
            '</ul>' +
            '<p>Ngoài kết quả in ra, còn bốn thứ đang được chấm.</p>' +
            '<ul>' +
            '<li><b>Kiểm hết mọi thứ trước khi làm bất cứ việc gì.</b> Cả ba phép kiểm chạy xong rồi file tạm mới được tạo. Một script vừa làm vừa kiểm có thể hỏng ở bước bảy trên chín và để hệ thống thay đổi dở dang; một script kiểm trước thì hoặc làm trọn việc hoặc không làm gì, mà "không làm gì" là trạng thái bạn hồi phục được.</li>' +
            '<li><b>Lỗi đi ra stderr, kết quả đi ra stdout.</b> Chính điều đó làm cho ' + c('release … > manifest.txt') + ' dùng được.</li>' +
            '<li><b>Luật <code>production</code> + <code>latest</code> là một chính sách được viết thành một phép kiểm.</b> Nó biến một thứ không được phép xảy ra thành một thứ không thể xảy ra — loại dòng có sức bẩy lớn nhất trong một script vận hành.</li>' +
            '<li><b><code>mktemp</code>, đừng bao giờ <code>/tmp/release.$$</code>.</b> PID được dùng lại và <code>/tmp</code> thì ai cũng ghi được, nên một đường dẫn đoán được là một bề mặt tấn công symlink có thật. Hãy xoá file bằng một <code>trap … EXIT</code> để nó biến mất trên mọi lối đi chứ không riêng lối suôn sẻ — chạy phần thân trong một shell con <code>( … )</code> sẽ giữ cái bẫy đó cục bộ trong đúng một lượt gọi.</li>' +
            '</ul>' +
            '<p>Chú ý khối cho sẵn có <code>set -uo pipefail</code> nhưng cố ý <b>không</b> có <code>-e</code>: bật <code>-e</code> lên thì lần trả về khác 0 đầu tiên của <code>release</code> đã giết cả script trước khi ca thử thứ hai kịp chạy.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['exitcodes',
              'The four exit codes are exactly 2, 3, 4 and 0 for the four situations described, and the argument count is checked before anything else runs.',
              'Bốn mã thoát đúng là 2, 3, 4 và 0 cho bốn tình huống đã mô tả, và số tham số được kiểm trước khi bất cứ thứ gì khác chạy.',
              0.7],
            ['streams',
              'Every error message goes to stderr with <code>&gt;&amp;2</code> and only the success line goes to stdout; the messages match the specified wording exactly.',
              'Mọi thông báo lỗi đi ra stderr bằng <code>&gt;&amp;2</code> và chỉ dòng thành công đi ra stdout; nội dung các thông báo khớp đúng từng chữ như đề nêu.',
              0.6],
            ['tempfile',
              'The temp file comes from <code>mktemp</code> — no <code>$$</code>, no hard-coded name under <code>/tmp</code> — and it is removed through a <code>trap … EXIT</code> rather than a single <code>rm</code> on the happy path.',
              'File tạm sinh ra từ <code>mktemp</code> — không <code>$$</code>, không tên viết cứng trong <code>/tmp</code> — và nó được xoá qua một <code>trap … EXIT</code> chứ không phải một lệnh <code>rm</code> đặt trên lối suôn sẻ.',
              0.6],
            ['guards',
              'The <code>production</code> plus <code>latest</code> refusal is enforced as a check, all validation happens before the temp file is created, and tests use <code>[[ ]]</code> or <code>case</code> rather than a <code>[ ]</code> that an empty value can break.',
              'Phép từ chối <code>production</code> cộng <code>latest</code> được cưỡng chế bằng một phép kiểm, mọi việc kiểm tính hợp lệ diễn ra trước khi file tạm được tạo, và các phép kiểm dùng <code>[[ ]]</code> hoặc <code>case</code> chứ không dùng <code>[ ]</code> vốn có thể vỡ vì một giá trị rỗng.',
              0.6],
          ]),
        }),

        /* ── Q5 · chương 3.6 + 6.1 ───────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'bash',
          prompt: B(
            '<p><b>Q5 — Group and total without a database (chapters 3.6 and 6.1).</b> <code>summary()</code> reads four comma-separated columns on stdin — <code>date,service,status,requests</code> — and prints one line per service, sorted by service name, then one peak line:</p>' +
            code(
              '<service> total=<sum of requests> errors=<sum where status &gt;= 500> rate=<errors/total as a percentage, one decimal>%\n' +
              'peak=<the date with the most total requests> (<that total>)',
            ) +
            '<p>Three things this question is really about.</p>' +
            '<ul>' +
            '<li><b>Associative arrays.</b> ' + c('tot[$2] += $4') + ' groups in a single pass with no <code>sort</code> in front, which is the whole reason awk beats <code>sort | uniq -c</code> on a large file — measured in the lesson at 9 s versus 41 s on a 2.1 GB log.</li>' +
            '<li><b>awk\'s iteration order is undefined.</b> ' + c('for (s in tot)') + ' may hand you the services in any order at all, and it is not the input order. If the output has to be sorted, you sort it — either pipe the result through <code>sort</code>, or build the keys yourself. A solution that only happens to come out right on this input is not correct.</li>' +
            '<li><b>Compute the percentage inside awk.</b> Bash arithmetic is integer only and truncates, so ' + c('$(( 15 * 100 / 362 ))') + ' is <code>4</code>, not <code>4.1</code> — the decimal simply does not exist there, and nothing warns you. <code>awk</code> has real floating point and <code>printf "%.1f"</code>.</li>' +
            '</ul>' +
            '<p>Two smaller traps. Compare the status field as a number (' + c('$3 + 0 >= 500') + '): as text, <code>"404"</code> and <code>"500"</code> compare by their first characters, and the answer would still look plausible. And a service with no errors at all must print <code>errors=0</code> rather than an empty field — in awk an array element that was never assigned is the empty string, so add <code>+ 0</code> before printing it.</p>' +
            '<p>The percentages in the expected output are <code>15/362</code> and <code>3/213</code>, rounded to one decimal by <code>printf</code>.</p>',

            '<p><b>Câu 5 — Gom nhóm và cộng tổng mà không cần cơ sở dữ liệu (chương 3.6 và 6.1).</b> Hàm <code>summary()</code> đọc bốn cột ngăn bằng dấu phẩy từ stdin — <code>date,service,status,requests</code> — rồi in mỗi dịch vụ một dòng, sắp theo tên dịch vụ, rồi một dòng đỉnh:</p>' +
            code(
              '<dịch vụ> total=<tổng requests> errors=<tổng phần có status &gt;= 500> rate=<errors/total theo phần trăm, một chữ số thập phân>%\n' +
              'peak=<ngày có tổng requests lớn nhất> (<tổng đó>)',
            ) +
            '<p>Ba điều câu này thật sự muốn hỏi.</p>' +
            '<ul>' +
            '<li><b>Mảng liên kết.</b> ' + c('tot[$2] += $4') + ' gom nhóm trong đúng một lượt đọc mà không cần <code>sort</code> đứng trước, và đó chính là lý do awk thắng <code>sort | uniq -c</code> trên file lớn — bài học đo được 9 giây so với 41 giây trên một log 2,1 GB.</li>' +
            '<li><b>Thứ tự duyệt của awk là không xác định.</b> ' + c('for (s in tot)') + ' có thể đưa các dịch vụ cho bạn theo thứ tự bất kỳ, và đó không phải thứ tự đầu vào. Nếu kết quả cần được sắp thì bạn phải sắp — hoặc đẩy kết quả qua <code>sort</code>, hoặc tự dựng danh sách khoá. Một lời giải chỉ tình cờ ra đúng trên đúng bộ dữ liệu này thì không phải một lời giải đúng.</li>' +
            '<li><b>Tính phần trăm bên trong awk.</b> Số học của bash chỉ có số nguyên và cắt phần lẻ, nên ' + c('$(( 15 * 100 / 362 ))') + ' ra <code>4</code> chứ không phải <code>4.1</code> — phần thập phân đơn giản là không tồn tại ở đó, và không có gì cảnh báo bạn. <code>awk</code> có số thực thật và có <code>printf "%.1f"</code>.</li>' +
            '</ul>' +
            '<p>Hai cái bẫy nhỏ hơn. Hãy so trường trạng thái như một con số (' + c('$3 + 0 >= 500') + '): xét như chuỗi thì <code>"404"</code> và <code>"500"</code> so nhau bằng ký tự đầu, và câu trả lời vẫn sẽ trông rất hợp lý. Và một dịch vụ không có lỗi nào phải in ra <code>errors=0</code> chứ không phải một ô trống — trong awk, một phần tử mảng chưa từng được gán là chuỗi rỗng, nên hãy cộng <code>+ 0</code> trước khi in.</p>' +
            '<p>Các con số phần trăm trong kết quả mong đợi là <code>15/362</code> và <code>3/213</code>, làm tròn một chữ số thập phân bằng <code>printf</code>.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['grouping',
              'Grouping is done with awk associative arrays keyed by service and by date, in a single pass each, rather than by looping in bash and re-scanning the data per key.',
              'Việc gom nhóm được làm bằng mảng liên kết của awk, đánh khoá theo dịch vụ và theo ngày, mỗi thứ một lượt đọc, chứ không phải lặp trong bash rồi quét lại dữ liệu cho từng khoá.',
              0.7],
            ['ordering',
              'The service lines come out sorted deterministically, and the solution does not rely on awk\'s undefined ' + c('for (k in arr)') + ' order to produce that ordering.',
              'Các dòng dịch vụ ra theo một thứ tự xác định, và lời giải không dựa vào thứ tự không xác định của ' + c('for (k in arr)') + ' trong awk để có được thứ tự ấy.',
              0.6],
            ['numbers',
              'The status field is compared numerically, a service with no errors prints <code>errors=0</code>, and the rate is a real one-decimal percentage computed in awk rather than truncated by bash integer arithmetic.',
              'Trường trạng thái được so như số, một dịch vụ không có lỗi in ra <code>errors=0</code>, và tỉ lệ là một phần trăm thật với một chữ số thập phân tính trong awk chứ không bị số học nguyên của bash cắt cụt.',
              0.6],
            ['peak',
              'The peak line finds the date with the largest total, breaking a tie deterministically, and prints it in the specified <code>peak=&lt;date&gt; (&lt;total&gt;)</code> form.',
              'Dòng đỉnh tìm ra ngày có tổng lớn nhất, hoà thì phân định theo một cách xác định, và in đúng khuôn <code>peak=&lt;ngày&gt; (&lt;tổng&gt;)</code> mà đề nêu.',
              0.6],
          ]),
        }),
      ],
    },
  ],
};
