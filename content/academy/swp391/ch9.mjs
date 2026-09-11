/**
 * SWP391 · Chapter 9 (Advanced) — DevOps & Docker deployment.
 * Not required by the Subject/Student Guides (an iteration is submitted as a GitLab
 * tag + DB scripts + demo videos); this chapter shows how to make that tag runnable
 * by anyone in one command, and how GitLab CI can check it.
 * Guide pages used: Slide1 Subject Guides p.6 (submit items) and p.14 (git tags),
 * Slide5 GitLab Guides p.7 (protected branches) and p.28 (branch/tag commands).
 * Stack: Java web (JSP/Servlet on Tomcat) + MySQL 8, optional Spring Boot variant.
 */
import { slide, bi, books } from './_slides.mjs';

const P91 = [];

P91.push(bi(`<span class="eyebrow">Chapter 9 · Lesson 9.1 · Advanced · optional for SWP391</span>
<h2>DevOps &amp; Docker — make every iteration tag runnable in one command</h2>
<p class="lead">The guides ask for a <strong>tagged</strong> iteration on GitLab with its <strong>DB scripts</strong> inside. They do not ask for Docker or CI. Yet the classic demo failure — "it ran on my laptop yesterday" — comes from exactly the gap Docker closes: the tag holds the code, but not the Tomcat, JDK and MySQL it needs. This chapter packs the Java web app and MySQL into containers and lets GitLab CI build and check each tag.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>Explain image, container, registry, volume and network — and what each means for a Java web + MySQL project.</li>
<li>Write a multi-stage <strong>Dockerfile</strong> for a WAR on Tomcat, and a <strong>compose</strong> file that loads your DB scripts automatically.</li>
<li>Write a <strong>.gitlab-ci.yml</strong> that builds and tests every push and packages an image for every iteration tag.</li>
<li>Avoid the traps: secrets in images, <code>localhost</code> inside a container, Tomcat 10 vs <code>javax</code>, table-name case on Linux.</li>
</ul></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Term</th><th>One-line meaning</th><th>In your project</th></tr></thead>
<tbody>
<tr><td>Image</td><td>A read-only package: OS layer + runtime + your app</td><td><code>jbs-app:iter3</code> = Tomcat 10 + JDK 17 + <code>ROOT.war</code></td></tr>
<tr><td>Container</td><td>A running instance of an image</td><td>The app on port 8080, MySQL on 3306</td></tr>
<tr><td>Dockerfile</td><td>The recipe that builds an image</td><td>One file at the repo root</td></tr>
<tr><td>Compose file</td><td>Several containers started together</td><td><code>app</code> + <code>db</code> with one command</td></tr>
<tr><td>Volume</td><td>Storage that survives container restarts</td><td>MySQL data folder</td></tr>
<tr><td>Registry</td><td>A store for images</td><td>GitLab Container Registry of your repo</td></tr>
<tr><td>CI/CD pipeline</td><td>Jobs that run automatically on push / tag</td><td><code>.gitlab-ci.yml</code>: build → test → package</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chapter 6 covered building and staging the app by hand; here the same steps become files in the repo. Ask your teacher before relying on Docker for the final presentation — the room machine may not have it, so keep a plain NetBeans + MySQL run as a fallback.</p>`,
`<span class="eyebrow">Chương 9 · Bài 9.1 · Nâng cao · không bắt buộc trong SWP391</span>
<h2>DevOps &amp; Docker — để mọi tag iteration chạy được bằng một lệnh</h2>
<p class="lead">Guide yêu cầu một iteration được <strong>gắn tag</strong> trên GitLab, có <strong>DB script</strong> nằm trong đó. Guide không đòi Docker hay CI. Nhưng lỗi demo kinh điển — "hôm qua còn chạy trên laptop em" — đến đúng từ khoảng trống mà Docker lấp: tag giữ code, nhưng không giữ Tomcat, JDK và MySQL mà code cần. Chương này đóng gói app Java web và MySQL vào container, và để GitLab CI build, kiểm tra từng tag.</p>
<div class="callout"><strong>Mục tiêu bài học.</strong>
<ul>
<li>Giải thích image, container, registry, volume và network — và ý nghĩa của từng thứ với dự án Java web + MySQL.</li>
<li>Viết <strong>Dockerfile</strong> multi-stage cho file WAR chạy trên Tomcat, và file <strong>compose</strong> tự nạp DB script của nhóm.</li>
<li>Viết <strong>.gitlab-ci.yml</strong> build và test mỗi lần push, đóng gói image cho mỗi tag iteration.</li>
<li>Tránh bẫy: bí mật trong image, <code>localhost</code> bên trong container, Tomcat 10 và <code>javax</code>, chữ hoa/thường tên bảng trên Linux.</li>
</ul></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Thuật ngữ</th><th>Nghĩa một dòng</th><th>Trong dự án của bạn</th></tr></thead>
<tbody>
<tr><td>Image</td><td>Gói chỉ đọc: lớp OS + runtime + app của bạn</td><td><code>jbs-app:iter3</code> = Tomcat 10 + JDK 17 + <code>ROOT.war</code></td></tr>
<tr><td>Container</td><td>Một bản đang chạy của image</td><td>App ở cổng 8080, MySQL ở 3306</td></tr>
<tr><td>Dockerfile</td><td>Công thức để build image</td><td>Một file ở gốc repo</td></tr>
<tr><td>Compose file</td><td>Nhiều container khởi động cùng nhau</td><td><code>app</code> + <code>db</code> bằng một lệnh</td></tr>
<tr><td>Volume</td><td>Vùng lưu trữ sống sót qua các lần khởi động lại</td><td>Thư mục dữ liệu của MySQL</td></tr>
<tr><td>Registry</td><td>Kho chứa image</td><td>GitLab Container Registry của repo</td></tr>
<tr><td>Pipeline CI/CD</td><td>Các job tự chạy khi push / gắn tag</td><td><code>.gitlab-ci.yml</code>: build → test → package</td></tr>
</tbody>
</table>
<p class="ghi-chu">Chương 6 đã build và đưa app lên staging bằng tay; ở đây chính các bước đó trở thành file trong repo. Hỏi giảng viên trước khi dựa vào Docker cho buổi thuyết trình cuối kỳ — máy phòng thi có thể không cài, nên luôn giữ cách chạy thường bằng NetBeans + MySQL để dự phòng.</p>`));

P91.push(bi(`<h2>📑 Four guide slides that Docker and CI build on</h2>
<p>Docker is not in the decks, but these pages define what a "release" is in SWP391 — the thing a pipeline should build.</p>`,
`<h2>📑 Bốn slide trong guide mà Docker và CI dựa lên</h2>
<p>Docker không có trong các bộ slide, nhưng các trang này định nghĩa thế nào là một "bản phát hành" trong SWP391 — chính là thứ pipeline cần build.</p>`));

