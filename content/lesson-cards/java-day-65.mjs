/**
 * Thẻ bài học "100 Ngày Java" — Ngày 65: Giao dịch (Transaction).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-65.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: không có JDBC trong thẻ. Chương trình dựng lại nguyên lý
 * commit/rollback bằng một "bản nháp" chỉ áp dụng khi commit — chứng minh
 * tính nguyên tử: chuyển tiền hỏng giữa chừng thì rollback về nguyên vẹn, còn
 * autoCommit=true thì bước 1 ghi vĩnh viễn không rút lại được. Mỗi phép thử
 * dùng một cặp tài khoản RIÊNG (LUẬT phép thử độc lập). Cú pháp
 * setAutoCommit/commit/rollback dạy trong thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 65,
  total: 100,
  titleLead: 'Java Day 65:',
  titleAccent: 'Giao dịch',
  subtitle: 'Tất cả cùng xong, hoặc như chưa từng xảy ra 💳',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. VẤN ĐỀ: MẤT ĐIỆN GIỮA CHỪNG ⚡',
      code: `tru tien tai khoan A   // xong
// ... mat dien ...
cong tien tai khoan B  // chua chay

// -> tien boc hoi khoi he thong`,
      notes: [
        { mark: 'no', text: 'Hai bước phải đi cùng nhau, nhưng đời không hứa cho bạn chạy hết' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. COMMIT: ĐỔI THẬT KHI XONG HẾT ✅',
      code: `conn.setAutoCommit(false);   // mo giao dich
tru(A); cong(B);             // gom lai, chua ghi
conn.commit();               // ghi ca hai, mot lan`,
      notes: [
        { mark: 'ok', text: 'Trước commit: bên ngoài vẫn thấy số dư cũ (A=100000)' },
        { mark: 'ok', text: 'Sau commit: cả hai đổi cùng lúc, tổng tiền không đổi' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ROLLBACK: HUỶ SẠCH KHI HỎNG ↩️',
      code: `try { tru(C); cong(D); commit(); }
catch (Exception e) { conn.rollback(); }

// buoc 2 hong -> C=100000 D=0, ven nguyen`,
      notes: [
        { mark: 'ok', text: 'Rollback huỷ CẢ bước 1 đã chạy — như chưa từng có gì' },
        { mark: 'dot', text: '`rollback` nằm trong `catch`, dọn dẹp nằm trong `finally` (Ngày 21)' },
      ],
    },
    {
      tone: 'green',
      title: '4. QUÊN MỞ = KHÔNG CỨU ĐƯỢC ⚠️',
      code: `// autoCommit = true (mac dinh):
tru(G, 20000);   // GHI VINH VIEN ngay lap tuc
// mat dien -> lech 20000, khong the rollback`,
      notes: [
        { mark: 'no', text: 'Mặc định mỗi câu lệnh tự commit — chuyện tiền phải TẮT nó đi' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nguyên tử (A trong ACID): chỉ hai kết cục, không bao giờ nửa vời' },
        { mark: 'next', text: '**Ngày 66**: chỉ mục — vì sao thêm một dòng làm truy vấn nhanh nghìn lần' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongGiaoDich` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) trong giao dich (chua commit): A=70000 B=30000, nhung CSDL that A=100000',
      '2) sau commit: A=70000 B=30000, tong khong doi? true',
      '3) buoc 2 hong (khong du so du o C) -> rollback',
      '4) sau rollback: C=100000 D=0, tien co boc hoi khong? khong, ven nguyen',
      '5) autoCommit=true, mat dien sau buoc 1: G=30000 H=0 -> lech 20000 dong, khong the phuc hoi',
      "6) nguyen tu: chi 'ca hai xong' HOAC 'nhu chua xay ra', khong nua voi",
    ],
  },

  verify: {
    className: 'MoPhongGiaoDich',
    source: `import java.util.*;

/* Dung lai NGUYEN LY cua giao dich (transaction) bang JDK thuan:
   nhieu thao tac phai CUNG xong hoac CUNG nhu chua tung xay ra. Mo phong
   commit/rollback bang cach cong don thay doi vao mot BAN NHAP, chi ap dung
   khi commit. Moi phep thu dung MOT cap tai khoan RIENG (Ngay 13/45). */
