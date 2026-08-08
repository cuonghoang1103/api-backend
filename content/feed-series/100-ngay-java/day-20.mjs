/** "100 Ngày Java với CuongThai" — Ngày 20: equals · hashCode · toString.
    KHÉP GIAI ĐOẠN 2 (OOP, Ngày 11-20). Vá đúng cái bẫy `equals` đã nêu ở
    Ngày 09 và Ngày 11, dùng lại "mọi class kế thừa Object" của Ngày 15 và
    "nạp chồng ≠ ghi đè" của Ngày 10/15.

    Ngày 21 mở Giai đoạn 3 (Ngoại lệ) nên phần kết phải dẫn sang đó.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Phần
    địa chỉ băm trong `toString` mặc định đã được che: nó đổi mỗi lần chạy,
    để nguyên thì phép so output hỏng ngẫu nhiên. */
export default {
  day: 20,
  card: 'java-day-20',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'give-a-fraction-correct-equality',
    title: 'Cho phân số một phép so bằng đúng nghĩa',
  },

  content: `🧾 100 NGÀY JAVA — NGÀY 20: EQUALS · HASHCODE · TOSTRING

Ngày cuối của Giai đoạn 2. Và hôm nay ta trả một món nợ đã kéo dài từ Ngày 9:

\`\`\`java
PhanSo a = new PhanSo(1, 2);
PhanSo b = new PhanSo(1, 2);
a.equals(b);    // false
\`\`\`

Hai phân số một phần hai, nội dung y hệt, mà \`equals\` bảo khác nhau. Ngày 11 tôi giải thích lý do và hẹn sẽ sửa. Hôm nay sửa.

━━━━━━━━━━━━━━━━━━━━

📌 BA MÓN THỪA HƯỞNG TỪ Object

Ngày 15: class không viết \`extends\` thì ngầm kế thừa \`Object\`. Bạn nhận ba method — và cả ba bản mặc định đều gần như vô dụng:

\`\`\`
1) chua ghi de: equals -> false
2) toString mac dinh   -> PhanSoXau@<dia chi>
\`\`\`

- \`equals()\` chỉ so ĐỊA CHỈ, y hệt \`==\`
- \`hashCode()\` sinh từ địa chỉ ô nhớ
- \`toString()\` in ra tên class kèm mã băm — thứ không nói lên điều gì

Với \`String\` thì \`equals\` so nội dung, vì \`String\` đã viết đè. Class của bạn thì chưa ai viết hộ.

━━━━━━━━━━━━━━━━━━━━

✍️ VIẾT ĐÈ equals CHO ĐÚNG

\`\`\`java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                      // cùng địa chỉ: xong ngay
    if (!(o instanceof PhanSo p)) return false;      // khác kiểu, hoặc null
    return tu == p.tu && mau == p.mau;               // so nội dung
}
\`\`\`

Ba dòng, mỗi dòng một nhiệm vụ. Dòng \`instanceof\` gánh luôn cả trường hợp \`null\` — \`null instanceof\` bất cứ gì đều là \`false\`, nên không cần kiểm tra riêng.

**Cái bẫy chết người** nằm ở kiểu tham số:

\`\`\`java
public boolean equals(PhanSo p) { … }   // ✗ KHÔNG phải ghi đè!
\`\`\`

\`Object.equals\` nhận \`Object\`. Đổi thành \`PhanSo\` là cùng tên nhưng KHÁC tham số — theo đúng Ngày 10, đó là NẠP CHỒNG, một method mới toanh. Code vẫn dịch, vẫn chạy, và mọi thứ trong thư viện Java (\`List.contains\`, \`HashMap\`) vẫn gọi bản cũ so địa chỉ.

Đây chính là lúc \`@Override\` cứu bạn: gõ nó vào, trình dịch báo lỗi ngay vì không có method nào như thế để đè.

━━━━━━━━━━━━━━━━━━━━

🤝 HỢP ĐỒNG equals ⇒ hashCode

Đây là luật quan trọng nhất bài hôm nay: **viết \`equals\` thì phải viết \`hashCode\`**, dựa trên đúng bộ field.

\`\`\`java
@Override
public int hashCode() { return Objects.hash(tu, mau); }
\`\`\`

Vì sao bắt buộc? Xem kết quả thật khi cho hai phân số 1/2 vào \`HashSet\`:

\`\`\`
5) HashSet: tot=1 phan tu, xau=2 phan tu
\`\`\`

Bản có \`hashCode\`: nhận ra trùng, giữ 1 phần tử. Bản không có: coi là hai thứ khác nhau, giữ cả 2.

Lý do nằm ở cách \`HashMap\`/\`HashSet\` làm việc: chúng dùng \`hashCode()\` để chọn NGĂN chứa, rồi mới dùng \`equals()\` để so bên trong ngăn đó. Hai đối tượng "bằng nhau" mà rơi vào hai ngăn khác nhau thì không bao giờ được đem ra so — chúng cùng tồn tại, và cái bạn \`put\` vào rồi \`get\` ra sẽ là \`null\`.

Bug kiểu này rất khó lần: không lỗi, không ngoại lệ, chỉ là dữ liệu "biến mất".

━━━━━━━━━━━━━━━━━━━━

🎁 toString — MÓN QUÀ CHO CHÍNH BẠN SAU NÀY

\`\`\`java
@Override
public String toString() { return tu + "/" + mau; }
\`\`\`

Một dòng, và:

\`\`\`java
System.out.println(a);          // 1/2      thay vì PhanSo@1b6d3586
System.out.println(danhSach);   // [1/2, 3/4]
\`\`\`

\`System.out.println\` tự gọi \`toString()\`, và mọi tập hợp cũng gọi nó cho từng phần tử. Log, gỡ lỗi, in danh sách — tất cả đọc được ngay. Đây là thứ rẻ nhất và bạn sẽ cảm ơn chính mình nhiều nhất.

━━━━━━━━━━━━━━━━━━━━

⚖️ NĂM ĐIỀU KHOẢN CỦA equals

Java quy định \`equals\` phải:

1. **Phản xạ** — \`a.equals(a)\` luôn đúng
2. **Đối xứng** — \`a.equals(b)\` thì \`b.equals(a)\`
3. **Bắc cầu** — a=b, b=c thì a=c
4. **Nhất quán** — gọi nhiều lần vẫn cùng kết quả (nếu dữ liệu không đổi)
5. \`a.equals(null)\` luôn **false**

Mẫu ba dòng ở trên thoả cả năm. Một mẹo nữa: dùng field \`final\` (như \`private final int tu, mau\`) thì điều 4 được bảo đảm miễn phí — không ai đổi được nội dung sau khi đối tượng đã nằm trong \`HashSet\`.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`SinhVien\` với \`equals\`/\`hashCode\` theo \`mssv\`, rồi cho hai em cùng mssv vào \`HashSet\`.
2. Xoá \`hashCode\` đi, chạy lại, đếm phần tử — giải thích chênh lệch.
3. Viết \`equals(SinhVien s)\` (sai kiểu tham số) và thêm \`@Override\` — đọc lỗi.
4. Thêm \`toString()\` rồi in thẳng một \`List<SinhVien>\`.
5. Cho một \`SinhVien\` vào \`HashSet\`, ĐỔI \`mssv\` của nó, rồi thử \`contains\` — giải thích vì sao không tìm thấy.

━━━━━━━━━━━━━━━━━━━━

🏁 HẾT GIAI ĐOẠN 2 — BẠN ĐÃ CÓ GÌ

Mười ngày qua: class và object (11), constructor (12), đóng gói (13), static (14), kế thừa (15), đa hình (16), abstract (17), interface (18), hợp thành (19), và hôm nay là hợp đồng với \`Object\`.

Đó là trọn bộ OOP. Từ đây bạn đọc được code Java của người khác, và quan trọng hơn — bạn thiết kế được class thay vì chỉ viết được class.

Nhưng mọi thứ đến giờ đều giả định một điều: chương trình luôn chạy đúng đường. File luôn tồn tại, người dùng luôn nhập số khi được hỏi số, mạng luôn thông, chia thì mẫu số luôn khác 0.

Đời không thế.

Ngày 21 mở Giai đoạn 3: NGOẠI LỆ — \`try\`/\`catch\`/\`finally\`, checked và unchecked, và vì sao \`catch (Exception e) { }\` rỗng là dòng code nguy hiểm nhất mà một người mới có thể viết. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
