/**
 * Thẻ bài học "100 Ngày Java" — Ngày 72: Tầng service & @Transactional.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-72.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: thẻ chạy JDK thuần. Chương trình dựng lại đúng cơ chế thật của
 * @Transactional: một Proxy (Ngày 70) bọc quanh service, COMMIT nếu xong,
 * ROLLBACK nếu ném RuntimeException — tính nguyên tử của Ngày 65. Cú pháp
 * @Service/@Transactional dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 72,
  total: 100,
  titleLead: 'Java Day 72:',
  titleAccent: 'Service & @Transactional',
  subtitle: 'Nghiệp vụ sống ở tầng service, giao dịch trong một dòng ⚙️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BA TẦNG, MỖI TẦNG MỘT VIỆC 🏛️',
      code: `@RestController  -> nhan/tra HTTP     (Ngay 68)
@Service         -> LOGIC NGHIEP VU
@Repository      -> cham CSDL         (Ngay 70)`,
      notes: [
        { mark: 'ok', text: 'Nghiệp vụ ở service, KHÔNG nhét vào controller hay repository' },
        { mark: 'dot', text: 'Controller mỏng: nhận request → gọi service → trả kết quả' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @Transactional: GIAO DỊCH 1 DÒNG ⚙️',
      code: `@Transactional
void datHang(String sp, int soLuong) {
    taoDon(sp, soLuong);   // buoc 1
    truTonKho(sp, soLuong); // buoc 2 (co the hong)
}`,
      notes: [
        { mark: 'ok', text: 'Cả `setAutoCommit(false)`+commit/rollback của Ngày 65 gói thành một chú thích' },
        { mark: 'ok', text: 'datHang OK → COMMIT: đơn +1, tồn giảm' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NÉM LỖI → ROLLBACK CẢ CỤM ↩️',
      code: `datHang('ao', 99)  // qua ton kho
-> nem RuntimeException
-> ROLLBACK: don van=1, ton van=7`,
      notes: [
        { mark: 'ok', text: 'Bước 1 đã tạo đơn cũng bị huỷ — cả cụm như chưa xảy ra' },
        { mark: 'no', text: 'Mặc định chỉ rollback với **RuntimeException**, không với checked' },
      ],
    },
    {
      tone: 'green',
      title: '4. BÊN DƯỚI VẪN LÀ PROXY 🪄',
      code: `Spring boc service trong mot Proxy:
  BEGIN -> goi ham -> COMMIT
  (loi) -> ROLLBACK`,
      notes: [
        { mark: 'ok', text: 'Cùng cơ chế Proxy của Ngày 70 — không phép màu' },
        { mark: 'no', text: 'Bẫy: gọi phương thức `@Transactional` từ CHÍNH lớp đó → proxy bị vòng qua' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nghiệp vụ + giao dịch ở service; controller mỏng; repository chỉ CRUD' },
        { mark: 'next', text: '**Ngày 73**: xử lý lỗi gọn — @ExceptionHandler, @ControllerAdvice' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongTransactional` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) tao proxy @Transactional quanh service, ton 'ao'=10",
      "2) datHang('ao',3) OK -> COMMIT: don=1, ton 'ao'=7",
      "3) datHang('ao',99) qua ton -> nem loi: het ton kho ao -> ROLLBACK",
      "4) sau rollback: don van=1, ton 'ao' van=7 (ca 2 buoc bi huy)",
      '5) commit=1, rollback=1',
      '6) @Transactional = 1 dong chu thich; proxy lo begin/commit/rollback',
    ],
  },

  verify: {
    className: 'MoPhongTransactional',
    source: `import java.lang.reflect.*;
import java.util.*;

/* Dung lai NGUYEN LY cua @Transactional bang JDK THUAN: mot PROXY (Ngay 70)
   boc quanh phuong thuc service, mo giao dich TRUOC khi goi, COMMIT neu xong,
   ROLLBACK neu nem RuntimeException — dung tinh nguyen tu cua Ngay 65. Nghiep
   vu (dat hang = tao don + tru ton kho) song o TANG SERVICE, khong o controller. */
public class MoPhongTransactional {

    /* "CSDL": ton kho + danh sach don. Giao dich chi giu thay doi khi COMMIT. */
    static final Map<String, Integer> KHO = new TreeMap<>();
    static final List<String> DON = new ArrayList<>();

    interface DichVuDatHang { void datHang(String sanPham, int soLuong); }

    /* Logic nghiep vu THAT: hai buoc phai di cung nhau. */
    static class DichVuThat implements DichVuDatHang {
        public void datHang(String sanPham, int soLuong) {
            DON.add(sanPham + "x" + soLuong);                       // buoc 1: tao don
            int con = KHO.getOrDefault(sanPham, 0) - soLuong;       // buoc 2: tru ton kho
            if (con < 0) throw new IllegalStateException("het ton kho " + sanPham);
            KHO.put(sanPham, con);
        }
    }

    /* Bo giao dich: chup ban sao truoc, commit giu nguyen, rollback khoi phuc. */
    static class BoGiaoDich implements InvocationHandler {
        final Object goc;
        static int soCommit = 0, soRollback = 0;
        BoGiaoDich(Object goc) { this.goc = goc; }

        public Object invoke(Object proxy, Method m, Object[] args) throws Throwable {
            Map<String, Integer> luuKho = new TreeMap<>(KHO);       // BEGIN
            List<String> luuDon = new ArrayList<>(DON);
            try {
                Object kq = m.invoke(goc, args);
                soCommit++;                                         // COMMIT
                return kq;
            } catch (InvocationTargetException e) {
                if (e.getCause() instanceof RuntimeException) {     // ROLLBACK
                    KHO.clear(); KHO.putAll(luuKho);
                    DON.clear(); DON.addAll(luuDon);
                    soRollback++;
                }
                throw e.getCause();
            }
        }
    }

    static DichVuDatHang bocTransactional(DichVuDatHang goc) {
        return (DichVuDatHang) Proxy.newProxyInstance(
                DichVuDatHang.class.getClassLoader(),
                new Class[]{DichVuDatHang.class},
                new BoGiaoDich(goc));
    }

    public static void main(String[] args) {
        KHO.put("ao", 10);
        DichVuDatHang dichVu = bocTransactional(new DichVuThat());
        System.out.println("1) tao proxy @Transactional quanh service, ton 'ao'=" + KHO.get("ao"));

        // (2) dat hang thanh cong -> COMMIT
        dichVu.datHang("ao", 3);
        System.out.println("2) datHang('ao',3) OK -> COMMIT: don=" + DON.size() + ", ton 'ao'=" + KHO.get("ao"));

        // (3)(4) dat hang qua ton kho -> nem loi -> ROLLBACK ca hai buoc
        String loi = null;
        try {
            dichVu.datHang("ao", 99);
        } catch (RuntimeException e) {
            loi = e.getMessage();
        }
        System.out.println("3) datHang('ao',99) qua ton -> nem loi: " + loi + " -> ROLLBACK");
        System.out.println("4) sau rollback: don van=" + DON.size() + ", ton 'ao' van=" + KHO.get("ao")
                + " (ca 2 buoc bi huy)");

        // (5) dem commit / rollback
        System.out.println("5) commit=" + BoGiaoDich.soCommit + ", rollback=" + BoGiaoDich.soRollback);

        // (6) ket luan co che
        System.out.println("6) @Transactional = 1 dong chu thich; proxy lo begin/commit/rollback");
    }
}`,
  },
};
