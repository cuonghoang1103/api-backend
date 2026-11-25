/**
 * Đọc code cũ và refactor — Chương 3: Dựng lưới an toàn trước khi chạm vào code (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 3.1 characterization test (thuật toán Feathers: để lỗi nói ra giá trị thật; bẫy JUnit 5 nuốt test JUnit 4; fixture đi qua trigger;
 *     Mockito + CSDL thật qua seam DB_URL; Jest + supertest cho API Node cũ) · 3.2 golden master (HTML qua HTTP + làm sạch ngày; ApprovalTests
 *     cho CSV — lộ tệp "C:\thuvien\export\books.csv" và CSV đổi theo bảng mã máy; Jest snapshot) · 3.3 seam (Extract and Override Call cho thời
 *     gian, sprout class TV-90, wrap method TV-91, factory method cho ExportServlet; jest.mock — và khi seam nói dối) · 3.4 test qua HTTP với
 *     Testcontainers (module e2e Java 17 riêng, đo chi phí, bắt đột biến setCharacterEncoding mà Mockito bỏ sót) · 3.5 lab LIB-103 + PIT ·
 *     3.6 quiz 12 câu.
 * MỌI output chạy thật trên repo lab (lịch sử dựng bằng lab/_tao-lich-su.py) + repo mới lab/legacy-express. Máy chạy: MOI_TRUONG_3.
 * Cổng: máy nhà chạy stack lab ở 41880/41306; trong bài ghi 18080/18306 như docker-compose.yml của lab (chỉ đổi số cổng, không đổi gì khác).
 * KHÔNG dạy lại: khái niệm characterization/golden master trên Node (testing 10.2), Testcontainers cho Node (testing 4.3),
 * Mockito/Testcontainers trong Spring Boot (spring-boot 11.2/11.4), mutation testing (testing 8.2) — chỉ dẫn liên kết.
 */
import { java, xml, sql, bash, js, out, tl, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3, ZIP_EXPRESS } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3}.</em></p>`;

/* ═══════════════════ 3.1 — Characterization test ═══════════════════ */
const X31_POM = xml(`
<!-- pom.xml — thêm vào <dependencies>. Java 8 ⇒ JUnit 5.11 (JUnit 6 cần Java 17) và Mockito 4.11 (Mockito 5 cần Java 11) -->
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.11.4</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.mockito</groupId>
  <artifactId>mockito-junit-jupiter</artifactId>
  <version>4.11.0</version>
  <scope>test</scope>
</dependency>
`
);
const B31_CHAY = bash(`
# JDK 8 (code dùng javax.xml.bind — bài 1.2) + stack lab đang chạy (docker compose up -d, bài 0.1)
export DB_URL="jdbc:mysql://localhost:18306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true"
mvn -B test
`
);
const C31_TOKEN_SAI = java(`
package com.thuvien.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class TokenUtilDacTaTest {

    @Test
    void tokenCuaAdmin() {
        assertEquals("?", TokenUtil.makeToken("admin"));   // cố tình sai: để lỗi cho biết giá trị thật
    }
}
`
);
const O31_SAI = out(`
$ mvn -B test
[INFO] --- surefire:3.5.4:test (default-test) @ thuvien ---
[INFO] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.047 s <<< FAILURE! -- in com.thuvien.util.TokenUtilDacTaTest
[ERROR] Failures:
[ERROR]   TokenUtilDacTaTest.tokenCuaAdmin:11 expected: <?> but was: <a316eabce65f3759e1ce2d96db99486c>
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
`
);
const X31_VINTAGE = xml(`
<dependency>
  <groupId>org.junit.vintage</groupId>
  <artifactId>junit-vintage-engine</artifactId>
  <version>5.11.4</version>
  <scope>test</scope>
</dependency>
`
);
const O31_VINTAGE = out(`
$ mvn -B test
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.039 s -- in com.thuvien.util.TokenUtilDacTaTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s -- in com.thuvien.util.TokenUtilTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`
);
const S31_FIXTURE = sql(`
-- src/test/resources/du-lieu-test.sql — dữ liệu CỐ ĐỊNH, ngày tháng viết cứng (không NOW()) để lần nào chạy cũng như nhau
DELETE FROM loans;
DELETE FROM books;
DELETE FROM readers;
INSERT INTO readers (id, name, type, phone) VALUES (1,'Nguyễn Văn An','SV','0901000001'), … (5,'Hoàng Gia Huy','SV','0901000005');
INSERT INTO books VALUES (1,'CNTT001','Lập trình Java căn bản','Phạm Văn Ất',5,3), (2,'CNTT002',…,3,2), … (7,'NN001',…,6,5);
INSERT INTO loans (id, book_id, reader_id, borrow_date, due_date, return_date, fine) VALUES
  (1,1,1,'2026-11-01 09:00:00','2026-11-15 09:00:00',NULL,0), (2,1,2,'2026-11-16 09:00:00','2026-11-30 09:00:00',NULL,0),
  (3,2,3,'2026-10-12 09:00:00','2026-11-11 09:00:00',NULL,0), (4,3,4,'2026-10-22 09:00:00','2026-10-29 09:00:00',NULL,0),
  (5,7,1,'2026-09-22 09:00:00','2026-10-06 09:00:00','2026-10-12 09:00:00',12000);
`
);
const O31_TRIGGER = out(`
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.214 s <<< FAILURE! -- in com.thuvien.servlet.NapDuLieuThuTest
[ERROR]   NapDuLieuThuTest.sach1SauKhiNap:12 expected: <3> but was: <1>
`
);
const O31_BANG = out(`
-- Sửa: nạp books với available = quantity, để trigger trừ đúng như đời thật (kể cả phiếu 5 đã trả — y như dump gốc)
+----+----------+-----------+
| id | quantity | available |
+----+----------+-----------+
|  1 |        5 |         3 |
|  2 |        3 |         2 |
|  3 |        2 |         1 |
|  4 |        2 |         2 |
|  5 |        1 |         1 |
|  6 |        4 |         4 |
|  7 |        6 |         5 |
+----+----------+-----------+
`
);
const C31_SERVLET = java(`
/** Characterization test cho nhánh action=borrow. Ghi lại hành vi HIỆN TẠI, kể cả bug (tên có hậu tố _BUG + mã ticket). */
class BookServletMuonSachTest {

    private final BookServlet servlet = new BookServlet();
    private HttpServletRequest req;
    private HttpServletResponse res;
    private final StringWriter body = new StringWriter();

    @BeforeEach
    void chuanBi() throws Exception {
        DuLieuTest.napLai();                                   // chạy du-lieu-test.sql qua chính DBUtil
        req = mock(HttpServletRequest.class);
        res = mock(HttpServletResponse.class);
        HttpSession session = mock(HttpSession.class);
        when(req.getSession()).thenReturn(session);
        when(session.getAttribute("user")).thenReturn("thuthu");
        when(res.getWriter()).thenReturn(new PrintWriter(body, true));
    }

    /** Gọi doPost như Tomcat gọi; trả về chuỗi redirect đã giải mã, hoặc body HTML nếu không redirect. */
    private String muon(String readerId, String bookId) throws Exception {
        when(req.getParameter("action")).thenReturn("borrow");
        when(req.getParameter("readerId")).thenReturn(readerId);
        when(req.getParameter("bookId")).thenReturn(bookId);
        StringBuilder redirect = new StringBuilder();
        doAnswer(inv -> redirect.append((String) inv.getArgument(0))).when(res).sendRedirect(anyString());
        servlet.doPost(req, res);
        return redirect.length() > 0 ? URLDecoder.decode(redirect.toString(), "UTF-8") : body.toString().trim();
    }

    @Test
    void muonThanhCong_themPhieu_vaTriggerTruSoSach() throws Exception {
        assertEquals("books?msg=Mượn thành công", muon("5", "4"));
        assertEquals(1, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE reader_id = 5 AND book_id = 4 AND return_date IS NULL"));
        assertEquals(1, DuLieuTest.so("SELECT available FROM books WHERE id = 4"));   // 2 → 1, do trigger
    }

    @Test
    void sinhVienDangMuon3_vanMuonDuocCuonThu4_BUG_TV41() throws Exception {
        muon("5", "4"); muon("5", "5"); muon("5", "6");      // SV 5: 0 → 3 cuốn
        assertEquals("books?msg=Mượn thành công", muon("5", "2"));   // luật nói tối đa 3; code so "> max"
        assertEquals(4, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE reader_id = 5 AND return_date IS NULL"));
    }

    @Test
    void readerIdKhongPhaiSo() throws Exception {
        assertEquals("?", muon("abc", "4"));
    }

    @Test
    void bookIdKhongTonTai() throws Exception {
        assertEquals("?", muon("5", "99"));
    }
    // … và: docGiaKhongTonTai, sinhVienDangMuon4_biTuChoi, khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41,
    //       sachHet, chuaDangNhap_veTrangLogin_khongGhiGi, hanTraCuaSinhVien_la14Ngay
}
`
);
const O31_SERVLET = out(`
$ mvn -B test -Dtest=BookServletMuonSachTest
[ERROR] Tests run: 10, Failures: 2, Errors: 0, Skipped: 0, Time elapsed: 0.874 s <<< FAILURE! -- in com.thuvien.servlet.BookServletMuonSachTest
[ERROR]   BookServletMuonSachTest.bookIdKhongTonTai:107 expected: <?> but was: <<html><body><h3>Loi: Illegal operation on empty result set.</h3></body></html>>
[ERROR]   BookServletMuonSachTest.readerIdKhongPhaiSo:102 expected: <?> but was: <<html><body><h3>Loi: Unknown column 'abc' in 'where clause'</h3></body></html>>
[ERROR] Tests run: 10, Failures: 2, Errors: 0, Skipped: 0
`
);
const O31_XANH = out(`
$ mvn -B test
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.036 s -- in com.thuvien.util.TokenUtilDacTaTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.089 s -- in com.thuvien.servlet.BookServletMuonSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s -- in com.thuvien.util.TokenUtilTest
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time:  2.689 s
`
);
const J31_PHI = js(`
// lib/phi.js — "chép từ bên Java sang" (Hùng, 03/2018)
var moment = require('moment');

function tinhPhi(phieu, docGia) {
  var tre = moment().diff(moment(phieu.hanTra), 'days', true);
  tre = Math.ceil(tre);
  if (tre <= 0) return 0;
  var phi = 0;
  if (docGia.loai == 'SV') {
    phi = tre * 2000;
    if (phi > 50000) phi = 50000;
  } else if (docGia.loai == 'GV') {
    phi = tre * 1000;
  } else {
    phi = tre * 5000;
  }
  return phi;
}
`
);
const J31_TEST = js(`
// __tests__/phieu.dac-ta.test.js
const request = require('supertest');
const app = require('../app');            // app.js chỉ tạo app, server.js mới listen — một seam có sẵn

beforeEach(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2026-11-24T10:00:00+07:00'));   // "hôm nay" cố định (bài 3.3)
});
afterEach(() => jest.useRealTimers());

test('SV trễ 9 ngày 1 giờ', async () => {
  const res = await request(app).get('/api/phieu/1/phi');
  expect(res.body).toEqual('?');
});

test('id không phải số', async () => {
  const res = await request(app).get('/api/phieu/abc/phi');
  expect([res.status, res.body]).toEqual('?');
});
`
);
const O31_JEST = out(`
$ npx jest
FAIL __tests__/phieu.dac-ta.test.js
  ✕ phiếu không tồn tại (21 ms)
  ✕ phiếu đã trả (3 ms)
  ✕ SV trễ 9 ngày 1 giờ (4 ms)
  ✕ id không phải số (2 ms)

  ● SV trễ 9 ngày 1 giờ
    Expected: "?"
    Received: {"docGia": "Nguyễn Văn An", "hanTra": "15/11/2026", "phi": 20000, "phieu": 1}

