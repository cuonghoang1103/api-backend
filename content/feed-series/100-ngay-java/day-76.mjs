/** "100 Ngày Java với CuongThai" — Ngày 76: Bài tổng hợp khép Giai đoạn 9.
    Nối đúng chỗ Ngày 75 kết ("chín mảnh rời — ghép lại thành một REST API CRUD
    hoàn chỉnh"). Ngày 77 mở Giai đoạn 10 (bảo mật) và trỏ ngược về phần kết.

    ⚠ LUẬT 6: bài khép giai đoạn ghép cả chín mảng Spring vào một luồng CRUD
    chạy bằng JDK thuần; thân bài dạy cú pháp Spring thật. Output là kết quả
    THẬT của javac/java JDK 21. */
export default {
  day: 76,
  card: 'java-day-76',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-transactional-order-processing-system-with-jdbc-connection-pooling-and-batch-operations',
    title: 'Hệ xử lý đơn hàng đầy đủ tầng (đồ án khép giai đoạn)',
  },

  content: `🏁 100 NGÀY JAVA — NGÀY 76: KHÉP GIAI ĐOẠN 9

Chín ngày qua ta học chín mảng của Spring Boot: IoC/DI, REST, nhận dữ liệu, JPA, quan hệ, service + giao dịch, xử lý lỗi, cấu hình, kiểm thử.

Hôm nay ghép tất cả thành **một** thứ: một REST API CRUD hoàn chỉnh cho tài nguyên đơn hàng, đi trọn từ request HTTP tới CSDL và ngược lại. Đây là hình dạng của một backend đi làm được.

━━━━━━━━━━━━━━━━━━━━

🗺️ TOÀN CẢNH: MỘT REQUEST ĐI QUA NHỮNG ĐÂU

\`\`\`
HTTP request
   │
@RestController   ── định tuyến, nhận JSON        (68, 69)
   │  @Valid — kiểm dữ liệu ở cửa                 (69)
@Service          ── logic nghiệp vụ, @Transactional (72)
   │
@Repository       ── JpaRepository                (70, 71)
   │
PostgreSQL
   ↑
@RestControllerAdvice ── mọi exception → mã HTTP đúng (73)
\`\`\`

Mỗi tầng đúng một việc, và chúng nối nhau thành một đường thẳng. Giờ đi qua từng thao tác CRUD, quan sát mã trạng thái mỗi bước trả về.

━━━━━━━━━━━━━━━━━━━━

✅ CREATE — ĐI TRỌN MỌI TẦNG

\`\`\`java
@PostMapping("/don")
public ResponseEntity<Don> tao(@Valid @RequestBody DonMoi yc) {
    Don d = dichVu.tao(yc);                       // service → repo
    return ResponseEntity.status(201).body(d);
}
\`\`\`

\`\`\`
1) POST /don {DH-9,500000} -> 201 {"ma":"DH-9","soTien":500000,"trangThai":"MOI"}
\`\`\`

Một request đi trọn: \`@Valid\` kiểm dữ liệu → controller gọi service → service (trong giao dịch) gọi repository → repository lưu vào CSDL → trả \`201 Created\` kèm đối tượng vừa tạo. Chín ngày học gói vào một luồng.

━━━━━━━━━━━━━━━━━━━━

🛂 VALIDATION CHẶN NGAY Ở CỬA

\`\`\`
2) POST soTien am -> validation chan -> 400 {"loi":"'soTien' khong duoc am"}
\`\`\`

Số tiền âm bị \`@Valid\` chặn **trước khi chạm service** — advice dịch thành \`400\`. Nghiệp vụ và CSDL không hề bị làm phiền bởi dữ liệu rác. Đây là lý do đặt validation ở tầng ngoài cùng (Ngày 69): rác dừng ở cửa.

━━━━━━━━━━━━━━━━━━━━

🔍 READ — THẤY THÌ 200, KHÔNG THÌ 404

\`\`\`java
@GetMapping("/don/{ma}")
public Don xem(@PathVariable String ma) {
    return dichVu.timTheoMa(ma);   // ném KhongTimThay nếu không có
}
\`\`\`

\`\`\`
3) GET /don/DH-9 -> 200 {"ma":"DH-9","soTien":500000,"trangThai":"MOI"}
4) GET /don/DH-404 -> advice -> 404 {"loi":"khong co don DH-404"}
\`\`\`

Service chỉ ném \`KhongTimThayException\`; nó không biết gì về HTTP. \`@RestControllerAdvice\` (Ngày 73) dịch exception đó thành \`404\` JSON sạch. Trách nhiệm tách bạch: service lo nghiệp vụ, advice lo dịch lỗi ra HTTP.

━━━━━━━━━━━━━━━━━━━━

🔄 UPDATE & DELETE — KHÉP VÒNG ĐỜI

\`\`\`
5) PUT /don/DH-9 {600000} -> 200 {"ma":"DH-9","soTien":600000,"trangThai":"MOI"}
6) DELETE /don/DH-9 -> 204; GET lai -> 404
\`\`\`

\`PUT\` sửa, trả \`200\` với trạng thái mới. \`DELETE\` xoá, trả \`204 No Content\` (thành công, không có gì trả về). Và \`GET\` ngay sau đó cho \`404\` — đúng, vì đơn không còn nữa. Vòng đời khép kín: **tạo → đọc → sửa → xoá → không còn.**

Đây là bộ bốn động từ HTTP của Ngày 68, giờ chạy đầy đủ trên một tài nguyên thật.

━━━━━━━━━━━━━━━━━━━━

🧪 VÀ TẤT CẢ ĐỀU CÓ TEST

Mỗi bước ở trên là một dòng test bạn viết được với công cụ của Ngày 75:

\`\`\`java
mockMvc.perform(post("/don").content(jsonHopLe))
       .andExpect(status().isCreated());          // 201

mockMvc.perform(post("/don").content(jsonSoTienAm))
       .andExpect(status().isBadRequest());       // 400

mockMvc.perform(get("/don/DH-404"))
       .andExpect(status().isNotFound());         // 404
\`\`\`

Ghép với CI của Ngày 57, mỗi lần đẩy code là cả luồng CRUD này được kiểm lại trên môi trường sạch. Không có đường nào ra production mà chưa qua lưới.

━━━━━━━━━━━━━━━━━━━━

🧭 NHÌN LẠI GIAI ĐOẠN 9

\`\`\`
67  IoC / DI — container lắp ráp
68  REST — @RestController, động từ HTTP
69  nhận dữ liệu — @RequestBody, @Valid
70  Spring Data JPA — interface rỗng, CRUD tự sinh
71  quan hệ — @OneToMany, bẫy N+1
72  service — @Transactional
73  xử lý lỗi — @ControllerAdvice
74  cấu hình — profiles, bí mật ngoài Git
75  kiểm thử — MockMvc, @DataJpaTest
\`\`\`

Chín ngày này trả lời một câu hỏi: **làm sao dựng một backend web thật, đúng và gọn?** Và bạn vừa thấy chín mảnh đó ghép khít vào một luồng duy nhất. Đây là bộ khung mà gần như mọi dịch vụ Java đi làm đều dùng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Dựng một REST API CRUD hoàn chỉnh cho một tài nguyên (sản phẩm, bài viết...).
2. Đủ bốn động từ: POST (201), GET (200/404), PUT (200), DELETE (204).
3. Thêm \`@Valid\` cho dữ liệu vào, \`@RestControllerAdvice\` cho lỗi.
4. Đặt logic trong \`@Service\` có \`@Transactional\`, dữ liệu qua \`JpaRepository\`.
5. Viết \`MockMvc\` test cho cả bốn thao tác, cho chạy trong CI.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN — MỘT BACKEND HOÀN CHỈNH

Một REST API CRUD đi trọn: \`@Valid\` chặn rác ở cửa → controller định tuyến → service chạy nghiệp vụ trong giao dịch → repository lưu CSDL → advice dịch mọi lỗi thành đúng mã HTTP → và cả luồng có test. Chín mảnh của Giai đoạn 9 khít lại thành một backend đi làm được.

Nhưng để ý: API này **ai gọi cũng được**. Bất kỳ ai biết địa chỉ đều tạo, sửa, xoá đơn hàng của người khác. Chưa có đăng nhập, chưa có "bạn là ai", chưa có "bạn được phép làm gì". Một backend thật không thể mở toang như vậy.

Ngày 77 mở **Giai đoạn 10 — chặng cuối**: bảo mật và một dự án hoàn chỉnh. Bắt đầu bằng câu hỏi nền tảng của mọi ứng dụng có người dùng — *xác thực* (bạn là ai) và *phân quyền* (bạn được làm gì): mật khẩu lưu thế nào cho an toàn, JWT là gì, và Spring Security gắn một lớp gác vào trước API của bạn ra sao. Hai mươi tư ngày cuối, ta biến bộ khung hôm nay thành một sản phẩm thật. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
