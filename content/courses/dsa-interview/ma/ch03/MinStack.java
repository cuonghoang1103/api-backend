import java.util.*;

// LC 155 · Min Stack — store (value, minSoFar) pairs.
public class MinStack {
    // #region giai
    private final Deque<int[]> st = new ArrayDeque<>();   // {value, min so far}

    void push(int x) {
        int m = st.isEmpty() ? x : Math.min(x, st.peek()[1]);
        st.push(new int[]{x, m});
    }
    void pop() { st.pop(); }
    int top() { return st.peek()[0]; }
    int getMin() { return st.peek()[1]; }
    // #endregion

    public static void main(String[] args) {
        MinStack ms = new MinStack();
        for (int x : new int[]{5, 3, 7, 3, 1}) { ms.push(x); System.out.println("push " + x + " -> min " + ms.getMin()); }
        for (int k = 0; k < 4; k++) { ms.pop(); System.out.println("pop -> top " + ms.top() + " min " + ms.getMin()); }
    }
}