  ● id không phải số
    Expected: "?"
    Received: [404, {"loi": "khong tim thay phieu"}]
`
);

const L31 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · A safety net before you touch anything' : 'Chương 3 · Dựng lưới an toàn trước khi chạm vào code'}</span>
<h2>${en ? '3.1 — Characterization tests on real legacy Java and Node code' : '3.1 — Characterization test trên code Java và Node cũ thật'}</h2>
<p class="lead">${en
  ? 'Before an electrician touches an old house, they switch off the breaker and put a tester on every wire — not to fix anything yet, only to know what is live. A characterization test is that tester: it records what the code <em>does today</em>, right or wrong, so that any change you make later shows up as a red test instead of a phone call from the customer.'
  : 'Trước khi đụng vào điện một ngôi nhà cũ, thợ điện ngắt cầu dao rồi đặt bút thử điện lên từng sợi dây — chưa sửa gì cả, chỉ để biết dây nào đang có điện. Characterization test chính là cây bút thử điện đó: nó ghi lại code <em>đang làm gì hôm nay</em>, đúng hay sai mặc kệ, để mọi thay đổi bạn làm sau này hiện ra thành một test đỏ chứ không phải thành cuộc gọi của khách hàng.'}</p>
${moiTruong(en)}

<h3>${en ? 'What it is — and where the idea comes from' : 'Nó là gì — và ý tưởng từ đâu ra'}</h3>
<p>${en
  ? 'Michael Feathers named it in <em>Working Effectively with Legacy Code</em> (2004, chapter 13): <strong>a characterization test is a test that characterizes the actual behaviour of a piece of code</strong>. It does not ask “what should this do?” — the spec is lost, the author left in 2019 — it asks “what does it do?”. The key difference from the tests you know: <strong>a characterization test that pins a bug is a correct test</strong>. Fixing the bug is a separate, deliberate change, in its own PR, that turns that test red on purpose.'
  : 'Michael Feathers đặt tên cho nó trong <em>Working Effectively with Legacy Code</em> (2004, chương 13): <strong>characterization test là test mô tả hành vi thực tế của một đoạn code</strong>. Nó không hỏi "đoạn này đáng ra phải làm gì?" — đặc tả đã thất lạc, người viết nghỉ từ 2019 — mà hỏi "nó đang làm gì?". Khác biệt then chốt so với các test bạn đã biết: <strong>một characterization test khoá chặt một con bug vẫn là test đúng</strong>. Sửa bug là một thay đổi riêng, có chủ đích, trong PR riêng, cố ý làm test đó đỏ.'}</p>
<p>${en
  ? 'The concept and a Node walkthrough are in the Testing course, lesson 10.2 — not repeated here. This lesson applies it where it hurts most in outsourcing work: a 200-line servlet that talks straight to MySQL, plus the Node API that “copied the same rule” from it.'
  : 'Khái niệm và một ví dụ Node đầy đủ nằm ở khoá Testing, bài 10.2 — không dạy lại ở đây. Bài này áp nó vào chỗ đau nhất trong công việc outsourcing: một servlet 200 dòng nói chuyện thẳng với MySQL, cộng với API Node đã "chép y luật đó" sang.'}</p>

<h3>${en ? 'Feathers’ recipe in four moves' : 'Công thức của Feathers trong bốn bước'}</h3>
<ol>
<li>${en ? 'Get the piece of code into a test harness (call it from a test).' : 'Đưa đoạn code vào khung test (gọi được nó từ một test).'}</li>
<li>${en ? 'Write an assertion you <strong>know</strong> will fail — <code>"?"</code> is a good expected value.' : 'Viết một khẳng định mà bạn <strong>biết chắc</strong> sẽ sai — giá trị mong đợi <code>"?"</code> là đủ.'}</li>
<li>${en ? 'Let the failure message tell you the real value.' : 'Để thông báo lỗi nói cho bạn giá trị thật.'}</li>
<li>${en ? 'Paste that value into the test; it now pins today’s behaviour. Repeat for the next case.' : 'Dán giá trị đó vào test; giờ nó khoá hành vi hôm nay. Lặp lại với trường hợp kế.'}</li>
</ol>
<p>${en
  ? 'It feels like cheating. It is the opposite: you stop guessing. Reading code tells you what you <em>think</em> it does; the failure message tells you what it <em>does</em>.'
  : 'Nghe như ăn gian. Thực ra ngược lại: bạn thôi đoán. Đọc code cho biết bạn <em>nghĩ</em> nó làm gì; thông báo lỗi cho biết nó <em>thật sự</em> làm gì.'}</p>

<h3>${en ? 'Step 0 on an old POM — and the trap that hides tests' : 'Bước 0 trên một POM cũ — và cái bẫy làm test biến mất'}</h3>
<p>${en
  ? 'The lab has one JUnit 4 test from 2016 (<code>TokenUtilTest</code>). We add JUnit 5 and Mockito, choosing versions that still run on Java 8 — check this every time on a legacy project, because the newest major versions often require Java 11 or 17:'
  : 'Lab có đúng một test JUnit 4 từ 2016 (<code>TokenUtilTest</code>). Ta thêm JUnit 5 và Mockito, chọn phiên bản còn chạy trên Java 8 — dự án cũ nào cũng phải kiểm điều này, vì bản chính mới nhất của thư viện thường đòi Java 11 hay 17:'}</p>
${X31_POM}
<p>${en
  ? 'Tests that touch the database run against the lab’s MySQL from Compose. <code>DBUtil</code> reads <code>DB_URL</code> first (more on that in a moment), so every run in this chapter starts like this — and warning: the tests <strong>overwrite</strong> the lab data each time (lesson 3.4 fixes that):'
  : 'Các test đụng CSDL sẽ chạy với MySQL của lab trong Compose. <code>DBUtil</code> đọc <code>DB_URL</code> trước tiên (giải thích ngay bên dưới), nên mọi lần chạy trong chương này đều bắt đầu như sau — và lưu ý: test <strong>ghi đè</strong> dữ liệu lab mỗi lần chạy (bài 3.4 giải quyết chuyện đó):'}</p>
${B31_CHAY}
<p>${en ? 'Then the first characterization test, with the deliberately wrong expectation:' : 'Rồi characterization test đầu tiên, với giá trị mong đợi cố tình sai:'}</p>
${C31_TOKEN_SAI}
${O31_SAI}
<p>${en
  ? 'Two things in eight lines. The failure tells us the token for <code>admin</code>: <code>a316eabc…</code>. And look at the count: <strong>Tests run: 1</strong>. There were two test classes. As soon as JUnit 5 is on the classpath, Surefire switches to the JUnit Platform provider, which does not run JUnit 4 tests unless the <em>vintage</em> engine is present. No error, no warning — the old test just stops running. Add the engine:'
  : 'Tám dòng, hai điều. Lỗi cho biết token của <code>admin</code>: <code>a316eabc…</code>. Và nhìn con số: <strong>Tests run: 1</strong>. Có hai lớp test cơ mà. Ngay khi JUnit 5 có trên classpath, Surefire chuyển sang provider JUnit Platform, và provider này không chạy test JUnit 4 nếu thiếu engine <em>vintage</em>. Không lỗi, không cảnh báo — test cũ cứ thế im lặng không chạy nữa. Thêm engine:'}</p>
${X31_VINTAGE}
${O31_VINTAGE}
<div class="callout warn"><p>${en
  ? '<strong>Habit:</strong> before and after touching a build file, compare the <em>number</em> of tests run, not just the colour. “Green with fewer tests” is the most dangerous result a build can give you.'
  : '<strong>Thói quen:</strong> trước và sau khi sửa tệp build, so <em>số lượng</em> test đã chạy, đừng chỉ nhìn màu. "Xanh nhưng ít test hơn" là kết quả nguy hiểm nhất mà một bản build có thể trả về.'}</p></div>

<h3>${en ? 'Fixed data — and a trigger that counts twice' : 'Dữ liệu cố định — và một trigger trừ hai lần'}</h3>
<p>${en
  ? 'The servlet reads and writes MySQL, so every test needs the database in a known state. The dump from Chapter 1 uses <code>NOW() - INTERVAL n DAY</code>, which changes every day; for unit-level tests we want <em>fixed</em> dates. We wrote a small fixture and a helper <code>DuLieuTest.napLai()</code> that runs it through the app’s own <code>DBUtil</code> before each test:'
  : 'Servlet đọc ghi MySQL, nên test nào cũng cần CSDL ở một trạng thái biết trước. Dump ở Chương 1 dùng <code>NOW() - INTERVAL n DAY</code>, đổi theo từng ngày; với test mức đơn vị ta muốn ngày <em>cố định</em>. Ta viết một fixture nhỏ và hàm tiện ích <code>DuLieuTest.napLai()</code> chạy nó qua chính <code>DBUtil</code> của ứng dụng trước mỗi test:'}</p>
${S31_FIXTURE}
<p>${en
  ? 'We copied the <code>available</code> column straight from the dump and checked book 1 (should be 3):'
  : 'Ta chép nguyên cột <code>available</code> từ dump rồi kiểm sách 1 (đáng ra là 3):'}</p>
${O31_TRIGGER}
<p>${en
  ? 'One, not three. The fixture inserted two open loans of book 1 — and the <code>AFTER INSERT</code> trigger from lesson 2.3 subtracted them <em>again</em>. The original dump does not suffer from this only because it creates the trigger <em>after</em> loading the rows. Logic in the database applies to your test data too. The fix is to insert books with <code>available = quantity</code> and let the trigger do its job:'
  : 'Một, không phải ba. Fixture chèn hai phiếu đang mượn sách 1 — và trigger <code>AFTER INSERT</code> ở bài 2.3 trừ chúng <em>thêm lần nữa</em>. Dump gốc không dính lỗi này chỉ vì nó tạo trigger <em>sau</em> khi nạp dữ liệu. Logic nằm trong CSDL áp lên cả dữ liệu test của bạn. Cách sửa: chèn books với <code>available = quantity</code> rồi để trigger làm đúng việc của nó:'}</p>
${O31_BANG}

<h3>${en ? 'Pinning the borrow branch of BookServlet' : 'Khoá nhánh mượn sách của BookServlet'}</h3>
<p>${en
  ? 'Now the real target. <code>doPost</code> needs a request, a response and a session — Mockito fakes those. It also calls <code>DBUtil.getConnection()</code>, a static method we cannot replace… but we do not need to: <code>DBUtil</code> reads the <code>DB_URL</code> environment variable first. That is an accidental <strong>seam</strong> (lesson 3.3): the test points the real code at the lab database without editing a line. Mockito basics are in the Spring Boot course 11.2; here we only use <code>mock</code>, <code>when</code> and <code>doAnswer</code>.'
  : 'Giờ tới mục tiêu thật. <code>doPost</code> cần request, response và session — Mockito làm giả mấy thứ đó. Nó còn gọi <code>DBUtil.getConnection()</code>, một hàm static ta không thay được… nhưng cũng không cần: <code>DBUtil</code> đọc biến môi trường <code>DB_URL</code> trước tiên. Đó là một <strong>seam</strong> vô tình có sẵn (bài 3.3): test trỏ code thật vào CSDL lab mà không sửa dòng nào. Mockito căn bản đã dạy ở khoá Spring Boot 11.2; ở đây chỉ dùng <code>mock</code>, <code>when</code> và <code>doAnswer</code>.'}</p>
${C31_SERVLET}
${O31_SERVLET}
<p>${en
  ? 'Eight tests passed on the first run — our reading in Chapter 2 was right, including the off-by-one: the test named <code>…_BUG_TV41</code> proves a student with 3 books gets a fourth. The two <code>"?"</code> tests reveal behaviour nobody wrote down: a non-numeric <code>readerId</code> prints a raw SQL error into the page with status 200, and an unknown <code>bookId</code> crashes on an unchecked <code>rs.next()</code>. Paste both messages in, run again:'
  : 'Tám test qua ngay lần đầu — đọc code ở Chương 2 của ta đúng, kể cả lỗi lệch một: test tên <code>…_BUG_TV41</code> chứng minh sinh viên có 3 cuốn vẫn mượn được cuốn thứ tư. Hai test <code>"?"</code> lộ ra hành vi chưa ai ghi lại: <code>readerId</code> không phải số thì lỗi SQL thô được in thẳng ra trang với mã 200, còn <code>bookId</code> không tồn tại thì sập ở một <code>rs.next()</code> không được kiểm. Dán hai thông điệp đó vào test, chạy lại:'}</p>
${O31_XANH}
<p>${en
  ? '“Unknown column <code>\'abc\'</code> in where clause” is worth a second look: it means the text you typed became part of the SQL. That is the injection candidate from lesson 2.2, now confirmed by a test — Chapter 6.3 exploits and fixes it.'
  : '"Unknown column <code>\'abc\'</code> in where clause" đáng nhìn kỹ lần nữa: nó nghĩa là chữ bạn gõ đã trở thành một phần của câu SQL. Đó là ứng viên injection ở bài 2.2, giờ được một test xác nhận — bài 6.3 sẽ khai thác và sửa nó.'}</p>

<h3>${en ? 'The Node side: the same rule, copied — and not the same' : 'Phía Node: cùng một luật, chép sang — mà không giống'}</h3>
<p>${en
  ? `The second lab repo, <code>legacy-express</code> (<a href="${ZIP_EXPRESS}">download</a>), is the 2018 API for the library’s mobile app: Node 14, Express 4.17, callbacks, <code>moment</code>, Jest 26. Its fine calculation says in a comment that it was copied from <code>BookServlet</code>:`
  : `Repo lab thứ hai, <code>legacy-express</code> (<a href="${ZIP_EXPRESS}">tải về</a>), là API năm 2018 cho app di động của thư viện: Node 14, Express 4.17, callback, <code>moment</code>, Jest 26. Hàm tính phí của nó ghi rõ trong chú thích là chép từ <code>BookServlet</code>:`}</p>
${J31_PHI}
${J31_TEST}
${O31_JEST}
<p>${en
  ? 'Same recipe, same reward. Loan 1 is 9 days and 1 hour late; the Node API charges <strong>20,000</strong> because <code>Math.ceil</code> rounds 9.04 days up to 10. <code>BookServlet</code> casts to <code>int</code>, which drops the fraction: 9 × 2,000 = <strong>18,000</strong> (measured in lesson 3.3). The mobile app and the librarian’s screen disagree about the same loan. And <code>/api/phieu/abc/phi</code> quietly returns 404 because <code>==</code> compares <code>"abc"</code> with numbers. Pin all of it, comment the disagreement, and report it — do not “fix” it in passing.'
  : 'Cùng công thức, cùng phần thưởng. Phiếu 1 trễ 9 ngày 1 giờ; API Node thu <strong>20.000</strong> vì <code>Math.ceil</code> làm tròn 9,04 ngày lên 10. <code>BookServlet</code> ép kiểu <code>int</code>, bỏ phần lẻ: 9 × 2.000 = <strong>18.000</strong> (đo ở bài 3.3). App di động và màn hình thủ thư nói hai con số khác nhau cho cùng một phiếu. Còn <code>/api/phieu/abc/phi</code> lặng lẽ trả 404 vì <code>==</code> so <code>"abc"</code> với số. Khoá hết lại, ghi chú chỗ lệch, báo lên — đừng "tiện tay sửa".'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — a test that pins a forgeable token' : 'Góc hacker — một test khoá chặt token giả được'}</h3>
<p>${en
  ? 'Our very first test pinned <code>makeToken("admin")</code>. Read <code>TokenUtil</code>: the token is <code>MD5(username + "thuvien2016")</code>, and the “remember me” cookie is <code>username:token</code>. Anyone who has seen this source (an ex-employee, a leaked repo) can compute the cookie for any user. On <strong>your own lab only</strong>:'
  : 'Test đầu tiên của ta khoá <code>makeToken("admin")</code>. Đọc <code>TokenUtil</code>: token là <code>MD5(username + "thuvien2016")</code>, còn cookie "ghi nhớ đăng nhập" là <code>username:token</code>. Ai từng thấy mã nguồn này (nhân viên cũ, repo bị lộ) đều tự tính được cookie cho bất kỳ tài khoản nào. <strong>Chỉ trên lab của chính bạn</strong>:'}</p>
${out(`
$ echo -n adminthuvien2016 | md5sum
a316eabce65f3759e1ce2d96db99486c  -
$ curl -s -o /dev/null -c cj -b "remember=admin:a316eabce65f3759e1ce2d96db99486c" -w "%{http_code} %{redirect_url}\\n" localhost:18080/thuvien/login
302 http://localhost:18080/thuvien/books
$ curl -s -b cj localhost:18080/thuvien/books | grep -o "Xin ch[^|]*"
Xin chÃ o admin
`)}
<p>${en
  ? 'Logged in as admin without a password (the garbled greeting is the header encoding bug from Chapter 1, still there). The same class of flaw — a “remember me” cookie protected by a key hard-coded in the source — is CVE-2016-4437 in Apache Shiro ≤ 1.2.4, exploited at scale for years. The lesson for maintenance: <strong>a characterization test that pins a security flaw must be marked as such</strong> (name it, link a ticket), so nobody mistakes it for a requirement. Chapter 6.3 replaces the token.'
  : 'Đăng nhập thành admin không cần mật khẩu (lời chào lỗi font là bug mã hoá ở header từ Chương 1, vẫn còn đó). Cùng loại lỗ hổng — cookie "ghi nhớ đăng nhập" được bảo vệ bằng một khoá viết cứng trong mã nguồn — chính là CVE-2016-4437 của Apache Shiro ≤ 1.2.4, bị khai thác hàng loạt suốt nhiều năm. Bài học cho người bảo trì: <strong>characterization test khoá một lỗ hổng bảo mật phải được đánh dấu rõ</strong> (đặt tên, gắn ticket), để không ai tưởng nó là yêu cầu nghiệp vụ. Bài 6.3 sẽ thay token này.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Your leader: “The customer says the fine on the app is wrong. Fix it today.” Wrong compared to what? With these tests you can answer in one message: “Web charges 18,000 and the app 20,000 for loan 1 — the app rounds partial days up. Which one does the customer consider correct? Both are pinned by tests; the fix is one line once we know.” That is a question a BA can answer in minutes, instead of a fix that might be reverted next week.'
  : 'Leader nhắn: "Khách bảo phí trên app sai. Sửa trong hôm nay nhé." Sai so với cái gì? Có bộ test này, bạn trả lời được trong một tin nhắn: "Với phiếu 1, web thu 18.000, app thu 20.000 — app làm tròn ngày lẻ lên. Khách coi bên nào là đúng ạ? Cả hai đã được test khoá; biết đáp án là sửa một dòng." Đó là câu hỏi BA trả lời trong vài phút, thay cho một bản sửa có thể bị revert tuần sau.'}</p>

<h3>🧪 ${en ? 'Practice (30 minutes)' : 'Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Add JUnit 5 to the lab without the vintage engine and record “Tests run”. Add the engine and record it again.' : 'Thêm JUnit 5 vào lab mà chưa có engine vintage, ghi lại "Tests run". Thêm engine rồi ghi lại lần nữa.'}</li>
<li>${en ? 'Write the fixture and <code>DuLieuTest.napLai()</code>; reproduce the double subtraction, then fix it.' : 'Viết fixture và <code>DuLieuTest.napLai()</code>; tái hiện lỗi trừ hai lần, rồi sửa.'}</li>
<li>${en ? 'Using the <code>"?"</code> recipe, write tests for: unknown reader, book out of stock, not logged in, non-numeric <code>readerId</code>.' : 'Theo công thức <code>"?"</code>, viết test cho: độc giả không tồn tại, sách hết, chưa đăng nhập, <code>readerId</code> không phải số.'}</li>
<li>${en ? 'On <code>legacy-express</code>: pin <code>/api/phieu/5/phi</code> (returned loan) and <code>/api/phieu/999/phi</code>.' : 'Trên <code>legacy-express</code>: khoá <code>/api/phieu/5/phi</code> (phiếu đã trả) và <code>/api/phieu/999/phi</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '“Tests run” is never lower than before your change, every test is green, and each test that pins a bug says so in its name.' : '"Tests run" không bao giờ thấp hơn trước khi bạn sửa, mọi test xanh, và test nào khoá bug thì tên nói rõ điều đó.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Characterization test', 'test đặc tả hành vi hiện tại', 'Test ghi lại code đang làm gì, kể cả hành vi sai.', 'A test that records what the code does now, including wrong behaviour.'],
  ['Test harness', 'khung test', 'Môi trường gọi được đoạn code từ test (JUnit, Jest + mock).', 'The setup that lets a test call the code (JUnit, Jest + mocks).'],
  ['Vintage engine', 'engine chạy JUnit 4', 'Cho JUnit Platform chạy được test JUnit 3/4 cũ.', 'Lets the JUnit Platform run old JUnit 3/4 tests.'],
  ['Fixture', 'dữ liệu dựng sẵn', 'Trạng thái biết trước nạp lại trước mỗi test.', 'A known state reloaded before each test.'],
  ['Pinning', 'khoá hành vi', 'Viết khẳng định đúng bằng output hiện tại để mọi thay đổi đều lộ ra.', 'Asserting the current output so any change shows up.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Characterization tests describe what the code does, not what it should do; pinning a bug is correct.' : 'Characterization test mô tả code đang làm gì, không phải đáng ra phải làm gì; khoá cả bug là đúng.'}</li>
<li>${en ? 'Recipe: call it, assert <code>"?"</code>, read the failure, paste the real value.' : 'Công thức: gọi nó, khẳng định <code>"?"</code>, đọc lỗi, dán giá trị thật.'}</li>
<li>${en ? 'Adding JUnit 5 silently drops JUnit 4 tests until you add the vintage engine — compare test counts.' : 'Thêm JUnit 5 làm test JUnit 4 im lặng biến mất cho tới khi có engine vintage — hãy so số test.'}</li>
<li>${en ? 'Database logic (triggers) also runs on test data.' : 'Logic trong CSDL (trigger) cũng chạy trên dữ liệu test.'}</li>
<li>${en ? 'Java and Node implementations of “the same rule” disagree (18,000 vs 20,000) — pin both, report the gap.' : 'Bản Java và bản Node của "cùng một luật" nói khác nhau (18.000 và 20.000) — khoá cả hai, báo chỗ lệch.'}</li>
</ul>

${lk(bai('testing', 'tst-10-2-code-cu'), '🧪', en ? 'Testing 10.2 — Adding tests to legacy code' : 'Testing 10.2 — Thêm test cho code cũ', en ? 'The concept, link seams and a Node walkthrough' : 'Khái niệm, link seam và ví dụ Node đầy đủ')}
${lk(bai('spring-boot', 'sb-11-2-mockito'), '🍃', en ? 'Spring Boot 11.2 — Mockito' : 'Spring Boot 11.2 — Mockito', en ? 'mock, when, verify from the start' : 'mock, when, verify từ đầu')}
${tl('https://junit.org/junit5/docs/5.11.4/user-guide/#migrating-from-junit4', '📘', 'JUnit 5 User Guide — Migrating from JUnit 4', en ? 'The vintage engine' : 'Engine vintage')}
${tl('https://michaelfeathers.silvrback.com/characterization-testing', '📗', 'Michael Feathers — Characterization Testing', en ? 'The author’s own short explanation' : 'Lời giải thích ngắn của chính tác giả')}
${tl('https://nvd.nist.gov/vuln/detail/CVE-2016-4437', '🛡️', 'NVD — CVE-2016-4437 (Apache Shiro rememberMe)', en ? 'Hard-coded key behind a remember-me cookie' : 'Khoá viết cứng sau cookie ghi nhớ đăng nhập')}
`
);

/* ═══════════════════ 3.2 — Golden master ═══════════════════ */
const B32_GOLDEN = bash(`
#!/bin/bash
# tools/golden.sh <thư mục ra> — golden master qua HTTP cho ứng dụng ĐANG CHẠY:
# nạp lại dump (ngày tương đối) → đăng nhập → chụp 3 trang → thay ngày tuyệt đối bằng <NGAY>
set -euo pipefail
B=\${B:-http://localhost:18080/thuvien}
NAP=\${NAP:-docker compose exec -T db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien}
ra=$1; mkdir -p "$ra"; cj=$(mktemp)
# dump gốc không có DROP PROCEDURE ⇒ nạp lần 2 lỗi 1304; thêm dòng xoá trước
{ echo "DROP PROCEDURE IF EXISTS sp_overdue_report;"; cat db/thuvien.sql; } | $NAP 2>/dev/null
curl -s -c "$cj" -b "$cj" -o /dev/null -d "username=thuthu&password=123456" "$B/login"
for trang in books readers "report?days=1"; do
  ten=$(echo "$trang" | tr '?=' '__')
  curl -s -b "$cj" "$B/$trang" | sed -E 's#[0-9]{2}/[0-9]{2}/[0-9]{4}#<NGAY>#g' > "$ra/$ten.html"
done
rm -f "$cj"; wc -l "$ra"/*.html
`
);
const O32_CODINH = out(`
# Dữ liệu ngày CỐ ĐỊNH: chụp hôm nay, rồi giả lập "ngày mai" (lùi mọi mốc 1 ngày) và chụp lại
$ diff -r co-dinh-hom-nay co-dinh-ngay-mai
diff -r co-dinh-hom-nay/readers.html co-dinh-ngay-mai/readers.html
<     <td>4</td><td>Clean Code</td><td>Phạm Quốc Dũng</td><td>29/10/2026</td>
>     <td>4</td><td>Clean Code</td><td>Phạm Quốc Dũng</td><td>28/10/2026</td>
…
diff -r co-dinh-hom-nay/report_days_1.html co-dinh-ngay-mai/report_days_1.html
<     <tr><td>4</td><td>Phạm Quốc Dũng</td><td>Clean Code</td><td>25</td><td>50000.0</td></tr>
>     <tr><td>4</td><td>Phạm Quốc Dũng</td><td>Clean Code</td><td>26</td><td>52000.0</td></tr>
<     <tr><td>3</td><td>Lê Minh Châu</td><td>Cấu trúc dữ liệu và giải thuật</td><td>12</td><td>24000.0</td></tr>
>     <tr><td>3</td><td>Lê Minh Châu</td><td>Cấu trúc dữ liệu và giải thuật</td><td>13</td><td>26000.0</td></tr>
…
`
);
const O32_MOJIBAKE = out(`
# Lần nạp đầu tiên bằng client mysql mặc định — tiếng Việt trong fixture thành rác
<     <td>4</td><td>Clean Code</td><td>Pháº¡m Quá»‘c DÅ©ng</td><td>29/10/2026</td>
`
);
const O32_CHUP = out(`
$ tools/golden.sh golden && git add golden && git commit -m "test: golden master HTML 3 trang"
 145 golden/books.html
 125 golden/readers.html
  29 golden/report_days_1.html
 299 total
$ tools/golden.sh /tmp/lai && diff -r golden /tmp/lai && echo "0 khac biet"
0 khac biet
`
);
const O32_HEADER = out(`
# Sửa header.jsp: thêm <%@ page pageEncoding="UTF-8" %> ở dòng 1, build lại, chụp, so
$ diff -r golden /tmp/moi
diff -r golden/books.html /tmp/moi/books.html
7a8
>
9,14c10,15
<   <b>THÆ¯ VIá»N</b> |
<   <a style="color:#fff" href="books">SÃ¡ch</a> |
<   <a style="color:#fff" href="readers">Äá»c giáº£</a> |
<   <a style="color:#fff" href="report">QuÃ¡ háº¡n (3)</a> |
<   Xin chÃ o thuthu |
<   <a style="color:#fff" href="login?action=logout">ThoÃ¡t</a>
---
>   <b>THƯ VIỆN</b> |
>   <a style="color:#fff" href="books">Sách</a> |
>   <a style="color:#fff" href="readers">Độc giả</a> |
>   <a style="color:#fff" href="report">Quá hạn (3)</a> |
>   Xin chào thuthu |
>   <a style="color:#fff" href="login?action=logout">Thoát</a>
diff -r golden/readers.html /tmp/moi/readers.html
… (cùng khối đó, ở cả 3 trang)
`
);
const C32_APPROVAL = java(`
class ExportServletDacTaTest {

    @Test
    void xuatCsvSach() throws Exception {
        DuLieuTest.napLai();
        HttpServletResponse res = mock(HttpServletResponse.class);
        when(res.getWriter()).thenReturn(new PrintWriter(new StringWriter()));
        new ExportServlet().doGet(mock(HttpServletRequest.class), res);

        File[] moi = new File(".").listFiles((d, ten) -> ten.endsWith(".csv"));
        System.out.println("Tệp CSV vừa sinh: " + moi[0].getName());
        Approvals.verify(new String(Files.readAllBytes(moi[0].toPath()), "UTF-8"));
    }
}
`
);
const O32_APPROVAL = out(`
$ mvn -B test -Dtest=ExportServletDacTaTest
Tệp CSV vừa sinh: C:\\thuvien\\export\\books.csv
java.lang.Error:
Failed Approval
  Approved:/src/src/test/java/com/thuvien/servlet/ExportServletDacTaTest.xuatCsvSach.approved.txt
  Received:/src/src/test/java/com/thuvien/servlet/ExportServletDacTaTest.xuatCsvSach.received.txt
[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0
$ ls
C:\\thuvien\\export\\books.csv  Dockerfile  README.md  db  docker-compose.yml  golden  pom.xml  src  target  tools
$ cat src/test/java/com/thuvien/servlet/ExportServletDacTaTest.xuatCsvSach.received.txt
CNTT001,Lập trình Java căn bản,5
CNTT002,Cấu trúc dữ liệu và giải thuật,3
CNTT003,Clean Code,2
CNTT004,Refactoring,2
CNTT005,Working Effectively with Legacy Code,1
KT001,Kinh tế vi mô,4
NN001,Tiếng Nhật sơ cấp 1,6
$ mv …received.txt …approved.txt      # duyệt: đọc kỹ rồi mới đổi tên
`
);
const O32_CP1252 = out(`
# Cùng test, cùng mã — chỉ đổi bảng mã mặc định của JVM thành bảng mã của Windows tiếng Anh
$ mvn -B test -Dtest=ExportServletDacTaTest -DargLine="-Dfile.encoding=Cp1252"
[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0
$ diff …approved.txt …received.txt
1,2c1,2
< CNTT001,Lập trình Java căn bản,5
< CNTT002,Cấu trúc dữ liệu và giải thuật,3
---
> CNTT001,L?p tr�nh Java c?n b?n,5
> CNTT002,C?u tr�c d? li?u v� gi?i thu?t,3
`
);
const J32_SNAP = js(`
// __tests__/qua-han.snapshot.test.js — golden master kiểu Jest: lần đầu GHI, các lần sau SO
test('danh sách quá hạn', async () => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2026-11-24T10:00:00+07:00'));
  const res = await request(app).get('/api/phieu/qua-han');
  jest.useRealTimers();
  expect(res.body).toMatchSnapshot();
});
`
);
const O32_SNAP = out(`
$ npx jest __tests__/qua-han
 › 1 snapshot written.
$ cat __tests__/__snapshots__/qua-han.snapshot.test.js.snap
exports[\`danh sách quá hạn 1\`] = \`
Array [
  Object {
    "capNhat": "10:00 24/11/2026",
    "docGia": "Nguyễn Văn An",
    "loai": "SV",
    "phi": 20000,
    "phieu": 1,
    "sach": "Lập trình Java căn bản",
  },
  … (phiếu 3: GV 14000 · phiếu 4: KHACH 135000)
]
\`;

# Có người "dọn" lib/phi.js: Math.ceil → Math.floor
$ npx jest __tests__/qua-han
  ● danh sách quá hạn
    - Snapshot  - 3
    + Received  + 3
    -     "phi": 20000,
    +     "phi": 18000,
    -     "phi": 14000,
    +     "phi": 13000,
    -     "phi": 135000,
    +     "phi": 130000,
 › 1 snapshot failed from 1 test suite. Inspect your code changes or re-run jest with \`-u\` to update them.
`
);

