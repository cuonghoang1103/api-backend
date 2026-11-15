import java.util.*;

// PriorityQueue is NOT stable either: add an arrival counter to the comparator.
public class HeapOnDinh {
    record Req(String who, int prio, long seq) {}

    public static void main(String[] args) {
        String[] who = {"u1", "u2", "u3", "u4", "u5", "u6", "u7"};
        int[] prio = {2, 1, 2, 2, 1, 2, 2};
        // #region ondinh
        PriorityQueue<Req> noSeq = new PriorityQueue<>(Comparator.comparingInt(Req::prio));
        PriorityQueue<Req> withSeq = new PriorityQueue<>(
            Comparator.comparingInt(Req::prio).thenComparingLong(Req::seq));
        // #endregion
        long seq = 0;
        for (int i = 0; i < who.length; i++) { Req r = new Req(who[i], prio[i], seq++); noSeq.offer(r); withSeq.offer(r); }
        List<String> a = new ArrayList<>(), b = new ArrayList<>();
        while (!noSeq.isEmpty()) a.add(noSeq.poll().who());
        while (!withSeq.isEmpty()) b.add(withSeq.poll().who());
        System.out.println("arrival order          : " + Arrays.asList(who));
        System.out.println("prio only (unstable)   : " + a);
        System.out.println("prio, then seq (FIFO)  : " + b);
    }
}
