Câu hỏi "có bao nhiêu loại cơ sở dữ liệu" hầu như luôn nhận được cùng một câu trả lời: hai, SQL và NoSQL. Câu trả lời đó phổ biến đến mức gần như không ai hỏi lại, và nó là chỗ khởi đầu của phần lớn những quyết định chọn sai cơ sở dữ liệu mà tôi từng thấy.

Vấn đề nằm ở chỗ hai vế của phép chia đó không cùng loại. **SQL là một ngôn ngữ truy vấn.** **NoSQL không phải là gì cả** — nó là một cái nhãn phủ định, nghĩa đen là "không phải SQL", ra đời năm 2009 từ tên một buổi meetup ở San Francisco. Chia cơ sở dữ liệu thành SQL và NoSQL cũng giống chia phương tiện giao thông thành "xe máy" và "không phải xe máy": vế sau gộp chung xe đạp, máy bay và tàu ngầm vào một rọ, rồi ta nói về cái rọ đó như thể nó có tính chất chung.

Vài ví dụ cho thấy phép chia này gãy ngay khi chạm vào thực tế:

- **Cassandra** — một cơ sở dữ liệu NoSQL điển hình — có ngôn ngữ truy vấn tên là CQL, cú pháp gần như SQL: `SELECT * FROM users WHERE id = ?`.
- **PostgreSQL** — cơ sở dữ liệu quan hệ kinh điển — lưu và đánh chỉ mục JSON tốt hơn khá nhiều sản phẩm tự nhận là "document database".
- **Google Spanner** và **CockroachDB** có giao dịch ACID phân tán, nói SQL, mà lại chạy trên kiến trúc phân tán vốn được coi là đặc sản của NoSQL.

Vậy chia thế nào cho đúng? Có ba trục, và cả ba đều cần thiết vì chúng trả lời ba câu hỏi khác nhau:

1. **Mô hình dữ liệu** — dữ liệu của bạn *trông* như thế nào? (quan hệ, tài liệu, khoá–giá trị, đồ thị, vector…)
2. **Tải công việc** — bạn *làm gì* với nó? (ghi/đọc lắt nhắt nhiều lần, hay quét tổng hợp hàng triệu dòng?)
3. **Cách triển khai** — nó *chạy ở đâu*? (nhúng trong tiến trình, một máy chủ, một cụm phân tán, hay dịch vụ quản lý?)

Bài này đi qua cả ba trục, rồi tới phần quan trọng hơn: những khái niệm bạn buộc phải hiểu để so sánh (ACID, mức cô lập, CAP, B-tree so với LSM-tree), một cây quyết định thực dụng, mười sai lầm tôi thấy nhiều nhất, và cuối cùng là hồ sơ thật của chính trang web bạn đang đọc — 248 bảng dữ liệu, chạy trên một VPS 6GB.

Một lưu ý trước khi bắt đầu: **kết luận thực dụng của bài này là "hãy bắt đầu bằng PostgreSQL"**, và tôi nói điều đó ngay từ đầu để bạn đọc phần sau với đúng tinh thần hoài nghi. Phần lớn dự án không chọn sai vì thiếu lựa chọn, mà vì chọn quá sớm một thứ chuyên biệt cho một vấn đề chưa xảy ra.

---

# Phần 1 — Chia theo mô hình dữ liệu

Đây là trục quan trọng nhất, vì mô hình dữ liệu quyết định những câu hỏi nào *rẻ* và những câu hỏi nào *đắt*. Đổi mô hình sau khi đã có dữ liệu thật là việc tốn kém nhất trong đời một hệ thống.

## 1.1. Cơ sở dữ liệu quan hệ (Relational)

**Dữ liệu trông thế nào:** những bảng có cột cố định, mỗi dòng một bản ghi, các bảng nối với nhau bằng khoá ngoại.

```sql
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id       SERIAL PRIMARY KEY,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title    VARCHAR(255) NOT NULL,
  body     TEXT
);
```

**Điểm mạnh thật sự** không phải là "có bảng". Nó là ba thứ:

- **JOIN.** Bạn hỏi được câu "cho tôi tất cả bài viết của những người dùng đăng ký trong tháng 7 mà có ít nhất 3 bình luận" **mà không cần biết trước** rằng sẽ có ai hỏi câu đó. Đây là điều khiến mô hình quan hệ vẫn thống trị sau 50 năm: bạn không phải thiết kế lại kho dữ liệu mỗi khi có câu hỏi mới.
- **Ràng buộc do máy chủ giữ.** `NOT NULL`, `UNIQUE`, `REFERENCES`, `CHECK`. Cơ sở dữ liệu *từ chối* ghi dữ liệu sai. Điều này nghe nhàm chán cho tới lần đầu bạn phát hiện 4.000 dòng mồ côi trỏ tới một `user_id` đã bị xoá.
- **Giao dịch ACID.** Nhiều thao tác ghi hoặc thành công trọn vẹn, hoặc không có gì xảy ra.

**Điểm yếu:** khó mở rộng theo chiều ngang (nhiều máy) — vì JOIN và giao dịch qua nhiều máy là bài toán khó; và schema cứng khiến việc đổi cấu trúc trên bảng lớn cần kế hoạch.

**Sản phẩm:** PostgreSQL, MySQL/MariaDB, SQLite, SQL Server, Oracle.

**Khi nào dùng:** mặc định. Nghiêm túc — nếu bạn không có lý do cụ thể để làm khác, đây là lựa chọn đúng cho khoảng 90% ứng dụng.

**Khi nào đừng:** khi dữ liệu thật sự không có quan hệ và bạn cần thông lượng ghi cực lớn trên nhiều máy (log, telemetry hàng triệu điểm/giây).

> **PostgreSQL hay MySQL?** Nếu không có ràng buộc từ trước, chọn PostgreSQL. Nó có kiểu dữ liệu phong phú hơn (`jsonb`, `array`, `tsvector`, `range`, `uuid`), nhiều loại chỉ mục hơn (GIN, GiST, BRIN), hệ sinh thái extension (PostGIS cho bản đồ, pgvector cho AI, TimescaleDB cho chuỗi thời gian) và cách xử lý kiểu dữ liệu nghiêm ngặt hơn. MySQL nhanh hơn ở vài tải đọc đơn giản và có nhiều hosting rẻ hơn, nhưng khoảng cách đó đã hẹp lại nhiều.

## 1.2. Cơ sở dữ liệu tài liệu (Document)

**Dữ liệu trông thế nào:** các tài liệu JSON tự chứa, mỗi tài liệu có thể có cấu trúc khác nhau.

```js
// Một tài liệu trong collection `orders`
{
  _id: "ord_8812",
  customer: { name: "Minh", email: "minh@example.com" },   // nhúng luôn
  items: [
    { sku: "A-1", qty: 2, price: 120000 },
    { sku: "B-7", qty: 1, price: 450000 }
  ],
  total: 690000,
  status: "paid"
}
```

