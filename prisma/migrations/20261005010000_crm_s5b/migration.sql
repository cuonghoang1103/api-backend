-- CT Work đợt S5b — CRM nhẹ cho studio (/admin/crm). CHỈ THÊM bảng/khoá mới, không đụng bảng cũ.
-- Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.

-- CreateTable
CREATE TABLE "crm_organizations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "industry" VARCHAR(120),
    "size" VARCHAR(30),
    "website" VARCHAR(300),
    "tax_code" VARCHAR(20),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_contacts" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER,
    "name" VARCHAR(120) NOT NULL,
    "title" VARCHAR(120),
    "email" VARCHAR(254),
    "phone" VARCHAR(30),
    "preferred_channel" VARCHAR(20),
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_at" TIMESTAMP(3),
    "consent_source" VARCHAR(120),
    "note" TEXT,
    "anonymized_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_deals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "org_id" INTEGER,
    "contact_id" INTEGER,
    "package_id" VARCHAR(40),
    "value_amount" DECIMAL(18,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
    "probability" INTEGER,
    "stage" VARCHAR(20) NOT NULL DEFAULT 'LEAD',
    "lost_reason" TEXT,
    "expected_close_at" DATE,
    "owner_id" INTEGER,
    "source" VARCHAR(100),
    "project_request_id" INTEGER,
    "is_roleplay" BOOLEAN NOT NULL DEFAULT false,
    "qualification" JSONB,
    "nda_signed" BOOLEAN NOT NULL DEFAULT false,
    "nda_signed_at" DATE,
    "nda_file_key" VARCHAR(500),
    "nda_file_name" VARCHAR(255),
    "stage_changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "won_at" TIMESTAMP(3),
    "lost_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_deal_stage_changes" (
    "id" SERIAL NOT NULL,
    "deal_id" INTEGER NOT NULL,
    "from_stage" VARCHAR(20),
    "to_stage" VARCHAR(20) NOT NULL,
    "actor_id" INTEGER,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_deal_stage_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_activities" (
    "id" SERIAL NOT NULL,
    "deal_id" INTEGER,
    "contact_id" INTEGER,
    "type" VARCHAR(10) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "body" TEXT,
    "due_at" TIMESTAMP(3),
    "done" BOOLEAN NOT NULL DEFAULT false,
    "done_at" TIMESTAMP(3),
    "notified_at" TIMESTAMP(3),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_proposals" (
    "id" SERIAL NOT NULL,
    "deal_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "token" VARCHAR(64),
    "token_expires_at" TIMESTAMP(3),
    "token_revoked_at" TIMESTAMP(3),
    "content_hash" VARCHAR(64),
    "sent_at" TIMESTAMP(3),
    "viewed_at" TIMESTAMP(3),
    "responded_at" TIMESTAMP(3),
    "response_name" VARCHAR(120),
    "response_note" TEXT,
    "response_ip" VARCHAR(64),
    "response_user_agent" VARCHAR(500),
    "created_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_crm_org_name" ON "crm_organizations"("name");

-- CreateIndex
CREATE INDEX "idx_crm_contact_email" ON "crm_contacts"("email");

-- CreateIndex
CREATE INDEX "idx_crm_contact_org" ON "crm_contacts"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_crm_deal_project_request" ON "crm_deals"("project_request_id");

-- CreateIndex
CREATE INDEX "idx_crm_deal_stage" ON "crm_deals"("stage", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "idx_crm_deal_contact" ON "crm_deals"("contact_id");

-- CreateIndex
CREATE INDEX "idx_crm_deal_org" ON "crm_deals"("org_id");

-- CreateIndex
CREATE INDEX "idx_crm_stage_change_deal" ON "crm_deal_stage_changes"("deal_id", "at");

-- CreateIndex
CREATE INDEX "idx_crm_activity_deal" ON "crm_activities"("deal_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_crm_activity_contact" ON "crm_activities"("contact_id");

-- CreateIndex
CREATE INDEX "idx_crm_activity_due" ON "crm_activities"("type", "done", "due_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_crm_proposal_token" ON "crm_proposals"("token");

-- CreateIndex
CREATE UNIQUE INDEX "uk_crm_proposal_version" ON "crm_proposals"("deal_id", "version");

-- AddForeignKey
ALTER TABLE "crm_contacts" ADD CONSTRAINT "crm_contacts_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "crm_organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "crm_organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deal_stage_changes" ADD CONSTRAINT "crm_deal_stage_changes_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_proposals" ADD CONSTRAINT "crm_proposals_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
