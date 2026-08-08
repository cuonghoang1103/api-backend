/**
 * Thẻ bài học "100 Ngày Java" — Ngày 19: Hợp thành (composition).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-19.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 19,
  total: 100,
  titleLead: 'Java Day 19:',
  titleAccent: 'Hợp thành',
  subtitle: 'CÓ MỘT thay vì LÀ MỘT — vì sao kế thừa thư viện là cái bẫy 🧩',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. PHÉP THỬ MỘT CÂU 🧩',
      code: `class LopHoc extends ArrayList<String>   // "LopHoc LÀ MỘT ArrayList"? sai
class LopHoc { private List<String> hocSinh; }  // "CÓ MỘT" — đúng`,
      notes: [
        { mark: 'ok', text: 'Đọc to lên: **LÀ MỘT** nghe sai thì dùng **CÓ MỘT**' },
        { mark: 'dot', text: 'Ngày 15 đã cảnh báo câu này — hôm nay là cách làm đúng' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KẾ THỪA = MỞ TOANG CỬA ⚠️',
      code: `LopSai sai = new LopSai();
sai.add("An");  sai.add("An");  sai.add(null);
// [An, An, null] — trung ten, null, khong ai chan`,
      notes: [
        { mark: 'no', text: 'Thừa hưởng **cả** những việc lớp con không được phép cho làm' },
        { mark: 'dot', text: 'Rút lại không được: `add` đã là `public` từ lớp cha' },
      ],
    },
    {
      tone: 'pink',
      title: '3. HỢP THÀNH = MỘT CỬA CÓ GÁC 🚪',
      code: `boolean themHocSinh(String hs) {
    if (hs == null || hs.isBlank())  return false;
    if (hocSinh.size() >= siSoToiDa) return false;
    if (hocSinh.contains(hs))        return false;
    return hocSinh.add(hs);
}`,
      notes: [
        { mark: 'ok', text: 'Chỉ mở đúng việc cho phép — đóng gói **Ngày 13** đúng nghĩa' },
        { mark: 'ok', text: '`List.copyOf(...)` khi trả danh sách: không rò rỉ tham chiếu' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỔI RUỘT KHÔNG AI BIẾT 🔧',
      code: `private List<String> hocSinh = new ArrayList<>();
// đổi sang LinkedList / TreeSet / database
// → bên ngoài KHÔNG sửa một dòng`,
      notes: [{ mark: 'ok', text: 'Kế thừa khoá chặt vào một hiện thực; hợp thành thì tháo ra lắp lại được' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '"Ưu tiên hợp thành hơn kế thừa" — Gang of Four, và Java thư viện làm đúng thế' },
        { mark: 'next', text: '**Ngày 20**: `equals` · `hashCode` · `toString` — khép Giai đoạn 2' },
      ],
    },
  ],

  /* Output THẬT của `java Lop` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) LopSai chua: [An, An, null]  -> khong ai chan gi ca',
      '2) them An      -> true',
      '3) them An lan 2-> false',
      '5) them Chi(day)-> false',
      '6) si so 2 [An, Binh]',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. (Dòng "4) them Binh" bị lược khỏi bản in cho
     vừa thẻ — chương trình vẫn thêm Binh, xem kết quả ở dòng 6.) */
  verify: {
    className: 'Lop',
    source: `import java.util.ArrayList;
import java.util.List;

class LopSai extends ArrayList<String> { }

class LopHoc {
    private final String ten;
    private final List<String> hocSinh = new ArrayList<>();
    private final int siSoToiDa;

    LopHoc(String ten, int siSoToiDa) { this.ten = ten; this.siSoToiDa = siSoToiDa; }

    boolean themHocSinh(String hs) {
        if (hs == null || hs.isBlank()) return false;
        if (hocSinh.size() >= siSoToiDa) return false;
        if (hocSinh.contains(hs)) return false;
        return hocSinh.add(hs);
    }

    int siSo() { return hocSinh.size(); }
    List<String> danhSach() { return List.copyOf(hocSinh); }
}

public class Lop {
    public static void main(String[] args) {
        LopSai sai = new LopSai();
        sai.add("An");
        sai.add("An");
        sai.add(null);
        System.out.println("1) LopSai chua: " + sai + "  -> khong ai chan gi ca");

        LopHoc lop = new LopHoc("SE1701", 2);
        System.out.println("2) them An      -> " + lop.themHocSinh("An"));
        System.out.println("3) them An lan 2-> " + lop.themHocSinh("An"));
        lop.themHocSinh("Binh");
        System.out.println("5) them Chi(day)-> " + lop.themHocSinh("Chi"));
        System.out.println("6) si so " + lop.siSo() + " " + lop.danhSach());
    }
}`,
  },
};
