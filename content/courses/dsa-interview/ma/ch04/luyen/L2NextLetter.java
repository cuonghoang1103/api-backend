import java.util.*;
import java.util.function.IntPredicate;

// LC 744 · Find Smallest Letter Greater Than Target.
public class L2NextLetter {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static char nextGreatestLetter(char[] letters, char target) {
        int i = firstTrue(0, letters.length, k -> letters[k] > target);
        return letters[i % letters.length];
    }
    // #endregion
    public static void main(String[] args) {
        char[] L = {'b', 'e', 'e', 'h', 'q'};
        System.out.println("letters = [\"b\",\"e\",\"e\",\"h\",\"q\"]");
        for (char t : new char[]{'a', 'b', 'd', 'e', 'p', 'q', 'z'}) System.out.println("target '" + t + "' -> '" + nextGreatestLetter(L, t) + "'");
    }
}
