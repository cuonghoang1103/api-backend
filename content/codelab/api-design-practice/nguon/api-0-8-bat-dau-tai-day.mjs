/** API Design · Mục 0 · "Bắt đầu tại đây (1/2)" — API là hợp đồng, năm từ hay nhầm, bốn kiểu API, lịch sử có nguồn. */
import { doiDau, KHOA, cs, q, ord, bang1, tn } from './_api.mjs';

/* ── 1. Năm từ hay nhầm ── */
const NGHIA = ['The whole contract: every operation, format and error', 'A kind of thing the API lets you work with', 'One operation: an HTTP method + a path', 'The server code that handles one endpoint', 'The full address of a resource'];
const S1 = cs({
  ten: 'Start 1 — Five words people mix up', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Lesson “Start here 1/2” separates five words that teammates use as if they meant the same thing. Match each example from LabFlow to the word it illustrates.',
  vi: 'Bài "Bắt đầu tại đây 1/2" tách năm từ mà các bạn cùng nhóm hay dùng như thể cùng nghĩa. Ghép mỗi ví dụ của LabFlow với từ mà nó minh hoạ.',
  bang: [bang1('b1', ['Example → word → meaning', 'Ví dụ → từ → nghĩa'], [{ ma: 'x', ten: 'LabFlow example' }, { ma: 'w', ten: 'Word', luaChon: ['API', 'resource', 'endpoint', 'route', 'URL'] }, { ma: 'm', ten: 'Meaning', luaChon: NGHIA }], [
    { o: { x: '“The LabFlow API”' }, a: { w: 'API', m: NGHIA[0] } },
    { o: { x: 'a lab, a device, a booking' }, a: { w: 'resource', m: NGHIA[1] } },
    { o: { x: 'POST /bookings' }, a: { w: 'endpoint', m: NGHIA[2] } },
    { o: { x: "app.post('/bookings', (req, res) => { … })" }, a: { w: 'route', m: NGHIA[3] } },
    { o: { x: 'http://localhost:4000/labs/lab_1' }, a: { w: 'URL', m: NGHIA[4] } },
  ], ['Clients only see endpoints and resources; routes are server code you can rewrite freely as long as each endpoint keeps its promise. A URL is just an address; the API is the whole contract.', 'Client chỉ thấy endpoint và tài nguyên; route là code phía server, viết lại thoải mái miễn mỗi endpoint giữ lời hứa. URL chỉ là địa chỉ; API là cả bản hợp đồng.'])],
  goiY: [['Ask: who sees this — the client or only the server team?', 'Hỏi: ai nhìn thấy thứ này — client hay chỉ đội server?'], ['An endpoint always has a METHOD in front of the path.', 'Endpoint luôn có PHƯƠNG THỨC đứng trước đường dẫn.']],
  loi: [['Calling the Express handler “the endpoint”: the handler is the route (implementation).', 'Gọi handler Express là "endpoint": handler là route (phần cài đặt).'], ['Calling the full URL “the resource”: the URL is the address of the resource.', 'Gọi cả URL là "tài nguyên": URL là địa chỉ của tài nguyên.']],
  tns: [tn('endpoint', 'điểm cuối', 'Một thao tác: phương thức + đường dẫn.'), tn('route', 'tuyến', 'Code phía server xử lý một endpoint.'), tn('resource', 'tài nguyên')],
  kn: ['API vocabulary'],
});

