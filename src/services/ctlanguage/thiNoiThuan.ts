/**
 * CT Language — THI NÓI VỚI GIÁM KHẢO AI (15/11/2026): phần THUẦN — khuôn "đề nói", dựng kịch bản giám khảo từ đề IELTS
 * Speaking của web (Part 1–2–3) và từ đề HSKK sẵn có, chấm phần nhắc lại, gộp điểm HSKK.
 *
 *   npx tsx --test src/services/ctlanguage/thiNoiThuan.test.ts
 *
 * Giám khảo đi theo KỊCH BẢN (như phòng thi thật: giám khảo IELTS đọc câu hỏi trong sổ, HSKK phát băng) — mỗi lượt máy
 * chủ đọc đúng câu của bước kế, KHÔNG gọi model ⇒ nhanh, đúng đề, không tốn tiền. Model chỉ chạy MỘT lần lúc chấm.
 * App giữ nhịp: trần giây mỗi câu (`giayNoi`), trần giây mỗi phần (`giayToiDa` — hết giờ thì bỏ các câu còn lại của phần),
 * Part 2 có thẻ đề + `giayChuanBi`. Dịch vụ + CSDL: `thiNoi.ts`. Luồng tiếng: `/ctlanguage/ai/goi/luong` (`goiCuongMini.ts`).
 */
import { chuanHoaDapAn, type DeThi, type NnThi } from './thiThuan.js';

export const KIEU_BUOC = ['hoi', 'nhacLai', 'the', 'noiDai', 'ket'] as const;
export type KieuBuoc = (typeof KIEU_BUOC)[number];

export interface BuocNoi {
  /** id phần chứa bước này. */
  phan: string;
  /** hoi: hỏi–đáp · nhacLai: nghe rồi nhắc lại · the: đưa thẻ đề + chuẩn bị (không trả lời) · noiDai: nói dài theo thẻ · ket: lời kết. */
  kieu: KieuBuoc;
  /** Lời giám khảo (ngôn ngữ thi) — máy chủ đọc nguyên văn. */
  loi: string;
  /** Câu hỏi cốt lõi ghi vào bản ghi để chấm (mặc định = `loi`). nhacLai: câu phải nhắc lại. */
  hoi?: string;
  /** Thẻ đề (IELTS Part 2) hiện trên màn từ bước `the` tới hết bước `noiDai`. */
  the?: { de: string; goiY: string[] };
  /** Chữ hiện kèm trên màn (HSKK phần 3: câu hỏi + pinyin). */
  hien?: string;
  giayChuanBi?: number;
  /** Trần giây cho câu trả lời. 0 = bước không chờ trả lời (`the`, `ket`). */
  giayNoi: number;
  /** Câu làm quen (hỏi tên…) — không đưa vào chấm. */
  khongCham?: boolean;
}

export interface PhanNoi { id: string; ten: string; moTa: string; /** Trần giây cả phần; 0 = không giới hạn. */ giayToiDa: number }

export interface DeNoi {
  id: string;
  nn: NnThi;
  /** IELTS | HSKK */
  kyThi: string;
  /** IELTS-NOI | HSKK-SO */
  cap: string;
  ten: string;
  moTa: string;
  phut: number;
  /** Điểm đạt: IELTS = band × 10 (60 = band 6.0) trên 90; HSKK = 60 trên 100. */
  diemDat: number;
  diemToiDa: number;
  /** id đề gốc (đề IELTS Speaking của web / đề HSKK của phòng thi) — ghi vào sổ chấm. */
  nguon?: string;
  phan: PhanNoi[];
  buoc: BuocNoi[];
}

const coChu = (v: unknown, n = 1): v is string => typeof v === 'string' && v.trim().length >= n;

