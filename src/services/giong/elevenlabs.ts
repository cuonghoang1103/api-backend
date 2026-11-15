/**
 * ============================================================
 * Giọng ElevenLabs — MỘT cửa cho robot Odin và web (15/11/2026)
 * ============================================================
 *
 * Chủ web: "giọng trên web khó nghe và chậm quá" (phỏng vấn, gia sư, AI chat… đang dùng giọng
 * trình duyệt `speechSynthesis`) + robot Odin cần giọng nhanh, không phụ thuộc máy nhà.
 *
 *   model  `eleven_v4_turbo` — đo 15/11 từ Mac: byte đầu 0,29–0,53 s (giọng nhân bản ấm 0,39–0,65 s),
 *          có tiếng Việt, đọc tiếng Anh xen kẽ bằng âm gốc, 0,5 credit/ký tự.
 *          (`eleven_flash_v2_5` với tiếng Việt CHẬM HƠN: 1,8–2,2 s.)
 *   giọng  "Cuong - Odin" `kK6QTa6Vk6FobFWlp343` — nhân bản nhanh từ 141 s bản thu của chủ web.
 *
 * Ai được dùng (chủ web chọn phương án a, 15/11):
 *   robot  — robot của admin, khi công tắc robot bật.
 *   admin  — không trần.
 *   Pro    — trần `tranProNgay` ký tự/người/ngày (mặc định 8.000), và chỉ khi quỹ còn hơn `giuChoRobot`.
 *   Free   — giữ giọng cũ (trình duyệt / máy nhà).
 *
 * Cài đặt sống trong `app_settings` (key `giong_el`), sửa ở trang admin — không cần deploy.
 * Mọi lượt ghi sổ `giong_el_dung` (thống kê admin + trần Pro).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export const VIEC_EL = ['robot', 'phong_van', 'gia_su', 'ai_chat', 'ngoai_ngu', 'khac'] as const;
export type ViecEl = (typeof VIEC_EL)[number];
export type ViecWebEl = Exclude<ViecEl, 'robot'>;

export const NHAN_VIEC_EL: Record<ViecEl, string> = {
  robot: 'Robot Odin',
  phong_van: 'Phỏng vấn',
  gia_su: 'Gia sư / Luyện nói',
  ai_chat: 'AI Chat (gọi thoại)',
  ngoai_ngu: 'Ngoại ngữ (bài học, từ vựng)',
  khac: 'Khác',
};

export interface CaiDatGiongEl {
  /** Công tắc tổng — tắt là mọi nơi về giọng cũ. */
  bat: boolean;
  robot: boolean;
  /** Web (admin + Pro). Free không bao giờ dùng. */
  web: boolean;
  viec: Record<ViecWebEl, boolean>;
  /** Ký tự/người/ngày cho Pro (admin không trần). 0 = Pro không được dùng. */
  tranProNgay: number;
  /** Quỹ còn lại (credit) dưới mức này ⇒ web (cả Pro lẫn admin) ngưng, chỉ robot được dùng. */
  giuChoRobot: number;
  giongMacDinh: string;
  model: string;
  /** Giọng riêng theo ngôn ngữ (en/ja/zh…) — trống = giọng mặc định. */
  giongTheoNgonNgu: Record<string, string>;
}

export const GIONG_CUONG_ODIN = 'kK6QTa6Vk6FobFWlp343';

export function caiDatMacDinh(): CaiDatGiongEl {
  return {
    bat: true,
    robot: true,
    web: true,
    viec: { phong_van: true, gia_su: true, ai_chat: true, ngoai_ngu: true, khac: true },
    tranProNgay: 8_000,
    giuChoRobot: 15_000,
    giongMacDinh: process.env.ELEVENLABS_VOICE_ID?.trim() || GIONG_CUONG_ODIN,
    model: process.env.ELEVENLABS_MODEL?.trim() || 'eleven_v4_turbo',
    giongTheoNgonNgu: {},
  };
}

