import java.util.*;

public class Alien {
    // #region giai
    static String alienOrder(String[] words) {
        TreeSet<Character> letters = new TreeSet<>();
        for (String w : words) for (char c : w.toCharArray()) letters.add(c);
        Map<Character, Set<Character>> out = new HashMap<>();
        Map<Character, Integer> indeg = new HashMap<>();
        for (char c : letters) { out.put(c, new HashSet<>()); indeg.put(c, 0); }
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int j = 0;
            while (j < a.length() && j < b.length() && a.charAt(j) == b.charAt(j)) j++;
            if (j == Math.min(a.length(), b.length())) {
                if (a.length() > b.length()) return "";
                continue;
            }
            if (out.get(a.charAt(j)).add(b.charAt(j))) indeg.merge(b.charAt(j), 1, Integer::sum);
        }
        PriorityQueue<Character> ready = new PriorityQueue<>();
        for (char c : letters) if (indeg.get(c) == 0) ready.add(c);
        StringBuilder order = new StringBuilder();
        while (!ready.isEmpty()) {
            char u = ready.poll();
            order.append(u);
            for (char v : out.get(u)) if (indeg.merge(v, -1, Integer::sum) == 0) ready.add(v);
        }
        return order.length() == letters.size() ? order.toString() : "";
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("\"" + alienOrder(new String[]{"wrt", "wrf", "er", "ett", "rftt"}) + "\"");
        System.out.println("\"" + alienOrder(new String[]{"z", "x"}) + "\"");
        System.out.println("\"" + alienOrder(new String[]{"z", "x", "z"}) + "\"");
        System.out.println("\"" + alienOrder(new String[]{"abc", "ab"}) + "\"");
    }
}
