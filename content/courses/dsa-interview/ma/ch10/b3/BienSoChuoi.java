// Edge cases for NUMBERS and STRINGS in Java — the same questions as bien-so-chuoi.ts, different answers.
public class BienSoChuoi {
    static void show(String label, Object value) { System.out.println(String.format("%-34s %s", label, value)); }

    public static void main(String[] args) {
        // #region bien
        show("\"😀\".length()", "😀".length());                                   // UTF-16, like JS: 2
        show("\"😀\".codePointCount(0, 2)", "😀".codePointCount(0, 2));          // 1
        show("Integer.MAX_VALUE + 1", Integer.MAX_VALUE + 1);                     // silent overflow
        show("Math.abs(Integer.MIN_VALUE)", Math.abs(Integer.MIN_VALUE));         // still negative!
        show("(long) Integer.MAX_VALUE + 1", (long) Integer.MAX_VALUE + 1);       // widen BEFORE adding
        show("-7 / 2", -7 / 2);                                                   // truncates toward 0
        show("-7 % 2", -7 % 2);
        show("Math.floorMod(-7, 2)", Math.floorMod(-7, 2));                       // the "math" remainder
        show("7.0 / 0", 7.0 / 0);                                                 // double: Infinity
        show("0.1 + 0.2 == 0.3", 0.1 + 0.2 == 0.3);
        try {
            show("7 / 0", 7 / zero());
        } catch (ArithmeticException e) {
            show("7 / 0", "ArithmeticException: " + e.getMessage());               // int: exception
        }
        // #endregion
    }
    static int zero() { return 0; }
}
