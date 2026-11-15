import java.util.*;

// LC 42 · Trapping Rain Water — prefix/suffix max arrays, then two pointers with O(1) memory.
public class Trap {
    // #region mang
    static int trapArrays(int[] h) {
        int n = h.length;
        int[] leftMax = new int[n], rightMax = new int[n];
        for (int i = 0; i < n; i++) leftMax[i] = Math.max(h[i], i > 0 ? leftMax[i - 1] : 0);
        for (int i = n - 1; i >= 0; i--) rightMax[i] = Math.max(h[i], i < n - 1 ? rightMax[i + 1] : 0);
        int water = 0;
        for (int i = 0; i < n; i++) water += Math.min(leftMax[i], rightMax[i]) - h[i];
        return water;
    }
    // #endregion

    // #region two
    static int trap(int[] h) {
        int l = 0, r = h.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (h[l] < h[r]) {
                leftMax = Math.max(leftMax, h[l]);
                water += leftMax - h[l];
                l++;
            } else {
                rightMax = Math.max(rightMax, h[r]);
                water += rightMax - h[r];
                r--;
            }
        }
        return water;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, {4, 2, 0, 3, 2, 5}, {3, 2, 1}, {5}};
        for (int[] h : tests)
            System.out.println("trap(" + Arrays.toString(h) + ") = " + trap(h) + "   arrays = " + trapArrays(h));
    }
}
