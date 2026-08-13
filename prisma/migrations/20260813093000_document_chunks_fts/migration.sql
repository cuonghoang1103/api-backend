-- Tìm kiếm toàn văn cho kho kiến thức (`document_chunks`).
--
-- Vì sao TỪ VỰNG chứ không phải VECTOR: pgvector KHÔNG được cài — đo
-- 13/08/2026, `pg_extension` không có 'vector', và cột `embedding` là `jsonb`
-- chứ không phải `vector(768)` như comment trong schema gợi ý. Ảnh Postgres
-- của prod cũng không có (xem ghi chú đầu `interview/knowledge/retrieval.ts`).
-- Đợi pgvector là đợi một thứ chưa có lịch; tìm theo từ chạy được ngay.
--
-- Config 'simple' chứ không phải 'english': nó chỉ hạ chữ thường và tách
-- khoảng trắng, KHÔNG cắt gốc từ. Đúng thứ cần cho tiếng Việt — 'english' sẽ
-- cắt "nhạc" thành gốc tiếng Anh vô nghĩa và làm hỏng phép khớp.

CREATE INDEX "idx_document_chunks_fts"
    ON "document_chunks"
    USING GIN (to_tsvector('simple', "content"));

-- Lọc theo kho trước rồi mới xếp hạng: mỗi robot chỉ đọc kho của dự án mình.
CREATE INDEX "idx_document_chunks_type_doc"
    ON "document_chunks"("document_type", "document_id");
