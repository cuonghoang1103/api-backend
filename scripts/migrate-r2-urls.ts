#!/usr/bin/env node
/**
 * migrate-r2-urls.ts
 *
 * One-shot script that rewrites every R2 public URL in the database from
 * the old `*.r2.dev` hostname to the new `media.cuongthai.com` custom
 * domain. Run this ONCE on the VPS after setting `R2_PUBLIC_URL` to the
 * custom domain in `.env`, then restart the backend.
 *
 * What it touches (all columns that store public URLs from R2):
 *
 *   User.avatarUrl
 *   MusicTrack.coverImage
 *   MusicTrack.audioUrl             (R2 keys only; skipped if YouTube)
 *   MusicPlaylist.coverUrl
 *   SocialMedia.url
 *   SocialMedia.thumbnail
 *   Post.thumbnailUrl
 *   Project.thumbnailUrl
 *   Project.coverUrl
 *   Course.thumbnailUrl
 *   Lesson.thumbnailUrl
 *   LessonDocument.fileUrl
 *   TechTrendArticle.coverImageUrl
 *   GitHubRepoAttachment.url
 *   FileAttachment.fileUrl          (if present)
 *   MessagingAttachment.url
 *
 * What it does NOT touch:
 *   - YouTube URLs (i.ytimg.com, yt3.ggpht.com, www.youtube.com, etc.)
 *   - OAuth/external avatars (googleusercontent.com, etc.)
 *   - Spotify/other external URLs
 *   - Local paths that start with `/uploads/` or `uploads/`
 *
 * The match rule: any value starting with `https://` AND containing
 * `.r2.dev` is considered an R2 URL and rewritten.
 *
 * Usage:
 *   cd /opt/cuonghoangdev
 *   OLD_HOST='pub-8589c8a5e60e429bafe86c0d92e09e90.r2.dev' \
 *   NEW_HOST='media.cuongthai.com' \
 *   npx tsx scripts/migrate-r2-urls.ts
 *
 * Idempotent: if the URL already starts with the new host, the row is
 * skipped. Safe to re-run.
 *
 * DESTRUCTIVE-ish: rewrites DB rows. Always take a backup before
 * running:
 *   /opt/cuonghoangdev/scripts/backup-cron.sh
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_HOST = (process.env.OLD_HOST || '').trim();
const NEW_HOST = (process.env.NEW_HOST || '').trim();
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

if (!OLD_HOST || !NEW_HOST) {
  console.error('ERROR: Set OLD_HOST and NEW_HOST env vars.');
  console.error('Example:');
  console.error(
    "  OLD_HOST='pub-8589c8a5e60e429bafe86c0d92e09e90.r2.dev' \\\n  NEW_HOST='media.cuongthai.com' \\\n  npx tsx scripts/migrate-r2-urls.ts",
  );
  process.exit(1);
}

if (OLD_HOST === NEW_HOST) {
  console.error('ERROR: OLD_HOST and NEW_HOST are identical.');
  process.exit(1);
}

interface ColumnSpec {
  /** Prisma model name (lowercase first letter as in `prisma.<name>`). */
  model: string;
  /** Column names on that model that may hold an R2 URL. */
  columns: string[];
}

const COLUMNS: ColumnSpec[] = [
  { model: 'user', columns: ['avatarUrl'] },
  { model: 'musicTrack', columns: ['coverImage', 'audioUrl'] },
  { model: 'musicPlaylist', columns: ['coverUrl'] },
  { model: 'socialMedia', columns: ['url', 'thumbnail'] },
  { model: 'post', columns: ['thumbnailUrl'] },
  { model: 'project', columns: ['thumbnailUrl', 'coverUrl'] },
  { model: 'course', columns: ['thumbnailUrl'] },
  { model: 'lesson', columns: ['thumbnailUrl'] },
  { model: 'lessonDocument', columns: ['fileUrl'] },
  { model: 'techTrendArticle', columns: ['coverImageUrl'] },
  { model: 'githubRepoAttachment', columns: ['url'] },
  { model: 'messagingAttachment', columns: ['url'] },
];

/**
 * Returns the rewritten URL if the value is an R2 URL that needs
 * migration. Returns null when nothing should change.
 *
 * Rules:
 *  - Must start with `https://`
 *  - Must contain `OLD_HOST` as a hostname match
 *  - Must NOT already point at `NEW_HOST`
 */
function rewriteUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith(`https://${NEW_HOST}/`)) return null;
  if (!value.startsWith('https://')) return null;
  // Hostname match: must appear right after `https://`
  if (!value.startsWith(`https://${OLD_HOST}/`)) return null;
  return `https://${NEW_HOST}/${value.slice(`https://${OLD_HOST}/`.length)}`;
}

async function main() {
  console.log(`\n=== R2 URL migration ===`);
  console.log(`OLD: https://${OLD_HOST}/`);
  console.log(`NEW: https://${NEW_HOST}/`);
  console.log(`DRY_RUN: ${DRY_RUN ? 'yes (no writes)' : 'no (will commit)'}\n`);

  let totalScanned = 0;
  let totalUpdated = 0;
  const touchedTables: string[] = [];

  for (const { model, columns } of COLUMNS) {
    // Resolve the delegate from Prisma. We don't have full TS types
    // for every model name at runtime, so we cast to `any`.
    const delegate = (prisma as unknown as Record<string, any>)[model];
    if (!delegate) {
      console.warn(`[SKIP] model "${model}" not found on Prisma client`);
      continue;
    }

    for (const column of columns) {
      // Find rows whose column actually contains the OLD host.
      // `findMany` is fine here — even with 100k rows it's a few
      // seconds on the indexed column. We only fetch `id` + the
      // target column to keep memory low.
      let rows: Array<{ id: number | string; [k: string]: unknown }>;
      try {
        rows = await delegate.findMany({
          where: {
            [column]: { contains: OLD_HOST },
          },
          select: { id: true, [column]: true },
        });
      } catch (err) {
        // Some columns may not exist on a model (e.g. `coverUrl` on
        // some Prisma versions). Skip silently.
        continue;
      }

      if (rows.length === 0) continue;

      let columnUpdated = 0;
      for (const row of rows) {
        totalScanned += 1;
        const before = row[column] as string | null | undefined;
        const after = rewriteUrl(before);
        if (!after) continue;
        totalUpdated += 1;
        columnUpdated += 1;

        if (DRY_RUN) {
          console.log(`[DRY] ${model}.${column} id=${row.id}`);
          console.log(`        ${before}`);
          console.log(`        ${after}`);
        } else {
          await delegate.update({
            where: { id: row.id },
            data: { [column]: after },
          });
        }
      }

      if (columnUpdated > 0) {
        touchedTables.push(`${model}.${column} (${columnUpdated})`);
        console.log(
          `[${DRY_RUN ? 'DRY' : 'OK '}] ${model}.${column}: ${columnUpdated} row(s)`,
        );
      }
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Rows scanned:  ${totalScanned}`);
  console.log(`Rows updated:  ${totalUpdated}`);
  if (touchedTables.length > 0) {
    console.log(`Touched columns:\n  - ${touchedTables.join('\n  - ')}`);
  }
  if (DRY_RUN) {
    console.log(`\nRun again with DRY_RUN=0 to commit.`);
  }
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
