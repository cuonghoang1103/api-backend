import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/**
 * CuongThai Code Lab — reflection helpers used by the grader's test classes (cham/).
 * They look at YOUR classes the way a reviewer does (are the fields private? is the class abstract? which interface
 * does it implement?) and call your methods by name, so a missing method is reported instead of breaking compilation.
 * CSD201 adds structure checks: it follows YOUR head/next/prev/left/right fields node by node (so a list that only
 * prints right but is linked wrong is caught), and a time limit for the complexity checks.
 * Do not edit. Lớp hỗ trợ của máy chấm — đừng sửa.
 */
public final class Kiem {

    private Kiem() {
    }

    /** The class with this name, or null. */
    public static Class<?> lop(String name) {
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException e) {
            return null;
        }
    }

    /** "fields of Book: id private, title private" — every declared non-static field with its access. */
    public static String truong(String cls) {
        Class<?> k = lop(cls);
        if (k == null) {
            return "class " + cls + " MISSING";
        }
        List<String> parts = new ArrayList<>();
        for (Field f : k.getDeclaredFields()) {
            if (Modifier.isStatic(f.getModifiers()) || f.isSynthetic()) {
                continue;
            }
            int m = f.getModifiers();
            String access = Modifier.isPrivate(m) ? "private" : Modifier.isProtected(m) ? "protected"
                    : Modifier.isPublic(m) ? "public" : "package-private";
            parts.add(f.getName() + " " + access + (Modifier.isFinal(m) ? " final" : ""));
        }
        Collections.sort(parts);
        return "fields of " + cls + ": " + (parts.isEmpty() ? "(none)" : String.join(", ", parts));
    }

    /** "Clock: every field private (constants excepted) = true" — without naming the fields (names are yours). */
    public static String tatCaPrivate(String cls) {
        Class<?> k = lop(cls);
        if (k == null) {
            return "class " + cls + " MISSING";
        }
        boolean ok = true;
        int n = 0;
        for (Field f : k.getDeclaredFields()) {
            if (f.isSynthetic()) {
                continue;
            }
            int m = f.getModifiers();
            n++;
            if (!Modifier.isPrivate(m) && !(Modifier.isStatic(m) && Modifier.isFinal(m))) {
                ok = false;
            }
        }
        return cls + ": every field private (constants excepted) = " + ok + (n == 0 ? " (no field at all!)" : "");
    }

    /** "Shape: abstract class" / "Movable: interface" / "Circle: class extends Shape implements Movable". */
    public static String kieu(String cls) {
        Class<?> k = lop(cls);
        if (k == null) {
            return "class " + cls + " MISSING";
        }
        StringBuilder sb = new StringBuilder(cls + ": ");
        if (k.isInterface()) {
            sb.append("interface");
        } else if (k.isEnum()) {
            sb.append("enum");
        } else {
            sb.append(Modifier.isAbstract(k.getModifiers()) ? "abstract class" : "class");
            if (k.getSuperclass() != null && k.getSuperclass() != Object.class && k.getSuperclass() != Enum.class) {
                sb.append(" extends ").append(k.getSuperclass().getSimpleName());
            }
        }
        List<String> ifs = new ArrayList<>();
        for (Class<?> i : k.getInterfaces()) {
            ifs.add(i.getSimpleName());
        }
        Collections.sort(ifs);
        if (!ifs.isEmpty()) {
            sb.append(k.isInterface() ? " extends " : " implements ").append(String.join(", ", ifs));
        }
        return sb.toString();
    }

    /** "Book.getTitle(): public String" or "Book.getTitle(): MISSING" — looks at methods declared in that class. */
    public static String phuongThuc(String cls, String name, int argc) {
        Class<?> k = lop(cls);
        if (k == null) {
            return "class " + cls + " MISSING";
        }
        for (Method m : k.getDeclaredMethods()) {
            if (m.getName().equals(name) && m.getParameterCount() == argc) {
                int md = m.getModifiers();
                return cls + "." + name + "/" + argc + ": " + (Modifier.isPublic(md) ? "public" : Modifier.isPrivate(md) ? "private" : Modifier.isProtected(md) ? "protected" : "package-private")
                        + (Modifier.isStatic(md) ? " static" : "") + (Modifier.isAbstract(md) ? " abstract" : "") + " " + m.getReturnType().getSimpleName();
            }
        }
        return cls + "." + name + "/" + argc + ": MISSING";
    }

    /** Creates an object with the public constructor that takes these arguments; null when there is none. */
    public static Object tao(String cls, Object... args) {
        Class<?> k = lop(cls);
        if (k == null) {
            System.out.println("  ! class " + cls + " MISSING");
            return null;
        }
        for (Constructor<?> c : k.getConstructors()) {
            if (khop(c.getParameterTypes(), args)) {
                try {
                    return c.newInstance(args);
                } catch (InvocationTargetException e) {
                    System.out.println("  ! new " + cls + Arrays.toString(args) + " threw " + ten(e.getCause()));
                    return null;
                } catch (ReflectiveOperationException e) {
                    System.out.println("  ! new " + cls + " failed: " + e);
                    return null;
                }
            }
        }
        System.out.println("  ! no public constructor " + cls + "(" + args.length + " args) matching " + Arrays.toString(args));
        return null;
    }

    /** Calls a public method by name; returns its result as text, "MISSING …" or "THROWS ExceptionName: message". */
    public static String goi(Object o, String name, Object... args) {
        if (o == null) {
            return "(no object)";
        }
        Object r = goiObj(o, name, args);
        return r instanceof Loi ? r.toString() : String.valueOf(r);
    }

    /** Like goi but keeps the raw result (an object, a number…); a failure is returned as a Loi. */
    public static Object goiObj(Object o, String name, Object... args) {
        Class<?> k = (o instanceof Class) ? (Class<?>) o : o.getClass();
        Object target = (o instanceof Class) ? null : o;
        for (Method m : k.getMethods()) {
            if (m.getName().equals(name) && khop(m.getParameterTypes(), args)) {
                try {
                    m.setAccessible(true);
                    return m.invoke(target, args);
                } catch (InvocationTargetException e) {
                    return new Loi("THROWS " + ten(e.getCause()));
                } catch (ReflectiveOperationException e) {
                    return new Loi("CALL FAILED " + e);
                }
            }
        }
        return new Loi("MISSING " + k.getSimpleName() + "." + name + "(" + args.length + " args)");
    }

    /** Short name + message of an exception: "IllegalArgumentException: price must be >= 0". */
    public static String ten(Throwable t) {
        return t == null ? "null" : t.getClass().getSimpleName() + (t.getMessage() == null ? "" : ": " + t.getMessage());
    }

    private static boolean khop(Class<?>[] types, Object[] args) {
        if (types.length != args.length) {
            return false;
        }
        for (int i = 0; i < types.length; i++) {
            Class<?> t = boc(types[i]);
            if (args[i] != null && !t.isInstance(args[i])) {
                return false;
            }
            if (args[i] == null && types[i].isPrimitive()) {
                return false;
            }
        }
        return true;
    }

    private static Class<?> boc(Class<?> t) {
        if (!t.isPrimitive()) {
            return t;
        }
        if (t == int.class) {
            return Integer.class;
        }
        if (t == double.class) {
            return Double.class;
        }
        if (t == long.class) {
            return Long.class;
        }
        if (t == boolean.class) {
            return Boolean.class;
        }
        if (t == char.class) {
            return Character.class;
        }
        if (t == float.class) {
            return Float.class;
        }
        if (t == short.class) {
            return Short.class;
        }
        return Byte.class;
    }

    // ───────────── CSD201: data-structure checks (follow the real links) ─────────────

    private static final Object KHONG = new Object();

    /** The value of a field (any access, inherited too); KHONG when there is no such field. */
    private static Object doc(Object o, String field) {
        if (o == null) {
            return null;
        }
        for (Class<?> k = o.getClass(); k != null; k = k.getSuperclass()) {
            try {
                Field f = k.getDeclaredField(field);
                f.setAccessible(true);
                return f.get(o);
            } catch (NoSuchFieldException e) {
                // look in the parent class
            } catch (IllegalAccessException e) {
                return KHONG;
            }
        }
        return KHONG;
    }

    /** Field value for the test classes (null when missing). */
    public static Object lay(Object o, String field) {
        Object v = doc(o, field);
        return v == KHONG ? null : v;
    }

    private static String chu(Object info) {
        return String.valueOf(info);
    }

    /**
     * Walks first, first.next, … printing each info: "A B C". A cycle prints "A B C ↺(back to A)" and stops; more than
     * max nodes prints "… (more than max)". A node without the field prints "(no field next)".
     */
    public static String chuoi(Object first, String next, String info, int max) {
        StringBuilder sb = new StringBuilder();
        Map<Object, Boolean> seen = new IdentityHashMap<>();
        Object p = first;
        int n = 0;
        while (p != null) {
            if (seen.containsKey(p)) {
                return sb.append("CYCLE back to ").append(chu(doc(p, info))).toString().trim();
            }
            if (n++ >= max) {
                return sb.append("... (more than ").append(max).append(" nodes)").toString();
            }
            seen.put(p, Boolean.TRUE);
            Object v = doc(p, info);
            if (v == KHONG) {
                return sb.append("(node has no field ").append(info).append(")").toString();
            }
            sb.append(chu(v)).append(' ');
            Object q = doc(p, next);
            if (q == KHONG) {
                return sb.append("(node has no field ").append(next).append(")").toString();
            }
            p = q;
        }
        return sb.length() == 0 ? "(empty)" : sb.toString().trim();
    }

    /** Forward walk of a list object from its head field: "A B C" / "(empty)". */
    public static String xuoi(Object list, String head, String next, String info) {
        return chuoi(doc(list, head) == KHONG ? null : doc(list, head), next, info, 100000);
    }

    /**
     * A circular list walked from `start` (head or tail.next…) until it comes back: "A B C" when it closes on start,
     * "NOT CIRCULAR: A B C then null", or "(empty)".
     */
    public static String vong(Object start, String next, String info, int max) {
        if (start == null) {
            return "(empty)";
        }
        StringBuilder sb = new StringBuilder();
        Map<Object, Boolean> seen = new IdentityHashMap<>();
        Object p = start;
        for (int n = 0; n <= max; n++) {
            seen.put(p, Boolean.TRUE);
            sb.append(chu(doc(p, info))).append(' ');
            Object q = doc(p, next);
            if (q == null || q == KHONG) {
                return "NOT CIRCULAR: " + sb.toString().trim() + " then null";
            }
            if (q == start) {
                return sb.toString().trim();
            }
            if (seen.containsKey(q)) {
                return "BROKEN RING: " + sb.toString().trim() + " then back to " + chu(doc(q, info)) + " (not to the start)";
            }
            p = q;
        }
        return "... (more than " + max + " nodes)";
    }

    /**
     * Checks a doubly linked list both ways: head.prev == null, every p.next.prev == p, tail is the last node,
     * tail.next == null. Returns "links OK" or the first broken link.
     */
    public static String kep(Object list, String head, String tail, String next, String prev, String info) {
        Object h = lay(list, head), t = lay(list, tail);
        if (h == null || t == null) {
            return h == null && t == null ? "links OK (empty)" : "BROKEN: " + (h == null ? head + " is null but " + tail + " is not" : tail + " is null but " + head + " is not");
        }
        if (lay(h, prev) != null) {
            return "BROKEN: " + head + "." + prev + " should be null";
        }
        Map<Object, Boolean> seen = new IdentityHashMap<>();
        Object p = h;
        while (true) {
            if (seen.containsKey(p)) {
                return "BROKEN: cycle at " + chu(lay(p, info));
            }
            seen.put(p, Boolean.TRUE);
            Object q = lay(p, next);
            if (q == null) {
                return p == t ? "links OK" : "BROKEN: the last node is " + chu(lay(p, info)) + " but " + tail + " is " + chu(lay(t, info));
            }
            if (lay(q, prev) != p) {
                return "BROKEN: " + chu(lay(q, info)) + "." + prev + " does not point back to " + chu(lay(p, info));
            }
            p = q;
        }
    }

    /**
     * A singly linked list with head and tail: "[A B C] tail ok", or "[A B C] tail WRONG (B)" when the tail field is not the
     * real last node (the walk follows next from head).
     */
    public static String don(Object list, String head, String tail, String next, String info) {
        String w = xuoi(list, head, next, info);
        if (w.contains("CYCLE") || w.startsWith("...") || w.contains("(node has no field")) {
            return "[" + w + "]";
        }
        Object last = null;
        for (Object p = lay(list, head); p != null; p = lay(p, next)) {
            last = p;
        }
        Object t = lay(list, tail);
        return "[" + w + "] " + (last == t ? "tail ok" : "tail WRONG (" + (t == null ? "null" : chu(lay(t, info))) + ")");
    }


    /** Backward walk from the tail field: "C B A". */
    public static String nguoc(Object list, String tail, String prev, String info) {
        return chuoi(lay(list, tail), prev, info, 100000);
    }

    /** Number of nodes reachable from first (stops at 10^7 or a cycle: -1). */
    public static int dem(Object first, String next) {
        Map<Object, Boolean> seen = new IdentityHashMap<>();
        int n = 0;
        for (Object p = first; p != null; p = lay(p, next)) {
            if (seen.put(p, Boolean.TRUE) != null || n > 10000000) {
                return -1;
            }
            n++;
        }
        return n;
    }

    /**
     * The SHAPE of a binary tree, from the real left/right links: "B(A,C)", "-" for an empty subtree, a leaf as "A".
     * "D(B(A,-),F)" means: D has left child B (whose left child is A) and right child F.
     */
    public static String cay(Object root, String left, String right, String info) {
        StringBuilder sb = new StringBuilder();
        cay(root, left, right, info, sb, new IdentityHashMap<Object, Boolean>(), 0);
        return sb.length() == 0 ? "(empty)" : sb.toString();
    }

    private static void cay(Object p, String l, String r, String info, StringBuilder sb, Map<Object, Boolean> seen, int depth) {
        if (p == null) {
            sb.append('-');
            return;
        }
        if (seen.put(p, Boolean.TRUE) != null || depth > 5000) {
            sb.append("CYCLE");
            return;
        }
        sb.append(chu(lay(p, info)));
        Object a = lay(p, l), b = lay(p, r);
        if (a != null || b != null) {
            sb.append('(');
            cay(a, l, r, info, sb, seen, depth + 1);
            sb.append(',');
            cay(b, l, r, info, sb, seen, depth + 1);
            sb.append(')');
        }
    }

    /** Height of a binary tree by its real links (empty = -1, one node = 0), iterative-safe for deep trees. */
    public static int cao(Object root, String left, String right) {
        if (root == null) {
            return -1;
        }
        List<Object> level = new ArrayList<>();
        level.add(root);
        int h = -1;
        while (!level.isEmpty() && h < 10000000) {
            h++;
            List<Object> nextLevel = new ArrayList<>();
            for (Object p : level) {
                Object a = lay(p, left), b = lay(p, right);
                if (a != null) {
                    nextLevel.add(a);
                }
                if (b != null) {
                    nextLevel.add(b);
                }
            }
            level = nextLevel;
        }
        return h;
    }

    /**
     * Complexity check: runs the task on a daemon thread and waits at most ms milliseconds. Returns "label: OK" or
     * "label: TOO SLOW - not finished after ms ms" (the thread is abandoned, the JVM still exits) or "label: THROWS …".
     */
    public static String hen(String label, long ms, final Runnable task) {
        final Throwable[] err = new Throwable[1];
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    task.run();
                } catch (Throwable e) {
                    err[0] = e;
                }
            }
        }, "complexity-check");
        t.setDaemon(true);
        t.start();
        try {
            t.join(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        if (t.isAlive()) {
            return label + ": TOO SLOW - not finished after " + ms + " ms (the efficient algorithm needs well under a tenth of that)";
        }
        if (err[0] != null) {
            return label + ": THROWS " + ten(err[0]);
        }
        return label + ": OK";
    }

    /** Deterministic pseudo-random numbers for big inputs (same on every machine). */
    public static int[] ngauNhien(int n, int bound, long seed) {
        int[] a = new int[n];
        long x = seed;
        for (int i = 0; i < n; i++) {
            x = (x * 6364136223846793005L + 1442695040888963407L);
            a[i] = (int) ((x >>> 33) % bound);
        }
        return a;
    }

    /** A failed call, printed as its message. */
    public static final class Loi {
        private final String text;

        Loi(String text) {
            this.text = text;
        }

        @Override
        public String toString() {
            return text;
        }
    }
}
