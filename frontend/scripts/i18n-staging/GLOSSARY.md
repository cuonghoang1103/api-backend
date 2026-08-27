# Glossary dịch song ngữ Anh–Việt — bộ 25 sách kỹ thuật /books

Áp dụng NHẤT QUÁN cho cả 25 cuốn (React, Java, JavaScript, TypeScript, Next.js,
PostgreSQL, Node.js/Express, Docker, Git, Tailwind CSS, Prisma, Redis,
Socket.IO, Authentication, Nginx, VPS deploy, Linux/Bash, GitHub Actions,
Object Storage, DNS/TLS, Media Processing, Observability, Payment
Integration, Terminal, Networking).

## Nguyên tắc chung

- Dịch phần **văn xuôi diễn giải** (câu văn giải thích khái niệm, lý do, bối
  cảnh) sang tiếng Việt tự nhiên, dễ hiểu, đúng văn phong kỹ thuật — không
  dịch máy móc từng chữ.
- **GIỮ NGUYÊN tiếng Anh, không dịch:**
  - Mọi khối code/terminal/listing/bảng lệnh (nhưng các khối này vốn đã bị
    loại khỏi phạm vi dịch — không xuất hiện trong dữ liệu bạn nhận).
  - Tên lệnh, flag, path, tên biến/hàm/class, tên file, output chương trình
    xuất hiện **inline** trong câu văn (thường nằm trong thẻ `<code>`).
  - Tên công nghệ/sản phẩm/công ty riêng: Docker, PostgreSQL, React, Next.js,
    TypeScript, JavaScript, Node.js, Express, Git, GitHub, GitLab, Tailwind
    CSS, Prisma, Redis, Socket.IO, Nginx, Linux, Bash, Kubernetes, AWS, GCP,
    Cloudflare, Let's Encrypt, systemd, Docker Compose, Vite, Webpack, ESLint,
    Prettier, npm, pnpm, Yarn, JSON, YAML, HTML, CSS, SQL, REST, GraphQL,
    JWT, OAuth, TLS/SSL, DNS, TCP/IP, HTTP/HTTPS, gRPC, WebSocket, CDN, VPS,
    S3/R2, Java, Spring, Maven, Gradle, JVM, JDK.
  - **Thuật ngữ kỹ thuật quy ước đã trở thành từ vựng chung của giới lập
    trình** — giữ nguyên tiếng Anh, KHÔNG dịch, kể cả khi đứng một mình
    trong câu văn:
    `commit`, `container`, `pull request`, `branch`, `merge`, `rebase`,
    `deploy`/`deployment`, `cache`/`caching`, `endpoint`, `middleware`,
    `handler`, `callback`, `promise`, `async/await`, `hook`, `component`,
    `props`, `state`, `render`, `bundle`/`bundler`, `build`, `runtime`,
    `compile`, `query`, `schema`, `migration`, `index` (database), `key`
    (database/cache), `token`, `payload`, `header`, `request`/`response`,
    `route`/`routing`, `socket`, `thread`, `process`, `daemon`, `log`/`logging`,
    `stack trace`, `debug`, `test`/`testing`, `mock`, `stub`, `pipeline`,
    `workflow`, `job`, `worker`, `queue`, `webhook`, `proxy`, `load balancer`,
    `firewall`, `certificate`, `upstream`/`downstream`, `staging`,
    `production`, `environment`/`env`, `config`/`configuration`, `flag`,
    `parser`/`parsing`, `serialize`/`deserialize`, `garbage collection`,
    `race condition`, `deadlock`, `latency`, `throughput`, `bandwidth`.
- Với các thuật ngữ **có bản dịch tiếng Việt phổ biến, dễ hiểu hơn giữ
  nguyên** — dịch cố định (xem bảng dưới), không tự tiện chọn từ khác giữa
  các cuốn.
- KHÔNG bịa thêm ý không có trong bản gốc. KHÔNG lược bớt câu. Giữ đúng số
  lượng câu / cấu trúc lập luận (nếu bản gốc có "Trước tiên... Sau đó...",
  bản dịch phải giữ trình tự đó).
- Câu điều kiện/cảnh báo kỹ thuật ("this only works if…", "note that…") dịch
  sát nghĩa, không thêm sắc thái chủ quan.
- Giữ nguyên format số liệu, đơn vị (MB, GB, ms, req/s...), tên phiên bản
  (v18, 3.0.x...).
- Thẻ HTML lồng bên trong đoạn văn (`<code>`, `<a>`, `<b>`, `<strong>`,
  `<em>`, `<span>`...) PHẢI được giữ nguyên y hệt (tên thẻ + thuộc tính, ví
  dụ `href`) ở đúng vị trí ngữ nghĩa tương ứng trong câu dịch — chỉ dịch
  phần chữ hiển thị bên trong nếu đó là văn xuôi, KHÔNG dịch nếu bên trong
  `<code>` là lệnh/tên kỹ thuật.

## Bảng thuật ngữ dịch cố định

