/**
 * Thẻ bài học "100 Ngày Java" — Ngày 75: Kiểm thử trong Spring.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-75.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thẻ chạy JDK thuần. Chương trình dựng lại nguyên lý: MockMvc gọi
 * thẳng controller không cần server thật, assert status + JSON, khung test tí
 * hon (Ngày 53) đếm đạt/hỏng. Cú pháp @SpringBootTest/MockMvc/@DataJpaTest dạy
 * ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 75,
  total: 100,
  titleLead: 'Java Day 75:',
  titleAccent: 'Kiểm thử Spring',
  subtitle: 'Test cả API mà không cần server thật 🧪',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MockMvc: GỌI API KHÔNG CẦN SERVER 🧪',
      code: `mockMvc.perform(get("/don/DH-2"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.ma").value("DH-2"));`,
      notes: [
        { mark: 'ok', text: 'Gọi thẳng controller trong tiến trình — không mở cổng, chạy mili-giây' },
        { mark: 'dot', text: 'Kiểm cả mã trạng thái lẫn thân JSON (Ngày 68)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. BA MỨC TEST, BA TỐC ĐỘ ⚖️',
      code: `@WebMvcTest      -> chi tang web  (nhanh)
@DataJpaTest     -> chi tang CSDL (nhanh)
@SpringBootTest  -> ca ung dung   (cham)`,
      notes: [
        { mark: 'ok', text: 'Test hẹp thì nhanh — chỉ dựng đúng tầng đang kiểm' },
        { mark: 'no', text: 'Đừng `@SpringBootTest` cho mọi thứ: chậm, dựng cả container' },
      ],
    },
    {
      tone: 'pink',
      title: '3. @DataJpaTest: CSDL TRONG BỘ NHỚ 💾',
      code: `@DataJpaTest
class KhoDonTest {
  // repository chay tren CSDL bo nho
  // khong can Postgres that
}`,
      notes: [
        { mark: 'ok', text: 'Kiểm repository trên H2/Testcontainers — sạch mỗi lần chạy' },
        { mark: 'dot', text: 'Giả (mock) tầng dưới khi test tầng trên (Ngày 54)' },
      ],
    },
    {
      tone: 'green',
      title: '4. LƯỚI TÓM ĐÚNG CHỖ SAI 🕸️',
      code: `assert mong 200 nhung nhan 404
-> khung test BAO HONG dung
tong: 3 dat, 1 hong`,
      notes: [
        { mark: 'ok', text: 'Test đỏ chỉ đúng chỗ vỡ — cùng lưới an toàn của Giai đoạn 7' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Test web bằng MockMvc, CSDL bằng @DataJpaTest, cả app bằng @SpringBootTest' },
        { mark: 'next', text: '**Ngày 76**: bài tổng hợp — REST API CRUD hoàn chỉnh, KHÉP Giai đoạn 9' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongSpringTest` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) MockMvc goi GET /don/DH-2 (khong server that) -> status 200',
      "2) assert than JSON chua 'DH-2' -> DAT",
      '3) GET /don/DH-404 -> status 404 -> DAT',
      '4) @DataJpaTest: kiem kho tren bo nho, khong CSDL that -> DAT',
      '5) assert co tinh sai (mong 200, nhan 404) -> khung test BAO HONG dung',
      '6) tong: 3 dat, 1 hong',
    ],
  },

  verify: {
    className: 'MoPhongSpringTest',
    source: `import java.util.*;

/* Dung lai NGUYEN LY kiem thu Spring bang JDK THUAN: MockMvc goi thang vao
   controller KHONG can server that, roi assert tren ma trang thai + than JSON.
   Cong voi khung test ti hon (Ngay 53) dem dat/hong va bao dung cho sai. Cu
   phap @SpringBootTest/MockMvc/@DataJpaTest day o than bai. */
public class MoPhongSpringTest {

    record DonHang(String ma, int soTien) {}
    record KetQua(int status, String than) {}

    /* "CSDL" trong bo nho — @DataJpaTest chay tren thu nay, khong can Postgres. */
    static final Map<String, DonHang> KHO = new LinkedHashMap<>();
    static { KHO.put("DH-2", new DonHang("DH-2", 350000)); }

    /* Controller: mot ham xu ly, nhu Ngay 68. */
    static KetQua getDon(String ma) {
        DonHang d = KHO.get(ma);
        return d == null
                ? new KetQua(404, "{\\"loi\\":\\"khong co don\\"}")
                : new KetQua(200, "{\\"ma\\":\\"" + d.ma() + "\\",\\"soTien\\":" + d.soTien() + "}");
    }

    /* Khung test ti hon (Ngay 53). */
    static int dat = 0, hong = 0;
    static void kiemTra(String ten, boolean dieuKien) {
        if (dieuKien) dat++; else hong++;
    }

    public static void main(String[] args) {
        // (1)(2) MockMvc: goi controller truc tiep, khong dung server that
        KetQua r1 = getDon("DH-2");
        System.out.println("1) MockMvc goi GET /don/DH-2 (khong server that) -> status " + r1.status());
        kiemTra("than chua 'DH-2'", r1.than().contains("DH-2"));
        System.out.println("2) assert than JSON chua 'DH-2' -> " + (hong == 0 ? "DAT" : "HONG"));

        // (3) test truong hop 404
        KetQua r2 = getDon("DH-404");
        kiemTra("404 khi khong co don", r2.status() == 404);
        System.out.println("3) GET /don/DH-404 -> status " + r2.status() + " -> "
                + (r2.status() == 404 ? "DAT" : "HONG"));

        // (4) @DataJpaTest: kiem kho tren bo nho, khong can CSDL that
        kiemTra("kho co DH-2", KHO.containsKey("DH-2"));
        System.out.println("4) @DataJpaTest: kiem kho tren bo nho, khong CSDL that -> "
                + (KHO.containsKey("DH-2") ? "DAT" : "HONG"));

        // (5) mot assert CO TINH SAI de thay khung test tom dung cho sai
        int truocKhiHong = hong;
        kiemTra("mong 200 nhung nhan 404", r2.status() == 200);   // co y sai
        System.out.println("5) assert co tinh sai (mong 200, nhan 404) -> "
                + (hong > truocKhiHong ? "khung test BAO HONG dung" : "?"));

        // (6) tong ket
        System.out.println("6) tong: " + dat + " dat, " + hong + " hong");
    }
}`,
  },
};
