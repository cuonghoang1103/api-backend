/**
 * Seed the 8 flagship RoadMaps. Run inside the backend container:
 *   docker exec cuonghoangdev_backend node scripts/roadmap-seed.mjs
 *   docker exec cuonghoangdev_backend node scripts/roadmap-seed.mjs --force   # rebuild nodes
 */
const { seedRoadmaps } = await import('../dist/services/roadmap.service.js');
const force = process.argv.includes('--force');
try {
  const res = await seedRoadmaps({ force });
  for (const r of res) console.log(`${r.slug}: ${r.skipped ? 'skipped (exists)' : `${r.created} nodes`}`);
  console.log('Done.');
  process.exit(0);
} catch (e) {
  console.error('Seed failed:', e?.message || e);
  process.exit(1);
}
