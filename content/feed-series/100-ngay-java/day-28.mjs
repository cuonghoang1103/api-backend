/** "100 Ngày Java với CuongThai" — Ngày 28: Queue, Deque, Stack.
    Nối thẳng chỗ Ngày 27 kết (hàng đợi in ấn và nút Undo). Ngày 29 mở
    Generics nên phần kết phải dẫn về cặp ngoặc <> đã dùng suốt tuần.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 28,
  card: 'java-day-28',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-multi-level-task-scheduling-system-using-priority-queues',
    title: 'Lịch công việc nhiều mức bằng hàng đợi ưu tiên',
  },

  content: `🎫 100 NGÀY JAVA — NGÀY 28: QUEUE & DEQUE

Hôm qua tôi để lại hai kiểu truy cập mà \`List\`/\`Set\`/\`Map\` đều không diễn tả gọn:

- Hàng đợi in: ai gửi trước in trước — **vào trước ra trước** (FIFO)
- Nút Undo: thao tác vừa làm huỷ đầu tiên — **vào sau ra trước** (LIFO)

Làm bằng \`ArrayList\` thì được, nhưng \`remove(0)\` phải dồn cả danh sách (Ngày 24), và tên method không nói lên ý định. Java có hẳn hai họ cho hai việc này.

━━━━━━━━━━━━━━━━━━━━

🎫 QUEUE — XẾP HÀNG

\`\`\`java
Queue<String> inAn = new LinkedList<>();
inAn.offer("bai1.pdf");
inAn.offer("bai2.pdf");
inAn.offer("bai3.pdf");

inAn.poll();     // bai1.pdf — người gửi đầu tiên
\`\`\`

Chạy thật:

\`\`\`
1) FIFO lay ra -> bai1.pdf | con lai [bai2.pdf, bai3.pdf]
\`\`\`

Ba việc chính: \`offer\` (thêm cuối) · \`poll\` (lấy + xoá đầu) · \`peek\` (xem đầu, không xoá).

**Mỗi việc có hai bản, khác nhau ở lúc rỗng:**

\`\`\`
4) poll khi rong -> null
5) remove khi rong -> NoSuchElementException
\`\`\`

- \`offer\` / \`poll\` / \`peek\` — trả \`null\` hoặc \`false\`, hiền
- \`add\` / \`remove\` / \`element\` — ném ngoại lệ

Chọn theo tình huống: hàng đợi rỗng là chuyện bình thường thì dùng bản hiền; rỗng là chuyện bất thường thì dùng bản ném (đúng tinh thần Ngày 22 — ngoại lệ dành cho việc bất thường).

━━━━━━━━━━━━━━━━━━━━

🥞 NGĂN XẾP — VÀ MỘT LỜI KHUYÊN NGƯỢC ĐỜI

Java có class tên \`Stack\`. **Đừng dùng nó.**

Nó ra đời từ Java 1.0, kế thừa \`Vector\` — một class cũ luôn đồng bộ hoá (bạn trả giá tốc độ cho thứ mình không cần), và vì kế thừa nên nó lỡ để lộ luôn cả \`get(i)\`, \`add(i, x)\` — những việc một ngăn xếp không nên cho phép. Đúng cái bẫy "kế thừa thư viện" của Ngày 19, lần này chính thư viện chuẩn dính.

Cách Java khuyến nghị:

\`\`\`java
Deque<String> undo = new ArrayDeque<>();
undo.push("go chu");
undo.push("to mau");
undo.push("xoa dong");

undo.pop();      // xoa dong — thao tác gần nhất
\`\`\`

\`\`\`
2) LIFO lay ra -> xoa dong | con lai [to mau, go chu]
\`\`\`

\`push\` / \`pop\` / \`peek\` — vẫn đúng bộ từ vựng ngăn xếp, nhưng nhanh hơn và không lộ thứ không nên lộ.

━━━━━━━━━━━━━━━━━━━━

↔️ DEQUE — HAI ĐẦU ĐỀU MỞ

\`Deque\` (đọc là "đếch", *double-ended queue*) cho phép thêm/xoá ở CẢ HAI đầu:

\`\`\`java
Deque<Integer> hai = new ArrayDeque<>();
hai.addFirst(1);
hai.addLast(2);
hai.addFirst(0);
\`\`\`

\`\`\`
3) hai dau -> [0, 1, 2] | first=0 last=2
\`\`\`

Nhờ vậy một \`Deque\` đóng được cả hai vai: dùng \`addLast\`+\`pollFirst\` thì nó là hàng đợi, dùng \`push\`+\`pop\` thì nó là ngăn xếp.

Và quan trọng: cả hai đầu đều nhanh. \`ArrayList.remove(0)\` phải dồn toàn bộ phần sau lên một ô; \`ArrayDeque\` thì không, vì nó là mảng vòng — chỉ dịch con trỏ đầu.

━━━━━━━━━━━━━━━━━━━━

🥇 PRIORITYQUEUE — RA THEO ĐỘ QUAN TRỌNG

\`\`\`java
Queue<Integer> uuTien = new PriorityQueue<>(List.of(50, 10, 30));
while (!uuTien.isEmpty()) System.out.print(uuTien.poll() + " ");
\`\`\`

\`\`\`
6) PriorityQueue ra -> 10 30 50
\`\`\`

Vào 50, 10, 30 nhưng ra 10, 30, 50: nó không quan tâm ai đến trước, chỉ quan tâm ai "nhỏ nhất" — và định nghĩa "nhỏ nhất" đến từ \`Comparable\`/\`Comparator\` của Ngày 26.

Đây là cấu trúc cho phòng cấp cứu (bệnh nặng khám trước), cho lịch chạy tác vụ, cho thuật toán Dijkstra.

**Một bẫy hay gặp:** in thẳng \`System.out.println(uuTien)\` KHÔNG ra thứ tự đã sắp — bên trong nó là một cây heap, chỉ bảo đảm phần tử đầu là nhỏ nhất. Muốn thứ tự đúng thì phải \`poll()\` lần lượt.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Mô phỏng hàng đợi in: thêm 5 tài liệu, in ra theo đúng thứ tự gửi.
2. Làm chức năng Undo bằng \`ArrayDeque\`: thực hiện 4 thao tác rồi huỷ 2.
3. Dùng một \`Deque\` vừa làm hàng đợi vừa làm ngăn xếp, in ra để thấy khác biệt.
4. Kiểm tra chuỗi ngoặc \`"(a[b]{c})"\` có cân đối không bằng ngăn xếp.
5. \`PriorityQueue<SinhVien>\` sắp theo điểm giảm dần — in cả hàng đợi rồi \`poll()\` từng em, so hai kết quả.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Chọn cấu trúc theo CÁCH BẠN SẼ LẤY RA: đầu hàng (\`Queue\`), đỉnh chồng (\`Deque\` làm stack), cả hai đầu (\`Deque\`), hay theo độ ưu tiên (\`PriorityQueue\`). Và tránh class \`Stack\` cũ.

Giờ nhìn lại năm ngày vừa rồi, có một thứ xuất hiện ở TẤT CẢ mọi dòng mà tôi chỉ hứa "sẽ giải thích sau":

\`\`\`java
List<String>          Map<String, Integer>
Set<SinhVien>         Queue<Integer>
Comparable<SinhVien>  Iterator<String>
\`\`\`

Cặp ngoặc nhọn đó là **generics**. Nhờ nó mà \`get()\` trả về \`String\` chứ không phải \`Object\` phải ép kiểu, và bỏ nhầm một \`Integer\` vào \`List<String>\` là lỗi ngay lúc dịch.

Ngày 29 mở Giai đoạn 5: viết class và method của riêng bạn có generics — cách dùng lại một đoạn code cho MỌI kiểu dữ liệu mà không mất an toàn kiểu. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
