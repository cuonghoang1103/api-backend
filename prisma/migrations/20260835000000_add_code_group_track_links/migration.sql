-- CreateTable: many-to-many so a track can appear in extra groups besides its primary group.
CREATE TABLE "code_group_track_links" (
    "group_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "code_group_track_links_pkey" PRIMARY KEY ("group_id","track_id")
);

-- CreateIndex
CREATE INDEX "idx_cgtl_track" ON "code_group_track_links"("track_id");

-- AddForeignKey
ALTER TABLE "code_group_track_links" ADD CONSTRAINT "code_group_track_links_group_id_fkey"
    FOREIGN KEY ("group_id") REFERENCES "code_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_group_track_links" ADD CONSTRAINT "code_group_track_links_track_id_fkey"
    FOREIGN KEY ("track_id") REFERENCES "code_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
