import java.util.*;

public class WordLadder {
    // #region giai
    static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        List<String> level = new ArrayList<>(List.of(beginWord));
        dict.remove(beginWord);
        int steps = 1;
        while (!level.isEmpty()) {
            List<String> next = new ArrayList<>();
            for (String w : level) {
                char[] cs = w.toCharArray();
                for (int i = 0; i < cs.length; i++) {
                    char old = cs[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        cs[i] = ch;
                        String cand = new String(cs);
                        if (!dict.contains(cand)) continue;
                        if (cand.equals(endWord)) return steps + 1;
                        dict.remove(cand);
                        next.add(cand);
                    }
                    cs[i] = old;                          // restore before changing the next position
                }
            }
            level = next;
            steps++;
        }
        return 0;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(ladderLength("hit", "cog", List.of("hot", "dot", "dog", "lot", "log", "cog")));
        System.out.println(ladderLength("hit", "cog", List.of("hot", "dot", "dog", "lot", "log")));
        System.out.println(ladderLength("a", "c", List.of("a", "b", "c")));
        System.out.println(ladderLength("code", "data", List.of("cade", "cate", "date", "data", "gate", "code")));
    }
}