| Tiếng Anh | Tiếng Việt |
|---|---|
| server | server (giữ nguyên) |
| client | client (giữ nguyên) |
| database | cơ sở dữ liệu |
| table (database) | bảng |
| row | dòng (bản ghi) |
| column | cột |
| file | file (giữ nguyên) |
| folder / directory | thư mục |
| variable | biến |
| function | hàm |
| method | phương thức |
| class | class (giữ nguyên) |
| object | đối tượng |
| array | mảng |
| string | chuỗi |
| boolean | boolean (giữ nguyên) |
| type (TypeScript) | kiểu (type) |
| interface | interface (giữ nguyên) |
| package / library | thư viện |
| module | module (giữ nguyên) |
| dependency | dependency (giữ nguyên) |
| framework | framework (giữ nguyên) |
| application / app | ứng dụng |
| user | người dùng |
| session | phiên (session) |
| cookie | cookie (giữ nguyên) |
| authentication | xác thực |
| authorization | phân quyền |
| permission | quyền |
| password | mật khẩu |
| encryption | mã hoá |
| hash (mật mã) | băm (hash) |
| network | mạng |
| port | cổng (port) |
| socket | socket (giữ nguyên) |
| protocol | giao thức |
| bandwidth | băng thông |
| latency | độ trễ (latency) |
| throughput | thông lượng |
| load balancer | load balancer (giữ nguyên) |
| scaling | mở rộng quy mô (scale) |
| performance | hiệu năng |
| optimization | tối ưu hoá |
| bug | lỗi (bug) |
| error | lỗi (error) |
| exception | ngoại lệ (exception) |
| stack trace | stack trace (giữ nguyên) |
| environment variable | biến môi trường |
| version | phiên bản |
| release | bản phát hành |
| repository / repo | kho mã (repo) |
| commit | commit (giữ nguyên) |
| branch | branch (giữ nguyên) |
| merge | merge (giữ nguyên) |
| pull request | pull request (giữ nguyên) |
| deploy / deployment | deploy (giữ nguyên) |
| pipeline | pipeline (giữ nguyên) |
| container | container (giữ nguyên) |
| image (Docker) | image (giữ nguyên) |
| volume (Docker) | volume (giữ nguyên) |
| cache | cache (giữ nguyên) |
| queue | hàng đợi (queue) |
| worker | worker (giữ nguyên) |
| job | job (giữ nguyên) |
| middleware | middleware (giữ nguyên) |
| endpoint | endpoint (giữ nguyên) |
| route / routing | route (giữ nguyên) |
| request | request (giữ nguyên) |
| response | response (giữ nguyên) |
| header (HTTP) | header (giữ nguyên) |
| payload | payload (giữ nguyên) |
| token | token (giữ nguyên) |
| schema | schema (giữ nguyên) |
| migration (database) | migration (giữ nguyên) |
| query | query (giữ nguyên) |
| index (database) | index (giữ nguyên) |
| transaction (database) | transaction (giữ nguyên) |
| component (React) | component (giữ nguyên) |
| props | props (giữ nguyên) |
| state | state (giữ nguyên) |
| hook (React) | hook (giữ nguyên) |
| render / rendering | render (giữ nguyên) |
| build | build (giữ nguyên) |
| bundle / bundler | bundle (giữ nguyên) |
| compile | biên dịch |
| runtime | runtime (giữ nguyên) |
| thread | thread (giữ nguyên) |
| process (OS) | tiến trình (process) |
| daemon | daemon (giữ nguyên) |
| certificate (TLS) | chứng chỉ (certificate) |
| firewall | firewall (giữ nguyên) |
| proxy / reverse proxy | proxy (giữ nguyên) |
| upstream / downstream | upstream / downstream (giữ nguyên) |
| staging | staging (giữ nguyên) |
| production | production (giữ nguyên) |
| config / configuration | cấu hình (config) |
| flag (CLI) | flag (giữ nguyên) |
| shell | shell (giữ nguyên) |
| terminal | terminal (giữ nguyên) |
| command | lệnh |
| log / logging | log (giữ nguyên) |
| monitoring | giám sát (monitoring) |
| alert | cảnh báo (alert) |
| metric | metric (giữ nguyên) |
| trace / tracing | trace (giữ nguyên) |
| upload | tải lên |
| download | tải xuống |
| CDN | CDN (giữ nguyên) |
| bucket (object storage) | bucket (giữ nguyên) |
| webhook | webhook (giữ nguyên) |
| race condition | race condition (giữ nguyên) |
| deadlock | deadlock (giữ nguyên) |
| garbage collection | garbage collection (giữ nguyên) |
| best practice | thực hành tốt nhất (best practice) |
| trade-off | đánh đổi (trade-off) |
| edge case | trường hợp biên (edge case) |

## Ghi chú theo cuốn

- **Java/LAB211**: giữ nguyên `class`, `interface`, `package`, `JVM`, `JDK`,
  `Maven`, `Gradle`, tên các design pattern (Singleton, Factory...).
- **TypeScript**: giữ nguyên `type`, `interface`, `generic`, `union`,
  `enum`, `narrowing`; dịch câu giải thích khái niệm sang tiếng Việt.
- **Git**: giữ nguyên toàn bộ tên lệnh/khái niệm Git (`commit`, `branch`,
  `merge`, `rebase`, `stash`, `HEAD`, `remote`, `origin`, `fast-forward`).
- **Docker**: giữ nguyên `image`, `container`, `volume`, `network`,
  `Dockerfile`, `Compose`, `layer`, `registry`.
- **Nginx/DNS/TLS/Networking**: giữ nguyên tên bản ghi DNS (`A`, `CNAME`,
  `MX`, `TXT`, `NS`), giao thức (`TCP`, `UDP`, `HTTP/2`, `HTTP/3`, `QUIC`),
  `handshake`, `certificate`; dịch phần giải thích cơ chế.
- **Authentication**: giữ nguyên `JWT`, `OAuth`, `session`, `cookie`,
  `refresh token`, `access token`, `hash` (mật khẩu), `salt`.
- **Payment Integration**: giữ nguyên tên nhà cung cấp (Stripe, PayPal...),
  `webhook`, `idempotency key`, `charge`, `refund`.
- **Terminal/Linux/Bash**: giữ nguyên tên lệnh Unix (`grep`, `sed`, `awk`,
  `chmod`, `chown`...), tên phím tắt, biến môi trường (`$PATH`, `$HOME`).