P91.push(slide('g-subject', 6, 'Iteration Submit Items',
`<p class="y-chinh">🎯 Each iteration is delivered as a tagged source tree that already contains its DB scripts — a perfect input for a container build.</p>
<p class="nhan">What the page asks for</p>
<ul>
<li><strong>Project Tracking + RDS</strong> — status and specs of the iteration.</li>
<li><strong>Demo videos</strong> — one per member.</li>
<li><strong>Tagged source code</strong> — with the iteration's DB scripts and other config added to the tag.</li>
</ul>
<p class="nhan">What Docker adds</p>
<ul>
<li><strong>Environment in the tag</strong> — Dockerfile + compose file make Tomcat, JDK and MySQL part of the tagged release.</li>
<li><strong>DB scripts run themselves</strong> — compose loads them into a fresh MySQL on first start.</li>
<li><strong>Anyone can run it</strong> — the teacher, a new member, or you on the presentation day: <code>docker compose up</code>.</li>
</ul>`,
`<p class="y-chinh">🎯 Mỗi iteration được bàn giao dưới dạng cây source có gắn tag, đã chứa sẵn DB script — đầu vào lý tưởng để build container.</p>
<p class="nhan">Trang này yêu cầu gì</p>
<ul>
<li><strong>Project Tracking + RDS</strong> — trạng thái và đặc tả của iteration.</li>
<li><strong>Video demo</strong> — mỗi thành viên một video.</li>
<li><strong>Source code đã gắn tag</strong> — kèm DB script và cấu hình khác của iteration nằm trong tag.</li>
</ul>
<p class="nhan">Docker bổ sung gì</p>
<ul>
<li><strong>Môi trường nằm trong tag</strong> — Dockerfile + file compose biến Tomcat, JDK và MySQL thành một phần của bản phát hành.</li>
<li><strong>DB script tự chạy</strong> — compose nạp chúng vào một MySQL mới ở lần khởi động đầu.</li>
<li><strong>Ai cũng chạy được</strong> — giảng viên, thành viên mới, hay chính bạn hôm thuyết trình: <code>docker compose up</code>.</li>
</ul>`));

P91.push(slide('g-subject', 14, 'Manage git tags',
`<p class="y-chinh">🎯 A tag freezes one commit as "the iteration"; it is the natural trigger for building a release image.</p>
<p class="nhan">On this GitLab page</p>
<ol>
<li><strong>Tag name</strong> — e.g. <code>iter1</code>, <code>iter2</code>, <code>iter3</code> (agree one naming pattern as a team).</li>
<li><strong>Create from</strong> — normally <code>main</code>, after the last merge of the iteration.</li>
<li><strong>Message</strong> — filled = annotated tag; blank = lightweight tag.</li>
<li><strong>Release notes</strong> — optional; files can be attached.</li>
</ol>
<p class="nhan">Link to CI</p>
<ul>
<li><strong>Pipeline on tag</strong> — a job with <code>rules: - if: $CI_COMMIT_TAG</code> runs only when a tag is created and names the image after it (<code>jbs-app:iter2</code>).</li>
<li><strong>Tag URL</strong> — the page's tip "copy tag URL" gives the link you submit; the matching image carries the same name.</li>
</ul>`,
`<p class="y-chinh">🎯 Tag đóng băng một commit thành "bản iteration"; đó là điểm kích hoạt tự nhiên để build image phát hành.</p>
<p class="nhan">Trên trang GitLab này</p>
<ol>
<li><strong>Tag name</strong> — ví dụ <code>iter1</code>, <code>iter2</code>, <code>iter3</code> (cả nhóm thống nhất một kiểu đặt tên).</li>
<li><strong>Create from</strong> — thường là <code>main</code>, sau lần merge cuối của iteration.</li>
<li><strong>Message</strong> — có nội dung = annotated tag; để trống = lightweight tag.</li>
<li><strong>Release notes</strong> — tuỳ chọn; có thể đính kèm file.</li>
</ol>
<p class="nhan">Nối với CI</p>
<ul>
<li><strong>Pipeline theo tag</strong> — job có <code>rules: - if: $CI_COMMIT_TAG</code> chỉ chạy khi tạo tag và đặt tên image theo tag (<code>jbs-app:iter2</code>).</li>
<li><strong>URL của tag</strong> — mẹo "copy tag URL" trên trang cho bạn link để nộp; image tương ứng mang cùng tên.</li>
</ul>`));

P91.push(slide('g-git', 7, 'Protect Branches',
`<p class="y-chinh">🎯 Developers push, only Maintainers merge into <code>main</code> and <code>iter*</code> — add "pipeline must succeed" and a broken build can never reach a tag.</p>
<p class="nhan">The setting on the slide</p>
<ul>
<li><strong>Path</strong> — Project → Settings → Repository → Protected branches.</li>
<li><strong><code>main</code> and <code>iter*</code></strong> — allowed to merge: Maintainers; allowed to push: Developers + Maintainers; force push: off.</li>
<li><strong>Wildcard</strong> — <code>iter*</code> protects every iteration branch at once.</li>
</ul>
<p class="nhan">Adding CI on top</p>
<ol>
<li>Commit a <code>.gitlab-ci.yml</code> (below) so every push runs build + test.</li>
<li>Settings → Merge requests → tick <strong>"Pipelines must succeed"</strong>.</li>
<li>Now the leader (Maintainer) cannot merge a red merge request by accident.</li>
</ol>`,
`<p class="y-chinh">🎯 Developer được push, chỉ Maintainer được merge vào <code>main</code> và <code>iter*</code> — thêm "pipeline phải xanh" là bản build hỏng không bao giờ lọt tới tag.</p>
<p class="nhan">Thiết lập trên slide</p>
<ul>
<li><strong>Đường dẫn</strong> — Project → Settings → Repository → Protected branches.</li>
<li><strong><code>main</code> và <code>iter*</code></strong> — được merge: Maintainers; được push: Developers + Maintainers; force push: tắt.</li>
<li><strong>Wildcard</strong> — <code>iter*</code> bảo vệ mọi nhánh iteration cùng lúc.</li>
</ul>
<p class="nhan">Thêm CI lên trên</p>
<ol>
<li>Commit một file <code>.gitlab-ci.yml</code> (bên dưới) để mỗi lần push đều chạy build + test.</li>
<li>Settings → Merge requests → tích <strong>"Pipelines must succeed"</strong>.</li>
<li>Từ đó leader (Maintainer) không thể lỡ tay merge một merge request đang đỏ.</li>
</ol>`));

