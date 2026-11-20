# Dự án xuyên suốt khoá (assignment cuối khoá làm dần từ bài đầu) — đặc tả

Yêu cầu của người dùng (21/11/2026): mỗi khoá (Courses + Academy) có một DỰ ÁN THẬT người học chọn ngay từ đầu, làm dần qua
từng chương bằng đúng kiến thức chương đó, tới bài cuối thì dự án gần hoàn chỉnh ⇒ hoàn thiện + BẢO VỆ như assignment cuối kỳ.
Áp cho MỌI khoá; thí điểm FER202 (Academy) → Node.js → Spring Boot.

## 1. Trải nghiệm người học
1. **Bài "Bắt đầu tại đây"** (video + bài đọc) có đoạn *"Học xong khoá này bạn làm được gì"*, kết thúc bằng câu
   *"Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới"*.
2. Ngay dưới bài đó: khối **"🎯 Đăng ký đề tài"**
   - ≥ 5 đề tài gợi ý (thẻ): tên, mô tả 2–3 câu, độ khó, tính năng chính, **bảng "chương nào dùng cho phần nào"**,
     ảnh/khung giao diện mẫu nếu có, dự án thật tương tự ngoài đời (vd FER202: web bán khoá học kiểu cuongthai.com, Academy,
     quản lý thư viện, đặt lịch phòng khám, shop sneaker…).
   - 1 ô **"Đề tài tự chọn"**: người học điền tên + mô tả + tính năng ⇒ **AI xét duyệt** (đủ phủ kiến thức khoá? vừa sức?
     quá to/quá nhỏ?) ⇒ trả *Duyệt / Cần sửa (gợi ý sửa cụ thể)*. Lưu đề tài đã chọn (đổi được, giữ lịch sử).
3. **Cuối mỗi chương**: bài **"🛠 Mốc dự án — Chương N"**: nhiệm vụ áp đúng kiến thức chương vào đề tài ĐÃ CHỌN
   (vd FER202 Ch5 State ⇒ "giỏ hàng / danh sách khoá học có thêm-xoá"; Ch9 Router ⇒ "trang chi tiết + điều hướng"; Ch11 ⇒
   "nối json-server/API thật"). Mỗi mốc: yêu cầu bắt buộc · nâng cao tuỳ chọn · tiêu chí "Đạt khi" · gợi ý theo tầng ·
   checklist tự kiểm. Người học nộp link repo/commit + ghi chú; đánh dấu xong.
4. **Bảng tiến độ dự án** ở trang khoá: các mốc đã xong / còn lại, % hoàn thiện.
5. **Cuối khoá**: bài "Hoàn thiện & bảo vệ" — checklist nộp (README, chạy được, demo), rồi **phòng bảo vệ AI**: hỏi đáp kiểu
   hội đồng về chính dự án (vì sao làm vậy, luồng dữ liệu, đổi yêu cầu thì sửa đâu), chấm theo rubric, trả nhận xét.
   Tái dùng hạ tầng "luyện bảo vệ" sẵn có (CT Work AI / phòng thi) — xem `src/services/work/aiCong.ts`, `src/services/exam/`.

Khoá đã có lab theo bài vẫn giữ nguyên; mốc dự án là THÊM, không thay.

## 2. Dữ liệu nội dung (trong tệp khoá, không cần DB để hiển thị)
```js
duAn: {
  gioiThieu: 'EN|||VI',                       // học xong làm được gì + vì sao làm dự án xuyên suốt
  deTai: [ { slug, ten: 'EN|||VI', moTa, doKho: 1..3, tinhNang: [...], banDoChuong: { '<sectionSlug|so>': 'dùng cho…' },
             thamKhaoThat: [...] }, … ≥5 ],
  moc: [ { sauChuong: <số/ slug bài cuối chương>, slug: '<khoa>-moc-<n>', yeuCau: [...], nangCao: [...], datKhi: [...],
           goiY: [...] } ],
  baoVe: { rubric: [ { tieuChi, diem } ], cauHoiMau: [...] },
}
```
Mốc dự án là một bài (lesson) thật trong chương (slug riêng, KHÔNG đổi slug cũ), nội dung sinh từ `duAn.moc`.

## 3. Dữ liệu người dùng (DB — migration viết tay theo CLAUDE.md)
- `course_project_choices` (userId, courseId, deTaiSlug | null, tuChon jsonb {ten, moTa, tinhNang}, aiDuyet {ketQua, nhanXet, luc},
  createdAt, updatedAt) — một dòng hiệu lực / người / khoá (+ lịch sử).
- `course_project_milestones` (userId, courseId, mocSlug, trangThai, repoUrl, ghiChu, xongLuc).
- `course_project_defences` (userId, courseId, phien jsonb, diem, nhanXet, luc).

## 4. API
- `GET /courses/:slug/du-an` (đề tài + mốc + lựa chọn của tôi) · `POST /courses/:slug/du-an/chon` · `POST …/tu-chon` (AI duyệt)
- `POST …/moc/:mocSlug` (nộp/đánh dấu) · `POST …/bao-ve` (phiên bảo vệ AI, stream).

## 5. AI & chi phí (người dùng đang cần tiết kiệm)
- Duyệt đề tài tự chọn: 1 lời gọi model rẻ (purpose mới `du_an_duyet`, trần token nhỏ), tối đa N lần/ngày/người.
- Bảo vệ: model hội thoại sẵn có; giới hạn số phiên/ngày. Không tự động chấm code repo bằng AI ở bản đầu (đắt) — để sau.

## 6. Thứ tự làm
1. Hạ tầng (DB + API + khối "Đăng ký đề tài" + bài "Mốc dự án" + bảng tiến độ) — một lần cho mọi khoá.
2. Nội dung thí điểm **FER202** (≥5 đề tài, mốc sau Ch1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 + bảo vệ), rồi Node.js, Spring Boot.
3. Lăn ra mọi khoá: agent soạn `duAn` theo khung này; soát bằng bảng (khoá nào thiếu duAn / thiếu mốc chương nào).
4. Bài "Bắt đầu tại đây" mọi khoá: thêm đoạn "học xong làm được gì" + lời mời đăng ký đề tài (gộp với luật mở đầu 6 ý,
   xem memory feedback-mo-dau-khoa-6-y).

## 7. Khoảng trống lab hiện tại của FER202 (soát 21/11)
Chương có lab ít/không: Ch2 ES6 (0), Ch3 JSX (1), Ch7 props & Context (1), Ch12 Redux (2), Nâng cao A2 Kiểm thử (0),
A3 TS & Next (1). Bổ sung lab nhỏ cho từng bài ở các chương này cùng đợt thí điểm.
