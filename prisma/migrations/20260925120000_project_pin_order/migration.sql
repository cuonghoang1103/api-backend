-- Ghim dự án lên đầu /projects. NULL = không ghim. Thuần ADD COLUMN nullable.
ALTER TABLE "projects" ADD COLUMN "pin_order" INTEGER;
