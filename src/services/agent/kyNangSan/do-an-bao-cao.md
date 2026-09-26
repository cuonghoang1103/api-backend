---
name: do-an-bao-cao
description: Viết tài liệu đồ án/môn học/dự án — README, SRS (use case, user story), sơ đồ Mermaid (use case, sequence, class, ERD, state, kiến trúc), tài liệu API, báo cáo kiểm thử, báo cáo đồ án, dàn ý slide bảo vệ, changelog, xuất Word. Dùng khi cần viết báo cáo, tài liệu, vẽ sơ đồ, làm README.
---

# KỸ NĂNG: TÀI LIỆU ĐỒ ÁN & BÁO CÁO — viết từ mã thật, đọc được, nộp được

Mục tiêu: tài liệu mô tả ĐÚNG thứ dự án đang có, sơ đồ vẽ ra đọc hiểu được trong 10 giây, chỗ nào cần người dùng
điền thì đánh dấu rõ — và người chấm không bắt được câu nào "tài liệu nói có mà mã không có".

## 0. Luật vàng

1. **Đọc dự án TRƯỚC khi viết một chữ.** Tài liệu là bản mô tả mã, không phải bản mơ ước. Chỉ ghi tính năng tìm thấy trong mã
   (route, màn hình, bảng DB). Tính năng dự kiến ghi riêng ở mục "Hướng phát triển".
2. **Không bịa số liệu.** Số người dùng, kết quả khảo sát, thời gian phản hồi, độ phủ test, điểm hiệu năng — chỉ ghi khi đo được
   (chạy test, chạy lệnh đo) hoặc người dùng cung cấp. Còn lại để chỗ trống có đánh dấu.
3. **Đánh dấu phần người dùng phải điền** bằng một mẫu DUY NHẤT, dễ tìm: `[CẦN ĐIỀN: tên giảng viên hướng dẫn]`.
   Cuối việc liệt kê hết bằng `grep -rn "CẦN ĐIỀN" docs/`.
4. **Theo mẫu của trường/môn nếu có.** Hỏi (một lần) có file mẫu báo cáo, số chương bắt buộc, giới hạn trang, kiểu trích dẫn không —
   mẫu của giảng viên luôn thắng hướng dẫn chung dưới đây.
5. **Tiếng Việt chuẩn thuật ngữ:** giữ thuật ngữ tiếng Anh phổ biến lần đầu kèm giải nghĩa — "giao diện lập trình ứng dụng (API)",
   "kiểm thử đơn vị (unit test)" — sau đó dùng nhất quán một cách gọi. Câu ngắn, chủ động, không văn hoa.
6. **Xuất Markdown** vào `docs/` (hoặc nơi người dùng chỉ định); cần Word thì chuyển bằng pandoc (mục 8).

## 1. Khảo sát dự án để lấy dữ liệu thật

```bash
git ls-files | head -300                                   # cấu trúc thật, bỏ qua file bị ignore
cat package.json 2>/dev/null; cat pom.xml 2>/dev/null | head -80; cat requirements.txt pyproject.toml 2>/dev/null
ls prisma/schema.prisma src/main/resources/application*.yml 2>/dev/null
# route/endpoint — chọn đúng ngăn xếp
grep -rnE "router\.(get|post|put|patch|delete)\(|app\.(get|post|put|patch|delete)\(" src | head -100   # Express
grep -rnE "@(Get|Post|Put|Patch|Delete|Request)Mapping" src | head -100                               # Spring
grep -rnE "@(app|router)\.(get|post|put|patch|delete)\(" --include=*.py . | head -100                  # FastAPI
grep -rnE "\[Http(Get|Post|Put|Patch|Delete)" --include=*.cs . | head -100                             # ASP.NET
# thực thể/bảng: prisma/schema.prisma, @Entity, models.py, DbContext, migrations/
git log --oneline | wc -l; git log --format='%an' | sort | uniq -c                                   # tiến độ, thành viên
```
Chạy test để có số liệu thật cho báo cáo kiểm thử (`npm test`, `mvn test`, `pytest -q`, `dotnet test`) và chụp lại đầu ra.
Ảnh chụp màn hình giao diện: bạn không tự chụp được ⇒ để `![Màn hình đăng nhập](images/dang-nhap.png) [CẦN ĐIỀN: ảnh chụp]`.

