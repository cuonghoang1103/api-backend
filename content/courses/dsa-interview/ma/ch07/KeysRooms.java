import java.util.*;

public class KeysRooms {
    // #region giai
    static boolean canVisitAllRooms(List<List<Integer>> rooms) {
        boolean[] seen = new boolean[rooms.size()];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        seen[0] = true;
        int count = 1;
        while (!stack.isEmpty()) {
            int r = stack.pop();
            for (int key : rooms.get(r)) {
                if (!seen[key]) { seen[key] = true; count++; stack.push(key); }
            }
        }
        return count == rooms.size();
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(canVisitAllRooms(List.of(List.of(1), List.of(2), List.of(3), List.of())));
        System.out.println(canVisitAllRooms(List.of(List.of(1, 3), List.of(3, 0, 1), List.of(2), List.of(0))));
        System.out.println(canVisitAllRooms(List.of(List.of())));
    }
}