export function kiemDeNoi(de: DeNoi): string[] {
  const loi: string[] = [];
  const o = de?.id ?? '(không id)';
  if (!/^[a-z0-9-]{3,40}$/.test(String(de?.id ?? ''))) loi.push(`${o}: id phải khớp ^[a-z0-9-]{3,40}$`);
  if (!['en', 'ja', 'zh'].includes(de.nn)) loi.push(`${o}: nn phải là en|ja|zh`);
  if (!['IELTS', 'HSKK'].includes(de.kyThi)) loi.push(`${o}: kyThi phải là IELTS|HSKK`);
  if (!coChu(de.cap) || !coChu(de.ten) || !coChu(de.moTa)) loi.push(`${o}: thiếu cap/ten/moTa`);
  if (!(de.phut > 0 && de.phut <= 40)) loi.push(`${o}: phut 1–40`);
  if (!(de.diemToiDa > 0) || !(de.diemDat >= 0 && de.diemDat <= de.diemToiDa)) loi.push(`${o}: diemDat/diemToiDa không hợp lệ`);
  const idPhan = new Set((de.phan ?? []).map((p) => p.id));
  if (!de.phan?.length || idPhan.size !== de.phan.length) loi.push(`${o}: phan trống hoặc trùng id`);
  for (const p of de.phan ?? []) if (!coChu(p.ten) || !(p.giayToiDa >= 0)) loi.push(`${o}/${p.id}: thiếu tên phần / giayToiDa`);
  if (!Array.isArray(de.buoc) || de.buoc.length < 3 || de.buoc.length > 60) { loi.push(`${o}: buoc phải có 3–60 bước`); return loi; }
  let truoc = -1;
  de.buoc.forEach((b, i) => {
    const ob = `${o}/bước ${i + 1}`;
    if (!(KIEU_BUOC as readonly string[]).includes(b.kieu)) loi.push(`${ob}: kieu không hợp lệ`);
    if (!idPhan.has(b.phan)) loi.push(`${ob}: phần "${b.phan}" không có`);
    const vt = (de.phan ?? []).findIndex((p) => p.id === b.phan);
    if (vt < truoc) loi.push(`${ob}: các bước phải đi theo thứ tự phần`);
    truoc = Math.max(truoc, vt);
    if (!coChu(b.loi, 2) || b.loi.length > 900) loi.push(`${ob}: loi trống hoặc dài quá 900 ký tự`);
    if (/[\[\]{}<>]/.test(b.loi)) loi.push(`${ob}: loi không được chứa thẻ / ngoặc vuông`);
    if (b.kieu === 'the') {
      if (!b.the || !coChu(b.the.de, 8) || !Array.isArray(b.the.goiY)) loi.push(`${ob}: bước thẻ đề phải có the.de + the.goiY`);
      if (!(b.giayChuanBi! > 0)) loi.push(`${ob}: bước thẻ đề phải có giayChuanBi`);
      if (b.giayNoi !== 0) loi.push(`${ob}: bước thẻ đề không chờ trả lời (giayNoi = 0)`);
    } else if (b.kieu === 'ket') {
      if (b.giayNoi !== 0) loi.push(`${ob}: lời kết không chờ trả lời`);
    } else if (!(b.giayNoi >= 5 && b.giayNoi <= 150)) loi.push(`${ob}: giayNoi 5–150`);
    if (b.kieu === 'nhacLai' && !coChu(b.hoi)) loi.push(`${ob}: bước nhắc lại phải có hoi (câu gốc)`);
  });
  if (de.buoc[de.buoc.length - 1]!.kieu !== 'ket') loi.push(`${o}: bước cuối phải là lời kết`);
  if (de.buoc.filter((b) => b.kieu === 'ket').length !== 1) loi.push(`${o}: chỉ một lời kết`);
  return loi;
}

/** Tóm tắt cho danh mục. */
export function tomTatDeNoi(de: DeNoi) {
  return {
    id: de.id, nn: de.nn, kyThi: de.kyThi, cap: de.cap, ten: de.ten, moTa: de.moTa, phut: de.phut, diemDat: de.diemDat, diemToiDa: de.diemToiDa,
    soCau: de.buoc.filter((b) => b.giayNoi > 0 && !b.khongCham).length,
    phan: de.phan.map((p) => ({ id: p.id, ten: p.ten, moTa: p.moTa, soCau: de.buoc.filter((b) => b.phan === p.id && b.giayNoi > 0 && !b.khongCham).length })),
  };
}

// ─── IELTS Speaking: từ đề của web ────────────────────────────

/** Hình dạng `DeNoi` của web (`frontend/…/thi-may/de/types.ts`) — chỉ các trường dùng tới. */
export interface NguonNoiIelts {
  moTa: string;
  phut: number;
  part1: { chuDe: string; cau: string[] }[];
  part2: { cueCard: string; goiY: string[]; cauChot: string[] };
  part3: { chuDe: string; cau: string[] }[];
}

const haDau = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0]!.toLowerCase() + s.slice(1) : s);

