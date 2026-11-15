import java.util.*;

// Traps with Java queues: mixing stack and queue methods on one ArrayDeque, null elements, and List.remove(int).
public class JavaDequeBay {
    public static void main(String[] args) {
        // #region tron
        Deque<Integer> dq = new ArrayDeque<>();
        dq.push(1); dq.push(2); dq.push(3);            // push = addFirst (stack method)
        System.out.println("push 1,2,3 then poll x3 -> " + dq.poll() + "," + dq.poll() + "," + dq.poll() + "   (LIFO! poll = pollFirst)");
        dq.offer(1); dq.offer(2); dq.offer(3);         // offer = addLast (queue method)
        System.out.println("offer 1,2,3 then poll x3 -> " + dq.poll() + "," + dq.poll() + "," + dq.poll() + "   (FIFO)");
        // #endregion
        // #region null
        try { new ArrayDeque<Integer>().offer(null); } catch (NullPointerException e) { System.out.println("ArrayDeque.offer(null) -> NullPointerException"); }
        Queue<Integer> ll = new LinkedList<>();
        ll.offer(null);
        System.out.println("LinkedList accepts null: poll() = " + ll.poll() + ", and poll() on empty = " + ll.poll() + "  <- you cannot tell them apart");
        // #endregion
        // #region remove
        List<Integer> list = new ArrayList<>(List.of(10, 20, 1, 30));
        list.remove(1);                                // remove(int index) — NOT the value 1
        System.out.println("list.remove(1) on [10, 20, 1, 30] -> " + list);
        list.remove(Integer.valueOf(1));               // remove(Object) — the value 1
        System.out.println("list.remove(Integer.valueOf(1)) -> " + list);
        // #endregion
    }
}
