import java.text.DateFormat;
import java.text.NumberFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

// Cùng một dòng mã, đổi JDK là đổi chữ in ra: JDK 9 chuyển dữ liệu locale mặc định sang CLDR (JEP 252).
public class DinhDang {
    public static void main(String[] args) {
        Locale vi = new Locale("vi", "VN");
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"), vi);
        c.set(2026, Calendar.NOVEMBER, 24, 10, 0, 0);
        DateFormat d = DateFormat.getDateInstance(DateFormat.FULL, vi);
        d.setTimeZone(c.getTimeZone());
        System.out.println("java " + System.getProperty("java.version"));
        System.out.println("  tien : " + NumberFormat.getCurrencyInstance(vi).format(18000));
        System.out.println("  ngay : " + d.format(c.getTime()));
        System.out.println("  so   : " + NumberFormat.getInstance(vi).format(1234567.5));
    }
}
