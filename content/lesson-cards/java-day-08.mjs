/** "100 Ngày Java" — Ngày 8: Mảng. Bài Ngày 11 (OOP) trỏ ngược về đây. */
export default {
  series: '100 NGÀY JAVA',
  day: 8,
  total: 100,
  titleLead: 'Java Day 8:',
  titleAccent: 'Mảng',
  subtitle: 'Nhiều giá trị một cái tên — và lần đầu gặp tham chiếu 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KHAI BÁO & GIÁ TRỊ MẶC ĐỊNH 📊',
      code: `int[] diem = new int[3];      // [0, 0, 0] — số về 0
int[] a = {5, 2, 9};          // khai kèm giá trị
String[] ten = new String[2]; // [null, null] — tham chiếu về null

a.length   // 3  ← THUỘC TÍNH, không có ngoặc
a[0]       // 5  ← đếm từ 0`,
      notes: [
        { mark: 'no', text: '`a.length()` là **sai** — chỉ `String` mới có `length()` có ngoặc' },
        { mark: 'dot', text: 'Mảng có giá trị mặc định (0 / false / null) — khác hẳn biến local phải gán mới dùng được' },
      ],
    },
    {
      tone: 'pink',
      title: '2. MẢNG LÀ THAM CHIẾU 🔗',
      code: `int[] a = {5, 2, 9};
int[] b = a;        // KHÔNG copy — thêm một cái tên cho CÙNG mảng
b[0] = 99;
System.out.println(a[0]);   // 99 ← a cũng đổi!

int[] c = a.clone();        // ✓ copy thật
c[1] = 0;                   // a không hề hấn gì`,
      notes: [
        { mark: 'ok', text: 'Đây là **lần đầu** bạn gặp tham chiếu — nền của toàn bộ OOP từ Ngày 11 trở đi' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. VƯỢT CHỈ SỐ — LỖI LÚC CHẠY 💥',
      code: `int[] a = new int[3];   // chỉ số hợp lệ: 0, 1, 2
a[3] = 10;              // 💥 ArrayIndexOutOfBoundsException

for (int i = 0; i <= a.length; i++)   // ✗ dấu = thừa
for (int i = 0; i <  a.length; i++)   // ✓`,
      notes: [
        { mark: 'no', text: 'Java **kiểm chỉ số lúc chạy** và ném lỗi ngay — C thì lặng lẽ ghi đè bộ nhớ người khác' },
      ],
    },
    {
      tone: 'green',
      title: '4. MẢNG HAI CHIỀU & Arrays 🧰',
      code: `int[][] bang = new int[2][3];       // 2 hàng, 3 cột
bang[0][2] = 7;

import java.util.Arrays;
Arrays.toString(a)   // "[5, 2, 9]"  ← in mảng phải dùng cái này
Arrays.sort(a);      // sắp xếp tại chỗ
System.out.println(a);   // ✗ ra [I@1b6d3586 — địa chỉ, không phải nội dung`,
      notes: [
        { mark: 'ok', text: 'Muốn thấy nội dung mảng thì **luôn** dùng `Arrays.toString()`' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`.length` không ngoặc · đếm từ 0 · gán mảng = thêm tên, không phải copy' },
        { mark: 'next', text: '**Ngày 9**: `String` — và vì sao `==` lừa bạn' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      'new int[3] -> [0, 0, 0]  <- mac dinh 0',
      'do dai: a.length = 3  (khong phai a.length())',
      'a sau khi sua qua b -> [99, 2, 9]  <- MOT mang, hai ten',
      'clone roi sua c -> a van [99, 2, 9]',
    ],
  },

  verify: {
    className: 'D08',
    source: `import java.util.Arrays;
public class D08 {
    public static void main(String[] args) {
        int[] diem = new int[3];
        System.out.println("new int[3] -> " + Arrays.toString(diem) + "  <- mac dinh 0");
        int[] a = {5, 2, 9};
        System.out.println("do dai: a.length = " + a.length + "  (khong phai a.length())");
        int[] b = a;
        b[0] = 99;
        System.out.println("a sau khi sua qua b -> " + Arrays.toString(a) + "  <- MOT mang, hai ten");
        int[] c = a.clone();
        c[1] = 0;
        System.out.println("clone roi sua c -> a van " + Arrays.toString(a));
    }
}`,
  },
};
