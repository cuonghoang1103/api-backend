import java.util.*;

public class AccountsMerge {
    static int[] parent;
    static int find(int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }

    // #region giai
    static List<List<String>> accountsMerge(List<List<String>> accounts) {
        Map<String, Integer> id = new LinkedHashMap<>();
        Map<String, String> owner = new HashMap<>();
        for (List<String> acc : accounts)
            for (String e : acc.subList(1, acc.size())) { id.putIfAbsent(e, id.size()); owner.put(e, acc.get(0)); }
        parent = new int[id.size()];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (List<String> acc : accounts) {
            int first = id.get(acc.get(1));
            for (String e : acc.subList(2, acc.size())) parent[find(id.get(e))] = find(first);
        }
        Map<Integer, List<String>> groups = new HashMap<>();
        for (var en : id.entrySet()) groups.computeIfAbsent(find(en.getValue()), k -> new ArrayList<>()).add(en.getKey());
        List<List<String>> out = new ArrayList<>();
        for (List<String> g : groups.values()) {
            Collections.sort(g);
            List<String> row = new ArrayList<>();
            row.add(owner.get(g.get(0)));
            row.addAll(g);
            out.add(row);
        }
        out.sort((a, b) -> (a.get(0) + a.get(1)).compareTo(b.get(0) + b.get(1)));
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(accountsMerge(List.of(
            List.of("John", "johnsmith@mail.com", "john_newyork@mail.com"),
            List.of("John", "johnsmith@mail.com", "john00@mail.com"),
            List.of("Mary", "mary@mail.com"),
            List.of("John", "johnnybravo@mail.com"))));
        System.out.println(accountsMerge(List.of(
            List.of("Lan", "a@x.vn", "b@x.vn"), List.of("Lan", "c@x.vn"), List.of("Lan", "c@x.vn", "b@x.vn"))));
    }
}
