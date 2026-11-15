import java.util.*;

// LC 212 · Word Search II — a trie of the WORDS + backtracking on the grid, pruning branches that match no prefix.
public class WordSearch2 {
    // #region giai
    static class TrieNode { TrieNode[] next = new TrieNode[26]; String word; int kids; }
    static int calls;

    static List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode n = root;
            for (char ch : w.toCharArray()) {
                if (n.next[ch - 'a'] == null) { n.next[ch - 'a'] = new TrieNode(); n.kids++; }
                n = n.next[ch - 'a'];
            }
            n.word = w;
        }
        List<String> found = new ArrayList<>();
        calls = 0;
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++) dfs(board, r, c, root, found);
        Collections.sort(found);
        return found;
    }

    static void dfs(char[][] board, int r, int c, TrieNode parent, List<String> found) {
        char ch = board[r][c];
        TrieNode node = parent.next[ch - 'a'];
        if (node == null) return;                          // prune
        calls++;
        if (node.word != null) { found.add(node.word); node.word = null; }
        board[r][c] = '#';
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length && board[nr][nc] != '#') dfs(board, nr, nc, node, found);
        }
        board[r][c] = ch;
        if (node.kids == 0 && node.word == null) { parent.next[ch - 'a'] = null; parent.kids--; }
    }
    // #endregion

    static String q(List<String> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) sb.append(i > 0 ? "," : "").append('"').append(l.get(i)).append('"');
        return sb.append(']').toString();
    }

    public static void main(String[] args) {
        char[][] b1 = {{'o', 'a', 'a', 'n'}, {'e', 't', 'a', 'e'}, {'i', 'h', 'k', 'r'}, {'i', 'f', 'l', 'v'}};
        List<String> r = findWords(b1, new String[]{"oath", "pea", "eat", "rain"});
        System.out.println("findWords(board 4x4, [\"oath\",\"pea\",\"eat\",\"rain\"]) = " + q(r) + "   dfs calls = " + calls);
        r = findWords(new char[][]{{'a', 'b'}, {'c', 'd'}}, new String[]{"abcb"});
        System.out.println("findWords([[a,b],[c,d]], [\"abcb\"]) = " + q(r) + "   dfs calls = " + calls);
        r = findWords(new char[][]{{'a', 'a'}}, new String[]{"aaa", "a", "aa"});
        System.out.println("findWords([[a,a]], [\"aaa\",\"a\",\"aa\"]) = " + q(r) + "   dfs calls = " + calls);
    }
}
