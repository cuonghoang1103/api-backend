import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

// HelloServer — máy chủ HTTP có sẵn trong JDK (không cần Spring), một luồng xử lý.
public class HelloServer {
    public static void main(String[] args) throws Exception {
        HttpServer s = HttpServer.create(new InetSocketAddress(3000), 128);
        s.createContext("/", ex -> {
            byte[] body = "hello\n".getBytes();
            ex.sendResponseHeaders(200, body.length);
            ex.getResponseBody().write(body);
            ex.close();
        });
        s.start();
    }
}
