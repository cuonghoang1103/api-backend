import java.util.*;

// Difference array: lab occupancy per hour + LC 1109 Corporate Flight Bookings.
public class PrefixHieuMang {
    // #region phong
    static int[] labOccupancy(int[][] bookings, int hours) {
        int[] diff = new int[hours + 1];
        for (int[] b : bookings) {
            diff[b[0]] += 1;
            diff[b[1]] -= 1;
        }
        int[] inLab = new int[hours];
        int running = 0;
        for (int h = 0; h < hours; h++) {
            running += diff[h];
            inLab[h] = running;
        }
        return inLab;
    }
    // #endregion

    // #region lc1109
    static int[] corpFlightBookings(int[][] bookings, int n) {
        int[] diff = new int[n + 1];
        for (int[] b : bookings) {
            diff[b[0] - 1] += b[2];
            diff[b[1]] -= b[2];
        }
        int[] ans = new int[n];
        int running = 0;
        for (int i = 0; i < n; i++) { running += diff[i]; ans[i] = running; }
        return ans;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] bookings = {{0, 3}, {1, 4}, {2, 6}, {5, 9}, {6, 10}, {6, 8}};
        int[] occ = labOccupancy(bookings, 10);
        System.out.println("in lab per hour = " + Arrays.toString(occ));
        int peak = 0, at = 0;
        for (int h = 0; h < occ.length; h++) if (occ[h] > peak) { peak = occ[h]; at = h; }
        System.out.println("peak = " + peak + " at hour index " + at + " (" + (7 + at) + ":00)");
        System.out.println("corpFlightBookings = " + Arrays.toString(corpFlightBookings(new int[][]{{1, 2, 10}, {2, 3, 20}, {2, 5, 25}}, 5)));
    }
}
