import java.util.*;

public class QueueHaiStack {
    // #region giai
    static class MyQueue {
        private final Deque<Integer> inbox = new ArrayDeque<>(), outbox = new ArrayDeque<>();
        long moves = 0;
        void push(int x) { inbox.push(x); }
        private void shiftOver() {
            if (outbox.isEmpty()) while (!inbox.isEmpty()) { outbox.push(inbox.pop()); moves++; }
        }
        int pop() { shiftOver(); return outbox.pop(); }
        int peek() { shiftOver(); return outbox.peek(); }
        boolean empty() { return inbox.isEmpty() && outbox.isEmpty(); }
    }
    // #endregion

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1); q.push(2); q.push(3);
        List<Integer> got = new ArrayList<>(List.of(q.pop()));
        q.push(4);
        got.add(q.pop()); got.add(q.pop()); got.add(q.pop());
        System.out.println("popped in order: " + got + "  empty = " + q.empty());
        MyQueue big = new MyQueue();
        long ops = 0;
        for (int i = 0; i < 100_000; i++) { big.push(i); ops++; if (i % 3 == 2) { big.pop(); ops++; } }
        while (!big.empty()) { big.pop(); ops++; }
        System.out.println("operations = " + ops + "  element moves = " + big.moves + "  moves per operation = " + String.format("%.2f", (double) big.moves / ops));
    }
}
