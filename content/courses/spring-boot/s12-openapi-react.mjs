/**
 * spring-boot/s12-openapi-react.mjs — Chương 12: API mà frontend thích — OpenAPI và React (soạn 24/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: LabFlow (Spring Boot 4.1.2) của Chương 18 làm nền, springdoc 3.1.1, openapi-typescript 7.13.0,
 * openapi-fetch 0.13.8, Vite 7.3.8 + React 19.3.1, Google Chrome 150 (headless, lái bằng Playwright), oasdiff, tc netem.
 * Mã: scratchpad/sb/lab/c12/{labflow (bản c12: CORS cấu hình được, module demo12 profile c12), web (trang React), t (kịch bản đo), lab12 (lời giải + bộ chấm)}.
 * Output: ~/.rtq-sb/c12/o (bản hiển thị ở o/web, lọc bằng lab/c12/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s12/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 12.1 =====
const MA121_APIDOCS = java("/** Tên + cách xác thực trên hợp đồng OpenAPI: Swagger UI có nút Authorize, client TypeScript sinh ra biết gửi Bearer. */\n@Configuration\n@OpenAPIDefinition(info = @Info(title = \"LabFlow API\", version = \"v1\", description = \"Đặt lịch phòng lab — capstone khoá Spring Boot\"),\n                   security = @SecurityRequirement(name = \"bearer\"))\n@SecurityScheme(name = \"bearer\", type = SecuritySchemeType.HTTP, scheme = \"bearer\", bearerFormat = \"JWT\")\nclass ApiDocs {\n    /**\n     * Lỗi CHUNG của mọi endpoint (400 dữ liệu hỏng, 401 thiếu/sai token, 500) khai MỘT lần ở đây,\n     * thay vì chép @ApiResponse lên từng phương thức. Lỗi NGHIỆP VỤ riêng (409, 422) khai ngay trên endpoint.\n     */\n    @Bean\n    OpenApiCustomizer loiChung() {\n        return api -> {\n            ModelConverters.getInstance().read(Problem.class).forEach(api.getComponents()::addSchemas);\n            Content c = new Content().addMediaType(\"application/problem+json\",\n                new MediaType().schema(new Schema<>().$ref(\"#/components/schemas/Problem\")));\n            api.getPaths().forEach((path, item) -> item.readOperations().forEach(op -> {\n                var r = op.getResponses();\n                r.putIfAbsent(\"400\", new ApiResponse().description(\"Dữ liệu gửi lên chưa hợp lệ (code VALIDATION, kèm fields)\").content(c));\n                boolean congKhai = op.getSecurity() != null && op.getSecurity().isEmpty();   // @SecurityRequirements() rỗng\n                if (!congKhai)\n                    r.putIfAbsent(\"401\", new ApiResponse().description(\"Thiếu token, token sai hoặc hết hạn\").content(c));\n                r.putIfAbsent(\"500\", new ApiResponse().description(\"Lỗi máy chủ (không lộ chi tiết)\").content(c));\n            }));\n        };\n    }\n}");
const MA121_PROBLEM = java("/** CHỈ để mô tả khuôn lỗi trên hợp đồng OpenAPI (server trả ProblemDetail thật, cùng các trường này). */\n@Schema(name = \"Problem\", description = \"Lỗi RFC 9457 + code (máy đọc) + fields (lỗi từng ô của form)\",\n        requiredProperties = {\"type\", \"title\", \"status\", \"detail\", \"code\"})\npublic record Problem(\n    @Schema(example = \"https://labflow.vn/errors/slot-taken\") String type,\n    @Schema(example = \"Conflict\") String title,\n    @Schema(example = \"409\") int status,\n    @Schema(example = \"khung giờ này vừa có người đặt, hãy chọn giờ khác\") String detail,\n    @Schema(example = \"/api/v1/bookings\") String instance,\n    @Schema(description = \"Mã ổn định để frontend rẽ nhánh — KHÔNG phân tích câu chữ của detail\", example = \"SLOT_TAKEN\") String code,\n    @Schema(description = \"Chỉ có khi code = VALIDATION: tên trường ⇒ lỗi\", example = \"{\\\"endAt\\\": \\\"must not be null\\\"}\") Map<String, String> fields) { }");
const MA121_DAT = java("@Operation(operationId = \"createBooking\", summary = \"Đặt một khung giờ\",\n    description = \"Phòng ≤ 30 chỗ ⇒ CONFIRMED ngay; > 30 chỗ ⇒ PENDING chờ duyệt (BR-06). Gửi lại cùng Idempotency-Key ⇒ 200 trả lượt cũ.\")\n@ApiResponse(responseCode = \"201\", description = \"Đã tạo lượt mới\",\n    headers = @Header(name = \"Location\", description = \"/api/v1/bookings/{id}\", schema = @Schema(type = \"string\")))\n@ApiResponse(responseCode = \"200\", description = \"Lặp lại một yêu cầu đã xử lý (cùng Idempotency-Key)\",\n    headers = @Header(name = \"Idempotent-Replayed\", schema = @Schema(type = \"string\", allowableValues = \"true\")))\n@ApiResponse(responseCode = \"409\", description = \"SLOT_TAKEN: khung giờ vừa có người đặt\",\n    content = @Content(mediaType = \"application/problem+json\", schema = @Schema(implementation = Problem.class)))\n@ApiResponse(responseCode = \"422\", description = \"Sai quy tắc: NOT_30_MIN_GRID, TOO_FAR_AHEAD, QUOTA_EXCEEDED, LAB_NOT_BOOKABLE…\",\n    content = @Content(mediaType = \"application/problem+json\", schema = @Schema(implementation = Problem.class)))\n@PostMapping\nResponseEntity<BookingView> dat(@AuthenticationPrincipal Jwt jwt,\n                                @Parameter(description = \"Sinh MỘT lần cho mỗi lần bấm Đặt, dùng lại khi tự thử lại\", example = \"9b2f6c1e-0d4a-4f5e\")\n                                @RequestHeader(\"Idempotency-Key\") @Size(min = 8, max = 64, message = \"dài 8–64 ký tự\") String key,\n                                @Valid @RequestBody DatRequest r) {\n    var kq = service.dat(NguoiDung.tu(jwt), new BookingService.YeuCauDat(r.labCode(), r.startAt(), r.endAt(), r.purpose()), key);\n    if (kq.lapLai()) return ResponseEntity.ok().header(\"Idempotent-Replayed\", \"true\").body(kq.view());\n    return ResponseEntity.created(URI.create(\"/api/v1/bookings/\" + kq.view().id())).body(kq.view());\n}");
const MA121_REQ = java("@Schema(description = \"Giờ là giờ địa phương của phòng lab (Asia/Ho_Chi_Minh), KHÔNG kèm múi giờ\")\nrecord DatRequest(@Schema(example = \"IOT-01\") @NotBlank String labCode,\n                  @Schema(example = \"2026-11-26T09:00:00\") @NotNull LocalDateTime startAt,\n                  @Schema(example = \"2026-11-26T11:00:00\") @NotNull LocalDateTime endAt,\n                  @Schema(example = \"Lab 3 IoT\") @NotBlank @Size(max = 200) String purpose) { }");
const MA121_VIEW = java("@io.swagger.v3.oas.annotations.media.Schema(requiredProperties = {\"id\", \"labCode\", \"startAt\", \"endAt\", \"status\", \"purpose\", \"version\"})\nrecord BookingView(long id, String labCode, LocalDateTime startAt, LocalDateTime endAt, String status,\n                   String purpose, String rejectReason, int version) {\n    record Ban(LocalDateTime startAt, LocalDateTime endAt, String status) { }\n}");
const MA121_PROD = props("# src/main/resources/application-prod.properties\n# production: không mở tài liệu API ra internet (bản đồ mọi endpoint cho kẻ tấn công)\nspringdoc.api-docs.enabled=false\nspringdoc.swagger-ui.enabled=false");
const OUT121_TRUOC = out("$ curl -s localhost:8080/v3/api-docs | jq '.paths[\"/api/v1/bookings\"].post'\n{\n  \"tags\": [\n    \"booking-controller\"\n  ],\n  \"operationId\": \"dat\",\n  \"parameters\": [\n    {\n      \"name\": \"Idempotency-Key\",\n      \"in\": \"header\",\n      \"required\": true,\n      \"schema\": {\n        \"type\": \"string\",\n        \"maxLength\": 64,\n        \"minLength\": 8\n      }\n    }\n  ],\n  \"requestBody\": {\n    \"content\": {\n      \"application/json\": {\n        \"schema\": {\n          \"$ref\": \"#/components/schemas/DatRequest\"\n        }\n      }\n    },\n    \"required\": true\n  },\n  \"responses\": {\n    \"200\": {\n      \"description\": \"OK\",\n      \"content\": {\n        \"*/*\": {\n          \"schema\": {\n            \"$ref\": \"#/components/schemas/BookingView\"\n          }\n        }\n      }\n    }\n  }\n}");
const OUT121_TRUOC2 = out("$ curl -s localhost:8080/v3/api-docs | jq -c '.components.schemas.DatRequest.properties.purpose, .components.schemas.BookingView.required'\n{\"type\":\"string\",\"maxLength\":200,\"minLength\":0}\nnull\n$ curl -s localhost:8080/v3/api-docs | jq -c '[.paths[][].operationId]'\n[\"danhSach\",\"tao\",\"dat\",\"tuChoi\",\"huy\",\"duyet\",\"dangKy\",\"dangNhap\",\"doiTrangThai\",\"cuaToi\",\"xem\",\"lich\",\"cuaToi_1\"]\n$ curl -s localhost:8080/v3/api-docs | jq -c '[.paths[][].tags[0]] | unique'\n[\"auth-controller\",\"booking-controller\",\"lab-controller\",\"thong-bao-controller\"]");
const OUT121_TS_TRUOC = out("$ npx openapi-typescript openapi.json -o src/api-types.ts   # hợp đồng CHƯA chú thích\n$ grep -A12 \"BookingView: {\" src/api-types.ts\n        BookingView: {\n            /** Format: int64 */\n            id?: number;\n            labCode?: string;\n            /** Format: date-time */\n            startAt?: string;\n            /** Format: date-time */\n            endAt?: string;\n            status?: string;\n            purpose?: string;\n            rejectReason?: string;\n            /** Format: int32 */\n            version?: number;");
const OUT121_SAU = out("$ curl -s localhost:8080/v3/api-docs | jq -c '.paths[\"/api/v1/bookings\"].post | .operationId, (.responses|keys)'\n\"createBooking\"\n[\"200\",\"201\",\"400\",\"401\",\"409\",\"422\",\"500\"]\n$ curl -s localhost:8080/v3/api-docs | jq '.paths[\"/api/v1/bookings\"].post.responses[\"201\",\"409\"]'\n{\n  \"description\": \"Đã tạo lượt mới\",\n  \"headers\": {\n    \"Location\": {\n      \"description\": \"/api/v1/bookings/{id}\",\n      \"style\": \"simple\",\n      \"schema\": {\n        \"type\": \"string\"\n      }\n    }\n  },\n  \"content\": {\n    \"application/json\": {\n      \"schema\": {\n        \"$ref\": \"#/components/schemas/BookingView\"\n      }\n    }\n  }\n}\n{\n  \"description\": \"SLOT_TAKEN: khung giờ vừa có người đặt\",\n  \"content\": {\n    \"application/problem+json\": {\n      \"schema\": {\n        \"$ref\": \"#/components/schemas/Problem\"\n      }\n    }\n  }\n}\n$ curl -s localhost:8080/v3/api-docs | jq -c '.paths[\"/api/v1/labs\"].get | .security, (.responses|keys)'\n[]\n[\"200\",\"400\",\"500\"]\n$ curl -s localhost:8080/v3/api-docs | wc -c\n17906");
const OUT121_TS_SAU = out("$ npx openapi-typescript openapi.json -o src/api-types.ts   # hợp đồng ĐÃ chú thích\n$ grep -A12 \"BookingView: {\" src/api-types.ts\n        BookingView: {\n            /** Format: int64 */\n            id: number;\n            labCode: string;\n            /** Format: date-time */\n            startAt: string;\n            /** Format: date-time */\n            endAt: string;\n            status: string;\n            purpose: string;\n            rejectReason?: string;\n            /** Format: int32 */\n            version: number;");
const OUT121_TS_CREATE = out("$ grep -A40 '    createBooking: {' src/api-types.ts\n    createBooking: {\n        parameters: {\n            query?: never;\n            header: {\n                /**\n                 * @description Sinh MỘT lần cho mỗi lần bấm Đặt, dùng lại khi tự thử lại\n                 * @example 9b2f6c1e-0d4a-4f5e\n                 */\n                \"Idempotency-Key\": string;\n            };\n            path?: never;\n            cookie?: never;\n        };\n        requestBody: {\n            content: {\n                \"application/json\": components[\"schemas\"][\"DatRequest\"];\n            };\n        };\n        responses: {\n            /** @description Lặp lại một yêu cầu đã xử lý (cùng Idempotency-Key) */\n            200: {\n                headers: {\n                    \"Idempotent-Replayed\"?: \"true\";\n                    [name: string]: unknown;\n                };\n                content: {\n                    \"application/json\": components[\"schemas\"][\"BookingView\"];\n                };\n            };\n            /** @description Đã tạo lượt mới */\n            201: {\n                headers: {\n                    /** @description /api/v1/bookings/{id} */\n                    Location?: string;\n                    [name: string]: unknown;\n                };\n                content: {\n                    \"application/json\": components[\"schemas\"][\"BookingView\"];\n                };\n            };");
const OUT121_TSC_DOI = out("# backend đổi tên purpose → note, frontend lấy lại hợp đồng rồi build\n$ curl -s localhost:8080/v3/api-docs > openapi.json && npm run gen:api && npx tsc -b\n🚀 openapi.json → src/api-types.ts [117.2ms]\nsrc/App.tsx(45,103): error TS2353: Object literal may only specify known properties, and 'purpose' does not exist in type '{ labCode: string; startAt: string; endAt: string; note: string; }'.");
const OUT121_CLIENT_CU = out("# frontend CŨ (chưa build lại) vẫn gửi \"purpose\" lên server MỚI\n$ curl -s -H \"Authorization: Bearer $TOKEN\" -H 'Idempotency-Key: an-cu-client-01' -H 'Content-Type: application/json' -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-11-26T09:00\",\"endAt\":\"2026-11-26T11:00\",\"purpose\":\"Lab 3 IoT\"}' localhost:8080/api/v1/bookings | jq -c .\n{\"detail\":\"dữ liệu gửi lên chưa hợp lệ\",\"instance\":\"/api/v1/bookings\",\"status\":400,\"title\":\"Bad Request\",\"type\":\"https://labflow.vn/errors/validation\",\"code\":\"VALIDATION\",\"fields\":{\"note\":\"must not be blank\"}}");
const OUT121_OASDIFF = out("$ docker run --rm -v $PWD:/s tufin/oasdiff breaking /s/openapi-main.json /s/openapi-pr.json\n2 changes: 1 error, 1 warning, 0 info\nerror\t[new-required-request-property] at /s/openapi-pr.json\n\tin API POST /api/v1/bookings\n\t\tadded the new required request property `note`\n\nwarning\t[request-property-removed] at /s/openapi-main.json\n\tin API POST /api/v1/bookings\n\t\tremoved the request property `purpose`\n\n$ docker run --rm -v $PWD:/s tufin/oasdiff breaking /s/openapi-main.json /s/openapi-pr.json --fail-on ERR >/dev/null; echo \"exit=$?\"\nexit=1");
const OUT121_PROD = out("$ curl -s -o /dev/null -w '%{http_code}' localhost:8080/v3/api-docs\n404\n$ curl -s -o /dev/null -w '%{http_code}' localhost:8080/swagger-ui/index.html\n404\n$ curl -s -o /dev/null -w '%{http_code}' localhost:8080/swagger-ui.html\n404\n$ curl -s -o /dev/null -w '%{http_code}' localhost:8080/api/v1/labs\n200");
const OUT121_WARN = out("WARN SpringDocAppInitializer : SpringDoc /v3/api-docs endpoint is enabled by default. To disable it in production, set the property 'springdoc.api-docs.enabled=false'\nWARN SpringDocAppInitializer : SpringDoc /swagger-ui.html endpoint is enabled by default. To disable it in production, set the property 'springdoc.swagger-ui.enabled=false'");

const L121_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1 · An API frontends love</span>
<h2>OpenAPI docs with springdoc</h2>
<p class="lead">In SWP391 the backend and the frontend are written by different people, often in different rooms, at different hours. The thing that keeps them from shouting at each other is a contract: a machine-readable description of every endpoint, every field, every status code and every error. This lesson generates that contract from the running LabFlow code with springdoc, shows what it gets wrong out of the box (measured, not guessed), fixes it, turns it into TypeScript types for React, and then deliberately breaks it — renaming one field — to watch <code>tsc</code> and a CI tool catch the break before any user does. It ends with the one line that keeps the contract off the public internet.</p>

<h3>Everyday picture first</h3>
<p>A restaurant menu is a contract between the kitchen and the guests. It says what you can order, what is in it and what it costs. If the kitchen quietly changes "pho bo" into "pho ga" without changing the menu, guests get angry and waiters lie. If the kitchen changes the menu and nobody tells the waiters, it is the same mess. OpenAPI is the menu of your API, and the best menus are printed from the kitchen's real recipes, not typed by hand — that is what springdoc does.</p>

<h3>1. One dependency, a contract for free</h3>
<p>LabFlow already has <code>org.springdoc:springdoc-openapi-starter-webmvc-ui</code> (3.1.1, the line for Spring Boot 4). At startup it walks every <code>@RestController</code>, reads the mappings, parameter annotations, Bean Validation constraints and return types, and serves the result as OpenAPI 3.1 JSON at <code>/v3/api-docs</code> and as Swagger UI at <code>/swagger-ui/index.html</code>. Nothing was written by hand. Here is what it produced for the most important endpoint, before any documentation annotation:</p>
${OUT121_TRUOC}
${OUT121_TRUOC2}
<p>Read it like a frontend developer who has never seen the Java code:</p>
<ul>
  <li><strong>The only response is <code>200 OK</code>, type <code>*/*</code>.</strong> In reality the endpoint returns 201 with a <code>Location</code> header, 200 for an idempotent replay, 400, 401, 409 SLOT_TAKEN and 422 for broken rules. None of that is on the contract, so the generated client has no type for any error.</li>
  <li><strong><code>purpose</code> has <code>minLength: 0</code></strong> although the Java field is <code>@NotBlank</code>: springdoc maps <code>@Size</code> faithfully, but "not blank" has no exact JSON Schema equivalent.</li>
  <li><strong><code>BookingView.required</code> is <code>null</code></strong>: every field is optional, so TypeScript will force <code>booking.id?.toString()</code> everywhere for a field that is never missing.</li>
  <li><strong>Operation ids are Java method names</strong>: <code>dat</code>, <code>xem</code>, <code>huy</code>, <code>cuaToi</code> — and <code>cuaToi_1</code>, because two controllers have a method with the same name. Generated clients use these as function names.</li>
  <li><strong>Tags are class names</strong>: <code>booking-controller</code>, <code>thong-bao-controller</code>.</li>
</ul>
<p>springdoc did its job: it described exactly what the code says. The code just does not say enough.</p>

<h3>2. Saying enough: annotations where they carry meaning</h3>
<p>Three kinds of information are added, each in the place it belongs.</p>
<p><strong>(a) Errors that every endpoint can return</strong> are declared once, with an <code>OpenApiCustomizer</code> bean that walks the finished document. Public endpoints are marked with an empty <code>@SecurityRequirements()</code>, so they do not get a 401:</p>
${MA121_APIDOCS}
<p>The error body is described by a record that exists only for the contract — the server still returns Spring's <code>ProblemDetail</code> with the same fields (Chapter 5):</p>
${MA121_PROBLEM}
<p><strong>(b) Business errors and headers</strong> belong on the endpoint itself, because only the booking endpoint knows about SLOT_TAKEN or the <code>Idempotent-Replayed</code> header:</p>
${MA121_DAT}
${MA121_REQ}
<p><strong>(c) Facts about the data</strong>: which fields are always present. One attribute on the response record:</p>
${MA121_VIEW}
<p>The same request now returns:</p>
${OUT121_SAU}
<p>The document doubled (8 759 → 17 906 bytes) and every byte is information a frontend developer would otherwise ask you about on chat. Two more details: <code>springdoc.default-produces-media-type=application/json</code> replaces the vague <code>*/*</code>, and the remaining Vietnamese operation ids (<code>tao</code>, <code>dangKy</code>…) are left for you in the lab.</p>
<div class="callout"><p><strong>Rule of thumb.</strong> Annotate what the code cannot say: business error codes, headers, examples, required-ness of response fields, a summary in human words. Do not annotate what it already says (paths, types, validation) — duplicated facts drift apart.</p></div>

<h3>3. From the contract to TypeScript</h3>
<p>The frontend does not read the JSON; it generates types from it with <code>openapi-typescript</code> (7.13.0) and calls the API through <code>openapi-fetch</code>, which checks every path, parameter and body against those types. The same <code>BookingView</code>, generated from the two contracts:</p>
${OUT121_TS_TRUOC}
${OUT121_TS_SAU}
<p>And the generated operation now knows every outcome, including the error body type for each status:</p>
${OUT121_TS_CREATE}
<p>In React that becomes: <code>const { data, error, response } = await api.POST("/api/v1/bookings", …)</code> where <code>data</code> is a <code>BookingView</code> and <code>error</code> is a <code>Problem</code> with a <code>code</code> to switch on. Lesson 12.4 builds the page on top of it.</p>

<h3>4. Breaking the contract on purpose</h3>
<p>A backend developer "cleans up" the request and renames <code>purpose</code> to <code>note</code>. The Java code compiles and the application starts without a warning. Three things happen next, all measured.</p>
<p><strong>A frontend that was built yesterday keeps sending <code>purpose</code></strong> and every booking now fails:</p>
${OUT121_CLIENT_CU}
<p><strong>A frontend that regenerates its types from the new contract cannot even build</strong> — the break is caught at compile time, on the developer's machine:</p>
${OUT121_TSC_DOI}
<p><strong>A CI step can catch it before merge</strong>, comparing the contract of the main branch with the contract of the pull request. <code>oasdiff</code> classifies every change; a new required request property is an <em>error</em> (old clients break), a removed one a warning:</p>
${OUT121_OASDIFF}
<p>A non-zero exit code fails the pipeline. In a team, the habit is: export <code>openapi.json</code> in CI (start the app, <code>curl /v3/api-docs</code>), compare with main, and require a conscious decision — a new version, or a compatible change such as adding an <em>optional</em> field — for anything marked breaking.</p>

<h3>5. Not on the public internet</h3>
<p>springdoc itself warns at every startup:</p>
${OUT121_WARN}
<p>The contract is a complete map of your API — every admin endpoint, every parameter name, every error code. That is exactly what an attacker's first hour of reconnaissance tries to rebuild. Turn it off in the production profile:</p>
${MA121_PROD}
${OUT121_PROD}
<p>The team still has the contract: the copy exported in CI, or Swagger UI on the dev and staging environments. If someone insists on having it in production, put it behind authentication (the same Spring Security chain, a <code>MANAGER</code>-only rule) rather than <code>permitAll</code>.</p>

<h3>🕵️ Hacker corner — Swagger UI and CVE-2018-25031</h3>
<p>Swagger UI before version 4.1.3 accepted a <code>?configUrl=</code> or <code>?url=</code> parameter in the page address and loaded whatever specification it pointed to. An attacker could send a victim a link to the company's real, trusted Swagger UI domain that displayed an attacker-written API description — with fake "login" endpoints or instructions — under the company's name (spoofing). It was published as CVE-2018-25031; the fix made reading configuration from the query string opt-in (<code>queryConfigEnabled: false</code> by default). LabFlow uses Swagger UI 5.32.14 through springdoc 3.1.1, and the configuration it serves only points at <code>/v3/api-docs/swagger-config</code>. Two lessons: keep the documentation UI updated like any other dependency, and the less of it is public, the less there is to abuse.</p>

<h3>Compared with Node.js</h3>
<p>In NestJS, <code>@nestjs/swagger</code> works like springdoc: it reads decorators and DTO classes (<code>@ApiProperty</code>, <code>@ApiResponse</code>). In plain Express there is no type information at run time, so documentation comes either from comments (<code>swagger-jsdoc</code> — which drifts from the code because nothing checks it) or from schema libraries such as Zod with <code>zod-to-openapi</code>, where the same schema validates the request and generates the contract. Spring has the advantage that types and validation annotations are already in the code; the frontend side (<code>openapi-typescript</code>, <code>oasdiff</code>) is identical for both.</p>

<h3>At work</h3>
<p>Two styles exist. <strong>Code-first</strong> (this lesson): the code is the truth, the contract is generated. <strong>Contract-first</strong>: the team writes <code>openapi.yaml</code> first, reviews it with the frontend, then generates server interfaces (<code>openapi-generator</code>) and implements them. Contract-first suits public APIs and large teams; code-first with a committed, CI-checked <code>openapi.json</code> suits a five-person SWP391 team. Either way, the frontend never codes against "what the backend said in chat".</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you keep the frontend and backend in sync?"</strong> — A generated OpenAPI contract, committed and compared in CI (<code>oasdiff breaking</code>), and types generated for the frontend so that a change becomes a compile error, not a production bug.</li>
  <li><strong>"What is a breaking change in a REST API?"</strong> — Anything that makes an existing client fail: removing or renaming a field, adding a <em>required</em> request field, changing a type, removing an endpoint or a status the client handles. Adding an optional field or a new endpoint is not.</li>
  <li><strong>"Code-first or contract-first?"</strong> — Code-first is faster and cannot drift from the code; contract-first lets frontend and backend agree before writing code. Name when you would pick each.</li>
  <li><strong>"Would you enable Swagger UI in production?"</strong> — Not publicly. Disable it in the prod profile, or protect it with authentication; publish the contract through CI artifacts or an internal portal.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Give every remaining endpoint of LabFlow a stable English <code>operationId</code> and a summary. How do you prove, from the JSON, that no <code>_1</code> suffix is left?</li>
  <li>Add <code>@ApiResponse(responseCode = "409")</code> to <code>POST /api/v1/bookings/{id}/approve</code> (the STALE case from Chapter 7). Regenerate the TypeScript types: what changes in the generated <code>approveBooking</code> operation?</li>
  <li>Make a <em>compatible</em> change — add an optional <code>notes</code> field to the response — and run <code>oasdiff breaking</code>. What does it report?</li>
</ol></div>
${giai('Show the answers', `<p>1. <code>@Operation(operationId = "register")</code>, <code>"login"</code>, <code>"createLab"</code>, <code>"changeLabStatus"</code>, <code>"listMyNotifications"</code>. Check with <code>curl -s localhost:8080/v3/api-docs | jq -r '.paths[][].operationId' | grep -c _</code> — it must print 0 — or let the lab's grader do it (item 3).</p><p>2. A new key <code>409</code> under <code>responses</code> of <code>approveBooking</code>, with content <code>"application/problem+json": components["schemas"]["Problem"]</code>. The <code>error</code> returned by <code>openapi-fetch</code> for that call now includes that type.</p><p>3. No breaking changes (exit code 0). Adding an optional response field is backward compatible: old clients ignore unknown fields. That is why "add, never rename" is the safe way to evolve a contract.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>OpenAPI</strong> — standard, machine-readable description of an HTTP API (version 3.1 here).</li>
  <li><strong>springdoc-openapi</strong> — library that generates the OpenAPI document from Spring MVC code at run time.</li>
  <li><strong>Swagger UI</strong> — web page that renders an OpenAPI document and lets you try requests.</li>
  <li><strong>operationId</strong> — unique name of an operation; becomes a function name in generated clients.</li>
  <li><strong>OpenApiCustomizer</strong> — springdoc hook to modify the whole document after it is built.</li>
  <li><strong>Code-first / contract-first</strong> — generate the contract from the code, or write the contract and generate code from it.</li>
  <li><strong>Breaking change</strong> — a change that makes existing clients fail.</li>
  <li><strong>oasdiff</strong> — tool that compares two OpenAPI documents and classifies changes.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>springdoc generates OpenAPI 3.1 from the code; out of the box it only knows what the code says: 200 <code>*/*</code>, all response fields optional, method names as operation ids (<code>cuaToi_1</code>).</li>
  <li>Declare common errors once (customizer), business errors and headers on the endpoint, required-ness on the record: 8 759 → 17 906 bytes of real information.</li>
  <li><code>openapi-typescript</code> turns it into types; <code>id?: number</code> becomes <code>id: number</code>, every error status gets a <code>Problem</code> type.</li>
  <li>Renaming one field: old clients get 400 VALIDATION, new clients fail <code>tsc</code>, <code>oasdiff</code> fails CI with exit 1.</li>
  <li>Production profile: <code>/v3/api-docs</code> and Swagger UI return 404.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://springdoc.org/', '📘', 'springdoc-openapi', 'Properties, customizers, Spring Boot 4 support.')}
${tl('https://openapi-ts.dev/', '🧩', 'openapi-typescript and openapi-fetch', 'Types and a typed fetch client from OpenAPI.')}
${tl('https://github.com/oasdiff/oasdiff', '🔍', 'oasdiff', 'Breaking-change detection for OpenAPI in CI.')}
${tl('https://spec.openapis.org/oas/v3.1.0', '📜', 'OpenAPI Specification 3.1.0', 'The standard itself.')}

<h3>Sources</h3>
<ul>
  <li>NVD, CVE-2018-25031 (Swagger UI before 4.1.3, spoofing through <code>configUrl</code>/<code>url</code> query parameters).</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, springdoc 3.1.1, Swagger UI 5.32.14), openapi-typescript 7.13.0, TypeScript 5.9.3, oasdiff, on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L121_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1 · API mà frontend thích</span>
<h2>Tài liệu OpenAPI với springdoc</h2>
<p class="lead">Trong SWP391, backend và frontend do những người khác nhau viết, thường ở chỗ khác nhau, giờ khác nhau. Thứ giữ cho hai bên khỏi cãi nhau là một hợp đồng: bản mô tả máy đọc được của mọi endpoint, mọi trường, mọi mã trạng thái và mọi lỗi. Bài này sinh hợp đồng đó từ chính mã LabFlow đang chạy bằng springdoc, chỉ ra những gì nó sai khi để mặc định (đo thật, không đoán), sửa lại, biến nó thành kiểu TypeScript cho React, rồi cố ý làm vỡ nó — đổi tên một trường — để xem <code>tsc</code> và một công cụ CI bắt lỗi trước khi người dùng gặp. Cuối bài là một dòng cấu hình giữ hợp đồng khỏi internet công khai.</p>

<h3>Đời thường trước đã</h3>
<p>Thực đơn nhà hàng là hợp đồng giữa bếp và khách: gọi được món gì, trong món có gì, giá bao nhiêu. Nếu bếp lặng lẽ đổi "phở bò" thành "phở gà" mà không sửa thực đơn, khách nổi giận và người phục vụ phải nói dối. Nếu bếp sửa thực đơn mà không ai báo người phục vụ, cũng loạn y như vậy. OpenAPI là thực đơn của API, và thực đơn tốt nhất được in ra từ công thức thật của bếp chứ không gõ tay — đó là việc springdoc làm.</p>

<h3>1. Một dependency, hợp đồng có sẵn</h3>
<p>LabFlow đã có <code>org.springdoc:springdoc-openapi-starter-webmvc-ui</code> (3.1.1, dòng cho Spring Boot 4). Lúc khởi động nó duyệt mọi <code>@RestController</code>, đọc mapping, annotation của tham số, ràng buộc Bean Validation và kiểu trả về, rồi phục vụ kết quả dạng JSON OpenAPI 3.1 ở <code>/v3/api-docs</code> và dạng Swagger UI ở <code>/swagger-ui/index.html</code>. Không dòng nào viết tay. Đây là những gì nó sinh cho endpoint quan trọng nhất, khi chưa có annotation tài liệu nào:</p>
${OUT121_TRUOC}
${OUT121_TRUOC2}
<p>Đọc nó như một bạn frontend chưa từng thấy mã Java:</p>
<ul>
  <li><strong>Phản hồi duy nhất là <code>200 OK</code>, kiểu <code>*/*</code>.</strong> Thực tế endpoint trả 201 kèm header <code>Location</code>, 200 khi lặp lại cùng khoá, 400, 401, 409 SLOT_TAKEN và 422 khi sai quy tắc. Không cái nào có trên hợp đồng, nên client sinh ra không có kiểu cho lỗi nào.</li>
  <li><strong><code>purpose</code> có <code>minLength: 0</code></strong> dù trường Java là <code>@NotBlank</code>: springdoc chuyển <code>@Size</code> rất đúng, nhưng "không rỗng" không có tương đương chính xác trong JSON Schema.</li>
  <li><strong><code>BookingView.required</code> là <code>null</code></strong>: mọi trường đều tuỳ chọn, nên TypeScript bắt viết <code>booking.id?.toString()</code> khắp nơi cho một trường chưa bao giờ thiếu.</li>
  <li><strong>operationId là tên phương thức Java</strong>: <code>dat</code>, <code>xem</code>, <code>huy</code>, <code>cuaToi</code> — và <code>cuaToi_1</code>, vì hai controller có phương thức trùng tên. Client sinh ra dùng chúng làm tên hàm.</li>
  <li><strong>Tag là tên lớp</strong>: <code>booking-controller</code>, <code>thong-bao-controller</code>.</li>
</ul>
<p>springdoc đã làm đúng việc: mô tả chính xác những gì mã nói. Chỉ là mã chưa nói đủ.</p>

<h3>2. Nói cho đủ: annotation ở chỗ nó mang nghĩa</h3>
<p>Thêm ba loại thông tin, mỗi loại ở đúng chỗ của nó.</p>
<p><strong>(a) Lỗi mà endpoint nào cũng có thể trả</strong> khai một lần, bằng một bean <code>OpenApiCustomizer</code> duyệt tài liệu đã dựng xong. Endpoint công khai đánh dấu bằng <code>@SecurityRequirements()</code> rỗng, nên không bị gắn 401:</p>
${MA121_APIDOCS}
<p>Thân lỗi được mô tả bằng một record chỉ tồn tại cho hợp đồng — server vẫn trả <code>ProblemDetail</code> của Spring với đúng các trường đó (Chương 5):</p>
${MA121_PROBLEM}
<p><strong>(b) Lỗi nghiệp vụ và header</strong> thuộc về chính endpoint, vì chỉ endpoint đặt phòng mới biết SLOT_TAKEN hay header <code>Idempotent-Replayed</code>:</p>
${MA121_DAT}
${MA121_REQ}
<p><strong>(c) Sự thật về dữ liệu</strong>: trường nào luôn có. Một thuộc tính trên record phản hồi:</p>
${MA121_VIEW}
<p>Cùng request đó giờ trả về:</p>
${OUT121_SAU}
<p>Tài liệu dày gấp đôi (8 759 → 17 906 byte) và byte nào cũng là thông tin mà nếu không có, bạn frontend sẽ nhắn hỏi bạn. Thêm hai chi tiết: <code>springdoc.default-produces-media-type=application/json</code> thay cho <code>*/*</code> mơ hồ, và các operationId tiếng Việt còn lại (<code>tao</code>, <code>dangKy</code>…) để dành cho bạn trong lab.</p>
<div class="callout"><p><strong>Nguyên tắc.</strong> Chú thích những gì mã không tự nói được: mã lỗi nghiệp vụ, header, ví dụ, trường nào luôn có, một câu tóm tắt bằng lời người. Đừng chú thích những gì mã đã nói (đường dẫn, kiểu, validate) — một sự thật ghi hai nơi sẽ lệch nhau.</p></div>

<h3>3. Từ hợp đồng sang TypeScript</h3>
<p>Frontend không đọc JSON; nó sinh kiểu từ JSON bằng <code>openapi-typescript</code> (7.13.0) rồi gọi API qua <code>openapi-fetch</code>, thứ kiểm mọi đường dẫn, tham số và body theo các kiểu đó. Cùng <code>BookingView</code>, sinh từ hai bản hợp đồng:</p>
${OUT121_TS_TRUOC}
${OUT121_TS_SAU}
<p>Và thao tác sinh ra giờ biết mọi kết cục, gồm cả kiểu thân lỗi cho từng mã trạng thái:</p>
${OUT121_TS_CREATE}
<p>Trong React, nó thành: <code>const { data, error, response } = await api.POST("/api/v1/bookings", …)</code>, trong đó <code>data</code> là <code>BookingView</code> còn <code>error</code> là <code>Problem</code> có <code>code</code> để rẽ nhánh. Bài 12.4 dựng trang trên nền này.</p>

<h3>4. Cố ý làm vỡ hợp đồng</h3>
<p>Một bạn backend "dọn dẹp" request và đổi tên <code>purpose</code> thành <code>note</code>. Mã Java biên dịch được, ứng dụng khởi động không một cảnh báo. Ba chuyện xảy ra tiếp theo, đều đo thật.</p>
<p><strong>Bản frontend build từ hôm qua vẫn gửi <code>purpose</code></strong> và mọi lượt đặt đều hỏng:</p>
${OUT121_CLIENT_CU}
<p><strong>Bản frontend sinh lại kiểu từ hợp đồng mới thì không build nổi</strong> — lỗi bị bắt lúc biên dịch, ngay trên máy lập trình viên:</p>
${OUT121_TSC_DOI}
<p><strong>Một bước CI có thể bắt nó trước khi merge</strong>, so hợp đồng của nhánh main với hợp đồng của pull request. <code>oasdiff</code> phân loại từng thay đổi; thêm một trường request bắt buộc là <em>lỗi</em> (client cũ vỡ), bỏ một trường là cảnh báo:</p>
${OUT121_OASDIFF}
<p>Mã thoát khác 0 làm pipeline đỏ. Trong nhóm, thói quen là: CI xuất <code>openapi.json</code> (khởi động ứng dụng, <code>curl /v3/api-docs</code>), so với main, và bắt buộc một quyết định có ý thức — lên phiên bản mới, hoặc đổi theo cách tương thích như thêm một trường <em>tuỳ chọn</em> — cho mọi thứ bị đánh dấu breaking.</p>

<h3>5. Không để trên internet công khai</h3>
<p>Chính springdoc cảnh báo mỗi lần khởi động:</p>
${OUT121_WARN}
<p>Hợp đồng là bản đồ đầy đủ của API — mọi endpoint quản trị, mọi tên tham số, mọi mã lỗi. Đó chính là thứ mà giờ trinh sát đầu tiên của kẻ tấn công cố dựng lại. Tắt nó trong profile production:</p>
${MA121_PROD}
${OUT121_PROD}
<p>Nhóm vẫn có hợp đồng: bản xuất ra trong CI, hoặc Swagger UI trên môi trường dev và staging. Nếu ai đó nhất quyết muốn có nó ở production, hãy đặt sau xác thực (cùng chuỗi Spring Security, luật chỉ cho <code>MANAGER</code>) thay vì <code>permitAll</code>.</p>

<h3>🕵️ Góc hacker — Swagger UI và CVE-2018-25031</h3>
<p>Swagger UI trước bản 4.1.3 nhận tham số <code>?configUrl=</code> hoặc <code>?url=</code> trên địa chỉ trang và nạp bất kỳ đặc tả nào nó trỏ tới. Kẻ tấn công gửi cho nạn nhân một liên kết tới đúng tên miền Swagger UI thật, đáng tin của công ty, nhưng trang lại hiện bản mô tả API do kẻ tấn công viết — với endpoint "đăng nhập" giả hay hướng dẫn giả — dưới danh nghĩa công ty (giả mạo). Lỗi được công bố là CVE-2018-25031; bản sửa biến việc đọc cấu hình từ chuỗi truy vấn thành tuỳ chọn phải bật (<code>queryConfigEnabled: false</code> mặc định). LabFlow dùng Swagger UI 5.32.14 qua springdoc 3.1.1, và cấu hình nó phát ra chỉ trỏ tới <code>/v3/api-docs/swagger-config</code>. Hai bài học: cập nhật giao diện tài liệu như mọi dependency khác, và phần công khai càng ít thì càng ít thứ để lợi dụng.</p>

<h3>So với Node.js</h3>
<p>Trong NestJS, <code>@nestjs/swagger</code> chạy giống springdoc: đọc decorator và lớp DTO (<code>@ApiProperty</code>, <code>@ApiResponse</code>). Với Express thuần, lúc chạy không có thông tin kiểu, nên tài liệu đến từ chú thích (<code>swagger-jsdoc</code> — dễ lệch với mã vì không gì kiểm nó) hoặc từ thư viện schema như Zod kèm <code>zod-to-openapi</code>, nơi cùng một schema vừa validate request vừa sinh hợp đồng. Spring có lợi thế là kiểu và annotation validate đã nằm sẵn trong mã; phía frontend (<code>openapi-typescript</code>, <code>oasdiff</code>) thì giống hệt cho cả hai.</p>

<h3>Khi đi làm</h3>
<p>Có hai trường phái. <strong>Code-first</strong> (bài này): mã là sự thật, hợp đồng được sinh ra. <strong>Contract-first</strong>: nhóm viết <code>openapi.yaml</code> trước, duyệt cùng frontend, rồi sinh interface phía server (<code>openapi-generator</code>) và cài đặt chúng. Contract-first hợp với API công khai và nhóm lớn; code-first kèm một <code>openapi.json</code> được commit và kiểm trong CI hợp với nhóm SWP391 năm người. Dù chọn cách nào, frontend không bao giờ viết theo "backend nói trên chat".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Làm sao giữ frontend và backend khớp nhau?"</strong> — Hợp đồng OpenAPI sinh tự động, được commit và so trong CI (<code>oasdiff breaking</code>), cộng kiểu sinh cho frontend để một thay đổi thành lỗi biên dịch chứ không thành lỗi production.</li>
  <li><strong>"Breaking change trong REST API là gì?"</strong> — Mọi thứ làm client đang có hỏng: bỏ hay đổi tên trường, thêm trường request <em>bắt buộc</em>, đổi kiểu, bỏ endpoint hay bỏ mã trạng thái mà client đang xử lý. Thêm trường tuỳ chọn hay endpoint mới thì không.</li>
  <li><strong>"Code-first hay contract-first?"</strong> — Code-first nhanh hơn và không thể lệch khỏi mã; contract-first cho frontend và backend thống nhất trước khi viết mã. Nói được khi nào chọn cách nào.</li>
  <li><strong>"Có bật Swagger UI ở production không?"</strong> — Không công khai. Tắt trong profile prod, hoặc đặt sau xác thực; phát hành hợp đồng qua artifact của CI hay cổng nội bộ.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Đặt cho mọi endpoint còn lại của LabFlow một <code>operationId</code> tiếng Anh ổn định và một câu tóm tắt. Từ JSON, làm sao chứng minh không còn hậu tố <code>_1</code>?</li>
  <li>Thêm <code>@ApiResponse(responseCode = "409")</code> cho <code>POST /api/v1/bookings/{id}/approve</code> (trường hợp STALE của Chương 7). Sinh lại kiểu TypeScript: thao tác <code>approveBooking</code> sinh ra thay đổi gì?</li>
  <li>Làm một thay đổi <em>tương thích</em> — thêm trường tuỳ chọn <code>notes</code> vào phản hồi — rồi chạy <code>oasdiff breaking</code>. Nó báo gì?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. <code>@Operation(operationId = "register")</code>, <code>"login"</code>, <code>"createLab"</code>, <code>"changeLabStatus"</code>, <code>"listMyNotifications"</code>. Kiểm bằng <code>curl -s localhost:8080/v3/api-docs | jq -r '.paths[][].operationId' | grep -c _</code> — phải in 0 — hoặc để bộ chấm của lab làm (mục 3).</p><p>2. Thêm khoá <code>409</code> trong <code>responses</code> của <code>approveBooking</code>, nội dung <code>"application/problem+json": components["schemas"]["Problem"]</code>. <code>error</code> mà <code>openapi-fetch</code> trả cho lời gọi đó giờ có thêm kiểu này.</p><p>3. Không có breaking change (mã thoát 0). Thêm trường phản hồi tuỳ chọn là tương thích ngược: client cũ bỏ qua trường lạ. Vì vậy "thêm, đừng đổi tên" là cách an toàn để tiến hoá hợp đồng.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>OpenAPI</strong> — chuẩn mô tả API HTTP mà máy đọc được (ở đây bản 3.1).</li>
  <li><strong>springdoc-openapi</strong> — thư viện sinh tài liệu OpenAPI từ mã Spring MVC lúc chạy.</li>
  <li><strong>Swagger UI</strong> — trang web hiển thị tài liệu OpenAPI và cho thử request.</li>
  <li><strong>operationId</strong> — tên duy nhất của một thao tác; thành tên hàm trong client sinh ra.</li>
  <li><strong>OpenApiCustomizer</strong> — điểm móc của springdoc để sửa cả tài liệu sau khi dựng xong.</li>
  <li><strong>Code-first / contract-first</strong> — sinh hợp đồng từ mã, hoặc viết hợp đồng rồi sinh mã từ đó.</li>
  <li><strong>Breaking change</strong> — thay đổi làm client đang có bị hỏng.</li>
  <li><strong>oasdiff</strong> — công cụ so hai tài liệu OpenAPI và phân loại thay đổi.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>springdoc sinh OpenAPI 3.1 từ mã; để mặc định nó chỉ biết những gì mã nói: 200 <code>*/*</code>, mọi trường phản hồi tuỳ chọn, tên phương thức làm operationId (<code>cuaToi_1</code>).</li>
  <li>Lỗi chung khai một lần (customizer), lỗi nghiệp vụ và header khai trên endpoint, trường bắt buộc khai trên record: 8 759 → 17 906 byte thông tin thật.</li>
  <li><code>openapi-typescript</code> biến nó thành kiểu; <code>id?: number</code> thành <code>id: number</code>, mã lỗi nào cũng có kiểu <code>Problem</code>.</li>
  <li>Đổi tên một trường: client cũ nhận 400 VALIDATION, client mới hỏng <code>tsc</code>, <code>oasdiff</code> làm CI đỏ với mã thoát 1.</li>
  <li>Profile production: <code>/v3/api-docs</code> và Swagger UI trả 404.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://springdoc.org/', '📘', 'springdoc-openapi', 'Thuộc tính, customizer, hỗ trợ Spring Boot 4.')}
${tl('https://openapi-ts.dev/', '🧩', 'openapi-typescript và openapi-fetch', 'Kiểu và client fetch có kiểu từ OpenAPI.')}
${tl('https://github.com/oasdiff/oasdiff', '🔍', 'oasdiff', 'Phát hiện breaking change của OpenAPI trong CI.')}
${tl('https://spec.openapis.org/oas/v3.1.0', '📜', 'OpenAPI Specification 3.1.0', 'Bản chuẩn gốc.')}

<h3>Nguồn</h3>
<ul>
  <li>NVD, CVE-2018-25031 (Swagger UI trước 4.1.3, giả mạo qua tham số truy vấn <code>configUrl</code>/<code>url</code>).</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, springdoc 3.1.1, Swagger UI 5.32.14), openapi-typescript 7.13.0, TypeScript 5.9.3, oasdiff, trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 12.2 =====
const MA122_TRANG = java("/** Một khuôn trang cho MỌI danh sách của API (frontend viết một component bảng là đủ). */\nrecord Trang<T>(List<T> items, int page, int size, long totalItems, int totalPages) {\n    static <T> Trang<T> tu(Page<T> p) { return new Trang<>(p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages()); }\n}");
const MA122_SORT = java("private static final Set<String> SAP_XEP = Set.of(\"code\", \"name\", \"capacity\");   // allow-list, không nhận tên cột tuỳ ý\n\n@GetMapping\n@Transactional(readOnly = true)\nTrang<LabInfo> danhSach(@RequestParam(defaultValue = \"\") String q, @RequestParam(required = false) String building,\n                        @RequestParam(defaultValue = \"0\") @Min(0) int page, @RequestParam(defaultValue = \"20\") @Min(1) @Max(100) int size,\n                        @RequestParam(defaultValue = \"code\") String sort) {\n    String[] s = sort.split(\",\");\n    if (!SAP_XEP.contains(s[0])) throw LoiNghiepVu.quyTac(\"BAD_SORT\", \"chỉ sắp xếp theo \" + SAP_XEP);\n    Sort.Direction dir = s.length > 1 && s[1].equalsIgnoreCase(\"desc\") ? Sort.Direction.DESC : Sort.Direction.ASC;\n    return Trang.tu(labs.tim(q, building, PageRequest.of(page, size, Sort.by(dir, s[0]))).map(Lab::info));\n}");
const MA122_VER = java("record LabV1(String code, String name) { }\nrecord LabV2(String code, String name, int capacity, boolean requiresApproval) { }\n@GetMapping(path = \"/ver/{code}\", version = \"1\")\nLabV1 v1(@PathVariable String code) { var l = catalog.timTheoMa(code).orElseThrow(); return new LabV1(l.code(), l.name()); }\n@GetMapping(path = \"/ver/{code}\", version = \"2+\")\nLabV2 v2(@PathVariable String code) { var l = catalog.timTheoMa(code).orElseThrow(); return new LabV2(l.code(), l.name(), l.capacity(), l.requiresApproval()); }");
const MA122_VERPROPS = props("# Chương 12: phiên bản API qua header (Spring Framework 7)\nspring.mvc.apiversion.use.header=API-Version\nspring.mvc.apiversion.default=1\nspring.mvc.apiversion.supported=1,2");
const MA122_401 = java("// identity/internal/BaoMat.java — trong chain(): .exceptionHandling(e -> e.authenticationEntryPoint(loi401()))\n//                                  .oauth2ResourceServer(o -> o.jwt(…).authenticationEntryPoint(loi401()))\n/** 401 mặc định: thân rỗng. Giữ header WWW-Authenticate chuẩn, thêm thân ProblemDetail cùng khuôn với mọi lỗi khác. */\nstatic AuthenticationEntryPoint loi401() {\n    BearerTokenAuthenticationEntryPoint chuan = new BearerTokenAuthenticationEntryPoint();\n    return (q, s, ex) -> {\n        chuan.commence(q, s, ex);\n        s.setContentType(\"application/problem+json\");\n        s.setCharacterEncoding(\"UTF-8\");\n        s.getWriter().write(\"\"\"\n            {\"type\":\"https://labflow.vn/errors/unauthorized\",\"title\":\"Unauthorized\",\"status\":401,\\\n            \"detail\":\"thiếu token, token sai hoặc đã hết hạn\",\"instance\":\"%s\",\"code\":\"UNAUTHORIZED\"}\"\"\".formatted(q.getRequestURI()));\n    };\n}");
const OUT122_PAGE = out("$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/demo/labs-page | jq -c 'del(.content)'\n{\"empty\":false,\"first\":true,\"last\":true,\"number\":0,\"numberOfElements\":4,\"pageable\":{\"offset\":0,\"pageNumber\":0,\"pageSize\":20,\"paged\":true,\"sort\":{\"empty\":true,\"sorted\":false,\"unsorted\":true},\"unpaged\":false},\"size\":20,\"sort\":{\"empty\":true,\"sorted\":false,\"unsorted\":true},\"totalElements\":4,\"totalPages\":1}\n$ curl -s \"localhost:8080/api/v1/labs?size=2&sort=capacity,desc\" | jq -c 'del(.items)'\n{\"page\":0,\"size\":2,\"totalItems\":4,\"totalPages\":2}\n$ curl -s -H \"Authorization: Bearer $AN\" \"localhost:8080/api/v1/bookings/mine?size=2\" | jq -c 'del(.items)'\n{\"page\":0,\"size\":2,\"totalItems\":20,\"totalPages\":10}");
const OUT122_LOC = out("$ curl -s \"localhost:8080/api/v1/labs?building=Beta&sort=name,asc\" | jq -c '[.items[].code]'\n[\"AI-03\",\"HW-04\"]\n$ curl -s \"localhost:8080/api/v1/labs?size=1000\" | jq -c '{status,code,fields}'\n{\"status\":400,\"code\":\"VALIDATION\",\"fields\":{\"size\":\"must be less than or equal to 100\"}}\n$ curl -s \"localhost:8080/api/v1/labs?sort=password\" | jq -c '{status,code,detail}'\n{\"status\":422,\"code\":\"BAD_SORT\",\"detail\":\"chỉ sắp xếp theo [capacity, code, name]\"}");
const OUT122_ID = out("$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/demo/id-lon\n{\"id\":9007199254740993,\"idText\":\"9007199254740993\"}\n$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/demo/id-lon | node -e 'let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const o=JSON.parse(s);console.log(\"JSON.parse ⇒ id =\",o.id,\"· idText =\",o.idText,\"· Number.isSafeInteger(id):\",Number.isSafeInteger(o.id))})'\nJSON.parse ⇒ id = 9007199254740992 · idText = 9007199254740993 · Number.isSafeInteger(id): false");
const OUT122_GIO = out("$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/demo/gio | jq -c .\n{\"local\":\"2026-11-25T09:00:00\",\"offset\":\"2026-11-25T09:00:00+07:00\",\"instant\":\"2026-11-25T02:00:00Z\"}\n$ for tz in Asia/Saigon Europe/London; do TZ=$tz node -e 'const g={local:\"2026-11-25T09:00:00\",offset:\"2026-11-25T09:00:00+07:00\"};console.log(process.env.TZ.padEnd(13),\"local ⇒\",new Date(g.local).toISOString(),\"· offset ⇒\",new Date(g.offset).toISOString())'; done\nAsia/Saigon   local ⇒ 2026-11-25T02:00:00.000Z · offset ⇒ 2026-11-25T02:00:00.000Z\nEurope/London local ⇒ 2026-11-25T09:00:00.000Z · offset ⇒ 2026-11-25T02:00:00.000Z");
const OUT122_LOI = out("$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/khong-co | jq -c '{status,code,detail}'\n{\"status\":404,\"code\":\"NOT_FOUND\",\"detail\":\"No static resource api/v1/khong-co.\"}\n$ curl -s -H \"Authorization: Bearer $AN\" -H \"$J\" -H 'Idempotency-Key: an-json-hong-01' -d '{\"labCode\": \"IOT-01\",' localhost:8080/api/v1/bookings | jq -c '{status,code,detail}'\n{\"status\":400,\"code\":\"BAD_REQUEST\",\"detail\":\"Failed to read request\"}\n$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/bookings/999 | jq -c '{status,code,detail}'\n{\"status\":404,\"code\":\"NOT_FOUND\",\"detail\":\"không tìm thấy lượt đặt 999\"}");
const OUT122_VER = out("$ curl -s -H \"Authorization: Bearer $AN\" localhost:8080/api/v1/demo/ver/IOT-01\n{\"code\":\"IOT-01\",\"name\":\"Lab IoT\"}\n$ curl -s -H \"Authorization: Bearer $AN\" -H 'API-Version: 2' localhost:8080/api/v1/demo/ver/IOT-01\n{\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"requiresApproval\":false}\n$ curl -s -H \"Authorization: Bearer $AN\" -H 'API-Version: 3' localhost:8080/api/v1/demo/ver/IOT-01 | jq -c '{status,code,detail}'\n{\"status\":400,\"code\":\"BAD_REQUEST\",\"detail\":\"Invalid API version: '3.0.0'.\"}");
const OUT122_GOI = out("$ node goi.mjs          # cùng máy, không trễ mạng\nA. 1 + N tuần tự    20 dòng · 21 request · trung vị   288.5 ms\nB. 1 + N song song  20 dòng · 21 request · trung vị    73.4 ms\nC. 1 endpoint gộp   20 dòng ·  1 request · trung vị    12.0 ms\n$ tc qdisc add dev eth0 root netem delay 80ms   # giả mạng di động: mỗi lượt về chậm 80 ms\n$ node goi.mjs\nA. 1 + N tuần tự    20 dòng · 21 request · trung vị  1882.0 ms\nB. 1 + N song song  20 dòng · 21 request · trung vị   212.7 ms\nC. 1 endpoint gộp   20 dòng ·  1 request · trung vị    87.0 ms");
const OUT122_CHROME = out("## Chrome mở http://localhost:5173/ghep.html\n  A. 1 + N tuần tự    20 dòng · 21 request · trung vị  2020 ms\n  B. 1 + N song song  20 dòng · 21 request · trung vị   549 ms\n  C. 1 endpoint gộp   20 dòng ·  1 request · trung vị    91 ms");
const OUT122_401 = out("# Spring Security mặc định\n$ curl -s -i localhost:8080/api/v1/bookings/mine | grep -E '^HTTP|^WWW|^Content-(Type|Length)|^\\{'\nHTTP/1.1 401 \r\nWWW-Authenticate: Bearer resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\r\nContent-Length: 0\r\n\n# sau khi gắn entry point trả ProblemDetail\n$ curl -s -i localhost:8080/api/v1/bookings/mine | grep -E '^HTTP|^WWW|^Content-(Type|Length)|^\\{'\nHTTP/1.1 401 \r\nWWW-Authenticate: Bearer resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\r\nContent-Type: application/problem+json;charset=UTF-8\r\nContent-Length: 202\r\n{\"type\":\"https://labflow.vn/errors/unauthorized\",\"title\":\"Unauthorized\",\"status\":401,\"detail\":\"thiếu token, token sai hoặc đã hết hạn\",\"instance\":\"/api/v1/bookings/mine\",\"code\":\"UNAUTHORIZED\"}");

const L122_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2 · An API frontends love</span>
<h2>Designing APIs frontend developers enjoy</h2>
<p class="lead">An API can be correct and still be miserable to use: every list shaped differently, a screen that needs twenty-one requests, an id that JavaScript silently changes, a time that moves seven hours depending on the laptop, a 401 with no body at all. None of these are bugs in Java — each one becomes a bug in React. This lesson measures six of them on LabFlow, in Node.js and in a real Chrome, and fixes each on the backend, where it is fixed once for every screen.</p>

<h3>Everyday picture first</h3>
<p>You order at a café through an app. A good menu shows the drink, its size and its price on one line. A bad one shows only drink codes, and you tap each code to see its name, then tap again for the price. Each tap is quick in the shop's Wi-Fi and painful on a bus. An API is the menu the frontend reads; it should be shaped for the screen, consistent from page to page, and honest about numbers and times.</p>

<h3>1. One envelope for every list</h3>
<p>Returning Spring Data's <code>Page</code> directly is tempting — it is one line. Here is what the frontend receives (the list itself removed):</p>
${OUT122_PAGE}
<p>The first response is twelve fields of library internals (<code>pageable</code>, <code>sort.unsorted</code>, <code>numberOfElements</code>…) whose names and shape belong to Spring Data's implementation class, not to you; Spring Data itself recommends against serialising <code>PageImpl</code> as-is and offers a stable DTO mode (<code>@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)</code>). LabFlow goes one step further and owns the shape: one small record used by every list, so the frontend writes one table component and one pager:</p>
${MA122_TRANG}

<h3>2. Filtering, sorting and paging by one convention</h3>
<p>The same query parameters everywhere — <code>page</code> (from 0), <code>size</code> (max 100), <code>sort=field,asc|desc</code>, and named filters — and a clear error instead of a silent default when something is wrong:</p>
${MA122_SORT}
${OUT122_LOC}
<p>The sort field goes through an allow-list: it ends up in SQL, and "sort by any column the client names" is how a <code>?sort=password</code> becomes an oracle that leaks hashes one comparison at a time (Chapter 10). An unknown field is an error the frontend developer sees on the first try.</p>

<h3>3. Shape the response for the screen: 1 + N requests</h3>
<p>The "My bookings" screen shows twenty bookings <em>with the lab name</em>, but <code>BookingView</code> only has <code>labCode</code>. The frontend can fetch each lab (1 + 20 requests, one after another or in parallel), or the backend can return what the screen needs in one response. Measured with Node.js, first on the same machine, then with 80 ms added to every response with <code>tc netem</code> (a mobile network):</p>
${OUT122_GOI}
<p>The same three strategies in a real Chrome, same 80 ms:</p>
${OUT122_CHROME}
<p>Parallel requests look like the fix in Node (213 ms), but the browser opens at most <strong>six HTTP/1.1 connections per origin</strong>, so twenty-one requests queue in four waves: 549 ms. The single endpoint costs one round trip: 91 ms, twenty-two times faster than the naive version. The rule: if a screen needs it every time, put it in the response (or offer an endpoint for that screen). This is the problem GraphQL and "backend for frontend" services exist to solve; in a monolith like LabFlow, a well-chosen read endpoint is enough.</p>

<h3>4. Numbers JavaScript cannot hold</h3>
<p>A Java <code>long</code> goes up to 9.2 × 10<sup>18</sup>. A JavaScript <code>number</code> is a double and holds integers exactly only up to 2<sup>53</sup> − 1 (9 007 199 254 740 991):</p>
${OUT122_ID}
<p>No error, no warning — the frontend now has the id of a <em>different</em> record, and a later <code>DELETE /bookings/{id}</code> acts on the wrong one. LabFlow's identity columns will not reach 2<sup>53</sup>, but generated ids such as Snowflake or TSID (time-based 64-bit ids used by many companies) are that large from day one. Rule: an id that may exceed 2<sup>53</sup> travels as a string.</p>

<h3>5. Times: say which clock</h3>
<p><code>LocalDateTime</code> serialises without a time zone. The browser then guesses — using the zone of the laptop:</p>
${OUT122_GIO}
<p>A student in Vietnam and a lecturer at a conference in London see the same booking two different instants. There are two honest options. For <strong>events</strong> (created at, approved at) send an instant with an offset (<code>OffsetDateTime</code> or <code>Instant</code>). For <strong>wall-clock times of a place</strong> — LabFlow's bookings are "9:00 in room IOT-01, Hanoi" — keep the local time, write that in the contract (the <code>@Schema(description)</code> of <code>DatRequest</code> in 12.1) and display it as text, never through <code>new Date()</code>. Lesson 12.4 shows the helper.</p>

<h3>6. Every error in one shape — including the ones Spring Security writes</h3>
<p>The frontend writes one function that turns an error into a message; it only works if every error has the same shape. LabFlow's handler (Chapter 5) covers controllers:</p>
${OUT122_LOI}
<p>But the most common error in a frontend — the token expired — is written by Spring Security's filter, before any controller or <code>@RestControllerAdvice</code> runs:</p>
${OUT122_401}
<p>Default: <code>Content-Length: 0</code>. <code>response.json()</code> throws, and the frontend's error handler crashes on exactly the case it must handle best. The fix keeps the standard <code>WWW-Authenticate</code> header (RFC 6750) and adds the same ProblemDetail body:</p>
${MA122_401}

<h3>7. Versions, when you really must break</h3>
<p>Adding optional fields never needs a new version (12.1). When a response must really change, Spring Framework 7 has API versioning built in: the version is an attribute of the mapping and is read from a header, a query parameter, a path segment or the media type.</p>
${MA122_VERPROPS}
${MA122_VER}
${OUT122_VER}
<p>No header ⇒ the default version 1; <code>API-Version: 2</code> ⇒ the new shape; an unsupported version ⇒ 400 in the usual ProblemDetail shape. The same path, two contracts — old mobile apps keep working while the web moves on. A version in the path (<code>/api/v2/…</code>) is the simpler and more common alternative; both are fine, mixing them is not.</p>

<h3>🕵️ Hacker corner — Peloton, 2021</h3>
<p>In 2021 researchers at Pen Test Partners found that Peloton's API returned private account data — age, gender, city, weight, workout statistics — for any user id, even for profiles set to "private", and at first even without logging in. The privacy setting was applied by the app: the API sent everything and the screen hid what it should not show. Anyone calling the API directly saw it all. It was reported in January and fixed in May 2021. "Shape the response for the screen" has a security half: the backend decides what each caller may see, and returns only that. A field that is filtered out in React has still been sent over the network (OWASP API Security Top 10 2023, API3: Broken Object Property Level Authorization).</p>

<h3>Compared with Node.js</h3>
<p>The same rules apply, with different traps. <code>node-postgres</code> returns <code>bigint</code> columns as <em>strings</em> by default, precisely because of the 2<sup>53</sup> limit; convert them carelessly with <code>Number()</code> and you get the bug above. <code>JSON.stringify</code> refuses <code>BigInt</code> outright — on Node.js 22: <code>TypeError: Do not know how to serialize a BigInt</code>. And Express has no global error shape until you write one, including for authentication middleware — the 401 problem above is not Spring-specific.</p>

<h3>At work</h3>
<p>Write the conventions down on one page of the SWP391 repository (<code>docs/api-conventions.md</code>): envelope for lists, paging parameters, error shape and codes, how times are sent, how ids are sent, when to version. Review every new endpoint against it. Frontend developers will thank you with fewer messages, and the contract (12.1) becomes predictable enough to generate good clients.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"A page is slow because it makes many API calls. What do you do?"</strong> — Measure the requests (DevTools waterfall). Remember the six-connections-per-origin limit on HTTP/1.1. Return the data the screen needs in one response or add a read endpoint for that screen; batch endpoints or GraphQL for more general cases.</li>
  <li><strong>"How do you send dates in a REST API?"</strong> — ISO-8601. Instants with an offset or <code>Z</code> for events; local date-times only for wall-clock values of a place, documented as such. Never let the browser guess the zone.</li>
  <li><strong>"Why might you send a numeric id as a string?"</strong> — JavaScript numbers are exact only up to 2<sup>53</sup> − 1; 64-bit generated ids lose their last digits silently.</li>
  <li><strong>"How do you version a REST API?"</strong> — Prefer compatible evolution (add optional fields). When breaking: version in the path or a header; Spring Framework 7 supports both natively (<code>version</code> attribute on mappings).</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a field <code>labName</code> to <code>BookingView</code> (filled from <code>LabCatalog</code>) and measure "My bookings" again with the 80 ms delay. How many requests does the screen need now?</li>
  <li>Change <code>createdAt</code> of a booking into the response as <code>OffsetDateTime</code>. What exactly does the JSON look like, and what does <code>new Date(createdAt).toISOString()</code> print in Hanoi and in London?</li>
  <li>Configure the access-denied handler too (403 from <code>@PreAuthorize</code> already goes through LabFlow's advice; which 403s do not?).</li>
</ol></div>
${giai('Show the answers', `<p>1. One request (<code>GET /api/v1/bookings/mine</code>), about one round trip (~90 ms with the delay) instead of 21 requests. Keep the field optional in the contract if old clients exist.</p><p>2. Something like <code>"createdAt":"2026-11-25T08:00:00.123+07:00"</code> (Jackson writes the offset of the value). Both time zones print the same instant, <code>2026-11-25T01:00:00.123Z</code> — the offset removes the guess.</p><p>3. 403s raised <em>inside</em> the controller layer (<code>@PreAuthorize</code>) are <code>AccessDeniedException</code>s that reach <code>@RestControllerAdvice</code>. 403s decided by the filter chain itself — an <code>authorizeHttpRequests</code> rule such as <code>.hasRole("MANAGER")</code> on a URL, or a CSRF failure — never reach a controller; they need <code>exceptionHandling(e -> e.accessDeniedHandler(…))</code> writing the same ProblemDetail. A rejected CORS request ("Invalid CORS request", 12.3) is a third path again.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Envelope</strong> — the fixed wrapper around a list (<code>items</code>, <code>page</code>, <code>size</code>, <code>totalItems</code>, <code>totalPages</code>).</li>
  <li><strong>Allow-list</strong> — the explicit set of accepted values (sort fields), everything else rejected.</li>
  <li><strong>1 + N requests</strong> — one request for a list, then one per item; the HTTP cousin of the N+1 query.</li>
  <li><strong>Connection limit per origin</strong> — browsers open about six HTTP/1.1 connections to one origin; extra requests wait.</li>
  <li><strong><code>Number.MAX_SAFE_INTEGER</code></strong> — 2<sup>53</sup> − 1, the largest integer a JavaScript number stores exactly.</li>
  <li><strong>Offset date-time</strong> — a date-time with its UTC offset (<code>+07:00</code>); an instant on the global timeline.</li>
  <li><strong>Authentication entry point</strong> — the Spring Security component that writes the 401 response.</li>
  <li><strong>API versioning</strong> — serving several contract versions side by side; Spring Framework 7 supports it on mappings.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Own the list envelope: 4 fields you chose, not 12 fields of <code>PageImpl</code>.</li>
  <li>One paging/sorting convention, allow-listed sort, explicit 400/422 on bad parameters.</li>
  <li>20 bookings with lab names at 80 ms: 2 020 ms (1 + N), 549 ms (parallel, six connections), 91 ms (one endpoint).</li>
  <li>9007199254740993 arrives as 9007199254740992; large ids travel as strings.</li>
  <li><code>LocalDateTime</code> moves 7 hours between Hanoi and London; send offsets for events, document local times.</li>
  <li>Spring Security's 401 has an empty body by default; give it the same ProblemDetail shape.</li>
  <li>Spring Framework 7 API versioning: <code>version = "1"</code> / <code>"2+"</code>, header <code>API-Version</code>.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html', '🔢', 'Spring Framework — API Versioning', 'Version strategies for Spring MVC.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023', 'Broken Object Property Level Authorization.')}
${tl('https://www.pentestpartners.com/security-blog/tour-de-peloton-exposed-user-data/', '🚲', 'Pen Test Partners — Tour de Peloton', 'The 2021 Peloton API research.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER', '🔢', 'MDN — Number.MAX_SAFE_INTEGER', 'Why 2^53.')}

<h3>Sources</h3>
<ul>
  <li>Pen Test Partners, "Tour de Peloton: Exposed user data", May 2021.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Spring Framework 7) with Chapter 12 demo endpoints, Node.js 22.22.2, Google Chrome 150, <code>tc netem</code>, on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L122_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2 · API mà frontend thích</span>
<h2>Thiết kế API mà frontend dùng thấy dễ chịu</h2>
<p class="lead">Một API có thể đúng mà vẫn khổ khi dùng: mỗi danh sách một khuôn, một màn hình cần hai mươi mốt request, một id bị JavaScript lặng lẽ đổi, một giờ dịch bảy tiếng tuỳ máy tính, một 401 không có thân. Không cái nào là lỗi trong Java — cái nào cũng thành lỗi trong React. Bài này đo sáu cái như vậy trên LabFlow, bằng Node.js và bằng Chrome thật, rồi sửa từng cái ở backend, nơi sửa một lần là đúng cho mọi màn hình.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn gọi đồ ở quán cà phê qua ứng dụng. Thực đơn tốt hiện tên món, cỡ và giá trên một dòng. Thực đơn tệ chỉ hiện mã món, bấm từng mã mới thấy tên, bấm lần nữa mới thấy giá. Mỗi lần bấm thì nhanh khi dùng Wi-Fi của quán và khổ khi đang trên xe buýt. API là thực đơn mà frontend đọc; nó nên có hình dạng hợp với màn hình, nhất quán từ trang này sang trang khác, và trung thực về con số lẫn giờ giấc.</p>

<h3>1. Một khuôn cho mọi danh sách</h3>
<p>Trả thẳng <code>Page</code> của Spring Data rất hấp dẫn — chỉ một dòng. Đây là thứ frontend nhận được (đã bỏ phần danh sách):</p>
${OUT122_PAGE}
<p>Phản hồi đầu là mười hai trường nội bộ của thư viện (<code>pageable</code>, <code>sort.unsorted</code>, <code>numberOfElements</code>…) mà tên và hình dạng thuộc về lớp cài đặt của Spring Data, không thuộc về bạn; chính Spring Data khuyên đừng tuần tự hoá nguyên <code>PageImpl</code> và có chế độ DTO ổn định (<code>@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)</code>). LabFlow đi thêm một bước và tự làm chủ khuôn: một record nhỏ dùng cho mọi danh sách, để frontend viết một component bảng và một bộ phân trang:</p>
${MA122_TRANG}

<h3>2. Lọc, sắp xếp, phân trang theo một quy ước</h3>
<p>Cùng bộ tham số ở mọi nơi — <code>page</code> (từ 0), <code>size</code> (tối đa 100), <code>sort=trường,asc|desc</code>, và các bộ lọc có tên — và báo lỗi rõ thay vì lặng lẽ dùng mặc định khi có gì sai:</p>
${MA122_SORT}
${OUT122_LOC}
<p>Trường sắp xếp đi qua allow-list: nó nằm trong câu SQL, và "sắp theo bất kỳ cột nào client gọi tên" là cách một <code>?sort=password</code> biến thành cái máy dò, rò rỉ hash qua từng lần so sánh (Chương 10). Trường lạ là lỗi mà bạn frontend thấy ngay lần thử đầu.</p>

<h3>3. Trả đúng thứ màn hình cần: 1 + N request</h3>
<p>Màn "Lượt của tôi" hiện hai mươi lượt <em>kèm tên phòng</em>, nhưng <code>BookingView</code> chỉ có <code>labCode</code>. Frontend có thể lấy từng phòng (1 + 20 request, lần lượt hoặc song song), hoặc backend trả luôn thứ màn hình cần trong một phản hồi. Đo bằng Node.js, trước tiên trên cùng máy, rồi thêm 80 ms vào mỗi phản hồi bằng <code>tc netem</code> (như mạng di động):</p>
${OUT122_GOI}
<p>Cùng ba cách trong Chrome thật, cùng 80 ms:</p>
${OUT122_CHROME}
<p>Gọi song song trông như lời giải trong Node (213 ms), nhưng trình duyệt chỉ mở tối đa <strong>sáu kết nối HTTP/1.1 tới một origin</strong>, nên hai mươi mốt request xếp hàng thành bốn đợt: 549 ms. Endpoint gộp chỉ tốn một lượt đi về: 91 ms, nhanh gấp hai mươi hai lần cách ngây thơ. Nguyên tắc: màn hình lần nào cũng cần thì đưa vào phản hồi (hoặc mở một endpoint cho màn hình đó). Đây là bài toán mà GraphQL và các dịch vụ "backend for frontend" sinh ra để giải; trong một khối nguyên như LabFlow, một endpoint đọc chọn khéo là đủ.</p>

<h3>4. Con số JavaScript không giữ nổi</h3>
<p><code>long</code> của Java lên tới 9,2 × 10<sup>18</sup>. <code>number</code> của JavaScript là số thực double, chỉ giữ chính xác số nguyên tới 2<sup>53</sup> − 1 (9 007 199 254 740 991):</p>
${OUT122_ID}
<p>Không lỗi, không cảnh báo — frontend giờ cầm id của một bản ghi <em>khác</em>, và một lệnh <code>DELETE /bookings/{id}</code> sau đó tác động lên nhầm bản ghi. Cột identity của LabFlow sẽ không chạm 2<sup>53</sup>, nhưng id sinh kiểu Snowflake hay TSID (id 64 bit theo thời gian mà nhiều công ty dùng) lớn cỡ đó ngay từ ngày đầu. Nguyên tắc: id có thể vượt 2<sup>53</sup> thì gửi dạng chuỗi.</p>

<h3>5. Giờ giấc: nói rõ là đồng hồ nào</h3>
<p><code>LocalDateTime</code> ra JSON không kèm múi giờ. Trình duyệt bèn đoán — theo múi giờ của máy tính:</p>
${OUT122_GIO}
<p>Một sinh viên ở Việt Nam và một giảng viên đang dự hội thảo ở London thấy cùng một lượt đặt ở hai thời điểm khác nhau. Có hai cách trung thực. Với <strong>sự kiện</strong> (tạo lúc, duyệt lúc) gửi thời điểm kèm độ lệch (<code>OffsetDateTime</code> hoặc <code>Instant</code>). Với <strong>giờ treo tường của một nơi</strong> — lượt đặt của LabFlow là "9:00 tại phòng IOT-01, Hà Nội" — giữ giờ địa phương, ghi rõ điều đó trong hợp đồng (phần <code>@Schema(description)</code> của <code>DatRequest</code> ở bài 12.1) và hiển thị nó như chữ, không bao giờ qua <code>new Date()</code>. Bài 12.4 có hàm phụ cho việc này.</p>

<h3>6. Mọi lỗi một khuôn — kể cả lỗi do Spring Security viết</h3>
<p>Frontend viết một hàm biến lỗi thành câu thông báo; hàm đó chỉ chạy đúng khi mọi lỗi cùng khuôn. Bộ xử lý lỗi của LabFlow (Chương 5) lo phần controller:</p>
${OUT122_LOI}
<p>Nhưng lỗi hay gặp nhất ở frontend — token hết hạn — lại do filter của Spring Security viết, trước khi bất kỳ controller hay <code>@RestControllerAdvice</code> nào chạy:</p>
${OUT122_401}
<p>Mặc định: <code>Content-Length: 0</code>. <code>response.json()</code> ném lỗi, và hàm xử lý lỗi của frontend sập đúng ở trường hợp nó phải xử lý tốt nhất. Cách sửa giữ header <code>WWW-Authenticate</code> chuẩn (RFC 6750) và thêm thân ProblemDetail cùng khuôn:</p>
${MA122_401}

<h3>7. Phiên bản, khi buộc phải phá</h3>
<p>Thêm trường tuỳ chọn không bao giờ cần phiên bản mới (12.1). Khi phản hồi thật sự phải đổi, Spring Framework 7 có sẵn API versioning: phiên bản là thuộc tính của mapping và được đọc từ header, tham số truy vấn, một đoạn đường dẫn hoặc media type.</p>
${MA122_VERPROPS}
${MA122_VER}
${OUT122_VER}
<p>Không có header ⇒ phiên bản mặc định 1; <code>API-Version: 2</code> ⇒ khuôn mới; phiên bản không hỗ trợ ⇒ 400 với khuôn ProblemDetail quen thuộc. Cùng một đường dẫn, hai hợp đồng — ứng dụng di động cũ vẫn chạy trong khi bản web đi tiếp. Đặt phiên bản trong đường dẫn (<code>/api/v2/…</code>) là cách đơn giản và phổ biến hơn; cách nào cũng được, trộn cả hai thì không.</p>

<h3>🕵️ Góc hacker — Peloton, 2021</h3>
<p>Năm 2021, nhóm nghiên cứu Pen Test Partners phát hiện API của Peloton trả dữ liệu tài khoản riêng tư — tuổi, giới tính, thành phố, cân nặng, số liệu tập luyện — cho bất kỳ id người dùng nào, kể cả hồ sơ đặt chế độ "riêng tư", và ban đầu không cần đăng nhập. Cài đặt riêng tư được áp dụng ở ứng dụng: API gửi hết, màn hình giấu những gì không nên hiện. Ai gọi thẳng API thì thấy tất cả. Lỗi được báo từ tháng 1 và sửa vào tháng 5/2021. "Trả đúng thứ màn hình cần" có một nửa là bảo mật: backend quyết định mỗi người gọi được thấy gì, và chỉ trả chừng đó. Trường bị lọc bỏ trong React thì vẫn đã đi qua mạng (OWASP API Security Top 10 2023, API3: Broken Object Property Level Authorization).</p>

<h3>So với Node.js</h3>
<p>Nguyên tắc giống nhau, bẫy khác nhau. <code>node-postgres</code> mặc định trả cột <code>bigint</code> dạng <em>chuỗi</em>, chính vì giới hạn 2<sup>53</sup>; đổi bừa bằng <code>Number()</code> là gặp đúng lỗi ở trên. <code>JSON.stringify</code> từ chối thẳng <code>BigInt</code> — trên Node.js 22: <code>TypeError: Do not know how to serialize a BigInt</code>. Và Express chẳng có khuôn lỗi chung nào cho tới khi bạn tự viết, kể cả cho middleware xác thực — chuyện 401 ở trên không riêng gì Spring.</p>

<h3>Khi đi làm</h3>
<p>Viết các quy ước ra một trang trong repo SWP391 (<code>docs/api-conventions.md</code>): khuôn danh sách, tham số phân trang, khuôn lỗi và mã lỗi, cách gửi giờ, cách gửi id, khi nào lên phiên bản. Duyệt mọi endpoint mới theo trang đó. Bạn frontend sẽ đáp lại bằng ít tin nhắn hỏi hơn, và hợp đồng (12.1) đủ đều đặn để sinh client tốt.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Một trang chậm vì gọi API quá nhiều. Bạn làm gì?"</strong> — Đo các request (thác nước trong DevTools). Nhớ giới hạn sáu kết nối mỗi origin với HTTP/1.1. Trả dữ liệu màn hình cần trong một phản hồi hoặc thêm endpoint đọc cho màn hình đó; endpoint gộp lô hay GraphQL cho trường hợp tổng quát hơn.</li>
  <li><strong>"Gửi ngày giờ trong REST API thế nào?"</strong> — ISO-8601. Thời điểm kèm độ lệch hoặc <code>Z</code> cho sự kiện; giờ địa phương chỉ cho giờ treo tường của một nơi, và ghi rõ như vậy. Đừng bao giờ để trình duyệt đoán múi giờ.</li>
  <li><strong>"Vì sao có khi phải gửi id số dưới dạng chuỗi?"</strong> — Số JavaScript chỉ chính xác tới 2<sup>53</sup> − 1; id sinh 64 bit mất các chữ số cuối mà không báo gì.</li>
  <li><strong>"Đánh phiên bản REST API thế nào?"</strong> — Ưu tiên tiến hoá tương thích (thêm trường tuỳ chọn). Khi phải phá: phiên bản trong đường dẫn hoặc header; Spring Framework 7 hỗ trợ sẵn cả hai (thuộc tính <code>version</code> trên mapping).</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm trường <code>labName</code> vào <code>BookingView</code> (lấy từ <code>LabCatalog</code>) rồi đo lại "Lượt của tôi" với độ trễ 80 ms. Màn hình giờ cần bao nhiêu request?</li>
  <li>Đưa <code>createdAt</code> của lượt đặt vào phản hồi dưới dạng <code>OffsetDateTime</code>. JSON trông chính xác thế nào, và <code>new Date(createdAt).toISOString()</code> in gì ở Hà Nội và ở London?</li>
  <li>Cấu hình thêm bộ xử lý từ chối truy cập (403 từ <code>@PreAuthorize</code> đã đi qua advice của LabFlow; những 403 nào thì không?).</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Một request (<code>GET /api/v1/bookings/mine</code>), khoảng một lượt đi về (~90 ms với độ trễ) thay vì 21 request. Giữ trường là tuỳ chọn trong hợp đồng nếu còn client cũ.</p><p>2. Dạng <code>"createdAt":"2026-11-25T08:00:00.123+07:00"</code> (Jackson ghi độ lệch của chính giá trị). Cả hai múi giờ in cùng một thời điểm, <code>2026-11-25T01:00:00.123Z</code> — độ lệch xoá bỏ việc phải đoán.</p><p>3. 403 sinh ra <em>bên trong</em> tầng controller (<code>@PreAuthorize</code>) là <code>AccessDeniedException</code> đi tới <code>@RestControllerAdvice</code>. 403 do chính chuỗi filter quyết định — một luật <code>authorizeHttpRequests</code> như <code>.hasRole("MANAGER")</code> trên URL, hay CSRF hỏng — không bao giờ tới controller; chúng cần <code>exceptionHandling(e -> e.accessDeniedHandler(…))</code> viết cùng ProblemDetail. Request CORS bị từ chối ("Invalid CORS request", bài 12.3) lại là đường thứ ba.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Envelope (khuôn bọc)</strong> — lớp bọc cố định quanh một danh sách (<code>items</code>, <code>page</code>, <code>size</code>, <code>totalItems</code>, <code>totalPages</code>).</li>
  <li><strong>Allow-list</strong> — tập giá trị được nhận ghi rõ (trường sắp xếp), mọi thứ khác bị từ chối.</li>
  <li><strong>1 + N request</strong> — một request lấy danh sách, rồi mỗi phần tử một request; họ hàng HTTP của N+1 truy vấn.</li>
  <li><strong>Giới hạn kết nối mỗi origin</strong> — trình duyệt mở khoảng sáu kết nối HTTP/1.1 tới một origin; request thừa phải chờ.</li>
  <li><strong><code>Number.MAX_SAFE_INTEGER</code></strong> — 2<sup>53</sup> − 1, số nguyên lớn nhất mà number của JavaScript giữ chính xác.</li>
  <li><strong>Offset date-time</strong> — ngày giờ kèm độ lệch so với UTC (<code>+07:00</code>); một thời điểm trên trục thời gian chung.</li>
  <li><strong>Authentication entry point</strong> — thành phần của Spring Security viết phản hồi 401.</li>
  <li><strong>API versioning</strong> — phục vụ song song nhiều phiên bản hợp đồng; Spring Framework 7 hỗ trợ ngay trên mapping.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tự làm chủ khuôn danh sách: 4 trường bạn chọn, không phải 12 trường của <code>PageImpl</code>.</li>
  <li>Một quy ước phân trang/sắp xếp, sắp xếp qua allow-list, 400/422 rõ ràng khi tham số sai.</li>
  <li>20 lượt kèm tên phòng ở 80 ms: 2 020 ms (1 + N), 549 ms (song song, sáu kết nối), 91 ms (một endpoint).</li>
  <li>9007199254740993 tới nơi thành 9007199254740992; id lớn gửi dạng chuỗi.</li>
  <li><code>LocalDateTime</code> dịch 7 tiếng giữa Hà Nội và London; gửi độ lệch cho sự kiện, ghi rõ giờ địa phương.</li>
  <li>401 của Spring Security mặc định thân rỗng; cho nó cùng khuôn ProblemDetail.</li>
  <li>API versioning của Spring Framework 7: <code>version = "1"</code> / <code>"2+"</code>, header <code>API-Version</code>.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html', '🔢', 'Spring Framework — API Versioning', 'Các cách đánh phiên bản cho Spring MVC.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023', 'Broken Object Property Level Authorization.')}
${tl('https://www.pentestpartners.com/security-blog/tour-de-peloton-exposed-user-data/', '🚲', 'Pen Test Partners — Tour de Peloton', 'Nghiên cứu API Peloton năm 2021.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER', '🔢', 'MDN — Number.MAX_SAFE_INTEGER', 'Vì sao là 2^53.')}

<h3>Nguồn</h3>
<ul>
  <li>Pen Test Partners, "Tour de Peloton: Exposed user data", tháng 5/2021.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Spring Framework 7) cùng các endpoint demo của Chương 12, Node.js 22.22.2, Google Chrome 150, <code>tc netem</code>, trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 12.3 =====
