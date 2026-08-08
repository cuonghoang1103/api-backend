/** "100 Ngày Java" — Ngày 10: Method & pass-by-value.
    Bài Ngày 11 (OOP) trỏ ngược về đây bốn lần: method, biến local,
    pass-by-value, shadowing. Sửa nội dung thì nhớ giữ đúng bốn khái niệm đó. */
export default {
  series: '100 NGÀY JAVA',
  day: 10,
  total: 100,
  titleLead: 'Java Day 10:',
  titleAccent: 'Method & pass-by-value',
  subtitle: 'Đóng gói hành vi — và sự thật về "truyền tham chiếu" 📮',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. GIẢI PHẪU MỘT METHOD 📮',
      code: `static int binhPhuong(int x) { return x * x; }
//     ^kiểu trả về  ^tên   ^tham số

static void inChao(String ten) { ... }   // void = không trả gì`,
      notes: [
        { mark: 'dot', text: 'Còn `static` vì chưa có đối tượng — **Ngày 11** sẽ bỏ nó đi khi học class' },
        { mark: 'ok', text: 'Nạp chồng: cùng tên, **khác danh sách tham số** — `tinh(int)` và `tinh(double)` sống chung được' },
      ],
    },
    {
      tone: 'pink',
      title: '2. JAVA LUÔN LUÔN pass-by-value 📦',
      code: `static void thuDoi(int so, int[] mang) {
    so = 999;        // đổi BẢN SAO → bên ngoài không hay
    mang[0] = 999;   // đi theo tham chiếu → bên ngoài ĐỔI
}
thuDoi(so, mang);
so       // 1    ← không đổi
mang[0]  // 999  ← đổi`,
      notes: [
        { mark: 'ok', text: 'Java **không có** truyền tham chiếu. Nó copy **giá trị** — mà tham chiếu cũng là một giá trị' },
        { mark: 'no', text: 'Gán `mang = new int[]{...}` bên trong method thì bên ngoài **không** thấy — chỉ đổi bản sao' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. BIẾN LOCAL: KHÔNG CÓ MẶC ĐỊNH 🚫',
      code: `int x;
System.out.println(x);   // ✗ lỗi DỊCH: variable x might not have been initialized

// Nhưng field của class (Ngày 11) thì CÓ mặc định — 0, false, null`,
      notes: [
        { mark: 'dot', text: 'Biến local sống trên **stack**, sinh ra lúc vào method và chết lúc thoát' },
      ],
    },
    {
      tone: 'green',
      title: '4. SHADOWING — TÊN CHE TÊN 🌓',
      code: `static int cong(int a, int b) {
    int a = 5;   // ✗ lỗi: đã có tham số tên a
    return a + b;
}
// Ở Ngày 11, tham số trùng tên FIELD lại hợp lệ —
// và đó là lúc bắt buộc phải viết this.a = a;`,
      notes: [
        { mark: 'ok', text: 'Ghi nhớ chữ **shadowing** — Ngày 11 gặp lại ngay trong constructor' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Java luôn pass-by-value · biến local không có mặc định · nạp chồng theo tham số' },
        { mark: 'next', text: '**Ngày 11**: hết Giai đoạn 1 — bước vào OOP, class & object' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'binhPhuong(5) = 25',
      'so     sau khi goi -> 1     <- KHONG doi',
      'mang[0] sau khi goi -> 999   <- DOI',
      '=> Java luon pass-by-value: copy GIA TRI, ma tham chieu cung la mot gia tri',
    ],
  },

  verify: {
    className: 'D10',
    source: `public class D10 {
    static int binhPhuong(int x) { return x * x; }
    static void thuDoi(int so, int[] mang) {
        so = 999;
        mang[0] = 999;
    }
    public static void main(String[] args) {
        System.out.println("binhPhuong(5) = " + binhPhuong(5));
        int so = 1;
        int[] mang = {1};
        thuDoi(so, mang);
        System.out.println("so     sau khi goi -> " + so + "     <- KHONG doi");
        System.out.println("mang[0] sau khi goi -> " + mang[0] + "   <- DOI");
        System.out.println("=> Java luon pass-by-value: copy GIA TRI, ma tham chieu cung la mot gia tri");
    }
}`,
  },
};
