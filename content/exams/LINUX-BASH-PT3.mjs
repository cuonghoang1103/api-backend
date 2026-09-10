/**
 * Linux & Bash — Progress Test 3 (Chương 9 → 12).
 *
 * Đề tự soạn, bám sát `content/courses/linux-bash/s09-mang-may-tu-xa.mjs`,
 * `s10-dia-goi-log.mjs`, `s11-systemd-cron.mjs` và `s12-chan-doan-may-chu.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỌI TRANSCRIPT TRONG ĐỀ ĐỀU CHẠY THẬT TRÊN LINUX, KHÔNG PHẢI macOS
 * ────────────────────────────────────────────────────────────────────────────
 * Ảnh nền và phiên bản công cụ đã dùng để đo (10/09/2026):
 *
 *   debian:12  (Debian 12.15, linux/amd64)
 *   bash 5.2.15(1)-release · GNU coreutils 9.1 · GNU grep 3.8 · GNU sed 4.9
 *   GNU findutils 4.9.0 · gawk 5.2.1 (awk → gawk) · systemd 252 (252.39-1~deb12u2)
 *   curl 7.88.1 · procps · iproute2 (ip, ss) · rsync · openssh-client
 *   cron · logrotate · lsof · dnsutils (dig) · python3 (dựng máy chủ HTTP giả)
 *
 * Máy soạn đề là macOS 26.6 (arm64), nơi `/bin/bash` là bản 3.2.57 từ 2007 và
 * `stat`/`sed`/`find`/`sort` là bản BSD — `stat -c` là GNU còn macOS dùng
 * `stat -f`, `ss` và `ip` thậm chí không tồn tại. Chương 9–12 là đúng chỗ hai
 * hệ khác nhau nhiều nhất, nên KHÔNG có một dòng output nào trong đề được lấy
 * từ macOS.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 — ĐỀ THEO MÁY)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `systemd` CÓ tra tên lệnh trần — chỉ là không tra `PATH` của bạn.
 *    Bài 11.1 (bẫy cuối bài) và bài 12.2 (công thức 1) đều nói "systemd không
 *    chạy shell, nên không có tra cứu PATH", và lấy `ExecStart=node dist/index.js`
 *    làm ví dụ hỏng với 203/EXEC. Đo thật trên systemd 252:
 *
 *      ExecStart=sleep 60          → systemd-analyze verify IM LẶNG, exit 0
 *      ExecStart=/usr/bin/sleep 60 → im lặng, exit 0
 *      ExecStart=mytool-pt3        → im lặng, exit 0   (nằm ở /usr/local/bin)
 *      ExecStart=othertool         → "Command othertool is not executable:
 *                                     No such file or directory", exit 1
 *                                     (nằm ở /opt/x — ngoài danh sách tra cứu)
 *      ExecStart=dist/index.js     → "Neither a valid executable name nor an
 *                                     absolute path: dist/index.js" +
 *                                     "Unit configuration has fatal error, unit
 *                                     will not be started.", exit 1
 *      ExecStart=./run.sh          → y hệt dòng trên
 *
 *    Nghĩa là: một TÊN TRẦN được tra trong một danh sách CỐ ĐỊNH
 *    (`/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin`), còn một đường dẫn
 *    CÓ dấu gạch chéo mà không tuyệt đối thì bị từ chối ngay lúc NẠP unit —
 *    không phải 203/EXEC lúc chạy. Câu 17 hỏi đúng chỗ này và theo MÁY.
 *
 * 2. `systemd-analyze verify` KHÔNG phải bộ kiểm cú pháp đầy đủ.
 *    Bài 11.1 đặt nó ở bước 3 của bảng "khi nó không khởi động được", ngụ ý nó
 *    xác nhận file hợp lệ. Đo thật: lỗi gõ `Restart=on-failur` chỉ in MỘT dòng
 *        bad.service:7: Failed to parse service restart specifier, ignoring: on-failur
 *    và `verify` **vẫn thoát 0**. Unit vẫn nạp được, chỉ là rơi về mặc định
 *    `Restart=no` — dịch vụ im lặng mất tính năng khởi động lại. Câu 18 dùng
 *    nguyên văn dòng đó.
 *
 * 3. `curl` tự in `000` khi không kết nối được, không cần mẹo phòng hờ.
 *    Bài 9.2 viết `code=$(curl … -w '%{http_code}' … || echo 000)`, ngụ ý phần
 *    `|| echo 000` là thứ tạo ra ba con số 0. Đo thật trên curl 7.88.1:
 *        $ curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:9
 *        000
 *        exit=7
 *    Chính curl in `000`; `|| echo 000` chỉ là lưới đỡ cho những bản/hoàn cảnh
 *    khác. Câu 3 hỏi ý nghĩa của `000`, không hỏi cái mẹo.
 *
 * 4. Môi trường cron đo được NGẮN hơn ví dụ trong bài 11.2.
 *    Bài in ra bảy dòng, gồm `LANG=en_US.UTF-8` và `_=/usr/bin/env`. Đo thật
 *    trên debian:12 (không đặt locale) bằng cách cho cron chạy `env` một phút:
 *        HOME=/root
 *        LOGNAME=root
 *        PATH=/usr/bin:/bin
 *        SHELL=/bin/sh
 *        PWD=/root
 *    Năm dòng, không có `LANG`, không có `_`. Điểm quan trọng của bài —
 *    `PATH=/usr/bin:/bin` trong khi PATH đăng nhập là
 *    `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin` — thì khớp
 *    hoàn toàn. Câu 21 chỉ dùng phần đã đo được.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG THỨ KHÔNG ĐO ĐƯỢC TRONG CONTAINER (và cách đề xử lý)
 * ────────────────────────────────────────────────────────────────────────────
 *   • `systemctl` / `journalctl`: container không có systemd làm PID 1, nguyên
 *     văn `System has not been booted with systemd as init system (PID 1).
 *     Can't operate.` ⇒ đề KHÔNG chép transcript `systemctl status` nào; những
 *     câu liên quan (18, 19, 22) hỏi CƠ CHẾ, hoặc dùng đầu ra của
 *     `systemd-analyze` — thứ chạy được vì nó chỉ phân tích file.
 *   • `ufw` / nftables thật, `tcpdump`, nhóm bảo mật của nhà cung cấp: không
 *     dựng được ⇒ câu 9 hỏi cách suy luận theo tầng, không chép output.
 *   • `sshd`: chỉ cài openssh-client, không có `sshd -T` ⇒ câu 23 hỏi cơ chế
 *     thứ tự đọc drop-in, theo đúng bài 11.3.
 *   • `chattr +i`: `Operation not permitted while setting flags` trong container
 *     không đặc quyền ⇒ không đưa vào đề.
 *   • `mount -o loop`: cũng `Operation not permitted`. Riêng phép đo CẠN INODE
 *     (câu 11) được làm trong một container `--privileged` DÙNG MỘT LẦN rồi
 *     `docker rm -f` ngay: tạo ext4 16 MB với `mkfs.ext4 -N 64`, mount, tạo
 *     file tới khi hết inode. Output trong câu 11 là nguyên văn lần chạy đó.
 *   • OOM killer, `/proc/<pid>/exe`: container amd64 chạy qua Rosetta trên máy
 *     arm64 nên `/proc/<pid>/exe` trỏ vào `/run/rosetta/rosetta` — một hiện vật
 *     của phép đo, KHÔNG phải kết quả Linux thật ⇒ đề không dùng.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CÂU LẬP TRÌNH: CHẠY ĐƯỢC Ở CẢ HAI NƠI
 * ────────────────────────────────────────────────────────────────────────────
 * `scripts/exam-check.mjs` ghép `starterCode` + `sampleSolution` rồi chạy bằng
 * `/bin/bash` CỦA MÁY SOẠN ĐỀ — macOS, bash **3.2.57**, coreutils/awk bản BSD.
 * Vì thế hai câu 31 và 32 chỉ XỬ LÝ VĂN BẢN cho sẵn bằng heredoc: không gọi
 * mạng, không `ss`, không `systemctl`, không đọc `/proc`, không cờ GNU. Chúng
 * dùng đúng những thứ có ở cả hai: `[[ ]]`, `case`, `${var##*:}`, `${var%:*}`,
 * `printf`, `while read -r`, `<<<`, và một lời gọi `awk` POSIX (`$NF`).
 *
 * Đã đối chiếu từng byte, cùng một file, hai nơi:
 *   /bin/bash q31.sh          (macOS 26.6, bash 3.2.57)  ─┐
 *   docker exec … bash q31.sh (debian:12, bash 5.2.15)   ─┴→ diff = rỗng
 *   /bin/bash q32.sh · docker exec … bash q32.sh          → diff = rỗng
 * `bash -n` sạch trên cả hai file.
 *
 * Vì sao KHÔNG cho câu lập trình gọi `ss`/`df` thật: hành vi đó chỉ đúng trên
 * Linux, mà bộ chấm chạy trên macOS ⇒ đề sẽ đỏ vì lý do không liên quan tới
 * bài làm. Những hành vi ấy nằm ở phần trắc nghiệm, nơi transcript đã được đo
 * thật trong container Linux.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (30 câu trắc nghiệm, mỗi câu một đáp án):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *   node -e "import('./content/exams/LINUX-BASH-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/LINUX-BASH-PT3.mjs --apply
 */
