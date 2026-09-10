/**
 * Deploy VPS — Progress Test 1 (Mục 0 → Chương 3).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi, bám sát
 * `content/courses/deploy-vps/s00-intro` … `s03-trao`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ KHÔNG MỘT BYTE NÀO CHẠM VÀO HẠ TẦNG THẬT
 * ────────────────────────────────────────────────────────────────────────────
 * Không SSH tới máy chủ nào, không đụng `cuonghoangdev_db`, không đọc
 * `/opt/cuonghoangdev/.env`, không chạy `deploy.sh` / `deploy-nha.sh` /
 * `gh workflow run` / `git push`. Mọi giá trị nhạy cảm trong đề là GIÁ TRỊ GIẢ,
 * cố ý viết cho khác hẳn giá trị thật (`MAT_KHAU_GIA_LAP`, `khoa-GIA-LAP`).
 *
 * ⚙️ SÂN ĐO (dựng rồi xoá bằng `docker rm -f`)
 *   • "VPS giả": container `debian:12` chạy `--privileged` —
 *     Debian 12.15 (aarch64), bash 5.2.15(1), GNU coreutils 9.1,
 *     rsync 3.2.7 (protocol 32), OpenSSH_9.2p1 Debian-2+deb12u10,
 *     git 2.39.5, curl 7.88.1, gzip 1.12, util-linux 2.38.1 (`flock`),
 *     e2fsprogs, lsof, strace 6.1, python3 3.11.2 (đóng vai ứng dụng).
 *     Trong container có một `sshd` thật nghe cổng 2222 với khoá ed25519 sinh
 *     tại chỗ — dùng cho các phép đo chương 0 về ssh.
 *   • `node:22-slim` (Node v22.23.1, npm 10.9.8) cho phép đo `npm ci` /
 *     `npm install` ở chương 1.
 *   • Docker Engine 29.5.3 / Compose v5.1.4, nhân 6.12.76-linuxkit, linux/arm64.
 *
 * ⚠️ MÁY ĐANG CHẠY NHIỀU TIẾN TRÌNH KHÁC ⇒ đề này KHÔNG hỏi một con số thời
 * gian nào của riêng nó. Chỗ nào cần thời gian thì hỏi CƠ CHẾ, hoặc trích lại
 * con số mà chính giáo trình đã đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỘT CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 * Bài 0.3 nói: một lệnh chạy nền từ xa làm `ssh` treo mãi vì "tiến trình nền
 * thừa kế STDIN của SSH", và cách chữa được viết là thêm `</dev/null`. Đo thật
 * trên OpenSSH_9.2p1 (sshd thật trong container, `timeout 5 ssh …`, mỗi ca ba
 * lượt, kết quả không đổi):
 *
 *     nohup sleep 30 &                          → ssh TREO (timeout, mã 124)
 *     nohup sleep 30 >/tmp/n.log &              → ssh TREO (124)
 *     nohup sleep 30 2>/tmp/n.log &             → ssh TREO (124)
 *     nohup sleep 30 </dev/null &               → ssh TREO (124)   ← cách sách
 *     nohup sleep 30 >/tmp/n.log 2>&1 &         → ssh THOÁT 0
 *     nohup sleep 30 >/tmp/n.log 2>&1 </dev/null & → ssh THOÁT 0
 *
 * Tức là thứ giữ `ssh` lại là HAI LUỒNG RA (`stdout` và `stderr`) mà tiến trình
 * nền còn giữ mở, chứ không phải `stdin`: chỉ `</dev/null` thôi thì vẫn treo,
 * còn `>log 2>&1` mà KHÔNG có `</dev/null` thì thoát sạch. Câu 3 dựng trên
 * phép đo này và theo MÁY. (Vẫn nên viết cả ba — `</dev/null` là thứ bảo vệ
 * bạn khi lệnh từ xa lỡ đọc bàn phím.)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN PHÁT HIỆN CŨ, ĐÃ GHI Ở `DEPLOY-VPS-FE.mjs` — đề này KHÔNG ra vào đó
 * ────────────────────────────────────────────────────────────────────────────
 * `ln -sfn` nguyên tử trên coreutils 9.1 · mặc định `--whole-file` của rsync ·
 * `ANALYZE` sau `pg_restore` không tái hiện được · ext4 hết inode trước hết
 * khối. Bốn chỗ ấy là phát hiện của đề FE, không phải của đề này.
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
 *     `timeout`). Chỉ POSIX + mảng chỉ số + `case` + khai triển tham số.
 *     Nó còn được ĐỐI CHIẾU VỚI RSYNC THẬT: dựng đúng bảy bộ cờ ấy trên cây
 *     thư mục thật trong container rồi so `find` — khớp TỪNG BYTE cả bảy ca,
 *     kể cả ca `--exclude` che chở thư mục ở ĐÍCH khỏi `--delete` và ca
 *     `--delete-excluded` quét sạch chúng.
 *   • Câu 32 (`javascript`) tự chứa, chỉ dùng `Map`/`Set`/`padEnd`, không
 *     `import`, không `require`, không đụng hệ thống tệp.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây): A 8 · B 8 · C 8 · D 8 = 32 khoá
 * trên 30 câu, vì có hai câu "chọn HAI".
 *
 *   node -e "import('./content/exams/DEPLOY-VPS-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Không trùng câu nào với `DEPLOY-VPS-FE.mjs` (50 câu) và `DEPLOY-VPS-PE.mjs`
 * (5 câu thực hành), và không trùng giữa PT1 / PT2 / PT3.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DEPLOY-VPS-PT1.mjs --apply
 */
import { B, EX, code, c, ptInstructions, mcq, codeQ } from './_lib/deployvps-exam-kit.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   Câu 31 — mô phỏng `rsync --delete` với một danh sách `--exclude` (chương 1–2)
   ══════════════════════════════════════════════════════════════════════════ */