P91.push(slide('g-git', 28, 'Common branch commands',
`<p class="y-chinh">🎯 The branch and tag commands you need every iteration — with one typo to fix: the tag message flag is <code>-m</code>, not <code>-l</code>.</p>
<p class="nhan">Commands on the slide</p>
<ul>
<li><strong><code>git branch -a</code></strong> — all branches, current one marked.</li>
<li><strong><code>git checkout -b br_name</code></strong> — create a branch and switch to it.</li>
<li><strong><code>git log --oneline</code></strong> — compact history.</li>
<li><strong><code>git merge br_name</code></strong> — merge into the current branch.</li>
<li><strong><code>git branch -d br_name</code></strong> — delete locally; <code>git push origin -d br_name</code> deletes the remote one.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The tag line.</strong> The slide writes <code>git tag -a tag_name -l "tag notes"</code>; <code>-l</code> means <em>list</em>. Use <code>git tag -a iter2 -m "Iteration 2 release"</code> then <code>git push origin iter2</code> — a tag is not pushed by a plain <code>git push</code>.</div>`,
`<p class="y-chinh">🎯 Các lệnh nhánh và tag cần dùng mỗi iteration — kèm một lỗi gõ cần sửa: cờ ghi chú của tag là <code>-m</code>, không phải <code>-l</code>.</p>
<p class="nhan">Các lệnh trên slide</p>
<ul>
<li><strong><code>git branch -a</code></strong> — mọi nhánh, đánh dấu nhánh hiện tại.</li>
<li><strong><code>git checkout -b br_name</code></strong> — tạo nhánh và chuyển sang nó.</li>
<li><strong><code>git log --oneline</code></strong> — lịch sử gọn.</li>
<li><strong><code>git merge br_name</code></strong> — merge vào nhánh hiện tại.</li>
<li><strong><code>git branch -d br_name</code></strong> — xoá ở local; <code>git push origin -d br_name</code> xoá nhánh trên remote.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Dòng lệnh tag.</strong> Slide ghi <code>git tag -a tag_name -l "tag notes"</code>; <code>-l</code> nghĩa là <em>liệt kê</em>. Hãy dùng <code>git tag -a iter2 -m "Iteration 2 release"</code> rồi <code>git push origin iter2</code> — <code>git push</code> thường không đẩy tag lên.</div>`));

P91.push(bi(`<h2>🐳 Step 1 — a Dockerfile for a Java web app (WAR on Tomcat)</h2>
<p class="nhan">Multi-stage: build with Maven, run on Tomcat</p>
<pre># ---- stage 1: build the WAR ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B dependency:go-offline      # cached until pom.xml changes
COPY src ./src
RUN mvn -B -DskipTests package        # -&gt; target/jbs.war

# ---- stage 2: run it ----
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /src/target/jbs.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080</pre>
<ul>
<li><strong>Two stages</strong> — Maven and the source stay in stage 1; the final image holds only Tomcat + the WAR, so it is smaller.</li>
<li><strong>COPY pom.xml first</strong> — Docker caches each layer; dependencies download again only when <code>pom.xml</code> changes.</li>
<li><strong>ROOT.war</strong> — the app answers at <code>http://localhost:8080/</code> instead of <code>/jbs/</code>.</li>
</ul>
<p class="nhan">NetBeans "Java with Ant" project instead of Maven</p>
<ul>
<li><strong>Build in NetBeans</strong> (Clean and Build) → <code>dist/JBS.war</code>, then a one-stage image: <code>FROM tomcat:10.1-jdk17-temurin</code> + <code>COPY dist/JBS.war /usr/local/tomcat/webapps/ROOT.war</code>.</li>
<li><strong>For CI</strong> — Ant projects depend on NetBeans library paths; creating the project as "Java with Maven → Web Application" makes CI far easier. Decide in iteration 1.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Tomcat 10 vs <code>javax</code>.</strong> Tomcat 10+ uses the <code>jakarta.servlet</code> package; code importing <code>javax.servlet</code> compiles but every servlet returns 404/500. Match the image to your code: Tomcat 10.1 for <code>jakarta.*</code>, Tomcat 9 for <code>javax.*</code>.</div>
<p class="nhan">Spring Boot variant (if your teacher agreed on it)</p>
<pre>FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</pre>`,
`<h2>🐳 Bước 1 — Dockerfile cho app Java web (WAR trên Tomcat)</h2>
<p class="nhan">Multi-stage: build bằng Maven, chạy trên Tomcat</p>
<pre># ---- stage 1: build file WAR ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B dependency:go-offline      # được cache tới khi pom.xml đổi
COPY src ./src
RUN mvn -B -DskipTests package        # -&gt; target/jbs.war

# ---- stage 2: chạy ----
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /src/target/jbs.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080</pre>
<ul>
<li><strong>Hai stage</strong> — Maven và source nằm lại ở stage 1; image cuối chỉ có Tomcat + WAR nên nhỏ hơn.</li>
<li><strong>COPY pom.xml trước</strong> — Docker cache từng layer; thư viện chỉ tải lại khi <code>pom.xml</code> đổi.</li>
<li><strong>ROOT.war</strong> — app trả lời ở <code>http://localhost:8080/</code> thay vì <code>/jbs/</code>.</li>
</ul>
<p class="nhan">Dự án NetBeans "Java with Ant" thay cho Maven</p>
<ul>
<li><strong>Build trong NetBeans</strong> (Clean and Build) → <code>dist/JBS.war</code>, rồi image một stage: <code>FROM tomcat:10.1-jdk17-temurin</code> + <code>COPY dist/JBS.war /usr/local/tomcat/webapps/ROOT.war</code>.</li>
<li><strong>Cho CI</strong> — dự án Ant phụ thuộc đường dẫn thư viện của NetBeans; tạo dự án kiểu "Java with Maven → Web Application" giúp CI dễ hơn nhiều. Quyết định ngay ở iteration 1.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Tomcat 10 và <code>javax</code>.</strong> Tomcat 10+ dùng package <code>jakarta.servlet</code>; code import <code>javax.servlet</code> vẫn biên dịch được nhưng mọi servlet trả 404/500. Chọn image khớp code: Tomcat 10.1 cho <code>jakarta.*</code>, Tomcat 9 cho <code>javax.*</code>.</div>
<p class="nhan">Biến thể Spring Boot (nếu giảng viên đồng ý stack này)</p>
<pre>FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</pre>`));

