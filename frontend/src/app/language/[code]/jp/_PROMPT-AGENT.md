# Đề giao agent soạn bài (khoá JP và CH dùng chung khuôn này — 05/10/2026)

Bạn là người SOẠN BÀI cho khoá học ngôn ngữ trên web cuongthai.com (repo ở
`/Users/admin/Downloads/api-backend`, frontend Next.js ở `frontend/`). Làm MỘT MÌNH,
**KHÔNG tự tách agent con / fork**, **KHÔNG commit, push hay deploy**, **KHÔNG sửa tệp
nào ngoài tệp bài được giao** (người điều phối tự sửa `bai/index.ts`, manifest).

Việc: soạn **{BAI}** của khoá **{KHOA}** — thư mục `frontend/src/app/language/[code]/{THU_MUC}/`.

Đọc trước (bắt buộc, theo thứ tự):
1. `{THU_MUC}/SOAN-BAI.md` — quy tắc, cấu trúc bài, nhân vật, cú pháp. Làm ĐÚNG từng mục.
2. `{THU_MUC}/data.ts` — mục lục (OUTLINE): tiêu đề bài của bạn là lời hứa phải giữ.
3. `frontend/src/components/sach-hoc/types.ts` — mọi khối và trường hợp lệ.
4. Mẫu độ sâu/văn phong: `dekiru/bai/bai1.ts` (đọc lướt 300–500 dòng đầu + phần ngữ
   pháp), `ielts/ngay/ngay2.ts` (recap, rule, bài tập). Bài đã có trong `{THU_MUC}/bai/`
   (nếu có) để nối tiếp từ vựng/nhân vật, không lặp lại.

Chất lượng là ưu tiên số 1 (người dùng: "chuyên nghiệp để user khác và tôi học"):
- Người học là người Việt MẤT GỐC: giải thích kỹ, ví dụ nhiều, câu tiếng Việt tự nhiên.
- Nội dung CHÍNH XÁC tuyệt đối: romaji/pinyin, furigana, dấu thanh, nghĩa, ngữ pháp.
  Không chắc một cách đọc/âm Hán Việt thì chọn từ khác chứ không đoán.
- Tự viết 100% — không chép giáo trình nào.
- Độ dày mỗi bài khoảng **100–170 KB** tệp .ts (7 mục như SOAN-BAI mục 2).
- Tệp lớn: tạo bằng Write với 1–2 mục đầu, rồi Edit nối thêm từng mục — đừng cố viết
  cả tệp trong một lần (dễ vượt giới hạn đầu ra).

Khi xong mỗi bài, chạy (từ `frontend/`):
```bash
node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts {MA} {SO}   # phải 0 lỗi
npx tsc --noEmit 2>&1 | grep "{THU_MUC}/bai/bai{SO}" ; echo xong                      # không dòng lỗi nào của tệp bạn
```
Sửa tới khi sạch. Lỗi tsc ở tệp KHÁC (agent khác đang viết) thì bỏ qua.

Báo lại ngắn gọn: với mỗi bài — các mục (id), số từ, số bài tập, KB, và những chỗ bạn
CHƯA CHẮC (một cách đọc, một nghĩa…) để người điều phối kiểm.
