/** "100 Ngày Java" — Ngày 3: Toán tử & ép kiểu. */
export default {
  series: '100 NGÀY JAVA',
  day: 3,
  total: 100,
  titleLead: 'Java Day 3:',
  titleAccent: 'Toán tử & Ép kiểu',
  subtitle: 'Vì sao 7 / 2 = 3 và 0.1 + 0.2 ≠ 0.3 ⚠️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'pink',
      title: '1. CÁI BẪY SỐ MỘT: CHIA SỐ NGUYÊN ⚠️',
      code: `7 / 2      → 3      // int ÷ int = int, CẮT phần thập phân
7 / 2.0    → 3.5    // có một double thì kết quả là double
(double) 7 / 2 → 3.5
7 % 2      → 1      // phần dư`,
      notes: [
        { mark: 'no', text: 'Đây là lỗi số 1 của người mới. `7 / 2` **không làm tròn** — nó **cắt bỏ**' },
        { mark: 'ok', text: 'Muốn ra số thực: cho ít nhất **một** vế là số thực' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. TRÀN SỐ — ÂM THẦM, KHÔNG BÁO LỖI 💥',
      code: `int max = Integer.MAX_VALUE;   // 2.147.483.647
System.out.println(max + 1);   // -2147483648  ← quay vòng!`,
      notes: [
        { mark: 'no', text: 'Java **không** ném lỗi khi tràn — nó lặng lẽ quay vòng sang âm' },
        { mark: 'ok', text: 'Tính tiền, đếm lượt xem, mili-giây… → dùng `long`' },
      ],
    },
    {
      tone: 'blue',
      title: '3. double KHÔNG CHÍNH XÁC TUYỆT ĐỐI 🎯',
      code: `0.1 + 0.2  →  0.30000000000000004
// KHÔNG so sánh số thực bằng ==
if (Math.abs(a - b) < 1e-9) { ... }   // ✓ so trong sai số`,
      notes: [
        { mark: 'dot', text: 'Máy lưu số thực theo nhị phân, `0.1` không biểu diễn chính xác được — mọi ngôn ngữ đều vậy' },
        { mark: 'ok', text: 'Tiền bạc thì dùng `BigDecimal`, đừng dùng `double`' },
      ],
    },
    {
      tone: 'green',
      title: '4. ÉP KIỂU: RỘNG TỰ ĐỘNG, HẸP PHẢI XIN 🔄',
      code: `int i = 10;
double d = i;          // ✓ tự động — int lọt vừa double
int back = (int) 9.99; // 9 — CẮT, không làm tròn
// int x = 9.99;       ✗ lỗi dịch: mất mát dữ liệu`,
      notes: [
        { mark: 'ok', text: 'Hẹp → rộng: tự động. Rộng → hẹp: phải **ép tay** và chấp nhận mất dữ liệu' },
        { mark: 'dot', text: 'Muốn làm tròn thì dùng `Math.round()`, đừng dùng `(int)`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`int/int` cắt · tràn số im lặng · `double` xấp xỉ · ép hẹp phải xin phép' },
        { mark: 'next', text: '**Ngày 4**: nhập xuất — `Scanner` và `printf`' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '7 / 2   = 3    <- int chia int, CAT phan thap phan',
      '7 / 2.0 = 3.5  <- co double thi ra double',
      '7 % 2   = 1',
      'MAX_VALUE + 1 = -2147483648  <- TRAN SO, quay vong am',
      '0.1 + 0.2 = 0.30000000000000004  <- double khong chinh xac tuyet doi',
    ],
  },

  verify: {
    className: 'D03',
    source: `public class D03 {
    public static void main(String[] args) {
        System.out.println("7 / 2   = " + (7 / 2) + "    <- int chia int, CAT phan thap phan");
        System.out.println("7 / 2.0 = " + (7 / 2.0) + "  <- co double thi ra double");
        System.out.println("7 % 2   = " + (7 % 2));
        int max = Integer.MAX_VALUE;
        System.out.println("MAX_VALUE + 1 = " + (max + 1) + "  <- TRAN SO, quay vong am");
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2) + "  <- double khong chinh xac tuyet doi");
    }
}`,
  },
};
