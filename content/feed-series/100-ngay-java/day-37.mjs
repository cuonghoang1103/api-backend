/** "100 Ngày Java với CuongThai" — Ngày 37: enum.
    Nối chỗ Ngày 36 kết (dùng String/int cho tập giá trị cố định, gõ sai
    không ai bắt). Dùng lại `==` vs `equals` của Ngày 09 và switch của
    Ngày 05. Ngày 38 (record) trỏ ngược về phần kết.

    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 37,
  card: 'java-day-37',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'model-arithmetic-operators-as-an-enum',
    title: 'Mô hình hoá toán tử bằng enum',
  },

  content: `🎚️ 100 NGÀY JAVA — NGÀY 37: ENUM

Hôm qua tôi để lại cái bẫy này:

\`\`\`java
String trangThai = "DANG_GIAO";

if (trangThai.equals("DANG_GAIO")) {   // gõ sai một chữ
    giaoHang();
}
\`\`\`

Chương trình dịch được, chạy được, và \`giaoHang()\` không bao giờ chạy. Không lỗi, không cảnh báo — chỉ có đơn hàng không bao giờ được giao và bạn ngồi tìm cả buổi.

Với \`enum\`, chuyện đó là lỗi lúc dịch.

━━━━━━━━━━━━━━━━━━━━

📌 KHAI BÁO MỘT TẬP ĐÓNG

\`\`\`java
enum TrangThai {
    CHO_XAC_NHAN, DANG_GIAO, HOAN_TAT, DA_HUY
}

TrangThai t = TrangThai.DANG_GAIO;   // ✗ lỗi ngay lúc dịch
\`\`\`

Trình dịch biết chính xác bốn giá trị hợp lệ. Gõ sai là không dịch được — chưa kịp chạy đã bị chặn.

Hai điểm khác biệt đáng nhớ so với \`String\`:

\`\`\`java
TrangThai a = TrangThai.HOAN_TAT;
TrangThai b = TrangThai.valueOf("HOAN_TAT");
a == b;   // true
\`\`\`

\`\`\`
7) so bang == -> true
\`\`\`

Với \`String\` thì \`==\` là cái bẫy của Ngày 9. Với \`enum\` thì \`==\` **an toàn và được khuyến khích**: mỗi hằng số enum chỉ tồn tại đúng MỘT đối tượng trong cả chương trình.

Và đọc từ chuỗi thì sai là biết ngay:

\`\`\`
6) go sai -> IllegalArgumentException
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🏗️ ENUM CỦA JAVA LÀ MỘT CLASS THẬT

Đây là chỗ Java khác hẳn C, C++ hay JavaScript — nơi enum chỉ là mấy con số có tên. Enum Java chứa được dữ liệu và hành vi:

\`\`\`java
enum TrangThai {
    CHO_XAC_NHAN("Cho xac nhan", false),
    DANG_GIAO("Dang giao", false),
    HOAN_TAT("Hoan tat", true),
    DA_HUY("Da huy", true);

    private final String nhan;
    private final boolean ketThuc;

    TrangThai(String nhan, boolean ketThuc) {   // constructor
        this.nhan = nhan;
        this.ketThuc = ketThuc;
    }

    String getNhan() { return nhan; }
    boolean daKetThuc() { return ketThuc; }
}
\`\`\`

\`\`\`
1) CHO_XAC_NHAN | nhan=Cho xac nhan | ket thuc? false
\`\`\`

Nhãn tiếng Việt để hiển thị, cờ \`ketThuc\` cho nghiệp vụ — tất cả đi kèm ngay tại chỗ khai báo, không phải một cái \`Map\` riêng nằm ở file khác rồi quên cập nhật.

Constructor của enum luôn \`private\` ngầm: không ai \`new TrangThai(...)\` được. Số lượng hằng là cố định — đó chính là điểm mạnh.

━━━━━━━━━━━━━━━━━━━━

🧠 ĐẶT LUẬT NGHIỆP VỤ NGAY TRONG ENUM

\`\`\`java
TrangThai tiepTheo() {
    switch (this) {
        case CHO_XAC_NHAN: return DANG_GIAO;
        case DANG_GIAO:    return HOAN_TAT;
        default:           return this;
    }
}
\`\`\`

\`\`\`
2) tiep theo -> DANG_GIAO -> HOAN_TAT
\`\`\`

Luật chuyển trạng thái nằm CÙNG CHỖ với trạng thái. Thêm một trạng thái mới thì chỉ sửa một file — thay vì đi tìm mọi câu \`if\` rải rác khắp chương trình.

Đây là đóng gói (Ngày 13) áp dụng cho một tập giá trị: dữ liệu và hành vi của cùng một khái niệm ở chung một nhà.

━━━━━━━━━━━━━━━━━━━━

🧰 BỘ ĐỒ NGHỀ ĐI KÈM

\`\`\`java
TrangThai.values()              // mảng tất cả hằng, đúng thứ tự khai báo
TrangThai.valueOf("DANG_GIAO")  // đọc từ chuỗi
t.name()                        // "DANG_GIAO"
t.ordinal()                     // vị trí: 0, 1, 2, 3
\`\`\`

\`\`\`
3) tat ca -> [CHO_XAC_NHAN, DANG_GIAO, HOAN_TAT, DA_HUY]
8) EnumMap giu thu tu khai bao -> {CHO_XAC_NHAN=7, DA_HUY=3}
\`\`\`

\`values()\` rất tiện để đổ vào danh sách chọn trên giao diện — thêm trạng thái mới là giao diện tự có, không phải sửa gì.

\`EnumMap\` và \`EnumSet\` là bản chuyên dụng cho enum: nhanh hơn \`HashMap\`/\`HashSet\` (bên trong chỉ là một mảng) và luôn giữ thứ tự khai báo.

**Một cảnh báo nghiêm túc về \`ordinal()\`:**

\`\`\`java
luuVaoDb(t.ordinal());   // ✗ ĐỪNG
luuVaoDb(t.name());      // ✓
\`\`\`

Hôm nay \`HOAN_TAT\` có \`ordinal()\` là 2. Mai bạn chèn một trạng thái mới vào giữa, nó thành 3 — và toàn bộ dữ liệu cũ trong cơ sở dữ liệu vừa đổi nghĩa. Lưu \`name()\`, hoặc tự đặt một mã riêng làm field.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`enum ThuTrongTuan\` có nhãn tiếng Việt và method \`laCuoiTuan()\`.
2. Viết \`enum PhepToan { CONG, TRU, NHAN, CHIA }\` với method \`tinh(double a, double b)\`.
3. Dùng \`values()\` in ra mọi hằng kèm nhãn.
4. Gọi \`valueOf\` với chuỗi gõ sai và bắt ngoại lệ, trả về giá trị mặc định.
5. So hai enum bằng \`==\` và bằng \`equals\` — giải thích vì sao lần này cả hai đều đúng.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tập giá trị đóng và biết trước thì dùng \`enum\`, đừng dùng \`String\` hay \`int\`. Enum Java là class thật: có field, constructor, method, và đặt được luật nghiệp vụ ngay bên trong. Dùng \`name()\` khi lưu trữ, không dùng \`ordinal()\`.

Bây giờ nhìn lại class \`SinhVien\` ta viết đi viết lại suốt loạt bài:

\`\`\`java
class SinhVien {
    private final String ten;
    private final double diem;
    SinhVien(String ten, double diem) { … }   // constructor
    String getTen() { … }                      // getter
    double getDiem() { … }                     // getter
    @Override public boolean equals(Object o) { … }   // 5 dòng
    @Override public int hashCode() { … }
    @Override public String toString() { … }
}
\`\`\`

Ba mươi dòng, mà bản chất chỉ có một câu: *"sinh viên gồm tên và điểm"*.

Ngày 38: \`record\` — ba mươi dòng trên rút còn một, và Java tự sinh giúp toàn bộ phần còn lại. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
