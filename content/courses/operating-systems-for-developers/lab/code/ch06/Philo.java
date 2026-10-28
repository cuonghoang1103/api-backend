// Philo.java — 5 triết gia bằng Java. Đũa = ReentrantLock.
//   java Philo.java naive     trái rồi phải ⇒ deadlock; luồng canh hỏi ThreadMXBean.findDeadlockedThreads()
//   java Philo.java ordered   đũa số nhỏ trước
//   java Philo.java waiter    Semaphore(4): tối đa 4 người ngồi vào bàn
import java.lang.management.ManagementFactory;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicLongArray;
import java.util.concurrent.locks.ReentrantLock;

public class Philo {
    static final int N = 5;
    static final ReentrantLock[] forks = new ReentrantLock[N];
    static final Semaphore seats = new Semaphore(N - 1);
    static final AtomicLongArray meals = new AtomicLongArray(N);
    static volatile boolean stop;

    public static void main(String[] args) throws Exception {
        String mode = args.length > 0 ? args[0] : "naive";
        for (int i = 0; i < N; i++) forks[i] = new ReentrantLock();
        Thread[] t = new Thread[N];
        for (int i = 0; i < N; i++) {
            final int me = i;
            t[i] = new Thread(() -> dine(me, mode), "philosopher-" + i);
            t[i].start();
        }
        var mx = ManagementFactory.getThreadMXBean();
        for (int tick = 0; tick < 20; tick++) {             // 2 giây
            Thread.sleep(100);
            long[] ids = mx.findDeadlockedThreads();
            if (ids != null) {
                System.out.println(mode + ": deadlock detected, " + ids.length + " threads in the cycle:");
                for (var info : mx.getThreadInfo(ids))
                    System.out.println("  " + info.getThreadName() + " waits for a fork held by " + info.getLockOwnerName());
                System.exit(3);
            }
        }
        stop = true;
        for (Thread x : t) x.join();
        StringBuilder sb = new StringBuilder();
        long total = 0;
        for (int i = 0; i < N; i++) { sb.append(' ').append(meals.get(i)); total += meals.get(i); }
        System.out.println(mode + ": " + total + " meals in 2 s; per philosopher:" + sb);
    }

    static void dine(int me, String mode) {
        int left = me, right = (me + 1) % N;
        int first = mode.equals("ordered") ? Math.min(left, right) : left;
        int second = mode.equals("ordered") ? Math.max(left, right) : right;
        try {
            while (!stop) {
                if (mode.equals("waiter")) seats.acquire();
                forks[first].lock();
                try {
                    Thread.sleep(0, 100_000);                 // khe hở giữa hai chiếc đũa
                    forks[second].lock();
                    try { meals.incrementAndGet(me); } finally { forks[second].unlock(); }
                } finally {
                    forks[first].unlock();
                    if (mode.equals("waiter")) seats.release();
                }
            }
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
