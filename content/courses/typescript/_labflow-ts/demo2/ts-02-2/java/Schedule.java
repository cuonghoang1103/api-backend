// Java comparison (PRO192): List.of gives an unmodifiable list — but the check happens at RUNTIME.
import java.util.List;

public class Schedule {
    public static void main(String[] args) {
        List<Integer> starts = List.of(480, 600, 780);
        System.out.println("compiled fine, size " + starts.size());
        starts.add(900);                       // javac accepts this line
    }
}
