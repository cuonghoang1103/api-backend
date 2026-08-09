/** "100 Ngày Java với CuongThai" — Ngày 81: Khép cụm bảo mật (luồng đăng nhập).
    Nối đúng chỗ Ngày 80 kết ("bốn mảnh bảo mật rời — một người dùng đi từ đăng
    nhập tới gọi API riêng tư trọn vẹn trông ra sao?").
    Ngày 82 (mở dự án cuối) trỏ ngược về phần kết.

    ⚠ LUẬT 5+6: ghép cả bốn ngày bảo mật vào một luồng đầu-cuối chạy JDK thuần;
    SHA-256 + HMAC secret cố định nên tái lập. Thân bài dạy Spring Security thật.
    Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 81,
  card: 'java-day-81',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-secure-audit-logger-with-pii-masking',
    title: 'Bộ ghi nhật ký an toàn che dữ liệu nhạy cảm',
  },

  content: `🔐 100 NGÀY JAVA — NGÀY 81: KHÉP CỤM BẢO MẬT

Bốn ngày qua ta có đủ mọi mảnh: mật khẩu băm (77), JWT (78), filter chain (79), phân quyền (80). Nhưng chúng vẫn nằm rời.

Một người dùng thật đi từ màn đăng nhập tới lúc gọi được một API riêng tư — trọn vẹn — trông ra sao? Hôm nay ghép cả bốn thành một luồng chạy được, và bạn sẽ thấy chúng khít vào nhau như thế nào.

━━━━━━━━━━━━━━━━━━━━

🗺️ TOÀN CẢNH: MỘT HÀNH TRÌNH ĐĂNG NHẬP

\`\`\`
Đăng ký  → băm mật khẩu, lưu hash                (77)
Đăng nhập → verify hash → phát JWT đã ký          (78)
Mỗi request → filter đọc & xác thực JWT           (79)
Thao tác  → kiểm quyền theo vai + sở hữu          (80)
\`\`\`

Bốn bước, bốn ngày. Giờ đi qua từng bước, quan sát dữ liệu chảy.

━━━━━━━━━━━━━━━━━━━━

🔑 BƯỚC 1: ĐĂNG KÝ — LƯU HASH, KHÔNG LƯU MẬT KHẨU

\`\`\`
1) dang ky 'an' -> luu hash f29500adbfbd (khong luu mat khau)
\`\`\`

Khi An đăng ký, hệ thống băm mật khẩu một chiều rồi lưu **hash**, không bao giờ lưu mật khẩu gốc (Ngày 77). DB có rò thì kẻ tấn công cũng chỉ thấy hash. Trong Spring: \`passwordEncoder.encode(matKhau)\`.

━━━━━━━━━━━━━━━━━━━━

🎫 BƯỚC 2: ĐĂNG NHẬP — VERIFY RỒI PHÁT VÉ

\`\`\`
2) dang nhap sai mat khau -> tu choi, khong phat token
3) dang nhap dung -> phat JWT dai 73 ky tu
\`\`\`

Người dùng gõ mật khẩu → hệ thống băm lại cái vừa gõ, so với hash đã lưu (\`passwordEncoder.matches\`). Sai thì từ chối, **không phát token**. Đúng thì phát một JWT đã ký (Ngày 78), trong payload có danh tính và vai.

Đây là điểm nối 77 → 78: verify mật khẩu là *điều kiện* để phát vé. Sau bước này, người dùng cầm tấm vé và không cần mật khẩu nữa.

\`\`\`java
@PostMapping("/login")
public Map<String,String> dangNhap(@RequestBody LoginRequest req) {
    User u = userRepo.findByUsername(req.username())
        .orElseThrow(() -> new BadCredentialsException("sai thông tin"));
    if (!passwordEncoder.matches(req.password(), u.getPasswordHash()))
        throw new BadCredentialsException("sai thông tin");   // đừng nói rõ sai gì
    return Map.of("token", jwtService.phat(u));
}
\`\`\`

Một chi tiết bảo mật: khi đăng nhập sai, **đừng nói rõ "sai mật khẩu" hay "không có user này"** — cả hai đều trả cùng một thông báo mơ hồ, để kẻ tấn công không dò được username nào tồn tại.

━━━━━━━━━━━━━━━━━━━━

🛡️ BƯỚC 3: MỖI REQUEST — FILTER XÁC THỰC VÉ

\`\`\`
4) goi API khong token -> 401 chua dang nhap
\`\`\`

Từ đây, mọi request An gửi đều kèm token trong header \`Authorization: Bearer\`. Filter chain (Ngày 79) đứng trước controller: đọc token, xác minh chữ ký HMAC, và nếu hợp lệ thì gắn danh tính vào ngữ cảnh. Không token hoặc chữ ký sai → **401**, dừng ngay ở vòng ngoài.

Điểm nối 78 → 79: token do bước đăng nhập phát ra chính là thứ filter kiểm ở mỗi request. Máy chủ không lưu phiên — nó chỉ tính lại chữ ký (stateless).

━━━━━━━━━━━━━━━━━━━━

⛔ BƯỚC 4: THAO TÁC — ĐÚNG VAI, ĐÚNG SỞ HỮU

\`\`\`
5) token USER 'an' suaDon cua 'an' -> 200 suaDon OK
6) token USER 'an' xoaTaiKhoan (can ADMIN) -> 403 thieu quyen
\`\`\`

Qua được filter (đã xác thực), giờ tới phân quyền (Ngày 80). An sửa **đơn của chính mình** → cho phép (chủ sở hữu). Nhưng An là USER, đòi xoá tài khoản — việc chỉ ADMIN được → **403**.

Điểm nối 79 → 80: danh tính mà filter gắn vào (An, vai USER) chính là thứ bước phân quyền dùng để quyết định. Không có bước 3 thì bước 4 không biết "ai đang hỏi".

━━━━━━━━━━━━━━━━━━━━

🧩 BỐN MẢNH, MỘT DÂY CHUYỀN

Nhìn lại, mỗi ngày là một mắt xích, và chúng chỉ có nghĩa khi nối nhau:

- Băm mật khẩu (77) làm cho **đăng nhập** an toàn.
- Đăng nhập phát **JWT** (78) để khỏi gõ mật khẩu lại.
- JWT được **filter** (79) kiểm ở mỗi request.
- Filter gắn danh tính cho **phân quyền** (80) quyết định.

Đây là bộ khung xác thực/phân quyền của gần như mọi ứng dụng web có người dùng. Hiểu trọn dây chuyền này, bạn đọc được code bảo mật của bất kỳ dự án Spring nào.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀI ĐIỀU CHO PRODUCTION THẬT

Bản mô phỏng hôm nay đủ để hiểu nguyên lý. Ở thật, thêm mấy lớp nữa:

- **Refresh token** — token chính hạn ngắn (15 phút), refresh token hạn dài để lấy token mới mà không đăng nhập lại.
- **HTTPS bắt buộc** — token bay trong header, không có HTTPS là ai trên đường truyền cũng đọc được.
- **Giới hạn số lần đăng nhập sai** (rate limit) — chống dò mật khẩu.
- **Đừng log token / mật khẩu** — nhớ bài Ngày 58 (che dữ liệu nhạy cảm trong log).

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Dựng endpoint \`/register\` băm mật khẩu bằng \`BCryptPasswordEncoder\`.
2. Dựng \`/login\` verify rồi phát JWT; trả cùng thông báo mơ hồ khi sai.
3. Viết filter đọc \`Authorization: Bearer\`, verify JWT, gắn \`Authentication\`.
4. Gọi một API riêng tư: không token (401), có token (200).
5. Thêm \`@PreAuthorize\` sở hữu, thử sửa đồ của người khác (403).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — CỤM BẢO MẬT HOÀN CHỈNH

Một luồng đăng nhập trọn vẹn là bốn mắt xích nối nhau: **băm mật khẩu** khi đăng ký → **verify + phát JWT** khi đăng nhập → **filter xác thực** ở mỗi request → **phân quyền** theo vai và sở hữu khi thao tác. Bỏ mắt nào cũng đứt: không băm thì lộ mật khẩu, không JWT thì phải đăng nhập lại mỗi lần, không filter thì ai cũng vào, không phân quyền thì ai cũng làm mọi thứ.

Đến đây bạn đã đi hết chặng học *kỹ thuật*: từ \`Hello World\` (Ngày 1) tới một backend Spring Boot có CSDL, có bảo mật đầy đủ. Chín mươi phần trăm kiến thức để đi làm nằm ở phía sau bạn rồi.

Nhưng biết từng mảnh và **dựng được một sản phẩm hoàn chỉnh từ số 0** là hai chuyện khác nhau. Mười chín ngày cuối, ta không học khái niệm mới nữa — ta *xây*. Một ứng dụng thật, trọn vẹn, từ trang giấy trắng tới lúc chạy trên máy chủ.

Ngày 82: **Mở dự án cuối** — chọn đề bài, phác kiến trúc, dựng khung dự án, và viên gạch đầu tiên. Ta sẽ đi đúng quy trình một kỹ sư thật làm khi nhận một dự án mới. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