const L32 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · A safety net before you touch anything' : 'Chương 3 · Dựng lưới an toàn trước khi chạm vào code'}</span>
<h2>${en ? '3.2 — Golden master and approval tests for reports, HTML and exports' : '3.2 — Golden master và approval test cho báo cáo, HTML và file xuất'}</h2>
<p class="lead">${en
  ? 'Some outputs are too big to assert line by line: a 145-line HTML page, a CSV for accounting, a JSON list for the mobile app. A golden master records the whole output once, you <em>approve</em> it, and from then on the test only asks “is it still identical?”. Like photographing a room before the renovation crew arrives — you do not describe every object, you compare photos.'
  : 'Có những output quá lớn để khẳng định từng dòng: một trang HTML 145 dòng, một tệp CSV cho phòng kế toán, một danh sách JSON cho app di động. Golden master ghi lại toàn bộ output một lần, bạn <em>duyệt</em> nó, rồi từ đó test chỉ hỏi "còn y hệt không?". Giống chụp ảnh căn phòng trước khi đội sửa nhà tới — không cần mô tả từng món đồ, chỉ cần so ảnh.'}</p>
${moiTruong(en)}

<h3>${en ? 'The three rules of a useful golden master' : 'Ba luật của một golden master dùng được'}</h3>
<ol>
<li>${en ? '<strong>Same input every time</strong> — reload the data before each capture.' : '<strong>Đầu vào lần nào cũng như nhau</strong> — nạp lại dữ liệu trước mỗi lần chụp.'}</li>
<li>${en ? '<strong>Freeze what you can, scrub what you cannot</strong> — clocks, generated ids, session ids.' : '<strong>Cố định được gì thì cố định, không được thì làm sạch</strong> — giờ hiện tại, id sinh tự động, mã phiên.'}</li>
<li>${en ? '<strong>A human approves the first version</strong> — the master is only as good as the moment you trusted it.' : '<strong>Người thật duyệt bản đầu tiên</strong> — golden master chỉ đáng tin bằng đúng khoảnh khắc bạn tin nó.'}</li>
</ol>

<h3>${en ? 'Golden master over HTTP for three pages' : 'Golden master qua HTTP cho ba trang'}</h3>
<p>${en
  ? 'The lowest-tech version needs no test framework: log in with <code>curl</code>, save the pages, compare with <code>diff</code>. It works on any stack — JSP, PHP, a COBOL screen behind a web gateway. First attempt: reuse the fixed-date fixture from 3.1. To see what “tomorrow” does without waiting a day, we shifted every date in the fixture back by one day (the same as one day passing) and captured again:'
  : 'Phiên bản ít công nghệ nhất không cần framework test nào: đăng nhập bằng <code>curl</code>, lưu các trang, so bằng <code>diff</code>. Nó chạy trên mọi stack — JSP, PHP, cả màn hình COBOL sau cổng web. Thử lần một: dùng lại fixture ngày cố định của 3.1. Để thấy "ngày mai" ra sao mà không phải chờ một ngày, ta lùi mọi mốc ngày trong fixture đi một ngày (tương đương một ngày trôi qua) rồi chụp lại:'}</p>
${O32_CODINH}
<p>${en
  ? 'Fourteen changed lines, and nothing in the code changed. Two clocks are involved: absolute due dates on the readers page, and <code>DATEDIFF(NOW(), due_date)</code> inside the stored procedure — which our Java tests cannot freeze because MySQL owns that clock. Here the dump’s original choice is actually the smart one: dates <em>relative</em> to <code>NOW()</code> keep “days late” and “estimated fine” stable forever, and only the absolute dates move. So the final script reloads the original dump and scrubs <code>dd/mm/yyyy</code> to <code>&lt;NGAY&gt;</code>:'
  : 'Mười bốn dòng khác, trong khi code không đổi gì. Có hai đồng hồ dính vào: ngày hạn trả tuyệt đối ở trang độc giả, và <code>DATEDIFF(NOW(), due_date)</code> trong stored procedure — cái mà test Java của ta không cố định được vì đồng hồ đó thuộc về MySQL. Ở đây lựa chọn gốc của dump lại là lựa chọn khôn: ngày <em>tương đối</em> theo <code>NOW()</code> giữ "số ngày trễ" và "phí dự kiến" ổn định mãi mãi, chỉ ngày tuyệt đối là trôi. Vậy script cuối cùng nạp lại dump gốc và thay <code>dd/mm/yyyy</code> thành <code>&lt;NGAY&gt;</code>:'}</p>
${B32_GOLDEN}
<p>${en
  ? 'Two real traps hit while writing this script, both now in its comments. Loading Vietnamese text through the <code>mysql</code> client without <code>--default-character-set=utf8mb4</code> stores garbage (the first capture looked like the block below). And the dump has no <code>DROP PROCEDURE</code>, so loading it a second time fails with error 1304 — which <code>set -e</code> turned into an empty, silent golden folder until we noticed.'
  : 'Hai cái bẫy thật đã dính khi viết script này, giờ nằm trong chú thích của nó. Nạp chữ Việt qua client <code>mysql</code> mà thiếu <code>--default-character-set=utf8mb4</code> thì lưu vào toàn rác (lần chụp đầu trông như khối dưới). Và dump không có <code>DROP PROCEDURE</code>, nên nạp lần hai lỗi 1304 — <code>set -e</code> biến lỗi đó thành một thư mục golden rỗng, im lặng, tới khi ta để ý.'}</p>
${O32_MOJIBAKE}
${O32_CHUP}
<p>${en
  ? 'Two captures, zero differences: the master is deterministic. Commit it. Now make a change everyone agrees is harmless — Chapter 1’s fix for the garbled menu, one line in <code>header.jsp</code> — rebuild and compare:'
  : 'Hai lần chụp, không khác một dòng: golden master đã tất định. Commit nó. Giờ làm một thay đổi ai cũng cho là vô hại — bản sửa menu lỗi font của Chương 1, một dòng trong <code>header.jsp</code> — build lại và so:'}</p>
${O32_HEADER}
<p>${en
  ? 'Exactly what we wanted: the menu is now readable on all three pages. But also an extra blank line at line 8 that nobody asked for — the new directive line produces it. Harmless in a browser; in an export consumed by another program a blank line can break a parser. That is the value of a golden master: it shows <em>every</em> effect of a change, and a human decides which ones are intended. Once approved, copy the new capture over <code>golden/</code> in the same PR as the fix. (If whitespace noise bothers you, <code>diff -B</code> ignores blank lines — decide that on purpose, not by accident.)'
  : 'Đúng thứ ta muốn: menu giờ đọc được trên cả ba trang. Nhưng còn một dòng trống thừa ở dòng 8 mà không ai yêu cầu — dòng chỉ thị mới sinh ra nó. Vô hại với trình duyệt; còn trong một tệp xuất cho chương trình khác đọc thì một dòng trống có thể làm hỏng bộ phân tích. Đó là giá trị của golden master: nó cho thấy <em>mọi</em> hệ quả của một thay đổi, và người thật quyết định cái nào là có chủ đích. Duyệt xong thì chép bản chụp mới đè lên <code>golden/</code> trong cùng PR với bản sửa. (Nếu nhiễu khoảng trắng làm phiền, <code>diff -B</code> bỏ qua dòng trống — hãy quyết định điều đó có chủ ý, đừng để vô tình.)'}</p>

<h3>${en ? 'Approval tests inside JUnit: the accounting CSV' : 'Approval test trong JUnit: tệp CSV cho kế toán'}</h3>
<p>${en
  ? '<strong>ApprovalTests</strong> (approvaltests.com, by Llewellyn Falco) packages the same idea as a library: <code>Approvals.verify(text)</code> writes <code>*.received.txt</code>, compares it with <code>*.approved.txt</code> next to the test, and fails if they differ. Version 32.2.0 is still compiled for Java 8 (we checked the class file version, as in lesson 1.2). We point it at <code>ExportServlet</code>, the CSV export for accounting from 2017 (disabled in <code>web.xml</code>, but still in the code):'
  : '<strong>ApprovalTests</strong> (approvaltests.com, của Llewellyn Falco) đóng gói đúng ý tưởng đó thành thư viện: <code>Approvals.verify(chuoi)</code> ghi <code>*.received.txt</code>, so với <code>*.approved.txt</code> nằm cạnh test, khác là đỏ. Bản 32.2.0 vẫn biên dịch cho Java 8 (ta đã kiểm phiên bản tệp class, như bài 1.2). Ta chĩa nó vào <code>ExportServlet</code>, chức năng xuất CSV cho kế toán năm 2017 (đã tắt trong <code>web.xml</code>, nhưng vẫn còn trong code):'}</p>
${C32_APPROVAL}
${O32_APPROVAL}
<p>${en
  ? 'The first run always fails — there is nothing approved yet. Read the received file, decide it is today’s truth, rename it to <code>.approved.txt</code>, commit it; add <code>*.received.*</code> to <code>.gitignore</code>. But look at <code>ls</code>: a file literally named <code>C:\\thuvien\\export\\books.csv</code> appeared in the project folder. <code>Constants.EXPORT_DIR</code> is “anh Tuấn’s machine” (<code>C:\\thuvien\\export\\</code>); on Linux a backslash is an ordinary filename character. On the production server — whatever OS it was — the export went to a path nobody knew. Lesson 3.3 adds a seam so the test no longer touches the disk.'
  : 'Lần chạy đầu bao giờ cũng đỏ — chưa có gì được duyệt. Đọc tệp received, xác nhận đó là sự thật hôm nay, đổi tên thành <code>.approved.txt</code>, commit; thêm <code>*.received.*</code> vào <code>.gitignore</code>. Nhưng nhìn lệnh <code>ls</code>: một tệp tên đúng nguyên văn <code>C:\\thuvien\\export\\books.csv</code> vừa hiện ra trong thư mục dự án. <code>Constants.EXPORT_DIR</code> là "máy của anh Tuấn" (<code>C:\\thuvien\\export\\</code>); trên Linux dấu gạch chéo ngược là ký tự bình thường trong tên tệp. Trên server thật — hệ điều hành gì cũng vậy — tệp xuất đã nằm ở một đường dẫn không ai biết. Bài 3.3 thêm một seam để test thôi đụng vào ổ đĩa.'}</p>
<p>${en
  ? 'One more experiment, because the original team worked on Windows. <code>FileWriter</code> in Java 8 uses the JVM’s <em>default</em> charset. Same code, same test, only the default charset changed to the one of an English Windows:'
  : 'Thêm một thí nghiệm, vì đội gốc làm trên Windows. <code>FileWriter</code> trong Java 8 dùng bảng mã <em>mặc định</em> của JVM. Cùng mã, cùng test, chỉ đổi bảng mã mặc định thành bảng mã của Windows tiếng Anh:'}</p>
${O32_CP1252}
<p>${en
  ? 'Every Vietnamese letter outside Windows-1252 became <code>?</code>; the ones that exist in it (ì, ú, à) became single bytes that a UTF-8 reader shows as <code>�</code>. So the accounting CSV depended on <em>which machine</em> ran Tomcat — a fact no document mentions, found in five minutes by an approval test. Write it on your Chapter 2 risk list. (Java 18 made UTF-8 the default everywhere, JEP 400 — one more reason the upgrade in Chapter 7 needs this test.)'
  : 'Mọi chữ Việt nằm ngoài bảng mã Windows-1252 đều thành <code>?</code>; chữ nào có trong bảng đó (ì, ú, à) thành một byte đơn mà trình đọc UTF-8 hiện ra là <code>�</code>. Vậy tệp CSV của kế toán phụ thuộc vào <em>máy nào</em> chạy Tomcat — điều không tài liệu nào nhắc tới, được approval test tìm ra trong năm phút. Ghi nó vào danh sách rủi ro ở Chương 2. (Java 18 đặt UTF-8 làm mặc định ở mọi nơi, JEP 400 — thêm một lý do cuộc nâng cấp ở Chương 7 cần test này.)'}</p>

<h3>${en ? 'The Node side: Jest snapshots are approval tests' : 'Phía Node: snapshot của Jest chính là approval test'}</h3>
${J32_SNAP}
${O32_SNAP}
<p>${en
  ? 'The snapshot file is the approved file; <code>jest -u</code> is “approve the received”. The danger is the same as with any approval tool: pressing <code>-u</code> without reading. Here someone “tidied” rounding from <code>ceil</code> to <code>floor</code>, and the snapshot shows every fine dropping — which happens to make Node agree with Java (18,000 / 13,000 / 130,000). Maybe that is the desired fix! But it is a <strong>behaviour change</strong>, and it belongs in its own PR with the customer’s decision, not inside a refactor. More on snapshots and the Node golden master in Testing 10.2.'
  : 'Tệp snapshot là tệp approved; <code>jest -u</code> là "duyệt bản received". Mối nguy cũng như với mọi công cụ approval: bấm <code>-u</code> mà không đọc. Ở đây có người "dọn" làm tròn từ <code>ceil</code> sang <code>floor</code>, và snapshot cho thấy mọi khoản phí đều giảm — vô tình làm Node khớp với Java (18.000 / 13.000 / 130.000). Có thể đó chính là bản sửa mong muốn! Nhưng nó là <strong>thay đổi hành vi</strong>, phải nằm trong PR riêng kèm quyết định của khách, không được lẫn trong một PR refactor. Snapshot và golden master phía Node có thêm ở Testing 10.2.'}</p>

<h3>${en ? 'Which tool for which output' : 'Công cụ nào cho output nào'}</h3>
<table>
<thead><tr><th>${en ? 'Output' : 'Output'}</th><th>${en ? 'Tool' : 'Công cụ'}</th><th>${en ? 'Scrub / freeze' : 'Làm sạch / cố định'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Rendered pages (JSP, Thymeleaf, PHP)' : 'Trang đã render (JSP, Thymeleaf, PHP)'}</td><td><code>curl</code> + <code>diff</code>, ${en ? 'or Playwright screenshots' : 'hoặc ảnh chụp Playwright'}</td><td>${en ? 'dates, session ids, CSRF tokens' : 'ngày, mã phiên, token CSRF'}</td></tr>
<tr><td>${en ? 'Files: CSV, Excel, PDF text' : 'Tệp: CSV, Excel, chữ trong PDF'}</td><td>ApprovalTests</td><td>${en ? 'file paths, generation timestamps' : 'đường dẫn tệp, giờ sinh tệp'}</td></tr>
<tr><td>${en ? 'JSON from an API' : 'JSON từ API'}</td><td>Jest <code>toMatchSnapshot</code>, ApprovalTests <code>verifyJson</code></td><td>${en ? 'clock (fake timers), ids, order' : 'đồng hồ (fake timer), id, thứ tự'}</td></tr>
<tr><td>${en ? 'Stored procedure result' : 'Kết quả stored procedure'}</td><td>${en ? 'SQL to text + approval' : 'SQL ra chữ + approval'}</td><td>${en ? 'relative dates in the data' : 'ngày tương đối trong dữ liệu'}</td></tr>
</tbody>
</table>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Ticket: “Move the overdue report from the stored procedure into Java.” A big, scary change across two languages. Before writing any Java, capture <code>report_days_1.html</code> with three different <code>days</code> values into the golden folder. Your new code is done when the diff is empty — or when every remaining line of the diff is written in the PR as an intended difference. That sentence alone makes a reviewer trust a large PR.'
  : 'Ticket: "Chuyển báo cáo quá hạn từ stored procedure sang Java." Một thay đổi lớn, đáng sợ, xuyên hai ngôn ngữ. Trước khi viết dòng Java nào, chụp <code>report_days_1.html</code> với ba giá trị <code>days</code> khác nhau vào thư mục golden. Code mới của bạn xong khi diff rỗng — hoặc khi mọi dòng còn lại trong diff đều được ghi vào PR là khác biệt có chủ đích. Riêng câu đó đã đủ để người review tin một PR lớn.'}</p>

