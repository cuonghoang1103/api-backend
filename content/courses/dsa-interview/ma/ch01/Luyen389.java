// LC 389 · Find the Difference — XOR of all characters.
public class Luyen389 {
    // #region xor
    static char findTheDifference(String s, String t) {
        int x = 0;
        for (int i = 0; i < s.length(); i++) x ^= s.charAt(i);
        for (int i = 0; i < t.length(); i++) x ^= t.charAt(i);
        return (char) x;
    }
    // #endregion

    // #region dem
    static char findTheDifferenceCount(String s, String t) {
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i) - 'a'] < 0) return t.charAt(i);
        }
        return ' ';
    }
    // #endregion

    public static void main(String[] args) {
        String[][] cases = {{"abcd", "dbcea"}, {"", "z"}, {"aab", "abab"}, {"xyz", "zyxx"}};
        for (String[] c : cases) {
            System.out.println("findTheDifference(\"" + c[0] + "\", \"" + c[1] + "\") = " + findTheDifference(c[0], c[1])
                + "   count = " + findTheDifferenceCount(c[0], c[1]));
        }
        int acc = 0;
        for (char ch : "abcd".toCharArray()) acc ^= ch;
        String bin = String.format("%8s", Integer.toBinaryString(acc)).replace(' ', '0');
        System.out.println("XOR of \"abcd\" = " + acc + " (binary " + bin + ")");
    }
}
