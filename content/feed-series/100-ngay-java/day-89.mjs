/** "100 Ngày Java với CuongThai" — Ngày 89: Caching (Blog API).
    Nối đúng chỗ Ngày 88 kết ("mỗi lần mở trang chủ chạy lại truy vấn nặng dù
    nội dung gần như không đổi — tính đi tính lại là lãng phí").
    Ngày 90 (xử lý nền: @Async/@Scheduled) trỏ ngược về phần kết.

    ⚠ LUẬT 1+6: cache dựng bằng JDK thuần, đồng hồ LOGIC (không now()) nên tất
    định, đếm số lần tính thật; thân bài dạy @Cacheable/Redis thật. Output là
    kết quả THẬT của javac/java JDK 21. */
export default {
  day: 89,
  card: 'java-day-89',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-memory-efficient-generic-object-pool',
    title: 'Bể đối tượng tiết kiệm bộ nhớ (tái dùng, họ hàng caching)',
  },

  content: `⚡ 100 NGÀY JAVA — NGÀY 89: CACHING

Mỗi lần ai đó mở trang chủ blog, bạn chạy lại đúng những truy vấn nặng: lấy danh sách bài mới nhất, đếm bình luận, tải thẻ. Dù nội dung gần như **không đổi** giữa hai lần mở cách nhau một giây.

Tính đi tính lại cùng một thứ là lãng phí. Caching là nghệ thuật **nhớ kết quả** để lần sau khỏi tính lại. Nghe đơn giản — nhưng nó đi kèm câu hỏi khó nhất trong lập trình web, để ở cuối bài.

━━━━━━━━━━━━━━━━━━━━

⚡ HIT vs MISS: NHỚ ĐỂ KHỎI TÍNH

Ý tưởng cốt lõi: lần đầu tính thì lưu kết quả lại; lần sau có sẵn thì lấy luôn.

\`\`\`
1) goi 'bai-hot' 100 lan (con han) -> tinh that 1 lan (99 lan cache HIT)
2) tiet kiem: 100 lan doc nhung chi 1 lan chay viec nang
\`\`\`

- Lần đầu: **cache MISS** — chưa có, phải tính thật, rồi lưu vào cache.
- 99 lần sau: **cache HIT** — lấy thẳng từ cache, không tính lại.

Một bài viral được xem 100 lần/giây mà chỉ chạy truy vấn nặng **một** lần thay vì 100 lần — đó là khác biệt giữa CSDL thở phào và CSDL sập. Cache thường là bước tăng tốc rẻ nhất và hiệu quả nhất.

━━━━━━━━━━━━━━━━━━━━

🌱 TRONG SPRING: @Cacheable

Bạn không tự quản cache. Spring cho khai bằng chú thích:

\`\`\`java
@Cacheable("demBinhLuan")
public int demBinhLuan(String slug) {
    return khoBinhLuan.countByBaiSlug(slug);   // việc nặng, chỉ chạy khi MISS
}
\`\`\`

Lần đầu gọi với \`slug = "hoc-java"\`, Spring chạy hàm rồi nhớ kết quả theo *tham số*. Lần sau cùng \`slug\` đó, nó trả cache, hàm **không chạy**. Đúng cơ chế HIT/MISS ở trên, gói trong một chú thích.

Cache lưu **theo khoá** (thường là tham số): \`slug\` khác nhau vào ô cache khác nhau.

\`\`\`
5) cache dung theo KHOA: khoa khac nhau -> o cache khac nhau
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔴 CÂU HỎI KHÓ NHẤT: KHI NÀO XOÁ CACHE?

Có một câu nói nổi tiếng trong ngành: *"Chỉ có hai việc khó trong khoa học máy tính: vô hiệu hoá cache và đặt tên biến."* Đây là vế thứ nhất.

Cache nhanh vì nó **không tính lại**. Nhưng nếu dữ liệu gốc đổi mà cache không đổi theo, bạn phục vụ **dữ liệu cũ**:

\`\`\`
3) sua bai -> XOA cache -> goi lai tinh lai? true (tong tinh that 2)
6) kho nhat: XOA cache dung luc — quen xoa -> phuc vu du lieu CU
\`\`\`

Tình huống: một bình luận mới được thêm, nhưng cache "đếm bình luận" vẫn giữ số cũ → người dùng thấy sai số. Cách chữa: **khi dữ liệu đổi thì xoá ô cache tương ứng** (gọi là *invalidate*). Spring có \`@CacheEvict\`:

\`\`\`java
@CacheEvict(value = "demBinhLuan", key = "#slug")
public void themBinhLuan(String slug, BinhLuan bl) { ... }   // thêm xong -> xoá cache đếm
\`\`\`

Đây là phần khó vì nó đòi bạn **nhớ mọi chỗ có thể làm dữ liệu đổi**. Sót một chỗ ghi mà quên xoá cache là một bug rất khó tìm: dữ liệu lúc đúng lúc sai tuỳ vào cache còn hay hết.

━━━━━━━━━━━━━━━━━━━━

⏳ TTL: TỰ QUÊN ĐỂ ĐỠ SAI

Vì xoá cache thủ công dễ sót, có một lưới an toàn: đặt **thời hạn sống** (TTL) cho mỗi ô cache. Hết hạn thì cache tự quên, lần sau tính lại — nên dữ liệu cũ nhất cũng chỉ cũ trong khoảng TTL.

\`\`\`
4) TTL=10, goi luc 0/5/20 -> tinh that 2 lan (luc 5 HIT, luc 20 het han)
\`\`\`

Gọi lúc 0 (miss, tính), lúc 5 (còn hạn, hit), lúc 20 (quá hạn 10, tính lại). TTL là sự đánh đổi:
- **TTL ngắn** → dữ liệu tươi hơn, nhưng ít hit hơn (đỡ tăng tốc).
- **TTL dài** → nhanh hơn, nhưng dữ liệu có thể cũ lâu hơn.

Chọn TTL theo mức "cũ tới đâu thì chấp nhận được": số lượt xem cũ vài phút thì sao cũng được (TTL dài); số dư tài khoản thì tuyệt đối không cache kiểu này.

━━━━━━━━━━━━━━━━━━━━

☁️ CACHE Ở ĐÂU: BỘ NHỚ HAY REDIS?

- **Cache trong bộ nhớ** (mặc định, ví dụ Caffeine) — cực nhanh, nhưng mỗi máy chủ một cache riêng, và mất khi khởi động lại.
- **Redis** — cache **chung** cho nhiều máy chủ (nhớ Ngày 78: nhiều máy thì trạng thái phải ở ngoài), sống sót qua khởi động lại, tự hết hạn theo TTL.

Blog nhỏ một máy thì cache bộ nhớ là đủ. Hệ thống nhiều máy chủ thì Redis — và tiện thể, Redis đã lo luôn rate limit (Ngày 88) và dấu view rồi.

━━━━━━━━━━━━━━━━━━━━

⚠️ CHỈ CACHE THỨ ĐÁNG CACHE

Cache không miễn phí — nó tốn bộ nhớ và thêm rủi ro dữ liệu cũ. Nguyên tắc: chỉ cache thứ **đọc nhiều, đổi ít, và tính tốn kém**. Danh sách bài mới nhất, số lượt xem, cấu hình — hợp. Thứ đổi liên tục hoặc riêng từng người (giỏ hàng đang thao tác) — đừng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm \`@Cacheable\` cho một truy vấn nặng, bật log để thấy MISS rồi HIT.
2. Thêm \`@CacheEvict\` khi sửa dữ liệu, xác nhận cache được làm mới.
3. Cố tình quên \`@CacheEvict\` — quan sát dữ liệu cũ bị phục vụ.
4. Đặt TTL cho cache, thử trước và sau khi hết hạn.
5. Cấu hình cache dùng Redis thay cho bộ nhớ, kiểm hai tiến trình dùng chung.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Caching nhớ kết quả việc nặng để lần sau lấy luôn (HIT thay vì MISS) — tăng tốc rẻ và mạnh. Nhưng cái giá là **dữ liệu cũ**, nên phải **xoá cache đúng lúc** (\`@CacheEvict\` khi ghi) và đặt **TTL** làm lưới an toàn. Chỉ cache thứ đọc-nhiều-đổi-ít; nhiều máy chủ thì để cache ở Redis. "Khi nào xoá cache" là câu hỏi khó nhất — đừng xem nhẹ.

Đến giờ mọi thứ trong blog đều xảy ra **ngay trong lúc xử lý request**: người dùng bấm, chờ, nhận kết quả. Nhưng có những việc không nên bắt người dùng chờ. Gửi email "có bình luận mới" cho tác giả mất một giây gọi máy chủ mail — chẳng lẽ bắt người bình luận đứng chờ một giây chỉ vì cái email *của người khác*? Và có những việc chẳng ai bấm nút: dọn file rác mỗi đêm, tổng hợp thống kê mỗi giờ.

Ngày 90: **Xử lý nền & tác vụ định kỳ** — \`@Async\` để đẩy việc chậm (gửi mail, xử lý ảnh) ra chạy nền và trả lời người dùng ngay, cùng \`@Scheduled\` cho những việc tự chạy theo lịch mà không ai bấm. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
