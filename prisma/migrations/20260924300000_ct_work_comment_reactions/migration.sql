-- CT Work: cảm xúc trên bình luận (👍 🎉 …). Bật/tắt, mỗi người một lần mỗi emoji.

-- CreateTable
CREATE TABLE "work_comment_reactions" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_work_comment_reaction_user" ON "work_comment_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_comment_reaction" ON "work_comment_reactions"("comment_id", "user_id", "emoji");

-- AddForeignKey
ALTER TABLE "work_comment_reactions" ADD CONSTRAINT "work_comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "work_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_comment_reactions" ADD CONSTRAINT "work_comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
