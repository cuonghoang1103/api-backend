import java.util.*;

// LC 763 Partition Labels — greedy: a part can close only when it has passed the LAST occurrence of every letter in it.
public class LuPartitionLabels {
    // #region giai
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> sizes = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        return sizes;
    }
    // #endregion

    static int brute(String s) {
        int n = s.length(), best = 0;
        for (int mask = 0; mask < 1 << (n - 1); mask++) {
            int[] part = new int[n];
            for (int i = 1; i < n; i++) part[i] = part[i - 1] + ((mask >> (i - 1)) & 1);
            Map<Character, Integer> owner = new HashMap<>();
            boolean ok = true;
            for (int i = 0; i < n && ok; i++) {
                Integer o = owner.get(s.charAt(i));
                if (o == null) owner.put(s.charAt(i), part[i]); else if (o != part[i]) ok = false;
            }
            if (ok) best = Math.max(best, part[n - 1] + 1);
        }
        return best;
    }

    static long seed = 20261115;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        for (String s : new String[]{"abacdcdefe", "aaaa", "abc", "abca", "caedbdedda"})
            System.out.println("partitionLabels(\"" + s + "\") = " + partitionLabels(s));
        int bad = 0;
        for (int t = 0; t < 1500; t++) {
            int n = 1 + rnd(11);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append("abcdef".charAt(rnd(6)));
            String s = sb.toString();
            List<Integer> g = partitionLabels(s);
            int sum = 0; for (int x : g) sum += x;
            if (g.size() != brute(s) || sum != n) bad++;
        }
        System.out.println("random self-test vs 2^(n-1) brute force: 1500 strings, " + bad + " mismatches");
    }
}
