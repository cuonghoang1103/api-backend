---
name: thiet-ke-api
description: Thiết kế REST API: route, mã trạng thái, định dạng lỗi, validate, phân trang, chống IDOR, Swagger/OpenAPI.
---

# KỸ NĂNG: THIẾT KẾ API — đoán được, an toàn, tự kiểm được

Mục tiêu: người gọi API đoán đúng hành vi mà không cần đọc mã; lỗi nói rõ sai ở đâu mà không lộ nội tạng server;
không ai đọc/sửa được dữ liệu của người khác; và mọi endpoint đã được GỌI THẬT trước khi báo xong.

## 0. Luật vàng

1. **Theo quy ước sẵn có của dự án trước, chuẩn chung sau.** Đọc 2–3 route đang có (tiền tố, định dạng lỗi, middleware xác thực,
   cách validate, cách phân trang) và viết GIỐNG thế. Một API có hai kiểu trả lỗi còn tệ hơn một kiểu chưa đẹp.
2. **Không tin gì từ client.** Validate ở biên (body, query, params, header), kiểm quyền ở server, không dùng `userId` từ body
   khi đã có người dùng đăng nhập — lấy từ token/phiên.
3. **Mã trạng thái nói sự thật.** Lỗi thì KHÔNG trả 200. Frontend, retry, cache, monitoring đều dựa vào mã trạng thái.
4. **Không lộ nội tạng.** Stack trace, câu SQL, lỗi ORM, đường dẫn file chỉ vào LOG server; client nhận thông báo gọn + mã lỗi.
5. **Kiểm bằng `curl` thật** (mục 10) cho cả đường đúng, đầu vào sai, chưa đăng nhập, và truy cập tài nguyên của người khác.

## 1. Đặt đường dẫn (tài nguyên = danh từ số nhiều)

| Việc | Phương thức + đường dẫn | Thành công |
|---|---|---|
| Danh sách | `GET /api/v1/orders?status=paid&page=2` | 200 |
| Chi tiết | `GET /api/v1/orders/123` | 200 |
| Tạo | `POST /api/v1/orders` | **201** + header `Location` + bản ghi vừa tạo |
| Thay toàn bộ | `PUT /api/v1/orders/123` | 200 (hoặc 204) |
| Sửa một phần | `PATCH /api/v1/orders/123` | 200 |
| Xoá | `DELETE /api/v1/orders/123` | **204** không body |
| Tài nguyên con | `GET /api/v1/orders/123/items` | 200 |
| Hành động không phải CRUD | `POST /api/v1/orders/123/cancel` | 200 |

- Không có động từ trong đường dẫn cho CRUD (`/getOrders`, `/createUser`, `/deleteOrder?id=` là sai).
- Chữ thường, gạch nối (`/order-items`); JSON dùng `camelCase` (hoặc `snake_case` — theo dự án, nhưng MỘT kiểu).
- `GET` không bao giờ đổi dữ liệu (trình duyệt, crawler, cache đều tự gọi GET).
- Phiên bản ở tiền tố `/api/v1`. Thay đổi phá vỡ tương thích (đổi tên trường, đổi kiểu) ⇒ `/api/v2`; thêm trường mới thì không cần.

## 2. Mã trạng thái

| Mã | Khi nào |
|---|---|
| 200 OK | Đọc/sửa thành công |
| 201 Created | Tạo mới thành công |
| 204 No Content | Xoá thành công, không có gì để trả |
| 400 Bad Request | Yêu cầu hỏng: JSON sai cú pháp, thiếu tham số bắt buộc, sai kiểu |
| 401 Unauthorized | CHƯA đăng nhập / token hết hạn hoặc sai |
| 403 Forbidden | Đã đăng nhập nhưng KHÔNG có quyền |
| 404 Not Found | Không có — **và** khi tài nguyên tồn tại nhưng thuộc người khác (đừng xác nhận nó tồn tại) |
| 409 Conflict | Trùng (email đã đăng ký), xung đột phiên bản, trạng thái không cho phép (huỷ đơn đã giao) |
| 422 Unprocessable Entity | Đúng cú pháp nhưng sai nghiệp vụ/validate (nhiều dự án dùng 400 cho cả hai — theo dự án) |
| 429 Too Many Requests | Vượt giới hạn tần suất, kèm header `Retry-After` |
| 500 Internal Server Error | Lỗi của server — không bao giờ cố ý trả cho lỗi của client |

