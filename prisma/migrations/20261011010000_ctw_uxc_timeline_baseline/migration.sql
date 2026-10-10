-- UX-C (11/10/2026): baseline của Timeline (C5) — chụp ngày bắt đầu/hạn của các thẻ để so kế hoạch gốc với hiện tại.
CREATE TABLE "work_timeline_baselines" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "note" VARCHAR(500),
    "items" JSONB NOT NULL,
    "item_count" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_timeline_baselines_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_work_tl_baseline_project" ON "work_timeline_baselines"("project_id", "created_at");

ALTER TABLE "work_timeline_baselines" ADD CONSTRAINT "work_timeline_baselines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
