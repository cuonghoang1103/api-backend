/**
 * CT Language — ĐÓNG GÓI dữ liệu nét chữ cho NHẬN VIẾT TAY TRÊN MÁY (app iOS, 15/11/2026).
 *
 *   npx tsx scripts/ctlanguage/goi-net-viet-tay.mts --ra ~/Downloads/ios-app/CuongThaiApp
 *
 * Sinh (dưới thư mục `--ra`):
 *   CTLanguageApp/Resources/VietTay/vt-zh.bin · vt-ja.bin   — gói nét (DEFLATE thô; app giải bằng Compression `.zlib`)
 *   CTLanguageTests/Fixtures/viet-tay-mau.json               — mẫu so khớp Swift ⇄ máy chủ
 *
 * Nguồn = ĐÚNG kho của máy chủ (`layKho` trong src/services/ctlanguage/vietTay.ts): Trung = hanzi-writer-data (Make Me a
 * Hanzi), Nhật = animCJK kanji + kana. Lấy TOÀN BỘ chữ (≈9,6k Trung + 7,2k Nhật) — lượng tử 10 bit vẫn chỉ ~3,3 MB nén, nên
 * không cần cắt về HSK/JLPT: kết quả trên máy trùng máy chủ thay vì "gần giống". Hạng tần suất (phá thế hoà) lấy từ
 * `ctl_chu_han.tan_suat` như máy chủ (cần CSDL; thiếu CSDL ⇒ dừng, đừng ra gói lệch máy chủ).
 *
 * Định dạng (trước khi nén), số nguyên little-endian:
 *   "CTVT" · u8 phiên bản (2) · u8 N (điểm/nét = 10) · u16 P (thang lượng tử = 1023) · u32 số chữ
 *   lặp: u8 số byte UTF-8 · chữ · u16 hạng tần suất (0 = không có; chặn 3000 — phaHoa bão hoà từ 3000) · u8 số nét ·
 *        mỗi nét N điểm, mỗi điểm x rồi y: số nguyên a = round(v × P) của toạ độ ĐÃ chuẩn hoá khung bao + lấy mẫu, ghi
 *        HIỆU với điểm trước trong cùng nét (điểm đầu ghi nguyên), mã zigzag + varint 7 bit (1–2 byte).
 *   Chữ xếp theo số nét tăng dần, trong cùng số nét GIỮ thứ tự nạp của máy chủ (thứ tự phá hoà khi bằng điểm tuyệt đối).
 *   Vì sao 10 bit + hiệu: đo 15/11 trên mẫu so khớp — 8 bit thô nén 3,9 MB mà top-1 lệch máy chủ 4/164 mẫu; 8 bit hiệu
 *   2,2 MB lệch 4/164; 10 bit hiệu 3,3 MB lệch 0/164 (9 bit 2,8 MB lệch 1/164).
 * Mẫu so khớp: mỗi mẫu = các nét (toạ độ nguyên, như app gửi) + `goi` = 12 ứng viên của `xepHang` chạy trên kho ĐÃ
 * LƯỢNG TỬ (Swift phải trùng TỪNG ứng viên) + `mayChu` = 12 ứng viên của máy chủ thật (kho đầy đủ) ⇒ đo độ khớp.
 * Giấy phép dữ liệu nét: Arphic Public License — tệp giấy phép đi kèm gói (VietTay/GIAY-PHEP-NET-CHU.txt).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { prisma } from '../../src/config/database.js';
import { layKho, xepHang, type Mau, type Net } from '../../src/services/ctlanguage/vietTay.js';

const iRa = process.argv.indexOf('--ra');
if (iRa < 0 || !process.argv[iRa + 1]) { console.error('Thiếu --ra <thư mục CuongThaiApp của ios-app>'); process.exit(1); }
const RA = path.resolve(process.argv[iRa + 1].replace(/^~/, process.env.HOME ?? '~'));
const N = 10;
const P = 1023;
const q = (v: number) => Math.max(0, Math.min(P, Math.round(v * P)));
/** zigzag + varint 7 bit. */
function ghiSo(ra: number[], d: number) { let z = d >= 0 ? d * 2 : -d * 2 - 1; while (z >= 128) { ra.push((z & 127) | 128); z >>= 7; } ra.push(z); }

