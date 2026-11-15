import java.util.*;

public class BanRong {
    static List<String> f(int[] a) {
        List<String> r = new ArrayList<>();
        int x1 = a[0];
        int x2 = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] != x2 + 1) {
                if (x1 == x2) r.add("" + x1); else r.add(x1 + "->" + x2);
                x1 = a[i];
                x2 = a[i];
            } else {
                x2 = a[i];
            }
        }
        if (x1 == x2) r.add("" + x1); else r.add(x1 + "->" + x2);
        return r;
    }

    public static void main(String[] args) {
        // #region chay
        try {
            System.out.println("dirty f([]) = " + f(new int[0]));
        } catch (RuntimeException e) {
            System.out.println("dirty f([]) threw " + e);
        }
        // #endregion
    }
}
