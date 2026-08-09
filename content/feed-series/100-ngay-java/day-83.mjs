/** "100 Ngày Java với CuongThai" — Ngày 83: CRUD bài viết (Blog API).
    Nối đúng chỗ Ngày 82 kết ("khung đã dựng, slug đã có; giờ tới phần thịt:
    bài viết — đăng, sửa, xoá, có tác giả, có trạng thái nháp/đã đăng").
    Ngày 84 (phân trang + sắp xếp) trỏ ngược về phần kết.

    ⚠ LUẬT 1+6: vòng đời bài viết chạy JDK thuần, ngày đăng dùng hằng cố định
    (không now()). Thân bài dạy @Entity/BaiVietService thật. Output là kết quả
    THẬT của javac/java JDK 21. */
export default {
  day: 83,
  card: 'java-day-83',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-generic-object-mapper-with-reflection',
    title: 'Bộ ánh xạ đối tượng (nền cho entity ↔ DTO)',
  },

  content: `📝 100 NGÀY JAVA — NGÀY 83: CRUD BÀI VIẾT

Ngày 82 dựng khung và làm viên gạch slug. Hôm nay tới phần thịt đầu tiên của Blog API: **bài viết**. Nhưng lần này không phải bài tập CRUD rời rạc như Giai đoạn 8 — mà là một tính năng thật, có tác giả, có thời điểm, có trạng thái nháp/đã đăng.

━━━━━━━━━━━━━━━━━━━━

🗂️ THỰC THỂ BaiViet

Bắt đầu bằng entity (Ngày 70), thêm những trường mà một bài blog thật cần:

\`\`\`java
@Entity
public class BaiViet {
    @Id @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;                    // đường dẫn, DUY NHẤT (Ngày 82)

    private String tieuDe;
    @Column(columnDefinition = "TEXT")
    private String noiDung;

    @Enumerated(EnumType.STRING)
    private TrangThai trangThai = TrangThai.NHAP;   // NHAP | DA_DANG

    private Instant ngayTao;
    private Instant ngayDang;

    @ManyToOne
    private NguoiDung tacGia;                // ai viết (Ngày 71)
}
\`\`\`

Chú ý \`@Column(unique = true)\` trên \`slug\`: ràng buộc ở CSDL đảm bảo không hai bài trùng đường dẫn, kể cả khi hai request chạy song song (Ngày 41, 61).

━━━━━━━━━━━━━━━━━━━━

📝 ĐĂNG BÀI: SERVICE TỰ SINH SLUG

Controller nhận request, nhưng logic "sinh slug, đặt trạng thái nháp" thuộc về service (Ngày 72):

\`\`\`java
@Transactional
public BaiViet dang(String tieuDe, String noiDung, NguoiDung tacGia) {
    String slug = slugDuyNhat(taoSlug(tieuDe));   // Ngày 82
    BaiViet b = new BaiViet(slug, tieuDe, noiDung, tacGia);
    b.setTrangThai(TrangThai.NHAP);               // mặc định nháp
    return khoBaiViet.save(b);
}
\`\`\`

\`\`\`
1) dang 'Hoc Java' -> slug 'hoc-java', trang thai NHAP
\`\`\`

Bài mới mặc định **NHÁP** — quan trọng: người viết cần soạn xong mới công bố, không phải vừa gõ vài chữ đã lộ ra ngoài.

━━━━━━━━━━━━━━━━━━━━

🌓 NHÁP vs ĐÃ ĐĂNG — LỌC Ở TẦNG DỮ LIỆU

Công bố là một hành động riêng, đổi trạng thái và đóng dấu thời điểm:

\`\`\`
2) cong bo -> DA_DANG, ngay dang 2026-08-09
\`\`\`

Và đây là điểm mấu chốt: **danh sách công khai chỉ được trả bài đã đăng**:

\`\`\`
5) danh sach cong khai -> [hoc-java] (bai nhap bi an)
\`\`\`

Bài nháp tuyệt đối không lọt ra endpoint công khai. Cách làm đúng là lọc ngay ở repository, đừng lấy hết rồi lọc trong Java (Ngày 62):

\`\`\`java
List<BaiViet> findByTrangThaiOrderByNgayDangDesc(TrangThai tt);
// gọi: findByTrangThai(TrangThai.DA_DANG)
\`\`\`

Lỗi kinh điển: quên điều kiện \`trangThai\`, thế là bài nháp dở dang của người ta hiện lên trang chủ. Lọc ở tầng dữ liệu, không ở tầng hiển thị.

━━━━━━━━━━━━━━━━━━━━

🔗 SỬA TIÊU ĐỀ: SLUG PHẢI GIỮ NGUYÊN

Đây là chi tiết phân biệt người mới với người đã đi làm. Khi sửa tiêu đề, **đừng sinh lại slug**:

\`\`\`
3) sua tieu de -> 'Hoc Java Co Ban', slug GIU NGUYEN 'hoc-java'
\`\`\`

Vì sao? Slug đã đăng là địa chỉ công khai — người ta đã chia sẻ link \`/bai-viet/hoc-java\` lên Facebook, Google đã đánh chỉ mục nó. Đổi slug thành \`hoc-java-co-ban\` là **làm chết mọi link cũ** (404) và mất hết thứ hạng tìm kiếm.

Nguyên tắc: **slug chốt một lần lúc đăng, sau đó bất biến.** Sửa tiêu đề chỉ đổi phần hiển thị, không đổi đường dẫn. (Nếu bắt buộc phải đổi slug, phải kèm chuyển hướng 301 từ slug cũ sang mới — nhưng tốt nhất là đừng.)

━━━━━━━━━━━━━━━━━━━━

🔍 ĐỌC THEO SLUG, XOÁ

\`\`\`
4) doc theo slug 'hoc-java' -> tieu de 'Hoc Java Co Ban'
6) xoa 'hoc-java' -> con 1 bai trong kho
\`\`\`

Endpoint đọc dùng slug thay vì id — \`/bai-viet/hoc-java\` đẹp và dễ nhớ hơn \`/bai-viet/42\`. Bộ CRUD đầy đủ đúng bốn động từ của Ngày 76, giờ mang màu Blog:

\`\`\`java
@PostMapping("/bai-viet")            // đăng (201)
@GetMapping("/bai-viet/{slug}")      // đọc (200/404)
@GetMapping("/bai-viet")             // danh sách công khai
@PutMapping("/bai-viet/{slug}")      // sửa (200)
@DeleteMapping("/bai-viet/{slug}")   // xoá (204)
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧪 THỬ BẰNG curl

Vì đã tách backend rõ ràng, cả tính năng thử được ngay không cần giao diện:

\`\`\`bash
curl -X POST localhost:8080/bai-viet -H "Content-Type: application/json" \\
  -d '{"tieuDe":"Học Java","noiDung":"..."}'          # 201, trả slug
curl localhost:8080/bai-viet/hoc-java                  # đọc bài
curl -X POST localhost:8080/bai-viet/hoc-java/cong-bo  # công bố
curl localhost:8080/bai-viet                           # chỉ bài đã đăng
\`\`\`

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo entity \`BaiViet\` với slug \`unique\`, trạng thái \`enum\`, tác giả \`@ManyToOne\`.
2. Viết \`BaiVietService.dang\` tự sinh slug và đặt trạng thái NHÁP.
3. Thêm endpoint công bố, và \`findByTrangThai(DA_DANG)\` cho danh sách công khai.
4. Sửa tiêu đề một bài đã đăng, xác nhận slug KHÔNG đổi.
5. Thử toàn bộ bằng \`curl\`, kiểm bài nháp không hiện ở danh sách công khai.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bài viết là CRUD của Ngày 76 nhưng mang đời thực: service tự sinh slug khi đăng, trạng thái **nháp/đã đăng** với danh sách công khai lọc sạch ở tầng dữ liệu, và một luật vàng — **slug bất biến sau khi đăng** để không vỡ link cũ. Đây là miếng thịt đầu tiên của Blog API, chạy được bằng \`curl\`.

Nhưng một blog thật có hàng nghìn bài. Trả hết trong một request là thảm hoạ: chậm, tốn bộ nhớ, và không ai đọc nghìn bài cùng lúc. Người đọc muốn xem **trang đầu, mới nhất trước**, rồi bấm "trang sau".

Ngày 84: **Phân trang & sắp xếp** — trả 20 bài mỗi trang, mới nhất lên trước, kèm tổng số trang; \`Pageable\` và \`Sort\` của Spring Data làm việc này gọn thế nào, và vì sao \`OFFSET\` lớn lại là một cái bẫy hiệu năng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
