-- CTW đợt 3A (09/10/2026): ảnh chèn trong trình soạn thảo (Docs, mô tả thẻ, bình luận). Chỉ THÊM bảng mới.
CREATE TABLE "work_doc_images" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "uploader_id" INTEGER,
    "r2_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sha256" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_doc_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_doc_image_project_sha" ON "work_doc_images"("project_id", "sha256");

ALTER TABLE "work_doc_images" ADD CONSTRAINT "work_doc_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
