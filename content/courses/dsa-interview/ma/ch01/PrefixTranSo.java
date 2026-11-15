// Java traps around prefix sums: int overflow and the sign of %.
public class PrefixTranSo {
    public static void main(String[] args) {
        // #region tran
        int[] nums = {2_000_000_000, 2_000_000_000, -1_000_000_000};
        int[] preInt = new int[nums.length + 1];
        long[] preLong = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            preInt[i + 1] = preInt[i] + nums[i];          // wraps around past 2^31 - 1
            preLong[i + 1] = preLong[i] + nums[i];        // widened to long before adding
        }
        // #endregion
        System.out.println("int  prefix = " + java.util.Arrays.toString(preInt));
        System.out.println("long prefix = " + java.util.Arrays.toString(preLong));
        System.out.println("sum(0..1) with int  = " + (preInt[2] - preInt[0]) + "   with long = " + (preLong[2] - preLong[0]));
        // #region exact
        try {
            System.out.println(Math.addExact(2_000_000_000, 2_000_000_000));
        } catch (ArithmeticException e) {
            System.out.println("Math.addExact(2e9, 2e9) -> ArithmeticException: " + e.getMessage());
        }
        // #endregion
        // #region mod
        System.out.println("-7 % 5               = " + (-7 % 5));
        System.out.println("Math.floorMod(-7, 5) = " + Math.floorMod(-7, 5));
        // #endregion
    }
}