P91.push(bi(`<h2>🧩 Step 2 — compose: the app + MySQL 8 + your DB scripts</h2>
<pre># docker-compose.yml (repo root)
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: jbs
      MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}      # read from .env, never committed
      TZ: Asia/Ho_Chi_Minh
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - dbdata:/var/lib/mysql
      - ./db/JBS6_Database.sql:/docker-entrypoint-initdb.d/1_schema.sql:ro
      - ./db/JBS6_DemoData.sql:/docker-entrypoint-initdb.d/2_data.sql:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1"]
      interval: 5s
      retries: 30
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      DB_URL: jdbc:mysql://db:3306/jbs?useSSL=false&amp;allowPublicKeyRetrieval=true&amp;characterEncoding=UTF-8
      DB_USER: root
      DB_PASSWORD: \${DB_PASSWORD}
      TZ: Asia/Ho_Chi_Minh
    depends_on:
      db:
        condition: service_healthy
volumes:
  dbdata:</pre>
<p class="nhan">Line by line — what matters</p>
<ul>
<li><strong><code>docker-entrypoint-initdb.d</code></strong> — MySQL runs these scripts in name order on the <em>first</em> start with an empty volume. The iteration's DB scripts become the demo database automatically.</li>
<li><strong><code>db</code> in the JDBC URL</strong> — inside the network the service name is the host name. <code>localhost</code> would mean the app container itself.</li>
<li><strong><code>healthcheck</code> + <code>service_healthy</code></strong> — the app starts only when MySQL answers over TCP (not while the init scripts are still running).</li>
<li><strong><code>allowPublicKeyRetrieval=true</code></strong> — needed by Connector/J with MySQL 8's default login plugin when SSL is off.</li>
<li><strong><code>utf8mb4</code></strong> — Vietnamese text stores and sorts correctly.</li>
</ul>
<p class="nhan">Step 3 — read the connection from the environment</p>
<pre>public class DBContext {
    private static String env(String k, String def) {
        String v = System.getenv(k);
        return (v == null || v.isBlank()) ? def : v;
    }
    private static final String URL  = env("DB_URL",
        "jdbc:mysql://localhost:3306/jbs?useSSL=false&amp;allowPublicKeyRetrieval=true");
    private static final String USER = env("DB_USER", "root");
    private static final String PASS = env("DB_PASSWORD", "");

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}</pre>
<p>The same code runs in NetBeans (defaults → your local MySQL) and in the container (values from compose). No password is written in the source.</p>
<pre># .env.example  (committed)          # .env  (in .gitignore, never committed)
DB_PASSWORD=change-me                 DB_PASSWORD=&lt;your local password&gt;</pre>`,
`<h2>🧩 Bước 2 — compose: app + MySQL 8 + DB script của nhóm</h2>
<pre># docker-compose.yml (gốc repo)
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: jbs
      MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}      # đọc từ .env, không bao giờ commit
      TZ: Asia/Ho_Chi_Minh
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - dbdata:/var/lib/mysql
      - ./db/JBS6_Database.sql:/docker-entrypoint-initdb.d/1_schema.sql:ro
      - ./db/JBS6_DemoData.sql:/docker-entrypoint-initdb.d/2_data.sql:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1"]
      interval: 5s
      retries: 30
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      DB_URL: jdbc:mysql://db:3306/jbs?useSSL=false&amp;allowPublicKeyRetrieval=true&amp;characterEncoding=UTF-8
      DB_USER: root
      DB_PASSWORD: \${DB_PASSWORD}
      TZ: Asia/Ho_Chi_Minh
    depends_on:
      db:
        condition: service_healthy
volumes:
  dbdata:</pre>
<p class="nhan">Từng dòng — điều quan trọng</p>
<ul>
<li><strong><code>docker-entrypoint-initdb.d</code></strong> — MySQL chạy các script này theo thứ tự tên ở lần khởi động <em>đầu tiên</em> với volume trống. DB script của iteration tự trở thành CSDL demo.</li>
<li><strong><code>db</code> trong JDBC URL</strong> — trong network, tên service chính là tên host. <code>localhost</code> sẽ là chính container app.</li>
<li><strong><code>healthcheck</code> + <code>service_healthy</code></strong> — app chỉ khởi động khi MySQL trả lời qua TCP (không phải lúc script init còn đang chạy).</li>
<li><strong><code>allowPublicKeyRetrieval=true</code></strong> — Connector/J cần khi dùng plugin đăng nhập mặc định của MySQL 8 mà tắt SSL.</li>
<li><strong><code>utf8mb4</code></strong> — chữ tiếng Việt lưu và sắp xếp đúng.</li>
</ul>
<p class="nhan">Bước 3 — đọc kết nối từ biến môi trường</p>
<pre>public class DBContext {
    private static String env(String k, String def) {
        String v = System.getenv(k);
        return (v == null || v.isBlank()) ? def : v;
    }
    private static final String URL  = env("DB_URL",
        "jdbc:mysql://localhost:3306/jbs?useSSL=false&amp;allowPublicKeyRetrieval=true");
    private static final String USER = env("DB_USER", "root");
    private static final String PASS = env("DB_PASSWORD", "");

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}</pre>
<p>Cùng một đoạn code chạy được trong NetBeans (giá trị mặc định → MySQL trên máy bạn) và trong container (giá trị từ compose). Không có mật khẩu nào nằm trong source.</p>
<pre># .env.example  (có commit)          # .env  (trong .gitignore, không commit)
DB_PASSWORD=change-me                 DB_PASSWORD=&lt;mật khẩu local của bạn&gt;</pre>`));

P91.push(bi(`<h2>⚙️ Step 4 — GitLab CI: build and test every push, package every tag</h2>
<pre># .gitlab-ci.yml (repo root)
stages: [build, test, package]

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
cache:
  paths: [.m2/repository]

build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn -B -DskipTests package
  artifacts:
    paths: [target/*.war]

test:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  services:
    - name: mysql:8.0
      alias: db
  variables:
    MYSQL_DATABASE: jbs_test
    MYSQL_ROOT_PASSWORD: $TEST_DB_PASSWORD      # Settings → CI/CD → Variables (masked)
    DB_URL: "jdbc:mysql://db:3306/jbs_test?useSSL=false&amp;allowPublicKeyRetrieval=true"
    DB_PASSWORD: $TEST_DB_PASSWORD
  script:
    - mvn -B test

package:
  stage: package
  image: docker:27
  services: [docker:27-dind]
  rules:
    - if: $CI_COMMIT_TAG                         # only for iter1 / iter2 / iter3 tags
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_TAG" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_TAG"</pre>
<p class="nhan">What each job gives the team</p>
<ul>
<li><strong>build</strong> — a push that does not compile turns red within minutes, not on demo day.</li>
<li><strong>test</strong> — runs JUnit tests against a throw-away MySQL (<code>services</code>); tests that need tables create them from the schema script.</li>
<li><strong>package</strong> — runs only for a tag and pushes <code>…/jbs-app:iter2</code> to the repo's Container Registry: the image and the submitted tag carry the same name.</li>
</ul>
<p class="nhan">Variables GitLab gives you for free</p>
<ul>
<li><strong><code>CI_COMMIT_TAG</code></strong> — the tag name, empty on normal pushes.</li>
<li><strong><code>CI_REGISTRY</code>, <code>CI_REGISTRY_IMAGE</code>, <code>CI_REGISTRY_USER</code>, <code>CI_REGISTRY_PASSWORD</code></strong> — login and address of the project's registry.</li>
<li><strong>Your own</strong> (<code>TEST_DB_PASSWORD</code>) — add in Settings → CI/CD → Variables, tick <em>Masked</em> so it never prints in logs.</li>
</ul>
<div class="pitfall">GitLab.com may ask the account to be verified before shared runners run jobs, and free minutes are limited. If the pipeline stays "pending", ask the teacher — a team laptop can register its own runner, or you run the same three commands by hand.</div>`,
`<h2>⚙️ Bước 4 — GitLab CI: build và test mỗi lần push, đóng gói mỗi tag</h2>
<pre># .gitlab-ci.yml (gốc repo)
stages: [build, test, package]

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
cache:
  paths: [.m2/repository]

build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn -B -DskipTests package
  artifacts:
    paths: [target/*.war]

test:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  services:
    - name: mysql:8.0
      alias: db
  variables:
    MYSQL_DATABASE: jbs_test
    MYSQL_ROOT_PASSWORD: $TEST_DB_PASSWORD      # Settings → CI/CD → Variables (masked)
    DB_URL: "jdbc:mysql://db:3306/jbs_test?useSSL=false&amp;allowPublicKeyRetrieval=true"
    DB_PASSWORD: $TEST_DB_PASSWORD
  script:
    - mvn -B test

package:
  stage: package
  image: docker:27
  services: [docker:27-dind]
  rules:
    - if: $CI_COMMIT_TAG                         # chỉ cho tag iter1 / iter2 / iter3
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_TAG" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_TAG"</pre>
<p class="nhan">Mỗi job mang lại gì cho nhóm</p>
<ul>
<li><strong>build</strong> — lần push không biên dịch được sẽ đỏ sau vài phút, chứ không phải đúng ngày demo.</li>
<li><strong>test</strong> — chạy JUnit với một MySQL dùng xong bỏ (<code>services</code>); test nào cần bảng thì tự tạo từ script schema.</li>
<li><strong>package</strong> — chỉ chạy khi có tag và đẩy <code>…/jbs-app:iter2</code> lên Container Registry của repo: image và tag đã nộp mang cùng tên.</li>
</ul>
<p class="nhan">Biến GitLab cấp sẵn</p>
<ul>
<li><strong><code>CI_COMMIT_TAG</code></strong> — tên tag, rỗng ở các lần push thường.</li>
<li><strong><code>CI_REGISTRY</code>, <code>CI_REGISTRY_IMAGE</code>, <code>CI_REGISTRY_USER</code>, <code>CI_REGISTRY_PASSWORD</code></strong> — thông tin đăng nhập và địa chỉ registry của project.</li>
<li><strong>Biến của bạn</strong> (<code>TEST_DB_PASSWORD</code>) — thêm ở Settings → CI/CD → Variables, tích <em>Masked</em> để không bao giờ hiện trong log.</li>
</ul>
<div class="pitfall">GitLab.com có thể yêu cầu xác minh tài khoản trước khi shared runner chạy job, và số phút miễn phí có giới hạn. Nếu pipeline cứ "pending", hỏi giảng viên — một laptop của nhóm có thể đăng ký runner riêng, hoặc chạy tay đúng ba lệnh đó.</div>`));

