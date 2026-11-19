/**
 * spring-boot/s05-validation.mjs — Chương 5: Validate dữ liệu và xử lý lỗi (soạn 19/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Framework 7.0.10 / Hibernate Validator 9.1.5.Final / Jackson 3 trên Temurin 21.0.12.1,
 * PostgreSQL 16 (container sb-c5-pg); Express 5.3.0 + zod 4.6.7 trên Node 22 để so sánh. Mã demo: scratchpad/sb/lab/c5/val (v51…v54),
 * lab/c5/lab5/{starter,giai} + cham.sh; Node: ~/.rtq-sb/c5/node ; output: ~/.rtq-sb/c5/o, ~/.rtq-sb/c55/o. Hằng MA.. / OUT.. sinh bằng tam/s05/build.sh + gen-ma.mjs.
 */
import { java, js, sql, bash, props, out, tl, giai } from './_chung.mjs';

// ===== Bài 5.1 =====
const MA51_REQ = java("import jakarta.validation.Valid;\nimport jakarta.validation.constraints.*;\nimport java.time.LocalDateTime;\nimport java.util.List;\n\npublic record CreateBookingRequest(\n        @NotNull @Positive Long labId,\n        @NotBlank @Size(max = 80) String studentName,\n        @NotBlank @Email String email,\n        @NotNull @Future LocalDateTime startAt,\n        @Min(30) @Max(240) int minutes,\n        @Size(max = 500) String note,\n        @Size(max = 5) List<@NotBlank @Size(max = 30) String> equipment,\n        @Valid @NotNull Contact contact) {\n\n    public record Contact(\n            @NotBlank @Pattern(regexp = \"0\\\\d{9}\", message = \"phải là số di động 10 chữ số, bắt đầu bằng 0\") String phone) {\n    }\n}");
const MA51_CTRL = java("@RestController\npublic class BookingController {\n\n    // v1: không @Valid — mọi thứ đi thẳng vào\n    @PostMapping(\"/v1/bookings\")\n    @ResponseStatus(HttpStatus.CREATED)\n    public CreateBookingRequest createV1(@RequestBody CreateBookingRequest req) {\n        return req;\n    }\n\n    // v2: @Valid — Spring gọi Validator trước khi vào hàm\n    @PostMapping(\"/v2/bookings\")\n    @ResponseStatus(HttpStatus.CREATED)\n    public CreateBookingRequest createV2(@Valid @RequestBody CreateBookingRequest req) {\n        return req;\n    }\n\n    // ràng buộc trên tham số: Spring 6.1+ tự validate (method validation), không cần @Validated\n    @GetMapping(\"/bookings/{id}\")\n    public Map<String, Object> one(@PathVariable @Positive long id) {\n        return Map.of(\"id\", id);\n    }\n\n    @GetMapping(\"/bookings\")\n    public Map<String, Object> page(@RequestParam(defaultValue = \"20\") @Max(100) int size) {\n        return Map.of(\"size\", size);\n    }\n}");
const OUT51_OK = out("$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}'\n{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"note\":null,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}\n[HTTP 201]");
const OUT51_V1 = out("$ curl -X POST localhost:41870/v1/bookings -H 'Content-Type: application/json' -d '{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}'\n{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"note\":null,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}\n[HTTP 201]");
const OUT51_V2 = out("$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}'\n{\"timestamp\":\"2026-11-18T22:39:06.011Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/v2/bookings\"}\n[HTTP 400]");
const OUT51_WARN = out("WARN  DefaultHandlerExceptionResolver : Resolved [org.springframework.web.bind.MethodArgumentNotValidException: Validation failed for argument [0] in public com.cuongthai.c5.v51.CreateBookingRequest com.cuongthai.c5.v51.BookingController.createV2(com.cuongthai.c5.v51.CreateBookingRequest) with 8 errors: \n  [Field error in object 'createBookingRequest' on field 'startAt': rejected value [2020-01-15T08:00]; codes [Future.createBookingRequest.startAt,Future.startAt,Future.java.time.LocalDateTime,Future]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [createBookingRequest.startAt,startAt]; arguments []; default message [startAt]]; default message [must be a future date]]\n  … 7 lỗi trường nữa, cùng dạng (minutes, studentName, labId, email, contact.phone, equipment[0], equipment[1])");
const OUT51_THAMSO = out("$ curl localhost:41870/bookings/-5\n{\"timestamp\":\"2026-11-18T22:39:06.044Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings/-5\"}\n[HTTP 400]\n\n$ curl localhost:41870/bookings?size=1000\n{\"timestamp\":\"2026-11-18T22:39:06.061Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n[HTTP 400]\n\n$ curl localhost:41870/bookings/7\n{\"id\":7}\n[HTTP 200]");
const MA51_NESTED = java("// Quên @Valid trên trường lồng: ràng buộc bên trong Contact bị bỏ qua\n@RestController\npublic class NestedNoValid {\n    public record Contact(@NotBlank String phone) { }\n    public record Req(@NotBlank String studentName, @NotNull Contact contact) { }\n\n    @PostMapping(\"/nested\")\n    public Req create(@Valid @RequestBody Req req) {\n        return req;\n    }\n}");
const OUT51_LONG = out("$ curl -X POST localhost:41870/nested -H 'Content-Type: application/json' -d '{\"studentName\":\"Lan\",\"contact\":{\"phone\":\"\"}}'\n{\"studentName\":\"Lan\",\"contact\":{\"phone\":\"\"}}\n[HTTP 200]");
const MA51_CHECK = java("@RestController\npublic class CheckController {\n    private final Validator validator;   // jakarta.validation.Validator — Spring Boot tạo sẵn bean này\n\n    public CheckController(Validator validator) {\n        this.validator = validator;\n    }\n\n    // Gọi Validator bằng tay: trả danh sách vi phạm (đường dẫn trường, thông báo, giá trị bị từ chối)\n    @PostMapping(\"/check\")\n    public List<String> check(@RequestBody CreateBookingRequest req) {\n        return validator.validate(req).stream()\n                .map(v -> v.getPropertyPath() + \": \" + v.getMessage() + \" (\" + v.getInvalidValue() + \")\")\n                .sorted()\n                .toList();\n    }");
const OUT51_CHECK = out("$ curl -X POST localhost:41870/check -H 'Content-Type: application/json' -d '{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}'\n[\"contact.phone: phải là số di động 10 chữ số, bắt đầu bằng 0 (12345)\",\"email: must be a well-formed email address (lan-at-fpt)\",\"equipment[0].<list element>: must not be blank ()\",\"equipment[1].<list element>: must not be blank ()\",\"labId: must be greater than 0 (-1)\",\"minutes: must be less than or equal to 240 (5000)\",\"startAt: must be a future date (2020-01-15T08:00)\",\"studentName: must not be blank (   )\"]\n[HTTP 200]\n\n$ curl -X POST localhost:41870/check -H 'Content-Type: application/json' -H 'Accept-Language: vi' -d '{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}'\n[\"contact.phone: phải là số di động 10 chữ số, bắt đầu bằng 0 (12345)\",\"email: không phải địa chỉ email hợp lệ (lan-at-fpt)\",\"equipment[0].<list element>: không được để trống ()\",\"equipment[1].<list element>: không được để trống ()\",\"labId: phải lớn hơn 0 (-1)\",\"minutes: phải nhỏ hơn hoặc bằng 240 (5000)\",\"startAt: phải là thời điểm trong tương lai (2020-01-15T08:00)\",\"studentName: không được để trống (   )\"]\n[HTTP 200]");
const PROPS51_VI = props("jakarta.validation.constraints.NotBlank.message=không được để trống\njakarta.validation.constraints.NotNull.message=bắt buộc phải có\njakarta.validation.constraints.Email.message=không phải địa chỉ email hợp lệ\njakarta.validation.constraints.Future.message=phải là thời điểm trong tương lai\njakarta.validation.constraints.Positive.message=phải lớn hơn 0\njakarta.validation.constraints.Max.message=phải nhỏ hơn hoặc bằng {value}\njakarta.validation.constraints.Min.message=phải lớn hơn hoặc bằng {value}\njakarta.validation.constraints.Size.message=độ dài phải từ {min} đến {max}");
const OUT51_MEP = out("$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"a@b\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}'\n{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"a@b\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"note\":null,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}\n[HTTP 201]\n\n$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"\\u200b\\u200b\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}'\n{\"labId\":2,\"studentName\":\"​​\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"note\":null,\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}\n[HTTP 201]\n\n$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"contact\":null}'\n{\"timestamp\":\"2026-11-18T22:39:06.139Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/v2/bookings\"}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/v2/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"Lan\",\"email\":\"lan@fpt.edu.vn\",\"startAt\":\"2030-01-15T08:00:00\",\"equipment\":[\"oscilloscope\"],\"contact\":{\"phone\":\"0901234567\"}}'\n{\"timestamp\":\"2026-11-18T22:39:06.153Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/v2/bookings\"}\n[HTTP 400]");
const OUT51_NICK = out("$ curl -X POST localhost:41870/nick -H 'Content-Type: application/json' -d '{\"nick\":\"Hoàng\"}'\n[]\n[HTTP 200]\n\n$ curl -X POST localhost:41870/nick -H 'Content-Type: application/json' -d '{\"nick\":\"Hoàng\"}'\n[\"length()=6 codePoints=6 ⇒ size must be between 0 and 5\"]\n[HTTP 200]\n\n$ curl -X POST localhost:41870/nick -H 'Content-Type: application/json' -d '{\"nick\":\"🐱🐱🐱\"}'\n[\"length()=6 codePoints=3 ⇒ size must be between 0 and 5\"]\n[HTTP 200]");
const MA51_NOTE = java("@RestController\npublic class NoteController {\n    public record Note(String text) { }\n    public record SafeNote(@Size(max = 500) String text) { }\n\n    // \"dọn\" khoảng trắng cuối bằng đúng biểu thức của sự cố Stack Overflow 2016\n    static String trimEnd(String s) {\n        return s.replaceAll(\"[\\\\s\\\\u200c]+$\", \"\");\n    }\n\n    @PostMapping(\"/notes/raw\")\n    public String raw(@RequestBody Note n) {\n        return \"lưu \" + trimEnd(n.text()).length() + \" ký tự\";\n    }\n\n    @PostMapping(\"/notes/safe\")\n    public String safe(@Valid @RequestBody SafeNote n) {\n        return \"lưu \" + trimEnd(n.text()).length() + \" ký tự\";\n    }\n}");
const OUT51_NOTE = out("$ curl -X POST localhost:41870/notes/raw -d @note-10000.json   # 10000 dấu cách rồi \"x\"\nlưu 10001 ký tự   [HTTP 200, 0.215045 s]\n$ curl -X POST localhost:41870/notes/raw -d @note-20000.json   # 20000 dấu cách rồi \"x\"\nlưu 20001 ký tự   [HTTP 200, 0.849596 s]\n$ curl -X POST localhost:41870/notes/raw -d @note-40000.json   # 40000 dấu cách rồi \"x\"\nlưu 40001 ký tự   [HTTP 200, 3.362979 s]\n$ curl -X POST localhost:41870/notes/safe -d @note-40000.json\n   [HTTP 400, 0.009630 s]");
const OUT51_REDOS = out("$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaa!\"}'\n1 vi phạm, validate mất 5.7 ms\n[HTTP 200]\n\n$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaaaaaa!\"}'\n1 vi phạm, validate mất 0.5 ms\n[HTTP 200]\n\n$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaaaaaaaa!\"}'\n1 vi phạm, validate mất 0.6 ms\n[HTTP 200]\n\n$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaa!\"}'\n1 vi phạm, validate mất 0.4 ms\n[HTTP 200]\n\n$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!\"}'\n1 vi phạm, validate mất 0.3 ms\n[HTTP 200]\n\n$ curl -X POST localhost:41870/name -H 'Content-Type: application/json' -d '{\"name\":\"Nguyen Van An\"}'\n0 vi phạm, validate mất 0.1 ms\n[HTTP 200]");
const MA51_ZOD = js("// So sánh bài 5.1: cùng DTO đặt lịch, validate bằng zod 4 trên Express 5\nimport express from 'express';\nimport { z } from 'zod';\n\nconst Booking = z.object({\n  labId: z.number().int().positive(),\n  studentName: z.string().trim().min(1).max(80),\n  email: z.email(),\n  startAt: z.iso.datetime({ local: true }).refine((s) => new Date(s) > new Date(), 'must be in the future'),\n  minutes: z.number().int().min(30).max(240),\n  note: z.string().max(500).optional(),\n  equipment: z.array(z.string().trim().min(1).max(30)).max(5).optional(),\n  contact: z.object({ phone: z.string().regex(/^0\\d{9}$/, 'phải là số di động 10 chữ số, bắt đầu bằng 0') }),\n});");
const OUT51_NODE = out("$ curl -X POST localhost:41871/bookings -H 'Content-Type: application/json' -d '{\"labId\":-1,\"studentName\":\"   \",\"email\":\"lan-at-fpt\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5000,\"equipment\":[\"\",\"\"],\"contact\":{\"phone\":\"12345\"}}'\n{\"errors\":[{\"path\":\"labId\",\"message\":\"Too small: expected number to be >0\"},{\"path\":\"studentName\",\"message\":\"Too small: expected string to have >=1 characters\"},{\"path\":\"email\",\"message\":\"Invalid email address\"},{\"path\":\"startAt\",\"message\":\"must be in the future\"},{\"path\":\"minutes\",\"message\":\"Too big: expected number to be <=240\"},{\"path\":\"equipment.0\",\"message\":\"Too small: expected string to have >=1 characters\"},{\"path\":\"equipment.1\",\"message\":\"Too small: expected string to have >=1 characters\"},{\"path\":\"contact.phone\",\"message\":\"phải là số di động 10 chữ số, bắt đầu bằng 0\"}]}\n[HTTP 400, 0.022086 s]\n\n$ curl -X POST localhost:41871/bookings -H 'Content-Type: application/json' -d '{\"labId\":2,\"studentName\":\"​\",\"email\":\"a@b\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":90,\"contact\":{\"phone\":\"0901234567\"}}'\n{\"errors\":[{\"path\":\"email\",\"message\":\"Invalid email address\"}]}\n[HTTP 400, 0.002743 s]");
const OUT51_NODE_REDOS = out("$ curl -X POST localhost:41871/name -H 'Content-Type: application/json' -d '{\"name\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaa!\"}'\n$ curl localhost:41871/health\n{\"ok\":false,\"ms\":10848}\n[HTTP 200, 10.851281 s]\n\nok\n[HTTP 200, 10.350984 s]");

const L51_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Jakarta Bean Validation</h2>
<p class="lead">Chapter 4 made the API accept JSON and turn it into records. It also accepted <em>anything</em>: a lab id of -1, a name made of spaces, a booking in 2020 lasting 5 000 minutes — all answered <code>201 Created</code>. This lesson puts a gate in front of every controller: annotations on the DTO (<code>@NotBlank</code>, <code>@Size</code>, <code>@Email</code>, <code>@Future</code>…), one <code>@Valid</code>, and Spring refuses bad input before your code runs. Then we test the edges for real — what <code>@Email</code> accepts, what <code>@NotBlank</code> misses, how <code>@Size</code> counts an emoji — and measure why a length limit is a security control: one 40&nbsp;KB note held a server thread for 3.4&nbsp;seconds.</p>

<h3>In everyday life first</h3>
<p>The registration desk at the Alpha building has a paper form. Before anyone books a lab, the clerk glances at it: name filled in, phone has ten digits, the date is not last year, the duration is at most four hours. That glance takes two seconds and saves the lab manager from a booking nobody can honour. Bean Validation is that glance, written once as annotations on the form (the DTO) and applied automatically at the door (the controller). It is <strong>not</strong> the manager's decision — "is the lab free at 9:00?" needs the database and belongs to the service (lesson 5.3).</p>

<h3>Annotations on the DTO, @Valid on the parameter</h3>
<p>Add <code>spring-boot-starter-validation</code> (it brings Hibernate Validator 9.1.5, the reference implementation of Jakarta Validation 3.1). Then describe the rules where the data is declared:</p>
${MA51_REQ}
${MA51_CTRL}
<div class="kv-grid">
  <div class="kv"><span class="k">@NotNull · @NotEmpty · @NotBlank</span><span class="v">not null · not null and length/size &gt; 0 · not null and contains at least one non-whitespace character. For strings you almost always want <code>@NotBlank</code>.</span></div>
  <div class="kv"><span class="k">@Size(min, max)</span><span class="v">Length of a string, size of a collection/map/array. <code>null</code> is valid — combine with <code>@NotNull</code>/<code>@NotBlank</code> when required.</span></div>
  <div class="kv"><span class="k">@Min @Max @Positive @PositiveOrZero</span><span class="v">Numeric bounds. On a primitive <code>int</code> the "missing" case never reaches validation (see below).</span></div>
  <div class="kv"><span class="k">@Email · @Pattern(regexp)</span><span class="v">Format checks. <code>@Pattern</code> must match the <em>whole</em> string (it uses <code>matches()</code>).</span></div>
  <div class="kv"><span class="k">@Past @Future @PastOrPresent @FutureOrPresent</span><span class="v">Compared with "now" of the server clock and time zone.</span></div>
  <div class="kv"><span class="k">@Valid on a field</span><span class="v">Cascade: also validate the object inside (<code>contact.phone</code>). <code>List&lt;@NotBlank String&gt;</code> validates each element.</span></div>
</div>

<h3>Before and after @Valid</h3>
${OUT51_OK}
${OUT51_V1}
<p>Without <code>@Valid</code> the same garbage is saved happily. With it:</p>
${OUT51_V2}
${OUT51_WARN}
<p>Spring called the validator before <code>createV2</code>; the record never reached your code. The log shows <strong>8 errors</strong>, each with a field path (<code>contact.phone</code>, <code>equipment[0]</code>), the rejected value and a message — but the response body says only "Bad Request". That is Spring Boot's safe default (<code>spring.web.error.include-binding-errors=never</code>): field details are hidden until you decide how to publish them. Lesson 5.2 turns this into a proper <code>application/problem+json</code> with an <code>errors</code> list.</p>
<p>Two different exceptions to remember: a JSON body that fails validation raises <code>MethodArgumentNotValidException</code>; constraints placed directly on method parameters raise <code>HandlerMethodValidationException</code>. Since Spring Framework 6.1 the second one works out of the box — no <code>@Validated</code> on the class needed:</p>
${OUT51_THAMSO}

<h3>Forgetting @Valid on a nested object</h3>
${MA51_NESTED}
${OUT51_LONG}
<p><code>@NotNull Contact contact</code> only says "contact is present". The <code>@NotBlank</code> on <code>phone</code> inside is ignored unless the field also carries <code>@Valid</code> — a silent hole, because the code compiles and the happy path works. Rule of thumb: every field whose type is one of your own records gets <code>@Valid</code>; every collection of records gets <code>List&lt;@Valid Item&gt;</code>.</p>

<h3>Calling the validator yourself, and messages in Vietnamese</h3>
<p>The same engine is a bean you can inject — useful for objects that do not come from a request (a CSV import, a message from a queue):</p>
${MA51_CHECK}
${PROPS51_VI}
${OUT51_CHECK}
<p>Hibernate Validator ships translations for 27 languages but not Vietnamese. Spring Boot lets <code>messages_vi.properties</code> override any built-in message by its key, and picks the language from <code>Accept-Language</code>. One trap measured here: the Vietnamese file was ignored until an (empty) <code>messages.properties</code> existed — Spring Boot only creates its <code>MessageSource</code> when the base bundle is present. A message written directly in the annotation (<code>contact.phone</code>) is used as is in every language.</p>

<h3>Edges you should know before trusting the annotations</h3>
${OUT51_MEP}
<ul>
  <li><strong><code>@Email</code> accepted <code>a@b</code>.</strong> Hibernate Validator follows the RFC loosely: a local part, <code>@</code>, a domain — no dot required. zod 4 rejects the same value (below). Validation says "looks like an email"; only sending a confirmation link proves it is one.</li>
  <li><strong><code>@NotBlank</code> accepted a name of two zero-width spaces (<code>\\u200b\\u200b</code>).</strong> Java's <code>Character.isWhitespace</code> does not count U+200B, so the name is invisible but "not blank". If names appear in a UI or a PDF, normalise and reject invisible characters yourself (5.3 shows how to write such a rule).</li>
  <li><strong><code>contact: null</code> ⇒ 400 from <code>@NotNull</code></strong>, as expected.</li>
  <li><strong>Missing <code>minutes</code> ⇒ 400, but not from validation.</strong> The field is a primitive <code>int</code>; Jackson 3 refuses <code>null</code> for primitives (<code>FAIL_ON_NULL_FOR_PRIMITIVES</code>, lesson 4.3) before the validator runs. Use <code>Integer</code> + <code>@NotNull</code> if you want the error reported per field together with the others.</li>
</ul>
${OUT51_NICK}
<p><code>@Size</code> counts <code>String.length()</code>, i.e. UTF-16 code units. "Hoàng" typed with a precomposed <code>à</code> is 5 units; the same word typed with <code>a</code> + combining grave accent (U+0300, common when text is pasted from macOS) is 6 — rejected by <code>@Size(max = 5)</code> although it looks identical. Three cat emoji are 3 characters to a human, 6 to Java. Set limits generously for human text, and normalise to NFC (<code>java.text.Normalizer</code>) before storing.</p>

<h3>🕵️ Hacker corner — why a length limit is a security control</h3>
<p>A note field with no <code>@Size</code>, and a helper that trims trailing whitespace with a regular expression — the exact expression from a real outage:</p>
${MA51_NOTE}
${OUT51_NOTE}
<p>10 000 spaces: 0.2&nbsp;s. 20 000: 0.85&nbsp;s. 40 000: 3.4&nbsp;s — doubling the input quadruples the time (O(n²)): for every starting position the engine scans the whole run of spaces, then fails on the final <code>x</code>. Each such request holds one of Tomcat's 200 worker threads; a few hundred small requests and the API stops answering. With <code>@Size(max = 500)</code> the same body is refused in 10&nbsp;ms, before the expensive code runs.</p>
<div class="callout warn"><p><strong>Real incident — Stack Overflow, 20 July 2016.</strong> A post containing about 20 000 consecutive whitespace characters made the trimming regex <code>^[\\s\\u200c]+|[\\s\\u200c]+$</code> burn CPU on every home page view; the site was down for 34 minutes. The fix was to replace the regex with a plain substring loop. On 2 July 2019 a single WAF rule with a backtracking regex took Cloudflare's network down worldwide for about 27 minutes.</p>
<p><strong>How to prevent it:</strong> put a <code>@Size</code> on every string and collection that comes from outside; cap the request body size (lesson 4.4); avoid nested quantifiers in <code>@Pattern</code>; and know your engine (next paragraph).</p></div>
${OUT51_REDOS}
<p>The textbook "catastrophic" pattern <code>([A-Za-z]+\\s?)*</code> did <strong>not</strong> hurt Java 21: 30 letters plus <code>!</code> failed in 0.3&nbsp;ms. The JDK caches failed positions inside greedy loops, so the exponential cases you read about mostly disappear. Polynomial ones like the Stack Overflow regex remain (1.35&nbsp;s for 20&nbsp;000 spaces in a bare Java test, 0.18&nbsp;s in Node). Node's engine is the opposite — see the comparison below.</p>

<h3>Compared with Node.js</h3>
<p>The Node.js course validates with zod (lesson 6.3). Same rules, written as a schema object:</p>
${MA51_ZOD}
${OUT51_NODE}
<p>Differences worth saying in an interview: Spring validates <em>after</em> Jackson built a typed object (type errors are a separate 400 from Jackson), zod validates the raw parsed JSON and returns the typed result; zod's error list is in the response by default, Spring hides it until you publish it; zod 4 rejects <code>a@b</code>; both accept the zero-width name. And the regex engine:</p>
${OUT51_NODE_REDOS}
<p>The same pattern that took Java 0.3&nbsp;ms took Node 22 <strong>10.8&nbsp;s</strong> for 28 letters — and because Node has one event loop, <code>/health</code>, sent half a second later, also waited 10.35&nbsp;s. In Java one thread was busy; in Node the whole server was.</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>The front-end validates too — the back-end still must.</strong> Any check in React is a convenience for honest users; curl skips it. Treat the DTO annotations as the contract.</li>
  <li><strong>Code review checklist:</strong> every <code>@RequestBody</code> has <code>@Valid</code>; every nested DTO field has <code>@Valid</code>; every <code>String</code>/<code>List</code> has a <code>@Size</code>; no <code>@Pattern</code> with nested <code>+</code>/<code>*</code>.</li>
  <li><strong>A support ticket "the system accepted a booking in the past"</strong> usually means a missing <code>@Future</code> — or a server in UTC comparing a <code>LocalDateTime</code> typed in Vietnam time (lesson 4.3).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"@NotNull vs @NotEmpty vs @NotBlank?"</strong> — not null; not null and not empty; not null and has a non-whitespace character. Strings: <code>@NotBlank</code>.</li>
  <li><strong>"Why does @Size(max = 10) not reject null?"</strong> — By specification every constraint except the null-checks treats null as valid, so constraints compose; add <code>@NotNull</code> for required.</li>
  <li><strong>"How do you validate a nested object or list elements?"</strong> — <code>@Valid</code> on the field; type-argument constraints <code>List&lt;@Valid Item&gt;</code>, <code>List&lt;@NotBlank String&gt;</code>.</li>
  <li><strong>"What exception does Spring throw when @Valid fails?"</strong> — <code>MethodArgumentNotValidException</code> for a body; <code>HandlerMethodValidationException</code> for constraints on parameters (Spring 6.1+). Both become 400.</li>
  <li><strong>"Is validation a security measure?"</strong> — It is input hygiene and a first line against resource abuse (length limits, ReDoS). It does not replace authorisation, parameterised SQL or output encoding.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a <code>RecurringBooking</code> DTO: <code>labId</code>, <code>weekdays</code> (1–7, at least one, no more than 5), <code>startTime</code> (<code>LocalTime</code>), <code>weeks</code> (1–15), and a list of up to 10 <code>attendees</code>, each with a <code>studentId</code> and an <code>email</code>.</li>
  <li>Expose <code>POST /recurring</code> and make every rule produce a 400 with the field path in the log.</li>
