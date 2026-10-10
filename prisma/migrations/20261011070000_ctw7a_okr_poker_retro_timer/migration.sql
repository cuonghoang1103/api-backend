-- CTW đợt 7a (11/10/2026): OKR (chu kỳ/objective/KR/liên kết/check-in), planning poker, retro board, timer trên thẻ.
-- Viết tay (P3006: migrate dev hỏng trong repo này) — chỉ BẢNG MỚI, không đụng bảng cũ.

-- CreateTable
CREATE TABLE "work_okr_cycles" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "work_okr_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_objectives" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "parent_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "owner_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "score_note" VARCHAR(1000),
    "scored_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_key_results" (
    "id" SERIAL NOT NULL,
    "objective_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "metric" VARCHAR(8) NOT NULL DEFAULT 'NUMBER',
    "unit" VARCHAR(16),
    "start_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "target_value" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "current_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" VARCHAR(8) NOT NULL DEFAULT 'MANUAL',
    "owner_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_key_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_key_result_links" (
    "id" SERIAL NOT NULL,
    "key_result_id" INTEGER NOT NULL,
    "kind" VARCHAR(8) NOT NULL,
    "issue_id" INTEGER,
    "sprint_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_key_result_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_okr_checkins" (
    "id" SERIAL NOT NULL,
    "key_result_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "week_start" DATE NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "confidence" INTEGER NOT NULL,
    "note" VARCHAR(2000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_okr_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_poker_sessions" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "deck" VARCHAR(10) NOT NULL DEFAULT 'FIBONACCI',
    "sprint_id" INTEGER,
    "status" VARCHAR(8) NOT NULL DEFAULT 'OPEN',
    "current_item_id" INTEGER,
    "timer_ends_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "work_poker_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_poker_items" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "state" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "round" INTEGER NOT NULL DEFAULT 1,
    "final_value" VARCHAR(8),
    "final_points" DOUBLE PRECISION,
    "previous_points" DOUBLE PRECISION,
    "estimated_by_id" INTEGER,
    "estimated_at" TIMESTAMP(3),
    "revealed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_poker_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_poker_votes" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "value" VARCHAR(8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_poker_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_retros" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "template" VARCHAR(8) NOT NULL DEFAULT 'SSC',
    "sprint_id" INTEGER,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "votes_per_person" INTEGER NOT NULL DEFAULT 5,
    "lock_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),
    "summary" TEXT,
    "summary_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_retros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_retro_cards" (
    "id" SERIAL NOT NULL,
    "retro_id" INTEGER NOT NULL,
    "column" VARCHAR(16) NOT NULL,
    "body" VARCHAR(1000) NOT NULL,
    "author_id" INTEGER NOT NULL,
    "group_id" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_retro_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_retro_votes" (
    "id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "work_retro_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_retro_actions" (
    "id" SERIAL NOT NULL,
    "retro_id" INTEGER NOT NULL,
    "card_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "assignee_id" INTEGER,
    "issue_id" INTEGER,
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_retro_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_timers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "running_since" TIMESTAMP(3),
    "accumulated_sec" INTEGER NOT NULL DEFAULT 0,
    "activity" VARCHAR(16),
    "note" VARCHAR(1000),
    "reminded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_timers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_okr_cycle_ws" ON "work_okr_cycles"("workspace_id", "start_date");

-- CreateIndex
CREATE INDEX "idx_work_objective_cycle" ON "work_objectives"("cycle_id", "project_id");

-- CreateIndex
CREATE INDEX "idx_work_kr_objective" ON "work_key_results"("objective_id");

-- CreateIndex
CREATE INDEX "idx_work_kr_link_kr" ON "work_key_result_links"("key_result_id");

-- CreateIndex
CREATE INDEX "idx_work_kr_link_issue" ON "work_key_result_links"("issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_okr_checkin_week" ON "work_okr_checkins"("key_result_id", "week_start");

-- CreateIndex
CREATE INDEX "idx_work_poker_project" ON "work_poker_sessions"("project_id", "status");

-- CreateIndex
CREATE INDEX "idx_work_poker_item_issue" ON "work_poker_items"("issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_poker_item" ON "work_poker_items"("session_id", "issue_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_poker_vote" ON "work_poker_votes"("item_id", "round", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_retro_project" ON "work_retros"("project_id");

-- CreateIndex
CREATE INDEX "idx_work_retro_card_retro" ON "work_retro_cards"("retro_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_retro_vote" ON "work_retro_votes"("card_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_work_retro_action_retro" ON "work_retro_actions"("retro_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_timer_user" ON "work_timers"("user_id");

-- CreateIndex
CREATE INDEX "idx_work_timer_issue" ON "work_timers"("issue_id");

-- AddForeignKey
ALTER TABLE "work_okr_cycles" ADD CONSTRAINT "work_okr_cycles_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "work_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_objectives" ADD CONSTRAINT "work_objectives_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "work_okr_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_objectives" ADD CONSTRAINT "work_objectives_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_objectives" ADD CONSTRAINT "work_objectives_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_objectives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_key_results" ADD CONSTRAINT "work_key_results_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "work_objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_key_result_links" ADD CONSTRAINT "work_key_result_links_key_result_id_fkey" FOREIGN KEY ("key_result_id") REFERENCES "work_key_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_key_result_links" ADD CONSTRAINT "work_key_result_links_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_okr_checkins" ADD CONSTRAINT "work_okr_checkins_key_result_id_fkey" FOREIGN KEY ("key_result_id") REFERENCES "work_key_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_poker_sessions" ADD CONSTRAINT "work_poker_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_poker_items" ADD CONSTRAINT "work_poker_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "work_poker_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_poker_items" ADD CONSTRAINT "work_poker_items_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_poker_votes" ADD CONSTRAINT "work_poker_votes_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "work_poker_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_retros" ADD CONSTRAINT "work_retros_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_retro_cards" ADD CONSTRAINT "work_retro_cards_retro_id_fkey" FOREIGN KEY ("retro_id") REFERENCES "work_retros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_retro_cards" ADD CONSTRAINT "work_retro_cards_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "work_retro_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_retro_votes" ADD CONSTRAINT "work_retro_votes_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "work_retro_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_retro_actions" ADD CONSTRAINT "work_retro_actions_retro_id_fkey" FOREIGN KEY ("retro_id") REFERENCES "work_retros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_timers" ADD CONSTRAINT "work_timers_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "work_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
