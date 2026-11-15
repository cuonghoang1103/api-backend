import java.util.*;

// Trap: java.util.Stack and ArrayDeque hold the same elements but PRINT and ITERATE in opposite orders.
public class JavaStackBay {
    public static void main(String[] args) {
        // #region bay
        Stack<Integer> old = new Stack<>();          // legacy class (extends Vector, synchronized)
        Deque<Integer> dq = new ArrayDeque<>();      // the recommended stack
        for (int x : new int[]{1, 2, 3}) { old.push(x); dq.push(x); }
        System.out.println("Stack      prints " + old + "   peek = " + old.peek());
        System.out.println("ArrayDeque prints " + dq + "   peek = " + dq.peek());
        System.out.println("Stack.get(0) = " + old.get(0) + "  <- index access breaks the LIFO idea");
        try { new ArrayDeque<Integer>().pop(); } catch (NoSuchElementException e) { System.out.println("ArrayDeque.pop() on empty -> NoSuchElementException"); }
        try { new Stack<Integer>().pop(); } catch (EmptyStackException e) { System.out.println("Stack.pop() on empty -> EmptyStackException"); }
        System.out.println("ArrayDeque.peek() on empty -> " + new ArrayDeque<Integer>().peek());
        // #endregion
    }
}
