import java.util.*;

// LC 739 · Daily Temperatures — monotonic stack of indices.
public class DailyTemperatures {
    static int[] dailyBrute(int[] t) {
        int[] ans = new int[t.length];
        for (int i = 0; i < t.length; i++)
            for (int j = i + 1; j < t.length; j++)
                if (t[j] > t[i]) { ans[i] = j - i; break; }
        return ans;
    }

    // #region mono
    static int[] dailyTemperatures(int[] t) {
        int[] ans = new int[t.length];
        int[] st = new int[t.length];       // an int array as the stack: no boxing, fastest in Java
        int top = -1;                       // st[0..top] are the waiting indices
        for (int i = 0; i < t.length; i++) {
            while (top >= 0 && t[i] > t[st[top]]) {
                int j = st[top--];
                ans[j] = i - j;
            }
            st[++top] = i;
        }
        return ans;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] all = {{73, 74, 75, 71, 69, 72, 76, 73}, {30, 40, 50, 60}, {60, 50, 40}, {70}};
        for (int[] t : all) {
            System.out.println(Arrays.toString(t) + " -> " + Arrays.toString(dailyTemperatures(t))
                + "   brute = " + Arrays.toString(dailyBrute(t)));
        }
    }
}
