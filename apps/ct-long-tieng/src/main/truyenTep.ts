/**
 * Truyền tệp lớn: tải LÊN (PUT ký sẵn R2) và tải VỀ (GET ký sẵn), có tiến độ và huỷ được.
 *
 * Tải về ghi vào `<tên>.part` rồi mới đổi tên: tệp dở không bao giờ mang tên thật (thư viện không nhặt nhầm), và
 * lần sau tải tiếp từ byte đã có bằng `Range` (máy chủ trả 206) — mất mạng giữa chừng một video 2 GB không phải
 * tải lại từ đầu. Máy chủ không hỗ trợ Range (trả 200) ⇒ ghi đè từ đầu, vẫn đúng.
 *
 * Tải lên: PUT ký sẵn một phát (R2/S3 không nối tiếp được một PUT); hỏng giữa chừng ⇒ gửi lại cả tệp.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export type TienDo = (da: number, tong: number) => void;

export class LoiTruyen extends Error {
  constructor(message: string, public readonly maHttp = 0) { super(message); }
}

function demByte(goc: number, tong: number, cb: TienDo): Transform {
  let da = goc;
  let lanCuoi = 0;
  return new Transform({
    transform(chunk: Buffer, _enc, done) {
      da += chunk.length;
      const t = Date.now();
      if (t - lanCuoi > 200 || da >= tong) { lanCuoi = t; cb(da, tong); }
      done(null, chunk);
    },
  });
}

export async function taiLen(url: string, duongDan: string, kieu: string, cb: TienDo, signal: AbortSignal): Promise<void> {
  const { size } = await fsp.stat(duongDan);
  const u = new URL(url);
  const mod = u.protocol === 'https:' ? https : u.protocol === 'http:' ? http : null;
  if (!mod) throw new LoiTruyen('URL tải lên không hợp lệ.');
  await new Promise<void>((resolve, reject) => {
    const req = mod.request(u, {
      method: 'PUT',
      headers: { 'Content-Type': kieu, 'Content-Length': String(size) },
      signal,
    }, (res) => {
      let than = '';
      res.on('data', (c: Buffer) => { if (than.length < 2000) than += c.toString(); });
      res.on('end', () => {
        const ma = res.statusCode ?? 0;
        if (ma >= 200 && ma < 300) resolve();
        else reject(new LoiTruyen(ma === 403 ? 'Link tải lên đã hết hạn hoặc bị từ chối (403).' : `Tải lên lỗi (HTTP ${ma}).`, ma));
      });
    });
    req.on('error', (e) => reject(signal.aborted ? new LoiTruyen('Đã huỷ.') : new LoiTruyen(`Tải lên đứt: ${e.message}`)));
    cb(0, size);
    pipeline(fs.createReadStream(duongDan), demByte(0, size, cb), req).catch((e: Error) => {
      if (!signal.aborted) reject(new LoiTruyen(`Tải lên đứt: ${e.message}`));
    });
  });
}

export async function taiVe(url: string, dich: string, kichThuocBiet: number, cb: TienDo, signal: AbortSignal): Promise<void> {
  const part = `${dich}.part`;
  let daCo = 0;
  try { daCo = (await fsp.stat(part)).size; } catch { /* chưa có */ }
  const res = await fetch(url, { headers: daCo > 0 ? { Range: `bytes=${daCo}-` } : {}, signal, redirect: 'follow' })
    .catch((e: Error) => { throw new LoiTruyen(signal.aborted ? 'Đã huỷ.' : `Không tải được: ${e.message}`); });
  if (res.status === 416 && daCo > 0 && kichThuocBiet > 0 && daCo >= kichThuocBiet) {
    // Đã đủ byte từ lần trước.
    await fsp.rename(part, dich);
    return;
  }
  if (!res.ok || !res.body) {
    throw new LoiTruyen(res.status === 403 ? 'Link tải đã hết hạn (403).' : `Tải về lỗi (HTTP ${res.status}).`, res.status);
  }
  const noiTiep = res.status === 206;
  const goc = noiTiep ? daCo : 0;
  const dai = Number(res.headers.get('content-length') ?? '0');
  const tong = dai > 0 ? goc + dai : kichThuocBiet;
  const ghi = fs.createWriteStream(part, { flags: noiTiep ? 'a' : 'w' });
  const { Readable } = await import('node:stream');
  await pipeline(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), demByte(goc, tong, cb), ghi, { signal })
    .catch((e: Error) => { throw new LoiTruyen(signal.aborted ? 'Đã huỷ.' : `Tải về đứt: ${e.message}`); });
  const that = (await fsp.stat(part)).size;
  if (tong > 0 && that !== tong) throw new LoiTruyen(`Tệp tải về thiếu (${that}/${tong} byte) — thử lại sẽ tải tiếp.`);
  await fsp.rename(part, dich);
}
