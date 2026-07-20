-- Per-exercise teaching resources: a walkthrough video, a repository, and a
-- downloadable source archive. Additive and nullable.
ALTER TABLE "code_exercises" ADD COLUMN "github_url" VARCHAR(2000);
ALTER TABLE "code_exercises" ADD COLUMN "source_url" VARCHAR(2000);