Điểm mấu chốt là **nhúng thay vì nối**. Cả đơn hàng nằm trong một tài liệu, nên đọc nó là *một* thao tác đọc, không cần JOIN ba bảng.

**Điểm mạnh:** đọc một "khối" hoàn chỉnh rất nhanh; schema linh hoạt khi cấu trúc thật sự thay đổi theo từng bản ghi; mở rộng ngang dễ hơn quan hệ.

**Điểm yếu — và đây là chỗ hay bị đau:**

- **Trùng lặp dữ liệu.** Tên khách hàng nằm trong mọi đơn hàng của họ. Khách đổi email? Bạn phải cập nhật N tài liệu, và không có gì đảm bảo bạn cập nhật hết.
- **Câu hỏi không lường trước thành đắt.** "Tổng doanh thu theo từng SKU" phải quét toàn bộ đơn hàng và bung mảng `items` ra.
- **"Không cần schema" là ảo tưởng.** Không có schema trong cơ sở dữ liệu *không* có nghĩa là không có schema — nó chỉ chuyển schema vào trong code ứng dụng, nơi không ai kiểm tra nó. Sáu tháng sau bạn sẽ có ba thế hệ cấu trúc tài liệu cùng tồn tại và một hàm đọc đầy `if (doc.customer?.name ?? doc.customerName)`.

**Sản phẩm:** MongoDB, CouchDB, Amazon DocumentDB, Firestore. Và — quan trọng — **PostgreSQL với kiểu `jsonb`**, thứ cho bạn tài liệu JSON có chỉ mục *bên trong* một cơ sở dữ liệu quan hệ:

```sql
-- Cột jsonb có chỉ mục GIN: truy vấn vào bên trong JSON vẫn dùng được index
ALTER TABLE events ADD COLUMN payload jsonb;
CREATE INDEX idx_events_payload ON events USING gin (payload);

SELECT * FROM events WHERE payload @> '{"type": "signup"}';
```

**Khi nào dùng:** dữ liệu thật sự dạng tài liệu, đọc theo khối, ít quan hệ chéo. Catalog sản phẩm với thuộc tính khác nhau theo ngành hàng là ví dụ kinh điển hợp lệ.

**Khi nào đừng:** khi dữ liệu của bạn có quan hệ. Nếu bạn thấy mình viết code ghép hai collection lại với nhau, bạn vừa tự cài đặt JOIN — chậm hơn, nhiều lỗi hơn, và không có ràng buộc nào bảo vệ.

## 1.3. Khoá–giá trị (Key-Value)

**Dữ liệu trông thế nào:** một cuốn từ điển khổng lồ. Một khoá, một giá trị. Hết.

```
session:8f3a2b   →  {"userId": 42, "role": "admin"}
rate:ip:1.2.3.4  →  17
otp:0912345678   →  "482913"    (tự hết hạn sau 300 giây)
```

**Điểm mạnh:** nhanh kinh khủng — độ trễ tính bằng chưa tới một mili giây khi dữ liệu nằm trong RAM. Mô hình đơn giản nên mở rộng dễ.

**Điểm yếu:** bạn chỉ tra được **bằng khoá**. Không hỏi được "cho tôi tất cả session của user 42" trừ khi bạn tự dựng thêm một khoá chỉ mục.

**Sản phẩm:** Redis, Memcached, DynamoDB, etcd, Valkey.

**Khi nào dùng:** cache, session, rate limit, hàng đợi công việc, khoá phân tán, đếm tạm, mã OTP. Nghĩa là: **dữ liệu tạm, mất được**.

**Khi nào đừng:** làm nguồn sự thật cho dữ liệu bạn không được phép mất. Redis *có* cơ chế lưu xuống đĩa (RDB, AOF), nhưng mặc định vẫn có một cửa sổ mất dữ liệu, và người ta hay bật cấu hình mặc định rồi quên. Xem thêm ở mục sai lầm số 2.

## 1.4. Cột rộng (Wide-column)

**Dữ liệu trông thế nào:** giống bảng, nhưng mỗi dòng có thể có tập cột riêng, và — điểm quan trọng nhất — **khoá phân vùng quyết định dữ liệu nằm ở máy nào**.

```
Khoá phân vùng: sensor_id     Khoá sắp xếp: timestamp
sensor_44 | 2026-08-05T10:00 | temp=28.1 | humidity=71
sensor_44 | 2026-08-05T10:01 | temp=28.3 | humidity=70
```

Mô hình này bắt bạn **thiết kế bảng theo câu truy vấn**, không theo dữ liệu. Muốn hỏi theo hai cách khác nhau? Bạn ghi dữ liệu hai lần vào hai bảng. Nghe ngược đời cho tới khi bạn nhìn con số: Cassandra ghi được hàng triệu dòng mỗi giây và thêm máy vào cụm là tăng tuyến tính.

**Điểm mạnh:** thông lượng ghi cực lớn, mở rộng ngang gần như tuyến tính, không có điểm chết đơn lẻ.

**Điểm yếu:** không JOIN, không giao dịch qua nhiều dòng, truy vấn tuỳ hứng gần như không làm được, vận hành phức tạp.

**Sản phẩm:** Cassandra, ScyllaDB, HBase, Google Bigtable.

**Khi nào dùng:** ghi khổng lồ, mẫu truy vấn biết trước và ít thay đổi — log sự kiện, lịch sử tin nhắn, dữ liệu IoT ở quy mô rất lớn.

**Khi nào đừng:** khi bạn chưa chạm tới giới hạn của một máy Postgres. Ngưỡng đó cao hơn bạn nghĩ rất nhiều — hàng chục nghìn giao dịch/giây và hàng terabyte dữ liệu trên phần cứng hiện đại.

## 1.5. Đồ thị (Graph)

**Dữ liệu trông thế nào:** các nút và các cạnh, trong đó **quan hệ cũng là một thực thể hạng nhất** có thuộc tính riêng.

```cypher
// Cypher (Neo4j): tìm bạn của bạn mà chưa phải bạn mình
MATCH (me:User {id: 42})-[:FRIEND]->(:User)-[:FRIEND]->(fof:User)
WHERE NOT (me)-[:FRIEND]->(fof) AND fof <> me
RETURN fof.name, count(*) AS mutual
ORDER BY mutual DESC LIMIT 10
```

**Điểm mạnh:** đi sâu nhiều bậc quan hệ với chi phí gần như không đổi. Trong SQL, mỗi bậc là thêm một JOIN, và tới bậc 4–5 thì truy vấn sập. Trong đồ thị, đi từ nút này sang nút kia là theo con trỏ.

