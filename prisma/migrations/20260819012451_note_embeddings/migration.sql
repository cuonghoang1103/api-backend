-- Nhúng vector cho Trợ lý ghi chú.
--
-- Viết TAY và áp bằng `prisma migrate deploy`, không phải `migrate dev`:
-- shadow database của repo này không replay được (P3006, xem CLAUDE.md).

CREATE EXTENSION IF NOT EXISTS vector;

-- Một ghi chú cắt thành nhiều mẩu. Cắt vì hai lý do:
--  • bge-m3 nhận tối đa 8192 token, ghi chú dài hơn thế là bị cắt cụt âm thầm;
--  • một mẩu ~1200 ký tự cho vector "đặc" hơn hẳn cả bài dài, nên tìm trúng hơn.
CREATE TABLE IF NOT EXISTS note_embeddings (
  id          BIGSERIAL PRIMARY KEY,
  note_id     INTEGER      NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  chunk_index INTEGER      NOT NULL,
  content     TEXT         NOT NULL,
  embedding   vector(1024) NOT NULL,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT uk_note_embedding_chunk UNIQUE (note_id, chunk_index)
);

-- ON DELETE CASCADE ở trên là cố ý: xoá hẳn ghi chú thì vector phải đi theo.
-- Không có nó, trợ lý sẽ trích dẫn một ghi chú không còn tồn tại.

CREATE INDEX IF NOT EXISTS idx_note_embeddings_note ON note_embeddings(note_id);

-- HNSW cho tìm theo cosine. Chọn HNSW chứ không IVFFlat vì IVFFlat phải HỌC
-- danh sách phân cụm từ dữ liệu đã có — dựng index lúc bảng còn rỗng thì nó
-- gần như vô dụng, và đây đúng là tình huống của một tính năng mới.
CREATE INDEX IF NOT EXISTS idx_note_embeddings_vec
  ON note_embeddings USING hnsw (embedding vector_cosine_ops);
