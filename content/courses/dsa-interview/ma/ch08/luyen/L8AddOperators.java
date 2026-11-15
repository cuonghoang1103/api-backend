import java.util.*;

// LC 282 · Expression Add Operators — long, not int: "2147483648" alone does not fit in an int.
public class L8AddOperators {
    // #region giai
    static List<String> addOperators(String num, int target) {
        List<String> res = new ArrayList<>();
        bt(num, target, 0, "", 0L, 0L, res);
        return res;
    }

    static void bt(String num, int target, int i, String expr, long value, long last, List<String> res) {
        if (i == num.length()) { if (value == target) res.add(expr); return; }
        for (int j = i; j < num.length(); j++) {
            if (j > i && num.charAt(i) == '0') break;
            String s = num.substring(i, j + 1);
            long x = Long.parseLong(s);
            if (i == 0) { bt(num, target, j + 1, s, x, x, res); continue; }
            bt(num, target, j + 1, expr + "+" + s, value + x, x, res);
            bt(num, target, j + 1, expr + "-" + s, value - x, -x, res);
            bt(num, target, j + 1, expr + "*" + s, value - last + last * x, last * x, res);
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(addOperators("123", 6));
        System.out.println(addOperators("232", 8));
        System.out.println(addOperators("105", 5));
        System.out.println(addOperators("00", 0));
        System.out.println(addOperators("3456237490", 9191));
        System.out.println(addOperators("2147483648", -2147483648));
    }
}
