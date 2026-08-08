/** "100 Ngày Java với CuongThai" — Ngày 43: CompletableFuture.
    Nối chỗ Ngày 42 kết (Future.get() chặn, code lồng tầng tầng). Dùng lại
    lối viết dây chuyền của Stream (Ngày 31) và bọc cause của Ngày 22.
    Ngày 44 (luồng ảo) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21; chỉ
    in ở luồng chính sau `join()` để output tất định. */
export default {
  day: 43,
  card: 'java-day-43',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-resilient-order-fulfillment-pipeline-with-completablefuture-error-recovery',
    title: 'Dây chuyền xử lý đơn hàng có phục hồi lỗi',
  },

  content: `⛓️ 100 NGÀY JAVA — NGÀY 43: COMPLETABLEFUTURE

Hôm qua \`Future.get()\` giải được bài toán "nhận kết quả từ luồng". Nhưng nó CHẶN. Với luồng việc thật:

\`\`\`java
String user = pool.submit(() -> layUser(id)).get();        // đợi 200ms
String don  = pool.submit(() -> layDonHang(user)).get();   // đợi 300ms
double tien = pool.submit(() -> tinhTien(don)).get();      // đợi 100ms
\`\`\`

Luồng chính ngồi đợi 600ms mà chẳng làm gì. Và nếu một bước lỗi thì phải bọc \`try/catch\` quanh từng dòng.

Java 8 cho một cách khác hẳn.

━━━━━━━━━━━━━━━━━━━━

📌 GIAO VIỆC RỒI ĐI TIẾP

\`\`\`java
CompletableFuture<String> f = CompletableFuture.supplyAsync(() -> goiApi("An"));
// luồng chính KHÔNG dừng ở đây
\`\`\`

\`\`\`
1) da giao viec, luong chinh van chay tiep
2) ket qua -> An
\`\`\`

\`supplyAsync\` khi việc có trả về giá trị, \`runAsync\` khi không. Mặc định chúng chạy trên \`ForkJoinPool.commonPool()\` — muốn dùng hồ bơi riêng của Ngày 42 thì truyền vào tham số thứ hai.

━━━━━━━━━━━━━━━━━━━━

🔗 NỐI BƯỚC THÀNH DÂY CHUYỀN

Đây là điểm khác biệt lớn nhất so với \`Future\`:

\`\`\`java
String kq = CompletableFuture
        .supplyAsync(() -> goiApi("An"))
        .thenApply(String::toUpperCase)
        .thenApply(t -> t + " (da xu ly)")
        .join();
\`\`\`

\`\`\`
3) day chuyen -> AN (da xu ly)
\`\`\`

Đọc quen chứ? Đúng lối viết của Stream ở Ngày 31 — nhưng mỗi mắt xích chạy nền, và bước sau tự khởi động khi bước trước xong. Không ai phải \`get()\` giữa chừng.

Bộ method cần nhớ:

\`\`\`java
.thenApply(x -> y)        // biến đổi kết quả
.thenAccept(x -> …)       // tiêu thụ, không trả về
.thenRun(() -> …)         // chạy tiếp, không cần kết quả
.thenCompose(x -> future) // nối với một việc bất đồng bộ KHÁC
\`\`\`

Phân biệt \`thenApply\` và \`thenCompose\`: nếu hàm của bạn trả về một \`CompletableFuture\` nữa thì dùng \`thenCompose\`, không thì bạn nhận về \`CompletableFuture<CompletableFuture<T>>\` lồng hai lớp. (Đúng quan hệ giữa \`map\` và \`flatMap\` ở Ngày 31.)

━━━━━━━━━━━━━━━━━━━━

🤝 SONG SONG RỒI GỘP — CHỖ TIẾT KIỆM THẬT SỰ

\`\`\`java
CompletableFuture<String> a = supplyAsync(() -> goiApi("thong tin"));
CompletableFuture<String> b = supplyAsync(() -> goiApi("don hang"));

a.thenCombine(b, (x, y) -> x + " + " + y).join();
\`\`\`

\`\`\`
4) gop -> thong tin + don hang
\`\`\`

Hai lời gọi API độc lập chạy CÙNG LÚC. Tổng thời gian bằng cái CHẬM NHẤT, không phải tổng hai cái. Một API 200ms và một API 300ms: cách cũ tốn 500ms, cách này tốn 300ms.

Đợi nhiều việc:

\`\`\`java
CompletableFuture.allOf(f1, f2, f3).join();   // đợi TẤT CẢ
CompletableFuture.anyOf(f1, f2, f3).join();   // đợi cái NHANH NHẤT
\`\`\`

\`\`\`
5) allOf -> api-1 api-2 api-3
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧯 LỖI KHÔNG LÀM GÃY DÂY CHUYỀN

\`\`\`java
CompletableFuture
    .supplyAsync(() -> { throw new IllegalStateException("API sap"); })
    .thenApply(x -> "khong bao gio toi day")
    .exceptionally(e -> "gia tri du phong")
    .join();
\`\`\`

\`\`\`
6) exceptionally -> gia tri du phong
\`\`\`

Lỗi **nhảy qua** mọi bước ở giữa và rơi thẳng vào \`exceptionally\` — giống hệt cách ngoại lệ bay lên trong \`try/catch\` (Ngày 21), nhưng ở đây là bất đồng bộ.

Ba cách xử lý:

\`\`\`java
.exceptionally(e -> giaTriDuPhong)        // chỉ khi có lỗi
.handle((kq, e) -> e == null ? kq : "loi") // cả hai trường hợp
.whenComplete((kq, e) -> log(kq, e))       // xem rồi để nguyên
\`\`\`

Không xử lý gì thì:

\`\`\`
7) khong bat -> IllegalStateException
\`\`\`

\`join()\` ném \`CompletionException\` bọc nguyên nhân gốc — lấy ra bằng \`getCause()\`, đúng cơ chế Ngày 22.

(Khác biệt nhỏ: \`get()\` là checked exception nên phải khai \`throws\`, còn \`join()\` là unchecked — Ngày 22. Trong dây chuyền lambda thì \`join()\` tiện hơn.)

━━━━━━━━━━━━━━━━━━━━

⚠️ MỘT LỜI CẢNH BÁO

\`CompletableFuture\` mạnh nhưng dễ bị lạm dụng:

- Việc **nặng CPU** thì bất đồng bộ không giúp gì — CPU vẫn phải tính từng ấy. Nó chỉ đáng khi có CHỜ ĐỢI: mạng, ổ đĩa, cơ sở dữ liệu.
- Dây chuyền dài quá 4–5 mắt xích thì rất khó gỡ lỗi: stack trace không còn nói lên chỗ hỏng thật. Tách thành method có tên.
- Đừng bao giờ gọi \`join()\` bên trong một \`thenApply\` — đó là chặn ngay trong luồng của hồ bơi, dễ dẫn tới cạn luồng và treo cả hệ thống.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết ba hàm giả lập gọi API (mỗi hàm \`sleep\` khác nhau) rồi nối bằng \`thenApply\`.
2. Gọi hai API song song bằng \`thenCombine\`, đo tổng thời gian và so với gọi tuần tự.
3. Cho một bước ném ngoại lệ, dùng \`exceptionally\` trả giá trị mặc định.
4. Dùng \`handle\` để xử lý cả trường hợp thành công lẫn lỗi trong một chỗ.
5. Nối hai việc bất đồng bộ bằng \`thenApply\` (sai) rồi bằng \`thenCompose\` (đúng) — so kiểu trả về.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`CompletableFuture\` biến chuỗi việc bất đồng bộ thành một dây chuyền đọc được: \`thenApply\` nối bước, \`thenCombine\` gộp việc song song, \`exceptionally\` lo lỗi. Không ai ngồi đợi ai.

Nhưng vẫn còn một giới hạn cứng từ Ngày 42: số luồng. Hồ bơi 200 luồng thì 201 yêu cầu cùng lúc là cái thứ 201 phải xếp hàng — dù nó chỉ ngồi đợi mạng chứ không tính toán gì.

Vì sao không tạo 10.000 luồng? Vì mỗi luồng hệ điều hành tốn ~1MB.

Java 21 phá bỏ giới hạn đó.

Ngày 44: **luồng ảo** (virtual threads) — luồng nhẹ tới mức tạo một triệu cái cũng được, và cách viết thì quay lại đúng kiểu tuần tự dễ đọc của Ngày 41. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
