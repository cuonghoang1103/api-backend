/** "100 Ngày Java với CuongThai" — Ngày 55: TDD.
    Nối chỗ Ngày 54 kết (viết test TRƯỚC khi viết code). Khép nhóm kiểm
    thử 53-55. Ngày 56 (Maven) trỏ ngược về phần kết.

    Chương trình kiểm chứng giữ lại CẢ bản đầu tiên chưa làm gì, để chứng
    minh nhịp ĐỎ là có thật. Mọi output là kết quả THẬT của javac/java
    trên JDK 21. */
export default {
  day: 55,
  card: 'java-day-55',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-prime-number-operations-with-methods',
    title: 'Tách bài toán số nguyên tố thành method (hợp để tập TDD)',
  },

  content: `🔴🟢 100 NGÀY JAVA — NGÀY 55: TDD

Hai ngày qua ta viết test SAU khi viết code. Hôm nay làm ngược lại — và cách làm ngược này thay đổi hẳn cách bạn thiết kế.

**Bài toán:** máy bán hàng trả tiền thừa bằng ít tờ nhất, mệnh giá 50k/20k/10k/5k/1k.

━━━━━━━━━━━━━━━━━━━━

🔴 NHỊP MỘT: ĐỎ

Viết test trước, khi hàm còn chưa tồn tại:

\`\`\`java
kiem("thua 10k", List.of(10_000), traTien(10_000));
\`\`\`

Bản đầu tiên cố tình chưa làm gì:

\`\`\`java
static List<Integer> traTien(int thua) {
    if (thua == 0) return List.of();
    return null;                       // chưa xử lý
}
\`\`\`

\`\`\`
1) NHIP DO: ban dau tien lam test hong? true
\`\`\`

Test đỏ. Và bước này **bắt buộc** — nghe vô lý nhưng rất quan trọng: một test chưa từng đỏ là một test bạn không biết nó có kiểm gì không. Rất nhiều test "luôn xanh" thật ra kiểm nhầm chỗ hoặc quên \`assert\`.

━━━━━━━━━━━━━━━━━━━━

🟢 NHỊP HAI: XANH

Viết code TỐI THIỂU để test đạt — chưa cần đẹp:

\`\`\`java
static final int[] MENH_GIA = {50_000, 20_000, 10_000, 5_000, 1_000};

static List<Integer> traTien(int thua) {
    if (thua < 0) throw new IllegalArgumentException("Tien thua am: " + thua);
    List<Integer> ket = new ArrayList<>();
    for (int m : MENH_GIA) {
        while (thua >= m) { ket.add(m); thua -= m; }
    }
    if (thua != 0) throw new IllegalStateException("Khong tra du: con " + thua);
    return ket;
}
\`\`\`

\`\`\`
2) NHIP XANH: dat 6 | hong 0
3) tat ca xanh? true
\`\`\`

Sáu trường hợp: thừa 0, thừa 10k, thừa 35k, thừa 66k, tiền âm, và số không trả đủ được (500đ). Mỗi vòng TDD chỉ thêm MỘT trường hợp — viết test, thấy đỏ, sửa code cho xanh, rồi mới sang trường hợp sau.

Chú ý hai trường hợp lỗi được nghĩ tới ngay từ đầu, chứ không phải "làm xong rồi bổ sung". Đó là hiệu ứng phụ rất tốt của TDD: bạn buộc phải nghĩ "hàm này hỏng thì sao" trong lúc thiết kế, chứ không phải sau khi đã xong.

━━━━━━━━━━━━━━━━━━━━

🧹 NHỊP BA: DỌN

Giờ mới dọn dẹp — và test xanh là lưới an toàn:

\`\`\`
4) NHIP DON: doi thu tu duyet menh gia van dung? true
5) so to tra cho 66k -> 4 to
6) tong tien tra lai dung? true
\`\`\`

Bạn có thể đổi thuật toán, tách hàm, đổi tên biến, tối ưu — chạy lại thấy xanh là biết không làm vỡ gì.

Đây là nhịp hay bị bỏ nhất, và bỏ nó là mất một nửa giá trị của TDD. Không có nhịp dọn thì code cứ chồng chất, và bộ test chỉ đóng vai "chứng nhận cho một mớ lộn xộn".

━━━━━━━━━━━━━━━━━━━━

🎨 VÌ SAO VIẾT TEST TRƯỚC LẠI RA THIẾT KẾ TỐT HƠN

Đây mới là lý do thật sự của TDD — không phải để có nhiều test hơn.

Khi viết test trước, bạn buộc phải GỌI hàm trước khi viết nó:

\`\`\`java
traTien(35_000);   // → [20000, 10000, 5000]
\`\`\`

Chỉ một dòng đó, bạn vừa quyết định: tên hàm, tham số, kiểu trả về, và cách người khác sẽ dùng nó. Bạn đứng ở vị trí NGƯỜI DÙNG trước khi đứng ở vị trí người hiện thực.

Thiết kế ra từ góc nhìn đó thường gọn hơn hẳn. Và có một tín hiệu rất đáng chú ý: **hàm nào khó viết test thường là hàm thiết kế chưa tốt** — làm quá nhiều việc, phụ thuộc quá nhiều thứ, hoặc trộn lẫn logic với I/O. TDD cho bạn tín hiệu đó ngay lập tức, thay vì sáu tháng sau.

━━━━━━━━━━━━━━━━━━━━

🧭 KHI NÀO DÙNG, KHI NÀO KHÔNG

TDD không phải luật. Nó là công cụ, và có chỗ hợp có chỗ không.

**Rất hợp:**

- Logic nghiệp vụ rõ ràng: tính tiền, xếp loại, kiểm dữ liệu
- Thuật toán có đầu vào/đầu ra rõ
- **Sửa bug** — viết test tái hiện bug trước, rồi mới sửa. Test đó ở lại vĩnh viễn để bug không quay lại

**Không hợp lắm:**

- Đang dò dẫm, chưa biết mình muốn gì (làm nguyên mẫu, thử nghiệm)
- Code giao diện, code chỉ nối các thư viện lại với nhau
- Thứ mà đặc tả còn đang thay đổi mỗi ngày

Và một lời thành thật: rất ít đội theo TDD nghiêm ngặt 100%. Nhưng gần như mọi lập trình viên giỏi đều dùng nó ở những chỗ khó — nơi logic phức tạp và sai thì đắt.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Làm lại bài trả tiền thừa theo đúng ba nhịp, mỗi vòng một trường hợp.
2. Viết test cho \`FizzBuzz\` trước, rồi mới viết code.
3. Lấy một bug bạn từng gặp: viết test tái hiện nó (đỏ), rồi sửa (xanh).
4. Sau khi xanh, đổi cách hiện thực một hàm và kiểm chứng test vẫn xanh.
5. Cố viết test cho một hàm dài 100 dòng của bạn — nếu thấy khó, đó là tín hiệu gì?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — HẾT PHẦN KIỂM THỬ

Ba ngày qua: JUnit (53), bản giả (54), TDD (55). Đỏ để chắc test có kiểm thật, xanh để code chạy, dọn để code sạch. Và viết test trước là một cách thiết kế, không chỉ là cách kiểm tra.

Nhưng có một chuyện tôi đã lảng tránh suốt hai bài: JUnit và Mockito là **thư viện ngoài**. Muốn dùng chúng thì phải tải về, đặt đúng chỗ, khai báo phiên bản, rồi bảo trình dịch tìm chúng ở đâu.

Bạn định tải file \`.jar\` bằng tay và chép vào thư mục? Rồi khi thư viện đó cần thư viện khác? Rồi khi đồng nghiệp mở dự án của bạn và thiếu mất một file?

Ngày 56: **Maven** — khai báo thư viện trong một file, còn lại máy lo: tải về, giải quyết phụ thuộc chồng chéo, biên dịch, chạy test, đóng gói. Đây là công cụ mọi dự án Java đi làm đều dùng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
