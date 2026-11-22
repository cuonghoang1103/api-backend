/**
 * Đọc code cũ và refactor — Chương 1: Dựng chạy một dự án cũ (soạn 22/11/2026).
 * 1.1 công cụ build cũ (Ant/Maven/WAR, Tomcat 9 javax vs 10 jakarta) · 1.2 địa ngục phiên bản (JDK 8/21, class file version,
 * bảng mã trên Windows, node-sass/node-gyp) · 1.3 Maven thật (dependency:tree, nearest-wins, kho nội bộ, HTTP blocker)
 * · 1.4 dump + Docker Compose (DEFINER, log_bin_trust_function_creators, Public Key Retrieval, che dữ liệu)
 * · 1.5 README · 1.6 lab · 1.7 quiz 12 câu. Mọi output chạy thật trên repo lab — môi trường ở MOI_TRUONG.
 */
import { java, xml, sql, bash, props, out, tl, ml, lk, bai, thuatNgu, Q, MOI_TRUONG } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG}.</em></p>`;

/* ═══════════════════ 1.1 — Công cụ build cũ ═══════════════════ */
const C11_POM = xml(`
<packaging>war</packaging>
<properties>
  <maven.compiler.source>1.8</maven.compiler.source>    <!-- cần JDK nào -->
  <maven.compiler.target>1.8</maven.compiler.target>
  <!-- KHÔNG có project.build.sourceEncoding ⇒ bảng mã tuỳ máy (bài 1.2) -->
</properties>
<dependency>
  <groupId>javax.servlet</groupId>                       <!-- javax ⇒ Tomcat 9 trở xuống -->
  <artifactId>javax.servlet-api</artifactId>
  <version>3.1.0</version>
  <scope>provided</scope>                               <!-- Tomcat có sẵn, không đóng vào WAR -->
</dependency>
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>         <!-- ⇒ cần MySQL; 5.1.x là driver rất cũ -->
  <version>5.1.49</version>
</dependency>
<plugin>
  <artifactId>maven-war-plugin</artifactId>
  <version>2.2</version>                                <!-- plugin 2012: hỏng trên JDK 16+ (bài 1.2) -->
</plugin>
`
);
const O11_WAR = out(`
$ jar tf target/thuvien.war | grep -v "/$"
META-INF/MANIFEST.MF
header.jsp
readers.jsp
…
WEB-INF/classes/db.properties
WEB-INF/classes/com/thuvien/servlet/BookServlet.class
…
WEB-INF/lib/jstl-1.2.jar
WEB-INF/lib/log4j-1.2.17.jar
WEB-INF/lib/mysql-connector-java-5.1.49.jar
WEB-INF/lib/commons-lang-2.6.jar
WEB-INF/web.xml
books.jsp
META-INF/maven/com.thuvien/thuvien/pom.xml
`
);
const C11_ANT = xml(`
<project name="thuvien" default="war" basedir=".">
  <path id="cp">
    <fileset dir="WebContent/WEB-INF/lib" includes="*.jar"/>   <!-- jar nằm SẴN trong repo -->
    <fileset dir="lib-build" includes="*.jar"/>                 <!-- servlet-api để biên dịch -->
  </path>
  <target name="compile" description="Bien dich ma Java">
    <javac srcdir="src/main/java" destdir="build/classes" classpathref="cp"
           source="1.8" target="1.8" encoding="UTF-8" includeantruntime="false"/>
  </target>
  <target name="war" depends="compile" description="Dong goi thuvien.war">
    <war destfile="build/thuvien.war" webxml="WebContent/WEB-INF/web.xml">…</war>
  </target>
</project>
`
);
const O11_ANT = out(`
$ ant -p
Buildfile: /private/tmp/lgc/thu-ant/build.xml

Main targets:

 clean    Xoa thu muc build
 compile  Bien dich ma Java
 war      Dong goi thuvien.war
Default target: war
$ ant war
compile:
    [mkdir] Created dir: /private/tmp/lgc/thu-ant/build/classes
    [javac] Compiling 12 source files to /private/tmp/lgc/thu-ant/build/classes
     [copy] Copying 2 files to /private/tmp/lgc/thu-ant/build/classes
war:
      [war] Building war: /private/tmp/lgc/thu-ant/build/thuvien.war

BUILD SUCCESSFUL
Total time: 0 seconds
`
);
const O11_TC10 = out(`
# Cùng thuvien.war, thả vào Tomcat 10.1.62 (JDK 21)
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" localhost:18090/thuvien/
302 http://localhost:18090/thuvien/books
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:18090/thuvien/login
500
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:18090/thuvien/books
500
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:18090/thuvien/report
404
$ grep -A1 SEVERE logs/localhost.2026-11-22.log | head -2
22-Nov-2026 21:41:33.911 SEVERE [http-nio-18090-exec-2] org.apache.catalina.core.StandardWrapperValve.invoke Allocate exception for servlet [LoginServlet]
	java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet
`
);

const L11 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Getting an old project to run' : 'Chương 1 · Dựng chạy một dự án cũ'}</span>
<h2>${en ? '1.1 — Old build tools: Ant, early Maven POMs, WAR files, Tomcat javax vs jakarta' : '1.1 — Công cụ build cũ: Ant, POM Maven đời đầu, file WAR, Tomcat javax và jakarta'}</h2>
<p class="lead">${en
  ? 'Before you can understand an old project you must run it, and before you can run it you must know what it needs. The build file is the most honest document in the repo: the README can lie by omission, but <code>pom.xml</code> or <code>build.xml</code> is what actually produced the last working release. This lesson teaches you to read one like a shopping list.'
  : 'Muốn hiểu một dự án cũ thì phải chạy được nó, muốn chạy được thì phải biết nó cần gì. Tệp build là tài liệu trung thực nhất trong repo: README có thể nói dối vì thiếu, nhưng <code>pom.xml</code> hay <code>build.xml</code> là thứ đã thật sự tạo ra bản phát hành chạy được gần nhất. Bài này dạy bạn đọc nó như đọc một danh sách đi chợ.'}</p>
${moiTruong(en)}

<h3>${en ? 'Reading a POM as a shopping list' : 'Đọc POM như danh sách đi chợ'}</h3>
<p>${en
  ? 'Open <code>pom.xml</code> of the lab and do not try to understand Maven. Answer five questions only: which Java, which packaging, which container API, which database driver, which plugins are pinned to old versions. The annotated excerpt below is the lab’s real POM:'
  : 'Mở <code>pom.xml</code> của lab và đừng cố hiểu Maven. Chỉ trả lời năm câu: Java nào, đóng gói kiểu gì, API của container nào, driver CSDL nào, plugin nào bị ghim bản cũ. Đoạn có chú thích dưới đây là POM thật của lab:'}</p>
${C11_POM}
<table>
<thead><tr><th>${en ? 'Clue in the POM' : 'Manh mối trong POM'}</th><th>${en ? 'What it tells you' : 'Nó cho bạn biết'}</th></tr></thead>
<tbody>
<tr><td><code>maven.compiler.source/target 1.8</code> ${en ? '(or <code>&lt;source&gt;</code> in the compiler plugin)' : '(hoặc <code>&lt;source&gt;</code> trong compiler plugin)'}</td><td>${en ? 'The project was built with JDK 8. Start with JDK 8, not your daily JDK.' : 'Dự án từng build bằng JDK 8. Bắt đầu bằng JDK 8, không phải JDK bạn dùng hằng ngày.'}</td></tr>
<tr><td><code>&lt;packaging&gt;war&lt;/packaging&gt;</code></td><td>${en ? 'Output is a WAR for a servlet container — there is no <code>main()</code> to run.' : 'Sản phẩm là một WAR chạy trong servlet container — không có <code>main()</code> để chạy.'}</td></tr>
<tr><td><code>javax.servlet-api</code> ${en ? 'with scope' : 'với scope'} <code>provided</code></td><td>${en ? 'Container must provide <code>javax.*</code> ⇒ Tomcat 9 or older (below).' : 'Container phải cung cấp <code>javax.*</code> ⇒ Tomcat 9 trở xuống (bên dưới).'}</td></tr>
<tr><td><code>mysql-connector-java 5.1.49</code></td><td>${en ? 'MySQL; a driver from the MySQL 5.x era meeting MySQL 8 (lesson 1.4).' : 'MySQL; driver thời MySQL 5.x đi gặp MySQL 8 (bài 1.4).'}</td></tr>
<tr><td>${en ? 'Plugins with old <code>&lt;version&gt;</code>' : 'Plugin có <code>&lt;version&gt;</code> cũ'}</td><td>${en ? 'Each one is a candidate for “works on JDK 8, breaks on new JDK” (lesson 1.2).' : 'Mỗi cái là ứng viên cho "chạy trên JDK 8, hỏng trên JDK mới" (bài 1.2).'}</td></tr>
</tbody>
</table>

<h3>${en ? 'What a WAR is, opened up' : 'WAR là gì — mở ra xem'}</h3>
<p>${en
  ? 'A WAR (Web Application Archive) is a zip with a fixed layout: JSPs at the root, compiled classes under <code>WEB-INF/classes</code>, libraries under <code>WEB-INF/lib</code>, the deployment descriptor <code>WEB-INF/web.xml</code>. Build the lab with JDK 8 (<code>mvn -B package</code>) and look inside:'
  : 'WAR (gói ứng dụng web) là một tệp zip có bố cục cố định: JSP ở gốc, class đã biên dịch trong <code>WEB-INF/classes</code>, thư viện trong <code>WEB-INF/lib</code>, tệp mô tả triển khai <code>WEB-INF/web.xml</code>. Build lab bằng JDK 8 (<code>mvn -B package</code>) rồi nhìn vào trong:'}</p>
${O11_WAR}
<p>${en
  ? 'Two things to notice. <code>javax.servlet-api</code> is <em>not</em> in <code>WEB-INF/lib</code> — <code>provided</code> means “the container has it”. And <code>WEB-INF/classes/db.properties</code> <em>is</em>: the database password travels inside every WAR you build and copy around. Write that in your notebook for Chapter 6.'
  : 'Để ý hai điều. <code>javax.servlet-api</code> <em>không</em> có trong <code>WEB-INF/lib</code> — <code>provided</code> nghĩa là "container có sẵn". Còn <code>WEB-INF/classes/db.properties</code> thì <em>có</em>: mật khẩu CSDL đi theo mọi tệp WAR bạn build và chép đi khắp nơi. Ghi vào nhật ký cho Chương 6.'}</p>

<h3>${en ? 'Ant: when the build file is a list of tasks' : 'Ant: khi tệp build là một danh sách việc'}</h3>
<p>${en
  ? 'Projects started in Eclipse or NetBeans before about 2015 often have no POM at all, only <code>build.xml</code> (Apache Ant) and a folder of jars committed to the repo. Ant does not download anything and has no conventions: every path is written out. To read one, run <code>ant -p</code> (list targets) and follow the <code>depends</code> chain of the default target. Here is an Ant build for the same sources, run for real:'
  : 'Dự án khởi đầu trên Eclipse hay NetBeans trước khoảng 2015 thường không có POM, chỉ có <code>build.xml</code> (Apache Ant) và một thư mục jar commit thẳng vào repo. Ant không tải gì cả và không có quy ước: mọi đường dẫn đều phải viết ra. Để đọc, chạy <code>ant -p</code> (liệt kê target) rồi lần theo chuỗi <code>depends</code> của target mặc định. Đây là bản build Ant cho cùng mã nguồn, chạy thật:'}</p>
${C11_ANT}
${O11_ANT}
<table>
<thead><tr><th></th><th>Ant (build.xml)</th><th>Maven (pom.xml)</th></tr></thead>
<tbody>
<tr><td>${en ? 'Libraries' : 'Thư viện'}</td><td>${en ? 'jars committed in the repo (<code>WEB-INF/lib</code>, <code>lib/</code>)' : 'jar commit sẵn trong repo (<code>WEB-INF/lib</code>, <code>lib/</code>)'}</td><td>${en ? 'declared, downloaded into <code>~/.m2</code>' : 'khai báo, tải về <code>~/.m2</code>'}</td></tr>
<tr><td>${en ? 'Folder layout' : 'Bố cục thư mục'}</td><td>${en ? 'anything (<code>WebContent/</code>, <code>web/</code>…)' : 'tuỳ ý (<code>WebContent/</code>, <code>web/</code>…)'}</td><td><code>src/main/java</code>, <code>src/main/webapp</code></td></tr>
<tr><td>${en ? 'How to read it' : 'Cách đọc'}</td><td><code>ant -p</code>, ${en ? 'follow <code>depends</code>' : 'lần theo <code>depends</code>'}</td><td><code>mvn help:effective-pom</code>, <code>dependency:tree</code> (${en ? 'lesson' : 'bài'} 1.3)</td></tr>
<tr><td>${en ? 'Typical trap' : 'Bẫy hay gặp'}</td><td>${en ? 'a jar that exists only on the old author’s machine' : 'một jar chỉ có trên máy người viết cũ'}</td><td>${en ? 'a repository that no longer exists (lesson 1.3)' : 'một kho thư viện không còn tồn tại (bài 1.3)'}</td></tr>
</tbody>
</table>

<h3>${en ? 'javax vs jakarta: why the WAR runs on Tomcat 9 and not on Tomcat 10' : 'javax và jakarta: vì sao WAR chạy trên Tomcat 9 mà không chạy trên Tomcat 10'}</h3>
<p>${en
  ? 'When Oracle handed Java EE to the Eclipse Foundation it kept the <code>javax</code> name, so from Jakarta EE 9 every package was renamed <code>javax.servlet.*</code> → <code>jakarta.servlet.*</code>. Same classes, new name. Tomcat follows the spec:'
  : 'Khi Oracle chuyển Java EE cho Eclipse Foundation, họ giữ lại tên <code>javax</code>, nên từ Jakarta EE 9 mọi package bị đổi tên <code>javax.servlet.*</code> → <code>jakarta.servlet.*</code>. Lớp như cũ, tên mới. Tomcat đi theo đặc tả:'}</p>
<table>
<thead><tr><th>Tomcat</th><th>Servlet</th><th>${en ? 'Namespace' : 'Tên gói'}</th><th>${en ? 'Minimum Java' : 'Java tối thiểu'}</th><th>${en ? 'Status (11/2026)' : 'Tình trạng (11/2026)'}</th></tr></thead>
<tbody>
<tr><td>8.5.x</td><td>3.1</td><td>javax</td><td>7</td><td>${en ? 'EOL 31/03/2024' : 'hết hỗ trợ 31/03/2024'}</td></tr>
<tr><td>9.0.x</td><td>4.0</td><td>javax</td><td>8</td><td>${en ? 'supported, latest 9.0.124' : 'còn hỗ trợ, mới nhất 9.0.124'}</td></tr>
<tr><td>10.1.x</td><td>6.0</td><td>jakarta</td><td>11</td><td>${en ? 'supported, latest 10.1.62' : 'còn hỗ trợ, mới nhất 10.1.62'}</td></tr>
<tr><td>11.0.x</td><td>6.1</td><td>jakarta</td><td>17</td><td>${en ? 'supported' : 'còn hỗ trợ'}</td></tr>
</tbody>
</table>
<p>${en ? 'Here is what actually happens when you drop the lab WAR into Tomcat 10.1:' : 'Đây là chuyện thật sự xảy ra khi thả WAR của lab vào Tomcat 10.1:'}</p>
${O11_TC10}
<p>${en
  ? 'Read the three different answers carefully — this is how you will recognise the problem at work. <code>/</code> works, because <code>index.jsp</code> is compiled by Tomcat’s own JSP engine and imports nothing. The servlets declared in <code>web.xml</code> give <strong>500</strong>: Tomcat finds the class, tries to load it, and its parent <code>javax.servlet.http.HttpServlet</code> does not exist any more. <code>/report</code> gives <strong>404</strong>: <code>ReportServlet</code> is registered by the <code>@javax.servlet.annotation.WebServlet</code> annotation, which Tomcat 10 does not even look for. Same root cause, three symptoms. Tomcat offers a migration tool for Jakarta EE that rewrites the bytecode; Chapter 7 does it properly in the source.'
  : 'Đọc kỹ ba câu trả lời khác nhau — đi làm bạn sẽ nhận ra vấn đề nhờ đúng điều này. <code>/</code> chạy được, vì <code>index.jsp</code> do chính bộ dịch JSP của Tomcat biên dịch và không import gì. Các servlet khai trong <code>web.xml</code> trả <strong>500</strong>: Tomcat tìm thấy lớp, thử nạp, và lớp cha <code>javax.servlet.http.HttpServlet</code> không còn tồn tại. <code>/report</code> trả <strong>404</strong>: <code>ReportServlet</code> được đăng ký bằng annotation <code>@javax.servlet.annotation.WebServlet</code> mà Tomcat 10 thậm chí không thèm tìm. Một nguyên nhân gốc, ba triệu chứng. Tomcat có công cụ di trú Jakarta EE viết lại bytecode; Chương 7 làm việc này đàng hoàng trong mã nguồn.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — “just use the latest Tomcat”.' : 'Bẫy — "cứ dùng Tomcat mới nhất".'}</strong> ${en
  ? 'The latest is the wrong one for a <code>javax</code> app. Match the container to the code first; upgrading the container is a separate, planned change (lesson 7.5).'
  : 'Bản mới nhất lại là bản sai với một ứng dụng <code>javax</code>. Chọn container khớp với code trước; nâng container là một thay đổi riêng, có kế hoạch (bài 7.5).'}</p></div>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Your lead says “the project runs on Tomcat, install it”. You install Tomcat 11 from the website, the app answers 500 and 404, and you spend the afternoon reading servlet code that is perfectly fine. Asking one question first — “which Tomcat does production run?” — or reading one line of the POM (<code>javax.servlet-api</code>) would have saved the afternoon.'
  : 'Leader bảo "dự án chạy Tomcat, cài đi". Bạn tải Tomcat 11 trên trang chủ, ứng dụng trả 500 và 404, và bạn mất cả buổi chiều đọc code servlet hoàn toàn không có lỗi. Hỏi trước một câu — "production chạy Tomcat bản nào?" — hoặc đọc một dòng của POM (<code>javax.servlet-api</code>) là đã cứu được buổi chiều đó.'}</p>

<h3>🧪 ${en ? 'Practice (15 minutes)' : 'Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Answer the five POM questions for the lab in your notebook, each with the line number where you found the answer.' : 'Trả lời năm câu hỏi POM cho lab trong nhật ký, mỗi câu kèm số dòng bạn tìm thấy câu trả lời.'}</li>
<li>${en ? 'Build the WAR with JDK 8 and run <code>jar tf target/thuvien.war | grep lib/</code>. Explain why there are four jars, not five.' : 'Build WAR bằng JDK 8 và chạy <code>jar tf target/thuvien.war | grep lib/</code>. Giải thích vì sao có bốn jar chứ không phải năm.'}</li>
<li>${en ? 'Optional: download Tomcat 10.1, deploy the same WAR on port 18090 and reproduce the 302/500/500/404 pattern. Find the <code>ClassNotFoundException</code> in <code>logs/localhost.*.log</code>.' : 'Tuỳ chọn: tải Tomcat 10.1, đưa cùng WAR lên cổng 18090 và tái hiện mẫu 302/500/500/404. Tìm dòng <code>ClassNotFoundException</code> trong <code>logs/localhost.*.log</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you can say, from the POM alone, “JDK 8, WAR on Tomcat 9, MySQL, two plugins to watch” — and why <code>/report</code> is 404 but <code>/login</code> is 500 on Tomcat 10.' : 'chỉ nhìn POM bạn nói được "JDK 8, WAR chạy Tomcat 9, MySQL, hai plugin cần để ý" — và vì sao trên Tomcat 10 <code>/report</code> là 404 còn <code>/login</code> là 500.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['POM (Project Object Model)', 'tệp mô tả dự án Maven', 'pom.xml: thư viện, plugin, phiên bản Java, cách đóng gói.', 'pom.xml: libraries, plugins, Java version, packaging.'],
  ['scope provided', 'phạm vi "có sẵn"', 'Cần lúc biên dịch nhưng không đóng vào WAR vì container đã có.', 'Needed to compile but not packaged, because the container has it.'],
  ['Deployment descriptor', 'tệp mô tả triển khai', 'WEB-INF/web.xml: servlet nào nghe URL nào, trang lỗi, trang chào.', 'WEB-INF/web.xml: which servlet serves which URL, error and welcome pages.'],
  ['Target (Ant)', 'mục tiêu build', 'Một việc có tên trong build.xml, có thể phụ thuộc việc khác.', 'A named task in build.xml that may depend on others.'],
  ['Namespace javax/jakarta', 'không gian tên gói', 'Tiền tố gói của API Java EE; đổi sang jakarta từ Jakarta EE 9.', 'The package prefix of the Java EE APIs; jakarta since Jakarta EE 9.'],
  ['ClassNotFoundException', 'không tìm thấy lớp', 'JVM cần một lớp lúc chạy mà classpath không có.', 'The JVM needs a class at run time that is not on the classpath.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'The build file tells the truth about what the project needs; read it before the README.' : 'Tệp build nói thật dự án cần gì; đọc nó trước README.'}</li>
<li>${en ? 'Five POM questions: Java, packaging, container API, DB driver, pinned old plugins.' : 'Năm câu hỏi POM: Java, đóng gói, API container, driver CSDL, plugin cũ bị ghim.'}</li>
<li>${en ? 'A WAR is a zip: JSPs, WEB-INF/classes, WEB-INF/lib, web.xml — and sometimes your passwords.' : 'WAR là một zip: JSP, WEB-INF/classes, WEB-INF/lib, web.xml — đôi khi cả mật khẩu của bạn.'}</li>
<li>${en ? 'Ant: <code>ant -p</code>, follow <code>depends</code>; jars live in the repo.' : 'Ant: <code>ant -p</code>, lần theo <code>depends</code>; jar nằm trong repo.'}</li>
<li>${en ? '<code>javax</code> app ⇒ Tomcat 9; on Tomcat 10+ web.xml servlets give 500 and annotated ones 404.' : 'Ứng dụng <code>javax</code> ⇒ Tomcat 9; trên Tomcat 10+ servlet khai trong web.xml trả 500, servlet dùng annotation trả 404.'}</li>
</ul>

${tl('https://tomcat.apache.org/whichversion.html', '🐱', 'Apache Tomcat — Which version do I want?', en ? 'Servlet/JSP spec and minimum Java per Tomcat branch' : 'Đặc tả Servlet/JSP và Java tối thiểu của từng nhánh Tomcat')}
${tl('https://tomcat.apache.org/migration-10.html', '🐱', 'Apache Tomcat — Migration guide to 10.x', 'javax → jakarta')}
${tl('https://ant.apache.org/manual/', '🐜', 'Apache Ant manual', en ? 'Targets, javac and war tasks' : 'Target, tác vụ javac và war')}
`
);

