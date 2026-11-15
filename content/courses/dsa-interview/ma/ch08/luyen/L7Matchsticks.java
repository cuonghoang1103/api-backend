import java.util.*;

// LC 473 · Matchsticks to Square — put each stick on one of 4 sides; three prunings make it fast.
public class L7Matchsticks {
    // #region giai
    static boolean makesquare(int[] sticks) {
        int total = 0;
        for (int s : sticks) total += s;
        if (sticks.length < 4 || total % 4 != 0) return false;
        int side = total / 4;
        Integer[] a = Arrays.stream(sticks).boxed().toArray(Integer[]::new);
        Arrays.sort(a, Collections.reverseOrder());
        if (a[0] > side) return false;
        return bt(a, 0, new int[4], side);
    }

    static boolean bt(Integer[] a, int i, int[] sides, int side) {
        if (i == a.length) return true;
        for (int k = 0; k < 4; k++) {
            if (sides[k] + a[i] > side) continue;
            if (k > 0 && sides[k] == sides[k - 1]) continue;
            sides[k] += a[i];
            if (bt(a, i + 1, sides, side)) return true;
            sides[k] -= a[i];
            if (sides[k] == 0) break;
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{1, 1, 2, 2, 2}, {3, 3, 3, 3, 4}, {5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3}, {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 102}};
        for (int[] s : tests) System.out.println(Arrays.toString(s) + " -> " + makesquare(s));
    }
}
