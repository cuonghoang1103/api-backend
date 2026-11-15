import java.util.*;

// LC 202 · Happy Number — Floyd on the implicit list x -> sum of squares of digits.
public class Happy {
    // #region happy
    static int next(int x) {
        int s = 0;
        while (x > 0) { int d = x % 10; s += d * d; x /= 10; }
        return s;
    }
    static boolean isHappy(int n) {
        int slow = n, fast = next(n);
        while (fast != 1 && slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }
    // #endregion

    static List<Integer> chain(int n) {
        List<Integer> seen = new ArrayList<>();
        while (!seen.contains(n)) { seen.add(n); n = next(n); }
        seen.add(n);
        return seen;
    }
    public static void main(String[] args) {
        for (int n : new int[]{19, 2, 7, 1, 1111111}) {
            StringBuilder sb = new StringBuilder();
            for (int x : chain(n)) { if (sb.length() > 0) sb.append(" -> "); sb.append(x); }
            System.out.println("isHappy(" + n + ") = " + isHappy(n) + "   chain: " + sb);
        }
    }
}