/* ═══════════════════ 1.2 — Địa ngục phiên bản ═══════════════════ */
const O12_JDK21 = out(`
$ JAVA_HOME=$(/usr/libexec/java_home -v 21) mvn -B package
…
[ERROR] COMPILATION ERROR :
[ERROR] /…/src/main/java/com/thuvien/util/TokenUtil.java:[4,22] package javax.xml.bind does not exist
[ERROR] /…/src/main/java/com/thuvien/util/TokenUtil.java:[15,20] cannot find symbol
  symbol:   variable DatatypeConverter
  location: class com.thuvien.util.TokenUtil
[INFO] BUILD FAILURE
`
);
const O12_WARPLUGIN = out(`
# Thử "chữa" bằng cách thêm javax.xml.bind:jaxb-api:2.3.1 vào POM, build lại bằng JDK 21:
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] --- war:2.2:war (default-war) @ thuvien ---
…
[INFO] BUILD FAILURE
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-war-plugin:2.2:war (default-war) on project thuvien: Execution default-war of goal org.apache.maven.plugins:maven-war-plugin:2.2:war failed: Unable to load the mojo 'war' in the plugin 'org.apache.maven.plugins:maven-war-plugin:2.2' due to an API incompatibility: org.codehaus.plexus.component.repository.exception.ComponentLookupException: Cannot access defaults field of Properties
`
);
const O12_VERSION = out(`
$ javac Hello.java                       # JDK 21, không chỉ định đích
$ /path/to/jdk8/bin/java Hello
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError: Hello has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 52.0
$ javac --release 8 Hello.java           # JDK 21, đích Java 8
warning: [options] source value 8 is obsolete and will be removed in a future release
warning: [options] target value 8 is obsolete and will be removed in a future release
warning: [options] To suppress warnings about obsolete options, use -Xlint:-options.
3 warnings
$ /path/to/jdk8/bin/java Hello
Java 1.8.0_514
$ javac -source 7 -target 7 Hello.java   # JDK 21, dự án còn cũ hơn nữa
error: Source option 7 is no longer supported. Use 8 or later.
error: Target option 7 is no longer supported. Use 8 or later.
`
);
const O12_ENC = out(`
# Giả lập máy Windows dùng bảng mã Cp1252: cùng mã nguồn, cùng JDK 8, cùng lệnh
$ JAVA_TOOL_OPTIONS=-Dfile.encoding=Cp1252 mvn -B -q compile
$ javap -v -cp target/classes com.thuvien.servlet.BookServlet | grep "String M"
       681: ldc           #90                 // String MÆ°á»£n thÃ nh cÃ´ng
$ mvn -B -q clean compile                # bảng mã UTF-8 của Mac
$ javap -v -cp target/classes com.thuvien.servlet.BookServlet | grep "String M"
       681: ldc           #90                 // String Mượn thành công
`
);
const O12_SASS = out(`
$ node -v
v26.8.1
$ npm install node-sass@4.14.1 --no-audit --no-fund
…
npm error command sh -c node scripts/build.js
npm error gyp info using node-gyp@3.8.0
npm error gyp info using node@26.8.1 | darwin | arm64
npm error gyp verb check python checking for Python executable "python2" in the PATH
npm error gyp verb \`which\` failed  python2 Error: not found: python2
…
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
npm error gyp ERR! not ok
npm error Build failed with error code: 1
`
);
const C12_PIN = bash(`
# .sdkmanrc ở gốc repo — "sdk env" đọc nó và bật đúng JDK cho thư mục này
java=8.0.514-zulu

# .nvmrc ở gốc repo — "nvm use" đọc nó
14.21.3

# pom.xml — bắt Maven từ chối JDK sai ngay từ đầu (maven-enforcer-plugin)
#   <requireJavaVersion><version>[1.8,1.9)</version></requireJavaVersion>
# package.json — npm cảnh báo khi Node sai bản
#   "engines": { "node": "14.x" }
`
);

const L12 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Getting an old project to run' : 'Chương 1 · Dựng chạy một dự án cũ'}</span>
<h2>${en ? '1.2 — Version hell: JDK 8 vs 17, old Node, node-gyp and native modules' : '1.2 — Địa ngục phiên bản: JDK 8 và 17, Node cũ, node-gyp và module native'}</h2>
<p class="lead">${en
  ? 'Old projects rarely fail because the code is wrong. They fail because your machine is newer than the project. This lesson shows the real errors you get when you build the lab with a modern JDK, how to read the version number hidden inside every <code>.class</code> file, the Windows encoding trap, and the Node equivalent: native modules that no longer compile.'
  : 'Dự án cũ hiếm khi hỏng vì code sai. Nó hỏng vì máy bạn mới hơn dự án. Bài này cho xem các lỗi thật khi build lab bằng JDK mới, cách đọc số phiên bản giấu trong mọi tệp <code>.class</code>, cái bẫy bảng mã trên Windows, và bản tương đương bên Node: module native không còn biên dịch được.'}</p>
${moiTruong(en)}

<h3>${en ? 'Error 1 — a JDK API that was removed' : 'Lỗi 1 — một API của JDK đã bị gỡ'}</h3>
${O12_JDK21}
<p>${en
  ? '<code>javax.xml.bind</code> (JAXB) shipped inside JDK 6–10. JEP 320 removed the Java EE and CORBA modules in JDK 11, so any code that used <code>DatatypeConverter</code> to print a hex string — a very common shortcut around 2015 — stops compiling. The fix on day one is not to change code: build with the JDK the project was written for. The proper fix (a library or <code>java.util.HexFormat</code>) belongs to Chapter 7.'
  : '<code>javax.xml.bind</code> (JAXB) nằm sẵn trong JDK 6–10. JEP 320 gỡ các module Java EE và CORBA khỏi JDK 11, nên mọi code dùng <code>DatatypeConverter</code> để in chuỗi hex — một lối tắt rất phổ biến khoảng 2015 — không biên dịch được nữa. Cách xử lý ngày đầu không phải sửa code: build bằng đúng JDK mà dự án được viết cho. Cách sửa đúng (thêm thư viện hoặc dùng <code>java.util.HexFormat</code>) thuộc về Chương 7.'}</p>

<h3>${en ? 'Error 2 — fixing one error reveals the next' : 'Lỗi 2 — sửa được lỗi này thì lộ lỗi kế tiếp'}</h3>
<p>${en
  ? 'A tempting shortcut: “just add the <code>jaxb-api</code> dependency and keep JDK 21”. We tried it. Compilation and the test pass — and then the 2012-era <code>maven-war-plugin 2.2</code> crashes, because it reflects into JDK internals (<code>Properties.defaults</code>) that newer JDKs lock down:'
  : 'Lối tắt hấp dẫn: "thêm dependency <code>jaxb-api</code> rồi cứ dùng JDK 21". Chúng tôi đã thử. Biên dịch và test đều qua — rồi tới <code>maven-war-plugin 2.2</code> đời 2012 thì sập, vì nó dùng reflection chọc vào phần ruột của JDK (<code>Properties.defaults</code>) mà JDK mới đã khoá lại:'}</p>
${O12_WARPLUGIN}
<p>${en
  ? 'This is the typical shape of version hell: each fix moves you one step and shows the next wall. On day one, stop after the first wall and use JDK 8. Write the chain in your notebook — it is exactly the to-do list of the Java upgrade in Chapter 7 (replace JAXB, bump the war plugin, set the encoding…).'
  : 'Đây là hình dạng điển hình của địa ngục phiên bản: mỗi bản sửa đẩy bạn đi một bước và lộ ra bức tường tiếp theo. Ngày đầu, dừng ở bức tường thứ nhất và dùng JDK 8. Ghi chuỗi lỗi vào nhật ký — đó chính là danh sách việc cho đợt nâng Java ở Chương 7 (thay JAXB, nâng war plugin, khai báo bảng mã…).'}</p>

<h3>${en ? 'Reading the version inside a .class file' : 'Đọc phiên bản giấu trong tệp .class'}</h3>
<p>${en
  ? 'Every class file starts with <code>CAFEBABE</code> followed by a <strong>major version</strong>. A JVM refuses classes newer than itself. Memorise four numbers:'
  : 'Mọi tệp class mở đầu bằng <code>CAFEBABE</code> rồi tới <strong>major version</strong>. JVM từ chối các lớp mới hơn chính nó. Nhớ bốn con số:'}</p>
<table>
<thead><tr><th>major</th><th>52</th><th>55</th><th>61</th><th>65</th></tr></thead>
<tbody><tr><td>Java</td><td>8</td><td>11</td><td>17</td><td>21</td></tr></tbody>
</table>
${O12_VERSION}
<p>${en
  ? 'Three lessons in one terminal. A class built by JDK 21 without a target is version 65 and an old JRE (52) rejects it — this is what you see when someone builds a library with a new JDK and production still runs Java 8. <code>--release 8</code> produces version 52 that runs everywhere, with warnings that Java 8 targets will disappear from future JDKs. And JDK 21 cannot target Java 7 at all, so a Java 7 project needs a JDK 8 (or older) to build. Check any class yourself with <code>javap -v X.class | grep major</code>; the lab’s <code>TokenUtil.class</code> built with JDK 8 shows <code>major version: 52</code>. The related message “Unsupported class file major version 65” comes from tools (old Gradle, old Spring, ASM-based plugins) reading classes newer than they understand.'
  : 'Ba bài học trong một terminal. Lớp build bằng JDK 21 không khai đích là bản 65, và JRE cũ (52) từ chối nó — đây là thứ bạn thấy khi ai đó build thư viện bằng JDK mới mà production vẫn chạy Java 8. <code>--release 8</code> tạo ra bản 52 chạy được khắp nơi, kèm cảnh báo rằng đích Java 8 sẽ biến mất khỏi các JDK sau này. Còn JDK 21 thì không nhắm được Java 7 nữa, nên dự án Java 7 cần JDK 8 (hoặc cũ hơn) mới build được. Tự kiểm một lớp bất kỳ bằng <code>javap -v X.class | grep major</code>; <code>TokenUtil.class</code> của lab build bằng JDK 8 hiện <code>major version: 52</code>. Thông báo họ hàng "Unsupported class file major version 65" đến từ công cụ (Gradle cũ, Spring cũ, plugin dùng ASM) khi đọc phải lớp mới hơn những gì nó hiểu.'}</p>