**Điểm yếu:** kém ở tổng hợp toàn bộ dữ liệu; hệ sinh thái nhỏ hơn; thêm một hệ thống phải vận hành.

**Sản phẩm:** Neo4j, Amazon Neptune, ArangoDB, Dgraph.

**Khi nào dùng:** mạng xã hội nhiều bậc, phát hiện gian lận, gợi ý "người cũng mua", đồ thị tri thức, phân tích phụ thuộc.

**Khi nào đừng:** khi quan hệ của bạn chỉ sâu một hoặc hai bậc. "Bạn bè của tôi" và "bạn chung" làm bằng SQL hoàn toàn ổn — đó là một JOIN và một `INTERSECT`. Chỉ khi bạn cần bậc 3 trở lên, hoặc cần đường đi ngắn nhất, đồ thị mới thắng rõ rệt.

## 1.6. Chuỗi thời gian (Time-series)

**Dữ liệu trông thế nào:** các điểm đo gắn với mốc thời gian, gần như chỉ ghi thêm chứ không sửa, và thường được hỏi theo khoảng thời gian.

```sql
-- TimescaleDB: một extension của Postgres
SELECT time_bucket('5 minutes', ts) AS bucket,
       avg(cpu_percent)
FROM metrics
WHERE ts > now() - interval '6 hours'
GROUP BY bucket ORDER BY bucket;
```

**Điểm mạnh:** nén rất tốt (dữ liệu liền kề rất giống nhau, có khi nén xuống 10–20 lần), tự động chia phân vùng theo thời gian, có sẵn hàm gộp theo khoảng, và **chính sách giữ dữ liệu** — tự xoá dữ liệu cũ hơn 90 ngày là một dòng cấu hình chứ không phải một cron job.

**Sản phẩm:** InfluxDB, TimescaleDB (extension Postgres), Prometheus, VictoriaMetrics, ClickHouse.

**Khi nào dùng:** giám sát hệ thống, IoT, dữ liệu tài chính, bất cứ thứ gì có dạng "giá trị theo thời gian" và khối lượng lớn.

**Khi nào đừng:** khi bạn chỉ có vài triệu dòng. Một bảng Postgres bình thường với chỉ mục trên cột thời gian là quá đủ, và TimescaleDB có thể bật sau mà gần như không phải viết lại gì.

## 1.7. Tìm kiếm toàn văn (Search)

**Dữ liệu trông thế nào:** một **chỉ mục đảo ngược** — thay vì "tài liệu 5 chứa những từ nào", nó lưu "từ 'database' xuất hiện ở tài liệu 5, 12, 88".

Đây là lý do `LIKE '%từ khoá%'` trong SQL chậm: nó phải đọc từng dòng. Chỉ mục đảo ngược tra thẳng vào từ.

Công cụ tìm kiếm còn làm những việc mà `LIKE` không bao giờ làm được: **tách từ và đưa về từ gốc** (tìm "running" ra "run"), **xếp hạng độ liên quan** (BM25), **chịu lỗi chính tả**, **gợi ý khi gõ**, **đánh dấu đoạn khớp**.

**Sản phẩm:** Elasticsearch, OpenSearch, Meilisearch, Typesense, Algolia. Và lần nữa — **PostgreSQL làm được ở mức khá tốt**:

```sql
-- Cột tsvector do Postgres tự duy trì + chỉ mục GIN
ALTER TABLE snippets ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))
  ) STORED;

CREATE INDEX idx_snippets_search ON snippets USING gin (search_vector);

SELECT * FROM snippets
WHERE search_vector @@ websearch_to_tsquery('simple', 'connection pool');
```

**Khi nào dùng công cụ riêng:** khi tìm kiếm là tính năng cốt lõi, cần xếp hạng tinh vi, tìm theo mặt hàng (facet), hoặc chịu lỗi chính tả tốt.

**Khi nào đừng:** khi tìm kiếm chỉ là một ô search phụ. Elasticsearch là một cụm phải nuôi: nó ăn RAM, cần đồng bộ dữ liệu từ cơ sở dữ liệu chính, và bạn vừa tạo ra một bài toán nhất quán mới. `tsvector` + GIN giải quyết được nhiều hơn bạn tưởng.

## 1.8. Cơ sở dữ liệu vector

Loại trẻ nhất trong danh sách, và là loại đang bị hiểu sai nhiều nhất vì cơn sốt AI.

**Dữ liệu trông thế nào:** mỗi bản ghi là một mảng số thực — thường 384, 768 hoặc 1536 chiều — biểu diễn *ý nghĩa* của một đoạn văn bản, một tấm ảnh hay một đoạn âm thanh. Hai thứ có nghĩa gần nhau thì hai vector nằm gần nhau trong không gian đó.

**Câu hỏi nó trả lời:** "cho tôi 10 đoạn văn bản gần nghĩa nhất với câu hỏi này" — nền tảng của RAG (sinh câu trả lời có tra cứu), tìm kiếm theo ngữ nghĩa, khử trùng lặp, gợi ý nội dung.

Điểm cần hiểu: tìm hàng xóm gần nhất một cách chính xác thì phải so sánh với **mọi** vector. Với một triệu vector 768 chiều, đó là 768 triệu phép nhân cho *một* câu hỏi. Nên các cơ sở dữ liệu vector dùng **ANN — xấp xỉ hàng xóm gần nhất** (thuật toán HNSW hoặc IVFFlat), đánh đổi vài phần trăm độ chính xác lấy tốc độ nhanh hơn hàng trăm lần.

```sql
-- pgvector: chỉ mục HNSW cho khoảng cách cosine
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE chunks ADD COLUMN embedding vector(768);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

-- Toán tử <=> là khoảng cách cosine
SELECT content, 1 - (embedding <=> $1) AS similarity
FROM chunks ORDER BY embedding <=> $1 LIMIT 10;
```

**Sản phẩm:** pgvector (extension Postgres), Qdrant, Weaviate, Milvus, Pinecone, Chroma.

**Khi nào dùng cơ sở dữ liệu vector chuyên biệt:** khi bạn có từ hàng chục triệu vector trở lên, cần lọc phức tạp kết hợp với tìm kiếm vector, hoặc cần nhiều bản sao chỉ mục để chịu tải.

**Khi nào đừng:** dưới khoảng một triệu vector, `pgvector` trong chính Postgres của bạn là đủ, và bạn tránh được việc phải đồng bộ hai kho dữ liệu. Xem mục 7 — chính trang này còn chưa cần tới pgvector.

## 1.9. Cơ sở dữ liệu cột (Columnar / OLAP)

**Dữ liệu trông thế nào:** vẫn là bảng, nhưng lưu **theo cột** thay vì theo dòng.

Nghe như chi tiết kỹ thuật vụn vặt, nhưng hệ quả rất lớn. Khi bạn hỏi `SELECT avg(price) FROM orders` trên 100 triệu dòng:

- **Lưu theo dòng:** phải đọc cả 100 triệu dòng từ đĩa, kể cả 30 cột bạn không cần.
- **Lưu theo cột:** chỉ đọc đúng cột `price`. Ít hơn có khi 30 lần dữ liệu. Thêm nữa, cả cột cùng kiểu dữ liệu nên nén cực tốt, và CPU xử lý được theo lô (SIMD).

Đổi lại, sửa một dòng đơn lẻ thì đắt — phải đụng vào mọi cột.

**Sản phẩm:** ClickHouse, DuckDB, Apache Druid, BigQuery, Snowflake, Redshift, Apache Parquet (định dạng file).

**Khi nào dùng:** phân tích, báo cáo, bảng điều khiển tổng hợp trên khối lượng lớn.

**Khi nào đừng:** làm cơ sở dữ liệu chính cho ứng dụng. Nó không sinh ra để phục vụ hàng nghìn thao tác đọc/ghi nhỏ mỗi giây.

> **DuckDB đáng biết riêng.** Nó là "SQLite của phân tích": chạy nhúng trong tiến trình, không cần máy chủ, đọc thẳng file CSV/Parquet và chạy SQL phân tích trên đó nhanh đến mức khó tin. Để phân tích một lần trên file dữ liệu, nó thường là công cụ đúng.

## 1.10. Lưu trữ đối tượng (Object storage)

Không phải cơ sở dữ liệu, nhưng phải nằm trong bài này vì rất nhiều người dùng sai chỗ này.

**Dữ liệu trông thế nào:** file, tra bằng khoá, không có truy vấn.

**Sản phẩm:** Amazon S3, Cloudflare R2, MinIO, Google Cloud Storage.

**Quy tắc:** **file để ở object storage, đường dẫn file để trong cơ sở dữ liệu.** Nhét ảnh và video vào cột `BLOB` làm phình bản sao lưu, phá bộ nhớ đệm của cơ sở dữ liệu, và biến mỗi lần khôi phục thành cơn ác mộng.

## 1.11. Đa mô hình (Multi-model)

Một số sản phẩm gộp nhiều mô hình vào một: ArangoDB (tài liệu + đồ thị + tìm kiếm), SurrealDB, FaunaDB, Couchbase.

Sức hấp dẫn rõ ràng: một hệ thống thay vì bốn. Rủi ro cũng rõ: cộng đồng nhỏ hơn, ít người biết vận hành, và mỗi mô hình thường yếu hơn sản phẩm chuyên biệt.

Đáng nhắc là **PostgreSQL cũng chính là một cơ sở dữ liệu đa mô hình** — chỉ là ít ai gọi nó như vậy: `jsonb` cho tài liệu, `tsvector` cho tìm kiếm, `pgvector` cho vector, `PostGIS` cho không gian, `TimescaleDB` cho chuỗi thời gian, `ltree` cho cây phân cấp, mảng và kiểu khoảng có sẵn.

## Bảng tổng kết mô hình

| Mô hình | Câu hỏi nó trả lời rẻ | Chỗ nó đắt | Sản phẩm tiêu biểu |
|---|---|---|---|
| Quan hệ | Bất kỳ câu nào, kể cả chưa lường trước | Mở rộng ngang | PostgreSQL, MySQL |
| Tài liệu | "Cho tôi cả khối này" | Câu hỏi cắt ngang nhiều tài liệu | MongoDB, Firestore |
| Khoá–giá trị | "Giá trị của khoá X" | Mọi câu hỏi khác | Redis, DynamoDB |
| Cột rộng | Ghi rất nhiều, đọc theo khoá phân vùng | Truy vấn tuỳ hứng, JOIN | Cassandra, ScyllaDB |
| Đồ thị | "Đi 4 bậc quan hệ từ đây" | Tổng hợp toàn bộ | Neo4j, Neptune |
| Chuỗi thời gian | "Trung bình theo 5 phút, 6 giờ qua" | Cập nhật dữ liệu cũ | InfluxDB, TimescaleDB |
| Tìm kiếm | "Tài liệu nào liên quan nhất tới câu này" | Làm nguồn sự thật | Elasticsearch, Meilisearch |
| Vector | "10 đoạn gần nghĩa nhất" | Lọc chính xác, tổng hợp | pgvector, Qdrant |
| Cột (OLAP) | "Tổng/trung bình trên 100 triệu dòng" | Sửa một dòng | ClickHouse, DuckDB |

---

# Phần 2 — Chia theo tải công việc: OLTP và OLAP

Đây là phép chia mà tôi thấy hữu ích hơn cả SQL/NoSQL, và ít người nói tới hơn nhiều.

**OLTP — xử lý giao dịch trực tuyến.** Rất nhiều thao tác nhỏ, mỗi thao tác chạm vào ít dòng, đòi hỏi độ trễ thấp và tính đúng đắn tuyệt đối. Đây là cơ sở dữ liệu của ứng dụng: tạo đơn hàng, cập nhật hồ sơ, gửi tin nhắn.

**OLAP — xử lý phân tích trực tuyến.** Ít câu truy vấn, mỗi câu quét hàng triệu dòng để tổng hợp. Đây là báo cáo và bảng điều khiển: doanh thu theo quý, hành vi người dùng theo nhóm.

| | OLTP | OLAP |
|---|---|---|
| Số dòng mỗi truy vấn | 1 đến vài chục | hàng triệu |
| Số truy vấn mỗi giây | hàng nghìn | vài chục |
| Kiểu thao tác | đọc + ghi lẫn lộn | gần như chỉ đọc |
| Lưu trữ | theo dòng | theo cột |
| Chuẩn hoá | có | thường phi chuẩn hoá |
| Ví dụ | PostgreSQL, MySQL | ClickHouse, BigQuery |

**Vì sao điều này quan trọng thực tế:** sai lầm phổ biến nhất trong đời một hệ thống đang lớn là chạy báo cáo phân tích trên chính cơ sở dữ liệu OLTP. Một truy vấn tổng hợp quét toàn bảng sẽ xoá sạch bộ nhớ đệm, giữ khoá, và làm chậm mọi thao tác của người dùng thật. Bạn nhận ra khi giám đốc mở bảng điều khiển và trang chủ chậm đi.

**Cách sửa theo thứ tự chi phí tăng dần:**

1. Chạy báo cáo trên **bản sao chỉ đọc** (read replica). Rẻ nhất, giải quyết được phần lớn trường hợp.
2. Tạo **bảng tổng hợp sẵn** cập nhật theo giờ (materialized view).
3. Đưa dữ liệu sang một kho **OLAP riêng**.

**HTAP** là nỗ lực làm cả hai trong một hệ thống (TiDB, SingleStore, và ở mức nào đó là Postgres có replica). Nghe hấp dẫn, nhưng trong thực tế phương án 1 và 2 ở trên giải quyết được đại đa số trường hợp với chi phí thấp hơn nhiều.