export function deNoiIelts(so: number, muc: string, d: NguonNoiIelts, nguon: string): DeNoi {
  const buoc: BuocNoi[] = [];
  buoc.push({ phan: 'p1', kieu: 'hoi', khongCham: true, giayNoi: 15, loi: 'Good afternoon. My name is CuongMini, and I will be your examiner today. Can you tell me your full name, please?' });
  d.part1.forEach((t, ti) => t.cau.forEach((c, ci) => {
    const dan = ci > 0 ? '' : ti === 0
      ? `Thank you. Now, in this first part, I'd like to ask you some questions about yourself. Let's talk about ${haDau(t.chuDe)}. `
      : `Now let's talk about ${haDau(t.chuDe)}. `;
    buoc.push({ phan: 'p1', kieu: 'hoi', loi: dan + c, hoi: c, giayNoi: 40 });
  }));
  const dong = d.part2.cueCard.split('\n').map((x) => x.trim()).filter(Boolean);
  const deThe = dong[0]!;
  const goiY = dong.slice(1).filter((x) => !/^you should say:?$/i.test(x)).map((x) => x.replace(/^•\s*/, ''));
  buoc.push({
    phan: 'p2', kieu: 'the', giayChuanBi: 60, giayNoi: 0, the: { de: deThe, goiY },
    loi: `Thank you. Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here is your topic. ${deThe}`,
  });
  buoc.push({
    phan: 'p2', kieu: 'noiDai', giayNoi: 120, hoi: d.part2.cueCard.replace(/\n+/g, ' ').replace(/•\s*/g, '— '), the: { de: deThe, goiY },
    loi: "All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you start speaking now, please?",
  });
  d.part2.cauChot.forEach((c, i) => buoc.push({ phan: 'p2', kieu: 'hoi', loi: (i === 0 ? 'Thank you. ' : '') + c, hoi: c, giayNoi: 30 }));
  d.part3.forEach((t, ti) => t.cau.forEach((c, ci) => {
    const dan = ci > 0 ? '' : ti === 0
      ? `We've been talking about the topic on your card, and I'd like to discuss with you one or two more general questions related to this. Let's consider first of all ${haDau(t.chuDe)}. `
      : `Let's move on to ${haDau(t.chuDe)}. `;
    buoc.push({ phan: 'p3', kieu: 'hoi', loi: dan + c, hoi: c, giayNoi: 60 });
  }));
  buoc.push({ phan: 'p3', kieu: 'ket', giayNoi: 0, loi: 'Thank you very much. That is the end of the speaking test.' });
  return {
    id: `ielts-noi-de-${so}`, nn: 'en', kyThi: 'IELTS', cap: 'IELTS-NOI', ten: `IELTS Speaking · Đề ${so}`,
    moTa: `Giám khảo AI hỏi đủ Part 1–2–3 (${muc}). ${d.moTa}`.slice(0, 300), phut: d.phut, diemDat: 60, diemToiDa: 90, nguon,
    phan: [
      { id: 'p1', ten: 'Part 1 · Introduction & interview', moTa: 'Câu hỏi ngắn về bản thân, 4–5 phút', giayToiDa: 300 },
      { id: 'p2', ten: 'Part 2 · Long turn', moTa: 'Thẻ đề: 1 phút chuẩn bị, nói 1–2 phút', giayToiDa: 0 },
      { id: 'p3', ten: 'Part 3 · Discussion', moTa: 'Thảo luận sâu hơn về chủ đề Part 2, 4–5 phút', giayToiDa: 300 },
    ],
    buoc,
  };
}

// ─── HSKK: từ đề HSKK của phòng thi ───────────────────────────

/** Phần chữ Hán đứng đầu ("请介绍一下你的家人。 Qǐng… — Hãy…" ⇒ "请介绍一下你的家人。"). */
export function chuHanDau(s: string): string {
  const m = String(s ?? '').match(/^[^A-Za-zĀ-ɏ]+/);
  return (m ? m[0] : s).replace(/[\s—–-]+$/, '').trim();
}

