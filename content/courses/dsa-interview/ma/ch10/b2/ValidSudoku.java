import java.util.*;

public class ValidSudoku {
    // #region sach
    static final int SIZE = 9;
    static final int BOX = 3;
    static final char EMPTY = '.';

    static boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                char digit = board[row][col];
                if (digit == EMPTY) continue;
                // Set.add returns false when the key was already there: the first clash decides
                if (!seen.add("r" + row + ":" + digit)
                        || !seen.add("c" + col + ":" + digit)
                        || !seen.add("b" + boxIndex(row, col) + ":" + digit)) return false;
            }
        }
        return true;
    }

    static int boxIndex(int row, int col) {
        return (row / BOX) * BOX + col / BOX;
    }
    // #endregion

    public static void main(String[] args) {
        String[] rows = {"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1",
                         "7...2...6", ".6....28.", "...419..5", "....8..79"};
        char[][] ok = new char[9][];
        for (int i = 0; i < 9; i++) ok[i] = rows[i].toCharArray();
        char[][] sameBox = copy(ok);
        sameBox[0][2] = '9';
        char[][] sameCol = copy(ok);
        sameCol[8][0] = '5';
        System.out.println("valid board  -> " + isValidSudoku(ok));
        System.out.println("clash in box -> " + isValidSudoku(sameBox));
        System.out.println("clash in col -> " + isValidSudoku(sameCol));
        System.out.println("boxIndex(4, 7) = " + boxIndex(4, 7));
    }

    static char[][] copy(char[][] b) {
        char[][] c = new char[b.length][];
        for (int i = 0; i < b.length; i++) c[i] = b[i].clone();
        return c;
    }
}
