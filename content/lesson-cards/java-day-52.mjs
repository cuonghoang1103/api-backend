/**
 * Thẻ bài học "100 Ngày Java" — Ngày 52: Bộ dọn rác (GC).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-52.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Log GC cần tham số `-Xlog:gc` mà script chạy `java` trần, nên chương
 * trình dùng `GarbageCollectorMXBean` — chính nguồn số liệu đứng sau log đó.
 * Output in SO SÁNH và NGƯỠNG (GC đã chạy thêm chưa, heap chia nhiều vùng
 * không) chứ không in con số đo được, vì chúng đổi mỗi lần chạy.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 52,
  total: 100,
  titleLead: 'Java Day 52:',
  titleAccent: 'Bộ dọn rác',
  subtitle: 'Vì sao ứng dụng bỗng khựng 2 giây rồi lại chạy 🗑️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. GIẢ THUYẾT THẾ HỆ 👶👴',
      code: `"Hau het doi tuong CHET RAT TRE"

Young Gen  don LIEN TUC, RAT nhanh (minor GC)
Old  Gen   ai song sot nhieu lan thi len day
           don HIEM, CHAM (major/full GC)`,
      notes: [
        { mark: 'ok', text: 'Nhờ giả thuyết này mà dọn rác rẻ: chỉ quét vùng trẻ, bỏ qua phần lớn heap' },
        { mark: 'dot', text: 'Chạy thật: tạo ~2GB rác ngắn hạn → GC đã chạy thêm? true' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. STOP-THE-WORLD 🛑',
      code: `// GC phai DUNG moi luong ung dung de dich chuyen doi tuong
// -> minor GC: vai mili giay, khong ai thay
// -> full GC tren heap lon: HANG GIAY — nguoi dung thay dung hinh`,
      notes: [
        { mark: 'no', text: 'Khựng 2 giây rồi chạy tiếp, CPU nhảy vọt = dấu hiệu full GC' },
        { mark: 'ok', text: '`getCollectionCount()` / `getCollectionTime()` đọc được ngay trong code' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BA BỘ DỌN RÁC HAY GẶP 🧹',
      code: `Parallel  thong luong cao nhat, dung lau nhat  (batch)
G1        MAC DINH tu Java 9, can bang            (web app)
ZGC       dung < 1ms du heap hang tram GB         (do tre thap)

java -XX:+UseZGC -Xmx4g ChuongTrinh`,
      notes: [{ mark: 'ok', text: 'Chưa đo thì đừng đổi — G1 mặc định hợp với hầu hết ứng dụng' }],
    },
    {
      tone: 'green',
      title: '4. ĐỌC SỐ LIỆU 📊',
      code: `-Xlog:gc                      # log moi lan don
GarbageCollectorMXBean        # doc ngay trong code
MemoryPoolMXBean              # heap chia nhieu vung -> true`,
      notes: [
        { mark: 'no', text: 'Full GC liên tục mà bộ nhớ không giảm = RÒ RỈ (**Ngày 51**), không phải GC yếu' },
        { mark: 'no', text: 'Đừng gọi `System.gc()` trong code thật — chỉ ép một lần dừng vô ích' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Rác ngắn hạn thì RẺ; thứ đắt là đối tượng sống dai và heap phình' },
        { mark: 'next', text: '**Ngày 53**: JUnit — viết test tự động cho code của mình' },
      ],
    },
  ],

  /* Output THẬT của `java DonRac` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) JVM co bo don rac? true',
      '2) tao ~2GB rac ngan han -> GC da chay them? true',
      '3) tong thoi gian GC do duoc >= 0ms? true',
      '4) giu lai 4 doi tuong song lau',
      '5) heap chia thanh nhieu vung? true',
      '6) heap dang dung > 0? true | ngoai heap > 0? true',
    ],
  },

  verify: {
    className: 'DonRac',
    source: `import java.lang.management.*;
import java.util.*;

public class DonRac {
    static List<byte[]> giaGia = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        List<GarbageCollectorMXBean> gc = ManagementFactory.getGarbageCollectorMXBeans();
        System.out.println("1) JVM co bo don rac? " + (!gc.isEmpty()));

        long lanTruoc = 0;
        for (GarbageCollectorMXBean g : gc) lanTruoc += g.getCollectionCount();

        for (int vong = 0; vong < 200; vong++) {
            List<byte[]> tam = new ArrayList<>();
            for (int i = 0; i < 200; i++) tam.add(new byte[50_000]);
            if (vong % 50 == 0) giaGia.add(new byte[100_000]);
        }

        long lanSau = 0, tongMs = 0;
        for (GarbageCollectorMXBean g : gc) { lanSau += g.getCollectionCount(); tongMs += g.getCollectionTime(); }

        System.out.println("2) tao ~2GB rac ngan han -> GC da chay them? " + (lanSau > lanTruoc));
        System.out.println("3) tong thoi gian GC do duoc >= 0ms? " + (tongMs >= 0));
        System.out.println("4) giu lai " + giaGia.size() + " doi tuong song lau");

        List<MemoryPoolMXBean> pool = ManagementFactory.getMemoryPoolMXBeans();
        long soVungHeap = pool.stream().filter(p -> p.getType() == MemoryType.HEAP).count();
        System.out.println("5) heap chia thanh nhieu vung? " + (soVungHeap > 1));

        MemoryMXBean mem = ManagementFactory.getMemoryMXBean();
        System.out.println("6) heap dang dung > 0? " + (mem.getHeapMemoryUsage().getUsed() > 0)
                + " | ngoai heap > 0? " + (mem.getNonHeapMemoryUsage().getUsed() > 0));
    }
}`,
  },
};