<h3>🧪 ${en ? 'Practice (25 minutes)' : 'Thực hành (25 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Write <code>tools/golden.sh</code>, capture twice, confirm 0 differences, commit <code>golden/</code>.' : 'Viết <code>tools/golden.sh</code>, chụp hai lần, xác nhận 0 khác biệt, commit <code>golden/</code>.'}</li>
<li>${en ? 'Add <code>report?days=10</code> to the pages. Which loans disappear compared with <code>days=1</code>?' : 'Thêm <code>report?days=10</code> vào danh sách trang. So với <code>days=1</code>, phiếu nào biến mất?'}</li>
<li>${en ? 'Write the ApprovalTests test for <code>ExportServlet</code>; approve; run once with <code>-Dfile.encoding=Cp1252</code>.' : 'Viết test ApprovalTests cho <code>ExportServlet</code>; duyệt; chạy thử một lần với <code>-Dfile.encoding=Cp1252</code>.'}</li>
<li>${en ? 'In <code>legacy-express</code>, run the snapshot test without fake timers. Which field breaks it, and when?' : 'Trong <code>legacy-express</code>, chạy test snapshot mà bỏ fake timer. Trường nào làm nó vỡ, và vỡ lúc nào?'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'two consecutive captures are identical, the CSV is approved in git, and you can name the field that makes the snapshot time-dependent (<code>capNhat</code>, every minute).' : 'hai lần chụp liền nhau giống hệt, tệp CSV đã được duyệt trong git, và bạn gọi được tên trường khiến snapshot phụ thuộc thời gian (<code>capNhat</code>, đổi mỗi phút).'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Golden master', 'bản gốc chuẩn', 'Toàn bộ output được ghi lại một lần để so ở các lần sau.', 'The whole output recorded once and compared on later runs.'],
  ['Approval test', 'test duyệt', 'Test so output với tệp đã được người duyệt (approved).', 'A test comparing output with a human-approved file.'],
  ['Scrubber', 'bộ làm sạch', 'Bước thay phần đổi theo lần chạy (ngày, id) bằng chữ cố định.', 'A step replacing run-dependent parts (dates, ids) with fixed text.'],
  ['Snapshot', 'ảnh chụp kết quả', 'Golden master của Jest, lưu trong <code>__snapshots__</code>.', 'Jest’s golden master, stored in <code>__snapshots__</code>.'],
  ['Default charset', 'bảng mã mặc định', 'Bảng mã JVM dùng khi code không chỉ định; trước Java 18 phụ thuộc máy.', 'The charset the JVM uses when code does not specify one; machine-dependent before Java 18.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Same input, frozen or scrubbed clocks, human approval of the first version.' : 'Cùng đầu vào, đồng hồ được cố định hoặc làm sạch, người thật duyệt bản đầu.'}</li>
<li>${en ? 'Relative dates kept the report stable; absolute dates had to be scrubbed.' : 'Ngày tương đối giữ báo cáo ổn định; ngày tuyệt đối phải làm sạch.'}</li>
<li>${en ? 'A golden master shows every effect of a change — including the blank line nobody asked for.' : 'Golden master cho thấy mọi hệ quả của một thay đổi — kể cả dòng trống không ai yêu cầu.'}</li>
<li>${en ? 'Approval tests found a file named <code>C:\\thuvien\\export\\books.csv</code> and a machine-dependent CSV.' : 'Approval test tìm ra một tệp tên <code>C:\\thuvien\\export\\books.csv</code> và một CSV phụ thuộc máy.'}</li>
<li>${en ? '<code>jest -u</code> is an approval — read the diff first.' : '<code>jest -u</code> là một lần duyệt — đọc diff trước đã.'}</li>
</ul>

${lk(bai('testing', 'tst-10-2-code-cu'), '🧪', en ? 'Testing 10.2 — Step 4: a golden master' : 'Testing 10.2 — Bước 4: golden master', en ? 'The same idea on a Node codebase' : 'Cùng ý tưởng trên codebase Node')}
${tl('https://github.com/approvals/ApprovalTests.Java', '📘', 'ApprovalTests.Java', en ? 'verify, verifyJson, scrubbers, reporters' : 'verify, verifyJson, scrubber, reporter')}
${tl('https://jestjs.io/docs/snapshot-testing', '🃏', 'Jest — Snapshot Testing', en ? 'Property matchers, updating snapshots' : 'Property matcher, cập nhật snapshot')}
${tl('https://openjdk.org/jeps/400', '☕', 'JEP 400 — UTF-8 by Default (Java 18)', en ? 'Why FileWriter behaved differently per machine' : 'Vì sao FileWriter chạy khác nhau trên từng máy')}
`
);

/* ═══════════════════ 3.3 — Seam ═══════════════════ */
const D33_BAYGIO = out(`
$ git diff src/main
@@ -146,7 +146,7 @@ public class BookServlet extends HttpServlet {
                 Timestamp due = rs.getTimestamp("due_date");
                 rs.close();
-                long diff = System.currentTimeMillis() - due.getTime();
+                long diff = bayGio() - due.getTime();
                 int days = (int) (diff / (1000 * 60 * 60 * 24));
@@ -160,7 +160,7 @@ public class BookServlet extends HttpServlet {
                 ps = con.prepareStatement("UPDATE loans SET return_date = ?, fine = ? WHERE id = ?");
-                ps.setTimestamp(1, new Timestamp(System.currentTimeMillis()));
+                ps.setTimestamp(1, new Timestamp(bayGio()));
@@ -190,4 +190,9 @@ public class BookServlet extends HttpServlet {
+
+    /** Seam thời gian (Extract and Override Call): test ghi đè hàm này để cố định "bây giờ". */
+    protected long bayGio() {
+        return System.currentTimeMillis();
+    }
 }
`
);
const C33_TRA = java(`
class BookServletTraSachTest {

    // "Hôm nay" của test: 24/11/2026 10:00 giờ Việt Nam
    private static final long HOM_NAY = OffsetDateTime.parse("2026-11-24T10:00:00+07:00").toInstant().toEpochMilli();

    private final BookServlet servlet = new BookServlet() {
        @Override
        protected long bayGio() {           // lớp con ẩn danh ghi đè ĐÚNG MỘT hàm
            return HOM_NAY;
        }
    };

    @Test
    void sinhVienTre9Ngay1Gio() throws Exception {
        assertEquals("?", tra("1"));       // hạn 15/11 09:00
    }

    @Test
    void traHaiLanCungMotPhieu() throws Exception {
        tra("2");
        assertEquals("?", tra("2"));
    }
    // … giangVienTre13Ngay1Gio, khachTre26Ngay1Gio, chuaToiHan
}
`
);
const O33_TRA = out(`
$ mvn -B test -Dtest=BookServletTraSachTest
[ERROR] Tests run: 5, Failures: 5, Errors: 0, Skipped: 0, Time elapsed: 0.681 s <<< FAILURE! -- in com.thuvien.servlet.BookServletTraSachTest
[ERROR]   BookServletTraSachTest.chuaToiHan:68 expected: <?> but was: <readers?msg=Trả sách thành công>
[ERROR]   BookServletTraSachTest.giangVienTre13Ngay1Gio:58 expected: <?> but was: <readers?msg=Trả sách. Phí trễ hạn: 13000.0>
[ERROR]   BookServletTraSachTest.khachTre26Ngay1Gio:63 expected: <?> but was: <readers?msg=Trả sách. Phí trễ hạn: 130000.0>
[ERROR]   BookServletTraSachTest.sinhVienTre9Ngay1Gio:53 expected: <?> but was: <readers?msg=Trả sách. Phí trễ hạn: 18000.0>
[ERROR]   BookServletTraSachTest.traHaiLanCungMotPhieu:74 expected: <?> but was: <readers?msg=Trả sách thành công>
`
);
const O33_XANH = out(`
$ mvn -B test
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.037 s -- in com.thuvien.util.TokenUtilDacTaTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.029 s -- in com.thuvien.servlet.BookServletMuonSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.081 s -- in com.thuvien.servlet.ExportServletDacTaTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.191 s -- in com.thuvien.servlet.BookServletTraSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s -- in com.thuvien.util.TokenUtilTest
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`
);
const C33_SPROUT = java(`
package com.thuvien.service;

/**
 * TV-90: độc giả còn phiếu quá hạn thì không được mượn thêm.
 * Sprout class — logic MỚI viết ở lớp riêng, không phụ thuộc servlet/CSDL, test được trong vài mili giây.
 */
public final class KiemTraQuaHan {

    /** @param hanTraChuaTra hạn trả của các phiếu CHƯA trả; @param bayGio mốc thời gian (ms) */
    public static boolean coPhieuQuaHan(List<Timestamp> hanTraChuaTra, long bayGio) {
        for (Timestamp han : hanTraChuaTra) {
            if (han.getTime() < bayGio) {
                return true;
            }
        }
        return false;
    }

    private KiemTraQuaHan() { }
}
`
);
const C33_SPROUT_GOI = java(`
                String type = rs.getString("type");
                rs.close();
                if (KiemTraQuaHan.coPhieuQuaHan(hanTraChuaTra(con, readerId), bayGio())) {   // TV-90 (sprout)
                    response.sendRedirect("books?msg=" + URLEncoder.encode("Còn phiếu quá hạn", "UTF-8"));
                    return;
                }
                rs = st.executeQuery("SELECT COUNT(*) FROM loans WHERE reader_id = " + readerId + " AND return_date IS NULL");
    …
    /** TV-90: hạn trả các phiếu chưa trả — code mới dùng PreparedStatement, không nối chuỗi. */
    private List<Timestamp> hanTraChuaTra(Connection con, String readerId) throws Exception {
        List<Timestamp> kq = new ArrayList<Timestamp>();
        try (PreparedStatement p = con.prepareStatement("SELECT due_date FROM loans WHERE reader_id = ? AND return_date IS NULL")) {
            p.setInt(1, Integer.parseInt(readerId));
            try (ResultSet r = p.executeQuery()) {
                while (r.next()) kq.add(r.getTimestamp(1));
            }
        }
        return kq;
    }
`
);
const O33_SPROUT = out(`
$ mvn -B test
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.008 s -- in com.thuvien.service.KiemTraQuaHanTest
[ERROR] Tests run: 13, Failures: 2, Errors: 1, Skipped: 0, Time elapsed: 1.148 s <<< FAILURE! -- in com.thuvien.servlet.BookServletMuonSachTest
[ERROR]   BookServletMuonSachTest.giangVienDangMuon2_vanMuonDuoc:115 expected: <books?msg=Mượn thành công> but was: <books?msg=Còn phiếu quá hạn>
[ERROR]   BookServletMuonSachTest.khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41:84 expected: <books?msg=Mượn thành công> but was: <books?msg=Còn phiếu quá hạn>
[ERROR]   BookServletMuonSachTest.hanTraCuaGiangVien_la30Ngay:121 » SQL Illegal operation on empty result set.
[ERROR] Tests run: 25, Failures: 2, Errors: 1, Skipped: 0
`
);
const C33_WRAP = java(`
    /** TV-91: ghi nhật ký mọi thao tác POST (wrap method — hàm cũ giữ nguyên, chỉ đổi tên). */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long batDau = System.nanoTime();
        try {
            xuLyPost(request, response);
        } finally {
            log.info("AUDIT action=" + request.getParameter("action") + " user=" + request.getSession().getAttribute("user")
                    + " ms=" + (System.nanoTime() - batDau) / 1000000);
        }
    }

    private void xuLyPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("user") == null) {
        … (thân doPost cũ, không đổi một ký tự)
`
);
const O33_WRAP = out(`
$ mvn -B test
03:31:00 INFO  BookServlet - AUDIT action=borrow user=thuthu ms=16
03:31:00 INFO  BookServlet - AUDIT action=borrow user=thuthu ms=9
…
03:31:01 INFO  BookServlet - AUDIT action=borrow user=null ms=0
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`
);
const C33_EXPORT = java(`
// ExportServlet: "new FileWriter(...)" chuyển vào một hàm protected — đổi 3 dòng
            fw = moTepXuat();
    …
    /** Seam (Extract and Override Factory Method): test ghi đè để nhận CSV vào bộ nhớ thay vì ổ C: của anh Tuấn. */
    protected Writer moTepXuat() throws IOException {
        return new FileWriter(Constants.EXPORT_DIR + "books.csv");
    }

// ExportServletDacTaTest: không còn đụng ổ đĩa, vẫn so với ĐÚNG tệp .approved.txt cũ
        StringWriter csv = new StringWriter();
        ExportServlet servlet = new ExportServlet() {
            @Override
            protected Writer moTepXuat() {
                return csv;
            }
        };
        servlet.doGet(mock(HttpServletRequest.class), res);
        Approvals.verify(csv.toString());
`
);
const J33_SEAM = js(`
// __tests__/phieu.seam.test.js — seam ở mức module: jest.mock thay lib/kho, không sửa dòng code cũ nào
jest.mock('../lib/kho');
const kho = require('../lib/kho');
const khoThat = jest.requireActual('../lib/kho');
const PHIEU_MO_COI = { id: 9, sach: 'X', docGia: 77, hanTra: '2026-11-01T09:00:00+07:00', ngayTra: null };

test('đọc dữ liệu lỗi ⇒ 500 và chữ thô', async () => {
  kho.doc.mockImplementation((ten, cb) => cb(new Error('EACCES')));
  const res = await request(app).get('/api/phieu/1/phi');
  expect([res.status, res.type, res.text]).toEqual([500, 'text/html', 'loi doc du lieu']);
});

test('độc giả đã bị xoá — bản giả THAY HẲN kho', async () => {
  kho.doc.mockImplementation((ten, cb) => cb(null, ten === 'phieu' ? [PHIEU_MO_COI] : []));
  const res = await request(app).get('/api/phieu/9/phi');
  expect([res.status, res.text.slice(0, 60)]).toEqual('?');
});
`
);
const O33_MOCK = out(`
  ● độc giả đã bị xoá — bản giả THAY HẲN kho
    Received: [500, "<!DOCTYPE html>
    <html lang=\\"en\\">
    …
    <pre>TypeError: Cannot read property &#39;ten&#39; of undefined<br> &nbsp; &nbsp;at cb (/app/routes/phieu.js:18:42)<br> …
`
);
const O33_THAT = out(`
# Máy chủ THẬT (node server.js), data/phieu.json có thêm phiếu 9 trỏ tới độc giả 77 không tồn tại
$ curl -s -w ' [%{http_code}]\\n' localhost:3000/api/phieu/9/phi
loi doc du lieu [500]
$ curl -s -w ' [%{http_code}]\\n' localhost:3000/api/phieu/1/phi
{"phieu":1,"docGia":"Nguyễn Văn An","hanTra":"15/11/2026","phi":18000} [200]
`
);
const J33_KHO = js(`
// lib/kho.js — try/catch bọc CẢ lời gọi cb
fs.readFile(path.join(__dirname, '..', 'data', ten + '.json'), 'utf8', function (err, s) {
  if (err) return cb(err);
  try {
    cb(null, JSON.parse(s));      // TypeError ném ra từ BÊN TRONG route cũng rơi vào catch này…
  } catch (e) {
    cb(e);                        // …và route bị gọi LẦN HAI, lần này với err
  }
});
`
);
const J33_THAT = js(`
test('độc giả đã bị xoá — kho THẬT, chỉ thêm dữ liệu: hành vi như máy chủ thật', async () => {
  kho.doc.mockImplementation((ten, cb) =>
    khoThat.doc(ten, (err, ds) => cb(err, ten === 'phieu' ? ds.concat([PHIEU_MO_COI]) : ds)));
  const res = await request(app).get('/api/phieu/9/phi');
  // try/catch quanh cb trong lib/kho.js bắt TypeError của route rồi gọi cb LẦN HAI với lỗi đó
  expect([res.status, res.text]).toEqual([500, 'loi doc du lieu']);
});
`
);
const O33_NODE = out(`
$ npx jest --verbose
PASS __tests__/phieu.seam.test.js
  ✓ đọc dữ liệu lỗi ⇒ 500 và chữ thô (19 ms)
  ✓ độc giả đã bị xoá — bản giả THAY HẲN kho: Express in stack trace (16 ms)
  ✓ độc giả đã bị xoá — kho THẬT, chỉ thêm dữ liệu: hành vi như máy chủ thật (3 ms)
PASS __tests__/qua-han.snapshot.test.js
  ✓ danh sách quá hạn (28 ms)
PASS __tests__/phieu.dac-ta.test.js
  ✓ phiếu không tồn tại (19 ms)
  ✓ phiếu đã trả (5 ms)
  ✓ SV trễ 9 ngày 1 giờ (5 ms)
  ✓ id không phải số (2 ms)
Tests:       8 passed, 8 total
Snapshots:   1 passed, 1 total
`
);

const L33 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · A safety net before you touch anything' : 'Chương 3 · Dựng lưới an toàn trước khi chạm vào code'}</span>
<h2>${en ? '3.3 — Seams and breaking dependencies: extract interface, sprout, wrap' : '3.3 — Seam và cắt phụ thuộc: tách interface, sprout, wrap'}</h2>
<p class="lead">${en
  ? 'A plumber who must replace a pipe first fits a shut-off valve: a place where the water can be stopped without touching anything else. A <strong>seam</strong> is that valve in code — a place where you can change what the code does <em>without editing it there</em>. Legacy code has few seams; this lesson shows how to find the hidden ones and how to add new ones with the smallest possible edit.'
  : 'Thợ nước muốn thay một đoạn ống thì trước hết lắp một van khoá: chỗ có thể ngắt nước mà không đụng gì khác. <strong>Seam</strong> chính là cái van đó trong code — chỗ bạn thay đổi được việc code làm <em>mà không phải sửa ngay tại đó</em>. Code cũ có rất ít seam; bài này chỉ cách tìm những seam đang ẩn và cách thêm seam mới bằng lần sửa nhỏ nhất có thể.'}</p>
${moiTruong(en)}

<h3>${en ? 'Feathers’ definition, and the seams you already used' : 'Định nghĩa của Feathers, và những seam bạn đã dùng'}</h3>
<p>${en
  ? '“A seam is a place where you can alter behavior in your program without editing in that place. Every seam has an <em>enabling point</em>, a place where you can make the decision to use one behavior or another.” (WELC, chapter 4). You already used three:'
  : '"Seam là chỗ bạn có thể thay đổi hành vi của chương trình mà không phải sửa tại chỗ đó. Mỗi seam có một <em>điểm kích hoạt</em>, nơi bạn quyết định dùng hành vi này hay hành vi kia." (WELC, chương 4). Bạn đã dùng ba seam rồi:'}</p>
<table>
<thead><tr><th>Seam</th><th>${en ? 'Where in the lab' : 'Ở đâu trong lab'}</th><th>${en ? 'Enabling point' : 'Điểm kích hoạt'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Environment seam' : 'Seam môi trường'}</td><td><code>DBUtil</code> ${en ? 'reads' : 'đọc'} <code>DB_URL</code></td><td>${en ? 'the variable set before the test JVM starts' : 'biến môi trường đặt trước khi JVM test chạy'}</td></tr>
<tr><td>${en ? 'Object seam' : 'Seam đối tượng'}</td><td><code>HttpServletRequest</code> ${en ? 'is an interface' : 'là interface'}</td><td>${en ? 'passing a Mockito mock to <code>doPost</code>' : 'truyền mock của Mockito vào <code>doPost</code>'}</td></tr>
<tr><td>${en ? 'Module seam (Node)' : 'Seam module (Node)'}</td><td><code>app.js</code> ${en ? 'exports the app; <code>server.js</code> listens' : 'xuất app; <code>server.js</code> mới listen'}</td><td><code>require('../app')</code> ${en ? 'in the test' : 'trong test'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'Where there is no seam, you create one with a tiny, mechanical edit — small enough to be safe without tests, because you need it <em>in order to</em> write tests. Feathers catalogues 24 such dependency-breaking techniques; four cover most servlet and Express code.'
  : 'Chỗ nào không có seam thì bạn tạo ra một seam bằng một lần sửa tí hon, máy móc — đủ nhỏ để an toàn dù chưa có test, vì bạn cần nó <em>để</em> viết test. Feathers liệt kê 24 kỹ thuật cắt phụ thuộc như vậy; bốn kỹ thuật dưới đây phủ gần hết code servlet và Express.'}</p>

<h3>${en ? '1. Extract and Override Call — freezing the clock' : '1. Extract and Override Call — đóng băng đồng hồ'}</h3>
<p>${en
  ? 'The return branch computes the fine from <code>System.currentTimeMillis()</code>. A test written today gives a different answer tomorrow. Move the call into a <code>protected</code> method — the IDE does it with Extract Method (<code>Ctrl+Alt+M</code> / <code>⌘⌥M</code>) — and a test subclass overrides it:'
  : 'Nhánh trả sách tính phí từ <code>System.currentTimeMillis()</code>. Test viết hôm nay ra đáp án khác ngày mai. Đưa lời gọi đó vào một hàm <code>protected</code> — IDE làm bằng Extract Method (<code>Ctrl+Alt+M</code> / <code>⌘⌥M</code>) — rồi lớp con trong test ghi đè nó:'}</p>
${D33_BAYGIO}
${C33_TRA}
${O33_TRA}
<p>${en
  ? 'Now the fine has a number we can trust: <strong>18,000</strong> for a student 9 days 1 hour late — the Java half of the disagreement from 3.1. And a new discovery: returning the same loan twice “succeeds” and adds a phantom copy to <code>books.available</code> (there is no <code>return_date IS NULL</code> check). Pin it with a comment, put it on the risk list. After pasting the values, the whole suite is green:'
  : 'Giờ khoản phí có một con số đáng tin: <strong>18.000</strong> cho sinh viên trễ 9 ngày 1 giờ — nửa phía Java của chỗ lệch ở 3.1. Và một phát hiện mới: trả cùng một phiếu hai lần vẫn "thành công" và cộng thêm một bản sách ma vào <code>books.available</code> (không có kiểm <code>return_date IS NULL</code>). Khoá lại kèm chú thích, đưa vào danh sách rủi ro. Dán giá trị xong, cả bộ test xanh:'}</p>
${O33_XANH}
<div class="callout"><p>${en
  ? '<strong>Why not <code>java.time.Clock</code> in the constructor?</strong> That is the clean design for new code. But Tomcat creates servlets with the no-argument constructor, so constructor injection is impossible here without a framework. A protected method (or a package-private setter) is the seam the container allows. Chapter 5 moves the fine into a service that <em>can</em> take a <code>Clock</code>.'
  : '<strong>Sao không truyền <code>java.time.Clock</code> qua constructor?</strong> Với code mới thì đó là thiết kế sạch. Nhưng Tomcat tạo servlet bằng constructor không tham số, nên tiêm qua constructor là không thể nếu không có framework. Hàm protected (hoặc setter mức package) là seam mà container cho phép. Chương 5 sẽ chuyển phần tính phí vào một service <em>nhận được</em> <code>Clock</code>.'}</p></div>

<h3>${en ? '2. Sprout Class — new logic, born tested' : '2. Sprout Class — logic mới, sinh ra đã có test'}</h3>
<p>${en
  ? 'New ticket TV-90: “readers with an overdue loan cannot borrow”. Writing the rule inside the 200-line <code>doPost</code> would add more untestable code. Instead, <strong>sprout</strong> it: write the rule in a new class with no servlet and no database, test it in milliseconds, and call it from the old code with as few lines as possible.'
  : 'Ticket mới TV-90: "độc giả còn phiếu quá hạn thì không được mượn". Viết luật ngay trong <code>doPost</code> 200 dòng là đẻ thêm code không test được. Thay vào đó, <strong>sprout</strong> (cho nảy mầm) nó: viết luật trong một lớp mới không servlet, không CSDL, test trong vài mili giây, rồi gọi nó từ code cũ bằng ít dòng nhất có thể.'}</p>
${C33_SPROUT}
${C33_SPROUT_GOI}
${O33_SPROUT}
<p>${en
  ? 'Read this output carefully — it is the most useful result in the chapter. The four new unit tests pass. And the characterization tests from 3.1 turned red in <strong>exactly</strong> the places TV-90 changes behaviour: a lecturer and a guest who hold overdue loans can no longer borrow. Without the safety net you would have discovered this from a user. Now each red test is a decision: update it on purpose (new message, or pick a reader without overdue loans) and list it in the PR as “behaviour changed by TV-90”.'
  : 'Đọc kỹ output này — đây là kết quả hữu ích nhất của cả chương. Bốn unit test mới qua. Và các characterization test từ 3.1 đỏ <strong>đúng</strong> những chỗ TV-90 làm đổi hành vi: một giảng viên và một khách đang có phiếu quá hạn giờ không mượn được nữa. Không có lưới an toàn thì bạn sẽ biết điều này từ người dùng. Giờ mỗi test đỏ là một quyết định: sửa nó có chủ đích (thông điệp mới, hoặc chọn độc giả không có phiếu quá hạn) và liệt kê trong PR là "hành vi đổi do TV-90".'}</p>
<div class="callout warn"><p>${en
  ? '<strong>A time bomb we just found:</strong> those borrow tests use the <em>real</em> clock while the fixture has fixed dates. Loan 3 was due on 11/11/2026; on any day after that, the lecturer “has an overdue loan”. Before TV-90 the borrow branch did not care about today’s date, so it did not matter. Rule: once code under test reads the clock, every test of it must freeze the clock — use the same <code>bayGio()</code> override in <code>BookServletMuonSachTest</code>.'
  : '<strong>Một quả bom hẹn giờ vừa lộ ra:</strong> các test mượn sách đó dùng đồng hồ <em>thật</em> trong khi fixture có ngày cố định. Phiếu 3 hạn trả 11/11/2026; từ sau ngày đó, giảng viên "có phiếu quá hạn". Trước TV-90 nhánh mượn không quan tâm hôm nay là ngày nào, nên không sao. Luật: khi code đang test đã đọc đồng hồ thì mọi test của nó phải đóng băng đồng hồ — dùng cùng cách ghi đè <code>bayGio()</code> trong <code>BookServletMuonSachTest</code>.'}</p></div>

<h3>${en ? '3. Wrap Method — adding behaviour around old code' : '3. Wrap Method — thêm hành vi bao quanh code cũ'}</h3>
<p>${en
  ? 'Ticket TV-91: “audit every POST with user and duration”. The new behaviour happens <em>before and after</em> the old one, not inside it. Rename the old method (IDE: Rename, <code>Shift+F6</code>), and give the old name a new body that wraps it:'
  : 'Ticket TV-91: "ghi nhật ký mọi POST kèm người dùng và thời gian xử lý". Hành vi mới xảy ra <em>trước và sau</em> hành vi cũ, không nằm bên trong nó. Đổi tên hàm cũ (IDE: Rename, <code>Shift+F6</code>), rồi cho cái tên cũ một thân mới bao lấy nó:'}</p>
${C33_WRAP}
${O33_WRAP}
<p>${en
  ? 'All 21 tests stay green: the old body did not change by one character, so the characterization tests prove the wrap added behaviour without altering any. Note the last line: the audit even logs anonymous attempts (<code>user=null</code>), which a security reviewer will like. <strong>Sprout or wrap?</strong> Sprout when the new logic is a <em>step inside</em> the flow (a new check); wrap when it happens <em>around</em> the whole flow (logging, timing, transactions). The class-level versions are Sprout Class and Wrap Class (a decorator).'
  : 'Cả 21 test vẫn xanh: thân cũ không đổi một ký tự, nên characterization test chứng minh lớp bọc chỉ thêm hành vi chứ không đổi hành vi nào. Để ý dòng cuối: nhật ký ghi cả lượt thử của người chưa đăng nhập (<code>user=null</code>), điều người rà soát bảo mật sẽ thích. <strong>Sprout hay wrap?</strong> Sprout khi logic mới là một <em>bước bên trong</em> luồng (một phép kiểm mới); wrap khi nó xảy ra <em>quanh</em> cả luồng (nhật ký, đo thời gian, giao dịch). Phiên bản mức lớp là Sprout Class và Wrap Class (một decorator).'}</p>

<h3>${en ? '4. Extract and Override Factory Method — keeping the test off the disk' : '4. Extract and Override Factory Method — giữ test khỏi đụng ổ đĩa'}</h3>
${C33_EXPORT}
<p>${en
  ? 'Three changed lines in production code. The approval test from 3.2 now receives the CSV in memory, no file named <code>C:\\thuvien\\…</code> appears, and — the important part — it still passes against the <em>same</em> <code>.approved.txt</code>. The golden master proved the seam did not change the output. Extract Interface is the same idea one level up: when a class talks to <code>FileWriter</code> or a payment gateway in many places, extract an interface for that collaborator and pass a fake.'
  : 'Ba dòng đổi trong code chạy thật. Approval test từ 3.2 giờ nhận CSV trong bộ nhớ, không còn tệp tên <code>C:\\thuvien\\…</code> nào hiện ra, và — điều quan trọng — nó vẫn qua với <em>đúng</em> tệp <code>.approved.txt</code> cũ. Golden master đã chứng minh seam không làm đổi output. Extract Interface là cùng ý đó ở tầng cao hơn: khi một lớp nói chuyện với <code>FileWriter</code> hay cổng thanh toán ở nhiều chỗ, tách một interface cho đối tác đó rồi truyền bản giả vào.'}</p>

<h3>${en ? 'Node: jest.mock is a seam — and seams can lie' : 'Node: jest.mock là một seam — và seam có thể nói dối'}</h3>
<p>${en
  ? 'In Node every <code>require</code> is a seam, because Jest can swap a module before the code under test loads it. That lets us reach the error branches of <code>routes/phieu.js</code> that real data never triggers:'
  : 'Trong Node mỗi <code>require</code> là một seam, vì Jest đổi được một module trước khi code đang test nạp nó. Nhờ đó ta chạm tới các nhánh lỗi của <code>routes/phieu.js</code> mà dữ liệu thật không bao giờ kích hoạt:'}</p>
${J33_SEAM}
${O33_MOCK}
<p>${en
  ? 'With the fake <code>kho</code>, a loan pointing to a deleted reader gives a 500 with Express’s HTML error page and a <strong>stack trace</strong>. We almost pinned that. Then we checked on the real server — always do this before trusting a mock:'
  : 'Với <code>kho</code> giả, một phiếu trỏ tới độc giả đã bị xoá cho ra 500 kèm trang lỗi HTML của Express và một <strong>stack trace</strong>. Suýt nữa ta khoá luôn điều đó. Rồi ta kiểm trên máy chủ thật — luôn làm bước này trước khi tin một bản giả:'}</p>
${O33_THAT}
<p>${en
  ? 'Different behaviour: plain text “loi doc du lieu”, no stack trace. Why? Look at the module the mock replaced:'
  : 'Hành vi khác: chữ thô "loi doc du lieu", không có stack trace. Vì sao? Nhìn vào chính module mà bản giả đã thay mất:'}</p>
${J33_KHO}
<p>${en
  ? 'The real <code>kho</code> wraps the <em>callback</em> in <code>try/catch</code>, so the route’s <code>TypeError</code> is caught there and the route is called a second time with the error — a classic “callback called twice” bug, which here happens to hide the crash behind a misleading message. The fake <code>kho</code> did not have that <code>try/catch</code>, so the test pinned a behaviour production never shows. Notice also that the second <code>curl</code> answered <strong>18,000</strong> at 03:45 while the test with a frozen 10:00 says 20,000 — the real clock again. The fix is to keep the real module and only change the data it returns:'
  : '<code>kho</code> thật bọc cả lời gọi <em>callback</em> trong <code>try/catch</code>, nên <code>TypeError</code> của route bị bắt ở đó và route bị gọi lần hai với lỗi — lỗi kinh điển "callback bị gọi hai lần", ở đây lại vô tình giấu vụ sập sau một thông điệp gây hiểu lầm. <code>kho</code> giả không có <code>try/catch</code> đó, nên test đã khoá một hành vi mà bản chạy thật không bao giờ có. Để ý thêm: <code>curl</code> thứ hai trả <strong>18.000</strong> lúc 03:45 trong khi test với giờ đóng băng 10:00 nói 20.000 — lại là đồng hồ thật. Cách sửa: giữ module thật, chỉ thay dữ liệu nó trả về:'}</p>
${J33_THAT}
${O33_NODE}
<div class="callout warn"><p>${en
  ? '<strong>Rule of thumb:</strong> a seam replaces <em>everything</em> on the other side of it, including bugs you did not know about. Put the seam as far out as possible (data, network, clock) and keep the real code in between.'
  : '<strong>Kinh nghiệm:</strong> seam thay <em>tất cả</em> những gì nằm phía bên kia nó, kể cả những bug bạn chưa biết. Đặt seam càng xa càng tốt (dữ liệu, mạng, đồng hồ) và giữ code thật ở giữa.'}</p></div>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'In review, a senior asks: “Why did you add <code>protected long bayGio()</code> to production code just for tests?” Good answer: “It is a seam with zero behaviour change — the override exists only in the test. It let me pin the fine rules (18,000 / 13,000 / 130,000) and find the double-return bug before touching anything. When we move the fine into a service in the refactor ticket, it becomes a <code>Clock</code> parameter and this method disappears.” Seams are temporary scaffolding; say so.'
  : 'Lúc review, anh senior hỏi: "Sao em thêm <code>protected long bayGio()</code> vào code chạy thật chỉ để phục vụ test?" Câu trả lời tốt: "Đây là seam không đổi hành vi nào — bản ghi đè chỉ có trong test. Nhờ nó em khoá được luật phí (18.000 / 13.000 / 130.000) và tìm ra lỗi trả hai lần trước khi đụng vào gì. Khi chuyển phần tính phí sang service ở ticket refactor, nó sẽ thành tham số <code>Clock</code> và hàm này biến mất." Seam là giàn giáo tạm; hãy nói rõ như vậy.'}</p>

<h3>🧪 ${en ? 'Practice (30 minutes)' : 'Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Add <code>bayGio()</code> with the IDE’s Extract Method; write the five return tests with the <code>"?"</code> recipe.' : 'Thêm <code>bayGio()</code> bằng Extract Method của IDE; viết năm test trả sách theo công thức <code>"?"</code>.'}</li>
<li>${en ? 'Freeze the clock in <code>BookServletMuonSachTest</code> too. Which date would have broken it before?' : 'Đóng băng đồng hồ trong cả <code>BookServletMuonSachTest</code>. Trước đó, ngày nào sẽ làm nó vỡ?'}</li>
<li>${en ? 'Sprout TV-90 on a branch. Record which characterization tests go red and why.' : 'Sprout TV-90 trên một nhánh riêng. Ghi lại characterization test nào đỏ và vì sao.'}</li>
<li>${en ? 'In <code>legacy-express</code>, reproduce the mock-vs-real difference, then write the test with <code>jest.requireActual</code>.' : 'Trong <code>legacy-express</code>, tái hiện chỗ khác nhau giữa bản giả và bản thật, rồi viết test với <code>jest.requireActual</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every seam you added is at most 5 changed lines of production code, and each one is named in a comment with the technique.' : 'mỗi seam bạn thêm tối đa 5 dòng đổi trong code chạy thật, và có chú thích ghi tên kỹ thuật.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Seam', 'đường nối', 'Chỗ đổi được hành vi mà không sửa tại đó.', 'A place to change behaviour without editing there.'],
  ['Enabling point', 'điểm kích hoạt', 'Nơi quyết định dùng hành vi thật hay hành vi thay thế.', 'Where you choose the real or the substitute behaviour.'],
  ['Extract and Override Call', 'tách rồi ghi đè lời gọi', 'Đưa lời gọi khó test vào hàm protected để lớp con trong test ghi đè.', 'Move a hard call into a protected method a test subclass overrides.'],
  ['Sprout Method/Class', 'cho nảy mầm', 'Viết logic mới ở hàm/lớp riêng có test, gọi từ code cũ.', 'Write new logic in a tested method/class, call it from old code.'],
  ['Wrap Method/Class', 'bọc hàm/lớp', 'Thêm hành vi trước/sau code cũ bằng cách bọc nó.', 'Add behaviour before/after old code by wrapping it.'],
  ['Callback called twice', 'callback bị gọi hai lần', 'Lỗi khi try/catch bao cả callback nên lỗi của bên gọi quay lại gọi lần hai.', 'A try/catch around a callback catches the caller’s error and calls it again.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'A seam has an enabling point; DB_URL, interfaces and <code>require</code> are seams you already have.' : 'Seam có điểm kích hoạt; DB_URL, interface và <code>require</code> là những seam bạn đã có sẵn.'}</li>
<li>${en ? 'Extract and Override Call froze the clock and revealed 18,000 and the double-return bug.' : 'Extract and Override Call đóng băng đồng hồ và lộ ra con số 18.000 cùng lỗi trả hai lần.'}</li>
<li>${en ? 'Sprout for a new step, wrap for around-the-flow; characterization tests show exactly which behaviours a ticket changes.' : 'Sprout cho bước mới, wrap cho thứ bao quanh luồng; characterization test chỉ đúng những hành vi mà ticket làm đổi.'}</li>
<li>${en ? 'Once code reads the clock, every test of it freezes the clock.' : 'Khi code đã đọc đồng hồ, mọi test của nó phải đóng băng đồng hồ.'}</li>
<li>${en ? 'A mock replaces the bugs behind it too — verify against the real thing.' : 'Bản giả thay luôn cả bug nằm sau nó — hãy đối chiếu với bản thật.'}</li>
</ul>

${lk(bai('testing', 'tst-10-2-code-cu'), '🧪', en ? 'Testing 10.2 — Link seams' : 'Testing 10.2 — Link seam', en ? 'Seams in a Node codebase, step 2 and 5' : 'Seam trong codebase Node, bước 2 và 5')}
${lk(bai('testing', 'tst-2-2-thoi-gian'), '⏱️', en ? 'Testing 2.2 — Testing time' : 'Testing 2.2 — Test thời gian', en ? 'Fake timers in depth' : 'Fake timer chi tiết')}
${tl('https://martinfowler.com/bliki/LegacySeam.html', '📗', 'Martin Fowler — Legacy Seam', en ? 'Feathers’ definition, applied to whole systems' : 'Định nghĩa của Feathers, áp lên cả hệ thống')}
${tl('https://jestjs.io/docs/jest-object#jestrequireactualmodulename', '🃏', 'Jest — jest.requireActual', en ? 'Keep the real module where it matters' : 'Giữ module thật ở chỗ cần')}
`
);

/* ═══════════════════ 3.4 — Test qua HTTP với Testcontainers ═══════════════════ */
const C34_TEST = java(`
@Testcontainers
class MuonSachQuaHttpTest {

    static final Path GOC = Path.of("..").toAbsolutePath().normalize();      // gốc repo cũ
    static final Network MANG = Network.newNetwork();

    @Container
    static final MySQLContainer DB = new MySQLContainer("mysql:8.0")
            .withNetwork(MANG).withNetworkAliases("db")
            .withDatabaseName("thuvien").withUsername("root").withPassword("123456")
            .withEnv("MYSQL_ROOT_HOST", "%")
            .withCopyFileToContainer(MountableFile.forHostPath(GOC.resolve("db/thuvien.sql")),
                    "/docker-entrypoint-initdb.d/01-thuvien.sql");                  // ĐÚNG dump của dự án

    @Container
    static final GenericContainer<?> WEB = new GenericContainer<>(
            new ImageFromDockerfile("thuvien-e2e", false)                         // ĐÚNG Dockerfile của dự án
                    .withFileFromPath("Dockerfile", GOC.resolve("Dockerfile"))
                    .withFileFromPath("pom.xml", GOC.resolve("pom.xml"))
                    .withFileFromPath("src", GOC.resolve("src")))
            .withNetwork(MANG).dependsOn(DB)
            .withEnv("DB_URL", "jdbc:mysql://db:3306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true")
            .withExposedPorts(8080)
            .waitingFor(Wait.forHttp("/thuvien/login").forStatusCode(200).withStartupTimeout(Duration.ofMinutes(3)));

    HttpClient http;

    HttpResponse<String> post(String duong, String form) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create(url(duong)))
                .header("Content-Type", "application/x-www-form-urlencoded")   // như trình duyệt: KHÔNG kèm charset
                .POST(HttpRequest.BodyPublishers.ofString(form)).build(), HttpResponse.BodyHandlers.ofString());
    }

    @BeforeEach
    void dangNhap() throws Exception {
        http = HttpClient.newBuilder().cookieHandler(new CookieManager()).build();   // không tự theo redirect
        assertEquals(302, post("login", "username=thuthu&password=123456").statusCode());
    }

    @Test
    void muonSach_302_phieuMoi_triggerTruSoSach() throws Exception {
        int truoc = so("SELECT available FROM books WHERE id = 4");
        HttpResponse<String> r = post("books", "action=borrow&bookId=4&readerId=5");
        assertEquals(302, r.statusCode());
        assertEquals("books?msg=Mượn thành công", URLDecoder.decode(r.headers().firstValue("Location").get(), StandardCharsets.UTF_8));
        assertEquals(truoc - 1, so("SELECT available FROM books WHERE id = 4"));
    }

    @Test
    void themSachTenTiengViet_luuDungDau() throws Exception {
        String ten = "Đọc hiểu mã nguồn cũ";
        post("books", "action=add&code=E2E01&title=" + URLEncoder.encode(ten, StandardCharsets.UTF_8) + "&author=Test&quantity=1");
        assertEquals(ten, chu("SELECT title FROM books WHERE code = 'E2E01'"));
    }

    @Test
    void moThangJsp_khongCanDangNhap() throws Exception {
        http = HttpClient.newHttpClient();                   // khách lạ, không cookie
        HttpResponse<String> sach = get("books.jsp");
        assertEquals(500, sach.statusCode());                // rủi ro trong bản đồ chương 2:
        assertTrue(sach.body().contains("JasperException"));  // error.jsp in stack trace + mã nguồn JSP
        assertEquals(200, get("report.jsp").statusCode());   // report.jsp hiện được cho người lạ
    }
    // url(), get(), so(), chu(): xem tệp đầy đủ trong lời giải Lab 3.5
}
`
);
const X34_POM = xml(`
<!-- e2e/pom.xml — dự án Maven RIÊNG, Java 17, không biên dịch chung với code Java 8 cũ -->
<properties>
  <maven.compiler.release>17</maven.compiler.release>
  <testcontainers.version>2.0.5</testcontainers.version>
</properties>
<dependencies>
  <dependency><groupId>org.junit.jupiter</groupId><artifactId>junit-jupiter</artifactId><version>5.11.4</version><scope>test</scope></dependency>
  <dependency><groupId>org.testcontainers</groupId><artifactId>testcontainers-junit-jupiter</artifactId><version>\${testcontainers.version}</version><scope>test</scope></dependency>
  <dependency><groupId>org.testcontainers</groupId><artifactId>testcontainers-mysql</artifactId><version>\${testcontainers.version}</version><scope>test</scope></dependency>
  <dependency><groupId>com.mysql</groupId><artifactId>mysql-connector-j</artifactId><version>8.4.0</version><scope>test</scope></dependency>
  <dependency><groupId>org.slf4j</groupId><artifactId>slf4j-simple</artifactId><version>2.0.16</version><scope>test</scope></dependency>
</dependencies>
`
);
const O34_LAN1 = out(`
$ cd e2e && /usr/bin/time -f "real %e s" mvn -B test   # lần đầu: kéo ảnh ryuk + dựng ảnh ứng dụng từ Dockerfile
[main] INFO tc.testcontainers/ryuk:0.14.0 - Container testcontainers/ryuk:0.14.0 started in PT0.375568159S
[main] INFO tc.mysql:8.0 - Container mysql:8.0 started in PT10.911995149S
[main] INFO tc.mysql:8.0 - Container is started (JDBC URL: jdbc:mysql://localhost:32897/thuvien)
[main] INFO tc.thuvien-e2e:latest - Container thuvien-e2e:latest started in PT1.845911425S
[ERROR] Tests run: 3, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 91.90 s <<< FAILURE! -- in com.thuvien.e2e.MuonSachQuaHttpTest
[ERROR]   MuonSachQuaHttpTest.trangJspMoTrucTiep_khongCanDangNhap:117 expected: <200> but was: <500>
real 109.33 s
`
);
const O34_LAN2 = out(`
$ /usr/bin/time -f "real %e s" mvn -B test            # lần sau: ảnh đã có trong bộ đệm Docker
[main] INFO tc.mysql:8.0 - Container mysql:8.0 started in PT9.767913355S
[main] INFO tc.thuvien-e2e:latest - Container thuvien-e2e:latest started in PT1.850920169S
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 13.84 s -- in com.thuvien.e2e.MuonSachQuaHttpTest
[INFO] BUILD SUCCESS
real 15.99 s
`
);
const O34_DOTBIEN = out(`
# Xoá dòng 78 của BookServlet: request.setCharacterEncoding("UTF-8");   — PIT ở Lab 3.5 báo đột biến này SỐNG với test Mockito
$ mvn -B test
[ERROR] Tests run: 3, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 14.16 s <<< FAILURE! -- in com.thuvien.e2e.MuonSachQuaHttpTest
[ERROR]   MuonSachQuaHttpTest.themSachTenTiengViet_luuDungDau:110 expected: <Đọc hiểu mã nguồn cũ> but was: <Äá»c hiá»u mÃ£ nguá»n cÅ©>
`
);

const L34 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · A safety net before you touch anything' : 'Chương 3 · Dựng lưới an toàn trước khi chạm vào code'}</span>
<h2>${en ? '3.4 — When nothing can be isolated: testing through HTTP and a real database (Testcontainers)' : '3.4 — Khi không tách được gì: test qua HTTP với cơ sở dữ liệu thật (Testcontainers)'}</h2>
<p class="lead">${en
  ? 'Sometimes there is no seam worth the risk: JSP scriptlets that query the database, a header included in every page, a filter chain nobody understands. Then you test the way a user uses it — over HTTP, against a real database — and treat the app as a black box. Like checking an old car by driving it around the block instead of opening the engine.'
  : 'Có lúc chẳng có seam nào đáng để mạo hiểm: scriptlet JSP truy vấn CSDL, một header được nhúng vào mọi trang, một chuỗi filter không ai hiểu. Khi đó bạn test theo cách người dùng dùng nó — qua HTTP, với CSDL thật — và coi ứng dụng là hộp đen. Giống kiểm một chiếc xe cũ bằng cách lái một vòng quanh khu phố thay vì mở máy ra xem.'}</p>
${moiTruong(en)}

<h3>${en ? 'Why a separate Java 17 module' : 'Vì sao là một module Java 17 riêng'}</h3>
<p>${en
  ? 'A black-box test does not need to compile with the code it tests; it only needs a URL. So we put it in its own Maven project, <code>e2e/</code>, on Java 17 — modern <code>HttpClient</code>, Testcontainers 2.x — while the app stays on Java 8. Bonus that matters later: when Chapter 7 upgrades the app to Java 17 and Tomcat 10, <strong>this test does not change at all</strong>. It is the one net that survives the upgrade it is meant to protect. Testcontainers for Node (and the concept) is in Testing 4.3; with Spring Boot, in Spring Boot 11.4.'
  : 'Test hộp đen không cần biên dịch cùng code mà nó kiểm; nó chỉ cần một URL. Vì vậy ta đặt nó trong một dự án Maven riêng, <code>e2e/</code>, chạy Java 17 — có <code>HttpClient</code> hiện đại, Testcontainers 2.x — trong khi ứng dụng vẫn ở Java 8. Lợi ích về sau mới thấy: khi Chương 7 nâng ứng dụng lên Java 17 và Tomcat 10, <strong>test này không đổi một dòng</strong>. Nó là tấm lưới duy nhất sống sót qua chính cuộc nâng cấp mà nó được dựng để bảo vệ. Testcontainers cho Node (và khái niệm) có ở Testing 4.3; với Spring Boot, ở Spring Boot 11.4.'}</p>
${X34_POM}

<h3>${en ? 'Two containers, one private network, the project’s own files' : 'Hai container, một mạng riêng, đúng tệp của dự án'}</h3>
<p>${en
  ? 'The test starts MySQL 8.0 loaded with <strong>the project’s dump</strong>, builds the app image from <strong>the project’s Dockerfile</strong>, puts both on a private network (the app reaches MySQL as <code>db</code>, exactly like Compose), waits until <code>/thuvien/login</code> answers 200, then talks HTTP. Nothing is mocked; Ryuk, a helper container, removes everything when the JVM exits.'
  : 'Test khởi động MySQL 8.0 nạp <strong>đúng dump của dự án</strong>, dựng ảnh ứng dụng từ <strong>đúng Dockerfile của dự án</strong>, đặt cả hai vào một mạng riêng (ứng dụng gọi MySQL bằng tên <code>db</code>, y như Compose), chờ tới khi <code>/thuvien/login</code> trả 200, rồi nói chuyện HTTP. Không có gì là giả; Ryuk, một container phụ, dọn sạch mọi thứ khi JVM kết thúc.'}</p>
${C34_TEST}
${O34_LAN1}
<p>${en
  ? 'The first run took 109 seconds — almost all of it building the WAR image and pulling Ryuk. Two tests passed; the third failed with <code>500</code> where we guessed <code>200</code>. That is the characterization recipe again, at HTTP level: <code>books.jsp</code> opened directly crashes and <code>error.jsp</code> prints a stack trace with JSP source lines (the risk from your Chapter 2 map), while <code>report.jsp</code> really does render for a stranger. We pinned both. Second run:'
  : 'Lần đầu mất 109 giây — gần như toàn bộ là dựng ảnh WAR và kéo Ryuk. Hai test qua; test thứ ba đỏ với <code>500</code> trong khi ta đoán <code>200</code>. Lại là công thức characterization, ở mức HTTP: mở thẳng <code>books.jsp</code> thì sập và <code>error.jsp</code> in stack trace kèm các dòng mã JSP (rủi ro trong bản đồ Chương 2 của bạn), còn <code>report.jsp</code> thì đúng là hiện ra cho người lạ. Ta khoá cả hai. Lần chạy thứ hai:'}</p>
${O34_LAN2}

<h3>${en ? 'What only this kind of test can catch' : 'Thứ chỉ loại test này mới bắt được'}</h3>
<p>${en
  ? 'In Lab 3.5, PIT reports that removing <code>request.setCharacterEncoding("UTF-8")</code> from <code>doPost</code> <em>survives</em> all the Mockito tests: a mock returns whatever string you told it to; there is no byte decoding to get wrong. Over real HTTP it is a different story. Our first version of this test still passed after deleting the line — because it sent <code>Content-Type: …; charset=UTF-8</code>, which browsers do not send for forms, so Tomcat decoded correctly anyway. After making the request look like a browser’s:'
  : 'Ở Lab 3.5, PIT báo rằng xoá <code>request.setCharacterEncoding("UTF-8")</code> khỏi <code>doPost</code> vẫn <em>sống sót</em> qua mọi test Mockito: mock trả đúng chuỗi bạn bảo nó trả; chẳng có bước giải mã byte nào để sai. Qua HTTP thật thì khác. Phiên bản đầu của test này vẫn qua sau khi xoá dòng đó — vì nó gửi <code>Content-Type: …; charset=UTF-8</code>, thứ trình duyệt không gửi với form, nên Tomcat vẫn giải mã đúng. Sau khi làm request giống của trình duyệt:'}</p>
${O34_DOTBIEN}
<p>${en
  ? 'Red, with the exact garbage a librarian would have seen in the book list. A test is only as realistic as its inputs: when you build an HTTP test, copy the headers from the browser’s DevTools “Copy as cURL”, not from memory.'
  : 'Đỏ, kèm đúng thứ chữ rác mà thủ thư sẽ thấy trong danh sách sách. Test chỉ thật bằng đúng đầu vào của nó: khi dựng test HTTP, hãy chép header từ "Copy as cURL" trong DevTools của trình duyệt, đừng viết theo trí nhớ.'}</p>

<h3>${en ? 'The cost, measured' : 'Chi phí, đo thật'}</h3>
<table>
<thead><tr><th></th><th>${en ? 'Mockito + lab DB (3.1–3.3)' : 'Mockito + CSDL lab (3.1–3.3)'}</th><th>${en ? 'HTTP + Testcontainers (3.4)' : 'HTTP + Testcontainers (3.4)'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Tests' : 'Số test'}</td><td>21</td><td>3</td></tr>
<tr><td>${en ? 'Time, warm' : 'Thời gian, đã có bộ đệm'}</td><td>${en ? '2.9 s for the whole Maven build' : '2,9 s cho cả lần build Maven'}</td><td>${en ? '16 s (MySQL start ≈ 10 s)' : '16 s (MySQL khởi động ≈ 10 s)'}</td></tr>
<tr><td>${en ? 'Time, cold' : 'Thời gian, lần đầu'}</td><td>—</td><td>109 s</td></tr>
<tr><td>${en ? 'Needs' : 'Cần'}</td><td>${en ? 'a running lab DB (shared, tests overwrite it!)' : 'CSDL lab đang chạy (dùng chung, test ghi đè lên nó!)'}</td><td>${en ? 'only Docker; fresh DB per run' : 'chỉ cần Docker; CSDL mới mỗi lần chạy'}</td></tr>
<tr><td>${en ? 'Catches' : 'Bắt được'}</td><td>${en ? 'logic branches, exact messages' : 'nhánh logic, thông điệp chính xác'}</td><td>${en ? 'encoding, filters, web.xml, JSP, container config' : 'mã hoá, filter, web.xml, JSP, cấu hình container'}</td></tr>
<tr><td>${en ? 'When red, tells you' : 'Khi đỏ, cho biết'}</td><td>${en ? 'which branch' : 'nhánh nào'}</td><td>${en ? 'that something on the path broke' : 'có gì đó trên đường đi bị hỏng'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'Notice the “shared” cell: the 3.1 tests reload the fixture into the same database you click around in. After running them, your manual test data is gone — we hit that while writing this chapter. Testcontainers removes that whole class of problem. The practical mix: a <strong>thin</strong> layer of HTTP tests for the 3–5 flows the business cannot live without, plus many fast tests below.'
  : 'Để ý ô "dùng chung": test ở 3.1 nạp lại fixture vào đúng CSDL mà bạn đang bấm thử bằng tay. Chạy chúng xong là dữ liệu thử tay của bạn mất — ta đã dính đúng chuyện đó khi soạn chương này. Testcontainers xoá hẳn cả loại vấn đề đó. Cách phối hợp thực tế: một lớp <strong>mỏng</strong> test HTTP cho 3–5 luồng mà doanh nghiệp không thể thiếu, cộng với nhiều test nhanh bên dưới.'}</p>

<h3>🔥 ${en ? 'A real incident — the test path was not the real path' : 'Sự cố thật — đường đi của test không phải đường đi thật'}</h3>
<p>${en
  ? 'On 19 July 2024 a CrowdStrike content update crashed about 8.5 million Windows machines (Microsoft’s estimate). The company’s Root Cause Analysis (6 August 2024) says the new IPC Template Type defined <strong>21</strong> input fields while the sensor code supplied only <strong>20</strong>; the mismatch was not caught because tests used <em>wildcard</em> matching for the 21st field, and the first content in production that used a non-wildcard criterion triggered an out-of-bounds read. Our <code>charset=UTF-8</code> header is a tiny version of the same failure: a test that takes a path the real input never takes.'
  : 'Ngày 19/7/2024 một bản cập nhật nội dung của CrowdStrike làm sập khoảng 8,5 triệu máy Windows (ước tính của Microsoft). Báo cáo nguyên nhân gốc của chính công ty (6/8/2024) ghi: kiểu mẫu IPC mới định nghĩa <strong>21</strong> trường đầu vào trong khi mã cảm biến chỉ cung cấp <strong>20</strong>; chỗ lệch không bị bắt vì các bài test dùng điều kiện khớp <em>đại diện</em> (wildcard) cho trường thứ 21, và nội dung đầu tiên trên môi trường thật dùng điều kiện không đại diện đã gây đọc tràn ngoài vùng nhớ. Cái header <code>charset=UTF-8</code> của ta là phiên bản tí hon của đúng lỗi đó: một test đi con đường mà đầu vào thật không bao giờ đi.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The project has no tests and the leader says “no time for unit tests on this legacy part”. Offer the smallest thing: one HTTP test for login and one for the money flow (borrow/return here; order/payment elsewhere), runnable with only Docker. Show the 16-second run. It is easy to say yes to, and it is the net you will stand on for every later ticket.'
  : 'Dự án không có test nào, leader bảo "phần cũ này không có thời gian viết unit test". Đề xuất thứ nhỏ nhất: một test HTTP cho đăng nhập và một cho luồng tiền (ở đây là mượn/trả; nơi khác là đặt hàng/thanh toán), chạy được chỉ với Docker. Cho xem lần chạy 16 giây. Rất dễ được đồng ý, và nó là tấm lưới bạn đứng lên cho mọi ticket sau đó.'}</p>

<h3>🧪 ${en ? 'Practice (30 minutes)' : 'Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create <code>e2e/</code>, run it twice, note cold and warm times on your machine.' : 'Tạo <code>e2e/</code>, chạy hai lần, ghi thời gian lần đầu và lần sau trên máy bạn.'}</li>
<li>${en ? 'Delete <code>setCharacterEncoding</code>, confirm the Vietnamese-title test goes red, restore it.' : 'Xoá <code>setCharacterEncoding</code>, xác nhận test tên sách tiếng Việt đỏ, khôi phục lại.'}</li>
<li>${en ? 'Add an HTTP test for returning a book that checks the redirect message.' : 'Thêm một test HTTP cho trả sách, kiểm thông điệp redirect.'}</li>
<li>${en ? 'Add the <code>charset=UTF-8</code> back to the header and explain in one sentence why the test now lies.' : 'Thêm lại <code>charset=UTF-8</code> vào header và giải thích trong một câu vì sao test giờ nói dối.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '<code>mvn test</code> in <code>e2e/</code> is green on a machine with only Docker and JDK 17, and leaves no container behind (<code>docker ps</code>).' : '<code>mvn test</code> trong <code>e2e/</code> xanh trên một máy chỉ có Docker và JDK 17, và không để sót container nào (<code>docker ps</code>).'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Black-box test', 'test hộp đen', 'Test chỉ dùng giao diện bên ngoài (HTTP), không biết code bên trong.', 'A test using only the external interface (HTTP), blind to the code.'],
  ['Testcontainers', 'Testcontainers', 'Thư viện khởi động container Docker dùng một lần cho test.', 'A library starting throwaway Docker containers for tests.'],
  ['ImageFromDockerfile', 'ảnh dựng từ Dockerfile', 'Dựng ảnh ứng dụng ngay trong test từ Dockerfile của repo.', 'Builds the app image inside the test from the repo’s Dockerfile.'],
  ['Ryuk', 'container dọn dẹp', 'Container phụ của Testcontainers xoá mọi thứ khi JVM kết thúc.', 'Testcontainers’ helper that removes everything when the JVM ends.'],
  ['Wait strategy', 'chiến lược chờ', 'Điều kiện coi container là sẵn sàng (HTTP 200, dòng log…).', 'The readiness condition for a container (HTTP 200, a log line…).'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'When no seam is safe, test over HTTP against a real database.' : 'Khi không seam nào an toàn, test qua HTTP với CSDL thật.'}</li>
<li>${en ? 'Keep black-box tests in their own module — they survive the Java/Tomcat upgrade.' : 'Để test hộp đen trong module riêng — nó sống sót qua cuộc nâng Java/Tomcat.'}</li>
<li>${en ? 'Use the project’s own dump and Dockerfile; measured: 109 s cold, 16 s warm.' : 'Dùng đúng dump và Dockerfile của dự án; đo được: 109 s lần đầu, 16 s lần sau.'}</li>
<li>${en ? 'HTTP tests catch encoding and container bugs that mocks cannot — if the request looks like a browser’s.' : 'Test HTTP bắt được lỗi mã hoá và lỗi container mà mock không bắt được — nếu request giống của trình duyệt.'}</li>
<li>${en ? 'Thin layer on top, many fast tests below.' : 'Lớp mỏng ở trên, nhiều test nhanh ở dưới.'}</li>
</ul>

${lk(bai('testing', 'tst-4-3-testcontainers'), '🐳', en ? 'Testing 4.3 — Testcontainers for Node' : 'Testing 4.3 — Testcontainers cho Node', en ? 'The concept and lifecycle' : 'Khái niệm và vòng đời')}
${lk(bai('spring-boot', 'sb-11-4-testcontainers'), '🍃', en ? 'Spring Boot 11.4 — Testcontainers' : 'Spring Boot 11.4 — Testcontainers', en ? 'With @ServiceConnection' : 'Với @ServiceConnection')}
${tl('https://java.testcontainers.org/modules/databases/mysql/', '🐳', 'Testcontainers for Java — MySQL module', en ? 'Init scripts, configuration' : 'Script khởi tạo, cấu hình')}
${tl('https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf', '🔥', 'CrowdStrike — Channel File 291 Root Cause Analysis (2024)', en ? '21 fields vs 20, wildcard in tests' : '21 trường và 20, wildcard trong test')}
`
);

/* ═══════════════════ 3.5 — Lab ═══════════════════ */
const X35_PIT = xml(`
<!-- pom.xml — <build><plugins> : PIT chỉ đột biến BookServlet, chỉ chạy test mượn sách -->
<plugin>
  <groupId>org.pitest</groupId>
  <artifactId>pitest-maven</artifactId>
  <version>1.17.4</version>
  <dependencies>
    <dependency>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-junit5-plugin</artifactId>
      <version>1.2.1</version>
    </dependency>
  </dependencies>
  <configuration>
    <targetClasses><param>com.thuvien.servlet.BookServlet</param></targetClasses>
    <targetTests><param>com.thuvien.servlet.BookServletMuonSachTest</param></targetTests>
    <threads>1</threads>   <!-- các test dùng chung MỘT CSDL: chạy song song sẽ giẫm lên dữ liệu của nhau -->
    <timestampedReports>false</timestampedReports>
  </configuration>
</plugin>
`
);
const O35_DOTBIEN = out(`
$ sed -i '109s/dangMuon > max/dangMuon >= max/' src/main/java/com/thuvien/servlet/BookServlet.java
$ mvn -B test
[ERROR] Tests run: 10, Failures: 2, Errors: 0, Skipped: 0, Time elapsed: 0.929 s <<< FAILURE! -- in com.thuvien.servlet.BookServletMuonSachTest
[ERROR]   BookServletMuonSachTest.khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41:84 expected: <books?msg=Mượn thành công> but was: <books?msg=Vượt quá số sách được mượn>
[ERROR]   BookServletMuonSachTest.sinhVienDangMuon3_vanMuonDuocCuonThu4_BUG_TV41:72 expected: <books?msg=Mượn thành công> but was: <books?msg=Vượt quá số sách được mượn>
$ git checkout src/main
`
);
const O35_PIT1 = out(`
$ mvn -B test-compile org.pitest:pitest-maven:mutationCoverage -DoutputFormats=XML,HTML
>> Line Coverage (for mutated classes only): 61/138 (44%)
>> Generated 71 mutations Killed 20 (28%)
>> Mutations with no coverage 42. Test strength 69%
[INFO] BUILD SUCCESS

# Đột biến SỐNG trong nhánh mượn (dòng 86–136), đọc từ target/pit-reports/mutations.xml:
SURVIVED 104 negated conditional                                   ← else if (type.equals("GV"))
SURVIVED 124 negated conditional                                   ← else if (type.equals("GV")) khi tính hạn trả
SURVIVED 127 removed call to java/util/Calendar::add               ← hạn trả 7 ngày của KHACH
SURVIVED 78  removed call to HttpServletRequest::setCharacterEncoding
SURVIVED 96, 100, 119 removed call to java/sql/ResultSet::close
`
);
const C35_GIAI = java(`
    @Test
    void giangVienDangMuon2_vanMuonDuoc() throws Exception {
        muon("3", "4"); muon("3", "5");                            // GV 3: 1 → 3 cuốn
        assertEquals("books?msg=Mượn thành công", muon("3", "6"));  // đột biến 104 biến GV thành "khác" (max 1) ⇒ đỏ
    }

    @Test
    void hanTraCuaGiangVien_la30Ngay() throws Exception {
        muon("3", "4");
        assertEquals(30, DuLieuTest.so("SELECT DATEDIFF(due_date, borrow_date) FROM loans WHERE reader_id = 3 AND book_id = 4"));
    }

    @Test
    void hanTraCuaKhach_la7Ngay() throws Exception {
        DuLieuTest.chay("UPDATE loans SET return_date = '2026-11-01 09:00:00' WHERE id = 4");   // KHACH 4 trả hết trước
        muon("4", "4");
        assertEquals(7, DuLieuTest.so("SELECT DATEDIFF(due_date, borrow_date) FROM loans WHERE reader_id = 4 AND book_id = 4"));
    }
`
);
const O35_PIT2 = out(`
$ mvn -B test-compile org.pitest:pitest-maven:mutationCoverage -DoutputFormats=XML,HTML
>> Line Coverage (for mutated classes only): 63/138 (46%)
>> Generated 71 mutations Killed 24 (34%)
>> Mutations with no coverage 41. Test strength 80%

SURVIVED 78  removed call to javax/servlet/http/HttpServletRequest::setCharacterEncoding
SURVIVED 96  removed call to java/sql/ResultSet::close
SURVIVED 100 removed call to java/sql/ResultSet::close
SURVIVED 119 removed call to java/sql/ResultSet::close
SURVIVED 186 removed call to java/lang/Exception::printStackTrace
SURVIVED 190 removed call to com/thuvien/util/DBUtil::close
`
);

const L35 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · Lab' : 'Chương 3 · Lab'}</span>
<h2>${en ? '3.5 — Lab: Pin the behaviour of “borrow a book” before refactoring it' : '3.5 — Lab: Khoá hành vi chức năng "mượn sách" trước khi refactor'}</h2>
<p class="lead">${en
  ? 'Chapter 5 will tear the borrow logic out of <code>BookServlet</code> and rebuild it in layers. That is only safe if a net catches every behaviour change. In this lab you build that net and then <em>prove</em> it holds — by breaking the code on purpose and watching tests go red.'
  : 'Chương 5 sẽ rút logic mượn sách ra khỏi <code>BookServlet</code> và dựng lại theo tầng. Việc đó chỉ an toàn nếu có một tấm lưới bắt được mọi thay đổi hành vi. Trong lab này bạn dựng tấm lưới đó rồi <em>chứng minh</em> nó chịu lực — bằng cách cố ý làm hỏng code và nhìn test chuyển đỏ.'}</p>
${moiTruong(en)}

<h3>${en ? 'The ticket' : 'Ticket'}</h3>
<div class="callout"><p><strong>LIB-103 · ${en ? 'Safety net for the borrow flow' : 'Lưới an toàn cho luồng mượn sách'}</strong><br>
${en
  ? 'Acceptance: (1) at least 8 green tests on the borrow branch, including error cases; (2) every test that pins a bug says so in its name; (3) changing <code>&gt;</code> to <code>&gt;=</code> on line 109 turns at least one test red; (4) PIT reports no surviving mutation in the borrow branch except resource-closing calls; (5) a golden master of the three pages is committed; (6) “Tests run” never decreased.'
  : 'Tiêu chí chấp nhận: (1) ít nhất 8 test xanh cho nhánh mượn, có cả trường hợp lỗi; (2) test nào khoá bug thì tên nói rõ; (3) đổi <code>&gt;</code> thành <code>&gt;=</code> ở dòng 109 làm ít nhất một test đỏ; (4) PIT không còn đột biến sống trong nhánh mượn trừ các lời gọi đóng tài nguyên; (5) golden master của ba trang đã được commit; (6) "Tests run" không lần nào giảm.'}</p></div>

<h3>${en ? 'Steps (timebox in brackets)' : 'Các bước (thời gian gợi ý trong ngoặc)'}</h3>
<ol>
<li>${en ? '<strong>Branch and baseline</strong> (5′): <code>git switch -c lib-103-luoi-an-toan</code>; run <code>mvn test</code>, write down “Tests run: 1”.' : '<strong>Nhánh và mốc ban đầu</strong> (5′): <code>git switch -c lib-103-luoi-an-toan</code>; chạy <code>mvn test</code>, ghi lại "Tests run: 1".'}</li>
<li>${en ? '<strong>Test dependencies</strong> (10′): JUnit 5.11 + vintage + Mockito 4.11 (lesson 3.1). Count must become 2.' : '<strong>Thư viện test</strong> (10′): JUnit 5.11 + vintage + Mockito 4.11 (bài 3.1). Số test phải thành 2.'}</li>
<li>${en ? '<strong>Fixture</strong> (15′): <code>du-lieu-test.sql</code> with fixed dates, <code>DuLieuTest.napLai()</code>; check available of book 1 is 3.' : '<strong>Fixture</strong> (15′): <code>du-lieu-test.sql</code> ngày cố định, <code>DuLieuTest.napLai()</code>; kiểm sách 1 còn 3.'}</li>
<li>${en ? '<strong>Characterize</strong> (45′): the <code>"?"</code> recipe on every exit of the borrow branch: success, unknown reader, limit (SV, KHACH), out of stock, not logged in, non-numeric id, unknown book, due dates.' : '<strong>Đặc tả</strong> (45′): công thức <code>"?"</code> cho mọi lối ra của nhánh mượn: thành công, độc giả không tồn tại, giới hạn (SV, KHACH), sách hết, chưa đăng nhập, id không phải số, sách không tồn tại, hạn trả.'}</li>
<li>${en ? '<strong>Break it by hand</strong> (10′): the <code>&gt;=</code> mutation below; restore.' : '<strong>Tự tay làm hỏng</strong> (10′): đột biến <code>&gt;=</code> bên dưới; khôi phục.'}</li>
<li>${en ? '<strong>Break it by machine</strong> (30′): PIT; kill every survivor in lines 86–136 that is real behaviour.' : '<strong>Để máy làm hỏng</strong> (30′): PIT; diệt mọi đột biến sống ở dòng 86–136 mà là hành vi thật.'}</li>
<li>${en ? '<strong>Golden master</strong> (15′): <code>tools/golden.sh golden</code>, twice, zero diff, commit.' : '<strong>Golden master</strong> (15′): <code>tools/golden.sh golden</code>, hai lần, diff rỗng, commit.'}</li>
<li>${en ? '<strong>PR</strong> (10′): description lists the bugs you pinned (TV-41 off-by-one, raw SQL error, unchecked <code>rs.next()</code>) as “known, not fixed here”.' : '<strong>PR</strong> (10′): phần mô tả liệt kê các bug đã khoá (lệch một TV-41, lỗi SQL thô, <code>rs.next()</code> không kiểm) là "đã biết, không sửa trong PR này".'}</li>
</ol>

<h3>${en ? 'Proof 1 — a hand-made mutation' : 'Bằng chứng 1 — một đột biến làm bằng tay'}</h3>
${O35_DOTBIEN}
<p>${en
  ? 'Exactly the two tests that pin the off-by-one go red. When Chapter 8 fixes TV-41, this is the same one-character change — and these two tests are the ones you will rename and update in that PR.'
  : 'Đúng hai test khoá lỗi lệch một chuyển đỏ. Khi Chương 8 sửa TV-41, đó cũng chính là thay đổi một ký tự này — và hai test này là những test bạn sẽ đổi tên, cập nhật trong PR đó.'}</p>

<h3>${en ? 'Proof 2 — let PIT break it 71 ways' : 'Bằng chứng 2 — để PIT làm hỏng nó 71 cách'}</h3>
<p>${en
  ? '<strong>Mutation testing</strong> automates step 5: PIT changes one thing in the bytecode (flip a condition, remove a call, change a boundary), runs your tests, and reports whether any test noticed. A mutation that no test notices <em>survives</em> — a behaviour your net does not hold. The concept is taught in Testing 8.2 (with Stryker for JS); here is the Java setup for a Java 8 project:'
  : '<strong>Mutation testing</strong> tự động hoá bước 5: PIT đổi một thứ trong bytecode (lật điều kiện, bỏ một lời gọi, dời biên), chạy test của bạn, rồi báo có test nào nhận ra không. Đột biến không test nào nhận ra là <em>sống sót</em> — một hành vi mà lưới của bạn không giữ được. Khái niệm đã dạy ở Testing 8.2 (với Stryker cho JS); đây là cách cài cho dự án Java 8:'}</p>
${X35_PIT}
<p>${en
  ? 'Run it after your first ten tests. Ours, honestly:'
  : 'Chạy nó sau mười test đầu tiên. Kết quả của chúng tôi, nguyên văn:'}</p>
${O35_PIT1}
<p>${en
  ? 'Read survivors, not percentages. 42 mutations have no coverage because they are in <code>doGet</code>, return, add and delete — out of scope for this ticket. Inside the borrow branch, three survivors are real behaviour: <strong>nothing tests a lecturer</strong> (line 104), nor the 30-day and 7-day due dates (124, 127). The <code>close()</code> calls are resource hygiene, not observable behaviour — accept them and write why. Line 78 is lesson 3.4’s point: a mock cannot see encoding.'
  : 'Đọc đột biến sống, đừng đọc phần trăm. 42 đột biến không được phủ vì nằm ở <code>doGet</code>, trả sách, thêm, xoá — ngoài phạm vi ticket này. Trong nhánh mượn, ba đột biến sống là hành vi thật: <strong>chưa test nào cho giảng viên</strong> (dòng 104), cũng chưa có hạn trả 30 ngày và 7 ngày (124, 127). Các lời gọi <code>close()</code> là vệ sinh tài nguyên, không phải hành vi quan sát được — chấp nhận và ghi lý do. Dòng 78 chính là ý của bài 3.4: mock không nhìn thấy mã hoá.'}</p>

${giai(en ? '💡 Solution — the three tests that kill the real survivors (try first!)' : '💡 Lời giải — ba test diệt các đột biến sống thật (tự làm trước đã!)', `
${C35_GIAI}
${O35_PIT2}
<p>${en
  ? 'Test strength went from 69% to 80%, and every remaining survivor is a <code>close()</code>, <code>printStackTrace()</code> or the encoding call — none of them observable through a mock. That is “done” for this ticket. Full solution files (tests, fixture, <code>tools/golden.sh</code>, the <code>e2e/</code> module) are in the course lab folder <code>loi-giai/ch3/</code>.'
  : 'Độ mạnh của bộ test tăng từ 69% lên 80%, và mọi đột biến còn sống đều là <code>close()</code>, <code>printStackTrace()</code> hoặc lời gọi mã hoá — không cái nào quan sát được qua mock. Với ticket này như vậy là "xong". Tệp lời giải đầy đủ (test, fixture, <code>tools/golden.sh</code>, module <code>e2e/</code>) nằm trong thư mục lab của khoá, <code>loi-giai/ch3/</code>.'}</p>
`)}

<h3>${en ? 'Self-review rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? '≥ 8 green borrow tests, including ≥ 3 error exits' : '≥ 8 test mượn sách xanh, có ≥ 3 lối ra lỗi'}</td><td>2</td></tr>
<tr><td>${en ? 'Bug-pinning tests named with _BUG + ticket' : 'Test khoá bug có tên _BUG + mã ticket'}</td><td>1</td></tr>
<tr><td>${en ? 'Fixture is repeatable (run the suite twice: same result)' : 'Fixture lặp lại được (chạy bộ test hai lần: cùng kết quả)'}</td><td>1</td></tr>
<tr><td>${en ? 'Hand mutation <code>&gt;=</code> is caught' : 'Đột biến tay <code>&gt;=</code> bị bắt'}</td><td>1</td></tr>
<tr><td>${en ? 'PIT: no real-behaviour survivor in lines 86–136; accepted survivors explained' : 'PIT: không còn đột biến hành vi thật sống ở dòng 86–136; đột biến được chấp nhận có giải thích'}</td><td>2</td></tr>
<tr><td>${en ? 'Golden master committed, two captures identical' : 'Golden master đã commit, hai lần chụp giống hệt'}</td><td>1</td></tr>
<tr><td>${en ? 'Tests-run count never decreased (shown in PR)' : 'Số test chạy không lần nào giảm (ghi trong PR)'}</td><td>1</td></tr>
<tr><td>${en ? 'PR lists pinned bugs as known, not fixed' : 'PR liệt kê các bug đã khoá là đã biết, chưa sửa'}</td><td>1</td></tr>
</tbody>
</table>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“You must change a function that has no tests. What do you do first?”' : '"Em phải sửa một hàm chưa có test. Em làm gì đầu tiên?"'}</strong><br>${en
  ? 'Write characterization tests for its current behaviour, using the failure message to learn real values; pin bugs too; then change it. If it cannot be called from a test, add the smallest seam first.'
  : 'Viết characterization test cho hành vi hiện tại, dùng thông báo lỗi để biết giá trị thật; khoá cả bug; rồi mới sửa. Nếu không gọi được nó từ test thì thêm seam nhỏ nhất trước.'}</li>
<li><strong>${en ? '“Your test asserts a known bug. Isn’t that a wrong test?”' : '"Test của em khẳng định một bug đã biết. Vậy chẳng phải test sai sao?"'}</strong><br>${en
  ? 'No — it documents today’s behaviour so refactoring cannot change it silently. Fixing the bug is a separate PR that turns that test red on purpose; the name (_BUG_TV41) makes the intent clear.'
  : 'Không — nó ghi lại hành vi hôm nay để refactor không thể lặng lẽ làm đổi nó. Sửa bug là một PR riêng cố ý làm test đó đỏ; cái tên (_BUG_TV41) nói rõ ý định.'}</li>
<li><strong>${en ? '“Sprout or wrap — when do you use which?”' : '"Sprout hay wrap — khi nào dùng cái nào?"'}</strong><br>${en
  ? 'Sprout when new logic is a step inside the flow (a new validation); wrap when it happens around the whole flow (audit, timing). Both keep the new code testable and the old code untouched.'
  : 'Sprout khi logic mới là một bước bên trong luồng (một phép kiểm mới); wrap khi nó xảy ra quanh cả luồng (nhật ký, đo thời gian). Cả hai đều giữ code mới test được và code cũ không bị đụng.'}</li>
<li><strong>${en ? '“How do you know your tests are good enough to refactor under?”' : '"Làm sao em biết bộ test đủ tốt để refactor bên dưới nó?"'}</strong><br>${en
  ? 'Break the code on purpose — by hand on the risky line, then with a mutation tool like PIT — and read the survivors. Coverage alone only proves lines ran, not that results were checked.'
  : 'Cố ý làm hỏng code — bằng tay ở dòng rủi ro, rồi bằng công cụ mutation như PIT — và đọc các đột biến sống. Độ phủ một mình chỉ chứng minh dòng đã chạy, không chứng minh kết quả đã được kiểm.'}</li>
<li><strong>${en ? '“Mocks or a real database?”' : '"Dùng mock hay CSDL thật?"'}</strong><br>${en
  ? 'Both, for different things: mocks for fast branch-level tests; a thin layer over HTTP with Testcontainers for what mocks cannot see — encoding, SQL, triggers, container config. Then verify that a mock is not hiding real behaviour.'
  : 'Cả hai, cho những việc khác nhau: mock cho test nhanh mức nhánh; một lớp mỏng qua HTTP với Testcontainers cho thứ mock không thấy — mã hoá, SQL, trigger, cấu hình container. Và kiểm lại để chắc mock không che mất hành vi thật.'}</li>
</ol>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Your PR adds 400 lines of tests and changes zero lines of production code. A teammate asks if it is worth reviewing. Put the PIT summary (69% → 80%) and the hand-mutation output in the description, and say what it buys: “Chapter-5-style refactor of BookServlet can now be reviewed by running tests, not by reading 200 lines.” Test-only PRs are the easiest wins for a new intern — nothing can break in production.'
  : 'PR của bạn thêm 400 dòng test và không đổi dòng code chạy thật nào. Đồng nghiệp hỏi có đáng review không. Đưa tóm tắt PIT (69% → 80%) và output đột biến tay vào phần mô tả, rồi nói rõ lợi ích: "Từ giờ refactor BookServlet có thể review bằng cách chạy test, không phải đọc 200 dòng." PR chỉ có test là chiến thắng dễ nhất của một intern mới — không thứ gì trên môi trường thật có thể hỏng.'}</p>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Mutation testing', 'kiểm thử đột biến', 'Cố ý sửa nhỏ code để xem test có nhận ra không.', 'Making small deliberate changes to see if tests notice.'],
  ['Surviving mutant', 'đột biến sống sót', 'Thay đổi mà không test nào chuyển đỏ.', 'A change that no test turns red for.'],
  ['Test strength', 'độ mạnh bộ test', 'Tỉ lệ đột biến bị diệt trong số đột biến được phủ (PIT).', 'Killed mutants among covered mutants (PIT).'],
  ['Safety net', 'lưới an toàn', 'Bộ test bắt mọi thay đổi hành vi trong lúc refactor.', 'The tests that catch any behaviour change during a refactor.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'A net is proven by breaking the code, by hand and by machine.' : 'Tấm lưới được chứng minh bằng cách làm hỏng code, bằng tay và bằng máy.'}</li>
<li>${en ? 'Read surviving mutants, not percentages; accept non-observable ones with a reason.' : 'Đọc đột biến sống, không đọc phần trăm; chấp nhận cái không quan sát được, kèm lý do.'}</li>
<li>${en ? 'PIT must run single-threaded when tests share a database.' : 'PIT phải chạy một luồng khi các test dùng chung một CSDL.'}</li>
<li>${en ? 'This net is what Chapter 5 refactors under — commit by commit, always green.' : 'Tấm lưới này là thứ Chương 5 sẽ refactor bên dưới — từng commit, luôn xanh.'}</li>
</ul>

${lk(bai('testing', 'tst-8-2-mutation'), '🧬', en ? 'Testing 8.2 — Mutation testing' : 'Testing 8.2 — Mutation testing', en ? 'The concept, with Stryker' : 'Khái niệm, với Stryker')}
${lk(bai('testing', 'tst-10-5-lab-tdd-code-cu'), '🧪', en ? 'Testing 10.5 — Lab: TDD on legacy code' : 'Testing 10.5 — Lab: TDD trên code cũ', en ? 'The Node counterpart of this lab' : 'Phiên bản Node của lab này')}
${tl('https://pitest.org/quickstart/maven/', '🧬', 'PIT — Maven quick start', en ? 'Goals, mutators, reports' : 'Goal, mutator, báo cáo')}
`
);

/* ═══════════════════ 3.6 — Quiz ═══════════════════ */
const QUIZ3 = [
  Q('You add junit-jupiter to an old POM that had one JUnit 4 test. mvn test says “Tests run: 1, BUILD SUCCESS” with your new JUnit 5 test. What happened?|||Bạn thêm junit-jupiter vào một POM cũ vốn có một test JUnit 4. mvn test báo "Tests run: 1, BUILD SUCCESS" với test JUnit 5 mới của bạn. Chuyện gì đã xảy ra?', [
    'Nothing — JUnit 4 tests are counted together with JUnit 5 ones|||Không có gì — test JUnit 4 được đếm gộp với test JUnit 5',
    'Surefire switched to the JUnit Platform provider and the JUnit 4 test silently stopped running; add junit-vintage-engine|||Surefire chuyển sang provider JUnit Platform và test JUnit 4 im lặng không chạy nữa; thêm junit-vintage-engine',
    'The JUnit 4 test failed but was hidden by -B|||Test JUnit 4 đỏ nhưng bị -B che đi',
    'Maven deleted the old test because it is deprecated|||Maven đã xoá test cũ vì nó lỗi thời',
  ], 1, 'EN: measured in 3.1 — “Using auto detected provider …JUnitPlatformProvider”, Tests run: 1. With the vintage engine: 2. Always compare test counts after touching a build file.|||VI: đo ở 3.1 — "Using auto detected provider …JUnitPlatformProvider", Tests run: 1. Có engine vintage: 2. Luôn so số test sau khi sửa tệp build.'),
  Q('Your characterization test shows a student with 3 books can borrow a 4th, although the rule says 3. What do you do in this PR?|||Characterization test cho thấy sinh viên có 3 cuốn vẫn mượn được cuốn thứ 4, dù luật nói 3. Trong PR này bạn làm gì?', [
    'Fix > to >= now, since you found it|||Sửa > thành >= luôn, vì mình đã tìm ra',
    'Delete the test so the suite does not encode a bug|||Xoá test để bộ test không chứa bug',
    'Keep the test asserting today’s behaviour, name it …_BUG_TV41, report it; fix it in a separate PR that turns it red on purpose|||Giữ test khẳng định hành vi hôm nay, đặt tên …_BUG_TV41, báo lên; sửa trong một PR riêng cố ý làm nó đỏ',
    'Mark the test @Disabled until the customer decides|||Đánh dấu test @Disabled tới khi khách quyết định',
  ], 2, 'EN: a characterization test that pins a bug is correct. Mixing a behaviour fix into a safety-net PR makes both harder to review and revert.|||VI: characterization test khoá một bug là test đúng. Trộn bản sửa hành vi vào PR dựng lưới an toàn làm cả hai khó review và khó revert.'),
  Q('Your fixture inserts books with the dump’s available values, then two open loans of book 1. A test reads available = 1 instead of 3. Why?|||Fixture của bạn chèn books với giá trị available như dump, rồi hai phiếu đang mượn sách 1. Test đọc ra available = 1 thay vì 3. Vì sao?', [
    'MySQL rounds integers|||MySQL làm tròn số nguyên',
    'The AFTER INSERT trigger on loans subtracted the two loans again|||Trigger AFTER INSERT trên loans trừ hai phiếu đó thêm lần nữa',
    'DBUtil caches the old value|||DBUtil lưu đệm giá trị cũ',
    'The test ran in parallel with another test|||Test chạy song song với một test khác',
  ], 1, 'EN: database logic runs on test data too. The dump avoids it only because it creates the trigger after loading rows. Fix: insert available = quantity and let the trigger work.|||VI: logic trong CSDL cũng chạy trên dữ liệu test. Dump tránh được chỉ vì nó tạo trigger sau khi nạp dữ liệu. Sửa: chèn available = quantity rồi để trigger làm việc.'),
  Q('For loan 1 (student, 9 days 1 hour late), the web app charges 18,000 and the Node API 20,000. What is the most useful next step for an intern?|||Với phiếu 1 (sinh viên, trễ 9 ngày 1 giờ), web thu 18.000 còn API Node thu 20.000. Bước tiếp theo hữu ích nhất của một intern là gì?', [
    'Change Node to Math.floor so both say 18,000|||Đổi Node sang Math.floor cho cả hai cùng 18.000',
    'Change Java to round up so both say 20,000|||Đổi Java sang làm tròn lên cho cả hai cùng 20.000',
    'Pin both with tests, document the gap (truncate vs ceil) and ask the BA/customer which is correct|||Khoá cả hai bằng test, ghi rõ chỗ lệch (cắt phần lẻ và làm tròn lên) và hỏi BA/khách bên nào đúng',
    'Ignore it; 2,000 is a rounding error|||Bỏ qua; 2.000 chỉ là sai số làm tròn',
  ], 2, 'EN: which rule is right is a business decision. Tests make the question precise and the eventual fix a one-line, reviewable change.|||VI: luật nào đúng là quyết định nghiệp vụ. Test làm câu hỏi trở nên chính xác và bản sửa sau đó chỉ là một dòng dễ review.'),
  Q('Your HTML golden master differs every day although no code changed. Which approach did the chapter end up with?|||Golden master HTML của bạn khác đi mỗi ngày dù code không đổi. Chương này chọn cách nào?', [
    'Re-approve the master every morning|||Duyệt lại golden master mỗi sáng',
    'Reload a dump with dates relative to NOW() before each capture and scrub absolute dd/mm/yyyy dates|||Nạp lại dump có ngày tương đối theo NOW() trước mỗi lần chụp và làm sạch ngày tuyệt đối dd/mm/yyyy',
    'Remove the report page from the master|||Bỏ trang báo cáo khỏi golden master',
    'Run captures only on the same weekday|||Chỉ chụp vào cùng một thứ trong tuần',
  ], 1, 'EN: days_late is computed by MySQL’s clock, which the test cannot freeze; relative dates keep it stable, and only absolute dates need scrubbing.|||VI: days_late do đồng hồ của MySQL tính, test không đóng băng được; ngày tương đối giữ nó ổn định, chỉ ngày tuyệt đối cần làm sạch.'),
  Q('An approval test of ExportServlet passes on Linux but the CSV contains “L?p tr�nh” when run with -Dfile.encoding=Cp1252. What does this reveal?|||Approval test của ExportServlet qua trên Linux, nhưng chạy với -Dfile.encoding=Cp1252 thì CSV chứa "L?p tr�nh". Điều này cho thấy gì?', [
    'ApprovalTests does not support Vietnamese|||ApprovalTests không hỗ trợ tiếng Việt',
    'The database stores the titles wrongly|||CSDL lưu sai tên sách',
    'FileWriter uses the JVM default charset, so the export depended on the machine running Tomcat|||FileWriter dùng bảng mã mặc định của JVM, nên tệp xuất phụ thuộc vào máy chạy Tomcat',
    'The CSV must always be ASCII|||CSV lúc nào cũng phải là ASCII',
  ], 2, 'EN: Java 8 FileWriter has no charset parameter and uses the platform default; JEP 400 made UTF-8 the default only from Java 18.|||VI: FileWriter của Java 8 không có tham số bảng mã và dùng mặc định của nền tảng; JEP 400 mới đặt UTF-8 làm mặc định từ Java 18.'),
  Q('Which edit is a seam created with “Extract and Override Call”?|||Lần sửa nào là tạo seam bằng "Extract and Override Call"?', [
    'Replacing System.currentTimeMillis() with a protected long bayGio() that a test subclass overrides|||Thay System.currentTimeMillis() bằng hàm protected long bayGio() để lớp con trong test ghi đè',
    'Adding a new class KiemTraQuaHan with its own tests|||Thêm lớp mới KiemTraQuaHan có test riêng',
    'Renaming doPost to xuLyPost and adding logging around it|||Đổi tên doPost thành xuLyPost và thêm nhật ký bao quanh',
    'Setting DB_URL before running tests|||Đặt DB_URL trước khi chạy test',
  ], 0, 'EN: the others are Sprout Class, Wrap Method and an environment seam.|||VI: các đáp án kia lần lượt là Sprout Class, Wrap Method và seam môi trường.'),
  Q('Ticket: “block borrowing when a reader has an overdue loan”. Which technique fits best on a 200-line doPost?|||Ticket: "chặn mượn khi độc giả có phiếu quá hạn". Với một doPost 200 dòng, kỹ thuật nào hợp nhất?', [
    'Wrap Method|||Wrap Method',
    'Sprout Class: write the rule in a new tested class and call it from doPost|||Sprout Class: viết luật trong một lớp mới có test rồi gọi nó từ doPost',
    'Rewrite doPost from scratch|||Viết lại doPost từ đầu',
    'Put the rule in a JSP scriptlet|||Đặt luật vào scriptlet JSP',
  ], 1, 'EN: the new rule is a step inside the flow. Wrap fits behaviour around the whole flow (audit, timing).|||VI: luật mới là một bước bên trong luồng. Wrap hợp với hành vi bao quanh cả luồng (nhật ký, đo thời gian).'),
  Q('After sprouting TV-90, three characterization tests go red. What does that mean?|||Sau khi sprout TV-90, ba characterization test chuyển đỏ. Điều đó nghĩa là gì?', [
    'The sprout is buggy; revert it|||Sprout bị lỗi; revert nó',
    'The tests were wrong all along|||Các test vốn sai từ đầu',
    'They show exactly which existing behaviours the ticket changes; update them deliberately and list them in the PR|||Chúng chỉ đúng những hành vi hiện có mà ticket làm đổi; cập nhật chúng có chủ đích và liệt kê trong PR',
    'PIT must be rerun before anything else|||Phải chạy lại PIT trước mọi việc khác',
  ], 2, 'EN: the lecturer and the guest with overdue loans can no longer borrow — intended by TV-90. Also check the time bomb: those tests used the real clock.|||VI: giảng viên và khách có phiếu quá hạn không mượn được nữa — đúng ý TV-90. Và kiểm cả quả bom hẹn giờ: các test đó dùng đồng hồ thật.'),
  Q('With jest.mock replacing lib/kho, an orphan loan gives a 500 with a stack trace; the real server gives 500 “loi doc du lieu”. Why?|||Với jest.mock thay lib/kho, một phiếu mồ côi cho ra 500 kèm stack trace; máy chủ thật trả 500 "loi doc du lieu". Vì sao?', [
    'Express behaves differently under Jest|||Express chạy khác khi ở trong Jest',
    'The real kho wraps the callback in try/catch, catches the route’s TypeError and calls the route again with it — the mock removed that behaviour|||kho thật bọc callback trong try/catch, bắt TypeError của route và gọi route lần nữa với lỗi đó — bản giả đã xoá mất hành vi này',
    'The real server runs in production mode|||Máy chủ thật chạy ở chế độ production',
    'supertest hides error messages|||supertest giấu thông báo lỗi',
  ], 1, 'EN: a seam replaces everything behind it, including unknown bugs. Keep the real module and change only its data (jest.requireActual).|||VI: seam thay mọi thứ phía sau nó, kể cả bug chưa biết. Giữ module thật và chỉ đổi dữ liệu nó trả (jest.requireActual).'),
  Q('Deleting request.setCharacterEncoding("UTF-8") survives all Mockito tests. The HTTP test also stayed green at first. What made it go red?|||Xoá request.setCharacterEncoding("UTF-8") vẫn sống qua mọi test Mockito. Test HTTP lúc đầu cũng vẫn xanh. Điều gì làm nó đỏ?', [
    'Running it twice|||Chạy nó hai lần',
    'Using Java 17|||Dùng Java 17',
    'Sending Content-Type without “charset=UTF-8”, as a browser does|||Gửi Content-Type không kèm "charset=UTF-8", như trình duyệt',
    'Adding Thread.sleep before the request|||Thêm Thread.sleep trước request',
  ], 2, 'EN: with an explicit charset Tomcat decoded correctly anyway; browsers do not send one for forms. Copy real headers (DevTools → Copy as cURL).|||VI: có charset tường minh thì Tomcat vẫn giải mã đúng; trình duyệt không gửi charset với form. Hãy chép header thật (DevTools → Copy as cURL).'),
  Q('PIT reports 6 surviving mutants: setCharacterEncoding, three ResultSet.close, printStackTrace, DBUtil.close. Is the borrow net done for LIB-103?|||PIT báo 6 đột biến sống: setCharacterEncoding, ba ResultSet.close, printStackTrace, DBUtil.close. Lưới cho luồng mượn của LIB-103 đã xong chưa?', [
    'No — every mutant must be killed|||Chưa — phải diệt mọi đột biến',
    'Yes — none is observable through the unit tests; accept them with a reason, and the encoding one is covered by the HTTP test|||Rồi — không cái nào quan sát được qua unit test; chấp nhận kèm lý do, còn đột biến mã hoá đã có test HTTP lo',
    'No — test strength must be 100%|||Chưa — độ mạnh phải 100%',
    'Yes — because line coverage is 46%|||Rồi — vì độ phủ dòng là 46%',
  ], 1, 'EN: read survivors, not percentages. The real-behaviour ones (GV limit, 30/7-day due dates) were killed by three extra tests.|||VI: đọc đột biến sống, đừng đọc phần trăm. Những đột biến hành vi thật (giới hạn GV, hạn trả 30/7 ngày) đã bị ba test thêm diệt.'),
];

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 3 · Quiz' : 'Chương 3 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Twelve questions on the net you built. Every answer comes from an output in this chapter — re-run the command if unsure.' : 'Mười hai câu về chính tấm lưới bạn đã dựng. Đáp án nào cũng đến từ một output trong chương — không chắc thì chạy lại lệnh.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can write a characterization test with the “?” recipe in Java and in Jest.' : 'Tôi viết được characterization test theo công thức "?" bằng Java và bằng Jest.'}</li>
<li>${en ? 'I can make a golden master deterministic (reload, freeze, scrub).' : 'Tôi làm được golden master tất định (nạp lại, đóng băng, làm sạch).'}</li>
<li>${en ? 'I can name the seam I am using and its enabling point.' : 'Tôi gọi được tên seam mình đang dùng và điểm kích hoạt của nó.'}</li>
<li>${en ? 'I have an e2e module that runs with only Docker and JDK 17.' : 'Tôi có module e2e chạy được chỉ với Docker và JDK 17.'}</li>
<li>${en ? 'I have run PIT and can explain every survivor.' : 'Tôi đã chạy PIT và giải thích được mọi đột biến sống.'}</li>
</ul>
`
);

export default {
  title: 'Chapter 3 — A safety net before you touch anything|||Chương 3 — Dựng lưới an toàn trước khi chạm vào code',
  description: 'Khoá hành vi hiện tại bằng test — kể cả hành vi sai.',
  lessons: [
    { title: '3.1 — Characterization tests on real legacy Java and Node code|||3.1 — Characterization test trên code Java và Node cũ thật', slug: 'lgc-3-1-characterization', type: 'LESSON', isFreePreview: true, description: 'Công thức "?" của Feathers trên servlet và API Express cũ: JUnit 5 nuốt test JUnit 4, fixture đi qua trigger, khoá lỗi lệch một, Java 18.000 và Node 20.000 cho cùng một phiếu, token giả được.', content: L31 },
    { title: '3.2 — Golden master and approval tests for reports, HTML and exports|||3.2 — Golden master và approval test cho báo cáo, HTML và file xuất', slug: 'lgc-3-2-golden-master', type: 'LESSON', isFreePreview: true, description: 'Golden master HTML qua curl + diff (ngày tương đối, làm sạch ngày), ApprovalTests cho CSV lộ tệp C:\\thuvien\\… và bảng mã phụ thuộc máy, Jest snapshot bắt thay đổi làm tròn.', content: L32 },
    { title: '3.3 — Seams and breaking dependencies: extract interface, sprout, wrap|||3.3 — Seam và cắt phụ thuộc: tách interface, sprout, wrap', slug: 'lgc-3-3-seam', type: 'LESSON', isFreePreview: true, description: 'Seam có sẵn và seam tự tạo: đóng băng đồng hồ, sprout TV-90 làm đỏ đúng 3 test, wrap ghi nhật ký, factory method cho tệp xuất; jest.mock và khi seam che mất bug thật.', content: L33 },
    { title: '3.4 — When nothing can be isolated: testing through HTTP and a real database (Testcontainers)|||3.4 — Khi không tách được gì: test qua HTTP với cơ sở dữ liệu thật (Testcontainers)', slug: 'lgc-3-4-test-qua-http', type: 'LESSON', isFreePreview: true, description: 'Module e2e Java 17 riêng: MySQL + ảnh từ Dockerfile của dự án, test hộp đen qua HTTP, chi phí đo thật (109 s / 16 s), bắt lỗi mã hoá mà mock bỏ sót, sự cố CrowdStrike 2024.', content: L34 },
    { title: '3.5 — Lab: Pin the behaviour of "borrow a book" before refactoring it|||3.5 — Lab: Khoá hành vi chức năng "mượn sách" trước khi refactor', slug: 'lgc-3-5-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-103: ≥ 8 test cho nhánh mượn, đột biến tay và PIT (69% → 80%), golden master, câu hỏi phỏng vấn — lời giải che sẵn.', content: L35 },
    { title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3', slug: 'lgc-3-6-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu tình huống: test giữ bug hay sửa bug, vintage engine, trigger trong fixture, golden master tất định, seam, sprout và wrap, mock nói dối, PIT.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ3 } },
  ],
};
