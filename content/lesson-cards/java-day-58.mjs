/**
 * Thẻ bài học "100 Ngày Java" — Ngày 58: Log & gỡ lỗi.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-58.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ SLF4J/Logback là THƯ VIỆN NGOÀI, không chạy được trong thẻ (JDK thuần).
 * Nên chương trình dựng lại NGUYÊN LÝ: mức log + ngưỡng, tham số `{}` chỉ ghép
 * chuỗi khi thật sự ghi, lọc khung thư viện khỏi stack trace, lần theo
 * `Caused by`, và mã yêu cầu để đọc log của MỘT request. Cú pháp SLF4J +
 * logback.xml dạy trong thân bài. Cùng cách đã dùng cho JUnit (53),
 * Mockito (54), Maven (56) và Git/CI (57).
 *
 * ⚠ Mục 4 dùng stack trace THẬT của một NumberFormatException, nhưng chỉ in
 * TÊN LỚP + TÊN HÀM (không in số dòng) — số dòng đổi mỗi lần sửa file, in ra
 * là tự chuốc lỗi lệch `proof.lines`.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 58,
  total: 100,
  titleLead: 'Java Day 58:',
  titleAccent: 'Log & gỡ lỗi',
  subtitle: 'Khi bug chỉ chịu xuất hiện trên production 🔎',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. MỨC LOG & NGƯỠNG 🎚️',
      code: `TRACE < DEBUG < INFO < WARN < ERROR

nguong INFO   -> ghi 3/5 dong
nguong DEBUG  -> ghi 4/5 dong   // doi 1 dong cau hinh`,
      notes: [
        { mark: 'ok', text: 'Bật/tắt chi tiết bằng **cấu hình**, không phải bằng cách xoá code' },
        { mark: 'no', text: '`System.out.println` không có mức, không tắt được, không lọc được' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. THAM SỐ {} — RẺ KHI TẮT 💸',
      code: `log.debug("gio hang {} co {} mon", maGio, soMon);

// nguong ERROR, goi 100 lan -> ghep chuoi 0 lan`,
      notes: [
        { mark: 'ok', text: 'Chuỗi chỉ được ghép khi dòng đó THẬT SỰ được ghi' },
        { mark: 'no', text: 'Viết `log.debug("gio hang " + maGio)` là ghép trước, tốn cả khi bị bỏ' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐỌC STACK TRACE 🔎',
      code: `Caused by: NumberFormatException  <- nguyen nhan GOC
  at java.base/Integer.parseInt   (thu vien)
  at ThuVienNgoai.doiSo           (thu vien)
  at MoPhongLog.tinhTong          <- CODE CUA MINH`,
      notes: [
        { mark: 'ok', text: 'Bỏ qua khung của thư viện — khung đầu tiên là code bạn viết' },
        { mark: 'dot', text: 'Cụm `Caused by` CUỐI CÙNG mới là nguyên nhân gốc, không phải dòng đầu' },
      ],
    },
    {
      tone: 'green',
      title: '4. MÃ YÊU CẦU ĐỂ LẦN THEO 🧵',
      code: `[R-2] nhan don hang
[R-2] tru ton kho
[R-2] thanh toan LOI

// 9 dong tron 3 yeu cau -> loc [R-2] con 4 dong`,
      notes: [
        { mark: 'ok', text: 'Production chạy hàng trăm request cùng lúc — không có mã này là đọc log mù' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Log là thứ DUY NHẤT bạn còn, khi không ai cho cắm gỡ lỗi vào máy chủ' },
        { mark: 'next', text: '**Ngày 59**: hiệu năng — đoán mò là cách tối ưu tệ nhất, phải ĐO' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongLog` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) nguong INFO -> ghi 3/5 dong (bo TRACE, DEBUG)',
      '2) doi nguong sang DEBUG -> ghi 4/5 dong, KHONG sua code',
      '3) 100 lan log.debug khi nguong ERROR -> ghep chuoi 0 lan',
      '4) stack trace -> bo khung thu vien, khung dau CUA MINH: MoPhongLog.tinhTong',
      '5) lan theo \'Caused by\' -> nguyen nhan goc: NumberFormatException: For input string: "hai"',
      '6) 9 dong tron 3 yeu cau -> loc [R-2] con 4 dong',
    ],
  },

  verify: {
    className: 'MoPhongLog',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua SLF4J/Logback bang JDK thuan:
   muc log + nguong, tham so {} chi ghep khi thuc su ghi, doc stack trace,
   va ma yeu cau de lan theo mot request giua bien log. */
public class MoPhongLog {

    /* Thu tu QUAN TRONG: cang ve sau cang nghiem trong. */
    enum Muc { TRACE, DEBUG, INFO, WARN, ERROR }

    static int lanGhepChuoi = 0;   // dem cong ghep chuoi thuc su ton

