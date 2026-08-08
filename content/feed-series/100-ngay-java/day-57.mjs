/** "100 Ngày Java với CuongThai" — Ngày 57: Git & CI.
    Nối đúng chỗ Ngày 56 kết ("có test, có Maven chạy test — nhưng ai bấm nút?").
    Ngày 58 (log & gỡ lỗi) sẽ trỏ ngược về phần kết.

    ⚠ Git và GitHub Actions là công cụ ngoài, không chạy được trong thẻ (JDK
    thuần), nên thẻ dựng lại nguyên lý: kho theo nội dung, nhánh = con trỏ, tổ
    tiên chung, gộp ba đường, cổng CI. Thân bài dạy lệnh git + YAML thật.
    Mọi output là kết quả THẬT của javac/java JDK 21, và hai mã băm ở mục 1
    khớp chính xác với `git hash-object` của git 2.51. */
export default {
  day: 57,
  card: 'java-day-57',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'create-a-custom-maven-plugin-for-build-metadata-injection',
    title: 'Nhúng thông tin commit vào bản build bằng Maven plugin',
  },

  content: `🔀 100 NGÀY JAVA — NGÀY 57: GIT & CI

Ngày 56 kết bằng một câu hỏi bỏ ngỏ: dự án đã có test (Ngày 53–55), đã có Maven chạy test (Ngày 56). Nhưng **ai bấm nút chạy?**

Câu trả lời thật thà: hôm nay bạn nhớ, mai bạn vội, và tuần sau thì "chắc không sao đâu".

Hôm nay ta bỏ chữ "nhớ" ra khỏi quy trình.

━━━━━━━━━━━━━━━━━━━━

📸 COMMIT KHÔNG PHẢI "BẢN LƯU", NÓ LÀ ẢNH CHỤP CÓ MÃ BĂM

Hầu hết người mới nghĩ Git lưu "những thay đổi". Không. Git lưu **toàn bộ nội dung**, rồi đặt tên cho nó bằng **mã băm của chính nội dung đó**.

Tự tính lại đúng công thức của Git — \`"blob " + số byte + \\0 + nội dung\`, băm SHA-1:

\`\`\`
1) commit 'xin chao' -> ma bam 1156bc3
2) sua 1 ky tu -> ma bam doi han: c29752d
\`\`\`

Đổi **đúng một ký tự** (\`a\` → \`d\`), mã băm không đổi một chút mà đổi hoàn toàn. Không tin thì mở terminal gõ thử:

\`\`\`bash
printf 'xin chao' | git hash-object --stdin   # 1156bc3f6612...
\`\`\`

Hai hệ quả đáng nhớ:
- **Cùng nội dung → cùng mã, ở mọi máy trên đời.** Nên hai người có cùng mã commit là chắc chắn có cùng code, không cần tin nhau.
- **Không sửa lén lịch sử được.** Mỗi commit chứa mã của commit cha; sửa một commit cũ là đổi mã của nó, kéo theo mọi commit sau đều sai mã.

━━━━━━━━━━━━━━━━━━━━

🔀 NHÁNH RẺ ĐẾN MỨC KHÔNG CÓ LÝ DO ĐỂ KHÔNG DÙNG

Nhánh trong Git chỉ là **một dòng chữ: tên → mã commit**. Có thế thôi.

\`\`\`
3) tao 3 nhanh -> 3 con tro, so ban sao noi dung: 0
\`\`\`

Ba nhánh, **không** chép file nào. Đây là lý do người ta bảo "cứ tạo nhánh mà làm" — nó gần như miễn phí:

\`\`\`bash
git switch -c them-gio-hang    # tạo nhánh mới + nhảy sang luôn
git switch main                # quay về
git branch                     # đang có những nhánh nào
\`\`\`

Nguyên tắc trong đội: **\`main\` luôn là bản chạy được.** Mọi thứ đang làm dở sống trên nhánh riêng.

━━━━━━━━━━━━━━━━━━━━

🔁 VÒNG LÀM VIỆC MỘT NGÀY

\`\`\`bash
git switch -c them-gio-hang
# ... sửa code, viết test (Ngày 53) ...
mvn test                                  # tự kiểm trước đã
git status                                # đang sửa những gì
git diff                                  # xem chính xác từng dòng
git add .
git commit -m "feat: them gio hang"
git push -u origin them-gio-hang
# → mở Pull Request trên GitHub
\`\`\`

\`git status\` và \`git diff\` trước mỗi lần \`add\` là thói quen đáng giá nhất trong danh sách này — nó chặn đúng loại tai nạn "lỡ commit cả file cấu hình có mật khẩu".

━━━━━━━━━━━━━━━━━━━━

🌿 GỘP NHÁNH: MÁY SO BA BẢN, KHÔNG PHẢI HAI

Chỗ này ai cũng dùng mà ít người biết máy làm gì. Giả sử lịch sử rẽ đôi:

\`\`\`
C1 - C2 - C3         (main)
       \\- C4 - C5    (tinh-nang)
\`\`\`

Git **không** so \`C3\` với \`C5\`. Nó tìm **tổ tiên chung gần nhất** rồi so **ba** bản:

\`\`\`
4) to tien chung gan nhat cua main & tinh-nang -> C2
5) cung sua dong 3 -> XUNG DOT [3] | khac dong -> tu gop du 3 dong: true
\`\`\`

Với mỗi dòng, máy hỏi hai câu: *so với bản gốc C2, nhánh A có sửa dòng này không? nhánh B có không?*

- Chỉ một bên sửa → lấy bên đó. **Tự gộp, bạn không phải làm gì.**
- Cả hai cùng sửa, khác nhau → **xung đột**. Máy không đoán bừa, vì đoán sai ở đây là mất code người khác.

Xung đột hiện ra trong file như thế này — không phải lỗi, chỉ là câu hỏi:

\`\`\`java
<<<<<<< HEAD
    return giaBan * 0.9;
=======
    return giaBan - 10000;
>>>>>>> them-khuyen-mai
\`\`\`

Bạn xoá ba dòng dấu, giữ lại đoạn đúng (đôi khi là cả hai, viết lại), rồi \`git add\` + \`git commit\`. Xung đột càng ít khi nhánh càng ngắn ngày — nhánh sống hai tuần thì gộp là một buổi chiều.

━━━━━━━━━━━━━━━━━━━━

🚦 CI: MÁY CHỦ TỰ CHẠY TEST

Giờ tới phần trả lời câu hỏi của Ngày 56. Tạo đúng một file trong dự án:

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven
      - run: mvn --batch-mode test
\`\`\`

Đọc từ trên xuống: **khi nào chạy** (đẩy code lên \`main\`, hoặc mở PR) → **chạy ở đâu** (một máy Ubuntu sạch) → **làm gì** (lấy code về, cài JDK 21, chạy \`mvn test\`).

Máy đó **sạch hoàn toàn** — không có thư mục \`target\` cũ, không có file bạn quên commit, không có biến môi trường chỉ máy bạn mới có. Nên từ hôm nay, **"máy tôi chạy được" không còn là lý do**: nếu CI đỏ mà máy bạn xanh, chính máy bạn mới là chỗ đáng ngờ.

━━━━━━━━━━━━━━━━━━━━

🔒 CHẶN NHÁNH ĐỎ — BƯỚC HAY BỊ QUÊN

CI chạy xong mà vẫn gộp được thì nó chỉ là cái đèn báo. Muốn nó thành **cổng**, bật *branch protection* cho \`main\` (Settings → Branches trên GitHub): yêu cầu CI xanh mới cho gộp, và cấm đẩy thẳng vào \`main\`.

\`\`\`
6) CI 3 phep thu -> 1 DO -> chan gop vao main? true
\`\`\`

Một phép thử đỏ là nút "Merge" xám đi. Không ai phải nhắc ai, không ai phải nhớ.

━━━━━━━━━━━━━━━━━━━━

🚫 ĐỪNG COMMIT THỨ KHÔNG NÊN COMMIT

Tạo \`.gitignore\` ngay từ commit đầu tiên:

\`\`\`
target/          # kết quả build của Maven (Ngày 56)
*.class          # bytecode
.env             # KHOÁ, MẬT KHẨU — nguy hiểm nhất
.idea/           # cấu hình riêng của IDE
\`\`\`

Cảnh báo thật lòng: mật khẩu lỡ commit rồi thì **xoá ở commit sau là chưa đủ** — nó vẫn nằm trong lịch sử, ai clone về cũng đọc được. Cách xử lý duy nhất đáng tin là **đổi ngay cái mật khẩu đó**.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chạy \`printf 'xin chao' | git hash-object --stdin\`, rồi đổi một ký tự và chạy lại — nhìn mã băm đổi.
2. Tạo nhánh mới, commit một thay đổi, quay về \`main\` và xem file trở lại như cũ.
3. Cố tình tạo xung đột: hai nhánh cùng sửa một dòng, rồi tự tay gỡ.
4. Thêm file \`ci.yml\` ở trên vào một repo GitHub và xem nó chạy.
5. Đẩy một test cố tình đỏ lên PR — quan sát CI chuyển đỏ và nút gộp bị chặn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Git lưu **nội dung** và đặt tên bằng mã băm của nội dung, nên lịch sử không sửa lén được. Nhánh chỉ là con trỏ nên rẻ như cho. Gộp là phép so **ba bản** quanh tổ tiên chung — tự động khi hai người sửa hai chỗ, hỏi lại khi sửa cùng chỗ. Và CI biến \`mvn test\` từ việc-phải-nhớ thành cái cổng máy tự canh.

Đến đây quy trình đã kín: viết test → Maven chạy → CI canh → nhánh đỏ không vào được \`main\`.

Nhưng rồi sẽ tới cái ngày CI xanh, máy bạn xanh, mà **người dùng thật vẫn báo lỗi**. Bạn mở production ra và... không thấy gì cả. Không stack trace nào, không \`System.out.println\` nào — mà cũng không ai cho bạn cắm trình gỡ lỗi vào máy chủ đang chạy.

Ngày 58: **Log & gỡ lỗi** — vì sao \`System.out.println\` không dùng được ở production, SLF4J/Logback ghi gì và ghi ở đâu, mức log nào cho việc gì, và cách đọc một stack trace dài ba trang để tìm đúng dòng có lỗi. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
