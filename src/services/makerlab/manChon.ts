/**
 * ============================================================
 * Maker Lab — CHỌN ĐÁP ÁN trên màn ngực (15/11/2026)
 * ============================================================
 *
 * Chủ robot: "nó không hiểu sẽ hiện yes/no hoặc đáp án trên màn hình để mình chọn… học ngôn ngữ, ôn thi…
 * hiện A, B, C, D… đúng thì biểu cảm vui, sai thì tức giận".
 *
 * Model kèm trường `"chon": {"hoi": "...", "luaChon": ["...", ...], "dung": 0}` vào JSON trả lời (persona.ts)
 * ⇒ `hoiChon` đẩy {t:"chon_mo"} xuống bo (firmware chon.cpp vẽ 2–4 nút lên vùng mắt).
 *   Chạm nút  ⇒ bo gửi {t:"chon", id, i} ⇒ `xuLyChamChon`.
 *   Nói "B" / "câu hai" / "có" / nói đúng nội dung đáp án ⇒ `khopChonBangGiong` (voiceLoop, trước cổng gọi tên).
 * Có `dung` ⇒ chấm ngay: bo tô nút xanh/đỏ, mắt vui (đúng) hoặc tức (sai), rồi một lượt hội thoại để robot
 * khen / cà khịa và hỏi câu tiếp. Không `dung` (Có/Không, chọn chủ đề…) ⇒ coi như người dùng nói câu đó.
 */
import { logger } from '../../utils/logger.js';

export interface CauChon { hoi: string; luaChon: string[]; dung?: number }

interface DangChon extends CauChon { id: number; den: number; projectId: number }

const _dang = new Map<number, DangChon>();
let _id = 1;
const CHU = ['A', 'B', 'C', 'D'];

/** Kiểm + cắt trường "chon" model trả. null = không dùng được. THUẦN. */
export function chuanCauChon(raw: unknown): CauChon | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const ds = Array.isArray(o.luaChon) ? o.luaChon : Array.isArray(o.options) ? o.options : null;
  if (!ds) return null;
  const luaChon = ds.map((x) => String(x ?? '').replace(/\s+/g, ' ').trim().slice(0, 60)).filter(Boolean).slice(0, 4);
  if (luaChon.length < 2) return null;
  const d = Number(o.dung ?? o.correct);
  return {
    hoi: String(o.hoi ?? o.question ?? '').replace(/\s+/g, ' ').trim().slice(0, 140),
    luaChon,
    ...(Number.isInteger(d) && d >= 0 && d < luaChon.length ? { dung: d } : {}),
  };
}

