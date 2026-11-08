# Đề giao agent soạn bài TIẾP SAU SÁCH của khoá できる日本語 (Bài 16–55, N4 → N2) — 09/11/2026

Bạn là người SOẠN BÀI tiếng Nhật cho web cuongthai.com (repo `/Users/admin/Downloads/api-backend`,
frontend Next.js ở `frontend/`). Làm MỘT MÌNH, **KHÔNG tách agent con / fork**, **KHÔNG commit, push
hay deploy**, **KHÔNG sửa tệp nào ngoài tệp bài được giao** (`bai/index.ts`, `manifest.ts`, `data.ts`,
`nhom.ts`, `SOAN-BAI.md` do người điều phối sửa). Có agent khác soạn bài khác song song cùng thư mục.

Việc: soạn **Bài {SO}** — tệp `frontend/src/app/language/[code]/dekiru/bai/bai{SO}.ts`, export
`BAI_{SO}: Lesson[]`. Tiêu đề + mẫu ngữ pháp: OUTLINE trong `dekiru/data.ts` (`n: {SO}`).

Đọc trước (bắt buộc, theo thứ tự):
1. `dekiru/SOAN-BAI.md` — mục 1 (nội dung), 2 (cấu trúc, cú pháp khối) và **mục 8 (Bài 16–55)** — làm
   ĐÚNG từng ý của mục 8 (phần A cốt lõi 9 mục, B 3 buổi trên lớp, C luyện thêm, D kiểm tra nếu bài
   có kiểm tra chặng / thi thử).
2. `frontend/src/components/sach-hoc/types.ts` — mọi khối và trường hợp lệ.
3. Mẫu độ sâu/văn phong: `dekiru/bai/bai15.ts` (bài sách gần nhất — nhân vật, cách giảng ポイント),
   `dekiru/bai/slideB67.ts` (đọc ~400 dòng đầu: khuôn một BUỔI trên lớp), `dekiru/bai/luyenThemB67.ts`
   (đọc lướt ~200 dòng đầu: khuôn luyện thêm). Các `bai16.ts…bai{SO-1}.ts` nếu đã có: nối tiếp
   nhân vật/từ vựng, không lặp.
4. Tránh dạy lại: `grep -rn "<mẫu>" dekiru/bai/` cho từng mẫu trong tiêu đề; chữ Hán đã dạy:
   `dekiru/bai/hanTu.ts` + các `bN-han-tu` đã có.

Chất lượng là ưu tiên số 1 (người dùng: "đầy đủ, chuyên nghiệp, chất lượng… all thi N2"):
- Người học là sinh viên Việt; giảng kỹ bằng tiếng Việt, ví dụ nhiều, câu tiếng Việt tự nhiên.
- CHÍNH XÁC tuyệt đối: romaji (Hepburn tách từ), furigana `{漢字|かな}`, nghĩa, cách dùng, cấp JLPT
  của từng mẫu/từ/chữ. Không chắc thì chọn ví dụ khác chứ không đoán.
- Tự viết 100% — không chép giáo trình/đề thi nào.
- Mọi bài tập có đáp án đúng; câu gõ tay nhận nhiều cách viết (kanji/kana, có/không dấu câu) — có thể
  dùng hàm sinh biến thể như `V(...)` trong `slideB67.ts` (chép hàm vào tệp của bạn).
- Tệp lớn (~350–600 KB): Write với 1–2 mục đầu, rồi Edit nối thêm từng mục — đừng viết cả tệp một lần.

Xong thì chạy (từ `frontend/`):
```bash
node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts dekiru {SO}   # phải 0 lỗi
npx tsc --noEmit 2>&1 | grep "dekiru/bai/bai{SO}\.ts" ; echo xong                    # không dòng lỗi nào của tệp bạn
```
(`kiem-khoa-sach` đọc thẳng tệp `bai{SO}.ts`, không cần `case`; MỌI id mục phải bắt đầu bằng `b{SO}-`.) Sửa tới khi sạch. Lỗi tsc ở tệp KHÁC thì bỏ qua.

Báo lại ngắn gọn: các mục (id · kind · số phút), số từ, số chữ Hán (liệt kê chữ), số bài tập, KB, và
những chỗ CHƯA CHẮC (một cách đọc, một sắc thái, cấp JLPT của mẫu…) để người điều phối kiểm.