const MA123_CORS = java("@Bean\nCorsConfigurationSource corsConfigurationSource(@Value(\"${labflow.cors.origins}\") List<String> origins) {\n    CorsConfiguration c = new CorsConfiguration();\n    c.setAllowedOrigins(origins);                    // liệt kê đúng origin của frontend, không \"*\"\n    c.setAllowedMethods(List.of(\"GET\", \"POST\", \"PATCH\", \"DELETE\"));\n    c.setAllowedHeaders(List.of(\"Authorization\", \"Content-Type\", \"Idempotency-Key\"));\n    c.setExposedHeaders(List.of(\"Location\", \"Idempotent-Replayed\"));   // không khai ⇒ JavaScript đọc ra null\n    c.setMaxAge(3600L);\n    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();\n    s.registerCorsConfiguration(\"/api/**\", c);\n    return s;\n}");
const MA123_CHAIN = java("@Bean\nSecurityFilterChain chain(HttpSecurity http) throws Exception {\n    http.cors(Customizer.withDefaults())\n        .csrf(c -> c.disable())                         // chỉ Bearer token trong header, không cookie phiên\n    // … như Chương 9");
const MA123_DAT = js("// dat.html — trang thử ở origin http://localhost:5173 (script type=module)\nconst API = 'http://localhost:8080';\nconst [email, pw, khoa, gio] = decodeURIComponent(location.hash.slice(1)).split('|');\nconst J = { 'Content-Type': 'application/json' };\ntry {\n  let r = await fetch(API + '/api/v1/auth/login', { method: 'POST', headers: J, body: JSON.stringify({ email, password: pw }) });\n  const token = (await r.json()).accessToken;\n  console.log(`đăng nhập: ${r.status}`);\n  const body = JSON.stringify({ labCode: 'HW-04', startAt: `2026-11-27T${gio}`, endAt: `2026-11-27T${gio.replace(':00', ':30')}`, purpose: 'thử CORS' });\n  for (const lan of [1, 2]) {\n    r = await fetch(API + '/api/v1/bookings', { method: 'POST', headers: { ...J, Authorization: `Bearer ${token}`, 'Idempotency-Key': khoa }, body });\n    const b = await r.json(); if (!r.ok) console.log(`lần ${lan}: ${r.status} ${b.code}`);\n    console.log(`lần ${lan}: ${r.status} id=${b.id} · Location=${r.headers.get('Location')} · Idempotent-Replayed=${r.headers.get('Idempotent-Replayed')} · JS thấy header: ${[...r.headers.keys()].join(', ')}`);\n  }\n} catch (e) { console.log('lỗi: ' + e); }");
const OUT123_KHAC = out("## Chrome mở http://localhost:5173/thu.html\n[console.log] origin của trang: http://localhost:5173\n[console.error] Access to fetch at 'http://localhost:8080/api/v1/labs?size=1' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.\n[mạng] GET http://localhost:8080/api/v1/labs?size=1 ⇒ net::ERR_FAILED\n[console.error] Failed to load resource: net::ERR_FAILED\n[console.log] fetch lỗi: TypeError: Failed to fetch\n## log server (filter REQ đứng trước Security)\nGET /api/v1/labs?size=1 origin=http://localhost:5173 -> 403\n$ curl -s -i -H 'Origin: http://localhost:5173' localhost:8080/api/v1/labs?size=1 | grep -E '^HTTP|^Content-Length|^Vary|Invalid'\nHTTP/1.1 403 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\nInvalid CORS request\n$ curl -s 'localhost:8080/api/v1/labs?size=1' | head -c 60      # không gửi Origin (curl, Postman, server khác)\n{\"items\":[{\"id\":3,\"code\":\"AI-03\",\"name\":\"Lab AI\",\"capacity\":");
const OUT123_TAT = out("## Chrome mở http://localhost:5173/thu.html\n[console.log] origin của trang: http://localhost:5173\n[console.error] Access to fetch at 'http://localhost:8080/api/v1/labs?size=1' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.\n[mạng] GET http://localhost:8080/api/v1/labs?size=1 ⇒ net::ERR_FAILED\n[console.error] Failed to load resource: net::ERR_FAILED\n[console.log] fetch lỗi: TypeError: Failed to fetch\n## Chrome mở http://localhost:5173/dat.html\n[console.error] Access to fetch at 'http://localhost:8080/api/v1/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.\n[mạng] POST http://localhost:8080/api/v1/auth/login ⇒ net::ERR_FAILED\n[console.error] Failed to load resource: net::ERR_FAILED\n[console.log] lỗi: TypeError: Failed to fetch\n## log server\nGET /api/v1/labs?size=1 origin=http://localhost:5173 -> 200\nOPTIONS /api/v1/auth/login origin=http://localhost:5173 -> 200");
const OUT123_TAT_CURL = out("$ curl -s -i -X OPTIONS -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: authorization,content-type,idempotency-key' localhost:8080/api/v1/bookings | head -4\nHTTP/1.1 401 \r\nWWW-Authenticate: Bearer resource_metadata=\"http://localhost:8080/.well-known/oauth-protected-resource\"\r\nX-Content-Type-Options: nosniff\r\nX-XSS-Protection: 0");
const OUT123_THIEU = out("## Chrome mở http://localhost:5173/dat.html\n[console.log] đăng nhập: 200\n[console.log] lần 1: 201 id=21 · Location=null · Idempotent-Replayed=null · JS thấy header: cache-control, content-type, expires, pragma\n[console.log] lần 2: 200 id=21 · Location=null · Idempotent-Replayed=null · JS thấy header: cache-control, content-type, expires, pragma\n## log server\nOPTIONS /api/v1/auth/login origin=http://localhost:5173 -> 200\nPOST /api/v1/auth/login origin=http://localhost:5173 -> 200\nOPTIONS /api/v1/bookings origin=http://localhost:5173 -> 200\nPOST /api/v1/bookings origin=http://localhost:5173 -> 201\nPOST /api/v1/bookings origin=http://localhost:5173 -> 200");
const OUT123_DUNG = out("## Chrome mở http://localhost:5173/dat.html\n[console.log] đăng nhập: 200\n[console.log] lần 1: 201 id=22 · Location=/api/v1/bookings/22 · Idempotent-Replayed=null · JS thấy header: cache-control, content-type, expires, location, pragma\n[console.log] lần 2: 200 id=22 · Location=null · Idempotent-Replayed=true · JS thấy header: cache-control, content-type, expires, idempotent-replayed, pragma\n## log server\nOPTIONS /api/v1/auth/login origin=http://localhost:5173 -> 200\nPOST /api/v1/auth/login origin=http://localhost:5173 -> 200\nOPTIONS /api/v1/bookings origin=http://localhost:5173 -> 200\nPOST /api/v1/bookings origin=http://localhost:5173 -> 201\nPOST /api/v1/bookings origin=http://localhost:5173 -> 200");
const OUT123_MAXAGE = out("## Chrome mở http://localhost:5173/nam.html\n[console.log] 5 lần POST: 201 201 201 201 201\n## max-age=3600 — server đếm được: OPTIONS /api/v1/bookings = 1 · POST /api/v1/bookings = 5\n## Chrome mở http://localhost:5173/nam.html\n[console.log] 5 lần POST: 201 201 201 201 201\n## max-age=0 — server đếm được: OPTIONS /api/v1/bookings = 5 · POST /api/v1/bookings = 5");
const OUT123_SAO = out("## Chrome mở http://localhost:5173/thu.html\n[console.log] origin của trang: http://localhost:5173\n[console.error] Access to fetch at 'http://localhost:8080/api/v1/labs?size=1' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.\n[mạng] GET http://localhost:8080/api/v1/labs?size=1 ⇒ net::ERR_FAILED\n[console.error] Failed to load resource: net::ERR_FAILED\n[console.log] fetch lỗi: TypeError: Failed to fetch\n## log server\nGET /api/v1/labs?size=1 origin=http://localhost:5173 -> 500\n## log lỗi\nERROR Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception\njava.lang.IllegalArgumentException: When allowCredentials is true, allowedOrigins cannot contain the special value \"*\" since that cannot be set on the \"Access-Control-Allow-Origin\" response header. To allow credentials to a set of origins, list them explicitly or consider using \"allowedOriginPatterns\" instead.");
const OUT123_PHAN = out("$ curl -s -D - -o /dev/null -H 'Origin: http://localhost:5173' localhost:8080/api/v1/labs | grep -i access-control\nVary: Access-Control-Request-Method\r\nVary: Access-Control-Request-Headers\r\nAccess-Control-Allow-Origin: http://localhost:5173\r\nAccess-Control-Expose-Headers: Location, Idempotent-Replayed\r\nAccess-Control-Allow-Credentials: true\r\n$ curl -s -D - -o /dev/null -H 'Origin: http://localhost:5174' localhost:8080/api/v1/labs | grep -i access-control\nVary: Access-Control-Request-Method\r\nVary: Access-Control-Request-Headers\r\nAccess-Control-Allow-Origin: http://localhost:5174\r\nAccess-Control-Expose-Headers: Location, Idempotent-Replayed\r\nAccess-Control-Allow-Credentials: true\r\n$ curl -s -D - -o /dev/null -H 'Origin: https://ke-xau.example' localhost:8080/api/v1/labs | grep -i access-control\nVary: Access-Control-Request-Method\r\nVary: Access-Control-Request-Headers\r\nAccess-Control-Allow-Origin: https://ke-xau.example\r\nAccess-Control-Expose-Headers: Location, Idempotent-Replayed\r\nAccess-Control-Allow-Credentials: true");

