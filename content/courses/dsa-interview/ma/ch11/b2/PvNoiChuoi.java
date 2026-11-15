// @thoi-gian
// Bẫy Java: dựng chuỗi kết quả bằng String += trong vòng lặp (mỗi lần cộng CHÉP lại cả chuỗi ⇒ O(n^2))
// so với StringBuilder (O(n) khấu hao). Đo trên đúng việc cuối của LC 1249: ghép các ký tự được giữ lại.
public class PvNoiChuoi {
    // #region bay
    static String keepPlus(String s) {
        String out = "";
        for (int i = 0; i < s.length(); i++) out += s.charAt(i);   // a brand-new String every iteration
        return out;
    }

    static String keepBuilder(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < s.length(); i++) out.append(s.charAt(i));
        return out.toString();
    }
    // #endregion

    static double best(java.util.function.Supplier<String> f, int reps) {
        double b = Double.MAX_VALUE;
        for (int r = 0; r < reps; r++) {
            long t = System.nanoTime();
            f.get();
            b = Math.min(b, (System.nanoTime() - t) / 1e6);
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("java " + System.getProperty("java.version") + " " + System.getProperty("os.arch"));
        for (int n : new int[]{10_000, 50_000, 100_000, 200_000}) {
            String s = "(a)".repeat(n / 3 + 1).substring(0, n);
            double plus = best(() -> keepPlus(s), 3);
            double sb = best(() -> keepBuilder(s), 5);
            System.out.printf("n=%,d  String += : %,.1f ms   StringBuilder: %.2f ms%n", n, plus, sb);
        }
    }
}
