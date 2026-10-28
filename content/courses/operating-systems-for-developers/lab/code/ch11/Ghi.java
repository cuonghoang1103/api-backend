import java.io.*;

// Ghi — 100 000 dòng vào một file: FileOutputStream trần (mỗi write() Java = một syscall) vs BufferedOutputStream (8 KiB).
public class Ghi {
    public static void main(String[] args) throws IOException {
        boolean buffered = args[0].equals("buffered");
        byte[] line = "order 1001 paid, amount 150000\n".getBytes();
        long t0 = System.nanoTime();
        OutputStream raw = new FileOutputStream(args[1]);
        try (OutputStream out = buffered ? new BufferedOutputStream(raw) : raw) {
            for (int i = 0; i < 100_000; i++) out.write(line);
        }
        System.out.printf("%-10s %6.1f ms%n", args[0], (System.nanoTime() - t0) / 1e6);
    }
}