const L123_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3 · An API frontends love</span>
<h2>CORS configured correctly</h2>
<p class="lead">"It works in Postman but the browser says CORS" is the most common message a backend developer receives from a frontend developer in their first week together. The usual answer — copy <code>allowedOrigins("*")</code> from a forum — either crashes or opens a real hole. This lesson runs every configuration in a real Google Chrome against LabFlow, with a filter on the server that logs every request <em>before</em> Spring Security sees it, so you can see both sides: what the browser blocked, and what the server actually did.</p>

<h3>Everyday picture first</h3>
<p>Your browser is a careful assistant who carries your ID card (cookies, saved logins) everywhere. When a web page asks the assistant to fetch something from another website, the assistant does fetch it — but before handing the answer to that page, it checks a note from the other website: "pages from these addresses may read my answers". No note, no hand-over. The note is CORS. Notice who it protects: <strong>you, the user</strong>, from a random page reading your data with your ID card. It does not stop anyone from walking into the other website directly.</p>

<h3>1. Origins, and what the browser actually enforces</h3>
<p>An <strong>origin</strong> is scheme + host + port. <code>http://localhost:5173</code> (the React dev server) and <code>http://localhost:8080</code> (LabFlow) are different origins because the port differs. By the <strong>same-origin policy</strong>, JavaScript on the first may <em>send</em> requests to the second, but may not <em>read</em> the responses unless the second answers with <code>Access-Control-Allow-Origin</code> naming the first. All experiments below use a test page served from the frontend origin and LabFlow's CORS settings changed between runs. (On the build machine the ports were different; outputs are shown with the default ports.)</p>