const hang = new Map((await prisma.ctlChuHan.findMany({ where: { tanSuat: { not: null } }, select: { chu: true, tanSuat: true } }))
  .map((d) => [d.chu, d.tanSuat!]));
await prisma.$disconnect();
if (hang.size < 1000) { console.error(`ctl_chu_han chỉ có ${hang.size} hạng tần suất — CSDL chưa nhập từ điển?`); process.exit(1); }
const tanSuat = (c: string) => hang.get(c);

function dongGoi(map: Map<number, Mau[]>): { raw: Buffer; luongTu: Map<number, Mau[]>; soChu: number } {
  const phan: Buffer[] = [];
  const luongTu = new Map<number, Mau[]>();
  let soChu = 0;
  for (const k of [...map.keys()].sort((a, b) => a - b)) {
    for (const m of map.get(k)!) {
      const chu = Buffer.from(m.chu, 'utf8');
      if (chu.length > 255 || m.net.length > 255) continue;
      const so: number[] = [];
      const net: Net[] = m.net.map((n) => {
        let px = 0, py = 0;
        return n.map(([x, y], i) => {
          const a = q(x), c = q(y);
          ghiSo(so, i ? a - px : a); ghiSo(so, i ? c - py : c);
          px = a; py = c;
          return [a / P, c / P] as [number, number];
        });
      });
      const b = Buffer.alloc(1 + chu.length + 2 + 1 + so.length);
      let o = 0;
      b.writeUInt8(chu.length, o++); chu.copy(b, o); o += chu.length;
      b.writeUInt16LE(Math.min(3000, hang.get(m.chu) ?? 0), o); o += 2;
      b.writeUInt8(m.net.length, o++);
      Buffer.from(so).copy(b, o);
      phan.push(b);
      const ds = luongTu.get(k) ?? []; ds.push({ chu: m.chu, net }); luongTu.set(k, ds);
      soChu++;
    }
  }
  const dau = Buffer.alloc(12);
  dau.write('CTVT', 0); dau.writeUInt8(2, 4); dau.writeUInt8(N, 5); dau.writeUInt16LE(P, 6); dau.writeUInt32LE(soChu, 8);
  return { raw: Buffer.concat([dau, ...phan]), luongTu, soChu };
}

// "Viết tay" giả — y hệt `vietGia` trong vietTay.test.ts (co 30%, dời góc, rung ±3%, hạt cố định) + toạ độ nguyên như app gửi.
function vietGia(net: Net[], hat = 7, co = 0.3): Net[] {
  let s = hat;
  const ngau = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 - 0.5; };
  return net.map((n) => n.map(([x, y]) => [Math.round(x * co + 40 + ngau() * 9), Math.round(y * co + 70 + ngau() * 9)] as [number, number]));
}

const req = createRequire(import.meta.url);
const dirZh = path.dirname(req.resolve('hanzi-writer-data/package.json'));
const goc = new Map<string, Net[]>();
function medians(nn: 'zh' | 'ja', c: string): Net[] | null {
  if (nn === 'zh') {
    try { return (JSON.parse(readFileSync(path.join(dirZh, `${c}.json`), 'utf8')).medians as number[][][]).map((m) => m.map(([x, y]) => [x, 900 - y] as [number, number])); } catch { return null; }
  }
  return goc.get(c) ?? null;
}
// Nhật: đọc medians gốc (chưa chuẩn hoá) từ tệp animCJK để dựng mẫu viết.
const { gunzipSync } = await import('node:zlib');
for (const ten of ['hanzi-graphics-ja.txt.gz', 'kana-graphics-ja.txt.gz']) {
  for (const dong of gunzipSync(readFileSync(path.join(process.cwd(), 'data', ten))).toString('utf8').split('\n')) {
    if (!dong.trim()) continue;
    const j = JSON.parse(dong) as { character?: string; medians?: number[][][] };
    if (j.character && j.medians?.length) goc.set(j.character, j.medians.map((m) => m.map(([x, y]) => [x, 900 - y] as [number, number])));
  }
}

