import java.util.*;

public class LruCache {
    // #region giai
    static class DNode { int key, val; DNode prev, next; DNode(int k, int v) { key = k; val = v; } }

    private final Map<Integer, DNode> map = new HashMap<>();
    private final DNode head = new DNode(0, 0), tail = new DNode(0, 0);
    private final int cap;

    LruCache(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }

    private void unlink(DNode n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addFront(DNode n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }

    int get(int key) {
        DNode n = map.get(key);
        if (n == null) return -1;
        unlink(n); addFront(n);
        return n.val;
    }
    void put(int key, int val) {
        DNode old = map.get(key);
        if (old != null) { old.val = val; unlink(old); addFront(old); return; }
        if (map.size() == cap) { DNode lru = tail.prev; unlink(lru); map.remove(lru.key); }
        DNode n = new DNode(key, val);
        map.put(key, n); addFront(n);
    }
    // #endregion
    String order() { StringBuilder sb = new StringBuilder(); for (DNode n = head.next; n != tail; n = n.next) sb.append(sb.length() > 0 ? " " : "").append(n.key); return sb.toString(); }

    public static void main(String[] args) {
        LruCache c = new LruCache(2);
        c.put(1, 1); System.out.println("put(1,1)   order=[" + c.order() + "]");
        c.put(2, 2); System.out.println("put(2,2)   order=[" + c.order() + "]");
        System.out.println("get(1)=" + c.get(1) + "   order=[" + c.order() + "]");
        c.put(3, 3); System.out.println("put(3,3)   order=[" + c.order() + "]  (2 evicted)");
        System.out.println("get(2)=" + c.get(2) + "  order=[" + c.order() + "]");
        c.put(4, 4); System.out.println("put(4,4)   order=[" + c.order() + "]  (1 evicted)");
        int g1 = c.get(1), g3 = c.get(3), g4 = c.get(4);
        System.out.println("get(1)=" + g1 + " get(3)=" + g3 + " get(4)=" + g4 + "  order=[" + c.order() + "]");
    }
}