</ol>
<p><strong>Done when:</strong> a body with <code>"weekdays":[0,8]</code> and one attendee with a blank email logs errors for <code>weekdays[0]</code>, <code>weekdays[1]</code> and <code>attendees[0].email</code>.</p></div>
${giai('Show one solution', `${java(`public record RecurringBooking(
        @NotNull @Positive Long labId,
        @NotEmpty @Size(max = 5) List<@NotNull @Min(1) @Max(7) Integer> weekdays,
        @NotNull LocalTime startTime,
        @Min(1) @Max(15) int weeks,
        @Size(max = 10) List<@Valid @NotNull Attendee> attendees) {

    public record Attendee(@NotBlank String studentId, @NotBlank @Email String email) { }
}`)}
<p>Measured: <code>weekdays[0]: must be greater than or equal to 1</code>, <code>weekdays[1]: must be less than or equal to 7</code>, <code>attendees[0].email: must not be blank</code>. Type-argument constraints (<code>List&lt;@Min(1) @Max(7) Integer&gt;</code>) check each element; <code>@Valid</code> on the element type cascades into each attendee.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Jakarta Bean Validation</span><span class="v">The standard (3.1) for declaring constraints with annotations; Hibernate Validator is its reference implementation.</span></div>
  <div class="kv"><span class="k">Constraint</span><span class="v">An annotation such as <code>@NotBlank</code>, checked by a <code>ConstraintValidator</code>.</span></div>
  <div class="kv"><span class="k">@Valid</span><span class="v">Trigger validation of a parameter, or cascade into a nested object.</span></div>
  <div class="kv"><span class="k">ConstraintViolation</span><span class="v">One failure: property path, message, invalid value.</span></div>
  <div class="kv"><span class="k">Method validation</span><span class="v">Constraints on method parameters/return values; built into Spring MVC since 6.1.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Denial of service through a regular expression whose running time explodes on crafted input.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Annotate the DTO, put <code>@Valid</code> on <code>@RequestBody</code> and on nested fields; bad input becomes 400 before your code runs.</li>
  <li>Spring Boot hides field errors in the default body; lesson 5.2 publishes them properly.</li>
  <li>Measured edges: <code>a@b</code> passes <code>@Email</code>, zero-width spaces pass <code>@NotBlank</code>, <code>@Size</code> counts UTF-16 units.</li>
  <li>A length limit turned a 3.4&nbsp;s request into a 10&nbsp;ms 400. Java 21 shrugged off the classic exponential regex; Node 22 blocked its whole event loop for 10.8&nbsp;s.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://jakarta.ee/specifications/bean-validation/3.1/jakarta-validation-spec-3.1', '📜', 'Jakarta Validation 3.1 specification', 'Built-in constraints, cascading, groups, the meaning of null.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html', '🍃', 'Spring MVC — Validation', 'MethodArgumentNotValidException vs HandlerMethodValidationException.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: V51App on Spring Boot 4.1.2, Hibernate Validator 9.1.5.Final, Temurin 21.0.12.1 (container, 4 CPU); Express 5.3.0 + zod 4.6.7 on Node 22 (19/11/2026).</li>
  <li>Stack Exchange, "Outage Postmortem — July 20, 2016" (34 minutes, ~20 000 whitespace characters, regex replaced by a substring function); summaries: <a href="https://adtmag.com/Blogs/Dev-Watch/2016/07/stack-overflow-crash.aspx" target="_blank" rel="noopener">ADTmag</a>, <a href="https://mjtsai.com/blog/2016/07/21/this-regular-expression-has-been-replaced-with-a-substring-function" target="_blank" rel="noopener">Michael Tsai</a>.</li>
  <li>Cloudflare, "Details of the Cloudflare outage on July 2, 2019" (blog.cloudflare.com).</li>
</ul>
</div>
`;

const L51_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Jakarta Bean Validation</h2>
<p class="lead">Chương 4 đã cho API nhận JSON và biến nó thành record. Nhưng API cũng nhận <em>mọi thứ</em>: lab id bằng -1, tên toàn dấu cách, lượt đặt năm 2020 dài 5 000 phút — tất cả đều được trả <code>201 Created</code>. Bài này đặt một cửa kiểm trước mọi controller: annotation trên DTO (<code>@NotBlank</code>, <code>@Size</code>, <code>@Email</code>, <code>@Future</code>…), một chữ <code>@Valid</code>, và Spring từ chối dữ liệu xấu trước khi mã của bạn chạy. Sau đó ta thử thật các mép — <code>@Email</code> nhận gì, <code>@NotBlank</code> bỏ sót gì, <code>@Size</code> đếm emoji ra sao — và đo vì sao giới hạn độ dài là một biện pháp bảo mật: một ghi chú 40&nbsp;KB giữ một luồng server 3,4&nbsp;giây.</p>

<h3>Đời thường trước đã</h3>
<p>Quầy đăng ký ở toà Alpha có tờ phiếu giấy. Trước khi ai đó được đặt lab, nhân viên liếc qua: tên đã điền, số điện thoại đủ mười chữ số, ngày không phải năm ngoái, thời lượng không quá bốn tiếng. Cái liếc ấy mất hai giây và cứu người quản lý lab khỏi một lượt đặt không thể thực hiện. Bean Validation chính là cái liếc đó, viết một lần thành annotation trên phiếu (DTO) và tự áp dụng ở cửa (controller). Nó <strong>không</strong> phải quyết định của người quản lý — "9 giờ lab có trống không?" cần tới CSDL và thuộc về service (bài 5.3).</p>

<h3>Annotation trên DTO, @Valid trên tham số</h3>
<p>Thêm <code>spring-boot-starter-validation</code> (kéo theo Hibernate Validator 9.1.5, bản cài đặt chuẩn của Jakarta Validation 3.1). Rồi mô tả luật ngay chỗ khai báo dữ liệu:</p>
${MA51_REQ}
${MA51_CTRL}
<div class="kv-grid">
  <div class="kv"><span class="k">@NotNull · @NotEmpty · @NotBlank</span><span class="v">khác null · khác null và độ dài/kích thước &gt; 0 · khác null và có ít nhất một ký tự không phải khoảng trắng. Với chuỗi, gần như luôn chọn <code>@NotBlank</code>.</span></div>
  <div class="kv"><span class="k">@Size(min, max)</span><span class="v">Độ dài chuỗi, kích thước collection/map/mảng. <code>null</code> được coi là hợp lệ — ghép với <code>@NotNull</code>/<code>@NotBlank</code> khi bắt buộc.</span></div>
  <div class="kv"><span class="k">@Min @Max @Positive @PositiveOrZero</span><span class="v">Giới hạn số. Với kiểu nguyên thuỷ <code>int</code>, trường hợp "thiếu" không bao giờ tới được bước validate (xem dưới).</span></div>
  <div class="kv"><span class="k">@Email · @Pattern(regexp)</span><span class="v">Kiểm hình dạng. <code>@Pattern</code> phải khớp <em>cả</em> chuỗi (dùng <code>matches()</code>).</span></div>
  <div class="kv"><span class="k">@Past @Future @PastOrPresent @FutureOrPresent</span><span class="v">So với "bây giờ" theo đồng hồ và múi giờ của server.</span></div>
  <div class="kv"><span class="k">@Valid trên một trường</span><span class="v">Lan xuống: validate cả đối tượng bên trong (<code>contact.phone</code>). <code>List&lt;@NotBlank String&gt;</code> kiểm từng phần tử.</span></div>
</div>

<h3>Trước và sau @Valid</h3>
${OUT51_OK}
${OUT51_V1}
<p>Không có <code>@Valid</code>, cùng mớ rác đó được lưu vui vẻ. Có <code>@Valid</code>:</p>
${OUT51_V2}
${OUT51_WARN}
<p>Spring gọi validator trước <code>createV2</code>; record không bao giờ tới mã của bạn. Log ghi <strong>8 lỗi</strong>, mỗi lỗi có đường dẫn trường (<code>contact.phone</code>, <code>equipment[0]</code>), giá trị bị từ chối và thông báo — nhưng body trả về chỉ nói "Bad Request". Đó là mặc định an toàn của Spring Boot (<code>spring.web.error.include-binding-errors=never</code>): chi tiết từng trường bị giấu cho tới khi bạn quyết định công bố nó thế nào. Bài 5.2 biến nó thành <code>application/problem+json</code> đúng chuẩn kèm danh sách <code>errors</code>.</p>
<p>Hai ngoại lệ cần nhớ: body JSON không qua validate ⇒ <code>MethodArgumentNotValidException</code>; ràng buộc đặt thẳng trên tham số hàm ⇒ <code>HandlerMethodValidationException</code>. Từ Spring Framework 6.1, loại thứ hai chạy sẵn — không cần <code>@Validated</code> trên class:</p>
${OUT51_THAMSO}

<h3>Quên @Valid trên đối tượng lồng</h3>
${MA51_NESTED}
${OUT51_LONG}
<p><code>@NotNull Contact contact</code> chỉ nói "có contact". <code>@NotBlank</code> trên <code>phone</code> bên trong bị bỏ qua nếu trường không có thêm <code>@Valid</code> — một lỗ im lặng, vì mã vẫn biên dịch và luồng bình thường vẫn chạy. Quy tắc: trường nào có kiểu là record của bạn thì gắn <code>@Valid</code>; danh sách record thì viết <code>List&lt;@Valid Item&gt;</code>.</p>

<h3>Tự gọi validator, và thông báo tiếng Việt</h3>
<p>Cùng bộ máy đó là một bean tiêm được — hữu ích cho đối tượng không đến từ request (nhập CSV, tin nhắn từ hàng đợi):</p>
${MA51_CHECK}
${PROPS51_VI}
${OUT51_CHECK}
<p>Hibernate Validator có sẵn bản dịch cho 27 ngôn ngữ nhưng không có tiếng Việt. Spring Boot cho <code>messages_vi.properties</code> ghi đè bất kỳ thông báo dựng sẵn nào theo khoá của nó, và chọn ngôn ngữ theo <code>Accept-Language</code>. Một cái bẫy đo được ở đây: tệp tiếng Việt bị bỏ qua cho tới khi có một tệp <code>messages.properties</code> (để trống) — Spring Boot chỉ tạo <code>MessageSource</code> khi có tệp gốc. Thông báo viết thẳng trong annotation (<code>contact.phone</code>) thì dùng nguyên văn ở mọi ngôn ngữ.</p>

<h3>Những mép cần biết trước khi tin annotation</h3>
${OUT51_MEP}
<ul>
  <li><strong><code>@Email</code> nhận <code>a@b</code>.</strong> Hibernate Validator theo RFC một cách rộng rãi: phần tên, <code>@</code>, tên miền — không bắt buộc có dấu chấm. zod 4 từ chối cùng giá trị đó (xem dưới). Validate chỉ nói "trông giống email"; chỉ có gửi liên kết xác nhận mới chứng minh nó là email thật.</li>
  <li><strong><code>@NotBlank</code> nhận một cái tên gồm hai ký tự rộng-bằng-không (<code>\\u200b\\u200b</code>).</strong> <code>Character.isWhitespace</code> của Java không coi U+200B là khoảng trắng, nên cái tên vô hình mà vẫn "không trống". Nếu tên hiện lên giao diện hay PDF, hãy tự chuẩn hoá và chặn ký tự vô hình (bài 5.3 chỉ cách viết luật như vậy).</li>
  <li><strong><code>contact: null</code> ⇒ 400 từ <code>@NotNull</code></strong>, đúng như mong đợi.</li>
  <li><strong>Thiếu <code>minutes</code> ⇒ 400, nhưng không phải từ validate.</strong> Trường là <code>int</code> nguyên thuỷ; Jackson 3 từ chối <code>null</code> cho kiểu nguyên thuỷ (<code>FAIL_ON_NULL_FOR_PRIMITIVES</code>, bài 4.3) trước khi validator chạy. Dùng <code>Integer</code> + <code>@NotNull</code> nếu muốn lỗi được báo theo trường cùng các lỗi khác.</li>
</ul>
${OUT51_NICK}
<p><code>@Size</code> đếm <code>String.length()</code>, tức đơn vị UTF-16. "Hoàng" gõ bằng chữ <code>à</code> dựng sẵn là 5 đơn vị; cùng chữ đó gõ bằng <code>a</code> + dấu huyền tổ hợp (U+0300, hay gặp khi dán chữ từ macOS) là 6 — bị <code>@Size(max = 5)</code> từ chối dù nhìn giống hệt. Ba emoji con mèo là 3 ký tự với người, 6 với Java. Đặt giới hạn rộng rãi cho chữ người gõ, và chuẩn hoá về NFC (<code>java.text.Normalizer</code>) trước khi lưu.</p>

<h3>🕵️ Góc hacker — vì sao giới hạn độ dài là biện pháp bảo mật</h3>
<p>Một trường ghi chú không có <code>@Size</code>, và một hàm phụ cắt khoảng trắng cuối bằng biểu thức chính quy — đúng biểu thức của một sự cố thật:</p>
${MA51_NOTE}
${OUT51_NOTE}
<p>10 000 dấu cách: 0,2&nbsp;s. 20 000: 0,85&nbsp;s. 40 000: 3,4&nbsp;s — gấp đôi đầu vào thì thời gian gấp bốn (O(n²)): với mỗi vị trí bắt đầu, bộ máy quét hết dải dấu cách rồi thất bại ở chữ <code>x</code> cuối. Mỗi request như vậy giữ một trong 200 luồng làm việc của Tomcat; vài trăm request nhỏ là API ngừng trả lời. Có <code>@Size(max = 500)</code>, cùng body đó bị từ chối trong 10&nbsp;ms, trước khi đoạn mã đắt tiền kịp chạy.</p>
<div class="callout warn"><p><strong>Sự cố thật — Stack Overflow, 20/07/2016.</strong> Một bài viết chứa khoảng 20 000 ký tự khoảng trắng liên tiếp làm biểu thức cắt khoảng trắng <code>^[\\s\\u200c]+|[\\s\\u200c]+$</code> ngốn CPU ở mỗi lượt xem trang chủ; trang sập 34 phút. Cách sửa là thay biểu thức chính quy bằng một vòng lặp cắt chuỗi thường. Ngày 02/07/2019, một luật WAF có biểu thức quay lui đã làm mạng Cloudflare sập toàn cầu khoảng 27 phút.</p>
<p><strong>Cách phòng:</strong> đặt <code>@Size</code> cho mọi chuỗi và collection đến từ bên ngoài; giới hạn kích thước body (bài 4.4); tránh lượng từ lồng nhau trong <code>@Pattern</code>; và hiểu bộ máy của mình (đoạn kế).</p></div>
${OUT51_REDOS}
<p>Mẫu "thảm hoạ" kinh điển <code>([A-Za-z]+\\s?)*</code> <strong>không</strong> làm khó Java 21: 30 chữ cái cộng <code>!</code> thất bại trong 0,3&nbsp;ms. JDK ghi nhớ các vị trí đã thất bại trong vòng lặp tham lam, nên các ca bùng nổ hàm mũ trong sách phần lớn biến mất. Ca đa thức như biểu thức của Stack Overflow thì vẫn còn (1,35&nbsp;s cho 20&nbsp;000 dấu cách trong một phép thử Java trần, 0,18&nbsp;s trên Node). Bộ máy của Node thì ngược lại — xem phần so sánh dưới.</p>

<h3>So với Node.js</h3>
<p>Khoá Node.js validate bằng zod (bài 6.3). Cùng các luật, viết thành một đối tượng schema:</p>
${MA51_ZOD}
${OUT51_NODE}
<p>Khác biệt đáng nói khi phỏng vấn: Spring validate <em>sau</em> khi Jackson dựng xong đối tượng có kiểu (sai kiểu là một lỗi 400 riêng của Jackson), zod validate JSON thô vừa parse rồi trả kết quả có kiểu; danh sách lỗi của zod nằm sẵn trong response, Spring giấu cho tới khi bạn công bố; zod 4 từ chối <code>a@b</code>; cả hai đều nhận cái tên rộng-bằng-không. Và bộ máy biểu thức chính quy:</p>
${OUT51_NODE_REDOS}
<p>Cùng mẫu mà Java mất 0,3&nbsp;ms thì Node 22 mất <strong>10,8&nbsp;s</strong> với 28 chữ cái — và vì Node chỉ có một event loop, <code>/health</code> gửi sau nửa giây cũng phải chờ 10,35&nbsp;s. Ở Java, một luồng bận; ở Node, cả server bận.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Frontend cũng validate — backend vẫn phải validate.</strong> Mọi phép kiểm ở React chỉ là tiện cho người dùng tử tế; curl bỏ qua nó. Hãy coi annotation trên DTO là hợp đồng.</li>
  <li><strong>Danh sách review mã:</strong> mọi <code>@RequestBody</code> có <code>@Valid</code>; mọi trường DTO lồng có <code>@Valid</code>; mọi <code>String</code>/<code>List</code> có <code>@Size</code>; không có <code>@Pattern</code> với <code>+</code>/<code>*</code> lồng nhau.</li>
  <li><strong>Phiếu hỗ trợ "hệ thống nhận lượt đặt trong quá khứ"</strong> thường là thiếu <code>@Future</code> — hoặc server chạy UTC đang so một <code>LocalDateTime</code> gõ theo giờ Việt Nam (bài 4.3).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@NotNull khác @NotEmpty khác @NotBlank thế nào?"</strong> — khác null; khác null và không rỗng; khác null và có ký tự không phải khoảng trắng. Với chuỗi: <code>@NotBlank</code>.</li>
  <li><strong>"Vì sao @Size(max = 10) không từ chối null?"</strong> — Theo đặc tả, mọi ràng buộc trừ nhóm kiểm null đều coi null là hợp lệ để ghép được với nhau; bắt buộc thì thêm <code>@NotNull</code>.</li>
  <li><strong>"Validate đối tượng lồng hoặc phần tử danh sách thế nào?"</strong> — <code>@Valid</code> trên trường; ràng buộc trên tham số kiểu <code>List&lt;@Valid Item&gt;</code>, <code>List&lt;@NotBlank String&gt;</code>.</li>
  <li><strong>"@Valid thất bại thì Spring ném ngoại lệ gì?"</strong> — <code>MethodArgumentNotValidException</code> với body; <code>HandlerMethodValidationException</code> với ràng buộc trên tham số (Spring 6.1+). Cả hai thành 400.</li>
  <li><strong>"Validate có phải biện pháp bảo mật không?"</strong> — Là vệ sinh đầu vào và lớp chặn đầu tiên trước việc lạm dụng tài nguyên (giới hạn độ dài, ReDoS). Nó không thay được phân quyền, SQL tham số hoá hay mã hoá đầu ra.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm DTO <code>RecurringBooking</code>: <code>labId</code>, <code>weekdays</code> (1–7, ít nhất một, không quá 5), <code>startTime</code> (<code>LocalTime</code>), <code>weeks</code> (1–15), và danh sách tối đa 10 <code>attendees</code>, mỗi người có <code>studentId</code> và <code>email</code>.</li>
  <li>Mở <code>POST /recurring</code> và làm cho mọi luật sinh ra 400 kèm đường dẫn trường trong log.</li>
</ol>
<p><strong>Đạt khi:</strong> body có <code>"weekdays":[0,8]</code> và một người tham dự để trống email thì log ghi lỗi cho <code>weekdays[0]</code>, <code>weekdays[1]</code> và <code>attendees[0].email</code>.</p></div>
${giai('Xem một lời giải', `${java(`public record RecurringBooking(
        @NotNull @Positive Long labId,
        @NotEmpty @Size(max = 5) List<@NotNull @Min(1) @Max(7) Integer> weekdays,
        @NotNull LocalTime startTime,
        @Min(1) @Max(15) int weeks,
        @Size(max = 10) List<@Valid @NotNull Attendee> attendees) {

    public record Attendee(@NotBlank String studentId, @NotBlank @Email String email) { }
}`)}
<p>Đo thật: <code>weekdays[0]: must be greater than or equal to 1</code>, <code>weekdays[1]: must be less than or equal to 7</code>, <code>attendees[0].email: must not be blank</code>. Ràng buộc trên tham số kiểu (<code>List&lt;@Min(1) @Max(7) Integer&gt;</code>) kiểm từng phần tử; <code>@Valid</code> trên kiểu phần tử lan xuống từng người tham dự.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Jakarta Bean Validation</span><span class="v">Chuẩn (3.1) khai báo ràng buộc bằng annotation; Hibernate Validator là bản cài đặt chuẩn.</span></div>
  <div class="kv"><span class="k">Ràng buộc (constraint)</span><span class="v">Annotation như <code>@NotBlank</code>, được một <code>ConstraintValidator</code> kiểm.</span></div>
  <div class="kv"><span class="k">@Valid</span><span class="v">Kích hoạt validate một tham số, hoặc lan xuống đối tượng lồng.</span></div>
  <div class="kv"><span class="k">ConstraintViolation</span><span class="v">Một vi phạm: đường dẫn thuộc tính, thông báo, giá trị không hợp lệ.</span></div>
  <div class="kv"><span class="k">Method validation</span><span class="v">Ràng buộc trên tham số/giá trị trả về của hàm; có sẵn trong Spring MVC từ 6.1.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Từ chối dịch vụ bằng biểu thức chính quy có thời gian chạy bùng nổ với đầu vào được chế tạo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Gắn annotation lên DTO, đặt <code>@Valid</code> trên <code>@RequestBody</code> và trên trường lồng; dữ liệu xấu thành 400 trước khi mã của bạn chạy.</li>
  <li>Spring Boot giấu lỗi từng trường trong body mặc định; bài 5.2 công bố chúng đúng cách.</li>
  <li>Các mép đo thật: <code>a@b</code> qua <code>@Email</code>, ký tự rộng-bằng-không qua <code>@NotBlank</code>, <code>@Size</code> đếm đơn vị UTF-16.</li>
  <li>Giới hạn độ dài biến request 3,4&nbsp;s thành một 400 trong 10&nbsp;ms. Java 21 chịu được biểu thức hàm mũ kinh điển; Node 22 khoá cả event loop 10,8&nbsp;s.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://jakarta.ee/specifications/bean-validation/3.1/jakarta-validation-spec-3.1', '📜', 'Đặc tả Jakarta Validation 3.1', 'Ràng buộc dựng sẵn, lan xuống, group, ý nghĩa của null.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html', '🍃', 'Spring MVC — Validation', 'MethodArgumentNotValidException và HandlerMethodValidationException.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: V51App trên Spring Boot 4.1.2, Hibernate Validator 9.1.5.Final, Temurin 21.0.12.1 (container 4 CPU); Express 5.3.0 + zod 4.6.7 trên Node 22 (19/11/2026).</li>
  <li>Stack Exchange, "Outage Postmortem — July 20, 2016" (34 phút, khoảng 20 000 ký tự khoảng trắng, biểu thức được thay bằng hàm cắt chuỗi); tóm tắt: <a href="https://adtmag.com/Blogs/Dev-Watch/2016/07/stack-overflow-crash.aspx" target="_blank" rel="noopener">ADTmag</a>, <a href="https://mjtsai.com/blog/2016/07/21/this-regular-expression-has-been-replaced-with-a-substring-function" target="_blank" rel="noopener">Michael Tsai</a>.</li>
  <li>Cloudflare, "Details of the Cloudflare outage on July 2, 2019" (blog.cloudflare.com).</li>
</ul>
</div>
`;

// ===== Bài 5.2 =====
const OUT52_MACDINH = out("$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"IOT-01\",\"name\":\"Lab IoT 2\"}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:07.925Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":99,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":60}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.008Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/bookings\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5}'\nHTTP/1.1 400 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.044Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T09:00:00\",\"minutes\":60}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.067Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/bookings\"}\n\n$ curl -i localhost:41870/labs/99\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.092Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs/99\"}\n\n$ curl -i -X DELETE localhost:41870/labs/1\nHTTP/1.1 405 \nAllow: GET\nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.114Z\",\"status\":405,\"error\":\"Method Not Allowed\",\"path\":\"/labs/1\"}\n\n$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.130Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/labs\"}\n\n$ curl -i localhost:41870/khong-co\nHTTP/1.1 404 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:47:08.148Z\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/khong-co\"}");
const OUT52_LO = out("$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"IOT-01\",\"name\":\"Lab IoT 2\"}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:52:36.312Z\",\"status\":500,\"error\":\"Internal Server Error\",\n \"message\":\"PreparedStatementCallback; SQL [INSERT INTO labs(code, name) VALUES (?, ?) RETURNING id]; ERROR: duplicate key value violates unique constraint \\\"labs_code_key\\\"\\n  Detail: Key (code)=(IOT-01) already exists.\",\n \"trace\":\"org.springframework.dao.DuplicateKeyException: PreparedStatementCallback; SQL [INSERT INTO labs(code, name) VALUES (?, ?) RETURNING id]; ERROR: duplicate key value violates unique constraint \"labs_code_key\"\\n  Detail: Key (code)=(IOT-01) already exists.\\n\\tat org.springframework.jdbc.support.SQLStateSQLExceptionTranslator.doTranslate(SQLStateSQLExceptionTranslator.java:138)\\n\\tat org.springframework.jdbc.support.AbstractFallbackSQLExceptionTranslator.translate(AbstractFallbackSQLExceptionTranslator.java:102)\\n… (cả trace 6495 ký tự, 71 dòng)\",\n \"path\":\"/labs\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":99,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":60}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:52:36.421Z\",\"status\":500,\"error\":\"Internal Server Error\",\n \"message\":\"Lab 99 không tồn tại\",\n \"trace\":\"com.cuongthai.c5.v52.LabNotFoundException: Lab 99 không tồn tại\\n\\tat com.cuongthai.c5.v52.LabController.book(LabController.java:42)\\n\\tat java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)\\n\\tat java.base/java.lang.reflect.Method.invoke(Method.java:580)\\n… (cả trace 4160 ký tự, 46 dòng)\",\n \"path\":\"/bookings\"}");
const OUT52_PD = out("$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"IOT-01\",\"name\":\"Lab IoT 2\"}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:54:09.455Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":99,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":60}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:54:09.551Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/bookings\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5}'\nHTTP/1.1 400 \nContent-Type: application/problem+json\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T09:00:00\",\"minutes\":60}'\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:54:09.622Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/bookings\"}\n\n$ curl -i localhost:41870/labs/99\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:54:09.658Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs/99\"}\n\n$ curl -i -X DELETE localhost:41870/labs/1\nHTTP/1.1 405 \nAllow: GET\nContent-Type: application/problem+json\n{\"detail\":\"Method 'DELETE' is not supported.\",\"instance\":\"/labs/1\",\"status\":405,\"title\":\"Method Not Allowed\"}\n\n$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 \nContent-Type: application/problem+json\n{\"detail\":\"Failed to read request\",\"instance\":\"/labs\",\"status\":400,\"title\":\"Bad Request\"}\n\n$ curl -i localhost:41870/khong-co\nHTTP/1.1 404 \nContent-Type: application/problem+json\n{\"detail\":\"No static resource khong-co.\",\"instance\":\"/khong-co\",\"status\":404,\"title\":\"Not Found\"}\n\n$ curl -i localhost:41870/labs/stats\nHTTP/1.1 500 \nContent-Type: application/json\n{\"timestamp\":\"2026-11-18T22:54:09.728Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs/stats\"}\n\n$ curl -i localhost:41870/labs/2/archive\nHTTP/1.1 410 \nContent-Type: application/problem+json\n{\"detail\":\"Lab 2 đã ngừng nhận đặt lịch\",\"instance\":\"/labs/2/archive\",\"status\":410,\"title\":\"Gone\"}");
const MA52_EX = java("// Ngoại lệ nghiệp vụ: không biết gì về HTTP\npublic class LabNotFoundException extends RuntimeException {\n    private final long labId;\n\n    public LabNotFoundException(long labId) {\n        super(\"Lab \" + labId + \" không tồn tại\");\n        this.labId = labId;\n    }\n\n    public long labId() {\n        return labId;\n    }\n}");
const MA52_ADVICE = java("@RestControllerAdvice\n@ConditionalOnProperty(\"c52.advice\")\npublic class GlobalErrors extends ResponseEntityExceptionHandler {\n    record FieldProblem(String field, String message) { }\n\n    private static final Logger log = LoggerFactory.getLogger(GlobalErrors.class);\n    private static final String BASE = \"https://labflow.cuongthai.com/problems/\";\n\n    // 400 validate: thêm danh sách lỗi từng trường (không trả lại giá trị bị từ chối)\n    @Override\n    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,\n                                                                  HttpStatusCode status, WebRequest request) {\n        // lấy body chuẩn rồi dịch title/detail theo Accept-Language (khoá problemDetail.* trong messages_vi.properties)\n        ProblemDetail pd = ex.updateAndGetBody(getMessageSource(), LocaleContextHolder.getLocale());\n        pd.setType(URI.create(BASE + \"validation\"));\n        List<FieldProblem> errors = ex.getBindingResult().getFieldErrors().stream()\n                .map(fe -> new FieldProblem(fe.getField(), fe.getDefaultMessage()))\n                .sorted(java.util.Comparator.comparing(FieldProblem::field))\n                .toList();\n        pd.setProperty(\"errors\", errors);\n        return handleExceptionInternal(ex, pd, headers, status, request);\n    }\n\n    @ExceptionHandler(LabNotFoundException.class)\n    ProblemDetail labNotFound(LabNotFoundException ex) {\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n        pd.setType(URI.create(BASE + \"lab-not-found\"));\n        pd.setTitle(\"Lab không tồn tại\");\n        pd.setProperty(\"labId\", ex.labId());\n        return pd;\n    }\n\n    @ExceptionHandler(BookingConflictException.class)\n    ProblemDetail conflict(BookingConflictException ex) {\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());\n        pd.setType(URI.create(BASE + \"booking-conflict\"));\n        pd.setTitle(\"Trùng lịch\");\n        pd.setProperty(\"conflictingBookingId\", ex.conflictingBookingId());\n        return pd;\n    }\n\n    @ExceptionHandler(DuplicateKeyException.class)\n    ProblemDetail duplicate(DuplicateKeyException ex) {\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, \"Mã lab đã tồn tại\");\n        pd.setType(URI.create(BASE + \"duplicate\"));\n        pd.setTitle(\"Trùng dữ liệu\");\n        return pd;   // KHÔNG đưa ex.getMessage(): trong đó có câu SQL và tên ràng buộc\n    }\n\n    @ExceptionHandler(EmptyResultDataAccessException.class)\n    ProblemDetail notFound(EmptyResultDataAccessException ex) {\n        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, \"Không tìm thấy\");\n    }\n\n    // Lưới cuối: lỗi không lường trước ⇒ 500 chung chung + mã lỗi để tra log\n    @ExceptionHandler(Exception.class)\n    ProblemDetail unexpected(Exception ex) {\n        String errorId = UUID.randomUUID().toString().substring(0, 8);\n        log.error(\"errorId={} lỗi không lường trước\", errorId, ex);\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,\n                \"Có lỗi phía máy chủ. Gửi mã lỗi này cho bộ phận hỗ trợ.\");\n        pd.setType(URI.create(BASE + \"internal\"));\n        pd.setProperty(\"errorId\", errorId);\n        return pd;\n    }\n}");
const OUT52_ADVICE = out("$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"IOT-01\",\"name\":\"Lab IoT 2\"}'\nHTTP/1.1 409 \nContent-Type: application/problem+json\n{\"detail\":\"Mã lab đã tồn tại\",\"instance\":\"/labs\",\"status\":409,\"title\":\"Trùng dữ liệu\",\"type\":\"https://labflow.cuongthai.com/problems/duplicate\"}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":99,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T08:00:00\",\"minutes\":60}'\nHTTP/1.1 404 \nContent-Type: application/problem+json\n{\"detail\":\"Lab 99 không tồn tại\",\"instance\":\"/bookings\",\"status\":404,\"title\":\"Lab không tồn tại\",\"type\":\"https://labflow.cuongthai.com/problems/lab-not-found\",\"labId\":99}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5}'\nHTTP/1.1 400 \nContent-Type: application/problem+json\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"type\":\"https://labflow.cuongthai.com/problems/validation\",\"errors\":[{\"field\":\"minutes\",\"message\":\"must be greater than or equal to 30\"},{\"field\":\"startAt\",\"message\":\"must be a future date\"},{\"field\":\"studentName\",\"message\":\"must not be blank\"}]}\n\n$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentName\":\"Lan\",\"startAt\":\"2030-01-15T09:00:00\",\"minutes\":60}'\nHTTP/1.1 409 \nContent-Type: application/problem+json\n{\"detail\":\"Trùng giờ với lượt đặt 1\",\"instance\":\"/bookings\",\"status\":409,\"title\":\"Trùng lịch\",\"type\":\"https://labflow.cuongthai.com/problems/booking-conflict\",\"conflictingBookingId\":1}\n\n$ curl -i localhost:41870/labs/99\nHTTP/1.1 404 \nContent-Type: application/problem+json\n{\"detail\":\"Không tìm thấy\",\"instance\":\"/labs/99\",\"status\":404,\"title\":\"Not Found\"}\n\n$ curl -i -X DELETE localhost:41870/labs/1\nHTTP/1.1 405 \nAllow: GET\nContent-Type: application/problem+json\n{\"detail\":\"Method 'DELETE' is not supported.\",\"instance\":\"/labs/1\",\"status\":405,\"title\":\"Method Not Allowed\"}\n\n$ curl -i -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 \nContent-Type: application/problem+json\n{\"detail\":\"Failed to read request\",\"instance\":\"/labs\",\"status\":400,\"title\":\"Bad Request\"}\n\n$ curl -i localhost:41870/khong-co\nHTTP/1.1 404 \nContent-Type: application/problem+json\n{\"detail\":\"No static resource khong-co.\",\"instance\":\"/khong-co\",\"status\":404,\"title\":\"Not Found\"}\n\n$ curl -i localhost:41870/labs/stats\nHTTP/1.1 500 \nContent-Type: application/problem+json\n{\"detail\":\"Có lỗi phía máy chủ. Gửi mã lỗi này cho bộ phận hỗ trợ.\",\"instance\":\"/labs/stats\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.cuongthai.com/problems/internal\",\"errorId\":\"781404e3\"}\n\n$ curl -i localhost:41870/labs/2/archive\nHTTP/1.1 410 \nContent-Type: application/problem+json\n{\"detail\":\"Lab 2 đã ngừng nhận đặt lịch\",\"instance\":\"/labs/2/archive\",\"status\":410,\"title\":\"Gone\"}");
const PROPS52_VI = props("problemDetail.title.org.springframework.web.bind.MethodArgumentNotValidException=Dữ liệu không hợp lệ\nproblemDetail.org.springframework.web.bind.MethodArgumentNotValidException=Dữ liệu gửi lên có lỗi ở các trường trong errors.");
const OUT52_VI = out("$ curl -i -X POST localhost:41870/bookings -H 'Content-Type: application/json' -H 'Accept-Language: vi' -d '{\"labId\":1,\"studentName\":\"\",\"startAt\":\"2020-01-15T08:00:00\",\"minutes\":5}'\nHTTP/1.1 400 \nContent-Type: application/problem+json\n{\"detail\":\"Dữ liệu gửi lên có lỗi ở các trường trong errors.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Dữ liệu không hợp lệ\",\"type\":\"https://labflow.cuongthai.com/problems/validation\",\"errors\":[{\"field\":\"minutes\",\"message\":\"phải lớn hơn hoặc bằng 30\"},{\"field\":\"startAt\",\"message\":\"phải là thời điểm trong tương lai\"},{\"field\":\"studentName\",\"message\":\"không được để trống\"}]}");
const OUT52_LOG = out("ERROR 1 --- [nio-8080-exec-4] com.cuongthai.c5.v52.GlobalErrors        : errorId=781404e3 lỗi không lường trước\n\norg.springframework.jdbc.BadSqlGrammarException: PreparedStatementCallback; bad SQL grammar [SELECT count(*) AS n, max(minutes) AS longest FROM bookings WHERE stauts = 'ACTIVE']\n\tat … (trace đầy đủ chỉ nằm trong log)");
const MA52_EXPRESS = js("// So sánh bài 5.2: lỗi trong Express 5 — mặc định vs middleware lỗi trả application/problem+json\nimport express from 'express';\nclass LabNotFound extends Error { constructor(id) { super(`Lab ${id} không tồn tại`); this.labId = id; } }\n\nconst app = express();\napp.use(express.json());\napp.get('/labs/:id', async (req, res) => {           // Express 5: lỗi trong hàm async tự chuyển tới middleware lỗi\n  if (req.params.id === '99') throw new LabNotFound(99);\n  if (req.params.id === 'stats') throw new Error('column \"stauts\" does not exist');\n  res.json({ id: Number(req.params.id) });\n});\nif (process.env.PROBLEM) {\n  app.use((err, req, res, next) => {                  // middleware lỗi: đúng 4 tham số\n    const pd = err instanceof LabNotFound\n      ? { type: 'https://labflow.cuongthai.com/problems/lab-not-found', title: 'Lab không tồn tại', status: 404, detail: err.message, labId: err.labId }\n      : err.type === 'entity.parse.failed'\n        ? { title: 'Bad Request', status: 400, detail: 'Failed to read request' }\n        : { title: 'Internal Server Error', status: 500, detail: 'Có lỗi phía máy chủ.' };\n    if (pd.status === 500) console.error(err);\n    res.status(pd.status).type('application/problem+json').json({ ...pd, instance: req.originalUrl });\n  });\n}\napp.listen(3000);");
const OUT52_NODE_DEV = out("$ curl -i localhost:41871/labs/99\nHTTP/1.1 500 Internal Server Error\nContent-Type: text/html; charset=utf-8\n<pre>Error: Lab 99 không tồn tại<br> &nbsp; &nbsp;at file:///w/err.mjs:8:37<br> &nbsp; &nbsp;at Layer.handleRequest (/w/node_modules/router/lib/layer.js:169:33)<br> &nbsp; &nbsp;at next (/w/node_\n\n$ curl -i localhost:41871/labs/stats\nHTTP/1.1 500 Internal Server Error\nContent-Type: text/html; charset=utf-8\n<pre>Error: column &quot;stauts&quot; does not exist<br> &nbsp; &nbsp;at file:///w/err.mjs:9:40<br> &nbsp; &nbsp;at Layer.handleRequest (/w/node_modules/router/lib/layer.js:169:33)<br> &nbsp; &nbsp;at\n\n$ curl -i -X POST localhost:41871/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 Bad Request\nContent-Type: text/html; charset=utf-8\n<pre>SyntaxError: Expected &#39;,&#39; or &#39;}&#39; after property value in JSON at position 11 (line 1 column 12)<br> &nbsp; &nbsp;at JSON.parse (&lt;anonymous&gt;)<br> &nbsp; &nbsp;at parse (/w/no");
const OUT52_NODE_PROD = out("$ curl -i localhost:41871/labs/99\nHTTP/1.1 500 Internal Server Error\nContent-Type: text/html; charset=utf-8\n<pre>Internal Server Error</pre>\n\n$ curl -i localhost:41871/labs/stats\nHTTP/1.1 500 Internal Server Error\nContent-Type: text/html; charset=utf-8\n<pre>Internal Server Error</pre>\n\n$ curl -i -X POST localhost:41871/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 Bad Request\nContent-Type: text/html; charset=utf-8\n<pre>Bad Request</pre>");
const OUT52_NODE_PROBLEM = out("$ curl -i localhost:41871/labs/99\nHTTP/1.1 404 Not Found\nContent-Type: application/problem+json; charset=utf-8\n{\"type\":\"https://labflow.cuongthai.com/problems/lab-not-found\",\"title\":\"Lab không tồn tại\",\"status\":404,\"detail\":\"Lab 99 không tồn tại\",\"labId\":99,\"instance\":\"/labs/99\"}\n\n$ curl -i localhost:41871/labs/stats\nHTTP/1.1 500 Internal Server Error\nContent-Type: application/problem+json; charset=utf-8\n{\"title\":\"Internal Server Error\",\"status\":500,\"detail\":\"Có lỗi phía máy chủ.\",\"instance\":\"/labs/stats\"}\n\n$ curl -i -X POST localhost:41871/labs -H 'Content-Type: application/json' -d '{\"code\":\"X\"'\nHTTP/1.1 400 Bad Request\nContent-Type: application/problem+json; charset=utf-8\n{\"title\":\"Bad Request\",\"status\":400,\"detail\":\"Failed to read request\",\"instance\":\"/labs\"}");

const L52_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Centralized error handling with ProblemDetail</h2>
<p class="lead">An API is judged by its errors as much as by its answers. A mobile app needs to know <em>which field</em> to underline, a front-end needs a stable code to switch on, the support team needs an id to find the log line — and an attacker should learn nothing. We take one LabFlow controller through four stages, all measured on the same requests: Spring Boot's default (a "lab not found" becomes 500), the "just show me the error" setting that leaks SQL and a 71-line stack trace, built-in <strong>RFC 9457 Problem Details</strong> (<code>application/problem+json</code>), and finally our own <code>@RestControllerAdvice</code> with field errors, business codes, Vietnamese messages and an <code>errorId</code> for the unexpected.</p>

<h3>In everyday life first</h3>
<p>You hand a form to the Alpha building's registration desk and it comes back. A bad desk just says "rejected". A worse one hands you the internal memo about why — names, room numbers, the manager's notes. A good desk returns a printed slip with the same layout every time: what kind of problem (a code you can look up), a one-line explanation, which boxes to fix, and a reference number in case you call. <strong>ProblemDetail</strong> is that slip: the same JSON shape for every error, defined by an internet standard (RFC 9457, which replaced RFC 7807 in 2023).</p>

<h3>Stage 1 — Spring Boot's default</h3>
<p>The controller from <code>v52</code> creates labs and bookings with <code>JdbcClient</code> and throws two business exceptions:</p>
${MA52_EX}
${OUT52_MACDINH}
<p>The default is safe but useless: every business problem — duplicate code, unknown lab, time clash, missing row — is a <strong>500</strong>, which tells the client "the server is broken, retry later" and wakes up the on-call engineer. The body (<code>timestamp</code>, <code>status</code>, <code>error</code>, <code>path</code>) is produced by Spring Boot's <code>/error</code> endpoint (<code>BasicErrorController</code>) and has no room for "which field".</p>

<h3>Stage 2 — "just show me the error" (and what it leaks)</h3>
<p>A common reflex during development is to turn on message and stack trace. In Spring Boot 4 the keys moved to <code>spring.web.error.*</code> — the old <code>server.error.include-*</code> keys are ignored silently (we tried them first: no change at all).</p>
${bash(`java … --spring.web.error.include-message=always --spring.web.error.include-stacktrace=always --spring.web.error.include-binding-errors=always`)}
${OUT52_LO}
<p>One duplicate code and the response tells a stranger: the exact SQL statement, the table and column names, the constraint name <code>labs_code_key</code>, the value that already exists, the database (PostgreSQL wording), the data-access library and our package names — 6 495 characters of stack trace. The "lab not found" response reveals the source file and line. This is <strong>information disclosure</strong> (OWASP API Security Top 10: security misconfiguration). It never belongs outside a developer's machine.</p>

<h3>Stage 3 — RFC 9457 with one property</h3>
${props(`spring.mvc.problemdetails.enabled=true`)}
${OUT52_PD}
<p>Every exception that Spring MVC itself raises (405, 415, 400 for a broken body, 400 for validation, 404 for an unknown path) now answers with <code>Content-Type: application/problem+json</code> and the standard members:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">type</span><span class="v">A URI that identifies the <em>kind</em> of problem; the client switches on it. Default <code>about:blank</code> (omitted) means "just the status".</span></div>
  <div class="kv"><span class="k">title</span><span class="v">Short human summary of the type; should not change between occurrences.</span></div>
  <div class="kv"><span class="k">status</span><span class="v">The HTTP status, repeated in the body (proxies sometimes rewrite the real one).</span></div>
  <div class="kv"><span class="k">detail</span><span class="v">Explanation of <em>this</em> occurrence, for a human.</span></div>
  <div class="kv"><span class="k">instance</span><span class="v">URI of this occurrence — Spring puts the request path.</span></div>
  <div class="kv"><span class="k">extensions</span><span class="v">Any extra members you add (<code>errors</code>, <code>labId</code>, <code>errorId</code>…).</span></div>
</div>
<p>Notice what did <em>not</em> change: our own exceptions and the SQL error are still plain 500s. The property covers Spring's exceptions only; your domain needs a handler.</p>

<h3>Stage 4 — one @RestControllerAdvice for the whole API</h3>
${MA52_ADVICE}
<ul>
  <li><strong>Extend <code>ResponseEntityExceptionHandler</code></strong>: it already maps about twenty Spring MVC exceptions to the right status as ProblemDetail. You override only what you want to enrich (here, validation). Lab 5 shows what happens if you skip it.</li>
  <li><strong>Business exceptions stay HTTP-free</strong> (<code>LabNotFoundException</code> knows nothing about 404); the advice is the single place that translates them. A service can be reused from a scheduled job or a queue listener.</li>
  <li><strong><code>DuplicateKeyException</code> ⇒ 409 with our own detail</strong> — never <code>ex.getMessage()</code>, which contains the SQL.</li>
  <li><strong>The last net, <code>@ExceptionHandler(Exception.class)</code></strong>: logs the full exception with a short random <code>errorId</code> and returns only that id.</li>
  <li><strong>Field errors without rejected values</strong>: echoing a rejected password, or a <code>&lt;script&gt;</code> the front-end might render, is a leak or an XSS vector.</li>
</ul>
${OUT52_ADVICE}
${OUT52_LOG}
<p>The eight requests plus two new ones (a typo in a report query, an archived lab): 409 for a duplicate code, 404 with <code>labId</code> for an unknown lab, 400 with three field errors, 409 with <code>conflictingBookingId</code> (the app can offer "show the existing booking"), 404, 405 and 400 untouched from Spring, 410 from a <code>ResponseStatusException</code> (Spring turns it into ProblemDetail too), and a 500 whose only secret is <code>781404e3</code> — the same id that heads the full stack trace in the server log. Support asks the user for the id; the developer greps the log.</p>

<h3>Messages in the user's language</h3>
${PROPS52_VI}
${OUT52_VI}
<p><code>ResponseEntityExceptionHandler</code> looks up <code>problemDetail.title.&lt;exception class&gt;</code> and <code>problemDetail.&lt;exception class&gt;</code> in the <code>MessageSource</code>; field messages come from lesson 5.1's <code>messages_vi.properties</code>. The <code>type</code> URIs and field names stay in English — they are for programs.</p>

<h3>🕵️ Hacker corner — error paths are attack surface</h3>
<p>Error messages are written in a hurry and tested least, yet they process the most hostile input. Two families of bugs come from that:</p>
<ol>
  <li><strong>Leaking</strong> — the stage-2 output above. SQL and constraint names tell an injection attacker the schema; library names and lines tell them which CVEs to try; different messages for "no such user" and "wrong password" let them enumerate accounts (Chapter 9).</li>
  <li><strong>Executing</strong> — an error handler that feeds user input into an interpreter.</li>
</ol>
<div class="callout warn"><p><strong>Real incident — Equifax, 2017 (CVE-2017-5638).</strong> In Apache Struts 2's Jakarta multipart parser, an invalid <code>Content-Type</code> header produced an error message that was then evaluated as an OGNL expression. Attackers put OGNL in the header and ran commands on the server. Equifax had not applied the March 2017 patch; from May to July 2017 attackers took personal data of about 147 million people. Lesson 5.3 shows the same bug shape in Bean Validation (Netflix Conductor, 2020).</p>
<p><strong>How to prevent it:</strong> one central handler; fixed, human-written <code>detail</code> texts; never <code>ex.getMessage()</code> from a library in a response; never evaluate a message that contains user input; <code>include-stacktrace</code> and friends only in a local profile; patch frameworks quickly.</p></div>

<h3>Compared with Node.js</h3>
${MA52_EXPRESS}
${OUT52_NODE_DEV}
${OUT52_NODE_PROD}
${OUT52_NODE_PROBLEM}
<p>Express 5 forwards errors thrown in <code>async</code> handlers to the error middleware (Express 4 needed a wrapper). Without <code>NODE_ENV=production</code>, the built-in handler sends the stack trace as HTML — the Express twin of stage 2, and it is the <em>default</em>. With <code>NODE_ENV=production</code> it sends a bare HTML "Internal Server Error". A four-argument middleware is Express's <code>@RestControllerAdvice</code>; ProblemDetail is just a JSON shape, so the result is identical. In Spring you get the 405/415/400 mappings for free; in Express you list them yourself (<code>err.type === 'entity.parse.failed'</code>).</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>Front-end contract:</strong> the React form maps <code>errors[].field</code> to inputs and switches on <code>type</code>; a new message text never breaks it. Agree on the type URIs in the API spec (Chapter 12, OpenAPI).</li>
  <li><strong>Alerting:</strong> 4xx are the client's problem, 5xx are yours. Turning business failures into 404/409 keeps the 5xx alarm meaningful.</li>
  <li><strong>On-call:</strong> "The user sent us errorId 781404e3" ⇒ one grep ⇒ the stack trace with the exact SQL. Chapter 15 adds a trace id to every log line.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you handle exceptions globally in Spring?"</strong> — <code>@RestControllerAdvice</code> with <code>@ExceptionHandler</code> methods, usually extending <code>ResponseEntityExceptionHandler</code>; business exceptions mapped to statuses in one place.</li>
  <li><strong>"What is RFC 9457 / ProblemDetail?"</strong> — A standard JSON error format (<code>application/problem+json</code>): type, title, status, detail, instance, plus extensions. Spring 6+ has <code>ProblemDetail</code> and <code>ErrorResponse</code>.</li>
  <li><strong>"Why not return e.getMessage() to the client?"</strong> — It may contain SQL, internal names, data; it is not written for users; it changes between library versions.</li>
  <li><strong>"@ControllerAdvice vs a servlet filter for errors?"</strong> — Advice sees exceptions from handlers; exceptions in filters or before dispatch never reach it (lesson 4.4) and go to <code>/error</code>.</li>
  <li><strong>"400 vs 409 vs 422 vs 500?"</strong> — invalid input; conflicts with current state; well-formed but unprocessable; our bug. Business rules are never 500.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a business exception <code>LabClosedException(labId, reopenDate)</code> thrown when booking a lab under maintenance.</li>
  <li>Map it to an appropriate status with its own <code>type</code>, and include <code>reopenDate</code> so the app can suggest a date.</li>
  <li>Make sure an unexpected <code>NullPointerException</code> in the same endpoint still reveals nothing but an <code>errorId</code>.</li>
</ol>
<p><strong>Done when:</strong> the response is <code>application/problem+json</code> with <code>type</code> ending in <code>/lab-closed</code> and a <code>reopenDate</code> member, and the log line with the same <code>errorId</code> holds the NPE stack trace.</p></div>
${giai('Show one solution', `${java(`@ExceptionHandler(LabClosedException.class)
ProblemDetail labClosed(LabClosedException ex) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
            "Lab " + ex.labId() + " đang bảo trì");
    pd.setType(URI.create(BASE + "lab-closed"));
    pd.setTitle("Lab đang bảo trì");
    pd.setProperty("reopenDate", ex.reopenDate());   // LocalDate ⇒ "2030-02-01"
    return pd;
}`)}
<p>409 fits: the request is valid but conflicts with the lab's current state (503 would claim the whole API is unavailable). The NPE needs nothing new — the <code>Exception</code> handler already catches it.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RFC 9457 Problem Details</span><span class="v">Standard error body for HTTP APIs, media type <code>application/problem+json</code>.</span></div>
  <div class="kv"><span class="k">ProblemDetail</span><span class="v">Spring's class for that body; <code>ErrorResponse</code> is an exception that carries one.</span></div>
  <div class="kv"><span class="k">@RestControllerAdvice</span><span class="v">A bean whose <code>@ExceptionHandler</code> methods apply to every controller.</span></div>
  <div class="kv"><span class="k">ResponseEntityExceptionHandler</span><span class="v">Base class mapping Spring MVC's own exceptions to ProblemDetail.</span></div>
  <div class="kv"><span class="k">Information disclosure</span><span class="v">Revealing internals (SQL, stack, versions) that help an attacker.</span></div>
  <div class="kv"><span class="k">errorId / correlation id</span><span class="v">Short id shared by the response and the log line.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Default Boot: safe but every business error is 500. Exposing message + trace leaks SQL, constraint names and 6 495 characters of stack.</li>
  <li><code>spring.mvc.problemdetails.enabled=true</code> gives RFC 9457 for Spring's own exceptions; your domain needs <code>@RestControllerAdvice</code>.</li>
  <li>One advice: field errors, business types (<code>lab-not-found</code>, <code>booking-conflict</code>), extensions, translated titles, and a catch-all 500 with an <code>errorId</code>.</li>
  <li>Error paths process hostile input: never echo library messages, never evaluate them (Equifax 2017).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.rfc-editor.org/rfc/rfc9457', '📜', 'RFC 9457 — Problem Details for HTTP APIs', 'The members, extension rules and the application/problem+json media type.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html', '🍃', 'Spring — Error Responses', 'ProblemDetail, ErrorResponse, ResponseEntityExceptionHandler, message codes.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: V52App on Spring Boot 4.1.2 with PostgreSQL 16; Express 5.3.0 on Node 22 (19/11/2026).</li>
  <li>U.S. Government Accountability Office, "Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach" (GAO-18-559, August 2018); Apache Struts S2-045 / CVE-2017-5638.</li>
</ul>
</div>
`;

const L52_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Xử lý lỗi tập trung với ProblemDetail</h2>
<p class="lead">Một API được đánh giá qua lỗi của nó chẳng kém gì qua câu trả lời. Ứng dụng di động cần biết <em>trường nào</em> để gạch đỏ, frontend cần một mã ổn định để rẽ nhánh, đội hỗ trợ cần một mã để tìm dòng log — còn kẻ tấn công thì không được biết gì. Ta đưa một controller LabFlow qua bốn chặng, đo trên cùng một bộ request: mặc định của Spring Boot ("lab không tồn tại" thành 500), kiểu cấu hình "cho tôi xem lỗi" làm lộ SQL và stack trace 71 dòng, <strong>RFC 9457 Problem Details</strong> dựng sẵn (<code>application/problem+json</code>), và cuối cùng là <code>@RestControllerAdvice</code> tự viết với lỗi từng trường, mã nghiệp vụ, thông báo tiếng Việt và <code>errorId</code> cho lỗi bất ngờ.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn nộp phiếu ở quầy đăng ký toà Alpha và bị trả lại. Quầy tệ chỉ nói "không được". Quầy tệ hơn đưa luôn bản ghi chú nội bộ — tên người, số phòng, nhận xét của quản lý. Quầy tốt trả một tờ phiếu in sẵn, lần nào cũng cùng bố cục: loại vấn đề (một mã tra được), một câu giải thích, những ô cần sửa, và số tham chiếu nếu bạn gọi điện hỏi. <strong>ProblemDetail</strong> chính là tờ phiếu đó: cùng một dạng JSON cho mọi lỗi, theo một chuẩn internet (RFC 9457, thay RFC 7807 từ 2023).</p>

<h3>Chặng 1 — mặc định của Spring Boot</h3>
<p>Controller trong gói <code>v52</code> tạo lab và lượt đặt bằng <code>JdbcClient</code>, và ném hai ngoại lệ nghiệp vụ:</p>
${MA52_EX}
${OUT52_MACDINH}
<p>Mặc định thì an toàn nhưng vô dụng: mọi vấn đề nghiệp vụ — trùng mã, lab không có, trùng giờ, không có dòng — đều là <strong>500</strong>, nghĩa là bảo client "server hỏng rồi, thử lại sau" và đánh thức kỹ sư trực. Body (<code>timestamp</code>, <code>status</code>, <code>error</code>, <code>path</code>) do endpoint <code>/error</code> của Spring Boot (<code>BasicErrorController</code>) tạo ra và không có chỗ cho "trường nào".</p>

<h3>Chặng 2 — "cho tôi xem lỗi" (và nó làm lộ gì)</h3>
<p>Phản xạ hay gặp lúc phát triển là bật thông báo và stack trace. Ở Spring Boot 4 các khoá đã chuyển sang <code>spring.web.error.*</code> — khoá cũ <code>server.error.include-*</code> bị bỏ qua im lặng (ta thử khoá cũ trước: không thay đổi gì).</p>
${bash(`java … --spring.web.error.include-message=always --spring.web.error.include-stacktrace=always --spring.web.error.include-binding-errors=always`)}
${OUT52_LO}
<p>Chỉ một lần trùng mã mà response kể cho người lạ: câu SQL chính xác, tên bảng và cột, tên ràng buộc <code>labs_code_key</code>, giá trị đã tồn tại, loại CSDL (giọng văn PostgreSQL), thư viện truy cập dữ liệu và tên gói của ta — 6 495 ký tự stack trace. Response "lab không tồn tại" lộ cả tên tệp nguồn và số dòng. Đây là <strong>lộ thông tin</strong> (OWASP API Security Top 10: cấu hình bảo mật sai). Nó không bao giờ được ra khỏi máy của lập trình viên.</p>

<h3>Chặng 3 — RFC 9457 bằng một thuộc tính</h3>
${props(`spring.mvc.problemdetails.enabled=true`)}
${OUT52_PD}
<p>Mọi ngoại lệ do chính Spring MVC ném (405, 415, 400 vì body hỏng, 400 vì validate, 404 vì đường dẫn lạ) giờ trả <code>Content-Type: application/problem+json</code> với các thành phần chuẩn:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">type</span><span class="v">Một URI định danh <em>loại</em> vấn đề; client rẽ nhánh theo nó. Mặc định <code>about:blank</code> (bị lược) nghĩa là "chỉ có mã trạng thái".</span></div>
  <div class="kv"><span class="k">title</span><span class="v">Tóm tắt ngắn cho người đọc về loại đó; không đổi giữa các lần xảy ra.</span></div>
  <div class="kv"><span class="k">status</span><span class="v">Mã HTTP, nhắc lại trong body (proxy đôi khi ghi đè mã thật).</span></div>
  <div class="kv"><span class="k">detail</span><span class="v">Giải thích cho <em>lần</em> xảy ra này, viết cho người.</span></div>
  <div class="kv"><span class="k">instance</span><span class="v">URI của lần xảy ra này — Spring điền đường dẫn request.</span></div>
  <div class="kv"><span class="k">phần mở rộng</span><span class="v">Thành phần thêm tuỳ ý (<code>errors</code>, <code>labId</code>, <code>errorId</code>…).</span></div>
</div>
<p>Để ý cái <em>không</em> đổi: ngoại lệ của ta và lỗi SQL vẫn là 500 trơn. Thuộc tính này chỉ lo ngoại lệ của Spring; nghiệp vụ của bạn cần một bộ xử lý riêng.</p>

<h3>Chặng 4 — một @RestControllerAdvice cho cả API</h3>
${MA52_ADVICE}
<ul>
  <li><strong>Kế thừa <code>ResponseEntityExceptionHandler</code></strong>: lớp này đã ánh xạ khoảng hai mươi ngoại lệ của Spring MVC sang đúng mã trạng thái dưới dạng ProblemDetail. Bạn chỉ ghi đè chỗ muốn làm giàu (ở đây là validate). Lab 5 cho thấy chuyện gì xảy ra nếu bỏ qua bước này.</li>
  <li><strong>Ngoại lệ nghiệp vụ không biết gì về HTTP</strong> (<code>LabNotFoundException</code> không biết 404); advice là nơi duy nhất dịch chúng. Service dùng lại được từ tác vụ hẹn giờ hay bộ nghe hàng đợi.</li>
  <li><strong><code>DuplicateKeyException</code> ⇒ 409 với detail tự viết</strong> — không bao giờ dùng <code>ex.getMessage()</code>, trong đó có câu SQL.</li>
  <li><strong>Lưới cuối, <code>@ExceptionHandler(Exception.class)</code></strong>: ghi log đầy đủ ngoại lệ kèm một <code>errorId</code> ngẫu nhiên ngắn, và chỉ trả về mã đó.</li>
  <li><strong>Lỗi từng trường không kèm giá trị bị từ chối</strong>: lặp lại mật khẩu bị từ chối, hay một <code>&lt;script&gt;</code> mà frontend có thể hiển thị, là lộ dữ liệu hoặc mở đường XSS.</li>
</ul>
${OUT52_ADVICE}
${OUT52_LOG}
<p>Tám request cũ cộng hai request mới (câu SQL báo cáo gõ nhầm tên cột, một lab đã lưu trữ): 409 cho trùng mã, 404 kèm <code>labId</code> cho lab không có, 400 kèm ba lỗi trường, 409 kèm <code>conflictingBookingId</code> (ứng dụng có thể gợi ý "xem lượt đặt đang chiếm giờ"), 404, 405 và 400 giữ nguyên của Spring, 410 từ một <code>ResponseStatusException</code> (Spring cũng tự biến nó thành ProblemDetail), và một 500 mà bí mật duy nhất là <code>781404e3</code> — đúng mã đứng đầu stack trace đầy đủ trong log server. Bộ phận hỗ trợ xin người dùng mã đó; lập trình viên grep log.</p>

<h3>Thông báo theo ngôn ngữ người dùng</h3>
${PROPS52_VI}
${OUT52_VI}
<p><code>ResponseEntityExceptionHandler</code> tra <code>problemDetail.title.&lt;lớp ngoại lệ&gt;</code> và <code>problemDetail.&lt;lớp ngoại lệ&gt;</code> trong <code>MessageSource</code>; thông báo từng trường lấy từ <code>messages_vi.properties</code> của bài 5.1. URI <code>type</code> và tên trường giữ tiếng Anh — chúng dành cho chương trình.</p>

<h3>🕵️ Góc hacker — đường đi của lỗi là bề mặt tấn công</h3>
<p>Thông báo lỗi được viết vội và ít được thử nhất, trong khi lại xử lý đầu vào thù địch nhất. Từ đó sinh ra hai họ lỗi:</p>
<ol>
  <li><strong>Lộ</strong> — output chặng 2 ở trên. SQL và tên ràng buộc cho kẻ chèn SQL biết lược đồ; tên thư viện và số dòng cho biết nên thử CVE nào; thông báo khác nhau giữa "không có người dùng" và "sai mật khẩu" cho phép dò tài khoản (Chương 9).</li>
  <li><strong>Thực thi</strong> — bộ xử lý lỗi đưa đầu vào người dùng vào một trình thông dịch.</li>
</ol>
<div class="callout warn"><p><strong>Sự cố thật — Equifax, 2017 (CVE-2017-5638).</strong> Trong bộ phân tích multipart Jakarta của Apache Struts 2, một header <code>Content-Type</code> không hợp lệ sinh ra thông báo lỗi, và thông báo đó lại bị đánh giá như một biểu thức OGNL. Kẻ tấn công nhét OGNL vào header và chạy lệnh trên server. Equifax chưa cài bản vá tháng 3/2017; từ tháng 5 tới tháng 7/2017 kẻ tấn công lấy dữ liệu cá nhân của khoảng 147 triệu người. Bài 5.3 cho thấy cùng hình dạng lỗi này trong Bean Validation (Netflix Conductor, 2020).</p>
<p><strong>Cách phòng:</strong> một bộ xử lý tập trung; <code>detail</code> cố định do người viết; không bao giờ đưa <code>ex.getMessage()</code> của thư viện vào response; không bao giờ đánh giá thông báo có chứa đầu vào người dùng; <code>include-stacktrace</code> và các khoá cùng họ chỉ dùng ở profile máy cá nhân; vá framework sớm.</p></div>

<h3>So với Node.js</h3>
${MA52_EXPRESS}
${OUT52_NODE_DEV}
${OUT52_NODE_PROD}
${OUT52_NODE_PROBLEM}
<p>Express 5 tự chuyển lỗi ném trong hàm <code>async</code> tới middleware lỗi (Express 4 phải bọc thêm). Không đặt <code>NODE_ENV=production</code>, bộ xử lý dựng sẵn gửi stack trace dạng HTML — phiên bản Express của chặng 2, và đó là <em>mặc định</em>. Có <code>NODE_ENV=production</code>, nó gửi một trang HTML "Internal Server Error" trơn. Middleware bốn tham số chính là <code>@RestControllerAdvice</code> của Express; ProblemDetail chỉ là một dạng JSON nên kết quả y hệt. Ở Spring bạn được tặng sẵn ánh xạ 405/415/400; ở Express bạn tự liệt kê (<code>err.type === 'entity.parse.failed'</code>).</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Hợp đồng với frontend:</strong> form React ánh xạ <code>errors[].field</code> vào ô nhập và rẽ nhánh theo <code>type</code>; đổi câu chữ thông báo không làm vỡ gì. Thống nhất các URI type trong đặc tả API (Chương 12, OpenAPI).</li>
  <li><strong>Cảnh báo:</strong> 4xx là chuyện của client, 5xx là chuyện của ta. Biến lỗi nghiệp vụ thành 404/409 giữ cho chuông báo 5xx còn ý nghĩa.</li>
  <li><strong>Trực sự cố:</strong> "Người dùng gửi errorId 781404e3" ⇒ một lệnh grep ⇒ stack trace kèm câu SQL chính xác. Chương 15 thêm mã truy vết vào mọi dòng log.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Xử lý ngoại lệ toàn cục trong Spring thế nào?"</strong> — <code>@RestControllerAdvice</code> với các hàm <code>@ExceptionHandler</code>, thường kế thừa <code>ResponseEntityExceptionHandler</code>; ngoại lệ nghiệp vụ được ánh xạ sang mã trạng thái ở một chỗ.</li>
  <li><strong>"RFC 9457 / ProblemDetail là gì?"</strong> — Dạng JSON lỗi chuẩn (<code>application/problem+json</code>): type, title, status, detail, instance cộng phần mở rộng. Spring 6+ có <code>ProblemDetail</code> và <code>ErrorResponse</code>.</li>
  <li><strong>"Sao không trả e.getMessage() cho client?"</strong> — Nó có thể chứa SQL, tên nội bộ, dữ liệu; không viết cho người dùng; đổi theo phiên bản thư viện.</li>
  <li><strong>"@ControllerAdvice khác filter servlet ở việc xử lý lỗi?"</strong> — Advice thấy ngoại lệ từ handler; ngoại lệ trong filter hoặc trước khi điều phối không bao giờ tới nó (bài 4.4) mà đi về <code>/error</code>.</li>
  <li><strong>"400, 409, 422, 500 khác nhau thế nào?"</strong> — đầu vào sai; xung đột với trạng thái hiện tại; đúng cú pháp nhưng không xử lý được; lỗi của ta. Luật nghiệp vụ không bao giờ là 500.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm ngoại lệ nghiệp vụ <code>LabClosedException(labId, reopenDate)</code> ném ra khi đặt một lab đang bảo trì.</li>
  <li>Ánh xạ nó sang mã trạng thái phù hợp với <code>type</code> riêng, kèm <code>reopenDate</code> để ứng dụng gợi ý ngày.</li>
  <li>Bảo đảm một <code>NullPointerException</code> bất ngờ trong cùng endpoint vẫn chỉ lộ ra <code>errorId</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> response là <code>application/problem+json</code> với <code>type</code> kết thúc bằng <code>/lab-closed</code> và có thành phần <code>reopenDate</code>; dòng log cùng <code>errorId</code> chứa stack trace của NPE.</p></div>
${giai('Xem một lời giải', `${java(`@ExceptionHandler(LabClosedException.class)
ProblemDetail labClosed(LabClosedException ex) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
            "Lab " + ex.labId() + " đang bảo trì");
    pd.setType(URI.create(BASE + "lab-closed"));
    pd.setTitle("Lab đang bảo trì");
    pd.setProperty("reopenDate", ex.reopenDate());   // LocalDate ⇒ "2030-02-01"
    return pd;
}`)}
<p>409 hợp lý: request hợp lệ nhưng xung đột với trạng thái hiện tại của lab (503 lại ngụ ý cả API không phục vụ được). NPE không cần thêm gì — bộ xử lý <code>Exception</code> đã bắt nó.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RFC 9457 Problem Details</span><span class="v">Body lỗi chuẩn cho API HTTP, kiểu nội dung <code>application/problem+json</code>.</span></div>
  <div class="kv"><span class="k">ProblemDetail</span><span class="v">Lớp của Spring cho body đó; <code>ErrorResponse</code> là ngoại lệ mang sẵn một ProblemDetail.</span></div>
  <div class="kv"><span class="k">@RestControllerAdvice</span><span class="v">Bean có các hàm <code>@ExceptionHandler</code> áp dụng cho mọi controller.</span></div>
  <div class="kv"><span class="k">ResponseEntityExceptionHandler</span><span class="v">Lớp cơ sở ánh xạ ngoại lệ của chính Spring MVC sang ProblemDetail.</span></div>
  <div class="kv"><span class="k">Lộ thông tin</span><span class="v">Để lộ chi tiết bên trong (SQL, stack, phiên bản) giúp kẻ tấn công.</span></div>
  <div class="kv"><span class="k">errorId / mã tương quan</span><span class="v">Mã ngắn có chung ở response và dòng log.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Boot mặc định: an toàn nhưng mọi lỗi nghiệp vụ là 500. Bật message + trace thì lộ SQL, tên ràng buộc và 6 495 ký tự stack.</li>
  <li><code>spring.mvc.problemdetails.enabled=true</code> cho RFC 9457 với ngoại lệ của Spring; nghiệp vụ của bạn cần <code>@RestControllerAdvice</code>.</li>
  <li>Một advice: lỗi từng trường, type nghiệp vụ (<code>lab-not-found</code>, <code>booking-conflict</code>), phần mở rộng, title đã dịch, và lưới 500 có <code>errorId</code>.</li>
  <li>Đường đi của lỗi xử lý đầu vào thù địch: không lặp lại thông báo của thư viện, không đánh giá chúng (Equifax 2017).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.rfc-editor.org/rfc/rfc9457', '📜', 'RFC 9457 — Problem Details cho API HTTP', 'Các thành phần, luật mở rộng và kiểu nội dung application/problem+json.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html', '🍃', 'Spring — Error Responses', 'ProblemDetail, ErrorResponse, ResponseEntityExceptionHandler, mã thông báo.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: V52App trên Spring Boot 4.1.2 với PostgreSQL 16; Express 5.3.0 trên Node 22 (19/11/2026).</li>
  <li>U.S. Government Accountability Office, "Data Protection: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach" (GAO-18-559, 08/2018); Apache Struts S2-045 / CVE-2017-5638.</li>
</ul>
</div>
`;

// ===== Bài 5.3 =====
const MA53_ANNO = java("// 1) Annotation: khai báo ràng buộc + trỏ tới lớp kiểm\n@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = StudentIdValidator.class)\npublic @interface StudentId {\n    String message() default \"mã sinh viên phải gồm 2 chữ in hoa + 6 chữ số, khoá từ 15 tới 20 (vd SE180123)\";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n}");
const MA53_VAL = java("// 2) Lớp kiểm: isValid trả true/false. null ⇒ true (để @NotBlank lo việc \"bắt buộc\")\npublic class StudentIdValidator implements ConstraintValidator<StudentId, String> {\n    private static final Pattern FORMAT = Pattern.compile(\"[A-Z]{2}(\\\\d{2})\\\\d{4}\");\n\n    @Override\n    public boolean isValid(String value, ConstraintValidatorContext ctx) {\n        if (value == null) return true;\n        var m = FORMAT.matcher(value);\n        if (!m.matches()) return false;\n        int khoa = Integer.parseInt(m.group(1));   // SE18xxxx ⇒ khoá 18\n        return khoa >= 15 && khoa <= 20;\n    }\n}");
const MA53_WIN = java("public class BookingWindowValidator implements ConstraintValidator<BookingWindow, NewBooking> {\n    private BookingWindow rule;\n\n    @Override\n    public void initialize(BookingWindow rule) {\n        this.rule = rule;   // đọc tham số của annotation một lần\n    }\n\n    @Override\n    public boolean isValid(NewBooking b, ConstraintValidatorContext ctx) {\n        if (b == null || b.startAt() == null || b.endAt() == null) return true;   // @NotNull từng trường lo\n        ctx.disableDefaultConstraintViolation();   // bỏ thông báo chung, gắn lỗi vào đúng trường\n        boolean ok = true;\n        if (!b.endAt().isAfter(b.startAt())) {\n            ok = fail(ctx, \"endAt\", \"phải sau startAt\");\n        } else if (Duration.between(b.startAt(), b.endAt()).toMinutes() > rule.maxMinutes()) {\n            ok = fail(ctx, \"endAt\", \"một lượt đặt tối đa \" + rule.maxMinutes() + \" phút\");\n        }\n        if (b.startAt().getHour() < rule.openHour()\n                || !b.endAt().toLocalDate().equals(b.startAt().toLocalDate())\n                || b.endAt().toLocalTime().isAfter(java.time.LocalTime.of(rule.closeHour(), 0))) {\n            ok = fail(ctx, \"startAt\", \"lab mở \" + rule.openHour() + \":00–\" + rule.closeHour() + \":00 trong cùng một ngày\");\n        }\n        return ok;\n    }\n\n    private static boolean fail(ConstraintValidatorContext ctx, String field, String msg) {\n        ctx.buildConstraintViolationWithTemplate(msg).addPropertyNode(field).addConstraintViolation();\n        return false;\n    }\n}");
const MA53_REC = java("@BookingWindow\npublic record NewBooking(\n        @NotNull @Positive Long labId,\n        @NotBlank @StudentId String studentId,\n        @NotNull @Future LocalDateTime startAt,\n        @NotNull LocalDateTime endAt) {\n}");
const OUT53_WIN = out("$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"SE180123\",\"startAt\":\"2030-01-15T08:00:00\",\"endAt\":\"2030-01-15T10:00:00\"}'\n{\"labId\":1,\"studentId\":\"SE180123\",\"startAt\":\"2030-01-15T08:00:00\",\"endAt\":\"2030-01-15T10:00:00\"}\n[HTTP 201]\n\n$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"SE180123\",\"startAt\":\"2030-01-15T10:00:00\",\"endAt\":\"2030-01-15T08:00:00\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"endAt\",\"message\":\"phải sau startAt\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"SE180123\",\"startAt\":\"2030-01-15T08:00:00\",\"endAt\":\"2030-01-15T13:00:00\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"endAt\",\"message\":\"một lượt đặt tối đa 240 phút\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"SE180123\",\"startAt\":\"2030-01-15T20:00:00\",\"endAt\":\"2030-01-16T00:30:00\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"endAt\",\"message\":\"một lượt đặt tối đa 240 phút\"},{\"field\":\"startAt\",\"message\":\"lab mở 7:00–21:00 trong cùng một ngày\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"se180123\",\"startAt\":\"2030-01-15T08:00:00\",\"endAt\":\"2030-01-15T10:00:00\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"studentId\",\"message\":\"mã sinh viên phải gồm 2 chữ in hoa + 6 chữ số, khoá từ 15 tới 20 (vd SE180123)\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/bookings -H 'Content-Type: application/json' -d '{\"labId\":1,\"studentId\":\"SE120001\",\"startAt\":\"2030-01-15T08:00:00\",\"endAt\":\"2030-01-15T10:00:00\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/bookings\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"studentId\",\"message\":\"mã sinh viên phải gồm 2 chữ in hoa + 6 chữ số, khoá từ 15 tới 20 (vd SE180123)\"}]}\n[HTTP 400]");
const MA53_UNIQ = java("// Spring tạo validator này qua SpringConstraintValidatorFactory ⇒ tiêm được bean (JdbcClient)\npublic class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {\n    private final JdbcClient db;\n\n    public UniqueEmailValidator(JdbcClient db) {\n        this.db = db;\n    }\n\n    @Override\n    public boolean isValid(String email, ConstraintValidatorContext ctx) {\n        if (email == null) return true;\n        return db.sql(\"SELECT count(*) FROM \" + Tables.students() + \" WHERE email = ?\").param(email)\n                .query(Long.class).single() == 0;\n    }\n}");
const OUT53_RACE_NOPK = out("$ for i in $(seq 10); do curl -X POST localhost:41870/students -d '{\"email\":\"lan@fpt.edu.vn\",\"name\":\"Lan\"}' & done\n        10 201\n$ curl -X POST localhost:41870/students -d '{\"email\":\"lan@fpt.edu.vn\",\"name\":\"Lan\"}'   # gửi lại lần 11\n{\"detail\":\"Invalid request content.\",\"instance\":\"/students\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"email\",\"message\":\"email đã được dùng\"}]}\n[HTTP 400]\n so_dong \n---------\n      10\n(1 row)");
const OUT53_RACE_UNIQUE = out("$ for i in $(seq 10); do curl -X POST localhost:41870/students -d '{\"email\":\"lan@fpt.edu.vn\",\"name\":\"Lan\"}' & done\n         1 201\n         9 500\n$ curl -X POST localhost:41870/students -d '{\"email\":\"lan@fpt.edu.vn\",\"name\":\"Lan\"}'   # gửi lại lần 11\n{\"detail\":\"Invalid request content.\",\"instance\":\"/students\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"email\",\"message\":\"email đã được dùng\"}]}\n[HTTP 400]\n so_dong \n---------\n       1\n(1 row)");
const OUT53_RACE_V2 = out("$ for i in $(seq 10); do curl -X POST localhost:41870/v2/students -d '{\"email\":\"minh@fpt.edu.vn\",\"name\":\"Minh\"}' & done\n         1 201\n         9 409\n$ curl -X POST localhost:41870/v2/students -H 'Content-Type: application/json' -d '{\"email\":\"minh@fpt.edu.vn\",\"name\":\"Minh\"}'\n{\"detail\":\"email đã được dùng\",\"instance\":\"/v2/students\",\"status\":409,\"title\":\"Conflict\"}\n[HTTP 409]\n\n so_dong \n---------\n       1\n(1 row)");
const MA53_LABCODE = java("public class LabCodeValidator implements ConstraintValidator<LabCode, String> {\n    private static final Set<String> CODES = Set.of(\"IOT-01\", \"NET-02\", \"SEC-04\");\n\n    @Override\n    public boolean isValid(String code, ConstraintValidatorContext ctx) {\n        if (code == null || CODES.contains(code)) return true;\n        ctx.disableDefaultConstraintViolation();\n        if (Boolean.getBoolean(\"c53.safe\")) {\n            // AN TOÀN: giá trị người dùng là THAM SỐ, không nằm trong mẫu thông báo\n            ctx.unwrap(HibernateConstraintValidatorContext.class)\n               .addMessageParameter(\"code\", code)\n               .buildConstraintViolationWithTemplate(\"mã lab {code} không tồn tại\")\n               .addConstraintViolation();\n        } else {\n            // NGUY HIỂM: nối giá trị người dùng vào MẪU thông báo\n            ctx.buildConstraintViolationWithTemplate(\"mã lab \" + code + \" không tồn tại\").addConstraintViolation();\n        }\n        return false;\n    }\n}");
const MA53_EL = java("// Bật lại EL cho thông báo tự dựng — đúng cấu hình của các bản Hibernate Validator cũ (trước 6.2)\n@Configuration\n@ConditionalOnProperty(\"c53.el\")\nclass ElConfig {\n    @Bean\n    ValidationConfigurationCustomizer elForCustomViolations() {\n        return cfg -> cfg.addProperty(\"hibernate.validator.custom_violation_expression_language_feature_level\", \"bean-methods\");\n    }\n}");
const OUT53_EL_MACDINH = out("$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"LAB-99\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab LAB-99 không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"${1+1}\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${1+1} không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'ha'.repeat(5)}\\\"}\"\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${'ha'.repeat(5)} không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'x'.repeat(600000000).length()}\\\"}\"\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${'x'.repeat(600000000).length()} không tồn tại\"}]}\n[HTTP 400]");
const OUT53_EL_BAT = out("$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"LAB-99\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab LAB-99 không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"${1+1}\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab 2 không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'ha'.repeat(5)}\\\"}\"\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab hahahahaha không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'x'.repeat(600000000).length()}\\\"}\"\n{\"timestamp\":\"2026-11-18T23:00:56.223Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs/lookup\"}\n[HTTP 500]");
const OUT53_EL_SAFE = out("$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"LAB-99\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab LAB-99 không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d '{\"code\":\"${1+1}\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${1+1} không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'ha'.repeat(5)}\\\"}\"\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${'ha'.repeat(5)} không tồn tại\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/labs/lookup -H 'Content-Type: application/json' -d \"{\\\"code\\\":\\\"\\${'x'.repeat(600000000).length()}\\\"}\"\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/lookup\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"code\",\"message\":\"mã lab ${'x'.repeat(600000000).length()} không tồn tại\"}]}\n[HTTP 400]");
const MA53_ZOD = js("// So sánh 5.3 + 5.4: zod — kiểm liên trường (refine) và PATCH (partial), JS tự phân biệt undefined / null\nimport { z } from 'zod';\nconst Booking = z.object({\n  studentId: z.string().regex(/^[A-Z]{2}\\d{6}$/),\n  startAt: z.iso.datetime({ local: true }),\n  endAt: z.iso.datetime({ local: true }),\n}).refine((b) => b.endAt > b.startAt, { path: ['endAt'], message: 'phải sau startAt' });");

const L53_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Custom and cross-field validators</h2>
<p class="lead">The built-in annotations check one value at a time. Real rules are about your domain — "an FPT student id is two capitals and six digits, intake 15 to 20", "a booking ends after it starts, lasts at most four hours and stays inside 07:00–21:00". This lesson writes those rules as your own annotations, attaches cross-field errors to the right field, and then tests two ideas that look clever and are not: a validator that queries the database (ten parallel requests ⇒ ten duplicate rows) and a validator that puts the user's input into its message (with expression language on, <code>\${1+1}</code> comes back as <code>2</code> and one request throws <code>OutOfMemoryError</code>).</p>

<h3>In everyday life first</h3>
<p>The registration clerk from lesson 5.1 also knows house rules no printed form mentions: student ids look like SE180123, the lab opens at seven and closes at nine. Those checks still only need the form in front of them. But "has this email already registered?" needs the filing cabinet — and two clerks checking the cabinet at the same second will both find nothing. Keep that picture: <strong>form-only rules go in validators, rules that need shared state go in the service and the database.</strong></p>

<h3>A custom constraint: annotation + validator</h3>
${MA53_ANNO}
${MA53_VAL}
<ul>
  <li><code>@Constraint(validatedBy = …)</code> links the annotation to its checker; <code>message</code>, <code>groups</code> and <code>payload</code> are mandatory members of every constraint.</li>
  <li><code>isValid</code> returns <code>true</code> for <code>null</code> — the convention of every built-in constraint, so <code>@NotBlank @StudentId</code> reports "must not be blank" once instead of two errors.</li>
  <li>For a pure format rule you could also <em>compose</em> existing constraints: put <code>@Pattern</code> on the annotation, add <code>@ReportAsSingleViolation</code> and <code>validatedBy = {}</code> (the Lab 5 solution does this).</li>
</ul>

<h3>Cross-field: a constraint on the whole record</h3>
${MA53_WIN}
${MA53_REC}
${OUT53_WIN}
<p>A class-level constraint receives the whole object. <code>disableDefaultConstraintViolation()</code> plus <code>addPropertyNode("endAt")</code> moves the error from the anonymous object to the field the user must change — the front-end underlines "end time", not the whole form. One request can produce several violations (the 20:00–00:30 booking breaks the duration and the opening hours). <code>initialize()</code> reads the annotation's parameters once, so <code>@BookingWindow(maxMinutes = 120)</code> works for another lab type.</p>

<h3>A validator that asks the database — and the race it creates</h3>
${MA53_UNIQ}
<p>It works in the demo: Spring creates constraint validators through its own factory, so constructor injection of <code>JdbcClient</code> just works, and the 11th request gets a neat 400 "email đã được dùng". Now send ten requests at once, first to a table <em>without</em> a unique constraint:</p>
${OUT53_RACE_NOPK}
<p>Ten rows for one email. All ten validators ran <code>SELECT count(*)</code> before any of the ten <code>INSERT</code>s committed — check-then-act, the same race as lesson 4.5. With a <code>UNIQUE</code> constraint the database stops the duplicates, but nobody translated its error:</p>
${OUT53_RACE_UNIQUE}
<p>One 201 and nine 500s (the log holds nine <code>DuplicateKeyException</code>s on <code>students_email_key</code>). The validator made the code look safe and added a query to every request; it never was the guard. The fix keeps validation about shape and lets the database decide:</p>
${OUT53_RACE_V2}
<p><code>NewStudentV2</code> has only <code>@NotBlank @Email</code>; the handler maps <code>DuplicateKeyException</code> to 409. Ten parallel requests ⇒ one 201, nine 409, one row. Rules of thumb:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">In a validator</span><span class="v">Anything decidable from the request alone: format, ranges, relations between fields, a fixed list.</span></div>
  <div class="kv"><span class="k">In the service</span><span class="v">Rules needing current data: lab exists, time slot free, quota left. Throw business exceptions ⇒ 404/409.</span></div>
  <div class="kv"><span class="k">In the database</span><span class="v">The final guarantee: <code>UNIQUE</code>, foreign keys, <code>CHECK</code>, exclusion constraints (Chapter 7) — they hold under concurrency.</span></div>
</div>

<h3>🕵️ Hacker corner — user input inside a message template</h3>
<p>Validator messages are <em>templates</em>: <code>{min}</code> is replaced by a parameter, and <code>\${…}</code> is evaluated as Jakarta Expression Language. A natural-looking validator builds the message with string concatenation:</p>
${MA53_LABCODE}
${OUT53_EL_MACDINH}
<p>On Hibernate Validator 9 with default settings, nothing happens: since 6.2 (2021) expression language in messages built by <code>buildConstraintViolationWithTemplate</code> is <strong>off</strong> by default. But older versions evaluated it, and the setting can be turned back on — for example by a team that wanted <code>\${validatedValue}</code> in a message:</p>
${MA53_EL}
${OUT53_EL_BAT}
<p>Now the user writes code and the server runs it: <code>\${1+1}</code> ⇒ <code>2</code>, <code>'ha'.repeat(5)</code> ⇒ <code>hahahahaha</code> — arbitrary method calls on objects the attacker builds. <code>'x'.repeat(600000000).length()</code> made the JVM allocate 600&nbsp;MB and answer 500 with <code>OutOfMemoryError: Java heap space</code> in the log. Calls such as <code>Class.forName</code> were refused in this version ("references an unknown method"), which is a mitigation, not a design you should rely on.</p>
${OUT53_EL_SAFE}
<p>The safe version passes the value as a <strong>message parameter</strong> (<code>addMessageParameter("code", code)</code>, template <code>{code}</code>): parameters are inserted as text, never interpreted, even with EL enabled.</p>
<div class="callout warn"><p><strong>Real incident — Netflix Conductor, 2020 (CVE-2020-9296, GitHub Security Lab GHSL-2020-027).</strong> Conductor's custom constraint validators built violation messages from user-controlled values; with the Hibernate Validator of the time, an attacker could submit a workflow definition whose field contained a Java EL expression and get remote code execution — rated critical (CVSS 9.8), fixed in Conductor 2.25.3. A separate Hibernate Validator bug, CVE-2020-10693, let crafted invalid EL slip past the escaping that was meant to neutralise it. The same shape as Equifax (lesson 5.2): user input reaching an interpreter through an error message.</p>
<p><strong>How to prevent it:</strong> never concatenate user input into a constraint message; use <code>addMessageParameter</code>/<code>addExpressionVariable</code>; keep the default EL level; keep Hibernate Validator up to date.</p></div>

<h3>Compared with Node.js</h3>
${MA53_ZOD}
<p>zod expresses a cross-field rule with <code>.refine(fn, { path: ['endAt'] })</code> — the same idea as <code>addPropertyNode</code> (output in lesson 5.4's comparison: <code>endAt: phải sau startAt</code>). Because a zod schema is plain code, there is no annotation/validator split and no message templating to inject into. An async <code>refine</code> that queries the database has exactly the race measured above.</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>Shared constraints library:</strong> companies keep <code>@StudentId</code>, <code>@VietnamesePhone</code>, <code>@TaxCode</code> in one module used by every service, so a rule changes in one place.</li>
  <li><strong>Unit-test validators directly</strong>: <code>Validation.buildDefaultValidatorFactory().getValidator().validate(dto)</code> — no Spring context, milliseconds (Chapter 11).</li>
  <li><strong>Review flag:</strong> a <code>ConstraintValidator</code> with a repository in its constructor. Ask "what happens with two requests at once?".</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you write a custom validation annotation?"</strong> — annotation with <code>@Constraint(validatedBy)</code> and <code>message/groups/payload</code>; a <code>ConstraintValidator&lt;A, T&gt;</code> whose <code>isValid</code> treats null as valid.</li>
  <li><strong>"How do you validate endDate &gt; startDate?"</strong> — a class-level constraint; report on the field with <code>buildConstraintViolationWithTemplate(...).addPropertyNode("endDate")</code>.</li>
  <li><strong>"Can a validator use a repository?"</strong> — It can (Spring injects it), but uniqueness checked in a validator races; enforce with a database constraint and map the error to 409.</li>
  <li><strong>"Any security risk in validation messages?"</strong> — EL injection when user input is concatenated into the template (CVE-2020-9296); use message parameters.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write <code>@VnMobile</code>: ten digits starting with <code>03</code>, <code>05</code>, <code>07</code>, <code>08</code> or <code>09</code>; spaces and dots typed by the user should be tolerated.</li>
  <li>Write a class-level <code>@PasswordsMatch</code> for a sign-up DTO (<code>password</code>, <code>confirmPassword</code>) that reports on <code>confirmPassword</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>"090.123.4567"</code> passes, <code>"0123456789"</code> fails, and mismatching passwords produce exactly one error with field <code>confirmPassword</code> — and the error never contains either password.</p></div>
${giai('Show one solution', `${java(`public class VnMobileValidator implements ConstraintValidator<VnMobile, String> {
    private static final Pattern P = Pattern.compile("0[35789]\\\\d{8}");
    public boolean isValid(String v, ConstraintValidatorContext ctx) {
        return v == null || P.matcher(v.replaceAll("[ .]", "")).matches();
    }
}

public class PasswordsMatchValidator implements ConstraintValidator<PasswordsMatch, SignUp> {
    public boolean isValid(SignUp s, ConstraintValidatorContext ctx) {
        if (s == null || s.password() == null || s.password().equals(s.confirmPassword())) return true;
        ctx.disableDefaultConstraintViolation();
        ctx.buildConstraintViolationWithTemplate("không khớp mật khẩu")   // không nối giá trị vào mẫu
           .addPropertyNode("confirmPassword").addConstraintViolation();
        return false;
    }
}`)}
<p>Normalising inside the validator only checks; store the normalised number in the service so the database never holds "090.123.4567".</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConstraintValidator</span><span class="v">The class that decides whether one value (or object) satisfies a constraint.</span></div>
  <div class="kv"><span class="k">Class-level constraint</span><span class="v">Annotation on the type; sees all fields; used for cross-field rules.</span></div>
  <div class="kv"><span class="k">Composed constraint</span><span class="v">A constraint made of others (<code>@Pattern</code> on the annotation), optionally <code>@ReportAsSingleViolation</code>.</span></div>
  <div class="kv"><span class="k">Check-then-act race</span><span class="v">Reading a condition and acting on it in two steps while others do the same.</span></div>
  <div class="kv"><span class="k">EL injection</span><span class="v">User input evaluated as an Expression Language expression.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Custom constraint = annotation + <code>ConstraintValidator</code>; null is valid; parameters via <code>initialize</code>.</li>
  <li>Cross-field rules live on the class and report on the field with <code>addPropertyNode</code>.</li>
  <li>A database-checking validator gave 10 duplicate rows, or 9 × 500 with a UNIQUE constraint; the database constraint + 409 gave 1 × 201 + 9 × 409.</li>
  <li>User input concatenated into a message template: safe by default in HV 9, but with EL on, <code>\${1+1}</code> ⇒ 2 and an OutOfMemoryError (CVE-2020-9296).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#validator-customconstraints', '📘', 'Hibernate Validator — Creating custom constraints', 'Class-level constraints, composition, ConstraintValidatorContext, EL feature levels.')}
${tl('https://securitylab.github.com/advisories/GHSL-2020-027-netflix-conductor', '🛡', 'GHSL-2020-027 — Netflix Conductor', 'The advisory: RCE through Java EL in Bean Validation messages.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: V53App on Spring Boot 4.1.2, Hibernate Validator 9.1.5.Final, PostgreSQL 16 (19/11/2026).</li>
  <li>GitHub Security Lab, GHSL-2020-027; Netflix security bulletin NFLX-2020-001; NVD CVE-2020-9296 and CVE-2020-10693.</li>
</ul>
</div>
`;

const L53_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Validator tuỳ biến và liên trường</h2>
<p class="lead">Annotation dựng sẵn chỉ kiểm từng giá trị một. Luật thật thì gắn với nghiệp vụ của bạn — "mã sinh viên FPT gồm hai chữ in hoa và sáu chữ số, khoá 15 tới 20", "lượt đặt kết thúc sau khi bắt đầu, dài tối đa bốn tiếng và nằm trong 07:00–21:00". Bài này viết các luật đó thành annotation của riêng bạn, gắn lỗi liên trường vào đúng trường, rồi thử hai ý tưởng trông thông minh mà không phải: validator tra CSDL (mười request song song ⇒ mười dòng trùng) và validator đưa đầu vào người dùng vào thông báo (bật expression language thì <code>\${1+1}</code> trả về <code>2</code> và một request ném <code>OutOfMemoryError</code>).</p>

<h3>Đời thường trước đã</h3>
<p>Nhân viên quầy đăng ký của bài 5.1 còn biết những luật nhà mà phiếu in không ghi: mã sinh viên trông như SE180123, lab mở lúc bảy giờ và đóng lúc chín giờ tối. Những phép kiểm đó vẫn chỉ cần tờ phiếu trước mặt. Nhưng "email này đăng ký rồi chưa?" thì cần tủ hồ sơ — và hai nhân viên cùng mở tủ trong cùng một giây sẽ cùng không thấy gì. Giữ hình ảnh đó: <strong>luật chỉ cần tờ phiếu thì đặt trong validator, luật cần trạng thái dùng chung thì đặt ở service và CSDL.</strong></p>

<h3>Ràng buộc tuỳ biến: annotation + validator</h3>
${MA53_ANNO}
${MA53_VAL}
<ul>
  <li><code>@Constraint(validatedBy = …)</code> nối annotation với lớp kiểm; <code>message</code>, <code>groups</code> và <code>payload</code> là thành phần bắt buộc của mọi ràng buộc.</li>
  <li><code>isValid</code> trả <code>true</code> với <code>null</code> — quy ước của mọi ràng buộc dựng sẵn, để <code>@NotBlank @StudentId</code> chỉ báo "không được để trống" một lần thay vì hai lỗi.</li>
  <li>Với luật thuần hình dạng, bạn cũng có thể <em>ghép</em> ràng buộc có sẵn: đặt <code>@Pattern</code> lên annotation, thêm <code>@ReportAsSingleViolation</code> và <code>validatedBy = {}</code> (lời giải Lab 5 làm vậy).</li>
</ul>

<h3>Liên trường: ràng buộc trên cả record</h3>
${MA53_WIN}
${MA53_REC}
${OUT53_WIN}
<p>Ràng buộc mức lớp nhận cả đối tượng. <code>disableDefaultConstraintViolation()</code> cộng <code>addPropertyNode("endAt")</code> dời lỗi từ đối tượng vô danh sang đúng trường người dùng phải sửa — frontend gạch đỏ ô "giờ kết thúc", không phải cả form. Một request có thể sinh nhiều vi phạm (lượt đặt 20:00–00:30 phạm cả thời lượng lẫn giờ mở cửa). <code>initialize()</code> đọc tham số của annotation một lần, nên <code>@BookingWindow(maxMinutes = 120)</code> dùng được cho loại lab khác.</p>

<h3>Validator hỏi CSDL — và cuộc đua nó tạo ra</h3>
${MA53_UNIQ}
<p>Trong demo thì chạy: Spring tạo validator qua factory của chính nó, nên tiêm <code>JdbcClient</code> qua constructor chạy ngay, và request thứ 11 nhận một 400 gọn gàng "email đã được dùng". Giờ gửi mười request cùng lúc, trước hết vào bảng <em>không</em> có ràng buộc unique:</p>
${OUT53_RACE_NOPK}
<p>Mười dòng cho một email. Cả mười validator chạy <code>SELECT count(*)</code> trước khi bất kỳ <code>INSERT</code> nào được commit — kiểm-rồi-làm, đúng cuộc đua của bài 4.5. Có ràng buộc <code>UNIQUE</code> thì CSDL chặn được bản trùng, nhưng không ai dịch lỗi của nó:</p>
${OUT53_RACE_UNIQUE}
<p>Một 201 và chín 500 (log có chín <code>DuplicateKeyException</code> trên <code>students_email_key</code>). Validator làm mã trông an toàn và thêm một truy vấn vào mọi request; nó chưa bao giờ là người gác cổng. Cách sửa giữ validate cho hình dạng và để CSDL quyết định:</p>
${OUT53_RACE_V2}
<p><code>NewStudentV2</code> chỉ có <code>@NotBlank @Email</code>; bộ xử lý ánh xạ <code>DuplicateKeyException</code> sang 409. Mười request song song ⇒ một 201, chín 409, một dòng. Quy tắc:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Trong validator</span><span class="v">Mọi thứ quyết định được chỉ từ request: hình dạng, khoảng giá trị, quan hệ giữa các trường, danh sách cố định.</span></div>
  <div class="kv"><span class="k">Trong service</span><span class="v">Luật cần dữ liệu hiện tại: lab có tồn tại, khung giờ còn trống, còn hạn mức. Ném ngoại lệ nghiệp vụ ⇒ 404/409.</span></div>
  <div class="kv"><span class="k">Trong CSDL</span><span class="v">Bảo đảm cuối cùng: <code>UNIQUE</code>, khoá ngoại, <code>CHECK</code>, ràng buộc loại trừ (Chương 7) — đúng cả khi chạy đồng thời.</span></div>
</div>

<h3>🕵️ Góc hacker — đầu vào người dùng nằm trong mẫu thông báo</h3>
<p>Thông báo của validator là <em>mẫu</em>: <code>{min}</code> được thay bằng tham số, còn <code>\${…}</code> được đánh giá như Jakarta Expression Language. Một validator trông rất tự nhiên dựng thông báo bằng cách nối chuỗi:</p>
${MA53_LABCODE}
${OUT53_EL_MACDINH}
<p>Với Hibernate Validator 9 cấu hình mặc định, không có gì xảy ra: từ bản 6.2 (2021), expression language trong thông báo dựng bằng <code>buildConstraintViolationWithTemplate</code> bị <strong>tắt</strong> mặc định. Nhưng bản cũ thì đánh giá, và cấu hình có thể bị bật lại — ví dụ bởi một nhóm muốn có <code>\${validatedValue}</code> trong thông báo:</p>
${MA53_EL}
${OUT53_EL_BAT}
<p>Giờ người dùng viết mã và server chạy nó: <code>\${1+1}</code> ⇒ <code>2</code>, <code>'ha'.repeat(5)</code> ⇒ <code>hahahahaha</code> — gọi phương thức tuỳ ý trên đối tượng kẻ tấn công tự dựng. <code>'x'.repeat(600000000).length()</code> bắt JVM cấp 600&nbsp;MB và trả 500, log ghi <code>OutOfMemoryError: Java heap space</code>. Những lời gọi như <code>Class.forName</code> bị từ chối ở bản này ("references an unknown method") — đó là biện pháp giảm nhẹ, không phải thiết kế để dựa vào.</p>
${OUT53_EL_SAFE}
<p>Bản an toàn truyền giá trị dưới dạng <strong>tham số thông báo</strong> (<code>addMessageParameter("code", code)</code>, mẫu <code>{code}</code>): tham số được chèn như chữ thường, không bao giờ được thông dịch, kể cả khi EL bật.</p>
<div class="callout warn"><p><strong>Sự cố thật — Netflix Conductor, 2020 (CVE-2020-9296, GitHub Security Lab GHSL-2020-027).</strong> Các validator tuỳ biến của Conductor dựng thông báo vi phạm từ giá trị người dùng điều khiển; với Hibernate Validator thời đó, kẻ tấn công gửi một định nghĩa workflow có trường chứa biểu thức Java EL là chạy được mã từ xa — mức nghiêm trọng (CVSS 9,8), vá ở Conductor 2.25.3. Một lỗi riêng của Hibernate Validator, CVE-2020-10693, cho phép EL không hợp lệ được chế tạo lọt qua bước thoát ký tự vốn để vô hiệu hoá nó. Cùng hình dạng với Equifax (bài 5.2): đầu vào người dùng tới được trình thông dịch qua thông báo lỗi.</p>
<p><strong>Cách phòng:</strong> không bao giờ nối đầu vào người dùng vào mẫu thông báo; dùng <code>addMessageParameter</code>/<code>addExpressionVariable</code>; giữ mức EL mặc định; cập nhật Hibernate Validator.</p></div>

<h3>So với Node.js</h3>
${MA53_ZOD}
<p>zod viết luật liên trường bằng <code>.refine(fn, { path: ['endAt'] })</code> — cùng ý với <code>addPropertyNode</code> (output ở phần so sánh của bài 5.4: <code>endAt: phải sau startAt</code>). Vì schema zod là mã thường, không có chuyện tách annotation/validator và không có mẫu thông báo để tiêm vào. Một <code>refine</code> bất đồng bộ tra CSDL thì có đúng cuộc đua vừa đo.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Thư viện ràng buộc dùng chung:</strong> công ty giữ <code>@StudentId</code>, <code>@VietnamesePhone</code>, <code>@TaxCode</code> trong một module cho mọi service, để luật đổi ở một chỗ.</li>
  <li><strong>Test validator trực tiếp</strong>: <code>Validation.buildDefaultValidatorFactory().getValidator().validate(dto)</code> — không cần context Spring, vài mili giây (Chương 11).</li>
  <li><strong>Dấu hiệu khi review:</strong> một <code>ConstraintValidator</code> nhận repository trong constructor. Hỏi "hai request cùng lúc thì sao?".</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Viết annotation validate tuỳ biến thế nào?"</strong> — annotation có <code>@Constraint(validatedBy)</code> và <code>message/groups/payload</code>; một <code>ConstraintValidator&lt;A, T&gt;</code> với <code>isValid</code> coi null là hợp lệ.</li>
  <li><strong>"Kiểm endDate &gt; startDate thế nào?"</strong> — ràng buộc mức lớp; báo lỗi vào trường bằng <code>buildConstraintViolationWithTemplate(...).addPropertyNode("endDate")</code>.</li>
  <li><strong>"Validator dùng repository được không?"</strong> — Được (Spring tiêm vào), nhưng kiểm unique trong validator bị đua; bảo đảm bằng ràng buộc CSDL và ánh xạ lỗi sang 409.</li>
  <li><strong>"Thông báo validate có rủi ro bảo mật không?"</strong> — EL injection khi nối đầu vào người dùng vào mẫu (CVE-2020-9296); dùng tham số thông báo.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>@VnMobile</code>: mười chữ số bắt đầu bằng <code>03</code>, <code>05</code>, <code>07</code>, <code>08</code> hoặc <code>09</code>; chấp nhận dấu cách và dấu chấm người dùng gõ.</li>
  <li>Viết <code>@PasswordsMatch</code> mức lớp cho DTO đăng ký (<code>password</code>, <code>confirmPassword</code>), báo lỗi vào <code>confirmPassword</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>"090.123.4567"</code> qua, <code>"0123456789"</code> trượt, và mật khẩu không khớp sinh đúng một lỗi ở trường <code>confirmPassword</code> — lỗi không chứa mật khẩu nào.</p></div>
${giai('Xem một lời giải', `${java(`public class VnMobileValidator implements ConstraintValidator<VnMobile, String> {
    private static final Pattern P = Pattern.compile("0[35789]\\\\d{8}");
    public boolean isValid(String v, ConstraintValidatorContext ctx) {
        return v == null || P.matcher(v.replaceAll("[ .]", "")).matches();
    }
}

public class PasswordsMatchValidator implements ConstraintValidator<PasswordsMatch, SignUp> {
    public boolean isValid(SignUp s, ConstraintValidatorContext ctx) {
        if (s == null || s.password() == null || s.password().equals(s.confirmPassword())) return true;
        ctx.disableDefaultConstraintViolation();
        ctx.buildConstraintViolationWithTemplate("không khớp mật khẩu")   // không nối giá trị vào mẫu
           .addPropertyNode("confirmPassword").addConstraintViolation();
        return false;
    }
}`)}
<p>Chuẩn hoá trong validator chỉ để kiểm; hãy lưu số đã chuẩn hoá ở service để CSDL không bao giờ chứa "090.123.4567".</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConstraintValidator</span><span class="v">Lớp quyết định một giá trị (hoặc đối tượng) có thoả ràng buộc không.</span></div>
  <div class="kv"><span class="k">Ràng buộc mức lớp</span><span class="v">Annotation đặt trên kiểu; thấy mọi trường; dùng cho luật liên trường.</span></div>
  <div class="kv"><span class="k">Ràng buộc ghép</span><span class="v">Ràng buộc tạo từ ràng buộc khác (<code>@Pattern</code> trên annotation), có thể kèm <code>@ReportAsSingleViolation</code>.</span></div>
  <div class="kv"><span class="k">Đua kiểm-rồi-làm</span><span class="v">Đọc điều kiện rồi hành động theo nó trong hai bước khi người khác cũng làm vậy.</span></div>
  <div class="kv"><span class="k">EL injection</span><span class="v">Đầu vào người dùng bị đánh giá như biểu thức Expression Language.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Ràng buộc tuỳ biến = annotation + <code>ConstraintValidator</code>; null là hợp lệ; tham số qua <code>initialize</code>.</li>
  <li>Luật liên trường đặt trên lớp và báo lỗi vào trường bằng <code>addPropertyNode</code>.</li>
  <li>Validator tra CSDL cho 10 dòng trùng, hoặc 9 × 500 khi có UNIQUE; ràng buộc CSDL + 409 cho 1 × 201 + 9 × 409.</li>
  <li>Nối đầu vào người dùng vào mẫu thông báo: HV 9 mặc định an toàn, nhưng bật EL thì <code>\${1+1}</code> ⇒ 2 và một OutOfMemoryError (CVE-2020-9296).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#validator-customconstraints', '📘', 'Hibernate Validator — Tạo ràng buộc tuỳ biến', 'Ràng buộc mức lớp, ghép ràng buộc, ConstraintValidatorContext, mức EL.')}
${tl('https://securitylab.github.com/advisories/GHSL-2020-027-netflix-conductor', '🛡', 'GHSL-2020-027 — Netflix Conductor', 'Bản tin: chạy mã từ xa qua Java EL trong thông báo Bean Validation.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: V53App trên Spring Boot 4.1.2, Hibernate Validator 9.1.5.Final, PostgreSQL 16 (19/11/2026).</li>
  <li>GitHub Security Lab, GHSL-2020-027; bản tin bảo mật Netflix NFLX-2020-001; NVD CVE-2020-9296 và CVE-2020-10693.</li>
</ul>
</div>
`;

// ===== Bài 5.4 =====
const MA54_GROUPS = java("// Nhóm validate: chỉ là interface rỗng dùng làm nhãn\npublic interface Groups {\n    interface OnCreate { }                       // KHÔNG kế thừa Default\n    interface OnUpdate { }\n    interface OnCreateFixed extends Default { }  // kế thừa Default ⇒ ràng buộc không ghi group vẫn được kiểm\n}");
const MA54_DTO = java("// MỘT DTO cho cả tạo mới lẫn cập nhật, phân biệt bằng group\npublic record LabDto(\n        @Null(groups = {Groups.OnCreate.class, Groups.OnCreateFixed.class}) @NotNull(groups = Groups.OnUpdate.class) Long id,\n        @NotBlank @Size(max = 10) String code,\n        @NotBlank @Size(max = 60) String name,\n        @NotNull @Min(1) @Max(200) Integer capacity) {\n}");
const OUT54_GROUP = out("$ curl -X POST localhost:41870/g/labs -H 'Content-Type: application/json' -d '{\"id\":7,\"code\":\"SEC-04\",\"name\":\"Lab ATTT\",\"capacity\":40}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/g/labs\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"id\",\"message\":\"must be null\"}]}\n[HTTP 400]\n\n$ curl -X POST localhost:41870/g/labs -H 'Content-Type: application/json' -d '{\"code\":\"\",\"name\":\"   \"}'\n{\"id\":2,\"code\":\"\",\"name\":\"   \",\"capacity\":0,\"note\":null}\n[HTTP 201]\n\n$ curl -X POST localhost:41870/g2/labs -H 'Content-Type: application/json' -d '{\"code\":\"\",\"name\":\"   \"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/g2/labs\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"capacity\",\"message\":\"must not be null\"},{\"field\":\"code\",\"message\":\"must not be blank\"},{\"field\":\"name\",\"message\":\"must not be blank\"}]}\n[HTTP 400]");
const MA54_REQS = java("// TÁCH DTO: mỗi thao tác một kiểu, mỗi kiểu chỉ có trường được phép đổi\npublic interface LabRequests {\n    record CreateLab(@NotBlank @Size(max = 10) String code, @NotBlank @Size(max = 60) String name,\n                     @NotNull @Min(1) @Max(200) Integer capacity) { }\n\n    // PUT: thay toàn bộ — mọi trường bắt buộc; không có code (mã lab không đổi được)\n    record ReplaceLab(@NotBlank @Size(max = 60) String name, @NotNull @Min(1) @Max(200) Integer capacity,\n                      @Size(max = 200) String note) { }\n\n    // PATCH ngây thơ: null nghĩa là \"không gửi\" ⇒ không có cách xoá note\n    record NaivePatch(@Size(max = 60) String name, @Min(1) @Max(200) Integer capacity, @Size(max = 200) String note) { }\n\n    // Thử dùng record + Optional cho PATCH: Jackson 3 điền Optional.empty() cả khi trường VẮNG MẶT ⇒ hỏng\n    record PatchLabRecord(Optional<@NotBlank @Size(max = 60) String> name,\n                    Optional<@NotNull @Min(1) @Max(200) Integer> capacity,\n                    Optional<@Size(max = 200) String> note) { }\n\n    // PATCH ba trạng thái — lớp có setter: null = không gửi · Optional.empty() = gửi null · Optional.of(x) = gửi giá trị\n    final class PatchLab {\n        private Optional<@NotBlank @Size(max = 60) String> name;\n        private Optional<@NotNull @Min(1) @Max(200) Integer> capacity;\n        private Optional<@Size(max = 200) String> note;\n\n        public Optional<String> getName() { return name; }\n        public void setName(Optional<String> name) { this.name = name; }\n        public Optional<Integer> getCapacity() { return capacity; }\n        public void setCapacity(Optional<Integer> capacity) { this.capacity = capacity; }\n        public Optional<String> getNote() { return note; }\n        public void setNote(Optional<String> note) { this.note = note; }\n    }\n}");
const OUT54_TACH = out("$ curl -X POST localhost:41870/labs -H 'Content-Type: application/json' -d '{\"id\":7,\"code\":\"SEC-04\",\"name\":\"Lab ATTT\",\"capacity\":40}'\n{\"id\":2,\"code\":\"SEC-04\",\"name\":\"Lab ATTT\",\"capacity\":40,\"note\":null}\n[HTTP 201]\n\n$ curl -X PUT localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"name\":\"Lab IoT\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/1\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"capacity\",\"message\":\"must not be null\"}]}\n[HTTP 400]\n\n$ curl -X PUT localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"code\":\"HACK\",\"name\":\"Lab IoT\",\"capacity\":30}'\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":30,\"note\":null}\n[HTTP 200]");
const OUT54_PATCH = out("$ curl localhost:41870/labs/1\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":30,\"note\":\"Mang thẻ sinh viên\"}\n[HTTP 200]\n\n$ curl -X PATCH localhost:41870/naive/labs/1 -H 'Content-Type: application/json' -d '{\"note\":null}'\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":30,\"note\":\"Mang thẻ sinh viên\"}\n[HTTP 200]\n\n$ curl -X PATCH localhost:41870/record/labs/1 -H 'Content-Type: application/json' -d '{\"capacity\":35}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/record/labs/1\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"name\",\"message\":\"must not be blank\"}]}\n[HTTP 400]\n\n$ curl -X PATCH localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"capacity\":35}'\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":35,\"note\":\"Mang thẻ sinh viên\"}\n[HTTP 200]\n\n$ curl -X PATCH localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"note\":null}'\n{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":35,\"note\":null}\n[HTTP 200]\n\n$ curl -X PATCH localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"name\":null}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/1\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"name\",\"message\":\"must not be blank\"}]}\n[HTTP 400]\n\n$ curl -X PATCH localhost:41870/labs/1 -H 'Content-Type: application/json' -d '{\"name\":\"\",\"capacity\":0}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/labs/1\",\"status\":400,\"title\":\"Bad Request\",\"errors\":[{\"field\":\"capacity\",\"message\":\"must be greater than or equal to 1\"},{\"field\":\"name\",\"message\":\"must not be blank\"}]}\n[HTTP 400]");
const MA54_ECHO = java("// Jackson 3 điền gì vào trường Optional của record khi trường vắng mặt / null / có giá trị?\n@RestController\npublic class EchoApi {\n    public record P(Optional<String> note) { }\n\n    public static class Q {\n        private Optional<String> note;   // lớp có setter: Jackson chỉ gọi setter khi trường CÓ trong JSON\n        public Optional<String> getNote() { return note; }\n        public void setNote(Optional<String> note) { this.note = note; }\n    }\n\n    static String show(Optional<String> o) {\n        return o == null ? \"null (không gửi)\" : o.isEmpty() ? \"Optional.empty() (gửi null)\" : \"Optional[\" + o.get() + \"]\";\n    }\n\n    @PostMapping(\"/echo/record\")\n    public String rec(@RequestBody P p) { return \"record: note = \" + show(p.note()); }\n\n    @PostMapping(\"/echo/class\")\n    public String cls(@RequestBody Q q) { return \"class:  note = \" + show(q.getNote()); }\n}");
const MA54_BIND = java("// @ModelAttribute: Spring gán tham số query/form vào đối tượng theo TÊN THUỘC TÍNH — kể cả thuộc tính lồng nhau\n@RestController\npublic class BindApi {\n    public static class Account {\n        private String name = \"lan\";\n        private String role = \"STUDENT\";\n        public String getName() { return name; }\n        public void setName(String name) { this.name = name; }\n        public String getRole() { return role; }\n        public void setRole(String role) { this.role = role; }\n    }\n\n    // JavaBean có setter: binder đi theo đường a.b.c trong tên tham số\n    public static class BookingForm {\n        private Long labId;\n        private String note;\n        private Account owner = new Account();   // ví dụ: lấy từ phiên đăng nhập rồi gắn vào form cho tiện\n        public Long getLabId() { return labId; }\n        public void setLabId(Long labId) { this.labId = labId; }\n        public String getNote() { return note; }\n        public void setNote(String note) { this.note = note; }\n        public Account getOwner() { return owner; }\n        public void setOwner(Account owner) { this.owner = owner; }\n    }\n\n    // record: binder gọi constructor với đúng các tham số khai báo, tên lạ bị bỏ qua\n    public record BookingFormRecord(Long labId, String note) { }\n\n    @PostMapping(\"/form/bean\")\n    public BookingForm bean(@ModelAttribute BookingForm f) {\n        return f;\n    }\n\n    @PostMapping(\"/form/record\")\n    public BookingFormRecord record(@ModelAttribute BookingFormRecord f) {\n        return f;\n    }\n}");
const OUT54_BIND = out("$ curl -X POST localhost:41870/form/bean -d 'labId=1&note=mang+laptop'\n{\"labId\":1,\"note\":\"mang laptop\",\"owner\":{\"name\":\"lan\",\"role\":\"STUDENT\"}}\n[HTTP 200]\n\n$ curl -X POST localhost:41870/form/bean -d 'labId=1&note=mang+laptop&owner.role=ADMIN&owner.name=admin'\n{\"labId\":1,\"note\":\"mang laptop\",\"owner\":{\"name\":\"admin\",\"role\":\"ADMIN\"}}\n[HTTP 200]\n\n$ curl -X POST localhost:41870/form/record -d 'labId=1&note=mang+laptop&owner.role=ADMIN'\n{\"labId\":1,\"note\":\"mang laptop\"}\n[HTTP 200]");
const MA54_ZOD = js("const Lab = z.object({ name: z.string().trim().min(1).max(60), capacity: z.number().int().min(1).max(200), note: z.string().max(200).nullable() });\nconst Patch = Lab.partial().strict();   // mọi trường thành tuỳ chọn; trường lạ ⇒ lỗi\n\nconst show = (r) => (r.success ? JSON.stringify(r.data) : JSON.stringify(r.error.issues.map((i) => `${i.path.join('.') || '(gốc)'}: ${i.message}`)));\nconsole.log('refine  ', show(Booking.safeParse({ studentId: 'SE180123', startAt: '2030-01-15T10:00:00', endAt: '2030-01-15T08:00:00' })));\nfor (const body of ['{\"capacity\":35}', '{\"note\":null}', '{\"name\":null}', '{\"code\":\"HACK\"}']) {\n  const r = Patch.safeParse(JSON.parse(body));\n  console.log(body.padEnd(17), show(r), r.success ? `· có khoá note? ${'note' in r.data}` : '');\n}");
const OUT54_NODE = out("refine   [\"endAt: phải sau startAt\"]\n{\"capacity\":35}   {\"capacity\":35} · có khoá note? false\n{\"note\":null}     {\"note\":null} · có khoá note? true\n{\"name\":null}     [\"name: Invalid input: expected string, received null\"] \n{\"code\":\"HACK\"}   [\"(gốc): Unrecognized key: \\\"code\\\"\"]");

const L54_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Create vs update: groups or separate DTOs</h2>
<p class="lead">Creating a lab and editing a lab look like the same data, so it is tempting to use one DTO for both. They are not the same contract: on create the client must not send an <code>id</code>, on update the <code>code</code> must not change, and a partial edit must tell "I did not send <code>note</code>" apart from "I want <code>note</code> cleared". We try the two standard answers — validation <strong>groups</strong> on one DTO, and <strong>separate DTOs</strong> — and hit three real traps: a group that silently skips every ordinary constraint, a <code>PATCH</code> that cannot clear a field, and Jackson 3 filling <code>Optional</code> record components with <code>Optional.empty()</code> when the field is absent. The hacker corner binds a form to an object graph and becomes admin with one query parameter — the mechanism behind Spring4Shell.</p>

<h3>In everyday life first</h3>
<p>The Alpha building uses two forms: "register a new lab" and "change lab details". The second has no box for the lab code — it is printed on the door and never changes. Someone tried to save paper with one form and a note "for changes, leave the code empty"; within a week a lab had been renamed by a clerk who wrote a new code in the box. Separate forms make the rule visible; a note on a shared form relies on everyone reading it.</p>

<h3>Option 1 — one DTO, validation groups</h3>
${MA54_GROUPS}
${MA54_DTO}
${OUT54_GROUP}
<p>The first request behaves: <code>id</code> on create is refused by <code>@Null(groups = OnCreate.class)</code>. The second one is the trap — an empty code, a blank name and no capacity were <strong>accepted (201)</strong>. <code>@Validated(OnCreate.class)</code> validates <em>only</em> the <code>OnCreate</code> group; constraints without a <code>groups</code> attribute belong to <code>Default</code>, which was not requested. The fix is one word — <code>interface OnCreateFixed extends Default</code> — and the third request is rejected with three errors. Note also that groups need Spring's <code>@Validated</code> (the Jakarta <code>@Valid</code> has no group parameter).</p>

<h3>Option 2 — one DTO per operation</h3>
${MA54_REQS}
${OUT54_TACH}
<ul>
  <li><strong>Create</strong> has no <code>id</code> field at all, so a client-sent <code>id</code> is simply ignored (Boot's Jackson does not fail on unknown properties — lesson 4.2 shows how to make it fail).</li>
  <li><strong>PUT replaces</strong>: every field required (<code>capacity</code> missing ⇒ 400), <code>code</code> not in the type so <code>"code":"HACK"</code> has no effect — and <code>note</code>, not sent, became <code>null</code>. That is correct PUT semantics: the body <em>is</em> the new state.</li>
</ul>

<h3>PATCH: three states, not two</h3>
<p>A partial update must distinguish: field absent (keep), field <code>null</code> (clear), field with a value (set). Measured on the lab whose note is "Mang thẻ sinh viên":</p>
${OUT54_PATCH}
<ol>
  <li><strong>Naive PATCH</strong> (<code>String note</code>, "if not null then set"): <code>{"note":null}</code> answered 200 but the note is still there — the user can never clear it.</li>
  <li><strong>Record with <code>Optional</code> components</strong>: <code>{"capacity":35}</code> failed with "name must not be blank" although no name was sent. Jackson 3 gives an absent <code>Optional</code> creator property the value <code>Optional.empty()</code> — exactly the same as an explicit <code>null</code>:</li>
</ol>
${MA54_ECHO}
${out(`{}             record: note = Optional.empty() (gửi null)
{"note":null}  record: note = Optional.empty() (gửi null)
{"note":"x"}   record: note = Optional[x]
{}             class:  note = null (không gửi)
{"note":null}  class:  note = Optional.empty() (gửi null)
{"note":"x"}   class:  note = Optional[x]`)}
<ol start="3">
  <li><strong>A class with setters</strong> (<code>PatchLab</code> above): Jackson calls a setter only for properties present in the JSON, so the field stays <code>null</code> when absent. Three states: <code>null</code> keep, <code>Optional.empty()</code> clear, <code>Optional.of(x)</code> set. <code>{"capacity":35}</code> ⇒ only capacity changed; <code>{"note":null}</code> ⇒ note cleared; <code>{"name":null}</code> ⇒ 400 because the name may be changed but not removed (<code>Optional&lt;@NotBlank String&gt;</code>); invalid values still give field errors.</li>
</ol>
<p>Alternatives used in industry: <code>JsonNullable&lt;T&gt;</code> from the openapi-generator ecosystem (same three states), or JSON Merge Patch (RFC 7396, <code>application/merge-patch+json</code>) applied to the current representation and then validated as a whole.</p>

<h3>Which one?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Groups</span><span class="v">Fewer classes; fine when create and update differ by one or two rules. Costs: the <code>Default</code> trap, every reader must know which group runs, one type exposes fields some operations must ignore.</span></div>
  <div class="kv"><span class="k">Separate DTOs</span><span class="v">The type <em>is</em> the contract: a field that cannot change is not there. Clearer OpenAPI docs (Chapter 12), no trap. Costs: more small records. The default choice in most teams.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Its own type with three-state fields, or Merge Patch. Never reuse the PUT DTO.</span></div>
</div>

<h3>🕵️ Hacker corner — binding a form to an object graph</h3>
<p><code>@RequestBody</code> uses Jackson; forms and query strings use Spring's <em>data binder</em> with <code>@ModelAttribute</code>. The binder sets properties by name — and follows dots into nested objects:</p>
${MA54_BIND}
${OUT54_BIND}
<p>The form only intended <code>labId</code> and <code>note</code>, but because <code>BookingForm</code> exposes <code>getOwner()</code> and <code>Account</code> has <code>setRole</code>, the parameter <code>owner.role=ADMIN</code> walked the object graph and promoted the student. The record version uses <strong>constructor binding</strong>: only its declared components are bound, <code>owner.role</code> is ignored.</p>
<div class="callout warn"><p><strong>Real incident — Spring4Shell, March 2022 (CVE-2022-22965).</strong> The same mechanism, one step further: every Java object has <code>getClass()</code>, so on JDK 9+ a parameter like <code>class.module.classLoader.resources.context.parent.pipeline.first.pattern=…</code> walked from a form object into Tomcat's logging configuration, wrote a JSP web shell to disk and gave remote code execution. Spring fixed it on 31 March 2022 (5.3.18 / 5.2.20) by refusing those paths; CISA added it to its Known Exploited Vulnerabilities list days later.</p>
<p><strong>How to prevent it:</strong> bind into records or dedicated form classes with only the fields you accept; never put session or security objects on a bindable object; with JavaBeans, restrict with <code>@InitBinder</code> + <code>setAllowedFields</code>; keep Spring patched.</p></div>

<h3>Compared with Node.js</h3>
${MA54_ZOD}
${OUT54_NODE}
<p>JavaScript has two "nothing" values, so the three PATCH states come for free: an absent key is <code>undefined</code> (<code>'note' in data</code> is false), an explicit <code>null</code> stays <code>null</code>. zod's <code>.partial()</code> derives the PATCH schema from the create schema, <code>.strict()</code> rejects <code>code</code> outright (Spring silently ignored it), and <code>.refine</code> attaches the cross-field error to <code>endAt</code>. Java needs a deliberate design for what JavaScript gets from the language.</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>Mobile apps send PATCH</strong> to save bandwidth; a bug where "clearing the note does nothing" is almost always the naive null check.</li>
  <li><strong>Admin vs self-service:</strong> <code>AdminUpdateLab</code> (may change <code>code</code>) and <code>UpdateLab</code> are different types — authorisation is then visible in the signature (Chapter 9).</li>
  <li><strong>Review flag:</strong> <code>@Validated(Something.class)</code> where <code>Something</code> does not extend <code>Default</code>; a PATCH handler with <code>if (x != null)</code>.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What are validation groups?"</strong> — Marker interfaces that select which constraints run; activated with <code>@Validated(Group.class)</code>; constraints without groups are in <code>Default</code>.</li>
  <li><strong>"Groups or separate DTOs?"</strong> — Separate DTOs make each operation's contract explicit and avoid the Default-group trap; groups only for tiny differences.</li>
  <li><strong>"PUT vs PATCH?"</strong> — PUT replaces the whole resource (idempotent); PATCH applies a partial change and must distinguish absent from null.</li>
  <li><strong>"How do you tell absent from null in Java?"</strong> — Setter-based class with <code>Optional</code> fields, <code>JsonNullable</code>, or JSON Merge Patch on a <code>JsonNode</code>.</li>
  <li><strong>"What was Spring4Shell?"</strong> — Data binding walked <code>class.module.classLoader</code> to Tomcat's configuration ⇒ RCE (CVE-2022-22965); fixed in 5.3.18.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add <code>PATCH /bookings/{id}</code> for LabFlow bookings: the student may change <code>startAt</code>/<code>endAt</code> and clear or set <code>note</code>; nobody may change <code>labId</code> or <code>studentId</code> through this endpoint.</li>
  <li>The time rules of lesson 5.3 must still hold after the patch is applied.</li>
</ol>
<p><strong>Done when:</strong> <code>{"note":null}</code> clears the note, <code>{"endAt":…}</code> earlier than the stored start gives 400 on <code>endAt</code>, and <code>{"labId":2}</code> is either ignored or rejected — your choice, documented.</p></div>
${giai('Show one solution', `${java(`public final class PatchBooking {          // lớp có setter: phân biệt vắng mặt / null
    private Optional<LocalDateTime> startAt, endAt;
    private Optional<@Size(max = 200) String> note;
    // getter + setter cho từng trường …
}

// service: áp bản vá lên trạng thái hiện tại rồi validate CẢ đối tượng kết quả
Booking merged = new Booking(old.labId(), old.studentId(),
        p.getStartAt() == null ? old.startAt() : p.getStartAt().orElseThrow(),
        p.getEndAt() == null ? old.endAt() : p.getEndAt().orElseThrow(),
        p.getNote() == null ? old.note() : p.getNote().orElse(null));
var errors = validator.validate(merged);   // @BookingWindow chạy trên kết quả
if (!errors.isEmpty()) throw new ConstraintViolationException(errors);`)}
<p>Cross-field rules must be checked on the <em>merged</em> result: the patch alone may contain only <code>endAt</code>. Map <code>ConstraintViolationException</code> to 400 in the advice. Rejecting unknown fields (<code>labId</code>) needs <code>@JsonIgnoreProperties(ignoreUnknown = false)</code> on the class.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Validation group</span><span class="v">Marker interface selecting a subset of constraints.</span></div>
  <div class="kv"><span class="k">Default group</span><span class="v">Where constraints without <code>groups</code> live; not run when another group is requested unless extended.</span></div>
  <div class="kv"><span class="k">PUT / PATCH</span><span class="v">Full replacement / partial modification.</span></div>
  <div class="kv"><span class="k">JSON Merge Patch</span><span class="v">RFC 7396: a JSON document whose keys set values and whose <code>null</code>s delete.</span></div>
  <div class="kv"><span class="k">Data binding</span><span class="v">Spring setting object properties from request parameters by name.</span></div>
  <div class="kv"><span class="k">Constructor binding</span><span class="v">Binding into a record/constructor: only declared parameters.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A group that does not extend <code>Default</code> skipped every ordinary constraint: blank data got 201.</li>
  <li>Separate DTOs make the contract visible: create without <code>id</code>, PUT without <code>code</code>, PATCH with three-state fields.</li>
  <li>Measured: naive PATCH cannot clear; Jackson 3 records turn absent <code>Optional</code> into <code>Optional.empty()</code>; a setter-based class works.</li>
  <li>Binding a JavaBean graph let <code>owner.role=ADMIN</code> through; records bind only their components (Spring4Shell, 2022).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.rfc-editor.org/rfc/rfc7396', '📜', 'RFC 7396 — JSON Merge Patch', 'The simplest standard for partial updates and its null semantics.')}
${tl('https://spring.io/security/cve-2022-22965', '🍃', 'Spring — CVE-2022-22965 (Spring4Shell)', 'The advisory, affected versions and data-binding mitigations.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: V54App on Spring Boot 4.1.2 / Jackson 3, Hibernate Validator 9.1.5.Final; zod 4.6.7 on Node 22 (19/11/2026).</li>
  <li>spring.io, "Spring Framework RCE, Early Announcement" (31/03/2022) and CVE-2022-22965 advisory; CISA Known Exploited Vulnerabilities catalog.</li>
</ul>
</div>
`;

const L54_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Tạo mới vs cập nhật: group hay tách DTO</h2>
<p class="lead">Tạo một lab và sửa một lab trông như cùng dữ liệu, nên rất dễ dùng một DTO cho cả hai. Nhưng đó không phải cùng một hợp đồng: khi tạo, client không được gửi <code>id</code>; khi sửa, <code>code</code> không được đổi; và sửa một phần phải phân biệt "tôi không gửi <code>note</code>" với "tôi muốn xoá <code>note</code>". Ta thử hai lời giải chuẩn — <strong>group</strong> validate trên một DTO, và <strong>tách DTO</strong> — rồi gặp ba cái bẫy thật: một group âm thầm bỏ qua mọi ràng buộc thường, một <code>PATCH</code> không xoá được trường, và Jackson 3 điền <code>Optional.empty()</code> vào thành phần <code>Optional</code> của record khi trường vắng mặt. Góc hacker gán một form vào cả đồ thị đối tượng và lên admin bằng một tham số query — đúng cơ chế đứng sau Spring4Shell.</p>

<h3>Đời thường trước đã</h3>
<p>Toà Alpha dùng hai mẫu phiếu: "đăng ký lab mới" và "sửa thông tin lab". Phiếu thứ hai không có ô mã lab — mã in trên cửa và không bao giờ đổi. Có người muốn tiết kiệm giấy, dùng một phiếu chung kèm ghi chú "khi sửa thì để trống ô mã"; một tuần sau, một lab bị đổi mã vì có nhân viên viết mã mới vào ô đó. Phiếu riêng làm luật hiện ra trước mắt; ghi chú trên phiếu chung thì trông chờ mọi người đều đọc.</p>

<h3>Cách 1 — một DTO, dùng group</h3>
${MA54_GROUPS}
${MA54_DTO}
${OUT54_GROUP}
<p>Request đầu chạy đúng: <code>id</code> khi tạo bị <code>@Null(groups = OnCreate.class)</code> từ chối. Request thứ hai là cái bẫy — mã rỗng, tên trống và không có sức chứa vẫn <strong>được nhận (201)</strong>. <code>@Validated(OnCreate.class)</code> <em>chỉ</em> kiểm group <code>OnCreate</code>; ràng buộc không ghi <code>groups</code> thuộc về <code>Default</code>, mà group này không được yêu cầu. Sửa bằng đúng một chữ — <code>interface OnCreateFixed extends Default</code> — và request thứ ba bị từ chối với ba lỗi. Để ý thêm: group cần <code>@Validated</code> của Spring (<code>@Valid</code> của Jakarta không có tham số group).</p>

<h3>Cách 2 — mỗi thao tác một DTO</h3>
${MA54_REQS}
${OUT54_TACH}
<ul>
  <li><strong>Tạo mới</strong> không hề có trường <code>id</code>, nên <code>id</code> client gửi bị bỏ qua (Jackson của Boot không báo lỗi với thuộc tính lạ — bài 4.2 chỉ cách bật báo lỗi).</li>
  <li><strong>PUT thay thế</strong>: mọi trường bắt buộc (thiếu <code>capacity</code> ⇒ 400), <code>code</code> không có trong kiểu nên <code>"code":"HACK"</code> vô tác dụng — còn <code>note</code> không gửi thì thành <code>null</code>. Đó là ngữ nghĩa PUT đúng: body <em>chính là</em> trạng thái mới.</li>
</ul>

<h3>PATCH: ba trạng thái chứ không phải hai</h3>
<p>Sửa một phần phải phân biệt: trường vắng mặt (giữ nguyên), trường <code>null</code> (xoá), trường có giá trị (gán). Đo trên lab có ghi chú "Mang thẻ sinh viên":</p>
${OUT54_PATCH}
<ol>
  <li><strong>PATCH ngây thơ</strong> (<code>String note</code>, "khác null thì gán"): <code>{"note":null}</code> trả 200 nhưng ghi chú vẫn còn — người dùng không bao giờ xoá được.</li>
  <li><strong>Record có thành phần <code>Optional</code></strong>: <code>{"capacity":35}</code> bị từ chối "name must not be blank" dù không hề gửi name. Jackson 3 gán cho thuộc tính <code>Optional</code> vắng mặt của constructor giá trị <code>Optional.empty()</code> — y hệt khi gửi <code>null</code>:</li>
</ol>
${MA54_ECHO}
${out(`{}             record: note = Optional.empty() (gửi null)
{"note":null}  record: note = Optional.empty() (gửi null)
{"note":"x"}   record: note = Optional[x]
{}             class:  note = null (không gửi)
{"note":null}  class:  note = Optional.empty() (gửi null)
{"note":"x"}   class:  note = Optional[x]`)}
<ol start="3">
  <li><strong>Lớp có setter</strong> (<code>PatchLab</code> ở trên): Jackson chỉ gọi setter cho thuộc tính có mặt trong JSON, nên trường giữ <code>null</code> khi vắng. Ba trạng thái: <code>null</code> giữ, <code>Optional.empty()</code> xoá, <code>Optional.of(x)</code> gán. <code>{"capacity":35}</code> ⇒ chỉ đổi sức chứa; <code>{"note":null}</code> ⇒ xoá ghi chú; <code>{"name":null}</code> ⇒ 400 vì tên được đổi nhưng không được bỏ (<code>Optional&lt;@NotBlank String&gt;</code>); giá trị sai vẫn ra lỗi từng trường.</li>
</ol>
<p>Lựa chọn khác trong thực tế: <code>JsonNullable&lt;T&gt;</code> của hệ openapi-generator (cùng ba trạng thái), hoặc JSON Merge Patch (RFC 7396, <code>application/merge-patch+json</code>) áp lên biểu diễn hiện tại rồi validate cả khối.</p>

<h3>Chọn cách nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Group</span><span class="v">Ít lớp; ổn khi tạo và sửa chỉ khác một hai luật. Cái giá: bẫy <code>Default</code>, người đọc phải biết group nào chạy, một kiểu phơi ra những trường mà vài thao tác phải lờ đi.</span></div>
  <div class="kv"><span class="k">Tách DTO</span><span class="v">Kiểu dữ liệu <em>chính là</em> hợp đồng: trường không được đổi thì không có mặt. Tài liệu OpenAPI rõ hơn (Chương 12), không có bẫy. Cái giá: thêm vài record nhỏ. Lựa chọn mặc định ở đa số nhóm.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Kiểu riêng với trường ba trạng thái, hoặc Merge Patch. Không bao giờ dùng lại DTO của PUT.</span></div>
</div>

<h3>🕵️ Góc hacker — gán form vào cả đồ thị đối tượng</h3>
<p><code>@RequestBody</code> dùng Jackson; form và query string dùng <em>data binder</em> của Spring qua <code>@ModelAttribute</code>. Binder gán thuộc tính theo tên — và đi theo dấu chấm vào đối tượng lồng:</p>
${MA54_BIND}
${OUT54_BIND}
<p>Form chỉ định nhận <code>labId</code> và <code>note</code>, nhưng vì <code>BookingForm</code> có <code>getOwner()</code> và <code>Account</code> có <code>setRole</code>, tham số <code>owner.role=ADMIN</code> đi xuyên đồ thị đối tượng và phong sinh viên lên admin. Bản record dùng <strong>gán qua constructor</strong>: chỉ các thành phần đã khai báo được gán, <code>owner.role</code> bị bỏ qua.</p>
<div class="callout warn"><p><strong>Sự cố thật — Spring4Shell, 03/2022 (CVE-2022-22965).</strong> Cùng cơ chế, đi xa thêm một bước: mọi đối tượng Java đều có <code>getClass()</code>, nên trên JDK 9+ một tham số kiểu <code>class.module.classLoader.resources.context.parent.pipeline.first.pattern=…</code> đi từ đối tượng form vào cấu hình ghi log của Tomcat, ghi một web shell JSP xuống đĩa và cho chạy mã từ xa. Spring vá ngày 31/03/2022 (5.3.18 / 5.2.20) bằng cách chặn các đường đó; vài ngày sau CISA đưa nó vào danh sách lỗ hổng đang bị khai thác.</p>
<p><strong>Cách phòng:</strong> gán vào record hoặc lớp form riêng chỉ có trường bạn nhận; không bao giờ đặt đối tượng phiên hay bảo mật lên đối tượng có thể gán; với JavaBean, giới hạn bằng <code>@InitBinder</code> + <code>setAllowedFields</code>; cập nhật Spring kịp thời.</p></div>

<h3>So với Node.js</h3>
${MA54_ZOD}
${OUT54_NODE}
<p>JavaScript có hai giá trị "không có", nên ba trạng thái của PATCH có sẵn: khoá vắng mặt là <code>undefined</code> (<code>'note' in data</code> là false), <code>null</code> gửi rõ thì giữ <code>null</code>. <code>.partial()</code> của zod sinh schema PATCH từ schema tạo mới, <code>.strict()</code> từ chối thẳng <code>code</code> (Spring thì lặng lẽ bỏ qua), và <code>.refine</code> gắn lỗi liên trường vào <code>endAt</code>. Thứ JavaScript có sẵn từ ngôn ngữ thì Java phải thiết kế có chủ ý.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Ứng dụng di động gửi PATCH</strong> để tiết kiệm băng thông; lỗi "xoá ghi chú không ăn" gần như luôn là phép kiểm null ngây thơ.</li>
  <li><strong>Quản trị và tự phục vụ:</strong> <code>AdminUpdateLab</code> (được đổi <code>code</code>) và <code>UpdateLab</code> là hai kiểu khác nhau — phân quyền hiện ngay trong chữ ký hàm (Chương 9).</li>
  <li><strong>Dấu hiệu khi review:</strong> <code>@Validated(Something.class)</code> mà <code>Something</code> không kế thừa <code>Default</code>; handler PATCH có <code>if (x != null)</code>.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Validation group là gì?"</strong> — Interface đánh dấu dùng để chọn nhóm ràng buộc sẽ chạy; kích hoạt bằng <code>@Validated(Group.class)</code>; ràng buộc không ghi group thuộc <code>Default</code>.</li>
  <li><strong>"Group hay tách DTO?"</strong> — Tách DTO làm hợp đồng của từng thao tác rõ ràng và tránh bẫy Default; group chỉ dùng khi khác biệt rất nhỏ.</li>
  <li><strong>"PUT khác PATCH?"</strong> — PUT thay toàn bộ tài nguyên (idempotent); PATCH áp thay đổi một phần và phải phân biệt vắng mặt với null.</li>
  <li><strong>"Trong Java phân biệt vắng mặt với null thế nào?"</strong> — Lớp có setter với trường <code>Optional</code>, <code>JsonNullable</code>, hoặc JSON Merge Patch trên <code>JsonNode</code>.</li>
  <li><strong>"Spring4Shell là gì?"</strong> — Data binding đi qua <code>class.module.classLoader</code> tới cấu hình Tomcat ⇒ chạy mã từ xa (CVE-2022-22965); vá ở 5.3.18.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>PATCH /bookings/{id}</code> cho lượt đặt LabFlow: sinh viên được đổi <code>startAt</code>/<code>endAt</code> và xoá hoặc gán <code>note</code>; không ai được đổi <code>labId</code> hay <code>studentId</code> qua endpoint này.</li>
  <li>Các luật giờ giấc của bài 5.3 vẫn phải đúng sau khi áp bản vá.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>{"note":null}</code> xoá được ghi chú, <code>{"endAt":…}</code> sớm hơn giờ bắt đầu đã lưu cho 400 ở <code>endAt</code>, và <code>{"labId":2}</code> hoặc bị bỏ qua hoặc bị từ chối — tuỳ bạn chọn, có ghi tài liệu.</p></div>
${giai('Xem một lời giải', `${java(`public final class PatchBooking {          // lớp có setter: phân biệt vắng mặt / null
    private Optional<LocalDateTime> startAt, endAt;
    private Optional<@Size(max = 200) String> note;
    // getter + setter cho từng trường …
}

// service: áp bản vá lên trạng thái hiện tại rồi validate CẢ đối tượng kết quả
Booking merged = new Booking(old.labId(), old.studentId(),
        p.getStartAt() == null ? old.startAt() : p.getStartAt().orElseThrow(),
        p.getEndAt() == null ? old.endAt() : p.getEndAt().orElseThrow(),
        p.getNote() == null ? old.note() : p.getNote().orElse(null));
var errors = validator.validate(merged);   // @BookingWindow chạy trên kết quả
if (!errors.isEmpty()) throw new ConstraintViolationException(errors);`)}
<p>Luật liên trường phải kiểm trên kết quả <em>đã gộp</em>: bản vá có thể chỉ chứa <code>endAt</code>. Ánh xạ <code>ConstraintViolationException</code> sang 400 trong advice. Muốn từ chối trường lạ (<code>labId</code>) thì đặt <code>@JsonIgnoreProperties(ignoreUnknown = false)</code> trên lớp.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Validation group</span><span class="v">Interface đánh dấu chọn một tập con ràng buộc.</span></div>
  <div class="kv"><span class="k">Group Default</span><span class="v">Nơi chứa ràng buộc không ghi <code>groups</code>; không chạy khi yêu cầu group khác trừ khi được kế thừa.</span></div>
  <div class="kv"><span class="k">PUT / PATCH</span><span class="v">Thay toàn bộ / sửa một phần.</span></div>
  <div class="kv"><span class="k">JSON Merge Patch</span><span class="v">RFC 7396: một tài liệu JSON có khoá để gán giá trị và <code>null</code> để xoá.</span></div>
  <div class="kv"><span class="k">Data binding</span><span class="v">Spring gán thuộc tính đối tượng từ tham số request theo tên.</span></div>
  <div class="kv"><span class="k">Gán qua constructor</span><span class="v">Gán vào record/constructor: chỉ các tham số đã khai báo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Group không kế thừa <code>Default</code> bỏ qua mọi ràng buộc thường: dữ liệu trống được 201.</li>
  <li>Tách DTO làm hợp đồng hiện rõ: tạo mới không có <code>id</code>, PUT không có <code>code</code>, PATCH có trường ba trạng thái.</li>
  <li>Đo thật: PATCH ngây thơ không xoá được; record trong Jackson 3 biến <code>Optional</code> vắng mặt thành <code>Optional.empty()</code>; lớp có setter thì đúng.</li>
  <li>Gán đồ thị JavaBean để lọt <code>owner.role=ADMIN</code>; record chỉ gán đúng thành phần của nó (Spring4Shell, 2022).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.rfc-editor.org/rfc/rfc7396', '📜', 'RFC 7396 — JSON Merge Patch', 'Chuẩn đơn giản nhất cho cập nhật một phần và ngữ nghĩa của null.')}
${tl('https://spring.io/security/cve-2022-22965', '🍃', 'Spring — CVE-2022-22965 (Spring4Shell)', 'Bản tin, phiên bản bị ảnh hưởng và cách giảm thiểu ở data binding.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: V54App trên Spring Boot 4.1.2 / Jackson 3, Hibernate Validator 9.1.5.Final; zod 4.6.7 trên Node 22 (19/11/2026).</li>
  <li>spring.io, "Spring Framework RCE, Early Announcement" (31/03/2022) và bản tin CVE-2022-22965; danh mục Known Exploited Vulnerabilities của CISA.</li>
</ul>
</div>
`;

// ===== Bài 5.5 =====
const SQL55_SCHEMA = sql("DROP TABLE IF EXISTS bookings, labs;\nCREATE TABLE labs(id bigserial PRIMARY KEY, code varchar(10) NOT NULL UNIQUE, name text NOT NULL);\nCREATE TABLE bookings(\n  id bigserial PRIMARY KEY,\n  lab_id bigint NOT NULL REFERENCES labs,\n  student_id varchar(8) NOT NULL,\n  student_name varchar(80) NOT NULL,\n  email text NOT NULL,\n  start_at timestamp NOT NULL,\n  end_at timestamp NOT NULL);\nINSERT INTO labs(code, name) VALUES ('IOT-01', 'Lab IoT'), ('NET-02', 'Lab Mạng');\nINSERT INTO bookings(lab_id, student_id, student_name, email, start_at, end_at)\n  VALUES (1, 'SE180001', 'Minh', 'minh@fpt.edu.vn', '2030-01-15 08:00', '2030-01-15 10:00');");
const MA55_REQ = java("// TODO Lab 5: thêm ràng buộc (Bean Validation) cho từng trường và cho cả đối tượng\npublic record BookingRequest(\n        Long labId,\n        String studentId,     // dạng SE180123: 2 chữ in hoa + 6 chữ số\n        String studentName,   // bắt buộc, tối đa 80 ký tự\n        String email,\n        LocalDateTime startAt,\n        LocalDateTime endAt) {\n}");
const MA55_CTRL = java("@RestController\npublic class BookingController {\n    private final JdbcClient db;\n\n    public BookingController(JdbcClient db) {\n        this.db = db;\n    }\n\n    @PostMapping(\"/bookings\")\n    public ResponseEntity<Map<String, Object>> create(@RequestBody BookingRequest r) {\n        long id = db.sql(\"\"\"\n                INSERT INTO bookings(lab_id, student_id, student_name, email, start_at, end_at)\n                VALUES (?, ?, ?, ?, ?, ?) RETURNING id\"\"\")\n                .params(r.labId(), r.studentId(), r.studentName(), r.email(), r.startAt(), r.endAt())\n                .query(Long.class).single();\n        var location = ServletUriComponentsBuilder.fromCurrentContextPath().path(\"/bookings/{id}\").buildAndExpand(id).toUri();\n        return ResponseEntity.created(location).body(Map.of(\"id\", id));\n    }\n\n    @GetMapping(\"/bookings/{id}\")\n    public Map<String, Object> one(@PathVariable long id) {\n        return db.sql(\"SELECT id, lab_id, student_id, student_name, start_at, end_at FROM bookings WHERE id = ?\")\n                .param(id).query().singleRow();\n    }\n}");
const MA55_REPORT = java("// Báo cáo do nhóm khác viết, ĐANG LỖI (gõ nhầm tên cột). KHÔNG sửa tệp này — lab yêu cầu xử lý lỗi cho đúng.\n@RestController\npublic class ReportController {\n    private final JdbcClient db;\n\n    public ReportController(JdbcClient db) {\n        this.db = db;\n    }\n\n    @GetMapping(\"/labs/{id}/report\")\n    public Map<String, Object> report(@PathVariable long id) {\n        return db.sql(\"SELECT count(*) AS bookings, sum(end_at - start_at) AS total FROM bookings WHERE lab_id = ? AND stauts = 'DONE'\")\n                .param(id).query().singleRow();\n    }\n}");
const BASH55_CHAY = bash("#!/bin/bash\n# chay.sh <thư mục tuyệt đối> — nạp schema, build (mvn -o), chạy Lab5App trong netns sb-c5-net (41870). Cần: bash lab/c5/run.sh net\nL=~/vbg-dp/scratchpad/sb/lab/c5; D=$1\ndocker exec -i sb-c5-pg psql -q -U postgres -d labflow < $L/lab5/schema.sql 2>/dev/null\nbash ~/vbg-dp/scratchpad/sb/mvn.sh $D -q -o compile dependency:copy-dependencies -DoutputDirectory=target/dep -DincludeScope=runtime >/dev/null || { echo BUILD LỖI; exit 1; }\ndocker rm -f sb-c5-app >/dev/null 2>&1\ndocker run -d --name sb-c5-app --network container:sb-c5-net --cpus 4 --memory 2g --user $(id -u):$(id -g) -e HOME=/tmp -e LANG=C.UTF-8 \\\n  -v \"$D\":/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 java -cp \"target/classes:target/dep/*\" labflow.Lab5App >/dev/null\nfor i in $(seq 60); do docker logs sb-c5-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in|APPLICATION FAILED|Application run failed' && break; sleep 1; done; sleep 0.5");
const OUT55_STARTER = out("FAIL 1 dữ liệu sai ⇒ 400 problem+json, errors có labId/studentName/email — nhận 500 application/json, errors=[]\nFAIL 2 mã sinh viên sai dạng ⇒ 400, errors có studentId — nhận 201, errors=[]\nFAIL 3 endAt trước startAt ⇒ 400, lỗi ở endAt — nhận 201, errors=[]\nFAIL 4 quá 240 phút / ngoài 07:00–21:00 ⇒ 400 — nhận 201 và 201\nFAIL 5 lab không tồn tại ⇒ 404, type lab-not-found, labId — nhận 500 application/json, type/labId=' '\nFAIL 6 sát giờ ⇒ 201, trùng giờ ⇒ 409 + conflictingBookingId — liền kề ⇒ 201, trùng ⇒ 201 application/json, conflictingBookingId=''\nFAIL 7 JSON hỏng ⇒ 400 problem+json, không lộ Jackson — nhận 400 application/json: {\"timestamp\":\"2026-11-18T23:04:47.128Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\nFAIL 8 lỗi bất ngờ ⇒ 500 problem+json có errorId, không lộ SQL — nhận 500 application/json: {\"timestamp\":\"2026-11-18T23:04:47.152Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/labs/1/report\"}\n== 0/8 ==");
const OUT55_BAY = out("PASS 1 dữ liệu sai ⇒ 400 problem+json, errors có labId/studentName/email\nPASS 2 mã sinh viên sai dạng ⇒ 400, errors có studentId\nPASS 3 endAt trước startAt ⇒ 400, lỗi ở endAt\nPASS 4 quá 240 phút / ngoài 07:00–21:00 ⇒ 400\nPASS 5 lab không tồn tại ⇒ 404, type lab-not-found, labId\nPASS 6 sát giờ ⇒ 201, trùng giờ ⇒ 409 + conflictingBookingId\nFAIL 7 JSON hỏng ⇒ 400 problem+json, không lộ Jackson — nhận 500 application/problem+json: {\"detail\":\"Có lỗi phía máy chủ.\",\"instance\":\"/bookings\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"http\nPASS 8 lỗi bất ngờ ⇒ 500 problem+json có errorId, không lộ SQL\n== 7/8 ==");
const OUT55_GIAI = out("PASS 1 dữ liệu sai ⇒ 400 problem+json, errors có labId/studentName/email\nPASS 2 mã sinh viên sai dạng ⇒ 400, errors có studentId\nPASS 3 endAt trước startAt ⇒ 400, lỗi ở endAt\nPASS 4 quá 240 phút / ngoài 07:00–21:00 ⇒ 400\nPASS 5 lab không tồn tại ⇒ 404, type lab-not-found, labId\nPASS 6 sát giờ ⇒ 201, trùng giờ ⇒ 409 + conflictingBookingId\nPASS 7 JSON hỏng ⇒ 400 problem+json, không lộ Jackson\nPASS 8 lỗi bất ngờ ⇒ 500 problem+json có errorId, không lộ SQL\n== 8/8 ==");
const MA55_G_REQ = java("@BookingWindow\npublic record BookingRequest(\n        @NotNull @Positive Long labId,\n        @NotBlank @StudentId String studentId,\n        @NotBlank @Size(max = 80) String studentName,\n        @NotBlank @Email String email,\n        @NotNull @Future LocalDateTime startAt,\n        @NotNull LocalDateTime endAt) {\n}");
const MA55_G_SID = java("// Ràng buộc ghép: chỉ cần @Pattern bên trong, báo một thông báo duy nhất\n@Pattern(regexp = \"[A-Z]{2}\\\\d{6}\")\n@ReportAsSingleViolation\n@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT, ElementType.PARAMETER})\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = {})\npublic @interface StudentId {\n    String message() default \"mã sinh viên gồm 2 chữ in hoa + 6 chữ số (vd SE180123)\";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n}");
const MA55_G_WIN = java("@Target(ElementType.TYPE)\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = BookingWindow.Validator.class)\npublic @interface BookingWindow {\n    String message() default \"khung giờ không hợp lệ\";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n\n    class Validator implements ConstraintValidator<BookingWindow, BookingRequest> {\n        @Override\n        public boolean isValid(BookingRequest b, ConstraintValidatorContext ctx) {\n            if (b == null || b.startAt() == null || b.endAt() == null) return true;\n            ctx.disableDefaultConstraintViolation();\n            if (!b.endAt().isAfter(b.startAt())) return fail(ctx, \"endAt\", \"phải sau startAt\");\n            if (Duration.between(b.startAt(), b.endAt()).toMinutes() > 240) return fail(ctx, \"endAt\", \"tối đa 240 phút\");\n            boolean inHours = !b.startAt().toLocalTime().isBefore(LocalTime.of(7, 0))\n                    && b.endAt().toLocalDate().equals(b.startAt().toLocalDate())\n                    && !b.endAt().toLocalTime().isAfter(LocalTime.of(21, 0));\n            return inHours || fail(ctx, \"startAt\", \"lab mở 07:00–21:00 trong một ngày\");\n        }\n\n        private static boolean fail(ConstraintValidatorContext ctx, String field, String msg) {\n            ctx.buildConstraintViolationWithTemplate(msg).addPropertyNode(field).addConstraintViolation();\n            return false;\n        }\n    }\n}");
const MA55_G_CTRL = java("    @PostMapping(\"/bookings\")\n    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody BookingRequest r) {\n        Long labs = db.sql(\"SELECT count(*) FROM labs WHERE id = ?\").param(r.labId()).query(Long.class).single();\n        if (labs == 0) throw new Problems.LabNotFound(r.labId());\n        // hai khoảng [a, b) và [c, d) giao nhau khi a < d và c < b\n        db.sql(\"SELECT id FROM bookings WHERE lab_id = ? AND start_at < ? AND ? < end_at ORDER BY id LIMIT 1\")\n                .params(r.labId(), r.endAt(), r.startAt()).query(Long.class).optional()\n                .ifPresent(id -> { throw new Problems.Conflict(id); });\n        long id = db.sql(\"\"\"\n                INSERT INTO bookings(lab_id, student_id, student_name, email, start_at, end_at)\n                VALUES (?, ?, ?, ?, ?, ?) RETURNING id\"\"\")\n                .params(r.labId(), r.studentId(), r.studentName(), r.email(), r.startAt(), r.endAt())\n                .query(Long.class).single();\n        var location = ServletUriComponentsBuilder.fromCurrentContextPath().path(\"/bookings/{id}\").buildAndExpand(id).toUri();\n        return ResponseEntity.created(location).body(Map.of(\"id\", id));\n    }");
const MA55_G_ERR = java("@RestControllerAdvice\npublic class GlobalErrors extends ResponseEntityExceptionHandler {   // lo sẵn 400 JSON hỏng, 405, 415… dạng ProblemDetail\n    private static final Logger log = LoggerFactory.getLogger(GlobalErrors.class);\n    private static final String BASE = \"https://labflow.cuongthai.com/problems/\";\n\n    record FieldProblem(String field, String message) { }\n\n    @Override\n    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,\n                                                                  HttpStatusCode status, WebRequest request) {\n        ProblemDetail pd = ex.getBody();\n        pd.setType(URI.create(BASE + \"validation\"));\n        pd.setProperty(\"errors\", ex.getBindingResult().getFieldErrors().stream()\n                .map(fe -> new FieldProblem(fe.getField(), fe.getDefaultMessage()))\n                .sorted(Comparator.comparing(FieldProblem::field).thenComparing(FieldProblem::message)).toList());\n        return handleExceptionInternal(ex, pd, headers, status, request);\n    }\n\n    @ExceptionHandler(Problems.LabNotFound.class)\n    ProblemDetail labNotFound(Problems.LabNotFound ex) {\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n        pd.setType(URI.create(BASE + \"lab-not-found\"));\n        pd.setTitle(\"Lab không tồn tại\");\n        pd.setProperty(\"labId\", ex.labId);\n        return pd;\n    }\n\n    @ExceptionHandler(Problems.Conflict.class)\n    ProblemDetail conflict(Problems.Conflict ex) {\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());\n        pd.setType(URI.create(BASE + \"booking-conflict\"));\n        pd.setTitle(\"Trùng lịch\");\n        pd.setProperty(\"conflictingBookingId\", ex.bookingId);\n        return pd;\n    }\n\n    @ExceptionHandler(EmptyResultDataAccessException.class)\n    ProblemDetail notFound() {\n        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, \"Không tìm thấy\");\n    }\n\n    @ExceptionHandler(Exception.class)\n    ProblemDetail unexpected(Exception ex) {\n        String errorId = UUID.randomUUID().toString().substring(0, 8);\n        log.error(\"errorId={}\", errorId, ex);\n        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, \"Có lỗi phía máy chủ.\");\n        pd.setType(URI.create(BASE + \"internal\"));\n        pd.setProperty(\"errorId\", errorId);\n        return pd;\n    }\n}");

const L55_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Chapter 5 lab + interview questions</h2>
<p class="lead">LabFlow's booking endpoint works — for honest clients. It stores a booking with a blank name, an end before its start, a lab that does not exist (as a 500 straight from PostgreSQL), two students in the same lab at the same hour, and it answers every error in a different shape. Your job: put Chapter 5 to work so that every bad request gets the right status and one predictable <code>application/problem+json</code> body, and nothing internal leaks. A grader with eight checks runs against your app and PostgreSQL; the starter scores <strong>0/8</strong>.</p>

<h3>The contract</h3>
<ul>
  <li><code>POST /bookings</code> with <code>labId</code>, <code>studentId</code> (two capitals + six digits, e.g. SE180123), <code>studentName</code> (required, ≤ 80), <code>email</code>, <code>startAt</code>, <code>endAt</code>.</li>
  <li>A booking ends after it starts, lasts at most 240 minutes, and stays within 07:00–21:00 of one day; it is in the future.</li>
  <li>The lab must exist (404, type <code>…/lab-not-found</code>, member <code>labId</code>); it must not overlap another booking of the same lab (409, member <code>conflictingBookingId</code>). Touching intervals (10:00–11:00 after 08:00–10:00) are fine.</li>
  <li>Every error is <code>application/problem+json</code>; validation errors carry <code>errors[]</code> with <code>field</code> and <code>message</code>; unexpected errors carry only an <code>errorId</code> that is also in the log.</li>
  <li><code>ReportController</code> is owned by another team and is broken on purpose — <strong>do not fix it</strong>; make its failure safe.</li>
</ul>

<h3>Setup</h3>
${SQL55_SCHEMA}
${MA55_REQ}
${MA55_CTRL}
${MA55_REPORT}
${BASH55_CHAY}
${bash(`bash lab/c5/run.sh net                               # PostgreSQL sb-c5-pg + cổng 41870
bash lab/c5/lab5/chay.sh $PWD/lab/c5/lab5/starter     # nạp schema, build, chạy Lab5App
bash lab/c5/lab5/cham.sh                              # 8 mục`)}
${OUT55_STARTER}
<p>Run the three commands again after every change: the schema is reloaded each time, so the checks always start from the same data.</p>

<h3>The eight checks, and which lesson each one comes from</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · basic validation</span><span class="v">Blank name, bad email, negative lab id ⇒ 400 problem+json with <code>errors</code> for all three fields (5.1, 5.2).</span></div>
  <div class="kv"><span class="k">2 · custom constraint</span><span class="v"><code>se18012</code> ⇒ 400 with an error on <code>studentId</code> (5.3).</span></div>
  <div class="kv"><span class="k">3 · cross-field</span><span class="v">End before start ⇒ 400, error on <code>endAt</code> (5.3).</span></div>
  <div class="kv"><span class="k">4 · window</span><span class="v">5 hours, or 05:00–06:00 ⇒ 400 (5.3).</span></div>
  <div class="kv"><span class="k">5 · business 404</span><span class="v">Lab 99 ⇒ 404, <code>type</code> ends in <code>/lab-not-found</code>, <code>labId</code> 99 (5.2).</span></div>
  <div class="kv"><span class="k">6 · business 409</span><span class="v">Adjacent slot ⇒ 201; overlapping slot ⇒ 409 with <code>conflictingBookingId</code> 1 (5.2, 4.5).</span></div>
  <div class="kv"><span class="k">7 · broken JSON</span><span class="v">400 problem+json without the words Jackson / exception / parse error (5.2).</span></div>
  <div class="kv"><span class="k">8 · unexpected</span><span class="v">The broken report ⇒ 500 problem+json with <code>errorId</code>, no SQL, no stack (5.2).</span></div>
</div>

<h3>Done when</h3>
<p><code>cham.sh</code> prints <code>== 8/8 ==</code> three runs in a row, and for the 500 you can find the same <code>errorId</code> in <code>docker logs sb-c5-app</code> next to the real SQL error.</p>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correctness — 6 pts</span><span class="v">8/8 three times: 6; 7/8: 4; 6/8: 3; fewer: 1 per two PASS.</span></div>
  <div class="kv"><span class="k">Rules in the right layer — 2 pts</span><span class="v">Format and cross-field rules as constraints on the DTO; lab existence and overlap in code that queries the database; nothing database-dependent inside a <code>ConstraintValidator</code>.</span></div>
  <div class="kv"><span class="k">One error shape — 1 pt</span><span class="v">A single <code>@RestControllerAdvice</code>; business exceptions free of HTTP; no <code>ex.getMessage()</code> of a library in any response.</span></div>
  <div class="kv"><span class="k">No echo — 1 pt</span><span class="v">Field errors without rejected values; no user input concatenated into a constraint message.</span></div>
</div>

<h3>Traps we saw while testing the lab</h3>
<p><strong>An advice that does not extend <code>ResponseEntityExceptionHandler</code>.</strong> It is the shortest way to write one: handle <code>MethodArgumentNotValidException</code>, your two business exceptions, and a catch-all <code>Exception</code>. Checks 1–6 and 8 pass:</p>
${OUT55_BAY}
<p>But a broken JSON body is now a <strong>500</strong> — <code>HttpMessageNotReadableException</code> fell into the catch-all — and so is a wrong HTTP method:</p>
${out(`$ curl -i -X DELETE localhost:41870/bookings/1
HTTP/1.1 500
Content-Type: application/problem+json
{"detail":"Có lỗi phía máy chủ.","instance":"/bookings/1","status":500,"title":"Internal Server Error","type":"https://labflow.cuongthai.com/problems/internal","errorId":"3077346d"}`)}
<p>The client's mistake became our alarm. Without the catch-all, Spring would have mapped both (400, 405); with it, you must either extend <code>ResponseEntityExceptionHandler</code> or list every Spring exception yourself.</p>
<ul>
  <li><strong><code>&lt;=</code> instead of <code>&lt;</code> in the overlap query</strong> turns the adjacent 10:00–11:00 booking into a 409. Intervals are half-open: <code>[start, end)</code>.</li>
  <li><strong>Checking the lab with a validator</strong> passes the grader and fails the rubric — and races (lesson 5.3).</li>
  <li><strong><code>@Future</code> and time zones:</strong> the container runs in UTC; the grader books in 2030 so the test is stable, but real users in Vietnam are seven hours ahead (lesson 4.3).</li>
</ul>

<h3>Stretch (optional)</h3>
<ul>
  <li>Two students booking the same slot at the same millisecond can both pass the overlap SELECT. Make PostgreSQL refuse the second: <code>CREATE EXTENSION btree_gist;</code> and an <code>EXCLUDE USING gist (lab_id WITH =, tsrange(start_at, end_at) WITH &amp;&amp;)</code> constraint, then map its error to 409 (Chapter 7 does this properly with transactions).</li>
  <li>Return Vietnamese <code>title</code>/<code>detail</code> when the client sends <code>Accept-Language: vi</code>.</li>
</ul>

${giai('Show one solution (try first!)', `${MA55_G_REQ}
${MA55_G_SID}
${MA55_G_WIN}
${MA55_G_CTRL}
${MA55_G_ERR}
${OUT55_GIAI}
<p>8/8 on three consecutive runs. The overlap test is the classic <code>a &lt; d AND c &lt; b</code>; <code>ORDER BY id LIMIT 1</code> makes <code>conflictingBookingId</code> deterministic when several bookings overlap. <code>@StudentId</code> is a composed constraint (a <code>@Pattern</code> with <code>@ReportAsSingleViolation</code>) — no validator class needed.</p>`)}

<h3>🎤 Chapter 5 — what the interviewer will ask</h3>
<ol>
  <li><strong>"Walk me through what happens when a request with invalid JSON fields hits a Spring controller."</strong> — Jackson builds the DTO (type errors ⇒ <code>HttpMessageNotReadableException</code>, 400); <code>@Valid</code> runs Hibernate Validator; violations ⇒ <code>MethodArgumentNotValidException</code> before the method runs; the advice (or <code>ResponseEntityExceptionHandler</code>) turns it into a 400 ProblemDetail with field errors.</li>
  <li><strong>"Where do you put a rule like 'the room must be free'?"</strong> — In the service with a database query, and ultimately in a database constraint, because only the database sees concurrent requests; map the failure to 409. Validators only for request-local rules.</li>
  <li><strong>"How should an API report errors?"</strong> — One format (RFC 9457 <code>application/problem+json</code>), correct status classes, stable <code>type</code> codes, field-level errors, no internals, an id to correlate with logs.</li>
  <li><strong>"Create and update DTOs — same or different?"</strong> — Different by default; groups only for tiny differences and they must extend <code>Default</code>; PATCH needs three-state fields.</li>
  <li><strong>"Name a vulnerability related to validation or error handling."</strong> — ReDoS / missing length limits; information disclosure through stack traces; EL injection in constraint messages (CVE-2020-9296); OGNL in error messages (Equifax, CVE-2017-5638); data binding to object graphs (Spring4Shell).</li>
</ol>

<h3>Sources</h3>
<ul>
  <li>Grader and outputs: <code>lab/c5/lab5</code> (starter, solution, a trap variant) on Spring Boot 4.1.2 with PostgreSQL 16; starter 0/8 ×3, solution 8/8 ×3, trap 7/8 (19/11/2026).</li>
  <li>PostgreSQL documentation — Exclusion constraints and range types (<code>tsrange</code>, <code>&amp;&amp;</code>).</li>
</ul>
</div>
`;

const L55_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Lab chương 5 + câu hỏi phỏng vấn</h2>
<p class="lead">Endpoint đặt lịch của LabFlow chạy được — với client tử tế. Nó lưu lượt đặt có tên trống, giờ kết thúc trước giờ bắt đầu, lab không tồn tại (thành 500 thẳng từ PostgreSQL), hai sinh viên cùng một lab cùng một giờ, và trả mỗi lỗi một kiểu. Việc của bạn: đem Chương 5 vào để mọi request sai nhận đúng mã trạng thái và một body <code>application/problem+json</code> đoán trước được, không lộ gì bên trong. Bộ chấm tám mục chạy với ứng dụng của bạn và PostgreSQL; bản khởi đầu được <strong>0/8</strong>.</p>

<h3>Hợp đồng</h3>
<ul>
  <li><code>POST /bookings</code> với <code>labId</code>, <code>studentId</code> (hai chữ in hoa + sáu chữ số, vd SE180123), <code>studentName</code> (bắt buộc, ≤ 80), <code>email</code>, <code>startAt</code>, <code>endAt</code>.</li>
  <li>Lượt đặt kết thúc sau khi bắt đầu, dài tối đa 240 phút, nằm trong 07:00–21:00 của một ngày; và ở tương lai.</li>
  <li>Lab phải tồn tại (404, type <code>…/lab-not-found</code>, thành phần <code>labId</code>); không được trùng giờ lượt khác của cùng lab (409, thành phần <code>conflictingBookingId</code>). Hai khoảng chạm nhau (10:00–11:00 sau 08:00–10:00) thì được.</li>
  <li>Mọi lỗi là <code>application/problem+json</code>; lỗi validate kèm <code>errors[]</code> có <code>field</code> và <code>message</code>; lỗi bất ngờ chỉ kèm <code>errorId</code>, mã này cũng nằm trong log.</li>
  <li><code>ReportController</code> thuộc nhóm khác và cố tình hỏng — <strong>không sửa nó</strong>; hãy làm cho lỗi của nó an toàn.</li>
</ul>

<h3>Chuẩn bị</h3>
${SQL55_SCHEMA}
${MA55_REQ}
${MA55_CTRL}
${MA55_REPORT}
${BASH55_CHAY}
${bash(`bash lab/c5/run.sh net                               # PostgreSQL sb-c5-pg + cổng 41870
bash lab/c5/lab5/chay.sh $PWD/lab/c5/lab5/starter     # nạp schema, build, chạy Lab5App
bash lab/c5/lab5/cham.sh                              # 8 mục`)}
${OUT55_STARTER}
<p>Chạy lại ba lệnh sau mỗi lần sửa: schema được nạp lại mỗi lần, nên các mục kiểm luôn bắt đầu từ cùng dữ liệu.</p>

<h3>Tám mục kiểm, và mỗi mục đến từ bài nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · validate cơ bản</span><span class="v">Tên trống, email sai, lab id âm ⇒ 400 problem+json kèm <code>errors</code> cho cả ba trường (5.1, 5.2).</span></div>
  <div class="kv"><span class="k">2 · ràng buộc tuỳ biến</span><span class="v"><code>se18012</code> ⇒ 400 có lỗi ở <code>studentId</code> (5.3).</span></div>
  <div class="kv"><span class="k">3 · liên trường</span><span class="v">Kết thúc trước bắt đầu ⇒ 400, lỗi ở <code>endAt</code> (5.3).</span></div>
  <div class="kv"><span class="k">4 · khung giờ</span><span class="v">5 tiếng, hoặc 05:00–06:00 ⇒ 400 (5.3).</span></div>
  <div class="kv"><span class="k">5 · 404 nghiệp vụ</span><span class="v">Lab 99 ⇒ 404, <code>type</code> kết thúc bằng <code>/lab-not-found</code>, <code>labId</code> 99 (5.2).</span></div>
  <div class="kv"><span class="k">6 · 409 nghiệp vụ</span><span class="v">Khung liền kề ⇒ 201; khung chồng ⇒ 409 kèm <code>conflictingBookingId</code> 1 (5.2, 4.5).</span></div>
  <div class="kv"><span class="k">7 · JSON hỏng</span><span class="v">400 problem+json, không có chữ Jackson / exception / parse error (5.2).</span></div>
  <div class="kv"><span class="k">8 · lỗi bất ngờ</span><span class="v">Báo cáo hỏng ⇒ 500 problem+json kèm <code>errorId</code>, không SQL, không stack (5.2).</span></div>
</div>

<h3>Đạt khi</h3>
<p><code>cham.sh</code> in <code>== 8/8 ==</code> ba lần liền, và với lỗi 500 bạn tìm được đúng <code>errorId</code> đó trong <code>docker logs sb-c5-app</code>, cạnh lỗi SQL thật.</p>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng — 6 điểm</span><span class="v">8/8 ba lần: 6; 7/8: 4; 6/8: 3; ít hơn: 1 điểm cho mỗi hai PASS.</span></div>
  <div class="kv"><span class="k">Luật đặt đúng tầng — 2 điểm</span><span class="v">Luật hình dạng và liên trường là ràng buộc trên DTO; kiểm lab tồn tại và trùng giờ trong mã có truy vấn CSDL; không có gì phụ thuộc CSDL bên trong <code>ConstraintValidator</code>.</span></div>
  <div class="kv"><span class="k">Một dạng lỗi — 1 điểm</span><span class="v">Đúng một <code>@RestControllerAdvice</code>; ngoại lệ nghiệp vụ không dính HTTP; không response nào chứa <code>ex.getMessage()</code> của thư viện.</span></div>
  <div class="kv"><span class="k">Không lặp lại đầu vào — 1 điểm</span><span class="v">Lỗi từng trường không kèm giá trị bị từ chối; không nối đầu vào người dùng vào thông báo ràng buộc.</span></div>
</div>

<h3>Bẫy ta gặp khi thử lab</h3>
<p><strong>Advice không kế thừa <code>ResponseEntityExceptionHandler</code>.</strong> Đây là cách viết ngắn nhất: xử lý <code>MethodArgumentNotValidException</code>, hai ngoại lệ nghiệp vụ, và một lưới <code>Exception</code>. Mục 1–6 và 8 qua:</p>
${OUT55_BAY}
<p>Nhưng body JSON hỏng giờ thành <strong>500</strong> — <code>HttpMessageNotReadableException</code> rơi vào lưới chung — và gọi sai phương thức HTTP cũng vậy:</p>
${out(`$ curl -i -X DELETE localhost:41870/bookings/1
HTTP/1.1 500
Content-Type: application/problem+json
{"detail":"Có lỗi phía máy chủ.","instance":"/bookings/1","status":500,"title":"Internal Server Error","type":"https://labflow.cuongthai.com/problems/internal","errorId":"3077346d"}`)}
<p>Lỗi của client thành chuông báo động của ta. Không có lưới chung, Spring đã tự ánh xạ cả hai (400, 405); có lưới chung thì bạn phải kế thừa <code>ResponseEntityExceptionHandler</code> hoặc tự liệt kê mọi ngoại lệ của Spring.</p>
<ul>
  <li><strong>Viết <code>&lt;=</code> thay vì <code>&lt;</code> trong truy vấn trùng giờ</strong> biến lượt 10:00–11:00 liền kề thành 409. Khoảng thời gian là nửa mở: <code>[start, end)</code>.</li>
  <li><strong>Kiểm lab bằng validator</strong> qua bộ chấm nhưng mất điểm thang — và bị đua (bài 5.3).</li>
  <li><strong><code>@Future</code> và múi giờ:</strong> container chạy UTC; bộ chấm đặt năm 2030 để ổn định, nhưng người dùng thật ở Việt Nam đi trước bảy tiếng (bài 4.3).</li>
</ul>

<h3>Nâng cao (không bắt buộc)</h3>
<ul>
  <li>Hai sinh viên đặt cùng khung giờ trong cùng một mili giây có thể cùng qua câu SELECT kiểm trùng. Hãy để PostgreSQL từ chối người thứ hai: <code>CREATE EXTENSION btree_gist;</code> và ràng buộc <code>EXCLUDE USING gist (lab_id WITH =, tsrange(start_at, end_at) WITH &amp;&amp;)</code>, rồi ánh xạ lỗi của nó sang 409 (Chương 7 làm việc này bài bản cùng giao dịch).</li>
  <li>Trả <code>title</code>/<code>detail</code> tiếng Việt khi client gửi <code>Accept-Language: vi</code>.</li>
</ul>

${giai('Xem một lời giải (tự làm trước đã!)', `${MA55_G_REQ}
${MA55_G_SID}
${MA55_G_WIN}
${MA55_G_CTRL}
${MA55_G_ERR}
${OUT55_GIAI}
<p>8/8 ba lần liền. Phép kiểm chồng giờ là công thức kinh điển <code>a &lt; d AND c &lt; b</code>; <code>ORDER BY id LIMIT 1</code> làm <code>conflictingBookingId</code> tất định khi có nhiều lượt chồng. <code>@StudentId</code> là ràng buộc ghép (một <code>@Pattern</code> với <code>@ReportAsSingleViolation</code>) — không cần lớp validator.</p>`)}

<h3>🎤 Chương 5 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Kể lại chuyện gì xảy ra khi một request có trường JSON sai tới controller Spring."</strong> — Jackson dựng DTO (sai kiểu ⇒ <code>HttpMessageNotReadableException</code>, 400); <code>@Valid</code> chạy Hibernate Validator; có vi phạm ⇒ <code>MethodArgumentNotValidException</code> trước khi hàm chạy; advice (hoặc <code>ResponseEntityExceptionHandler</code>) biến nó thành ProblemDetail 400 kèm lỗi từng trường.</li>
  <li><strong>"Luật kiểu 'phòng phải còn trống' đặt ở đâu?"</strong> — Trong service với truy vấn CSDL, và rốt cuộc là một ràng buộc CSDL, vì chỉ CSDL thấy các request đồng thời; ánh xạ thất bại sang 409. Validator chỉ cho luật nằm gọn trong request.</li>
  <li><strong>"API nên báo lỗi thế nào?"</strong> — Một định dạng (RFC 9457 <code>application/problem+json</code>), đúng nhóm mã trạng thái, mã <code>type</code> ổn định, lỗi từng trường, không lộ bên trong, một mã để đối chiếu log.</li>
  <li><strong>"DTO tạo mới và cập nhật — chung hay riêng?"</strong> — Mặc định là riêng; group chỉ cho khác biệt rất nhỏ và phải kế thừa <code>Default</code>; PATCH cần trường ba trạng thái.</li>
  <li><strong>"Kể một lỗ hổng liên quan tới validate hay xử lý lỗi."</strong> — ReDoS / thiếu giới hạn độ dài; lộ thông tin qua stack trace; EL injection trong thông báo ràng buộc (CVE-2020-9296); OGNL trong thông báo lỗi (Equifax, CVE-2017-5638); data binding vào đồ thị đối tượng (Spring4Shell).</li>
</ol>

<h3>Nguồn</h3>
<ul>
  <li>Bộ chấm và output: <code>lab/c5/lab5</code> (bản khởi đầu, lời giải, một biến thể bẫy) trên Spring Boot 4.1.2 với PostgreSQL 16; khởi đầu 0/8 ×3, lời giải 8/8 ×3, bẫy 7/8 (19/11/2026).</li>
  <li>Tài liệu PostgreSQL — Exclusion constraints và kiểu khoảng (<code>tsrange</code>, <code>&amp;&amp;</code>).</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ5 = [
  Q('A record field is annotated @Size(max = 80) only. The client sends "studentName": null. Result?|||Một trường record chỉ có @Size(max = 80). Client gửi "studentName": null. Kết quả?', [
    '400 — null has no length|||400 — null không có độ dài',
    'Valid — every constraint except the null checks treats null as valid|||Hợp lệ — mọi ràng buộc trừ nhóm kiểm null đều coi null là hợp lệ',
    '500 NullPointerException inside the validator|||500 NullPointerException trong validator',
    '415 Unsupported Media Type|||415 Unsupported Media Type',
  ], 1),
  Q('CreateBookingRequest has @NotNull Contact contact, and Contact has @NotBlank String phone. The request sends "contact":{"phone":""}. What happens with @Valid on the body?|||CreateBookingRequest có @NotNull Contact contact, còn Contact có @NotBlank String phone. Request gửi "contact":{"phone":""}. Có @Valid trên body thì sao?', [
    '400 on contact.phone|||400 ở contact.phone',
    'Accepted — without @Valid on the contact field the nested constraints are not checked|||Được nhận — thiếu @Valid trên trường contact thì ràng buộc bên trong không được kiểm',
    '400 on contact|||400 ở contact',
    'Startup error|||Lỗi khi khởi động',
  ], 1),
  Q('In this chapter, which value did @NotBlank accept?|||Trong chương này, @NotBlank đã nhận giá trị nào?', [
    '"   " (three spaces)|||"   " (ba dấu cách)',
    'An empty string|||Chuỗi rỗng',
    'Two zero-width spaces (U+200B)|||Hai ký tự rộng-bằng-không (U+200B)',
    'null|||null',
  ], 2),
  Q('A note field without @Size is trimmed with the regex [\\s\\u200c]+$. Going from 20 000 to 40 000 spaces, the time measured went from 0.85 s to…|||Một trường ghi chú không có @Size được cắt bằng biểu thức [\\s\\u200c]+$. Đi từ 20 000 lên 40 000 dấu cách, thời gian đo được từ 0,85 s lên…', [
    'about 1.7 s (linear)|||khoảng 1,7 s (tuyến tính)',
    'about 3.4 s (quadratic)|||khoảng 3,4 s (bậc hai)',
    'unchanged, Java caches regex results|||không đổi, Java nhớ kết quả regex',
    'a StackOverflowError|||một StackOverflowError',
  ], 1),
  Q('With spring.mvc.problemdetails.enabled=true and no advice, what does a LabNotFoundException (your own RuntimeException) return?|||Có spring.mvc.problemdetails.enabled=true và không có advice, một LabNotFoundException (RuntimeException của bạn) trả về gì?', [
    '404 application/problem+json|||404 application/problem+json',
    '500 with the default Boot error body — the property only covers Spring MVC exceptions|||500 với body lỗi mặc định của Boot — thuộc tính chỉ lo ngoại lệ của Spring MVC',
    '400 Bad Request|||400 Bad Request',
    'The stack trace|||Stack trace',
  ], 1),
  Q('Your @RestControllerAdvice does NOT extend ResponseEntityExceptionHandler and has @ExceptionHandler(Exception.class). A client sends broken JSON. Status?|||@RestControllerAdvice của bạn KHÔNG kế thừa ResponseEntityExceptionHandler và có @ExceptionHandler(Exception.class). Client gửi JSON hỏng. Mã trạng thái?', [
    '400|||400',
    '415|||415',
    '500 — HttpMessageNotReadableException falls into the catch-all|||500 — HttpMessageNotReadableException rơi vào lưới chung',
    '422|||422',
  ], 2),
  Q('Ten parallel POSTs with the same email, a @UniqueEmail validator that runs SELECT count(*), and a table WITHOUT a unique constraint. How many rows?|||Mười POST song song cùng một email, validator @UniqueEmail chạy SELECT count(*), và bảng KHÔNG có ràng buộc unique. Bao nhiêu dòng?', [
    '1|||1',
    '10|||10',
    '0|||0',
    'It depends on @Transactional only|||Chỉ phụ thuộc @Transactional',
  ], 1),
  Q('Why is ctx.buildConstraintViolationWithTemplate("mã lab " + code + " không tồn tại") dangerous?|||Vì sao ctx.buildConstraintViolationWithTemplate("mã lab " + code + " không tồn tại") nguy hiểm?', [
    'It is slow|||Nó chậm',
    'User input becomes part of a message template that may be evaluated as Expression Language|||Đầu vào người dùng thành một phần của mẫu thông báo có thể bị đánh giá như Expression Language',
    'It breaks i18n only|||Nó chỉ làm hỏng đa ngôn ngữ',
    'It is not dangerous in any version|||Không nguy hiểm ở bất kỳ phiên bản nào',
  ], 1),
  Q('@Validated(OnCreate.class) where interface OnCreate {} does not extend Default. A blank name annotated @NotBlank (no groups) is sent. Result?|||@Validated(OnCreate.class) với interface OnCreate {} không kế thừa Default. Gửi tên trống có @NotBlank (không ghi groups). Kết quả?', [
    '400 on name|||400 ở name',
    'Accepted — only OnCreate constraints run|||Được nhận — chỉ ràng buộc OnCreate chạy',
    'Startup error|||Lỗi khi khởi động',
    '409|||409',
  ], 1),
  Q('Spring Boot 4 / Jackson 3: a record component Optional<String> note, request body {}. What is note?|||Spring Boot 4 / Jackson 3: thành phần record Optional<String> note, body {}. note là gì?', [
    'null|||null',
    'Optional.empty() — the same as sending "note": null|||Optional.empty() — giống hệt gửi "note": null',
    'Optional.of("")|||Optional.of("")',
    'A 400 error|||Lỗi 400',
  ], 1),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `5.${n} — ${en}|||5.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 5 — Validation and error handling|||Chương 5 — Validate dữ liệu và xử lý lỗi',
  description: 'Jakarta Bean Validation trên DTO (mép thật: a@b, ký tự rộng-bằng-không, @Size đếm UTF-16, ReDoS Java vs Node), lỗi chuẩn RFC 9457 qua bốn chặng (mặc định 500, lộ SQL + stack, ProblemDetail, advice có errorId + tiếng Việt), validator tuỳ biến và liên trường (đua UNIQUE, EL injection), group hay tách DTO (bẫy Default, PATCH ba trạng thái, Spring4Shell) — chạy thật trên Spring Boot 4.1.2 + PostgreSQL, so với Express 5 + zod, lab đặt lịch có bộ chấm 8 mục và câu hỏi phỏng vấn.',
  lessons: [
    L(1, 'sb-5-1-bean-validation', 'Jakarta Bean Validation', 'Jakarta Bean Validation',
      'Annotation trên DTO + @Valid, 8 lỗi bị giấu trong body mặc định, validate tham số không cần @Validated, quên @Valid lồng, Validator tay + thông báo tiếng Việt, mép thật (a@b, U+200B, @Size đếm UTF-16), giới hạn độ dài chặn regex O(n²) của sự cố Stack Overflow 2016, Java 21 vs Node 22 trước ReDoS.',
      L51_EN + L51_VI),
    L(2, 'sb-5-2-exception-handler-spring', 'Centralized error handling with ProblemDetail', 'Xử lý lỗi tập trung với ProblemDetail',
      'Bốn chặng đo trên cùng request: mặc định Boot (lỗi nghiệp vụ thành 500), bật message/trace lộ SQL + 6 495 ký tự stack (khoá spring.web.error.* của Boot 4), RFC 9457 bằng một thuộc tính, @RestControllerAdvice với errors, type nghiệp vụ, errorId và tiếng Việt; Equifax 2017; so với middleware lỗi Express 5.',
      L52_EN + L52_VI),
    L(3, 'sb-5-3-custom-validator', 'Custom and cross-field validators', 'Validator tuỳ biến và liên trường',
      '@StudentId bằng ConstraintValidator, @BookingWindow mức lớp gắn lỗi vào endAt, validator tra CSDL bị đua (10 dòng trùng, 9 × 500) và cách đúng (UNIQUE ⇒ 409), EL injection khi nối đầu vào vào mẫu thông báo (\${1+1} ⇒ 2, OutOfMemoryError), Netflix Conductor CVE-2020-9296.',
      L53_EN + L53_VI),
    L(4, 'sb-5-4-validation-group', 'Create vs update: groups or separate DTOs', 'Tạo mới vs cập nhật: group hay tách DTO',
      'Group và bẫy Default (dữ liệu trống được 201), tách DTO cho tạo/PUT/PATCH, PATCH ba trạng thái (ngây thơ không xoá được, record Optional của Jackson 3 hỏng, lớp có setter đúng), @ModelAttribute đi xuyên đồ thị đối tượng (owner.role=ADMIN) và Spring4Shell 2022, so với zod partial/strict.',
      L54_EN + L54_VI),
    L(5, 'sb-5-5-lab-5', 'Chapter 5 lab + interview questions', 'Lab chương 5 + câu hỏi phỏng vấn',
      'API đặt lịch LabFlow có validate + lỗi chuẩn: bộ chấm 8 mục với PostgreSQL (khởi đầu 0/8, lời giải 8/8 ×3), bẫy advice không kế thừa ResponseEntityExceptionHandler (JSON hỏng ⇒ 500), khoảng nửa mở, thang 10 điểm, lời giải ẩn, câu phỏng vấn chương 5.',
      L55_EN + L55_VI),
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'sb-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về null và @Size, @Valid lồng, ký tự rộng-bằng-không, regex bậc hai, phạm vi của problemdetails.enabled, advice thiếu ResponseEntityExceptionHandler, đua validator tra CSDL, EL injection, bẫy group Default và Optional trong record Jackson 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from a request you saw answered in this chapter — a blank name that passed, a duplicate email ten times over, a <code>\${1+1}</code> that came back as 2. If you miss one, rerun that lesson's curl command and read the response again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một request bạn đã thấy được trả lời trong chương — một cái tên trống vẫn qua, một email trùng mười lần, một <code>\${1+1}</code> trả về 2. Sai câu nào thì chạy lại lệnh curl của bài đó và đọc lại response.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ5 },
    },
  ],
};
