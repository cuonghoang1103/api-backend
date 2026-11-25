/**
 * Đọc code cũ và refactor — Chương 7: Nâng cấp phiên bản an toàn (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 7.1 Java 8 → 17/21 trên legacy-thu-vien: jdeps (javax.xml.bind "not found", JSTL 1.2 + protobuf dùng API nội bộ), bẫy class cũ trong
 *     target/, release 8 trên JDK 17 biên dịch được mà chạy NoClassDefFound, JDK 8 + release 17 BUILD SUCCESS mà sinh bytecode 52 (enforcer),
 *     UnsupportedClassVersionError, phản chiếu 8/11/17/21 (--illegal-access bị gỡ ở 17, --add-opens; Tomcat tự thêm 7 cờ), Lombok 1.18.12
 *     IllegalAccessError trên 17, Mockito 5 + JDK 21 (JEP 451), CLDR đổi "đ" → "₫" (JEP 252; COMPAT bị gỡ ở JDK 23, thử JDK 25),
 *     record/switch/instanceof/HexFormat trong commit riêng; Spring4Shell CVE-2022-22965.
 * 7.2 Spring Boot 2.5 → 2.7 → (Security 5.8) → Java 17 → 3.0 → 3.5 trên repo lab MỚI legacy-spring-api; properties-migrator,
 *     golden master qua HTTP (401 mất thân JSON từ 2.6), 17 lỗi biên dịch javax/@ConstructorBinding, dấu "/" cuối 200 → 404, thử Boot 4.1.3.
 * 7.3 OpenRewrite 6.46.1: UpgradeSpringBoot_3_5 (InMemoryUserDetailsManager mất người dùng ⇒ 8/8 test đỏ), JakartaEE10 trên app JSP
 *     (run vấp biên dịch ⇒ runNoFork/dryRun; servlet-api thành compile, jakarta.xml.bind không thêm thư viện, JSTL 1.2 không đổi).
 * 7.4 Node 14 → 24: ma trận 14–26, test khoá câu lỗi V8, lockfile v1 → v3 (npm 6 không đọc được), OpenSSL 3 md4, require(esm)
 *     (14/18 lỗi, 20.19+/22.12+ chạy; Jest 26 vẫn vỡ), DEP0005/0044/0169, Jest 30, Express 5 (21 test xanh + demo route vỡ).
 * 7.5 lab: 7 commit Java (Tomcat 10.1, golden master + e2e Testcontainers không đổi dòng nào), 3 commit Node, NANG-CAP.md.
 * 7.6 quiz 12 câu.
 * Repo: legacy-thu-vien nhánh ch7 (+ ch7-rewrite), legacy-express nhánh ch7 (+ thu-express5), legacy-spring-api nhánh nang-cap/rewrite/thu-boot4.
 * Lời giải: lab/loi-giai/ch7/ (git format-patch + demo/). Repo mới: lab/legacy-spring-api + lab/_tao-git-spring.sh (mã băm cố định 644975a).
 * KHÔNG dạy lại: record/pattern matching (spring-boot 1.1/1.2), SecurityFilterChain (spring-boot 9.1), CommonJS/ESM (nodejs 1.5),
 * semver/lockfile (nodejs 4.2), ma trận CI (github-actions 2.5), strangler fig (software-architecture 10.4).
 */
import { java, xml, bash, js, props, out, tl, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3 } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · Temurin JDK 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 · Tomcat 10.1.62 · Node 14.21.3 → 26.13.1 · OpenRewrite (rewrite-maven-plugin 6.46.1).</em></p>`;
const ZIP_SPRING = 'https://media.cuongthai.com/files/courses/doc-code-cu-va-refactor/legacy-spring-api-v1.zip';

/* ═══════════════════ 7.1 — Java 8 → 17/21 ═══════════════════ */
const O71_JDEPS = out(`
$ jdeps --multi-release 17 -summary -cp "$CP" target/classes
classes -> target/thuvien/WEB-INF/lib/commons-lang-2.6.jar
classes -> java.base
classes -> java.sql
classes -> /x/javax.servlet-api-3.1.0.jar
classes -> not found
classes -> target/thuvien/WEB-INF/lib/reload4j-1.2.27.jar
$ jdeps --multi-release 17 -verbose:class -cp "$CP" target/classes | grep "not found"
classes -> not found
   com.thuvien.util.TokenUtil                         -> javax.xml.bind.DatatypeConverter                   not found
