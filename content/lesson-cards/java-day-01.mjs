/**
 * Thẻ bài học "100 Ngày Java" — Ngày 1: Java là gì & chương trình đầu tiên.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-01.mjs
 *
 * Bài viết đi kèm nằm ở content/feed-series/100-ngay-java/day-01.mjs.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 1,
  total: 100,
  titleLead: 'Java Day 1:',
  titleAccent: 'Hello, Java!',
  subtitle: 'JDK, JVM, bytecode — hai bước từ chữ thành chương trình ⚙️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CHƯƠNG TRÌNH ĐẦU TIÊN 👋',
      code: `public class HelloJava {
    public static void main(String[] args) {   // cửa vào DUY NHẤT
        System.out.println("Xin chao, Java!");
    }
}`,
      notes: [
        { mark: 'ok', text: 'File **bắt buộc** tên `HelloJava.java` — trùng tên class `public`' },
        { mark: 'dot', text: '`main` phải đúng chữ ký này, sai một chữ là JVM không tìm thấy cửa vào' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HAI BƯỚC: DỊCH → CHẠY ⚙️',
      code: `javac HelloJava.java    # dịch → sinh ra HelloJava.class
java  HelloJava         # chạy .class — KHÔNG có đuôi .class`,
      notes: [
        { mark: 'dot', text: '`javac` dịch mã nguồn thành **bytecode**, không phải mã máy' },
        { mark: 'no', text: 'Gõ `java HelloJava.class` là sai — `java` nhận **tên class**, không nhận tên file' },
      ],
    },
    {
      tone: 'pink',
      title: '3. VIẾT MỘT LẦN, CHẠY MỌI NƠI 🌍',
      code: `HelloJava.java  ──javac──▶  HelloJava.class  ──java──▶  máy bạn
    mã nguồn                   BYTECODE                JVM dịch tiếp
                          (giống nhau ở MỌI máy)     sang mã máy tại chỗ`,
      notes: [
        { mark: 'ok', text: 'Cùng một file `.class` chạy được trên Windows, macOS, Linux — **JVM** là lớp phiên dịch' },
        { mark: 'dot', text: 'Cái "chạy mọi nơi" nằm ở bytecode, không phải ở mã nguồn' },
      ],
    },
    {
      tone: 'green',
      title: '4. JDK ⊃ JRE ⊃ JVM 📦',
      notes: [
        { mark: 'dot', text: '**JVM** — máy ảo, thứ thực sự chạy bytecode' },
        { mark: 'dot', text: '**JRE** = JVM + thư viện chuẩn → đủ để **chạy**' },
        { mark: 'ok', text: '**JDK** = JRE + `javac` + công cụ → cái bạn cần để **viết**. Cài JDK, đừng cài JRE' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Tên file = tên class public · `javac` rồi `java` · bytecode là thứ đi khắp nơi' },
        { mark: 'next', text: '**Ngày 2**: biến & kiểu dữ liệu — chỗ chứa dữ liệu đầu tiên' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'Xin chao, Java!',
      '1 + 2 = 3',
      'Ten class dang chay: HelloJava',
    ],
  },

  /* Chỉ in những thứ TẤT ĐỊNH — không in java.version, vì máy khác JDK khác
     là output lệch và phép kiểm sẽ đỏ oan. */
  verify: {
    className: 'HelloJava',
    source: `public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Xin chao, Java!");
        System.out.println("1 + 2 = " + (1 + 2));
        System.out.println("Ten class dang chay: " + HelloJava.class.getSimpleName());
    }
}`,
  },
};
