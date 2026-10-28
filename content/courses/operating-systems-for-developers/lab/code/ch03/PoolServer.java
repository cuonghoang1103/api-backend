// PoolServer.java MODE [N] — máy chủ HTTP "một yêu cầu = một luồng" như Tomcat trong Spring Boot.
// Mỗi yêu cầu chờ 200 ms (giả lập gọi CSDL/API — luồng bị CHẶN, không làm gì). MODE: fixed N | virtual.
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.concurrent.*;

public class PoolServer {
    public static void main(String[] a) throws Exception {
        ExecutorService pool = a[0].equals("virtual")
            ? Executors.newVirtualThreadPerTaskExecutor()
            : Executors.newFixedThreadPool(Integer.parseInt(a[1]));
        HttpServer s = HttpServer.create(new InetSocketAddress(8081), 1000);
        s.createContext("/", ex -> {
            try { Thread.sleep(200); } catch (InterruptedException e) { }
            byte[] b = "ok\n".getBytes();
            ex.sendResponseHeaders(200, b.length);
            ex.getResponseBody().write(b);
            ex.close();
        });
        s.setExecutor(pool);
        s.start();
        System.out.println("PoolServer " + String.join(" ", a) + " on 8081, pid " + ProcessHandle.current().pid());
    }
}
