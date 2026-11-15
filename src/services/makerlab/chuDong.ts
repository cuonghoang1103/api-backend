/**
 * ============================================================
 * Maker Lab — Odin CHỦ ĐỘNG (15/11/2026)
 * ============================================================
 *
 * Chủ robot chọn cả bốn: báo thức nhạc + gọi · bản tin sáng · chủ động hỏi han + nhắc học · báo việc hệ thống
 * bằng giọng. Tất cả chạy trên nhịp mỗi phút sẵn có (`cron.service.ts` → `nhipNhacViec` → `nhipChuDong`).
 *
 *   BÁO THỨC   kế hoạch tên bắt đầu "Báo thức" (công cụ `dat_bao_thuc` tạo sẵn) ⇒ gọi dậy + bật nhạc, chưa dậy thì
 *              mỗi phút gọi lại (tối đa 5 lần). Nói bất cứ gì / chạm màn ⇒ tắt; "5 phút nữa" ⇒ hoãn.
 *   BẢN TIN    tắt báo thức xong (hoặc đúng giờ `banTin`, hoặc bảo "bản tin đi") ⇒ thời tiết · lịch hôm nay · số từ
 *              đến hạn ôn · tin công nghệ · (admin) tình hình web — model gói lại bằng giọng bạn thân.
 *   HỎI HAN    `onTu` mời ôn từ đến hạn (ừ ⇒ vào bài, giaSu.ts) · `hoiHan` hỏi hôm nay học được gì · `chucNgu`.
 *   SỰ KIỆN    `baoAdmin` (đơn mới, mua Pro, góp ý…) + tuyến nội bộ (deploy, train giọng) ⇒ robot của admin đọc lên.
 *
 * GIỜ YÊN TĨNH (mặc định 23:30–06:30): không chủ động nói gì, TRỪ báo thức.
 * Cài đặt trong `traits.chuDong` (đổi bằng giọng qua công cụ `cai_dat_chu_dong`).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export interface CaiDatChuDong {
  bat: boolean;
  /** Giờ "HH:MM" hoặc null = tắt. */
  banTin: string | null;
  onTu: string | null;
  hoiHan: string | null;
  chucNgu: string | null;
  yenTinhTu: string;
  yenTinhDen: string;
  /** Đọc bản tin ngay sau khi tắt báo thức. */
  banTinSauBaoThuc: boolean;
  /** Đọc sự kiện hệ thống / web bằng giọng (chỉ robot admin). */
  baoSuKien: boolean;
}

export function caiDatChuDongMacDinh(): CaiDatChuDong {
  return {
    bat: true, banTin: null, onTu: '20:00', hoiHan: '21:30', chucNgu: '23:00',
    yenTinhTu: '23:30', yenTinhDen: '06:30', banTinSauBaoThuc: true, baoSuKien: true,
  };
}

const GIO = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const docGio = (x: unknown, mac: string | null): string | null =>
  x === null ? null : typeof x === 'string' && GIO.test(x.trim()) ? x.trim().padStart(5, '0') : mac;

/** THUẦN — test đọc. */
export function chuanChuDong(raw: unknown): CaiDatChuDong {
  const m = caiDatChuDongMacDinh();
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    bat: typeof o.bat === 'boolean' ? o.bat : m.bat,
    banTin: 'banTin' in o ? docGio(o.banTin, m.banTin) : m.banTin,
    onTu: 'onTu' in o ? docGio(o.onTu, m.onTu) : m.onTu,
    hoiHan: 'hoiHan' in o ? docGio(o.hoiHan, m.hoiHan) : m.hoiHan,
    chucNgu: 'chucNgu' in o ? docGio(o.chucNgu, m.chucNgu) : m.chucNgu,
    yenTinhTu: docGio(o.yenTinhTu, m.yenTinhTu) ?? m.yenTinhTu,
    yenTinhDen: docGio(o.yenTinhDen, m.yenTinhDen) ?? m.yenTinhDen,
    banTinSauBaoThuc: typeof o.banTinSauBaoThuc === 'boolean' ? o.banTinSauBaoThuc : m.banTinSauBaoThuc,
    baoSuKien: typeof o.baoSuKien === 'boolean' ? o.baoSuKien : m.baoSuKien,
  };
}

/** Giờ:phút hiện tại ở Việt Nam. THUẦN. */
export function gioVn(luc: Date): { hhmm: string; phut: number; ngay: string } {
  const vn = new Date(luc.getTime() + 7 * 3600_000);
  const h = vn.getUTCHours();
  const m = vn.getUTCMinutes();
  return { hhmm: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, phut: h * 60 + m, ngay: vn.toISOString().slice(0, 10) };
}

