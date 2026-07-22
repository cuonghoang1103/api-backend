/**
 * codelab-link-tracks.mjs — feature CuongThai tracks in their standard category too.
 * A track keeps its primary group (CuongThai) and gets an EXTRA membership in the
 * matching standard group, so e.g. PostgreSQL shows in both CuongThai and Database.
 *
 * PURE DATA. Requires the code_group_track_links table (migration
 * 20260835000000_add_code_group_track_links) to exist — run AFTER deploy.
 *
 *   node scripts/codelab-link-tracks.mjs            # dry
 *   node scripts/codelab-link-tracks.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// CuongThai track slug -> the standard group it should ALSO appear in.
const MAP = {
  'postgresql': 'database',
  'nodejs-express': 'backend',
  'typescript': 'languages',
  'javascript': 'languages',
  'react': 'frontend',
  'nextjs': 'frontend',
  'tailwind-css': 'frontend',
  'prisma-orm': 'database',
  'redis': 'database',
  'socket-io': 'web-networking',
  'authentication': 'web-networking',
  'object-storage-s3': 'devops-cloud',
  'media-processing': 'backend',
  'observability-monitoring': 'devops-cloud',
  'payment-integration': 'backend',
  'deploy-vps': 'devops-cloud',
  'domains-dns-tls': 'web-networking',
  'nginx': 'devops-cloud',
  'github-actions': 'devops-cloud',
  'docker': 'devops-cloud',
  'git': 'devops-cloud',
  'linux-bash': 'devops-cloud',
  // Payment gateways cuongthai.com actually uses: primary in Payments, also in CuongThai.
  'vnpay': 'cuongthai',
  'payos': 'cuongthai',
  // The general integration track (primary in CuongThai) also belongs in Payments.
  'payment-integration': 'payments',
  // cuongthai-roadmap intentionally stays only in CuongThai.
};

let ok = 0, skip = 0;
for (const [tslug, gslug] of Object.entries(MAP)) {
  const track = await prisma.codeTrack.findUnique({ where: { slug: tslug }, select: { id: true, sortOrder: true } });
  const group = await prisma.codeGroup.findUnique({ where: { slug: gslug }, select: { id: true } });
  if (!track || !group) { console.log(`  ? missing ${tslug} -> ${gslug}`); continue; }
  const existing = await prisma.codeGroupTrackLink.findUnique({
    where: { groupId_trackId: { groupId: group.id, trackId: track.id } },
  }).catch(() => null);
  if (existing) { console.log(`  = ${tslug} already in ${gslug}`); skip++; continue; }
  console.log(`  + ${tslug} -> also in ${gslug}`);
  if (APPLY) {
    await prisma.codeGroupTrackLink.create({
      data: { groupId: group.id, trackId: track.id, sortOrder: track.sortOrder },
    });
  }
  ok++;
}
console.log(`\n[link-tracks] ${APPLY ? 'linked' : 'would link'} ${ok}, skipped ${skip}. ${APPLY ? 'Done.' : 'DRY — add --apply.'}`);
await prisma.$disconnect();
