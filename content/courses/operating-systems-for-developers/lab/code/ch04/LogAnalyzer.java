// LogAnalyzer.java — dự án cuối chương: phân tích access log SONG SONG (bản Java).
//   java LogAnalyzer.java FILE W [REPS]     REPS > 1: làm lại cả việc REPS lần trong CÙNG một JVM (lần 1 lạnh, JIT chưa dịch;
//                                           các lần sau ấm) — in thời gian từng lần
// Chia file thành W khúc byte, căn theo ranh giới dòng (MAP: mỗi luồng một khúc, đọc theo khối 4 MiB, bộ nhớ không đổi
// dù file lớn cỡ nào) → mỗi luồng ra một Partial riêng (KHÔNG khoá, KHÔNG chia sẻ) → luồng chính GỘP (REDUCE).
// In: số dòng, đếm theo status, top 5 đường dẫn theo số request kèm p95 độ trễ và tổng MB.
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

public class LogAnalyzer {
    static final int MAXMS = 10_000;                       // histogram độ trễ 0..9 999 ms, từng ms một

    static class Stat { long count, bytes; int[] hist = new int[MAXMS]; }
    static class Partial {
        long lines; Map<Integer, Long> status = new HashMap<>(); Map<String, Stat> paths = new HashMap<>();
        void add(String l) {
            int q1 = l.indexOf('"'), sp1 = l.indexOf(' ', q1), sp2 = l.indexOf(' ', sp1 + 1), q2 = l.indexOf('"', sp2);
            String path = l.substring(sp1 + 1, sp2);
            int a = q2 + 2, b = l.indexOf(' ', a), c = l.indexOf(' ', b + 1);
            int st = Integer.parseInt(l, a, b, 10);
            long bytes = Long.parseLong(l, b + 1, c, 10);
            int ms = (int) Math.min(MAXMS - 1, Math.round(Double.parseDouble(l.substring(c + 1)) * 1000));
            lines++;
            status.merge(st, 1L, Long::sum);
            Stat s = paths.computeIfAbsent(path, k -> new Stat());
            s.count++; s.bytes += bytes; s.hist[ms]++;
        }
        void merge(Partial o) {                                 // REDUCE
            lines += o.lines;
            o.status.forEach((k, v) -> status.merge(k, v, Long::sum));
            o.paths.forEach((k, v) -> {
                Stat s = paths.computeIfAbsent(k, x -> new Stat());
                s.count += v.count; s.bytes += v.bytes;
                for (int i = 0; i < MAXMS; i++) s.hist[i] += v.hist[i];
            });
        }
    }

    static Partial scan(String file, long start, long end) throws IOException {   // MAP: các dòng BẮT ĐẦU trong [start, end)
        Partial p = new Partial();
        try (RandomAccessFile f = new RandomAccessFile(file, "r")) {
            long pos = start;
            if (start > 0) {                                     // bỏ phần dòng dở dang: nó thuộc khúc trước
                f.seek(start - 1);
                while (f.read() != '\n') pos++;
            }
            byte[] buf = new byte[4 << 20];
            String carry = "";
            f.seek(pos);
            while (pos < end || !carry.isEmpty()) {
                int n = f.read(buf);
                if (n <= 0) break;
                String chunk = carry + new String(buf, 0, n, StandardCharsets.ISO_8859_1);
                int from = 0, nl;
                while ((nl = chunk.indexOf('\n', from)) >= 0) {
                    if (pos >= end) return p;                    // dòng này bắt đầu ở khúc sau
                    p.add(chunk.substring(from, nl));
                    pos += nl - from + 1;
                    from = nl + 1;
                }
                carry = chunk.substring(from);
            }
        }
        return p;
    }

    static int p95(int[] h, long n) {
        long need = (long) Math.ceil(n * 0.95), seen = 0;
        for (int i = 0; i < h.length; i++) if ((seen += h[i]) >= need) return i;
        return h.length - 1;
    }

    public static void main(String[] a) throws Exception {
        String file = a[0];
        int w = Integer.parseInt(a[1]), reps = a.length > 2 ? Integer.parseInt(a[2]) : 1;
        Partial all = null;
        double ms = 0;
        for (int rep = 1; rep <= reps; rep++) {
            long t0 = System.nanoTime(), size = new File(file).length();
            ExecutorService ex = Executors.newFixedThreadPool(w);
            List<Future<Partial>> parts = new ArrayList<>();
            for (int i = 0; i < w; i++) {
                long s = size * i / w, e = size * (i + 1) / w;
                parts.add(ex.submit(() -> scan(file, s, e)));
            }
            all = new Partial();
            for (Future<Partial> f : parts) all.merge(f.get());     // REDUCE ở luồng chính
            ex.shutdown();
            ms = (System.nanoTime() - t0) / 1e6;
            if (reps > 1 && rep < reps) System.out.printf("java  W=%d  run %d of %d  %6.0f ms%n", w, rep, reps, ms);
        }
        System.out.printf("java  W=%d  lines=%,d  status %s%n", w, all.lines, new TreeMap<>(all.status));
        all.paths.entrySet().stream().sorted((x, y) -> Long.compare(y.getValue().count, x.getValue().count)).limit(5).forEach(e ->
            System.out.printf("  %-26s %,9d req  p95 %5d ms  %7.1f MB%n", e.getKey(), e.getValue().count, p95(e.getValue().hist, e.getValue().count), e.getValue().bytes / 1e6));
        if (reps > 1) System.out.printf("java  W=%d  run %d of %d  %6.0f ms%n", w, reps, reps, ms);
        else System.out.printf("java  W=%d  %6.0f ms%n", w, ms);
    }
}
