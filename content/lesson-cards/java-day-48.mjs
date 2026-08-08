/**
 * Thẻ bài học "100 Ngày Java" — Ngày 48: parallelStream.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-48.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Hai chỗ phải làm TẤT ĐỊNH: phép đo in NGƯỠNG ("nhanh hơn? true") chứ
 * không in số mili-giây, và phép thử race condition chạy tối đa 5 lượt rồi
 * in "có mất số? true" — một lượt sai là đủ chứng minh (giống thẻ Ngày 41).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 48,
  total: 100,
  titleLead: 'Java Day 48:',
  titleAccent: 'parallelStream',
  subtitle: 'Song song hoá bằng một chữ — và ba cái bẫy đi kèm ⚡',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỘT CHỮ, DÙNG HẾT SỐ NHÂN ⚡',
      code: `so.stream()          .mapToLong(...).sum();
so.parallelStream()  .mapToLong(...).sum();
// cung ket qua? true | song song nhanh hon? true (viec NANG CPU)`,
      notes: [
        { mark: 'ok', text: 'Bên dưới là `ForkJoinPool.commonPool()`, tự chia việc theo số nhân' },
        { mark: 'dot', text: 'Không có luồng nào do bạn tạo, không có khoá nào do bạn viết' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BẪY 1: BIẾN CHUNG TRONG forEach 💥',
      code: `int[] dem = {0};
so.parallelStream().forEach(x -> dem[0]++);   // -> co mat so? true

AtomicInteger d = new AtomicInteger();
so.parallelStream().forEach(x -> d.incrementAndGet());   // -> dung`,
      notes: [{ mark: 'no', text: 'Đúng race condition của **Ngày 41**, lần này nấp sau một chữ `parallel`' }],
    },
    {
      tone: 'pink',
      title: '3. BẪY 2: MẤT THỨ TỰ 🔀',
      code: `parallelStream().forEach(...)         // thu tu NGAU NHIEN
parallelStream().forEachOrdered(...) // giu thu tu -> 12345678
parallelStream().collect(toList())   // van dung thu tu`,
      notes: [{ mark: 'dot', text: '`forEachOrdered` đúng thứ tự nhưng chậm hơn — phải chờ nhau' }],
    },
    {
      tone: 'green',
      title: '4. BẪY 3: KHI NÀO CHẬM HƠN 🐢',
      code: `// ✓ nhanh hon: viec NANG CPU + du lieu LON + ArrayList
// ✗ cham hon: danh sach nho, viec nhe, LinkedList,
//             hoac ben trong co I/O (goi API, doc file)`,
      notes: [
        { mark: 'no', text: 'Chia việc + gộp kết quả cũng tốn — dữ liệu nhỏ thì lỗ vốn' },
        { mark: 'no', text: 'Có I/O thì dùng luồng ảo (**Ngày 44**), đừng dùng `parallelStream`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Chỉ đổi sang `parallelStream` khi đã ĐO và thấy nhanh hơn thật' },
        { mark: 'next', text: '**Ngày 49**: mẫu thiết kế đa luồng thường gặp trong dự án' },
      ],
    },
  ],

  /* Output THẬT của `java SongSong` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) cung ket qua? true',
      '2) song song nhanh hon (viec nang CPU)? true',
      '3) BAY: dem bang bien chung -> co mat so? true',
      '4) SUA: AtomicInteger -> dung? true',
      '5) forEachOrdered giu thu tu -> 12345678',
      '6) reduce song song -> 36 (dung vi cong co tinh ket hop)',
      '7) collect song song -> [2, 4, 6, 8, 10]',
    ],
  },

  verify: {
    className: 'SongSong',
    source: `import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.*;

public class SongSong {
    public static void main(String[] args) {
        List<Integer> so = IntStream.rangeClosed(1, 2_000_000).boxed().collect(Collectors.toList());

        long t1 = System.nanoTime();
        long tuanTu = so.stream().mapToLong(SongSong::nang).sum();
        long msTuanTu = (System.nanoTime() - t1) / 1_000_000;

        long t2 = System.nanoTime();
        long ss = so.parallelStream().mapToLong(SongSong::nang).sum();
        long msSongSong = (System.nanoTime() - t2) / 1_000_000;

        System.out.println("1) cung ket qua? " + (tuanTu == ss));
        System.out.println("2) song song nhanh hon (viec nang CPU)? " + (msSongSong < msTuanTu));

        boolean matSo = false;
        for (int lan = 0; lan < 5 && !matSo; lan++) {
            int[] demHong = {0};
            so.parallelStream().limit(100_000).forEach(x -> demHong[0]++);
            matSo = demHong[0] != 100_000;
        }
        System.out.println("3) BAY: dem bang bien chung -> co mat so? " + matSo);

        AtomicInteger demDung = new AtomicInteger();
        so.parallelStream().limit(100_000).forEach(x -> demDung.incrementAndGet());
        System.out.println("4) SUA: AtomicInteger -> dung? " + (demDung.get() == 100_000));

        List<Integer> nho = IntStream.rangeClosed(1, 8).boxed().collect(Collectors.toList());
        StringBuilder sb = new StringBuilder();
        nho.parallelStream().forEachOrdered(x -> sb.append(x));
        System.out.println("5) forEachOrdered giu thu tu -> " + sb);

        int tong = nho.parallelStream().reduce(0, Integer::sum);
        System.out.println("6) reduce song song -> " + tong + " (dung vi cong co tinh ket hop)");

        List<Integer> chan = so.parallelStream().limit(10).filter(x -> x % 2 == 0).collect(Collectors.toList());
        System.out.println("7) collect song song -> " + chan);
    }

    static long nang(int x) {
        long s = 0;
        for (int i = 0; i < 50; i++) s += (x * 31L + i) % 7;
        return s;
    }
}`,
  },
};
