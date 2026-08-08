/**
 * Thẻ bài học "100 Ngày Java" — Ngày 22: checked vs unchecked, throw, ngoại
 * lệ tự viết.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-22.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 22,
  total: 100,
  titleLead: 'Java Day 22:',
  titleAccent: 'checked vs unchecked',
  subtitle: 'throw · throws · ngoại lệ nghiệp vụ của riêng bạn 🧯',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HAI HỌ, HAI CÁCH ĐỐI XỬ 🧯',
      code: `Files.readString(...)   // ✗ unreported exception IOException;
                        //   must be caught or declared to be thrown
10 / 0                  // dich binh thuong, chay moi no`,
      notes: [
        { mark: 'dot', text: '**checked** (`Exception`): trình dịch BẮT bạn đối mặt — chuyện ngoài tầm kiểm soát' },
        { mark: 'dot', text: '**unchecked** (`RuntimeException`): lỗi do code sai — sửa code, đừng catch' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. throw NÉM · throws KHAI BÁO 🎯',
      code: `void rut(double t) throws KhongDuTienException {   // khai báo
    if (t > soDu) throw new KhongDuTienException(t - soDu);  // ném
}`,
      notes: [
        { mark: 'ok', text: '`throws` là **một phần chữ ký** — người gọi buộc phải biết' },
        { mark: 'no', text: 'Đừng `throws Exception` cho gọn: mất sạch thông tin, người gọi không xử lý riêng được' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NGOẠI LỆ CỦA RIÊNG BẠN ✍️',
      code: `class KhongDuTienException extends Exception {
    private final double thieu;                 // mang theo DỮ LIỆU
    KhongDuTienException(double thieu) {
        super("Thieu " + thieu + " d");
        this.thieu = thieu;
    }
    double getThieu() { return thieu; }
}`,
      notes: [
        { mark: 'ok', text: 'Tên nói đúng nghiệp vụ, kèm số liệu để người gọi xử lý được' },
        { mark: 'dot', text: 'Kế thừa `Exception` = checked · kế thừa `RuntimeException` = unchecked' },
      ],
    },
    {
      tone: 'green',
      title: '4. BỌC LẠI — ĐỪNG LÀM MẤT GỐC 🔗',
      code: `catch (KhongDuTienException e) {
    throw new RuntimeException("Giao dich that bai", e);   // ← cause
}
// Giao dich that bai <- Thieu 9399.0 d`,
      notes: [{ mark: 'no', text: 'Quên tham số `e` là mất sạch stack trace gốc — chỗ thật sự hỏng biến mất' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Người gọi **làm được gì đó** → checked · lỗi lập trình → unchecked' },
        { mark: 'next', text: '**Ngày 23**: try-with-resources — đóng tài nguyên không cần `finally`' },
      ],
    },
  ],

  /* Output THẬT của `java NganHang` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) Thieu 500.0 d | thieu 500.0',
      '2) So tien phai duong, nhan duoc -50.0',
      '3) rut 400 xong, so du 600.0',
      '4) Giao dich that bai <- Thieu 9399.0 d',
    ],
  },

  verify: {
    className: 'NganHang',
    source: `class KhongDuTienException extends Exception {
    private final double thieu;
    KhongDuTienException(double thieu) {
        super("Thieu " + thieu + " d");
        this.thieu = thieu;
    }
    double getThieu() { return thieu; }
}

class SoTienAmException extends RuntimeException {
    SoTienAmException(double so) { super("So tien phai duong, nhan duoc " + so); }
}

class TaiKhoan {
    private double soDu;
    TaiKhoan(double soDu) { this.soDu = soDu; }

    void rut(double tien) throws KhongDuTienException {
        if (tien <= 0) throw new SoTienAmException(tien);
        if (tien > soDu) throw new KhongDuTienException(tien - soDu);
        soDu -= tien;
    }

    double getSoDu() { return soDu; }
}

public class NganHang {
    public static void main(String[] args) {
        TaiKhoan tk = new TaiKhoan(1000);

        try {
            tk.rut(1500);
        } catch (KhongDuTienException e) {
            System.out.println("1) " + e.getMessage() + " | thieu " + e.getThieu());
        }

        try {
            tk.rut(-50);
        } catch (SoTienAmException e) {
            System.out.println("2) " + e.getMessage());
        } catch (KhongDuTienException e) {
            System.out.println("khong toi day");
        }

        try {
            tk.rut(400);
            System.out.println("3) rut 400 xong, so du " + tk.getSoDu());
        } catch (KhongDuTienException e) {
            System.out.println("loi");
        }

        try {
            try {
                tk.rut(9999);
            } catch (KhongDuTienException e) {
                throw new RuntimeException("Giao dich that bai", e);
            }
        } catch (RuntimeException e) {
            System.out.println("4) " + e.getMessage() + " <- " + e.getCause().getMessage());
        }
    }
}`,
  },
};
