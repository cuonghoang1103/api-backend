# Chương 18 — "Tai nạn Git thật của nhóm" (31/10/2026) — ĐÃ XONG

Đọc `_HOP-DONG.md` + `_BRIEF-CHUONG-MOI.md` trước. File chương: `s18-tai-nan-nhom.mjs` (số 17 không dùng: `s17-nhom-tu-so-0.mjs` là chương
"Khởi động nhanh", slug `git-kd-*`). Đã đăng ký vào `content/courses/git.mjs` sau `s16` (thứ tự số; bài thi cuối khoá 16.5 vì vậy nằm TRƯỚC chương 18 — nếu
chủ kênh muốn kết khoá bằng bài thi thì dời `s18` lên trước `s16` trong mảng `sections`). Bối cảnh: dự án Java web NetBeans (Ant `build/` `dist/`; Maven `target/`),
nhóm ba SV An/Bình/Chi, Windows + Mac. Mọi output trong bài/slide là output THẬT của git 2.51.1 chạy từ lab; tên người + mật khẩu mẫu là GIẢ.

## Bài (slug `git-18-…`)
| Bài | Slug | Tai nạn (lab `tao-nhom.sh <tên> --sua`) |
|---|---|---|
| 18.0 | `git-18-0-slides` (DOCUMENT, deck `git-18`, 17 slide) | — |
| 18.1 | `-1-lo-commit-build` | `build` — `git add .` sau Build; `.gitignore` thêm sau vô tác dụng; `rm --cached`; đồng đội mất tệp; mật khẩu trong lịch sử ⇒ xoay vòng |
| 18.2 | `-2-xung-dot-web-xml` | `xung-dot-web-xml` — hai khối cùng chỗ; `rev-list --count`, `merge-tree`; bẫy xoá dấu hiệu ⇒ XML hỏng (xmllint); PR để lâu |
| 18.3 | `-3-keo-main-va-push-tu-choi` | `keo-main-nham`, `push-tu-choi`, `push-tu-choi-rebase`, `push-force` — bốn thông báo; merge vs rebase; vì sao không `--force` |
| 18.4 | `-4-sua-nham-tren-main` | `sua-nham-main`, `sua-nham-main-da-push` — `ahead 2`; branch+reset; reflog; đã push ⇒ revert |
| 18.5 | `-5-tu-merge-khong-review` | `tu-merge` — merge không PR; hook MÔ PHỎNG; ruleset + CODEOWNERS (docs 10/2026, ghi rõ chỗ phải tự kiểm gói); review 5 câu |
| 18.6 | `-6-hoan-tac-merge` | `hoan-tac-merge`, `hoan-tac-merge-chua-push` — `ORIG_HEAD`; `revert -m 1`; "Already up to date"; revert cái revert |
| 18.7 | `-7-buoi-cuu-ho-nhom` | `tong-hop` — chẩn đoán 4 lệnh, sửa từng lớp ngoài→trong; bảng tra cả chương; dán `nhom-mini.sh` 20 dòng |
| 18.8 | `-8-quiz` (QUIZ, 10 câu, đáp án A/B/C/D = 3/2/3/2) | — |

Lý do KHÔNG dán nguyên `tao-nhom.sh` (~500 dòng) vào 18.7: không đọc nổi trong một bài, và sẽ lệch dần so với bản thật; bài tập 🧪 chỉ cần *vị trí xuất phát*
nên 18.7 dán bản mini 20 dòng (đã chạy thử, cách ly HOME). Script đầy đủ nằm ở `content/courses/git/lab18/tao-nhom.sh` trong repo.

## Cấu trúc thư mục
- `lab18/tao-nhom.sh` — lab. `bash tao-nhom.sh` liệt kê tai nạn; `bash tao-nhom.sh tat-ca --sua` chạy hết (đã chạy exit 0). An toàn: HOME ép sang thư mục tạm, remote là kho bare cục bộ, chặn SSH, không mạng.
- `lab18/_dung/` — BỘ DỰNG bài (đừng sửa tay `s18-tai-nan-nhom.mjs`; nó được SINH RA):
  - `p-head.tpl`, `p-180.tpl` … `p-188.tpl`, `p-end.tpl` — nội dung từng bài (JS template literal) với chỗ chèn output `@@T('<tai-nan>','<lệnh bắt đầu>','<lệnh kết thúc>',…)@@`.
  - `s18.tpl` — thứ tự ghép; `out/*.txt` — output lab ĐÃ CHỤP (mã băm của một lần chạy; slide `git-18` dùng đúng các mã băm này).
  - `dung.sh` — dựng lại `s18-tai-nan-nhom.mjs` (cần python3). `lay-output.sh` — chạy lại lab ghi đè `out/` (⚠️ mã băm đổi ⇒ phải dựng lại bài VÀ cập nhật mã băm trong `scripts/slides-src/git-18.mjs` rồi dựng + upload deck sang prefix mới `GIT/v2` + `VER['git-18']='v2'` trong `_slides.mjs`; không ghi đè v1 — Cloudflare cache). Chỉ chạy lại khi thật cần.
- `scripts/slides-src/git-18.mjs` — deck 17 slide (đã dựng, đã mở xem từng ảnh, đã upload R2 `images/academy/GIT/v1/git-18/NNN.webp`).

## Kiểm đã chạy
`node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/git-18.mjs` ✓ · `node scripts/git-ghep-chuong.mjs content/courses/git/s18-tai-nan-nhom.mjs --moi --render <thư mục render>` ✓ 0 lỗi 0 cảnh báo ·
`node scripts/course-content-check.mjs ./content/courses/git.mjs` ✓ 120 bài 0 lỗi · seed thử lên DB local (cổng 5434): 99 → 120 bài, 0 slug cũ mất, 0 bài ngắn đi, không trùng slug.

## Chưa chắc / cần tự kiểm
- Ruleset trên repo riêng gói Free: docs.github.com (trang about-rulesets) nói "cho khách hàng gói Team và Enterprise" nhưng chương 16.1 ghi điều kiện gói khác (09/2026) — 18.5 bắt học viên TỰ kiểm trên repo của mình thay vì khẳng định.
- Hook "main chỉ nhận PR" là MÔ PHỎNG (nói rõ trong bài). `xmllint` có sẵn Mac/Linux; Windows dùng IDE (bài đã nói).
- Mật khẩu mẫu `Tomcat@FPT2026` là GIẢ (có thể bị công cụ quét bí mật chú ý).