const PT1_Q31_STARTER =
            '#!/usr/bin/env bash\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'nguon=(\n' +
            '  \'src/app.js\'\n' +
            '  \'src/util.js\'\n' +
            '  \'logs/moi.log\'\n' +
            '  \'tai-len/moi.jpg\'\n' +
            '  \'node_modules/x.js\'\n' +
            '  \'.env\'\n' +
            ')\n' +
            '\n' +
            'dich=(\n' +
            '  \'src/cu.js\'\n' +
            '  \'logs/cu.log\'\n' +
            '  \'tai-len/quan-trong.jpg\'\n' +
            '  \'node_modules/cu.js\'\n' +
            '  \'roi-rac.txt\'\n' +
            ')\n' +
            '\n' +
            'ca=(\n' +
            '  \'\'\n' +
            '  \'--delete\'\n' +
            '  \'--exclude node_modules --exclude tai-len --exclude logs --exclude .env\'\n' +
            '  \'--delete --exclude node_modules --exclude tai-len --exclude logs --exclude .env\'\n' +
            '  \'--delete --delete-excluded --exclude node_modules --exclude tai-len --exclude logs --exclude .env\'\n' +
            '  \'--delete --exclude src\'\n' +
            '  \'--delete --exclude roi-rac.txt\'\n' +
            ')\n' +
            '\n' +
            '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'dong_bo() {\n' +
            '  echo \'chua cai dat\' >&2\n' +
            '  return 1\n' +
            '}\n' +
            '\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for co in "${ca[@]}"; do\n' +
            '  printf \'[%s] -> %s\\n\' "$co" "$(dong_bo "$co")"\n' +
            'done\n';

const PT1_Q31_SOLUTION =
            'dong_bo() {\n' +
            '  co=$1\n' +
            '\n' +
            '  # 1. Tách cờ: chỉ có ba thứ cần biết — có --delete không, có\n' +
            '  #    --delete-excluded không, và danh sách mẫu loại trừ là gì.\n' +
            '  co_xoa=0\n' +
            '  co_xoa_ca_loai_tru=0\n' +
            '  loai_tru=\'\'\n' +
            '  cho_mau=0\n' +
            '  for t in $co; do\n' +
            '    if [ "$cho_mau" = 1 ]; then\n' +
            '      loai_tru="$loai_tru $t"\n' +
            '      cho_mau=0\n' +
            '      continue\n' +
            '    fi\n' +
            '    case $t in\n' +
            '      --delete-excluded) co_xoa_ca_loai_tru=1 ;;\n' +
            '      --delete)          co_xoa=1 ;;\n' +
            '      --exclude)         cho_mau=1 ;;\n' +
            '    esac\n' +
            '  done\n' +
            '  # --delete-excluded chỉ có nghĩa khi đi kèm --delete.\n' +
            '  [ "$co_xoa" = 1 ] || co_xoa_ca_loai_tru=0\n' +
            '\n' +
            '  # 2. Một đường dẫn bị loại trừ khi ĐOẠN ĐẦU của nó, hoặc cả đường dẫn,\n' +
            '  #    trùng một mẫu.\n' +
            '  bi_loai() {\n' +
            '    duong=$1\n' +
            '    dau=${duong%%/*}\n' +
            '    for m in $loai_tru; do\n' +
            '      [ "$duong" = "$m" ] && return 0\n' +
            '      [ "$dau" = "$m" ] && return 0\n' +
            '    done\n' +
            '    return 1\n' +
            '  }\n' +
            '\n' +
            '  cuoi=\'\'\n' +
            '  # 3. Chép: mọi thứ ở nguồn KHÔNG bị loại trừ đều có mặt ở đích.\n' +
            '  da_chep=\'\'\n' +
            '  for f in "${nguon[@]}"; do\n' +
            '    bi_loai "$f" && continue\n' +
            '    cuoi="$cuoi $f"\n' +
            '    da_chep="$da_chep $f"\n' +
            '  done\n' +
            '\n' +
            '  # 4. Thứ đang có ở ĐÍCH mà nguồn không gửi tới.\n' +
            '  for f in "${dich[@]}"; do\n' +
            '    trung=0\n' +
            '    for g in $da_chep; do [ "$f" = "$g" ] && trung=1; done\n' +
            '    [ "$trung" = 1 ] && continue          # đã bị ghi đè ở bước 3\n' +
            '\n' +
            '    if [ "$co_xoa" = 0 ]; then\n' +
            '      cuoi="$cuoi $f"                     # không --delete: giữ hết\n' +
            '    elif bi_loai "$f" && [ "$co_xoa_ca_loai_tru" = 0 ]; then\n' +
            '      cuoi="$cuoi $f"                     # --exclude CHE CHỞ nó khỏi --delete\n' +
            '    fi\n' +
            '  done\n' +
            '\n' +
            '  # 5. Sắp theo byte cho kết quả ổn định trên mọi máy.\n' +
            '  echo $cuoi | tr \' \' \'\\n\' | LC_ALL=C sort | tr \'\\n\' \' \' | sed \'s/ $//\'\n' +
            '}\n';

const PT1_Q31_OUTPUT =
            '[] -> .env logs/cu.log logs/moi.log node_modules/cu.js node_modules/x.js roi-rac.txt src/app.js src/cu.js src/util.js tai-len/moi.jpg tai-len/quan-trong.jpg\n' +
            '[--delete] -> .env logs/moi.log node_modules/x.js src/app.js src/util.js tai-len/moi.jpg\n' +
            '[--exclude node_modules --exclude tai-len --exclude logs --exclude .env] -> logs/cu.log node_modules/cu.js roi-rac.txt src/app.js src/cu.js src/util.js tai-len/quan-trong.jpg\n' +
            '[--delete --exclude node_modules --exclude tai-len --exclude logs --exclude .env] -> logs/cu.log node_modules/cu.js src/app.js src/util.js tai-len/quan-trong.jpg\n' +
            '[--delete --delete-excluded --exclude node_modules --exclude tai-len --exclude logs --exclude .env] -> src/app.js src/util.js\n' +
            '[--delete --exclude src] -> .env logs/moi.log node_modules/x.js src/cu.js tai-len/moi.jpg\n' +
            '[--delete --exclude roi-rac.txt] -> .env logs/moi.log node_modules/x.js roi-rac.txt src/app.js src/util.js tai-len/moi.jpg';


/* ══════════════════════════════════════════════════════════════════════════
   Câu 32 — bản phát hành, con trỏ, và tiến trình (chương 0.4, 1.5, 3.5)
   ══════════════════════════════════════════════════════════════════════════ */

const PT1_Q32_STARTER =
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SU_KIEN = [\n' +
            '  \'phat-hanh v1\',\n' +
            '  \'trao v1\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '  \'phat-hanh v2\',\n' +
            '  \'trao v2\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '  \'phat-hanh v3\',\n' +
            '  \'trao v9\',\n' +
            '  \'trao v1\',\n' +
            '  \'don 2\',\n' +
            '  \'trao v3\',\n' +
            '  \'don 2\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '  \'xoa v3\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '  \'phat-hanh v3\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '  \'phat-hanh v3\',\n' +
            '  \'phat-hanh v10\',\n' +
            '  \'trao v10\',\n' +
            '  \'don 2\',\n' +
            '  \'khoi-dong-lai\',\n' +
            '];\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chay(suKien) {\n' +
            '  // chua cai dat\n' +
            '  return [];\n' +
            '}\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const d of chay(SU_KIEN)) console.log(d);\n';

const PT1_Q32_SOLUTION =
            'function chay(suKien) {\n' +
            '  const dia = new Set();\n' +
            '  let ht = null;        // symlink hien-tai trỏ vào đâu (một cái TÊN, không phải thư mục)\n' +
            '  let dangChay = null;  // bản mà TIẾN TRÌNH đang thực thi\n' +
            '  const dong = [];\n' +
            '\n' +
            '  const tenDia = () => [...dia].sort().join(\',\');\n' +
            '  const tenHt = () => (ht === null ? \'KHONG\' : dia.has(ht) ? ht : \'HONG(\' + ht + \')\');\n' +
            '\n' +
            '  for (const sk of suKien) {\n' +
            '    const [lenh, doiSo] = sk.split(\' \');\n' +
            '    let ghiChu = \'\';\n' +
            '\n' +
            '    if (lenh === \'phat-hanh\') {\n' +
            '      if (dia.has(doiSo)) ghiChu = \' TU CHOI: da co \' + doiSo;\n' +
            '      else dia.add(doiSo);\n' +
            '\n' +
            '    } else if (lenh === \'trao\') {\n' +
            '      // Tráo là dời CON TRỎ. Nó không đụng tới tiến trình đang chạy.\n' +
            '      if (!dia.has(doiSo)) ghiChu = \' TU CHOI: khong co ban \' + doiSo;\n' +
            '      else ht = doiSo;\n' +
            '\n' +
            '    } else if (lenh === \'khoi-dong-lai\') {\n' +
            '      // Chỉ ở ĐÂY tiến trình mới đọc lại symlink.\n' +
            '      dangChay = ht !== null && dia.has(ht) ? ht : null;\n' +
            '      if (dangChay === null) ghiChu = \' KHONG co gi phuc vu: hien-tai treo\';\n' +
            '\n' +
            '    } else if (lenh === \'don\') {\n' +
            '      const giu = Number(doiSo);\n' +
            '      // Sắp theo BYTE — đúng như `ls | sort` làm, nên v10 đứng trước v2.\n' +
            '      const theoTen = [...dia].sort();\n' +
            '      const boDi = theoTen.slice(0, Math.max(0, theoTen.length - giu));\n' +
            '      const daXoa = [];\n' +
            '      const boQua = [];\n' +
            '      for (const b of boDi) {\n' +
            '        if (b === ht) { boQua.push(b); continue; }   // KHONG BAO GIO xoá bản đang trỏ tới\n' +
            '        dia.delete(b);\n' +
            '        daXoa.push(b);\n' +
            '      }\n' +
            '      ghiChu = \' xoa=[\' + daXoa.join(\',\') + \']\' + (boQua.length ? \' bo-qua=[\' + boQua.join(\',\') + \']\' : \'\');\n' +
            '\n' +
            '    } else if (lenh === \'xoa\') {\n' +
            '      if (!dia.has(doiSo)) ghiChu = \' TU CHOI: khong co ban \' + doiSo;\n' +
            '      else dia.delete(doiSo);\n' +
            '    }\n' +
            '\n' +
            '    dong.push(\n' +
            '      sk.padEnd(14) + \' -> ht=\' + tenHt().padEnd(9) +\n' +
            '      \' chay=\' + (dangChay === null ? \'KHONG\' : dangChay).padEnd(6) +\n' +
            '      \' dia=[\' + tenDia() + \']\' + ghiChu,\n' +
            '    );\n' +
            '  }\n' +
            '  return dong;\n' +
            '}\n';

const PT1_Q32_OUTPUT =
            'phat-hanh v1   -> ht=KHONG     chay=KHONG  dia=[v1]\n' +
            'trao v1        -> ht=v1        chay=KHONG  dia=[v1]\n' +
            'khoi-dong-lai  -> ht=v1        chay=v1     dia=[v1]\n' +
            'phat-hanh v2   -> ht=v1        chay=v1     dia=[v1,v2]\n' +
            'trao v2        -> ht=v2        chay=v1     dia=[v1,v2]\n' +
            'khoi-dong-lai  -> ht=v2        chay=v2     dia=[v1,v2]\n' +
            'phat-hanh v3   -> ht=v2        chay=v2     dia=[v1,v2,v3]\n' +
            'trao v9        -> ht=v2        chay=v2     dia=[v1,v2,v3] TU CHOI: khong co ban v9\n' +
            'trao v1        -> ht=v1        chay=v2     dia=[v1,v2,v3]\n' +
            'don 2          -> ht=v1        chay=v2     dia=[v1,v2,v3] xoa=[] bo-qua=[v1]\n' +
            'trao v3        -> ht=v3        chay=v2     dia=[v1,v2,v3]\n' +
            'don 2          -> ht=v3        chay=v2     dia=[v2,v3] xoa=[v1]\n' +
            'khoi-dong-lai  -> ht=v3        chay=v3     dia=[v2,v3]\n' +
            'xoa v3         -> ht=HONG(v3)  chay=v3     dia=[v2]\n' +
            'khoi-dong-lai  -> ht=HONG(v3)  chay=KHONG  dia=[v2] KHONG co gi phuc vu: hien-tai treo\n' +
            'phat-hanh v3   -> ht=v3        chay=KHONG  dia=[v2,v3]\n' +
            'khoi-dong-lai  -> ht=v3        chay=v3     dia=[v2,v3]\n' +
            'phat-hanh v3   -> ht=v3        chay=v3     dia=[v2,v3] TU CHOI: da co v3\n' +
            'phat-hanh v10  -> ht=v3        chay=v3     dia=[v10,v2,v3]\n' +
            'trao v10       -> ht=v10       chay=v3     dia=[v10,v2,v3]\n' +
            'don 2          -> ht=v10       chay=v3     dia=[v10,v2,v3] xoa=[] bo-qua=[v10]\n' +
            'khoi-dong-lai  -> ht=v10       chay=v10    dia=[v10,v2,v3]';


export default {
  course: { slug: 'deploy-vps' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 3 (what a deploy is, the artifact, transport, the swap)',
        'Kiểm tra tiến độ 1 — Mục 0 đến Chương 3 (deploy là gì, tạo tác, vận chuyển, bước tráo)',
      ),
      description: B(
        'The first third of the Deploy VPS course: the four steps of a deploy and the four ways each fails quietly, the machine that receives it, deciding exactly which bytes ship, the three transports and what each leaves behind when it is cut in half, and swapping versions without dropping a request. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Deploy VPS: bốn bước của một lần deploy và bốn kiểu hỏng âm thầm của chúng, cái máy nhận lần deploy, quyết định chính xác những byte nào được gửi đi, ba đường vận chuyển và thứ mỗi đường để lại khi bị cắt ngang, và tráo phiên bản mà không rơi một request nào. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      course: { slug: 'deploy-vps' },
      questions: [

        /* ── Mục 0 — một lần deploy thật ra là cái gì (7 câu) ──────────── */

        // q1 · đáp án B
        mcq({
          prompt: B(
            'Two deploys of the same project, at the same moment, from the same directory. In between, <code>src/server.js</code> is being edited and has a syntax error that is <b>not committed</b>:' +
            code('cay lam viec: M src/server.js\n' +
                 '  node --check  → /tmp/duan/src/server.js:5\n\n' +
                 '=== rsync (day CAY LAM VIEC) ===\n' +
                 '  tren may chu: /srv/app/src/server.js:5\n' +
                 '=== git push (day thu DA COMMIT) ===\n' +
                 '  tren may chu: cu phap HOP LE') +
            'What does this measurement decide, and what does it <em>not</em> decide?',
            'Hai lần deploy cùng một dự án, cùng một thời điểm, từ cùng một thư mục. Ở giữa, tệp <code>src/server.js</code> đang bị sửa dở và có lỗi cú pháp <b>chưa commit</b>:' +
            code('cay lam viec: M src/server.js\n' +
                 '  node --check  → /tmp/duan/src/server.js:5\n\n' +
                 '=== rsync (day CAY LAM VIEC) ===\n' +
                 '  tren may chu: /srv/app/src/server.js:5\n' +
                 '=== git push (day thu DA COMMIT) ===\n' +
                 '  tren may chu: cu phap HOP LE') +
            'Phép đo này quyết định điều gì, và KHÔNG quyết định điều gì?',
          ),
          options: [
            B(
              'It decides that rsync is a worse transport than git in general, because it sends more bytes and has no integrity check; the syntax error is one symptom of that, and the fix is to switch every deploy in the project to <code>git push</code>',
              'Nó quyết định rằng rsync là đường vận chuyển tệ hơn git nói chung, vì gửi nhiều byte hơn và không có phép kiểm toàn vẹn; lỗi cú pháp chỉ là một triệu chứng của điều đó, và cách chữa là đổi mọi lần deploy trong dự án sang <code>git push</code>',
            ),
            B(
              'It decides step 1 — <em>which bytes ship</em>: a working tree is not an artifact, so anything you happen to be typing travels. It does not decide the transport, because you can build a committed artifact and then rsync it',
              'Nó quyết định BƯỚC 1 — NHỮNG BYTE NÀO được gửi đi: cây làm việc không phải là một tạo tác, nên bất cứ thứ gì bạn đang gõ dở đều đi theo. Nó KHÔNG quyết định đường vận chuyển, vì bạn hoàn toàn có thể dựng một tạo tác từ mã đã commit rồi rsync chính nó',
            ),
            B(
              'It decides that the developer should have run <code>node --check</code> before deploying; with a pre-deploy syntax gate both transports behave identically, so the difference disappears once the checklist is right',
              'Nó quyết định rằng lập trình viên lẽ ra phải chạy <code>node --check</code> trước khi deploy; có một chốt kiểm cú pháp trước deploy thì hai đường vận chuyển hành xử y hệt nhau, nên khác biệt biến mất khi bảng kiểm đã đúng',
            ),
            B(
              'It decides nothing about deploys: the broken file was going to be committed a minute later anyway, so both servers end up with the same bytes and the measurement only captured a timing coincidence',
              'Nó chẳng quyết định gì về deploy cả: tệp hỏng đằng nào một phút sau cũng được commit, nên cả hai máy chủ rốt cuộc có cùng những byte ấy, và phép đo chỉ chộp được một sự trùng hợp về thời điểm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The artifact is step 1 of four, and it is the step people skip. <code>rsync</code> of a working tree answers "which bytes ship?" with "whatever is in the directory right now", which is the absence of a decision rather than a decision. This project\'s own <code>deploy.sh</code> caught a half-written file from a parallel editing session three separate times, which is why the standard path was changed to build from committed code only. Note what the measurement does <em>not</em> say: transport and artifact are independent axes. <code>git archive HEAD | gzip</code> followed by an rsync of the resulting tarball is committed-only <em>and</em> rsync.',
            'Tạo tác là bước 1 trong bốn bước, và nó là bước người ta hay bỏ qua. <code>rsync</code> một cây làm việc trả lời câu "những byte nào được gửi đi?" bằng "bất cứ thứ gì đang có trong thư mục lúc này" — đó là sự VẮNG MẶT của một quyết định chứ không phải một quyết định. Chính tệp <code>deploy.sh</code> của dự án này đã ba lần chộp trúng một tệp đang gõ dở của một phiên làm việc song song, và đó là lý do đường chuẩn được đổi sang chỉ dựng từ mã đã commit. Hãy để ý thứ phép đo KHÔNG nói: tạo tác và vận chuyển là hai trục độc lập. <code>git archive HEAD | gzip</code> rồi rsync chính tệp nén ấy vừa là "chỉ mã đã commit" vừa là rsync.',
          ),
        }),

        // q2 · đáp án C
        mcq({
          prompt: B(
            'Three rsync runs against a real server over SSH, and then eight small ssh commands two ways (numbers quoted from the course):' +
            code('rsync lan dau (cay 176 KB) → 280 ms\n' +
                 'rsync lan hai (khong doi)  → 286 ms\n' +
                 'rsync sau khi sua 1 tep    → 280 ms\n\n' +
                 '8 lenh ssh RIENG LE        → 1830 ms (228 ms/lenh)\n' +
                 '8 lenh ssh dung CHUNG mot ket noi → 71 ms (8 ms/lenh)') +
            'Why is the first block flat, and what does the second block change?',
            'Ba lần rsync tới một máy chủ thật qua SSH, rồi tám lệnh ssh nhỏ chạy theo hai cách (số trích từ giáo trình):' +
            code('rsync lan dau (cay 176 KB) → 280 ms\n' +
                 'rsync lan hai (khong doi)  → 286 ms\n' +
                 'rsync sau khi sua 1 tep    → 280 ms\n\n' +
                 '8 lenh ssh RIENG LE        → 1830 ms (228 ms/lenh)\n' +
                 '8 lenh ssh dung CHUNG mot ket noi → 71 ms (8 ms/lenh)') +
            'Vì sao khối đầu phẳng lì, và khối sau thay đổi cái gì?',
          ),
          options: [
            B(
              'The first block is flat because rsync caches the file list from the previous run in <code>~/.rsync</code>, so runs two and three skip the scan; <code>ControlMaster</code> then reuses that same cache across commands, which is where the 26× comes from',
              'Khối đầu phẳng vì rsync giữ lại danh sách tệp của lần trước trong <code>~/.rsync</code> nên lần hai và ba bỏ qua bước quét; <code>ControlMaster</code> sau đó dùng lại chính cái cache ấy giữa các lệnh, và đó là chỗ ra con số 26 lần',
            ),
            B(
              'The first block is flat because the tree is small enough to fit in one TCP window, so all three transfers are a single round trip; multiplexing helps only for payloads larger than that window, and the 8 ms figure is a measurement artefact of a warm page cache',
              'Khối đầu phẳng vì cây thư mục đủ nhỏ để lọt vào một cửa sổ TCP, nên cả ba lần đều là một vòng đi-về; ghép kênh chỉ giúp với tải lớn hơn cửa sổ ấy, còn con số 8 ms là tạo tác đo đạc của một page cache đang ấm',
            ),
            B(
              'At this size the payload is free and the SSH handshake — key exchange, authentication, session setup — is the whole cost, so it is paid once per connection regardless of what is sent. <code>ControlMaster</code> pays it once and runs every later command down the same connection',
              'Ở cỡ này thì phần tải là miễn phí và cái BẮT TAY SSH — trao khoá, xác thực, dựng phiên — mới là toàn bộ chi phí, nên nó phải trả một lần cho mỗi KẾT NỐI bất kể gửi gì. <code>ControlMaster</code> trả nó đúng một lần rồi cho mọi lệnh sau đi chung một kết nối',
            ),
            B(
              'The first block is flat because rsync always sends the whole tree and 176 KB is too small to measure; the second block is faster because <code>ControlMaster</code> compresses the eight commands into one batch and sends them together',
              'Khối đầu phẳng vì rsync lúc nào cũng gửi cả cây và 176 KB thì quá nhỏ để đo được; khối sau nhanh hơn vì <code>ControlMaster</code> nén tám lệnh thành một lô rồi gửi chung một lượt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Transferring 176 KB, transferring nothing, and transferring one small file all cost about the same because none of that work is the transfer. The handshake is, and it is per-connection. That is why a deploy script that runs eight separate <code>ssh</code> commands pays ~228 ms eight times before doing anything useful. The fix is four lines in <code>~/.ssh/config</code> — <code>ControlMaster auto</code>, a <code>ControlPath</code>, and <code>ControlPersist 60</code> — and nothing at all on the server. Two things to know afterwards: the control path is a real file, so a stale socket after a crash produces a confusing "control socket already exists" (delete it), and a multiplexed session inherits the master, so editing <code>~/.ssh/config</code> has no effect until the master exits (<code>ssh -O exit vps</code>).',
            'Chuyển 176 KB, chuyển không gì cả, và chuyển một tệp nhỏ đều tốn xấp xỉ như nhau vì không phần nào trong đó là việc TRUYỀN. Cái bắt tay mới là việc, và nó tính theo MỖI KẾT NỐI. Vì thế một script deploy chạy tám lệnh <code>ssh</code> riêng lẻ phải trả ~228 ms tám lần trước khi làm được việc gì có ích. Cách chữa là bốn dòng trong <code>~/.ssh/config</code> — <code>ControlMaster auto</code>, một <code>ControlPath</code>, và <code>ControlPersist 60</code> — và KHÔNG cần gì trên máy chủ. Hai điều nên biết sau đó: đường control là một tệp thật, nên một socket cũ còn sót sau khi sập sẽ đẻ ra thông báo khó hiểu "control socket already exists" (cứ xoá nó đi), và một phiên ghép kênh thừa kế từ phiên chủ, nên sửa <code>~/.ssh/config</code> chẳng có tác dụng gì cho tới khi phiên chủ thoát (<code>ssh -O exit vps</code>).',
          ),
        }),

        // q3 · đáp án A
        mcq({
          prompt: B(
            'Step 3 of a hand deploy starts the application in the background over SSH. Six forms of the same remote command, each run three times under <code>timeout 5 ssh …</code> against a real <code>sshd</code> (OpenSSH_9.2p1); <b>124 means <code>timeout</code> had to kill a hung ssh</b>:' +
            code("nohup sleep 30 &                              → 124\n" +
                 "nohup sleep 30 >/tmp/n.log &                  → 124\n" +
                 "nohup sleep 30 2>/tmp/n.log &                 → 124\n" +
                 "nohup sleep 30 </dev/null &                   → 124\n" +
                 "nohup sleep 30 >/tmp/n.log 2>&1 &             → 0\n" +
                 "nohup sleep 30 >/tmp/n.log 2>&1 </dev/null &  → 0") +
            'What actually keeps ssh open, according to this transcript?',
            'Bước 3 của một lần deploy làm tay khởi động ứng dụng ở chế độ nền qua SSH. Sáu dạng của cùng một lệnh từ xa, mỗi dạng chạy ba lượt dưới <code>timeout 5 ssh …</code> với một <code>sshd</code> thật (OpenSSH_9.2p1); <b>124 nghĩa là <code>timeout</code> phải giết một tiến trình ssh đang treo</b>:' +
            code("nohup sleep 30 &                              → 124\n" +
                 "nohup sleep 30 >/tmp/n.log &                  → 124\n" +
                 "nohup sleep 30 2>/tmp/n.log &                 → 124\n" +
                 "nohup sleep 30 </dev/null &                   → 124\n" +
                 "nohup sleep 30 >/tmp/n.log 2>&1 &             → 0\n" +
                 "nohup sleep 30 >/tmp/n.log 2>&1 </dev/null &  → 0") +
            'Theo đúng đoạn terminal này thì cái gì đang giữ ssh lại?',
          ),
          options: [
            B(
              'The two OUTPUT streams the background process inherits: ssh waits for stdout and stderr to close, so redirecting only one of them still hangs, and redirecting only stdin does not help at all',
              'HAI LUỒNG RA mà tiến trình nền thừa kế: ssh chờ cho stdout và stderr đóng lại, nên chuyển hướng chỉ một trong hai thì vẫn treo, còn chuyển hướng mỗi stdin thì chẳng ăn thua gì',
            ),
            B(
              'The inherited STDIN: ssh keeps the channel open while any descendant could still read from it, which is why <code>&lt;/dev/null</code> is the documented fix and the only redirect that matters here',
              'STDIN thừa kế: ssh giữ kênh mở chừng nào còn một tiến trình con nào đó có thể đọc từ nó, và đó là lý do <code>&lt;/dev/null</code> là cách chữa được ghi trong tài liệu và là chuyển hướng duy nhất có ý nghĩa ở đây',
            ),
            B(
              '<code>nohup</code> itself: it installs a SIGHUP handler that keeps the session alive until the child exits, so the fix is to drop <code>nohup</code> and use <code>setsid</code> alone, which detaches from the session leader',
              'Chính <code>nohup</code>: nó cài một trình xử lý SIGHUP giữ cho phiên sống tới khi tiến trình con thoát, nên cách chữa là bỏ <code>nohup</code> và dùng mỗi <code>setsid</code>, thứ tách hẳn khỏi tiến trình dẫn đầu phiên',
            ),
            B(
              'Nothing is hanging: exit code 124 is what <code>sleep 30</code> returns when it is interrupted, so all six forms behaved identically and the two zeros are the runs where the log file happened to be created first',
              'Chẳng có gì treo cả: mã 124 là thứ <code>sleep 30</code> trả về khi bị ngắt, nên cả sáu dạng hành xử y hệt nhau, và hai con số 0 là những lượt mà tệp log tình cờ được tạo ra trước',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<b>Measured, and it follows the machine rather than the course.</b> Lesson 0.3 blames the inherited stdin and prescribes <code>&lt;/dev/null</code>. On OpenSSH_9.2p1 that single redirect still hangs (124), while <code>&gt;log 2&gt;&amp;1</code> <em>without</em> <code>&lt;/dev/null</code> exits 0. ssh will not close the session channel while any process still holds the channel\'s output end open — and the background process inherits both. Redirect one and the other still holds it, which is why lines two and three hang too. Write all three anyway (<code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code>): the input redirect is what protects you when the remote command tries to read a prompt, and <code>setsid</code> is what makes the process survive the session ending. The symptom is worth memorising because it reads as "the server is slow" and it is a file descriptor.',
            '<b>Đã đo, và đề THEO MÁY chứ không theo giáo trình.</b> Bài 0.3 đổ lỗi cho stdin thừa kế và kê đơn <code>&lt;/dev/null</code>. Trên OpenSSH_9.2p1 thì mỗi cái chuyển hướng ấy VẪN treo (124), trong khi <code>&gt;log 2&gt;&amp;1</code> mà KHÔNG có <code>&lt;/dev/null</code> lại thoát 0. ssh không chịu đóng kênh phiên chừng nào còn một tiến trình giữ đầu RA của kênh ấy — và tiến trình nền thừa kế cả hai đầu ra. Chuyển hướng một cái thì cái kia vẫn giữ, nên dòng hai và dòng ba cũng treo. Dù vậy vẫn nên viết đủ cả ba (<code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code>): cái chuyển hướng đầu vào là thứ cứu bạn khi lệnh từ xa lỡ đòi đọc bàn phím, còn <code>setsid</code> mới là thứ giúp tiến trình sống sót khi phiên kết thúc. Triệu chứng này đáng thuộc lòng vì nó ĐỌC RA như "máy chủ chậm" trong khi thật ra là một mô tả tệp.',
          ),
        }),

        // q4 · đáp án D
        mcq({
          prompt: B(
            'A directory is created for the application user, then the deploy runs as root because that is who holds the SSH key. Measured on Debian 12 with rsync 3.2.7:' +
            code('truoc:              /srv/t1  trienkhai:trienkhai 755\n' +
                 'rsync -a (bang root):  app.js  root:root 644\n' +
                 '  su trienkhai -c doc  → CO\n' +
                 '  su trienkhai -c ghi  → KHONG (Permission denied)\n\n' +
                 'rsync -a --chown=trienkhai:trienkhai:\n' +
                 '                       app.js  trienkhai:trienkhai 644\n' +
                 '  su trienkhai -c ghi  → CO') +
            'Why is this failure so expensive to diagnose?',
            'Một thư mục được tạo cho người dùng của ứng dụng, rồi lần deploy chạy bằng root vì root mới là bên giữ khoá SSH. Đo trên Debian 12 với rsync 3.2.7:' +
            code('truoc:              /srv/t1  trienkhai:trienkhai 755\n' +
                 'rsync -a (bang root):  app.js  root:root 644\n' +
                 '  su trienkhai -c doc  → CO\n' +
                 '  su trienkhai -c ghi  → KHONG (Permission denied)\n\n' +
                 'rsync -a --chown=trienkhai:trienkhai:\n' +
                 '                       app.js  trienkhai:trienkhai 644\n' +
                 '  su trienkhai -c ghi  → CO') +
            'Vì sao cú hỏng này lại đắt tiền đến thế khi đi chẩn đoán?',
          ),
          options: [
            B(
              'Because the ownership change is silent on the rsync side but loud on the application side: the process fails to start at all, so the deploy\'s readiness check never passes and the swap is aborted with no clue as to why',
              'Vì việc đổi quyền sở hữu thì im lặng ở phía rsync nhưng ồn ào ở phía ứng dụng: tiến trình không khởi động nổi, nên chốt kiểm sẵn sàng của lần deploy không bao giờ đạt và bước tráo bị huỷ mà chẳng có manh mối nào',
            ),
            B(
              'Because mode 644 is the problem rather than the owner: the application needs 664 on every file it reads, and the fix is <code>rsync --chmod=F664</code> rather than <code>--chown</code>',
              'Vì vấn đề nằm ở quyền 644 chứ không phải chủ sở hữu: ứng dụng cần 664 trên mọi tệp nó đọc, và cách chữa là <code>rsync --chmod=F664</code> chứ không phải <code>--chown</code>',
            ),
            B(
              'Because rsync reverses the ownership again on the next run, so the fix does not stick: <code>--chown</code> is applied before the transfer and any file rsync decides to skip keeps its old owner, which makes the state alternate between deploys',
              'Vì rsync sẽ lật ngược quyền sở hữu lại ở lần chạy sau, nên cách chữa không bám: <code>--chown</code> được áp TRƯỚC khi truyền, và tệp nào rsync quyết định bỏ qua thì giữ nguyên chủ cũ, làm trạng thái đảo qua đảo lại giữa các lần deploy',
            ),
            B(
              'Because reading still works — the files are world-readable, so the site comes up and almost every route is fine. Only the paths that WRITE break: a log file, a cache directory, an upload folder, a build cache — hours later, on one code path, after a deploy that reported success',
              'Vì việc ĐỌC vẫn chạy — tệp ai cũng đọc được, nên trang web lên bình thường và gần như mọi tuyến đều ổn. Chỉ những đường có GHI mới vỡ: một tệp log, một thư mục cache, một chỗ chứa tệp tải lên, một bộ đệm dựng — vài giờ sau, trên đúng một nhánh mã, sau một lần deploy đã báo thành công',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The files land owned by whoever ran the deploy, not by whoever owns the directory. Because the default mode is world-readable, every read path keeps working, so the deploy passes its smoke test and the site serves traffic. The breakage is deferred to the first write, which may be a nightly job, a first upload, or a cache that only fills under load. Three fixes in order of preference: deploy <em>as</em> the application user so the question never arises; or <code>rsync --chown=</code> (needs privilege on the receiving side, and the measurement above shows it works); or — best — keep every writable path out of the deployed tree entirely, in the shared directory, symlinked in. That last one is the direction Chapter 4 argues for on completely separate grounds: a release should be read-only once created.',
            'Tệp rơi xuống mang chủ là người CHẠY lần deploy, chứ không phải người sở hữu thư mục. Vì quyền mặc định cho phép ai cũng đọc, mọi đường ĐỌC vẫn chạy tốt, nên lần deploy qua được bộ kiểm khói và trang web vẫn phục vụ. Chỗ vỡ bị đẩy lùi tới lần GHI đầu tiên — có thể là một việc chạy ban đêm, một lần tải tệp lên đầu tiên, hay một bộ đệm chỉ đầy khi có tải. Ba cách chữa theo thứ tự ưu tiên: deploy BẰNG CHÍNH người dùng của ứng dụng để câu hỏi không bao giờ phát sinh; hoặc <code>rsync --chown=</code> (cần quyền ở phía nhận, và phép đo trên cho thấy nó có tác dụng); hoặc — tốt nhất — giữ mọi đường có ghi RA HẲN ngoài cây được deploy, đặt ở thư mục dùng chung rồi liên kết mềm vào. Cách cuối chính là hướng mà Chương 4 bênh vực vì một lý do hoàn toàn khác: một bản phát hành phải CHỈ ĐỌC ngay khi vừa được tạo ra.',
          ),
        }),

        // q5 · đáp án B
        mcq({
          prompt: B(
            'Two sshd daemons, one default and one hardened, asked for a password login by a user that does not exist:' +
            code('=== cong 2222 (mac dinh) ===\n' +
                 '  Permission denied, please try again.\n' +
                 '  Permission denied, please try again.\n' +
                 '  Permission denied (publickey,password).\n\n' +
                 '=== cong 2223 (da gia co) ===\n' +
                 '  Permission denied (publickey).') +
            'A colleague sets <code>PasswordAuthentication no</code> and reloads sshd, and the parenthesis still says <code>(publickey,password)</code>. What is the most likely cause, and what settles it?',
            'Hai tiến trình sshd, một cái mặc định và một cái đã gia cố, cùng bị hỏi đăng nhập bằng mật khẩu bởi một người dùng không tồn tại:' +
            code('=== cong 2222 (mac dinh) ===\n' +
                 '  Permission denied, please try again.\n' +
                 '  Permission denied, please try again.\n' +
                 '  Permission denied (publickey,password).\n\n' +
                 '=== cong 2223 (da gia co) ===\n' +
                 '  Permission denied (publickey).') +
            'Một đồng nghiệp đặt <code>PasswordAuthentication no</code> rồi nạp lại sshd, mà cái ngoặc vẫn nói <code>(publickey,password)</code>. Nguyên nhân khả dĩ nhất là gì, và cái gì phân xử được?',
          ),
          options: [
            B(
              'The client is caching the authentication method list from the first connection; clear <code>~/.ssh/known_hosts</code> on the client and the parenthesis will update, since sshd itself is already correct',
              'Máy khách đang lưu lại danh sách phương thức xác thực từ lần kết nối đầu; xoá <code>~/.ssh/known_hosts</code> trên máy khách thì cái ngoặc sẽ cập nhật, vì bản thân sshd đã đúng rồi',
            ),
            B(
              'A later line in an <code>Include</code>d file (or a second directive further down) is overriding it, so the file is a wish and not the truth. <code>sshd -T</code> prints the values the daemon will actually use, and that is the only reading worth believing',
              'Một dòng ĐỨNG SAU trong một tệp được <code>Include</code> (hoặc một chỉ thị thứ hai ở phía dưới) đang đè lên nó, nên tệp cấu hình chỉ là một NGUYỆN VỌNG chứ không phải sự thật. <code>sshd -T</code> in ra đúng những giá trị mà daemon SẼ dùng, và đó là bản đọc duy nhất đáng tin',
            ),
            B(
              'The parenthesis lists compiled-in methods rather than enabled ones, so it never changes; the only way to confirm the setting took effect is to try a password login and see it rejected without a prompt',
              'Cái ngoặc liệt kê các phương thức được biên dịch vào chứ không phải các phương thức đang bật, nên nó không bao giờ đổi; cách duy nhất xác nhận thiết lập đã ăn là thử đăng nhập bằng mật khẩu và thấy nó bị từ chối mà không hỏi',
            ),
            B(
              'Reloading is not enough for authentication settings — they are read once at start-up — so the daemon must be fully restarted; until then the running process keeps the old method list in memory',
              'Nạp lại là không đủ với các thiết lập xác thực — chúng chỉ được đọc một lần lúc khởi động — nên phải khởi động lại hẳn daemon; tới lúc đó thì tiến trình đang chạy vẫn giữ danh sách phương thức cũ trong bộ nhớ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Do not read <code>/etc/ssh/sshd_config</code> to find out what SSH allows. It has commented-out defaults, <code>Include sshd_config.d/*.conf</code> pulling in files you did not write, and settings a later line silently overrides. <code>sshd -T | grep -iE &#39;permitroot|password|pubkey|maxauth&#39;</code> prints the effective values. And there is a second half to this: <code>PasswordAuthentication no</code> without <code>KbdInteractiveAuthentication no</code> is a half-closed door, because keyboard-interactive is a separate mechanism that on many distributions asks for the same password through PAM — a configuration that reads as hardened and measures as open. That parenthesis is reconnaissance: <code>(publickey,password)</code> tells a scanner guessing is worth its time, and the three prompts tell it how many guesses it gets per connection.',
            'Đừng đọc <code>/etc/ssh/sshd_config</code> để biết SSH cho phép cái gì. Nó đầy giá trị mặc định bị chú thích, có <code>Include sshd_config.d/*.conf</code> kéo vào những tệp bạn không hề viết, và có những thiết lập bị một dòng đứng sau âm thầm đè lên. <code>sshd -T | grep -iE &#39;permitroot|password|pubkey|maxauth&#39;</code> in ra các giá trị THỰC SỰ có hiệu lực. Và còn nửa sau: <code>PasswordAuthentication no</code> mà thiếu <code>KbdInteractiveAuthentication no</code> là một cánh cửa khép hờ, vì keyboard-interactive là một cơ chế RIÊNG, trên nhiều bản phân phối nó hỏi đúng cái mật khẩu ấy qua PAM — một cấu hình ĐỌC ra thì đã gia cố mà ĐO ra thì vẫn mở. Cái ngoặc kia là thông tin do thám: <code>(publickey,password)</code> nói với máy quét rằng đoán mò là đáng công, còn ba lần hỏi thì nói cho nó biết mỗi kết nối được đoán mấy lượt.',
          ),
        }),

        // q6 · đáp án A + C (chọn HAI)
        mcq({
          prompt: B(
            'A hand deploy passed checks (a), (b) and (c) — exit code 0, a PID exists, the port is bound — while every request returned <code>500</code> because one environment variable was absent. <b>Choose TWO</b> rules that a health endpoint must follow if it is to catch that case without creating a new problem.',
            'Một lần deploy làm tay qua được các phép kiểm (a), (b) và (c) — mã thoát 0, có PID, cổng đã mở — trong khi mọi request đều trả <code>500</code> vì thiếu một biến môi trường. <b>Chọn HAI</b> quy tắc mà một endpoint kiểm tra sức khoẻ phải tuân theo nếu muốn bắt được ca đó mà không đẻ ra vấn đề mới.',
          ),
          options: [
            B(
              'It must exercise the thing that breaks — if the application needs a database, the check should touch the database, because a hardcoded 200 passes exactly the case above',
              'Nó phải ĐỘNG VÀO đúng cái thứ hay hỏng — nếu ứng dụng cần cơ sở dữ liệu thì phép kiểm phải chạm tới cơ sở dữ liệu, vì một cú 200 viết cứng sẽ qua đúng cái ca vừa nêu',
            ),
            B(
              'It must require authentication, so that a probe cannot be used by an attacker to fingerprint the service; the load balancer is given a dedicated token for this purpose',
              'Nó phải yêu cầu xác thực, để kẻ tấn công không thể dùng nó mà nhận dạng dịch vụ; bộ cân bằng tải được cấp một token riêng cho việc này',
            ),
            B(
              'It must separate "alive" from "ready" — alive means restart me if this fails, ready means send me traffic only if this passes — because during start-up an application is alive and not yet ready',
              'Nó phải tách "còn sống" khỏi "sẵn sàng" — còn sống nghĩa là hỏng thì hãy khởi động lại tôi, sẵn sàng nghĩa là chỉ gửi request khi phép này đạt — vì trong lúc khởi động, một ứng dụng là còn sống mà CHƯA sẵn sàng',
            ),
            B(
              'It must be exhaustive rather than cheap: counting rows in the main table on every probe is the only way to be sure the database is genuinely usable rather than merely reachable',
              'Nó phải VÉT CẠN chứ không phải rẻ: đếm số dòng của bảng chính ở mỗi lần thăm dò là cách duy nhất để chắc rằng cơ sở dữ liệu thật sự dùng được chứ không chỉ là với tới được',
            ),
            B(
              'It must return the deployed version and the commit hash in its body, so that the same endpoint answers both "is it healthy?" and "which release is this?" in one request',
              'Nó phải trả về phiên bản đã deploy và mã băm commit trong thân phản hồi, để cùng một endpoint trả lời được cả "có khoẻ không?" lẫn "đây là bản nào?" trong một request',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'A <code>/health</code> that returns a hardcoded 200 is checking that the runtime can serve a string, which is exactly the case that passed three of four checks above. It must touch what breaks — but cheaply: a load balancer polls it forever, so <code>SELECT 1</code> is right and counting rows in a large table is a self-inflicted outage waiting for traffic (option D). Alive and ready are genuinely two questions with two consequences, and conflating them is what produces a restart loop during a slow start-up. Authentication is wrong for the opposite reason — the check could not run — and the endpoint is usually reachable, so it should carry nothing sensitive: no version numbers, no dependency names, no connection strings in the error text (options B and E). Chapter 6 measures the limit of all this: a shallow check cannot see a schema mismatch, and a "deep" one still cannot, because <code>SELECT 1</code> succeeds against a schema your code cannot read.',
            'Một <code>/health</code> trả 200 viết cứng chỉ đang kiểm rằng runtime in được một chuỗi — đúng cái ca vừa qua được ba trên bốn phép kiểm ở trên. Nó phải chạm vào thứ hay hỏng — nhưng phải RẺ: bộ cân bằng tải gọi nó mãi mãi, nên <code>SELECT 1</code> là đúng, còn đếm số dòng của một bảng lớn là tự tay dựng sẵn một sự cố chỉ chờ có tải (phương án D). "Còn sống" và "sẵn sàng" thật sự là hai câu hỏi với hai hệ quả khác nhau, và gộp chúng lại chính là thứ đẻ ra vòng lặp khởi động lại trong lúc ứng dụng khởi động chậm. Bắt xác thực thì sai vì lý do ngược lại — phép kiểm sẽ không chạy nổi — và endpoint này thường với tới được từ bên ngoài, nên nó không được mang gì nhạy cảm: không số phiên bản, không tên thư viện, không chuỗi kết nối trong thông báo lỗi (phương án B và E). Chương 6 đo ra giới hạn của tất cả những điều trên: một phép kiểm NÔNG không thấy được lược đồ lệch pha, mà một phép kiểm "SÂU" cũng vẫn không thấy, vì <code>SELECT 1</code> chạy ngon lành trên một lược đồ mà mã của bạn không đọc nổi.',
          ),
        }),

        // q7 · đáp án C
        mcq({
          prompt: B(
            'The same rollback, done two ways, on two project sizes (numbers from the course):' +
            code('=== du an nho: 42 tep, 176 KB ===\n' +
                 '  doi symlink : 6,3 ms\n' +
                 '  giai nen lai: 13,4 ms\n\n' +
                 '=== du an that: 12.000 tep, 48 MB ===\n' +
                 '  doi symlink : 4,8 ms\n' +
                 '  giai nen lai: 590 ms') +
            'The speed is not the main argument. What is?',
            'Cùng một cú lùi bản, làm theo hai cách, trên hai cỡ dự án (số lấy từ giáo trình):' +
            code('=== du an nho: 42 tep, 176 KB ===\n' +
                 '  doi symlink : 6,3 ms\n' +
                 '  giai nen lai: 13,4 ms\n\n' +
                 '=== du an that: 12.000 tep, 48 MB ===\n' +
                 '  doi symlink : 4,8 ms\n' +
                 '  giai nen lai: 590 ms') +
            'Tốc độ không phải luận điểm chính. Vậy luận điểm chính là gì?',
          ),
          options: [
            B(
              'That extraction time grows with the project while a symlink move does not, so the gap keeps widening — which is the whole reason to prefer the releases layout on any project that is going to get bigger',
              'Rằng thời gian giải nén tăng theo cỡ dự án còn việc dời symlink thì không, nên khoảng cách cứ ngày một rộng ra — và đó chính là toàn bộ lý do nên chọn cách bố trí bản phát hành trên bất cứ dự án nào rồi sẽ lớn lên',
            ),
            B(
              'That 590 ms is already an unacceptable outage for a production site, so the symlink layout is the only one that meets a zero-downtime requirement; below about 100 ms either approach is defensible',
              'Rằng 590 ms đã là một khoảng gián đoạn không chấp nhận được với một trang production, nên bố trí symlink là cách duy nhất đáp ứng yêu cầu không-gián-đoạn; dưới khoảng 100 ms thì cách nào cũng bênh được',
            ),
            B(
              'That re-extracting needs the old artifact to still exist somewhere — a tarball, a git tag, a registry image, the network to fetch it — while a symlink move needs only a directory already on the disk. The moment you most need to roll back is often the moment something else is also broken',
              'Rằng giải nén lại đòi bản tạo tác CŨ vẫn còn tồn tại ở đâu đó — một tệp nén, một thẻ git, một ảnh trong registry, và cả đường mạng để lấy về — còn dời symlink thì chỉ cần một thư mục ĐÃ nằm sẵn trên đĩa. Khoảnh khắc bạn cần lùi bản nhất thường cũng là khoảnh khắc có thứ khác đang hỏng',
            ),
            B(
              'That the two numbers measure different things and cannot be compared: the symlink move does not restart the process, so a fair comparison would have to add the start-up time to the left-hand column and the two would then be within noise of each other',
              'Rằng hai con số đo hai thứ khác nhau nên không so được: dời symlink thì chưa khởi động lại tiến trình, nên một phép so công bằng phải cộng thêm thời gian khởi động vào cột bên trái, và khi ấy hai bên chỉ chênh nhau trong sai số',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A rollback is not a deploy run backwards; it is the one deploy you already know works, put back. The releases layout — every release in its own directory, a symlink naming the live one — makes that a single filesystem operation whose cost does not depend on the size of your codebase. Option A is true and is the smaller half. Option D is a fair objection and Chapter 6 answers it with a measurement: the complete rollback including restart and waiting for readiness was 140 ms, of which 128 was the runtime booting — against 1,994 ms to rebuild the same release from source on a deliberately tiny 83-package project. The structural point still dominates: the rebuild path depends on things that may be unavailable exactly when you need them.',
            'Lùi bản không phải là chạy ngược một lần deploy; nó là lần deploy DUY NHẤT mà bạn đã biết chắc là chạy được, đặt trở lại. Cách bố trí bản phát hành — mỗi bản một thư mục riêng, một symlink gọi tên bản đang sống — biến việc đó thành MỘT thao tác hệ tệp mà chi phí không phụ thuộc vào cỡ kho mã của bạn. Phương án A đúng, và nó là nửa nhỏ hơn. Phương án D là một phản bác công bằng, và Chương 6 trả lời bằng phép đo: cú lùi TRỌN VẸN kể cả khởi động lại và chờ sẵn sàng là 140 ms, trong đó 128 ms là runtime đang khởi động — so với 1.994 ms để dựng lại đúng bản đó từ nguồn trên một dự án cố ý làm tí hon 83 gói. Luận điểm cấu trúc vẫn thắng: đường dựng lại phụ thuộc vào những thứ có thể vắng mặt đúng lúc bạn cần chúng nhất.',
          ),
        }),

        /* ── Chương 1 — tạo tác (8 câu) ────────────────────────────────── */

        // q8 · đáp án A
        mcq({
          prompt: B(
            'A project whose <code>package.json</code> asks for <code>semver ^7.0.0</code> while its lockfile pins <code>6.3.1</code> — the state you get when a merge takes the manifest from one branch and the lockfile from another. Measured on Node v22.23.1 / npm 10.9.8:' +
            code('── npm ci ──\n' +
                 '  npm error code EUSAGE\n' +
                 '  npm error `npm ci` can only install packages when your\n' +
                 '  npm error package.json and package-lock.json are in sync.\n' +
                 '  npm error Invalid: lock file&#39;s semver@6.3.1 does not satisfy semver@7.8.5\n' +
                 '  → ma thoat: 1\n\n' +
                 '── npm install ──\n' +
                 '  added 1 package in 2s\n' +
                 '  → ma thoat: 0\n' +
                 '  semver da cai: 7.8.5\n' +
                 '  lock co bi GHI LAI khong: CO') +
            'Which sentence names the danger precisely?',
            'Một dự án có <code>package.json</code> đòi <code>semver ^7.0.0</code> trong khi tệp khoá ghim <code>6.3.1</code> — đúng trạng thái bạn nhận được khi một lần gộp lấy manifest từ nhánh này và tệp khoá từ nhánh kia. Đo trên Node v22.23.1 / npm 10.9.8:' +
            code('── npm ci ──\n' +
                 '  npm error code EUSAGE\n' +
                 '  npm error `npm ci` can only install packages when your\n' +
                 '  npm error package.json and package-lock.json are in sync.\n' +
                 '  npm error Invalid: lock file&#39;s semver@6.3.1 does not satisfy semver@7.8.5\n' +
                 '  → ma thoat: 1\n\n' +
                 '── npm install ──\n' +
                 '  added 1 package in 2s\n' +
                 '  → ma thoat: 0\n' +
                 '  semver da cai: 7.8.5\n' +
                 '  lock co bi GHI LAI khong: CO') +
            'Câu nào gọi tên mối nguy một cách chính xác?',
          ),
          options: [
            B(
              'The version you tested is not the version you shipped, and nothing says so: <code>npm install</code> resolved the conflict, installed a different major, rewrote the lockfile inside the release directory, and exited 0 — so the deploy continued and reported success',
              'Phiên bản bạn đã kiểm thử không phải phiên bản bạn gửi đi, và chẳng có gì nói ra điều đó: <code>npm install</code> tự giải quyết mâu thuẫn, cài một bản major khác, ghi lại tệp khoá NGAY TRONG thư mục bản phát hành, rồi thoát 0 — nên lần deploy đi tiếp và báo thành công',
            ),
            B(
              'The danger is speed: <code>npm ci</code> deletes <code>node_modules</code> and reinstalls everything, so on a large tree it turns a two-second step into a two-minute one, which is why people reach for <code>npm install</code> on servers in the first place',
              'Mối nguy là tốc độ: <code>npm ci</code> xoá <code>node_modules</code> rồi cài lại toàn bộ, nên trên một cây lớn nó biến một bước hai giây thành hai phút, và đó mới là lý do người ta với tay sang <code>npm install</code> trên máy chủ',
            ),
            B(
              'The danger is the exit code: <code>npm ci</code> returning 1 aborts a deploy that would otherwise have worked, so a deploy script should run <code>npm ci || npm install</code> to get the strictness without the fragility',
              'Mối nguy là mã thoát: <code>npm ci</code> trả 1 sẽ huỷ một lần deploy vốn dĩ vẫn chạy tốt, nên script deploy nên viết <code>npm ci || npm install</code> để vừa nghiêm ngặt vừa không dễ gãy',
            ),
            B(
              'The danger is that both commands ignore the platform: the lockfile pins versions and integrity hashes but not the operating system, so the real failure here is a native module compiled for the wrong libc, and the version mismatch is a red herring',
              'Mối nguy là cả hai lệnh đều bỏ qua nền tảng: tệp khoá ghim phiên bản và mã băm toàn vẹn chứ không ghim hệ điều hành, nên cú hỏng thật ở đây là một mô-đun biên dịch sai libc, còn chuyện lệch phiên bản chỉ là đánh lạc hướng',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>npm ci</code> refuses and names the exact conflict; under <code>set -e</code> that stops the deploy before anything is swapped. <code>npm install</code> is a <em>development</em> command whose job is to change the lockfile, which is the last thing that should happen during a deploy — and here it did exactly its job, silently. Note the second-order damage: the rewritten lockfile lives inside the release directory where nobody will look, and is thrown away at the next deploy, so the next machine resolves independently and may land somewhere else again. Option C is the trap that makes this worse rather than better: <code>||</code> also suspends <code>set -e</code> for everything inside the left-hand command. The equivalents elsewhere are <code>yarn install --frozen-lockfile</code>, <code>pnpm install --frozen-lockfile</code>, <code>composer install</code> (not <code>update</code>), and <code>bundle install --deployment</code>.',
            '<code>npm ci</code> TỪ CHỐI và gọi tên đúng chỗ mâu thuẫn; dưới <code>set -e</code> thì nó dừng lần deploy lại trước khi có gì bị tráo. <code>npm install</code> là một lệnh DÀNH CHO PHÁT TRIỂN mà công việc của nó là ĐỔI tệp khoá — thứ cuối cùng được phép xảy ra trong một lần deploy — và ở đây nó đã làm đúng công việc ấy, trong im lặng. Hãy để ý thiệt hại vòng hai: tệp khoá bị ghi lại nằm trong thư mục bản phát hành nơi không ai ngó tới, rồi bị vứt đi ở lần deploy sau, nên máy kế tiếp lại tự giải quyết một lần nữa và có thể rơi vào một chỗ khác nữa. Phương án C chính là cái bẫy làm mọi thứ tệ đi chứ không khá lên: <code>||</code> còn TREO luôn <code>set -e</code> cho mọi thứ bên trong lệnh vế trái. Tương đương ở nơi khác: <code>yarn install --frozen-lockfile</code>, <code>pnpm install --frozen-lockfile</code>, <code>composer install</code> (không phải <code>update</code>), và <code>bundle install --deployment</code>.',
          ),
        }),

        // q9 · đáp án D
        mcq({
          prompt: B(
            'Four scripts, all starting with <code>set -euo pipefail</code>, measured on bash 5.2.15:' +
            code('── A ──                      ── B ──\n' +
                 'false                        ( set -e; false; echo X ) || echo "nhanh ||"\n' +
                 'echo "DI TIEP"               echo "chay tiep"\n' +
                 '  → ma thoat 1                 → in "X", "nhanh ||", "chay tiep"; ma thoat 0\n\n' +
                 '── C ──                      ── D ──\n' +
                 'hong() { false; echo Y; }    kq=$(false; echo "gia-tri")\n' +
                 'hong || echo "nhanh ||"      echo "kq=$kq"\n' +
                 'echo "chay tiep"               → in "kq=gia-tri"; ma thoat 0\n' +
                 '  → in "Y", "nhanh ||",\n' +
                 '     "chay tiep"; ma thoat 0') +
            'A deploy script is full of <code>lenh || echo "canh bao"</code>. What has it done to itself?',
            'Bốn script, đều mở đầu bằng <code>set -euo pipefail</code>, đo trên bash 5.2.15:' +
            code('── A ──                      ── B ──\n' +
                 'false                        ( set -e; false; echo X ) || echo "nhanh ||"\n' +
                 'echo "DI TIEP"               echo "chay tiep"\n' +
                 '  → ma thoat 1                 → in "X", "nhanh ||", "chay tiep"; ma thoat 0\n\n' +
                 '── C ──                      ── D ──\n' +
                 'hong() { false; echo Y; }    kq=$(false; echo "gia-tri")\n' +
                 'hong || echo "nhanh ||"      echo "kq=$kq"\n' +
                 'echo "chay tiep"               → in "kq=gia-tri"; ma thoat 0\n' +
                 '  → in "Y", "nhanh ||",\n' +
                 '     "chay tiep"; ma thoat 0') +
            'Một script deploy đầy những dòng <code>lenh || echo "canh bao"</code>. Nó đã tự làm gì với chính mình?',
          ),
          options: [
            B(
              'Nothing structural — <code>||</code> only changes the exit status of the compound command, so <code>set -e</code> still aborts inside the left-hand side; cases B and C printed X and Y because <code>echo</code> cannot fail, not because errexit was off',
              'Chẳng làm gì về mặt cấu trúc — <code>||</code> chỉ đổi trạng thái thoát của lệnh ghép, nên <code>set -e</code> vẫn dừng ở vế trái; ca B và C in ra X với Y là vì <code>echo</code> không thể hỏng, chứ không phải vì errexit bị tắt',
            ),
            B(
              'It has traded errexit for pipefail: <code>||</code> disables <code>-e</code> but <code>-o pipefail</code> still catches the same failures, so the script is protected as long as every risky command is written as part of a pipeline',
              'Nó đã đánh đổi errexit lấy pipefail: <code>||</code> tắt <code>-e</code> nhưng <code>-o pipefail</code> vẫn bắt được đúng những cú hỏng ấy, nên script vẫn được bảo vệ miễn là mọi lệnh nguy hiểm đều viết thành một phần của ống dẫn',
            ),
            B(
              'It has made the script exit 0 on failure but stop at the failing line anyway, so nothing after the error runs; the damage is confined to the exit code, which is why CI reports success while the deploy is visibly incomplete',
              'Nó làm cho script thoát 0 khi hỏng nhưng vẫn dừng ngay tại dòng hỏng, nên không có gì sau lỗi được chạy; thiệt hại chỉ giới hạn ở mã thoát, và vì thế CI báo thành công trong khi lần deploy rõ ràng còn dở dang',
            ),
            B(
              'It has turned off its own safety: <code>set -e</code> is suspended for everything on the left of a <code>&amp;&amp;</code> or <code>||</code> — including several commands deep inside a function or a subshell — so every step after the first failure runs against a half-built release',
              'Nó đã TẮT chính cái phanh của mình: <code>set -e</code> bị treo cho mọi thứ nằm bên TRÁI một dấu <code>&amp;&amp;</code> hay <code>||</code> — kể cả những lệnh nằm sâu vài tầng trong một hàm hay một subshell — nên mọi bước sau cú hỏng đầu tiên đều chạy trên một bản phát hành dựng nửa vời',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Case A is the baseline: a bare failing command aborts. Cases B and C are the same rule seen twice — the moment a command is part of a <code>&amp;&amp;</code> or <code>||</code> list, errexit is suspended <em>throughout</em> it, so the <code>false</code> inside the function did not stop the function and <code>Y</code> printed. That is documented behaviour (<code>if grep -q x file; then</code> would be unusable otherwise) and it is exactly why <code>lenh || echo "canh bao"</code> is dangerous: it looks defensive and it disables the guard for everything inside <code>lenh</code>. Case D is the counter-folklore: <code>x=$(cmd)</code> at top level <em>does</em> propagate the failure — but the assignment succeeded here because the last command in the substitution was the <code>echo</code>. The case with no flag at all is <code>local x=$(cmd)</code>, because <code>local</code> is itself a command whose own status wins.',
            'Ca A là mốc đối chiếu: một lệnh hỏng đứng trơ thì dừng script. Ca B và ca C là cùng một quy tắc nhìn hai lần — hễ một lệnh nằm trong danh sách <code>&amp;&amp;</code> hay <code>||</code> thì errexit bị treo TRÊN TOÀN BỘ nó, nên lệnh <code>false</code> bên trong hàm không dừng được hàm và chữ <code>Y</code> vẫn in ra. Đó là hành vi có ghi trong tài liệu (không thì <code>if grep -q x file; then</code> đã không dùng được) và đó chính là lý do <code>lenh || echo "canh bao"</code> nguy hiểm: nó TRÔNG như đang phòng thủ, trong khi thực chất tắt phanh cho mọi thứ bên trong <code>lenh</code>. Ca D lật lại một lời đồn: <code>x=$(cmd)</code> ở cấp cao nhất CÓ truyền lỗi ra — nhưng ở đây phép gán thành công vì lệnh cuối trong phần thay thế là <code>echo</code>. Ca không cờ nào bắt được là <code>local x=$(cmd)</code>, vì <code>local</code> tự nó là một lệnh và trạng thái của chính nó mới thắng.',
          ),
        }),

        // q10 · đáp án B
        mcq({
          prompt: B(
            'A repository with <code>tests/ export-ignore</code> and <code>docs/ export-ignore</code> in <code>.gitattributes</code>. Measured on git 2.39.5, at the same commit:' +
            code('-- git archive --format=tar HEAD | tar t --\n' +
                 '   .gitattributes\n' +
                 '   .gitignore\n' +
                 '   src/app.js\n\n' +
                 '-- git clone (cung commit) --\n' +
                 '   ./.gitattributes\n' +
                 '   ./.gitignore\n' +
                 '   ./docs/x.md\n' +
                 '   ./src/app.js\n' +
                 '   ./tests/a.test.js') +
            'What does this tell you about a project that deploys with a <code>git</code>-based hook?',
            'Một kho mã có <code>tests/ export-ignore</code> và <code>docs/ export-ignore</code> trong <code>.gitattributes</code>. Đo trên git 2.39.5, tại cùng một commit:' +
            code('-- git archive --format=tar HEAD | tar t --\n' +
                 '   .gitattributes\n' +
                 '   .gitignore\n' +
                 '   src/app.js\n\n' +
                 '-- git clone (cung commit) --\n' +
                 '   ./.gitattributes\n' +
                 '   ./.gitignore\n' +
                 '   ./docs/x.md\n' +
                 '   ./src/app.js\n' +
                 '   ./tests/a.test.js') +
            'Điều này nói gì về một dự án deploy bằng một hook dựa trên <code>git</code>?',
          ),
          options: [
            B(
              'That <code>export-ignore</code> needs a trailing slash to match a directory recursively; without it only the directory entry is skipped and its contents still travel, which is what the clone column shows',
              'Rằng <code>export-ignore</code> cần một dấu gạch chéo ở cuối để khớp thư mục theo kiểu đệ quy; thiếu nó thì chỉ mục thư mục bị bỏ qua còn nội dung vẫn đi theo, đúng như cột clone cho thấy',
            ),
            B(
              'That the attribute applies to <code>git archive</code> only. A hook that does <code>git checkout --work-tree=…</code> out of a bare repository gets everything, so the trimming rules are decoration on that path and the exclusion has to be arranged another way',
              'Rằng thuộc tính ấy CHỈ áp cho <code>git archive</code>. Một hook chạy <code>git checkout --work-tree=…</code> từ một kho trần sẽ lấy về đủ hết, nên các quy tắc cắt gọt kia chỉ là trang trí trên đường đó, và việc loại trừ phải được sắp xếp bằng cách khác',
            ),
            B(
              'That the clone was taken from a different commit: <code>export-ignore</code> is stored in the tree object, so any clone of the same commit must agree with the archive by construction',
              'Rằng bản clone được lấy từ một commit khác: <code>export-ignore</code> được lưu trong đối tượng cây, nên mọi bản clone của cùng một commit buộc phải khớp với bản archive',
            ),
            B(
              'That <code>.gitattributes</code> must be committed on the deploy branch specifically; the archive read it because it was checked out, and the clone ignored it because attributes are evaluated on the client rather than in the repository',
              'Rằng <code>.gitattributes</code> phải được commit riêng trên nhánh deploy; bản archive đọc được nó vì nó đã được checkout, còn bản clone bỏ qua nó vì các thuộc tính được đánh giá ở phía máy khách chứ không phải trong kho',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. <code>export-ignore</code> is documented as affecting archives, and the transcript is the proof: the archive carried three entries and the clone of the same commit carried five. This matters because the two deploy shapes in Chapter 2 use different mechanisms — a tarball built with <code>git archive</code> honours it, while the fifteen-line <code>post-receive</code> hook does <code>git --work-tree="$BAN" --git-dir=… checkout -f master</code>, which writes the full tree. If your deploy is the hook, the trimming has to happen after the checkout (or not at all, which is usually fine — tests and docs are small). The general shape is worth carrying: an exclusion rule is only real on the code path that reads it, and this course has three separate versions of that mistake (<code>.gitignore</code> versus rsync, <code>export-ignore</code> versus checkout, and a Next.js cache header versus nginx).',
            'Đã đo. <code>export-ignore</code> được tài liệu ghi rõ là chỉ ảnh hưởng tới ARCHIVE, và đoạn terminal chính là bằng chứng: bản archive mang ba mục, bản clone của cùng commit mang năm mục. Điều này quan trọng vì hai hình dạng deploy ở Chương 2 dùng hai cơ chế khác nhau — một tệp nén dựng bằng <code>git archive</code> thì tôn trọng nó, còn cái hook <code>post-receive</code> mười lăm dòng lại chạy <code>git --work-tree="$BAN" --git-dir=… checkout -f master</code>, thứ ghi ra CẢ cây. Nếu lần deploy của bạn là cái hook thì việc cắt gọt phải làm SAU bước checkout (hoặc thôi không cắt, thường cũng chẳng sao — tests với docs vốn nhỏ). Cái hình dạng chung đáng mang theo: một quy tắc loại trừ chỉ có THẬT trên đúng nhánh mã đọc nó, và khoá này có tới ba phiên bản của cùng sai lầm ấy (<code>.gitignore</code> với rsync, <code>export-ignore</code> với checkout, và một header cache của Next.js với nginx).',
          ),
        }),

        // q11 · đáp án C
        mcq({
          prompt: B(
            'Three naming schemes for release directories, listed with a plain <code>ls -1</code> (measured on coreutils 9.1, <code>LC_ALL=C</code>):' +
            code('chi ma bam : 0f92aa  a3f1c9  b8e402  c1d773\n' +
                 'chi so     : 10  11  12  9\n' +
                 'thoi gian+ma:\n' +
                 '  2026-08-23-1930-a3f1c9\n' +
                 '  2026-08-23-2114-b8e402\n' +
                 '  2026-08-24-0902-c1d773\n' +
                 '  2026-08-24-1147-0f92aa') +
            'A pruner is written as <code>ls -1 "$GOC" | sort | head -n -5 | xargs -r rm -rf</code>. Which scheme makes that line correct, and why do the other two break it?',
            'Ba cách đặt tên thư mục bản phát hành, liệt kê bằng một lệnh <code>ls -1</code> trơn (đo trên coreutils 9.1, <code>LC_ALL=C</code>):' +
            code('chi ma bam : 0f92aa  a3f1c9  b8e402  c1d773\n' +
                 'chi so     : 10  11  12  9\n' +
                 'thoi gian+ma:\n' +
                 '  2026-08-23-1930-a3f1c9\n' +
                 '  2026-08-23-2114-b8e402\n' +
                 '  2026-08-24-0902-c1d773\n' +
                 '  2026-08-24-1147-0f92aa') +
            'Một script dọn bản cũ viết là <code>ls -1 "$GOC" | sort | head -n -5 | xargs -r rm -rf</code>. Cách đặt tên nào làm dòng đó ĐÚNG, và hai cách kia phá nó thế nào?',
          ),
          options: [
            B(
              'The hash scheme, because it is the only one that identifies the code exactly; the pruner should then sort by <code>ls -t</code> (modification time) rather than by name, which works for all three schemes and removes the naming question entirely',
              'Cách mã băm, vì đó là cách duy nhất định danh mã một cách chính xác; script dọn khi ấy nên sắp bằng <code>ls -t</code> (theo thời gian sửa) chứ không theo tên, cách đó chạy với cả ba lối đặt tên và xoá sạch câu hỏi về đặt tên',
            ),
            B(
              'The counter scheme, once it is zero-padded: <code>009</code>, <code>010</code>, <code>011</code> sorts correctly and is shorter, and the hash can be recorded inside the directory in a version file rather than in its name',
              'Cách đánh số, một khi đã đệm số 0: <code>009</code>, <code>010</code>, <code>011</code> sắp đúng và lại ngắn hơn, còn mã băm thì ghi vào một tệp phiên bản BÊN TRONG thư mục chứ không cần nằm trong tên',
            ),
            B(
              'Timestamp plus hash: sorting as text is sorting chronologically, and every name still traces back to exactly one commit. The hash alone sorts meaninglessly, and the bare counter puts <code>10</code> before <code>9</code> because a directory listing sorts as text',
              'Thời gian cộng mã băm: sắp theo chữ CHÍNH LÀ sắp theo thời gian, mà mỗi cái tên vẫn truy ngược được về đúng một commit. Chỉ mã băm thì sắp ra vô nghĩa, còn số trần thì đặt <code>10</code> trước <code>9</code> vì danh sách thư mục sắp theo CHỮ',
            ),
            B(
              'None of them, because <code>head -n -5</code> is a GNU extension that is absent on BSD userland; the pruner has to be rewritten with <code>sed</code> or <code>tail -r</code> first, and only then does the naming scheme matter',
              'Chẳng cách nào cả, vì <code>head -n -5</code> là phần mở rộng của GNU và không có trên userland BSD; phải viết lại script dọn bằng <code>sed</code> hay <code>tail -r</code> trước đã, rồi cách đặt tên mới có ý nghĩa',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: <code>ls -1</code> returned <code>10 11 12 9</code> for the counter scheme, which is exactly how a pruner deletes the wrong directory. Use UTC and a format that sorts — <code>YYYY-MM-DD-HHMM</code>, never <code>DD-MM-YYYY</code> — and keep the short hash on the end so the name traces back to one commit. Option A is a real alternative and it has a real hazard: <code>ls -t</code> reads mtime, and a rollback, a rsync <code>--link-dest</code> run or a backup tool can touch a directory and reorder your history without changing anything about which release is which. Option D is a true statement about portability that does not answer the question: <code>head -n -5</code> is GNU, but this pruner runs on the Linux server, not on the developer machine. Whatever scheme you choose, the pruner must also read the symlink first and refuse to remove its target — Question 13.',
            'Đã đo: <code>ls -1</code> trả về <code>10 11 12 9</code> cho cách đánh số, và đó đúng là cách một script dọn xoá nhầm thư mục. Hãy dùng UTC và một khuôn có thể SẮP được — <code>YYYY-MM-DD-HHMM</code>, không bao giờ <code>DD-MM-YYYY</code> — rồi giữ mã băm ngắn ở cuối để cái tên truy ngược về đúng một commit. Phương án A là một lựa chọn có thật và nó có một mối nguy có thật: <code>ls -t</code> đọc mtime, mà một cú lùi bản, một lượt rsync <code>--link-dest</code> hay một công cụ sao lưu đều có thể chạm vào thư mục và xáo lại lịch sử của bạn mà không đổi gì về việc bản nào là bản nào. Phương án D là một phát biểu ĐÚNG về tính khả chuyển nhưng không trả lời câu hỏi: <code>head -n -5</code> đúng là của GNU, nhưng script dọn này chạy trên máy chủ Linux chứ không phải máy lập trình viên. Chọn cách nào đi nữa thì script dọn vẫn phải ĐỌC symlink trước và từ chối xoá cái đích của nó — xem câu 13.',
          ),
        }),

        // q12 · đáp án A
        mcq({
          prompt: B(
            'A real working tree, measured:' +
            code('tong          3.8M\n' +
                 '  node_modules  3.1M (780 tep)\n' +
                 '  dist          200K\n' +
                 '  logs          8.0K\n' +
                 '  tai-len       300K\n' +
                 '  src           172K (42 tep)\n' +
                 '  .env          96 byte\n\n' +
                 'git archive   84K (43 muc)\n' +
                 'tar tho       1.4M (839 muc)') +
            'Which single question sorts every path in that tree into the right category?',
            'Một cây làm việc thật, đo được:' +
            code('tong          3.8M\n' +
                 '  node_modules  3.1M (780 tep)\n' +
                 '  dist          200K\n' +
                 '  logs          8.0K\n' +
                 '  tai-len       300K\n' +
                 '  src           172K (42 tep)\n' +
                 '  .env          96 byte\n\n' +
                 'git archive   84K (43 muc)\n' +
                 'tar tho       1.4M (839 muc)') +
            'Đúng MỘT câu hỏi nào phân loại được mọi đường dẫn trong cây ấy cho đúng?',
          ),
          options: [
            B(
              '"If this were deleted on the server, would I lose anything?" — no for source (it comes from git) and for derived files (rebuild them), yes for runtime state and for configuration. Anything you answered yes for must not live inside the thing a deploy overwrites',
              '"Nếu thứ này bị xoá trên máy chủ, tôi có mất gì không?" — KHÔNG với mã nguồn (nó có sẵn trong git) và với thứ dựng ra được (dựng lại là xong), CÓ với trạng thái lúc chạy và với cấu hình. Cái gì bạn trả lời CÓ thì không được nằm bên trong thứ mà một lần deploy sẽ ghi đè',
            ),
            B(
              '"Is it in <code>.gitignore</code>?" — everything ignored by git is by definition not source, so the ignore file already encodes the classification and the deploy can simply reuse it with <code>rsync --exclude-from=.gitignore</code>',
              '"Nó có nằm trong <code>.gitignore</code> không?" — cái gì git bỏ qua thì theo định nghĩa không phải mã nguồn, nên tệp ignore đã mã hoá sẵn cách phân loại rồi, và lần deploy chỉ việc dùng lại nó bằng <code>rsync --exclude-from=.gitignore</code>',
            ),
            B(
              '"Is it larger than the source tree?" — the categories that must not ship are precisely the large ones, which is why the naive package is sixteen times bigger, and a size threshold is the cheapest exclusion rule to maintain',
              '"Nó có to hơn cây mã nguồn không?" — những loại không được gửi đi chính là những loại to, và đó là lý do gói ngây thơ phình gấp mười sáu lần; một ngưỡng kích thước là quy tắc loại trừ rẻ nhất để duy trì',
            ),
            B(
              '"Does the application read it at run time?" — anything the process opens while serving traffic must be inside the release so it cannot go missing during a swap, and anything it does not open can be excluded',
              '"Ứng dụng có đọc nó lúc chạy không?" — cái gì tiến trình mở trong lúc phục vụ thì phải nằm TRONG bản phát hành để không bị thất lạc lúc tráo, còn cái gì nó không mở thì loại ra được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The four categories are source (committed, ships), derived (rebuilt on the target, never copied), runtime state (uploads, logs, caches, a SQLite file — lives on the server, the deploy must not touch it) and configuration (<code>.env</code>, certificates, keys — server-side, never in the artifact). The question above separates them mechanically, and both "yes" answers point at the same conclusion: those paths belong outside the release directory, in the shared directory, symlinked in. Option B is the specific mistake Lesson 1.1 exists to correct — <code>.gitignore</code> governs what git tracks and nothing else, and a raw rsync or tar never consults it. Option D is backwards for exactly the paths that hurt: the application does read the upload folder at run time, and that is why it must <em>not</em> be inside the release.',
            'Bốn loại là: mã nguồn (đã commit, được gửi đi), thứ dựng ra (dựng lại trên máy đích, không bao giờ chép), trạng thái lúc chạy (tệp tải lên, log, cache, một tệp SQLite — sống trên máy chủ, lần deploy KHÔNG được đụng vào) và cấu hình (<code>.env</code>, chứng chỉ, khoá — phía máy chủ, không bao giờ nằm trong tạo tác). Câu hỏi ở trên tách chúng ra một cách máy móc, và cả hai câu trả lời "CÓ" đều dẫn tới cùng một kết luận: những đường dẫn ấy thuộc về BÊN NGOÀI thư mục bản phát hành, nằm ở thư mục dùng chung rồi liên kết mềm vào. Phương án B đúng là sai lầm mà Bài 1.1 sinh ra để sửa — <code>.gitignore</code> chỉ chi phối cái gì được git THEO DÕI, không chi phối gì khác, và một lệnh rsync hay tar trơ trọi không bao giờ đọc tới nó. Phương án D thì ngược hẳn với đúng những đường dẫn gây đau: ứng dụng CÓ đọc thư mục tải lên lúc chạy, và chính vì thế nó KHÔNG được nằm trong bản phát hành.',
          ),
        }),

        // q13 · đáp án D
        mcq({
          prompt: B(
            'A rollback has just moved <code>hien-tai</code> back to <code>v2</code>. The nightly pruner then runs "keep the 3 newest". Measured:' +
            code('hien-tai -> v2   (vua lui ve)\n' +
                 'ls | sort | head -n -3  → v1 v2\n' +
                 '  xoa v1\n' +
                 '  xoa v2\n' +
                 'con lai: v3 v4 v5\n' +
                 'readlink hien-tai : /srv/p/phat-hanh/v2\n' +
                 'cat hien-tai/ban.txt: No such file or directory\n' +
                 '[ -e hien-tai ] → KHONG\n' +
                 '[ -L hien-tai ] → CO') +
            'Which pair of facts in that transcript is the one a pruner has to act on?',
            'Một cú lùi bản vừa đưa <code>hien-tai</code> về <code>v2</code>. Sau đó script dọn ban đêm chạy với luật "giữ 3 bản mới nhất". Đo được:' +
            code('hien-tai -> v2   (vua lui ve)\n' +
                 'ls | sort | head -n -3  → v1 v2\n' +
                 '  xoa v1\n' +
                 '  xoa v2\n' +
                 'con lai: v3 v4 v5\n' +
                 'readlink hien-tai : /srv/p/phat-hanh/v2\n' +
                 'cat hien-tai/ban.txt: No such file or directory\n' +
                 '[ -e hien-tai ] → KHONG\n' +
                 '[ -L hien-tai ] → CO') +
            'Cặp sự kiện nào trong đoạn terminal ấy là thứ một script dọn buộc phải hành động theo?',
          ),
          options: [
            B(
              'That <code>rm -rf</code> succeeded on a directory the symlink pointed at — the kernel should have refused, and the fix is to open the release directory read-only during a deploy so the link count protects it',
              'Rằng <code>rm -rf</code> đã thành công trên một thư mục mà symlink đang trỏ tới — nhân hệ điều hành lẽ ra phải từ chối, và cách chữa là mở thư mục bản phát hành ở chế độ chỉ đọc trong lúc deploy để số liên kết bảo vệ nó',
            ),
            B(
              'That the deletion did not error — so the pruner should check its own exit code more carefully, and a non-zero status from <code>rm</code> would have caught this before the next request arrived',
              'Rằng phép xoá không hề báo lỗi — nên script dọn phải kiểm mã thoát của chính nó kỹ hơn, và một mã khác 0 từ <code>rm</code> sẽ bắt được chuyện này trước khi request kế tiếp tới nơi',
            ),
            B(
              'That "keep the 3 newest" was the wrong retention number — with five releases and a rollback two steps back, the policy must keep at least five, and any policy smaller than the rollback distance produces this state',
              'Rằng "giữ 3 bản mới nhất" là con số lưu giữ sai — với năm bản và một cú lùi hai bước, chính sách phải giữ ít nhất năm bản, và bất kỳ chính sách nào nhỏ hơn khoảng lùi đều đẻ ra trạng thái này',
            ),
            B(
              'That the target of <code>hien-tai</code> was deleted without any error at delete time, and that <code>[ -e ]</code> is FALSE on the resulting dangling link while <code>[ -L ]</code> is TRUE — so a pruner must read the symlink first and skip its target, and a check written with <code>-e</code> will not even notice the link exists',
              'Rằng đích của <code>hien-tai</code> bị xoá mà lúc xoá KHÔNG có lỗi nào, và rằng <code>[ -e ]</code> là SAI trên cái liên kết treo còn <code>[ -L ]</code> lại ĐÚNG — nên script dọn phải ĐỌC symlink trước rồi bỏ qua đích của nó, và một phép kiểm viết bằng <code>-e</code> thậm chí không nhận ra là cái liên kết vẫn còn đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured. Nothing errors at delete time — the failure arrives on the next request, or on the next restart, which is what makes this a 3 a.m. incident rather than a red build. The pruner must resolve the link first (<code>DANG_DUNG=$(basename "$(readlink -f /srv/app/hien-tai)")</code>) and <code>continue</code> past that name. The second half is the subtle part and it bites the recovery script too: <code>[ -e hien-tai ]</code> follows the link and is false, so a guard like <code>[ -e "$GOC/hien-tai" ] || tao_lai_symlink</code> silently rebuilds a link that already exists, while <code>[ -L ]</code> is the test that says "there is a symlink here" regardless of whether it resolves. Option C is a reasonable policy remark and it is not the mechanism: raising the number makes this rarer without making it impossible, because a rollback can always go further back than the policy anticipated.',
            'Đã đo. Không có lỗi nào lúc XOÁ — cú hỏng chỉ tới ở request kế tiếp, hoặc ở lần khởi động lại kế tiếp, và đó là thứ biến chuyện này thành một sự cố lúc 3 giờ sáng thay vì một bản dựng đỏ. Script dọn phải giải liên kết trước (<code>DANG_DUNG=$(basename "$(readlink -f /srv/app/hien-tai)")</code>) rồi <code>continue</code> qua cái tên ấy. Nửa sau mới là chỗ tinh vi, và nó cắn cả script cứu hộ: <code>[ -e hien-tai ]</code> ĐI THEO liên kết nên trả về sai, khiến một cái chốt kiểu <code>[ -e "$GOC/hien-tai" ] || tao_lai_symlink</code> âm thầm dựng lại một liên kết vốn đã có, trong khi <code>[ -L ]</code> mới là phép kiểm nói "ở đây có một symlink" bất kể nó có giải được hay không. Phương án C là một nhận xét hợp lý về chính sách nhưng không phải cơ chế: nâng con số lên chỉ làm chuyện này HIẾM đi chứ không làm nó bất khả, vì một cú lùi bản luôn có thể đi xa hơn mức chính sách dự liệu.',
          ),
        }),

        // q14 · đáp án B
        mcq({
          prompt: B(
            'Five releases created with <code>cp -al</code> from an 8 MB source, measured on ext4 with coreutils 9.1:' +
            code('du -sh /d/v1 … /d/v5 : 8.1M 8.1M 8.1M 8.1M 8.1M\n' +
                 'du -sh /d            : 8.1M\n' +
                 'du -s --count-links /d: 41M') +
            'A monitoring script sums the per-release figures and alerts at 40 MB. What is wrong with it?',
            'Năm bản phát hành tạo bằng <code>cp -al</code> từ một nguồn 8 MB, đo trên ext4 với coreutils 9.1:' +
            code('du -sh /d/v1 … /d/v5 : 8.1M 8.1M 8.1M 8.1M 8.1M\n' +
                 'du -sh /d            : 8.1M\n' +
                 'du -s --count-links /d: 41M') +
            'Một script giám sát cộng các con số theo từng bản rồi báo động ở mức 40 MB. Nó sai ở đâu?',
          ),
          options: [
            B(
              'Nothing is wrong with the script; the bug is <code>cp -al</code>, which reports each release at full size because the hard links are counted against every name — the summing is correct and the parent figure is the one that is misleading',
              'Script chẳng sai gì; lỗi nằm ở <code>cp -al</code>, thứ báo mỗi bản ở kích thước đầy đủ vì liên kết cứng bị tính vào MỌI cái tên — phép cộng là đúng, và con số ở thư mục cha mới là con số đánh lừa',
            ),
            B(
              'It is summing figures that each count the shared blocks once, so the parts add up to 41 MB while the whole is 8.1 MB — <code>du</code> counts a shared inode once per invocation, and the alert will fire at five releases that cost the disk almost nothing',
              'Nó đang cộng những con số mà mỗi con số đã tính khối dùng chung MỘT lần, nên các phần cộng lại thành 41 MB trong khi cái toàn thể chỉ 8,1 MB — <code>du</code> đếm một inode dùng chung một lần cho MỖI LƯỢT GỌI, và cái báo động sẽ nổ ở năm bản mà thật ra gần như chẳng tốn đĩa gì',
            ),
            B(
              'It should be reading <code>df</code> rather than <code>du</code>, because <code>du</code> never counts sparse files or filesystem metadata; on a releases directory the difference is exactly the 33 MB seen here',
              'Nó lẽ ra phải đọc <code>df</code> chứ không phải <code>du</code>, vì <code>du</code> không bao giờ đếm tệp thưa và siêu dữ liệu hệ tệp; trên một thư mục bản phát hành thì khác biệt đúng bằng 33 MB thấy ở đây',
            ),
            B(
              'It is missing <code>--apparent-size</code>: without it <code>du</code> reports allocated blocks rather than file sizes, and the five identical figures are a rounding artefact of the 4 KB block size on this filesystem',
              'Nó thiếu <code>--apparent-size</code>: không có cờ ấy thì <code>du</code> báo số khối được cấp phát chứ không phải kích thước tệp, và năm con số giống hệt nhau kia là tạo tác làm tròn của kích thước khối 4 KB trên hệ tệp này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured. Each release is a complete, runnable directory tree — not a diff and not a patch — and the sharing is invisible to everything except <code>du</code>. Within one invocation <code>du</code> remembers inodes it has already counted, so <code>du -sh /d</code> says 8.1 MB; run separately, each release honestly reports the full 8.1 MB it can see. <code>--count-links</code> makes it count every name, which is how the 41 MB figure was produced and why the two disagree. The practical rule for a monitoring script is to measure the parent directory in a single invocation, or measure free space with <code>df</code> and alert on the trend. And the sharp edge that comes with the saving is separate: writing through one name writes to all of them unless the tool replaces the directory entry — which is why a release directory must be treated as read-only once created.',
            'Đã đo. Mỗi bản phát hành là một cây thư mục ĐẦY ĐỦ, chạy được — không phải một bản diff, không phải một miếng vá — và việc dùng chung là vô hình với mọi thứ TRỪ <code>du</code>. Trong cùng một lượt gọi, <code>du</code> nhớ những inode nó đã đếm rồi, nên <code>du -sh /d</code> nói 8,1 MB; chạy riêng từng cái thì mỗi bản thật thà báo đủ 8,1 MB mà nó nhìn thấy. Cờ <code>--count-links</code> bắt nó đếm MỌI cái tên, và đó là chỗ ra con số 41 MB cũng như lý do hai bên vênh nhau. Quy tắc thực dụng cho một script giám sát là đo thư mục CHA trong MỘT lượt gọi, hoặc đo chỗ trống bằng <code>df</code> rồi báo động theo xu hướng. Còn cái lưỡi dao đi kèm khoản tiết kiệm ấy lại là chuyện khác: ghi qua một cái tên là ghi vào tất cả, trừ khi công cụ thay THẺ THƯ MỤC — và đó là lý do một thư mục bản phát hành phải được coi là chỉ đọc ngay khi vừa tạo xong.',
          ),
        }),

        // q15 · đáp án C
        mcq({
          prompt: B(
            'A deploy copies <code>node_modules</code> from a developer laptop up to the server, because "the lockfile pins everything, so the tree is identical". What is the flaw, in the words this repository\'s own incident log uses?',
            'Một quy trình deploy chép <code>node_modules</code> từ máy lập trình viên lên máy chủ, với lý lẽ "tệp khoá đã ghim hết rồi nên cây thư viện y hệt nhau". Sai lầm nằm ở đâu, nói theo đúng chữ trong nhật ký sự cố của chính kho mã này?',
          ),
          options: [
            B(
              'The lockfile pins versions but not install order, so a package with a <code>postinstall</code> hook can produce a different tree on the two machines; running <code>npm ci --ignore-scripts</code> on both sides makes the copy safe',
              'Tệp khoá ghim phiên bản nhưng không ghim THỨ TỰ cài, nên một gói có hook <code>postinstall</code> có thể sinh ra hai cây khác nhau trên hai máy; chạy <code>npm ci --ignore-scripts</code> ở cả hai bên là chép được an toàn',
            ),
            B(
              'The tree is identical but the paths inside it are not: npm records absolute paths in <code>.package-lock.json</code> under <code>node_modules</code>, so the copied tree points at a home directory that does not exist on the server',
              'Cây thì y hệt nhưng các đường dẫn bên trong thì không: npm ghi đường dẫn tuyệt đối vào <code>.package-lock.json</code> nằm trong <code>node_modules</code>, nên cây được chép trỏ vào một thư mục nhà không tồn tại trên máy chủ',
            ),
            B(
              'The lockfile pins the version and the integrity hash — not the platform. Any dependency with a compiled component resolves to a different binary on a different OS, architecture or libc, and the build is green right up to the moment the process starts',
              'Tệp khoá ghim phiên bản và mã băm toàn vẹn — chứ KHÔNG ghim nền tảng. Bất kỳ phụ thuộc nào có phần biên dịch sẽ giải ra một tệp nhị phân KHÁC trên một hệ điều hành, kiến trúc hay libc khác, và bản dựng vẫn xanh cho tới đúng khoảnh khắc tiến trình khởi động',
            ),
            B(
              'Copying is fine for pure-JavaScript dependencies and the real problem is size: 780 entries and 3.1 MB across the wire on every deploy, which is what the delta algorithm was supposed to avoid',
              'Chép thì ổn với các phụ thuộc thuần JavaScript, còn vấn đề thật là KÍCH THƯỚC: 780 mục và 3,1 MB đi qua đường truyền ở mỗi lần deploy, đúng thứ mà thuật toán chênh lệch sinh ra để tránh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This repository shipped an image built <code>FROM node:22-alpine</code> — musl — carrying a Prisma engine compiled for <code>debian-openssl-3.0.x</code>, which is glibc. The build was green, the push was green, the swap was green, and then the backend restart-looped and the API returned 502 for seven minutes. Nothing before production could see it, because every check up to that point was checking the <em>build</em>, and the build was fine. The sentence written afterwards was: <b>a green build does not mean a runnable image.</b> Option D is true and small — it works for a pure-JavaScript project right up until one dependency adds a native module in a patch release, which is a change nobody reviews. The fix is to install dependencies on the target, or inside an image built for it, and — if you build elsewhere — to add one assertion comparing the built artifact against the runtime it is going to, run before the push.',
            'Kho mã này từng gửi đi một ảnh dựng <code>FROM node:22-alpine</code> — tức musl — mang theo một engine Prisma biên dịch cho <code>debian-openssl-3.0.x</code>, tức glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi backend restart vô tận và API trả 502 suốt bảy phút. Không có gì trước production nhìn thấy được, vì mọi phép kiểm tới lúc đó đều đang kiểm BẢN DỰNG, mà bản dựng thì không sao cả. Câu viết lại sau đó là: <b>dựng xanh không có nghĩa là ảnh chạy được.</b> Phương án D đúng nhưng nhỏ — chép được thật, với một dự án thuần JavaScript, cho tới đúng ngày một phụ thuộc thêm mô-đun biên dịch trong một bản vá nhỏ, thứ chẳng ai soát. Cách chữa là cài phụ thuộc TRÊN MÁY ĐÍCH, hoặc bên trong một ảnh dựng cho máy đích, và — nếu buộc phải dựng ở nơi khác — thêm đúng một phép khẳng định so tạo tác vừa dựng với runtime mà nó sắp chạy, chạy TRƯỚC khi đẩy đi.',
          ),
        }),

        /* ── Chương 2 — vận chuyển (8 câu) ─────────────────────────────── */

        // q16 · đáp án A
        mcq({
          prompt: B(
            'The same source and the same destination, synced twice with rsync 3.2.7. The destination starts with <code>tai-len/quan-trong.jpg</code>, <code>logs/cu.log</code>, <code>node_modules/cu.js</code>, <code>cu/bo-di.js</code> and <code>roi-rac.txt</code>; the source has none of those:' +
            code('=== rsync -a --delete --exclude node_modules --exclude tai-len --exclude logs ===\n' +
                 '  logs/cu.log\n' +
                 '  node_modules/cu.js\n' +
                 '  src/app.js\n' +
                 '  tai-len/quan-trong.jpg\n\n' +
                 '=== cung the, THEM --delete-excluded ===\n' +
                 '  src/app.js') +
            'What does the first result establish about <code>--exclude</code>?',
            'Cùng một nguồn và cùng một đích, đồng bộ hai lần bằng rsync 3.2.7. Ở đích ban đầu có <code>tai-len/quan-trong.jpg</code>, <code>logs/cu.log</code>, <code>node_modules/cu.js</code>, <code>cu/bo-di.js</code> và <code>roi-rac.txt</code>; nguồn không có cái nào trong số đó:' +
            code('=== rsync -a --delete --exclude node_modules --exclude tai-len --exclude logs ===\n' +
                 '  logs/cu.log\n' +
                 '  node_modules/cu.js\n' +
                 '  src/app.js\n' +
                 '  tai-len/quan-trong.jpg\n\n' +
                 '=== cung the, THEM --delete-excluded ===\n' +
                 '  src/app.js') +
            'Kết quả thứ nhất xác lập điều gì về <code>--exclude</code>?',
          ),
          options: [
            B(
              'That it does two jobs at once: it keeps a path out of the transfer AND it protects the matching path at the destination from <code>--delete</code>. <code>cu/bo-di.js</code> and <code>roi-rac.txt</code> were removed because nothing protected them; <code>--delete-excluded</code> is the flag that revokes the protection',
              'Rằng nó làm HAI việc cùng lúc: vừa giữ một đường dẫn ra khỏi lượt truyền, VỪA che chở đường dẫn tương ứng ở ĐÍCH khỏi <code>--delete</code>. <code>cu/bo-di.js</code> và <code>roi-rac.txt</code> bị xoá vì chẳng có gì che chở chúng; <code>--delete-excluded</code> chính là cờ rút lại sự che chở ấy',
            ),
            B(
              'That <code>--delete</code> only removes files whose parent directory exists in the source, so <code>tai-len/</code> and <code>logs/</code> survived because the source has no such directories, and the exclude patterns had no effect at all on this run',
              'Rằng <code>--delete</code> chỉ xoá những tệp mà thư mục cha của chúng CÓ ở nguồn, nên <code>tai-len/</code> và <code>logs/</code> sống sót vì nguồn không có thư mục nào tên như vậy, còn các mẫu loại trừ chẳng ảnh hưởng gì tới lượt chạy này',
            ),
            B(
              'That the patterns are matched against the destination rather than the source, which is why they read as protection rules; matching against the source requires <code>--filter</code> with an explicit <code>-</code> prefix',
              'Rằng các mẫu được khớp với ĐÍCH chứ không phải nguồn, và vì thế chúng đọc ra như những quy tắc che chở; muốn khớp với nguồn thì phải dùng <code>--filter</code> kèm tiền tố <code>-</code> tường minh',
            ),
            B(
              'That <code>--delete</code> is a no-op without <code>--recursive</code>: the surviving files are all one level down, so they were never visited; <code>roi-rac.txt</code> disappeared because it sat at the top level where the delete pass does run',
              'Rằng <code>--delete</code> vô tác dụng nếu thiếu <code>--recursive</code>: những tệp sống sót đều nằm sâu một tầng nên chưa bao giờ được ghé thăm; <code>roi-rac.txt</code> biến mất vì nó nằm ở tầng ngoài cùng, nơi lượt xoá có chạy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on rsync 3.2.7, both runs. This is the property that makes the standard deploy line safe — <code>rsync -a --delete --exclude node_modules --exclude tai-len --exclude logs</code> removes files you deleted from the repository while leaving the server\'s own uploads and logs alone — and it is also the property that makes <code>--delete-excluded</code> a foot-gun, because the second run deleted exactly the three directories the first run protected. Note what was <em>not</em> protected: <code>cu/bo-di.js</code> and <code>roi-rac.txt</code> matched no pattern, so <code>--delete</code> took them without a word and without an error. That is the danger from Lesson 2.1 in its usual form — the belt is the <code>--filter=&#39;protect …&#39;</code> rule at the receiving side, and the braces is <code>-n</code> before the first real deploy.',
            'Đã đo trên rsync 3.2.7, cả hai lượt. Đây chính là tính chất làm cho dòng deploy chuẩn trở nên an toàn — <code>rsync -a --delete --exclude node_modules --exclude tai-len --exclude logs</code> xoá đi những tệp bạn đã bỏ khỏi kho mã trong khi vẫn để yên tệp tải lên và log của chính máy chủ — và cũng chính là tính chất biến <code>--delete-excluded</code> thành một khẩu súng chĩa vào chân, vì lượt thứ hai đã xoá đúng ba thư mục mà lượt thứ nhất che chở. Hãy để ý thứ KHÔNG được che chở: <code>cu/bo-di.js</code> và <code>roi-rac.txt</code> không khớp mẫu nào, nên <code>--delete</code> mang chúng đi không một lời và không một lỗi. Đó là mối nguy ở Bài 2.1 dưới dạng thường gặp — cái thắt lưng là quy tắc <code>--filter=&#39;protect …&#39;</code> ở phía NHẬN, còn dây đeo quần là cờ <code>-n</code> trước lần deploy thật đầu tiên.',
          ),
        }),

        // q17 · đáp án B
        mcq({
          prompt: B(
            'Four ways of getting a release onto a server. Three of them appear in this chapter as reasonable choices for different situations; one is listed as a shape to avoid outright:' +
            code('A) rsync vao mot thu muc phat hanh MOI, roi doi symlink\n' +
                 'B) git push vao mot kho TRAN, hook checkout ra thu muc moi\n' +
                 'C) docker pull theo DIGEST, roi compose up -d\n' +
                 'D) git pull trong mot BAN CLONE dang lam viec tren may chu') +
            'Which is the one to avoid, and what exactly is the surface it adds?',
            'Bốn cách đưa một bản phát hành lên máy chủ. Ba cách xuất hiện trong chương này như những lựa chọn hợp lý cho các tình huống khác nhau; một cách bị liệt vào loại nên tránh hẳn:' +
            code('A) rsync vao mot thu muc phat hanh MOI, roi doi symlink\n' +
                 'B) git push vao mot kho TRAN, hook checkout ra thu muc moi\n' +
                 'C) docker pull theo DIGEST, roi compose up -d\n' +
                 'D) git pull trong mot BAN CLONE dang lam viec tren may chu') +
            'Cách nào là cách nên tránh, và chính xác thì nó thêm vào cái BỀ MẶT gì?',
          ),
          options: [
            B(
              'C, because pulling by digest pins the bytes but not the compose file, so a stale <code>docker-compose.yml</code> on the server can start the wrong service definition against the right image',
              'C, vì kéo theo mã băm nội dung thì ghim được các byte nhưng không ghim cái tệp compose, nên một <code>docker-compose.yml</code> cũ trên máy chủ có thể khởi động sai định nghĩa dịch vụ với đúng cái ảnh',
            ),
            B(
              'D. A working clone on the server can develop local changes — an edited config, a hotfix somebody applied at 2 a.m., a merge conflict — so a deploy fails with a message about uncommitted work on a machine nobody was editing. A bare repository plus a checkout into a FRESH directory has none of that surface',
              'D. Một bản clone đang làm việc trên máy chủ có thể sinh ra thay đổi CỤC BỘ — một tệp cấu hình bị sửa, một bản vá nóng ai đó áp lúc 2 giờ sáng, một xung đột gộp — nên một lần deploy hỏng với thông báo về "công việc chưa commit" trên một cái máy chẳng ai ngồi sửa. Một kho TRẦN cộng một lượt checkout ra thư mục MỚI TINH thì không có cái bề mặt ấy',
            ),
            B(
              'A, because rsync into a new directory doubles the disk requirement at the moment of the deploy, which is the peak that fills a small VPS; the other three all replace in place and never need two copies at once',
              'A, vì rsync vào một thư mục mới làm nhu cầu đĩa tăng gấp đôi ĐÚNG vào lúc deploy, và đó chính là cái đỉnh làm đầy một cái VPS nhỏ; ba cách còn lại đều thay tại chỗ và không bao giờ cần hai bản cùng lúc',
            ),
            B(
              'B, because a hook runs as whoever pushed and therefore with that user\'s permissions, so a deploy from a second developer creates files the first cannot overwrite — the ownership problem from Chapter 0 arriving by a different route',
              'B, vì một hook chạy dưới danh nghĩa người vừa push và do đó mang quyền của người ấy, nên một lần deploy từ lập trình viên thứ hai tạo ra những tệp mà người thứ nhất không ghi đè được — đúng vấn đề quyền sở hữu ở Chương 0, tới bằng một con đường khác',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The three good options differ in what they suit — rsync when the artifact is already built, <code>git push</code> when the artifact is source and the repository is modest, a registry when the runtime is part of what you ship or there is more than one server — and they share one property: the deploy writes to a name nothing else is using, so retrying is always correct. A working clone on the server breaks that. It is a directory with state that somebody can change, and every one of its failure modes is a mystery: <code>git pull</code> refusing because of local modifications nobody made deliberately, a hotfix that exists on exactly one machine and nowhere else, a merge conflict resolved by whoever was on call. Option D in the list also loses the property that makes the other three safe — there is no moment where the new version exists complete and untouched before it becomes live, so an interrupted pull leaves the live directory mid-update, which is the mixed-release state this chapter measures. Option A names a real cost that the releases layout answers with hard links, and option D-as-an-answer names a real hazard that the forced-command key from Chapter 0 and a single deploy user both address.',
            'Ba lựa chọn tốt khác nhau ở chỗ chúng HỢP với cái gì — rsync khi tạo tác đã dựng sẵn, <code>git push</code> khi tạo tác là mã nguồn và kho vừa phải, một registry khi runtime là một phần của thứ bạn gửi đi hoặc khi có nhiều hơn một máy chủ — và chúng chia sẻ một tính chất: lần deploy GHI vào một cái tên mà không thứ gì khác đang dùng, nên chạy lại lúc nào cũng đúng. Một bản clone đang làm việc trên máy chủ phá vỡ điều đó. Nó là một thư mục CÓ TRẠNG THÁI mà ai đó thay đổi được, và mọi kiểu hỏng của nó đều là một bí ẩn: <code>git pull</code> từ chối vì những sửa đổi cục bộ chẳng ai cố ý tạo ra, một bản vá nóng chỉ tồn tại trên đúng một cái máy và không ở đâu khác, một xung đột gộp do người trực ca giải quyết. Phương án D trong danh sách còn đánh mất luôn cái tính chất làm ba cách kia an toàn — không hề có một khoảnh khắc nào mà bản mới tồn tại ĐẦY ĐỦ và chưa bị đụng tới trước khi nó lên sóng, nên một lượt pull bị đứt để lại chính cái thư mục đang phục vụ ở trạng thái cập nhật dở, tức là trạng thái pha trộn hai bản phát hành mà chương này đo. Phương án A gọi tên một cái giá CÓ THẬT mà cách bố trí bản phát hành trả lời bằng liên kết cứng, còn phương án D-với-tư-cách-đáp-án gọi tên một mối nguy CÓ THẬT mà cả cái khoá ép-lệnh ở Chương 0 lẫn việc dùng một người dùng deploy duy nhất đều xử lý được.',
          ),
        }),

        // q18 · đáp án D
        mcq({
          prompt: B(
            'Two bare repositories, each with one hook that prints a line and exits 1. Measured on git 2.39.5:' +
            code('-- hook nam o post-receive --\n' +
                 '   remote: [hook] dang chay\n' +
                 '   To /g/kho.git\n' +
                 '    * [new branch]      master -> master\n' +
                 '   ma thoat cua git push = 0\n' +
                 '   ref tren kho tran    = d108b2b\n\n' +
                 '-- CUNG hook do, nam o pre-receive --\n' +
                 '   remote: [hook] tu choi\n' +
                 '    ! [remote rejected] master -> master (pre-receive hook declined)\n' +
                 '   ma thoat cua git push = 1\n' +
                 "   ref tren kho tran    = ''") +
            'What follows for a deploy built on a <code>post-receive</code> hook?',
            'Hai kho trần, mỗi kho một cái hook in ra một dòng rồi thoát 1. Đo trên git 2.39.5:' +
            code('-- hook nam o post-receive --\n' +
                 '   remote: [hook] dang chay\n' +
                 '   To /g/kho.git\n' +
                 '    * [new branch]      master -> master\n' +
                 '   ma thoat cua git push = 0\n' +
                 '   ref tren kho tran    = d108b2b\n\n' +
                 '-- CUNG hook do, nam o pre-receive --\n' +
                 '   remote: [hook] tu choi\n' +
                 '    ! [remote rejected] master -> master (pre-receive hook declined)\n' +
                 '   ma thoat cua git push = 1\n' +
                 "   ref tren kho tran    = ''") +
            'Điều đó kéo theo hệ quả gì cho một quy trình deploy dựng trên hook <code>post-receive</code>?',
          ),
          options: [
            B(
              'That the hook should exit 0 explicitly and report failures over a side channel, since git treats any non-zero status from <code>post-receive</code> as a protocol error and may leave the ref half-written',
              'Rằng hook nên thoát 0 một cách tường minh và báo lỗi qua một kênh phụ, vì git coi mọi mã khác 0 từ <code>post-receive</code> là lỗi giao thức và có thể để cái ref ghi dở dang',
            ),
            B(
              'That <code>set -euo pipefail</code> at the top of the hook is what makes the push fail, so adding it converts the first result into the second without moving the hook',
              'Rằng <code>set -euo pipefail</code> ở đầu hook mới là thứ làm cho lệnh push hỏng, nên chỉ cần thêm nó là biến kết quả thứ nhất thành kết quả thứ hai mà không phải dời hook đi đâu',
            ),
            B(
              'That the two hooks are interchangeable and the difference is cosmetic: both ran, both printed, and the ref ended up in the state the pusher intended in each case',
              'Rằng hai hook thay thế cho nhau được và khác biệt chỉ là hình thức: cả hai đều chạy, đều in ra, và cái ref rốt cuộc đều ở đúng trạng thái mà người push mong muốn trong cả hai ca',
            ),
            B(
              'That a broken deploy leaves you with a push that looked fine: <code>post-receive</code> runs AFTER the objects are stored, so its exit code cannot undo anything. <code>set -euo pipefail</code> stops the damage spreading but cannot reverse the push, and rejecting a push requires <code>pre-receive</code>',
              'Rằng một lần deploy hỏng giữa chừng để lại cho bạn một cú push TRÔNG có vẻ ổn: <code>post-receive</code> chạy SAU khi các đối tượng đã được lưu, nên mã thoát của nó không hoàn tác được gì. <code>set -euo pipefail</code> ngăn thiệt hại lan ra nhưng không đảo ngược nổi cú push, và muốn TỪ CHỐI một cú push thì phải dùng <code>pre-receive</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, and worth noting that git 2.39.5 printed no warning at all about the failed hook — the push output is indistinguishable from a clean one unless you read the <code>remote:</code> lines the hook itself wrote. The consequence for a deploy is the one the chapter builds on: everything the hook does before the symlink swap can fail without affecting the running site, so put the swap last; and everything after it is committed, so the verification at the end has to be paired with an actual rollback rather than an <code>exit 1</code>. If you genuinely need to <em>reject</em> — a push to the wrong branch, a working tree that fails a policy check — that is <code>pre-receive</code>, which runs before anything is stored and whose exit code does decide the outcome.',
            'Đã đo, và đáng ghi nhận rằng git 2.39.5 KHÔNG in ra cảnh báo nào về cái hook hỏng — đầu ra của lệnh push không phân biệt được với một lần push sạch, trừ khi bạn đọc mấy dòng <code>remote:</code> mà chính hook viết ra. Hệ quả cho một quy trình deploy chính là thứ mà cả chương này dựng lên: mọi việc hook làm TRƯỚC bước tráo symlink đều có thể hỏng mà không đụng gì tới trang đang chạy, nên hãy đặt bước tráo ở CUỐI; còn mọi việc SAU nó thì đã chốt rồi, nên phép kiểm ở cuối buộc phải đi kèm một cú lùi bản THẬT chứ không phải một dòng <code>exit 1</code>. Nếu bạn thật sự cần TỪ CHỐI — một cú push nhầm nhánh, một cây làm việc trượt một quy tắc — thì đó là <code>pre-receive</code>, thứ chạy trước khi có gì được lưu và mã thoát của nó quyết định kết cục.',
          ),
        }),

        // q19 · đáp án B + D (chọn HAI)
        mcq({
          prompt: B(
            'A fifteen-line <code>post-receive</code> hook is a complete deploy. <b>Choose TWO</b> details in it that are load-bearing rather than decoration.' +
            code('while read -r cu moi ref; do\n' +
                 '  [ "$ref" = "refs/heads/master" ] || { echo " bo qua $ref"; continue; }\n' +
                 '  BAN="$DICH/phat-hanh/$(date -u +%Y-%m-%d-%H%M%S)-$(echo "$moi" | cut -c1-7)"\n' +
                 '  mkdir -p "$BAN"\n' +
                 '  git --work-tree="$BAN" --git-dir=/srv/app/kho.git checkout -f master\n' +
                 '  ln -sfn "$BAN" "$DICH/ht.moi" && mv -T "$DICH/ht.moi" "$DICH/hien-tai"\n' +
                 'done'),
            'Một hook <code>post-receive</code> mười lăm dòng là một quy trình deploy hoàn chỉnh. <b>Chọn HAI</b> chi tiết trong đó là chịu lực chứ không phải trang trí.' +
            code('while read -r cu moi ref; do\n' +
                 '  [ "$ref" = "refs/heads/master" ] || { echo " bo qua $ref"; continue; }\n' +
                 '  BAN="$DICH/phat-hanh/$(date -u +%Y-%m-%d-%H%M%S)-$(echo "$moi" | cut -c1-7)"\n' +
                 '  mkdir -p "$BAN"\n' +
                 '  git --work-tree="$BAN" --git-dir=/srv/app/kho.git checkout -f master\n' +
                 '  ln -sfn "$BAN" "$DICH/ht.moi" && mv -T "$DICH/ht.moi" "$DICH/hien-tai"\n' +
                 'done'),
          ),
          options: [
            B(
              '<code>cut -c1-7</code> — seven characters is the shortest prefix git guarantees to be unique, so anything shorter can name two commits and make two releases collide in one directory',
              '<code>cut -c1-7</code> — bảy ký tự là tiền tố ngắn nhất mà git bảo đảm là duy nhất, nên ngắn hơn thì có thể gọi tên hai commit và làm hai bản phát hành đụng nhau trong một thư mục',
            ),
            B(
              'The <code>refs/heads/master</code> filter — without it, pushing any branch or tag deploys it, which is how a feature branch reaches production when somebody types <code>git push vps</code> with no branch name',
              'Cái bộ lọc <code>refs/heads/master</code> — không có nó thì đẩy nhánh nào hay thẻ nào lên cũng deploy nhánh ấy, và đó là cách một nhánh tính năng lên tới production khi ai đó gõ <code>git push vps</code> mà không ghi tên nhánh',
            ),
            B(
              '<code>mkdir -p</code> — the <code>-p</code> is what makes the hook idempotent, so re-pushing the same commit reuses the release directory instead of failing, which is required for a retry to be safe',
              '<code>mkdir -p</code> — chữ <code>-p</code> mới là thứ làm hook chạy lại được, nên đẩy lại cùng một commit sẽ DÙNG LẠI thư mục bản phát hành thay vì hỏng, và đó là điều kiện để một lần thử lại là an toàn',
            ),
            B(
              'The loop reading from stdin — a single push can update several refs and git feeds the hook one <code>&lt;cu&gt; &lt;moi&gt; &lt;ref&gt;</code> line per updated ref, so a single <code>read</code> would silently handle only the first one',
              'Vòng lặp đọc từ stdin — một cú push có thể cập nhật NHIỀU ref và git đưa cho hook mỗi ref một dòng <code>&lt;cu&gt; &lt;moi&gt; &lt;ref&gt;</code>, nên một lệnh <code>read</code> đơn lẻ sẽ âm thầm chỉ xử lý cái đầu tiên',
            ),
            B(
              '<code>checkout -f</code> — the <code>-f</code> is what lets a bare repository write files at all; without it git refuses to operate on a repository that has no index, and the hook fails on the first push',
              '<code>checkout -f</code> — chữ <code>-f</code> mới là thứ cho phép một kho TRẦN ghi được tệp ra; thiếu nó thì git từ chối thao tác trên một kho không có index, và hook hỏng ngay ở cú push đầu tiên',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'The branch filter and the stdin loop are the two that change the outcome. A <code>post-receive</code> hook is given one line per updated ref, so a single <code>read</code> handles the first and drops the rest — and the old and new hashes on those lines are exactly what you need to compute what changed. Without the filter, <code>git push vps</code> with <code>push.default</code> set to <code>matching</code> sends every branch that exists on both sides, and each one deploys. The others are plausible and wrong in instructive ways: the short-hash length is a naming convenience, not a guarantee (git\'s abbreviation length grows with the repository, which is why the timestamp is what makes the name sort). <code>mkdir -p</code> here is harmless rather than load-bearing, because the timestamp makes the directory name new every time. And <code>-f</code> discards whatever is in the target directory — safe <em>only</em> because the directory is brand new; pointed at a shared directory it would silently overwrite local changes.',
            'Bộ lọc nhánh và vòng lặp đọc stdin là hai thứ làm đổi kết cục. Một hook <code>post-receive</code> được đưa cho MỖI ref được cập nhật một dòng, nên một lệnh <code>read</code> đơn lẻ xử lý cái đầu rồi bỏ rơi phần còn lại — mà chính hai mã băm cũ/mới trên các dòng ấy là thứ bạn cần để tính xem cái gì đã đổi. Thiếu bộ lọc, lệnh <code>git push vps</code> với <code>push.default</code> đặt là <code>matching</code> sẽ gửi MỌI nhánh có ở cả hai bên, và mỗi nhánh đều được deploy. Mấy phương án còn lại nghe hợp lý và sai theo cách dạy được điều gì đó: độ dài mã băm ngắn là chuyện tiện đặt tên chứ không phải một bảo đảm (độ dài viết tắt của git TĂNG theo cỡ kho, và chính vì thế cái dấu thời gian mới là thứ làm cái tên sắp được). <code>mkdir -p</code> ở đây là vô hại chứ không chịu lực, vì dấu thời gian làm tên thư mục mới tinh ở mỗi lượt. Còn <code>-f</code> thì VỨT BỎ bất cứ thứ gì đang có trong thư mục đích — an toàn CHỈ vì thư mục ấy mới toanh; chĩa nó vào một thư mục dùng chung là âm thầm đè lên thay đổi của người khác.',
          ),
        }),

        // q20 · đáp án C
        mcq({
          prompt: B(
            'Two images built from the same Dockerfile, changing only one source file:' +
            code('app2:v1                 app2:v2\n' +
                 '  402f1f70… ← nen        402f1f70… ← Y HET\n' +
                 '  a64469e9… ← phu thuoc  a64469e9… ← Y HET\n' +
                 '  70fa5ac3… ← ma nguon   2524aa7f… ← KHAC\n\n' +
                 'docker save w1 (chi v1)  → 29M\n' +
                 'docker save w2 (chi v2)  → 29M\n' +
                 'docker save w12 (CA HAI) → 29M') +
            'A team deploys by pulling <code>app:latest</code> on the server. Which sentence names the real problem with that?',
            'Hai ảnh dựng từ cùng một Dockerfile, chỉ đổi một tệp nguồn:' +
            code('app2:v1                 app2:v2\n' +
                 '  402f1f70… ← nen        402f1f70… ← Y HET\n' +
                 '  a64469e9… ← phu thuoc  a64469e9… ← Y HET\n' +
                 '  70fa5ac3… ← ma nguon   2524aa7f… ← KHAC\n\n' +
                 'docker save w1 (chi v1)  → 29M\n' +
                 'docker save w2 (chi v2)  → 29M\n' +
                 'docker save w12 (CA HAI) → 29M') +
            'Một nhóm deploy bằng cách kéo <code>app:latest</code> trên máy chủ. Câu nào gọi tên đúng vấn đề thật của cách ấy?',
          ),
          options: [
            B(
              'That <code>latest</code> forces a full 29 MB pull on every deploy, because a moving tag invalidates the local layer cache; pinning any fixed tag restores the 857-byte transfer shown by the digests above',
              'Rằng <code>latest</code> ép phải kéo trọn 29 MB ở mỗi lần deploy, vì một cái thẻ di động làm mất hiệu lực bộ đệm lớp ở máy; ghim bất kỳ thẻ cố định nào là khôi phục lại lượt truyền 857 byte mà các mã băm trên cho thấy',
            ),
            B(
              'That <code>latest</code> is resolved on the client, so two servers pulling at the same second can get different images depending on which registry mirror answers; using a fixed tag makes the resolution deterministic',
              'Rằng <code>latest</code> được giải trên máy khách, nên hai máy chủ kéo cùng một giây có thể nhận hai ảnh khác nhau tuỳ vào bản sao registry nào trả lời; dùng một thẻ cố định là làm phép giải trở nên tất định',
            ),
            B(
              'That a tag is a mutable pointer: two servers pulling <code>app:v2</code> a week apart can legitimately be running different code, and so can the same server after a restart. A digest names exactly one set of bytes forever — so tag for humans and deploy by digest',
              'Rằng một cái thẻ là một CON TRỎ có thể đổi: hai máy chủ kéo <code>app:v2</code> cách nhau một tuần hoàn toàn có thể đang chạy hai đoạn mã khác nhau, và cùng một máy chủ sau khi khởi động lại cũng vậy. Một mã băm nội dung gọi tên đúng một tập byte, vĩnh viễn — nên hãy ĐẶT THẺ cho người đọc và DEPLOY THEO MÃ BĂM',
            ),
            B(
              'That <code>latest</code> is only a convention and carries no risk on a single-server deployment; the real problem in the transcript is the shared dependency layer, which means deleting <code>v1</code> would corrupt <code>v2</code>',
              'Rằng <code>latest</code> chỉ là một quy ước và chẳng mang rủi ro gì với một triển khai một máy chủ; vấn đề thật trong đoạn terminal là cái lớp phụ thuộc dùng chung, nghĩa là xoá <code>v1</code> sẽ làm hỏng <code>v2</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two 29 MB images packaged together are 29 MB because layers are content-addressed and the dependency layer exists once. That same mechanism is why a registry only receives the 857-byte source layer on the second push. But the mechanism says nothing about <em>which</em> bytes a tag names: <code>app:v2</code> can be moved to different content tomorrow by anyone with push access, and <code>:latest</code> is the worst of them because it means "the tag applied when none was given" — a deploy that pulls it has no defined version, cannot be rolled back to a previous one, and cannot answer "what is running?". Push both — a readable tag and a recorded digest — then rollback is redeploying a digest you already have, which is the container form of the symlink swap. Option D gets the layer model backwards: deleting an image does not remove a layer another image references.',
            'Hai ảnh 29 MB gói chung lại vẫn là 29 MB vì các lớp được đánh địa chỉ theo NỘI DUNG và lớp phụ thuộc chỉ tồn tại một bản. Cũng chính cơ chế ấy làm cho registry chỉ nhận thêm lớp mã nguồn 857 byte ở cú đẩy thứ hai. Nhưng cơ chế đó không nói gì về việc một cái THẺ gọi tên NHỮNG BYTE NÀO: <code>app:v2</code> có thể bị dời sang nội dung khác vào ngày mai bởi bất kỳ ai có quyền đẩy, và <code>:latest</code> là cái tệ nhất trong đám vì nó chỉ có nghĩa "cái thẻ được gán khi không ai ghi thẻ nào" — một lần deploy kéo nó về thì không có phiên bản xác định, không lùi về bản trước được, và không trả lời nổi câu "đang chạy cái gì?". Hãy đẩy cả hai — một cái thẻ cho người đọc và một mã băm được ghi lại — rồi lùi bản chính là deploy lại một mã băm bạn vốn đã có, tức là dạng container của cú tráo symlink. Phương án D hiểu ngược mô hình lớp: xoá một ảnh không gỡ đi cái lớp mà một ảnh khác đang tham chiếu.',
          ),
        }),

        // q21 · đáp án A
        mcq({
          prompt: B(
            'A deploy step is wrapped in a retry, because the link is unreliable:' +
            code('while true; do\n' +
                 '  rsync -a --partial ./ vps:"$BAN/" && break\n' +
                 '  echo "thu lai..." >&2\n' +
                 '  sleep 5\n' +
                 'done'),
            'The server it is deploying to is genuinely down. What does this script do, and why is that worse than no retry at all?',
            'Một bước deploy được bọc trong một vòng thử lại, vì đường truyền chập chờn:' +
            code('while true; do\n' +
                 '  rsync -a --partial ./ vps:"$BAN/" && break\n' +
                 '  echo "thu lai..." >&2\n' +
                 '  sleep 5\n' +
                 'done'),
            'Máy chủ mà nó đang deploy tới thì thật sự đã chết. Script này làm gì, và vì sao thế lại tệ hơn là không thử lại gì cả?',
          ),
          options: [
            B(
              'It never fails — it hangs, holding the deploy lock, until somebody notices. A deploy that fails clearly after thirty seconds is a better outcome, so bound the attempts, bound the total time, and make the final failure loud',
              'Nó KHÔNG BAO GIỜ hỏng — nó TREO, ôm khư khư cái khoá deploy, cho tới khi có người để ý. Một lần deploy hỏng dứt khoát sau ba mươi giây là một kết cục tốt hơn, nên hãy giới hạn số lượt, giới hạn tổng thời gian, và làm cho cú hỏng cuối cùng thật ỒN ÀO',
            ),
            B(
              'It corrupts the destination, because <code>--partial</code> keeps the half-transferred file at its real name; each retry resumes into a file another retry is still writing, so the release directory ends up with interleaved content',
              'Nó làm hỏng đích, vì <code>--partial</code> giữ tệp truyền dở ở ĐÚNG cái tên thật; mỗi lượt thử lại tiếp tục ghi vào một tệp mà lượt khác còn đang ghi, nên thư mục bản phát hành rốt cuộc mang nội dung đan xen',
            ),
            B(
              'It exits 0 after the first attempt, because <code>&amp;&amp; break</code> suspends <code>set -e</code> for the rsync, so a failing transfer is treated as a successful one and the loop never runs a second time',
              'Nó thoát 0 ngay sau lượt đầu, vì <code>&amp;&amp; break</code> treo <code>set -e</code> đối với lệnh rsync, nên một lượt truyền hỏng bị coi là thành công và vòng lặp không bao giờ chạy lần thứ hai',
            ),
            B(
              'It works correctly and the objection is only aesthetic: an unbounded retry against a dead server is the same as a bounded one, since the deploy is going to fail either way and the operator will see the repeated messages on stderr',
              'Nó chạy đúng và phản bác chỉ mang tính thẩm mỹ: thử lại vô hạn với một máy chủ chết cũng như thử lại có giới hạn thôi, vì đằng nào lần deploy cũng hỏng và người vận hành sẽ thấy các thông báo lặp lại trên stderr',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The retry itself is the right instinct — a network blip should be an inconvenience rather than an incident — and the transport step is designed to be safely repeatable, because it writes to a brand-new release directory nothing is serving from. The bug is the missing bound. An unbounded loop against a genuinely dead server never reports failure; it holds the <code>flock</code> from Lesson 2.5 for as long as it runs, so every other deploy queues behind a script that will never finish. Bound the attempts (<code>for i in 1 2 3</code>), back off between them, and let the last failure exit non-zero. Option B misreads <code>--partial</code>: it keeps a partially transferred file so a later run can resume — and <code>--partial-dir</code> is what keeps that fragment out of the destination path, so the real name is never a half-written file. Option C is a real hazard in general and not here, because <code>break</code> is what the success path needs.',
            'Bản thân việc thử lại là bản năng ĐÚNG — một cú nấc mạng nên là chuyện bực mình chứ không phải một sự cố — và bước vận chuyển vốn được thiết kế để lặp lại an toàn, vì nó ghi vào một thư mục bản phát hành mới tinh mà không ai đang phục vụ từ đó. Con bọ là chỗ THIẾU GIỚI HẠN. Một vòng lặp vô hạn với một máy chủ đã chết thì không bao giờ báo hỏng; nó giữ cái <code>flock</code> ở Bài 2.5 suốt thời gian nó chạy, nên mọi lần deploy khác xếp hàng sau một script sẽ không bao giờ xong. Hãy giới hạn số lượt (<code>for i in 1 2 3</code>), giãn cách giữa các lượt, và để cú hỏng cuối cùng thoát ra khác 0. Phương án B hiểu sai <code>--partial</code>: nó giữ lại phần đã truyền để lượt sau đi tiếp — còn <code>--partial-dir</code> mới là thứ giữ mảnh ấy ra ngoài đường dẫn đích, nên cái tên thật không bao giờ là một tệp ghi dở. Phương án C là một mối nguy có thật nói chung, nhưng không phải ở đây, vì <code>break</code> chính là thứ đường thành công cần tới.',
          ),
        }),

        // q22 · đáp án B
        mcq({
          prompt: B(
            'Two deploys of different versions, started 150 ms apart. B is started second and finishes first:' +
            code('════ KHONG co khoa ════\n' +
                 '  [B] xong, hien-tai → B\n' +
                 '  [A] xong, hien-tai → A\n' +
                 '  KET QUA: hien-tai → A   ← ban CU hon dang chay\n' +
                 '  ca hai script deu thoat 0 va deu in mot dong thanh cong') +
            'A colleague adds <code>flock /var/lock/deploy.lock bash trien-khai.sh</code> to the front of the deploy command. Why is that not the same as <code>exec 9&gt;/var/lock/deploy.lock; flock -w 30 9</code> inside the script?',
            'Hai lần deploy hai phiên bản khác nhau, khởi động cách nhau 150 ms. B chạy sau mà xong trước:' +
            code('════ KHONG co khoa ════\n' +
                 '  [B] xong, hien-tai → B\n' +
                 '  [A] xong, hien-tai → A\n' +
                 '  KET QUA: hien-tai → A   ← ban CU hon dang chay\n' +
                 '  ca hai script deu thoat 0 va deu in mot dong thanh cong') +
            'Một đồng nghiệp thêm <code>flock /var/lock/deploy.lock bash trien-khai.sh</code> vào trước lệnh deploy. Vì sao thế KHÔNG giống với <code>exec 9&gt;/var/lock/deploy.lock; flock -w 30 9</code> đặt bên trong script?',
          ),
          options: [
            B(
              'Because the command form takes a shared lock while the descriptor form takes an exclusive one; two deploys can hold a shared lock simultaneously, so the race in the transcript is unchanged',
              'Vì dạng lệnh lấy khoá CHIA SẺ còn dạng mô tả tệp lấy khoá ĐỘC QUYỀN; hai lần deploy có thể cùng giữ một khoá chia sẻ, nên cuộc đua trong đoạn terminal chẳng đổi gì',
            ),
            B(
              'They differ in one respect that matters here — nothing, in this case: <code>flock file cmd</code> holds the lock for the whole of <code>cmd</code>, which is the entire script. The form that is genuinely broken is <code>flock file step1; flock file step2</code>, where each step locks and unlocks and the gaps between them are unprotected',
              'Ở đúng một điểm quan trọng thì chúng KHÔNG khác nhau: <code>flock file cmd</code> giữ khoá suốt cả <code>cmd</code>, mà <code>cmd</code> ở đây là cả cái script. Dạng thật sự hỏng là <code>flock file buoc1; flock file buoc2</code>, nơi mỗi bước tự khoá rồi tự mở, và các khoảng hở giữa chúng không được bảo vệ',
            ),
            B(
              'Because the command form creates the lock file with the caller\'s umask and deletes it on exit, so a second deploy starting in that window creates a new file and locks a different inode',
              'Vì dạng lệnh tạo tệp khoá theo umask của người gọi rồi XOÁ nó lúc thoát, nên một lần deploy thứ hai bắt đầu trúng khoảng đó sẽ tạo một tệp mới và khoá một inode khác',
            ),
            B(
              'Because the command form runs the script in a subshell whose exit code is discarded, so a refusal cannot be distinguished from a success by whoever called the deploy',
              'Vì dạng lệnh chạy script trong một subshell mà mã thoát bị vứt bỏ, nên bên gọi lần deploy không phân biệt được một lời từ chối với một lần thành công',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is a question about a real distinction stated precisely rather than approximately. <code>flock file cmd</code> holds the lock for the duration of <code>cmd</code> — if <code>cmd</code> is the whole deploy script, that is exactly what you want, and it is a perfectly good form. The broken pattern is per-step locking, where each command acquires and releases and the gaps in between are unprotected; the file-descriptor form exists so a multi-step deploy holds one lock for the life of the shell. Two properties worth carrying either way: the lock is held on a file descriptor, so the kernel drops it when the process exits — including a crash, a kill or a dropped SSH session, which a hand-made lock file does not give you; and it must live on the machine being deployed to (<code>/var/lock</code> or <code>/run</code>, never inside the release directory you are about to replace), because a lock on your laptop knows nothing about the deploy running from CI. The flag then chooses the semantics: <code>-n</code> makes the second deploy refuse and exit non-zero, <code>-w 30</code> makes it wait — and waiting is usually what you want, because the newest change wins.',
            'Đây là câu hỏi về một phân biệt CÓ THẬT, phát biểu cho chính xác thay vì đại khái. <code>flock file cmd</code> giữ khoá suốt thời gian chạy của <code>cmd</code> — nếu <code>cmd</code> chính là cả cái script deploy thì đó đúng là thứ bạn muốn, và nó là một dạng hoàn toàn tốt. Dạng HỎNG là khoá theo từng bước, khi mỗi lệnh tự lấy rồi tự trả khoá và các khoảng hở ở giữa không được bảo vệ; dạng mô tả tệp sinh ra để một lần deploy nhiều bước giữ MỘT cái khoá suốt đời cái shell. Hai tính chất đáng mang theo trong cả hai dạng: khoá được giữ trên một MÔ TẢ TỆP nên nhân hệ điều hành tự thả nó khi tiến trình thoát — kể cả khi sập, bị giết, hay đứt phiên SSH, thứ mà một tệp khoá làm tay không cho bạn; và nó phải nằm trên chính MÁY ĐƯỢC DEPLOY TỚI (<code>/var/lock</code> hoặc <code>/run</code>, không bao giờ nằm trong thư mục bản phát hành mà bạn sắp thay), vì một cái khoá trên laptop của bạn chẳng biết gì về lần deploy đang chạy từ CI. Còn cái cờ mới chọn ngữ nghĩa: <code>-n</code> làm lần deploy thứ hai TỪ CHỐI và thoát khác 0, <code>-w 30</code> làm nó CHỜ — và chờ thường mới là thứ bạn muốn, vì thay đổi mới nhất nên thắng.',
          ),
        }),

        // q23 · đáp án D
        mcq({
          prompt: B(
            'A first attempt at benchmarking two transports, and the corrected version:' +
            code('════ LAN DAU ════\n' +
                 '  rsync    310 ms  1.497.754 byte\n' +
                 '  git push 293 ms        586 byte\n\n' +
                 '════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════\n' +
                 '  rsync (dich DA co) 295 ms  15.499 byte\n' +
                 '  git push           305 ms     565 byte') +
            'The corrected table is still not apples to apples. Which statement is the honest reading of it?',
            'Một lần đo thử đầu tiên giữa hai đường vận chuyển, và bản đã sửa lại:' +
            code('════ LAN DAU ════\n' +
                 '  rsync    310 ms  1.497.754 byte\n' +
                 '  git push 293 ms        586 byte\n\n' +
                 '════ CONG BANG: ca hai deu la lan thu HAI, chi doi mot dong ════\n' +
                 '  rsync (dich DA co) 295 ms  15.499 byte\n' +
                 '  git push           305 ms     565 byte') +
            'Bảng đã sửa vẫn chưa phải so táo với táo. Phát biểu nào là cách đọc thật thà nhất về nó?',
          ),
          options: [
            B(
              'The first table was simply noisy and the second one is correct: 27× more bytes is the true cost of rsync\'s file-level protocol against git\'s packfile deltas, and it is the number to quote when choosing between them',
              'Bảng đầu chỉ là nhiễu và bảng sau mới đúng: gấp 27 lần số byte chính là cái giá thật của giao thức mức-tệp của rsync so với delta packfile của git, và đó là con số nên trích khi phải chọn giữa hai bên',
            ),
            B(
              'Both tables are invalid because they were run on a local network: over a real link the byte counts dominate, so the correct conclusion is that git is roughly 27× cheaper per deploy at any project size',
              'Cả hai bảng đều vô giá trị vì chạy trên mạng nội bộ: qua một đường truyền thật thì số byte mới chi phối, nên kết luận đúng là git rẻ hơn khoảng 27 lần mỗi lần deploy ở mọi cỡ dự án',
            ),
            B(
              'The remaining flaw is that the second table measured a warm cache on one side only, so re-running it a third time would bring the two byte counts within a factor of two of each other',
              'Khiếm khuyết còn lại là bảng thứ hai đo một bên có bộ đệm ấm còn bên kia thì không, nên chạy lượt thứ ba nữa sẽ kéo hai con số byte về chênh nhau chưa tới hai lần',
            ),
            B(
              'The two sides are still shipping different artifacts — rsync is syncing 800 gitignored <code>node_modules</code> files that git is not — so the byte ratio is measuring the exclude list rather than the transport. What the table does establish is that both took about 300 ms, because the SSH handshake dominates at this size',
              'Hai bên vẫn đang gửi hai TẠO TÁC KHÁC NHAU — rsync đang đồng bộ 800 tệp <code>node_modules</code> bị gitignore mà git thì không — nên tỉ lệ byte đang đo CÁI DANH SÁCH LOẠI TRỪ chứ không đo đường vận chuyển. Thứ bảng này thật sự xác lập được là cả hai đều tốn khoảng 300 ms, vì cái bắt tay SSH mới chi phối ở cỡ này',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The first table was not noise, it was a category error: the rsync destination was empty, so it did a <em>first</em> sync, while git pushed a delta against a repository that already had the history. Two different operations, one table — and that is how people end up with strong opinions built on a bad benchmark. The corrected table fixes that and still has the exclude list baked in, which no benchmark of these two transports can avoid. What survives is the useful part: at this size neither transport speed nor byte count is a reason to choose anything, because the handshake is the whole cost (Question 2). So choose on the properties that actually differ — what can reach production, what the server needs installed, what it accumulates, and what a rollback needs.',
            'Bảng đầu không phải nhiễu, nó là một lỗi PHẠM TRÙ: thư mục đích của rsync đang rỗng nên nó làm một lượt đồng bộ ĐẦU TIÊN, trong khi git đẩy một delta so với một kho đã có sẵn lịch sử. Hai thao tác khác nhau, một cái bảng — và đó chính là cách người ta có những quan điểm rất mạnh dựng trên một phép đo tồi. Bảng đã sửa khắc phục chỗ đó và vẫn còn nướng sẵn cái danh sách loại trừ vào bên trong, thứ mà không phép đo nào giữa hai đường này tránh được. Cái còn sống sót mới là phần có ích: ở cỡ này thì cả tốc độ lẫn số byte đều không phải lý do để chọn cái gì, vì cái bắt tay mới là toàn bộ chi phí (câu 2). Vậy hãy chọn theo những tính chất THẬT SỰ khác nhau — cái gì có thể lên tới production, máy chủ cần cài sẵn cái gì, nó tích tụ lại cái gì, và một cú lùi bản cần tới cái gì.',
          ),
        }),

        /* ── Chương 3 — bước tráo (7 câu) ──────────────────────────────── */

        // q24 · đáp án C
        mcq({
          prompt: B(
            'A stop-then-start deploy, measured with a client sending requests continuously across it. The application takes 1.5 s to become ready:' +
            code('200: 346   loi ket noi: 168   ma khac: 0\n' +
                 'phan bo ban: {A: 120, B: 226}') +
            'A colleague proposes to fix this by making the application start faster. What does the transcript say about that plan?' +
            code('(doi chieu, cung kieu deploy, ung dung khoi dong TUC THI:\n' +
                 '   200 do duoc 199, hong 1, gian doan 0 ms)'),
            'Một lần deploy kiểu dừng-rồi-chạy-lại, đo bằng một máy khách bắn request liên tục xuyên suốt. Ứng dụng mất 1,5 giây để sẵn sàng:' +
            code('200: 346   loi ket noi: 168   ma khac: 0\n' +
                 'phan bo ban: {A: 120, B: 226}') +
            'Một đồng nghiệp đề xuất chữa bằng cách làm ứng dụng khởi động nhanh hơn. Đoạn terminal nói gì về kế hoạch ấy?' +
            code('(doi chieu, cung kieu deploy, ung dung khoi dong TUC THI:\n' +
                 '   200 do duoc 199, hong 1, gian doan 0 ms)'),
          ),
          options: [
            B(
              'It confirms the plan: the outage is exactly the start-up time, so halving one halves the other, and an application that boots in 50 ms drops a statistically negligible number of requests',
              'Nó xác nhận kế hoạch: khoảng gián đoạn đúng bằng thời gian khởi động, nên giảm một nửa cái này là giảm một nửa cái kia, và một ứng dụng khởi động trong 50 ms sẽ rơi một số request không đáng kể về mặt thống kê',
            ),
            B(
              'It refutes the plan, because the 168 failures are 5xx responses from a process that was up but not ready — a faster boot makes them arrive sooner rather than fewer, and only a readiness probe removes them',
              'Nó bác bỏ kế hoạch, vì 168 cú hỏng là các phản hồi 5xx từ một tiến trình đã lên mà chưa sẵn sàng — khởi động nhanh hơn chỉ làm chúng tới SỚM hơn chứ không ít đi, và chỉ một phép thăm dò sẵn sàng mới xoá được chúng',
            ),
            B(
              'It makes the plan an improvement rather than a fix: the fast-starting run still dropped a request, so the difference between one and 168 is only how long you were unlucky for. The window where nothing is listening has to be removed structurally, by starting the new version before stopping the old one',
              'Nó biến kế hoạch thành một CẢI THIỆN chứ không phải một cách CHỮA: lượt chạy khởi động tức thì vẫn rơi một request, nên khác biệt giữa 1 và 168 chỉ là bạn xui trong bao lâu. Cái cửa sổ mà KHÔNG AI đang lắng nghe phải được xoá bằng CẤU TRÚC, tức là khởi động bản mới trước khi dừng bản cũ',
            ),
            B(
              'It says nothing either way: the measurement has 50 ms resolution, so a single dropped request could represent anywhere from a moment to 100 ms, and 168 failures out of 514 is within the error bars of the fast-start run',
              'Nó chẳng nói gì về phía nào cả: phép đo có độ phân giải 50 ms, nên một request rơi có thể đại diện cho bất cứ khoảng nào từ một khoảnh khắc tới 100 ms, và 168 trên 514 vẫn nằm trong sai số của lượt khởi động nhanh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the third number in the transcript: <code>ma khac: 0</code>. Not a single request got a 5xx, because there was no server to produce one — these are connection errors, which in most client libraries are a different code path from an HTTP error, so a browser shows "this site can\'t be reached" and an API client raises rather than returning a status. That rules out option B. The comparison run is what settles the plan: the same deploy against an instantly-starting application still dropped one request. Faster start-up, a smaller bundle and lazy initialisation are all real improvements and none of them is a fix. The outage divides into three windows — in-flight requests abandoned at the kill, the gap where nothing is listening, and the period after the port is bound but before the app is ready — and they need three different fixes: graceful shutdown, start-before-stop, and a readiness check the proxy honours.',
            'Hãy đọc con số thứ ba trong đoạn terminal: <code>ma khac: 0</code>. Không một request nào nhận được 5xx, vì chẳng có máy chủ nào ở đó để sinh ra nó — đây là lỗi KẾT NỐI, thứ mà trong hầu hết thư viện máy khách là một nhánh mã KHÁC với lỗi HTTP, nên trình duyệt hiện "không truy cập được trang này" còn một API client thì NÉM lỗi chứ không trả về một mã trạng thái. Điều đó loại phương án B. Lượt đo đối chiếu mới là thứ phân xử kế hoạch: cùng lần deploy ấy trên một ứng dụng khởi động tức thì VẪN rơi một request. Khởi động nhanh hơn, gói nhỏ hơn, khởi tạo lười — đều là những cải thiện có thật, và không cái nào là cách CHỮA. Khoảng gián đoạn chia thành ba cửa sổ — request đang bay bị bỏ rơi lúc bị giết, cái khe không ai lắng nghe, và quãng sau khi cổng đã mở mà ứng dụng chưa sẵn sàng — và chúng cần ba cách chữa khác nhau: tắt tử tế, khởi-động-trước-rồi-mới-dừng, và một phép kiểm sẵn sàng mà proxy tôn trọng.',
          ),
        }),

        // q25 · đáp án A
        mcq({
          prompt: B(
            'A graceful shutdown is implemented correctly: <code>server.close()</code> on SIGTERM, in-flight requests answered unchanged, <code>Connection: close</code> added to the responses. In production, <code>docker stop</code> still takes the full grace period every single time, and then the container exits 137. The application log ends with <code>dang cho request xong</code> and nothing else. What is the most likely cause?',
            'Một cú tắt tử tế được cài đặt đúng: gọi <code>server.close()</code> khi nhận SIGTERM, các request đang bay được trả lời nguyên vẹn, thêm <code>Connection: close</code> vào phản hồi. Trên production, <code>docker stop</code> vẫn tốn trọn thời gian ân hạn ở MỌI lần, rồi container thoát 137. Log ứng dụng kết thúc ở dòng <code>dang cho request xong</code> và không có gì nữa. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'An idle keepalive connection is holding the server open: <code>server.close()</code> waits for existing connections to close, and a keepalive connection with nothing on it is open with no request to finish, so the runtime sits there until the deadline fires',
              'Một kết nối keepalive đang RỖI giữ máy chủ mở: <code>server.close()</code> chờ các kết nối hiện có đóng lại, mà một kết nối keepalive không có gì trên đó thì vẫn đang mở và chẳng có request nào để làm nốt, nên runtime cứ ngồi đấy tới khi hạn giờ nổ',
            ),
            B(
              'SIGTERM is not reaching the process at all, because PID 1 in a container ignores signals with a default action unless it installs a handler — so the handler never ran and the log line was written by the previous request',
              'SIGTERM không hề tới được tiến trình, vì PID 1 trong container bỏ qua các tín hiệu có hành động mặc định trừ khi nó tự cài trình xử lý — nên trình xử lý chưa từng chạy và dòng log kia là do request trước ghi ra',
            ),
            B(
              '<code>Connection: close</code> is the bug: it tells the client to close, and a client that has already sent a pipelined request will retry it on a new connection, so the server keeps accepting work for as long as clients keep retrying',
              '<code>Connection: close</code> chính là con bọ: nó bảo máy khách đóng, mà một máy khách đã gửi sẵn một request theo lối ống dẫn sẽ thử lại nó trên một kết nối mới, nên máy chủ cứ tiếp tục nhận việc chừng nào máy khách còn thử lại',
            ),
            B(
              'The grace period is being applied twice — once by <code>docker stop</code> and once by the runtime\'s own deadline — so the observed time is the sum, and setting <code>stop_grace_period</code> to half the application deadline restores the expected behaviour',
              'Thời gian ân hạn bị áp HAI lần — một lần bởi <code>docker stop</code> và một lần bởi hạn giờ của chính runtime — nên thời gian quan sát được là tổng của hai, và đặt <code>stop_grace_period</code> bằng một nửa hạn giờ của ứng dụng sẽ khôi phục hành vi mong đợi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the failure mode that survives a correct implementation, which is why it is worth recognising by its signature: the handler <em>did</em> run (the log line proves it), everything already accepted was served, and the process still would not exit. <code>server.close()</code> waits for connections rather than for requests, and an idle keepalive connection is a connection. <code>server.closeIdleConnections()</code> exists for exactly this, and <code>Connection: close</code> on the responses is the polite half of the same fix — it stops a client with a keepalive connection sending another request down it. Option B is a real and common failure and it is ruled out by the log line: a process that never received the signal cannot have written it. Two numbers to set deliberately alongside this: <code>docker stop</code> kills after 10 seconds by default, so a 30-second shutdown deadline inside a container is silently a 10-second one unless you pass <code>--time</code> or set <code>stop_grace_period</code>; and under systemd, <code>TimeoutStopSec</code> should be slightly more than your own deadline so your code decides what gets abandoned.',
            'Đây là kiểu hỏng SỐNG SÓT qua một cài đặt đúng, và vì thế đáng nhận diện qua chữ ký của nó: trình xử lý ĐÃ chạy (dòng log là bằng chứng), mọi thứ đã nhận đều được phục vụ xong, mà tiến trình vẫn không chịu thoát. <code>server.close()</code> chờ các KẾT NỐI chứ không chờ các REQUEST, mà một kết nối keepalive đang rỗi thì vẫn là một kết nối. <code>server.closeIdleConnections()</code> sinh ra đúng cho việc này, còn <code>Connection: close</code> trên các phản hồi là nửa lịch sự của cùng cách chữa — nó bảo một máy khách đang giữ kết nối keepalive đừng gửi thêm request xuống đó nữa. Phương án B là một cú hỏng có thật và rất phổ biến, và nó bị loại bởi chính dòng log: một tiến trình chưa hề nhận tín hiệu thì không thể đã viết ra nó. Hai con số nên đặt có chủ đích đi kèm: <code>docker stop</code> mặc định giết sau 10 giây, nên một hạn tắt 30 giây bên trong container âm thầm chỉ còn 10 giây trừ khi bạn truyền <code>--time</code> hoặc đặt <code>stop_grace_period</code>; còn dưới systemd thì <code>TimeoutStopSec</code> nên nhỉnh hơn hạn của chính bạn một chút, để MÃ CỦA BẠN quyết định thứ gì bị bỏ dở.',
          ),
        }),

        // q26 · đáp án D
        mcq({
          prompt: B(
            'A tidier-looking blue-green: have both processes bind the same port with <code>SO_REUSEPORT</code>, so no proxy is needed. Measured on the course\'s server, Node v20.20.2, with <code>reusePort: true</code> passed to <code>listen()</code>:' +
            code('[A] da gan cong 3198\n' +
                 '[B] HONG: EADDRINUSE\n' +
                 '--- so socket dang nghe cong 3198 --- 1\n' +
                 '--- 20 request, phan bo vao hai tien trinh --- 20 A') +
            'What is the transferable lesson, given that the option later landed properly in newer Node releases?',
            'Một kiểu xanh-lam trông gọn hơn: cho cả hai tiến trình cùng gắn một cổng bằng <code>SO_REUSEPORT</code>, khỏi cần proxy. Đo trên máy chủ của giáo trình, Node v20.20.2, với <code>reusePort: true</code> truyền vào <code>listen()</code>:' +
            code('[A] da gan cong 3198\n' +
                 '[B] HONG: EADDRINUSE\n' +
                 '--- so socket dang nghe cong 3198 --- 1\n' +
                 '--- 20 request, phan bo vao hai tien trinh --- 20 A') +
            'Bài học mang đi được là gì, biết rằng tuỳ chọn ấy về sau đã hoạt động đúng trên các bản Node mới hơn?',
          ),
          options: [
            B(
              'That <code>SO_REUSEPORT</code> is unsuitable for deploys in principle: the kernel hashes connections to sockets, so during the overlap half the traffic goes to the old version, which is a correctness problem no runtime version can fix',
              'Rằng <code>SO_REUSEPORT</code> về nguyên tắc không hợp cho deploy: nhân băm các kết nối vào các socket, nên trong lúc chồng lấn thì một nửa lưu lượng đi vào bản CŨ, và đó là vấn đề tính đúng đắn mà không phiên bản runtime nào chữa nổi',
            ),
            B(
              'That the measurement was invalid because both processes ran as the same user: <code>SO_REUSEPORT</code> requires matching effective UIDs, and the second bind failed for that reason rather than because of the runtime version',
              'Rằng phép đo vô giá trị vì hai tiến trình chạy dưới cùng một người dùng: <code>SO_REUSEPORT</code> đòi UID hiệu dụng phải khớp, và cú gắn thứ hai hỏng vì lý do đó chứ không phải vì phiên bản runtime',
            ),
            B(
              'That the proxy approach is obsolete once the runtime supports the option, so the correct action is to pin a newer Node in the base image and delete the upstream configuration from the deploy script',
              'Rằng cách dùng proxy đã lỗi thời một khi runtime hỗ trợ tuỳ chọn ấy, nên hành động đúng là ghim một bản Node mới hơn trong ảnh nền rồi xoá phần cấu hình upstream khỏi script deploy',
            ),
            B(
              'That an option accepted without complaint and then silently ignored is worse than one that errors — and that a deploy strategy depending on a runtime feature you have not verified <em>on your runtime</em> is a strategy that fails on the first real deploy. The proxy has no such dependency: it works on every runtime and every language',
              'Rằng một tuỳ chọn được NHẬN mà không kêu ca rồi âm thầm bị phớt lờ còn tệ hơn một tuỳ chọn báo lỗi — và rằng một chiến lược deploy phụ thuộc vào một tính năng runtime mà bạn CHƯA kiểm chứng TRÊN CHÍNH RUNTIME CỦA MÌNH là một chiến lược sẽ hỏng ngay ở lần deploy thật đầu tiên. Cách dùng proxy không có phụ thuộc ấy: nó chạy trên mọi runtime, mọi ngôn ngữ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two facts in the transcript settle it: one listening socket, and all twenty requests answered by A. The option was accepted and did nothing. This is the same shape as the systemd directive in the wrong section (Question 27) and the readiness check written with a tool that is not installed — three separate places in this course where something was accepted without complaint and quietly had no effect. Option A misstates the mechanism (<code>SO_REUSEPORT</code> is a genuine kernel feature and load-balances across sockets by design; sharing traffic between two versions during the overlap is exactly what blue-green does too, one layer out). Option C is the tempting over-correction: the proxy is not obsolete, because the thing that has to support it is a reverse proxy you already have for TLS anyway, and that is worth more than a runtime feature whose behaviour changes between minor versions.',
            'Hai sự kiện trong đoạn terminal đủ phân xử: MỘT socket đang nghe, và cả hai mươi request đều do A trả lời. Tuỳ chọn được nhận và chẳng làm gì. Đây cùng một hình dạng với cái chỉ thị systemd đặt sai mục (câu 27) và cái phép kiểm sẵn sàng viết bằng một công cụ không có trên máy — ba chỗ riêng biệt trong khoá này, nơi một thứ được nhận mà không kêu ca rồi lặng lẽ chẳng có tác dụng gì. Phương án A nói sai cơ chế (<code>SO_REUSEPORT</code> là một tính năng nhân có thật và VỐN được thiết kế để chia tải giữa các socket; chia lưu lượng cho hai phiên bản trong lúc chồng lấn cũng chính là điều xanh-lam làm, chỉ ở một tầng ngoài hơn). Phương án C là kiểu sửa quá tay đầy cám dỗ: proxy không hề lỗi thời, vì thứ cần hỗ trợ nó là một reverse proxy mà bạn đằng nào cũng đã có sẵn để làm TLS, và điều đó đáng giá hơn một tính năng runtime có hành vi đổi giữa các bản phụ.',
          ),
        }),

        // q27 · đáp án B
        mcq({
          prompt: B(
            'A systemd unit is written with <code>StartLimitBurst</code> and <code>StartLimitIntervalSec</code> in the <code>[Service]</code> section — which reads naturally, since they are about restarting a service. Then:' +
            code('$ systemd-analyze verify /tmp/app.service\n' +
                 "  app.service:15: Unknown key name 'StartLimitIntervalSec' in\n" +
                 "                  section 'Service', ignoring.\n" +
                 '  app.service: Command /usr/bin/node is not executable:\n' +
                 '               No such file or directory') +
            'Which of these two findings is the dangerous one, and what does it produce?',
            'Một unit systemd được viết với <code>StartLimitBurst</code> và <code>StartLimitIntervalSec</code> nằm trong mục <code>[Service]</code> — đọc lên thấy rất tự nhiên, vì chúng nói về việc khởi động lại một dịch vụ. Rồi:' +
            code('$ systemd-analyze verify /tmp/app.service\n' +
                 "  app.service:15: Unknown key name 'StartLimitIntervalSec' in\n" +
                 "                  section 'Service', ignoring.\n" +
                 '  app.service: Command /usr/bin/node is not executable:\n' +
                 '               No such file or directory') +
            'Trong hai phát hiện ấy, cái nào mới NGUY HIỂM, và nó đẻ ra cái gì?',
          ),
          options: [
            B(
              'The wrong path, because a unit that cannot start is an outage from the first boot; the misplaced key is harmless since systemd falls back to the documented defaults for any directive it cannot parse',
              'Đường dẫn sai, vì một unit không khởi động nổi là một sự cố ngay từ lần khởi động đầu; còn cái khoá đặt nhầm chỗ thì vô hại vì systemd quay về giá trị mặc định có ghi trong tài liệu cho mọi chỉ thị nó không phân tích được',
            ),
            B(
              'The misplaced key, because a directive in the wrong section is IGNORED rather than rejected: systemd loads the unit, starts the service, and simply does not apply the setting — so a crash-looping service restarts forever instead of giving up, generating thousands of log lines that bury the original error',
              'Cái khoá đặt nhầm mục, vì một chỉ thị nằm sai mục thì bị PHỚT LỜ chứ không bị TỪ CHỐI: systemd nạp unit, khởi động dịch vụ, và đơn giản là không áp thiết lập ấy — nên một dịch vụ đang lặp-sập cứ khởi động lại mãi thay vì bỏ cuộc, sinh ra hàng nghìn dòng log chôn vùi lỗi gốc',
            ),
            B(
              'Neither is dangerous, because <code>systemd-analyze verify</code> refuses to let the unit be enabled while any diagnostic is outstanding; both problems are caught before the service ever runs',
              'Chẳng cái nào nguy hiểm cả, vì <code>systemd-analyze verify</code> từ chối cho bật unit chừng nào còn một chẩn đoán chưa xử lý; cả hai vấn đề đều bị bắt trước khi dịch vụ kịp chạy',
            ),
            B(
              'Both equally, and for the same reason: systemd validates a unit only at <code>daemon-reload</code>, so either problem surfaces as a generic "Failed to start" with no detail, and the validator is the only way to see which of the two it was',
              'Cả hai như nhau, và vì cùng một lý do: systemd chỉ kiểm hợp lệ một unit lúc <code>daemon-reload</code>, nên vấn đề nào cũng hiện ra dưới dạng một dòng "Failed to start" chung chung không chi tiết, và bộ kiểm là cách duy nhất thấy được nó là cái nào trong hai',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The wrong path is prosaic and loud: the service fails at start with a message people routinely misread as "node is not installed" (<code>ExecStart</code> requires an absolute path — there is no <code>PATH</code> lookup). The misplaced key is the expensive one because nothing about a running service tells you the line was ignored. The rate limiting you thought you had configured is simply absent, so a service in a crash loop restarts every two seconds forever — exactly the state where a broken deploy generates thousands of log lines and hides the original error. Chapter 8 has the same shape from the other side: <code>Restart=always</code> plus an OOM turns a spike into a loop, where every restart drops connections and rebuilds caches, so each cycle is more expensive than the last. Run <code>systemd-analyze verify</code> on every unit before enabling it — it is the <code>nginx -t</code> of service files, and like <code>nginx -t</code> it proves the file loads and not that the service works.',
            'Đường dẫn sai thì tầm thường và ỒN ÀO: dịch vụ hỏng ngay lúc khởi động với một thông báo mà người ta thường xuyên đọc nhầm thành "chưa cài node" (<code>ExecStart</code> đòi đường dẫn TUYỆT ĐỐI — không hề có bước tra <code>PATH</code>). Cái khoá đặt nhầm mục mới là cái đắt tiền, vì không có gì ở một dịch vụ đang chạy nói cho bạn biết dòng ấy đã bị bỏ qua. Cái van giới hạn nhịp mà bạn tưởng đã cấu hình thì đơn giản là KHÔNG CÓ, nên một dịch vụ đang lặp-sập sẽ khởi động lại mỗi hai giây, mãi mãi — đúng cái trạng thái mà một lần deploy hỏng sinh ra hàng nghìn dòng log và chôn mất lỗi gốc. Chương 8 có cùng hình dạng ấy nhìn từ phía kia: <code>Restart=always</code> cộng với một cú OOM biến một đợt tăng vọt thành một vòng lặp, mà mỗi lần khởi động lại là rớt kết nối và dựng lại bộ đệm, nên mỗi vòng lại đắt hơn vòng trước. Hãy chạy <code>systemd-analyze verify</code> trên MỌI unit trước khi bật nó — nó là <code>nginx -t</code> của các tệp dịch vụ, và giống <code>nginx -t</code>, nó chứng minh tệp NẠP ĐƯỢC chứ không chứng minh dịch vụ CHẠY ĐƯỢC.',
          ),
        }),

        // q28 · đáp án C
        mcq({
          prompt: B(
            'An application is started with <code>setsid nohup node app.mjs &amp;</code>. Measured across an unhandled exception:' +
            code('truoc khi sap : ma=200 socket=1\n' +
                 'sau khi sap   : ma=000 socket=0\n' +
                 '5 giay sau    : ma=000 socket=0') +
            'It is replaced with a systemd unit. Which line in that unit is the one people most often get wrong, and what does the wrong choice cost?',
            'Một ứng dụng được khởi động bằng <code>setsid nohup node app.mjs &amp;</code>. Đo xuyên qua một ngoại lệ không bắt:' +
            code('truoc khi sap : ma=200 socket=1\n' +
                 'sau khi sap   : ma=000 socket=0\n' +
                 '5 giay sau    : ma=000 socket=0') +
            'Nó được thay bằng một unit systemd. Dòng nào trong unit ấy là dòng người ta hay đặt sai nhất, và lựa chọn sai ấy tốn cái gì?',
          ),
          options: [
            B(
              '<code>Type=</code> — choosing <code>simple</code> instead of <code>exec</code> makes systemd report the service as started before the binary has been executed, so a unit with a wrong <code>ExecStart</code> path is reported as active and the crash is attributed to the application',
              '<code>Type=</code> — chọn <code>simple</code> thay vì <code>exec</code> làm systemd báo dịch vụ đã khởi động TRƯỚC khi tệp nhị phân được thực thi, nên một unit có <code>ExecStart</code> sai đường dẫn vẫn được báo là active và cú sập bị quy cho ứng dụng',
            ),
            B(
              '<code>StandardOutput=journal</code> — sending logs to the journal without setting <code>SystemMaxUse=</code> is what fills the disk, which is the failure Chapter 8 measures; writing to a file with <code>logrotate</code> is the safer default',
              '<code>StandardOutput=journal</code> — đẩy log vào journal mà không đặt <code>SystemMaxUse=</code> chính là thứ làm đầy đĩa, đúng cú hỏng mà Chương 8 đo; ghi ra tệp rồi dùng <code>logrotate</code> mới là mặc định an toàn hơn',
            ),
            B(
              '<code>Restart=</code> — <code>always</code> restarts even after a deliberate <code>systemctl stop</code>, which turns a maintenance window into a fight with the service manager; <code>on-failure</code> restarts on a crash or a non-zero exit and leaves a clean exit alone',
              '<code>Restart=</code> — đặt <code>always</code> thì nó khởi động lại kể cả sau một lệnh <code>systemctl stop</code> có chủ đích, biến một cửa sổ bảo trì thành một trận vật lộn với trình quản lý dịch vụ; <code>on-failure</code> chỉ khởi động lại khi sập hoặc thoát khác 0, còn thoát sạch thì để yên',
            ),
            B(
              '<code>WorkingDirectory=</code> — pointing it at the release symlink means a restart picks up whichever release the link currently names, so a rollback that moved the link is undone the next time the service restarts for an unrelated reason',
              '<code>WorkingDirectory=</code> — chĩa nó vào cái symlink bản phát hành nghĩa là mỗi lần khởi động lại sẽ lấy bản mà liên kết ĐANG trỏ tới, nên một cú lùi bản đã dời liên kết sẽ bị huỷ ở lần dịch vụ khởi động lại kế tiếp vì một lý do không liên quan',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>nohup</code> detaches a process from a terminal and has no opinion about whether it should be running: one unhandled exception and the port stayed closed indefinitely. The same applies to a reboot, which is the more common case — machines restart for kernel updates, hosts migrate, and out-of-memory kills happen. In the replacement unit, <code>Restart=on-failure</code> is the choice that matters, because <code>always</code> makes <code>systemctl stop</code> a suggestion. Option D inverts the design: pointing <code>WorkingDirectory</code> at <code>hien-tai</code> is <em>correct</em> and deliberate — it makes the swap and the service manager the same mechanism rather than two competing ones, and a restart after a rollback picks up the release the link names, which is the release you rolled back to. One line worth adding to a dashboard: <code>systemctl show app -p NRestarts</code>. A service that is up but has restarted forty times today is a service in trouble, and every other check reports it as healthy between crashes.',
            '<code>nohup</code> tách một tiến trình khỏi terminal và chẳng có ý kiến gì về việc nó CÓ NÊN đang chạy hay không: một ngoại lệ không bắt là cái cổng đóng vô thời hạn. Chuyện tương tự với việc khởi động lại máy, mà đó mới là ca phổ biến hơn — máy khởi động lại để vá nhân, máy chủ vật lý được di dời, và những cú giết vì hết bộ nhớ vẫn xảy ra. Trong cái unit thay thế, <code>Restart=on-failure</code> mới là lựa chọn có trọng lượng, vì <code>always</code> biến <code>systemctl stop</code> thành một lời ĐỀ NGHỊ. Phương án D lộn ngược thiết kế: chĩa <code>WorkingDirectory</code> vào <code>hien-tai</code> là ĐÚNG và có chủ đích — nó làm cho bước tráo và trình quản lý dịch vụ trở thành CÙNG một cơ chế thay vì hai cơ chế cạnh tranh, và một lần khởi động lại sau khi lùi bản sẽ lấy đúng bản mà liên kết đang gọi tên, tức là bản bạn vừa lùi về. Một dòng đáng đưa lên bảng điều khiển: <code>systemctl show app -p NRestarts</code>. Một dịch vụ đang "lên" mà hôm nay đã khởi động lại bốn mươi lần là một dịch vụ đang có vấn đề, và mọi phép kiểm khác đều báo nó khoẻ trong những quãng giữa hai lần sập.',
          ),
        }),

        // q29 · đáp án A
        mcq({
          prompt: B(
            'A swap script takes a lock, then starts the application in the background. It deploys once, correctly — and every later deploy prints <code>co lan trao khac dang chay</code> while no deploy is running. Measured:' +
            code('-- ban KHONG dong fd 9 --\n' +
                 '  lan 1 ma thoat=0\n' +
                 '  lan 2 ma thoat=1  (co lan trao khac dang chay)\n' +
                 '  lsof /var/lock/trao.lock → sleep 4862 9w\n' +
                 '  /proc/4862/fd → 1 mo ta tro toi trao.lock\n\n' +
                 '-- ban CO 9>&- tren lenh chay nen --\n' +
                 '  lan 1 ma thoat=0\n' +
                 '  lan 2 ma thoat=0') +
            'What is the general form of this bug?',
            'Một script tráo lấy khoá, rồi khởi động ứng dụng ở chế độ nền. Nó deploy được đúng một lần — và mọi lần deploy sau đều in <code>co lan trao khac dang chay</code> trong khi chẳng có lần deploy nào đang chạy. Đo được:' +
            code('-- ban KHONG dong fd 9 --\n' +
                 '  lan 1 ma thoat=0\n' +
                 '  lan 2 ma thoat=1  (co lan trao khac dang chay)\n' +
                 '  lsof /var/lock/trao.lock → sleep 4862 9w\n' +
                 '  /proc/4862/fd → 1 mo ta tro toi trao.lock\n\n' +
                 '-- ban CO 9>&- tren lenh chay nen --\n' +
                 '  lan 1 ma thoat=0\n' +
                 '  lan 2 ma thoat=0') +
            'Dạng tổng quát của con bọ này là gì?',
          ),
          options: [
            B(
              'Anything a script opens, its children inherit — lock descriptors, log files, sockets, the SSH connection itself — so a long-lived process started from inside a locked section holds that lock for its entire life, and the script has locked itself out permanently',
              'Bất cứ thứ gì một script MỞ RA thì con của nó THỪA KẾ — mô tả khoá, tệp log, socket, và cả chính kết nối SSH — nên một tiến trình sống lâu được khởi động từ bên trong vùng đã khoá sẽ giữ cái khoá ấy suốt đời nó, và script đã tự nhốt mình ra ngoài, vĩnh viễn',
            ),
            B(
              '<code>flock</code> on a file in <code>/var/lock</code> is advisory only, so the second run is not actually blocked — it is misreading a stale lock file left behind by the first run, and the fix is to <code>rm</code> the file on exit rather than to close a descriptor',
              '<code>flock</code> trên một tệp trong <code>/var/lock</code> chỉ mang tính khuyến nghị, nên lượt thứ hai thật ra không bị chặn — nó đang đọc nhầm một tệp khoá cũ do lượt đầu để lại, và cách chữa là <code>rm</code> tệp ấy lúc thoát chứ không phải đóng một mô tả tệp',
            ),
            B(
              'The lock was taken on a file descriptor rather than on a path, so a second script opening the same path gets a different descriptor and a different lock; <code>flock</code> must be given the pathname form to be shared between processes',
              'Khoá được lấy trên một MÔ TẢ TỆP chứ không phải trên một ĐƯỜNG DẪN, nên một script thứ hai mở cùng đường dẫn sẽ nhận một mô tả khác và một khoá khác; phải đưa cho <code>flock</code> dạng theo tên đường dẫn thì mới chia sẻ được giữa các tiến trình',
            ),
            B(
              '<code>setsid</code> is the culprit: it puts the child in a new session, and a lock held by a process in a different session is never released to the original one, which is why closing the descriptor happens to work as a side effect',
              '<code>setsid</code> mới là thủ phạm: nó đặt tiến trình con vào một phiên MỚI, mà một khoá do tiến trình ở phiên khác giữ thì không bao giờ được trả về cho phiên gốc, và đó là lý do việc đóng mô tả tệp tình cờ có tác dụng như một hệ quả phụ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, and the diagnosis came from <code>/proc/&lt;pid&gt;/fd</code> rather than from reading the script: the application — the last process on earth that should be holding your deploy lock — was holding <code>fd 9</code> and therefore the lock, for as long as it lived. <code>exec 9&gt;file</code> opens descriptor 9 in the shell; every child inherits it. The script exits and releases its own copy, and <code>flock</code> still considers the lock held. The fix is four characters, <code>9&gt;&amp;-</code>, which closes descriptor 9 in the child only. Carry the general form: when a long-lived process is started from a script, close everything it does not need. Lesson 0.3 has the same mechanism wearing different clothes — an inherited output stream making <code>ssh</code> hang forever (Question 3) — and <code>lsof -p &lt;pid&gt;</code> or <code>ls -l /proc/&lt;pid&gt;/fd</code> shows what a process actually holds.',
            'Đã đo, và chẩn đoán đến từ <code>/proc/&lt;pid&gt;/fd</code> chứ không phải từ việc ĐỌC script: ứng dụng — tiến trình cuối cùng trên đời đáng lẽ được phép giữ cái khoá deploy của bạn — đang giữ <code>fd 9</code> và do đó giữ luôn cái khoá, suốt thời gian nó sống. <code>exec 9&gt;file</code> mở mô tả 9 trong shell; MỌI tiến trình con đều thừa kế nó. Script thoát và trả lại bản sao của chính nó, mà <code>flock</code> vẫn coi là khoá đang bị giữ. Cách chữa là bốn ký tự, <code>9&gt;&amp;-</code>, đóng mô tả 9 chỉ trong tiến trình con. Hãy mang theo dạng tổng quát: khi một tiến trình sống lâu được khởi động từ một script, hãy đóng mọi thứ nó không cần. Bài 0.3 có đúng cơ chế ấy mặc bộ đồ khác — một luồng RA thừa kế làm <code>ssh</code> treo mãi (câu 3) — và <code>lsof -p &lt;pid&gt;</code> hay <code>ls -l /proc/&lt;pid&gt;/fd</code> cho thấy một tiến trình THẬT SỰ đang giữ những gì.',
          ),
        }),

        // q30 · đáp án D
        mcq({
          prompt: B(
            'Step 4 of the complete swap script verifies the deploy. Two candidate lines:' +
            code('A)  curl -s -o /dev/null -w %{http_code} http://127.0.0.1:3102/health\n' +
                 'B)  curl -s -o /dev/null -w %{http_code} http://127.0.0.1/health') +
            'The application is on 3102 and nginx is on port 80. Which line belongs in the script, and what does the other one fail to see?',
            'Bước 4 của script tráo hoàn chỉnh làm nhiệm vụ kiểm chứng lần deploy. Hai dòng ứng cử:' +
            code('A)  curl -s -o /dev/null -w %{http_code} http://127.0.0.1:3102/health\n' +
                 'B)  curl -s -o /dev/null -w %{http_code} http://127.0.0.1/health') +
            'Ứng dụng nằm ở cổng 3102 còn nginx ở cổng 80. Dòng nào thuộc về script, và dòng kia không nhìn thấy được cái gì?',
          ),
          options: [
            B(
              'A, because checking through the proxy measures the proxy rather than the deploy, and a 502 from nginx would abort a deploy whose application is perfectly healthy — the backend port is the only address that isolates the thing you just changed',
              'A, vì kiểm qua proxy là đang đo PROXY chứ không đo lần deploy, và một cú 502 từ nginx sẽ huỷ một lần deploy mà ứng dụng hoàn toàn khoẻ mạnh — cổng backend là địa chỉ duy nhất cô lập được đúng thứ bạn vừa đổi',
            ),
            B(
              'Both, in that order: A confirms the new release is up before the switch, and B confirms the switch afterwards, so a script that runs only one of them can never distinguish a bad release from a bad reload',
              'Cả hai, theo đúng thứ tự ấy: A xác nhận bản mới đã lên TRƯỚC khi chuyển, còn B xác nhận cú chuyển SAU đó, nên một script chỉ chạy một trong hai thì không bao giờ phân biệt nổi một bản phát hành hỏng với một lần reload hỏng',
            ),
            B(
              'A, because B goes through a cache: nginx may answer <code>/health</code> from <code>proxy_cache</code> and report the previous release as healthy, which is the exact failure Chapter 6 measures — so the backend port is the only trustworthy address',
              'A, vì B đi qua một bộ đệm: nginx có thể trả lời <code>/health</code> từ <code>proxy_cache</code> và báo bản TRƯỚC là khoẻ, đúng cú hỏng mà Chương 6 đo — nên cổng backend mới là địa chỉ duy nhất đáng tin',
            ),
            B(
              'B — it goes through the front door, so it catches a proxy that reloaded into a broken state, an upstream pointing at the wrong port, or a config the swap wrote incorrectly. A backend check cannot see any of those: the application is fine and the users are not',
              'B — nó đi qua CỬA TRƯỚC, nên nó bắt được một con proxy nạp lại vào một trạng thái hỏng, một upstream trỏ nhầm cổng, hay một cấu hình mà bước tráo ghi sai. Một phép kiểm ở backend không nhìn thấy cái nào trong số đó: ứng dụng thì ổn còn người dùng thì không',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both checks exist in the complete script and they answer different questions — but only one of them belongs at step 4. The readiness poll before the switch <em>must</em> hit the backend port, because at that moment the proxy is still pointing at the old release; the verification after the switch <em>must</em> go through the front door, because that is the first moment anything can be wrong with the switch itself. Option B is the closest wrong answer and it inverts the order it describes. Chapter 9 measures the failure that makes this concrete: an application answering 200 on every route, behind an nginx whose <code>location /health</code> was correct and whose <code>location /</code> pointed at a port nobody was listening on — the health check green, through the real proxy, on the real port, while the homepage returned 502. And option C names a real hazard from the other direction: a front-door check on a cached path can report the previous version as healthy, which is why the final check should compare the <em>version served</em> rather than the status code.',
            'Cả hai phép kiểm đều có mặt trong script hoàn chỉnh và chúng trả lời hai câu hỏi khác nhau — nhưng chỉ một cái thuộc về BƯỚC 4. Vòng chờ sẵn sàng TRƯỚC khi chuyển thì BẮT BUỘC phải gọi vào cổng backend, vì lúc ấy proxy vẫn còn trỏ vào bản cũ; còn phép kiểm chứng SAU khi chuyển thì BẮT BUỘC phải đi qua cửa trước, vì đó mới là khoảnh khắc đầu tiên mà bản thân cú chuyển có thể sai. Phương án B là đáp án sai gần đúng nhất, và nó ĐẢO NGƯỢC chính cái thứ tự mà nó mô tả. Chương 9 đo ra cú hỏng làm chuyện này thành cụ thể: một ứng dụng trả 200 trên mọi tuyến, đứng sau một nginx có <code>location /health</code> đúng và <code>location /</code> trỏ vào một cổng chẳng ai lắng nghe — chốt kiểm sức khoẻ XANH, qua đúng con proxy thật, trên đúng cổng thật, trong khi trang chủ trả 502. Còn phương án C gọi tên một mối nguy có thật theo chiều ngược lại: một phép kiểm ở cửa trước trên một đường có cache có thể báo bản TRƯỚC là khoẻ, và chính vì thế phép kiểm cuối cùng phải so PHIÊN BẢN ĐANG ĐƯỢC PHỤC VỤ chứ không so mã trạng thái.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Work out what an <code>rsync --delete</code> would leave behind, without running rsync (chapters 1 and 2).</b> Implement <code>dong_bo</code>: it takes one flag string and prints the <b>final list of files at the destination</b>, sorted by byte order, separated by single spaces, on one line.</p>' +
            '<p>The source and the destination are the two given arrays. Note that they overlap in nothing — every destination file is a file the source is not sending — which is the situation a deploy is always in for uploads, logs and installed dependencies.</p>' +
            '<p>Four rules decide this question, and each of the seven flag strings is there to test one of them.</p>' +
            '<ul>' +
            '<li><b>Copying.</b> Every source path that is not excluded ends up at the destination. Nothing else about the transfer matters here — no timestamps, no checksums, no delta algorithm.</li>' +
            '<li><b>What "excluded" means.</b> A path is excluded when its <b>first path segment</b> equals one of the patterns, or when the <b>whole path</b> equals one. So <code>--exclude node_modules</code> covers <code>node_modules/x.js</code>, and <code>--exclude roi-rac.txt</code> covers exactly that file. No wildcards.</li>' +
            '<li><b>Without <code>--delete</code>.</b> Anything already at the destination stays, whatever the source contains.</li>' +
            '<li><b>With <code>--delete</code>.</b> Destination files the source did not send are removed — <b>except</b> the ones matching an exclude pattern, which the pattern protects. <code>--delete-excluded</code> revokes that protection and removes them too; on its own, without <code>--delete</code>, it does nothing.</li>' +
            '</ul>' +
            '<p>Print the paths sorted by <b>byte</b> order (<code>LC_ALL=C</code>), so the answer is identical on every machine. An empty result prints an empty line.</p>' +
            '<p>Keep the three given arrays and the printing loop exactly as they are. Pure shell only, and <b>do not touch the real filesystem</b>: no <code>rsync</code>, no <code>find</code>, no <code>mkdir</code>, no <code>touch</code>.</p>',

            '<p><b>Câu 31 — Tính ra một lệnh <code>rsync --delete</code> sẽ để lại những gì, mà không chạy rsync (chương 1 và 2).</b> Cài đặt <code>dong_bo</code>: nhận một chuỗi cờ và in ra <b>danh sách tệp CUỐI CÙNG ở đích</b>, sắp theo thứ tự byte, ngăn nhau bằng một dấu cách, trên một dòng.</p>' +
            '<p>Nguồn và đích là hai mảng cho sẵn. Để ý rằng chúng KHÔNG trùng nhau tệp nào — mọi tệp ở đích đều là tệp mà nguồn không gửi tới — đúng cái tình huống mà một lần deploy luôn rơi vào với tệp người dùng tải lên, với log, và với thư viện đã cài.</p>' +
            '<p>Bốn quy tắc quyết định câu này, và mỗi chuỗi cờ trong bảy chuỗi đều có mặt để thử một quy tắc.</p>' +
            '<ul>' +
            '<li><b>Phép chép.</b> Mọi đường dẫn ở nguồn mà không bị loại trừ đều có mặt ở đích. Không thứ gì khác về lượt truyền quan trọng ở đây — không dấu thời gian, không tổng kiểm, không thuật toán chênh lệch.</li>' +
            '<li><b>"Bị loại trừ" nghĩa là gì.</b> Một đường dẫn bị loại trừ khi <b>đoạn đầu tiên</b> của nó trùng một mẫu, hoặc khi <b>cả đường dẫn</b> trùng một mẫu. Nên <code>--exclude node_modules</code> phủ luôn <code>node_modules/x.js</code>, còn <code>--exclude roi-rac.txt</code> phủ đúng tệp ấy. Không có ký tự đại diện.</li>' +
            '<li><b>Không có <code>--delete</code>.</b> Thứ gì đã có ở đích thì ở lại, bất kể nguồn chứa gì.</li>' +
            '<li><b>Có <code>--delete</code>.</b> Những tệp ở đích mà nguồn không gửi tới sẽ bị xoá — <b>trừ</b> những tệp khớp một mẫu loại trừ, vì cái mẫu CHE CHỞ chúng. Cờ <code>--delete-excluded</code> rút lại sự che chở ấy và xoá luôn chúng; đứng một mình, không kèm <code>--delete</code>, nó chẳng làm gì cả.</li>' +
            '</ul>' +
            '<p>Hãy in các đường dẫn sắp theo thứ tự <b>BYTE</b> (<code>LC_ALL=C</code>), để câu trả lời giống nhau trên mọi máy. Kết quả rỗng thì in một dòng trống.</p>' +
            '<p>Giữ nguyên ba mảng cho sẵn và vòng lặp in kết quả. Chỉ dùng shell thuần, và <b>ĐỪNG ĐỤNG vào hệ thống tệp thật</b>: không <code>rsync</code>, không <code>find</code>, không <code>mkdir</code>, không <code>touch</code>.</p>',
          ),
          starterCode: PT1_Q31_STARTER,
          expectedOutput: PT1_Q31_OUTPUT,
          sampleSolution: PT1_Q31_SOLUTION,
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Releases, the pointer, and the process (chapters 0.4, 1.5 and 3.5).</b> Implement <code>chay(suKien)</code>, which replays a list of events against a releases directory and returns one output line per event.</p>' +
            '<p>Three pieces of state, and the whole question is about keeping them apart:</p>' +
            '<ul>' +
            '<li><b><code>dia</code></b> — the set of release directories that exist.</li>' +
            '<li><b><code>ht</code></b> — what the <code>hien-tai</code> symlink names. It is a <b>name</b>, not a directory: it can point at something that no longer exists.</li>' +
            '<li><b><code>chay</code></b> — the release the running process is actually executing.</li>' +
            '</ul>' +
            '<p>The events:</p>' +
            '<ul>' +
            '<li><code>phat-hanh vN</code> — create a release. If it already exists, refuse and change nothing.</li>' +
            '<li><code>trao vN</code> — point the symlink at <code>vN</code>. If <code>vN</code> is not on disk, refuse and change nothing. <b>This never touches the running process.</b></li>' +
            '<li><code>khoi-dong-lai</code> — the process re-reads the symlink. If the link is unset or names something that is gone, nothing is serving.</li>' +
            '<li><code>don K</code> — keep the <b>K newest by name</b>, sorted by byte order, and delete the rest — but <b>never</b> the release the symlink names.</li>' +
            '<li><code>xoa vN</code> — delete a release outright, symlink or not. If it is not there, refuse.</li>' +
            '</ul>' +
            '<p>One line per event, in this shape — the event padded to 14 characters, <code>ht=</code> padded to 9, <code>chay=</code> padded to 6:</p>' +
            code('trao v2        -> ht=v2        chay=v1     dia=[v1,v2]') +
            '<p><code>ht=</code> prints <code>KHONG</code> when the link is unset and <code>HONG(vN)</code> when it names something that is gone; <code>chay=</code> prints <code>KHONG</code> when nothing is serving; <code>dia=</code> is the sorted names joined with commas. A refusal appends <code> TU CHOI: da co vN</code> or <code> TU CHOI: khong co ban vN</code>; a restart onto a dangling link appends <code> KHONG co gi phuc vu: hien-tai treo</code>; and <code>don</code> appends <code> xoa=[…]</code> plus <code> bo-qua=[…]</code> when it skipped the current release.</p>' +
            '<p>Two of the twenty-two events are there to be surprising, and both are measured behaviours rather than inventions. Keep the given array and the printing loop exactly as they are, and use only what Node has built in.</p>',

            '<p><b>Câu 32 — Bản phát hành, con trỏ, và tiến trình (chương 0.4, 1.5 và 3.5).</b> Cài đặt <code>chay(suKien)</code>: phát lại một danh sách sự kiện trên một thư mục bản phát hành và trả về mỗi sự kiện một dòng kết quả.</p>' +
            '<p>Ba mẩu trạng thái, và cả câu hỏi này là về việc giữ chúng TÁCH BẠCH:</p>' +
            '<ul>' +
            '<li><b><code>dia</code></b> — tập các thư mục bản phát hành đang tồn tại.</li>' +
            '<li><b><code>ht</code></b> — cái mà symlink <code>hien-tai</code> gọi tên. Nó là một cái TÊN, không phải một thư mục: nó hoàn toàn có thể trỏ vào thứ không còn tồn tại.</li>' +
            '<li><b><code>chay</code></b> — bản phát hành mà tiến trình đang chạy THẬT SỰ đang thực thi.</li>' +
            '</ul>' +
            '<p>Các sự kiện:</p>' +
            '<ul>' +
            '<li><code>phat-hanh vN</code> — tạo một bản phát hành. Nếu đã có thì TỪ CHỐI và không đổi gì.</li>' +
            '<li><code>trao vN</code> — trỏ symlink vào <code>vN</code>. Nếu <code>vN</code> không có trên đĩa thì TỪ CHỐI và không đổi gì. <b>Việc này KHÔNG BAO GIỜ đụng tới tiến trình đang chạy.</b></li>' +
            '<li><code>khoi-dong-lai</code> — tiến trình đọc lại symlink. Nếu liên kết chưa được đặt hoặc gọi tên một thứ đã biến mất thì KHÔNG có gì phục vụ.</li>' +
            '<li><code>don K</code> — giữ lại <b>K bản mới nhất theo TÊN</b>, sắp theo thứ tự byte, xoá phần còn lại — nhưng <b>KHÔNG BAO GIỜ</b> xoá bản mà symlink đang gọi tên.</li>' +
            '<li><code>xoa vN</code> — xoá thẳng một bản phát hành, kệ symlink. Không có thì TỪ CHỐI.</li>' +
            '</ul>' +
            '<p>Mỗi sự kiện một dòng, theo đúng khuôn này — tên sự kiện đệm tới 14 ký tự, <code>ht=</code> đệm tới 9, <code>chay=</code> đệm tới 6:</p>' +
            code('trao v2        -> ht=v2        chay=v1     dia=[v1,v2]') +
            '<p><code>ht=</code> in <code>KHONG</code> khi liên kết chưa đặt và <code>HONG(vN)</code> khi nó gọi tên một thứ đã mất; <code>chay=</code> in <code>KHONG</code> khi không có gì phục vụ; <code>dia=</code> là các tên đã sắp, nối bằng dấu phẩy. Một lời từ chối nối thêm <code> TU CHOI: da co vN</code> hoặc <code> TU CHOI: khong co ban vN</code>; một lần khởi động lại vào liên kết treo nối thêm <code> KHONG co gi phuc vu: hien-tai treo</code>; còn <code>don</code> nối thêm <code> xoa=[…]</code> cộng với <code> bo-qua=[…]</code> khi nó đã bỏ qua bản đang được trỏ tới.</p>' +
            '<p>Hai trong hai mươi hai sự kiện có mặt để gây bất ngờ, và cả hai đều là hành vi ĐO ĐƯỢC chứ không phải bịa ra. Giữ nguyên mảng cho sẵn và vòng lặp in kết quả, và chỉ dùng những gì Node có sẵn.</p>',
          ),
          starterCode: PT1_Q32_STARTER,
          expectedOutput: PT1_Q32_OUTPUT,
          sampleSolution: PT1_Q32_SOLUTION,
        }),
      ],
    },
  ],
};
