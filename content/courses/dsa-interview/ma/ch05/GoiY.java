import java.util.*;

// LC 1268 · Search Suggestions System — after each typed letter, up to 3 products (alphabetical) with that prefix.
public class GoiY {
    // #region goi-y
    static class TrieNode {
        TrieNode[] next = new TrieNode[26];
        List<String> top = new ArrayList<>(3);
    }

    static List<List<String>> suggestedProducts(String[] products, String searchWord) {
        String[] sorted = products.clone();
        Arrays.sort(sorted);
        TrieNode root = new TrieNode();
        for (String p : sorted) {
            TrieNode node = root;
            for (char ch : p.toCharArray()) {
                if (node.next[ch - 'a'] == null) node.next[ch - 'a'] = new TrieNode();
                node = node.next[ch - 'a'];
                if (node.top.size() < 3) node.top.add(p);
            }
        }
        List<List<String>> res = new ArrayList<>();
        TrieNode node = root;
        for (char ch : searchWord.toCharArray()) {
            node = node == null ? null : node.next[ch - 'a'];
            res.add(node == null ? new ArrayList<>() : node.top);
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(suggestedProducts(new String[]{"mobile", "mouse", "moneypot", "monitor", "mousepad"}, "mouse"));
        System.out.println(suggestedProducts(new String[]{"havana"}, "havana"));
        System.out.println(suggestedProducts(new String[]{"bags", "baggage", "banner", "box", "cloths"}, "bags"));
        System.out.println(suggestedProducts(new String[]{"java", "javascript", "json"}, "jx"));
    }
}