public class MoPhongGiaoDich {

    /* "CSDL": so du that su, chi doi khi COMMIT. */
    static final Map<String, Integer> SO_DU = new TreeMap<>();

    /* Mot giao dich: gom cac thay doi lai, chua cham vao SO_DU that. */
    static class GiaoDich {
        private final Map<String, Integer> banNhap = new LinkedHashMap<>();

        /* Chuyen tien = hai buoc phai di cung nhau: tru ben nay, cong ben kia. */
        void chuyen(String tu, String den, int tien) {
            if (tien > docSoDu(tu)) throw new IllegalStateException("khong du so du o " + tu);
            banNhap.merge(tu, -tien, Integer::sum);
            banNhap.merge(den, +tien, Integer::sum);
        }

        int docSoDu(String tk) {
            return SO_DU.getOrDefault(tk, 0) + banNhap.getOrDefault(tk, 0);
        }

        /* commit: ap dung toan bo ban nhap vao CSDL that, mot lan. */
        void commit() {
            for (var e : banNhap.entrySet()) SO_DU.merge(e.getKey(), e.getValue(), Integer::sum);
            banNhap.clear();
        }

        /* rollback: vut bo ban nhap — CSDL that khong he bi cham. */
        void rollback() { banNhap.clear(); }
    }

    public static void main(String[] args) {
        // ── PHEP THU 1 (cap A/B): chuyen tien thanh cong roi commit ─────────
        SO_DU.clear();
        SO_DU.put("A", 100_000);
        SO_DU.put("B", 0);
        GiaoDich gd1 = new GiaoDich();
        gd1.chuyen("A", "B", 30_000);
        System.out.println("1) trong giao dich (chua commit): A=" + gd1.docSoDu("A")
                + " B=" + gd1.docSoDu("B") + ", nhung CSDL that A=" + SO_DU.get("A"));
        gd1.commit();
        System.out.println("2) sau commit: A=" + SO_DU.get("A") + " B=" + SO_DU.get("B")
                + ", tong khong doi? " + (SO_DU.get("A") + SO_DU.get("B") == 100_000));

        // ── PHEP THU 2 (cap C/D RIENG): buoc 2 hong -> rollback CA HAI buoc ──
        SO_DU.clear();
        SO_DU.put("C", 100_000);
        SO_DU.put("D", 0);
        GiaoDich gd2 = new GiaoDich();
        String loi = null;
        try {
            gd2.chuyen("C", "D", 30_000);       // buoc 1: OK trong ban nhap
            gd2.chuyen("C", "D", 999_999);      // buoc 2: qua so du -> nem loi
            gd2.commit();
        } catch (IllegalStateException e) {
            loi = e.getMessage();
            gd2.rollback();                     // huy TOAN BO, ke ca buoc 1
        }
        boolean nguyenVen = SO_DU.get("C") == 100_000 && SO_DU.get("D") == 0;
        System.out.println("3) buoc 2 hong (" + loi + ") -> rollback");
        System.out.println("4) sau rollback: C=" + SO_DU.get("C") + " D=" + SO_DU.get("D")
                + ", tien co boc hoi khong? " + (nguyenVen ? "khong, ven nguyen" : "CO"));

        // ── PHEP THU 3 (cap G/H RIENG): autoCommit=true, khong the rollback ─
        SO_DU.clear();
        SO_DU.put("G", 50_000);
        SO_DU.put("H", 0);
        // Khong mo giao dich: moi thao tac ghi thang vao CSDL (autoCommit mac dinh)
        SO_DU.merge("G", -20_000, Integer::sum);   // buoc 1 da ghi VINH VIEN ngay
        System.out.println("5) autoCommit=true, mat dien sau buoc 1: G="
                + SO_DU.get("G") + " H=" + SO_DU.get("H") + " -> lech "
                + (50_000 - SO_DU.get("G") - SO_DU.get("H")) + " dong, khong the phuc hoi");

        // ── Nguyen tu: chi hai ket cuc, khong bao gio nua voi ───────────────
        System.out.println("6) nguyen tu: chi 'ca hai xong' HOAC 'nhu chua xay ra', khong nua voi");
    }
}`,
  },
};
