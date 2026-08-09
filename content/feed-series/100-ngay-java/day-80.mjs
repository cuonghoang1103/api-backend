/** "100 Ngày Java với CuongThai" — Ngày 80: Phân quyền chi tiết.
    Nối đúng chỗ Ngày 79 kết ("phân quyền thô theo khu vực; thực tế: user sửa
    đơn CỦA MÌNH nhưng không sửa đơn người khác — quyền theo vai + sở hữu").
    Ngày 81 (khép cụm bảo mật: luồng đăng nhập → JWT → API) trỏ ngược về kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng nguyên lý quyền theo vai
    + sở hữu + @PreAuthorize chặn trước; thân bài dạy @PreAuthorize/hasRole thật.
    Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 80,
  card: 'java-day-80',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-runtime-validation-framework-with-custom-annotations',
    title: 'Khung kiểm tra bằng annotation (nền cho @PreAuthorize)',
  },

  content: `🔑 100 NGÀY JAVA — NGÀY 80: PHÂN QUYỀN CHI TIẾT

Ngày 79 phân quyền còn thô: cả khu \`/admin\` cần vai ADMIN. Nhưng thực tế tinh vi hơn nhiều.

Một user được sửa *đơn của chính mình* nhưng không được sửa đơn người khác. Một biên tập viên xoá được bài nhưng không xoá được tài khoản. Quyền không chỉ theo *khu vực*, mà theo *vai trò* và cả *quan hệ sở hữu*.

Hôm nay lo phần chi tiết đó — và một trong những lỗ hổng phổ biến nhất trên web nằm ngay đây.

━━━━━━━━━━━━━━━━━━━━

👥 TẦNG MỘT: QUYỀN THEO VAI (ROLE)

Vai trò là cách phân quyền quen thuộc nhất: gán mỗi người một hoặc vài vai, và luật gắn theo vai.

\`\`\`
1) ADMIN xoa tai khoan -> cho phep
2) USER xoa tai khoan -> 403 (chi ADMIN)
\`\`\`

Đây là bài Ngày 79: cùng một hành động "xoá tài khoản", ADMIN được, USER không. Trong Spring, phần lớn quyền cấp-khu-vực khai được bằng vai: \`hasRole("ADMIN")\`.

Phân biệt nhỏ đáng biết: Spring có cả **role** (vai, ví dụ \`ADMIN\`) và **authority** (quyền chi tiết, ví dụ \`don:xoa\`). Role thực ra chỉ là một authority có tiền tố \`ROLE_\`. Vai gom nhóm nhiều quyền cho gọn; quyền chi tiết dùng khi cần mịn hơn.

━━━━━━━━━━━━━━━━━━━━

🔑 TẦNG HAI: QUYỀN THEO SỞ HỮU

Đây là chỗ vai trò một mình *không đủ*. Hai người dùng **cùng vai USER**, nhưng:

\`\`\`
3) USER 'an' sua don CUA MINH (DH-1) -> da sua DH-1
4) USER 'an' sua don cua 'binh' (DH-2) -> 403 thieu quyen
\`\`\`

An sửa được đơn của mình, nhưng sửa đơn của Bình thì bị chặn — dù cả hai đều là USER. Quyền ở đây phụ thuộc **quan hệ sở hữu**: đơn này có phải của bạn không?

Đây là lỗ hổng kinh điển tên **IDOR** (Insecure Direct Object Reference): lập trình viên kiểm "đã đăng nhập chưa" nhưng **quên kiểm "đây có phải đồ của bạn không"**. Kết quả: ai đăng nhập rồi đều đổi \`/don/DH-2\` thành \`/don/DH-9\` trên URL để xem/sửa đơn người khác. Rất nhiều vụ rò dữ liệu lớn chỉ vì thiếu đúng một dòng kiểm sở hữu.

Bài học sống còn: **đừng bao giờ tin cái id tài nguyên client gửi lên**. Luôn kiểm tài nguyên đó có thuộc về người đang đăng nhập không (Ngày 69: đừng tin client).

━━━━━━━━━━━━━━━━━━━━

👑 ADMIN VƯỢT SỞ HỮU — NHƯNG PHẢI KHAI RÕ

\`\`\`
5) ADMIN sua don cua 'binh' (DH-2) -> da sua DH-2
\`\`\`

ADMIN sửa được đơn của bất kỳ ai — vai cao thắng luật sở hữu. Nhưng chú ý: điều này phải được **khai rõ trong luật**, không tự nhiên mà có. Luật đầy đủ là "được sửa NẾU là admin HOẶC là chủ sở hữu".

━━━━━━━━━━━━━━━━━━━━

🚧 @PreAuthorize: GẮN LUẬT NGAY TRÊN PHƯƠNG THỨC

Thay vì nhét \`if (choPhep(...))\` vào đầu mỗi phương thức service, Spring cho khai luật quyền ngay trên phương thức bằng chú thích:

\`\`\`java
@PreAuthorize("hasRole('ADMIN') or #don.chuSoHuu == authentication.name")
public Don suaDon(Don don) {
    // thân hàm CHỈ chạy nếu luật ở trên đúng
}
\`\`\`

Đọc biểu thức: cho phép nếu là ADMIN **hoặc** chủ sở hữu đơn trùng tên người đang đăng nhập. \`#don\` trỏ tham số, \`authentication.name\` là người đang đăng nhập (do bộ lọc JWT gắn vào, Ngày 79).

Điểm mấu chốt — chữ **"Pre"**: luật chạy **trước** thân hàm. Không đủ quyền thì thân hàm *không bao giờ chạy*:

\`\`\`
6) @PreAuthorize: 3 lan goi -> than ham chay 2 (1 lan chan TRUOC khi chay)
\`\`\`

Gọi \`suaDon\` ba lần, một lần bị chặn — và thân hàm chỉ chạy hai lần. Việc "chặn trước" này quan trọng: nó đảm bảo không có tác dụng phụ (ghi DB, gửi mail) nào xảy ra rồi mới phát hiện thiếu quyền.

(Bật bằng \`@EnableMethodSecurity\`. Có cả \`@PostAuthorize\` kiểm *sau* khi chạy — dùng khi phải lấy dữ liệu ra mới biết có được xem không.)

━━━━━━━━━━━━━━━━━━━━

🧭 KIỂM Ở ĐÂU: TẦNG NÀO?

Một câu hỏi hay: phân quyền nên nằm ở filter chain (Ngày 79) hay ở \`@PreAuthorize\` trên service?

- **Quyền cấp-khu-vực thô** (cả \`/admin/**\` cần ADMIN) → khai ở \`SecurityFilterChain\`, chặn sớm từ vòng ngoài.
- **Quyền phụ thuộc dữ liệu** (có phải chủ sở hữu không) → \`@PreAuthorize\` ở tầng service, vì lúc đó mới biết tài nguyên là của ai.

Hai tầng bổ sung nhau, không loại trừ. Nguyên tắc bao trùm: **phòng thủ nhiều lớp** — chặn thô ở ngoài, kiểm mịn ở trong.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Bật \`@EnableMethodSecurity\`, thêm \`@PreAuthorize("hasRole('ADMIN')")\` cho một phương thức.
2. Viết luật sở hữu: \`hasRole('ADMIN') or #id == authentication.name\`.
3. Tự dựng một endpoint \`/don/{ma}\` và cố tình quên kiểm sở hữu — thấy IDOR.
4. Thêm lại kiểm sở hữu, xác nhận user không sửa được đơn người khác.
5. Thử \`@PostAuthorize\` cho trường hợp phải lấy dữ liệu ra mới biết chủ là ai.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Phân quyền chi tiết là hai tầng: theo **vai** (ADMIN được xoá tài khoản) và theo **sở hữu** (chỉ sửa đồ của chính mình — quên kiểm là dính IDOR, một trong những lỗ hổng web phổ biến nhất). \`@PreAuthorize\` gắn luật ngay trên phương thức và chặn *trước* khi thân hàm chạy, kết hợp với filter chain thô ở vòng ngoài thành phòng thủ nhiều lớp. Và luôn nhớ: đừng tin id tài nguyên client gửi.

Bốn ngày qua ta có đủ mọi mảnh bảo mật: mật khẩu băm (77), JWT (78), filter chain (79), phân quyền (80). Nhưng chúng vẫn nằm rời. Một người dùng thật đi từ màn đăng nhập tới lúc gọi được một API riêng tư — trọn vẹn — trông ra sao?

Ngày 81: **Khép cụm bảo mật** — ghép cả bốn ngày thành một luồng hoàn chỉnh: đăng ký (băm mật khẩu) → đăng nhập (verify → phát JWT) → gọi API kèm token (filter xác thực) → thao tác đúng quyền (phân quyền). Một hành trình đăng nhập đầu-cuối, chạy được. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
