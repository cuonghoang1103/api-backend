/** "100 Ngày Java với CuongThai" — Ngày 18: interface.
    Trả lời chỗ Ngày 17 bỏ ngỏ: một class chỉ có một cha, vậy làm sao mang
    nhiều vai. Ngày 19 (composition) trỏ ngược về phần kết ở đây.

    Mọi output và thông điệp lỗi trong bài là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 18,
  card: 'java-day-18',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-smart-home-hub-with-conflicting-interface-defaults',
    title: 'Hub nhà thông minh và xung đột default method',
  },

  content: `🤝 100 NGÀY JAVA — NGÀY 18: INTERFACE

Hôm qua ta dừng ở một bức tường: một class chỉ có ĐÚNG MỘT cha. Nhưng đời thật thì một thứ mang nhiều vai cùng lúc — cái đèn LED vừa BẬT/TẮT được, vừa ĐO được điện năng, vừa nối mạng được.

\`extends\` không giúp gì ở đây. Cần một thứ khác.

━━━━━━━━━━━━━━━━━━━━

📌 HỢP ĐỒNG, KHÔNG PHẢI HUYẾT THỐNG

\`\`\`java
interface BatTat {
    void bat();
    void tat();
}

interface DoDuoc {
    String doGiaTri();
}

class DenLed implements BatTat, DoDuoc {    // ký HAI hợp đồng
    @Override public void bat() { … }
    @Override public void tat() { … }
    @Override public String doGiaTri() { … }
}
\`\`\`

Khác biệt nằm ở ngữ nghĩa, không phải cú pháp:

- \`extends\` trả lời **"LÀ MỘT"** — XeMay LÀ MỘT PhuongTien (Ngày 15).
- \`implements\` trả lời **"LÀM ĐƯỢC"** — DenLed BẬT TẮT ĐƯỢC.

Một class có đúng một dòng dõi, nhưng ký bao nhiêu hợp đồng cũng được.

Quên thực hiện một điều khoản thì y hệt Ngày 17:

\`\`\`java
interface Chay { void chay(); }
class Thieu implements Chay { }
// ✗ error: Thieu is not abstract and does not override
//   abstract method chay() in Chay
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚙️ default — THÊM METHOD MÀ KHÔNG PHÁ AI

Trước Java 8, interface chỉ được chứa method rỗng. Điều đó sinh ra một vấn đề rất thực tế: thêm một method vào interface là làm vỡ MỌI class đã implements nó — kể cả code của người khác, kể cả code bạn không sửa được.

\`\`\`java
interface BatTat {
    void bat();
    void tat();
    default void batLai() {        // có thân sẵn
        tat(); bat();
        System.out.println("   (da bat lai)");
    }
}
\`\`\`

Class cũ không cần biết \`batLai()\` tồn tại vẫn dịch được như thường. Class nào muốn làm khác thì ghi đè:

\`\`\`java
class Quat implements BatTat {
    @Override public void batLai() {
        System.out.println("Quat: cho canh dung han roi moi bat lai");
    }
}
\`\`\`

Chạy thật:

\`\`\`
Den bep: TAT
Den bep: BAT
   (da bat lai)
Quat: cho canh dung han roi moi bat lai
\`\`\`

Đây không phải tính năng cho vui — nó là cách Java 8 thêm được \`stream()\` vào \`Collection\` và \`sort()\` vào \`List\` mà không làm vỡ hàng triệu dòng code đang chạy trên thế giới.

━━━━━━━━━━━━━━━━━━━━

🚫 INTERFACE KHÔNG GIỮ TRẠNG THÁI

\`\`\`java
interface C { int MAX = 10; }        // ngầm public static final

MAX = 20;   // ✗ error: cannot assign a value to
            //   static final variable MAX
\`\`\`

Mọi field trong interface đều tự động là \`public static final\` — tức hằng số (Ngày 14). Interface mô tả bạn LÀM ĐƯỢC gì, không mô tả bạn CÓ gì.

Đây là ranh giới rõ nhất với \`abstract class\` của hôm qua: abstract class giữ được \`protected String nguoiNhan\`, interface thì không.

━━━━━━━━━━━━━━━━━━━━

🧭 CHỌN abstract HAY interface?

| | \`abstract class\` | \`interface\` |
|---|---|---|
| Quan hệ | LÀ MỘT | LÀM ĐƯỢC |
| Số lượng | 1 cha | bao nhiêu cũng được |
| Trạng thái | có field thường | chỉ hằng số |
| Phần chung | method thường | \`default\` |

Nghi ngờ thì chọn \`interface\`: nó ràng buộc ít hơn, và một class đã \`extends\` ai rồi thì vẫn ký thêm được.

Nhìn vào chính thư viện Java sẽ thấy triết lý này: \`List\`, \`Map\`, \`Comparable\`, \`Runnable\` — tất cả đều là interface. Bạn viết code với \`List\`, còn bên dưới là \`ArrayList\` hay \`LinkedList\` thì đổi lúc nào cũng được, không ai phải sửa theo. Đó gọi là **lập trình theo hợp đồng, không theo hiện thực**.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`interface CoTheBay { void bay(); }\` và \`CoTheBoi { void boi(); }\`; cho \`Vit\` ký cả hai.
2. Bỏ một method chưa viết rồi đọc lỗi.
3. Thêm \`default void gioiThieu()\` vào một interface — kiểm chứng class cũ vẫn dịch được.
4. Ghi đè cái \`default\` đó ở một class và giữ nguyên ở class khác, chạy cả hai.
5. Cho một class \`implements\` hai interface có CÙNG một \`default\` trùng tên — đọc lỗi và tự tìm cách gỡ (gợi ý: \`Ten.super.method()\`).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`interface\` là hợp đồng: nói bạn LÀM ĐƯỢC gì, không nói bạn LÀ AI. Một class ký bao nhiêu cũng được, \`default\` cho phép thư viện tiến hoá mà không phá code cũ, và không có trạng thái nào để tranh chấp.

Bốn ngày qua ta đi hết bộ công cụ tái sử dụng: kế thừa, đa hình, abstract, interface. Nhưng có một câu hỏi chưa ai trả lời thẳng:

\`\`\`java
class DanhSachSinhVien extends ArrayList { … }
\`\`\`

Ngày 15 tôi bảo câu này sai, nhưng chưa nói phải làm thế nào cho đúng.

Ngày 19: **CÓ MỘT thay vì LÀ MỘT** — composition, thứ mà dân trong nghề tổng kết thành một câu: "ưu tiên hợp thành hơn kế thừa". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
