import java.time.LocalDate;
import java.util.*;

// Lịch ôn cách quãng 1 · 3 · 7 · 14 ngày cho một đề, ôn hỏng ⇒ về mốc 1 ngày. Cùng output với lich-on.ts.
public class PvLichOn {
    // #region lich
    static final int[] KHOANG = {1, 3, 7, 14};

    static List<String> schedule(String firstSolved, boolean[] results) {
        List<String> lines = new ArrayList<>();
        int step = 0;
        LocalDate day = LocalDate.parse(firstSolved);
        for (boolean ok : results) {
            day = day.plusDays(KHOANG[step]);
            lines.add(day + "  review after " + KHOANG[step] + "d: " + (ok ? "pass" : "FAIL -> back to 1d"));
            step = ok ? step + 1 : 0;
            if (step == KHOANG.length) { lines.add("graduated: move it to the monthly list"); break; }
        }
        if (step < KHOANG.length) lines.add("next review: " + day.plusDays(KHOANG[step]));
        return lines;
    }
    // #endregion

    public static void main(String[] args) {
        Object[][] deCuaToi = {
            {"LC 15 3Sum", "2026-11-21", new boolean[]{true, true, true, true}},
            {"LC 33 Search in Rotated Sorted Array", "2026-12-01", new boolean[]{true, false, true, true, true, true}},
            {"LC 146 LRU Cache", "2026-11-27", new boolean[]{true, true}},
        };
        for (Object[] d : deCuaToi) {
            System.out.println(d[0] + " (first solved " + d[1] + ")");
            for (String l : schedule((String) d[1], (boolean[]) d[2])) System.out.println("  " + l);
        }
    }
}
