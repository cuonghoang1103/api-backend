// Login.java — bẫy Java: log nguyên đối tượng. record tự sinh toString() có MỌI trường, kể cả password.
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Login {
  record LoginRequest(String email, String password) {}

  record LoginRequestAnToan(String email, String password) {
    @Override public String toString() { return "LoginRequest[email=" + email + ", password=***]"; }   // ✓ ghi đè toString
  }

  static final Logger log = LoggerFactory.getLogger("auth");

  public static void main(String[] a) {
    log.info("nhận yêu cầu đăng nhập {}", new LoginRequest("an@example.com", "MatKhau-GIA-123"));        // ✗
    log.info("nhận yêu cầu đăng nhập {}", new LoginRequestAnToan("an@example.com", "MatKhau-GIA-123"));  // ✓
    log.warn("gọi cổng thanh toán thất bại: url=https://pay.example/api?amount=50000&token=GIA-tok-77a");  // lưới an toàn %replace
  }
}
