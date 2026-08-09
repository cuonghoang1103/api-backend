/** "100 Ngày Java với CuongThai" — Ngày 72: Tầng service & @Transactional.
    Nối đúng chỗ Ngày 71 kết ("ai lo giao dịch trong Spring? logic nghiệp vụ
    nên sống ở đâu chứ không phải nhét vào controller?").
    Ngày 73 (xử lý lỗi: @ExceptionHandler/@ControllerAdvice) trỏ ngược về kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại đúng cơ chế thật của
    @Transactional (Proxy bọc service, commit/rollback); thân bài dạy @Service/
    @Transactional thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 72,
  card: 'java-day-72',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-comprehensive-unit-tests-for-order-processing-service',
    title: 'Test toàn diện cho dịch vụ xử lý đơn hàng',
  },

  content: `⚙️ 100 NGÀY JAVA — NGÀY 72: TẦNG SERVICE & @TRANSACTIONAL

Ngày 71 để lại hai câu hỏi. Một: trong Spring, ai lo giao dịch của Ngày 65? Hai: logic nghiệp vụ — "đặt hàng thì trừ tồn kho", "đơn quá 3 ngày thì nhắc" — nên sống ở đâu, chứ không phải nhồi hết vào controller?

Hôm nay trả lời cả hai, và câu trả lời đẹp đến bất ngờ: giao dịch gói vào **một dòng chú thích**.

━━━━━━━━━━━━━━━━━━━━

🏛️ NHẮC LẠI BA TẦNG — VÀ TẦNG GIỮA LÀM GÌ

Ngày 64 bạn đã thấy kiến trúc ba tầng. Giờ ghép tên Spring vào:

\`\`\`
@RestController   nhận request, trả JSON        (Ngày 68)
      │  gọi
@Service          LOGIC NGHIỆP VỤ  ← hôm nay
      │  gọi
@Repository       chạm CSDL                     (Ngày 70)
\`\`\`

Cái bẫy phổ biến nhất của người mới: nhét logic vào controller. Controller phình to, không test được nếu không dựng cả web server, và logic bị kẹt cứng với HTTP.

Nguyên tắc: **controller mỏng, service dày.**

\`\`\`java
@RestController
public class DonController {
    private final DichVuDatHang dichVu;
    public DonController(DichVuDatHang dichVu) { this.dichVu = dichVu; }  // DI (Ngày 67)

    @PostMapping("/dat-hang")
    public ResponseEntity<Void> dat(@RequestBody @Valid DatHangYeuCau yc) {
        dichVu.datHang(yc.sanPham(), yc.soLuong());   // chỉ gọi service
        return ResponseEntity.status(201).build();
    }
}
\`\`\`

Controller chỉ làm ba việc: nhận, gọi service, trả kết quả. Mọi "luật của công việc" nằm bên trong service.

━━━━━━━━━━━━━━━━━━━━

⚙️ @Service: NƠI LOGIC SỐNG

\`\`\`java
@Service
public class DichVuDatHang {
    private final KhoDon khoDon;
    private final KhoTonKho khoTon;
    // constructor injection...

    public void datHang(String sanPham, int soLuong) {
        khoDon.luu(new Don(sanPham, soLuong));      // bước 1: tạo đơn
        khoTon.tru(sanPham, soLuong);               // bước 2: trừ tồn kho
    }
}
\`\`\`

Nhìn phương thức \`datHang\`: nó gồm **hai bước phải đi cùng nhau**. Tạo đơn mà không trừ được tồn kho (hết hàng) thì cái đơn vừa tạo phải biến mất. Đây đúng là bài toán giao dịch của Ngày 65.

━━━━━━━━━━━━━━━━━━━━

✨ MỘT DÒNG CHÚ THÍCH THAY CẢ ĐOẠN CODE

Ngày 65, để làm chuyện "cùng xong hoặc cùng huỷ", bạn viết \`setAutoCommit(false)\`, \`commit()\`, \`try/catch\` gọi \`rollback()\`. Trong Spring, tất cả gói vào:

\`\`\`java
@Transactional
public void datHang(String sanPham, int soLuong) {
    khoDon.luu(new Don(sanPham, soLuong));
    khoTon.tru(sanPham, soLuong);
}
\`\`\`

Đúng một dòng \`@Transactional\`. Chạy thử:

\`\`\`
2) datHang('ao',3) OK -> COMMIT: don=1, ton 'ao'=7
3) datHang('ao',99) qua ton -> nem loi: het ton kho ao -> ROLLBACK
4) sau rollback: don van=1, ton 'ao' van=7 (ca 2 buoc bi huy)
\`\`\`

Lần đặt hàng thành công thì cả hai bước được **commit**. Lần đặt quá tồn kho, bước 2 ném lỗi — và \`@Transactional\` **rollback cả cụm**, kể cả cái đơn bước 1 đã tạo. Số đơn không tăng, tồn kho không giảm, như chưa từng có gì.

━━━━━━━━━━━━━━━━━━━━

🪄 BÊN DƯỚI: LẠI LÀ PROXY

Vì sao chỉ một chú thích mà làm được nhiều thế? Cùng cơ chế của Ngày 70: Spring **bọc service của bạn trong một Proxy**. Khi bạn gọi \`datHang\`, thật ra bạn gọi vào proxy; nó mở giao dịch, gọi phương thức thật, rồi:

\`\`\`
Proxy:  BEGIN → gọi phương thức thật → COMMIT
        (nếu ném RuntimeException) → ROLLBACK
\`\`\`

\`\`\`
5) commit=1, rollback=1
6) @Transactional = 1 dong chu thich; proxy lo begin/commit/rollback
\`\`\`

Chương trình kiểm chứng hôm nay là proxy đó viết bằng JDK thuần: chụp bản sao dữ liệu trước khi gọi, giữ nguyên nếu xong, khôi phục nếu ném lỗi. Không phép màu — chỉ là thứ bạn đã biết từ Ngày 70, áp vào giao dịch của Ngày 65.

━━━━━━━━━━━━━━━━━━━━

⚠️ HAI CÁI BẪY PHẢI BIẾT NGAY

Vì \`@Transactional\` chạy bằng proxy, nó có hai điểm mù mà gần như ai cũng vấp một lần:

**1. Mặc định chỉ rollback với RuntimeException.** Nếu bạn ném một *checked exception* (\`IOException\`...), Spring **vẫn commit**. Đây là hành vi gây bất ngờ nhất. Muốn rollback cả checked thì khai rõ:

\`\`\`java
@Transactional(rollbackFor = Exception.class)
\`\`\`

**2. Gọi phương thức \`@Transactional\` từ chính lớp đó thì vô hiệu.** Vì lời gọi nội bộ không đi qua proxy:

\`\`\`java
public void xuLy() {
    datHang(...);   // ❌ KHÔNG mở giao dịch — gọi thẳng, vòng qua proxy
}

@Transactional
public void datHang(...) { ... }
\`\`\`

Cách tránh: đặt phương thức \`@Transactional\` ở một bean khác và gọi qua nó. Đây là hệ quả trực tiếp của "proxy bọc bên ngoài" — hiểu cơ chế thì hai bẫy này thành hiển nhiên.

━━━━━━━━━━━━━━━━━━━━

📏 GIAO DỊCH NGẮN — NHẮC LẠI TỪ NGÀY 65

Vì giao dịch giữ khoá CSDL, luật của Ngày 65 vẫn đúng nguyên: **để \`@Transactional\` bao đúng phần chạm dữ liệu, đừng bao cả những việc chậm** như gọi API ngoài hay gửi email. Một \`@Transactional\` ôm luôn một lời gọi mạng 3 giây là giữ khoá 3 giây — chặn mọi người khác.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tách một logic đang nằm trong controller ra thành một \`@Service\`.
2. Viết \`datHang\` gồm hai bước (tạo đơn + trừ tồn), đánh \`@Transactional\`.
3. Cho bước 2 ném \`RuntimeException\`, xác nhận bước 1 bị rollback.
4. Đổi sang ném một checked exception — quan sát nó **vẫn commit**, rồi sửa bằng \`rollbackFor\`.
5. Viết unit test cho service bằng cách giả (mock) repository — không cần CSDL thật (Ngày 54).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Logic nghiệp vụ sống ở tầng \`@Service\` — controller mỏng, repository chỉ CRUD. Và giao dịch của Ngày 65 gói lại thành đúng một dòng \`@Transactional\`: commit khi xong, rollback khi ném \`RuntimeException\`, tất cả nhờ một Proxy như Ngày 70. Nhớ hai bẫy: checked exception mặc định không rollback, và tự-gọi trong cùng lớp thì vô hiệu.

Đến đây ứng dụng của bạn khá đầy đủ: nhận request, kiểm dữ liệu, chạy nghiệp vụ trong giao dịch, lưu vào CSDL. Nhưng khi có lỗi thì sao? Hiện mỗi chỗ ném một kiểu exception, và client nhận về một trang lỗi 500 xấu xí kèm cả stack trace — vừa khó dùng vừa lộ thông tin nội bộ.

Ngày 73: **Xử lý lỗi gọn gàng** — \`@ExceptionHandler\` và \`@ControllerAdvice\` để gom mọi lỗi về một chỗ, biến exception thành phản hồi JSON sạch sẽ với đúng mã trạng thái, để client luôn nhận được câu trả lời tử tế thay vì stack trace. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
