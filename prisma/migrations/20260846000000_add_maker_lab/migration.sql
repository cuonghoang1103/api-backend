-- CreateEnum
CREATE TYPE "MakerPlatform" AS ENUM ('ESP32', 'ESP32_S3', 'ESP8266', 'RP2040', 'STM32', 'ARDUINO', 'RASPBERRY_PI', 'JETSON', 'OTHER');

-- CreateEnum
CREATE TYPE "MakerProjectStatus" AS ENUM ('PLANNING', 'SOURCING', 'BUILDING', 'TESTING', 'LIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MakerComponentCategory" AS ENUM ('MCU', 'AUDIO_IN', 'AUDIO_OUT', 'DISPLAY', 'MOTION', 'DRIVER', 'SENSOR', 'POWER', 'MECHANICAL', 'CONNECTIVITY', 'TOOL', 'MISC');

-- CreateEnum
CREATE TYPE "MakerDeviceStatus" AS ENUM ('OFFLINE', 'ONLINE', 'ERROR', 'UPDATING');

-- CreateEnum
CREATE TYPE "MakerCommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKED', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "maker_projects" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "tagline" VARCHAR(255),
    "platform" "MakerPlatform" NOT NULL DEFAULT 'ESP32_S3',
    "status" "MakerProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "summary" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 3,
    "est_hours" INTEGER,
    "est_cost_vnd" INTEGER,
    "cover_image" VARCHAR(500),
    "accent_color" VARCHAR(20),
    "goals" JSONB,
    "features" JSONB,
    "architecture" JSONB,
    "wiring" JSONB,
    "firmware_modules" JSONB,
    "build_log" JSONB,
    "enclosure" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_components" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "category" "MakerComponentCategory" NOT NULL DEFAULT 'MISC',
    "name" VARCHAR(200) NOT NULL,
    "part_number" VARCHAR(120),
    "qty" INTEGER NOT NULL DEFAULT 1,
    "unit_price_vnd" INTEGER,
    "vendor_name" VARCHAR(120),
    "vendor_url" VARCHAR(500),
    "svg_key" VARCHAR(60),
    "image_url" VARCHAR(500),
    "specs" JSONB,
    "why_this_part" TEXT,
    "alternatives" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "acquired" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_devices" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "device_key" VARCHAR(64) NOT NULL,
    "secret_hash" VARCHAR(120) NOT NULL,
    "status" "MakerDeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "last_seen_at" TIMESTAMP(3),
    "firmware_version" VARCHAR(40),
    "ip_address" VARCHAR(64),
    "rssi" INTEGER,
    "battery_pct" INTEGER,
    "uptime_sec" INTEGER,
    "meta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_telemetry" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maker_telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_commands" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "issued_by_id" INTEGER,
    "type" VARCHAR(40) NOT NULL,
    "payload" JSONB,
    "status" "MakerCommandStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "sent_at" TIMESTAMP(3),
    "acked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maker_commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_firmwares" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "version" VARCHAR(40) NOT NULL,
    "r2_key" VARCHAR(500) NOT NULL,
    "sha256" VARCHAR(64) NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "release_notes" TEXT,
    "is_latest" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maker_firmwares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_device_logs" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "level" VARCHAR(8) NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maker_device_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maker_personas" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL DEFAULT 'Assistant',
    "system_prompt" TEXT NOT NULL,
    "voice_provider" VARCHAR(24) NOT NULL DEFAULT 'edge',
    "voice_id" VARCHAR(120),
    "language" VARCHAR(12) NOT NULL DEFAULT 'vi-VN',
    "traits" JSONB,
    "sample_dialogues" JSONB,
    "wake_word" VARCHAR(60),
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "max_tokens" INTEGER NOT NULL DEFAULT 220,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maker_personas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_maker_project_slug" ON "maker_projects"("slug");

-- CreateIndex
CREATE INDEX "idx_maker_project_pub_order" ON "maker_projects"("published", "sort_order");

-- CreateIndex
CREATE INDEX "idx_maker_project_platform" ON "maker_projects"("platform");

-- CreateIndex
CREATE INDEX "idx_maker_component_project_order" ON "maker_components"("project_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_maker_component_project_cat" ON "maker_components"("project_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "uk_maker_device_key" ON "maker_devices"("device_key");

-- CreateIndex
CREATE INDEX "idx_maker_device_owner" ON "maker_devices"("owner_id");

-- CreateIndex
CREATE INDEX "idx_maker_device_project" ON "maker_devices"("project_id");

-- CreateIndex
CREATE INDEX "idx_maker_telemetry_device_time" ON "maker_telemetry"("device_id", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_maker_command_device_time" ON "maker_commands"("device_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_maker_command_status" ON "maker_commands"("status");

-- CreateIndex
CREATE INDEX "idx_maker_firmware_latest" ON "maker_firmwares"("project_id", "is_latest");

-- CreateIndex
CREATE UNIQUE INDEX "uk_maker_firmware_project_version" ON "maker_firmwares"("project_id", "version");

-- CreateIndex
CREATE INDEX "idx_maker_devicelog_device_time" ON "maker_device_logs"("device_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_maker_persona_project" ON "maker_personas"("project_id");

-- AddForeignKey
ALTER TABLE "maker_components" ADD CONSTRAINT "maker_components_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "maker_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_devices" ADD CONSTRAINT "maker_devices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "maker_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_devices" ADD CONSTRAINT "maker_devices_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_telemetry" ADD CONSTRAINT "maker_telemetry_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "maker_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_commands" ADD CONSTRAINT "maker_commands_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "maker_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_commands" ADD CONSTRAINT "maker_commands_issued_by_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_firmwares" ADD CONSTRAINT "maker_firmwares_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "maker_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_device_logs" ADD CONSTRAINT "maker_device_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "maker_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maker_personas" ADD CONSTRAINT "maker_personas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "maker_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

