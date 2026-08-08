/**
 * Thẻ bài học "100 Ngày Java" — Ngày 17: abstract.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-17.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 17,
  total: 100,
  titleLead: 'Java Day 17:',
  titleAccent: 'abstract',
  subtitle: 'Cha nêu yêu cầu, con bắt buộc phải làm — bản thiết kế chứ không phải sản phẩm 📐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. METHOD KHÔNG CÓ THÂN 📐',
      code: `abstract class ThongBao {
    abstract void gui(String noiDung);   // dấu ; thay cho { }
    void guiKemNhatKy(String s) {        // method thường vẫn viết sẵn
        System.out.println("[log] …");
        gui(s);                          // gọi phần con phải tự làm
    }
}`,
      notes: [
        { mark: 'ok', text: 'Trộn được **cả hai**: phần chung viết sẵn, phần riêng để trống' },
        { mark: 'dot', text: 'Ngày 16 phải trả `return 0` vô nghĩa — nay không cần bịa nữa' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KHÔNG new ĐƯỢC 🚫',
      code: `Hinh h = new Hinh();
// ✗ Hinh is abstract; cannot be instantiated`,
      notes: [
        { mark: 'ok', text: 'Bản thiết kế thì không ở được — phải đúc lớp con cụ thể' },
        { mark: 'dot', text: 'Nhưng abstract **vẫn có constructor** để lớp con gọi `super(…)`' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CON QUÊN LÀ KHÔNG DỊCH ĐƯỢC ⚠️',
      code: `class Vuong extends Hinh { }
// ✗ Vuong is not abstract and does not override
//   abstract method dienTich() in Hinh`,
      notes: [
        { mark: 'ok', text: 'Ngày 16 quên ghi đè thì âm thầm nhận 0 — nay **lỗi lúc dịch**' },
        { mark: 'dot', text: 'Hợp đồng có người canh: sai thì chương trình không chạy nổi' },
      ],
    },
    {
      tone: 'green',
      title: '4. KHUNG XƯƠNG (Template Method) 🦴',
      code: `void guiKemNhatKy(String s) {   // cha giữ TRÌNH TỰ
    log("truoc");
    gui(s);                     // con điền BƯỚC RIÊNG
    log("sau");
}`,
      notes: [{ mark: 'ok', text: 'Trình tự viết một lần ở cha — thêm kênh gửi mới không ai chép lại nhật ký' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`abstract` = "LÀ MỘT" + có phần chung viết sẵn + bắt buộc con hoàn thiện' },
        { mark: 'next', text: '**Ngày 18**: `interface` — nhiều vai cùng lúc, thứ `extends` không cho' },
      ],
    },
  ],

  /* Output THẬT của `java ThongBaoDemo` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '[log] chuan bi gui toi an@abc.com',
      'EMAIL -> an@abc.com: Diem thi da co, vao xem ngay nhe',
      '[log] chuan bi gui toi 0912345678',
      'SMS   -> 0912345678: Diem thi da co, vao',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java.

     `Math.min(19, …)` chứ không phải 20: cắt ở 20 thì dòng SMS kết thúc bằng
     một dấu cách, và một khoảng trắng vô hình ở cuối dòng đủ làm phép so
     output thất bại mà nhìn mắt thường không thấy gì sai. */
  verify: {
    className: 'ThongBaoDemo',
    source: `abstract class ThongBao {
    protected String nguoiNhan;

    ThongBao(String nguoiNhan) { this.nguoiNhan = nguoiNhan; }

    abstract void gui(String noiDung);

    void guiKemNhatKy(String noiDung) {
        System.out.println("[log] chuan bi gui toi " + nguoiNhan);
        gui(noiDung);
    }
}

class Email extends ThongBao {
    Email(String nguoiNhan) { super(nguoiNhan); }
    @Override void gui(String noiDung) {
        System.out.println("EMAIL -> " + nguoiNhan + ": " + noiDung);
    }
}

class SMS extends ThongBao {
    SMS(String nguoiNhan) { super(nguoiNhan); }
    @Override void gui(String noiDung) {
        System.out.println("SMS   -> " + nguoiNhan + ": " + noiDung.substring(0, Math.min(19, noiDung.length())));
    }
}

public class ThongBaoDemo {
    public static void main(String[] args) {
        ThongBao[] ds = { new Email("an@abc.com"), new SMS("0912345678") };
        for (ThongBao t : ds) t.guiKemNhatKy("Diem thi da co, vao xem ngay nhe");
    }
}`,
  },
};
