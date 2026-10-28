// Race.java — hai luồng Java cùng count++ một triệu lần, không đồng bộ.
public class Race {
    static int count = 0;

    public static void main(String[] args) throws Exception {
        Runnable job = () -> { for (int i = 0; i < 1_000_000; i++) count++; };
        Thread a = new Thread(job), b = new Thread(job);
        a.start(); b.start();
        a.join();  b.join();
        System.out.println("expected=2000000 got=" + count + " lost=" + (2_000_000 - count));
    }
}
