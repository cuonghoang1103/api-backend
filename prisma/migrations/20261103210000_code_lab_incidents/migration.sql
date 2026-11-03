-- Code Lab — "Sự cố & Lỗi" (03/11/2026). CHỈ THÊM, không phá:
--   * code_lab_incidents          — người học chia sẻ sự cố/lỗi (bối cảnh, log lỗi,
--                                    cách khắc phục, tag, ảnh R2) + liên kết track tuỳ chọn.
--   * code_lab_incident_comments  — bình luận của người khác.
-- Viết tay + `npx prisma migrate deploy` (CLAUDE.md: `migrate dev` hỏng P3006 ở repo này).

CREATE TABLE "code_lab_incidents" (
    "id"         SERIAL NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "track_id"   INTEGER,
    "title"      VARCHAR(200) NOT NULL,
    "context"    TEXT NOT NULL,
    "error_text" TEXT,
    "solution"   TEXT,
    "tags"       TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_keys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status"     VARCHAR(12) NOT NULL DEFAULT 'OPEN',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_lab_incidents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_cl_incident_recent" ON "code_lab_incidents"("status", "created_at" DESC);
CREATE INDEX "idx_cl_incident_user" ON "code_lab_incidents"("user_id", "created_at" DESC);
CREATE INDEX "idx_cl_incident_track" ON "code_lab_incidents"("track_id");

CREATE TABLE "code_lab_incident_comments" (
    "id"          SERIAL NOT NULL,
    "incident_id" INTEGER NOT NULL,
    "user_id"     INTEGER NOT NULL,
    "body"        TEXT NOT NULL,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_lab_incident_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_cl_incident_comment" ON "code_lab_incident_comments"("incident_id", "created_at");

ALTER TABLE "code_lab_incidents"
  ADD CONSTRAINT "code_lab_incidents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_lab_incidents"
  ADD CONSTRAINT "code_lab_incidents_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "code_tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "code_lab_incident_comments"
  ADD CONSTRAINT "code_lab_incident_comments_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "code_lab_incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "code_lab_incident_comments"
  ADD CONSTRAINT "code_lab_incident_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
