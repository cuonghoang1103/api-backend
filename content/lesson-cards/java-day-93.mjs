/**
 * Thẻ bài học "100 Ngày Java" — Ngày 93: Giám sát & sức khỏe (Actuator).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-93.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý health aggregation + metrics bằng JDK thuần; tất
 * định (thành phần duyệt theo TreeMap). Cú pháp Actuator dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 93,
  total: 100,
  titleLead: 'Java Day 93:',
  titleAccent: 'Giám sát & Sức khỏe',
  subtitle: 'Thấy vấn đề trước khi người dùng thấy 🩺',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HEALTH: TỔNG HỢP TỪ NHIỀU BỘ KIỂM 🩺',
      code: `db UP + disk UP + redis UP -> tong the UP
// UP chi khi TAT CA thanh phan UP`,
      notes: [
        { mark: 'ok', text: 'Mỗi thành phần (CSDL, đĩa, Redis) tự báo còn sống không' },
        { mark: 'dot', text: 'Một cái hỏng → tổng thể DOWN, chỉ rõ cái nào' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HỎNG THÌ CHỈ RÕ CÁI NÀO 🔎',
      code: `redis DOWN -> tong the DOWN
thanh phan hong: [redis]`,
      notes: [
        { mark: 'ok', text: 'Không chỉ "hỏng" — mà "redis hỏng", giúp sửa nhanh' },
      ],
    },
    {
      tone: 'pink',
      title: '3. /health → MÃ HTTP CHO MÁY ĐỌC 🚦',
      code: `UP -> 200   DOWN -> 503

// bo can bang tai / may giam sat tu doc`,
      notes: [
        { mark: 'ok', text: 'Load balancer đọc /health, tự ngắt máy DOWN khỏi luồng' },
        { mark: 'dot', text: 'Kubernetes dùng nó để restart pod chết' },
      ],
    },
    {
      tone: 'green',
      title: '4. METRICS: SỐ LIỆU VẬN HÀNH 📊',
      code: `100 request, 3 loi -> ty le loi 3.0%
+ bo nho, luong, do tre P95, GC`,
      notes: [
        { mark: 'ok', text: 'Đếm request/lỗi/độ trễ để thấy xu hướng, đặt cảnh báo' },
        { mark: 'dot', text: 'Nối Prometheus + Grafana để vẽ biểu đồ, báo động' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Actuator = một starter; che các endpoint nhạy cảm sau xác thực' },
        { mark: 'next', text: '**Ngày 94**: đóng gói Docker — chạy giống nhau ở mọi máy' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongActuator` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) health db/disk/redis UP -> tong the UP -> /health 200',
      '2) redis DOWN -> tong the DOWN, thanh phan hong: [redis]',
      '3) /health: UP -> 200, DOWN -> 503 (may giam sat tu phat hien)',
      '4) metrics: 100 request, 3 loi -> ty le loi 3.0%',
      '5) metrics con: bo nho, so luong luong, do tre P95, so lan GC (Ngay 52)',
      '6) thay van de TRUOC khi nguoi dung phan nan -> khong van hanh trong bong toi',
    ],
  },

  verify: {
    className: 'MoPhongActuator',
    source: `import java.util.*;

/* Blog API — giam sat & suc khoe. Dung lai NGUYEN LY cua Spring Actuator bang
   JDK thuan: nhieu BO KIEM (health indicator) moi cai bao UP/DOWN, tong the
   UP chi khi TAT CA UP; cong them METRICS (dem request/loi). /health tra 200
   khi UP, 503 khi DOWN. Dem tat dinh, thanh phan duyet theo TreeMap (co thu tu). */
public class MoPhongActuator {

    static boolean tongThe(Map<String, Boolean> tp) {
        return tp.values().stream().allMatch(b -> b);      // UP chi khi tat ca UP
    }

    static List<String> thanhPhanHong(Map<String, Boolean> tp) {
        List<String> h = new ArrayList<>();
        for (var e : new TreeMap<>(tp).entrySet()) if (!e.getValue()) h.add(e.getKey());
        return h;
    }

    public static void main(String[] args) {
        // (1) tat ca UP -> tong the UP
        Map<String, Boolean> khoe = new TreeMap<>(Map.of("db", true, "disk", true, "redis", true));
        System.out.println("1) health db/disk/redis UP -> tong the " + (tongThe(khoe) ? "UP" : "DOWN") + " -> /health 200");

        // (2) redis DOWN -> tong the DOWN, chi ro cai nao hong
        Map<String, Boolean> loi = new TreeMap<>(Map.of("db", true, "disk", true, "redis", false));
        System.out.println("2) redis DOWN -> tong the " + (tongThe(loi) ? "UP" : "DOWN")
                + ", thanh phan hong: " + thanhPhanHong(loi));

        // (3) /health map sang ma HTTP
        System.out.println("3) /health: UP -> 200, DOWN -> 503 (may giam sat tu phat hien)");

        // (4) metrics: dem request/loi -> ty le loi
        int req = 100, soLoi = 3;
        System.out.println("4) metrics: " + req + " request, " + soLoi + " loi -> ty le loi "
                + (soLoi * 100.0 / req) + "%");

        // (5) cac chi so khac
        System.out.println("5) metrics con: bo nho, so luong luong, do tre P95, so lan GC (Ngay 52)");

        // (6) ket luan
        System.out.println("6) thay van de TRUOC khi nguoi dung phan nan -> khong van hanh trong bong toi");
    }
}`,
  },
};
