// The bitwise operators on small numbers, printed in binary (same output as bit-co-ban.ts).
public class BitCoBan {
    static String b8(int x) { String s = Integer.toBinaryString(x & 0xff); return "0".repeat(8 - s.length()) + s; }
    static String b32(int x) { String s = Integer.toBinaryString(x); return "0".repeat(32 - s.length()) + s; }

    public static void main(String[] args) {
        // #region toan-tu
        int a = 12, b = 10;                          // 00001100 and 00001010
        System.out.println("a      = " + b8(a) + " " + a);
        System.out.println("b      = " + b8(b) + " " + b);
        System.out.println("a & b  = " + b8(a & b) + " " + (a & b));
        System.out.println("a | b  = " + b8(a | b) + " " + (a | b));
        System.out.println("a ^ b  = " + b8(a ^ b) + " " + (a ^ b));
        System.out.println("~a     = " + b8(~a) + " " + (~a));
        System.out.println("a << 2 = " + b8(a << 2) + " " + (a << 2));
        System.out.println("a >> 2 = " + b8(a >> 2) + " " + (a >> 2));
        // #endregion

        // #region am
        System.out.println("12 (32 bits) = " + b32(12));
        System.out.println("-12 (32 bits) = " + b32(-12));
        System.out.println("-7 >> 1 = " + (-7 >> 1));
        System.out.println("-7 / 2 (truncated) = " + (-7 / 2));
        System.out.println("-1 >>> 28 = " + (-1 >>> 28));
        System.out.println("1 << 10 = " + (1 << 10));
        System.out.println("7 & 1 = " + (7 & 1) + "  8 & 1 = " + (8 & 1));
        // #endregion

        // #region meo
        int x = 52;                                  // 00110100
        System.out.println("x            = " + b8(x) + " " + x);
        System.out.println("x & 1        = " + (x & 1));
        System.out.println("(x >> 2) & 1 = " + ((x >> 2) & 1));
        System.out.println("x | (1 << 0) = " + b8(x | (1 << 0)) + " " + (x | (1 << 0)));
        System.out.println("x & ~(1 << 2)= " + b8(x & ~(1 << 2)) + " " + (x & ~(1 << 2)));
        System.out.println("x ^ (1 << 5) = " + b8(x ^ (1 << 5)) + " " + (x ^ (1 << 5)));
        System.out.println("x & (x - 1)  = " + b8(x & (x - 1)) + " " + (x & (x - 1)));
        System.out.println("x & -x       = " + b8(x & -x) + " " + (x & -x));
        // #endregion
    }
}
