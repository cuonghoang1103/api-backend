/** "100 Ngày Java với CuongThai" — Ngày 36: StringBuilder & xử lý chuỗi.
    Nối chỗ Ngày 35 kết (vòng lặp `s += i` 100.000 lần). Dựa hẳn vào tính
    bất biến của String đã dạy ở Ngày 09. Ngày 37 (enum) trỏ ngược về
    phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. Phép
    đo KHÔNG in số mili-giây vì con số đó đổi mỗi lần chạy — nó in một
    kết luận ổn định để thẻ so khớp được. */
export default {
  day: 36,
  card: 'java-day-36',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-word-frequency-analyzer-using-collections',
    title: 'Bộ đếm tần suất từ',
  },

  content: `⚡ 100 NGÀY JAVA — NGÀY 36: STRINGBUILDER

Hôm qua tôi để lại dòng này:

\`\`\`java
String s = "";
for (int i = 0; i < 100000; i++) s += i;
\`\`\`

Trông vô hại. Thực tế nó là một trong những đoạn code chậm nhất mà người mới hay viết — và lý do nằm ở bài Ngày 9.

━━━━━━━━━━━━━━━━━━━━

📌 VÌ SAO CHẬM: String BẤT BIẾN

\`String\` không sửa được. Nên \`s += "x"\` KHÔNG phải "thêm x vào s". Nó là:

1. Cấp một mảng ký tự mới, dài hơn cũ 1 ô
2. Chép TOÀN BỘ nội dung cũ sang
3. Thêm "x" vào cuối
4. Bỏ chuỗi cũ cho bộ dọn rác

Vòng thứ 1 chép 1 ký tự. Vòng thứ 40.000 chép 40.000 ký tự. Tổng cộng là hàng tỷ thao tác chép cho một việc lẽ ra rất rẻ — chi phí tăng theo BÌNH PHƯƠNG số vòng.

\`StringBuilder\` giữ một bộ đệm sửa được, chỉ ghi thêm vào cuối và chỉ cấp mảng mới khi hết chỗ:

\`\`\`java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 50000; i++) sb.append("x");
String s = sb.toString();
\`\`\`

Đo thật với 50.000 vòng:

\`\`\`
1) hai cach cho ket qua giong nhau? true (do dai 50000)
2) StringBuilder nhanh hon it nhat 10 lan? true
\`\`\`

Kết quả y hệt nhau. Chỉ khác thời gian — và khoảng cách nới rộng rất nhanh khi số vòng tăng.

(Chương trình cố ý không in số mili-giây: con số đó đổi theo máy và theo lần chạy. Thứ đáng nhớ là bậc chênh lệch, không phải con số cụ thể.)

━━━━━━━━━━━━━━━━━━━━

🧭 NHƯNG ĐỪNG THAY MỌI DẤU +

\`\`\`java
String chao = "Xin chao " + ten + "!";      // ✓ hoàn toàn ổn
\`\`\`

Nối một lần thì trình dịch tự chuyển thành \`StringBuilder\` giúp bạn. Viết tay \`StringBuilder\` ở đây chỉ làm code dài ra mà không nhanh hơn.

Ranh giới rất rõ:

- Nối **một lần**, số phần tử biết trước → cứ dùng \`+\`
- Nối **trong vòng lặp** → bắt buộc \`StringBuilder\`

Lý do: trong vòng lặp, trình dịch phải tạo một \`StringBuilder\` MỚI ở mỗi vòng, nên tối ưu của nó không cứu được gì.

━━━━━━━━━━━━━━━━━━━━

🔧 NHỮNG VIỆC String KHÔNG LÀM ĐƯỢC

\`\`\`java
StringBuilder b = new StringBuilder("Java");
b.append(" 100").insert(0, ">> ").reverse();
\`\`\`

\`\`\`
3) reverse -> 001 avaJ >>
\`\`\`

\`append\` · \`insert\` · \`delete\` · \`replace\` · \`reverse\` · \`setCharAt\` — tất cả sửa TẠI CHỖ, và trả về chính nó nên nối chuỗi lời gọi được.

Còn \`String\` thì mọi method đều trả về chuỗi mới:

\`\`\`
4) chuoi goc bat bien: Java moi | van la Java
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧰 BỘ BA TIỆN TAY

**\`String.format\`** — ghép chuỗi có căn chỉnh:

\`\`\`java
String.format("%-6s|%5.2f|%03d", "An", 9.456, 7);
\`\`\`

\`\`\`
5) An    | 9.46|007
\`\`\`

\`%-6s\` chuỗi căn trái rộng 6 · \`%5.2f\` số thực rộng 5 lấy 2 chữ số thập phân (tự làm tròn) · \`%03d\` số nguyên 3 chữ số đệm 0. Rất hợp để in bảng biểu thẳng hàng.

**\`String.join\`** — nối danh sách có dấu ngăn:

\`\`\`
7) join -> a - b - c
\`\`\`

Không còn cảnh nối rồi phải cắt dấu phẩy thừa ở cuối.

**Text block** (Java 15+) — chuỗi nhiều dòng:

\`\`\`java
String json = """
        {
          "ten": "An"
        }""";
\`\`\`

\`\`\`
6) text block co 3 dong, khong can escape dau nhay
\`\`\`

Không \`\\n\`, không escape dấu nháy kép. Nhúng JSON, SQL, HTML vào code từ nay dễ thở hẳn.

━━━━━━━━━━━━━━━━━━━━

📎 MỘT LƯU Ý VỀ StringBuffer

Bạn sẽ gặp \`StringBuffer\` trong code cũ. Nó giống hệt \`StringBuilder\` nhưng đồng bộ hoá cho đa luồng — và vì thế chậm hơn.

Quy tắc: mặc định dùng \`StringBuilder\`. \`StringBuffer\` chỉ khi thật sự có nhiều luồng ghi vào cùng một bộ đệm, mà chuyện đó hiếm (thường mỗi luồng nên có bộ đệm riêng).

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Nối 100.000 số bằng \`+\` và bằng \`StringBuilder\`, đo thời gian cả hai.
2. Dựng một bảng điểm thẳng hàng bằng \`String.format\`.
3. Đảo ngược một câu bằng \`StringBuilder.reverse()\`, rồi kiểm tra chuỗi đối xứng.
4. Nối danh sách tên bằng \`String.join\` và bằng vòng lặp cắt dấu phẩy cuối — so hai cách.
5. Viết một chuỗi JSON bằng text block và bằng chuỗi thường có \`\\n\` — so độ dễ đọc.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Nối chuỗi trong vòng lặp thì dùng \`StringBuilder\`; nối một lần thì \`+\` vẫn tốt. \`String.format\` để căn chỉnh, \`String.join\` để ghép danh sách, text block để viết chuỗi nhiều dòng.

Giờ nhìn lại một thói quen ta vẫn dùng suốt loạt bài — dùng chuỗi hoặc số để biểu diễn một tập giá trị cố định:

\`\`\`java
String trangThai = "DANG_GIAO";     // hay "dang_giao"? "DangGiao"?
int mucDo = 2;                      // 2 là ERROR hay WARNING?

if (trangThai.equals("DANG_GAIO"))  // gõ sai — trình dịch không hề biết
\`\`\`

Gõ sai một chữ là điều kiện không bao giờ đúng, mà chương trình vẫn dịch, vẫn chạy.

Ngày 37: \`enum\` — cách khai báo một tập giá trị cố định để trình dịch canh giúp bạn, và enum của Java mạnh hơn hẳn enum của C hay JavaScript. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
