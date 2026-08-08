/**
 * Thẻ bài học "100 Ngày Java" — Ngày 43: CompletableFuture.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-43.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Output giữ TẤT ĐỊNH bằng cách chỉ in
 * ở luồng chính sau khi đã `join()` — không để các việc nền tự in ra.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 43,
  total: 100,
  titleLead: 'Java Day 43:',
  titleAccent: 'CompletableFuture',
  subtitle: 'Nối việc bất đồng bộ thành dây chuyền, không ai ngồi đợi ai ⛓️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. GIAO VIỆC RỒI ĐI TIẾP ⛓️',
      code: `CompletableFuture<String> f =
    CompletableFuture.supplyAsync(() -> goiApi("An"));
// luong chinh KHONG bi chan o day
f.get();   // chi cho khi that su can ket qua`,
      notes: [
        { mark: 'ok', text: '`supplyAsync` khi cần kết quả · `runAsync` khi không' },
        { mark: 'dot', text: 'Mặc định chạy trên `ForkJoinPool.commonPool()`; truyền pool riêng nếu muốn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NỐI BƯỚC NHƯ STREAM 🔗',
      code: `supplyAsync(() -> goiApi("An"))
    .thenApply(String::toUpperCase)      // bien doi
    .thenApply(t -> t + " (da xu ly)")
    .join();                             // AN (da xu ly)`,
      notes: [
        { mark: 'ok', text: 'Cùng lối viết dây chuyền của **Ngày 31** — nhưng chạy nền' },
        { mark: 'dot', text: '`thenApply` biến đổi · `thenAccept` tiêu thụ · `thenCompose` nối hai việc bất đồng bộ' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CHẠY SONG SONG RỒI GỘP 🤝',
      code: `a.thenCombine(b, (x, y) -> x + " + " + y).join();
// "thong tin + don hang" — hai API chay CUNG LUC

CompletableFuture.allOf(f1, f2, f3).join();   // doi tat ca`,
      notes: [{ mark: 'ok', text: 'Hai lời gọi API độc lập thì tổng thời gian = cái CHẬM NHẤT, không phải tổng' }],
    },
    {
      tone: 'green',
      title: '4. LỖI KHÔNG LÀM GÃY DÂY CHUYỀN 🧯',
      code: `.supplyAsync(() -> { throw new IllegalStateException("API sap"); })
.thenApply(x -> "khong bao gio toi day")
.exceptionally(e -> "gia tri du phong")     // -> gia tri du phong
.join();`,
      notes: [
        { mark: 'ok', text: 'Lỗi nhảy qua mọi bước giữa, rơi thẳng vào `exceptionally`' },
        { mark: 'no', text: 'Không xử lý thì `join()` ném `CompletionException`, gốc lấy bằng `getCause()`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nhiều bước phụ thuộc nhau + gọi mạng ⇒ `CompletableFuture`, không `Future.get()`' },
        { mark: 'next', text: '**Ngày 44**: luồng ảo (Java 21) — một triệu luồng cũng không sao' },
      ],
    },
  ],

  /* Output THẬT của `java DayChuyen` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) da giao viec, luong chinh van chay tiep',
      '2) ket qua -> An',
      '3) day chuyen -> AN (da xu ly)',
      '4) gop -> thong tin + don hang',
      '5) allOf -> api-1 api-2 api-3',
      '6) exceptionally -> gia tri du phong',
      '7) khong bat -> IllegalStateException',
    ],
  },

  verify: {
    className: 'DayChuyen',
    source: `import java.util.concurrent.*;
import java.util.*;

public class DayChuyen {
    static String goiApi(String ten) {
        try { Thread.sleep(20); } catch (InterruptedException ignored) {}
        return ten;
    }

    public static void main(String[] args) throws Exception {
        CompletableFuture<String> f = CompletableFuture.supplyAsync(() -> goiApi("An"));
        System.out.println("1) da giao viec, luong chinh van chay tiep");
        System.out.println("2) ket qua -> " + f.get());

        String kq = CompletableFuture
                .supplyAsync(() -> goiApi("An"))
                .thenApply(String::toUpperCase)
                .thenApply(t -> t + " (da xu ly)")
                .join();
        System.out.println("3) day chuyen -> " + kq);

        CompletableFuture<String> a = CompletableFuture.supplyAsync(() -> goiApi("thong tin"));
        CompletableFuture<String> b = CompletableFuture.supplyAsync(() -> goiApi("don hang"));
        System.out.println("4) gop -> " + a.thenCombine(b, (x, y) -> x + " + " + y).join());

        List<CompletableFuture<String>> ds = new ArrayList<>();
        for (int i = 1; i <= 3; i++) { int n = i; ds.add(CompletableFuture.supplyAsync(() -> goiApi("api-" + n))); }
        CompletableFuture.allOf(ds.toArray(new CompletableFuture[0])).join();
        StringBuilder sb = new StringBuilder();
        for (CompletableFuture<String> c : ds) sb.append(c.join()).append(" ");
        System.out.println("5) allOf -> " + sb.toString().trim());

        String an = CompletableFuture
                .supplyAsync(() -> { throw new IllegalStateException("API sap"); })
                .thenApply(x -> "khong bao gio toi day")
                .exceptionally(e -> "gia tri du phong")
                .join();
        System.out.println("6) exceptionally -> " + an);

        try {
            CompletableFuture.supplyAsync(() -> { throw new IllegalStateException("vo"); }).join();
        } catch (CompletionException e) {
            System.out.println("7) khong bat -> " + e.getCause().getClass().getSimpleName());
        }
    }
}`,
  },
};
