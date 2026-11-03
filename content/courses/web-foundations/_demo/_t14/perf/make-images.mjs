// Generates the two hero images used by slow.html / fast.html (not committed: run this first).
import sharp from 'sharp';

const W = 2400, H = 1600;
// a noisy gradient compresses badly, like a real photo
const raw = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 3, n = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
  raw[i] = (x / W) * 200 + n * 55; raw[i + 1] = (y / H) * 160 + n * 40; raw[i + 2] = 140 + n * 80;
}
const img = sharp(raw, { raw: { width: W, height: H, channels: 3 } });
await img.clone().jpeg({ quality: 92 }).toFile('hero-big.jpg');                      // what a phone camera gives you
await img.clone().resize(1200, 800).webp({ quality: 70 }).toFile('hero.webp');        // what the page actually needs
console.log('images written');
