-- ============================================================
-- TÌM KIẾM NGỮ NGHĨA THẬT cho kho kiến thức của trợ lý
-- ============================================================
--
-- ⚠️ TRƯỚC MIGRATION NÀY, PHẦN TRA CỨU KHÔNG TÌM THEO ĐỘ LIÊN QUAN.
-- `getRAGContext` chạy:
--
--     findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
--
-- tức lấy 20 mẩu MỚI NHẤT rồi mới xếp hạng trong số đó. Kho đang có đúng
-- 64 mẩu nên 20/64 là một phần ba corpus — nó chạy được NHỜ MAY MẮN. Thêm
-- vài trăm mẩu bài học vào là 20 mẩu mới nhất toàn bài học, và mọi câu hỏi
-- về website/tiểu sử mất hẳn đường vào.
--
-- pgvector 0.8.6 đã cài sẵn trên production từ trước nhưng KHÔNG AI DÙNG:
-- vector nằm trong cột `jsonb`, mà jsonb thì Postgres không so được khoảng
-- cách. Migration này dựng cột vector thật + chỉ mục, và backfill từ jsonb
-- nên không mất mẩu nào.
--
-- 384 chiều, KHÔNG phải 768: embedding sinh tại chỗ bằng ONNX
-- `Xenova/all-MiniLM-L6-v2` (xem `aiProviders.ts`). Chú thích cũ trong
-- schema.prisma ghi 768 là DI SẢN, đã đo thật trên prod: 384/384 ở cả 64 mẩu.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE document_chunks
  ADD COLUMN IF NOT EXISTS embedding_vec vector(384);

-- Backfill từ jsonb. `::text::vector` là đường duy nhất: jsonb không ép
-- thẳng sang vector được, mà chuỗi JSON "[0.1,0.2,...]" thì trùng đúng cú
-- pháp literal của vector.
UPDATE document_chunks
   SET embedding_vec = embedding::text::vector
 WHERE embedding IS NOT NULL
   AND embedding_vec IS NULL
   AND jsonb_array_length(embedding) = 384;

-- HNSW chứ không IVFFlat: IVFFlat đòi phải có sẵn dữ liệu lúc tạo chỉ mục
-- để phân cụm, và chất lượng tụt khi kho lớn dần sau đó. HNSW dựng tăng
-- dần, thêm mẩu mới không phải dựng lại.
-- `vector_cosine_ops` để khớp với phép đo trong mã (cosine).
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw
    ON document_chunks USING hnsw (embedding_vec vector_cosine_ops);
