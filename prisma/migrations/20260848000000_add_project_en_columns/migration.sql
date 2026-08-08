-- Bilingual (VI/EN) case-study columns for the /projects module.
--
-- Sibling columns rather than a `project_translations` table: a project has at
-- most two languages, the public detail page is a single-row read on the hot
-- path, and a join per read would buy nothing. NULL = not translated yet; the
-- API falls back to the Vietnamese column so a half-translated project renders
-- instead of going blank.
--
-- Purely additive: every column is nullable with no default, so existing rows
-- are untouched and old backend builds keep working against the new schema.

ALTER TABLE "projects"
  ADD COLUMN "title_en"       VARCHAR(255),
  ADD COLUMN "description_en" TEXT,
  ADD COLUMN "role_en"        VARCHAR(100),
  ADD COLUMN "duration_en"    VARCHAR(100),
  ADD COLUMN "body_mdx_en"    TEXT,
  ADD COLUMN "body_html_en"   TEXT,
  ADD COLUMN "schema_code_en" TEXT;

ALTER TABLE "project_milestones"
  ADD COLUMN "title_en"       VARCHAR(255),
  ADD COLUMN "description_en" TEXT;

ALTER TABLE "project_features"
  ADD COLUMN "title_en"       VARCHAR(255),
  ADD COLUMN "description_en" TEXT;

ALTER TABLE "project_resources"
  ADD COLUMN "title_en"       VARCHAR(255),
  ADD COLUMN "description_en" TEXT;

ALTER TABLE "project_list_items"
  ADD COLUMN "content_en"     VARCHAR(500);
