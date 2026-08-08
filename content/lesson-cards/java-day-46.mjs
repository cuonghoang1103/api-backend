/**
 * Thẻ bài học "100 Ngày Java" — Ngày 46: Chẩn đoán đa luồng (thread dump).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-46.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Bài này về `jstack` — một công cụ DÒNG LỆNH, không dán được vào thẻ.
 * Nên chương trình kiểm chứng dùng `ThreadMXBean`, tức là CHÍNH cái API mà
 * jstack đứng trên: nó tự tạo deadlock rồi tự phát hiện, và tên luồng được
 * SẮP XẾP trước khi in để output tất định.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 46,
  total: 100,
  titleLead: 'Java Day 46:',
  titleAccent: 'Chẩn đoán luồng',
  subtitle: 'Máy chủ đứng im, CPU 0%, không log — tìm thủ phạm thế nào 🔎',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. JVM TỰ BIẾT MÌNH ĐANG DEADLOCK 🔎',
      code: `ThreadMXBean mx = ManagementFactory.getThreadMXBean();
long[] ket = mx.findDeadlockedThreads();   // != null la CO deadlock
// -> phat hien? true | so luong ket -> 2`,
      notes: [
        { mark: 'ok', text: 'API sẵn trong JDK — nhúng vào health check là tự phát hiện được' },
        { mark: 'dot', text: '`jstack <pid>` đứng trên chính API này, in ra dạng người đọc' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CHỈ MẶT ĐÚNG LUỒNG VÀ KHOÁ 🎯',
      code: `ThreadInfo[] info = mx.getThreadInfo(ket);
info[0].getThreadName()     // luong-A
info[0].getThreadState()    // BLOCKED
info[0].getLockOwnerName()  // ai dang giu khoa no doi`,
      notes: [{ mark: 'ok', text: 'Có tên luồng + tên khoá + chủ khoá là lần ra dòng code trong vài phút' }],
    },
    {
      tone: 'pink',
      title: '3. ĐỌC TRẠNG THÁI LUỒNG 📊',
      code: `RUNNABLE       dang chay (hoac cho I/O)
BLOCKED        cho vao khoi synchronized   ← nghi deadlock
WAITING        cho vo han (join, wait)
TIMED_WAITING  cho co han (sleep, tryLock 100ms)`,
      notes: [{ mark: 'no', text: 'Nhiều luồng `BLOCKED` cùng một khoá = điểm nghẽn hoặc deadlock' }],
    },
    {
      tone: 'green',
      title: '4. NGOÀI ĐỜI: BA LỆNH 🧰',
      code: `jps -l                  # tim pid tien trinh Java
jstack <pid> > dump.txt # chup trang thai MOI luong
jcmd <pid> Thread.print # tuong duong, moi hon

# lap lai 3 lan cach nhau 5s -> so xem luong nao KHONG doi`,
      notes: [{ mark: 'ok', text: 'jstack tìm chữ *"Found one Java-level deadlock"* là ra ngay' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Treo mà CPU 0% ⇒ chụp thread dump TRƯỚC khi khởi động lại' },
        { mark: 'next', text: '**Ngày 47**: `BlockingQueue` — mô hình sản xuất/tiêu thụ' },
      ],
    },
  ],

  /* Output THẬT của `java ChanDoan` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) JVM phat hien deadlock? true',
      '2) so luong bi ket -> 2',
      '3) ten cac luong -> [luong-A, luong-B]',
      '4) trang thai -> BLOCKED',
      '5) dang doi khoa do luong -> true',
      '6) luong-A con song? true | state BLOCKED',
      '7) tong so luong > 2? true',
    ],
  },

  verify: {
    className: 'ChanDoan',
    source: `import java.lang.management.*;
import java.util.*;

public class ChanDoan {
    static final Object k1 = new Object(), k2 = new Object();

    public static void main(String[] args) throws Exception {
        Thread a = new Thread(() -> { synchronized (k1) { nghi(100); synchronized (k2) {} } }, "luong-A");
        Thread b = new Thread(() -> { synchronized (k2) { nghi(100); synchronized (k1) {} } }, "luong-B");
        a.start(); b.start();
        Thread.sleep(500);

        ThreadMXBean mx = ManagementFactory.getThreadMXBean();
        long[] ket = mx.findDeadlockedThreads();
        System.out.println("1) JVM phat hien deadlock? " + (ket != null));
        System.out.println("2) so luong bi ket -> " + (ket == null ? 0 : ket.length));

        if (ket != null) {
            ThreadInfo[] info = mx.getThreadInfo(ket);
            List<String> ten = new ArrayList<>();
            for (ThreadInfo i : info) ten.add(i.getThreadName());
            Collections.sort(ten);
            System.out.println("3) ten cac luong -> " + ten);
            System.out.println("4) trang thai -> " + info[0].getThreadState());
            System.out.println("5) dang doi khoa do luong -> " + (info[0].getLockOwnerName() != null));
        }

        System.out.println("6) luong-A con song? " + a.isAlive() + " | state " + a.getState());
        System.out.println("7) tong so luong > 2? " + (mx.getThreadCount() > 2));

        System.exit(0);
    }

    static void nghi(int ms) { try { Thread.sleep(ms); } catch (InterruptedException ignored) {} }
}`,
  },
};