## 3. Định dạng lỗi thống nhất

Một hình dạng cho MỌI lỗi (theo dự án nếu đã có):
```json
{ "success": false, "message": "Email đã được sử dụng", "code": "EMAIL_TAKEN",
  "errors": [{ "field": "email", "message": "Email đã được sử dụng" }] }
```
`code` ổn định cho frontend rẽ nhánh; `message` cho người đọc; `errors` cho lỗi theo từng trường của form.

**Express — một bộ xử lý lỗi tập trung, đặt SAU mọi route:**
```ts
export class AppError extends Error {
  constructor(public status: number, public code: string, message: string, public errors?: unknown) { super(message); }
}
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(422).json({ success: false, code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ',
      errors: err.issues.map(i => ({ field: i.path.join('.'), message: i.message })) });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, code: err.code, message: err.message, errors: err.errors });
  }
  console.error(err);                                   // chi tiết CHỈ vào log
  res.status(500).json({ success: false, code: 'INTERNAL', message: 'Lỗi máy chủ' });
});
```
Express 4 KHÔNG tự bắt lỗi của hàm `async` ⇒ bọc handler (`const ah = fn => (req,res,next) => fn(req,res,next).catch(next)`)
hoặc dùng Express 5. Spring: `@RestControllerAdvice` + `@ExceptionHandler`. FastAPI: `@app.exception_handler(...)`.
ASP.NET: `app.UseExceptionHandler()` + `ProblemDetails`. Lỗi ORM đã biết đổi thành lỗi nghiệp vụ, ví dụ Prisma `P2002`
(trùng unique) ⇒ 409, `P2025` (không tìm thấy) ⇒ 404.

## 4. Validate ở biên — mỗi ngăn xếp một công cụ

**Node + zod:**
```ts
const TaoDonHang = z.object({
  items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })).min(1),
  note: z.string().trim().max(500).optional(),
});
router.post('/orders', requireAuth, ah(async (req, res) => {
  const body = TaoDonHang.parse(req.body);              // ném ZodError ⇒ 422 ở bộ xử lý lỗi
  const order = await orderService.create(req.user.id, body);
  res.status(201).location(`/api/v1/orders/${order.id}`).json({ success: true, data: order });
}));
```
**Spring Boot** (`spring-boot-starter-validation`):
```java
public record TaoDonHang(@NotEmpty List<@Valid Dong> items, @Size(max = 500) String note) {}
@PostMapping("/orders")
public ResponseEntity<OrderDto> tao(@Valid @RequestBody TaoDonHang body, @AuthenticationPrincipal UserPrincipal me) { ... }
```
**FastAPI** (Pydantic v2):
```python
class Dong(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=99)
class TaoDonHang(BaseModel):
    items: list[Dong] = Field(min_length=1)
    note: str | None = Field(default=None, max_length=500)
@app.post("/api/v1/orders", status_code=201)
def tao(body: TaoDonHang, me: User = Depends(current_user)): ...
```
NestJS: `class-validator` + `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))`.
ASP.NET: DataAnnotations hoặc FluentValidation. Joi cũng được nếu dự án đang dùng.
Luôn **whitelist** trường: đừng `prisma.user.update({ data: req.body })` — client gửi thêm `role: "ADMIN"` là thành admin (mass assignment).

## 5. Danh sách: phân trang, lọc, sắp xếp

- **Offset** `?page=2&limit=20` — dễ, có "trang 5/12"; chậm với bảng rất lớn, lệch khi có bản ghi mới chèn vào. Hợp bảng quản trị.
- **Cursor** `?limit=20&cursor=<id cuối>` — nhanh, ổn định; hợp feed/cuộn vô hạn. Sắp theo cột duy nhất (hoặc `createdAt` + `id`).
```json
{ "success": true, "data": [ ... ], "meta": { "page": 2, "limit": 20, "total": 237 } }
{ "success": true, "data": [ ... ], "meta": { "nextCursor": "c_0192", "hasMore": true } }
```
- **Luôn có trần** `limit` (vd tối đa 100) — `?limit=1000000` không được làm sập DB.
- Lọc: `?status=paid&from=2026-01-01`; tìm kiếm `?q=`; sắp xếp `?sort=-createdAt,name` (dấu `-` = giảm dần).
- Cột cho phép sort/filter lấy từ **danh sách trắng** — không đưa thẳng tên cột từ query vào SQL (SQL injection qua ORDER BY).

## 6. Xác thực, phân quyền, chống IDOR

