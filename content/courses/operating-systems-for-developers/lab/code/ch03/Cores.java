// Cores.java — JVM nghĩ máy có bao nhiêu lõi (nó đọc cả cpuset lẫn CPU quota của cgroup).
public class Cores {
    public static void main(String[] a) {
        System.out.println("java: availableProcessors=" + Runtime.getRuntime().availableProcessors()
            + "  ForkJoin commonPool parallelism=" + java.util.concurrent.ForkJoinPool.commonPool().getParallelism());
    }
}
