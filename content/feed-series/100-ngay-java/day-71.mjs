/** "100 Ngày Java với CuongThai" — Ngày 71: Quan hệ trong JPA & bẫy N+1.
    Nối đúng chỗ Ngày 70 kết ("mỗi @Entity đứng một mình; làm sao khach.getDon()
    trả đúng danh sách mà không nổ số truy vấn?").
    Ngày 72 (tầng service & @Transactional) trỏ ngược về phần kết.

    ⚠ LUẬT 5+6: đếm số truy vấn (cố định), không đo thời gian; thẻ chạy JDK
    thuần. Thân bài dạy @OneToMany/@ManyToOne/JOIN FETCH thật. Output là kết
    quả THẬT của javac/java JDK 21. */
export default {
  day: 71,
  card: 'java-day-71',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'document-and-structure-a-recipe-management-system-with-javadoc',
    title: 'Mô hình hoá hệ quản lý công thức (quan hệ giữa thực thể)',
  },

  content: `🔗 100 NGÀY JAVA — NGÀY 71: QUAN HỆ TRONG JPA & BẪY N+1

Ngày 70 để lại một câu hỏi: mỗi \`@Entity\` đứng một mình, nhưng dữ liệu thật thì nối nhau — một khách có nhiều đơn. Làm sao \`khach.getDanhSachDon()\` trả về đúng danh sách đơn, mà không làm nổ tung số truy vấn?

Hôm nay trả lời cả hai vế. Và vế thứ hai — bẫy N+1 — là một trong những lỗi hiệu năng phổ biến nhất trong mọi ứng dụng dùng JPA. Đọc kỹ phần đó.

━━━━━━━━━━━━━━━━━━━━

🔗 KHOÁ NGOẠI THÀNH LIÊN KẾT ĐỐI TƯỢNG

Ở Giai đoạn 8, một đơn "thuộc về" một khách qua cột khoá ngoại \`ma_khach\`, và bạn nối lại bằng \`JOIN\` viết tay (Ngày 62). JPA biến mối nối đó thành **liên kết đối tượng** trực tiếp:

\`\`\`java
@Entity
public class Don {
    @Id private String ma;
    private int soTien;

    @ManyToOne                     // NHIỀU đơn thuộc MỘT khách
    @JoinColumn(name = "ma_khach") // cột khoá ngoại
    private Khach khach;
}

@Entity
public class Khach {
    @Id private String id;
    private String ten;

    @OneToMany(mappedBy = "khach") // MỘT khách có NHIỀU đơn
    private List<Don> danhSachDon;
}
\`\`\`

Giờ bạn viết \`don.getKhach().getTen()\` hay \`khach.getDanhSachDon()\` — làm việc với đối tượng, không viết \`JOIN\` nữa. Hai chú thích cần hiểu:

- \`@ManyToOne\` đặt ở phía "nhiều" (\`Don\`) — phía **giữ cột khoá ngoại**.
- \`@OneToMany(mappedBy = "khach")\` ở phía "một" (\`Khach\`). \`mappedBy\` nói "cột khoá ngoại nằm bên \`Don\`, ở trường tên \`khach\`" — để JPA khỏi tạo bảng nối thừa.

━━━━━━━━━━━━━━━━━━━━

🕳️ BẪY N+1: TRĂM TRUY VẤN BẠN KHÔNG THẤY

Đây là phần quan trọng nhất. Xem đoạn code trông hoàn toàn vô hại này:

\`\`\`java
List<Khach> ds = khoKhach.findAll();       // lấy danh sách khách
for (Khach k : ds) {
    System.out.println(k.getDanhSachDon().size());   // đơn của từng người
}
\`\`\`

Đếm số truy vấn thật sự chạy xuống CSDL:

\`\`\`
1) lay 3 khach roi lay don TUNG NGUOI -> tong 4 don
2) N+1: 1 + 3 = 4 truy van
\`\`\`

Một câu để lấy danh sách khách, rồi **mỗi** lần \`getDanhSachDon()\` lại là một câu nữa. Ba khách → 4 câu. Nghe không tệ?

Bây giờ thay 3 bằng số thật: một trang liệt kê **100 khách** sẽ chạy **101 truy vấn**. Một nghìn khách → một nghìn linh một. Trang tải chậm dần, CSDL è cổ, mà nhìn vào code Java bạn **không thấy** một câu SQL nào — chúng ẩn sau mỗi lần truy cập quan hệ. Đây là lý do N+1 khó phát hiện: nó vô hình trong code.

Nhớ lại Ngày 66 và Ngày 59: chi phí thật nằm ở **số lần chạm CSDL**, không phải ở dòng code trông nặng.

━━━━━━━━━━━━━━━━━━━━

✅ CÁCH CHỮA: JOIN FETCH

Lời giải là bảo JPA lấy khách **kèm luôn** đơn trong một câu — đúng \`JOIN\` của Ngày 62:

\`\`\`java
@Query("SELECT k FROM Khach k JOIN FETCH k.danhSachDon")
List<Khach> layTatCaKemDon();
\`\`\`

\`\`\`
3) JOIN FETCH: lay khach KEM don 1 luot -> tong 4 don
4) giam tu 4 xuong 1 truy van
\`\`\`

Bốn truy vấn xuống còn một. Cùng kết quả, cùng dữ liệu, khác nhau ở chỗ CSDL bị hỏi một lần thay vì bốn. Với 100 khách thì đây là khác biệt giữa 101 câu và 1 câu — thấy được ngay trên đồng hồ.

Ngoài \`JOIN FETCH\` còn có \`@EntityGraph\` và truy vấn theo lô, nhưng nguyên tắc chung là một: **khi biết mình sẽ cần dữ liệu con, hãy lấy nó cùng lúc.**

━━━━━━━━━━━━━━━━━━━━

⏳ LAZY vs EAGER — GỐC RỄ CỦA N+1

Vì sao N+1 xảy ra? Vì mặc định JPA tải quan hệ theo kiểu **lazy** (lười): chưa dùng thì chưa lấy.

\`\`\`
5) LAZY: chi lay khach, chua dung don -> 1 truy van (don tai khi CAN)
\`\`\`

Lazy nói chung là tốt — bạn lấy danh sách khách để hiển thị tên thôi thì không việc gì phải kéo về hàng nghìn đơn. Nhưng đúng cái tính lười đó, khi bạn **lặp** và chạm vào quan hệ trong vòng lặp, biến thành N+1: mỗi lần chạm là một lần "à giờ mới cần, để tôi đi lấy".

Ngược lại là **eager** (háo hức): lấy luôn cùng lúc. Mặc định của JPA:

\`\`\`
6) mac dinh JPA: @ManyToOne EAGER, @OneToMany LAZY
\`\`\`

Đừng vội đổi hết sang \`EAGER\` để "tránh N+1" — làm vậy lại kéo về cả núi dữ liệu không dùng tới, và có khi tạo ra N+1 kiểu khác. Cách đúng là **giữ lazy, và dùng \`JOIN FETCH\` đúng chỗ bạn biết sẽ cần con**.

━━━━━━━━━━━━━━━━━━━━

🔍 LÀM SAO PHÁT HIỆN N+1?

May là nó rất dễ thấy nếu bạn chịu nhìn. Bật log SQL:

\`\`\`properties
spring.jpa.show-sql=true
\`\`\`

Rồi mở một trang và **đếm số câu SELECT trong log**. Thấy một câu lấy danh sách rồi hàng chục câu na ná nhau ngay sau đó — đó chính là N+1 đang diễn ra. Đây là bản dữ liệu của bài học "đo, đừng đoán" (Ngày 59): đừng suy luận trang nhanh hay chậm, cứ đếm câu SQL nó chạy.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo hai \`@Entity\` \`Khach\` và \`Don\` với \`@OneToMany\`/\`@ManyToOne\`.
2. Bật \`show-sql\`, lặp qua danh sách khách và gọi \`getDanhSachDon()\` — đếm số SELECT.
3. Viết một \`@Query\` \`JOIN FETCH\` và đếm lại — xác nhận còn 1 câu.
4. Đổi một quan hệ sang \`FetchType.EAGER\` và quan sát câu SQL đổi thế nào.
5. Với 50 bản ghi cha, so số truy vấn giữa cách N+1 và cách \`JOIN FETCH\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

\`@ManyToOne\`/\`@OneToMany\` biến khoá ngoại thành liên kết đối tượng, để bạn đi qua quan hệ bằng \`khach.getDanhSachDon()\` thay vì \`JOIN\` tay. Nhưng sự tiện đó ẩn một cái bẫy: lặp trên quan hệ lazy sinh ra **N+1 truy vấn** vô hình. Chữa bằng \`JOIN FETCH\` để gom về một câu, và phát hiện bằng cách bật \`show-sql\` rồi đếm — đúng tinh thần "đo, đừng đoán".

Đến đây API của bạn đọc và ghi được dữ liệu quan hệ. Nhưng nhớ Ngày 65 chứ: chuyển tiền là hai thao tác phải "cùng xong hoặc cùng huỷ". Với JDBC tay bạn tự \`setAutoCommit(false)\` + \`commit\`/\`rollback\`. Trong Spring, ai lo giao dịch? Và logic nghiệp vụ — "đơn quá 3 ngày chưa giao thì nhắc", "trừ tồn kho khi đặt hàng" — nên sống ở đâu, chứ không phải nhét hết vào controller?

Ngày 72: **Tầng service & @Transactional** — nơi đặt logic nghiệp vụ, và cách Spring biến giao dịch của Ngày 65 thành đúng **một dòng chú thích**. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
