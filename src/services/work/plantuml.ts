/**
 * CT Work — dm5 G2 (27/11/2026) B18: PLANTUML trong Diagram Studio.
 *
 *   - Nguồn `.puml` lưu NGUYÊN VĂN (format PLANTUML); dò loại sơ đồ theo từ khoá; kiểm @startuml/@enduml.
 *   - Vẽ SVG ở MÁY CHỦ RENDER TỰ HOST (plantuml/plantuml-server — biến `PLANTUML_SERVER_URL`, vd http://plantuml:8080). KHÔNG
 *     bao giờ gửi nguồn ra dịch vụ công cộng (plantuml.com): sơ đồ của dự án là dữ liệu nội bộ. Thiếu biến ⇒ 503 có hướng dẫn,
 *     trang vẫn hiện mã nguồn.
 *   - Chặn `!include`/`!includeurl`/`!import`/`!includesub` (đọc tệp/URL TRÊN máy render) và SVG trả về được làm sạch
 *     (bỏ <script>, on*=, <foreignObject>, href ngoài) trước khi tới trình duyệt.
 *   - Mã hoá URL đúng chuẩn PlantUML: deflate thô (RFC 1951) + bảng chữ base64 riêng của PlantUML ("0-9A-Za-z-_").
 */

import { deflateRawSync } from 'node:zlib';
import type { DiagramType } from './diagram.js';

export const PLANTUML_EXT = /\.(puml|plantuml|pu|iuml|wsd)$/i;
export const MAX_PLANTUML = 60_000;

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const enc6 = (b: number) => ALPHABET[b & 0x3f];
function append3(b1: number, b2: number, b3: number): string {
  return enc6(b1 >> 2) + enc6(((b1 & 0x3) << 4) | (b2 >> 4)) + enc6(((b2 & 0xf) << 2) | (b3 >> 6)) + enc6(b3 & 0x3f);
}

/** Văn bản PlantUML ⇒ chuỗi mã hoá dùng trong URL `/svg/<…>` của plantuml-server. */
export function plantumlEncode(text: string): string {
  const data = deflateRawSync(Buffer.from(text, 'utf8'), { level: 9 });
  let out = '';
  for (let i = 0; i < data.length; i += 3) out += append3(data[i], data[i + 1] ?? 0, data[i + 2] ?? 0);
  return out;
}

export interface PumlLint { ok: boolean; errors: Array<{ line: number; message: string }> }

/** Kiểm thô: có cặp @startuml…@enduml (hoặc @startmindmap/@startgantt…), không include ngoài. */
export function lintPlantUml(src: string): PumlLint {
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n');
  const errors: PumlLint['errors'] = [];
  let open = 0;
  let starts = 0;
  lines.forEach((l, i) => {
    const t = l.trim();
    if (/^@start\w+/i.test(t)) { open++; starts++; }
    if (/^@end\w+/i.test(t)) { if (!open) errors.push({ line: i + 1, message: `"${t}" without a matching @start…` }); else open--; }
    if (/^!(include|includeurl|includesub|import)\b/i.test(t)) errors.push({ line: i + 1, message: `${t.split(/\s/)[0]} is not allowed — paste the included content into the diagram` });
  });
  if (!starts) errors.push({ line: 1, message: 'A PlantUML diagram starts with @startuml and ends with @enduml' });
  if (open) errors.push({ line: lines.length, message: 'Missing @enduml' });
  return { ok: !errors.length, errors };
}

/** Loại sơ đồ đoán từ từ khoá PlantUML. */
export function typeFromPlantUml(src: string): DiagramType {
  const s = String(src ?? '');
  if (/^\s*@startmindmap/im.test(s)) return 'MINDMAP';
  if (/^\s*@startgantt/im.test(s)) return 'GANTT';
  if (/^\s*(actor|usecase)\b|\(\s*[^)]+\)\s*as\b|^\s*:[^:]+:\s*-+>/im.test(s) && /usecase|\([^)]+\)/i.test(s)) return 'USE_CASE';
  if (/^\s*(entity|table)\b.*\{/im.test(s)) return 'ERD';
  if (/^\s*(abstract\s+)?(class|interface|enum)\s+\w+/im.test(s)) return 'CLASS';
  if (/^\s*\[\*\]\s*-+>|^\s*state\s+\w+/im.test(s)) return 'STATE';
  if (/^\s*(start|stop)\s*$|^\s*:[^;\n]+;\s*$/im.test(s)) return 'ACTIVITY';
  if (/^\s*(participant|boundary|control|database|collections|queue)\s+/im.test(s) || /^\s*\w+\s*-+>>?\s*\w+\s*:/m.test(s)) return 'SEQUENCE';
  if (/^\s*(node|component|cloud|artifact)\s+/im.test(s)) return 'DEPLOYMENT';
  return 'OTHER';
}

/** Làm sạch SVG trả về (máy render tự host vẫn coi là không tin cậy). */
export function sanitizeSvg(svg: string): string {
  return String(svg ?? '')
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|xlink:href)\s*=\s*("|')\s*(?!#)[^"']*\2/gi, '$1="#"');
}

export class PlantUmlUnavailable extends Error {}

let fetchOverride: ((url: string) => Promise<{ ok: boolean; status: number; text: string }>) | null = null;
/** CHỈ cho test: thay lời gọi máy render. */
export function _setPlantUmlFetchForTests(fn: typeof fetchOverride): void { fetchOverride = fn; }

export const plantumlServer = () => (process.env.PLANTUML_SERVER_URL ?? '').trim().replace(/\/+$/, '') || null;

/** Vẽ SVG ở máy render tự host. Không cấu hình ⇒ PlantUmlUnavailable. */
export async function renderPlantUml(source: string): Promise<string> {
  const base = plantumlServer();
  if (!base && !fetchOverride) throw new PlantUmlUnavailable('PlantUML rendering is not configured on this server (PLANTUML_SERVER_URL — a self-hosted plantuml-server). The source is kept and shown as text.');
  const url = `${base ?? 'http://plantuml.test'}/svg/${plantumlEncode(source)}`;
  const r = fetchOverride ? await fetchOverride(url) : await (async () => {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    return { ok: res.ok, status: res.status, text: await res.text() };
  })();
  // plantuml-server trả 400 kèm SVG báo lỗi cú pháp — vẫn là SVG hợp lệ để người xem chỗ sai.
  if (!r.text.includes('<svg')) throw new PlantUmlUnavailable(`The PlantUML server answered HTTP ${r.status} without an SVG`);
  return sanitizeSvg(r.text);
}
