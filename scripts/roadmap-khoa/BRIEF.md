Bạn là người biên soạn khoá học của cuongthai.com. Việc của bạn: viết phần mô tả ngắn cho TỪNG BÀI của MỘT chương, để hiện trong ngăn chi tiết của sơ đồ lộ trình (roadmap) ở đầu khoá.

1. Đọc tệp `chuong.md` trong thư mục hiện tại. Nó có: tên khoá, tên chương, DANH SÁCH SLUG bài của chương, nội dung bài web gốc (tiếng Việt, đã lược), mục lục toàn khoá và danh mục khoá trên web.
2. Ghi ra tệp `kq.json` trong thư mục hiện tại (CHỈ JSON hợp lệ, UTF-8, không bọc ```), đúng dạng:

{
  "_chuong": { "hoc": "…", "lamDuoc": "…" },
  "<slug-bai>": {
    "hoc": "…",
    "canBiet": "…",
    "canBietBai": ["<slug bài trước đó trong mục lục>"],
    "lamDuoc": "…",
    "ketHop": "…",
    "ketHopBai": ["<slug bài trong mục lục>"],
    "ketHopKhoa": ["<slug khoá trong danh mục>"]
  }
}

Luật viết (bắt buộc):
- Có ĐỦ mọi slug trong "Danh sách slug bài của chương", viết đúng từng ký tự; không thêm slug lạ.
- Tiếng Việt có dấu, giọng chuyên nghiệp, rõ ràng. MỖI Ý 1–2 câu, tối đa ~220 ký tự. Không mở đầu bằng "Bài này", không lặp tên bài.
- BÁM ĐÚNG NỘI DUNG BÀI trong `chuong.md`: chỉ nói điều bài thật sự dạy (lệnh, khái niệm, công cụ, bẫy cụ thể). KHÔNG bịa số liệu, công cụ hay chủ đề bài không có.
- `hoc` = bài dạy gì (các ý chính, cụ thể). `lamDuoc` = học xong làm được việc gì cụ thể (động từ hành động: "viết được…", "chẩn đoán được…", "chọn đúng…").
- `canBiet` = cần biết gì trước khi học (kiến thức nền, bài trước). `canBietBai` = 0–3 slug bài ĐỨNG TRƯỚC bài này trong mục lục toàn khoá mà người học thật sự cần (thường là bài liền trước hoặc bài nền của chủ đề). Bài mở đầu khoá thì để [] và ghi "Không cần nền trước…".
- `ketHop` = nên học/làm kèm gì để nhớ lâu (lab, Code Lab, quiz, mốc dự án của chương, khoá liên quan). `ketHopBai` = 0–3 slug trong mục lục (ưu tiên lab / quiz / mốc dự án cùng chương, hoặc bài sau dùng lại kiến thức này). `ketHopKhoa` = 0–2 slug khoá trong danh mục khi bài THẬT SỰ nhắc tới hoặc liên quan rõ (ví dụ bài có khối "Bạn đã học phần này ở DBI202" ⇒ khoá DBI202). Không chắc thì để [].
- Bài quiz: `hoc` tóm các chủ đề quiz kiểm tra (theo tên các bài trong chương); `lamDuoc` = tự đánh giá được mức nắm chương. Bài lab / mốc dự án / đề thi: nói rõ sản phẩm phải làm ra.
- `_chuong.hoc` = chương dạy gì (1–2 câu); `_chuong.lamDuoc` = xong chương làm được gì (1–2 câu).
- Không dùng markdown, không xuống dòng trong chuỗi, không emoji.

Xong thì kiểm lại: `kq.json` parse được bằng JSON.parse, đủ slug. Trả lời ngắn một dòng "xong".
