/**
 * Linux & Bash — Progress Test 1 (Mục 0 → Chương 4).
 *
 * Đề tự soạn, bám sát `content/courses/linux-bash/s00-intro.mjs` …
 * `s04-quyen-nguoi-dung.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay
 * trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI TRANSCRIPT TRONG ĐỀ ĐỀU CHẠY THẬT TRÊN LINUX, KHÔNG PHẢI macOS
 * ────────────────────────────────────────────────────────────────────────────
 * Máy soạn đề là macOS 26.6 (arm64), nhưng khoá này dạy Linux — nên mọi phép đo
 * được chạy trong một container Debian dựng riêng:
 *
 *     docker run -d --name linux-pt-lab --platform linux/amd64 debian:12 …
 *
 *     debian:12 (Debian 12.15, linux/amd64)
 *     bash 5.2.15(1)-release · GNU coreutils 9.1 · GNU grep 3.8 · GNU sed 4.9
 *     GNU findutils 4.9.0 · gawk 5.2.1 (/usr/bin/awk → gawk) · systemd 252
 *
 * Mọi phép kiểm quyền (chương 4) được chạy bằng người dùng thường `alice` và
 * `bob` (`useradd -m`, rồi `su alice -c '…'`), KHÔNG phải root — root bỏ qua
 * mọi phép kiểm quyền, nên đo bằng root là đo ra một câu trả lời sai.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `echo .*` KHÔNG còn khớp `.` và `..`. Bài 2.2 in ra
 *    `. .. .env .gitignore` và cảnh báo rằng `rm -rf .*` sẽ đệ quy lên thư mục
 *    CHA. Trên bash 5.2.15 phép đo cho `.env .gitignore` — bash 5.2 thêm tuỳ
 *    chọn `globskipdots`, MẶC ĐỊNH BẬT, khiến `*` và `.*` không bao giờ khớp
 *    `.` hay `..`. Tắt nó đi (`shopt -u globskipdots`) thì hành vi cũ quay lại,
 *    đúng như giáo trình mô tả. Câu 12 hỏi đúng chỗ này và theo MÁY.
 *
 * 2. Cảnh báo `-maxdepth` của find CHỈ hiện khi stdin là TTY. Bài 2.3 in khối
 *    cảnh báo hai dòng của `find . -name "*.json" -maxdepth 2` như thể nó luôn
 *    xuất hiện. Đo thật trên findutils 4.9.0: chạy qua `docker exec` (không
 *    TTY) thì find IM LẶNG, exit 0; chạy với `docker exec -t` (có TTY) thì
 *    cảnh báo hiện ra, và nó là MỘT dòng dài chứ không phải hai dòng như sách.
 *    Nghĩa là cái cảnh báo bạn thấy khi gõ tay sẽ biến mất khi đúng lệnh đó
 *    chạy trong script hay trong CI. Câu 13 dựng trên phép đo này.
 *
 * 3. Shebang dính `\r` KHÔNG còn báo `bad interpreter`. Bài 3.4 và bài 4.5 đều
 *    trích `bad interpreter: No such file or directory`. Đo thật trên bash
 *    5.2.15: `./crlf.sh` trả
 *        bash: ./crlf.sh: cannot execute: required file not found
 *    với mã thoát 127. Câu 30 chép nguyên văn bản của máy.
 *
 * 4. `sed -i 's/a/b/' f` trên macOS KHÔNG "âm thầm tạo file sao lưu". Bài 0.3
 *    nói dạng Linux "silently creates a backup file named after your
 *    expression". Đo thật trên BSD sed của macOS 26.6: nó hỏng ồn ào —
 *        sed: 1: "f.txt\n": invalid command code f
 *    mã thoát 1, và KHÔNG có file sao lưu nào được tạo. Chiều ngược lại thì
 *    giáo trình đúng: `sed -i "" 's/a/b/' f` trên GNU sed 4.9 trả
 *    `sed: can't read s/alpha/beta/: No such file or directory`, exit 2, và
 *    file gốc không hề bị sửa. Câu 2 dùng chiều đã đo trên Linux.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CÂU LẬP TRÌNH CHẠY ĐƯỢC TRÊN CẢ HAI ĐỜI BASH
 * ────────────────────────────────────────────────────────────────────────────
 * `scripts/exam-check.mjs` ghép `starterCode` với `sampleSolution` rồi chạy
 * bằng `/bin/bash` CỦA MÁY SOẠN ĐỀ — tức bash 3.2.57 của macOS, kèm coreutils
 * và sed/awk bản BSD. Vì thế lời giải mẫu ở đây tránh hết cú pháp bash 4+
 * (`declare -A`, `${x^^}`, `mapfile`, `|&`) và mọi cờ chỉ GNU mới có
 * (`stat -c`, `sed -i` không đối số, `date -d`, `grep -P`, `readlink -f`,
 * `sort -V`, `find -printf`). Cả hai câu chỉ dùng POSIX + `[[ ]]` + mảng chỉ
 * số + khai triển tham số + `awk`/`sort`/`uniq`/`wc` mức POSIX.
 *
 * Đã đo: cả hai lời giải cho ra output GIỐNG HỆT NHAU trên
 *   • bash 3.2.57(1) — macOS 26.6, BSD userland  (máy chấm)
 *   • bash 5.2.15(1) — Debian 12, GNU userland   (thứ khoá này dạy)
 * `diff` giữa hai lần chạy: rỗng.
 *
 * Hai cái bẫy đã gặp thật khi soạn, và đã né trong lời giải:
 *   • `${clause%%[+-=]*}` — bash 3.2.57 KHÔNG khớp gì cả (dấu `-` ở giữa ngoặc
 *     vuông thành một KHOẢNG), nên phép cắt trả về nguyên chuỗi và câu trả lời
 *     sai âm thầm. Dạng đúng, chạy được ở cả hai đời, là `${clause%%[-+=]*}`
 *     — đặt dấu `-` LÊN ĐẦU thì nó là ký tự nguyên văn.
 *   • `wc -l` của BSD đệm dấu cách ở đầu, GNU thì không ⇒ mọi chỗ lấy số từ
 *     `wc` đều kèm `| tr -d ' '`.
 *
 * Câu 31 (mô phỏng `chmod` dạng ký hiệu ra số hệ tám) còn được đối chiếu với
 * `chmod` THẬT trong container: cả 10 ca đều khớp `stat -c %a` sau khi chạy
 * đúng chuỗi ký hiệu đó bằng chmod của GNU.
 *
 * Câu 32 (mô phỏng phép khai triển glob của shell) cũng được đối chiếu với
 * GLOB THẬT của bash: dựng đúng chín cái tên đó thành file thật trong
 * container rồi để bash tự khai triển tám cái mẫu với `LC_ALL=C`. Kết quả
 * khớp lời giải mẫu từng byte, cả tám dòng — kể cả ca `*.csv` không khớp gì
 * (trả về nguyên văn cái mẫu), ca `.*` (luật dấu chấm đứng đầu), và thứ tự
 * `file1.txt` · `file10.txt` · `file2.txt` (sắp theo chữ cái, không theo số).
 *
 * ⚠️ Câu 32 BAN ĐẦU là một bài "dựng báo cáo từ access log" và đã bị THAY,
 * vì nó gần như trùng nguyên bản với câu Q2 của `LINUX-BASH-PE.mjs`: cùng
 * hàm `report()` đọc log từ stdin qua heredoc, cùng mẹo `input=$(cat)`, cùng
 * `sort -k1,1nr`, cùng khuôn `top=<đường dẫn>(<số lần>)`. Học viên đã làm PE
 * sẽ gặp lại y hệt. Bản thay thế đổi hẳn trục sang chương 2.2 và không đụng
 * tới awk lẫn ống dẫn đếm.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *
 *   node -e "import('./content/exams/LINUX-BASH-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Không trùng câu nào với `LINUX-BASH-FE.mjs` (50 câu) và `LINUX-BASH-PE.mjs`.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/LINUX-BASH-PT1.mjs --apply
 */
import { B, EX, code, c, ptInstructions, mcq, codeQ } from './_lib/linux-bash-exam-kit.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   Câu 31 — mô phỏng chmod dạng ký hiệu (chương 4.2)
   ══════════════════════════════════════════════════════════════════════════ */

const Q31_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'cases=(\n' +
  "  '644 u+x'\n" +
  "  '644 go-w'\n" +
  "  '600 a=r'\n" +
  "  '755 +x'\n" +
  "  '777 o='\n" +
  "  '000 u=rw,g=r,o='\n" +
  "  '644 ug+rw,o-r'\n" +
  "  '751 a-rwx'\n" +
  "  '640 =rx'\n" +
  "  '644 u+x,u+x'\n" +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'apply() {\n' +
  "  echo 'chua cai dat' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for entry in "${cases[@]}"; do\n' +
  '  set -- $entry\n' +
  '  printf \'%s %s -> %s\\n\' "$1" "$2" "$(apply "$1" "$2")"\n' +
  'done\n';

const Q31_SOLUTION =
  'apply() {\n' +
  '  local start=$1 spec=$2\n' +
  '\n' +
  '  # Tách số hệ tám thành ba chữ số: user, group, other.\n' +
  '  local bit\n' +
  '  bit[0]=$(( (start / 100) % 10 ))\n' +
  '  bit[1]=$(( (start / 10) % 10 ))\n' +
  '  bit[2]=$(( start % 10 ))\n' +
  '\n' +
  '  local clause classes op perms i idx v mask\n' +
  '  # IFS đặt local nên chỉ đổi bên trong hàm này.\n' +
  '  local IFS=,\n' +
  '  for clause in $spec; do\n' +
  '    # Dấu - phải đứng ĐẦU trong ngoặc vuông, nếu không nó là một KHOẢNG.\n' +
  '    classes=${clause%%[-+=]*}\n' +
  '    op=${clause:${#classes}:1}\n' +
  '    perms=${clause:$(( ${#classes} + 1 ))}\n' +
  '    [ -z "$classes" ] && classes=a\n' +
  '    [ "$classes" = a ] && classes=ugo\n' +
  '\n' +
  '    mask=0\n' +
  '    case $perms in *r*) mask=$(( mask + 4 ));; esac\n' +
  '    case $perms in *w*) mask=$(( mask + 2 ));; esac\n' +
  '    case $perms in *x*) mask=$(( mask + 1 ));; esac\n' +
  '\n' +
  '    i=0\n' +
  '    while [ "$i" -lt ${#classes} ]; do\n' +
  '      case ${classes:$i:1} in\n' +
  '        u) idx=0 ;;\n' +
  '        g) idx=1 ;;\n' +
  '        o) idx=2 ;;\n' +
  '        *) idx=-1 ;;\n' +
  '      esac\n' +
  '      i=$(( i + 1 ))\n' +
  '      [ "$idx" -lt 0 ] && continue\n' +
  '      v=${bit[$idx]}\n' +
  '      case $op in\n' +
  "        '+') bit[$idx]=$(( v | mask )) ;;\n" +
  "        '-') bit[$idx]=$(( v & ~mask & 7 )) ;;\n" +
  "        '=') bit[$idx]=$mask ;;\n" +
  '      esac\n' +
  '    done\n' +
  '  done\n' +
  '\n' +
  "  printf '%d%d%d\\n' \"${bit[0]}\" \"${bit[1]}\" \"${bit[2]}\"\n" +
  '}\n';

const Q31_OUTPUT =
  '644 u+x -> 744\n' +
  '644 go-w -> 644\n' +
  '600 a=r -> 444\n' +
  '755 +x -> 755\n' +
  '777 o= -> 770\n' +
  '000 u=rw,g=r,o= -> 640\n' +
  '644 ug+rw,o-r -> 660\n' +
  '751 a-rwx -> 000\n' +
  '640 =rx -> 555\n' +
  '644 u+x,u+x -> 744';

/* ══════════════════════════════════════════════════════════════════════════
   Câu 32 — mô phỏng phép khai triển glob của shell (chương 2.2)
   ══════════════════════════════════════════════════════════════════════════ */

const Q32_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'entries=(\n' +
  "  'file2.txt'\n" +
  "  '.env'\n" +
  "  'My Report.pdf'\n" +
  "  'app.js'\n" +
  "  'file10.txt'\n" +
  "  '.gitignore'\n" +
  "  'file1.txt'\n" +
  "  'README.md'\n" +
  "  '-rf'\n" +
  ')\n' +
  '\n' +
  'patterns=(\n' +
  "  '*.txt'\n" +
  "  '*.csv'\n" +
  "  'file?.txt'\n" +
  "  'file[0-9].txt'\n" +
  "  '.*'\n" +
  "  '*'\n" +
  "  '[!f]*'\n" +
  "  '*.[a-z][a-z]'\n" +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'expand() {\n' +
  "  echo 'chua cai dat' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for pat in "${patterns[@]}"; do\n' +
  '  expand "$pat" "${entries[@]}"\n' +
  'done\n';

const Q32_SOLUTION =
  'expand() {\n' +
  '  local pattern=$1\n' +
  '  shift\n' +
  '\n' +
  '  local name out\n' +
  '  local matches\n' +
  '  matches=()\n' +
  '\n' +
  '  for name in "$@"; do\n' +
  "    # Luật dấu chấm: một glob KHÔNG khớp tên bắt đầu bằng '.',\n" +
  '    # trừ khi chính cái mẫu cũng bắt đầu bằng một dấu chấm nguyên văn.\n' +
  '    case $name in\n' +
  '      .*)\n' +
  '        case $pattern in\n' +
  '          .*) ;;\n' +
  '          *) continue ;;\n' +
  '        esac\n' +
  '        ;;\n' +
  '    esac\n' +
  '\n' +
  '    # $pattern để TRẦN nên case đối chiếu nó như một MẪU, không phải chuỗi.\n' +
  '    case $name in\n' +
  '      $pattern) matches[${#matches[@]}]=$name ;;\n' +
  '    esac\n' +
  '  done\n' +
  '\n' +
  '  # nullglob tắt: mẫu không khớp gì đi qua nguyên văn, thành MỘT tham số.\n' +
  '  if [ ${#matches[@]} -eq 0 ]; then\n' +
  '    matches=("$pattern")\n' +
  '  fi\n' +
  '\n' +
  '  # Shell trả kết quả đã SẮP. LC_ALL=C để so theo byte, giống nhau mọi máy.\n' +
  '  out=$(printf \'%s\\n\' "${matches[@]}" | LC_ALL=C sort | sed -e \'s/^/[/\' -e \'s/$/]/\' | tr \'\\n\' \' \')\n' +
  '  printf \'%s -> %s\\n\' "$pattern" "${out% }"\n' +
  '}\n';

const Q32_OUTPUT =
  '*.txt -> [file1.txt] [file10.txt] [file2.txt]\n' +
  '*.csv -> [*.csv]\n' +
  'file?.txt -> [file1.txt] [file2.txt]\n' +
  'file[0-9].txt -> [file1.txt] [file2.txt]\n' +
  '.* -> [.env] [.gitignore]\n' +
  '* -> [-rf] [My Report.pdf] [README.md] [app.js] [file1.txt] [file10.txt] [file2.txt]\n' +
  '[!f]* -> [-rf] [My Report.pdf] [README.md] [app.js]\n' +
  '*.[a-z][a-z] -> [README.md] [app.js]';

