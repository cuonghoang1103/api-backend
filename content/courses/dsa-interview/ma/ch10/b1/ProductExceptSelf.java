import java.util.Arrays;

public class ProductExceptSelf {
    // #region giai
    static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        int left = 1;                        // product of everything to the LEFT of i
        for (int i = 0; i < n; i++) {
            answer[i] = left;
            left *= nums[i];
        }
        int right = 1;                       // product of everything to the RIGHT of i
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }
        return answer;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{1, 2, 3, 4}, {-1, 1, 0, -3, 3}, {2, 3}, {0, 0}, {5, 0, 2}};
        for (int[] c : cases) {
            System.out.println(Arrays.toString(c) + " -> " + Arrays.toString(productExceptSelf(c)));
        }
    }
}
