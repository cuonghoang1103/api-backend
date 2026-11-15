import java.util.*;

public class L4CarFleet {
    // #region giai
    static int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        double[][] cars = new double[n][2];
        for (int i = 0; i < n; i++) cars[i] = new double[]{position[i], (double) (target - position[i]) / speed[i]};
        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));   // NOT (int)(b[0] - a[0]) — see Chapter 6 on comparators
        int fleets = 0;
        double lastTime = -1;                                      // top of the stack is all we ever look at
        for (double[] c : cars) {
            if (c[1] > lastTime) { fleets++; lastTime = c[1]; }
        }
        return fleets;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(carFleet(12, new int[]{10, 8, 0, 5, 3}, new int[]{2, 4, 1, 1, 3}));
        System.out.println(carFleet(10, new int[]{3}, new int[]{3}));
        System.out.println(carFleet(100, new int[]{0, 2, 4}, new int[]{4, 2, 1}));
        System.out.println(carFleet(10, new int[]{6, 8}, new int[]{3, 2}));
    }
}
