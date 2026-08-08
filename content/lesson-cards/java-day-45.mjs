/**
 * Thẻ bài học "100 Ngày Java" — Ngày 45: ReentrantLock, Semaphore, deadlock.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-45.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ HAI CẶP KHOÁ RIÊNG (k1/k2 cho deadlock, k3/k4 cho cách sửa) là CỐ Ý:
 * bản đầu dùng chung một cặp, nên phép thử "cách sửa" chạy trên hai khoá vẫn
 * đang bị deadlock giữ và in ra `false` — tức là "chứng minh" cách sửa không
 * hoạt động, ngược hẳn sự thật. Cùng loại lỗi đã gặp ở thẻ Ngày 13.
 * `System.exit(0)` ở cuối để chương trình thoát dù hai luồng deadlock còn treo.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 45,
  total: 100,
  titleLead: 'Java Day 45:',
  titleAccent: 'Khoá & Deadlock',
  subtitle: 'ReentrantLock, Semaphore, và hai luồng đứng im mãi mãi 🔐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ReentrantLock — synchronized CÓ ĐIỀU KHIỂN 🔐',
      code: `lock.lock();
try { dem++; }
finally { lock.unlock(); }     // unlock PHAI o finally (Ngay 21)`,
      notes: [
        { mark: 'no', text: 'Quên `unlock` là khoá kẹt vĩnh viễn — `synchronized` thì tự nhả' },
        { mark: 'ok', text: 'Đổi lại: khoá được nhiều thứ mà `synchronized` không làm nổi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. tryLock — THỬ, KHÔNG ĐƯỢC THÌ THÔI ⏱️',
      code: `lock.tryLock()                          // false neu nguoi khac dang giu
lock.tryLock(100, TimeUnit.MILLISECONDS) // cho toi da 100ms`,
      notes: [
        { mark: 'ok', text: '`synchronized` chỉ có "đợi tới chết" — không có lối thoát' },
        { mark: 'ok', text: 'Nhờ hạn chờ mà tránh được treo vô hạn' },
      ],
    },
    {
      tone: 'pink',
      title: '3. Semaphore — CHO TỐI ĐA N LUỒNG 🎟️',
      code: `Semaphore cho = new Semaphore(2);
cho.acquire();   // xin mot cho
cho.release();   // tra lai
// het cho -> tryAcquire() tra false`,
      notes: [{ mark: 'ok', text: 'Giới hạn số kết nối DB, số lời gọi API đồng thời — việc rất thật' }],
    },
    {
      tone: 'green',
      title: '4. DEADLOCK: HAI LUỒNG ĐỨNG IM MÃI ☠️',
      code: `Luong A: giu k1, doi k2
Luong B: giu k2, doi k1
// -> con ket? true   (mai mai)

// SUA: luon lay khoa theo CUNG MOT THU TU
// -> ca hai xong? true`,
      notes: [
        { mark: 'no', text: 'Không có ngoại lệ, không log, không timeout — chương trình chỉ đứng im' },
        { mark: 'ok', text: 'Ba cách tránh: cùng thứ tự khoá · `tryLock` có hạn · giữ ít khoá nhất có thể' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Cần `tryLock`/hạn chờ/nhiều điều kiện → `ReentrantLock`; còn lại `synchronized` là đủ' },
        { mark: 'next', text: '**Ngày 46**: gỡ lỗi đa luồng — jstack, thread dump, và cách đọc' },
      ],
    },
  ],

  /* Output THẬT của `java Khoa` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) ReentrantLock -> dung? true',
      '2) tryLock khi nguoi khac dang giu -> false',
      '3) tryLock 100ms khi ranh -> true',
      '4) Semaphore(2) da cap het? con lai 0 | xin them duoc? false',
      '5) hai luong khoa cheo -> con ket? true',
      '6) cung thu tu khoa -> ca hai xong? true',
    ],
  },

  verify: {
    className: 'Khoa',
    source: `import java.util.concurrent.*;
import java.util.concurrent.locks.*;

public class Khoa {
    static final ReentrantLock lock = new ReentrantLock();
    static int dem = 0;

    static final Object k1 = new Object(), k2 = new Object();
    static final Object k3 = new Object(), k4 = new Object();

    public static void main(String[] args) throws Exception {
        Runnable cong = () -> {
            for (int i = 0; i < 100_000; i++) {
                lock.lock();
                try { dem++; } finally { lock.unlock(); }
            }
        };
        Thread a = new Thread(cong), b = new Thread(cong);
        a.start(); b.start(); a.join(); b.join();
        System.out.println("1) ReentrantLock -> dung? " + (dem == 200_000));

        lock.lock();
        Thread t = new Thread(() -> System.out.println("2) tryLock khi nguoi khac dang giu -> " + lock.tryLock()));
        t.start(); t.join();
        lock.unlock();

        System.out.println("3) tryLock 100ms khi ranh -> " + lock.tryLock(100, TimeUnit.MILLISECONDS));
        lock.unlock();

        Semaphore cho = new Semaphore(2);
        cho.acquire(); cho.acquire();
        System.out.println("4) Semaphore(2) da cap het? con lai " + cho.availablePermits()
                + " | xin them duoc? " + cho.tryAcquire());
        cho.release(); cho.release();

        Thread d1 = new Thread(() -> { synchronized (k1) { nghi(50); synchronized (k2) {} } });
        Thread d2 = new Thread(() -> { synchronized (k2) { nghi(50); synchronized (k1) {} } });
        d1.start(); d2.start();
        d1.join(500); d2.join(500);
        System.out.println("5) hai luong khoa cheo -> con ket? " + (d1.isAlive() && d2.isAlive()));

        Thread s1 = new Thread(() -> { synchronized (k3) { nghi(20); synchronized (k4) {} } });
        Thread s2 = new Thread(() -> { synchronized (k3) { nghi(20); synchronized (k4) {} } });
        s1.start(); s2.start();
        s1.join(2000); s2.join(2000);
        System.out.println("6) cung thu tu khoa -> ca hai xong? " + (!s1.isAlive() && !s2.isAlive()));

        System.exit(0);
    }

    static void nghi(int ms) { try { Thread.sleep(ms); } catch (InterruptedException ignored) {} }
}`,
  },
};