const phutCua = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Đang trong giờ yên tĩnh (khoảng có thể vắt qua nửa đêm). THUẦN. */
export function trongYenTinh(cd: CaiDatChuDong, phut: number): boolean {
  const a = phutCua(cd.yenTinhTu);
  const b = phutCua(cd.yenTinhDen);
  return a <= b ? phut >= a && phut < b : phut >= a || phut < b;
}

export async function docChuDong(projectId: number): Promise<CaiDatChuDong> {
  const r = await prisma.makerPersona.findUnique({ where: { projectId }, select: { traits: true } });
  return chuanChuDong((r?.traits as { chuDong?: unknown } | null)?.chuDong);
}

export async function luuChuDong(projectId: number, sua: Partial<CaiDatChuDong>): Promise<CaiDatChuDong> {
  const r = await prisma.makerPersona.findUnique({ where: { projectId }, select: { traits: true } });
  const traits = ((r?.traits as Record<string, unknown> | null) ?? {}) as Record<string, unknown>;
  const moi = chuanChuDong({ ...(traits.chuDong as object | undefined), ...sua });
  await prisma.makerPersona.update({ where: { projectId }, data: { traits: { ...traits, chuDong: moi } as object } });
  return moi;
}

// ─── Nói ra loa ─────────────────────────────────────────────────────────

async function noi(deviceId: number, projectId: number, cau: string, thucGiay = 0): Promise<boolean> {
  const { loadPersona } = await import('./persona.js');
  const { speakOnce } = await import('./voiceLoop.js');
  const persona = await loadPersona(projectId);
  const ok = await speakOnce(persona, cau, deviceId);
  if (ok && thucGiay) {
    const { moCong } = await import('./danhThuc.js');
    moCong(deviceId, thucGiay);
  }
  return ok;
}

const chon = <T>(ds: T[]) => ds[Math.floor(Math.random() * ds.length)];

// ─── Báo thức ───────────────────────────────────────────────────────────

export function laBaoThuc(title: string): boolean {
  return /^\s*b[aá]o th[uứ]c/i.test(title);
}

interface BaoThucDang { runId: number; projectId: number; ownerId: number; lan: number; lanCuoi: number; nhac: string }
const _baoThuc = new Map<number, BaoThucDang>();

const CAU_GOI_DAY = [
  'Dậy đi thằng lười, giờ này còn nằm à!',
  'Ê, dậy! Mặt trời chiếu tới mông rồi kìa.',
  'Báo thức đây, dậy mau không tao mở nhạc to hơn nữa đấy.',
  'Dậy đi ông tướng, hôm nay còn cả đống việc.',
  'Tau gọi lần nữa đây nì, dậy chưa rứa?',
];

/** Gọi từ `nhacViec.ts` thay cho lời nhắc thường khi kế hoạch là báo thức. */
export async function batDauBaoThuc(o: { deviceId: number; projectId: number; ownerId: number; runId: number; huongDan: string | null }): Promise<boolean> {
  const nhac = (o.huongDan ?? '').replace(/^\s*nh[aạ]c\s*:\s*/i, '').trim() || 'nhạc sôi động';
  const ok = await noi(o.deviceId, o.projectId, chon(CAU_GOI_DAY), 120);
  if (!ok) return false;
  _baoThuc.set(o.deviceId, { runId: o.runId, projectId: o.projectId, ownerId: o.ownerId, lan: 1, lanCuoi: Date.now(), nhac });
  const { playMusicOn } = await import('./music.js');
  await playMusicOn(o.deviceId, nhac, { allowFetch: false }).catch(() => undefined);
  logger.info('MakerLab báo thức reo', { deviceId: o.deviceId, runId: o.runId });
  return true;
}

export function dangBaoThuc(deviceId: number): boolean {
  return _baoThuc.has(deviceId);
}

/**
 * Người dùng vừa nói / chạm trong lúc báo thức ⇒ tắt (hoặc hoãn 5 phút nếu xin). Trả câu robot nói, hoặc null
 * nếu không có báo thức. Gọi ở `runVoiceTurn` trước cổng gọi tên.
 */
