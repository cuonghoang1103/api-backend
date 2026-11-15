import java.util.*;

// LC 11 · Container With Most Water — brute O(n^2) vs two pointers O(n).
public class Container {
    // #region brute
    static int maxAreaBrute(int[] h) {
        int best = 0;
        for (int i = 0; i < h.length; i++)
            for (int j = i + 1; j < h.length; j++)
                best = Math.max(best, Math.min(h[i], h[j]) * (j - i));
        return best;
    }
    // #endregion

    // #region two
    static int maxArea(int[] h) {
        int l = 0, r = h.length - 1, best = 0;
        while (l < r) {
            int area = Math.min(h[l], h[r]) * (r - l);
            best = Math.max(best, area);
            if (h[l] < h[r]) l++;
            else r--;
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{1, 8, 6, 2, 5, 4, 8, 3, 7}, {1, 1}, {4, 3, 2, 1, 4}, {1, 2, 4, 3}};
        for (int[] h : tests)
            System.out.println("maxArea(" + Arrays.toString(h) + ") = " + maxArea(h) + "   brute = " + maxAreaBrute(h));
    }
}
