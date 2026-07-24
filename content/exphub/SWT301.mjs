/**
 * Exp Hub guide for SWT301 — JDK + IntelliJ + JUnit 5 + Selenium (Vietnamese).
 * Academy SWT301 links its "Cài đặt" card to /exp-hub/swt301-cai-dat-testing.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'swt301-cai-dat-testing',
    title: 'SWT301 — Cài JDK + JUnit 5 + Selenium',
    kind: 'NOTE',
    language: 'java',
    status: 'PUBLISHED',
    description: 'Dựng môi trường kiểm thử cho SWT301: JDK, IntelliJ IDEA, Maven + JUnit 5 (unit test) và Selenium WebDriver (UI test) — kèm pom.xml mẫu và link tải chính chủ.',
    referenceUrl: 'https://www.jetbrains.com/idea/',
    codeBlocks: [
      {
        name: 'pom.xml — thêm JUnit 5 + Selenium',
        language: 'xml',
        code: `<dependencies>
  <!-- JUnit 5: viết unit test -->
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
  </dependency>

  <!-- Selenium: điều khiển trình duyệt để test UI -->
  <dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.20.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>`,
      },
      {
        name: 'Unit test đầu tiên — CalculatorTest.java',
        language: 'java',
        code: `import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    int add(int a, int b) { return a + b; }

    @Test
    void add_twoPositives_returnsSum() {
        assertEquals(5, add(2, 3));   // Arrange - Act - Assert
    }

    @Test
    void add_negatives_works() {
        assertEquals(-4, add(-1, -3));
    }
}`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · SWT301</span>
<h2>Môi trường kiểm thử: JUnit + Selenium</h2>
<p class="lead">SWT301 dạy <strong>chứng minh phần mềm chạy đúng</strong>. Bạn cần: <strong>JDK</strong> (chạy Java), một <strong>IDE</strong> (IntelliJ IDEA — Community bản miễn phí), <strong>Maven</strong> để kéo thư viện, rồi 2 công cụ test cốt lõi: <strong>JUnit 5</strong> cho unit test và <strong>Selenium</strong> cho UI test tự động.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 17</div><div class="lz-d">chạy Java</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">IntelliJ IDEA</div><div class="lz-d">IDE + Maven sẵn</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">JUnit 5</div><div class="lz-d">unit test</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Selenium</div><div class="lz-d">test giao diện</div></div>
</div>

<h3>🅐 Bước 1 — Cài JDK (17 trở lên)</h3>
<p>Java Development Kit là bộ chạy + biên dịch Java. Dùng bản Temurin (Adoptium) hoặc Oracle JDK 17 LTS.</p>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/?version=17" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse Temurin JDK 17 (miễn phí, chính chủ)</span><span class="lc-sub">adoptium.net · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="note-ct">Kiểm tra: mở terminal gõ <code>java -version</code> → ra <code>17.x</code> là được.</div>

<h3>🅑 Bước 2 — Cài IntelliJ IDEA (Community)</h3>
<p>IntelliJ có sẵn Maven, chạy JUnit bằng một cú nhấp, và hiện <strong>xanh/đỏ</strong> ngay cho từng test. Bản Community miễn phí là đủ cho môn này.</p>
<a class="link-card dl" href="https://www.jetbrains.com/idea/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">IntelliJ IDEA Community (miễn phí)</span><span class="lc-sub">jetbrains.com · kéo xuống mục "Community Edition"</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bước 3 — Thêm JUnit 5 + Selenium vào project</h3>
<p>Tạo project <strong>Maven</strong> trong IntelliJ, rồi dán khối phụ thuộc trong "pom.xml" bên trên vào file <code>pom.xml</code>. IntelliJ sẽ tự tải thư viện về.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">New Project → Maven</div><div class="lz-nsub">chọn JDK 17 đã cài.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Dán dependency vào pom.xml</div><div class="lz-nsub">JUnit 5 (unit) + Selenium (UI). Nhấn biểu tượng "Load Maven Changes".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Viết test trong src/test/java</div><div class="lz-nsub">chạy bằng nút ▶ cạnh mỗi <code>@Test</code> → xem xanh/đỏ.</div></div></div>
</div>

<h3>🅓 Bước 4 — Selenium chạy trình duyệt thật</h3>
<p>Selenium 4 tự tải driver (Selenium Manager) nên bạn <strong>không cần</strong> tải chromedriver thủ công. Chỉ cần trình duyệt Chrome/Edge có sẵn trên máy.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>WebDriver</b> — mở trình duyệt, điều hướng trang: <code>driver.get("...")</code>.</div>
  <div class="lz-layer"><b>Locator</b> — tìm phần tử: <code>By.id</code>, <code>By.cssSelector</code>, <code>By.xpath</code>.</div>
  <div class="lz-layer"><b>Assertions</b> — dùng JUnit kiểm tra kết quả trên trang có đúng không.</div>
</div>
<a class="link-card dl" href="https://www.selenium.dev/documentation/webdriver/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Selenium WebDriver — tài liệu chính chủ</span><span class="lc-sub">selenium.dev · ví dụ mở trình duyệt & tìm phần tử</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Mẹo thi PE: nhớ mẫu <b>Arrange – Act – Assert</b> và biên độ phủ (statement/branch). Với Selenium, ưu tiên locator <code>By.id</code> hoặc <code>By.cssSelector</code> ổn định thay vì XPath dài dễ gãy.</div>
`,
  },
};