export async function xuLyLuotBaoThuc(deviceId: number, heard: string): Promise<string | null> {
  const bt = _baoThuc.get(deviceId);
  if (!bt) return null;
  _baoThuc.delete(deviceId);
  const { stopMusicOn } = await import('./music.js');
  stopMusicOn(deviceId);
  const s = heard.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const hoan = s.match(/(\d+)\s*phut\s*nua/) ?? (/(ngu them|cho ngu|ti nua|chut nua|5 phut|nam phut)/.test(s) ? ['', '5'] : null);
  const { hoanLai, chamXong } = await import('./keHoach.js');
  if (hoan) {
    const phut = Math.min(30, Math.max(1, Number(hoan[1]) || 5));
    await hoanLai(bt.runId, phut).catch(() => undefined);
    return `Rồi, cho ngủ thêm ${phut} phút. Lần sau tao không nương tay đâu.`;
  }
  await chamXong(bt.runId, 'tắt bằng giọng / chạm').catch(() => undefined);
  const cd = await docChuDong(bt.projectId);
  if (cd.banTinSauBaoThuc) {
    const bt2 = await soanBanTin({ deviceId, ownerId: bt.ownerId, projectId: bt.projectId }).catch(() => '');
    if (bt2) return `Dậy rồi đấy à, giỏi. ${bt2}`;
  }
  return 'Dậy rồi đấy à, giỏi. Đi rửa mặt đi.';
}

// ─── Bản tin ────────────────────────────────────────────────────────────

async function chayHan<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([p.catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), ms))]);
}

