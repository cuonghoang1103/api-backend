/**
 * Đóng gói vài tệp văn bản thành .zip NGAY trong trình duyệt (phương thức STORE — không nén), cho nút
 * "⬇ Starter" của đề lớn. Không kéo thư viện zip vào bundle: starter chỉ vài chục KB chữ.
 * Định dạng: PKWARE APPNOTE — local header + dữ liệu, rồi central directory, rồi EOCD. Tên UTF-8 (cờ bit 11).
 */
let BANG_CRC: Uint32Array | null = null;
function crc32(b: Uint8Array): number {
  if (!BANG_CRC) {
    BANG_CRC = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      BANG_CRC[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = BANG_CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function taoZip(tep: Array<{ name: string; code: string }>): Blob {
  const enc = new TextEncoder();
  const phan: Uint8Array[] = [];
  const trungTam: Uint8Array[] = [];
  let viTri = 0;
  for (const t of tep) {
    const ten = enc.encode(t.name.replace(/^\/+/, ''));
    const du = enc.encode(t.code);
    const crc = crc32(du);
    const dau = new Uint8Array(30 + ten.length);
    const v = new DataView(dau.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true); v.setUint16(8, 0, true);
    v.setUint16(10, 0, true); v.setUint16(12, 0x21, true); v.setUint32(14, crc, true);
    v.setUint32(18, du.length, true); v.setUint32(22, du.length, true); v.setUint16(26, ten.length, true); v.setUint16(28, 0, true);
    dau.set(ten, 30);
    const tt = new Uint8Array(46 + ten.length);
    const w = new DataView(tt.buffer);
    w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true); w.setUint16(8, 0x0800, true);
    w.setUint16(10, 0, true); w.setUint16(12, 0, true); w.setUint16(14, 0x21, true); w.setUint32(16, crc, true);
    w.setUint32(20, du.length, true); w.setUint32(24, du.length, true); w.setUint16(28, ten.length, true);
    w.setUint32(42, viTri, true);
    tt.set(ten, 46);
    phan.push(dau, du);
    trungTam.push(tt);
    viTri += dau.length + du.length;
  }
  const coTT = trungTam.reduce((s, x) => s + x.length, 0);
  const cuoi = new Uint8Array(22);
  const e = new DataView(cuoi.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, tep.length, true); e.setUint16(10, tep.length, true);
  e.setUint32(12, coTT, true); e.setUint32(16, viTri, true);
  return new Blob([...phan, ...trungTam, cuoi] as BlobPart[], { type: 'application/zip' });
}

export function taiVe(blob: Blob, tenTep: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tenTep;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
