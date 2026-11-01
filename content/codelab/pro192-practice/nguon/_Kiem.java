import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * CuongThai Code Lab — reflection helpers used by the grader's test classes (cham/).
 * They look at YOUR classes the way a reviewer does (are the fields private? is the class abstract? which interface
 * does it implement?) and call your methods by name, so a missing method is reported instead of breaking compilation.
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
