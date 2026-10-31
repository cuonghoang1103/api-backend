// node ghep.mjs <dir deck> <out dir> : ghép 4 slide/ảnh (2×2) để soát nhanh
import { createRequire } from 'node:module'; const sharp = createRequire('/Users/admin/Downloads/api-backend/package.json')('sharp');
import fs from 'node:fs'; import path from 'node:path';
const [dir, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).sort();
const W = 960, H = 540;
for (let i = 0; i < files.length; i += 4) {
  const group = files.slice(i, i + 4);
  const comps = await Promise.all(group.map(async (f, k) => ({ input: await sharp(path.join(dir, f)).resize(W, H).toBuffer(), left: (k % 2) * (W + 8), top: Math.floor(k / 2) * (H + 8) })));
  const name = path.join(out, `${path.basename(dir)}-${String(i / 4 + 1).padStart(2, '0')}.png`);
  await sharp({ create: { width: W * 2 + 8, height: H * 2 + 8, channels: 3, background: '#333' } }).composite(comps).png().toFile(name);
  console.log(name, group.join(','));
}