/** Gộp cài đặt đã lưu với mặc định, kẹp số. THUẦN — test đọc. */
export function chuanCaiDat(tho: unknown): CaiDatGiongEl {
  const m = caiDatMacDinh();
  const o = (tho && typeof tho === 'object' ? tho : {}) as Partial<CaiDatGiongEl>;
  const so = (x: unknown, mac: number, tran: number) => {
    const n = Number(x);
    return Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), tran) : mac;
  };
  const viec = { ...m.viec };
  for (const k of Object.keys(viec) as ViecWebEl[]) {
    if (typeof o.viec?.[k] === 'boolean') viec[k] = o.viec[k];
  }
  const gtn: Record<string, string> = {};
  for (const [k, v] of Object.entries(o.giongTheoNgonNgu ?? {})) {
    if (/^[a-z]{2}$/.test(k) && typeof v === 'string' && /^[A-Za-z0-9]{10,40}$/.test(v)) gtn[k] = v;
  }
  return {
    bat: typeof o.bat === 'boolean' ? o.bat : m.bat,
    robot: typeof o.robot === 'boolean' ? o.robot : m.robot,
    web: typeof o.web === 'boolean' ? o.web : m.web,
    viec,
    tranProNgay: so(o.tranProNgay, m.tranProNgay, 1_000_000),
    giuChoRobot: so(o.giuChoRobot, m.giuChoRobot, 10_000_000),
    giongMacDinh: typeof o.giongMacDinh === 'string' && /^[A-Za-z0-9]{10,40}$/.test(o.giongMacDinh) ? o.giongMacDinh : m.giongMacDinh,
    model: typeof o.model === 'string' && /^eleven_[a-z0-9_]{2,40}$/.test(o.model) ? o.model : m.model,
    giongTheoNgonNgu: gtn,
  };
}

const KHOA_CAI_DAT = 'giong_el';
let nhoCaiDat: { den: number; cd: CaiDatGiongEl } | null = null;

export async function caiDatGiong(): Promise<CaiDatGiongEl> {
  if (nhoCaiDat && nhoCaiDat.den > Date.now()) return nhoCaiDat.cd;
  let cd = caiDatMacDinh();
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA_CAI_DAT } });
    if (r?.value) cd = chuanCaiDat(JSON.parse(r.value));
  } catch (err) {
    logger.warn('[giong-el] không đọc được cài đặt — dùng mặc định', { error: (err as Error).message });
  }
  nhoCaiDat = { den: Date.now() + 30_000, cd };
  return cd;
}

export async function luuCaiDatGiong(moi: unknown): Promise<CaiDatGiongEl> {
  const cd = chuanCaiDat(moi);
  await prisma.appSetting.upsert({
    where: { key: KHOA_CAI_DAT },
    create: { key: KHOA_CAI_DAT, value: JSON.stringify(cd) },
    update: { value: JSON.stringify(cd) },
  });
  nhoCaiDat = null;
  return cd;
}

export function khoaEl(): string | null {
  return process.env.ELEVENLABS_API_KEY?.trim() || null;
}

/** Hệ số credit/ký tự theo model (đọc từ `GET /v1/models` 15/11). THUẦN. */
export function heSoCredit(model: string): number {
  return /eleven_v3$|multilingual_v2/.test(model) ? 1 : 0.5;
}

export function uocCredit(kyTu: number, model: string): number {
  return Math.ceil(kyTu * heSoCredit(model));
}

// ─── Số dư thật của tài khoản ──────────────────────────────────────────

export interface SoDuEl { daDung: number; tran: number; conLai: number; lamMoi: string | null; goi: string | null }
let nhoSoDu: { den: number; v: SoDuEl | null } | null = null;

/** Số dư credit THẬT từ ElevenLabs (nhớ 60 s). Không đọc được ⇒ null. */
export async function soDuEl(o: { moi?: boolean } = {}): Promise<SoDuEl | null> {
  if (!o.moi && nhoSoDu && nhoSoDu.den > Date.now()) return nhoSoDu.v;
  const k = khoaEl();
  let v: SoDuEl | null = null;
  if (k) {
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
        headers: { 'xi-api-key': k },
        signal: AbortSignal.timeout(8_000),
      });
      if (res.ok) {
        const d = (await res.json()) as Record<string, unknown>;
        const daDung = Number(d.character_count ?? 0);
        const tran = Number(d.character_limit ?? 0);
        const reset = Number(d.next_character_count_reset_unix ?? 0);
        v = {
          daDung,
          tran,
          conLai: Math.max(0, tran - daDung),
          lamMoi: reset ? new Date(reset * 1000).toISOString() : null,
          goi: typeof d.tier === 'string' ? d.tier : null,
        };
      }
    } catch (err) {
      logger.warn('[giong-el] không đọc được số dư', { error: (err as Error).message });
    }
  }
  nhoSoDu = { den: Date.now() + 60_000, v };
  return v;
}