Ba tầng, thiếu tầng nào là thủng:
1. **Xác thực** (bạn là ai) — middleware kiểm JWT/phiên ⇒ không có/sai ⇒ 401.
2. **Phân quyền theo vai trò** (được làm loại việc này không) — `requireRole('ADMIN')` ⇒ 403.
3. **Quyền sở hữu** (bản ghi CỤ THỂ này có phải của bạn) — kiểm TRONG truy vấn:
```ts
const order = await prisma.order.findFirst({ where: { id, userId: req.user.id } });
if (!order) throw new AppError(404, 'NOT_FOUND', 'Không tìm thấy đơn hàng');
```
Quên tầng 3 = IDOR: đổi `/orders/123` thành `/orders/124` là đọc được đơn của người khác. Áp dụng cho CẢ đọc, sửa, xoá, tải file.
Token: header `Authorization: Bearer <jwt>` hoặc cookie `HttpOnly; Secure; SameSite=Lax` (web). Mật khẩu băm bằng bcrypt/argon2.

## 7. Idempotency, rate limit, CORS

- `PUT`/`DELETE` vốn idempotent (gọi 2 lần = 1 lần). `POST` tạo thanh toán/đơn hàng thì KHÔNG ⇒ nhận header
  `Idempotency-Key: <uuid do client sinh>`, lưu kết quả theo key (bảng riêng hoặc Redis, có hạn) — gặp lại key thì trả lại
  kết quả cũ thay vì tạo lần hai. Bấm "Thanh toán" hai lần hoặc mạng retry sẽ không trừ tiền hai lần.
- Rate limit cho đăng nhập, đăng ký, quên mật khẩu, gửi OTP, endpoint tốn tiền (AI, SMS). Express: `express-rate-limit`;
  Spring: Bucket4j; FastAPI: `slowapi`; ASP.NET 7+: `AddRateLimiter`. Sau nginx/Cloudflare ⇒ đặt đúng "trust proxy" để lấy IP thật,
  nếu không mọi người dùng chung MỘT IP và bị chặn cùng lúc.
- CORS: liệt kê đúng origin frontend. `origin: '*'` KHÔNG dùng được cùng `credentials: true` (trình duyệt từ chối).
  ```ts
  app.use(cors({ origin: ['http://localhost:5173', 'https://app.ten-mien.com'], credentials: true }));
  ```
  CORS chỉ là luật của TRÌNH DUYỆT — không phải lớp bảo mật; `curl` bỏ qua nó hoàn toàn.

## 8. Upload file, thời gian thực

- Upload: `multipart/form-data`, giới hạn kích thước (multer `limits: { fileSize: 5 * 1024 * 1024 }`; Spring
  `spring.servlet.multipart.max-file-size`), kiểm loại bằng nội dung chứ không chỉ đuôi file, đặt tên file mới (uuid) — không dùng
  tên người dùng gửi làm đường dẫn. File lớn ⇒ presigned URL cho client tải thẳng lên S3/R2, backend chỉ ký và ghi nhận.
- **SSE** (server đẩy một chiều: thông báo, stream chữ AI, tiến độ): `Content-Type: text/event-stream`, qua HTTP thường, tự nối lại.
- **WebSocket** (hai chiều, độ trễ thấp: chat, game, cộng tác): Socket.IO / `ws` / Spring WebSocket / FastAPI `WebSocket`.
  Xác thực lúc bắt tay (token), kiểm quyền cho TỪNG phòng/sự kiện. Chỉ cần polling 30 giây/lần ⇒ đừng dựng WebSocket.

## 9. Kiến trúc tầng & tài liệu OpenAPI

`route` (đường dẫn + middleware) → `controller` (đọc request, validate, gọi service, định dạng response) → `service`
(nghiệp vụ, transaction, kiểm quyền sở hữu) → `repository`/ORM (truy vấn). Controller không chứa SQL; service không biết `req`/`res`
— nhờ vậy service test được và dùng lại được từ job, CLI, WebSocket.

Tài liệu sinh từ mã (không viết tay rồi để lệch):
- **FastAPI:** có sẵn `/docs` và `/openapi.json`.
- **Spring:** thêm `org.springdoc:springdoc-openapi-starter-webmvc-ui` ⇒ `/swagger-ui/index.html`, `/v3/api-docs`.
- **NestJS:** `@nestjs/swagger` — `SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))`.
- **ASP.NET:** Swashbuckle (`AddSwaggerGen` + `UseSwagger` + `UseSwaggerUI`); .NET 9 có sẵn `AddOpenApi()` + `MapOpenApi()`.
- **Express:** `swagger-ui-express` + đặc tả sinh từ schema zod (`@asteasolutions/zod-to-openapi`) hoặc chú thích (`swagger-jsdoc`).
Tắt/bảo vệ trang tài liệu ở production nếu API không công khai.