<h3>${en ? 'Error 3 — the Windows encoding trap' : 'Lỗi 3 — cái bẫy bảng mã trên Windows'}</h3>
<p>${en
  ? 'The lab POM does not set <code>project.build.sourceEncoding</code>, and Maven warns: <code>File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!</code> On a Mac or Linux the platform is UTF-8 and nothing goes wrong. Before JDK 18 (JEP 400 made UTF-8 the default), Java on Windows used the system code page — Cp1252 on English Windows, Cp1258 on Vietnamese Windows. We simulated that on the same machine:'
  : 'POM của lab không khai <code>project.build.sourceEncoding</code>, và Maven cảnh báo: <code>File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!</code> Trên Mac hay Linux bảng mã hệ thống là UTF-8 nên không sao. Trước JDK 18 (JEP 400 đặt UTF-8 làm mặc định), Java trên Windows dùng bảng mã của hệ điều hành — Cp1252 với Windows tiếng Anh, Cp1258 với Windows tiếng Việt. Chúng tôi giả lập điều đó trên cùng một máy:'}</p>
${O12_ENC}
<p>${en
  ? 'The Vietnamese message baked into the class file is now garbage, although nobody changed a line. This is the classic “it shows wrong characters only on my teammate’s laptop” bug. The day-one workaround: build with JDK 8 and <code>-Dproject.build.sourceEncoding=UTF-8</code> on the command line. The real fix is one line in the POM — but that is a change to the project, so it goes in its own small PR (Chapter 8), not hidden in your first ticket.'
  : 'Câu tiếng Việt nằm trong tệp class giờ thành rác, dù không ai sửa một dòng nào. Đây là con bug kinh điển "chỉ máy bạn cùng nhóm bị lỗi font". Cách đi vòng ngày đầu: build bằng JDK 8 kèm <code>-Dproject.build.sourceEncoding=UTF-8</code> trên dòng lệnh. Cách sửa thật là một dòng trong POM — nhưng đó là thay đổi dự án, nên nó đi bằng một PR nhỏ riêng (Chương 8), không giấu trong ticket đầu tiên của bạn.'}</p>

<h3>${en ? 'The Node side: native modules and node-gyp' : 'Phía Node: module native và node-gyp'}</h3>
<p>${en
  ? 'Old Node projects break for a parallel reason. Some packages (<code>node-sass</code>, old <code>bcrypt</code>, <code>sqlite3</code>, <code>sharp</code>) contain C/C++ code. On install they try to download a prebuilt binary for <em>your</em> Node version and CPU; if none exists — new Node, Apple silicon — they compile from source with <code>node-gyp</code>, which needs Python and a C++ toolchain of the right era. In a throw-away folder on Node 26:'
  : 'Dự án Node cũ hỏng vì một lý do song song. Vài gói (<code>node-sass</code>, <code>bcrypt</code> bản cũ, <code>sqlite3</code>, <code>sharp</code>) có mã C/C++. Khi cài, chúng cố tải bản dựng sẵn cho đúng phiên bản Node và CPU <em>của bạn</em>; không có — Node mới, chip Apple — thì chúng biên dịch từ nguồn bằng <code>node-gyp</code>, thứ cần Python và bộ công cụ C++ đúng thời. Trong một thư mục tạm, với Node 26:'}</p>
${O12_SASS}
<p>${en
  ? '<code>node-sass</code> 4.14 brings <code>node-gyp</code> 3.8, which only knows Python 2 — and macOS has had no Python 2 for years. Three honest options, in order: (1) use the Node version the project used (<code>.nvmrc</code>, or <code>engines</code> in <code>package.json</code>, or the CI file); (2) if the package is deprecated, replace it — <code>node-sass</code> is deprecated in favour of <code>sass</code> (Dart Sass), which has no native code; (3) only then fight the toolchain. Option 2 is a change to the project: propose it, do not slip it in.'
  : '<code>node-sass</code> 4.14 kéo theo <code>node-gyp</code> 3.8, bản chỉ biết Python 2 — mà macOS đã bỏ Python 2 từ nhiều năm. Ba lựa chọn tử tế, theo thứ tự: (1) dùng đúng bản Node dự án từng dùng (<code>.nvmrc</code>, hoặc <code>engines</code> trong <code>package.json</code>, hoặc tệp CI); (2) nếu gói đã bị bỏ thì thay — <code>node-sass</code> đã ngừng phát triển, thay bằng <code>sass</code> (Dart Sass) không có mã native; (3) lúc đó mới vật lộn với bộ công cụ. Lựa chọn 2 là thay đổi dự án: đề xuất, đừng lén đưa vào.'}</p>

<h3>${en ? 'Pin the versions so the next person does not suffer' : 'Ghim phiên bản để người sau không khổ'}</h3>
${C12_PIN}
<p>${en
  ? 'On Windows there is no SDKMAN: install each JDK into its own folder and set <code>JAVA_HOME</code> per terminal (<code>set JAVA_HOME=C:\\jdk\\zulu8</code> in cmd, <code>$env:JAVA_HOME="C:\\jdk\\zulu8"</code> in PowerShell), or use the IDE’s per-project SDK setting. For Node, nvm-windows or fnm. Whatever the tool, the rule is the same: the project decides the version, not your machine.'
  : 'Trên Windows không có SDKMAN: cài mỗi JDK vào một thư mục riêng và đặt <code>JAVA_HOME</code> theo từng cửa sổ terminal (<code>set JAVA_HOME=C:\\jdk\\zulu8</code> trong cmd, <code>$env:JAVA_HOME="C:\\jdk\\zulu8"</code> trong PowerShell), hoặc dùng thiết lập SDK theo dự án của IDE. Với Node, dùng nvm-windows hoặc fnm. Công cụ nào cũng vậy, luật chỉ có một: dự án quyết định phiên bản, không phải máy bạn.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The company gives you a Windows laptop; the project was written on Linux servers. The build passes but the PDF report shows “MÆ°á»£n”. Your teammate on a Mac sees no problem. Before touching any report code, check the build encoding warning and the JDK each of you uses — the difference is in the machines, not the code.'
  : 'Công ty phát máy Windows; dự án viết trên server Linux. Build qua nhưng báo cáo PDF hiện "MÆ°á»£n". Bạn cùng nhóm dùng Mac thì không thấy lỗi. Trước khi đụng vào code báo cáo, kiểm cảnh báo bảng mã khi build và JDK mỗi người đang dùng — chỗ khác nhau nằm ở máy, không ở code.'}</p>

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Build the lab with your daily JDK (17 or 21) and copy the first error into your notebook. Then build with JDK 8.' : 'Build lab bằng JDK bạn dùng hằng ngày (17 hoặc 21) và chép lỗi đầu tiên vào nhật ký. Rồi build bằng JDK 8.'}</li>
<li>${en ? 'Run <code>javap -v -cp target/classes com.thuvien.util.TokenUtil | grep major</code> and write the number and its Java version.' : 'Chạy <code>javap -v -cp target/classes com.thuvien.util.TokenUtil | grep major</code>, ghi con số và bản Java tương ứng.'}</li>
<li>${en ? 'Add a <code>.sdkmanrc</code> (Mac/Linux) or a one-line note “JAVA_HOME = JDK 8” (Windows) to your notebook’s README draft.' : 'Thêm <code>.sdkmanrc</code> (Mac/Linux) hoặc một dòng ghi chú "JAVA_HOME = JDK 8" (Windows) vào bản nháp README trong nhật ký.'}</li>
<li>${en ? 'Windows users: build once without <code>-Dproject.build.sourceEncoding=UTF-8</code> and once with it; compare the borrow message in the browser.' : 'Ai dùng Windows: build một lần không có <code>-Dproject.build.sourceEncoding=UTF-8</code> và một lần có; so câu báo mượn sách trên trình duyệt.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your notebook has the exact JDK-21 error, <code>major version: 52</code>, and a pinned JDK version for the repo.' : 'nhật ký có lỗi nguyên văn với JDK 21, dòng <code>major version: 52</code>, và phiên bản JDK đã ghim cho repo.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Class file major version', 'số phiên bản tệp class', '52 = Java 8, 55 = 11, 61 = 17, 65 = 21; JVM từ chối số lớn hơn nó.', '52 = Java 8, 55 = 11, 61 = 17, 65 = 21; a JVM rejects higher numbers.'],
  ['--release', 'cờ đích biên dịch', 'Biên dịch cho một bản Java cũ hơn, kiểm cả API được dùng.', 'Compile for an older Java, including checking the APIs used.'],
  ['JEP (JDK Enhancement Proposal)', 'đề xuất cải tiến JDK', 'Văn bản chính thức của mỗi thay đổi lớn trong JDK (JEP 320 gỡ JAXB).', 'The official document for each big JDK change (JEP 320 removed JAXB).'],
  ['Platform encoding', 'bảng mã mặc định của máy', 'Bảng mã Java dùng khi không ai khai; khác nhau giữa Windows và Mac/Linux.', 'The encoding Java falls back to when none is set; differs between Windows and Mac/Linux.'],
  ['Native module', 'module viết bằng C/C++', 'Gói npm có mã máy, phải tải bản dựng sẵn hoặc tự biên dịch.', 'An npm package with compiled code; needs a prebuilt binary or a local build.'],
  ['node-gyp', 'công cụ biên dịch addon Node', 'Biên dịch module native; bản cũ cần Python 2.', 'Builds native modules; old versions need Python 2.'],
  ['.sdkmanrc / .nvmrc', 'tệp ghim phiên bản', 'Ghi bản JDK / Node của dự án để công cụ tự chọn.', 'Records the project’s JDK / Node version for the tools to pick.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Old projects break because your machine is newer: build with the JDK/Node the project used.' : 'Dự án cũ hỏng vì máy bạn mới hơn: build bằng JDK/Node mà dự án từng dùng.'}</li>
<li>${en ? '<code>javax.xml.bind</code> left the JDK in 11 (JEP 320); maven-war-plugin 2.2 breaks on modern JDKs.' : '<code>javax.xml.bind</code> rời JDK từ bản 11 (JEP 320); maven-war-plugin 2.2 hỏng trên JDK mới.'}</li>
<li>${en ? 'Class versions: 52/55/61/65 = Java 8/11/17/21; <code>javap -v</code> tells you.' : 'Phiên bản class: 52/55/61/65 = Java 8/11/17/21; <code>javap -v</code> cho biết.'}</li>
<li>${en ? 'No source encoding in the POM ⇒ Vietnamese strings break on Windows before JDK 18.' : 'POM không khai bảng mã ⇒ chuỗi tiếng Việt hỏng trên Windows trước JDK 18.'}</li>
<li>${en ? 'Node native modules fail on new Node/CPUs; use the old Node, or replace deprecated packages by proposal.' : 'Module native của Node hỏng trên Node/CPU mới; dùng Node cũ, hoặc đề xuất thay gói đã bỏ.'}</li>
</ul>

