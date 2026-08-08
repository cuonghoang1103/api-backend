/**
 * Thẻ bài học "100 Ngày Java" — Ngày 37: enum.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-37.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 37,
  total: 100,
  titleLead: 'Java Day 37:',
  titleAccent: 'enum',
  subtitle: 'Tập giá trị cố định — để trình dịch canh thay bạn 🎚️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. GÕ SAI LÀ KHÔNG DỊCH ĐƯỢC 🎚️',
      code: `String t = "DANG_GAIO";        // ✗ go sai — chuong trinh van chay
if (t.equals("DANG_GIAO"))     //   dieu kien khong bao gio dung

TrangThai t = TrangThai.DANG_GAIO;   // ✗ LOI LUC DICH`,
      notes: [
        { mark: 'ok', text: 'So sánh bằng `==` được (khác `String` — **Ngày 09**): mỗi hằng chỉ có MỘT đối tượng' },
        { mark: 'dot', text: '`valueOf("go_sai")` → `IllegalArgumentException`, không âm thầm' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ENUM CỦA JAVA LÀ MỘT CLASS THẬT 🏗️',
      code: `enum TrangThai {
    DANG_GIAO("Dang giao", false),
    HOAN_TAT("Hoan tat", true);

    private final String nhan;      // co FIELD
    TrangThai(String nhan, boolean k) { … }   // co CONSTRUCTOR
    boolean daKetThuc() { return ketThuc; }   // co METHOD
}`,
      notes: [{ mark: 'ok', text: 'Khác hẳn enum của C/JS — đây là class, chứa được dữ liệu và hành vi' }],
    },
    {
      tone: 'pink',
      title: '3. ĐẶT LUẬT NGAY TRONG ENUM 🧠',
      code: `TrangThai tiepTheo() {
    switch (this) {
        case CHO_XAC_NHAN: return DANG_GIAO;
        case DANG_GIAO:    return HOAN_TAT;
        default:           return this;
    }
}`,
      notes: [{ mark: 'ok', text: 'Luật chuyển trạng thái nằm cùng chỗ với trạng thái — không rải khắp chương trình' }],
    },
    {
      tone: 'green',
      title: '4. BỘ ĐỒ NGHỀ ĐI KÈM 🧰',
      code: `values()      // [CHO_XAC_NHAN, DANG_GIAO, HOAN_TAT, DA_HUY]
valueOf("DANG_GIAO")   ordinal()   name()
EnumMap / EnumSet      // nhanh, giu THU TU KHAI BAO`,
      notes: [
        { mark: 'no', text: 'ĐỪNG lưu `ordinal()` xuống DB — chèn một hằng mới ở giữa là lệch hết dữ liệu cũ' },
        { mark: 'ok', text: 'Lưu `name()` (chuỗi) hoặc một mã riêng do bạn đặt' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Tập giá trị đóng và biết trước → `enum`, đừng dùng `String`/`int`' },
        { mark: 'next', text: '**Ngày 38**: `record` — class chỉ để chở dữ liệu, viết một dòng' },
      ],
    },
  ],

  /* Output THẬT của `java DonHang` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) CHO_XAC_NHAN | nhan=Cho xac nhan | ket thuc? false',
      '2) tiep theo -> DANG_GIAO -> HOAN_TAT',
      '3) tat ca -> [CHO_XAC_NHAN, DANG_GIAO, HOAN_TAT, DA_HUY]',
      '6) go sai -> IllegalArgumentException',
      '7) so bang == -> true',
      '8) EnumMap giu thu tu khai bao -> {CHO_XAC_NHAN=7, DA_HUY=3}',
    ],
  },

  verify: {
    className: 'DonHang',
    source: `import java.util.*;

enum TrangThai {
    CHO_XAC_NHAN("Cho xac nhan", false),
    DANG_GIAO("Dang giao", false),
    HOAN_TAT("Hoan tat", true),
    DA_HUY("Da huy", true);

    private final String nhan;
    private final boolean ketThuc;

    TrangThai(String nhan, boolean ketThuc) {
        this.nhan = nhan;
        this.ketThuc = ketThuc;
    }

    String getNhan() { return nhan; }
    boolean daKetThuc() { return ketThuc; }

    TrangThai tiepTheo() {
        switch (this) {
            case CHO_XAC_NHAN: return DANG_GIAO;
            case DANG_GIAO: return HOAN_TAT;
            default: return this;
        }
    }
}

public class DonHang {
    public static void main(String[] args) {
        TrangThai t = TrangThai.CHO_XAC_NHAN;
        System.out.println("1) " + t + " | nhan=" + t.getNhan() + " | ket thuc? " + t.daKetThuc());
        System.out.println("2) tiep theo -> " + t.tiepTheo() + " -> " + t.tiepTheo().tiepTheo());

        System.out.println("3) tat ca -> " + Arrays.toString(TrangThai.values()));

        try { TrangThai.valueOf("DANG_GAIO"); }
        catch (IllegalArgumentException e) { System.out.println("6) go sai -> IllegalArgumentException"); }

        TrangThai a = TrangThai.HOAN_TAT, b = TrangThai.valueOf("HOAN_TAT");
        System.out.println("7) so bang == -> " + (a == b));

        EnumMap<TrangThai, Integer> dem = new EnumMap<>(TrangThai.class);
        dem.put(TrangThai.DA_HUY, 3);
        dem.put(TrangThai.CHO_XAC_NHAN, 7);
        System.out.println("8) EnumMap giu thu tu khai bao -> " + dem);
    }
}`,
  },
};