const CHU_MAU = {
  zh: ['人', '学', '中', '我', '水', '国', '大', '爱', '书', '好', '的', '是', '了', '们', '语', '汉', '字', '龙', '鸟', '飞', '谢', '口', '日', '月'],
  ja: ['気', '読', '毎', 'あ', 'ア', '学', '日', '本', '語', '漢', '字', 'き', 'ツ', 'シ', 'ん', '書', '食', '話'],
} as const;

const mau: { nn: string; chu: string; kieu: string; net: number[][][]; goi: string[]; mayChu: string[] }[] = [];
const tongKet: Record<string, unknown> = {};
mkdirSync(path.join(RA, 'CTLanguageApp/Resources/VietTay'), { recursive: true });
for (const nn of ['zh', 'ja'] as const) {
  const kho = await layKho(nn);
  const { raw, luongTu, soChu } = dongGoi(kho);
  const nen = deflateRawSync(raw, { level: 9 });
  writeFileSync(path.join(RA, `CTLanguageApp/Resources/VietTay/vt-${nn}.bin`), nen);
  let top1 = 0, top3 = 0, tong = 0, trungHet = 0;
  for (const c of CHU_MAU[nn]) {
    const m = medians(nn, c);
    if (!m) { console.warn(`thiếu nét ${nn} ${c}`); continue; }
    const kieu: [string, Net[]][] = [
      ['sach', m.map((n) => n.map(([x, y]) => [Math.round(x), Math.round(y)] as [number, number]))],
      ['meo', vietGia(m)],
      ['meo-to', vietGia(m, 13, 0.8)],
    ];
    if (m.length > 2) kieu.push(['thieu-net-cuoi', vietGia(m.slice(0, -1), 3)]);
    for (const [k, net] of kieu) {
      const goi = xepHang(luongTu, net, 12, tanSuat);
      const mayChu = xepHang(kho, net, 12, tanSuat);
      mau.push({ nn, chu: c, kieu: k, net, goi, mayChu });
      tong++;
      if (goi[0] === mayChu[0]) top1++;
      if (mayChu.slice(0, 3).every((x) => goi.slice(0, 3).includes(x))) top3++;
      if (goi.join('') === mayChu.join('')) trungHet++;
    }
  }
  tongKet[nn] = { soChu, raw: raw.length, nen: nen.length, mau: tong, trungTop1: top1, trungTop3: top3, trungCa12: trungHet };
}
mkdirSync(path.join(RA, 'CTLanguageTests/Fixtures'), { recursive: true });
writeFileSync(path.join(RA, 'CTLanguageTests/Fixtures/viet-tay-mau.json'), JSON.stringify({ sinhLuc: new Date().toISOString().slice(0, 10), tongKet, mau }));
writeFileSync(path.join(RA, 'CTLanguageApp/Resources/VietTay/GIAY-PHEP-NET-CHU.txt'), readFileSync(path.join(process.cwd(), 'data/HANZI-DATA-LICENSE.txt'), 'utf8')
  + '\n\n— vt-zh.bin / vt-ja.bin: đường tim nét của hai bộ trên, chuẩn hoá theo khung bao, lấy mẫu 10 điểm/nét, lượng tử 10 bit.\n'
  + 'Sinh bằng api-backend scripts/ctlanguage/goi-net-viet-tay.mts (Arphic Public License).\n');
console.log(JSON.stringify(tongKet, null, 2));
