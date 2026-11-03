/**
 * TypeScript · Chương 11 · Quiz Chương 11 (10 câu tình huống về gõ kiểu backend Node/Express). Slug giữ: typescript-11-5-quiz (→ 10 câu, 04/11/2026).
 * Dữ kiện đã chạy thật (Node 22.23.3, tsc 7.0.2) trong demo11. Đáp án rải: A ×3 (1,5,9) · B ×3 (2,6,10) · C ×2 (3,7) · D ×2 (4,8).
 */
export default {
  title: 'Chapter 11 check — 10 scenario questions|||Kiểm tra Chương 11 — 10 câu tình huống',
  slug: 'typescript-11-5-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống về Chương 11: gõ kiểu backend Node/Express — handler (params/query/body), response có kiểu, envelope kết quả API + lỗi, và tầng config/service. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
<div class="ml-en"><span class="eyebrow">Chapter 11 · Check</span><h2>Chapter 11 check</h2>
<p class="lead">Ten scenarios on typing a Node/Express backend — handlers, typed responses, the API envelope, and the config/service layers. Every message comes from a real run (Node 22.23.3, tsc 7.0.2).</p></div>
<div class="ml-vi"><span class="eyebrow">Chương 11 · Kiểm tra</span><h2>Kiểm tra Chương 11</h2>
<p class="lead">Mười tình huống về gõ kiểu một backend Node/Express — handler, response có kiểu, envelope API, và tầng config/service. Mọi thông báo từ lần chạy thật (Node 22.23.3, tsc 7.0.2).</p></div>
`,
  quiz: {
    timeLimitSeconds: 900,
    passingScore: 70,
    questions: [
      {
        question: 'A handler is typed Handler<{ id: string }>, and its body reads req.params.labId. What does tsc say?|||Một handler kiểu Handler<{ id: string }>, và thân nó đọc req.params.labId. tsc nói gì?',
        options: [
          'TS2339: labId does not exist on the params type — the typed request only exposes the declared params.|||TS2339: labId không tồn tại trên kiểu params — request có kiểu chỉ phơi các param đã khai.',
          'Nothing — params is always any.|||Không gì — params luôn là any.',
          'TS2322.|||TS2322.',
          'A runtime undefined.|||Một undefined lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-1/wrongparam): TS2339. A typed request is a contract — the handler can only read the params the route declares, so a typo becomes a compile error instead of a run-time undefined.|||VI: Đo thật (demo11/ts-11-1/wrongparam): TS2339. Một request có kiểu là một hợp đồng — handler chỉ đọc được các param route khai, nên một lỗi gõ thành một lỗi biên dịch thay vì một undefined lúc chạy.',
      },
      {
        question: 'What does Handler<P, Q, B, T> carry?|||Handler<P, Q, B, T> mang gì?',
        options: [
          'Only the request body.|||Chỉ body request.',
          'The params, query, body and response type — the route’s shape carried into a plain function.|||Params, query, body và kiểu response — dáng của route mang vào một hàm thường.',
          'Nothing at compile time.|||Không gì lúc biên dịch.',
          'The HTTP status code only.|||Chỉ mã trạng thái HTTP.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-1): the handler is a plain function; its four generics carry the params, query, body and response type so the compiler checks the body against the route. The real @types/express is the same shape with more overloads.|||VI: Đo thật (demo11/ts-11-1): handler là một hàm thường; bốn generic của nó mang params, query, body và kiểu response để trình biên dịch kiểm thân với route. @types/express thật cùng dáng với nhiều overload hơn.',
      },
      {
        question: 'A handler’s response type is Booking (with seats: number). res.json sends seats as a string. What does tsc say?|||Kiểu response của một handler là Booking (seats: number). res.json gửi seats là một string. tsc nói gì?',
        options: [
          'Nothing — res.json accepts any JSON.|||Không gì — res.json nhận JSON nào cũng được.',
          'TS2339.|||TS2339.',
          'TS2322: string is not assignable to number — the typed response refuses a wrong-type field.|||TS2322: string không gán được cho number — response có kiểu từ chối một trường sai kiểu.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-2/wrongbody): TS2322. When the response type is part of the handler, res.json checks the shape — the server cannot send a value the route did not declare, so the response and its client stay in step.|||VI: Đo thật (demo11/ts-11-2/wrongbody): TS2322. Khi kiểu response là một phần của handler, res.json kiểm dáng — máy chủ không gửi được một giá trị route không khai, nên response và client của nó bám nhau.',
      },
      {
        question: 'A handler’s response type is Lab (code and seats). res.json sends only { code }. What does tsc say?|||Kiểu response của một handler là Lab (code và seats). res.json gửi chỉ { code }. tsc nói gì?',
        options: [
          'Nothing — extra fields are optional.|||Không gì — trường thừa là tuỳ chọn.',
          'TS2339.|||TS2339.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'TS2741: seats is missing — the typed response enforces completeness, not just correctness.|||TS2741: thiếu seats — response có kiểu ép đầy đủ, không chỉ đúng đắn.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-2/practice): TS2741. Together with the wrong-type check (TS2322), the typed response guarantees every field the route promises is present and correct.|||VI: Đo thật (demo11/ts-11-2/practice): TS2741. Cùng với phép kiểm sai-kiểu (TS2322), response có kiểu bảo đảm mọi trường route hứa đều có và đúng.',
      },
      {
        question: 'How is ApiResult<T> typed?|||ApiResult<T> được gõ kiểu thế nào?',
        options: [
          '{ ok: true; data: T } | { ok: false; error } — a discriminated union, tagged by ok.|||{ ok: true; data: T } | { ok: false; error } — một discriminated union, gắn nhãn theo ok.',
          'Always { data: T; error: E } together.|||Luôn { data: T; error: E } cùng nhau.',
          'Just T, with errors thrown.|||Chỉ T, lỗi được ném.',
          'any, for flexibility.|||any, để linh hoạt.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-3): ApiResult<T> is { ok: true; data: T } | { ok: false; error }. It is the Chapter 5 discriminated union applied to a whole API — one shape, tagged by ok, that the client narrows.|||VI: Đo thật (demo11/ts-11-3): ApiResult<T> là { ok: true; data: T } | { ok: false; error }. Nó là discriminated union của Chương 5 áp cho cả một API — một dáng, gắn nhãn theo ok, mà client thu hẹp.',
      },
      {
        question: 'A function reads r.data on an ApiResult<Booking> without checking r.ok. What does tsc say?|||Một hàm đọc r.data trên một ApiResult<Booking> mà không kiểm r.ok. tsc nói gì?',
        options: [
          'Nothing — data is always present.|||Không gì — data luôn có.',
          'TS2339: data does not exist on the error branch — you must narrow on ok first.|||TS2339: data không tồn tại ở nhánh error — bạn phải thu hẹp theo ok trước.',
          'TS2322.|||TS2322.',
          'A runtime crash only.|||Chỉ một cú sập lúc chạy.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-3/wrongbranch): TS2339. The discriminant forces the narrowing — you must handle the failure before you touch the success, so a client cannot silently ignore an endpoint’s errors.|||VI: Đo thật (demo11/ts-11-3/wrongbranch): TS2339. Nhãn ép phép thu hẹp — bạn phải xử lý thất bại trước khi chạm thành công, nên một client không âm thầm bỏ qua lỗi của một endpoint.',
      },
      {
        question: 'What does a typed error branch in ApiResult give you?|||Một nhánh error có kiểu trong ApiResult cho bạn gì?',
        options: [
          'Nothing — errors are just strings.|||Không gì — lỗi chỉ là string.',
          'It hides the error from the client.|||Nó giấu lỗi khỏi client.',
          'An error with a code and a message — the client reads r.error.code with the same safety as r.data.|||Một lỗi có một code và một message — client đọc r.error.code với cùng an toàn như r.data.',
          'A thrown exception.|||Một exception được ném.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The error branch has its own typed shape (a code and a message), so a client can switch on the code and show the message, and the compiler checks every error carries both — no stringly-typed errors, no guessing.|||VI: Nhánh error có dáng có kiểu riêng (một code và một message), nên một client switch theo code và hiện message, và trình biên dịch kiểm mọi lỗi mang cả hai — không lỗi kiểu-chuỗi, không đoán.',
      },
      {
        question: 'A Config has readonly fields. A module writes cfg.port = 3000. What does tsc say?|||Một Config có các trường readonly. Một module viết cfg.port = 3000. tsc nói gì?',
        options: [
          'Nothing — config is mutable.|||Không gì — config sửa được.',
          'A runtime error.|||Một lỗi lúc chạy.',
          'TS2322.|||TS2322.',
          'TS2540: cannot assign to a read-only property — a config built once cannot drift at run time.|||TS2540: không gán được cho một thuộc tính chỉ đọc — một config dựng một lần không trôi lúc chạy.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-4/frozen): TS2540. A readonly config is frozen at the type level — no module can change it after startup, so it is a value you can trust everywhere it is read. This is Chapter 8’s Readonly, doing one important job.|||VI: Đo thật (demo11/ts-11-4/frozen): TS2540. Một config readonly bị đóng băng ở tầng kiểu — không module nào đổi nó sau khởi động, nên nó là một giá trị bạn tin ở mọi nơi nó được đọc. Đây là Readonly của Chương 8, làm một việc quan trọng.',
      },
      {
        question: 'A service returns store.find(...) but its return type says Booking. What does tsc say?|||Một service trả store.find(...) nhưng kiểu trả về nói Booking. tsc nói gì?',
        options: [
          'TS2322: Booking | undefined is not assignable to Booking — find may miss, so the honest return type is Booking | undefined.|||TS2322: Booking | undefined không gán được cho Booking — find có thể trượt, nên kiểu trả về trung thực là Booking | undefined.',
          'Nothing — find always returns a Booking.|||Không gì — find luôn trả một Booking.',
          'TS2339.|||TS2339.',
          'A runtime error only.|||Chỉ một lỗi lúc chạy.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured (demo11/ts-11-4/practice): TS2322. A service’s signature must match reality — Array.find may return undefined, so promising a plain Booking is a lie the compiler catches. The honest type is Booking | undefined, and the caller guards the miss.|||VI: Đo thật (demo11/ts-11-4/practice): TS2322. Chữ ký của một service phải khớp thực tế — Array.find có thể trả undefined, nên hứa một Booking thuần là một lời nói dối trình biên dịch bắt. Kiểu trung thực là Booking | undefined, và người gọi chặn trường hợp trượt.',
      },
      {
        question: 'In this chapter, how is the Express surface modelled so the examples run with tsc and Node?|||Trong chương này, bề mặt Express được mô hình hoá thế nào để ví dụ chạy với tsc và Node?',
        options: [
          'By installing @types/express into every demo.|||Bằng cài @types/express vào mọi demo.',
          'A small self-contained typed model (Req/Res/Handler) — the same shape @types/express gives you, measured with @types/node.|||Một mô hình kiểu nhỏ tự-chứa (Req/Res/Handler) — đúng dáng @types/express cho, đo với @types/node.',
          'By running a real Express server.|||Bằng chạy một máy chủ Express thật.',
          'The examples do not run — they are illustrative only.|||Ví dụ không chạy — chỉ minh hoạ.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The chapter uses a tiny typed model — Req, Res, Handler — that mirrors @types/express exactly, so every example type-checks with tsc 7.0.2 and runs with Node, while teaching the real handler/response/envelope patterns.|||VI: Chương dùng một mô hình kiểu nhỏ — Req, Res, Handler — phản chiếu @types/express đúng dáng, nên mọi ví dụ kiểu-kiểm với tsc 7.0.2 và chạy với Node, trong khi dạy đúng các mẫu handler/response/envelope thật.',
      },
    ],
  },
};
