/**
 * 9.6 — Kiểm tra Chương 9 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 9.1–9.5.
 * Phân bố đáp án: A ×2 (3, 8) · B ×3 (1, 6, 9) · C ×3 (2, 5, 10) · D ×2 (4, 7).
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
  slug: 'mgo-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 9: -p không ghi IP và tường lửa ufw, CVE-2025-14847 trước xác thực, localhost exception qua cổng Docker, cái bẫy readWrite drop được collection, authSource sai, {"$ne": null} vào ô mật khẩu, Express 5 và query parser extended, regex do người dùng gửi, chứng chỉ tự ký và tlsAllowInvalidCertificates, CSFLE deterministic với random.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Chapter 9 check: security</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 9.1–9.5. Most real incidents in this chapter were configuration or validation mistakes, not exotic exploits — so the questions are about what you would check and what the server actually did.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can prove with two commands who can reach my database and which version it runs.</li>
<li>Every application has its own account with the smallest role that works.</li>
<li>Every request field is type-checked before it reaches a filter.</li>
<li>I know which data is encrypted on the wire, on disk and in the database — and which is not.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm Chương 9: bảo mật</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 9.1–9.5. Phần lớn sự cố thật trong chương này là lỗi cấu hình hoặc thiếu kiểm đầu vào, không phải kỹ thuật khai thác cao siêu. Vì vậy các câu hỏi xoay quanh việc bạn sẽ kiểm gì, và máy chủ đã thật sự làm gì.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chứng minh được bằng hai câu lệnh: ai tới được database của mình, và nó chạy bản nào.</li>
<li>Mỗi ứng dụng có tài khoản riêng với vai trò nhỏ nhất mà vẫn chạy được.</li>
<li>Mọi trường của request đều được kiểm kiểu trước khi tới bộ lọc.</li>
<li>Tôi biết dữ liệu nào được mã hoá trên đường truyền, trên đĩa, trong database — và dữ liệu nào không.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('On an Ubuntu VPS with `ufw deny 27017`, a teammate runs `docker run -d -p 27017:27017 mongo:8.0`. What did Lesson 9.1 show about this port?|||Trên VPS Ubuntu đã `ufw deny 27017`, đồng đội chạy `docker run -d -p 27017:27017 mongo:8.0`. Bài 9.1 cho thấy gì về cổng này?',
        ['It is closed: ufw rules apply to every process on the host|||Đã đóng: luật ufw áp dụng cho mọi tiến trình trên máy',
         'HostIp is empty (every interface) and Docker\'s rules are applied before ufw\'s, so the port is reachable; the image itself also runs --bind_ip_all|||HostIp rỗng (mọi giao diện) và luật của Docker được xét trước luật ufw, nên cổng tới được; bản thân ảnh còn tự chạy --bind_ip_all',
         'It is reachable only from 127.0.0.1 because mongod defaults to localhost|||Chỉ tới được từ 127.0.0.1 vì mongod mặc định nghe localhost',
         'Docker refuses to publish a port that ufw denies|||Docker từ chối xuất một cổng mà ufw đã chặn'], 1,
        'EN: docker inspect showed {"HostIp":"","HostPort":"47022"} for the short -p form, and the official image\'s argv was [mongod, --bind_ip_all]. Docker\'s documentation states Docker and ufw are incompatible: published-port traffic is diverted before ufw\'s rules. Write 127.0.0.1: in -p, or do not publish.|||VI: docker inspect cho thấy {"HostIp":"","HostPort":"47022"} với cách viết -p gọn, và argv của ảnh chính thức là [mongod, --bind_ip_all]. Tài liệu Docker ghi rõ Docker và ufw không tương thích: lưu lượng tới cổng đã xuất bị chuyển hướng trước luật của ufw. Hãy ghi 127.0.0.1: trong -p, hoặc đừng xuất cổng.'),
      q('Your MongoDB 8.0.16 server has authorization enabled and a 30-character password. Why is it still at risk from CVE-2025-14847?|||Máy MongoDB 8.0.16 của bạn đã bật phân quyền và có mật khẩu 30 ký tự. Vì sao vẫn có rủi ro với CVE-2025-14847?',
        ['It isn\'t — the CVE only affects servers without authentication|||Không có rủi ro — CVE chỉ ảnh hưởng máy không có xác thực',
         'Because the password is sent in clear without TLS|||Vì mật khẩu bị gửi dạng rõ khi không có TLS',
         'The flaw is reachable before authentication (zlib-compressed message headers); fix is 8.0.17+, interim mitigation is removing zlib, and the port should not be reachable by untrusted clients|||Lỗi tới được trước bước xác thực (header gói tin nén zlib); bản vá là 8.0.17 trở lên, giảm thiểu tạm thời là bỏ zlib, và cổng không nên để client không tin cậy tới được',
         'Only Atlas clusters are affected|||Chỉ cụm Atlas bị ảnh hưởng'], 2,
        'EN: NVD: "read of uninitialized heap memory by an unauthenticated client"; fixed in 8.0.17, 8.2.3, 7.0.28, 6.0.27, 5.0.32, 4.4.30; CISA listed it as actively exploited on 29/12/2025. tu-kiem.js flagged the 8.0.16 image. SCRAM never sends the password in clear (Lesson 9.4 proxy: 0 occurrences).|||VI: NVD: "client chưa xác thực đọc được vùng nhớ heap chưa khởi tạo"; vá ở 8.0.17, 8.2.3, 7.0.28, 6.0.27, 5.0.32, 4.4.30; CISA xác nhận đang bị khai thác ngày 29/12/2025. tu-kiem.js đã bắt lỗi ảnh 8.0.16. SCRAM không bao giờ gửi mật khẩu dạng rõ (proxy ở Bài 9.4: xuất hiện 0 lần).'),
      q('mongod --auth, no users yet. You run createUser from the host through the published port 127.0.0.1:47023. What happens?|||mongod --auth, chưa có user nào. Bạn chạy createUser từ máy host qua cổng đã xuất 127.0.0.1:47023. Chuyện gì xảy ra?',
        ['"Command createUser requires authentication" — through Docker the connection arrives from the gateway, not localhost; run it inside the container|||"Command createUser requires authentication" — qua Docker, kết nối tới từ gateway chứ không phải localhost; phải chạy bên trong container',
         'The user is created, because 127.0.0.1 is localhost|||User được tạo, vì 127.0.0.1 là localhost',
         'The user is created and the exception stays open until restart|||User được tạo và ngoại lệ còn mở tới khi khởi động lại',
         'mongod crashes because there is no admin user|||mongod sập vì chưa có user quản trị'], 0,
        'EN: From the host it was refused; inside the container getUsers was refused but the first createUser returned 1, and a second createUser without logging in was refused again. The localhost exception allows exactly one first user or role.|||VI: Từ máy host thì bị từ chối; bên trong container, getUsers bị từ chối nhưng createUser đầu tiên trả 1, và createUser thứ hai khi chưa đăng nhập lại bị từ chối. Localhost exception chỉ cho tạo đúng một user hoặc role đầu tiên.'),
      q('The API account has the built-in role readWrite on ctshop. Which of these did it succeed at in Lesson 9.2?|||Tài khoản API có vai trò readWrite trên ctshop. Ở Bài 9.2, nó làm được việc nào sau đây?',
        ['dropDatabase on ctshop|||dropDatabase trên ctshop',
         'Listing users in admin|||Liệt kê user trong admin',
         'Inserting into another database "khac"|||Chèn vào database khác "khac"',
         'Dropping a collection and creating an index in ctshop|||Xoá một collection và tạo index trong ctshop'], 3,
        'EN: dropDatabase, getUsers and writes to khac were "not authorized", but tam.drop() returned true and createIndex returned x_1. A custom role with find/insert/update/remove kept the API working and made orders.drop() fail.|||VI: dropDatabase, getUsers và ghi vào khac đều "not authorized", nhưng tam.drop() trả true và createIndex trả x_1. Vai trò tự định nghĩa với find/insert/update/remove giữ API chạy được và làm orders.drop() thất bại.'),
      q('ctshopApi was created in database ctshop. A deploy uses `...@host/ctshop?authSource=admin` with the correct password. Result and where to confirm?|||ctshopApi được tạo trong database ctshop. Một lần triển khai dùng `...@host/ctshop?authSource=admin` với đúng mật khẩu. Kết quả, và xác nhận ở đâu?',
        ['Works — authSource only matters for root users|||Chạy được — authSource chỉ có nghĩa với user root',
         'Works, but with read-only rights|||Chạy được nhưng chỉ có quyền đọc',
         '"Authentication failed." — the client sees the same text as a wrong password; the server log says UserNotFound for db "admin"|||"Authentication failed." — client thấy cùng câu với sai mật khẩu; log máy chủ ghi UserNotFound for db "admin"',
         '"not authorized on ctshop"|||"not authorized on ctshop"'], 2,
        'EN: Both the wrong authSource and the wrong password printed "MongoServerError: Authentication failed."; the mongod log distinguished UserNotFound (db admin) from "storedKey mismatch" (db ctshop). Same client message on purpose: no user enumeration.|||VI: Cả authSource sai lẫn mật khẩu sai đều in "MongoServerError: Authentication failed."; log mongod phân biệt UserNotFound (db admin) với "storedKey mismatch" (db ctshop). Client nhận cùng một câu là cố ý: để không dò được user nào tồn tại.'),
      q('`findOne({ email: req.body.email, matKhau: req.body.matKhau })` behind `express.json()`. The body is `{"email":"admin@ctshop.vn","matKhau":{"$ne":null}}`. What happened, and what is the main fix?|||`findOne({ email: req.body.email, matKhau: req.body.matKhau })` sau `express.json()`. Thân request là `{"email":"admin@ctshop.vn","matKhau":{"$ne":null}}`. Chuyện gì đã xảy ra, và cách vá chính là gì?',
        ['401 — MongoDB rejects operators coming from JSON|||401 — MongoDB từ chối toán tử đến từ JSON',
         'Logged in as admin; the main fix is checking that each field is a string (or a schema) before querying, then comparing a salted hash outside the query|||Đăng nhập được vào admin; cách vá chính là kiểm từng trường phải là chuỗi (hoặc dùng schema) trước khi truy vấn, rồi so mật khẩu băm có muối ngoài truy vấn',
         'A CastError, because matKhau is declared as String in the driver|||Lỗi CastError, vì matKhau đã khai báo String trong driver',
         'Logged in; the fix is escaping the $ character in the string|||Đăng nhập được; cách vá là thoát ký tự $ trong chuỗi'], 1,
        'EN: The vulnerable API answered {"chao":"Quản trị","vaiTro":"admin"}; the patched API answered 400 du-lieu-sai. The raw driver has no schema; CastError only appears with Mongoose + sanitizeFilter. There is no string to escape — the input is an object.|||VI: API có lỗi trả {"chao":"Quản trị","vaiTro":"admin"}; API đã vá trả 400 du-lieu-sai. Driver thô không có schema; CastError chỉ xuất hiện khi dùng Mongoose + sanitizeFilter. Không có chuỗi nào để thoát — đầu vào là một object.'),
      q('Express 5 app, `GET /khach?email[$ne]=x` into `findOne({ email: req.query.email })`. What did the lab show?|||Ứng dụng Express 5, `GET /khach?email[$ne]=x` đi vào `findOne({ email: req.query.email })`. Lab cho thấy gì?',
        ['Always vulnerable, like Express 4|||Luôn có lỗi, giống Express 4',
         'Never vulnerable: Express 5 strips $ from all input|||Không bao giờ có lỗi: Express 5 tự xoá $ khỏi mọi đầu vào',
         'Vulnerable only for JSON bodies, never for queries, whatever the configuration|||Chỉ lỗi với thân JSON, không bao giờ với query, cấu hình thế nào cũng vậy',
         'With the default simple parser the key stayed "email[$ne]" and nothing matched; adding app.set("query parser", "extended") returned the admin|||Với bộ phân tích simple mặc định, khoá giữ nguyên "email[$ne]" và không khớp gì; thêm app.set("query parser", "extended") thì trả về admin'], 3,
        'EN: Output 1: {"q":{"email[$ne]":"x"},"ketQua":null}. Output 2 (same code + extended parser): {"q":{"email":{"$ne":"x"}},"ketQua":{"email":"admin@ctshop.vn",…}}. JSON bodies are objects regardless. Type-check query parameters too.|||VI: Output 1: {"q":{"email[$ne]":"x"},"ketQua":null}. Output 2 (cùng mã + bộ phân tích extended): {"q":{"email":{"$ne":"x"}},"ketQua":{"email":"admin@ctshop.vn",…}}. Thân JSON thì luôn là object. Tham số query cũng phải kiểm kiểu.'),
      q('A search endpoint passes `req.query.q` to `$regex`. After 200 accounts named "aaaaaaaaaaaaaaaaaaaa!" exist, q=`(a+)+$`. What was measured, and the fix?|||Endpoint tìm kiếm đưa `req.query.q` vào `$regex`. Sau khi có 200 tài khoản tên "aaaaaaaaaaaaaaaaaaaa!", gửi q=`(a+)+$`. Đo được gì, và cách vá?',
        ['~0.4–0.5 s of server CPU per request (vs ~2 ms before); escape the text, anchor it, limit length and results, add maxTimeMS|||~0,4–0,5 giây CPU máy chủ mỗi request (so với ~2 ms trước đó); thoát ký tự, neo đầu, giới hạn độ dài và số kết quả, thêm maxTimeMS',
         'The server crashed with an out-of-memory error|||Máy chủ sập vì hết bộ nhớ',
         'No difference: MongoDB caches regex results|||Không khác gì: MongoDB lưu đệm kết quả regex',
         'MongoDB rejected the pattern as invalid PCRE2|||MongoDB từ chối mẫu vì PCRE2 không hợp lệ'], 0,
        'EN: Three runs: 529, 496, 403 ms. In mongosh the cost grew ~4× per 2 extra characters, then plateaued at ~2 ms per document — bounded per document but multiplied by documents scanned. Patched: the escaped pattern took ~1–2 ms.|||VI: Ba lần chạy: 529, 496, 403 ms. Trong mongosh, chi phí tăng ~4 lần mỗi khi dài thêm 2 ký tự, rồi chững ở ~2 ms mỗi tài liệu — có giới hạn trên từng tài liệu nhưng nhân theo số tài liệu quét. Bản vá: mẫu đã thoát ký tự chỉ mất ~1–2 ms.'),
      q('Your app gets "self-signed certificate in certificate chain" connecting to a TLS mongod with an internal CA. A colleague suggests tlsAllowInvalidCertificates=true. Why not?|||Ứng dụng nhận lỗi "self-signed certificate in certificate chain" khi kết nối tới mongod TLS dùng CA nội bộ. Đồng nghiệp gợi ý tlsAllowInvalidCertificates=true. Vì sao không nên?',
        ['It disables encryption entirely|||Nó tắt hẳn mã hoá',
         'It accepts any certificate, so a man in the middle can present his own — encrypted, but to the attacker; give the client tlsCAFile instead|||Nó chấp nhận mọi chứng chỉ, nên kẻ đứng giữa đưa chứng chỉ của hắn ra là được — vẫn mã hoá, nhưng là với kẻ tấn công; hãy đưa tlsCAFile cho client',
         'MongoDB 8.0 removed the option|||MongoDB 8.0 đã bỏ tuỳ chọn này',
         'It only works with x.509 client certificates|||Nó chỉ chạy với chứng chỉ x.509 của client'], 1,
        'EN: --tls without CA gave "self-signed certificate in certificate chain"; a wrong name gave "Hostname/IP does not match certificate\'s altnames"; with tlsCAFile and a SAN name it worked and the proxy saw no readable text. Note mongod 8.0 itself refused to start without --tlsCAFile.|||VI: --tls không có CA ra lỗi "self-signed certificate in certificate chain"; sai tên ra "Hostname/IP does not match certificate\'s altnames"; có tlsCAFile và tên nằm trong SAN thì chạy được, và proxy không đọc được chữ nào. Lưu ý chính mongod 8.0 cũng không chịu khởi động nếu thiếu --tlsCAFile.'),
      q('With CSFLE you encrypt `sdt` (phone) and `cccd` (national ID). Customers are looked up by phone, never by ID. Which algorithms, and what did the lab show?|||Dùng CSFLE, bạn mã hoá `sdt` (số điện thoại) và `cccd`. Khách được tra theo số điện thoại, không bao giờ theo CCCD. Chọn thuật toán nào, và lab cho thấy gì?',
        ['Random for both — Deterministic is deprecated|||Random cho cả hai — Deterministic đã bị bỏ',
         'Deterministic for both, so the DBA can still search|||Deterministic cho cả hai, để DBA vẫn tìm được',
         'Deterministic for sdt (equal inputs gave equal ciphertexts, so equality search worked), Random for cccd (two encryptions differed); the DBA saw only Binary subtype 6|||Deterministic cho sdt (đầu vào giống nhau cho bản mã giống nhau, nên tìm bằng nhau được), Random cho cccd (hai lần mã khác nhau); DBA chỉ thấy Binary subtype 6',
         'No encryption needed: TLS already protects the fields|||Không cần mã hoá: TLS đã bảo vệ các trường'], 2,
        'EN: "Deterministic giống nhau: true · Random giống nhau: false"; a plain client found 0 documents by plaintext phone; the keyed client found customer 2 by the encrypted phone. A different CMK gave "HMAC validation failure", and deleting the DEK made the data unreadable (crypto-shredding). TLS protects only the wire.|||VI: "Deterministic giống nhau: true · Random giống nhau: false"; client thường tìm theo số điện thoại rõ được 0 tài liệu; client có khoá tìm ra khách số 2 bằng số điện thoại đã mã hoá. CMK khác ra lỗi "HMAC validation failure", xoá DEK thì dữ liệu không đọc được nữa (crypto-shredding). TLS chỉ bảo vệ đường truyền.'),
    ],
  },
};
