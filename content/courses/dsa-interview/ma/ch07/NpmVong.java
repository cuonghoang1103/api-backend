import java.util.*;

public class NpmVong {
    static Map<String, List<String>> deps = new LinkedHashMap<>();
    static Map<String, Integer> color = new HashMap<>();
    static List<String> path = new ArrayList<>(), cycle = new ArrayList<>();

    static void visit(String u) {
        color.put(u, 1); path.add(u);
        for (String v : deps.get(u)) {
            if (!cycle.isEmpty()) return;
            if (color.get(v) == 1) { cycle.addAll(path.subList(path.indexOf(v), path.size())); cycle.add(v); return; }
            if (color.get(v) == 0) visit(v);
        }
        color.put(u, 2); path.remove(path.size() - 1);
    }

    public static void main(String[] args) {
        deps.put("@tiptap/pm", List.of("prosemirror-model", "prosemirror-state", "prosemirror-transform", "prosemirror-view"));
        deps.put("prosemirror-state", List.of("prosemirror-model", "prosemirror-transform", "prosemirror-view"));
        deps.put("prosemirror-view", List.of("prosemirror-model", "prosemirror-state", "prosemirror-transform"));
        deps.put("prosemirror-transform", List.of("prosemirror-model"));
        deps.put("prosemirror-model", List.of("orderedmap"));
        deps.put("orderedmap", List.of());
        List<String> names = new ArrayList<>(deps.keySet());
        Map<String, Integer> unmet = new HashMap<>();
        for (String p : names) unmet.put(p, deps.get(p).size());
        List<String> q = new ArrayList<>();
        for (String p : names) if (unmet.get(p) == 0) q.add(p);
        for (int h = 0; h < q.size(); h++)
            for (String p : names) if (deps.get(p).contains(q.get(h)) && unmet.merge(p, -1, Integer::sum) == 0) q.add(p);
        System.out.println("Kahn order (deps first): " + q);
        List<String> left = new ArrayList<>();
        for (String p : names) if (!q.contains(p)) left.add(p);
        System.out.println("left with unmet deps   : " + left);
        for (String p : names) color.put(p, 0);
        visit("@tiptap/pm");
        System.out.println("cycle found by DFS     : " + String.join(" -> ", cycle));
    }
}
