import java.util.*;

// LC 1094 · Car Pooling — difference array over kilometres 0..1000.
public class CarPooling {
    // #region giai
    static boolean carPooling(int[][] trips, int capacity) {
        int[] diff = new int[1001];
        for (int[] t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
        int inCar = 0;
        for (int x = 0; x <= 1000; x++) {
            inCar += diff[x];
            if (inCar > capacity) return false;
        }
        return true;
    }
    // #endregion

    static String show(int[][] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(a[i]));
        return sb.append("]").toString();
    }
    public static void main(String[] args) {
        int[][][] trips = {{{3, 1, 6}, {2, 4, 8}}, {{3, 1, 6}, {2, 6, 8}}, {{4, 2, 7}, {3, 7, 9}, {6, 3, 9}}, {{9, 0, 1000}}};
        int[] caps = {4, 4, 10, 8};
        for (int t = 0; t < trips.length; t++) System.out.println("capacity " + caps[t] + " trips " + show(trips[t]) + " -> " + carPooling(trips[t], caps[t]));
    }
}
