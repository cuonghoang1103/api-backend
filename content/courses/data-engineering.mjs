/**
 * Data Engineering — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: postgresql (OLTP, window function, replication), kafka (Connect/Streams — ở đây chỉ dùng như nguồn/luồng,
 * trỏ sang), background-jobs (hàng đợi việc — không phải orchestration dữ liệu), observability-monitoring (metric vận hành,
 * KHÔNG phải phân tích nghiệp vụ). privacy-data-law (Nhóm B) lo pháp lý dữ liệu cá nhân — ở đây chỉ nhắc ẩn danh hoá + trỏ.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 },
  course: {
    slug: 'data-engineering',
    title: 'Data Engineering',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/data-engineering.png?v=4',
    shortDescription: 'Data engineering from zero: OLTP vs OLAP, ETL/ELT, batch and streaming, warehouses and lakehouses, ClickHouse, dbt, Airflow/Dagster, data quality, CDC and dashboards — ending with learning analytics for a real site.|||Data engineering từ số 0: OLTP và OLAP, ETL/ELT, batch và streaming, kho dữ liệu và lakehouse, ClickHouse, dbt, Airflow/Dagster, chất lượng dữ liệu, CDC và dashboard — kết thúc bằng phân tích dữ liệu học tập cho website thật.',
    description: 'Khoá data engineering cho lập trình viên backend muốn trả lời câu hỏi bằng dữ liệu mà không làm sập CSDL production. Vì sao không chạy báo cáo nặng trên PostgreSQL chính; OLTP vs OLAP và lưu trữ theo cột; mô hình hoá dữ liệu (Kimball, star schema, SCD); ETL vs ELT; nạp dữ liệu batch, CDC bằng Debezium và streaming; kho dữ liệu với ClickHouse (và so sánh BigQuery/Snowflake/DuckDB); lakehouse với Parquet, Iceberg/Delta trên object storage (R2/S3); biến đổi bằng dbt; điều phối bằng Airflow hoặc Dagster; chất lượng dữ liệu, kiểm thử và lineage; dashboard với Metabase/Superset; bảo mật và ẩn danh hoá. Dự án cuối: nền tảng phân tích dữ liệu học tập của cuongthai.com — tiến độ bài học, quiz, tỉ lệ hoàn thành, phễu Pro — chạy trên Docker và VPS.',
    whatYouLearn: 'Thiết kế star schema cho câu hỏi nghiệp vụ; dựng pipeline ELT từ PostgreSQL sang ClickHouse bằng CDC hoặc batch; viết model dbt có test và tài liệu; lên lịch pipeline bằng Airflow/Dagster; lưu dữ liệu dạng Parquet trên R2; kiểm chất lượng dữ liệu tự động; dựng dashboard Metabase/Superset; ước lượng chi phí và chọn công cụ theo quy mô; trả lời câu hỏi phỏng vấn data engineer.',
    requirements: 'SQL vững (JOIN, GROUP BY, window function), Python cơ bản, Docker. Nên học trước khoá PostgreSQL và Python; biết Kafka là lợi thế cho chương streaming.',
    documentsNote: 'Tài liệu chính: "Fundamentals of Data Engineering" (Reis & Housley) • "The Data Warehouse Toolkit" (Kimball & Ross) • clickhouse.com/docs • docs.getdbt.com • airflow.apache.org/docs • docs.dagster.io • debezium.io/documentation • iceberg.apache.org • duckdb.org/docs • metabase.com/docs • superset.apache.org/docs.',
  },
  sections: khung('dataeng', [
    ['Section 0 — Why data engineering exists', 'Mục 0 — Vì sao có data engineering', 'Dữ liệu cho phân tích là gì, lịch sử, và dựng phòng lab.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Data engineering in everyday words, its history, and data mistakes that made headlines', 'Bắt đầu tại đây (1/2) — Data engineering bằng lời đời thường, lịch sử, và những lỗi dữ liệu lên báo', 'Nhà bếp (OLTP) vs phòng kế toán (OLAP) · Kho dữ liệu: Inmon (1992), Kimball (1996) → MapReduce (2004) / Hadoop (2006) → Spark → Airflow (Airbnb, 2014–2015) → dbt (2016) → ClickHouse mã nguồn mở (2016) → lakehouse · Anh 10/2020: gần 16.000 ca COVID bị bỏ sót vì giới hạn dòng của định dạng Excel cũ · Báo cáo sai quyết định sai'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Vị trí: data engineer, analytics engineer, backend làm dữ liệu · Trả lời câu hỏi kinh doanh của chính sản phẩm mình · Lộ trình: postgresql + python → khoá này → (tuỳ) machine-learning · Cách học: một bộ dữ liệu xuyên suốt cả khoá'],
      ['cai-dat', 'Lab: PostgreSQL, ClickHouse, DuckDB, dbt, Dagster/Airflow, Metabase with Docker', 'Phòng lab: PostgreSQL, ClickHouse, DuckDB, dbt, Dagster/Airflow, Metabase bằng Docker', 'Compose cả stack trên máy 16GB · Dữ liệu mẫu học tập giả lập (người dùng, bài học, tiến độ, quiz) · MinIO giả R2 · Python venv/uv'],
      ['khong-bao-cao-tren-prod', 'Why not just query production PostgreSQL?', 'Vì sao không truy vấn thẳng PostgreSQL production?', 'Báo cáo nặng khoá bảng, tranh I/O với người dùng · Lịch sử bị ghi đè (UPDATE mất quá khứ) · Dữ liệu nằm rải nhiều nguồn'],
    ]],
    ['Chapter 1 — OLTP, OLAP and columnar storage', 'Chương 1 — OLTP, OLAP và lưu trữ theo cột', 'Hai loại khối lượng việc, hai kiểu lưu trữ.', [
      ['oltp-olap', 'OLTP vs OLAP workloads', 'Khối lượng việc OLTP và OLAP', 'Ghi nhiều dòng nhỏ vs quét nhiều dòng lớn · Độ trễ vs thông lượng · Ví dụ cùng một câu hỏi trên hai hệ'],
      ['theo-cot', 'Row stores vs column stores', 'Lưu theo dòng và lưu theo cột', 'Chỉ đọc cột cần · Nén cực tốt · Thực thi vector hoá · Đo PostgreSQL vs DuckDB trên 50 triệu dòng'],
      ['dinh-dang', 'File formats: CSV, JSON, Parquet, ORC, Avro', 'Định dạng file: CSV, JSON, Parquet, ORC, Avro', 'Schema đi kèm · Row group và thống kê min/max · Vì sao Parquet là mặc định'],
      ['duckdb', 'DuckDB: analytics on your laptop', 'DuckDB: phân tích ngay trên laptop', 'SQL trên file Parquet/CSV · Đọc thẳng từ S3/R2 · Khi nào không cần kho dữ liệu'],
    ]],
    ['Chapter 2 — Data modelling for analytics', 'Chương 2 — Mô hình hoá dữ liệu cho phân tích', 'Sắp dữ liệu để câu hỏi dễ trả lời.', [
      ['kimball', 'Dimensional modelling: facts and dimensions', 'Mô hình chiều: bảng fact và bảng dimension', 'Kimball · Grain (mỗi dòng là gì) · Fact tiến độ bài học, dimension người dùng/khoá/thời gian'],
      ['star-snowflake', 'Star vs snowflake schemas, and wide tables', 'Star, snowflake và bảng rộng', 'JOIN ít hơn · One Big Table trên kho cột · Đánh đổi bảo trì'],
      ['scd', 'Slowly changing dimensions', 'Dimension thay đổi chậm (SCD)', 'Type 1, 2 · Người dùng đổi gói Pro thì báo cáo quá khứ ra sao · Snapshot trong dbt'],
      ['su-kien', 'Event data and tracking plans', 'Dữ liệu sự kiện và kế hoạch tracking', 'Đặt tên sự kiện nhất quán · Thuộc tính bắt buộc · Trỏ seo-analytics cho GA4/Umami phía web'],
    ]],
    ['Chapter 3 — Ingestion: batch, CDC and streaming', 'Chương 3 — Nạp dữ liệu: batch, CDC và streaming', 'Đưa dữ liệu từ nguồn vào kho.', [
      ['etl-elt', 'ETL vs ELT', 'ETL và ELT', 'Biến đổi trước hay sau khi nạp · Vì sao kho cột làm ELT thắng · Lớp raw → staging → mart'],
      ['batch', 'Batch extraction: full, incremental, watermark', 'Trích xuất batch: toàn bộ, tăng dần, watermark', 'updated_at và bẫy xoá cứng · Chạy lại an toàn (idempotent) · Airbyte/dlt/tự viết'],
      ['cdc-debezium', 'Change data capture with Debezium', 'CDC bằng Debezium', 'Logical replication, replication slot · Slot bị bỏ rơi làm đầy đĩa PostgreSQL (trỏ postgresql Ch15) · Nếu đã học kafka Ch7: Connect + Debezium — ở đây đích là kho phân tích'],
      ['streaming', 'Streaming ingestion: Kafka to ClickHouse', 'Nạp streaming: Kafka vào ClickHouse', 'Kafka engine / ClickPipes / consumer tự viết · Trùng lặp và thứ tự · Khi nào batch 5 phút là đủ'],
      ['api-file', 'APIs, files and third-party sources', 'API, file và nguồn bên thứ ba', 'Nạp từ Google Search Console, cổng thanh toán, CSV · Rate limit và phân trang · Lưu bản gốc trước khi biến đổi'],
    ]],
    ['Chapter 4 — ClickHouse in depth', 'Chương 4 — ClickHouse chuyên sâu', 'Kho phân tích cột nhanh, tự host được trên VPS.', [
      ['mergetree', 'MergeTree, parts and the ORDER BY key', 'MergeTree, part và khoá ORDER BY', 'Khoá sắp xếp là chỉ mục · Part và gộp nền · Chọn ORDER BY theo truy vấn'],
      ['engines', 'ReplacingMergeTree, AggregatingMergeTree and materialized views', 'ReplacingMergeTree, AggregatingMergeTree và materialized view', 'Khử trùng khi gộp (và FINAL) · Tổng hợp trước khi ghi · Bảng đếm theo giờ'],
      ['toi-uu', 'Query optimisation: partitions, skip indexes, projections', 'Tối ưu truy vấn: partition, skip index, projection', 'Đọc EXPLAIN · Partition theo tháng, không theo ngày · Tránh JOIN lớn'],
      ['van-hanh', 'Running ClickHouse on a small server', 'Chạy ClickHouse trên máy chủ nhỏ', 'Giới hạn bộ nhớ · TTL xoá dữ liệu cũ · Sao lưu lên R2 · Không mở cổng ra Internet'],
      ['so-sanh', 'ClickHouse vs BigQuery, Snowflake, Redshift, DuckDB, TimescaleDB', 'ClickHouse so với BigQuery, Snowflake, Redshift, DuckDB, TimescaleDB', 'Tự host vs trả theo truy vấn · Mô hình chi phí · Chọn theo quy mô và đội'],
    ]],
    ['Chapter 5 — Lakes and lakehouses', 'Chương 5 — Data lake và lakehouse', 'Lưu rẻ trên object storage, truy vấn như kho.', [
      ['lake', 'Data lakes on S3/R2: layout and partitioning', 'Data lake trên S3/R2: bố cục và phân vùng', 'Thư mục theo ngày · Quá nhiều file nhỏ · Vùng raw/bronze/silver/gold'],
      ['table-format', 'Open table formats: Apache Iceberg, Delta Lake, Hudi', 'Định dạng bảng mở: Apache Iceberg, Delta Lake, Hudi', 'Giao dịch ACID trên file · Time travel · Tiến hoá schema · Catalog'],
      ['query-engine', 'Query engines on the lake: DuckDB, Trino, Spark', 'Công cụ truy vấn trên lake: DuckDB, Trino, Spark', 'Khi nào cần phân tán · Spark nhập môn (PySpark) · Chi phí egress và vì sao R2 hợp'],
    ]],
    ['Chapter 6 — Transformation with dbt', 'Chương 6 — Biến đổi dữ liệu bằng dbt', 'SQL có phiên bản, có test, có tài liệu.', [
      ['dbt-co-ban', 'dbt basics: models, refs, sources', 'dbt cơ bản: model, ref, source', 'Dự án dbt đầu tiên với ClickHouse/DuckDB/PostgreSQL · DAG tự suy ra · Chạy dbt build'],
      ['materialization', 'Materializations and incremental models', 'Materialization và model tăng dần', 'view, table, incremental, ephemeral · is_incremental() · Chạy lại toàn bộ khi logic đổi'],
      ['test-docs', 'Tests, documentation and lineage', 'Test, tài liệu và lineage', 'unique, not_null, relationships, accepted_values · dbt docs · Đồ thị phụ thuộc'],
      ['macro-package', 'Macros, packages and project structure', 'Macro, package và cấu trúc dự án', 'Jinja · dbt-utils · staging/intermediate/marts · Quy ước đặt tên'],
      ['dbt-ci', 'dbt in CI with GitHub Actions', 'dbt trong CI với GitHub Actions', 'Slim CI chỉ chạy model thay đổi · Chặn merge khi test hỏng · Trỏ github-actions'],
    ]],
    ['Chapter 7 — Orchestration', 'Chương 7 — Điều phối pipeline', 'Chạy đúng thứ tự, đúng giờ, và biết khi nào hỏng.', [
      ['tai-sao', 'Why cron is not enough', 'Vì sao cron không đủ', 'Phụ thuộc giữa bước · Chạy lại một phần · Backfill quá khứ · Nếu đã học background-jobs Ch4: việc định kỳ — ở đây là đồ thị dữ liệu'],
      ['airflow', 'Apache Airflow: DAGs, operators, scheduling', 'Apache Airflow: DAG, operator, lập lịch', 'Viết DAG bằng Python · execution date và bẫy thời gian · Sensor · Chạy bằng Docker'],
      ['dagster', 'Dagster: asset-based orchestration', 'Dagster: điều phối theo tài sản dữ liệu', 'Asset thay vì task · Tích hợp dbt · Partition và backfill · So sánh với Airflow và Prefect'],
      ['van-hanh', 'Retries, alerts and SLAs for pipelines', 'Thử lại, cảnh báo và SLA cho pipeline', 'Idempotent từng bước · Cảnh báo khi dữ liệu trễ · Chạy trên máy nhà hay VPS'],
    ]],
    ['Chapter 8 — Data quality and governance', 'Chương 8 — Chất lượng dữ liệu và quản trị', 'Dữ liệu sai còn tệ hơn không có dữ liệu.', [
      ['kich-thuoc', 'Dimensions of data quality', 'Các chiều của chất lượng dữ liệu', 'Đầy đủ, đúng, kịp thời, nhất quán, duy nhất · Ví dụ Excel 2020 nhìn lại · Đếm hai đầu pipeline'],
      ['kiem-tu-dong', 'Automated checks: dbt tests, Great Expectations, Soda', 'Kiểm tự động: dbt test, Great Expectations, Soda', 'Kiểm schema, khoảng giá trị, độ tươi · Chặn pipeline khi sai · Không làm "kiểm cho có"'],
      ['contract', 'Data contracts and schema evolution', 'Hợp đồng dữ liệu và tiến hoá schema', 'Đổi tên cột ở backend làm vỡ báo cáo · Hợp đồng giữa đội sản phẩm và đội dữ liệu · Bài học thật: đổi tên enum vỡ seed trên production'],
      ['rieng-tu', 'Privacy: PII, anonymisation and access control', 'Quyền riêng tư: dữ liệu cá nhân, ẩn danh hoá và phân quyền', 'Băm/giả danh email · Phân quyền theo cột · Thời hạn lưu · Trỏ privacy-data-law cho Nghị định 13/2023'],
    ]],
    ['Chapter 9 — Dashboards and self-service analytics', 'Chương 9 — Dashboard và phân tích tự phục vụ', 'Đưa số liệu tới người ra quyết định.', [
      ['metabase', 'Metabase: questions, dashboards, alerts', 'Metabase: câu hỏi, dashboard, cảnh báo', 'Tự host bằng Docker · Kết nối ClickHouse/PostgreSQL · Phân quyền nhóm'],
      ['superset', 'Apache Superset for heavier analytics', 'Apache Superset cho phân tích nặng hơn', 'Dataset, chart, SQL Lab · Cache · So sánh với Metabase'],
      ['semantic-layer', 'Metrics and the semantic layer', 'Chỉ số và semantic layer', 'Một định nghĩa "người dùng hoạt động" duy nhất · dbt metrics/MetricFlow · Tránh mỗi dashboard một con số'],
      ['ke-chuyen', 'Designing dashboards people use', 'Thiết kế dashboard người ta dùng', 'Một câu hỏi một biểu đồ · Chọn loại biểu đồ · Chú thích bất thường · Trỏ ux-ui-for-developers'],
    ]],
    ['Chapter 10 — Streaming analytics', 'Chương 10 — Phân tích luồng', 'Số liệu tính trong vài giây.', [
      ['khi-nao', 'When real time is worth it', 'Khi nào thời gian thực đáng tiền', 'Phát hiện gian lận, bảng điều khiển trực tiếp, IoT · Đa số báo cáo không cần · Chi phí vận hành'],
      ['cua-so', 'Windows, late data and watermarks', 'Cửa sổ thời gian, dữ liệu đến trễ và watermark', 'Event time vs processing time · Tumbling/sliding · Trỏ kafka Ch8 (Kafka Streams)'],
      ['cong-cu', 'Tools: Flink, ClickHouse materialized views, RisingWave', 'Công cụ: Flink, materialized view của ClickHouse, RisingWave', 'Streaming SQL · Chọn cái đơn giản nhất chạy được · Dữ liệu cảm biến LabFlow AIoT'],
    ]],
    ['Chapter 11 — Career, interviews and costs', 'Chương 11 — Nghề nghiệp, phỏng vấn và chi phí', 'Làm data engineer ngoài đời.', [
      ['vai-tro', 'Data engineer vs analytics engineer vs data analyst vs ML engineer', 'Data engineer, analytics engineer, data analyst và ML engineer', 'Ai làm gì · Kỹ năng từng vai · Con đường từ backend sang'],
      ['phong-van', 'Interview questions: SQL, modelling, pipelines, system design', 'Câu hỏi phỏng vấn: SQL, mô hình hoá, pipeline, thiết kế hệ thống', 'Window function · Thiết kế star schema tại chỗ · Thiết kế pipeline chịu lỗi'],
      ['chi-phi', 'Controlling data platform costs', 'Kiểm soát chi phí nền tảng dữ liệu', 'Lưu trữ vs tính toán · Truy vấn quét toàn bảng trên dịch vụ trả theo byte · Tự host trên VPS vs cloud'],
      ['chung-chi', 'Certifications worth knowing', 'Chứng chỉ nên biết', 'dbt Analytics Engineering · Google Professional Data Engineer · AWS Data Engineer Associate · Databricks · Kiểm tên và trạng thái hiện hành trước khi thi'],
    ]],
    ['Chapter 12 — Capstone: learning analytics for cuongthai.com', 'Chương 12 — Dự án cuối khoá: phân tích dữ liệu học tập cho cuongthai.com', 'PostgreSQL → CDC/batch → ClickHouse + Parquet trên R2 → dbt → Dagster → Metabase, chạy Docker trên VPS/máy nhà.', [
      ['cau-hoi', 'Business questions and the tracking plan', 'Câu hỏi kinh doanh và kế hoạch tracking', 'Bài nào người học bỏ giữa chừng · Tỉ lệ hoàn thành theo khoá · Phễu từ học thử tới Pro · Thời gian học theo giờ trong ngày'],
      ['pipeline', 'Build the pipeline: ingestion, models, orchestration', 'Dựng pipeline: nạp, mô hình, điều phối', 'CDC từ bảng tiến độ bài học · Star schema học tập · dbt test · Lịch Dagster hằng giờ'],
      ['dashboard', 'Dashboards and alerts', 'Dashboard và cảnh báo', 'Metabase cho admin · Cảnh báo khi tỉ lệ hoàn thành tụt · Ẩn danh hoá người dùng'],
      ['van-hanh', 'Operate: costs, backups, data quality SLAs', 'Vận hành: chi phí, sao lưu, SLA chất lượng dữ liệu', 'Giới hạn RAM cho ClickHouse trên VPS · Sao lưu lên R2 · Báo cáo chất lượng hằng tuần'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án dữ liệu trong phỏng vấn'],
    ]],
  ]),
};
