/** "100 Ngày Java với CuongThai" — Ngày 58: Log & gỡ lỗi.
    Nối đúng chỗ Ngày 57 kết ("CI xanh, máy bạn xanh, người dùng vẫn báo lỗi —
    mà không ai cho cắm gỡ lỗi vào máy chủ").
    Ngày 59 (hiệu năng & đo đạc) trỏ ngược về phần kết.

    ⚠ SLF4J/Logback là thư viện ngoài, thẻ chạy JDK thuần nên chương trình kiểm
    chứng dựng lại nguyên lý (mức + ngưỡng, tham số {}, đọc stack trace, mã yêu
    cầu); thân bài dạy cú pháp SLF4J + logback.xml thật.
    Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 58,
  card: 'java-day-58',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-secure-audit-logger-with-structured-logging',
    title: 'Bộ ghi nhật ký có cấu trúc, an toàn',
  },

  content: `🔎 100 NGÀY JAVA — NGÀY 58: LOG & GỠ LỖI

Rồi sẽ tới cái ngày đó: CI xanh, test xanh, máy bạn chạy ngon. Một người dùng thật nhắn "em bấm thanh toán mà nó quay mãi".

Bạn mở production ra. Và không thấy gì cả.

Không có chỗ nào để đặt điểm dừng — máy chủ đang phục vụ người thật, không ai cho bạn cắm trình gỡ lỗi vào đó rồi cho cả hệ thống đứng hình. Thứ duy nhất bạn còn là **những gì chương trình đã kịp ghi lại**.

Hôm nay ta học cách ghi lại cho tử tế.

━━━━━━━━━━━━━━━━━━━━

🚫 VÌ SAO \`System.out.println\` KHÔNG DÙNG ĐƯỢC

Bạn đã dùng nó suốt 57 ngày và nó rất tốt — để học. Ở production thì nó hỏng theo bốn cách cùng lúc:

- **Không có mức.** Dòng "vào hàm rồi" và dòng "mất tiền của khách" in ra giống hệt nhau.
- **Không tắt được.** Muốn bớt ồn thì phải sửa code, dịch lại, deploy lại (Ngày 57).
- **Không biết ai in.** Cả nghìn dòng, không dòng nào cho biết nó ra từ lớp nào.
- **Không đi đâu được.** Chỉ ra màn hình. Không tự cắt file theo ngày, không gửi sang hệ thống thu thập log.

━━━━━━━━━━━━━━━━━━━━

🎚️ MỨC LOG: BẬT/TẮT BẰNG CẤU HÌNH

Log thật có **năm mức**, xếp theo độ nghiêm trọng:

\`\`\`
TRACE < DEBUG < INFO < WARN < ERROR
\`\`\`

Bạn đặt một **ngưỡng**, mọi thứ dưới ngưỡng bị bỏ qua:

\`\`\`
1) nguong INFO -> ghi 3/5 dong (bo TRACE, DEBUG)
2) doi nguong sang DEBUG -> ghi 4/5 dong, KHONG sua code
\`\`\`

Để ý dòng 2: **không sửa một dòng code nào**. Bình thường production chạy ở \`INFO\` cho gọn; hôm nào có sự cố thì hạ xuống \`DEBUG\` để xem chi tiết, xong lại nâng lên. Đây chính là thứ \`println\` không làm được.

Dùng mức nào cho việc gì:

- \`ERROR\` — hỏng thật, có người phải xử lý. Kèm exception.
- \`WARN\` — bất thường nhưng còn chạy được (thử lại lần 2 mới xong, sắp hết tồn kho).
- \`INFO\` — mốc nghiệp vụ đáng nhớ: đã tạo đơn, đã thanh toán. **Ít thôi.**
- \`DEBUG\` — chi tiết cho lập trình viên khi cần soi.
- \`TRACE\` — soi từng bước, thường tắt.

Sai lầm phổ biến nhất: log mọi thứ ở \`INFO\`. Ba tháng sau file log 40GB và không ai đọc nữa.

━━━━━━━━━━━━━━━━━━━━

🧰 ĐẶT SLF4J + LOGBACK VÀO DỰ ÁN

Hai thư viện, khai vào \`pom.xml\` (Ngày 56):

\`\`\`xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.13</version>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.6</version>
</dependency>
\`\`\`

Vì sao hai cái? **SLF4J là cái mặt tiền** — code của bạn chỉ nói chuyện với nó. **Logback là cái làm việc thật.** Mai muốn đổi sang Log4j2 thì thay thư viện, không sửa một dòng code nào. Y hệt bài interface của Ngày 18: phụ thuộc vào bản hợp đồng, không phụ thuộc vào bản cài đặt.

Trong code, đúng một dòng khai báo cho mỗi lớp:

\`\`\`java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DichVuGioHang {
    private static final Logger log = LoggerFactory.getLogger(DichVuGioHang.class);

    public void datHang(String maGio) {
        log.info("bat dau dat hang cho gio {}", maGio);
        try {
            // ...
        } catch (Exception e) {
            log.error("dat hang that bai cho gio {}", maGio, e);   // e ở CUỐI, không có {}
        }
    }
}
\`\`\`

\`static final\` vì mỗi lớp chỉ cần một cái, dùng chung cho mọi đối tượng.

Chú ý dòng \`log.error\`: **truyền exception vào tham số cuối, đừng nối vào chuỗi**. Có vậy Logback mới in được cả stack trace; viết \`log.error("loi: " + e)\` thì bạn chỉ nhận được đúng một dòng vô dụng.

Rồi \`src/main/resources/logback.xml\` — nhớ chỗ này nhờ quy ước thư mục của Maven:

\`\`\`xml
<configuration>
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss} %-5level [%X{maYeuCau}] %logger{25} - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="INFO">
    <appender-ref ref="CONSOLE"/>
  </root>

  <logger name="com.cuongthai.giohang" level="DEBUG"/>
</configuration>
\`\`\`

Dòng cuối là mẹo đáng giá: **mở DEBUG cho riêng một gói**, phần còn lại vẫn im lặng ở INFO.

━━━━━━━━━━━━━━━━━━━━

💸 DẤU \`{}\` — VÌ SAO ĐỪNG NỐI CHUỖI

\`\`\`java
log.debug("gio hang {} co {} mon", maGio, soMon);     // ✅
log.debug("gio hang " + maGio + " co " + soMon);      // ❌
\`\`\`

Nhìn thì như nhau. Chạy thì không:

\`\`\`
3) 100 lan log.debug khi nguong ERROR -> ghep chuoi 0 lan
\`\`\`

Gọi 100 lần, ngưỡng đang là \`ERROR\`, và chuỗi được ghép **0 lần**. Vì SLF4J kiểm tra ngưỡng TRƯỚC rồi mới điền tham số vào chỗ \`{}\`.

Còn cách nối chuỗi thì Java ghép xong xuôi *rồi mới* gọi hàm — tốn công cả trăm lần cho những dòng bị vứt đi ngay. Trong một vòng lặp nóng, đây là khác biệt đo được.

━━━━━━━━━━━━━━━━━━━━

🔎 ĐỌC MỘT STACK TRACE DÀI BA TRANG

Đây là kỹ năng phân biệt người mới với người đã đi làm. Người mới nhìn thấy 60 dòng thì hoảng. Thật ra chỉ cần đọc **hai chỗ**.

**Chỗ thứ nhất — \`Caused by\` CUỐI CÙNG.** Java gói lỗi nhiều tầng: tầng ngoài nói "không đặt hàng được", tầng trong mới nói vì sao:

\`\`\`
5) lan theo 'Caused by' -> nguyen nhan goc: NumberFormatException: For input string: "hai"
\`\`\`

Dòng đầu tiên của stack trace thường chỉ là cái vỏ. Cứ lần \`Caused by\` xuống tới cụm cuối cùng — đó mới là nguyên nhân gốc. Ở đây: có ai đó gửi chữ "hai" vào chỗ đáng lẽ phải là số.

**Chỗ thứ hai — dòng đầu tiên là code CỦA BẠN.** Phần lớn khung trong stack trace thuộc về JDK và thư viện; bạn không sửa được chúng và chúng cũng hiếm khi sai:

\`\`\`
4) stack trace -> bo khung thu vien, khung dau CUA MINH: MoPhongLog.tinhTong
\`\`\`

Lướt từ trên xuống, bỏ qua mọi dòng \`at java.base/...\` và tên thư viện, dừng ở tên gói của bạn. Đó là nơi đặt điểm dừng.

━━━━━━━━━━━━━━━━━━━━

🧵 MÃ YÊU CẦU: LẦN THEO MỘT NGƯỜI DÙNG GIỮA BIỂN LOG

Production không phục vụ một người. Log của hàng trăm request trộn vào nhau theo thứ tự thời gian, nên đọc kiểu thường là vô nghĩa.

Cách chữa: gắn cho mỗi request một mã, in vào mọi dòng.

\`\`\`
6) 9 dong tron 3 yeu cau -> loc [R-2] con 4 dong
\`\`\`

Bốn dòng đó kể trọn câu chuyện của **một** người: nhận đơn → trừ tồn kho → thanh toán lỗi → hoàn tiền. Logback làm việc này bằng \`MDC\` (Mapped Diagnostic Context) — chính là \`%X{maYeuCau}\` trong cấu hình ở trên:

\`\`\`java
MDC.put("maYeuCau", "R-" + soThuTu);
try {
    xuLyDonHang(don);
} finally {
    MDC.clear();     // BẮT BUỘC: luồng trong pool được dùng lại (Ngày 42)
}
\`\`\`

Cái \`finally\` không phải cho đẹp. Luồng trong pool được dùng lại cho request sau; quên xoá là request của người này mang mã của người kia.

━━━━━━━━━━━━━━━━━━━━

🐞 CÒN TRÌNH GỠ LỖI THÌ SAO?

Trên máy bạn thì gỡ lỗi vẫn nhanh hơn log rất nhiều. Bốn thao tác đủ dùng 95% trường hợp:

- **Điểm dừng** (breakpoint) — bấm vào lề trái chỗ số dòng, chạy chế độ Debug.
- **Step Over / Step Into** — chạy qua một dòng / chui vào trong hàm đó.
- **Bảng biến** — xem giá trị thật ngay lúc dừng, thay cho việc rải \`println\`.
- **Điểm dừng có điều kiện** — chuột phải vào điểm dừng, gõ \`i == 500\`. Cứu tinh khi lỗi chỉ xảy ra ở vòng lặp thứ 500.

Chia việc cho gọn: **gỡ lỗi để tìm bug trên máy mình, log để hiểu chuyện gì đã xảy ra trên máy chủ.**

━━━━━━━━━━━━━━━━━━━━

⚠️ ĐỪNG LOG THỨ KHÔNG ĐƯỢC LOG

File log bị sao lưu, bị gửi sang hệ thống khác, bị đồng nghiệp mở. Nên đừng bao giờ để lọt vào đó:

- Mật khẩu, token, khoá API
- Số thẻ, số căn cước, số tài khoản
- Toàn bộ nội dung request có dữ liệu cá nhân

Cần thì che bớt: \`0912***678\`. Nguyên tắc giống hệt \`.gitignore\` của Ngày 57 — thứ nhạy cảm lỡ ra ngoài thì coi như đã lộ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm SLF4J + Logback vào một dự án Maven, thay hết \`System.out.println\` bằng \`log\`.
2. Đặt \`root level="INFO"\` rồi mở \`DEBUG\` cho riêng một gói — quan sát khác biệt.
3. Ném một exception có \`Caused by\` hai tầng, in ra và tập lần tới nguyên nhân gốc.
4. Dùng \`MDC\` gắn mã yêu cầu, chạy 3 luồng cùng lúc rồi lọc log của một mã.
5. Đặt điểm dừng có điều kiện \`i == 500\` trong vòng lặp 1000 bước.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Log không phải \`println\` viết hoa. Nó là **mức + ngưỡng** (bật tắt bằng cấu hình), **tham số \`{}\`** (không tốn gì khi tắt), **mã yêu cầu** (lần theo một người giữa biển log), và kỹ năng đọc stack trace từ \`Caused by\` cuối cùng ngược lên dòng code của mình.

Giờ bạn đã thấy được chuyện gì xảy ra trên máy chủ. Câu hỏi tiếp theo tự nhiên là: nó **chậm** ở đâu?

Và đây là chỗ gần như ai cũng sai lần đầu. Bạn đọc code, thấy một vòng lặp trông nặng, ngồi tối ưu nó hai ngày — xong đo lại thì chương trình vẫn chậm y như cũ, vì 90% thời gian thật ra nằm ở một dòng bạn còn chẳng để ý.

Ngày 59: **Hiệu năng & đo đạc** — vì sao đoán mò là cách tối ưu tệ nhất, đo thế nào cho ra số đáng tin (JVM khởi động nguội thì mọi phép đo đều sai), và những chỗ thật sự đáng tối ưu trong code Java. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