${tl('https://openjdk.org/jeps/320', '☕', 'JEP 320 — Remove the Java EE and CORBA Modules', en ? 'Why javax.xml.bind is gone from JDK 11' : 'Vì sao javax.xml.bind biến mất khỏi JDK 11')}
${tl('https://openjdk.org/jeps/400', '☕', 'JEP 400 — UTF-8 by Default (JDK 18)', en ? 'The end of the Windows platform-encoding trap' : 'Dấu chấm hết cho bẫy bảng mã trên Windows')}
${tl('https://sdkman.io/', '🧰', 'SDKMAN!', en ? '.sdkmanrc and sdk env' : '.sdkmanrc và sdk env')}
${lk(bai('ide-va-do-nghe-dev', 'ide-2-1-du-an'), '🛠️', en ? 'IDE course 2.1 — Projects in IntelliJ' : 'Khoá IDE 2.1 — Dự án trong IntelliJ', en ? 'Per-project SDK so each project gets its own JDK' : 'SDK theo dự án để mỗi dự án có JDK riêng')}
`
);

/* ═══════════════════ 1.3 — Maven trong dự án thật ═══════════════════ */
const O13_TREE = out(`
$ mvn -B dependency:tree
[INFO] --- dependency:3.7.0:tree (default-cli) @ thuvien ---
[INFO] com.thuvien:thuvien:war:1.0-SNAPSHOT
[INFO] +- javax.servlet:javax.servlet-api:jar:3.1.0:provided
[INFO] +- javax.servlet.jsp:javax.servlet.jsp-api:jar:2.3.1:provided
[INFO] +- javax.servlet:jstl:jar:1.2:compile
[INFO] +- mysql:mysql-connector-java:jar:5.1.49:compile
[INFO] +- log4j:log4j:jar:1.2.17:compile
[INFO] +- commons-lang:commons-lang:jar:2.6:compile
[INFO] \\- junit:junit:jar:4.12:test
[INFO]    \\- org.hamcrest:hamcrest-core:jar:1.3:test
`
);
const O13_NEAREST = out(`
# Thử nghiệm: thêm commons-beanutils 1.9.4 (kéo theo commons-collections 3.2.2)
# và một dòng commons-collections 3.2.1 khai thẳng — kiểu một người cũ từng thêm "cho chắc"
$ mvn -B dependency:tree -Dverbose -Dincludes=commons-collections,commons-beanutils,commons-logging
[INFO] com.thuvien:thuvien:war:1.0-SNAPSHOT
[INFO] +- commons-beanutils:commons-beanutils:jar:1.9.4:compile
[INFO] |  +- commons-logging:commons-logging:jar:1.2:compile
[INFO] |  \\- (commons-collections:commons-collections:jar:3.2.2:compile - omitted for conflict with 3.2.1)
[INFO] \\- commons-collections:commons-collections:jar:3.2.1:compile
`
);
const O13_HTTP = out(`
# POM cũ trỏ tới Nexus nội bộ của công ty bằng http://
$ mvn -B -q package
[ERROR] Failed to execute goal on project thuvien: Could not collect dependencies for project com.thuvien:thuvien:war:1.0-SNAPSHOT
[ERROR] Failed to read artifact descriptor for com.thuvien:thuvien-common:jar:1.0.3
[ERROR] 	Caused by: The following artifacts could not be resolved: com.thuvien:thuvien-common:pom:1.0.3 (absent): Could not transfer artifact com.thuvien:thuvien-common:pom:1.0.3 from/to maven-default-http-blocker (http://0.0.0.0/): Blocked mirror for repositories: [thuvien-nexus (http://nexus.thuvien.local:8081/repository/maven-releases/, default, releases+snapshots)]
`
);
const C13_SETTINGS = xml(`
<!-- ~/.m2/settings.xml  (Windows: C:\\Users\\<tên>\\.m2\\settings.xml) — KHÔNG nằm trong repo dự án -->
<settings>
  <mirrors>
    <mirror>
      <id>company-nexus</id>
      <mirrorOf>*</mirrorOf>                         <!-- mọi kho đều đi qua Nexus công ty -->
      <url>https://nexus.congty.example/repository/maven-public/</url>
    </mirror>
  </mirrors>
  <servers>
    <server>
      <id>company-nexus</id>                         <!-- trùng id của mirror -->
      <username>ten.ban</username>
      <password>{mã-hoá-bằng mvn --encrypt-password}</password>
    </server>
  </servers>
</settings>
`
);
const C13_EXCL = xml(`
<dependency>
  <groupId>commons-beanutils</groupId>
  <artifactId>commons-beanutils</artifactId>
  <version>1.9.4</version>
  <exclusions>                                        <!-- cắt một nhánh bắc cầu cụ thể -->
    <exclusion>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
`
);

const L13 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Getting an old project to run' : 'Chương 1 · Dựng chạy một dự án cũ'}</span>
<h2>${en ? '1.3 — Maven for real projects: multi-module, dependency conflicts, internal repos' : '1.3 — Maven trong dự án thật: nhiều module, xung đột phụ thuộc, kho nội bộ'}</h2>
<p class="lead">${en
  ? 'At university Maven “just downloads things”. In a company project it is where half of the day-one problems live: a library that comes in through three paths with three versions, a repository only reachable on the office VPN, a module that must be built before another. This lesson gives you the five commands and two files you need to get unstuck.'
  : 'Ở trường, Maven "tự tải về là xong". Trong dự án công ty, nó là chỗ trú của một nửa số rắc rối ngày đầu: một thư viện đi vào qua ba ngả với ba phiên bản, một kho thư viện chỉ vào được khi bật VPN văn phòng, một module phải build trước module khác. Bài này cho bạn năm lệnh và hai tệp cần biết để gỡ kẹt.'}</p>
${moiTruong(en)}

<h3>${en ? 'See what you really depend on: dependency:tree' : 'Xem thật sự mình phụ thuộc vào gì: dependency:tree'}</h3>
${O13_TREE}
<p>${en
  ? 'Read the tree like a family tree: <code>+-</code> is a child, <code>\\-</code> the last child, indentation is “brought in by”. The last part of each line is the <strong>scope</strong>: <code>compile</code> goes into the WAR, <code>provided</code> is supplied by Tomcat, <code>test</code> is only for tests. The lab is small, so every dependency is direct. In a real project the tree is hundreds of lines; pipe it to a file and search it.'
  : 'Đọc cây như đọc gia phả: <code>+-</code> là con, <code>\\-</code> là con út, thụt lề nghĩa là "do ai kéo vào". Phần cuối mỗi dòng là <strong>scope (phạm vi)</strong>: <code>compile</code> đóng vào WAR, <code>provided</code> do Tomcat cung cấp, <code>test</code> chỉ dùng cho test. Lab nhỏ nên mọi phụ thuộc đều trực tiếp. Dự án thật thì cây dài hàng trăm dòng; xuất ra tệp rồi tìm trong đó.'}</p>

<h3>${en ? 'Conflicts: “nearest wins”, even when nearest is worse' : 'Xung đột: "gần nhất thắng", kể cả khi gần nhất tệ hơn'}</h3>
<p>${en
  ? 'When two paths bring two versions of one library, Maven does not pick the newest. It picks the one <strong>nearest to your POM</strong> in the tree (a direct dependency beats a transitive one); on a tie, the one declared first. We reproduced a classic case:'
  : 'Khi hai ngả mang tới hai phiên bản của cùng một thư viện, Maven không chọn bản mới nhất. Nó chọn bản <strong>gần POM của bạn nhất</strong> trên cây (phụ thuộc trực tiếp thắng phụ thuộc bắc cầu); bằng nhau thì bản khai trước thắng. Chúng tôi tái hiện một ca kinh điển:'}</p>
${O13_NEAREST}
<p>${en
  ? '<code>commons-beanutils</code> asked for <code>commons-collections 3.2.2</code>; an old direct line asked for <code>3.2.1</code>; the direct one is nearer, so <strong>3.2.1 wins</strong> and 3.2.2 is “omitted for conflict”. That matters: 3.2.2 was released to fix a well-known deserialization vulnerability in 3.2.1 — exactly the kind of thing Chapter 6’s scanners flag. <code>-Dverbose</code> is what shows the losing versions; without it they are invisible. To steer the result, use <code>&lt;dependencyManagement&gt;</code> to pin one version for the whole project, or <code>&lt;exclusions&gt;</code> to cut one transitive branch:'
  : '<code>commons-beanutils</code> xin <code>commons-collections 3.2.2</code>; một dòng khai trực tiếp từ xưa xin <code>3.2.1</code>; dòng trực tiếp gần hơn nên <strong>3.2.1 thắng</strong> và 3.2.2 bị "omitted for conflict". Chuyện này quan trọng: 3.2.2 ra đời để vá một lỗ hổng deserialization nổi tiếng của 3.2.1 — đúng loại thứ mà máy quét ở Chương 6 sẽ bắt. Chính <code>-Dverbose</code> làm lộ các bản thua; thiếu nó, chúng vô hình. Muốn điều khiển kết quả: dùng <code>&lt;dependencyManagement&gt;</code> để ghim một bản cho cả dự án, hoặc <code>&lt;exclusions&gt;</code> để cắt một nhánh bắc cầu:'}</p>
${C13_EXCL}

<h3>${en ? 'Internal repositories, settings.xml — and never committing the password' : 'Kho nội bộ, settings.xml — và đừng bao giờ commit mật khẩu'}</h3>
<p>${en
  ? 'Companies run an internal repository (Sonatype Nexus or JFrog Artifactory) that caches Maven Central and stores the company’s own libraries, such as a shared <code>xxx-common</code> jar. Old POMs point to it with <code>http://</code>. Since <strong>Maven 3.8.1 (2021)</strong> external HTTP repositories are blocked by default, to stop man-in-the-middle attacks (CVE-2021-26291). The error looks like this — real output, with a fictional company host:'
  : 'Công ty thường có một kho thư viện nội bộ (Sonatype Nexus hoặc JFrog Artifactory) vừa đệm Maven Central vừa chứa thư viện riêng của công ty, kiểu jar <code>xxx-common</code> dùng chung. POM cũ trỏ tới nó bằng <code>http://</code>. Từ <strong>Maven 3.8.1 (2021)</strong>, kho HTTP bên ngoài bị chặn mặc định để chống tấn công xen giữa (CVE-2021-26291). Lỗi trông như sau — output thật, với tên máy công ty hư cấu:'}</p>
${O13_HTTP}
<p>${en
  ? 'The word to spot is <code>maven-default-http-blocker</code>. Do not “fix” it by downgrading Maven or unblocking HTTP in your global settings. Ask for the HTTPS URL of the company repository and configure it as a mirror in <strong>your</strong> <code>~/.m2/settings.xml</code> — a file that lives on your machine, not in the project:'
  : 'Chữ cần nhận ra là <code>maven-default-http-blocker</code>. Đừng "sửa" bằng cách hạ Maven hay mở chặn HTTP trong cấu hình chung. Hỏi địa chỉ HTTPS của kho công ty rồi khai nó làm mirror trong <code>~/.m2/settings.xml</code> <strong>của bạn</strong> — tệp nằm trên máy bạn, không nằm trong dự án:'}</p>
${C13_SETTINGS}
<div class="callout danger"><p>${en
  ? '<strong>Never commit credentials.</strong> The repository password goes in <code>~/.m2/settings.xml</code> (ideally encrypted with <code>mvn --encrypt-master-password</code> / <code>--encrypt-password</code>), never in <code>pom.xml</code> or a <code>settings.xml</code> inside the repo. This repo has a secret scanner (gitleaks) for exactly this reason.'
  : '<strong>Không bao giờ commit thông tin đăng nhập.</strong> Mật khẩu kho để trong <code>~/.m2/settings.xml</code> (tốt nhất mã hoá bằng <code>mvn --encrypt-master-password</code> / <code>--encrypt-password</code>), không bao giờ trong <code>pom.xml</code> hay một <code>settings.xml</code> nằm trong repo. Repo của trang này có máy quét bí mật (gitleaks) chính vì lý do đó.'}</p></div>

<h3>${en ? 'Five commands for getting unstuck' : 'Năm lệnh để gỡ kẹt'}</h3>
<table>
<thead><tr><th>${en ? 'Command' : 'Lệnh'}</th><th>${en ? 'When' : 'Khi nào'}</th></tr></thead>
<tbody>
<tr><td><code>mvn -B dependency:tree -Dverbose</code></td><td>${en ? '“Which version of X do I actually get, and through whom?”' : '"Thật ra mình nhận bản X nào, qua ai?"'}</td></tr>
<tr><td><code>mvn help:effective-pom</code></td><td>${en ? 'The POM after parents and profiles are merged — what Maven really uses' : 'POM sau khi gộp parent và profile — thứ Maven thật sự dùng'}</td></tr>
<tr><td><code>mvn -U package</code></td><td>${en ? 'Force re-checking remote repositories (stale SNAPSHOTs, a dependency that was missing yesterday)' : 'Buộc hỏi lại kho từ xa (SNAPSHOT cũ, thư viện hôm qua còn thiếu)'}</td></tr>
<tr><td><code>mvn -o package</code></td><td>${en ? 'Offline: build only from <code>~/.m2</code> (on the train, VPN down). Works on the lab after one online build.' : 'Ngoại tuyến: chỉ build từ <code>~/.m2</code> (trên xe, mất VPN). Lab chạy được sau một lần build có mạng.'}</td></tr>
<tr><td><code>mvn -pl web -am package</code></td><td>${en ? 'Multi-module: build module <code>web</code> and the modules it needs (<code>-am</code> = also make)' : 'Nhiều module: build module <code>web</code> và những module nó cần (<code>-am</code> = also make)'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Multi-module projects and Gradle, at reading level' : 'Dự án nhiều module và Gradle, ở mức đọc hiểu'}</h3>
<p>${en
  ? 'A parent POM with <code>&lt;packaging&gt;pom&lt;/packaging&gt;</code> and a <code>&lt;modules&gt;</code> list (<code>common</code>, <code>service</code>, <code>web</code>) is the usual shape of a bigger Java project. Two consequences: build from the parent folder (or use <code>-pl … -am</code>), and versions for all modules usually live in the parent’s <code>&lt;dependencyManagement&gt;</code>. If you meet Gradle instead (<code>build.gradle</code>, <code>settings.gradle</code>), the same questions apply: <code>./gradlew dependencies</code> is the tree, the wrapper (<code>gradlew</code>) pins the Gradle version — always use the wrapper, never your own Gradle.'
  : 'Một POM cha có <code>&lt;packaging&gt;pom&lt;/packaging&gt;</code> và danh sách <code>&lt;modules&gt;</code> (<code>common</code>, <code>service</code>, <code>web</code>) là hình dạng quen thuộc của dự án Java lớn hơn. Hai hệ quả: build từ thư mục cha (hoặc dùng <code>-pl … -am</code>), và phiên bản cho mọi module thường nằm trong <code>&lt;dependencyManagement&gt;</code> của cha. Gặp Gradle thay vì Maven (<code>build.gradle</code>, <code>settings.gradle</code>) thì vẫn những câu hỏi đó: <code>./gradlew dependencies</code> là cây phụ thuộc, wrapper (<code>gradlew</code>) ghim phiên bản Gradle — luôn dùng wrapper, đừng dùng Gradle cài trên máy bạn.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Day two: the build fails on <code>xxx-common:1.0.3</code>. A teammate sends you their whole <code>settings.xml</code> on chat, password included. Thank them, delete the message, and ask the lead how new members get their own repository account. You now know enough to say exactly what you need: “an account and the HTTPS URL for the Nexus mirror”.'
  : 'Ngày thứ hai: build hỏng ở <code>xxx-common:1.0.3</code>. Một bạn trong nhóm gửi nguyên tệp <code>settings.xml</code> của họ qua chat, kèm cả mật khẩu. Cảm ơn, xoá tin nhắn, và hỏi leader cách thành viên mới được cấp tài khoản kho riêng. Giờ bạn đủ hiểu để nói chính xác mình cần gì: "một tài khoản và địa chỉ HTTPS của mirror Nexus".'}</p>

<h3>🧪 ${en ? 'Practice (15 minutes)' : 'Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Run <code>mvn -B dependency:tree</code> on the lab and mark each line compile/provided/test. Which three jars that are <code>compile</code> look the oldest to you?' : 'Chạy <code>mvn -B dependency:tree</code> trên lab và đánh dấu từng dòng compile/provided/test. Ba jar <code>compile</code> nào trông cũ nhất?'}</li>
<li>${en ? 'In a copy of the repo (<code>cp -R legacy-thu-vien /tmp/thu-dep</code>), add the two dependencies from the experiment above and reproduce “omitted for conflict with 3.2.1”. Then delete the copy.' : 'Trong một bản sao repo (<code>cp -R legacy-thu-vien /tmp/thu-dep</code>), thêm hai dependency như thử nghiệm ở trên và tái hiện dòng "omitted for conflict with 3.2.1". Xong thì xoá bản sao.'}</li>
<li>${en ? 'Run <code>mvn -o -q package -DskipTests</code> on the lab with Wi-Fi off. Does it work? Why?' : 'Tắt Wi-Fi rồi chạy <code>mvn -o -q package -DskipTests</code> trên lab. Có chạy không? Vì sao?'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you can explain, from the verbose tree, which version won and why — and you did not change the lab repo itself.' : 'bạn giải thích được, từ cây verbose, bản nào thắng và vì sao — và repo lab không bị sửa gì.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Transitive dependency', 'phụ thuộc bắc cầu', 'Thư viện mà thư viện của bạn kéo vào.', 'A library your libraries bring in.'],
  ['Nearest wins', 'gần nhất thắng', 'Luật Maven chọn bản gần POM nhất khi xung đột, không phải bản mới nhất.', 'Maven’s rule: the version nearest your POM wins a conflict, not the newest.'],
  ['dependencyManagement', 'quản lý phiên bản tập trung', 'Ghim phiên bản một lần cho cả dự án/module con.', 'Pins versions once for the whole project and its modules.'],
  ['Exclusion', 'loại trừ', 'Cắt một phụ thuộc bắc cầu cụ thể khỏi một dependency.', 'Removes one specific transitive dependency.'],
  ['Mirror', 'kho thay thế', 'Kho mà Maven dùng thay cho kho gốc (thường là Nexus công ty).', 'A repository Maven uses instead of the original (often the company Nexus).'],
  ['Nexus / Artifactory', 'kho thư viện nội bộ', 'Máy chủ công ty đệm Maven Central và chứa thư viện riêng.', 'The company server caching Maven Central and hosting private libraries.'],
  ['SNAPSHOT', 'bản đang phát triển', 'Phiên bản có thể thay đổi; -U buộc tải lại.', 'A version that may change; -U forces a re-check.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? '<code>dependency:tree -Dverbose</code> shows what you really get, including the losers.' : '<code>dependency:tree -Dverbose</code> cho thấy thứ bạn thật sự nhận, kể cả bản thua.'}</li>
<li>${en ? 'Nearest wins, not newest — an old direct line can pin a vulnerable version.' : 'Gần nhất thắng, không phải mới nhất — một dòng trực tiếp cũ có thể ghim bản có lỗ hổng.'}</li>
<li>${en ? '<code>maven-default-http-blocker</code> = an http:// repository blocked since Maven 3.8.1; ask for HTTPS.' : '<code>maven-default-http-blocker</code> = kho http:// bị chặn từ Maven 3.8.1; xin địa chỉ HTTPS.'}</li>
<li>${en ? 'Company repo config and passwords live in <code>~/.m2/settings.xml</code>, never in the repo.' : 'Cấu hình kho công ty và mật khẩu ở <code>~/.m2/settings.xml</code>, không bao giờ trong repo.'}</li>
<li>${en ? 'Multi-module: build from the parent or with <code>-pl … -am</code>; Gradle: always <code>./gradlew</code>.' : 'Nhiều module: build từ thư mục cha hoặc <code>-pl … -am</code>; Gradle: luôn <code>./gradlew</code>.'}</li>
</ul>

${tl('https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html', '📘', 'Maven — Introduction to the Dependency Mechanism', en ? 'Dependency mediation (nearest definition), scopes, exclusions' : 'Hoà giải phụ thuộc (định nghĩa gần nhất), scope, exclusion')}
${tl('https://maven.apache.org/docs/3.8.1/release-notes.html', '📘', 'Maven 3.8.1 release notes', en ? 'Blocking external HTTP repositories, CVE-2021-26291' : 'Chặn kho HTTP bên ngoài, CVE-2021-26291')}
${tl('https://maven.apache.org/guides/mini/guide-encryption.html', '🔐', 'Maven — Password Encryption', 'settings-security.xml')}
`
);