export default {
  course: { slug: 'linux-bash' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Sections 0–4 (the shell, the filesystem, files, text and pipes, permissions)',
        'Kiểm tra tiến độ 1 — Mục 0–4 (shell, hệ thống file, file, văn bản và ống dẫn, quyền)',
      ),
      description: B(
        'The first third of the Linux & Bash course: what a shell actually is, paths and the directory tree, creating and finding files, globs and find, the three standard streams, pipes, grep, sed and awk, and the permission model up to setuid, setgid and the sticky bit. 30 multiple-choice questions plus 2 scripting questions you write here in the exam room.',
        'Một phần ba đầu của khoá Linux & Bash: shell thật ra là gì, đường dẫn và cây thư mục, tạo và tìm file, glob và find, ba dòng chuẩn, ống dẫn, grep, sed và awk, và mô hình quyền cho tới setuid, setgid và bit dính. 30 câu trắc nghiệm và 2 câu viết script làm ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Mục 0 — Giới thiệu, shell là gì, cài đặt, cách học ───────────
        mcq({
          prompt: B(
            'Real run on Debian 12. Why do the two commands disagree about the size of the same file?' + code(
              '$ ls -l /proc/meminfo\n' +
              '-r--r--r-- 1 root root 0 Sep 10 00:05 /proc/meminfo\n' +
              '$ wc -c < /proc/meminfo\n' +
              '1392\n' +
              '$ head -1 /proc/meminfo\n' +
              'MemTotal:        8126480 kB',
            ),
            'Chạy thật trên Debian 12. Vì sao hai lệnh lại bất đồng về kích thước của cùng một file?' + code(
              '$ ls -l /proc/meminfo\n' +
              '-r--r--r-- 1 root root 0 Sep 10 00:05 /proc/meminfo\n' +
              '$ wc -c < /proc/meminfo\n' +
              '1392\n' +
              '$ head -1 /proc/meminfo\n' +
              'MemTotal:        8126480 kB',
            ),
          ),
          options: [
            B(
              'Nothing under <code>/proc</code> exists on disk: the kernel generates the content at the moment you read it, so there is no stored length for <code>ls</code> to report and it prints 0, while <code>wc</code> counts the bytes actually produced',
              'Không thứ gì dưới <code>/proc</code> nằm trên đĩa: kernel sinh ra nội dung ngay lúc bạn đọc, nên không có độ dài nào được lưu để <code>ls</code> báo và nó in 0, còn <code>wc</code> đếm đúng số byte thật sự được sinh ra',
            ),
            B(
              'The file is compressed on disk, so <code>ls -l</code> reports the compressed size (which rounds to 0 for a file this small) while <code>wc -c</code> reports the size after the kernel has transparently decompressed it for the reader',
              'File được nén trên đĩa, nên <code>ls -l</code> báo kích thước sau nén (làm tròn thành 0 với một file nhỏ như thế này) còn <code>wc -c</code> báo kích thước sau khi kernel đã âm thầm giải nén cho người đọc',
            ),
            B(
              '<code>ls -l</code> is showing a stale cached value because the file was written after the directory entry was last updated; running <code>sync</code> then <code>ls -l</code> again would print 1392 like <code>wc</code> does',
              '<code>ls -l</code> đang hiện một giá trị cũ trong bộ nhớ đệm vì file được ghi sau lần cập nhật mục thư mục gần nhất; chạy <code>sync</code> rồi <code>ls -l</code> lại sẽ in 1392 y như <code>wc</code>',
            ),
            B(
              'The redirection <code>&lt;</code> makes <code>wc</code> read the file twice — once for the shell to open it and once for <code>wc</code> itself — so 1392 is a double count and the real size really is 0 bytes',
              'Phép chuyển hướng <code>&lt;</code> khiến <code>wc</code> đọc file hai lần — một lần để shell mở nó và một lần cho chính <code>wc</code> — nên 1392 là số đếm nhân đôi và kích thước thật đúng là 0 byte',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on the lab container. <code>/proc</code> is the kernel presenting itself through the file interface (lesson 0.2): the entries have no blocks on any disk, so the stored size is 0, and the content is manufactured by the kernel each time a process reads. The same is true of <code>/sys</code> and of <code>/proc/&lt;pid&gt;/</code>. This is exactly why <code>cat</code>, <code>grep</code> and <code>head</code> work on kernel state at all — "everything is a file" means the same tools reach everything.',
            'Đo thật trong container thí nghiệm. <code>/proc</code> là kernel tự phơi mình ra qua giao diện file (bài 0.2): các mục ở đó không chiếm khối nào trên đĩa nào cả, nên kích thước lưu trữ là 0, còn nội dung thì được kernel chế ra mỗi lần có tiến trình đọc. <code>/sys</code> và <code>/proc/&lt;pid&gt;/</code> cũng vậy. Đây chính là lý do <code>cat</code>, <code>grep</code> và <code>head</code> dùng được trên trạng thái kernel — "mọi thứ là một file" nghĩa là cùng một bộ công cụ với tới được mọi thứ.',
          ),
        }),

        mcq({
          prompt: B(
            'A teammate wrote this line on a Mac and it worked there. Run for real on Debian 12 with GNU sed 4.9, this is the exact result:' + code(
              '$ cat f.txt\n' +
              'alpha\n' +
              "$ sed -i '' 's/alpha/beta/' f.txt\n" +
              "sed: can't read s/alpha/beta/: No such file or directory\n" +
              '$ echo $?\n' +
              '2\n' +
              '$ cat f.txt\n' +
              'alpha',
            ) + 'What did GNU sed do with the empty argument?',
            'Một đồng nghiệp viết dòng này trên máy Mac và ở đó nó chạy được. Chạy thật trên Debian 12 với GNU sed 4.9, đây là kết quả nguyên văn:' + code(
              '$ cat f.txt\n' +
              'alpha\n' +
              "$ sed -i '' 's/alpha/beta/' f.txt\n" +
              "sed: can't read s/alpha/beta/: No such file or directory\n" +
              '$ echo $?\n' +
              '2\n' +
              '$ cat f.txt\n' +
              'alpha',
            ) + 'GNU sed đã làm gì với cái đối số rỗng đó?',
          ),
          options: [
            B(
              'GNU sed rejected the empty string as an invalid backup suffix and refused to start, which is why the exit status is 2 and why nothing at all was read or written on this invocation',
              'GNU sed từ chối chuỗi rỗng vì đó là hậu tố sao lưu không hợp lệ nên nó không khởi động, đó là lý do mã thoát là 2 và lý do lần gọi này không hề đọc hay ghi gì cả',
            ),
            B(
              'GNU sed treated <code>-i</code> and the empty string as a request to edit in place with no backup, then failed only because <code>f.txt</code> was already open for writing by the shell redirection that <code>-i</code> sets up internally',
              'GNU sed hiểu <code>-i</code> cùng chuỗi rỗng là yêu cầu sửa tại chỗ không sao lưu, rồi hỏng chỉ vì <code>f.txt</code> đã bị mở để ghi bởi phép chuyển hướng mà <code>-i</code> tự dựng bên trong',
            ),
            B(
              'On GNU sed the backup suffix must be glued to the flag (<code>-i.bak</code>), so the empty string became the <em>script</em>, <code>s/alpha/beta/</code> became a filename it could not open, and <code>f.txt</code> was processed by an empty script — left byte for byte unchanged',
              'Với GNU sed, hậu tố sao lưu phải dính liền vào cờ (<code>-i.bak</code>), nên chuỗi rỗng trở thành <em>chương trình sed</em>, còn <code>s/alpha/beta/</code> thành một tên file mà nó không mở được, và <code>f.txt</code> bị xử lý bởi một chương trình rỗng — giữ nguyên từng byte',
            ),
            B(
              'GNU sed silently created a backup file named <code>s/alpha/beta/</code> in the current directory and then could not reopen it, leaving the original untouched but the directory polluted with a stray backup',
              'GNU sed âm thầm tạo một file sao lưu tên <code>s/alpha/beta/</code> trong thư mục hiện tại rồi không mở lại được nó, để bản gốc nguyên vẹn nhưng làm bẩn thư mục bằng một file sao lưu lạc lõng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on both machines. GNU <code>-i</code> takes its suffix <em>attached</em> — <code>-i.bak</code> — so a separate <code>&#39;&#39;</code> is just the next argument, which sed reads as the script. The script is empty, so <code>f.txt</code> is rewritten identically; <code>s/alpha/beta/</code> is then treated as a second input file and cannot be opened, giving exit 2. The reverse is measured too: on macOS <code>sed -i &#39;s/alpha/beta/&#39; f.txt</code> does <b>not</b> quietly leave a backup — it fails loudly with <code>sed: 1: &quot;f.txt\\n&quot;: invalid command code f</code> and exit 1, because BSD sed took the expression as the suffix and <code>f.txt</code> as the script. Portable answer: <code>perl -pi -e &#39;s/a/b/&#39; f</code>.',
            'Đã đo trên cả hai máy. Cờ <code>-i</code> của GNU nhận hậu tố DÍNH LIỀN — <code>-i.bak</code> — nên một dấu <code>&#39;&#39;</code> tách rời chỉ là đối số kế tiếp, và sed đọc nó như chương trình. Chương trình rỗng nên <code>f.txt</code> được ghi lại y hệt; còn <code>s/alpha/beta/</code> bị coi là file đầu vào thứ hai và không mở được, cho mã thoát 2. Chiều ngược lại cũng đã đo: trên macOS, <code>sed -i &#39;s/alpha/beta/&#39; f.txt</code> KHÔNG lặng lẽ để lại file sao lưu — nó hỏng ồn ào với <code>sed: 1: &quot;f.txt\\n&quot;: invalid command code f</code> và mã thoát 1, vì BSD sed lấy biểu thức làm hậu tố còn <code>f.txt</code> làm chương trình. Câu trả lời chạy được ở mọi nơi: <code>perl -pi -e &#39;s/a/b/&#39; f</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'You run <code>man tar</code>. The screen fills with text and the bottom line shows a single colon. Keys do nothing useful and the terminal seems frozen. What is happening?',
            'Bạn chạy <code>man tar</code>. Màn hình đầy chữ và dòng dưới cùng hiện đúng một dấu hai chấm. Gõ phím thì chẳng thấy gì hữu ích và terminal như bị treo. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The manual page is larger than the terminal scrollback buffer, so the pager has stalled waiting for memory; resize the window or set <code>MANWIDTH</code> to let it finish rendering the page',
              'Trang tài liệu lớn hơn vùng nhớ cuộn của terminal nên bộ phân trang khựng lại chờ bộ nhớ; hãy đổi kích thước cửa sổ hoặc đặt <code>MANWIDTH</code> để nó dựng xong trang',
            ),
            B(
              'Nothing is frozen: <code>man</code> is showing the page through the pager <code>less</code>, and the colon is its prompt waiting for you. Press <kbd>q</kbd> to quit, <kbd>/</kbd> to search, <kbd>n</kbd> for the next match',
              'Không có gì treo cả: <code>man</code> đang hiện trang qua bộ phân trang <code>less</code>, và dấu hai chấm là dấu nhắc của nó đang chờ bạn. Bấm <kbd>q</kbd> để thoát, <kbd>/</kbd> để tìm, <kbd>n</kbd> để tới chỗ khớp kế tiếp',
            ),
            B(
              'The <code>man</code> process is blocked reading from stdin because it was started without a controlling terminal; press <kbd>Ctrl-D</kbd> to send end-of-input, which is the only way to release it cleanly',
              'Tiến trình <code>man</code> đang kẹt vì đọc stdin trong khi nó khởi động mà không có terminal điều khiển; bấm <kbd>Ctrl-D</kbd> để gửi dấu hết đầu vào, đó là cách duy nhất giải phóng nó sạch sẽ',
            ),
            B(
              'The colon means the manual database is being rebuilt in the background by <code>mandb</code>; the page will appear on its own once indexing finishes, and interrupting it corrupts the index',
              'Dấu hai chấm nghĩa là cơ sở dữ liệu tài liệu đang được <code>mandb</code> dựng lại ở nền; trang sẽ tự hiện ra khi lập chỉ mục xong, và cắt ngang sẽ làm hỏng chỉ mục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 0.4. <code>man</code> does not draw anything itself — it hands the formatted page to a pager, normally <code>less</code>, and the lone colon is that pager\'s prompt. The same keys therefore work everywhere a page of text appears: <code>git log</code>, <code>systemctl status</code>, <code>journalctl</code>. Knowing that <kbd>q</kbd> quits and <kbd>/</kbd> searches turns "the terminal is stuck" into a non-event, and it is the reason the lesson lists escape routes (<kbd>Ctrl-C</kbd>, <kbd>Ctrl-D</kbd>, <kbd>q</kbd>, <kbd>:q!</kbd>) before it lists any command.',
            'Bài 0.4. <code>man</code> không tự vẽ gì cả — nó giao trang đã định dạng cho một bộ phân trang, thường là <code>less</code>, và dấu hai chấm trơ trọi kia là dấu nhắc của bộ phân trang ấy. Vì thế đúng những phím đó dùng được ở mọi chỗ hiện ra một trang chữ: <code>git log</code>, <code>systemctl status</code>, <code>journalctl</code>. Biết <kbd>q</kbd> để thoát và <kbd>/</kbd> để tìm là biến "terminal bị kẹt" thành chuyện không có gì, và đó là lý do bài học liệt kê các lối thoát (<kbd>Ctrl-C</kbd>, <kbd>Ctrl-D</kbd>, <kbd>q</kbd>, <kbd>:q!</kbd>) trước khi liệt kê bất kỳ câu lệnh nào.',
          ),
        }),

        // ── Chương 1 — Shell & hệ thống file ────────────────────────────
        mcq({
          prompt: B(
            'Real run in a directory holding <code>app.js</code>, <code>README.md</code>, <code>.env</code>, <code>.gitignore</code> and three subdirectories. Output shown one name per line because it was captured to a pipe:' + code(
              '$ ls -a\n' +
              '.\n..\n.env\n.gitignore\nREADME.md\napp.js\nsub1\nsub2\nsub3\n' +
              '$ ls -A\n' +
              '.env\n.gitignore\nREADME.md\napp.js\nsub1\nsub2\nsub3',
            ) + 'What exactly does <code>-A</code> do that <code>-a</code> does not?',
            'Chạy thật trong một thư mục chứa <code>app.js</code>, <code>README.md</code>, <code>.env</code>, <code>.gitignore</code> và ba thư mục con. Kết quả hiện mỗi tên một dòng vì được hứng vào một ống dẫn:' + code(
              '$ ls -a\n' +
              '.\n..\n.env\n.gitignore\nREADME.md\napp.js\nsub1\nsub2\nsub3\n' +
              '$ ls -A\n' +
              '.env\n.gitignore\nREADME.md\napp.js\nsub1\nsub2\nsub3',
            ) + '<code>-A</code> làm gì mà <code>-a</code> không làm?',
          ),
          options: [
            B(
              '<code>-A</code> shows only the entries that a plain <code>ls</code> would hide, so it is the complement of <code>ls</code> rather than a variant of <code>ls -a</code>, and combining it with <code>-a</code> would list everything twice',
              '<code>-A</code> chỉ hiện những mục mà <code>ls</code> trơ trọi giấu đi, nên nó là phần bù của <code>ls</code> chứ không phải một biến thể của <code>ls -a</code>, và ghép nó với <code>-a</code> sẽ liệt kê mọi thứ hai lần',
            ),
            B(
              '<code>-A</code> lists every entry including the hidden ones, exactly like <code>-a</code>, but leaves out the two entries <code>.</code> and <code>..</code> — which are not files you created, just the directory\'s own reference to itself and to its parent',
              '<code>-A</code> liệt kê mọi mục kể cả mục ẩn, y hệt <code>-a</code>, nhưng bỏ hai mục <code>.</code> và <code>..</code> — vốn không phải file do bạn tạo, chỉ là tham chiếu của chính thư mục tới nó và tới thư mục cha',
            ),
            B(
              '<code>-A</code> sorts hidden entries before visible ones so that configuration is easy to spot, while <code>-a</code> uses one flat alphabetical order in which dotfiles are scattered among the ordinary names',
              '<code>-A</code> xếp các mục ẩn lên trước các mục hiện để dễ nhìn ra phần cấu hình, còn <code>-a</code> dùng một thứ tự chữ cái phẳng khiến file ẩn nằm rải rác giữa các tên thường',
            ),
            B(
              '<code>-A</code> follows symbolic links to directories and lists their contents inline, whereas <code>-a</code> stops at the link itself and shows only its name and target',
              '<code>-A</code> đi theo liên kết tượng trưng trỏ tới thư mục và liệt kê nội dung của chúng ngay tại chỗ, còn <code>-a</code> dừng ở chính cái liên kết và chỉ hiện tên cùng đích của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. "Hidden" is nothing more than a naming convention: <code>ls</code> skips names beginning with a dot, and <code>-a</code> stops skipping them. <code>-A</code> is <code>-a</code> minus the two entries every directory always has. That makes <code>-A</code> the flag you want when the answer will be fed to another command, because <code>.</code> and <code>..</code> would otherwise send it walking upward. Lesson 1.1 also names the real cost of forgetting it: a directory that looks empty can still hold <code>.env</code>, <code>.git</code> and <code>.ssh</code>.',
            'Đã đo. "File ẩn" chẳng qua là một quy ước đặt tên: <code>ls</code> bỏ qua những tên bắt đầu bằng dấu chấm, và <code>-a</code> thôi bỏ qua chúng. <code>-A</code> chính là <code>-a</code> trừ đi hai mục mà thư mục nào cũng luôn có. Vì thế <code>-A</code> mới là cờ bạn cần khi kết quả sẽ được đưa cho một lệnh khác, vì <code>.</code> và <code>..</code> sẽ khiến lệnh đó đi ngược lên trên. Bài 1.1 cũng nêu cái giá thật của việc quên nó: một thư mục nhìn có vẻ rỗng vẫn có thể đang chứa <code>.env</code>, <code>.git</code> và <code>.ssh</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on Linux, in a directory that contains one subdirectory whose name is <code>My Documents</code>:' + code(
              '$ cd My Documents\n' +
              'bash: cd: too many arguments\n' +
              '$ echo $?\n' +
              '1',
            ) + 'Why does <code>cd</code> report <em>too many</em> arguments rather than "no such file"?',
            'Chạy thật trên Linux, trong một thư mục có đúng một thư mục con tên là <code>My Documents</code>:' + code(
              '$ cd My Documents\n' +
              'bash: cd: too many arguments\n' +
              '$ echo $?\n' +
              '1',
            ) + 'Vì sao <code>cd</code> báo QUÁ NHIỀU tham số chứ không phải "không có file nào như thế"?',
          ),
          options: [
            B(
              'Because <code>cd</code> refuses any path containing a space as a matter of policy, and reports the refusal as an argument-count error rather than adding a separate message for it',
              'Vì <code>cd</code> theo chính sách từ chối mọi đường dẫn có dấu cách, và báo sự từ chối đó dưới dạng lỗi đếm tham số thay vì thêm một thông báo riêng',
            ),
            B(
              'Because the directory name is stored with an escape character on disk, so the name the shell sends and the name the filesystem holds differ by one byte and <code>cd</code> counts them as two candidates',
              'Vì tên thư mục được lưu kèm một ký tự thoát trên đĩa, nên cái tên shell gửi đi và cái tên hệ thống file đang giữ lệch nhau một byte và <code>cd</code> đếm chúng thành hai ứng viên',
            ),
            B(
              'Because <code>cd</code> is a shell builtin rather than a program in <code>/usr/bin</code>, and builtins receive the raw unsplit line, which this one rejects whenever it contains whitespace',
              'Vì <code>cd</code> là lệnh dựng sẵn của shell chứ không phải chương trình trong <code>/usr/bin</code>, và lệnh dựng sẵn nhận nguyên dòng chưa cắt, thứ mà nó từ chối mỗi khi có khoảng trắng',
            ),
            B(
              'Because the shell splits the line on whitespace <em>before</em> <code>cd</code> runs, so <code>cd</code> is handed two separate arguments, <code>My</code> and <code>Documents</code>. Quote it — <code>cd "My Documents"</code> — and it is one argument again',
              'Vì shell cắt dòng lệnh theo khoảng trắng TRƯỚC khi <code>cd</code> chạy, nên <code>cd</code> nhận được hai tham số tách rời là <code>My</code> và <code>Documents</code>. Bọc nháy — <code>cd "My Documents"</code> — thì nó lại là một tham số',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured; <code>cd "My Documents"</code> immediately afterwards succeeded and <code>pwd</code> printed the full path with the space in it. This is the shell\'s word splitting, which happens to every command line before any program starts (lesson 0.2, step 2). The program never sees your spacing decisions, only the resulting list of arguments — which is why the error names a count rather than a path, and why the fix is quoting rather than anything to do with <code>cd</code>.',
            'Đã đo; chạy <code>cd "My Documents"</code> ngay sau đó thì thành công và <code>pwd</code> in ra đường dẫn đầy đủ có chứa dấu cách. Đây là phép cắt từ của shell, thứ xảy ra với mọi dòng lệnh trước khi bất kỳ chương trình nào khởi động (bài 0.2, bước 2). Chương trình không bao giờ nhìn thấy cách bạn đặt dấu cách, nó chỉ thấy danh sách tham số thu được — nên thông báo lỗi mới nói về số lượng chứ không nói về đường dẫn, và cách sửa là bọc nháy chứ không liên quan gì tới <code>cd</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run, with <code>HOME=/root</code>. Explain the three results:' + code(
              '$ echo ~\n' +
              '/root\n' +
              '$ echo "~"\n' +
              '~\n' +
              "$ echo '~'\n" +
              '~',
            ),
            'Chạy thật, với <code>HOME=/root</code>. Hãy giải thích ba kết quả:' + code(
              '$ echo ~\n' +
              '/root\n' +
              '$ echo "~"\n' +
              '~\n' +
              "$ echo '~'\n" +
              '~',
            ),
          ),
          options: [
            B(
              '<code>echo</code> expands <code>~</code> itself by looking up the current user, and skips the expansion when it sees quote characters left over in the argument it was given',
              '<code>echo</code> tự khai triển <code>~</code> bằng cách tra người dùng hiện tại, và bỏ qua việc khai triển khi thấy dấu nháy còn sót lại trong tham số nó nhận được',
            ),
            B(
              'Single quotes suppress every expansion while double quotes suppress none, so the second line is a bug in this build of bash and normally prints <code>/root</code> like the first one',
              'Nháy đơn chặn mọi phép khai triển còn nháy kép thì không chặn gì, nên dòng thứ hai là lỗi của bản bash này và bình thường nó in <code>/root</code> giống dòng đầu',
            ),
            B(
              'Tilde expansion is done by the <em>shell</em>, and it only applies to an unquoted tilde. Both quoting styles stop it here, so <code>echo</code> receives the literal one-character string in the second and third cases',
              'Phép khai triển dấu ngã do CHÍNH SHELL làm, và nó chỉ áp dụng cho dấu ngã không bọc nháy. Cả hai kiểu nháy đều chặn nó ở đây, nên <code>echo</code> nhận đúng chuỗi một ký tự nguyên văn ở trường hợp thứ hai và thứ ba',
            ),
            B(
              'The difference is the value of <code>HOME</code>: it is exported for the unquoted case but the quotes create a subshell with a cleared environment, so <code>~</code> has nothing to expand to and falls back to itself',
              'Khác biệt nằm ở giá trị của <code>HOME</code>: nó được export trong trường hợp không nháy, còn dấu nháy tạo ra một shell con với môi trường bị xoá sạch nên <code>~</code> không có gì để khai triển thành và rơi về chính nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on bash 5.2.15. Lesson 1.2 uses exactly this pair to prove that <code>~</code> is a shell feature rather than something <code>echo</code> understands — and the same demonstration works for <code>*</code> (chapter 2) and <code>$VAR</code> (chapter 6). Note the detail people get wrong: <b>double</b> quotes stop tilde expansion too. They keep variable and command substitution alive, but the tilde is not in that set, so <code>cd "~/projects"</code> looks reasonable and fails.',
            'Đo thật trên bash 5.2.15. Bài 1.2 dùng đúng cặp lệnh này để chứng minh <code>~</code> là tính năng của shell chứ không phải thứ <code>echo</code> hiểu được — và cùng phép chứng minh đó áp dụng cho <code>*</code> (chương 2) lẫn <code>$VAR</code> (chương 6). Lưu ý chi tiết mà người ta hay nhầm: nháy KÉP cũng chặn khai triển dấu ngã. Nó giữ lại phép thay thế biến và thay thế lệnh, nhưng dấu ngã không nằm trong nhóm đó, nên <code>cd "~/projects"</code> nhìn thì hợp lý mà chạy thì hỏng.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on Debian 12:' + code(
              '$ ls -ld /bin /sbin /lib\n' +
              'lrwxrwxrwx 1 root root 7 Aug 24 00:00 /bin -> usr/bin\n' +
              'lrwxrwxrwx 1 root root 8 Aug 24 00:00 /sbin -> usr/sbin\n' +
              'lrwxrwxrwx 1 root root 7 Aug 24 00:00 /lib -> usr/lib',
            ) + 'Given this layout, where should you install a script of your own, and why?',
            'Chạy thật trên Debian 12:' + code(
              '$ ls -ld /bin /sbin /lib\n' +
              'lrwxrwxrwx 1 root root 7 Aug 24 00:00 /bin -> usr/bin\n' +
              'lrwxrwxrwx 1 root root 8 Aug 24 00:00 /sbin -> usr/sbin\n' +
              'lrwxrwxrwx 1 root root 7 Aug 24 00:00 /lib -> usr/lib',
            ) + 'Với bố cục này, bạn nên cài script của mình vào đâu, và vì sao?',
          ),
          options: [
            B(
              '<code>/usr/local/bin</code> — it is already in <code>PATH</code> on every distribution and the package manager never writes there, so no upgrade can overwrite or delete what you put in it',
              '<code>/usr/local/bin</code> — nó vốn đã nằm trong <code>PATH</code> ở mọi bản phân phối và trình quản lý gói không bao giờ ghi vào đó, nên không lần nâng cấp nào ghi đè hay xoá mất thứ bạn đặt vào',
            ),
            B(
              '<code>/bin</code> — because it is only a symlink these days, writing there is really writing to <code>/usr/bin</code>, which is the directory the shell searches first and therefore the fastest to resolve',
              '<code>/bin</code> — vì thời nay nó chỉ là một liên kết tượng trưng, ghi vào đó thực chất là ghi vào <code>/usr/bin</code>, nơi shell tìm đầu tiên nên phân giải nhanh nhất',
            ),
            B(
              '<code>/opt</code> — the standard location for anything not managed by the package manager, including single scripts, and it is added to <code>PATH</code> automatically by the login shell on Debian',
              '<code>/opt</code> — vị trí chuẩn cho mọi thứ không do trình quản lý gói quản lý, kể cả script lẻ, và nó được shell đăng nhập của Debian tự thêm vào <code>PATH</code>',
            ),
            B(
              '<code>/sbin</code> — it is reserved for locally added administrative commands, which is what a deploy or maintenance script is, and its symlink target inherits root-only permissions automatically',
              '<code>/sbin</code> — nó dành riêng cho các lệnh quản trị thêm vào tại chỗ, đúng loại của một script deploy hay bảo trì, và đích liên kết của nó tự thừa kế quyền chỉ-root',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on the lab container: on Debian 12 the three historical directories are symlinks into <code>/usr</code>, so <code>/bin</code> and <code>/usr/bin</code> are one place. That place belongs to the package manager, which will happily replace or remove a file you dropped in during an upgrade, without a warning — the trap lesson 1.3 names. <code>/usr/local</code> exists precisely so that locally installed software has somewhere the package manager never touches; <code>/opt</code> is for large third-party trees that ship their own directory, not for single scripts.',
            'Đo thật trong container: trên Debian 12, ba thư mục lịch sử ấy là liên kết tượng trưng trỏ vào <code>/usr</code>, nên <code>/bin</code> và <code>/usr/bin</code> là cùng một chỗ. Chỗ đó thuộc về trình quản lý gói, và nó sẽ vui vẻ thay hoặc gỡ mất file bạn thả vào trong một lần nâng cấp, không hề cảnh báo — đúng cái bẫy bài 1.3 nêu tên. <code>/usr/local</code> sinh ra chính là để phần mềm cài tại chỗ có một nơi mà trình quản lý gói không bao giờ đụng tới; còn <code>/opt</code> dành cho các cây thư mục lớn của bên thứ ba mang theo thư mục riêng, không dành cho script lẻ.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. <code>proj</code> contains four files and exactly three subdirectories; <code>empty</code> contains nothing at all:' + code(
              '$ ls -ld proj empty\n' +
              'drwxr-xr-x 5 root root 4096 Sep 10 00:11 proj\n' +
              'drwxr-xr-x 2 root root 4096 Sep 10 00:11 empty',
            ) + 'The third column is the link count. Why 5 and 2, and why do the four files not affect it?',
            'Chạy thật. <code>proj</code> chứa bốn file và đúng ba thư mục con; <code>empty</code> thì không chứa gì cả:' + code(
              '$ ls -ld proj empty\n' +
              'drwxr-xr-x 5 root root 4096 Sep 10 00:11 proj\n' +
              'drwxr-xr-x 2 root root 4096 Sep 10 00:11 empty',
            ) + 'Cột thứ ba là số liên kết. Vì sao là 5 và 2, và vì sao bốn file kia không ảnh hưởng tới nó?',
          ),
          options: [
            B(
              'The count is the number of blocks the listing occupies, so it grows only when the directory needs another 4 KB block — files are small entries and three subdirectories happened to cross the boundary',
              'Con số đó là số khối mà danh sách chiếm, nên nó chỉ tăng khi thư mục cần thêm một khối 4 KB — file là các mục nhỏ và ba thư mục con vừa hay làm nó vượt ranh giới',
            ),
            B(
              'It counts names pointing at this directory\'s inode: its own entry in the parent, its own <code>.</code>, and one <code>..</code> from each subdirectory — so it is 2 plus the number of subdirectories, and plain files contribute nothing',
              'Nó đếm số cái tên trỏ vào inode của thư mục này: mục của chính nó trong thư mục cha, dấu <code>.</code> của chính nó, và một dấu <code>..</code> từ mỗi thư mục con — nên nó bằng 2 cộng số thư mục con, còn file thường không đóng góp gì',
            ),
            B(
              'It is the number of entries the directory can hold before it must be rehashed; an empty directory starts at 2 and each subdirectory reserves one more slot, while files reuse existing slots',
              'Đó là số mục thư mục có thể chứa trước khi phải băm lại; thư mục rỗng bắt đầu ở 2 và mỗi thư mục con giữ chỗ thêm một ô, còn file thì dùng lại các ô sẵn có',
            ),
            B(
              'It is the depth of the directory within the filesystem tree, counted from the mount point, which is why a directory holding subdirectories reports a larger number than an empty one',
              'Đó là độ sâu của thư mục trong cây hệ thống file, tính từ điểm gắn kết, nên thư mục có chứa thư mục con báo số lớn hơn thư mục rỗng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. Lesson 1.4 states the rule — for a directory the link count is 2 + the number of subdirectories — and this run shows both ends of it: an empty directory is 2, and adding three subdirectories makes it 5. The reason is the inode model from lesson 2.4: a name is a link, and each subdirectory\'s <code>..</code> is a real link back to its parent. It is a genuinely useful reading: <code>ls -ld</code> tells you how many subdirectories are inside without listing anything, which matters on a directory holding a hundred thousand files.',
            'Đã đo. Bài 1.4 nêu quy tắc — với thư mục thì số liên kết bằng 2 cộng số thư mục con — và lần chạy này cho thấy cả hai đầu của nó: thư mục rỗng là 2, thêm ba thư mục con thành 5. Lý do nằm ở mô hình inode của bài 2.4: một cái tên là một liên kết, và dấu <code>..</code> trong mỗi thư mục con là một liên kết thật trỏ ngược về cha. Đây là cách đọc thật sự hữu ích: <code>ls -ld</code> cho biết bên trong có bao nhiêu thư mục con mà không cần liệt kê gì, điều đáng giá với một thư mục chứa trăm nghìn file.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. Three files were created with deliberately misleading names:' + code(
              '$ file logo.txt notes.pdf archive.zip\n' +
              'logo.txt:    PNG image data, 16 x 16, 8-bit/color RGBA, non-interlaced\n' +
              'notes.pdf:   Bourne-Again shell script, ASCII text executable\n' +
              'archive.zip: ASCII text',
            ) + 'What is <code>file</code> actually doing?',
            'Chạy thật. Ba file được tạo với những cái tên cố tình gây hiểu nhầm:' + code(
              '$ file logo.txt notes.pdf archive.zip\n' +
              'logo.txt:    PNG image data, 16 x 16, 8-bit/color RGBA, non-interlaced\n' +
              'notes.pdf:   Bourne-Again shell script, ASCII text executable\n' +
              'archive.zip: ASCII text',
            ) + '<code>file</code> thật ra đang làm gì?',
          ),
          options: [
            B(
              'Reading an extended attribute that the creating program stored on the inode, which is why the answers disagree with the names — the attribute survives a rename while the name does not',
              'Đọc một thuộc tính mở rộng mà chương trình tạo file đã lưu trên inode, nên câu trả lời mới lệch với cái tên — thuộc tính đó sống sót qua một lần đổi tên còn cái tên thì không',
            ),
            B(
              'Consulting <code>/etc/mime.types</code>, a system table mapping extensions to formats, and reporting a mismatch whenever the table entry disagrees with the bytes it samples',
              'Tra <code>/etc/mime.types</code>, một bảng hệ thống ánh xạ phần mở rộng sang định dạng, và báo có sai lệch mỗi khi mục trong bảng bất đồng với các byte nó lấy mẫu',
            ),
            B(
              'Reading the beginning of each file and identifying it by content, because on Linux the extension is a convention for humans and the kernel enforces nothing about it',
              'Đọc phần đầu của từng file và nhận dạng nó theo NỘI DUNG, vì trên Linux phần mở rộng chỉ là quy ước cho con người và kernel không hề ràng buộc gì về nó',
            ),
            B(
              'Asking the filesystem for the file type recorded in the directory entry, the same field that distinguishes a regular file from a directory or a symlink in <code>ls -l</code>',
              'Hỏi hệ thống file về loại file được ghi trong mục thư mục, đúng cái trường phân biệt file thường với thư mục hay liên kết tượng trưng trong <code>ls -l</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>logo.txt</code> really holds a PNG header, <code>notes.pdf</code> is a shell script, and <code>archive.zip</code> is plain text — and <code>ls -l</code> shows nothing but three ordinary files of 29, 28 and 17 bytes. Lesson 1.4 draws the practical conclusion: run <code>file</code> on anything you did not create yourself before <code>cat</code>-ing it, and remember that what makes a file executable is <code>chmod +x</code> plus a shebang, never the letters after the dot.',
            'Đã đo: <code>logo.txt</code> thật sự chứa phần đầu của một file PNG, <code>notes.pdf</code> là một script shell, còn <code>archive.zip</code> là văn bản thuần — và <code>ls -l</code> chẳng hiện gì ngoài ba file thường 29, 28 và 17 byte. Bài 1.4 rút ra kết luận thực dụng: hãy chạy <code>file</code> lên bất cứ thứ gì không do bạn tạo ra trước khi <code>cat</code> nó, và nhớ rằng thứ làm một file chạy được là <code>chmod +x</code> cộng dòng shebang, không bao giờ là mấy chữ sau dấu chấm.',
          ),
        }),

        // ── Chương 2 — File & thư mục ───────────────────────────────────
        mcq({
          prompt: B(
            'Real run. The same directory is created three times in a row:' + code(
              '$ mkdir logs        ; echo $?\n' +
              '0\n' +
              '$ mkdir logs\n' +
              "mkdir: cannot create directory 'logs': File exists\n" +
              '$ echo $?\n' +
              '1\n' +
              '$ mkdir -p logs     ; echo $?\n' +
              '0',
            ) + 'Beyond creating parent directories, why does this behaviour of <code>-p</code> matter in a script?',
            'Chạy thật. Cùng một thư mục được tạo ba lần liên tiếp:' + code(
              '$ mkdir logs        ; echo $?\n' +
              '0\n' +
              '$ mkdir logs\n' +
              "mkdir: cannot create directory 'logs': File exists\n" +
              '$ echo $?\n' +
              '1\n' +
              '$ mkdir -p logs     ; echo $?\n' +
              '0',
            ) + 'Ngoài việc tạo cả thư mục cha, vì sao hành vi này của <code>-p</code> lại quan trọng trong một script?',
          ),
          options: [
            B(
              'Because <code>-p</code> defers creation until the first write, so a script that never uses the directory leaves no trace on disk and stays idempotent by simply doing less work',
              'Vì <code>-p</code> hoãn việc tạo tới lần ghi đầu tiên, nên script nào không dùng tới thư mục đó sẽ không để lại dấu vết trên đĩa và giữ được tính lặp lại được nhờ làm ít việc đi',
            ),
            B(
              'Because <code>-p</code> makes the whole operation atomic, so two copies of the script running at once cannot both create the directory and corrupt each other\'s view of it',
              'Vì <code>-p</code> làm cả thao tác thành nguyên tử, nên hai bản của script chạy cùng lúc không thể cùng tạo thư mục và làm hỏng cách nhìn của nhau về nó',
            ),
            B(
              'Because plain <code>mkdir</code> creates the directory with mode 000 when it already exists, so subsequent writes fail with Permission denied unless <code>-p</code> repairs the mode',
              'Vì <code>mkdir</code> trơ trọi tạo thư mục với chế độ 000 khi nó đã tồn tại, nên các lệnh ghi sau đó hỏng với Permission denied trừ khi <code>-p</code> sửa lại chế độ',
            ),
            B(
              'Because <code>-p</code> succeeds with exit status 0 when the directory already exists. The script therefore runs correctly the second time — and with <code>set -e</code>, plain <code>mkdir</code> would abort the whole run on its non-zero status',
              'Vì <code>-p</code> trả về mã thoát 0 khi thư mục đã tồn tại. Nhờ vậy script chạy đúng ở lần thứ hai — còn với <code>set -e</code> thì <code>mkdir</code> trơ trọi sẽ làm cả lượt chạy dừng lại vì mã thoát khác 0',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. Lesson 2.1 calls this the quieter benefit of <code>-p</code>: it is safe to run repeatedly, which is exactly the property a deploy or setup script needs, because such scripts get re-run after a failure. Chapter 7 makes <code>set -euo pipefail</code> the standard opening of every script, and under <code>set -e</code> that exit status 1 is not a warning — it ends the run at line two.',
            'Đã đo. Bài 2.1 gọi đây là lợi ích âm thầm hơn của <code>-p</code>: chạy lại nhiều lần vẫn an toàn, đúng cái tính chất mà một script deploy hay cài đặt cần có, vì loại script đó luôn bị chạy lại sau khi hỏng. Chương 7 lấy <code>set -euo pipefail</code> làm dòng mở đầu chuẩn của mọi script, và dưới <code>set -e</code> thì mã thoát 1 kia không phải một lời cảnh báo — nó kết thúc lượt chạy ngay ở dòng thứ hai.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run inside a directory that is completely <b>empty</b>:' + code(
              '$ echo {a,b,c}.txt\n' +
              'a.txt b.txt c.txt\n' +
              '$ echo *.txt\n' +
              '*.txt\n' +
              '$ echo {01..10..3}\n' +
              '01 04 07 10',
            ) + 'Which statement explains both of the first two lines?',
            'Chạy thật bên trong một thư mục HOÀN TOÀN RỖNG:' + code(
              '$ echo {a,b,c}.txt\n' +
              'a.txt b.txt c.txt\n' +
              '$ echo *.txt\n' +
              '*.txt\n' +
              '$ echo {01..10..3}\n' +
              '01 04 07 10',
            ) + 'Phát biểu nào giải thích được cả hai dòng đầu?',
          ),
          options: [
            B(
              'Braces are pure text generation and never look at the disk, so they produce three names that do not exist; a glob is matched against real files, and in default bash a glob matching nothing is passed through literally',
              'Ngoặc nhọn là phép sinh văn bản thuần và không bao giờ nhìn vào đĩa, nên nó cho ra ba cái tên không hề tồn tại; còn glob thì được đối chiếu với file thật, và trong bash mặc định, một glob không khớp gì sẽ được truyền qua nguyên văn',
            ),
            B(
              'Both forms read the directory, but braces fall back to generating text when the directory is empty while globs do not, which is why only the brace form produced output here',
              'Cả hai dạng đều đọc thư mục, nhưng ngoặc nhọn quay về sinh văn bản khi thư mục rỗng còn glob thì không, đó là lý do chỉ dạng ngoặc nhọn cho ra kết quả ở đây',
            ),
            B(
              'Braces are expanded by <code>echo</code> itself while globs are expanded by the shell, so the two lines are handled by two different programs with different rules about missing files',
              'Ngoặc nhọn do chính <code>echo</code> khai triển còn glob do shell khai triển, nên hai dòng được hai chương trình khác nhau xử lý với những quy tắc khác nhau về file không tồn tại',
            ),
            B(
              'The difference is quoting: an unquoted glob is literal and an unquoted brace is expanded, which reverses if you put either construct inside double quotes',
              'Khác biệt nằm ở dấu nháy: glob không bọc nháy thì nguyên văn còn ngoặc nhọn không bọc nháy thì được khai triển, và điều đó đảo ngược nếu bạn đặt một trong hai vào nháy kép',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured in an empty directory. Lesson 2.2 draws the line clearly: braces <em>generate</em>, globs <em>select</em>. That is why <code>mkdir -p site/{css,js,img}</code> is the right tool for creating things and <code>*.txt</code> is the right tool for picking existing ones. The literal pass-through in line two is bash\'s default and the source of the classic loop bug — <code>for f in *.csv</code> runs once with <code>f</code> set to the pattern when no CSV exists. <code>shopt -s nullglob</code> makes it expand to nothing instead, and <code>failglob</code> makes it an error.',
            'Đo thật trong một thư mục rỗng. Bài 2.2 vạch ranh giới rất rõ: ngoặc nhọn SINH RA, glob CHỌN LỰA. Vì thế <code>mkdir -p site/{css,js,img}</code> mới là công cụ đúng để tạo, còn <code>*.txt</code> là công cụ đúng để chọn thứ đã có. Việc truyền qua nguyên văn ở dòng hai là mặc định của bash và là nguồn gốc của cái lỗi vòng lặp kinh điển — <code>for f in *.csv</code> chạy đúng một lần với <code>f</code> mang giá trị là chính cái mẫu khi không có file CSV nào. <code>shopt -s nullglob</code> làm nó khai triển thành rỗng, còn <code>failglob</code> biến nó thành lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on <b>bash 5.2.15</b>, in a directory holding <code>app.js</code>, <code>.env</code> and <code>.gitignore</code>:' + code(
              '$ echo .*\n' +
              '.env .gitignore\n' +
              '$ shopt -u globskipdots\n' +
              '$ echo .*\n' +
              '. .. .env .gitignore',
            ) + 'Older material — including this course — shows the second result as the default. What changed?',
            'Chạy thật trên BASH 5.2.15, trong thư mục chứa <code>app.js</code>, <code>.env</code> và <code>.gitignore</code>:' + code(
              '$ echo .*\n' +
              '.env .gitignore\n' +
              '$ shopt -u globskipdots\n' +
              '$ echo .*\n' +
              '. .. .env .gitignore',
            ) + 'Tài liệu cũ — kể cả giáo trình khoá này — hiện kết quả thứ hai như là mặc định. Điều gì đã thay đổi?',
          ),
          options: [
            B(
              'Nothing changed in bash; <code>shopt -u</code> merely disabled the directory cache, so the second run rebuilt the entry list from the raw inode table and picked up the two extra names it had cached away',
              'Bash không thay đổi gì; <code>shopt -u</code> chỉ tắt bộ nhớ đệm thư mục nên lần chạy thứ hai dựng lại danh sách mục từ bảng inode gốc và nhặt được hai cái tên mà nó đã cất vào đệm',
            ),
            B(
              'bash 5.2 added the shell option <code>globskipdots</code>, on by default, which makes <code>*</code> and <code>.*</code> never match <code>.</code> or <code>..</code>. Turning it off restores the pre-5.2 behaviour the course describes',
              'bash 5.2 thêm tuỳ chọn shell <code>globskipdots</code>, MẶC ĐỊNH BẬT, khiến <code>*</code> và <code>.*</code> không bao giờ khớp <code>.</code> hay <code>..</code>. Tắt nó đi thì hành vi trước 5.2 mà giáo trình mô tả quay lại',
            ),
            B(
              'The filesystem changed: modern ext4 no longer stores real <code>.</code> and <code>..</code> entries, synthesising them only when a program calls <code>readdir</code> with the legacy flag that <code>shopt -u</code> sets',
              'Hệ thống file đã đổi: ext4 hiện đại không còn lưu mục <code>.</code> và <code>..</code> thật nữa mà chỉ tổng hợp ra khi chương trình gọi <code>readdir</code> kèm cờ tương thích cũ mà <code>shopt -u</code> bật lên',
            ),
            B(
              'The <code>GLOBIGNORE</code> variable is now preset to <code>.:..</code> by the distribution\'s startup files, and <code>shopt -u</code> clears it as a side effect of resetting the globbing options',
              'Biến <code>GLOBIGNORE</code> nay được các file khởi động của bản phân phối đặt sẵn thành <code>.:..</code>, và <code>shopt -u</code> xoá nó như một hệ quả phụ của việc đặt lại các tuỳ chọn glob',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and this exam follows the machine rather than the book: <code>shopt globskipdots</code> reports <code>on</code> on bash 5.2.15. The change matters because the course warns that <code>rm -rf .*</code> recurses into the <em>parent</em> directory — true before 5.2, and no longer true here. Do not rely on either behaviour: servers still run bash 4.x and 5.1, and BusyBox <code>ash</code> in an Alpine container has neither the option nor the guarantee. The portable forms remain <code>.[!.]*</code>, or <code>shopt -s dotglob</code> with a plain <code>*</code>.',
            'Đã đo, và đề này theo MÁY chứ không theo sách: <code>shopt globskipdots</code> báo <code>on</code> trên bash 5.2.15. Thay đổi này đáng kể vì giáo trình cảnh báo rằng <code>rm -rf .*</code> sẽ đệ quy lên thư mục CHA — đúng với trước 5.2, và ở đây thì không còn đúng nữa. Đừng tin vào bất kỳ hành vi nào trong hai: máy chủ vẫn chạy bash 4.x và 5.1, còn BusyBox <code>ash</code> trong container Alpine thì không có cả tuỳ chọn lẫn bảo đảm. Dạng chạy được ở mọi nơi vẫn là <code>.[!.]*</code>, hoặc <code>shopt -s dotglob</code> kèm một dấu <code>*</code> trơ trọi.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on GNU findutils 4.9.0. The <em>same</em> command was run twice — once typed at an interactive terminal, once from a script whose stdin was not a terminal:' + code(
              '# interactive (stdin is a TTY)\n' +
              '$ find . -name "*.json" -maxdepth 2\n' +
              'find: warning: you have specified the global option -maxdepth after the\n' +
              'argument -name, but global options are not positional ...\n' +
              './a/x.json\n' +
              '\n' +
              '# from a script (stdin is not a TTY)\n' +
              '$ find . -name "*.json" -maxdepth 2 ; echo $?\n' +
              './a/x.json\n' +
              '0',
            ) + 'What should you take from this?',
            'Chạy thật trên GNU findutils 4.9.0. CÙNG một lệnh được chạy hai lần — một lần gõ tay ở terminal tương tác, một lần từ script mà stdin không phải terminal:' + code(
              '# tương tác (stdin là TTY)\n' +
              '$ find . -name "*.json" -maxdepth 2\n' +
              'find: warning: you have specified the global option -maxdepth after the\n' +
              'argument -name, but global options are not positional ...\n' +
              './a/x.json\n' +
              '\n' +
              '# từ một script (stdin không phải TTY)\n' +
              '$ find . -name "*.json" -maxdepth 2 ; echo $?\n' +
              './a/x.json\n' +
              '0',
            ) + 'Bạn nên rút ra điều gì?',
          ),
          options: [
            B(
              'The script run silently ignored <code>-maxdepth</code>, which is why it printed the same single result by coincidence; add <code>-warn</code> to force find to apply the option as well as announce it',
              'Lượt chạy trong script âm thầm bỏ qua <code>-maxdepth</code>, nên nó in ra cùng một kết quả duy nhất chỉ là trùng hợp; hãy thêm <code>-warn</code> để buộc find vừa áp dụng tuỳ chọn vừa thông báo',
            ),
            B(
              'The two runs behave differently because a non-interactive shell sets <code>POSIXLY_CORRECT</code>, under which <code>-maxdepth</code> becomes positional and only filters the tests written after it',
              'Hai lượt chạy hành xử khác nhau vì shell không tương tác đặt <code>POSIXLY_CORRECT</code>, và dưới đó <code>-maxdepth</code> trở thành có vị trí và chỉ lọc những phép thử viết sau nó',
            ),
            B(
              'The option still applies to the whole expression in both runs — only the <em>warning</em> is suppressed when stdin is not a terminal. So the safety net you rely on while typing disappears in scripts and in CI, exactly where nobody is watching',
              'Tuỳ chọn vẫn áp dụng cho toàn bộ biểu thức ở cả hai lượt — chỉ có CẢNH BÁO bị chặn khi stdin không phải terminal. Nghĩa là cái lưới an toàn bạn dựa vào lúc gõ tay sẽ biến mất trong script và trong CI, đúng chỗ không ai đang nhìn',
            ),
            B(
              'find only emits warnings when it can colour them, so redirecting output removes them; piping through <code>cat -v</code> or <code>less -R</code> brings the warning back without changing what the command does',
              'find chỉ phát cảnh báo khi nó tô màu được, nên chuyển hướng đầu ra là mất cảnh báo; đưa qua <code>cat -v</code> hay <code>less -R</code> sẽ lấy lại cảnh báo mà không đổi việc lệnh làm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured both ways in the same container, with <code>docker exec</code> and <code>docker exec -t</code>. Both runs printed the identical result list, so <code>-maxdepth</code> was honoured in both — GNU find enables warnings by default only when stdin is a terminal. The underlying point from lesson 2.3 stands: positional options apply to the <em>whole</em> expression no matter where you write them, so a command written this way reads differently from how it behaves. Put <code>-maxdepth</code> and <code>-mindepth</code> before the tests, and never treat "no warning appeared in CI" as evidence that a command is well formed.',
            'Đã đo cả hai chiều trong cùng một container, bằng <code>docker exec</code> và <code>docker exec -t</code>. Hai lượt in ra danh sách kết quả y hệt nhau, nên <code>-maxdepth</code> đã có hiệu lực ở cả hai — GNU find chỉ bật cảnh báo mặc định khi stdin là terminal. Ý cốt lõi của bài 2.3 vẫn đúng: tuỳ chọn có vị trí áp dụng cho TOÀN BỘ biểu thức bất kể bạn viết nó ở đâu, nên một lệnh viết kiểu này đọc lên thì khác với cách nó chạy. Hãy đặt <code>-maxdepth</code> và <code>-mindepth</code> trước các phép thử, và đừng bao giờ coi "CI không hiện cảnh báo nào" là bằng chứng rằng câu lệnh đã viết đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run in a directory holding two files, one of which is named <code>My Report.pdf</code>:' + code(
              '$ find . -name "*.pdf" | xargs ls -l\n' +
              "ls: cannot access './My': No such file or directory\n" +
              "ls: cannot access 'Report.pdf': No such file or directory\n" +
              '-rw-r--r-- 1 root root 0 Sep 10 00:12 ./notes.pdf\n' +
              '\n' +
              '$ find . -name "*.pdf" -print0 | xargs -0 ls -l\n' +
              "-rw-r--r-- 1 root root 0 Sep 10 00:12 './My Report.pdf'\n" +
              '-rw-r--r-- 1 root root 0 Sep 10 00:12 ./notes.pdf',
            ) + 'Why does the pairing <code>-print0</code> with <code>-0</code> fix it, and fix it for good?',
            'Chạy thật trong một thư mục có hai file, một trong đó tên là <code>My Report.pdf</code>:' + code(
              '$ find . -name "*.pdf" | xargs ls -l\n' +
              "ls: cannot access './My': No such file or directory\n" +
              "ls: cannot access 'Report.pdf': No such file or directory\n" +
              '-rw-r--r-- 1 root root 0 Sep 10 00:12 ./notes.pdf\n' +
              '\n' +
              '$ find . -name "*.pdf" -print0 | xargs -0 ls -l\n' +
              "-rw-r--r-- 1 root root 0 Sep 10 00:12 './My Report.pdf'\n" +
              '-rw-r--r-- 1 root root 0 Sep 10 00:12 ./notes.pdf',
            ) + 'Vì sao cặp <code>-print0</code> và <code>-0</code> chữa được, và chữa được vĩnh viễn?',
          ),
          options: [
            B(
              'Because <code>-print0</code> quotes each path before printing it, so <code>xargs</code> receives shell-safe words and can split on whitespace as usual without breaking names that contain a space',
              'Vì <code>-print0</code> bọc nháy từng đường dẫn trước khi in, nên <code>xargs</code> nhận được các từ an toàn với shell và vẫn cắt theo khoảng trắng như thường mà không làm vỡ những cái tên có dấu cách',
            ),
            B(
              'Because <code>-0</code> makes <code>xargs</code> pass one path per invocation, so a name with a space can no longer be confused with two names — at the cost of starting one process per file',
              'Vì <code>-0</code> khiến <code>xargs</code> truyền mỗi lần gọi đúng một đường dẫn, nên tên có dấu cách không còn bị lẫn thành hai cái tên — đổi lại là mỗi file một tiến trình',
            ),
            B(
              'Because <code>-print0</code> escapes the space as <code>\\040</code> and <code>-0</code> unescapes it again, an encoding that also covers newlines, tabs and every other separator a filename may contain',
              'Vì <code>-print0</code> thoát dấu cách thành <code>\\040</code> còn <code>-0</code> giải thoát lại, một cách mã hoá cũng bao luôn xuống dòng, tab và mọi ký tự phân tách khác mà tên file có thể chứa',
            ),
            B(
              'Because the default separator is a newline and a space is a word break, both of which are legal inside a filename. <code>-print0</code> ends each path with a NUL byte and <code>-0</code> splits on that — the one byte a filename can never contain',
              'Vì dấu phân tách mặc định là ký tự xuống dòng còn dấu cách thì ngắt từ, mà cả hai đều hợp lệ bên trong một tên file. <code>-print0</code> kết thúc mỗi đường dẫn bằng một byte NUL và <code>-0</code> cắt theo byte đó — byte duy nhất tên file không bao giờ chứa được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured; the unquoted run exited 123 because <code>xargs</code> reports a failing child that way. The pairing is unambiguous <em>by construction</em>, not by escaping: the kernel forbids NUL inside a filename, so a NUL-separated stream can always be split back correctly. Lesson 2.3 gives the rule of thumb — whenever you see <code>find | xargs</code> without <code>-print0</code>/<code>-0</code>, you are looking at a latent bug — and notes the simpler alternative where it exists: <code>find . -name "*.pdf" -delete</code>, or <code>-exec … +</code>, which never involve a separator at all.',
            'Đã đo; lượt không bọc thoát ra với mã 123 vì <code>xargs</code> báo tiến trình con hỏng theo cách đó. Cặp này không mơ hồ NHỜ CẤU TRÚC chứ không nhờ thoát ký tự: kernel cấm byte NUL trong tên file, nên một dòng dữ liệu ngăn bằng NUL luôn cắt ngược lại được chính xác. Bài 2.3 cho quy tắc ngón tay cái — hễ thấy <code>find | xargs</code> mà thiếu <code>-print0</code> với <code>-0</code> thì đó là một lỗi đang nằm chờ — và nêu cách đơn giản hơn khi có: <code>find . -name "*.pdf" -delete</code>, hoặc <code>-exec … +</code>, vốn không dính tới dấu phân tách nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. One file, one hard link and one symlink to it:' + code(
              '$ echo hello > report.txt\n' +
              '$ ln    report.txt backup.txt\n' +
              '$ ln -s report.txt shortcut.txt\n' +
              '$ ls -li\n' +
              '988540 -rw-r--r-- 2 root root  6 Sep 10 00:12 backup.txt\n' +
              '988540 -rw-r--r-- 2 root root  6 Sep 10 00:12 report.txt\n' +
              '988541 lrwxrwxrwx 1 root root 10 Sep 10 00:12 shortcut.txt -> report.txt',
            ) + 'Why is <code>shortcut.txt</code> exactly 10 bytes when the file it points at holds 6?',
            'Chạy thật. Một file, một liên kết cứng và một liên kết tượng trưng trỏ tới nó:' + code(
              '$ echo hello > report.txt\n' +
              '$ ln    report.txt backup.txt\n' +
              '$ ln -s report.txt shortcut.txt\n' +
              '$ ls -li\n' +
              '988540 -rw-r--r-- 2 root root  6 Sep 10 00:12 backup.txt\n' +
              '988540 -rw-r--r-- 2 root root  6 Sep 10 00:12 report.txt\n' +
              '988541 lrwxrwxrwx 1 root root 10 Sep 10 00:12 shortcut.txt -> report.txt',
            ) + 'Vì sao <code>shortcut.txt</code> đúng 10 byte trong khi file nó trỏ tới chỉ chứa 6?',
          ),
          options: [
            B(
              'Because a symlink has its own inode whose entire content is the target <em>path string</em>, and <code>report.txt</code> is ten characters long. The hard link is not a second file at all: it shares inode 988540, which is why both entries show the same number, the same size and a link count of 2',
              'Vì liên kết tượng trưng có inode riêng mà toàn bộ nội dung là CHUỖI ĐƯỜNG DẪN đích, và <code>report.txt</code> dài đúng mười ký tự. Còn liên kết cứng thì không phải file thứ hai chút nào: nó dùng chung inode 988540, nên hai mục hiện cùng một con số, cùng kích thước, và số liên kết bằng 2',
            ),
            B(
              'Because a symlink stores the target path plus a four-byte header identifying it as a link, so its size is always the length of the name it points at plus four, regardless of the target\'s own size',
              'Vì liên kết tượng trưng lưu đường dẫn đích cộng một phần đầu bốn byte đánh dấu nó là liên kết, nên kích thước của nó luôn bằng độ dài cái tên nó trỏ tới cộng bốn, bất kể đích lớn nhỏ ra sao',
            ),
            B(
              'Because <code>ls</code> reports the size of the target for hard links but the size of the directory entry for symlinks, and a directory entry is padded to a ten-byte boundary on ext4',
              'Vì <code>ls</code> báo kích thước của đích với liên kết cứng nhưng báo kích thước của mục thư mục với liên kết tượng trưng, và mục thư mục được đệm cho tròn ranh giới mười byte trên ext4',
            ),
            B(
              'Because the symlink caches a copy of the target\'s content and its metadata, so it grows to six bytes of data plus four bytes of bookkeeping and must be refreshed when the target changes',
              'Vì liên kết tượng trưng lưu đệm một bản sao nội dung của đích cùng siêu dữ liệu, nên nó phình thành sáu byte dữ liệu cộng bốn byte ghi sổ và phải làm mới khi đích thay đổi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. Count the characters in <code>report.txt</code> — ten. Lesson 2.4 makes the model explicit: a filename is a pointer to an inode, a hard link is a second pointer to the <em>same</em> inode (so neither name is "the original" and removing one only decrements the count), and a symlink is a tiny separate file whose data is a path resolved at open time. That single model also explains why a deleted-but-open log still consumes disk (lesson 1.4) and why <code>mv</code> within one filesystem is instant (lesson 2.1).',
            'Đã đo. Đếm số ký tự trong <code>report.txt</code> — mười. Bài 2.4 nói thẳng mô hình: tên file là con trỏ tới một inode, liên kết cứng là con trỏ thứ hai tới CÙNG inode đó (nên không cái tên nào là "bản gốc", và xoá một cái chỉ làm giảm số đếm), còn liên kết tượng trưng là một file nhỏ riêng biệt mà dữ liệu chính là một đường dẫn, được phân giải vào lúc mở. Đúng mô hình đó cũng giải thích vì sao một file log đã xoá mà còn đang mở vẫn ngốn đĩa (bài 1.4), và vì sao <code>mv</code> trong cùng một hệ thống file lại tức thì (bài 2.1).',
          ),
        }),

        // ── Chương 3 — Văn bản, ống dẫn & chuyển hướng ──────────────────
        mcq({
          prompt: B(
            'Real run. <code>badcommand</code> does not exist anywhere on the machine:' + code(
              '$ wc -c < important.txt\n' +
              '18\n' +
              '$ badcommand > important.txt\n' +
              'bash: badcommand: command not found\n' +
              '$ echo $?\n' +
              '127\n' +
              '$ wc -c < important.txt\n' +
              '0',
            ) + 'A command that never ran destroyed the file. How?',
            'Chạy thật. <code>badcommand</code> không tồn tại ở đâu trên máy cả:' + code(
              '$ wc -c < important.txt\n' +
              '18\n' +
              '$ badcommand > important.txt\n' +
              'bash: badcommand: command not found\n' +
              '$ echo $?\n' +
              '127\n' +
              '$ wc -c < important.txt\n' +
              '0',
            ) + 'Một câu lệnh chưa từng chạy lại xoá sạch cái file. Bằng cách nào?',
          ),
          options: [
            B(
              'The exit status 127 is bash\'s way of reporting that it truncated a file it could not hand to a program; any non-zero status from the lookup phase rolls the redirection back to an empty file',
              'Mã thoát 127 là cách bash báo rằng nó vừa cắt trắng một file mà nó không giao được cho chương trình nào; mọi mã khác 0 ở giai đoạn tra cứu đều cuộn phép chuyển hướng về một file rỗng',
            ),
            B(
              'The shell sets up every redirection <em>before</em> it looks for the program, and <code>&gt;</code> truncates the target to zero bytes at that moment. The failure of the lookup afterwards changes nothing that has already happened',
              'Shell dựng mọi phép chuyển hướng TRƯỚC khi nó đi tìm chương trình, và <code>&gt;</code> cắt file đích về 0 byte ngay lúc đó. Việc tra cứu thất bại sau đó không thay đổi được điều đã xảy ra rồi',
            ),
            B(
              'The error message itself was written to the file: <code>&gt;</code> captures stderr as well as stdout when the command cannot be found, and the message happened to be shorter than the original content',
              'Chính thông báo lỗi đã được ghi vào file: <code>&gt;</code> bắt cả stderr lẫn stdout khi không tìm thấy lệnh, và thông báo đó tình cờ ngắn hơn nội dung ban đầu',
            ),
            B(
              'Bash retried the lookup through each <code>PATH</code> entry in turn, and each failed attempt opened the target file afresh; the last of those opens left it empty because no writer ever attached to it',
              'Bash thử lại việc tra cứu qua từng mục của <code>PATH</code>, và mỗi lần thử hỏng lại mở file đích một lần nữa; lần mở cuối cùng để nó rỗng vì không có ai gắn vào để ghi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The ordering is the whole lesson (3.1): redirections are the shell\'s work and they happen first. The same ordering explains the classic <code>sort names.txt &gt; names.txt</code>, which was also measured here and left the file at 0 lines — the shell empties the file, then <code>sort</code> reads an empty file and writes nothing. Use <code>sort -o names.txt names.txt</code>, or write to a temporary file and <code>mv</code> it into place. <code>set -o noclobber</code> makes <code>&gt;</code> refuse an existing target, which is a reasonable seatbelt to keep on.',
            'Đã đo. Thứ tự chính là toàn bộ bài học (3.1): chuyển hướng là việc của shell và nó xảy ra trước. Cùng thứ tự đó giải thích ca kinh điển <code>sort names.txt &gt; names.txt</code>, cũng đã đo ở đây và để lại file 0 dòng — shell làm rỗng file, rồi <code>sort</code> đọc một file rỗng và chẳng ghi ra gì. Hãy dùng <code>sort -o names.txt names.txt</code>, hoặc ghi ra file tạm rồi <code>mv</code> đè vào. <code>set -o noclobber</code> làm <code>&gt;</code> từ chối một file đích đã có, một cái dây an toàn đáng để bật.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. <code>yes</code> prints the letter y forever and never exits on its own:' + code(
              '$ yes | head -3\n' +
              'y\n' +
              'y\n' +
              'y\n' +
              '$ echo "${PIPESTATUS[@]}"\n' +
              '141 0',
            ) + 'Explain both the three lines and the 141.',
            'Chạy thật. <code>yes</code> in ra chữ y mãi mãi và không bao giờ tự thoát:' + code(
              '$ yes | head -3\n' +
              'y\n' +
              'y\n' +
              'y\n' +
              '$ echo "${PIPESTATUS[@]}"\n' +
              '141 0',
            ) + 'Hãy giải thích cả ba dòng y lẫn con số 141.',
          ),
          options: [
            B(
              '<code>head</code> reads three lines and then tells <code>yes</code> to stop through the pipe\'s control channel; 141 is the "producer asked to stop" status that the shell records for a cooperative shutdown',
              '<code>head</code> đọc ba dòng rồi bảo <code>yes</code> dừng lại qua kênh điều khiển của ống dẫn; 141 là mã "bên sản xuất được yêu cầu dừng" mà shell ghi lại cho một lần tắt có phối hợp',
            ),
            B(
              'The shell ran <code>yes</code> to completion into a 64 KB buffer first, then started <code>head</code>, which took the first three lines; 141 is the byte count that <code>yes</code> managed to write before the buffer filled',
              'Shell chạy <code>yes</code> cho xong vào một bộ đệm 64 KB trước, rồi mới khởi động <code>head</code>, và <code>head</code> lấy ba dòng đầu; 141 là số byte mà <code>yes</code> kịp ghi trước khi bộ đệm đầy',
            ),
            B(
              'Both processes started at the same moment. <code>head</code> printed three lines and exited, so <code>yes</code> wrote into a pipe with no reader and the kernel killed it with SIGPIPE — signal 13, reported as 128 + 13 = 141',
              'Hai tiến trình khởi động cùng một lúc. <code>head</code> in ba dòng rồi thoát, nên <code>yes</code> ghi vào một ống dẫn không còn ai đọc và kernel giết nó bằng SIGPIPE — tín hiệu 13, báo về thành 128 + 13 = 141',
            ),
            B(
              '<code>yes</code> detects that its output is a pipe rather than a terminal and switches to block buffering, flushing exactly one 141-byte block before noticing the reader is gone and exiting normally',
              '<code>yes</code> phát hiện đầu ra của nó là ống dẫn chứ không phải terminal nên chuyển sang đệm theo khối, xả đúng một khối 141 byte rồi mới nhận ra bên đọc đã đi và thoát bình thường',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured, including the <code>PIPESTATUS</code> line. This is the experiment that kills the "run <code>a</code>, collect, then feed <code>b</code>" model — under that model <code>yes</code> would never finish producing. Both sides run concurrently through a 64 KB kernel buffer, and the same mechanism is why <code>grep pattern 10GB.log | head -5</code> returns instantly instead of reading ten gigabytes. Note the second half of the lesson: a pipeline reports only the <em>last</em> stage\'s status by default, so that 141 is invisible to <code>$?</code> — use <code>set -o pipefail</code>, or read <code>${PIPESTATUS[@]}</code> before any other command overwrites it.',
            'Đã đo, kể cả dòng <code>PIPESTATUS</code>. Đây là thí nghiệm giết chết mô hình "chạy <code>a</code>, hứng kết quả, rồi đưa cho <code>b</code>" — theo mô hình đó thì <code>yes</code> sẽ chẳng bao giờ sản xuất xong. Hai bên chạy song song qua một bộ đệm 64 KB của kernel, và cùng cơ chế ấy là lý do <code>grep pattern 10GB.log | head -5</code> trả về tức thì thay vì đọc hết mười gigabyte. Lưu ý nửa sau của bài học: mặc định một chuỗi ống chỉ báo mã thoát của khâu CUỐI, nên con số 141 kia vô hình với <code>$?</code> — hãy dùng <code>set -o pipefail</code>, hoặc đọc <code>${PIPESTATUS[@]}</code> trước khi bất kỳ lệnh nào khác ghi đè lên nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. The file <code>access.log</code> holds four lines, and the two loops differ only in how the data reaches them:' + code(
              '$ count=0\n' +
              '$ cat access.log | while read -r line; do count=$((count + 1)); done\n' +
              '$ echo "$count"\n' +
              '0\n' +
              '$ count=0\n' +
              '$ while read -r line; do count=$((count + 1)); done < access.log\n' +
              '$ echo "$count"\n' +
              '4',
            ) + 'Why does the first version lose the count?',
            'Chạy thật. File <code>access.log</code> có bốn dòng, và hai vòng lặp chỉ khác nhau ở cách dữ liệu đi tới chúng:' + code(
              '$ count=0\n' +
              '$ cat access.log | while read -r line; do count=$((count + 1)); done\n' +
              '$ echo "$count"\n' +
              '0\n' +
              '$ count=0\n' +
              '$ while read -r line; do count=$((count + 1)); done < access.log\n' +
              '$ echo "$count"\n' +
              '4',
            ) + 'Vì sao bản đầu tiên đánh mất số đếm?',
          ),
          options: [
            B(
              '<code>read -r</code> cannot modify a variable that was assigned outside the loop, so the increment silently targets a fresh copy created on first use inside the loop body',
              '<code>read -r</code> không sửa được biến đã gán ở ngoài vòng lặp, nên phép tăng âm thầm tác động lên một bản sao mới được tạo ở lần dùng đầu tiên trong thân vòng lặp',
            ),
            B(
              '<code>cat</code> buffers all four lines and delivers them after the loop has already finished, so the loop body runs zero times and the count stays at its initial value',
              '<code>cat</code> đệm cả bốn dòng rồi giao chúng sau khi vòng lặp đã kết thúc, nên thân vòng lặp chạy không lần nào và số đếm giữ nguyên giá trị ban đầu',
            ),
            B(
              'Arithmetic expansion <code>$(( ))</code> is not available inside a <code>while</code> loop that reads from a pipe, so each assignment evaluates to the empty string and bash resets the variable to 0',
              'Phép khai triển số học <code>$(( ))</code> không dùng được bên trong vòng <code>while</code> đọc từ ống dẫn, nên mỗi phép gán cho ra chuỗi rỗng và bash đặt lại biến về 0',
            ),
            B(
              'Every stage of a pipeline runs in its own subshell. The loop really did count to 4 — in a forked child process, whose memory vanished when it exited. The parent\'s <code>count</code> was never touched',
              'Mỗi khâu của chuỗi ống chạy trong một shell con riêng. Vòng lặp có đếm tới 4 thật — nhưng trong một tiến trình con đã fork ra, và bộ nhớ của nó biến mất khi nó thoát. Biến <code>count</code> của tiến trình cha chưa hề bị đụng tới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured side by side. Lesson 3.2 gives three fixes and the redirect above is the first: <code>done &lt; access.log</code> keeps the loop in the current shell, so there is no child to lose. The general fix is process substitution — <code>done &lt; &lt;(grep ERROR access.log)</code> — which works when you need a command rather than a file on the input side. <code>shopt -s lastpipe</code> is a third route but only applies to non-interactive bash. The symptom is worth memorising in its real-world form: a loop that visibly processed every row, and a total that is still zero afterwards.',
            'Đã đo hai bản cạnh nhau. Bài 3.2 đưa ra ba cách sửa và phép chuyển hướng ở trên là cách thứ nhất: <code>done &lt; access.log</code> giữ vòng lặp ở lại shell hiện tại nên chẳng có tiến trình con nào để mà mất. Cách sửa tổng quát là thay thế tiến trình — <code>done &lt; &lt;(grep ERROR access.log)</code> — dùng được khi đầu vào phải là một câu lệnh chứ không phải một file. <code>shopt -s lastpipe</code> là đường thứ ba nhưng chỉ áp dụng cho bash không tương tác. Triệu chứng này đáng thuộc dưới dạng đời thật: một vòng lặp rõ ràng đã xử lý từng dòng, mà tổng cộng xong vẫn bằng không.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. <code>app.log</code> holds exactly three lines, the first of which is <code>ERROR ERROR ERROR</code>:' + code(
              '$ cat app.log\n' +
              'ERROR ERROR ERROR\n' +
              'ok\n' +
              'ERROR\n' +
              '$ grep -c ERROR app.log\n' +
              '2\n' +
              '$ grep -o ERROR app.log | wc -l\n' +
              '4',
            ) + 'Which reading of the two numbers is correct?',
            'Chạy thật. <code>app.log</code> có đúng ba dòng, dòng đầu là <code>ERROR ERROR ERROR</code>:' + code(
              '$ cat app.log\n' +
              'ERROR ERROR ERROR\n' +
              'ok\n' +
              'ERROR\n' +
              '$ grep -c ERROR app.log\n' +
              '2\n' +
              '$ grep -o ERROR app.log | wc -l\n' +
              '4',
            ) + 'Cách đọc nào về hai con số là ĐÚNG?',
          ),
          options: [
            B(
              '<code>-c</code> counts matching <em>lines</em> (two of the three lines contain the word) while <code>-o</code> prints each individual match on its own line, so <code>wc -l</code> then counts <em>occurrences</em> — four of them',
              '<code>-c</code> đếm số DÒNG có khớp (hai trong ba dòng chứa từ đó) còn <code>-o</code> in từng lần khớp ra một dòng riêng, nên <code>wc -l</code> sau đó đếm số LẦN XUẤT HIỆN — bốn lần',
            ),
            B(
              '<code>-c</code> counts occurrences but stops after the first match on each line as an optimisation, which is why it reports two; <code>-o</code> disables that optimisation and finds the remaining two',
              '<code>-c</code> đếm số lần xuất hiện nhưng dừng sau lần khớp đầu tiên trên mỗi dòng để tối ưu, nên nó báo hai; còn <code>-o</code> tắt phép tối ưu đó và tìm ra hai lần còn lại',
            ),
            B(
              'The two numbers count the same thing and differ only because <code>wc -l</code> adds one for the final newline that <code>grep -o</code> emits after its last match',
              'Hai con số đếm cùng một thứ và chỉ khác nhau vì <code>wc -l</code> cộng thêm một cho ký tự xuống dòng cuối mà <code>grep -o</code> phát ra sau lần khớp cuối cùng',
            ),
            B(
              '<code>-c</code> counts lines that match the pattern <em>as a whole line</em>, so only the third line qualifies plus the header line <code>grep</code> adds, while <code>-o</code> matches anywhere within a line',
              '<code>-c</code> đếm những dòng khớp cái mẫu XÉT NGUYÊN CẢ DÒNG, nên chỉ dòng thứ ba đủ điều kiện cộng thêm dòng tiêu đề mà <code>grep</code> thêm vào, còn <code>-o</code> thì khớp ở bất kỳ đâu trong dòng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, and <code>grep -o ERROR app.log</code> really does print four separate lines. <code>grep</code> is line-oriented all the way down: <code>-c</code> is a count of lines, <code>-l</code> is a list of filenames, <code>-v</code> inverts by line. Reaching for <code>-c</code> when you meant "how many times does this appear" quietly under-reports on any log where a line can carry several matches. Worth pairing with the exit-status rule from lesson 3.3: <code>grep -q</code> returns 0 on a match, 1 on none, and <b>2 on a real error</b> such as an unreadable file — so treating "non-zero" as "no match" turns a missing file into an empty result.',
            'Đã đo, và <code>grep -o ERROR app.log</code> thật sự in ra bốn dòng riêng biệt. <code>grep</code> hướng theo DÒNG từ trên xuống dưới: <code>-c</code> là số dòng, <code>-l</code> là danh sách tên file, <code>-v</code> đảo ngược theo dòng. Vớ lấy <code>-c</code> trong khi ý bạn là "cái này xuất hiện bao nhiêu lần" sẽ âm thầm báo thiếu trên mọi file log mà một dòng có thể mang nhiều lần khớp. Đáng ghép với quy tắc mã thoát ở bài 3.3: <code>grep -q</code> trả 0 khi có khớp, 1 khi không, và 2 KHI CÓ LỖI THẬT chẳng hạn file không đọc được — nên coi "khác 0" là "không khớp" sẽ biến một file thiếu thành một kết quả rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on GNU grep 3.8. The file <code>words.txt</code> holds four lines: <code>color</code>, <code>colour</code>, <code>colouur</code> and the literal text <code>colou?r</code>.' + code(
              '$ grep    "colou?r" words.txt\n' +
              'colou?r\n' +
              '$ grep -E "colou?r" words.txt\n' +
              'color\n' +
              'colour',
            ) + 'Why does the first command find only the odd fourth line?',
            'Chạy thật trên GNU grep 3.8. File <code>words.txt</code> có bốn dòng: <code>color</code>, <code>colour</code>, <code>colouur</code> và dòng chữ nguyên văn <code>colou?r</code>.' + code(
              '$ grep    "colou?r" words.txt\n' +
              'colou?r\n' +
              '$ grep -E "colou?r" words.txt\n' +
              'color\n' +
              'colour',
            ) + 'Vì sao lệnh đầu tiên chỉ tìm thấy đúng cái dòng thứ tư kỳ quặc kia?',
          ),
          options: [
            B(
              'Plain <code>grep</code> disabled the quantifier because the pattern was double-quoted; single quotes would have preserved it and both commands would then have produced the same two lines',
              '<code>grep</code> trơ trọi vô hiệu hoá lượng từ đó vì cái mẫu được bọc trong nháy kép; nháy đơn sẽ giữ lại nó và khi đó hai lệnh cho ra cùng hai dòng',
            ),
            B(
              'Plain <code>grep</code> speaks BRE, in which <code>?</code> is an ordinary character with no special meaning — so it searched for the seven-character text <code>colou?r</code> and found the one line that contains it. <code>-E</code> switches to ERE, where <code>?</code> means "optional"',
              '<code>grep</code> trơ trọi nói phương ngữ BRE, trong đó <code>?</code> là một ký tự thường không mang nghĩa đặc biệt — nên nó đi tìm đúng đoạn chữ bảy ký tự <code>colou?r</code> và thấy đúng cái dòng chứa nó. Còn <code>-E</code> chuyển sang ERE, nơi <code>?</code> nghĩa là "có hoặc không"',
            ),
            B(
              'Plain <code>grep</code> anchors every pattern to the whole line unless <code>-E</code> is given, so only an exact whole-line match can succeed and <code>color</code> is too short to qualify',
              '<code>grep</code> trơ trọi neo mọi mẫu vào nguyên cả dòng trừ khi có <code>-E</code>, nên chỉ một dòng khớp y hệt toàn bộ mới thành công, và <code>color</code> thì quá ngắn để đủ điều kiện',
            ),
            B(
              'The two commands use the same dialect, but plain <code>grep</code> stops at the first match in the file while <code>-E</code> continues scanning, so the difference is where the search ended rather than what it means',
              'Hai lệnh dùng cùng một phương ngữ, nhưng <code>grep</code> trơ trọi dừng ở lần khớp đầu tiên trong file còn <code>-E</code> thì quét tiếp, nên khác biệt nằm ở chỗ cuộc tìm kiếm dừng lại chứ không phải ở ý nghĩa',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, along with two more forms: <code>grep "colou\\?r"</code> escapes the question mark into its BRE quantifier meaning and returns the same two lines as <code>-E</code>, while <code>grep -F "colou?r"</code> disables regex entirely and returns the literal line. Lesson 3.3 gives the practical rule — use <code>-E</code> for anything with a quantifier or alternation, <code>-P</code> when you want <code>\\d</code> and lookahead, and <code>-F</code> when the pattern is literal text containing <code>.</code> or <code>*</code>, which is also measurably faster. Searching for an IP address with plain <code>grep</code> means every dot matches any character, so <code>1.2.3</code> also matches <code>1x2y3</code>.',
            'Đã đo, kèm hai dạng nữa: <code>grep "colou\\?r"</code> thoát dấu hỏi để nó mang nghĩa lượng từ của BRE và trả về đúng hai dòng như <code>-E</code>, còn <code>grep -F "colou?r"</code> tắt hẳn biểu thức chính quy và trả về dòng nguyên văn. Bài 3.3 cho quy tắc thực dụng — dùng <code>-E</code> cho mọi thứ có lượng từ hay phép chọn, dùng <code>-P</code> khi cần <code>\\d</code> và lookahead, và dùng <code>-F</code> khi cái mẫu là chữ nguyên văn có chứa <code>.</code> hay <code>*</code>, thứ cũng nhanh hơn đo được. Tìm một địa chỉ IP bằng <code>grep</code> trơ trọi nghĩa là mỗi dấu chấm khớp với ký tự bất kỳ, nên <code>1.2.3</code> khớp luôn cả <code>1x2y3</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. The input is column-aligned with runs of spaces (shown here with <code>cat -A</code>, where <code>$</code> marks the end of a line):' + code(
              '$ cat -A padded.txt\n' +
              'INFO   /api/users   200$\n' +
              'ERROR  /api/orders 500$\n' +
              "$ cut -d' ' -f3 padded.txt\n" +
              '\n' +
              '/api/orders\n' +
              "$ awk '{print $3}' padded.txt\n" +
              '200\n' +
              '500',
            ) + 'Why does <code>cut</code> return a blank and then the wrong field?',
            'Chạy thật. Đầu vào được căn cột bằng nhiều dấu cách liên tiếp (hiện ở đây bằng <code>cat -A</code>, trong đó <code>$</code> đánh dấu hết dòng):' + code(
              '$ cat -A padded.txt\n' +
              'INFO   /api/users   200$\n' +
              'ERROR  /api/orders 500$\n' +
              "$ cut -d' ' -f3 padded.txt\n" +
              '\n' +
              '/api/orders\n' +
              "$ awk '{print $3}' padded.txt\n" +
              '200\n' +
              '500',
            ) + 'Vì sao <code>cut</code> trả về một dòng trống rồi tới một trường sai?',
          ),
          options: [
            B(
              '<code>cut</code> requires the delimiter to be given as a regular expression, and a bare space is interpreted as "any whitespace, zero or more times", which makes the field numbering non-deterministic',
              '<code>cut</code> đòi dấu phân tách phải cho dưới dạng biểu thức chính quy, và một dấu cách trơ trọi bị hiểu là "khoảng trắng bất kỳ, không hoặc nhiều lần", khiến việc đánh số trường thành bất định',
            ),
            B(
              '<code>cut</code> counts fields from 0 while <code>awk</code> counts from 1, so the two commands are asking for different columns and the blank line is simply column 2 of the first row',
              '<code>cut</code> đếm trường từ 0 còn <code>awk</code> đếm từ 1, nên hai lệnh đang hỏi hai cột khác nhau và dòng trống chỉ là cột 2 của hàng đầu tiên',
            ),
            B(
              '<code>cut</code> treats <em>every single</em> delimiter as a separator, so two consecutive spaces mean an empty field between them; <code>awk</code>\'s default splitting collapses runs of whitespace, which is why it lands on the column a human would call the third',
              '<code>cut</code> coi TỪNG dấu phân tách một là một chỗ ngắt, nên hai dấu cách liền nhau nghĩa là có một trường rỗng ở giữa; còn phép cắt mặc định của <code>awk</code> gộp các dãy khoảng trắng lại, nên nó rơi đúng vào cái cột mà con người gọi là cột thứ ba',
            ),
            B(
              '<code>cut</code> reads the file in binary mode and stops at the first byte it cannot classify, so the alignment padding truncates the first line and shifts every field on the lines that follow',
              '<code>cut</code> đọc file ở chế độ nhị phân và dừng ở byte đầu tiên nó không phân loại được, nên phần đệm căn cột cắt cụt dòng đầu và đẩy lệch mọi trường ở các dòng sau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. Line one is <code>INFO</code> + three spaces, so <code>cut</code> sees fields <code>INFO</code>, <code>""</code>, <code>""</code> — field 3 is empty. Line two happens to have two spaces, so field 3 lands on the path. Lesson 3.4 states the division of labour: reach for <code>cut</code> when the delimiter is a real single character (<code>:</code>, <code>,</code>, tab) and for <code>awk</code> on anything space-aligned such as <code>ls -l</code> or <code>ps aux</code>. Note the symmetry from lesson 3.6 — the moment you write <code>awk -F,</code>, that friendliness stops and two commas in a row mean an empty field again, which is correct for CSV and surprising if you were not expecting it.',
            'Đã đo. Dòng một là <code>INFO</code> cộng ba dấu cách, nên <code>cut</code> thấy các trường <code>INFO</code>, <code>""</code>, <code>""</code> — trường 3 rỗng. Dòng hai tình cờ chỉ có hai dấu cách nên trường 3 rơi đúng vào đường dẫn. Bài 3.4 phân vai rõ: vớ lấy <code>cut</code> khi dấu phân tách là một ký tự đơn thật sự (<code>:</code>, <code>,</code>, tab) và vớ lấy <code>awk</code> với mọi thứ căn theo dấu cách như <code>ls -l</code> hay <code>ps aux</code>. Để ý tính đối xứng ở bài 3.6 — ngay khi bạn viết <code>awk -F,</code> thì sự thân thiện đó chấm dứt và hai dấu phẩy liền nhau lại có nghĩa là một trường rỗng, điều đúng với CSV và gây bất ngờ nếu bạn không lường trước.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on GNU sed 4.9:' + code(
              '$ echo "a=1" | sed "s/1/x&y/"\n' +
              'a=x1y\n' +
              '$ echo "a=1" | sed "s/1/x\\&y/"\n' +
              'a=x&y',
            ) + 'What is the rule, and why does the lesson call it a trap rather than a syntax error?',
            'Chạy thật trên GNU sed 4.9:' + code(
              '$ echo "a=1" | sed "s/1/x&y/"\n' +
              'a=x1y\n' +
              '$ echo "a=1" | sed "s/1/x\\&y/"\n' +
              'a=x&y',
            ) + 'Quy tắc ở đây là gì, và vì sao bài học gọi nó là một cái BẪY chứ không phải một lỗi cú pháp?',
          ),
          options: [
            B(
              '<code>&amp;</code> in the replacement means "repeat the previous replacement", so it is only meaningful from the second substitution onwards and silently expands to nothing on the first one',
              '<code>&amp;</code> trong phần thay thế nghĩa là "lặp lại phần thay thế trước đó", nên nó chỉ có nghĩa từ lần thay thế thứ hai trở đi và âm thầm khai triển thành rỗng ở lần đầu',
            ),
            B(
              '<code>&amp;</code> is a placeholder for the delimiter, so it inserts a literal slash; escaping it produces the ampersand instead, which is why the two outputs differ by one character',
              '<code>&amp;</code> là chỗ giữ chân cho dấu phân tách nên nó chèn vào một dấu gạch chéo nguyên văn; thoát nó đi thì cho ra dấu và, đó là lý do hai kết quả lệch nhau một ký tự',
            ),
            B(
              '<code>&amp;</code> is only special when the pattern contains a capture group; here there is none, so the first output is a quirk of GNU sed that BSD sed does not reproduce',
              '<code>&amp;</code> chỉ đặc biệt khi cái mẫu có nhóm bắt giữ; ở đây không có nhóm nào, nên kết quả đầu là một điểm lạ của GNU sed mà BSD sed không tái hiện',
            ),
            B(
              'In the replacement text <code>&amp;</code> stands for the <em>whole match</em>, so it inserted <code>1</code>. It is a trap because a replacement containing a literal ampersand — a URL query string, an HTML entity — produces plausible-looking wrong output instead of an error',
              'Trong phần thay thế, <code>&amp;</code> đại diện cho TOÀN BỘ chỗ khớp, nên nó chèn vào chữ <code>1</code>. Đó là cái bẫy vì một chuỗi thay thế có chứa dấu và nguyên văn — chuỗi truy vấn URL, một thực thể HTML — sẽ cho ra kết quả sai mà nhìn vẫn hợp lý, thay vì báo lỗi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. Lesson 3.5 lists the three characters that are special on the replacement side — <code>&amp;</code>, <code>\\1</code>–<code>\\9</code>, and the delimiter itself — and this one is the dangerous member of the set because nothing fails. The related habit from the same lesson is worth keeping: build the expression without <code>-i</code> and read the output first, and switch the delimiter to <code>|</code> or <code>#</code> the moment a path appears, since <code>s|/usr/local|/opt|g</code> is legible while the escaped-slash version is where sed bugs hide.',
            'Đã đo. Bài 3.5 liệt kê ba ký tự đặc biệt ở phía thay thế — <code>&amp;</code>, <code>\\1</code>–<code>\\9</code>, và chính dấu phân tách — và cái này là thành viên nguy hiểm nhất của nhóm vì chẳng có gì hỏng cả. Thói quen liên quan ở cùng bài học đáng giữ: dựng biểu thức mà chưa gắn <code>-i</code> rồi đọc kết quả trước đã, và đổi dấu phân tách sang <code>|</code> hay <code>#</code> ngay khi có một đường dẫn xuất hiện, vì <code>s|/usr/local|/opt|g</code> thì đọc được còn bản thoát gạch chéo mới là nơi lỗi sed ẩn mình.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on gawk 5.2.1. The same one-liner is applied to comma-separated and to space-aligned input:' + code(
              '$ printf "an,,29\\n" | awk -F, \'{print NF" fields; f2=["$2"]"}\'\n' +
              '3 fields; f2=[]\n' +
              '$ printf "an    hanoi   31\\n" | awk \'{print NF" fields; f2=["$2"]"}\'\n' +
              '3 fields; f2=[hanoi]',
            ) + 'What does this show about awk\'s field splitting?',
            'Chạy thật trên gawk 5.2.1. Cùng một dòng lệnh áp lên đầu vào ngăn bằng dấu phẩy và lên đầu vào căn bằng dấu cách:' + code(
              '$ printf "an,,29\\n" | awk -F, \'{print NF" fields; f2=["$2"]"}\'\n' +
              '3 fields; f2=[]\n' +
              '$ printf "an    hanoi   31\\n" | awk \'{print NF" fields; f2=["$2"]"}\'\n' +
              '3 fields; f2=[hanoi]',
            ) + 'Điều này cho thấy gì về cách awk cắt trường?',
          ),
          options: [
            B(
              'The default separator collapses runs of whitespace into one break, so four spaces still yield three fields — but setting <code>-F,</code> switches to a strict single-character separator, where two commas in a row really do mean an empty field 2',
              'Dấu phân tách mặc định gộp các dãy khoảng trắng thành một chỗ ngắt, nên bốn dấu cách vẫn cho ba trường — nhưng đặt <code>-F,</code> là chuyển sang dấu phân tách một ký tự nghiêm ngặt, nơi hai dấu phẩy liền nhau thật sự nghĩa là trường 2 rỗng',
            ),
            B(
              '<code>NF</code> always reports the number of separators plus one regardless of content, so both lines report 3 by coincidence; the empty field 2 in the first case comes from awk trimming a trailing separator',
              '<code>NF</code> luôn báo số dấu phân tách cộng một bất kể nội dung, nên hai dòng cùng báo 3 chỉ là trùng hợp; còn trường 2 rỗng ở ca đầu là do awk cắt bỏ một dấu phân tách ở cuối',
            ),
            B(
              '<code>-F,</code> also collapses runs, exactly like the default, so the empty field 2 must come from the input containing a zero-width character between the two commas rather than from the separator rule',
              '<code>-F,</code> cũng gộp các dãy, y hệt mặc định, nên trường 2 rỗng phải là do đầu vào có một ký tự rộng bằng không nằm giữa hai dấu phẩy chứ không phải do quy tắc phân tách',
            ),
            B(
              'Setting <code>-F</code> to any value disables field splitting entirely and makes <code>$2</code> a substring index instead, which is why one case prints a word and the other prints nothing',
              'Đặt <code>-F</code> thành bất kỳ giá trị nào là tắt hẳn việc cắt trường và biến <code>$2</code> thành một chỉ số chuỗi con, nên ca này in ra một từ còn ca kia không in gì',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. This asymmetry is what makes <code>awk \'{print $3}\'</code> the right tool on <code>ls -l</code> and <code>ps aux</code> where <code>cut -d\' \'</code> fails, and it is also why a CSV with an empty cell behaves correctly under <code>-F,</code> rather than silently shifting every later column. Two idioms from lesson 3.6 follow from the same variable: <code>awk \'NF\'</code> drops blank lines, because <code>NF</code> is 0 there and awk treats 0 as false, and <code>$NF</code> is the last field whatever its position — useful when the interesting column is at the end of a line of varying width.',
            'Đã đo. Chính sự bất đối xứng này làm <code>awk \'{print $3}\'</code> thành công cụ đúng trên <code>ls -l</code> và <code>ps aux</code> ở chỗ <code>cut -d\' \'</code> hỏng, và cũng là lý do một file CSV có ô rỗng hành xử đúng dưới <code>-F,</code> thay vì âm thầm đẩy lệch mọi cột phía sau. Hai lối viết quen thuộc ở bài 3.6 đều đi ra từ cùng cái biến ấy: <code>awk \'NF\'</code> loại bỏ dòng trống, vì ở đó <code>NF</code> bằng 0 và awk coi 0 là sai, còn <code>$NF</code> là trường CUỐI dù nó nằm ở vị trí nào — rất hữu ích khi cột đáng quan tâm nằm ở cuối một dòng có độ rộng thay đổi.',
          ),
        }),

        // ── Chương 4 — Quyền, người dùng & sudo ─────────────────────────
        mcq({
          prompt: B(
            'Real run on Linux as the unprivileged user <code>alice</code>. The file itself is world-readable:' + code(
              '$ namei -l /srv/app/config/db.yml\n' +
              'f: /srv/app/config/db.yml\n' +
              'drwxr-xr-x root root /\n' +
              'drwxr-xr-x root root srv\n' +
              'drwxr-xr-x root root app\n' +
              'drwxr-x--- root root config\n' +
              '-rw-r--r-- root root db.yml\n' +
              '\n' +
              '$ cat /srv/app/config/db.yml\n' +
              'cat: /srv/app/config/db.yml: Permission denied',
            ) + 'What is blocking her, and what would fix it?',
            'Chạy thật trên Linux bằng người dùng thường <code>alice</code>. Bản thân cái file thì cả thế giới đọc được:' + code(
              '$ namei -l /srv/app/config/db.yml\n' +
              'f: /srv/app/config/db.yml\n' +
              'drwxr-xr-x root root /\n' +
              'drwxr-xr-x root root srv\n' +
              'drwxr-xr-x root root app\n' +
              'drwxr-x--- root root config\n' +
              '-rw-r--r-- root root db.yml\n' +
              '\n' +
              '$ cat /srv/app/config/db.yml\n' +
              'cat: /srv/app/config/db.yml: Permission denied',
            ) + 'Cái gì đang chặn cô ấy, và sửa thế nào cho đúng?',
          ),
          options: [
            B(
              'The file is owned by <code>root</code>, and a file owned by root can only be read by root regardless of its mode bits; <code>sudo chown alice db.yml</code> is the fix',
              'File thuộc về <code>root</code>, và file do root sở hữu thì chỉ root đọc được bất kể các bit chế độ của nó; cách sửa là <code>sudo chown alice db.yml</code>',
            ),
            B(
              'The directory <code>config</code> is <code>drwxr-x---</code>, so "other" has no <code>x</code> and alice cannot traverse it. Every component of a path needs <code>x</code>, and the walk stops there — so <code>chmod</code> on <code>db.yml</code> would change nothing. Grant traversal on that one directory, or use a group',
              'Thư mục <code>config</code> mang quyền <code>drwxr-x---</code> nên lớp "other" không có <code>x</code> và alice không đi xuyên qua được. Mọi thành phần của một đường dẫn đều cần <code>x</code>, và cuộc đi dừng ngay ở đó — nên <code>chmod</code> lên <code>db.yml</code> sẽ chẳng thay đổi gì. Hãy cấp quyền đi xuyên cho đúng thư mục đó, hoặc dùng một nhóm',
            ),
            B(
              'The file lacks the <code>x</code> bit, and <code>cat</code> needs execute permission to open a file for reading on a filesystem mounted without <code>relatime</code>; <code>chmod +x db.yml</code> is the fix',
              'File thiếu bit <code>x</code>, mà <code>cat</code> cần quyền chạy mới mở được file để đọc trên một hệ thống file gắn kết không có <code>relatime</code>; cách sửa là <code>chmod +x db.yml</code>',
            ),
            B(
              'The permissions are fine and the refusal comes from AppArmor, since <code>namei -l</code> shows nothing wrong; check <code>dmesg -T</code> and add the path to the profile',
              'Quyền đã ổn và việc từ chối đến từ AppArmor, vì <code>namei -l</code> chẳng cho thấy gì sai cả; hãy xem <code>dmesg -T</code> rồi thêm đường dẫn đó vào profile',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured with a real unprivileged account — <code>ls -l</code> on the same path also failed, with exit status 2. This is the single most important idea in chapter 4: <code>x</code> on a directory means "you may pass through", and the kernel checks it on <em>every</em> component before the file\'s own mode is ever consulted. That is why a world-readable file can be unreadable, and why people conclude permissions are broken and reach for <code>chmod -R 777</code>. <code>namei -l</code> ends the argument by printing the mode of each component, so the failing one is visible rather than inferred. The correct repair is one directory: <code>chmod o+x /srv/app/config</code>, or better, a group both sides belong to.',
            'Đo bằng một tài khoản thường thật — <code>ls -l</code> trên cùng đường dẫn cũng hỏng, mã thoát 2. Đây là ý quan trọng nhất của chương 4: <code>x</code> trên thư mục nghĩa là "được phép đi xuyên qua", và kernel kiểm tra nó ở TỪNG thành phần trước khi ngó tới chế độ của chính cái file. Vì thế một file cả thế giới đọc được vẫn có thể không đọc nổi, và vì thế người ta kết luận là quyền hỏng rồi vớ lấy <code>chmod -R 777</code>. <code>namei -l</code> chấm dứt tranh cãi bằng cách in chế độ của từng thành phần, nên chỗ hỏng hiện ra chứ không phải đoán. Cách chữa đúng chỉ đụng một thư mục: <code>chmod o+x /srv/app/config</code>, hoặc tốt hơn là một nhóm mà cả hai bên cùng thuộc về.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. The same tree is reset to the same starting modes before each command:' + code(
              '$ ls -l srv          # starting point\n' +
              'drwx------  config\n' +
              '-rwx------  deploy.sh\n' +
              '-rw-------  package.json\n' +
              '\n' +
              '$ chmod -R 755 srv          ; ls -l srv\n' +
              'drwxr-xr-x  config\n' +
              '-rwxr-xr-x  deploy.sh\n' +
              '-rwxr-xr-x  package.json      <-- now executable\n' +
              '\n' +
              '$ chmod -R u=rwX,go=rX srv  ; ls -l srv\n' +
              'drwxr-xr-x  config\n' +
              '-rwxr-xr-x  deploy.sh\n' +
              '-rw-r--r--  package.json',
            ) + 'What does the capital <code>X</code> mean?',
            'Chạy thật. Cây thư mục được đặt lại về cùng bộ chế độ ban đầu trước mỗi lệnh:' + code(
              '$ ls -l srv          # điểm xuất phát\n' +
              'drwx------  config\n' +
              '-rwx------  deploy.sh\n' +
              '-rw-------  package.json\n' +
              '\n' +
              '$ chmod -R 755 srv          ; ls -l srv\n' +
              'drwxr-xr-x  config\n' +
              '-rwxr-xr-x  deploy.sh\n' +
              '-rwxr-xr-x  package.json      <-- giờ đã chạy được\n' +
              '\n' +
              '$ chmod -R u=rwX,go=rX srv  ; ls -l srv\n' +
              'drwxr-xr-x  config\n' +
              '-rwxr-xr-x  deploy.sh\n' +
              '-rw-r--r--  package.json',
            ) + 'Chữ <code>X</code> HOA nghĩa là gì?',
          ),
          options: [
            B(
              'Capital <code>X</code> means "execute for the owner only", so directories and scripts keep working while data files lose the bit for group and other — the group and other classes simply never receive it',
              'Chữ <code>X</code> hoa nghĩa là "quyền chạy chỉ cho chủ sở hữu", nên thư mục và script vẫn chạy được còn file dữ liệu mất bit đó với group và other — hai lớp group và other đơn giản là không bao giờ nhận được nó',
            ),
            B(
              'Capital <code>X</code> defers the decision to the <code>umask</code>, so the result depends on the shell that ran the command; here <code>umask 022</code> happened to strip execute from the JSON file and keep it on the script',
              'Chữ <code>X</code> hoa đẩy quyết định sang cho <code>umask</code>, nên kết quả phụ thuộc vào shell đã chạy lệnh; ở đây <code>umask 022</code> tình cờ bóc bit chạy khỏi file JSON và giữ lại cho script',
            ),
            B(
              'Capital <code>X</code> grants execute <em>only</em> to directories and to files that already have some execute bit set. Directories get their traversal bit, existing scripts keep theirs, and plain data files are left alone — in one command that is safe to re-run',
              'Chữ <code>X</code> hoa CHỈ cấp quyền chạy cho thư mục và cho những file vốn đã có ít nhất một bit chạy. Thư mục nhận bit đi xuyên, script cũ giữ nguyên bit của mình, còn file dữ liệu thuần thì để yên — gói trong một câu lệnh chạy lại nhiều lần vẫn an toàn',
            ),
            B(
              'Capital <code>X</code> is the symbolic spelling of the setgid bit, so it replaces the leading digit in a four-digit <code>chmod</code>; the executable bits in the output come from the <code>rw</code> and <code>r</code> clauses instead',
              'Chữ <code>X</code> hoa là cách viết ký hiệu của bit setgid nên nó thay cho chữ số đứng đầu trong một lệnh <code>chmod</code> bốn chữ số; các bit chạy trong kết quả là do những mệnh đề <code>rw</code> và <code>r</code> mang lại',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured, both runs from the same starting modes. <code>chmod -R 755</code> applies one mode to files and directories alike, but directories need <code>x</code> and data files must not have it — so every <code>.env</code>, <code>.json</code> and image in the tree becomes executable. Lesson 4.2 calls capital <code>X</code> one of the highest-value details in the chapter, and the explicit alternative is worth knowing too: <code>find /srv/app -type d -exec chmod 755 {} +</code> then <code>find /srv/app -type f -exec chmod 644 {} +</code>. Before any recursive <code>chmod</code> or <code>chown</code>, run the same selection with <code>find … -print</code> first: recursive permission changes are as irreversible as <code>rm</code>, and far quieter about it.',
            'Đã đo, cả hai lượt đều xuất phát từ cùng bộ chế độ. <code>chmod -R 755</code> áp cùng một chế độ cho cả file lẫn thư mục, nhưng thư mục thì cần <code>x</code> còn file dữ liệu thì tuyệt đối không được có — nên mọi file <code>.env</code>, <code>.json</code> và ảnh trong cây đều thành chạy được. Bài 4.2 gọi chữ <code>X</code> hoa là một trong những chi tiết đáng giá nhất chương, và cách viết tường minh cũng đáng biết: <code>find /srv/app -type d -exec chmod 755 {} +</code> rồi <code>find /srv/app -type f -exec chmod 644 {} +</code>. Trước bất kỳ lệnh <code>chmod</code> hay <code>chown</code> đệ quy nào, hãy chạy đúng phép chọn đó với <code>find … -print</code> trước: đổi quyền đệ quy thì cũng không hoàn tác được như <code>rm</code>, mà lại còn im hơn nhiều.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. <code>alice</code> creates a file she fully owns, then tries to give it away. She is <b>not</b> a member of the group <code>devs</code>:' + code(
              '$ ls -l mine.txt\n' +
              '-rw-r--r-- 1 alice alice 0 Sep 10 00:32 mine.txt\n' +
              '$ chown bob mine.txt\n' +
              "chown: changing ownership of 'mine.txt': Operation not permitted\n" +
              '$ chgrp devs mine.txt\n' +
              "chgrp: changing group of 'mine.txt': Operation not permitted",
            ) + 'Why is even giving away your own file forbidden?',
            'Chạy thật. <code>alice</code> tạo một file cô ấy sở hữu hoàn toàn, rồi thử cho đi. Cô ấy KHÔNG phải thành viên của nhóm <code>devs</code>:' + code(
              '$ ls -l mine.txt\n' +
              '-rw-r--r-- 1 alice alice 0 Sep 10 00:32 mine.txt\n' +
              '$ chown bob mine.txt\n' +
              "chown: changing ownership of 'mine.txt': Operation not permitted\n" +
              '$ chgrp devs mine.txt\n' +
              "chgrp: changing group of 'mine.txt': Operation not permitted",
            ) + 'Vì sao cho đi chính file của mình cũng bị cấm?',
          ),
          options: [
            B(
              'Because the file has no group-write bit, so no ownership change is accepted until <code>chmod g+w</code> has been applied first; both commands would then succeed without root',
              'Vì file không có bit ghi cho nhóm, nên không phép đổi sở hữu nào được chấp nhận cho tới khi <code>chmod g+w</code> được áp dụng trước; sau đó cả hai lệnh sẽ thành công mà không cần root',
            ),
            B(
              'Because <code>bob</code> and <code>devs</code> do not exist in <code>/etc/passwd</code> and <code>/etc/group</code> respectively, and the kernel reports an unknown target as a permission failure rather than a lookup failure',
              'Vì <code>bob</code> và <code>devs</code> lần lượt không tồn tại trong <code>/etc/passwd</code> và <code>/etc/group</code>, và kernel báo một đích không rõ dưới dạng lỗi quyền chứ không phải lỗi tra cứu',
            ),
            B(
              'Because ownership can only be changed while the file is empty and unopened; a zero-byte file created moments earlier is still held open by the shell that created it, which blocks both calls',
              'Vì chỉ đổi được sở hữu khi file còn rỗng và chưa ai mở; một file 0 byte vừa tạo vẫn đang bị chính shell tạo ra nó giữ mở, và điều đó chặn cả hai lời gọi',
            ),
            B(
              '<code>chown</code> always requires root — deliberately, because on a system with disk quotas being able to hand a file to someone else would let you dump your storage onto their account. <code>chgrp</code> is allowed without root, but only to a group you belong to',
              '<code>chown</code> luôn đòi quyền root — một cách CỐ Ý, vì trên hệ thống có hạn ngạch đĩa, việc đẩy được file sang người khác đồng nghĩa với việc trút dung lượng của mình vào tài khoản họ. <code>chgrp</code> thì không cần root, nhưng chỉ được đổi sang nhóm mà bạn là thành viên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured as <code>alice</code> in a world-writable directory, so nothing else could be blocking her. Lesson 4.2 gives both halves of the rule and the quota reasoning behind the first. The second half is the practically useful one: <code>chgrp devs f</code> would have worked if alice were in <code>devs</code>, which is why the shared-directory recipe is built on group membership rather than on ownership transfers. Note also that "Operation not permitted" here is <code>EPERM</code>, not <code>EACCES</code> — the same wording appears for the immutable attribute and inside containers missing a capability, which is why lesson 4.5 lists it separately from "Permission denied".',
            'Đo bằng tài khoản <code>alice</code> trong một thư mục cả thế giới ghi được, nên không có thứ gì khác chặn cô ấy. Bài 4.2 nêu cả hai nửa của quy tắc và lý lẽ hạn ngạch đằng sau nửa đầu. Nửa sau mới là phần dùng được: <code>chgrp devs f</code> sẽ chạy được nếu alice ở trong <code>devs</code>, và đó là lý do công thức thư mục dùng chung dựng trên tư cách thành viên nhóm chứ không dựng trên việc chuyển quyền sở hữu. Cũng lưu ý "Operation not permitted" ở đây là <code>EPERM</code> chứ không phải <code>EACCES</code> — đúng câu chữ đó cũng xuất hiện với thuộc tính immutable và bên trong container thiếu capability, nên bài 4.5 mới liệt kê nó tách khỏi "Permission denied".',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. Two directories, same group <code>devs</code>, differing only in the leading digit. <code>alice</code> (primary group <code>alice</code>) creates one file in each, with the default <code>umask 022</code>:' + code(
              '$ ls -ld plain shared\n' +
              'drwxrwxr-x 2 root devs 4096 plain      <- chmod 775\n' +
              'drwxrwsr-x 2 root devs 4096 shared     <- chmod 2775\n' +
              '\n' +
              '$ ls -l plain/a.txt shared/a.txt\n' +
              '-rw-r--r-- 1 alice alice 0 plain/a.txt\n' +
              '-rw-r--r-- 1 alice devs  0 shared/a.txt',
            ) + 'The group is now right in <code>shared</code>. Is that enough for a team to edit each other\'s files?',
            'Chạy thật. Hai thư mục, cùng nhóm <code>devs</code>, chỉ khác nhau ở chữ số đứng đầu. <code>alice</code> (nhóm chính là <code>alice</code>) tạo một file trong mỗi thư mục, với <code>umask 022</code> mặc định:' + code(
              '$ ls -ld plain shared\n' +
              'drwxrwxr-x 2 root devs 4096 plain      <- chmod 775\n' +
              'drwxrwsr-x 2 root devs 4096 shared     <- chmod 2775\n' +
              '\n' +
              '$ ls -l plain/a.txt shared/a.txt\n' +
              '-rw-r--r-- 1 alice alice 0 plain/a.txt\n' +
              '-rw-r--r-- 1 alice devs  0 shared/a.txt',
            ) + 'Nhóm ở <code>shared</code> giờ đã đúng. Thế đã đủ để cả đội sửa file của nhau chưa?',
          ),
          options: [
            B(
              'No. setgid fixed the <em>group</em>, but the new file is still <code>rw-r--r--</code>: <code>umask 022</code> strips group write before setgid ever applies. The complete recipe is chgrp + chmod 2775 + <code>umask 002</code>',
              'Chưa. setgid đã sửa đúng cái NHÓM, nhưng file mới vẫn là <code>rw-r--r--</code>: <code>umask 022</code> bóc mất quyền ghi của nhóm trước khi setgid kịp áp dụng. Công thức đầy đủ là chgrp + chmod 2775 + <code>umask 002</code>',
            ),
            B(
              'Yes. Once the group is inherited, the directory\'s own <code>rwxrwsr-x</code> mode is what governs writes to the files inside it, so any member of <code>devs</code> can already edit <code>shared/a.txt</code>',
              'Rồi. Một khi nhóm đã được thừa kế thì chế độ <code>rwxrwsr-x</code> của chính thư mục là thứ quyết định việc ghi vào các file bên trong, nên bất kỳ thành viên nào của <code>devs</code> cũng đã sửa được <code>shared/a.txt</code>',
            ),
            B(
              'No, and the missing piece is the sticky bit: without it teammates can delete each other\'s files but not modify them, so the directory needs <code>chmod 3775</code> rather than a umask change',
              'Chưa, và mảnh còn thiếu là bit dính: không có nó thì đồng đội xoá được file của nhau mà không sửa được, nên thư mục cần <code>chmod 3775</code> chứ không phải đổi umask',
            ),
            B(
              'Yes, provided every member logs out and back in, because setgid on a directory is only consulted when the group list is loaded at login and not on each file creation',
              'Rồi, miễn là mọi thành viên đăng xuất rồi vào lại, vì setgid trên thư mục chỉ được tra khi danh sách nhóm được nạp lúc đăng nhập chứ không phải ở mỗi lần tạo file',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured with a real account. Look closely at the two files: the group did change from <code>alice</code> to <code>devs</code>, which is exactly what setgid does and what the <code>s</code> in <code>drwxrwsr-x</code> announces. But both files came out <code>rw-r--r--</code>, because the process asked for 666 and <code>umask 022</code> cleared group and other write before the mode ever reached the disk. Lesson 4.3 names all three parts of the recipe and warns that two out of three produces a directory that looks configured and quietly is not. One further trap from the same lesson: a three-digit <code>chmod 775</code> on this directory silently clears the setgid bit, and the breakage surfaces days later as "Bob cannot edit my files any more".',
            'Đo bằng tài khoản thật. Hãy nhìn kỹ hai file: nhóm ĐÃ đổi từ <code>alice</code> sang <code>devs</code>, đúng thứ setgid làm và đúng thứ chữ <code>s</code> trong <code>drwxrwsr-x</code> loan báo. Nhưng cả hai file đều ra <code>rw-r--r--</code>, vì tiến trình xin 666 còn <code>umask 022</code> đã xoá quyền ghi của group và other trước khi chế độ kịp chạm đĩa. Bài 4.3 gọi tên cả ba phần của công thức và cảnh báo rằng làm đúng hai trên ba sẽ cho ra một thư mục trông như đã cấu hình mà lặng lẽ thì không. Thêm một cái bẫy ở cùng bài: một lệnh <code>chmod 775</code> ba chữ số trên thư mục này sẽ âm thầm xoá mất bit setgid, và hỏng hóc chỉ lộ ra vài ngày sau dưới dạng "Bob không sửa được file của tôi nữa".',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. Both files are owned by <code>root</code> and both carry mode 4755. <code>alice</code> runs each one:' + code(
              '$ ls -l whoami.sh id-copy\n' +
              '-rwsr-xr-x 1 root root    61 whoami.sh     # a bash script\n' +
              '-rwsr-xr-x 1 root root 48144 id-copy       # a copy of /usr/bin/id\n' +
              '\n' +
              '$ ./whoami.sh          # prints the effective uid\n' +
              'euid=1000\n' +
              '$ ./id-copy -u\n' +
              '0',
            ) + 'Why does the setuid bit work on one and not the other?',
            'Chạy thật. Cả hai file đều thuộc về <code>root</code> và cùng mang chế độ 4755. <code>alice</code> chạy từng cái:' + code(
              '$ ls -l whoami.sh id-copy\n' +
              '-rwsr-xr-x 1 root root    61 whoami.sh     # một script bash\n' +
              '-rwsr-xr-x 1 root root 48144 id-copy       # một bản sao của /usr/bin/id\n' +
              '\n' +
              '$ ./whoami.sh          # in ra uid hiệu lực\n' +
              'euid=1000\n' +
              '$ ./id-copy -u\n' +
              '0',
            ) + 'Vì sao bit setuid ăn với cái này mà không ăn với cái kia?',
          ),
          options: [
            B(
              'The script is too small to be loaded with elevated privileges: the kernel only applies setuid to files above a size threshold, which the 48 KB binary clears and the 61-byte script does not',
              'Cái script quá nhỏ để được nạp với đặc quyền nâng cao: kernel chỉ áp dụng setuid cho file lớn hơn một ngưỡng kích thước, thứ mà file nhị phân 48 KB vượt qua còn script 61 byte thì không',
            ),
            B(
              'Linux <b>ignores</b> the setuid bit on interpreted scripts entirely — <code>chmod</code> reports no error and <code>ls -l</code> shows the <code>s</code>, but the script simply runs with the caller\'s own privileges. The reason is an unclosable race between the kernel checking the file and the interpreter opening it',
              'Linux BỎ QUA hoàn toàn bit setuid trên script được thông dịch — <code>chmod</code> không báo lỗi nào và <code>ls -l</code> vẫn hiện chữ <code>s</code>, nhưng script đơn giản là chạy với đặc quyền của chính người gọi. Lý do là một điều kiện tranh chấp không thể đóng được giữa lúc kernel kiểm tra file và lúc trình thông dịch mở nó',
            ),
            B(
              'The script needs the setuid bit on its interpreter, not on itself: running <code>chmod 4755 /bin/bash</code> would make it behave like the binary, which is the documented way to write privileged scripts',
              'Cái script cần bit setuid đặt trên trình thông dịch của nó chứ không phải trên chính nó: chạy <code>chmod 4755 /bin/bash</code> sẽ làm nó hành xử như file nhị phân, và đó là cách viết script có đặc quyền theo tài liệu',
            ),
            B(
              'The shebang line pointed at <code>/bin/bash</code>, which is itself a symlink; setuid is dropped when the interpreter is reached through a symlink, and pointing the shebang at the real path would make it work',
              'Dòng shebang trỏ tới <code>/bin/bash</code>, mà bản thân đó là một liên kết tượng trưng; setuid bị bỏ khi trình thông dịch được với tới qua liên kết tượng trưng, và trỏ shebang vào đường dẫn thật sẽ làm nó chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured with both files side by side, run as a real unprivileged user: the copied binary reported uid 0 and the script reported 1000. Lesson 4.3 makes the point that the bit here is not a subtle risk — it is inert, which is worse in one specific way: it looks like it worked. If a user genuinely needs one privileged action, the answer is a narrow <code>sudo</code> rule (<code>deploy ALL = (root) NOPASSWD: /bin/systemctl restart myapp</code>), which is auditable, revocable and appears in the logs. A setuid binary is none of those things, which is also why <code>find / -perm -4000 -type f 2&gt;/dev/null</code> is worth running once on any server you inherit.',
            'Đo với cả hai file đặt cạnh nhau, chạy bằng một người dùng thường thật: bản nhị phân sao chép báo uid 0 còn script báo 1000. Bài 4.3 nêu rõ rằng bit ở đây không phải một rủi ro tinh vi — nó VÔ TÁC DỤNG, và điều đó tệ hơn ở đúng một điểm: nó trông như đã ăn. Nếu một người dùng thật sự cần đúng một hành động có đặc quyền thì câu trả lời là một luật <code>sudo</code> hẹp (<code>deploy ALL = (root) NOPASSWD: /bin/systemctl restart myapp</code>), thứ kiểm toán được, thu hồi được và có ghi vào log. Một file nhị phân setuid thì không có gì trong số đó, và đó cũng là lý do nên chạy <code>find / -perm -4000 -type f 2&gt;/dev/null</code> một lần trên mọi máy chủ bạn tiếp quản.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run. Two world-writable directories differing only in the leading digit. <code>alice</code> created a file in each, then <code>bob</code> tried to delete both:' + code(
              '$ ls -ld open sticky\n' +
              'drwxrwxrwx 2 root root 4096 open       <- chmod 777\n' +
              'drwxrwxrwt 2 root root 4096 sticky     <- chmod 1777\n' +
              '\n' +
              '$ rm -f open/alice.txt   ; echo $?\n' +
              '0\n' +
              '$ rm -f sticky/alice.txt\n' +
              "rm: cannot remove 'sticky/alice.txt': Operation not permitted\n" +
              '$ echo $?\n' +
              '1',
            ) + 'What rule does the <code>t</code> add?',
            'Chạy thật. Hai thư mục cả thế giới ghi được, chỉ khác chữ số đứng đầu. <code>alice</code> tạo một file trong mỗi thư mục, rồi <code>bob</code> thử xoá cả hai:' + code(
              '$ ls -ld open sticky\n' +
              'drwxrwxrwx 2 root root 4096 open       <- chmod 777\n' +
              'drwxrwxrwt 2 root root 4096 sticky     <- chmod 1777\n' +
              '\n' +
              '$ rm -f open/alice.txt   ; echo $?\n' +
              '0\n' +
              '$ rm -f sticky/alice.txt\n' +
              "rm: cannot remove 'sticky/alice.txt': Operation not permitted\n" +
              '$ echo $?\n' +
              '1',
            ) + 'Chữ <code>t</code> thêm vào quy tắc gì?',
          ),
          options: [
            B(
              'It makes the directory read-only for everyone but its owner, so <code>bob</code> could not have created a file there either; write access is restored only by removing the bit',
              'Nó làm thư mục thành chỉ-đọc với mọi người trừ chủ sở hữu, nên <code>bob</code> cũng đã không thể tạo file ở đó; quyền ghi chỉ trở lại khi gỡ bit đó đi',
            ),
            B(
              'It marks the directory as temporary, so its contents are removed on reboot and individual deletions are refused in the meantime to keep the cleanup consistent',
              'Nó đánh dấu thư mục là tạm thời, nên nội dung bị xoá khi khởi động lại và trong lúc chờ thì mọi lệnh xoá lẻ bị từ chối để giữ việc dọn dẹp nhất quán',
            ),
            B(
              'It keeps the directory world-writable but restricts <em>removal</em>: you may remove or rename an entry only if you own the entry, own the directory, or are root. Any directory you make world-writable should have it',
              'Nó giữ thư mục vẫn cả thế giới ghi được nhưng hạn chế việc XOÁ: bạn chỉ được xoá hay đổi tên một mục nếu bạn sở hữu mục đó, sở hữu thư mục đó, hoặc là root. Mọi thư mục bạn để cả thế giới ghi được đều nên có bit này',
            ),
            B(
              'It turns off the <code>w</code> bit for the "other" class at delete time only, so writes to existing files still work but creating and deleting entries requires membership in the directory\'s group',
              'Nó tắt bit <code>w</code> của lớp "other" chỉ vào lúc xoá, nên việc ghi vào file sẵn có vẫn chạy còn tạo và xoá mục thì đòi phải là thành viên nhóm của thư mục',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured with two real accounts: in the plain 777 directory <code>bob</code> deleted a file belonging to <code>alice</code> without any prompt. The reason is lesson 4.1 — <code>w</code> on a directory means you may remove <em>any</em> entry in it, because deleting is <code>unlink()</code> on a name rather than an operation on the file. That is why <code>/tmp</code> ships as <code>drwxrwxrwt</code>: without the <code>t</code>, any user could delete every other user\'s temporary files, including the socket a database is listening on. Lesson 4.3 puts it as a rule worth memorising: if you ever type <code>chmod 777</code> on a shared directory, the number you meant was <code>1777</code>.',
            'Đo bằng hai tài khoản thật: trong thư mục 777 trơ trọi, <code>bob</code> xoá file của <code>alice</code> mà không bị hỏi han gì. Lý do nằm ở bài 4.1 — <code>w</code> trên thư mục nghĩa là bạn được xoá BẤT KỲ mục nào trong đó, vì xoá là <code>unlink()</code> tác động lên một cái tên chứ không phải một thao tác trên file. Vì thế <code>/tmp</code> mới ra đời với chế độ <code>drwxrwxrwt</code>: không có chữ <code>t</code> thì người dùng nào cũng xoá được file tạm của mọi người khác, kể cả cái socket mà một cơ sở dữ liệu đang lắng nghe. Bài 4.3 đúc thành một quy tắc đáng thuộc: hễ bạn gõ <code>chmod 777</code> lên một thư mục dùng chung thì con số bạn định gõ là <code>1777</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Real run on bash 5.2.15. Two scripts that both exist and both start with <code>#!/bin/bash</code>. The second was saved by an editor on Windows:' + code(
              '$ ls -l noexec.sh crlf.sh\n' +
              '-rw-r--r-- 1 root root 24 noexec.sh\n' +
              '-rwxr-xr-x 1 root root 26 crlf.sh\n' +
              '\n' +
              '$ ./noexec.sh\n' +
              'bash: ./noexec.sh: Permission denied\n' +
              '$ echo $?\n' +
              '126\n' +
              '\n' +
              '$ ./crlf.sh\n' +
              'bash: ./crlf.sh: cannot execute: required file not found\n' +
              '$ echo $?\n' +
              '127',
            ) + 'Two different failures. What is each one, and how do you fix it?',
            'Chạy thật trên bash 5.2.15. Hai script đều tồn tại và đều bắt đầu bằng <code>#!/bin/bash</code>. Cái thứ hai được lưu bằng một trình soạn thảo trên Windows:' + code(
              '$ ls -l noexec.sh crlf.sh\n' +
              '-rw-r--r-- 1 root root 24 noexec.sh\n' +
              '-rwxr-xr-x 1 root root 26 crlf.sh\n' +
              '\n' +
              '$ ./noexec.sh\n' +
              'bash: ./noexec.sh: Permission denied\n' +
              '$ echo $?\n' +
              '126\n' +
              '\n' +
              '$ ./crlf.sh\n' +
              'bash: ./crlf.sh: cannot execute: required file not found\n' +
              '$ echo $?\n' +
              '127',
            ) + 'Hai kiểu hỏng khác nhau. Mỗi cái là gì, và chữa thế nào?',
          ),
          options: [
            B(
              'Both are permission problems on the same file mode: 126 is the denial and 127 is the same denial after bash retried through <code>PATH</code>. <code>chmod +x</code> on both files resolves them',
              'Cả hai đều là vấn đề quyền trên cùng một chế độ file: 126 là lần từ chối và 127 là chính lần từ chối đó sau khi bash thử lại qua <code>PATH</code>. Chạy <code>chmod +x</code> lên cả hai file là xong',
            ),
            B(
              'The first is a missing shebang and the second a missing execute bit; the modes shown in <code>ls -l</code> are stale because <code>ls</code> caches them, so reading them is not a reliable diagnosis',
              'Cái đầu là thiếu dòng shebang còn cái sau là thiếu bit chạy; các chế độ hiện trong <code>ls -l</code> đã cũ vì <code>ls</code> lưu đệm chúng, nên đọc chúng không phải một cách chẩn đoán đáng tin',
            ),
            B(
              'Both files are fine and the failures come from the filesystem being mounted <code>noexec</code>; the two different exit codes are simply the two different messages the mount option produces for a script and for a binary',
              'Cả hai file đều ổn và hỏng hóc đến từ việc hệ thống file được gắn kết với <code>noexec</code>; hai mã thoát khác nhau chỉ là hai thông báo khác nhau mà tuỳ chọn gắn kết đó sinh ra cho script và cho file nhị phân',
            ),
            B(
              '<code>noexec.sh</code> lacks the execute bit, so the kernel refuses to run it (126) — fix with <code>chmod +x</code>. <code>crlf.sh</code> has the bit but its shebang ends in a carriage return, so the kernel looks for an interpreter literally named <code>/bin/bash\\r</code> and finds none (127) — fix with <code>dos2unix</code> or <code>tr -d</code>',
              '<code>noexec.sh</code> thiếu bit chạy nên kernel từ chối chạy nó (126) — chữa bằng <code>chmod +x</code>. Còn <code>crlf.sh</code> có bit đó nhưng dòng shebang của nó kết thúc bằng một ký tự về đầu dòng, nên kernel đi tìm một trình thông dịch tên đúng là <code>/bin/bash\\r</code> và không thấy (127) — chữa bằng <code>dos2unix</code> hoặc <code>tr -d</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, including <code>head -1 crlf.sh | cat -A</code>, which prints <code>#!/bin/bash^M$</code> — the <code>^M</code> is the carriage return. <b>Note the wording, because this exam follows the machine:</b> the course quotes the classic <code>bad interpreter: No such file or directory</code>, but bash 5.2.15 says <code>cannot execute: required file not found</code>. The diagnosis is unchanged and so is the fix — <code>tr -d &#39;\\r&#39; &lt; crlf.sh &gt; fixed.sh</code>, or <code>dos2unix</code>. What makes this one hard is that the error names a file that visibly exists, which is why lesson 4.5 lists both symptoms next to each other and why the exit code is worth reading: 126 means found but not executable, 127 means not found.',
            'Đã đo, kể cả lệnh <code>head -1 crlf.sh | cat -A</code>, thứ in ra <code>#!/bin/bash^M$</code> — chữ <code>^M</code> chính là ký tự về đầu dòng. HÃY ĐỂ Ý CÂU CHỮ, VÌ ĐỀ NÀY THEO MÁY: giáo trình trích câu kinh điển <code>bad interpreter: No such file or directory</code>, nhưng bash 5.2.15 nói <code>cannot execute: required file not found</code>. Cách chẩn đoán không đổi và cách chữa cũng vậy — <code>tr -d &#39;\\r&#39; &lt; crlf.sh &gt; fixed.sh</code>, hoặc <code>dos2unix</code>. Cái làm ca này khó là thông báo lỗi gọi tên một file rành rành đang tồn tại, nên bài 4.5 mới xếp hai triệu chứng cạnh nhau, và nên mã thoát mới đáng đọc: 126 nghĩa là tìm thấy nhưng không chạy được, 127 nghĩa là không tìm thấy.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Work out what a symbolic chmod does, without running chmod (chapter 4.2).</b> Implement <code>apply</code>, which takes a starting mode as three octal digits and a symbolic specification, and prints the resulting three octal digits on one line.</p>' +
            '<p>A specification is one or more <b>clauses</b> separated by commas, applied left to right. Each clause is <code>&lt;classes&gt;&lt;op&gt;&lt;perms&gt;</code>:</p>' +
            '<ul>' +
            '<li><b>classes</b> — any of <code>u</code> (owner), <code>g</code> (group), <code>o</code> (other), or <code>a</code> meaning all three. <b>An empty class list means <code>a</code></b>, so <code>+x</code> is <code>a+x</code>. Ignore <code>umask</code> entirely.</li>' +
            '<li><b>op</b> — <code>+</code> adds the bits, <code>-</code> removes them, <code>=</code> sets that class to exactly those bits and clears the rest.</li>' +
            '<li><b>perms</b> — any of <code>r</code> (4), <code>w</code> (2), <code>x</code> (1), in any order. It may be <b>empty</b>: <code>o=</code> means "other gets nothing".</li>' +
            '</ul>' +
            '<p>Print all three digits even when they are zero — <code>000</code>, not <code>0</code>.</p>' +
            '<p>The ten test cases cover the edges that decide this question: a clause with no class (<code>+x</code>), an <code>=</code> with an empty permission list (<code>o=</code>), a starting mode of <code>000</code>, several clauses in one specification, a clause that clears everything (<code>a-rwx</code>), and the same clause applied twice — which must be idempotent.</p>' +
            '<p>Keep the given array and the printing loop exactly as they are. Pure shell only: no <code>chmod</code>, no <code>stat</code>, no <code>awk</code>, no <code>python</code>.</p>',

            '<p><b>Câu 31 — Tính ra một lệnh chmod dạng ký hiệu sẽ cho kết quả gì, mà không chạy chmod (chương 4.2).</b> Cài đặt <code>apply</code>: nhận một chế độ xuất phát gồm ba chữ số hệ tám cùng một chuỗi ký hiệu, rồi in ra ba chữ số hệ tám kết quả trên một dòng.</p>' +
            '<p>Một chuỗi ký hiệu gồm một hay nhiều <b>mệnh đề</b> ngăn bằng dấu phẩy, áp dụng từ trái sang phải. Mỗi mệnh đề có dạng <code>&lt;lớp&gt;&lt;phép&gt;&lt;quyền&gt;</code>:</p>' +
            '<ul>' +
            '<li><b>lớp</b> — gồm <code>u</code> (chủ sở hữu), <code>g</code> (nhóm), <code>o</code> (người khác), hoặc <code>a</code> nghĩa là cả ba. <b>Danh sách lớp rỗng nghĩa là <code>a</code></b>, nên <code>+x</code> chính là <code>a+x</code>. Bỏ qua hoàn toàn <code>umask</code>.</li>' +
            '<li><b>phép</b> — <code>+</code> thêm các bit, <code>-</code> bỏ chúng đi, <code>=</code> đặt lớp đó thành đúng những bit ấy và xoá phần còn lại.</li>' +
            '<li><b>quyền</b> — gồm <code>r</code> (4), <code>w</code> (2), <code>x</code> (1), theo thứ tự tuỳ ý. Nó có thể RỖNG: <code>o=</code> nghĩa là "người khác không được gì".</li>' +
            '</ul>' +
            '<p>Luôn in đủ ba chữ số kể cả khi chúng bằng không — <code>000</code> chứ không phải <code>0</code>.</p>' +
            '<p>Mười ca thử phủ đúng những chỗ biên quyết định câu này: mệnh đề không có lớp (<code>+x</code>), phép <code>=</code> với danh sách quyền rỗng (<code>o=</code>), chế độ xuất phát <code>000</code>, nhiều mệnh đề trong một chuỗi, một mệnh đề xoá sạch mọi thứ (<code>a-rwx</code>), và cùng một mệnh đề áp hai lần — thứ phải cho ra kết quả không đổi.</p>' +
            '<p>Giữ nguyên mảng cho sẵn và vòng lặp in kết quả. Chỉ dùng shell thuần: không <code>chmod</code>, không <code>stat</code>, không <code>awk</code>, không <code>python</code>.</p>',
          ),
          starterCode: Q31_STARTER,
          expectedOutput: Q31_OUTPUT,
          sampleSolution: Q31_SOLUTION,
        }),

        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q32 — Be the shell: expand a glob yourself (chapter 2.2).</b> Implement <code>expand</code>, which takes a pattern followed by the names in a directory, and prints the one line the shell would have built. Each resulting argument is wrapped in square brackets so that a name containing a space stays visible as <em>one</em> argument:</p>' +
            code(
              '*.txt -> [file1.txt] [file10.txt] [file2.txt]',
            ) +
            '<p>Four rules decide this question, and each of the eight patterns is there to test one of them.</p>' +
            '<ul>' +
            '<li><b>Matching.</b> <code>*</code> is any run of characters including none, <code>?</code> is exactly one, <code>[0-9]</code> is one character from the set and <code>[!f]</code> is one character <em>not</em> in it. You do not have to write a matcher — the shell already has one, and <code>case</code> does pattern matching rather than string comparison when the pattern is left unquoted.</li>' +
            '<li><b>The leading dot is special.</b> A glob never matches a name beginning with <code>.</code> unless the pattern itself begins with a literal dot. That is why <code>rm *</code> in your home directory does not destroy <code>.ssh</code>, and it is a rule of <em>filename expansion</em> that plain pattern matching does not apply for you.</li>' +
            '<li><b>A pattern that matches nothing.</b> In default bash it is passed through <b>literally</b>, as a single argument — so <code>*.csv</code> in a directory with no CSV files produces <code>[*.csv]</code>, not an empty line. This is the behaviour <code>shopt -s nullglob</code> exists to change.</li>' +
            '<li><b>The result is sorted.</b> Sort by <b>byte</b> order, which is what <code>LC_ALL=C</code> gives you and what makes the answer identical on every machine. Note what that does to <code>file1.txt</code>, <code>file2.txt</code> and <code>file10.txt</code>: sorting is lexicographic, not numeric.</li>' +
            '</ul>' +
            '<p>This runs entirely on the given array — <b>do not touch the real filesystem</b>: no <code>ls</code>, no <code>find</code>, no <code>touch</code>, and do not let the real directory glob into your output.</p>' +
            '<p>Keep the two given arrays and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Hãy làm shell: tự khai triển một glob (chương 2.2).</b> Cài đặt <code>expand</code>: nhận một cái mẫu rồi tới các tên file trong một thư mục, và in ra đúng cái dòng mà shell sẽ dựng nên. Mỗi tham số thu được được bọc trong ngoặc vuông để một cái tên có dấu cách vẫn nhìn ra được là MỘT tham số:</p>' +
            code(
              '*.txt -> [file1.txt] [file10.txt] [file2.txt]',
            ) +
            '<p>Bốn quy tắc quyết định câu này, và mỗi mẫu trong tám cái mẫu đều có mặt để thử một quy tắc.</p>' +
            '<ul>' +
            '<li><b>Phép khớp.</b> <code>*</code> là một dãy ký tự bất kỳ kể cả rỗng, <code>?</code> là đúng một ký tự, <code>[0-9]</code> là một ký tự trong tập, còn <code>[!f]</code> là một ký tự KHÔNG nằm trong tập. Bạn không phải tự viết bộ khớp — shell đã có sẵn một cái, và <code>case</code> thực hiện khớp MẪU chứ không phải so chuỗi, khi cái mẫu được để trần không bọc nháy.</li>' +
            '<li><b>Dấu chấm đứng đầu là đặc biệt.</b> Một glob không bao giờ khớp cái tên bắt đầu bằng <code>.</code>, trừ khi chính cái mẫu bắt đầu bằng một dấu chấm nguyên văn. Đó là lý do <code>rm *</code> trong thư mục nhà của bạn không xoá mất <code>.ssh</code>, và đó là quy tắc của phép KHAI TRIỂN TÊN FILE mà phép khớp mẫu trơ trọi không tự áp dụng giùm bạn.</li>' +
            '<li><b>Mẫu không khớp gì cả.</b> Trong bash mặc định nó được truyền qua NGUYÊN VĂN, dưới dạng một tham số duy nhất — nên <code>*.csv</code> trong thư mục không có file CSV nào sẽ cho ra <code>[*.csv]</code>, chứ không phải một dòng trống. Đây chính là hành vi mà <code>shopt -s nullglob</code> sinh ra để thay đổi.</li>' +
            '<li><b>Kết quả đã được sắp.</b> Hãy sắp theo thứ tự BYTE, thứ mà <code>LC_ALL=C</code> mang lại và thứ làm cho câu trả lời giống nhau trên mọi máy. Để ý xem điều đó gây ra gì cho <code>file1.txt</code>, <code>file2.txt</code> và <code>file10.txt</code>: phép sắp xếp là theo thứ tự chữ cái, không phải theo số.</li>' +
            '</ul>' +
            '<p>Toàn bộ việc này chạy trên mảng cho sẵn — ĐỪNG ĐỤNG VÀO hệ thống file thật: không <code>ls</code>, không <code>find</code>, không <code>touch</code>, và đừng để thư mục thật bị glob vào kết quả của bạn.</p>' +
            '<p>Giữ nguyên hai mảng cho sẵn và vòng lặp in kết quả.</p>',
          ),
          starterCode: Q32_STARTER,
          expectedOutput: Q32_OUTPUT,
          sampleSolution: Q32_SOLUTION,
        }),
      ],
    },
  ],
};
