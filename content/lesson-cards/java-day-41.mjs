/**
 * Thẻ bài học "100 Ngày Java" — Ngày 41: Đa luồng. Mở Giai đoạn 6.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-41.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ RACE CONDITION VỐN NGẪU NHIÊN. Thẻ so khớp output CHÍNH XÁC từng dòng,
 * nên chương trình không in con số đếm được (nó đổi mỗi lần chạy) mà chạy
 * lại tối đa 5 lượt và in `co mat so? true` — chỉ cần MỘT lượt mất số là đã
 * chứng minh xong, và kết quả in ra thành tất định.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 41,
  total: 100,
  titleLead: 'Java Day 41:',
  titleAccent: 'Đa luồng',
  subtitle: 'Vì sao hai luồng cộng cùng một biến lại mất số 🧵',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT LUỒNG RIÊNG 🧵',
      code: `Thread t = new Thread(() -> System.out.println("chao"));  // Ngay 30
t.start();     // CHAY SONG SONG
t.join();      // doi t xong roi moi di tiep

// t.run() se chay TUAN TU tren luong hien tai — bay kinh dien`,
      notes: [
        { mark: 'no', text: 'Gọi `run()` thay `start()` là mất hẳn tính song song mà không báo lỗi' },
        { mark: 'ok', text: 'Quên `join()` là đọc kết quả khi luồng chưa xong' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. PHÉP CỘNG ĐƠN GIẢN NHẤT CŨNG HỎNG 💥',
      code: `static int dem;
// hai luong, moi luong cong 1.000.000 lan
// mong doi 2.000.000 -> co mat so? true`,
      notes: [
        { mark: 'dot', text: '`dem++` là BA thao tác: đọc → cộng → ghi. Hai luồng xen vào nhau giữa chừng' },
        { mark: 'no', text: 'Bug này KHÔNG tái hiện đều — chạy 10 lần có thể đúng 1 lần' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CÁCH SỬA 1: synchronized 🔒',
      code: `synchronized (khoa) { dem++; }   // mot luc chi MOT luong vao duoc
// -> dung? true`,
      notes: [
        { mark: 'ok', text: 'Đặt khoá quanh **cả cụm** đọc-sửa-ghi, không phải từng dòng lẻ' },
        { mark: 'no', text: 'Khoá quá rộng thì chương trình chạy như một luồng — mất hết lợi ích' },
      ],
    },
    {
      tone: 'green',
      title: '4. CÁCH SỬA 2: AtomicInteger ⚛️',
      code: `AtomicInteger dem = new AtomicInteger();
dem.incrementAndGet();          // mot thao tac KHONG THE cat doi
// -> dung? true`,
      notes: [
        { mark: 'ok', text: 'Nhanh hơn `synchronized` cho biến đếm — không phải chờ khoá' },
        { mark: 'dot', text: 'Còn `AtomicLong`, `ConcurrentHashMap`, `CopyOnWriteArrayList` cho cấu trúc khác' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Dữ liệu **dùng chung + có sửa** giữa các luồng ⇒ phải bảo vệ' },
        { mark: 'next', text: '**Ngày 42**: `ExecutorService` — đừng tự tay `new Thread` nữa' },
      ],
    },
  ],

  /* Output THẬT của `java DaLuong` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) luong chinh: main',
      '2) chay trong luong: luong-phu',
      '3) hai luong cong 2000000 lan -> co mat so? true',
      '4) synchronized -> dung? true',
      '5) AtomicInteger -> dung? true',
      '6) chua join, luong con song? true',
      '7) sau join, con song? false',
    ],
  },

  verify: {
    className: 'DaLuong',
    source: `import java.util.concurrent.atomic.AtomicInteger;

public class DaLuong {
    static int demHong;
    static int demKhoa;
    static final AtomicInteger demAtomic = new AtomicInteger();
    static final Object khoa = new Object();
    static final int LAN = 1_000_000;

    static int chayHong() throws InterruptedException {
        demHong = 0;
        Runnable r = () -> { for (int i = 0; i < LAN; i++) demHong++; };
        Thread a = new Thread(r), b = new Thread(r);
        a.start(); b.start(); a.join(); b.join();
        return demHong;
    }

    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> System.out.println("2) chay trong luong: " + Thread.currentThread().getName()));
        t.setName("luong-phu");
        System.out.println("1) luong chinh: " + Thread.currentThread().getName());
        t.start();
        t.join();

        boolean matSo = false;
        for (int lan = 0; lan < 5 && !matSo; lan++) matSo = chayHong() != 2 * LAN;
        System.out.println("3) hai luong cong " + (2 * LAN) + " lan -> co mat so? " + matSo);

        Runnable congKhoa = () -> { for (int i = 0; i < LAN; i++) synchronized (khoa) { demKhoa++; } };
        Thread c = new Thread(congKhoa), d = new Thread(congKhoa);
        c.start(); d.start(); c.join(); d.join();
        System.out.println("4) synchronized -> dung? " + (demKhoa == 2 * LAN));

        Runnable congAtomic = () -> { for (int i = 0; i < LAN; i++) demAtomic.incrementAndGet(); };
        Thread e = new Thread(congAtomic), f = new Thread(congAtomic);
        e.start(); f.start(); e.join(); f.join();
        System.out.println("5) AtomicInteger -> dung? " + (demAtomic.get() == 2 * LAN));

        Thread g = new Thread(() -> { try { Thread.sleep(50); } catch (InterruptedException ignored) {} });
        g.start();
        System.out.println("6) chua join, luong con song? " + g.isAlive());
        g.join();
        System.out.println("7) sau join, con song? " + g.isAlive());
    }
}`,
  },
};
