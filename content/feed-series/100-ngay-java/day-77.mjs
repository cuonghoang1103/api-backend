/** "100 Ngày Java với CuongThai" — Ngày 77: Bảo mật & băm mật khẩu. MỞ GIAI ĐOẠN 10.
    Nối đúng chỗ Ngày 76 kết ("API ai gọi cũng được — chưa có đăng nhập, chưa
    có 'bạn là ai', chưa có 'bạn được phép làm gì'").
    Ngày 78 (JWT) trỏ ngược về phần kết.

    ⚠ LUẬT 5+6: BCrypt salt ngẫu nhiên → hash đổi mỗi lần chạy, không in lên thẻ
    được. Thẻ dựng nguyên lý (một chiều + salt + verify) bằng SHA-256 salt cố
    định để output ổn định; thân bài dạy BCrypt/PasswordEncoder thật. Output là
    kết quả THẬT của javac/java JDK 21. */
export default {
  day: 77,
  card: 'java-day-77',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-secure-api-credential-management-with-vault',
    title: 'Quản lý bí mật/credential an toàn',
  },

  content: `🔐 100 NGÀY JAVA — NGÀY 77: BẢO MẬT & MẬT KHẨU — MỞ GIAI ĐOẠN 10

Ngày 76 khép lại một backend CRUD hoàn chỉnh. Nhưng nó có một lỗ hổng chết người: **ai gọi cũng được**. Bất kỳ ai biết địa chỉ đều tạo, sửa, xoá đơn hàng của người khác. Chưa có đăng nhập, chưa có "bạn là ai", chưa có "bạn được phép làm gì".

Giai đoạn 10 — chặng cuối — biến bộ khung đó thành một sản phẩm thật. Và mọi sản phẩm thật bắt đầu từ bảo mật. Hôm nay là viên gạch đầu tiên, cũng là chỗ nhiều lập trình viên phạm sai lầm nghiêm trọng nhất trong đời: **lưu mật khẩu**.

━━━━━━━━━━━━━━━━━━━━

🪪 HAI CÂU HỎI KHÁC NHAU: XÁC THỰC & PHÂN QUYỀN

Trước khi code, phải tách rõ hai khái niệm người mới hay lẫn:

- **Xác thực (Authentication)** — *bạn là ai?* Đây là màn đăng nhập: chứng minh bạn đúng là người bạn nói.
- **Phân quyền (Authorization)** — *bạn được làm gì?* Sau khi biết bạn là ai, hệ thống quyết định bạn được xem/sửa/xoá cái gì.

Thứ tự luôn là: xác thực trước, phân quyền sau. Một admin và một khách vãng lai đều *đã đăng nhập* (xác thực xong), nhưng chỉ admin được xoá người dùng (phân quyền khác nhau). Cả Giai đoạn 10 xoay quanh hai câu hỏi này.

Hôm nay ta lo phần nền của xác thực: **mật khẩu**.

━━━━━━━━━━━━━━━━━━━━

🚫 SAI LẦM CHẾT NGƯỜI: LƯU MẬT KHẨU NGUYÊN BẢN

Bản năng đầu tiên là lưu mật khẩu vào cột \`password\` để lúc đăng nhập đem so. Đừng. Bao giờ.

\`\`\`
1) luu plaintext '123456' -> ai doc duoc DB la thay mat khau that (NGUY HIEM)
\`\`\`

Vì sao thảm hoạ? Ngày nào đó DB của bạn bị rò — do SQL injection (Ngày 63), do sao lưu thất lạc, do một nhân viên tò mò. Nếu mật khẩu nằm nguyên bản, **mọi tài khoản lộ ngay lập tức**. Tệ hơn: người ta hay dùng chung một mật khẩu cho nhiều nơi, nên bạn vừa làm lộ cả email, ngân hàng của họ.

Bạn **không được phép** biết mật khẩu người dùng. Kể cả bạn là người viết hệ thống.

━━━━━━━━━━━━━━━━━━━━

🔐 GIẢI PHÁP: BĂM MỘT CHIỀU

Thay vì lưu mật khẩu, lưu một **hash** — dấu vết một chiều của nó:

\`\`\`
2) bam mot chieu (SHA-256, salt='u_an') -> luu 2418b74a6f2d
\`\`\`

"Một chiều" nghĩa là: từ mật khẩu tính ra hash thì dễ, nhưng từ hash **không có cách nào** tính ngược lại ra mật khẩu. Không có hàm giải mã. DB chỉ giữ cái hash, không giữ mật khẩu.

Vậy lúc đăng nhập kiểm thế nào nếu không giải ngược được? **Băm lại rồi so:**

\`\`\`
3) verify: nhap dung '123456' -> true; nhap sai 'abc' -> false
\`\`\`

Người dùng gõ mật khẩu → hệ thống băm cái vừa gõ → so với hash đã lưu. Khớp thì đúng người. Cả quá trình **không bao giờ cần biết mật khẩu gốc là gì** — kể cả hệ thống cũng không biết.

━━━━━━━━━━━━━━━━━━━━

🧂 SALT: VÌ SAO HAI NGƯỜI CÙNG MẬT KHẨU LẠI KHÁC HASH

Băm một chiều thôi vẫn chưa đủ. Kẻ tấn công có thể chuẩn bị sẵn một **bảng tra** khổng lồ: băm trước hàng tỉ mật khẩu phổ biến, rồi dò ngược hash trong DB rò ra (gọi là *rainbow table*). Nếu hai người cùng dùng "123456" và có cùng hash, phá một là phá cả hai.

Cách chống: thêm **salt** — một chuỗi ngẫu nhiên riêng cho mỗi người, trộn vào trước khi băm:

\`\`\`
4) an & binh CUNG mat khau '123456' -> hash khac nhau? true
\`\`\`

Cùng mật khẩu "123456", nhưng An và Bình có salt khác nhau nên hash lưu khác hẳn. Bảng tra sẵn thành vô dụng — kẻ tấn công phải phá lại từ đầu cho *từng* người.

Và hash có tính "tuyết lở": đổi đúng một ký tự, cả hash đổi hoàn toàn:

\`\`\`
5) doi 1 ky tu '123456'->'123457' -> hash doi hoan toan? true
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⏱️ VÌ SAO KHÔNG DÙNG SHA, MÀ DÙNG BCRYPT

Đây là chỗ tinh tế nhất, và là lý do **thẻ hôm nay chỉ minh hoạ nguyên lý, không phải cách làm thật**. Thẻ dùng SHA-256 để bạn thấy được output ổn định — nhưng SHA **quá nhanh** để băm mật khẩu.

Vì hash một chiều, cách phá duy nhất là đoán-rồi-thử:

\`\`\`
6) mot chieu: chi THU tung cai moi ra '123456' (khong dao nguoc truc tiep)
\`\`\`

Đúng — không đảo ngược được, nhưng vẫn *thử từng cái* được. Với SHA nhanh, một máy thử **hàng tỉ mật khẩu mỗi giây**. Mật khẩu yếu như "123456" phá trong tích tắc.

Giải pháp là hàm băm **cố tình chậm**: BCrypt, Argon2, scrypt. Chúng được thiết kế để mỗi lần băm mất một phần nghìn giây — không đáng kể khi một người đăng nhập, nhưng biến "hàng tỉ lần thử mỗi giây" thành "vài nghìn", đủ để tấn công đoán trở nên bất khả thi. BCrypt còn tự sinh salt ngẫu nhiên và nhét vào chính chuỗi hash.

━━━━━━━━━━━━━━━━━━━━

✅ TRONG SPRING: ĐỪNG TỰ VIẾT, DÙNG PasswordEncoder

Quy tắc vàng của mật mã: **đừng tự viết**. Spring Security cho sẵn:

\`\`\`java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();   // salt ngẫu nhiên, chậm có chủ đích
}

// Lúc đăng ký:
String hash = passwordEncoder.encode(matKhauThô);   // lưu hash này
// Lúc đăng nhập:
boolean dung = passwordEncoder.matches(matKhauThô, hashDaLuu);
\`\`\`

\`encode\` băm (tự thêm salt), \`matches\` băm lại rồi so — đúng nguyên lý ở trên, nhưng dùng BCrypt và đã được kiểm nghiệm hàng chục năm. Bạn thêm \`spring-boot-starter-security\` (một dòng starter, Ngày 67) là có.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thử băm một chuỗi bằng \`MessageDigest\` SHA-256, đổi một ký tự xem hash đổi thế nào.
2. Thêm \`BCryptPasswordEncoder\`, \`encode\` cùng một mật khẩu hai lần — xem hai hash khác nhau (salt ngẫu nhiên).
3. Dùng \`matches\` để xác thực, thử cả mật khẩu đúng và sai.
4. Đọc một hash BCrypt thật, nhận ra phần salt nằm ngay trong chuỗi.
5. Tự hỏi: hệ thống bạn từng dùng có bao giờ *gửi lại mật khẩu cũ* cho bạn qua email không? Nếu có, đó là dấu hiệu họ lưu nguyên bản — rất xấu.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bảo mật tách làm hai: **xác thực** (bạn là ai) và **phân quyền** (được làm gì). Viên gạch đầu là mật khẩu, và luật tuyệt đối là: **không bao giờ lưu mật khẩu nguyên bản** — chỉ lưu hash một chiều, có salt riêng mỗi người, băm bằng hàm chậm (BCrypt) qua \`PasswordEncoder\` của Spring, không tự viết. Đăng nhập là băm-lại-rồi-so, hệ thống không bao giờ biết mật khẩu gốc.

Nhưng giải quyết xong "chứng minh bạn là ai" mới là một nửa. HTTP vốn **không nhớ gì cả** — mỗi request là một người lạ. Chẳng lẽ bắt người dùng gõ mật khẩu lại ở *mỗi* lần bấm? Sau khi đăng nhập một lần, làm sao các request sau biết "à, vẫn là người này"?

Ngày 78: **JWT (JSON Web Token)** — tấm vé đăng nhập mà máy chủ phát ra sau khi bạn chứng minh danh tính, để mọi request sau chỉ cần chìa vé thay vì gõ lại mật khẩu; nó gồm những gì, được **ký** thế nào để không giả mạo được, và vì sao nó hợp với API không nhớ trạng thái. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
