/** "100 Ngày Java với CuongThai" — Ngày 75: Kiểm thử trong Spring.
    Nối đúng chỗ Ngày 74 kết ("làm sao BIẾT CHẮC nó chạy đúng? Giai đoạn 7 test
    hàm Java thuần, còn controller/repository/container Spring thì sao?").
    Ngày 76 (bài tổng hợp khép Giai đoạn 9) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý MockMvc +
    khung test; thân bài dạy @SpringBootTest/MockMvc/@DataJpaTest thật. Output
    là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 75,
  card: 'java-day-75',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-product-repository-integration-tests-with-testcontainers',
    title: 'Test tích hợp repository với Testcontainers',
  },

  content: `🧪 100 NGÀY JAVA — NGÀY 75: KIỂM THỬ TRONG SPRING

Ngày 74 để lại một câu hỏi sống còn trước khi đem lên máy chủ: làm sao bạn **biết chắc** nó chạy đúng?

Giai đoạn 7 bạn đã học viết test — nhưng đó là test cho hàm Java thuần. Còn một controller có trả đúng khi nhận request HTTP không? Một repository có lưu đúng vào CSDL không? Cả container Spring có ghép bean đúng không?

Hôm nay đưa cái lưới an toàn của Giai đoạn 7 lên tầm một ứng dụng web hoàn chỉnh.

━━━━━━━━━━━━━━━━━━━━

⚖️ BA MỨC TEST — CHỌN ĐÚNG MỨC LÀ QUAN TRỌNG NHẤT

Spring cho ba "lát cắt" test, mỗi lát dựng một phần khác nhau của ứng dụng. Chọn đúng lát quyết định test nhanh hay chậm:

\`\`\`
@WebMvcTest       chỉ dựng tầng web       (nhanh — vài chục ms)
@DataJpaTest      chỉ dựng tầng CSDL      (nhanh)
@SpringBootTest   dựng CẢ ứng dụng        (chậm — vài giây)
\`\`\`

Nguyên tắc: **test hẹp nhất đủ để kiểm cái mình cần**. Đừng dùng \`@SpringBootTest\` cho mọi thứ — nó dựng cả container, cả CSDL, cả web server, chậm gấp hàng chục lần. Dùng nó chỉ khi cần kiểm *toàn bộ luồng* ghép đúng.

━━━━━━━━━━━━━━━━━━━━

🧪 MockMvc: TEST API MÀ KHÔNG CẦN SERVER

Đây là công cụ đẹp nhất của bài. \`MockMvc\` gọi thẳng vào controller **trong tiến trình test**, không mở cổng, không dựng server thật — mà vẫn đi qua đúng toàn bộ tầng web (định tuyến, \`@PathVariable\`, chuyển JSON):

\`\`\`java
@WebMvcTest(DonController.class)
class DonControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean DichVuDonHang dichVu;      // giả tầng service (Ngày 54)

    @Test
    void xem_don_co_that_tra_200() throws Exception {
        when(dichVu.timTheoMa("DH-2"))
            .thenReturn(new DonHang("DH-2", 350000));

        mockMvc.perform(get("/don/DH-2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ma").value("DH-2"))
            .andExpect(jsonPath("$.soTien").value(350000));
    }
}
\`\`\`

Chạy thử nguyên lý đó:

\`\`\`
1) MockMvc goi GET /don/DH-2 (khong server that) -> status 200
2) assert than JSON chua 'DH-2' -> DAT
3) GET /don/DH-404 -> status 404 -> DAT
\`\`\`

\`mockMvc.perform(get(...))\` gửi một request giả, rồi bạn assert trên **mã trạng thái** và **thân JSON** (\`jsonPath\` đọc vào cấu trúc JSON). Vì không cần server, một bộ test API chạy trong mili-giây — đủ nhanh để chạy sau mỗi lần lưu file.

Để ý \`@MockBean\`: nó thay tầng service bằng một bản giả (Ngày 54), nên test này chỉ kiểm **đúng tầng web** — controller định tuyến đúng, chuyển JSON đúng, trả mã đúng — không lẫn với logic service hay CSDL.

━━━━━━━━━━━━━━━━━━━━

💾 @DataJpaTest: KIỂM REPOSITORY THẬT SỰ CHẠM CSDL

Test repository thì phải có CSDL — nhưng không phải Postgres thật trên máy bạn. \`@DataJpaTest\` dựng một CSDL **sạch cho mỗi lần chạy**:

\`\`\`java
@DataJpaTest
class KhoDonTest {
    @Autowired KhoDon khoDon;

    @Test
    void luu_roi_tim_lai_duoc() {
        khoDon.save(new DonHang("DH-9", 500000, "MOI"));
        assertThat(khoDon.findByTrangThai("MOI")).hasSize(1);
    }
}
\`\`\`

\`\`\`
4) @DataJpaTest: kiem kho tren bo nho, khong CSDL that -> DAT
\`\`\`

Hai lựa chọn cho CSDL test:
- **H2 trong bộ nhớ** — cực nhanh, nhưng là CSDL khác Postgres, đôi khi cư xử hơi khác.
- **Testcontainers** — chạy một Postgres thật trong Docker chỉ cho lúc test, giống production nhất. Đây là cách được ưa chuộng khi độ chính xác quan trọng.

Điểm chung: mỗi lần test bắt đầu với dữ liệu sạch, và không đụng vào CSDL thật của ai.

━━━━━━━━━━━━━━━━━━━━

🕸️ VẪN LÀ CÁI LƯỚI CỦA GIAI ĐOẠN 7

Dù công cụ mới, bản chất không đổi so với Ngày 53: một khung so mong-đợi với thực-tế, đỏ khi lệch. Cố tình để một assert sai:

\`\`\`
5) assert co tinh sai (mong 200, nhan 404) -> khung test BAO HONG dung
6) tong: 3 dat, 1 hong
\`\`\`

Test đỏ **chỉ đúng chỗ vỡ** — đó là toàn bộ giá trị. Ghép với CI của Ngày 57: mỗi lần đẩy code, máy chủ chạy cả bộ test này trên một môi trường sạch, và chặn gộp nếu có màu đỏ. Từ controller tới repository, không đường nào ra production mà chưa qua lưới.

━━━━━━━━━━━━━━━━━━━━

🎯 KIM TỰ THÁP TEST — VIẾT NHIỀU CÁI NÀO?

Một hướng dẫn thực tế về tỉ lệ:

- **Nhiều** unit test (Ngày 53) — service, logic thuần, mock tầng dưới. Nhanh, nhiều, chạy liên tục.
- **Vừa** test lát cắt — \`@WebMvcTest\`, \`@DataJpaTest\`. Kiểm từng tầng ghép đúng.
- **Ít** test toàn bộ — \`@SpringBootTest\` cho vài luồng quan trọng nhất (đăng ký, thanh toán). Chậm nên để dành.

Càng lên cao càng chậm và giòn, nên càng ít. Đừng đảo ngược kim tự tháp: một bộ test toàn \`@SpringBootTest\` sẽ chạy hàng phút và hỏng vì những lý do chẳng liên quan.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`@WebMvcTest\` cho một controller, dùng \`MockMvc\` kiểm 200 và 404.
2. Dùng \`@MockBean\` giả tầng service, xác nhận controller test độc lập với logic.
3. Viết \`@DataJpaTest\` kiểm một \`findBy...\` lưu rồi tìm lại được.
4. Cố tình sửa controller cho sai mã trạng thái, xem test chuyển đỏ.
5. Thử một \`@SpringBootTest\` cho một luồng đầu-cuối, so tốc độ với \`@WebMvcTest\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Spring cho ba mức test theo tốc độ: \`MockMvc\`/\`@WebMvcTest\` kiểm tầng web không cần server, \`@DataJpaTest\` kiểm repository trên CSDL sạch, \`@SpringBootTest\` dựng cả ứng dụng cho luồng quan trọng. Bản chất vẫn là cái lưới của Giai đoạn 7 — so mong-đợi với thực-tế, đỏ đúng chỗ vỡ — nay phủ từ controller tới CSDL, và ghép vào CI để chặn mọi đường ra production chưa qua kiểm.

Đến đây bạn đã có đủ mọi mảnh của một ứng dụng web Spring Boot: IoC/DI, REST, nhận dữ liệu, JPA, quan hệ, service + giao dịch, xử lý lỗi, cấu hình, và test. Chín ngày, chín mảnh rời.

Ngày 76: **Bài tổng hợp khép Giai đoạn 9** — ghép tất cả thành một REST API CRUD hoàn chỉnh cho một tài nguyên, đi trọn từ request HTTP → controller → service (giao dịch) → repository → CSDL, có validation, có xử lý lỗi, có test. Xong bài đó, bạn cầm trong tay một backend thật sự đi làm được. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
