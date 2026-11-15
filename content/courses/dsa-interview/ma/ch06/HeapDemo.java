import java.util.*;

// Java has the heap built in: PriorityQueue (a binary MIN-heap by default).
// toString() prints the INTERNAL array — the same layout as our TypeScript MinHeap.
public class HeapDemo {
    record Task(String name, int prio) {
        public String toString() { return name + ":" + prio; }
    }

    public static void main(String[] args) {
        // #region pq
        PriorityQueue<Integer> minH = new PriorityQueue<>();                          // min-heap
        PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
        PriorityQueue<Task> tasks = new PriorityQueue<>(
            Comparator.comparingInt(Task::prio).thenComparing(Task::name));          // by prio, then name
        // offer = push · poll = pop (null when empty) · peek = top · size · isEmpty
        // #endregion
        for (int x : new int[]{5, 3, 8, 1, 9, 2}) {
            minH.offer(x);
            System.out.println("push " + x + " -> array " + minH);
        }
        System.out.println("peek = " + minH.peek() + ", size = " + minH.size());
        List<Integer> out = new ArrayList<>();
        while (!minH.isEmpty()) {
            out.add(minH.poll());
            if (out.size() <= 2) System.out.println("pop " + out.get(out.size() - 1) + " -> array " + minH);
        }
        System.out.println("all pops = " + out);
        for (int x : new int[]{5, 3, 8, 1, 9, 2}) maxH.offer(x);
        List<Integer> outMax = new ArrayList<>();
        while (!maxH.isEmpty()) outMax.add(maxH.poll());
        System.out.println("max-heap pops = " + outMax);
        tasks.offer(new Task("deploy", 2)); tasks.offer(new Task("backup", 3)); tasks.offer(new Task("alert", 1));
        tasks.offer(new Task("report", 3)); tasks.offer(new Task("build", 2));
        List<Task> order = new ArrayList<>();
        while (!tasks.isEmpty()) order.add(tasks.poll());
        System.out.println("tasks = " + order);
        System.out.println("pop on empty = " + minH.poll());
    }
}