    static class BoGhi {
        Muc nguong;
        final List<String> daGhi = new ArrayList<>();

        BoGhi(Muc nguong) { this.nguong = nguong; }

        void ghi(Muc muc, String mau, Object... thamSo) {
            // Duoi nguong thi VE NGAY: khong ghep chuoi, khong ton gi ca.
            if (muc.ordinal() < nguong.ordinal()) return;
            daGhi.add(muc + " " + dienThamSo(mau, thamSo));
        }
    }

    static String dienThamSo(String mau, Object... thamSo) {
        lanGhepChuoi++;
        StringBuilder ket = new StringBuilder();
        int viTri = 0;
        for (Object ts : thamSo) {
            int oTrong = mau.indexOf("{}", viTri);
            if (oTrong < 0) break;
            ket.append(mau, viTri, oTrong).append(ts);
            viTri = oTrong + 2;
        }
        return ket.append(mau.substring(viTri)).toString();
    }

    /* Gia lam mot thu vien ngoai, de stack trace co ca khung KHONG phai code minh. */
    static class ThuVienNgoai {
        static int doiSo(String chuoi) { return Integer.parseInt(chuoi); }
    }

    static int tinhTong(String soLuong, int donGia) {
        return ThuVienNgoai.doiSo(soLuong) * donGia;
    }

    static void datHang() {
        try {
            tinhTong("hai", 50000);
        } catch (NumberFormatException goc) {
            throw new IllegalStateException("khong dat hang duoc", goc);
        }
    }

    static void goiNamMuc(BoGhi bo) {
        bo.ghi(Muc.TRACE, "vao ham tinhTong");
        bo.ghi(Muc.DEBUG, "gio hang {} co {} mon", "GH-9", 3);
        bo.ghi(Muc.INFO, "dat hang thanh cong: {}", "DH-77");
        bo.ghi(Muc.WARN, "ton kho con {} mon", 2);
        bo.ghi(Muc.ERROR, "khong goi duoc cong thanh toan");
    }

    public static void main(String[] args) {
        // (1) nguong INFO: TRACE va DEBUG bien mat
        BoGhi mucInfo = new BoGhi(Muc.INFO);
        goiNamMuc(mucInfo);
        System.out.println("1) nguong INFO -> ghi " + mucInfo.daGhi.size()
                + "/5 dong (bo TRACE, DEBUG)");

        // (2) doi MOI nguong, khong sua mot dong code nao
        BoGhi mucDebug = new BoGhi(Muc.DEBUG);
        goiNamMuc(mucDebug);
        System.out.println("2) doi nguong sang DEBUG -> ghi " + mucDebug.daGhi.size()
                + "/5 dong, KHONG sua code");

        // (3) PHEP THU RIENG: goi 100 lan debug khi nguong dang la ERROR
        lanGhepChuoi = 0;
        BoGhi mucError = new BoGhi(Muc.ERROR);
        for (int i = 0; i < 100; i++) {
            mucError.ghi(Muc.DEBUG, "gio hang {} co {} mon", "GH-" + i, i);
        }
        System.out.println("3) 100 lan log.debug khi nguong ERROR -> ghep chuoi "
                + lanGhepChuoi + " lan");

        // (4)(5) doc stack trace: bo khung thu vien, lan theo Caused by
        try {
            datHang();
        } catch (IllegalStateException loi) {
            String khungCuaMinh = "khong thay";
            for (StackTraceElement khung : loi.getCause().getStackTrace()) {
                String lop = khung.getClassName();
                if (!lop.startsWith("java.") && !lop.contains("ThuVienNgoai")) {
                    khungCuaMinh = khung.getClassName() + "." + khung.getMethodName();
                    break;
                }
            }
            System.out.println("4) stack trace -> bo khung thu vien, khung dau CUA MINH: "
                    + khungCuaMinh);

            Throwable goc = loi;
            while (goc.getCause() != null) goc = goc.getCause();
            System.out.println("5) lan theo 'Caused by' -> nguyen nhan goc: "
                    + goc.getClass().getSimpleName() + ": " + goc.getMessage());
        }

        // (6) ma yeu cau: lan theo MOT request giua log tron cua nhieu request
        List<String> nhatKy = List.of(
                "[R-1] nhan don hang", "[R-2] nhan don hang", "[R-1] tru ton kho",
                "[R-3] nhan don hang", "[R-2] tru ton kho", "[R-1] xong",
                "[R-2] thanh toan LOI", "[R-3] xong", "[R-2] hoan tien");
        long cuaR2 = nhatKy.stream().filter(d -> d.startsWith("[R-2]")).count();
        System.out.println("6) " + nhatKy.size() + " dong tron 3 yeu cau -> loc [R-2] con "
                + cuaR2 + " dong");
    }
}`,
  },
};
