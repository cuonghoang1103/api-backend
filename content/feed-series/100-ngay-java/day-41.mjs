/** "100 Ngày Java với CuongThai" — Ngày 41: Đa luồng. MỞ GIAI ĐOẠN 6.
    Nối chỗ Ngày 40 kết (hai luồng cộng biến đếm, không ra 20.000). Dùng
    lại lambda của Ngày 30 và cảnh báo "static = biến toàn cục trá hình"
    của Ngày 14. Ngày 42 (ExecutorService) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Race
    condition vốn ngẫu nhiên nên chương trình chạy lại tối đa 5 lượt và
    in "co mat so? true" — chỉ cần một lượt mất số là chứng minh xong, và
    output thành tất định để thẻ so khớp được. */
export default {
  day: 41,
  card: 'java-day-41',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'task-processing-pipeline-with-concurrent-workers',
    title: 'Dây chuyền xử lý tác vụ với nhiều luồng',
  },

  content: `🧵 100 NGÀY JAVA — NGÀY 41: ĐA LUỒNG

Giai đoạn 6 bắt đầu. Bốn mươi ngày qua mọi chương trình đều làm một việc tại một thời điểm. Hôm nay ta cho nó làm nhiều việc cùng lúc — và gặp ngay lớp bug khó chịu nhất trong nghề.

━━━━━━━━━━━━━━━━━━━━

📌 TẠO MỘT LUỒNG

\`\`\`java
Thread t = new Thread(() -> System.out.println("chay trong luong phu"));
t.setName("luong-phu");
t.start();     // chạy SONG SONG với luồng chính
t.join();      // đợi t xong rồi mới đi tiếp
\`\`\`

\`\`\`
1) luong chinh: main
2) chay trong luong: luong-phu
\`\`\`

Tham số là một \`Runnable\` — interface một method, nên viết được bằng lambda (Ngày 30).

**Bẫy kinh điển số một:** gọi \`t.run()\` thay vì \`t.start()\`. Code vẫn chạy, vẫn in ra, nhưng chạy TUẦN TỰ trên luồng hiện tại — bạn tưởng mình đang chạy song song mà thật ra không. Không lỗi, không cảnh báo.

**Bẫy số hai:** quên \`join()\`:

\`\`\`
6) chua join, luong con song? true
7) sau join, con song? false
\`\`\`

Không \`join()\` thì luồng chính đi tiếp ngay và đọc kết quả khi luồng phụ chưa làm xong.

━━━━━━━━━━━━━━━━━━━━

💥 PHÉP CỘNG ĐƠN GIẢN NHẤT CŨNG HỎNG

Đây là thứ tôi hứa hôm qua:

\`\`\`java
static int dem = 0;

Runnable cong = () -> { for (int i = 0; i < 1_000_000; i++) dem++; };
Thread a = new Thread(cong), b = new Thread(cong);
a.start(); b.start(); a.join(); b.join();
\`\`\`

Hai luồng, mỗi luồng cộng một triệu lần. Đáp án phải là 2.000.000. Chạy thật:

\`\`\`
3) hai luong cong 2000000 lan -> co mat so? true
\`\`\`

Mất số. Và mỗi lần chạy mất một lượng khác nhau.

**Vì sao?** \`dem++\` trông như một thao tác, nhưng CPU thực hiện ba bước:

1. Đọc giá trị \`dem\` từ bộ nhớ
2. Cộng 1
3. Ghi ngược lại

Hai luồng chen vào giữa ba bước đó:

\`\`\`
Luồng A: đọc dem = 100
Luồng B: đọc dem = 100        ← cùng đọc giá trị cũ
Luồng A: ghi 101
Luồng B: ghi 101              ← đè lên, mất một lần cộng
\`\`\`

Đây gọi là **race condition** — hai luồng "đua" nhau vào cùng một chỗ.

Điều làm nó đáng sợ hơn mọi bug khác: **nó không tái hiện đều**. Chạy mười lần có thể đúng vài lần. Trên máy bạn thì đúng, lên server nhiều nhân thì sai. Test không bắt được, và khi có người báo lỗi thì bạn không tạo lại được để tìm.

(Chương trình ở trên cố ý chạy lại tối đa 5 lượt để chắc chắn tái hiện — chứ bản thân hiện tượng thì ngẫu nhiên.)

━━━━━━━━━━━━━━━━━━━━

🔒 CÁCH SỬA 1: synchronized

\`\`\`java
static final Object khoa = new Object();

synchronized (khoa) {
    dem++;
}
\`\`\`

\`\`\`
4) synchronized -> dung? true
\`\`\`

Khối \`synchronized\` bảo đảm: một lúc chỉ MỘT luồng vào được. Luồng khác phải xếp hàng đợi.

Hai điều phải nhớ:

- **Khoá đúng phạm vi.** Phải bọc cả cụm đọc-sửa-ghi. Khoá riêng lẻ từng dòng thì vẫn hở ở giữa.
- **Khoá càng hẹp càng tốt.** Bọc \`synchronized\` quanh cả một hàm dài nghĩa là các luồng xếp hàng gần như suốt — chương trình chạy chậm như một luồng, mà lại tốn công quản lý luồng.

━━━━━━━━━━━━━━━━━━━━

⚛️ CÁCH SỬA 2: AtomicInteger

Riêng với biến đếm, có cách gọn và nhanh hơn:

\`\`\`java
static final AtomicInteger dem = new AtomicInteger();

dem.incrementAndGet();     // một thao tác KHÔNG THỂ cắt đôi
\`\`\`

\`\`\`
5) AtomicInteger -> dung? true
\`\`\`

"Atomic" nghĩa là không chia nhỏ được: CPU thực hiện đọc-cộng-ghi như một khối, không luồng nào chen vào giữa được. Không cần khoá, không phải xếp hàng, nên nhanh hơn \`synchronized\` cho việc đếm.

Java có cả một bộ cho môi trường nhiều luồng: \`AtomicLong\`, \`AtomicReference\`, \`ConcurrentHashMap\` (thay \`HashMap\`), \`CopyOnWriteArrayList\`.

━━━━━━━━━━━━━━━━━━━━

🧭 QUY TẮC ĐƠN GIẢN ĐỂ KHỎI DÍNH

Chỉ cần trả lời một câu: **dữ liệu này có được nhiều luồng CÙNG SỬA không?**

- Không dùng chung (biến local trong method — Ngày 10, nằm trên stack riêng của từng luồng) → an toàn tuyệt đối
- Dùng chung nhưng chỉ ĐỌC (\`final\`, \`record\` của Ngày 38, \`String\`) → an toàn
- Dùng chung và CÓ SỬA → phải bảo vệ

Đây cũng là lúc lời cảnh báo ở Ngày 14 hiện hình: biến \`static\` sửa được chính là dữ liệu dùng chung của toàn chương trình — mọi luồng đều với tới được. "Biến toàn cục trá hình" không chỉ khó bảo trì, nó còn là mồi cho race condition.

Và cách tránh tốt nhất vẫn là **đừng chia sẻ trạng thái**: mỗi luồng làm việc trên dữ liệu riêng, gộp kết quả ở cuối.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo 3 luồng, mỗi luồng in tên mình 5 lần — quan sát thứ tự xen kẽ.
2. Gọi \`run()\` thay \`start()\` và giải thích vì sao thứ tự trở nên đều đặn.
3. Tái hiện race condition với biến đếm, chạy 10 lần và ghi lại kết quả từng lần.
4. Sửa bằng \`synchronized\`, rồi sửa bằng \`AtomicInteger\` — so hai cách.
5. Bỏ \`join()\` rồi in kết quả — giải thích con số nhận được.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`start()\` chứ không phải \`run()\`. \`join()\` để đợi. Dữ liệu dùng chung mà có sửa thì phải \`synchronized\` hoặc dùng lớp \`Atomic\`. Và nhớ rằng bug đa luồng không tái hiện đều — nên phải phòng từ đầu chứ đừng đợi test bắt.

Nhưng cách viết hôm nay không dùng được cho việc thật. Thử nghĩ: một máy chủ web nhận 10.000 yêu cầu mỗi phút, mỗi yêu cầu \`new Thread\` một lần?

Mỗi luồng tốn khoảng 1MB bộ nhớ ngăn xếp và mất thời gian để hệ điều hành tạo. Mười nghìn luồng là mười gigabyte — máy sập trước khi phục vụ xong.

Ngày 42: \`ExecutorService\` — hồ bơi luồng có sẵn, dùng lại thay vì tạo mới, cùng \`Future\` để nhận kết quả trả về từ luồng. Từ đây bạn sẽ không \`new Thread\` nữa. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
