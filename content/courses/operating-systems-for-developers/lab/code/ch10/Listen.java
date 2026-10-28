// Listen.java — mở một ServerSocket với backlog MẶC ĐỊNH rồi ngồi chờ (để ss đọc backlog thật).
import java.net.ServerSocket;
public class Listen {
    public static void main(String[] a) throws Exception {
        try (ServerSocket s = new ServerSocket(Integer.parseInt(a[0]))) { Thread.sleep(60_000); }
    }
}
