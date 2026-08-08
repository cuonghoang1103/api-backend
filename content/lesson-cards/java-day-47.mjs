/**
 * Thẻ bài học "100 Ngày Java" — Ngày 47: BlockingQueue & sản xuất/tiêu thụ.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-47.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Output giữ TẤT ĐỊNH bằng cách chỉ in
 * TỔNG KẾT (đủ việc chưa, xong trong hạn chưa) — không để thợ tự in ra, vì
 * thứ tự đó đổi mỗi lần chạy.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 47,
  total: 100,
  titleLead: 'Java Day 47:',
  titleAccent: 'BlockingQueue',
  subtitle: 'Đừng chia sẻ biến — hãy chuyền tin nhắn 📮',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HÀNG ĐỢI TỰ LO ĐỒNG BỘ 📮',
      code: `BlockingQueue<String> hang = new ArrayBlockingQueue<>(5);

hang.put("viec");    // DAY thi doi
hang.take();         // RONG thi doi
// KHONG synchronized, KHONG lock, KHONG race condition`,
      notes: [
        { mark: 'ok', text: 'Cả lớp bug của Ngày 41-46 đơn giản là không xuất hiện' },
        { mark: 'dot', text: 'Mỗi việc chỉ MỘT thợ nhận — hàng đợi bảo đảm điều đó' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. MỘT NGƯỜI ĐƯA, NHIỀU THỢ LÀM 👷',
      code: `// 1 luong: for (...) hang.put("viec-" + i);
// 3 luong: while (true) { v = hang.take(); xuLy(v); }
// 50 viec, 3 tho -> xu ly du? true`,
      notes: [{ mark: 'ok', text: 'Thợ nhanh tự nhận nhiều việc hơn — cân tải khỏi phải tính' }],
    },
    {
      tone: 'pink',
      title: '3. SỨC CHỨA = VAN AN TOÀN 🛡️',
      code: `new ArrayBlockingQueue<>(5)     // co han -> nguoi dua PHAI cho
new LinkedBlockingQueue<>()     // "vo han" -> tran bo nho neu dua qua nhanh

offer(x)                   // day thi tra false ngay
offer(x, 50, MILLISECONDS) // cho toi da 50ms`,
      notes: [{ mark: 'no', text: 'Hàng đợi không giới hạn + người đưa nhanh hơn thợ = `OutOfMemoryError`' }],
    },
    {
      tone: 'green',
      title: '4. DỪNG SAO CHO ĐÚNG 🛑',
      code: `hang.put(HET);                 // tin hieu ket thuc
// tho: if (v.equals(HET)) { hang.put(HET); break; }
//      ^ tra lai de tho khac cung thay`,
      notes: [
        { mark: 'ok', text: 'Không có tín hiệu thì thợ đợi mãi ở `take()` và chương trình không thoát' },
        { mark: 'dot', text: 'Còn `PriorityBlockingQueue` khi việc có độ ưu tiên khác nhau' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nhiều luồng phối hợp ⇒ nghĩ HÀNG ĐỢI trước, nghĩ khoá sau' },
        { mark: 'next', text: '**Ngày 48**: `parallelStream` — song song hoá bằng một chữ' },
      ],
    },
  ],

  /* Output THẬT của `java SanXuatTieuThu` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) 50 viec, 3 tho -> xu ly du? true',
      '2) moi tho ket thuc trong 5s? true',
      '3) suc chua 2, con cho? 0 | offer them duoc? false',
      '4) offer co han 50ms -> false',
      '5) poll 50ms tren hang rong -> null',
      '6) PriorityBlockingQueue lay ra -> 10 30',
    ],
  },

  verify: {
    className: 'SanXuatTieuThu',
    source: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class SanXuatTieuThu {
    static final String HET = "__HET__";

    public static void main(String[] args) throws Exception {
        BlockingQueue<String> hang = new ArrayBlockingQueue<>(5);
        AtomicInteger daXuLy = new AtomicInteger();
        final int SO_VIEC = 50, SO_THO = 3;

        ExecutorService tho = Executors.newFixedThreadPool(SO_THO);
        for (int i = 0; i < SO_THO; i++) {
            tho.submit(() -> {
                while (true) {
                    String v = hang.take();
                    if (v.equals(HET)) { hang.put(HET); break; }
                    daXuLy.incrementAndGet();
                }
                return null;
            });
        }

        for (int i = 1; i <= SO_VIEC; i++) hang.put("viec-" + i);
        hang.put(HET);

        tho.shutdown();
        boolean xong = tho.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("1) " + SO_VIEC + " viec, " + SO_THO + " tho -> xu ly du? " + (daXuLy.get() == SO_VIEC));
        System.out.println("2) moi tho ket thuc trong 5s? " + xong);

        BlockingQueue<Integer> nho = new ArrayBlockingQueue<>(2);
        nho.put(1); nho.put(2);
        System.out.println("3) suc chua 2, con cho? " + nho.remainingCapacity()
                + " | offer them duoc? " + nho.offer(3));
        System.out.println("4) offer co han 50ms -> " + nho.offer(3, 50, TimeUnit.MILLISECONDS));

        BlockingQueue<String> rong = new LinkedBlockingQueue<>();
        System.out.println("5) poll 50ms tren hang rong -> " + rong.poll(50, TimeUnit.MILLISECONDS));

        BlockingQueue<Integer> uuTien = new PriorityBlockingQueue<>();
        uuTien.put(50); uuTien.put(10); uuTien.put(30);
        System.out.println("6) PriorityBlockingQueue lay ra -> " + uuTien.take() + " " + uuTien.take());
    }
}`,
  },
};
