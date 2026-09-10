/**
 * Deploy VPS — Progress Test 3 (Chương 8 → Chương 11).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi, bám sát
 * `content/courses/deploy-vps/s08-may-nho` … `s11-chan-doan`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ KHÔNG MỘT BYTE NÀO CHẠM VÀO HẠ TẦNG THẬT
 * ────────────────────────────────────────────────────────────────────────────
 * Không SSH tới máy chủ nào, không đụng `cuonghoangdev_db`, không đọc
 * `/opt/cuonghoangdev/.env`, không chạy `deploy.sh` / `deploy-nha.sh` /
 * `gh workflow run` / `git push`. Mọi giá trị nhạy cảm trong đề là GIÁ TRỊ GIẢ
 * (`MAT_KHAU_GIA_LAP`), và không một mã băm mật khẩu nào được in ra.
 *
 * ⚙️ SÂN ĐO (dựng rồi xoá bằng `docker rm -f`)
 *   • "VPS giả": container `debian:12` chạy `--privileged` — Debian 12.15
 *     (aarch64), bash 5.2.15(1), GNU coreutils 9.1, e2fsprogs (mkfs.ext4,
 *     tune2fs), lsof, util-linux 2.38.1, python3 3.11.2. Một hệ tệp ext4 156 MB
 *     dựng trên tệp ảnh rồi `mount -o loop` — dùng cho các phép đo ENOSPC.
 *   • PostgreSQL 16.14 trong container `postgres:16` riêng (CSDL nháp `de`,
 *     cổng 55441) — dùng cho chương 10.
 *   • `node:22-slim` (Node v22.23.1) chạy dưới `--memory` / `--memory-swap`
 *     cho các phép đo OOM và tràn heap V8.
 *   • Docker Engine 29.5.3 / Compose v5.1.4, nhân 6.12.76-linuxkit, linux/arm64.
 *
 * ⚠️ MÁY ĐANG CHẠY NHIỀU TIẾN TRÌNH KHÁC ⇒ đề này KHÔNG hỏi một con số thời
 * gian nào của riêng nó. Chỗ nào cần thời gian thì hỏi CƠ CHẾ, hoặc trích lại
 * con số mà chính giáo trình đã đo. Các con số phân vị ở chương 9 được tính
 * trên một tập mẫu CỐ ĐỊNH sinh ra tất định, không phải đo thời gian thật.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỘT CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 * Bài 8.5 nói tràn heap của V8 cho ra `FATAL ERROR: JavaScript heap out of
 * memory` kèm **mã thoát 134**. Đo thật trên Node v22.23.1 (ảnh `node:22-slim`,
 * ba lượt liên tiếp, kết quả không đổi):
 *
 *     node --max-old-space-size=128  (trong --memory=1g)  → ma thoat 133
 *       FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap
 *       out of memory
 *     node (khong dat tran heap)     (trong --memory=256m) → ma thoat 137, log TRONG
 *
 * 133 = 128 + 5 = SIGTRAP, không phải 134 = 128 + 6 = SIGABRT. Bài học của
 * giáo trình vẫn nguyên vẹn và quan trọng hơn con số: đặt trần heap là biến
 * một cú giết KHÔNG GIẢI THÍCH ĐƯỢC thành một lỗi ĐỌC ĐƯỢC. Câu 2 dựng trên
 * phép đo này và theo MÁY.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN PHÁT HIỆN CŨ, ĐÃ GHI Ở `DEPLOY-VPS-FE.mjs` — đề này KHÔNG ra vào đó
 * ────────────────────────────────────────────────────────────────────────────
 * `ln -sfn` nguyên tử trên coreutils 9.1 · mặc định `--whole-file` của rsync ·
 * `ANALYZE` sau `pg_restore` không tái hiện được · ext4 hết inode trước hết
 * khối. Bốn chỗ ấy là phát hiện của đề FE, không phải của đề này — nên đề này
 * KHÔNG hỏi một câu nào về `ANALYZE` lẫn về việc cạn inode.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CÂU LẬP TRÌNH ĐỀU ĐÃ CHẠY THẬT TRƯỚC KHI GIAO
 * ────────────────────────────────────────────────────────────────────────────
 * `scripts/exam-check.mjs` ghép `starterCode` với `sampleSolution` rồi chạy —
 * bash bằng `/bin/bash` CỦA MÁY SOẠN ĐỀ (bash 3.2.57(1), userland BSD của
 * macOS 26.6), javascript bằng `node` v22.
 *
 *   • Câu 31 (`bash`) tránh hết cú pháp bash 4+ (`declare -A`, `${x^^}`,
 *     `mapfile`, `local -n`, `[[ =~ ]]`) và mọi cờ chỉ GNU mới có (`stat -c`,
 *     `sed -i` không đối số, `date -d`, `grep -P`, `readlink -f`, `sort -V`,
 *     `timeout`). Chỉ POSIX + `case` + số học nguyên của shell.
 *   • Câu 32 (`javascript`) tự chứa, không `import`, không `require`, không
 *     đụng hệ thống tệp. Bảng mã thoát mà nó tính ra (125 · 126 · 127 · 133 ·
 *     137 · 143→0 · 7) đều đã ĐO THẬT bằng `docker run` trên máy này.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây): A 8 · B 8 · C 8 · D 8 = 32 khoá
 * trên 30 câu, vì có hai câu "chọn HAI".
 *
 *   node -e "import('./content/exams/DEPLOY-VPS-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Không trùng câu nào với `DEPLOY-VPS-FE.mjs` (50 câu) và `DEPLOY-VPS-PE.mjs`
 * (5 câu thực hành), và không trùng giữa PT1 / PT2 / PT3.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DEPLOY-VPS-PT3.mjs --apply
 */
import { B, EX, code, c, ptInstructions, mcq, codeQ } from './_lib/deployvps-exam-kit.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   Câu 31 — ngân sách đĩa xuyên qua một chuỗi thao tác dựng và dọn (chương 8.4)
   ══════════════════════════════════════════════════════════════════════════ */

