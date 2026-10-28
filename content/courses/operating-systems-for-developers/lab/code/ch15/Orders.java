// Orders.java — cùng dịch vụ báo cáo đơn hàng bằng Java 21 (bài 15.4). FIX=1 ⇒ HashSet.
//   java Orders.java [cổng]        (com.sun.net.httpserver + pool 4 luồng)
//   java -Dsun.net.httpserver.nodelay=true Orders.java   ⇒ bật TCP_NODELAY (header và body là HAI lần ghi — bài 15.4)
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.*;
import java.util.concurrent.Executors;

public class Orders {
  record Order(int id, String customer, long cents) {}
  static final boolean FIX = "1".equals(System.getenv("FIX"));
  static final List<Order> ORDERS = new ArrayList<>();
  static { for (int i = 0; i < 20000; i++) ORDERS.add(new Order(i, String.format("C-%05d", (i * 7919L) % 2500), 1000 + (i * 104729L) % 90000)); }

  static List<String> uniqueCustomers(List<Order> list) {
    if (FIX) { Set<String> s = new HashSet<>(); for (Order o : list) s.add(o.customer()); return new ArrayList<>(s); }
    List<String> seen = new ArrayList<>();             // ⚠ ArrayList.contains quét từ đầu ⇒ O(n²)
    for (Order o : list) if (!seen.contains(o.customer())) seen.add(o.customer());
    return seen;
  }
  static String money(long c) { return String.format("%.2f", c / 100.0); }
  static String report(int n) {
    List<Order> list = ORDERS.subList(0, n);
    List<String> customers = uniqueCustomers(list);
    Map<String, Long> t = new HashMap<>();
    long total = 0;
    for (Order o : list) { t.merge(o.customer(), o.cents(), Long::sum); total += o.cents(); }
    StringBuilder top = new StringBuilder();
    t.entrySet().stream().sorted((a, b) -> Long.compare(b.getValue(), a.getValue())).limit(5).forEach(e ->
        top.append(top.isEmpty() ? "" : ",").append("{\"customer\":\"").append(e.getKey()).append("\",\"total\":\"").append(money(e.getValue())).append("\"}"));
    return "{\"n\":" + n + ",\"customers\":" + customers.size() + ",\"total\":\"" + money(total) + "\",\"top\":[" + top + "]}";
  }

  public static void main(String[] a) throws Exception {
    int port = a.length > 0 ? Integer.parseInt(a[0]) : 8080;
    HttpServer s = HttpServer.create(new InetSocketAddress(port), 512);
    s.setExecutor(Executors.newFixedThreadPool(4));
    s.createContext("/report", ex -> {
      String q = ex.getRequestURI().getQuery();
      int n = q != null && q.startsWith("n=") ? Math.min(20000, Integer.parseInt(q.substring(2))) : 4000;
      byte[] b = report(n).getBytes();
      ex.getResponseHeaders().add("content-type", "application/json");
      ex.sendResponseHeaders(200, b.length);
      try (var os = ex.getResponseBody()) { os.write(b); }
    });
    s.start();
    System.out.println("Orders.java pid " + ProcessHandle.current().pid() + " on :" + port + (FIX ? " (FIX=1: HashSet)" : " (ArrayList.contains)"));
  }
}
