/**
 * Deploy VPS — Progress Test 2 (Chương 4 → Chương 7).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi, bám sát
 * `content/courses/deploy-vps/s04-cau-hinh` … `s07-script`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ KHÔNG MỘT BYTE NÀO CHẠM VÀO HẠ TẦNG THẬT
 * ────────────────────────────────────────────────────────────────────────────
 * Không SSH tới máy chủ nào, không đụng `cuonghoangdev_db`, không đọc `.env`
 * của dự án lẫn `/opt/cuonghoangdev/.env`, không chạy `deploy.sh` /
 * `deploy-nha.sh` / `gh workflow run` / `git push`. Mọi giá trị nhạy cảm trong
 * đề là GIÁ TRỊ GIẢ, cố ý viết cho khác hẳn giá trị thật
 * (`MAT_KHAU_GIA_LAP`, `khoa_GIA_LAP_khong_that`).
 *
 * ⚙️ SÂN ĐO (dựng rồi xoá bằng `docker rm -f`)
 *   • "VPS giả": container `debian:12` chạy `--privileged` — Debian 12.15
 *     (aarch64), bash 5.2.15(1), GNU coreutils 9.1, GNU grep 3.8, git 2.39.5,
 *     rsync 3.2.7, util-linux 2.38.1, lsof, strace 6.1, python3 3.11.2.
 *   • PostgreSQL 16.14 trong một container `postgres:16` riêng (CSDL nháp tên
 *     `de`, mật khẩu `MAT_KHAU_GIA_LAP`, cổng 55441) — dùng cho chương 5 và 6.
 *   • `node:22-slim` (Node v22.23.1) cho các phép đo `node --env-file`.
 *   • Docker Engine 29.5.3 / Compose v5.1.4, nhân 6.12.76-linuxkit, linux/arm64.
 *
 * Một phép đo nữa đáng ghi vì nó khớp giáo trình chứ không cãi lại: cuộc đua
 * của `exec > >(…)`. Chạy ba lượt mỗi bên trong container, đọc dòng cuối của
 * nhật ký NGAY khoảnh khắc script thoát — bản dùng thay-thế-tiến-trình cho ra
 * dòng ÁP CHÓT cả ba lượt (`1/2 chuan bi`), bản dùng hàm ghi-từng-dòng cho ra
 * dòng cuối đúng cả ba lượt (`XONG`). Câu 26 dùng chính đoạn terminal ấy.
 *
 * ⚠️ MÁY ĐANG CHẠY NHIỀU TIẾN TRÌNH KHÁC ⇒ đề này KHÔNG hỏi một con số thời
 * gian nào của riêng nó. Chỗ nào cần thời gian thì hỏi CƠ CHẾ, hoặc trích lại
 * con số mà chính giáo trình đã đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỘT CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 * Bài 4.3 nêu quy tắc 3: "`KEY = value` là lỗi cú pháp của shell VÀ là một dòng
 * bị bỏ qua trong im lặng ở nơi khác". Vế sau KHÔNG đúng với `node --env-file`.
 * Đo thật trên Node v22.23.1 với đúng một tệp bảy dòng (tự soạn, khác hẳn bảy
 * dòng của giáo trình):
 *
 *     C_CACH_QUANH = xyz          shell: "C_CACH_QUANH: command not found",
 *                                        biến KHÔNG được đặt
 *                                 node : C_CACH_QUANH = [xyz]   ← ĐỌC ĐƯỢC
 *     export H_CO_EXPORT=hhh      node : H_CO_EXPORT = [hhh]    ← chấp nhận
 *                                        cả tiền tố `export`
 *
 * Và một chi tiết nữa đáng ghi: `. ./.env` với dòng hỏng ấy trả về 0 khi KHÔNG
 * có `set -e`, nhưng dưới `set -euo pipefail` thì cả script chết với mã 127
 * (`command not found`). Câu 3 dựng trên hai phép đo này và theo MÁY.
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
 *     `timeout`). Chỉ POSIX + `case` + khai triển tham số. Bảng mã thoát mà nó
 *     tính ra (1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 0) đúng bằng bảng mà bài 7.3
 *     và 7.5 đặt ra.
 *   • Câu 32 (`javascript`) tự chứa, chỉ dùng `Map`/`Set`/`padEnd`, không
 *     `import`, không `require`, không đụng hệ thống tệp lẫn cơ sở dữ liệu.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây): A 8 · B 8 · C 8 · D 8 = 32 khoá
 * trên 30 câu, vì có hai câu "chọn HAI".
 *
 *   node -e "import('./content/exams/DEPLOY-VPS-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Không trùng câu nào với `DEPLOY-VPS-FE.mjs` (50 câu) và `DEPLOY-VPS-PE.mjs`
 * (5 câu thực hành), và không trùng giữa PT1 / PT2 / PT3.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DEPLOY-VPS-PT2.mjs --apply
 */
import { B, EX, code, c, ptInstructions, mcq, codeQ } from './_lib/deployvps-exam-kit.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   Câu 31 — bảng quyết định của một script deploy: TỪ CHỐI, HỎNG, hay XONG
   (chương 7.3 và 7.5)
   ══════════════════════════════════════════════════════════════════════════ */

