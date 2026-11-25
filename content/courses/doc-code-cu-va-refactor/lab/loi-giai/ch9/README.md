# Lời giải Chương 9 — Dự án cuối khoá: sprint bảo trì 8 ticket

Áp patch bằng `git am` theo ĐÚNG thứ tự thư mục lên `legacy-thu-vien` nhánh `ch8` (mã băm sẽ khác, nội dung giống).
Mỗi thư mục là một PR: tạo nhánh từ `ch9` hiện tại, `git am <thư mục>/*.patch`, rồi `git switch ch9 && git merge --no-ff <nhánh>`.

```bash
git switch -c ch9 ch8
for d in lab/loi-giai/ch9/java/*/; do b=$(basename $d | cut -d- -f2-); git switch -q -c $b ch9; git am -q $d*.patch; git switch -q ch9; git merge -q --no-ff $b -m "Merge PR $b"; done
```

| Thư mục | Ticket | Kích thước (thêm/bớt) |
|---|---|---|
| `java/01-tv-41` | Giới hạn mượn `>` thành `>=` (cherry-pick từ ch5-tv41) | 6/6 |
| `java/02-tv-110` | Cookie Ghi nhớ HMAC-SHA256, khoá từ `THUVIEN_REMEMBER_KEY`, HttpOnly | 109/12 |
| `java/03-tv-111` | JSP vào `WEB-INF/jsp`, e2e chờ 404 | 22/14 (+6 rename) |
| `java/04-tv-113` | Trả sách trong một giao dịch, tiêm lỗi bằng trigger MySQL | 50/7 |
| `java/05-tv-117` | header.jsp pageEncoding + duyệt golden master | 19/19 |
| `java/06-tv-95` | Loại NCS (cherry-pick ch5-ncs) + test qua CSDL + duyệt golden readers | 31/4 |
| `java/07-tv-122-dac-ta` | 4 characterization test ReaderServlet (gồm _BUG_TV125) | 93/0 |
| `java/08-tv-122` | Extract Class `DocGiaDAO` | 86/40 |
| `java/09-tv-121` | Java 17 → 21 | 11/9 |
| `java/10-ban-giao` | README, docs/ban-do.md, RUI-RO.md | 140/4 |
| `node/tv-95` | NCS trong `lib/luat.js` — áp lên `legacy-express` nhánh `ch8` | 3/1 |

Tài liệu: `NHAT-KY.md` (10 ngày), `PR/*.md` (10 mô tả bốn mục), `README-du-an.md` (bản README bàn giao).
Công cụ: `tools/chay9.sh` — chạy gộp trong khoá nặng: worktree tạm để chạy test MỚI trên code CŨ ("đỏ trước"), xanh từng nhánh,
e2e Testcontainers, golden master qua HTTP, Checkstyle, thử clone sạch. Đường dẫn trong script là của máy soạn — sửa biến `W`, `R`, `C` ở đầu.

Khoá test TV-110 dùng khoá thử `khoa-thu-chi-dung-cho-test-0123456789abcdef` (chỉ trong test). Máy thật: `openssl rand -hex 32` vào `.env`, KHÔNG commit.
