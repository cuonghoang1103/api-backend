/**
 * 2.2 — Java: NPE, chuỗi "Caused by", bức tường chữ của Spring (soạn 22/11/2026).
 * Output chạy THẬT: /tmp/dbg-lab/muc0/DonHang.java, /tmp/dbg-lab/ch2/2-2b/Npe.java (OpenJDK 21.0.9) và một ứng dụng Spring Framework
 * 6.2.11 tối giản (AnnotationConfigApplicationContext, jar từ ~/.m2) ở /tmp/dbg-lab/ch2/2-2 — spring1.txt (bean ném NumberFormatException),
 * spring2.txt (thiếu bean PhongRepository). Trace Spring chép NGUYÊN từ tệp (giữ tab), chỉ cắt khối "at org.springframework…" ở spring2.
 * Không chạy được Hibernate/Spring Boot đầy đủ ở đây ⇒ LazyInitializationException/ConstraintViolationException chỉ mô tả, không in output.
 */
import { nguon } from '../_chung.mjs';

const OUT_NPE = `<div class="out">$ java DonHang.java
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "&lt;local1&gt;.khach.diaChi" is null
	at DonHang.main(DonHang.java:7)
$ javac -g -d out DonHang.java &amp;&amp; java -cp out DonHang
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "don.khach.diaChi" is null
	at DonHang.main(DonHang.java:7)</div>`;

const MA_NPE2 = `<pre><code class="language-java">import java.util.Map;

public class Npe {
    record KhachHang(String ten, String email) {}
    static Map&lt;Integer, KhachHang&gt; KHACH = Map.of(1, new KhachHang("An", "an@example.com"));

    static KhachHang timKhach(int id) { return KHACH.get(id); }     // unknown id ⇒ null

    public static void main(String[] args) {
        int id = Integer.parseInt(args[0]);
        System.out.println(timKhach(id).email().toLowerCase());
    }
}</code></pre>
<div class="out">$ javac -g Npe.java &amp;&amp; java Npe 1
an@example.com
$ java Npe 2
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Npe$KhachHang.email()" because the return value of "Npe.timKhach(int)" is null
	at Npe.main(Npe.java:11)</div>`;

const MA_SPRING = `<pre><code class="language-java">// CauHinhPhong.java — a Spring bean that reads the room capacity from an environment variable
@Component
public class CauHinhPhong {
    private final int sucChua;

    public CauHinhPhong() {
        String giaTri = System.getenv().getOrDefault("SUC_CHUA_PHONG", "30 chỗ");   // someone wrote "30 chỗ" (30 seats)
        this.sucChua = Integer.parseInt(giaTri);
    }
    public int sucChua() { return sucChua; }
}</code></pre>`;

const OUT_SPRING1 = `<div class="out">$ java -cp "out:&lt;spring 6.2.11 jars&gt;" com.ctw.datlich.UngDung
Nov 22, 2026 9:20:02 PM org.springframework.context.support.AbstractApplicationContext refresh
WARNING: Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'cauHinhPhong' defined in file [/private/tmp/dbg-lab/ch2/2-2/out/com/ctw/datlich/CauHinhPhong.class]: Failed to instantiate [com.ctw.datlich.CauHinhPhong]: Constructor threw exception
Exception in thread "main" org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'cauHinhPhong' defined in file [/private/tmp/dbg-lab/ch2/2-2/out/com/ctw/datlich/CauHinhPhong.class]: Failed to instantiate [com.ctw.datlich.CauHinhPhong]: Constructor threw exception
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:1357)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1242)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.instantiateSingleton(DefaultListableBeanFactory.java:1221)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingleton(DefaultListableBeanFactory.java:1187)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingletons(DefaultListableBeanFactory.java:1123)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:987)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:627)
	at org.springframework.context.annotation.AnnotationConfigApplicationContext.&lt;init&gt;(AnnotationConfigApplicationContext.java:93)
	at com.ctw.datlich.UngDung.main(UngDung.java:11)
Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [com.ctw.datlich.CauHinhPhong]: Constructor threw exception
	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:223)
	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:123)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:1351)
	... 14 more
Caused by: java.lang.NumberFormatException: For input string: "30 chỗ"
	at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)
	at java.base/java.lang.Integer.parseInt(Integer.java:662)
	at java.base/java.lang.Integer.parseInt(Integer.java:778)
	at com.ctw.datlich.CauHinhPhong.&lt;init&gt;(CauHinhPhong.java:11)
	at java.base/jdk.internal.reflect.DirectConstructorHandleAccessor.newInstance(DirectConstructorHandleAccessor.java:62)
	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:502)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:486)
	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:197)
	... 16 more</div>`;

