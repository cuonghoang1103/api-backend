import java.util.*;

// Trap: comparing two Integer values from a Map with == (reference comparison, not value comparison).
public class JavaIntegerBay {
    public static void main(String[] args) {
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 100);  m.put("b", 100);
        m.put("c", 1000); m.put("d", 1000);
        // #region bay
        System.out.println("100  == 100  : " + (m.get("a") == m.get("b")));       // cached Integer -> same object
        System.out.println("1000 == 1000 : " + (m.get("c") == m.get("d")));       // two different objects
        System.out.println("1000 equals  : " + m.get("c").equals(m.get("d")));    // value comparison
        // #endregion
        int x = m.get("c"), y = m.get("d");                                        // unboxed to int
        System.out.println("int  == int  : " + (x == y));
        try {
            int z = m.get("missing");                                              // unboxing null
            System.out.println(z);
        } catch (NullPointerException e) {
            System.out.println("int z = m.get(\"missing\") -> NullPointerException");
        }
    }
}