// ─── Quyền dùng ────────────────────────────────────────────────────────

export interface QuyenEl { duoc: boolean; lyDo: string; giong: string; model: string; laAdmin?: boolean }

/** Đã dùng hôm nay (giờ VN) của một người — ký tự KHÔNG tính lượt lấy từ cache. */
export async function daDungHomNay(userId: number): Promise<number> {
  const { dauNgayVn } = await import('../agent/anthropicChinhHang/hanMuc.js');
  const s = await prisma.giongElDung.aggregate({
    where: { userId, cache: false, ok: true, createdAt: { gte: dauNgayVn() } },
    _sum: { kyTu: true },
  });
  return Number(s._sum.kyTu ?? 0);
}

/**
 * Luật quyết định — THUẦN (test đọc). Nơi gọi gom sẵn dữ kiện.
 * `conLai` null = không đọc được số dư ⇒ KHÔNG chặn vì số dư (ElevenLabs sẽ tự báo hết quỹ).
 */
export function xetQuyen(o: {
  cd: CaiDatGiongEl;
  coKhoa: boolean;
  viec: ViecEl;
  laAdmin: boolean;
  laPro: boolean;
  daDungHomNay: number;
  kyTu: number;
  conLai: number | null;
}): { duoc: boolean; lyDo: string } {
  const { cd } = o;
  if (!o.coKhoa) return { duoc: false, lyDo: 'chua_co_khoa' };
  if (!cd.bat) return { duoc: false, lyDo: 'tat_tong' };
  if (o.viec === 'robot') {
    if (!cd.robot) return { duoc: false, lyDo: 'tat_robot' };
    if (o.conLai !== null && o.conLai < uocCredit(o.kyTu, cd.model)) return { duoc: false, lyDo: 'het_quy' };
    return { duoc: true, lyDo: 'robot' };
  }
  if (!cd.web) return { duoc: false, lyDo: 'tat_web' };
  if (!cd.viec[o.viec]) return { duoc: false, lyDo: 'tat_viec' };
  if (o.conLai !== null && o.conLai <= cd.giuChoRobot) return { duoc: false, lyDo: 'giu_cho_robot' };
  if (o.laAdmin) return { duoc: true, lyDo: 'admin' };
  if (!o.laPro) return { duoc: false, lyDo: 'khong_pro' };
  if (!(cd.tranProNgay > 0)) return { duoc: false, lyDo: 'pro_tat' };
  if (o.daDungHomNay + o.kyTu > cd.tranProNgay) return { duoc: false, lyDo: 'het_tran_ngay' };
  return { duoc: true, lyDo: 'pro' };
}

/** Giọng cho một ngôn ngữ (`vi`, `en`, `ja`…). */
export function giongCho(cd: CaiDatGiongEl, ngonNgu?: string | null): string {
  const k = String(ngonNgu || '').slice(0, 2).toLowerCase();
  return (k && cd.giongTheoNgonNgu[k]) || cd.giongMacDinh;
}

export async function quyenEl(o: { viec: ViecEl; userId?: number | null; kyTu: number; ngonNgu?: string | null }): Promise<QuyenEl> {
  const cd = await caiDatGiong();
  const coKhoa = !!khoaEl();
  let laAdmin = false;
  let laPro = false;
  let dung = 0;
  if (o.viec !== 'robot' && o.userId) {
    const pro = await import('../pro.service.js');
    laAdmin = await pro.laAdmin(o.userId);
    laPro = laAdmin || (await pro.isProEffective(o.userId));
    if (!laAdmin && laPro) dung = await daDungHomNay(o.userId).catch(() => Number.MAX_SAFE_INTEGER);
  }
  const sd = coKhoa && cd.bat ? await soDuEl() : null;
  const q = xetQuyen({ cd, coKhoa, viec: o.viec, laAdmin, laPro, daDungHomNay: dung, kyTu: o.kyTu, conLai: sd?.conLai ?? null });
  return { ...q, giong: giongCho(cd, o.ngonNgu), model: cd.model, laAdmin };
}

