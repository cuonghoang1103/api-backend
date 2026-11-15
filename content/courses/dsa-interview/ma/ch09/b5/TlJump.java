import java.util.*;

// LC 55 Jump Game (greedy "farthest reach") and LC 45 Jump Game II (BFS levels without a queue).
public class TlJump {
    // #region dp
    static boolean canJumpDP(int[] nums) {
        int n = nums.length;
        boolean[] ok = new boolean[n];
        ok[n - 1] = true;
        for (int i = n - 2; i >= 0; i--)
            for (int j = i + 1; j <= Math.min(n - 1, i + nums[i]); j++) if (ok[j]) { ok[i] = true; break; }
        return ok[0];
    }
    // #endregion

    // #region lc55
    static boolean canJump(int[] nums) {
        int far = 0;                                 // farthest index reachable so far
        for (int i = 0; i < nums.length; i++) {
            if (i > far) return false;               // standing on a cell we can never reach
            far = Math.max(far, i + nums[i]);
            if (far >= nums.length - 1) return true;
        }
        return true;
    }
    // #endregion

    // #region lc45
    static int jump(int[] nums) {
        int jumps = 0, end = 0, far = 0;             // [.., end] = cells reachable with `jumps` jumps
        for (int i = 0; i < nums.length - 1; i++) {  // NOT i < n: standing on the last cell needs no jump
            far = Math.max(far, i + nums[i]);
            if (i == end) { jumps++; end = far; }    // the current level is used up: jump once more
        }
        return jumps;
    }
    // #endregion

    static int jumpWrong(int[] nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i < nums.length; i++) {
            far = Math.max(far, i + nums[i]);
            if (i == end) { jumps++; end = far; }
        }
        return jumps;
    }

    static long seed = 7;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] A = {{2, 3, 1, 1, 4}, {3, 2, 1, 0, 4}, {0}, {2, 0, 0}, {1, 0, 1}};
        for (int[] a : A) System.out.println("canJump(" + Arrays.toString(a) + ") = " + canJump(a) + "   DP = " + canJumpDP(a));
        int[][] B = {{2, 3, 1, 1, 4}, {2, 3, 0, 1, 4}, {0}, {1, 2}, {1, 1, 1, 1}};
        for (int[] a : B) System.out.println("jump(" + Arrays.toString(a) + ") = " + jump(a) + "   wrong loop (i < n) = " + jumpWrong(a));
        int bad = 0;
        for (int t = 0; t < 2000; t++) {
            int[] a = new int[1 + rnd(9)];
            for (int i = 0; i < a.length; i++) a[i] = rnd(4);
            if (canJump(a) != canJumpDP(a)) bad++;
        }
        System.out.println("random check canJump vs DP: 2000 arrays, " + bad + " mismatches");
    }
}
