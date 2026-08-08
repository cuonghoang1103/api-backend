/** "100 Ngày Java với CuongThai" — Ngày 19: Hợp thành (composition).
    Trả nốt món nợ từ Ngày 15 (`class DanhSachSinhVien extends ArrayList`
    sai ở đâu) và Ngày 18. Ngày 20 khép Giai đoạn 2 bằng equals/hashCode.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 19,
  card: 'java-day-19',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'refactor-creature-game-system-from-inheritance-to-composition',
    title: 'Chuyển hệ nhân vật game từ kế thừa sang hợp thành',
  },

  content: `🧩 100 NGÀY JAVA — NGÀY 19: HỢP THÀNH

Ngày 15 tôi nói dòng này sai nhưng chưa nói phải sửa thế nào:

\`\`\`java
class DanhSachSinhVien extends ArrayList { … }   // "cho tiện, có sẵn add/remove"
\`\`\`

Hôm nay trả nợ. Và đây là bài mà rất nhiều người đi làm vài năm vẫn chưa được ai giải thích tử tế.

━━━━━━━━━━━━━━━━━━━━

📌 PHÉP THỬ MỘT CÂU

Trước khi gõ \`extends\`, đọc to lên:

- "XeMay **LÀ MỘT** PhuongTien" — nghe đúng ✓ → kế thừa
- "LopHoc **LÀ MỘT** ArrayList" — nghe sai ✗ → không kế thừa

Lớp học không LÀ một danh sách. Nó **CÓ MỘT** danh sách học sinh, cộng thêm tên lớp, sĩ số tối đa, giáo viên chủ nhiệm. Quan hệ "CÓ MỘT" thì viết bằng field, không viết bằng \`extends\`.

━━━━━━━━━━━━━━━━━━━━

⚠️ KẾ THỪA THƯ VIỆN = MỞ TOANG CỬA

Xem chuyện gì xảy ra khi làm sai:

\`\`\`java
class LopSai extends ArrayList<String> { }

LopSai sai = new LopSai();
sai.add("An");
sai.add("An");     // trùng tên
sai.add(null);     // null vào lớp học?
\`\`\`

Kết quả thật:

\`\`\`
1) LopSai chua: [An, An, null]  -> khong ai chan gi ca
\`\`\`

Bạn muốn có \`add\` cho tiện, nhưng bạn nhận về TOÀN BỘ \`ArrayList\`: \`add\`, \`remove\`, \`clear\`, \`set\`, \`addAll\`… tất cả đều \`public\`, và không có cách nào rút lại. Ngày 13 dạy đóng gói là "một cửa vào có người gác" — kế thừa kiểu này phá sạch cái cửa đó.

Còn tệ hơn: nếu bạn ghi đè \`add()\` để kiểm tra, thì \`addAll()\` của lớp cha gọi \`add()\` hay không lại là chuyện nội bộ của thư viện — nó đổi ở phiên bản sau là code bạn hỏng mà không ai báo.

━━━━━━━━━━━━━━━━━━━━

🚪 HỢP THÀNH: GIỮ RUỘT BÊN TRONG, MỞ ĐÚNG CÁI CẦN

\`\`\`java
class LopHoc {
    private final String ten;
    private final List<String> hocSinh = new ArrayList<>();   // CÓ MỘT
    private final int siSoToiDa;

    boolean themHocSinh(String hs) {
        if (hs == null || hs.isBlank())  return false;   // chặn null
        if (hocSinh.size() >= siSoToiDa) return false;   // chặn quá tải
        if (hocSinh.contains(hs))        return false;   // chặn trùng
        return hocSinh.add(hs);
    }

    int siSo() { return hocSinh.size(); }
    List<String> danhSach() { return List.copyOf(hocSinh); }   // bản sao — Ngày 13
}
\`\`\`

Chạy thật với sĩ số tối đa 2:

\`\`\`
2) them An      -> true
3) them An lan 2-> false
5) them Chi(day)-> false
6) si so 2 [An, Binh]
\`\`\`

Mọi luật của lớp học đều được tôn trọng, vì chỉ có MỘT đường vào và đường đó có người gác. \`clear()\` không tồn tại với người dùng lớp này — bạn chưa mở nó ra.

━━━━━━━━━━━━━━━━━━━━

🔧 PHẦN THƯỞNG: ĐỔI RUỘT KHÔNG AI BIẾT

\`\`\`java
private List<String> hocSinh = new ArrayList<>();
\`\`\`

Mai thấy \`LinkedList\` hợp hơn? Hay muốn dùng \`TreeSet\` để tự sắp xếp và tự chặn trùng? Hay cất luôn xuống cơ sở dữ liệu?

Đổi đúng một dòng. Bên ngoài vẫn gọi \`themHocSinh()\`, \`siSo()\`, \`danhSach()\` — không ai phải sửa gì.

Còn nếu đã \`extends ArrayList\` thì kiểu đó nằm trong CHỮ KÝ của class rồi. Muốn đổi là phá code của tất cả những ai đang dùng.

━━━━━━━━━━━━━━━━━━━━

🧭 VẬY KHI NÀO KẾ THỪA?

Chỉ khi cả ba cùng đúng:

1. "LÀ MỘT" nghe thuận tai thật sự.
2. Lớp con dùng được TOÀN BỘ những gì lớp cha công bố — không có cái nào cần cấm.
3. Lớp cha được thiết kế ĐỂ kế thừa (có tài liệu nói rõ nên ghi đè cái gì), hoặc chính bạn viết ra nó.

Kế thừa từ class của thư viện người khác thường trượt điều 3 — bạn đang phụ thuộc vào chi tiết bên trong mà họ có toàn quyền đổi.

Câu tổng kết kinh điển của Gang of Four: **"Ưu tiên hợp thành hơn kế thừa."** Không phải "cấm kế thừa" — mà là: mặc định chọn hợp thành, chỉ kế thừa khi có lý do rõ ràng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`GioHang extends ArrayList<SanPham>\` rồi thêm hai món trùng nhau và một \`null\`.
2. Viết lại bằng hợp thành, chặn trùng và chặn \`null\`, có \`tongTien()\`.
3. Đổi ruột từ \`ArrayList\` sang \`LinkedHashSet\` — kiểm chứng code bên ngoài không phải sửa.
4. Trả \`danhSach()\` bằng \`List.copyOf(...)\` rồi thử sửa nó từ bên ngoài (nối Ngày 13).
5. Với mỗi cặp sau, chọn LÀ MỘT hay CÓ MỘT: Xe–Động cơ · ChóLà–ThúCưng · TàiKhoản–LịchSửGiaoDịch · HìnhVuông–HìnhChữNhật.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Kế thừa nói "tôi LÀ", hợp thành nói "tôi CÓ". Chọn sai thì mất cả đóng gói lẫn quyền đổi ý sau này — và cái giá đó trả dần suốt vòng đời dự án.

Ngày mai khép lại Giai đoạn 2 bằng ba method mà mọi class đều thừa hưởng từ \`Object\` (Ngày 15) nhưng gần như luôn phải viết lại: \`toString()\`, \`equals()\`, \`hashCode()\`.

Nhớ Ngày 11 chứ — hai đối tượng cùng nội dung mà \`equals\` vẫn trả \`false\`? Ngày 20 ta sửa nó, và học luôn cái hợp đồng \`equals\`–\`hashCode\` mà phá là mất dữ liệu trong \`HashMap\`. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