// ─── Gọi + ghi sổ ──────────────────────────────────────────────────────

export type DinhDangEl = 'pcm_16000' | 'mp3_44100_64' | 'mp3_22050_32';

/**
 * Mở luồng tiếng. Trả `Response` có `body` đọc dần. Lỗi HTTP ⇒ ném (kèm mã).
 * `tocDo` 0,7–1,2 (ElevenLabs `voice_settings.speed`).
 */
export async function moLuongEl(o: {
  text: string;
  giong: string;
  model: string;
  dinhDang: DinhDangEl;
  tocDo?: number;
  signal?: AbortSignal;
}): Promise<Response> {
  const k = khoaEl();
  if (!k) throw new Error('ELEVENLABS_API_KEY missing');
  const toc = Number(o.tocDo);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(o.giong)}/stream?output_format=${o.dinhDang}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': k, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: o.text,
        model_id: o.model,
        ...(Number.isFinite(toc) && toc !== 1 ? { voice_settings: { speed: Math.min(1.2, Math.max(0.7, toc)) } } : {}),
      }),
      signal: o.signal,
    },
  );
  if (!res.ok || !res.body) {
    const than = await res.text().catch(() => '');
    if (/quota_exceeded/i.test(than)) nhoSoDu = { den: Date.now() + 60_000, v: { daDung: 0, tran: 0, conLai: 0, lamMoi: null, goi: null } };
    throw new Error(`elevenlabs HTTP ${res.status} ${than.slice(0, 160)}`);
  }
  return res;
}

export async function ghiDungEl(d: {
  viec: ViecEl;
  userId?: number | null;
  kyTu: number;
  model: string;
  ms: number;
  ok: boolean;
  cache?: boolean;
  loi?: string;
}): Promise<void> {
  try {
    await prisma.giongElDung.create({
      data: {
        viec: d.viec,
        userId: d.userId ?? null,
        kyTu: d.kyTu,
        credit: d.ok && !d.cache ? uocCredit(d.kyTu, d.model) : 0,
        cache: !!d.cache,
        ms: Math.max(0, Math.round(d.ms)),
        ok: d.ok,
        loi: d.loi ? d.loi.slice(0, 200) : null,
      },
    });
  } catch (err) {
    logger.warn('[giong-el] không ghi được sổ', { error: (err as Error).message });
  }
}

// ─── Làm ấm giọng ──────────────────────────────────────────────────────

const _lanCuoi = new Map<string, number>();

/**
 * Giọng nhân bản "nguội" sau một lúc không dùng: lượt đầu 1–7,7 s (đo 15/11), ấm 0,4–0,65 s.
 * Gọi khi robot vừa thức / người dùng vừa bắt đầu nói — một câu 2 ký tự (~1 credit) để
 * ElevenLabs nạp sẵn giọng trong lúc não đang nghĩ. Nhả nhịp: tối đa 1 lần / 2 phút / giọng.
 */
export function lamAmGiong(giong: string, model: string): void {
  const truoc = _lanCuoi.get(giong) ?? 0;
  if (Date.now() - truoc < 120_000 || !khoaEl()) return;
  _lanCuoi.set(giong, Date.now());
  void (async () => {
    try {
      const res = await moLuongEl({ text: 'Ừ.', giong, model, dinhDang: 'pcm_16000', signal: AbortSignal.timeout(10_000) });
      await res.arrayBuffer();
    } catch {
      /* làm ấm hỏng thì thôi — lượt thật vẫn chạy */
    }
  })();
}

/** Ghi nhận giọng vừa được dùng (lượt thật cũng làm ấm). */
export function daDungGiong(giong: string): void {
  _lanCuoi.set(giong, Date.now());
}
