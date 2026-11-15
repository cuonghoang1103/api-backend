import java.util.*;

// LC 1249 · Minimum Remove to Make Valid Parentheses — stack of indices, and the two-pass counter version.
public class PvMinRemove {
    // #region ngan-xep
    static String minRemoveStack(String s) {
        boolean[] remove = new boolean[s.length()];
        Deque<Integer> open = new ArrayDeque<>();        // indices of '(' still waiting for a partner
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '(') open.push(i);
            else if (ch == ')') {
                if (!open.isEmpty()) open.pop();
                else remove[i] = true;
            }
        }
        for (int i : open) remove[i] = true;             // leftover '(' never got closed
        StringBuilder out = new StringBuilder();         // StringBuilder: += on String would be O(n^2)
        for (int i = 0; i < s.length(); i++) if (!remove[i]) out.append(s.charAt(i));
        return out.toString();
    }
    // #endregion

    // #region hai-luot
    static String minRemoveTwoPass(String s) {
        StringBuilder kept = new StringBuilder();
        int open = 0;
        for (char ch : s.toCharArray()) {                // pass 1: drop ')' with no '(' before it
            if (ch == '(') open++;
            else if (ch == ')') {
                if (open == 0) continue;
                open--;
            }
            kept.append(ch);
        }
        StringBuilder out = new StringBuilder();
        for (int i = kept.length() - 1; i >= 0; i--) {   // pass 2: drop the `open` rightmost '('
            if (kept.charAt(i) == '(' && open > 0) { open--; continue; }
            out.append(kept.charAt(i));
        }
        return out.reverse().toString();
    }
    // #endregion

    static boolean isValid(String s) {
        int bal = 0;
        for (char ch : s.toCharArray()) {
            if (ch == '(') bal++;
            else if (ch == ')' && --bal < 0) return false;
        }
        return bal == 0;
    }

    public static void main(String[] args) {
        String[] cases = {"lab(o(r)a)tory)", "a)b(c)d", "))((", "(a(b(c)d)", "", "xyz", "())()(((", "((x)"};
        for (String s : cases) {
            String a = minRemoveStack(s), b = minRemoveTwoPass(s);
            System.out.println("\"" + s + "\" -> stack=\"" + a + "\" twoPass=\"" + b + "\" valid=" + (isValid(a) && isValid(b))
                + " removed=" + (s.length() - a.length()) + "/" + (s.length() - b.length()));
        }
        String big = "(".repeat(50000) + "x" + ")".repeat(49999);
        System.out.println("big input n=" + big.length() + ": removed=" + (big.length() - minRemoveStack(big).length()));
    }
}
