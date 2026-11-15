// LC 1079 · Letter Tile Possibilities — count every non-empty sequence; choose by LETTER, not by tile.
public class L4Tiles {
    // #region giai
    static int numTilePossibilities(String tiles) {
        int[] cnt = new int[26];
        for (char ch : tiles.toCharArray()) cnt[ch - 'A']++;
        return bt(cnt);
    }

    static int bt(int[] cnt) {
        int total = 0;
        for (int c = 0; c < 26; c++) {
            if (cnt[c] == 0) continue;
            cnt[c]--;
            total += 1 + bt(cnt);
            cnt[c]++;
        }
        return total;
    }
    // #endregion

    public static void main(String[] args) {
        for (String t : new String[]{"AAB", "AAABBC", "V", "ABCDEFG"}) System.out.println("\"" + t + "\" -> " + numTilePossibilities(t));
    }
}
