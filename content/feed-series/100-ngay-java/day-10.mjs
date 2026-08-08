/** "100 Ngày Java với CuongThai" — Ngày 10, khép lại Giai đoạn 1.
    Bài Ngày 11 (OOP) trỏ ngược về đây bốn lần: method, biến local,
    pass-by-value, shadowing. Giữ đúng bốn khái niệm đó khi sửa. */
export default {
  day: 10,
  card: 'java-day-10',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-prime-number-operations-with-methods',
    title: 'Tách bài toán số nguyên tố thành method',
  },

  content: `📮 100 NGÀY JAVA — NGÀY 10: METHOD & PASS-BY-VALUE

Ngày cuối của Giai đoạn 1. Chín ngày qua mọi thứ đổ dồn vào \`main\`. Hôm nay ta học cắt nó ra thành các khối có tên — và giải quyết một câu hỏi mà dân Java tranh cãi trên diễn đàn suốt hai mươi năm: Java truyền tham trị hay tham chiếu?

Đáp án ngắn: LUÔN LUÔN là tham trị. Phần thú vị nằm ở chỗ vì sao nhiều người tưởng ngược lại.

━━━━━━━━━━━━━━━━━━━━

📌 GIẢI PHẪU MỘT METHOD

\`\`\`java
static int binhPhuong(int x) { return x * x; }
//     ^kiểu trả về  ^tên      ^tham số

static void inChao(String ten) {          // void = không trả gì
    System.out.println("Chao " + ten);
}
\`\`\`

Còn \`static\` vì ta chưa có đối tượng nào — Ngày 11 sẽ bỏ nó đi ngay khi học class. Tạm hiểu: \`static\` nghĩa là "gọi thẳng từ tên class, không cần đúc đối tượng".

Nạp chồng (overload) — cùng tên, KHÁC danh sách tham số:

\`\`\`java
static int tinh(int a, int b) { return a + b; }
static double tinh(double a, double b) { return a + b; }   // ✓ khác kiểu
// static double tinh(int a, int b)                        ✗ chỉ khác kiểu TRẢ VỀ → lỗi
\`\`\`

Java chọn method theo THAM SỐ, không theo kiểu trả về. Đây là lý do hai method chỉ khác kiểu trả về thì không sống chung được.

━━━━━━━━━━━━━━━━━━━━

📦 JAVA LUÔN pass-by-value

\`\`\`java
static void thuDoi(int so, int[] mang) {
    so = 999;        // đổi BẢN SAO → bên ngoài không hay
    mang[0] = 999;   // đi theo địa chỉ → bên ngoài ĐỔI THẬT
}

int so = 1;
int[] mang = {1};
thuDoi(so, mang);
System.out.println(so);        // 1     ← không đổi
System.out.println(mang[0]);   // 999   ← đổi
\`\`\`

Nhìn qua thì tưởng "số thì tham trị, mảng thì tham chiếu". Sai. Cả hai đều tham trị — Java copy GIÁ TRỊ của biến. Chỉ có điều với mảng, cái giá trị được copy chính là ĐỊA CHỈ. Bản sao địa chỉ vẫn trỏ tới đúng mảng đó, nên sửa phần tử thì bên ngoài thấy.

Bằng chứng quyết định:

\`\`\`java
static void thay(int[] mang) {
    mang = new int[]{7, 8, 9};   // gán lại BẢN SAO địa chỉ
}
int[] a = {1, 2, 3};
thay(a);
System.out.println(a[0]);   // 1 — KHÔNG đổi!
\`\`\`

Nếu Java truyền tham chiếu thật thì \`a\` đã trỏ sang mảng mới. Nó không. Vì cái được truyền vào chỉ là một BẢN SAO của địa chỉ.

Đây cũng chính là lý do \`for (int x : mang) x *= 2;\` ở Ngày 6 không đổi được mảng.

━━━━━━━━━━━━━━━━━━━━

🚫 BIẾN LOCAL KHÔNG CÓ GIÁ TRỊ MẶC ĐỊNH

\`\`\`java
int x;
System.out.println(x);   // ✗ lỗi DỊCH: variable x might not have been initialized
\`\`\`

Khác hẳn phần tử mảng ở Ngày 8 (mặc định 0). Biến local sống trên STACK: sinh ra khi vào method, chết khi thoát. Java bắt bạn gán trước khi dùng, chặn hẳn một lớp bug về giá trị rác.

Ghi nhớ điều này — Ngày 11 field của class LẠI CÓ mặc định, và sự khác biệt đó gây nhầm lẫn cho rất nhiều người.

━━━━━━━━━━━━━━━━━━━━

🌓 SHADOWING — TÊN CHE TÊN

\`\`\`java
static int cong(int a, int b) {
    int a = 5;      // ✗ lỗi: đã có tham số tên a rồi
    return a + b;
}
\`\`\`

Trong method thì trùng tên là lỗi luôn. Nhưng ở Ngày 11, tham số trùng tên FIELD lại hoàn toàn hợp lệ — và đó chính là lúc bắt buộc phải viết \`this.ten = ten;\`. Nhớ chữ "shadowing" hôm nay, mai gặp lại ngay.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tách chương trình tính điểm trung bình thành 3 method: nhập, tính, in.
2. Viết \`swap(int a, int b)\` rồi kiểm chứng nó KHÔNG hoán đổi được — giải thích.
3. Viết \`swap(int[] a, int i, int j)\` và kiểm chứng nó hoán đổi được — giải thích khác biệt.
4. Viết \`thay(int[] mang)\` gán \`mang = new int[]{7,8,9}\` rồi in mảng gốc.
5. Nạp chồng \`tinh\` cho \`int\`, \`double\`, và \`String\` — gọi cả ba, xem Java chọn đúng không.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — HẾT GIAI ĐOẠN 1

Mười ngày qua bạn đã có: biến và kiểu, toán tử và cạm bẫy số học, nhập xuất, rẽ nhánh, vòng lặp, mảng và tham chiếu, chuỗi và \`equals\`, method và pass-by-value. Đó là toàn bộ nền của một lập trình viên Java.

Nhưng để ý một điều: dữ liệu và hành vi vẫn đang sống tách rời. Muốn quản lý 30 sinh viên là phải xoay xở với ba bốn mảng chạy song song — \`ten[i]\`, \`diem[i]\` — rời rạc và mong manh.

Ngày 11 mở Giai đoạn 2: lập trình hướng đối tượng. Ý tưởng lớn là gom dữ liệu và hành vi của cùng một "thứ" vào chung một nhà — nhà đó tên là CLASS, và mỗi bản thể đúc ra từ nó là một OBJECT. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
