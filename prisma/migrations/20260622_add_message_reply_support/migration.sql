-- AddColumn: parent_message_id for message reply/quote feature
ALTER TABLE "messages" ADD COLUMN "parent_message_id" INTEGER;

-- Foreign key: SetNull on delete so deleting the parent doesn't cascade-wipe replies
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_message_id_fkey"
  FOREIGN KEY ("parent_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Index for fast lookup of replies by parent
CREATE INDEX "idx_msg_parent" ON "messages"("parent_message_id");
