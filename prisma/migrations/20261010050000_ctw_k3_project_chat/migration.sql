-- CTW K-3 (10/10/2026): KÊNH CHAT DỰ ÁN — kênh, thành viên/trạng thái đọc/tắt tiếng, tin nhắn, cảm xúc, tệp/voice note,
-- cài đặt chat theo người. Viết tay (migrate dev vỡ ở shadow DB — xem CLAUDE.md), áp bằng `npx prisma migrate deploy`.
-- CHỈ THÊM: 6 bảng mới + chỉ mục + khoá ngoại. Không sửa/xoá gì đang có. Không khoá ngoại nào trỏ vào work_issues.
-- Xoá dự án ⇒ kênh ⇒ tin/tệp/thành viên theo dây chuyền. Hai khoá ngoại SET NULL nằm TRONG cùng cây xoá (tin → gốc luồng,
-- tệp → tin) là DEFERRABLE INITIALLY DEFERRED: một dòng bị chạm hai lần trong một lệnh xoá dây chuyền không làm vỡ.

-- CreateTable
CREATE TABLE "work_channels" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "topic" VARCHAR(250),
    "kind" VARCHAR(12) NOT NULL DEFAULT 'PUBLIC',
    "is_general" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" INTEGER,
    "call_url" VARCHAR(500),
    "call_started_at" TIMESTAMP(3),
    "last_message_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_channel_members" (
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "last_read_id" INTEGER NOT NULL DEFAULT 0,
    "last_read_at" TIMESTAMP(3),
    "muted_until" TIMESTAMP(3),
    "notify" VARCHAR(12) NOT NULL DEFAULT 'DEFAULT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_channel_members_pkey" PRIMARY KEY ("channel_id","user_id")
);

-- CreateTable
CREATE TABLE "work_channel_messages" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "kind" VARCHAR(12) NOT NULL DEFAULT 'USER',
    "body" TEXT NOT NULL,
    "parent_id" INTEGER,
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "last_reply_at" TIMESTAMP(3),
    "mentions" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "refs" JSONB,
    "meta" JSONB,
    "pinned_at" TIMESTAMP(3),
    "pinned_by_id" INTEGER,
    "client_key" VARCHAR(64),
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_channel_reactions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_channel_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_channel_files" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "message_id" INTEGER,
    "uploader_id" INTEGER,
    "r2_key" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "duration_ms" INTEGER,
    "transcript_status" VARCHAR(12),
    "transcript" TEXT,
    "language" VARCHAR(12),
    "transcribed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_channel_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_chat_prefs" (
    "user_id" INTEGER NOT NULL,
    "muted_until" TIMESTAMP(3),
    "notify" VARCHAR(12) NOT NULL DEFAULT 'ALL',
    "sound" BOOLEAN NOT NULL DEFAULT true,
    "desktop" BOOLEAN NOT NULL DEFAULT true,
    "email_digest" BOOLEAN NOT NULL DEFAULT false,
    "last_digest_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_chat_prefs_pkey" PRIMARY KEY ("user_id")
);


-- CreateIndex
CREATE INDEX "idx_work_channel_project" ON "work_channels"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_channel_name" ON "work_channels"("project_id", "name");

-- CreateIndex
CREATE INDEX "idx_work_channel_member_user" ON "work_channel_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_work_channel_message_channel" ON "work_channel_messages"("channel_id", "id");

-- CreateIndex
CREATE INDEX "idx_work_channel_message_parent" ON "work_channel_messages"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_channel_message_client_key" ON "work_channel_messages"("author_id", "client_key");

-- CreateIndex
CREATE UNIQUE INDEX "uk_work_channel_reaction" ON "work_channel_reactions"("message_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX "idx_work_channel_file_channel" ON "work_channel_files"("channel_id");

-- CreateIndex
CREATE INDEX "idx_work_channel_file_message" ON "work_channel_files"("message_id");

-- CreateIndex
CREATE INDEX "idx_work_channel_file_stt" ON "work_channel_files"("transcript_status", "transcribed_at");

-- AddForeignKey
ALTER TABLE "work_channels" ADD CONSTRAINT "work_channels_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "work_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channels" ADD CONSTRAINT "work_channels_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_members" ADD CONSTRAINT "work_channel_members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "work_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_members" ADD CONSTRAINT "work_channel_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_messages" ADD CONSTRAINT "work_channel_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "work_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_messages" ADD CONSTRAINT "work_channel_messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_messages" ADD CONSTRAINT "work_channel_messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "work_channel_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_channel_reactions" ADD CONSTRAINT "work_channel_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "work_channel_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_reactions" ADD CONSTRAINT "work_channel_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_files" ADD CONSTRAINT "work_channel_files_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "work_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_channel_files" ADD CONSTRAINT "work_channel_files_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "work_channel_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;

-- AddForeignKey
ALTER TABLE "work_channel_files" ADD CONSTRAINT "work_channel_files_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_chat_prefs" ADD CONSTRAINT "work_chat_prefs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
