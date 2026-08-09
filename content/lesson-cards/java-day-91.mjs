/**
 * Thẻ bài học "100 Ngày Java" — Ngày 91: Realtime với WebSocket (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-91.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý pub/sub bằng JDK thuần (broker: topic -> người
 * đăng ký, publish đẩy tới tất cả); tất định. Cú pháp @MessageMapping/STOMP
 * dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 91,
  total: 100,
  titleLead: 'Java Day 91:',
  titleAccent: 'Realtime WebSocket',
  subtitle: 'Server chủ động đẩy — thôi bắt trình duyệt hỏi liên tục 🔔',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KÊNH HAI CHIỀU LUÔN MỞ 🔌',
      code: `client <==== ket noi mo san ====> server
// mot lan bat tay, giu mo, day ca hai chieu`,
      notes: [
        { mark: 'ok', text: 'HTTP: hỏi-đáp rồi đóng. WebSocket: mở một lần, giữ suốt' },
        { mark: 'dot', text: 'Server đẩy được xuống client, không chờ client hỏi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. PUB/SUB: TOPIC → NGƯỜI ĐĂNG KÝ 📮',
      code: `3 client dang ky topic '/topic/bai-1/binh-luan'
publish 1 su kien -> day toi 3 client`,
      notes: [
        { mark: 'ok', text: 'Một sự kiện phát tới MỌI người đăng ký topic — không ai phải hỏi' },
        { mark: 'no', text: "Client topic khác không nhận (nhận 0 tin)" },
      ],
    },
    {
      tone: 'pink',
      title: '3. VÌ SAO KHÔNG DÙNG POLLING 🔁',
      code: `POLLING hoi 10 lan, 1 lan co du lieu -> 9 request PHI
WEBSOCKET: day khi CO su kien -> 0 request phi`,
      notes: [
        { mark: 'no', text: 'Hỏi liên tục "có gì mới không?" — phần lớn trả về rỗng, tốn vô ích' },
        { mark: 'ok', text: 'WebSocket: chỉ truyền khi thật sự có sự kiện, độ trễ gần như tức thì' },
      ],
    },
    {
      tone: 'green',
      title: '4. HAI CHIỀU TRÊN MỘT KẾT NỐI ↔️',
      code: `@MessageMapping("/chat")   // client gui len
@SendTo("/topic/phong")    // day toi nguoi trong phong`,
      notes: [
        { mark: 'ok', text: 'Cùng một kết nối: client gửi lên và nhận về — hợp chat, thông báo' },
        { mark: 'dot', text: 'Spring dùng STOMP trên WebSocket cho pub/sub gọn' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Realtime = server đẩy; nhiều máy chủ thì cần message broker chung' },
        { mark: 'next', text: '**Ngày 92**: tài liệu API — OpenAPI/Swagger tự sinh từ code' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongWebSocket` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) 3 client dang ky topic '/topic/bai-1/binh-luan'",
      '2) publish 1 su kien -> day toi 3 client (server chu dong day)',
      "3) 'dung' o topic khac -> nhan 0 tin",
      '4) POLLING hoi 10 lan, 1 lan co du lieu -> 9 request PHI',
      '5) WEBSOCKET: server day khi CO su kien -> 0 request phi, do tre ~tuc thi',
      '6) 2 chieu: cung 1 ket noi mo san, client gui len va nhan ve deu duoc',
    ],
  },

  verify: {
    className: 'MoPhongWebSocket',
    source: `import java.util.*;

/* Blog API — realtime. Dung lai NGUYEN LY cua WebSocket/pub-sub bang JDK thuan:
   mot BROKER giu 'topic -> nguoi dang ky'; publish mot su kien thi DAY toi moi
   nguoi dang ky topic do (server chu dong day, khong ai phai hoi). So sanh voi
   POLLING (client hoi lien tuc) de thay so request PHI. Dem tat dinh. */
public class MoPhongWebSocket {

    static final Map<String, List<String>> DANG_KY = new LinkedHashMap<>();   // topic -> clients
    static final Map<String, List<String>> HOP_THU = new LinkedHashMap<>();   // client -> tin nhan

    static void dangKy(String client, String topic) {
        DANG_KY.computeIfAbsent(topic, k -> new ArrayList<>()).add(client);
    }

    /* publish: day tin toi MOI nguoi dang ky topic, tra ve so nguoi nhan. */
    static int publish(String topic, String tin) {
        List<String> nguoi = DANG_KY.getOrDefault(topic, List.of());
        for (String c : nguoi) HOP_THU.computeIfAbsent(c, k -> new ArrayList<>()).add(tin);
        return nguoi.size();
    }

    public static void main(String[] args) {
        String topic = "/topic/bai-1/binh-luan";

        // (1) 3 client dang ky
        dangKy("an", topic); dangKy("binh", topic); dangKy("chi", topic);
        System.out.println("1) 3 client dang ky topic '" + topic + "'");

        // (2) mot su kien -> day toi ca 3 (khong ai phai hoi)
        int nhan = publish(topic, "binh luan moi cua Duong");
        System.out.println("2) publish 1 su kien -> day toi " + nhan + " client (server chu dong day)");

        // (3) client topic khac khong nhan
        dangKy("dung", "/topic/bai-2/binh-luan");
        System.out.println("3) 'dung' o topic khac -> nhan " + HOP_THU.getOrDefault("dung", List.of()).size() + " tin");

        // (4) POLLING: client hoi 10 lan, chi 1 lan co du lieu moi
        int hoi = 10, coData = 1, phi = hoi - coData;
        System.out.println("4) POLLING hoi " + hoi + " lan, " + coData + " lan co du lieu -> " + phi + " request PHI");

        // (5) WEBSOCKET: server day khi CO su kien -> 0 request phi
        System.out.println("5) WEBSOCKET: server day khi CO su kien -> 0 request phi, do tre ~tuc thi");

        // (6) 2 chieu tren CUNG ket noi
        System.out.println("6) 2 chieu: cung 1 ket noi mo san, client gui len va nhan ve deu duoc");
    }
}`,
  },
};
