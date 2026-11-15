public class TownJudge {
    // #region giai
    static int findJudge(int n, int[][] trust) {
        int[] score = new int[n + 1];
        for (int[] t : trust) { score[t[0]]--; score[t[1]]++; }
        for (int p = 1; p <= n; p++) if (score[p] == n - 1) return p;
        return -1;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(findJudge(2, new int[][]{{1, 2}}));
        System.out.println(findJudge(3, new int[][]{{1, 3}, {2, 3}}));
        System.out.println(findJudge(3, new int[][]{{1, 3}, {2, 3}, {3, 1}}));
        System.out.println(findJudge(1, new int[][]{}));
    }
}
