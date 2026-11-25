package vn.lab.shop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderService service;
    private final MailService mail;

    public OrderController(OrderService service, MailService mail) {
        this.service = service;
        this.mail = mail;
    }

    @GetMapping("/api/orders/{id}")
    public String order(@PathVariable long id) {
        log.info("load order id={}", id);
        return service.load(id);
    }

    /** Bản "đúng nghề": tự bắt lỗi và log CẢ đối tượng ngoại lệ ⇒ Logback in đủ chuỗi Caused by. */
    @GetMapping("/api/v2/orders/{id}")
    public ResponseEntity<String> orderV2(@PathVariable long id) {
        try {
            return ResponseEntity.ok(service.load(id));
        } catch (RuntimeException e) {
            log.error("order {} failed", id, e);   // tham số cuối là Throwable ⇒ in stack trace
            return ResponseEntity.status(500).body("{\"error\":\"internal\"}");
        }
    }

    @PostMapping("/api/orders/{id}/confirm")
    public String confirm(@PathVariable long id, @RequestParam String email) {
        log.info("confirm order id={}", id);
        mail.sendConfirmation(id, email);          // chạy ở luồng khác (@Async)
        return "ok";
    }
}