---

# Phần 3 — Chia theo cách triển khai

**Nhúng (embedded).** Cơ sở dữ liệu chạy *bên trong* tiến trình ứng dụng, dữ liệu là một file. Không có máy chủ, không có mạng, không có cấu hình.
*SQLite, DuckDB, RocksDB, LevelDB.*
SQLite là cơ sở dữ liệu được triển khai nhiều nhất hành tinh — nó nằm trong mọi điện thoại, mọi trình duyệt. Và nó hoàn toàn đủ cho một trang web thật: các dự án như Litestream hay Turso đã đưa SQLite lên production nghiêm túc. Điểm yếu: chỉ một tiến trình ghi tại một thời điểm.

**Máy chủ đơn (client-server).** Cách chạy phổ biến nhất: một tiến trình cơ sở dữ liệu, nhiều ứng dụng kết nối qua mạng.
*PostgreSQL, MySQL, MongoDB ở chế độ mặc định.*

**Phân tán.** Dữ liệu trải trên nhiều máy, hệ thống tự lo sao chép và chuyển đổi khi máy chết.
*Cassandra, CockroachDB, Spanner, TiDB, Vitess.*
Đắt hơn nhiều về vận hành. Đừng chọn vì "sau này sẽ cần".

**Dịch vụ quản lý (managed).** Vẫn là những cơ sở dữ liệu trên, nhưng người khác lo bản sao lưu, vá lỗi, chuyển đổi dự phòng.
*RDS, Aurora, Neon, Supabase, PlanetScale, MongoDB Atlas.*
Với đội nhỏ, đây gần như luôn là lựa chọn đúng. Tiền bạn trả rẻ hơn nhiều so với một đêm mất dữ liệu.

**Serverless.** Tính tiền theo lượng dùng, tự co giãn về không.
*Neon, PlanetScale, DynamoDB, Cloudflare D1, Firestore.*
Hợp với tải thất thường. Cảnh báo: khởi động nguội, và **giới hạn số kết nối** — một hàm serverless mở kết nối riêng cho mỗi lần gọi sẽ làm cạn connection pool rất nhanh. Đây là lý do các dịch vụ này đều có một tầng gộp kết nối riêng.

---

# Phần 4 — Những khái niệm bạn phải nắm để chọn đúng

Đây là phần dài nhất, và là phần đáng đọc nhất. Không có mấy khái niệm này thì mọi so sánh cơ sở dữ liệu đều chỉ là nghe theo quảng cáo.

## 4.1. ACID

Bốn tính chất của một giao dịch. Hầu như ai cũng đọc qua, ít người phân biệt được.

**A — Atomicity (nguyên tử).** Cả khối hoặc chạy trọn vẹn, hoặc không gì cả.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500000 WHERE id = 1;
UPDATE accounts SET balance = balance + 500000 WHERE id = 2;
COMMIT;   -- mất điện ở đây: KHÔNG có câu nào được ghi
```

Không có tính nguyên tử, mất điện giữa hai câu lệnh làm bốc hơi 500.000 đồng.

**C — Consistency (nhất quán).** Giao dịch đưa dữ liệu từ một trạng thái hợp lệ sang một trạng thái hợp lệ khác. "Hợp lệ" ở đây là những ràng buộc bạn khai báo: khoá ngoại, `CHECK (balance >= 0)`, `UNIQUE`.

Lưu ý: chữ C này **không liên quan** tới chữ C trong CAP. Đây là một trong những trùng tên gây nhầm lẫn nhất trong ngành.

**I — Isolation (cô lập).** Các giao dịch chạy đồng thời không nhìn thấy trạng thái dở dang của nhau. Đây là phần tinh vi nhất, nên có mục riêng bên dưới.

**D — Durability (bền vững).** Đã `COMMIT` thì còn, kể cả khi rút điện ngay lập tức. Đạt được nhờ ghi trước vào nhật ký (write-ahead log) và `fsync` xuống đĩa.

## 4.2. Mức cô lập — chỗ hầu hết lỗi tinh vi ẩn nấp

Cô lập tuyệt đối thì chậm, nên các cơ sở dữ liệu cho bạn chọn mức. Mỗi mức cho phép một số "dị thường" xảy ra:

| Dị thường | Nghĩa là gì |
|---|---|
| **Dirty read** | Đọc được dữ liệu của giao dịch khác *chưa* commit |
| **Non-repeatable read** | Đọc cùng một dòng hai lần trong một giao dịch, ra hai giá trị khác nhau |
| **Phantom read** | Chạy cùng một câu `WHERE` hai lần, lần sau xuất hiện thêm dòng mới |
| **Write skew** | Hai giao dịch cùng đọc, cùng quyết định, và cùng ghi — kết quả vi phạm một quy tắc mà từng giao dịch riêng lẻ đều tôn trọng |

| Mức cô lập | Dirty | Non-repeatable | Phantom |
|---|---|---|---|
| Read Uncommitted | có thể | có thể | có thể |
| Read Committed *(mặc định của Postgres)* | không | có thể | có thể |
| Repeatable Read *(mặc định của MySQL InnoDB)* | không | không | có thể\* |
| Serializable | không | không | không |

\* Postgres ở mức Repeatable Read chặn luôn cả phantom, chặt hơn chuẩn SQL yêu cầu.

**Write skew đáng được ví dụ riêng**, vì nó là loại lỗi lọt qua code review dễ nhất. Quy tắc: "phải luôn có ít nhất một bác sĩ trực".

```
Có 2 bác sĩ đang trực: An và Bình. Cả hai cùng bấm "xin nghỉ" đúng một lúc.

Giao dịch của An:              Giao dịch của Bình:
  đếm bác sĩ trực → 2            đếm bác sĩ trực → 2
  2 > 1, được phép nghỉ          2 > 1, được phép nghỉ
  cập nhật An = nghỉ             cập nhật Bình = nghỉ
  COMMIT                         COMMIT