## 2. README chuẩn

```markdown
# Tên dự án
Một câu: dự án làm gì, cho ai. [Link demo nếu có]

![Ảnh giao diện chính](docs/images/trang-chu.png)

## Tính năng
- Đăng ký / đăng nhập (JWT)          ← chỉ những gì CÓ trong mã
- ...

## Công nghệ
| Tầng | Công nghệ |
|---|---|
| Frontend | React 19, Vite, Tailwind |
| Backend | Node 22, Express, Prisma |
| CSDL | PostgreSQL 16 |

## Cài đặt & chạy
Yêu cầu: Node 22, Docker (cho PostgreSQL)
    git clone <url> && cd <thu-muc>
    cp .env.example .env        # điền các biến trong bảng dưới
    docker compose up -d db
    npm ci && npx prisma migrate deploy && npm run dev

| Biến | Ý nghĩa | Ví dụ |
|---|---|---|
| DATABASE_URL | Chuỗi kết nối PostgreSQL | postgresql://postgres:postgres@localhost:5432/app |

## Cấu trúc thư mục
## Tài khoản dùng thử   (nếu có seed)
## Thành viên & phân công
## Giấy phép
```
Lệnh cài đặt phải CHẠY ĐƯỢC từ repo sạch — tốt nhất thử lại theo đúng thứ tự trong README. Biến môi trường lấy từ `.env.example`
hoặc tìm `process.env.` / `os.environ` / `@Value` trong mã; KHÔNG chép giá trị bí mật thật vào README.

## 3. SRS — đặc tả yêu cầu

Khung gợi ý (theo tinh thần IEEE 830, rút gọn cho đồ án):
1. Giới thiệu — mục đích, phạm vi, định nghĩa thuật ngữ, tài liệu tham khảo.
2. Mô tả tổng quan — bối cảnh, nhóm người dùng (actor), ràng buộc, giả định.
3. Yêu cầu chức năng — mã `FR-01`, `FR-02`… mỗi cái một câu "Hệ thống phải…", nhóm theo module.
4. Yêu cầu phi chức năng — `NFR-xx`: hiệu năng, bảo mật, khả dụng, tương thích — phải ĐO ĐƯỢC
   ("trang danh sách tải < 2 giây với 1.000 bản ghi", không phải "hệ thống nhanh").
5. Use case — sơ đồ + bảng đặc tả cho use case chính.
6. Phụ lục — ERD, giao diện mẫu.

**Bảng đặc tả use case:**
| Mục | Nội dung |
|---|---|
| Mã / Tên | UC-03 · Đặt hàng |
| Actor | Khách hàng |
| Tiền điều kiện | Đã đăng nhập, giỏ hàng có ≥ 1 sản phẩm |
| Luồng chính | 1. Khách bấm "Đặt hàng" 2. Hệ thống hiện form địa chỉ 3. … |
| Luồng thay thế | 3a. Sản phẩm hết hàng ⇒ báo lỗi, quay lại giỏ |
| Hậu điều kiện | Đơn ở trạng thái "Chờ xác nhận", giỏ hàng rỗng |

**User story + tiêu chí chấp nhận** (Given/When/Then — kiểm được, dùng lại làm ca kiểm thử):
```text
US-05: Là khách hàng, tôi muốn huỷ đơn chưa giao để không phải nhận hàng không cần nữa.
Tiêu chí chấp nhận:
- Given đơn ở trạng thái "Chờ xác nhận", When tôi bấm "Huỷ đơn", Then đơn chuyển sang "Đã huỷ" và tồn kho được cộng lại.
- Given đơn đã "Đang giao", When tôi mở chi tiết đơn, Then không có nút "Huỷ đơn".
```

