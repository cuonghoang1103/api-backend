/** "100 Ngày Java với CuongThai" — Ngày 90: Xử lý nền & tác vụ định kỳ (Blog API).
    Nối đúng chỗ Ngày 89 kết ("gửi email 'có bình luận' mất một giây — chẳng lẽ
    bắt người bình luận chờ email của NGƯỜI KHÁC; và việc chẳng ai bấm: dọn rác,
    tổng hợp thống kê"). Ngày 91 (realtime WebSocket) trỏ ngược về phần kết.

    ⚠ LUẬT 6: @Async/@Scheduled dựng bằng JDK thuần, chi phí LOGIC cố định nên
    tất định; thân bài dạy @Async/@Scheduled thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 90,
  card: 'java-day-90',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-multi-stage-log-processor-with-blocking-queues',
    title: 'Bộ xử lý nhiều tầng bằng hàng đợi chặn (worker nền)',
  },

  content: `⚙️ 100 NGÀY JAVA — NGÀY 90: XỬ LÝ NỀN & TÁC VỤ ĐỊNH KỲ

Đến giờ mọi thứ trong blog đều xảy ra **ngay trong request**: người dùng bấm, chờ, nhận kết quả. Nhưng có những việc không nên bắt người dùng chờ.

Gửi email "có bình luận mới" cho tác giả mất một giây gọi máy chủ mail — chẳng lẽ bắt người *bình luận* đứng chờ một giây chỉ vì cái email **của người khác**? Và có những việc chẳng ai bấm nút: dọn file rác mỗi đêm, tổng hợp thống kê mỗi giờ.

Hôm nay: đẩy việc ra chạy nền, và cho việc tự chạy theo lịch.

━━━━━━━━━━━━━━━━━━━━

🐢 VẤN ĐỀ: VIỆC CHẬM NHÉT TRONG REQUEST

Thử đo một request "thêm bình luận" làm ba việc:

\`\`\`
1) DONG BO: taoBL(1)+email(5)+thongKe(2) -> request ton 8 don vi
\`\`\`

Tạo bình luận (nhanh, 1), gửi email báo tác giả (chậm, 5), cập nhật thống kê (2). Làm tuần tự thì người bình luận chờ cả **8 đơn vị** — dù họ chỉ quan tâm cái bình luận của mình được lưu (1 đơn vị). Bảy phần còn lại là việc *của hệ thống* và *của người khác*.

━━━━━━━━━━━━━━━━━━━━

⚙️ @Async: TRẢ LỜI NGAY, LÀM SAU

Giải pháp: chỉ làm phần **bắt buộc-ngay** trong request (lưu bình luận), rồi trả lời người dùng; những việc chậm đẩy ra chạy nền:

\`\`\`
2) @Async: request chi ton 1 don vi (day email+thongKe ra nen)
3) hang doi co 2 tac vu cho worker chay nen
\`\`\`

Người bình luận nhận phản hồi sau **1 đơn vị** thay vì 8. Email và thống kê vẫn được làm — nhưng ở **hàng đợi chạy nền**, không ai phải đứng chờ.

Trong Spring, chỉ cần một chú thích:

\`\`\`java
@Async
public void guiEmailThongBao(BaiViet bai, BinhLuan bl) {
    mailService.gui(bai.getTacGia().getEmail(), "Có bình luận mới", ...);
}
\`\`\`

Gọi \`guiEmailThongBao(...)\` từ service, nó trả về **ngay lập tức** và chạy thân hàm trên một luồng khác. Bật bằng \`@EnableAsync\`. Bên dưới chính là \`ExecutorService\` của Ngày 42 — một pool luồng nhận việc từ hàng đợi.

\`\`\`
4) worker chay het hang doi -> xong [guiEmail, capNhatThongKe]
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚠️ HAI CÁI BẪY CỦA @Async

Cùng cơ chế proxy như \`@Transactional\` (Ngày 72), nên nó thừa hưởng đúng những cái bẫy:

- **Gọi \`@Async\` từ chính lớp đó → không chạy nền** (lời gọi nội bộ vòng qua proxy). Đặt phương thức async ở một bean khác.
- **Exception trong việc nền không quay về request được** — nó đã trả lời xong rồi. Phải tự bắt lỗi và log/thử lại trong việc nền, nếu không lỗi biến mất lặng lẽ.

Và một quyết định thật: hàng đợi trong bộ nhớ (như \`@Async\` mặc định) **mất việc khi máy chủ sập**. Việc quan trọng (đơn hàng, thanh toán) thì dùng hàng đợi **bền** — lưu vào DB hoặc dùng RabbitMQ/Kafka — để sập rồi khởi động lại vẫn xử lý tiếp. Email báo bình luận thì mất cũng chả sao; đừng dùng nhầm mức độ.

━━━━━━━━━━━━━━━━━━━━

⏰ @Scheduled: VIỆC CHẲNG AI BẤM

Loại việc thứ hai: tự chạy theo lịch, không cần request nào kích hoạt.

\`\`\`
5) @Scheduled moi 60 don vi, trong 200 -> chay 3 lan tai [60, 120, 180]
\`\`\`

\`\`\`java
@Scheduled(cron = "0 0 3 * * *")     // 3 giờ sáng mỗi ngày
public void donFileRac() { ... }

@Scheduled(fixedRate = 3600_000)     // mỗi giờ
public void tongHopThongKe() { ... }
\`\`\`

Dọn file upload không dùng, tổng hợp lượt xem từ buffer vào CSDL (Ngày 88), gửi bản tin hàng tuần — tất cả là \`@Scheduled\`. Bật bằng \`@EnableScheduling\`, khai lịch bằng \`cron\` (linh hoạt) hoặc \`fixedRate\`/\`fixedDelay\` (đơn giản).

**Một cảnh báo cho nhiều máy chủ:** nếu bạn chạy 3 bản sao ứng dụng, mỗi bản sẽ chạy \`@Scheduled\` → việc dọn rác chạy 3 lần cùng lúc. Cần một cơ chế khoá (ShedLock, hoặc một cờ trong DB/Redis) để chỉ **một** máy chạy mỗi lần.

━━━━━━━━━━━━━━━━━━━━

🧭 KHI NÀO ĐẨY RA NỀN?

Một câu hỏi để tự quyết: *người dùng có cần kết quả của việc này để tiếp tục không?*

- **Cần ngay** (lưu bình luận, trừ tồn kho) → làm trong request.
- **Không cần ngay** (gửi email, resize ảnh, cập nhật số liệu, đánh chỉ mục tìm kiếm) → đẩy ra nền.

Nguyên tắc: request chỉ làm phần tối thiểu để trả lời đúng; mọi việc "tốt thì có, chậm chút không sao" đẩy ra sau.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Bật \`@EnableAsync\`, đánh \`@Async\` cho hàm gửi email giả (ngủ 1 giây), đo thời gian request trước/sau.
2. Cố tình gọi \`@Async\` từ trong cùng lớp — quan sát nó KHÔNG chạy nền.
3. Ném exception trong việc async, xác nhận nó không làm hỏng request.
4. Viết \`@Scheduled(fixedRate=...)\` in ra mỗi vài giây.
5. Nghĩ cách chặn \`@Scheduled\` chạy trùng khi có 3 bản sao ứng dụng.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Đừng bắt người dùng chờ việc không cần ngay: \`@Async\` đẩy việc chậm (gửi mail, xử lý ảnh) ra hàng đợi chạy nền — request trả lời tức thì, worker (ExecutorService, Ngày 42) xử lý sau. \`@Scheduled\` cho việc tự chạy theo lịch mà không ai bấm. Nhớ bẫy proxy (tự-gọi vô hiệu, exception biến mất), dùng hàng đợi bền cho việc quan trọng, và chặn chạy trùng khi nhiều máy chủ.

Nhưng \`@Async\` mới giải một nửa chiều: việc chạy nền xong rồi thì **người dùng biết bằng cách nào**? Tác giả đang mở trang web, có bình luận mới — hiện tại họ phải bấm F5 mới thấy. Chẳng lẽ bắt trình duyệt hỏi máy chủ "có gì mới không?" mỗi vài giây (tốn và chậm)?

Ngày 91: **Realtime với WebSocket** — mở một kênh hai chiều luôn-mở giữa trình duyệt và máy chủ, để máy chủ **chủ động đẩy** thông báo xuống ngay khi có sự kiện (bình luận mới, tin nhắn) thay vì bắt client hỏi liên tục. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
