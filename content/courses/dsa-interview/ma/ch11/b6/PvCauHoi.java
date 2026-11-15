import java.util.*;

// Nháp Java cho bài thi cuối khoá 11.6 (output thật được trích trong câu hỏi).
public class PvCauHoi {
    public static void main(String[] args) {
        // Q: midpoint overflow
        int lo = 2_000_000_000, hi = 2_100_000_000;
        System.out.println("(lo+hi)/2 = " + (lo + hi) / 2 + "   lo+(hi-lo)/2 = " + (lo + (hi - lo) / 2) + "   (lo+hi)>>>1 = " + ((lo + hi) >>> 1));

        // Q: comparator by subtraction
        Integer[] a = {2_000_000_000, -2_000_000_000, 0};
        Integer[] b = a.clone();
        Arrays.sort(a, (x, y) -> x - y);
        Arrays.sort(b, Integer::compare);
        System.out.println("sort (x,y)->x-y : " + Arrays.toString(a) + "   Integer::compare : " + Arrays.toString(b));

        // Q: int overflow of a total
        int jobs = 50_000, pay = 1_000_000_000;
        System.out.println("int total = " + (jobs * pay) + "   long total = " + ((long) jobs * pay));

        // Q: string + number
        System.out.println("\"id\" + 1 + 2 = " + ("id" + 1 + 2) + "   1 + 2 + \"id\" = " + (1 + 2 + "id"));

        // Q: Integer cache
        Integer p = 127, q = 127, r = 128, s = 128;
        System.out.println("127 == 127 : " + (p == q) + "   128 == 128 : " + (r == s));
    }
}
