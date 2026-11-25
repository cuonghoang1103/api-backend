package vn.lab.shop;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Lời giải 🧪 10.7 câu 1: thêm userId (lab: lấy từ header X-User-Id) bên cạnh requestId. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String id = req.getHeader("X-Request-Id");
        if (id == null || !id.matches("[A-Za-z0-9-]{8,64}")) {
            id = UUID.randomUUID().toString();
        }
        MDC.put("requestId", id);
        String user = req.getHeader("X-User-Id");
        if (user != null && user.matches("[a-z0-9_]{1,32}")) {   // chỉ gắn khi có header hợp lệ
            MDC.put("userId", user);
        }
        res.setHeader("X-Request-Id", id);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.remove("requestId");
            MDC.remove("userId");      // câu 2: biến dòng này thành chú thích để thấy rò
        }
    }
}
