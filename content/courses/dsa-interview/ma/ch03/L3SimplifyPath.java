import java.util.*;

public class L3SimplifyPath {
    // #region giai
    static String simplifyPath(String path) {
        Deque<String> st = new ArrayDeque<>();
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) continue;
            if (part.equals("..")) { if (!st.isEmpty()) st.pollLast(); }
            else st.offerLast(part);                       // use the deque from the LEFT end so joining keeps order
        }
        return "/" + String.join("/", st);
    }
    // #endregion

    public static void main(String[] args) {
        for (String p : new String[]{"/home/", "/home//foo/", "/a/./b/../../c/", "/../", "/.../a/../b", "/uploads/../../etc/passwd"})
            System.out.println(p + " -> " + simplifyPath(p));
    }
}