## 4. Sơ đồ bằng Mermaid

**Nguyên tắc để sơ đồ ĐỌC được:** ≤ 10–12 nút mỗi sơ đồ; nhãn ≤ 5 chữ; một sơ đồ trả lời MỘT câu hỏi; lớn hơn thì tách
(một sơ đồ tổng quan + mỗi module một sơ đồ con). Luồng dài ⇒ `flowchart TD` (dọc) thay vì `LR` để khỏi bị bóp nhỏ.
**Nhãn có dấu cách, dấu ngoặc, dấu hai chấm, dấu `/`, `#`, `;` ⇒ bọc trong ngoặc kép:** `A["Đăng nhập (JWT)"]`.

**Use case** — Mermaid không có loại use case riêng; dùng flowchart:
```mermaid
flowchart LR
  KH(["👤 Khách hàng"])
  AD(["👤 Quản trị viên"])
  subgraph HT["Hệ thống bán sách"]
    UC1(["Đăng nhập"])
    UC2(["Đặt hàng"])
    UC3(["Quản lý sản phẩm"])
  end
  KH --> UC1
  KH --> UC2
  AD --> UC1
  AD --> UC3
```
**Sequence** — một luồng cụ thể, qua các tầng thật của dự án:
```mermaid
sequenceDiagram
  autonumber
  actor U as Người dùng
  participant FE as Frontend
  participant API as Backend API
  participant DB as PostgreSQL
  U->>FE: Nhập email, mật khẩu
  FE->>API: POST /api/v1/auth/login
  API->>DB: Tìm user theo email
  DB-->>API: Bản ghi user
  alt Mật khẩu đúng
    API-->>FE: 200 + token
  else Sai mật khẩu
    API-->>FE: 401
  end
```
**ERD** — lấy từ schema/migration THẬT, chỉ những cột quan trọng:
```mermaid
erDiagram
  USER ||--o{ ORDER : "đặt"
  ORDER ||--|{ ORDER_ITEM : "gồm"
  PRODUCT ||--o{ ORDER_ITEM : "nằm trong"
  USER {
    int id PK
    string email UK
    string role
  }
  ORDER {
    int id PK
    int user_id FK
    string status
    datetime created_at
  }
```
Ký hiệu quan hệ: `||` đúng một · `o|` không hoặc một · `}o` không hoặc nhiều · `}|` một hoặc nhiều.
**Class:**
```mermaid
classDiagram
  class OrderService {
    +createOrder(userId, items) Order
    +cancel(orderId) void
  }
  class Order {
    +int id
    +String status
  }
  OrderService ..> Order : tạo
  Order "1" --> "*" OrderItem : gồm
```
**State** (vòng đời đơn hàng, bài nộp, tài khoản…):
```mermaid
stateDiagram-v2
  [*] --> ChoXacNhan
  ChoXacNhan --> DangGiao : Admin xác nhận
  ChoXacNhan --> DaHuy : Khách huỷ
  DangGiao --> DaGiao : Giao thành công
  DaGiao --> [*]
  DaHuy --> [*]
```
State dùng id không dấu, không cách; cần nhãn tiếng Việt đẹp thì khai `state "Chờ xác nhận" as ChoXacNhan`.
**Kiến trúc** — `flowchart LR` với `subgraph` cho từng tầng (Client · Backend · Dữ liệu · Dịch vụ ngoài), mũi tên ghi giao thức (`HTTPS`, `SQL`).

**Kiểm sơ đồ vẽ được** (không chỉ "nhìn thấy đúng cú pháp"): dán vào https://mermaid.live, hoặc nếu máy có Node:
```bash
npx -y -p @mermaid-js/mermaid-cli mmdc -i docs/so-do/erd.mmd -o docs/so-do/erd.svg
```
(`mmdc` tải trình duyệt headless lần đầu — chậm; lỗi cú pháp sẽ in số dòng.) Cần ảnh cho Word ⇒ xuất `.png` bằng `-o erd.png`.

