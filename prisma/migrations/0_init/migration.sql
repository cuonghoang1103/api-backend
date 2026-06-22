-- CreateEnum
CREATE TYPE "CyberTaskType" AS ENUM ('TASK', 'STUDY', 'ROUTINE');

-- CreateEnum
CREATE TYPE "github_repo_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "ai_config" (
    "id" SERIAL NOT NULL,
    "configKey" VARCHAR(100) NOT NULL,
    "config_value" TEXT,
    "description" VARCHAR(500),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "ai_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompts" (
    "id" SERIAL NOT NULL,
    "promptKey" VARCHAR(100) NOT NULL,
    "prompt_template" TEXT NOT NULL,
    "description" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "submission_url" VARCHAR(500) NOT NULL,
    "notes" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    "grade" DOUBLE PRECISION,
    "feedback" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "instructions" TEXT,
    "deadline" TIMESTAMP(6),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "max_score" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" SERIAL NOT NULL,
    "certificateNumber" VARCHAR(64) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "enrollment_id" INTEGER,
    "issued_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_analytics" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(100) NOT NULL,
    "date" DATE NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "avg_response_time_ms" INTEGER NOT NULL DEFAULT 0,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_feedback" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "feedback_type" VARCHAR(20) NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "token_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER,
    "title" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER,
    "user_id" INTEGER,
    "user_name" VARCHAR(100) NOT NULL,
    "user_avatar" VARCHAR(255),
    "comment_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500),
    "message" TEXT NOT NULL,
    "ip_address" VARCHAR(45),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(50),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "course_id" INTEGER NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_documents" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_size_bytes" BIGINT NOT NULL DEFAULT 0,
    "file_type" VARCHAR(50),
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_orders" (
    "id" SERIAL NOT NULL,
    "orderCode" VARCHAR(80) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "payment_method" VARCHAR(30) NOT NULL DEFAULT 'VNPAY',
    "payment_txn_no" VARCHAR(50),
    "payment_bank_code" VARCHAR(30),
    "payment_pay_date" TIMESTAMP(3),
    "enrolled" BOOLEAN NOT NULL DEFAULT false,
    "idempotency_key" VARCHAR(64),
    "discount_code" VARCHAR(50),
    "discount_code_id" INTEGER,
    "original_amount" DECIMAL(10,2),
    "refund_amount" DECIMAL(10,2),
    "refund_reason" VARCHAR(500),
    "refunded_at" TIMESTAMP(3),
    "refunded_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_reviews" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_sections" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tags" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "tag" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "instructor_id" INTEGER,
    "semester_id" INTEGER,
    "course_code" VARCHAR(50),
    "academy_type" VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(500),
    "description" TEXT,
    "thumbnail_url" VARCHAR(500),
    "preview_video_url" VARCHAR(500),
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_price" DECIMAL(10,2),
    "discount_expires_at" TIMESTAMP(3),
    "level" VARCHAR(20) NOT NULL DEFAULT 'BEGINNER',
    "language" VARCHAR(20) NOT NULL DEFAULT 'Vietnamese',
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "total_duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "total_lessons" INTEGER NOT NULL DEFAULT 0,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "requirements" TEXT,
    "what_you_learn" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "access_type" VARCHAR(10) NOT NULL DEFAULT 'FREE',
    "end_date" TIMESTAMP(3),
    "enrollment_duration_days" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cyber_inventories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "point_balance" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cyber_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cyber_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "current_exp" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cyber_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cyber_tasks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "CyberTaskType" NOT NULL DEFAULT 'TASK',
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "exp_reward" INTEGER NOT NULL DEFAULT 10,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cyber_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_celebrations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "celebrated_date" VARCHAR(10) NOT NULL,
    "exp_awarded" INTEGER NOT NULL DEFAULT 0,
    "tasks_done" INTEGER NOT NULL DEFAULT 0,
    "tasks_total" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_celebrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_states" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "timeline" TEXT NOT NULL DEFAULT '[]',
    "last_celebrated_at" TIMESTAMP(3),
    "tomorrow_plan_locked_date" TIMESTAMP(3),
    "total_exp" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_tasks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scope" VARCHAR(16) NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "exp" INTEGER NOT NULL DEFAULT 25,
    "activity_type" VARCHAR(32),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "dashboard_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dev_posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "source_url" VARCHAR(555),
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "category" VARCHAR(100) NOT NULL DEFAULT 'General',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dev_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "discount_type" VARCHAR(20) NOT NULL DEFAULT 'PERCENT',
    "discountValue" DECIMAL(10,2) NOT NULL,
    "min_order_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "max_discount_amount" DECIMAL(10,2),
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "embedding" JSONB,
    "chunk_index" INTEGER NOT NULL,
    "document_id" VARCHAR(100) NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "progress_percent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "last_lesson_id" INTEGER,
    "last_accessed_at" TIMESTAMP(3),
    "course_code_id" INTEGER,
    "source" VARCHAR(20) NOT NULL DEFAULT 'FREE',

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_collections" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "icon" VARCHAR(8),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_saved_posts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_saved_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_attachments" (
    "id" SERIAL NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "stored_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "content_type" VARCHAR(100) NOT NULL,
    "file_size" BIGINT NOT NULL,
    "uploaded_by" INTEGER,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_category" VARCHAR(50),

    CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_repo_tags" (
    "repo_id" UUID NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "pk_github_repo_tags" PRIMARY KEY ("repo_id","tag_id")
);

-- CreateTable
CREATE TABLE "github_repos" (
    "id" UUID NOT NULL,
    "repo_name" VARCHAR(200) NOT NULL,
    "owner" VARCHAR(100) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "language" VARCHAR(50),
    "description" TEXT,
    "myReview" TEXT NOT NULL,
    "status" "github_repo_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_repos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hub_files" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "key" VARCHAR(500) NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "public_slug" VARCHAR(32),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hub_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hub_folders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hub_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hub_links" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER,
    "url" VARCHAR(2000) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "thumbnail_url" VARCHAR(2000),
    "favicon_url" VARCHAR(500),
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'unread',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "public_slug" VARCHAR(32),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hub_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_details" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "video_platform" VARCHAR(30) NOT NULL DEFAULT 'EMBED',
    "video_url" VARCHAR(500),
    "source_code_url" VARCHAR(500),
    "teaching_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" SERIAL NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "watch_time_seconds" INTEGER NOT NULL DEFAULT 0,
    "last_position_seconds" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "description" TEXT,
    "content" TEXT,
    "lesson_type" VARCHAR(20) NOT NULL DEFAULT 'VIDEO',
    "video_url" VARCHAR(500),
    "video_duration_seconds" INTEGER NOT NULL DEFAULT 0,
    "thumbnail_url" VARCHAR(500),
    "is_free_preview" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size" BIGINT NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reactions" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_threads" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "user_id" INTEGER,
    "admin_user_id" INTEGER,
    "user_a_id" INTEGER,
    "user_b_id" INTEGER,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "recalled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_playlist_tracks" (
    "id" SERIAL NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_playlists" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cover_url" VARCHAR(700),
    "user_id" INTEGER,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_tracks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "artist" VARCHAR(255) NOT NULL,
    "audio_url" VARCHAR(700),
    "cover_image" VARCHAR(700),
    "duration_seconds" INTEGER,
    "file_size" BIGINT,
    "public_id" VARCHAR(500),
    "cloudinary_url" VARCHAR(700),
    "supabase_path" VARCHAR(500),
    "local_path" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "music_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" SERIAL NOT NULL,
    "order_code" VARCHAR(80) NOT NULL,
    "gateway_txn_no" VARCHAR(50),
    "bank_code" VARCHAR(30),
    "pay_date" TIMESTAMP(3),
    "response_code" VARCHAR(10),
    "amount" DECIMAL(10,2) NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER,
    "user_id" INTEGER,
    "user_name" VARCHAR(100) NOT NULL,
    "user_avatar" VARCHAR(255),
    "comment_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "pk_post_tags" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "category_id" INTEGER,
    "author_id" INTEGER,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "source_url" VARCHAR(555),
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "short_description" VARCHAR(500),
    "thumbnail_url" VARCHAR(500),
    "images" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "original_price" DECIMAL(10,2),
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_hot" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER,
    "type" VARCHAR(20) NOT NULL DEFAULT 'DIGITAL',
    "file_url" VARCHAR(500),
    "specs" JSONB NOT NULL DEFAULT '{}',
    "guidance" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_skills" (
    "projectId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "pk_project_skills" PRIMARY KEY ("projectId","skillId")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "thumbnail_url" VARCHAR(500),
    "images" TEXT,
    "project_url" VARCHAR(500),
    "video_url" VARCHAR(500),
    "github_url" VARCHAR(500),
    "tech_stack" TEXT,
    "role" VARCHAR(100),
    "duration" VARCHAR(100),
    "status" VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_slug" VARCHAR(255),
    "product_image" VARCHAR(500),
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total" DECIMAL(10,2) NOT NULL,
    "file_url" VARCHAR(500),
    "credentials" TEXT,

    CONSTRAINT "shop_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_orders" (
    "id" SERIAL NOT NULL,
    "orderCode" VARCHAR(50) NOT NULL,
    "user_id" INTEGER,
    "buyer_name" VARCHAR(255) NOT NULL,
    "buyer_email" VARCHAR(255) NOT NULL,
    "buyer_phone" VARCHAR(50),
    "buyer_address" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_code" VARCHAR(50),
    "total" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL DEFAULT 'SIMULATED',
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "payment_id" VARCHAR(100),
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "proficiency" INTEGER NOT NULL DEFAULT 3,
    "description" TEXT,
    "years_experience" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_comment_likes" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "replies_count" INTEGER NOT NULL DEFAULT 0,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mentions" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "social_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_likes" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(16) NOT NULL DEFAULT 'LIKE',

    CONSTRAINT "social_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "url" VARCHAR(700) NOT NULL,
    "thumbnail" VARCHAR(700),
    "width" INTEGER,
    "height" INTEGER,
    "duration_seconds" INTEGER,
    "file_size" BIGINT,
    "mime_type" VARCHAR(100),
    "alt" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_name" VARCHAR(255),

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_notifications" (
    "id" SERIAL NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "entity_id" INTEGER,
    "secondary_entity_id" INTEGER,
    "payload" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_poll_options" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "votes_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_poll_votes" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_polls" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "multi_choice" BOOLEAN NOT NULL DEFAULT false,
    "closes_at" TIMESTAMP(3),
    "total_votes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_posts" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    "status" VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location_name" VARCHAR(255),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "youtube_url" VARCHAR(500),

    CONSTRAINT "social_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_saves" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_shares" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_trend_articles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "cover_emoji" VARCHAR(16),
    "cover_image_url" VARCHAR(500),
    "code_block" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "trending_score" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "read_time_min" INTEGER NOT NULL DEFAULT 5,
    "author_id" INTEGER,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tech_trend_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_nicknames" (
    "id" SERIAL NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "target_id" INTEGER NOT NULL,
    "alias" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thread_nicknames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_reports" (
    "id" SERIAL NOT NULL,
    "reporter_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "reason" VARCHAR(200) NOT NULL,
    "category" VARCHAR(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" INTEGER,
    "resolution" VARCHAR(500),

    CONSTRAINT "thread_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_blocks" (
    "id" SERIAL NOT NULL,
    "blocker_id" INTEGER NOT NULL,
    "blocked_id" INTEGER NOT NULL,
    "reason" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "pk_user_roles" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255),
    "email" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(100),
    "bio" TEXT,
    "avatar_url" VARCHAR(500),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "account_non_expired" BOOLEAN NOT NULL DEFAULT true,
    "account_non_locked" BOOLEAN NOT NULL DEFAULT true,
    "credentials_non_expired" BOOLEAN NOT NULL DEFAULT true,
    "provider" VARCHAR(50),
    "provider_id" VARCHAR(255),
    "role_version" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "allow_messages_from_strangers" BOOLEAN NOT NULL DEFAULT true,
    "birth_year" INTEGER,
    "cover_photo_url" VARCHAR(500),
    "display_name" VARCHAR(100),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "gender" VARCHAR(20),
    "last_active_at" TIMESTAMP(3),
    "last_failed_login_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "last_login_ip" VARCHAR(64),
    "last_login_user_agent" VARCHAR(500),
    "lockout_until" TIMESTAMP(3),
    "phone" VARCHAR(20),
    "social_links" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ai_config_key" ON "ai_config"("configKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_ai_config_key" ON "ai_config"("configKey" ASC);

-- CreateIndex
CREATE INDEX "idx_ai_prompts_key" ON "ai_prompts"("promptKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_ai_prompt_key" ON "ai_prompts"("promptKey" ASC);

-- CreateIndex
CREATE INDEX "idx_assignment_submissions_assignment" ON "assignment_submissions"("assignment_id" ASC);

-- CreateIndex
CREATE INDEX "idx_assignment_submissions_user" ON "assignment_submissions"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_submission_assignment_user" ON "assignment_submissions"("assignment_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_assignments_lesson" ON "assignments"("lesson_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_category_name" ON "categories"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_category_slug" ON "categories"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_enrollment_id_key" ON "certificates"("enrollment_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_certificate_number" ON "certificates"("certificateNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_certificate_user_course" ON "certificates"("user_id" ASC, "course_id" ASC);

-- CreateIndex
CREATE INDEX "idx_chat_analytics_date" ON "chat_analytics"("date" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_chat_analytics_session_date" ON "chat_analytics"("session_id" ASC, "date" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "chat_feedback_message_id_key" ON "chat_feedback"("message_id" ASC);

-- CreateIndex
CREATE INDEX "idx_feedback_rating" ON "chat_feedback"("rating" ASC);

-- CreateIndex
CREATE INDEX "idx_feedback_user_id" ON "chat_feedback"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_chat_messages_session" ON "chat_messages"("session_id" ASC);

-- CreateIndex
CREATE INDEX "idx_chat_sessions_created_at" ON "chat_sessions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_chat_sessions_user" ON "chat_sessions"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_comments_post_id" ON "comments"("post_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_course_category_slug" ON "course_categories"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_course_codes_code" ON "course_codes"("code" ASC);

-- CreateIndex
CREATE INDEX "idx_course_codes_course" ON "course_codes"("course_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_course_code_course_code" ON "course_codes"("course_id" ASC, "code" ASC);

-- CreateIndex
CREATE INDEX "idx_documents_lesson" ON "course_documents"("lesson_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "course_orders_user_id_idempotency_key_key" ON "course_orders"("user_id" ASC, "idempotency_key" ASC);

-- CreateIndex
CREATE INDEX "idx_course_orders_coupon" ON "course_orders"("discount_code_id" ASC);

-- CreateIndex
CREATE INDEX "idx_course_orders_course" ON "course_orders"("course_id" ASC);

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_course_orders_refunder" ON "course_orders"("refunded_by" ASC);

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_course_orders_user_status" ON "course_orders"("user_id" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_course_order_code" ON "course_orders"("orderCode" ASC);

-- CreateIndex
CREATE INDEX "idx_reviews_course" ON "course_reviews"("course_id" ASC);

-- CreateIndex
CREATE INDEX "idx_reviews_user" ON "course_reviews"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_review_course_user" ON "course_reviews"("course_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_sections_course" ON "course_sections"("course_id" ASC);

-- CreateIndex
CREATE INDEX "idx_course_tags_course" ON "course_tags"("course_id" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_academy_type" ON "courses"("academy_type" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_access_type" ON "courses"("access_type" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_category" ON "courses"("category_id" ASC);

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_courses_code" ON "courses"("course_code" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_featured" ON "courses"("is_featured" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_instructor" ON "courses"("instructor_id" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_published" ON "courses"("is_published" ASC);

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_courses_semester" ON "courses"("semester_id" ASC);

-- CreateIndex
CREATE INDEX "idx_courses_status" ON "courses"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_course_slug" ON "courses"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "cyber_inventories_user_id_key" ON "cyber_inventories"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "cyber_profiles_user_id_key" ON "cyber_profiles"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_cyber_tasks_user_date" ON "cyber_tasks"("user_id" ASC, "date" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_celebrations_celebrated_date_key" ON "dashboard_celebrations"("celebrated_date" ASC);

-- CreateIndex
CREATE INDEX "idx_dashboard_celeb_user_date" ON "dashboard_celebrations"("user_id" ASC, "celebrated_date" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_states_user_id_key" ON "dashboard_states"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_dashboard_tasks_active" ON "dashboard_tasks"("user_id" ASC, "archived_at" ASC, "date" ASC);

-- CreateIndex
CREATE INDEX "idx_dashboard_tasks_completed" ON "dashboard_tasks"("user_id" ASC, "completed_at" ASC);

-- CreateIndex
CREATE INDEX "idx_dashboard_tasks_user_date" ON "dashboard_tasks"("user_id" ASC, "date" ASC);

-- CreateIndex
CREATE INDEX "idx_dev_posts_category" ON "dev_posts"("category" ASC);

-- CreateIndex
CREATE INDEX "idx_dev_posts_download_count" ON "dev_posts"("download_count" DESC);

-- CreateIndex
CREATE INDEX "idx_discount_code" ON "discount_codes"("code" ASC);

-- CreateIndex
CREATE INDEX "idx_discount_code_user_id" ON "discount_codes"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_discount_code" ON "discount_codes"("code" ASC);

-- CreateIndex
CREATE INDEX "idx_document_chunks_doc_id" ON "document_chunks"("document_id" ASC);

-- CreateIndex
CREATE INDEX "idx_document_chunks_type" ON "document_chunks"("document_type" ASC);

-- CreateIndex
CREATE INDEX "idx_email_verification_tokens_token" ON "email_verification_tokens"("token" ASC);

-- CreateIndex
CREATE INDEX "idx_email_verification_tokens_user_id" ON "email_verification_tokens"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_email_verification_token" ON "email_verification_tokens"("token" ASC);

-- CreateIndex
CREATE INDEX "idx_enrollments_course" ON "enrollments"("course_id" ASC);

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_enrollments_status" ON "enrollments"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_enrollments_user" ON "enrollments"("user_id" ASC);

-- CreateIndex

-- CreateIndex
CREATE UNIQUE INDEX "uk_enrollment_user_course" ON "enrollments"("user_id" ASC, "course_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "feed_collections_owner_id_name_key" ON "feed_collections"("owner_id" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "idx_feed_collections_owner" ON "feed_collections"("owner_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "feed_saved_posts_user_id_post_id_collection_id_key" ON "feed_saved_posts"("user_id" ASC, "post_id" ASC, "collection_id" ASC);

-- CreateIndex
CREATE INDEX "idx_feed_saved_user_collection" ON "feed_saved_posts"("user_id" ASC, "collection_id" ASC);

-- CreateIndex
CREATE INDEX "idx_feed_saved_user_recent" ON "feed_saved_posts"("user_id" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_file_attachments_file_category" ON "file_attachments"("file_category" ASC);

-- CreateIndex
CREATE INDEX "idx_file_attachments_stored_name" ON "file_attachments"("stored_name" ASC);

-- CreateIndex
CREATE INDEX "idx_file_attachments_uploaded_by" ON "file_attachments"("uploaded_by" ASC);

-- CreateIndex
CREATE INDEX "idx_follow_follower" ON "follows"("follower_id" ASC);

-- CreateIndex
CREATE INDEX "idx_follow_following" ON "follows"("following_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_follow_pair" ON "follows"("follower_id" ASC, "following_id" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repo_tags_repo" ON "github_repo_tags"("repo_id" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repo_tags_tag" ON "github_repo_tags"("tag_id" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repos_language" ON "github_repos"("language" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repos_owner_name" ON "github_repos"("owner" ASC, "repo_name" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repos_status" ON "github_repos"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_github_repos_status_created" ON "github_repos"("status" ASC, "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_github_repos_url" ON "github_repos"("url" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "hub_files_public_slug_key" ON "hub_files"("public_slug" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_files_user" ON "hub_files"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_files_user_folder" ON "hub_files"("user_id" ASC, "folder_id" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_files_user_status" ON "hub_files"("user_id" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_folders_user_name" ON "hub_folders"("user_id" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_folders_user_sort" ON "hub_folders"("user_id" ASC, "sort_order" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "hub_links_public_slug_key" ON "hub_links"("public_slug" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_links_public" ON "hub_links"("is_public" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_hub_links_user" ON "hub_links"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_links_user_folder" ON "hub_links"("user_id" ASC, "folder_id" ASC);

-- CreateIndex
CREATE INDEX "idx_hub_links_user_recent" ON "hub_links"("user_id" ASC, "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_lesson_detail_lesson" ON "lesson_details"("lesson_id" ASC);

-- CreateIndex
CREATE INDEX "idx_progress_enrollment" ON "lesson_progress"("enrollment_id" ASC);

-- CreateIndex
CREATE INDEX "idx_progress_lesson" ON "lesson_progress"("lesson_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_progress_enrollment_lesson" ON "lesson_progress"("enrollment_id" ASC, "lesson_id" ASC);

-- CreateIndex
CREATE INDEX "idx_lessons_published" ON "lessons"("is_published" ASC);

-- CreateIndex
CREATE INDEX "idx_lessons_section" ON "lessons"("section_id" ASC);

-- CreateIndex
CREATE INDEX "idx_msg_attach_msg" ON "message_attachments"("message_id" ASC);

-- CreateIndex
CREATE INDEX "idx_reaction_message" ON "message_reactions"("message_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "message_reactions_message_id_user_id_emoji_key" ON "message_reactions"("message_id" ASC, "user_id" ASC, "emoji" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "message_reads_thread_id_user_id_key" ON "message_reads"("thread_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_thread_admin_type" ON "message_threads"("admin_user_id" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "idx_thread_last_msg" ON "message_threads"("last_message_at" DESC);

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_thread_user_type" ON "message_threads"("user_id" ASC, "type" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "message_threads_user_a_id_user_b_id_type_key" ON "message_threads"("user_a_id" ASC, "user_b_id" ASC, "type" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "message_threads_user_id_admin_user_id_type_key" ON "message_threads"("user_id" ASC, "admin_user_id" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "idx_msg_sender" ON "messages"("sender_id" ASC);

-- CreateIndex
CREATE INDEX "idx_msg_thread_time" ON "messages"("thread_id" ASC, "created_at" ASC);

-- CreateIndex
CREATE INDEX "idx_history_user" ON "music_history"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_history_user_time" ON "music_history"("user_id" ASC, "played_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "music_history_user_id_track_id_key" ON "music_history"("user_id" ASC, "track_id" ASC);

-- CreateIndex
CREATE INDEX "idx_playlist_tracks_playlist" ON "music_playlist_tracks"("playlist_id" ASC);

-- CreateIndex
CREATE INDEX "idx_playlist_tracks_track" ON "music_playlist_tracks"("track_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_playlist_track" ON "music_playlist_tracks"("playlist_id" ASC, "track_id" ASC);

-- CreateIndex
CREATE INDEX "idx_playlists_user" ON "music_playlists"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_token" ON "password_reset_tokens"("token" ASC);

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_user_id" ON "password_reset_tokens"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_password_reset_token" ON "password_reset_tokens"("token" ASC);

-- CreateIndex
CREATE INDEX "idx_payment_tx_order" ON "payment_transactions"("order_code" ASC);

-- CreateIndex
CREATE INDEX "idx_post_comments_post_id" ON "post_comments"("post_id" ASC);

-- CreateIndex
CREATE INDEX "idx_post_comments_user_id" ON "post_comments"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_posts_author_id" ON "posts"("author_id" ASC);

-- CreateIndex
CREATE INDEX "idx_posts_category_id" ON "posts"("category_id" ASC);

-- CreateIndex
CREATE INDEX "idx_posts_is_featured" ON "posts"("is_featured" ASC);

-- CreateIndex
CREATE INDEX "idx_posts_published_at" ON "posts"("published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_posts_status" ON "posts"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_post_slug" ON "posts"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_products_active" ON "products"("active" ASC);

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("category_id" ASC);

-- CreateIndex
CREATE INDEX "idx_products_created" ON "products"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_products_featured" ON "products"("featured" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_product_slug" ON "products"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_projects_is_featured" ON "projects"("is_featured" ASC);

-- CreateIndex
CREATE INDEX "idx_projects_status" ON "projects"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_project_slug" ON "projects"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_semester_code" ON "semesters"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_semester_ordinal" ON "semesters"("ordinal" ASC);

-- CreateIndex
CREATE INDEX "idx_order_items_order" ON "shop_order_items"("order_id" ASC);

-- CreateIndex
CREATE INDEX "idx_orders_created" ON "shop_orders"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "shop_orders"("status" ASC);

-- CreateIndex
CREATE INDEX "idx_orders_user" ON "shop_orders"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_order_code" ON "shop_orders"("orderCode" ASC);

-- CreateIndex
CREATE INDEX "idx_skills_category" ON "skills"("category" ASC);

-- CreateIndex
CREATE INDEX "idx_skills_display_order" ON "skills"("display_order" ASC);

-- CreateIndex
CREATE INDEX "idx_skills_is_featured" ON "skills"("is_featured" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_skill_slug" ON "skills"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_social_comment_likes_comment" ON "social_comment_likes"("comment_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_comment_likes_user" ON "social_comment_likes"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "social_comment_likes_comment_id_user_id_key" ON "social_comment_likes"("comment_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_comments_created" ON "social_comments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_social_comments_parent" ON "social_comments"("parent_id" ASC);

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_social_comments_post" ON "social_comments"("post_id" ASC);

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_social_comments_user" ON "social_comments"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_likes_post" ON "social_likes"("post_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_likes_post_type" ON "social_likes"("post_id" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "idx_social_likes_user" ON "social_likes"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "social_likes_post_id_user_id_type_key" ON "social_likes"("post_id" ASC, "user_id" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "idx_social_media_post" ON "social_media"("post_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_notif_receiver_time" ON "social_notifications"("receiver_id" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_social_notif_receiver_unread" ON "social_notifications"("receiver_id" ASC, "is_read" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_social_notif_sender" ON "social_notifications"("sender_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_poll_options_poll" ON "social_poll_options"("poll_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_poll_votes_option" ON "social_poll_votes"("option_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "social_poll_votes_poll_id_user_id_key" ON "social_poll_votes"("poll_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "social_polls_post_id_key" ON "social_polls"("post_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_posts_author" ON "social_posts"("author_id" ASC);

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_social_posts_created" ON "social_posts"("created_at" DESC);

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE INDEX "idx_social_posts_visibility" ON "social_posts"("visibility" ASC);

-- CreateIndex
CREATE INDEX "idx_social_saves_folder" ON "social_saves"("folder" ASC);

-- CreateIndex
CREATE INDEX "idx_social_saves_user" ON "social_saves"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "social_saves_post_id_user_id_key" ON "social_saves"("post_id" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_shares_created" ON "social_shares"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_social_shares_post" ON "social_shares"("post_id" ASC);

-- CreateIndex
CREATE INDEX "idx_social_shares_user" ON "social_shares"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_tags_slug" ON "tags"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_tag_name" ON "tags"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_tag_slug" ON "tags"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_tech_trend_author_id" ON "tech_trend_articles"("author_id" ASC);

-- CreateIndex
CREATE INDEX "idx_tech_trend_category" ON "tech_trend_articles"("category" ASC);

-- CreateIndex
CREATE INDEX "idx_tech_trend_featured" ON "tech_trend_articles"("is_featured" ASC);

-- CreateIndex
CREATE INDEX "idx_tech_trend_published_at" ON "tech_trend_articles"("published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_tech_trend_status" ON "tech_trend_articles"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_tech_trend_slug" ON "tech_trend_articles"("slug" ASC);

-- CreateIndex
CREATE INDEX "idx_nickname_owner" ON "thread_nicknames"("owner_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "thread_nicknames_thread_id_owner_id_target_id_key" ON "thread_nicknames"("thread_id" ASC, "owner_id" ASC, "target_id" ASC);

-- CreateIndex
CREATE INDEX "idx_report_reporter" ON "thread_reports"("reporter_id" ASC);

-- CreateIndex
CREATE INDEX "idx_report_resolved" ON "thread_reports"("resolved_at" ASC);

-- CreateIndex
CREATE INDEX "idx_report_thread" ON "thread_reports"("thread_id" ASC);

-- CreateIndex
CREATE INDEX "idx_block_blocked" ON "user_blocks"("blocked_id" ASC);

-- CreateIndex
CREATE INDEX "idx_block_blocker" ON "user_blocks"("blocker_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blocker_id_blocked_id_key" ON "user_blocks"("blocker_id" ASC, "blocked_id" ASC);

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_email" ON "users"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_username" ON "users"("username" ASC);

-- AddForeignKey
ALTER TABLE "ai_config" ADD CONSTRAINT "ai_config_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_analytics" ADD CONSTRAINT "chat_analytics_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_feedback" ADD CONSTRAINT "chat_feedback_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_feedback" ADD CONSTRAINT "chat_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_codes" ADD CONSTRAINT "course_codes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_orders" ADD CONSTRAINT "course_orders_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_orders" ADD CONSTRAINT "course_orders_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_orders" ADD CONSTRAINT "course_orders_refunded_by_fkey" FOREIGN KEY ("refunded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_orders" ADD CONSTRAINT "course_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_sections" ADD CONSTRAINT "course_sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tags" ADD CONSTRAINT "course_tags_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cyber_inventories" ADD CONSTRAINT "cyber_inventories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cyber_profiles" ADD CONSTRAINT "cyber_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cyber_tasks" ADD CONSTRAINT "cyber_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_celebrations" ADD CONSTRAINT "dashboard_celebrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_states" ADD CONSTRAINT "dashboard_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_tasks" ADD CONSTRAINT "dashboard_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_code_id_fkey" FOREIGN KEY ("course_code_id") REFERENCES "course_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_collections" ADD CONSTRAINT "feed_collections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_saved_posts" ADD CONSTRAINT "feed_saved_posts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "feed_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_saved_posts" ADD CONSTRAINT "feed_saved_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_saved_posts" ADD CONSTRAINT "feed_saved_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_repo_tags" ADD CONSTRAINT "github_repo_tags_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "github_repos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_repo_tags" ADD CONSTRAINT "github_repo_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_files" ADD CONSTRAINT "hub_files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "hub_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_files" ADD CONSTRAINT "hub_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_folders" ADD CONSTRAINT "hub_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "hub_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_folders" ADD CONSTRAINT "hub_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_links" ADD CONSTRAINT "hub_links_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "hub_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hub_links" ADD CONSTRAINT "hub_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_details" ADD CONSTRAINT "lesson_details_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_user_a_id_fkey" FOREIGN KEY ("user_a_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_user_b_id_fkey" FOREIGN KEY ("user_b_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_history" ADD CONSTRAINT "music_history_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_history" ADD CONSTRAINT "music_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_playlist_tracks" ADD CONSTRAINT "music_playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "music_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_playlist_tracks" ADD CONSTRAINT "music_playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "music_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_playlists" ADD CONSTRAINT "music_playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "dev_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_order_items" ADD CONSTRAINT "shop_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "shop_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_order_items" ADD CONSTRAINT "shop_order_items_product_name_fkey" FOREIGN KEY ("product_name") REFERENCES "products"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_orders" ADD CONSTRAINT "shop_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comment_likes" ADD CONSTRAINT "social_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "social_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comment_likes" ADD CONSTRAINT "social_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "social_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_likes" ADD CONSTRAINT "social_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_likes" ADD CONSTRAINT "social_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_notifications" ADD CONSTRAINT "social_notifications_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_notifications" ADD CONSTRAINT "social_notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_poll_options" ADD CONSTRAINT "social_poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "social_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_poll_votes" ADD CONSTRAINT "social_poll_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "social_poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_poll_votes" ADD CONSTRAINT "social_poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "social_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_poll_votes" ADD CONSTRAINT "social_poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_polls" ADD CONSTRAINT "social_polls_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_saves" ADD CONSTRAINT "social_saves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_saves" ADD CONSTRAINT "social_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_shares" ADD CONSTRAINT "social_shares_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_shares" ADD CONSTRAINT "social_shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_trend_articles" ADD CONSTRAINT "tech_trend_articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_nicknames" ADD CONSTRAINT "thread_nicknames_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_nicknames" ADD CONSTRAINT "thread_nicknames_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_nicknames" ADD CONSTRAINT "thread_nicknames_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

