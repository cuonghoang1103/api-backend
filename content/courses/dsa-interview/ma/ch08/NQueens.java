import java.util.*;

// LC 51 / 52 · N-Queens — one queen per row; three boolean arrays answer "is this square attacked?" in O(1).
public class NQueens {
    // #region queens
    static List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        bt(0, n, new int[n], new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1], res);
        return res;
    }

    // diag index r - c + (n - 1) is in 0..2n-2; anti index r + c is in 0..2n-2
    static void bt(int r, int n, int[] queenCol, boolean[] cols, boolean[] diag, boolean[] anti, List<List<String>> res) {
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int c : queenCol) board.add(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
            res.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            int d = r - c + n - 1, a = r + c;
            if (cols[c] || diag[d] || anti[a]) continue;            // prune
            cols[c] = diag[d] = anti[a] = true; queenCol[r] = c;   // choose
            bt(r + 1, n, queenCol, cols, diag, anti, res);
            cols[c] = diag[d] = anti[a] = false;                   // unchoose (queenCol[r] is overwritten next time)
        }
    }
    // #endregion

    public static void main(String[] args) {
        List<List<String>> four = solveNQueens(4);
        System.out.println("n = 4: " + four.size() + " solutions");
        for (List<String> b : four) System.out.println("  " + String.join(" ", b));
        List<Integer> counts = new ArrayList<>();
        for (int n = 1; n <= 9; n++) counts.add(solveNQueens(n).size());
        System.out.println("solutions for n = 1..9: " + counts);
    }
}
