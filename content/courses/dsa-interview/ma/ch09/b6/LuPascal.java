import java.util.*;

// LC 118 Pascal's Triangle — the first 2D table: every inner cell = the two cells above it.
public class LuPascal {
    // #region giai
    static List<List<Integer>> generate(int numRows) {
        List<List<Integer>> rows = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>();
            for (int c = 0; c <= r; c++) {
                if (c == 0 || c == r) row.add(1);                                   // base case: both ends
                else row.add(rows.get(r - 1).get(c - 1) + rows.get(r - 1).get(c));  // up-left + up
            }
            rows.add(row);
        }
        return rows;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("generate(5) = " + generate(5));
        System.out.println("generate(1) = " + generate(1));
        List<List<Integer>> big = generate(30);
        System.out.println("row 29 (the 30th row), middle cell = " + big.get(29).get(14) + "   biggest number LeetCode can ask for");
        int bad = 0, cells = 0;
        for (int r = 0; r < 30; r++) {
            long comb = 1;
            for (int c = 0; c <= r; c++) {
                cells++;
                if (big.get(r).get(c) != comb) bad++;
                comb = comb * (r - c) / (c + 1);
            }
        }
        System.out.println("self-test vs C(r, c): " + cells + " cells, " + bad + " mismatches");
    }
}
