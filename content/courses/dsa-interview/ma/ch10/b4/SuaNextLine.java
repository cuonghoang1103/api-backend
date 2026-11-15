// @bo-qua  (run by oa-mau.ts with a real input file)
import java.util.Scanner;

// Java — the fix: consume the end of line 1 before reading line 2.
public class SuaNextLine {
    // #region sua
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        sc.nextLine();                          // throw away the "\n" left after the number
        String name = sc.nextLine();
        System.out.println("fixed: age=" + age + " name=\"" + name + "\"");
    }
    // #endregion
}