const PT3_Q31_STARTER =
            '#!/usr/bin/env bash\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'TONG=2000        # MB — cả hệ tệp\n' +
            'DU_TRU_PC=5      # % khối dành riêng cho root (mặc định của ext4)\n' +
            '\n' +
            'thao_tac=(\n' +
            '  \'khoi-dau csdl 300\'\n' +
            '  \'khoi-dau log 40\'\n' +
            '  \'phat-hanh v1 220\'\n' +
            '  \'phat-hanh v2 220\'\n' +
            '  \'bo-dem +900\'\n' +
            '  \'wal 5\'\n' +
            '  \'phat-hanh v3 220\'\n' +
            '  \'bo-dem +200\'\n' +
            '  \'wal 5\'\n' +
            '  \'don-ban 2\'\n' +
            '  \'wal 5\'\n' +
            '  \'prune-bo-dem\'\n' +
            '  \'log +600\'\n' +
            '  \'xoa-log-dang-mo\'\n' +
            '  \'wal 5\'\n' +
            '  \'cat-cut-log\'\n' +
            '  \'wal 5\'\n' +
            ')\n' +
            '\n' +
            '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'chay() {\n' +
            '  echo \'chua cai dat\' >&2\n' +
            '  return 1\n' +
            '}\n' +
            '\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'printf \'he tep %d MB, du tru root %d%% => tran ghi duoc = %d MB\\n\' \\\n' +
            '  "$TONG" "$DU_TRU_PC" "$(( TONG - TONG * DU_TRU_PC / 100 ))"\n' +
            'chay\n';

const PT3_Q31_SOLUTION =
            'chay() {\n' +
            '  csdl=0; log=0; bo_dem=0; ma_log=0; rac=0   # ma_log = log DA XOA ma tien trinh con giu mo\n' +
            '                                             # rac    = manh vun cua mot ban phat hanh giai nen do dang\n' +
            '  ban_ten=\'\'; ban_mb=\'\'\n' +
            '  nguong=$(( TONG - TONG * DU_TRU_PC / 100 ))\n' +
            '\n' +
            '  tong_ban() {\n' +
            '    t=0\n' +
            '    for m in $ban_mb; do t=$(( t + m )); done\n' +
            '    echo $t\n' +
            '  }\n' +
            '\n' +
            '  in_dong() {\n' +
            '    b=$(tong_ban)\n' +
            '    df_dung=$(( csdl + log + ma_log + bo_dem + rac + b ))\n' +
            '    du_thay=$(( csdl + log + bo_dem + rac + b ))\n' +
            '    trong=$(( nguong - df_dung ))\n' +
            '    [ "$trong" -lt 0 ] && trong=0\n' +
            '    printf \'%-18s df_dung=%4d du_thay=%4d trong=%4d rac=%3d ban=[%s]%s\\n\' \\\n' +
            '      "$1" "$df_dung" "$du_thay" "$trong" "$rac" "$(echo $ban_ten | tr \' \' \',\')" "${2:+ $2}"\n' +
            '  }\n' +
            '\n' +
            '  for tt in "${thao_tac[@]}"; do\n' +
            '    set -- $tt\n' +
            '    lenh=$1; a=$2; b=${3:-}\n' +
            '    ghi_chu=\'\'\n' +
            '    case $lenh in\n' +
            '      khoi-dau)\n' +
            '        [ "$a" = csdl ] && csdl=$b\n' +
            '        [ "$a" = log ] && log=$b\n' +
            '        ;;\n' +
            '      phat-hanh)\n' +
            '        b2=$(tong_ban)\n' +
            '        df_dung=$(( csdl + log + ma_log + bo_dem + rac + b2 ))\n' +
            '        vua=$(( nguong - df_dung ))\n' +
            '        [ "$vua" -lt 0 ] && vua=0\n' +
            '        if [ "$b" -gt "$vua" ]; then\n' +
            '          ghi_chu="ENOSPC — chi giai nen duoc $vua/$b MB, ban phat hanh DO DANG"\n' +
            '          rac=$(( rac + vua ))\n' +
            '        else\n' +
            '          ban_ten="$ban_ten $a"\n' +
            '          ban_mb="$ban_mb $b"\n' +
            '        fi\n' +
            '        ;;\n' +
            '      bo-dem)\n' +
            '        xin=${a#+}\n' +
            '        b=$(tong_ban)\n' +
            '        df_dung=$(( csdl + log + ma_log + bo_dem + rac + b ))\n' +
            '        vua=$(( nguong - df_dung ))\n' +
            '        [ "$vua" -lt 0 ] && vua=0\n' +
            '        if [ "$xin" -gt "$vua" ]; then\n' +
            '          bo_dem=$(( bo_dem + vua ))\n' +
            '          ghi_chu="ENOSPC — chi ghi duoc $vua/$xin MB, ban dung HONG"\n' +
            '        else\n' +
            '          bo_dem=$(( bo_dem + xin ))\n' +
            '        fi\n' +
            '        ;;\n' +
            '      prune-bo-dem)\n' +
            '        # Chi don BO DEM DUNG. Manh vun cua lan deploy hong KHONG nam trong do.\n' +
            '        bo_dem=0\n' +
            '        ;;\n' +
            '      log)\n' +
            '        xin=${a#+}\n' +
            '        b=$(tong_ban)\n' +
            '        df_dung=$(( csdl + log + ma_log + bo_dem + rac + b ))\n' +
            '        vua=$(( nguong - df_dung ))\n' +
            '        [ "$vua" -lt 0 ] && vua=0\n' +
            '        if [ "$xin" -gt "$vua" ]; then\n' +
            '          log=$(( log + vua ))\n' +
            '          ghi_chu="ENOSPC — chi ghi duoc $vua/$xin MB"\n' +
            '        else\n' +
            '          log=$(( log + xin ))\n' +
            '        fi\n' +
            '        ;;\n' +
            '      xoa-log-dang-mo)\n' +
            '        # rm KHONG tra lai byte nao: inode con song vi mot tien trinh con giu mo.\n' +
            '        ma_log=$(( ma_log + log )); log=0\n' +
            '        ghi_chu=\'rm giai phong 0 MB\'\n' +
            '        ;;\n' +
            '      cat-cut-log)\n' +
            '        # cat cut qua /proc/<pid>/fd — day moi la thu tra lai cho.\n' +
            '        ghi_chu="cat cut tra lai $ma_log MB"; ma_log=0\n' +
            '        ;;\n' +
            '      don-ban)\n' +
            '        giu=$a\n' +
            '        n=0; for x in $ban_ten; do n=$(( n + 1 )); done\n' +
            '        bo=$(( n - giu ))\n' +
            '        [ "$bo" -lt 0 ] && bo=0\n' +
            '        t2=\'\'; m2=\'\'; i=0; da_xoa=\'\'\n' +
            '        set -- $ban_mb\n' +
            '        for x in $ban_ten; do\n' +
            '          i=$(( i + 1 ))\n' +
            '          eval "mb=\\${$i}"\n' +
            '          if [ "$i" -le "$bo" ]; then da_xoa="$da_xoa $x"; else t2="$t2 $x"; m2="$m2 $mb"; fi\n' +
            '        done\n' +
            '        ban_ten=$t2; ban_mb=$m2\n' +
            '        ghi_chu="xoa=[$(echo $da_xoa | tr \' \' \',\')]"\n' +
            '        ;;\n' +
            '      wal)\n' +
            '        bcan=$a\n' +
            '        b=$(tong_ban)\n' +
            '        df_dung=$(( csdl + log + ma_log + bo_dem + rac + b ))\n' +
            '        if [ $(( df_dung + bcan )) -gt "$nguong" ]; then\n' +
            '          ghi_chu=\'ENOSPC errno 28 — CSDL KHONG ghi duoc\'\n' +
            '        else\n' +
            '          csdl=$(( csdl + bcan ))\n' +
            '          ghi_chu=\'ghi OK\'\n' +
            '        fi\n' +
            '        ;;\n' +
            '    esac\n' +
            '    in_dong "$tt" "$ghi_chu"\n' +
            '  done\n' +
            '}\n';

const PT3_Q31_OUTPUT =
            'he tep 2000 MB, du tru root 5% => tran ghi duoc = 1900 MB\n' +
            'khoi-dau csdl 300  df_dung= 300 du_thay= 300 trong=1600 rac=  0 ban=[]\n' +
            'khoi-dau log 40    df_dung= 340 du_thay= 340 trong=1560 rac=  0 ban=[]\n' +
            'phat-hanh v1 220   df_dung= 560 du_thay= 560 trong=1340 rac=  0 ban=[v1]\n' +
            'phat-hanh v2 220   df_dung= 780 du_thay= 780 trong=1120 rac=  0 ban=[v1,v2]\n' +
            'bo-dem +900        df_dung=1680 du_thay=1680 trong= 220 rac=  0 ban=[v1,v2]\n' +
            'wal 5              df_dung=1685 du_thay=1685 trong= 215 rac=  0 ban=[v1,v2] ghi OK\n' +
            'phat-hanh v3 220   df_dung=1900 du_thay=1900 trong=   0 rac=215 ban=[v1,v2] ENOSPC — chi giai nen duoc 215/220 MB, ban phat hanh DO DANG\n' +
            'bo-dem +200        df_dung=1900 du_thay=1900 trong=   0 rac=215 ban=[v1,v2] ENOSPC — chi ghi duoc 0/200 MB, ban dung HONG\n' +
            'wal 5              df_dung=1900 du_thay=1900 trong=   0 rac=215 ban=[v1,v2] ENOSPC errno 28 — CSDL KHONG ghi duoc\n' +
            'don-ban 2          df_dung=1900 du_thay=1900 trong=   0 rac=215 ban=[v1,v2] xoa=[]\n' +
            'wal 5              df_dung=1900 du_thay=1900 trong=   0 rac=215 ban=[v1,v2] ENOSPC errno 28 — CSDL KHONG ghi duoc\n' +
            'prune-bo-dem       df_dung=1000 du_thay=1000 trong= 900 rac=215 ban=[v1,v2]\n' +
            'log +600           df_dung=1600 du_thay=1600 trong= 300 rac=215 ban=[v1,v2]\n' +
            'xoa-log-dang-mo    df_dung=1600 du_thay= 960 trong= 300 rac=215 ban=[v1,v2] rm giai phong 0 MB\n' +
            'wal 5              df_dung=1605 du_thay= 965 trong= 295 rac=215 ban=[v1,v2] ghi OK\n' +
            'cat-cut-log        df_dung= 965 du_thay= 965 trong= 935 rac=215 ban=[v1,v2] cat cut tra lai 640 MB\n' +
            'wal 5              df_dung= 970 du_thay= 970 trong= 930 rac=215 ban=[v1,v2] ghi OK';


/* ══════════════════════════════════════════════════════════════════════════
   Câu 32 — một chuỗi sự kiện container ra MÃ THOÁT và nguyên nhân (chương 3.2, 8.1, 8.5)
   ══════════════════════════════════════════════════════════════════════════ */

const PT3_Q32_STARTER =
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const KICH_BAN = [\n' +
            '  [\'A\', [\'chay ung-dung\', \'bay TERM\', \'stop -t 10\']],\n' +
            '  [\'B\', [\'chay ung-dung\', \'stop -t 5\']],\n' +
            '  [\'C\', [\'chay ung-dung\', \'tin-hieu KILL\']],\n' +
            '  [\'D\', [\'chay ung-dung\', \'oom\']],\n' +
            '  [\'E\', [\'chay ung-dung\', \'v8-het-heap\']],\n' +
            '  [\'F\', [\'chay thu-muc\']],\n' +
            '  [\'G\', [\'chay khong-co-lenh\']],\n' +
            '  [\'H\', [\'docker-co-sai\', \'chay ung-dung\']],\n' +
            '  [\'I\', [\'chay ung-dung\', \'bay TERM\', \'thoat 7\']],\n' +
            '  [\'J\', [\'chay ung-dung\', \'tin-hieu TERM\']],\n' +
            '  [\'K\', [\'chay ung-dung\', \'bay TERM\', \'tin-hieu TERM\', \'tin-hieu KILL\']],\n' +
            '  [\'L\', [\'chay co-nhung-khong-x\']],\n' +
            '];\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function giai(buoc) {\n' +
            '  // chua cai dat\n' +
            '  return { ma: 0, oom: false, log: \'\', cho: 0, vi: \'\' };\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [nhan, buoc] of KICH_BAN) {\n' +
            '  const r = giai(buoc);\n' +
            '  console.log(\n' +
            '    nhan + \' \' + (\'[\' + buoc.join(\' ; \') + \']\').padEnd(60) +\n' +
            '    \' ma=\' + String(r.ma).padEnd(9) +\n' +
            '    \' OOMKilled=\' + (r.oom ? \'co   \' : \'khong\') +\n' +
            '    \' cho=\' + r.cho + \'s\' +\n' +
            '    \' log=\' + r.log.padEnd(40) +\n' +
            '    \' \' + r.vi,\n' +
            '  );\n' +
            '}\n';

const PT3_Q32_SOLUTION =
            'function giai(buoc) {\n' +
            '  let song = false;      // tiến trình có đang chạy không\n' +
            '  let bayTerm = false;   // đã cài trình xử lý SIGTERM chưa\n' +
            '  let ma = null;         // mã thoát\n' +
            '  let oom = false;       // Docker có đánh dấu OOMKilled không\n' +
            '  let log = \'trong\';     // ứng dụng có kịp ghi gì không\n' +
            '  let vi = \'\';\n' +
            '  let cho = 0;           // giây phải chờ trước khi container chết\n' +
            '\n' +
            '  const ket = (m, lyDo, ghi) => { ma = m; vi = lyDo; if (ghi) log = ghi; song = false; };\n' +
            '\n' +
            '  for (const b of buoc) {\n' +
            '    if (ma !== null) continue;                       // đã chết thì mọi bước sau vô nghĩa\n' +
            '    const p = b.split(\' \');\n' +
            '\n' +
            '    if (p[0] === \'docker-co-sai\') {\n' +
            '      // 125 = chính DOCKER từ chối, container chưa từng tồn tại.\n' +
            '      ket(125, \'docker tu choi tuy chon — container chua he khoi dong\');\n' +
            '\n' +
            '    } else if (p[0] === \'chay\') {\n' +
            '      if (p[1] === \'ung-dung\') song = true;\n' +
            '      else if (p[1] === \'khong-co-lenh\') ket(127, \'khong tim thay lenh\');\n' +
            '      // 126 = TIM THAY nhung khong thuc thi duoc (thu muc, hoac thieu bit x).\n' +
            '      else ket(126, \'tim thay nhung khong chay duoc\');\n' +
            '\n' +
            '    } else if (p[0] === \'bay\') {\n' +
            '      if (song) bayTerm = true;\n' +
            '\n' +
            '    } else if (p[0] === \'tin-hieu\') {\n' +
            '      if (p[1] === \'KILL\') {\n' +
            '        // SIGKILL khong bat duoc: khong mot dong log nao kip ra.\n' +
            '        ket(137, \'SIGKILL (128+9) — khong bat duoc\', \'trong\');\n' +
            '      } else if (bayTerm) {\n' +
            '        ket(0, \'SIGTERM co trinh xu ly — xa xong roi thoat sach\', \'co: da dong sach\');\n' +
            '      } else {\n' +
            '        // PID 1 trong namespace BO QUA tin hieu co hanh dong mac dinh,\n' +
            '        // tru khi chinh no cai trinh xu ly. Nen no VAN SONG.\n' +
            '        vi = \'SIGTERM bi PID 1 bo qua — van song\';\n' +
            '      }\n' +
            '\n' +
            '    } else if (p[0] === \'stop\') {\n' +
            '      const giay = Number(p[2]);\n' +
            '      if (bayTerm) {\n' +
            '        ket(0, \'stop: SIGTERM duoc xu ly, thoat 0 ngay\', \'co: da dong sach\');\n' +
            '      } else {\n' +
            '        cho = giay;\n' +
            '        // Het an han thi runtime gui SIGKILL — 137, va mat dung `giay` giay.\n' +
            '        ket(137, `stop: PID 1 bo qua TERM, het ${giay}s thi bi SIGKILL`, \'trong\');\n' +
            '      }\n' +
            '\n' +
            '    } else if (p[0] === \'oom\') {\n' +
            '      ket(137, \'OOM killer — cung 137, nhung co co OOMKilled\', \'trong\');\n' +
            '      oom = true;\n' +
            '\n' +
            '    } else if (p[0] === \'v8-het-heap\') {\n' +
            '      // Tran heap cua V8: tien trinh TU chet va CO ghi lai ly do.\n' +
            '      ket(133, \'tran heap V8 — tien trinh tu ket thuc\', \'co: FATAL ERROR ... heap out of memory\');\n' +
            '\n' +
            '    } else if (p[0] === \'thoat\') {\n' +
            '      ket(Number(p[1]), \'ung dung tu thoat, ma di qua nguyen ven\');\n' +
            '    }\n' +
            '  }\n' +
            '\n' +
            '  if (ma === null) ma = song ? \'DANG CHAY\' : 0;\n' +
            '  return { ma, oom, log, cho, vi };\n' +
            '}\n';

const PT3_Q32_OUTPUT =
            'A [chay ung-dung ; bay TERM ; stop -t 10]                      ma=0         OOMKilled=khong cho=0s log=co: da dong sach                         stop: SIGTERM duoc xu ly, thoat 0 ngay\n' +
            'B [chay ung-dung ; stop -t 5]                                  ma=137       OOMKilled=khong cho=5s log=trong                                    stop: PID 1 bo qua TERM, het 5s thi bi SIGKILL\n' +
            'C [chay ung-dung ; tin-hieu KILL]                              ma=137       OOMKilled=khong cho=0s log=trong                                    SIGKILL (128+9) — khong bat duoc\n' +
            'D [chay ung-dung ; oom]                                        ma=137       OOMKilled=co    cho=0s log=trong                                    OOM killer — cung 137, nhung co co OOMKilled\n' +
            'E [chay ung-dung ; v8-het-heap]                                ma=133       OOMKilled=khong cho=0s log=co: FATAL ERROR ... heap out of memory   tran heap V8 — tien trinh tu ket thuc\n' +
            'F [chay thu-muc]                                               ma=126       OOMKilled=khong cho=0s log=trong                                    tim thay nhung khong chay duoc\n' +
            'G [chay khong-co-lenh]                                         ma=127       OOMKilled=khong cho=0s log=trong                                    khong tim thay lenh\n' +
            'H [docker-co-sai ; chay ung-dung]                              ma=125       OOMKilled=khong cho=0s log=trong                                    docker tu choi tuy chon — container chua he khoi dong\n' +
            'I [chay ung-dung ; bay TERM ; thoat 7]                         ma=7         OOMKilled=khong cho=0s log=trong                                    ung dung tu thoat, ma di qua nguyen ven\n' +
            'J [chay ung-dung ; tin-hieu TERM]                              ma=DANG CHAY OOMKilled=khong cho=0s log=trong                                    SIGTERM bi PID 1 bo qua — van song\n' +
            'K [chay ung-dung ; bay TERM ; tin-hieu TERM ; tin-hieu KILL]   ma=0         OOMKilled=khong cho=0s log=co: da dong sach                         SIGTERM co trinh xu ly — xa xong roi thoat sach\n' +
            'L [chay co-nhung-khong-x]                                      ma=126       OOMKilled=khong cho=0s log=trong                                    tim thay nhung khong chay duoc';

export default {
  course: { slug: 'deploy-vps' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8 to 11 (the small machine, monitoring, backups, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 8 đến 11 (cái máy nhỏ, giám sát, sao lưu, chẩn đoán)',
      ),
      description: B(
        'The last third of the Deploy VPS course: living on a small machine with the OOM killer and a disk that fills, the numbers that lie and the ones that do not, backups that only count once restored, and a diagnosis order for the deploy that just failed. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Deploy VPS: sống trên một cái máy nhỏ với OOM killer và một cái đĩa đang đầy dần, những con số nói dối và những con số thì không, sao lưu chỉ có giá trị khi đã phục hồi thử, và một thứ tự chẩn đoán cho lần deploy vừa hỏng. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–11'),
      course: { slug: 'deploy-vps' },
      questions: [

        /* ── Chương 8 — cái máy nhỏ (8 câu) ────────────────────────────── */

        // q1 · đáp án C
        mcq({
          prompt: B(
            'Two containers that both ended at exit code 137. Measured on Docker Engine 29.5.3:' +
            code('A) docker run --memory=256m --memory-swap=256m node … (xin 500 MB)\n' +
                 '   docker inspect → ExitCode=137 OOMKilled=true  Error=""\n' +
                 '   dong cuoi trong log ung dung: "da cap 200 MB, rss=244 MB"\n\n' +
                 'B) docker run -d … sleep 300 ; docker kill <ten>\n' +
                 '   docker inspect → ExitCode=137 OOMKilled=false Error=""') +
            'The exit codes are identical. Which field separates them, and why does the application log not help?',
            'Hai container cùng kết thúc ở mã thoát 137. Đo trên Docker Engine 29.5.3:' +
            code('A) docker run --memory=256m --memory-swap=256m node … (xin 500 MB)\n' +
                 '   docker inspect → ExitCode=137 OOMKilled=true  Error=""\n' +
                 '   dong cuoi trong log ung dung: "da cap 200 MB, rss=244 MB"\n\n' +
                 'B) docker run -d … sleep 300 ; docker kill <ten>\n' +
                 '   docker inspect → ExitCode=137 OOMKilled=false Error=""') +
            'Hai mã thoát y hệt nhau. Trường nào tách được chúng, và vì sao log ứng dụng không giúp được gì?',
          ),
          options: [
            B(
              '<code>State.Error</code> — it carries the reason, and it is empty in both rows only because the transcript was taken after the container was removed from the daemon\'s active list',
              '<code>State.Error</code> — nó mang theo lý do, và nó rỗng ở cả hai dòng chỉ vì đoạn terminal được lấy sau khi container đã bị gỡ khỏi danh sách đang hoạt động của daemon',
            ),
            B(
              'The last log line — 244 MB against a 256 MB limit is the signature, so reading the final RSS is how you tell an OOM kill from a deliberate one; <code>OOMKilled</code> is a convenience that repeats the same information',
              'Dòng log cuối — 244 MB trên một giới hạn 256 MB chính là chữ ký, nên đọc con số RSS cuối cùng là cách phân biệt một cú giết vì hết bộ nhớ với một cú giết có chủ đích; <code>OOMKilled</code> chỉ là tiện ích lặp lại cùng thông tin ấy',
            ),
            B(
              '<code>OOMKilled</code>. 137 is 128 + 9 = SIGKILL, which cannot be caught, blocked or handled — so the process got no opportunity to write anything, and its last log line is simply whatever it happened to be doing. Nothing in the application log will ever mention it',
              '<code>OOMKilled</code>. 137 là 128 + 9 = SIGKILL, thứ KHÔNG bắt được, không chặn được, không xử lý được — nên tiến trình chẳng có cơ hội nào ghi ra gì cả, và dòng log cuối của nó chỉ đơn giản là việc nó tình cờ đang làm. Sẽ KHÔNG BAO GIỜ có gì trong log ứng dụng nhắc tới chuyện đó',
            ),
            B(
              'Neither field is reliable: <code>OOMKilled</code> is set by the runtime from a cgroup counter that is shared between all containers on the host, so it can be true for a container that was killed for an unrelated reason while a neighbour hit its limit',
              'Chẳng trường nào đáng tin: <code>OOMKilled</code> được runtime đặt dựa trên một bộ đếm cgroup DÙNG CHUNG cho mọi container trên máy, nên nó có thể là true với một container bị giết vì lý do khác trong khi một container hàng xóm mới là cái chạm trần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The exit-code arithmetic is worth knowing outright: a shell reports a process killed by signal N as 128 + N, so 137 is SIGKILL, 143 is SIGTERM (your handler ran and the process chose to exit), 139 is SIGSEGV and 130 is Ctrl-C. The difference between 137 and 143 is the whole story of Chapter 3. And because SIGKILL cannot be caught, "the app just disappeared" has no explanation in the application log and never will — the explanation is in the kernel ring buffer (<code>dmesg</code>, or <code>journalctl -k</code> on a machine with systemd), which names the pid, the RSS and, critically, the constraint: <code>CONSTRAINT_MEMCG</code> means a cgroup limit was hit and the machine may have gigabytes free, while <code>CONSTRAINT_NONE</code> means the whole machine ran out. That distinction decides whether you change a container limit or buy RAM. One caveat about <code>dmesg</code>: it is a ring buffer, so this morning\'s OOM record may simply be gone by the afternoon.',
            'Phép tính mã thoát đáng thuộc lòng: shell báo một tiến trình bị giết bởi tín hiệu N thành 128 + N, nên 137 là SIGKILL, 143 là SIGTERM (trình xử lý của bạn ĐÃ chạy và tiến trình tự chọn thoát), 139 là SIGSEGV và 130 là Ctrl-C. Khác biệt giữa 137 và 143 chính là toàn bộ câu chuyện của Chương 3. Và vì SIGKILL không bắt được, câu "ứng dụng tự dưng biến mất" KHÔNG có lời giải thích nào trong log ứng dụng và sẽ không bao giờ có — lời giải thích nằm trong vòng đệm log của nhân (<code>dmesg</code>, hoặc <code>journalctl -k</code> trên máy có systemd), thứ gọi tên pid, RSS, và quan trọng nhất là RÀNG BUỘC: <code>CONSTRAINT_MEMCG</code> nghĩa là chạm trần một cgroup và cái máy có thể vẫn còn hàng gigabyte trống, còn <code>CONSTRAINT_NONE</code> nghĩa là cả cái máy đã cạn. Phân biệt ấy quyết định bạn đi đổi một giới hạn container hay đi mua thêm RAM. Một điều dặn về <code>dmesg</code>: nó là vòng đệm, nên bản ghi OOM của sáng nay tới chiều có thể đơn giản là không còn nữa.',
          ),
        }),

        // q2 · đáp án A
        mcq({
          prompt: B(
            'The same Node program, allocating on the V8 heap, run two ways. Measured three consecutive times on Node v22.23.1, identical results:' +
            code('A) --memory=1g,   node --max-old-space-size=128 …\n' +
                 '   FATAL ERROR: Reached heap limit Allocation failed -\n' +
                 '                JavaScript heap out of memory\n' +
                 '   → ma thoat 133\n\n' +
                 'B) --memory=256m, node (khong dat tran heap)\n' +
                 '   → ma thoat 137, so dong FATAL trong log: 0\n' +
                 '   dong cuoi: "vong 20 rss=210 MB"') +
            'The course says this case gives exit code 134. What does the measurement change, and what does it leave standing?',
            'Cùng một chương trình Node, cấp phát trên heap của V8, chạy theo hai cách. Đo ba lượt liên tiếp trên Node v22.23.1, kết quả không đổi:' +
            code('A) --memory=1g,   node --max-old-space-size=128 …\n' +
                 '   FATAL ERROR: Reached heap limit Allocation failed -\n' +
                 '                JavaScript heap out of memory\n' +
                 '   → ma thoat 133\n\n' +
                 'B) --memory=256m, node (khong dat tran heap)\n' +
                 '   → ma thoat 137, so dong FATAL trong log: 0\n' +
                 '   dong cuoi: "vong 20 rss=210 MB"') +
            'Giáo trình nói ca này cho mã thoát 134. Phép đo làm thay đổi điều gì, và giữ nguyên điều gì?',
          ),
          options: [
            B(
              'It changes only the number — 133 is 128 + 5 (SIGTRAP) rather than 128 + 6 (SIGABRT) — and leaves the lesson standing whole: setting the heap ceiling below the cgroup limit converts an unexplainable kill into a readable error that names the allocating step',
              'Nó chỉ đổi CON SỐ — 133 là 128 + 5 (SIGTRAP) chứ không phải 128 + 6 (SIGABRT) — và giữ nguyên vẹn bài học: đặt trần heap THẤP HƠN giới hạn cgroup là biến một cú giết KHÔNG GIẢI THÍCH ĐƯỢC thành một lỗi ĐỌC ĐƯỢC, có gọi tên bước đang cấp phát',
            ),
            B(
              'It overturns the lesson: 133 means the runtime trapped rather than aborted, so the heap ceiling did not actually stop the allocation and the process would have been OOM-killed a moment later anyway; the ceiling only changes which signal arrives first',
              'Nó lật ngược bài học: 133 nghĩa là runtime BẪY chứ không phải HUỶ, nên cái trần heap thật ra chưa chặn được phép cấp phát và tiến trình đằng nào cũng bị OOM giết một lát sau; cái trần chỉ đổi xem tín hiệu nào tới trước',
            ),
            B(
              'It shows the two runs are not comparable: A had a 1 GB container limit and B had 256 MB, so A never came close to the cgroup ceiling and the comparison measures the heap flag rather than the OOM killer',
              'Nó cho thấy hai lượt không so được với nhau: A có giới hạn container 1 GB còn B chỉ 256 MB, nên A chưa bao giờ tới gần trần cgroup và phép so ấy đang đo cái cờ heap chứ không đo OOM killer',
            ),
            B(
              'It shows the flag is unnecessary: B\'s last log line already names the loop iteration and the RSS, so the same diagnostic information is available without setting any ceiling, and 137 is simply the more honest code',
              'Nó cho thấy cái cờ ấy là thừa: dòng log cuối của B vốn đã gọi tên vòng lặp và con số RSS, nên vẫn có đúng thông tin chẩn đoán ấy mà chẳng cần đặt trần nào, và 137 chỉ đơn giản là mã thật thà hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<b>Measured, three consecutive runs, and the exam follows the machine.</b> The number in the course is out of date for this runtime and the argument it was supporting is untouched — which is the useful shape of a correction. The two rows are the whole point: A ends with a message that names what was allocating and a distinct exit code, while B ends with whatever the process happened to be printing and a code that tells you only that something died. Option C is worth reading carefully, because it names a real asymmetry in the fixture and draws the wrong conclusion from it: the 1 GB limit in A is deliberate — it exists to prove the heap ceiling fires <em>before</em> the cgroup does, which is the entire technique. Set <code>--max-old-space-size</code> below the container limit and you choose which failure you get. And the reason the default does not do this for you is the trap in the next question: V8 sizes its default heap from the host\'s total RAM, which inside a container is not the number that will kill you.',
            '<b>Đã đo, ba lượt liên tiếp, và đề THEO MÁY.</b> Con số trong giáo trình đã cũ so với runtime này, còn cái LẬP LUẬN mà nó chống đỡ thì không suy suyển — và đó mới là hình dạng có ích của một lần đính chính. Hai dòng ấy chính là toàn bộ ý nghĩa: A kết thúc bằng một thông báo GỌI TÊN thứ đang cấp phát cùng một mã thoát riêng, còn B kết thúc bằng bất cứ thứ gì tiến trình tình cờ đang in và một mã chỉ nói cho bạn biết rằng có cái gì đó đã chết. Phương án C đáng đọc kỹ, vì nó gọi tên một sự bất đối xứng CÓ THẬT trong bộ đồ nghề rồi rút ra kết luận sai từ đó: giới hạn 1 GB ở A là CÓ CHỦ ĐÍCH — nó tồn tại để chứng minh rằng trần heap nổ TRƯỚC trần cgroup, và đó chính là toàn bộ kỹ thuật. Đặt <code>--max-old-space-size</code> thấp hơn giới hạn container là bạn CHỌN được mình sẽ nhận cú hỏng nào. Còn lý do mặc định không tự làm điều đó giùm bạn nằm ở cái bẫy của câu kế tiếp: V8 tính kích thước heap mặc định từ TỔNG RAM CỦA MÁY CHỦ, mà bên trong một container thì đó không phải con số sẽ giết bạn.',
          ),
        }),

        // q3 · đáp án D
        mcq({
          prompt: B(
            'A build works on a laptop and exits 137 in a container on a 16 GB host with a 512 MB container limit. The build script sets no memory options at all. What is happening, and why is "it works on my machine" literally true here?',
            'Một bản dựng chạy tốt trên laptop và thoát 137 trong container, trên một máy chủ 16 GB với giới hạn container 512 MB. Script dựng không đặt tuỳ chọn bộ nhớ nào cả. Chuyện gì đang xảy ra, và vì sao câu "trên máy tôi chạy tốt mà" ở đây lại ĐÚNG theo nghĩa đen?',
          ),
          options: [
            B(
              'The container limit is applied to the cgroup but not to the runtime, and a runtime that allocates in large arenas can cross the limit between two checks; the fix is a smaller arena size rather than a heap ceiling',
              'Giới hạn container được áp lên cgroup chứ không áp lên runtime, và một runtime cấp phát theo những vùng lớn có thể vượt giới hạn giữa hai lần kiểm; cách chữa là giảm cỡ vùng cấp phát chứ không phải đặt trần heap',
            ),
            B(
              'The laptop has swap and the container does not, so the same peak that spills harmlessly to disk locally has nowhere to go in the container; adding a swap file to the host restores the laptop behaviour inside the container',
              'Laptop có swap còn container thì không, nên cùng một đỉnh mà ở máy cục bộ thì tràn xuống đĩa vô hại lại chẳng có chỗ nào để đi trong container; thêm một tệp swap trên máy chủ là khôi phục được hành vi của laptop bên trong container',
            ),
            B(
              'The build is genuinely bigger in the container because the image contains development dependencies the laptop had already pruned, so the peak is real and the fix is a multi-stage build',
              'Bản dựng trong container THẬT SỰ to hơn vì cái ảnh chứa các phụ thuộc phát triển mà laptop đã tỉa bớt từ trước, nên cái đỉnh ấy là có thật và cách chữa là một bản dựng nhiều tầng',
            ),
            B(
              'The runtime does not know it is in a container: it sizes its default heap from the host\'s total RAM, read from <code>/proc/meminfo</code>, which inside a container still reports the whole machine. So it plans for a multi-gigabyte heap and is killed long before it would consider a garbage collection',
              'Runtime KHÔNG BIẾT nó đang ở trong container: nó tính kích thước heap mặc định từ TỔNG RAM của máy chủ, đọc từ <code>/proc/meminfo</code>, mà bên trong container thì tệp ấy vẫn báo cả cái máy. Nên nó lên kế hoạch cho một cái heap cỡ nhiều gigabyte và bị giết từ lâu trước khi nó nghĩ tới chuyện dọn rác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the single most common cause of "it works on my machine, it exits 137 in the container", and the reason it is so confusing is that both halves of the sentence are true: on a laptop with 16 GB the same default heap ceiling is genuinely fine. The fix is one line — set <code>--max-old-space-size</code> explicitly, below the container limit — and it buys two things at once: the runtime collects garbage instead of growing, and when it does run out you get a readable error rather than a silent kill (Question 2). Option B describes a real difference that makes the symptom <em>worse</em> rather than causing it, and it also proposes the wrong lever: swap on the host does not help a container whose <code>--memory-swap</code> equals its <code>--memory</code> — see Question 4. Option C is worth ruling out deliberately during a real investigation, because sometimes it is the answer; the way to tell is to compare the peak (<code>memory.max_usage_in_bytes</code>, or <code>docker stats</code>) against the ceiling rather than to reason about it.',
            'Đây là nguyên nhân phổ biến nhất của câu "trên máy tôi chạy tốt, vào container thì thoát 137", và lý do nó gây rối là vì CẢ HAI vế của câu ấy đều đúng: trên một laptop 16 GB thì cùng cái trần heap mặc định ấy quả thật chẳng sao. Cách chữa là một dòng — đặt <code>--max-old-space-size</code> một cách tường minh, THẤP HƠN giới hạn container — và nó mua được hai thứ cùng lúc: runtime đi DỌN RÁC thay vì cứ phình ra, và khi nó thật sự cạn thì bạn nhận được một lỗi ĐỌC ĐƯỢC chứ không phải một cú giết im lặng (câu 2). Phương án B mô tả một khác biệt CÓ THẬT làm triệu chứng TỆ THÊM chứ không phải gây ra nó, và nó còn đề xuất nhầm cái cần gạt: swap trên máy chủ không giúp gì cho một container có <code>--memory-swap</code> bằng đúng <code>--memory</code> — xem câu 4. Phương án C thì đáng loại trừ MỘT CÁCH CÓ CHỦ ĐÍCH trong một cuộc điều tra thật, vì đôi khi nó chính là đáp án; cách phân biệt là ĐO cái đỉnh (<code>memory.max_usage_in_bytes</code>, hoặc <code>docker stats</code>) rồi so với cái trần, chứ không phải ngồi suy luận về nó.',
          ),
        }),

        // q4 · đáp án B
        mcq({
          prompt: B(
            'The same 500 MB allocation, twice. Measured on Docker Engine 29.5.3, Node v22.23.1:' +
            code('A) --memory=256m --memory-swap=256m\n' +
                 '   dong cuoi: "da cap 200 MB, rss=244 MB"   → ma thoat 137\n\n' +
                 'B) --memory=256m --memory-swap=768m\n' +
                 '   dong cuoi: "XONG 500 MB"                  → ma thoat 0') +
            'The host has swap available in both runs. What does the second flag actually control?',
            'Cùng một phép cấp phát 500 MB, hai lượt. Đo trên Docker Engine 29.5.3, Node v22.23.1:' +
            code('A) --memory=256m --memory-swap=256m\n' +
                 '   dong cuoi: "da cap 200 MB, rss=244 MB"   → ma thoat 137\n\n' +
                 'B) --memory=256m --memory-swap=768m\n' +
                 '   dong cuoi: "XONG 500 MB"                  → ma thoat 0') +
            'Máy chủ có sẵn swap ở cả hai lượt. Cái cờ thứ hai thật ra điều khiển cái gì?',
          ),
          options: [
            B(
              'The amount of swap the container may use, on top of its RAM allowance — so run A had 256 MB of RAM plus 256 MB of swap and still ran out, which is why 500 MB did not fit',
              'Lượng swap mà container được phép dùng, CỘNG THÊM vào phần RAM của nó — nên lượt A có 256 MB RAM cộng 256 MB swap mà vẫn cạn, và vì thế 500 MB không vừa',
            ),
            B(
              'The COMBINED memory-plus-swap ceiling. Setting it equal to <code>--memory</code> means the group gets no swap at all, which is exactly how a plain VPS with no swap file behaves — so run A was killed at the RAM ceiling while run B spilled the overflow to disk and finished',
              'Trần GỘP của bộ nhớ CỘNG swap. Đặt nó BẰNG <code>--memory</code> nghĩa là nhóm ấy KHÔNG có swap nào cả, đúng như cách một VPS trơn không có tệp swap hành xử — nên lượt A bị giết ngay ở trần RAM còn lượt B đẩy phần tràn xuống đĩa và chạy xong',
            ),
            B(
              'The point at which the kernel starts swapping rather than the ceiling: below 256 MB the container stays in RAM, above it pages begin moving out, so B simply set the threshold higher and the process never crossed it',
              'Cái NGƯỠNG mà nhân bắt đầu swap chứ không phải cái TRẦN: dưới 256 MB thì container ở lại trong RAM, trên mức đó thì các trang bắt đầu dời ra, nên B chỉ đơn giản đặt ngưỡng cao hơn và tiến trình chưa bao giờ vượt qua nó',
            ),
            B(
              'Nothing on a modern host: <code>--memory-swap</code> is a cgroup v1 setting that the v2 hierarchy ignores, and the difference between the two runs comes from B having a larger total allowance rather than from swap being enabled',
              'Chẳng gì cả trên một máy chủ hiện đại: <code>--memory-swap</code> là thiết lập của cgroup v1 mà phân cấp v2 bỏ qua, và khác biệt giữa hai lượt đến từ việc B có tổng hạn mức lớn hơn chứ không phải từ việc swap được bật',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two ceilings, and the second one is easy to miss: <code>--memory</code> is RAM, <code>--memory-swap</code> is RAM <em>plus</em> swap combined. Equal values mean zero swap for that group, which is a configuration people arrive at by copying both numbers from the same variable. The same trap exists one layer down in cgroup v1 (<code>memory.limit_in_bytes</code> and <code>memory.memsw.limit_in_bytes</code>) and is stated more clearly in v2, where <code>memory.max</code> and <code>memory.swap.max</code> are independent and <code>memory.swap.max=0</code> disables swap explicitly. Option A is the closest wrong answer and it is worth being precise about: 256 plus 256 would be 512 MB of allowance, and the run died at roughly 244 MB of RSS — which is what tells you the second number is not additive. What run B bought is real and it is not free: the process finished instead of dying, and reading back memory that had spilled to disk is enormously more expensive per page than reading RAM. That trade is the subject of the next question.',
            'Hai cái trần, và cái thứ hai rất dễ bỏ sót: <code>--memory</code> là RAM, còn <code>--memory-swap</code> là RAM CỘNG swap gộp lại. Đặt bằng nhau nghĩa là nhóm ấy có ZERO swap, một cấu hình mà người ta rơi vào bằng cách chép cả hai con số từ cùng một biến. Cùng cái bẫy ấy tồn tại ở tầng dưới trong cgroup v1 (<code>memory.limit_in_bytes</code> và <code>memory.memsw.limit_in_bytes</code>) và được phát biểu rõ ràng hơn ở v2, nơi <code>memory.max</code> và <code>memory.swap.max</code> độc lập với nhau và <code>memory.swap.max=0</code> tắt swap một cách tường minh. Phương án A là đáp án sai gần đúng nhất và đáng nói cho chính xác: 256 cộng 256 sẽ là hạn mức 512 MB, mà lượt chạy ấy chết ở khoảng 244 MB RSS — chính điều đó nói cho bạn biết con số thứ hai KHÔNG cộng thêm. Thứ mà lượt B mua được là có thật và nó không miễn phí: tiến trình chạy xong thay vì chết, còn việc đọc lại phần bộ nhớ đã tràn xuống đĩa thì đắt hơn đọc RAM một cách khủng khiếp trên mỗi trang. Cái đánh đổi ấy là chủ đề của câu kế tiếp.',
          ),
        }),

        // q5 · đáp án A + C (chọn HAI)
        mcq({
          prompt: B(
            'Swap on a small VPS. <b>Choose TWO</b> statements that are correct.' +
            code('doc lai 3 luot 200 MB (vua RAM)          : 0,14 – 0,28 ms\n' +
                 'doc lai 3 luot 400 MB (tran sang swap)   : 56 – 66 ms'),
            'Swap trên một VPS nhỏ. <b>Chọn HAI</b> phát biểu ĐÚNG.' +
            code('doc lai 3 luot 200 MB (vua RAM)          : 0,14 – 0,28 ms\n' +
                 'doc lai 3 luot 400 MB (tran sang swap)   : 56 – 66 ms'),
          ),
          options: [
            B(
              'A heavily swapping process is a worse state than a killed one: it answers every request correctly, eventually, so response times go from milliseconds to seconds while every health check stays green and nothing restarts anything',
              'Một tiến trình đang swap nặng là một trạng thái TỆ HƠN một tiến trình đã bị giết: nó trả lời đúng mọi request, rốt cuộc là thế, nên thời gian phản hồi đi từ mili giây lên hàng giây trong khi mọi chốt kiểm sức khoẻ vẫn XANH và chẳng có gì khởi động lại thứ gì',
            ),
            B(
              'The measurement shows swap is roughly 200 times slower in throughput, so a rule of thumb is that any workload touching more than its RAM allowance will run 200× slower end to end',
              'Phép đo cho thấy swap chậm hơn khoảng 200 lần về THÔNG LƯỢNG, nên một quy tắc ngón tay cái là mọi khối việc chạm quá phần RAM được cấp sẽ chạy chậm hơn 200 lần từ đầu tới cuối',
            ),
            B(
              'The number to alert on is the RATE, not the amount: <code>si</code> and <code>so</code> in <code>vmstat 1</code> moving constantly is thrashing, while a large <code>swpd</code> with both at zero is healthy — it means genuinely idle pages left RAM',
              'Con số đáng báo động là NHỊP, không phải LƯỢNG: hai cột <code>si</code> và <code>so</code> trong <code>vmstat 1</code> chạy liên tục là thrashing, còn một con số <code>swpd</code> lớn mà cả hai cột đều bằng 0 thì LÀNH MẠNH — nó nghĩa là những trang thật sự đang rỗi đã rời khỏi RAM',
            ),
            B(
              'Sizing swap generously is the cheap fix: 8 GB of swap on a 1 GB machine gives you 9 GB of usable memory, which is why a swap file is the first thing to add when a build is being OOM-killed',
              'Cấp swap rộng tay là cách chữa rẻ: 8 GB swap trên một máy 1 GB cho bạn 9 GB bộ nhớ dùng được, và đó là lý do một tệp swap là thứ đầu tiên nên thêm khi một bản dựng đang bị OOM giết',
            ),
            B(
              'A swap file may be world-readable because the kernel encrypts pages on the way out; the <code>chmod 600</code> that <code>swapon</code> asks for is a convention inherited from systems without that encryption',
              'Một tệp swap để ai cũng đọc được cũng không sao vì nhân đã mã hoá các trang trên đường ra; cái <code>chmod 600</code> mà <code>swapon</code> đòi chỉ là quy ước thừa hưởng từ những hệ thống không có phần mã hoá đó',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'The whole argument for swap on a small machine is that it lets genuinely idle pages leave RAM, which is real headroom for free — and the whole argument against sizing it as a second RAM is that thrashing is the one state nothing catches. A killed process is loud: exit 137, the supervisor restarts it, monitoring notices, somebody looks. A swapping one is alive, answering, and unusably slow, and the connection pool fills with requests that are technically still running. That is why the alerting signal is the rate rather than the amount. Option B misreads the measurement badly enough to be worth naming: the loop touches two bytes per megabyte, so it is measuring <em>page faults</em> rather than throughput — every touched page that lives on disk has to be read back before the instruction can complete, and the process is stopped while that happens. Do not extrapolate the raw ratio to bandwidth. Option E inverts a real safety property: swap holds whatever was in memory — session tokens, decrypted secrets, request bodies — so <code>swapon</code> refuses a world-readable file, and that is also the caveat attached to Chapter 4\'s advice about secrets in environment variables.',
            'Toàn bộ lý lẽ ủng hộ swap trên một máy nhỏ là nó cho những trang THẬT SỰ đang rỗi rời khỏi RAM, và đó là khoảng thở có thật, miễn phí — còn toàn bộ lý lẽ chống lại việc cấp nó như một RAM thứ hai là vì THRASHING là cái trạng thái duy nhất mà chẳng gì bắt được. Một tiến trình bị giết thì ỒN ÀO: mã 137, trình giám sát khởi động lại nó, hệ thống theo dõi ghi nhận, có người ngó vào. Một tiến trình đang swap thì SỐNG, ĐANG TRẢ LỜI, và chậm tới mức không dùng nổi, còn bể kết nối thì đầy dần bằng những request về mặt kỹ thuật vẫn đang chạy. Vì thế tín hiệu để báo động là NHỊP chứ không phải LƯỢNG. Phương án B đọc sai phép đo tới mức đáng gọi tên: vòng lặp chạm hai byte trên mỗi megabyte, nên nó đang đo LỖI TRANG chứ không đo thông lượng — mỗi trang được chạm mà đang nằm trên đĩa đều phải được đọc về trước khi lệnh hoàn tất, và tiến trình bị DỪNG trong lúc đó. Đừng ngoại suy tỉ lệ thô ấy sang băng thông. Phương án E lộn ngược một tính chất an toàn có thật: swap giữ bất cứ thứ gì đang nằm trong bộ nhớ — token phiên, bí mật đã giải mã, thân request — nên <code>swapon</code> TỪ CHỐI một tệp ai cũng đọc được, và đó cũng là lời dặn đi kèm lời khuyên của Chương 4 về bí mật nằm trong biến môi trường.',
          ),
        }),

        // q6 · đáp án D
        mcq({
          prompt: B(
            'A service is repeatedly OOM-killed under load. Its unit has:' +
            code('[Service]\n' +
                 'Restart=always\n' +
                 'MemoryMax=512M'),
            'Which change makes the machine behave better under the same load, and why?',
            'Một dịch vụ liên tục bị OOM giết khi có tải. Unit của nó có:' +
            code('[Service]\n' +
                 'Restart=always\n' +
                 'MemoryMax=512M'),
            'Thay đổi nào làm cái máy hành xử TỐT HƠN dưới cùng mức tải ấy, và vì sao?',
          ),
          options: [
            B(
              'Raise <code>MemoryMax</code> to the machine\'s physical memory, because a cgroup ceiling set below what the workload genuinely needs converts a spike the machine could have absorbed into a kill; the kernel still protects the machine as a whole through the global OOM killer, so nothing is given up by removing the per-service limit',
              'Nâng <code>MemoryMax</code> lên bằng bộ nhớ vật lý của máy, vì một cái trần cgroup đặt thấp hơn nhu cầu thật của khối việc sẽ biến một đợt tăng vọt mà cái máy vốn hấp thụ được thành một cú giết; nhân vẫn bảo vệ cả cái máy nói chung thông qua OOM killer toàn cục, nên bỏ cái giới hạn theo từng dịch vụ đi thì chẳng đánh mất gì',
            ),
            B(
              'Set <code>OOMScoreAdjust=-1000</code> on this unit so the kernel picks something else; it is one line in the unit file, it costs nothing at run time, it needs no privileges because systemd applies it on the service&#39;s behalf, and it moves the kill to whichever process is next largest — which on this machine is the thing that can be re-run',
              'Đặt <code>OOMScoreAdjust=-1000</code> cho unit này để nhân chọn thứ khác; nó là một dòng trong tệp unit, chẳng tốn gì lúc chạy, không cần quyền gì vì systemd áp nó thay mặt dịch vụ, và nó dời cú giết sang tiến trình lớn kế tiếp — mà trên cái máy này thì đó là thứ chạy lại được',
            ),
            B(
              'Change <code>Restart=always</code> to <code>Restart=no</code>, because a service that stays down after an OOM is the only configuration that cannot thrash, and a human restart is the correct gate for a memory problem',
              'Đổi <code>Restart=always</code> thành <code>Restart=no</code>, vì một dịch vụ nằm im sau một cú OOM là cấu hình DUY NHẤT không thể thrash, và một lần khởi động lại thủ công mới là cái chốt đúng cho một vấn đề bộ nhớ',
            ),
            B(
              'Add <code>MemoryHigh=400M</code> plus <code>StartLimitIntervalSec</code> and <code>StartLimitBurst</code> in <code>[Unit]</code>. <code>MemoryHigh</code> throttles a process over the line and pushes it to reclaim rather than killing it, and the start limit stops <code>Restart=always</code> turning one spike into a loop where every cycle drops connections and rebuilds caches',
              'Thêm <code>MemoryHigh=400M</code> cộng với <code>StartLimitIntervalSec</code> và <code>StartLimitBurst</code> đặt trong mục <code>[Unit]</code>. <code>MemoryHigh</code> BÓP một tiến trình vượt vạch cho chậm lại và ép nó thu hồi bộ nhớ thay vì giết nó, còn cái van giới hạn khởi động thì chặn <code>Restart=always</code> biến một đợt tăng vọt thành một VÒNG LẶP mà mỗi vòng đều rớt kết nối và dựng lại bộ đệm',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>MemoryHigh</code> is the gentle ceiling and it is the one people do not know about: a process over that line gets throttled and pushed to reclaim rather than removed, so a service that briefly spikes is slowed down instead of killed — almost always what you want for something you cannot afford to lose. The start limit is the other half, and it is the same trap Chapter 3 measured from the systemd side: <code>Restart=always</code> plus an OOM turns a spike into a loop, each cycle more expensive than the last, and the machine degrades under a load it could otherwise have absorbed. A service that is honestly down is easier to diagnose than one that is up for four seconds at a time. Note where those two directives go — <code>[Unit]</code>, not <code>[Service]</code> — because a directive in the wrong section is <em>ignored rather than rejected</em>, and <code>systemd-analyze verify</code> is the only thing that tells you. Option B is a real technique pointed the wrong way: <code>-1000</code> belongs on the service you cannot afford to lose (the database), and the corresponding move for a temporary job is to raise its <em>own</em> score to <code>+1000</code>, which needs no privileges at all. Option C over-corrects: staying down forever after one transient spike is its own outage.',
            '<code>MemoryHigh</code> là cái trần MỀM và nó là thứ người ta hay không biết: một tiến trình vượt vạch ấy bị BÓP cho chậm lại và bị ép thu hồi bộ nhớ chứ không bị gỡ bỏ, nên một dịch vụ tăng vọt trong chốc lát thì bị làm chậm thay vì bị giết — gần như luôn là thứ bạn muốn với một thứ bạn không đủ sức để mất. Cái van giới hạn khởi động là nửa còn lại, và nó cũng chính cái bẫy mà Chương 3 đã đo từ phía systemd: <code>Restart=always</code> cộng một cú OOM biến một đợt tăng vọt thành một VÒNG LẶP, mỗi vòng đắt hơn vòng trước, và cái máy xuống cấp dưới một mức tải mà lẽ ra nó hấp thụ được. Một dịch vụ THẬT THÀ nằm im thì dễ chẩn đoán hơn một dịch vụ cứ sống được bốn giây một lần. Hãy để ý hai chỉ thị ấy đặt Ở ĐÂU — mục <code>[Unit]</code>, không phải <code>[Service]</code> — vì một chỉ thị đặt sai mục thì bị PHỚT LỜ chứ không bị TỪ CHỐI, và <code>systemd-analyze verify</code> là thứ duy nhất nói cho bạn biết. Phương án B là một kỹ thuật có thật nhưng chĩa nhầm hướng: <code>-1000</code> thuộc về dịch vụ bạn không đủ sức để mất (cơ sở dữ liệu), còn nước cờ tương ứng cho một việc TẠM THỜI là NÂNG điểm của CHÍNH NÓ lên <code>+1000</code>, thứ chẳng cần quyền gì cả. Phương án C thì sửa quá tay: nằm im vĩnh viễn sau một đợt tăng vọt thoáng qua tự nó đã là một sự cố.',
          ),
        }),

        // q7 · đáp án B
        mcq({
          prompt: B(
            'A freshly formatted ext4 filesystem, measured with <code>tune2fs -l</code> and <code>df -h</code>:' +
            code('Block count:          176128\n' +
                 'Reserved block count:   8806\n' +
                 'Block size:             1024\n\n' +
                 'df -h → 156M tong, 14K dung, 144M trong, 1%') +
            'Someone proposes <code>tune2fs -m 0</code> on every filesystem "to stop wasting 5%". Where is that right and where is it dangerous?',
            'Một hệ tệp ext4 vừa được định dạng, đo bằng <code>tune2fs -l</code> và <code>df -h</code>:' +
            code('Block count:          176128\n' +
                 'Reserved block count:   8806\n' +
                 'Block size:             1024\n\n' +
                 'df -h → 156M tong, 14K dung, 144M trong, 1%') +
            'Ai đó đề xuất chạy <code>tune2fs -m 0</code> trên mọi hệ tệp "để khỏi phí 5%". Chỗ nào đúng và chỗ nào nguy hiểm?',
          ),
          options: [
            B(
              'It is right everywhere on a modern kernel: the reserve was designed for filesystems that fragment badly under pressure, which ext4 does not, so the 5% is legacy and reclaiming it has no downside',
              'Nó đúng ở mọi nơi trên một nhân hiện đại: phần dự trữ được thiết kế cho những hệ tệp phân mảnh nặng khi bị ép, mà ext4 thì không, nên 5% ấy là di sản và thu hồi nó chẳng có mặt trái nào',
            ),
            B(
              'Right on a data disk, where the reserve is simply unusable space; dangerous on the root filesystem, where it is deliberate — it is the reason a "full" server still lets you log in and delete something. Set it to zero on <code>/</code> and a runaway log file locks you out of your own machine',
              'Đúng trên một đĩa DỮ LIỆU, nơi phần dự trữ chỉ là chỗ trống không dùng được; NGUY HIỂM trên hệ tệp GỐC, nơi nó là CÓ CHỦ ĐÍCH — nó chính là lý do một máy chủ "đầy" vẫn cho bạn đăng nhập vào và xoá thứ gì đó. Đặt nó về 0 trên <code>/</code> thì một tệp log chạy loạn sẽ nhốt bạn ra ngoài chính cái máy của mình',
            ),
            B(
              'It is dangerous everywhere, because the reserve is what the journal writes into; setting it to zero on any ext4 filesystem risks a corrupt journal on the next unclean shutdown',
              'Nó nguy hiểm ở mọi nơi, vì phần dự trữ chính là chỗ mà journal ghi vào; đặt nó về 0 trên bất kỳ hệ tệp ext4 nào cũng là mạo hiểm với một journal hỏng ở lần tắt máy không sạch kế tiếp',
            ),
            B(
              'The premise is wrong: the reserve is not counted as used, so it is already visible as free space in <code>df</code> and there is nothing to reclaim; the 8,806 blocks are an accounting figure only',
              'Tiền đề đã sai: phần dự trữ không bị tính là ĐÃ DÙNG, nên nó vốn đã hiện ra là chỗ trống trong <code>df</code> và chẳng có gì để thu hồi cả; 8.806 khối kia chỉ là một con số kế toán',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: 8,806 of 176,128 blocks is exactly 5.0%, and it is why the "available" column in <code>df</code> is smaller than "size minus used". On a disk holding uploads or backups that space does nothing for you and <code>tune2fs -m 1</code> (or 0) is a legitimate reclaim. On <code>/</code> it is the margin that keeps a full machine recoverable, and it is worth knowing what that recovery looks like: deleting works when writing does not, because removing a directory entry does not need a new block, and the freed space is usable at once. That is the practical shape of a full disk — not a clean stop but an arbitrary boundary where a small append succeeds and a 1 MB write fails with <code>ENOSPC</code>, so every piece of software on the machine crosses it at a different moment and you get a scattering of unrelated-looking errors rather than one clear failure. Option D is close enough to be worth refuting precisely: <code>df</code> reports the reserve as neither used nor available, which is why the three columns do not add up and why a non-root process hits <code>ENOSPC</code> while <code>df</code> still shows a percentage below 100.',
            'Đã đo: 8.806 trên 176.128 khối đúng bằng 5,0%, và đó là lý do cột "available" trong <code>df</code> nhỏ hơn "size trừ used". Trên một đĩa chứa tệp tải lên hay bản sao lưu thì chỗ ấy chẳng làm gì cho bạn và <code>tune2fs -m 1</code> (hoặc 0) là một cú thu hồi chính đáng. Trên <code>/</code> thì nó là biên độ giữ cho một cái máy đầy vẫn cứu được, và cũng đáng biết cú cứu ấy trông thế nào: XOÁ thì chạy trong khi GHI thì không, vì gỡ một thẻ thư mục không cần một khối mới, và chỗ vừa giải phóng dùng được NGAY. Đó chính là hình dạng thực tế của một cái đĩa đầy — không phải một cú dừng gọn ghẽ mà là một cái ranh giới TUỲ TIỆN, nơi một lần ghi nối thêm ngắn thì thành công còn một lần ghi 1 MB thì hỏng với <code>ENOSPC</code>, nên mọi phần mềm trên máy vượt qua ranh giới ấy vào những thời điểm khác nhau và bạn nhận được một mớ lỗi trông chẳng liên quan gì tới nhau thay vì một cú hỏng rõ ràng. Phương án D gần đúng tới mức đáng bác cho chính xác: <code>df</code> báo phần dự trữ là KHÔNG dùng và cũng KHÔNG khả dụng, và đó là lý do ba cột không cộng lại khớp nhau, cũng là lý do một tiến trình không phải root đụng <code>ENOSPC</code> trong khi <code>df</code> vẫn hiện một tỉ lệ dưới 100%.',
          ),
        }),

        // q8 · đáp án C
        mcq({
          prompt: B(
            'Two build processes, each peaking around 170 MB, run sequentially and then in parallel. Measured at two ceilings (numbers from the course):' +
            code('=== tran 300 MB ===\n' +
                 '  TUAN TU  : ca hai xong  | 779 ms | dinh cgroup 138 MB\n' +
                 '  SONG SONG: ca hai xong  | 216 ms | dinh cgroup 270 MB\n\n' +
                 '=== tran 200 MB, KHONG swap (giong mot VPS tron) ===\n' +
                 '  TUAN TU  : 0 / 0        | 283 ms | dinh 138 MB\n' +
                 '  SONG SONG: 0 / 137      | 632 ms | dinh 200 MB') +
            'Which sentence is the one worth taking away from the second block?',
            'Hai tiến trình dựng, mỗi cái đạt đỉnh khoảng 170 MB, chạy tuần tự rồi chạy song song. Đo ở hai mức trần (số lấy từ giáo trình):' +
            code('=== tran 300 MB ===\n' +
                 '  TUAN TU  : ca hai xong  | 779 ms | dinh cgroup 138 MB\n' +
                 '  SONG SONG: ca hai xong  | 216 ms | dinh cgroup 270 MB\n\n' +
                 '=== tran 200 MB, KHONG swap (giong mot VPS tron) ===\n' +
                 '  TUAN TU  : 0 / 0        | 283 ms | dinh 138 MB\n' +
                 '  SONG SONG: 0 / 137      | 632 ms | dinh 200 MB') +
            'Câu nào là câu đáng mang đi từ khối thứ hai?',
          ),
          options: [
            B(
              'That the ceiling was simply too low: 270 MB is the honest peak of this workload, so the correct action is to raise the limit to 300 MB and keep the 3.6× speed-up, which is what the first block already demonstrates',
              'Rằng cái trần đơn giản là quá thấp: 270 MB mới là đỉnh thật thà của khối việc này, nên hành động đúng là nâng giới hạn lên 300 MB và giữ lấy khoản nhanh gấp 3,6 lần, đúng như khối thứ nhất vốn đã cho thấy',
            ),
            B(
              'That parallelism traded memory for speed and the trade was worth it right up to the ceiling: 216 ms against 779 ms is a real saving, and 632 ms is the cost of hitting a limit once rather than an argument against the strategy',
              'Rằng chạy song song đã đánh đổi bộ nhớ lấy tốc độ và cuộc đổi chác ấy XỨNG ĐÁNG cho tới đúng cái trần: 216 ms so với 779 ms là một khoản tiết kiệm có thật, còn 632 ms chỉ là cái giá của một lần chạm giới hạn chứ không phải một lý lẽ chống lại chiến lược ấy',
            ),
            B(
              'That parallelism lost on BOTH axes here: the frontend build died with 137 and the whole thing took 632 ms — more than twice the sequential run it was supposed to beat — because a killed build is wasted work and the wall clock includes the time spent doing it',
              'Rằng chạy song song ở đây THUA TRÊN CẢ HAI TRỤC: bản dựng frontend chết với mã 137 và tổng cộng tốn 632 ms — hơn gấp đôi lượt tuần tự mà nó lẽ ra phải thắng — vì một bản dựng bị giết là công sức đổ sông đổ biển, mà đồng hồ treo tường thì tính cả quãng thời gian đổ đi ấy',
            ),
            B(
              'That the peak figure is the number to watch and the exit code is noise: 200 MB against a 200 MB ceiling means the group touched its limit exactly, which is the intended behaviour of a cgroup and not a failure',
              'Rằng con số ĐỈNH mới là thứ đáng theo dõi còn mã thoát chỉ là nhiễu: 200 MB trên một cái trần 200 MB nghĩa là nhóm ấy chạm đúng giới hạn của nó, đó là hành vi ĐƯỢC THIẾT KẾ của một cgroup chứ không phải một cú hỏng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the incident this repository documents, reproduced deliberately. Its notes are unambiguous about the conclusion it reached the expensive way: builds are sequential in the deploy script as an OOM guard for the 6 GB VPS, because parallel cold builds killed <code>next build</code> with exit 137. And the note adds the part people forget — with a warm cache both builds are near-instant no-ops anyway, so sequencing them costs almost nothing on the runs where speed would have mattered. Option A is a legitimate response when you control the ceiling, and it is exactly what you cannot do on a machine that also serves traffic: the database is already the largest process on the box by design, the application and the proxy are resident, and a build lands on top of all of it. The four options in order of preference are: build somewhere else entirely, so the artifact arrives finished and the build cache never lands on the data disk; build on the server sequentially; build on the server with a raised <code>oom_score_adj</code> so that if it must compete, at least it loses; and build in parallel, which was measured to be both slower and fatal on a small box.',
            'Đây chính là sự cố mà kho mã này ghi lại, được tái hiện có chủ đích. Ghi chú của nó nói rõ ràng về kết luận mà nó rút ra bằng con đường đắt tiền: các bản dựng trong script deploy là TUẦN TỰ như một cái chốt chống OOM cho cái VPS 6 GB, vì dựng song song với bộ đệm nguội đã giết <code>next build</code> bằng mã 137. Và ghi chú ấy thêm phần người ta hay quên — với bộ đệm đang ấm thì cả hai bản dựng gần như là lệnh rỗng chạy tức thì, nên xếp chúng tuần tự gần như chẳng tốn gì ở đúng những lượt mà tốc độ lẽ ra có ý nghĩa. Phương án A là một phản ứng chính đáng KHI bạn kiểm soát được cái trần, và nó đúng là thứ bạn KHÔNG làm được trên một cái máy đồng thời đang phục vụ khách: cơ sở dữ liệu vốn đã là tiến trình lớn nhất trên máy theo thiết kế, ứng dụng và proxy thì thường trú, và một bản dựng đáp xuống trên tất cả những thứ đó. Bốn lựa chọn theo thứ tự ưu tiên là: dựng ở NƠI KHÁC hẳn, để tạo tác về tới nơi là đã xong và bộ đệm dựng không bao giờ đáp xuống đĩa dữ liệu; dựng trên máy chủ theo lối tuần tự; dựng trên máy chủ với <code>oom_score_adj</code> được nâng lên, để nếu buộc phải cạnh tranh thì ít ra nó là bên THUA; và dựng song song, thứ đã đo được là vừa chậm hơn vừa chí mạng trên một cái máy nhỏ.',
          ),
        }),

        /* ── Chương 9 — giám sát (8 câu) ───────────────────────────────── */

        // q9 · đáp án A
        mcq({
          prompt: B(
            'Four cores pinned at 100% from t=0, so the true load is 4.00. Sampling both numbers every ten seconds (from the course):' +
            code('t=  0s  load=0.10 0.12 0.09   CPU_ban=100.0%\n' +
                 't= 20s  load=1.21 0.37 0.18   CPU_ban=100.0%\n' +
                 't= 40s  load=2.07 0.62 0.26   CPU_ban=100.0%\n' +
                 't= 60s  load=2.62 0.84 0.34   CPU_ban=100.0%') +
            'Is the load average broken, and what is it good for?',
            'Bốn nhân bị ghim 100% từ t=0, nên tải thật là 4,00. Lấy mẫu cả hai con số mỗi mười giây (lấy từ giáo trình):' +
            code('t=  0s  load=0.10 0.12 0.09   CPU_ban=100.0%\n' +
                 't= 20s  load=1.21 0.37 0.18   CPU_ban=100.0%\n' +
                 't= 40s  load=2.07 0.62 0.26   CPU_ban=100.0%\n' +
                 't= 60s  load=2.62 0.84 0.34   CPU_ban=100.0%') +
            'Load average có hỏng không, và nó tốt cho việc gì?',
          ),
          options: [
            B(
              'It is not broken — it is an exponentially-weighted moving average with time constants of 1, 5 and 15 minutes, so by construction it describes the past. Good for "was yesterday busier than today", useless for "is something wrong right now"',
              'Nó KHÔNG hỏng — nó là một trung bình động có trọng số mũ với hằng số thời gian 1, 5 và 15 phút, nên theo đúng cấu tạo, nó MÔ TẢ QUÁ KHỨ. Tốt cho câu "hôm qua có bận hơn hôm nay không", vô dụng với câu "ngay bây giờ có gì đang hỏng không"',
            ),
            B(
              'It is broken on Linux specifically, because Linux counts uninterruptible tasks as runnable; a machine pinned on CPU alone therefore under-reports, and the fix is to read <code>/proc/pressure/cpu</code> instead',
              'Nó hỏng riêng trên Linux, vì Linux đếm cả các tác vụ không-ngắt-được là đang-chạy-được; nên một cái máy chỉ bị ghim CPU sẽ báo THIẾU, và cách chữa là đọc <code>/proc/pressure/cpu</code> thay cho nó',
            ),
            B(
              'It is correct and the CPU figure is the misleading one: 100% busy over a one-second sample is meaningless on a four-core machine, and the load average is converging on the true value of 4.00 from below',
              'Nó ĐÚNG và con số CPU mới là thứ đánh lừa: 100% bận trên một mẫu một giây là vô nghĩa trên một máy bốn nhân, còn load average thì đang tiệm cận giá trị thật 4,00 từ phía dưới',
            ),
            B(
              'Both are wrong here: the sampling interval is shorter than the shortest time constant, so neither number has stabilised, and any conclusion drawn before five minutes have elapsed is an artefact of the measurement',
              'Cả hai đều sai ở đây: khoảng lấy mẫu ngắn hơn hằng số thời gian nhỏ nhất, nên chưa con số nào ổn định, và mọi kết luận rút ra trước khi trôi qua năm phút đều là tạo tác của phép đo',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the first row: the machine is completely saturated and the one-minute figure says 0.10. Sixty seconds into a total CPU outage it has reached 2.62 against a true value of 4.00, and the fifteen-minute figure is still 0.34. If your alerting looks at load average, your first notification arrives long after your users did. That is not a bug; it is what a moving average is. The number that is as current as your sample interval is CPU busy computed from <code>/proc/stat</code>, and computing it correctly needs two readings and a subtraction, because every field there is a cumulative counter since boot: <code>100 × (Δtotal − Δidle) / Δtotal</code>. A single reading of any file in <code>/proc</code> is meaningless for a rate, which is the mistake people make on their first monitoring script — they read <code>/proc/diskstats</code>, see a huge number, and report it as throughput. Option B misdescribes a real Linux peculiarity: Linux does count uninterruptible tasks, which makes load average <em>inflate</em> during disk waits rather than under-report, and <code>/proc/pressure/*</code> is a genuinely better signal for "is this resource hurting me" — just not for the reason given.',
            'Hãy đọc dòng đầu tiên: cái máy đã bão hoà hoàn toàn và con số một phút nói 0,10. Sáu mươi giây sau khi CPU chết hẳn, nó mới bò tới 2,62 so với giá trị thật là 4,00, còn con số mười lăm phút thì vẫn ở 0,34. Nếu hệ thống báo động của bạn nhìn vào load average thì thông báo đầu tiên tới tay bạn muộn hơn người dùng của bạn rất lâu. Đó không phải một con bọ; đó ĐÚNG LÀ bản chất của một trung bình động. Con số CẬP NHẬT ngang với khoảng lấy mẫu của bạn là phần trăm CPU bận tính từ <code>/proc/stat</code>, và tính nó cho đúng cần HAI lần đọc và một phép trừ, vì mọi trường ở đó đều là bộ đếm CỘNG DỒN từ lúc khởi động: <code>100 × (Δtổng − Δidle) / Δtổng</code>. Một lần đọc duy nhất bất kỳ tệp nào trong <code>/proc</code> đều vô nghĩa nếu muốn tính một NHỊP, và đó là sai lầm ai cũng mắc ở script giám sát đầu tiên của mình — họ đọc <code>/proc/diskstats</code>, thấy một con số khổng lồ, rồi báo cáo nó như một thông lượng. Phương án B mô tả sai một đặc thù CÓ THẬT của Linux: Linux ĐÚNG LÀ có đếm các tác vụ không-ngắt-được, và điều đó làm load average PHỒNG LÊN trong lúc chờ đĩa chứ không phải báo thiếu, còn <code>/proc/pressure/*</code> thì đúng là một tín hiệu tốt hơn cho câu "tài nguyên này có đang làm tôi đau không" — chỉ là không phải vì cái lý do được nêu ra.',
          ),
        }),

        // q10 · đáp án D
        mcq({
          prompt: B(
            'A cheap VPS. The application is slow, the CPU graph shows plenty of idle, and nothing in the application has changed. One field of <code>/proc/stat</code> is at 14%:' +
            code('cpu  122445 0 42571 43650101 4373 0 33630 0 0 0\n' +
                 '     user nice system idle iowait irq softirq steal guest guest_nice'),
            'Which field is worth reading here, and what does a persistently high value mean for you?',
            'Một cái VPS rẻ tiền. Ứng dụng chậm, đồ thị CPU vẫn còn đầy phần rảnh, và chẳng có gì trong ứng dụng thay đổi cả. Một trường của <code>/proc/stat</code> đang ở mức 14%:' +
            code('cpu  122445 0 42571 43650101 4373 0 33630 0 0 0\n' +
                 '     user nice system idle iowait irq softirq steal guest guest_nice'),
            'Trường nào đáng đọc ở đây, và một giá trị cao dai dẳng có nghĩa gì với bạn?',
          ),
          options: [
            B(
              '<code>iowait</code>, field five — time the CPU spent idle with a disk request outstanding; persistently high with a low run queue means the disk is the bottleneck, and the fix is faster storage, fewer synchronous writes, or moving whatever is competing for it off this machine entirely',
              '<code>iowait</code>, trường thứ năm — thời gian CPU ngồi rảnh trong khi còn một yêu cầu đĩa chưa xong; cao dai dẳng kèm hàng đợi chạy thấp nghĩa là đĩa là nút thắt cổ chai, và cách chữa là ổ nhanh hơn, bớt ghi đồng bộ, hoặc dời hẳn thứ đang tranh giành nó ra khỏi cái máy này',
            ),
            B(
              '<code>softirq</code>, field seven — time spent in deferred interrupt handling; on a virtual machine this is dominated by the network stack, so a high value points at packet volume rather than at the application',
              '<code>softirq</code>, trường thứ bảy — thời gian dành cho xử lý ngắt hoãn lại; trên một máy ảo thì phần này bị ngăn xếp mạng chi phối, nên giá trị cao trỏ vào lưu lượng gói tin chứ không phải vào ứng dụng',
            ),
            B(
              '<code>system</code>, field three — time in the kernel on your behalf; a high ratio of system to user time means the workload is syscall-bound, which on a VPS usually means the container runtime is intercepting them',
              '<code>system</code>, trường thứ ba — thời gian ở trong nhân thay mặt bạn; tỉ lệ system trên user cao nghĩa là khối việc bị chặn bởi lời gọi hệ thống, mà trên một VPS thì thường nghĩa là runtime container đang chặn bắt chúng',
            ),
            B(
              '<code>steal</code>, field eight — time your virtual CPU was ready to run and the hypervisor gave the physical core to somebody else. Persistently in double digits means the problem is your neighbours, and no amount of optimisation on your side will fix it: that is a conversation with the provider, or a different machine',
              '<code>steal</code>, trường thứ tám — thời gian CPU ảo của bạn ĐÃ SẴN SÀNG chạy mà bộ giám sát máy ảo lại đưa nhân vật lý cho người khác. Ở mức hai chữ số một cách dai dẳng thì vấn đề là HÀNG XÓM của bạn, và mọi nỗ lực tối ưu ở phía bạn đều vô ích: đó là một cuộc nói chuyện với nhà cung cấp, hoặc một cái máy khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Steal produces the most confusing possible symptom, and it is the one field of <code>/proc/stat</code> that most people have never looked at: your application is slow, your CPU graph shows idle, and nothing you own is at fault. On an oversubscribed host it can be double digits, and the only actions available are external. <code>iowait</code> is the other field worth knowing and it is a genuine alternative reading — high <code>iowait</code> with a low run queue means waiting on disk, which is what <code>vmstat 1</code>\'s <code>wa</code> column shows, and it is the diagnosis for a slow query, a backup running, or a failing disk. The reason to read these from <code>/proc/stat</code> rather than from a tool is the same reason as everywhere in this chapter: two samples and a subtraction, because the fields are cumulative. And one cost worth knowing before you write the loop: reading these files in-process is essentially free (measured at 0.008–0.016 ms), while <code>cat</code>-ing them costs about 1.6 ms — 120× more, essentially all of it fork and exec. A shell monitoring loop that spawns a dozen processes every five seconds is spending more effort on the measurement than on anything it measures.',
            'Cột steal đẻ ra triệu chứng gây rối nhất có thể, và nó là trường duy nhất trong <code>/proc/stat</code> mà phần lớn người ta chưa từng ngó tới: ứng dụng của bạn chậm, đồ thị CPU thì rảnh, và chẳng thứ gì thuộc về bạn có lỗi cả. Trên một máy chủ bị bán quá công suất thì nó lên tới hai chữ số, và mọi hành động khả dĩ đều nằm ở BÊN NGOÀI. <code>iowait</code> là trường đáng biết còn lại và nó là một cách đọc THAY THẾ chính đáng — <code>iowait</code> cao với hàng đợi chạy thấp nghĩa là đang chờ đĩa, đúng thứ mà cột <code>wa</code> của <code>vmstat 1</code> cho thấy, và đó là chẩn đoán cho một truy vấn chậm, một lượt sao lưu đang chạy, hay một cái đĩa sắp hỏng. Lý do đọc chúng từ <code>/proc/stat</code> thay vì từ một công cụ cũng chính là lý do ở khắp chương này: HAI lần lấy mẫu và một phép trừ, vì các trường ấy cộng dồn. Và một cái giá đáng biết trước khi bạn viết vòng lặp: đọc mấy tệp này NGAY TRONG tiến trình thì gần như miễn phí (đo được 0,008–0,016 ms), còn <code>cat</code> chúng ra thì tốn chừng 1,6 ms — gấp 120 lần, mà gần như toàn bộ khoản đó là fork và exec. Một vòng lặp giám sát viết bằng shell mà đẻ ra cả tá tiến trình mỗi năm giây thì đang tốn công cho việc ĐO nhiều hơn cho bất cứ thứ gì nó đo.',
          ),
        }),

        // q11 · đáp án B
        mcq({
          prompt: B(
            'Measured on the scratch container:' +
            code('MemTotal:      8126480 kB\n' +
                 'MemFree:       2032932 kB\n' +
                 'MemAvailable:  6818940 kB\n' +
                 'Cached:        4392820 kB') +
            'A monitoring script alerts when <code>MemFree</code> drops below 25% of <code>MemTotal</code>. What is wrong with that, and which line should it read?',
            'Đo trên container nháp:' +
            code('MemTotal:      8126480 kB\n' +
                 'MemFree:       2032932 kB\n' +
                 'MemAvailable:  6818940 kB\n' +
                 'Cached:        4392820 kB') +
            'Một script giám sát báo động khi <code>MemFree</code> tụt xuống dưới 25% của <code>MemTotal</code>. Cách ấy sai ở đâu, và nó nên đọc dòng nào?',
          ),
          options: [
            B(
              'Nothing is wrong with the threshold, but it should be applied to <code>MemTotal</code> minus <code>Cached</code>, since page cache is reclaimable and subtracting it gives the same answer as <code>MemAvailable</code> by a more transparent route',
              'Cái ngưỡng chẳng sai gì, nhưng nên áp nó lên <code>MemTotal</code> trừ đi <code>Cached</code>, vì bộ đệm trang thu hồi được và trừ nó đi cho ra cùng câu trả lời với <code>MemAvailable</code> bằng một đường minh bạch hơn',
            ),
            B(
              '<code>MemFree</code> excludes reclaimable page cache, so a healthy machine using its RAM well looks nearly out of memory — here it reads 25% while <code>MemAvailable</code> says 84%. <code>MemAvailable</code> is the line to read: it is the kernel\'s own estimate of how much a new allocation could get',
              '<code>MemFree</code> KHÔNG tính phần bộ đệm trang thu hồi được, nên một cái máy khoẻ mạnh đang dùng RAM một cách hiệu quả lại trông như sắp cạn bộ nhớ — ở đây nó đọc ra 25% trong khi <code>MemAvailable</code> nói 84%. <code>MemAvailable</code> mới là dòng đáng đọc: nó là ước lượng của chính nhân về việc một phép cấp phát mới có thể xin được bao nhiêu',
            ),
            B(
              'The script is reading the host\'s figures rather than the container\'s, because <code>/proc/meminfo</code> is not namespaced; the fix is to read the cgroup files instead, and neither <code>MemFree</code> nor <code>MemAvailable</code> is usable inside a container',
              'Script đang đọc số liệu của MÁY CHỦ chứ không phải của container, vì <code>/proc/meminfo</code> không được phân vùng theo namespace; cách chữa là đọc các tệp cgroup, và cả <code>MemFree</code> lẫn <code>MemAvailable</code> đều không dùng được bên trong container',
            ),
            B(
              'A percentage of <code>MemTotal</code> is the wrong shape of threshold entirely: memory alerts should fire on the rate of change rather than on a level, so the fix is to alert when <code>MemAvailable</code> falls for three consecutive samples regardless of its value',
              'Lấy phần trăm của <code>MemTotal</code> là một hình dạng ngưỡng SAI HẲN: báo động bộ nhớ nên nổ theo TỐC ĐỘ THAY ĐỔI chứ không theo MỨC, nên cách chữa là báo động khi <code>MemAvailable</code> giảm ba lần lấy mẫu liên tiếp, bất kể giá trị của nó là bao nhiêu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The gap is 4.7 GB and it is page cache — memory the kernel is using for something useful and will hand back the instant anything needs it. A script that alerts on <code>MemFree</code> fires on a machine that is behaving exactly as designed, and after the third false alarm somebody raises the threshold or turns it off. <code>MemAvailable</code> is an estimate the kernel computes for precisely this question, and it is the only column in <code>free -m</code> worth looking at. Option C names a real and important trap in the wrong place: inside a container <code>/proc/meminfo</code> does report the host, which is exactly why a runtime sizes its heap wrongly there (Question 3) — but a monitoring script running on the host is reading the host on purpose, and for the cgroup a container is in, the right files are <code>memory.max</code> and <code>memory.current</code>. Option D is a good instinct pointed at the wrong metric: a steadily rising RSS with no plateau is a leak and is visible days before an OOM kill, which is genuinely a trend question — but "how close to the wall am I right now" still needs a level, and <code>MemAvailable</code> is that level.',
            'Đã đo. Khoảng cách là 4,7 GB và đó là BỘ ĐỆM TRANG — phần bộ nhớ mà nhân đang dùng vào một việc có ích và sẽ trả lại NGAY khi có thứ gì cần tới. Một script báo động theo <code>MemFree</code> sẽ nổ trên một cái máy đang hành xử ĐÚNG như thiết kế, và sau lần báo động giả thứ ba thì ai đó sẽ nâng ngưỡng lên hoặc tắt hẳn nó đi. <code>MemAvailable</code> là một ước lượng mà nhân tính ra cho ĐÚNG câu hỏi này, và nó là cột duy nhất trong <code>free -m</code> đáng nhìn. Phương án C gọi tên một cái bẫy CÓ THẬT và quan trọng nhưng đặt nhầm chỗ: bên trong một container thì <code>/proc/meminfo</code> đúng là báo số của máy chủ, và chính vì thế một runtime mới tính sai kích thước heap ở đó (câu 3) — nhưng một script giám sát chạy TRÊN máy chủ thì đang đọc máy chủ một cách có chủ đích, còn với cgroup mà một container nằm trong, tệp đúng là <code>memory.max</code> và <code>memory.current</code>. Phương án D là một bản năng tốt chĩa nhầm chỉ số: một con số RSS tăng đều không có chỗ chững lại là một chỗ RÒ và nó nhìn thấy được nhiều ngày trước một cú OOM, đó đúng là một câu hỏi về XU HƯỚNG — nhưng câu "ngay bây giờ tôi cách bức tường bao xa" thì vẫn cần một MỨC, và <code>MemAvailable</code> chính là cái mức ấy.',
          ),
        }),

        // q12 · đáp án C
        mcq({
          prompt: B(
            '200 request timings from a service with a slow tail, computed over a fixed sample set:' +
            code('n           = 200 request\n' +
                 'trung binh  : 79,7 ms   ← con so tren bang dieu khien\n' +
                 'p50         : 16 ms\n' +
                 'p90         : 20 ms\n' +
                 'p95         : 901 ms\n' +
                 'p99         : 957 ms\n' +
                 'max         : 971 ms\n' +
                 'so request > 500 ms: 14 (7%)') +
            'Which feature of this table is the most informative, and what does it tell you?',
            '200 số đo thời gian request của một dịch vụ có đuôi chậm, tính trên một tập mẫu cố định:' +
            code('n           = 200 request\n' +
                 'trung binh  : 79,7 ms   ← con so tren bang dieu khien\n' +
                 'p50         : 16 ms\n' +
                 'p90         : 20 ms\n' +
                 'p95         : 901 ms\n' +
                 'p99         : 957 ms\n' +
                 'max         : 971 ms\n' +
                 'so request > 500 ms: 14 (7%)') +
            'Đặc điểm nào của cái bảng này cho nhiều thông tin nhất, và nó nói cho bạn biết điều gì?',
          ),
          options: [
            B(
              'That the mean sits between p90 and p95, which is the signature of a well-behaved long-tailed distribution; the service is healthy and the tail is the expected cost of a cache miss',
              'Rằng giá trị trung bình nằm giữa p90 và p95, và đó là chữ ký của một phân bố đuôi dài lành mạnh; dịch vụ vẫn khoẻ và cái đuôi ấy là cái giá dự kiến của một lần trượt bộ đệm',
            ),
            B(
              'That p99 and max are within 2% of each other, which means the sample is too small to resolve the tail; nothing can be concluded until n is at least a few thousand',
              'Rằng p99 và max chỉ chênh nhau chưa tới 2%, nghĩa là mẫu quá nhỏ để phân giải được cái đuôi; chưa kết luận được gì cho tới khi n đạt ít nhất vài nghìn',
            ),
            B(
              'The jump from p90 to p95 — 20 ms to 901 ms, a 45× step in five percentage points. That cliff is the signature of a BIMODAL distribution: two different code paths, not one path with variance. The mean hides it completely and is reassuring while it does so',
              'Cú nhảy từ p90 sang p95 — 20 ms lên 901 ms, gấp 45 lần trong vòng năm điểm phần trăm. Cái vách ấy là chữ ký của một phân bố HAI ĐỈNH: hai nhánh mã KHÁC NHAU, chứ không phải một nhánh có độ tản. Giá trị trung bình che nó đi hoàn toàn, và trong lúc che thì nó nghe rất yên tâm',
            ),
            B(
              'That p50 is four times better than the mean, which proves the mean is being dragged up by outliers that should be excluded before reporting; trimming the top 5% gives a figure that describes the typical user',
              'Rằng p50 tốt hơn giá trị trung bình bốn lần, chứng tỏ trung bình đang bị các giá trị ngoại lai kéo lên và lẽ ra phải loại chúng trước khi báo cáo; cắt bỏ 5% cao nhất sẽ cho một con số mô tả đúng người dùng điển hình',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nobody waited 79.7 ms. Half the users got 16 ms — five times better than the average — and one in twenty got 901 ms, eleven times worse. The mean sits in a gap between two populations and describes neither, and 80 ms looks like a healthy API, which is what makes it dangerous rather than merely useless. The cliff is the thing to look for, because a smooth distribution does not produce a 45× step in five percentage points; two code paths do. Option D is the exact instinct to resist: the slow requests are not noise to be trimmed, they are the requests that hold resources. Ten requests at 900 ms occupy connections, memory and worker slots for the same total time as 600 requests at 15 ms, which is how a slow tail fills a connection pool and turns into a full outage without the mean moving much. And the tail is worse than it looks at the page level: if loading a page makes twenty backend calls and each has a 7% chance of being slow, the chance that all twenty are fast is 0.93²⁰ ≈ 23% — so a "7% tail" at the request level is the majority experience at the page level.',
            'Chẳng ai chờ 79,7 ms cả. Một nửa người dùng nhận 16 ms — tốt hơn trung bình năm lần — và một phần hai mươi nhận 901 ms, tệ hơn mười một lần. Giá trị trung bình ngồi trong cái khe giữa HAI quần thể và không mô tả bên nào, mà 80 ms thì trông như một API khoẻ mạnh, và chính điều đó làm nó NGUY HIỂM chứ không chỉ là vô dụng. Cái VÁCH mới là thứ cần tìm, vì một phân bố trơn tru không đẻ ra được một bậc gấp 45 lần trong năm điểm phần trăm; hai nhánh mã thì có. Phương án D đúng là cái bản năng cần kìm lại: những request chậm không phải nhiễu để mà cắt bỏ, chúng là những request ĐANG GIỮ TÀI NGUYÊN. Mười request 900 ms chiếm kết nối, bộ nhớ và chỗ làm việc trong đúng bằng tổng thời gian của 600 request 15 ms, và đó là cách một cái đuôi chậm làm đầy bể kết nối rồi biến thành một sự cố toàn phần mà giá trị trung bình gần như không nhúc nhích. Còn ở mức TRANG thì cái đuôi ấy tệ hơn vẻ ngoài của nó: nếu tải một trang phải gọi hai mươi lượt xuống backend và mỗi lượt có 7% khả năng chậm, thì xác suất CẢ hai mươi lượt đều nhanh là 0,93²⁰ ≈ 23% — nên một "cái đuôi 7%" ở mức request lại là TRẢI NGHIỆM CỦA ĐA SỐ ở mức trang.',
          ),
        }),

        // q13 · đáp án A
        mcq({
          prompt: B(
            'A team reports "5% of requests are slow, which is acceptable". A page load makes twenty backend calls. What is the honest way to state the same fact from the user\'s side, and what is the second reason the tail matters more than it looks?',
            'Một nhóm báo cáo "5% request bị chậm, mức đó chấp nhận được". Mỗi lần tải trang thì gọi hai mươi lượt xuống backend. Cách phát biểu THẬT THÀ của cùng sự kiện ấy nhìn từ phía người dùng là gì, và lý do THỨ HAI khiến cái đuôi quan trọng hơn vẻ ngoài của nó là gì?',
          ),
          options: [
            B(
              'Roughly two page loads in three hit at least one slow call, because the chance all twenty are fast is 0.95²⁰ ≈ 36%. And the slow requests are the ones that HOLD RESOURCES — connections, memory, worker slots — so under load the tail is what fills the pool',
              'Khoảng hai trên ba lần tải trang sẽ dính ít nhất một lượt gọi chậm, vì xác suất cả hai mươi lượt đều nhanh là 0,95²⁰ ≈ 36%. Và những request chậm chính là những request ĐANG GIỮ TÀI NGUYÊN — kết nối, bộ nhớ, chỗ làm việc — nên khi có tải thì cái đuôi mới là thứ làm đầy bể kết nối',
            ),
            B(
              'Exactly 5% of page loads are slow, because the per-request probability carries over unchanged to the page; the second reason is that slow requests are usually retried by the client, so the visible rate doubles',
              'Đúng 5% lần tải trang bị chậm, vì xác suất trên mỗi request chuyển sang mức trang mà không đổi; lý do thứ hai là các request chậm thường bị máy khách thử lại, nên tỉ lệ nhìn thấy được tăng gấp đôi',
            ),
            B(
              'Roughly 100% of page loads are slow, since twenty calls at 5% each means one slow call per page on average; the second reason is that a slow response occupies a browser connection slot and blocks the other nineteen calls',
              'Khoảng 100% lần tải trang bị chậm, vì hai mươi lượt gọi mỗi lượt 5% nghĩa là trung bình mỗi trang có một lượt chậm; lý do thứ hai là một phản hồi chậm chiếm một chỗ kết nối của trình duyệt và chặn mười chín lượt còn lại',
            ),
            B(
              'The page-level figure cannot be computed from the request-level one, because the twenty calls are not independent — they hit the same database and the same cache, so a slow call makes its siblings more likely to be slow rather than less',
              'Con số ở mức trang không tính được từ con số ở mức request, vì hai mươi lượt gọi ấy KHÔNG độc lập — chúng cùng đụng một cơ sở dữ liệu và một bộ đệm, nên một lượt chậm làm các lượt anh em CÓ KHẢ NĂNG chậm theo chứ không phải ít đi',
            ),
          ],
          correct: 0,
          explanation: EX(
            '0.95²⁰ ≈ 0.358, so nearly two thirds of page loads hit at least one slow call. A "5% tail" at the request level is a majority experience at the page level, and that arithmetic is the fastest way to turn "acceptable" into a decision. The second argument is the one people underestimate: the tail is where your capacity goes. Ten requests at 900 ms occupy connections and worker slots for the same total time as 600 requests at 15 ms, which is how a slow tail becomes a full outage without the mean moving much at all. Option D names something true and important and then draws the wrong conclusion: the calls really are correlated, and correlation makes the estimate <em>optimistic</em> in one direction and pessimistic in another — it does not make the calculation unusable, it makes it a floor worth stating out loud. What to alert on follows from the same reasoning: not the mean, and not a fixed millisecond threshold either, because those go stale as the application changes. Alert when p95 doubles relative to the same hour last week — which catches real regressions, ignores the daily traffic shape, and needs a week of history you have to start recording before you need it.',
            '0,95²⁰ ≈ 0,358, nên gần hai phần ba số lần tải trang sẽ dính ít nhất một lượt gọi chậm. Một "cái đuôi 5%" ở mức request lại là TRẢI NGHIỆM CỦA ĐA SỐ ở mức trang, và phép tính ấy là cách nhanh nhất biến chữ "chấp nhận được" thành một QUYẾT ĐỊNH. Lập luận thứ hai là thứ người ta hay đánh giá thấp: cái đuôi mới là nơi công suất của bạn chảy đi. Mười request 900 ms chiếm kết nối và chỗ làm việc trong đúng bằng tổng thời gian của 600 request 15 ms, và đó là cách một cái đuôi chậm biến thành một sự cố toàn phần mà giá trị trung bình gần như không nhúc nhích. Phương án D gọi tên một điều ĐÚNG và quan trọng rồi rút ra kết luận sai: các lượt gọi ấy quả thật có tương quan, và tương quan làm cho ước lượng LẠC QUAN theo một chiều và bi quan theo chiều kia — nó không làm phép tính trở nên vô dụng, nó biến phép tính thành một cái SÀN đáng nói to lên. Còn chuyện báo động theo cái gì thì cũng suy ra từ đúng lập luận ấy: không phải giá trị trung bình, và cũng không phải một ngưỡng mili giây cố định, vì những thứ đó cũ đi theo mỗi lần ứng dụng thay đổi. Hãy báo động khi p95 TĂNG GẤP ĐÔI so với cùng khung giờ tuần trước — nó bắt được các bước lùi thật, bỏ qua nhịp lưu lượng theo ngày, và cần một tuần lịch sử mà bạn phải bắt đầu ghi lại TRƯỚC khi cần tới nó.',
          ),
        }),

        // q14 · đáp án B + D (chọn HAI)
        mcq({
          prompt: B(
            '200,000 requests written in two log formats, then asked the same question — which URIs return 5xx AND take more than two seconds:' +
            code('--- log THUAN (combined) ---\n' +
                 '  830 /api/v1/don   → 82 ms\n' +
                 '  VA khong tra loi duoc phan "cham hon 2 giay"\n\n' +
                 '--- log JSON ---\n' +
                 '  281 /api/v1/don   → 538 ms\n\n' +
                 'kich thuoc: ket-hop 22,2 MB · json 23,5 MB (JSON to hon 1,06 lan)\n' +
                 'sau gzip  : ket-hop 1,4 MB (15,4x) · json 1,9 MB (12,1x)') +
            '<b>Choose TWO</b> conclusions this measurement supports.',
            '200.000 request được ghi ra ở hai định dạng log, rồi hỏi cả hai cùng một câu — URI nào trả 5xx VÀ mất hơn hai giây:' +
            code('--- log THUAN (combined) ---\n' +
                 '  830 /api/v1/don   → 82 ms\n' +
                 '  VA khong tra loi duoc phan "cham hon 2 giay"\n\n' +
                 '--- log JSON ---\n' +
                 '  281 /api/v1/don   → 538 ms\n\n' +
                 'kich thuoc: ket-hop 22,2 MB · json 23,5 MB (JSON to hon 1,06 lan)\n' +
                 'sau gzip  : ket-hop 1,4 MB (15,4x) · json 1,9 MB (12,1x)') +
            '<b>Chọn HAI</b> kết luận mà phép đo này chống đỡ được.',
          ),
          options: [
            B(
              'JSON is the right default for a single VPS, because the 6× parsing cost is irrelevant next to the ability to answer arbitrary questions, and the 6% size difference is noise',
              'JSON là mặc định đúng cho một VPS đơn lẻ, vì cái giá phân tích gấp 6 lần chẳng đáng gì so với khả năng trả lời câu hỏi bất kỳ, và chênh lệch 6% kích thước chỉ là nhiễu',
            ),
            B(
              'The fast answer is the WRONG answer: 830 is every 5xx on that URI, because the combined format has no duration field — the question cannot be answered from that file at any speed. Format is a smaller decision than CONTENT',
              'Câu trả lời NHANH là câu trả lời SAI: 830 là MỌI cú 5xx trên URI đó, vì định dạng combined KHÔNG có trường thời gian — câu hỏi ấy không trả lời được từ tệp đó dù ở tốc độ nào. Định dạng là quyết định NHỎ HƠN so với NỘI DUNG',
            ),
            B(
              'Structured logging costs 6% more disk before compression and 27% more after, so on a disk shared with a database the plain format is the safer choice and the missing field should be reconstructed from the application log instead',
              'Ghi log có cấu trúc tốn thêm 6% đĩa trước khi nén và 27% sau khi nén, nên trên một cái đĩa dùng chung với cơ sở dữ liệu thì định dạng thuần là lựa chọn an toàn hơn, còn cái trường thiếu thì nên dựng lại từ log ứng dụng',
            ),
            B(
              'A middle option is often right on one server: keep one greppable line per request and just ADD the fields you need — nginx\'s <code>log_format</code> can carry <code>$request_time</code> and <code>$upstream_response_time</code>, which restores the 82 ms speed and answers the question',
              'Một lựa chọn TRUNG GIAN thường mới đúng trên một máy chủ: giữ mỗi request một dòng grep được và chỉ THÊM những trường bạn cần — <code>log_format</code> của nginx mang được <code>$request_time</code> và <code>$upstream_response_time</code>, thứ vừa khôi phục tốc độ 82 ms vừa trả lời được câu hỏi',
            ),
            B(
              'Both formats are adequate and the real lesson is compression: at 12–15× a small site keeping ninety days of logs is a few hundred megabytes either way, so the decision should be made on tooling preference alone',
              'Cả hai định dạng đều ổn và bài học thật là chuyện NÉN: ở mức 12–15 lần thì một trang nhỏ giữ chín mươi ngày log cũng chỉ vài trăm megabyte dù chọn cách nào, nên quyết định nên dựa hoàn toàn vào sở thích công cụ',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            '82 ms and the wrong number is the most useful pair in the measurement, because a fast wrong answer during an incident is worse than a slow right one — you act on it. The combined format loses because of what it <em>omits</em>, not because of its syntax, and that reframes the whole choice: the fields worth having are timestamp, status, method and path (every format has these and they are not the interesting part), <b>request duration</b> (the field the whole measurement turned on — without it, no percentiles and no "slow" query), upstream duration separately (splits "my app is slow" from "the proxy is slow" without guessing), a request id (what makes a log searchable rather than readable), the release version (so "did this start with the deploy?" is a query rather than an argument), and a user or tenant id (so "is it everyone or one customer?" is answerable in one command). Option A is defensible and becomes much stronger the moment a machine is shipping logs to something that will parse them; on one server, option D usually wins. And the rule that outranks both: a log line is a place secrets go to be permanently archived — logging a request body captures passwords on the login route, logging headers captures <code>Authorization</code>, and unlike a leak in memory this one is written to disk, shipped, backed up and retained for months. Choose fields explicitly; never log whole objects.',
            '82 ms cộng với một con số SAI là cặp có ích nhất trong cả phép đo, vì một câu trả lời nhanh mà sai trong lúc có sự cố còn tệ hơn một câu trả lời chậm mà đúng — bạn sẽ HÀNH ĐỘNG theo nó. Định dạng combined thua vì thứ nó BỎ SÓT chứ không phải vì cú pháp của nó, và điều đó đóng khung lại cả lựa chọn: những trường đáng có là dấu thời gian, mã trạng thái, phương thức và đường dẫn (định dạng nào cũng có và chúng không phải phần thú vị), <b>thời lượng request</b> (cái trường mà cả phép đo xoay quanh — thiếu nó thì không có phân vị và không có câu hỏi "chậm"), thời lượng của upstream tách riêng (tách "ứng dụng của tôi chậm" khỏi "proxy chậm" mà khỏi phải đoán), một mã request (thứ làm cho log TRA CỨU ĐƯỢC chứ không chỉ ĐỌC ĐƯỢC), phiên bản bản phát hành (để câu "cái này bắt đầu từ lần deploy phải không?" là một TRUY VẤN chứ không phải một cuộc tranh cãi), và một mã người dùng hay khách hàng (để câu "cả làng hay chỉ một khách?" trả lời được bằng một lệnh). Phương án A bênh được và mạnh lên rất nhiều ngay khi một cái máy bắt đầu chuyển log đi cho thứ khác phân tích; trên một máy chủ thì phương án D thường thắng. Và quy tắc đứng trên cả hai: một dòng log là nơi các bí mật đi tới để được LƯU TRỮ VĨNH VIỄN — ghi thân request là chộp luôn mật khẩu trên tuyến đăng nhập, ghi header là chộp luôn <code>Authorization</code>, và khác với một chỗ rò trong bộ nhớ, cái này được ghi xuống đĩa, được chuyển đi, được sao lưu và được giữ hàng tháng. Hãy CHỌN trường một cách tường minh; đừng bao giờ đổ nguyên cả đối tượng ra.',
          ),
        }),

        // q15 · đáp án C
        mcq({
          prompt: B(
            'A 20 GB disk starting at 30% and growing 350 MB an hour, sampled hourly for 48 hours. One alarm fires at 90%; the other computes the rate from the last three samples and fires when the extrapolated time-to-full drops below 24 hours:' +
            code(' gio | dung  |  %   | NGUONG | XU HUONG\n' +
                 ' ----+-------+------+--------+------------------\n' +
                 '  17 | 11.8G | 59.1 | im lang| 🟠 day sau 24h\n' +
                 '  30 | 16.3G | 81.3 | im lang| 🟠 day sau 11h\n' +
                 '  36 | 18.3G | 91.5 | 🔴 NO  | 🟠 day sau 5h\n' +
                 '  41 | 20.0G |100.1 | 🔴 NO  | 🟠 day sau -0h') +
            'Nineteen hours separate the two. What is the caveat that stops this from being a free win?',
            'Một cái đĩa 20 GB bắt đầu ở 30% và tăng 350 MB mỗi giờ, lấy mẫu hàng giờ trong 48 giờ. Một báo động nổ ở 90%; cái kia tính tốc độ từ ba mẫu gần nhất rồi nổ khi thời gian-tới-đầy ngoại suy xuống dưới 24 giờ:' +
            code(' gio | dung  |  %   | NGUONG | XU HUONG\n' +
                 ' ----+-------+------+--------+------------------\n' +
                 '  17 | 11.8G | 59.1 | im lang| 🟠 day sau 24h\n' +
                 '  30 | 16.3G | 81.3 | im lang| 🟠 day sau 11h\n' +
                 '  36 | 18.3G | 91.5 | 🔴 NO  | 🟠 day sau 5h\n' +
                 '  41 | 20.0G |100.1 | 🔴 NO  | 🟠 day sau -0h') +
            'Mười chín giờ ngăn cách hai bên. Lời dặn nào ngăn không cho đây là một chiến thắng miễn phí?',
          ),
          options: [
            B(
              'A trend alarm cannot fire before it has enough history, so the first 24 hours after a machine is provisioned are uncovered and so is every window after a metrics gap; the threshold alarm is what protects those windows, and both are therefore needed rather than one replacing the other',
              'Một báo động xu hướng không nổ được trước khi nó có đủ lịch sử, nên 24 giờ đầu sau khi dựng một cái máy là khoảng không được che, và mọi cửa sổ sau một lần đứt số liệu cũng vậy; báo động ngưỡng mới là thứ bảo vệ những cửa sổ đó, và vì thế cần CẢ HAI chứ không phải cái này thay cái kia',
            ),
            B(
              'Extrapolation assumes the rate is constant, and disk usage on a real server is dominated by a weekly backup cycle rather than by steady growth, so the prediction is systematically pessimistic on the day the backup lands and optimistic for the six days after it — which is the opposite of what an alarm should do',
              'Phép ngoại suy giả định tốc độ là hằng số, mà mức dùng đĩa trên một máy chủ thật thì bị chu kỳ sao lưu hàng tuần chi phối chứ không phải bị tăng trưởng đều đặn, nên dự đoán ấy bi quan một cách có hệ thống vào ngày bản sao lưu đáp xuống và lạc quan suốt sáu ngày sau đó — ngược hẳn với thứ một cái báo động nên làm',
            ),
            B(
              'Real disk usage is not monotonic — a build writes 2 GB and deletes it, a backup lands and is shipped away — so extrapolating from a couple of points produces "full in 20 minutes" several times a day, and an alarm that cries wolf is an alarm somebody mutes. Smooth over several hours, require the prediction to hold twice, and never alert on a shrinking series',
              'Mức dùng đĩa thật KHÔNG đơn điệu — một bản dựng ghi 2 GB rồi xoá đi, một bản sao lưu đáp xuống rồi được chuyển đi — nên ngoại suy từ vài điểm sẽ đẻ ra "đầy sau 20 phút" mấy lần một ngày, và một cái báo động kêu oan là một cái báo động sẽ bị ai đó tắt tiếng. Hãy làm trơn qua vài giờ, đòi dự đoán phải giữ nguyên qua HAI lần đánh giá, và đừng bao giờ báo động trên một chuỗi đang GIẢM',
            ),
            B(
              'The trend alarm fires at 59% used, which is too early to act on: nobody will free disk on a machine that is 41% empty, so the alert is correct and will be ignored, which makes the threshold alarm the only one that ever produces action',
              'Báo động xu hướng nổ ở mức 59% đã dùng, sớm tới mức không hành động được: chẳng ai đi dọn đĩa trên một cái máy còn trống 41%, nên cảnh báo ấy đúng mà vẫn bị bỏ qua, và điều đó làm báo động ngưỡng thành cái duy nhất từng tạo ra hành động',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The arithmetic is one subtraction and one division over samples you are already collecting, and the value is entirely in <em>when</em> it fires: hour 17 with a full day of warning, against hour 36 with five hours left and no way to choose when in the day that lands. If the disk crosses 90% at 03:00, the threshold alarm wakes somebody at 03:00. But the measurement used a clean monotonic series, and that is the thing to be honest about — the three-sample version is the minimum that works on a quiet machine, not a template for a busy one. Option A names a real gap and the wrong remedy: a machine with no history is a machine nobody has watched, and the answer is to start recording immediately rather than to keep a threshold that fires too late. Option D is the argument for making the alert actionable rather than for dropping it: the message should name the command or the runbook page, and "disk will be full in 24 hours, here is what is growing" is actionable at 59% in a way that "disk 90% full" is not at 03:00. The same shape applies to memory (a steadily rising RSS with no plateau is a leak, visible days before the kill), to certificates (days remaining, alert at 21), and to inodes as a separate series from blocks.',
            'Phép tính chỉ là một phép trừ và một phép chia trên những mẫu bạn vốn đã thu thập, và toàn bộ giá trị nằm ở chỗ nó nổ KHI NÀO: giờ thứ 17 với trọn một ngày cảnh báo, so với giờ thứ 36 còn năm tiếng và chẳng có cách nào chọn xem nó rơi vào lúc nào trong ngày. Nếu cái đĩa vượt 90% lúc 03:00 thì báo động ngưỡng dựng ai đó dậy lúc 03:00. Nhưng phép đo dùng một chuỗi TRƠN và ĐƠN ĐIỆU, và đó là chỗ cần thật thà — bản ba mẫu là mức TỐI THIỂU chạy được trên một cái máy yên ắng, không phải một cái khuôn cho một cái máy bận. Phương án A gọi tên một khoảng trống CÓ THẬT và một cách chữa sai: một cái máy không có lịch sử là một cái máy chưa ai theo dõi, và câu trả lời là BẮT ĐẦU GHI NGAY chứ không phải giữ lại một cái ngưỡng nổ quá muộn. Phương án D là lý lẽ cho việc làm cho cảnh báo HÀNH ĐỘNG ĐƯỢC chứ không phải cho việc bỏ nó đi: thông báo phải gọi tên câu lệnh hay trang cẩm nang, và "đĩa sẽ đầy sau 24 giờ, đây là thứ đang phình" thì hành động được ở mức 59% theo cái cách mà "đĩa đầy 90%" lúc 03:00 thì không. Cùng hình dạng ấy áp cho bộ nhớ (một RSS tăng đều không chững lại là một chỗ rò, nhìn thấy nhiều ngày trước cú giết), cho chứng chỉ (số ngày còn lại, báo ở mức 21), và cho INODE như một chuỗi RIÊNG tách khỏi khối.',
          ),
        }),

        // q16 · đáp án A
        mcq({
          prompt: B(
            'A backup verification job runs nightly and exits non-zero on failure. An alerting pipeline pages on any non-zero exit. Three weeks later the backups have not run at all for eleven days and nobody knew. What was missing, and what is the general form of the fix?',
            'Một việc kiểm chứng sao lưu chạy hàng đêm và thoát khác 0 khi hỏng. Một đường ống báo động gọi người dậy khi có bất kỳ mã thoát khác 0 nào. Ba tuần sau, các bản sao lưu đã KHÔNG chạy chút nào suốt mười một ngày mà chẳng ai biết. Thứ gì đã thiếu, và dạng tổng quát của cách chữa là gì?',
          ),
          options: [
            B(
              'Every check in that pipeline fires on FAILURE, and nothing fires when the job stops running altogether — the log stays quiet and the exit codes stay 0 because nothing ran. Alert on the ABSENCE of a success: "no successful verification in 48 hours" is the alarm, and the same shape covers the alerting pipeline itself',
              'MỌI phép kiểm trong đường ống ấy đều nổ khi HỎNG, và chẳng có gì nổ khi việc ấy NGỪNG CHẠY hẳn — nhật ký vẫn im, mã thoát vẫn 0, vì chẳng có gì chạy cả. Hãy báo động theo SỰ VẮNG MẶT của một lần thành công: "48 giờ không có lần kiểm chứng thành công nào" mới là cái chuông, và cùng hình dạng ấy phủ luôn chính cái đường ống báo động',
            ),
            B(
              'The job should have been a systemd timer rather than a cron entry, because a timer records its last successful run and <code>systemctl list-timers</code> shows a stale one; cron has no such state, which is why the gap was invisible',
              'Việc ấy lẽ ra phải là một systemd timer chứ không phải một mục cron, vì timer ghi lại lần chạy thành công gần nhất và <code>systemctl list-timers</code> cho thấy cái nào đã cũ; cron không có trạng thái ấy, và vì thế khoảng trống kia mới vô hình',
            ),
            B(
              'The verification exits non-zero on failure but the pipeline pages on any non-zero exit, which includes a transient failure to reach the database; after a few false pages somebody silenced the rule, which is what created the eleven-day gap',
              'Phép kiểm chứng thoát khác 0 khi hỏng còn đường ống thì gọi người dậy với MỌI mã khác 0, kể cả một cú không với tới được cơ sở dữ liệu trong chốc lát; sau vài lần gọi nhầm thì ai đó tắt tiếng luật ấy, và chính điều đó tạo ra khoảng trống mười một ngày',
            ),
            B(
              'Nothing was missing from the design: a backup job that does not run is a scheduling problem rather than a monitoring one, and the fix belongs in the scheduler — a lock file with a timestamp that the next run refuses to overwrite if it is too old',
              'Chẳng thiếu gì trong thiết kế cả: một việc sao lưu không chạy là vấn đề của bộ lập lịch chứ không phải của giám sát, và cách chữa thuộc về bộ lập lịch — một tệp khoá có dấu thời gian mà lượt chạy sau từ chối ghi đè nếu nó quá cũ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A backup system that stops silently looks identical to one that works, and that is true of every scheduled job: the failure modes people design for are "it ran and something went wrong", while the one that actually bites is "it did not run". Alerting on the absence of a success covers both, and it costs one timestamp file and one comparison. The same shape applies one level up, to the thing doing the alerting: an alerting pipeline is code that runs rarely, which by the rules of Chapter 7 makes it code that is probably broken. Send yourself a deliberate test alert on a schedule — monthly is enough — and treat its absence as an incident, because the failure mode there is silent and complete: an expired webhook, a changed phone number, a mail server rejecting the sender. You find out either during a test or during an outage. Option B describes a genuinely useful property of timers and it is a partial answer rather than the general one — the gap is still invisible unless something is <em>reading</em> that state and complaining. Option C names the other half of alerting hygiene: an alarm that fires and is ignored has trained the reader to ignore the next one, so more than one or two a week that need no action means the thresholds are wrong rather than the reader.',
            'Một hệ thống sao lưu NGỪNG một cách im lặng thì trông y hệt một hệ thống đang chạy tốt, và điều đó đúng với MỌI việc chạy theo lịch: kiểu hỏng mà người ta thiết kế để chống là "nó đã chạy và có gì đó sai", còn kiểu thật sự cắn là "nó KHÔNG chạy". Báo động theo SỰ VẮNG MẶT của một lần thành công thì phủ cả hai, và nó tốn đúng một tệp dấu thời gian với một phép so sánh. Cùng hình dạng ấy áp lên một tầng cao hơn, lên chính cái thứ đang đi báo động: một đường ống báo động là đoạn mã HIẾM KHI CHẠY, mà theo quy tắc của Chương 7 thì đó là đoạn mã nhiều khả năng đang hỏng. Hãy tự gửi cho mình một cảnh báo thử có chủ đích theo lịch — mỗi tháng một lần là đủ — và coi việc nó KHÔNG tới là một sự cố, vì kiểu hỏng ở đó là im lặng và toàn phần: một webhook hết hạn, một số điện thoại đã đổi, một máy chủ thư từ chối người gửi. Bạn chỉ biết được hoặc trong một lần thử, hoặc trong một lần sự cố. Phương án B mô tả một tính chất THẬT SỰ hữu ích của timer và nó là một câu trả lời MỘT PHẦN chứ không phải câu tổng quát — khoảng trống vẫn vô hình chừng nào chưa có thứ gì ĐỌC cái trạng thái ấy rồi kêu lên. Phương án C gọi tên nửa còn lại của vệ sinh báo động: một cái chuông nổ rồi bị bỏ qua là đã dạy người đọc cách bỏ qua cái tiếp theo, nên nhiều hơn một hai cái mỗi tuần mà không cần hành động nghĩa là NGƯỠNG sai chứ không phải người đọc sai.',
          ),
        }),

        /* ── Chương 10 — sao lưu và phục hồi (7 câu) ────────────────────── */

        // q17 · đáp án D
        mcq({
          prompt: B(
            'The same database dumped two ways. Measured on PostgreSQL 16.14:' +
            code('pg_dump -Fp  → 16.626.218 byte\n' +
                 'pg_dump -Fc  →  2.547.857 byte') +
            'and restored (numbers from the course, on its own 192 MB database):' +
            code('psql -f sl.sql       : 3431 ms\n' +
                 'pg_restore           : 3274 ms\n' +
                 'pg_restore -j4       : 2123 ms') +
            'Why can the plain format not use <code>-j4</code>, and what other capability comes with the same property?',
            'Cùng một cơ sở dữ liệu, xuất ra theo hai cách. Đo trên PostgreSQL 16.14:' +
            code('pg_dump -Fp  → 16.626.218 byte\n' +
                 'pg_dump -Fc  →  2.547.857 byte') +
            'và phục hồi (số lấy từ giáo trình, trên cơ sở dữ liệu 192 MB của nó):' +
            code('psql -f sl.sql       : 3431 ms\n' +
                 'pg_restore           : 3274 ms\n' +
                 'pg_restore -j4       : 2123 ms') +
            'Vì sao định dạng thuần KHÔNG dùng được <code>-j4</code>, và tính chất ấy còn kéo theo khả năng nào nữa?',
          ),
          options: [
            B(
              'Because plain SQL is not compressed, so parallel workers would contend on disk bandwidth rather than on CPU; the same property means a plain dump cannot be streamed over a slow link without a separate <code>gzip</code> stage',
              'Vì SQL thuần không được nén, nên các tiến trình song song sẽ tranh nhau băng thông đĩa thay vì tranh CPU; cùng tính chất ấy nghĩa là một bản dump thuần không truyền được qua một đường chậm nếu không có một chặng <code>gzip</code> riêng',
            ),
            B(
              'Because <code>psql</code> is a single-threaded client by design while <code>pg_restore</code> is not; the same property means <code>psql</code> cannot be interrupted and resumed, so a failed plain restore has to start over',
              'Vì <code>psql</code> theo thiết kế là một máy khách đơn luồng còn <code>pg_restore</code> thì không; cùng tính chất ấy nghĩa là <code>psql</code> không ngắt rồi tiếp tục được, nên một lượt phục hồi thuần bị hỏng phải làm lại từ đầu',
            ),
            B(
              'Because the server serialises DDL from a single connection; the same property means a plain restore cannot be run against a database that already has objects in it, while <code>pg_restore</code> can merge into an existing schema',
              'Vì máy chủ tuần tự hoá DDL đến từ một kết nối duy nhất; cùng tính chất ấy nghĩa là một lượt phục hồi thuần không chạy được lên một cơ sở dữ liệu đã có sẵn đối tượng, còn <code>pg_restore</code> thì trộn được vào một lược đồ đang có',
            ),
            B(
              'Because plain SQL is one ordered stream of statements that has to be executed in order — there is nothing to parallelise. The custom format carries a TABLE OF CONTENTS, which is what makes both <code>-j</code> and selective restore (<code>-t mot_bang</code>) possible',
              'Vì SQL thuần là MỘT dòng câu lệnh có thứ tự, buộc phải thực thi theo đúng thứ tự — chẳng có gì để song song hoá. Định dạng custom mang theo một MỤC LỤC, và chính nó làm cho cả <code>-j</code> lẫn việc phục hồi CHỌN LỌC (<code>-t mot_bang</code>) trở nên khả thi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The table of contents sits at the front of a custom archive and is the reason the format can do things a text file cannot: restore in parallel, restore one table, reorder, or list what is inside. That last capability is also the subject of a trap worth remembering — <code>pg_restore --list</code> reads only that table of contents, so it exits 0 on an archive whose data is half missing, which makes it an actively misleading way to "check" a backup. The size difference in the measurement (6.5×) is the other half of the case for <code>-Fc</code>, and it is worth noting that compressing a plain dump afterwards lands at the same size more slowly — so if you want a compressed backup, let <code>pg_dump</code> do it. The reason to keep a plain dump anyway is that you can read it, which is genuinely useful when you need one table, one row, or to see exactly what the schema was on some date. Option B is close on the mechanism and wrong on the consequence: the single stream is the reason, not the client, and neither format resumes — a failed restore starts over in both cases. The most common real recovery is not "the server burned down" but "somebody ran a DELETE without a WHERE at 14:20", and that is a selective restore into a temporary database, which only the custom format makes pleasant.',
            'Cái MỤC LỤC nằm ở đầu một kho lưu định dạng custom và chính nó là lý do định dạng ấy làm được những việc mà một tệp văn bản không làm nổi: phục hồi song song, phục hồi một bảng, sắp lại thứ tự, hay liệt kê xem bên trong có gì. Khả năng cuối cùng ấy cũng là chủ đề của một cái bẫy đáng nhớ — <code>pg_restore --list</code> CHỈ đọc đúng cái mục lục đó, nên nó thoát 0 trên một kho lưu đã mất nửa phần dữ liệu, và điều đó biến nó thành một cách "kiểm" bản sao lưu ĐÁNH LỪA một cách chủ động. Chênh lệch kích thước trong phép đo (6,5 lần) là nửa còn lại của lý lẽ cho <code>-Fc</code>, và cũng đáng ghi nhận rằng nén một bản dump thuần SAU ĐÓ thì cho ra cùng kích thước mà lại chậm hơn — nên muốn một bản sao lưu đã nén thì hãy để <code>pg_dump</code> làm. Lý do vẫn nên giữ thêm một bản dump thuần là vì bạn ĐỌC được nó, thứ thật sự hữu ích khi bạn cần một bảng, một dòng, hay cần xem lược đồ vào một ngày nào đó chính xác là thế nào. Phương án B gần đúng về cơ chế và sai về hệ quả: cái DÒNG DUY NHẤT mới là lý do, không phải máy khách, và chẳng định dạng nào tiếp tục được giữa chừng — một lượt phục hồi hỏng thì cả hai đều phải làm lại. Còn cú cứu hộ thật hay gặp nhất không phải "máy chủ cháy rụi" mà là "ai đó chạy một lệnh DELETE không có WHERE lúc 14:20", và đó là một lượt phục hồi CHỌN LỌC vào một cơ sở dữ liệu tạm, thứ chỉ định dạng custom mới làm cho dễ chịu.',
          ),
        }),

        // q18 · đáp án B
        mcq({
          prompt: B(
            'A backup file is truncated to half its size — the way a full disk, an interrupted upload or a sync that copied a file still being written all leave one. Measured on PostgreSQL 16.14:' +
            code('-- ban dump -Fc bi cut con 1.273.928 / 2.547.857 byte --\n' +
                 'pg_restore --list  → ma thoat 0, doc duoc 32 dong muc luc\n' +
                 'pg_restore -d ph   → ma thoat 1\n' +
                 '   pg_restore: error: could not read from input file: end of file\n' +
                 '   kh = 0\n\n' +
                 '-- ban dump -Fp bi cut mot nua --\n' +
                 'psql -f cut.sql                     → ma thoat 0\n' +
                 'psql -v ON_ERROR_STOP=1 -f cut.sql  → ma thoat 3') +
            'Which of these results is the most dangerous, and which single flag is the cheapest thing on this list?',
            'Một tệp sao lưu bị cắt còn một nửa — đúng kiểu mà một cái đĩa đầy, một lượt tải lên bị đứt, hay một lệnh đồng bộ chép trúng tệp đang được ghi để lại. Đo trên PostgreSQL 16.14:' +
            code('-- ban dump -Fc bi cut con 1.273.928 / 2.547.857 byte --\n' +
                 'pg_restore --list  → ma thoat 0, doc duoc 32 dong muc luc\n' +
                 'pg_restore -d ph   → ma thoat 1\n' +
                 '   pg_restore: error: could not read from input file: end of file\n' +
                 '   kh = 0\n\n' +
                 '-- ban dump -Fp bi cut mot nua --\n' +
                 'psql -f cut.sql                     → ma thoat 0\n' +
                 'psql -v ON_ERROR_STOP=1 -f cut.sql  → ma thoat 3') +
            'Kết quả nào trong số này NGUY HIỂM nhất, và cái cờ nào là thứ rẻ nhất trong danh sách?',
          ),
          options: [
            B(
              '<code>pg_restore -d ph</code> exiting 1 while leaving <code>kh</code> at zero rows, because a partial database that reports failure is the state people restore over the top of; the cheapest fix is <code>--single-transaction</code>',
              'Lệnh <code>pg_restore -d ph</code> thoát 1 mà vẫn để bảng <code>kh</code> ở 0 dòng, vì một cơ sở dữ liệu dở dang có báo hỏng chính là cái trạng thái mà người ta hay phục hồi đè lên; cách chữa rẻ nhất là <code>--single-transaction</code>',
            ),
            B(
              '<code>psql -f</code> exiting 0. It reports SUCCESS on a truncated file, because by default psql treats a script as independent statements, reports errors as it goes and keeps going — right for an interactive session, catastrophic for a restore. <code>ON_ERROR_STOP=1</code> is one variable and costs nothing',
              'Lệnh <code>psql -f</code> thoát 0. Nó báo THÀNH CÔNG trên một tệp bị cắt cụt, vì mặc định psql coi một script là một dãy câu lệnh ĐỘC LẬP, báo lỗi rồi vẫn đi tiếp — đúng cho một phiên tương tác, và thảm hoạ cho một lượt phục hồi. <code>ON_ERROR_STOP=1</code> chỉ là một biến và chẳng tốn gì cả',
            ),
            B(
              '<code>pg_restore --list</code> exiting 0, because it is the check people run to validate a backup without restoring it; the cheapest fix is to compare the file size against the previous night\'s, which catches truncation without reading the archive at all',
              'Lệnh <code>pg_restore --list</code> thoát 0, vì đó là phép kiểm mà người ta hay chạy để xác nhận một bản sao lưu mà khỏi phải phục hồi; cách chữa rẻ nhất là so kích thước tệp với kích thước của đêm hôm trước, thứ bắt được cú cắt cụt mà chẳng cần đọc kho lưu chút nào',
            ),
            B(
              'None of them individually — the danger is that the two formats behave differently, so a runbook written for one is wrong for the other; the cheapest fix is to standardise on a single format across every database',
              'Chẳng cái nào riêng lẻ cả — mối nguy là HAI định dạng hành xử KHÁC nhau, nên một cuốn cẩm nang viết cho cái này thì sai với cái kia; cách chữa rẻ nhất là chuẩn hoá về một định dạng duy nhất cho mọi cơ sở dữ liệu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every behaviour in that transcript is defensible on its own and together they produce a system in which the only reliable signal is at the very end and is the one nobody automates. But <code>psql</code> exiting 0 is the one that leaves you with a database: in the course\'s version of this measurement a 51 MB truncated dump restored with exit code 0 and left a 400,170-row table completely empty, because the truncated <code>COPY</code> block failed and its transaction rolled back while everything around it committed. One variable turns the lie into exit 3. Option C names the second-worst result correctly and then proposes a check that fails for the reason this whole chapter exists: a file of a plausible size with a recent timestamp is indistinguishable from a good one — a network copy interrupted at 97% leaves a file that is 97% right. Option A is a real improvement worth adopting (<code>--single-transaction</code>, or <code>--exit-on-error</code>) and it is not the most dangerous row, because that run <em>did</em> report failure. The rule the chapter settles on: a backup file is a claim, not a fact, and the claim is only verified by restoring it and comparing what came back against what should have — everything else is evidence that something was written.',
            'Mọi hành vi trong đoạn terminal ấy tự nó đều bênh được, và gộp lại chúng đẻ ra một hệ thống mà tín hiệu ĐÁNG TIN duy nhất nằm ở tận cuối và lại là cái không ai tự động hoá. Nhưng <code>psql</code> thoát 0 mới là cái để lại cho bạn một CƠ SỞ DỮ LIỆU: ở phiên bản phép đo này trong giáo trình, một bản dump 51 MB bị cắt cụt đã phục hồi với mã thoát 0 và để lại một bảng 400.170 dòng RỖNG HOÀN TOÀN, vì khối <code>COPY</code> bị cắt hỏng và giao dịch của nó lùi lại trong khi mọi thứ xung quanh đã chốt. Một cái biến biến lời nói dối ấy thành mã thoát 3. Phương án C gọi tên đúng kết quả tệ thứ nhì rồi đề xuất một phép kiểm trượt vì đúng cái lý do mà cả chương này tồn tại: một tệp có kích thước hợp lý với dấu thời gian mới thì không phân biệt được với một tệp tốt — một lượt chép qua mạng đứt ở 97% để lại một tệp đúng 97%. Phương án A là một cải thiện CÓ THẬT đáng áp dụng (<code>--single-transaction</code>, hoặc <code>--exit-on-error</code>) và nó không phải dòng nguy hiểm nhất, vì lượt chạy ấy ĐÃ báo hỏng. Quy tắc mà chương này chốt lại: một tệp sao lưu là một LỜI KHAI, không phải một SỰ KIỆN, và lời khai ấy chỉ được kiểm chứng bằng cách PHỤC HỒI nó rồi ĐỐI CHIẾU thứ quay về với thứ lẽ ra phải quay về — mọi thứ khác chỉ là bằng chứng rằng đã có cái gì đó được ghi ra.',
          ),
        }),

        // q19 · đáp án A
        mcq({
          prompt: B(
            'A dump is taken of a database whose application logs in as the role <code>ung_dung</code>. Measured on PostgreSQL 16.14:' +
            code('so dong nhac toi ung_dung trong pg_dump: 1\n' +
                 '  GRANT SELECT ON TABLE public.kh TO ung_dung;\n' +
                 'so cau CREATE ROLE trong pg_dump      : 0\n\n' +
                 'pg_dumpall --roles-only:\n' +
                 '  CREATE ROLE ung_dung;\n' +
                 '  ALTER ROLE ung_dung WITH NOSUPERUSER INHERIT NOCREATEROLE\n' +
                 '                      NOCREATEDB LOGIN NOREPLICATION N…') +
            'Adding <code>pg_dumpall --roles-only</code> to the backup fixes the restore. What new obligation does that file create?',
            'Một bản dump được lấy từ một cơ sở dữ liệu mà ứng dụng đăng nhập bằng vai trò <code>ung_dung</code>. Đo trên PostgreSQL 16.14:' +
            code('so dong nhac toi ung_dung trong pg_dump: 1\n' +
                 '  GRANT SELECT ON TABLE public.kh TO ung_dung;\n' +
                 'so cau CREATE ROLE trong pg_dump      : 0\n\n' +
                 'pg_dumpall --roles-only:\n' +
                 '  CREATE ROLE ung_dung;\n' +
                 '  ALTER ROLE ung_dung WITH NOSUPERUSER INHERIT NOCREATEROLE\n' +
                 '                      NOCREATEDB LOGIN NOREPLICATION N…') +
            'Thêm <code>pg_dumpall --roles-only</code> vào bản sao lưu là chữa được lượt phục hồi. Nhưng tệp ấy đẻ ra NGHĨA VỤ MỚI nào?',
          ),
          options: [
            B(
              'It contains every role\'s password verifier, so it is a SECRET: encrypted before it leaves the machine, never in the repository, never in a log — and a great many people back roles up into git because it is "just schema"',
              'Nó chứa BỘ XÁC MINH MẬT KHẨU của mọi vai trò, nên nó là một BÍ MẬT: phải mã hoá trước khi rời khỏi máy, không bao giờ nằm trong kho mã, không bao giờ nằm trong log — mà rất nhiều người vẫn sao lưu vai trò vào git vì nghĩ đó "chỉ là lược đồ"',
            ),
            B(
              'It must be regenerated on every restore rather than stored, because a role file taken before a password rotation will silently reinstate the old credential and undo the rotation',
              'Nó phải được sinh lại ở mỗi lượt phục hồi chứ không phải lưu lại, vì một tệp vai trò lấy TRƯỚC một lần xoay mật khẩu sẽ âm thầm dựng lại thông tin xác thực cũ và huỷ luôn cú xoay ấy',
            ),
            B(
              'It has to be applied AFTER the database restore rather than before, because <code>CREATE ROLE</code> fails if a role of that name is already referenced by a grant in the restored schema',
              'Nó phải được áp SAU lượt phục hồi cơ sở dữ liệu chứ không phải trước, vì <code>CREATE ROLE</code> sẽ hỏng nếu một vai trò cùng tên đã được một câu GRANT trong lược đồ vừa phục hồi tham chiếu tới',
            ),
            B(
              'It must be taken from a superuser connection on the same host, because <code>pg_dumpall</code> reads <code>pg_authid</code> directly and a network connection cannot see that catalogue',
              'Nó phải được lấy từ một kết nối siêu người dùng NGAY TRÊN máy đó, vì <code>pg_dumpall</code> đọc thẳng <code>pg_authid</code> và một kết nối qua mạng không thấy được danh mục ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The grant is in the dump and the role is not, because <code>pg_dump</code> dumps one database while roles live at the cluster level, above any single database — out of scope by design. Restoring onto a fresh machine therefore returns every row and leaves an application that cannot log in, and the wording of the failure is worth noticing: <code>pg_restore</code> continues past it and reports "errors ignored on restore", which means a verification script that only counts rows passes that backup with a clean bill of health. The fix is one more file, applied <em>before</em> the database restore (which is what makes option C wrong — the grants in the dump are the ones that need the role to exist already). And the obligation it creates is real: those <code>ALTER ROLE … PASSWORD</code> lines carry SCRAM verifiers, which are not the passwords but are the material an offline attack works against. Encrypt before it leaves the machine, and remember the second half of that rule — an encrypted backup whose key lives only on the server it backs up is a backup you cannot restore in exactly the scenario you made it for. The key belongs somewhere the server is not.',
            'Câu GRANT thì nằm trong bản dump còn VAI TRÒ thì không, vì <code>pg_dump</code> xuất ra MỘT cơ sở dữ liệu trong khi vai trò sống ở tầng CỤM, phía trên mọi cơ sở dữ liệu đơn lẻ — ngoài phạm vi theo đúng thiết kế. Nên phục hồi lên một cái máy mới sẽ trả về đủ mọi dòng và để lại một ứng dụng KHÔNG đăng nhập được, và cách cú hỏng ấy được diễn đạt cũng đáng để ý: <code>pg_restore</code> đi tiếp qua nó rồi báo "errors ignored on restore", nghĩa là một script kiểm chứng chỉ ĐẾM DÒNG sẽ cấp cho bản sao lưu ấy một giấy chứng nhận sức khoẻ sạch sẽ. Cách chữa là thêm một tệp nữa, áp TRƯỚC lượt phục hồi cơ sở dữ liệu (và đó là chỗ làm phương án C sai — chính các câu GRANT trong bản dump mới là thứ cần vai trò TỒN TẠI SẴN). Còn cái nghĩa vụ nó đẻ ra thì có thật: những dòng <code>ALTER ROLE … PASSWORD</code> ấy mang theo bộ xác minh SCRAM, thứ không phải mật khẩu nhưng là NGUYÊN LIỆU cho một cuộc tấn công ngoại tuyến. Hãy mã hoá trước khi nó rời khỏi máy, và nhớ nửa sau của quy tắc ấy — một bản sao lưu đã mã hoá mà khoá chỉ nằm trên chính cái máy nó sao lưu là một bản sao lưu bạn KHÔNG phục hồi được trong đúng cái kịch bản bạn tạo ra nó để phòng. Cái khoá thuộc về một nơi mà máy chủ KHÔNG ở đó.',
          ),
        }),

        // q20 · đáp án C
        mcq({
          prompt: B(
            'A verification script restores each night\'s backup into a temporary database and compares per-table row counts. One line in it decides whether it can catch a whole class of failure:' +
            code('while read -r bang; do\n' +
                 '  A=$(psql -t -A -d "$GOC" -c "select count(*) from \\"$bang\\";")\n' +
                 '  B=$(psql -t -A -d "$TAM" -c "select count(*) from \\"$bang\\";" 2>/dev/null || echo "THIEU")\n' +
                 '  …\n' +
                 'done < <(psql -t -A -d "$GOC" -c "select tablename from pg_tables where schemaname=\'public\' order by 1;")') +
            'Which detail is load-bearing, and what does this check still not catch?',
            'Một script kiểm chứng phục hồi bản sao lưu mỗi đêm vào một cơ sở dữ liệu TẠM rồi đối chiếu số dòng từng bảng. Một dòng trong đó quyết định xem nó có bắt được cả một lớp cú hỏng hay không:' +
            code('while read -r bang; do\n' +
                 '  A=$(psql -t -A -d "$GOC" -c "select count(*) from \\"$bang\\";")\n' +
                 '  B=$(psql -t -A -d "$TAM" -c "select count(*) from \\"$bang\\";" 2>/dev/null || echo "THIEU")\n' +
                 '  …\n' +
                 'done < <(psql -t -A -d "$GOC" -c "select tablename from pg_tables where schemaname=\'public\' order by 1;")') +
            'Chi tiết nào là chi tiết CHỊU LỰC, và phép kiểm này VẪN chưa bắt được cái gì?',
          ),
          options: [
            B(
              'The <code>2&gt;/dev/null || echo "THIEU"</code> guard, which is what turns a missing table from a script crash into a reported mismatch; it still does not catch a table that restored with the right count into the wrong schema',
              'Cái chốt <code>2&gt;/dev/null || echo "THIEU"</code>, thứ biến một bảng thiếu từ một cú sập script thành một sự vênh ĐƯỢC BÁO CÁO; nó vẫn không bắt được một bảng phục hồi đúng số dòng nhưng vào nhầm lược đồ',
            ),
            B(
              'The temporary database name, because restoring into a fresh database is what makes the comparison meaningful; it still does not catch a backup taken from the wrong host, since row counts on a replica are identical',
              'Cái tên cơ sở dữ liệu tạm, vì phục hồi vào một cơ sở dữ liệu mới tinh mới làm phép so trở nên có nghĩa; nó vẫn không bắt được một bản sao lưu lấy nhầm máy chủ, vì số dòng trên một bản sao chép thì y hệt',
            ),
            B(
              'Enumerating the table list from the SOURCE rather than from the restored copy — asking the restored copy would silently skip a table that is missing entirely and report success because every table it FOUND matched. It still does not catch a backup with all the right counts and subtly wrong data',
              'Việc liệt kê danh sách bảng từ NGUỒN chứ không từ bản đã phục hồi — hỏi bản đã phục hồi thì sẽ âm thầm BỎ QUA một bảng thiếu hẳn rồi báo thành công, vì mọi bảng nó TÌM THẤY đều khớp. Nó vẫn không bắt được một bản sao lưu đúng hết số dòng mà dữ liệu thì sai một cách tinh vi',
            ),
            B(
              'The <code>order by 1</code>, because the two count queries must be issued in the same order for the comparison to be valid under concurrent writes; it still does not catch a table that changed size between the two queries',
              'Mệnh đề <code>order by 1</code>, vì hai truy vấn đếm phải được phát ra theo cùng thứ tự thì phép so mới hợp lệ khi có ghi đồng thời; nó vẫn không bắt được một bảng đổi kích thước giữa hai truy vấn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The direction of the enumeration is the whole design. A backup that dropped a table entirely produces a restored database in which every table present matches — and a script that walks the restored copy reports success on it. Asking the source what <em>should</em> exist is what makes an absence an error rather than an omission, and it is the same shape as Chapter 4\'s two-directional <code>comm</code> check on configuration drift. Everything else in that script earns its place too: it restores rather than inspecting, which catches truncation, corruption and a dump of the wrong thing; it restores into a temporary database, which enforces the rule that you never restore over production; and it cleans up on every exit path with <code>trap … EXIT</code>, so a failed check does not leave a large database behind. The limit named in the answer is real and worth knowing: row counts catch a missing table, not a corrupted row. A checksum over a few stable columns — <code>select md5(string_agg(id::text||du_lieu, &#39;&#39; order by id)) from lon</code> — costs a full scan and catches content changes; for most people, counts plus a successful restore is where the value stops rising steeply. And the last piece is the one nobody adds: alert on the <em>absence</em> of a successful verification, because nothing in this script fires when the cron job stops running at all.',
            'CHIỀU của phép liệt kê chính là toàn bộ thiết kế. Một bản sao lưu đánh rơi hẳn một bảng sẽ cho ra một cơ sở dữ liệu phục hồi mà MỌI bảng có mặt đều khớp — và một script đi dạo trên bản đã phục hồi sẽ báo THÀNH CÔNG trên đó. Hỏi NGUỒN xem cái gì LẼ RA phải có mới là thứ biến một sự vắng mặt thành một LỖI thay vì một sự bỏ sót, và nó cùng hình dạng với phép kiểm <code>comm</code> hai chiều về lệch pha cấu hình ở Chương 4. Mọi thứ khác trong script ấy cũng xứng đáng có mặt: nó PHỤC HỒI chứ không chỉ soi, và điều đó bắt được cú cắt cụt, hỏng hóc, và một bản dump của nhầm thứ; nó phục hồi vào một cơ sở dữ liệu TẠM, thứ thực thi quy tắc không bao giờ phục hồi đè lên production; và nó dọn dẹp trên MỌI đường ra bằng <code>trap … EXIT</code>, nên một phép kiểm hỏng không để lại một cơ sở dữ liệu to đùng nằm đó. Cái giới hạn được gọi tên trong đáp án là có thật và đáng biết: đếm dòng bắt được một bảng THIẾU chứ không bắt được một dòng HỎNG. Một tổng kiểm trên vài cột ổn định — <code>select md5(string_agg(id::text||du_lieu, &#39;&#39; order by id)) from lon</code> — tốn một lượt quét toàn bảng và bắt được thay đổi nội dung; với đa số người thì đếm dòng cộng một lượt phục hồi thành công là chỗ mà giá trị thôi tăng dốc. Còn mảnh cuối cùng là mảnh chẳng ai thêm: hãy báo động theo SỰ VẮNG MẶT của một lần kiểm chứng thành công, vì không thứ gì trong script này nổ khi việc cron NGỪNG chạy hẳn.',
          ),
        }),

        // q21 · đáp án D
        mcq({
          prompt: B(
            'A team states its recovery objectives: "RTO is five seconds, RPO is zero." Their setup is a nightly <code>pg_dump -Fc</code> at 03:15 and a measured 4.4-second restore of a 192 MB database. What is wrong with both numbers?',
            'Một nhóm tuyên bố mục tiêu khôi phục của họ: "RTO là năm giây, RPO bằng không." Cách làm của họ là một lệnh <code>pg_dump -Fc</code> hàng đêm lúc 03:15 và một lượt phục hồi đo được 4,4 giây cho một cơ sở dữ liệu 192 MB. Cả hai con số sai ở đâu?',
          ),
          options: [
            B(
              'RTO is right and RPO is wrong: 4.4 seconds is a genuine measurement taken end to end on the real database, but RPO should be stated as the dump duration rather than zero, since <code>pg_dump</code> runs inside a single repeatable-read transaction and writes during those 2.4 seconds are simply not in the snapshot',
              'RTO thì đúng còn RPO thì sai: 4,4 giây là một phép đo thật, lấy từ đầu tới cuối trên chính cơ sở dữ liệu thật, nhưng RPO phải được phát biểu là THỜI LƯỢNG của lượt dump chứ không phải bằng không, vì <code>pg_dump</code> chạy bên trong một giao dịch repeatable-read duy nhất và những lần ghi trong 2,4 giây ấy đơn giản là không nằm trong ảnh chụp',
            ),
            B(
              'Both are wrong because they were measured on the wrong machine: a restore onto the production host competes with live traffic, so the figure to publish is the one measured under load rather than on an idle box',
              'Cả hai đều sai vì đo trên nhầm máy: một lượt phục hồi lên chính máy production sẽ cạnh tranh với lưu lượng thật, nên con số đáng công bố là con số đo DƯỚI TẢI chứ không phải trên một cái máy đang rảnh',
            ),
            B(
              'RPO is right and RTO is wrong: with a nightly dump the recovery point is by definition the last successful backup, which is zero data loss for anything committed before it; RTO is understated only because restore time does not scale linearly',
              'RPO thì đúng còn RTO thì sai: với một lượt dump hàng đêm thì điểm khôi phục theo định nghĩa là bản sao lưu thành công gần nhất, tức là mất 0 dữ liệu với mọi thứ đã chốt trước đó; RTO chỉ bị nói giảm vì thời gian phục hồi không tăng tuyến tính',
            ),
            B(
              'RPO is decided by the cron schedule, not by intention: with a nightly dump it is up to 24 hours, and the honest version is "we lose everything since 03:15 this morning". And 4.4 seconds is the DATABASE part only — provisioning a machine, restoring config, reissuing certificates and waiting out DNS is where the hours go',
              'RPO do LỊCH CRON quyết định chứ không do ý định: với một lượt dump hàng đêm thì nó lên tới 24 giờ, và bản thật thà là "chúng ta mất tất cả từ 03:15 sáng nay". Còn 4,4 giây chỉ là phần CƠ SỞ DỮ LIỆU — dựng một cái máy, phục hồi cấu hình, xin lại chứng chỉ và ngồi chờ DNS mới là chỗ hàng giờ đồng hồ trôi đi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Say the RPO out loud before an incident, because you will have to say it during one. "We lose everything since 03:15" is a sentence somebody has to hear, and it is decided by a line in a crontab rather than by a policy document. Shrinking it is either linear and cheap (more frequent dumps, still hours) or a step change in machinery (continuous WAL archiving, minutes). The RTO error is the more common one and it is structural: the database is the part with a stopwatch on it precisely because it is the part somebody automated, and every other step is unmeasured. A dump also does not scale gently — doubling the data more than doubles the restore, because index construction grows faster than linearly and a large restore stops fitting in memory — so measure yours once with a stopwatch and write the figure where the person doing the recovery will find it. That single measured sentence, "a full restore of production takes about 40 minutes", is the most useful line in any runbook, and the line above it should be the date it was last rehearsed. Option A names a genuine subtlety about the snapshot boundary and gets the magnitude wrong by four orders: the 2.4 seconds is real and it is not what anyone means by RPO here.',
            'Hãy nói RPO ra thành lời TRƯỚC khi có sự cố, vì rồi bạn sẽ phải nói nó TRONG một sự cố. "Chúng ta mất tất cả từ 03:15" là một câu mà ai đó buộc phải nghe, và nó do một dòng trong crontab quyết định chứ không do một văn bản chính sách. Thu nhỏ nó lại thì hoặc là tuyến tính và rẻ (dump dày hơn, vẫn là hàng giờ), hoặc là một bước nhảy về bộ máy (lưu trữ WAL liên tục, hàng phút). Còn sai lầm về RTO thì phổ biến hơn và mang tính CẤU TRÚC: cơ sở dữ liệu là phần được bấm giờ ĐÚNG VÌ nó là phần có người tự động hoá, còn mọi bước khác thì chưa ai đo. Một bản dump cũng không co giãn nhẹ nhàng — nhân đôi dữ liệu thì làm lượt phục hồi tăng HƠN gấp đôi, vì việc dựng chỉ mục tăng nhanh hơn tuyến tính và một lượt phục hồi lớn thì thôi không vừa bộ nhớ nữa — nên hãy đo cái của BẠN một lần bằng đồng hồ bấm giây rồi ghi con số ấy vào chỗ mà người đi cứu hộ sẽ tìm thấy. Đúng một câu đo được ấy, "phục hồi trọn vẹn production mất khoảng 40 phút", là dòng hữu ích nhất trong mọi cuốn cẩm nang, và dòng ngay phía trên nó phải là NGÀY diễn tập gần nhất. Phương án A gọi tên một chỗ tinh tế CÓ THẬT về ranh giới ảnh chụp và ước sai độ lớn tới bốn bậc: 2,4 giây kia là thật và nó không phải thứ ai đó muốn nói khi nói RPO ở đây.',
          ),
        }),

        // q22 · đáp án B
        mcq({
          prompt: B(
            'A backup script writes to <code>/srv/sao-luu</code> on the same disk as the database, then encrypts and uploads. Measured (numbers from the course): encrypting 21 MB took 58 ms and decrypting 40 ms, and the decrypted file restored byte-identically. Which two objections survive that measurement?',
            'Một script sao lưu ghi vào <code>/srv/sao-luu</code> trên cùng cái đĩa với cơ sở dữ liệu, rồi mã hoá và tải lên. Đo được (số lấy từ giáo trình): mã hoá 21 MB mất 58 ms, giải mã 40 ms, và tệp giải mã ra phục hồi được y hệt từng byte. Hai phản bác nào SỐNG SÓT qua phép đo ấy?',
          ),
          options: [
            B(
              'That 58 ms is measured on a warm cache and will be much slower on a cold one; and that encryption should happen before compression rather than after, since an encrypted stream does not compress',
              'Rằng 58 ms đo trên bộ đệm đang ấm và sẽ chậm hơn nhiều khi nguội; và rằng nên mã hoá TRƯỚC khi nén chứ không phải sau, vì một dòng đã mã hoá thì không nén được',
            ),
            B(
              'That a copy on the same disk as the database is not a copy — the disk this course measured filling is the disk Postgres sits on; and that an encrypted backup whose key lives only on the server it backs up cannot be restored in exactly the scenario it was made for',
              'Rằng một bản sao nằm trên CÙNG cái đĩa với cơ sở dữ liệu thì không phải một bản sao — chính cái đĩa mà khoá học này đo thấy đầy dần là cái đĩa Postgres đang ngồi; và rằng một bản sao lưu đã mã hoá mà khoá chỉ sống trên chính máy chủ nó sao lưu thì KHÔNG phục hồi được trong đúng cái kịch bản nó sinh ra để phòng',
            ),
            B(
              'That the timing proves nothing because <code>openssl enc</code> is not authenticated, so a corrupted ciphertext decrypts to garbage without an error; and that the upload should be verified with a checksum computed before encryption rather than after',
              'Rằng con số thời gian chẳng chứng minh gì vì <code>openssl enc</code> không có xác thực, nên một bản mã bị hỏng sẽ giải ra rác mà không báo lỗi; và rằng lượt tải lên nên được kiểm bằng một tổng kiểm tính TRƯỚC khi mã hoá chứ không phải sau',
            ),
            B(
              'That encryption at 1.2% of the restore time is too cheap to be meaningful, so the figure is probably wrong; and that a backup on a separate disk is enough, since a machine loses its disks together only in the rare case of physical destruction',
              'Rằng mã hoá chỉ chiếm 1,2% thời gian phục hồi thì rẻ tới mức vô nghĩa, nên con số ấy chắc là sai; và rằng một bản sao lưu trên một đĩa RIÊNG là đủ, vì một cái máy chỉ mất hết đĩa cùng lúc trong trường hợp hiếm hoi là bị phá huỷ vật lý',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The timing settles the question it was asked — encryption costs about 1.2% of the restore, so there is no argument for skipping it — and it settles nothing about placement or key custody, which are the two things that actually decide whether you get your data back. Chapter 8 measured the disk filling under a build cache on the same disk as PostgreSQL, and a backup written there is a backup that disappears in the same incident it exists to survive; the same reasoning says a dump should not be written to the database\'s disk even temporarily, and that <code>nice -n 19 ionice -c3</code> is what keeps it from competing with real traffic. The key is the subtler one: an encrypted backup is only as recoverable as the passphrase, and that secret has an unusual requirement — it must survive the machine\'s total loss. Password manager, second machine, piece of paper in a drawer. Option C names a real property of <code>openssl enc</code> worth knowing (it is unauthenticated, which is one reason <code>age</code> is a better tool for this) and its second half inverts the useful order: verify by restoring the file you actually stored, decryption included, which is what the weekly rehearsal in this chapter is for.',
            'Con số thời gian giải quyết đúng câu hỏi mà nó được hỏi — mã hoá tốn chừng 1,2% thời gian phục hồi, nên chẳng có lý lẽ nào để bỏ qua nó — và nó KHÔNG giải quyết gì về chỗ ĐẶT lẫn chỗ GIỮ KHOÁ, hai thứ thật sự quyết định bạn có lấy lại được dữ liệu hay không. Chương 8 đo cảnh cái đĩa đầy dần vì một bộ đệm dựng nằm cùng đĩa với PostgreSQL, và một bản sao lưu ghi ở đó là một bản sao lưu biến mất trong đúng cái sự cố mà nó tồn tại để sống sót qua; cũng lập luận ấy nói rằng một bản dump không nên được ghi lên đĩa của cơ sở dữ liệu dù chỉ tạm thời, và rằng <code>nice -n 19 ionice -c3</code> mới là thứ giữ cho nó khỏi tranh giành với lưu lượng thật. Cái khoá mới là chỗ tinh vi hơn: một bản sao lưu đã mã hoá chỉ khôi phục được ngang với cái mật khẩu của nó, và cái bí mật ấy mang một yêu cầu KHÁC THƯỜNG — nó phải sống sót qua việc mất hoàn toàn cái máy. Trình quản lý mật khẩu, một cái máy thứ hai, một mảnh giấy trong ngăn kéo. Phương án C gọi tên một tính chất CÓ THẬT của <code>openssl enc</code> đáng biết (nó không có xác thực, và đó là một lý do <code>age</code> là công cụ tốt hơn cho việc này) còn nửa sau của nó thì đảo ngược thứ tự có ích: hãy kiểm chứng bằng cách PHỤC HỒI đúng cái tệp bạn thật sự đã cất đi, kể cả bước giải mã, và đó chính là mục đích của lượt diễn tập hàng tuần trong chương này.',
          ),
        }),

        // q23 · đáp án A
        mcq({
          prompt: B(
            'A backup cron entry, with the two details people leave out:' +
            code('15 3 * * * /usr/local/bin/sao-luu.sh >> /var/log/sao-luu.log 2>&1\n\n' +
                 'nice -n 19 ionice -c3 pg_dump -Fc -d thu -f "$TEP.tam"\n' +
                 'mv -f "$TEP.tam" "$TEP"\n' +
                 'ls -1t "$DICH"/thu-*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f'),
            'What is the <code>.tam</code> rename for, and which step is deliberately still missing from this script?',
            'Một mục cron sao lưu, kèm hai chi tiết mà người ta hay bỏ:' +
            code('15 3 * * * /usr/local/bin/sao-luu.sh >> /var/log/sao-luu.log 2>&1\n\n' +
                 'nice -n 19 ionice -c3 pg_dump -Fc -d thu -f "$TEP.tam"\n' +
                 'mv -f "$TEP.tam" "$TEP"\n' +
                 'ls -1t "$DICH"/thu-*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f'),
            'Cái đuôi <code>.tam</code> rồi đổi tên dùng để làm gì, và bước nào CỐ Ý vẫn còn thiếu trong script này?',
          ),
          options: [
            B(
              'So a backup that is still being written never has the real name, which means an interrupted dump can never be mistaken for a finished one — the same write-then-rename idea as the atomic symlink swap. What is missing is the step that PROVES the file can be restored: everything here measures making a file, and a file is not a backup',
              'Để một bản sao lưu ĐANG ĐƯỢC GHI không bao giờ mang cái tên thật, nghĩa là một lượt dump bị đứt không bao giờ bị nhầm thành một lượt đã xong — cùng cái ý ghi-rồi-đổi-tên với cú tráo symlink nguyên tử. Thứ còn THIẾU là bước CHỨNG MINH tệp ấy phục hồi được: mọi thứ ở đây mới đo việc TẠO RA MỘT TỆP, mà một cái tệp thì chưa phải một bản sao lưu',
            ),
            B(
              'So the pruner cannot delete the file being written, since <code>ls -1t thu-*.dump</code> does not match <code>.tam</code>; what is missing is a lock, because two overlapping cron runs would otherwise both write the same timestamped name',
              'Để script dọn không xoá mất cái tệp đang được ghi, vì <code>ls -1t thu-*.dump</code> không khớp <code>.tam</code>; thứ còn thiếu là một cái KHOÁ, vì nếu không thì hai lượt cron chồng nhau sẽ cùng ghi vào một cái tên có dấu thời gian giống nhau',
            ),
            B(
              'So the dump lands on the same filesystem as its final name and the move is a rename rather than a copy; what is missing is <code>--exclude-table</code> for the large audit tables, without which the nightly window is too long',
              'Để bản dump rơi xuống cùng một hệ tệp với cái tên cuối cùng của nó và phép dời là một lần đổi tên chứ không phải một lần chép; thứ còn thiếu là <code>--exclude-table</code> cho mấy bảng nhật ký lớn, thiếu nó thì cửa sổ chạy đêm quá dài',
            ),
            B(
              'So a partially written file is compressed separately from a complete one, which keeps the two size series comparable; what is missing is an off-site upload, since every copy in the script lands on the same host',
              'Để một tệp ghi dở được nén riêng khỏi một tệp hoàn chỉnh, giữ cho hai chuỗi kích thước còn so được với nhau; thứ còn thiếu là một lượt tải lên NGOÀI máy, vì mọi bản sao trong script đều đáp xuống cùng một máy chủ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A file only gets its real name once it is complete — the same idea as writing a release into a new directory and moving the symlink last, and as rsync writing each file to a temporary name before renaming it into place. It is one line and it removes a whole class of "the backup exists and is 51 MB and is wrong". The missing step is the point of the whole chapter: nothing in that script proves the file can be restored, and every cheap check can be passed by a broken backup — the file exists, it is the right size, <code>pg_restore --list</code> listed it cleanly, the cron job exited 0. All of that is evidence that something was written. The verification that counts restores into a temporary database and compares per-table row counts, which was measured at 4,688 ms — the entire cost of knowing your backup works, run after every backup, against the alternative of discovering it during an incident. Option D names a real omission and it is not the one this script is built around; option B describes a hazard the timestamped name already prevents. And one thing in the script that is easy to overlook: <code>nice -n 19 ionice -c3</code>, which is what stops a dump reading every row of every table from competing with live traffic and evicting your working set from the page cache.',
            'Một cái tệp chỉ nhận được cái tên THẬT của nó khi nó đã hoàn chỉnh — cùng một ý với việc ghi một bản phát hành vào một thư mục mới rồi dời symlink ở bước cuối, và với việc rsync ghi từng tệp vào một cái tên tạm trước khi đổi tên vào chỗ. Nó chỉ là một dòng và nó xoá đi cả một lớp tình huống "bản sao lưu vẫn còn đó, nặng 51 MB, và nó sai". Bước còn thiếu chính là điểm mấu chốt của cả chương: KHÔNG có gì trong script ấy chứng minh cái tệp phục hồi được, mà mọi phép kiểm rẻ tiền đều bị một bản sao lưu hỏng vượt qua — tệp có tồn tại, kích thước hợp lý, <code>pg_restore --list</code> liệt kê sạch sẽ, việc cron thoát 0. Tất cả những thứ đó chỉ là bằng chứng rằng đã có cái gì đó được GHI RA. Phép kiểm chứng THẬT thì phục hồi vào một cơ sở dữ liệu tạm rồi đối chiếu số dòng từng bảng, thứ đo được 4.688 ms — toàn bộ cái giá của việc BIẾT rằng bản sao lưu của bạn chạy được, chạy sau mỗi lượt sao lưu, so với lựa chọn còn lại là phát hiện ra nó trong một sự cố. Phương án D gọi tên một thiếu sót CÓ THẬT nhưng không phải thiếu sót mà script này được dựng quanh; phương án B mô tả một mối nguy mà chính cái tên có dấu thời gian đã ngăn sẵn. Và một thứ trong script rất dễ bị bỏ qua: <code>nice -n 19 ionice -c3</code>, thứ ngăn một lượt dump đọc mọi dòng của mọi bảng khỏi tranh giành với lưu lượng thật và khỏi hất bộ dữ liệu đang làm việc của bạn ra khỏi bộ đệm trang.',
          ),
        }),

        /* ── Chương 11 — chẩn đoán (7 câu) ─────────────────────────────── */

        // q24 · đáp án C
        mcq({
          prompt: B(
            'It is 09:00 and the site is broken. A deploy went out at 08:57. Two numbers from earlier in this course: a rollback is about 140 ms, and a bad version live for 18.6 seconds wrote 240 poisoned rows. What do those two numbers settle, and what is the single exception?',
            'Bây giờ là 09:00 và trang web đang hỏng. Một lần deploy vừa ra lúc 08:57. Hai con số từ phần trước của khoá này: một cú lùi bản mất khoảng 140 ms, và một bản hỏng sống 18,6 giây đã ghi ra 240 dòng nhiễm độc. Hai con số ấy phân xử điều gì, và NGOẠI LỆ duy nhất là gì?',
          ),
          options: [
            B(
              'They settle that you should diagnose first: 140 ms is so cheap that it can wait until you know what you are rolling back from, and rolling back before you understand the failure is how a fix gets deployed twice. The exception is a data-corrupting bug, where speed outweighs understanding',
              'Chúng phân xử rằng bạn nên CHẨN ĐOÁN TRƯỚC: 140 ms rẻ tới mức nó chờ được cho tới khi bạn biết mình đang lùi khỏi cái gì, và lùi bản trước khi hiểu cú hỏng là cách một bản vá bị deploy hai lần. Ngoại lệ là một con bọ làm hỏng dữ liệu, khi mà tốc độ nặng hơn sự thấu hiểu',
            ),
            B(
              'They settle nothing on their own: 18.6 seconds and 240 rows is a rate of 12.9 writes a second, which is too low to be representative, so the decision has to be made from your own write rate rather than from these figures',
              'Tự chúng chẳng phân xử gì cả: 18,6 giây và 240 dòng là nhịp 12,9 lần ghi mỗi giây, thấp tới mức không đại diện được, nên quyết định phải dựa trên nhịp ghi của CHÍNH BẠN chứ không dựa vào mấy con số này',
            ),
            B(
              'They settle the sequencing: roll back FIRST and diagnose afterwards — you lose nothing because the artifact is still there, and every second spent understanding is a second the bad version keeps writing. The exception is when the previous release cannot run against the current schema, which is knowable in advance',
              'Chúng phân xử THỨ TỰ: LÙI TRƯỚC rồi chẩn đoán sau — bạn chẳng mất gì vì tạo tác vẫn còn nguyên đó, còn mỗi giây bỏ ra để thấu hiểu là một giây bản hỏng còn tiếp tục GHI. Ngoại lệ là khi bản phát hành TRƯỚC không chạy nổi trên lược đồ hiện tại, và điều đó thì BIẾT TRƯỚC được',
            ),
            B(
              'They settle that a rollback should be automatic: at 140 ms it is cheap enough for the smoke test to trigger it without a human, and the exception is a failure detected more than a few minutes after the deploy, where an automatic rollback would be surprising',
              'Chúng phân xử rằng cú lùi bản nên TỰ ĐỘNG: ở mức 140 ms thì nó đủ rẻ để bộ kiểm khói tự kích hoạt mà không cần con người, và ngoại lệ là một cú hỏng được phát hiện sau vài phút kể từ lần deploy, khi mà một cú lùi tự động sẽ gây bất ngờ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Under pressure the failure mode is not ignorance, it is doing the third thing first. The two numbers are what make the ordering an argument rather than a preference: rolling back costs almost nothing and is fully reversible, while the bad version is writing rows you will have to identify and repair later — and identification is exact only if you planned for it with a release-stamp column. So: stop the clock, then investigate. The exception is narrow and is exactly the "rollback distance" you established when you wrote the migration — if the previous release reads a column this deploy\'s migration removed, rolling back replaces one broken state with a different broken state. If you do not know the answer to that question at 09:00, you have just learned why it is worth answering while you are calm. Option D describes something that already exists in a different form and overstates it: the deploy script\'s own smoke test does trigger a rollback automatically, and it can only do that for failures it detects <em>during</em> the deploy — this chapter is about the failure that surfaces twenty minutes later, where nothing is going to roll back for you.',
            'Dưới áp lực, kiểu hỏng không phải là THIẾU HIỂU BIẾT mà là làm việc thứ ba TRƯỚC. Hai con số ấy là thứ biến cái thứ tự này thành một LẬP LUẬN chứ không phải một sở thích: lùi bản gần như chẳng tốn gì và hoàn tác được hoàn toàn, trong khi bản hỏng thì đang GHI ra những dòng mà rồi bạn sẽ phải đi nhận diện và sửa chữa — và việc nhận diện chỉ CHÍNH XÁC nếu bạn đã lo trước bằng một cột đóng dấu bản phát hành. Vậy nên: CẦM MÁU trước, rồi mới điều tra. Ngoại lệ thì hẹp và nó chính là cái "khoảng lùi" mà bạn đã xác lập khi viết migration — nếu bản trước đọc một cột mà migration của lần deploy này vừa gỡ đi thì lùi bản chỉ là thay một trạng thái hỏng bằng một trạng thái hỏng khác. Nếu lúc 09:00 bạn không biết câu trả lời cho câu hỏi ấy thì bạn vừa học được vì sao nó đáng được trả lời lúc bạn còn bình tĩnh. Phương án D mô tả một thứ vốn đã tồn tại dưới dạng khác rồi nói quá lên: bộ kiểm khói của chính script deploy CÓ tự kích hoạt một cú lùi bản, và nó chỉ làm được thế với những cú hỏng nó phát hiện TRONG lúc deploy — còn chương này nói về cú hỏng nổi lên hai mươi phút sau, khi chẳng có gì sẽ lùi bản giùm bạn.',
          ),
        }),

        // q25 · đáp án D
        mcq({
          prompt: B(
            'One command from the front door, run at the start of an incident:' +
            code("curl -s -o /dev/null -w 'ma=%{http_code} tong=%{time_total}s\\n' \\\n" +
                 '     --max-time 10 https://vidu.com/'),
            'It separates three different investigations. Which classification is complete, and which row is the one people forget?',
            'Một câu lệnh gọi từ cửa trước, chạy ngay đầu một sự cố:' +
            code("curl -s -o /dev/null -w 'ma=%{http_code} tong=%{time_total}s\\n' \\\n" +
                 '     --max-time 10 https://vidu.com/'),
            'Nó tách ra ba cuộc điều tra khác nhau. Cách phân loại nào là ĐẦY ĐỦ, và dòng nào là dòng người ta hay quên?',
          ),
          options: [
            B(
              'DOWN (no answer at all), BROKEN (5xx from the application or a dependency), SLOW (200 but slow, meaning something is saturated) — three outcomes with three separate investigations, and the forgotten one is SLOW, because a status-code check has no opinion about duration and reports it as healthy',
              'CHẾT (không trả lời gì cả), VỠ (5xx từ ứng dụng hoặc một phụ thuộc), CHẬM (200 nhưng chậm, nghĩa là có thứ gì đó đang bão hoà) — ba kết cục với ba cuộc điều tra riêng, và cái bị quên là CHẬM, vì một phép kiểm theo mã trạng thái chẳng có ý kiến gì về thời gian nên báo nó là khoẻ',
            ),
            B(
              'DOWN, BROKEN, SLOW and TIMED OUT — the fourth being the case where <code>--max-time</code> fires, which is distinct from DOWN because the connection was established; the forgotten one is TIMED OUT, since curl reports it with an empty status rather than a code',
              'CHẾT, VỠ, CHẬM và HẾT GIỜ — cái thứ tư là ca mà <code>--max-time</code> nổ, khác với CHẾT vì kết nối ĐÃ được thiết lập; cái bị quên là HẾT GIỜ, vì curl báo nó bằng một mã trạng thái rỗng chứ không phải một con số',
            ),
            B(
              'Only two outcomes matter — reachable and unreachable — because everything else is an application problem rather than a deploy problem and belongs to whoever owns the code; the forgotten step is checking from a second machine, since a monitor on the machine it monitors cannot report that the machine is gone',
              'Chỉ hai kết cục có ý nghĩa — với tới được và không với tới được — vì mọi thứ còn lại là vấn đề của ứng dụng chứ không phải của deploy và thuộc về người sở hữu đoạn mã; bước bị quên là kiểm từ một cái máy THỨ HAI, vì một bộ giám sát nằm trên chính cái máy nó giám sát thì không báo nổi rằng cái máy ấy đã biến mất',
            ),
            B(
              'DOWN (no answer at all — DNS, firewall, or the machine), BROKEN (5xx, fast — the application or a dependency), SLOW (200 but slow — something is saturated), and WRONG (200, fast, and the wrong content — a stale cache or the wrong version). WRONG is the forgotten one: no error anywhere, not in the status, not in the logs, not in the metrics',
              'CHẾT (không trả lời gì — DNS, tường lửa, hoặc cái máy), VỠ (5xx, nhanh — ứng dụng hoặc một phụ thuộc), CHẬM (200 nhưng chậm — có tài nguyên nào đó bão hoà), và SAI (200, nhanh, và NỘI DUNG SAI — một bộ đệm cũ hoặc nhầm phiên bản). SAI mới là cái bị quên: không lỗi ở đâu cả, không trong mã trạng thái, không trong log, không trong số liệu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three questions with three different investigations, plus a fourth outcome that has no error attached to it anywhere — and Chapter 6 measured it: a rollback that worked perfectly while every user was served the rolled-back version for five minutes, because a proxy cache sat in front. Status 200, sub-second, entirely wrong. The only way to see it is to compare the version served against the version deployed, which is two commands: <code>curl -s https://vidu.com/ban</code> and <code>basename "$(readlink -f /srv/app/hien-tai)"</code>. Option B names a real distinction and misplaces it: a <code>--max-time</code> abort is the extreme end of SLOW rather than a fourth category, and the way to tell it from DOWN is the timing breakdown — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code> — which says exactly where it stopped. Option C names something genuinely important as if it replaced the classification: checking from a second machine is what catches DNS, TLS, the firewall and an unreachable machine, and it is the subject of its own lesson, but it does not tell you which of the four rows you are in once you can reach the site.',
            'Ba câu hỏi với ba cuộc điều tra khác nhau, cộng thêm một kết cục thứ tư mà chẳng có lỗi nào bám vào ở bất cứ đâu — và Chương 6 đã đo nó: một cú lùi bản chạy hoàn hảo trong khi mọi người dùng được phục vụ chính cái bản vừa bị lùi suốt năm phút, vì một bộ đệm proxy ngồi phía trước. Mã 200, dưới một giây, và SAI HOÀN TOÀN. Cách duy nhất nhìn thấy nó là so PHIÊN BẢN ĐANG PHỤC VỤ với PHIÊN BẢN ĐÃ DEPLOY, tức hai câu lệnh: <code>curl -s https://vidu.com/ban</code> và <code>basename "$(readlink -f /srv/app/hien-tai)"</code>. Phương án B gọi tên một phân biệt CÓ THẬT và đặt nhầm chỗ: một cú <code>--max-time</code> ngắt là đầu cực đoan của CHẬM chứ không phải một hạng mục thứ tư, và cách phân biệt nó với CHẾT là bảng chia nhỏ thời gian — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code> — thứ nói chính xác nó dừng ở đâu. Phương án C gọi tên một thứ thật sự quan trọng như thể nó THAY THẾ cách phân loại: kiểm từ một cái máy thứ hai là thứ bắt được DNS, TLS, tường lửa và một cái máy không với tới được, và nó có hẳn một bài riêng, nhưng nó không nói cho bạn biết bạn đang ở dòng nào trong bốn dòng kia một khi bạn đã với tới được trang web.',
          ),
        }),

        // q26 · đáp án A
        mcq({
          prompt: B(
            'Question 3 of the first five minutes walks inwards through the layers:' +
            code('curl -sI https://vidu.com/          # DNS + TLS + tuong lua + proxy + app\n' +
                 'curl -sI http://127.0.0.1:3390/     # proxy + app\n' +
                 'curl -sI http://127.0.0.1:3391/     # chi app\n' +
                 "psql -d nt -c 'select 1'            # chi CSDL") +
            'What does the first failing line tell you, and what does it not tell you?',
            'Câu hỏi thứ 3 của năm phút đầu đi VÀO TRONG, qua từng tầng một:' +
            code('curl -sI https://vidu.com/          # DNS + TLS + tuong lua + proxy + app\n' +
                 'curl -sI http://127.0.0.1:3390/     # proxy + app\n' +
                 'curl -sI http://127.0.0.1:3391/     # chi app\n' +
                 "psql -d nt -c 'select 1'            # chi CSDL") +
            'Dòng ĐẦU TIÊN bị hỏng nói cho bạn biết điều gì, và KHÔNG nói cho bạn biết điều gì?',
          ),
          options: [
            B(
              'It tells you your LAYER — everything below it is fine and can be left alone, everything above it is a symptom. It does not tell you the layer at FAULT: a health check at 200 with the homepage at 502 is a proxy failure caused by a config change, and a database killed by a build script is a database failure caused by a build',
              'Nó nói cho bạn biết TẦNG của mình — mọi thứ bên dưới nó thì ổn và cứ để yên, mọi thứ bên trên nó là triệu chứng. Nó KHÔNG nói cho bạn biết tầng CÓ LỖI: một chốt kiểm sức khoẻ trả 200 trong khi trang chủ trả 502 là một cú hỏng ở proxy do một thay đổi cấu hình gây ra, còn một cơ sở dữ liệu bị một script dựng giết là một cú hỏng ở cơ sở dữ liệu do một bản dựng gây ra',
            ),
            B(
              'It tells you the layer at fault directly, which is the point of walking inwards: each command removes exactly one layer, so the first failure isolates the responsible component by construction. It does not tell you the severity, which needs the timing breakdown',
              'Nó nói THẲNG cho bạn biết tầng CÓ LỖI, và đó là mục đích của việc đi vào trong: mỗi câu lệnh gỡ đi đúng một tầng, nên cú hỏng đầu tiên cô lập được thành phần chịu trách nhiệm theo đúng cấu tạo. Nó không nói cho bạn mức độ nghiêm trọng, thứ cần tới bảng chia nhỏ thời gian',
            ),
            B(
              'It tells you nothing until all four have been run, because a failure at an outer layer can be caused by an inner one; the sequence has to be read bottom-up, starting from the database and working outwards',
              'Nó chẳng nói gì cho tới khi chạy hết cả bốn, vì một cú hỏng ở tầng ngoài có thể do tầng trong gây ra; chuỗi lệnh ấy phải được đọc TỪ DƯỚI LÊN, bắt đầu từ cơ sở dữ liệu rồi đi ra ngoài',
            ),
            B(
              'It tells you whether the problem is inside or outside your machine, and nothing finer: the three inner commands all run on localhost, so any of them failing means the same thing — a local process is not answering — and distinguishing them needs the logs',
              'Nó nói cho bạn biết vấn đề nằm TRONG hay NGOÀI cái máy của bạn, và không gì chi tiết hơn: ba câu lệnh bên trong đều chạy trên localhost, nên cái nào hỏng cũng có nghĩa như nhau — một tiến trình cục bộ không trả lời — và muốn phân biệt chúng thì phải đọc log',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The walk is cheap and it narrows fast: if the hostname fails and the proxy port answers, the problem is DNS, TLS, the firewall or reachability; if the proxy fails and the app port answers, it is the nginx config, the upstream or the cache; if the app fails and the database answers, it is the application, its config or its release. That is worth a great deal at 09:00. What it deliberately does not answer is <em>why</em>, and this course has three separate measurements of the failing layer and the responsible change being different things: a rollback that left <code>/health</code> at 200 while every real endpoint returned 500, because the application was fine and the schema had moved; a database killed by a build script that exited 0; and a proxy returning 200 on one location block and 502 on another. That is precisely why Question 1 — "did I cause this?" — comes first: a failure that starts within minutes of a deploy is caused by that deploy until proven otherwise, and that is base rates rather than a heuristic. Option C inverts a real caution into a rule that would waste the fastest tool you have.',
            'Chuỗi đi vào ấy rẻ và nó thu hẹp nhanh: nếu tên miền hỏng mà cổng proxy trả lời thì vấn đề là DNS, TLS, tường lửa hoặc khả năng với tới; nếu proxy hỏng mà cổng ứng dụng trả lời thì đó là cấu hình nginx, upstream hoặc bộ đệm; nếu ứng dụng hỏng mà cơ sở dữ liệu trả lời thì đó là ứng dụng, cấu hình của nó, hoặc bản phát hành của nó. Từng ấy đã đáng giá rất nhiều vào lúc 09:00. Thứ nó CỐ Ý không trả lời là câu VÌ SAO, và khoá này có tới ba phép đo riêng biệt cho việc tầng HỎNG và thay đổi CÓ LỖI là hai thứ khác nhau: một cú lùi bản để lại <code>/health</code> ở 200 trong khi mọi endpoint thật trả 500, vì ứng dụng thì không sao mà lược đồ đã đi tiếp; một cơ sở dữ liệu bị một script dựng thoát-0 giết; và một con proxy trả 200 ở khối location này và 502 ở khối kia. Chính vì thế câu hỏi số 1 — "có phải mình vừa gây ra không?" — mới đứng trước: một cú hỏng bắt đầu trong vòng vài phút sau một lần deploy thì DO lần deploy ấy gây ra cho tới khi chứng minh được điều ngược lại, và đó là XÁC SUẤT NỀN chứ không phải một quy tắc ngón tay cái. Phương án C lộn ngược một lời dặn có thật thành một quy tắc sẽ làm lãng phí đúng cái công cụ nhanh nhất bạn đang có.',
          ),
        }),

        // q27 · đáp án B
        mcq({
          prompt: B(
            '<code>curl</code> returns nothing at all — no status code. The breakdown flags say where it stopped:' +
            code("curl -s -o /dev/null --max-time 10 -w \\\n" +
                 "  'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} chu-dau=%{time_starttransfer}\\n' \\\n" +
                 '  https://vidu.com/') +
            'A run reports <code>dns</code> and <code>tcp</code> as non-zero and <code>tls</code> as 0. What is the diagnosis, and which check would never have found it?',
            '<code>curl</code> chẳng trả về gì cả — không có mã trạng thái nào. Các cờ chia nhỏ thời gian nói cho biết nó dừng ở đâu:' +
            code("curl -s -o /dev/null --max-time 10 -w \\\n" +
                 "  'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} chu-dau=%{time_starttransfer}\\n' \\\n" +
                 '  https://vidu.com/') +
            'Một lượt chạy báo <code>dns</code> và <code>tcp</code> khác 0 còn <code>tls</code> bằng 0. Chẩn đoán là gì, và phép kiểm nào sẽ KHÔNG BAO GIỜ tìm ra nó?',
          ),
          options: [
            B(
              'The upstream is refusing after the connection is accepted, which is the sub-millisecond 502 signature one layer in; a check on the proxy port would have found it, and only an external check misses it',
              'Upstream đang từ chối SAU khi kết nối đã được nhận, đó là chữ ký của cú 502 dưới một mili giây ở tầng bên trong; một phép kiểm vào cổng proxy đã tìm ra nó, và chỉ một phép kiểm từ bên ngoài mới bỏ sót',
            ),
            B(
              'The TLS handshake failed — an expired or wrong certificate. An HTTP check against <code>127.0.0.1</code> never touches TLS, so it stays green through the entire outage; only a check over the real hostname from another machine exercises it',
              'Cú bắt tay TLS đã hỏng — chứng chỉ hết hạn hoặc sai chứng chỉ. Một phép kiểm HTTP vào <code>127.0.0.1</code> không hề chạm tới TLS, nên nó vẫn XANH suốt cả sự cố; chỉ một phép kiểm qua TÊN MIỀN THẬT từ một cái máy khác mới thử tới nó',
            ),
            B(
              'DNS resolved to a stale address and the connection reached the wrong machine, which answered the TCP handshake and then nothing; a check that pins the address with <code>--resolve</code> would have found it',
              'DNS phân giải ra một địa chỉ cũ và kết nối đã tới nhầm máy, cái máy đó bắt tay TCP xong rồi im; một phép kiểm ghim địa chỉ bằng <code>--resolve</code> đã tìm ra nó',
            ),
            B(
              'The server accepted the connection and never answered, which is the 504 case; the timing shows it because <code>chu-dau</code> would equal the configured <code>proxy_read_timeout</code>, and a shallow health check would have found it immediately',
              'Máy chủ đã nhận kết nối rồi không bao giờ trả lời, đó là ca 504; bảng thời gian cho thấy điều đó vì <code>chu-dau</code> sẽ đúng bằng <code>proxy_read_timeout</code> đã cấu hình, và một chốt kiểm sức khoẻ nông sẽ tìm ra nó ngay lập tức',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the flags in order: <code>dns=0</code> means the name did not resolve, <code>dns</code> fine and <code>tcp=0</code> means the port is unreachable — firewall, security group, or the machine is off — <code>tcp</code> fine and <code>tls=0</code> means the handshake failed, and <code>tls</code> fine with <code>chu-dau</code> growing means the server is thinking and this is not a connectivity problem at all. An expired certificate is the case worth memorising because of what it does to your monitoring: every local check keeps passing, the process is up, the port is bound, <code>/health</code> on <code>127.0.0.1</code> returns 200, and nobody can reach the site. The same is true of DNS pointing at an old address and of a firewall rule closing 443. That is the argument for an external check in one line — a monitor on the machine it monitors cannot report the failures that matter most, because when the server is unreachable so is anything running on it. The check itself should use the real hostname (which exercises DNS, TLS, the firewall and the proxy — four things a loopback check cannot see) and should grep the body for something only the working page contains, because a 200 that renders an error page is still a 200. A free uptime service checking one URL every five minutes covers most of this and costs nothing; the important property is not sophistication, it is location.',
            'Hãy đọc các cờ theo thứ tự: <code>dns=0</code> nghĩa là tên không phân giải được, <code>dns</code> ổn mà <code>tcp=0</code> nghĩa là cổng không với tới được — tường lửa, nhóm bảo mật, hoặc cái máy đã tắt — <code>tcp</code> ổn mà <code>tls=0</code> nghĩa là cú bắt tay hỏng, còn <code>tls</code> ổn mà <code>chu-dau</code> cứ tăng dần thì máy chủ đang SUY NGHĨ và đây hoàn toàn không phải vấn đề kết nối. Chứng chỉ hết hạn là ca đáng thuộc lòng vì thứ nó gây ra cho hệ thống giám sát của bạn: mọi phép kiểm cục bộ vẫn ĐẠT, tiến trình vẫn lên, cổng vẫn mở, <code>/health</code> trên <code>127.0.0.1</code> vẫn trả 200, và KHÔNG AI vào được trang web. Chuyện tương tự với DNS trỏ vào một địa chỉ cũ và với một luật tường lửa đóng cổng 443. Đó là lý lẽ cho một phép kiểm TỪ BÊN NGOÀI, gói trong một câu: một bộ giám sát nằm trên chính cái máy nó giám sát thì KHÔNG báo được những cú hỏng quan trọng nhất, vì khi máy chủ không với tới được thì mọi thứ chạy trên đó cũng vậy. Bản thân phép kiểm ấy nên dùng TÊN MIỀN THẬT (thứ thử tới DNS, TLS, tường lửa và proxy — bốn thứ mà một phép kiểm loopback không nhìn thấy) và nên grep phần thân tìm một chuỗi chỉ trang hoạt động tốt mới có, vì một cú 200 dựng ra trang báo lỗi thì vẫn là 200. Một dịch vụ theo dõi uptime miễn phí gọi một URL mỗi năm phút là phủ được gần hết chuyện này và chẳng tốn gì; tính chất quan trọng không phải sự tinh vi, mà là VỊ TRÍ.',
          ),
        }),

        // q28 · đáp án D
        mcq({
          prompt: B(
            'A deploy reported success and nothing changed. Three commands, and four possible readings:' +
            code('curl -s http://cua-truoc/ban              # nguoi dung thay ban nao\n' +
                 'basename "$(readlink -f /srv/app/hien-tai)"  # symlink tro dau\n' +
                 "ss -ltnp | grep ':3391 '                  # tien trinh nao giu cong"),
            'Match the four readings to their causes. Which set is right?',
            'Một lần deploy báo thành công mà chẳng có gì thay đổi. Ba câu lệnh, và bốn cách đọc khả dĩ:' +
            code('curl -s http://cua-truoc/ban              # nguoi dung thay ban nao\n' +
                 'basename "$(readlink -f /srv/app/hien-tai)"  # symlink tro dau\n' +
                 "ss -ltnp | grep ':3391 '                  # tien trinh nao giu cong"),
            'Hãy ghép bốn cách đọc với nguyên nhân của chúng. Bộ nào đúng?',
          ),
          options: [
            B(
              'symlink old → the transport failed silently and left the previous release in place · symlink new but process old → the proxy cached the old upstream and is still routing to it · all new but front door old → the browser is caching the document · exit 0 with no log → the script was killed by the supervisor before it could write anything',
              'symlink cũ → lượt vận chuyển hỏng âm thầm và để nguyên bản phát hành trước · symlink mới mà tiến trình cũ → proxy đã đệm cái upstream cũ và vẫn đang định tuyến vào đó · cả hai mới mà cửa trước cũ → trình duyệt đang đệm cái tài liệu · thoát 0 mà không log → script bị trình giám sát giết trước khi kịp ghi ra gì',
            ),
            B(
              'symlink old → the lock was held so nothing ran · symlink new but process old → the readiness check passed too early · all new but front door old → DNS is pointing elsewhere · exit 0 with no log → the log file was rotated mid-deploy',
              'symlink cũ → khoá đang bị giữ nên chẳng có gì chạy · symlink mới mà tiến trình cũ → phép kiểm sẵn sàng đạt quá sớm · cả hai mới mà cửa trước cũ → DNS đang trỏ đi nơi khác · thoát 0 mà không log → tệp log bị xoay vòng giữa lúc deploy',
            ),
            B(
              'All four readings have the same cause — a stale build — because a build that did not change cannot change what is served, whatever the symlink and the process say; the three commands only tell you how far along the deploy got before it stopped, and the fix in every case is a full clean redeploy rather than a targeted repair',
              'Cả bốn cách đọc đều cùng một nguyên nhân — một bản dựng cũ — vì một bản dựng KHÔNG đổi thì không thể đổi được thứ đang được phục vụ, bất kể symlink và tiến trình nói gì; ba câu lệnh ấy chỉ nói cho bạn biết lần deploy đi được tới đâu thì dừng, và cách chữa trong mọi ca đều là một lần deploy lại sạch sẽ, đầy đủ, chứ không phải một cú vá có mục tiêu',
            ),
            B(
              'symlink old → the deploy exited BEFORE the swap; read the log and find the last numbered step · symlink new but process old → it was never restarted, because a running process does not follow a symlink that changes · both new but front door old → a cache; purge and re-check · exit 0 with no log at all → the script REFUSED and said so quietly, which is what a prompt with no terminal does',
              'symlink cũ → lần deploy đã thoát TRƯỚC bước tráo; hãy đọc nhật ký và tìm bước đánh số cuối cùng · symlink mới mà tiến trình cũ → nó chưa bao giờ được khởi động lại, vì một tiến trình đang chạy KHÔNG đi theo một symlink vừa đổi · cả hai đều mới mà cửa trước cũ → một bộ đệm; dọn rồi kiểm lại · thoát 0 mà KHÔNG có nhật ký nào → script đã TỪ CHỐI và nói ra điều đó một cách lặng lẽ, đúng thứ mà một lời hỏi không có terminal sẽ làm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three commands, four states, and each one points at a different lesson in the course. The symlink-new-process-old case is the mechanism that broke the reference swap script\'s own cleanup handler: repointing the link is invisible to a process that resolved the path at start-up, so a rollback has to restore the <em>process</em> and not merely the pointer. The both-new-front-door-old case is the five-minute proxy cache, and the fix is to purge and then compare the version served rather than the status code. And the exit-0-no-log case is the one that is hardest to believe until you have seen it: a confirmation prompt softened with <code>|| true</code> or given a default exits 0 without deploying, so run from cron, CI or a background job the deploy never happens while every indicator says it did — which this repository documents in its own notes about running the deploy script in the background. Option A gets two of four right in a way worth noticing: "the browser is caching" is a real cause of a related symptom and is unreachable by any command you can run, which is the argument for <code>no-store</code> on HTML documents; it is not what explains a front door serving the old version to everybody.',
            'Ba câu lệnh, bốn trạng thái, và mỗi trạng thái trỏ về một bài học khác nhau trong khoá. Ca symlink-mới-tiến-trình-cũ chính là cơ chế đã phá vỡ trình xử lý dọn dẹp của chính script tráo mẫu: dời con trỏ là chuyện VÔ HÌNH với một tiến trình đã giải xong đường dẫn từ lúc khởi động, nên một cú lùi bản buộc phải khôi phục cả TIẾN TRÌNH chứ không chỉ con trỏ. Ca cả-hai-mới-cửa-trước-cũ là cái bộ đệm proxy năm phút, và cách chữa là DỌN rồi so PHIÊN BẢN ĐANG PHỤC VỤ chứ không so mã trạng thái. Còn ca thoát-0-không-log là ca khó tin nhất cho tới khi bạn tận mắt thấy: một lời hỏi xác nhận bị làm mềm bằng <code>|| true</code> hoặc được cho một giá trị mặc định sẽ thoát 0 mà KHÔNG deploy, nên chạy từ cron, từ CI hay từ một việc chạy nền thì lần deploy chẳng bao giờ xảy ra trong khi mọi chỉ báo đều nói là đã xảy ra — đúng điều mà kho mã này ghi lại trong ghi chú của chính nó về việc chạy script deploy ở chế độ nền. Phương án A đúng hai trên bốn theo một cách đáng để ý: "trình duyệt đang đệm" là một nguyên nhân CÓ THẬT của một triệu chứng họ hàng và nó KHÔNG với tới được bằng bất cứ câu lệnh nào bạn chạy, và đó chính là lý lẽ cho <code>no-store</code> trên các tài liệu HTML; nhưng nó không phải thứ giải thích được việc cửa trước đang phục vụ bản cũ cho TẤT CẢ mọi người.',
          ),
        }),

        // q29 · đáp án C
        mcq({
          prompt: B(
            'An acceptance suite against a complete stack. The first ten checks passed on the first run; five harder ones were added and found two things:' +
            code(' ✓ 11. phien ban cua truoc KHOP voi symlink\n' +
                 ' ✓ 12. API dat content-type JSON\n' +
                 ' ✓ 13. loi 500 KHONG lo vet ngan xep\n' +
                 ' ✗ 14. KHONG lo phien ban qua header\n' +
                 ' ✓ 15. log co truong thoi gian\n\n' +
                 'Kiem lai check 13: /api/v1/bai-loi tra ve 404, khong phai 500.') +
            'Check 13 passed. What was wrong with it, and what is the general rule?',
            'Một bộ nghiệm thu chạy trên một chồng máy chủ hoàn chỉnh. Mười phép kiểm đầu ĐẠT ngay lượt chạy đầu tiên; năm phép khó hơn được thêm vào và tìm ra hai thứ:' +
            code(' ✓ 11. phien ban cua truoc KHOP voi symlink\n' +
                 ' ✓ 12. API dat content-type JSON\n' +
                 ' ✓ 13. loi 500 KHONG lo vet ngan xep\n' +
                 ' ✗ 14. KHONG lo phien ban qua header\n' +
                 ' ✓ 15. log co truong thoi gian\n\n' +
                 'Kiem lai check 13: /api/v1/bai-loi tra ve 404, khong phai 500.') +
            'Phép kiểm 13 đã ĐẠT. Nó sai ở đâu, và quy tắc chung là gì?',
          ),
          options: [
            B(
              'It used the wrong URL, which is a typo rather than a design flaw — the check itself asserts exactly the right thing about exactly the right response body; the general rule is to generate the check list from the router at build time, so a renamed or removed route cannot silently drop out of the suite the way this one did',
              'Nó dùng nhầm URL, đó là lỗi gõ chứ không phải khiếm khuyết thiết kế — bản thân phép kiểm khẳng định ĐÚNG thứ cần khẳng định trên ĐÚNG thân phản hồi cần soi; quy tắc chung là SINH RA danh sách kiểm từ bộ định tuyến ngay lúc dựng, để một tuyến bị đổi tên hay bị gỡ không thể âm thầm rơi khỏi bộ kiểm theo đúng cái cách mà tuyến này đã rơi',
            ),
            B(
              'It tested the right thing at the wrong layer: a stack trace would have been visible in the application log rather than in the response, so the check should read the log instead of the body; the general rule is to assert on the source of truth rather than on a rendering of it',
              'Nó kiểm đúng thứ nhưng ở nhầm TẦNG: một vết ngăn xếp sẽ hiện trong log ứng dụng chứ không phải trong phản hồi, nên phép kiểm phải đọc LOG thay vì đọc thân phản hồi; quy tắc chung là khẳng định trên NGUỒN SỰ THẬT chứ không trên một bản dựng lại của nó',
            ),
            B(
              'It passed TRIVIALLY — it was inspecting a "not found" page and correctly finding no stack trace in it, so it had never tested anything. The general rule is that a green suite is evidence about the SUITE: make the failure happen on purpose and confirm the check goes red, or you have bought confidence rather than coverage',
              'Nó ĐẠT MỘT CÁCH TẦM THƯỜNG — nó đang soi một trang "không tìm thấy" và tìm đúng là chẳng có vết ngăn xếp nào ở đó, nên nó chưa hề kiểm thứ gì cả. Quy tắc chung là: một bộ kiểm XANH là bằng chứng về CHÍNH BỘ KIỂM — hãy cố ý làm cho cú hỏng xảy ra và xác nhận phép kiểm ĐỎ lên, nếu không thì bạn vừa mua sự tự tin chứ không mua độ phủ',
            ),
            B(
              'It passed because the application was correct: 404 is the right answer for a URL that does not exist, so check 13 is fine and the real finding is check 14, which is the only line in the transcript that changed anything',
              'Nó đạt vì ứng dụng ĐÚNG: 404 là câu trả lời đúng cho một URL không tồn tại, nên phép kiểm 13 chẳng sao cả, và phát hiện thật là phép kiểm 14, dòng duy nhất trong đoạn terminal làm thay đổi được điều gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Ten out of ten on the first run is a warning rather than a result: a suite that passes immediately is usually testing what you already knew was true. Check 13 is the sharper version of the same problem — it did not merely test something obvious, it tested nothing at all, and it reported green while doing so. Adding an endpoint that genuinely throws exposed the real defect underneath: the error handler was returning <code>x-ban: v1</code> to anyone who could trigger an error, which tells an attacker exactly which release is running. Both findings share a property worth naming: they are invisible from inside the application. The <code>Server: nginx/1.24.0 (Ubuntu)</code> header that check 14 caught is added by the proxy, and checking headers rather than only status codes is what made it visible at all — every response in that run was 200 or 500 exactly as expected. This is the same shape as the readiness check written with a tool that was not installed, which burned three seconds per deploy to learn nothing and exited 0. A check nobody has seen fail is a check nobody has tested, and it is worth less than no check, because it produces confidence.',
            'Mười trên mười ngay lượt chạy đầu là một lời CẢNH BÁO chứ không phải một kết quả: một bộ kiểm đạt ngay lập tức thường là đang kiểm đúng những thứ bạn vốn đã biết là đúng. Phép kiểm 13 là phiên bản sắc hơn của cùng vấn đề ấy — nó không chỉ kiểm một thứ hiển nhiên, nó KHÔNG kiểm gì cả, và nó báo XANH trong lúc làm thế. Thêm vào một endpoint thật sự NÉM lỗi đã phơi ra khiếm khuyết thật nằm bên dưới: trình xử lý lỗi đang trả về <code>x-ban: v1</code> cho bất cứ ai kích được một lỗi, thứ nói cho kẻ tấn công biết chính xác bản phát hành nào đang chạy. Cả hai phát hiện chia sẻ một tính chất đáng gọi tên: chúng VÔ HÌNH khi nhìn từ bên trong ứng dụng. Cái header <code>Server: nginx/1.24.0 (Ubuntu)</code> mà phép kiểm 14 bắt được là do proxy thêm vào, và việc kiểm cả HEADER chứ không chỉ mã trạng thái mới là thứ làm nó hiện ra — mọi phản hồi trong lượt chạy ấy đều là 200 hoặc 500 đúng như dự kiến. Đây cùng hình dạng với phép kiểm sẵn sàng viết bằng một công cụ không được cài, thứ đốt ba giây mỗi lần deploy để học được con số không rồi thoát 0. Một phép kiểm chưa ai từng thấy nó ĐỎ là một phép kiểm chưa ai kiểm thử, và nó đáng giá ÍT HƠN việc không có phép kiểm nào, vì nó sinh ra sự tự tin.',
          ),
        }),

        // q30 · đáp án B
        mcq({
          prompt: B(
            'A colleague says "nothing changed — nobody deployed today". What is the accurate response, and what does it mean for the first five minutes?',
            'Một đồng nghiệp nói "chẳng có gì thay đổi cả — hôm nay không ai deploy". Câu đáp CHÍNH XÁC là gì, và nó có nghĩa gì với năm phút đầu tiên?',
          ),
          options: [
            B(
              'They are right, and the investigation should therefore skip the deploy log and go straight to the resource checks: with no deploy, the machine is the only thing that can have changed, and <code>vmstat</code> is the fastest way to narrow it',
              'Họ đúng, và vì thế cuộc điều tra nên bỏ qua nhật ký deploy mà đi thẳng vào các phép kiểm tài nguyên: không có lần deploy nào thì cái máy là thứ duy nhất có thể đã thay đổi, và <code>vmstat</code> là cách nhanh nhất để thu hẹp lại',
            ),
            B(
              'They mean nobody deployed, which is a much smaller claim than nothing changed. A certificate expired, a disk crossed a threshold, a cron job ran for the first time this month, an upstream provider deployed, a log rotated. So question 1 is still "did I cause this?" — it just has a wider definition of "I"',
              'Ý họ là không ai DEPLOY, và đó là một lời khai NHỎ HƠN NHIỀU so với "chẳng có gì thay đổi". Một chứng chỉ hết hạn, một cái đĩa vượt ngưỡng, một việc cron chạy lần đầu trong tháng, một nhà cung cấp phía trên vừa deploy, một tệp log vừa xoay vòng. Nên câu hỏi số 1 vẫn là "có phải mình gây ra không?" — chỉ là chữ "mình" có nghĩa rộng hơn',
            ),
            B(
              'They are right about the deploy and wrong about the conclusion: the correct response is to roll back anyway, because the previous release is known to work and a rollback is cheap enough to use as a diagnostic step even when no deploy is suspected',
              'Họ đúng về chuyện deploy và sai về kết luận: câu đáp đúng là cứ LÙI BẢN, vì bản phát hành trước đã được biết là chạy tốt và một cú lùi rẻ tới mức dùng được như một bước chẩn đoán ngay cả khi chẳng nghi ngờ lần deploy nào',
            ),
            B(
              'The claim is unfalsifiable and therefore not worth engaging with; the first five minutes should proceed identically whether or not anybody deployed, since the layer walk isolates the failure without needing to know what changed',
              'Lời khai ấy không bác bỏ được nên chẳng đáng tranh luận; năm phút đầu tiên nên diễn ra y hệt nhau bất kể có ai deploy hay không, vì chuỗi đi qua từng tầng đã cô lập được cú hỏng mà chẳng cần biết cái gì đã thay đổi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Chapter 8 measured a disk filling from build cache alone with nobody touching the machine, and this course has several other examples of the same shape: a weekly cron reclaiming disk, a certificate with a fixed expiry date, a log growing until it crosses a boundary that makes some writes fail and some succeed. "Nothing changed" is almost always false; what people mean is that <em>they</em> did not change anything, which leaves everything scheduled, everything external and everything monotonic still in scope. That is why the first question stays the same and only its scope widens: <code>git log --oneline -5</code>, the deploy log\'s modification time, and <code>readlink -f</code> on the release symlink are still the three cheapest facts in an incident, and to them you add the certificate expiry, <code>df -h; df -i</code>, and <code>dmesg | grep -i oom</code>. Option C over-applies a good default: the rollback-first rule is for a failure that starts within minutes of a deploy, and rolling back when no deploy happened changes a system nobody has evidence against — which also destroys the evidence. Option D discards the most useful prior you have: most things that change on a server are changed by somebody, and base rates are a diagnostic tool rather than an accusation.',
            'Chương 8 đã đo cảnh một cái đĩa đầy dần chỉ vì bộ đệm dựng, chẳng ai đụng vào cái máy cả, và khoá này còn vài ví dụ khác cùng hình dạng: một việc cron hàng tuần đi thu hồi đĩa, một chứng chỉ có ngày hết hạn cố định, một tệp log phình lên tới khi vượt một cái ranh giới làm một số lần ghi hỏng và một số lần ghi được. "Chẳng có gì thay đổi" gần như luôn SAI; ý người ta là CHÍNH HỌ không đổi gì, và điều đó vẫn để lại trong phạm vi mọi thứ chạy theo lịch, mọi thứ ở bên ngoài, và mọi thứ tăng đơn điệu. Vì thế câu hỏi đầu tiên vẫn giữ nguyên và chỉ mở rộng phạm vi: <code>git log --oneline -5</code>, thời gian sửa của nhật ký deploy, và <code>readlink -f</code> trên cái symlink bản phát hành vẫn là ba sự kiện rẻ nhất trong một sự cố, và bạn thêm vào đó ngày hết hạn chứng chỉ, <code>df -h; df -i</code>, cùng <code>dmesg | grep -i oom</code>. Phương án C áp một mặc định tốt quá tay: quy tắc lùi-trước dành cho một cú hỏng bắt đầu trong vòng vài phút sau một lần deploy, còn lùi bản khi chẳng có lần deploy nào là đi thay đổi một hệ thống mà chưa ai có bằng chứng chống lại nó — và làm thế cũng huỷ luôn bằng chứng. Phương án D thì vứt bỏ cái tiên nghiệm hữu ích nhất bạn đang có: phần lớn những thứ thay đổi trên một máy chủ là do NGƯỜI thay đổi, và xác suất nền là một công cụ chẩn đoán chứ không phải một lời buộc tội.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Track a disk budget through a deploy, and say exactly when it runs out (chapter 8.4).</b> Implement <code>chay</code>: it replays the given list of operations against a 2000 MB filesystem and prints one line per operation.</p>' +
            '<p>ext4 keeps <b>5% of the blocks for root</b>, so the ceiling an ordinary process can write to is <code>TONG - TONG × 5 / 100</code> = 1900 MB. Everything below is integer arithmetic — no filesystem, no <code>df</code>.</p>' +
            '<p>Five buckets make up what <code>df</code> counts: the database, the log, the build cache, <b>debris from a release that only half unpacked</b>, and the releases themselves. One more bucket is counted by <code>df</code> and <b>not</b> by <code>du</code>: a log that was deleted while a process still had it open.</p>' +
            '<ul>' +
            '<li><code>khoi-dau csdl N</code> / <code>khoi-dau log N</code> — set the starting size.</li>' +
            '<li><code>phat-hanh vN M</code> — unpack a release of M MB. If it does not fit, unpack what fits, note <code>ENOSPC — chi giai nen duoc &lt;vua&gt;/&lt;M&gt; MB, ban phat hanh DO DANG</code>, and put those MB in the debris bucket — <b>the release is not created</b>.</li>' +
            '<li><code>bo-dem +M</code> / <code>log +M</code> — grow, with the same partial-write rule (<code>ENOSPC — chi ghi duoc &lt;vua&gt;/&lt;M&gt; MB, ban dung HONG</code> and <code>ENOSPC — chi ghi duoc &lt;vua&gt;/&lt;M&gt; MB</code>).</li>' +
            '<li><code>prune-bo-dem</code> — clear the build cache <b>only</b>. Debris is not build cache.</li>' +
            '<li><code>don-ban K</code> — keep the K newest releases, delete the rest, note <code>xoa=[…]</code>.</li>' +
            '<li><code>xoa-log-dang-mo</code> — <code>rm</code> the log while a process holds it open: it moves out of <code>du</code>\'s view and stays in <code>df</code>\'s. Note <code>rm giai phong 0 MB</code>.</li>' +
            '<li><code>cat-cut-log</code> — truncate through <code>/proc/&lt;pid&gt;/fd</code>: this is what returns the space. Note <code>cat cut tra lai &lt;N&gt; MB</code>.</li>' +
            '<li><code>wal N</code> — the database writes N MB, all or nothing. It fits or it prints <code>ENOSPC errno 28 — CSDL KHONG ghi duoc</code> and nothing is written; otherwise <code>ghi OK</code>.</li>' +
            '</ul>' +
            '<p>The line format — operation padded to 18 characters, then four right-aligned numbers, then the releases, then the note if there is one:</p>' +
            code('wal 5              df_dung=1685 du_thay=1685 trong= 215 rac=  0 ban=[v1,v2] ghi OK') +
            '<p><code>trong</code> is <code>nguong − df_dung</code>, never negative. Keep the two constants, the operations array and the printing header exactly as they are, and use no external commands beyond <code>printf</code>, <code>echo</code>, <code>tr</code> and <code>sed</code>.</p>',

            '<p><b>Câu 31 — Theo dấu ngân sách đĩa xuyên qua một lần deploy, và nói chính xác lúc nào nó cạn (chương 8.4).</b> Cài đặt <code>chay</code>: phát lại danh sách thao tác cho sẵn trên một hệ tệp 2000 MB rồi in mỗi thao tác một dòng.</p>' +
            '<p>ext4 giữ lại <b>5% số khối cho root</b>, nên cái trần mà một tiến trình thường ghi tới được là <code>TONG - TONG × 5 / 100</code> = 1900 MB. Mọi thứ dưới đây là số học SỐ NGUYÊN — không đụng hệ tệp, không <code>df</code>.</p>' +
            '<p>Năm cái thùng làm nên thứ mà <code>df</code> đếm: cơ sở dữ liệu, log, bộ đệm dựng, <b>mảnh vụn của một bản phát hành giải nén dở dang</b>, và bản thân các bản phát hành. Còn một cái thùng nữa mà <code>df</code> đếm còn <code>du</code> thì <b>KHÔNG</b>: một tệp log bị xoá trong khi một tiến trình vẫn đang giữ nó mở.</p>' +
            '<ul>' +
            '<li><code>khoi-dau csdl N</code> / <code>khoi-dau log N</code> — đặt kích thước ban đầu.</li>' +
            '<li><code>phat-hanh vN M</code> — giải nén một bản phát hành M MB. Không vừa thì giải được bao nhiêu hay bấy nhiêu, ghi chú <code>ENOSPC — chi giai nen duoc &lt;vua&gt;/&lt;M&gt; MB, ban phat hanh DO DANG</code>, và bỏ số MB ấy vào thùng MẢNH VỤN — <b>bản phát hành KHÔNG được tạo ra</b>.</li>' +
            '<li><code>bo-dem +M</code> / <code>log +M</code> — phình to ra, cùng quy tắc ghi được một phần (<code>ENOSPC — chi ghi duoc &lt;vua&gt;/&lt;M&gt; MB, ban dung HONG</code> và <code>ENOSPC — chi ghi duoc &lt;vua&gt;/&lt;M&gt; MB</code>).</li>' +
            '<li><code>prune-bo-dem</code> — dọn <b>duy nhất</b> bộ đệm dựng. Mảnh vụn KHÔNG phải bộ đệm dựng.</li>' +
            '<li><code>don-ban K</code> — giữ K bản phát hành mới nhất, xoá phần còn lại, ghi chú <code>xoa=[…]</code>.</li>' +
            '<li><code>xoa-log-dang-mo</code> — <code>rm</code> tệp log trong khi một tiến trình còn giữ nó mở: nó rời khỏi tầm nhìn của <code>du</code> và Ở LẠI trong tầm nhìn của <code>df</code>. Ghi chú <code>rm giai phong 0 MB</code>.</li>' +
            '<li><code>cat-cut-log</code> — cắt cụt qua <code>/proc/&lt;pid&gt;/fd</code>: ĐÂY mới là thứ trả lại chỗ. Ghi chú <code>cat cut tra lai &lt;N&gt; MB</code>.</li>' +
            '<li><code>wal N</code> — cơ sở dữ liệu ghi N MB, được ăn cả ngã về không. Vừa thì thôi, không vừa thì in <code>ENOSPC errno 28 — CSDL KHONG ghi duoc</code> và KHÔNG ghi được gì; vừa thì <code>ghi OK</code>.</li>' +
            '</ul>' +
            '<p>Khuôn dòng — tên thao tác đệm tới 18 ký tự, rồi bốn con số canh phải, rồi danh sách bản phát hành, rồi ghi chú nếu có:</p>' +
            code('wal 5              df_dung=1685 du_thay=1685 trong= 215 rac=  0 ban=[v1,v2] ghi OK') +
            '<p><code>trong</code> là <code>nguong − df_dung</code>, không bao giờ âm. Giữ nguyên hai hằng số, mảng thao tác và dòng tiêu đề in ra, và đừng dùng lệnh ngoài nào ngoài <code>printf</code>, <code>echo</code>, <code>tr</code> và <code>sed</code>.</p>',
          ),
          starterCode: PT3_Q31_STARTER,
          expectedOutput: PT3_Q31_OUTPUT,
          sampleSolution: PT3_Q31_SOLUTION,
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Turn a sequence of container events into an exit code (chapters 3.2, 8.1 and 8.5).</b> Implement <code>giai(buoc)</code>: it replays one scenario\'s steps and returns <code>{ ma, oom, log, cho, vi }</code> — the exit code, whether Docker would mark <code>OOMKilled</code>, whether the application log has anything in it, how many seconds the caller waited, and a short reason.</p>' +
            '<p>Every number below was measured with <code>docker run</code> on a real daemon.</p>' +
            '<ul>' +
            '<li><code>docker-co-sai</code> → <b>125</b>: docker itself refused the options, so the container never existed. Log <code>trong</code>.</li>' +
            '<li><code>chay ung-dung</code> → the process is running. <code>chay khong-co-lenh</code> → <b>127</b>. <code>chay thu-muc</code> and <code>chay co-nhung-khong-x</code> → <b>126</b>, found but not executable.</li>' +
            '<li><code>bay TERM</code> → the application installs a SIGTERM handler.</li>' +
            '<li><code>tin-hieu KILL</code> → <b>137</b> (128 + 9), and the log is <code>trong</code>, because SIGKILL cannot be caught.</li>' +
            '<li><code>tin-hieu TERM</code> → with a handler, <b>0</b> and the log reads <code>co: da dong sach</code>. <b>Without</b> a handler the process is STILL RUNNING: PID 1 in a namespace ignores a signal whose action is the default unless it installs one.</li>' +
            '<li><code>stop -t &lt;giay&gt;</code> → with a handler, <b>0</b> immediately. Without, the runtime waits <code>&lt;giay&gt;</code> seconds and then sends SIGKILL: <b>137</b>, <code>cho</code> = that many seconds, log <code>trong</code>.</li>' +
            '<li><code>oom</code> → <b>137</b> as well, log <code>trong</code>, but <code>oom</code> is true — that flag is the only thing separating the two.</li>' +
            '<li><code>v8-het-heap</code> → <b>133</b>, and the log reads <code>co: FATAL ERROR ... heap out of memory</code>: the process ended itself and said why.</li>' +
            '<li><code>thoat &lt;n&gt;</code> → <b>n</b>, passed through unchanged.</li>' +
            '</ul>' +
            '<p>Once a scenario has an exit code, every later step is meaningless and is skipped. A scenario that never dies reports <code>ma</code> as the string <code>DANG CHAY</code>.</p>' +
            '<p>The printing block builds the line; you only have to return the object. Keep the scenario array and that block exactly as they are, and use only what Node has built in.</p>',

            '<p><b>Câu 32 — Biến một chuỗi sự kiện container thành một MÃ THOÁT (chương 3.2, 8.1 và 8.5).</b> Cài đặt <code>giai(buoc)</code>: phát lại các bước của một kịch bản rồi trả về <code>{ ma, oom, log, cho, vi }</code> — mã thoát, Docker có đánh dấu <code>OOMKilled</code> không, log ứng dụng có gì trong đó không, bên gọi đã chờ bao nhiêu giây, và một lý do ngắn.</p>' +
            '<p>Mọi con số dưới đây đều đã ĐO THẬT bằng <code>docker run</code> trên một daemon thật.</p>' +
            '<ul>' +
            '<li><code>docker-co-sai</code> → <b>125</b>: chính docker từ chối tuỳ chọn, nên container chưa từng tồn tại. Log <code>trong</code>.</li>' +
            '<li><code>chay ung-dung</code> → tiến trình đang chạy. <code>chay khong-co-lenh</code> → <b>127</b>. <code>chay thu-muc</code> và <code>chay co-nhung-khong-x</code> → <b>126</b>, tìm thấy nhưng không chạy được.</li>' +
            '<li><code>bay TERM</code> → ứng dụng cài một trình xử lý SIGTERM.</li>' +
            '<li><code>tin-hieu KILL</code> → <b>137</b> (128 + 9), và log <code>trong</code>, vì SIGKILL không bắt được.</li>' +
            '<li><code>tin-hieu TERM</code> → có trình xử lý thì <b>0</b> và log ghi <code>co: da dong sach</code>. KHÔNG có trình xử lý thì tiến trình VẪN ĐANG CHẠY: PID 1 trong một namespace BỎ QUA những tín hiệu có hành động mặc định, trừ khi chính nó cài một trình xử lý.</li>' +
            '<li><code>stop -t &lt;giay&gt;</code> → có trình xử lý thì <b>0</b> ngay lập tức. Không có thì runtime chờ <code>&lt;giay&gt;</code> giây rồi gửi SIGKILL: <b>137</b>, <code>cho</code> bằng đúng số giây ấy, log <code>trong</code>.</li>' +
            '<li><code>oom</code> → cũng <b>137</b>, log <code>trong</code>, nhưng <code>oom</code> là true — cái cờ ấy là thứ DUY NHẤT tách hai ca này ra.</li>' +
            '<li><code>v8-het-heap</code> → <b>133</b>, và log ghi <code>co: FATAL ERROR ... heap out of memory</code>: tiến trình tự kết thúc và NÓI RA vì sao.</li>' +
            '<li><code>thoat &lt;n&gt;</code> → <b>n</b>, đi qua nguyên vẹn.</li>' +
            '</ul>' +
            '<p>Một khi kịch bản đã có mã thoát thì mọi bước sau đều vô nghĩa và bị bỏ qua. Một kịch bản không bao giờ chết thì báo <code>ma</code> là chuỗi <code>DANG CHAY</code>.</p>' +
            '<p>Khối in kết quả tự dựng dòng; bạn chỉ cần trả về cái đối tượng. Giữ nguyên mảng kịch bản và khối ấy, và chỉ dùng những gì Node có sẵn.</p>',
          ),
          starterCode: PT3_Q32_STARTER,
          expectedOutput: PT3_Q32_OUTPUT,
          sampleSolution: PT3_Q32_SOLUTION,
        }),
      ],
    },
  ],
};
