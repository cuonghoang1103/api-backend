/** "100 Ngày Java với CuongThai" — Ngày 86: Bình luận & thẻ. KHÉP LÔ (77-86).
    Nối đúng chỗ Ngày 85 kết ("blog một chiều; cần tương tác — bình luận và thẻ;
    một-nhiều và nhiều-nhiều mà Ngày 71 mới chạm tới").
    Ngày 87 (ảnh bìa: upload file) trỏ ngược về phần kết.

    ⚠ LUẬT 6: dựng nguyên lý quan hệ JPA bằng JDK thuần (một-nhiều, nhiều-nhiều,
    N+1, cascade); thân bài dạy @OneToMany/@ManyToMany thật. Output là kết quả
    THẬT của javac/java JDK 21. */
export default {
  day: 86,
  card: 'java-day-86',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-metro-transit-route-analyzer-using-adjacency-list-graph-traversal',
    title: 'Phân tích tuyến metro bằng đồ thị (quan hệ giữa các nút)',
  },

  content: `💬 100 NGÀY JAVA — NGÀY 86: BÌNH LUẬN & THẺ

Blog của bạn giờ đăng bài, phân trang, tìm kiếm được. Nhưng nó vẫn một chiều: tác giả nói, người đọc chỉ đọc.

Một blog sống động cần **tương tác**: người đọc bình luận, và bài được gắn **thẻ** để gom theo chủ đề. Cả hai đều là chuyện *quan hệ giữa các bảng* mà Ngày 71 mới chạm tới — hôm nay làm cho trọn, và khép lô mười ngày.

━━━━━━━━━━━━━━━━━━━━

💬 BÌNH LUẬN: QUAN HỆ MỘT-NHIỀU

Một bài có nhiều bình luận, mỗi bình luận thuộc về một bài. Đây là **một-nhiều** kinh điển (Ngày 71):

\`\`\`java
@Entity
public class BinhLuan {
    @Id @GeneratedValue Long id;
    String noiDung;
    String tacGia;
    Instant ngayTao;

    @ManyToOne              // NHIỀU bình luận thuộc MỘT bài
    @JoinColumn(name = "bai_viet_id")
    BaiViet baiViet;
}
\`\`\`

\`\`\`
1) bai b1 -> 3 binh luan (mot-nhieu)
2) bai b2 -> 1 binh luan
\`\`\`

Khoá ngoại \`bai_viet_id\` nằm bên \`BinhLuan\` (phía "nhiều"), đúng như Ngày 62. Bên \`BaiViet\` khai back-relation nếu cần duyệt ngược:

\`\`\`java
@OneToMany(mappedBy = "baiViet", cascade = CascadeType.ALL, orphanRemoval = true)
List<BinhLuan> binhLuan = new ArrayList<>();
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🏷️ THẺ: QUAN HỆ NHIỀU-NHIỀU

Thẻ khác bình luận ở chỗ nó **dùng chung**: một bài có nhiều thẻ, và một thẻ gắn nhiều bài. Đây là **nhiều-nhiều**:

\`\`\`
3) gan the: b1=[java, oop], b2=[java] -> the 'java' co [b1, b2] (nhieu-nhieu)
4) tim bai theo the 'java' -> [b1, b2]
\`\`\`

Quan hệ nhiều-nhiều không nhét được vào một cột khoá ngoại như một-nhiều. Nó cần một **bảng nối** (join table) ở giữa — mỗi dòng là một cặp (bài, thẻ):

\`\`\`java
@Entity
public class BaiViet {
    @ManyToMany
    @JoinTable(name = "bai_viet_the",
        joinColumns = @JoinColumn(name = "bai_viet_id"),
        inverseJoinColumns = @JoinColumn(name = "the_id"))
    Set<The> cacThe = new HashSet<>();
}
\`\`\`

\`@ManyToMany\` bảo JPA tự tạo bảng nối \`bai_viet_the\` với hai cột khoá ngoại. Nhờ nó bạn tra được **cả hai chiều**: từ bài ra thẻ, và từ thẻ ra các bài (endpoint \`/the/java\` liệt kê mọi bài gắn thẻ "java").

Một mẹo thực tế: dùng \`Set\` (không phải \`List\`) cho quan hệ nhiều-nhiều — một bài không nên gắn cùng một thẻ hai lần, và \`Set\` chặn trùng tự nhiên (Ngày 25).

━━━━━━━━━━━━━━━━━━━━

🕳️ VÀ N+1 LẠI XUẤT HIỆN

Có quan hệ là có nguy cơ N+1 (Ngày 71). Liệt kê 3 bài rồi đếm bình luận từng bài:

\`\`\`
5) N+1: dem binh luan 3 bai tung cai -> 1+3=4 truy van (JOIN FETCH gom con 1)
\`\`\`

Một câu lấy danh sách bài, rồi mỗi bài một câu lấy bình luận → 1+N. Với trang hiện 20 bài kèm số bình luận, đó là 21 truy vấn. Chữa như cũ: \`JOIN FETCH\` hoặc \`@EntityGraph\` để lấy kèm trong một câu.

Đây là lý do bài Ngày 71 quan trọng: quan hệ càng nhiều, N+1 càng dễ lẻn vào. Thói quen: mỗi khi hiển thị danh sách kèm dữ liệu con, tự hỏi "trang này chạy bao nhiêu truy vấn?".

━━━━━━━━━━━━━━━━━━━━

🗑️ CASCADE: XOÁ BÀI THÌ XOÁ GÌ THEO?

Xoá một bài — bình luận của nó nên biến mất (chúng vô nghĩa khi bài không còn). Nhưng **thẻ thì không**, vì thẻ "java" còn gắn nhiều bài khác:

\`\`\`
6) xoa b1 -> binh luan b1 mat (cascade), the 'java' van con [b2]
\`\`\`

Đây là điểm dễ sai. Quy tắc phân biệt:

- **Bình luận thuộc sở hữu bài** (không tồn tại độc lập) → \`cascade = ALL\` + \`orphanRemoval = true\`: xoá bài thì xoá theo.
- **Thẻ dùng chung** (tồn tại độc lập) → **không** cascade xoá. Xoá bài chỉ gỡ liên kết trong bảng nối, thẻ vẫn còn cho bài khác.

Đặt \`cascade = ALL\` cho quan hệ nhiều-nhiều với thẻ là một lỗi kinh điển: xoá một bài lại xoá luôn thẻ, làm mất thẻ khỏi mọi bài khác.

━━━━━━━━━━━━━━━━━━━━

🧭 NHÌN LẠI LÔ 77–86

Mười ngày, và Blog API đã ra dáng:

\`\`\`
77-81  bảo mật: mật khẩu, JWT, filter, phân quyền, luồng đăng nhập
82     dựng khung + slug
83     CRUD bài viết (nháp/đăng)
84     phân trang & sắp xếp
85     tìm kiếm (chỉ mục ngược / full-text)
86     bình luận & thẻ (quan hệ)
\`\`\`

Từ một khung rỗng, giờ bạn có một backend blog thật: có người dùng đăng nhập, đăng bài, lật trang, tìm kiếm, bình luận, gắn thẻ. Mọi thứ học suốt 86 ngày đang cùng làm việc trong một dự án.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo entity \`BinhLuan\` với \`@ManyToOne BaiViet\`, thêm bình luận vào một bài.
2. Tạo \`@ManyToMany\` giữa \`BaiViet\` và \`The\` với \`@JoinTable\`.
3. Viết endpoint \`/the/{ten}\` liệt kê các bài mang thẻ đó.
4. Bật \`show-sql\`, tái hiện N+1 khi liệt kê bài kèm bình luận, rồi sửa bằng \`JOIN FETCH\`.
5. Xoá một bài, xác nhận bình luận mất theo nhưng thẻ vẫn còn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tương tác của blog là hai kiểu quan hệ: **bình luận** một-nhiều (khoá ngoại bên phía nhiều, cascade xoá theo bài) và **thẻ** nhiều-nhiều (bảng nối, tra hai chiều, KHÔNG cascade xoá vì dùng chung). Có quan hệ là phải canh N+1 — lấy kèm bằng \`JOIN FETCH\`. Đây là khép lô mười ngày với một Blog API đã đủ đầy tính năng cốt lõi.

Nhưng bài viết của bạn giờ vẫn chỉ có chữ. Một blog thật cần **ảnh** — ảnh bìa, ảnh chèn trong bài. Mà ảnh thì khác hẳn chữ: nó là file, có khi vài MB, không nhét vào cột \`TEXT\` được, và phải lưu ở đâu đó rồi phục vụ lại cho trình duyệt.

Ngày 87: **Upload ảnh bìa** — nhận file từ client (\`MultipartFile\`), kiểm loại và kích thước (đừng tin client, Ngày 69), lưu trữ (đĩa hay dịch vụ như S3/R2), và trả lại đường dẫn để hiển thị. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
