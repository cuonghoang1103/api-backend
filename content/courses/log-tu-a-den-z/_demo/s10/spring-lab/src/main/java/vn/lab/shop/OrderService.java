package vn.lab.shop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    public String load(long id) {
        log.debug("cache miss for order {}", id);
        try {
            return PriceRepository.read(id);
        } catch (IllegalStateException e) {
            throw new OrderLoadException("cannot load order " + id, e);   // bọc lỗi gốc ⇒ chuỗi "Caused by"
        }
    }

    static class OrderLoadException extends RuntimeException {
        OrderLoadException(String msg, Throwable cause) { super(msg, cause); }
    }
}

class PriceRepository {
    static String read(long id) {
        try {
            if (id == 13) Integer.parseInt("13.5");                  // dữ liệu bẩn trong bảng giá
            return "{\"id\":" + id + ",\"total\":120000}";
        } catch (NumberFormatException e) {
            throw new IllegalStateException("bad price row for order " + id, e);
        }
    }
}
