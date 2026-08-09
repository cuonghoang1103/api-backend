/** "100 Ngày Java với CuongThai" — Ngày 94: Đóng gói bằng Docker (Blog API).
    Nối đúng chỗ Ngày 93 kết ("chỉ chạy trên MÁY BẠN; đưa lên máy chủ lại 'máy
    tôi chạy được'; Java viết-một-lần-chạy-mọi-nơi vẫn cần đúng JVM + cấu hình").
    Ngày 95 (CI/CD) trỏ ngược về phần kết.

    ⚠ LUẬT 6: Docker là công cụ ngoài, thẻ chạy JDK thuần nên dựng nguyên lý
    image nhiều tầng + cache; thân bài dạy Dockerfile thật. Output là kết quả
    THẬT của javac/java JDK 21. */
export default {
  day: 94,
  card: 'java-day-94',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-custom-gradle-docker-build-task-for-cicd-pipelines',
    title: 'Tác vụ build Docker cho CI/CD',
  },

  content: `📦 100 NGÀY JAVA — NGÀY 94: ĐÓNG GÓI BẰNG DOCKER

Blog của bạn hoàn chỉnh về tính năng lẫn vận hành. Nhưng nó vẫn chỉ chạy được **trên máy bạn** — với đúng phiên bản Java bạn cài, đúng biến môi trường bạn đặt.

Đưa cho đồng nghiệp hay lên máy chủ, câu kinh điển lại vang lên: *"máy tôi chạy được mà"* (nhớ Ngày 57). Java hứa "viết một lần, chạy mọi nơi" — nhưng vẫn cần đúng JVM và đúng cấu hình ở nơi chạy. Docker chấm dứt câu đó vĩnh viễn.

━━━━━━━━━━━━━━━━━━━━

📦 CONTAINER: GÓI CẢ MÔI TRƯỜNG VÀO MỘT HỘP

Ý tưởng của Docker: thay vì "cài Java, cài thư viện, đặt biến môi trường" trên từng máy, ta gói **ứng dụng cùng mọi thứ nó cần** — JVM, thư viện, cấu hình, thậm chí cả hệ điều hành thu nhỏ — vào một **image** (ảnh) bất biến. Máy chủ chỉ cần có Docker là chạy được image đó, y hệt nhau ở mọi nơi:

\`\`\`
4) HET "may toi chay duoc": docker run app -> chay y het o moi may
\`\`\`

Máy bạn, máy đồng nghiệp, máy chủ production — cùng một image nghĩa là cùng JVM, cùng thư viện, cùng cấu hình. Không còn "máy tôi khác máy bạn".

━━━━━━━━━━━━━━━━━━━━

📄 DOCKERFILE: CÔNG THỨC DỰNG IMAGE

Bạn mô tả cách dựng image bằng một \`Dockerfile\` — mỗi dòng là một bước:

\`\`\`dockerfile
FROM eclipse-temurin:21-jre        # nền: JRE 21
WORKDIR /app
COPY target/blog-api.jar app.jar   # chép file jar đã build vào
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

Build thành image rồi chạy:

\`\`\`bash
docker build -t blog-api .
docker run -p 8080:8080 --env-file .env blog-api
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧱 NGUYÊN LÝ CỐT LÕI: IMAGE LÀ CÁC TẦNG + CACHE

Đây là phần đáng hiểu nhất, vì nó quyết định build nhanh hay chậm. Mỗi lệnh trong Dockerfile tạo một **tầng** (layer), xếp chồng lên nhau. Và Docker **cache theo tầng**: tầng nào không đổi thì tái dùng, khỏi làm lại.

\`\`\`
1) image = cac tang xep chong: [base, deps, app]
2) build lan dau -> [base:LAM, deps:LAM, app:LAM] (3 tang lam)
3) sua app -> [base:CACHE, deps:CACHE, app:LAM] (1 tang lam)
\`\`\`

Lần đầu làm cả 3 tầng. Nhưng khi bạn chỉ sửa code (tầng \`app\`), Docker thấy tầng \`base\` và \`deps\` **không đổi** → tái dùng cache → chỉ làm lại tầng \`app\`. Build gần như tức thì.

Nhưng có luật quan trọng: **đổi một tầng làm mất cache của mọi tầng phía dưới nó**:

\`\`\`
4) sua deps -> [base:CACHE, deps:LAM, app:LAM] (2 tang lam)
5) khong doi gi -> 0 tang lam (tat ca CACHE, tuc thi)
\`\`\`

Sửa \`deps\` thì \`deps\` và mọi tầng sau (\`app\`) đều phải làm lại. Không đổi gì thì 0 tầng — dùng cache hết.

━━━━━━━━━━━━━━━━━━━━

🎯 HỆ QUẢ: THỨ TỰ TẦNG QUYẾT ĐỊNH TỐC ĐỘ

Từ luật trên suy ra một mẹo mà mọi Dockerfile Java tốt đều dùng: **xếp tầng ít-đổi lên trên, tầng hay-đổi xuống dưới**.

\`\`\`dockerfile
COPY pom.xml .
RUN mvn dependency:go-offline      # tải thư viện — tầng ÍT đổi
COPY src ./src                     # mã nguồn — tầng HAY đổi
RUN mvn package
\`\`\`

\`\`\`
6) xep tang IT DOI len TREN (COPY pom truoc COPY src) -> tan dung cache
\`\`\`

Vì sao? Thư viện (\`pom.xml\`) ít đổi, còn code (\`src\`) đổi mỗi lần bạn sửa. Nếu \`COPY src\` **trước** rồi mới tải thư viện, thì mỗi lần sửa một dòng code, cache thư viện mất → tải lại toàn bộ thư viện (chậm hàng phút). Đặt \`COPY pom.xml\` + tải thư viện **trước** \`COPY src\` → sửa code chỉ làm lại phần biên dịch, thư viện dùng cache. (Đây đúng là bài học "gần-nhất-thắng" và thứ tự phụ thuộc của Maven, Ngày 56 — áp vào tầng Docker.)

━━━━━━━━━━━━━━━━━━━━

🪶 MULTI-STAGE: IMAGE CUỐI GỌN NHẸ

Một kỹ thuật cuối đáng biết: **build nhiều tầng** (multi-stage). Việc *build* cần cả JDK + Maven (nặng), nhưng việc *chạy* chỉ cần JRE + file jar (nhẹ). Tách làm hai:

\`\`\`dockerfile
FROM maven:3-eclipse-temurin-21 AS build   # tầng build (nặng)
COPY . .
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre                 # image cuối (nhẹ)
COPY --from=build /target/blog-api.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

Image cuối chỉ mang JRE + jar, bỏ lại cả Maven và mã nguồn — nhỏ hơn nhiều, tải nhanh, ít bề mặt tấn công. (Dự án thật thường build image backend và frontend riêng, và build **tuần tự** để không cạn RAM khi biên dịch — một bài học vận hành thực tế.)

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết \`Dockerfile\` gói file jar của blog, \`docker build\` rồi \`docker run\`.
2. Sửa một dòng code, build lại — quan sát các tầng CACHE và tầng làm lại.
3. Đảo thứ tự \`COPY src\` lên trước tải thư viện, thấy cache mất và build chậm đi.
4. Viết multi-stage build, so kích thước image cuối trước/sau.
5. Truyền cấu hình qua \`--env-file\` thay vì nướng vào image (Ngày 74).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Docker gói ứng dụng cùng **mọi thứ nó cần** (JVM, thư viện, cấu hình) vào một image bất biến, chạy y hệt ở mọi máy — chấm dứt "máy tôi chạy được". Image là các **tầng xếp chồng** với **cache theo tầng**: đổi một tầng làm lại tầng đó và mọi tầng sau, nên xếp tầng ít-đổi (thư viện) lên trên tầng hay-đổi (code) để build nhanh. Multi-stage cho image cuối gọn nhẹ.

Giờ bạn đóng gói được ứng dụng thành image. Nhưng ai bấm nút build? Ai chạy test trước khi đóng gói? Ai đẩy image lên máy chủ? Nếu làm tay mỗi lần thì bạn sẽ quên chạy test, quên bước nào đó, hoặc deploy nhầm phiên bản — đúng những sự cố mà một quy trình thủ công luôn mắc.

Ngày 95: **CI/CD** — nối lại thành một dây chuyền tự động: mỗi lần đẩy code, máy chủ tự chạy test (Ngày 57), tự build image Docker (hôm nay), và tự triển khai nếu mọi thứ xanh. Từ \`git push\` tới production mà không ai phải bấm tay. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
