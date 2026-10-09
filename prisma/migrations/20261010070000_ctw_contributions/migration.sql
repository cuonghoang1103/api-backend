-- CTW Đóng góp (10/10/2026): đóng góp & hiệu suất thành viên — A26 (commit/PR đủ + dòng thêm/xoá), A27 (đánh giá chéo).
-- CHỈ THÊM: 4 bảng mới, không đổi bảng cũ. Viết tay (migrate dev vấp P3006 ở repo này) — áp bằng `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "work_dev_contributions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "provider" VARCHAR(8) NOT NULL,
    "kind" VARCHAR(8) NOT NULL,
    "external_id" VARCHAR(200) NOT NULL,
    "repo" VARCHAR(200),
    "title" VARCHAR(300),
    "url" VARCHAR(500),
    "state" VARCHAR(16),
    "author_login" VARCHAR(100),
    "author_name" VARCHAR(100),
    "author_email" VARCHAR(200),
    "additions" INTEGER,
    "deletions" INTEGER,
    "files_changed" INTEGER,
    "issue_numbers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_dev_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_git_identities" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "identity" VARCHAR(200) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_git_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_peer_rounds" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "scope" VARCHAR(12) NOT NULL DEFAULT 'CUSTOM',
    "sprint_id" INTEGER,
    "stage_id" INTEGER,
    "status" VARCHAR(12) NOT NULL DEFAULT 'OPEN',
    "criteria" JSONB NOT NULL DEFAULT '[]',
    "closes_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_peer_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_peer_reviews" (
    "id" SERIAL NOT NULL,
    "round_id" INTEGER NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "reviewee_id" INTEGER NOT NULL,
    "scores" JSONB NOT NULL DEFAULT '{}',
    "comment" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_peer_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_dev_contribution_project" ON "work_dev_contributions"("project_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_dev_contribution" ON "work_dev_contributions"("project_id", "kind", "external_id");

-- CreateIndex
CREATE INDEX "idx_work_git_identity_user" ON "work_git_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_git_identity" ON "work_git_identities"("project_id", "identity");

-- CreateIndex
CREATE INDEX "idx_work_peer_round_project" ON "work_peer_rounds"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_work_peer_review_reviewee" ON "work_peer_reviews"("round_id", "reviewee_id");

-- CreateIndex
CREATE INDEX "idx_work_peer_review_reviewer" ON "work_peer_reviews"("reviewer_id");

-- CreateIndex
CREATE INDEX "idx_work_peer_review_reviewee_user" ON "work_peer_reviews"("reviewee_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_peer_review" ON "work_peer_reviews"("round_id", "reviewer_id", "reviewee_id");

-- AddForeignKey
ALTER TABLE "work_dev_contributions" ADD CONSTRAINT "work_dev_contributions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_git_identities" ADD CONSTRAINT "work_git_identities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_git_identities" ADD CONSTRAINT "work_git_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_peer_rounds" ADD CONSTRAINT "work_peer_rounds_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_peer_reviews" ADD CONSTRAINT "work_peer_reviews_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "work_peer_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_peer_reviews" ADD CONSTRAINT "work_peer_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_peer_reviews" ADD CONSTRAINT "work_peer_reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
