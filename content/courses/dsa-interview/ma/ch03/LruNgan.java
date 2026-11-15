import java.util.*;

// Java's short LRU: LinkedHashMap with accessOrder = true + removeEldestEntry.
public class LruNgan {
    // #region giai
    static class LRUShort<K, V> extends LinkedHashMap<K, V> {
        private final int cap;
        LRUShort(int cap) { super(16, 0.75f, true); this.cap = cap; }      // true = order by ACCESS, not insertion
        @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) { return size() > cap; }
    }
    // #endregion

    public static void main(String[] args) {
        LRUShort<Integer, Integer> c = new LRUShort<>(2);
        c.put(1, 1); c.put(2, 2);
        int g1 = c.get(1);
        c.put(3, 3);
        StringBuilder sb = new StringBuilder();
        for (int k : c.keySet()) sb.append(sb.length() > 0 ? " " : "").append(k);
        System.out.println("get(1)=" + g1 + " then put(3): keys oldest->newest = [" + sb + "], get(2)=" + c.getOrDefault(2, -1));
    }
}