## 10. Kiểm bằng `curl` thật — bắt buộc trước khi báo xong

```bash
B=http://localhost:3000/api/v1
# in body rồi mã trạng thái ở dòng cuối
curl -sS -w '\nHTTP %{http_code}\n' "$B/orders"                                    # chưa đăng nhập ⇒ mong 401
TOKEN=$(curl -sS -X POST "$B/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"a@test.dev","password":"Matkhau123!"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).data.token')
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$B/orders" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"items":[{"productId":1,"quantity":2}]}'  # mong 201
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$B/orders" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"items":[]}'                              # mong 422 + errors[]
curl -sS -w '\nHTTP %{http_code}\n' -X POST "$B/orders" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{hỏng'                                     # mong 400, KHÔNG 500
curl -sS -w '\nHTTP %{http_code}\n' "$B/orders/<id-của-người-khác>" -H "Authorization: Bearer $TOKEN"   # mong 404
curl -sS -o /dev/null -w '%{http_code}\n' "$B/orders?limit=100000" -H "Authorization: Bearer $TOKEN"    # phải bị chặn trần
```
(Có `jq` thì thay `node -pe ...` bằng `jq -r .data.token`.) Thấy 500 ở bất kỳ ca đầu vào sai nào ⇒ đó là lỗi, sửa trước khi báo.
Viết thành test tự động nếu dự án có (supertest, `MockMvc`/`@WebMvcTest`, FastAPI `TestClient`, `WebApplicationFactory`).

## 11. Bẫy đã gặp thật

- **200 kèm `{ success: false }`** — frontend `try/catch` theo mã HTTP coi là thành công, retry/monitoring mù.
- **Lộ stack trace / lỗi Prisma/Hibernate ra client** — lộ tên bảng, cột, đường dẫn, phiên bản thư viện. Chế độ dev của
  Spring (`server.error.include-stacktrace`), Django `DEBUG=True`, ASP.NET `UseDeveloperExceptionPage` không được bật ở production.
- **N+1 trong endpoint danh sách** — 20 đơn hàng = 1 truy vấn + 20 truy vấn lấy khách hàng. Nhận ra bằng log SQL.
  Sửa: Prisma `include`/`select`; JPA `JOIN FETCH` hoặc `@EntityGraph`; SQLAlchemy `selectinload`; EF Core `.Include()`.
- **IDOR** — kiểm quyền ở danh sách nhưng quên ở chi tiết/sửa/xoá/tải file. Mọi endpoint có `:id` phải qua tầng 3.
- **Trả nguyên entity** — lộ `passwordHash`, `resetToken`, trường nội bộ. Luôn map sang DTO / `select` đúng trường.
- **Prisma `where: { userId: undefined }`** = KHÔNG lọc gì ⇒ trả dữ liệu của MỌI người. Kiểm giá trị trước khi đưa vào `where`.
- **`JSON.parse` body hỏng ném 500** thay vì 400 — bộ xử lý lỗi phải nhận ra lỗi cú pháp JSON.
- **Múi giờ** — lưu UTC, trả ISO 8601 (`2026-09-26T03:00:00Z`), để frontend đổi sang giờ Việt Nam.
- **Tiền bằng số thực** — dùng số nguyên (đồng) hoặc `DECIMAL`, không `float`.

## 12. Việc KHÔNG tự làm khi chưa được đồng ý

Đổi hình dạng response / tên trường / mã trạng thái của endpoint ĐANG được frontend hoặc app khác dùng (phá client đang chạy),
xoá endpoint, đổi cơ chế xác thực, nới CORS thành `*`, tắt rate limit, chạy migration phá dữ liệu, gọi API ghi dữ liệu trên production.

## 13. Báo cáo cuối

Danh sách endpoint đã thêm/sửa (phương thức + đường dẫn + mã trạng thái), các ca đã kiểm bằng `curl`/test và kết quả thật,
chỗ tài liệu OpenAPI, những gì frontend cần cập nhật, và rủi ro còn lại (chưa có rate limit, chưa có test tự động…).
