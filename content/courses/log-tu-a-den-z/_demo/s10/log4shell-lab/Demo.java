// Demo.java — vì sao Log4Shell (CVE-2021-44228) nguy hiểm: CHỈ CẦN GHI LOG một chuỗi do người dùng gửi.
// Chạy trong container --network none: không có máy chủ độc nào, chỉ một "tai nghe" ServerSocket trong chính tiến trình
// để chứng minh thư viện log TỰ MỞ KẾT NỐI ra ngoài. Không có payload, không tải mã.
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Demo {
    private static final Logger log = LogManager.getLogger(Demo.class);

    public static void main(String[] args) throws Exception {
        Thread tai = new Thread(() -> {
            try (ServerSocket ss = new ServerSocket(1389); Socket s = ss.accept(); InputStream in = s.getInputStream()) {
                byte[] b = new byte[256];
                int n = in.read(b);
                System.out.println(">>> tai nghe 127.0.0.1:1389 NHAN " + n + " byte tu " + s.getInetAddress().getHostAddress()
                        + " (goi LDAP bind dau tien: 0x" + String.format("%02x", b[0]) + ")");
            } catch (Exception e) {
                System.out.println(">>> tai nghe: " + e.getMessage());
            }
        });
        tai.setDaemon(true);
        tai.start();
        Thread.sleep(300);

        String ua = args[0];                       // giả như User-Agent do khách gửi lên
        log.info("login failed, user-agent={}", ua);
        Thread.sleep(1500);
    }
}