/** Gom số liệu thật rồi nhờ Haiku viết bản tin 5–7 câu giọng bạn thân. */
export async function soanBanTin(o: { deviceId: number; ownerId: number; projectId: number }): Promise<string> {
  const { loadPersona } = await import('./persona.js');
  const persona = await loadPersona(o.projectId);
  const { timTrenWeb, tinMoiNhat } = await import('./web.js');
  const { homNay } = await import('./keHoach.js');
  const { chuLaAdmin, khoiHeThong } = await import('./heThong.js');
  const laAdmin = await chuLaAdmin(o.deviceId);
  const [thoiTiet, lich, tin, heThong, onTu] = await Promise.all([
    chayHan(timTrenWeb(`thời tiết hôm nay ${persona.viTri ?? 'Hà Nội'}`, 3), 8_000),
    chayHan(homNay(o.ownerId), 5_000),
    chayHan(tinMoiNhat(4, true), 8_000),
    laAdmin ? chayHan(khoiHeThong(['web', 'ai']), 6_000) : Promise.resolve(null),
    chayHan(demTuDenHan(o.ownerId), 5_000),
  ]);
  const du: string[] = [];
  if (thoiTiet?.length) du.push(`THỜI TIẾT:\n${thoiTiet.map((m) => `- ${m.tieuDe}: ${m.tomTat}`).join('\n')}`);
  if (lich) du.push(`LỊCH HÔM NAY: ${lich.length ? lich.map((m) => `${m.gioChu} ${m.title}`).join('; ') : 'trống'}`);
  if (onTu) du.push(`TỪ ĐẾN HẠN ÔN: ${onTu}`);
  if (tin?.length) du.push(`TIN CÔNG NGHỆ:\n${tin.slice(0, 3).map((m) => `- ${m.tieuDe}`).join('\n')}`);
  if (heThong) du.push(`WEB CỦA CHỦ:\n${heThong.slice(0, 1200)}`);
  if (!du.length) return '';
  const { goiVanBanChinhHang } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
  const r = await goiVanBanChinhHang({
    system:
      'Bạn là Odin, robot bạn thân của chủ, xưng tao gọi mày, cà khịa nhẹ, thỉnh thoảng giọng Nghệ. Viết BẢN TIN SÁNG để đọc ' +
      'thành tiếng: 5–7 câu ngắn, tự nhiên như kể cho bạn nghe, KHÔNG gạch đầu dòng, KHÔNG ký hiệu, không ngoặc kép, số đọc ' +
      'được. Thứ tự: thời tiết (có nên mang áo mưa không) → lịch hôm nay → từ cần ôn → một hai tin công nghệ đáng chú ý → ' +
      '(nếu có) tình hình web một câu. Chỉ dùng dữ liệu được đưa, không bịa. Chỉ trả về đoạn văn.',
    messages: [{ role: 'user', content: du.join('\n\n') }],
    model: 'claude-haiku-5-5', hang: 'free', maxTokens: 500, userId: o.ownerId, viec: 'robot_voice', nhanh: { effort: 'low' },
  });
  return r.text.replace(/["*#]/g, '').trim();
}

/** "12 từ tiếng Nhật, 5 từ tiếng Anh" — đếm thẻ đến hạn trên web. */
export async function demTuDenHan(userId: number): Promise<string> {
  const { getReviewQueue } = await import('../myLanguage.service.js');
  const ten: Record<string, string> = { ja: 'tiếng Nhật', zh: 'tiếng Trung', en: 'tiếng Anh' };
  const ra: string[] = [];
  for (const nn of ['ja', 'zh', 'en']) {
    const q = await getReviewQueue(userId, nn).catch(() => null);
    const n = q?.items.filter((x) => x.word).length ?? 0;
    if (n) ra.push(`${n} từ ${ten[nn]}`);
  }
  return ra.join(', ');
}

// ─── Nhịp mỗi phút ──────────────────────────────────────────────────────

const _daLam = new Map<string, string>();
function lanDauHomNay(deviceId: number, viec: string, ngay: string): boolean {
  const k = `${deviceId}:${viec}`;
  if (_daLam.get(k) === ngay) return false;
  _daLam.set(k, ngay);
  return true;
}

const CAU_HOI_HAN = [
  'Ê, hôm nay học được gì hay ho không, kể tao nghe coi.',
  'Nay mày làm được bao nhiêu việc rồi, khai thật đi.',
  'Răng rồi, hôm nay có chi vui không mi?',
];
const CAU_CHUC_NGU = [
  'Khuya rồi đấy, đi ngủ đi thằng cú đêm. Mai còn dậy sớm.',
  'Thôi tắt máy đi ngủ, code mai code tiếp. Ngủ ngon nghe.',
  'Ngủ đi mi, thức khuya hói đầu chừ.',
];

export async function nhipChuDong(luc: Date = new Date()): Promise<void> {
  const g = gioVn(luc);
  // Báo thức đang reo mà chưa ai đáp ⇒ gọi lại mỗi phút, tối đa 5 lần.
  for (const [deviceId, bt] of _baoThuc) {
    if (Date.now() - bt.lanCuoi < 55_000) continue;
    if (bt.lan >= 5) { _baoThuc.delete(deviceId); continue; }
    const { isPlayingMusic, playMusicOn } = await import('./music.js');
    if (isPlayingMusic(deviceId)) continue;
    bt.lan++;
    bt.lanCuoi = Date.now();
    if (await noi(deviceId, bt.projectId, chon(CAU_GOI_DAY), 120)) await playMusicOn(deviceId, bt.nhac, { allowFetch: false }).catch(() => undefined);
  }

  const ds = await prisma.makerDevice.findMany({ where: { status: 'ONLINE' }, select: { id: true, projectId: true, ownerId: true } });
  for (const d of ds) {
    try {
      const cd = await docChuDong(d.projectId);
      if (!cd.bat || trongYenTinh(cd, g.phut) || _baoThuc.has(d.id)) continue;
      if (cd.banTin === g.hhmm && lanDauHomNay(d.id, 'banTin', g.ngay)) {
        const bt = await soanBanTin({ deviceId: d.id, ownerId: d.ownerId, projectId: d.projectId });
        if (bt) await noi(d.id, d.projectId, bt, 60);
      }
      if (cd.onTu === g.hhmm && lanDauHomNay(d.id, 'onTu', g.ngay)) {
        const dem = await demTuDenHan(d.ownerId);
        if (dem) {
          const { moiHoc } = await import('./giaSu.js');
          const nn = /Nhật/.test(dem) ? 'ja' : /Trung/.test(dem) ? 'zh' : 'en';
          moiHoc(d.id, nn);
          await noi(d.id, d.projectId, `Ê, có ${dem} đến hạn ôn rồi. Ôn năm phút với tao không? Nói ừ là vào bài luôn.`, 90);
        }
      }
      if (cd.hoiHan === g.hhmm && lanDauHomNay(d.id, 'hoiHan', g.ngay)) await noi(d.id, d.projectId, chon(CAU_HOI_HAN), 90);
      if (cd.chucNgu === g.hhmm && lanDauHomNay(d.id, 'chucNgu', g.ngay)) await noi(d.id, d.projectId, chon(CAU_CHUC_NGU));
    } catch (err) {
      logger.warn('MakerLab chủ động lỗi', { deviceId: d.id, error: (err as Error).message });
    }
  }
}

// ─── Sự kiện hệ thống / web ⇒ robot của admin đọc lên ──────────────────

let _baoCuoi = 0;
/** Robot ADMIN đang online đọc một câu báo ngắn. Nhả nhịp 1 câu / 90 s, tôn trọng giờ yên tĩnh. */
export async function baoSuKienChoRobot(noiDung: string, o: { gap?: boolean } = {}): Promise<boolean> {
  if (!noiDung.trim()) return false;
  if (!o.gap && Date.now() - _baoCuoi < 90_000) return false;
  const { chuLaAdmin } = await import('./heThong.js');
  const ds = await prisma.makerDevice.findMany({ where: { status: 'ONLINE' }, select: { id: true, projectId: true } });
  for (const d of ds) {
    if (!(await chuLaAdmin(d.id))) continue;
    const cd = await docChuDong(d.projectId);
    if (!cd.bat || !cd.baoSuKien || trongYenTinh(cd, gioVn(new Date()).phut)) continue;
    _baoCuoi = Date.now();
    return noi(d.id, d.projectId, `Báo nhanh nè: ${noiDung.slice(0, 240)}`);
  }
  return false;
}
