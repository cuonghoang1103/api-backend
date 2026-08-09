/**
 * Thẻ bài học "100 Ngày Java" — Ngày 100: KHÉP KHOÁ.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-100.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: chương trình tính tổng 10 giai đoạn = 100 ngày, tất định. Ngày
 * cuối — không khái niệm mới, chỉ tổng kết hành trình.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 100,
  total: 100,
  titleLead: 'Java Day 100:',
  titleAccent: 'KHÉP KHOÁ 🎉',
  subtitle: 'Từ Hello World tới một kỹ sư Java — 100 ngày 🏁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. TRỌN 10 GIAI ĐOẠN, 100 NGÀY 🗺️',
      code: `10 giai doan, cong lai 100 ngay (khong sot)`,
      notes: [
        { mark: 'ok', text: 'GĐ1-5 nền tảng ngôn ngữ · GĐ6-8 hệ thống · GĐ9-10 ứng dụng thật' },
        { mark: 'dot', text: 'Mỗi ngày một viên gạch — cộng lại thành một kỹ sư' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐIỀU QUAN TRỌNG NHẤT (KHÔNG PHẢI CÚ PHÁP) 💡',
      code: `// cu phap tra Google 30 giay la ra
// tu duy thi khong: vi sao, danh doi gi`,
      notes: [
        { mark: 'ok', text: 'Học được cách NGHĨ: đo trước khi sửa, không tin client, đánh đổi có ý thức' },
        { mark: 'dot', text: 'Ngôn ngữ rồi quên; tư duy kỹ thuật thì ở lại' },
      ],
    },
    {
      tone: 'pink',
      title: '3. MỘT VÒNG TRÒN ⭕',
      code: `Ngay 1:   println("Hello, Java!")
Ngay 100: mot backend hoan chinh`,
      notes: [
        { mark: 'ok', text: 'Người viết Hello World ngày 1 và bạn hôm nay — hai người khác nhau' },
      ],
    },
    {
      tone: 'green',
      title: '4. CHẶNG ĐƯỜNG TIẾP THEO 🚀',
      code: `- Đào sâu: microservice, Kafka, K8s
- Xây dự án riêng, đọc mã nguồn mở
- Học không dừng: Java ra bản mới đều`,
      notes: [
        { mark: 'ok', text: 'Nền đã chắc — giờ chọn hướng và đi sâu; làm dự án thật là cách học nhanh nhất' },
      ],
    },
    {
      tone: 'blue',
      title: '5. CẢM ƠN BẠN 🙏',
      notes: [
        { mark: 'ok', text: 'Kiên trì 100 ngày là điều hiếm — bạn đã làm được. Tự hào đi!' },
        { mark: 'next', text: '**Hết. #100NgàyJava — hẹn gặp ở những dòng code tiếp theo 💚**' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongKhepKhoa` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) 10 giai doan, cong lai 100 ngay',
      '2) GD1-5 nen tang ngon ngu (Ngay 1-40): cu phap, OOP, collections, hien dai',
      '3) GD6-8 he thong (Ngay 41-66): da luong, JVM/test/build, CSDL',
      '4) GD9-10 ung dung that (Ngay 67-100): Spring Boot, bao mat, du an Blog API',
      '5) kiem: tong 100 ngay = dung 100, khong sot',
      '6) tu Hello World (Ngay 1) den backend hoan chinh (Ngay 100): MOT VONG TRON',
    ],
  },

  verify: {
    className: 'MoPhongKhepKhoa',
    source: `import java.util.*;

/* KHEP KHOA — Ngay 100. Nhin lai tron 10 giai doan cua hanh trinh: cong lai
   dung 100 ngay, khong sot. Chay JDK thuan, tat dinh. Mot vong tron: tu dong
   println("Hello, Java!") dau tien (Ngay 1) den mot backend hoan chinh (Ngay 100). */
public class MoPhongKhepKhoa {

    record GiaiDoan(int so, String ten, int tu, int den) {
        int soNgay() { return den - tu + 1; }
    }

    public static void main(String[] args) {
        List<GiaiDoan> gd = List.of(
                new GiaiDoan(1, "Nen tang ngon ngu", 1, 10),
                new GiaiDoan(2, "OOP", 11, 20),
                new GiaiDoan(3, "Ngoai le", 21, 23),
                new GiaiDoan(4, "Collections", 24, 28),
                new GiaiDoan(5, "Java hien dai", 29, 40),
                new GiaiDoan(6, "Da luong", 41, 50),
                new GiaiDoan(7, "JVM + test + build", 51, 60),
                new GiaiDoan(8, "CSDL", 61, 66),
                new GiaiDoan(9, "Spring Boot", 67, 76),
                new GiaiDoan(10, "Bao mat + du an", 77, 100));

        int tong = gd.stream().mapToInt(GiaiDoan::soNgay).sum();
        System.out.println("1) " + gd.size() + " giai doan, cong lai " + tong + " ngay");
        System.out.println("2) GD1-5 nen tang ngon ngu (Ngay 1-40): cu phap, OOP, collections, hien dai");
        System.out.println("3) GD6-8 he thong (Ngay 41-66): da luong, JVM/test/build, CSDL");
        System.out.println("4) GD9-10 ung dung that (Ngay 67-100): Spring Boot, bao mat, du an Blog API");
        System.out.println("5) kiem: tong " + tong + " ngay = " + (tong == 100 ? "dung 100, khong sot" : "SAI"));
        System.out.println("6) tu Hello World (Ngay 1) den backend hoan chinh (Ngay 100): MOT VONG TRON");
    }
}`,
  },
};
