/** "100 Ngày Java với CuongThai" — Ngày 53: viết test với JUnit.
    Nối chỗ Ngày 52 kết (500 hàm, 5 người, không ai dám sửa code cũ).
    Ngày 54 (Mockito) trỏ ngược về phần kết.

    ⚠ JUnit là thư viện ngoài mà thẻ bài học chạy JDK thuần, nên thẻ dựng
    lại NGUYÊN LÝ bằng khung test tự viết; thân bài dạy cú pháp JUnit thật.
    Mọi output trong bài là kết quả THẬT của javac/java trên JDK 21. */
export default {
  day: 53,
  card: 'java-day-53',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'enforce-invariants-with-an-encapsulated-bank-account',
    title: 'Tài khoản ngân hàng có ràng buộc (hợp để tập viết test)',
  },

  content: `✅ 100 NGÀY JAVA — NGÀY 53: VIẾT TEST

Suốt 52 ngày, bạn kiểm tra code bằng cách nào?

Chạy \`main\`, in ra màn hình, mắt nhìn xem có đúng không. Sửa chỗ khác, chạy lại, lại nhìn.

Với 5 hàm thì được. Với 500 hàm và một đội 5 người thì không. Và điều tệ nhất không phải là mệt — mà là **không ai dám sửa code cũ nữa**, vì không biết mình vừa làm hỏng cái gì ở đâu.

━━━━━━━━━━━━━━━━━━━━

📌 Ý TƯỞNG: ĐỂ MÁY SO THAY MẮT

Bản chất của một phép kiểm chỉ có vậy:

\`\`\`java
static void kiem(String ten, Object mongDoi, Object thucTe) {
    if (Objects.equals(mongDoi, thucTe)) dat++;
    else { hong++; loi.add(ten + ": mong " + mongDoi + " nhung nhan " + thucTe); }
}
\`\`\`

Chạy thật với 7 phép kiểm:

\`\`\`
1) so phep kiem DAT -> 7
2) so phep kiem HONG -> 0
3) tat ca deu dat? true
\`\`\`

Một giây, bảy phép kiểm, không ai phải nhìn màn hình. Sửa code xong chạy lại — vẫn xanh nghĩa là không làm vỡ gì.

JUnit chính là khung này, viết sẵn và mạnh hơn nhiều.

━━━━━━━━━━━━━━━━━━━━

📝 CÚ PHÁP JUNIT 5

Thêm thư viện (Maven — sẽ học kỹ ở Ngày 56):

\`\`\`xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
\`\`\`

Rồi viết test:

\`\`\`java
class MayTinhTest {

    @Test
    void chia_binh_thuong() {
        assertEquals(5, MayTinh.chia(10, 2));
    }

    @Test
    void chia_cho_0_thi_nem_ngoai_le() {
        assertThrows(IllegalArgumentException.class, () -> MayTinh.chia(1, 0));
    }

    @Test
    void xep_loai_o_bien_9_diem() {
        assertEquals("Xuat sac", MayTinh.xepLoai(9.0));
    }
}
\`\`\`

Bộ khẳng định hay dùng:

\`\`\`java
assertEquals(mongDoi, thucTe)    assertTrue(dieuKien)
assertNull(x)                    assertNotNull(x)
assertThrows(Loai.class, () -> …)
assertAll(() -> …, () -> …)      // chạy hết rồi báo tất cả lỗi
\`\`\`

Và vài chú thích đáng nhớ: \`@BeforeEach\` dựng dữ liệu trước mỗi test, \`@DisplayName\` đặt tên tiếng Việt dễ đọc, \`@ParameterizedTest\` chạy cùng một test với nhiều bộ đầu vào.

━━━━━━━━━━━━━━━━━━━━

💥 KIỂM CẢ ĐƯỜNG HỎNG — CHỖ NGƯỜI MỚI HAY BỎ QUA

Test chỉ kiểm "đường đúng" là loại test cho cảm giác an toàn giả. Bug gần như không bao giờ nằm ở đường đúng.

Ba nhóm phải có:

\`\`\`java
// 1. Bình thường
assertEquals(5, chia(10, 2));

// 2. BIÊN — nơi bug hay nấp nhất
assertEquals("Xuat sac", xepLoai(9.0));    // đúng ngưỡng
assertEquals("Kha", xepLoai(7.99));         // sát dưới ngưỡng

// 3. Lỗi
assertThrows(IllegalArgumentException.class, () -> chia(1, 0));
assertThrows(IllegalArgumentException.class, () -> xepLoai(99));
\`\`\`

Cứ nghĩ tới mọi thứ ở rìa: 0, số âm, chuỗi rỗng, \`null\`, danh sách rỗng, phần tử đầu và cuối, đúng ngưỡng và sát ngưỡng.

━━━━━━━━━━━━━━━━━━━━

🔴 TEST HỎNG PHẢI NÓI RÕ HỎNG GÌ

Thử cho một phép kiểm sai có chủ đích:

\`\`\`
4) sau khi them 1 phep sai -> hong = 1
5) thong bao loi -> co tinh sai: mong 100 nhung nhan 5
\`\`\`

Đọc một dòng là biết sai ở đâu, không cần mở trình gỡ lỗi. Đó là tiêu chuẩn của một test tốt: **khi đỏ, nó tự chỉ ra vấn đề**.

Ba dấu hiệu test viết dở:

- Tên kiểu \`test1\`, \`test2\` — đỏ lên không biết hỏng cái gì
- Test này phụ thuộc test kia đã chạy trước — chạy riêng thì đỏ, chạy cả bộ thì xanh (hoặc ngược lại)
- Một test kiểm mười việc — đỏ một cái là không biết cái nào

━━━━━━━━━━━━━━━━━━━━

🧭 TEST BAO NHIÊU LÀ ĐỦ

Đừng đuổi theo con số "phủ 100%". Thứ tự ưu tiên thực dụng:

1. **Logic nghiệp vụ** — tính tiền, xếp loại, kiểm dữ liệu hợp lệ. Đây là chỗ sai thì đắt nhất.
2. **Chỗ đã từng có bug** — sửa bug xong viết ngay một test cho nó, để nó không quay lại.
3. **Chỗ nhiều nhánh \`if\`** — nhiều nhánh thì nhiều đường chưa ai đi.

Không cần test: getter/setter thuần, code chỉ gọi thẳng thư viện, mã sinh tự động.

Và lợi ích lớn nhất của test không phải "tìm bug". Nó là **cho phép bạn sửa code mà không sợ**. Có bộ test xanh, bạn dám dọn dẹp, đổi thiết kế, tối ưu — chạy lại thấy xanh là yên tâm. Không có test, mọi thay đổi đều là canh bạc, và code cứ thế mục dần vì không ai dám động vào.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`MayTinh.chia\` rồi viết 3 test: bình thường, chia cho 0, số âm.
2. Viết test cho \`xepLoai\` phủ cả các giá trị biên 9.0, 8.0, 7.99.
3. Dùng \`assertThrows\` kiểm một ngoại lệ nghiệp vụ tự viết (Ngày 22).
4. Cố tình sửa code cho sai và xem test đỏ — đọc thông báo lỗi.
5. Lấy một bug bạn từng gặp, viết test tái hiện nó, rồi mới sửa.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Test là để máy so thay mắt bạn. JUnit cho \`@Test\` + bộ \`assert\`. Phải phủ cả đường bình thường, biên và lỗi. Test tốt là test khi đỏ thì tự nói ra vấn đề. Và giá trị lớn nhất của nó là cho bạn quyền sửa code mà không sợ.

Nhưng thử viết test cho hàm này:

\`\`\`java
double tinhTien(int maDon) {
    DonHang d = database.tim(maDon);          // gọi cơ sở dữ liệu
    double thue = apiThue.layThueSuat();      // gọi API bên ngoài
    return d.tongTien() * (1 + thue);
}
\`\`\`

Chạy test là gọi DB thật và API thật? Chậm, phụ thuộc mạng, và mỗi lần chạy dữ liệu một khác — test lúc xanh lúc đỏ mà code không đổi.

Ngày 54: **Mockito** — tạo bản giả cho DB và API để test chạy trong một mili-giây, luôn cho cùng kết quả, và kiểm được cả những tình huống khó dựng như "API trả lỗi 500". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
