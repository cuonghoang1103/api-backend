/** "100 Ngày Java với CuongThai" — Ngày 96: Kiểm thử tích hợp (Blog API).
    Nối đúng chỗ Ngày 95 kết ("test chủ yếu là unit + mock; khi GHÉP tất cả lại
    — controller→service→repo→CSDL thật — cả luồng có đúng không? mock có thể
    che một chỗ hai mảnh không khớp"). Ngày 97 (rà soát bảo mật) trỏ ngược về kết.

    ⚠ LUẬT 6: mock-che-bug vs integration-bắt-bug dựng bằng JDK thuần, tất định;
    thân bài dạy @SpringBootTest/Testcontainers thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 96,
  card: 'java-day-96',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-product-repository-integration-tests-with-testcontainers',
    title: 'Test tích hợp repository với Testcontainers',
  },

  content: `🧩 100 NGÀY JAVA — NGÀY 96: KIỂM THỬ TÍCH HỢP

Dây chuyền CI/CD của Ngày 95 có bước "test". Nhưng suốt Giai đoạn 7 và Ngày 75, test của bạn chủ yếu là **unit test** — kiểm từng mảnh riêng lẻ, giả (mock) mọi thứ xung quanh.

Chúng nhanh và nhiều, nhưng có một câu chúng không trả lời được: khi *ghép tất cả lại* — controller thật gọi service thật gọi repository thật xuống CSDL thật — cả luồng có chạy đúng không? Hôm nay là tấm lưới cuối cùng trước khi tin dây chuyền tự động deploy.

━━━━━━━━━━━━━━━━━━━━

🎭 VÌ SAO UNIT TEST CHƯA ĐỦ

Unit test giả lập tầng dưới để chạy nhanh và cô lập. Nhưng chính cái "giả lập" đó có thể **che giấu** một bug — khi bản giả cư xử khác bản thật.

Ví dụ thật: service đăng bài, bạn viết unit test với một repository giả. Bản giả cứ "lưu" là trả về thành công. Nhưng CSDL thật có ràng buộc **UNIQUE** trên \`slug\` (Ngày 61) — hai bài trùng slug phải bị chặn.

\`\`\`
1) UNIT (mock): dang 2 bai cung slug -> luu duoc? true (SAI voi thuc te)
2) INTEGRATION (kho that): lan 2 luu duoc? false (dung: UNIQUE chan)
\`\`\`

Unit test **xanh** — vì mock không ép ràng buộc, nó vui vẻ "lưu" cả hai bài trùng slug. Nhưng trên production, bài thứ hai sẽ nổ vì vi phạm \`UNIQUE\`. Test nói "ổn" mà thực tế hỏng:

\`\`\`
3) mock PASS nhung thuc te FAIL -> mock che giau cho 2 manh khong khop
4) integration BAT bug ma unit test bo sot
\`\`\`

Đây là loại bug nằm ở **ranh giới giữa hai mảnh** — code Java và ràng buộc CSDL không khớp nhau. Không mảnh nào sai riêng lẻ; chỗ *nối* mới sai. Unit test cô lập từng mảnh nên không thấy.

━━━━━━━━━━━━━━━━━━━━

🧩 INTEGRATION TEST: CHẠY THẬT CẢ LUỒNG

Kiểm thử tích hợp ghép các mảnh lại và chạy **thật**: controller thật, service thật, repository thật, CSDL thật. Trong Spring, \`@SpringBootTest\` dựng cả ứng dụng:

\`\`\`java
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class BaiVietIntegrationTest {

    @Container
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void cauHinh(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", db::getJdbcUrl);   // nối vào Postgres của container
        r.add("spring.datasource.username", db::getUsername);
        r.add("spring.datasource.password", db::getPassword);
    }

    @Autowired MockMvc mvc;

    @Test
    void khong_dang_duoc_2_bai_trung_slug() throws Exception {
        mvc.perform(post("/bai-viet").content(jsonBai("Học Java")))
           .andExpect(status().isCreated());
        mvc.perform(post("/bai-viet").content(jsonBai("Học Java")))   // trùng slug
           .andExpect(status().isConflict());                        // 409, không phải 500
    }
}
\`\`\`

Test này đi **đúng con đường của một request thật**: HTTP → controller → service → repository → Postgres → và ngược lại. Nếu code và CSDL không khớp, nó nổ ngay ở đây — trong test, không phải trên production.

━━━━━━━━━━━━━━━━━━━━

🐳 TESTCONTAINERS: CSDL THẬT, CHỈ CHO LÚC TEST

Điểm mấu chốt: integration test cần một CSDL **giống production**, không phải H2 trong bộ nhớ (H2 cư xử hơi khác Postgres — Ngày 75). Testcontainers giải bằng cách dựng một **Postgres thật trong Docker** chỉ cho lúc chạy test:

\`\`\`
5) Testcontainers: Postgres THAT trong Docker chi cho luc test, sach moi lan
\`\`\`

Nó tự khởi động container Postgres trước test, tự xoá sau test. Mỗi lần chạy có một CSDL **sạch, giống hệt production**, và không đụng vào CSDL thật của ai. Đây là lý do Testcontainers được ưa chuộng: độ chính xác của CSDL thật, sự tiện lợi của test tự động.

(Nhớ Ngày 94: Docker chạy được ở mọi máy — nên test này chạy y hệt trên máy bạn và trên máy CI.)

━━━━━━━━━━━━━━━━━━━━

⚖️ KIM TỰ THÁP TEST — CÂN BẰNG

Integration test mạnh nhưng **chậm** (dựng cả app + container mất vài giây mỗi lần). Đừng thay hết unit test bằng integration:

\`\`\`
6) nhieu UNIT (nhanh) + it INTEGRATION (that, cham) = luoi day du
\`\`\`

Nhắc lại kim tự tháp của Ngày 75:
- **Nhiều unit test** — logic thuần, nhanh, chạy liên tục.
- **Vừa test lát cắt** — \`@DataJpaTest\`, \`@WebMvcTest\`.
- **Ít integration test đầu-cuối** — cho những luồng quan trọng nhất (đăng ký, đăng bài, thanh toán) và những chỗ hay lệch ranh giới.

Integration test không thay unit test — nó **bổ sung**, phủ đúng chỗ mà mock để lọt.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết một unit test với mock repo cho một luật có ràng buộc CSDL — thấy nó xanh.
2. Thêm ràng buộc \`UNIQUE\` thật, viết integration test bắt cùng tình huống.
3. Dùng \`@Testcontainers\` + \`PostgreSQLContainer\`, nối qua \`@DynamicPropertySource\`.
4. Test đầu-cuối một luồng: POST tạo bài rồi GET đọc lại, kiểm dữ liệu khớp.
5. Đo thời gian một integration test so với một unit test — hiểu vì sao "ít".

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Unit test nhanh và nhiều, nhưng mock có thể **che giấu** bug nằm ở ranh giới giữa hai mảnh (code và CSDL không khớp). Kiểm thử tích hợp ghép tất cả lại chạy **thật** — \`@SpringBootTest\` + \`MockMvc\` đi trọn luồng HTTP → CSDL, và **Testcontainers** dựng Postgres thật trong Docker để giống production. Giữ kim tự tháp: nhiều unit, ít integration cho các luồng quan trọng. Đây là tấm lưới cuối trước khi tin CI/CD tự deploy.

Blog của bạn giờ đã đủ: tính năng, hiệu năng, vận hành, kiểm thử. Nhưng còn một góc chưa ai soi kỹ một cách có hệ thống: **bảo mật**. Suốt series ta đã chạm nhiều mảnh — SQL injection (63), băm mật khẩu (77), phân quyền và IDOR (80), upload an toàn (87), rate limit (88). Nhưng rải rác. Một hệ thống thật cần một lần **rà soát có danh sách**, đi qua từng loại lỗ hổng và tự hỏi "chỗ mình có dính không?".

Ngày 97: **Rà soát bảo mật cuối** — đi qua danh sách OWASP Top 10 (những lỗ hổng web phổ biến và nguy hiểm nhất) áp vào chính Blog API, gom lại mọi bài học bảo mật rải rác thành một checklist để bạn tự kiểm bất kỳ dự án nào. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
