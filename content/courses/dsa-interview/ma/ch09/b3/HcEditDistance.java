import java.util.*;

// LC 72 Edit Distance: table, the list of edits (follow-up), two rows.
public class HcEditDistance {
    // #region bang
    static int minDistance(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
        return dp[n][m];
    }
    // #endregion

    // #region cac-phep
    static List<String> editScript(String a, String b) {
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1) ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
        LinkedList<String> ops = new LinkedList<>();
        int i = n, j = m;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && a.charAt(i - 1) == b.charAt(j - 1)) { i--; j--; }
            else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) { ops.addFirst("replace " + a.charAt(i - 1) + "->" + b.charAt(j - 1) + " at " + (i - 1)); i--; j--; }
            else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) { ops.addFirst("delete " + a.charAt(i - 1) + " at " + (i - 1)); i--; }
            else { ops.addFirst("insert " + b.charAt(j - 1) + " at " + i); j--; }
        }
        return ops;
    }
    // #endregion

    // #region hai-hang
    static int minDistanceTwoRows(String a, String b) {
        int[] prev = new int[b.length() + 1], cur = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) prev[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            cur[0] = i;
            for (int j = 1; j <= b.length(); j++)
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1) ? prev[j - 1]
                    : 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[b.length()];
    }
    // #endregion

    static String q(List<String> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int k = 0; k < l.size(); k++) sb.append(k > 0 ? "," : "").append('"').append(l.get(k)).append('"');
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        String[][] cases = {{"horse", "ros"}, {"intention", "execution"}, {"", "abc"}, {"kitten", "sitting"}, {"nha", "nhaf"}, {"Bgu", "Bug"}};
        for (String[] c : cases)
            System.out.println("minDistance(\"" + c[0] + "\", \"" + c[1] + "\") = " + minDistance(c[0], c[1])
                + "  two-rows = " + minDistanceTwoRows(c[0], c[1]) + "  edits = " + q(editScript(c[0], c[1])));
    }
}
