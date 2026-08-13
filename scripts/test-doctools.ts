/**
 * Chạy THẬT đường ống ảnh → chữ → file Word, bằng chính mã của backend
 * (không phải bản nháp): prompt → gọi model có ảnh → dựng OMML → đóng .docx.
 *
 *   npx tsx scripts/test-doctools.ts <ảnh> [ảnh…] [--hinh=ve-lai|mo-ta|bo-qua]
 *                                          [--preset=math,slash_fraction]
 *                                          [--note="ghi chú"] [--ra=thư/mục]
 *
 * Cần khoá cổng LLM trong `.env`. In ra bản chép + số công thức dựng được, và
 * ghi file .docx để mở bằng Word/WPS xem tận mắt.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { chepMotAnh, type CheDoHinh } from '../src/services/docTools/transcribe.service.js';
import { renderDocx, type HinhKemTheo } from '../src/services/docTools/docx.js';

const MIME: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const co = (ten: string): string | undefined => args.find((a) => a.startsWith(`--${ten}=`))?.split('=').slice(1).join('=');
  const anhs = args.filter((a) => !a.startsWith('--'));
  if (!anhs.length) {
    console.error('Thiếu đường dẫn ảnh. Ví dụ: npx tsx scripts/test-doctools.ts /tmp/de-toan.jpg --hinh=ve-lai');
    process.exit(1);
  }

  const cheDoHinh = (co('hinh') ?? 'bo-qua') as CheDoHinh;
  const presetIds = (co('preset') ?? 'math').split(',').map((s) => s.trim()).filter(Boolean);
  const note = co('note');
  const thuMucRa = co('ra') ?? '/tmp';

  let vanBanGop = '';
  const hinhGop: HinhKemTheo[] = [];
  let tienTong = 0;

  for (const [i, duongDan] of anhs.entries()) {
    const buf = readFileSync(duongDan);
    const mime = MIME[extname(duongDan).toLowerCase()] ?? 'image/jpeg';
    console.log(`\n===== [${i + 1}/${anhs.length}] ${basename(duongDan)} — ${(buf.length / 1024).toFixed(0)}KB, chế độ hình: ${cheDoHinh} =====`);

    const t0 = Date.now();
    const trang = await chepMotAnh(
      { data: buf.toString('base64'), mediaType: mime, ten: basename(duongDan) },
      i,
      { presetIds, note, cheDoHinh, userId: null },
    );
    const giay = ((Date.now() - t0) / 1000).toFixed(1);

    if (trang.loi) {
      console.log(`LỖI sau ${giay}s: ${trang.loi}`);
      continue;
    }
    console.log(`${giay}s · ${trang.model} · vào ${trang.tokenVao} / ra ${trang.tokenRa} token · ${(trang.costUsd ?? 0).toFixed(4)} USD · chỗ không đọc chắc: ${trang.soChoNgo} · hình vẽ lại: ${trang.hinhVeLai.length}`);
    console.log('─'.repeat(70));
    console.log(trang.vanBan);
    console.log('─'.repeat(70));

    tienTong += trang.costUsd ?? 0;
    vanBanGop += (vanBanGop ? '\n\n' : '') + trang.vanBan;
    for (const [k, hv] of trang.hinhVeLai.entries()) {
      hinhGop.push({
        buffer: Buffer.from(hv.pngBase64, 'base64'),
        loai: 'png',
        chuThich: `Hình ${i + 1}.${k + 1} — máy vẽ lại, cần đối chiếu ảnh gốc`,
        rong: hv.rong,
        cao: hv.cao,
      });
    }
  }

  if (!vanBanGop.trim()) {
    console.error('\nKhông chép được gì — dừng.');
    process.exit(1);
  }

  const kq = await renderDocx({ tieuDe: '', vanBan: vanBanGop, hinh: hinhGop });
  const ra = join(thuMucRa, 'doctools-test.docx');
  writeFileSync(ra, kq.buffer);
  console.log(`\n✅ ${ra} — ${(kq.buffer.length / 1024).toFixed(1)}KB · công thức dựng được ${kq.soCongThuc - kq.congThucHong}/${kq.soCongThuc} · hình nhúng ${hinhGop.length} · tổng tiền ${tienTong.toFixed(4)} USD`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
