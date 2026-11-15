import java.util.*;

// LC 211 · Design Add and Search Words Data Structure — a trie where '.' matches any one letter (DFS branches there).
public class AddSearch {
    static class TrieNode { TrieNode[] next = new TrieNode[26]; boolean isEnd; }

    // #region tu-dien
    static class WordDictionary {
        TrieNode root = new TrieNode();
        int steps;

        void addWord(String word) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new TrieNode();
                node = node.next[ch - 'a'];
            }
            node.isEnd = true;
        }

        boolean search(String word) { steps = 0; return dfs(root, word, 0); }

        private boolean dfs(TrieNode node, String word, int i) {
            steps++;
            if (i == word.length()) return node.isEnd;
            char ch = word.charAt(i);
            if (ch == '.') {
                for (TrieNode child : node.next) if (child != null && dfs(child, word, i + 1)) return true;
                return false;
            }
            TrieNode child = node.next[ch - 'a'];
            return child != null && dfs(child, word, i + 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        WordDictionary d = new WordDictionary();
        for (String w : new String[]{"bad", "dad", "mad", "bed"}) d.addWord(w);
        for (String q : new String[]{"pad", "bad", ".ad", "b..", "...", "....", "m.d", ".e."}) {
            boolean r = d.search(q);
            System.out.println("search(\"" + q + "\") = " + r + "   (visited " + d.steps + " nodes)");
        }
    }
}
