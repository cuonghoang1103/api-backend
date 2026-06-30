/**
 * Seed a starter sticker pack so the chat sticker picker isn't empty
 * before any admin uploads their own packs.
 *
 * Source: OpenMoji (https://openmoji.org) — licensed CC BY-SA 4.0.
 * Attribution: "All emojis designed by OpenMoji – the open-source
 * emoji and icon project. License: CC BY-SA 4.0".
 *
 * Images are DOWNLOADED then re-uploaded into OUR storage (R2 in prod /
 * local in dev) via uploadService — never hotlinked.
 *
 * Idempotent: skips if a pack with the same slug already exists.
 * Best-effort per image: a failed download/upload is skipped, not fatal.
 *
 * Run:  npx tsx scripts/seed-stickers.ts
 */

import { prisma } from '../src/config/database.js';
import { uploadImage } from '../src/storage/uploadService.js';

const PACK_SLUG = 'openmoji-starter';
const PACK_NAME = 'OpenMoji';

// A handful of expressive emoji (hex codepoints) for the starter pack.
const CODEPOINTS = [
  '1F600', '1F603', '1F604', '1F606', '1F609', '1F60A',
  '1F60D', '1F618', '1F602', '1F923', '1F62D', '1F621',
  '1F44D', '1F44F', '2764', '1F389', '1F525', '1F60E',
];

const OPENMOJI_URL = (hex: string) =>
  `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/72x72/${hex}.png`;

async function main() {
  const existing = await prisma.stickerPack.findUnique({ where: { slug: PACK_SLUG } });
  if (existing) {
    console.log(`Pack "${PACK_SLUG}" already exists (id=${existing.id}) — skipping seed.`);
    process.exit(0);
  }

  const pack = await prisma.stickerPack.create({
    data: { slug: PACK_SLUG, name: PACK_NAME, sortOrder: 0 },
  });
  console.log(`Created pack ${pack.id} (${pack.name}). Uploading ${CODEPOINTS.length} stickers…`);

  let firstUrl: string | null = null;
  let ok = 0;
  for (const hex of CODEPOINTS) {
    try {
      const res = await fetch(OPENMOJI_URL(hex));
      if (!res.ok) { console.warn(`  ${hex}: download ${res.status}`); continue; }
      const buffer = Buffer.from(await res.arrayBuffer());
      const uploaded = await uploadImage(
        { buffer, originalName: `${hex}.png`, mimetype: 'image/png', size: buffer.length },
        'images/sticker',
        { subPrefix: PACK_SLUG },
      );
      await prisma.sticker.create({ data: { packId: pack.id, url: uploaded.url, label: hex } });
      if (!firstUrl) firstUrl = uploaded.url;
      ok++;
      console.log(`  ${hex}: ok`);
    } catch (e) {
      console.warn(`  ${hex}: ${(e as Error).message}`);
    }
  }

  if (firstUrl) {
    await prisma.stickerPack.update({ where: { id: pack.id }, data: { coverUrl: firstUrl } });
  }

  if (ok === 0) {
    // No images made it — drop the empty pack so the picker stays clean.
    await prisma.stickerPack.delete({ where: { id: pack.id } });
    console.error('No stickers uploaded — removed empty pack. Check network/storage.');
    process.exit(1);
  }

  console.log(`Done. ${ok}/${CODEPOINTS.length} stickers uploaded into pack "${PACK_NAME}".`);
  process.exit(0);
}

main().catch((e) => { console.error('Seed failed:', e); process.exit(1); });