/* ── 2. API là hợp đồng — tình huống ── */
const S2 = cs({
  ten: 'Start 2 — The API is a contract', kho: 'EASY', phut: 8,
  en: 'Five short situations from a team project. Choose what the API-design view of each one is.',
  vi: 'Năm tình huống ngắn trong một đồ án nhóm. Chọn cách nhìn đúng theo thiết kế API cho mỗi tình huống.',
  cau: [
    q('c1', ['The back end moves from Express to Spring Boot, but every endpoint answers exactly as before. Which clients must change?', 'Back end chuyển từ Express sang Spring Boot, nhưng endpoint nào cũng trả lời y như cũ. Client nào phải sửa?'], ['None — the contract did not change', 'All of them — the language changed', 'Only the mobile app, because it is compiled', 'Only clients written in JavaScript'], ['Like the restaurant kitchen: the menu (contract) stayed the same, so no customer notices. Routes and frameworks are implementation.', 'Như bếp nhà hàng: thực đơn (hợp đồng) giữ nguyên nên không khách nào nhận ra. Route và framework là phần cài đặt.']),
    q('c2', ['Renaming the field items to data is a 2-minute change. When does it become expensive?', 'Đổi tên trường items thành data mất 2 phút. Khi nào nó trở nên đắt?'], ['After the first client ships and depends on items', 'Only when the database column is renamed too', 'Never — clients should read every field name dynamically', 'Only if the API has more than 100 endpoints'], ['Before any client exists, a rename is free; after release, every client and every old app version must change — a breaking change (Chapter 4).', 'Trước khi có client, đổi tên là miễn phí; sau khi phát hành, mọi client và mọi bản app cũ phải sửa — một thay đổi phá vỡ (Chương 4).']),
    q('c3', ['What does “REST API” in a junior job advert almost always mean?', '"REST API" trong tin tuyển junior gần như luôn nghĩa là gì?'], ['JSON over HTTP, URLs that name resources, methods and status codes used correctly', 'Any API that uses the HTTP protocol, including SOAP envelopes', 'An API written with the Express framework in Node.js', 'An API that returns XML documents with a schema'], ['REST is a design style (Fielding, 2000) on top of HTTP. In job adverts it means resource-oriented JSON over HTTP — not a framework and not “anything over HTTP”.', 'REST là một phong cách thiết kế (Fielding, 2000) trên nền HTTP. Trong tin tuyển dụng nó nghĩa là JSON qua HTTP hướng tài nguyên — không phải một framework, cũng không phải "bất cứ thứ gì qua HTTP".']),
    q('c4', ['Six clients (web, mobile, admin, bot, report script, partner) each read the database directly. What is the main risk the API removes?', 'Sáu client (web, mobile, admin, bot, script báo cáo, đối tác) đều đọc thẳng cơ sở dữ liệu. Rủi ro chính mà API loại bỏ là gì?'], ['Six copies of the business rules, six ways to get them wrong', 'The database cannot handle six connections at once', 'The clients would be slower than through HTTP', 'The database would need six different passwords'], ['With an API, rules such as “a lab cannot be booked twice” live in one place. Without it, each client re-implements them.', 'Có API, các luật như "một phòng không được đặt trùng" nằm ở một chỗ. Không có nó, client nào cũng tự viết lại.']),
    q('c5', ['Which pair is the same idea at two levels?', 'Cặp nào là cùng một ý ở hai tầng?'], ['HTTP is the protocol; REST is a design style that uses it', 'REST is the protocol; HTTP is a style that uses it', 'HTTP and REST are two names of RFC 9110', 'REST replaced HTTP after the year 2000'], ['HTTP defines messages (methods, codes, headers); REST is a way of designing with resources and uniform methods on top of it. RPC and GraphQL also run over HTTP.', 'HTTP định nghĩa thông điệp (phương thức, mã, header); REST là cách thiết kế với tài nguyên và phương thức đồng nhất ở bên trên. RPC và GraphQL cũng chạy qua HTTP.']),
  ],
  goiY: [['Separate what clients depend on (the contract) from how the server does it (implementation).', 'Tách thứ client phụ thuộc (hợp đồng) khỏi cách server làm (cài đặt).'], ['Cost of change grows the moment someone depends on you.', 'Chi phí thay đổi tăng vọt ngay khi có người phụ thuộc vào bạn.']],
  loi: [['Treating REST as a library you install.', 'Coi REST là một thư viện để cài.'], ['Thinking an internal rename is “free” after clients have shipped.', 'Nghĩ đổi tên nội bộ là "miễn phí" sau khi client đã phát hành.']],
  tns: [tn('contract', 'hợp đồng'), tn('breaking change', 'thay đổi phá vỡ'), tn('implementation', 'phần cài đặt')],
  kn: ['API as a contract'],
});

/* ── 3. Lịch sử ── */
const S3 = cs({
  ten: 'Start 3 — Put the history in order', kho: 'MEDIUM', phut: 6, loai: 'order',
  en: 'Every date below is sourced in the lesson (RFC editor, Fielding’s dissertation, graphql.org, OpenAPI history). Put the milestones in time order.',
  vi: 'Mọi mốc dưới đây đều có nguồn trong bài (RFC editor, luận án Fielding, graphql.org, lịch sử OpenAPI). Sắp các mốc theo thời gian.',
  cau: [
    ord('o1', ['From remote calls to written contracts', 'Từ gọi thủ tục từ xa tới hợp đồng viết ra'], [
      'RFC 707 describes calling procedures on another machine (1976)',
      'HTTP/1.0 adds headers and status codes (RFC 1945, 1996)',
      'XML-RPC wraps function calls in XML (1998)',
      'Roy Fielding names REST in his dissertation (2000)',
      'Swagger 1.0 describes a REST API in one file (2011)',
      'Facebook publishes the GraphQL specification (2015)',
      'RFC 9457 standardises the JSON shape of API errors (2023)',
    ], ['1976 → 1996 → 1998 → 2000 → 2011 → 2015 → 2023. The direction: from “call a function over there” to a written, checkable contract.', '1976 → 1996 → 1998 → 2000 → 2011 → 2015 → 2023. Hướng đi: từ "gọi một hàm ở đằng kia" tới một hợp đồng viết ra và kiểm được.']),
  ],
  goiY: [['The idea of remote calls is older than the Web.', 'Ý tưởng gọi từ xa còn cũ hơn cả Web.'], ['REST got its name in the same year as SOAP 1.1.', 'REST có tên cùng năm với SOAP 1.1.']],
  loi: [['Placing REST after GraphQL: REST was named fifteen years earlier.', 'Đặt REST sau GraphQL: REST có tên sớm hơn mười lăm năm.'], ['Thinking Swagger came after OpenAPI: OpenAPI is Swagger renamed (2016).', 'Nghĩ Swagger ra sau OpenAPI: OpenAPI chính là Swagger đổi tên (2016).']],
  tns: [tn('RPC', 'gọi thủ tục từ xa'), tn('specification', 'đặc tả')],
  kn: ['history'],
});

export default doiDau({ slug: 'api-0-8-bat-dau-tai-day', ten: 'Start here 1/2 — What an API is', khoa: KHOA, baiHoc: 'api-0-8-bat-dau-tai-day', de: [S1, S2, S3] });
