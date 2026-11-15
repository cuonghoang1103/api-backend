// LC 37 · Sudoku Solver — bitmasks for rows / columns / boxes, and the "most constrained cell first" pruning (MRV).
public class Sudoku {
    static int[] row, col, box, empty;
    static int nEmpty, nodes;
    static boolean mrv;
    static final int ALL = 0b1111111110;

    // #region solve
    static int solveSudoku(char[][] board, boolean useMrv) {
        row = new int[9]; col = new int[9]; box = new int[9]; empty = new int[81]; nEmpty = 0; nodes = 0; mrv = useMrv;
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') { empty[nEmpty++] = r * 9 + c; continue; }
                int bit = 1 << (board[r][c] - '0');
                row[r] |= bit; col[c] |= bit; box[(r / 3) * 3 + c / 3] |= bit;
            }
        bt(board, 0);
        return nodes;
    }

    static boolean bt(char[][] board, int k) {
        nodes++;
        if (k == nEmpty) return true;
        if (mrv) {
            int best = k, bestCnt = 10;
            for (int j = k; j < nEmpty; j++) {
                int r = empty[j] / 9, c = empty[j] % 9;
                int cnt = Integer.bitCount(ALL & ~(row[r] | col[c] | box[(r / 3) * 3 + c / 3]));
                if (cnt < bestCnt) { bestCnt = cnt; best = j; if (cnt <= 1) break; }
            }
            int t = empty[k]; empty[k] = empty[best]; empty[best] = t;
        }
        int r = empty[k] / 9, c = empty[k] % 9, b = (r / 3) * 3 + c / 3;
        for (int d = 1; d <= 9; d++) {
            int bit = 1 << d;
            if (((row[r] | col[c] | box[b]) & bit) != 0) continue;
            row[r] |= bit; col[c] |= bit; box[b] |= bit; board[r][c] = (char) ('0' + d);
            if (bt(board, k + 1)) return true;
            row[r] &= ~bit; col[c] &= ~bit; box[b] &= ~bit; board[r][c] = '.';
        }
        return false;
    }
    // #endregion

    static char[][] make(String p) {
        char[][] g = new char[9][];
        for (int r = 0; r < 9; r++) g[r] = p.substring(r * 9, r * 9 + 9).toCharArray();
        return g;
    }

    public static void main(String[] args) {
        String[][] puzzles = {
            {"LeetCode example", "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"},
            {"hard (Inkala 2012)", "8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4.."},
        };
        for (String[] pz : puzzles) {
            char[][] a = make(pz[1]), b = make(pz[1]);
            int plain = solveSudoku(a, false);
            int smart = solveSudoku(b, true);
            boolean same = java.util.Arrays.deepEquals(a, b);
            System.out.println(pz[0] + ": " + pz[1].chars().filter(ch -> ch == '.').count() + " empty cells | nodes plain = " + plain
                + " | nodes MRV = " + smart + " | same answer: " + same);
            if (pz[0].startsWith("hard")) for (char[] rw : b) System.out.println("  " + new String(rw));
        }
    }
}