/* ═══════════════════ 1.4 — Dump, dữ liệu mẫu, Docker Compose ═══════════════════ */
const O14_1419 = out(`
# Nạp dump bằng tài khoản ứng dụng "thuvien" (không phải root) vào một MySQL 8.0 mới
$ docker exec -i lgc-mysql80-test mysql -uthuvien -pthuvien thuvien < db/thuvien.sql
ERROR 1419 (HY000) at line 109: You do not have the SUPER privilege and binary logging is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)
$ docker exec lgc-mysql80-test mysql -uthuvien -pthuvien thuvien -e "SHOW TRIGGERS; SELECT COUNT(*) AS so_phieu FROM loans"
so_phieu
5
`
);
const O14_1227 = out(`
# Quản trị viên bật log_bin_trust_function_creators, nạp lại — lộ lỗi thứ hai
$ docker exec -i lgc-mysql80-test mysql -uthuvien -pthuvien thuvien < db/thuvien.sql
ERROR 1227 (42000) at line 109: Access denied; you need (at least one of) the SUPER or SET_USER_ID privilege(s) for this operation
# Bỏ mệnh đề DEFINER=\`root\`@\`%\` khỏi dump rồi nạp
$ sed -E 's/DEFINER=\`[^\`]+\`@\`[^\`]+\`//' db/thuvien.sql | docker exec -i lgc-mysql80-test mysql -uthuvien -pthuvien thuvien
$ docker exec lgc-mysql80-test mysql -uthuvien -pthuvien thuvien -e "SELECT TRIGGER_NAME, DEFINER FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA='thuvien'"
TRIGGER_NAME	DEFINER
trg_loans_ai	thuvien@%
`
);
const O14_PKR = out(`
$ java -cp .:mysql-connector-java-5.1.49.jar ThuKetNoi 'jdbc:mysql://127.0.0.1:18317/mysql?useSSL=false'
Exception in thread "main" com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException: Public Key Retrieval is not allowed
$ java -cp .:mysql-connector-java-5.1.49.jar ThuKetNoi 'jdbc:mysql://127.0.0.1:18317/mysql?useSSL=false&allowPublicKeyRetrieval=true'
OK, MySQL 8.4.13
$ java -cp .:mysql-connector-java-5.1.49.jar ThuKetNoi 'jdbc:mysql://127.0.0.1:18317/mysql?useSSL=false'
OK, MySQL 8.4.13
$ docker restart lgc-mysql84-test
$ java -cp .:mysql-connector-java-5.1.49.jar ThuKetNoi 'jdbc:mysql://127.0.0.1:18317/mysql?useSSL=false'
Exception in thread "main" com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException: Public Key Retrieval is not allowed
`
);
const C14_COMPOSE = bash(`
# docker-compose.yml của lab (rút gọn)
name: lgc-thuvien
services:
  db:
    image: mysql:8.0                      # khớp với bản production, KHÔNG phải "latest"
    environment:
      MYSQL_ROOT_PASSWORD: "123456"       # mật khẩu LAB — không bao giờ dùng mật khẩu thật ở đây
    ports: ["18306:3306"]
    volumes:
      - ./db/thuvien.sql:/docker-entrypoint-initdb.d/01-thuvien.sql:ro   # chạy MỘT lần, khi volume còn rỗng
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-p123456"]
  web:
    build: .
    environment:
      DB_URL: "jdbc:mysql://db:3306/thuvien?…&useSSL=false&allowPublicKeyRetrieval=true"   # "db" = tên service
    ports: ["18080:8080"]
    depends_on:
      db: { condition: service_healthy }  # chờ MySQL nhận kết nối thật, không chỉ "đã khởi động"
volumes:
  mysql-data:
`
);
const O14_DUMP = out(`
$ docker compose exec -T db mysqldump -uroot -p123456 --routines --triggers --single-transaction thuvien > /tmp/thuvien-$(date +%F).sql
mysqldump: [Warning] Using a password on the command line interface can be insecure.
$ grep -n "Server version\\|DEFINER\\|CHARSET=" /tmp/thuvien-2026-11-22.sql | head -4
5:-- Server version	8.0.46
33:) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
66:) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
87:/*!50003 CREATE*/ /*!50017 DEFINER=\`root\`@\`%\`*/ /*!50003 TRIGGER \`trg_loans_ai\` AFTER INSERT ON \`loans\` FOR EACH ROW BEGIN
`
);
const S14_MASK = sql(`
-- Che dữ liệu cá nhân trong bản sao (chạy trên CSDL lab, KHÔNG BAO GIỜ trên production)
UPDATE readers SET name = CONCAT('Độc giả ', id), phone = CONCAT('0900', LPAD(id, 6, '0'));
UPDATE users SET password = 'lab-only', full_name = CONCAT('Nhân viên ', id);
`
);
const O14_MASK = out(`
+----+----------------+-------+------------+
| id | name           | type  | phone      |
+----+----------------+-------+------------+
|  1 | Độc giả 1 | SV    | 0900000001 |
|  2 | Độc giả 2 | SV    | 0900000002 |
|  3 | Độc giả 3 | GV    | 0900000003 |
|  4 | Độc giả 4 | KHACH | 0900000004 |
|  5 | Độc giả 5 | SV    | 0900000005 |
+----+----------------+-------+------------+
`
);

const L14 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Getting an old project to run' : 'Chương 1 · Dựng chạy một dự án cũ'}</span>
<h2>${en ? '1.4 — Database dump, seed data and a Docker Compose for the old stack' : '1.4 — Dump cơ sở dữ liệu, dữ liệu mẫu và Docker Compose cho stack cũ'}</h2>
<p class="lead">${en
  ? 'An old app without its database is a car without fuel. You will usually receive a dump file from a teammate, a shared drive or an ancient email — and restoring it fails in ways that have nothing to do with SQL. This lesson restores the lab dump the hard way first, so you meet the two real MySQL errors, then shows why a Docker Compose file makes the whole team’s setup identical, and ends with the one rule about customer data you must never break.'
  : 'Ứng dụng cũ mà thiếu CSDL thì như xe không xăng. Thường bạn nhận một tệp dump từ đồng nghiệp, ổ chia sẻ hay một email rất cũ — và nạp nó thất bại theo những cách chẳng liên quan gì tới SQL. Bài này nạp dump của lab theo đường khó trước để bạn gặp hai lỗi MySQL thật, rồi cho thấy vì sao một tệp Docker Compose làm môi trường của cả nhóm giống hệt nhau, và kết bằng một luật về dữ liệu khách hàng không bao giờ được phá.'}</p>
${moiTruong(en)}

<h3>${en ? 'Read the dump before you load it' : 'Đọc dump trước khi nạp'}</h3>
<p>${en
  ? 'Open <code>db/thuvien.sql</code> in an editor (not in a GUI tool yet). The first lines say <code>MySQL dump 10.13 Distrib 5.7.29, for Win64</code> — it was exported from MySQL 5.7 on Windows. Then search for four words: <code>CREATE TABLE</code> (the schema), <code>INSERT</code> (the data), <code>TRIGGER</code> and <code>PROCEDURE</code> (logic living in the database — lesson 2.3), and <code>DEFINER</code> (who those objects run as). You learn more from those five searches than from the README.'
  : 'Mở <code>db/thuvien.sql</code> bằng trình soạn thảo (chưa dùng công cụ đồ hoạ vội). Mấy dòng đầu ghi <code>MySQL dump 10.13 Distrib 5.7.29, for Win64</code> — nó được xuất từ MySQL 5.7 trên Windows. Rồi tìm bốn chữ: <code>CREATE TABLE</code> (schema), <code>INSERT</code> (dữ liệu), <code>TRIGGER</code> và <code>PROCEDURE</code> (logic sống trong CSDL — bài 2.3), và <code>DEFINER</code> (các đối tượng đó chạy dưới danh nghĩa ai). Năm lần tìm này dạy bạn nhiều hơn README.'}</p>

<h3>${en ? 'Restoring as the application user: two errors in a row' : 'Nạp bằng tài khoản ứng dụng: hai lỗi liên tiếp'}</h3>
<p>${en
  ? 'In company environments you rarely get <code>root</code>; you get an account for one database. We tried exactly that on a fresh MySQL 8.0:'
  : 'Ở môi trường công ty bạn hiếm khi được <code>root</code>; bạn nhận một tài khoản cho đúng một CSDL. Chúng tôi thử đúng như thế trên một MySQL 8.0 mới:'}</p>
${O14_1419}
<p>${en
  ? 'Read the second command: the tables and 5 loans are there, but <code>SHOW TRIGGERS</code> returns nothing. The dump stopped at line 109 — <strong>a half-loaded database that looks fine</strong>. The app would start, borrowing would work, and the available count would silently stop decreasing, because the logic lived in the trigger that was never created. Always check what a failed restore left behind.'
  : 'Đọc lệnh thứ hai: bảng và 5 phiếu mượn có đủ, nhưng <code>SHOW TRIGGERS</code> không trả gì. Dump dừng ở dòng 109 — <strong>một CSDL nạp dở dang mà trông vẫn ổn</strong>. Ứng dụng vẫn khởi động, mượn sách vẫn chạy, và số sách còn lại lặng lẽ không giảm nữa, vì logic nằm trong trigger chưa từng được tạo. Luôn kiểm xem một lần nạp hỏng đã để lại những gì.'}</p>
${O14_1227}
<table>
<thead><tr><th>${en ? 'Error' : 'Lỗi'}</th><th>${en ? 'Meaning' : 'Ý nghĩa'}</th><th>${en ? 'Who fixes it, how' : 'Ai sửa, sửa thế nào'}</th></tr></thead>
<tbody>
<tr><td>1419</td><td>${en ? 'Binary logging is on; creating triggers/routines without SUPER needs <code>log_bin_trust_function_creators=1</code>' : 'Binary log đang bật; tạo trigger/routine mà không có SUPER thì cần <code>log_bin_trust_function_creators=1</code>'}</td><td>${en ? 'The DBA (a server setting), or restore as an admin' : 'DBA (thiết lập máy chủ), hoặc nạp bằng tài khoản quản trị'}</td></tr>
<tr><td>1227</td><td>${en ? 'The dump says the trigger runs as <code>root@%</code>; you may not create objects on behalf of another user' : 'Dump ghi trigger chạy dưới danh nghĩa <code>root@%</code>; bạn không được tạo đối tượng thay người khác'}</td><td>${en ? 'Strip <code>DEFINER=…</code> (objects become yours), or restore as an admin' : 'Bỏ <code>DEFINER=…</code> (đối tượng thành của bạn), hoặc nạp bằng tài khoản quản trị'}</td></tr>
</tbody>
</table>

<h3>${en ? 'The old driver meets MySQL 8: “Public Key Retrieval is not allowed”' : 'Driver cũ gặp MySQL 8: "Public Key Retrieval is not allowed"'}</h3>
<p>${en
  ? 'MySQL 8 authenticates with <code>caching_sha2_password</code>. Over a non-TLS connection (<code>useSSL=false</code>, as in the lab’s URL), the client must fetch the server’s public key to send the password — unless the server already has that user in its in-memory cache from an earlier successful login. Connector/J 5.1.49 refuses to fetch the key unless you allow it. We measured it with a ten-line Java program against MySQL 8.4:'
  : 'MySQL 8 xác thực bằng <code>caching_sha2_password</code>. Qua kết nối không mã hoá (<code>useSSL=false</code>, như URL của lab), client phải xin khoá công khai của máy chủ để gửi mật khẩu — trừ khi máy chủ đã có người dùng đó trong bộ đệm bộ nhớ từ một lần đăng nhập thành công trước. Connector/J 5.1.49 từ chối xin khoá nếu bạn không cho phép. Chúng tôi đo bằng một chương trình Java mười dòng với MySQL 8.4:'}</p>
${O14_PKR}
<p>${en
  ? 'This is the most confusing kind of bug: <strong>it depends on history</strong>. It fails, then works after anyone logs in once (the cache fills), then fails again after every MySQL restart (the cache empties). In a team this sounds like “it works on my machine since this morning”. For a local lab, <code>allowPublicKeyRetrieval=true</code> is acceptable and the lab’s compose file sets it. In production the right answer is TLS (<code>useSSL=true</code>) and a modern driver (<code>com.mysql:mysql-connector-j</code> 8.x/9.x) — an upgrade task, not a day-one task.'
  : 'Đây là loại bug khó hiểu nhất: <strong>nó phụ thuộc vào quá khứ</strong>. Lỗi, rồi chạy được sau khi ai đó đăng nhập một lần (bộ đệm đầy), rồi lỗi lại sau mỗi lần MySQL khởi động lại (bộ đệm rỗng). Trong nhóm, nó nghe như "máy em từ sáng tới giờ chạy bình thường mà". Với lab cục bộ, <code>allowPublicKeyRetrieval=true</code> chấp nhận được và tệp compose của lab đã đặt sẵn. Ở production, câu trả lời đúng là TLS (<code>useSSL=true</code>) và driver mới (<code>com.mysql:mysql-connector-j</code> 8.x/9.x) — việc của đợt nâng cấp, không phải việc ngày đầu.'}</p>

<h3>${en ? 'Docker Compose: one command, the same stack for everyone' : 'Docker Compose: một lệnh, cả nhóm cùng một stack'}</h3>
<p>${en
  ? 'All of the above — the right MySQL version, the right Tomcat, the right JDK, the dump loaded as an admin, the driver flag — can be written down once in a compose file. Then a new team member runs one command and gets the same thing as everyone else. The lab’s file, annotated:'
  : 'Mọi thứ ở trên — đúng bản MySQL, đúng Tomcat, đúng JDK, nạp dump bằng tài khoản quản trị, cờ của driver — có thể viết ra một lần trong tệp compose. Rồi thành viên mới chạy một lệnh là có đúng thứ mọi người đang có. Tệp của lab, có chú thích:'}</p>
${C14_COMPOSE}
<ul>
<li>${en ? '<strong>Pin the image version</strong> to what production runs (<code>mysql:8.0</code>), not <code>latest</code>. Note that MySQL 8.0 has itself reached end of life; the upgrade is a project decision.' : '<strong>Ghim bản ảnh</strong> theo đúng production (<code>mysql:8.0</code>), không dùng <code>latest</code>. Để ý MySQL 8.0 cũng đã hết vòng đời hỗ trợ; nâng lên là quyết định của dự án.'}</li>
<li>${en ? '<code>docker-entrypoint-initdb.d</code> scripts run <strong>only when the data volume is empty</strong>. Changed the dump? <code>docker compose down -v</code> first, or nothing happens.' : 'Script trong <code>docker-entrypoint-initdb.d</code> chỉ chạy <strong>khi volume dữ liệu còn rỗng</strong>. Sửa dump rồi? Phải <code>docker compose down -v</code> trước, không thì chẳng có gì xảy ra.'}</li>
<li>${en ? 'The entrypoint loads the dump as root, which is why the 1419/1227 errors do not appear here.' : 'Entrypoint nạp dump bằng root, nên lỗi 1419/1227 không xuất hiện ở đây.'}</li>
<li>${en ? 'Inside the compose network the database host is the service name <code>db</code>, not <code>localhost</code>.' : 'Trong mạng của compose, máy CSDL là tên service <code>db</code>, không phải <code>localhost</code>.'}</li>
<li>${en ? '<code>condition: service_healthy</code> makes Tomcat wait until MySQL accepts connections, not merely until its container started.' : '<code>condition: service_healthy</code> bắt Tomcat chờ tới khi MySQL nhận kết nối thật, không chỉ tới khi container của nó khởi động.'}</li>
</ul>
<p>${en
  ? 'After experimenting, take a fresh dump of your lab database (for example before Chapter 3 changes data). Notice that MySQL 8 writes <code>utf8mb3</code> where the 2019 dump said <code>utf8</code> — the same character set under its honest name:'
  : 'Sau khi thử nghiệm, xuất một bản dump mới của CSDL lab (ví dụ trước khi Chương 3 sửa dữ liệu). Để ý MySQL 8 ghi <code>utf8mb3</code> ở chỗ dump 2019 ghi <code>utf8</code> — cùng một bảng mã, giờ gọi bằng tên thật của nó:'}</p>
${O14_DUMP}

