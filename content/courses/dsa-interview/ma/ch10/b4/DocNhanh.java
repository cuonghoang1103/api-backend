// @bo-qua  (reads stdin; run by oa-mau.ts / oa-do.ts with real input files)
import java.io.DataInputStream;
import java.io.IOException;

// Java — a hand-written byte reader: read 64 KB blocks, build each number digit by digit. Fastest of all.
public class DocNhanh {
    // #region khuon
    static final DataInputStream in = new DataInputStream(System.in);
    static final byte[] buf = new byte[1 << 16];
    static int len = 0, ptr = 0;

    static int readByte() throws IOException {
        if (ptr == len) {                      // buffer empty: refill
            len = in.read(buf, 0, buf.length);
            ptr = 0;
            if (len <= 0) return -1;           // end of input
        }
        return buf[ptr++];
    }

    static long nextLong() throws IOException {
        int c = readByte();
        while (c != '-' && (c < '0' || c > '9')) c = readByte();   // skip spaces, \r, \n
        boolean neg = c == '-';
        if (neg) c = readByte();
        long x = 0;
        while (c >= '0' && c <= '9') {
            x = x * 10 + (c - '0');
            c = readByte();
        }
        return neg ? -x : x;
    }

    public static void main(String[] args) throws IOException {
        int n = (int) nextLong();
        long sum = 0;
        long max = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = nextLong();
            sum += x;
            if (x > max) max = x;
        }
        System.out.println("sum=" + sum + " max=" + max);
    }
    // #endregion
}