Kết quả: 0 bác sĩ trực. Cả hai giao dịch đều "đúng" theo logic của chính nó.
```

Ở mức `Read Committed` và `Repeatable Read`, lỗi này xảy ra được. Cách chặn: dùng `SERIALIZABLE`, hoặc khoá tường minh bằng `SELECT ... FOR UPDATE`, hoặc chuyển quy tắc thành một ràng buộc mà cơ sở dữ liệu tự giữ.

**Điều đáng nhớ:** phần lớn ứng dụng chạy ở mức mặc định và không bao giờ nghĩ tới chuyện này. Với đặt vé, tồn kho, số dư tài khoản hay bất cứ chỗ nào có tranh chấp, bạn *phải* nghĩ tới.

## 4.3. BASE

Đối trọng của ACID, thường gắn với hệ phân tán: **Basically Available, Soft state, Eventually consistent** — về cơ bản luôn sẵn sàng, trạng thái mềm, nhất quán sau cùng.

Nghĩa thực tế: hệ thống nhận ghi kể cả khi các máy chưa đồng ý với nhau, và các bản sao sẽ hội tụ *sau một lúc*. Bạn đổi ảnh đại diện, bạn bè ở khu vực khác còn thấy ảnh cũ thêm vài giây.

Với ảnh đại diện thì chấp nhận được. Với số dư tài khoản thì không.

## 4.4. Định lý CAP — và vì sao nó hay bị dùng sai

Phát biểu phổ biến: "chọn 2 trong 3 — Consistency, Availability, Partition tolerance".

Cách hiểu này sai, và nó dẫn tới những câu như "chúng tôi chọn AP" nghe có vẻ là một quyết định kiến trúc trong khi thực ra chẳng nói lên điều gì.

**Vì sao sai:** phân vùng mạng (P) **không phải một lựa chọn**. Mạng *sẽ* đứt — cáp bị cắt, switch chết, một trung tâm dữ liệu mất kết nối. Bạn không "chọn" chịu đựng phân vùng, bạn chỉ chọn *hành xử thế nào khi nó xảy ra*.

**Phát biểu đúng:** *khi mạng bị phân vùng*, bạn phải chọn giữa:

- **CP** — từ chối phục vụ ở phía không chắc chắn, giữ dữ liệu đúng. (Ngân hàng thà báo lỗi còn hơn cho rút tiền hai lần.)
- **AP** — vẫn phục vụ, chấp nhận các bên tạm lệch nhau rồi hoà giải sau. (Giỏ hàng thà cho thêm nhầm một món còn hơn không cho mua.)

**PACELC bổ sung nốt phần CAP bỏ sót:** *nếu có phân vùng (P) thì chọn A hay C; còn lại (E — else) thì chọn độ trễ (L) hay nhất quán (C)*. Vế sau mới là vế bạn sống chung hằng ngày, vì mạng đứt thì hiếm còn độ trễ thì luôn có. Muốn đọc thấy dữ liệu mới nhất tuyệt đối? Phải hỏi máy chủ chính, xa hơn, chậm hơn. Chấp nhận trễ vài trăm mili giây? Đọc từ bản sao gần nhất.

## 4.5. Các kiểu nhất quán

- **Strong (mạnh):** đọc luôn thấy lần ghi mới nhất. Đơn giản để lập trình, đắt để mở rộng.
- **Eventual (sau cùng):** rồi cũng thấy, không hứa khi nào.
- **Read-your-writes:** bạn luôn thấy thay đổi của *chính bạn*, người khác có thể chậm hơn. Đây thường là điểm cân bằng đúng cho mạng xã hội — bạn bình luận xong phải thấy ngay bình luận của mình, còn người khác chậm 200ms thì không ai để ý.
- **Monotonic reads:** đã thấy dữ liệu mới thì không bao giờ bị "lùi" về dữ liệu cũ. Thiếu tính chất này sinh ra hiện tượng F5 hai lần ra hai kết quả khác nhau.

## 4.6. B-tree và LSM-tree — vì sao có cơ sở dữ liệu ghi nhanh hơn hẳn

Đây là chi tiết cài đặt giải thích được rất nhiều khác biệt hiệu năng mà quảng cáo không nói.

**B-tree** (PostgreSQL, MySQL, SQLite, hầu hết cơ sở dữ liệu quan hệ): một cây cân bằng trên đĩa. Ghi một bản ghi nghĩa là **sửa tại chỗ** — tìm đúng trang, đọc nó lên, sửa, ghi xuống. Đọc rất nhanh và dự đoán được (vài lần nhảy đĩa). Ghi phải chịu chi phí đọc–sửa–ghi và ghi ngẫu nhiên.

**LSM-tree** (Cassandra, RocksDB, LevelDB, ScyllaDB, HBase): ghi vào bộ nhớ trước, khi đầy thì **đổ xuống đĩa thành một file mới**, không sửa file cũ. Ghi thành **tuần tự** — nhanh hơn ghi ngẫu nhiên rất nhiều, đặc biệt trên đĩa quay và vẫn đáng kể trên SSD. Đổi lại, một lần đọc có thể phải tra nhiều file, và hệ thống phải chạy **nén gộp (compaction)** ở nền để dồn file lại — việc này ăn đĩa và CPU vào những lúc bạn không hẹn trước.

![Đường đi của một lần ghi trong B-tree so với LSM-tree](/deepdives/databases/btree-vs-lsm.svg)

| | B-tree | LSM-tree |
|---|---|---|
| Ghi | chậm hơn, ngẫu nhiên | nhanh hơn, tuần tự |
| Đọc | nhanh, ổn định | có thể phải tra nhiều tầng |
| Khuếch đại ghi | thấp hơn | cao hơn (do nén gộp) |
| Khuếch đại không gian | thấp hơn | cao hơn (dữ liệu cũ còn nằm đó) |

Khi ai đó nói "cơ sở dữ liệu X ghi nhanh gấp 10 lần Postgres", câu trả lời thường nằm ở dòng đầu bảng này — kèm những đánh đổi ở ba dòng còn lại.

## 4.7. Chỉ mục — loại nào cho việc gì

Chỉ mục là công cụ hiệu năng quan trọng nhất mà bạn kiểm soát trực tiếp, và trong Postgres nó không chỉ có một loại:

| Loại | Dùng cho | Ví dụ |
|---|---|---|
| **B-tree** *(mặc định)* | bằng, lớn/nhỏ hơn, `ORDER BY`, tiền tố | `WHERE id = 5`, `WHERE ts > now() - '1 day'` |
| **Hash** | chỉ so bằng | hiếm khi đáng dùng, B-tree gần như luôn tốt bằng hoặc hơn |
| **GIN** | nhiều giá trị trong một ô: mảng, `jsonb`, tsvector | `WHERE tags @> '{devops}'` |
| **GiST** | dữ liệu không gian, khoảng, lân cận | PostGIS, `tstzrange` |
| **BRIN** | bảng rất lớn có thứ tự tự nhiên | log theo thời gian, chỉ mục nhỏ tí xíu |
| **Trigram (pg_trgm)** | tìm gần đúng `ILIKE '%abc%'`, chịu lỗi chính tả | ô tìm kiếm người dùng |

Ví dụ trigram đáng nhắc riêng, vì nó giải quyết đúng cái mà ai cũng gặp: `ILIKE '%tu%'` bình thường **không dùng được chỉ mục** và phải quét toàn bảng ở mỗi lần gõ phím. Với `pg_trgm` thì dùng được:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_users_username_trgm
  ON users USING gin (username gin_trgm_ops);
```