<h3>${en ? 'Seed data: the minimum needed to log in and test' : 'Dữ liệu mẫu: tối thiểu để đăng nhập và thử'}</h3>
<p>${en
  ? 'A good seed contains just enough to exercise every screen: one account per role, one reader of each type (SV, GV, KHACH), a book with zero copies left, an overdue loan, a returned loan. The lab dump has most of that; notice it computes dates with <code>NOW() - INTERVAL 20 DAY</code>, so loans are overdue whenever you load it. Fixed dates in seed data are a time bomb: the “overdue” test case stops being overdue, or every loan becomes overdue, months later.'
  : 'Dữ liệu mẫu tốt chứa vừa đủ để đi qua mọi màn hình: mỗi vai một tài khoản, mỗi loại độc giả một người (SV, GV, KHACH), một cuốn đã hết bản, một phiếu quá hạn, một phiếu đã trả. Dump của lab có gần đủ; để ý nó tính ngày bằng <code>NOW() - INTERVAL 20 DAY</code>, nên lúc nào nạp cũng có phiếu quá hạn. Ngày cố định trong dữ liệu mẫu là quả bom hẹn giờ: vài tháng sau, ca "quá hạn" hết quá hạn, hoặc mọi phiếu đều quá hạn.'}</p>

<h3>🔒 ${en ? 'Security: never take customer data home' : 'An ninh: không bao giờ mang dữ liệu khách về máy cá nhân'}</h3>
<div class="callout danger"><p>${en
  ? 'When a bug “only happens with production data”, the tempting move is to ask for a production dump. In an outsourcing company the data belongs to the client, often under a contract and data-protection law (in Vietnam, Decree 13/2023/ND-CP on personal data protection). Rules that keep you out of trouble: never copy a production dump to a personal laptop, USB stick or personal cloud; ask for a masked copy or a reproduction with synthetic data; if you must work on a copy, do it on the machine and in the environment the project approves, and mask it before anything else.'
  : 'Khi một lỗi "chỉ xảy ra với dữ liệu thật", nước đi hấp dẫn là xin bản dump production. Ở công ty outsourcing, dữ liệu là của khách hàng, thường kèm hợp đồng và luật bảo vệ dữ liệu (ở Việt Nam là Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân). Những luật giữ bạn khỏi rắc rối: không bao giờ chép dump production về laptop cá nhân, USB hay cloud cá nhân; xin bản đã che dữ liệu hoặc tái hiện bằng dữ liệu giả; nếu buộc phải làm trên bản sao thì làm trên máy và môi trường dự án cho phép, và che dữ liệu trước tiên.'}</p></div>
<p>${en ? 'Masking is just SQL. On the lab database (the columns look misaligned because the mysql client counts bytes, not letters):' : 'Che dữ liệu chỉ là SQL. Trên CSDL lab (cột trông lệch vì client mysql đếm byte chứ không đếm chữ):'}</p>
${S14_MASK}
${O14_MASK}

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Search the dump for <code>TRIGGER</code>, <code>PROCEDURE</code>, <code>DEFINER</code>. Write their names and line numbers.' : 'Tìm trong dump các chữ <code>TRIGGER</code>, <code>PROCEDURE</code>, <code>DEFINER</code>. Ghi tên và số dòng.'}</li>
<li>${en ? 'Simulate a half-loaded database: in MySQL (compose <code>db</code> service, as root) create a user with rights on <code>thuvien</code> only, load the dump as that user, and list what exists and what is missing.' : 'Giả lập CSDL nạp dở: trong MySQL (service <code>db</code> của compose, bằng root) tạo một user chỉ có quyền trên <code>thuvien</code>, nạp dump bằng user đó, và liệt kê cái gì có, cái gì thiếu.'}</li>
<li>${en ? 'Run <code>docker compose restart db</code> and confirm the web app can still log in (thanks to <code>allowPublicKeyRetrieval</code>). Explain in one sentence what would happen without it.' : 'Chạy <code>docker compose restart db</code> và xác nhận web vẫn đăng nhập được (nhờ <code>allowPublicKeyRetrieval</code>). Giải thích trong một câu chuyện gì xảy ra nếu thiếu nó.'}</li>
<li>${en ? 'Run the masking SQL, check the readers page, then <code>docker compose down -v &amp;&amp; docker compose up -d</code> to get the original data back.' : 'Chạy SQL che dữ liệu, xem trang độc giả, rồi <code>docker compose down -v &amp;&amp; docker compose up -d</code> để lấy lại dữ liệu gốc.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you have seen error 1419 with your own eyes, you know the trigger was missing afterwards, and the lab is back to the original data.' : 'bạn đã tận mắt thấy lỗi 1419, biết rằng sau đó trigger bị thiếu, và lab đã về dữ liệu gốc.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['mysqldump', 'công cụ xuất CSDL MySQL', 'Ghi schema + dữ liệu (+ trigger/routine nếu yêu cầu) thành tệp .sql.', 'Writes schema + data (+ triggers/routines if asked) to a .sql file.'],
  ['DEFINER', 'người định nghĩa', 'Tài khoản mà trigger/procedure chạy dưới danh nghĩa.', 'The account a trigger/procedure runs as.'],
  ['Binary log', 'nhật ký nhị phân', 'Nhật ký thay đổi của MySQL dùng cho sao chép; làm việc tạo trigger cần thêm quyền.', 'MySQL’s change log for replication; makes creating triggers need extra rights.'],
  ['caching_sha2_password', 'cơ chế xác thực MySQL 8', 'Xác thực mặc định từ MySQL 8; driver cũ cần khoá công khai qua kết nối không TLS.', 'MySQL 8’s default auth; old drivers need the public key over non-TLS connections.'],
  ['Seed data', 'dữ liệu mẫu', 'Dữ liệu tối thiểu để chạy và thử mọi màn hình.', 'The minimum data to run and test every screen.'],
  ['Healthcheck', 'kiểm tra sức khoẻ', 'Lệnh compose chạy định kỳ để biết service đã thật sự sẵn sàng.', 'A command compose runs to know a service is really ready.'],
  ['Data masking', 'che dữ liệu', 'Thay dữ liệu cá nhân thật bằng giá trị giả trước khi dùng bản sao.', 'Replacing real personal data with fake values before using a copy.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Read the dump first: version header, tables, inserts, triggers, procedures, DEFINER.' : 'Đọc dump trước: dòng phiên bản, bảng, insert, trigger, procedure, DEFINER.'}</li>
<li>${en ? 'Restoring as a non-admin: 1419 (binary log) then 1227 (DEFINER); a failed restore can leave a database that looks complete.' : 'Nạp bằng tài khoản thường: 1419 (binary log) rồi 1227 (DEFINER); nạp hỏng có thể để lại CSDL trông như đủ.'}</li>
<li>${en ? 'Driver 5.1 + MySQL 8 without TLS fails after every restart unless <code>allowPublicKeyRetrieval=true</code> (lab only).' : 'Driver 5.1 + MySQL 8 không TLS hỏng sau mỗi lần khởi động lại nếu thiếu <code>allowPublicKeyRetrieval=true</code> (chỉ cho lab).'}</li>
<li>${en ? 'Compose pins versions, loads the dump once (empty volume), uses service names, waits for healthy.' : 'Compose ghim phiên bản, nạp dump một lần (volume rỗng), dùng tên service, chờ healthy.'}</li>
<li>${en ? 'Customer data never leaves the approved environment; mask any copy first.' : 'Dữ liệu khách không bao giờ rời môi trường được phép; che mọi bản sao trước.'}</li>
</ul>

${tl('https://dev.mysql.com/doc/refman/8.0/en/stored-programs-logging.html', '🐬', 'MySQL 8.0 — Stored Program Binary Logging', 'log_bin_trust_function_creators, ERROR 1419')}
${tl('https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html', '🐬', 'MySQL 8.0 — Caching SHA-2 Pluggable Authentication', en ? 'Why the public key is needed without TLS' : 'Vì sao cần khoá công khai khi không có TLS')}
${tl('https://hub.docker.com/_/mysql', '🐳', 'Docker Hub — mysql (Initializing a fresh instance)', 'docker-entrypoint-initdb.d')}
${lk('/courses/docker', '🐳', en ? 'Docker course — Compose chapters' : 'Khoá Docker — các chương Compose', en ? 'volumes, healthcheck and depends_on in depth' : 'volume, healthcheck và depends_on chi tiết')}
`
);

/* ═══════════════════ 1.5 — README ═══════════════════ */
const C15_README = bash(`
# Thư viện (legacy-thu-vien)

Ứng dụng quản lý mượn/trả sách cho thủ thư. Java 8 · Servlet 3.1/JSP · JDBC · MySQL 8.0 · Tomcat 9.

## Chạy nhanh (Docker) — khoảng 3 phút lần đầu
    docker compose up -d --build
    mở http://localhost:18080/thuvien/  —  đăng nhập admin / admin123 (chỉ dữ liệu lab)
Làm lại từ dữ liệu gốc: docker compose down -v && docker compose up -d

## Chạy không Docker
1. JDK 8 (Mac chip Apple: Zulu/Corretto 8 — Temurin không có bản aarch64). KHÔNG build bằng JDK 11+:
   TokenUtil dùng javax.xml.bind (bị gỡ từ JDK 11) và maven-war-plugin 2.2 hỏng trên JDK mới.
2. Tomcat 9.x (KHÔNG phải 10+: mã dùng javax.servlet).
3. MySQL 8.0: mysql -uroot -p < db/thuvien.sql   (nạp bằng tài khoản quản trị — có trigger + procedure)
4. JAVA_HOME=<jdk8> mvn -B package -Dproject.build.sourceEncoding=UTF-8
5. Chép target/thuvien.war vào tomcat/webapps; đặt biến DB_URL nếu MySQL không ở localhost:3306:
   DB_URL='jdbc:mysql://127.0.0.1:18306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true'

## Tài khoản thử (dữ liệu lab)
admin / admin123 (ADMIN) · thuthu / 123456 (STAFF)

## Lỗi hay gặp
| Triệu chứng                                         | Nguyên nhân                          |
| package javax.xml.bind does not exist               | đang build bằng JDK 11+              |
| servlet 500 + ClassNotFoundException javax.servlet  | đang chạy trên Tomcat 10+            |
| Public Key Retrieval is not allowed                 | thiếu allowPublicKeyRetrieval=true   |
| Menu lỗi font (THÆ¯ VIá»N)                         | lỗi đã biết #1: header.jsp thiếu pageEncoding |

## Bản đồ nhanh
URL → servlet: web.xml (login, books, readers) + @WebServlet("/report").
Logic trong CSDL: trigger trg_loans_ai (trừ số sách khi mượn), procedure sp_overdue_report (báo cáo quá hạn).
`
);

const L15 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Getting an old project to run' : 'Chương 1 · Dựng chạy một dự án cũ'}</span>
<h2>${en ? '1.5 — Writing the README you wish you had' : '1.5 — Viết README mà bạn ước đã có sẵn'}</h2>
<p class="lead">${en
  ? 'You have now paid the full price of a missing README: wrong JDK, wrong Tomcat, a dump that half-loads, a driver flag nobody wrote down. The cheapest way to make sure nobody pays it again is to write down what you learned while it is fresh. On a real team, this is very often an intern’s first merged PR — and one of the most appreciated.'
  : 'Giờ bạn đã trả đủ giá của một README thiếu: sai JDK, sai Tomcat, dump nạp dở, cờ driver không ai ghi. Cách rẻ nhất để không ai phải trả lại lần nữa là ghi ra những gì vừa học khi còn nhớ. Trong nhóm thật, đây rất hay là PR đầu tiên của intern được merge — và là một trong những PR được cảm ơn nhiều nhất.'}</p>

<h3>${en ? 'What a maintenance README must answer' : 'README cho dự án bảo trì phải trả lời được gì'}</h3>
<ol>
<li>${en ? '<strong>What is this?</strong> One sentence, plus the stack with versions.' : '<strong>Đây là gì?</strong> Một câu, kèm stack có phiên bản.'}</li>
<li>${en ? '<strong>How do I run it fastest?</strong> The one-command path, with the URL and a test account.' : '<strong>Chạy nhanh nhất thế nào?</strong> Đường một lệnh, kèm URL và tài khoản thử.'}</li>
<li>${en ? '<strong>How do I run it the long way?</strong> Every version and the <em>reason</em> for it (“JDK 8 because…”). Reasons stop the next person from “upgrading” blindly.' : '<strong>Chạy đường dài thế nào?</strong> Mọi phiên bản kèm <em>lý do</em> ("JDK 8 vì…"). Có lý do thì người sau không "nâng cấp" mù.'}</li>
<li>${en ? '<strong>What goes wrong?</strong> A symptom → cause table, using the exact error text people will paste into search.' : '<strong>Hay hỏng chỗ nào?</strong> Bảng triệu chứng → nguyên nhân, dùng đúng chữ của thông báo lỗi mà người ta sẽ dán vào ô tìm kiếm.'}</li>
<li>${en ? '<strong>Where do I start reading?</strong> Entry points and the surprising places (logic in the database). Chapter 2 grows this into a full map.' : '<strong>Bắt đầu đọc từ đâu?</strong> Các điểm vào và những chỗ bất ngờ (logic trong CSDL). Chương 2 mở rộng phần này thành bản đồ đầy đủ.'}</li>
</ol>

<h3>${en ? 'A README built only from what this chapter verified' : 'Một README chỉ gồm những gì chương này đã kiểm chứng'}</h3>
${C15_README}
<p>${en
  ? 'Notice what is <em>not</em> in it: no explanation of what a servlet is, no history of the project, no instructions that were not tested. Every line was run in lessons 0.1–1.4. And notice what it admits: a known bug, a test-only password. An honest README is more useful than a beautiful one.'
  : 'Để ý những gì <em>không</em> có: không giải thích servlet là gì, không kể lịch sử dự án, không có chỉ dẫn nào chưa được thử. Mọi dòng đều đã chạy ở bài 0.1–1.4. Và để ý những gì nó thừa nhận: một lỗi đã biết, một mật khẩu chỉ dùng cho lab. README trung thực hữu ích hơn README đẹp.'}</p>

<h3>${en ? 'Rules that make a README stay true' : 'Những luật giúp README đúng mãi'}</h3>
<ul>
<li>${en ? '<strong>Test it on someone else.</strong> Hand it to a classmate who has never seen the repo, watch without helping, and fix every place they stop. This is the “Done when” of the chapter lab.' : '<strong>Thử trên người khác.</strong> Đưa cho một bạn chưa từng thấy repo, ngồi xem mà không giúp, và sửa mọi chỗ họ khựng lại. Đây là tiêu chí "Đạt khi" của lab chương.'}</li>
<li>${en ? '<strong>Copy-paste real commands</strong> from your terminal history, not from memory.' : '<strong>Dán lệnh thật</strong> từ lịch sử terminal, không gõ theo trí nhớ.'}</li>
<li>${en ? '<strong>Never put real secrets</strong> in a README. Lab passwords are fine if labelled as such; real ones go in the team’s secret manager.' : '<strong>Không bao giờ ghi bí mật thật</strong> vào README. Mật khẩu lab được, miễn ghi rõ là của lab; mật khẩu thật nằm trong kho bí mật của nhóm.'}</li>
<li>${en ? '<strong>Change the README in the same PR</strong> as the change that makes it wrong (new env var, new version).' : '<strong>Sửa README trong cùng PR</strong> với thay đổi làm nó sai (biến môi trường mới, phiên bản mới).'}</li>
<li>${en ? '<strong>Keep the old README’s author in mind.</strong> “Liên hệ: Tuấn” is useless after Tuấn left; write the team channel instead.' : '<strong>Nghĩ tới người viết README cũ.</strong> "Liên hệ: Tuấn" vô dụng khi Tuấn đã nghỉ; ghi kênh của nhóm thay vào.'}</li>
</ul>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'End of your first week, your lead asks for a status. “I could not do the ticket yet” sounds bad. “I got the project running; it took two days because of five undocumented issues; here is a PR that adds them to the README so the next person needs thirty minutes” sounds like someone they want to keep. Same week, same work — different story.'
  : 'Cuối tuần đầu, leader hỏi tình hình. "Em chưa làm được ticket" nghe tệ. "Em đã dựng chạy được dự án; mất hai ngày vì năm vấn đề không ai ghi lại; đây là PR thêm chúng vào README để người sau chỉ cần ba mươi phút" nghe như một người mà họ muốn giữ lại. Cùng một tuần, cùng một khối việc — câu chuyện khác hẳn.'}</p>

<h3>🧪 ${en ? 'Practice (25 minutes)' : 'Thực hành (25 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'From your notebook (lessons 0.1–1.4), write a new <code>README.md</code> for the lab with the five sections above. Do not copy the example — use your own commands and your own errors.' : 'Từ nhật ký (bài 0.1–1.4), viết <code>README.md</code> mới cho lab với năm phần ở trên. Đừng chép ví dụ — dùng lệnh và lỗi của chính bạn.'}</li>
<li>${en ? 'Commit it on a branch <code>docs/readme</code> with a message that says what and why.' : 'Commit nó trên nhánh <code>docs/readme</code> với lời nhắn nói rõ làm gì và vì sao.'}</li>
<li>${en ? 'Run every command in it once more, top to bottom, on a fresh clone in <code>/tmp</code>.' : 'Chạy lại mọi lệnh trong đó, từ trên xuống, trên một bản clone mới trong <code>/tmp</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'a fresh clone reaches the books page by following only your README, and the README contains no real secret.' : 'một bản clone mới tới được trang sách chỉ bằng cách làm theo README của bạn, và README không chứa bí mật thật nào.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['README', 'tệp đọc trước', 'Tài liệu đầu tiên người mới mở; phải chạy được theo nó.', 'The first document a newcomer opens; must be runnable as written.'],
  ['Onboarding', 'hội nhập người mới', 'Quá trình đưa người mới tới chỗ làm được việc.', 'Getting a newcomer to productive work.'],
  ['Known issue', 'lỗi đã biết', 'Lỗi đã ghi nhận nhưng chưa sửa; ghi ra để người khác khỏi mất công.', 'A recorded, not yet fixed bug; written down to save others time.'],
  ['Secret manager', 'kho bí mật', 'Nơi nhóm cất mật khẩu/khoá thật (Vault, 1Password…), không phải README.', 'Where a team keeps real passwords/keys (Vault, 1Password…), not the README.'],
  ['Fresh clone', 'bản clone mới', 'Repo vừa clone, chưa có gì từ máy bạn — phép thử thật của README.', 'A just-cloned repo with nothing from your machine — the real test of a README.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Write the README while the pain is fresh; it is often an intern’s most valued first PR.' : 'Viết README khi nỗi đau còn mới; nó thường là PR đầu tiên có giá trị nhất của intern.'}</li>
<li>${en ? 'Five answers: what, fastest run, long run with reasons, what goes wrong, where to start.' : 'Năm câu trả lời: là gì, chạy nhanh nhất, chạy đường dài kèm lý do, hay hỏng gì, bắt đầu từ đâu.'}</li>
<li>${en ? 'Only tested commands; exact error texts; known bugs admitted.' : 'Chỉ lệnh đã thử; đúng chữ của lỗi; thừa nhận lỗi đã biết.'}</li>
<li>${en ? 'Test it on someone else and on a fresh clone.' : 'Thử trên người khác và trên một bản clone mới.'}</li>
<li>${en ? 'No real secrets, ever; update the README in the PR that changes the setup.' : 'Không bao giờ có bí mật thật; sửa README trong PR làm đổi cách dựng.'}</li>
</ul>

${lk(bai('agile-teamwork', 'agl-8-1-onboarding'), '🤝', en ? 'Agile & teamwork 8.1 — Onboarding' : 'Agile &amp; làm việc nhóm 8.1 — Hội nhập', en ? 'The habits side of your first weeks; this lesson is the technical side' : 'Phần thói quen của những tuần đầu; bài này là phần kỹ thuật')}
${tl('https://www.makeareadme.com/', '📝', 'Make a README', en ? 'A short checklist and template' : 'Bảng kiểm và khuôn mẫu ngắn')}
`
);