const MA_SPRING2 = `<pre><code class="language-java">public interface PhongRepository {      // your teammate has not pushed the implementation yet
    int soPhong();
}

@Service
public class DatLichService {
    private final PhongRepository phongRepo;
    public DatLichService(PhongRepository phongRepo) { this.phongRepo = phongRepo; }
}</code></pre>`;

const OUT_SPRING2 = `<div class="out">$ SUC_CHUA_PHONG=30 java -cp "out2:&lt;spring 6.2.11 jars&gt;" com.ctw.datlich.UngDung 2&gt;&amp;1 | grep -v "^\\sat org.springframework"
Nov 22, 2026 9:20:15 PM org.springframework.context.support.AbstractApplicationContext refresh
WARNING: Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'datLichService' defined in file [/private/tmp/dbg-lab/ch2/2-2/out2/com/ctw/datlich/DatLichService.class]: Unsatisfied dependency expressed through constructor parameter 0: No qualifying bean of type 'com.ctw.datlich.PhongRepository' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}
Exception in thread "main" org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'datLichService' defined in file [/private/tmp/dbg-lab/ch2/2-2/out2/com/ctw/datlich/DatLichService.class]: Unsatisfied dependency expressed through constructor parameter 0: No qualifying bean of type 'com.ctw.datlich.PhongRepository' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}
	at com.ctw.datlich.UngDung.main(UngDung.java:11)
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.ctw.datlich.PhongRepository' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}
	... 16 more</div>`;

const BANG_SPRING = (en) => en ? `<table>
<thead><tr><th>Exception (last "Caused by")</th><th>Usually means</th><th>Look at</th></tr></thead>
<tbody>
<tr><td><code>NoSuchBeanDefinitionException</code> / <code>UnsatisfiedDependencyException</code></td><td>Something asks for a bean nobody created</td><td>Missing <code>@Service</code>/<code>@Repository</code>, class outside the scanned package, implementation not committed</td></tr>
<tr><td><code>BeanCreationException</code> + another Caused by</td><td>A bean's constructor or init method threw</td><td>The last Caused by: your constructor, a config value, a bad property</td></tr>
<tr><td><code>NoUniqueBeanDefinitionException</code></td><td>Two beans match one injection point</td><td><code>@Primary</code> / <code>@Qualifier</code></td></tr>
<tr><td><code>LazyInitializationException</code> (Hibernate)</td><td>A lazy relation was read after the database session closed</td><td>Where the entity is used outside the transaction (often in a controller or JSON serialisation)</td></tr>
<tr><td><code>ConstraintViolationException</code></td><td>Bean Validation rejected input, or a database constraint was violated</td><td>The field names and messages listed in the exception</td></tr>
</tbody>
</table>` : `<table>
<thead><tr><th>Ngoại lệ (Caused by cuối cùng)</th><th>Thường nghĩa là</th><th>Nhìn vào đâu</th></tr></thead>
<tbody>
<tr><td><code>NoSuchBeanDefinitionException</code> / <code>UnsatisfiedDependencyException</code></td><td>Có chỗ xin một bean mà không ai tạo</td><td>Thiếu <code>@Service</code>/<code>@Repository</code>, lớp nằm ngoài package được quét, lớp cài đặt chưa commit</td></tr>
<tr><td><code>BeanCreationException</code> + một Caused by khác</td><td>Hàm khởi tạo hoặc hàm init của bean đã ném lỗi</td><td>Caused by cuối: hàm khởi tạo của bạn, một giá trị cấu hình, một property sai</td></tr>
<tr><td><code>NoUniqueBeanDefinitionException</code></td><td>Hai bean cùng khớp một chỗ tiêm</td><td><code>@Primary</code> / <code>@Qualifier</code></td></tr>
<tr><td><code>LazyInitializationException</code> (Hibernate)</td><td>Một quan hệ lazy bị đọc sau khi phiên CSDL đã đóng</td><td>Chỗ entity được dùng ngoài transaction (hay gặp ở controller hoặc lúc chuyển sang JSON)</td></tr>
<tr><td><code>ConstraintViolationException</code></td><td>Bean Validation từ chối dữ liệu vào, hoặc vi phạm ràng buộc CSDL</td><td>Tên trường và thông điệp liệt kê trong ngoại lệ</td></tr>
</tbody>
</table>`;

