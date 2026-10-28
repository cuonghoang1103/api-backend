// Billing.java — ĐÃ SỬA (lời giải mẫu 17.3, sự cố 4: deadlock hai khoá).
// Lỗi: chuyển 0→1 khoá ví 0 rồi chờ ví 1, cùng lúc chuyển 1→0 khoá ví 1 rồi chờ ví 0 ⇒ vòng chờ (điều kiện Coffman thứ 4).
// Mỗi cặp kẹt chiếm vĩnh viễn 2 luồng của pool 16 ⇒ vài giây sau mọi request đều treo. jstack báo "Found one Java-level deadlock".
// Sửa: khoá theo THỨ TỰ CỐ ĐỊNH (ví id nhỏ trước) ⇒ không thể có vòng (bài 6.1).
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Billing {
    static final class Account { final int id; long balance = 1_000_000; Account(int id) { this.id = id; } }
    static final Account[] acc = new Account[4];

    static void transfer(Account from, Account to, long amount) throws InterruptedException {
        Account first = from.id < to.id ? from : to, second = from.id < to.id ? to : from;
        synchronized (first) {
            Thread.sleep(2);
            synchronized (second) {
                from.balance -= amount; to.balance += amount;
            }
        }
    }

    public static void main(String[] a) throws Exception {
        for (int i = 0; i < acc.length; i++) acc[i] = new Account(i);
        HttpServer s = HttpServer.create(new InetSocketAddress(3003), 128);
        s.setExecutor(Executors.newFixedThreadPool(16));
        s.createContext("/healthz", x -> { byte[] b = "ok\n".getBytes(); x.sendResponseHeaders(200, b.length); x.getResponseBody().write(b); x.close(); });
        s.createContext("/total", x -> {
            long t = 0; for (Account ac : acc) synchronized (ac) { t += ac.balance; }
            byte[] b = (t + "\n").getBytes(); x.sendResponseHeaders(200, b.length); x.getResponseBody().write(b); x.close();
        });
        s.createContext("/transfer", x -> {
            String q = x.getRequestURI().getQuery();
            int f = Integer.parseInt(q.replaceAll(".*from=(\\d+).*", "$1")), t = Integer.parseInt(q.replaceAll(".*to=(\\d+).*", "$1"));
            try { transfer(acc[f], acc[t], 1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            byte[] b = "done\n".getBytes(); x.sendResponseHeaders(200, b.length); x.getResponseBody().write(b); x.close();
        });
        s.start();
        System.out.println("billing listening on 3003");
    }
}