/* ═══════════════════ 1.6 — Lab ═══════════════════ */
const L16 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Lab' : 'Chương 1 · Lab'}</span>
<h2>${en ? '1.6 — Lab: From clone to login page in under two hours' : '1.6 — Lab: Từ clone tới trang đăng nhập trong dưới hai giờ'}</h2>
<p class="lead">${en
  ? 'This lab puts the whole chapter together the way a real first ticket would: you receive the repository with nothing but its README, you must reach a working login and borrow a book, and you must leave the repository easier to start than you found it.'
  : 'Lab này ghép cả chương lại đúng như một ticket đầu tiên ngoài đời: bạn nhận repo chỉ kèm README của nó, phải tới được trang đăng nhập chạy thật và mượn được một cuốn sách, và phải để lại repo dễ dựng hơn lúc nhận.'}</p>

<h3>${en ? 'The ticket' : 'Ticket'}</h3>
<div class="callout"><p><strong>LIB-101 · ${en ? 'Set up local environment and document it' : 'Dựng môi trường cục bộ và viết tài liệu'}</strong><br>
${en
  ? 'As a new developer on the library project I want to run the app on my machine so that I can work on tickets. Acceptance: (1) app runs locally, login works, a book can be borrowed and returned; (2) the README lets a new member do the same in under 30 minutes; (3) known problems found during setup are recorded as tickets.'
  : 'Là lập trình viên mới của dự án thư viện, tôi muốn chạy được ứng dụng trên máy để làm ticket. Tiêu chí chấp nhận: (1) ứng dụng chạy cục bộ, đăng nhập được, mượn và trả được một cuốn sách; (2) README giúp thành viên mới làm điều tương tự trong dưới 30 phút; (3) các vấn đề phát hiện khi dựng môi trường được ghi thành ticket.'}</p></div>

<h3>${en ? 'Steps (timebox in brackets)' : 'Các bước (thời gian gợi ý trong ngoặc)'}</h3>
<ol>
<li>${en ? '<strong>[10 min] Fresh start.</strong> Unzip a new copy into <code>/tmp/lgc-lab1</code>. Read only the original README and the build file. Write the five POM answers (1.1).' : '<strong>[10 phút] Bắt đầu sạch.</strong> Giải nén một bản mới vào <code>/tmp/lgc-lab1</code>. Chỉ đọc README gốc và tệp build. Ghi năm câu trả lời POM (1.1).'}</li>
<li>${en ? '<strong>[30 min] Path B first</strong> (no Docker): JDK 8, Tomcat 9, MySQL. Load the dump as an admin. Build, deploy, set <code>DB_URL</code>. If you hit an error from lessons 1.2–1.4, name it before fixing it.' : '<strong>[30 phút] Đường B trước</strong> (không Docker): JDK 8, Tomcat 9, MySQL. Nạp dump bằng tài khoản quản trị. Build, triển khai, đặt <code>DB_URL</code>. Gặp lỗi nào của bài 1.2–1.4 thì gọi tên nó trước khi sửa.'}</li>
<li>${en ? '<strong>[10 min] Path A</strong>: <code>docker compose up -d --build</code> on the same copy. Compare: what did compose do that you did by hand?' : '<strong>[10 phút] Đường A</strong>: <code>docker compose up -d --build</code> trên cùng bản đó. So sánh: compose đã làm thay bạn những gì?'}</li>
<li>${en ? '<strong>[15 min] Smoke test</strong>: log in as <code>thuthu</code>, borrow book 4 for reader 5, check “Còn/Tổng” went from 2/2 to 1/2, return it from the Readers page, check it is back to 2/2.' : '<strong>[15 phút] Thử khói</strong>: đăng nhập <code>thuthu</code>, mượn sách 4 cho độc giả 5, kiểm "Còn/Tổng" từ 2/2 thành 1/2, trả lại ở trang Độc giả, kiểm về lại 2/2.'}</li>
<li>${en ? '<strong>[30 min] README</strong> (1.5) on branch <code>docs/readme</code>.' : '<strong>[30 phút] README</strong> (1.5) trên nhánh <code>docs/readme</code>.'}</li>
<li>${en ? '<strong>[10 min] Tickets</strong>: write at least three in <code>NHAT-KY.md</code> using the template below — the garbled menu, the missing source encoding, the password inside the WAR.' : '<strong>[10 phút] Ticket</strong>: viết ít nhất ba ticket trong <code>NHAT-KY.md</code> theo mẫu dưới — menu lỗi font, POM thiếu bảng mã, mật khẩu nằm trong WAR.'}</li>
<li>${en ? '<strong>[15 min] Hand-over test</strong>: a classmate follows your README on their machine while you watch silently.' : '<strong>[15 phút] Thử bàn giao</strong>: một bạn làm theo README của bạn trên máy họ, bạn ngồi xem không nói.'}</li>
</ol>
<div class="callout"><p><strong>${en ? 'Ticket template' : 'Mẫu ticket'}</strong><br>
${en ? 'Title · Steps to reproduce · Expected · Actual (exact text/screenshot) · Environment (JDK, Tomcat, OS) · Suspected cause (file:line) · Severity' : 'Tiêu đề · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế (chữ nguyên văn/ảnh) · Môi trường (JDK, Tomcat, hệ điều hành) · Nghi ngờ nguyên nhân (tệp:dòng) · Mức độ'}</p></div>

<h3>${en ? 'Done when' : 'Đạt khi'}</h3>
<div class="callout ok"><ul>
<li>${en ? 'Both paths reach the books page; the borrow/return smoke test changes 2/2 → 1/2 → 2/2.' : 'Cả hai đường tới được trang sách; thử khói mượn/trả đổi 2/2 → 1/2 → 2/2.'}</li>
<li>${en ? 'A classmate reached the books page using only your README, in under 30 minutes, without asking you anything.' : 'Một bạn tới được trang sách chỉ dùng README của bạn, dưới 30 phút, không phải hỏi bạn câu nào.'}</li>
<li>${en ? 'Three tickets with exact error text and a suspected <code>file:line</code>.' : 'Ba ticket có chữ lỗi nguyên văn và <code>tệp:dòng</code> nghi ngờ.'}</li>
<li>${en ? 'No code changed except <code>README.md</code> (fixes belong to later chapters), and no real secret committed.' : 'Không sửa code nào ngoài <code>README.md</code> (sửa lỗi là việc của các chương sau), và không commit bí mật thật nào.'}</li>
</ul></div>

