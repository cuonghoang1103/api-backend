/**
 * Testing · Chương 6 · Quiz Chương 6 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-6-6-quiz.
 * Đáp án rải: A ×3 (câu 2, 6, 9) · B ×2 (4, 8) · C ×3 (1, 5, 10) · D ×2 (3, 7).
 */
export default {
  title: 'Chapter 6 check — 10 scenario questions|||Kiểm tra Chương 6 — 10 câu tình huống',
  slug: 'tst-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 6: thứ tự ưu tiên truy vấn, querySelector bỏ lọt label hỏng, thiếu cleanup, findBy không await, promise hoãn cho trạng thái bận, happy-dom và preflight CORS, URL tương đối trong Node, alert so với status, async Server Component, test route handler.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check</h2>
<p class="lead">Ten scenarios about testing React components. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can find elements by role and label, and choose between getBy, queryBy and findBy.</li>
<li>I can drive a form with user-event and test its busy, error and success states.</li>
<li>I can test a screen that fetches with MSW, and I know what in Next.js a unit test cannot reach.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6</h2>
<p class="lead">Mười tình huống về test component React. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được phần tử theo role và label, và chọn đúng giữa getBy, queryBy và findBy.</li>
<li>Tôi điều khiển được form bằng user-event và test các trạng thái bận, lỗi, thành công.</li>
<li>Tôi test được màn hình gọi API bằng MSW, và biết phần nào của Next.js unit test không với tới.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Which query should a test use first to find the Book button of the booking form?|||Test nên dùng truy vấn nào trước tiên để tìm nút Book của form đặt phòng?',
        options: [
          "getByTestId('book-button')|||getByTestId('book-button')",
          "container.querySelector('button[type=submit]')|||container.querySelector('button[type=submit]')",
          "getByRole('button', { name: 'Book' })|||getByRole('button', { name: 'Book' })",
          "getByText('Book')|||getByText('Book')",
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Role plus accessible name is how assistive technology identifies the button, so it is first in the Testing Library priority. getByText also works here but would match any element with that text; a test id and a CSS selector are invisible to users and keep passing when the button loses its name.|||VI: Role cộng tên truy cập được là cách công nghệ hỗ trợ nhận ra cái nút, nên nó đứng đầu thứ tự ưu tiên của Testing Library. getByText cũng chạy được ở đây nhưng khớp với bất kỳ phần tử nào có chữ đó; test id và bộ chọn CSS người dùng không thấy, và vẫn qua khi nút mất tên.',
      },
      {
        question: "A test finds the seats input with container.querySelector('input[name=seats]'). A refactor breaks the label: htmlFor no longer matches the input's id. What happens?|||Một test tìm ô số chỗ bằng container.querySelector('input[name=seats]'). Một lần refactor làm hỏng label: htmlFor không còn khớp id của input. Chuyện gì xảy ra?",
        options: [
          'The test stays green; getByLabelText or getByRole with the name would have failed.|||Test vẫn xanh; getByLabelText hoặc getByRole kèm tên lẽ ra đã đỏ.',
          'The test fails because the input has no label.|||Test đỏ vì input không có label.',
          'React refuses to render a label without a matching id.|||React từ chối render label không khớp id.',
          'jsdom repairs the link automatically.|||jsdom tự sửa mối nối.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The selector looks at the name attribute, which did not change. Screen-reader users lose the field’s name and clicks on the label stop focusing the input — Lab 6 mutant #2, which the first attempt let survive. React and jsdom do not validate label links.|||VI: Bộ chọn nhìn thuộc tính name, thứ không hề đổi. Người dùng trình đọc màn hình mất tên của trường và bấm vào label không còn đưa con trỏ vào ô — đột biến 2 của Lab 6, thứ lần thử đầu để sống. React và jsdom không kiểm mối nối label.',
      },
      {
        question: 'Each of two tests renders the booking form. The second fails with "Found multiple elements with the role button and name Book". Vitest runs without globals. Why?|||Hai test, mỗi test render form đặt phòng. Test thứ hai đỏ với "Found multiple elements with the role button and name Book". Vitest chạy không bật globals. Vì sao?',
        options: [
          'The component renders two buttons.|||Component render hai nút.',
          'user-event clicked twice.|||user-event đã bấm hai lần.',
          'Vitest runs both tests in parallel in one DOM.|||Vitest chạy song song hai test trong cùng một DOM.',
          "The first test's form was never unmounted: Testing Library only auto-cleans when a global afterEach exists.|||Form của test đầu chưa từng được gỡ: Testing Library chỉ tự dọn khi có afterEach toàn cục.",
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in lesson 6.1: without afterEach(cleanup) in the setup file, the earlier render stays in document.body. Tests in one file run one after another, not in parallel, and the component has one button.|||VI: Đã đo ở bài 6.1: thiếu afterEach(cleanup) trong file setup, lần render trước vẫn nằm trong document.body. Các test trong một file chạy lần lượt, không song song, và component chỉ có một nút.',
      },
      {
        question: "A test writes expect(screen.findByRole('status')).toBeTruthy(), but nothing is ever submitted. What is the result?|||Một test viết expect(screen.findByRole('status')).toBeTruthy(), nhưng không có gì được gửi. Kết quả là gì?",
        options: [
          'Red after 1 second: no status appears.|||Đỏ sau 1 giây: không có status nào xuất hiện.',
          'Green: findByRole returns a Promise, and a Promise is truthy. It needs await.|||Xanh: findByRole trả về Promise, mà Promise luôn truthy. Cần await.',
          'Red at once: requireAssertions detects it.|||Đỏ ngay: requireAssertions phát hiện.',
          'Vitest warns and skips the test.|||Vitest cảnh báo rồi bỏ qua test.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured in lesson 6.2 — the wrong test passed in 28 ms. requireAssertions only checks that some expect ran, and one did. With await, the same query fails honestly after one second.|||VI: Đã đo ở bài 6.2 — test sai qua trong 28 ms. requireAssertions chỉ kiểm có expect nào chạy không, và đã có một cái chạy. Có await, cùng truy vấn đó đỏ một cách trung thực sau một giây.',
      },
      {
        question: 'You want to test that the Book button reads "Booking…" and is disabled while the request is pending. Your mock is vi.fn().mockResolvedValue(...). What is the problem and the fix?|||Bạn muốn test nút Book ghi "Booking…" và bị khoá khi request đang chờ. Mock của bạn là vi.fn().mockResolvedValue(...). Vấn đề và cách sửa là gì?',
        options: [
          'No problem: check the button right after the click.|||Không vấn đề gì: kiểm nút ngay sau cú bấm.',
          'Use fireEvent instead of user-event.|||Dùng fireEvent thay vì user-event.',
          'The answer arrives almost at once, so the busy state is gone; return a deferred promise and resolve it after the checks.|||Câu trả lời tới gần như ngay lập tức nên trạng thái bận đã qua; trả về một promise hoãn và chỉ hoàn tất nó sau khi kiểm.',
          'Add a 500 ms sleep before the check.|||Thêm sleep 500 ms trước khi kiểm.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: A held promise lets the test look at the in-between state for as long as it needs, then click again and confirm one call — this is how Lab 6 mutant #3 (double booking) is killed. A sleep only makes the test slower; it cannot stop an already-resolved promise.|||VI: Một promise được giữ lại cho test nhìn trạng thái ở giữa bao lâu tuỳ ý, rồi bấm lần nữa và xác nhận chỉ một lần gọi — cách diệt đột biến 3 của Lab 6 (đặt hai lần). Sleep chỉ làm test chậm hơn; nó không giữ lại được một promise đã hoàn tất.',
      },
      {
        question: 'The MSW tests of lesson 6.3 pass in jsdom but fail in happy-dom with "intercepted a request without a matching request handler: OPTIONS http://api.test/…". Why?|||Các test MSW của bài 6.3 qua trong jsdom nhưng đỏ trong happy-dom với "intercepted a request without a matching request handler: OPTIONS http://api.test/…". Vì sao?',
        options: [
          "happy-dom's fetch follows CORS: a cross-origin request with an Authorization header sends a preflight OPTIONS first, and MSW was told to fail on unknown requests.|||fetch của happy-dom tuân theo CORS: request khác origin có header Authorization gửi preflight OPTIONS trước, mà MSW được dặn đánh đỏ request lạ.",
          'happy-dom does not support fetch.|||happy-dom không hỗ trợ fetch.',
          'MSW does not work with React.|||MSW không chạy với React.',
          'The client sends OPTIONS instead of GET.|||Client gửi OPTIONS thay vì GET.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The test page is http://localhost:3000 and the API is http://api.test — another origin. jsdom tests use Node’s fetch, which has no CORS. Fix: call the same origin, or answer OPTIONS in MSW (both verified). The client code sends GET.|||VI: Trang test là http://localhost:3000 còn API là http://api.test — origin khác. Test jsdom dùng fetch của Node, không có CORS. Cách sửa: gọi cùng origin, hoặc trả lời OPTIONS trong MSW (đã kiểm cả hai). Code client vẫn gửi GET.',
      },
      {
        question: "In a jsdom test the client calls fetch('/api/admin/bookings') with no base URL. The admin screen shows \"Could not load the bookings.\" Why?|||Trong test jsdom, client gọi fetch('/api/admin/bookings') không có base URL. Màn hình admin hiện \"Could not load the bookings.\" Vì sao?",
        options: [
          'MSW blocked the request.|||MSW đã chặn request.',
          'The API returned 500.|||API trả về 500.',
          'jsdom has no fetch at all.|||jsdom hoàn toàn không có fetch.',
          'The fetch is Node’s, which cannot resolve a relative URL: "Failed to parse URL". Use an absolute base URL in tests.|||fetch là của Node, không ghép được URL tương đối: "Failed to parse URL". Trong test hãy dùng base URL tuyệt đối.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in lesson 6.3. The request never left, so neither MSW nor the API saw it. In a browser the same path works because it is resolved against the page address. The screen honestly showed its failed state; the error was in the test setup.|||VI: Đã đo ở bài 6.3. Request chưa từng rời đi, nên cả MSW lẫn API đều không thấy. Trên trình duyệt cùng đường dẫn đó chạy được vì nó được ghép với địa chỉ trang. Màn hình trung thực hiện trạng thái lỗi; lỗi nằm ở phần dựng test.',
      },
      {
        question: 'A refactor shows the booking error in <p role="status"> instead of <p role="alert">. The text is identical. Why does it matter, and what catches it?|||Một lần refactor hiện lỗi đặt phòng trong <p role="status"> thay vì <p role="alert">. Chữ y hệt. Vì sao điều đó quan trọng, và cái gì bắt được?',
        options: [
          'It does not matter; only the text counts.|||Không quan trọng; chỉ chữ là đáng kể.',
          "Screen readers announce alerts at once but status politely; a test using findByRole('alert') catches it, findByText does not.|||Trình đọc màn hình đọc alert ngay nhưng đọc status nhẹ nhàng; test dùng findByRole('alert') bắt được, findByText thì không.",
          'The browser shows status in grey.|||Trình duyệt hiện status màu xám.',
          'React warns about the wrong role.|||React cảnh báo role sai.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Nothing changes on screen, so a sighted tester and a text query miss it — Lab 6 mutant #1. Roles carry meaning for assistive technology, and querying by role is how tests check that meaning.|||VI: Trên màn hình không có gì thay đổi, nên người test nhìn bằng mắt và truy vấn theo chữ đều bỏ lọt — đột biến 1 của Lab 6. Role mang ý nghĩa cho công nghệ hỗ trợ, và truy vấn theo role là cách test kiểm ý nghĩa đó.',
      },
      {
        question: 'BookingPage is an async Server Component. In a Vitest test, render(<BookingPage params={…} />) fails with "is an async Client Component". What works?|||BookingPage là một Server Component bất đồng bộ. Trong test Vitest, render(<BookingPage params={…} />) đỏ với "is an async Client Component". Cách nào chạy được?',
        options: [
          'render(await BookingPage({ params })) for this top-level component; an async child inside it still needs an end-to-end test.|||render(await BookingPage({ params })) cho component ngoài cùng này; component con async bên trong vẫn cần test đầu-cuối.',
          "Add 'use client' to the page.|||Thêm 'use client' vào trang.",
          'Wrap the render in act().|||Bọc render trong act().',
          'Use happy-dom instead of jsdom.|||Dùng happy-dom thay jsdom.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: An async Server Component is an async function; awaiting it yields elements React can render on the client. The limit was measured: an async child in the returned tree fails the same way. Adding use client would make it a client component, which may not be async at all — the error message itself warns about that.|||VI: Server Component bất đồng bộ là một hàm async; await nó cho ra các element mà React render được phía client. Giới hạn đã đo: component con async trong cây trả về đỏ y như vậy. Thêm use client sẽ biến nó thành client component, loại hoàn toàn không được async — chính thông báo lỗi cũng cảnh báo điều đó.',
      },
      {
        question: 'How should a test check the Next.js route handler app/api/slots/route.js?|||Test nên kiểm route handler Next.js app/api/slots/route.js thế nào?',
        options: [
          'Start next dev and call it with curl.|||Chạy next dev rồi gọi bằng curl.',
          'Render it with Testing Library.|||Render nó bằng Testing Library.',
          "Call GET(new Request('http://localhost/api/slots?lab=…&date=…')) in the node environment and check the Response; let MSW play the upstream API.|||Gọi GET(new Request('http://localhost/api/slots?lab=…&date=…')) trong môi trường node rồi kiểm Response; để MSW đóng vai API phía sau.",
          'Mock Response.json so it returns plain objects.|||Mock Response.json để nó trả object thường.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: A route handler is a function from Request to Response, so a unit test can call it directly — milliseconds, no server. Starting next dev belongs to end-to-end tests (Chapter 7); mocking Response would test the mock instead of the real status and body.|||VI: Route handler là hàm từ Request sang Response, nên unit test gọi thẳng được — vài mili giây, không cần máy chủ. Chạy next dev thuộc về test đầu-cuối (Chương 7); mock Response là test cái mock thay vì mã trạng thái và body thật.',
      },
    ],
  },
};
