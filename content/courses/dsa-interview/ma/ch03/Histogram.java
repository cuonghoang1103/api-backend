import java.util.*;

public class Histogram {
    // #region giai
    static int largestRectangleArea(int[] h) {
        int[] st = new int[h.length + 1];
        int top = -1, best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i];
            while (top >= 0 && cur < h[st[top]]) {
                int height = h[st[top--]];
                int left = top >= 0 ? st[top] : -1;
                best = Math.max(best, height * (i - left - 1));
            }
            st[++top] = i;
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] all = {{2, 1, 5, 6, 2, 3}, {2, 4}, {6, 2, 5, 4, 5, 1, 6}, {1, 1, 1, 1}};
        for (int[] h : all) System.out.println(Arrays.toString(h) + " -> " + largestRectangleArea(h));
    }
}