<h3>2. An origin that is not on the list</h3>
<p>LabFlow configured for production only (<code>LABFLOW_CORS_ORIGINS=https://labflow.vn</code>), page opened from <code>localhost:5173</code>:</p>
${OUT123_KHAC}
<p>Two facts at once. Chrome refused to give the page the response. And Spring's <code>CorsFilter</code> did more than the standard requires: it saw an <code>Origin</code> that is not allowed and answered <code>403 Invalid CORS request</code> without calling the controller. But look at the last command: <code>curl</code> sends no <code>Origin</code>, so it is not a CORS request at all, and it gets the data. <strong>CORS is not access control.</strong> Anything that must be private needs authentication and authorization (Chapters 9–10); CORS only decides which <em>web pages</em> may read responses inside a browser.</p>

<h3>3. Simple requests, preflights, and forgetting <code>http.cors()</code></h3>
<p>A plain <code>GET</code> without custom headers is a <strong>simple request</strong>: the browser sends it immediately. A <code>POST</code> with <code>Content-Type: application/json</code>, or any request with an <code>Authorization</code> or <code>Idempotency-Key</code> header, is not: the browser first sends a <strong>preflight</strong> — <code>OPTIONS</code> with <code>Access-Control-Request-Method</code> and <code>Access-Control-Request-Headers</code> — and sends the real request only if the answer allows it. Every request LabFlow's frontend makes, except listing labs, is preflighted.</p>
<p>Now the classic mistake: a <code>CorsConfigurationSource</code> bean exists, but the security chain never calls <code>http.cors(…)</code>:</p>
${OUT123_TAT}
${OUT123_TAT_CURL}
<p>The server log tells the real story. The simple <code>GET</code> was <em>executed</em> (200) — the browser only refused to show the result. That matters: a cross-site simple <code>POST</code> (a form) would also be executed. The preflight for login reached Spring MVC, which answered <code>OPTIONS</code> with 200 but no CORS headers. And the preflight for <code>/api/v1/bookings</code> never got that far: the browser does not send <code>Authorization</code> on a preflight, so Spring Security answered 401. A preflight must be answered before authentication — which is exactly what <code>http.cors()</code> does: it puts <code>CorsFilter</code> in the chain ahead of the authentication filters (Chapter 9.1).</p>

<h3>4. The correct configuration, and the headers JavaScript cannot see</h3>
${MA123_CORS}
${MA123_CHAIN}
<p>The test page logs in, books a slot, then presses "Book" again with the same idempotency key, and prints the headers JavaScript can read:</p>
${MA123_DAT}
<p>With everything except <code>setExposedHeaders</code> (this is how LabFlow left Chapter 18):</p>
${OUT123_THIEU}
<p>Both requests succeeded on the server — 201, then 200 for the replay — but the page sees <code>Location=null</code> and <code>Idempotent-Replayed=null</code>. Cross-origin, JavaScript may only read the <em>CORS-safelisted</em> response headers (<code>Cache-Control</code>, <code>Content-Language</code>, <code>Content-Length</code>, <code>Content-Type</code>, <code>Expires</code>, <code>Last-Modified</code>, <code>Pragma</code>); everything else must be named in <code>Access-Control-Expose-Headers</code>. The frontend code that tells the user "you already booked this" silently never fires. Notice that the Node.js smoke test in 18.4 could not catch this: CORS exists only in browsers. With the exposed headers:</p>
${OUT123_DUNG}

<h3>5. Preflight cost and <code>max-age</code></h3>
<p>Each preflight is a full round trip before the real request. <code>Access-Control-Max-Age</code> lets the browser remember the answer. Five bookings in a row, counted on the server:</p>
${OUT123_MAXAGE}
<p>With 3 600 s, one preflight for five requests; with 0, a preflight before every request — on the 80 ms network of 12.2 that is 80 ms added to every click. Chrome caps the value at two hours, so larger numbers do not help.</p>

<h3>6. Two configurations from the internet</h3>
<p><strong>"Allow everything, with credentials":</strong> <code>allowedOrigins("*")</code> plus <code>allowCredentials(true)</code>. The CORS specification forbids the combination, and Spring enforces it — not at startup, but on the first request:</p>
${OUT123_SAO}
<p>The application starts fine, every cross-origin request returns 500, and the browser reports it as a CORS error because the 500 has no CORS headers. The forum's next suggestion "fixes" it:</p>
<p><strong>"Then use patterns":</strong> <code>allowedOriginPatterns("*")</code> with credentials. Now Spring copies whatever <code>Origin</code> arrives into the response:</p>
${OUT123_PHAN}
<p>Every website on the internet is now trusted to read responses with the user's credentials. LabFlow sends its token in an <code>Authorization</code> header that a foreign page cannot obtain, which limits the damage — but the day someone adds a cookie-based login or a session cookie, any page the user visits can read their data. That is the next section.</p>

<h3>🕵️ Hacker corner — "CORS misconfigurations for Bitcoins and bounties", 2016</h3>
<p>At AppSec USA in October 2016, James Kettle (PortSwigger) presented research on exactly this reflection bug. He found sites that echoed any <code>Origin</code> back with <code>Access-Control-Allow-Credentials: true</code> — among them a bitcoin exchange, where a malicious page visited by a logged-in user could read the user's private API key and move their coins. Other variants he documented: trusting the <code>null</code> origin (which sandboxed iframes and local files can send), and validating origins with "ends with example.com", which also accepts <code>evilexample.com</code>. Prevention is boring and effective: an exact list of origins per environment, no reflection, no <code>null</code>, credentials only when you really use cookies, and a test that a foreign origin gets no <code>Access-Control-Allow-Origin</code> (item 7 of this chapter's lab grader).</p>

<h3>Compared with Node.js</h3>
<p>Express uses the <code>cors</code> middleware. Its option <code>origin: true</code> means "reflect the request origin" — together with <code>credentials: true</code> it is the same hole as <code>allowedOriginPatterns("*")</code> above, and it appears in many tutorials. The correct form is the same idea as Spring's: <code>origin: ["https://labflow.vn"]</code> from configuration. The middleware must also run before authentication, for the same preflight reason.</p>

<h3>At work</h3>
<p>Two good setups. <strong>Same origin in production</strong>: a reverse proxy serves the React build and forwards <code>/api</code> to Spring Boot under one domain — no CORS at all, nothing to misconfigure. <strong>Separate domains</strong> (<code>app.labflow.vn</code> and <code>api.labflow.vn</code>): exact origins from an environment variable (<code>LABFLOW_CORS_ORIGINS</code>), different for dev, staging and production. In development, the Vite proxy (12.4) also makes the browser see one origin. The configuration lives in one bean; reviewers should reject any <code>*</code> next to credentials.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is CORS and what does it protect?"</strong> — A browser mechanism that relaxes the same-origin policy for origins the server names. It protects users from other websites reading responses with their credentials; it does not protect the server from direct requests.</li>
  <li><strong>"Why does my POST trigger an OPTIONS request?"</strong> — It is not a simple request (JSON content type, <code>Authorization</code> header…), so the browser sends a preflight. The server must answer it, before authentication, with the allowed methods and headers.</li>
  <li><strong>"Why not <code>*</code>?"</strong> — With credentials it is forbidden (Spring throws <code>IllegalArgumentException</code>); replacing it with origin reflection trusts every site. Without credentials <code>*</code> is acceptable only for truly public data.</li>
  <li><strong>"The frontend cannot read the <code>Location</code> header. Why?"</strong> — Cross-origin, only safelisted headers are readable; add it to <code>Access-Control-Expose-Headers</code>.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>With the correct configuration, send a preflight with <code>Access-Control-Request-Headers: x-debug</code> using curl. What status and headers come back, and would Chrome send the real request?</li>
  <li>The allowed methods are <code>GET, POST, PATCH, DELETE</code>. From the test page, send <code>fetch(API + '/api/v1/bookings/1', { method: 'PUT' })</code>. What does the server log show, and what does Chrome print?</li>
  <li>Allow <code>https://*.labflow.vn</code> with <code>allowedOriginPatterns</code>. Which of these origins pass: <code>https://app.labflow.vn</code>, <code>https://labflow.vn</code>, <code>https://evil-labflow.vn</code>, <code>http://app.labflow.vn</code>?</li>