const NGUON = [
  nguon('☕', 'OpenJDK — JEP 358: Helpful NullPointerExceptions', 'Đặc tả của thông báo NPE "because … is null" (JDK 14, bật mặc định từ JDK 15).', 'https://openjdk.org/jeps/358'),
  nguon('☕', 'Java SE 21 API — Throwable.printStackTrace()', 'Giải thích chính thức "Caused by" và "... n more".', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html#printStackTrace()'),
  nguon('🌱', 'Spring Framework Reference — Dependency Injection', 'Bean, tiêm qua hàm khởi tạo, và vì sao thiếu bean thì context không lên.', 'https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html'),
].join('\n');

export default {
  title: '2.2 — Java: NullPointerException, "Caused by" chains and the Spring wall of text|||2.2 — Java: NullPointerException, chuỗi "Caused by" và bức tường chữ của Spring',
  slug: 'dbg-2-2-java',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Helpful NPE (JEP 358) nói biến nào null — và vì sao có lúc chỉ nói <local1>; đọc chuỗi "Caused by" từ dưới lên, "... 14 more" nghĩa là gì; hai trace Spring 6.2 chạy thật (bean ném NumberFormatException, thiếu bean PhongRepository); bảng ngoại lệ Spring hay gặp; tình huống OJT: app không khởi động sau khi merge.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Java tells you a lot — if you read from the right end</h2>
<p class="lead">Java stack traces are long, especially with Spring, but they are honest: the JVM prints every frame and every wrapped cause. Three skills cover most of what you will see in an OJT Java project: reading a modern <code>NullPointerException</code> message, following a chain of <code>Caused by</code> down to the root, and recognising the handful of Spring exceptions that mean "your application could not start".</p>

<h3>An everyday picture: a chain of excuses</h3>
<p>"The shop did not open" — because "the manager could not get in" — because "the key would not turn" — because "the lock was rusted". The first sentence is what the customer sees; the last one is what you fix. A Java exception chain is exactly this: each <code>Caused by</code> is one more "because", and the <strong>last one is the root</strong>.</p>

<h3>1. Helpful NullPointerException: the JVM names what was null</h3>
<p>Since JDK 14 (JEP 358; on by default since JDK 15), an NPE message says <em>what you tried to do</em> and <em>which expression was null</em>. Run bug C from lesson 0.1 both ways:</p>
${OUT_NPE}
<p>Read it as two halves: <code>Cannot invoke "String.toUpperCase()"</code> = what failed; <code>because "don.khach.diaChi" is null</code> = which link of the chain <code>don → khach → diaChi</code> was empty. Without debug information (<code>javac</code> without <code>-g</code>, which is what <code>java File.java</code> uses) the JVM does not know local variable names and writes <code>&lt;local1&gt;</code>. Maven and Gradle compile with debug info by default, so in a real project you see real names.</p>
<p>When the null comes from a <strong>method call</strong>, the message says so — which points you straight at the method to question:</p>
${MA_NPE2}
<p>"The return value of <code>Npe.timKhach(int)</code> is null" — the question is no longer "why is email null?" but "why does <code>timKhach(2)</code> return null, and should the caller handle that?". The fix is a decision (return <code>Optional</code>, throw a clear <code>NotFound</code> exception, or check), not a scattered <code>if (x != null)</code>.</p>

<h3>2. "Caused by": read from the bottom up</h3>
<p>When code catches an exception and throws a new one that wraps it, Java prints both: the outer one first, then <code>Caused by:</code> the inner one, and so on. Spring wraps a lot. Here is a real, complete trace from a tiny Spring Framework 6.2 application whose bean reads a configuration value:</p>
${MA_SPRING}
${OUT_SPRING1}
<p>How to read 33 lines in one minute:</p>
<ol>
<li><strong>Jump to the last <code>Caused by</code></strong>: <code>java.lang.NumberFormatException: For input string: "30 chỗ"</code>. That is the root: someone put "30 chỗ" (30 seats) where a number was expected.</li>
<li><strong>Find your first frame in that block</strong>: <code>at com.ctw.datlich.CauHinhPhong.&lt;init&gt;(CauHinhPhong.java:11)</code> — <code>&lt;init&gt;</code> means the constructor, line 11 is the <code>parseInt</code>.</li>
<li><strong>Go up only to understand the context</strong>: the first line says which bean failed (<code>'cauHinhPhong'</code>) and the outermost frame of yours (<code>UngDung.java:11</code>) says it happened while the application was starting.</li>
</ol>
<p><strong>What "... 14 more" means:</strong> the remaining 14 frames of this cause are identical to the last 14 frames of the exception above it, so Java does not print them twice. It is not hidden information — scroll up and you already have it.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — fixing the first line.</strong> The first line, <code>BeanCreationException … Constructor threw exception</code>, is true and useless: it names the wrapper, not the cause. Searching it online returns thousands of unrelated pages. Always search the <em>last</em> Caused by.</p></div>

<h3>3. The OJT classic: the application does not start after a merge</h3>
<p>You pull <code>main</code>, run the app, and get a wall of text. Here is the real shape of it, with the Spring-internal frames filtered out:</p>
${MA_SPRING2}
${OUT_SPRING2}
<p>The message is unusually complete: <code>Unsatisfied dependency expressed through constructor parameter 0</code> (the first parameter of <code>DatLichService</code>'s constructor), <code>No qualifying bean of type 'com.ctw.datlich.PhongRepository' available</code>. In a real team this almost always has one of three causes: the implementation class was not committed (check <code>git log</code> for it), it is missing <code>@Repository</code>/<code>@Component</code>, or it sits in a package outside the one Spring scans. Ask the teammate before writing your own implementation.</p>

<h3>Spring exceptions you will meet in the first month</h3>
${BANG_SPRING(true)}

<h3>🧪 Practice (20 min) — the root line in under a minute</h3>
<div class="callout ok">
<ol>
<li>Run <code>DonHang.java</code> both ways (with and without <code>javac -g</code>) and <code>Npe.java</code> with arguments 1 and 2. For each NPE write: what failed, which expression was null.</li>
<li>Copy the 33-line Spring trace above into a file. Set a timer: find the root exception, your own frame in it, and the failing bean. Under 60 seconds?</li>
<li>Explain in one sentence what <code>... 14 more</code> hides, and prove it by counting the frames of the exception above it.</li>
<li>For the <code>NoSuchBeanDefinitionException</code>: list the three likely causes in your own team project, and the command or file you would check for each.</li>
</ol>
<p><strong>Done when:</strong> you named <code>don.khach.diaChi</code> and <code>Npe.timKhach(int)</code>; you found <code>"30 chỗ"</code> at <code>CauHinhPhong.java:11</code> in under a minute; and your three checks for the missing bean are concrete (a <code>git log</code> command, an annotation, a package name).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NullPointerException (NPE)</span><span class="v">Using a member of a reference that is null.</span></div>
  <div class="kv"><span class="k">Helpful NPE</span><span class="v">JDK 14+ message naming what failed and which expression was null.</span></div>
  <div class="kv"><span class="k">Caused by</span><span class="v">The wrapped, deeper exception; the last one is the root cause.</span></div>
  <div class="kv"><span class="k">... n more</span><span class="v">n frames identical to the enclosing trace, not repeated.</span></div>
  <div class="kv"><span class="k">&lt;init&gt;</span><span class="v">The constructor in a Java stack frame.</span></div>
  <div class="kv"><span class="k">bean</span><span class="v">An object created and managed by the Spring container.</span></div>
  <div class="kv"><span class="k">application context</span><span class="v">Spring's container; if a bean fails, the context — and the app — does not start.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Helpful NPE: "Cannot … because X is null" — X is your starting point; <code>&lt;local1&gt;</code> means no debug info.</li>
<li>"The return value of M is null" moves the question to method M.</li>
<li>Read Caused by chains from the bottom: the last one is the root, your first frame in it is the line.</li>
<li><code>... n more</code> = frames already printed above.</li>
<li>App will not start after a merge: read the last Caused by; NoSuchBean usually means not committed, not annotated, or not scanned.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Java kể cho bạn rất nhiều — nếu bạn đọc từ đúng đầu</h2>
<p class="lead">Stack trace Java dài, nhất là khi có Spring, nhưng nó trung thực: JVM in mọi frame và mọi nguyên nhân đã bị bọc. Ba kỹ năng phủ gần hết những gì bạn sẽ gặp trong dự án Java lúc OJT: đọc thông báo <code>NullPointerException</code> kiểu mới, lần theo chuỗi <code>Caused by</code> xuống tới gốc, và nhận ra vài ngoại lệ Spring mang nghĩa "ứng dụng của bạn không khởi động được".</p>

<h3>Liên tưởng đời thường: chuỗi lý do</h3>
<p>"Cửa hàng không mở" — vì "quản lý không vào được" — vì "chìa khoá không xoay" — vì "ổ khoá bị gỉ". Câu đầu là thứ khách thấy; câu cuối mới là thứ bạn sửa. Chuỗi ngoại lệ Java đúng là như vậy: mỗi <code>Caused by</code> (gây ra bởi) là thêm một chữ "vì", và <strong>cái cuối cùng là gốc</strong>.</p>

<h3>1. Helpful NullPointerException: JVM gọi tên thứ bị null</h3>
<p>Từ JDK 14 (JEP 358; bật mặc định từ JDK 15), thông báo NPE nói <em>bạn đang cố làm gì</em> và <em>biểu thức nào bị null</em>. Chạy lỗi C ở bài 0.1 theo cả hai cách:</p>
${OUT_NPE}
<p>Đọc thành hai nửa: <code>Cannot invoke "String.toUpperCase()"</code> = việc bị hỏng; <code>because "don.khach.diaChi" is null</code> = mắt xích nào trong chuỗi <code>don → khach → diaChi</code> bị trống. Không có thông tin debug (<code>javac</code> không có <code>-g</code>, cũng là cách <code>java Tệp.java</code> dùng), JVM không biết tên biến cục bộ và ghi <code>&lt;local1&gt;</code>. Maven và Gradle mặc định biên dịch kèm thông tin debug, nên trong dự án thật bạn sẽ thấy tên thật.</p>
<p>Khi null đến từ một <strong>lời gọi hàm</strong>, thông báo nói luôn — chỉ thẳng vào hàm cần tra hỏi:</p>
${MA_NPE2}
<p>"The return value of <code>Npe.timKhach(int)</code> is null" (giá trị trả về của timKhach là null) — câu hỏi không còn là "vì sao email null?" mà là "vì sao <code>timKhach(2)</code> trả null, và nơi gọi có nên xử lý chuyện đó không?". Bản sửa là một quyết định (trả <code>Optional</code>, ném một ngoại lệ <code>NotFound</code> rõ ràng, hoặc kiểm tra), không phải rải <code>if (x != null)</code> khắp nơi.</p>

<h3>2. "Caused by": đọc từ dưới lên</h3>
<p>Khi code bắt một ngoại lệ rồi ném ngoại lệ mới bọc nó lại, Java in cả hai: cái bên ngoài trước, rồi <code>Caused by:</code> cái bên trong, cứ thế tiếp. Spring bọc rất nhiều. Đây là một trace thật, đầy đủ, từ một ứng dụng Spring Framework 6.2 tí hon có một bean đọc giá trị cấu hình:</p>
${MA_SPRING}
${OUT_SPRING1}
<p>Cách đọc 33 dòng trong một phút:</p>
<ol>
<li><strong>Nhảy tới <code>Caused by</code> cuối cùng</strong>: <code>java.lang.NumberFormatException: For input string: "30 chỗ"</code>. Đó là gốc: ai đó ghi "30 chỗ" vào chỗ đáng lẽ là một con số.</li>
<li><strong>Tìm frame đầu tiên của bạn trong khối đó</strong>: <code>at com.ctw.datlich.CauHinhPhong.&lt;init&gt;(CauHinhPhong.java:11)</code> — <code>&lt;init&gt;</code> là hàm khởi tạo, dòng 11 là lệnh <code>parseInt</code>.</li>
<li><strong>Đi lên chỉ để hiểu bối cảnh</strong>: dòng đầu cho biết bean nào hỏng (<code>'cauHinhPhong'</code>), và frame ngoài cùng của bạn (<code>UngDung.java:11</code>) cho biết lỗi xảy ra lúc ứng dụng đang khởi động.</li>
</ol>
<p><strong>"... 14 more" nghĩa là gì:</strong> 14 frame còn lại của nguyên nhân này giống hệt 14 frame cuối của ngoại lệ bên trên nó, nên Java không in lại lần hai. Không có thông tin nào bị giấu — kéo lên trên là bạn đã có.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — sửa theo dòng đầu tiên.</strong> Dòng đầu, <code>BeanCreationException … Constructor threw exception</code>, đúng nhưng vô dụng: nó gọi tên lớp bọc, không phải nguyên nhân. Đem nó đi tìm là ra hàng nghìn trang chẳng liên quan. Luôn tìm theo Caused by <em>cuối cùng</em>.</p></div>

<h3>3. Kinh điển khi OJT: ứng dụng không khởi động sau khi merge</h3>
<p>Bạn pull <code>main</code>, chạy ứng dụng, và nhận một bức tường chữ. Đây là hình dạng thật của nó, đã lọc bỏ các frame nội bộ của Spring:</p>
${MA_SPRING2}
${OUT_SPRING2}
<p>Thông báo đầy đủ hiếm thấy: <code>Unsatisfied dependency expressed through constructor parameter 0</code> (tham số đầu của hàm khởi tạo <code>DatLichService</code>), <code>No qualifying bean of type 'com.ctw.datlich.PhongRepository' available</code> (không có bean nào kiểu PhongRepository). Trong một nhóm thật, gần như luôn là một trong ba nguyên nhân: lớp cài đặt chưa được commit (kiểm <code>git log</code>), thiếu <code>@Repository</code>/<code>@Component</code>, hoặc nó nằm ở package ngoài vùng Spring quét. Hỏi bạn cùng nhóm trước khi tự viết một lớp cài đặt.</p>

<h3>Ngoại lệ Spring bạn sẽ gặp trong tháng đầu</h3>
${BANG_SPRING(false)}

<h3>🧪 Thực hành (20 phút) — dòng gốc trong dưới một phút</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>DonHang.java</code> cả hai cách (có và không có <code>javac -g</code>) và <code>Npe.java</code> với tham số 1 và 2. Mỗi NPE ghi: việc gì hỏng, biểu thức nào null.</li>
<li>Chép trace Spring 33 dòng ở trên vào một tệp. Bấm giờ: tìm ngoại lệ gốc, frame của bạn trong đó, và bean bị hỏng. Dưới 60 giây không?</li>
<li>Giải thích bằng một câu <code>... 14 more</code> che gì, và chứng minh bằng cách đếm frame của ngoại lệ bên trên nó.</li>
<li>Với <code>NoSuchBeanDefinitionException</code>: liệt kê ba nguyên nhân có thể xảy ra trong đồ án nhóm của bạn, kèm lệnh hoặc tệp bạn sẽ kiểm cho từng cái.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi đúng <code>don.khach.diaChi</code> và <code>Npe.timKhach(int)</code>; tìm ra <code>"30 chỗ"</code> ở <code>CauHinhPhong.java:11</code> trong dưới một phút; và ba phép kiểm cho bean thiếu là cụ thể (một lệnh <code>git log</code>, một annotation, một tên package).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NullPointerException (NPE)</span><span class="v">Dùng thành phần của một tham chiếu đang là null.</span></div>
  <div class="kv"><span class="k">Helpful NPE (NPE dễ hiểu)</span><span class="v">Thông báo từ JDK 14 gọi tên việc hỏng và biểu thức bị null.</span></div>
  <div class="kv"><span class="k">Caused by (gây ra bởi)</span><span class="v">Ngoại lệ sâu hơn bị bọc bên trong; cái cuối là nguyên nhân gốc.</span></div>
  <div class="kv"><span class="k">... n more</span><span class="v">n frame giống hệt trace bao ngoài, không in lại.</span></div>
  <div class="kv"><span class="k">&lt;init&gt;</span><span class="v">Hàm khởi tạo (constructor) trong một frame Java.</span></div>
  <div class="kv"><span class="k">bean</span><span class="v">Đối tượng do Spring container tạo và quản lý.</span></div>
  <div class="kv"><span class="k">application context (ngữ cảnh ứng dụng)</span><span class="v">Container của Spring; một bean hỏng là context — và cả ứng dụng — không lên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Helpful NPE: "Cannot … because X is null" — X là điểm xuất phát; <code>&lt;local1&gt;</code> nghĩa là thiếu thông tin debug.</li>
<li>"The return value of M is null" chuyển câu hỏi sang hàm M.</li>
<li>Đọc chuỗi Caused by từ dưới lên: cái cuối là gốc, frame đầu tiên của bạn trong đó là dòng cần nhìn.</li>
<li><code>... n more</code> = các frame đã in ở trên.</li>
<li>Ứng dụng không lên sau khi merge: đọc Caused by cuối; NoSuchBean thường là chưa commit, thiếu annotation, hoặc không được quét.</li>
</ul>
${NGUON}
</div>
`,
};
