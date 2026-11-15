import java.util.*;

public class Recipes {
    // #region giai
    static List<String> findAllRecipes(String[] recipes, List<List<String>> ingredients, String[] supplies) {
        Map<String, List<String>> usedBy = new HashMap<>();
        Map<String, Integer> need = new HashMap<>();
        for (int i = 0; i < recipes.length; i++) {
            need.put(recipes[i], ingredients.get(i).size());
            for (String ing : ingredients.get(i)) usedBy.computeIfAbsent(ing, k -> new ArrayList<>()).add(recipes[i]);
        }
        ArrayDeque<String> q = new ArrayDeque<>(Arrays.asList(supplies));
        List<String> made = new ArrayList<>();
        while (!q.isEmpty()) {
            for (String r : usedBy.getOrDefault(q.poll(), List.of())) {
                if (need.merge(r, -1, Integer::sum) == 0) { made.add(r); q.add(r); }
            }
        }
        return made;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(findAllRecipes(new String[]{"bread"}, List.of(List.of("yeast", "flour")), new String[]{"yeast", "flour", "corn"}));
        System.out.println(findAllRecipes(new String[]{"bread", "sandwich", "burger"},
            List.of(List.of("yeast", "flour"), List.of("bread", "meat"), List.of("sandwich", "meat", "bread")), new String[]{"yeast", "flour", "meat"}));
        System.out.println(findAllRecipes(new String[]{"a", "b"}, List.of(List.of("b"), List.of("a")), new String[]{"x"}));
    }
}
