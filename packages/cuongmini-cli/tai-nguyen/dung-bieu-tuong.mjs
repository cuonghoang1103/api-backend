// Dựng BIỂU TƯỢNG CuongMini cho thông báo hệ điều hành (đợt 8C, 19/10/2026) từ
// `frontend/public/images/cuongmini-avatar.svg`:
//   • tai-nguyen/cuongmini.png (256px)  — bản gốc để xem / dùng ngoài
//   • tai-nguyen/cuongmini.ico (16/32/48 BMP + 256 PNG) — NotifyIcon/toast Windows
//   • src/bieuTuongNhung.ts — PNG 128px + ICO (16/32/48) dạng base64, NHÚNG vào bundle: CLI tự ghi ra
//     ~/.cuongmini/bieu-tuong/ lúc gửi thông báo ⇒ chạy được với mọi cách cài (tgz, npm link, tsx).
// Chạy lại khi đổi logo:  node tai-nguyen/dung-bieu-tuong.mjs   (cần sharp — có ở node_modules gốc repo)
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(goc, '../..');
const sharp = createRequire(path.join(repo, 'package.json'))('sharp');
const svg = path.join(repo, 'frontend/public/images/cuongmini-avatar.svg');

const png = (co) => sharp(svg, { density: Math.ceil((72 * co * 2) / 160) }).resize(co, co).png({ compressionLevel: 9 }).toBuffer();

/** Ảnh BGRA 32-bit (BMP trong ICO: từ dưới lên, cao ×2, kèm mặt nạ AND). */
async function bmpIco(co) {
  const { data } = await sharp(svg, { density: Math.ceil((72 * co * 2) / 160) }).resize(co, co).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const dau = Buffer.alloc(40);
  dau.writeUInt32LE(40, 0); dau.writeInt32LE(co, 4); dau.writeInt32LE(co * 2, 8); dau.writeUInt16LE(1, 12); dau.writeUInt16LE(32, 14);
  dau.writeUInt32LE(0, 16); dau.writeUInt32LE(co * co * 4, 20);
  const dieuAnh = Buffer.alloc(co * co * 4);
  for (let y = 0; y < co; y += 1) {
    for (let x = 0; x < co; x += 1) {
      const n = (y * co + x) * 4; const d = ((co - 1 - y) * co + x) * 4;
      dieuAnh[d] = data[n + 2]; dieuAnh[d + 1] = data[n + 1]; dieuAnh[d + 2] = data[n]; dieuAnh[d + 3] = data[n + 3];
    }
  }
  const hangMask = Math.ceil(co / 32) * 4;
  return Buffer.concat([dau, dieuAnh, Buffer.alloc(hangMask * co)]);
}

function ico(anh) {
  const dau = Buffer.alloc(6 + 16 * anh.length);
  dau.writeUInt16LE(0, 0); dau.writeUInt16LE(1, 2); dau.writeUInt16LE(anh.length, 4);
  let lech = dau.length;
  anh.forEach(({ co, buf }, i) => {
    const o = 6 + 16 * i;
    dau[o] = co >= 256 ? 0 : co; dau[o + 1] = co >= 256 ? 0 : co;
    dau.writeUInt16LE(1, o + 4); dau.writeUInt16LE(32, o + 6);
    dau.writeUInt32LE(buf.length, o + 8); dau.writeUInt32LE(lech, o + 12);
    lech += buf.length;
  });
  return Buffer.concat([dau, ...anh.map((a) => a.buf)]);
}

const nho = [];
for (const co of [16, 32, 48]) nho.push({ co, buf: await bmpIco(co) });
const ico3 = ico(nho);
const icoDu = ico([...nho, { co: 256, buf: await png(256) }]);
writeFileSync(path.join(goc, 'tai-nguyen/cuongmini.png'), await png(256));
writeFileSync(path.join(goc, 'tai-nguyen/cuongmini.ico'), icoDu);
const png128 = await png(128);
writeFileSync(path.join(goc, 'src/bieuTuongNhung.ts'), `// TỰ SINH bởi tai-nguyen/dung-bieu-tuong.mjs — đừng sửa tay.\n// Logo CuongMini (frontend/public/images/cuongmini-avatar.svg) cho thông báo hệ điều hành.\nexport const PNG_128 = '${png128.toString('base64')}';\nexport const ICO = '${ico3.toString('base64')}';\n`);
console.log(`png128 ${png128.length}B · ico(16/32/48) ${ico3.length}B · cuongmini.ico ${icoDu.length}B`);