</ol></div>
${giai('Show the answers', `<p>1. Spring rejects a preflight that asks for a header not on the list: <code>403</code> with the body <code>Invalid CORS request</code> and no <code>Access-Control-Allow-*</code> headers. Chrome does not send the real request and reports a failed preflight.</p><p>2. Only the preflight reaches the server, and Spring rejects it (<code>403 Invalid CORS request</code>, no CORS headers) because <code>PUT</code> is not allowed. Chrome prints "Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource" and the <code>fetch</code> fails with <code>TypeError: Failed to fetch</code>. The <code>PUT</code> itself is never sent.</p><p>3. Only <code>https://app.labflow.vn</code>. The pattern requires the <code>https</code> scheme, at least one subdomain label, and the exact suffix <code>.labflow.vn</code>; <code>evil-labflow.vn</code> does not end with <code>.labflow.vn</code>. Add <code>https://labflow.vn</code> separately if the apex domain needs access.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Origin</strong> — scheme + host + port of a page or a server.</li>
  <li><strong>Same-origin policy</strong> — browser rule: a page may only read responses from its own origin unless CORS allows more.</li>
  <li><strong>Simple request</strong> — a request the browser sends without asking first (GET/HEAD/POST with safelisted headers and form/text content types).</li>
  <li><strong>Preflight</strong> — the <code>OPTIONS</code> request the browser sends first to ask whether the real request is allowed.</li>
  <li><strong><code>Access-Control-Expose-Headers</code></strong> — response headers JavaScript may read cross-origin, beyond the safelist.</li>
  <li><strong><code>Access-Control-Max-Age</code></strong> — how long the browser may cache a preflight result.</li>
  <li><strong>Credentials</strong> — cookies, HTTP authentication and client certificates sent with a cross-origin request.</li>
  <li><strong>Origin reflection</strong> — copying the request's <code>Origin</code> into <code>Access-Control-Allow-Origin</code>; trusting everyone.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>CORS protects users inside browsers; curl and servers ignore it. Spring answers a disallowed origin with 403 "Invalid CORS request".</li>
  <li>Without <code>http.cors()</code>: simple GET executed (200) but unreadable; preflight to a protected path ⇒ 401.</li>
  <li>Without <code>exposedHeaders</code>: <code>Location</code> and <code>Idempotent-Replayed</code> read as <code>null</code> although the server sent them.</li>
  <li><code>max-age</code> 3 600 s: 1 preflight per 5 requests; 0: 5 preflights.</li>
  <li><code>*</code> + credentials ⇒ 500 on every request; <code>allowedOriginPatterns("*")</code> + credentials ⇒ every origin trusted (Kettle, 2016).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html', '🛡️', 'Spring Security — CORS', 'Why CORS must be processed before authentication.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — Cross-Origin Resource Sharing', 'Simple requests, preflight, safelisted headers.')}
${tl('https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties', '🕵️', 'PortSwigger — CORS for Bitcoins and bounties', 'James Kettle, 2016.')}
${tl('https://fetch.spec.whatwg.org/#http-cors-protocol', '📜', 'Fetch Standard — CORS protocol', 'The specification browsers implement.')}

<h3>Sources</h3>
<ul>
  <li>J. Kettle, "Exploiting CORS misconfigurations for Bitcoins and bounties", PortSwigger Research / AppSec USA, October 2016.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Spring Security 7) with a request-logging filter at the highest order, Google Chrome 150 headless driven by Playwright, on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L123_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3 · API mà frontend thích</span>
<h2>Cấu hình CORS đúng cách</h2>
<p class="lead">"Postman chạy được mà trình duyệt báo CORS" là tin nhắn phổ biến nhất mà bạn backend nhận từ bạn frontend trong tuần đầu làm chung. Câu trả lời quen tay — chép <code>allowedOrigins("*")</code> từ diễn đàn — hoặc làm sập, hoặc mở ra một lỗ hổng thật. Bài này chạy từng cấu hình trong Google Chrome thật với LabFlow, kèm một filter ở server ghi lại mọi request <em>trước khi</em> Spring Security nhìn thấy, để bạn thấy cả hai phía: trình duyệt chặn gì, và server thực sự đã làm gì.</p>

<h3>Đời thường trước đã</h3>
<p>Trình duyệt của bạn là một trợ lý cẩn thận luôn mang theo thẻ căn cước của bạn (cookie, đăng nhập đã lưu). Khi một trang web nhờ trợ lý lấy thứ gì đó từ một website khác, trợ lý vẫn đi lấy — nhưng trước khi đưa câu trả lời cho trang đó, nó xem một tờ giấy của website kia: "các trang từ những địa chỉ này được đọc câu trả lời của tôi". Không có giấy thì không đưa. Tờ giấy đó là CORS. Để ý xem nó bảo vệ ai: <strong>bạn, người dùng</strong>, khỏi một trang bất kỳ đọc dữ liệu của bạn bằng thẻ căn cước của bạn. Nó không ngăn ai đi thẳng vào website kia.</p>

<h3>1. Origin, và thứ trình duyệt thực sự kiểm</h3>
<p><strong>Origin</strong> là scheme + host + port. <code>http://localhost:5173</code> (server dev của React) và <code>http://localhost:8080</code> (LabFlow) là hai origin khác nhau vì khác cổng. Theo <strong>chính sách cùng nguồn</strong> (same-origin policy), JavaScript ở origin thứ nhất được <em>gửi</em> request tới origin thứ hai, nhưng không được <em>đọc</em> phản hồi trừ khi origin thứ hai trả lời bằng <code>Access-Control-Allow-Origin</code> ghi tên origin thứ nhất. Mọi thí nghiệm dưới đây dùng một trang thử phục vụ từ origin của frontend, và đổi cấu hình CORS của LabFlow giữa các lượt. (Trên máy dựng bài cổng khác; output hiện theo cổng mặc định.)</p>

<h3>2. Một origin không có trong danh sách</h3>
<p>LabFlow chỉ cấu hình cho production (<code>LABFLOW_CORS_ORIGINS=https://labflow.vn</code>), trang mở từ <code>localhost:5173</code>:</p>
${OUT123_KHAC}
<p>Hai sự thật cùng lúc. Chrome từ chối đưa phản hồi cho trang. Và <code>CorsFilter</code> của Spring làm nhiều hơn chuẩn đòi hỏi: thấy một <code>Origin</code> không được phép là trả <code>403 Invalid CORS request</code>, không gọi controller. Nhưng nhìn lệnh cuối: <code>curl</code> không gửi <code>Origin</code>, nên đó hoàn toàn không phải request CORS, và nó lấy được dữ liệu. <strong>CORS không phải là kiểm soát truy cập.</strong> Thứ gì cần riêng tư phải có xác thực và phân quyền (Chương 9–10); CORS chỉ quyết định <em>trang web</em> nào được đọc phản hồi bên trong trình duyệt.</p>

<h3>3. Request đơn giản, preflight, và quên <code>http.cors()</code></h3>
<p>Một <code>GET</code> trơn không header riêng là <strong>request đơn giản</strong>: trình duyệt gửi ngay. Một <code>POST</code> có <code>Content-Type: application/json</code>, hay bất kỳ request nào có header <code>Authorization</code> hoặc <code>Idempotency-Key</code>, thì không: trình duyệt gửi trước một <strong>preflight</strong> — <code>OPTIONS</code> kèm <code>Access-Control-Request-Method</code> và <code>Access-Control-Request-Headers</code> — và chỉ gửi request thật nếu câu trả lời cho phép. Mọi request mà frontend LabFlow gửi, trừ lấy danh sách phòng, đều có preflight.</p>
<p>Giờ là lỗi kinh điển: bean <code>CorsConfigurationSource</code> có rồi, nhưng chuỗi bảo mật không hề gọi <code>http.cors(…)</code>:</p>
${OUT123_TAT}
${OUT123_TAT_CURL}
<p>Log server kể câu chuyện thật. <code>GET</code> đơn giản đã được <em>thực thi</em> (200) — trình duyệt chỉ từ chối cho xem kết quả. Điều đó quan trọng: một <code>POST</code> đơn giản từ site khác (một form) cũng sẽ được thực thi. Preflight của đăng nhập tới được Spring MVC, nơi trả <code>OPTIONS</code> 200 nhưng không có header CORS. Còn preflight của <code>/api/v1/bookings</code> không đi xa được thế: trình duyệt không gửi <code>Authorization</code> kèm preflight, nên Spring Security trả 401. Preflight phải được trả lời trước bước xác thực — đúng việc mà <code>http.cors()</code> làm: nó đặt <code>CorsFilter</code> vào chuỗi, đứng trước các filter xác thực (Chương 9.1).</p>

<h3>4. Cấu hình đúng, và những header JavaScript không nhìn thấy</h3>
${MA123_CORS}
${MA123_CHAIN}
<p>Trang thử đăng nhập, đặt một khung giờ, rồi bấm "Đặt" lần nữa với cùng khoá idempotency, và in ra các header mà JavaScript đọc được:</p>
${MA123_DAT}
<p>Đủ mọi thứ trừ <code>setExposedHeaders</code> (đây chính là cách LabFlow rời Chương 18):</p>
${OUT123_THIEU}
<p>Cả hai request đều thành công ở server — 201, rồi 200 cho lần lặp lại — nhưng trang thấy <code>Location=null</code> và <code>Idempotent-Replayed=null</code>. Khác origin, JavaScript chỉ được đọc các header phản hồi <em>nằm trong danh sách an toàn của CORS</em> (<code>Cache-Control</code>, <code>Content-Language</code>, <code>Content-Length</code>, <code>Content-Type</code>, <code>Expires</code>, <code>Last-Modified</code>, <code>Pragma</code>); mọi header khác phải ghi tên trong <code>Access-Control-Expose-Headers</code>. Đoạn mã frontend báo người dùng "bạn đã đặt lượt này rồi" lặng lẽ không bao giờ chạy. Để ý rằng bài smoke test bằng Node.js ở 18.4 không thể bắt lỗi này: CORS chỉ tồn tại trong trình duyệt. Khi đã khai header:</p>
${OUT123_DUNG}

<h3>5. Cái giá của preflight và <code>max-age</code></h3>
<p>Mỗi preflight là một lượt đi về trọn vẹn trước request thật. <code>Access-Control-Max-Age</code> cho trình duyệt nhớ câu trả lời. Năm lần đặt liên tiếp, đếm ở server:</p>
${OUT123_MAXAGE}
<p>Với 3 600 giây, năm request chỉ một preflight; với 0, request nào cũng có preflight đi trước — trên mạng 80 ms của bài 12.2 là thêm 80 ms vào mỗi lần bấm. Chrome giới hạn giá trị này ở hai giờ, đặt số lớn hơn cũng không ích gì.</p>

<h3>6. Hai cấu hình chép từ internet</h3>
<p><strong>"Cho phép tất cả, kèm credentials":</strong> <code>allowedOrigins("*")</code> cộng <code>allowCredentials(true)</code>. Đặc tả CORS cấm tổ hợp này, và Spring thực thi điều đó — không phải lúc khởi động, mà ở request đầu tiên:</p>
${OUT123_SAO}
<p>Ứng dụng khởi động bình thường, mọi request khác origin trả 500, và trình duyệt báo là lỗi CORS vì phản hồi 500 không có header CORS. Gợi ý tiếp theo trên diễn đàn "sửa" được nó:</p>
<p><strong>"Vậy dùng pattern":</strong> <code>allowedOriginPatterns("*")</code> kèm credentials. Giờ Spring chép nguyên <code>Origin</code> nào gửi tới vào phản hồi:</p>
${OUT123_PHAN}
<p>Mọi website trên internet giờ đều được tin để đọc phản hồi kèm credentials của người dùng. LabFlow gửi token trong header <code>Authorization</code> mà trang lạ không lấy được, nên thiệt hại có giới hạn — nhưng ngày ai đó thêm đăng nhập bằng cookie hay cookie phiên, bất kỳ trang nào người dùng ghé qua cũng đọc được dữ liệu của họ. Đó là nội dung phần kế.</p>

<h3>🕵️ Góc hacker — "CORS misconfigurations for Bitcoins and bounties", 2016</h3>
<p>Tại AppSec USA tháng 10/2016, James Kettle (PortSwigger) trình bày nghiên cứu về đúng lỗi phản chiếu này. Ông tìm thấy những site trả lại bất kỳ <code>Origin</code> nào kèm <code>Access-Control-Allow-Credentials: true</code> — trong đó có một sàn bitcoin, nơi một trang độc mà người dùng đang đăng nhập ghé vào có thể đọc khoá API riêng của họ và chuyển coin đi. Các biến thể khác ông ghi lại: tin origin <code>null</code> (iframe bị sandbox và tệp cục bộ có thể gửi), và kiểm origin bằng "kết thúc bằng example.com", thứ cũng nhận luôn <code>evilexample.com</code>. Cách phòng nhàm chán mà hiệu quả: danh sách origin chính xác cho từng môi trường, không phản chiếu, không <code>null</code>, chỉ bật credentials khi thật sự dùng cookie, và một bài kiểm rằng origin lạ không nhận được <code>Access-Control-Allow-Origin</code> (mục 7 trong bộ chấm lab của chương này).</p>

<h3>So với Node.js</h3>
<p>Express dùng middleware <code>cors</code>. Tuỳ chọn <code>origin: true</code> của nó nghĩa là "phản chiếu origin của request" — đi cùng <code>credentials: true</code> là đúng lỗ hổng của <code>allowedOriginPatterns("*")</code> ở trên, và nó xuất hiện trong rất nhiều bài hướng dẫn. Cách đúng cùng ý tưởng với Spring: <code>origin: ["https://labflow.vn"]</code> lấy từ cấu hình. Middleware cũng phải chạy trước bước xác thực, vì cùng lý do preflight.</p>

<h3>Khi đi làm</h3>
<p>Có hai cách dựng tốt. <strong>Cùng origin ở production</strong>: một reverse proxy phục vụ bản build React và chuyển <code>/api</code> sang Spring Boot dưới cùng một tên miền — không có CORS gì cả, không có gì để cấu hình sai. <strong>Tên miền riêng</strong> (<code>app.labflow.vn</code> và <code>api.labflow.vn</code>): origin chính xác lấy từ biến môi trường (<code>LABFLOW_CORS_ORIGINS</code>), khác nhau cho dev, staging và production. Lúc phát triển, proxy của Vite (bài 12.4) cũng làm trình duyệt chỉ thấy một origin. Cấu hình nằm ở một bean; người duyệt mã nên từ chối mọi dấu <code>*</code> đứng cạnh credentials.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"CORS là gì và nó bảo vệ cái gì?"</strong> — Cơ chế của trình duyệt nới chính sách cùng nguồn cho những origin mà server ghi tên. Nó bảo vệ người dùng khỏi website khác đọc phản hồi bằng credentials của họ; nó không bảo vệ server trước request gửi thẳng.</li>
  <li><strong>"Vì sao POST của tôi sinh ra một request OPTIONS?"</strong> — Nó không phải request đơn giản (kiểu nội dung JSON, header <code>Authorization</code>…), nên trình duyệt gửi preflight. Server phải trả lời nó, trước bước xác thực, với các method và header được phép.</li>
  <li><strong>"Sao không dùng <code>*</code>?"</strong> — Đi với credentials thì bị cấm (Spring ném <code>IllegalArgumentException</code>); thay bằng phản chiếu origin là tin mọi site. Không có credentials thì <code>*</code> chỉ chấp nhận được với dữ liệu thật sự công khai.</li>
  <li><strong>"Frontend không đọc được header <code>Location</code>. Vì sao?"</strong> — Khác origin thì chỉ đọc được header trong danh sách an toàn; thêm nó vào <code>Access-Control-Expose-Headers</code>.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Với cấu hình đúng, dùng curl gửi một preflight có <code>Access-Control-Request-Headers: x-debug</code>. Server trả mã gì, header gì, và Chrome có gửi request thật không?</li>
  <li>Method được phép là <code>GET, POST, PATCH, DELETE</code>. Từ trang thử, gửi <code>fetch(API + '/api/v1/bookings/1', { method: 'PUT' })</code>. Log server thấy gì, Chrome in gì?</li>
  <li>Cho phép <code>https://*.labflow.vn</code> bằng <code>allowedOriginPatterns</code>. Origin nào qua được: <code>https://app.labflow.vn</code>, <code>https://labflow.vn</code>, <code>https://evil-labflow.vn</code>, <code>http://app.labflow.vn</code>?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Spring từ chối preflight xin một header không có trong danh sách: <code>403</code>, thân <code>Invalid CORS request</code>, không có header <code>Access-Control-Allow-*</code> nào. Chrome không gửi request thật và báo preflight thất bại.</p><p>2. Chỉ preflight tới được server, và Spring từ chối nó (<code>403 Invalid CORS request</code>, không header CORS) vì <code>PUT</code> không được phép. Chrome in "Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource" và <code>fetch</code> hỏng với <code>TypeError: Failed to fetch</code>. Bản thân <code>PUT</code> không bao giờ được gửi.</p><p>3. Chỉ <code>https://app.labflow.vn</code>. Mẫu đòi scheme <code>https</code>, ít nhất một nhãn tên miền con, và đúng đuôi <code>.labflow.vn</code>; <code>evil-labflow.vn</code> không kết thúc bằng <code>.labflow.vn</code>. Thêm riêng <code>https://labflow.vn</code> nếu tên miền gốc cần truy cập.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Origin</strong> — scheme + host + port của một trang hay một server.</li>
  <li><strong>Same-origin policy (chính sách cùng nguồn)</strong> — luật của trình duyệt: trang chỉ được đọc phản hồi từ chính origin của nó, trừ khi CORS cho phép thêm.</li>
  <li><strong>Simple request (request đơn giản)</strong> — request trình duyệt gửi không cần hỏi trước (GET/HEAD/POST với header an toàn và kiểu nội dung form/text).</li>
  <li><strong>Preflight</strong> — request <code>OPTIONS</code> trình duyệt gửi trước để hỏi request thật có được phép không.</li>
  <li><strong><code>Access-Control-Expose-Headers</code></strong> — các header phản hồi mà JavaScript được đọc khi khác origin, ngoài danh sách an toàn.</li>
  <li><strong><code>Access-Control-Max-Age</code></strong> — thời gian trình duyệt được nhớ kết quả preflight.</li>
  <li><strong>Credentials</strong> — cookie, xác thực HTTP và chứng chỉ client gửi kèm request khác origin.</li>
  <li><strong>Phản chiếu origin</strong> — chép <code>Origin</code> của request vào <code>Access-Control-Allow-Origin</code>; tức là tin tất cả.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>CORS bảo vệ người dùng bên trong trình duyệt; curl và server khác bỏ qua nó. Spring trả origin không được phép bằng 403 "Invalid CORS request".</li>
  <li>Thiếu <code>http.cors()</code>: GET đơn giản vẫn được thực thi (200) nhưng không đọc được; preflight tới đường dẫn cần đăng nhập ⇒ 401.</li>
  <li>Thiếu <code>exposedHeaders</code>: <code>Location</code> và <code>Idempotent-Replayed</code> đọc ra <code>null</code> dù server đã gửi.</li>
  <li><code>max-age</code> 3 600 giây: 1 preflight cho 5 request; 0: 5 preflight.</li>
  <li><code>*</code> + credentials ⇒ 500 ở mọi request; <code>allowedOriginPatterns("*")</code> + credentials ⇒ tin mọi origin (Kettle, 2016).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html', '🛡️', 'Spring Security — CORS', 'Vì sao CORS phải xử lý trước bước xác thực.')}
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — Cross-Origin Resource Sharing', 'Request đơn giản, preflight, header an toàn.')}
${tl('https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties', '🕵️', 'PortSwigger — CORS for Bitcoins and bounties', 'James Kettle, 2016.')}
${tl('https://fetch.spec.whatwg.org/#http-cors-protocol', '📜', 'Fetch Standard — CORS protocol', 'Đặc tả mà trình duyệt cài đặt.')}

<h3>Nguồn</h3>
<ul>
  <li>J. Kettle, "Exploiting CORS misconfigurations for Bitcoins and bounties", PortSwigger Research / AppSec USA, tháng 10/2016.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Spring Security 7) kèm filter ghi request ở thứ tự cao nhất, Google Chrome 150 headless lái bằng Playwright, trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 12.4 =====
const MA124_API = js("// src/api.ts\n// Một chỗ duy nhất gọi API LabFlow. Kiểu lấy từ api-types.ts (sinh từ /v3/api-docs) ⇒ backend đổi hợp đồng là tsc báo đỏ.\nimport createClient, { type Middleware } from \"openapi-fetch\";\nimport type { components, paths } from \"./api-types\";\n\nexport type Lab = components[\"schemas\"][\"LabInfo\"];\nexport type Booking = components[\"schemas\"][\"BookingView\"];\nexport type DatPhong = components[\"schemas\"][\"DatRequest\"];\nexport type Problem = components[\"schemas\"][\"Problem\"];\n\nexport function taoApi(baseUrl: string, layToken: () => string | null, khiHetPhien: () => void) {\n  const api = createClient<paths>({ baseUrl });\n  const ganToken: Middleware = {\n    onRequest({ request }) {\n      const t = layToken();\n      if (t) request.headers.set(\"Authorization\", `Bearer ${t}`);\n      return request;\n    },\n    onResponse({ request, response }) {\n      // 401 ở API khác /auth ⇒ token hết hạn/sai ⇒ về màn đăng nhập. 403 KHÔNG đăng xuất: đăng nhập rồi nhưng không đủ quyền.\n      if (response.status === 401 && !new URL(request.url).pathname.startsWith(\"/api/v1/auth\")) khiHetPhien();\n      return response;\n    },\n  };\n  api.use(ganToken);\n  return api;\n}\nexport type Api = ReturnType<typeof taoApi>;\n\n/** Mọi lỗi về MỘT khuôn Problem — kể cả khi server trả thân rỗng hoặc mạng rớt (fetch ném TypeError). */\nexport function veProblem(error: unknown, status: number): Problem {\n  const e = error as Partial<Problem> | undefined;\n  if (e && typeof e.code === \"string\") return e as Problem;\n  return { type: \"about:blank\", title: \"Error\", status, code: status ? `HTTP_${status}` : \"NETWORK\", detail: status ? \"máy chủ trả lỗi không rõ\" : \"không kết nối được máy chủ\" };\n}");
const MA124_DAT = js("export type KetQuaDat = { ok: true; booking: Booking; lapLai: boolean; location: string | null } | { ok: false; loi: Problem };\n\n/**\n * Đặt phòng. `khoa` (Idempotency-Key) sinh MỘT lần cho mỗi ý định đặt và dùng lại khi bấm lại sau lỗi mạng\n * ⇒ server trả lại đúng lượt cũ thay vì tạo lượt thứ hai. Header Location / Idempotent-Replayed chỉ đọc được\n * khi server khai Access-Control-Expose-Headers (bài 12.3).\n */\nexport async function datPhong(api: Api, body: DatPhong, khoa: string): Promise<KetQuaDat> {\n  try {\n    const { data, error, response } = await api.POST(\"/api/v1/bookings\", { params: { header: { \"Idempotency-Key\": khoa } }, body });\n    if (data) return { ok: true, booking: data, lapLai: response.headers.get(\"Idempotent-Replayed\") === \"true\", location: response.headers.get(\"Location\") };\n    return { ok: false, loi: veProblem(error, response.status) };\n  } catch {\n    return { ok: false, loi: veProblem(undefined, 0) };\n  }\n}");
const MA124_LOI = js("/** Câu hiện cho người dùng, chọn theo MÃ lỗi ổn định — không phân tích câu chữ tiếng Việt của server. */\nexport function loiChoNguoiDung(e: Problem): string {\n  switch (e.code) {\n    case \"SLOT_TAKEN\": return \"Khung giờ này vừa có người đặt. Hãy chọn giờ khác.\";\n    case \"QUOTA_EXCEEDED\": return \"Bạn đã dùng hết 6 giờ đặt phòng của tuần này.\";\n    case \"NOT_30_MIN_GRID\": return \"Giờ bắt đầu và kết thúc phải tròn 30 phút (9:00, 9:30…).\";\n    case \"TOO_FAR_AHEAD\": return \"Chỉ đặt trước tối đa 14 ngày.\";\n    case \"VALIDATION\": return \"Kiểm tra lại các ô được đánh dấu.\";\n    case \"FORBIDDEN\": return \"Tài khoản của bạn không có quyền làm việc này.\";\n    case \"NETWORK\": return \"Mất kết nối. Bấm Đặt lần nữa — hệ thống không tạo trùng.\";\n    default: return e.detail;\n  }\n}");
const MA124_GIO = js("/** \"2026-11-26T09:00:00\" ⇒ \"26/11 09:00\". Giờ của phòng lab, KHÔNG qua new Date() (bài 12.2: chuỗi không múi giờ). */\nexport const gio = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)} ${s.slice(11, 16)}`;");
const MA124_APP = js("// src/App.tsx (phần đầu)\nconst BASE = import.meta.env.VITE_API ?? \"http://localhost:8080\";\nexport default function App() {\n  // Token trong BỘ NHỚ (state React): tải lại trang là mất, đổi lại script lạ không đọc được qua localStorage.\n  const [token, setToken] = useState<string | null>(() => (LUU_LOCAL ? localStorage.getItem(\"token\") : null));\n  const [lyDo, setLyDo] = useState(\"\");\n  const tokenRef = useRef(token);\n  tokenRef.current = token;\n  const api = useMemo(() => taoApi(BASE, () => tokenRef.current, () => { setToken(null); setLyDo(\"Phiên đăng nhập đã hết hạn, hãy đăng nhập lại.\"); }), []);\n  const vao = (t: string) => { if (LUU_LOCAL) localStorage.setItem(\"token\", t); setLyDo(\"\"); setToken(t); };\n  return token ? <DatLich api={api} /> : <DangNhap api={api} onOk={vao} lyDo={lyDo} />;\n}");
const MA124_FORM = js("const khoa = useRef(crypto.randomUUID());                             // một khoá cho MỘT ý định đặt\n\nconst doi = (k: keyof typeof f, v: string) => { setF({ ...f, [k]: v }); khoa.current = crypto.randomUUID(); };  // sửa form = ý định mới\n\nasync function dat(e: React.FormEvent) {\n  e.preventDefault();\n  if (dangGui) return;\n  setDangGui(true);                                                   // khoá nút: chặn bấm đúp ở phía giao diện\n  const kq = await datPhong(api, { labCode: f.lab, startAt: `${f.ngay}T${f.tu}:00`, endAt: `${f.ngay}T${f.den}:00`, purpose: f.mucDich }, khoa.current);\n  setDangGui(false);\n  if (kq.ok) {\n    setLoiO({});\n    setThongBao(`${kq.lapLai ? \"Đã đặt từ trước\" : \"Đã đặt\"} #${kq.booking.id}${kq.location ? ` (${kq.location})` : \"\"} — ${kq.booking.status === \"PENDING\" ? \"chờ quản lý duyệt.\" : \"đã giữ phòng.\"}`);\n    khoa.current = crypto.randomUUID();\n    void taiLai();\n  } else {\n    setLoiO(kq.loi.fields ?? {});\n    setThongBao(loiChoNguoiDung(kq.loi));\n  }\n}");
const MA124_O = js("const O = ({ ten }: { ten: string }) => (loiO[ten] ? <small className=\"loi\" data-t={`loi-${ten}`}>{loiO[ten]}</small> : null);\nreturn (\n  <main>\n    <h1>Đặt phòng lab</h1>\n    <form onSubmit={dat}>\n      <select name=\"lab\" value={f.lab} onChange={(e) => doi(\"lab\", e.target.value)}>\n        {labs.map((l) => <option key={l.code} value={l.code} disabled={l.status !== \"ACTIVE\"}>{l.code} — {l.name} ({l.capacity} chỗ{l.requiresApproval ? \", cần duyệt\" : \"\"})</option>)}\n      </select>\n      <input name=\"ngay\" type=\"date\" value={f.ngay} onChange={(e) => doi(\"ngay\", e.target.value)} />\n      <input name=\"tu\" type=\"time\" step={1800} value={f.tu} onChange={(e) => doi(\"tu\", e.target.value)} /> <O ten=\"startAt\" />\n      <input name=\"den\" type=\"time\" step={1800} value={f.den} onChange={(e) => doi(\"den\", e.target.value)} /> <O ten=\"endAt\" />\n      <input name=\"mucDich\" value={f.mucDich} onChange={(e) => doi(\"mucDich\", e.target.value)} placeholder=\"mục đích\" /> <O ten=\"purpose\" />\n      <button disabled={dangGui}>{dangGui ? \"Đang gửi…\" : \"Đặt\"}</button>\n    </form>\n    {thongBao && <p role=\"status\" data-t=\"thong-bao\">{thongBao}</p>}");
const MA124_VITE = js("import { defineConfig } from \"vite\";\nimport react from \"@vitejs/plugin-react\";\n\n// Lúc DEV: trình duyệt chỉ nói chuyện với Vite (cùng origin), Vite chuyển /api sang Spring Boot ⇒ không cần CORS.\n// Vite vẫn chuyển header Origin của trình duyệt sang ⇒ Spring coi là request CORS từ origin lạ ⇒ 403. Gỡ Origin ở proxy.\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 5173,\n    proxy: {\n      \"/api\": {\n        target: \"http://localhost:8080\",\n        changeOrigin: true,\n        configure: (proxy) => proxy.on(\"proxyReq\", (req) => req.removeHeader(\"origin\")),\n      },\n    },\n  },\n});");
const MA124_ROUTE = js("// 7. mạng rớt SAU khi server đã ghi: để request đi tới server, rồi cắt phản hồi trước khi tới trang\nlet cat = true;\nawait p.route('**/api/v1/bookings', async (r) => {\n  if (r.request().method() === 'POST' && cat) { cat = false; await r.fetch(); return r.abort('connectionreset'); }\n  return r.continue();\n});");
const OUT124_BUILD = out("$ VITE_API=http://localhost:8080 npx vite build\nvite v7.3.8 building for production...\n✓ 30 modules transformed.\ndist/index.html                  0.22 kB │ gzip:  0.19 kB\ndist/assets/index-CtDcmMYM.js  234.42 kB │ gzip: 74.16 kB\n✓ built in 1.67s");
const OUT124_REACT = out("$ node react.mjs http://localhost:5173/ chi.le@fpt.edu.vn \"$MAT_KHAU_CHI\" 20   # API chạy với labflow.jwt.access-ttl=PT20S\n1. sai mật khẩu ⇒ sai email hoặc mật khẩu\n2. đăng nhập xong · số phòng trong ô chọn: 4 · localStorage có 0 khoá\n3. bỏ trống mục đích ⇒ Kiểm tra lại các ô được đánh dấu. | cạnh ô: must not be blank\n4. đặt IOT-01 26/11 09:00–11:00 ⇒ Đã đặt #38 (/api/v1/bookings/38) — đã giữ phòng.\n5. đặt lại đúng khung đó ⇒ Khung giờ này vừa có người đặt. Hãy chọn giờ khác.\n6. bấm ĐÚP nút Đặt ⇒ 1 request POST · Đã đặt #40 (/api/v1/bookings/40) — đã giữ phòng.\n7a. mạng rớt sau khi server đã ghi ⇒ Mất kết nối. Bấm Đặt lần nữa — hệ thống không tạo trùng.\n7b. bấm Đặt lần nữa (form không đổi ⇒ cùng khoá) ⇒ Đã đặt từ trước #41 — đã giữ phòng.\n8. lưu lượt có mục đích chứa HTML ⇒ Đã đặt #42 (/api/v1/bookings/42) — đã giữ phòng.\n   danh sách hiện: #42 HW-04 27/11 16:00–16:30 · CONFIRMED · <img src=x onerror=\"console.log('XSS chạy! local\n9. mở lại trang ?html=1 (token cũ trong bộ nhớ đã mất ⇒ phải đăng nhập lại)\n   [console] XSS chạy! localStorage.token = null\n9. mở lại trang ?html=1&luu=local (token cũ trong bộ nhớ đã mất ⇒ phải đăng nhập lại)\n   [console] XSS chạy! localStorage.token = eyJhbGciOiJIUzI1\n10a. 22 giây sau đăng nhập (token ghi sống 20 giây), bấm Tải lại ⇒ Đặt phòng lab\n10b. 82 giây sau đăng nhập, bấm Tải lại ⇒ Phiên đăng nhập đã hết hạn, hãy đăng nhập lại.");
const OUT124_PROXY = out("# lần 1: vite.config.ts chỉ có proxy \"/api\" ⇒ target localhost:8080, changeOrigin: true\ntrình duyệt gửi: POST http://localhost:5173/api/v1/auth/login\n  ⇐ 403\nmàn hình: LabFlow — đăng nhập · máy chủ trả lỗi không rõ\nlog server: POST /api/v1/auth/login origin=http://localhost:5173 -> 403\n\n# lần 2: thêm configure: proxy.on(\"proxyReq\", req => req.removeHeader(\"origin\"))\ntrình duyệt gửi: POST http://localhost:5173/api/v1/auth/login\n  ⇐ 200\ntrình duyệt gửi: GET http://localhost:5173/api/v1/labs?size=50\ntrình duyệt gửi: GET http://localhost:5173/api/v1/bookings/mine\ntrình duyệt gửi: GET http://localhost:5173/api/v1/labs?size=50\ntrình duyệt gửi: GET http://localhost:5173/api/v1/bookings/mine\nmàn hình: Đặt phòng lab\nlog server: POST /api/v1/auth/login origin=- -> 200\nlog server: GET /api/v1/labs?size=50 origin=- -> 200   (×2, StrictMode chạy effect hai lần ở chế độ dev)");

const L124_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4 · An API frontends love</span>
<h2>Wiring a real React page to the API</h2>
<p class="lead">Everything in this chapter so far was preparation for one screen: a student logs in, picks a lab and a time, presses "Book", and sees the truth — booked, taken, invalid field, or "you lost your connection, press again". This lesson builds that screen in React 19 with the client generated in 12.1, and then drives it in a real Google Chrome with Playwright: wrong password, empty field, a slot someone else took, a double-click, a network failure <em>after</em> the server saved the booking, an XSS payload in a text field, and a token that expires while the page is open. Every line of output below is what the page actually showed.</p>

<h3>Everyday picture first</h3>
<p>A good shop assistant does three things a bad one does not: tells you clearly what went wrong and what to do ("size M is sold out, here is L"), does not charge you twice when the card machine freezes and you tap again, and keeps your ID card in a pocket rather than on the counter. The React page has the same three jobs: clear errors, safe retries, and a token kept where other scripts cannot pick it up.</p>

<h3>1. One module talks to the API</h3>
<p>Components never call <code>fetch</code>. One file creates the typed client, attaches the token, reacts to 401 once for the whole app, and converts every failure — a ProblemDetail, an empty body, a network error — into the same <code>Problem</code> type:</p>
${MA124_API}
<p>Two decisions in there are worth defending in a code review. <strong>401 logs out, 403 does not</strong>: 401 means "I do not know who you are" (token missing, wrong or expired), 403 means "I know, and you may not" — logging the user out on 403 would only hide the problem. And <strong>the token getter is a function</strong>, read at request time, so the client never holds a stale token.</p>
<p>Messages are chosen by the stable <code>code</code>, never by parsing the server's sentence (which may change, or be in another language):</p>
${MA124_LOI}

<h3>2. Booking: field errors, double-clicks and retries</h3>
<p>The booking call returns either the booking (and whether it was a replay, and its <code>Location</code>) or a <code>Problem</code>:</p>
${MA124_DAT}
<p>The form keeps one idempotency key per <em>intention</em>: generated when the form is filled, kept when the user presses again after an error, replaced when they change anything or after success. Field errors come straight from <code>problem.fields</code> and appear next to the right input:</p>
${MA124_FORM}
${MA124_O}
<p>Times are displayed as text, exactly as the contract says (12.2) — no <code>new Date()</code>:</p>
${MA124_GIO}

<h3>3. Root component: where the token lives</h3>
${MA124_APP}
<p>The token lives in React state — in memory. A page reload loses it (the user logs in again; a refresh token in an HttpOnly cookie is the usual upgrade, Chapter 9.5). The two URL switches <code>?luu=local</code> and <code>?html=1</code> exist <em>only</em> to demonstrate the mistakes in section 5; do not copy them.</p>

<h3>4. Build, run, and drive it in Chrome</h3>
<p><code>npm run gen:api</code> regenerates the types from <code>/v3/api-docs</code>, <code>tsc -b</code> checks every call against them, and Vite builds the bundle:</p>
${OUT124_BUILD}
<p>The built page was served on the frontend origin and driven by a Playwright script in Google Chrome 150. To simulate the worst network moment — the request reaches the server, the server saves the booking, and the response is lost — the script lets the first POST through and cuts the connection on the way back:</p>
${MA124_ROUTE}
<p>The API ran with <code>labflow.jwt.access-ttl=PT20S</code> so that the expiry could be watched. What the user saw:</p>
${OUT124_REACT}
<ul>
  <li><strong>1–3.</strong> The login error is the server's <code>detail</code>; an empty purpose shows "must not be blank" next to the input, from <code>fields.purpose</code>.</li>
  <li><strong>5.</strong> A taken slot is a sentence a student understands, chosen by <code>SLOT_TAKEN</code>.</li>
  <li><strong>6.</strong> A double-click sent <strong>one</strong> request: the button is disabled while sending. The idempotency key would have saved us anyway.</li>
  <li><strong>7a–7b.</strong> The server saved booking #41, the response never arrived, the page said "lost connection, press again". Pressing again sent the <em>same</em> key, and the server answered 200 with booking #41 and <code>Idempotent-Replayed: true</code> — "already booked". The database has one row, not two. This works only because CORS exposes <code>Idempotent-Replayed</code> (12.3).</li>
  <li><strong>10a–10b.</strong> Twenty-two seconds after login the "20 s" token still worked: Spring's <code>JwtTimestampValidator</code> allows 60 s of clock skew by default. At 82 s the API returned 401, the client called <code>khiHetPhien</code>, and the page went back to the login form with a clear reason — no error page, no stack of failed requests.</li>
</ul>

<h3>5. XSS, and why the token is not in localStorage</h3>
<p>Step 8 saved a booking whose purpose is <code>&lt;img src=x onerror="…"&gt;</code> — an XSS payload that tries to read <code>localStorage.token</code>. The server accepted it: it is just text, and the backend cannot know where text will be displayed. What happens next depends on the frontend:</p>
<ul>
  <li><strong>React rendering text</strong> (<code>{b.purpose}</code>): the list shows the literal characters; nothing runs. React escapes text by default.</li>
  <li><strong><code>dangerouslySetInnerHTML</code></strong> (<code>?html=1</code>): the payload runs. With the token in memory it finds <code>localStorage.token = null</code>.</li>
  <li><strong><code>dangerouslySetInnerHTML</code> + token in localStorage</strong> (<code>?html=1&amp;luu=local</code>): the payload prints the first characters of the JWT. A real attacker would send all of it to their server and use it until it expires.</li>
</ul>
<p>Keeping the token in memory is not a complete defence — a script running in your page can still click buttons and call your API while the user is there. The real defence is to not let scripts in: render text as text, sanitise the rare HTML you must render (DOMPurify), and add a Content Security Policy. Keeping the token out of storage limits what a single XSS can take away.</p>

<h3>6. Development without CORS: the Vite proxy</h3>
<p>In development you can avoid cross-origin requests entirely: the page calls <code>/api/…</code> on the Vite server, and Vite forwards to Spring Boot. Measured, with LabFlow allowing only another origin:</p>
${OUT124_PROXY}
<p>The first attempt failed with 403. The browser sends an <code>Origin</code> header on every POST, even same-origin, and Vite's proxy forwards it; <code>changeOrigin</code> changes the <code>Host</code> header, not <code>Origin</code>. Spring then sees <code>Origin: http://localhost:5173</code> arriving at <code>localhost:8080</code>, treats it as a cross-origin request from a disallowed origin, and rejects it. Removing the header in the proxy fixed it:</p>
${MA124_VITE}
<p>(The doubled GETs are React's <code>StrictMode</code> running effects twice in development — expected, and absent in the production build.) In production the same idea is a reverse proxy serving the build and <code>/api</code> from one domain (12.3).</p>

<h3>🕵️ Hacker corner — the TweetDeck XSS worm, 2014</h3>
<p>On 11 June 2014, a tweet containing a short <code>&lt;script&gt;</code> tag spread through TweetDeck, Twitter's web client for power users. TweetDeck displayed tweet text as HTML, so everyone whose TweetDeck showed the tweet ran the script — which made their own account retweet it. It was retweeted tens of thousands of times within minutes, and Twitter shut TweetDeck down until it was fixed. The payload was harmless; the same hole could have read anything the page could read, including tokens in storage. The fix is the first rule of section 5: text from users is rendered as text. In React that is the default — the danger is the one prop with "dangerously" in its name.</p>

<h3>Compared with Node.js</h3>
<p>This lesson is the same for a Node.js backend: the React code does not know what language the API is written in. That is the point of the contract. The differences are on the server side and were covered in 12.1–12.3 (how the contract is generated, how errors are shaped, how CORS is configured). Teams with an Express backend often use the same <code>openapi-typescript</code> + <code>openapi-fetch</code> pair, or share Zod schemas directly when both sides are TypeScript.</p>

<h3>At work</h3>
<p>In SWP391 the frontend members own this module, but the backend members must know it exists, because three backend decisions surface here: error codes (the switch in <code>loiChoNguoiDung</code>), exposed headers (the replay message), and the idempotency key (the safe retry). When a frontend member says "the API is weird", open the browser's Network tab together — the preflight, the status, the response headers — before changing any code.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Where do you store a JWT in a single-page app?"</strong> — Ideally in memory for the access token, with a refresh token in an HttpOnly, Secure, SameSite cookie. localStorage is readable by any script on the page; one XSS takes the token. Whatever you choose, preventing XSS matters more.</li>
  <li><strong>"How should the frontend handle 401 and 403?"</strong> — 401: the session is gone, clear state and go to login (or refresh the token once). 403: stay logged in, show "not allowed".</li>
  <li><strong>"The user double-clicks Pay. How do you avoid two payments?"</strong> — Disable the button while sending, and send an idempotency key so that a retry or a duplicate returns the first result; the server enforces it (unique constraint).</li>
  <li><strong>"Why does the browser send OPTIONS before my request, and how do you avoid it in development?"</strong> — Preflight for non-simple requests; in development a dev-server proxy makes calls same-origin.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
  <li>Show the booking status in colour and add a "Cancel" button for CONFIRMED bookings. Which error codes can cancel return, and which message do you show for each?</li>
  <li>Add a manager view (only when the JWT's <code>roles</code> contains <code>MANAGER</code>) listing PENDING bookings with Approve/Reject. What happens if a student opens it by changing the code in DevTools?</li>
  <li>Set a Content Security Policy on the built page (<code>script-src 'self'</code>) and repeat step 8 with <code>?html=1</code>. What does Chrome print?</li>
</ol></div>
${giai('Show the answers', `<p>1. <code>POST /api/v1/bookings/{id}/cancel</code> can return 404 (not yours or not found), 422 <code>BAD_TRANSITION</code> or <code>TOO_LATE_TO_CANCEL</code> (Chapter 18 rules), 409 <code>STALE</code> under concurrency, and 401. Add cases to <code>loiChoNguoiDung</code> with sentences a student understands; reload the list after success.</p><p>2. The view appears, but every approve/reject call returns 403 <code>FORBIDDEN</code> — the decision is made by <code>@PreAuthorize</code> on the server. Hiding buttons is user experience, not security. Show the 403 message without logging out.</p><p>3. Chrome blocks the inline <code>onerror</code> handler and logs (Chrome 150, measured): "Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. … The action has been blocked." Nothing is printed from the payload. CSP is a second wall behind escaping, not a replacement for it.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>openapi-fetch</strong> — a small typed <code>fetch</code> wrapper; paths, parameters, bodies and responses are checked against the generated types.</li>
  <li><strong>Middleware (client)</strong> — code that runs on every request/response of the client: attach token, react to 401.</li>
  <li><strong>Idempotency key</strong> — client-generated id for one intention; the server returns the first result for repeats.</li>
  <li><strong>XSS (cross-site scripting)</strong> — attacker-controlled script running inside your page.</li>
  <li><strong><code>dangerouslySetInnerHTML</code></strong> — React's escape hatch to insert raw HTML; bypasses escaping.</li>
  <li><strong>Content Security Policy</strong> — response header telling the browser which scripts may run.</li>
  <li><strong>Clock skew</strong> — tolerance for clock differences when checking token expiry (60 s by default in Spring Security).</li>
  <li><strong>Dev-server proxy</strong> — the development server forwards API calls so the browser sees one origin.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>One module calls the API: typed client, token attached per request, 401 ⇒ logout once, every failure ⇒ one <code>Problem</code>.</li>
  <li>Messages by <code>code</code>; field errors from <code>fields</code>; times shown as text.</li>
  <li>Measured in Chrome: double-click ⇒ 1 request; response lost after save ⇒ "press again" ⇒ same key ⇒ 200 replay, one row.</li>
  <li>Token of 20 s still valid at 22 s (60 s skew), rejected at 82 s ⇒ back to login with a reason.</li>
  <li>XSS in a text field: harmless as React text; with <code>dangerouslySetInnerHTML</code> + localStorage it reads the JWT.</li>
  <li>Vite proxy: remove the <code>Origin</code> header or Spring answers 403.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openapi-ts.dev/openapi-fetch/', '🧩', 'openapi-fetch', 'Typed client, middleware.')}
${tl('https://vite.dev/config/server-options#server-proxy', '⚡', 'Vite — server.proxy', 'Proxy options, configure hook.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html', '🛡️', 'OWASP — HTML5 Security Cheat Sheet', 'Local storage and sensitive data.')}
${tl('https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html', '⚛️', 'React — dangerouslySetInnerHTML', 'When and why it is dangerous.')}

<h3>Sources</h3>
<ul>
  <li>TweetDeck XSS self-retweeting tweet, 11 June 2014 (Twitter status updates and press coverage the same day).</li>
  <li>All outputs: LabFlow API (Spring Boot 4.1.2) and the Chapter 12 React page (React 19.3.1, Vite 7.3.8, openapi-fetch 0.13.8), Google Chrome 150 driven by Playwright, on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L124_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4 · API mà frontend thích</span>
<h2>Gắn một trang React thật vào API</h2>
<p class="lead">Mọi thứ trong chương này tới giờ đều là chuẩn bị cho một màn hình: sinh viên đăng nhập, chọn phòng và giờ, bấm "Đặt", và thấy sự thật — đã đặt, đã có người lấy, ô nhập sai, hay "mất kết nối, bấm lại". Bài này dựng màn hình đó bằng React 19 với client sinh ở bài 12.1, rồi lái nó trong Google Chrome thật bằng Playwright: sai mật khẩu, bỏ trống ô, khung giờ người khác vừa lấy, bấm đúp, mạng rớt <em>sau khi</em> server đã lưu lượt đặt, một đoạn XSS trong ô chữ, và một token hết hạn khi trang đang mở. Mỗi dòng output dưới đây là thứ trang thật sự hiện ra.</p>

<h3>Đời thường trước đã</h3>
<p>Một nhân viên bán hàng giỏi làm ba việc mà người kém không làm: nói rõ cái gì hỏng và nên làm gì ("cỡ M hết rồi, đây là cỡ L"), không tính tiền hai lần khi máy quẹt thẻ đứng và bạn quẹt lại, và cất thẻ căn cước của bạn vào túi chứ không để trên quầy. Trang React có đúng ba việc đó: báo lỗi rõ, thử lại an toàn, và giữ token ở chỗ script khác không nhặt được.</p>

<h3>1. Một module nói chuyện với API</h3>
<p>Component không bao giờ gọi <code>fetch</code>. Một tệp tạo client có kiểu, gắn token, phản ứng với 401 một lần cho cả ứng dụng, và đổi mọi thất bại — một ProblemDetail, một thân rỗng, một lỗi mạng — về cùng kiểu <code>Problem</code>:</p>
${MA124_API}
<p>Có hai quyết định trong đó đáng bảo vệ khi duyệt mã. <strong>401 thì đăng xuất, 403 thì không</strong>: 401 nghĩa là "tôi không biết bạn là ai" (thiếu, sai hay hết hạn token), 403 nghĩa là "tôi biết, và bạn không được" — đăng xuất người dùng khi gặp 403 chỉ che giấu vấn đề. Và <strong>hàm lấy token là một hàm</strong>, được đọc lúc gửi request, nên client không bao giờ cầm token cũ.</p>
<p>Câu thông báo chọn theo <code>code</code> ổn định, không bao giờ phân tích câu chữ của server (có thể đổi, hoặc là ngôn ngữ khác):</p>
${MA124_LOI}

<h3>2. Đặt phòng: lỗi từng ô, bấm đúp và thử lại</h3>
<p>Lời gọi đặt phòng trả về hoặc lượt đặt (kèm cờ lặp lại và <code>Location</code>), hoặc một <code>Problem</code>:</p>
${MA124_DAT}
<p>Form giữ một khoá idempotency cho mỗi <em>ý định</em>: sinh khi điền form, giữ nguyên khi người dùng bấm lại sau lỗi, thay mới khi họ sửa bất kỳ ô nào hoặc sau khi thành công. Lỗi từng ô lấy thẳng từ <code>problem.fields</code> và hiện cạnh đúng ô nhập:</p>
${MA124_FORM}
${MA124_O}
<p>Giờ được hiển thị như chữ, đúng như hợp đồng nói (12.2) — không dùng <code>new Date()</code>:</p>
${MA124_GIO}

<h3>3. Component gốc: token nằm ở đâu</h3>
${MA124_APP}
<p>Token nằm trong state của React — trong bộ nhớ. Tải lại trang là mất (người dùng đăng nhập lại; refresh token trong cookie HttpOnly là bước nâng cấp thường gặp, Chương 9.5). Hai công tắc trên URL <code>?luu=local</code> và <code>?html=1</code> tồn tại <em>chỉ</em> để minh hoạ các sai lầm ở mục 5; đừng chép chúng.</p>

<h3>4. Build, chạy, và lái nó trong Chrome</h3>
<p><code>npm run gen:api</code> sinh lại kiểu từ <code>/v3/api-docs</code>, <code>tsc -b</code> kiểm mọi lời gọi theo kiểu đó, và Vite đóng gói:</p>
${OUT124_BUILD}
<p>Trang đã build được phục vụ ở origin của frontend và được một kịch bản Playwright lái trong Google Chrome 150. Để giả khoảnh khắc mạng tệ nhất — request tới server, server lưu lượt đặt, và phản hồi bị mất — kịch bản cho POST đầu tiên đi qua rồi cắt kết nối ở chiều về:</p>
${MA124_ROUTE}
<p>API chạy với <code>labflow.jwt.access-ttl=PT20S</code> để quan sát được lúc token hết hạn. Những gì người dùng thấy:</p>
${OUT124_REACT}
<ul>
  <li><strong>1–3.</strong> Lỗi đăng nhập là <code>detail</code> của server; mục đích bỏ trống hiện "must not be blank" cạnh ô nhập, lấy từ <code>fields.purpose</code>.</li>
  <li><strong>5.</strong> Khung giờ đã có người lấy là một câu sinh viên hiểu được, chọn theo <code>SLOT_TAKEN</code>.</li>
  <li><strong>6.</strong> Bấm đúp chỉ gửi <strong>một</strong> request: nút bị khoá trong lúc gửi. Mà nếu không thì khoá idempotency vẫn cứu được.</li>
  <li><strong>7a–7b.</strong> Server đã lưu lượt #41, phản hồi không bao giờ tới, trang báo "mất kết nối, bấm lại". Bấm lại gửi <em>cùng</em> khoá, server trả 200 với lượt #41 và <code>Idempotent-Replayed: true</code> — "đã đặt từ trước". CSDL có một dòng, không phải hai. Điều này chỉ chạy được vì CORS đã khai <code>Idempotent-Replayed</code> (12.3).</li>
  <li><strong>10a–10b.</strong> Hai mươi hai giây sau đăng nhập, token "20 giây" vẫn dùng được: <code>JwtTimestampValidator</code> của Spring mặc định cho lệch đồng hồ 60 giây. Ở giây 82, API trả 401, client gọi <code>khiHetPhien</code>, và trang quay về form đăng nhập kèm lý do rõ ràng — không trang lỗi, không một chuỗi request hỏng.</li>
</ul>

<h3>5. XSS, và vì sao token không nằm trong localStorage</h3>
<p>Bước 8 lưu một lượt có mục đích là <code>&lt;img src=x onerror="…"&gt;</code> — một đoạn XSS tìm cách đọc <code>localStorage.token</code>. Server nhận nó: đó chỉ là chữ, và backend không thể biết chữ sẽ được hiển thị ở đâu. Chuyện tiếp theo tuỳ vào frontend:</p>
<ul>
  <li><strong>React hiển thị như chữ</strong> (<code>{b.purpose}</code>): danh sách hiện nguyên các ký tự; không gì chạy. React escape chữ theo mặc định.</li>
  <li><strong><code>dangerouslySetInnerHTML</code></strong> (<code>?html=1</code>): đoạn mã chạy. Token nằm trong bộ nhớ nên nó thấy <code>localStorage.token = null</code>.</li>
  <li><strong><code>dangerouslySetInnerHTML</code> + token trong localStorage</strong> (<code>?html=1&amp;luu=local</code>): đoạn mã in ra những ký tự đầu của JWT. Kẻ tấn công thật sẽ gửi trọn nó về server của họ và dùng tới khi hết hạn.</li>
</ul>
<p>Giữ token trong bộ nhớ chưa phải phòng thủ trọn vẹn — script chạy trong trang của bạn vẫn có thể bấm nút và gọi API khi người dùng đang ở đó. Phòng thủ thật là không cho script lọt vào: hiển thị chữ như chữ, làm sạch số ít HTML buộc phải hiển thị (DOMPurify), và thêm Content Security Policy. Giữ token ngoài bộ nhớ lưu trữ giới hạn thứ mà một lỗ XSS lấy đi được.</p>

<h3>6. Phát triển không cần CORS: proxy của Vite</h3>
<p>Lúc phát triển có thể tránh hẳn request khác origin: trang gọi <code>/api/…</code> trên server Vite, và Vite chuyển tiếp sang Spring Boot. Đo thật, với LabFlow chỉ cho phép một origin khác:</p>
${OUT124_PROXY}
<p>Lần đầu hỏng với 403. Trình duyệt gửi header <code>Origin</code> kèm mọi POST, kể cả cùng origin, và proxy của Vite chuyển nguyên nó sang; <code>changeOrigin</code> đổi header <code>Host</code>, không đổi <code>Origin</code>. Spring bèn thấy <code>Origin: http://localhost:5173</code> đi tới <code>localhost:8080</code>, coi đó là request khác origin từ một origin không được phép, và từ chối. Gỡ header ở proxy là xong:</p>
${MA124_VITE}
<p>(Các GET bị nhân đôi là do <code>StrictMode</code> của React chạy effect hai lần ở chế độ dev — bình thường, và không có trong bản build production.) Ở production, cùng ý tưởng đó là một reverse proxy phục vụ bản build và <code>/api</code> dưới một tên miền (12.3).</p>

<h3>🕵️ Góc hacker — sâu XSS TweetDeck, 2014</h3>
<p>Ngày 11/6/2014, một tweet chứa thẻ <code>&lt;script&gt;</code> ngắn lan khắp TweetDeck, ứng dụng web của Twitter cho người dùng chuyên sâu. TweetDeck hiển thị nội dung tweet dưới dạng HTML, nên ai có TweetDeck hiện tweet đó đều chạy đoạn script — thứ khiến chính tài khoản của họ retweet nó. Nó được retweet hàng chục nghìn lần trong vài phút, và Twitter phải tắt TweetDeck tới khi sửa xong. Đoạn mã đó vô hại; cùng lỗ hổng ấy hoàn toàn có thể đọc mọi thứ trang đọc được, kể cả token trong bộ nhớ lưu trữ. Cách sửa chính là luật đầu tiên của mục 5: chữ của người dùng hiển thị như chữ. Trong React đó là mặc định — mối nguy nằm ở đúng một prop có chữ "dangerously" trong tên.</p>

<h3>So với Node.js</h3>
<p>Bài này y hệt với backend Node.js: mã React không biết API viết bằng ngôn ngữ gì. Đó chính là ý nghĩa của hợp đồng. Khác biệt nằm phía server và đã nói ở 12.1–12.3 (sinh hợp đồng thế nào, khuôn lỗi ra sao, cấu hình CORS thế nào). Nhóm dùng backend Express cũng hay dùng đúng cặp <code>openapi-typescript</code> + <code>openapi-fetch</code>, hoặc chia sẻ thẳng schema Zod khi cả hai phía đều là TypeScript.</p>

<h3>Khi đi làm</h3>
<p>Trong SWP391, các bạn frontend sở hữu module này, nhưng các bạn backend phải biết nó tồn tại, vì ba quyết định của backend lộ ra ở đây: mã lỗi (câu switch trong <code>loiChoNguoiDung</code>), header được khai (thông báo lặp lại), và khoá idempotency (thử lại an toàn). Khi bạn frontend nói "API lạ lắm", hãy cùng mở tab Network của trình duyệt — preflight, mã trạng thái, header phản hồi — trước khi sửa dòng mã nào.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Trong ứng dụng một trang, bạn cất JWT ở đâu?"</strong> — Lý tưởng là access token trong bộ nhớ, refresh token trong cookie HttpOnly, Secure, SameSite. localStorage thì script nào trên trang cũng đọc được; một lỗ XSS là mất token. Chọn cách nào thì chặn XSS vẫn quan trọng hơn.</li>
  <li><strong>"Frontend nên xử lý 401 và 403 thế nào?"</strong> — 401: phiên đã mất, xoá trạng thái và về màn đăng nhập (hoặc làm mới token một lần). 403: giữ đăng nhập, báo "không được phép".</li>
  <li><strong>"Người dùng bấm đúp nút Thanh toán. Làm sao tránh trả tiền hai lần?"</strong> — Khoá nút trong lúc gửi, và gửi khoá idempotency để lần thử lại hay bản trùng nhận lại kết quả đầu; server bảo đảm điều đó (ràng buộc unique).</li>
  <li><strong>"Vì sao trình duyệt gửi OPTIONS trước request của tôi, và lúc phát triển tránh nó thế nào?"</strong> — Preflight cho request không đơn giản; lúc phát triển, proxy của server dev làm lời gọi thành cùng origin.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
  <li>Tô màu trạng thái lượt đặt và thêm nút "Huỷ" cho lượt CONFIRMED. Lệnh huỷ có thể trả những mã lỗi nào, và bạn hiện câu gì cho từng mã?</li>
  <li>Thêm màn quản lý (chỉ khi <code>roles</code> trong JWT có <code>MANAGER</code>) liệt kê lượt PENDING với nút Duyệt/Từ chối. Chuyện gì xảy ra nếu một sinh viên mở nó bằng cách sửa mã trong DevTools?</li>
  <li>Đặt Content Security Policy cho trang đã build (<code>script-src 'self'</code>) rồi lặp lại bước 8 với <code>?html=1</code>. Chrome in gì?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. <code>POST /api/v1/bookings/{id}/cancel</code> có thể trả 404 (không phải của bạn hoặc không có), 422 <code>BAD_TRANSITION</code> hoặc <code>TOO_LATE_TO_CANCEL</code> (luật của Chương 18), 409 <code>STALE</code> khi đồng thời, và 401. Thêm case vào <code>loiChoNguoiDung</code> với câu sinh viên hiểu được; tải lại danh sách sau khi thành công.</p><p>2. Màn hình hiện ra, nhưng mọi lời gọi duyệt/từ chối đều trả 403 <code>FORBIDDEN</code> — quyết định nằm ở <code>@PreAuthorize</code> phía server. Giấu nút là trải nghiệm người dùng, không phải bảo mật. Hiện câu báo 403, không đăng xuất.</p><p>3. Chrome chặn trình xử lý <code>onerror</code> viết nội tuyến và ghi (Chrome 150, đo thật): "Executing inline event handler violates the following Content Security Policy directive 'script-src 'self''. … The action has been blocked." Đoạn mã không in được gì. CSP là bức tường thứ hai sau escape, không thay thế nó.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>openapi-fetch</strong> — lớp bọc <code>fetch</code> nhỏ có kiểu; đường dẫn, tham số, body và phản hồi đều được kiểm theo kiểu sinh ra.</li>
  <li><strong>Middleware (phía client)</strong> — mã chạy ở mọi request/phản hồi của client: gắn token, phản ứng với 401.</li>
  <li><strong>Khoá idempotency</strong> — id do client sinh cho một ý định; server trả kết quả đầu tiên cho các lần lặp.</li>
  <li><strong>XSS (cross-site scripting)</strong> — script do kẻ tấn công điều khiển chạy bên trong trang của bạn.</li>
  <li><strong><code>dangerouslySetInnerHTML</code></strong> — lối thoát của React để chèn HTML thô; bỏ qua escape.</li>
  <li><strong>Content Security Policy</strong> — header phản hồi cho trình duyệt biết script nào được chạy.</li>
  <li><strong>Clock skew (lệch đồng hồ)</strong> — dung sai cho chênh lệch đồng hồ khi kiểm hạn token (Spring Security mặc định 60 giây).</li>
  <li><strong>Proxy của server dev</strong> — server phát triển chuyển tiếp lời gọi API để trình duyệt chỉ thấy một origin.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một module gọi API: client có kiểu, token gắn theo từng request, 401 ⇒ đăng xuất một lần, mọi thất bại ⇒ một <code>Problem</code>.</li>
  <li>Câu thông báo theo <code>code</code>; lỗi từng ô từ <code>fields</code>; giờ hiển thị như chữ.</li>
  <li>Đo trong Chrome: bấm đúp ⇒ 1 request; mất phản hồi sau khi đã lưu ⇒ "bấm lại" ⇒ cùng khoá ⇒ 200 lặp lại, một dòng.</li>
  <li>Token 20 giây vẫn hợp lệ ở giây 22 (lệch 60 giây), bị từ chối ở giây 82 ⇒ về đăng nhập kèm lý do.</li>
  <li>XSS trong ô chữ: vô hại khi là chữ React; với <code>dangerouslySetInnerHTML</code> + localStorage thì đọc được JWT.</li>
  <li>Proxy Vite: gỡ header <code>Origin</code>, nếu không Spring trả 403.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://openapi-ts.dev/openapi-fetch/', '🧩', 'openapi-fetch', 'Client có kiểu, middleware.')}
${tl('https://vite.dev/config/server-options#server-proxy', '⚡', 'Vite — server.proxy', 'Tuỳ chọn proxy, hook configure.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html', '🛡️', 'OWASP — HTML5 Security Cheat Sheet', 'Local storage và dữ liệu nhạy cảm.')}
${tl('https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html', '⚛️', 'React — dangerouslySetInnerHTML', 'Khi nào và vì sao nguy hiểm.')}

<h3>Nguồn</h3>
<ul>
  <li>Tweet XSS tự retweet trên TweetDeck, 11/6/2014 (thông báo trạng thái của Twitter và báo chí cùng ngày).</li>
  <li>Mọi output: API LabFlow (Spring Boot 4.1.2) và trang React Chương 12 (React 19.3.1, Vite 7.3.8, openapi-fetch 0.13.8), Google Chrome 150 lái bằng Playwright, trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 12.5 =====
const MA125_CHAM = bash("# lab12/cham.sh (phần chấm) — trước đó: chép dự án, biên dịch, chạy trên CSDL sạch, curl /v3/api-docs > oa.json\n# ---- Mục 1: hợp đồng có tên, có Bearer\nt=$(q '.info.title // empty'); s=$(q '[.components.securitySchemes[]? | select(.scheme==\"bearer\")] | length')\n[ -n \"$t\" ] && [ \"${s:-0}\" -ge 1 ] && ok=1 || ok=0; muc 1 $ok \"/v3/api-docs: title \\\"${t:--}\\\", security scheme bearer: ${s:-0}\"\n\n# ---- Mục 2: POST /api/v1/bookings khai 201, 409, 422 — lỗi là application/problem+json có trường code\nr=$(q '.paths[\"/api/v1/bookings\"].post.responses | keys | join(\",\")')\nc=$(q '[.paths[\"/api/v1/bookings\"].post.responses[\"409\",\"422\"].content[\"application/problem+json\"].schema.\"$ref\" // empty] | length')\nref=$(q '.paths[\"/api/v1/bookings\"].post.responses[\"409\"].content[\"application/problem+json\"].schema.\"$ref\" // empty' | sed 's#.*/##')\nco=$([ -n \"$ref\" ] && q \".components.schemas[\\\"$ref\\\"].properties.code.type // empty\")\n[[ \",$r,\" == *,201,* && \",$r,\" == *,409,* && \",$r,\" == *,422,* ]] && [ \"$c\" = 2 ] && [ \"$co\" = string ] && ok=1 || ok=0\nmuc 2 $ok \"responses: ${r:--}; 409/422 dạng problem+json: ${c:-0}/2; schema lỗi có code: ${co:-không}\"\n\n# ---- Mục 3: operationId đặt có chủ đích — không trùng hậu tố _1, không còn tên phương thức Java tiếng Việt\nids=$(q '[.paths[][].operationId] | join(\" \")'); xau=$(for i in $ids; do [[ \"$i\" =~ _[0-9]+$ || \"$i\" =~ ^(dat|xem|huy|duyet|tuChoi|lich|cuaToi|danhSach|tao|doiTrangThai|dangKy|dangNhap)$ ]] && echo -n \"$i \"; done)\n[ -n \"$ids\" ] && [ -z \"$xau\" ] && ok=1 || ok=0; muc 3 $ok \"$(echo $ids | wc -w) operationId; còn tên chưa đặt: ${xau:-không}\"\n\n# ---- Mục 4: BookingView bắt buộc các trường luôn có ⇒ TypeScript không phải ?. khắp nơi\nrq=$(q '.components.schemas.BookingView.required // [] | join(\",\")'); thieu=\"\"\nfor f in id labCode startAt endAt status version; do [[ \",$rq,\" == *,$f,* ]] || thieu=\"$thieu $f\"; done\n[ -z \"$thieu\" ] && ok=1 || ok=0; muc 4 $ok \"BookingView.required: [${rq}]; thiếu:${thieu:- không}\"\n\n# ---- Mục 5: GET /api/v1/labs công khai trên hợp đồng (security: [])\ns5=$(q '.paths[\"/api/v1/labs\"].get.security | tojson'); [ \"$s5\" = \"[]\" ] && ok=1 || ok=0; muc 5 $ok \"GET /api/v1/labs security = ${s5:-null} (cần [])\"\n\n# ---- Mục 6: preflight từ frontend thật được phép, đủ header Idempotency-Key\nh=$(curl -s -D - -o /dev/null -X OPTIONS -H \"Origin: $FE\" -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: authorization,content-type,idempotency-key' $API/api/v1/bookings | tr -d '\\r')\nst=$(echo \"$h\" | head -1 | cut -d' ' -f2); ao=$(echo \"$h\" | grep -i '^access-control-allow-origin:' | cut -d' ' -f2); ah=$(echo \"$h\" | grep -i '^access-control-allow-headers:' | cut -d' ' -f2- | tr 'A-Z' 'a-z')\n[ \"$st\" = 200 ] && [ \"$ao\" = \"$FE\" ] && [[ \"$ah\" == *idempotency-key* ]] && ok=1 || ok=0; muc 6 $ok \"preflight $FE: HTTP ${st:-?}, allow-origin ${ao:--}, allow-headers ${ah:--}\"\n\n# ---- Mục 7: origin lạ KHÔNG được phép (kể cả khi gửi kèm credentials)\nh=$(curl -s -D - -o /dev/null -H \"Origin: $LA\" $API/api/v1/labs | tr -d '\\r'); ao=$(echo \"$h\" | grep -i '^access-control-allow-origin:' | cut -d' ' -f2)\n[ -z \"$ao\" ] && ok=1 || ok=0; muc 7 $ok \"Origin $LA ⇒ HTTP $(echo \"$h\" | head -1 | cut -d' ' -f2), allow-origin ${ao:-không có}\"\n\n# ---- Mục 8: JavaScript đọc được Location và Idempotent-Replayed\nex=$(curl -s -D - -o /dev/null -H \"Origin: $FE\" $API/api/v1/labs | tr -d '\\r' | grep -i '^access-control-expose-headers:' | cut -d' ' -f2- | tr 'A-Z' 'a-z')\n[[ \"$ex\" == *location* && \"$ex\" == *idempotent-replayed* ]] && ok=1 || ok=0; muc 8 $ok \"expose-headers: ${ex:-không có}\"\n\n# ---- Mục 9: 401 cùng khuôn lỗi với mọi lỗi khác\nb=$(curl -s -D \"$W/h9\" $API/api/v1/bookings/mine); ct=$(grep -i '^content-type:' \"$W/h9\" | tr -d '\\r' | cut -d' ' -f2-); c9=$(echo \"$b\" | jq -r '.code // empty' 2>/dev/null)\n[[ \"$ct\" == application/problem+json* ]] && [ -n \"$c9\" ] && ok=1 || ok=0; muc 9 $ok \"không token ⇒ $(head -1 \"$W/h9\" | tr -d '\\r' | cut -d' ' -f2), content-type ${ct:-không có}, code ${c9:-không có}\"\n\n# ---- Mục 10: profile prod đóng tài liệu API\nif chay prod; then a=$(curl -s -o /dev/null -w '%{http_code}' $API/v3/api-docs); u=$(curl -s -o /dev/null -w '%{http_code}' $API/swagger-ui/index.html)\n  [ \"$a$u\" = 404404 ] && ok=1 || ok=0; muc 10 $ok \"prod: /v3/api-docs $a · /swagger-ui/index.html $u (cần 404 · 404)\"\nelse muc 10 0 \"profile prod không khởi động được\"; fi\necho \"Điểm: $diem/10\"");
const OUT125_STARTER = out("$ bash lam.sh starter && bash cham.sh ~/lab12/starter\nMục 1: ĐẠT   — /v3/api-docs: title \"LabFlow API\", security scheme bearer: 1\nMục 2: TRƯỢT — responses: 200; 409/422 dạng problem+json: 0/2; schema lỗi có code: không\nMục 3: TRƯỢT — 13 operationId; còn tên chưa đặt: danhSach tao dat tuChoi huy duyet dangKy dangNhap doiTrangThai cuaToi xem lich cuaToi_1 \nMục 4: TRƯỢT — BookingView.required: []; thiếu: id labCode startAt endAt status version\nMục 5: TRƯỢT — GET /api/v1/labs security = null (cần [])\nMục 6: ĐẠT   — preflight http://localhost:5173: HTTP 200, allow-origin http://localhost:5173, allow-headers authorization, content-type, idempotency-key\nMục 7: ĐẠT   — Origin https://ke-xau.example ⇒ HTTP 403, allow-origin không có\nMục 8: TRƯỢT — expose-headers: không có\nMục 9: TRƯỢT — không token ⇒ 401, content-type không có, code không có\nMục 10: TRƯỢT — prod: /v3/api-docs 200 · /swagger-ui/index.html 200 (cần 404 · 404)\nĐiểm: 3/10");
const OUT125_GIAI = out("$ bash cham.sh ~/lab12/giai\nMục 1: ĐẠT   — /v3/api-docs: title \"LabFlow API\", security scheme bearer: 1\nMục 2: ĐẠT   — responses: 200,201,400,401,409,422,500; 409/422 dạng problem+json: 2/2; schema lỗi có code: string\nMục 3: ĐẠT   — 13 operationId; còn tên chưa đặt: không\nMục 4: ĐẠT   — BookingView.required: [endAt,id,labCode,purpose,startAt,status,version]; thiếu: không\nMục 5: ĐẠT   — GET /api/v1/labs security = [] (cần [])\nMục 6: ĐẠT   — preflight http://localhost:5173: HTTP 200, allow-origin http://localhost:5173, allow-headers authorization, content-type, idempotency-key\nMục 7: ĐẠT   — Origin https://ke-xau.example ⇒ HTTP 403, allow-origin không có\nMục 8: ĐẠT   — expose-headers: location, idempotent-replayed\nMục 9: ĐẠT   — không token ⇒ 401, content-type application/problem+json;charset=UTF-8, code UNAUTHORIZED\nMục 10: ĐẠT   — prod: /v3/api-docs 404 · /swagger-ui/index.html 404 (cần 404 · 404)\nĐiểm: 10/10");
const OUT125_BAY = out("$ bash cham.sh ~/lab12/bay      # lời giải, nhưng CORS đổi thành allowedOriginPatterns(\"*\") + allowCredentials(true)\nMục 1: ĐẠT   — /v3/api-docs: title \"LabFlow API\", security scheme bearer: 1\nMục 2: ĐẠT   — responses: 200,201,400,401,409,422,500; 409/422 dạng problem+json: 2/2; schema lỗi có code: string\nMục 3: ĐẠT   — 13 operationId; còn tên chưa đặt: không\nMục 4: ĐẠT   — BookingView.required: [endAt,id,labCode,purpose,startAt,status,version]; thiếu: không\nMục 5: ĐẠT   — GET /api/v1/labs security = [] (cần [])\nMục 6: ĐẠT   — preflight http://localhost:5173: HTTP 200, allow-origin http://localhost:5173, allow-headers authorization, content-type, idempotency-key\nMục 7: TRƯỢT — Origin https://ke-xau.example ⇒ HTTP 200, allow-origin https://ke-xau.example\nMục 8: ĐẠT   — expose-headers: location, idempotent-replayed\nMục 9: ĐẠT   — không token ⇒ 401, content-type application/problem+json;charset=UTF-8, code UNAUTHORIZED\nMục 10: ĐẠT   — prod: /v3/api-docs 404 · /swagger-ui/index.html 404 (cần 404 · 404)\nĐiểm: 9/10");

const L125_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5 · Lab</span>
<h2>Chapter 12 lab + interview questions</h2>
<p class="lead">Your SWP391 team has LabFlow exactly as Chapter 18 left it: the API works, the tests are green — and the frontend member has sent five messages this morning. The Swagger page says every endpoint returns "200 OK", the generated client is called <code>cuaToi_1</code>, every field is optional, the "already booked" message never shows up, an expired token crashes the error handler, and the API documentation is open on the production server. Your task is to make the API pleasant and safe for a frontend. A grading script checks ten things against the running API, the way a careful frontend lead and a security reviewer would.</p>

<h3>The starting point</h3>
<p>The starter is the Chapter 18 LabFlow project, unchanged. It already has springdoc with a bearer security scheme and a CORS configuration that allows <code>http://localhost:5173</code>. Everything else in this chapter is missing.</p>

<h3>The contract (what the grader assumes)</h3>
<ul>
  <li>The project builds with <code>mvn compile</code>; the main class is <code>vn.labflow.LabflowApplication</code>; the database is configured through <code>LABFLOW_DB_*</code> as in Chapter 18.</li>
  <li>The frontend origin is <code>http://localhost:5173</code> (the default of <code>labflow.cors.origins</code>).</li>
  <li>The contract is at <code>/v3/api-docs</code> when no profile is active; the <code>prod</code> profile must start on an empty database.</li>
  <li>You may change anything else.</li>
</ul>

<h3>The grader</h3>
<p>It copies your project, compiles it, starts it twice on a clean PostgreSQL in its own network namespace (once without a profile, once with <code>prod</code>), reads the contract and sends real HTTP requests — including preflights with an <code>Origin</code> header, which is what a browser sends. Passwords are generated per run.</p>
${MA125_CHAM}
<p>The starter, graded for real (about 35 seconds):</p>
${OUT125_STARTER}

<h3>Part A — the API (graded)</h3>
<ol>
  <li><strong>Contract</strong> (items 2–5): business errors on <code>POST /api/v1/bookings</code> as <code>application/problem+json</code> with a schema that has <code>code</code>; an <code>operationId</code> for every endpoint (no Java method names, no <code>_1</code>); required fields on <code>BookingView</code>; public endpoints marked with an empty security requirement — lesson 12.1.</li>
  <li><strong>CORS</strong> (items 6–8): the frontend's preflight allowed with the <code>Idempotency-Key</code> header, any other origin refused, <code>Location</code> and <code>Idempotent-Replayed</code> exposed — lesson 12.3.</li>
  <li><strong>Errors</strong> (item 9): 401 in the same ProblemDetail shape as every other error — lesson 12.2.</li>
  <li><strong>Production</strong> (item 10): documentation closed in the <code>prod</code> profile — lesson 12.1.</li>
</ol>

<h3>Part B — the page (self-checked)</h3>
<ol>
  <li>Export the contract (<code>curl -s localhost:8080/v3/api-docs &gt; openapi.json</code>), run <code>npm run gen:api</code> and <code>npx tsc -b</code> in the frontend of 12.4. It must compile with <code>Problem</code> imported from the generated types and without a single <code>as unknown as</code>.</li>
  <li>In a real browser on <code>localhost:5173</code>: book a slot, then simulate a lost response (DevTools → Network → right-click the request → "Block request URL" after the first try, or stop the API between request and response) and press again. The page must say "already booked" with the same booking number.</li>
  <li>Log in, wait until the token expires (set <code>labflow.jwt.access-ttl=PT20S</code> and remember the 60-second skew), and press "Reload": the page must return to the login form with a reason.</li>
</ol>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Part</th><th>Items</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>Contract complete: errors, operation ids, required fields, public endpoints</td><td>1–5</td><td>5</td></tr>
    <tr><td>CORS: frontend allowed, others refused, headers exposed</td><td>6–8</td><td>3</td></tr>
    <tr><td>One error shape including 401</td><td>9</td><td>1</td></tr>
    <tr><td>Docs closed in production</td><td>10</td><td>1</td></tr>
    <tr><td><em>Review (by a teammate, not the script)</em>: Part B done and shown in a browser; <code>openapi.json</code> committed; a CI step with <code>oasdiff breaking --fail-on ERR</code> against main</td><td>—</td><td>pass/fail</td></tr>
  </tbody>
</table>

${giai('Show the reference solution (try first!)', `<p>The reference solution adds or replaces nine files of the starter — the same code shown in lessons 12.1–12.3: <code>shared/Problem.java</code> and <code>shared/ApiDocs.java</code> (customizer adding 400/401/500); <code>BookingController</code> and <code>BookingView</code> with <code>@Operation</code>, <code>@ApiResponse</code> and <code>requiredProperties</code>; <code>@Operation(operationId = …)</code> on <code>AuthController</code> (<code>register</code>, <code>login</code>), <code>LabController</code> (<code>listLabs</code>, <code>createLab</code>, <code>changeLabStatus</code>) and <code>ThongBaoController</code> (<code>listMyNotifications</code>), with <code>@SecurityRequirements()</code> on the public ones; in <code>BaoMat</code>, <code>setExposedHeaders(List.of("Location", "Idempotent-Replayed"))</code> and the <code>loi401()</code> entry point registered both in <code>exceptionHandling</code> and in <code>oauth2ResourceServer</code>; and <code>application-prod.properties</code> with the two <code>springdoc.*.enabled=false</code> lines.</p>
${OUT125_GIAI}
<p>To check that the grader is not fooled by a solution that "works" because it allows everything, the reference solution was graded again with one change — <code>allowedOriginPatterns("*")</code> and <code>allowCredentials(true)</code> instead of the exact origin list:</p>
${OUT125_BAY}
<p>Item 6 still passes (the frontend is allowed — so is everyone else), item 7 catches the reflection. A browser-only test would never notice: everything "works".</p>`)}

<h3>🕵️ Hacker corner — Optus, 2022</h3>
<p>In September 2022 the Australian telecom Optus lost personal data of about 9.8 million customers — names, dates of birth, phone numbers, and for millions, passport or driver's licence numbers. Optus first called it a sophisticated attack; Australian government statements and later reporting described an internet-facing API endpoint that did not require authentication, where customer records could be fetched by incrementing an identifier. Whatever the final details, the pattern is the one this chapter keeps returning to: an endpoint nobody listed is an endpoint nobody reviewed. A generated contract makes every endpoint visible to the team; a CI diff makes every new one a conscious decision; keeping that contract off the public internet keeps the map away from attackers — and none of it replaces authentication on every endpoint (Chapters 9–10).</p>

<h3>🎤 What the interviewer will ask (whole chapter)</h3>
<ol>
  <li><strong>"How do frontend and backend agree on an API in your team?"</strong> — OpenAPI generated from the code with springdoc, errors and headers documented, committed and compared in CI with <code>oasdiff</code>; TypeScript types generated for the frontend so changes become compile errors. Numbers: one rename ⇒ 400 for old clients, <code>tsc</code> error for new ones, CI exit 1.</li>
  <li><strong>"Explain CORS and a preflight."</strong> — Browser-side relaxation of the same-origin policy; non-simple requests are preceded by <code>OPTIONS</code>; must be answered before authentication (<code>http.cors()</code>); expose the headers the frontend reads; never reflect origins with credentials. CORS is not access control — curl ignores it.</li>
  <li><strong>"What makes an API pleasant for a frontend?"</strong> — One list envelope, one paging/sorting convention, responses shaped for screens (1 + N requests: 2 020 ms vs 91 ms at 80 ms latency), safe numbers and explicit times, one error shape with stable codes — including 401.</li>
  <li><strong>"Where do you keep the JWT in a React app?"</strong> — In memory (refresh token in an HttpOnly cookie); localStorage is readable by any injected script — measured: one <code>dangerouslySetInnerHTML</code> and the token is gone. Prevent XSS first.</li>
  <li><strong>"How do you make a POST safe to retry from the UI?"</strong> — Disable the button while sending, send an <code>Idempotency-Key</code> per intention and reuse it on retry; the server returns the first result (measured: response lost after save, retry ⇒ 200 replay, one row).</li>
</ol>

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Grader</strong> — script that checks a project against the behaviour a reviewer expects, on a clean copy.</li>
  <li><strong>Contract test</strong> — a test that reads the published contract (here <code>/v3/api-docs</code>) rather than the code.</li>
  <li><strong>Origin reflection</strong> — the CORS mistake of trusting whatever <code>Origin</code> arrives.</li>
  <li><strong>Profile-specific configuration</strong> — <code>application-prod.properties</code> overriding defaults when <code>prod</code> is active.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Starter 3/10: only the title/security scheme, the frontend preflight and the refusal of other origins were there.</li>
  <li>Reference solution 10/10 with nine files; the "allow everything" variant drops to 9/10 on item 7.</li>
  <li>Part B is checked in a browser, because CORS and token storage only exist there.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Optus data breach, September 2022: Optus statements, Australian Government (Minister for Home Affairs, Minister for Communications) statements and press coverage, September–October 2022.</li>
  <li>All outputs: <code>lab12/cham.sh</code> run against the starter, the reference solution and the trap variant on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L125_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5 · Lab</span>
<h2>Lab chương 12 + câu hỏi phỏng vấn</h2>
<p class="lead">Nhóm SWP391 của bạn có LabFlow đúng như Chương 18 để lại: API chạy, test xanh — và bạn frontend đã gửi năm tin nhắn từ sáng. Trang Swagger nói mọi endpoint trả "200 OK", client sinh ra tên là <code>cuaToi_1</code>, trường nào cũng tuỳ chọn, câu "đã đặt từ trước" không bao giờ hiện, token hết hạn làm sập hàm xử lý lỗi, và tài liệu API đang mở trên server production. Việc của bạn là làm API dễ chịu và an toàn cho frontend. Một bộ chấm kiểm mười điều trên API đang chạy, như một trưởng nhóm frontend cẩn thận và một người duyệt bảo mật sẽ làm.</p>

<h3>Điểm xuất phát</h3>
<p>Bản khởi đầu là dự án LabFlow của Chương 18, giữ nguyên. Nó đã có springdoc với security scheme bearer và cấu hình CORS cho phép <code>http://localhost:5173</code>. Mọi thứ khác của chương này đều chưa có.</p>

<h3>Hợp đồng (điều bộ chấm giả định)</h3>
<ul>
  <li>Dự án build được bằng <code>mvn compile</code>; lớp chính là <code>vn.labflow.LabflowApplication</code>; CSDL cấu hình qua <code>LABFLOW_DB_*</code> như Chương 18.</li>
  <li>Origin của frontend là <code>http://localhost:5173</code> (giá trị mặc định của <code>labflow.cors.origins</code>).</li>
  <li>Hợp đồng nằm ở <code>/v3/api-docs</code> khi không bật profile nào; profile <code>prod</code> phải khởi động được trên CSDL trống.</li>
  <li>Mọi thứ khác bạn được đổi.</li>
</ul>

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn, biên dịch, khởi động hai lần trên một PostgreSQL sạch trong network namespace riêng (một lần không profile, một lần với <code>prod</code>), đọc hợp đồng và gửi request HTTP thật — kể cả preflight kèm header <code>Origin</code>, đúng thứ trình duyệt gửi. Mật khẩu sinh mới cho mỗi lượt.</p>
${MA125_CHAM}
<p>Bản khởi đầu, chấm thật (khoảng 35 giây):</p>
${OUT125_STARTER}

<h3>Phần A — API (có chấm)</h3>
<ol>
  <li><strong>Hợp đồng</strong> (mục 2–5): lỗi nghiệp vụ của <code>POST /api/v1/bookings</code> dạng <code>application/problem+json</code> với schema có <code>code</code>; mọi endpoint có <code>operationId</code> (không tên phương thức Java, không <code>_1</code>); trường bắt buộc trên <code>BookingView</code>; endpoint công khai đánh dấu bằng yêu cầu bảo mật rỗng — bài 12.1.</li>
  <li><strong>CORS</strong> (mục 6–8): preflight của frontend được phép kèm header <code>Idempotency-Key</code>, mọi origin khác bị từ chối, <code>Location</code> và <code>Idempotent-Replayed</code> được khai — bài 12.3.</li>
  <li><strong>Lỗi</strong> (mục 9): 401 cùng khuôn ProblemDetail với mọi lỗi khác — bài 12.2.</li>
  <li><strong>Production</strong> (mục 10): đóng tài liệu ở profile <code>prod</code> — bài 12.1.</li>
</ol>

<h3>Phần B — trang web (tự kiểm)</h3>
<ol>
  <li>Xuất hợp đồng (<code>curl -s localhost:8080/v3/api-docs &gt; openapi.json</code>), chạy <code>npm run gen:api</code> và <code>npx tsc -b</code> trong frontend của bài 12.4. Phải biên dịch được với <code>Problem</code> import từ kiểu sinh ra và không còn một <code>as unknown as</code> nào.</li>
  <li>Trong trình duyệt thật ở <code>localhost:5173</code>: đặt một khung giờ, rồi giả mất phản hồi (DevTools → Network → chuột phải request → "Block request URL" sau lần thử đầu, hoặc dừng API giữa lúc gửi và lúc trả) rồi bấm lại. Trang phải báo "đã đặt từ trước" với đúng số lượt cũ.</li>
  <li>Đăng nhập, chờ token hết hạn (đặt <code>labflow.jwt.access-ttl=PT20S</code> và nhớ 60 giây dung sai), rồi bấm "Tải lại": trang phải về form đăng nhập kèm lý do.</li>
</ol>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Phần</th><th>Mục</th><th>Điểm</th></tr></thead>
  <tbody>
    <tr><td>Hợp đồng đầy đủ: lỗi, operationId, trường bắt buộc, endpoint công khai</td><td>1–5</td><td>5</td></tr>
    <tr><td>CORS: frontend được phép, nơi khác bị từ chối, header được khai</td><td>6–8</td><td>3</td></tr>
    <tr><td>Một khuôn lỗi, kể cả 401</td><td>9</td><td>1</td></tr>
    <tr><td>Đóng tài liệu ở production</td><td>10</td><td>1</td></tr>
    <tr><td><em>Duyệt (bởi đồng đội, không phải script)</em>: làm xong Phần B và trình diễn trong trình duyệt; <code>openapi.json</code> được commit; một bước CI <code>oasdiff breaking --fail-on ERR</code> so với main</td><td>—</td><td>đạt/không đạt</td></tr>
  </tbody>
</table>

${giai('Xem lời giải tham khảo (thử trước đã!)', `<p>Lời giải tham khảo thêm hoặc thay chín tệp của bản khởi đầu — đúng mã đã trình bày ở bài 12.1–12.3: <code>shared/Problem.java</code> và <code>shared/ApiDocs.java</code> (customizer thêm 400/401/500); <code>BookingController</code> và <code>BookingView</code> có <code>@Operation</code>, <code>@ApiResponse</code> và <code>requiredProperties</code>; <code>@Operation(operationId = …)</code> trên <code>AuthController</code> (<code>register</code>, <code>login</code>), <code>LabController</code> (<code>listLabs</code>, <code>createLab</code>, <code>changeLabStatus</code>) và <code>ThongBaoController</code> (<code>listMyNotifications</code>), kèm <code>@SecurityRequirements()</code> trên các endpoint công khai; trong <code>BaoMat</code>, <code>setExposedHeaders(List.of("Location", "Idempotent-Replayed"))</code> và entry point <code>loi401()</code> đăng ký ở cả <code>exceptionHandling</code> lẫn <code>oauth2ResourceServer</code>; và <code>application-prod.properties</code> với hai dòng <code>springdoc.*.enabled=false</code>.</p>
${OUT125_GIAI}
<p>Để chắc bộ chấm không bị lừa bởi một lời giải "chạy được" nhờ cho phép tất cả, lời giải tham khảo được chấm lại với một thay đổi — <code>allowedOriginPatterns("*")</code> và <code>allowCredentials(true)</code> thay cho danh sách origin chính xác:</p>
${OUT125_BAY}
<p>Mục 6 vẫn đạt (frontend được phép — và ai cũng được phép), mục 7 bắt được việc phản chiếu. Một bài kiểm chỉ bằng trình duyệt sẽ không bao giờ nhận ra: mọi thứ đều "chạy".</p>`)}

<h3>🕵️ Góc hacker — Optus, 2022</h3>
<p>Tháng 9/2022, nhà mạng Úc Optus làm lộ dữ liệu cá nhân của khoảng 9,8 triệu khách hàng — họ tên, ngày sinh, số điện thoại, và với hàng triệu người là số hộ chiếu hoặc bằng lái. Optus ban đầu gọi đó là một cuộc tấn công tinh vi; các phát biểu của chính phủ Úc và báo chí sau đó mô tả một endpoint API nhìn ra internet không đòi xác thực, nơi lấy được hồ sơ khách hàng bằng cách tăng dần một mã định danh. Dù chi tiết cuối cùng thế nào, khuôn mẫu vẫn là điều chương này cứ quay lại: endpoint không ai liệt kê là endpoint không ai duyệt. Hợp đồng sinh tự động làm mọi endpoint hiện ra trước cả nhóm; so khác biệt trong CI biến mỗi endpoint mới thành một quyết định có ý thức; giữ hợp đồng khỏi internet công khai giữ tấm bản đồ khỏi tay kẻ tấn công — và không cái nào thay được xác thực trên mọi endpoint (Chương 9–10).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi (cả chương)</h3>
<ol>
  <li><strong>"Trong nhóm bạn, frontend và backend thống nhất API thế nào?"</strong> — OpenAPI sinh từ mã bằng springdoc, có mô tả lỗi và header, được commit và so trong CI bằng <code>oasdiff</code>; kiểu TypeScript sinh cho frontend để thay đổi thành lỗi biên dịch. Số liệu: đổi tên một trường ⇒ client cũ nhận 400, client mới lỗi <code>tsc</code>, CI thoát mã 1.</li>
  <li><strong>"Giải thích CORS và preflight."</strong> — Trình duyệt nới chính sách cùng nguồn; request không đơn giản có <code>OPTIONS</code> đi trước; phải trả lời trước bước xác thực (<code>http.cors()</code>); khai các header frontend cần đọc; không bao giờ phản chiếu origin khi có credentials. CORS không phải kiểm soát truy cập — curl bỏ qua nó.</li>
  <li><strong>"Điều gì làm API dễ chịu với frontend?"</strong> — Một khuôn danh sách, một quy ước phân trang/sắp xếp, phản hồi đúng nhu cầu màn hình (1 + N request: 2 020 ms so với 91 ms ở độ trễ 80 ms), con số an toàn và giờ giấc rõ ràng, một khuôn lỗi với mã ổn định — kể cả 401.</li>
  <li><strong>"Bạn cất JWT ở đâu trong ứng dụng React?"</strong> — Trong bộ nhớ (refresh token trong cookie HttpOnly); localStorage thì mọi script chèn vào đều đọc được — đo thật: một <code>dangerouslySetInnerHTML</code> là mất token. Chặn XSS trước đã.</li>
  <li><strong>"Làm sao để một POST thử lại an toàn từ giao diện?"</strong> — Khoá nút trong lúc gửi, gửi <code>Idempotency-Key</code> cho mỗi ý định và dùng lại khi thử lại; server trả kết quả đầu tiên (đo thật: mất phản hồi sau khi đã lưu, thử lại ⇒ 200 lặp lại, một dòng).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Bộ chấm (grader)</strong> — script kiểm dự án theo hành vi mà người duyệt mong đợi, trên một bản sao sạch.</li>
  <li><strong>Contract test</strong> — bài kiểm đọc hợp đồng đã công bố (ở đây là <code>/v3/api-docs</code>) thay vì đọc mã.</li>
  <li><strong>Phản chiếu origin</strong> — lỗi CORS khi tin bất kỳ <code>Origin</code> nào gửi tới.</li>
  <li><strong>Cấu hình theo profile</strong> — <code>application-prod.properties</code> ghi đè mặc định khi bật <code>prod</code>.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bản khởi đầu 3/10: chỉ có tiêu đề/security scheme, preflight của frontend và việc từ chối origin khác.</li>
  <li>Lời giải tham khảo 10/10 với chín tệp; biến thể "cho phép tất cả" tụt xuống 9/10 ở mục 7.</li>
  <li>Phần B kiểm trong trình duyệt, vì CORS và chỗ cất token chỉ tồn tại ở đó.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Vụ lộ dữ liệu Optus, tháng 9/2022: thông báo của Optus, phát biểu của Chính phủ Úc (Bộ trưởng Nội vụ, Bộ trưởng Truyền thông) và báo chí, tháng 9–10/2022.</li>
  <li>Mọi output: <code>lab12/cham.sh</code> chạy trên bản khởi đầu, lời giải tham khảo và biến thể bẫy, trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ12 = [
  Q('springdoc generates the contract of LabFlow with no documentation annotations. What does POST /api/v1/bookings declare as responses?|||springdoc sinh hợp đồng LabFlow khi chưa có annotation tài liệu nào. POST /api/v1/bookings khai những phản hồi gì?', [
    'Every status the code can return, read from the exception handlers|||Mọi mã trạng thái mà mã có thể trả, đọc từ các exception handler',
    'Only 200 OK with content type */*|||Chỉ 200 OK với kiểu nội dung */*',
    '201 and 409, because of the unique constraint|||201 và 409, nhờ ràng buộc unique',
    'Nothing; springdoc needs @ApiResponse to list any response|||Không gì cả; springdoc cần @ApiResponse mới liệt kê được',
  ], 1),
  Q('A backend developer renames the request field purpose to note. A frontend built yesterday sends purpose. What does it get?|||Một bạn backend đổi tên trường request purpose thành note. Bản frontend build hôm qua vẫn gửi purpose. Nó nhận được gì?', [
    '201: Jackson maps unknown fields by position|||201: Jackson ánh xạ trường lạ theo vị trí',
    '500: the server cannot read the body|||500: server không đọc được body',
    '400 VALIDATION with fields.note = "must not be blank"|||400 VALIDATION với fields.note = "must not be blank"',
    '415 Unsupported Media Type|||415 Unsupported Media Type',
  ], 2),
  Q('Which change is NOT breaking for existing clients?|||Thay đổi nào KHÔNG phá client đang có?', [
    'Adding an optional field to a response|||Thêm một trường tuỳ chọn vào phản hồi',
    'Adding a required field to a request|||Thêm một trường bắt buộc vào request',
    'Renaming a response field|||Đổi tên một trường phản hồi',
    'Removing the 409 status the client handles|||Bỏ mã 409 mà client đang xử lý',
  ], 0),
  Q('In Chrome with 80 ms latency, the "My bookings" screen with 20 lab names took 549 ms using 1 + 20 parallel requests but 213 ms in Node.js. Why?|||Trong Chrome với độ trễ 80 ms, màn "Lượt của tôi" có 20 tên phòng mất 549 ms khi gọi 1 + 20 request song song, còn trong Node.js là 213 ms. Vì sao?', [
    'Chrome runs JavaScript slower than Node.js|||Chrome chạy JavaScript chậm hơn Node.js',
    'Chrome sends a preflight before every request|||Chrome gửi preflight trước mọi request',
    'The browser opens about six HTTP/1.1 connections per origin, so requests wait in waves|||Trình duyệt chỉ mở khoảng sáu kết nối HTTP/1.1 tới một origin, nên request phải chờ theo đợt',
    'Spring Boot limits connections from browsers|||Spring Boot giới hạn kết nối từ trình duyệt',
  ], 2),
  Q('The API returns {"id":9007199254740993}. What does JSON.parse give in JavaScript?|||API trả {"id":9007199254740993}. JSON.parse trong JavaScript cho ra gì?', [
    'A TypeError because the number is too large|||Một TypeError vì số quá lớn',
    '9007199254740992, silently|||9007199254740992, không báo gì',
    'A BigInt|||Một BigInt',
    'The string "9007199254740993"|||Chuỗi "9007199254740993"',
  ], 1),
  Q('With Spring Security defaults, what body does a request without a token to a protected endpoint receive?|||Với mặc định của Spring Security, request không có token tới endpoint cần đăng nhập nhận thân gì?', [
    'A ProblemDetail from @RestControllerAdvice|||Một ProblemDetail từ @RestControllerAdvice',
    'An HTML login page|||Một trang đăng nhập HTML',
    'An empty body (Content-Length: 0) with a WWW-Authenticate header|||Thân rỗng (Content-Length: 0) kèm header WWW-Authenticate',
    'A JSON {"error":"unauthorized"}|||Một JSON {"error":"unauthorized"}',
  ], 2),
  Q('The security chain does not call http.cors(). A page on another origin sends a simple GET to a public endpoint. What happens?|||Chuỗi bảo mật không gọi http.cors(). Một trang ở origin khác gửi GET đơn giản tới endpoint công khai. Chuyện gì xảy ra?', [
    'The server never receives the request|||Server không bao giờ nhận được request',
    'The server executes it and returns 200, but the browser does not let the page read the response|||Server thực thi và trả 200, nhưng trình duyệt không cho trang đọc phản hồi',
    'The server returns 403 Invalid CORS request|||Server trả 403 Invalid CORS request',
    'The browser shows the response because GET is always allowed|||Trình duyệt hiện phản hồi vì GET luôn được phép',
  ], 1),
  Q('CORS allows the frontend origin but does not set exposed headers. After a successful booking (201), what does response.headers.get("Location") return in the page?|||CORS cho phép origin của frontend nhưng không khai exposed headers. Sau khi đặt thành công (201), response.headers.get("Location") trong trang trả gì?', [
    '/api/v1/bookings/{id}|||/api/v1/bookings/{id}',
    'An exception|||Một exception',
    'undefined|||undefined',
    'null|||null',
  ], 3),
  Q('allowedOriginPatterns("*") with allowCredentials(true). A request arrives with Origin: https://ke-xau.example. What does Spring answer?|||allowedOriginPatterns("*") kèm allowCredentials(true). Một request tới với Origin: https://ke-xau.example. Spring trả gì?', [
    'Access-Control-Allow-Origin: https://ke-xau.example and Access-Control-Allow-Credentials: true|||Access-Control-Allow-Origin: https://ke-xau.example và Access-Control-Allow-Credentials: true',
    '403 Invalid CORS request|||403 Invalid CORS request',
    'Access-Control-Allow-Origin: *|||Access-Control-Allow-Origin: *',
    'An IllegalArgumentException at startup|||Một IllegalArgumentException lúc khởi động',
  ], 0),
  Q('The booking response is lost after the server saved it. The user presses "Book" again with the same Idempotency-Key. What happens?|||Phản hồi đặt phòng bị mất sau khi server đã lưu. Người dùng bấm "Đặt" lần nữa với cùng Idempotency-Key. Chuyện gì xảy ra?', [
    'A second booking is created|||Một lượt đặt thứ hai được tạo',
    '409 SLOT_TAKEN, because the slot is now taken|||409 SLOT_TAKEN, vì khung giờ giờ đã có người',
    '200 with the same booking and Idempotent-Replayed: true; the database keeps one row|||200 với đúng lượt cũ và Idempotent-Replayed: true; CSDL giữ một dòng',
    '400, because the key was already used|||400, vì khoá đã được dùng',
  ], 2),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `12.${n} — ${en}|||12.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 12 — An API frontends love: OpenAPI and React|||Chương 12 — API mà frontend thích: OpenAPI và React',
  description: 'Làm LabFlow dễ dùng và an toàn cho frontend, đo trong Chrome thật: hợp đồng OpenAPI sinh bằng springdoc rồi bổ sung lỗi, header, trường bắt buộc; client TypeScript sinh tự động, đổi tên một trường bị tsc và oasdiff bắt; khuôn danh sách, 1 + N request, số lớn hơn 2^53, giờ không múi, 401 thân rỗng, phiên bản API của Spring 7; CORS từng cấu hình sai; trang React đặt phòng với thử lại an toàn, XSS và token hết hạn; lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-12-1-openapi-spring', 'OpenAPI docs with springdoc', 'Tài liệu OpenAPI với springdoc',
      'Hợp đồng OpenAPI 3.1 sinh từ mã LabFlow, đo trước và sau: mặc định chỉ có 200 */*, mọi trường tuỳ chọn, operationId là tên phương thức (cuaToi_1); thêm lỗi chung bằng OpenApiCustomizer, lỗi nghiệp vụ và header trên endpoint, requiredProperties; sinh kiểu TypeScript; đổi tên một trường ⇒ client cũ 400, tsc báo lỗi, oasdiff thoát mã 1; tắt tài liệu ở production; CVE-2018-25031.',
      L121_EN + L121_VI),
    L(2, 'sb-12-2-thiet-ke-api-fe', 'Designing APIs frontend developers enjoy', 'Thiết kế API mà frontend dùng thấy dễ chịu',
      'Sáu điều làm frontend khổ, đo thật và sửa ở backend: Page của Spring Data 12 trường nội bộ ⇒ khuôn riêng; quy ước lọc/sắp xếp/phân trang có allow-list; 1 + N request ở 80 ms: 2 020 ms, song song 549 ms (sáu kết nối), gộp 91 ms; id lớn hơn 2^53 bị đổi; LocalDateTime lệch 7 giờ giữa Hà Nội và London; 401 thân rỗng ⇒ ProblemDetail; phiên bản API của Spring Framework 7; Peloton 2021.',
      L122_EN + L122_VI),
    L(3, 'sb-12-3-cors-spring', 'CORS configured correctly', 'Cấu hình CORS đúng cách',
      'CORS trong Chrome thật, có log mọi request ở server: origin lạ ⇒ 403 Invalid CORS request còn curl vẫn lấy được dữ liệu; quên http.cors() ⇒ GET vẫn chạy, preflight bị 401; thiếu exposedHeaders ⇒ Location và Idempotent-Replayed đọc ra null; max-age 3600 ⇒ 1 preflight cho 5 request; "*" + credentials ⇒ 500, pattern "*" ⇒ phản chiếu mọi origin; Kettle 2016.',
      L123_EN + L123_VI),
    L(4, 'sb-12-4-gan-vao-react', 'Wiring a real React page to the API', 'Gắn một trang React thật vào API',
      'Trang React 19 đặt phòng trên client sinh từ OpenAPI, lái bằng Playwright trong Chrome: lỗi từng ô từ fields, SLOT_TAKEN thành câu dễ hiểu, bấm đúp chỉ một request, mất phản hồi sau khi lưu ⇒ bấm lại cùng khoá ⇒ 200 lặp lại, một dòng; token 20 giây còn dùng ở giây 22 (lệch 60 giây), hết ở giây 82; XSS đọc JWT trong localStorage; proxy Vite phải gỡ Origin; TweetDeck 2014.',
      L124_EN + L124_VI),
    L(5, 'sb-12-5-lab-12', 'Chapter 12 lab + interview questions', 'Lab chương 12 + câu hỏi phỏng vấn',
      'Lab có bộ chấm 10 mục chạy thật trên API: biến LabFlow của Chương 18 thành API frontend thích — hợp đồng đủ lỗi, operationId, trường bắt buộc, endpoint công khai; CORS đúng origin, từ chối origin lạ, khai header; 401 cùng khuôn; đóng tài liệu ở production. Bản khởi đầu 3/10, lời giải 10/10 (ẩn), biến thể "cho phép tất cả" 9/10; phần trang web tự kiểm trong trình duyệt; Optus 2022; câu phỏng vấn cả chương.',
      L125_EN + L125_VI),
    {
      title: '12.6 — Chapter 12 quiz|||12.6 — Kiểm tra chương 12',
      slug: 'sb-12-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong chương: hợp đồng mặc định chỉ có 200, đổi tên trường làm client cũ nhận 400, thay đổi nào không phá client, sáu kết nối mỗi origin, số 2^53, 401 thân rỗng, GET vẫn chạy khi thiếu http.cors(), Location đọc ra null, phản chiếu origin, thử lại cùng khoá idempotency.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a contract that only knew "200", a renamed field, 21 requests against one, an id that changed in JavaScript, a 401 with no body, a header the page could not read, a server that trusted every origin, a booking saved once although the user pressed twice. Pass mark 7/10.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một hợp đồng chỉ biết "200", một trường bị đổi tên, 21 request so với một, một id bị đổi trong JavaScript, một 401 không có thân, một header trang không đọc được, một server tin mọi origin, một lượt đặt chỉ lưu một lần dù người dùng bấm hai lần. Đạt từ 7/10.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ12 },
    },
  ],
};