function khongDau(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Câu nói ⇒ chỉ số đáp án (−1 = không khớp). THUẦN — test đọc. */
export function khopChon(heard: string, luaChon: string[]): number {
  const s = khongDau(heard);
  if (!s || s.length > 80) return -1;
  // Giữ DẤU để phân biệt "có"/"cô", "à"/"A" (review 15/11: "Cô ơi cho cháu ly cà phê" từng thành Có).
  const g = heard.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const doc: Record<string, number> = { a: 0, b: 1, 'bê': 1, c: 2, 'xê': 2, d: 3, 'đê': 3 };
  // Chữ cái đứng MỘT MÌNH (cả câu) hoặc sau câu/chọn/đáp án.
  const chu = g.match(/^(?:(?:câu|đáp án|chọn|phương án|tao chọn|tôi chọn|chọn câu)\s+)?(a|b|c|d|bê|xê|đê)$/)
    ?? g.match(/(?:^|\s)(?:câu|đáp án|chọn|phương án)\s+(a|b|c|d|bê|xê|đê)(?=\s|$)/);
  if (chu && doc[chu[1]] !== undefined && doc[chu[1]] < luaChon.length) return doc[chu[1]];
  // Số thứ tự — so trên chữ CÓ DẤU: "bà" ≠ "ba", "cái tủ" ≠ "cái tư".
  const so = g.match(/(?:^|\s)(?:câu|số|phương án|đáp án|cái)\s+(một|hai|ba|bốn|tư|1|2|3|4)(?=\s|$)/) ?? g.match(/^(một|hai|ba|bốn|1|2|3|4)$/);
  const soMap: Record<string, number> = { 'một': 0, '1': 0, hai: 1, '2': 1, ba: 2, '3': 2, 'bốn': 3, 'tư': 3, '4': 3 };
  if (so && soMap[so[1]] < luaChon.length) return soMap[so[1]];
  // Có / Không dạng nói tự nhiên — so trên chữ CÓ DẤU, câu ngắn.
  const co = luaChon.findIndex((x) => /^(co|yes|dong y|ok)$/.test(khongDau(x)));
  const khong = luaChon.findIndex((x) => /^(khong|no|thoi)$/.test(khongDau(x)));
  if (g.split(' ').length <= 6) {
  // ⚠️ Không dùng \b với chữ có dấu: JS coi "ừ", "ó" là ký tự không-thuộc-từ.
  if (co >= 0 && /^(có|ừ|ừm|ok|oke|okay|yes|được|đồng ý)(?=\s|$)/.test(g)) return co;   // "có chứ sao không" ⇒ Có
  if (khong >= 0 && /^(không|thôi|no|khỏi|chưa)(?=\s|$)/.test(g)) return khong;
  }
  // Nói đúng nội dung đáp án (dài nhất khớp trước để "không" không ăn "không chắc").
  // So CÓ DẤU ("táo" ≠ "tao"); bỏ dấu chỉ khi đáp án vốn không dấu (từ tiếng Anh) — Whisper hay mất dấu tiếng Việt chứ không thêm dấu vào từ Anh.
  const chuanCoDau = (x: string) => x.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const nd = luaChon
    .map((x, i) => { const k = chuanCoDau(x); return { i, k, ascii: k === khongDau(x) }; })
    .filter((x) => x.k.length >= 1).sort((a, b) => b.k.length - a.k.length);
  for (const x of nd) {
    const nguon = x.ascii ? s : g;
    if (nguon === x.k || (x.k.length >= 3 && (` ${nguon} `).includes(` ${x.k} `))) return x.i;
  }
  return -1;
}

export async function hoiChon(deviceId: number, projectId: number, c: CauChon, msHan = 45_000): Promise<number | null> {
  const { notifyDevice } = await import('../../socket/device.gateway.js');
  const id = _id++;
  const o = c.luaChon.map((x, i) => catByte(c.luaChon.length > 2 || /^[A-D][.)]/.test(x) ? `${CHU[i]}. ${x.replace(/^[A-D][.)]\s*/, '')}` : x, 57));
  const ok = notifyDevice(deviceId, { t: 'chon_mo', id, q: catByte(c.hoi, 137), o, ms: msHan });
  if (!ok) return null;
  _dang.set(deviceId, { ...c, id, den: Date.now() + msHan, projectId });
  return id;
}

export function dangChon(deviceId: number): CauChon | null {
  const d = _dang.get(deviceId);
  if (!d) return null;
  if (d.den < Date.now()) { _dang.delete(deviceId); return null; }
  return d;
}

