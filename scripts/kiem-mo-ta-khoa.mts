/**
 * Nghiệm thu bất biến "KHÔNG MẤT CHỮ" của phanTichMoTa (frontend/src/lib/courseDescription.ts)
 * trên MỌI course.description của content/courses/*.mjs + content/academy/*.mjs, và của
 * tachCauDai trên requirements. So chuỗi ký tự chữ-số (đã bỏ thẻ, giải mã thực thể, hạ chữ thường).
 * Có đối chứng: cố tình cắt cụt một mục để chắc bộ kiểm bắt được.
 *   npx tsx scripts/kiem-mo-ta-khoa.mts [slug-để-in-cấu-trúc]
 */
import { readdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import { phanTichMoTa, tachCauDai, type KhoiMoTa } from '../frontend/src/lib/courseDescription.ts';
import { giaiMaThucThe, tachGachDauDong } from '../frontend/src/lib/courseBlurb.ts';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content');
async function napTatCa(): Promise<any[]> {
  const out: any[] = [];
  for (const thu of ['courses', 'academy']) {
    for (const f of readdirSync(`${GOC}/${thu}`).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))) {
      const d = (await import(pathToFileURL(`${GOC}/${thu}/${f}`).href)).default;
      for (const x of Array.isArray(d) ? d : [d]) {
        const c = x?.course ?? x;
        if (c && typeof c.description === 'string') out.push({ nguon: `${thu}/${f}`, ...c });
      }
    }
  }
  return out;
}
const chuSo = (s: string) => giaiMaThucThe(s.replace(/<[^>]*>/g, ' ')).normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const chuHienThi = (k: KhoiMoTa[]) => k.map((b) =>
  b.loai === 'chuoi' ? b.buoc.join(' ').replace(/[^\p{L}\p{N}]/gu, ' ') // bước đã giải mã sẵn — đừng giải mã lần 2
  : b.loai === 'danhSach' ? [b.dan ?? '', ...b.muc].join(' ')
  : b.loai === 'duAn' ? b.nhan + ' ' + b.html : b.html).map((t, i) => k[i].loai === 'chuoi' ? t : giaiMaThucThe(t.replace(/<[^>]*>/g, ' '))).join(' ');
const chuSoTho = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const ds = (await napTatCa()).filter((x: any) => !x.loi);
let loi = 0, dem: Record<string, number> = {};
for (const x of ds) {
  const khoi = phanTichMoTa(x.description);
  for (const k of khoi) dem[k.loai] = (dem[k.loai] || 0) + 1;
  if (chuSo(x.description) !== chuSoTho(chuHienThi(khoi))) {
    loi++;
    if (loi <= 5) console.log('MẤT CHỮ:', x.nguon, '\n  goc:', chuSo(x.description).slice(0, 200), '\n  sau:', chuSoTho(chuHienThi(khoi)).slice(0, 200));
  }
  // requirements: tachCauDai không được mất chữ so với tachGachDauDong
  const r = tachGachDauDong(x.requirements);
  if (chuSo(r.join(' ')) !== chuSo(tachCauDai(r).join(' '))) { loi++; console.log('MẤT CHỮ requirements:', x.nguon); }
}
// Đối chứng: bộ kiểm phải BẮT được khi một mục danh sách bị cắt cụt.
{
  const x = ds.find((d: any) => d.slug === 'applied-cryptography');
  const k = phanTichMoTa(x.description) as any[];
  const d = k.find((b) => b.loai === 'danhSach'); d.muc[2] = d.muc[2].slice(0, 5);
  if (chuSo(x.description) === chuSoTho(chuHienThi(k))) { console.log('BỘ KIỂM HỎNG: không bắt được mất chữ'); loi++; }
  else console.log('Đối chứng: bộ kiểm bắt được mục bị cắt cụt ✔');
}
console.log(`Đã kiểm ${ds.length} mô tả (+ requirements). Mất chữ: ${loi}. Số khối theo loại:`, dem);
const mau = process.argv[2];
if (mau) console.log(JSON.stringify(phanTichMoTa(ds.find((x: any) => x.slug === mau)!.description), null, 2));
process.exit(loi ? 1 : 0);