P91.push(bi(`<h2>🛠️ Worked example — the Job Board System, tag iter3, in one command</h2>
<p class="nhan">1. The repo after this chapter</p>
<pre>jbs/
├── pom.xml
├── src/main/java/...          controller/, dal/, model/, filter/, util/DBContext.java
├── src/main/webapp/...        JSP pages, AdminLTE assets
├── db/JBS6_Database.sql       schema  (loaded first: 1_schema.sql)
├── db/JBS6_DemoData.sql       demo data (loaded second: 2_data.sql)
├── Dockerfile
├── docker-compose.yml
├── .gitlab-ci.yml
├── .env.example               committed — shows which variables exist
├── .gitignore                 contains: .env  target/  nbproject/private/
└── .dockerignore              contains: .git  target/  .env</pre>
<p class="nhan">2. Run it — on any machine with Docker</p>
<ol>
<li><code>git clone … &amp;&amp; git checkout iter3</code> — exactly the submitted tag.</li>
<li><code>cp .env.example .env</code> and set <code>DB_PASSWORD</code>.</li>
<li><code>docker compose up -d --build</code> — builds the WAR, starts MySQL, loads both scripts, starts Tomcat.</li>
<li><code>docker compose ps</code> — <code>db</code> shows <em>healthy</em>, <code>app</code> shows <em>running</em>.</li>
<li>Open <code>http://localhost:8080/</code> and log in with a demo account from <code>JBS6_DemoData.sql</code>.</li>
<li><code>docker compose logs -f app</code> — Tomcat log when something fails.</li>
</ol>
<p class="nhan">3. Reset before a demo video or the presentation</p>
<ul>
<li><strong><code>docker compose down</code></strong> — stops containers, keeps the data.</li>
<li><strong><code>docker compose down -v</code></strong> — also deletes the volume; the next <code>up</code> reloads both scripts: a clean demo database in about a minute.</li>
</ul>
<h3>Troubleshooting — symptom → cause → fix</h3>
<table>
<thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>Communications link failure</code></td><td>JDBC URL says <code>localhost</code>, or MySQL not ready yet</td><td>Host <code>db</code>; <code>depends_on … service_healthy</code></td></tr>
<tr><td><code>Table 'jbs.Users' doesn't exist</code> — works on Windows</td><td>Table names are case-sensitive on Linux; the script created <code>users</code></td><td>Use one spelling (lowercase) in SQL scripts and DAO code</td></tr>
<tr><td>Vietnamese shows as <code>???</code></td><td>Tables or connection not utf8mb4</td><td>Server flags in compose + <code>characterEncoding=UTF-8</code> + <code>DEFAULT CHARSET=utf8mb4</code> in the script</td></tr>
<tr><td>Every servlet 404 / 500</td><td><code>javax.servlet</code> code on Tomcat 10</td><td>Tomcat 9 image, or migrate to <code>jakarta.*</code></td></tr>
<tr><td>Edited SQL script has no effect</td><td>Init scripts run only on an empty volume</td><td><code>docker compose down -v</code>, then <code>up</code></td></tr>
<tr><td><code>port is already allocated</code></td><td>A local MySQL / Tomcat already uses 3306 / 8080</td><td>Stop it, or map <code>"8081:8080"</code>; the db needs no published port</td></tr>
<tr><td>Times are 7 hours off</td><td>Containers run in UTC</td><td><code>TZ: Asia/Ho_Chi_Minh</code> on both services, or store UTC and convert on display</td></tr>
</tbody>
</table>`,
`<h2>🛠️ Ví dụ có lời giải — Job Board System, tag iter3, chạy bằng một lệnh</h2>
<p class="nhan">1. Repo sau chương này</p>
<pre>jbs/
├── pom.xml
├── src/main/java/...          controller/, dal/, model/, filter/, util/DBContext.java
├── src/main/webapp/...        trang JSP, tài nguyên AdminLTE
├── db/JBS6_Database.sql       schema  (nạp trước: 1_schema.sql)
├── db/JBS6_DemoData.sql       dữ liệu demo (nạp sau: 2_data.sql)
├── Dockerfile
├── docker-compose.yml
├── .gitlab-ci.yml
├── .env.example               có commit — cho biết có những biến nào
├── .gitignore                 chứa: .env  target/  nbproject/private/
└── .dockerignore              chứa: .git  target/  .env</pre>
<p class="nhan">2. Chạy — trên bất kỳ máy nào có Docker</p>
<ol>
<li><code>git clone … &amp;&amp; git checkout iter3</code> — đúng tag đã nộp.</li>
<li><code>cp .env.example .env</code> rồi đặt <code>DB_PASSWORD</code>.</li>
<li><code>docker compose up -d --build</code> — build WAR, khởi động MySQL, nạp hai script, khởi động Tomcat.</li>
<li><code>docker compose ps</code> — <code>db</code> báo <em>healthy</em>, <code>app</code> báo <em>running</em>.</li>
<li>Mở <code>http://localhost:8080/</code> và đăng nhập bằng tài khoản demo trong <code>JBS6_DemoData.sql</code>.</li>
<li><code>docker compose logs -f app</code> — xem log Tomcat khi có lỗi.</li>
</ol>
<p class="nhan">3. Làm sạch trước khi quay video demo hay thuyết trình</p>
<ul>
<li><strong><code>docker compose down</code></strong> — dừng container, giữ dữ liệu.</li>
<li><strong><code>docker compose down -v</code></strong> — xoá luôn volume; lần <code>up</code> sau nạp lại hai script: CSDL demo sạch trong khoảng một phút.</li>
</ul>
<h3>Xử lý sự cố — triệu chứng → nguyên nhân → cách sửa</h3>
<table>
<thead><tr><th>Triệu chứng</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>Communications link failure</code></td><td>JDBC URL ghi <code>localhost</code>, hoặc MySQL chưa sẵn sàng</td><td>Host <code>db</code>; <code>depends_on … service_healthy</code></td></tr>
<tr><td><code>Table 'jbs.Users' doesn't exist</code> — trên Windows vẫn chạy</td><td>Tên bảng phân biệt hoa/thường trên Linux; script tạo bảng <code>users</code></td><td>Dùng một cách viết (chữ thường) trong cả SQL script lẫn code DAO</td></tr>
<tr><td>Tiếng Việt hiện <code>???</code></td><td>Bảng hoặc kết nối không phải utf8mb4</td><td>Cờ server trong compose + <code>characterEncoding=UTF-8</code> + <code>DEFAULT CHARSET=utf8mb4</code> trong script</td></tr>
<tr><td>Mọi servlet 404 / 500</td><td>Code <code>javax.servlet</code> chạy trên Tomcat 10</td><td>Dùng image Tomcat 9, hoặc chuyển sang <code>jakarta.*</code></td></tr>
<tr><td>Sửa SQL script mà không có tác dụng</td><td>Script init chỉ chạy khi volume trống</td><td><code>docker compose down -v</code>, rồi <code>up</code></td></tr>
<tr><td><code>port is already allocated</code></td><td>MySQL / Tomcat trên máy đã chiếm 3306 / 8080</td><td>Tắt nó, hoặc map <code>"8081:8080"</code>; service db không cần mở cổng ra ngoài</td></tr>
<tr><td>Giờ lệch 7 tiếng</td><td>Container chạy giờ UTC</td><td><code>TZ: Asia/Ho_Chi_Minh</code> cho cả hai service, hoặc lưu UTC và đổi khi hiển thị</td></tr>
</tbody>
</table>`));