<h3>${en ? 'Self-review rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'App runs on both paths, smoke test passes' : 'Ứng dụng chạy cả hai đường, thử khói qua'}</td><td>3</td></tr>
<tr><td>${en ? 'README: versions with reasons, troubleshooting table with exact errors' : 'README: phiên bản kèm lý do, bảng gỡ rối có chữ lỗi nguyên văn'}</td><td>3</td></tr>
<tr><td>${en ? 'Hand-over test passed without help' : 'Thử bàn giao qua mà không cần giúp'}</td><td>2</td></tr>
<tr><td>${en ? 'Tickets: reproducible, with suspected cause' : 'Ticket: tái hiện được, có nghi ngờ nguyên nhân'}</td><td>2</td></tr>
</tbody>
</table>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Acceptance criteria', 'tiêu chí chấp nhận', 'Điều kiện kiểm được để ticket được coi là xong.', 'Checkable conditions for a ticket to count as done.'],
  ['Smoke test', 'thử khói', 'Vài thao tác chính để biết hệ thống "có sống" không.', 'A few key actions showing the system is alive.'],
  ['Timebox', 'khung thời gian', 'Giới hạn thời gian cho một bước; hết giờ thì dừng, hỏi hoặc ghi lại.', 'A time limit for a step; when it ends, stop, ask or write it down.'],
  ['Steps to reproduce', 'các bước tái hiện', 'Chuỗi thao tác tối thiểu làm lỗi xuất hiện lại.', 'The minimal actions that make a bug happen again.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Setting up is a ticket with acceptance criteria, not a chore before the “real” work.' : 'Dựng môi trường là một ticket có tiêu chí chấp nhận, không phải việc vặt trước việc "thật".'}</li>
<li>${en ? 'Do the hard path once so you know what the easy path hides.' : 'Đi đường khó một lần để biết đường dễ đang che những gì.'}</li>
<li>${en ? 'Record problems as tickets; do not fix them inside the setup work.' : 'Ghi vấn đề thành ticket; đừng sửa chúng ngay trong việc dựng môi trường.'}</li>
<li>${en ? 'A README is only done when someone else succeeded with it.' : 'README chỉ xong khi người khác làm theo thành công.'}</li>
</ul>
`
);

/* ═══════════════════ 1.7 — Quiz ═══════════════════ */
const QUIZ1 = [
  Q('You deploy the lab WAR on Tomcat 10.1. /thuvien/ redirects normally, /login returns 500, /report returns 404. What is the single root cause?|||Bạn đưa WAR của lab lên Tomcat 10.1. /thuvien/ chuyển hướng bình thường, /login trả 500, /report trả 404. Nguyên nhân gốc duy nhất là gì?', [
    'The database is not reachable from Tomcat 10|||Tomcat 10 không kết nối được CSDL',
    'The code uses javax.servlet; Tomcat 10+ only provides jakarta.servlet|||Code dùng javax.servlet; Tomcat 10+ chỉ cung cấp jakarta.servlet',
    'Tomcat 10 does not support JSP scriptlets|||Tomcat 10 không hỗ trợ scriptlet JSP',
    'The WAR was built with the wrong Maven version|||WAR được build bằng sai bản Maven',
  ], 1, 'EN: web.xml servlets fail to load (ClassNotFoundException: javax.servlet.http.HttpServlet ⇒ 500); the @javax…WebServlet annotation is not scanned at all (⇒ 404); index.jsp imports nothing so it works. The database is never reached, so “DB unreachable” is the tempting wrong answer.|||VI: Servlet khai trong web.xml không nạp được (ClassNotFoundException: javax.servlet.http.HttpServlet ⇒ 500); annotation @javax…WebServlet không được quét (⇒ 404); index.jsp không import gì nên chạy. Request chưa hề tới CSDL, nên "không kết nối CSDL" là đáp án sai hấp dẫn.'),
  Q('Building the lab with JDK 21 fails with “package javax.xml.bind does not exist”. What is the right day-one action?|||Build lab bằng JDK 21 báo "package javax.xml.bind does not exist". Việc đúng ngày đầu là gì?', [
    'Rewrite TokenUtil with java.util.HexFormat in your first ticket|||Viết lại TokenUtil bằng java.util.HexFormat ngay trong ticket đầu',
    'Delete TokenUtil because nobody uses remember-me|||Xoá TokenUtil vì không ai dùng ghi nhớ đăng nhập',
    'Build with JDK 8, the version the project was written for, and note the upgrade task|||Build bằng JDK 8, bản dự án được viết cho, và ghi lại việc nâng cấp',
    'Add the jaxb-api dependency and keep JDK 21|||Thêm dependency jaxb-api và giữ JDK 21',
  ], 2, 'EN: JAXB left the JDK in 11 (JEP 320). Adding jaxb-api was measured in lesson 1.2: it only reveals the next wall, maven-war-plugin 2.2 crashing with “Cannot access defaults field of Properties”. Code changes belong to a planned upgrade (Chapter 7).|||VI: JAXB rời JDK từ bản 11 (JEP 320). Thêm jaxb-api đã được đo ở bài 1.2: nó chỉ lộ ra bức tường kế tiếp — maven-war-plugin 2.2 sập với "Cannot access defaults field of Properties". Sửa code thuộc về đợt nâng cấp có kế hoạch (Chương 7).'),
  Q('Production runs Java 8. A colleague built a helper jar with JDK 21 and no target option. What will production print when it loads a class from it?|||Production chạy Java 8. Một đồng nghiệp build jar tiện ích bằng JDK 21 mà không khai đích. Production in gì khi nạp một lớp trong đó?', [
    'UnsupportedClassVersionError … class file version 65.0 … only recognizes class file versions up to 52.0|||UnsupportedClassVersionError … class file version 65.0 … only recognizes class file versions up to 52.0',
    'ClassNotFoundException|||ClassNotFoundException',
    'Nothing — Java is backward compatible|||Không có gì — Java tương thích ngược',
    'NoSuchMethodError for every method|||NoSuchMethodError cho mọi phương thức',
  ], 0, 'EN: 65 = Java 21, 52 = Java 8; measured in lesson 1.2. Backward compatibility means new JVMs run old classes, not the other way round. Fix: javac --release 8.|||VI: 65 = Java 21, 52 = Java 8; đo ở bài 1.2. Tương thích ngược nghĩa là JVM mới chạy lớp cũ, không phải ngược lại. Sửa: javac --release 8.'),
  Q('The lab POM has no project.build.sourceEncoding. A teammate builds with JDK 8 on Windows and sees “MÆ°á»£n thÃ nh cÃ´ng”. Why?|||POM của lab không khai project.build.sourceEncoding. Một bạn build bằng JDK 8 trên Windows và thấy "MÆ°á»£n thÃ nh cÃ´ng". Vì sao?', [
    'MySQL stores the message in latin1|||MySQL lưu câu đó bằng latin1',
    'Tomcat on Windows cannot output UTF-8|||Tomcat trên Windows không xuất được UTF-8',
    'The browser has the wrong font|||Trình duyệt sai phông chữ',
    'javac read the UTF-8 source with the Windows code page, so the string in the .class file is already wrong|||javac đọc mã nguồn UTF-8 bằng bảng mã Windows, nên chuỗi trong tệp .class đã sai từ đầu',
  ], 3, 'EN: lesson 1.2 reproduced it: compiled with -Dfile.encoding=Cp1252, javap shows the garbled constant inside the class file. The message is a Java string literal, not data from MySQL. JDK 18+ defaults to UTF-8 (JEP 400).|||VI: bài 1.2 tái hiện đúng điều này: biên dịch với -Dfile.encoding=Cp1252, javap cho thấy hằng chuỗi đã lỗi ngay trong tệp class. Câu đó là chuỗi trong code Java, không phải dữ liệu từ MySQL. JDK 18+ mặc định UTF-8 (JEP 400).'),
  Q('dependency:tree -Dverbose shows “(commons-collections:3.2.2 - omitted for conflict with 3.2.1)”. Which version ends up in the WAR, and why?|||dependency:tree -Dverbose hiện "(commons-collections:3.2.2 - omitted for conflict with 3.2.1)". Bản nào vào WAR, vì sao?', [
    '3.2.2, because Maven always picks the newest|||3.2.2, vì Maven luôn chọn bản mới nhất',
    '3.2.1, because it is declared nearer to the project’s POM (nearest wins)|||3.2.1, vì nó được khai gần POM của dự án hơn (gần nhất thắng)',
    'Both, in different folders of WEB-INF/lib|||Cả hai, ở hai thư mục khác nhau trong WEB-INF/lib',
    'Neither: the build fails on the conflict|||Không bản nào: build hỏng vì xung đột',
  ], 1, 'EN: Maven mediates by nearest definition, not by newest version, and does not fail on conflicts. Here the older, vulnerable 3.2.1 wins — which is why the verbose tree matters.|||VI: Maven hoà giải theo định nghĩa gần nhất, không theo bản mới nhất, và không làm hỏng build khi xung đột. Ở đây bản cũ có lỗ hổng 3.2.1 thắng — vì vậy cây verbose mới quan trọng.'),
  Q('The build fails with “… from/to maven-default-http-blocker (http://0.0.0.0/): Blocked mirror for repositories: [company-nexus (http://…)]”. What is the correct fix?|||Build hỏng với "… from/to maven-default-http-blocker (http://0.0.0.0/): Blocked mirror for repositories: [company-nexus (http://…)]". Cách sửa đúng là gì?', [
    'Downgrade to Maven 3.6 so HTTP works again|||Hạ xuống Maven 3.6 cho HTTP chạy lại',
    'Remove the blocker mirror from Maven’s global conf/settings.xml|||Xoá mirror chặn trong conf/settings.xml chung của Maven',
    'Commit a settings.xml with the Nexus password into the repo so everyone has it|||Commit settings.xml có mật khẩu Nexus vào repo cho mọi người cùng dùng',
    'Get the HTTPS URL of the company repository and configure it as a mirror in your own ~/.m2/settings.xml|||Xin địa chỉ HTTPS của kho công ty và khai nó làm mirror trong ~/.m2/settings.xml của bạn',
  ], 3, 'EN: since Maven 3.8.1 external HTTP repositories are blocked on purpose (CVE-2021-26291, man-in-the-middle). Downgrading or unblocking removes the protection; committing credentials is worse.|||VI: từ Maven 3.8.1, kho HTTP bên ngoài bị chặn có chủ đích (CVE-2021-26291, tấn công xen giữa). Hạ Maven hay mở chặn là bỏ lớp bảo vệ; commit mật khẩu còn tệ hơn.'),
  Q('You load the dump as the application user and see ERROR 1419 at line 109. What state is the database in?|||Bạn nạp dump bằng tài khoản ứng dụng và thấy ERROR 1419 ở dòng 109. CSDL đang ở trạng thái nào?', [
    'Tables and data are loaded, but the trigger (and everything after line 109) is missing|||Bảng và dữ liệu đã nạp, nhưng trigger (và mọi thứ sau dòng 109) bị thiếu',
    'Nothing was loaded — MySQL rolls back the whole file|||Không có gì được nạp — MySQL hoàn tác cả tệp',
    'Everything was loaded; 1419 is only a warning|||Mọi thứ đã nạp; 1419 chỉ là cảnh báo',
    'The database was dropped|||CSDL bị xoá',
  ], 0, 'EN: the mysql client stops at the first error; statements before it are already committed. Measured in lesson 1.4: 5 loans present, SHOW TRIGGERS empty — a half-loaded database that looks fine.|||VI: client mysql dừng ở lỗi đầu tiên; các câu trước đó đã được ghi. Đo ở bài 1.4: có đủ 5 phiếu mượn, SHOW TRIGGERS rỗng — CSDL nạp dở mà trông vẫn ổn.'),
  Q('After the admin sets log_bin_trust_function_creators=1, the same restore now fails with ERROR 1227 (SUPER or SET_USER_ID). What in the dump causes it?|||Sau khi quản trị viên đặt log_bin_trust_function_creators=1, lần nạp đó lại hỏng với ERROR 1227 (SUPER hoặc SET_USER_ID). Thứ gì trong dump gây ra?', [
    'The CREATE DATABASE statement|||Câu CREATE DATABASE',
    'The LOCK TABLES statements|||Các câu LOCK TABLES',
    'DEFINER=`root`@`%` on the trigger and procedure|||DEFINER=`root`@`%` trên trigger và procedure',
    'The utf8 character set|||Bảng mã utf8',
  ], 2, 'EN: creating an object that runs as another account needs SET_USER_ID/SUPER. Stripping DEFINER makes the objects yours (lesson 1.4 shows the trigger with DEFINER thuvien@% afterwards).|||VI: tạo đối tượng chạy dưới danh nghĩa tài khoản khác cần SET_USER_ID/SUPER. Bỏ DEFINER thì đối tượng thành của bạn (bài 1.4 cho thấy trigger có DEFINER thuvien@% sau đó).'),
  Q('With driver 5.1.49 and useSSL=false, login works all morning, then fails with “Public Key Retrieval is not allowed” right after MySQL restarts. Best explanation?|||Với driver 5.1.49 và useSSL=false, đăng nhập chạy cả buổi sáng, rồi hỏng với "Public Key Retrieval is not allowed" ngay sau khi MySQL khởi động lại. Giải thích đúng nhất?', [
    'The root password expired at noon|||Mật khẩu root hết hạn lúc trưa',
    'caching_sha2_password needs the server’s public key over non-TLS unless the user is in the server’s cache — and a restart empties the cache|||caching_sha2_password cần khoá công khai của máy chủ khi không có TLS trừ khi người dùng đã nằm trong bộ đệm của máy chủ — và khởi động lại làm rỗng bộ đệm',
    'The Docker network changed IP addresses|||Mạng Docker đổi địa chỉ IP',
    'Tomcat’s connection pool is full|||Pool kết nối của Tomcat bị đầy',
  ], 1, 'EN: measured in lesson 1.4 — fails, works after one login with allowPublicKeyRetrieval=true, keeps working, fails again after docker restart. The lab app has no connection pool at all (DriverManager per request).|||VI: đo ở bài 1.4 — hỏng, chạy được sau một lần đăng nhập có allowPublicKeyRetrieval=true, chạy tiếp, rồi hỏng lại sau docker restart. Ứng dụng lab còn chẳng có pool kết nối (mỗi request một DriverManager).'),
  Q('You changed db/thuvien.sql and ran docker compose up -d again, but the database still has the old data. Why?|||Bạn sửa db/thuvien.sql rồi chạy lại docker compose up -d, nhưng CSDL vẫn là dữ liệu cũ. Vì sao?', [
    'Compose caches SQL files in the image|||Compose đệm tệp SQL vào trong ảnh',
    'You must restart Docker Desktop|||Phải khởi động lại Docker Desktop',
    'The mounted file is read-only (:ro)|||Tệp được gắn chỉ đọc (:ro)',
    'Scripts in docker-entrypoint-initdb.d only run when the data volume is empty; use down -v first|||Script trong docker-entrypoint-initdb.d chỉ chạy khi volume dữ liệu còn rỗng; phải down -v trước',
  ], 3, 'EN: the MySQL image initialises once; the mysql-data volume keeps the old database. :ro only stops the container writing to the file — it can still read your edit.|||VI: ảnh MySQL chỉ khởi tạo một lần; volume mysql-data giữ CSDL cũ. :ro chỉ cấm container ghi vào tệp — nó vẫn đọc được bản bạn sửa.'),
  Q('A bug only appears with production data. Your lead is busy. What should you do?|||Một lỗi chỉ xuất hiện với dữ liệu production. Leader đang bận. Bạn nên làm gì?', [
    'Ask a colleague with access to send you a production dump on chat|||Nhờ một đồng nghiệp có quyền gửi dump production qua chat',
    'Copy the dump to your personal laptop but delete it after fixing|||Chép dump về laptop cá nhân rồi xoá sau khi sửa xong',
    'Try to reproduce with synthetic data, and ask for a masked copy in the approved environment|||Thử tái hiện bằng dữ liệu giả, và xin một bản đã che dữ liệu trong môi trường được phép',
    'Debug directly on the production database|||Gỡ lỗi thẳng trên CSDL production',
  ], 2, 'EN: customer data belongs to the client and is protected by contract and law (Decree 13/2023/ND-CP in Vietnam). “Delete it afterwards” does not undo the copy.|||VI: dữ liệu khách thuộc về khách hàng và được bảo vệ bởi hợp đồng và luật (Nghị định 13/2023/NĐ-CP ở Việt Nam). "Xoá sau" không xoá được việc đã sao chép.'),
  Q('Which line belongs in a maintenance README?|||Dòng nào nên có trong README của dự án bảo trì?', [
    '“Build with JDK 8 — TokenUtil uses javax.xml.bind, removed in JDK 11”|||"Build bằng JDK 8 — TokenUtil dùng javax.xml.bind, bị gỡ từ JDK 11"',
    '“Install the latest JDK and Tomcat”|||"Cài JDK và Tomcat mới nhất"',
    '“Production DB password: …” so new members do not have to ask|||"Mật khẩu CSDL production: …" để người mới khỏi phải hỏi',
    '“Contact: Tuấn”|||"Liên hệ: Tuấn"',
  ], 0, 'EN: a version with its reason stops blind upgrades. “Latest” is exactly wrong here (Tomcat 10+, JDK 11+ break the app); secrets never go in a README; a person who left is not a contact.|||VI: phiên bản kèm lý do giúp người sau không nâng cấp mù. "Mới nhất" lại sai đúng chỗ này (Tomcat 10+, JDK 11+ làm hỏng ứng dụng); bí mật không bao giờ vào README; người đã nghỉ không phải đầu mối liên hệ.'),
];

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 1 · Quiz' : 'Chương 1 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Twelve questions, each built on an output you saw run in this chapter. If you miss one, the explanation names the lesson.' : 'Mười hai câu, câu nào cũng dựa trên một output bạn đã thấy chạy thật trong chương. Sai câu nào thì lời giải nêu đúng bài cần đọc lại.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can read Java version, packaging, container API and DB driver from a POM.' : 'Tôi đọc được bản Java, kiểu đóng gói, API container và driver CSDL từ một POM.'}</li>
<li>${en ? 'I can explain 500 vs 404 of a javax WAR on Tomcat 10.' : 'Tôi giải thích được 500 và 404 của một WAR javax trên Tomcat 10.'}</li>
<li>${en ? 'I know 52/55/61/65 and the Windows encoding trap.' : 'Tôi nhớ 52/55/61/65 và cái bẫy bảng mã trên Windows.'}</li>
<li>${en ? 'I can read a verbose dependency tree and the HTTP-blocker error.' : 'Tôi đọc được cây phụ thuộc verbose và lỗi chặn HTTP.'}</li>
<li>${en ? 'I know what errors 1419 and 1227 leave behind, and why Public Key Retrieval depends on history.' : 'Tôi biết lỗi 1419 và 1227 để lại gì, và vì sao Public Key Retrieval phụ thuộc vào quá khứ.'}</li>
</ul>
`
);

export default {
  title: 'Chapter 1 — Getting an old project to run|||Chương 1 — Dựng chạy một dự án cũ',
  description: 'Chưa chạy được thì chưa hiểu được.',
  lessons: [
    { title: '1.1 — Old build tools: Ant, early Maven POMs, WAR files, Tomcat javax vs jakarta|||1.1 — Công cụ build cũ: Ant, POM Maven đời đầu, file WAR, Tomcat javax và jakarta', slug: 'lgc-1-1-build-cu', type: 'LESSON', isFreePreview: true, description: 'Đọc POM như danh sách đi chợ, mở WAR, đọc build.xml của Ant, và WAR javax trên Tomcat 10 trả 302/500/404 đo thật.', content: L11 },
    { title: '1.2 — Version hell: JDK 8 vs 17, old Node, node-gyp and native modules|||1.2 — Địa ngục phiên bản: JDK 8 và 17, Node cũ, node-gyp và module native', slug: 'lgc-1-2-jdk-node', type: 'LESSON', isFreePreview: true, description: 'javax.xml.bind trên JDK 21, maven-war-plugin 2.2 sập, class file version 52/65, bảng mã Windows, node-sass cần Python 2 — tất cả chạy thật.', content: L12 },
    { title: '1.3 — Maven for real projects: multi-module, dependency conflicts, internal repos|||1.3 — Maven trong dự án thật: nhiều module, xung đột phụ thuộc, kho nội bộ', slug: 'lgc-1-3-maven-that', type: 'LESSON', isFreePreview: true, description: 'dependency:tree, nearest-wins giữ lại bản có lỗ hổng, maven-default-http-blocker, settings.xml của kho nội bộ, nhiều module và Gradle.', content: L13 },
    { title: '1.4 — Database dump, seed data and a Docker Compose for the old stack|||1.4 — Dump cơ sở dữ liệu, dữ liệu mẫu và Docker Compose cho stack cũ', slug: 'lgc-1-4-du-lieu-docker', type: 'LESSON', isFreePreview: true, description: 'Lỗi 1419 và 1227 khi nạp dump, CSDL nạp dở, Public Key Retrieval phụ thuộc bộ đệm, compose cho stack cũ, che dữ liệu khách.', content: L14 },
    { title: '1.5 — Writing the README you wish you had|||1.5 — Viết README mà bạn ước đã có sẵn', slug: 'lgc-1-5-readme', type: 'LESSON', isFreePreview: true, description: 'Năm câu README bảo trì phải trả lời, một README chỉ gồm điều đã kiểm chứng, và cách thử nó trên người khác.', content: L15 },
    { title: '1.6 — Lab: From clone to login page in under two hours|||1.6 — Lab: Từ clone tới trang đăng nhập trong dưới hai giờ', slug: 'lgc-1-6-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-101: dựng cả hai đường, thử khói mượn/trả, README mới, ba ticket lỗi, thử bàn giao — rubric 10 điểm.', content: L16 },
    { title: '1.7 — Chapter 1 quiz|||1.7 — Kiểm tra Chương 1', slug: 'lgc-1-7-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu tình huống về javax/jakarta, class version, bảng mã, dependency tree, kho HTTP, lỗi nạp dump và dữ liệu khách.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ1 } },
  ],
};
