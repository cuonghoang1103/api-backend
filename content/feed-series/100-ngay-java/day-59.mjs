/** "100 Ngày Java với CuongThai" — Ngày 59: Hiệu năng & đo đạc.
    Nối đúng chỗ Ngày 58 kết ("tối ưu hai ngày cái vòng lặp trông nặng, đo lại
    vẫn chậm y cũ — 90% thời gian nằm ở dòng bạn không để ý").
    Ngày 60 (bài tổng hợp khép Giai đoạn 7) trỏ ngược về phần kết.

    ⚠ LUẬT 5: mọi con số trong bài là ĐẾM PHÉP TÍNH (cố định), phép đo thời
    gian chỉ in NGƯỠNG. Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 59,
  card: 'java-day-59',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-an-efficient-object-pool-to-reduce-gc-pressure',
    title: 'Bể đối tượng tái dùng để giảm áp lực dọn rác',
  },

  content: `⏱️ 100 NGÀY JAVA — NGÀY 59: HIỆU NĂNG

Câu chuyện này lặp lại ở mọi đội: có người báo "trang chi tiết đơn hàng chậm". Bạn mở code, thấy một vòng lặp lồng trông rất nặng, ngồi tối ưu hai ngày. Deploy. Đo lại.

Vẫn chậm y như cũ.

Vì 90% thời gian nằm ở một dòng bạn còn chẳng buồn nhìn.

Hôm nay học cách **không** rơi vào hai ngày đó.

━━━━━━━━━━━━━━━━━━━━

📏 QUY TẮC SỐ MỘT: ĐỪNG ĐOÁN

Trực giác về hiệu năng của con người sai gần như luôn luôn. Lý do đơn giản: bạn nhìn thấy **độ phức tạp của code**, còn máy quan tâm **số lần chạy**.

Thử nhìn chương trình này — hàm nào đáng tối ưu hơn?

\`\`\`java
for (int donHang = 0; donHang < 1000; donHang++) {
    doiTien(199000L);                    // trông "nặng": tính tiền, làm tròn
    for (int mon = 0; mon < 1000; mon++) {
        chuanHoaTen("Nguyen Van A");     // trông "nhẹ": cắt khoảng trắng
    }
}
\`\`\`

Đếm thật:

\`\`\`
5) dem loi goi -> doiTien 1000 | chuanHoaTen 1000000
6) diem nong = chuanHoaTen, chiem 99.9% loi goi
\`\`\`

Cái hàm "nhẹ" chạy nhiều hơn **một nghìn lần**. Bạn có làm \`doiTien\` nhanh gấp đôi thì tổng thời gian cũng gần như không nhúc nhích.

Đây là lý do tồn tại của **profiler**: công cụ đo xem thời gian thật sự đi đâu.

━━━━━━━━━━━━━━━━━━━━

🔥 TÌM ĐIỂM NÓNG BẰNG CÔNG CỤ CÓ SẴN

JDK đã tặng bạn một profiler xịn, không phải cài gì: **Java Flight Recorder**.

\`\`\`bash
# ghi lại 60 giây hoạt động của chương trình
java -XX:StartFlightRecording=duration=60s,filename=app.jfr -jar app.jar

# hoặc bật cho tiến trình ĐANG chạy
jcmd <pid> JFR.start duration=60s filename=app.jfr
\`\`\`

Mở file \`.jfr\` bằng **JDK Mission Control**, xem tab *Hot Methods* — nó xếp hạng đúng những hàm ngốn thời gian nhất. Thường thì thứ hạng một sẽ làm bạn ngạc nhiên.

Ba lệnh chẩn đoán nhanh khác, cũng có sẵn (đã gặp ở Ngày 46):

\`\`\`bash
jps                    # liệt kê tiến trình Java + pid
jcmd <pid> Thread.print # ảnh chụp mọi luồng — tìm chỗ đang kẹt
jcmd <pid> GC.heap_info # bộ nhớ đang dùng bao nhiêu (Ngày 52)
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🗂️ TỐI ƯU LỚN NHẤT: ĐỔI CẤU TRÚC DỮ LIỆU

Khi đã biết chỗ nóng, việc đầu tiên **không phải** là viết code khéo hơn. Là xem bạn có đang bắt máy làm việc thừa vì chọn sai cấu trúc không.

Tìm 10.000 lần trong một tập 20.000 phần tử:

\`\`\`
1) 10000 lan tim trong List 20000 phan tu -> 50005000 phep so sanh
2) doi sang HashSet -> 10000 phep so sanh (giam 5000 lan)
\`\`\`

Năm mươi triệu phép so sánh xuống còn mười nghìn. Thay đổi trong code là **đúng một dòng**:

\`\`\`java
List<String> daGui = new ArrayList<>();   // contains: duyệt cả danh sách
Set<String>  daGui = new HashSet<>();     // contains: nhảy thẳng tới ô
\`\`\`

Không mẹo vặt nào bù nổi việc chọn sai cấu trúc (bài Ngày 25). Vài cặp đáng thuộc:

- Kiểm tra "đã có chưa" nhiều lần → \`HashSet\`, đừng \`List.contains\`
- Tra theo khoá → \`HashMap\`, đừng lặp qua danh sách
- Thêm/xoá ở đầu → \`ArrayDeque\`, đừng \`ArrayList.remove(0)\`
- Cần thứ tự đã sắp → \`TreeMap\`, đừng sắp lại sau mỗi lần thêm

━━━━━━━━━━━━━━━━━━━━

🧵 NỐI CHUỖI TRONG VÒNG LẶP

Kinh điển, và vẫn gặp hằng ngày. Nối 10.000 đoạn, mỗi đoạn 5 ký tự:

\`\`\`
3) noi 10000 doan: dau '+' chep 250025000 ky tu, StringBuilder chep 73665
\`\`\`

Hai trăm năm mươi triệu so với bảy mươi ba nghìn — chênh hơn ba nghìn lần.

Vì \`String\` **không đổi được** (bài Ngày 09). Mỗi dấu \`+\` tạo ra một chuỗi hoàn toàn mới và chép lại toàn bộ phần đã có. Càng nối, chuỗi càng dài, mỗi lần chép càng nặng.

\`StringBuilder\` giữ một mảng và chỉ chép khi mảng đầy phải nở ra.

\`\`\`java
StringBuilder sb = new StringBuilder();
for (String doan : cacDoan) sb.append(doan);
String ket = sb.toString();
\`\`\`

Nói cho công bằng: nối vài chuỗi bằng \`+\` thì vẫn tốt và dễ đọc hơn — trình dịch tự chuyển thành \`StringBuilder\` giúp bạn. Nó chỉ hỏng **trong vòng lặp**, vì ở đó mỗi vòng là một \`StringBuilder\` mới toanh.

━━━━━━━━━━━━━━━━━━━━

⏱️ ĐO SAO CHO RA SỐ ĐÁNG TIN

Chỗ này người mới hay bị lừa nhất. Cách đo sai kinh điển:

\`\`\`java
long t = System.nanoTime();
lamViec();
System.out.println(System.nanoTime() - t);   // ❌ một con số vô nghĩa
\`\`\`

Sai vì **JVM chạy nguội rất chậm** (Ngày 51): lần đầu code chạy bằng trình thông dịch, phải qua vài nghìn vòng lặp JIT mới biên dịch nó thành mã máy tối ưu. Đo ngay lần đầu là đo tốc độ của một chương trình chưa vào guồng.

Ba việc tối thiểu để phép đo có nghĩa:

1. **Làm nóng trước** — chạy không vài nghìn vòng cho JIT kịp làm việc.
2. **Đo nhiều lần**, lấy **trung vị** (không phải trung bình — một lần GC chen ngang là trung bình hỏng).
3. **So tỉ lệ, đừng thờ con số tuyệt đối** — mili-giây phụ thuộc máy, tải, nhiệt độ CPU.

\`\`\`
4) do 5 lan, lay TRUNG VI -> StringBuilder nhanh hon it nhat 20 lan? true
\`\`\`

Để ý output không in ra một con số mili-giây nào. Nó trả lời một câu hỏi **có/không** với ngưỡng đã đặt trước — kiểu kết luận duy nhất còn đúng khi chạy trên máy khác.

Muốn đo nghiêm túc thì dùng **JMH**, thư viện đo chuẩn của chính đội OpenJDK:

\`\`\`xml
<dependency>
    <groupId>org.openjdk.jmh</groupId>
    <artifactId>jmh-core</artifactId>
    <version>1.37</version>
</dependency>
\`\`\`

\`\`\`java
@Benchmark
public String dungStringBuilder() {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < 10_000; i++) sb.append("abcde");
    return sb.toString();
}
\`\`\`

JMH tự lo làm nóng, tự chạy nhiều vòng, tự tính độ lệch, và tự chặn cái bẫy khó chịu nhất: JIT thấy kết quả **không ai dùng** thì xoá luôn cả đoạn code — bạn đo được "0 nano giây" và tưởng mình vừa viết ra phép màu.

━━━━━━━━━━━━━━━━━━━━

🧹 MẤY THỨ THẬT SỰ ĐÁNG SỬA

Sau khi đã đo và biết chỗ nóng, đây là những sửa đổi hay có tác dụng:

- **Đặt sức chứa ban đầu** khi biết trước cỡ: \`new ArrayList<>(10_000)\`, \`new StringBuilder(4096)\` — tránh nở mảng nhiều lần.
- **Tránh gói/mở gói không cần** (autoboxing): \`long\` cộng dồn thay cho \`Long\`; \`int[]\` thay cho \`List<Integer>\` ở vòng lặp nóng. Mỗi \`Integer\` là một đối tượng trên heap.
- **Đừng tạo rác trong vòng lặp** — đối tượng tạm sinh ra hàng triệu cái là bắt bộ dọn rác chạy liên tục (Ngày 52).
- **Đưa việc ra khỏi vòng lặp**: biên dịch \`Pattern\` một lần thành \`static final\`, đừng gọi \`String.matches\` trong vòng lặp.
- **Chỉ lấy dữ liệu cần dùng** — về sau khi làm việc với CSDL, đây sẽ là nguồn gốc của phần lớn sự chậm chạp.

━━━━━━━━━━━━━━━━━━━━

🚫 VÀ ĐỪNG TỐI ƯU SỚM

Code nhanh mà sai thì vô dụng; code khó đọc thì tháng sau chính bạn cũng ngại sửa. Thứ tự an toàn:

**Chạy đúng → có test (Ngày 53) → đo → tối ưu chỗ nóng → đo lại.**

Bước "đo lại" là bước hay bị bỏ nhất, mà nó mới là bước xác nhận bạn vừa làm điều có ích chứ không phải vừa làm code xấu đi.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết vòng lặp nối 100.000 chuỗi bằng \`+\` rồi bằng \`StringBuilder\` — đo cả hai sau khi đã làm nóng.
2. Đổi một \`List.contains\` trong code cũ sang \`HashSet\` và đếm số phép so sánh trước/sau.
3. Chạy chương trình với \`-XX:StartFlightRecording\`, mở bằng JDK Mission Control, tìm *Hot Methods*.
4. So \`long\` với \`Long\` khi cộng dồn 10 triệu lần — nhìn số lần dọn rác.
5. Đo một phép tính **không dùng kết quả**, xem JIT xoá sạch nó thế nào.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Hiệu năng không phải chuyện mẹo vặt, mà là chuyện **kỷ luật đo đạc**: đo trước để biết chỗ nóng thật (nó gần như không bao giờ nằm ở chỗ bạn đoán), sửa đúng chỗ đó — thường là đổi cấu trúc dữ liệu chứ không phải viết code khéo hơn — rồi đo lại để chứng minh.

Đến đây Giai đoạn 7 đã đủ bộ: bên trong JVM (51), bộ dọn rác (52), viết test (53–55), Maven (56), Git & CI (57), log & gỡ lỗi (58), và đo hiệu năng (59). Bảy mảnh rời.

Ngày mai ta ghép chúng lại. **Ngày 60: bài tổng hợp khép Giai đoạn 7** — một dự án nhỏ đi trọn vòng: có \`pom.xml\`, có test chạy trong CI, có log tử tế, có một chỗ chậm được phát hiện bằng đo đạc rồi sửa. Xong bài đó, ta bước sang Giai đoạn 8 — nơi dữ liệu bắt đầu sống lâu hơn chương trình. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