/** Đề HSKK (`kyThi: HSKK`, 3 nhóm: nhắc lại · nghe–trả lời · trả lời) ⇒ kịch bản giám khảo. null nếu đề không đúng dạng. */
export function deNoiHskk(de: DeThi): DeNoi | null {
  const nhom = de.phan.flatMap((p) => p.nhom);
  if (de.kyThi !== 'HSKK' || nhom.length !== 3) return null;
  const [n1, n2, n3] = nhom as [typeof nhom[0], typeof nhom[0], typeof nhom[0]];
  const buoc: BuocNoi[] = [
    { phan: 'p1', kieu: 'hoi', khongCham: true, giayNoi: 10, loi: '你好！你叫什么名字？' },
    { phan: 'p1', kieu: 'hoi', khongCham: true, giayNoi: 10, loi: '你是哪国人？' },
  ];
  n1.cau.forEach((c, i) => {
    const cau = c.mau ?? c.nghe?.[0]?.t ?? '';
    buoc.push({ phan: 'p1', kieu: 'nhacLai', loi: (i === 0 ? '好，现在开始第一部分，听后重复。' : '') + cau, hoi: cau, giayNoi: 10 });
  });
  n2.cau.forEach((c, i) => {
    const hoi = c.nghe?.map((x) => x.t).join('') ?? chuHanDau(c.de ?? '');
    buoc.push({ phan: 'p2', kieu: 'hoi', loi: (i === 0 ? '现在开始第二部分，听后回答。' : '') + hoi, hoi, giayNoi: 12 });
  });
  const hoi3 = n3.cau.map((c) => ({ han: chuHanDau(c.de ?? ''), hien: c.de ?? '' }));
  buoc.push({
    phan: 'p3', kieu: 'the', giayChuanBi: 120, giayNoi: 0,
    the: { de: 'Phần 3 — trả lời hai câu hỏi, mỗi câu nói khoảng 1 phút rưỡi.', goiY: hoi3.map((h) => h.hien) },
    loi: '现在开始第三部分，回答问题。请先准备一下。',
  });
  hoi3.forEach((h, i) => buoc.push({ phan: 'p3', kieu: 'noiDai', loi: `第${['一', '二', '三'][i] ?? i + 1}个问题：${h.han}`, hoi: h.han, hien: h.hien, giayNoi: 90 }));
  buoc.push({ phan: 'p3', kieu: 'ket', giayNoi: 0, loi: '考试结束，谢谢你！' });
  return {
    id: `${de.id}-giam-khao`.slice(0, 40), nn: 'zh', kyThi: 'HSKK', cap: de.cap, ten: `${de.ten} · giám khảo AI`,
    moTa: 'Giám khảo AI đọc đề như phòng thi HSKK: nghe–nhắc lại 15 câu, nghe–trả lời 10 câu, trả lời 2 câu (thi thật chuẩn bị 7 phút, ở đây 2 phút). Cuối buổi chấm điểm /100.',
    phut: 17, diemDat: 60, diemToiDa: 100, nguon: de.id,
    phan: [
      { id: 'p1', ten: 'Phần 1 · 听后重复', moTa: 'Nghe rồi nhắc lại nguyên câu', giayToiDa: 0 },
      { id: 'p2', ten: 'Phần 2 · 听后回答', moTa: 'Nghe câu hỏi, trả lời ngắn', giayToiDa: 0 },
      { id: 'p3', ten: 'Phần 3 · 回答问题', moTa: 'Trả lời hai câu hỏi, mỗi câu ~1,5 phút', giayToiDa: 0 },
    ],
    buoc,
  };
}

// ─── Chấm ─────────────────────────────────────────────────────

/** Độ khớp 0…1 giữa câu người học nói (chữ máy nghe ra) và câu gốc — dãy con chung dài nhất trên chữ đã chuẩn hoá. */
export function doKhopNhacLai(noi: string, goc: string): number {
  const a = [...chuanHoaDapAn(noi)], b = [...chuanHoaDapAn(goc)];
  if (!a.length || !b.length) return 0;
  let truoc = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const nay = [0];
    for (let j = 1; j <= b.length; j++) nay[j] = a[i - 1] === b[j - 1] ? truoc[j - 1]! + 1 : Math.max(truoc[j]!, nay[j - 1]!);
    truoc = nay;
  }
  // Nói thừa nhiều chữ cũng bị trừ (2·LCS / (|a| + |b|)).
  return (2 * truoc[b.length]!) / (a.length + b.length);
}

export interface BanGhiNoi { buoc: number; text: string; giay: number }

