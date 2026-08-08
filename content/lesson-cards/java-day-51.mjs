/**
 * Thẻ bài học "100 Ngày Java" — Ngày 51: Bên trong JVM. Mở Giai đoạn 7.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-51.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ KHÔNG viết phần gây `OutOfMemoryError` trong `verify`: script chạy `java`
 * KHÔNG kèm `-Xmx`, nên với heap mặc định vài GB nó sẽ ngốn RAM và chạy rất
 * lâu mỗi lần dựng thẻ. Bản đầu có phần đó, đã bỏ.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 51,
  total: 100,
  titleLead: 'Java Day 51:',
  titleAccent: 'Bên trong JVM',
  subtitle: 'Stack, heap, và bộ dọn rác — tầng bạn đứng lên suốt 50 ngày 🧠',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HAI VÙNG NHỚ 🧠',
      code: `STACK  moi LUONG mot cai rieng — bien local, tham so
       tu don khi thoat method, RAT nhanh
HEAP   dung chung — moi doi tuong tao bang new
       GC don, cham hon`,
      notes: [
        { mark: 'ok', text: 'Nay mới đủ chữ để giải thích **Ngày 10**: biến local không có mặc định vì stack không xoá sẵn' },
        { mark: 'dot', text: 'Biến local an toàn đa luồng miễn phí — mỗi luồng một stack (**Ngày 41**)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐỆ QUY QUÁ SÂU = TRÀN STACK 📚',
      code: `static int doSau() { return 1 + doSau(); }
// -> StackOverflowError sau hang chuc nghin khung
// bat duoc, nhung do la LOI LOGIC, khong phai het RAM`,
      notes: [{ mark: 'no', text: 'Stack mặc định ~512KB–1MB mỗi luồng, không liên quan tới `-Xmx`' }],
    },
    {
      tone: 'pink',
      title: '3. RÁC = KHÔNG CÒN AI TRỎ TỚI 🗑️',
      code: `giu.clear(); giu = null;   // tha tham chieu
System.gc();               // GOI Y thoi, khong phai lenh
// -> bo nho giam? true`,
      notes: [
        { mark: 'ok', text: 'Không có `free()` — cứ thả tham chiếu, GC lo phần còn lại' },
        { mark: 'no', text: 'Rò rỉ bộ nhớ trong Java = **vô tình giữ tham chiếu**, không phải quên giải phóng' },
      ],
    },
    {
      tone: 'green',
      title: '4. HEAP TO BAO NHIÊU LÀ DO BẠN ĐẶT 📐',
      code: `java -Xmx512m ChuongTrinh    # heap toi da 512MB
Runtime.getRuntime().maxMemory()

# May 16GB RAM van OutOfMemoryError neu -Xmx dat 256m`,
      notes: [{ mark: 'ok', text: 'Trong Docker: đặt `-Xmx` thấp hơn giới hạn container, kẻo bị OOM-kill' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Biến local → stack · đối tượng → heap · rác = không ai trỏ tới' },
        { mark: 'next', text: '**Ngày 52**: bộ dọn rác làm việc thế nào và vì sao ứng dụng "khựng"' },
      ],
    },
  ],

  /* Output THẬT của `java BenTrongJVM` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) cap ~10MB tren heap -> bo nho tang? true',
      '2) tha tham chieu roi gc -> bo nho giam? true',
      '3) de quy toi han > 1000 khung? true',
      '4) bien local tren stack rieng -> co luong nao sai? false',
      '5) heap toi da JVM duoc cap > 0 MB? true',
      '6) so nhan CPU JVM nhin thay > 0? true',
    ],
  },

  verify: {
    className: 'BenTrongJVM',
    source: `import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class BenTrongJVM {
    public static void main(String[] args) throws Exception {
        Runtime rt = Runtime.getRuntime();

        long truoc = rt.totalMemory() - rt.freeMemory();
        List<byte[]> giu = new ArrayList<>();
        for (int i = 0; i < 100; i++) giu.add(new byte[100_000]);
        long sau = rt.totalMemory() - rt.freeMemory();
        System.out.println("1) cap ~10MB tren heap -> bo nho tang? " + (sau > truoc));

        giu.clear();
        giu = null;
        System.gc();
        Thread.sleep(100);
        long sauGc = rt.totalMemory() - rt.freeMemory();
        System.out.println("2) tha tham chieu roi gc -> bo nho giam? " + (sauGc < sau));

        System.out.println("3) de quy toi han > 1000 khung? " + (doSauToiDa() > 1000));

        AtomicInteger lech = new AtomicInteger();
        Runnable r = () -> { int cucBo = 0; for (int i = 0; i < 100_000; i++) cucBo++; if (cucBo != 100_000) lech.incrementAndGet(); };
        Thread t1 = new Thread(r), t2 = new Thread(r);
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("4) bien local tren stack rieng -> co luong nao sai? " + (lech.get() > 0));

        System.out.println("5) heap toi da JVM duoc cap > 0 MB? " + (rt.maxMemory() / 1024 / 1024 > 0));
        System.out.println("6) so nhan CPU JVM nhin thay > 0? " + (rt.availableProcessors() > 0));
    }

    static int doSauToiDa() {
        try { return 1 + doSauToiDa(); }
        catch (StackOverflowError e) { return 0; }
    }
}`,
  },
};
