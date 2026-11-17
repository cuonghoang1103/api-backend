/**
 * Nạp THƯ VIỆN NHẠC NỀN của CT Lồng Tiếng lên R2 (`long-tieng/nhac/`) từ `scripts/long-tieng-nhac.json` (18/11/2026).
 *
 *   npx tsx scripts/long-tieng-nhac.mts --thu        tải + chuẩn hoá vào thư mục tạm, KHÔNG đẩy (kiểm link/độ dài)
 *   npx tsx scripts/long-tieng-nhac.mts              tải + chuẩn hoá + đẩy lên R2 + ghi danh-sach.json
 *
 * ⚠️ Chạy KHÔNG có STORAGE_SANDBOX là đẩy lên bucket THẬT (cố ý — đây là tài nguyên dùng chung của trạm). Chỉ thêm bài có giấy phép
 * cho dùng không ràng buộc ghi công (CC0 / Pixabay Content License) và ghi đủ `nguon` + `giayPhep` — KHÔNG dùng bài hit có bản quyền.
 * Chuẩn hoá: mp3 192 kbps 44,1 kHz stereo, âm lượng −18 LUFS (trạm còn tự hạ + né giọng khi trộn).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { putObject } from '../src/config/r2.js';
import { KHOA_DANH_SACH_NHAC, THU_MUC_NHAC } from '../src/services/longTieng.service.js';

const thu = process.argv.includes('--thu');
const nguon = JSON.parse(readFileSync(path.join(import.meta.dirname, 'long-tieng-nhac.json'), 'utf8')) as {
  bai: { id: string; ten: string; tamTrang: string; tacGia?: string; nguon: string; tep: string; giayPhep: string }[];
};
const tam = mkdtempSync(path.join(os.tmpdir(), 'lt-nhac-'));
const ra: object[] = [];
try {
  for (const b of nguon.bai) {
    if (!/^[a-z0-9-]+$/.test(b.id)) throw new Error(`id xấu: ${b.id}`);
    const goc = path.join(tam, `${b.id}.goc`), mp3 = path.join(tam, `${b.id}.mp3`);
    execFileSync('curl', ['-sfL', '--retry', '3', '-A', 'Mozilla/5.0', '-o', goc, b.tep]);
    execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-i', goc, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '2', '-b:a', '192k', mp3]);
    const giay = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString().trim());
    const khoa = `${THU_MUC_NHAC}${b.id}.mp3`;
    if (!thu) await putObject(khoa, readFileSync(mp3), 'audio/mpeg');
    ra.push({ id: b.id, ten: b.ten, tamTrang: b.tamTrang, thoiLuong: Math.round(giay), khoa, nguon: b.nguon, giayPhep: b.giayPhep, tacGia: b.tacGia ?? null });
    console.log(`${thu ? '·' : '✓'} ${b.id.padEnd(22)} ${giay.toFixed(0).padStart(4)} s  ${b.giayPhep}  ${b.nguon}`);
  }
  const ds = JSON.stringify({ capNhat: new Date().toISOString(), bai: ra }, null, 1);
  if (thu) { writeFileSync(path.join(tam, 'danh-sach.json'), ds); console.log(`(thử) không đẩy gì — danh sách nháp: ${tam}/danh-sach.json`); }
  else { await putObject(KHOA_DANH_SACH_NHAC, Buffer.from(ds), 'application/json'); console.log(`✓ ${KHOA_DANH_SACH_NHAC} (${ra.length} bài)`); }
} finally {
  if (!thu) rmSync(tam, { recursive: true, force: true });
}
process.exit(0);
