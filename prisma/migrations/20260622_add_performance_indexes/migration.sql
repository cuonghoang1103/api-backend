-- Performance indexes for high-traffic query paths
-- Models: SocialPost, CourseOrder, Enrollment, MessageThread, Course, SocialComment

-- SocialPost: public feed (visibility + status filter), profile page (author sorted), status-only feeds
CREATE INDEX "idx_social_posts_status_created" ON "social_posts"("status", "created_at" DESC);
CREATE INDEX "idx_social_posts_author_created" ON "social_posts"("author_id", "created_at" DESC);
CREATE INDEX "idx_social_posts_vis_status_created" ON "social_posts"("visibility", "status", "created_at" DESC);

-- CourseOrder: admin order list, per-course stats, chronological listing
CREATE INDEX "idx_course_orders_status_created" ON "course_orders"("status", "created_at" DESC);
CREATE INDEX "idx_course_orders_course_status" ON "course_orders"("course_id", "status");
CREATE INDEX "idx_course_orders_created" ON "course_orders"("created_at" DESC);

-- Enrollment: active enrollments per user, active students per course, expiry scanning
CREATE INDEX "idx_enrollments_user_status" ON "enrollments"("user_id", "status");
CREATE INDEX "idx_enrollments_course_status" ON "enrollments"("course_id", "status");
CREATE INDEX "idx_enrollments_expires_at" ON "enrollments"("expires_at");

-- MessageThread: user↔user DM inbox sorted by most-recent activity (userA and userB sides)
CREATE INDEX "idx_thread_user_a_last_msg" ON "message_threads"("user_a_id", "last_message_at" DESC);
CREATE INDEX "idx_thread_user_b_last_msg" ON "message_threads"("user_b_id", "last_message_at" DESC);

-- Course: published listing page, featured widget, category filter
CREATE INDEX "idx_courses_published_status_created" ON "courses"("is_published", "status", "created_at" DESC);
CREATE INDEX "idx_courses_published_featured" ON "courses"("is_published", "is_featured");
CREATE INDEX "idx_courses_category_published" ON "courses"("category_id", "is_published");

-- SocialComment: thread view top-level + replies, paginated reply fetch
CREATE INDEX "idx_social_comments_post_parent_created" ON "social_comments"("post_id", "parent_id", "created_at" DESC);
CREATE INDEX "idx_social_comments_parent_created" ON "social_comments"("parent_id", "created_at" DESC);
