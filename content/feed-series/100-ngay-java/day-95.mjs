/** "100 Ngày Java với CuongThai" — Ngày 95: CI/CD (Blog API).
    Nối đúng chỗ Ngày 94 kết ("đóng gói được image, nhưng ai bấm nút build? ai
    chạy test? làm tay thì quên bước, deploy nhầm phiên bản").
    Ngày 96 (kiểm thử tích hợp) trỏ ngược về phần kết.

    ⚠ LUẬT 6: pipeline dựng bằng JDK thuần (dừng ở bước fail, gate deploy), tất
    định; thân bài dạy GitHub Actions thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 95,
  card: 'java-day-95',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-custom-gradle-plugin-for-pipeline-conditional-task-execution',
    title: 'Plugin pipeline chạy bước theo điều kiện (CI/CD)',
  },

  content: `🚀 100 NGÀY JAVA — NGÀY 95: CI/CD

Ngày 94 bạn đóng gói được ứng dụng thành image Docker. Nhưng ai bấm nút build? Ai chạy test trước khi đóng gói? Ai đẩy image lên máy chủ?

Nếu làm tay mỗi lần, bạn sẽ quên chạy test, quên một bước, hoặc deploy nhầm phiên bản — đúng những sự cố mà một quy trình thủ công luôn mắc. Hôm nay nối tất cả thành một **dây chuyền tự động**.

━━━━━━━━━━━━━━━━━━━━

🔗 CI/CD LÀ GÌ

Hai chữ viết tắt, một dây chuyền:

- **CI (Continuous Integration)** — *tích hợp liên tục*: mỗi lần đẩy code, máy tự **build và chạy test** (đã gặp ở Ngày 57). Bắt lỗi sớm, ngay khi vừa đẩy.
- **CD (Continuous Delivery/Deployment)** — *triển khai liên tục*: nối tiếp CI, tự **đóng gói image** (Ngày 94) và **đưa lên máy chủ** nếu mọi thứ xanh.

Gộp lại: từ \`git push\` tới production mà không ai phải bấm tay.

━━━━━━━━━━━━━━━━━━━━

🔗 DÂY CHUYỀN CÁC BƯỚC

Một pipeline là chuỗi các bước chạy theo thứ tự:

\`\`\`
1) pipeline: [checkout, build, test, docker, deploy]
2) tat ca xanh -> chay 5 buoc -> deploy? true
\`\`\`

Lấy code về → biên dịch → chạy test → đóng gói image → triển khai. Khi mọi bước xanh, dây chuyền chạy hết và deploy.

━━━━━━━━━━━━━━━━━━━━

🛑 QUY TẮC VÀNG: FAIL LÀ DỪNG NGAY

Đây là điều làm CI/CD đáng giá. Bước nào đỏ thì **dừng cả dây chuyền**, không chạy tiếp:

\`\`\`
3) test DO -> dung sau 3 buoc: [checkout:XANH, build:XANH, test:DO]
4) deploy khi test do? false (docker+deploy KHONG chay)
\`\`\`

Test đỏ → dừng ngay ở bước 3. Bước đóng gói và triển khai **không bao giờ chạy**. Nghĩa là **code hỏng không thể tới production** — nó bị chặn ở cửa test. Đây là cái *gate* (cổng gác) mà Ngày 57 nói tới, giờ áp cho cả đường tới production:

\`\`\`
5) gate: chi deploy khi MOI buoc truoc XANH
\`\`\`

Không phụ thuộc ai đó nhớ chạy test. Máy gác, và máy không quên.

━━━━━━━━━━━━━━━━━━━━

🌱 VÍ DỤ THẬT: GITHUB ACTIONS

Mở rộng file \`ci.yml\` của Ngày 57 thành một pipeline đầy đủ:

\`\`\`yaml
name: CI/CD
on:
  push:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin', cache: maven }
      - run: mvn --batch-mode verify        # build + test; đỏ là dừng ở đây

  deploy:
    needs: build-test                        # CHỈ chạy nếu build-test XANH
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t blog-api .      # đóng gói (Ngày 94)
      - run: docker push ...                 # đẩy image lên registry
      - run: ssh server "docker compose up -d"   # triển khai
\`\`\`

Chữ \`needs: build-test\` chính là *gate*: job \`deploy\` chỉ chạy khi job \`build-test\` xanh. Đỏ ở test là cả nhánh deploy không đụng tới.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀI ĐIỀU THẬT VỀ CD

Triển khai tự động lên production là con dao hai lưỡi — mạnh nhưng cần cẩn thận:

- **Bí mật (secret) không nằm trong code.** Khoá SSH, mật khẩu registry để trong "secrets" của CI, không commit (Ngày 74). Rò một cái là mất cả máy chủ.
- **Zero-downtime.** Triển khai đừng làm gián đoạn: dựng bản mới, kiểm khoẻ (Ngày 93), rồi mới chuyển sang, tắt bản cũ — không để người dùng thấy trang chết.
- **Có đường lùi.** Bản mới hỏng thì quay lại bản cũ nhanh (rollback). Giữ vài image cũ để lùi được.
- **Cẩn thận chạy trùng.** Hai lần deploy chồng nhau có thể tranh nhau container — nên đảm bảo mỗi lúc chỉ một deploy chạy (một bài học vận hành xương máu).

Nhiều đội bắt đầu bằng **Continuous Delivery** (tự động tới bước *sẵn sàng*, còn nút bấm deploy cuối cùng là người) rồi mới tiến tới **Continuous Deployment** (tự động hoàn toàn) khi đã đủ tin vào bộ test.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`ci.yml\` chạy \`mvn verify\` mỗi lần push (mở rộng từ Ngày 57).
2. Thêm job \`deploy\` với \`needs:\` để nó chỉ chạy khi test xanh.
3. Cố tình làm một test đỏ, xác nhận nhánh deploy không chạy.
4. Đặt khoá triển khai trong "secrets", không commit vào repo.
5. Thêm bước kiểm khoẻ (Ngày 93) sau deploy, coi như "smoke test".

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

CI/CD nối \`git push\` tới production thành một **dây chuyền tự động**: checkout → build → test → đóng gói → triển khai. Quy tắc sống còn là **fail là dừng ngay** — bước nào đỏ thì các bước sau không chạy, nên code hỏng không bao giờ tới được người dùng. Máy gác cổng thay vì trông chờ ai đó nhớ. Nhớ giữ bí mật ngoài code, triển khai zero-downtime, có đường lùi, và đừng để hai deploy chạy trùng.

Dây chuyền của bạn có bước "test". Nhưng suốt Giai đoạn 7 và Ngày 75, test của bạn chủ yếu là **unit test** — kiểm từng mảnh riêng lẻ, giả (mock) mọi thứ xung quanh. Chúng nhanh và nhiều, nhưng có một câu chúng không trả lời được: khi *ghép tất cả lại* — controller thật gọi service thật gọi repository thật xuống CSDL thật — cả luồng có chạy đúng không? Mock có thể che giấu một chỗ hai mảnh không khớp nhau.

Ngày 96: **Kiểm thử tích hợp** — chạy cả ứng dụng với một CSDL thật (Testcontainers dựng Postgres trong Docker chỉ cho lúc test), gọi API đầu-cuối và kiểm cả luồng từ HTTP xuống tận cơ sở dữ liệu. Tấm lưới cuối cùng trước khi tin dây chuyền tự động deploy. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
