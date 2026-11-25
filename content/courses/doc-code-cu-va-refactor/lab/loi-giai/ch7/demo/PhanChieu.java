import java.lang.reflect.Field;
import java.util.ArrayList;

// Kiểu mã mà thư viện cũ (Gson 2.8, XStream, Kryo, Hibernate 4…) hay làm: đọc trường private của lớp JDK.
public class PhanChieu {
    public static void main(String[] args) throws Exception {
        ArrayList<String> ds = new ArrayList<>();
        ds.add("Lap trinh Java");
        Field f = ArrayList.class.getDeclaredField("elementData");
        f.setAccessible(true);
        Object[] mang = (Object[]) f.get(ds);
        System.out.println("java " + System.getProperty("java.version") + ": suc chua mang ben trong = " + mang.length);
    }
}
