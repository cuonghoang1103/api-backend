// Cross.java — cùng câu hỏi, từ Java (Chương 14, bài 14.8). Chạy thẳng: java Cross.java (JDK 11+).
import java.io.File;
import java.nio.file.*;

public class Cross {
  public static void main(String[] a) throws Exception {
    System.out.println("os.name " + System.getProperty("os.name") + " | File.separator \"" + File.separator
        + "\" | File.pathSeparator \"" + File.pathSeparator + "\" | lineSeparator "
        + System.lineSeparator().replace("\r", "\\r").replace("\n", "\\n"));
    System.out.println("Path.of(\"src\",\"config\",\"app.json\") = " + Path.of("src", "config", "app.json"));
    System.out.println("\"src\" + \"\\\\\" + \"app.json\" exists as one name: " + Path.of("src\\app.json").getNameCount() + " name element(s)");
  }
}
