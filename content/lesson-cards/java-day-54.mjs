/**
 * Thẻ bài học "100 Ngày Java" — Ngày 54: Mockito & bản giả.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-54.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ Mockito là thư viện ngoài, thẻ chạy JDK thuần — nên chương trình dựng
 * lại NGUYÊN LÝ (bản giả trả giá trị định sẵn + ghi lại lời gọi + ném lỗi
 * theo kịch bản) bằng hai class tự viết. Cú pháp Mockito thật dạy trong bài.
 * Cùng cách đã làm với JUnit ở thẻ Ngày 53.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 54,
  total: 100,
  titleLead: 'Java Day 54:',
  titleAccent: 'Bản giả (Mock)',
  subtitle: 'Test code có gọi DB, gọi API — mà không chạm vào chúng 🎭',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. VÌ SAO CẦN BẢN GIẢ 🎭',
      code: `double tinhTien(int maDon) {
    DonHang d = database.tim(maDon);      // DB that: cham, doi mang
    double thue = apiThue.layThueSuat();  // API that: moi lan mot khac
    return d.tongTien() * (1 + thue);
}`,
      notes: [
        { mark: 'no', text: 'Test chạm DB/API thật thì chậm, phụ thuộc mạng, lúc xanh lúc đỏ' },
        { mark: 'ok', text: 'Bản giả trả giá trị ĐỊNH SẴN → test chạy trong mili-giây, luôn cùng kết quả' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐỊNH SẴN KẾT QUẢ 📌',
      code: `// Mockito that:
KhoDuLieu kho = mock(KhoDuLieu.class);
when(kho.tongTien(7)).thenReturn(1000.0);

// -> tinh tien = 1100.0 (1000 * 1.1)`,
      notes: [{ mark: 'ok', text: 'Chỉ cần INTERFACE (**Ngày 18**) — đây là lý do "lập trình theo hợp đồng" trả công' }],
    },
    {
      tone: 'pink',
      title: '3. KIỂM ĐÃ GỌI ĐÚNG CHƯA ✔️',
      code: `verify(kho).tongTien(7);          // co goi, dung tham so
verify(api, times(1)).thueSuat(); // dung mot lan
// -> da goi kho voi ma don [7] | api thue goi 1 lan`,
      notes: [{ mark: 'ok', text: 'Kiểm cả HÀNH VI, không chỉ kết quả — vd. "có gửi đúng một email không"' }],
    },
    {
      tone: 'green',
      title: '4. DỰNG TÌNH HUỐNG KHÓ TÁI HIỆN 💥',
      code: `when(kho.tongTien(9)).thenThrow(new IllegalStateException("DB sap"));
// -> bat duoc: DB sap

// thu tao DB sap that de test? khong ai lam vay`,
      notes: [
        { mark: 'ok', text: 'Đây mới là giá trị lớn nhất: test được đường HỎNG mà thực tế khó dựng' },
        { mark: 'no', text: 'Đừng giả lập thứ bạn sở hữu — chỉ giả lập ranh giới ra ngoài' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Nhận phụ thuộc qua constructor (**Ngày 12**) thì mới thay bản giả được' },
        { mark: 'next', text: '**Ngày 55**: TDD — viết test TRƯỚC khi viết code' },
      ],
    },
  ],

  /* Output THẬT của `java BanGia` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) tinh tien -> 1100.0 (mong 1100.0)',
      '2) da goi kho voi ma don -> [7] | api thue goi 1 lan',
      '3) DB sap -> bat duoc: DB sap',
      '4) don rong -> 0.0',
      '5) chay hai lan -> giong nhau? true (600.0)',
      '6) tong so lan cham kho -> 5',
    ],
  },

  verify: {
    className: 'BanGia',
    source: `import java.util.*;

public class BanGia {

    interface KhoDuLieu { double tongTien(int maDon); }
    interface ApiThue   { double thueSuat(); }

    static class DichVu {
        private final KhoDuLieu kho; private final ApiThue api;
        DichVu(KhoDuLieu kho, ApiThue api) { this.kho = kho; this.api = api; }
        double tinhTien(int maDon) { return kho.tongTien(maDon) * (1 + api.thueSuat()); }
    }

    static class KhoGia implements KhoDuLieu {
        double traVe = 0; RuntimeException nem = null;
        final List<Integer> daGoiVoi = new ArrayList<>();
        public double tongTien(int maDon) {
            daGoiVoi.add(maDon);
            if (nem != null) throw nem;
            return traVe;
        }
    }
    static class ThueGia implements ApiThue {
        double traVe = 0; int soLanGoi = 0;
        public double thueSuat() { soLanGoi++; return traVe; }
    }

    public static void main(String[] args) {
        KhoGia kho = new KhoGia(); ThueGia thue = new ThueGia();
        DichVu dv = new DichVu(kho, thue);

        kho.traVe = 1000; thue.traVe = 0.1;
        System.out.println("1) tinh tien -> " + dv.tinhTien(7) + " (mong 1100.0)");

        System.out.println("2) da goi kho voi ma don -> " + kho.daGoiVoi + " | api thue goi " + thue.soLanGoi + " lan");

        kho.nem = new IllegalStateException("DB sap");
        try { dv.tinhTien(9); System.out.println("3) khong nem — SAI"); }
        catch (IllegalStateException e) { System.out.println("3) DB sap -> bat duoc: " + e.getMessage()); }

        kho.nem = null; kho.traVe = 0; thue.traVe = 0.08;
        System.out.println("4) don rong -> " + dv.tinhTien(1));

        kho.traVe = 500; thue.traVe = 0.2;
        double a = dv.tinhTien(3), b = dv.tinhTien(3);
        System.out.println("5) chay hai lan -> giong nhau? " + (a == b) + " (" + a + ")");
        System.out.println("6) tong so lan cham kho -> " + kho.daGoiVoi.size());
    }
}`,
  },
};
