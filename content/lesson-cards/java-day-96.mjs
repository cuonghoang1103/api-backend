/**
 * Thẻ bài học "100 Ngày Java" — Ngày 96: Kiểm thử tích hợp (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-96.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý mock-che-bug vs integration-bắt-bug bằng JDK thuần;
 * tất định. Cú pháp @SpringBootTest/Testcontainers dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 96,
  total: 100,
  titleLead: 'Java Day 96:',
  titleAccent: 'Kiểm thử tích hợp',
  subtitle: 'Ghép tất cả lại chạy thật — bắt lỗi mock che giấu 🧩',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MOCK CÓ THỂ CHE GIẤU BUG 🎭',
      code: `UNIT (mock): dang 2 bai cung slug
-> luu duoc? true (SAI voi thuc te)`,
      notes: [
        { mark: 'no', text: 'Repo giả không ép ràng buộc → test xanh dù thực tế sẽ hỏng' },
        { mark: 'dot', text: 'Unit test nhanh, nhiều — nhưng giả lập tầng dưới nên bỏ sót' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. INTEGRATION CHẠY THẬT → BẮT LỖI 🧩',
      code: `INTEGRATION (kho that, UNIQUE)
-> lan 2 luu duoc? false (dung)`,
      notes: [
        { mark: 'ok', text: 'Repo thật ép `UNIQUE` (Ngày 61) → chặn slug trùng, đúng như prod' },
        { mark: 'ok', text: 'Bắt được chỗ hai mảnh (code + CSDL) không khớp mà mock che' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CẢ LUỒNG TỪ HTTP XUỐNG CSDL 🔗',
      code: `@SpringBootTest — dung ca app
controller → service → repo → CSDL that`,
      notes: [
        { mark: 'ok', text: 'Gọi API đầu-cuối, kiểm cả dây chuyền thật sự khớp nhau' },
      ],
    },
    {
      tone: 'green',
      title: '4. Testcontainers: CSDL THẬT LÚC TEST 🐳',
      code: `Postgres THAT trong Docker,
chi cho luc test, sach moi lan`,
      notes: [
        { mark: 'ok', text: 'Giống production nhất — không lệch như H2 (Ngày 75)' },
        { mark: 'dot', text: 'Tự dựng + tự xoá, không đụng CSDL thật của ai' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nhiều unit (nhanh) + ít integration (thật, chậm) = kim tự tháp test' },
        { mark: 'next', text: '**Ngày 97**: rà soát bảo mật cuối — checklist OWASP cho Blog API' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongIntegrationTest` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) UNIT (mock): dang 2 bai cung slug -> luu duoc? true (SAI voi thuc te)',
      '2) INTEGRATION (kho that): lan 2 luu duoc? false (dung: UNIQUE chan)',
      '3) mock PASS nhung thuc te FAIL -> mock che giau cho 2 manh khong khop',
      '4) integration BAT bug ma unit test bo sot',
      '5) Testcontainers: Postgres THAT trong Docker chi cho luc test, sach moi lan',
      '6) nhieu UNIT (nhanh) + it INTEGRATION (that, cham) = luoi day du',
    ],
  },

  verify: {
    className: 'MoPhongIntegrationTest',
    source: `import java.util.*;

/* Blog API — kiem thu tich hop. Dung lai NGUYEN LY bang JDK thuan: UNIT test
   dung repo GIA (mock) khong ep rang buoc -> co the CHE GIAU bug; INTEGRATION
   test dung repo THAT (ep UNIQUE nhu CSDL) -> BAT duoc cho hai manh khong khop.
   Tat dinh. Testcontainers dung Postgres that trong Docker chi cho luc test. */
public class MoPhongIntegrationTest {

    interface KhoBaiViet { boolean luu(String slug); }   // true neu luu duoc

    /* Mock: luon cho luu, KHONG kiem trung — tien cho unit test nhung khong that. */
    static class KhoGia implements KhoBaiViet {
        public boolean luu(String slug) { return true; }
    }

    /* That: ep UNIQUE tren slug, dung nhu CSDL that (Ngay 61). */
    static class KhoThat implements KhoBaiViet {
        final Set<String> daCo = new HashSet<>();
        public boolean luu(String slug) { return daCo.add(slug); }   // false neu trung
    }

    /* Kich ban loi: dang 2 bai cung slug -> lan 2 PHAI bi tu choi. */
    static boolean dang2BaiCungSlug(KhoBaiViet kho) {
        kho.luu("hoc-java");
        return kho.luu("hoc-java");
    }

    public static void main(String[] args) {
        // (1) UNIT test voi mock: mock khong ep rang buoc
        boolean mock = dang2BaiCungSlug(new KhoGia());
        System.out.println("1) UNIT (mock): dang 2 bai cung slug -> luu duoc? " + mock + " (SAI voi thuc te)");

        // (2) INTEGRATION test voi kho that: UNIQUE chan
        boolean real = dang2BaiCungSlug(new KhoThat());
        System.out.println("2) INTEGRATION (kho that): lan 2 luu duoc? " + real + " (dung: UNIQUE chan)");

        // (3) mock che giau bug
        System.out.println("3) mock PASS nhung thuc te FAIL -> mock che giau cho 2 manh khong khop");

        // (4) integration bat bug
        System.out.println("4) integration BAT bug ma unit test bo sot");

        // (5) Testcontainers
        System.out.println("5) Testcontainers: Postgres THAT trong Docker chi cho luc test, sach moi lan");

        // (6) kim tu thap test
        System.out.println("6) nhieu UNIT (nhanh) + it INTEGRATION (that, cham) = luoi day du");
    }
}`,
  },
};