const PT2_Q31_STARTER =
            '#!/usr/bin/env bash\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'DANG_CHAY_TRUOC=v2\n' +
            '\n' +
            'ca=(\n' +
            '  \'nhan=A cong-cu=du    ban=co    tty=co    dong-y=khong tra-loi=y khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=B cong-cu=du    ban=KHONG tty=co    dong-y=khong tra-loi=y khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=C cong-cu=thieu ban=KHONG tty=khong dong-y=khong tra-loi=n khoa=ban  tao-tac=thieu    len=khong khoi=404 ban-thay=v2\'\n' +
            '  \'nhan=D cong-cu=du    ban=co    tty=khong dong-y=khong tra-loi=y khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=E cong-cu=du    ban=co    tty=co    dong-y=khong tra-loi=n khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=F cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ban  tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=G cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ranh tao-tac=thieu    len=co    khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=H cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ranh tao-tac=du       len=khong khoi=200 ban-thay=v3\'\n' +
            '  \'nhan=I cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ranh tao-tac=du       len=co    khoi=404 ban-thay=v3\'\n' +
            '  \'nhan=J cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v2\'\n' +
            '  \'nhan=K cong-cu=du    ban=co    tty=khong dong-y=co    tra-loi=n khoa=ranh tao-tac=du       len=co    khoi=200 ban-thay=v3\'\n' +
            ')\n' +
            '\n' +
            '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'quyet_dinh() {\n' +
            '  echo \'chua cai dat\' >&2\n' +
            '  return 1\n' +
            '}\n' +
            '\n' +
            '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for c in "${ca[@]}"; do\n' +
            '  quyet_dinh "$c"\n' +
            'done\n';

const PT2_Q31_SOLUTION =
            'quyet_dinh() {\n' +
            '  nhan=; cong_cu=; ban=; tty=; dong_y=; tra_loi=; khoa=; tao_tac=; len=; khoi=; ban_thay=\n' +
            '  for cap in $1; do\n' +
            '    gia_tri=${cap#*=}\n' +
            '    case ${cap%%=*} in\n' +
            '      nhan)     nhan=$gia_tri ;;\n' +
            '      cong-cu)  cong_cu=$gia_tri ;;\n' +
            '      ban)      ban=$gia_tri ;;\n' +
            '      tty)      tty=$gia_tri ;;\n' +
            '      dong-y)   dong_y=$gia_tri ;;\n' +
            '      tra-loi)  tra_loi=$gia_tri ;;\n' +
            '      khoa)     khoa=$gia_tri ;;\n' +
            '      tao-tac)  tao_tac=$gia_tri ;;\n' +
            '      len)      len=$gia_tri ;;\n' +
            '      khoi)     khoi=$gia_tri ;;\n' +
            '      ban-thay) ban_thay=$gia_tri ;;\n' +
            '    esac\n' +
            '  done\n' +
            '\n' +
            '  # bao <ma> <ly do> <TU CHOI | HONG | XONG>\n' +
            '  bao() {\n' +
            '    if [ "$3" = \'XONG\' ]; then\n' +
            '      may=\'DA TRAO\'; cua_truoc=v3\n' +
            '    elif [ "$3" = \'TU CHOI\' ]; then\n' +
            '      may=\'KHONG DOI\'; cua_truoc=$DANG_CHAY_TRUOC\n' +
            '    else\n' +
            '      may=\'DA LUI\'; cua_truoc=$DANG_CHAY_TRUOC\n' +
            '    fi\n' +
            '    printf \'%s ma=%d loai=%s ly-do=%s may=%s cua-truoc=%s\\n\' "$nhan" "$1" "$3" "$2" "$may" "$cua_truoc"\n' +
            '  }\n' +
            '\n' +
            '  # ── Mọi phép kiểm CÓ THỂ TỪ CHỐI đều chạy TRƯỚC khoá và trước lần ghi\n' +
            '  #    đầu tiên. Nhờ vậy mỗi lời từ chối để lại cái máy y nguyên.\n' +
            '  [ "$cong_cu" = \'thieu\' ] && { bao 5 \'thieu-cong-cu\'   \'TU CHOI\'; return; }\n' +
            '  [ "$ban"     = \'KHONG\' ] && { bao 2 \'khong-co-ban\'    \'TU CHOI\'; return; }\n' +
            '  if [ "$dong_y" != \'co\' ]; then\n' +
            '    # Im lặng KHÔNG phải là đồng ý: không có terminal thì TỪ CHỐI, đừng thoát 0.\n' +
            '    [ "$tty" = \'khong\' ]   && { bao 4 \'khong-co-terminal\' \'TU CHOI\'; return; }\n' +
            '    [ "$tra_loi" != \'y\' ]  && { bao 3 \'nguoi-dung-tu-choi\' \'TU CHOI\'; return; }\n' +
            '  fi\n' +
            '  [ "$khoa" = \'ban\' ]      && { bao 1 \'dang-co-deploy-khac\' \'TU CHOI\'; return; }\n' +
            '\n' +
            '  # ── Từ đây trở đi máy BẮT ĐẦU đổi, nên mọi cú hỏng đều phải LÙI.\n' +
            '  [ "$tao_tac" = \'thieu\' ] && { bao 6 \'tao-tac-hong\'     \'HONG\'; return; }\n' +
            '  [ "$len"     = \'khong\' ] && { bao 7 \'ban-moi-khong-len\' \'HONG\'; return; }\n' +
            '  [ "$khoi"    = \'404\'   ] && { bao 8 \'kiem-khoi-404\'    \'HONG\'; return; }\n' +
            '  [ "$ban_thay" != \'v3\'  ] && { bao 9 \'cua-truoc-lech\'   \'HONG\'; return; }\n' +
            '\n' +
            '  bao 0 \'thanh-cong\' \'XONG\'\n' +
            '}\n';

const PT2_Q31_OUTPUT =
            'A ma=0 loai=XONG ly-do=thanh-cong may=DA TRAO cua-truoc=v3\n' +
            'B ma=2 loai=TU CHOI ly-do=khong-co-ban may=KHONG DOI cua-truoc=v2\n' +
            'C ma=5 loai=TU CHOI ly-do=thieu-cong-cu may=KHONG DOI cua-truoc=v2\n' +
            'D ma=4 loai=TU CHOI ly-do=khong-co-terminal may=KHONG DOI cua-truoc=v2\n' +
            'E ma=3 loai=TU CHOI ly-do=nguoi-dung-tu-choi may=KHONG DOI cua-truoc=v2\n' +
            'F ma=1 loai=TU CHOI ly-do=dang-co-deploy-khac may=KHONG DOI cua-truoc=v2\n' +
            'G ma=6 loai=HONG ly-do=tao-tac-hong may=DA LUI cua-truoc=v2\n' +
            'H ma=7 loai=HONG ly-do=ban-moi-khong-len may=DA LUI cua-truoc=v2\n' +
            'I ma=8 loai=HONG ly-do=kiem-khoi-404 may=DA LUI cua-truoc=v2\n' +
            'J ma=9 loai=HONG ly-do=cua-truoc-lech may=DA LUI cua-truoc=v2\n' +
            'K ma=0 loai=XONG ly-do=thanh-cong may=DA TRAO cua-truoc=v3';


/* ══════════════════════════════════════════════════════════════════════════
   Câu 32 — lược đồ đi tiếp, và KHOẢNG LÙI còn lại (chương 5.1, 5.2, 6.2)
   ══════════════════════════════════════════════════════════════════════════ */

const PT2_Q32_STARTER =
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const LUOC_DO_DAU = [\'id\', \'ten\', \'email\'];\n' +
            '\n' +
            'const BAN = [\n' +
            '  { ten: \'v1\', doc: [\'id\', \'ten\', \'email\'],         ghi: [\'ten\', \'email\'] },\n' +
            '  { ten: \'v2\', doc: [\'id\', \'ten\', \'email\'],         ghi: [\'ten\', \'email\'] },\n' +
            '  { ten: \'v3\', doc: [\'id\', \'ten\', \'email\', \'dia_chi_email\'], ghi: [\'ten\', \'email\', \'dia_chi_email\'] },\n' +
            '  { ten: \'v4\', doc: [\'id\', \'ten\', \'dia_chi_email\'], ghi: [\'ten\', \'dia_chi_email\'] },\n' +
            '  { ten: \'v5\', doc: [\'id\', \'ten\', \'dia_chi_email\', \'quoc_gia\'], ghi: [\'ten\', \'dia_chi_email\', \'quoc_gia\'] },\n' +
            '];\n' +
            '\n' +
            'const SU_KIEN = [\n' +
            '  \'deploy v1\',\n' +
            '  \'deploy v2\',\n' +
            '  \'luoc-do them dia_chi_email\',\n' +
            '  \'deploy v3\',\n' +
            '  \'deploy v4\',\n' +
            '  \'luoc-do bo email\',\n' +
            '  \'luoc-do them-bat-buoc quoc_gia\',\n' +
            '  \'deploy v5\',\n' +
            '  \'luoc-do doi-ten ten ho_ten\',\n' +
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

const PT2_Q32_SOLUTION =
            'function chay(suKien) {\n' +
            '  // Lược đồ = tên cột → có bắt buộc (NOT NULL, không mặc định) hay không.\n' +
            '  const luocDo = new Map(LUOC_DO_DAU.map((c) => [c, false]));\n' +
            '  const thuTu = BAN.map((b) => b.ten);\n' +
            '  let ht = null;\n' +
            '  const dong = [];\n' +
            '\n' +
            '  // Một bản CHẠY ĐƯỢC với lược đồ hiện tại khi và chỉ khi:\n' +
            '  //   • mọi cột nó ĐỌC và mọi cột nó GHI đều còn tồn tại, VÀ\n' +
            '  //   • mọi cột BẮT BUỘC của lược đồ đều nằm trong danh sách nó GHI\n' +
            '  //     (nếu không, mọi lệnh chèn của nó đều hỏng).\n' +
            '  const chayDuoc = (b) => {\n' +
            '    for (const c of [...b.doc, ...b.ghi]) if (!luocDo.has(c)) return false;\n' +
            '    for (const [c, batBuoc] of luocDo) if (batBuoc && !b.ghi.includes(c)) return false;\n' +
            '    return true;\n' +
            '  };\n' +
            '\n' +
            '  for (const sk of suKien) {\n' +
            '    const p = sk.split(\' \');\n' +
            '    if (p[0] === \'deploy\') {\n' +
            '      ht = p[1];\n' +
            '    } else if (p[1] === \'them\') {\n' +
            '      luocDo.set(p[2], false);\n' +
            '    } else if (p[1] === \'them-bat-buoc\') {\n' +
            '      luocDo.set(p[2], true);\n' +
            '    } else if (p[1] === \'bo\') {\n' +
            '      luocDo.delete(p[2]);\n' +
            '    } else if (p[1] === \'doi-ten\') {\n' +
            '      const batBuoc = luocDo.get(p[2]) || false;\n' +
            '      luocDo.delete(p[2]);\n' +
            '      luocDo.set(p[3], batBuoc);\n' +
            '    }\n' +
            '\n' +
            '    // Khoảng lùi: đếm NGƯỢC từ bản trước bản đang chạy, và DỪNG ở bản\n' +
            '    // đầu tiên không chạy được — lùi hai bước qua một bản chết là vô nghĩa.\n' +
            '    let khoang = 0;\n' +
            '    if (ht !== null) {\n' +
            '      for (let i = thuTu.indexOf(ht) - 1; i >= 0; i--) {\n' +
            '        if (!chayDuoc(BAN[i])) break;\n' +
            '        khoang++;\n' +
            '      }\n' +
            '    }\n' +
            '    const song = BAN.filter(chayDuoc).map((b) => b.ten);\n' +
            '\n' +
            '    dong.push(\n' +
            '      sk.padEnd(30) +\n' +
            '      \' ht=\' + (ht === null ? \'KHONG\' : ht) +\n' +
            '      \' luoc-do=[\' + [...luocDo.keys()].join(\',\') + \']\' +\n' +
            '      \' chay-duoc=[\' + song.join(\',\') + \']\' +\n' +
            '      \' khoang-lui=\' + khoang +\n' +
            '      (ht !== null && !chayDuoc(BAN[thuTu.indexOf(ht)]) ? \'  ← BAN DANG CHAY DA CHET\' : \'\'),\n' +
            '    );\n' +
            '  }\n' +
            '  return dong;\n' +
            '}\n';

const PT2_Q32_OUTPUT =
            'deploy v1                      ht=v1 luoc-do=[id,ten,email] chay-duoc=[v1,v2] khoang-lui=0\n' +
            'deploy v2                      ht=v2 luoc-do=[id,ten,email] chay-duoc=[v1,v2] khoang-lui=1\n' +
            'luoc-do them dia_chi_email     ht=v2 luoc-do=[id,ten,email,dia_chi_email] chay-duoc=[v1,v2,v3,v4] khoang-lui=1\n' +
            'deploy v3                      ht=v3 luoc-do=[id,ten,email,dia_chi_email] chay-duoc=[v1,v2,v3,v4] khoang-lui=2\n' +
            'deploy v4                      ht=v4 luoc-do=[id,ten,email,dia_chi_email] chay-duoc=[v1,v2,v3,v4] khoang-lui=3\n' +
            'luoc-do bo email               ht=v4 luoc-do=[id,ten,dia_chi_email] chay-duoc=[v4] khoang-lui=0\n' +
            'luoc-do them-bat-buoc quoc_gia ht=v4 luoc-do=[id,ten,dia_chi_email,quoc_gia] chay-duoc=[v5] khoang-lui=0  ← BAN DANG CHAY DA CHET\n' +
            'deploy v5                      ht=v5 luoc-do=[id,ten,dia_chi_email,quoc_gia] chay-duoc=[v5] khoang-lui=0\n' +
            'luoc-do doi-ten ten ho_ten     ht=v5 luoc-do=[id,dia_chi_email,quoc_gia,ho_ten] chay-duoc=[] khoang-lui=0  ← BAN DANG CHAY DA CHET';


export default {
  course: { slug: 'deploy-vps' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4 to 7 (configuration and secrets, migrations, rollback, the deploy script)',
        'Kiểm tra tiến độ 2 — Chương 4 đến 7 (cấu hình và bí mật, migration, lùi bản, script deploy)',
      ),
      description: B(
        'The middle third of the Deploy VPS course: where configuration and secrets live so a deploy cannot lose them, the window between a schema change and a code change, rolling back and the changes that cannot be rolled back, and a deploy script that fails loudly, runs twice without harm, and refuses when it should. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Deploy VPS: cấu hình và bí mật sống ở đâu để một lần deploy không đánh mất chúng, cái cửa sổ nằm giữa một thay đổi lược đồ và một thay đổi mã, việc lùi bản và những thay đổi KHÔNG lùi được, và một script deploy biết hỏng thật to, chạy hai lần vẫn vô hại, và TỪ CHỐI đúng lúc. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      course: { slug: 'deploy-vps' },
      questions: [

        /* ── Chương 4 — cấu hình và bí mật (7 câu) ─────────────────────── */

        // q1 · đáp án D
        mcq({
          prompt: B(
            'Configuration lives in the shared directory and is symlinked into each release. Measured across a deploy, a value change and a rollback:' +
            code('v1 doc duoc: DATABASE_URL=postgres://prod\n' +
                 '--- deploy v2 (doi symlink) ---\n' +
                 'v2 doc duoc: DATABASE_URL=postgres://prod\n' +
                 '--- doi cau hinh o CHUNG ---\n' +
                 'v2 doc duoc: DATABASE_URL=postgres://prod-MOI\n' +
                 '--- LUI ve v1 ---\n' +
                 'v1 doc duoc: DATABASE_URL=postgres://prod-MOI') +
            'The last line is usually what you want. When is it the worst possible outcome, and what removes that case?',
            'Cấu hình sống ở thư mục dùng chung rồi được liên kết mềm vào từng bản phát hành. Đo xuyên qua một lần deploy, một lần đổi giá trị và một cú lùi bản:' +
            code('v1 doc duoc: DATABASE_URL=postgres://prod\n' +
                 '--- deploy v2 (doi symlink) ---\n' +
                 'v2 doc duoc: DATABASE_URL=postgres://prod\n' +
                 '--- doi cau hinh o CHUNG ---\n' +
                 'v2 doc duoc: DATABASE_URL=postgres://prod-MOI\n' +
                 '--- LUI ve v1 ---\n' +
                 'v1 doc duoc: DATABASE_URL=postgres://prod-MOI') +
            'Dòng cuối thường là thứ bạn MUỐN. Khi nào nó là kết cục tệ nhất có thể, và cái gì xoá bỏ được ca đó?',
          ),
          options: [
            B(
              'When the rolled-back release reads the file through a different loader: the shared file is written for whatever parsed it last, so v1 may read a truncated or expanded value and start with a password that is not the one in the file. The fix is to pin one loader for every release and to verify through <code>/proc/&lt;pid&gt;/environ</code> after every rollback',
              'Khi bản được lùi về đọc tệp ấy bằng một bộ phân tích KHÁC: tệp dùng chung được viết cho bên nào phân tích nó gần nhất, nên v1 có thể đọc ra một giá trị bị cắt cụt hay bị bung ra rồi khởi động với một mật khẩu không phải mật khẩu nằm trong tệp. Cách chữa là ghim đúng một bộ phân tích cho mọi bản phát hành và kiểm chứng qua <code>/proc/&lt;pid&gt;/environ</code> sau mỗi cú lùi bản',
            ),
            B(
              'When the new value is a rotated credential: rolling the code back while the key moves forward means the old release authenticates with a key that was revoked, so the shared directory must be versioned alongside the releases',
              'Khi giá trị mới là một thông tin xác thực vừa xoay: lùi mã lại trong khi khoá đi tới nghĩa là bản cũ xác thực bằng một khoá đã bị thu hồi, nên thư mục dùng chung phải được đánh phiên bản song song với các bản phát hành',
            ),
            B(
              'Never — a rollback that keeps the current configuration is correct by construction, because configuration describes the environment and the environment did not roll back; any exception is a bug in the application rather than in the arrangement',
              'Không bao giờ — một cú lùi bản giữ nguyên cấu hình hiện tại là ĐÚNG về mặt cấu trúc, vì cấu hình mô tả MÔI TRƯỜNG mà môi trường thì không lùi; mọi ngoại lệ đều là lỗi của ứng dụng chứ không phải của cách bố trí',
            ),
            B(
              'When the release you are rolling back <b>renamed</b> a variable and somebody tidied the old name away: v1 looks for <code>DB_URL</code>, finds nothing, and dies on start-up — the rollback completes successfully and the site stays broken. The fix is to make configuration changes additive across a deploy: add the new name, ship code that reads either, remove the old name a deploy later',
              'Khi bản mà bạn đang lùi khỏi đã <b>ĐỔI TÊN</b> một biến và ai đó đã dọn cái tên cũ đi: v1 đi tìm <code>DB_URL</code>, không thấy gì, và chết ngay lúc khởi động — cú lùi bản hoàn tất THÀNH CÔNG còn trang web thì vẫn hỏng. Cách chữa là làm cho mọi thay đổi cấu hình mang tính CỘNG THÊM xuyên qua một lần deploy: thêm tên mới, gửi đi đoạn mã đọc được cả hai, rồi một lần deploy sau mới bỏ tên cũ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A rollback that completes successfully and leaves the site broken is the worst outcome a rollback can have, because it stops you looking. Code and configuration have different lifetimes and roll back independently — which is right almost always, and wrong exactly when the previous release cannot read the current configuration. The shape of the fix is the same one Chapter 5 uses for a column rename and Chapter 4.5 uses for a signing key: expand, then contract, with a gap in between that is at least as long as your rollback distance. Option B describes a genuine hazard from the opposite direction and its own answer is wrong: versioning the shared directory alongside releases would un-rotate a key you rotated on purpose, which is the thing the arrangement exists to prevent. And the guard that catches all of it at start-up costs four lines — validate the required variables and <code>process.exit(1)</code> if any is absent, so a missing value becomes a failed deploy instead of a broken site.',
            'Một cú lùi bản HOÀN TẤT THÀNH CÔNG mà để lại trang web hỏng là kết cục tệ nhất mà một cú lùi có thể có, vì nó làm bạn THÔI TÌM. Mã và cấu hình có vòng đời khác nhau và lùi độc lập với nhau — điều đó gần như luôn đúng, và sai đúng vào lúc bản TRƯỚC không đọc nổi cấu hình HIỆN TẠI. Hình dạng của cách chữa cũng chính là thứ Chương 5 dùng cho một cú đổi tên cột và bài 4.5 dùng cho một khoá ký: MỞ RỘNG, rồi THU HẸP, với một khoảng chờ ở giữa dài ít nhất bằng khoảng lùi của bạn. Phương án B mô tả một mối nguy có thật theo chiều ngược lại và tự nó trả lời sai: đánh phiên bản thư mục dùng chung song song với các bản phát hành sẽ XOAY NGƯỢC một cái khoá mà bạn cố ý xoay, đúng thứ mà cách bố trí này sinh ra để ngăn. Còn cái chốt bắt được tất cả những chuyện đó ngay lúc khởi động chỉ tốn bốn dòng — kiểm các biến bắt buộc rồi <code>process.exit(1)</code> nếu thiếu cái nào, để một giá trị vắng mặt trở thành một lần DEPLOY HỎNG thay vì một trang web hỏng.',
          ),
        }),

        // q2 · đáp án A
        mcq({
          prompt: B(
            'Two ways of getting configuration to a service:' +
            code('A)  # trong script deploy, sau khi giai nen\n' +
                 '    ln -sfn /srv/app/chung/.env "$BAN/.env"\n\n' +
                 'B)  # /etc/systemd/system/app.service\n' +
                 '    EnvironmentFile=/srv/app/chung/.env'),
            'Both keep configuration outside the artifact. What does B give you that A does not, and when does A win anyway?',
            'Hai cách đưa cấu hình tới một dịch vụ:' +
            code('A)  # trong script deploy, sau khi giai nen\n' +
                 '    ln -sfn /srv/app/chung/.env "$BAN/.env"\n\n' +
                 'B)  # /etc/systemd/system/app.service\n' +
                 '    EnvironmentFile=/srv/app/chung/.env'),
            'Cả hai đều giữ cấu hình ra ngoài tạo tác. B cho bạn thứ gì mà A không có, và khi nào A vẫn thắng?',
          ),
          options: [
            B(
              'B means the application never opens a configuration file at all — it just has environment variables, and there is one fewer symlink to get wrong. A wins when a framework insists on reading <code>.env</code> itself, or when the same directory has to work under Docker, systemd and a developer running it by hand',
              'B nghĩa là ứng dụng KHÔNG hề mở một tệp cấu hình nào — nó chỉ có sẵn các biến môi trường, và bớt được một cái symlink có thể làm sai. A thắng khi một framework khăng khăng tự đọc <code>.env</code>, hoặc khi cùng một thư mục ấy phải chạy được dưới cả Docker, systemd, lẫn một lập trình viên gõ tay',
            ),
            B(
              'B reloads the values without restarting, because systemd re-reads <code>EnvironmentFile</code> on every <code>systemctl reload</code>; A requires a restart, so A is only appropriate for values that never change',
              'B nạp lại giá trị mà không cần khởi động lại, vì systemd đọc lại <code>EnvironmentFile</code> ở mỗi lệnh <code>systemctl reload</code>; A thì buộc phải khởi động lại, nên A chỉ hợp với những giá trị không bao giờ đổi',
            ),
            B(
              'B keeps the values out of <code>/proc/&lt;pid&gt;/environ</code>, so another user on the machine cannot read the database password; A exposes them to anyone who can list processes, which is why the symlink form should never hold a secret',
              'B giữ các giá trị ra ngoài <code>/proc/&lt;pid&gt;/environ</code>, nên một người dùng khác trên máy không đọc được mật khẩu cơ sở dữ liệu; A phơi chúng ra cho bất cứ ai liệt kê được tiến trình, và vì thế dạng symlink không bao giờ được giữ một bí mật',
            ),
            B(
              'B survives a rollback and A does not: the symlink is created inside the release directory, so rolling back to an older release means rolling back to a release whose symlink was never created and whose <code>.env</code> is therefore missing',
              'B sống sót qua một cú lùi bản còn A thì không: cái symlink được tạo BÊN TRONG thư mục bản phát hành, nên lùi về một bản cũ hơn là lùi về một bản mà symlink chưa từng được tạo, và do đó <code>.env</code> của nó thiếu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both arrangements satisfy factor III: the same artifact is deployable to staging and production without rebuilding, because everything that differs lives outside it. The systemd form is cleaner where it applies for exactly the reason given — one fewer moving part, and no file for a parser to disagree about (which Question 3 is entirely about). The symlink form is what you need when the framework opens <code>.env</code> itself, or when the same shared directory is read by three different things. Option B is wrong on the mechanism: <code>systemctl reload</code> runs <code>ExecReload</code>, and environment is applied when the process is <em>started</em>, so changing an <code>EnvironmentFile</code> needs a restart either way. Option C is backwards — <code>EnvironmentFile</code> puts the values into the process environment, which is precisely what <code>/proc/&lt;pid&gt;/environ</code> shows; that file is mode 0400 owned by the process owner, and it is the single most useful diagnostic in this chapter. Option D describes a real hazard that both forms share and that the deploy script fixes by re-creating the link on every deploy.',
            'Cả hai cách đều thoả yếu tố III: cùng một tạo tác deploy được lên cả staging lẫn production mà không phải dựng lại, vì mọi thứ KHÁC NHAU đều nằm ngoài nó. Dạng systemd gọn hơn ở nơi nó áp dụng được, đúng vì lý do đã nêu — bớt một bộ phận chuyển động, và không có tệp nào để các bộ phân tích cãi nhau (đúng chủ đề của câu 3). Dạng symlink là thứ bạn cần khi framework tự mở <code>.env</code>, hoặc khi cùng một thư mục dùng chung bị ba thứ khác nhau đọc. Phương án B sai về cơ chế: <code>systemctl reload</code> chạy <code>ExecReload</code>, còn môi trường thì được áp lúc tiến trình được KHỞI ĐỘNG, nên đổi một <code>EnvironmentFile</code> đằng nào cũng cần khởi động lại. Phương án C thì ngược — <code>EnvironmentFile</code> đưa các giá trị VÀO môi trường tiến trình, đúng thứ mà <code>/proc/&lt;pid&gt;/environ</code> phơi ra; tệp ấy có quyền 0400 thuộc về chủ tiến trình, và nó là công cụ chẩn đoán hữu dụng nhất trong cả chương này. Phương án D mô tả một mối nguy CÓ THẬT mà CẢ HAI dạng đều dính, và script deploy chữa nó bằng cách tạo lại liên kết ở mỗi lần deploy.',
          ),
        }),

        // q3 · đáp án C
        mcq({
          prompt: B(
            'One <code>.env</code> file, two loaders. Measured on bash 5.2.15 and Node v22.23.1 (this file is not the one in the course):' +
            code('C_CACH_QUANH = xyz\n' +
                 'export H_CO_EXPORT=hhh\n\n' +
                 '════ shell: set -a; . ./.env ════\n' +
                 '  ./.env: line 3: C_CACH_QUANH: command not found\n' +
                 '  C_CACH_QUANH = [<KHONG CO>]\n' +
                 '  H_CO_EXPORT  = [hhh]\n' +
                 '  ma thoat cua lenh source (KHONG co set -e) = 0\n' +
                 '  ma thoat cua SCRIPT   (CO set -euo pipefail) = 127\n\n' +
                 '════ node --env-file=.env ════\n' +
                 '  C_CACH_QUANH = [xyz]\n' +
                 '  H_CO_EXPORT  = [hhh]') +
            'The course says a line with spaces around <code>=</code> is "a shell syntax error and a silently ignored line elsewhere". What does the machine say?',
            'Một tệp <code>.env</code>, hai bộ phân tích. Đo trên bash 5.2.15 và Node v22.23.1 (tệp này không phải tệp trong giáo trình):' +
            code('C_CACH_QUANH = xyz\n' +
                 'export H_CO_EXPORT=hhh\n\n' +
                 '════ shell: set -a; . ./.env ════\n' +
                 '  ./.env: line 3: C_CACH_QUANH: command not found\n' +
                 '  C_CACH_QUANH = [<KHONG CO>]\n' +
                 '  H_CO_EXPORT  = [hhh]\n' +
                 '  ma thoat cua lenh source (KHONG co set -e) = 0\n' +
                 '  ma thoat cua SCRIPT   (CO set -euo pipefail) = 127\n\n' +
                 '════ node --env-file=.env ════\n' +
                 '  C_CACH_QUANH = [xyz]\n' +
                 '  H_CO_EXPORT  = [hhh]') +
            'Giáo trình nói một dòng có dấu cách quanh <code>=</code> là "lỗi cú pháp của shell VÀ là một dòng bị bỏ qua trong im lặng ở nơi khác". Máy nói gì?',
          ),
          options: [
            B(
              'The machine agrees with the course: both loaders failed to set the variable, and the difference is only in how loudly they said so — the shell printed a message and Node did not',
              'Máy đồng ý với giáo trình: cả hai bộ phân tích đều KHÔNG đặt được biến, và khác biệt chỉ ở chỗ chúng kêu to nhỏ ra sao — shell in ra một thông báo còn Node thì không',
            ),
            B(
              'The machine contradicts the course in the other direction: the shell set the variable to an empty string rather than leaving it unset, which is worse, because <code>${VAR:?}</code> and <code>set -u</code> both accept an empty value',
              'Máy phản bác giáo trình theo chiều ngược lại: shell ĐẶT biến thành chuỗi rỗng chứ không để nó chưa đặt, và như thế còn tệ hơn, vì <code>${VAR:?}</code> lẫn <code>set -u</code> đều chấp nhận một giá trị rỗng',
            ),
            B(
              'Node parses it — it trims the key and the value and sets <code>xyz</code>, and it also accepts the <code>export</code> prefix. So the two loaders now disagree about whether the variable exists at all, and which loader the service happens to be started with that day decides it',
              'Node PHÂN TÍCH ĐƯỢC nó — nó cắt trắng ở hai đầu khoá lẫn giá trị rồi đặt thành <code>xyz</code>, và nó còn chấp nhận cả tiền tố <code>export</code>. Nên hai bộ phân tích giờ BẤT ĐỒNG về việc biến ấy có tồn tại hay không, và hôm ấy dịch vụ tình cờ được khởi động bằng bộ nào sẽ quyết định',
            ),
            B(
              'The transcript is inconclusive because <code>set -a</code> was used: automatic export changes how the shell parses assignments, and without it the shell would have accepted the line exactly as Node did',
              'Đoạn terminal không kết luận được gì vì đã dùng <code>set -a</code>: chế độ tự xuất làm đổi cách shell phân tích các phép gán, và không có nó thì shell đã chấp nhận dòng ấy y như Node',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<b>Measured, and the exam follows the machine.</b> There is no specification for <code>.env</code> files — every loader invented its own rules — and this is a line where two common ones now disagree about existence rather than about value. Under the shell the variable is unset and the file <em>appears</em> to load fine (<code>source</code> returned 0), so a deploy without <code>set -e</code> carries on with a missing value; add <code>set -euo pipefail</code> and the same file kills the script with 127, which is at least honest. The rules that survive every loader are unchanged and are worth more than knowing the difference: quote every value, never rely on interpolation, no spaces around <code>=</code>, nothing multi-line. And the way to settle any argument about what a running process actually received is one line — <code>tr &#39;\\0&#39; &#39;\\n&#39; &lt; /proc/&lt;pid&gt;/environ</code> — because that is the environment, not what is in the file and not what your shell has.',
            '<b>Đã đo, và đề THEO MÁY.</b> Không hề có đặc tả nào cho tệp <code>.env</code> — mỗi bộ nạp tự bịa ra luật của mình — và đây là một dòng mà hai bộ phổ biến giờ bất đồng về việc biến CÓ TỒN TẠI hay không, chứ không phải bất đồng về giá trị. Dưới shell thì biến chưa được đặt và tệp TRÔNG như nạp bình thường (<code>source</code> trả 0), nên một lần deploy không có <code>set -e</code> cứ thế đi tiếp với một giá trị thiếu; thêm <code>set -euo pipefail</code> vào thì cũng tệp ấy giết script với mã 127 — ít ra là thật thà. Những quy tắc SỐNG SÓT qua mọi bộ nạp thì vẫn nguyên và đáng giá hơn việc thuộc lòng khác biệt: bọc nháy MỌI giá trị, không bao giờ trông cậy vào nối chuỗi, không dấu cách quanh <code>=</code>, không gì nhiều dòng. Và cách phân xử mọi tranh cãi về việc một tiến trình đang chạy THẬT SỰ nhận được gì chỉ là một dòng — <code>tr &#39;\\0&#39; &#39;\\n&#39; &lt; /proc/&lt;pid&gt;/environ</code> — vì ĐÓ mới là môi trường, chứ không phải thứ nằm trong tệp và cũng không phải thứ shell của bạn đang có.',
          ),
        }),

        // q4 · đáp án B
        mcq({
          prompt: B(
            'Three places a value can be supplied to a containerised application:' +
            code('Dockerfile ARG        --build-arg, chi ton tai luc DUNG anh\n' +
                 'Dockerfile ENV        nuong vao anh, thay duoc luc chay\n' +
                 'compose environment   cap luc container khoi dong'),
            'A front-end bundle needs an API URL inlined into its JavaScript, and the backend needs a JWT signing key. Where does each belong, and what is the trap in the answer?',
            'Ba chỗ có thể cấp một giá trị cho một ứng dụng chạy trong container:' +
            code('Dockerfile ARG        --build-arg, chi ton tai luc DUNG anh\n' +
                 'Dockerfile ENV        nuong vao anh, thay duoc luc chay\n' +
                 'compose environment   cap luc container khoi dong'),
            'Một gói front-end cần một URL API được nhúng thẳng vào JavaScript của nó, còn backend cần một khoá ký JWT. Mỗi thứ thuộc về đâu, và cái bẫy trong câu trả lời là gì?',
          ),
          options: [
            B(
              'Both belong in <code>ENV</code>: it is the only one available at both build time and run time, so one mechanism covers both cases and the image stays self-contained',
              'Cả hai đều thuộc về <code>ENV</code>: đó là chỗ duy nhất có mặt ở CẢ lúc dựng lẫn lúc chạy, nên một cơ chế phủ được cả hai ca và cái ảnh vẫn tự chứa',
            ),
            B(
              'The API URL has to arrive as <code>ARG</code>, because that is the moment the bundle is produced; the signing key belongs in the compose environment. The trap is that <code>ARG</code> is not a secret — it appears in the image build history — so a token passed that way is published to anyone with the image',
              'Cái URL API buộc phải tới dưới dạng <code>ARG</code>, vì đó chính là khoảnh khắc gói front-end được sinh ra; còn khoá ký thuộc về phần environment của compose. Cái bẫy là <code>ARG</code> KHÔNG PHẢI một bí mật — nó hiện ra trong lịch sử dựng của ảnh — nên một token truyền theo lối ấy là đã công bố cho bất cứ ai có cái ảnh',
            ),
            B(
              'The API URL belongs in the compose environment and the signing key in <code>ARG</code>: the URL differs per environment so it must be settable at run time, while the key is constant for the lifetime of the image and can be baked in',
              'Cái URL API thuộc về environment của compose còn khoá ký thuộc về <code>ARG</code>: URL khác nhau theo từng môi trường nên phải đặt được lúc chạy, còn khoá thì cố định suốt vòng đời của ảnh nên nướng vào được',
            ),
            B(
              'Neither belongs in the image: both should be fetched at start-up from a secret manager, because anything written into a Dockerfile is visible to <code>docker history</code> and anything in compose is visible in the process list',
              'Chẳng cái nào thuộc về cái ảnh cả: cả hai nên được lấy về lúc khởi động từ một trình quản lý bí mật, vì bất cứ thứ gì viết vào Dockerfile đều nhìn thấy được qua <code>docker history</code> và bất cứ thứ gì trong compose đều nhìn thấy được trong danh sách tiến trình',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Anything a browser runs is baked at build time — a front-end bundle is a static file downloaded by a browser, so there is no server-side environment for it to read. Every framework has a mechanism for inlining values during the build (<code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code>), and every one has the same property: change it on the server, restart, and nothing whatsoever happens, because the value is a string inside a JavaScript file that was written weeks ago. The signing key is the opposite: read at start-up, so it belongs where it can differ per environment and change with a restart. The trap is the one this repository has on record from a different angle — a build arg is not a secret mechanism; use <code>RUN --mount=type=secret</code> when a build genuinely needs a credential. And there is a second cost to build-time values worth stating: a bundle containing <code>https://api.example.com</code> and one containing <code>https://api.staging.example.com</code> are <em>different artifacts</em>, so the thing you tested in staging is not the thing you deployed — which is exactly what a reproducible artifact was built to prevent. Where it matters, have the browser fetch its configuration at run time from a small <code>/config.json</code> on your own server.',
            'Bất cứ thứ gì TRÌNH DUYỆT chạy đều bị nướng vào lúc DỰNG — một gói front-end là một tệp tĩnh do trình duyệt tải về, nên chẳng có môi trường phía máy chủ nào cho nó đọc cả. Framework nào cũng có cơ chế nhúng giá trị vào lúc dựng (<code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code>), và cái nào cũng mang cùng tính chất: đổi nó trên máy chủ, khởi động lại, và KHÔNG có gì xảy ra cả, vì giá trị ấy là một chuỗi nằm trong một tệp JavaScript viết ra từ mấy tuần trước. Khoá ký thì ngược lại: đọc lúc khởi động, nên nó thuộc về nơi có thể khác nhau theo môi trường và đổi được bằng một lần khởi động lại. Cái bẫy chính là thứ kho mã này đã có trong hồ sơ nhìn từ một góc khác — một build arg KHÔNG phải cơ chế giữ bí mật; hãy dùng <code>RUN --mount=type=secret</code> khi một bản dựng thật sự cần một thông tin xác thực. Và còn một cái giá thứ hai của giá trị-lúc-dựng đáng nói ra: một gói chứa <code>https://api.example.com</code> và một gói chứa <code>https://api.staging.example.com</code> là HAI TẠO TÁC KHÁC NHAU, nên thứ bạn kiểm thử ở staging không phải thứ bạn deploy — đúng điều mà một tạo tác tái lập được sinh ra để ngăn. Ở đâu quan trọng thì hãy để trình duyệt tự lấy cấu hình lúc chạy từ một endpoint <code>/config.json</code> nhỏ trên chính máy chủ của bạn.',
          ),
        }),

        // q5 · đáp án D
        mcq({
          prompt: B(
            'Somebody commits a <code>.env</code>, notices, deletes it and adds a <code>.gitignore</code> in the next commit. Then, on the resulting repository, measured on git 2.39.5:' +
            code('git ls-files            → .gitignore  app.js\n' +
                 'git log --all -- .env   → c64fcb6  bo .env khoi kho, them gitignore\n' +
                 '                          33035a5  them cau hinh\n' +
                 'git show 33035a5:.env   → DATABASE_URL=postgres://app:MAT_KHAU_GIA_LAP@db:5432/prod\n' +
                 '                          API_KEY=khoa_GIA_LAP_khong_that\n\n' +
                 '-- sau khi chay git gc --prune=now --aggressive --\n' +
                 '   git show 33035a5:.env → van doc duoc: CO\n' +
                 '   git cat-file -t <blob> → blob') +
            'A colleague concludes that <code>git gc --prune=now</code> did not work. What is the correct reading, and what is the first action?',
            'Ai đó lỡ commit một tệp <code>.env</code>, nhận ra, xoá nó đi và thêm <code>.gitignore</code> ở commit sau. Rồi trên kho mã kết quả, đo trên git 2.39.5:' +
            code('git ls-files            → .gitignore  app.js\n' +
                 'git log --all -- .env   → c64fcb6  bo .env khoi kho, them gitignore\n' +
                 '                          33035a5  them cau hinh\n' +
                 'git show 33035a5:.env   → DATABASE_URL=postgres://app:MAT_KHAU_GIA_LAP@db:5432/prod\n' +
                 '                          API_KEY=khoa_GIA_LAP_khong_that\n\n' +
                 '-- sau khi chay git gc --prune=now --aggressive --\n' +
                 '   git show 33035a5:.env → van doc duoc: CO\n' +
                 '   git cat-file -t <blob> → blob') +
            'Một đồng nghiệp kết luận rằng <code>git gc --prune=now</code> đã không có tác dụng. Cách đọc ĐÚNG là gì, và hành động đầu tiên là gì?',
          ),
          options: [
            B(
              '<code>gc</code> needs <code>--no-reflog</code> as well, because the reflog still references the old tip; run it with that flag and the blob becomes unreachable, at which point the secret is genuinely gone from the repository',
              '<code>gc</code> cần thêm <code>--no-reflog</code> nữa, vì reflog vẫn còn tham chiếu tới đỉnh cũ; chạy kèm cờ ấy thì blob thành không-với-tới-được, và tới lúc đó bí mật mới thật sự biến khỏi kho mã',
            ),
            B(
              'The blob survived because <code>--aggressive</code> repacks rather than prunes; the correct command is <code>git repack -Ad</code> followed by <code>git prune --expire=now</code>, and after that the history is clean and no rotation is required',
              'Cái blob sống sót vì <code>--aggressive</code> chỉ đóng gói lại chứ không dọn; lệnh đúng là <code>git repack -Ad</code> rồi <code>git prune --expire=now</code>, và sau đó lịch sử sạch và không cần xoay khoá gì cả',
            ),
            B(
              'The measurement is a false alarm: <code>git show</code> reads from the working tree cache rather than from the object database, so it will keep printing the old content until the repository is re-cloned, at which point the secret is absent',
              'Phép đo là báo động giả: <code>git show</code> đọc từ bộ đệm cây làm việc chứ không đọc từ cơ sở dữ liệu đối tượng, nên nó sẽ còn in ra nội dung cũ cho tới khi kho được clone lại, và khi ấy bí mật không còn nữa',
            ),
            B(
              '<code>gc</code> worked exactly as documented — it removes <b>unreachable</b> objects, and this blob is reachable from a commit that is still in the history, so nothing was ever going to remove it. The first action is to <b>rotate the credential and verify the old value is refused</b>; rewriting history is worth doing and is not the fix',
              '<code>gc</code> đã làm ĐÚNG như tài liệu ghi — nó gỡ những đối tượng KHÔNG-VỚI-TỚI-ĐƯỢC, mà cái blob này thì VỚI TỚI ĐƯỢC từ một commit vẫn còn nằm trong lịch sử, nên chẳng có gì định gỡ nó cả. Hành động đầu tiên là <b>XOAY thông tin xác thực và kiểm chứng rằng giá trị cũ bị TỪ CHỐI</b>; viết lại lịch sử là việc đáng làm nhưng không phải cách chữa',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, and the point of the <code>gc</code> half is to kill a plausible false hope: garbage collection removes what nothing points at, and a committed file is pointed at by its commit. Removing the file in a later commit changes the current tree and nothing about the past. Everything else follows from that: everyone with a clone already has it, every backup and mirror has it, and if the repository was ever public you should assume it was scraped — public repositories are scanned continuously and <code>sk_live_</code> is a well-known prefix. So rotate first, and <b>verify</b> the old value is refused rather than assuming, because some providers keep an old key alive for a grace period. Then check the provider\'s access log for the window between the commit and the rotation, because "we don\'t know whether it was used" is a much worse answer than "we checked". Then clean the history with <code>git filter-repo</code> so the next person does not find a credential and wonder whether it is live — expecting every hash to change and every open pull request to break.',
            'Đã đo, và mục đích của phần <code>gc</code> là giết một tia hy vọng hão nghe rất có lý: bộ dọn rác gỡ đi những thứ KHÔNG có gì trỏ tới, mà một tệp đã commit thì được chính commit của nó trỏ tới. Xoá tệp ở một commit sau chỉ đổi cây HIỆN TẠI và không đổi gì về quá khứ. Mọi thứ còn lại đều suy ra từ đó: ai có bản clone thì đã có nó rồi, mọi bản sao lưu và mọi kho gương đều có nó, và nếu kho từng công khai thì hãy mặc định là nó đã bị quét — các kho công khai bị dò liên tục và <code>sk_live_</code> là một tiền tố quá nổi tiếng. Vậy hãy XOAY trước, và <b>KIỂM CHỨNG</b> rằng giá trị cũ bị từ chối chứ đừng cho là thế, vì một số nhà cung cấp giữ khoá cũ sống thêm một quãng ân hạn. Rồi soi nhật ký truy cập của nhà cung cấp cho quãng từ lúc commit tới lúc xoay, vì "chúng tôi không biết nó có bị dùng không" là câu trả lời tệ hơn nhiều so với "chúng tôi đã kiểm". Rồi mới dọn lịch sử bằng <code>git filter-repo</code> để người sau không nhặt được một thông tin xác thực rồi phân vân xem nó còn sống không — và hãy chuẩn bị tinh thần là MỌI mã băm sẽ đổi và mọi pull request đang mở sẽ gãy.',
          ),
        }),

        // q6 · đáp án A
        mcq({
          prompt: B(
            'A signing key is rotated in one step: change the environment variable, restart. Measured:' +
            code('token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat') +
            'The four-phase rotation replaces that. Which phase is the one you can deploy at any time without any observable effect, and why does phase 4 have to wait?',
            'Một khoá ký được xoay trong một bước: đổi biến môi trường, khởi động lại. Đo được:' +
            code('token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat') +
            'Cú xoay bốn giai đoạn thay thế cho cách đó. Giai đoạn nào là giai đoạn bạn deploy được vào bất cứ lúc nào mà không có tác dụng quan sát được nào, và vì sao giai đoạn 4 buộc phải CHỜ?',
          ),
          options: [
            B(
              'Phase 2 — adding the new key to the ACCEPT list while still signing with the old one. Nothing is signed with it yet, so nothing changes; and phase 4 must wait out the longest token lifetime, because removing the old key before then is the naive rotation with extra steps',
              'Giai đoạn 2 — THÊM khoá mới vào danh sách CHẤP NHẬN trong khi vẫn ký bằng khoá cũ. Chưa có gì được ký bằng nó nên chẳng có gì đổi; còn giai đoạn 4 phải chờ hết vòng đời của token dài nhất, vì bỏ khoá cũ trước lúc ấy chỉ là cú xoay ngây thơ với thêm vài bước thừa',
            ),
            B(
              'Phase 3 — switching the signing key while both remain accepted. It is the only phase with no rejection path, so it can be deployed at any time; phase 4 waits because the audit log has to show a clean cut-over before the old key is revoked',
              'Giai đoạn 3 — chuyển khoá KÝ trong khi cả hai vẫn được chấp nhận. Đó là giai đoạn duy nhất không có nhánh từ chối nào nên deploy lúc nào cũng được; giai đoạn 4 chờ vì nhật ký kiểm toán phải cho thấy một lần chuyển sạch trước khi thu hồi khoá cũ',
            ),
            B(
              'Phase 1 — publishing the new key alongside the old one in a JWKS document. Clients fetch it and cache it, so the wait in phase 4 is the client cache lifetime rather than the token lifetime',
              'Giai đoạn 1 — công bố khoá mới cạnh khoá cũ trong một tài liệu JWKS. Máy khách lấy về rồi lưu đệm, nên khoảng chờ ở giai đoạn 4 là vòng đời BỘ ĐỆM của máy khách chứ không phải vòng đời token',
            ),
            B(
              'None of them is free: every phase changes the set of accepted signatures, so each one has to go out in a maintenance window; the four phases only reduce the number of users affected per window rather than removing the disruption',
              'Chẳng giai đoạn nào miễn phí cả: mỗi giai đoạn đều đổi tập chữ ký được chấp nhận, nên cái nào cũng phải ra trong một cửa sổ bảo trì; bốn giai đoạn chỉ giảm số người dùng bị ảnh hưởng mỗi cửa sổ chứ không xoá được sự gián đoạn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The mechanism is one line of design: sign with one key, accept a list. Phase 2 adds the new key to the accept list and changes nothing observable, which is what makes the rest possible — it is a deploy you can do on a Tuesday afternoon. Phase 3 is the actual switch, and at that moment both are valid, which is the whole point. Phase 4 removes the old key, and it can only happen once nothing valid is still signed with it: if sessions last seven days, phase 4 is at least seven days after phase 3. That is also the argument for short access tokens plus refresh, because phase 4 waits for your longest lifetime whether you like it or not. Two caveats worth carrying. If the key <em>leaked</em>, you do not get to wait — do phases 3 and 4 together, accept that everyone is logged out, and tell them why, because a valid session signed by a key an attacker holds is a session they can forge. And before rotating anything, grep the whole estate for the <em>value</em> rather than the variable name: the same secret is often pasted into a CI variable, a second service and a teammate\'s local file under three different names.',
            'Cơ chế chỉ là một dòng thiết kế: KÝ bằng một khoá, CHẤP NHẬN cả một danh sách. Giai đoạn 2 thêm khoá mới vào danh sách chấp nhận và không đổi gì quan sát được, và chính điều đó làm phần còn lại khả thi — đó là một lần deploy bạn làm được vào chiều thứ Ba. Giai đoạn 3 mới là cú chuyển thật, và ở khoảnh khắc ấy CẢ HAI đều hợp lệ, đó chính là toàn bộ ý nghĩa. Giai đoạn 4 bỏ khoá cũ, và nó chỉ được phép xảy ra khi không còn thứ hợp lệ nào còn mang chữ ký của khoá ấy: nếu phiên sống bảy ngày thì giai đoạn 4 phải cách giai đoạn 3 ít nhất bảy ngày. Đó cũng là lý lẽ cho việc dùng access token ngắn cộng refresh, vì giai đoạn 4 phải chờ vòng đời DÀI NHẤT của bạn dù bạn có thích hay không. Hai điều dặn thêm đáng mang theo. Nếu khoá đã LỘ thì bạn không được phép chờ — hãy làm giai đoạn 3 và 4 cùng lúc, chấp nhận rằng mọi người bị đăng xuất, và nói cho họ biết vì sao, bởi một phiên hợp lệ được ký bằng khoá mà kẻ tấn công đang giữ là một phiên chúng giả mạo được. Và trước khi xoay bất cứ thứ gì, hãy grep toàn bộ hệ thống theo GIÁ TRỊ chứ không theo tên biến: cùng một bí mật thường được dán vào một biến CI, một dịch vụ thứ hai và tệp cục bộ của một đồng nghiệp dưới ba cái tên khác nhau.',
          ),
        }),

        // q7 · đáp án C
        mcq({
          prompt: B(
            'Two <code>comm</code> pipelines are proposed as a pre-deploy check on configuration drift:' +
            code("A)  comm -23 <(grep -oE '^[A-Z_]+' .env.example | sort -u) \\\n" +
                 '            <(ssh vps "grep -oE \'^[A-Z_]+\' /srv/app/chung/.env" | sort -u)\n\n' +
                 "B)  comm -13 <(grep -oE '^[A-Z_]+' .env.example | sort -u) \\\n" +
                 '            <(ssh vps "grep -oE \'^[A-Z_]+\' /srv/app/chung/.env" | sort -u)') +
            'Which one catches the failure from Lesson 0.3 — a healthy process returning 500 to everything — and what does the other one find?',
            'Hai ống dẫn <code>comm</code> được đề xuất làm phép kiểm trước-deploy về lệch pha cấu hình:' +
            code("A)  comm -23 <(grep -oE '^[A-Z_]+' .env.example | sort -u) \\\n" +
                 '            <(ssh vps "grep -oE \'^[A-Z_]+\' /srv/app/chung/.env" | sort -u)\n\n' +
                 "B)  comm -13 <(grep -oE '^[A-Z_]+' .env.example | sort -u) \\\n" +
                 '            <(ssh vps "grep -oE \'^[A-Z_]+\' /srv/app/chung/.env" | sort -u)') +
            'Cái nào bắt được cú hỏng ở bài 0.3 — một tiến trình khoẻ mạnh trả 500 cho mọi thứ — và cái kia tìm ra cái gì?',
          ),
          options: [
            B(
              'B, because the server is the authority: anything on the server that is not in the example file is a value the deploy will overwrite, which is the mechanism by which a missing variable appears. A finds documentation debt only',
              'B, vì máy chủ mới là bên có thẩm quyền: bất cứ thứ gì trên máy chủ mà không có trong tệp mẫu đều là một giá trị mà lần deploy sẽ ghi đè, và đó chính là cơ chế làm một biến biến mất. A chỉ tìm ra nợ tài liệu',
            ),
            B(
              'Neither, because both compare names rather than values: the Lesson 0.3 failure was a variable that existed with an empty value, and a name-level diff reports it as present on both sides',
              'Chẳng cái nào, vì cả hai đều so TÊN chứ không so GIÁ TRỊ: cú hỏng ở bài 0.3 là một biến có tồn tại nhưng giá trị rỗng, và một phép so ở mức tên sẽ báo nó có mặt ở cả hai phía',
            ),
            B(
              'A, because it lists names in the example file that are missing on the server — the variable your new code needs and nobody added. B is the opposite direction and finds settings that exist only on the server, which is how a machine becomes impossible to rebuild',
              'A, vì nó liệt kê những tên CÓ trong tệp mẫu mà THIẾU trên máy chủ — đúng cái biến mà mã mới của bạn cần và chưa ai thêm vào. B là chiều ngược lại và tìm ra những thiết lập CHỈ tồn tại trên máy chủ, và đó là cách một cái máy trở nên không thể dựng lại được',
            ),
            B(
              'A, and B is redundant: a variable present on the server and absent from the example file is by definition unused, since the application can only read what its own code names',
              'A, và B là thừa: một biến có trên máy chủ mà vắng trong tệp mẫu thì theo định nghĩa là không được dùng, vì ứng dụng chỉ đọc được những gì mã của chính nó gọi tên',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>comm -23</code> suppresses columns 2 and 3, leaving lines unique to the first file — the example file — so it lists documented names the server does not have. That is the Lesson 0.3 failure caught <em>before</em> deploying rather than after: the code needs <code>R2_BUCKET</code>, nobody added it, and every request would have returned 500. <code>comm -13</code> is the other direction and it answers a slower but equally important question — which settings exist only on the server, written down nowhere. Run that one on a machine you inherited; the list is usually longer than anyone expects, and every entry is a reason the machine cannot be rebuilt from the repository. Option D is the tempting dismissal and it is wrong for a specific reason: a value only on the server may be read by a cron job, a sidecar, or a piece of code somebody removed from the example file by accident. Option B names a real limitation — this is a name-level check, so pair it with a startup validation that treats an empty required value as fatal.',
            '<code>comm -23</code> chặn cột 2 và 3, chỉ để lại những dòng chỉ có ở tệp THỨ NHẤT — tức tệp mẫu — nên nó liệt kê những cái tên đã ghi trong tài liệu mà máy chủ không có. Đó chính là cú hỏng ở bài 0.3, bị bắt TRƯỚC khi deploy chứ không phải sau: mã cần <code>R2_BUCKET</code>, chưa ai thêm vào, và mọi request lẽ ra đã trả 500. <code>comm -13</code> là chiều ngược lại và nó trả lời một câu chậm hơn nhưng quan trọng không kém — những thiết lập nào CHỈ tồn tại trên máy chủ, không được ghi lại ở đâu cả. Hãy chạy cái đó trên một cái máy bạn vừa tiếp quản; danh sách thường dài hơn ai cũng tưởng, và mỗi mục là một lý do khiến cái máy ấy không dựng lại được từ kho mã. Phương án D là kiểu gạt đi đầy cám dỗ và nó sai vì một lý do cụ thể: một giá trị chỉ có trên máy chủ có thể đang được một việc cron, một tiến trình phụ, hoặc một đoạn mã mà ai đó lỡ xoá khỏi tệp mẫu đọc tới. Phương án B gọi tên một giới hạn CÓ THẬT — đây là phép kiểm ở mức TÊN, nên hãy ghép nó với một phép kiểm lúc khởi động coi một giá trị bắt buộc mà RỖNG là lỗi chí mạng.',
          ),
        }),

        /* ── Chương 5 — cơ sở dữ liệu (8 câu) ──────────────────────────── */

        // q8 · đáp án B + D (chọn HAI)
        mcq({
          prompt: B(
            'A blue-green swap runs both versions at once for a moment. <b>Choose TWO</b> schema changes that are safe to ship on their own during that overlap, given that the previous release must keep working.',
            'Một cú tráo xanh-lam cho hai phiên bản chạy cùng lúc trong chốc lát. <b>Chọn HAI</b> thay đổi lược đồ AN TOÀN khi gửi đi một mình trong lúc chồng lấn ấy, với điều kiện bản phát hành TRƯỚC vẫn phải chạy được.',
          ),
          options: [
            B(
              'Adding a <code>NOT NULL</code> column with no default, because the constraint only applies to rows written after it exists and the old code never sees the column at all',
              'Thêm một cột <code>NOT NULL</code> không có giá trị mặc định, vì ràng buộc chỉ áp cho những dòng được ghi sau khi nó tồn tại và mã cũ thì không hề nhìn thấy cột đó',
            ),
            B(
              'Adding a nullable column — old code does not know it exists and does not select it, new code uses it, and no version breaks',
              'Thêm một cột cho phép NULL — mã cũ không biết nó tồn tại và không chọn nó, mã mới thì dùng nó, và không phiên bản nào vỡ',
            ),
            B(
              'Narrowing a type from <code>varchar(255)</code> to <code>varchar(50)</code>, since existing rows that fit are unaffected and the old code was never writing values that long in practice',
              'Thu hẹp kiểu từ <code>varchar(255)</code> xuống <code>varchar(50)</code>, vì những dòng đang có mà vừa thì không bị ảnh hưởng, và trên thực tế mã cũ chưa từng ghi giá trị dài tới thế',
            ),
            B(
              'Creating a new table or a new index — nothing that already exists refers to it, so the only cost is time and locks',
              'Tạo một bảng mới hoặc một chỉ mục mới — chẳng thứ gì đang tồn tại tham chiếu tới nó, nên cái giá duy nhất là thời gian và khoá',
            ),
            B(
              'Renaming a column, provided the rename and the new code are deployed in the same release so that the two always move together',
              'Đổi tên một cột, miễn là cú đổi tên và mã mới được deploy trong cùng một bản phát hành để hai thứ luôn đi cùng nhau',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'The rule the whole chapter follows: <b>every migration must leave the database in a state where the previous release still works</b> — not the current one, the previous one, because that is what a rollback lands on. A nullable column and a new table or index satisfy it trivially, since nothing that exists refers to them. A <code>NOT NULL</code> column without a default fails it immediately: old code inserts rows without that column and every insert breaks (<code>NOT NULL DEFAULT</code> is the safe form). Narrowing a type fails it in two ways at once — old code writes values the new rule rejects, and existing rows may already violate it, which is the failure Question 12 measures. And option E is the specific belief this chapter exists to dismantle: there is no ordering that makes an unsafe migration safe. Running it before the swap breaks the old code, after breaks the new code, and "in the same release" is not a moment — the blue-green technique is <em>defined</em> by both versions running at once, which is exactly the condition under which a rename breaks the old one.',
            'Quy tắc mà cả chương này đi theo: <b>mọi migration phải để lại một cơ sở dữ liệu mà bản phát hành TRƯỚC vẫn chạy được</b> — không phải bản hiện tại, mà bản TRƯỚC, vì đó mới là chỗ một cú lùi bản đáp xuống. Một cột cho phép NULL và một bảng hay chỉ mục mới thoả điều đó một cách hiển nhiên, vì chẳng có gì đang tồn tại tham chiếu tới chúng. Một cột <code>NOT NULL</code> không mặc định thì trượt ngay: mã cũ chèn dòng mà không có cột ấy nên mọi lệnh chèn đều hỏng (<code>NOT NULL DEFAULT</code> mới là dạng an toàn). Thu hẹp kiểu thì trượt theo hai đường cùng lúc — mã cũ ghi những giá trị mà luật mới từ chối, VÀ những dòng đang có sẵn có thể đã vi phạm nó rồi, đúng cú hỏng mà câu 12 đo. Còn phương án E chính là niềm tin mà chương này sinh ra để tháo dỡ: KHÔNG có thứ tự nào làm cho một migration không an toàn trở nên an toàn. Chạy trước bước tráo thì vỡ mã cũ, chạy sau thì vỡ mã mới, còn "trong cùng một bản phát hành" thì không phải một KHOẢNH KHẮC — kỹ thuật xanh-lam được ĐỊNH NGHĨA bằng việc hai phiên bản cùng chạy một lúc, và đó đúng là điều kiện làm cú đổi tên phá vỡ bản cũ.',
          ),
        }),

        // q9 · đáp án A
        mcq({
          prompt: B(
            'Phase 2 of an expand-and-contract rename, measured on PostgreSQL 16.14 with a 200,000-row table. The migration adds <code>dia_chi_email</code>, copies <code>email</code> into it, and installs a <code>BEFORE INSERT OR UPDATE</code> trigger that fills whichever of the two is null:' +
            code("insert into nd(ten,email)          values ('ma-cu','cu@x.com');\n" +
                 '  ten   | email    | dia_chi_email\n' +
                 '  ma-cu | cu@x.com | cu@x.com\n\n' +
                 "insert into nd(ten,dia_chi_email)  values ('ma-moi','moi@x.com');\n" +
                 '  ten    | email     | dia_chi_email\n' +
                 '  ma-moi | moi@x.com | moi@x.com') +
            'Why is a trigger the right mechanism here rather than double-writing in the application?',
            'Giai đoạn 2 của một cú đổi tên theo lối mở-rộng-rồi-thu-hẹp, đo trên PostgreSQL 16.14 với một bảng 200.000 dòng. Migration thêm cột <code>dia_chi_email</code>, chép <code>email</code> sang, rồi cài một trigger <code>BEFORE INSERT OR UPDATE</code> điền vào cột nào đang null:' +
            code("insert into nd(ten,email)          values ('ma-cu','cu@x.com');\n" +
                 '  ten   | email    | dia_chi_email\n' +
                 '  ma-cu | cu@x.com | cu@x.com\n\n' +
                 "insert into nd(ten,dia_chi_email)  values ('ma-moi','moi@x.com');\n" +
                 '  ten    | email     | dia_chi_email\n' +
                 '  ma-moi | moi@x.com | moi@x.com') +
            'Vì sao một trigger mới là cơ chế đúng ở đây, thay vì cho ứng dụng ghi hai lần?',
          ),
          options: [
            B(
              'Because the overlap has to work in BOTH directions, and application-level double-writing only covers the version that has it — the other version\'s writes are still missed. The transcript is the proof: a row written the old way and a row written the new way are both complete',
              'Vì lúc chồng lấn phải chạy được theo CẢ HAI CHIỀU, mà ghi-hai-lần ở tầng ứng dụng thì chỉ phủ được phiên bản CÓ đoạn mã ấy — những lần ghi của phiên bản kia vẫn bị bỏ sót. Đoạn terminal là bằng chứng: một dòng ghi theo lối cũ và một dòng ghi theo lối mới đều đầy đủ cả hai cột',
            ),
            B(
              'Because a trigger runs inside the same transaction as the write, while application double-writing needs two round trips and can leave the two columns inconsistent if the process is killed between them',
              'Vì trigger chạy TRONG CÙNG giao dịch với lệnh ghi, còn ghi hai lần ở ứng dụng cần hai lượt đi-về và có thể để hai cột lệch nhau nếu tiến trình bị giết giữa chừng',
            ),
            B(
              'Because <code>BEFORE</code> triggers are cheaper than an extra <code>UPDATE</code> statement: PostgreSQL applies them during the tuple construction, so the row is written once rather than twice, which halves the WAL volume during the overlap',
              'Vì trigger <code>BEFORE</code> rẻ hơn một câu <code>UPDATE</code> thêm: PostgreSQL áp chúng ngay lúc dựng tuple, nên dòng chỉ được ghi một lần thay vì hai, và điều đó giảm một nửa khối lượng WAL trong lúc chồng lấn',
            ),
            B(
              'Because double-writing in the application would require deploying new code, and phase 2 is defined as a schema change with no code change — a trigger is the only way to keep that property, though it costs correctness at the edges',
              'Vì ghi hai lần ở ứng dụng thì phải deploy mã mới, mà giai đoạn 2 được định nghĩa là một thay đổi lược đồ KHÔNG kèm thay đổi mã — trigger là cách duy nhất giữ được tính chất ấy, dù nó phải trả giá bằng tính đúng đắn ở các ca biên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, both directions, on a real PostgreSQL. Phase 2 is a schema change with no code change: old code keeps working because nothing it uses was touched, and new code would already work if it were deployed. The trigger is what makes the overlap safe symmetrically — without it, old code writing to <code>email</code> leaves <code>dia_chi_email</code> null and new code sees a row with no address, which is a data bug rather than an error. Option B is true and is the smaller half of the argument; option D gets the causality backwards but lands on a real property (phase 2 genuinely is schema-only, and that is why it can ship at any time). The trap that goes with this phase is the copy: <code>update … set x = y</code> across a large table takes a long lock and writes a new version of every row. Batch it, and let the trigger handle everything written while the backfill runs.',
            'Đã đo, cả hai chiều, trên một PostgreSQL thật. Giai đoạn 2 là một thay đổi lược đồ KHÔNG kèm thay đổi mã: mã cũ vẫn chạy vì chẳng thứ gì nó dùng bị đụng tới, còn mã mới thì đã chạy được sẵn nếu được deploy. Trigger chính là thứ làm cho quãng chồng lấn an toàn ĐỐI XỨNG — không có nó thì mã cũ ghi vào <code>email</code> sẽ để <code>dia_chi_email</code> null và mã mới nhìn thấy một dòng không có địa chỉ, tức là một lỗi DỮ LIỆU chứ không phải một lỗi báo ra. Phương án B đúng và là nửa nhỏ hơn của lập luận; phương án D đảo ngược quan hệ nhân quả nhưng lại đáp trúng một tính chất có thật (giai đoạn 2 đúng là chỉ-lược-đồ, và chính vì thế nó gửi đi lúc nào cũng được). Cái bẫy đi kèm giai đoạn này là bước CHÉP: <code>update … set x = y</code> trên một bảng lớn giữ khoá lâu và ghi lại một phiên bản mới cho MỌI dòng. Hãy chia lô, và để trigger lo phần được ghi vào trong lúc lượt nạp bù đang chạy.',
          ),
        }),

        // q10 · đáp án C
        mcq({
          prompt: B(
            'A migration file starts with these two lines:' +
            code("SET lock_timeout = '3s';\n" +
                 'ALTER TABLE lon ADD COLUMN moi text;'),
            'A colleague argues the first line is pointless because the <code>ALTER</code> itself is metadata-only and finishes in milliseconds. What is the counter-argument?',
            'Một tệp migration mở đầu bằng hai dòng này:' +
            code("SET lock_timeout = '3s';\n" +
                 'ALTER TABLE lon ADD COLUMN moi text;'),
            'Một đồng nghiệp lập luận rằng dòng đầu là vô ích vì bản thân lệnh <code>ALTER</code> chỉ đụng siêu dữ liệu và xong trong vài mili giây. Lập luận phản bác là gì?',
          ),
          options: [
            B(
              'That <code>lock_timeout</code> does not apply to DDL at all: it bounds how long a statement waits for a row lock, while <code>ALTER TABLE</code> takes a table lock, so the correct directive here is <code>statement_timeout</code>',
              'Rằng <code>lock_timeout</code> chẳng áp cho DDL: nó giới hạn thời gian một câu lệnh chờ một khoá DÒNG, còn <code>ALTER TABLE</code> lấy khoá BẢNG, nên chỉ thị đúng ở đây là <code>statement_timeout</code>',
            ),
            B(
              'That the line is indeed pointless for this statement and is only worth adding to the statements that rewrite the table — a volatile default, an <code>ALTER COLUMN TYPE</code>, a <code>SET NOT NULL</code> on a large table',
              'Rằng dòng ấy đúng là vô ích với câu lệnh này và chỉ đáng thêm vào những câu lệnh có VIẾT LẠI bảng — một giá trị mặc định biến thiên, một lệnh <code>ALTER COLUMN TYPE</code>, một lệnh <code>SET NOT NULL</code> trên bảng lớn',
            ),
            B(
              'That how long the statement <em>runs</em> is not the question: <code>ALTER TABLE</code> takes an <code>ACCESS EXCLUSIVE</code> lock, so it must first WAIT for existing transactions on the table to finish — and while it waits, every new query queues behind it. One long-running <code>SELECT</code> turns a millisecond migration into a total stall',
              'Rằng câu lệnh CHẠY bao lâu không phải là câu hỏi: <code>ALTER TABLE</code> lấy khoá <code>ACCESS EXCLUSIVE</code>, nên nó phải CHỜ các giao dịch đang mở trên bảng ấy kết thúc đã — và trong lúc nó chờ, MỌI truy vấn mới đều xếp hàng phía sau nó. Chỉ một lệnh <code>SELECT</code> chạy lâu là biến một migration mili-giây thành một cú nghẽn toàn bộ',
            ),
            B(
              'That the timeout protects the <em>application</em> rather than the migration: with it set, queries blocked behind the <code>ALTER</code> fail fast instead of piling up, so the connection pool does not fill during the wait',
              'Rằng cái hạn giờ bảo vệ ỨNG DỤNG chứ không bảo vệ migration: đặt nó vào thì các truy vấn bị chặn sau lệnh <code>ALTER</code> sẽ hỏng nhanh thay vì chất đống, nên bể kết nối không bị đầy trong lúc chờ',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>lock_timeout</code> is the single most valuable line in a migration file, and the reason is the queue rather than the statement. <code>ACCESS EXCLUSIVE</code> conflicts with <em>everything</em> — including <code>SELECT</code> — and it is requested at the start of the statement. If an idle-in-transaction connection from a crashed job, or a report somebody is running, is holding the table, the <code>ALTER</code> waits; and every query that arrives while it waits queues behind the <code>ALTER</code>. That is the "the site went down and the migration had not even started" incident. With the timeout, the migration fails after three seconds, nothing is blocked for longer than that, and you retry once the long transaction has finished. Option D describes what you might wish happened and is not the mechanism: the blocked queries are waiting on the <code>ALTER</code>\'s lock request, and their own timeouts (or <code>statement_timeout</code>) are what bound them. The check to run first is one query: <code>select pid, now()-xact_start, left(query,60) from pg_stat_activity where now()-xact_start &gt; interval &#39;30 seconds&#39;</code>.',
            '<code>lock_timeout</code> là dòng đáng giá nhất trong một tệp migration, và lý do nằm ở CÁI HÀNG ĐỢI chứ không ở câu lệnh. Khoá <code>ACCESS EXCLUSIVE</code> xung đột với MỌI THỨ — kể cả <code>SELECT</code> — và nó được xin ngay từ đầu câu lệnh. Nếu một kết nối đang treo giữa giao dịch từ một việc đã sập, hay một báo cáo ai đó đang chạy, đang giữ cái bảng ấy, thì lệnh <code>ALTER</code> phải CHỜ; và mọi truy vấn tới trong lúc nó chờ đều xếp hàng phía sau nó. Đó chính là sự cố "web sập mà migration còn chưa kịp bắt đầu". Có hạn giờ thì migration hỏng sau ba giây, không gì bị chặn lâu hơn thế, và bạn thử lại khi giao dịch dài kia đã xong. Phương án D mô tả điều bạn có thể MONG là như vậy chứ không phải cơ chế: các truy vấn bị chặn đang chờ trên chính lời XIN KHOÁ của lệnh <code>ALTER</code>, còn thứ giới hạn chúng là hạn giờ của chính chúng (hoặc <code>statement_timeout</code>). Phép kiểm phải chạy TRƯỚC chỉ là một truy vấn: <code>select pid, now()-xact_start, left(query,60) from pg_stat_activity where now()-xact_start &gt; interval &#39;30 seconds&#39;</code>.',
          ),
        }),

        // q11 · đáp án B
        mcq({
          prompt: B(
            'A migration has to make an existing column <code>NOT NULL</code> on a large, busy table. Two forms:' +
            code('A)  ALTER TABLE t ALTER COLUMN c SET NOT NULL;\n\n' +
                 'B)  ALTER TABLE t ADD CONSTRAINT c_khong_null\n' +
                 '      CHECK (c IS NOT NULL) NOT VALID;\n' +
                 '    ALTER TABLE t VALIDATE CONSTRAINT c_khong_null;'),
            'Why is B the shape to reach for, and what has to be true before either one is run at all?',
            'Một migration phải làm cho một cột đang có trở thành <code>NOT NULL</code> trên một bảng lớn và đang bận. Hai dạng:' +
            code('A)  ALTER TABLE t ALTER COLUMN c SET NOT NULL;\n\n' +
                 'B)  ALTER TABLE t ADD CONSTRAINT c_khong_null\n' +
                 '      CHECK (c IS NOT NULL) NOT VALID;\n' +
                 '    ALTER TABLE t VALIDATE CONSTRAINT c_khong_null;'),
            'Vì sao B mới là dạng nên với tới, và điều gì phải đúng TRƯỚC khi chạy bất kỳ dạng nào?',
          ),
          options: [
            B(
              'B is faster because a <code>CHECK</code> constraint is never enforced on existing rows, so the second statement is a no-op that exists only to record intent; and the precondition is that the column has a default so old inserts cannot produce a null',
              'B nhanh hơn vì một ràng buộc <code>CHECK</code> không bao giờ được áp lên các dòng đang có, nên câu lệnh thứ hai chỉ là một lệnh rỗng ghi lại ý định; và điều kiện tiên quyết là cột phải có giá trị mặc định để mã cũ chèn vào không sinh ra null',
            ),
            B(
              'B splits one long lock into a short one plus a scan under a weaker lock: <code>NOT VALID</code> is instant and applies to new rows, then <code>VALIDATE</code> checks the existing ones without blocking reads and writes the way A does. The precondition is that no code still writes nulls into that column — otherwise the deploy that adds the constraint breaks the previous release',
              'B tách một cú khoá dài thành một cú khoá ngắn cộng một lượt quét dưới khoá NHẸ HƠN: <code>NOT VALID</code> là tức thì và áp cho các dòng MỚI, rồi <code>VALIDATE</code> mới soát các dòng cũ mà không chặn đọc-ghi như A. Điều kiện tiên quyết là KHÔNG còn đoạn mã nào ghi null vào cột ấy — nếu không thì chính lần deploy thêm ràng buộc sẽ phá vỡ bản phát hành trước',
            ),
            B(
              'B is required because <code>SET NOT NULL</code> rewrites the table while a <code>CHECK</code> constraint does not, so on a large table the difference is minutes against milliseconds; the precondition is a <code>VACUUM FULL</code> beforehand, so the scan in the second statement has no dead tuples to walk and finishes in a predictable time',
              'B là bắt buộc vì <code>SET NOT NULL</code> VIẾT LẠI cả bảng còn ràng buộc <code>CHECK</code> thì không, nên trên một bảng lớn thì khác biệt là hàng phút so với hàng mili giây; điều kiện tiên quyết là chạy <code>VACUUM FULL</code> trước, để lượt quét ở câu lệnh thứ hai không phải đi qua tuple chết nào và kết thúc trong một khoảng thời gian đoán được',
            ),
            B(
              'They are equivalent and A is preferable for being one statement; the precondition for both is a <code>lock_timeout</code>, and beyond that the choice is a matter of taste rather than of behaviour',
              'Hai dạng tương đương và A hay hơn vì chỉ một câu lệnh; điều kiện tiên quyết cho cả hai là một <code>lock_timeout</code>, ngoài ra thì chọn cái nào là chuyện gu chứ không phải chuyện hành vi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The two-step form is the general pattern for adding a constraint to a table with data in it: instant now, scan later, and the scan happens under a lock that does not stop the application. Option A is not a table rewrite in modern PostgreSQL, but it does hold <code>ACCESS EXCLUSIVE</code> for the length of a full scan, which on real data is the outage. The precondition is the one people skip and it is the same in both directions: a constraint migration should never be the thing that <em>discovers</em> your data is inconsistent. Run the equivalent <code>select … where c is null</code> against production first — and note that "no nulls today" is not enough on its own, because the previous release is still running during the overlap and a rollback puts it back in front of the new schema. Adding the constraint is the contract phase; the expand phase is deploying code that always supplies a value, and the gap between them is your rollback distance.',
            'Dạng hai bước là khuôn mẫu chung để thêm một ràng buộc vào một bảng ĐÃ CÓ dữ liệu: tức thì ngay bây giờ, quét sau, và lượt quét ấy diễn ra dưới một cái khoá không chặn ứng dụng. Phương án A trên PostgreSQL hiện đại không viết lại bảng, nhưng nó GIỮ <code>ACCESS EXCLUSIVE</code> suốt độ dài một lượt quét toàn bảng, mà trên dữ liệu thật thì đó chính là sự cố. Điều kiện tiên quyết là thứ người ta hay bỏ qua và nó giống nhau ở cả hai chiều: một migration thêm ràng buộc KHÔNG BAO GIỜ được là thứ PHÁT HIỆN RA rằng dữ liệu của bạn không nhất quán. Hãy chạy câu <code>select … where c is null</code> tương ứng trên production trước — và để ý rằng "hôm nay không có null" tự nó chưa đủ, vì bản phát hành TRƯỚC vẫn đang chạy trong quãng chồng lấn và một cú lùi bản sẽ đặt nó trở lại trước cái lược đồ mới. Thêm ràng buộc là giai đoạn THU HẸP; giai đoạn MỞ RỘNG là deploy đoạn mã luôn cấp đủ giá trị, và khoảng cách giữa hai giai đoạn chính là khoảng lùi của bạn.',
          ),
        }),

        // q12 · đáp án D
        mcq({
          prompt: B(
            'A production deploy is refusing to run. The migration tool reports the previous migration as started and not finished, and will neither run the next one nor re-run this one. Four proposed first moves:' +
            code('A) npx prisma migrate resolve --applied <ten>\n' +
                 'B) npx prisma migrate resolve --rolled-back <ten>\n' +
                 'C) sua lai migration thanh CREATE TABLE IF NOT EXISTS roi chay lai\n' +
                 'D) doc migration TUNG CAU LENH mot, doi chieu tung cau voi luoc do\n' +
                 '   dang song: bang co ton tai khong, cot co khong, rang buoc co\n' +
                 '   khong, chi muc co hop le khong') +
            'Which is the correct first move, and what makes the other three dangerous rather than merely premature?',
            'Một lần deploy lên production đang bị từ chối. Công cụ migration báo migration trước đó là "đã bắt đầu và chưa xong", và nó vừa không chạy cái kế tiếp vừa không chạy lại cái này. Bốn nước cờ đầu tiên được đề xuất:' +
            code('A) npx prisma migrate resolve --applied <ten>\n' +
                 'B) npx prisma migrate resolve --rolled-back <ten>\n' +
                 'C) sua lai migration thanh CREATE TABLE IF NOT EXISTS roi chay lai\n' +
                 'D) doc migration TUNG CAU LENH mot, doi chieu tung cau voi luoc do\n' +
                 '   dang song: bang co ton tai khong, cot co khong, rang buoc co\n' +
                 '   khong, chi muc co hop le khong') +
            'Nước cờ đầu tiên ĐÚNG là gì, và điều gì làm ba nước còn lại NGUY HIỂM chứ không chỉ là VỘI VÀNG?',
          ),
          options: [
            B(
              'B, because marking it rolled back is the only reversible option: it restores the ledger to a state the tool can act on without asserting anything about the schema, and D can then be done at leisure once deploys are unblocked',
              'B, vì đánh dấu là đã-lùi-lại là lựa chọn HOÀN TÁC ĐƯỢC duy nhất: nó đưa cuốn sổ về một trạng thái mà công cụ hành động được, mà không khẳng định gì về lược đồ, và sau đó cứ thong thả làm D khi các lần deploy đã được khơi thông',
            ),
            B(
              'C, because an idempotent migration is a good property in its own right and rewriting it fixes both this incident and the next one; A and B are dangerous because they change the ledger, and D is a diagnosis rather than a move',
              'C, vì một migration chạy lại được vốn dĩ là một tính chất tốt và viết lại nó vừa chữa sự cố này vừa chữa sự cố sau; A và B nguy hiểm vì chúng ĐỔI cuốn sổ, còn D là một cuộc chẩn đoán chứ không phải một nước cờ',
            ),
            B(
              'A, because the deploy is blocked and the tool only needs the ledger to be consistent; the schema is by definition whatever it is, and the next migration will fail loudly if it disagrees, which is a safer place to discover the problem',
              'A, vì lần deploy đang bị chặn và công cụ chỉ cần cuốn sổ NHẤT QUÁN là đủ; lược đồ thì theo định nghĩa là như nó đang là, và migration kế tiếp sẽ hỏng ỒN ÀO nếu nó không khớp, mà đó là một chỗ an toàn hơn để phát hiện vấn đề',
            ),
            B(
              'D. A and B both ASSERT something about the schema you have not established, and C makes the immediate error go away while leaving the schema permanently inconsistent with the migration history. <code>resolve</code> is the right tool AFTER you know which of the two is true — the instruction is against running it before you know',
              'D. Cả A và B đều KHẲNG ĐỊNH một điều về lược đồ mà bạn chưa hề xác lập, còn C thì làm cái lỗi trước mắt biến mất trong khi để lại một lược đồ lệch VĨNH VIỄN với lịch sử migration. <code>resolve</code> là công cụ ĐÚNG — SAU KHI bạn đã biết trong hai khả năng thì cái nào là thật; lời dặn là chống lại việc chạy nó TRƯỚC khi biết',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the one place in the whole course where the right move is to stop and ask somebody, and the reason is that the ledger and the schema can disagree in a way nothing later will notice. Reading the migration statement by statement against the live schema is the step people skip, and it is the only one that makes the rest safe: once you know how far it got, you either apply the remaining statements by hand and mark it applied, or undo the few that landed and mark it rolled back. Either is fine; guessing which state you are in is not. Then verify against the schema rather than against the ledger — <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> prints the difference between what the history says and what the database is, and empty output means they agree. That check is what catches an incomplete recovery: a ledger that says "applied" and a schema missing a constraint will deploy cleanly today and fail in three weeks when a later migration assumes the constraint exists. Two habits prevent the whole situation: wrap migrations in a transaction unless you cannot, and put one logical change in each file, so a failure is isolated to the thing that failed rather than leaving a table created, rows inserted and a constraint missing.',
            'Đây là chỗ DUY NHẤT trong cả khoá mà nước cờ đúng là DỪNG LẠI VÀ HỎI NGƯỜI KHÁC, và lý do là cuốn sổ với lược đồ có thể bất đồng theo một kiểu mà không thứ gì về sau nhận ra. Đọc migration TỪNG CÂU LỆNH một rồi đối chiếu với lược đồ đang sống là bước người ta hay bỏ, và nó là bước duy nhất làm cho phần còn lại trở nên an toàn: một khi đã biết nó đi được tới đâu, bạn hoặc áp nốt các câu lệnh còn lại bằng tay rồi đánh dấu là đã áp, hoặc hoàn tác vài câu đã rơi xuống rồi đánh dấu là đã lùi. Cách nào cũng được; ĐOÁN xem mình đang ở trạng thái nào thì không. Rồi hãy kiểm chứng với LƯỢC ĐỒ chứ không phải với cuốn sổ — <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> in ra khác biệt giữa thứ lịch sử NÓI và thứ cơ sở dữ liệu ĐANG LÀ, và đầu ra rỗng nghĩa là hai bên khớp. Chính phép kiểm ấy bắt được một cuộc cứu hộ làm dở: một cuốn sổ ghi "đã áp" cùng một lược đồ thiếu ràng buộc sẽ deploy sạch sẽ hôm nay và hỏng sau ba tuần, khi một migration về sau cho rằng cái ràng buộc ấy có tồn tại. Hai thói quen ngăn được cả tình huống này: bọc migration trong một giao dịch trừ khi không thể, và mỗi tệp một thay đổi logic, để một cú hỏng chỉ gói trong đúng thứ đã hỏng thay vì để lại một cái bảng đã tạo, mấy dòng đã chèn, và một ràng buộc thì không có.',
          ),
        }),

        // q13 · đáp án A
        mcq({
          prompt: B(
            'The identical three-statement migration, wrapped in <code>BEGIN</code> / <code>COMMIT</code>. Measured on the same PostgreSQL 16.14:' +
            code('psql:/tmp/m001t.sql:4: ERROR:  could not create unique index "uq_ma"\n' +
                 'DETAIL:  Key (ma)=(A) is duplicated.\n' +
                 '--- trang thai sau khi hong ---\n' +
                 'bang don_hang co ton tai khong: 0\n' +
                 '→ KHONG con dau vet nao') +
            'A colleague concludes that wrapping every migration in a transaction removes the problem entirely. Where does that rule break, and what is the practical consequence?',
            'Vẫn migration ba câu lệnh ấy, bọc trong <code>BEGIN</code> / <code>COMMIT</code>. Đo trên cùng PostgreSQL 16.14:' +
            code('psql:/tmp/m001t.sql:4: ERROR:  could not create unique index "uq_ma"\n' +
                 'DETAIL:  Key (ma)=(A) is duplicated.\n' +
                 '--- trang thai sau khi hong ---\n' +
                 'bang don_hang co ton tai khong: 0\n' +
                 '→ KHONG con dau vet nao') +
            'Một đồng nghiệp kết luận rằng cứ bọc mọi migration trong một giao dịch là xoá sạch vấn đề. Quy tắc ấy gãy ở đâu, và hệ quả thực tế là gì?',
          ),
          options: [
            B(
              'It breaks on the statements that cannot run inside a transaction block — <code>CREATE INDEX CONCURRENTLY</code> and <code>CREATE DATABASE</code> both refuse. So the very statement recommended for avoiding write locks is the one that cannot be made atomic: put it in its own file, alone, and make that file idempotent',
              'Nó gãy ở những câu lệnh KHÔNG chạy được bên trong một khối giao dịch — <code>CREATE INDEX CONCURRENTLY</code> và <code>CREATE DATABASE</code> đều từ chối. Nên chính câu lệnh được khuyên dùng để tránh khoá ghi lại là câu KHÔNG thể làm cho nguyên tử: hãy đặt nó vào một tệp riêng, đứng một mình, và làm cho tệp ấy chạy lại được',
            ),
            B(
              'It breaks on large tables, because a transaction holding DDL locks for minutes is worse than a half-applied migration; above a few hundred thousand rows the statements should be committed one at a time on purpose',
              'Nó gãy trên các bảng lớn, vì một giao dịch giữ khoá DDL hàng phút còn tệ hơn một migration áp nửa vời; trên vài trăm nghìn dòng thì nên chủ ý commit từng câu lệnh một',
            ),
            B(
              'It breaks because PostgreSQL commits DDL implicitly like MySQL does once the statement count exceeds the transaction buffer, so a long migration silently loses its atomicity partway through',
              'Nó gãy vì PostgreSQL sẽ commit DDL ngầm giống MySQL một khi số câu lệnh vượt bộ đệm giao dịch, nên một migration dài âm thầm mất tính nguyên tử ở giữa chừng',
            ),
            B(
              'It does not break — the rule is sound, and the only caveat is that the migration tool must be configured to wrap each FILE rather than each statement, which most of them already do by default',
              'Nó không gãy — quy tắc ấy vững, và điều dặn duy nhất là công cụ migration phải được cấu hình để bọc mỗi TỆP chứ không phải mỗi câu lệnh, mà hầu hết chúng vốn đã làm vậy sẵn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Transactional DDL is a genuine PostgreSQL advantage — <code>CREATE TABLE</code> and <code>ALTER TABLE</code> roll back like any other statement, so the identical failure left nothing behind and the migration can be corrected and re-run immediately. MySQL commits most DDL implicitly, which is why the half-applied state is unavoidable there. The two exceptions matter precisely because migrations use them: <code>CREATE INDEX CONCURRENTLY</code> is the recommended way to build an index without blocking writes, and it refuses to run inside a transaction block. So that statement gets its own file with nothing else in it, and that file has to be safe to re-run — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, plus a check for the <code>INVALID</code> index a failed concurrent build leaves behind (<code>select indexrelid::regclass from pg_index where not indisvalid</code>, then <code>drop index concurrently</code>). Two habits that go with this: one logical change per file, so a failure is isolated to the thing that failed; and run migrations against a copy of production rather than an empty test database, because the failure above only exists because of the data.',
            'DDL trong giao dịch là một lợi thế THẬT của PostgreSQL — <code>CREATE TABLE</code> và <code>ALTER TABLE</code> lùi lại được như mọi câu lệnh khác, nên cùng một cú hỏng ấy không để lại dấu vết nào và migration sửa xong là chạy lại được ngay. MySQL commit ngầm phần lớn DDL, và vì thế trạng thái áp-nửa-vời ở đó là không tránh khỏi. Hai ngoại lệ kia quan trọng đúng vì migration hay dùng tới chúng: <code>CREATE INDEX CONCURRENTLY</code> là cách được khuyên để dựng chỉ mục mà không chặn ghi, và nó TỪ CHỐI chạy bên trong một khối giao dịch. Nên câu lệnh ấy phải có một tệp riêng không kèm gì khác, và tệp ấy phải an toàn khi chạy lại — <code>CREATE INDEX CONCURRENTLY IF NOT EXISTS</code>, cộng thêm một phép kiểm cho cái chỉ mục <code>INVALID</code> mà một lượt dựng concurrent hỏng để lại (<code>select indexrelid::regclass from pg_index where not indisvalid</code>, rồi <code>drop index concurrently</code>). Hai thói quen đi kèm: mỗi tệp một thay đổi logic, để một cú hỏng chỉ gói trong đúng thứ đã hỏng; và chạy migration trên một BẢN SAO của production chứ không phải một cơ sở dữ liệu thử rỗng, vì cú hỏng ở trên chỉ tồn tại NHỜ dữ liệu.',
          ),
        }),

        // q14 · đáp án C
        mcq({
          prompt: B(
            'Backfilling 300,000 rows, two ways (numbers from the course):' +
            code('A) lap MOT PHAT   → 1218 ms, mot giao dich duy nhat, bang phinh 41 MB\n' +
                 'B) lap theo LO    → 3065 ms, 30 lo, moi lo ~102 ms, moi lo mot giao dich') +
            'B is two and a half times slower in total and is the correct choice. Which pair of numbers is the comparison that matters?',
            'Lấp 300.000 dòng theo hai cách (số lấy từ giáo trình):' +
            code('A) lap MOT PHAT   → 1218 ms, mot giao dich duy nhat, bang phinh 41 MB\n' +
                 'B) lap theo LO    → 3065 ms, 30 lo, moi lo ~102 ms, moi lo mot giao dich') +
            'B chậm hơn gấp hai lần rưỡi về tổng thời gian và lại là lựa chọn ĐÚNG. Cặp số nào mới là phép so có ý nghĩa?',
          ),
          options: [
            B(
              '3,065 against 41 MB — the batched form writes the same number of row versions but spreads them out, so <code>VACUUM</code> can reclaim each batch while the next one runs and the table never doubles',
              '3.065 với 41 MB — dạng chia lô ghi ra CÙNG số phiên bản dòng nhưng rải chúng ra, nên <code>VACUUM</code> thu hồi được từng lô trong lúc lô sau chạy và cái bảng không bao giờ phình gấp đôi',
            ),
            B(
              '1,218 against 3,065 — and the right reading is that the single statement wins on every axis except restartability, so batching is a trade you make only when you expect to be interrupted',
              '1.218 với 3.065 — và cách đọc đúng là câu lệnh đơn thắng trên mọi trục TRỪ khả năng chạy lại, nên chia lô là một đánh đổi bạn chỉ chọn khi lường trước là sẽ bị ngắt',
            ),
            B(
              '1,218 against 102 — total time is what you pay and longest lock is what your users feel. The single statement holds row locks and an open transaction for its entire duration; the batched one holds them for a tenth of a second at a time and is completely free in between',
              '1.218 với 102 — TỔNG thời gian là thứ BẠN trả, còn KHOÁ DÀI NHẤT mới là thứ NGƯỜI DÙNG cảm thấy. Câu lệnh đơn giữ khoá dòng và một giao dịch mở suốt cả thời gian nó chạy; dạng chia lô giữ chúng mỗi lần một phần mười giây và hoàn toàn rảnh ở giữa các lô',
            ),
            B(
              '30 against 1 — the number of transactions is the whole story, because each commit forces a WAL flush, and thirty flushes is what the extra 1.8 seconds buys you in durability',
              '30 với 1 — số GIAO DỊCH mới là toàn bộ câu chuyện, vì mỗi lần commit ép một lần xả WAL, và ba mươi lần xả chính là thứ 1,8 giây thêm ra mua được về mặt bền vững',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A long transaction is expensive in two ways that neither number on the left captures. It holds locks on every row it has touched, and it prevents <code>VACUUM</code> from cleaning up <em>anywhere in the database</em> — so a twenty-minute backfill degrades tables it never mentions. Option A gets the second half backwards: the bloat is caused by writing a new row version per updated row, which both forms do; batching helps because the vacuum horizon advances between batches rather than because fewer versions are written. Two properties come free with the batched form and are worth as much as the lock figure: it can be interrupted safely — kill the single statement at 90% and all of it rolls back, kill the batched one and 90% is committed, so restarting picks up where it stopped because it selects rows that are still null — and it can be paused, which makes it something you can run during business hours. The clause that makes it safe alongside live traffic is <code>for update skip locked</code>: without it, a batch that hits a row locked by a user\'s transaction waits for that transaction and the backfill stalls behind ordinary traffic. And none of this belongs inside the deploy script — a thirty-minute backfill there is a thirty-minute deploy holding the deploy lock.',
            'Một giao dịch dài đắt theo hai cách mà không con số nào ở vế trái nắm bắt được. Nó giữ khoá trên MỌI dòng nó đã chạm tới, và nó ngăn <code>VACUUM</code> dọn dẹp Ở BẤT CỨ ĐÂU TRONG CƠ SỞ DỮ LIỆU — nên một lượt lấp hai mươi phút làm xuống cấp cả những bảng nó không hề nhắc tên. Phương án A hiểu ngược nửa sau: cái phình lên là do ghi một phiên bản dòng mới cho mỗi dòng được cập nhật, và cả hai dạng đều làm thế; chia lô có ích vì chân trời vacuum tiến lên được GIỮA các lô, chứ không phải vì ghi ít phiên bản hơn. Hai tính chất đi kèm miễn phí với dạng chia lô và đáng giá ngang con số khoá: nó NGẮT ĐƯỢC an toàn — giết câu lệnh đơn ở 90% thì toàn bộ lùi lại hết, giết dạng chia lô thì 90% đã chốt, nên chạy lại là tiếp tục từ chỗ dừng vì nó chọn những dòng CÒN null — và nó TẠM DỪNG ĐƯỢC, khiến nó thành thứ bạn chạy được trong giờ hành chính. Mệnh đề làm nó an toàn khi chạy cạnh lưu lượng thật là <code>for update skip locked</code>: thiếu nó thì một lô đụng phải một dòng đang bị giao dịch của người dùng khoá sẽ CHỜ giao dịch ấy, và lượt lấp mắc kẹt sau lưu lượng thường ngày. Và chẳng phần nào trong chuyện này thuộc về bên trong script deploy — một lượt lấp ba mươi phút nằm ở đó là một lần deploy ba mươi phút ôm khư khư cái khoá deploy.',
          ),
        }),

        // q15 · đáp án B
        mcq({
          prompt: B(
            'Where the migration step sits in a deploy script:' +
            code('exec 9>/var/lock/trao.lock; flock -w 30 9\n\n' +
                 'cd "$BAN_MOI"\n' +
                 'if ! timeout 300 npx prisma migrate deploy; then\n' +
                 '  echo "migration HONG — khong trao, ma cu van dang chay" >&2\n' +
                 '  exit 1\n' +
                 'fi\n\n' +
                 '<khoi dong ban moi> && <cho san sang> && <chuyen luu luong> && <kiem> && <dung ban cu>'),
            'What is the <code>timeout 300</code> protecting, given that the migration would eventually finish or fail on its own?',
            'Vị trí của bước migration trong một script deploy:' +
            code('exec 9>/var/lock/trao.lock; flock -w 30 9\n\n' +
                 'cd "$BAN_MOI"\n' +
                 'if ! timeout 300 npx prisma migrate deploy; then\n' +
                 '  echo "migration HONG — khong trao, ma cu van dang chay" >&2\n' +
                 '  exit 1\n' +
                 'fi\n\n' +
                 '<khoi dong ban moi> && <cho san sang> && <chuyen luu luong> && <kiem> && <dung ban cu>'),
            '<code>timeout 300</code> đang bảo vệ cái gì, biết rằng đằng nào migration cũng sẽ tự xong hoặc tự hỏng?',
          ),
          options: [
            B(
              'The database: without it a runaway migration can hold <code>ACCESS EXCLUSIVE</code> indefinitely, and the timeout is what causes PostgreSQL to release the lock and roll the statement back',
              'Cơ sở dữ liệu: không có nó thì một migration chạy loạn có thể giữ <code>ACCESS EXCLUSIVE</code> vô thời hạn, và cái hạn giờ chính là thứ khiến PostgreSQL nhả khoá ra và lùi câu lệnh lại',
            ),
            B(
              'The rest of the deploy pipeline: a migration waiting forever on a lock hangs the script, which is still holding the deploy lock from the line above — so one stuck migration blocks every other deploy on the machine, including the one that would fix it',
              'Toàn bộ phần còn lại của đường ống deploy: một migration chờ mãi trên một cái khoá sẽ làm TREO cái script, mà script thì vẫn đang ôm cái khoá deploy ở dòng phía trên — nên MỘT migration kẹt chặn MỌI lần deploy khác trên máy, kể cả lần deploy sẽ sửa nó',
            ),
            B(
              'The migration ledger: killing the process at a known point leaves a clean "not started" record, whereas letting it run to an unknown conclusion is what produces the half-applied state',
              'Cuốn sổ migration: giết tiến trình ở một thời điểm đã biết sẽ để lại một bản ghi "chưa bắt đầu" sạch sẽ, còn để nó chạy tới một kết cục không xác định mới là thứ đẻ ra trạng thái áp-nửa-vời',
            ),
            B(
              'The readiness check further down: without a bound, a slow migration pushes the swap past the point where the orchestrator would have declared the deploy failed, so the timeout keeps the two budgets aligned',
              'Phép kiểm sẵn sàng ở phía dưới: không có giới hạn thì một migration chậm đẩy bước tráo vượt quá điểm mà bộ điều phối lẽ ra đã tuyên bố lần deploy hỏng, nên cái hạn giờ giữ hai ngân sách khớp nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The lock in the line above is held for the life of the shell, so anything that hangs the shell hangs every future deploy — and the deploy you would most want to run at that moment is the one that fixes the problem. That is why the bound is on the whole command rather than on the database. Option A confuses two different timeouts that both belong in a migration and do different jobs: <code>lock_timeout</code> and <code>statement_timeout</code> are set <em>inside</em> the SQL and are what stop the database waiting; <code>timeout 300</code> is a shell-level bound on the client. Option C is worth reading carefully because it is almost the opposite of the truth — killing a migration client mid-run is one of the ways to <em>produce</em> the ledger state from Question 12, not to avoid it. Two other properties of this placement earn their keep: the migration runs before anything is swapped, so a failure leaves the old version serving from the old schema, which is a consistent state and the cheapest possible failure; and backfills do <em>not</em> go here — they are idempotent and resumable, so they belong in a separate job at their own pace.',
            'Cái khoá ở dòng phía trên được giữ suốt đời cái shell, nên bất cứ thứ gì làm treo shell đều làm treo MỌI lần deploy về sau — và lần deploy mà bạn muốn chạy nhất vào đúng khoảnh khắc ấy chính là lần sửa vấn đề. Đó là lý do giới hạn được đặt lên CẢ CÂU LỆNH chứ không đặt lên cơ sở dữ liệu. Phương án A lẫn lộn hai cái hạn giờ khác nhau mà cả hai đều thuộc về một migration và làm hai việc khác nhau: <code>lock_timeout</code> và <code>statement_timeout</code> được đặt BÊN TRONG SQL và là thứ chặn việc cơ sở dữ liệu ngồi chờ; còn <code>timeout 300</code> là một giới hạn ở tầng shell đặt lên máy khách. Phương án C đáng đọc kỹ vì nó gần như NGƯỢC với sự thật — giết một máy khách migration giữa chừng là MỘT TRONG NHỮNG CÁCH ĐẺ RA trạng thái sổ sách ở câu 12, chứ không phải cách tránh nó. Hai tính chất khác của chỗ đặt này cũng xứng đáng có mặt: migration chạy TRƯỚC khi có gì bị tráo, nên một cú hỏng để lại bản cũ đang phục vụ trên lược đồ cũ — một trạng thái nhất quán và là cú hỏng rẻ nhất có thể; và các lượt lấp dữ liệu thì KHÔNG nằm ở đây — chúng chạy lại được và tiếp tục được, nên chúng thuộc về một việc riêng chạy theo nhịp của nó.',
          ),
        }),

        /* ── Chương 6 — lùi bản (8 câu) ────────────────────────────────── */

        // q16 · đáp án D
        mcq({
          prompt: B(
            'Two ways back to a previous release, measured (numbers from the course):' +
            code('=== LUI bang symlink ===\n' +
                 '  symlink      : 4 ms\n' +
                 '  khoi dong    : 8 ms\n' +
                 '  cho san sang : 129 ms\n' +
                 '  TONG         : 142 ms\n\n' +
                 '=== DUNG LAI tu nguon (83 goi npm, 61 tep TypeScript) ===\n' +
                 '  git clone : 23 ms   (kho tran, qua he tep noi bo)\n' +
                 '  npm ci    : 900 ms  (cache am; cache sach do duoc 1090 ms)\n' +
                 '  tsc build : 1070 ms\n' +
                 '  TONG      : 1994 ms') +
            'Why is 14× an <em>understatement</em> rather than the headline?',
            'Hai cách quay về một bản phát hành trước, đo được (số lấy từ giáo trình):' +
            code('=== LUI bang symlink ===\n' +
                 '  symlink      : 4 ms\n' +
                 '  khoi dong    : 8 ms\n' +
                 '  cho san sang : 129 ms\n' +
                 '  TONG         : 142 ms\n\n' +
                 '=== DUNG LAI tu nguon (83 goi npm, 61 tep TypeScript) ===\n' +
                 '  git clone : 23 ms   (kho tran, qua he tep noi bo)\n' +
                 '  npm ci    : 900 ms  (cache am; cache sach do duoc 1090 ms)\n' +
                 '  tsc build : 1070 ms\n' +
                 '  TONG      : 1994 ms') +
            'Vì sao con số 14 lần là một cách NÓI GIẢM chứ không phải tiêu đề?',
          ),
          options: [
            B(
              'Because the symlink column omits the proxy reload, which on a real site adds several hundred milliseconds; a fair comparison would put the two within a factor of four, and the honest headline is "hundreds of milliseconds against seconds"',
              'Vì cột symlink bỏ qua bước nạp lại proxy, thứ trên một trang thật cộng thêm vài trăm mili giây; một phép so công bằng sẽ kéo hai bên về chênh nhau bốn lần, và tiêu đề thật thà phải là "vài trăm mili giây so với vài giây"',
            ),
            B(
              'Because the rebuild column is dominated by <code>tsc</code>, which is a one-off cost: with an incremental build cache on the server the second rebuild is nearly free, so the ratio only holds for the first rollback after a machine is provisioned',
              'Vì cột dựng lại bị <code>tsc</code> chi phối, mà đó là chi phí một lần: có bộ đệm dựng tăng dần trên máy chủ thì lần dựng lại thứ hai gần như miễn phí, nên tỉ lệ ấy chỉ đúng với cú lùi ĐẦU TIÊN sau khi một cái máy vừa được dựng',
            ),
            B(
              'Because 142 ms already includes the readiness wait while 1,994 ms does not: the rebuild column stops at the moment the build finishes and says nothing about starting the process, so adding the same 129 ms to the right-hand column and removing it from the left brings the two figures much closer together than the headline suggests',
              'Vì 142 ms đã bao gồm cả quãng chờ sẵn sàng còn 1.994 ms thì chưa: cột dựng lại DỪNG ở khoảnh khắc bản dựng xong và không nói gì về việc khởi động tiến trình, nên cộng đúng 129 ms ấy vào cột phải và bỏ nó khỏi cột trái sẽ kéo hai con số lại gần nhau hơn nhiều so với vẻ ngoài của tiêu đề',
            ),
            B(
              'Because every part of the rebuild column was made as favourable as possible: 83 packages against 897 and 1,159 in this repository, a bare clone over the local filesystem rather than over a network, a warm npm cache, and <code>tsc</code> rather than a real front-end build. The number to carry is not "14×" but "milliseconds against minutes, while the site is broken"',
              'Vì MỌI phần của cột dựng lại đều đã được làm cho thuận lợi hết mức: 83 gói so với 897 và 1.159 gói trong chính kho mã này, một bản clone kho trần qua hệ tệp NỘI BỘ chứ không qua mạng, một bộ đệm npm đang ấm, và <code>tsc</code> chứ không phải một bản dựng front-end thật. Con số đáng mang theo không phải "14 lần" mà là "mili giây so với PHÚT, trong lúc trang web đang hỏng"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A toy project is not the measurement you need. Every choice in the right-hand column was the most generous one available, and a real rebuild of a real application is minutes rather than seconds — which is the number that matters, because it is elapsed time during an incident. Option C is the closest wrong answer and it is factually inverted: the 142 ms explicitly includes the 129 ms readiness wait, and 128 of those milliseconds are the runtime booting, which the rebuild path also has to pay <em>on top of</em> its 1,994 ms. The structural half of the argument is separate and stronger than the timing: rebuilding needs the old artifact to still exist somewhere and needs the network to fetch it, and the moment you most need to roll back is often the moment something else is also broken. What you pay for the fast path is disk — about 29 MB of <code>node_modules</code> per release on that project, so five releases is roughly 145 MB and twenty is 580 MB — and hard links cut most of that, because identical files share one copy.',
            'Một dự án đồ chơi không phải phép đo bạn cần. Mọi lựa chọn ở cột bên phải đều là lựa chọn RỘNG LƯỢNG nhất có thể, và một lần dựng lại thật của một ứng dụng thật là hàng PHÚT chứ không phải hàng giây — mà đó mới là con số có trọng lượng, vì nó là thời gian trôi qua TRONG một sự cố. Phương án C là đáp án sai gần đúng nhất và nó bị lộn ngược về mặt dữ kiện: 142 ms ĐÃ bao gồm 129 ms chờ sẵn sàng, và 128 trong số mili giây ấy là runtime đang khởi động — thứ mà đường dựng lại cũng vẫn phải trả THÊM lên trên 1.994 ms của nó. Nửa cấu trúc của lập luận thì tách riêng và mạnh hơn phần thời gian: dựng lại đòi bản tạo tác CŨ vẫn còn tồn tại ở đâu đó và đòi cả đường mạng để lấy về, mà khoảnh khắc bạn cần lùi bản nhất thường cũng là khoảnh khắc có thứ khác đang hỏng. Cái giá bạn trả cho đường nhanh là ĐĨA — khoảng 29 MB <code>node_modules</code> mỗi bản trên dự án ấy, nên năm bản là chừng 145 MB và hai mươi bản là 580 MB — còn liên kết cứng cắt đi phần lớn khoản đó, vì các tệp giống hệt nhau dùng chung một bản.',
          ),
        }),

        // q17 · đáp án B
        mcq({
          prompt: B(
            'Which of these schema changes is reversible, and at what cost? Match the four correctly.' +
            code('1) doi ten mot cot\n' +
                 '2) them mot cot\n' +
                 '3) doi kieu int → bigint\n' +
                 '4) bo mot cot'),
            'Xem những thay đổi lược đồ sau, cái nào lùi được và với cái giá nào? Hãy ghép đúng cả bốn.' +
            code('1) doi ten mot cot\n' +
                 '2) them mot cot\n' +
                 '3) doi kieu int → bigint\n' +
                 '4) bo mot cot'),
          ),
          options: [
            B(
              '1 reversible, 2 reversible, 3 reversible, 4 reversible — all four are catalogue edits in PostgreSQL, and a dropped column can be recovered from the heap with <code>pageinspect</code> until the next table rewrite',
              '1 lùi được, 2 lùi được, 3 lùi được, 4 lùi được — cả bốn đều là sửa danh mục trong PostgreSQL, và một cột đã bỏ vẫn khôi phục được từ heap bằng <code>pageinspect</code> cho tới lần viết lại bảng kế tiếp',
            ),
            B(
              '1 reversible in one statement; 2 reversible by dropping it, but everything written into it is lost; 3 reversible only if no value has exceeded the old range; 4 NOT reversible — the data is gone',
              '1 lùi được bằng một câu lệnh; 2 lùi được bằng cách bỏ nó đi, nhưng mọi thứ đã ghi vào nó thì mất; 3 chỉ lùi được nếu chưa có giá trị nào vượt khoảng cũ; 4 KHÔNG lùi được — dữ liệu đã mất',
            ),
            B(
              '1 NOT reversible, because the old name is not recorded anywhere once the catalogue is updated; 2, 3 and 4 are all reversible, since PostgreSQL keeps the previous definition in <code>pg_attribute</code> until <code>VACUUM FULL</code>',
              '1 KHÔNG lùi được, vì tên cũ không được ghi lại ở đâu một khi danh mục đã cập nhật; 2, 3 và 4 đều lùi được, vì PostgreSQL giữ định nghĩa trước đó trong <code>pg_attribute</code> cho tới khi chạy <code>VACUUM FULL</code>',
            ),
            B(
              '1 and 4 reversible, 2 and 3 not: adding a column and widening a type both rewrite the table, and a rewrite cannot be undone without a restore, while a rename and a drop are catalogue-only',
              '1 và 4 lùi được, 2 và 3 thì không: thêm cột và nới rộng kiểu đều VIẾT LẠI bảng, mà một lần viết lại thì không hoàn tác được nếu không phục hồi từ sao lưu, còn đổi tên và bỏ cột thì chỉ đụng danh mục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The friendliest case in this list — a pure rename, no data written in the new shape, no dependent objects — is the one every worked example uses, which is why "you can just rename it back" gets over-generalised. The general case is not friendly. Adding a column is reversible in the sense that the schema returns to its previous shape, and irreversible in the sense that matters: everything users wrote into it during those two weeks is gone. Widening a type reverses only while no value has outgrown the old range, which is a property of your data rather than of your schema. And dropping a column is the one genuinely one-way change in the whole course. Option A repeats a real measurement and draws exactly the wrong conclusion from it: the old values <em>are</em> physically still in the heap after <code>DROP COLUMN</code>, and that is a diagnostic curiosity rather than a recovery plan — there is no supported way to read them back, the layout is undocumented as an interface, TOAST-ed values live elsewhere, and any autovacuum-triggered rewrite erases them without warning. If you dropped a column you needed, the recovery is a restore from backup. What to do instead is the same shape as everywhere else in this course: stop writing to it, ship, wait out your rollback distance, then drop in a later release.',
            'Ca dễ chịu nhất trong danh sách này — một cú đổi tên thuần, chưa có dữ liệu nào ghi theo hình dạng mới, không đối tượng phụ thuộc nào — lại chính là ca mà mọi ví dụ mẫu đem ra dùng, và vì thế câu "cứ đổi tên nó về là xong" bị TỔNG QUÁT HOÁ quá tay. Ca tổng quát thì không dễ chịu. Thêm một cột là lùi được theo nghĩa lược đồ trở về hình dạng cũ, và KHÔNG lùi được theo cái nghĩa có trọng lượng: mọi thứ người dùng đã ghi vào nó suốt hai tuần ấy đều mất. Nới rộng kiểu chỉ lùi được chừng nào chưa có giá trị nào vượt khỏi khoảng cũ, và đó là một tính chất của DỮ LIỆU chứ không phải của lược đồ. Còn bỏ một cột là thay đổi MỘT CHIỀU thật sự duy nhất trong cả khoá học. Phương án A nhắc lại một phép đo có thật rồi rút ra đúng kết luận sai từ nó: các giá trị cũ ĐÚNG LÀ vẫn còn nằm vật lý trong heap sau <code>DROP COLUMN</code>, nhưng đó là một sự hiếu kỳ chẩn đoán chứ không phải một kế hoạch cứu hộ — không có cách nào được hỗ trợ để đọc chúng về, bố cục ấy không được ghi thành một giao diện, giá trị TOAST nằm ở bảng khác, và bất kỳ lượt viết lại nào do autovacuum kích hoạt cũng xoá sạch chúng mà không báo. Nếu bạn đã bỏ mất một cột bạn cần thì đường cứu là PHỤC HỒI từ sao lưu. Còn thứ nên làm thay vào đó vẫn cùng hình dạng với mọi chỗ khác trong khoá này: thôi ghi vào nó, gửi bản mới đi, chờ hết khoảng lùi của bạn, rồi mới bỏ ở một bản phát hành sau.',
          ),
        }),

        // q18 · đáp án A
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, a 200,000-row table with real data in it:' +
            code("alter table kh drop column dien_thoai;   → 0,624 ms\n" +
                 'pg_total_relation_size truoc: 19 MB\n' +
                 'pg_total_relation_size sau  : 19 MB\n\n' +
                 'pg_attribute:\n' +
                 '  attname                      | attnum | attisdropped\n' +
                 '  id                           |      1 | f\n' +
                 '  email                        |      2 | f\n' +
                 '  ........pg.dropped.3........ |      3 | t\n' +
                 '  ghi_chu                      |      4 | f\n\n' +
                 'alter table kh add column dien_thoai text;\n' +
                 '  tong=200000  con_du_lieu=0\n' +
                 '  attname=dien_thoai  attnum=5') +
            'A colleague is worried the disk did not shrink and wants to know whether the drop "really happened". What is the accurate answer?',
            'Đo trên PostgreSQL 16.14, một bảng 200.000 dòng có dữ liệu thật:' +
            code("alter table kh drop column dien_thoai;   → 0,624 ms\n" +
                 'pg_total_relation_size truoc: 19 MB\n' +
                 'pg_total_relation_size sau  : 19 MB\n\n' +
                 'pg_attribute:\n' +
                 '  attname                      | attnum | attisdropped\n' +
                 '  id                           |      1 | f\n' +
                 '  email                        |      2 | f\n' +
                 '  ........pg.dropped.3........ |      3 | t\n' +
                 '  ghi_chu                      |      4 | f\n\n' +
                 'alter table kh add column dien_thoai text;\n' +
                 '  tong=200000  con_du_lieu=0\n' +
                 '  attname=dien_thoai  attnum=5') +
            'Một đồng nghiệp lo lắng vì đĩa không hề nhỏ đi và muốn biết cú bỏ cột ấy "có thật sự xảy ra không". Câu trả lời chính xác là gì?',
          ),
          options: [
            B(
              'It happened, and it was a catalogue edit: the column is marked dropped and hidden from SQL while the old values stay in every row on disk until the next table rewrite. The re-added column is a DIFFERENT column that happens to share a name — <code>attnum</code> 5, not 3 — and it is empty on all 200,000 rows',
              'Nó ĐÃ xảy ra, và nó là một lần sửa DANH MỤC: cột được đánh dấu là đã bỏ và bị giấu khỏi SQL, trong khi các giá trị cũ vẫn nằm trong mọi dòng trên đĩa cho tới lần viết lại bảng kế tiếp. Cái cột được thêm lại là một cột KHÁC tình cờ trùng tên — <code>attnum</code> bằng 5 chứ không phải 3 — và nó rỗng trên cả 200.000 dòng',
            ),
            B(
              'It did not fully happen: <code>attisdropped</code> means the drop is pending and will be completed by autovacuum, which is why the size is unchanged; querying the column before then still returns the old values',
              'Nó CHƯA xảy ra trọn vẹn: <code>attisdropped</code> nghĩa là cú bỏ đang chờ và sẽ được autovacuum hoàn tất, và đó là lý do kích thước không đổi; truy vấn cột ấy trước lúc đó vẫn trả về giá trị cũ',
            ),
            B(
              'It happened but was rolled back by the subsequent <code>ADD COLUMN</code>: PostgreSQL reuses a dropped attribute slot when a column of the same name is re-added, which is why the row count is intact and only the values were cleared',
              'Nó đã xảy ra nhưng bị chính lệnh <code>ADD COLUMN</code> sau đó hoàn tác: PostgreSQL dùng lại ô thuộc tính đã bỏ khi một cột cùng tên được thêm lại, và vì thế số dòng còn nguyên mà chỉ các giá trị bị xoá',
            ),
            B(
              'It happened and the size is a reporting artefact: <code>pg_total_relation_size</code> counts the free space map and the visibility map, which do not shrink; the heap itself did shrink and <code>pg_relation_size</code> would show it',
              'Nó đã xảy ra và cái kích thước chỉ là tạo tác báo cáo: <code>pg_total_relation_size</code> đếm cả bản đồ chỗ trống và bản đồ khả kiến, hai thứ không co lại; bản thân heap thì đã nhỏ đi và <code>pg_relation_size</code> sẽ cho thấy điều đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two useful facts fall out of one transcript. First, <b>duration says nothing about damage</b>: 0.624 ms to make 200,000 phone numbers unreachable, against a completely harmless <code>ADD COLUMN … DEFAULT gen_random_uuid()</code> that the course measured at 2,606 ms on a comparable table. If your instinct is "it finished instantly so it cannot have done much", this is the measurement that should kill it. Second, <code>DROP COLUMN</code> does not free disk — which surprises people whose disk is full, and matters for the reason Chapter 8 spells out. The <code>attnum</code> detail is the one worth remembering when reading a schema afterwards: the dropped column keeps slot 3 under a placeholder name, and a re-added column of the same name is slot 5. They are different columns; nothing carries over. The physical bytes do survive in the heap until a rewrite, and that is diagnostic trivia rather than a recovery plan — the recovery for a column you needed is a restore from backup.',
            'Hai sự kiện có ích rơi ra từ cùng một đoạn terminal. Thứ nhất, <b>thời gian chạy chẳng nói gì về thiệt hại</b>: 0,624 ms để làm cho 200.000 số điện thoại không còn với tới được, so với một lệnh <code>ADD COLUMN … DEFAULT gen_random_uuid()</code> hoàn toàn vô hại mà giáo trình đo được 2.606 ms trên một bảng tương đương. Nếu bản năng của bạn là "nó xong tức thì nên chắc chẳng làm gì nhiều", thì đây chính là phép đo nên giết cái bản năng ấy. Thứ hai, <code>DROP COLUMN</code> KHÔNG giải phóng đĩa — điều làm ngạc nhiên những người đang đầy đĩa, và có trọng lượng vì đúng lý do mà Chương 8 nói rõ. Chi tiết <code>attnum</code> là thứ đáng nhớ khi đọc lại một lược đồ về sau: cột đã bỏ giữ nguyên ô số 3 dưới một cái tên giữ chỗ, còn cột được thêm lại cùng tên thì nằm ở ô số 5. Chúng là HAI cột khác nhau; không có gì chuyển sang cả. Các byte vật lý thì đúng là sống sót trong heap tới lần viết lại, và đó là chuyện vặt để chẩn đoán chứ không phải một kế hoạch cứu hộ — đường cứu cho một cột bạn cần là phục hồi từ sao lưu.',
          ),
        }),

        // q19 · đáp án C
        mcq({
          prompt: B(
            'Deciding which side effects deserve a transactional outbox and which can stay inline. Four candidates in one application:' +
            code('1) gui thu xac nhan don hang\n' +
                 '2) xoa mot muc trong bo dem noi bo\n' +
                 '3) goi webhook cua mot cong ty khac\n' +
                 '4) ghi mot dong metric') +
            'Which rule sorts them, and what does the answer cost to build?',
            'Quyết định hiệu ứng phụ nào xứng đáng có một hộp gửi trong giao dịch và cái nào cứ để nội tuyến. Bốn ứng viên trong cùng một ứng dụng:' +
            code('1) gui thu xac nhan don hang\n' +
                 '2) xoa mot muc trong bo dem noi bo\n' +
                 '3) goi webhook cua mot cong ty khac\n' +
                 '4) ghi mot dong metric') +
            'Quy tắc nào phân loại được chúng, và câu trả lời ấy tốn gì để dựng?',
          ),
          options: [
            B(
              'Sort by latency: anything that makes a network call outside your own machine belongs in the outbox, because an inline call adds its round trip to every request. That covers 1 and 3, and 4 as well once the metrics endpoint is remote',
              'Phân loại theo ĐỘ TRỄ: bất cứ thứ gì gọi mạng ra ngoài máy của bạn đều thuộc về hộp gửi, vì một lời gọi nội tuyến cộng thêm cả vòng đi-về vào MỌI request. Cách đó phủ 1 và 3, và phủ luôn 4 một khi endpoint metric nằm ở xa',
            ),
            B(
              'Sort by reliability: anything that can fail belongs in the outbox so it can be retried, which is 1, 3 and 4; only 2 stays inline, because a cache deletion that fails is self-correcting on the next read',
              'Phân loại theo ĐỘ TIN CẬY: bất cứ thứ gì CÓ THỂ HỎNG đều thuộc về hộp gửi để còn thử lại được, tức là 1, 3 và 4; chỉ có 2 ở lại nội tuyến, vì một lần xoá bộ đệm hỏng thì lần đọc sau tự sửa',
            ),
            B(
              'Sort by whether undoing it would require an apology: 1 and 3 leave the machine and somebody outside acts on them, so they get the outbox and an idempotency key; 2 and 4 are internal and repairable — cheap to redo, harmless to lose. The cost is one table, one worker loop, and one extra INSERT inside a transaction you were opening anyway',
              'Phân loại theo việc HOÀN TÁC NÓ CÓ PHẢI ĐI XIN LỖI KHÔNG: 1 và 3 rời khỏi cái máy và có người ở ngoài hành động theo chúng, nên chúng nhận hộp gửi cộng một khoá bất biến; 2 và 4 là nội bộ và sửa lại được — làm lại thì rẻ, mất thì vô hại. Cái giá là một cái bảng, một vòng lặp thợ, và một lệnh INSERT thêm bên trong một giao dịch bạn đằng nào cũng đang mở',
            ),
            B(
              'Sort by ordering guarantees: 1 and 3 must arrive in the order the rows were written, which only a single-consumer outbox provides; 2 and 4 are order-independent, so they can stay inline and the outbox is really a sequencing mechanism rather than a rollback one',
              'Phân loại theo BẢO ĐẢM THỨ TỰ: 1 và 3 phải tới theo đúng thứ tự các dòng được ghi, thứ chỉ một hộp gửi có một người tiêu thụ mới cho được; 2 và 4 không phụ thuộc thứ tự nên cứ để nội tuyến, và hộp gửi thật ra là một cơ chế SẮP THỨ TỰ chứ không phải một cơ chế lùi bản',
            ),
          ],
          correct: 2,
          explanation: EX(
            'You cannot bolt an outbox on during an incident, so the question to answer while you are calm is: which side effects leave the machine, and which of those would I want back? The list is usually short — payment capture, confirmation email, external webhook, push notification — and everything else is internal and repairable. The give-away in the answer is the useful heuristic: if undoing it requires an apology, it belongs in the outbox. Option B is the closest wrong answer and it is worth being precise about, because "it can fail so it should be retried" is a real property that leads somewhere else: a retry queue is about delivery, an outbox is about <em>atomicity with the business data</em>. That is the second thing the pattern buys, and arguably the larger one — writing the intent in the same transaction as the row means either both exist or neither does, so a process killed between the insert and the send can no longer produce an order with no email or an email for an order the database rolled back. The cost of getting it wrong in the other direction is real too: putting a metric write in an outbox adds a table, a worker and a failure mode to something that was harmless to lose. And the piece that must not be skipped for 1 and 3 is the idempotency key, because the worker sends and <em>then</em> marks the row sent — dying between those two steps means the next run sends again.',
            'Bạn không thể lắp một cái hộp gửi vào giữa lúc đang có sự cố, nên câu cần trả lời khi còn bình tĩnh là: hiệu ứng phụ nào RỜI KHỎI cái máy, và trong số đó cái nào mình sẽ muốn lấy lại? Danh sách thường ngắn — thu tiền, thư xác nhận, webhook ra ngoài, thông báo đẩy — còn mọi thứ khác đều là nội bộ và sửa lại được. Chỗ lộ diện trong đáp án chính là cái quy tắc hữu dụng: nếu HOÀN TÁC nó phải đi XIN LỖI thì nó thuộc về hộp gửi. Phương án B là đáp án sai gần đúng nhất và đáng nói cho chính xác, vì "nó có thể hỏng nên phải thử lại" là một tính chất CÓ THẬT nhưng dẫn tới nơi khác: một hàng đợi thử lại nói về CHUYỆN GIAO, còn một hộp gửi nói về TÍNH NGUYÊN TỬ VỚI DỮ LIỆU NGHIỆP VỤ. Đó là thứ thứ hai mà khuôn mẫu này mua được, và có lẽ là thứ lớn hơn — ghi cái ý định trong cùng giao dịch với cái dòng nghĩa là hoặc cả hai cùng có hoặc chẳng cái nào, nên một tiến trình bị giết giữa lệnh chèn và lệnh gửi không còn đẻ ra được một đơn hàng không có thư hay một lá thư cho một đơn hàng mà cơ sở dữ liệu đã lùi lại. Cái giá của việc sai theo chiều ngược lại cũng có thật: nhét một lần ghi metric vào hộp gửi là thêm một cái bảng, một tiến trình thợ và một kiểu hỏng vào một thứ vốn dĩ mất cũng chẳng sao. Còn mảnh KHÔNG được bỏ qua với 1 và 3 là cái khoá bất biến, vì thợ GỬI rồi MỚI đánh dấu là đã gửi — chết giữa hai bước ấy nghĩa là lượt sau gửi lại lần nữa.',
          ),
        }),


        // q20 · đáp án D
        mcq({
          prompt: B(
            'Ninety orders are placed. Each request inserts a row and sends a confirmation email in the same handler. The version turns out to be bad, so the rollback deletes every row it wrote:' +
            code('=== ban HONG len song, 90 don ===\n' +
                 '  dong trong CSDL: 90     thu DA GUI DI: 90\n' +
                 '=== LUI: xoa sach dong hong trong CSDL ===\n' +
                 '  dong trong CSDL: 0      thu DA GUI DI: 90  ← KHONG DOI') +
            'The same rig with a transactional outbox, with the worker draining ten at a time and the rollback happening 1.6 s in:' +
            code('da danh dau gui   : 40\n' +
                 'chua gui, HUY DUOC: 50\n' +
                 'thu that su da roi khoi may: 40') +
            'What did the outbox actually buy?',
            'Chín mươi đơn hàng được đặt. Mỗi request chèn một dòng và gửi một email xác nhận trong cùng một handler. Bản ấy hoá ra là bản hỏng, nên cú lùi bản xoá sạch mọi dòng nó đã ghi:' +
            code('=== ban HONG len song, 90 don ===\n' +
                 '  dong trong CSDL: 90     thu DA GUI DI: 90\n' +
                 '=== LUI: xoa sach dong hong trong CSDL ===\n' +
                 '  dong trong CSDL: 0      thu DA GUI DI: 90  ← KHONG DOI') +
            'Cũng bộ đồ nghề ấy nhưng có một HỘP GỬI trong giao dịch, với tiến trình thợ rút mười cái một lượt và cú lùi bản xảy ra ở giây thứ 1,6:' +
            code('da danh dau gui   : 40\n' +
                 'chua gui, HUY DUOC: 50\n' +
                 'thu that su da roi khoi may: 40') +
            'Cái hộp gửi ấy rốt cuộc MUA được cái gì?',
          ),
          options: [
            B(
              'Reversibility: the intent row can be deleted, so the send is undone — which is why the outbox is the standard answer for any side effect that leaves the machine',
              'Khả năng hoàn tác: dòng ghi ý định xoá được, nên cú gửi được hoàn tác — và đó là lý do hộp gửi là câu trả lời tiêu chuẩn cho mọi hiệu ứng phụ rời khỏi cái máy',
            ),
            B(
              'Nothing measurable in this run: 40 of 90 is 44%, and the direct-send version would have been at a similar fraction had the rollback happened equally early, so the two shapes differ only in where the work sits',
              'Chẳng mua được gì đo được trong lượt này: 40 trên 90 là 44%, và bản gửi thẳng cũng sẽ ở một tỉ lệ tương tự nếu cú lùi bản diễn ra sớm như thế, nên hai hình dạng chỉ khác nhau ở chỗ ĐẶT công việc ở đâu',
            ),
            B(
              'Ordering: the worker sends in insertion order, so the 40 that went out are the oldest and the 50 cancelled are the newest — which means the damage is always to the least recent customers and can be prioritised',
              'Thứ tự: tiến trình thợ gửi theo thứ tự chèn, nên 40 cái đã đi là những cái cũ nhất và 50 cái bị huỷ là mới nhất — nghĩa là thiệt hại luôn rơi vào những khách hàng cũ nhất và có thể ưu tiên xử lý',
            ),
            B(
              'It converted "90 irreversible" into "40 irreversible and 50 cancellable", and gave you a table to run <code>DELETE … WHERE da_gui_luc IS NULL</code> against. It did not make the side effect reversible — nothing does — and the damage is proportional to drain rate × detection time',
              'Nó biến "90 cái không hoàn tác được" thành "40 cái không hoàn tác được và 50 cái HUỶ ĐƯỢC", và cho bạn một cái BẢNG để chạy <code>DELETE … WHERE da_gui_luc IS NULL</code> lên đó. Nó KHÔNG làm cho hiệu ứng phụ trở nên hoàn tác được — chẳng thứ gì làm được điều đó — và thiệt hại tỉ lệ với nhịp rút × thời gian phát hiện',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The first transcript is the whole lesson in four lines: the database went to zero and the mailbox stayed at 90, because a rollback is a statement about your process and your data, and the outside world was never party to it. The version of this measurement with the worker idle shows 0 of 90 sent, and that result is too flattering to quote — in production the worker runs constantly, which is why the honest figure is 40 and 50. So the outbox does not make anything reversible; it converts an irreversible side effect into a row you can still act on, and it shrinks the window. There is a second thing it buys for free, and it is arguably worth more: writing the intent in the <em>same transaction</em> as the business data means either both exist or neither does, so a process killed between the insert and the send can no longer produce an order with no email or an email for an order that rolled back. The cost is a duplicate-send window — the worker sends, then marks the row sent, and dying between those two steps means the next run sends again — which is fixed on the receiving side with an idempotency key rather than by reordering the two steps. The decision to make while you are calm is which side effects would need an apology to undo; those get the outbox, and the rest can stay inline.',
            'Đoạn terminal đầu tiên là toàn bộ bài học gói trong bốn dòng: cơ sở dữ liệu về 0 còn hộp thư vẫn 90, vì một cú lùi bản là một phát biểu về TIẾN TRÌNH và DỮ LIỆU của bạn, còn thế giới bên ngoài thì chưa bao giờ tham gia vào đó. Phiên bản của phép đo này với tiến trình thợ đang RỖI cho ra 0 trên 90 lá đã gửi, và kết quả ấy quá đẹp để đem ra trích — trên production thì thợ chạy liên tục, và vì thế con số THẬT THÀ mới là 40 và 50. Vậy hộp gửi không làm cho thứ gì hoàn tác được cả; nó BIẾN một hiệu ứng phụ không hoàn tác được thành một DÒNG mà bạn còn tác động lên được, và nó THU HẸP cửa sổ. Còn một thứ nữa nó mua được miễn phí, và có thể còn đáng giá hơn: ghi cái ý định trong CÙNG GIAO DỊCH với dữ liệu nghiệp vụ nghĩa là hoặc cả hai cùng tồn tại hoặc chẳng cái nào cả, nên một tiến trình bị giết giữa lệnh chèn và lệnh gửi không còn đẻ ra được một đơn hàng không có thư hay một lá thư cho một đơn hàng đã bị lùi. Cái giá là một cửa sổ GỬI TRÙNG — thợ gửi xong rồi mới đánh dấu là đã gửi, chết giữa hai bước ấy thì lượt sau gửi lại — và nó được chữa ở phía NHẬN bằng một khoá bất biến (idempotency key) chứ không phải bằng cách đảo thứ tự hai bước. Quyết định cần làm trong lúc bạn còn bình tĩnh là: hiệu ứng phụ nào mà muốn hoàn tác thì phải đi xin lỗi; những cái đó nhận hộp gửi, còn lại thì cứ để nội tuyến.',
          ),
        }),

        // q21 · đáp án A + C (chọn HAI)
        mcq({
          prompt: B(
            'A rollback script finishes and the application reports v1 through the back door. Then, through an nginx with <code>proxy_cache_valid 200 5m</code> in front of it:' +
            code('=== Hoi qua CUA SAU (thang app) === v1\n' +
                 '=== Hoi qua CUA TRUOC (qua bo dem) ===\n' +
                 '  x-ban: v3  X-Cache: HIT\n' +
                 '  x-ban: v3  X-Cache: HIT\n' +
                 '  than: v3') +
            '<b>Choose TWO</b> true statements about closing this gap.',
            'Một script lùi bản chạy xong và ứng dụng báo v1 qua cửa sau. Rồi hỏi qua một nginx có <code>proxy_cache_valid 200 5m</code> đứng phía trước:' +
            code('=== Hoi qua CUA SAU (thang app) === v1\n' +
                 '=== Hoi qua CUA TRUOC (qua bo dem) ===\n' +
                 '  x-ban: v3  X-Cache: HIT\n' +
                 '  x-ban: v3  X-Cache: HIT\n' +
                 '  than: v3') +
            '<b>Chọn HAI</b> phát biểu ĐÚNG về việc khép lại cái khe này.',
          ),
          options: [
            B(
              'The final check has to go through the address users actually use and compare the VERSION SERVED rather than the status code — a 200 from the front door is exactly what the broken state produces',
              'Phép kiểm cuối cùng phải đi qua ĐÚNG địa chỉ mà người dùng đi vào và so PHIÊN BẢN ĐANG ĐƯỢC PHỤC VỤ chứ không so mã trạng thái — một cú 200 từ cửa trước chính là thứ mà trạng thái hỏng này sinh ra',
            ),
            B(
              'Polling <code>/health</code> twice several seconds apart resolves it, because the second request will miss the cache once the first has expired the entry, so a two-sample check is sufficient',
              'Gọi <code>/health</code> hai lần cách nhau vài giây là giải quyết được, vì request thứ hai sẽ trượt bộ đệm một khi request đầu đã làm mục ấy hết hạn, nên một phép kiểm hai mẫu là đủ',
            ),
            B(
              'The cache in front of you may not be yours: nginx open source has no purge command, a CDN needs its own API call, and an HTML page already in a browser with <code>max-age</code> cannot be reached by any command — which is the argument for <code>no-store</code> on documents and long caching only on content-hashed assets',
              'Cái bộ đệm đứng trước bạn có thể KHÔNG PHẢI của bạn: nginx bản mở không có lệnh xoá đệm, một CDN cần lời gọi API riêng của nó, và một trang HTML đã nằm trong trình duyệt kèm <code>max-age</code> thì KHÔNG lệnh nào trên đời với tới được — và đó là lý lẽ cho <code>no-store</code> trên tài liệu và chỉ đệm dài trên các tài nguyên có băm nội dung trong tên',
            ),
            B(
              'Restarting nginx rather than reloading it is the fix, because a reload keeps old worker processes alive and those workers keep serving from their own in-memory copy of the cache',
              'Khởi động lại hẳn nginx thay vì nạp lại mới là cách chữa, vì nạp lại thì giữ các tiến trình thợ cũ sống và chính chúng vẫn phục vụ từ bản sao bộ đệm trong bộ nhớ của chúng',
            ),
            B(
              'The application should stop sending <code>x-ban</code> on cacheable responses, since a version header in a cached body is what makes the discrepancy visible and therefore alarming',
              'Ứng dụng nên thôi gửi <code>x-ban</code> trên các phản hồi có thể đệm được, vì một header phiên bản nằm trong thân đã đệm chính là thứ làm cho sự vênh nhau hiện ra và do đó gây hoang mang',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'This is the specific kind of bad that costs the most time: the incident continues while your dashboard says it is over, so you have stopped looking. The rollback script was right by every check it ran — the pointer moved, the process restarted, the application answers v1 — and every user got v3 for five minutes. A check that compares the version served, through the user-facing address, is the only thing that catches it, and it should exit with its own code so the discrepancy is reported rather than logged. The purge in the measurement is crude and effective: <code>rm -rf</code> the cache directory and reload, 7 ms, throwing away every cached entry rather than only the stale ones — which on a rollback is exactly what you want. Option E inverts the value of the header: a diagnostic header that makes a discrepancy visible is the thing doing the work here. And option B is worth thinking through rather than dismissing — a cache hit does not expire because you asked twice; the entry has a lifetime, and two samples inside it return the same cached body.',
            'Đây đúng cái kiểu tệ tốn nhiều thời gian nhất: sự cố vẫn tiếp diễn trong khi bảng điều khiển của bạn nói là đã xong, nên bạn đã THÔI TÌM. Script lùi bản đã đúng theo mọi phép kiểm nó chạy — con trỏ đã dời, tiến trình đã khởi động lại, ứng dụng trả lời v1 — và mọi người dùng nhận v3 suốt năm phút. Một phép kiểm so PHIÊN BẢN ĐANG PHỤC VỤ, đi qua địa chỉ mà người dùng đi vào, là thứ DUY NHẤT bắt được nó, và nó nên thoát ra bằng một mã riêng để sự vênh ấy được BÁO CÁO chứ không phải chỉ ghi vào log. Cú dọn đệm trong phép đo thì thô và hiệu quả: <code>rm -rf</code> thư mục cache rồi reload, 7 ms, vứt đi MỌI mục đã đệm chứ không chỉ những mục cũ — mà trong một cú lùi bản thì đó đúng là thứ bạn muốn. Phương án E lộn ngược giá trị của cái header: một header chẩn đoán làm cho sự vênh HIỆN RA chính là thứ đang làm việc ở đây. Còn phương án B thì đáng nghĩ kỹ chứ đừng gạt đi — một mục đã đệm không hết hạn chỉ vì bạn hỏi hai lần; mục ấy có một vòng đời, và hai mẫu lấy bên trong vòng đời đó đều nhận về cùng một thân đã đệm.',
          ),
        }),

        // q22 · đáp án B
        mcq({
          prompt: B(
            'A rollback script, run three ways:' +
            code('=== lui: v1 → v3 ===\n' +
                 "  ✓ cua truoc tra 'v3' sau 558 ms\n\n" +
                 '=== lui ve ban khong ton tai ===\n' +
                 "  KHONG co ban 'v9'. Co: v1 v2 v3\n" +
                 '  ma thoat: 2\n\n' +
                 '=== ban QUEN DON BO DEM ===\n' +
                 "  ✗ CUA TRUOC van tra 'v2', khong phai 'v1'\n" +
                 '  ma thoat: 3\n' +
                 "  ung dung that su dang chay: v1\n" +
                 '  nhung nguoi dung thay      : v2') +
            'The script also exits 0 when asked to roll back to the release that is already running. Why is that the right behaviour rather than a missed error?',
            'Một script lùi bản, chạy theo ba cách:' +
            code('=== lui: v1 → v3 ===\n' +
                 "  ✓ cua truoc tra 'v3' sau 558 ms\n\n" +
                 '=== lui ve ban khong ton tai ===\n' +
                 "  KHONG co ban 'v9'. Co: v1 v2 v3\n" +
                 '  ma thoat: 2\n\n' +
                 '=== ban QUEN DON BO DEM ===\n' +
                 "  ✗ CUA TRUOC van tra 'v2', khong phai 'v1'\n" +
                 '  ma thoat: 3\n' +
                 "  ung dung that su dang chay: v1\n" +
                 '  nhung nguoi dung thay      : v2') +
            'Script ấy còn thoát 0 khi được yêu cầu lùi về đúng bản ĐANG chạy. Vì sao đó là hành vi ĐÚNG chứ không phải một lỗi bị bỏ sót?',
          ),
          options: [
            B(
              'Because exit 0 is what a wrapper needs in order to continue to the next step: a rollback that reports failure would abort the incident playbook halfway, and "already there" is not a reason to stop the rest of the recovery',
              'Vì mã 0 là thứ một script bao ngoài cần để đi tiếp bước sau: một cú lùi bản báo hỏng sẽ làm cẩm nang xử lý sự cố đứt ở giữa, và "đã ở đó rồi" không phải lý do để dừng phần còn lại của việc khôi phục',
            ),
            B(
              'Because rollbacks get run twice by panicking humans, and the second run must be a harmless no-op rather than a restart that drops connections — that is idempotence in the useful sense: the end state depends on the argument, not on how many times you ran it',
              'Vì các cú lùi bản HAY BỊ CHẠY HAI LẦN bởi những con người đang hoảng, và lượt thứ hai phải là một lệnh rỗng vô hại chứ không phải một lần khởi động lại làm rớt kết nối — đó chính là tính chạy-lại-được theo nghĩa có ích: trạng thái cuối phụ thuộc vào THAM SỐ, không phụ thuộc vào việc bạn chạy nó mấy lần',
            ),
            B(
              'Because the check that compares the running release against the requested one happens before the lock is taken, and any code path that runs before the lock must exit 0 by convention so that a concurrent deploy is not misreported as a failure',
              'Vì phép kiểm so bản đang chạy với bản được yêu cầu diễn ra TRƯỚC khi lấy khoá, và theo quy ước thì mọi nhánh mã chạy trước khoá đều phải thoát 0 để một lần deploy song song không bị báo nhầm thành hỏng',
            ),
            B(
              'It is not the right behaviour — it should exit with its own code like the other refusals, and the script only exits 0 here because a distinct code would break the wrapper that treats non-zero as "page someone"',
              'Đó không phải hành vi đúng — nó nên thoát bằng một mã riêng như các lời từ chối khác, và script chỉ thoát 0 ở đây vì một mã riêng sẽ làm hỏng cái script bao ngoài vốn coi mọi mã khác 0 là "gọi người dậy"',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Idempotence does not mean "does nothing the second time"; it means the end state depends only on the arguments. Asking to roll back to what is already running is a request that is already satisfied, so the correct outcome is to say so and stop — <em>without</em> killing the process and restarting it, which would drop connections for no reason at exactly the wrong moment. Everything else in the transcript is the same discipline seen from other angles. A target that does not exist exits with its own code and prints the ones that do, so the human does not have to go looking. And exit 3 is the one that earns the whole script: it names both halves of the discrepancy — what is running and what users see — which is the difference between a script that reports what it did and a script that reports what happened. A check nobody has seen fail is not a check, which is why the third run exists at all: the way to test a verification step is to break the thing it verifies on purpose and confirm it goes red.',
            'Tính chạy-lại-được không có nghĩa là "lần hai thì không làm gì"; nó có nghĩa là trạng thái cuối chỉ phụ thuộc vào THAM SỐ. Yêu cầu lùi về đúng bản đang chạy là một yêu cầu ĐÃ được thoả, nên kết cục đúng là nói ra điều đó rồi dừng — mà KHÔNG giết tiến trình rồi khởi động lại, thứ sẽ làm rớt kết nối một cách vô cớ vào đúng khoảnh khắc tệ nhất. Mọi thứ còn lại trong đoạn terminal đều là cùng một kỷ luật ấy nhìn từ các góc khác. Một cái đích không tồn tại thì thoát bằng mã riêng của nó và IN RA những cái đang có, để con người khỏi phải đi tìm. Còn mã thoát 3 mới là thứ làm cả cái script trở nên đáng giá: nó gọi tên CẢ HAI NỬA của sự vênh — cái gì đang chạy và người dùng đang thấy gì — và đó là khác biệt giữa một script báo cáo thứ NÓ ĐÃ LÀM với một script báo cáo thứ ĐÃ XẢY RA. Một phép kiểm chưa ai từng thấy nó ĐỎ thì không phải một phép kiểm, và đó là lý do lượt chạy thứ ba tồn tại: cách kiểm thử một bước kiểm chứng là CỐ Ý phá thứ mà nó kiểm rồi xác nhận nó đỏ lên.',
          ),
        }),

        // q23 · đáp án A
        mcq({
          prompt: B(
            'An incident at 09:00. A deploy went out at 08:57. The previous release reads a column that the deploy\'s migration renamed, and the migration is the contract phase of an expand-and-contract that was completed the same morning. Which action is correct, and why?',
            'Một sự cố lúc 09:00. Một lần deploy đã ra lúc 08:57. Bản phát hành TRƯỚC đọc một cột mà migration của lần deploy ấy đã đổi tên, và migration ấy là giai đoạn THU HẸP của một cú mở-rộng-thu-hẹp được hoàn tất ngay sáng hôm đó. Hành động nào là đúng, và vì sao?',
          ),
          options: [
            B(
              'Do NOT roll back — this is the one case where rolling back makes things worse, because the previous release cannot run against the current schema. Roll forward with a fix, or roll the schema back deliberately as its own decision',
              'ĐỪNG lùi bản — đây đúng là ca duy nhất mà lùi bản làm mọi thứ TỆ HƠN, vì bản phát hành trước không chạy nổi trên lược đồ hiện tại. Hãy đi tới bằng một bản vá, hoặc lùi LƯỢC ĐỒ lại như một quyết định riêng có chủ đích',
            ),
            B(
              'Roll back anyway and accept a brief period of 500s: the rollback is 140 ms and the schema can be renamed back in a second statement immediately afterwards, so the combined outage is shorter than writing a fix',
              'Cứ lùi bản và chấp nhận một quãng ngắn trả 500: cú lùi mất 140 ms và lược đồ có thể đổi tên về bằng một câu lệnh thứ hai ngay sau đó, nên tổng thời gian gián đoạn vẫn ngắn hơn là ngồi viết một bản vá',
            ),
            B(
              'Roll back to two releases earlier rather than one, since the release before the expand phase predates the whole rename and is therefore compatible with either column name',
              'Lùi về hai bản trước thay vì một bản, vì bản đứng trước giai đoạn MỞ RỘNG có từ trước cả cú đổi tên nên tương thích với tên cột nào cũng được',
            ),
            B(
              'Restart the current release first: a rename is a catalogue update, so the running process is holding a stale plan cache, and a restart resolves the mismatch without touching the schema or the release pointer',
              'Khởi động lại bản hiện tại trước đã: một cú đổi tên chỉ là cập nhật danh mục, nên tiến trình đang chạy đang ôm một bộ đệm kế hoạch cũ, và khởi động lại là hết lệch mà không phải đụng tới lược đồ lẫn con trỏ bản phát hành',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The default in the first five minutes is to roll back before diagnosing: a rollback is milliseconds, the artifact is still there, and every second spent understanding the problem is a second the bad version keeps writing. This is the single exception, and it is knowable in advance — it is exactly the "rollback distance" you established when you wrote the migration. Completing expand and contract on the same morning is what destroyed it: the whole point of the gap between the phases is that during it a rollback is free, and the contract phase is supposed to ship days later when nobody would roll back that far. Option C is a reasonable-sounding trap: a release from before the expand phase reads the <em>old</em> name, which the contract phase has just removed, so it is no more compatible than the immediately previous one — going further back does not help when the schema moved forward. Option B underestimates what the rename costs in the reverse direction and treats a schema change as an undo button; if you do decide to move the schema back, that is a deliberate decision with its own review, not a step in a rollback script. The lesson for next time is in Chapter 5: schedule phase 4 when you write phase 2.',
            'Mặc định của năm phút đầu tiên là LÙI TRƯỚC rồi mới chẩn đoán: một cú lùi bản tính bằng mili giây, tạo tác vẫn còn nguyên đó, và mỗi giây bạn dành ra để hiểu vấn đề là một giây bản hỏng còn tiếp tục GHI. Đây là ngoại lệ DUY NHẤT, và nó BIẾT TRƯỚC được — nó chính là cái "khoảng lùi" mà bạn đã xác lập khi viết migration. Việc hoàn tất cả mở-rộng lẫn thu-hẹp trong cùng một buổi sáng là thứ đã phá huỷ nó: toàn bộ ý nghĩa của khoảng CHỜ giữa hai giai đoạn là để trong quãng đó một cú lùi bản là miễn phí, và giai đoạn thu hẹp lẽ ra phải ra sau nhiều ngày, khi không ai còn lùi xa tới thế. Phương án C là một cái bẫy nghe rất có lý: một bản phát hành có TỪ TRƯỚC giai đoạn mở rộng thì đọc cái tên CŨ, mà giai đoạn thu hẹp vừa gỡ đúng cái tên ấy đi, nên nó chẳng tương thích hơn bản liền trước chút nào — lùi xa hơn không giúp được gì khi lược đồ đã đi tới. Phương án B đánh giá thấp cái giá của việc đổi tên theo chiều ngược lại và coi một thay đổi lược đồ như một nút hoàn tác; nếu bạn có quyết định dời lược đồ về thì đó là một QUYẾT ĐỊNH có chủ đích với phần rà soát riêng của nó, chứ không phải một bước trong một script lùi bản. Bài học cho lần sau nằm ở Chương 5: hãy ĐẶT LỊCH cho giai đoạn 4 ngay lúc bạn viết giai đoạn 2.',
          ),
        }),

        /* ── Chương 7 — script deploy (7 câu) ──────────────────────────── */

        // q24 · đáp án C
        mcq({
          prompt: B(
            'A deploy step that packages an artifact and streams it to the server. Measured on bash 5.2.15 with the source directory deliberately missing:' +
            code('── A) set -eu ──\n' +
                 '  tar czf - /khong-co-thu-muc-nay 2>/dev/null | cat > /dev/null\n' +
                 '  echo "DI TIEP — deploy tuong la da gui xong"\n' +
                 '  → in ra dong do; ma thoat = 0\n\n' +
                 '── B) set -euo pipefail ──\n' +
                 '  (cung hai dong)\n' +
                 '  → khong in gi; ma thoat = 2') +
            'Which flag made the difference, and what exactly was it looking at?',
            'Một bước deploy đóng gói tạo tác rồi truyền thẳng lên máy chủ. Đo trên bash 5.2.15 với thư mục nguồn cố ý cho thiếu:' +
            code('── A) set -eu ──\n' +
                 '  tar czf - /khong-co-thu-muc-nay 2>/dev/null | cat > /dev/null\n' +
                 '  echo "DI TIEP — deploy tuong la da gui xong"\n' +
                 '  → in ra dong do; ma thoat = 0\n\n' +
                 '── B) set -euo pipefail ──\n' +
                 '  (cung hai dong)\n' +
                 '  → khong in gi; ma thoat = 2') +
            'Cái cờ nào tạo ra khác biệt, và nó ĐANG NHÌN vào chính xác cái gì?',
          ),
          options: [
            B(
              '<code>-u</code>, which is present in both but only takes effect in B because <code>pipefail</code> makes the shell evaluate each stage separately; without it the whole pipeline is one command and no variable is expanded per stage',
              '<code>-u</code>, thứ có mặt ở cả hai nhưng chỉ có hiệu lực ở B vì <code>pipefail</code> khiến shell đánh giá từng chặng riêng; thiếu nó thì cả ống dẫn là một lệnh duy nhất và không biến nào được khai triển theo chặng',
            ),
            B(
              '<code>-e</code>, which was suspended in A because a pipeline is treated as a compound command; <code>pipefail</code> re-enables errexit inside pipelines, which is why the same two lines behave differently',
              '<code>-e</code>, thứ bị treo ở A vì một ống dẫn được coi là một lệnh ghép; <code>pipefail</code> bật lại errexit BÊN TRONG các ống dẫn, và đó là lý do cùng hai dòng ấy lại hành xử khác nhau',
            ),
            B(
              '<code>-o pipefail</code>: without it a pipeline returns the status of its LAST command, so <code>cat</code> succeeding masked <code>tar</code> failing. With it the pipeline returns the first non-zero status, and <code>-e</code> then has something to act on',
              '<code>-o pipefail</code>: không có nó thì một ống dẫn trả về trạng thái của lệnh CUỐI, nên <code>cat</code> thành công đã che mất <code>tar</code> hỏng. Có nó thì ống dẫn trả về trạng thái khác 0 ĐẦU TIÊN, và lúc đó <code>-e</code> mới có cái để hành động',
            ),
            B(
              'Neither flag: the difference is <code>2&gt;/dev/null</code>, which in A discards the error and in B is evaluated after <code>pipefail</code> reorders the redirections, so the exit status is preserved rather than swallowed',
              'Chẳng cờ nào cả: khác biệt nằm ở <code>2&gt;/dev/null</code>, thứ ở A thì vứt lỗi đi, còn ở B thì được đánh giá SAU khi <code>pipefail</code> sắp xếp lại các chuyển hướng, nên trạng thái thoát được giữ lại thay vì bị nuốt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the pipeline half of <code>set -euo pipefail</code>, and it is the one that matters most for a deploy, because the shape <code>tar … | ssh …</code> is how artifacts travel. Without <code>pipefail</code> the pipeline reports whatever the last stage returned, so <code>ssh</code> connecting successfully to a server and writing nothing looks exactly like a successful transfer. Note the exit code in B: <code>2</code>, which is <code>tar</code>\'s own status, passed through — <code>pipefail</code> returns the rightmost non-zero status rather than a flag of its own, so you keep the diagnostic information. The remaining pieces of that line are worth knowing individually: <code>-e</code> stops on a failing command but is suspended inside <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> and <code>!</code>; <code>-u</code> stops on an unset variable, which is the flag that prevents <code>rm -rf "$GOC/x"</code> becoming <code>rm -rf /x</code>; and <code>shopt -s inherit_errexit</code> covers <code>y=$(cmd; cmd)</code> but does <em>not</em> cover <code>local x=$(cmd)</code>, because <code>local</code> is itself a command whose own status wins.',
            'Đây là nửa ỐNG DẪN của <code>set -euo pipefail</code>, và nó là nửa quan trọng nhất với một lần deploy, vì hình dạng <code>tar … | ssh …</code> chính là cách các tạo tác đi lại. Không có <code>pipefail</code> thì ống dẫn báo về bất cứ thứ gì chặng CUỐI trả về, nên một lệnh <code>ssh</code> kết nối thành công tới máy chủ rồi chẳng ghi được gì trông y hệt một lượt truyền thành công. Hãy để ý mã thoát ở B: <code>2</code>, chính là trạng thái của <code>tar</code>, được truyền qua — <code>pipefail</code> trả về trạng thái khác 0 ở BÊN PHẢI NHẤT chứ không trả về một cờ riêng của nó, nên bạn giữ được thông tin chẩn đoán. Những mảnh còn lại của dòng ấy cũng đáng biết riêng từng cái: <code>-e</code> dừng khi một lệnh hỏng nhưng bị TREO bên trong <code>if</code>, <code>&amp;&amp;</code>, <code>||</code> và <code>!</code>; <code>-u</code> dừng khi một biến chưa đặt được khai triển, và đó là cái cờ ngăn <code>rm -rf "$GOC/x"</code> biến thành <code>rm -rf /x</code>; còn <code>shopt -s inherit_errexit</code> phủ được <code>y=$(cmd; cmd)</code> nhưng KHÔNG phủ được <code>local x=$(cmd)</code>, vì <code>local</code> tự nó là một lệnh và trạng thái của chính nó mới thắng.',
          ),
        }),

        // q25 · đáp án D
        mcq({
          prompt: B(
            'A deploy step appends a line to a config file only if it is not already there. Two guards, measured on GNU grep 3.8:' +
            code('-- tep co  : PATH=/opt/ung-dung/bin:$PATH:/opt/them\n' +
                 '   muon them: PATH=/opt/ung-dung/bin:$PATH\n' +
                 '   grep -qF  → "DA CO"  ⇒ KHONG them   (SAI)\n' +
                 '   grep -qxF → chua co  ⇒ them        (DUNG)\n\n' +
                 '-- tep co  : SERVER=axbxc\n' +
                 '   muon them: SERVER=a.b.c\n' +
                 '   grep -qx  → "DA CO"  ⇒ KHONG them   (SAI)\n' +
                 '   grep -qxF → chua co  ⇒ them        (DUNG)\n\n' +
                 '-- tep chua ton tai (luot chay dau) --\n' +
                 '   grep -qxF "X=1" /gd/c.txt\n' +
                 '     ma thoat 2, stderr: grep: /gd/c.txt: No such file or directory') +
            'Which sentence describes what each of the three flags is for?',
            'Một bước deploy nối thêm một dòng vào tệp cấu hình chỉ khi nó chưa có ở đó. Hai cái chốt, đo trên GNU grep 3.8:' +
            code('-- tep co  : PATH=/opt/ung-dung/bin:$PATH:/opt/them\n' +
                 '   muon them: PATH=/opt/ung-dung/bin:$PATH\n' +
                 '   grep -qF  → "DA CO"  ⇒ KHONG them   (SAI)\n' +
                 '   grep -qxF → chua co  ⇒ them        (DUNG)\n\n' +
                 '-- tep co  : SERVER=axbxc\n' +
                 '   muon them: SERVER=a.b.c\n' +
                 '   grep -qx  → "DA CO"  ⇒ KHONG them   (SAI)\n' +
                 '   grep -qxF → chua co  ⇒ them        (DUNG)\n\n' +
                 '-- tep chua ton tai (luot chay dau) --\n' +
                 '   grep -qxF "X=1" /gd/c.txt\n' +
                 '     ma thoat 2, stderr: grep: /gd/c.txt: No such file or directory') +
            'Câu nào mô tả đúng công dụng của từng cờ trong ba cờ ấy?',
          ),
          options: [
            B(
              '<code>-q</code> suppresses output, <code>-x</code> anchors the pattern to the start of the line, and <code>-F</code> forces a case-sensitive match; the third measurement shows that <code>2&gt;/dev/null</code> is cosmetic since grep already returns a usable status',
              '<code>-q</code> chặn đầu ra, <code>-x</code> neo mẫu vào ĐẦU dòng, và <code>-F</code> ép khớp phân biệt hoa thường; phép đo thứ ba cho thấy <code>2&gt;/dev/null</code> chỉ là trang trí vì grep vốn đã trả về một trạng thái dùng được',
            ),
            B(
              '<code>-q</code> and <code>-F</code> are the load-bearing pair and <code>-x</code> is redundant with <code>-F</code>: a fixed string that matches at all matches the whole line, so the first measurement is a quoting error rather than a missing flag',
              '<code>-q</code> và <code>-F</code> là cặp chịu lực còn <code>-x</code> thì thừa khi đã có <code>-F</code>: một chuỗi cố định mà đã khớp thì khớp cả dòng, nên phép đo đầu là lỗi bọc nháy chứ không phải thiếu cờ',
            ),
            B(
              'All three are optional refinements: the guard is correct without any of them, and the two wrong answers in the transcript come from the file containing lines it should not have contained in the first place',
              'Cả ba đều chỉ là tinh chỉnh tuỳ chọn: cái chốt vẫn đúng dù không có cờ nào, và hai câu trả lời sai trong đoạn terminal đến từ việc tệp chứa những dòng lẽ ra ngay từ đầu không nên có',
            ),
            B(
              '<code>-q</code> for quiet; <code>-x</code> so the WHOLE line must match, because without it a longer line that merely CONTAINS your string counts as present; <code>-F</code> so the pattern is a fixed string rather than a regex, because <code>.</code> in a config line matches any character. And <code>2&gt;/dev/null</code> is needed too, because on the first run the file does not exist yet',
              '<code>-q</code> để im lặng; <code>-x</code> để phải khớp CẢ DÒNG, vì thiếu nó thì một dòng DÀI HƠN mà chỉ CHỨA chuỗi của bạn cũng được tính là đã có; <code>-F</code> để mẫu là một chuỗi CỐ ĐỊNH chứ không phải một biểu thức chính quy, vì dấu <code>.</code> trong một dòng cấu hình khớp với ký tự bất kỳ. Và <code>2&gt;/dev/null</code> cũng cần, vì ở lượt chạy đầu thì tệp chưa tồn tại',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, both wrong answers. Get any of the three flags wrong and the guard either never fires or always fires, and both failures are silent — which is the whole reason this idiom is worth knowing exactly rather than approximately. The transcript is deliberately built so each flag has its own counter-example: a superset line for <code>-x</code>, a regex metacharacter for <code>-F</code>, and a missing file for the redirect. And the deeper point behind the idiom: every append-guard is a workaround for editing a file whose current contents you did not write. The version with no failure modes at all is to generate the whole file every time with <code>cat &gt; file &lt;&lt;EOF</code> — run it once or fifty times and the file is identical. The constraint is that the script must then own the file completely, which is a real trade with a clean rule: machine-owned files get generated, human-owned files get left alone, and nothing is both.',
            'Đã đo, cả hai câu trả lời sai. Sai bất cứ cờ nào trong ba cờ thì cái chốt hoặc KHÔNG BAO GIỜ nổ hoặc LÚC NÀO CŨNG nổ, và cả hai kiểu hỏng đều im lặng — đó chính là lý do thành ngữ này đáng biết cho CHÍNH XÁC chứ không phải biết đại khái. Đoạn terminal được dựng có chủ đích để mỗi cờ có một phản ví dụ riêng: một dòng bao trùm cho <code>-x</code>, một ký tự đặc biệt của regex cho <code>-F</code>, và một tệp chưa tồn tại cho cái chuyển hướng. Và luận điểm sâu hơn nằm sau thành ngữ ấy: MỌI cái chốt nối-thêm đều là một cách đi vòng cho việc sửa một tệp mà nội dung hiện tại của nó không do bạn viết. Phiên bản không có kiểu hỏng nào là SINH RA cả tệp mỗi lần bằng <code>cat &gt; file &lt;&lt;EOF</code> — chạy một lần hay năm mươi lần thì tệp vẫn y hệt. Ràng buộc là script khi ấy phải SỞ HỮU tệp đó hoàn toàn, và đó là một đánh đổi có thật với một quy tắc gọn: tệp do máy sở hữu thì được SINH RA, tệp do người sở hữu thì để yên, và không tệp nào vừa là cả hai.',
          ),
        }),

        // q26 · đáp án B
        mcq({
          prompt: B(
            'Two ways of timestamping every line a deploy script prints. Measured on bash 5.2.15, three runs each:' +
            code('A)  exec > >(while read -r d; do printf \'%s %s\\n\' "$(date +%H:%M:%S.%3N)" "$d"; done) 2>&1\n\n' +
                 'B)  ghi() { printf \'%s %s\\n\' "$(date +%H:%M:%S.%3N)" "$*" | tee -a "$LOG"; }') +
            'Both produce a correctly timestamped log. The caller then reads the last line of that log the instant the script exits, three runs each:' +
            code('A luot 1: dong cuoi = \'15:49:42.696 1/2 chuan bi\'\n' +
                 'A luot 2: dong cuoi = \'15:49:42.699 1/2 chuan bi\'\n' +
                 'A luot 3: dong cuoi = \'15:49:42.702 1/2 chuan bi\'\n' +
                 'B luot 1: dong cuoi = \'15:49:42.705 XONG\'\n' +
                 'B luot 2: dong cuoi = \'15:49:42.708 XONG\'\n' +
                 'B luot 3: dong cuoi = \'15:49:42.712 XONG\'') +
            'What is the mechanism, and when does it matter?',
            'Hai cách đóng dấu thời gian cho mọi dòng mà một script deploy in ra. Đo trên bash 5.2.15, mỗi cách ba lượt:' +
            code('A)  exec > >(while read -r d; do printf \'%s %s\\n\' "$(date +%H:%M:%S.%3N)" "$d"; done) 2>&1\n\n' +
                 'B)  ghi() { printf \'%s %s\\n\' "$(date +%H:%M:%S.%3N)" "$*" | tee -a "$LOG"; }') +
            'Cả hai đều cho ra một nhật ký đóng dấu thời gian ĐÚNG. Bên gọi sau đó đọc dòng CUỐI của nhật ký ấy ngay khoảnh khắc script thoát, mỗi cách ba lượt:' +
            code('A luot 1: dong cuoi = \'15:49:42.696 1/2 chuan bi\'\n' +
                 'A luot 2: dong cuoi = \'15:49:42.699 1/2 chuan bi\'\n' +
                 'A luot 3: dong cuoi = \'15:49:42.702 1/2 chuan bi\'\n' +
                 'B luot 1: dong cuoi = \'15:49:42.705 XONG\'\n' +
                 'B luot 2: dong cuoi = \'15:49:42.708 XONG\'\n' +
                 'B luot 3: dong cuoi = \'15:49:42.712 XONG\'') +
            'Cơ chế là gì, và khi nào thì nó có trọng lượng?',
          ),
          options: [
            B(
              '<code>tee -a</code> in B flushes on every call while the process substitution in A buffers, so A is simply lagging by one buffer; adding <code>stdbuf -oL</code> to the substituted command makes the two identical',
              '<code>tee -a</code> ở B xả ra ngay mỗi lần gọi còn phép thay thế tiến trình ở A thì đệm lại, nên A chỉ đơn giản là trễ mất một khối đệm; thêm <code>stdbuf -oL</code> vào lệnh được thay thế là hai bên giống hệt nhau',
            ),
            B(
              'A process substitution is a SEPARATE PROCESS and the shell does not wait for it, so it keeps draining after the script exits. It matters whenever something reads the log&#39;s last line to decide whether the deploy finished — a wrapper, a CI step, a monitor — because that is then a genuine race. B has no such gap',
              'Một phép thay thế tiến trình là một TIẾN TRÌNH RIÊNG và shell KHÔNG chờ nó, nên nó còn tiếp tục rút cạn sau khi script đã thoát. Nó có trọng lượng mỗi khi có thứ gì đó ĐỌC dòng cuối của nhật ký để quyết định xem lần deploy đã xong chưa — một script bao ngoài, một bước CI, một bộ giám sát — vì khi ấy đó là một cuộc đua THẬT. B không có cái khe ấy',
            ),
            B(
              'The <code>2&gt;&amp;1</code> in A is evaluated before the substitution is set up, so stderr goes to the original descriptor and arrives out of order relative to stdout; the two streams then interleave unpredictably and the last line written is whichever stream happened to flush last, so moving the redirect to the front of the line fixes the ordering entirely',
              'Phần <code>2&gt;&amp;1</code> ở A được đánh giá TRƯỚC khi phép thay thế được dựng lên, nên stderr đi vào mô tả tệp gốc và tới nơi lệch thứ tự so với stdout; hai luồng khi ấy xen vào nhau không đoán trước được và dòng cuối cùng được ghi ra là của luồng nào tình cờ xả sau, nên chuyển cái chuyển hướng lên đầu dòng là hết lệch',
            ),
            B(
              'B is the one with the race: <code>tee -a</code> opens the file in append mode per call, so two lines written in the same millisecond can interleave, and A is the correct form because a single long-lived writer holds the file open throughout',
              'B mới là cái có cuộc đua: <code>tee -a</code> mở tệp ở chế độ nối thêm ở MỖI lần gọi, nên hai dòng ghi trong cùng một mili giây có thể xen vào nhau, và A mới là dạng đúng vì một tiến trình ghi sống lâu duy nhất giữ tệp mở suốt',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, three times out of three, which is what turns this from a theoretical worry into a fact about your deploy log. The elegant form works and has a documented property people do not notice: the shell does not wait for a process substitution, so it is still draining while the script&#39;s exit code is already being read. If nothing downstream cares about the last line, A is fine and pleasant. If a wrapper greps for <code>XONG</code>, or CI reads the tail of the log to decide whether to proceed, you have built a race into the thing whose job is to tell you what happened. The per-line function has no such gap because the write completes before the function returns. Two related habits from the same lesson: a timestamped log turns "the deploy was slow" into "step 2 took 900 ms", which is the difference between a complaint and a measurement; and <code>set -x</code> with <code>PS4=&#39;+ ${BASH_SOURCE##*/}:${LINENO}: &#39;</code> shows every command that actually ran with line numbers and expanded variables — never leave that on in a script that touches secrets. Option D describes a real hazard of concurrent appends that does not apply here, because a single script writing its own log has one writer.',
            'Đã đo, ba trên ba lượt, và chính điều đó biến chuyện này từ một nỗi lo lý thuyết thành một sự kiện về nhật ký deploy của bạn. Cái dạng thanh lịch kia CHẠY ĐƯỢC và mang một tính chất có ghi trong tài liệu mà người ta không để ý: shell KHÔNG CHỜ một phép thay thế tiến trình, nên nó vẫn đang rút cạn trong khi mã thoát của script đã bị đọc mất rồi. Nếu chẳng có gì ở phía sau quan tâm tới dòng cuối thì A vẫn ổn và dễ chịu. Nhưng nếu một script bao ngoài đi grep chữ <code>XONG</code>, hoặc CI đọc phần đuôi nhật ký để quyết định có đi tiếp hay không, thì bạn vừa cài một cuộc đua vào đúng cái thứ có nhiệm vụ kể cho bạn nghe chuyện gì đã xảy ra. Cái hàm ghi-từng-dòng không có khe ấy vì lệnh ghi HOÀN TẤT trước khi hàm trả về. Hai thói quen họ hàng từ cùng bài học: một nhật ký có dấu thời gian biến "lần deploy chậm" thành "bước 2 tốn 900 ms", và đó là khác biệt giữa một lời than phiền với một phép đo; còn <code>set -x</code> kèm <code>PS4=&#39;+ ${BASH_SOURCE##*/}:${LINENO}: &#39;</code> thì cho thấy MỌI lệnh thật sự đã chạy, kèm số dòng và biến đã khai triển — và đừng bao giờ để nó bật trong một script có đụng tới bí mật. Phương án D mô tả một mối nguy CÓ THẬT của việc nối thêm đồng thời nhưng không áp vào đây, vì một script tự ghi nhật ký của chính nó thì chỉ có MỘT bên ghi.',
          ),
        }),

        // q27 · đáp án A
        mcq({
          prompt: B(
            'A deploy script is debugged with <code>set -x</code> and the flag is left in. The migration step reads its password from a variable. Measured on bash 5.2.15:' +
            code('MAT_KHAU="$(doc-bi-mat)"\n' +
                 'psql "postgres://ung_dung:$MAT_KHAU@127.0.0.1:5432/de" -c \'select 1\'') +
            'and what the deploy log received:' +
            code("+ psql postgres://ung_dung:MAT_KHAU_GIA_LAP@127.0.0.1:5432/de -c 'select 1'") +
            'What is the rule, and what is <code>set -x</code> still good for?',
            'Một script deploy được gỡ lỗi bằng <code>set -x</code> và cái cờ ấy bị bỏ quên lại trong script. Bước migration đọc mật khẩu của nó từ một biến. Đo trên bash 5.2.15:' +
            code('MAT_KHAU="$(doc-bi-mat)"\n' +
                 'psql "postgres://ung_dung:$MAT_KHAU@127.0.0.1:5432/de" -c \'select 1\'') +
            'và thứ mà nhật ký deploy nhận được:' +
            code("+ psql postgres://ung_dung:MAT_KHAU_GIA_LAP@127.0.0.1:5432/de -c 'select 1'") +
            'Quy tắc là gì, và <code>set -x</code> vẫn còn tốt cho việc gì?',
          ),
          options: [
            B(
              '<code>set -x</code> prints commands with their variables EXPANDED, so a token goes into the deploy log — where it sits in CI output, in log aggregation, and in whatever backups those have. Turn it on around the section you are debugging and off again with <code>set +x</code>; it is worth having because you see the path the script actually built rather than the one you thought it would',
              '<code>set -x</code> in ra các lệnh với biến ĐÃ ĐƯỢC KHAI TRIỂN, nên một token đi thẳng vào nhật ký deploy — nơi nó nằm lại trong đầu ra CI, trong hệ thống gom log, và trong mọi bản sao lưu của những thứ đó. Hãy bật nó quanh đúng đoạn bạn đang gỡ lỗi rồi tắt lại bằng <code>set +x</code>; nó đáng có vì bạn nhìn thấy đường dẫn mà script THẬT SỰ dựng ra chứ không phải đường dẫn bạn TƯỞNG nó sẽ dựng',
            ),
            B(
              'The rule is to redirect the trace away from the log: <code>exec 19&gt;/dev/null; BASH_XTRACEFD=19</code> keeps the expansion out of the deploy output while preserving the trace for interactive debugging, so the flag can safely be left in permanently',
              'Quy tắc là chuyển hướng vết ra khỏi nhật ký: <code>exec 19&gt;/dev/null; BASH_XTRACEFD=19</code> giữ phần khai triển ra ngoài đầu ra của lần deploy trong khi vẫn giữ vết cho việc gỡ lỗi tương tác, nên cái cờ ấy để nguyên vĩnh viễn cũng an toàn',
            ),
            B(
              'The measurement is the argument for quoting: bash printed the password because the URL was inside double quotes, and single-quoting the variable would have made the trace print <code>$MAT_KHAU</code> literally instead of its contents',
              'Phép đo này là lý lẽ cho việc BỌC NHÁY: bash in ra mật khẩu vì cái URL nằm trong nháy kép, còn bọc biến bằng nháy đơn thì vết sẽ in ra <code>$MAT_KHAU</code> nguyên văn thay vì nội dung của nó',
            ),
            B(
              '<code>set -x</code> is a safety flag rather than a diagnosis flag, and the leak is acceptable on a private CI runner; the real rule is that any script printing a trace should also set <code>PS4</code> so each line carries a file and line number',
              '<code>set -x</code> là một cờ AN TOÀN chứ không phải cờ chẩn đoán, và việc lộ ấy chấp nhận được trên một máy chạy CI riêng tư; quy tắc thật là mọi script có in vết đều nên đặt <code>PS4</code> để mỗi dòng mang theo tên tệp và số dòng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Expansion is the whole point of the trace and the whole danger of it. Precisely because you see the value the script actually used, <code>set -x</code> is the right tool for the class of bug where <code>-u</code> was missing and a path got rooted at <code>/</code> — the trace shows <code>rm -rf /xxx</code> rather than <code>rm -rf "$GOC/xxx"</code>. And precisely because you see the value, a line like <code>psql "postgres://…:$MAT_KHAU@…"</code> writes the credential into the deploy log. Option C misreads the mechanism: bash expands the variable before printing regardless of quoting style, and single-quoting the URL would stop the expansion in the <em>command</em>, not in the trace — <code>psql</code> would then be handed the literal <code>$MAT_KHAU</code>. <code>PS4=&#39;+ ${BASH_SOURCE##*/}:${LINENO}: &#39;</code> is a genuine improvement and belongs in the same section of the answer as option D claims, but it does nothing about the leak. The general rule is Chapter 4\'s applied to logs: choose what appears explicitly, never dump whole objects, and remember that a log line is written to disk, shipped to an aggregator, backed up, and retained for months.',
            'Việc KHAI TRIỂN vừa là toàn bộ ý nghĩa của cái vết vừa là toàn bộ mối nguy của nó. Chính vì bạn nhìn thấy GIÁ TRỊ mà script thật sự dùng, <code>set -x</code> mới là công cụ đúng cho lớp lỗi mà <code>-u</code> bị thiếu và một đường dẫn bị mọc rễ ở <code>/</code> — cái vết cho thấy <code>rm -rf /xxx</code> chứ không phải <code>rm -rf "$GOC/xxx"</code>. Và cũng chính vì bạn nhìn thấy giá trị, một dòng như <code>psql "postgres://…:$MAT_KHAU@…"</code> sẽ ghi thẳng thông tin xác thực vào nhật ký deploy. Phương án C đọc sai cơ chế: bash khai triển biến TRƯỚC khi in ra bất kể kiểu bọc nháy nào, và bọc nháy đơn quanh cái URL sẽ chặn khai triển trong chính CÂU LỆNH chứ không phải trong cái vết — khi ấy <code>psql</code> sẽ nhận đúng chuỗi <code>$MAT_KHAU</code> nguyên văn. <code>PS4=&#39;+ ${BASH_SOURCE##*/}:${LINENO}: &#39;</code> là một cải thiện có thật và thuộc về đúng phần mà phương án D nói tới, nhưng nó chẳng làm gì được với chuyện lộ bí mật. Quy tắc chung là Chương 4 áp cho nhật ký: hãy CHỌN thứ được phép hiện ra một cách tường minh, đừng bao giờ đổ nguyên cả đối tượng ra, và nhớ rằng một dòng log được ghi xuống đĩa, được chuyển tới hệ thống gom log, được sao lưu, và được giữ lại hàng tháng trời.',
          ),
        }),

        // q28 · đáp án C
        mcq({
          prompt: B(
            'A smoke test at the end of a deploy, and the version it was written to catch:' +
            code('for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do\n' +
                 '  MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://127.0.0.1:$CONG$R")\n' +
                 '  case "$MA" in\n' +
                 '    404)     echo " ✗ $R → 404"; LOI=1 ;;\n' +
                 '    200|401) echo " ✓ $R → $MA" ;;\n' +
                 '    *)       echo " ? $R → $MA"; LOI=1 ;;\n' +
                 '  esac\n' +
                 'done') +
            'A colleague wants to add <code>/auth/login</code> and <code>/stickers/:id</code> to the list "for better coverage". What is wrong with that, and why is <code>401</code> a pass?',
            'Một bộ kiểm khói ở cuối một lần deploy, và cái phiên bản mà nó được viết ra để bắt:' +
            code('for R in /health /api/v1/don /api/v1/gifs /api/v1/tin; do\n' +
                 '  MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://127.0.0.1:$CONG$R")\n' +
                 '  case "$MA" in\n' +
                 '    404)     echo " ✗ $R → 404"; LOI=1 ;;\n' +
                 '    200|401) echo " ✓ $R → $MA" ;;\n' +
                 '    *)       echo " ? $R → $MA"; LOI=1 ;;\n' +
                 '  esac\n' +
                 'done') +
            'Một đồng nghiệp muốn thêm <code>/auth/login</code> và <code>/stickers/:id</code> vào danh sách "để phủ tốt hơn". Cách ấy sai ở đâu, và vì sao <code>401</code> lại được tính là ĐẠT?',
          ),
          options: [
            B(
              'Nothing is wrong — more routes is strictly more coverage — and <code>401</code> passes because an unauthenticated request is the cheapest way to confirm the authentication middleware is mounted, which is the layer most likely to be missing',
              'Chẳng có gì sai — thêm tuyến là phủ thêm, đơn giản vậy thôi — và <code>401</code> đạt vì một request không xác thực là cách rẻ nhất xác nhận tầng middleware xác thực đã được gắn, mà đó lại là tầng dễ thiếu nhất',
            ),
            B(
              'The two new routes would need credentials, so the smoke test would have to hold a token — the objection is secret handling rather than correctness, since a credential in a deploy script is a credential in CI output, and the answer is a read-only service account whose token is read from run-time environment rather than baked into the script',
              'Hai tuyến mới sẽ cần thông tin xác thực, nên bộ kiểm khói phải giữ một token — phản đối ở đây là chuyện quản lý bí mật chứ không phải tính đúng đắn, vì một thông tin xác thực nằm trong script deploy là một thông tin xác thực nằm trong đầu ra CI, và câu trả lời là một tài khoản dịch vụ chỉ-đọc với token đọc từ môi trường lúc chạy chứ không nướng vào script',
            ),
            B(
              'A POST-only route and a route requiring a path parameter both return non-200 on a bare unauthenticated GET, so every deploy would fail on routes that were never going to answer. And <code>401</code> passes because the test is not testing the handler — it is testing that the ROUTER mounted it: 401 means mounted and needs auth, 404 means not mounted, which is a stale or partial build',
              'Một tuyến chỉ nhận POST và một tuyến đòi tham số đường dẫn đều trả về khác 200 với một lệnh GET trần không xác thực, nên MỌI lần deploy sẽ hỏng trên những tuyến vốn dĩ chẳng bao giờ định trả lời. Còn <code>401</code> đạt vì phép kiểm này không kiểm cái HANDLER — nó kiểm rằng BỘ ĐỊNH TUYẾN đã gắn tuyến ấy: 401 nghĩa là đã gắn và cần xác thực, 404 nghĩa là CHƯA gắn, tức một bản dựng cũ hoặc dở dang',
            ),
            B(
              'The list should be generated from the router at build time rather than hand-maintained, so that a new module cannot be forgotten; <code>401</code> passes only as a transitional measure until every route has a public health variant',
              'Danh sách nên được SINH RA từ bộ định tuyến lúc dựng chứ không phải duy trì bằng tay, để một mô-đun mới không thể bị quên; còn <code>401</code> chỉ đạt như một biện pháp chuyển tiếp cho tới khi mọi tuyến đều có một biến thể công khai để kiểm sức khoẻ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The 401-is-a-pass trick is what makes a smoke test possible without a single credential, and it works because of what the test is for: not correctness — you have tests for that, and they ran before the artifact was built — but "is the thing running actually the thing I just deployed, and is all of it there". This repository\'s own deploy script does exactly this and its notes are blunt about the diagnosis: 401 = mounted (needs auth), 200 = mounted (public), 404 = NOT mounted / stale build. The same notes carry the warning in option C, learned the way everybody learns it: do NOT add POST-only or param-required routes, or every deploy will false-fail. And a smoke test that cries wolf gets commented out within a week, at which point it is protecting nothing. Option D describes a real improvement with a real cost — a generated list is only as good as the generator, and it drifts silently when the router changes shape. The rule when you add a feature module is narrower and cheaper: add one of its param-less, unauthenticated GET routes to the list.',
            'Mẹo "401 là ĐẠT" chính là thứ làm cho một bộ kiểm khói khả thi mà không cần một thông tin xác thực nào, và nó chạy được nhờ vào MỤC ĐÍCH của phép kiểm: không phải tính đúng đắn — bạn đã có kiểm thử cho việc đó rồi, và chúng chạy trước khi tạo tác được dựng ra — mà là "thứ đang chạy có ĐÚNG là thứ tôi vừa deploy không, và nó có ĐỦ không". Chính script deploy của kho mã này làm y như vậy và ghi chú của nó nói thẳng cách chẩn đoán: 401 = đã gắn (cần xác thực), 200 = đã gắn (công khai), 404 = CHƯA gắn / bản dựng cũ. Cũng chính ghi chú ấy mang theo lời cảnh báo ở phương án C, học được theo đúng cách ai cũng học: ĐỪNG thêm tuyến chỉ-POST hay tuyến đòi tham số, không thì mọi lần deploy sẽ hỏng giả. Mà một bộ kiểm khói hay kêu oan thì trong vòng một tuần sẽ bị đem đi chú thích lại, và tới lúc đó nó chẳng bảo vệ gì cả. Phương án D mô tả một cải thiện có thật với một cái giá có thật — một danh sách được sinh ra chỉ tốt bằng cái bộ sinh ra nó, và nó trôi dạt âm thầm khi bộ định tuyến đổi hình dạng. Quy tắc khi bạn thêm một mô-đun tính năng thì hẹp hơn và rẻ hơn: thêm MỘT tuyến GET không tham số, không cần xác thực của nó vào danh sách.',
          ),
        }),

        // q29 · đáp án D
        mcq({
          prompt: B(
            'A deploy script cleans up with a <code>trap</code>. Measured on bash 5.2.15, three runs:' +
            code('#!/bin/bash\n' +
                 'set -euo pipefail\n' +
                 'don_dep() {\n' +
                 '  local ma=$?\n' +
                 '  echo "  [trap] \\$?=$ma"\n' +
                 '  echo abc | grep -q "khong-co-trong-day"\n' +
                 '  echo "  [trap] dong nay CHAY khong?"\n' +
                 '  return $ma\n' +
                 '}\n' +
                 'trap don_dep EXIT\n' +
                 'echo "  than script"; exit 7') +
            code('  than script\n' +
                 '  [trap] $?=7\n' +
                 '  ma thoat = 1') +
            'The trap read <code>$?</code> correctly. Why did the caller see 1?',
            'Một script deploy dọn dẹp bằng một <code>trap</code>. Đo trên bash 5.2.15, ba lượt chạy:' +
            code('#!/bin/bash\n' +
                 'set -euo pipefail\n' +
                 'don_dep() {\n' +
                 '  local ma=$?\n' +
                 '  echo "  [trap] \\$?=$ma"\n' +
                 '  echo abc | grep -q "khong-co-trong-day"\n' +
                 '  echo "  [trap] dong nay CHAY khong?"\n' +
                 '  return $ma\n' +
                 '}\n' +
                 'trap don_dep EXIT\n' +
                 'echo "  than script"; exit 7') +
            code('  than script\n' +
                 '  [trap] $?=7\n' +
                 '  ma thoat = 1') +
            'Cái trap đã đọc <code>$?</code> ĐÚNG. Vậy vì sao bên gọi lại nhận được 1?',
          ),
          options: [
            B(
              'Because <code>return</code> inside a trap handler is ignored: bash uses the status of the last command executed in the handler, so the fix is to end the handler with <code>exit $ma</code> rather than <code>return $ma</code>',
              'Vì <code>return</code> bên trong một trình xử lý trap bị bỏ qua: bash lấy trạng thái của LỆNH CUỐI được chạy trong trình xử lý, nên cách chữa là kết thúc trình xử lý bằng <code>exit $ma</code> chứ không phải <code>return $ma</code>',
            ),
            B(
              'Because <code>local ma=$?</code> captured the status of <code>local</code> rather than of the script: <code>local</code> is itself a command, so <code>$?</code> was already overwritten, and the 7 in the output came from the earlier <code>echo</code>',
              'Vì <code>local ma=$?</code> đã chộp trạng thái của chính lệnh <code>local</code> chứ không phải của script: <code>local</code> tự nó là một lệnh nên <code>$?</code> đã bị ghi đè, và con số 7 trong đầu ra đến từ lệnh <code>echo</code> phía trước',
            ),
            B(
              'Because <code>exit 7</code> inside a script with <code>set -e</code> is rewritten to <code>exit 1</code> whenever an EXIT trap is installed, so that the trap can distinguish a deliberate exit from an errexit abort',
              'Vì <code>exit 7</code> trong một script có <code>set -e</code> sẽ bị viết lại thành <code>exit 1</code> mỗi khi có một trap EXIT được cài, để cái trap phân biệt được một lần thoát có chủ đích với một lần bị errexit ngắt',
            ),
            B(
              '<code>errexit</code> is still in force INSIDE the handler, and <code>grep -q</code> not matching returns 1 — so the handler died at that line, never reached <code>return $ma</code>, and the script exited with the status of the failing <code>grep</code>. The chosen exit code was overwritten by a command that was only looking',
              '<code>errexit</code> VẪN CÒN HIỆU LỰC BÊN TRONG trình xử lý, và <code>grep -q</code> không khớp thì trả về 1 — nên trình xử lý CHẾT ngay tại dòng đó, không bao giờ tới được <code>return $ma</code>, và script thoát ra với trạng thái của lệnh <code>grep</code> hỏng. Mã thoát bạn đã chọn bị ghi đè bởi một lệnh chỉ đang NHÌN',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured three times, same result. The line the handler never reached is the tell: <code>[trap] dong nay CHAY khong?</code> is absent from the output. A cleanup handler is ordinary shell code, so every rule that applies to the script applies inside it — and a diagnostic command that <em>fails to find something</em> is a failing command. This is the exact bug the practical exam records in its own reference answer for the swap script: a <code>grep</code> that did not match killed the trap and turned <code>exit 7</code> into <code>exit 1</code>. It only appears when you run the failure branches, because on the happy path the handler exits before reaching anything that can fail. Two habits close it: guard every looking command inside a handler (<code>grep -q … || true</code>, or an <code>if</code>), and capture <code>$?</code> as the very first thing the handler does — which this one did correctly, and it did not help, because the value was captured and then never used. And the wider rule from Chapter 7: a rollback path that has never run is not a rollback path. Cause each failure on purpose, then check the <em>machine</em> — what the front door serves, what exit code the caller gets — rather than the log.',
            'Đã đo ba lượt, kết quả như nhau. Cái dòng mà trình xử lý KHÔNG BAO GIỜ tới được chính là dấu vết: <code>[trap] dong nay CHAY khong?</code> vắng mặt trong đầu ra. Một trình xử lý dọn dẹp là mã shell BÌNH THƯỜNG, nên mọi quy tắc áp cho script đều áp cả bên trong nó — và một lệnh chẩn đoán KHÔNG TÌM THẤY thứ nó tìm là một lệnh HỎNG. Đây đúng là con bọ mà đề thi thực hành ghi lại trong chính đáp án mẫu của nó cho script tráo: một lệnh <code>grep</code> không khớp đã giết cái trap và biến <code>exit 7</code> thành <code>exit 1</code>. Nó chỉ lòi ra khi bạn CHẠY các nhánh hỏng, vì trên đường thành công thì trình xử lý thoát trước khi chạm tới bất cứ thứ gì có thể hỏng. Hai thói quen khép nó lại: bọc chốt cho MỌI lệnh chỉ-nhìn bên trong một trình xử lý (<code>grep -q … || true</code>, hoặc một khối <code>if</code>), và chộp <code>$?</code> ngay ở việc ĐẦU TIÊN trình xử lý làm — mà cái này đã làm ĐÚNG, và nó chẳng cứu được gì, vì giá trị được chộp về rồi không bao giờ được dùng tới. Còn quy tắc rộng hơn từ Chương 7: một đường lùi bản CHƯA TỪNG CHẠY thì không phải một đường lùi bản. Hãy gây ra từng cú hỏng một cách có chủ đích, rồi kiểm CÁI MÁY — cửa trước đang phục vụ gì, bên gọi nhận mã thoát nào — chứ đừng kiểm cái nhật ký.',
          ),
        }),

        // q30 · đáp án B
        mcq({
          prompt: B(
            'A finished deploy script is run three times in a row against the same release. Which of these is the test that proves it is safe to re-run, and what does the shape of the script have to be for that test to pass?',
            'Một script deploy đã hoàn thiện được chạy ba lượt liên tiếp trên cùng một bản phát hành. Đâu là phép kiểm chứng minh nó chạy lại được an toàn, và script phải có HÌNH DẠNG thế nào thì phép kiểm ấy mới đạt?',
          ),
          options: [
            B(
              'Run it three times and confirm the exit code is 0 each time and that the log of the third run matches the first; the shape required is that every step is guarded by an existence check — <code>[ -d ]</code> before a <code>mkdir</code>, <code>[ -L ]</code> before a symlink — so nothing is attempted twice',
              'Chạy ba lượt và xác nhận mã thoát lần nào cũng là 0 và nhật ký lượt thứ ba khớp với lượt đầu; hình dạng cần có là mọi bước đều được bọc bởi một phép kiểm tồn tại — <code>[ -d ]</code> trước một lệnh <code>mkdir</code>, <code>[ -L ]</code> trước một cái symlink — để không thứ gì bị làm hai lần',
            ),
            B(
              'Run it twice with no changes and DIFF THE MACHINE STATE before and after the second run: if anything differs, the script is not idempotent. The shape required is that the end state depends only on the arguments — preparation happens off to the side, the swap is one atomic operation at the END, and verification comes after it',
              'Chạy hai lượt mà không đổi gì rồi SO TRẠNG THÁI CÁI MÁY trước và sau lượt thứ hai: có gì khác đi là script chưa chạy-lại-được. Hình dạng cần có là trạng thái cuối chỉ phụ thuộc vào THAM SỐ — bước chuẩn bị diễn ra ở bên lề, bước tráo là MỘT thao tác nguyên tử nằm ở CUỐI, và phần kiểm chứng đến sau nó',
            ),
            B(
              'Run it once, kill it at a random step, and re-run: only an interrupted run exercises the resume path, and a script that survives that is idempotent by definition, whatever the state diff says',
              'Chạy một lượt, giết nó ở một bước ngẫu nhiên, rồi chạy lại: chỉ một lượt bị ngắt mới thử được đường tiếp tục, và một script sống sót qua đó thì theo định nghĩa là chạy-lại-được, bất kể phép so trạng thái nói gì',
            ),
            B(
              'Compare the deploy logs of the three runs: identical logs prove identical behaviour, which is a stronger guarantee than a state diff because it also covers steps that make no persistent change',
              'So ba tệp nhật ký deploy của ba lượt: nhật ký giống hệt nhau chứng minh hành vi giống hệt nhau, và đó là một bảo đảm MẠNH HƠN một phép so trạng thái vì nó phủ cả những bước không tạo ra thay đổi lâu dài nào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The failure this test is built to find is the quiet one. A script made half-idempotent — <code>mkdir -p</code>, <code>ln -sfn</code>, and an <code>echo &gt;&gt;</code> left alone — ran five times cleanly, exited 0 every time, and left five copies of the same <code>PATH</code> line in a config file, with no exit code reporting it. That damage is invisible until something downstream chokes on it: a duplicated server block in nginx, a cron entry that now runs five times, a <code>PATH</code> long enough to hit <code>E2BIG</code>. Only a state diff catches it, which is why option A and option D both fail — they are exactly the signals the broken script produced. Option C describes a genuinely useful second test and mislabels it: surviving an interruption is a different property from idempotence, and it is the one you get from ordering the steps so the visible one is last. That ordering is what made the measured half-failure harmless: a script that died at step 3 of 4 left a half-built directory and a symlink still pointing at the old release, so the site kept working through the entire failure. Everything before the swap is preparation on the side, invisible to users; the swap is one <code>rename(2)</code>; anything after it is verification, and its failure triggers the rollback.',
            'Cú hỏng mà phép kiểm này sinh ra để tìm là cú hỏng IM LẶNG. Một script được làm cho chạy-lại-được NỬA VỜI — <code>mkdir -p</code>, <code>ln -sfn</code>, và một dòng <code>echo &gt;&gt;</code> để nguyên — đã chạy năm lượt sạch sẽ, lượt nào cũng thoát 0, và để lại năm bản sao của cùng một dòng <code>PATH</code> trong một tệp cấu hình, không mã thoát nào báo. Thiệt hại ấy vô hình cho tới khi có thứ ở phía sau nghẹn vì nó: một khối server lặp lại trong nginx, một mục cron giờ chạy năm lần, một biến <code>PATH</code> dài tới mức đụng <code>E2BIG</code>. Chỉ một phép SO TRẠNG THÁI mới bắt được, và vì thế cả phương án A lẫn phương án D đều trượt — chúng đúng là những tín hiệu mà cái script hỏng kia đã tạo ra. Phương án C mô tả một phép kiểm thứ hai thật sự hữu ích rồi dán nhầm nhãn cho nó: sống sót qua một lần bị ngắt là một TÍNH CHẤT KHÁC với chạy-lại-được, và nó là thứ bạn có được nhờ SẮP THỨ TỰ các bước sao cho bước nhìn thấy được nằm ở cuối. Chính cái thứ tự ấy đã làm cho cú hỏng nửa chừng đo được trở nên vô hại: một script chết ở bước 3 trên 4 để lại một thư mục dựng dở và một symlink vẫn trỏ vào bản cũ, nên trang web chạy suốt qua cả cú hỏng. Mọi thứ TRƯỚC bước tráo là chuẩn bị ở bên lề, vô hình với người dùng; bước tráo là MỘT lệnh <code>rename(2)</code>; còn mọi thứ SAU nó là kiểm chứng, và cú hỏng của nó kích hoạt đường lùi bản.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'bash',
          prompt: B(
            '<p><b>Q31 — Be the deploy script: work out the exit code and what the front door serves (chapters 7.3 and 7.5).</b> Implement <code>quyet_dinh</code>: it takes one scenario as a string of <code>khoa=gia-tri</code> pairs and prints one line saying which exit code the caller gets, whether the machine changed, and which release the front door ends up serving.</p>' +
            '<p>Before the deploy, the front door is serving <code>v2</code>; the release being deployed is <code>v3</code>.</p>' +
            '<p><b>The order of the checks is the answer.</b> Every check that can say no runs before the lock and before the first file is created — that is what makes a refusal leave the machine byte-identical. Evaluate in exactly this order and stop at the first one that fires:</p>' +
            '<ul>' +
            '<li><code>cong-cu=thieu</code> → exit <b>5</b>, a required tool is missing</li>' +
            '<li><code>ban=KHONG</code> → exit <b>2</b>, no such release</li>' +
            '<li>consent — skipped entirely when <code>dong-y=co</code>. Otherwise: <code>tty=khong</code> → exit <b>4</b>, there is no terminal to ask on; then <code>tra-loi</code> that is not <code>y</code> → exit <b>3</b>, the user said no</li>' +
            '<li><code>khoa=ban</code> → exit <b>1</b>, another deploy holds the lock</li>' +
            '<li><code>tao-tac=thieu</code> → exit <b>6</b>, the artifact is malformed</li>' +
            '<li><code>len=khong</code> → exit <b>7</b>, the new release never came up</li>' +
            '<li><code>khoi=404</code> → exit <b>8</b>, the smoke test found an unmounted route</li>' +
            '<li><code>ban-thay</code> that is not <code>v3</code> → exit <b>9</b>, the front door disagrees</li>' +
            '<li>otherwise exit <b>0</b></li>' +
            '</ul>' +
            '<p>The first four are <b>refusals</b>: nothing was written, so the machine is <code>KHONG DOI</code> and the front door is still <code>v2</code>. The last four are <b>failures</b> after the lock: the cleanup handler rolls back, so the machine is <code>DA LUI</code> and the front door is <code>v2</code> again. Success is <code>DA TRAO</code> and <code>v3</code>.</p>' +
            code('A ma=0 loai=XONG ly-do=thanh-cong may=DA TRAO cua-truoc=v3') +
            '<p>Keep the given array, the starting version and the printing loop exactly as they are. Pure shell only — no <code>curl</code>, no <code>flock</code>, no filesystem.</p>',

            '<p><b>Câu 31 — Hãy làm script deploy: tính ra mã thoát và thứ mà cửa trước đang phục vụ (chương 7.3 và 7.5).</b> Cài đặt <code>quyet_dinh</code>: nhận một kịch bản dưới dạng một chuỗi các cặp <code>khoa=gia-tri</code> rồi in ra một dòng nói rõ bên gọi nhận mã thoát nào, cái máy có ĐỔI không, và cửa trước rốt cuộc phục vụ bản nào.</p>' +
            '<p>Trước lần deploy, cửa trước đang phục vụ <code>v2</code>; bản đang được deploy là <code>v3</code>.</p>' +
            '<p><b>THỨ TỰ các phép kiểm chính là câu trả lời.</b> Mọi phép kiểm CÓ THỂ nói không đều chạy TRƯỚC khoá và TRƯỚC khi tệp đầu tiên được tạo ra — đó là thứ làm cho một lời từ chối để lại cái máy y nguyên từng byte. Hãy xét đúng theo thứ tự này và DỪNG ở cái đầu tiên nổ:</p>' +
            '<ul>' +
            '<li><code>cong-cu=thieu</code> → thoát <b>5</b>, thiếu một công cụ bắt buộc</li>' +
            '<li><code>ban=KHONG</code> → thoát <b>2</b>, không có bản phát hành ấy</li>' +
            '<li>đồng ý — BỎ QUA hẳn khi <code>dong-y=co</code>. Ngược lại: <code>tty=khong</code> → thoát <b>4</b>, không có terminal nào để hỏi; rồi <code>tra-loi</code> khác <code>y</code> → thoát <b>3</b>, người dùng nói không</li>' +
            '<li><code>khoa=ban</code> → thoát <b>1</b>, một lần deploy khác đang giữ khoá</li>' +
            '<li><code>tao-tac=thieu</code> → thoát <b>6</b>, tạo tác hỏng</li>' +
            '<li><code>len=khong</code> → thoát <b>7</b>, bản mới không lên được</li>' +
            '<li><code>khoi=404</code> → thoát <b>8</b>, bộ kiểm khói gặp một tuyến chưa gắn</li>' +
            '<li><code>ban-thay</code> khác <code>v3</code> → thoát <b>9</b>, cửa trước nói khác</li>' +
            '<li>còn lại thì thoát <b>0</b></li>' +
            '</ul>' +
            '<p>Bốn cái đầu là <b>TỪ CHỐI</b>: chưa ghi gì cả, nên máy là <code>KHONG DOI</code> và cửa trước vẫn là <code>v2</code>. Bốn cái cuối là <b>HỎNG</b> sau khi đã lấy khoá: trình xử lý dọn dẹp lùi bản, nên máy là <code>DA LUI</code> và cửa trước lại là <code>v2</code>. Thành công thì là <code>DA TRAO</code> và <code>v3</code>.</p>' +
            code('A ma=0 loai=XONG ly-do=thanh-cong may=DA TRAO cua-truoc=v3') +
            '<p>Giữ nguyên mảng cho sẵn, phiên bản xuất phát và vòng lặp in kết quả. Chỉ dùng shell thuần — không <code>curl</code>, không <code>flock</code>, không đụng hệ thống tệp.</p>',
          ),
          starterCode: PT2_Q31_STARTER,
          expectedOutput: PT2_Q31_OUTPUT,
          sampleSolution: PT2_Q31_SOLUTION,
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — How far back can you actually roll? (chapters 5.1, 5.2 and 6.2).</b> Implement <code>chay(suKien)</code>, which replays a list of schema changes and deploys, and after each one reports which releases still work and how far back you could go.</p>' +
            '<p>The schema is a set of column names, each either optional or <b>required</b> (<code>NOT NULL</code> with no default). Every release declares the columns it <code>doc</code> (reads) and the columns it <code>ghi</code> (writes).</p>' +
            '<p><b>A release still works against the current schema if and only if</b> every column it reads or writes still exists, <b>and</b> every required column of the schema is one it writes — because if it is not, every insert that release makes fails.</p>' +
            '<p>The events:</p>' +
            '<ul>' +
            '<li><code>deploy vN</code> — <code>vN</code> becomes the running release.</li>' +
            '<li><code>luoc-do them &lt;cot&gt;</code> — add an optional column.</li>' +
            '<li><code>luoc-do them-bat-buoc &lt;cot&gt;</code> — add a required one.</li>' +
            '<li><code>luoc-do bo &lt;cot&gt;</code> — drop a column.</li>' +
            '<li><code>luoc-do doi-ten &lt;cu&gt; &lt;moi&gt;</code> — rename, keeping whether it was required.</li>' +
            '</ul>' +
            '<p><b><code>khoang-lui</code></b> is the number of releases you can step back from the running one, counting backwards through <code>BAN</code> and <b>stopping at the first release that does not work</b> — stepping two back over a dead release is not a rollback you can perform.</p>' +
            '<p>One line per event, with the event padded to 30 characters:</p>' +
            code('luoc-do bo email               ht=v4 luoc-do=[id,ten,dia_chi_email] chay-duoc=[v4] khoang-lui=0') +
            '<p>Append <code>  ← BAN DANG CHAY DA CHET</code> (two spaces before the arrow) when the running release itself no longer works. Columns and release names are listed in the order they were added or declared, not sorted.</p>' +
            '<p>Watch what the last three events do to <code>khoang-lui</code>. Keep the given data and the printing loop exactly as they are, and use only what Node has built in.</p>',

            '<p><b>Câu 32 — Bạn LÙI ĐƯỢC bao xa, thật ra? (chương 5.1, 5.2 và 6.2).</b> Cài đặt <code>chay(suKien)</code>: phát lại một danh sách các thay đổi lược đồ và các lần deploy, rồi sau mỗi cái báo xem những bản phát hành nào còn chạy được và bạn lùi được bao xa.</p>' +
            '<p>Lược đồ là một tập tên cột, mỗi cột hoặc là tuỳ chọn hoặc là <b>BẮT BUỘC</b> (<code>NOT NULL</code> không có mặc định). Mỗi bản phát hành khai những cột nó <code>doc</code> (đọc) và những cột nó <code>ghi</code>.</p>' +
            '<p><b>Một bản phát hành còn chạy được với lược đồ hiện tại KHI VÀ CHỈ KHI</b> mọi cột nó đọc hoặc ghi đều còn tồn tại, <b>VÀ</b> mọi cột BẮT BUỘC của lược đồ đều nằm trong danh sách nó GHI — vì nếu không thì mọi lệnh chèn của bản ấy đều hỏng.</p>' +
            '<p>Các sự kiện:</p>' +
            '<ul>' +
            '<li><code>deploy vN</code> — <code>vN</code> trở thành bản đang chạy.</li>' +
            '<li><code>luoc-do them &lt;cot&gt;</code> — thêm một cột tuỳ chọn.</li>' +
            '<li><code>luoc-do them-bat-buoc &lt;cot&gt;</code> — thêm một cột bắt buộc.</li>' +
            '<li><code>luoc-do bo &lt;cot&gt;</code> — bỏ một cột.</li>' +
            '<li><code>luoc-do doi-ten &lt;cu&gt; &lt;moi&gt;</code> — đổi tên, giữ nguyên tính bắt buộc.</li>' +
            '</ul>' +
            '<p><b><code>khoang-lui</code></b> là số bản phát hành bạn lùi được tính từ bản đang chạy, đếm NGƯỢC qua mảng <code>BAN</code> và <b>DỪNG ở bản đầu tiên không chạy được</b> — lùi hai bước qua một bản đã chết thì không phải một cú lùi bạn thực hiện được.</p>' +
            '<p>Mỗi sự kiện một dòng, tên sự kiện đệm tới 30 ký tự:</p>' +
            code('luoc-do bo email               ht=v4 luoc-do=[id,ten,dia_chi_email] chay-duoc=[v4] khoang-lui=0') +
            '<p>Nối thêm <code>  ← BAN DANG CHAY DA CHET</code> (hai dấu cách trước mũi tên) khi chính bản đang chạy cũng không còn chạy được. Cột và tên bản được liệt kê theo THỨ TỰ thêm vào hoặc khai báo, không sắp lại.</p>' +
            '<p>Hãy để ý ba sự kiện cuối làm gì với <code>khoang-lui</code>. Giữ nguyên dữ liệu cho sẵn và vòng lặp in kết quả, và chỉ dùng những gì Node có sẵn.</p>',
          ),
          starterCode: PT2_Q32_STARTER,
          expectedOutput: PT2_Q32_OUTPUT,
          sampleSolution: PT2_Q32_SOLUTION,
        }),
      ],
    },
  ],
};
