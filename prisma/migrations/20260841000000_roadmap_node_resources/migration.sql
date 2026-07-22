-- Add curated resources (JSON array) to roadmap nodes.
ALTER TABLE "roadmap_nodes" ADD COLUMN "resources" JSONB;
