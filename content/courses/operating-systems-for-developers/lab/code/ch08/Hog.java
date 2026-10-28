// Hog.java — giữ các mảng 1 MB cho tới khi có chuyện (Chương 8).
//   java [-Xmx… | -XX:MaxRAMPercentage=…] Hog
// Heap đầy trước ⇒ java.lang.OutOfMemoryError (exit 1, có stack trace). Container đầy trước ⇒ SIGKILL (exit 137, im lặng).
import java.util.ArrayList;
import java.util.List;

public class Hog {
  public static void main(String[] a) {
    long max = Runtime.getRuntime().maxMemory() >> 20;
    System.out.println("max heap " + max + " MB");
    List<byte[]> keep = new ArrayList<>();
    for (int i = 1; ; i++) {
      byte[] b = new byte[1 << 20];
      for (int k = 0; k < b.length; k += 4096) b[k] = 1;   // chạm mọi trang
      keep.add(b);
      if (i % 32 == 0) { System.out.println("holding " + i + " MB"); System.out.flush(); }
    }
  }
}
