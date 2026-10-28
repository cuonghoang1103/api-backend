// Transfer.java — cùng hai lệnh chuyển tiền ngược chiều, viết bằng synchronized của Java.
//   java Transfer.java naive     ⇒ treo; xem bằng jstack <pid>
//   java Transfer.java watchdog  ⇒ treo, nhưng một luồng canh gọi ThreadMXBean.findDeadlockedThreads() và báo
//   java Transfer.java trylock   ⇒ ReentrantLock.tryLock(10 ms) + lùi ngẫu nhiên: không treo
import java.lang.management.ManagementFactory;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class Transfer {
    static class Account {
        final String name; long balance = 1_000; final ReentrantLock lock = new ReentrantLock();
        Account(String n) { name = n; }
    }
    static final Account A = new Account("A"), B = new Account("B");
    static final int N = 20_000;

    static void naive(Account from, Account to) throws InterruptedException {
        synchronized (from) {
            Thread.sleep(0, 1000);            // đủ để luồng kia chen vào giữa hai lần khoá
            synchronized (to) { from.balance--; to.balance++; }
        }
    }

    static long trylock(Account from, Account to) throws InterruptedException {
        long retries = 0;
        while (true) {
            from.lock.lock();
            try {
                if (to.lock.tryLock(10, TimeUnit.MILLISECONDS)) {
                    try { from.balance--; to.balance++; return retries; } finally { to.lock.unlock(); }
                }
            } finally { from.lock.unlock(); }
            retries++;
            Thread.sleep(0, ThreadLocalRandom.current().nextInt(1_000_000));   // lùi ngẫu nhiên 0–1 ms
        }
    }

    public static void main(String[] args) throws Exception {
        String mode = args.length > 0 ? args[0] : "naive";
        System.out.println("pid " + ProcessHandle.current().pid() + ", mode " + mode);
        long[] retries = new long[2];
        Thread t1 = new Thread(() -> run(mode, A, B, retries, 0), "transfer-A-to-B");
        Thread t2 = new Thread(() -> run(mode, B, A, retries, 1), "transfer-B-to-A");
        long t0 = System.nanoTime();
        t1.start(); t2.start();
        if (mode.equals("watchdog")) {
            var mx = ManagementFactory.getThreadMXBean();
            while (true) {
                Thread.sleep(500);
                long[] ids = mx.findDeadlockedThreads();
                if (ids != null) {
                    for (var info : mx.getThreadInfo(ids))
                        System.out.println("DEADLOCK: " + info.getThreadName() + " waits for " + info.getLockName()
                                + " held by " + info.getLockOwnerName());
                    System.exit(2);                // trong dịch vụ thật: báo động + để orchestrator khởi động lại
                }
            }
        }
        t1.join(); t2.join();
        System.out.printf("done in %.2f s: A=%d B=%d, timed-out waits %d%n",
                (System.nanoTime() - t0) / 1e9, A.balance, B.balance, retries[0] + retries[1]);
    }

    static void run(String mode, Account from, Account to, long[] retries, int slot) {
        try {
            for (int i = 0; i < N; i++) {
                if (mode.equals("trylock")) retries[slot] += trylock(from, to); else naive(from, to);
            }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
