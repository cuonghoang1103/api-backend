// Res.java — đọc data/Config.properties trong khi file thật tên data/config.properties (Chương 14, bài 14.8).
// Mac (APFS) và Windows (NTFS) mặc định KHÔNG phân biệt hoa thường ⇒ chạy được. Linux (ext4, trong Docker, trên VPS) ⇒ hỏng.
import java.nio.file.*;

public class Res {
  public static void main(String[] a) throws Exception {
    System.out.println(Files.readString(Path.of("data", "Config.properties")).trim());
  }
}
