import java.util.*;

public class RpnDecode {
    // #region rpn
    static int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+" -> { int b = st.pop(), a = st.pop(); st.push(a + b); }
                case "-" -> { int b = st.pop(), a = st.pop(); st.push(a - b); }
                case "*" -> { int b = st.pop(), a = st.pop(); st.push(a * b); }
                case "/" -> { int b = st.pop(), a = st.pop(); st.push(a / b); }   // int division truncates toward zero
                default -> st.push(Integer.parseInt(t));
            }
        }
        return st.pop();
    }
    // #endregion

    // #region decode
    static String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> prefix = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) k = k * 10 + (c - '0');
            else if (c == '[') { counts.push(k); prefix.push(cur); cur = new StringBuilder(); k = 0; }
            else if (c == ']') {
                String inner = cur.toString().repeat(counts.pop());
                cur = prefix.pop().append(inner);
            } else cur.append(c);
        }
        return cur.toString();
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("evalRPN([2,1,+,3,*]) = " + evalRPN(new String[]{"2", "1", "+", "3", "*"}));
        System.out.println("evalRPN([4,13,5,/,+]) = " + evalRPN(new String[]{"4", "13", "5", "/", "+"}));
        System.out.println("evalRPN([7,-2,/]) = " + evalRPN(new String[]{"7", "-2", "/"}));
        System.out.println("floor(-7/2) = " + Math.floorDiv(-7, 2) + "  trunc(-7/2) = " + (-7 / 2));
        System.out.println("decodeString(3[a]2[bc]) = " + decodeString("3[a]2[bc]"));
        System.out.println("decodeString(3[a2[c]]) = " + decodeString("3[a2[c]]"));
        System.out.println("decodeString(2[ab]10[x]) = " + decodeString("2[ab]10[x]"));
    }
}
