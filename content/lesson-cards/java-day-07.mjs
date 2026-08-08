/** "100 Ngày Java" — Ngày 7: break, continue & vòng lặp lồng nhau. */
export default {
  series: '100 NGÀY JAVA',
  day: 7,
  total: 100,
  titleLead: 'Java Day 7:',
  titleAccent: 'break · continue · lồng nhau',
  subtitle: 'Thoát sớm, bỏ lượt, và nhãn cứu bạn khỏi biến cờ 🏷️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. break THOÁT · continue BỎ LƯỢT ⏭️',
      code: `for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;   // bỏ lượt này, sang i tiếp theo
    if (i == 5) break;      // thoát HẲN vòng lặp
    System.out.print(i + " ");
}
// in ra: 1 2 4`,
      notes: [
        { mark: 'dot', text: '`continue` nhảy tới **bước nhảy** của `for` — trong `while` phải tự tăng biến trước, không thì treo' },
      ],
    },
    {
      tone: 'pink',
      title: '2. break CHỈ THOÁT MỘT TẦNG 🪆',
      code: `for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= 3; j++) {
        if (i * j > 4) break;   // ✗ chỉ thoát vòng j, vòng i vẫn chạy
    }`,
      notes: [
        { mark: 'no', text: 'Đây là hiểu nhầm phổ biến nhất về vòng lặp lồng — `break` **không** thoát hết' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. NHÃN — THOÁT NHIỀU TẦNG 🏷️',
      code: `outer:
for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= 3; j++) {
        if (i * j > 4) break outer;   // ✓ thoát CẢ HAI
        System.out.print(i + "x" + j + "=" + (i * j) + " ");
    }
// in ra: 1x1=1 1x2=2 1x3=3 2x1=2 2x2=4`,
      notes: [
        { mark: 'ok', text: 'Thay cho biến cờ `boolean found` rải khắp nơi — ngắn hơn và đọc rõ hơn' },
        { mark: 'dot', text: 'Dùng **ít thôi**: lồng quá 2 tầng thì thường nên tách thành method riêng' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐỘ PHỨC TẠP: LỒNG NHAU LÀ NHÂN LÊN ⏱️',
      code: `for i in 1..n
    for j in 1..n        →  n × n = n² lần lặp

n = 1.000   →       1.000.000 lần   (chớp mắt)
n = 100.000 →  10.000.000.000 lần   (hàng phút)`,
      notes: [
        { mark: 'dot', text: 'Thêm một tầng lồng là **nhân** khối lượng, không phải cộng — nền của mọi bài tối ưu sau này' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`break` thoát một tầng · nhãn thoát nhiều tầng · lồng nhau là nhân lên' },
        { mark: 'next', text: '**Ngày 8**: mảng — chứa nhiều giá trị dưới một cái tên' },
      ],
    },
  ],

  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1 2 4 <- continue bo 3, break dung o 5',
      '1x1=1 1x2=2 1x3=3 2x1=2 2x2=4 <- nhan LABEL thoat ca hai vong',
    ],
  },

  verify: {
    className: 'D07',
    source: `public class D07 {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            if (i == 3) continue;
            if (i == 5) break;
            System.out.print(i + " ");
        }
        System.out.println("<- continue bo 3, break dung o 5");
        outer:
        for (int i = 1; i <= 3; i++)
            for (int j = 1; j <= 3; j++) {
                if (i * j > 4) break outer;
                System.out.print(i + "x" + j + "=" + (i * j) + " ");
            }
        System.out.println("<- nhan LABEL thoat ca hai vong");
    }
}`,
  },
};
