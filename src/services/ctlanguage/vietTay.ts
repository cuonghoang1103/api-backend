/**
 * CT Language — NHẬN CHỮ VIẾT TAY (Hán / kanji / kana) theo NÉT.
 *
 * Vì sao không dùng OCR: Vision của Apple (đo 12/11 trên Mac lẫn máy ảo) KHÔNG nhận ra một chữ Hán viết tay đứng riêng —
 * nó cần cả dòng chữ. Ở đây so trực tiếp các NÉT người dùng vẽ (thứ tự + hướng + vị trí) với ĐƯỜNG TIM nét của từng chữ
 * trong dữ liệu hanzi-writer (đã có sẵn cho tuyến `/my-language/hanzi-stroke`): Trung = gói `hanzi-writer-data`
 * (Make Me a Hanzi, 9.575 chữ), Nhật = `data/hanzi-graphics-ja.txt.gz` + `kana-graphics-ja.txt.gz` (animCJK).
 *
 * Cách chấm (thuần, có kiểm thử):
 *   1. Mỗi nét lấy mẫu lại thành N điểm cách đều theo độ dài; cả chữ chuẩn hoá theo KHUNG BAO (giữ tỉ lệ, căn giữa) ⇒
 *      viết nhỏ / lệch góc vẫn khớp.
 *   2. So nét thứ i của người với nét thứ i của chữ mẫu (người học viết đúng thứ tự — đúng thứ ta muốn họ học); khoảng
 *      cách = trung bình khoảng cách điểm-điểm. Lệch số nét ⇒ cộng phạt mỗi nét thiếu/thừa.
 *   3. Chỉ xét chữ có số nét trong ±2 của người viết ⇒ mỗi lần ~1–2 nghìn chữ, vài chục ms.
 */
import { readFile } from 'node:fs/promises';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { BadRequestError } from '../../middleware/errorHandler.js';

export type Diem = [number, number];
export type Net = Diem[];

const N = 10;              // số điểm mẫu mỗi nét
const PHAT_SO_NET = 0.18;  // phạt mỗi nét lệch (đơn vị = cạnh khung đã chuẩn hoá)

/** Lấy mẫu lại một nét thành N điểm cách đều theo chiều dài. Nét chỉ một điểm ⇒ N điểm trùng nhau. */
export function layMau(net: Net, n = N): Net {
  if (net.length === 0) return [];
  if (net.length === 1) return Array.from({ length: n }, () => net[0]);
  const doDai: number[] = [0];
  for (let i = 1; i < net.length; i++) doDai.push(doDai[i - 1] + Math.hypot(net[i][0] - net[i - 1][0], net[i][1] - net[i - 1][1]));
  const tong = doDai[doDai.length - 1] || 1;
  const ra: Net = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const muc = (tong * k) / (n - 1);
    while (j < net.length - 1 && doDai[j] < muc) j++;
    const a = net[j - 1], b = net[j];
    const doan = doDai[j] - doDai[j - 1] || 1;
    const t = Math.min(1, Math.max(0, (muc - doDai[j - 1]) / doan));
    ra.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return ra;
}

/** Chuẩn hoá cả chữ vào khung [0,1]² theo khung bao (giữ tỉ lệ, căn giữa). Nét ngang/dọc đơn lẻ không bị kéo giãn. */
export function chuanHoa(dsNet: Net[]): Net[] {
  const tat = dsNet.flat();
  if (!tat.length) return [];
  const xs = tat.map((p) => p[0]), ys = tat.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const canh = Math.max(x1 - x0, y1 - y0, 1e-6);
  const dx = (canh - (x1 - x0)) / 2, dy = (canh - (y1 - y0)) / 2;
  return dsNet.map((net) => net.map(([x, y]) => [(x - x0 + dx) / canh, (y - y0 + dy) / canh] as Diem));
}

/** Khoảng cách giữa hai chữ đã chuẩn hoá + lấy mẫu (nhỏ = giống). */
export function khoangCach(nguoi: Net[], mau: Net[]): number {
  const k = Math.min(nguoi.length, mau.length);
  if (!k) return Infinity;
  let tong = 0;
  for (let i = 0; i < k; i++) {
    let s = 0;
    for (let t = 0; t < N; t++) s += Math.hypot(nguoi[i][t][0] - mau[i][t][0], nguoi[i][t][1] - mau[i][t][1]);
    tong += s / N;
  }
  return tong / k + PHAT_SO_NET * Math.abs(nguoi.length - mau.length);
}

