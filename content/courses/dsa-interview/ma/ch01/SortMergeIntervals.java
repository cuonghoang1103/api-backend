import java.util.*;

// LC 56 · Merge Intervals.
public class SortMergeIntervals {
    // #region merge
    static int[][] merge(int[][] intervals) {
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] cur : sorted) {
            int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
            if (last != null && cur[0] <= last[1]) {
                last[1] = Math.max(last[1], cur[1]);
            } else {
                out.add(new int[]{cur[0], cur[1]});
            }
        }
        return out.toArray(new int[0][]);
    }
    // #endregion

    public static void main(String[] args) {
        int[][][] cases = {
            {{1, 3}, {8, 10}, {2, 6}, {15, 18}, {9, 12}, {10, 11}},
            {{1, 4}, {4, 5}},
            {{1, 10}, {2, 3}, {4, 5}},
            {{5, 7}},
        };
        for (int[][] c : cases) {
            System.out.println("merge(" + Arrays.deepToString(c) + ") = " + Arrays.deepToString(merge(c)));
        }
    }
}