**Chi phí của chỉ mục:** mỗi chỉ mục làm chậm `INSERT`/`UPDATE`/`DELETE` và chiếm đĩa. Chỉ mục không ai dùng là chi phí thuần. Trong Postgres, `pg_stat_user_indexes` cho biết chỉ mục nào chưa từng được đụng tới.

## 4.8. Chuẩn hoá và phi chuẩn hoá

**Chuẩn hoá** = mỗi sự thật nằm đúng một chỗ. Đổi tên khách hàng là sửa một dòng.
**Phi chuẩn hoá** = cố tình chép lại để đọc nhanh hơn. Đổi tên khách hàng là sửa N dòng.

Quy tắc thực dụng: **chuẩn hoá trước, phi chuẩn hoá sau khi đo được là cần.** Đảo thứ tự này là cách chắc chắn nhất để có dữ liệu lệch nhau mà không ai biết.

Vùng xám hợp lý: các cột đếm sẵn (`comment_count` trên bảng bài viết) — về lý thuyết là phi chuẩn hoá, nhưng nó tránh được một `COUNT(*)` ở mỗi lần hiển thị. Chấp nhận được nếu bạn cập nhật chúng trong cùng giao dịch với thao tác gốc.

## 4.9. Sao chép, phân mảnh, phân vùng

Ba từ hay bị dùng lẫn:

- **Replication (sao chép):** cùng một dữ liệu nằm trên nhiều máy. Mục đích: chịu lỗi và chia tải đọc.
- **Partitioning (phân vùng):** một bảng lớn chia thành nhiều bảng con *trong cùng một máy chủ*. Mục đích: truy vấn chỉ động tới phần liên quan, và xoá dữ liệu cũ bằng cách bỏ nguyên một phân vùng thay vì `DELETE` hàng triệu dòng.
- **Sharding (phân mảnh):** dữ liệu chia sang *nhiều máy chủ khác nhau*, mỗi máy giữ một tập con.

Sharding là bước nhảy về độ phức tạp lớn nhất trong danh sách này: mất JOIN xuyên mảnh, mất giao dịch xuyên mảnh, và chọn sai khoá phân mảnh là một sai lầm cực kỳ đắt để sửa. Hãy vắt kiệt mọi phương án khác trước — chỉ mục tốt hơn, bản sao đọc, phân vùng, bộ nhớ đệm, máy to hơn.

## 4.10. Schema-on-write và schema-on-read

- **Schema-on-write:** cấu trúc được kiểm tra *lúc ghi*. Dữ liệu sai bị từ chối ngay tại cửa. (Cơ sở dữ liệu quan hệ.)
- **Schema-on-read:** ghi gì cũng nhận, người đọc tự hiểu. (Nhiều kho tài liệu, data lake.)

Cái thứ hai nghe linh hoạt hơn. Trong thực tế nó chuyển chi phí từ một chỗ (lúc ghi, một lần, có báo lỗi rõ ràng) sang mọi chỗ đọc (nhiều lần, âm thầm, thường phát hiện lúc 2 giờ sáng).

---

# Phần 5 — Vậy chọn thế nào

Một cây quyết định thực dụng, theo đúng thứ tự tôi khuyên bạn tự hỏi:

**1. Bạn có dữ liệu quan hệ và chưa tới quy mô cực lớn?**
→ **PostgreSQL.** Xong. Đừng đọc tiếp trừ khi có lý do cụ thể.

**2. Cần cache, session, rate limit, hàng đợi?**
→ Thêm **Redis**. Đây là lần bổ sung hợp lý sớm nhất, và gần như luôn đáng.

**3. Có file người dùng tải lên?**
→ **Object storage** (S3/R2). Không nhét vào cơ sở dữ liệu.

**4. Tìm kiếm bắt đầu chậm?**
→ Thử `tsvector` + GIN trong Postgres trước. Chỉ khi không đủ mới thêm Meilisearch/Elasticsearch.

**5. Làm RAG hoặc tìm kiếm ngữ nghĩa?**
→ `pgvector` trong chính Postgres. Chỉ chuyển sang Qdrant/Pinecone khi vượt vài triệu vector.

**6. Báo cáo làm chậm ứng dụng?**
→ Bản sao chỉ đọc trước. Rồi mới tới bảng tổng hợp sẵn. Rồi mới tới ClickHouse.

**7. Có dữ liệu đo theo thời gian, khối lượng lớn?**
→ TimescaleDB (vẫn là Postgres) trước, InfluxDB/ClickHouse sau.

**8. Câu hỏi của bạn sâu từ 3 bậc quan hệ trở lên?**
→ Lúc này cơ sở dữ liệu đồ thị mới thật sự đáng.

**9. Ghi vượt quá sức một máy, mẫu truy vấn cố định?**
→ Giờ mới tới Cassandra/ScyllaDB.

Điểm chung xuyên suốt: **mỗi cơ sở dữ liệu thêm vào là thêm một thứ phải sao lưu, giám sát, vá lỗi, và đồng bộ.** Hai kho dữ liệu nghĩa là bạn vừa nhận thêm một bài toán nhất quán mà trước đó bạn không có. Cái giá đó thường lớn hơn lợi ích, cho tới khi nó không còn lớn hơn — và bạn sẽ biết rõ khi tới lúc đó, vì bạn sẽ có số đo chứ không phải linh cảm.

---

# Phần 6 — Mười sai lầm hay gặp nhất

**1. Chọn MongoDB vì "linh hoạt", rồi tự viết JOIN trong code.**
Dấu hiệu: bạn có hàm lấy danh sách rồi lặp qua để lấy dữ liệu liên quan. Bạn vừa cài đặt lại JOIN, chậm hơn nhiều, và không có ràng buộc nào bảo vệ.

**2. Dùng Redis làm nguồn sự thật.**
Redis mặc định lưu xuống đĩa theo chu kỳ, nên vẫn có cửa sổ mất dữ liệu. Redis là chỗ để dữ liệu bạn *dựng lại được*.

**3. Sharding quá sớm.**
Gần như luôn có phương án rẻ hơn chưa dùng: chỉ mục còn thiếu, truy vấn N+1, thiếu bộ nhớ đệm, hoặc chỉ là một máy to hơn.

**4. Chạy báo cáo trên cơ sở dữ liệu chính.**
Một truy vấn tổng hợp làm chậm mọi người dùng thật. Dùng bản sao đọc.

**5. Không có connection pool.**
Mỗi kết nối Postgres là một tiến trình riêng, tốn vài megabyte RAM. Vài trăm kết nối là máy chủ hết bộ nhớ. Dùng PgBouncer, hoặc pool sẵn có trong ORM, và **cấu hình giới hạn thật sự** thay vì để mặc định.

