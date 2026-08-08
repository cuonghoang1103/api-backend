/**
 * Thẻ bài học "100 Ngày Java" — Ngày 42: ExecutorService & Future.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-42.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Output phải TẤT ĐỊNH: dùng `invokeAll` (giữ đúng thứ tự nộp) chứ không
 * để các luồng tự in ra — thứ tự đó đổi mỗi lần chạy và thẻ sẽ hỏng. Việc đầu
 * tiên `sleep(30)` để `isDone()` chắc chắn là false lúc vừa submit.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 42,
  total: 100,
  titleLead: 'Java Day 42:',
  titleAccent: 'ExecutorService',
  subtitle: 'Hồ bơi luồng — đừng new Thread cho từng việc nữa 🏊',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. TÁI SỬ DỤNG THAY VÌ TẠO MỚI 🏊',
      code: `ExecutorService pool = Executors.newFixedThreadPool(3);
pool.submit(() -> lamViec());
…
pool.shutdown();      // BAT BUOC, khong chuong trinh khong thoat`,
      notes: [
        { mark: 'no', text: 'Mỗi `Thread` tốn ~1MB stack — 10.000 yêu cầu mà tạo mới là sập máy' },
        { mark: 'ok', text: 'Ba luồng làm hết mọi việc trong hàng đợi, xong việc này lấy việc khác' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. Future — NHẬN ĐƯỢC KẾT QUẢ 📨',
      code: `Future<Integer> f = pool.submit(() -> 6 * 7);
f.isDone()   // false — chua xong
f.get()      // 42 — CHO toi khi xong`,
      notes: [
        { mark: 'ok', text: '`Runnable` không trả gì · `Callable` trả về giá trị — đó là khác biệt' },
        { mark: 'no', text: '`get()` là chặn: gọi ngay sau `submit` thì mất hết tính song song' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NGOẠI LỆ KHÔNG BỊ NUỐT 🧯',
      code: `Future<Integer> loi = pool.submit(() -> 10 / 0);
try { loi.get(); }
catch (ExecutionException e) {
    e.getCause();   // ArithmeticException — nguyen nhan GOC
}`,
      notes: [
        { mark: 'ok', text: 'Lỗi trong luồng được gói lại, lấy ra bằng `getCause()` — đúng kiểu **Ngày 22**' },
        { mark: 'no', text: 'Không bao giờ gọi `get()` thì lỗi nằm im mãi, không ai biết' },
      ],
    },
    {
      tone: 'green',
      title: '4. NHIỀU VIỆC MỘT LƯỢT 📦',
      code: `List<Future<String>> ket = pool.invokeAll(viec);
// tra ve theo DUNG THU TU NOP, du chay xen ke

ConcurrentHashMap.merge(...)   // dem an toan giua cac luong`,
      notes: [{ mark: 'ok', text: '`invokeAll` đợi tất cả xong; thứ tự kết quả ổn định nên test được' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Từ nay: `ExecutorService` + `Future`, không `new Thread` thủ công' },
        { mark: 'next', text: '**Ngày 43**: `CompletableFuture` — nối các việc bất đồng bộ thành dây chuyền' },
      ],
    },
  ],

  /* Output THẬT của `java HoBoiLuong` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) da submit, xong chua? false',
      '2) f.get() (cho toi khi xong) -> 42',
      '3) invokeAll -> viec-1 viec-2 viec-3 viec-4 viec-5',
      '4) loi trong luong -> ArithmeticException',
      '5) ConcurrentHashMap dem -> 100',
      '6) da shutdown? true | ket thuc trong 2s? true',
    ],
  },

  verify: {
    className: 'HoBoiLuong',
    source: `import java.util.*;
import java.util.concurrent.*;

public class HoBoiLuong {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        Future<Integer> f = pool.submit(() -> {
            Thread.sleep(30);
            return 6 * 7;
        });
        System.out.println("1) da submit, xong chua? " + f.isDone());
        System.out.println("2) f.get() (cho toi khi xong) -> " + f.get());

        List<Callable<String>> viec = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            int n = i;
            viec.add(() -> { Thread.sleep(20); return "viec-" + n; });
        }
        List<Future<String>> ket = pool.invokeAll(viec);
        StringBuilder sb = new StringBuilder();
        for (Future<String> k : ket) sb.append(k.get()).append(" ");
        System.out.println("3) invokeAll -> " + sb.toString().trim());

        Future<Integer> loi = pool.submit(() -> 10 / 0);
        try { loi.get(); }
        catch (ExecutionException e) {
            System.out.println("4) loi trong luong -> " + e.getCause().getClass().getSimpleName());
        }

        ConcurrentHashMap<String, Integer> dem = new ConcurrentHashMap<>();
        List<Callable<Void>> viecDem = new ArrayList<>();
        for (int i = 0; i < 100; i++) viecDem.add(() -> { dem.merge("tong", 1, Integer::sum); return null; });
        pool.invokeAll(viecDem);
        System.out.println("5) ConcurrentHashMap dem -> " + dem.get("tong"));

        pool.shutdown();
        System.out.println("6) da shutdown? " + pool.isShutdown()
                + " | ket thuc trong 2s? " + pool.awaitTermination(2, TimeUnit.SECONDS));
    }
}`,
  },
};
