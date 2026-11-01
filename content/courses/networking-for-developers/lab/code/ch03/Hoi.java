// Hoi.java — looks up the same name 5 times, 1 second apart, with InetAddress (how every Java HTTP/JDBC library resolves names).
// The JVM has its OWN DNS cache: networkaddress.cache.ttl (30 s by default without a security manager) — so only lookup 1 goes to the network.
import java.net.InetAddress;

public class Hoi {
  public static void main(String[] a) throws Exception {
    for (int i = 1; i <= 5; i++) {
      long t = System.nanoTime();
      String ip = InetAddress.getByName(a[0]).getHostAddress();
      System.out.printf("java lookup %d: %s in %.1f ms%n", i, ip, (System.nanoTime() - t) / 1e6);
      Thread.sleep(1000);
    }
  }
}
