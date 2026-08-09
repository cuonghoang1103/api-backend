/** "100 Ngày Java với CuongThai" — Ngày 84: Phân trang & sắp xếp (Blog API).
    Nối đúng chỗ Ngày 83 kết ("blog thật có hàng nghìn bài; trả hết một lần là
    thảm hoạ; người đọc muốn trang đầu, mới nhất trước").
    Ngày 85 (tìm kiếm bài viết) trỏ ngược về phần kết.

    ⚠ LUẬT 6: dựng nguyên lý Pageable/Sort bằng JDK thuần, đếm SỐ DÒNG BỎ QUA
    (cố định) không đo thời gian; thân bài dạy Pageable/PageRequest thật. Output
    là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 84,
  card: 'java-day-84',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-multi-level-task-scheduling-system-using-priority-queues',
    title: 'Lịch ưu tiên nhiều mức (nền cho sắp xếp)',
  },

  content: `📄 100 NGÀY JAVA — NGÀY 84: PHÂN TRANG & SẮP XẾP

Blog của bạn giờ đăng được bài. Nhưng một blog thật có hàng nghìn bài, và endpoint danh sách của Ngày 83 trả về **tất cả** trong một request.

Đó là thảm hoạ: chậm, tốn bộ nhớ máy chủ, tốn băng thông, và vô nghĩa — không ai đọc nghìn bài cùng lúc. Người đọc muốn xem **trang đầu, mới nhất trước**, rồi bấm "trang sau". Hôm nay ta làm đúng chuyện đó.

━━━━━━━━━━━━━━━━━━━━

📄 PHÂN TRANG: CẮT NHỎ RA

Ý tưởng đơn giản: chia danh sách thành các trang cỡ cố định (ví dụ 10 hoặc 20 bài), mỗi request trả một trang:

\`\`\`
1) 23 bai, co trang 10 -> tong 3 trang, 23 ban ghi
2) trang 1 -> 10 bai: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
3) trang 3 (cuoi) -> 3 bai: [21, 22, 23]
\`\`\`

Hai mươi ba bài, mỗi trang 10 → ba trang, trang cuối chỉ có 3 bài. Công thức tổng số trang: \`ceil(tổng bản ghi / cỡ trang)\`.

Quan trọng: phản hồi phân trang không chỉ trả *nội dung*, mà kèm **siêu dữ liệu** để client dựng thanh phân trang: trang hiện tại, tổng số trang, tổng bản ghi. Thiếu tổng số trang thì giao diện không biết vẽ bao nhiêu nút.

━━━━━━━━━━━━━━━━━━━━

🌱 SPRING DATA LÀM SẴN: Pageable

Bạn không tự cắt. Spring Data cho \`Pageable\` — repository nhận nó và trả về một \`Page\` đầy đủ:

\`\`\`java
Page<BaiViet> findByTrangThai(TrangThai tt, Pageable pageable);

// Controller:
@GetMapping("/bai-viet")
public Page<BaiViet> danhSach(
        @RequestParam(defaultValue = "0") int trang,
        @RequestParam(defaultValue = "20") int co) {
    Pageable p = PageRequest.of(trang, co, Sort.by("ngayDang").descending());
    return service.danhSachCongKhai(p);
}
\`\`\`

\`Page<BaiViet>\` trả về sẵn \`getContent()\`, \`getTotalPages()\`, \`getTotalElements()\`, \`hasNext()\` — đúng bộ siêu dữ liệu ở trên, không phải tự tính. (Lưu ý \`Pageable\` đánh số trang từ **0**.)

━━━━━━━━━━━━━━━━━━━━

⬇️ SẮP XẾP: MỚI NHẤT TRƯỚC

Gần như mọi danh sách blog sắp theo thời gian giảm dần — bài mới lên đầu:

\`\`\`
4) sap 'moi nhat truoc' -> bai dau la id 23
\`\`\`

\`Sort.by("ngayDang").descending()\` — và việc sắp xếp diễn ra **ở CSDL**, không phải kéo hết về Java rồi \`Collections.sort\` (bài học Ngày 62: để CSDL làm việc nó giỏi). CSDL sắp nhanh nếu cột đó có chỉ mục (Ngày 66).

━━━━━━━━━━━━━━━━━━━━

🐌 CÁI BẪY: OFFSET LỚN

Đây là phần ít người biết, và là lý do các trang "tải thêm" của mạng xã hội **không** dùng số trang. Phân trang kiểu \`OFFSET\` (số trang) có một chi phí ẩn:

\`\`\`
5) OFFSET lay trang 100 -> bo qua 990 dong (cang sau cang cham)
\`\`\`

Để lấy trang 100 (cỡ 10), CSDL phải **quét qua rồi bỏ đi 990 dòng đầu** mới tới dòng cần. \`OFFSET 990 LIMIT 10\`. Trang 1000 thì bỏ 9990 dòng. Trang càng sâu, càng nhiều dòng bị quét vô ích — **càng lật càng chậm**.

Với blog vài chục trang thì không sao. Nhưng feed vô tận triệu bản ghi thì OFFSET giết hiệu năng.

━━━━━━━━━━━━━━━━━━━━

🎯 CHỮA: PHÂN TRANG THEO CON TRỎ (CURSOR)

Thay vì "bỏ N dòng", ta nói "cho tôi các bản ghi **sau** cái tôi đã thấy":

\`\`\`
6) con tro 'id < 14 LIMIT 10' -> lay 10 bai (dau id 13), bo qua 0 dong
\`\`\`

Client nhớ bản ghi cuối của trang trước (ví dụ id 14), rồi xin \`WHERE id < 14 ORDER BY id DESC LIMIT 10\`. CSDL **nhảy thẳng** tới đó bằng chỉ mục, không bỏ dòng nào — nhanh đều ở mọi trang, dù là trang 1 hay trang một triệu.

\`\`\`sql
-- OFFSET (chậm dần):   ... ORDER BY id DESC OFFSET 990 LIMIT 10
-- CURSOR (nhanh đều):  ... WHERE id < 14 ORDER BY id DESC LIMIT 10
\`\`\`

Đánh đổi: cursor không nhảy tới "trang 100" tùy ý được (phải đi tuần tự), và cần cột sắp xếp có chỉ mục và ổn định. Nên:
- **Trang có đánh số** (1,2,3… như blog) → dùng \`Pageable\`/OFFSET, đơn giản.
- **Danh sách cuộn vô tận** (feed, "tải thêm") → dùng cursor, nhanh và không bị trùng/sót khi có bài mới chen vào.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Đổi endpoint danh sách sang trả \`Page<BaiViet>\` với \`Pageable\`.
2. Thêm \`Sort.by("ngayDang").descending()\`, kiểm bài mới lên đầu.
3. Trả kèm \`totalPages\`, \`totalElements\` cho client dựng thanh phân trang.
4. Bật \`show-sql\`, xem câu \`LIMIT ... OFFSET ...\` Spring sinh ra.
5. Viết một endpoint cursor \`?sauId=14\` dùng \`WHERE id < :sauId LIMIT :co\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Đừng bao giờ trả cả bảng — phân trang cắt nhỏ ra, kèm tổng số trang cho client. \`Pageable\` + \`Sort\` của Spring Data lo cắt và sắp (ở CSDL, mới nhất trước) chỉ bằng vài dòng. Nhưng nhớ cái bẫy: \`OFFSET\` lớn bắt CSDL bỏ qua rất nhiều dòng nên trang sâu càng chậm — danh sách vô tận thì dùng **cursor** ("sau bản ghi X") để nhanh đều mọi trang.

Người đọc giờ lật trang được. Nhưng họ còn muốn một thứ nữa mà mọi blog đều có: một ô **tìm kiếm**. Gõ "java" là ra mọi bài về Java. Nghe đơn giản, nhưng làm cho đúng và nhanh thì có cả một thế giới phía sau — từ \`LIKE\` ngây thơ tới full-text index.

Ngày 85: **Tìm kiếm bài viết** — vì sao \`LIKE '%java%'\` không dùng được chỉ mục (nhớ Ngày 66), tìm kiếm toàn văn (full-text) của PostgreSQL, và cách xếp hạng kết quả theo độ liên quan. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
