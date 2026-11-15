import java.util.*;

public class CloneGraph {
    static class Node {
        int val; List<Node> neighbors = new ArrayList<>();
        Node(int val) { this.val = val; }
    }

    // #region giai
    static Node cloneGraph(Node node) {
        if (node == null) return null;
        Map<Node, Node> copy = new HashMap<>();
        copy.put(node, new Node(node.val));
        ArrayDeque<Node> q = new ArrayDeque<>();
        q.add(node);
        while (!q.isEmpty()) {
            Node u = q.poll();
            for (Node v : u.neighbors) {
                if (!copy.containsKey(v)) { copy.put(v, new Node(v.val)); q.add(v); }
                copy.get(u).neighbors.add(copy.get(v));
            }
        }
        return copy.get(node);
    }
    // #endregion

    static Node build(int[][] adj) {
        Node[] nodes = new Node[adj.length];
        for (int i = 0; i < adj.length; i++) nodes[i] = new Node(i + 1);
        for (int i = 0; i < adj.length; i++) for (int j : adj[i]) nodes[i].neighbors.add(nodes[j - 1]);
        return nodes[0];
    }
    static Set<Node> all(Node s) {
        Set<Node> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        ArrayDeque<Node> q = new ArrayDeque<>();
        seen.add(s); q.add(s);
        while (!q.isEmpty()) for (Node v : q.poll().neighbors) if (seen.add(v)) q.add(v);
        return seen;
    }
    static List<List<Integer>> adjOf(Set<Node> nodes) {
        List<Node> sorted = new ArrayList<>(nodes);
        sorted.sort(Comparator.comparingInt(n -> n.val));
        List<List<Integer>> out = new ArrayList<>();
        for (Node n : sorted) { List<Integer> l = new ArrayList<>(); for (Node v : n.neighbors) l.add(v.val); out.add(l); }
        return out;
    }

    public static void main(String[] args) {
        Node original = build(new int[][]{{2, 4}, {1, 3}, {2, 4}, {1, 3}});
        Node cloned = cloneGraph(original);
        Set<Node> a = all(original), b = all(cloned);
        System.out.println("original adj: " + adjOf(a));
        System.out.println("clone adj   : " + adjOf(b));
        int shared = 0;
        for (Node x : b) if (a.contains(x)) shared++;
        System.out.println("nodes shared between original and clone: " + shared);
    }
}
