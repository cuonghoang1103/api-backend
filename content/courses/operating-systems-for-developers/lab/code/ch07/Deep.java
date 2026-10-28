public class Deep {                      // how deep can a Java thread recurse?
    static int depth = 0;
    static void dive() { depth++; dive(); }
    public static void main(String[] a) {
        try { dive(); } catch (StackOverflowError e) { System.out.println("StackOverflowError after " + depth + " calls"); }
    }
}
