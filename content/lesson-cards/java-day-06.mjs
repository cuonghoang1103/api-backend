/** "100 Ngày Java" — Ngày 6: Vòng lặp. */
export default {
  series: '100 NGÀY JAVA',
  day: 6,
  total: 100,
  titleLead: 'Java Day 6:',
  titleAccent: 'Vòng lặp',
  subtitle: 'for, while, do-while — và cách không lặp vô tận 🔁',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. for — KHI BIẾT TRƯỚC SỐ LẦN 🔢',
      code: `for (int i = 1; i <= 5; i++) tong += i;
//   ①khởi tạo  ②điều kiện  ③bước nhảy
// ① chạy MỘT lần · ② kiểm TRƯỚC mỗi vòng · ③ chạy SAU mỗi vòng`,
      notes: [
        { mark: 'dot', text: 'Biến `i` khai trong `for` **chỉ sống trong vòng lặp** — ra ngoài là không còn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. while & do-while ♻️',
      code: `while (n > 1) { giaiThua *= n; n--; }   // kiểm TRƯỚC → có thể chạy 0 lần

do { lan++; } while (lan < 0);          // kiểm SAU  → chạy ÍT NHẤT 1 lần`,
      notes: [
        { mark: 'ok', text: '`while` khi **không biết trước** số vòng; `do-while` khi **phải làm ít nhất một lần** (menu, nhập lại)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BA CÁCH TỰ TREO CHƯƠNG TRÌNH 🪤',
      code: `while (i < 10) { System.out.println(i); }   // ✗ quên i++
for (int i = 0; i != 10; i += 3)           // ✗ nhảy qua 10, không bao giờ ==
for (double d = 0; d != 1.0; d += 0.1)     // ✗ số thực không bao giờ == đúng`,
      notes: [
        { mark: 'no', text: 'Với số thực **luôn dùng `<` `>`**, đừng dùng `!=` hay `==` — lý do đã học Ngày 3' },
      ],
    },
    {
      tone: 'green',
      title: '4. for-each — GỌN VÀ AN TOÀN 🌿',
      code: `for (int x : mang) tong += x;   // đọc từng phần tử, khỏi lo chỉ số

// Nhưng cần chỉ số hoặc cần SỬA phần tử thì vẫn phải for thường:
for (int i = 0; i < mang.length; i++) mang[i] *= 2;`,
      notes: [
        { mark: 'ok', text: 'for-each xoá sổ lỗi vượt chỉ số, nhưng **không sửa được** phần tử gốc' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`for` biết trước · `while` chưa biết · `do-while` ít nhất một lần' },
        { mark: 'next', text: '**Ngày 7**: `break`, `continue` và vòng lặp lồng nhau' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'for 1..5, tong = 15',
      'while: 5! = 120',
      'do-while chay it nhat 1 lan: 1',
    ],
  },

  verify: {
    className: 'D06',
    source: `public class D06 {
    public static void main(String[] args) {
        int tong = 0;
        for (int i = 1; i <= 5; i++) tong += i;
        System.out.println("for 1..5, tong = " + tong);
        int n = 5, giaiThua = 1;
        while (n > 1) { giaiThua *= n; n--; }
        System.out.println("while: 5! = " + giaiThua);
        int lan = 0;
        do { lan++; } while (lan < 0);
        System.out.println("do-while chay it nhat 1 lan: " + lan);
    }
}`,
  },
};
