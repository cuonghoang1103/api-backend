-- Original assignment sheet attached to a Code Lab exercise.
-- brief_pdf_url  : the embeddable PDF (converted from .docx when the source was Word)
-- brief_file_url : the untouched source file, offered as a download
-- Additive and nullable: every existing row keeps working with both NULL.
ALTER TABLE "code_exercises" ADD COLUMN "brief_pdf_url" VARCHAR(2000);
ALTER TABLE "code_exercises" ADD COLUMN "brief_file_url" VARCHAR(2000);