/** Bản ghi app gửi ⇒ sạch: chỉ bước có thật + chờ trả lời, mỗi bước một dòng, chữ ≤ 4000. */
export function sachBanGhiNoi(de: DeNoi, raw: unknown): BanGhiNoi[] {
  const ra = new Map<number, BanGhiNoi>();
  for (const x of Array.isArray(raw) ? raw.slice(0, 80) : []) {
    const i = Number((x as { buoc?: unknown })?.buoc);
    const b = Number.isInteger(i) ? de.buoc[i] : undefined;
    if (!b || b.giayNoi <= 0) continue;
    const text = String((x as { text?: unknown }).text ?? '').trim().slice(0, 4000);
    const giay = Math.max(0, Math.min(200, Math.round(Number((x as { giay?: unknown }).giay) || 0)));
    ra.set(i, { buoc: i, text, giay });
  }
  return [...ra.values()].sort((a, b) => a.buoc - b.buoc);
}

/** Điểm phần nhắc lại (0–100) = trung bình độ khớp của MỌI câu nhắc lại trong đề (câu bỏ = 0). */
export function diemNhacLai(de: DeNoi, banGhi: BanGhiNoi[]): { diem: number; soCau: number; soKhop: number } {
  const cau = de.buoc.map((b, i) => ({ b, i })).filter((x) => x.b.kieu === 'nhacLai');
  if (!cau.length) return { diem: 0, soCau: 0, soKhop: 0 };
  const theo = new Map(banGhi.map((x) => [x.buoc, x]));
  const muc = cau.map((x) => doKhopNhacLai(theo.get(x.i)?.text ?? '', x.b.hoi ?? x.b.loi));
  return { diem: Math.round((muc.reduce((a, m) => a + m, 0) / cau.length) * 100), soCau: cau.length, soKhop: muc.filter((m) => m >= 0.8).length };
}

/** HSKK sơ cấp: nhắc lại 30% · nghe–trả lời 30% · trả lời 40% (đề thật chấm tổng thể /100, đạt 60). */
export function tongHskk(nhacLai: number, traLoiNgan: number, traLoiDai: number): number {
  const k = (x: number) => Math.min(100, Math.max(0, Number.isFinite(x) ? x : 0));
  return Math.round(k(nhacLai) * 0.3 + k(traLoiNgan) * 0.3 + k(traLoiDai) * 0.4);
}

export interface TieuChiNoi { ma: string; ten: string; diem: number; nhanXet: string }
/** Kết quả chấm gửi app — cùng dáng `KetQuaCham` của cuộc gọi CuongMini (+ lỗi cần sửa). */
export interface KetQuaThiNoi {
  thang: 'band' | 'diem';
  tong: number;
  dat: boolean;
  tieuChi: TieuChiNoi[];
  nhanXet: string;
  goiY: string[];
  loi: { goc: string; sua: string; vi: string }[];
  /** Phát âm chấm từ đâu: 'chu' = ước lượng từ chữ máy nghe ra (không có điểm phát âm đo từ tiếng). */
  phatAm: 'chu' | 'azure+ai';
}

const s = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

/** Đọc JSON model trả khi chấm HSKK phần 2 + 3. null = hỏng. */
export function docChamHskk(raw: string): { p2: { diem: number; nhanXet: string }; p3: { diem: number; nhanXet: string }; nhanXet: string; goiY: string[]; loi: KetQuaThiNoi['loi'] } | null {
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  let j: Record<string, unknown>;
  try { j = JSON.parse(raw.slice(a, b + 1)) as Record<string, unknown>; } catch { return null; }
  const phan = (k: string) => {
    const x = (j[k] && typeof j[k] === 'object' ? j[k] : {}) as Record<string, unknown>;
    const d = Number(x.diem);
    return Number.isFinite(d) ? { diem: Math.round(Math.min(100, Math.max(0, d))), nhanXet: s(x.nhanXet, 400) } : null;
  };
  const p2 = phan('phan2'), p3 = phan('phan3');
  if (!p2 || !p3) return null;
  return {
    p2, p3, nhanXet: s(j.nhanXet, 600),
    goiY: (Array.isArray(j.goiY) ? j.goiY : []).map((x) => s(x, 200)).filter(Boolean).slice(0, 4),
    loi: (Array.isArray(j.loi) ? j.loi : []).map((x) => x as Record<string, unknown>).map((x) => ({ goc: s(x?.goc, 200), sua: s(x?.sua, 200), vi: s(x?.vi, 200) })).filter((x) => x.goc && x.sua).slice(0, 8),
  };
}
