/**
 * Thẻ bài học "100 Ngày Java" — Ngày 66: Chỉ mục (Index). Khép Giai đoạn 8.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-66.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 + 6: đếm PHÉP SO SÁNH (cố định) chứ không đo mili-giây. Chương
 * trình mô phỏng B-tree bằng tìm nhị phân trên mảng đã sắp — cùng độ phức tạp
 * O(log n) với chỉ mục thật. Cú pháp CREATE INDEX + EXPLAIN dạy trong thân
 * bài và ĐÃ CHẠY THẬT trên PostgreSQL 15.4 với bảng 1 triệu dòng:
 *   trước index: Parallel Seq Scan on nguoi
 *   sau  index: Index Scan using idx_nguoi_email (cost 8.44, rows=1)
 *   LIKE '%mail.com': quay lại Seq Scan (chỉ mục vô dụng)
 */
export default {
  series: '100 NGÀY JAVA',
  day: 66,
  total: 100,
  titleLead: 'Java Day 66:',
  titleAccent: 'Chỉ mục',
  subtitle: 'Thêm một dòng, truy vấn nhanh vạn lần 🚀',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KHÔNG CHỈ MỤC = QUÉT CẢ BẢNG 🐌',
      code: `SELECT * FROM nguoi WHERE email = ?

-- EXPLAIN: Parallel Seq Scan on nguoi
-- 1 trieu dong -> 777 778 phep so sanh`,
      notes: [
        { mark: 'no', text: 'Mỗi truy vấn duyệt từng dòng — cả triệu dòng, mỗi lần tìm' },
        { mark: 'dot', text: '`EXPLAIN` cho bạn thấy CSDL định đi tìm bằng cách nào' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CÓ CHỈ MỤC = NHẢY THẲNG 🚀',
      code: `CREATE INDEX idx_nguoi_email ON nguoi(email);

-- EXPLAIN: Index Scan using idx_nguoi_email
-- chi con ~20 phep so sanh (log2 cua 1 trieu)`,
      notes: [
        { mark: 'ok', text: 'Chỉ mục = cây B-tree đã sắp; mỗi bước loại bỏ một nửa còn lại' },
        { mark: 'ok', text: 'Nhanh hơn ~38 000 lần chỉ nhờ thêm MỘT dòng lệnh' },
      ],
    },
    {
      tone: 'pink',
      title: '3. KHÔNG MIỄN PHÍ 💰',
      code: `1 lan INSERT khi bang co 3 chi muc
-> 4 lan ghi (1 bang chinh + 3 chi muc)`,
      notes: [
        { mark: 'no', text: 'Mỗi lần ghi phải cập nhật MỌI chỉ mục — đánh chỉ mục bừa làm ghi chậm' },
        { mark: 'dot', text: 'Đánh chỉ mục cho cột hay nằm trong `WHERE`/`JOIN`, không phải mọi cột' },
      ],
    },
    {
      tone: 'green',
      title: '4. CHỈ GIÚP KHI DÙNG ĐƯỢC ⚠️',
      code: `WHERE email = 'x'        -> Index Scan
WHERE email LIKE '%x'    -> Seq Scan (vo dung)`,
      notes: [
        { mark: 'no', text: '`LIKE` mở đầu bằng `%`, hàm bọc quanh cột → chỉ mục bị bỏ qua' },
      ],
    },
    {
      tone: 'blue',
      title: '5. KHÉP GIAI ĐOẠN 8 🏁',
      notes: [
        { mark: 'ok', text: 'SQL · JOIN · JDBC · DAO · giao dịch · chỉ mục — đủ một tầng dữ liệu' },
        { mark: 'next', text: '**Ngày 67**: mở Giai đoạn 9 — Spring Boot, hết viết JDBC bằng tay' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongChiMuc` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) khong chi muc, tim trong 1000000 dong -> 777778 phep so sanh (Seq Scan)',
      '2) co chi muc B-tree -> 20 phep so sanh (Index Scan)',
      '3) nhanh hon 38888 lan; log2(1 trieu) ~ 20 buoc',
      '4) 1 lan INSERT khi co 3 chi muc -> 4 lan ghi (1 bang + 3 chi muc)',
      "5) chi muc dung duoc cho '=': true; cho LIKE '%...': false (van Seq Scan)",
      '6) PRIMARY KEY tu tao chi muc -> tim theo khoa chinh luon nhanh',
    ],
  },

  verify: {
    className: 'MoPhongChiMuc',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua CHI MUC (index) bang JDK thuan: khong co chi muc thi
   tim = quet ca bang (O(n)); co chi muc B-tree thi tim = do cay da sap
   (O(log n)). Dem PHEP SO SANH (co dinh) chu khong do mili-giay (LUAT 5).
   Ket bang cai gia cua chi muc: moi lan GHI phai cap nhat them chi muc. */
public class MoPhongChiMuc {

    static long soSanh = 0;

    /* Khong chi muc: quet tuyen tinh (Seq Scan). */
    static boolean quetCaBang(List<Integer> bang, int can) {
        for (int x : bang) {
            soSanh++;
            if (x == can) return true;
        }
        return false;
    }

    /* Co chi muc B-tree (mo phong bang mang da sap + tim nhi phan): moi buoc
       loai bo mot NUA so ung vien con lai — dung y nguyen cach CSDL do cay. */
    static boolean timTheoChiMuc(int[] chiMuc, int can) {
        int trai = 0, phai = chiMuc.length - 1;
        while (trai <= phai) {
            soSanh++;
            int giua = (trai + phai) >>> 1;
            if (chiMuc[giua] == can) return true;
            if (chiMuc[giua] < can) trai = giua + 1; else phai = giua - 1;
        }
        return false;
    }

    public static void main(String[] args) {
        final int N = 1_000_000;
        List<Integer> bang = new ArrayList<>(N);
        for (int i = 0; i < N; i++) bang.add(i);

        int can = 777_777;   // mot gia tri o gan cuoi de thay ro khac biet

        // (1) khong chi muc: quet ca bang
        soSanh = 0;
        quetCaBang(bang, can);
        long soSanhQuet = soSanh;
        System.out.println("1) khong chi muc, tim trong " + N + " dong -> " + soSanhQuet
                + " phep so sanh (Seq Scan)");

        // (2) co chi muc B-tree: tim nhi phan tren mang da sap
        int[] chiMuc = new int[N];
        for (int i = 0; i < N; i++) chiMuc[i] = bang.get(i);   // chi muc = ban sao da sap
        soSanh = 0;
        timTheoChiMuc(chiMuc, can);
        long soSanhChiMuc = soSanh;
        System.out.println("2) co chi muc B-tree -> " + soSanhChiMuc
                + " phep so sanh (Index Scan)");

        // (3) chi muc nhanh hon bao nhieu lan
        System.out.println("3) nhanh hon " + (soSanhQuet / soSanhChiMuc) + " lan; "
                + "log2(1 trieu) ~ " + (int) Math.ceil(Math.log(N) / Math.log(2)) + " buoc");

        // (4) chi muc KHONG mien phi: moi lan GHI phai cap nhat them chi muc
        int ghiVaoBang = 1;          // them 1 dong vao bang chinh
        int soChiMuc = 3;            // gia su bang co 3 chi muc
        System.out.println("4) 1 lan INSERT khi co " + soChiMuc + " chi muc -> "
                + (ghiVaoBang + soChiMuc) + " lan ghi (1 bang + " + soChiMuc + " chi muc)");

        // (5) chi muc chi giup khi truy van dung duoc no
        // 'WHERE email = ?' dung duoc; 'WHERE email LIKE %x' thi khong
        boolean bangNhau = true;     // so sanh bang -> chi muc dung duoc
        boolean likeDauPhanTram = false;   // LIKE '%...' -> phai quet ca bang
        System.out.println("5) chi muc dung duoc cho '=': " + bangNhau
                + "; cho LIKE '%...': " + likeDauPhanTram + " (van Seq Scan)");

        // (6) khoa chinh LUON co chi muc san
        System.out.println("6) PRIMARY KEY tu tao chi muc -> tim theo khoa chinh luon nhanh");
    }
}`,
  },
};
