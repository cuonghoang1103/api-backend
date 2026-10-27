/**
 * Chấm TĨNH trong trình duyệt: trắc nghiệm (choice) · sắp xếp (order) · điền bảng (table).
 *
 * Đáp án KHÔNG có trong payload — chỉ có băm sha256(`${exerciseId}|${ma}|${dạng chuẩn}`) (`dapAnBam`,
 * máy chủ dựng ở src/services/codeLab.cham.ts). Ta chuẩn hoá câu trả lời Y HỆT máy chủ, băm, so.
 * Khi người học đăng nhập và Nộp, máy chủ chấm LẠI từ câu trả lời (không tin kết quả này) — kết quả
 * ở đây là để khách / người chưa nộp thấy ngay.
 */
import type { KetQuaKiem, TestsJson } from './kieu';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const chuoi = (v: unknown) => (v == null ? '' : String(v));

/** Bản sao `dapAnChuan` của máy chủ. */
export function dapAnChuan(loai: string, traLoi: unknown, opts: { phanBietHoa?: boolean } = {}): string {
  if (loai === 'choice') {
    const ds = Array.isArray(traLoi) ? traLoi : traLoi == null ? [] : [traLoi];
    return [...new Set(ds.map(chuoi).filter(Boolean))].sort().join(',');
  }
  if (loai === 'order') return (Array.isArray(traLoi) ? traLoi : []).map(chuoi).join('>');
  const s = chuoi(traLoi).trim().replace(/\s+/g, ' ');
  return opts.phanBietHoa ? s : s.toLowerCase();
}

// ─── sha256: SubtleCrypto nếu có (cần ngữ cảnh an toàn), không thì bản JS thuần ───────────
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export function sha256Js(text: string): string {
  const data = new TextEncoder().encode(text);
  const len = data.length;
  const nBlocks = Math.ceil((len + 9) / 64);
  const buf = new Uint8Array(nBlocks * 64);
  buf.set(data);
  buf[len] = 0x80;
  const bits = len * 8;
  const dv = new DataView(buf.buffer);
  dv.setUint32(buf.length - 8, Math.floor(bits / 0x100000000));
  dv.setUint32(buf.length - 4, bits >>> 0);
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const W = new Uint32Array(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let b = 0; b < nBlocks; b++) {
    for (let t = 0; t < 16; t++) W[t] = dv.getUint32(b * 64 + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }
    let [a, bb, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & bb) ^ (a & c) ^ (bb & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = bb; bb = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + bb) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return Array.from(H, (x) => x.toString(16).padStart(8, '0')).join('');
}

export async function sha256(text: string): Promise<string> {
  try {
    const sub = globalThis.crypto?.subtle;
    if (sub) {
      const d = await sub.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, '0')).join('');
    }
  } catch { /* không phải ngữ cảnh an toàn — dùng bản JS */ }
  return sha256Js(text);
}

const bam = (exId: number, ma: string, chuan: string) => sha256(`${exId}|${ma}|${chuan}`);

/** Câu trả lời: choice/order ⇒ { [maCau]: giá trị } · table ⇒ { "<maBang>.<maHang>.<maCot>": "giá trị" } */
export type TraLoiTinh = Record<string, unknown>;

export async function chamTinh(exerciseId: number, tj: TestsJson, traLoi: TraLoiTinh): Promise<KetQuaKiem[]> {
  const out: KetQuaKiem[] = [];
  if (tj.loai === 'table') {
    for (const b of (Array.isArray(tj.bang) ? tj.bang : []).filter(isObj)) {
      const ma = String(b.ma ?? '');
      const cot = (Array.isArray(b.cot) ? b.cot : []).filter(isObj);
      for (const [o, ds] of Object.entries(isObj(b.dapAnBam) ? b.dapAnBam : {})) {
        const maCot = o.split('.').pop();
        const hoa = !!cot.find((c) => c.ma === maCot && c.phanBietHoa === true);
        const chuan = dapAnChuan('table', traLoi[`${ma}.${o}`], { phanBietHoa: hoa });
        const h = chuan ? await bam(exerciseId, `${ma}.${o}`, chuan) : '';
        const [maHang] = o.split('.');
        const hang = (Array.isArray(b.hang) ? b.hang : []).filter(isObj).find((x) => x.ma === maHang);
        const dau = cot[0] && hang && isObj(hang.o) ? hang.o[String(cot[0].ma)] : null;
        const tenCot = cot.find((c) => c.ma === maCot)?.ten ?? maCot;
        out.push({ i: out.length, dat: !!h && (ds as string[]).includes(h), nhom: typeof b.nhom === 'string' ? b.nhom : null, moTa: `${dau ?? maHang} · ${tenCot}` });
      }
    }
    return out;
  }
  for (const c of (Array.isArray(tj.cauHoi) ? tj.cauHoi : []).filter(isObj)) {
    const ma = String(c.ma ?? '');
    const chuan = dapAnChuan(tj.loai, traLoi[ma]);
    const h = chuan ? await bam(exerciseId, ma, chuan) : '';
    out.push({ i: out.length, dat: !!h && ((c.dapAnBam as string[]) || []).includes(h), nhom: typeof c.nhom === 'string' ? c.nhom : null, moTa: `Câu ${out.length + 1}` });
  }
  return out;
}
