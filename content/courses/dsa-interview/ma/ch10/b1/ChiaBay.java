import java.util.Arrays;

// The same "divide the total" idea in Java: integer division by zero throws.
public class ChiaBay {
    // #region chia
    static int[] byDivision(int[] nums) {
        int total = 1;
        for (int x : nums) total *= x;
        int[] out = new int[nums.length];
        for (int i = 0; i < nums.length; i++) out[i] = total / nums[i];
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{1, 2, 3, 4}, {1, 2, 0, 4}};
        for (int[] c : cases) {
            try {
                System.out.println(Arrays.toString(c) + " -> " + Arrays.toString(byDivision(c)));
            } catch (ArithmeticException e) {
                System.out.println(Arrays.toString(c) + " -> ArithmeticException: " + e.getMessage());
            }
        }
    }
}
