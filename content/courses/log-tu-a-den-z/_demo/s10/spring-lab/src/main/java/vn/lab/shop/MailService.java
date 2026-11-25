package vn.lab.shop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    @Async
    public void sendConfirmation(long orderId, String email) {
        log.info("sending confirmation mail for order {} to {}", orderId, mask(email));
    }

    /** Che email trước khi ghi log: an@example.com ⇒ a***@example.com */
    static String mask(String email) {
        int at = email.indexOf('@');
        return at <= 1 ? "***" : email.charAt(0) + "***" + email.substring(at);
    }
}
