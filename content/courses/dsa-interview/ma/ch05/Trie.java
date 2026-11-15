import java.util.*;

// LC 208 · Implement Trie (Prefix Tree) — insert / search / startsWith, plus autocomplete (k words under a prefix).
public class Trie {
    // #region nut
    static class TrieNode {
        TrieNode[] next = new TrieNode[26];   // index = ch - 'a'; already in alphabetical order
        boolean isEnd;
    }
    // #endregion

    // #region trie
    TrieNode root = new TrieNode();
    int nodes = 1;

    void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.next[i] == null) { node.next[i] = new TrieNode(); nodes++; }
            node = node.next[i];
        }
        node.isEnd = true;
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char ch : s.toCharArray()) {
            node = node.next[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    boolean search(String word) { TrieNode n = walk(word); return n != null && n.isEnd; }
    boolean startsWith(String prefix) { return walk(prefix) != null; }
    // #endregion

    // #region goi-y
    List<String> suggest(String prefix, int k) {
        List<String> out = new ArrayList<>();
        TrieNode start = walk(prefix);
        if (start != null) dfs(start, new StringBuilder(prefix), k, out);
        return out;
    }
    private void dfs(TrieNode node, StringBuilder path, int k, List<String> out) {
        if (out.size() == k) return;
        if (node.isEnd) out.add(path.toString());
        for (int i = 0; i < 26 && out.size() < k; i++) {
            if (node.next[i] == null) continue;
            path.append((char) ('a' + i));
            dfs(node.next[i], path, k, out);
            path.deleteCharAt(path.length() - 1);   // undo: one StringBuilder for the whole walk
        }
    }
    // #endregion

    public static void main(String[] args) {
        Trie t = new Trie();
        t.insert("apple");
        System.out.println("search(\"apple\") = " + t.search("apple"));
        System.out.println("search(\"app\") = " + t.search("app"));
        System.out.println("startsWith(\"app\") = " + t.startsWith("app"));
        t.insert("app");
        System.out.println("after insert(\"app\"): search(\"app\") = " + t.search("app"));

        String[] words = {"car", "card", "care", "careful", "cart", "cat", "dog", "dot"};
        Trie t2 = new Trie();
        int letters = 0;
        for (String w : words) { t2.insert(w); letters += w.length(); }
        System.out.println(words.length + " words, " + letters + " letters, " + t2.nodes + " trie nodes (root included)");
        for (String p : new String[]{"car", "ca", "do", "x"}) {
            List<String> s = t2.suggest(p, 3);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < s.size(); i++) sb.append(i > 0 ? "," : "").append('"').append(s.get(i)).append('"');
            System.out.println("suggest(\"" + p + "\", 3) = " + sb.append(']'));
        }
    }
}
