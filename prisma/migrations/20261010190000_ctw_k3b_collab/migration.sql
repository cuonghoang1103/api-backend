-- CTW K-3b (10/10/2026): đồng soạn thảo realtime cho Docs (Yjs) + bình luận gắn đoạn văn.
-- Viết tay (migrate dev vỡ ở shadow DB — xem CLAUDE.md). Chỉ THÊM: 2 bảng mới, chỉ mục, FK.

CREATE TABLE "work_page_collab" (
    "page_id" INTEGER NOT NULL,
    "state" BYTEA,
    "state_vector" BYTEA,
    "byte_size" INTEGER NOT NULL DEFAULT 0,
    "update_count" INTEGER NOT NULL DEFAULT 0,
    "content_hash" VARCHAR(64),
    "client_users" JSONB,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "last_snapshot_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_page_collab_pkey" PRIMARY KEY ("page_id")
);

CREATE TABLE "work_page_anchors" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "anchor_id" VARCHAR(40) NOT NULL,
    "quote" VARCHAR(500) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_page_anchors_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "work_page_anchors_comment_id_key" ON "work_page_anchors"("comment_id");
CREATE UNIQUE INDEX "uk_work_page_anchor" ON "work_page_anchors"("page_id", "anchor_id");

ALTER TABLE "work_page_collab" ADD CONSTRAINT "work_page_collab_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_page_anchors" ADD CONSTRAINT "work_page_anchors_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "work_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "work_page_anchors" ADD CONSTRAINT "work_page_anchors_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "work_page_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
