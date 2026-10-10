/** Đợt 8c — phần THUẦN của scripts/db-test-tu-migration.mjs (không cần Postgres). */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { phanThem, VA_MIGRATION } from './db-test-tu-migration.mjs';

test('phanThem: giữ CREATE TABLE/TYPE/INDEX + ADD COLUMN/CONSTRAINT, bỏ DROP và ALTER COLUMN', () => {
  const sql = [
    '-- AlterTable',
    'ALTER TABLE "projects" DROP COLUMN "search_vector";',
    '',
    '-- AlterTable',
    'ALTER TABLE "code_exercises" ALTER COLUMN "search_vector" DROP DEFAULT;',
    '',
    '-- AlterTable',
    'ALTER TABLE "notes" DROP COLUMN "x",',
    'ADD COLUMN     "y" TEXT;',
    '',
    '-- CreateEnum',
    'CREATE TYPE "snippet_kind" AS ENUM (\'A\', \'B\');',
    '',
    '-- CreateTable',
    'CREATE TABLE "maker_devices" (',
    '    "id" SERIAL NOT NULL,',
    '    CONSTRAINT "maker_devices_pkey" PRIMARY KEY ("id")',
    ');',
    '',
    '-- CreateIndex',
    'CREATE UNIQUE INDEX "uk_x" ON "maker_devices"("id");',
    '',
    '-- DropIndex',
    'DROP INDEX "old_idx";',
    '',
    '-- AddForeignKey',
    'ALTER TABLE "a" ADD CONSTRAINT "a_b_fkey" FOREIGN KEY ("b") REFERENCES "b"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
    '',
  ].join('\n');
  const out = phanThem(sql);
  assert.doesNotMatch(out, /DROP/);
  assert.doesNotMatch(out, /ALTER COLUMN/);
  assert.match(out, /ALTER TABLE "notes" ADD COLUMN\s+"y" TEXT;/);
  assert.match(out, /CREATE TYPE "snippet_kind"/);
  assert.match(out, /CREATE TABLE "maker_devices" \(/);
  assert.match(out, /CREATE UNIQUE INDEX "uk_x"/);
  assert.match(out, /ADD CONSTRAINT "a_b_fkey"/);
  assert.equal(phanThem('-- chỉ chú thích\n'), '');
});

test('VA_MIGRATION: câu index trùng tên của migration music thành IF NOT EXISTS, phần còn lại giữ nguyên', () => {
  const goc = 'ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");\nCREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");';
  const va = VA_MIGRATION['20260706130000_add_music_and_profile'](goc);
  assert.match(va, /CREATE INDEX IF NOT EXISTS "post_music_post_id_key"/);
  assert.match(va, /ADD CONSTRAINT "post_music_post_id_key" UNIQUE/);
});
