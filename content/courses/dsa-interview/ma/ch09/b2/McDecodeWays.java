// LC 91 Decode Ways.
public class McDecodeWays {
    // #region decode
    static int numDecodings(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];                   // dp[i] = ways to decode the first i characters
        dp[0] = 1;                                   // base: empty prefix
        for (int i = 1; i <= n; i++) {
            int one = s.charAt(i - 1) - '0';
            if (one != 0) dp[i] += dp[i - 1];        // '0' alone is NOT a letter
            if (i >= 2) {
                int two = (s.charAt(i - 2) - '0') * 10 + one;
                if (two >= 10 && two <= 26) dp[i] += dp[i - 2];   // "06" is not 6
            }
        }
        return dp[n];
    }
    // #endregion

    static int numDecodingsWrong(String s) {
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {
            dp[i] += dp[i - 1];
            if (i >= 2 && Integer.parseInt(s.substring(i - 2, i)) <= 26) dp[i] += dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        for (String s : new String[]{"12", "226", "06", "10", "2101", "11106", "27", "100", "1111111111"}) {
            System.out.println("\"" + s + "\": right = " + numDecodings(s) + "   wrong = " + numDecodingsWrong(s));
        }
    }
}
