/** "100 Ngày Database với CuongThai" — Ngày 29: Phi chuẩn hoá (denormalization).
    Cố ý thêm dư thừa (cột đếm cache) để đọc nhanh; lợi (không JOIN) và giá
    (phải giữ đồng bộ, quên → lệch). Khi nào nên phi chuẩn.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day29). Phi chuẩn hoá là chiến lược — hệ nào cũng áp dụng. */
export default {
  day: 29,
  card: 'db-day-29',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'change-a-table-with-alter-table',
    title: 'Thay đổi bảng với ALTER TABLE',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 29: PHI CHUẨN HOÁ — CỐ Ý PHÁ CHUẨN ĐỂ ĐỌC NHANH

Suốt Giai đoạn 3, thông điệp là: **chuẩn hoá, tách bảng, chống dư thừa**. Giờ nghe điều tưởng như dị giáo: đôi khi các kỹ sư giỏi *cố ý* làm ngược lại — thêm dư thừa trở lại — và đó là quyết định *đúng*. Đó là **phi chuẩn hoá (denormalization)**. Hiểu khi nào nên phá luật cũng quan trọng như hiểu luật. Kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🔄 HAI MỤC TIÊU ĐỐI NGHỊCH

- **Chuẩn hoá** tối ưu cho **ghi và toàn vẹn**: mỗi sự thật một chỗ, sửa một lần, không mâu thuẫn. Cái giá: đọc thường phải \`JOIN\` nhiều bảng và tính toán (\`COUNT\`, \`SUM\`).
- **Phi chuẩn hoá** tối ưu cho **đọc**: chấp nhận lưu dư thừa một số dữ liệu để đọc nhanh hơn, tránh \`JOIN\`/tính toán đắt. Cái giá: phải *tự* giữ dữ liệu dư thừa đồng bộ.

Đây là một *đánh đổi*, không phải "đúng/sai". Với ứng dụng **đọc nhiều hơn ghi rất nhiều** (một bài viết được đọc hàng nghìn lần nhưng chỉ thỉnh thoảng có bình luận), nghiêng về đọc là hợp lý.

━━━━━━━━━━━━━━━━━━━━

🔢 VÍ DỤ KINH ĐIỂN: CỘT ĐẾM CACHE

Feed cần hiển thị "số bình luận" cho mỗi bài. Cách chuẩn hoá: đếm bằng \`JOIN\` + \`COUNT\` mỗi lần:

\`\`\`sql
SELECT b.tieu_de, count(bl.id) AS so_bl
FROM bai_viet b LEFT JOIN binh_luan bl ON bl.bai_id = b.id
GROUP BY b.id, b.tieu_de;
-- -> Bai 1: 2, Bai 2: 1   (đúng, nhưng phải quét bảng binh_luan mỗi lần)
\`\`\`

Với một feed hiển thị 50 bài, mỗi bài đếm hàng nghìn bình luận, mỗi lượt tải trang — phép này tốn. Cách phi chuẩn: lưu sẵn một cột đếm \`binh_luan_count\` ngay trong \`bai_viet\`, và đọc thẳng:

\`\`\`sql
SELECT tieu_de, binh_luan_count FROM bai_viet;
-- -> Bai 1: 2, Bai 2: 1   (một lần quét, KHÔNG đụng bảng binh_luan)
\`\`\`

Cùng kết quả, nhưng đọc rẻ hơn nhiều — không \`JOIN\`, không \`GROUP BY\`. Ở quy mô lớn, khác biệt này là sống còn. (Chính bảng bạn đang đọc — feed này — dùng đúng kỹ thuật đó.)

━━━━━━━━━━━━━━━━━━━━

⚠️ CÁI GIÁ: DƯ THỪA = NGUY CƠ LỆCH

Không có bữa trưa miễn phí. Cột \`binh_luan_count\` là **bản sao** của một sự thật (số bình luận thật). Mỗi khi thêm/xoá bình luận, bạn **phải** cập nhật nó:

\`\`\`sql
INSERT INTO binh_luan (bai_id, noi_dung) VALUES (1, 'D');
UPDATE bai_viet SET binh_luan_count = binh_luan_count + 1 WHERE id = 1;   -- giữ đồng bộ
\`\`\`

Nhưng nếu một chỗ nào đó trong code *quên* cập nhật:

\`\`\`sql
INSERT INTO binh_luan (bai_id, noi_dung) VALUES (1, 'E');   -- quên UPDATE count!
SELECT b.binh_luan_count AS cache, count(bl.id) AS thuc_te
FROM bai_viet b LEFT JOIN binh_luan bl ON bl.bai_id = b.id WHERE b.id = 1 GROUP BY b.binh_luan_count;
\`\`\`

\`\`\`
 cache | thuc_te
-------+---------
     3 |       4
(1 row)
\`\`\`

Cache nói 3, thực tế 4 — **lệch**. Đây chính là dị thường của Ngày 23 quay lại, nhưng lần này ta *cố ý* chấp nhận rủi ro đó để đổi lấy tốc độ. Vì thế phi chuẩn hoá đòi kỷ luật: cập nhật dữ liệu dư thừa ở **mọi** nơi ghi. Cách bền vững là để CSDL tự làm bằng **trigger** (Giai đoạn 7) — mỗi lần thêm/xoá bình luận, trigger tự cộng/trừ count, không phụ thuộc lập trình viên nhớ.

━━━━━━━━━━━━━━━━━━━━

📏 KHI NÀO NÊN PHI CHUẨN HOÁ

Quy tắc thực chiến:
1. **Chuẩn hoá trước.** Luôn bắt đầu từ thiết kế sạch (3NF).
2. **Đo, đừng đoán.** Chỉ phi chuẩn khi bạn *đo được* một truy vấn đọc là nút thắt thật (Giai đoạn 5 dạy \`EXPLAIN\`).
3. **Cân nhắc giải pháp thay thế trước:** chỉ mục (Giai đoạn 5) hay **materialized view** (một bảng kết quả được tính sẵn, làm mới định kỳ) thường giải quyết vấn đề đọc mà không rải dư thừa khắp nơi.
4. **Nếu phi chuẩn, hãy giữ đồng bộ tự động** (trigger), và ghi rõ cột nào là cache.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Phi chuẩn hoá là **chiến lược thiết kế**, áp dụng ở mọi hệ. Công cụ giữ đồng bộ cũng có ở cả hai: trigger (PostgreSQL & SQL Server), và "view tính sẵn" — PostgreSQL gọi **materialized view**, SQL Server gọi **indexed view** (cơ chế hơi khác nhưng cùng mục đích). Nguyên tắc "chuẩn hoá trước, phi chuẩn khi đo được nút thắt" đúng cho cả hai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Kể một cột "cache" bạn từng thấy trong ứng dụng thật (like_count, tong_tien đơn hàng…).
2. Vì sao \`tong_tien\` lưu sẵn trong \`don_hang\` (thay vì cộng \`chi_tiet\` mỗi lần) là phi chuẩn hoá?
3. Nêu một rủi ro cụ thể nếu quên cập nhật cột cache.
4. Khi nào bạn chọn materialized view thay vì cột cache?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Phi chuẩn hoá là **cố ý** thêm dư thừa để tối ưu đọc — đánh đổi tốc độ đọc lấy công sức giữ đồng bộ. Nó hữu ích cho hệ đọc-nhiều, nhưng chỉ nên làm *sau khi* đã chuẩn hoá và *đo* được nút thắt, và luôn đi kèm cơ chế giữ đồng bộ (trigger). Hiểu cả hai chiều — chuẩn hoá và phi chuẩn hoá — mới là hiểu thiết kế database thực chiến.

Mai là ngày cuối của Giai đoạn 3. Ta sẽ gom mọi thứ đã học — ER, khoá, chuẩn hoá, quan hệ — cộng thêm vài loại ràng buộc nâng cao, để **thiết kế trọn một lược đồ** từ đầu tới cuối. Một bài thực hành tổng hợp đúng nghĩa.

Ngày 30 (khép Giai đoạn 3): **Ràng buộc nâng cao & thiết kế trọn một schema** — \`CHECK\` phức tạp, \`UNIQUE\` tổ hợp, \`ON DELETE\`, và ghép tất cả thành một thiết kế hoàn chỉnh. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
