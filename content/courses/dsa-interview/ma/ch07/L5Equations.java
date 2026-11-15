public class L5Equations {
    static int[] parent = new int[26];
    static int find(int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }

    // #region giai
    static boolean equationsPossible(String[] equations) {
        for (int i = 0; i < 26; i++) parent[i] = i;
        for (String e : equations) if (e.charAt(1) == '=') parent[find(e.charAt(0) - 'a')] = find(e.charAt(3) - 'a');
        for (String e : equations) if (e.charAt(1) == '!' && find(e.charAt(0) - 'a') == find(e.charAt(3) - 'a')) return false;
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(equationsPossible(new String[]{"a==b", "b!=a"}));
        System.out.println(equationsPossible(new String[]{"b==a", "a==b"}));
        System.out.println(equationsPossible(new String[]{"a!=c", "a==b", "b==c"}));
        System.out.println(equationsPossible(new String[]{"c==c", "b==d", "x!=z"}));
        System.out.println(equationsPossible(new String[]{"a!=a"}));
    }
}
