/** "100 Ngày Database với CuongThai" — Ngày 16: CTE (WITH).
    WITH đặt tên truy vấn con; nối nhiều CTE thành các bước; CTE vs subquery
    lồng (đọc từ trên xuống, dễ đọc + tái dùng).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day16). Chuẩn SQL — SQL Server dùng WITH y hệt. */
export default {
  day: 16,
  card: 'db-day-16',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'name-a-subquery-with-a-cte-with',
    title: 'Đặt tên subquery bằng CTE (WITH)',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 16: CTE (WITH) — ĐẶT TÊN TRUY VẤN CON

Ngày 14–15, các subquery bắt đầu lồng vào nhau, và bạn có thể đã thấy: câu SQL càng mạnh càng khó đọc — subquery trong subquery, phải đọc *từ trong ra ngoài*, cùng một subquery viết lại vài lần. **CTE** (Common Table Expression), viết bằng \`WITH\`, giải đúng vấn đề đó: nó cho bạn **đặt tên** một truy vấn con, rồi dùng cái tên ấy như một bảng — biến câu SQL rối rắm thành các *bước* rõ ràng, đọc từ trên xuống. Mọi kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🏷️ WITH — ĐẶT TÊN CHO MỘT TRUY VẤN

Cú pháp: \`WITH ten AS (truy_vấn_con)\` rồi câu chính dùng \`ten\` như một bảng bình thường:

\`\`\`sql
WITH tong_moi_khach AS (
  SELECT khach_id, sum(tong_tien) AS tong
  FROM don_hang GROUP BY khach_id
)
SELECT k.ten, t.tong
FROM tong_moi_khach t
JOIN khach_hang k ON k.id = t.khach_id
ORDER BY t.tong DESC;
\`\`\`

\`\`\`
 ten  |  tong
------+--------
 Binh | 900000
 An   | 800000
 Dung | 700000
 Chi  | 250000
(4 rows)
\`\`\`

So với bản dùng bảng dẫn xuất (Ngày 14), kết quả *y hệt* — nhưng đọc dễ hơn hẳn: bước một tính \`tong_moi_khach\`, đặt cho nó cái tên có nghĩa; câu chính chỉ việc \`JOIN\` với \`khach_hang\` để lấy tên. Cái tên đóng vai trò như một biến, làm ý đồ hiện rõ.

━━━━━━━━━━━━━━━━━━━━

⛓️ NỐI NHIỀU CTE — CHIA BÀI TOÁN THÀNH CÁC BƯỚC

Đây là chỗ CTE toả sáng: bạn khai báo **nhiều** CTE, cách nhau bởi dấu phẩy, và CTE sau **dùng được** CTE trước. Bài toán "khách nào chi trên trung bình (của các tổng theo khách)?" tách thành hai bước tự nhiên:

\`\`\`sql
WITH tong_moi_khach AS (
  SELECT khach_id, sum(tong_tien) AS tong FROM don_hang GROUP BY khach_id
),
trung_binh AS (
  SELECT avg(tong) AS tb FROM tong_moi_khach     -- dùng CTE phía trên!
)
SELECT k.ten, t.tong
FROM tong_moi_khach t
JOIN khach_hang k ON k.id = t.khach_id
WHERE t.tong > (SELECT tb FROM trung_binh)
ORDER BY t.tong DESC;
\`\`\`

\`\`\`
 ten  |  tong
------+--------
 Binh | 900000
 An   | 800000
 Dung | 700000
(3 rows)
\`\`\`

Trung bình các tổng là 662.500; Chi (250k) không đạt nên bị loại. Đọc câu này như một quy trình: **(1)** tính tổng mỗi khách → **(2)** tính trung bình các tổng → **(3)** giữ ai trên trung bình. Nếu viết bằng subquery lồng, cùng logic này sẽ thành một khối ngoặc trong ngoặc rất khó theo dõi.

━━━━━━━━━━━━━━━━━━━━

📖 CTE vs SUBQUERY LỒNG — CÙNG KẾT QUẢ, KHÁC ĐỘ ĐỌC

CTE **không** làm được gì mà subquery không làm được (với các truy vấn thường) — lợi ích của nó là **con người**:
- **Đọc từ trên xuống** thay vì từ trong ra ngoài.
- **Đặt tên có nghĩa** cho từng bước (\`tong_moi_khach\`, \`trung_binh\`) — câu SQL tự giải thích.
- **Tái dùng**: một CTE khai báo một lần, dùng nhiều nơi trong câu chính (thay vì chép lại subquery).

Với truy vấn dài, CTE là khác biệt giữa "đọc hiểu trong 10 giây" và "ngồi giải mã 5 phút". (Ghi chú kỹ thuật: trong PostgreSQL ≥ 12, CTE thường được "nội tuyến" nên hiệu năng ngang subquery; bản cũ hơn có thể coi CTE là "hàng rào tối ưu" — hiếm khi thành vấn đề với truy vấn thường ngày.)

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt**: cả hai dùng \`WITH ten AS (...)\`, nối nhiều CTE bằng dấu phẩy, CTE sau dùng được CTE trước. Khác biệt duy nhất đáng nhớ: trong SQL Server, câu lệnh *ngay trước* \`WITH\` phải kết thúc bằng dấu chấm phẩy (\`;WITH ...\`) — thói quen tốt là luôn kết thúc câu bằng \`;\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết lại truy vấn "đơn trên trung bình toàn bảng" (Ngày 14) bằng một CTE tính trung bình.
2. Dùng 2 CTE: một tính số đơn mỗi khách, một tính trung bình số đơn — rồi tìm khách trên mức đó.
3. Đặt tên một CTE rồi \`JOIN\` chính CTE đó với một bảng khác hai lần.
4. Vì sao CTE giúp code dễ bảo trì hơn subquery lồng sâu?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

CTE (\`WITH\`) đặt tên cho các truy vấn con, biến câu SQL lồng nhau chằng chịt thành một chuỗi bước rõ ràng, đọc từ trên xuống, đặt tên có nghĩa và tái dùng được. Nó không thêm sức mạnh tính toán, nhưng thêm rất nhiều **sự sáng sủa** — và với truy vấn thật, sáng sủa là vàng.

Nhưng CTE còn một khả năng mà *không* công cụ nào khác trong SQL có: nó **tự gọi chính nó**. Điều đó cho phép duyệt các cấu trúc *phân cấp không giới hạn độ sâu* — cây thư mục, sơ đồ tổ chức, chuỗi bình luận lồng nhau. Đó là recursive CTE, một trong những thứ mạnh và đẹp nhất của SQL, và là bài ngày mai.

Ngày 17: **Recursive CTE** — CTE đệ quy tự tham chiếu để đi hết một cây (sơ đồ tổ chức, danh mục cha–con) đến độ sâu bất kỳ trong một truy vấn duy nhất. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