## 5. Tài liệu API, báo cáo kiểm thử, changelog

**Tài liệu API** — ưu tiên đặc tả OpenAPI sinh từ mã (Swagger — xem kỹ năng `thiet-ke-api`); viết tay thì mỗi endpoint một khối:
phương thức + đường dẫn, quyền cần có, tham số, body mẫu, response mẫu, các mã lỗi. Lấy ví dụ bằng cách GỌI THẬT (`curl`), không tự nghĩ.

**Báo cáo kiểm thử:**
| Mã | Chức năng | Các bước | Dữ liệu | Kết quả mong đợi | Kết quả thực tế | Đạt |
|---|---|---|---|---|---|---|
| TC-01 | Đăng nhập | Nhập email + mật khẩu đúng, bấm Đăng nhập | a@test.dev / Matkhau123! | Vào trang chủ | [CẦN ĐIỀN] | [CẦN ĐIỀN] |

Ca kiểm thử sinh từ tiêu chí chấp nhận (mục 3) + ca biên (rỗng, quá dài, trùng, không có quyền). Cột "thực tế" chỉ điền khi
đã chạy; kết quả test tự động thì dán số thật (`Tests: 42 passed, 1 failed`), kể cả ca trượt.

**Changelog** (`CHANGELOG.md`, kiểu Keep a Changelog, sinh từ `git log` nếu commit theo Conventional Commits):
```markdown
## [1.1.0] - 2026-09-26
### Thêm
- Huỷ đơn hàng khi chưa giao (#23)
### Sửa
- Giỏ hàng không còn nhận số lượng âm
```

## 6. Báo cáo đồ án

Khung thường gặp (điều chỉnh theo mẫu của trường):
1. Trang bìa · Lời cảm ơn · Lời cam đoan `[CẦN ĐIỀN]` · Mục lục · Danh mục hình/bảng · Bảng thuật ngữ viết tắt
2. **Chương 1 — Tổng quan:** lý do chọn đề tài, mục tiêu, phạm vi, đối tượng, phương pháp, bố cục báo cáo.
3. **Chương 2 — Cơ sở lý thuyết & công nghệ:** chỉ những công nghệ DỰ ÁN DÙNG, vì sao chọn (so sánh ngắn với lựa chọn khác).
4. **Chương 3 — Phân tích & thiết kế:** yêu cầu (tóm SRS), use case, sequence cho luồng chính, ERD, kiến trúc, thiết kế giao diện.
5. **Chương 4 — Cài đặt & kiểm thử:** môi trường, cấu trúc mã, các màn hình chính (ảnh), kết quả kiểm thử, triển khai.
6. **Chương 5 — Kết luận:** đã làm được gì (khớp mục tiêu chương 1), hạn chế THẬT, hướng phát triển.
7. Tài liệu tham khảo · Phụ lục.

Mỗi hình/bảng có số và chú thích ("Hình 3.2. Sơ đồ tuần tự chức năng đăng nhập") và được nhắc tới trong văn bản.
Trích dẫn kiểu IEEE (`[1]` trong bài, danh sách cuối): `[1] Tác giả, "Tên bài," Nơi đăng, năm. [Online]. Available: URL`.
Chỉ trích nguồn có thật mà bạn chắc chắn tồn tại (tài liệu chính thức của React, PostgreSQL, Spring…); không chắc ⇒ `[CẦN ĐIỀN: nguồn]`.

## 7. Slide bảo vệ — dàn ý

10–15 phút ≈ 12–16 slide, mỗi slide MỘT ý, chữ ít, hình nhiều:
1. Tên đề tài, thành viên, GVHD · 2. Vấn đề & lý do · 3. Mục tiêu & phạm vi · 4. Người dùng & chức năng chính (use case)
5. Kiến trúc hệ thống · 6. Công nghệ · 7. CSDL (ERD rút gọn) · 8–10. Demo/ảnh màn hình luồng chính
11. Kiểm thử & kết quả (số thật) · 12. Hạn chế & hướng phát triển · 13. Cảm ơn / hỏi đáp.
Kèm ghi chú thuyết trình từng slide và 5–10 câu hội đồng hay hỏi (vì sao chọn công nghệ X, bảo mật mật khẩu thế nào,
xử lý hai người cùng đặt món cuối cùng ra sao…) với câu trả lời dựa trên mã thật.

