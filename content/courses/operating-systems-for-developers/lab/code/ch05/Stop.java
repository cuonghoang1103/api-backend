// Stop.java — một luồng quay vòng chờ cờ "stop"; main bật cờ sau 1 giây. Luồng kia có THẤY không?
//   java Stop.java plain      cờ thường        java Stop.java volatile   cờ volatile
public class Stop {
    static boolean stop;               // KHÔNG volatile
    static volatile boolean vstop;     // volatile: mọi lần đọc phải đọc bộ nhớ, ghi phải hiện ra cho luồng khác

    public static void main(String[] a) throws Exception {
        boolean useVolatile = a.length > 0 && a[0].equals("volatile");
        Thread spinner = new Thread(() -> {
            long n = 0;
            if (useVolatile) while (!vstop) n++;
            else while (!stop) n++;
            System.out.println("worker saw the flag after " + n + " spins");
        });
        spinner.start();
        Thread.sleep(1000);                 // đủ lâu để JIT kịp biên dịch vòng lặp nóng
        stop = true; vstop = true;
        System.out.println("main: flag set");
        spinner.join();
        System.out.println("main: worker stopped");
    }
}
