import java.util.*;
import java.util.stream.*;

// Stable sort in Java: List.sort / Arrays.sort(Object[]) is a stable merge sort (TimSort).
public class SortOnDinh {
    record Student(String name, int score) {
        public String toString() { return name + ":" + score; }
    }
    static String show(List<Student> xs) { return xs.stream().map(Student::toString).collect(Collectors.joining(" ")); }

    // #region chon
    static List<Student> selectionSortByScoreDesc(List<Student> xs) {
        List<Student> a = new ArrayList<>(xs);
        for (int i = 0; i < a.size(); i++) {
            int best = i;
            for (int j = i + 1; j < a.size(); j++) if (a.get(j).score() > a.get(best).score()) best = j;
            Collections.swap(a, i, best);
        }
        return a;
    }
    // #endregion

    public static void main(String[] args) {
        List<Student> students = List.of(new Student("Minh", 8), new Student("An", 8), new Student("Lan", 7),
            new Student("Bao", 8), new Student("Chi", 9), new Student("Duc", 7));
        // #region ondinh
        List<Student> byName = new ArrayList<>(students);
        byName.sort(Comparator.comparing(Student::name));
        List<Student> thenScore = new ArrayList<>(byName);
        thenScore.sort(Comparator.comparingInt(Student::score).reversed());   // stable
        // #endregion
        // #region haikhoa
        List<Student> twoKeys = new ArrayList<>(students);
        twoKeys.sort(Comparator.comparingInt(Student::score).reversed().thenComparing(Student::name));
        // #endregion
        System.out.println("by name          : " + show(byName));
        System.out.println("then by score    : " + show(thenScore));
        System.out.println("two-key compare  : " + show(twoKeys));
        System.out.println("selection sort   : " + show(selectionSortByScoreDesc(byName)));
    }
}
