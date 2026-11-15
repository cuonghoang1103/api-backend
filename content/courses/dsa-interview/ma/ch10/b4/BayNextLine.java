// @bo-qua  (run by oa-mau.ts with a real input file)
import java.util.Scanner;

// Java — the classic Scanner trap: nextInt() then nextLine(). Input: an age on line 1, a full name on line 2.
public class BayNextLine {
    // #region bay
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        String name = sc.nextLine();            // reads the REST of line 1, which is ""
        System.out.println("wrong: age=" + age + " name=\"" + name + "\"");
    }
    // #endregion
}
