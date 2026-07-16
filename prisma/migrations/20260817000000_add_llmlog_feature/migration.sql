-- Which product made an LLM call: interview | language | cv | chat | bulk_gen.
-- `step` only picks a model tier, so Interview grading and the My Language tutor
-- both logged step='interview' and could not be told apart — there was no way to
-- see which users spend Pro AI on what.
--
-- Additive and nullable: existing rows keep their history with feature = NULL
-- (the admin view reports those as "không rõ" rather than guessing).
ALTER TABLE "interview_llm_call_logs" ADD COLUMN IF NOT EXISTS "feature" VARCHAR(24);

-- The admin view slices by (feature, user, time); without this it seq-scans a
-- table every generated question appends to.
CREATE INDEX IF NOT EXISTS "idx_interview_llmlog_feature" ON "interview_llm_call_logs" ("feature", "created_at");