## 8. Chuyển sang Word/PDF

```bash
command -v pandoc && pandoc --version | head -1
pandoc docs/bao-cao.md -o docs/bao-cao.docx --toc --number-sections --resource-path=docs
pandoc docs/bao-cao.md -o docs/bao-cao.docx --toc --reference-doc=mau-truong.docx    # dùng font/lề/heading từ file mẫu
```
Pandoc KHÔNG vẽ khối ```` ```mermaid ````: xuất sơ đồ ra `.png` trước (mục 4) rồi chèn `![Hình 3.1. ERD](so-do/erd.png)`.
Máy không có pandoc ⇒ nói người dùng cài (`brew install pandoc` / `winget install JohnMacFarlane.Pandoc`) hoặc mở file `.md`
bằng Typora/VS Code rồi xuất — đừng tự cài phần mềm hệ thống khi chưa hỏi.

## 9. Bẫy đã gặp thật

- **Sơ đồ vẽ được nhưng không đọc được** — 40 nút, chữ bé bằng hạt gạo khi chèn vào Word. Mermaid "render xanh" không có nghĩa
  người đọc hiểu. Tách nhỏ, mỗi sơ đồ ≤ 12 nút, rồi xem ảnh xuất ra ở kích thước trang A4.
- **Ký tự đặc biệt làm vỡ cú pháp** — `(`, `)`, `:`, `/`, `"`, `#`, `;`, `{}` trong nhãn không bọc ngoặc kép; chữ `end` viết thường làm
  tên nút trong flowchart (đổi thành `End`/`ketThuc`); nút tên bắt đầu bằng `o` hoặc `x` đặt ngay sau `---`/`-->` có thể bị hiểu thành
  kiểu mũi tên — thêm dấu cách hoặc đổi tên. Dấu ngoặc kép TRONG nhãn dùng `#quot;`.
- **Mô tả không khớp mã** — viết "hỗ trợ thanh toán VNPay" trong khi mã chỉ có nút giả; hội đồng hỏi là lộ ngay. Mỗi tính năng trong
  tài liệu phải trỏ được tới route/màn hình thật.
- **ERD vẽ từ trí nhớ** lệch schema: thiếu bảng trung gian, sai khoá ngoại. Luôn lấy từ `schema.prisma`/`@Entity`/migration.
- **README có lệnh cài không chạy** vì thiếu bước migrate/seed hoặc sai phiên bản runtime. Thử theo README từ đầu.
- **Chép giá trị thật của `.env` vào tài liệu** — lộ mật khẩu DB, API key trong file nộp cho trường hoặc đẩy lên GitHub.
- **Số liệu "đẹp" không nguồn** ("tăng 80% hiệu suất") — giảng viên hỏi đo thế nào là hết đường trả lời.

## 10. Việc KHÔNG tự làm khi chưa được đồng ý

Ghi đè README/báo cáo người dùng đã viết (đề xuất bản sửa hoặc viết file mới bên cạnh), điền tên thật/mã sinh viên/tên giảng viên
khi chưa được cung cấp, bịa trích dẫn hay kết quả khảo sát, commit/push tài liệu, cài phần mềm hệ thống (pandoc, LaTeX).

## 11. Báo cáo cuối

Danh sách file đã tạo/sửa (đường dẫn), mỗi file gồm những mục gì, sơ đồ nào đã kiểm vẽ được (bằng gì), danh sách chỗ
`[CẦN ĐIỀN]` người dùng phải bổ sung (kết quả `grep`), và những điểm tài liệu có thể bị hỏi vặn (tính năng chưa hoàn thiện, số liệu chưa đo).
