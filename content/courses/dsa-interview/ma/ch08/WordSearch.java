import java.util.*;

// LC 79 · Word Search — DFS on a grid; "visited" is marked IN the board and restored on the way back.
public class WordSearch {
    // #region exist
    static boolean exist(char[][] board, String word) {
        int[] have = new int[128], need = new int[128];
        for (char[] row : board) for (char ch : row) have[ch]++;
        for (char ch : word.toCharArray()) need[ch]++;
        for (int ch = 0; ch < 128; ch++) if (need[ch] > have[ch]) return false;   // not enough letters: no search
        char[] w = word.toCharArray();
        if (have[w[0]] > have[w[w.length - 1]]) {                                 // start from the rarer end
            for (int i = 0, j = w.length - 1; i < j; i++, j--) { char t = w[i]; w[i] = w[j]; w[j] = t; }
        }
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, w, r, c, 0)) return true;
        return false;
    }

    static boolean dfs(char[][] b, char[] w, int r, int c, int k) {
        if (k == w.length) return true;
        if (r < 0 || c < 0 || r == b.length || c == b[0].length || b[r][c] != w[k]) return false;
        char saved = b[r][c];
        b[r][c] = '#';                                                            // mark
        boolean ok = dfs(b, w, r + 1, c, k + 1) || dfs(b, w, r - 1, c, k + 1)
                  || dfs(b, w, r, c + 1, k + 1) || dfs(b, w, r, c - 1, k + 1);
        b[r][c] = saved;                                                          // restore
        return ok;
    }
    // #endregion

    static char[][] grid() { return new char[][]{"ABCE".toCharArray(), "SFCS".toCharArray(), "ADEE".toCharArray()}; }

    public static void main(String[] args) {
        for (String w : new String[]{"ABCCED", "SEE", "ABCB", "ASADFBCCEESE", "Z"}) {
            char[][] b = grid();
            System.out.println("exist(\"" + w + "\") = " + exist(b, w) + "   board restored: " + Arrays.deepEquals(b, grid()));
        }
    }
}
