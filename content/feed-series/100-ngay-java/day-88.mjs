/** "100 Ngày Java với CuongThai" — Ngày 88: Lượt xem & chống spam (Blog API).
    Nối đúng chỗ Ngày 87 kết ("người đọc thật: muốn ĐẾM bài nào xem nhiều, phải
    CHỐNG kẻ spam bình luận / dò mật khẩu; token bucket đứng sau rate limit").
    Ngày 89 (caching) trỏ ngược về phần kết.

    ⚠ LUẬT 1+6: token bucket dựng bằng JDK thuần, đồng hồ LOGIC (không now())
    nên tất định; thân bài dạy bucket4j/filter thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 88,
  card: 'java-day-88',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-circuit-breaker-for-service-resilience',
    title: 'Bộ ngắt mạch (circuit breaker) cho dịch vụ bền bỉ',
  },

  content: `👁️ 100 NGÀY JAVA — NGÀY 88: LƯỢT XEM & CHỐNG SPAM

Blog của bạn giờ có người đọc thật. "Người đọc thật" kéo theo hai vấn đề mới đối lập nhau: bạn muốn **đếm** xem bài nào được xem nhiều (để biết viết gì tiếp), và bạn phải **chống** kẻ xấu — spam bình luận hàng trăm lần một phút, dò mật khẩu liên tục.

Hôm nay giải cả hai. Và cái thứ hai — rate limiting — dựa trên một thuật toán đẹp mà bạn nên biết: **gàu rò** (token bucket).

━━━━━━━━━━━━━━━━━━━━

🪣 RATE LIMITING: THUẬT TOÁN GÀU RÒ

Bài toán: cho phép mỗi người gọi API với tốc độ hợp lý, nhưng chặn kẻ gọi dồn dập. Cách ngây thơ "tối đa N request mỗi phút" có nhược điểm: đúng ranh giới phút, người ta bắn 2N phát liền (N cuối phút này + N đầu phút sau).

Token bucket giải mượt hơn. Hình dung mỗi client có một **cái gàu** chứa token:

\`\`\`
1) gau ro suc chua 5, nap 1 token/giay
\`\`\`

- Gàu chứa tối đa 5 token, và **nhỏ giọt** thêm 1 token mỗi giây.
- Mỗi request lấy đi 1 token. Còn token → cho qua. Hết token → chặn.

Điểm hay: gàu đầy sẵn nên cho phép **bùng ngắn** (5 request liền lúc rảnh), nhưng về lâu dài tốc độ bị ghìm ở mức nạp (1/giây). Vừa thân thiện với người dùng thật (thi thoảng bấm nhanh), vừa chặn kẻ bắn liên tục.

━━━━━━━━━━━━━━━━━━━━

🚫 HẾT TOKEN → 429

\`\`\`
2) 5 request lien tiep (giay 0) -> qua 5/5 (dung het token)
3) request thu 6 (giay 0) -> 429 het token
\`\`\`

Năm request đầu tiêu hết token trong gàu → qua. Request thứ 6 ngay lập tức → gàu rỗng → trả **\`429 Too Many Requests\`**. Đây là mã HTTP dành riêng cho "bạn gọi quá nhanh, chờ chút".

Với endpoint \`/login\`, đặt gàu nhỏ (ví dụ 5 lần/phút mỗi IP) là chặn đứng kiểu tấn công dò mật khẩu — kẻ tấn công không thể thử hàng nghìn mật khẩu mỗi giây nữa (nhớ Ngày 77: mật khẩu yếu + thử nhanh là nguy hiểm; rate limit cắt vế "thử nhanh").

━━━━━━━━━━━━━━━━━━━━

⏳ GÀU TỰ NẠP LẠI

Rate limit không phải là khoá cứng — chờ một chút là lại dùng được:

\`\`\`
4) sau 3 giay -> nap 3 token -> 3 request qua
\`\`\`

Sau 3 giây, gàu nhỏ thêm 3 token, nên 3 request tiếp theo lại qua. Người dùng thật chỉ thấy "chậm lại một nhịp", còn kẻ bắn liên tục thì bị ghìm mãi. Chú ý một điểm khéo trong cài đặt: ta **không** chạy một luồng đếm giây để nạp; ta tính token dựa trên **thời gian đã trôi qua** kể từ lần xin trước — rẻ và chính xác.

━━━━━━━━━━━━━━━━━━━━

👁️ ĐẾM VIEW: ĐỪNG ĐẾM NGÂY THƠ

Sang vế thứ hai. Đếm lượt xem tưởng dễ — mỗi lần mở bài thì \`UPDATE bai_viet SET view = view + 1\`. Nhưng làm thế có hai vấn đề:

**Một, gian lận.** Cùng một người bấm F5 liên tục để thổi phồng view. Cách chặn: mỗi cặp (người, bài) chỉ tính **một** view trong một cửa sổ thời gian:

\`\`\`
5) 4 luot xem (an xem b1 3 lan) -> dem 2 view (moi user-bai tinh 1)
\`\`\`

An xem bài b1 ba lần vẫn chỉ tính một view; cộng Bình một view nữa là hai. Thực tế lưu dấu "(user, bài) đã xem" trong Redis với thời hạn (ví dụ 1 giờ) để tự quên.

**Hai, hiệu năng.** Ghi CSDL ở *mỗi* lượt xem biến một bài viral thành hàng nghìn câu \`UPDATE\`/giây — một dòng đếm view lại làm nghẽn CSDL. Cách đúng: **gom lại** (buffer trong bộ nhớ/Redis) rồi cập nhật CSDL theo lô mỗi vài giây/phút. Đếm view không đáng để làm chậm mọi request.

━━━━━━━━━━━━━━━━━━━━

✅ TRONG SPRING: ĐẶT Ở TẦNG GÁC

Rate limit không nên rải vào từng controller — nó là mối quan tâm cắt ngang, đặt ở **tầng gác** (một filter, Ngày 79) hoặc ở API gateway trước ứng dụng:

\`\`\`java
// Ý tưởng: một filter đứng trước, kiểm gàu theo IP/người dùng
if (!bucket.tryConsume(1)) {
    response.setStatus(429);
    return;   // chặn, không vào controller
}
\`\`\`

Ở thật, đừng tự viết — dùng thư viện **bucket4j** (chính là token bucket, có sẵn), và lưu trạng thái gàu trong **Redis** để nhiều máy chủ dùng chung một giới hạn (nhớ Ngày 78: nhiều máy chủ thì trạng thái phải nằm ngoài). Redis nhanh và hết hạn tự động, hợp cả với việc lưu dấu view.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Cài một token bucket đơn giản (sức chứa, tốc độ nạp), thử bùng rồi chờ nạp.
2. Trả \`429\` khi hết token, thêm header \`Retry-After\`.
3. Đặt rate limit chặt cho \`/login\` (ví dụ 5 lần/phút mỗi IP).
4. Đếm view có chống trùng bằng một \`Set\`/Redis có thời hạn.
5. Gom view trong bộ nhớ, cập nhật CSDL theo lô thay vì mỗi request.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

**Rate limiting** bằng token bucket (gàu rò): gàu chứa token, mỗi request tiêu một, gàu nạp lại theo thời gian — cho phép bùng ngắn nhưng ghìm tốc độ trung bình, hết token thì trả \`429\`. Đặt nó ở tầng gác, dùng bucket4j + Redis cho thật. **Đếm view** thì chống trùng (mỗi user-bài một view/cửa sổ) và gom theo lô thay vì ghi CSDL mỗi lần — để việc đếm không làm chậm việc chính.

Nói tới "làm chậm việc chính": mỗi lần mở trang chủ blog, bạn đang chạy lại đúng những truy vấn nặng — lấy danh sách bài mới nhất, đếm bình luận, tải thẻ — dù nội dung gần như không đổi giữa hai lần mở cách nhau một giây. Tính đi tính lại cùng một thứ là lãng phí.

Ngày 89: **Caching** — nhớ kết quả của việc nặng để lần sau khỏi tính lại; cache trong bộ nhớ với \`@Cacheable\` của Spring, cache chia sẻ bằng Redis, và câu hỏi khó nhất của caching mà ai cũng phải trả lời: **khi nào thì xoá cache** (để không phục vụ dữ liệu cũ). Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