`);
const O71_INTERNALS = out(`
$ jdeps --jdk-internals --multi-release 17 -cp "$CP" target/classes target/thuvien/WEB-INF/lib/*.jar
jstl-1.2.jar -> java.xml
   org.apache.taglibs.standard.tag.common.xml.JSTLXPathFactory -> com.sun.org.apache.xpath.internal.jaxp.XPathFactoryImpl JDK internal API (java.xml)
   org.apache.taglibs.standard.tag.common.xml.JSTLXPathImpl -> com.sun.org.apache.xml.internal.utils.PrefixResolver JDK internal API (java.xml)
   ... (9 dòng nữa, cùng gói com.sun.org.apache.xpath.internal)
protobuf-java-4.36.1.jar -> jdk.unsupported
   com.google.protobuf.UnsafeUtil                     -> sun.misc.Unsafe                                    JDK internal API (jdk.unsupported)
   ... (6 dòng nữa)

JDK Internal API                         Suggested Replacement
----------------                         ---------------------
sun.misc.Unsafe                          See http://openjdk.java.net/jeps/260
`);
const O71_STALE = out(`
$ mvn -B test          # JDK 17, ngay sau một lần build bằng JDK 8
[INFO] --- compiler:3.1:compile (default-compile) @ thuvien ---
[INFO] Nothing to compile - all classes are up to date
...
[ERROR]   LoginServletCookieTest.tokenDung_dangNhapVaVeTrangSach:49 » NoClassDefFound javax/xml/bind/DatatypeConverter
[ERROR]   TokenUtilDacTaTest.tokenCuaAdmin:12 » NoClassDefFound javax/xml/bind/DatatypeConverter
[ERROR] Tests run: 49, Failures: 1, Errors: 6, Skipped: 0
$ mvn -B clean test    # JDK 17, xoá target/ trước
[ERROR] COMPILATION ERROR :
[ERROR] /src/src/main/java/com/thuvien/util/TokenUtil.java:[4,22] package javax.xml.bind does not exist
[ERROR] /src/src/main/java/com/thuvien/util/TokenUtil.java:[15,20] cannot find symbol
[INFO] BUILD FAILURE
`);
const C71_POM1 = xml(`
<properties>
  <!-- Bài 7.1: release (cờ javac release) thay cho source/target — khoá cả API của JDK đích, không chỉ dạng bytecode -->
  <maven.compiler.release>8</maven.compiler.release>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
...
<plugin><artifactId>maven-compiler-plugin</artifactId><version>3.13.0</version></plugin>   <!-- 3.1 (2013) chưa biết cờ release -->
<plugin><artifactId>maven-war-plugin</artifactId><version>3.4.0</version></plugin>         <!-- 2.2 hỏng trên JDK mới (bài 1.2) -->
<plugin><artifactId>maven-surefire-plugin</artifactId><version>3.5.2</version></plugin>
`);
const O71_C1 = out(`
== JDK 8  (release 8)
[INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
== JDK 17 (release 8)
[INFO] Compiling 20 source files with javac [debug release 8] to target/classes
[ERROR]   LoginServletCookieTest.cookieThuHaiDung_vanDangNhap:70 » NoClassDefFound javax/xml/bind/DatatypeConverter
[ERROR]   TokenUtilTest.tokenCoDinh:11 » NoClassDefFound javax/xml/bind/DatatypeConverter
  ... (5 dòng tương tự)
[ERROR] Tests run: 49, Failures: 1, Errors: 6, Skipped: 0
`);
const C71_HEX = java(`
// TokenUtil.java — commit 2: còn release 8 nên chưa dùng được HexFormat (JDK 17)
-            return DatatypeConverter.printHexBinary(b).toLowerCase();
+            return hex(b);
...
+    /** Thay DatatypeConverter.printHexBinary(b).toLowerCase() — javax.xml.bind bị gỡ khỏi JDK 11 (JEP 320). */
+    static String hex(byte[] b) {
+        StringBuilder sb = new StringBuilder(b.length * 2);
+        for (byte x : b) {
+            sb.append(Character.forDigit((x >> 4) & 0xF, 16)).append(Character.forDigit(x & 0xF, 16));
+        }
+        return sb.toString();
+    }
`);
const O71_C2 = out(`
== JDK 8   [INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0   BUILD SUCCESS
== JDK 17  [INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0   BUILD SUCCESS
== JDK 21  [INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0   BUILD SUCCESS
           [WARNING] source value 8 is obsolete and will be removed in a future release
           [WARNING] target value 8 is obsolete and will be removed in a future release
`);
const O71_TOMCAT = out(`
$ docker compose up -d --build web        # Dockerfile: maven:3.9-eclipse-temurin-17 → tomcat:9.0-jdk17-temurin
$ docker logs rfc-thuvien-web | grep -E "Server version name|JVM Version|Picked up"
NOTE: Picked up JDK_JAVA_OPTIONS:  --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.invoke=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.rmi/sun.rmi.transport=ALL-UNNAMED
... Server version name:   Apache Tomcat/9.0.124
... JVM Version:           17.0.21.1+2
$ bash tools/golden.sh /tmp/g17 && diff -r golden /tmp/g17 && echo "GIONG HET"
 145 /tmp/g17/books.html
 125 /tmp/g17/readers.html
  29 /tmp/g17/report_days_1.html
 299 total
GIONG HET
`);
const O71_ENFORCER = out(`
# pom: maven.compiler.release=17 — build bằng JDK 8:
[INFO] Compiling 20 source files with javac [debug release 17] to target/classes
[INFO] BUILD SUCCESS
$ javap -v target/classes/com/thuvien/util/TokenUtil.class | grep major
  major version: 52                       # 52 = Java 8. Cờ release 17 bị lờ đi, KHÔNG có lỗi nào.

# thêm maven-enforcer-plugin 3.5.0 (requireJavaVersion [17,)) — build lại bằng JDK 8:
[ERROR] Rule 0: org.apache.maven.enforcer.rules.version.RequireJavaVersion failed with message:
[ERROR] Detected JDK version 1.8.0-504 (JAVA_HOME=/opt/java/openjdk/jre) is not in the allowed range [17,).
[INFO] BUILD FAILURE
`);
const C71_ENFORCER = xml(`
<plugin>
  <!-- Bài 7.1: JDK 8 bỏ qua cờ release 17 mà KHÔNG báo lỗi (sinh bytecode 52) ⇒ chặn ngay từ đầu -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-enforcer-plugin</artifactId>
  <version>3.5.0</version>
  <executions>
    <execution>
      <id>jdk-toi-thieu</id>
      <goals><goal>enforce</goal></goals>
      <configuration>
        <rules>
          <requireJavaVersion><version>[17,)</version></requireJavaVersion>
          <requireMavenVersion><version>[3.6.3,)</version></requireMavenVersion>
        </rules>
      </configuration>
    </execution>
  </executions>
</plugin>
`);
const O71_UCVE = out(`
$ java -cp target/classes com.thuvien.tools.BamMatKhauCu        # JDK 8 chạy class build bằng release 17
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError: com/thuvien/tools/BamMatKhauCu has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0
`);
const C71_PHANCHIEU = java(`
import java.lang.reflect.Field;
import java.util.ArrayList;

// Kiểu mã mà thư viện cũ (Gson 2.8, XStream, Kryo, Hibernate 4…) hay làm: đọc trường private của lớp JDK.
public class PhanChieu {
    public static void main(String[] args) throws Exception {
        ArrayList<String> ds = new ArrayList<>();
        ds.add("Lap trinh Java");
        Field f = ArrayList.class.getDeclaredField("elementData");
        f.setAccessible(true);
        Object[] mang = (Object[]) f.get(ds);
        System.out.println("java " + System.getProperty("java.version") + ": suc chua mang ben trong = " + mang.length);
    }
}
`);
const O71_PHANCHIEU = out(`
$ java PhanChieu   # JDK 8
java 1.8.0_504: suc chua mang ben trong = 10
$ java PhanChieu   # JDK 11
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by PhanChieu (file:/tmp/) to field java.util.ArrayList.elementData
WARNING: Please consider reporting this to the maintainers of PhanChieu
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
java 11.0.32.1: suc chua mang ben trong = 10
$ java PhanChieu   # JDK 17
Exception in thread "main" java.lang.reflect.InaccessibleObjectException: Unable to make field transient java.lang.Object[] java.util.ArrayList.elementData accessible: module java.base does not "opens java.util" to unnamed module @de86cdc
    at java.base/java.lang.reflect.AccessibleObject.checkCanSetAccessible(AccessibleObject.java:354)
    ...
    at PhanChieu.main(PhanChieu.java:10)
$ java --illegal-access=permit PhanChieu   # JDK 17 — "công tắc" của JDK 9–16
OpenJDK 64-Bit Server VM warning: Ignoring option --illegal-access=permit; support was removed in 17.0
Exception in thread "main" java.lang.reflect.InaccessibleObjectException: Unable to make field ...
$ java --add-opens java.base/java.util=ALL-UNNAMED PhanChieu   # JDK 17
java 17.0.20.1: suc chua mang ben trong = 10
`);
const O71_LOMBOK = out(`
# Dự án nhỏ "thu-vien-cu": Java 8, Lombok 1.18.12 (@Data), JUnit 4.12, Mockito 2.28.2
== JDK 8
BUILD SUCCESS
== JDK 17
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.8.1:compile (default-compile) on project thu-vien-cu: Fatal error compiling: java.lang.IllegalAccessError: class lombok.javac.apt.LombokProcessor (in unnamed module @0x4fe533ff) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x4fe533ff -> [Help 1]
== JDK 17 và JDK 21, -Dlombok.version=1.18.30
BUILD SUCCESS
== JDK 21, bytecode 21, Mockito 2.28.2 / 4.11.0      BUILD SUCCESS (cả hai)
== JDK 21, bytecode 21, Mockito 5.14.2
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build what is described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#0.3
WARNING: A Java agent has been loaded dynamically (/var/maven/.m2/repository/net/bytebuddy/byte-buddy-agent/1.15.4/byte-buddy-agent-1.15.4.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: Dynamic loading of agents will be disallowed by default in a future release
BUILD SUCCESS
`);
const C71_LOCALE = java(`
Locale vi = new Locale("vi", "VN");
DateFormat d = DateFormat.getDateInstance(DateFormat.FULL, vi);
System.out.println("  tien : " + NumberFormat.getCurrencyInstance(vi).format(18000));
System.out.println("  ngay : " + d.format(c.getTime()));          // c = 24/11/2026 10:00 giờ Việt Nam
System.out.println("  so   : " + NumberFormat.getInstance(vi).format(1234567.5));
`);
const O71_LOCALE = out(`
java 1.8.0_512
  tien : 18.000 đ
  ngay : Thứ ba, ngày 24 tháng mười một năm 2026
  so   : 1.234.567,5
java 11.0.33          (17.0.21.1 và 21.0.13.1 in giống hệt)
  tien : 18.000 ₫
  ngay : Thứ Ba, 24 tháng 11, 2026
  so   : 1.234.567,5
$ java -Djava.locale.providers=COMPAT,CLDR DinhDang     # JDK 17
  tien : 18.000 đ
  ngay : Thứ ba, ngày 24 tháng mười một năm 2026
$ java -Djava.locale.providers=COMPAT,CLDR DinhDang     # JDK 21
WARNING: COMPAT locale provider will be removed in a future release
  tien : 18.000 đ
$ java -Djava.locale.providers=COMPAT,CLDR DinhDang     # JDK 25
INFO: Invalid locale provider adapter "COMPAT" ignored.
WARNING: COMPAT locale provider has been removed
java 25.0.5.1
  tien : 18.000 ₫
  ngay : Thứ Ba, 24 tháng 11, 2026
`);
const O71_HIENDAI = out(`
$ git show f449d8f --stat
 src/main/java/com/thuvien/dao/PhieuMuonDAO.java           |  4 ++--
 src/main/java/com/thuvien/model/KhoangMuon.java           |  9 +--------
 src/main/java/com/thuvien/model/Tien.java                 |  2 +-
 src/main/java/com/thuvien/service/MuonTraService.java     | 12 +-----------
 src/main/java/com/thuvien/servlet/BookServlet.java        |  4 ++--
 src/main/java/com/thuvien/util/Html.java                  | 12 ++++++------
 src/main/java/com/thuvien/util/TokenUtil.java             | 15 ++++-----------
 src/test/java/com/thuvien/service/MuonTraServiceTest.java |  6 +++---
 8 files changed, 20 insertions(+), 44 deletions(-)
`);
const C71_HIENDAI = java(`
// MuonTraService.KetQua: 12 dòng lớp final + hàm dựng ⇒ 1 dòng
public record KetQua(String trang, String thongBao, boolean thanhCong) { }

// Html.thoat: switch mũi tên — không còn break, không thể "rơi" xuống case sau
switch (c) {
    case '&' -> sb.append("&amp;");
    case '<' -> sb.append("&lt;");
    case '>' -> sb.append("&gt;");
    case '"' -> sb.append("&quot;");
    case '\\'' -> sb.append("&#39;");
    default -> sb.append(c);
}

// Tien.equals: instanceof mẫu (JDK 16)
return o instanceof Tien t && t.dong == dong;

// TokenUtil: HexFormat (JDK 17) thay hàm hex tự viết của commit 2
return HexFormat.of().formatHex(b);
`);
const O71_LOG = out(`
$ git log --oneline ch6..ch7      # sau bài 7.1 (5 commit, commit nào cũng xanh)
f449d8f refactor(7.1): dung tinh nang Java 17 — record KetQua/KhoangMuon, switch mui ten, instanceof mau, HexFormat
c628b9c build(7.1): moc 2 — release 17 + enforcer requireJavaVersion [17,)
b932292 build(7.1): moc 1 — dung bang JDK 17, chay Tomcat 9.0.124 tren JDK 17 (bytecode van release 8)
290b146 fix(7.1): TokenUtil bo javax.xml.bind.DatatypeConverter (go khoi JDK 11, JEP 320) — tu in hex
b9292ac build(7.1): compiler 3.1 -> 3.13.0 (release=8), war 2.2 -> 3.4.0, surefire 3.5.2, sourceEncoding UTF-8
`);

const L71 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Upgrading safely' : 'Chương 7 · Nâng cấp phiên bản an toàn'}</span>
<h2>${en ? '7.1 — Java 8 → 17/21: removed APIs, modules, reflective access, new language features' : '7.1 — Java 8 → 17/21: API bị gỡ, module, truy cập phản chiếu, tính năng ngôn ngữ mới'}</h2>
<p class="lead">${en
  ? 'Moving house is not one action. You pack room by room, you check that the fridge fits through the new door before the truck arrives, and you do not repaint the walls on moving day. Upgrading a Java runtime is the same: one change at a time, each one proven, and the “nice new things” only after everything works in the new house. This lesson moves <code>legacy-thu-vien</code> from Java 8 to 17 in five commits, every one of them green.'
  : 'Chuyển nhà không phải một động tác. Bạn đóng thùng từng phòng, đo xem tủ lạnh có lọt cửa nhà mới trước khi xe tới, và không sơn lại tường đúng hôm dọn. Nâng phiên bản Java cũng vậy: mỗi lần một thay đổi, thay đổi nào cũng có bằng chứng, còn "đồ mới đẹp" chỉ dùng sau khi mọi thứ đã chạy ở nhà mới. Bài này đưa <code>legacy-thu-vien</code> từ Java 8 lên 17 trong năm commit, commit nào cũng xanh.'}</p>
${moiTruong(en)}

<h3>${en ? 'Why upgrade at all — and why 17, not “the latest”' : 'Vì sao phải nâng — và vì sao 17, không phải "bản mới nhất"'}</h3>
<p>${en
  ? 'Since Java 9 (2017) the JDK ships every six months; every few years (every two years since 17) one release is a long-term-support (LTS) release that vendors patch for years: <strong>8 (2014), 11 (2018), 17 (2021), 21 (2023), 25 (2025)</strong>. Customers ask for upgrades for three concrete reasons: security patches (free public updates for old releases end), frameworks that stop supporting old JDKs (Spring Boot 3 needs 17 — lesson 7.2), and hosting that no longer offers the old runtime. In outsourcing the target is usually written in the contract: “Java 17 LTS”. A two-step jump 8 → 17 is normal; jumping straight to 25 is possible but makes every problem harder to attribute. The recommended path in the Oracle migration guide is the same as ours: make it build and run on the new JDK first, change the code later.'
  : 'Từ Java 9 (2017), JDK ra bản mới mỗi sáu tháng; cứ vài năm (từ bản 17 là hai năm) lại có một bản hỗ trợ dài hạn (LTS) được các hãng vá nhiều năm: <strong>8 (2014), 11 (2018), 17 (2021), 21 (2023), 25 (2025)</strong>. Khách yêu cầu nâng vì ba lý do cụ thể: bản vá bảo mật (bản cũ hết cập nhật miễn phí), framework bỏ hỗ trợ JDK cũ (Spring Boot 3 đòi 17 — bài 7.2), và nơi chạy không còn cung cấp runtime cũ. Ở dự án outsourcing, đích thường ghi sẵn trong hợp đồng: "Java 17 LTS". Nhảy 8 → 17 là bình thường; nhảy thẳng lên 25 làm được nhưng mỗi lỗi sẽ khó biết do mốc nào gây ra. Hướng dẫn di trú của Oracle khuyên đúng thứ tự ta làm: cho nó build và chạy trên JDK mới trước, sửa mã sau.'}</p>
<table>
<tr><th>${en ? 'Release' : 'Bản'}</th><th>${en ? 'What breaks old code (the ones you will meet)' : 'Thứ làm vỡ mã cũ (những thứ bạn sẽ gặp)'}</th></tr>
<tr><td>9 (2017)</td><td>${en ? 'Module system (JEP 261); JDK internals encapsulated but still reachable with a warning; CLDR locale data by default (JEP 252); <code>--release</code> flag (JEP 247)' : 'Hệ module (JEP 261); API nội bộ của JDK bị bọc nhưng vẫn với tới được kèm cảnh báo; dữ liệu locale CLDR thành mặc định (JEP 252); cờ <code>--release</code> (JEP 247)'}</td></tr>
<tr><td>11 (2018)</td><td>${en ? 'Java EE and CORBA modules removed: <code>javax.xml.bind</code> (JAXB), <code>javax.activation</code>, JAX-WS (JEP 320); Nashorn deprecated' : 'Gỡ module Java EE và CORBA: <code>javax.xml.bind</code> (JAXB), <code>javax.activation</code>, JAX-WS (JEP 320); Nashorn bị đánh dấu bỏ'}</td></tr>
<tr><td>16–17 (2021)</td><td>${en ? 'Strong encapsulation: illegal reflective access denied by default in 16 (JEP 396), the <code>--illegal-access</code> switch removed in 17 (JEP 403); Security Manager deprecated (JEP 411)' : 'Đóng gói chặt: truy cập phản chiếu trái phép bị chặn mặc định ở 16 (JEP 396), công tắc <code>--illegal-access</code> bị gỡ ở 17 (JEP 403); Security Manager bị đánh dấu bỏ (JEP 411)'}</td></tr>
<tr><td>18–25</td><td>${en ? 'UTF-8 default charset in 18 (JEP 400, lesson 1.2); dynamic agent warning in 21 (JEP 451); the COMPAT locale provider removed in 23' : 'UTF-8 thành bảng mã mặc định ở 18 (JEP 400, bài 1.2); cảnh báo nạp agent động ở 21 (JEP 451); gỡ bộ locale COMPAT ở 23'}</td></tr>
</table>

<h3>${en ? 'Step 0: inventory before you touch the POM' : 'Bước 0: kiểm kê trước khi chạm vào POM'}</h3>
<p>${en
  ? '<code>jdeps</code> ships with every JDK. Run the <em>new</em> JDK’s jdeps against the classes the <em>old</em> build produced, plus the jars in <code>WEB-INF/lib</code> and the servlet API (otherwise every <code>javax.servlet</code> class shows as “not found” and drowns the signal):'
  : '<code>jdeps</code> có sẵn trong mọi JDK. Chạy jdeps của JDK <em>mới</em> lên các class mà bản build <em>cũ</em> sinh ra, kèm các jar trong <code>WEB-INF/lib</code> và servlet API (không thì mọi lớp <code>javax.servlet</code> đều hiện "not found", lấp mất tín hiệu thật):'}</p>
${O71_JDEPS}
${O71_INTERNALS}
<p>${en
  ? 'Three findings, each with a different action. <strong>TokenUtil → javax.xml.bind</strong>: a hard failure on 11+, already met in lesson 1.2 where we added <code>jaxb-api</code> just to get a build; now we remove the dependency properly. <strong>JSTL 1.2 → com.sun…xpath.internal</strong>: only the <code>x:</code> (XML) tags use it; our JSPs use <code>c:</code> only, so it is noted, not fixed — and JSTL 1.2 has a bigger problem in lesson 7.5. <strong>protobuf → sun.misc.Unsafe</strong>: <code>jdk.unsupported</code> is deliberately kept open (JEP 260), so it works; it is the driver’s business, not ours. An inventory is a list of decisions, not a to-do list.'
  : 'Ba phát hiện, mỗi cái một cách xử. <strong>TokenUtil → javax.xml.bind</strong>: chết cứng từ 11, đã gặp ở bài 1.2 khi ta thêm <code>jaxb-api</code> chỉ để build được; giờ gỡ phụ thuộc đó cho đàng hoàng. <strong>JSTL 1.2 → com.sun…xpath.internal</strong>: chỉ các thẻ <code>x:</code> (XML) dùng nó; JSP của ta chỉ dùng <code>c:</code>, nên ghi lại chứ không sửa — và JSTL 1.2 còn một vấn đề lớn hơn ở bài 7.5. <strong>protobuf → sun.misc.Unsafe</strong>: <code>jdk.unsupported</code> được cố ý để mở (JEP 260), nên vẫn chạy; đó là việc của driver, không phải của ta. Kiểm kê là danh sách quyết định, không phải danh sách việc phải làm.'}</p>

<h3>${en ? 'Trap 1: classes left over in target/' : 'Bẫy 1: class cũ còn sót trong target/'}</h3>
${O71_STALE}
<p>${en
  ? 'The first run did not compile anything: <code>target/classes</code> still held the classes from the JDK 8 build, so the “compile” looked fine and the failure moved to runtime. When you switch JDK, <strong>always <code>mvn clean</code></strong> — and in CI never reuse a <code>target/</code> cache across JDK versions. The second run is the honest one.'
  : 'Lần chạy đầu không biên dịch gì cả: <code>target/classes</code> vẫn giữ class của lần build JDK 8, nên bước "biên dịch" trông ổn và lỗi dời sang lúc chạy. Khi đổi JDK, <strong>luôn <code>mvn clean</code></strong> — và trên CI đừng dùng lại bộ nhớ đệm <code>target/</code> giữa các bản JDK. Lần chạy thứ hai mới là lần trung thực.'}</p>

<h3>${en ? 'Commit 1: modern build plugins, still producing Java 8' : 'Commit 1: plugin build mới, vẫn sinh Java 8'}</h3>
${C71_POM1}
${O71_C1}
<p>${en
  ? 'This is the most useful output of the lesson. With <code>release 8</code>, javac on JDK 17 compiles against the <em>Java 8 API</em> (a signature file shipped inside the JDK), so <code>javax.xml.bind</code> exists at compile time. At run time the JVM is 17 and the class is gone. Three different things are involved and an upgrade changes them separately: <strong>the JDK that builds</strong>, <strong>the bytecode level / API you target</strong>, <strong>the JRE that runs</strong>. Prefer <code>release</code> over <code>source</code>/<code>target</code>: with plain source/target 8, javac on 17 would let you call a Java 17 method and the WAR would crash on a Java 8 server.'
  : 'Đây là output đáng học nhất của bài. Với <code>release 8</code>, javac trên JDK 17 biên dịch theo <em>API của Java 8</em> (một tệp chữ ký đi kèm JDK), nên <code>javax.xml.bind</code> vẫn tồn tại lúc biên dịch. Lúc chạy, JVM là 17 và lớp đó đã mất. Có ba thứ khác nhau, và nâng cấp đổi từng thứ một: <strong>JDK dùng để build</strong>, <strong>mức bytecode / API mình nhắm tới</strong>, <strong>JRE dùng để chạy</strong>. Dùng <code>release</code> thay cho <code>source</code>/<code>target</code>: chỉ có source/target 8 thì javac 17 vẫn cho bạn gọi một hàm của Java 17, và WAR sẽ chết trên máy chủ Java 8.'}</p>

<h3>${en ? 'Commit 2: remove the dead API — the test already guards it' : 'Commit 2: gỡ API đã chết — test đã canh sẵn'}</h3>
${C71_HEX}
${O71_C2}
<p>${en
  ? '<code>TokenUtilTest.tokenCoDinh</code> from Chapter 3 pins the exact token for a known user, so any mistake in the hand-written hex (upper case, missing leading zero) turns it red. The alternative — adding <code>jakarta.xml.bind-api</code> just for one hex call — keeps a 200 KB dependency for 6 lines of code. Note the JDK 21 warnings: “source value 8 is obsolete” is the JDK telling you that some future release will refuse to build Java 8 bytecode at all.'
  : '<code>TokenUtilTest.tokenCoDinh</code> của Chương 3 khoá đúng token của một người dùng biết trước, nên sai một li trong hàm hex tự viết (chữ hoa, thiếu số 0 đầu) là đỏ. Cách khác — thêm <code>jakarta.xml.bind-api</code> chỉ để đổi sang hex — là giữ một thư viện 200 KB cho 6 dòng mã. Để ý cảnh báo của JDK 21: "source value 8 is obsolete" là JDK báo trước rằng một bản tương lai sẽ không build bytecode Java 8 nữa.'}</p>

<h3>${en ? 'Commit 3 (milestone 1): change the runtime, not the code' : 'Commit 3 (mốc 1): đổi runtime, chưa đổi mã'}</h3>
${O71_TOMCAT}
<p>${en
  ? 'Same WAR, Java 8 bytecode, running on Tomcat 9 with JDK 17: the Chapter 3 golden master is byte-identical. Look at the first line: Tomcat’s start script quietly adds seven <code>--add-opens</code> flags (it needs reflective access to clean up memory leaks on redeploy). That is why an app can “work on Tomcat” and then crash the day someone runs the same code with plain <code>java -jar</code> — the flags were Tomcat’s, not yours. This milestone is a release on its own: if production breaks, you roll back the runtime without touching a line of code.'
  : 'Cùng WAR, bytecode Java 8, chạy trên Tomcat 9 với JDK 17: golden master của Chương 3 giống hệt từng byte. Nhìn dòng đầu: script khởi động của Tomcat lặng lẽ thêm bảy cờ <code>--add-opens</code> (nó cần phản chiếu để dọn rò rỉ bộ nhớ khi deploy lại). Đó là lý do một ứng dụng "chạy được trên Tomcat" rồi chết vào ngày ai đó chạy cùng mã bằng <code>java -jar</code> trần — cờ là của Tomcat, không phải của bạn. Mốc này tự nó là một lần phát hành: nếu production vỡ, bạn lùi runtime mà không đụng dòng mã nào.'}</p>

<h3>${en ? 'Commit 4 (milestone 2): release 17 — and trap 2' : 'Commit 4 (mốc 2): release 17 — và bẫy 2'}</h3>
${O71_ENFORCER}
${C71_ENFORCER}
<p>${en
  ? 'A teammate whose IDE still points at JDK 8 builds the project, sees BUILD SUCCESS and ships Java 8 bytecode — the compiler plugin passes <code>--release</code> only when the JDK understands it and otherwise silently falls back. The enforcer turns “works on my machine” into a clear error on the first line. Once bytecode is 61, the WAR can no longer run on an old server, and the error says exactly that:'
  : 'Một đồng đội có IDE vẫn trỏ JDK 8 build dự án, thấy BUILD SUCCESS và giao bytecode Java 8 — plugin biên dịch chỉ truyền <code>--release</code> khi JDK hiểu nó, không thì lặng lẽ bỏ qua. Enforcer biến "máy em chạy được" thành một lỗi rõ ràng ngay dòng đầu. Khi bytecode là 61, WAR không chạy được trên máy chủ cũ nữa, và câu lỗi nói đúng như vậy:'}</p>
${O71_UCVE}

<h3>${en ? 'Reflective access: what actually broke in 2021' : 'Truy cập phản chiếu: thứ thật sự vỡ năm 2021'}</h3>
<p>${en
  ? 'Our lab has no reflection into the JDK, so we use a 10-line program that does what many old libraries did:'
  : 'Lab của ta không phản chiếu vào JDK, nên dùng một chương trình 10 dòng làm đúng việc nhiều thư viện cũ từng làm:'}</p>
${C71_PHANCHIEU}
${O71_PHANCHIEU}
<p>${en
  ? 'The history in four runs: 8 allows it, 11 warns (“will be denied in a future release”), 17 denies it and even ignores the old escape hatch. <code>--add-opens module/package=ALL-UNNAMED</code> still works, but it is a <em>debt</em>: write each flag down with the library that needs it, and remove it when the library is upgraded. The usual real-world fix is not a flag but a newer library — which leads to the classic upgrade error:'
  : 'Lịch sử trong bốn lần chạy: 8 cho phép, 11 cảnh báo ("sẽ bị chặn ở bản tương lai"), 17 chặn và lờ luôn lối thoát cũ. <code>--add-opens module/gói=ALL-UNNAMED</code> vẫn dùng được, nhưng nó là một khoản <em>nợ</em>: ghi mỗi cờ kèm thư viện cần nó, và gỡ khi thư viện được nâng. Cách sửa thường gặp ngoài đời không phải là cờ mà là bản thư viện mới hơn — dẫn tới lỗi nâng cấp kinh điển:'}</p>
${O71_LOMBOK}
<p>${en
  ? 'Lombok hooks into javac’s internals, so on JDK 17 an old Lombok dies <em>at compile time</em> with <code>IllegalAccessError … does not export com.sun.tools.javac.processing</code>. Searching that message leads to the Lombok changelog: 1.18.22 supports 17, 1.18.30 supports 21. Mockito surprised us: 2.28 and 4.11 created class mocks on JDK 21 without complaint; only Mockito 5 (inline mock maker by default) prints the JDK 21 warning about agents loaded dynamically (JEP 451). Lesson: <strong>measure, do not repeat forum folklore</strong> — and treat warnings as next year’s errors.'
  : 'Lombok móc vào phần nội bộ của javac, nên trên JDK 17 bản Lombok cũ chết <em>ngay lúc biên dịch</em> với <code>IllegalAccessError … does not export com.sun.tools.javac.processing</code>. Tra câu lỗi đó sẽ ra changelog của Lombok: 1.18.22 hỗ trợ 17, 1.18.30 hỗ trợ 21. Mockito thì làm ta bất ngờ: 2.28 và 4.11 vẫn tạo mock lớp trên JDK 21 không kêu ca; chỉ Mockito 5 (mặc định inline mock maker) in cảnh báo của JDK 21 về agent nạp động (JEP 451). Bài học: <strong>đo, đừng nhắc lại truyền thuyết trên diễn đàn</strong> — và coi cảnh báo là lỗi của năm sau.'}</p>

<h3>${en ? 'Trap 3: same code, different text — locale data (JEP 252)' : 'Bẫy 3: cùng mã, khác chữ — dữ liệu locale (JEP 252)'}</h3>
${C71_LOCALE}
${O71_LOCALE}
<p>${en
  ? 'No exception, no warning, and every invoice now says “₫” instead of “đ”, and the long date format changed. JDK 9 switched the default locale data to the Unicode CLDR. The escape hatch <code>-Djava.locale.providers=COMPAT</code> restores the old text on 17, warns on 21 and is gone on 25. Our lab is safe only because Chapter 5 made <code>Tien.toString()</code> format the number itself instead of trusting <code>NumberFormat</code> — and because the golden master would have caught it. If your app prints dates or money through the JDK’s locale data, a characterization test on that output is mandatory before the upgrade.'
  : 'Không ngoại lệ, không cảnh báo, mà mọi hoá đơn giờ in "₫" thay vì "đ", và kiểu ngày dài cũng đổi. JDK 9 đổi dữ liệu locale mặc định sang CLDR của Unicode. Lối thoát <code>-Djava.locale.providers=COMPAT</code> trả lại chữ cũ trên 17, cảnh báo trên 21 và mất hẳn trên 25. Lab của ta an toàn chỉ vì Chương 5 cho <code>Tien.toString()</code> tự định dạng số thay vì tin <code>NumberFormat</code> — và vì golden master sẽ bắt được. Nếu ứng dụng của bạn in ngày hay tiền qua dữ liệu locale của JDK, characterization test cho output đó là bắt buộc trước khi nâng.'}</p>

<h3>${en ? 'Commit 5: the new language features — in their own commit' : 'Commit 5: tính năng ngôn ngữ mới — trong commit riêng'}</h3>
${O71_HIENDAI}
${C71_HIENDAI}
<p>${en
  ? 'Only now, with release 17 merged and green, do we use what Java 17 offers. Each change is a refactoring in the Chapter 5 sense (behaviour unchanged, 49 tests green), and each one deletes code: 44 lines out, 20 in. Two cautions. A record generates <code>equals</code>/<code>hashCode</code>/<code>toString</code> from its fields — <code>KhoangMuon</code> used to compare by identity and now compares by value; nobody relied on it here, but check before you convert a class that lives in a <code>HashSet</code>. And a record does not copy mutable fields: <code>KhoangMuon</code> still hands out <code>Timestamp</code> objects anyone can change. For the language features themselves, the Spring Boot course explains them properly; this lesson only applies them.'
  : 'Chỉ đến lúc này, khi release 17 đã gộp và xanh, ta mới dùng thứ Java 17 mang lại. Mỗi thay đổi là một phép refactor đúng nghĩa Chương 5 (hành vi không đổi, 49 test xanh), và cái nào cũng xoá bớt mã: bỏ 44 dòng, thêm 20. Hai điều cẩn thận. Record tự sinh <code>equals</code>/<code>hashCode</code>/<code>toString</code> từ các trường — <code>KhoangMuon</code> trước so bằng danh tính, giờ so bằng giá trị; ở đây không ai dựa vào điều đó, nhưng hãy kiểm trước khi đổi một lớp đang nằm trong <code>HashSet</code>. Và record không sao chép trường có thể đổi: <code>KhoangMuon</code> vẫn đưa ra đối tượng <code>Timestamp</code> mà ai cũng sửa được. Về bản thân các tính năng ngôn ngữ, khoá Spring Boot giảng kỹ; bài này chỉ áp chúng vào.'}</p>
${O71_LOG}

<h3>🕵️ ${en ? 'Real incident: Spring4Shell (CVE-2022-22965, March 2022)' : 'Sự cố thật: Spring4Shell (CVE-2022-22965, tháng 3/2022)'}</h3>
<p>${en
  ? 'A remote-code-execution flaw in Spring MVC data binding. The decisive detail: it was exploitable only on <strong>JDK 9 or later</strong>, for apps packaged as a <strong>WAR on Tomcat</strong>. Java 9 added <code>Class.getModule()</code>, which opened a new path through <code>class.module.classLoader</code> around a protection Spring had added years earlier for a similar bug — attackers could set Tomcat’s access-log properties and write a JSP web shell to disk. Teams that had upgraded the JDK but not the framework were exposed; the fixes were Spring Framework 5.3.18 / 5.2.20 and Tomcat 9.0.62 / 8.5.78. Moral for this chapter: <strong>a runtime upgrade changes the attack surface of every library you kept</strong>. Upgrade the JDK and the frameworks as one plan, and re-run the dependency check of lesson 6.2 after each milestone.'
  : 'Một lỗ hổng thực thi mã từ xa trong cơ chế gán dữ liệu (data binding) của Spring MVC. Chi tiết quyết định: nó chỉ khai thác được trên <strong>JDK 9 trở lên</strong>, với ứng dụng đóng gói <strong>WAR chạy trên Tomcat</strong>. Java 9 thêm <code>Class.getModule()</code>, mở ra đường đi mới qua <code>class.module.classLoader</code> vòng qua lớp bảo vệ mà Spring đã thêm nhiều năm trước cho một lỗi tương tự — kẻ tấn công đặt được thuộc tính access log của Tomcat và ghi một web shell JSP xuống đĩa. Đội nào đã nâng JDK mà chưa nâng framework thì dính; bản vá là Spring Framework 5.3.18 / 5.2.20 và Tomcat 9.0.62 / 8.5.78. Bài học cho chương này: <strong>nâng runtime là đổi bề mặt tấn công của mọi thư viện bạn giữ lại</strong>. Nâng JDK và framework như một kế hoạch, và chạy lại phép kiểm thư viện của bài 6.2 sau mỗi mốc.'}</p>

<h3>🏠 ${en ? 'Everyday analogy' : 'Liên hệ đời thường'}</h3>
<p>${en
  ? 'The three things of Commit 1 — builder, target, runtime — are like a document written in Word 2024, saved “compatible with Word 2007”, opened on a colleague’s Word 2010. “Saved as 2007” controls the file format; it does not stop you from using a 2024-only feature that the old Word silently drops. <code>--release</code> is the version of “compatible mode” that actually greys out the new features.'
  : 'Ba thứ của Commit 1 — người build, đích, người chạy — giống một văn bản soạn bằng Word 2024, lưu "tương thích Word 2007", rồi mở trên Word 2010 của đồng nghiệp. "Lưu dạng 2007" quyết định định dạng tệp; nó không ngăn bạn dùng một tính năng chỉ 2024 mới có mà Word cũ lặng lẽ vứt đi. <code>--release</code> là kiểu "chế độ tương thích" làm mờ hẳn các tính năng mới.'}</p>

<h3>💼 ${en ? 'OJT situation: “how long will Java 17 take?”' : 'Tình huống OJT: "nâng Java 17 mất bao lâu?"'}</h3>
<p>${en
  ? 'The PM asks for an estimate before the customer meeting. Do not answer with a number from your gut; spend two hours on the inventory and answer with milestones and unknowns:'
  : 'PM hỏi ước lượng trước buổi họp với khách. Đừng trả lời bằng một con số theo cảm giác; dành hai giờ kiểm kê rồi trả lời bằng mốc và điều chưa biết:'}</p>
${out(`
Ước lượng nâng Java 8 → 17 (thuvien) — dựa trên jdeps + chạy thử 2 giờ
Mốc 1 (0,5 ngày): plugin build + bỏ javax.xml.bind; chạy trên Tomcat 9/JDK 17 ở staging. Rủi ro thấp: 49 test + golden master có sẵn.
Mốc 2 (0,5 ngày): release 17 + enforcer; cập nhật hướng dẫn máy dev (JDK 17).
Mốc 3 (1–2 ngày, CHƯA CHẮC): Tomcat 10/jakarta nếu khách cần — phụ thuộc JSTL, thư viện bên thứ ba.
Chưa biết: máy chủ production của khách có JDK 17 chưa; có job/batch ngoài repo dùng chung thư viện không.
Cần từ khách: quyền vào staging, xác nhận phiên bản Tomcat được phép dùng.
`)}

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“What is the difference between source/target and release?”' : '"source/target khác release ở đâu?"'}</strong><br>${en
  ? 'source/target set language level and bytecode version but compile against the current JDK’s library, so you can call APIs that do not exist on the target. release (JDK 9+) also restricts the API to the target version. It also hides removed APIs’ absence: release 8 on JDK 17 still sees javax.xml.bind, so you must run tests on the new runtime.'
  : 'source/target đặt mức ngôn ngữ và phiên bản bytecode nhưng biên dịch theo thư viện của JDK đang dùng, nên vẫn gọi được API không có ở đích. release (JDK 9+) khoá luôn API theo bản đích. Nó cũng che sự vắng mặt của API bị gỡ: release 8 trên JDK 17 vẫn thấy javax.xml.bind, nên phải chạy test trên runtime mới.'}</li>
<li><strong>${en ? '“Our app throws InaccessibleObjectException on Java 17. What do you do?”' : '"Ứng dụng ném InaccessibleObjectException trên Java 17. Em làm gì?"'}</strong><br>${en
  ? 'Read which module/package and which caller. If it is a library, upgrade it to a version that supports 17. If no fix exists yet, add the narrowest --add-opens, document it with the library and a ticket to remove it.'
  : 'Đọc module/gói nào và nơi gọi nào. Nếu là thư viện, nâng lên bản hỗ trợ 17. Nếu chưa có bản sửa, thêm --add-opens hẹp nhất có thể, ghi lại kèm tên thư viện và một ticket để gỡ.'}</li>
<li><strong>${en ? '“Why not upgrade straight to 25 and use records everywhere in the same PR?”' : '"Sao không nâng thẳng lên 25 và đổi sang record luôn trong cùng PR?"'}</strong><br>${en
  ? 'Because when something breaks you cannot tell which change did it, and you cannot roll back the runtime without rolling back the refactor. Runtime first, release level second, language features last — each its own commit and PR.'
  : 'Vì khi có lỗi thì không biết thay đổi nào gây ra, và không lùi được runtime mà không lùi luôn phần refactor. Runtime trước, mức release sau, tính năng ngôn ngữ cuối cùng — mỗi thứ một commit, một PR.'}</li>
<li><strong>${en ? '“Tests are green on 17. Are we done?”' : '"Test xanh trên 17 rồi. Xong chưa?"'}</strong><br>${en
  ? 'Not yet: check output that tests may not pin (locale-formatted money/dates — JEP 252), run the app on the real server type (Tomcat adds --add-opens; java -jar does not), and re-run the dependency/CVE check.'
  : 'Chưa: kiểm output mà test có thể không khoá (tiền/ngày định dạng theo locale — JEP 252), chạy ứng dụng trên đúng loại máy chủ thật (Tomcat tự thêm --add-opens; java -jar thì không), và chạy lại phép kiểm thư viện/CVE.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'On your copy of the lab (branch <code>ch6</code>), reproduce the five commits. Then answer: (1) which test would have failed if you had written the hex digits in upper case? (2) Run the JDK 8 build with release 17 <em>without</em> the enforcer and prove the bytecode version with <code>javap</code>. (3) Run <code>DinhDang.java</code> from <code>lab/loi-giai/ch7/demo/</code> on two JDKs and write one sentence for the release notes.'
  : 'Trên bản lab của bạn (nhánh <code>ch6</code>), làm lại năm commit. Rồi trả lời: (1) test nào sẽ đỏ nếu bạn viết chữ số hex bằng chữ hoa? (2) Build bằng JDK 8 với release 17 mà <em>không</em> có enforcer, chứng minh phiên bản bytecode bằng <code>javap</code>. (3) Chạy <code>DinhDang.java</code> trong <code>lab/loi-giai/ch7/demo/</code> trên hai JDK và viết một câu cho ghi chú phát hành.'}</p>
${giai(en ? '🔑 Answers' : '🔑 Đáp án', `<ol>
<li>${en ? '<code>TokenUtilTest.tokenCoDinh</code> and <code>TokenUtilDacTaTest.tokenCuaAdmin</code> (they pin the lowercase token), plus the cookie login tests that compare tokens.' : '<code>TokenUtilTest.tokenCoDinh</code> và <code>TokenUtilDacTaTest.tokenCuaAdmin</code> (khoá token chữ thường), cùng các test đăng nhập bằng cookie có so token.'}</li>
<li>${en ? '<code>major version: 52</code> — BUILD SUCCESS with Java 8 bytecode.' : '<code>major version: 52</code> — BUILD SUCCESS mà bytecode là Java 8.'}</li>
<li>${en ? 'Example: “From Java 9 on, Vietnamese currency prints as ₫ and long dates as ‘Thứ Ba, 24 tháng 11, 2026’; our screens format money themselves and are unaffected.”' : 'Ví dụ: "Từ Java 9, tiền Việt in ký hiệu ₫ và ngày dài dạng \'Thứ Ba, 24 tháng 11, 2026\'; màn hình của hệ thống tự định dạng tiền nên không bị ảnh hưởng."'}</li>
</ol>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['LTS', 'bản hỗ trợ dài hạn', 'Bản JDK được vá nhiều năm: 8, 11, 17, 21, 25.', 'A JDK release patched for years: 8, 11, 17, 21, 25.'],
  ['--release N', 'cờ release', 'Biên dịch theo cả mức ngôn ngữ, bytecode lẫn API của Java N.', 'Compile for Java N’s language level, bytecode and API.'],
  ['Class file version', 'phiên bản tệp class', '52 = Java 8, 55 = 11, 61 = 17, 65 = 21. JRE cũ không chạy được số lớn hơn.', '52 = Java 8, 55 = 11, 61 = 17, 65 = 21. An older JRE cannot run a higher one.'],
  ['jdeps', 'jdeps', 'Công cụ của JDK liệt kê phụ thuộc và API nội bộ đang dùng.', 'The JDK tool that lists dependencies and internal APIs in use.'],
  ['Strong encapsulation', 'đóng gói chặt', 'JDK 16–17 chặn phản chiếu vào phần nội bộ; cần --add-opens.', 'JDK 16–17 deny reflection into internals; needs --add-opens.'],
  ['CLDR', 'CLDR', 'Kho dữ liệu locale của Unicode, mặc định từ JDK 9 (đổi chữ ngày/tiền).', 'Unicode’s locale data, default since JDK 9 (changes date/money text).'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Inventory with jdeps first; every finding is a decision (fix, note, or leave to the library).' : 'Kiểm kê bằng jdeps trước; mỗi phát hiện là một quyết định (sửa, ghi lại, hay để thư viện lo).'}</li>
<li>${en ? 'Builder, target and runtime are three things; change them one milestone at a time, <code>mvn clean</code> each time.' : 'Người build, đích và người chạy là ba thứ; đổi từng mốc một, mỗi lần đều <code>mvn clean</code>.'}</li>
<li>${en ? 'Silent traps: stale classes, release ignored by JDK 8, Tomcat’s hidden --add-opens, CLDR text changes.' : 'Bẫy im lặng: class cũ sót lại, JDK 8 lờ cờ release, --add-opens ẩn của Tomcat, chữ CLDR đổi.'}</li>
<li>${en ? 'New language features come last, in a pure-refactor commit.' : 'Tính năng ngôn ngữ mới dùng sau cùng, trong một commit refactor thuần.'}</li>
</ul>
${tl('https://docs.oracle.com/en/java/javase/17/migrate/getting-started.html', '☕', 'Oracle — JDK 17 Migration Guide', en ? 'Official checklist: removed APIs, encapsulation, tools' : 'Danh sách chính thức: API bị gỡ, đóng gói, công cụ')}
${tl('https://openjdk.org/jeps/403', '☕', 'JEP 403 — Strongly Encapsulate JDK Internals', en ? 'Why --illegal-access is gone in 17' : 'Vì sao --illegal-access mất ở 17')}
${tl('https://openjdk.org/jeps/252', '🌐', 'JEP 252 — Use CLDR Locale Data by Default', en ? 'The “đ” → “₫” change' : 'Thay đổi "đ" → "₫"')}
${tl('https://spring.io/security/cve-2022-22965', '🛡️', 'Spring — CVE-2022-22965 (Spring4Shell)', en ? 'JDK 9+, WAR on Tomcat, fixed in 5.3.18' : 'JDK 9+, WAR trên Tomcat, vá ở 5.3.18')}
${lk(bai('spring-boot', 'sb-1-1-record-var'), '🧩', en ? 'Spring Boot 1.1 — record and var' : 'Spring Boot 1.1 — record và var', en ? 'The language features, explained properly' : 'Giảng kỹ các tính năng ngôn ngữ')}
${lk(bai('spring-boot', 'sb-1-2-pattern-matching'), '🧩', en ? 'Spring Boot 1.2 — pattern matching' : 'Spring Boot 1.2 — pattern matching', en ? 'instanceof patterns and switch' : 'instanceof mẫu và switch')}
`);

/* ═══════════════════ 7.2 — Spring Boot 2 → 3 ═══════════════════ */
const C72_BAOMAT_CU = java(`
/** Công thức Spring Security 5 chép từ StackOverflow năm 2020. */
@Configuration
@EnableWebSecurity
public class CauHinhBaoMat extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/sach/**", "/api/quy-dinh").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .httpBasic();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
            .withUser("thuthu").password("{noop}123456").roles("USER")
            .and()
            .withUser("admin").password("{noop}admin123").roles("ADMIN");
    }
}
`);
const C72_PROPS_CU = props(`
spring.application.name=thuvien-api
spring.datasource.url=jdbc:h2:mem:thuvien;DB_CLOSE_DELAY=-1
spring.datasource.initialization-mode=always
spring.jpa.defer-datasource-initialization=true
spring.jpa.hibernate.ddl-auto=create
spring.jpa.hibernate.use-new-id-generator-mappings=false
spring.jpa.open-in-view=false
server.max-http-header-size=16KB
thuvien.phi-tre-moi-ngay=2000
thuvien.so-ngay-muon=14
`);
const C72_TEST = java(`
/** Characterization test (bài 7.2): khoá hành vi API TRƯỚC khi nâng Spring Boot — kể cả hành vi "tình cờ". */
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SachApiDacTaTest {
    @Autowired MockMvc mvc;

    @Test
    void dauGachCheoCuoi_vanKhop() throws Exception {
        mvc.perform(get("/api/sach/")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void themSach_chuaDangNhap_401() throws Exception {
        mvc.perform(post("/api/sach").contentType(MediaType.APPLICATION_JSON).content("{\\"ten\\":\\"Git\\",\\"soLuong\\":1}"))
           .andExpect(status().isUnauthorized());
    }
    // … tổng 8 test: danh sách, quy định từ properties, 201 khi hợp lệ, 400 tên rỗng, 403 thủ thư xoá, 204 admin xoá
}
`);
const C72_GOI = bash(`
#!/bin/bash
# tools/goi-api.sh <tệp ra> — chạy jar thật trong container, gọi 9 request, ghi mã + thân (thay timestamp bằng <T>)
# MockMvc KHÔNG đi qua trang lỗi /error của Tomcat — curl thì có.
MK=123456   # mật khẩu tài khoản thử thuthu (dữ liệu lab)
goi() { local nhan=$1; shift; printf '### %s\\n' "$nhan"
        curl -s -w '\\n=> %{http_code}\\n' "$@" | sed -E 's/"timestamp":"[^"]*"/"timestamp":"<T>"/'; }
goi "GET /api/sach/ (gach cheo cuoi)" $B/api/sach/
goi "POST /api/sach khong dang nhap" -X POST -H 'Content-Type: application/json' -d '{"ten":"Git","soLuong":1}' $B/api/sach
goi "POST /api/sach ten rong (thuthu)" -u thuthu:$MK -X POST -H 'Content-Type: application/json' -d '{"ten":"","soLuong":1}' $B/api/sach
goi "DELETE /api/admin/sach/2 (thuthu)" -u thuthu:$MK -X DELETE $B/api/admin/sach/2
goi "GET /khong-co" $B/khong-co
# … (9 request — bản đủ trong lab/legacy-spring-api sau commit đầu của nhánh nang-cap)
`);
const O72_TRUOC = out(`
### GET /api/sach/ (gach cheo cuoi)
[{"id":1,"ten":"Lập trình Java","tacGia":"Nguyễn Văn A","conLai":3},{"id":2,"ten":"Cơ sở dữ liệu",...}]
=> 200
### POST /api/sach khong dang nhap
{"timestamp":"<T>","status":401,"error":"Unauthorized","path":"/api/sach"}
=> 401
### POST /api/sach ten rong (thuthu)
{"timestamp":"<T>","status":400,"error":"Bad Request","path":"/api/sach"}
=> 400
### DELETE /api/admin/sach/2 (thuthu)
{"timestamp":"<T>","status":403,"error":"Forbidden","path":"/api/admin/sach/2"}
=> 403
### GET /khong-co
{"timestamp":"<T>","status":401,"error":"Unauthorized","path":"/khong-co"}
=> 401
`);
const O72_SUPPORT = out(`
$ curl -s https://api.spring.io/projects/spring-boot/generations | (tên, ra mắt, hết hỗ trợ miễn phí, hết hỗ trợ thương mại)
2.5.x 2021-05-31 2022-05-31 2023-08-31
2.7.x 2022-05-31 2023-06-30 2029-06-30
3.0.x 2022-11-30 2023-12-31 2024-12-31
3.5.x 2025-05-31 2026-06-30 2032-06-30
4.0.x 2025-11-30 2026-12-31 2027-12-31
4.1.x 2026-06-30 2027-07-31 2028-07-31
`);
const O72_MIGRATOR27 = out(`
# pom: parent 2.5.15 → 2.7.18, thêm spring-boot-properties-migrator (runtime) — chạy test:
[WARNING] /src/src/main/java/com/thuvien/api/CauHinhBaoMat.java:[13,36] org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter in org.springframework.security.config.annotation.web.configuration has been deprecated
...
The use of configuration keys that are no longer supported was found in the environment:

Property source 'Config resource 'class path resource [application.properties]' via location 'optional:classpath:/'':
	Key: spring.datasource.initialization-mode
		Line: 3
		Reason: Replacement key 'spring.sql.init.mode' uses an incompatible target type

Please refer to the release notes or reference guide for potential alternatives.
...
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);
const O72_HTTP27 = out(`
$ diff tools/http-truoc.txt http-27.txt        # Boot 2.5.15 ↔ 2.7.18, cùng JDK 8
14c14
< {"timestamp":"<T>","status":401,"error":"Unauthorized","path":"/api/sach"}
---
>
26c26
< {"timestamp":"<T>","status":401,"error":"Unauthorized","path":"/khong-co"}
---
>
`);
const C72_BAOMAT_MOI = java(`
/** Bài 7.2: bỏ WebSecurityConfigurerAdapter (deprecated 5.7, gỡ ở 6.0) — khai báo bean, DSL lambda, requestMatchers. */
@Configuration
@EnableWebSecurity
public class CauHinhBaoMat {

    @Bean
    SecurityFilterChain chuoiLoc(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(yeuCau -> yeuCau
                .requestMatchers(HttpMethod.GET, "/api/sach/**", "/api/quy-dinh").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .httpBasic(basic -> { });
        return http.build();
    }

    @Bean
    UserDetailsService nguoiDung() {
        return new InMemoryUserDetailsManager(
            User.withUsername("thuthu").password("{noop}123456").roles("USER").build(),
            User.withUsername("admin").password("{noop}admin123").roles("ADMIN").build());
    }
}
`);
const O72_BOOT30 = out(`
# pom: parent 2.7.18 → 3.0.13 (java.version đã là 17 ở commit trước), bỏ spring-security.version 5.8.16
[ERROR] /src/src/main/java/com/thuvien/api/Sach.java:[3,25] package javax.persistence does not exist
[ERROR] /src/src/main/java/com/thuvien/api/Sach.java:[9,2] cannot find symbol
  ... (8 dòng nữa trong Sach.java)
[ERROR] /src/src/main/java/com/thuvien/api/SachController.java:[6,24] package javax.validation does not exist
[ERROR] /src/src/main/java/com/thuvien/api/SachController.java:[34,23] cannot find symbol
[ERROR] /src/src/main/java/com/thuvien/api/SachMoi.java:[3,36] package javax.validation.constraints does not exist
  ... (3 dòng nữa trong SachMoi.java)
[ERROR] /src/src/main/java/com/thuvien/api/ThuVienProperties.java:[7,1] annotation type not applicable to this kind of declaration
[INFO] BUILD FAILURE
`);
const O72_BOOT30B = out(`
# sau khi đổi javax.persistence/javax.validation → jakarta.*, bỏ @ConstructorBinding:
[ERROR]   SachApiDacTaTest.dauGachCheoCuoi_vanKhop:33 Status expected:<200> but was:<404>
[ERROR] Tests run: 8, Failures: 1, Errors: 0, Skipped: 0
...
The use of configuration keys that are no longer supported was found in the environment:
	Key: server.max-http-header-size
		Line: 8
		Reason: none
	Key: spring.jpa.hibernate.use-new-id-generator-mappings
		Line: 6
		Reason: Hibernate no longer supports disabling the use of new ID generator mappings.
`);
const C72_GACH = java(`
/** Spring 6 bỏ khớp dấu "/" cuối. App di động 1.x gọi "/api/sach/" ⇒ giữ CẢ HAI đường, có chủ đích (ghi chú nâng cấp, TV-120). */
@GetMapping({"/api/sach", "/api/sach/"})
public List<Sach> danhSach() {
    return kho.findAll();
}
`);
const O72_LOG = out(`
$ git log --oneline master..nang-cap
445eade chore(7.2): go spring-boot-properties-migrator (xong nang cap, khong de lai production)
89fdc56 build(7.2): Spring Boot 3.0.13 -> 3.5.16 — 0 loi, 0 deprecation, 8 test xanh, HTTP giong het
6e8c3ea build(7.2): Spring Boot 2.7.18 -> 3.0.13 — javax.* -> jakarta.*, bo @ConstructorBinding, 2 property
8a048aa build(7.2): java.version 17 (van Boot 2.7.18) — 8 test xanh, HTTP giong het
675c858 refactor(7.2): Spring Security 5.8.16 + SecurityFilterChain/DSL lambda thay WebSecurityConfigurerAdapter
6237b39 build(7.2): Spring Boot 2.5.15 -> 2.7.18 (+ properties-migrator tam thoi)
351a664 test(7.2): chup tools/http-truoc.txt tren Boot 2.5.15 / JDK 8
1a48262 test(7.2): golden master qua HTTP — tools/goi-api.sh (9 request, chay jar that)
`);
const O72_BOOT4 = out(`
# thử thêm (nhánh thu-boot4): parent 3.5.16 → 4.1.3
[ERROR] /src/src/test/java/com/thuvien/api/SachApiDacTaTest.java:[10,63] package org.springframework.boot.test.autoconfigure.web.servlet does not exist
[INFO] BUILD FAILURE
# đổi import sang org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc + thêm spring-boot-starter-webmvc-test:
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
$ diff http-35.txt http-41.txt
2c2
< {"id":1,"ten":"Lập trình Java","tacGia":"Nguyễn Văn A","conLai":3}
---
> {"ten":"Lập trình Java","tacGia":"Nguyễn Văn A","conLai":3,"id":1}
`);

const L72 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Upgrading safely' : 'Chương 7 · Nâng cấp phiên bản an toàn'}</span>
<h2>${en ? '7.2 — Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator' : '7.2 — Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator'}</h2>
<p class="lead">${en
  ? 'Crossing a river on stepping stones: you do not jump from the bank to the far side, you put your weight on each stone and only move when it holds. Spring Boot 2 → 3 is a river with three known stones in the middle — 2.7, Spring Security 5.8, Java 17 — and the official migration guide says to step on all of them. We do it on a small but realistic API and record at every stone what the tests saw and what only HTTP saw.'
  : 'Qua suối trên những hòn đá kê: không ai nhảy từ bờ này sang bờ kia, ta dồn sức lên từng hòn và chỉ bước tiếp khi nó đứng vững. Spring Boot 2 → 3 là con suối có ba hòn đá đã biết ở giữa — 2.7, Spring Security 5.8, Java 17 — và hướng dẫn di trú chính thức bảo hãy bước lên đủ cả ba. Ta làm trên một API nhỏ nhưng giống thật, và ở mỗi hòn đá ghi lại test thấy gì và chỉ HTTP mới thấy gì.'}</p>
${moiTruong(en)}

<h3>${en ? 'The lab repo: legacy-spring-api (Spring Boot 2.5, Java 8, 2021)' : 'Repo lab: legacy-spring-api (Spring Boot 2.5, Java 8, năm 2021)'}</h3>
<p>${en
  ? 'The library’s mobile app talks to a small REST API that another team wrote in 2021: books (JPA on H2), a <code>@ConfigurationProperties</code> class, Bean Validation, HTTP Basic security. It is deliberately written the way 2021 tutorials did it. Download <a href="' + ZIP_SPRING + '">legacy-spring-api-v1.zip</a> (or rebuild it from <code>lab/legacy-spring-api</code> with <code>lab/_tao-git-spring.sh</code> — the single commit gets the same hash, <code>644975a</code>).'
  : 'App di động của thư viện nói chuyện với một REST API nhỏ do đội khác viết năm 2021: sách (JPA trên H2), một lớp <code>@ConfigurationProperties</code>, Bean Validation, bảo mật HTTP Basic. Nó cố ý viết đúng kiểu hướng dẫn năm 2021. Tải <a href="' + ZIP_SPRING + '">legacy-spring-api-v1.zip</a> (hoặc dựng lại từ <code>lab/legacy-spring-api</code> bằng <code>lab/_tao-git-spring.sh</code> — commit duy nhất có đúng mã băm <code>644975a</code>).'}</p>
${C72_BAOMAT_CU}
${C72_PROPS_CU}
<p>${en
  ? 'Why bother in 2026? Look at the official support table — the API answers JSON, so this is the real data on the day this lesson was written:'
  : 'Năm 2026 rồi, sao còn phải lo? Nhìn bảng hỗ trợ chính thức — API trả JSON, nên đây là số liệu thật đúng ngày soạn bài:'}</p>
${O72_SUPPORT}
<p>${en
  ? 'Free (OSS) support for 2.5 ended in 2022, for 2.7 in 2023, and even 3.5 in June 2026; commercial support can run much longer, but outsourcing customers rarely pay for it. Boot 4 exists (November 2025). The path in this lesson is 2.5 → 3.5, the same stones apply on the way to 4, and the end of the lesson shows what 4 changed for this app.'
  : 'Hỗ trợ miễn phí (OSS) của 2.5 hết từ 2022, của 2.7 hết 2023, đến 3.5 cũng hết tháng 6/2026; hỗ trợ thương mại kéo dài hơn nhiều, nhưng khách outsourcing hiếm khi trả tiền cho nó. Boot 4 đã có (tháng 11/2025). Đường đi trong bài là 2.5 → 3.5, các hòn đá vẫn y như vậy khi đi tiếp lên 4, và cuối bài cho thấy 4 đã đổi gì với ứng dụng này.'}</p>

<h3>${en ? 'Stone 0: lock the behaviour — twice' : 'Hòn đá 0: khoá hành vi — hai lần'}</h3>
${C72_TEST}
<p>${en
  ? 'Eight MockMvc tests in the style of Chapter 3, including the “accidental” behaviour that a trailing slash also works. MockMvc is fast but it never goes through the servlet container’s error page. So we add the HTTP golden master of lesson 3.4 for APIs: run the real jar, send nine requests with curl, save status + body:'
  : 'Tám test MockMvc theo kiểu Chương 3, gồm cả hành vi "tình cờ" là thêm dấu gạch chéo cuối vẫn chạy. MockMvc nhanh nhưng không bao giờ đi qua trang lỗi của servlet container. Nên ta thêm golden master qua HTTP của bài 3.4 cho API: chạy jar thật, gửi chín request bằng curl, lưu mã trạng thái + thân:'}</p>
${C72_GOI}
${O72_TRUOC}

<h3>${en ? 'Stone 1: 2.5 → 2.7 with the properties migrator' : 'Hòn đá 1: 2.5 → 2.7 cùng properties migrator'}</h3>
<p>${en
  ? '<code>spring-boot-properties-migrator</code> is a runtime dependency you add <em>only during the upgrade</em>: at startup it reads every property source and reports keys that were renamed or removed.'
  : '<code>spring-boot-properties-migrator</code> là một phụ thuộc runtime bạn thêm <em>chỉ trong lúc nâng</em>: khi khởi động nó đọc mọi nguồn cấu hình và báo những khoá đã đổi tên hay bị gỡ.'}</p>
${O72_MIGRATOR27}
<p>${en
  ? 'Tests green, yet the report contains a time bomb. <code>spring.datasource.initialization-mode</code> no longer exists in 2.7, so it is simply ignored. On H2 nothing changes because Boot initialises embedded databases by default. On the customer’s MySQL, <code>data.sql</code> would silently stop loading. We replace it with <code>spring.sql.init.mode=always</code>. Then the HTTP golden master:'
  : 'Test xanh, nhưng báo cáo chứa một quả bom hẹn giờ. <code>spring.datasource.initialization-mode</code> không còn ở 2.7, nên bị lờ đi. Trên H2 không có gì đổi vì Boot mặc định tự khởi tạo CSDL nhúng. Trên MySQL của khách, <code>data.sql</code> sẽ lặng lẽ thôi không được nạp. Ta thay bằng <code>spring.sql.init.mode=always</code>. Rồi tới golden master qua HTTP:'}</p>
${O72_HTTP27}
<p>${en
  ? 'The status codes are identical — that is all MockMvc checks — but a 401 now has an <em>empty body</em>. Since Boot 2.6, the <code>/error</code> page itself goes through Spring Security, and an unauthenticated caller is not allowed to see it. Is that a bug? It is a decision: if the mobile app parses the JSON of a 401 to show “please log in”, it breaks. We asked the mobile team (in a real project: in the ticket); they only read the status code, so we accept the change and write it in the upgrade notes. Without the HTTP golden master nobody would have known there was a question to ask.'
  : 'Mã trạng thái giống hệt — đó là tất cả những gì MockMvc kiểm — nhưng 401 giờ có <em>thân rỗng</em>. Từ Boot 2.6, chính trang <code>/error</code> cũng đi qua Spring Security, và người chưa đăng nhập không được xem nó. Đó là lỗi à? Đó là một quyết định: nếu app di động đọc JSON của 401 để hiện "mời đăng nhập", nó sẽ vỡ. Ta hỏi đội mobile (dự án thật: hỏi trong ticket); họ chỉ đọc mã trạng thái, nên ta chấp nhận thay đổi và ghi vào ghi chú nâng cấp. Không có golden master qua HTTP thì chẳng ai biết có câu để hỏi.'}</p>

<h3>${en ? 'Stone 2: Spring Security 5.8 — the bridge release' : 'Hòn đá 2: Spring Security 5.8 — bản làm cầu'}</h3>
<p>${en
  ? 'The compiler already warned: <code>WebSecurityConfigurerAdapter</code> is deprecated (5.7) and is <strong>removed</strong> in 6.0, together with <code>antMatchers</code> and <code>authorizeRequests</code>’ old behaviour. Spring Security 5.8 was released precisely so you can write the 6.0 style while still on Boot 2.7: set <code>&lt;spring-security.version&gt;5.8.16&lt;/spring-security.version&gt;</code> and rewrite the configuration as beans:'
  : 'Trình biên dịch đã cảnh báo: <code>WebSecurityConfigurerAdapter</code> bị đánh dấu bỏ (5.7) và bị <strong>gỡ</strong> ở 6.0, cùng với <code>antMatchers</code> và hành vi cũ của <code>authorizeRequests</code>. Spring Security 5.8 ra đời chính là để bạn viết kiểu 6.0 khi còn ở Boot 2.7: đặt <code>&lt;spring-security.version&gt;5.8.16&lt;/spring-security.version&gt;</code> rồi viết lại cấu hình thành bean:'}</p>
${C72_BAOMAT_MOI}
<p>${en
  ? 'Eight tests green, HTTP output identical to stone 1, zero deprecation warnings. The idea of each change (filter chain as a bean, lambda DSL, <code>requestMatchers</code>, <code>UserDetailsService</code> bean) is explained in the Spring Boot course, lesson 9.1 — here what matters is <em>when</em>: on the old framework, in its own commit, with the safety net on.'
  : 'Tám test xanh, output HTTP giống hệt hòn đá 1, không còn cảnh báo deprecation nào. Ý tưởng của từng thay đổi (chuỗi lọc là bean, DSL lambda, <code>requestMatchers</code>, bean <code>UserDetailsService</code>) được giảng ở khoá Spring Boot bài 9.1 — ở đây quan trọng là <em>lúc nào</em>: trên framework cũ, trong commit riêng, khi lưới an toàn đang bật.'}</p>

<h3>${en ? 'Stone 3: Java 17 on Boot 2.7' : 'Hòn đá 3: Java 17 trên Boot 2.7'}</h3>
<p>${en
  ? 'Boot 3 requires Java 17, and Boot 2.7 supports 17. So the runtime moves first, on a framework we know works: <code>&lt;java.version&gt;17&lt;/java.version&gt;</code>, build and run with JDK 17 — 8 tests green, HTTP identical. (Everything from lesson 7.1 applies; this app had no JDK-internal surprises.)'
  : 'Boot 3 đòi Java 17, còn Boot 2.7 đã hỗ trợ 17. Nên runtime đi trước, trên framework mà ta biết là chạy: <code>&lt;java.version&gt;17&lt;/java.version&gt;</code>, build và chạy bằng JDK 17 — 8 test xanh, HTTP giống hệt. (Mọi điều ở bài 7.1 đều áp dụng; ứng dụng này không có bất ngờ nào về API nội bộ của JDK.)'}</p>

<h3>${en ? 'Stone 4: Boot 3.0 — javax becomes jakarta' : 'Hòn đá 4: Boot 3.0 — javax thành jakarta'}</h3>
${O72_BOOT30}
<p>${en
  ? 'Seventeen compiler errors, three causes. <strong>javax → jakarta:</strong> when Oracle handed Java EE to the Eclipse Foundation (2017), the trademark “javax” stayed with Oracle, so Jakarta EE 9 (2020) renamed every package <code>javax.*</code> of the EE specifications to <code>jakarta.*</code>. Only EE packages move — <code>javax.sql</code>, <code>javax.crypto</code> are part of the JDK and stay. <strong>@ConstructorBinding:</strong> Boot 3 binds through the constructor automatically when a properties class has a single constructor; the annotation moved and now only applies to constructors, hence “not applicable to this kind of declaration”. Delete it. After the rename, the characterization tests speak:'
  : 'Mười bảy dòng lỗi biên dịch, ba nguyên nhân. <strong>javax → jakarta:</strong> khi Oracle chuyển Java EE cho Eclipse Foundation (2017), nhãn hiệu "javax" vẫn thuộc Oracle, nên Jakarta EE 9 (2020) đổi tên mọi gói <code>javax.*</code> của các đặc tả EE thành <code>jakarta.*</code>. Chỉ gói EE mới đổi — <code>javax.sql</code>, <code>javax.crypto</code> thuộc JDK nên giữ nguyên. <strong>@ConstructorBinding:</strong> Boot 3 tự gán qua hàm dựng khi lớp cấu hình chỉ có một hàm dựng; chú thích này đã chuyển gói và giờ chỉ đặt được trên hàm dựng, nên mới có "not applicable to this kind of declaration". Xoá nó. Sau khi đổi tên, characterization test lên tiếng:'}</p>
${O72_BOOT30B}
<p>${en
  ? 'Spring Framework 6 no longer matches <code>/api/sach/</code> to <code>/api/sach</code> — a deliberate change, because two URLs for one resource confuse caches and security rules. The test we wrote “just to record what happens” is now the reason we do not break the mobile app. Options: re-enable the old matching (deprecated in 6, removed in 7 — no), update the test and tell the mobile team (needs a client release), or map both paths explicitly for this one endpoint and open a ticket to remove the slash from the app. We chose the third:'
  : 'Spring Framework 6 không còn khớp <code>/api/sach/</code> với <code>/api/sach</code> — thay đổi có chủ đích, vì hai URL cho một tài nguyên làm rối bộ nhớ đệm và luật bảo mật. Bài test ta viết "chỉ để ghi lại chuyện đang xảy ra" giờ là lý do ta không làm vỡ app di động. Các lựa chọn: bật lại kiểu khớp cũ (bị đánh dấu bỏ ở 6, gỡ ở 7 — không), sửa test và báo đội mobile (cần phát hành lại app), hoặc gắn tường minh cả hai đường cho riêng endpoint này và mở ticket bỏ dấu gạch trong app. Ta chọn cách ba:'}</p>
${C72_GACH}
<p>${en
  ? 'The migrator’s second report is mechanical: delete <code>use-new-id-generator-mappings</code> (Hibernate 6 has no old mode — check your ID sequences if you relied on it), rename <code>server.max-http-header-size</code> to <code>server.max-http-request-header-size</code>. Green: 8 tests, HTTP identical to stone 3.'
  : 'Báo cáo thứ hai của migrator là việc máy móc: xoá <code>use-new-id-generator-mappings</code> (Hibernate 6 không còn chế độ cũ — kiểm lại chuỗi sinh ID nếu bạn từng dựa vào nó), đổi <code>server.max-http-header-size</code> thành <code>server.max-http-request-header-size</code>. Xanh: 8 test, HTTP giống hệt hòn đá 3.'}</p>

<h3>${en ? 'Stone 5: 3.0 → 3.5, and remove the migrator' : 'Hòn đá 5: 3.0 → 3.5, rồi gỡ migrator'}</h3>
<p>${en
  ? 'Inside a major version the jumps are small: 3.0.13 → 3.5.16 gave 0 errors, 0 deprecations, 8 green tests and identical HTTP. The last commit removes <code>spring-boot-properties-migrator</code> — it costs startup time and has no business in production.'
  : 'Trong cùng một bản chính, bước nhảy nhỏ: 3.0.13 → 3.5.16 cho 0 lỗi, 0 deprecation, 8 test xanh và HTTP giống hệt. Commit cuối gỡ <code>spring-boot-properties-migrator</code> — nó làm chậm khởi động và không có lý do gì ở production.'}</p>
${O72_LOG}

<h3>${en ? 'The next river: Boot 4 (what changed for this app)' : 'Con suối kế tiếp: Boot 4 (đổi gì với ứng dụng này)'}</h3>
${O72_BOOT4}
<p>${en
  ? 'Two findings in ten minutes. Boot 4 split its auto-configuration into many small modules, so test slices moved to new packages and need their own starter. And Jackson 3 orders JSON properties differently by default (here the constructor’s properties come first). For any client that parses JSON it changes nothing; for a client that compares strings, or a snapshot test, it breaks. Same method, same stones: 3.5 with no deprecation warnings first, then 4.0, then 4.x.'
  : 'Hai phát hiện trong mười phút. Boot 4 tách cấu hình tự động thành nhiều module nhỏ, nên các test slice chuyển sang gói mới và cần starter riêng. Và Jackson 3 mặc định xếp thứ tự thuộc tính JSON khác (ở đây thuộc tính có trong hàm dựng lên trước). Với client đọc JSON đúng cách thì không đổi gì; với client so chuỗi, hay một snapshot test, thì vỡ. Cùng phương pháp, cùng các hòn đá: 3.5 sạch cảnh báo deprecation trước, rồi 4.0, rồi 4.x.'}</p>

<h3>🕵️ ${en ? 'Security angle: why “security config” is the riskiest file in the upgrade' : 'Góc bảo mật: vì sao "cấu hình bảo mật" là tệp rủi ro nhất khi nâng'}</h3>
<p>${en
  ? 'When the security DSL changes, a wrong translation does not fail to compile — it opens or closes doors silently. A rule order mistake in <code>requestMatchers</code>, or a lost <code>hasRole</code>, gives you green unit tests that never tried the forbidden path. That is why our safety net has <em>negative</em> tests (401 without login, 403 for a librarian deleting) and the HTTP golden master asks the same questions of the real server. Lesson 7.3 shows a tool that rewrote this exact file and lost both users.'
  : 'Khi DSL bảo mật đổi, dịch sai không làm lỗi biên dịch — nó lặng lẽ mở hoặc khoá cửa. Sai thứ tự luật trong <code>requestMatchers</code>, hay mất một <code>hasRole</code>, vẫn cho unit test xanh nếu chưa test nào thử đường bị cấm. Vì vậy lưới an toàn của ta có test <em>phủ định</em> (401 khi chưa đăng nhập, 403 khi thủ thư xoá) và golden master qua HTTP hỏi đúng những câu đó với máy chủ thật. Bài 7.3 cho thấy một công cụ đã viết lại đúng tệp này và làm mất cả hai người dùng.'}</p>

<h3>🏠 ${en ? 'Everyday analogy' : 'Liên hệ đời thường'}</h3>
<p>${en
  ? 'javax → jakarta is a city renaming its streets: the houses did not move, but every letter, map and GPS must be updated, and the post office (your container) only delivers to the new names. Tomcat 10’s <code>webapps-javaee</code> folder (lesson 7.5) is the post office that still accepts the old names for a while.'
  : 'javax → jakarta giống thành phố đổi tên đường: nhà không dời đi đâu, nhưng mọi lá thư, bản đồ, GPS đều phải sửa, và bưu điện (container của bạn) chỉ giao tới tên mới. Thư mục <code>webapps-javaee</code> của Tomcat 10 (bài 7.5) là bưu điện vẫn nhận tên cũ thêm một thời gian.'}</p>

<h3>💼 ${en ? 'OJT situation: the PR description of stone 4' : 'Tình huống OJT: mô tả PR của hòn đá 4'}</h3>
${out(`
[TV-118] Nâng thuvien-api Spring Boot 2.7.18 → 3.0.13 (mốc 4/5)
Thay đổi: javax.persistence/validation → jakarta.*; bỏ @ConstructorBinding; 2 property (migrator báo).
Đổi hành vi CÓ CHỦ ĐÍCH: không có.
Giữ hành vi cũ có chủ đích: GET /api/sach/ (dấu "/" cuối) vẫn 200 — app di động 1.x đang gọi; ticket TV-120 để bỏ.
Đã biết từ mốc 1: 401 không còn thân JSON (đội mobile xác nhận chỉ đọc mã trạng thái).
Kiểm: 8 test đặc tả xanh; golden master HTTP 9 request giống mốc 3 (tools/goi-api.sh).
Rủi ro: Hibernate 6 sinh SQL khác — chưa có test hiệu năng; theo dõi log truy vấn chậm sau khi lên staging.
`)}

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“How would you upgrade a Boot 2.3 app to 3.x?”' : '"Em nâng app Boot 2.3 lên 3.x thế nào?"'}</strong><br>${en
  ? 'Lock behaviour first (tests + HTTP golden master). Then 2.7 with the properties migrator, fix every deprecation, Spring Security 5.8 style, Java 17, then 3.0, then the latest 3.x. One commit per stone, green each time; remove the migrator at the end.'
  : 'Khoá hành vi trước (test + golden master qua HTTP). Rồi lên 2.7 cùng properties migrator, sửa hết deprecation, viết theo kiểu Spring Security 5.8, lên Java 17, rồi 3.0, rồi bản 3.x mới nhất. Mỗi hòn đá một commit, lần nào cũng xanh; cuối cùng gỡ migrator.'}</li>
<li><strong>${en ? '“Why did javax become jakarta?”' : '"Vì sao javax thành jakarta?"'}</strong><br>${en
  ? 'Java EE moved to the Eclipse Foundation, which could not use Oracle’s javax trademark for new versions; Jakarta EE 9 renamed the EE packages. JDK packages like javax.sql did not change.'
  : 'Java EE chuyển sang Eclipse Foundation, nơi không được dùng nhãn hiệu javax của Oracle cho bản mới; Jakarta EE 9 đổi tên các gói EE. Gói của JDK như javax.sql không đổi.'}</li>
<li><strong>${en ? '“All tests pass after the upgrade. What else can break?”' : '"Test qua hết sau khi nâng. Còn gì có thể vỡ?"'}</strong><br>${en
  ? 'Things tests do not see: ignored properties (data.sql silently not loaded), error bodies through the container (401 empty since 2.6), URL matching (trailing slash), JSON property order, SQL generated by a new Hibernate. HTTP-level checks and staging logs catch those.'
  : 'Những thứ test không thấy: property bị lờ (data.sql lặng lẽ không nạp), thân lỗi đi qua container (401 rỗng từ 2.6), cách khớp URL (dấu gạch cuối), thứ tự thuộc tính JSON, SQL do Hibernate mới sinh. Kiểm ở mức HTTP và log staging bắt được chúng.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'Clone <code>legacy-spring-api</code>, run <code>tools/goi-api.sh</code> from the first commit of <code>lab/loi-giai/ch7/spring/nang-cap/</code>, and walk the five stones yourself. Extra: add a ninth test that would have caught the empty 401 body, and decide what it should assert after the upgrade.'
  : 'Clone <code>legacy-spring-api</code>, chạy <code>tools/goi-api.sh</code> lấy từ commit đầu trong <code>lab/loi-giai/ch7/spring/nang-cap/</code>, rồi tự bước qua năm hòn đá. Thêm: viết test thứ chín lẽ ra đã bắt được thân 401 rỗng, và quyết định sau khi nâng nó nên khẳng định điều gì.'}</p>
${giai(en ? '🔑 Hint for the ninth test' : '🔑 Gợi ý test thứ chín', `<p>${en
  ? 'MockMvc cannot see it (no error dispatch). Use <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code> + <code>TestRestTemplate</code>, POST without credentials and assert the status <em>and</em> the body. After the upgrade, assert status 401 and that clients do not need the body — and record the decision in the test name, e.g. <code>chuaDangNhap_401_thanRong_tuBoot26</code>.'
  : 'MockMvc không thấy được (không có error dispatch). Dùng <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code> + <code>TestRestTemplate</code>, POST không kèm tài khoản rồi khẳng định mã trạng thái <em>và</em> thân. Sau khi nâng, khẳng định 401 và client không cần thân — ghi luôn quyết định vào tên test, ví dụ <code>chuaDangNhap_401_thanRong_tuBoot26</code>.'}</p>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Jakarta EE', 'Jakarta EE', 'Tên mới của Java EE dưới Eclipse Foundation; từ bản 9, gói javax.* của EE thành jakarta.*.', 'Java EE under the Eclipse Foundation; from version 9 the EE javax.* packages became jakarta.*.'],
  ['Properties migrator', 'bộ báo cấu hình cũ', 'Phụ thuộc tạm, báo khoá đổi tên/bị gỡ lúc khởi động.', 'A temporary dependency that reports renamed/removed keys at startup.'],
  ['SecurityFilterChain', 'chuỗi bộ lọc bảo mật', 'Cách cấu hình Spring Security bằng bean, thay WebSecurityConfigurerAdapter.', 'Bean-based Spring Security configuration replacing WebSecurityConfigurerAdapter.'],
  ['Bridge release', 'bản làm cầu', 'Bản cũ có sẵn API của bản mới (Boot 2.7, Security 5.8) để sửa trước khi nhảy.', 'An old version that already offers the new API (Boot 2.7, Security 5.8).'],
  ['Trailing slash matching', 'khớp dấu gạch cuối', 'Spring 5 coi /a/ như /a; Spring 6 thì không.', 'Spring 5 treated /a/ as /a; Spring 6 does not.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Stones: 2.7 + migrator → Security 5.8 style → Java 17 → 3.0 → latest 3.x → remove migrator.' : 'Các hòn đá: 2.7 + migrator → kiểu Security 5.8 → Java 17 → 3.0 → 3.x mới nhất → gỡ migrator.'}</li>
<li>${en ? 'Unit tests see status codes; an HTTP golden master sees bodies, error pages and URLs.' : 'Unit test thấy mã trạng thái; golden master qua HTTP thấy thân, trang lỗi và URL.'}</li>
<li>${en ? 'Every behaviour change is a decision written down: accept, keep on purpose, or ask the client.' : 'Mỗi thay đổi hành vi là một quyết định được ghi lại: chấp nhận, giữ có chủ đích, hay hỏi bên dùng.'}</li>
</ul>
${tl('https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide', '🍃', 'Spring Boot 3.0 Migration Guide', en ? 'The official list of stones' : 'Danh sách hòn đá chính thức')}
${tl('https://docs.spring.io/spring-security/reference/5.8/migration/index.html', '🔐', 'Spring Security 5.8 — Preparing for 6.0', en ? 'Each deprecation and its replacement' : 'Từng deprecation và cách thay')}
${tl('https://spring.io/projects/spring-boot#support', '📅', 'Spring Boot — support policy', en ? 'OSS and commercial end dates' : 'Ngày hết hỗ trợ OSS và thương mại')}
${lk(bai('spring-boot', 'sb-9-1-security-filter-chain'), '🔐', en ? 'Spring Boot 9.1 — SecurityFilterChain' : 'Spring Boot 9.1 — SecurityFilterChain', en ? 'How the filter chain works' : 'Chuỗi bộ lọc hoạt động thế nào')}
`);

/* ═══════════════════ 7.3 — OpenRewrite ═══════════════════ */
const C73_LENH = bash(`
# Chạy recipe KHÔNG cần sửa pom (plugin + recipe lấy từ Maven Central). Nhánh riêng: git checkout -b rewrite master
mvn -B org.openrewrite.maven:rewrite-maven-plugin:6.46.1:run \\
  -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-spring:6.37.1 \\
  -Drewrite.activeRecipes=org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_5 \\
  -Drewrite.exportDatatables=true
# xem trước, không sửa tệp: thay :run bằng :dryRun  ⇒ target/rewrite/rewrite.patch
`);
const O73_CAY = out(`
[INFO] Total time:  01:30 min
[WARNING] Changes have been made to src/main/java/com/thuvien/api/CauHinhBaoMat.java by:
[WARNING]     org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_4
[WARNING]         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_3
[WARNING]             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_2
[WARNING]                 org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_1
[WARNING]                     org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_0
[WARNING]                         org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_7
[WARNING]                             org.openrewrite.java.spring.security5.UpgradeSpringSecurity_5_7
[WARNING]                                 org.openrewrite.java.spring.security5.WebSecurityConfigurerAdapter
[WARNING]                         org.openrewrite.java.migrate.UpgradeToJava17
[WARNING]                         org.openrewrite.java.spring.security6.UpgradeSpringSecurity_6_0
...
[WARNING] Estimate time saved: 2h
$ git status --short
 M pom.xml
 M src/main/java/com/thuvien/api/CauHinhBaoMat.java
 M src/main/java/com/thuvien/api/Sach.java
 M src/main/java/com/thuvien/api/SachController.java
 M src/main/java/com/thuvien/api/SachMoi.java
 M src/main/java/com/thuvien/api/ThuVienProperties.java
 M src/main/resources/application.properties
`);
const O73_DIFF = out(`
$ git diff src/main/java/com/thuvien/api/CauHinhBaoMat.java
-public class CauHinhBaoMat extends WebSecurityConfigurerAdapter {
+public class CauHinhBaoMat {
-    @Override
-    protected void configure(HttpSecurity http) throws Exception {
-        http.csrf().disable()
-            .authorizeRequests()
-                .antMatchers(HttpMethod.GET, "/api/sach/**", "/api/quy-dinh").permitAll()
-                .antMatchers("/api/admin/**").hasRole("ADMIN")
-                .anyRequest().authenticated()
-            .and()
-            .httpBasic();
+    @Bean
+    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
+        http.csrf(csrf -> csrf.disable())
+            .authorizeHttpRequests(requests -> requests
+                .requestMatchers(HttpMethod.GET, "/api/sach/**", "/api/quy-dinh").permitAll()
+                .requestMatchers("/api/admin/**").hasRole("ADMIN")
+                .anyRequest().authenticated())
+            .httpBasic(withDefaults());
+        return http.build();
     }
-    @Override
-    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
-        auth.inMemoryAuthentication()
-            .withUser("thuthu").password("{noop}123456").roles("USER")
-            .and()
-            .withUser("admin").password("{noop}admin123").roles("ADMIN");
+    @Bean
+    InMemoryUserDetailsManager inMemoryAuthManager() throws Exception {
+        return new InMemoryUserDetailsManager(User.builder().username("admin").build());
     }
`);
const O73_DIFF2 = out(`
$ git diff pom.xml src/main/resources/application.properties src/main/java/com/thuvien/api/ThuVienProperties.java
-    <version>2.5.15</version>
+    <version>3.5.16</version>
-    <java.version>1.8</java.version>
+    <java.version>17</java.version>
+    <dependency>
+      <groupId>jakarta.validation</groupId>
+      <artifactId>jakarta.validation-api</artifactId>
+    </dependency>
-spring.datasource.initialization-mode=always
+spring.sql.init.mode=always
-spring.jpa.hibernate.use-new-id-generator-mappings=false
+# This property is deprecated: Hibernate no longer supports disabling the use of new ID generator mappings.
+# spring.jpa.hibernate.use-new-id-generator-mappings=false
-server.max-http-header-size=16KB
+server.max-http-request-header-size=16KB
-import org.springframework.boot.context.properties.ConstructorBinding;
-@ConstructorBinding
+
`);
const O73_DO = out(`
$ mvn -B clean package
Caused by: java.lang.IllegalArgumentException: Cannot pass null or empty values to constructor
Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [org.springframework.security.provisioning.InMemoryUserDetailsManager]: Factory method 'inMemoryAuthManager' threw exception with message: Cannot pass null or empty values to constructor
[ERROR]   SachApiDacTaTest.danhSach_khongCanDangNhap » IllegalState Failed to load ApplicationContext for [WebMergedContextConfiguration@457d3f54 testClass = com.thuvien.api.SachApiDacTaTest, ...
[ERROR]   SachApiDacTaTest.dauGachCheoCuoi_vanKhop » IllegalState ApplicationContext failure threshold (1) exceeded: skipping repeated attempt to load context ...
  ... (6 dòng tương tự)
[ERROR] Tests run: 8, Failures: 0, Errors: 8, Skipped: 0
[INFO] BUILD FAILURE
`);
const O73_SAU = out(`
# sửa 4 chỗ bằng tay: 2 người dùng, giữ /api/sach/ (TV-120), bỏ jakarta.validation-api thừa, bỏ dòng chú thích + dòng trống thừa
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ diff http-35-tay.txt http-rewrite.txt && echo "HTTP GIONG BAN TAY"
HTTP GIONG BAN TAY
$ git diff --stat nang-cap rewrite -- src pom.xml          # bản tay (7.2) ↔ bản máy + sửa
 src/main/java/com/thuvien/api/CauHinhBaoMat.java | 13 +++++++------
 1 file changed, 7 insertions(+), 6 deletions(-)       # chỉ khác tên biến/bean và withDefaults()
`);
const O73_JSP_RUN = out(`
# legacy-thu-vien (nhánh ch6, Java 8) — recipe UpgradeToJava17 + JakartaEE10 (rewrite-migrate-java 3.42.1), goal :run trên JDK 17
[ERROR] COMPILATION ERROR :
[ERROR] /src/src/main/java/com/thuvien/util/TokenUtil.java:[4,22] package javax.xml.bind does not exist
[INFO] BUILD FAILURE
# goal :runNoFork — không chạy vòng đời build, chỉ phân tích mã nguồn:
[WARNING] Estimate time saved: 2h 26m
[INFO] Total time:  12.946 s
[INFO] BUILD SUCCESS
 14 files changed, 58 insertions(+), 58 deletions(-)
`);
const O73_JSP_DIFF = out(`
$ git diff pom.xml src/main/java/com/thuvien/util/TokenUtil.java src/main/webapp/WEB-INF/web.xml
-    <maven.compiler.source>1.8</maven.compiler.source>
+    <maven.compiler.source>17</maven.compiler.source>
-      <groupId>javax.servlet</groupId>
-      <artifactId>javax.servlet-api</artifactId>
-      <version>3.1.0</version>
-      <scope>provided</scope>
+      <groupId>jakarta.servlet</groupId>
+      <artifactId>jakarta.servlet-api</artifactId>
+      <version>6.0.0</version>
+      <scope>compile</scope>
-        <version>3.1</version>          (maven-compiler-plugin)
+        <version>3.16.0</version>
-        <version>2.2</version>          (maven-war-plugin)
+        <version>3.5.1</version>
-import javax.xml.bind.DatatypeConverter;
+import jakarta.xml.bind.DatatypeConverter;
-<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" ... version="3.1">
+<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" ... version="6.0">
$ git grep -n "java.sun.com/jsp/jstl" -- src/main/webapp
src/main/webapp/report.jsp:2:<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
$ mvn -B clean test
[ERROR] /src/src/main/java/com/thuvien/util/TokenUtil.java:[4,24] package jakarta.xml.bind does not exist
[INFO] BUILD FAILURE
`);

const L73 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Upgrading safely' : 'Chương 7 · Nâng cấp phiên bản an toàn'}</span>
<h2>${en ? '7.3 — Automating migrations with OpenRewrite recipes' : '7.3 — Tự động hoá di trú bằng recipe OpenRewrite'}</h2>
<p class="lead">${en
  ? 'A dishwasher is great at washing 40 plates exactly the same way. It is useless at noticing that one plate is cracked. OpenRewrite is that machine for code: it applies hundreds of mechanical edits perfectly, and it does not know your business. In this lesson it saves hours on two real migrations — and in one of them it quietly deletes a user account. Reading the diff is the job; running the tool is not.'
  : 'Máy rửa bát rửa 40 cái đĩa y hệt nhau rất giỏi. Nó vô dụng trong việc nhận ra một cái đĩa bị nứt. OpenRewrite là cái máy đó cho mã nguồn: nó áp hàng trăm chỉnh sửa máy móc không sai một li, và nó không hiểu nghiệp vụ của bạn. Trong bài này nó tiết kiệm hàng giờ ở hai cuộc di trú thật — và ở một trong hai, nó lặng lẽ xoá một tài khoản người dùng. Việc của bạn là đọc diff, không phải bấm chạy công cụ.'}</p>
${moiTruong(en)}

<h3>${en ? 'What a recipe is' : 'Recipe là gì'}</h3>
<p>${en
  ? 'OpenRewrite (started at Netflix in 2016, now maintained by Moderne, Apache-licensed core) parses your code into a <strong>Lossless Semantic Tree</strong>: a syntax tree that keeps types <em>and</em> your formatting, so it can rename a type everywhere it is really used (not every string that looks like it) and print the file back with your spaces and comments. A <strong>recipe</strong> is one transformation (“change package javax.persistence to jakarta.persistence”, “replace WebSecurityConfigurerAdapter”); a composite recipe such as <code>UpgradeSpringBoot_3_5</code> chains hundreds of them. Compare with the tools of earlier chapters: IntelliJ’s refactorings do one move you choose; <code>sed</code> knows only text; OpenRewrite does many typed moves someone else chose.'
  : 'OpenRewrite (khởi đầu ở Netflix năm 2016, nay do Moderne duy trì, lõi mã nguồn mở Apache) phân tích mã thành một <strong>Lossless Semantic Tree</strong>: cây cú pháp giữ cả kiểu dữ liệu <em>lẫn</em> định dạng của bạn, nên nó đổi tên một kiểu ở đúng mọi nơi thật sự dùng kiểu đó (không phải mọi chuỗi trông giống) và in tệp ra lại với nguyên khoảng trắng, chú thích. Một <strong>recipe</strong> là một phép biến đổi ("đổi gói javax.persistence thành jakarta.persistence", "thay WebSecurityConfigurerAdapter"); recipe tổng hợp như <code>UpgradeSpringBoot_3_5</code> xâu chuỗi hàng trăm recipe con. So với công cụ ở các chương trước: refactor của IntelliJ làm một bước do bạn chọn; <code>sed</code> chỉ biết chữ; OpenRewrite làm nhiều bước có hiểu kiểu do người khác chọn sẵn.'}</p>

<h3>${en ? 'Run 1: Spring Boot 2.5 → 3.5 on the original legacy-spring-api' : 'Lần chạy 1: Spring Boot 2.5 → 3.5 trên legacy-spring-api gốc'}</h3>
<p>${en
  ? 'Same starting commit as lesson 7.2 (<code>644975a</code>), new branch. One gotcha on a locked-down machine: the plugin writes a cache to <code>~/.rewrite</code>; if that directory is not writable the run dies with “Failed to create directory …/.rewrite/classpath”.'
  : 'Cùng commit xuất phát với bài 7.2 (<code>644975a</code>), nhánh mới. Một bẫy trên máy bị khoá quyền: plugin ghi bộ nhớ đệm vào <code>~/.rewrite</code>; thư mục đó không ghi được thì lần chạy chết với "Failed to create directory …/.rewrite/classpath".'}</p>
${C73_LENH}
${O73_CAY}
<p>${en
  ? 'The log explains every edit: the chain of recipes that touched each file. Ninety seconds, seven files, “2h saved”. Now read, file by file.'
  : 'Log giải thích từng chỉnh sửa: chuỗi recipe đã chạm vào mỗi tệp. Chín mươi giây, bảy tệp, "tiết kiệm 2 giờ". Giờ đọc, từng tệp một.'}</p>
${O73_DIFF2}
<p>${en
  ? 'Mostly what we did by hand in 7.2 — plus two pieces of noise: an explicit <code>jakarta.validation-api</code> dependency (already brought in by <code>spring-boot-starter-validation</code>) and a commented-out property with an English note. Neither is wrong; both are things a reviewer will ask about. Then the security file:'
  : 'Phần lớn đúng như ta làm tay ở 7.2 — thêm hai thứ nhiễu: một phụ thuộc <code>jakarta.validation-api</code> khai tường minh (đã có sẵn qua <code>spring-boot-starter-validation</code>) và một property bị comment kèm ghi chú tiếng Anh. Không cái nào sai; cả hai đều là thứ người review sẽ hỏi. Rồi tới tệp bảo mật:'}</p>
${O73_DIFF}
<p>${en
  ? 'The filter chain translation is excellent — arguably cleaner than ours (<code>withDefaults()</code>). The user translation is not: two users with passwords and roles became <code>User.builder().username("admin").build()</code>. The recipe recognised the shape of <code>inMemoryAuthentication()</code> but could not carry the chained <code>withUser…and()</code> calls. Had this compiled into something that started, the librarian account would simply be gone. It did not start:'
  : 'Bản dịch chuỗi bộ lọc rất tốt — có khi gọn hơn bản của ta (<code>withDefaults()</code>). Bản dịch người dùng thì không: hai người dùng có mật khẩu và vai trò thành <code>User.builder().username("admin").build()</code>. Recipe nhận ra hình dáng của <code>inMemoryAuthentication()</code> nhưng không mang theo được chuỗi lời gọi <code>withUser…and()</code>. Giả sử nó biên dịch thành thứ khởi động được, tài khoản thủ thư sẽ đơn giản là biến mất. Nó đã không khởi động:'}</p>
${O73_DO}
<p>${en
  ? 'Our characterization tests caught it in the first second — all eight, because the whole Spring context failed. Notice which test would have caught a <em>subtler</em> version of the bug (say, the users kept but the roles lost): <code>xoa_thuThu_403</code> and <code>xoa_admin_204</code>, the negative and positive authorisation tests. The recipe also knew nothing about our trailing-slash decision (TV-120): <code>dauGachCheoCuoi_vanKhop</code> went red after the context was fixed. After four manual fixes the result is the 7.2 result:'
  : 'Characterization test của ta bắt được ngay giây đầu — cả tám, vì cả Spring context không lên. Để ý test nào sẽ bắt được bản <em>tinh vi hơn</em> của lỗi này (chẳng hạn giữ người dùng nhưng mất vai trò): <code>xoa_thuThu_403</code> và <code>xoa_admin_204</code>, cặp test phân quyền phủ định và khẳng định. Recipe cũng không biết gì về quyết định dấu gạch cuối của ta (TV-120): <code>dauGachCheoCuoi_vanKhop</code> đỏ sau khi context đã sửa. Sau bốn chỗ sửa tay, kết quả là kết quả của 7.2:'}</p>
${O73_SAU}

<h3>${en ? 'Run 2: Java 17 + Jakarta EE 10 on the Servlet/JSP app' : 'Lần chạy 2: Java 17 + Jakarta EE 10 trên ứng dụng Servlet/JSP'}</h3>
${O73_JSP_RUN}
<p>${en
  ? 'The <code>run</code> goal first runs the build up to compiling the tests — and the project does not compile on JDK 17, which is the reason we want the recipe in the first place. <code>runNoFork</code> (and <code>dryRunNoFork</code>) skip the lifecycle and work from sources and the dependency classpath. Alternative: run the plugin on the old JDK. Then the diff:'
  : 'Goal <code>run</code> chạy build tới bước biên dịch test trước — mà dự án không biên dịch được trên JDK 17, chính là lý do ta cần recipe. <code>runNoFork</code> (và <code>dryRunNoFork</code>) bỏ qua vòng đời build, làm việc từ mã nguồn và classpath phụ thuộc. Cách khác: chạy plugin trên JDK cũ. Rồi tới diff:'}</p>
${O73_JSP_DIFF}
<p>${en
  ? 'Three silent problems, each one only visible to someone who knows how a WAR runs in Tomcat:'
  : 'Ba vấn đề im lặng, mỗi cái chỉ người hiểu WAR chạy trong Tomcat thế nào mới thấy:'}</p>
<ul>
<li>${en ? '<strong><code>scope compile</code> for the servlet API.</strong> The container provides it; packaging it into <code>WEB-INF/lib</code> invites class-loading conflicts. Back to <code>provided</code>.' : '<strong><code>scope compile</code> cho servlet API.</strong> Container đã cung cấp nó; đóng gói vào <code>WEB-INF/lib</code> là mời xung đột nạp lớp. Trả về <code>provided</code>.'}</li>
<li>${en ? '<strong><code>jakarta.xml.bind.DatatypeConverter</code> without a dependency.</strong> The rename is correct in isolation; the API is not in the JDK, so it does not compile. Our lesson 7.1 fix (<code>HexFormat</code>) removes the need entirely.' : '<strong><code>jakarta.xml.bind.DatatypeConverter</code> mà không có thư viện.</strong> Đổi tên thì đúng; nhưng API này không nằm trong JDK, nên không biên dịch được. Bản sửa ở bài 7.1 (<code>HexFormat</code>) bỏ hẳn nhu cầu đó.'}</li>
<li>${en ? '<strong>JSTL 1.2 and the JSP taglib URI untouched.</strong> Everything compiles and 49 tests pass — and the report page dies on Tomcat 10. Lesson 7.5 shows the real error and the fix.' : '<strong>JSTL 1.2 và URI taglib trong JSP không được đụng tới.</strong> Mọi thứ biên dịch và 49 test qua — rồi trang báo cáo chết trên Tomcat 10. Bài 7.5 cho thấy lỗi thật và cách sửa.'}</li>
</ul>

<h3>${en ? 'A safe workflow with any code-mod tool' : 'Quy trình an toàn với mọi công cụ sửa mã hàng loạt'}</h3>
<ol>
<li>${en ? 'Safety net first (Chapter 3): unit + characterization + golden master. A recipe without tests is a lottery.' : 'Lưới an toàn trước (Chương 3): unit + characterization + golden master. Recipe mà không có test là xổ số.'}</li>
<li>${en ? 'Own branch; <code>dryRun</code> first; read <code>target/rewrite/rewrite.patch</code> like a PR from a stranger.' : 'Nhánh riêng; chạy <code>dryRun</code> trước; đọc <code>target/rewrite/rewrite.patch</code> như PR của một người lạ.'}</li>
<li>${en ? 'Commit the machine output <em>untouched</em> ("chore: OpenRewrite X"), then your fixes in a separate commit — the reviewer can see exactly what was human.' : 'Commit output của máy <em>nguyên vẹn</em> ("chore: OpenRewrite X"), rồi các chỗ sửa của bạn trong commit riêng — người review thấy rõ phần nào do người.'}</li>
<li>${en ? 'Pay most attention to security config, build scopes, anything the recipe cannot type-check (JSP, XML, properties, SQL strings).' : 'Chú ý nhất tới cấu hình bảo mật, scope build, và những gì recipe không kiểm kiểu được (JSP, XML, properties, chuỗi SQL).'}</li>
<li>${en ? 'Run the app on the real server type, not only the tests.' : 'Chạy ứng dụng trên đúng loại máy chủ thật, không chỉ chạy test.'}</li>
</ol>

<h3>${en ? 'OpenRewrite vs letting an AI assistant do the upgrade' : 'OpenRewrite so với để trợ lý AI tự nâng cấp'}</h3>
<p>${en
  ? 'A recipe is deterministic: the same input gives the same diff on every machine, every recipe in the chain is named in the log, and a bug in a recipe is fixed once for everyone. An AI assistant is flexible: it can handle code no recipe covers and explain an error message — and it can also produce a plausible-looking diff that is different every run. The sensible combination used by teams in 2026: recipes for the mechanical bulk, a human (possibly with an assistant) for the leftovers, and in both cases the same safety net and the same rule — nothing is merged that nobody has read.'
  : 'Recipe là tất định: cùng đầu vào cho cùng diff trên mọi máy, mọi recipe trong chuỗi đều có tên trong log, và lỗi của một recipe được sửa một lần cho tất cả. Trợ lý AI thì linh hoạt: xử được mã mà chưa recipe nào phủ, giải thích được câu lỗi — và cũng có thể sinh ra một diff trông hợp lý mà mỗi lần chạy mỗi khác. Cách kết hợp hợp lý mà các đội dùng năm 2026: recipe cho phần khối lượng máy móc, con người (có thể kèm trợ lý) cho phần còn sót, và trong cả hai trường hợp là cùng một lưới an toàn, cùng một luật — không gộp thứ gì chưa có người đọc.'}</p>

<h3>🏠 ${en ? 'Everyday analogy' : 'Liên hệ đời thường'}</h3>
<p>${en
  ? '“Find and replace all” in a contract: changing “Party A” to the new company name is perfect for a machine — until it also changes a clause where “Party A” is quoted from the old agreement. You still read the contract before signing.'
  : '"Tìm và thay tất cả" trong một bản hợp đồng: đổi "Bên A" thành tên công ty mới là việc hoàn hảo cho máy — cho tới khi nó đổi luôn điều khoản có trích dẫn "Bên A" của hợp đồng cũ. Bạn vẫn phải đọc hợp đồng trước khi ký.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Your leader: “Just run OpenRewrite and open the PR, the tool is reliable.” A good answer is not “no”, it is a plan: “I’ll run dryRun, commit the raw output, then a separate commit with my fixes; I already see the in-memory users were lost in the recipe output, so I’ll mention it in the PR and add a test for roles.” You are using the tool and showing why the review matters.'
  : 'Leader bảo: "Cứ chạy OpenRewrite rồi mở PR, công cụ tin được." Câu trả lời tốt không phải "không", mà là một kế hoạch: "Em chạy dryRun, commit nguyên output, rồi commit riêng các chỗ em sửa; em thấy output của recipe đã làm mất người dùng in-memory, em sẽ ghi vào PR và thêm test vai trò." Bạn vẫn dùng công cụ, và cho thấy vì sao review là cần.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“Have you used OpenRewrite? What can go wrong?”' : '"Em dùng OpenRewrite chưa? Có thể sai ở đâu?"'}</strong><br>${en
  ? 'Yes, Boot 2.5 → 3.5 and javax → jakarta. It translated the filter chain well but lost in-memory users, set the servlet API to compile scope, renamed to jakarta.xml.bind without adding the library, and left JSTL 1.2 and JSP URIs. Tests and a golden master caught all of it.'
  : 'Rồi ạ, Boot 2.5 → 3.5 và javax → jakarta. Nó dịch chuỗi bộ lọc tốt nhưng làm mất người dùng in-memory, đặt servlet API sang scope compile, đổi tên sang jakarta.xml.bind mà không thêm thư viện, và bỏ sót JSTL 1.2 cùng URI trong JSP. Test và golden master bắt được tất cả.'}</li>
<li><strong>${en ? '“Why is it better than sed?”' : '"Sao nó hơn sed?"'}</strong><br>${en
  ? 'It works on a typed tree: it changes a type where it is really referenced, adds or removes imports, and keeps formatting. sed changes text, including comments and unrelated strings.'
  : 'Nó làm việc trên cây có kiểu: đổi một kiểu ở nơi thật sự tham chiếu tới nó, tự thêm/bớt import, giữ định dạng. sed đổi chữ, kể cả chú thích và chuỗi không liên quan.'}</li>
<li><strong>${en ? '“How do you review a 3,000-line generated diff?”' : '"Em review diff 3.000 dòng do máy sinh thế nào?"'}</strong><br>${en
  ? 'Not line by line equally. Group by recipe (the log says which recipe touched which file), skim the mechanical renames, read in full the files the tests do not type-check: security, build scopes, configuration, templates. Then rely on tests and HTTP checks.'
  : 'Không đọc đều từng dòng. Gom theo recipe (log ghi recipe nào chạm tệp nào), lướt phần đổi tên máy móc, đọc kỹ toàn bộ những tệp test không kiểm kiểu được: bảo mật, scope build, cấu hình, template. Rồi dựa vào test và kiểm qua HTTP.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'Run <code>dryRun</code> with <code>org.openrewrite.java.migrate.jakarta.JakartaEE10</code> on your <code>ch7</code> branch after lesson 7.1 (Java 17 already done). Count how many of the 12 patched files you would merge unchanged, and list what you would add by hand before Tomcat 10 can run it.'
  : 'Chạy <code>dryRun</code> với <code>org.openrewrite.java.migrate.jakarta.JakartaEE10</code> trên nhánh <code>ch7</code> sau bài 7.1 (đã xong Java 17). Đếm xem trong 12 tệp được vá, bạn gộp nguyên được bao nhiêu, và liệt kê những gì phải thêm tay trước khi Tomcat 10 chạy được.'}</p>
${giai(en ? '🔑 What the course got' : '🔑 Kết quả của khoá', `<p>${en
  ? '11 of 12 unchanged (4 servlets, 6 tests, web.xml). pom.xml needed a fix (servlet-api back to provided) and three additions outside the patch: Jakarta Tags 3.0 instead of JSTL 1.2 (excluding the bundled EL API), <code>uri="jakarta.tags.core"</code> in report.jsp, and the Tomcat 10.1 base image. Full result: lesson 7.5, commit <code>2931fa6</code>.'
  : '11/12 gộp nguyên (4 servlet, 6 test, web.xml). pom.xml phải sửa (servlet-api về provided) và ba thứ thêm ngoài patch: Jakarta Tags 3.0 thay JSTL 1.2 (loại EL API đi kèm), <code>uri="jakarta.tags.core"</code> trong report.jsp, và ảnh nền Tomcat 10.1. Kết quả đủ: bài 7.5, commit <code>2931fa6</code>.'}</p>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Recipe', 'recipe (công thức)', 'Một phép biến đổi mã của OpenRewrite; recipe tổng hợp xâu chuỗi nhiều recipe con.', 'One OpenRewrite transformation; composite recipes chain many.'],
  ['Lossless Semantic Tree', 'cây ngữ nghĩa không mất mát', 'Cây cú pháp giữ cả kiểu lẫn định dạng, để in lại mã y như cũ.', 'A syntax tree with types and formatting, so code prints back unchanged.'],
  ['dryRun', 'chạy thử', 'Sinh rewrite.patch mà không sửa tệp.', 'Produces rewrite.patch without touching files.'],
  ['runNoFork', 'chạy không qua vòng đời', 'Không biên dịch trước; dùng khi dự án chưa build được trên JDK mới.', 'Skips compilation; for projects that do not build on the new JDK yet.'],
  ['Codemod', 'sửa mã hàng loạt', 'Tên chung cho công cụ biến đổi mã tự động (OpenRewrite, jscodeshift…).', 'Generic name for automated code transformation tools.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Recipes do the bulk perfectly and know nothing about your business or your container.' : 'Recipe làm phần khối lượng hoàn hảo và không biết gì về nghiệp vụ hay container của bạn.'}</li>
<li>${en ? 'Measured here: users lost, a wrong scope, a missing library, an untouched JSTL — all caught by the safety net.' : 'Đo được ở đây: mất người dùng, sai scope, thiếu thư viện, JSTL không đụng tới — lưới an toàn bắt hết.'}</li>
<li>${en ? 'dryRun → read → commit raw → commit fixes → run the real server.' : 'dryRun → đọc → commit nguyên bản → commit chỗ sửa → chạy máy chủ thật.'}</li>
</ul>
${tl('https://docs.openrewrite.org/running-recipes/popular-recipe-guides/migrate-to-spring-3', '🔧', 'OpenRewrite — Migrate to Spring Boot 3', en ? 'Official guide for the recipe used here' : 'Hướng dẫn chính thức cho recipe dùng ở đây')}
${tl('https://docs.openrewrite.org/reference/rewrite-maven-plugin', '🔧', 'rewrite-maven-plugin — goals', en ? 'run, dryRun, runNoFork, dryRunNoFork' : 'run, dryRun, runNoFork, dryRunNoFork')}
${lk(bai('ide-va-do-nghe-dev', 'ide-2-3-refactor-sinh-code'), '🛠️', en ? 'IDE course 2.3 — refactoring and generated code' : 'Khoá IDE 2.3 — refactor và mã sinh tự động', en ? 'The one-move-at-a-time tools' : 'Công cụ làm từng bước một')}
`);

/* ═══════════════════ 7.4 — Node 14 → 20/22 (đích 24) ═══════════════════ */
const O74_LICH = out(`
$ curl -s https://raw.githubusercontent.com/nodejs/Release/main/schedule.json   # (bản, ra mắt, vào LTS, vào bảo trì, hết hạn)
v14 2020-04-21 2020-10-27 2021-10-19 2023-04-30
v18 2022-04-19 2022-10-25 2023-10-18 2025-04-30
v20 2023-04-18 2023-10-24 2024-10-22 2026-04-30
v22 2024-04-24 2024-10-29 2025-10-21 2027-04-30
v24 2025-05-06 2025-10-28 2026-10-20 2028-04-30
v26 2026-05-05 2026-10-28 2027-10-20 2029-04-30
`);
const C74_MATRAN = bash(`
# Ma trận: cùng một commit (ch6), mỗi bản Node một container sạch — npm ci rồi jest
for v in 14 16 18 20 22 24 26; do
  docker run --rm -v "$PWD":/app -w /app node:$v-alpine sh -c 'node -v; npm ci --no-audit; npx jest --runInBand'
done
`);
const O74_MATRAN = out(`
## node v14.21.3 npm 6.14.18
added 556 packages in 4.137s
Tests:       21 passed, 21 total
## node v16.20.2 npm 8.19.4
npm WARN EBADENGINE   required: { node: '>=18' },          (một gói dev trong lockfile)
Tests:       1 failed, 20 passed, 21 total
## node v18.20.8 npm 10.8.2
npm warn EBADENGINE   required: { node: '>=10 <15' },      (chính package.json của ta)
Tests:       1 failed, 20 passed, 21 total
## node v20.20.2 · v22.23.5 · v24.22.3 · v26.13.1
Tests:       1 failed, 20 passed, 21 total                  (cùng một test, cả bốn bản)
`);
const O74_V8 = out(`
  ● độc giả đã bị xoá — bản giả THAY HẲN kho: Express in stack trace
    Expected substring: "TypeError: Cannot read property &#39;ten&#39; of undefined"
    Received string:    "...<pre>TypeError: Cannot read properties of undefined (reading &#39;ten&#39;)<br> &nbsp; &nbsp;at cb (/app/routes/phieu.js:18:42)..."
    > 20 |   expect(res.text).toContain('TypeError: Cannot read property &#39;ten&#39; of undefined');
`);
const C74_V8 = js(`
  // Bài 7.4: câu chữ do V8 sinh — Node 14: "Cannot read property 'ten' of undefined",
  // Node 16+: "Cannot read properties of undefined (reading 'ten')". Khoá điều mình cần (TypeError ở thuộc tính ten), không khoá câu của V8.
  expect(res.text).toMatch(/TypeError: Cannot read propert(y &#39;ten&#39; of undefined|ies of undefined \\(reading &#39;ten&#39;\\))/);
`);
const O74_LOCK = out(`
$ npm install          # Node 24, npm 11.19.1, trên lockfile của npm 6
npm warn old lockfile
npm warn old lockfile The package-lock.json file was created with an old version of npm,
npm warn old lockfile so supplemental metadata must be fetched from the registry.
npm warn old lockfile
npm warn old lockfile This is a one-time fix-up, please be patient...
$ grep -m1 lockfileVersion package-lock.json
  "lockfileVersion": 3,
$ git diff --stat
 .nvmrc            |    2 +-
 package-lock.json | 4793 +++++++++++++++++++++++++++++++++++------------------
 package.json      |    2 +-
$ npm ci               # đồng đội / CI còn Node 14, npm 6.14.18, đọc lockfile v3
npm WARN prepare removing existing node_modules/ before installation
npm ERR! Cannot read property 'express' of undefined
`);
const C74_APICU = js(`
// Những dòng "rất 2018" hay gặp trong repo Node cũ — chạy thử trên từng bản Node
thu("createHash('md4')", () => crypto.createHash('md4').update('a').digest('hex').slice(0, 8));
thu('util.isArray([])', () => util.isArray([]));
thu("url.parse('/a?b=1').query", () => url.parse('/a?b=1').query);
thu("new Buffer('ab').length", () => new Buffer('ab').length);
`);
const O74_APICU = out(`
node v14.21.3 (OpenSSL 1.1.1t)
  createHash('md4')            -> bde52cb3
  util.isArray([])             -> true
  url.parse('/a?b=1').query    -> b=1
  new Buffer('ab').length      -> 2
(node:1) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from()
node v18.20.8 (OpenSSL 3.0.16)
  createHash('md4')            -> LOI ERR_OSSL_EVP_UNSUPPORTED: error:0308010C:digital envelope routines::unsupported
  ... (3 dòng còn lại như Node 14, cùng DEP0005)
node v22.23.5 (OpenSSL 3.5.9)
  createHash('md4')            -> LOI ERR_OSSL_EVP_UNSUPPORTED: error:0308010C:digital envelope routines::unsupported
(node:1) [DEP0044] DeprecationWarning: The \`util.isArray\` API is deprecated. Please use \`Array.isArray()\` instead.
(node:1) [DEP0005] DeprecationWarning: Buffer() is deprecated ...
node v24.22.3 (OpenSSL 3.5.9)          (v26.13.1 in giống hệt)
  createHash('md4')            -> LOI ERR_OSSL_EVP_UNSUPPORTED: error:0308010C:digital envelope routines::unsupported
(node:1) [DEP0044] DeprecationWarning: The \`util.isArray\` API is deprecated. Please use \`Array.isArray()\` instead.
(node:1) [DEP0169] DeprecationWarning: \`url.parse()\` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVE
(node:1) [DEP0005] DeprecationWarning: Buffer() is deprecated ...
$ node --openssl-legacy-provider api-cu.js   # Node 22
  createHash('md4')            -> bde52cb3
`);
const C74_ESM = js(`
// Ai đó "nâng thư viện cho mới" bằng npm install nanoid@latest — repo vẫn là CommonJS
const { nanoid } = require('nanoid');            // nanoid 5.1.6: "type": "module"
console.log('ma phieu: ' + nanoid(8).length + ' ky tu');
`);
const O74_ESM = out(`
$ node so-phieu-moi.js   # v14.21.3
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /w/node_modules/nanoid/index.js
require() of ES modules is not supported.
$ node so-phieu-moi.js   # v18.20.8
Error [ERR_REQUIRE_ESM]: require() of ES Module /w/node_modules/nanoid/index.js from /w/so-phieu-moi.js not supported.
Instead change the require of index.js in /w/so-phieu-moi.js to a dynamic import() which is available in all CommonJS modules.
$ node so-phieu-moi.js   # v20.20.2
ma phieu: 8 ky tu
$ node so-phieu-moi.js   # v22.23.5 (v24.22.3 giống hệt)
ma phieu: 8 ky tu
$ npx jest __tests__/nanoid.thu.test.js   # Node 22, Jest 26 — cùng dòng require đó
FAIL __tests__/nanoid.thu.test.js
  ● Test suite failed to run
    Jest encountered an unexpected token
    This usually means that you are trying to import a file which Jest cannot parse, e.g. it's not plain JavaScript.
`);
const O74_JEST = out(`
$ npm install --save-dev --save-exact jest@30.5.2 supertest@7.3.2
$ npx jest --runInBand
  ● danh sách quá hạn
    expect(received).toMatchSnapshot()
    - Snapshot  - 4
    + Received  + 4
    - Array [
    -   Object {
    + [
    +   {
          "capNhat": "10:00 24/11/2026",
Tests:       1 failed, 20 passed, 21 total
$ npx jest --runInBand -u && git diff -U0 __tests__/__snapshots__/ | grep -E "^[-+]" | grep -v "^+++\\|^---"
-// Jest Snapshot v1, https://goo.gl/fbAQLP
+// Jest Snapshot v1, https://jestjs.io/docs/snapshot-testing
-Array [
-  Object {
+[
+  {
-  Object {
+  {
-  Object {
+  {
$ npm audit        # trước (Jest 26) → sau (Jest 30)
26 vulnerabilities (3 low, 18 moderate, 5 high)
18 moderate severity vulnerabilities                   (glob/minimatch trong @jest/reporters 30.5.2 — chỉ dev)
$ npm audit --omit=dev
found 0 vulnerabilities
`);
const O74_LOG = out(`
$ git log --oneline ch6..ch7
7788544 build(7.4): jest 26.6.3 -> 30.5.2, supertest 4.0.2 -> 7.3.2 (--save-exact) + cap nhat snapshot sau khi doc diff
2065d73 build(7.4): Node 14 -> 24 (.nvmrc 24, engines >=22), lockfile v1 -> v3 (npm 11.19.1)
f254618 test(7.4): bo khoa cau bao loi cua V8 — Node 16+ doi 'Cannot read property' thanh 'Cannot read properties of undefined (reading ...)'
$ for v in 22 24 26; do ... npx jest; done
node 22: Tests:       21 passed, 21 total
node 24: Tests:       21 passed, 21 total
node 26: Tests:       21 passed, 21 total
`);
const O74_EX5 = out(`
$ npm install --save-exact express@5.3.0 && npx jest --runInBand     # nhánh thu-express5
Tests:       21 passed, 21 total
$ grep -nE "req\\.param\\(|res\\.send\\([0-9]|app\\.del\\(|'\\*'|:[a-z]+\\?|req\\.query" app.js routes/*.js lib/*.js
(không có dòng nào)
$ node duong-cu.js        # ba kiểu route "đời Express 4"
express 4.22.3
  route '/tai-lieu/*'       -> dang ky duoc
  route '/api/sach/:id?'    -> dang ky duoc
... express deprecated req.param(name): Use req.params, req.body, or req.query instead at duong-cu.js:8:83
  GET /api/sach/7           -> 200 sach 7
express 5.3.0
  route '/tai-lieu/*'       -> LOI Missing parameter name at index 11: /tai-lieu/*; visit https://git.new/pathToReg
  route '/api/sach/:id?'    -> LOI Unexpected ? at index 13: /api/sach/:id?; visit https://git.new/pathToRegexpErro
  GET /api/sach/7           -> 404 <!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8
`);

const L74 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Upgrading safely' : 'Chương 7 · Nâng cấp phiên bản an toàn'}</span>
<h2>${en ? '7.4 — Node 14 → 20/22: CommonJS vs ESM, OpenSSL 3, removed APIs, lockfile v3' : '7.4 — Node 14 → 20/22: CommonJS và ESM, OpenSSL 3, API bị gỡ, lockfile v3'}</h2>
<p class="lead">${en
  ? 'Changing the tyres of a car while keeping the same chassis: the engine (V8), the electrics (OpenSSL), the dashboard (npm) all change underneath an app whose code you barely touch. The Node.js side of the course’s lab is <code>legacy-express</code>, an Express 4 API pinned to Node 14 since 2018. This lesson moves it to a supported Node, measures what really breaks on every version from 14 to 26, and separates the problems of the runtime from the problems of the tools.'
  : 'Thay lốp mà giữ nguyên khung xe: động cơ (V8), hệ thống điện (OpenSSL), bảng đồng hồ (npm) đều đổi bên dưới một ứng dụng mà mã của nó bạn gần như không chạm tới. Phía Node.js của lab là <code>legacy-express</code>, một API Express 4 ghim Node 14 từ 2018. Bài này đưa nó lên một bản Node còn được hỗ trợ, đo thứ thật sự vỡ trên từng bản từ 14 tới 26, và tách vấn đề của runtime khỏi vấn đề của công cụ.'}</p>
${moiTruong(en)}

<h3>${en ? 'Which target? Read the calendar, not the course title' : 'Đích nào? Đọc lịch, đừng đọc tên bài'}</h3>
${O74_LICH}
<p>${en
  ? 'Node releases a major version every six months; even numbers become LTS in October and are supported for about 30 months. On the day this lesson was written (November 2026): Node 20 reached end of life in April 2026, 22 is in maintenance until April 2027, 24 is in maintenance until April 2028, and 26 became Active LTS one month ago. The title says “20/22” because that was the target when the course was planned — the method is the same, but the honest choice today is <strong>24</strong>: two more years of patches, and a month-old LTS (26) is usually left to settle before production moves. Our <code>engines</code> field will say <code>&gt;=22</code> and CI tests 22, 24 and 26.'
  : 'Node ra một bản chính mỗi sáu tháng; bản số chẵn vào LTS tháng 10 và được hỗ trợ khoảng 30 tháng. Đúng ngày soạn bài (tháng 11/2026): Node 20 đã hết hạn tháng 4/2026, 22 đang bảo trì tới tháng 4/2027, 24 bảo trì tới tháng 4/2028, còn 26 vừa thành Active LTS được một tháng. Tên bài ghi "20/22" vì đó là đích lúc lên khung khoá — phương pháp không đổi, nhưng lựa chọn trung thực hôm nay là <strong>24</strong>: thêm hai năm bản vá, còn một LTS mới một tháng tuổi (26) thường được để "lắng" trước khi production chuyển sang. Trường <code>engines</code> của ta sẽ ghi <code>&gt;=22</code> và CI test 22, 24, 26.'}</p>

<h3>${en ? 'Step 0: the matrix — measure before you change anything' : 'Bước 0: ma trận — đo trước khi đổi bất cứ gì'}</h3>
${C74_MATRAN}
${O74_MATRAN}
<p>${en
  ? 'Seven runs, three facts. Jest 26 still runs on Node 26 — the tools are not the blocker here. The <code>engines</code> field <code>&gt;=10 &lt;15</code> only produces a warning (npm does not enforce it unless <code>engine-strict</code> is set). And one test fails from Node 16 onwards, on every version. One failing test across five runtimes means one cause:'
  : 'Bảy lần chạy, ba sự thật. Jest 26 vẫn chạy trên Node 26 — công cụ không phải thứ cản ở đây. Trường <code>engines</code> <code>&gt;=10 &lt;15</code> chỉ sinh cảnh báo (npm không ép nếu chưa bật <code>engine-strict</code>). Và một test đỏ từ Node 16 trở đi, ở mọi bản. Một test đỏ trên năm runtime nghĩa là một nguyên nhân:'}</p>
${O74_V8}
<p>${en
  ? 'V8 9.x (Node 16) rewrote the message for reading a property of <code>undefined</code>. Our Chapter 3 characterization test pinned the exact sentence of the JavaScript engine. That is over-specification: what the test must lock is “a TypeError on property <code>ten</code> reaches the page” (the bug we documented), not the engine’s wording. Fix the test <em>first, on Node 14</em>, so that it is green on both sides of the jump:'
  : 'V8 9.x (Node 16) viết lại câu báo khi đọc thuộc tính của <code>undefined</code>. Characterization test của Chương 3 khoá đúng nguyên câu của bộ máy JavaScript. Đó là khoá quá tay: điều test cần khoá là "một TypeError ở thuộc tính <code>ten</code> lọt ra trang" (lỗi ta đã ghi nhận), không phải câu chữ của bộ máy. Sửa test <em>trước, khi còn ở Node 14</em>, để nó xanh ở cả hai bờ của cú nhảy:'}</p>
${C74_V8}

<h3>${en ? 'The jump: .nvmrc, engines, lockfile v3' : 'Cú nhảy: .nvmrc, engines, lockfile v3'}</h3>
${O74_LOCK}
<p>${en
  ? 'npm 7 introduced lockfile v2, npm 9 writes v3 only. The first <code>npm install</code> on a new npm rewrites the whole lockfile: 4,793 changed lines without a single dependency version changing. Two consequences for the team. The PR is unreadable as a diff — say in the description that the lockfile was regenerated and that <code>npm ls</code> shows the same versions. And it is a <strong>one-way door</strong>: npm 6 cannot read v3 and fails with a nonsense error. CI images, Dockerfiles, the deploy server and every teammate’s nvm must move in the same PR. In Java terms: the lockfile format is like the class file version of lesson 7.1.'
  : 'npm 7 đưa ra lockfile v2, npm 9 chỉ ghi v3. Lần <code>npm install</code> đầu tiên với npm mới viết lại toàn bộ lockfile: 4.793 dòng đổi mà không phiên bản thư viện nào đổi. Hai hệ quả cho cả đội. PR không đọc được bằng diff — hãy ghi trong mô tả rằng lockfile được sinh lại và <code>npm ls</code> cho cùng phiên bản. Và đây là <strong>cửa một chiều</strong>: npm 6 không đọc được v3 và chết với một câu lỗi vô nghĩa. Ảnh CI, Dockerfile, máy chủ deploy và nvm của từng đồng đội phải đổi trong cùng PR. Nói theo kiểu Java: định dạng lockfile giống phiên bản tệp class ở bài 7.1.'}</p>

<h3>${en ? 'What changed in the runtime: OpenSSL 3 and deprecations' : 'Runtime đã đổi gì: OpenSSL 3 và các deprecation'}</h3>
<p>${en
  ? '<code>legacy-express</code> itself uses none of these, but a typical 2018 repo does (and so do its old build tools). One file, seven Node versions:'
  : 'Bản thân <code>legacy-express</code> không dùng thứ nào dưới đây, nhưng một repo điển hình năm 2018 thì có (công cụ build cũ của nó cũng có). Một tệp, bảy bản Node:'}</p>
${C74_APICU}
${O74_APICU}
<ul>
<li>${en ? '<strong>ERR_OSSL_EVP_UNSUPPORTED (Node 17+).</strong> Node 17 moved to OpenSSL 3, which puts old algorithms like MD4 in a “legacy provider” that is off by default. The famous victim is webpack 4, which hashed modules with MD4 — <code>npm run build</code> of an old React/Vue front end dies with exactly this line. <code>--openssl-legacy-provider</code> (or <code>NODE_OPTIONS</code>) makes it work again; it is a crutch while you upgrade the build tool, not a fix.' : '<strong>ERR_OSSL_EVP_UNSUPPORTED (Node 17+).</strong> Node 17 chuyển sang OpenSSL 3, nơi các thuật toán cũ như MD4 nằm trong "legacy provider" tắt sẵn. Nạn nhân nổi tiếng là webpack 4, vốn băm module bằng MD4 — <code>npm run build</code> của một front end React/Vue cũ chết đúng với dòng này. <code>--openssl-legacy-provider</code> (hoặc <code>NODE_OPTIONS</code>) làm nó chạy lại; đó là cái nạng trong lúc nâng công cụ build, không phải cách sửa.'}</li>
<li>${en ? '<strong>Deprecations are a schedule.</strong> DEP0005 (<code>new Buffer</code>) has warned since Node 10; DEP0044 (<code>util.isArray</code>) became a runtime warning in 22; DEP0169 (<code>url.parse</code>) in 24, with a security note. Each warning is a future removal: run your tests with <code>--throw-deprecation</code> once, list them, and fix them in small refactor commits.' : '<strong>Deprecation là một lịch trình.</strong> DEP0005 (<code>new Buffer</code>) cảnh báo từ Node 10; DEP0044 (<code>util.isArray</code>) thành cảnh báo lúc chạy ở 22; DEP0169 (<code>url.parse</code>) ở 24, kèm lưu ý bảo mật. Mỗi cảnh báo là một lần gỡ trong tương lai: chạy test với <code>--throw-deprecation</code> một lần, liệt kê, và sửa trong những commit refactor nhỏ.'}</li>
</ul>

<h3>${en ? 'CommonJS and ESM: the error that moved' : 'CommonJS và ESM: cái lỗi đã dời chỗ'}</h3>
${C74_ESM}
${O74_ESM}
<p>${en
  ? 'Many popular packages (nanoid 4+, chalk 5+, node-fetch 3+, got 12+…) are now ESM-only. For years a CommonJS app could not <code>require()</code> them: <code>ERR_REQUIRE_ESM</code>, as on 14 and 18 above. Since Node 22.12 and 20.19, <code>require()</code> of a synchronous ES module works by default — but the old Jest still runs its own module loader and fails with “unexpected token”. So “it works with node” and “it works in the tests” are two different questions. How CommonJS and ESM differ is taught in the Node.js course (lesson 1.5); for an upgrade the rule is simpler: <strong>do not change the module system and the runtime in the same PR</strong>, and when <code>npm outdated</code> proposes a major version, read its changelog for “ESM only” before accepting.'
  : 'Nhiều gói phổ biến (nanoid 4+, chalk 5+, node-fetch 3+, got 12+…) giờ chỉ còn ESM. Nhiều năm liền, ứng dụng CommonJS không <code>require()</code> được chúng: <code>ERR_REQUIRE_ESM</code>, như trên 14 và 18 ở trên. Từ Node 22.12 và 20.19, <code>require()</code> một ES module đồng bộ chạy được mặc định — nhưng Jest đời cũ vẫn dùng bộ nạp module riêng và chết với "unexpected token". Nên "chạy được bằng node" và "chạy được trong test" là hai câu hỏi khác nhau. CommonJS khác ESM thế nào được giảng ở khoá Node.js (bài 1.5); với nâng cấp thì luật đơn giản hơn: <strong>đừng đổi hệ module và runtime trong cùng một PR</strong>, và khi <code>npm outdated</code> đề xuất một bản chính mới, đọc changelog tìm chữ "ESM only" trước khi nhận.'}</p>

<h3>${en ? 'The tools: Jest 26 → 30' : 'Công cụ: Jest 26 → 30'}</h3>
${O74_JEST}
<p>${en
  ? 'Jest 29 changed the default snapshot format. Running <code>jest -u</code> blindly would accept <em>any</em> change, including a real regression. The discipline: run <code>-u</code>, then prove with the diff that only the format changed (here: <code>Array [</code>/<code>Object {</code> prefixes and the header link, zero values), and say so in the commit. Upgrading Jest removed 8 of 26 audit findings; the 18 left are in Jest 30’s own dev dependencies, and production has none — the kind of sentence lesson 6.2 taught you to write.'
  : 'Jest 29 đổi định dạng snapshot mặc định. Chạy <code>jest -u</code> mù quáng là chấp nhận <em>mọi</em> thay đổi, kể cả một lỗi hồi quy thật. Kỷ luật: chạy <code>-u</code>, rồi dùng diff chứng minh chỉ định dạng đổi (ở đây: tiền tố <code>Array [</code>/<code>Object {</code> và liên kết ở dòng đầu, không giá trị nào đổi), và ghi rõ trong commit. Nâng Jest bỏ được 8 trong 26 phát hiện của audit; 18 cái còn lại nằm trong phụ thuộc dev của chính Jest 30, còn production không có cái nào — đúng kiểu câu mà bài 6.2 đã dạy bạn viết.'}</p>
${O74_LOG}

<h3>${en ? 'Express 4 → 5: awareness level' : 'Express 4 → 5: mức nhận biết'}</h3>
<p>${en
  ? 'Express 5.0 shipped in September 2024 (after ten years of 4.x); the official support page lists v4 as still supported, so it is not urgent — but it is the next stone. We tried it on a side branch:'
  : 'Express 5.0 ra tháng 9/2024 (sau mười năm của 4.x); trang hỗ trợ chính thức vẫn ghi v4 còn được hỗ trợ, nên chưa gấp — nhưng đó là hòn đá kế tiếp. Ta thử trên một nhánh phụ:'}</p>
${O74_EX5}
<p>${en
  ? 'Our 21 tests passed because the app uses none of the removed APIs — the grep proves it, the tests alone do not. A typical older app is not so lucky: path-to-regexp 8 rejects <code>*</code> and <code>:id?</code> at <em>startup</em> (named wildcards <code>/*path</code> and braces <code>{/:id}</code> replace them), <code>req.param()</code> is gone, and the default query parser no longer builds nested objects from <code>?loai[ten]=SV</code>. Express 5 also forwards rejected promises from async handlers to the error handler, which changes error behaviour for code that relied on unhandled rejections. Grep first, then the matrix, then a side branch.'
  : '21 test của ta qua vì ứng dụng không dùng API nào bị gỡ — grep chứng minh điều đó, test thì không tự chứng minh được. Một ứng dụng cũ điển hình không may như vậy: path-to-regexp 8 từ chối <code>*</code> và <code>:id?</code> ngay <em>lúc khởi động</em> (thay bằng wildcard có tên <code>/*path</code> và ngoặc nhọn <code>{/:id}</code>), <code>req.param()</code> mất, và bộ phân tích query mặc định không còn dựng đối tượng lồng từ <code>?loai[ten]=SV</code>. Express 5 cũng chuyển promise bị reject từ handler async sang bộ xử lý lỗi, làm đổi hành vi lỗi của mã từng dựa vào rejection không ai bắt. Grep trước, rồi ma trận, rồi nhánh phụ.'}</p>

<h3>🕵️ ${en ? 'Security angle: running an end-of-life runtime' : 'Góc bảo mật: chạy một runtime đã hết hạn'}</h3>
<p>${en
  ? 'Node 14 bundles OpenSSL 1.1.1, which reached end of life on 11 September 2023; Node 14 itself stopped receiving fixes in April 2023. Every Node and OpenSSL security release since then — HTTP request smuggling fixes in <code>llhttp</code>, OpenSSL CVEs — never reached that runtime. <code>npm audit</code> cannot tell you this, because the runtime is not a package in your lockfile. Add the runtime to your inventory: the Node release schedule and <code>endoflife.date</code> are the sources, and “we run an EOL runtime” is a finding for the risk register, just like log4j 1.x in lesson 6.2.'
  : 'Node 14 đóng gói OpenSSL 1.1.1, vốn hết hạn ngày 11/9/2023; bản thân Node 14 ngừng nhận bản sửa từ tháng 4/2023. Mọi bản phát hành bảo mật của Node và OpenSSL từ đó — các bản sửa HTTP request smuggling trong <code>llhttp</code>, các CVE của OpenSSL — không bao giờ tới runtime đó. <code>npm audit</code> không nói được điều này, vì runtime không phải một gói trong lockfile. Hãy đưa runtime vào danh sách kiểm kê: lịch phát hành của Node và <code>endoflife.date</code> là nguồn, còn "đang chạy runtime hết hạn" là một phát hiện cho sổ rủi ro, y như log4j 1.x ở bài 6.2.'}</p>

<h3>🏠 ${en ? 'Everyday analogy' : 'Liên hệ đời thường'}</h3>
<p>${en
  ? 'An old phone that no longer receives OS updates still makes calls and runs your banking app — until the day the bank’s app requires a newer OS, or a known hole is used against you. Nothing “breaks” on the day support ends; the risk just stops being fixed.'
  : 'Một chiếc điện thoại cũ không còn nhận bản cập nhật hệ điều hành vẫn gọi được, vẫn mở được app ngân hàng — cho tới ngày app ngân hàng đòi hệ điều hành mới hơn, hoặc một lỗ hổng đã biết bị dùng để tấn công bạn. Hôm hết hỗ trợ không có gì "vỡ"; chỉ là rủi ro thôi không được vá nữa.'}</p>

<h3>💼 ${en ? 'OJT situation: the Dockerfile you forgot' : 'Tình huống OJT: cái Dockerfile bạn quên'}</h3>
<p>${en
  ? 'Your PR (Node 24, lockfile v3) is green in GitHub Actions. The next morning the deploy job fails: the deploy server builds with its own <code>FROM node:14</code> image, and npm 6 prints “Cannot read property … of undefined”. Before an upgrade PR, <code>git grep -n "node:1[0-9]\\|nvm use\\|setup-node"</code> across the repo <em>and</em> the deployment repo, and list every place the version lives in the PR description.'
  : 'PR của bạn (Node 24, lockfile v3) xanh trên GitHub Actions. Sáng hôm sau job deploy chết: máy chủ deploy build bằng ảnh <code>FROM node:14</code> của riêng nó, và npm 6 in "Cannot read property … of undefined". Trước một PR nâng cấp, chạy <code>git grep -n "node:1[0-9]\\|nvm use\\|setup-node"</code> trên cả repo <em>lẫn</em> repo triển khai, và liệt kê mọi chỗ chứa phiên bản trong mô tả PR.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“npm run build fails with ERR_OSSL_EVP_UNSUPPORTED after a Node upgrade. Why?”' : '"npm run build lỗi ERR_OSSL_EVP_UNSUPPORTED sau khi nâng Node. Vì sao?"'}</strong><br>${en
  ? 'Node 17+ uses OpenSSL 3, where MD4 is in the legacy provider; old webpack (4) hashes with MD4. --openssl-legacy-provider is a temporary workaround; the fix is upgrading webpack or the framework CLI.'
  : 'Node 17+ dùng OpenSSL 3, nơi MD4 nằm trong legacy provider; webpack cũ (4) băm bằng MD4. --openssl-legacy-provider là đường vòng tạm; cách sửa là nâng webpack hoặc CLI của framework.'}</li>
<li><strong>${en ? '“What is ERR_REQUIRE_ESM and how do you handle it?”' : '"ERR_REQUIRE_ESM là gì, xử thế nào?"'}</strong><br>${en
  ? 'A CommonJS require() of an ESM-only package. Options: stay on the last CommonJS major of that package, use dynamic import(), move the file to ESM, or on Node 20.19+/22.12+ require(esm) works — but check the test runner too.'
  : 'require() kiểu CommonJS một gói chỉ có ESM. Cách xử: ở lại bản chính CommonJS cuối của gói đó, dùng import() động, chuyển tệp sang ESM, hoặc trên Node 20.19+/22.12+ thì require(esm) chạy được — nhưng phải kiểm cả trình chạy test.'}</li>
<li><strong>${en ? '“Why did the lockfile change by 4,000 lines?”' : '"Sao lockfile đổi 4.000 dòng?"'}</strong><br>${en
  ? 'npm 9+ rewrites v1 lockfiles to v3. Versions are the same (npm ls proves it). Old npm cannot read v3, so CI, Docker and teammates move together.'
  : 'npm 9+ viết lại lockfile v1 thành v3. Phiên bản không đổi (npm ls chứng minh). npm cũ không đọc được v3, nên CI, Docker và đồng đội phải đổi cùng lúc.'}</li>
<li><strong>${en ? '“Which Node version would you choose today, and why?”' : '"Hôm nay em chọn bản Node nào, vì sao?"'}</strong><br>${en
  ? 'An LTS with the longest remaining support that our dependencies support, usually not a brand-new one: today 24 (maintenance until 04/2028), with 26 in the CI matrix to prepare the next step.'
  : 'Một bản LTS còn hạn hỗ trợ dài nhất mà các thư viện của mình hỗ trợ, thường không phải bản mới toanh: hôm nay là 24 (bảo trì tới 04/2028), có 26 trong ma trận CI để chuẩn bị bước sau.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'Put the matrix into GitHub Actions (<code>node-version: [22, 24, 26]</code>, see the GitHub Actions course 2.5). Then run the app once with <code>node --throw-deprecation server.js</code> on Node 24 and call every endpoint: which deprecation, if any, comes from <em>our</em> code and which from a dependency?'
  : 'Đưa ma trận vào GitHub Actions (<code>node-version: [22, 24, 26]</code>, xem khoá GitHub Actions bài 2.5). Rồi chạy ứng dụng một lần bằng <code>node --throw-deprecation server.js</code> trên Node 24 và gọi mọi endpoint: deprecation nào (nếu có) đến từ mã <em>của ta</em>, cái nào từ thư viện?'}</p>
${giai(en ? '🔑 What to look for' : '🔑 Cần tìm gì', `<p>${en
  ? 'With <code>--throw-deprecation</code> the first deprecated call becomes an exception with a stack trace: the top frames tell you whether it is in <code>routes/</code>/<code>lib/</code> or under <code>node_modules/</code>. Ours: none in our code on the <code>ch7</code> branch; anything under <code>node_modules</code> goes into the upgrade notes with the package name.'
  : 'Với <code>--throw-deprecation</code>, lời gọi deprecated đầu tiên thành ngoại lệ có stack trace: các khung trên cùng cho biết nó nằm trong <code>routes/</code>/<code>lib/</code> hay dưới <code>node_modules/</code>. Của ta: mã của ta trên nhánh <code>ch7</code> không có; cái nào dưới <code>node_modules</code> thì ghi vào ghi chú nâng cấp kèm tên gói.'}</p>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Active / Maintenance LTS', 'LTS hoạt động / bảo trì', 'Hai pha hỗ trợ của bản Node số chẵn, tổng khoảng 30 tháng.', 'The two support phases of an even Node release, about 30 months in total.'],
  ['lockfileVersion', 'phiên bản lockfile', '1 = npm 5–6, 2 = npm 7–8, 3 = npm 9+. npm cũ không đọc được bản mới.', '1 = npm 5–6, 2 = npm 7–8, 3 = npm 9+. Old npm cannot read newer ones.'],
  ['OpenSSL legacy provider', 'bộ thuật toán cũ', 'Nơi OpenSSL 3 cất MD4 và các thuật toán cũ; tắt mặc định.', 'Where OpenSSL 3 keeps MD4 and other old algorithms; off by default.'],
  ['ESM-only package', 'gói chỉ có ESM', 'Gói "type": "module" không cung cấp bản CommonJS.', 'A "type": "module" package with no CommonJS build.'],
  ['require(esm)', 'require một ES module', 'Chạy mặc định từ Node 20.19/22.12 cho module đồng bộ.', 'On by default since Node 20.19/22.12 for synchronous modules.'],
  ['Over-specified test', 'test khoá quá tay', 'Test khoá cả chi tiết không thuộc hành vi (câu lỗi của V8).', 'A test pinning details that are not behaviour (V8’s message).'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Choose the target from the release calendar; measure every version in a matrix first.' : 'Chọn đích theo lịch phát hành; đo mọi bản bằng ma trận trước.'}</li>
<li>${en ? 'Fix over-specified tests before the jump, on the old runtime.' : 'Sửa test khoá quá tay trước cú nhảy, khi còn ở runtime cũ.'}</li>
<li>${en ? 'Lockfile v3 is a one-way door: runtime, CI, Docker and team move in one PR.' : 'Lockfile v3 là cửa một chiều: runtime, CI, Docker và cả đội đổi trong một PR.'}</li>
<li>${en ? 'Runtime, module system, test runner and framework are separate steps (OpenSSL 3, ESM, Jest 30, Express 5).' : 'Runtime, hệ module, trình chạy test và framework là các bước riêng (OpenSSL 3, ESM, Jest 30, Express 5).'}</li>
</ul>
${tl('https://github.com/nodejs/release#release-schedule', '🟩', 'Node.js Release schedule', en ? 'LTS phases and end-of-life dates' : 'Các pha LTS và ngày hết hạn')}
${tl('https://nodejs.org/api/deprecations.html', '🟩', 'Node.js — Deprecated APIs', en ? 'DEP0005, DEP0044, DEP0169…' : 'DEP0005, DEP0044, DEP0169…')}
${tl('https://expressjs.com/en/guide/migrating-5.html', '🚂', 'Express — Migrating to Express 5', en ? 'Removed APIs and path syntax' : 'API bị gỡ và cú pháp đường dẫn')}
${lk(bai('nodejs', 'nodejs-1-5-module'), '📦', en ? 'Node.js 1.5 — modules' : 'Node.js 1.5 — module', en ? 'CommonJS and ESM explained' : 'Giảng CommonJS và ESM')}
${lk(bai('nodejs', 'nodejs-4-2-semver-lockfile'), '🔒', en ? 'Node.js 4.2 — semver and lockfile' : 'Node.js 4.2 — semver và lockfile', en ? 'What the lockfile pins' : 'Lockfile ghim những gì')}
${lk(bai('github-actions', 'ga-2-5-ma-tran'), '⚙️', en ? 'GitHub Actions 2.5 — matrix builds' : 'GitHub Actions 2.5 — ma trận build', en ? 'Test 22, 24 and 26 in one workflow' : 'Test 22, 24 và 26 trong một workflow')}
${lk(bai('software-architecture', 'swarch-10-4-strangler'), '🏛️', en ? 'Software Architecture 10.4 — strangler fig' : 'Kiến trúc phần mềm 10.4 — strangler fig', en ? 'When an upgrade becomes a migration at architecture scale' : 'Khi nâng cấp trở thành di trú ở tầm kiến trúc')}
`);

/* ═══════════════════ 7.5 — Lab ═══════════════════ */
const O75_VO = out(`
# Mốc 3, lần 1: patch OpenRewrite JakartaEE10 + TokenUtil HexFormat + Dockerfile tomcat:10.1-jdk17-temurin
[INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ unzip -l target/thuvien.war | grep "WEB-INF/lib/"
   347613  05-12-2022 14:19   WEB-INF/lib/jakarta.servlet-api-6.0.0.jar        ← scope compile của recipe
   414240  06-24-2011 00:20   WEB-INF/lib/jstl-1.2.jar
  2618793  10-20-2026 18:36   WEB-INF/lib/mysql-connector-j-26.10.0.jar
  ...
$ docker logs rfc-thuvien-web | grep -E "Server version name|JVM Version|Deployment of"
... Server version name:   Apache Tomcat/10.1.62
... JVM Version:           17.0.21.1+2
... Deployment of web application archive [/usr/local/tomcat/webapps/thuvien.war] has finished in [499] ms
$ bash tools/golden.sh /tmp/g10 && diff -r golden /tmp/g10
diff --color -r golden/report_days_1.html /tmp/g10/report_days_1.html
2,29c2,80
< <html>
< <head><title>Quá hạn - Thư viện</title></head>
...
$ head -4 /tmp/g10/report_days_1.html
<html><body>
<h2>Có lỗi xảy ra</h2>
<pre>jakarta.servlet.ServletException: java.lang.NoClassDefFoundError: javax/servlet/jsp/tagext/TagLibraryValidator
	at org.apache.jasper.servlet.JspServlet.service(JspServlet.java:315)
$ docker exec rfc-thuvien-web grep -h SEVERE /usr/local/tomcat/logs/localhost.2026-11-23.log
... SEVERE [http-nio-8080-exec-4] org.apache.catalina.core.StandardWrapperValve.invoke Servlet.service() for servlet [com.thuvien.servlet.ReportServlet] in context with path [/thuvien] threw exception [java.lang.NoClassDefFoundError: javax/servlet/jsp/tagext/TagLibraryValidator]
`);
const C75_POM = xml(`
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.0.0</version>
  <scope>provided</scope>                      <!-- recipe ghi compile; container đã có -->
</dependency>
<dependency>
  <!-- Bài 7.5: JSTL 1.2 dùng javax.servlet.jsp.tagext ⇒ Tomcat 10 lỗi NoClassDefFoundError ở trang có thẻ c:. Jakarta Tags 3.0 = API + bản cài đặt. -->
  <groupId>jakarta.servlet.jsp.jstl</groupId>
  <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
  <version>3.0.2</version>
  <exclusions>
    <!-- Tomcat 10.1 đã có EL 5.0 — đừng nhét bản thứ hai vào WEB-INF/lib -->
    <exclusion><groupId>jakarta.el</groupId><artifactId>jakarta.el-api</artifactId></exclusion>
  </exclusions>
</dependency>
<dependency>
  <groupId>org.glassfish.web</groupId>
  <artifactId>jakarta.servlet.jsp.jstl</artifactId>
  <version>3.0.1</version>
</dependency>
`);
const O75_XANH = out(`
$ sed -i 's#uri="http://java.sun.com/jsp/jstl/core"#uri="jakarta.tags.core"#' src/main/webapp/report.jsp
JDK 17: [INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
JDK 21: [INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
$ unzip -l target/thuvien.war | grep "WEB-INF/lib/." | awk '{print $4}'
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.2.jar
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar
WEB-INF/lib/mysql-connector-j-26.10.0.jar
WEB-INF/lib/protobuf-java-4.36.1.jar
WEB-INF/lib/reload4j-1.2.27.jar
WEB-INF/lib/commons-lang-2.6.jar
$ bash tools/golden.sh /tmp/g10c && diff -r golden /tmp/g10c && echo "GIONG HET (ch7 Tomcat 10.1)"
GIONG HET (ch7 Tomcat 10.1)
# cùng WAR trên tomcat:10.1-jdk21-temurin (JVM Version: 21.0.13.1+2-LTS):
GIONG HET (Tomcat 10.1 / JDK 21)
$ mvn -B -f e2e/pom.xml test           # module e2e của Chương 3 (Testcontainers 2.0.5) — KHÔNG sửa dòng nào
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 103.4 s -- in com.thuvien.e2e.MuonSachQuaHttpTest
[INFO] BUILD SUCCESS
`);
const O75_JAVAEE = out(`
# WAR javax (mốc 2) thả vào webapps/ của Tomcat 10.1 — kiểu "deploy nhầm" khi lùi bản
... Deployment of web application archive [/usr/local/tomcat/webapps/thuvien.war] has finished in [487] ms
GET /thuvien/login => 500
... SEVERE ... Allocate exception for servlet [LoginServlet]
	java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet
# cùng WAR đó thả vào webapps-javaee/ — Tomcat tự chuyển javax → jakarta khi deploy
... with Jakarta EE specification profile [TOMCAT]
... org.apache.tomcat.jakartaee.Migration.migrateStream Migration finished for archive [WEB-INF/lib/jstl-1.2.jar]
... org.apache.tomcat.jakartaee.Migration.migrateStream Migration finished for archive [WEB-INF/lib/mysql-connector-j-26.10.0.jar]
GET /thuvien/login => 200
GIONG HET (webapps-javaee)
`);
const O75_LOG = out(`
$ git log --oneline ch6..ch7
5014ca7 docs(7.5): NANG-CAP.md — 3 moc, viec cua van hanh, viec cua lap trinh vien, rui ro con lai
2931fa6 build(7.5): moc 3 — Tomcat 10.1 + jakarta (OpenRewrite JakartaEE10 qua dryRun -> git apply, roi sua 4 cho)
f449d8f refactor(7.1): dung tinh nang Java 17 — record KetQua/KhoangMuon, switch mui ten, instanceof mau, HexFormat
c628b9c build(7.1): moc 2 — release 17 + enforcer requireJavaVersion [17,)
b932292 build(7.1): moc 1 — dung bang JDK 17, chay Tomcat 9.0.124 tren JDK 17 (bytecode van release 8)
290b146 fix(7.1): TokenUtil bo javax.xml.bind.DatatypeConverter (go khoi JDK 11, JEP 320) — tu in hex
b9292ac build(7.1): compiler 3.1 -> 3.13.0 (release=8), war 2.2 -> 3.4.0, surefire 3.5.2, sourceEncoding UTF-8
`);
const C75_NANGCAP = out(`
# Ghi chú nâng cấp — thuvien 1.0 (Chương 7, 24/11/2026)
Java 8 + Tomcat 9 (javax)  ⇒  Java 17 + Tomcat 10.1 (jakarta, Jakarta EE 10). Ba mốc, mỗi mốc một PR, test xanh sau từng commit.

| Mốc | PR     | Thay đổi                                                          | Bằng chứng |
| 1   | build  | compiler 3.13.0, war 3.4.0, surefire 3.5.2, release 8; bỏ javax.xml.bind | 49 test JDK 8/17/21; golden master giống hệt trên Tomcat 9 + JDK 17 |
| 2   | java17 | release 17 + enforcer [17,); record/switch/instanceof/HexFormat (commit riêng) | 49 test JDK 17/21; golden master giống hệt |
| 3   | jakarta| OpenRewrite JakartaEE10 (dryRun → đọc patch → apply) + 4 chỗ sửa tay; Tomcat 10.1.62 | 49 test; golden master (JDK 17 và 21); e2e 3/3, 0 dòng đổi |

## Việc của người chạy hệ thống
- Máy chủ cần JDK 17+ và Tomcat 10.1+. WAR mới KHÔNG chạy trên Tomcat 9 (javax) và JDK 8 (UnsupportedClassVersionError … 61.0).
- WAR cũ (javax) thả vào webapps/ của Tomcat 10 vẫn báo "Deployment … finished" nhưng mọi request 500
  (ClassNotFoundException: javax.servlet.http.HttpServlet). Cần quay lại tạm: thả WAR cũ vào webapps-javaee/ (Tomcat tự chuyển).
- Cấu hình DB, URL, cổng: không đổi.
## Việc của lập trình viên
- Máy dev: JDK 17 (Maven chặn JDK cũ bằng enforcer). IDE đặt Project SDK = 17.
- JSP dùng thẻ c: viết uri="jakarta.tags.core".
## Rủi ro còn lại / việc để sau
- error.jsp vẫn in stack trace ra trang (CWE-209) — thấy rõ khi trang báo cáo vỡ trong lúc thử; ticket riêng.
- Tiền/ngày theo Locale: JDK 9+ dùng CLDR ("18.000 ₫" thay "18.000 đ"). Mã hiện tại tự định dạng nên không đổi.
- JDK 21 chạy được (đã thử), chưa đặt làm chuẩn. JDK 25 là LTS mới nhất (9/2025) — mốc kế.
- commons-lang 2.6 (2011) còn dùng — nên chuyển commons-lang3.
`);

const L75 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Lab' : 'Chương 7 · Lab'}</span>
<h2>${en ? '7.5 — Lab: Upgrade the legacy app to Java 17 and Tomcat 10 (jakarta) with green tests' : '7.5 — Lab: Nâng ứng dụng cũ lên Java 17 và Tomcat 10 (jakarta), test vẫn xanh'}</h2>
<p class="lead">${en
  ? 'Ticket <strong>LIB-115</strong>, from the customer’s IT department: “Our hosting provider removes Java 8 and Tomcat 9 images at the end of Q1. Move the library system to Java 17 and Tomcat 10.1. No functional changes. Send us upgrade notes for operations.” This lab puts lessons 7.1 and 7.3 together into three milestones and one document — exactly what you would deliver on a real maintenance contract.'
  : 'Ticket <strong>LIB-115</strong> từ phòng IT của khách: "Nhà cung cấp hosting bỏ ảnh Java 8 và Tomcat 9 vào cuối quý 1. Chuyển hệ thống thư viện lên Java 17 và Tomcat 10.1. Không đổi chức năng. Gửi ghi chú nâng cấp cho bộ phận vận hành." Lab này ghép bài 7.1 và 7.3 thành ba mốc và một tài liệu — đúng thứ bạn sẽ bàn giao trong một hợp đồng bảo trì thật.'}</p>
${moiTruong(en)}

<h3>${en ? 'Rules (“done when”)' : 'Luật chơi ("Đạt khi")'}</h3>
<ul>
<li>${en ? 'Start from branch <code>ch6</code> (49 tests). One milestone = one PR; every commit green (<code>mvn -B clean test</code> on JDK 17; milestone 1 also on JDK 8).' : 'Xuất phát từ nhánh <code>ch6</code> (49 test). Một mốc = một PR; commit nào cũng xanh (<code>mvn -B clean test</code> trên JDK 17; mốc 1 kiểm cả JDK 8).'}</li>
<li>${en ? 'Golden master of Chapter 3 byte-identical after each milestone, on the real server of that milestone.' : 'Golden master của Chương 3 giống hệt từng byte sau mỗi mốc, trên đúng máy chủ của mốc đó.'}</li>
<li>${en ? 'The e2e module of lesson 3.4 passes against the final image with <strong>zero</strong> changed lines.' : 'Module e2e của bài 3.4 qua trên ảnh cuối cùng với <strong>không</strong> dòng nào bị sửa.'}</li>
<li>${en ? '<code>WEB-INF/lib</code> contains no servlet/EL API jar. Machine-generated changes and your fixes are distinguishable in history.' : '<code>WEB-INF/lib</code> không chứa jar servlet/EL API. Thay đổi do máy sinh và chỗ bạn sửa phải phân biệt được trong lịch sử.'}</li>
<li>${en ? '<code>NANG-CAP.md</code>: milestones with evidence, what operations must do, what developers must do, remaining risks.' : '<code>NANG-CAP.md</code>: các mốc kèm bằng chứng, việc của vận hành, việc của lập trình viên, rủi ro còn lại.'}</li>
</ul>

<h3>${en ? 'Milestones 1–2' : 'Mốc 1–2'}</h3>
<p>${en
  ? 'Exactly lesson 7.1: modern plugins with <code>release 8</code>, drop <code>javax.xml.bind</code>, run Tomcat 9 on JDK 17 (PR 1); then <code>release 17</code> + enforcer and, in a separate commit, the language features (PR 2). Try it without looking; if stuck, the lesson has every output.'
  : 'Đúng bài 7.1: plugin mới với <code>release 8</code>, bỏ <code>javax.xml.bind</code>, chạy Tomcat 9 trên JDK 17 (PR 1); rồi <code>release 17</code> + enforcer và, trong commit riêng, các tính năng ngôn ngữ (PR 2). Thử tự làm không nhìn; kẹt thì bài 7.1 có đủ mọi output.'}</p>

<h3>${en ? 'Milestone 3: jakarta — first attempt' : 'Mốc 3: jakarta — lần thử đầu'}</h3>
<p>${en
  ? 'Run <code>dryRunNoFork</code> with <code>org.openrewrite.java.migrate.jakarta.JakartaEE10</code>, read <code>target/rewrite/rewrite.patch</code>, <code>git apply</code> it, switch the Dockerfile to <code>tomcat:10.1-jdk17-temurin</code>. What the course got on the first attempt:'
  : 'Chạy <code>dryRunNoFork</code> với <code>org.openrewrite.java.migrate.jakarta.JakartaEE10</code>, đọc <code>target/rewrite/rewrite.patch</code>, <code>git apply</code>, đổi Dockerfile sang <code>tomcat:10.1-jdk17-temurin</code>. Thứ khoá học nhận được ở lần thử đầu:'}</p>
${O75_VO}
<p>${en
  ? 'This is the whole chapter in one screen. Compiles: yes. 49 tests: green. Deploys: “finished in 499 ms”. Books and readers pages: identical. And the overdue report — the page the librarians open every morning — is dead, because JSTL 1.2 is compiled against <code>javax.servlet.jsp.tagext</code>, and the tests never render a JSP. Only the golden master, which asks the real Tomcat for the real page, saw it. (Notice also that the error page prints a stack trace to the user — CWE-209 from lesson 6.3 is still in <code>error.jsp</code>. Write it down as a remaining risk; do not fix it in an upgrade PR.)'
  : 'Đây là cả chương trong một màn hình. Biên dịch: được. 49 test: xanh. Deploy: "finished in 499 ms". Trang sách và độc giả: giống hệt. Còn báo cáo quá hạn — trang thủ thư mở mỗi sáng — chết, vì JSTL 1.2 được biên dịch theo <code>javax.servlet.jsp.tagext</code>, mà test không bao giờ dựng một trang JSP. Chỉ golden master, thứ hỏi Tomcat thật đúng trang thật, mới thấy. (Để ý luôn: trang lỗi in stack trace cho người dùng — CWE-209 của bài 6.3 vẫn còn trong <code>error.jsp</code>. Ghi vào rủi ro còn lại; đừng sửa trong PR nâng cấp.)'}</p>

<h3>${en ? 'Milestone 3: the four fixes' : 'Mốc 3: bốn chỗ sửa'}</h3>
${C75_POM}
${O75_XANH}
<p>${en
  ? 'Jakarta Tags 3.0 is the jakarta version of JSTL; it still accepts the old URI, but the new short form <code>jakarta.tags.core</code> says clearly which world the page belongs to. Excluding <code>jakarta.el-api</code> keeps one EL implementation in the JVM (Tomcat’s). Then the strongest evidence of the chapter: the e2e module written in Chapter 3 against Java 8 and Tomcat 9 builds the image from the repo’s own Dockerfile, runs it next to MySQL, and passes — unchanged — against Java 17 and Tomcat 10.1.'
  : 'Jakarta Tags 3.0 là bản jakarta của JSTL; nó vẫn nhận URI cũ, nhưng dạng ngắn mới <code>jakarta.tags.core</code> nói rõ trang thuộc thế giới nào. Loại <code>jakarta.el-api</code> để trong JVM chỉ có một bản cài đặt EL (của Tomcat). Rồi tới bằng chứng mạnh nhất của chương: module e2e viết ở Chương 3 khi còn Java 8 và Tomcat 9 dựng ảnh từ chính Dockerfile của repo, chạy cạnh MySQL, và qua — không sửa gì — trên Java 17 và Tomcat 10.1.'}</p>

<h3>${en ? 'The rollback plan operations will ask about' : 'Kế hoạch lùi mà vận hành sẽ hỏi'}</h3>
${O75_JAVAEE}
<p>${en
  ? 'Two facts for the upgrade notes. A javax WAR in Tomcat 10’s <code>webapps/</code> looks deployed and fails every request — monitoring that only checks “deployment finished” will not notice. And Tomcat 10 ships the Apache Tomcat migration tool for Jakarta EE: a WAR placed in <code>webapps-javaee/</code> is converted at deploy time. That makes a safe emergency rollback (old WAR on the new server) — not a permanent home, because the conversion runs again on every deploy and your sources stay javax.'
  : 'Hai sự thật cho ghi chú nâng cấp. WAR javax trong <code>webapps/</code> của Tomcat 10 trông như đã deploy mà request nào cũng hỏng — giám sát chỉ kiểm "deployment finished" sẽ không phát hiện. Và Tomcat 10 đi kèm công cụ chuyển đổi Jakarta EE của Apache Tomcat: WAR đặt trong <code>webapps-javaee/</code> được chuyển lúc deploy. Đó là đường lùi khẩn cấp an toàn (WAR cũ trên máy chủ mới) — không phải chỗ ở lâu dài, vì lần deploy nào cũng chuyển lại và mã nguồn của bạn vẫn là javax.'}</p>

<h3>${en ? 'Deliverable: the history and the notes' : 'Bàn giao: lịch sử và ghi chú'}</h3>
${O75_LOG}
${C75_NANGCAP}

<h3>${en ? 'Part B (optional): the Node API' : 'Phần B (tuỳ chọn): API Node'}</h3>
<p>${en
  ? 'Same rules on <code>legacy-express</code>: three commits from lesson 7.4 (loosen the V8-message test on Node 14; Node 24 + lockfile v3; Jest 30 with a reviewed snapshot update), 21 tests on Node 22, 24 and 26, and four lines added to the upgrade notes (Node version for the server and CI, lockfile v3, npm audit before/after, Express 5 left for later with the grep result).'
  : 'Cùng luật trên <code>legacy-express</code>: ba commit của bài 7.4 (nới test câu lỗi V8 khi còn Node 14; Node 24 + lockfile v3; Jest 30 kèm cập nhật snapshot đã đọc diff), 21 test trên Node 22, 24 và 26, và bốn dòng thêm vào ghi chú nâng cấp (bản Node cho máy chủ và CI, lockfile v3, npm audit trước/sau, Express 5 để sau kèm kết quả grep).'}</p>

${giai(en ? '🔑 Model solution and PR descriptions (open after you try)' : '🔑 Lời giải mẫu và mô tả PR (mở sau khi đã thử)', `
<p>${en ? 'Patches: <code>lab/loi-giai/ch7/java/ch7/</code> (7 commits, apply with <code>git am</code> on <code>ch6</code>), the raw-machine-output variant <code>java/ch7-rewrite/</code>, Node <code>node/ch7/</code> (3 commits). PR 3 description:' : 'Patch: <code>lab/loi-giai/ch7/java/ch7/</code> (7 commit, áp bằng <code>git am</code> lên <code>ch6</code>), bản giữ nguyên output máy ở <code>java/ch7-rewrite/</code>, Node <code>node/ch7/</code> (3 commit). Mô tả PR 3:'}</p>
${out(`
[LIB-115] Mốc 3/3 — Tomcat 10.1 + Jakarta EE 10
Thay đổi
- OpenRewrite JakartaEE10 (rewrite-migrate-java 3.42.1, dryRunNoFork): javax.servlet → jakarta.servlet ở 4 servlet + 6 test, web.xml 6.0.
- Sửa tay: servlet-api scope compile → provided; JSTL 1.2 → Jakarta Tags 3.0 (loại el-api); report.jsp uri jakarta.tags.core;
  Dockerfile tomcat:10.1-jdk17-temurin.
Vì sao cần sửa tay: lần thử đầu, trang /report lỗi NoClassDefFoundError javax/servlet/jsp/tagext/TagLibraryValidator (test vẫn xanh).
Kiểm: 49 test (JDK 17, 21); golden master 3 trang giống hệt (Tomcat 10.1.62 trên JDK 17 và 21); e2e 3/3 không sửa dòng nào.
Triển khai / lùi: xem NANG-CAP.md (WAR cũ → webapps-javaee/ nếu cần lùi khẩn cấp).
Ngoài phạm vi (ticket riêng): error.jsp in stack trace (CWE-209); commons-lang 2.6.
`)}
<p><strong>${en ? 'Grading (10 points)' : 'Thang chấm (10 điểm)'}</strong></p>
<table>
<tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr>
<tr><td>${en ? 'Three milestones, every commit green, machine output and fixes in separate commits' : 'Ba mốc, commit nào cũng xanh, output máy và chỗ sửa ở commit riêng'}</td><td>3</td></tr>
<tr><td>${en ? 'Golden master identical after each milestone; the broken report found and explained' : 'Golden master giống hệt sau mỗi mốc; tìm ra và giải thích được trang báo cáo vỡ'}</td><td>2</td></tr>
<tr><td>${en ? 'e2e unchanged and green; WEB-INF/lib clean' : 'e2e không sửa mà xanh; WEB-INF/lib sạch'}</td><td>2</td></tr>
<tr><td>${en ? 'NANG-CAP.md usable by operations (versions, rollback, what not to do)' : 'NANG-CAP.md vận hành đọc là làm được (phiên bản, đường lùi, điều không được làm)'}</td><td>2</td></tr>
<tr><td>${en ? 'Remaining risks listed instead of fixed in the upgrade PR' : 'Rủi ro còn lại được liệt kê thay vì sửa lẫn vào PR nâng cấp'}</td><td>1</td></tr>
</table>
`)}

<h3>💼 ${en ? 'OJT situation: “the customer only wants one PR”' : 'Tình huống OJT: "khách chỉ muốn một PR"'}</h3>
<p>${en
  ? 'Some customers review only what goes to production and ask for one PR. You can still keep the milestones: three commits in one PR, each green, with the PR description listing them and their evidence — and you can still deploy milestone 1 to staging on its own. The point of milestones is that a failure has one cause and a rollback has one size, not the number of PRs.'
  : 'Có khách chỉ review thứ lên production và muốn một PR. Bạn vẫn giữ được các mốc: ba commit trong một PR, commit nào cũng xanh, mô tả PR liệt kê từng mốc kèm bằng chứng — và vẫn đưa riêng mốc 1 lên staging được. Ý nghĩa của mốc là mỗi lỗi có một nguyên nhân và mỗi lần lùi có một kích cỡ, không phải số lượng PR.'}</p>

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Green tests and a successful deploy did not mean a working app: one JSP page was dead. Test the real page on the real server.' : 'Test xanh và deploy thành công không có nghĩa ứng dụng chạy: một trang JSP đã chết. Kiểm đúng trang thật trên máy chủ thật.'}</li>
<li>${en ? 'Black-box tests written before the upgrade survive it unchanged — that is what makes them the strongest evidence.' : 'Test hộp đen viết trước khi nâng sống sót qua cuộc nâng mà không đổi dòng nào — đó là lý do chúng là bằng chứng mạnh nhất.'}</li>
<li>${en ? 'The upgrade notes are part of the deliverable: versions, rollback path, developer changes, remaining risks.' : 'Ghi chú nâng cấp là một phần của sản phẩm bàn giao: phiên bản, đường lùi, thay đổi cho lập trình viên, rủi ro còn lại.'}</li>
</ul>
${tl('https://tomcat.apache.org/migration-10.1.html', '🐱', 'Apache Tomcat — Migration Guide 10.1', en ? 'javax → jakarta, webapps-javaee, removed features' : 'javax → jakarta, webapps-javaee, tính năng bị gỡ')}
${tl('https://github.com/apache/tomcat-jakartaee-migration', '🐱', 'Apache Tomcat migration tool for Jakarta EE', en ? 'The converter behind webapps-javaee' : 'Bộ chuyển đổi đứng sau webapps-javaee')}
${lk(bai('doc-code-cu-va-refactor', 'lgc-3-4-test-qua-http'), '🧪', en ? '3.4 — testing through HTTP with Testcontainers' : '3.4 — test qua HTTP với Testcontainers', en ? 'The e2e module that survived the upgrade' : 'Module e2e đã sống sót qua cuộc nâng cấp')}
`);

/* ═══════════════════ 7.6 — Quiz ═══════════════════ */
const dat = (q, viTri) => { const o = [...q.options]; const [d] = o.splice(q.correctIndex, 1); o.splice(viTri, 0, d); return { ...q, options: o, correctIndex: viTri }; };

const QUIZ7_GOC = [
  Q('With maven.compiler.release=8, the project builds on JDK 17 but 7 tests fail with NoClassDefFoundError javax/xml/bind/DatatypeConverter. Why?|||Với maven.compiler.release=8, dự án build được trên JDK 17 nhưng 7 test lỗi NoClassDefFoundError javax/xml/bind/DatatypeConverter. Vì sao?', [
    'release 8 compiles against the Java 8 API (which has JAXB), but the tests run on a Java 17 JVM where the module was removed in JDK 11|||release 8 biên dịch theo API Java 8 (có JAXB), nhưng test chạy trên JVM Java 17, nơi module đó đã bị gỡ từ JDK 11',
    'The Maven cache is corrupt|||Bộ nhớ đệm Maven bị hỏng',
    'release 8 is not supported on JDK 17|||JDK 17 không hỗ trợ release 8',
    'JAXB needs --add-opens|||JAXB cần --add-opens',
  ], 0, 'EN: Builder, target API and runtime are three different things.|||VI: JDK build, API đích và runtime là ba thứ khác nhau.'),
  Q('A teammate builds with JDK 8 although the POM says release 17, and gets BUILD SUCCESS. What happened?|||Một đồng đội build bằng JDK 8 dù POM ghi release 17, và nhận BUILD SUCCESS. Chuyện gì xảy ra?', [
    'JDK 8 cross-compiled to Java 17 bytecode|||JDK 8 biên dịch chéo ra bytecode Java 17',
    'The release flag was silently ignored and the classes are Java 8 bytecode (major version 52); an enforcer rule prevents this|||Cờ release bị lặng lẽ bỏ qua và class là bytecode Java 8 (major version 52); luật enforcer chặn được chuyện này',
    'Maven downloaded JDK 17 automatically|||Maven tự tải JDK 17',
    'Nothing — release only affects warnings|||Không có gì — release chỉ ảnh hưởng cảnh báo',
  ], 1, 'EN: Measured with javap: major version 52. requireJavaVersion [17,) turns it into a clear error.|||VI: Đo bằng javap: major version 52. requireJavaVersion [17,) biến nó thành lỗi rõ ràng.'),
  Q('Old code using setAccessible on java.util.ArrayList works on JDK 11 with a warning and fails on 17. Best first fix?|||Mã cũ dùng setAccessible trên java.util.ArrayList chạy trên JDK 11 kèm cảnh báo và chết trên 17. Cách sửa đầu tiên tốt nhất?', [
    'Add --illegal-access=permit|||Thêm --illegal-access=permit',
    'Stay on JDK 11|||Ở lại JDK 11',
    'Upgrade the library that does it; if no fix exists yet, add the narrowest --add-opens and document it with a ticket to remove|||Nâng thư viện đang làm việc đó; nếu chưa có bản sửa, thêm --add-opens hẹp nhất và ghi lại kèm ticket gỡ',
    'Open every package of java.base to ALL-UNNAMED|||Mở mọi gói của java.base cho ALL-UNNAMED',
  ], 2, 'EN: --illegal-access was removed in 17 (the JVM ignores it). --add-opens is a documented debt.|||VI: --illegal-access bị gỡ ở 17 (JVM lờ đi). --add-opens là một khoản nợ có ghi chép.'),
  Q('After moving from JDK 8 to 17, invoices show “18.000 ₫” instead of “18.000 đ”. No test failed. Cause?|||Sau khi chuyển JDK 8 lên 17, hoá đơn hiện "18.000 ₫" thay vì "18.000 đ". Không test nào đỏ. Nguyên nhân?', [
    'The database collation changed|||Collation của CSDL đổi',
    'UTF-8 became the default charset|||UTF-8 thành bảng mã mặc định',
    'A bug in JDK 17|||Lỗi của JDK 17',
    'JDK 9+ uses CLDR locale data by default (JEP 252); NumberFormat output changed|||JDK 9+ mặc định dùng dữ liệu locale CLDR (JEP 252); output của NumberFormat đổi',
  ], 3, 'EN: COMPAT restores it on 17, warns on 21, is removed on 23+. Pin money/date output with tests.|||VI: COMPAT trả lại chữ cũ trên 17, cảnh báo trên 21, mất từ 23. Khoá output tiền/ngày bằng test.'),
  Q('Which order follows the Spring Boot 3 migration guide?|||Thứ tự nào đúng theo hướng dẫn di trú Spring Boot 3?', [
    '2.x → 3.0 directly, then fix compile errors|||2.x → 3.0 thẳng, rồi sửa lỗi biên dịch',
    '2.7 (+ properties migrator, no deprecations, Security 5.8 style) → Java 17 → 3.0 → latest 3.x → remove migrator|||2.7 (+ properties migrator, sạch deprecation, kiểu Security 5.8) → Java 17 → 3.0 → 3.x mới nhất → gỡ migrator',
    'Java 21 → 3.5 → 2.7|||Java 21 → 3.5 → 2.7',
    'Rewrite the app on Boot 3|||Viết lại ứng dụng trên Boot 3',
  ], 1, 'EN: Bridge releases exist so you fix most things while the old version still runs.|||VI: Bản làm cầu tồn tại để bạn sửa phần lớn khi bản cũ vẫn còn chạy.'),
  Q('Boot 2.5 → 2.7: the migrator reports spring.datasource.initialization-mode as no longer supported, yet all tests (H2) pass. Risk?|||Boot 2.5 → 2.7: migrator báo spring.datasource.initialization-mode không còn hỗ trợ, nhưng mọi test (H2) qua. Rủi ro?', [
    'None — tests pass|||Không có — test qua rồi',
    'H2 becomes the production database|||H2 thành CSDL production',
    'On a non-embedded database (MySQL) data.sql would silently stop loading; use spring.sql.init.mode|||Trên CSDL không nhúng (MySQL), data.sql sẽ lặng lẽ thôi không được nạp; dùng spring.sql.init.mode',
    'The app will not start|||Ứng dụng không khởi động được',
  ], 2, 'EN: Ignored properties do not fail anything — that is why the migrator exists.|||VI: Property bị lờ đi không làm hỏng gì cả — vì thế mới có migrator.'),
  Q('After Boot 3.0, the test for GET /api/sach/ (trailing slash) fails with 404. The mobile app calls that URL. Good decision?|||Sau Boot 3.0, test GET /api/sach/ (dấu gạch cuối) đỏ với 404. App di động đang gọi URL đó. Quyết định tốt?', [
    'Delete the test|||Xoá test',
    'Map both paths explicitly for that endpoint, document it, open a ticket to fix the client|||Gắn tường minh cả hai đường cho endpoint đó, ghi lại, mở ticket sửa phía client',
    'Downgrade to Boot 2.7 permanently|||Lùi hẳn về Boot 2.7',
    'Re-enable trailing-slash matching globally|||Bật lại khớp dấu gạch cuối cho toàn ứng dụng',
  ], 1, 'EN: Spring 6 dropped it on purpose; keep the old behaviour only where a known client needs it.|||VI: Spring 6 bỏ có chủ đích; chỉ giữ hành vi cũ ở chỗ có client đã biết cần nó.'),
  Q('Why did the HTTP golden master catch the empty 401 body when MockMvc tests did not?|||Vì sao golden master qua HTTP bắt được thân 401 rỗng còn test MockMvc thì không?', [
    'MockMvc does not run the servlet container’s error dispatch to /error|||MockMvc không chạy error dispatch tới /error của servlet container',
    'MockMvc ignores security|||MockMvc bỏ qua bảo mật',
    'curl is more accurate|||curl chính xác hơn',
    'The tests were written wrongly|||Test viết sai',
  ], 0, 'EN: Since Boot 2.6 /error also goes through Spring Security; only a real container shows the body.|||VI: Từ Boot 2.6, /error cũng đi qua Spring Security; chỉ container thật mới cho thấy thân.'),
  Q('OpenRewrite’s Boot 3.5 recipe produced InMemoryUserDetailsManager(User.builder().username("admin").build()). What protected you?|||Recipe Boot 3.5 của OpenRewrite sinh ra InMemoryUserDetailsManager(User.builder().username("admin").build()). Thứ gì bảo vệ bạn?', [
    'The compiler|||Trình biên dịch',
    'OpenRewrite’s own validation|||Bước kiểm tra của chính OpenRewrite',
    'The characterization tests: the context failed to start and all 8 went red; the 403/204 tests would catch lost roles|||Characterization test: context không lên và cả 8 đỏ; test 403/204 sẽ bắt được nếu chỉ mất vai trò',
    'Nothing; it reached production|||Không gì cả; nó lên production',
  ], 2, 'EN: Read machine diffs like a stranger’s PR; security config first.|||VI: Đọc diff máy sinh như PR của người lạ; cấu hình bảo mật trước tiên.'),
  Q('After the jakarta migration: 49 tests green, deploy “finished”, but /report shows NoClassDefFoundError javax/servlet/jsp/tagext/TagLibraryValidator. Fix?|||Sau di trú jakarta: 49 test xanh, deploy "finished", nhưng /report hiện NoClassDefFoundError javax/servlet/jsp/tagext/TagLibraryValidator. Cách sửa?', [
    'Add javax.servlet-api to WEB-INF/lib|||Thêm javax.servlet-api vào WEB-INF/lib',
    'Replace JSTL 1.2 with Jakarta Tags 3.0 (API + implementation) and use uri="jakarta.tags.core"|||Thay JSTL 1.2 bằng Jakarta Tags 3.0 (API + bản cài đặt) và dùng uri="jakarta.tags.core"',
    'Go back to Tomcat 9|||Quay về Tomcat 9',
    'Precompile the JSPs|||Biên dịch trước các JSP',
  ], 1, 'EN: JSTL 1.2 is built against javax; tests never render JSPs, the golden master does.|||VI: JSTL 1.2 dựng theo javax; test không bao giờ dựng JSP, golden master thì có.'),
  Q('Node 14 → 24: npm install rewrites package-lock.json (4,793 lines). The next day CI on Node 14 fails with “Cannot read property ‘express’ of undefined”. Why?|||Node 14 → 24: npm install viết lại package-lock.json (4.793 dòng). Hôm sau CI chạy Node 14 lỗi "Cannot read property \'express\' of undefined". Vì sao?', [
    'Express was removed from npm|||Express bị gỡ khỏi npm',
    'The lockfile is corrupt; delete it|||Lockfile hỏng; xoá đi',
    'Node 14 does not support Express 4|||Node 14 không hỗ trợ Express 4',
    'npm 9+ writes lockfile v3, which npm 6 cannot read — CI and Docker must move in the same PR|||npm 9+ ghi lockfile v3, npm 6 không đọc được — CI và Docker phải đổi trong cùng PR',
  ], 3, 'EN: A lockfile format change is a one-way door, like a class file version.|||VI: Đổi định dạng lockfile là cửa một chiều, như phiên bản tệp class.'),
  Q('An old React build fails on Node 18 with ERR_OSSL_EVP_UNSUPPORTED. Best plan?|||Bản build React cũ lỗi ERR_OSSL_EVP_UNSUPPORTED trên Node 18. Kế hoạch tốt nhất?', [
    'Use --openssl-legacy-provider temporarily, document it, and upgrade the bundler (webpack 4 hashes with MD4)|||Tạm dùng --openssl-legacy-provider, ghi lại, và nâng bundler (webpack 4 băm bằng MD4)',
    'Stay on Node 16 forever|||Ở lại Node 16 mãi',
    'Disable OpenSSL|||Tắt OpenSSL',
    'Delete node_modules and retry|||Xoá node_modules rồi thử lại',
  ], 0, 'EN: OpenSSL 3 (Node 17+) moved MD4 to the legacy provider.|||VI: OpenSSL 3 (Node 17+) dời MD4 vào legacy provider.'),
];
const VI_TRI7 = [0, 1, 2, 3, 1, 2, 1, 0, 2, 1, 3, 0];
const QUIZ7 = QUIZ7_GOC.map((q, i) => dat(q, VI_TRI7[i]));

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 7 · Quiz' : 'Chương 7 · Kiểm tra'}</span>
<h2>${en ? '7.6 — Chapter 7 quiz' : '7.6 — Kiểm tra Chương 7'}</h2>
<p>${en
  ? 'Twelve questions on upgrade order, javax/jakarta, OpenRewrite and the Node runtime (OpenSSL 3, lockfile v3). 15 minutes. Every question comes from an output that actually appeared in this chapter’s labs.'
  : 'Mười hai câu về thứ tự nâng, javax/jakarta, OpenRewrite và runtime Node (OpenSSL 3, lockfile v3). 15 phút. Câu nào cũng lấy từ một output đã thật sự xuất hiện trong các lab của chương.'}</p>
`);

export default {
  title: 'Chapter 7 — Upgrading safely: Java, Spring Boot and Node|||Chương 7 — Nâng cấp phiên bản an toàn: Java, Spring Boot và Node',
  lessons: [
    { title: '7.1 — Java 8 → 17/21: removed APIs, modules, reflective access, new language features|||7.1 — Java 8 → 17/21: API bị gỡ, module, truy cập phản chiếu, tính năng ngôn ngữ mới', slug: 'lgc-7-1-java-8-17', type: 'LESSON', isFreePreview: true, description: 'Năm commit xanh đưa lab từ Java 8 lên 17: jdeps kiểm kê, bẫy class cũ trong target/, release 8 trên JDK 17 biên dịch được mà chạy NoClassDefFound, JDK 8 lờ cờ release 17 (enforcer), Tomcat tự thêm --add-opens; phản chiếu trên 8/11/17/21, Lombok cũ chết lúc biên dịch, CLDR đổi "đ" thành "₫"; record và switch mũi tên trong commit riêng; Spring4Shell 2022.', content: L71 },
    { title: '7.2 — Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator|||7.2 — Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator', slug: 'lgc-7-2-spring-boot-3', type: 'LESSON', isFreePreview: true, description: 'Repo lab mới legacy-spring-api (Boot 2.5, Java 8) đi qua từng hòn đá: 2.7 với properties migrator (data.sql lặng lẽ thôi nạp trên MySQL), Security 5.8, Java 17, 3.0 (17 lỗi javax/@ConstructorBinding, dấu "/" cuối 200 thành 404), 3.5; golden master qua HTTP bắt thân 401 rỗng mà MockMvc không thấy; thử Boot 4.1.3.', content: L72 },
    { title: '7.3 — Automating migrations with OpenRewrite recipes|||7.3 — Tự động hoá di trú bằng recipe OpenRewrite', slug: 'lgc-7-3-openrewrite', type: 'LESSON', isFreePreview: true, description: 'Recipe UpgradeSpringBoot_3_5 dịch chuỗi bộ lọc rất tốt nhưng làm mất người dùng in-memory (8/8 test đỏ); JakartaEE10 trên ứng dụng JSP: run vấp biên dịch nên dùng runNoFork/dryRun, servlet-api thành compile, jakarta.xml.bind thiếu thư viện, JSTL 1.2 không đổi; quy trình an toàn và so sánh với để AI tự sửa.', content: L73 },
    { title: '7.4 — Node 14 → 20/22: CommonJS vs ESM, OpenSSL 3, removed APIs, lockfile v3|||7.4 — Node 14 → 20/22: CommonJS và ESM, OpenSSL 3, API bị gỡ, lockfile v3', slug: 'lgc-7-4-node', type: 'LESSON', isFreePreview: true, description: 'Lịch Node 11/2026 (20 đã hết hạn, đích 24); ma trận 14–26 trên cùng commit; test khoá câu lỗi V8 đỏ từ Node 16; lockfile v1 thành v3 mà npm 6 không đọc được; MD4 và ERR_OSSL_EVP_UNSUPPORTED; require(esm) chạy từ 20.19/22.12 nhưng Jest 26 vẫn vỡ; Jest 30 với snapshot đã đọc diff; Express 5 qua 21 test, demo route vỡ.', content: L74 },
    { title: '7.5 — Lab: Upgrade the legacy app to Java 17 and Tomcat 10 (jakarta) with green tests|||7.5 — Lab: Nâng ứng dụng cũ lên Java 17 và Tomcat 10 (jakarta), test vẫn xanh', slug: 'lgc-7-5-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-115: ba mốc, bảy commit xanh; lần thử đầu trên Tomcat 10.1 thì test xanh, deploy xong mà trang báo cáo chết vì JSTL 1.2 — chỉ golden master thấy; bốn chỗ sửa, e2e Testcontainers của Chương 3 qua không đổi dòng nào; đường lùi webapps-javaee; NANG-CAP.md; phần Node tuỳ chọn; mô tả PR mẫu và thang chấm 10 điểm.', content: L75 },
    { title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7', slug: 'lgc-7-6-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu: release và runtime, JDK 8 lờ cờ release, --add-opens, CLDR, thứ tự nâng Boot, property bị lờ, dấu gạch cuối, 401 rỗng, recipe làm mất người dùng, JSTL trên Tomcat 10, lockfile v3, OpenSSL 3.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ7 } },
  ],
};
