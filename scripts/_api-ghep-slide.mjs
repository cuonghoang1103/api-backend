/**
 * _api-ghep-slide.mjs <dir-deck> <n1> [n2 n3 n4] — ghép tối đa 4 ảnh slide (webp 1280x720) thành 1 PNG 2x2 để soát bằng mắt.
 * In đường dẫn ảnh ghép. Vd: node scripts/_api-ghep-slide.mjs /tmp/render/api-02-1 1 2 3 4
 */
import sharp from 'sharp';
const [dir, ...ns] = process.argv.slice(2);
const W = 960, H = 540;
const tiles = await Promise.all(ns.map(async (n, i) => ({ input: await sharp(`${dir}/${String(n).padStart(3, '0')}.webp`).resize(W, H).toBuffer(), left: (i % 2) * W, top: Math.floor(i / 2) * H })));
const out = `${dir}/ghep-${ns.join('-')}.png`;
await sharp({ create: { width: W * 2, height: H * Math.ceil(ns.length / 2), channels: 3, background: '#888' } }).composite(tiles).png().toFile(out);
console.log(out);