P91.push(bi(`<h2>✅ Checklist — before you tag an iteration</h2>
<ol>
<li><code>docker compose down -v &amp;&amp; docker compose up -d --build</code> works from a fresh clone of the tag.</li>
<li>The pipeline of the last commit on <code>main</code> is green.</li>
<li>No password, token or <code>.env</code> in the repo or in the image (<code>git log -p</code> must not show one either).</li>
<li>The DB scripts inside the tag are the ones the demo videos used.</li>
<li>A plain NetBeans + local MySQL run still works (fallback for the presentation room).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Secrets live forever.</strong> A password written into a Dockerfile (<code>ENV DB_PASSWORD=…</code>) stays in the image layers; one committed to Git stays in history even after you delete the line. Rotate it, then pass secrets only at run time.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The twelve-factor app and a safer image.</strong>
<ul>
<li><strong>Config in the environment</strong> — exactly what <code>DBContext</code> now does.</li>
<li><strong>Build, release, run as separate stages</strong> — the pipeline builds once; the tagged image is the release; compose runs it.</li>
<li><strong>Stateless processes</strong> — keep data in MySQL, not in server memory, so two copies of the app can run.</li>
<li><strong>Dev/prod parity</strong> — the same image on a laptop and on a server.</li>
<li><strong>Image hygiene</strong> — the official Tomcat image runs as root; production teams add a non-root <code>USER</code>, pin image versions and scan images for known vulnerabilities.</li>
</ul>
Naming two of these in the presentation — and showing where your repo follows them — answers the "design" questions with evidence.</div>`,
`<h2>✅ Checklist — trước khi gắn tag một iteration</h2>
<ol>
<li><code>docker compose down -v &amp;&amp; docker compose up -d --build</code> chạy được từ một bản clone mới của tag.</li>
<li>Pipeline của commit cuối trên <code>main</code> đang xanh.</li>
<li>Không có mật khẩu, token hay <code>.env</code> trong repo hoặc trong image (<code>git log -p</code> cũng không được lộ).</li>
<li>DB script trong tag đúng là bản mà các video demo đã dùng.</li>
<li>Cách chạy thường bằng NetBeans + MySQL local vẫn chạy (dự phòng cho phòng thuyết trình).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bí mật sống mãi.</strong> Mật khẩu ghi vào Dockerfile (<code>ENV DB_PASSWORD=…</code>) nằm lại trong các layer của image; mật khẩu đã commit lên Git nằm lại trong lịch sử kể cả khi bạn xoá dòng đó. Hãy đổi mật khẩu, rồi chỉ truyền bí mật lúc chạy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Ứng dụng twelve-factor và image an toàn hơn.</strong>
<ul>
<li><strong>Cấu hình nằm trong môi trường</strong> — đúng điều <code>DBContext</code> đang làm.</li>
<li><strong>Build, release, run là các giai đoạn tách biệt</strong> — pipeline build một lần; image gắn tag là bản phát hành; compose chạy nó.</li>
<li><strong>Tiến trình không trạng thái</strong> — dữ liệu nằm trong MySQL, không nằm trong bộ nhớ server, để có thể chạy hai bản app.</li>
<li><strong>Đồng nhất dev/prod</strong> — cùng một image trên laptop và trên server.</li>
<li><strong>Vệ sinh image</strong> — image Tomcat chính thức chạy bằng root; nhóm làm production thêm <code>USER</code> không phải root, cố định phiên bản image và quét image tìm lỗ hổng đã biết.</li>
</ul>
Nêu được hai điều trong số này khi thuyết trình — và chỉ ra chỗ repo của bạn làm theo — là trả lời câu hỏi "thiết kế" bằng bằng chứng.</div>`));

P91.push(books([
  ['sommerville', 'ch. 25 Configuration management — §25.3 System building, §25.4 Release management', 'chương 25 Quản lý cấu hình — §25.3 Build hệ thống, §25.4 Quản lý phát hành'],
  ['progit', 'ch. 2.6 Tagging · ch. 3 Git Branching (branching workflows)', 'chương 2.6 Tagging · chương 3 Git Branching (quy trình phân nhánh)'],
]));

