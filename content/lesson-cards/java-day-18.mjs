/**
 * Thẻ bài học "100 Ngày Java" — Ngày 18: interface.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-18.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`. Đó là toàn bộ lý do dùng HTML thay vì
 * mô hình sinh ảnh: thẻ dạy học mà code sai thì người mới chép về không chạy
 * được, và ảnh thì không sửa được — chỉ có vẽ lại rồi cầu may.
 * Mã nguồn kiểm chứng cho ngày này: xem `verify` ở cuối file.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 18,
  total: 100,
  titleLead: 'Java Day 18:',
  titleAccent: 'interface',
  subtitle: 'Hợp đồng thuần tuý — một class ký được bao nhiêu cái tuỳ thích 🤝',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NHIỀU VAI CÙNG LÚC 🤝',
      code: `interface BatTat { void bat(); void tat(); }
interface DoDuoc { String doGiaTri(); }

class DenLed implements BatTat, DoDuoc { … }
// extends: 1 cha · implements: bao nhiêu cũng được`,
      notes: [
        { mark: 'ok', text: '`extends` = **LÀ MỘT** · `implements` = **LÀM ĐƯỢC**' },
        { mark: 'dot', text: 'Quên viết một method: *is not abstract and does not override…*' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. default — THÊM METHOD KHÔNG PHÁ AI ⚙️',
      code: `interface BatTat {
    void bat();  void tat();
    default void batLai() { tat(); bat(); }   // có thân sẵn
}`,
      notes: [
        { mark: 'ok', text: 'Java 8 thêm được method mới mà **triệu dòng code cũ vẫn dịch** — đó là cách `List.sort` ra đời' },
        { mark: 'dot', text: 'Lớp con vẫn ghi đè `default` được nếu muốn làm khác' },
      ],
    },
    {
      tone: 'pink',
      title: '3. KHÔNG CÓ TRẠNG THÁI 🚫',
      code: `interface C { int MAX = 10; }   // ngầm public static final
MAX = 20;   // ✗ cannot assign a value to
            //   static final variable MAX`,
      notes: [
        { mark: 'no', text: 'Interface **không có field thường** — mọi field đều là hằng số' },
        { mark: 'ok', text: 'Cần lưu trạng thái + phần chung? Đó là `abstract class` (**Ngày 17**)' },
      ],
    },
    {
      tone: 'green',
      title: '4. CHỌN CÁI NÀO? 🧭',
      code: `abstract class → LÀ MỘT + có phần chung + có trạng thái
interface      → LÀM ĐƯỢC + nhiều vai + không trạng thái

// Java thật: List, Comparable, Runnable đều là interface`,
      notes: [{ mark: 'ok', text: 'Nghi ngờ thì chọn `interface` — nó ràng buộc ít hơn, sau này đổi dễ hơn' }],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Lập trình theo **hợp đồng**, không theo class cụ thể' },
        { mark: 'next', text: '**Ngày 19**: `CÓ MỘT` — khi kế thừa là lựa chọn sai' },
      ],
    },
  ],

  /* Output THẬT của `java NhaThongMinh` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'Den bep: TAT',
      'Den bep: BAT',
      '   (da bat lai)',
      'Quat: cho canh dung han roi moi bat lai',
      'Den ngu: BAT',
      'Den ngu dang sang | don vi SI',
    ],
  },

  /* Chương trình dùng để sinh ra `proof`. Script sẽ biên dịch + chạy lại nó
     mỗi lần render và DỪNG nếu output khác `proof.lines` — nên thẻ không thể
     nói dối về hành vi của Java. */
  verify: {
    className: 'NhaThongMinh',
    source: `interface BatTat {
    void bat();
    void tat();
    default void batLai() {
        tat(); bat();
        System.out.println("   (da bat lai)");
    }
}

interface DoDuoc {
    String doGiaTri();
    static String donVi() { return "SI"; }
}

class DenLed implements BatTat, DoDuoc {
    private boolean dangBat = false;
    private String ten;
    DenLed(String ten) { this.ten = ten; }

    @Override public void bat() { dangBat = true;  System.out.println(ten + ": BAT"); }
    @Override public void tat() { dangBat = false; System.out.println(ten + ": TAT"); }
    @Override public String doGiaTri() { return ten + " dang " + (dangBat ? "sang" : "tat"); }
}

class Quat implements BatTat {
    @Override public void bat() { System.out.println("Quat: BAT"); }
    @Override public void tat() { System.out.println("Quat: TAT"); }
    @Override public void batLai() {
        System.out.println("Quat: cho canh dung han roi moi bat lai");
    }
}

public class NhaThongMinh {
    public static void main(String[] args) {
        BatTat[] thietBi = { new DenLed("Den bep"), new Quat() };
        for (BatTat t : thietBi) t.batLai();

        DenLed den = new DenLed("Den ngu");
        den.bat();
        System.out.println(den.doGiaTri() + " | don vi " + DoDuoc.donVi());
    }
}`,
  },
};
