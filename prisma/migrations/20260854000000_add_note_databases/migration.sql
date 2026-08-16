-- Phase 5 Notes: typed databases, rows/cells, and persisted table views.
CREATE TABLE "note_databases" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "note_databases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "note_database_properties" (
    "id" SERIAL NOT NULL,
    "database_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" VARCHAR(24) NOT NULL,
    "config" JSONB,
    "is_title" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "note_database_properties_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "note_database_rows" (
    "id" SERIAL NOT NULL,
    "database_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "note_database_rows_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "note_database_cells" (
    "id" SERIAL NOT NULL,
    "row_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "note_database_cells_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "note_database_views" (
    "id" SERIAL NOT NULL,
    "database_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" VARCHAR(24) NOT NULL DEFAULT 'TABLE',
    "config" JSONB NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "note_database_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_note_databases_user_updated" ON "note_databases"("user_id", "updated_at" DESC);
CREATE INDEX "idx_note_databases_subject_updated" ON "note_databases"("subject_id", "updated_at" DESC);
CREATE UNIQUE INDEX "uk_note_database_property_name" ON "note_database_properties"("database_id", "name");
CREATE INDEX "idx_note_database_properties_sort" ON "note_database_properties"("database_id", "sort_order");
CREATE INDEX "idx_note_database_rows_sort" ON "note_database_rows"("database_id", "sort_order");
CREATE INDEX "idx_note_database_rows_creator" ON "note_database_rows"("created_by_id");
CREATE INDEX "idx_note_database_rows_updater" ON "note_database_rows"("updated_by_id");
CREATE UNIQUE INDEX "uk_note_database_cell_row_property" ON "note_database_cells"("row_id", "property_id");
CREATE INDEX "idx_note_database_cells_property" ON "note_database_cells"("property_id");
CREATE INDEX "idx_note_database_views_sort" ON "note_database_views"("database_id", "sort_order");

ALTER TABLE "note_databases" ADD CONSTRAINT "note_databases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_databases" ADD CONSTRAINT "note_databases_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "note_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_properties" ADD CONSTRAINT "note_database_properties_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "note_databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_rows" ADD CONSTRAINT "note_database_rows_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "note_databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_rows" ADD CONSTRAINT "note_database_rows_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "note_database_rows" ADD CONSTRAINT "note_database_rows_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "note_database_cells" ADD CONSTRAINT "note_database_cells_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "note_database_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_cells" ADD CONSTRAINT "note_database_cells_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "note_database_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "note_database_views" ADD CONSTRAINT "note_database_views_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "note_databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