const L91 = {
  title: '9.1 — Docker & GitLab CI for a Java web + MySQL project|||9.1 — Docker & GitLab CI cho dự án Java web + MySQL',
  slug: 'swp391-9-1-docker-devops',
  type: 'VIDEO',
  description: 'Không bắt buộc trong guide nhưng giải quyết lỗi "hôm qua còn chạy": Dockerfile multi-stage (WAR trên Tomcat 10), compose với MySQL 8 tự nạp DB script, DBContext đọc biến môi trường, .gitlab-ci.yml build/test/đóng gói theo tag iteration, bảng xử lý sự cố.',
  content: P91.join('\n'),
};

/* ─────────────────────── Quiz 9 ─────────────────────── */
// Correct answers are written first-hand in any slot; this spreads them over A–D so the key is not guessable.
// Numeric option lists (percentages, team sizes…) keep their natural order.
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const target = [2, 0, 3, 1][qn++ % 4];
  if (options.every((o) => /^[0-9]/.test(o))) return { question, options, correctIndex, explanation, points: 1 };
  const opts = options.slice();
  const [right] = opts.splice(correctIndex, 1);
  opts.splice(target, 0, right);
  return { question, options: opts, correctIndex: target, explanation, points: 1 };
};
const QUIZ9 = {
  title: 'Quiz 9 — DevOps, Docker & GitLab CI|||Quiz 9 — DevOps, Docker & GitLab CI',
  slug: 'swp391-quiz-9',
  type: 'QUIZ',
  description: 'Kiểm tra image/container, Dockerfile, compose với MySQL, GitLab CI theo tag, và các bẫy triển khai thường gặp.',
  quiz: {
    timeLimitSeconds: 1500,
    questions: [
      q('What do the SWP391 guides require you to submit as the source of an iteration?|||Guide SWP391 yêu cầu nộp source của một iteration dưới dạng nào?', ['A Docker image|||Một Docker image', 'A link to the tagged source code on GitLab, with the DB scripts inside the tag|||Link tới source code đã gắn tag trên GitLab, có DB script nằm trong tag', 'A zip file by e-mail|||Một file zip gửi e-mail', 'A running cloud server|||Một server cloud đang chạy'], 1, 'Subject Guides p.6: links to the tagged iteration source, with DB scripts and config added to the tag. Docker is optional.|||Subject Guides trang 6: link tới source iteration đã gắn tag, kèm DB script và cấu hình. Docker là tuỳ chọn.'),
      q('Which statement about an image and a container is correct?|||Phát biểu nào về image và container là đúng?', ['They are the same thing|||Chúng là một', 'An image is a read-only package; a container is a running instance of it|||Image là gói chỉ đọc; container là một bản đang chạy của nó', 'A container builds an image|||Container build ra image', 'Images store the MySQL data|||Image lưu dữ liệu MySQL'], 1, 'Many containers can run from one image; data that must survive goes to a volume.|||Nhiều container có thể chạy từ một image; dữ liệu cần giữ nằm trong volume.'),
      q('Why use a multi-stage Dockerfile for a WAR?|||Vì sao dùng Dockerfile multi-stage cho một file WAR?', ['It builds faster on every change|||Build nhanh hơn mỗi lần đổi', 'Maven and the source stay in the build stage; the final image holds only Tomcat and the WAR|||Maven và source nằm lại ở stage build; image cuối chỉ có Tomcat và WAR', 'Tomcat requires it|||Tomcat bắt buộc', 'It removes the need for a database|||Không cần CSDL nữa'], 1, 'A smaller final image with fewer tools inside is faster to ship and safer.|||Image cuối nhỏ hơn, ít công cụ bên trong thì nhanh triển khai và an toàn hơn.'),
      q('Why is pom.xml copied and dependencies downloaded BEFORE copying src?|||Vì sao copy pom.xml và tải thư viện TRƯỚC khi copy src?', ['Docker caches layers, so dependencies are re-downloaded only when pom.xml changes|||Docker cache theo layer, nên thư viện chỉ tải lại khi pom.xml đổi', 'Maven reads files alphabetically|||Maven đọc file theo thứ tự chữ cái', 'src must be copied last by law|||src bắt buộc copy sau cùng', 'It makes the WAR smaller|||Làm WAR nhỏ hơn'], 0, 'Changing Java code then only rebuilds the later layers.|||Khi chỉ sửa code Java, chỉ các layer phía sau được build lại.'),
      q('Code importing javax.servlet deployed on Tomcat 10.1 returns 404/500 for every servlet. Why?|||Code import javax.servlet chạy trên Tomcat 10.1 thì mọi servlet trả 404/500. Vì sao?', ['MySQL is down|||MySQL đang tắt', 'Tomcat 10+ uses the jakarta.servlet namespace|||Tomcat 10+ dùng namespace jakarta.servlet', 'The port is wrong|||Sai cổng', 'The WAR name must be ROOT|||Tên WAR phải là ROOT'], 1, 'Use a Tomcat 9 image for javax.*, or migrate the imports to jakarta.*.|||Dùng image Tomcat 9 cho javax.*, hoặc chuyển import sang jakarta.*.'),
      q('Inside the compose network, which JDBC host must the app use to reach the db service?|||Trong network của compose, app phải dùng host JDBC nào để tới service db?', ['localhost|||localhost', '127.0.0.1|||127.0.0.1', 'db (the service name)|||db (tên service)', 'The laptop IP|||IP của laptop'], 2, 'Inside a container, localhost means the container itself; service names resolve to the other containers.|||Trong container, localhost là chính container đó; tên service phân giải ra các container khác.'),
      q('When does MySQL run the scripts mounted in /docker-entrypoint-initdb.d?|||MySQL chạy các script gắn vào /docker-entrypoint-initdb.d khi nào?', ['On every start|||Mỗi lần khởi động', 'Only on the first start with an empty data volume|||Chỉ lần khởi động đầu với volume dữ liệu trống', 'Only when the app asks|||Chỉ khi app yêu cầu', 'Never, they must be run by hand|||Không bao giờ, phải chạy tay'], 1, 'After editing a script, run docker compose down -v to wipe the volume so it runs again.|||Sau khi sửa script, chạy docker compose down -v để xoá volume cho script chạy lại.'),
      q('What does depends_on with condition: service_healthy add?|||depends_on với condition: service_healthy thêm được gì?', ['It restarts the db forever|||Khởi động lại db mãi mãi', 'The app starts only after the db healthcheck passes|||App chỉ khởi động sau khi healthcheck của db đạt', 'It publishes the db port|||Mở cổng db ra ngoài', 'It backs up the database|||Sao lưu CSDL'], 1, 'Without it the app may try to connect while MySQL is still initialising.|||Không có nó, app có thể kết nối khi MySQL còn đang khởi tạo.'),
      q('The team wrote SELECT * FROM Users on Windows; in the Linux container MySQL says table jbs.Users does not exist. Cause?|||Nhóm viết SELECT * FROM Users trên Windows; trong container Linux MySQL báo không có bảng jbs.Users. Nguyên nhân?', ['Docker deletes tables|||Docker xoá bảng', 'Table names are case-sensitive on Linux, and the script created users|||Tên bảng phân biệt hoa/thường trên Linux, còn script tạo bảng users', 'MySQL 8 has no tables|||MySQL 8 không có bảng', 'The JDBC driver is too old|||Driver JDBC quá cũ'], 1, 'Use one spelling (lowercase) in scripts and DAO code.|||Dùng một cách viết (chữ thường) trong script và code DAO.'),
      q('Where should the DB password come from in the containerised app?|||Trong app đã container hoá, mật khẩu DB nên lấy từ đâu?', ['Hard-coded in DBContext|||Viết cứng trong DBContext', 'An ENV line in the Dockerfile|||Một dòng ENV trong Dockerfile', 'A runtime environment variable, e.g. from an uncommitted .env file|||Biến môi trường lúc chạy, ví dụ từ file .env không commit', 'The README|||File README'], 2, 'Values in the Dockerfile stay in image layers; values in Git stay in history.|||Giá trị trong Dockerfile nằm lại trong layer image; giá trị trong Git nằm lại trong lịch sử.'),
      q('Why keep a .env.example in the repo but .env in .gitignore?|||Vì sao giữ .env.example trong repo nhưng đưa .env vào .gitignore?', ['To save disk space|||Để tiết kiệm dung lượng', 'The example shows which variables exist; the real file holds secrets that must not be committed|||File mẫu cho biết có những biến nào; file thật chứa bí mật không được commit', 'GitLab cannot read .env|||GitLab không đọc được .env', 'Docker needs both|||Docker cần cả hai'], 1, 'New members copy the example and fill in their own values.|||Thành viên mới copy file mẫu và điền giá trị của mình.'),
      q('In .gitlab-ci.yml, what does rules: - if: $CI_COMMIT_TAG do on the package job?|||Trong .gitlab-ci.yml, rules: - if: $CI_COMMIT_TAG làm gì với job package?', ['Runs it on every push|||Chạy mỗi lần push', 'Runs it only when a tag such as iter2 is pushed|||Chỉ chạy khi push một tag như iter2', 'Deletes the tag|||Xoá tag', 'Skips the tests|||Bỏ qua test'], 1, 'CI_COMMIT_TAG is empty on normal pushes, so the image is built only for iteration tags.|||CI_COMMIT_TAG rỗng ở các lần push thường, nên image chỉ build cho tag iteration.'),
      q('What is the services: mysql:8.0 entry in the test job for?|||Mục services: mysql:8.0 trong job test để làm gì?', ['To deploy production|||Để triển khai production', 'To give the tests a throw-away MySQL reachable by its alias|||Cho test một MySQL dùng xong bỏ, truy cập bằng alias', 'To build the Docker image|||Để build Docker image', 'To store the cache|||Để lưu cache'], 1, 'The service lives only as long as the job, so tests never touch the team database.|||Service chỉ sống trong thời gian job chạy, nên test không đụng tới CSDL của nhóm.'),
      q('Where should a secret like TEST_DB_PASSWORD for CI be stored?|||Bí mật như TEST_DB_PASSWORD cho CI nên lưu ở đâu?', ['In .gitlab-ci.yml|||Trong .gitlab-ci.yml', 'Settings, CI/CD, Variables, marked Masked|||Settings, CI/CD, Variables, tích Masked', 'In a commit message|||Trong commit message', 'In the Docker image|||Trong Docker image'], 1, 'Masked variables are injected at run time and hidden in job logs.|||Biến Masked được đưa vào lúc chạy và bị che trong log.'),
      q('The GitLab slide protects main and iter* so that only Maintainers merge. What setting makes a red pipeline block the merge too?|||Slide GitLab bảo vệ main và iter* để chỉ Maintainer được merge. Thiết lập nào khiến pipeline đỏ cũng chặn merge?', ['Allowed to force push|||Allowed to force push', 'Pipelines must succeed (merge request settings)|||Pipelines must succeed (thiết lập merge request)', 'Delete source branch|||Delete source branch', 'Squash commits|||Squash commits'], 1, 'Combined with protected branches, a broken build cannot reach a tag.|||Kết hợp với protected branch, bản build hỏng không thể lọt tới tag.'),
      q('GitLab slide 28 writes git tag -a tag_name -l "tag notes". What is the correct command to create an annotated tag with a message?|||Slide GitLab 28 ghi git tag -a tag_name -l "tag notes". Lệnh đúng để tạo annotated tag có ghi chú là gì?', ['git tag -a iter2 -l "Iteration 2"|||git tag -a iter2 -l "Iteration 2"', 'git tag -a iter2 -m "Iteration 2"|||git tag -a iter2 -m "Iteration 2"', 'git branch iter2|||git branch iter2', 'git commit -t iter2|||git commit -t iter2'], 1, '-l lists tags; -m gives the message. Then git push origin iter2, since a plain push does not send tags.|||-l là liệt kê tag; -m là ghi chú. Sau đó git push origin iter2, vì push thường không gửi tag.'),
      q('Which command gives a clean demo database before recording a demo video?|||Lệnh nào cho CSDL demo sạch trước khi quay video demo?', ['docker compose restart|||docker compose restart', 'docker compose down -v then docker compose up -d|||docker compose down -v rồi docker compose up -d', 'docker ps|||docker ps', 'git reset --hard|||git reset --hard'], 1, 'Removing the volume makes MySQL re-run the schema and demo-data scripts.|||Xoá volume khiến MySQL chạy lại script schema và dữ liệu demo.'),
      q('Which twelve-factor principle does reading DB_URL from System.getenv illustrate? (beyond the syllabus)|||Đọc DB_URL bằng System.getenv minh hoạ nguyên tắc twelve-factor nào? (ngoài giáo trình)', ['Store config in the environment|||Lưu cấu hình trong môi trường', 'Treat logs as event streams|||Coi log là luồng sự kiện', 'Run admin tasks as one-off processes|||Chạy tác vụ quản trị như tiến trình một lần', 'Scale out via processes|||Mở rộng bằng tiến trình'], 0, 'The same build runs in NetBeans and in a container; only the environment differs.|||Cùng một bản build chạy trong NetBeans và trong container; chỉ môi trường khác nhau.'),
    ],
  },
};

export default {
  title: 'Chapter 9 (Advanced) — DevOps & Docker deployment|||Chương 9 (Nâng cao) — DevOps & triển khai Docker',
  description: 'Đóng gói app Java web + MySQL bằng Docker để tag iteration chạy được bằng một lệnh, và dùng GitLab CI để build, test, đóng gói theo tag — không bắt buộc nhưng tránh lỗi demo.',
  lessons: [L91, QUIZ9],
};
