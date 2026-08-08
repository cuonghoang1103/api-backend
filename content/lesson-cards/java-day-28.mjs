/**
 * Thẻ bài học "100 Ngày Java" — Ngày 28: Queue, Deque, Stack.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-28.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 28,
  total: 100,
  titleLead: 'Java Day 28:',
  titleAccent: 'Queue & Deque',
  subtitle: 'Vào trước ra trước · vào sau ra trước — và vì sao đừng dùng Stack cũ 🎫',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. QUEUE — VÀO TRƯỚC RA TRƯỚC 🎫',
      code: `Queue<String> inAn = new LinkedList<>();
inAn.offer("bai1.pdf");  inAn.offer("bai2.pdf");
inAn.poll();   // bai1.pdf — ai gui truoc in truoc`,
      notes: [
        { mark: 'ok', text: 'Hàng đợi in, xử lý đơn hàng, BFS — mọi thứ "xếp hàng"' },
        { mark: 'dot', text: '`offer/poll/peek` trả `null` khi rỗng · `add/remove/element` thì NÉM lỗi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. DEQUE LÀM NGĂN XẾP — VÀO SAU RA TRƯỚC 🥞',
      code: `Deque<String> undo = new ArrayDeque<>();
undo.push("go chu");  undo.push("xoa dong");
undo.pop();    // xoa dong — thao tac vua lam huy dau tien`,
      notes: [
        { mark: 'no', text: 'ĐỪNG dùng class `Stack` cũ: kế thừa `Vector`, đồng bộ thừa, chậm' },
        { mark: 'ok', text: 'Java khuyến nghị `ArrayDeque` cho cả ngăn xếp lẫn hàng đợi' },
      ],
    },
    {
      tone: 'pink',
      title: '3. DEQUE = HAI ĐẦU ĐỀU MỞ ↔️',
      code: `hai.addFirst(1);  hai.addLast(2);  hai.addFirst(0);
// [0, 1, 2]   peekFirst=0   peekLast=2`,
      notes: [{ mark: 'ok', text: 'Thêm/xoá hai đầu đều nhanh — `ArrayList.remove(0)` thì phải dồn cả mảng' }],
    },
    {
      tone: 'green',
      title: '4. PRIORITYQUEUE — RA THEO ƯU TIÊN 🥇',
      code: `Queue<Integer> q = new PriorityQueue<>(List.of(50, 10, 30));
q.poll() ... -> 10 30 50   // KHONG theo thu tu vao`,
      notes: [
        { mark: 'dot', text: 'Thứ tự do `Comparable`/`Comparator` quyết định — **Ngày 26**' },
        { mark: 'no', text: 'In thẳng cả hàng đợi KHÔNG ra thứ tự đã sắp — chỉ `poll()` mới đúng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Chọn cấu trúc theo CÁCH LẤY RA: đầu · cuối · hai đầu · ưu tiên' },
        { mark: 'next', text: '**Ngày 29**: Generics — cặp ngoặc `<>` dùng suốt tuần rốt cuộc là gì' },
      ],
    },
  ],

  /* Output THẬT của `java HangDoi` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) FIFO lay ra -> bai1.pdf | con lai [bai2.pdf, bai3.pdf]',
      '2) LIFO lay ra -> xoa dong | con lai [to mau, go chu]',
      '3) hai dau -> [0, 1, 2] | first=0 last=2',
      '4) poll khi rong -> null',
      '5) remove khi rong -> NoSuchElementException',
      '6) PriorityQueue ra -> 10 30 50',
    ],
  },

  verify: {
    className: 'HangDoi',
    source: `import java.util.*;

public class HangDoi {
    public static void main(String[] args) {
        Queue<String> inAn = new LinkedList<>();
        inAn.offer("bai1.pdf"); inAn.offer("bai2.pdf"); inAn.offer("bai3.pdf");
        System.out.println("1) FIFO lay ra -> " + inAn.poll() + " | con lai " + inAn);

        Deque<String> undo = new ArrayDeque<>();
        undo.push("go chu"); undo.push("to mau"); undo.push("xoa dong");
        System.out.println("2) LIFO lay ra -> " + undo.pop() + " | con lai " + undo);

        Deque<Integer> hai = new ArrayDeque<>();
        hai.addFirst(1); hai.addLast(2); hai.addFirst(0);
        System.out.println("3) hai dau -> " + hai + " | first=" + hai.peekFirst() + " last=" + hai.peekLast());

        Queue<String> rong = new LinkedList<>();
        System.out.println("4) poll khi rong -> " + rong.poll());
        try { rong.remove(); }
        catch (NoSuchElementException e) { System.out.println("5) remove khi rong -> NoSuchElementException"); }

        Queue<Integer> uuTien = new PriorityQueue<>(List.of(50, 10, 30));
        StringBuilder sb = new StringBuilder();
        while (!uuTien.isEmpty()) sb.append(uuTien.poll()).append(" ");
        System.out.println("6) PriorityQueue ra -> " + sb.toString().trim());
    }
}`,
  },
};
