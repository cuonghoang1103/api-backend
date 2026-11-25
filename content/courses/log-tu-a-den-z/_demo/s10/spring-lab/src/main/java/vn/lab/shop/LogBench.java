package vn.lab.shop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Đo cái giá của một dòng DEBUG KHÔNG được in (mức đang là INFO). Chạy: xem _demo/s10/spring-bench.sh */
public class LogBench {
    private static final Logger log = LoggerFactory.getLogger(LogBench.class);

    record Cart(long id, int[] items) {
        @Override public String toString() {          // toString "nặng": dựng chuỗi dài
            StringBuilder sb = new StringBuilder("Cart{id=" + id + ", items=[");
            for (int i : items) sb.append(i).append(',');
            return sb.append("]}").toString();
        }
    }

    public static void main(String[] args) {
        Cart cart = new Cart(42, new int[500]);
        int n = 200_000;
        for (int warm = 0; warm < 2; warm++) {          // vòng 0 để JIT nóng máy, chỉ in vòng 1
            long t0 = System.nanoTime();
            for (int i = 0; i < n; i++) log.debug("cart = " + cart);            // nối chuỗi: toString LUÔN chạy
            long t1 = System.nanoTime();
            for (int i = 0; i < n; i++) log.debug("cart = {}", cart);           // placeholder: chỉ chạy khi in
            long t2 = System.nanoTime();
            for (int i = 0; i < n; i++) if (log.isDebugEnabled()) log.debug("cart = {}", cart.toString());
            long t3 = System.nanoTime();
            if (warm == 1) {
                System.out.printf("debug(\"...\" + cart)        : %8.2f ms%n", (t1 - t0) / 1e6);
                System.out.printf("debug(\"... {}\", cart)       : %8.2f ms%n", (t2 - t1) / 1e6);
                System.out.printf("if (isDebugEnabled()) ...   : %8.2f ms%n", (t3 - t2) / 1e6);
            }
        }
    }
}
