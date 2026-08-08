/**
 * Thẻ bài học "100 Ngày Java" — Ngày 20: equals · hashCode · toString.
 * Khép Giai đoạn 2 (OOP).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-20.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 20,
  total: 100,
  titleLead: 'Java Day 20:',
  titleAccent: 'equals · hashCode',
  subtitle: 'Ba method của Object và cái hợp đồng phá là mất dữ liệu 🧾',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BẢN MẶC ĐỊNH VÔ DỤNG 🧾',
      code: `PhanSo a = new PhanSo(1,2), b = new PhanSo(1,2);
a.equals(b)     // false — Object.equals chi so DIA CHI
a.toString()    // PhanSo@1b6d3586`,
      notes: [
        { mark: 'dot', text: 'Ngày 15: mọi class ngầm kế thừa `Object` — đây là ba món thừa hưởng' },
        { mark: 'ok', text: 'Đúng cái bẫy `equals` của **Ngày 09 & 11**, nay mới vá được' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. VIẾT ĐÈ equals ĐÚNG CÁCH ✍️',
      code: `@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof PhanSo p)) return false;   // null cũng vào đây
    return tu == p.tu && mau == p.mau;
}`,
      notes: [
        { mark: 'no', text: 'Tham số PHẢI là `Object` — để `PhanSo` là **nạp chồng** (Ngày 10), không phải ghi đè' },
        { mark: 'ok', text: '`@Override` bắt được đúng lỗi đó ngay lúc dịch' },
      ],
    },
    {
      tone: 'pink',
      title: '3. HỢP ĐỒNG: equals ⇒ hashCode 🤝',
      code: `@Override public int hashCode() { return Objects.hash(tu, mau); }

// HashSet cung 2 phan so 1/2:
//   co hashCode  -> 1 phan tu
//   khong co     -> 2 phan tu (trung lap!)`,
      notes: [
        { mark: 'no', text: 'Bằng nhau mà khác `hashCode` ⇒ `HashMap`/`HashSet` **mất dấu** đối tượng' },
        { mark: 'ok', text: 'Viết `equals` thì viết luôn `hashCode` — cùng đúng bộ field' },
      ],
    },
    {
      tone: 'green',
      title: '4. toString — MÓN QUÀ CHO CHÍNH BẠN 🎁',
      code: `@Override public String toString() { return tu + "/" + mau; }

System.out.println(a);        // 1/2  thay vi PhanSo@1b6d3586
System.out.println(dsPhanSo); // [1/2, 3/4]`,
      notes: [{ mark: 'ok', text: 'In log, gỡ lỗi, xem danh sách — tốn 1 dòng, đỡ cả buổi mò' }],
    },
    {
      tone: 'blue',
      title: '5. HẾT GIAI ĐOẠN 2 🏁',
      notes: [
        { mark: 'ok', text: 'Class · constructor · đóng gói · static · kế thừa · đa hình · abstract · interface · hợp thành' },
        { mark: 'next', text: '**Ngày 21**: Ngoại lệ — `try/catch`, checked vs unchecked' },
      ],
    },
  ],

  /* Output THẬT của `java PhanSo` trên JDK 21 — không phải viết tay.
     Dòng 2 đã che phần địa chỉ băm: nó đổi sau mỗi lần chạy, để nguyên thì
     phép so output sẽ hỏng ngẫu nhiên. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) chua ghi de: equals -> false',
      '2) toString mac dinh   -> PhanSoXau@<dia chi>',
      '3) da ghi de: equals   -> true   toString -> 1/2',
      '4) hashCode bang nhau? true',
      '5) HashSet: tot=1 phan tu, xau=2 phan tu',
    ],
  },

  verify: {
    className: 'PhanSo',
    source: `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class PhanSoXau {
    int tu, mau;
    PhanSoXau(int tu, int mau) { this.tu = tu; this.mau = mau; }
}

class PhanSoTot {
    private final int tu, mau;
    PhanSoTot(int tu, int mau) { this.tu = tu; this.mau = mau; }

    @Override public String toString() { return tu + "/" + mau; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PhanSoTot p)) return false;
        return tu == p.tu && mau == p.mau;
    }

    @Override public int hashCode() { return Objects.hash(tu, mau); }
}

public class PhanSo {
    public static void main(String[] args) {
        PhanSoXau x1 = new PhanSoXau(1, 2), x2 = new PhanSoXau(1, 2);
        System.out.println("1) chua ghi de: equals -> " + x1.equals(x2));
        System.out.println("2) toString mac dinh   -> " + x1.toString().replaceAll("@.*", "@<dia chi>"));

        PhanSoTot a = new PhanSoTot(1, 2), b = new PhanSoTot(1, 2);
        System.out.println("3) da ghi de: equals   -> " + a.equals(b) + "   toString -> " + a);
        System.out.println("4) hashCode bang nhau? " + (a.hashCode() == b.hashCode()));

        Set<PhanSoTot> tot = new HashSet<>();
        tot.add(a); tot.add(b);
        Set<PhanSoXau> xau = new HashSet<>();
        xau.add(x1); xau.add(x2);
        System.out.println("5) HashSet: tot=" + tot.size() + " phan tu, xau=" + xau.size() + " phan tu");
    }
}`,
  },
};
