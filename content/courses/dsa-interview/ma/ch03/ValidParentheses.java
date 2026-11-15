import java.util.*;

// LC 20 · Valid Parentheses — ArrayDeque used as a stack (push/pop/peek on the head).
public class ValidParentheses {
    // #region giai
    static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;            // pop() on empty would THROW
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
            }
        }
        return stack.isEmpty();
    }
    // #endregion

    static boolean isValidBug(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') { stack.push(c); continue; }
            Character open = stack.poll();                   // poll() returns null instead of throwing
            if (open == null) return false;
            if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        for (String s : new String[]{"()[]{}", "{[()]}", "([)]", "(]", "]", "((", ""}) {
            System.out.println("isValid(\"" + s + "\") = " + isValid(s) + "   buggy = " + isValidBug(s));
        }
    }
}
