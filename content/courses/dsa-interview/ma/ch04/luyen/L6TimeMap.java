import java.util.*;
import java.util.function.IntPredicate;

// LC 981 · Time Based Key-Value Store.
public class L6TimeMap {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static class TimeMap {
        private final Map<String, List<Integer>> ts = new HashMap<>();
        private final Map<String, List<String>> vs = new HashMap<>();
        void set(String key, String value, int timestamp) {
            ts.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);
            vs.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }
        String get(String key, int timestamp) {
            List<Integer> t = ts.get(key);
            if (t == null) return "";
            int i = firstTrue(0, t.size(), k -> t.get(k) > timestamp) - 1;
            return i >= 0 ? vs.get(key).get(i) : "";
        }
    }
    // #endregion
    public static void main(String[] args) {
        TimeMap m = new TimeMap();
        m.set("price", "100k", 10); m.set("price", "120k", 20); m.set("price", "90k", 35);
        String[] keys = {"price", "price", "price", "price", "price", "price", "stock"};
        int[] times = {5, 10, 19, 20, 34, 99, 50};
        for (int i = 0; i < keys.length; i++) System.out.println("get(" + keys[i] + ", " + times[i] + ") = \"" + m.get(keys[i], times[i]) + "\"");
    }
}