/** Chốt một lựa chọn: báo bo (tô nút, đổi mặt) và trả câu đưa vào lượt hội thoại. */
async function chot(deviceId: number, d: DangChon, i: number, cach: 'cham' | 'giong'): Promise<string> {
  _dang.delete(deviceId);
  const { notifyDevice } = await import('../../socket/device.gateway.js');
  const coDapAn = d.dung !== undefined;
  const dung = coDapAn && i === d.dung;
  notifyDevice(deviceId, { t: 'chon_ket', id: d.id, dung: coDapAn ? d.dung : -1, chon: i, mat: coDapAn ? (dung ? 'excited' : 'angry') : '' });
  const nhan = `${d.luaChon.length > 2 ? `${CHU[i]}. ` : ''}${d.luaChon[i]}`;
  logger.info('MakerLab chọn đáp án', { deviceId, cach, i, dung: coDapAn ? dung : null });
  if (!coDapAn) return d.luaChon[i];
  return `[${cach === 'cham' ? 'Chạm màn' : 'Nói'} chọn ${nhan} cho câu: ${d.hoi}] — ${dung ? 'ĐÚNG' : `SAI, đáp án đúng là ${CHU[d.dung!]}. ${d.luaChon[d.dung!]}`}. ` +
    `${dung ? 'Khen kiểu bạn thân (camXuc excited/proud)' : 'Cà khịa, tức giận vui (camXuc angry/annoyed), giải thích ngắn vì sao'} rồi ra câu tiếp nếu đang chơi/ôn.`;
}

/** Bo báo chạm nút. Chạy một lượt hội thoại như thể người dùng vừa nói. */
export async function xuLyChamChon(deviceId: number, id: number, i: number): Promise<void> {
  const d = _dang.get(deviceId);
  if (!d || d.id !== id || !Number.isInteger(i) || i < 0 || i >= d.luaChon.length) return;
  const text = await chot(deviceId, d, i, 'cham');
  const { runVoiceTurn } = await import('./voiceLoop.js');
  await runVoiceTurn({ deviceId, projectId: d.projectId, text, cham: true });
}

/**
 * Lượt nói lúc khung đang mở: khớp đáp án ⇒ chấm như chạm, trả câu thay thế `heard`.
 * Không khớp ⇒ đóng khung (người ta đã chuyển chuyện) và trả null.
 */
export async function khopChonBangGiong(deviceId: number, heard: string): Promise<string | null> {
  const d = _dang.get(deviceId);
  if (!d) return null;
  if (d.den < Date.now()) { _dang.delete(deviceId); return null; }
  const i = khopChon(heard, d.luaChon);
  if (i >= 0) return chot(deviceId, d, i, 'giong');
  // Không khớp ⇒ GIỮ khung (tiếng người bên cạnh / TV không được đóng nó); hết hạn thì bo tự đóng.
  return null;
}

/** Bo vừa nối lại / rớt mạng ⇒ khung trên màn đã mất, quên luôn phía server (review 15/11). */
export function quenChon(deviceId: number): void {
  _dang.delete(deviceId);
}

/** Cắt theo BYTE UTF-8 ở ranh giới ký tự — firmware giới hạn bằng byte (chon.cpp). */
function catByte(s: string, toiDa: number): string {
  let ra = '';
  for (const ch of s) {
    if (Buffer.byteLength(ra + ch) > toiDa) return ra.trimEnd() + '…';
    ra += ch;
  }
  return ra;
}

/** Lời dặn thêm vào hợp đồng JSON (persona.ts). */
export const LUAT_CHON =
  '- "chon" (TUỲ CHỌN, đặt SAU "say"): khi ra câu đố trắc nghiệm, ôn từ, kiểm tra kiến thức, hoặc cần người dùng ' +
  'chọn/xác nhận (Có/Không, chọn chủ đề) — thêm {"hoi":"<câu hỏi ngắn hiện trên màn>","luaChon":["...","..."],"dung":<chỉ số ' +
  'đáp án đúng từ 0, bỏ trống nếu không có đúng/sai>}. 2–4 lựa chọn, mỗi cái ≤ 40 ký tự. Màn hiện nút để chạm, người ' +
  'dùng cũng có thể nói A/B/C/D. Trong "say" vẫn đọc câu hỏi và các lựa chọn. Khi KHÔNG CHẮC người dùng muốn gì ⇒ hỏi lại kèm "chon" ' +
  'gồm 2–3 khả năng. Không dùng "chon" cho tán gẫu thường.';