import { B, EX, code, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/linux-bash-exam-kit.mjs';

const Q31_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "ss_output=$(cat <<'EOF'\n" +
  'Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process\n' +
  'tcp   LISTEN 0      4096     0.0.0.0:22        0.0.0.0:*        users:(("sshd",pid=743,fd=3))\n' +
  'tcp   LISTEN 0      511      0.0.0.0:80        0.0.0.0:*        users:(("nginx",pid=812,fd=6))\n' +
  'tcp   LISTEN 0      511         [::]:443          [::]:*        users:(("nginx",pid=812,fd=7))\n' +
  'tcp   LISTEN 0      511    127.0.0.1:3000       0.0.0.0:*       users:(("node",pid=5012,fd=21))\n' +
  'tcp   LISTEN 0      244      0.0.0.0:5432       0.0.0.0:*       users:(("postgres",pid=901,fd=5))\n' +
  'tcp   LISTEN 0      511        [::1]:6379          [::]:*       users:(("redis-server",pid=1044,fd=6))\n' +
  'tcp   LISTEN 0      128   172.17.0.1:9090       0.0.0.0:*       users:(("prometheus",pid=2210,fd=9))\n' +
  'udp   UNCONN 0      0      127.0.0.1:323        0.0.0.0:*       users:(("chronyd",pid=690,fd=5))\n' +
  'tcp   LISTEN 0      4096     0.0.0.0:9200       0.0.0.0:*       -\n' +
  'udp   UNCONN 0      0        0.0.0.0:11211      0.0.0.0:*       users:(("memcached",pid=1502,fd=8))\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'audit() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'audit <<< "$ss_output"\n' +
  'echo "exit=$?"\n';

const Q31_SOLUTION =
  'audit() {\n' +
  '  # Danh sách trắng có dấu cách hai đầu, để so khớp trọn một từ:\n' +
  '  # " 22 80 443 " chứa " 80 " nhưng KHÔNG chứa " 8080 ".\n' +
  '  allowed=" 22 80 443 "\n' +
  '  total=0\n' +
  '  exposed=0\n' +
  '\n' +
  '  while read -r netid state recvq sendq local peer proc rest; do\n' +
  '    [ "$netid" = "Netid" ] && continue\n' +
  '    [ -z "$netid" ] && continue\n' +
  '    total=$((total + 1))\n' +
  '\n' +
  '    # Cắt ở dấu hai chấm CUỐI CÙNG: địa chỉ IPv6 có sẵn nhiều dấu hai chấm.\n' +
  '    port=${local##*:}\n' +
  '    addr=${local%:*}\n' +
  '\n' +
  '    case $addr in\n' +
  '      127.0.0.1|\'[::1]\')   scope=local ;;\n' +
  '      0.0.0.0|\'[::]\'|\'*\')  scope=public ;;\n' +
  '      *)                   scope=iface ;;\n' +
  '    esac\n' +
  '\n' +
  '    # Tên tiến trình nằm giữa cặp nháy kép đầu tiên; cột "-" thì không có.\n' +
  '    name=${proc#*\\"}\n' +
  '    if [ "$name" = "$proc" ]; then\n' +
  "      name='?'\n" +
  '    else\n' +
  '      name=${name%%\\"*}\n' +
  '    fi\n' +
  '\n' +
  '    verdict=OK\n' +
  '    if [ "$scope" = public ]; then\n' +
  '      case $allowed in\n' +
  '        *" $port "*) verdict=OK ;;\n' +
  '        *)           verdict=EXPOSED; exposed=$((exposed + 1)) ;;\n' +
  '      esac\n' +
  '    fi\n' +
  '\n' +
  "    printf '%-3s %-6s %-5s %-13s %s\\n' \"$netid\" \"$scope\" \"$port\" \"$name\" \"$verdict\"\n" +
  '  done\n' +
  '\n' +
  "  printf 'TONG: %d socket, %d EXPOSED\\n' \"$total\" \"$exposed\"\n" +
  '  [ "$exposed" -eq 0 ]\n' +
  '}\n';

const Q31_OUTPUT =
  'tcp public 22    sshd          OK\n' +
  'tcp public 80    nginx         OK\n' +
  'tcp public 443   nginx         OK\n' +
  'tcp local  3000  node          OK\n' +
  'tcp public 5432  postgres      EXPOSED\n' +
  'tcp local  6379  redis-server  OK\n' +
  'tcp iface  9090  prometheus    OK\n' +
  'udp local  323   chronyd       OK\n' +
  'tcp public 9200  ?             EXPOSED\n' +
  'udp public 11211 memcached     EXPOSED\n' +
  'TONG: 10 socket, 3 EXPOSED\n' +
  'exit=1';

const Q32_STARTER =
  '#!/usr/bin/env bash\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  "df_h=$(cat <<'EOF'\n" +
  'Filesystem      Size  Used Avail Use% Mounted on\n' +
  '/dev/vda1        79G   33G   43G  42% /\n' +
  '/dev/vdb1       200G  188G  2.1G  99% /var/lib/docker\n' +
  'tmpfs           3.9G     0  3.9G   0% /dev/shm\n' +
  '/dev/loop0       15M   67K   14M   1% /mnt/data\n' +
  '/dev/vdc1        50G   41G  6.5G  87% /srv/backups\n' +
  '/dev/vde1        20G   19G  788M  96% /var/log\n' +
  'udev            1.9G     0  1.9G   0% /dev\n' +
  '/dev/vdd1       100G   53G   43G  55% /srv/uploads\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  "df_i=$(cat <<'EOF'\n" +
  'Filesystem       Inodes   IUsed    IFree IUse% Mounted on\n' +
  '/dev/vda1       5242880 5242880        0  100% /\n' +
  '/dev/vdb1      13107200 1204411 11902789   10% /var/lib/docker\n' +
  'tmpfs            998244       1   998243    1% /dev/shm\n' +
  '/dev/loop0           64      64        0  100% /mnt/data\n' +
  '/dev/vdc1       3276800   87142  3189658    3% /srv/backups\n' +
  '/dev/vde1       1310720 1230604    80116   94% /var/log\n' +
  'udev             489122     456   488666    1% /dev\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'check_disk() {\n' +
  "  echo 'chưa cài đặt' >&2\n" +
  '  return 1\n' +
  '}\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'check_disk "$df_h" "$df_i"\n' +
  'echo "exit=$?"\n';

const Q32_SOLUTION =
  'muc() {\n' +
  '  if [ "$1" -ge 90 ]; then echo CRIT\n' +
  '  elif [ "$1" -ge 80 ]; then echo WARN\n' +
  '  else echo OK\n' +
  '  fi\n' +
  '}\n' +
  '\n' +
  'check_disk() {\n' +
  '  crit=0; warn=0; ok=0; thieu=0\n' +
  '\n' +
  '  # <<< chứ KHÔNG phải "printf … | while": ống dẫn đẩy vòng lặp vào shell\n' +
  '  # con, và bốn biến đếm ở trên sẽ về 0 ngay khi vòng lặp kết thúc.\n' +
  '  while read -r fs size used avail pct mnt rest; do\n' +
  '    [ "$fs" = Filesystem ] && continue\n' +
  '    [ -z "$fs" ] && continue\n' +
  '    case $fs in tmpfs|devtmpfs|udev|efivarfs) continue ;; esac\n' +
  '\n' +
  '    b=${pct%\\%}\n' +
  '    # Tra bảng thứ hai theo ĐIỂM GẮN, không theo số thứ tự dòng: hai lệnh\n' +
  '    # chạy cách nhau vài giây nên thứ tự và số dòng không đảm bảo trùng.\n' +
  "    i=$(printf '%s\\n' \"$2\" | awk -v m=\"$mnt\" '$NF == m { print $(NF-1) }')\n" +
  '    i=${i%\\%}\n' +
  '\n' +
  '    if [ -z "$i" ]; then\n' +
  "      lv=$(muc \"$b\"); axis=bytes; ishow='?'; thieu=$((thieu + 1))\n" +
  '    else\n' +
  '      lb=$(muc "$b"); li=$(muc "$i"); ishow=$i\n' +
  '      if [ "$lb" = "$li" ]; then\n' +
  '        lv=$lb\n' +
  '        if [ "$lv" = OK ]; then axis=bytes; else axis=bytes+inodes; fi\n' +
  '      elif [ "$lb" = CRIT ] || { [ "$lb" = WARN ] && [ "$li" = OK ]; }; then\n' +
  '        lv=$lb; axis=bytes\n' +
  '      else\n' +
  '        lv=$li; axis=inodes\n' +
  '      fi\n' +
  '    fi\n' +
  '\n' +
  '    case $lv in\n' +
  '      CRIT) crit=$((crit + 1)) ;;\n' +
  '      WARN) warn=$((warn + 1)) ;;\n' +
  '      *)    ok=$((ok + 1)) ;;\n' +
  '    esac\n' +
  '\n' +
  "    printf '%-16s bytes=%-4s inodes=%-4s %-5s %s\\n' \"$mnt\" \"$b\" \"$ishow\" \"$lv\" \"$axis\"\n" +
  '  done <<< "$1"\n' +
  '\n' +
  "  printf 'TONG: crit=%d warn=%d ok=%d thieu-inode=%d\\n' \"$crit\" \"$warn\" \"$ok\" \"$thieu\"\n" +
  '\n' +
  '  if [ "$crit" -gt 0 ]; then return 2; fi\n' +
  '  if [ "$warn" -gt 0 ]; then return 1; fi\n' +
  '  return 0\n' +
  '}\n';

const Q32_OUTPUT =
  '/                bytes=42   inodes=100  CRIT  inodes\n' +
  '/var/lib/docker  bytes=99   inodes=10   CRIT  bytes\n' +
  '/mnt/data        bytes=1    inodes=100  CRIT  inodes\n' +
  '/srv/backups     bytes=87   inodes=3    WARN  bytes\n' +
  '/var/log         bytes=96   inodes=94   CRIT  bytes+inodes\n' +
  '/srv/uploads     bytes=55   inodes=?    OK    bytes\n' +
  'TONG: crit=4 warn=1 ok=1 thieu-inode=1\n' +
  'exit=2';

export default {
  course: { slug: 'linux-bash' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9–12 (networking, disk & logs, systemd & cron, diagnosing a server)',
        'Kiểm tra tiến độ 3 — Chương 9–12 (mạng, đĩa & log, systemd & cron, chẩn đoán máy chủ)',
      ),
      description: B(
        'The last third of the Linux & Bash course: the network seen from the shell, curl, SSH and rsync, firewalls, a full disk, packages and logs, systemd units, cron and timers, server hardening, and a method for diagnosing a machine you have never seen. 30 multiple-choice questions plus 2 scripting questions you write here in the exam room.',
        'Một phần ba cuối của khoá Linux & Bash: mạng nhìn từ shell, curl, SSH và rsync, tường lửa, đĩa đầy, gói phần mềm và log, unit của systemd, cron và timer, gia cố máy chủ, và một phương pháp chẩn đoán cái máy bạn chưa từng thấy. 30 câu trắc nghiệm và 2 câu viết script ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        // ── Chương 9 — Mạng & máy từ xa (9 câu) ──────────────────────────
        // q1 · đáp án 1
        mcq({
          prompt: B(
            'Real run on Linux. Four listening sockets, two of them IPv6:' + code(
              'Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process\n' +
              'tcp   LISTEN 0      5          127.0.0.1:8080      0.0.0.0:*    users:(("python3",pid=5118,fd=12))\n' +
              'tcp   LISTEN 0      5            0.0.0.0:9090      0.0.0.0:*    users:(("python3",pid=5119,fd=12))\n' +
              'tcp   LISTEN 0      5              [::1]:6379         [::]:*    users:(("python3",pid=6425,fd=10))\n' +
              'tcp   LISTEN 0      5               [::]:4443         [::]:*    users:(("python3",pid=6425,fd=9))',
            ) + 'Which of these ports can a DIFFERENT machine on the network reach?',
            'Chạy thật trên Linux. Bốn socket đang lắng nghe, hai cái là IPv6:' + code(
              'Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process\n' +
              'tcp   LISTEN 0      5          127.0.0.1:8080      0.0.0.0:*    users:(("python3",pid=5118,fd=12))\n' +
              'tcp   LISTEN 0      5            0.0.0.0:9090      0.0.0.0:*    users:(("python3",pid=5119,fd=12))\n' +
              'tcp   LISTEN 0      5              [::1]:6379         [::]:*    users:(("python3",pid=6425,fd=10))\n' +
              'tcp   LISTEN 0      5               [::]:4443         [::]:*    users:(("python3",pid=6425,fd=9))',
            ) + 'Cổng nào trong số này một MÁY KHÁC trên mạng có thể với tới?',
          ),
          options: [
            B(
              'Ports 8080 and 9090 only. The IPv6 rows are link-local addresses that exist inside the kernel for neighbour discovery, so nothing outside the host can open a connection to either of them.',
              'Chỉ cổng 8080 và 9090. Hai dòng IPv6 là địa chỉ link-local do nhân dựng ra để dò hàng xóm, nên không có gì ngoài máy này mở được kết nối tới chúng.',
            ),
            B(
              'Ports 9090 and 4443 only. <code>0.0.0.0</code> and <code>[::]</code> are the IPv4 and IPv6 wildcards — every interface, including the public one — while <code>127.0.0.1</code> and <code>[::1]</code> are the two loopbacks and never leave the machine.',
              'Chỉ cổng 9090 và 4443. <code>0.0.0.0</code> và <code>[::]</code> là ký tự đại diện của IPv4 và IPv6 — mọi giao diện, kể cả giao diện công khai — còn <code>127.0.0.1</code> và <code>[::1]</code> là hai loopback và không bao giờ rời khỏi máy.',
            ),
            B(
              'All four, as long as the host firewall allows the ports. The Local Address column records which address the socket last accepted a connection from, not a restriction on who may connect in future.',
              'Cả bốn, miễn tường lửa của máy cho phép các cổng đó. Cột Local Address ghi lại địa chỉ mà socket nhận kết nối gần nhất, chứ không phải một hạn chế xem ai được kết nối về sau.',
            ),
            B(
              'None of them. <code>Send-Q 5</code> means the accept queue holds at most five entries and is already full, so the kernel refuses every new connection until an existing one is accepted.',
              'Không cổng nào. <code>Send-Q 5</code> nghĩa là hàng đợi chấp nhận chứa tối đa năm mục và đã đầy, nên nhân từ chối mọi kết nối mới cho tới khi có một kết nối cũ được nhận.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured with two real Python listeners inside a Debian 12 container. There are two wildcard addresses and two loopback addresses, one of each per family: <code>0.0.0.0</code> pairs with <code>[::]</code>, and <code>127.0.0.1</code> pairs with <code>[::1]</code>. Reading only the port number is how people conclude "Redis is fine, it is on 6379" without noticing which side of that line it sits on. The habit worth building is <code>ss -tulpn</code> and then reading the ADDRESS column first — no firewall rule can make a loopback-bound service reachable, and no firewall rule is needed to make a wildcard-bound one reachable once the provider allows the port.',
            'Đo bằng hai tiến trình Python lắng nghe thật bên trong container Debian 12. Có hai địa chỉ đại diện và hai địa chỉ loopback, mỗi họ một cái: <code>0.0.0.0</code> đi cặp với <code>[::]</code>, còn <code>127.0.0.1</code> đi cặp với <code>[::1]</code>. Chỉ đọc số cổng chính là cách người ta kết luận "Redis ổn mà, nó ở 6379" mà không để ý nó nằm bên nào của cái ranh giới ấy. Thói quen đáng xây: chạy <code>ss -tulpn</code> rồi đọc cột ĐỊA CHỈ trước — không luật tường lửa nào làm một dịch vụ gắn loopback với tới được, và cũng chẳng cần luật tường lửa nào để một dịch vụ gắn đại diện với tới được một khi nhà cung cấp đã mở cổng.',
          ),
        }),

        // q2 · đáp án 3
        mcq({
          prompt: B(
            'Real run on Linux. The same name, asked two ways:' + code(
              '$ grep api.internal.test /etc/hosts\n' +
              '10.0.0.9  api.internal.test\n' +
              '\n' +
              '$ getent hosts api.internal.test\n' +
              '10.0.0.9        api.internal.test\n' +
              '\n' +
              '$ dig +short @1.1.1.1 api.internal.test\n' +
              '$ echo $?\n' +
              '0',
            ) + 'The application connects to 10.0.0.9. What do these three commands together prove?',
            'Chạy thật trên Linux. Cùng một cái tên, hỏi theo hai đường:' + code(
              '$ grep api.internal.test /etc/hosts\n' +
              '10.0.0.9  api.internal.test\n' +
              '\n' +
              '$ getent hosts api.internal.test\n' +
              '10.0.0.9        api.internal.test\n' +
              '\n' +
              '$ dig +short @1.1.1.1 api.internal.test\n' +
              '$ echo $?\n' +
              '0',
            ) + 'Ứng dụng kết nối tới 10.0.0.9. Ba lệnh này gộp lại chứng minh điều gì?',
          ),
          options: [
            B(
              'That the record has not propagated yet. <code>dig</code> printed nothing because 1.1.1.1 has not received the zone update, and waiting for the TTL to expire will make both commands agree on 10.0.0.9.',
              'Rằng bản ghi chưa lan truyền. <code>dig</code> không in gì vì 1.1.1.1 chưa nhận được bản cập nhật vùng, và chờ hết TTL sẽ làm hai lệnh cùng cho ra 10.0.0.9.',
            ),
            B(
              'That the local resolver is broken. An exit status of 0 with no output means <code>dig</code> could not reach any nameserver at all, so the answer the application used came from a stale cache in the C library.',
              'Rằng bộ phân giải cục bộ hỏng. Mã thoát 0 mà không in gì nghĩa là <code>dig</code> không với tới được máy chủ tên nào, nên câu trả lời ứng dụng dùng đến từ một bộ đệm cũ trong thư viện C.',
            ),
            B(
              'That someone typed the wrong address into <code>/etc/hosts</code>, which the application read directly because Linux applications open that file themselves before doing anything else with names.',
              'Rằng có người gõ nhầm địa chỉ vào <code>/etc/hosts</code>, và ứng dụng đọc thẳng file đó vì ứng dụng Linux tự mở file ấy trước khi làm bất cứ việc gì khác với tên.',
            ),
            B(
              '<code>dig</code> asks a DNS server and nothing else, so it never sees <code>/etc/hosts</code>. An application resolves through the C library, which follows <code>/etc/nsswitch.conf</code> and reads <code>/etc/hosts</code> first — and <code>getent hosts</code> is the command that walks that same path.',
              '<code>dig</code> hỏi thẳng một máy chủ DNS và chỉ thế thôi, nên nó không bao giờ thấy <code>/etc/hosts</code>. Ứng dụng phân giải qua thư viện C, thứ tuân theo <code>/etc/nsswitch.conf</code> và đọc <code>/etc/hosts</code> trước — và <code>getent hosts</code> chính là lệnh đi đúng con đường đó.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: the name has no public DNS record at all, so <code>dig +short @1.1.1.1</code> prints nothing and still exits 0 — an empty answer is a successful query, which is why scripting <code>if dig …; then</code> is a trap. Meanwhile <code>getent hosts</code> returns 10.0.0.9 because it goes through <code>getaddrinfo()</code>, exactly like your application. Whenever <code>dig</code> and the application disagree about a name, a leftover <code>/etc/hosts</code> line from somebody\'s testing is the first suspect, and comparing these two commands names the layer in five seconds.',
            'Đo thật: cái tên này không có bản ghi DNS công khai nào, nên <code>dig +short @1.1.1.1</code> không in gì mà vẫn thoát 0 — một câu trả lời rỗng vẫn là một truy vấn thành công, và đó là lý do viết <code>if dig …; then</code> trong script là một cái bẫy. Trong khi đó <code>getent hosts</code> trả về 10.0.0.9 vì nó đi qua <code>getaddrinfo()</code>, y hệt ứng dụng của bạn. Hễ <code>dig</code> và ứng dụng bất đồng về một cái tên thì nghi can đầu tiên là một dòng <code>/etc/hosts</code> ai đó để sót lúc thử nghiệm, và so hai lệnh này gọi tên được cái tầng trong năm giây.',
          ),
        }),

        // q3 · đáp án 0
        mcq({
          prompt: B(
            'Real run on Linux, curl 7.88.1. Nothing is listening on port 9:' + code(
              "$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:9\n" +
              '000\n' +
              '$ echo $?\n' +
              '7',
            ) + 'What does <code>000</code> mean here?',
            'Chạy thật trên Linux, curl 7.88.1. Không có gì lắng nghe ở cổng 9:' + code(
              "$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:9\n" +
              '000\n' +
              '$ echo $?\n' +
              '7',
            ) + '<code>000</code> ở đây nghĩa là gì?',
          ),
          options: [
            B(
              'There is no HTTP status at all, because no HTTP transaction ever happened: the TCP connection failed, so curl has no status line to report and prints three zeros. The real information is in the exit code — 7 means "failed to connect".',
              'Không có mã trạng thái HTTP nào cả, vì chẳng có cuộc trao đổi HTTP nào diễn ra: kết nối TCP hỏng nên curl không có dòng trạng thái nào để báo và in ra ba số không. Thông tin thật nằm ở mã thoát — 7 nghĩa là "không kết nối được".',
            ),
            B(
              'The server answered with status 0, a non-standard code some proxies emit when they decide to close a connection early; curl passes it through unchanged and the exit code of 7 confirms the connection was closed by the peer.',
              'Máy chủ trả về trạng thái 0, một mã phi tiêu chuẩn mà vài proxy phát ra khi chúng quyết định đóng kết nối sớm; curl chuyển nguyên nó ra ngoài và mã thoát 7 xác nhận kết nối bị đầu kia đóng.',
            ),
            B(
              'The response was empty. <code>-o /dev/null</code> discarded the body before curl could parse the status line out of it, so the placeholder <code>000</code> is printed instead of the real code, which was 404.',
              'Phản hồi rỗng. <code>-o /dev/null</code> đã vứt phần thân đi trước khi curl kịp phân tích dòng trạng thái từ đó, nên chỗ đó in ra <code>000</code> thay cho mã thật, vốn là 404.',
            ),
            B(
              'The request was blocked by the host firewall. curl reserves <code>000</code> for packets dropped locally, which is how you tell a firewall rule apart from an application that is simply not running.',
              'Yêu cầu bị tường lửa của máy chặn. curl dành riêng <code>000</code> cho gói tin bị vứt ngay tại chỗ, và đó là cách phân biệt một luật tường lửa với một ứng dụng đơn giản là không chạy.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured. <code>%{http_code}</code> is "the status of the last HTTP response", and when there was none, curl prints <code>000</code> itself — you do not need the <code>|| echo 000</code> fallback that the lesson shows, although it costs nothing to keep. The practical consequence is that a health check written as <code>[ "$code" = 200 ]</code> treats "the machine is unreachable" and "the app returned 500" identically. Read the exit code alongside it: 6 is DNS, 7 is failed to connect, 22 is an HTTP error under <code>-f</code>, 28 is a timeout — four different layers, four different fixes.',
            'Đã đo thật. <code>%{http_code}</code> là "trạng thái của phản hồi HTTP gần nhất", và khi không có phản hồi nào thì chính curl in ra <code>000</code> — bạn không cần cái lưới <code>|| echo 000</code> mà bài học đưa ra, dù giữ nó cũng chẳng tốn gì. Hệ quả thực tế: một phép kiểm sức khoẻ viết là <code>[ "$code" = 200 ]</code> sẽ đối xử với "không với tới được máy" y hệt "ứng dụng trả 500". Hãy đọc mã thoát kèm theo: 6 là DNS, 7 là không kết nối được, 22 là lỗi HTTP khi có <code>-f</code>, 28 là hết giờ — bốn cái tầng khác nhau, bốn cách chữa khác nhau.',
          ),
        }),

        // q4 · đáp án 2
        mcq({
          prompt: B(
            'Real run on Linux, two failures from the same script:' + code(
              '$ curl -sSf http://no-such-host-xyz.invalid/\n' +
              'curl: (6) Could not resolve host: no-such-host-xyz.invalid\n' +
              'exit=6\n' +
              '\n' +
              '$ curl -sSf http://127.0.0.1:8080/missing\n' +
              'curl: (22) The requested URL returned error: 404\n' +
              'exit=22',
            ) + 'A deploy script must react differently to these two. What is the correct reading?',
            'Chạy thật trên Linux, hai lần hỏng từ cùng một script:' + code(
              '$ curl -sSf http://no-such-host-xyz.invalid/\n' +
              'curl: (6) Could not resolve host: no-such-host-xyz.invalid\n' +
              'exit=6\n' +
              '\n' +
              '$ curl -sSf http://127.0.0.1:8080/missing\n' +
              'curl: (22) The requested URL returned error: 404\n' +
              'exit=22',
            ) + 'Một script deploy phải phản ứng khác nhau với hai cái này. Cách đọc ĐÚNG là gì?',
          ),
          options: [
            B(
              'Both are network failures and both should be retried. 6 and 22 differ only in how far curl got before giving up, so a single retry loop with a delay is the right handling for either of them.',
              'Cả hai đều là lỗi mạng và đều nên thử lại. 6 và 22 chỉ khác nhau ở chỗ curl đi được xa tới đâu trước khi bỏ cuộc, nên một vòng thử lại có độ trễ là cách xử lý đúng cho cả hai.',
            ),
            B(
              '22 is the more serious of the two. Exit 6 means curl fell back to a cached address and carried on, while 22 means the transfer was aborted mid-body and the downloaded file is incomplete.',
              '22 nghiêm trọng hơn. Mã thoát 6 nghĩa là curl lùi về một địa chỉ đã lưu tạm rồi chạy tiếp, còn 22 nghĩa là cuộc truyền bị bỏ dở giữa phần thân và file tải về không trọn vẹn.',
            ),
            B(
              '6 never reached the network: the name could not be resolved, so this is DNS or a typo in the hostname and the remote application is not implicated at all. 22 means the connection worked end to end and the application answered with a 4xx or 5xx — a real HTTP error that <code>-f</code> turned into a non-zero exit.',
              '6 chưa hề chạm tới mạng: cái tên không phân giải được, nên đây là chuyện DNS hoặc gõ sai tên máy và ứng dụng ở xa hoàn toàn vô can. 22 nghĩa là kết nối chạy suốt từ đầu tới cuối và ứng dụng trả lời bằng 4xx hoặc 5xx — một lỗi HTTP thật mà <code>-f</code> đã biến thành mã thoát khác 0.',
            ),
            B(
              'Neither should stop the script. <code>-S</code> makes curl print the message but keep the exit status at 0, which is the point of combining it with <code>-s</code>, so the script continues in both cases and the numbers shown are diagnostic only.',
              'Không cái nào nên làm dừng script. <code>-S</code> khiến curl in ra thông báo nhưng giữ mã thoát ở 0 — đó chính là ý nghĩa của việc ghép nó với <code>-s</code> — nên script chạy tiếp trong cả hai trường hợp và mấy con số kia chỉ để chẩn đoán.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both were measured. The five exit codes map onto the four layers from Lesson 9.1, which is what lets a health-check script report WHICH layer broke instead of "the check failed": 6 = DNS, 7 = nothing listening or a firewall, 22 = the application said no, 28 = it connected and then stalled, 35 and 60 = TLS. Retrying is right for 7 and 28 and pointless for 6 and 22 — a 404 will still be a 404 in five seconds. Note also what <code>-S</code> actually does: it restores the error MESSAGE that <code>-s</code> suppressed. It changes no exit status.',
            'Cả hai đều đã đo thật. Năm mã thoát ánh xạ vào bốn tầng của bài 9.1, và đó là thứ cho phép một script kiểm sức khoẻ báo TẦNG NÀO hỏng thay vì "phép kiểm thất bại": 6 = DNS, 7 = không có gì lắng nghe hoặc có tường lửa, 22 = ứng dụng nói không, 28 = kết nối được rồi đứng im, 35 và 60 = TLS. Thử lại là đúng với 7 và 28 nhưng vô nghĩa với 6 và 22 — một mã 404 thì năm giây nữa vẫn là 404. Cũng để ý <code>-S</code> thật ra làm gì: nó trả lại THÔNG BÁO lỗi mà <code>-s</code> đã dập đi. Nó không đổi mã thoát nào cả.',
          ),
        }),

        // q5 · đáp án 3
        mcq({
          prompt: B(
            'Real run on Linux. A listener accepts the TCP connection and then never replies:' + code(
              '$ curl -sSf --max-time 2 http://127.0.0.1:7777/\n' +
              'curl: (28) Operation timed out after 2005 milliseconds with 0 bytes received\n' +
              'exit=28',
            ) + 'A cron job calls that URL every five minutes with no timeout flags at all. What is the practical difference between <code>--connect-timeout</code> and <code>--max-time</code> here?',
            'Chạy thật trên Linux. Một tiến trình nhận kết nối TCP rồi không bao giờ trả lời:' + code(
              '$ curl -sSf --max-time 2 http://127.0.0.1:7777/\n' +
              'curl: (28) Operation timed out after 2005 milliseconds with 0 bytes received\n' +
              'exit=28',
            ) + 'Một cron job gọi URL đó mỗi năm phút mà không có cờ hết-giờ nào. Khác biệt thực tế giữa <code>--connect-timeout</code> và <code>--max-time</code> ở đây là gì?',
          ),
          options: [
            B(
              'They are two spellings of the same limit; <code>--max-time</code> is the modern name and <code>--connect-timeout</code> is kept only so that old scripts keep working, so setting either one is enough.',
              'Chúng là hai cách viết của cùng một giới hạn; <code>--max-time</code> là tên đời mới còn <code>--connect-timeout</code> chỉ được giữ lại để script cũ vẫn chạy, nên đặt cái nào cũng đủ.',
            ),
            B(
              '<code>--connect-timeout</code> bounds the whole request while <code>--max-time</code> bounds only the body transfer, so a server that stalls before sending any bytes is caught by the first flag and not by the second.',
              '<code>--connect-timeout</code> giới hạn cả yêu cầu còn <code>--max-time</code> chỉ giới hạn phần truyền thân, nên một máy chủ đứng im trước khi gửi byte nào sẽ bị cờ thứ nhất bắt chứ không phải cờ thứ hai.',
            ),
            B(
              'Neither matters for a cron job, because cron kills any command that outlives its schedule interval — the next invocation replaces the previous one, so a hung curl can never accumulate.',
              'Cả hai đều không quan trọng với cron job, vì cron giết mọi lệnh sống lâu hơn khoảng lịch của nó — lần chạy sau thay chỗ lần chạy trước, nên một curl bị treo không bao giờ dồn lại được.',
            ),
            B(
              '<code>--connect-timeout</code> only bounds establishing the TCP connection, so it would not have caught this case at all: the connection succeeded and the stall came afterwards. <code>--max-time</code> is the ceiling on the whole request, and it is the one that stops a hung curl living until the next cron run starts another one.',
              '<code>--connect-timeout</code> chỉ giới hạn việc thiết lập kết nối TCP, nên nó sẽ chẳng bắt được ca này: kết nối đã thành công và chỗ đứng im nằm sau đó. <code>--max-time</code> là trần cho toàn bộ yêu cầu, và nó mới là thứ ngăn một curl bị treo sống tới lúc lần cron kế tiếp khởi động thêm một cái nữa.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured against a listener that accepts and says nothing — the connect phase succeeded in milliseconds, and only <code>--max-time</code> ended it. This is the classic cause of a machine that slowly fills with processes: the endpoint stops responding, each invocation hangs indefinitely, and every five minutes another one starts. Use both flags — a small <code>--connect-timeout</code> so a dead host fails fast instead of waiting two minutes, and a <code>--max-time</code> that reflects how long the request may legitimately take — and add <code>flock</code> so a slow run cannot overlap the next one.',
            'Đo bằng một tiến trình nhận kết nối rồi im lặng — pha kết nối thành công trong vài mili-giây, và chỉ <code>--max-time</code> mới kết thúc được nó. Đây là nguyên nhân kinh điển của cái máy từ từ đầy tiến trình: điểm cuối thôi trả lời, mỗi lần gọi treo vô hạn, và cứ năm phút lại có thêm một cái khởi động. Hãy dùng cả hai cờ — một <code>--connect-timeout</code> nhỏ để máy chết hỏng nhanh thay vì chờ hai phút, và một <code>--max-time</code> phản ánh thời gian yêu cầu được phép kéo dài — rồi thêm <code>flock</code> để một lần chạy chậm không chồng lên lần kế tiếp.',
          ),
        }),

        // q6 · đáp án 1
        mcq({
          prompt: B(
            'Two SSH commands that differ only in the quote character:' + code(
              'ssh vps "echo $HOSTNAME"      # → laptop\n' +
              "ssh vps 'echo $HOSTNAME'      # → vps",
            ) + 'Why do they print different names?',
            'Hai lệnh SSH chỉ khác nhau ở loại dấu nháy:' + code(
              'ssh vps "echo $HOSTNAME"      # → laptop\n' +
              "ssh vps 'echo $HOSTNAME'      # → vps",
            ) + 'Vì sao chúng in ra hai cái tên khác nhau?',
          ),
          options: [
            B(
              'Because <code>ssh</code> reads double quotes as a request to run the command in a login shell on the far side, which sources <code>/etc/profile</code> and therefore sets <code>HOSTNAME</code> to the local machine forwarded by the SSH client.',
              'Vì <code>ssh</code> hiểu dấu nháy kép là yêu cầu chạy lệnh trong một shell đăng nhập ở đầu bên kia, thứ nạp <code>/etc/profile</code> và do đó đặt <code>HOSTNAME</code> thành máy cục bộ do trình khách SSH chuyển sang.',
            ),
            B(
              'Double quotes let YOUR shell expand <code>$HOSTNAME</code> before <code>ssh</code> is even started, so the string sent over the wire is already <code>echo laptop</code>. Single quotes send the four characters <code>$HOS…</code> unchanged and the remote shell expands them.',
              'Dấu nháy kép để SHELL CỦA BẠN khai triển <code>$HOSTNAME</code> trước khi <code>ssh</code> kịp khởi động, nên chuỗi đi qua đường truyền đã là <code>echo laptop</code>. Dấu nháy đơn gửi nguyên xi mấy ký tự đó và shell ở xa mới khai triển.',
            ),
            B(
              'Because <code>HOSTNAME</code> is one of the variables OpenSSH forwards by default through <code>SendEnv</code>, and forwarding happens only for commands written in double quotes, where the client can parse the variable name out of the string.',
              'Vì <code>HOSTNAME</code> là một trong những biến OpenSSH mặc định chuyển tiếp qua <code>SendEnv</code>, và việc chuyển tiếp chỉ xảy ra với lệnh viết trong nháy kép, nơi trình khách phân tích được tên biến từ chuỗi.',
            ),
            B(
              'They do not really differ; the outputs shown come from two different sessions. Both forms send the literal text and the remote shell expands it, which is why quoting style is a matter of taste in an <code>ssh</code> command.',
              'Chúng thật ra không khác nhau; hai kết quả kia đến từ hai phiên khác nhau. Cả hai dạng đều gửi văn bản nguyên xi và shell ở xa khai triển, nên kiểu đặt nháy trong lệnh <code>ssh</code> chỉ là chuyện sở thích.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is Lesson 6.2 with a second machine attached, and it is the single most common quoting bug in deploy scripts. Both forms are legitimate — you often WANT to interpolate a local variable, for example <code>ssh vps "systemctl restart $SERVICE"</code> where <code>$SERVICE</code> is a local choice — but confusing them produces a command that runs against the wrong values with no error at all. When in doubt, print what you are about to send: <code>echo ssh vps "…"</code> shows the final string before it leaves your machine.',
            'Đây là bài 6.2 gắn thêm một cái máy thứ hai, và nó là lỗi đặt nháy phổ biến nhất trong script deploy. Cả hai dạng đều chính đáng — bạn thường MUỐN chèn một biến cục bộ vào, ví dụ <code>ssh vps "systemctl restart $SERVICE"</code> với <code>$SERVICE</code> là lựa chọn ở máy bạn — nhưng lẫn lộn chúng thì sinh ra một câu lệnh chạy với giá trị sai mà không báo lỗi gì. Không chắc thì in ra thứ mình sắp gửi: <code>echo ssh vps "…"</code> cho thấy chuỗi cuối cùng trước khi nó rời máy bạn.',
          ),
        }),

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'You start a twenty-minute build on a server and then close the laptop lid:' + code(
              "ssh vps '/srv/app/build.sh &'\n" +
              '# ssh returns immediately, exit 0',
            ) + 'What happens to the build, and what should have been used?',
            'Bạn khởi động một lượt dựng hai mươi phút trên máy chủ rồi gập laptop lại:' + code(
              "ssh vps '/srv/app/build.sh &'\n" +
              '# ssh trả về ngay, mã thoát 0',
            ) + 'Chuyện gì xảy ra với lượt dựng đó, và đáng lẽ phải dùng gì?',
          ),
          options: [
            B(
              'It completes normally. The <code>&amp;</code> detaches the process from the terminal, which is the whole purpose of backgrounding, so the build outlives the SSH session and writes its output to <code>nohup.out</code>.',
              'Nó chạy xong bình thường. Dấu <code>&amp;</code> tách tiến trình khỏi terminal, và đó chính là mục đích của việc đẩy xuống nền, nên lượt dựng sống lâu hơn phiên SSH và ghi kết quả vào <code>nohup.out</code>.',
            ),
            B(
              'It is killed the moment <code>ssh</code> returns, before doing anything at all, because a non-interactive SSH command runs with no controlling terminal and a backgrounded job cannot be scheduled without one.',
              'Nó bị giết ngay khoảnh khắc <code>ssh</code> trả về, trước khi kịp làm gì, vì một lệnh SSH không tương tác chạy mà không có terminal điều khiển và một job nền không thể được lập lịch nếu thiếu terminal.',
            ),
            B(
              'The build dies partway through when the session ends and SIGHUP is delivered, while <code>ssh</code> has already reported success — so the failure is silent. Detach it from the session properly: <code>ssh vps \'tmux new -d -s build /srv/app/build.sh\'</code>, or wrap it in <code>nohup</code>, or make it a systemd unit.',
              'Lượt dựng chết giữa chừng khi phiên kết thúc và SIGHUP được gửi tới, trong khi <code>ssh</code> thì đã báo thành công rồi — nên chỗ hỏng là im lặng. Hãy tách nó khỏi phiên cho đúng: <code>ssh vps \'tmux new -d -s build /srv/app/build.sh\'</code>, hoặc bọc bằng <code>nohup</code>, hoặc biến nó thành một unit của systemd.',
            ),
            B(
              'Nothing runs at all: <code>ssh</code> refuses to execute a command ending in <code>&amp;</code> because the trailing ampersand is stripped by the remote shell before parsing, leaving an incomplete command line that fails with a syntax error.',
              'Không có gì chạy cả: <code>ssh</code> từ chối thực thi một lệnh kết thúc bằng <code>&amp;</code> vì dấu và ở cuối bị shell ở xa gỡ đi trước khi phân tích, để lại một dòng lệnh dở dang hỏng với lỗi cú pháp.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Backgrounding with <code>&amp;</code> removes the job from the shell\'s foreground; it does not remove it from the session. When the SSH connection ends, SIGHUP goes to the session\'s processes and the build dies — typically minutes in, with a half-written artefact and an <code>ssh</code> that exited 0 an hour ago. <code>tmux new -d</code> is the best of the three answers because you can attach later and see what actually happened; <code>nohup</code> only redirects the signal and the output. And anything that must also survive a reboot belongs in a systemd unit, which is Chapter 11.',
            'Đẩy xuống nền bằng <code>&amp;</code> chỉ gỡ job khỏi tiền cảnh của shell; nó không gỡ job khỏi phiên. Khi kết nối SSH kết thúc, SIGHUP đi tới các tiến trình của phiên và lượt dựng chết — thường là chết giữa chừng, để lại một hiện vật viết dở và một lệnh <code>ssh</code> đã thoát 0 từ một tiếng trước. <code>tmux new -d</code> là câu trả lời tốt nhất trong ba cách vì bạn gắn lại được sau đó để xem chuyện gì thật sự xảy ra; <code>nohup</code> chỉ chuyển hướng tín hiệu và đầu ra. Còn thứ gì phải sống qua cả một lần khởi động lại máy thì thuộc về một unit của systemd, tức chương 11.',
          ),
        }),

        // q8 · đáp án 0
        mcq({
          prompt: B(
            'Real run on Linux. <code>empty/</code> is an empty directory; <code>dst/</code> held two files:' + code(
              '$ rsync -a --delete rs3/empty/ rs3/dst/\n' +
              '$ echo $?\n' +
              '0\n' +
              '$ ls -A rs3/dst | wc -l\n' +
              '0',
            ) + 'The same command in a deploy script, where the source is a build directory. What happened, and which guard prevents it?',
            'Chạy thật trên Linux. <code>empty/</code> là thư mục rỗng; <code>dst/</code> đang có hai file:' + code(
              '$ rsync -a --delete rs3/empty/ rs3/dst/\n' +
              '$ echo $?\n' +
              '0\n' +
              '$ ls -A rs3/dst | wc -l\n' +
              '0',
            ) + 'Cũng lệnh đó trong một script deploy, với nguồn là thư mục build. Chuyện gì đã xảy ra, và cái chốt nào ngăn được nó?',
          ),
          options: [
            B(
              'rsync did exactly what it was told — make the destination match the source — so a build that failed and left <code>dist/</code> empty erases production, and it reports success. Guard it: refuse to sync when the source is empty, and add <code>--max-delete=50</code> so an unexpected mass deletion aborts.',
              'rsync làm đúng thứ nó được bảo — làm cho đích khớp với nguồn — nên một lượt dựng hỏng để lại <code>dist/</code> rỗng sẽ xoá trắng production, và nó báo thành công. Hãy chốt lại: từ chối đồng bộ khi nguồn rỗng, và thêm <code>--max-delete=50</code> để một lần xoá hàng loạt bất thường bị bỏ dở.',
            ),
            B(
              'The trailing slash on the source is what caused the deletion; without it rsync would have created <code>dst/empty/</code> and left the two files alone, so removing that one character is the fix.',
              'Dấu gạch chéo cuối ở nguồn mới là thứ gây ra việc xoá; không có nó thì rsync đã tạo <code>dst/empty/</code> và để yên hai file kia, nên bỏ đúng một ký tự đó là cách chữa.',
            ),
            B(
              'This is a bug in <code>--delete</code>: it is documented to skip the deletion pass entirely when the source contains no files, and an exit status of 0 with an emptied destination means the rsync build on this machine needs upgrading.',
              'Đây là lỗi của <code>--delete</code>: tài liệu ghi rằng nó bỏ hẳn lượt xoá khi nguồn không có file nào, và mã thoát 0 kèm một cái đích bị dọn sạch nghĩa là bản rsync trên máy này cần nâng cấp.',
            ),
            B(
              'Nothing was really deleted — <code>ls -A</code> counts zero because rsync moved the files into a hidden staging directory that it removes only after the next successful run, which is what <code>--delete-after</code> refers to.',
              'Thật ra chưa có gì bị xoá — <code>ls -A</code> đếm ra 0 vì rsync đã chuyển mấy file đó vào một thư mục dàn dựng ẩn, và nó chỉ dọn thư mục ấy sau lần chạy thành công kế tiếp, đó chính là ý nghĩa của <code>--delete-after</code>.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: exit 0, destination emptied, no warning of any kind. This is not a bug — it is the definition of a mirror, and it is why <code>--delete</code> deserves the same respect as <code>rm -rf</code>. Three cheap defences, all from Lesson 9.4: run it once with <code>--dry-run</code> and read the <code>*deleting</code> lines; use <code>--delete-after</code> so deletions happen only once the transfer has succeeded; and cap the damage with <code>--max-delete=50</code>. The line that matters most in a deploy script is the precondition — <code>[ -n "$(ls -A "$src")" ] || die "source is empty, refusing to sync"</code> — because it turns "the build failed and rsync then emptied production" into a refusal with a clear message.',
            'Đo thật: mã thoát 0, đích bị dọn sạch, không một lời cảnh báo nào. Đây không phải lỗi — đó là định nghĩa của một bản sao gương, và vì thế <code>--delete</code> xứng đáng được kính trọng ngang <code>rm -rf</code>. Ba lá chắn rẻ tiền, đều lấy từ bài 9.4: chạy một lượt với <code>--dry-run</code> rồi đọc các dòng <code>*deleting</code>; dùng <code>--delete-after</code> để việc xoá chỉ diễn ra sau khi truyền xong; và chặn thiệt hại bằng <code>--max-delete=50</code>. Dòng quan trọng nhất trong một script deploy là điều kiện tiên quyết — <code>[ -n "$(ls -A "$src")" ] || die "nguồn rỗng, từ chối đồng bộ"</code> — vì nó biến "lượt dựng hỏng rồi rsync dọn sạch production" thành một lời từ chối kèm thông báo rõ ràng.',
          ),
        }),

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'A client cannot reach port 3000 on your VPS. You run <code>tcpdump</code> on the server while the client retries, and it prints nothing at all — not one packet. What has that single observation ruled out?',
            'Một trình khách không với tới được cổng 3000 trên VPS của bạn. Bạn chạy <code>tcpdump</code> trên máy chủ trong lúc trình khách thử lại, và nó không in ra gì cả — không một gói tin nào. Chỉ một quan sát đó đã loại trừ được những gì?',
          ),
          options: [
            B(
              'It rules out DNS. A packet that never arrives means the client resolved the name to an address that does not exist, and the next step is <code>dig +short</code> on the client side before touching the server again.',
              'Nó loại trừ DNS. Một gói tin không bao giờ tới nghĩa là trình khách phân giải tên ra một địa chỉ không tồn tại, và bước tiếp theo là chạy <code>dig +short</code> ở phía trình khách trước khi đụng lại vào máy chủ.',
            ),
            B(
              'It rules out both the host firewall and the bind address, because neither can stop a packet from being SEEN arriving. The block is upstream of the machine — a cloud security group, a network ACL, or the wrong IP entirely — and no amount of <code>ufw</code> configuration will change it.',
              'Nó loại trừ cả tường lửa của máy lẫn địa chỉ gắn, vì không cái nào ngăn được việc THẤY một gói tin đi tới. Chỗ chặn nằm phía trên cái máy — một nhóm bảo mật của đám mây, một ACL mạng, hoặc hoàn toàn sai địa chỉ IP — và cấu hình <code>ufw</code> bao nhiêu cũng không đổi được.',
            ),
            B(
              'It rules out the cloud security group. Provider firewalls drop traffic after it reaches the network interface, so a dropped packet still appears in <code>tcpdump</code> — an empty capture means the packet was never sent, which points at the client.',
              'Nó loại trừ nhóm bảo mật của đám mây. Tường lửa của nhà cung cấp vứt lưu lượng sau khi nó tới card mạng, nên gói bị vứt vẫn hiện trong <code>tcpdump</code> — bản chụp rỗng nghĩa là gói chưa bao giờ được gửi, và điều đó chĩa vào trình khách.',
            ),
            B(
              'It rules out nothing useful. <code>tcpdump</code> only captures traffic on the interface named with <code>-i</code>, and since a service on 3000 is usually behind a proxy, the packets are travelling on the loopback interface where a capture on <code>eth0</code> cannot see them.',
              'Nó không loại trừ được gì hữu ích. <code>tcpdump</code> chỉ bắt lưu lượng trên giao diện chỉ định bằng <code>-i</code>, và vì một dịch vụ ở cổng 3000 thường nằm sau proxy nên gói tin đi trên giao diện loopback, chỗ mà một bản chụp trên <code>eth0</code> không thấy được.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A host firewall drops the packet AFTER the kernel has received it, so <code>tcpdump</code> still sees the SYN — that is the whole reason the tool settles this question. Seeing the SYN with no reply means the packet arrived and this machine rejected it, which points at <code>ufw</code> or at nothing listening. Seeing NOTHING means the traffic died before it reached you. That single distinction saves the most commonly wasted hour in the whole chapter, and it is why <code>tcpdump -i any</code> comes before <code>ufw status</code> in the ladder — <code>-i any</code> also covers the loopback objection in option D.',
            'Tường lửa của máy vứt gói tin SAU khi nhân đã nhận, nên <code>tcpdump</code> vẫn thấy gói SYN — đó chính là lý do công cụ này giải quyết được câu hỏi. Thấy SYN mà không có ai trả lời nghĩa là gói tin ĐÃ tới nơi và chính máy này từ chối nó, và điều đó chĩa vào <code>ufw</code> hoặc vào chuyện không có gì lắng nghe. Không thấy GÌ CẢ nghĩa là lưu lượng đã chết trước khi tới được bạn. Đúng một chỗ phân biệt ấy tiết kiệm cái giờ bị phí phổ biến nhất của cả chương, và đó là lý do <code>tcpdump -i any</code> đứng trước <code>ufw status</code> trong cái thang — cờ <code>-i any</code> cũng vô hiệu luôn lý lẽ về loopback ở phương án D.',
          ),
        }),

        // ── Chương 10 — Đĩa, gói phần mềm & log (7 câu) ──────────────────
        // q10 · đáp án 2
        mcq({
          prompt: B(
            'Real run on Linux, GNU coreutils 9.1. The same four lines of <code>du</code> output, sorted two ways:' + code(
              '$ sort -h sizes.txt          $ sort -n sizes.txt\n' +
              '45M   /c                     1.1G  /d\n' +
              '900M  /a                     2.3G  /b\n' +
              '1.1G  /d                     45M   /c\n' +
              '2.3G  /b                     900M  /a',
            ) + 'You are hunting for what filled a disk. Why is the right-hand ordering wrong?',
            'Chạy thật trên Linux, GNU coreutils 9.1. Cùng bốn dòng đầu ra của <code>du</code>, sắp theo hai cách:' + code(
              '$ sort -h sizes.txt          $ sort -n sizes.txt\n' +
              '45M   /c                     1.1G  /d\n' +
              '900M  /a                     2.3G  /b\n' +
              '1.1G  /d                     45M   /c\n' +
              '2.3G  /b                     900M  /a',
            ) + 'Bạn đang truy tìm thứ làm đầy đĩa. Vì sao thứ tự bên phải là SAI?',
          ),
          options: [
            B(
              '<code>sort -n</code> sorted in descending order while <code>sort -h</code> sorted ascending, so the two lists contain the same ranking read from opposite ends and either is usable once you know which end to read.',
              '<code>sort -n</code> sắp giảm dần còn <code>sort -h</code> sắp tăng dần, nên hai danh sách chứa cùng một thứ hạng đọc từ hai đầu ngược nhau và dùng cái nào cũng được, miễn biết đọc từ đầu nào.',
            ),
            B(
              '<code>sort -n</code> sorted on the second column instead of the first, because a numeric sort skips fields that do not begin with a digit and falls through to the next one, which here is the path.',
              '<code>sort -n</code> sắp theo cột thứ hai chứ không phải cột đầu, vì phép sắp theo số bỏ qua những trường không bắt đầu bằng chữ số rồi rơi sang trường kế tiếp, ở đây là đường dẫn.',
            ),
            B(
              '<code>sort -n</code> reads only the leading number and ignores the unit letter, so it compares 1.1 against 2.3 against 45 against 900 and puts the two GIGABYTE entries FIRST in an ascending sort. <code>sort -h</code> understands the suffixes and is the one to use on human-readable sizes.',
              '<code>sort -n</code> chỉ đọc con số ở đầu và bỏ qua chữ cái đơn vị, nên nó so 1,1 với 2,3 với 45 với 900 rồi đặt hai mục tính bằng GIGABYTE lên ĐẦU trong một phép sắp tăng dần. <code>sort -h</code> hiểu các hậu tố và nó mới là lệnh dùng cho cỡ đọc-được-bằng-mắt.',
            ),
            B(
              '<code>sort -n</code> is comparing the strings byte by byte because the file uses tabs rather than spaces as a separator, and a numeric sort silently degrades to a lexicographic one whenever it cannot find a field boundary.',
              '<code>sort -n</code> đang so từng byte của chuỗi vì file dùng ký tự tab chứ không phải dấu cách làm dấu phân cách, và phép sắp theo số âm thầm tụt xuống thành sắp theo bảng chữ cái mỗi khi nó không tìm được ranh giới trường.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured. Both sorts are ascending; the difference is entirely what they consider a number. <code>-n</code> parses <code>2.3G</code> as 2.3 and stops at the <code>G</code>, so the biggest directories float to the top of an ascending list and the classic <code>du … | sort -n | tail</code> shows you the SMALLEST offenders. <code>-h</code> compares 45M, 900M, 1.1G, 2.3G correctly. The pipeline worth memorising is <code>du -h -x --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code> — <code>-x</code> to stay on one filesystem, <code>2&gt;/dev/null</code> to silence permission noise, <code>sort -h</code> so the answer really is at the bottom.',
            'Đã đo thật. Cả hai đều sắp tăng dần; khác biệt nằm trọn ở chỗ chúng coi cái gì là số. <code>-n</code> đọc <code>2.3G</code> thành 2,3 rồi dừng ở chữ <code>G</code>, nên những thư mục to nhất nổi lên đầu một danh sách tăng dần và cái ống dẫn kinh điển <code>du … | sort -n | tail</code> lại cho bạn thấy những kẻ NHỎ nhất. <code>-h</code> so 45M, 900M, 1.1G, 2.3G đúng thứ tự. Ống dẫn đáng thuộc là <code>du -h -x --max-depth=1 / 2&gt;/dev/null | sort -h | tail -15</code> — <code>-x</code> để ở yên trên một hệ thống file, <code>2&gt;/dev/null</code> để dập tiếng ồn quyền, <code>sort -h</code> để câu trả lời thật sự nằm ở dưới cùng.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'Real run on Linux: a small ext4 filesystem, created with a deliberately tiny inode table, filled with directories until writes started failing.' + code(
              "$ touch newfile\n" +
              "touch: cannot touch 'newfile': No space left on device\n" +
              '\n' +
              '$ df -h /tmp/mnt\n' +
              'Filesystem      Size  Used Avail Use% Mounted on\n' +
              '/dev/loop0       15M   67K   14M   1% /tmp/mnt\n' +
              '\n' +
              '$ df -i /tmp/mnt\n' +
              'Filesystem     Inodes IUsed IFree IUse% Mounted on\n' +
              '/dev/loop0         64    64     0  100% /tmp/mnt',
            ) + 'On a real server in this state, which action actually restores the ability to write?',
            'Chạy thật trên Linux: một hệ thống file ext4 nhỏ, tạo với bảng inode cố ý làm bé, rồi nhồi thư mục vào tới khi các lệnh ghi bắt đầu hỏng.' + code(
              "$ touch newfile\n" +
              "touch: cannot touch 'newfile': No space left on device\n" +
              '\n' +
              '$ df -h /tmp/mnt\n' +
              'Filesystem      Size  Used Avail Use% Mounted on\n' +
              '/dev/loop0       15M   67K   14M   1% /tmp/mnt\n' +
              '\n' +
              '$ df -i /tmp/mnt\n' +
              'Filesystem     Inodes IUsed IFree IUse% Mounted on\n' +
              '/dev/loop0         64    64     0  100% /tmp/mnt',
            ) + 'Trên một máy chủ thật ở trạng thái này, hành động nào THỰC SỰ khôi phục được khả năng ghi?',
          ),
          options: [
            B(
              'Deleting the three largest files on the filesystem. Each one returns both its blocks and the metadata the kernel had reserved alongside them, and freeing a few gigabytes always frees proportionally many inodes.',
              'Xoá ba file lớn nhất trên hệ thống file. Mỗi cái trả lại cả khối dữ liệu lẫn phần siêu dữ liệu mà nhân đã dành kèm theo, và giải phóng vài gigabyte thì luôn giải phóng một lượng inode tương ứng.',
            ),
            B(
              'Running <code>tune2fs -m 1</code> to reduce the reserved-block percentage from 5% to 1%, which hands the reservation back to ordinary users and is the standard remedy when <code>df -h</code> shows free space that writes cannot use.',
              'Chạy <code>tune2fs -m 1</code> để hạ tỉ lệ khối dành riêng từ 5% xuống 1%, trả phần dự trữ đó lại cho người dùng thường — cách chữa tiêu chuẩn khi <code>df -h</code> hiện ra chỗ trống mà các lệnh ghi không dùng được.',
            ),
            B(
              'Remounting the filesystem read-write. <code>No space left on device</code> on a filesystem that <code>df -h</code> reports as 1% used is the kernel\'s way of saying the volume was remounted read-only after an I/O error, and <code>dmesg</code> will show it.',
              'Gắn lại hệ thống file ở chế độ đọc-ghi. Lỗi <code>No space left on device</code> trên một hệ thống file mà <code>df -h</code> báo mới dùng 1% là cách nhân nói rằng ổ đã bị gắn lại ở chế độ chỉ-đọc sau một lỗi vào-ra, và <code>dmesg</code> sẽ cho thấy điều đó.',
            ),
            B(
              'Deleting a LARGE NUMBER of files, or recreating the filesystem with more inodes. The inode table is fixed at <code>mkfs</code> time and is exhausted here; since bytes are irrelevant, removing a few huge files frees space nobody needed and leaves every write still failing.',
              'Xoá THẬT NHIỀU file, hoặc dựng lại hệ thống file với nhiều inode hơn. Bảng inode được ấn định ngay lúc <code>mkfs</code> và ở đây đã cạn; vì số byte không liên quan, xoá vài file khổng lồ chỉ giải phóng chỗ chẳng ai cần và mọi lệnh ghi vẫn hỏng.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured inside a throwaway privileged container: <code>mkfs.ext4 -N 64</code> on a 16 MB image, then directories created until <code>touch</code> failed. One inode per file or directory, allocated once when the filesystem is made — so the two numbers are independent, and a machine can be 1% full of bytes and 100% full of files at the same time. Real-world causes are always the same shape: millions of tiny files in a session directory, a mail spool, a cache, or one <code>node_modules</code> per release. <code>tune2fs -m</code> and a read-only remount are real things, but neither creates inodes.',
            'Đo trong một container đặc quyền dùng một lần rồi xoá: <code>mkfs.ext4 -N 64</code> trên một ảnh 16 MB, rồi tạo thư mục cho tới khi <code>touch</code> hỏng. Mỗi file hoặc thư mục tốn một inode, và số inode được cấp một lần duy nhất lúc tạo hệ thống file — nên hai con số đó độc lập nhau, và một cái máy có thể vừa đầy 1% theo byte vừa đầy 100% theo file. Nguyên nhân ngoài đời luôn cùng một hình dạng: hàng triệu file tí hon trong một thư mục phiên, một hàng đợi thư, một bộ đệm, hay một <code>node_modules</code> cho mỗi bản phát hành. <code>tune2fs -m</code> và chuyện gắn lại chế độ chỉ-đọc là những thứ có thật, nhưng không cái nào tạo ra inode.',
          ),
        }),

        // q12 · đáp án 0
        mcq({
          prompt: B(
            'A server is at 96% disk. Somebody suggests the one-liner that "always frees the most space":' + code('docker system prune -a --volumes') + 'Why does the course tell you to run something narrower first?',
            'Một máy chủ đang ở 96% đĩa. Có người đề xuất câu lệnh một dòng "bao giờ cũng giải phóng được nhiều nhất":' + code('docker system prune -a --volumes') + 'Vì sao giáo trình bảo bạn chạy thứ gì đó hẹp hơn trước?',
          ),
          options: [
            B(
              'Because <code>--volumes</code> removes volumes that no RUNNING container is using — which includes the database volume of any container that happens to be stopped at that moment. <code>docker image prune -a</code> and <code>docker builder prune</code> reclaim most of the same space and cannot touch a volume.',
              'Vì <code>--volumes</code> xoá những volume không được container nào ĐANG CHẠY dùng tới — trong đó có cả volume cơ sở dữ liệu của bất kỳ container nào tình cờ đang dừng lúc ấy. <code>docker image prune -a</code> và <code>docker builder prune</code> đòi lại gần như cùng lượng chỗ đó mà không thể đụng tới volume nào.',
            ),
            B(
              'Because <code>prune</code> holds a global lock on the Docker daemon for as long as it runs, so every container on the machine is paused until it finishes — on a 96% full disk that can take long enough to trip the health checks and restart the whole stack.',
              'Vì <code>prune</code> giữ một khoá toàn cục trên daemon Docker suốt thời gian nó chạy, nên mọi container trên máy đều bị tạm dừng cho tới khi xong — trên một cái đĩa đầy 96% thì việc đó đủ lâu để làm hỏng các phép kiểm sức khoẻ và khởi động lại cả stack.',
            ),
            B(
              'Because it only deletes dangling layers, so it reclaims almost nothing on a machine whose space is held by tagged images; the useful command is <code>docker system df</code>, which both measures and reclaims in one pass.',
              'Vì nó chỉ xoá những tầng mồ côi, nên nó gần như không đòi lại được gì trên một cái máy mà chỗ đĩa đang bị các image có nhãn giữ; lệnh hữu ích là <code>docker system df</code>, thứ vừa đo vừa đòi lại chỗ trong một lượt.',
            ),
            B(
              'Because <code>-a</code> also removes the build cache that the next deploy needs, so the deploy afterwards rebuilds every layer from scratch and fails on the same full disk it was trying to clear.',
              'Vì <code>-a</code> xoá luôn bộ đệm dựng mà lần deploy kế tiếp cần tới, nên lượt deploy sau đó dựng lại mọi tầng từ đầu và hỏng trên đúng cái đĩa đầy mà nó đang cố dọn.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The dangerous word is <code>--volumes</code>, and the reason it is dangerous is subtle: "unused" means "not attached to a running container", not "not needed". Stop a database for two minutes during an incident, run this, and the data is gone. The safe order from Lesson 10.1 is measure first (<code>df -h</code>, <code>df -i</code>, <code>du --max-depth=1</code>), then reclaim things that regenerate (<code>apt clean</code>, <code>docker builder prune</code>, a journal vacuum), then truncate logs, then <code>docker image prune -a</code> — and only touch volumes after <code>docker volume ls</code> has told you what is in them.',
            'Chữ nguy hiểm là <code>--volumes</code>, và lý do nó nguy hiểm khá tinh vi: "không dùng" nghĩa là "không gắn với container nào đang chạy", chứ không phải "không cần tới". Dừng một cơ sở dữ liệu hai phút trong lúc xử lý sự cố, chạy lệnh này, và dữ liệu biến mất. Thứ tự an toàn của bài 10.1 là đo trước (<code>df -h</code>, <code>df -i</code>, <code>du --max-depth=1</code>), rồi đòi lại những thứ tự sinh lại được (<code>apt clean</code>, <code>docker builder prune</code>, hút bớt journal), rồi cắt cụt log, rồi <code>docker image prune -a</code> — và chỉ đụng vào volume sau khi <code>docker volume ls</code> đã nói cho bạn biết trong đó có gì.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'Real run on Debian 12. A machine keeps installing an older version than you expect:' + code(
              '$ apt policy nginx\n' +
              'nginx:\n' +
              '  Installed: (none)\n' +
              '  Candidate: 1.22.1-9+deb12u9\n' +
              '  Version table:\n' +
              '     1.22.1-9+deb12u9 500\n' +
              '        500 http://deb.debian.org/debian bookworm/main amd64 Packages',
            ) + 'What is this output actually telling you?',
            'Chạy thật trên Debian 12. Một cái máy cứ cài phiên bản cũ hơn bạn mong đợi:' + code(
              '$ apt policy nginx\n' +
              'nginx:\n' +
              '  Installed: (none)\n' +
              '  Candidate: 1.22.1-9+deb12u9\n' +
              '  Version table:\n' +
              '     1.22.1-9+deb12u9 500\n' +
              '        500 http://deb.debian.org/debian bookworm/main amd64 Packages',
            ) + 'Đầu ra này thật ra đang nói gì với bạn?',
          ),
          options: [
            B(
              'That the package is held. <code>Installed: (none)</code> with a candidate present is how <code>apt</code> reports a package under <code>apt-mark hold</code>, and <code>apt-mark unhold nginx</code> will let the install proceed.',
              'Rằng gói này đang bị ghim. <code>Installed: (none)</code> mà vẫn có ứng viên là cách <code>apt</code> báo một gói đang nằm dưới <code>apt-mark hold</code>, và <code>apt-mark unhold nginx</code> sẽ cho phép cài tiếp.',
            ),
            B(
              'That nothing is installed yet, that exactly ONE repository offers this package, and that <code>apt install nginx</code> would install 1.22.1-9+deb12u9 from Debian bookworm/main. The 500 is the priority of that source — when several sources list a package, the highest priority wins, and this listing is where an unexpected third-party repository would show itself.',
              'Rằng chưa có gì được cài, rằng đúng MỘT kho phần mềm cung cấp gói này, và rằng <code>apt install nginx</code> sẽ cài bản 1.22.1-9+deb12u9 từ Debian bookworm/main. Con số 500 là độ ưu tiên của nguồn đó — khi nhiều nguồn cùng có một gói thì nguồn ưu tiên cao nhất thắng, và chính bảng này là chỗ một kho bên thứ ba bất ngờ sẽ tự lộ ra.',
            ),
            B(
              'That the catalogue is stale. A single line in the version table means <code>apt update</code> has not been run since the last release, and the newer versions will appear once the package lists are refreshed.',
              'Rằng danh mục đã cũ. Chỉ một dòng trong bảng phiên bản nghĩa là <code>apt update</code> chưa chạy kể từ bản phát hành gần nhất, và các phiên bản mới hơn sẽ hiện ra khi danh sách gói được làm mới.',
            ),
            B(
              'That the candidate cannot be installed. Priority 500 is below the default threshold of 990 that <code>apt</code> requires before it will select a version automatically, which is why the package stays uninstalled until you pin it explicitly.',
              'Rằng ứng viên đó không cài được. Độ ưu tiên 500 nằm dưới ngưỡng mặc định 990 mà <code>apt</code> đòi hỏi trước khi tự chọn một phiên bản, và đó là lý do gói này cứ nằm im chưa được cài cho tới khi bạn ghim nó một cách tường minh.',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>apt policy</code> is the command that answers "why is it installing THAT version". It lists every repository offering the package with a priority number, and on a machine that keeps pulling something unexpected, a second line with a higher number names the culprit in five seconds. Two related habits from Lesson 10.2: <code>ls /etc/apt/sources.list.d/</code> lists every party that can install software as root on the next upgrade — worth reading on any server you inherit — and a held package shows up in <code>apt-mark showhold</code>, not as <code>Installed: (none)</code>.',
            '<code>apt policy</code> chính là lệnh trả lời câu "vì sao nó lại cài ĐÚNG phiên bản đó". Nó liệt kê mọi kho có gói ấy kèm một con số ưu tiên, và trên một cái máy cứ kéo về thứ bất ngờ thì dòng thứ hai với số cao hơn sẽ gọi tên thủ phạm trong năm giây. Hai thói quen liên quan từ bài 10.2: <code>ls /etc/apt/sources.list.d/</code> liệt kê mọi bên có thể cài phần mềm với quyền root ở lần nâng cấp kế tiếp — đáng đọc trên bất kỳ máy chủ nào bạn tiếp quản — và một gói bị ghim thì hiện ra ở <code>apt-mark showhold</code>, chứ không phải ở dòng <code>Installed: (none)</code>.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'In March somebody worked around a bug by pinning a package:' + code(
              'sudo apt-mark hold nginx',
            ) + 'It is now December and nobody has thought about it since. What is the cost?',
            'Hồi tháng Ba có người né một lỗi bằng cách ghim một gói lại:' + code(
              'sudo apt-mark hold nginx',
            ) + 'Giờ đã là tháng Mười Hai và từ đó không ai nghĩ tới nó nữa. Cái giá phải trả là gì?',
          ),
          options: [
            B(
              'None, as long as the machine runs <code>unattended-upgrades</code>: a hold blocks feature upgrades only, and the security pocket is applied on a separate code path that <code>apt-mark</code> deliberately does not affect.',
              'Không có gì, miễn cái máy có chạy <code>unattended-upgrades</code>: một lần ghim chỉ chặn nâng cấp tính năng, còn nhánh bảo mật được áp qua một đường mã riêng mà <code>apt-mark</code> cố ý không đụng tới.',
            ),
            B(
              'The next <code>apt upgrade</code> fails outright, because the held version eventually leaves the archive and apt cannot satisfy the pin — which is annoying but at least loud, so somebody notices within a release cycle.',
              'Lần <code>apt upgrade</code> kế tiếp hỏng thẳng, vì phiên bản bị ghim rồi cũng rời kho lưu trữ và apt không thoả mãn được cái ghim — phiền thật nhưng ít ra là ồn ào, nên trong vòng một chu kỳ phát hành sẽ có người để ý.',
            ),
            B(
              'The package stops receiving SECURITY updates as well, and <code>unattended-upgrades</code> skips it silently — so a workaround placed in March is quietly accumulating vulnerabilities in December, with nothing anywhere reporting it. <code>apt-mark showhold</code> is the audit.',
              'Gói đó cũng thôi nhận luôn bản vá BẢO MẬT, và <code>unattended-upgrades</code> bỏ qua nó trong im lặng — nên một cách né lỗi đặt hồi tháng Ba đang lặng lẽ tích vun lỗ hổng tới tháng Mười Hai, mà chẳng chỗ nào báo cáo gì. <code>apt-mark showhold</code> chính là phép rà.',
            ),
            B(
              'The hold expires on its own after ninety days, so the real risk is the opposite one: the package was silently upgraded back in June and the bug the hold was working around has been present in production ever since.',
              'Cái ghim tự hết hạn sau chín mươi ngày, nên rủi ro thật lại là chiều ngược lại: gói ấy đã âm thầm được nâng cấp từ hồi tháng Sáu và cái lỗi mà việc ghim đang né đã hiện diện trên production từ đó tới nay.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A hold is a promise to yourself that you will revisit it, and the failure mode is that nothing ever reminds you. <code>apt upgrade</code> keeps working and simply leaves the package where it is; <code>unattended-upgrades</code> honours the hold too. Record the reason in a comment or a ticket, and put <code>apt-mark showhold</code> in whatever five-minute audit you run on a server — alongside <code>ls /etc/apt/sources.list.d/</code>, <code>[ -f /var/run/reboot-required ]</code> and <code>systemctl --failed</code>.',
            'Một cái ghim là lời hứa với chính mình rằng sẽ quay lại xem xét, và kiểu hỏng của nó là chẳng có gì nhắc bạn cả. <code>apt upgrade</code> vẫn chạy bình thường và chỉ để yên gói đó tại chỗ; <code>unattended-upgrades</code> cũng tôn trọng cái ghim. Hãy ghi lý do vào một dòng chú thích hay một phiếu công việc, và đưa <code>apt-mark showhold</code> vào bất cứ phép rà năm phút nào bạn chạy trên máy chủ — cạnh <code>ls /etc/apt/sources.list.d/</code>, <code>[ -f /var/run/reboot-required ]</code> và <code>systemctl --failed</code>.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'During an incident you leave this running and it prints nothing for four minutes, then dumps a screenful at once:' + code(
              'journalctl -u myapp -f | grep ERROR',
            ) + 'What is happening, and what is the fix?',
            'Trong lúc xử lý sự cố bạn để lệnh này chạy, và nó không in gì suốt bốn phút rồi đổ ra một màn hình cùng một lúc:' + code(
              'journalctl -u myapp -f | grep ERROR',
            ) + 'Chuyện gì đang xảy ra, và cách chữa là gì?',
          ),
          options: [
            B(
              '<code>grep</code> writing into a pipe switches from line buffering to block buffering, so it holds output until it has several kilobytes. Add <code>--line-buffered</code> — and note the symptom is indistinguishable from "there are no errors", which is the worst possible ambiguity during an incident.',
              '<code>grep</code> khi ghi vào một ống dẫn thì chuyển từ đệm theo dòng sang đệm theo khối, nên nó giữ đầu ra lại cho tới khi gom đủ vài kilobyte. Hãy thêm <code>--line-buffered</code> — và để ý rằng triệu chứng này không phân biệt được với "không có lỗi nào", chỗ nhập nhằng tệ nhất có thể có giữa một sự cố.',
            ),
            B(
              '<code>journalctl -f</code> polls the journal on a fixed interval and only wakes up every few minutes when the unit is idle; passing <code>--follow --no-tail</code> makes it watch the file descriptor directly and emit each entry as it lands.',
              '<code>journalctl -f</code> thăm dò journal theo một chu kỳ cố định và chỉ thức dậy vài phút một lần khi unit đang rảnh; truyền <code>--follow --no-tail</code> khiến nó theo dõi thẳng mô tả file và phát ra từng mục ngay khi mục đó rơi vào.',
            ),
            B(
              'The journal is compressing entries in memory before flushing them to disk, and <code>-f</code> can only read what has been flushed; <code>journalctl --flush</code> in another terminal forces the pending entries out and restores live output.',
              'Journal đang nén các mục trong bộ nhớ trước khi đẩy xuống đĩa, và <code>-f</code> chỉ đọc được thứ đã đẩy xong; chạy <code>journalctl --flush</code> ở một terminal khác sẽ ép các mục đang chờ ra ngoài và khôi phục đầu ra trực tiếp.',
            ),
            B(
              '<code>-u</code> and <code>-f</code> cannot be combined: the unit filter is applied after the follow cursor, so entries are buffered until the filter catches up. Use <code>journalctl -f _SYSTEMD_UNIT=myapp.service</code> instead, which filters at the source.',
              '<code>-u</code> và <code>-f</code> không kết hợp được: bộ lọc unit được áp sau con trỏ theo dõi, nên các mục bị dồn lại cho tới khi bộ lọc đuổi kịp. Hãy dùng <code>journalctl -f _SYSTEMD_UNIT=myapp.service</code> thay thế, nó lọc ngay tại nguồn.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the Lesson 3.2 buffering trap, and it bites hardest here. The C library gives a program line buffering when its output is a terminal and block buffering when it is a pipe — so <code>grep ERROR</code> alone streams, and <code>grep ERROR | tee</code> or <code>grep ERROR | while read</code> stalls. <code>grep --line-buffered</code> fixes grep; <code>stdbuf -oL cmd</code> fixes most other programs; <code>awk</code> has <code>fflush()</code>. Getting this wrong during an incident means a monitoring pipeline that shows nothing looks exactly like a service with no errors.',
            'Đây là cái bẫy đệm của bài 3.2, và ở đây nó cắn đau nhất. Thư viện C cho một chương trình chế độ đệm theo dòng khi đầu ra là terminal, và đệm theo khối khi đầu ra là ống dẫn — nên <code>grep ERROR</code> đứng một mình thì chảy đều, còn <code>grep ERROR | tee</code> hay <code>grep ERROR | while read</code> thì đứng khựng. <code>grep --line-buffered</code> chữa cho grep; <code>stdbuf -oL cmd</code> chữa cho phần lớn chương trình khác; <code>awk</code> thì có <code>fflush()</code>. Sai chỗ này giữa một sự cố nghĩa là một đường ống theo dõi không hiện gì trông y hệt một dịch vụ không có lỗi nào.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'You inherit a server, and this is the first thing you check:' + code(
              '$ ls -d /var/log/journal\n' +
              "ls: cannot access '/var/log/journal': No such file or directory",
            ) + 'Why does that one missing directory change how you handle the next incident?',
            'Bạn tiếp quản một máy chủ, và đây là thứ đầu tiên bạn kiểm:' + code(
              '$ ls -d /var/log/journal\n' +
              "ls: cannot access '/var/log/journal': No such file or directory",
            ) + 'Vì sao đúng một thư mục vắng mặt lại thay đổi cách bạn xử lý sự cố kế tiếp?',
          ),
          options: [
            B(
              'Because journald has nowhere to write, so nothing is being logged at all and every <code>journalctl</code> query on this machine returns an empty result until the directory is created.',
              'Vì journald không có chỗ nào để ghi, nên chẳng có gì được ghi log cả và mọi truy vấn <code>journalctl</code> trên máy này trả về kết quả rỗng cho tới khi thư mục đó được tạo ra.',
            ),
            B(
              'Because the unit files that would normally live there are missing too, so <code>systemctl --failed</code> cannot report anything and you must read each service\'s own log file in <code>/var/log</code> instead.',
              'Vì những file unit lẽ ra nằm ở đó cũng vắng mặt luôn, nên <code>systemctl --failed</code> không báo được gì và bạn phải đọc file log riêng của từng dịch vụ trong <code>/var/log</code> thay thế.',
            ),
            B(
              'Because logs are being written straight to <code>/var/log/syslog</code> instead, which no longer carries the structured fields — so <code>journalctl _PID=</code> and the other field filters silently match nothing and appear to prove the process never logged.',
              'Vì log đang được ghi thẳng vào <code>/var/log/syslog</code>, nơi không còn mang các trường có cấu trúc — nên <code>journalctl _PID=</code> và các bộ lọc theo trường khác âm thầm không khớp gì cả và trông như đã chứng minh tiến trình chưa hề ghi log.',
            ),
            B(
              'Because journald then keeps everything in <code>/run</code> — memory — so the entire log history disappears on reboot. The standard response of "reboot it, then investigate" destroys the evidence, and you must copy the journal out first: <code>journalctl -b &gt; /tmp/boot.log</code>.',
              'Vì khi đó journald giữ mọi thứ trong <code>/run</code> — tức bộ nhớ — nên toàn bộ lịch sử log biến mất khi khởi động lại. Phản xạ tiêu chuẩn "khởi động lại rồi hẵng điều tra" sẽ phá huỷ chứng cứ, và bạn phải chép journal ra trước: <code>journalctl -b &gt; /tmp/boot.log</code>.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A volatile journal is the default in many container images and some minimal installs, and it is a nasty surprise precisely because everything looks normal until the moment you restart to fix something and then cannot investigate what happened. <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> makes it persistent. While you are there, set a size cap too — journald uses up to 10% of the filesystem by default, which is 8 GB on an 80 GB disk shared with a database.',
            'Journal dạng bay hơi là mặc định trong nhiều ảnh container và vài bản cài tối giản, và nó là bất ngờ khó chịu chính vì mọi thứ trông vẫn bình thường cho tới đúng khoảnh khắc bạn khởi động lại để sửa một thứ gì đó rồi không điều tra được chuyện đã xảy ra. Chạy <code>sudo mkdir -p /var/log/journal &amp;&amp; sudo systemctl restart systemd-journald</code> là nó thành bền vững. Nhân tiện hãy đặt luôn trần dung lượng — mặc định journald dùng tới 10% hệ thống file, tức 8 GB trên một cái đĩa 80 GB đang chia chung với cơ sở dữ liệu.',
          ),
        }),

        // ── Chương 11 — systemd, cron & quản trị (7 câu) ─────────────────
        // q17 · đáp án 2
        mcq({
          prompt: B(
            'Real run on Linux, systemd 252. Six units, each differing only in <code>ExecStart=</code>, all passed through <code>systemd-analyze verify</code>:' + code(
              'ExecStart=sleep 60           → (no output)   exit 0\n' +
              'ExecStart=/usr/bin/sleep 60  → (no output)   exit 0\n' +
              'ExecStart=mytool-pt3         → (no output)   exit 0    # in /usr/local/bin\n' +
              'ExecStart=othertool          → Command othertool is not executable:\n' +
              '                               No such file or directory      exit 1    # in /opt/x\n' +
              'ExecStart=dist/index.js      → Neither a valid executable name nor an\n' +
              '                               absolute path: dist/index.js   exit 1\n' +
              'ExecStart=./run.sh           → Neither a valid executable name nor an\n' +
              '                               absolute path: ./run.sh        exit 1',
            ) + 'Which rule do these six results actually describe?',
            'Chạy thật trên Linux, systemd 252. Sáu unit chỉ khác nhau ở <code>ExecStart=</code>, tất cả đều đưa qua <code>systemd-analyze verify</code>:' + code(
              'ExecStart=sleep 60           → (không in gì)  exit 0\n' +
              'ExecStart=/usr/bin/sleep 60  → (không in gì)  exit 0\n' +
              'ExecStart=mytool-pt3         → (không in gì)  exit 0    # nằm ở /usr/local/bin\n' +
              'ExecStart=othertool          → Command othertool is not executable:\n' +
              '                               No such file or directory      exit 1    # nằm ở /opt/x\n' +
              'ExecStart=dist/index.js      → Neither a valid executable name nor an\n' +
              '                               absolute path: dist/index.js   exit 1\n' +
              'ExecStart=./run.sh           → Neither a valid executable name nor an\n' +
              '                               absolute path: ./run.sh        exit 1',
            ) + 'Sáu kết quả này thật ra mô tả quy tắc nào?',
          ),
          options: [
            B(
              'systemd runs the command through <code>/bin/sh</code>, so anything the shell can resolve is accepted; the two rejections happened because <code>dist/index.js</code> and <code>./run.sh</code> are relative to a <code>WorkingDirectory=</code> that these units did not declare.',
              'systemd chạy câu lệnh qua <code>/bin/sh</code>, nên thứ gì shell phân giải được đều được chấp nhận; hai lần bị từ chối xảy ra vì <code>dist/index.js</code> và <code>./run.sh</code> là tương đối so với một <code>WorkingDirectory=</code> mà mấy unit này không khai báo.',
            ),
            B(
              'Only an absolute path is legal, and the three silent cases passed merely because <code>verify</code> stops checking after the first directive it cannot resolve — they would still fail at runtime with 203/EXEC.',
              'Chỉ đường dẫn tuyệt đối mới hợp lệ, và ba trường hợp im lặng qua được chỉ vì <code>verify</code> ngừng kiểm sau chỉ thị đầu tiên nó không phân giải nổi — lúc chạy thật chúng vẫn hỏng với 203/EXEC.',
            ),
            B(
              'A BARE command name is looked up, but in a fixed built-in list (<code>/usr/local/sbin</code>, <code>/usr/local/bin</code>, <code>/usr/sbin</code>, <code>/usr/bin</code>) and never in your <code>PATH</code> — which is why <code>othertool</code> in <code>/opt/x</code> is not found. A path CONTAINING a slash must be absolute, so <code>dist/index.js</code> and <code>./run.sh</code> are rejected when the unit is LOADED, not at runtime.',
              'Một TÊN LỆNH TRẦN thì có được tra, nhưng tra trong một danh sách dựng sẵn cố định (<code>/usr/local/sbin</code>, <code>/usr/local/bin</code>, <code>/usr/sbin</code>, <code>/usr/bin</code>) chứ không bao giờ tra <code>PATH</code> của bạn — vì thế <code>othertool</code> nằm ở <code>/opt/x</code> thì không tìm thấy. Còn một đường dẫn CÓ dấu gạch chéo thì bắt buộc phải tuyệt đối, nên <code>dist/index.js</code> và <code>./run.sh</code> bị từ chối ngay lúc NẠP unit, chứ không phải lúc chạy.',
            ),
            B(
              'The difference is the file extension. systemd accepts a command with no extension because it can be exec\'d directly, and rejects <code>.js</code> and <code>.sh</code> because it would have to pick an interpreter, which only a shell can do.',
              'Khác biệt nằm ở phần mở rộng của file. systemd chấp nhận một câu lệnh không có phần mở rộng vì có thể exec thẳng, và từ chối <code>.js</code> với <code>.sh</code> vì nó sẽ phải chọn một trình thông dịch, việc mà chỉ shell làm được.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on systemd 252, and worth pausing on because it is a place where the lesson text is only half right. "systemd does not use a shell" is true — there is no glob, no <code>&amp;&amp;</code>, no redirection, and no <code>PATH</code> from your environment. But since systemd 239 a bare NAME is resolved against a small fixed list of directories, which is why <code>ExecStart=sleep 60</code> is perfectly legal and why a tool you dropped in <code>/usr/local/bin</code> works. What still fails is anything with a slash that is not absolute — and note that <code>node</code> installed by nvm under <code>~/.nvm/versions/…</code> is in neither category, so it fails too. Absolute paths remain the rule worth following; this is just the reason the error message you get may not be the 203/EXEC you expected.',
            'Đo trên systemd 252, và đáng dừng lại vì đây là chỗ chữ trong bài chỉ đúng một nửa. Câu "systemd không chạy shell" là đúng — không có glob, không có <code>&amp;&amp;</code>, không có chuyển hướng, và không có <code>PATH</code> từ môi trường của bạn. Nhưng từ systemd 239, một TÊN trần được phân giải theo một danh sách thư mục nhỏ cố định, và đó là lý do <code>ExecStart=sleep 60</code> hoàn toàn hợp lệ, cũng là lý do một công cụ bạn thả vào <code>/usr/local/bin</code> thì chạy được. Thứ vẫn hỏng là bất cứ đường dẫn nào có dấu gạch chéo mà không tuyệt đối — và để ý rằng <code>node</code> do nvm cài dưới <code>~/.nvm/versions/…</code> không thuộc nhóm nào trong hai nhóm đó, nên nó cũng hỏng. Đường dẫn tuyệt đối vẫn là quy tắc đáng theo; chỗ này chỉ giải thích vì sao thông báo lỗi bạn nhận được có thể không phải cái 203/EXEC mà bạn chờ đợi.',
          ),
        }),

        // q18 · đáp án 1
        mcq({
          prompt: B(
            'Real run on Linux, systemd 252. A unit contains a one-letter typo — <code>Restart=on-failur</code> — and is checked before deployment:' + code(
              '$ systemd-analyze verify ./bad.service\n' +
              'bad.service:7: Failed to parse service restart specifier, ignoring: on-failur\n' +
              '$ echo $?\n' +
              '0',
            ) + 'The unit is deployed. What does the service do when the application crashes?',
            'Chạy thật trên Linux, systemd 252. Một unit có lỗi gõ thiếu đúng một chữ — <code>Restart=on-failur</code> — và được kiểm trước khi triển khai:' + code(
              '$ systemd-analyze verify ./bad.service\n' +
              'bad.service:7: Failed to parse service restart specifier, ignoring: on-failur\n' +
              '$ echo $?\n' +
              '0',
            ) + 'Unit này được triển khai. Dịch vụ sẽ làm gì khi ứng dụng sập?',
          ),
          options: [
            B(
              'It refuses to start at all. A directive systemd cannot parse makes the whole unit invalid, so <code>systemctl start</code> fails immediately with <code>Unit has a bad unit file setting</code> and the typo is caught the first time anybody deploys.',
              'Nó không khởi động được luôn. Một chỉ thị systemd không phân tích nổi làm cả unit trở nên không hợp lệ, nên <code>systemctl start</code> hỏng ngay với <code>Unit has a bad unit file setting</code> và lỗi gõ bị bắt ngay lần đầu có người triển khai.',
            ),
            B(
              'It stays dead. The line was IGNORED, not rejected, so the unit loads with the default <code>Restart=no</code> — the service silently loses its restart-on-crash behaviour, and <code>verify</code> exiting 0 means a CI gate built on that exit code would have passed it.',
              'Nó nằm chết luôn. Dòng đó bị BỎ QUA chứ không bị từ chối, nên unit vẫn nạp được với mặc định <code>Restart=no</code> — dịch vụ âm thầm mất tính năng khởi động lại khi sập, và việc <code>verify</code> thoát 0 nghĩa là một cửa CI dựng trên mã thoát ấy đã cho nó đi qua.',
            ),
            B(
              'It restarts anyway. When a restart specifier cannot be parsed systemd falls back to <code>Restart=on-failure</code>, which is the safest interpretation of the author\'s intent, and logs the warning purely for information.',
              'Nó vẫn khởi động lại. Khi không phân tích được đặc tả khởi động lại, systemd lùi về <code>Restart=on-failure</code> — cách hiểu an toàn nhất về ý định của người viết — và ghi cảnh báo kia chỉ để cho biết.',
            ),
            B(
              'It restarts in an unbounded loop. An unparsed value disables the rate limit along with the specifier, so the service is restarted as fast as it can crash until <code>StartLimitBurst</code> is set explicitly.',
              'Nó khởi động lại thành một vòng lặp không giới hạn. Một giá trị không phân tích được sẽ vô hiệu cả bộ giới hạn tần suất lẫn đặc tả, nên dịch vụ bị khởi động lại nhanh hết mức nó sập được, cho tới khi <code>StartLimitBurst</code> được đặt tường minh.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The word in the message is the whole answer: <code>ignoring</code>. systemd drops the line and carries on, so you get a unit that loads, starts, runs — and simply never comes back after a crash. Contrast this with what verify DOES treat as fatal, measured on the same machine: an <code>ExecStart=</code> pointing at an absolute path that does not exist gives <code>Command … is not executable</code> and exit 1, and a service with no <code>ExecStart=</code> at all gives <code>Refusing</code> and exit 1. So <code>systemd-analyze verify</code> is worth running, but its exit status is not a syntax gate — read its OUTPUT, and confirm the value that matters with <code>systemctl show myapp -p Restart</code>.',
            'Chữ quan trọng nhất trong thông báo chính là câu trả lời: <code>ignoring</code>. systemd bỏ dòng đó đi rồi chạy tiếp, nên bạn có một unit nạp được, khởi động được, chạy được — và đơn giản là không bao giờ quay lại sau khi sập. Hãy so với những thứ mà verify CÓ coi là chí mạng, đo trên cùng cái máy: một <code>ExecStart=</code> trỏ vào đường dẫn tuyệt đối không tồn tại thì cho <code>Command … is not executable</code> và exit 1, còn một service không có <code>ExecStart=</code> nào thì cho <code>Refusing</code> và exit 1. Vậy nên <code>systemd-analyze verify</code> đáng chạy, nhưng mã thoát của nó không phải một cửa kiểm cú pháp — hãy đọc ĐẦU RA của nó, và xác nhận giá trị quan trọng bằng <code>systemctl show myapp -p Restart</code>.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'Real run on Linux, systemd 252:' + code(
              "$ systemd-analyze calendar 'weekly'\n" +
              '  Original form: weekly\n' +
              'Normalized form: Mon *-*-* 00:00:00\n' +
              '\n' +
              "$ systemd-analyze calendar '*:0/15' --iterations=3\n" +
              '  Original form: *:0/15\n' +
              'Normalized form: *-*-* *:00/15:00\n' +
              '    Next elapse: Thu 2026-09-10 00:45:00 UTC\n' +
              '       Iter. #2: Thu 2026-09-10 01:00:00 UTC\n' +
              '       Iter. #3: Thu 2026-09-10 01:15:00 UTC',
            ) + 'You write <code>backup.service</code> (<code>Type=oneshot</code>) and <code>backup.timer</code>, then run <code>systemctl enable --now backup.service</code>. What happens?',
            'Chạy thật trên Linux, systemd 252:' + code(
              "$ systemd-analyze calendar 'weekly'\n" +
              '  Original form: weekly\n' +
              'Normalized form: Mon *-*-* 00:00:00\n' +
              '\n' +
              "$ systemd-analyze calendar '*:0/15' --iterations=3\n" +
              '  Original form: *:0/15\n' +
              'Normalized form: *-*-* *:00/15:00\n' +
              '    Next elapse: Thu 2026-09-10 00:45:00 UTC\n' +
              '       Iter. #2: Thu 2026-09-10 01:00:00 UTC\n' +
              '       Iter. #3: Thu 2026-09-10 01:15:00 UTC',
            ) + 'Bạn viết <code>backup.service</code> (<code>Type=oneshot</code>) và <code>backup.timer</code>, rồi chạy <code>systemctl enable --now backup.service</code>. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'The backup runs on schedule. Enabling either half of the pair activates both, because systemd links a <code>.timer</code> to the <code>.service</code> of the same base name automatically as soon as one of them is enabled.',
              'Bản sao lưu chạy đúng lịch. Bật nửa nào trong cặp cũng kích hoạt cả hai, vì systemd tự nối một <code>.timer</code> với <code>.service</code> cùng tên gốc ngay khi một trong hai được bật.',
            ),
            B(
              'Nothing runs. A <code>Type=oneshot</code> unit cannot be enabled, so the command fails with <code>The unit files have no installation config</code> and the mistake is obvious immediately.',
              'Không có gì chạy. Một unit <code>Type=oneshot</code> không bật được, nên câu lệnh hỏng với <code>The unit files have no installation config</code> và cái sai lộ ra ngay lập tức.',
            ),
            B(
              'The backup runs every 15 minutes. Because the timer was never enabled, systemd falls back to the shortest interval it can find among the loaded timer units, which is why the <code>*:0/15</code> expression above appears in the journal.',
              'Bản sao lưu chạy mỗi 15 phút. Vì timer chưa bao giờ được bật, systemd lùi về khoảng ngắn nhất nó tìm được trong các unit timer đã nạp, và đó là lý do biểu thức <code>*:0/15</code> ở trên xuất hiện trong journal.',
            ),
            B(
              'The backup runs ONCE at every boot and never again. You enabled the wrong half of the pair: <code>enable</code> belongs on the <code>.timer</code>, which is the unit with the <code>[Install]</code> section pointing at <code>timers.target</code>. Check with <code>systemctl is-enabled backup.service</code> and <code>systemctl list-timers</code>.',
              'Bản sao lưu chạy MỘT LẦN mỗi lần khởi động máy rồi thôi. Bạn đã bật nhầm nửa của cặp: <code>enable</code> thuộc về <code>.timer</code>, cái unit mang khối <code>[Install]</code> trỏ vào <code>timers.target</code>. Hãy kiểm bằng <code>systemctl is-enabled backup.service</code> và <code>systemctl list-timers</code>.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A timer is two units, and only the <code>.timer</code> carries <code>[Install] WantedBy=timers.target</code>. Enable the service instead and you have asked for it at boot — which is exactly the symptom "it seems to run once after a reboot and then stop forever". The calendar output above is the other half of the lesson: never guess what an <code>OnCalendar=</code> expression means, ask. Note <code>weekly</code> normalises to Monday 00:00, not "seven days from now", and <code>*:0/15</code> to the quarter-hours. Two directives have no cron equivalent and are the reason to prefer timers: <code>Persistent=true</code> catches up a run the machine slept through, and <code>RandomizedDelaySec=</code> stops fifty servers hitting the database in the same second.',
            'Một timer là hai unit, và chỉ <code>.timer</code> mang khối <code>[Install] WantedBy=timers.target</code>. Bật nhầm service thì bạn đã yêu cầu chạy nó lúc khởi động máy — đúng cái triệu chứng "hình như nó chạy một lần sau khi khởi động lại rồi thôi hẳn". Phần đầu ra calendar ở trên là nửa còn lại của bài học: đừng bao giờ đoán một biểu thức <code>OnCalendar=</code> nghĩa là gì, hãy hỏi. Để ý <code>weekly</code> chuẩn hoá thành thứ Hai 00:00, không phải "bảy ngày kể từ bây giờ", và <code>*:0/15</code> thành các mốc mười lăm phút. Hai chỉ thị không có tương đương bên cron chính là lý do nên chọn timer: <code>Persistent=true</code> chạy bù lượt mà máy đã ngủ qua, còn <code>RandomizedDelaySec=</code> ngăn năm mươi máy chủ cùng đập vào cơ sở dữ liệu trong một giây.',
          ),
        }),

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'Real run on Linux. Five scripts in one directory, then <code>run-parts</code> is asked what it would execute:' + code(
              '$ ls -l\n' +
              '-rwxr-xr-x 1 root root 17 app-cleanup\n' +
              '-rwxr-xr-x 1 root root 17 backup.sh\n' +
              '-rwxr-xr-x 1 root root 17 log_rotate\n' +
              '-rwxr-xr-x 1 root root 17 old-job.bak\n' +
              '-rw-r--r-- 1 root root 17 report\n' +
              '\n' +
              '$ run-parts --test .\n' +
              './app-cleanup\n' +
              './log_rotate',
            ) + 'Three files were skipped. Why each one?',
            'Chạy thật trên Linux. Năm script trong một thư mục, rồi hỏi <code>run-parts</code> xem nó sẽ chạy những gì:' + code(
              '$ ls -l\n' +
              '-rwxr-xr-x 1 root root 17 app-cleanup\n' +
              '-rwxr-xr-x 1 root root 17 backup.sh\n' +
              '-rwxr-xr-x 1 root root 17 log_rotate\n' +
              '-rwxr-xr-x 1 root root 17 old-job.bak\n' +
              '-rw-r--r-- 1 root root 17 report\n' +
              '\n' +
              '$ run-parts --test .\n' +
              './app-cleanup\n' +
              './log_rotate',
            ) + 'Ba file bị bỏ qua. Vì sao từng cái một?',
          ),
          options: [
            B(
              '<code>backup.sh</code> and <code>old-job.bak</code> were skipped because their names contain a DOT, and <code>report</code> because it lacks the execute bit. The underscore in <code>log_rotate</code> is fine — <code>run-parts</code> accepts only <code>[A-Za-z0-9_-]</code> and prints no error for what it rejects.',
              '<code>backup.sh</code> và <code>old-job.bak</code> bị bỏ vì tên có DẤU CHẤM, còn <code>report</code> vì thiếu bit thực thi. Dấu gạch dưới trong <code>log_rotate</code> thì không sao — <code>run-parts</code> chỉ nhận <code>[A-Za-z0-9_-]</code> và không in ra lỗi nào cho những thứ nó loại.',
            ),
            B(
              'All three were skipped for the same reason: <code>run-parts --test</code> lists only files modified since the last run, and those three had already been executed in an earlier cycle, so they are correctly omitted this time.',
              'Cả ba bị bỏ vì cùng một lý do: <code>run-parts --test</code> chỉ liệt kê những file thay đổi kể từ lần chạy trước, và ba cái đó đã được thực thi ở một chu kỳ trước rồi, nên lần này bị bỏ là đúng.',
            ),
            B(
              '<code>backup.sh</code> and <code>report</code> were skipped because <code>run-parts</code> refuses any file it cannot identify as a shell script, and <code>old-job.bak</code> because backup extensions are on a built-in deny list alongside <code>.dpkg-old</code> and <code>.rpmsave</code>.',
              '<code>backup.sh</code> và <code>report</code> bị bỏ vì <code>run-parts</code> từ chối mọi file mà nó không nhận diện được là script shell, còn <code>old-job.bak</code> vì các phần mở rộng sao lưu nằm trong một danh sách chặn dựng sẵn cùng với <code>.dpkg-old</code> và <code>.rpmsave</code>.',
            ),
            B(
              'Only <code>report</code> was really skipped; the other two ran but produced no output, and <code>--test</code> lists a file only when it writes to stdout, which is why a silent script never appears in this listing.',
              'Thật ra chỉ <code>report</code> bị bỏ; hai cái kia có chạy nhưng không in ra gì, và <code>--test</code> chỉ liệt kê một file khi file đó ghi ra stdout, nên một script im lặng không bao giờ xuất hiện trong danh sách này.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, and confirmed by running <code>run-parts .</code> for real afterwards: it printed only <code>a</code> and <code>d</code>, the output of the two accepted scripts. This is the single most common reason a cron job that "is definitely installed" never runs, because there is no error anywhere — not in the journal, not in mail, nowhere. The same rule applies to <code>/etc/cron.d/</code>, <code>/etc/cron.daily/</code> and (per Lesson 11.3) <code>/etc/sudoers.d/</code>. Name the file <code>app-cleanup</code> with no extension, remember <code>chmod +x</code>, and verify with <code>run-parts --test /etc/cron.daily</code> before you walk away.',
            'Đã đo thật, và xác nhận thêm bằng cách chạy <code>run-parts .</code> ngay sau đó: nó chỉ in ra <code>a</code> và <code>d</code>, tức đầu ra của hai script được nhận. Đây là lý do phổ biến số một khiến một cron job "chắc chắn đã cài rồi" lại không bao giờ chạy, vì chẳng có lỗi ở đâu cả — không trong journal, không trong thư, không ở đâu hết. Cùng quy tắc đó áp cho <code>/etc/cron.d/</code>, <code>/etc/cron.daily/</code> và (theo bài 11.3) cả <code>/etc/sudoers.d/</code>. Hãy đặt tên file là <code>app-cleanup</code> không phần mở rộng, nhớ <code>chmod +x</code>, và kiểm bằng <code>run-parts --test /etc/cron.daily</code> trước khi bỏ đi.',
          ),
        }),

        // q21 · đáp án 2
        mcq({
          prompt: B(
            'Real run on Debian 12. A cron line was added that simply dumps the environment, and one minute later:' + code(
              '$ cat /tmp/cron-env.txt\n' +
              'HOME=/root\n' +
              'LOGNAME=root\n' +
              'PATH=/usr/bin:/bin\n' +
              'SHELL=/bin/sh\n' +
              'PWD=/root\n' +
              '\n' +
              '$ echo "$PATH"        # the same machine, in a login shell\n' +
              '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            ) + 'A script that works when you type it fails from cron with <code>command not found</code>. Which fix does this measurement point at?',
            'Chạy thật trên Debian 12. Một dòng cron được thêm vào chỉ để đổ môi trường ra, và một phút sau:' + code(
              '$ cat /tmp/cron-env.txt\n' +
              'HOME=/root\n' +
              'LOGNAME=root\n' +
              'PATH=/usr/bin:/bin\n' +
              'SHELL=/bin/sh\n' +
              'PWD=/root\n' +
              '\n' +
              '$ echo "$PATH"        # cũng máy đó, trong một shell đăng nhập\n' +
              '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            ) + 'Một script chạy được khi bạn tự gõ nhưng hỏng dưới cron với <code>command not found</code>. Phép đo này chỉ vào cách chữa nào?',
          ),
          options: [
            B(
              'Add <code>#!/usr/bin/env bash</code> to the script. The measurement shows <code>SHELL=/bin/sh</code>, so cron is running the script with dash, and the missing command is a bash builtin that dash does not provide.',
              'Thêm <code>#!/usr/bin/env bash</code> vào script. Phép đo cho thấy <code>SHELL=/bin/sh</code>, nghĩa là cron chạy script bằng dash, và câu lệnh bị thiếu là một lệnh dựng sẵn của bash mà dash không có.',
            ),
            B(
              'Run the job as your own user instead of root. The dump shows <code>HOME=/root</code>, so cron is using root\'s environment rather than yours, and switching the crontab owner restores the longer <code>PATH</code>.',
              'Chạy job dưới tài khoản của bạn thay vì root. Bản đổ cho thấy <code>HOME=/root</code>, nghĩa là cron đang dùng môi trường của root chứ không phải của bạn, và đổi chủ sở hữu crontab sẽ khôi phục cái <code>PATH</code> dài hơn.',
            ),
            B(
              'Stop relying on <code>PATH</code>: cron\'s is <code>/usr/bin:/bin</code> and yours has four more directories, including <code>/usr/local/bin</code> and <code>/usr/local/sbin</code>. Use an absolute path, or set <code>PATH=</code> at the top of the crontab, or — best — let a wrapper script set its own environment and keep the cron line to one command.',
              'Đừng trông cậy vào <code>PATH</code> nữa: <code>PATH</code> của cron là <code>/usr/bin:/bin</code> còn của bạn có thêm bốn thư mục, trong đó có <code>/usr/local/bin</code> và <code>/usr/local/sbin</code>. Hãy dùng đường dẫn tuyệt đối, hoặc đặt một dòng <code>PATH=</code> ở đầu crontab, hoặc — tốt nhất — để một script bọc tự lo môi trường của nó và giữ dòng cron chỉ còn một câu lệnh.',
            ),
            B(
              'Export the variables from <code>~/.bashrc</code> using <code>crontab -e</code>\'s <code>BASH_ENV</code> setting, which is the supported way to make cron read your startup files and is why the dump above is missing everything you set there.',
              'Xuất các biến từ <code>~/.bashrc</code> bằng thiết lập <code>BASH_ENV</code> của <code>crontab -e</code> — cách được hỗ trợ để cho cron đọc file khởi động của bạn, và đó là lý do bản đổ ở trên thiếu mọi thứ bạn đặt trong đó.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured by letting cron run <code>env</code> for one minute. Nine out of ten broken cron jobs are broken here, and the symptom is always the same sentence: "it works when I run it by hand". Cron reads no startup files at all — no <code>~/.bashrc</code>, no <code>~/.profile</code>, no <code>/etc/profile</code> — so nvm, pyenv, rbenv and anything in <code>~/.local/bin</code> are simply absent. Test the job the way cron will run it before you trust the clock: <code>env -i HOME="$HOME" LOGNAME="$LOGNAME" PATH=/usr/bin:/bin SHELL=/bin/sh /bin/sh -c \'/usr/local/bin/nightly\'</code>. If it passes there, it will pass at 03:30.',
            'Đo bằng cách cho cron chạy <code>env</code> đúng một phút. Chín trên mười cron job hỏng là hỏng ở đây, và triệu chứng bao giờ cũng là đúng một câu: "tôi tự chạy tay thì được mà". Cron không đọc file khởi động nào cả — không <code>~/.bashrc</code>, không <code>~/.profile</code>, không <code>/etc/profile</code> — nên nvm, pyenv, rbenv và mọi thứ trong <code>~/.local/bin</code> đơn giản là không tồn tại. Hãy kiểm job theo đúng cách cron sẽ chạy nó, trước khi tin vào cái đồng hồ: <code>env -i HOME="$HOME" LOGNAME="$LOGNAME" PATH=/usr/bin:/bin SHELL=/bin/sh /bin/sh -c \'/usr/local/bin/nightly\'</code>. Qua được ở đó thì 03:30 cũng sẽ qua.',
          ),
        }),

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'Real run on Linux. A working crontab already exists, and someone pipes in a replacement with a bad minute field:' + code(
              '$ printf \'99 * * * * /bin/true\\n\' | crontab -\n' +
              '"-":0: bad minute\n' +
              "errors in crontab file, can't install.\n" +
              '$ echo $?\n' +
              '1\n' +
              '\n' +
              '$ crontab -l\n' +
              '*/5 * * * * /bin/true',
            ) + 'What is the state of the machine now?',
            'Chạy thật trên Linux. Đã có sẵn một crontab đang chạy tốt, rồi có người đẩy vào một bản thay thế với trường phút sai:' + code(
              '$ printf \'99 * * * * /bin/true\\n\' | crontab -\n' +
              '"-":0: bad minute\n' +
              "errors in crontab file, can't install.\n" +
              '$ echo $?\n' +
              '1\n' +
              '\n' +
              '$ crontab -l\n' +
              '*/5 * * * * /bin/true',
            ) + 'Trạng thái của cái máy lúc này ra sao?',
          ),
          options: [
            B(
              'The crontab is now empty and the old schedule is gone. <code>crontab -</code> truncates the spool file before validating what it reads, so a rejected input leaves nothing behind — which is why the backup habit is <code>crontab -l &gt; ~/cron.bak</code> before every edit.',
              'Crontab giờ rỗng và lịch cũ đã mất. <code>crontab -</code> cắt trắng file spool trước khi kiểm thứ nó đọc vào, nên một đầu vào bị từ chối chẳng để lại gì — và đó là lý do có thói quen sao lưu <code>crontab -l &gt; ~/cron.bak</code> trước mỗi lần sửa.',
            ),
            B(
              'The old crontab is untouched and still running. <code>crontab -</code> validates the whole input first and installs nothing when any line is rejected, which is exactly why you edit through <code>crontab -e</code> or <code>crontab -</code> rather than writing to the spool directory by hand.',
              'Crontab cũ nguyên vẹn và vẫn đang chạy. <code>crontab -</code> kiểm toàn bộ đầu vào trước và không cài gì cả khi có dòng nào bị từ chối, và đó chính là lý do bạn sửa qua <code>crontab -e</code> hoặc <code>crontab -</code> thay vì tự tay ghi vào thư mục spool.',
            ),
            B(
              'Both schedules are installed. The rejected line was dropped and the rest of the input appended to what was already there, so the machine now runs the old job and any valid lines from the new input side by side.',
              'Cả hai lịch cùng được cài. Dòng bị từ chối bị loại bỏ còn phần còn lại của đầu vào được nối thêm vào thứ đã có, nên cái máy giờ chạy song song job cũ và mọi dòng hợp lệ từ đầu vào mới.',
            ),
            B(
              'The new crontab is installed but disabled. <code>can\'t install</code> refers to the cron daemon\'s in-memory table, not to the file, so the schedule is written to disk and takes effect at the next restart of <code>cron</code>.',
              'Crontab mới đã được cài nhưng đang tắt. Chữ <code>can\'t install</code> nói về bảng trong bộ nhớ của tiến trình cron, không phải về file, nên lịch mới đã ghi xuống đĩa và có hiệu lực ở lần khởi động lại <code>cron</code> kế tiếp.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: exit 1, an error naming the offending field, and <code>crontab -l</code> still showing the previous schedule. That validation is the reason the lesson says never to edit <code>/var/spool/cron/crontabs/&lt;user&gt;</code> directly — there is no syntax check there, and cron may not even notice the change. Two related facts worth keeping: a six-field line in a USER crontab is rejected too (measured: <code>bad command</code>, because the sixth field becomes the start of the command), and <code>crontab -r</code> deletes the whole thing immediately with no confirmation and no undo, one key away from <code>-e</code>.',
            'Đo thật: mã thoát 1, một dòng lỗi gọi tên đúng cái trường sai, và <code>crontab -l</code> vẫn hiện lịch cũ. Chính phép kiểm ấy là lý do bài học dặn đừng bao giờ sửa thẳng <code>/var/spool/cron/crontabs/&lt;người dùng&gt;</code> — ở đó không có phép kiểm cú pháp nào, và cron thậm chí có thể không nhận ra thay đổi. Hai chi tiết liên quan đáng nhớ: một dòng sáu trường trong crontab của NGƯỜI DÙNG cũng bị từ chối (đo được: <code>bad command</code>, vì trường thứ sáu trở thành phần đầu của câu lệnh), và <code>crontab -r</code> xoá sạch tất cả ngay lập tức, không hỏi lại, không hoàn tác, mà nằm cách <code>-e</code> đúng một phím.',
          ),
        }),

        // q23 · đáp án 0
        mcq({
          prompt: B(
            'On an Ubuntu 24.04 VPS you add a drop-in and reload sshd, but password logins still work:' + code(
              '# /etc/ssh/sshd_config begins with\n' +
              'Include /etc/ssh/sshd_config.d/*.conf\n' +
              '\n' +
              '# the cloud image already shipped\n' +
              '/etc/ssh/sshd_config.d/50-cloud-init.conf:  PasswordAuthentication yes\n' +
              '\n' +
              '# what you added\n' +
              '/etc/ssh/sshd_config.d/99-hardening.conf:   PasswordAuthentication no',
            ) + 'Why did your file lose, and what settles the question?',
            'Trên một VPS Ubuntu 24.04, bạn thêm một file drop-in rồi nạp lại sshd, nhưng đăng nhập bằng mật khẩu vẫn chạy:' + code(
              '# /etc/ssh/sshd_config mở đầu bằng\n' +
              'Include /etc/ssh/sshd_config.d/*.conf\n' +
              '\n' +
              '# ảnh đám mây đã có sẵn\n' +
              '/etc/ssh/sshd_config.d/50-cloud-init.conf:  PasswordAuthentication yes\n' +
              '\n' +
              '# thứ bạn thêm vào\n' +
              '/etc/ssh/sshd_config.d/99-hardening.conf:   PasswordAuthentication no',
            ) + 'Vì sao file của bạn thua, và cái gì kết thúc được tranh cãi này?',
          ),
          options: [
            B(
              'In sshd configuration the FIRST occurrence of a keyword wins, and the drop-ins are read in filename order — so <code>50-…</code> beats <code>99-…</code>. Name yours so it sorts EARLIER, or remove the line from the cloud-init file, then confirm with <code>sudo sshd -T | grep -i passwordauthentication</code>, which prints the fully resolved value.',
              'Trong cấu hình sshd thì lần xuất hiện ĐẦU TIÊN của một từ khoá là lần thắng, và các drop-in được đọc theo thứ tự tên file — nên <code>50-…</code> thắng <code>99-…</code>. Hãy đặt tên file của bạn sao cho nó xếp SỚM HƠN, hoặc xoá dòng đó khỏi file cloud-init, rồi xác nhận bằng <code>sudo sshd -T | grep -i passwordauthentication</code>, lệnh in ra giá trị đã phân giải xong.',
            ),
            B(
              'Because <code>reload</code> does not re-read included files — only <code>restart</code> does. Run <code>sudo systemctl restart ssh</code> and the new drop-in takes effect, at the cost of dropping every existing session, which is why you keep a second terminal open.',
              'Vì <code>reload</code> không đọc lại các file được include — chỉ <code>restart</code> mới làm thế. Hãy chạy <code>sudo systemctl restart ssh</code> là drop-in mới có hiệu lực, đổi lại mọi phiên đang mở đều rớt, và vì thế bạn phải giữ một terminal thứ hai.',
            ),
            B(
              'Because a drop-in may only override keywords that also appear in the main <code>sshd_config</code>. <code>PasswordAuthentication</code> is commented out in the shipped file, so neither drop-in applies and sshd is using its compiled-in default of <code>yes</code>.',
              'Vì một drop-in chỉ được đè lên những từ khoá cũng xuất hiện trong <code>sshd_config</code> chính. Dòng <code>PasswordAuthentication</code> đang bị chú thích trong file gốc, nên không drop-in nào có hiệu lực và sshd đang dùng giá trị mặc định biên dịch sẵn là <code>yes</code>.',
            ),
            B(
              'Because <code>Include</code> is processed after the rest of the main file, so anything in <code>sshd_config.d/</code> is applied first and then overwritten by the main file\'s own settings — the fix is to move your line into <code>sshd_config</code> itself.',
              'Vì <code>Include</code> được xử lý sau phần còn lại của file chính, nên mọi thứ trong <code>sshd_config.d/</code> được áp trước rồi bị chính các thiết lập của file chính ghi đè — cách chữa là chuyển dòng của bạn vào thẳng <code>sshd_config</code>.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'sshd is unusual: for most keywords the first value read wins, which is the opposite of what almost every other config format does, and it is why a helpfully-numbered <code>99-hardening.conf</code> is exactly the wrong name. This is also the reason the lesson insists on <code>sshd -T</code> rather than reading files: it dumps the fully resolved configuration with drop-ins, defaults and <code>Match</code> blocks all applied, and it is the only honest answer to "is password login really off?". Same idea as <code>ssh -G</code> on the client, <code>systemctl cat</code> for a unit, and an unauthenticated <code>curl</code> for a route — ask the system what it resolved, do not read the file and believe it.',
            'sshd là một ngoại lệ: với phần lớn từ khoá thì giá trị đọc được ĐẦU TIÊN là giá trị thắng, ngược hẳn với gần như mọi định dạng cấu hình khác, và vì thế một cái tên đánh số "cho chắc" như <code>99-hardening.conf</code> lại đúng là cái tên sai. Đây cũng là lý do bài học nhất quyết bảo dùng <code>sshd -T</code> thay vì đọc file: nó đổ ra cấu hình đã phân giải trọn vẹn, đã áp hết drop-in, giá trị mặc định và các khối <code>Match</code>, và đó là câu trả lời trung thực duy nhất cho "mật khẩu đã tắt thật chưa?". Cùng một ý với <code>ssh -G</code> ở phía trình khách, <code>systemctl cat</code> cho một unit, và một lệnh <code>curl</code> không xác thực cho một route — hãy hỏi hệ thống xem nó phân giải ra gì, đừng đọc file rồi tin.',
          ),
        }),

        // ── Chương 12 — Chẩn đoán một máy chủ thật (7 câu) ───────────────
        // q24 · đáp án 3
        mcq({
          prompt: B(
            'The sixty-second sweep on a machine you have never seen returns four findings:' + code(
              'load average: 6.84, 4.11, 2.07        (nproc = 2)\n' +
              'backend.service   loaded failed failed Node API\n' +
              'kernel: Out of memory: Killed process 3401 (postgres)\n' +
              '/dev/vda1  79G  72G  3.1G  96% /\n' +
              'Swap:  0B  0B  0B\n' +
              '/var/log/app/debug.log   41G',
            ) + 'Which of these is the ROOT cause, and how do you decide?',
            'Lượt quét sáu mươi giây trên một cái máy bạn chưa từng thấy trả về bốn phát hiện:' + code(
              'load average: 6.84, 4.11, 2.07        (nproc = 2)\n' +
              'backend.service   loaded failed failed Node API\n' +
              'kernel: Out of memory: Killed process 3401 (postgres)\n' +
              '/dev/vda1  79G  72G  3.1G  96% /\n' +
              'Swap:  0B  0B  0B\n' +
              '/var/log/app/debug.log   41G',
            ) + 'Cái nào trong số này là nguyên nhân GỐC, và bạn quyết định bằng cách nào?',
          ),
          options: [
            B(
              'The failed <code>backend.service</code>, because it is the only line that names the application the users are complaining about; restart it first and then work backwards through the other three findings while the service is up.',
              '<code>backend.service</code> hỏng, vì đó là dòng duy nhất gọi tên đúng ứng dụng mà người dùng đang than phiền; hãy khởi động lại nó trước rồi vừa để dịch vụ chạy vừa lần ngược qua ba phát hiện còn lại.',
            ),
            B(
              'The load average of 6.84 on two cores, since it is the only measurement that is rising left to right; everything else in the sweep is a snapshot with no trend and therefore cannot establish causality.',
              'Load average 6,84 trên hai nhân, vì đó là số đo duy nhất tăng dần từ trái sang phải; mọi thứ khác trong lượt quét chỉ là ảnh chụp không có xu hướng nên không thiết lập được quan hệ nhân quả.',
            ),
            B(
              'The absent swap. With <code>Swap: 0B</code> the kernel has nowhere to park cold pages, so it must kill a process the moment memory tightens — adding a 2 GB swapfile removes the OOM kill and everything downstream of it resolves itself.',
              'Chuyện không có swap. Với <code>Swap: 0B</code> thì nhân không có chỗ nào để gửi tạm các trang nguội, nên nó buộc phải giết một tiến trình ngay khi bộ nhớ căng — thêm một swapfile 2 GB là hết OOM và mọi thứ ở hạ nguồn tự giải quyết.',
            ),
            B(
              'The 41 GB <code>debug.log</code>. For each finding, ask "could this be caused by one of the others?" — the failed backend is caused by postgres dying, postgres dying is the OOM kill, the OOM kill and the 96% disk both trace back to the log, and nothing upstream explains the log. Missing swap is a contributing condition, not the cause.',
              'Cái <code>debug.log</code> 41 GB. Với từng phát hiện, hãy hỏi "cái này có thể do một trong những cái kia gây ra không?" — backend hỏng là do postgres chết, postgres chết là do OOM, OOM và cái đĩa 96% đều lần ngược về file log, và không có gì ở thượng nguồn giải thích được file log ấy. Thiếu swap là điều kiện góp phần, không phải nguyên nhân.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Four findings, and only one has nothing upstream of it. The habit that prevents fixing the wrong thing is exactly that question — "could this be caused by one of the others?" — asked once per finding; anything that answers yes is a consequence. Restarting the backend "fixes" it for ninety seconds. Note that the two things you would naturally reach for, a restart and a swapfile, are both legitimate FOLLOW-UPS: swap turns a future memory spike into thirty seconds of slowness instead of a killed database, and the incident log should also carry a logrotate rule for <code>debug.log</code> and an alert at 80% disk. They are just not the cause.',
            'Bốn phát hiện, và chỉ một cái không có gì ở thượng nguồn. Thói quen ngăn bạn sửa nhầm thứ chính là câu hỏi ấy — "cái này có thể do một trong những cái kia gây ra không?" — hỏi một lần cho mỗi phát hiện; cái nào trả lời có thì nó là hệ quả. Khởi động lại backend chỉ "sửa" được chín mươi giây. Để ý rằng hai thứ bạn theo bản năng sẽ với tới, khởi động lại và thêm swap, đều là những VIỆC THEO SAU chính đáng: swap biến một cơn tăng bộ nhớ trong tương lai thành ba mươi giây chậm chạp thay vì một cơ sở dữ liệu bị giết, và nhật ký sự cố cũng nên ghi thêm một luật logrotate cho <code>debug.log</code> và một cảnh báo ở mức 80% đĩa. Chúng chỉ không phải là nguyên nhân.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'nginx returns 502 and its error log says:' + code(
              '2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed\n' +
              '  (111: Connection refused) while connecting to upstream,\n' +
              '  upstream: "http://127.0.0.1:3000/api/v1/posts"',
            ) + 'A colleague says "the proxy is broken, restart nginx". What does the log actually establish?',
            'nginx trả về 502 và log lỗi của nó ghi:' + code(
              '2026/08/22 19:14:02 [error] 812#812: *4471 connect() failed\n' +
              '  (111: Connection refused) while connecting to upstream,\n' +
              '  upstream: "http://127.0.0.1:3000/api/v1/posts"',
            ) + 'Một đồng nghiệp bảo "proxy hỏng rồi, khởi động lại nginx đi". Log này thật ra xác lập được điều gì?',
          ),
          options: [
            B(
              'That nginx cannot resolve the upstream. Error 111 is returned by the resolver when an upstream name has no address, which on a proxy configured with an IP literal means the <code>resolver</code> directive is missing from the config.',
              'Rằng nginx không phân giải được upstream. Lỗi 111 do bộ phân giải trả về khi một tên upstream không có địa chỉ, và trên một proxy cấu hình bằng địa chỉ IP thẳng thì điều đó nghĩa là thiếu chỉ thị <code>resolver</code> trong cấu hình.',
            ),
            B(
              'That the upstream is overloaded. <code>Connection refused</code> is what a backend returns when its listen backlog is full, so the fix is to raise the accept queue and add worker processes rather than to look at whether the process is alive.',
              'Rằng upstream đang quá tải. <code>Connection refused</code> là thứ một backend trả về khi hàng đợi lắng nghe của nó đầy, nên cách chữa là nâng hàng đợi chấp nhận và thêm tiến trình thợ chứ không phải đi xem tiến trình còn sống không.',
            ),
            B(
              'That nginx is working perfectly — it tried, and the machine actively said "nothing is listening on 127.0.0.1:3000". The backend is down or bound elsewhere, so this is Recipe 1 (a failed service), and restarting nginx changes nothing. Confirm with <code>ss -tlnp | grep :3000</code> and <code>systemctl status backend</code>.',
              'Rằng nginx đang chạy hoàn hảo — nó đã thử, và cái máy chủ động nói "không có gì lắng nghe ở 127.0.0.1:3000". Backend đang chết hoặc gắn ở chỗ khác, nên đây là công thức 1 (một dịch vụ hỏng), và khởi động lại nginx chẳng thay đổi gì. Hãy xác nhận bằng <code>ss -tlnp | grep :3000</code> và <code>systemctl status backend</code>.',
            ),
            B(
              'That the request timed out. 502 is nginx\'s status for an upstream that did not answer within <code>proxy_read_timeout</code>, and error 111 is the internal code for that expiry, so the backend is alive but slow and Recipe "it is slow" applies.',
              'Rằng yêu cầu đã hết giờ. 502 là mã nginx dùng cho một upstream không trả lời trong <code>proxy_read_timeout</code>, và lỗi 111 là mã nội bộ của lần hết hạn đó, nên backend vẫn sống nhưng chậm và phải áp công thức "nó chậm".',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A 502 is useful precisely because it proves nginx is working: it got the request, tried the upstream, and is telling you what happened. The error log then names the reason exactly, and the numbers are worth knowing — <code>111: Connection refused</code> means the app is not listening (by far the common case), <code>110: Connection timed out</code> means it accepted and never replied (alive but stuck — a blocked event loop, a hung query, an exhausted pool), <code>13: Permission denied</code> is a Unix-socket upstream whose mode or parent directory blocks <code>www-data</code>, and <code>upstream prematurely closed connection</code> means the app crashed mid-response. A 504 is a different bug entirely: <code>proxy_read_timeout</code> expiring, which means slow rather than dead.',
            'Mã 502 hữu ích chính vì nó chứng minh nginx đang chạy: nó đã nhận yêu cầu, đã thử upstream, và đang nói cho bạn biết chuyện gì xảy ra. Log lỗi khi đó gọi tên chính xác lý do, và mấy con số đáng thuộc — <code>111: Connection refused</code> nghĩa là ứng dụng không lắng nghe (trường hợp phổ biến nhất, cách biệt rất xa), <code>110: Connection timed out</code> nghĩa là nó có nhận kết nối rồi không trả lời (còn sống nhưng kẹt — event loop bị chặn, một truy vấn treo, một pool cạn), <code>13: Permission denied</code> là upstream kiểu socket Unix mà quyền của socket hoặc thư mục cha chặn <code>www-data</code>, còn <code>upstream prematurely closed connection</code> nghĩa là ứng dụng sập giữa lúc trả lời. Mã 504 lại là một lỗi hoàn toàn khác: <code>proxy_read_timeout</code> hết hạn, tức là chậm chứ không phải chết.',
          ),
        }),

        // q26 · đáp án 1
        mcq({
          prompt: B(
            'A dual-stack server. <code>curl http://127.0.0.1:3000/health</code> from the same box returns 200, yet every request through nginx is a 502. The error log line is:' + code(
              'connect() failed (111: Connection refused) while connecting to upstream,\n' +
              '  upstream: "http://[::1]:3000/health"\n' +
              '\n' +
              '# nginx.conf\n' +
              'proxy_pass http://localhost:3000;',
            ) + 'What is going on?',
            'Một máy chủ chạy cả hai ngăn xếp. Chạy <code>curl http://127.0.0.1:3000/health</code> ngay trên máy đó trả về 200, vậy mà mọi yêu cầu đi qua nginx đều là 502. Dòng log lỗi là:' + code(
              'connect() failed (111: Connection refused) while connecting to upstream,\n' +
              '  upstream: "http://[::1]:3000/health"\n' +
              '\n' +
              '# nginx.conf\n' +
              'proxy_pass http://localhost:3000;',
            ) + 'Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'nginx is caching a stale DNS answer for <code>localhost</code> from before the application restarted; a <code>proxy_pass</code> with a hostname is resolved once at startup, so <code>systemctl reload nginx</code> after every backend restart is the standard workaround.',
              'nginx đang giữ một câu trả lời DNS cũ cho <code>localhost</code> từ trước khi ứng dụng khởi động lại; một <code>proxy_pass</code> dùng tên máy chỉ được phân giải một lần lúc khởi động, nên chạy <code>systemctl reload nginx</code> sau mỗi lần khởi động lại backend là cách né tiêu chuẩn.',
            ),
            B(
              '<code>localhost</code> resolves to <code>::1</code> first on a dual-stack machine, so nginx is knocking on the IPv6 loopback while the application listens only on IPv4. Write <code>127.0.0.1</code> explicitly in <code>proxy_pass</code>, or make the app bind <code>::</code>. The evidence is the <code>[::1]</code> in the log line.',
              '<code>localhost</code> trên một máy chạy cả hai ngăn xếp thì phân giải ra <code>::1</code> trước, nên nginx đang gõ cửa loopback IPv6 trong khi ứng dụng chỉ lắng nghe trên IPv4. Hãy ghi thẳng <code>127.0.0.1</code> trong <code>proxy_pass</code>, hoặc cho ứng dụng gắn vào <code>::</code>. Bằng chứng nằm ở chuỗi <code>[::1]</code> trong dòng log.',
            ),
            B(
              'The application is bound to <code>0.0.0.0</code>, which on a dual-stack kernel deliberately excludes IPv6, and nginx prefers IPv6 for loopback traffic; the fix is to disable IPv6 on the machine with <code>sysctl net.ipv6.conf.all.disable_ipv6=1</code>.',
              'Ứng dụng đang gắn vào <code>0.0.0.0</code>, thứ mà trên một nhân chạy cả hai ngăn xếp thì cố ý loại trừ IPv6, còn nginx lại ưu tiên IPv6 cho lưu lượng loopback; cách chữa là tắt IPv6 trên máy bằng <code>sysctl net.ipv6.conf.all.disable_ipv6=1</code>.',
            ),
            B(
              'The <code>curl</code> test is misleading rather than the config: <code>127.0.0.1</code> bypasses the loopback interface entirely inside the kernel, so a 200 there says nothing about whether the socket exists, and <code>ss</code> would show no listener at all on port 3000.',
              'Chính phép thử bằng <code>curl</code> mới gây hiểu nhầm chứ không phải cấu hình: <code>127.0.0.1</code> đi tắt qua hẳn giao diện loopback bên trong nhân, nên một mã 200 ở đó không nói lên được socket có tồn tại hay không, và <code>ss</code> sẽ cho thấy chẳng có gì lắng nghe ở cổng 3000 cả.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the trap that makes people distrust the machine: the app is up, <code>curl</code> proves it, and nginx still cannot reach it. The whole answer is in the log — the upstream nginx tried is written <code>[::1]</code>, not <code>127.0.0.1</code>. <code>localhost</code> is a name with two addresses, and on a dual-stack box the IPv6 one is tried first. Write the address you mean in <code>proxy_pass</code>; the same reasoning applies to database URLs, health-check scripts and anything else where "localhost" quietly means two different endpoints. And note the general habit this rewards: read the exact string in the error, including the brackets, instead of pattern-matching the first four words.',
            'Đây đúng là cái bẫy làm người ta mất niềm tin vào cái máy: ứng dụng vẫn chạy, <code>curl</code> chứng minh rồi, mà nginx vẫn không với tới được. Toàn bộ câu trả lời nằm trong log — cái upstream mà nginx thử được ghi là <code>[::1]</code>, không phải <code>127.0.0.1</code>. <code>localhost</code> là một cái tên có hai địa chỉ, và trên máy chạy cả hai ngăn xếp thì địa chỉ IPv6 được thử trước. Hãy ghi đúng địa chỉ bạn muốn vào <code>proxy_pass</code>; cùng lý lẽ ấy áp cho URL cơ sở dữ liệu, script kiểm sức khoẻ và mọi chỗ khác mà chữ "localhost" âm thầm mang nghĩa hai điểm cuối khác nhau. Và để ý thói quen chung mà câu này thưởng cho: hãy đọc đúng từng ký tự trong thông báo lỗi, kể cả cặp ngoặc vuông, thay vì nhận dạng theo bốn chữ đầu.',
          ),
        }),

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'Requests take eight seconds. CPU is 4%, the disk is idle, memory is fine. Then:' + code(
              '$ ss -tanp state established | grep -c 5432\n' +
              '100\n' +
              '\n' +
              '$ ss -lnt | head -3\n' +
              'State  Recv-Q Send-Q Local Address:Port Peer Address:Port\n' +
              'LISTEN 511    511          0.0.0.0:3000      0.0.0.0:*\n' +
              'LISTEN 0      511          0.0.0.0:80        0.0.0.0:*',
            ) + 'What do those two numbers say?',
            'Yêu cầu mất tám giây. CPU 4%, đĩa rảnh, bộ nhớ ổn. Rồi:' + code(
              '$ ss -tanp state established | grep -c 5432\n' +
              '100\n' +
              '\n' +
              '$ ss -lnt | head -3\n' +
              'State  Recv-Q Send-Q Local Address:Port Peer Address:Port\n' +
              'LISTEN 511    511          0.0.0.0:3000      0.0.0.0:*\n' +
              'LISTEN 0      511          0.0.0.0:80        0.0.0.0:*',
            ) + 'Hai con số đó nói lên điều gì?',
          ),
          options: [
            B(
              'Exactly 100 database connections is a suspiciously round number — a configured pool limit, not a coincidence — and on the LISTEN row for :3000 the accept queue is completely full (<code>Recv-Q</code> has reached <code>Send-Q</code>). New connections are queuing in the kernel while every worker waits for a database connection that will not come. The machine is idle because it is deadlocked on a pool.',
              'Đúng 100 kết nối cơ sở dữ liệu là một con số tròn đáng ngờ — một hạn mức pool được cấu hình chứ không phải trùng hợp — và ở dòng LISTEN của cổng :3000 thì hàng đợi chấp nhận đã đầy hoàn toàn (<code>Recv-Q</code> đã chạm <code>Send-Q</code>). Kết nối mới đang xếp hàng trong nhân trong khi mọi thợ đều chờ một kết nối cơ sở dữ liệu sẽ không bao giờ tới. Cái máy rảnh vì nó đang kẹt cứng ở một cái pool.',
            ),
            B(
              'The database is the bottleneck and needs more memory: 100 established connections on port 5432 is far beyond what PostgreSQL can serve, and the full queue on :3000 is the application politely refusing new work until the database catches up.',
              'Cơ sở dữ liệu là nút thắt và cần thêm bộ nhớ: 100 kết nối đã thiết lập trên cổng 5432 là vượt xa khả năng phục vụ của PostgreSQL, và hàng đợi đầy ở cổng :3000 là ứng dụng đang lịch sự từ chối việc mới cho tới khi cơ sở dữ liệu đuổi kịp.',
            ),
            B(
              'Nothing is wrong with the application. <code>Recv-Q</code> and <code>Send-Q</code> on a LISTEN socket report bytes waiting to be read and written, so equal values simply mean the socket is balanced, and 100 established connections on a busy API is unremarkable.',
              'Ứng dụng không có gì sai cả. <code>Recv-Q</code> và <code>Send-Q</code> trên một socket LISTEN báo số byte đang chờ đọc và chờ ghi, nên hai giá trị bằng nhau chỉ nghĩa là socket đang cân bằng, và 100 kết nối đã thiết lập trên một API bận rộn là chuyện thường.',
            ),
            B(
              'The kernel is dropping SYN packets on :3000 because <code>somaxconn</code> is too low; raise <code>net.core.somaxconn</code> and the eight-second latency disappears, since the requests are spending that time being retransmitted by the client.',
              'Nhân đang vứt gói SYN ở cổng :3000 vì <code>somaxconn</code> đặt quá thấp; hãy nâng <code>net.core.somaxconn</code> lên là độ trễ tám giây biến mất, vì các yêu cầu đang tiêu đúng khoảng thời gian ấy để trình khách gửi lại.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'On a LISTEN socket the two columns mean something different from an established one: <code>Recv-Q</code> is how many connections are waiting to be accepted and <code>Send-Q</code> is the backlog limit — so equal values mean the queue is full, and users are waiting before the application has even seen their request. That is why the symptom is felt one layer downstream of where it starts. The method is the point: when nothing is busy but everything is slow, stop looking at resources and start counting connections. A round number is a configured limit, a growing number is a leak, and zero to the database is the answer on its own. Then time the dependency directly, outside your app, and see whether the investigation has already moved elsewhere.',
            'Trên một socket LISTEN thì hai cột ấy mang nghĩa khác hẳn so với một socket đã thiết lập: <code>Recv-Q</code> là số kết nối đang chờ được nhận còn <code>Send-Q</code> là trần của hàng đợi — nên hai giá trị bằng nhau nghĩa là hàng đợi đã đầy, và người dùng đang chờ từ trước khi ứng dụng kịp nhìn thấy yêu cầu của họ. Đó là lý do triệu chứng được cảm nhận ở một tầng dưới chỗ nó bắt đầu. Điều đáng nhớ là phương pháp: khi chẳng có gì bận mà mọi thứ đều chậm, hãy thôi nhìn tài nguyên và bắt đầu đếm kết nối. Một con số tròn là một hạn mức được cấu hình, một con số tăng dần là một chỗ rò, còn con số không tới cơ sở dữ liệu thì tự nó đã là câu trả lời. Sau đó hãy bấm giờ trực tiếp cái phụ thuộc đó, bên ngoài ứng dụng của bạn, xem cuộc điều tra đã chuyển sang chỗ khác chưa.',
          ),
        }),

        // q28 · đáp án 2
        mcq({
          prompt: B(
            'Two machines, two readings of <code>free -h</code> and <code>vmstat 1</code>:' + code(
              'MACHINE A                                MACHINE B\n' +
              '        total  used  free  buff/cache  available\n' +
              'Mem:    7.8Gi  2.1Gi 197Mi 5.5Gi       5.3Gi\n' +
              'Swap:   2.0Gi  0B    2.0Gi\n' +
              '\n' +
              '  r  b   swpd   free  si   so    bi    bo  us sy id wa\n' +
              'B: 3  6  2010112 61204 4812 5104  9822 11044 12  9  6 73',
            ) + 'Which machine needs attention, and what is the correct action?',
            'Hai cái máy, hai lần đọc <code>free -h</code> và <code>vmstat 1</code>:' + code(
              'MÁY A                                    MÁY B\n' +
              '        total  used  free  buff/cache  available\n' +
              'Mem:    7.8Gi  2.1Gi 197Mi 5.5Gi       5.3Gi\n' +
              'Swap:   2.0Gi  0B    2.0Gi\n' +
              '\n' +
              '  r  b   swpd   free  si   so    bi    bo  us sy id wa\n' +
              'B: 3  6  2010112 61204 4812 5104  9822 11044 12  9  6 73',
            ) + 'Máy nào cần được để ý, và hành động đúng là gì?',
          ),
          options: [
            B(
              'Machine A, urgently: 197Mi free out of 7.8Gi means it is about to start swapping, and the correct action is to add RAM before the OOM killer picks a victim.',
              'Máy A, và gấp: chỉ còn 197Mi trống trên 7,8Gi nghĩa là nó sắp bắt đầu tráo trang, và hành động đúng là thêm RAM trước khi bộ giết-khi-hết-bộ-nhớ chọn một nạn nhân.',
            ),
            B(
              'Machine B, and the action is to add swap. <code>swpd</code> at 2 GB shows the existing swapfile is completely full, so enlarging it gives the kernel room and the I/O wait subsides.',
              'Máy B, và hành động là thêm swap. Con số <code>swpd</code> 2 GB cho thấy swapfile hiện có đã đầy hoàn toàn, nên nới nó ra là nhân có chỗ và phần chờ vào-ra sẽ dịu xuống.',
            ),
            B(
              'Machine B. Sustained <code>si</code>/<code>so</code> around 5 MB/s with six blocked processes and 73% I/O wait is thrashing — it is spending its time moving memory to and from disk instead of working. More swap does not fix that; less memory usage or more RAM does. Machine A is healthy: read <code>available</code>, not <code>free</code>.',
              'Máy B. Hai cột <code>si</code>/<code>so</code> duy trì quanh 5 MB/giây kèm sáu tiến trình bị chặn và 73% thời gian chờ vào-ra là hiện tượng thrashing — nó đang dành thời gian chuyển bộ nhớ ra vào đĩa thay vì làm việc. Thêm swap không chữa được; giảm mức dùng bộ nhớ hoặc thêm RAM mới chữa được. Máy A khoẻ mạnh: hãy đọc <code>available</code>, đừng đọc <code>free</code>.',
            ),
            B(
              'Both are fine. Machine A has 5.3Gi available and machine B has an active swapfile doing exactly its job — a swapfile in use is a swapfile earning its keep, and the 73% figure is idle time rather than wait time.',
              'Cả hai đều ổn. Máy A còn 5,3Gi khả dụng, còn máy B thì có một swapfile đang làm đúng việc của nó — swapfile được dùng tới là swapfile xứng đáng với chỗ nó chiếm, và con số 73% kia là thời gian rảnh chứ không phải thời gian chờ.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two lessons in one comparison. First, <code>free</code> is not the number to read: Linux uses spare RAM as page cache and hands it back the instant a process asks, so 197Mi free next to 5.5Gi of buff/cache and 5.3Gi available is a machine using its memory correctly — "we added RAM because free was low" is a fix for a problem nobody had. Second, real pressure has a signature, and it is <code>si</code>/<code>so</code> that stay nonzero, not a swapfile that merely has bytes in it. Swap is a shock absorber: it turns a brief spike into thirty seconds of slowness instead of a killed database. Once a machine is swapping continuously, swap is what turned an instant OOM kill into a slow death.',
            'Một phép so sánh, hai bài học. Thứ nhất, <code>free</code> không phải con số cần đọc: Linux dùng RAM dư làm bộ đệm trang và trả lại ngay khi có tiến trình xin, nên 197Mi trống bên cạnh 5,5Gi buff/cache và 5,3Gi khả dụng là một cái máy đang dùng bộ nhớ đúng cách — "chúng tôi thêm RAM vì free thấp" là cách chữa cho một vấn đề chẳng ai có. Thứ hai, áp lực thật có chữ ký riêng, và chữ ký ấy là <code>si</code>/<code>so</code> KHÁC KHÔNG kéo dài, chứ không phải một swapfile chỉ đơn giản là có byte trong đó. Swap là bộ giảm xóc: nó biến một cơn tăng ngắn thành ba mươi giây chậm chạp thay vì một cơ sở dữ liệu bị giết. Còn khi một cái máy đã tráo trang liên tục thì chính swap là thứ đã biến một cú OOM tức thì thành một cái chết chậm.',
          ),
        }),

        // q29 · đáp án 3
        mcq({
          prompt: B(
            'Real run on Linux. User <code>deploy</code> gets "Permission denied" on a script that looks perfectly fine:' + code(
              '$ ls -l /tmp/pt3/nm/srv/app/run.sh\n' +
              '-rwxr-xr-x 1 root root 17 run.sh\n' +
              '\n' +
              '$ namei -l /tmp/pt3/nm/srv/app/run.sh\n' +
              'f: /tmp/pt3/nm/srv/app/run.sh\n' +
              ' drwxr-xr-x root root /\n' +
              ' drwxrwxrwt root root tmp\n' +
              ' drwxr-xr-x root root pt3\n' +
              ' drwxr-xr-x root root nm\n' +
              ' drwxr-x--- root root srv\n' +
              ' drwxr-xr-x root root app\n' +
              ' -rwxr-xr-x root root run.sh',
            ) + 'Which line is the problem, and why could <code>ls -l</code> never have shown it?',
            'Chạy thật trên Linux. Người dùng <code>deploy</code> nhận "Permission denied" trên một script trông hoàn toàn bình thường:' + code(
              '$ ls -l /tmp/pt3/nm/srv/app/run.sh\n' +
              '-rwxr-xr-x 1 root root 17 run.sh\n' +
              '\n' +
              '$ namei -l /tmp/pt3/nm/srv/app/run.sh\n' +
              'f: /tmp/pt3/nm/srv/app/run.sh\n' +
              ' drwxr-xr-x root root /\n' +
              ' drwxrwxrwt root root tmp\n' +
              ' drwxr-xr-x root root pt3\n' +
              ' drwxr-xr-x root root nm\n' +
              ' drwxr-x--- root root srv\n' +
              ' drwxr-xr-x root root app\n' +
              ' -rwxr-xr-x root root run.sh',
            ) + 'Dòng nào là vấn đề, và vì sao <code>ls -l</code> không đời nào cho thấy được nó?',
          ),
          options: [
            B(
              'The <code>tmp</code> line: <code>drwxrwxrwt</code> has the sticky bit set, which prevents a non-owner from executing anything beneath it, and <code>ls -l</code> on the file shows only the file\'s own mode rather than the sticky bit two levels up.',
              'Dòng <code>tmp</code>: <code>drwxrwxrwt</code> có bit dính, thứ ngăn một người không phải chủ sở hữu thực thi bất cứ thứ gì bên dưới nó, và <code>ls -l</code> trên file chỉ hiện quyền của chính file chứ không hiện bit dính ở trên hai bậc.',
            ),
            B(
              'The <code>run.sh</code> line: it is owned by <code>root:root</code>, so the execute bit in the "other" position does not apply to <code>deploy</code> — group and other permissions are only consulted for files whose owner is not root.',
              'Dòng <code>run.sh</code>: nó thuộc <code>root:root</code>, nên bit thực thi ở vị trí "other" không áp cho <code>deploy</code> — quyền của nhóm và của người khác chỉ được xét với những file mà chủ sở hữu không phải root.',
            ),
            B(
              'The <code>app</code> line: a directory must be group-writable for a script inside it to be executed by a member of that group, and <code>drwxr-xr-x</code> grants only read and traverse.',
              'Dòng <code>app</code>: một thư mục phải cho nhóm ghi được thì script bên trong mới được một thành viên của nhóm ấy thực thi, mà <code>drwxr-xr-x</code> chỉ cho đọc và đi qua.',
            ),
            B(
              'The <code>srv</code> line: <code>drwxr-x---</code> owned by <code>root:root</code> gives "other" no execute bit, so a user who is neither root nor in group <code>root</code> cannot TRAVERSE into it — and every directory in a path needs <code>x</code> for that. <code>ls -l</code> on the file shows one link of the chain; <code>namei -l</code> shows all of them at once.',
              'Dòng <code>srv</code>: <code>drwxr-x---</code> thuộc <code>root:root</code> nên "người khác" không có bit thực thi, và một người dùng không phải root cũng không thuộc nhóm <code>root</code> thì không ĐI QUA được nó — mà mọi thư mục trên đường dẫn đều cần bit <code>x</code> để đi qua. <code>ls -l</code> trên file chỉ cho thấy một mắt xích; <code>namei -l</code> cho thấy toàn bộ chuỗi cùng lúc.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. On a directory, <code>x</code> means "may traverse into" and <code>r</code> means "may list the names inside" — they are independent, which is why a <code>711</code> directory lets you open a file whose name you already know while <code>ls</code> is refused. The failure here is two levels above the file, and no amount of <code>chmod</code> on <code>run.sh</code> will change it. <code>namei -l</code> is the fastest permission tool on the machine for exactly this reason. When it comes back clean and the denial persists, the remaining suspects are a <code>noexec</code> mount (<code>findmnt -T</code>), a filesystem remounted read-only after an I/O error, a systemd sandboxing directive such as <code>ProtectSystem=strict</code>, or AppArmor — the last one visible only in <code>dmesg</code>.',
            'Đã đo thật. Trên một thư mục, bit <code>x</code> nghĩa là "được đi qua" còn <code>r</code> nghĩa là "được liệt kê tên bên trong" — hai thứ độc lập nhau, và đó là lý do một thư mục <code>711</code> cho bạn mở một file mà bạn đã biết tên trong khi lệnh <code>ls</code> thì bị từ chối. Chỗ hỏng ở đây nằm trên file hai bậc, và <code>chmod</code> lên <code>run.sh</code> bao nhiêu cũng vô ích. Chính vì thế <code>namei -l</code> là công cụ về quyền nhanh nhất trên máy. Khi nó trả về sạch mà vẫn bị từ chối thì những nghi can còn lại là một điểm gắn <code>noexec</code> (<code>findmnt -T</code>), một hệ thống file bị gắn lại chỉ-đọc sau lỗi vào-ra, một chỉ thị hộp cát của systemd như <code>ProtectSystem=strict</code>, hoặc AppArmor — cái cuối chỉ nhìn thấy trong <code>dmesg</code>.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'Real run on Linux. The script is present and executable:' + code(
              '$ ./crlf.sh\n' +
              'bash: ./crlf.sh: cannot execute: required file not found\n' +
              '$ echo $?\n' +
              '127\n' +
              '\n' +
              '$ head -c 20 crlf.sh | cat -A | head -1\n' +
              '#!/bin/bash^M$\n' +
              '\n' +
              '$ file crlf.sh\n' +
              'crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators',
            ) + 'Which file is "not found"?',
            'Chạy thật trên Linux. Script có mặt và có quyền thực thi:' + code(
              '$ ./crlf.sh\n' +
              'bash: ./crlf.sh: cannot execute: required file not found\n' +
              '$ echo $?\n' +
              '127\n' +
              '\n' +
              '$ head -c 20 crlf.sh | cat -A | head -1\n' +
              '#!/bin/bash^M$\n' +
              '\n' +
              '$ file crlf.sh\n' +
              'crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators',
            ) + 'File nào là cái "not found"?',
          ),
          options: [
            B(
              '<code>crlf.sh</code> itself. The shell resolved <code>./</code> against a working directory that no longer exists — a stale <code>cwd</code> after the directory was moved — and <code>cat -A</code> is showing an unrelated cosmetic issue with the line endings.',
              'Chính <code>crlf.sh</code>. Shell đã phân giải <code>./</code> theo một thư mục làm việc không còn tồn tại — một <code>cwd</code> cũ sau khi thư mục bị chuyển đi — còn <code>cat -A</code> chỉ đang cho thấy một vấn đề hình thức không liên quan về ký tự kết dòng.',
            ),
            B(
              'The INTERPRETER. <code>^M</code> is a carriage return, so the shebang names a program literally called <code>/bin/bash\\r</code>, which does not exist. The error points at the script while the missing file is the interpreter — fix with <code>sed -i \'s/\\r$//\' crlf.sh</code> or <code>dos2unix</code>.',
              'TRÌNH THÔNG DỊCH. <code>^M</code> là một ký tự về đầu dòng, nên dòng shebang gọi tên một chương trình đúng nghĩa đen là <code>/bin/bash\\r</code>, thứ không tồn tại. Thông báo lỗi chĩa vào script trong khi file thiếu lại là trình thông dịch — chữa bằng <code>sed -i \'s/\\r$//\' crlf.sh</code> hoặc <code>dos2unix</code>.',
            ),
            B(
              'A shared library. Exit code 127 is the dynamic linker\'s way of reporting an unresolved dependency, so <code>ldd ./crlf.sh</code> will print <code>=&gt; not found</code> against whichever library the script\'s interpreter was built with.',
              'Một thư viện chia sẻ. Mã thoát 127 là cách trình liên kết động báo một phụ thuộc chưa phân giải được, nên <code>ldd ./crlf.sh</code> sẽ in <code>=&gt; not found</code> cho thư viện mà trình thông dịch của script được dựng cùng.',
            ),
            B(
              'None — the file was found. Exit 127 with <code>cannot execute</code> means the binary format was rejected by the kernel because the file is text rather than an ELF executable, and the fix is to invoke it as <code>bash crlf.sh</code> instead of <code>./crlf.sh</code>.',
              'Không file nào — file đã được tìm thấy. Mã thoát 127 kèm <code>cannot execute</code> nghĩa là định dạng nhị phân bị nhân từ chối vì file là văn bản chứ không phải một chương trình ELF, và cách chữa là gọi <code>bash crlf.sh</code> thay cho <code>./crlf.sh</code>.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The kernel reads the shebang literally, carriage return included, and looks for an interpreter whose name ends in an invisible character — so it reports "required file not found" while naming the script you can plainly see. This is what a file edited on Windows, or checked out with the wrong <code>core.autocrlf</code> setting, does to a repository. <code>cat -A</code> proves it in one line by making the <code>^M</code> visible, and <code>file</code> says <code>with CRLF line terminators</code> outright. Note the same cause behind a container that exits 126: an entrypoint script with CRLF endings makes the kernel look for <code>/bin/sh\\r</code> too.',
            'Đã đo thật. Nhân đọc dòng shebang đúng từng ký tự, kể cả ký tự về đầu dòng, rồi đi tìm một trình thông dịch có tên kết thúc bằng một ký tự vô hình — nên nó báo "required file not found" trong khi lại gọi tên đúng cái script mà bạn nhìn thấy rành rành. Đây chính là thứ mà một file soạn trên Windows, hoặc lấy về với thiết lập <code>core.autocrlf</code> sai, gây ra cho một kho mã. <code>cat -A</code> chứng minh chỉ trong một dòng bằng cách làm <code>^M</code> hiện ra, còn <code>file</code> thì nói thẳng <code>with CRLF line terminators</code>. Để ý cùng nguyên nhân đó nằm sau một container thoát ra 126: một script điểm vào có ký tự kết dòng CRLF cũng khiến nhân đi tìm <code>/bin/sh\\r</code>.',
          ),
        }),

        // ── 2 câu lập trình ──────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Audit what is listening (chapters 9.1 and 9.5).</b> The starter holds one captured block of <code>ss -tulpn</code> output. Implement <code>audit()</code>, which reads that text on <b>stdin</b> and prints one line per socket:</p>' +
            code('<proto> <scope> <port> <process> <verdict>') +
            '<p>printed with exactly this format string, so the columns line up:</p>' +
            code("printf '%-3s %-6s %-5s %-13s %s\\n' \"$proto\" \"$scope\" \"$port\" \"$name\" \"$verdict\"") +
            '<ul>' +
            '<li><b>Skip the header</b> — the line whose first field is <code>Netid</code>.</li>' +
            '<li><b>proto</b> is the first field, <code>tcp</code> or <code>udp</code>.</li>' +
            '<li><b>port</b> is everything after the LAST colon of the Local Address field; <b>the address</b> is everything before it.</li>' +
            '<li><b>scope</b>: <code>local</code> for <code>127.0.0.1</code> and <code>[::1]</code>, <code>public</code> for <code>0.0.0.0</code>, <code>[::]</code> and <code>*</code>, <code>iface</code> for anything else.</li>' +
            '<li><b>process</b> is the name between the first pair of double quotes in the Process field. When that field is a bare <code>-</code>, print <code>?</code>.</li>' +
            '<li><b>verdict</b>: <code>EXPOSED</code> when the scope is <code>public</code> AND the port is not one of <b>22, 80, 443</b>; <code>OK</code> otherwise. The rule is deliberately mechanical — you are auditing bind addresses, not judging services.</li>' +
            '<li>Finish with <code>TONG: &lt;n&gt; socket, &lt;m&gt; EXPOSED</code> and <b>return non-zero when m is greater than 0</b>, so the function can be a check in a script.</li>' +
            '</ul>' +
            '<p>Two rows decide this question. <code>[::1]:6379</code> and <code>[::]:443</code> are IPv6, so the address itself contains colons and splitting on the first one gives the wrong answer. And the row ending in <code>-</code> has no process at all, because <code>ss</code> only shows that column with <code>sudo</code>.</p>' +
            '<p>Pure text: no <code>ss</code>, no network, no <code>sudo</code>. Keep the given block and the two closing lines exactly as they are.</p>',

            '<p><b>Câu 31 — Rà xem cái gì đang lắng nghe (chương 9.1 và 9.5).</b> Phần cho sẵn chứa một khối đầu ra <code>ss -tulpn</code> đã chụp lại. Hãy cài đặt <code>audit()</code>: đọc khối văn bản đó từ <b>stdin</b> và in mỗi socket một dòng:</p>' +
            code('<giao thức> <phạm vi> <cổng> <tiến trình> <kết luận>') +
            '<p>in bằng đúng chuỗi định dạng này để các cột thẳng hàng:</p>' +
            code("printf '%-3s %-6s %-5s %-13s %s\\n' \"$proto\" \"$scope\" \"$port\" \"$name\" \"$verdict\"") +
            '<ul>' +
            '<li><b>Bỏ qua dòng tiêu đề</b> — dòng có trường đầu tiên là <code>Netid</code>.</li>' +
            '<li><b>giao thức</b> là trường đầu tiên, <code>tcp</code> hoặc <code>udp</code>.</li>' +
            '<li><b>cổng</b> là mọi thứ sau dấu hai chấm CUỐI CÙNG của trường Local Address; <b>địa chỉ</b> là mọi thứ trước nó.</li>' +
            '<li><b>phạm vi</b>: <code>local</code> với <code>127.0.0.1</code> và <code>[::1]</code>, <code>public</code> với <code>0.0.0.0</code>, <code>[::]</code> và <code>*</code>, <code>iface</code> với mọi thứ còn lại.</li>' +
            '<li><b>tiến trình</b> là cái tên nằm giữa cặp nháy kép đầu tiên trong trường Process. Khi trường đó chỉ là một dấu <code>-</code> trơ trọi thì in <code>?</code>.</li>' +
            '<li><b>kết luận</b>: <code>EXPOSED</code> khi phạm vi là <code>public</code> VÀ cổng không thuộc <b>22, 80, 443</b>; ngược lại là <code>OK</code>. Luật cố ý máy móc — bạn đang rà địa chỉ gắn, không phán xét từng dịch vụ.</li>' +
            '<li>Kết thúc bằng <code>TONG: &lt;n&gt; socket, &lt;m&gt; EXPOSED</code> và <b>trả về mã khác 0 khi m lớn hơn 0</b>, để hàm này dùng được như một phép kiểm trong script.</li>' +
            '</ul>' +
            '<p>Hai dòng dữ liệu quyết định câu này. <code>[::1]:6379</code> và <code>[::]:443</code> là IPv6 nên bản thân địa chỉ đã chứa dấu hai chấm, cắt ở dấu đầu tiên là ra sai. Còn dòng kết thúc bằng <code>-</code> thì không có tiến trình nào cả, vì <code>ss</code> chỉ hiện cột đó khi chạy với <code>sudo</code>.</p>' +
            '<p>Thuần văn bản: không gọi <code>ss</code>, không mạng, không <code>sudo</code>. Giữ nguyên khối cho sẵn và hai dòng cuối.</p>',
          ),
          starterCode: Q31_STARTER,
          expectedOutput: Q31_OUTPUT,
          sampleSolution: Q31_SOLUTION,
          rubric: RUBRIC_CODE,
        }),

        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q32 — Two numbers from two commands (chapters 10.1 and 12.3).</b> The starter holds the output of <code>df -h</code> and of <code>df -i</code>, captured on the same machine seconds apart. Implement <code>check_disk "$df_h" "$df_i"</code>, which joins them and prints one line per filesystem:</p>' +
            code("printf '%-16s bytes=%-4s inodes=%-4s %-5s %s\\n' \"$mnt\" \"$b\" \"$ishow\" \"$lv\" \"$axis\"") +
            '<ul>' +
            '<li><b>Skip the header</b> (first field <code>Filesystem</code>) and skip any filesystem whose device is <code>tmpfs</code>, <code>devtmpfs</code>, <code>udev</code> or <code>efivarfs</code>.</li>' +
            '<li><b>Join on the MOUNT POINT</b>, never on line number — the two commands ran seconds apart and neither the order nor the number of rows is guaranteed to match.</li>' +
            '<li>Percentages are the numbers with <code>%</code> stripped. <b>Level</b>: <code>CRIT</code> at 90 or above, <code>WARN</code> at 80 or above, otherwise <code>OK</code>.</li>' +
            '<li>Report the WORSE of the two levels, and name the axis that caused it: <code>bytes</code>, <code>inodes</code>, or <code>bytes+inodes</code> when both sides reach the same non-OK level. When the level is <code>OK</code> the axis is <code>bytes</code>.</li>' +
            '<li>A mount present in <code>df -h</code> but missing from <code>df -i</code>: print <code>?</code> for its inode column, judge it on bytes alone, and count it.</li>' +
            '<li>Finish with <code>TONG: crit=&lt;a&gt; warn=&lt;b&gt; ok=&lt;c&gt; thieu-inode=&lt;d&gt;</code>, then <b>return 2</b> if anything is CRIT, <b>1</b> if anything is WARN, <b>0</b> otherwise.</li>' +
            '</ul>' +
            '<p>Two rows are the point of the exercise. <code>/</code> is 42% full of bytes and 100% full of inodes; <code>/mnt/data</code> is 1% and 100%. Both are a machine that refuses every write while <code>df -h</code> looks calm — and a checker that reads only one of the two commands calls them healthy.</p>' +
            '<p>One warning about the loop: feed it with <code>done &lt;&lt;&lt; "$1"</code>, not <code>printf … | while</code>. A pipe runs the loop in a subshell and your four counters are back at zero the moment it ends.</p>' +
            '<p>Keep the two given blocks and the two closing lines exactly as they are.</p>',

            '<p><b>Câu 32 — Hai con số từ hai câu lệnh (chương 10.1 và 12.3).</b> Phần cho sẵn chứa đầu ra của <code>df -h</code> và của <code>df -i</code>, chụp trên cùng một máy cách nhau vài giây. Hãy cài đặt <code>check_disk "$df_h" "$df_i"</code>: ghép chúng lại và in mỗi hệ thống file một dòng:</p>' +
            code("printf '%-16s bytes=%-4s inodes=%-4s %-5s %s\\n' \"$mnt\" \"$b\" \"$ishow\" \"$lv\" \"$axis\"") +
            '<ul>' +
            '<li><b>Bỏ qua dòng tiêu đề</b> (trường đầu là <code>Filesystem</code>) và bỏ qua mọi hệ thống file có thiết bị là <code>tmpfs</code>, <code>devtmpfs</code>, <code>udev</code> hay <code>efivarfs</code>.</li>' +
            '<li><b>Ghép theo ĐIỂM GẮN</b>, tuyệt đối không theo số thứ tự dòng — hai lệnh chạy cách nhau vài giây, không có gì đảm bảo thứ tự lẫn số dòng trùng nhau.</li>' +
            '<li>Phần trăm là con số đã bỏ dấu <code>%</code>. <b>Mức</b>: <code>CRIT</code> từ 90 trở lên, <code>WARN</code> từ 80 trở lên, còn lại là <code>OK</code>.</li>' +
            '<li>Báo mức TỆ HƠN trong hai mức, và gọi tên cái trục gây ra nó: <code>bytes</code>, <code>inodes</code>, hoặc <code>bytes+inodes</code> khi cả hai bên cùng chạm một mức khác OK. Khi mức là <code>OK</code> thì trục ghi là <code>bytes</code>.</li>' +
            '<li>Một điểm gắn có trong <code>df -h</code> mà vắng trong <code>df -i</code>: in <code>?</code> ở cột inode, xét mức chỉ theo bytes, và đếm nó lại.</li>' +
            '<li>Kết thúc bằng <code>TONG: crit=&lt;a&gt; warn=&lt;b&gt; ok=&lt;c&gt; thieu-inode=&lt;d&gt;</code>, rồi <b>trả về 2</b> nếu có cái nào CRIT, <b>1</b> nếu có cái nào WARN, <b>0</b> nếu không.</li>' +
            '</ul>' +
            '<p>Hai dòng dữ liệu mới là ý nghĩa của bài. <code>/</code> đầy 42% theo byte và 100% theo inode; <code>/mnt/data</code> là 1% và 100%. Cả hai đều là cái máy từ chối mọi lệnh ghi trong khi <code>df -h</code> trông rất bình thản — và một bộ kiểm chỉ đọc một trong hai lệnh sẽ gọi chúng là khoẻ mạnh.</p>' +
            '<p>Một lời cảnh báo về vòng lặp: hãy nạp dữ liệu bằng <code>done &lt;&lt;&lt; "$1"</code>, đừng dùng <code>printf … | while</code>. Ống dẫn đẩy vòng lặp vào một shell con và bốn biến đếm của bạn quay về 0 ngay khi nó kết thúc.</p>' +
            '<p>Giữ nguyên hai khối cho sẵn và hai dòng cuối.</p>',
          ),
          starterCode: Q32_STARTER,
          expectedOutput: Q32_OUTPUT,
          sampleSolution: Q32_SOLUTION,
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