// ─── Kho mẫu (nạp lười một lần, ~1–2 s) ──────────────────────

interface Mau { chu: string; net: Net[] }
const kho: Partial<Record<'zh' | 'ja', Promise<Map<number, Mau[]>>>> = {};

/** hanzi-writer: hệ 1024, gốc DƯỚI, y từ -124 tới 900 ⇒ lật y = 900 − y (cùng phép của app iOS NetChu.swift). */
function mauTuMedians(chu: string, medians: number[][][]): Mau | null {
  if (!Array.isArray(medians) || !medians.length) return null;
  const net = medians.map((m) => m.map(([x, y]) => [x, 900 - y] as Diem));
  return { chu, net: chuanHoa(net).map((n) => layMau(n)) };
}

function themVao(map: Map<number, Mau[]>, m: Mau | null) {
  if (!m) return;
  const ds = map.get(m.net.length) ?? [];
  ds.push(m);
  map.set(m.net.length, ds);
}

async function napZh(): Promise<Map<number, Mau[]>> {
  const map = new Map<number, Mau[]>();
  const req = createRequire(import.meta.url);
  const dir = path.dirname(req.resolve('hanzi-writer-data/package.json'));
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.json') || f === 'package.json' || f === 'all.json') continue;
    try {
      const j = JSON.parse(readFileSync(path.join(dir, f), 'utf8')) as { medians?: number[][][] };
      themVao(map, mauTuMedians(f.slice(0, -5), j.medians ?? []));
    } catch { /* tệp hỏng: bỏ qua chữ đó */ }
  }
  return map;
}

async function napJa(): Promise<Map<number, Mau[]>> {
  const map = new Map<number, Mau[]>();
  for (const ten of ['hanzi-graphics-ja.txt.gz', 'kana-graphics-ja.txt.gz']) {
    try {
      const raw = await readFile(path.join(process.cwd(), 'data', ten));
      for (const dong of gunzipSync(raw).toString('utf8').split('\n')) {
        if (!dong.trim()) continue;
        try {
          const j = JSON.parse(dong) as { character?: string; medians?: number[][][] };
          if (j.character) themVao(map, mauTuMedians(j.character, j.medians ?? []));
        } catch { /* dòng hỏng */ }
      }
    } catch { /* thiếu tệp: mất phần đó, không chết cả bộ */ }
  }
  return map;
}

function layKho(nn: 'zh' | 'ja') {
  if (!kho[nn]) kho[nn] = (nn === 'zh' ? napZh() : napJa()).catch((e) => { delete kho[nn]; throw e; });
  return kho[nn]!;
}

/** Kiểm thân yêu cầu: tối đa 40 nét × 400 điểm, số hữu hạn. */
export function kiemNet(than: unknown): Net[] {
  if (!Array.isArray(than) || !than.length || than.length > 40) throw new BadRequestError('net phải là 1–40 nét', 'CTL_VIET_TAY_SAI');
  return than.map((net) => {
    if (!Array.isArray(net) || !net.length || net.length > 400) throw new BadRequestError('Mỗi nét 1–400 điểm', 'CTL_VIET_TAY_SAI');
    return net.map((p) => {
      if (!Array.isArray(p) || p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) throw new BadRequestError('Điểm phải là [x, y]', 'CTL_VIET_TAY_SAI');
      return [Number(p[0]), Number(p[1])] as Diem;
    });
  });
}

/** Các chữ giống nét vẽ nhất (tốt nhất trước). `tanSuat` (chữ → hạng, nhỏ = hay gặp) phá thế hoà. */
export async function nhanChu(nn: 'zh' | 'ja', netGoc: Net[], soUngVien = 12, tanSuat?: (c: string) => number | undefined): Promise<string[]> {
  const map = await layKho(nn);
  const nguoi = chuanHoa(netGoc).map((n) => layMau(n));
  const n = nguoi.length;
  const ketQua: { chu: string; d: number }[] = [];
  for (let k = Math.max(1, n - 2); k <= n + 2; k++) {
    for (const m of map.get(k) ?? []) ketQua.push({ chu: m.chu, d: khoangCach(nguoi, m.net) });
  }
  const phaHoa = (c: string) => { const f = tanSuat?.(c); return f ? Math.min(0.03, f / 100000) : 0.03; };
  ketQua.sort((a, b) => a.d + phaHoa(a.chu) - (b.d + phaHoa(b.chu)));
  return ketQua.slice(0, soUngVien).map((x) => x.chu);
}
