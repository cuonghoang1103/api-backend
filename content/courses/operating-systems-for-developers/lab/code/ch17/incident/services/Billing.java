// Billing.java — dịch vụ chuyển tiền giữa các ví (cổng 3003). Mỗi ví có một khoá để hai lệnh chuyển không giẫm nhau.
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Billing {
    static final class Account { final int id; long balance = 1_000_000; Account(int id) { this.id = id; } }
    static final Account[] acc = new Account[4];

    static void transfer(Account from, Account to, long amount) throws InterruptedException {
        synchronized (from) {                 // khoá ví nguồn …
            Thread.sleep(2);                  // (kiểm tra hạn mức, ghi nhật ký…)
            synchronized (to) {               // … rồi khoá ví đích
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
        s.createContext("/transfer", x -> {        // /transfer?from=0&to=1
            String q = x.getRequestURI().getQuery();
            int f = Integer.parseInt(q.replaceAll(".*from=(\\d+).*", "$1")), t = Integer.parseInt(q.replaceAll(".*to=(\\d+).*", "$1"));
            try { transfer(acc[f], acc[t], 1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            byte[] b = "done\n".getBytes(); x.sendResponseHeaders(200, b.length); x.getResponseBody().write(b); x.close();
        });
        s.start();
        System.out.println("billing listening on 3003");
    }
}