**6. Bài toán N+1.**
Lấy 50 bài viết rồi lặp 50 lần để lấy tác giả = 51 lần đi vòng tới cơ sở dữ liệu. Sửa bằng `include`/`JOIN`, hoặc gom vào một câu `WHERE id IN (...)`.

```js
// Sai — 1 + N truy vấn
const posts = await prisma.post.findMany({ take: 50 });
for (const p of posts) p.author = await prisma.user.findUnique({ where: { id: p.authorId } });

// Đúng — 1 truy vấn (Prisma tự JOIN)
const posts = await prisma.post.findMany({ take: 50, include: { author: true } });
```

**7. Nhét file vào cơ sở dữ liệu.**
Bản sao lưu phình lên, khôi phục chậm, bộ nhớ đệm bị phá. File ra object storage.

**8. Dùng mẫu EAV (Entity-Attribute-Value).**
Một bảng `(entity_id, attribute_name, value)` để "lưu được mọi thứ". Nó vô hiệu hoá kiểu dữ liệu, ràng buộc và chỉ mục cùng lúc. Nếu thật sự cần thuộc tính động, dùng cột `jsonb` — vẫn có chỉ mục GIN, vẫn truy vấn được.

**9. Không đo trước khi tối ưu.**
`EXPLAIN ANALYZE` là công cụ đầu tiên phải chạm, không phải công cụ cuối cùng. Nó cho biết cơ sở dữ liệu *thực sự* làm gì, thay vì điều bạn tưởng.

**10. Coi migration là chuyện nhẹ nhàng.**
Thêm cột `NOT NULL` không có giá trị mặc định vào bảng 10 triệu dòng sẽ khoá bảng. Đổi tên cột làm hỏng bản triển khai cũ đang chạy song song. Quy trình an toàn: thêm cột mới → ghi cả hai chỗ → chép dữ liệu cũ sang → chuyển đọc sang cột mới → *rồi mới* xoá cột cũ, ở một lần triển khai sau.

---

# Phần 7 — Trang này thật sự chạy gì

Phần này để bạn có một điểm tham chiếu thật, không phải một kiến trúc trong sách.

Trang bạn đang đọc chạy **một PostgreSQL duy nhất** làm nguồn sự thật, với **248 bảng** — mạng xã hội, tin nhắn, khoá học, phòng thi, code lab, nhạc, ví tiền, hồ sơ CV. Nó chạy trong Docker trên **một VPS 6GB**.

**Postgres ở đây gánh bao nhiêu vai:**

- **Quan hệ** — phần lớn 248 bảng, với khoá ngoại và ràng buộc thật.
- **Tài liệu** — cột `jsonb` cho những chỗ cấu trúc thật sự thay đổi: thân bài viết, cấu hình, tập nguồn của bản tin.
- **Tìm kiếm toàn văn** — cột `tsvector` được Postgres tự duy trì bằng `GENERATED ALWAYS AS ... STORED`, có chỉ mục GIN, truy vấn bằng `websearch_to_tsquery`.
- **Tìm gần đúng** — `pg_trgm` với chỉ mục GIN trên `username`, `display_name`, `full_name`, để ô tìm người dùng và hộp @-mention không phải quét toàn bảng ở mỗi lần gõ phím.

**Redis** chỉ giữ những thứ dựng lại được: phiên đăng nhập, mã OTP, hạn mức dùng AI, hàng đợi tạo embedding, khoá cho các tác vụ định kỳ. Không có gì trong Redis mà mất đi thì không khôi phục được.

**Cloudflare R2** giữ file: ảnh, video, tài liệu. Cơ sở dữ liệu chỉ giữ khoá đối tượng.

**Và một chi tiết trung thực về vector**, vì nó minh hoạ đúng luận điểm của bài. Schema ghi ở dòng đầu *"PostgreSQL with pgvector extension"*, và một chú thích trỏ tới `scripts/enable-pgvector.sql`. Nhưng khi tôi đi kiểm lại lúc viết bài này:

- File `scripts/enable-pgvector.sql` **không tồn tại**.
- Cột `embedding` được khai là `Json?`, **không phải** `vector(768)`.
- Không có chỗ nào trong mã nguồn dùng toán tử `<=>` của pgvector.

Nghĩa là phần RAG đang tính cosine **bằng JavaScript trên một tập ứng viên**, không hề có chỉ mục ANN. Và đây là điều đáng nói: **ở quy mô hiện tại, như thế là ổn.** Một tập vài nghìn đoạn văn bản thì quét thẳng chỉ mất vài mili giây, còn rẻ hơn cả việc dựng và bảo trì một chỉ mục HNSW. Cái sai duy nhất ở đây là **tài liệu nói một đằng, mã chạy một nẻo** — kiểu sai lệch âm thầm khiến người sau đọc schema rồi tưởng có một thứ không tồn tại.

Ba bài học rút từ chính hệ thống này:

- **Một Postgres đi được rất xa.** Bốn mô hình dữ liệu, 248 bảng, một máy 6GB.
- **Thêm cơ sở dữ liệu là thêm việc, không phải thêm sức.** Redis ở đây có mặt vì có lý do rõ ràng, và bị giới hạn nghiêm ngặt trong phạm vi đó.
- **Đi kiểm lại thứ tài liệu nói.** Dòng chú thích "with pgvector extension" đúng ở thời điểm ai đó định làm, và sai kể từ lúc kế hoạch đổi.

---

# Học tiếp

Nếu bạn chỉ đọc thêm một thứ sau bài này, đọc **"Designing Data-Intensive Applications"** của Martin Kleppmann. Nó là cuốn sách hiếm hoi giải thích *vì sao* các hệ thống này được thiết kế như vậy, thay vì liệt kê tính năng.

Bốn việc tự làm, xếp theo mức hữu ích:

1. Chạy `EXPLAIN ANALYZE` trên truy vấn chậm nhất của bạn. Bạn gần như chắc chắn sẽ tìm thấy một `Seq Scan` lẽ ra không nên có.
2. Mở `pg_stat_user_indexes` xem chỉ mục nào chưa từng được dùng, rồi xoá chúng đi.
3. Cài DuckDB, trỏ nó vào một file CSV lớn, chạy `SELECT` tổng hợp. Bạn sẽ hiểu ngay lưu theo cột nghĩa là gì.
4. Viết một giao dịch cố tình gây write skew rồi thử chặn nó bằng `SERIALIZABLE`. Đây là loại lỗi phải tự tay tạo ra một lần mới thật sự nhớ.

Và câu trả lời cho câu hỏi ban đầu — có bao nhiêu loại cơ sở dữ liệu? Khoảng mười một loại theo mô hình dữ liệu, hai loại theo tải công việc, năm loại theo cách triển khai. Nhưng con số hữu ích nhất là **một**: số cơ sở dữ liệu bạn nên bắt đầu.
