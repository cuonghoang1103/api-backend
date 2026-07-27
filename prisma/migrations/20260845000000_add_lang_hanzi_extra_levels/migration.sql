-- Additive, nullable column: lets a hanzi char also show under a
-- course-specific tab (e.g. "JPD113") without leaving its primary level.
ALTER TABLE "lang_hanzi_chars" ADD COLUMN "extra_levels" VARCHAR(100);
