import java.util.*;

// LC 295 · Find Median from Data Stream — max-heap lo (smaller half) + min-heap hi (larger half).
public class MedianFinder {
    // #region giai
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    PriorityQueue<Integer> hi = new PriorityQueue<>();                           // min-heap

    void addNum(int x) {
        if (lo.isEmpty() || x <= lo.peek()) lo.offer(x); else hi.offer(x);
        if (lo.size() > hi.size() + 1) hi.offer(lo.poll());
        else if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();
        return ((double) lo.peek() + hi.peek()) / 2.0;   // widen BEFORE adding: no int overflow
    }
    // #endregion

    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        int[] stream = {5, 15, 1, 3, 8, 7, 9, 10};
        StringBuilder sb = new StringBuilder();
        for (int x : stream) { mf.addNum(x); sb.append(sb.length() > 0 ? " " : "").append(String.format(Locale.ROOT, "%.1f", mf.findMedian())); }
        System.out.println("stream  " + Arrays.toString(stream));
        System.out.println("medians " + sb);
        MedianFinder neg = new MedianFinder();
        for (int x : new int[]{-4, -4, -4, 2}) neg.addNum(x);
        System.out.println("[-4,-4,-4,2] -> " + String.format(Locale.ROOT, "%.1f", neg.findMedian()));
    }
}
