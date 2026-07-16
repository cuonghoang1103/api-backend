-- Migration: add_lang_practice
-- Adds the Practice (Duolingo-style) gamification: per-user/per-language game
-- state (XP, streak, daily goal, hearts, reminder pref) + per-lesson crown
-- progress. Fully additive (2 new tables only). No existing table is modified.

-- CreateTable
CREATE TABLE "lang_game_states" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_practice_date" TIMESTAMP(3),
    "daily_goal_xp" INTEGER NOT NULL DEFAULT 30,
    "daily_xp" INTEGER NOT NULL DEFAULT 0,
    "daily_xp_date" VARCHAR(10),
    "weekly_xp" INTEGER NOT NULL DEFAULT 0,
    "week_key" VARCHAR(10),
    "hearts" INTEGER NOT NULL DEFAULT 5,
    "hearts_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminder_enabled" BOOLEAN NOT NULL DEFAULT false,
    "reminder_hour" INTEGER NOT NULL DEFAULT 20,
    "last_reminder_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_game_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lang_lesson_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "lesson_key" VARCHAR(80) NOT NULL,
    "crown" INTEGER NOT NULL DEFAULT 0,
    "best_score" INTEGER NOT NULL DEFAULT 0,
    "times_completed" INTEGER NOT NULL DEFAULT 0,
    "last_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lang_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_game_user_lang" ON "lang_game_states"("user_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_lang_lesson_user_key" ON "lang_lesson_progress"("user_id", "lesson_key");

-- CreateIndex
CREATE INDEX "idx_lang_lesson_user_lang" ON "lang_lesson_progress"("user_id", "language_id");

-- AddForeignKey
ALTER TABLE "lang_game_states" ADD CONSTRAINT "lang_game_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_game_states" ADD CONSTRAINT "lang_game_states_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_lesson_progress" ADD CONSTRAINT "lang_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lang_lesson_progress" ADD CONSTRAINT "lang_lesson_progress_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
