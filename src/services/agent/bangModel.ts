/**
 * ============================================================
 * BẢNG MODEL CUONGMINI — MỘT CHỖ DUY NHẤT (bản 27/10/2026: 4 model, xem khối "BẢNG 4 MODEL" bên dưới)
 * ============================================================
 *
 * App (desktop, CLI `/model`, extension VS Code) CHỈ hiện `ten` — không bao giờ hiện `model` (tên thật) hay tên cổng
 * thật. `mo`/`moEn` không được nhắc tên model thật hay tên cổng thật.
 */
import { congAgent, goiDuocModel, ramboDangNghi, ramboSonic } from '../llm/gateway.js';
import { MODEL_AGENT_RIENG } from './models.js';

/** Tên model đắt nhất (khoá riêng). Đổi ở ĐÂY là đủ. */
export const TEN_INVISIBLE = 'CuongMini Fable Max';

/** `rambo` = cổng rambo.ai.vn — 27/10/2026 NGỪNG dùng (không còn mục nào trong bảng; mã cũ về CuongMini Pro). */
export type CongModel = 'anthropic' | 'modelapi' | 'rambo';
/** `free` = Pro dùng không cần khoá · `chung` = khoá chung (Pro 2 + Max) · `invisible` = khoá riêng Fable Max. */
export type LoaiKhoa = 'free' | 'chung' | 'invisible';

/** Tên CỔNG hiển thị — không lộ tên nhà cung cấp. */
export const TEN_CONG: Record<CongModel, string> = {
  anthropic: 'CuongMini',
  modelapi: 'CuongMini Core',
  rambo: 'CuongMini Classic',
};

export interface MucModel {
  /** Mã app gửi lên. Trung tính — không chứa tên model thật. */
  id: string;
  /** Tên thật gửi cổng. KHÔNG BAO GIỜ trả cho app. */
  model: string;
  ten: string;
  mo: string;
  moEn: string;
  cong: CongModel;
  khoa: LoaiKhoa;
  /** Năng lực tương đối (cao → mạnh hơn). */
  nangLuc: number;
  /** Cửa sổ ngữ cảnh THẬT (token). */
  cuaSoToken: number;
  /** Trần token RA thật của model. */
  maxRa: number;
  /**
   * Model FREE ở CỔNG KIA — đích khi cổng của model này hỏng (5xx, mất kết nối, hết credit, hết giờ).
   * Không bao giờ là model đắt hơn người dùng đã chọn (luật "không tự nâng").
   */
  tuongDuong: string;
  /** Đọc được ảnh thật (đo). */
  nhinAnh: boolean;
  /** Model đắt bất thường ⇒ app hỏi xác nhận. */
  dat?: boolean;
  /** Mục ẨN: không hiện trong danh sách app (chỉ làm đích dự phòng ngầm khi cổng chính hãng hỏng). */
  an?: boolean;
  /** Thứ tự hiển thị (nhỏ đứng trên). */
  thuTu?: number;
}

/*
 * Cửa sổ / trần ra: Anthropic 5.5 + Fable 5.1 đo `GET /v1/models/{id}` 17/10/2026 = 1.000.000 / 128.000.
 * GPT trên modelapi: theo hãng (400K vào / 128K ra).
 */
const MOT_TRIEU = 1_000_000;
const GPT_CUA_SO = 400_000;
const RA_128K = 128_000;

/**
 * ============================================================
 * BẢNG 4 MODEL (chủ app chốt 27/10/2026 — thay bảng 18/10 + 19/10)
 * ============================================================
 *   CuongMini Pro        = Haiku 5.5 (rẻ nhất cổng chính hãng) — MẶC ĐỊNH, Pro dùng không cần khoá
 *   CuongMini Pro 2      = Sonnet 5.5 ┐ CHUNG một khoá (admin đặt trần; vé 48 giờ — admin chưa đổi khoá thì nhập lại
 *   CuongMini Max        = Opus 5.5   ┘ khoá cũ vẫn vào, đổi rồi thì không)
 *   CuongMini Fable Max  = Fable 5.1 — khoá RIÊNG (rất tốn token)
 * Cổng rambo.ai.vn ngừng dùng; modelapi chỉ còn là đích dự phòng NGẦM (`cm-solid`, ẩn) khi cổng chính hãng hỏng.
 * Tài khoản Free KHÔNG còn dùng AI Code/CLI/extension (trừ dự án CT Work được tài trợ / hạn mức nhóm).
 *
 * GIỮ MÃ CŨ (`cm-default`, `cm-sonic`, `cm-optimum`, `cm-invisible`): app đang cài kiểm mã bằng z.enum cố định ⇒
 * đổi mã là phải phát hành lại cả 3 app. Giữ mã ⇒ app tự hiện đúng 4 tên mới lấy từ máy chủ.
 */
export const MA_DEFAULT = 'cm-default';
export const MA_MAC_DINH = MA_DEFAULT;
/** Đích dự phòng NGẦM (modelapi) khi cổng chính hãng hỏng. Ẩn khỏi danh sách. */
export const MA_SOLID = 'cm-solid';
/** Mã cũ của Classic Sonic (rambo) — nay là bí danh của Default. */
export const MA_CLASSIC_SONIC = 'cm-classic-sonic';
export const TEN_DEFAULT = 'CuongMini Pro';

const BANG: readonly MucModel[] = Object.freeze(([
  {
    id: MA_DEFAULT, model: 'claude-haiku-5-5', ten: TEN_DEFAULT,
    mo: 'Mặc định — nhanh, gọn, đủ cho hầu hết việc code hằng ngày. Tài khoản Pro dùng không cần khoá.',
    moEn: 'Default — fast and capable for everyday coding. Free on Pro, no key needed.',
    cong: 'anthropic', khoa: 'free', nangLuc: 50, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: MA_SOLID, nhinAnh: true, thuTu: 1,
  },
  {
    id: 'cm-sonic', model: 'claude-sonnet-5-5', ten: 'CuongMini Pro 2',
    mo: 'Mạnh hơn — giỏi code, việc nhiều bước, ngữ cảnh 1 triệu token. Cần khoá (chung với Max).',
    moEn: 'Stronger — great at code and multi-step work, 1M-token context. Needs a key (shared with Max).',
    cong: 'anthropic', khoa: 'chung', nangLuc: 75, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: MA_SOLID, nhinAnh: true, thuTu: 2,
  },
  {
    id: 'cm-optimum', model: 'claude-opus-5-5', ten: 'CuongMini Max',
    mo: 'Mạnh nhất nhóm — việc khó, refactor lớn, đọc cả kiến trúc. Cần khoá (chung với Pro 2).',
    moEn: 'Most capable of the group — hard tasks, big refactors, whole-architecture reading. Needs a key (shared with Pro 2).',
    cong: 'anthropic', khoa: 'chung', nangLuc: 90, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: MA_SOLID, nhinAnh: true, thuTu: 3,
  },
  {
    id: 'cm-invisible', model: 'claude-fable-5-1', ten: TEN_INVISIBLE,
    mo: '⚠ Rất tốn token — chỉ cho việc cực khó. Khoá riêng.',
    moEn: '⚠ Very token-hungry — only for extremely hard tasks. Separate key.',
    cong: 'anthropic', khoa: 'invisible', nangLuc: 100, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: MA_SOLID, nhinAnh: true, dat: true, thuTu: 4,
  },
  {
    id: MA_SOLID, model: 'gpt-6-sol', ten: 'CuongMini Pro',
    mo: 'Dự phòng ngầm khi cổng chính bận.', moEn: 'Silent fallback when the main gateway is busy.',
    cong: 'modelapi', khoa: 'free', nangLuc: 45, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: MA_DEFAULT, nhinAnh: true, an: true, thuTu: 99,
  },
  /* Nhóm Classic (cổng rambo) — 27/10/2026 NGỪNG dùng: ẨN hẳn (app không thấy, mã app gửi lên bị đổi về Pro ở cửa vào).
     Giữ mục để mã đường rambo còn chạy được nội bộ (test giao thức Anthropic) và bật lại dễ nếu cần. */
  {
    id: 'cm-classic-sonic', get model() { return ramboSonic(); }, ten: 'CuongMini Classic Sonic',
    mo: 'Ngừng dùng.', moEn: 'Retired.',
    cong: 'rambo', khoa: 'free', nangLuc: 78, cuaSoToken: 200_000, maxRa: 16_000,
    tuongDuong: MA_SOLID, nhinAnh: true, an: true, thuTu: 98,
  },
] as MucModel[]).sort(thuTuHienThi));

/** Mục CuongMini Pro (mặc định) — giữ tên cũ `MUC_DEFAULT` cho các chỗ đang import. */
export const MUC_DEFAULT: MucModel = BANG.find((m) => m.id === MA_DEFAULT)!;

/** Rambo bật VÀ không đang nghỉ. 27/10/2026: rambo ngừng dùng ⇒ không còn quyết định gì trong bảng này. */
export function ramboChayDuoc(): boolean {
  return Boolean(congAgent()) && !ramboDangNghi();
}

/** CuongMini Default lúc này chạy model nào — 27/10/2026: luôn CuongMini Pro (Haiku 5.5 chính hãng). */
export function giaiDefault(_chayDuoc?: boolean): MucModel {
  return MUC_DEFAULT;
}

/** Thứ tự hiển thị (27/10/2026): Pro → Pro 2 → Max → Fable Max. */
export function thuTuHienThi(a: { thuTu?: number; nangLuc: number }, b: { thuTu?: number; nangLuc: number }): number {
  return (a.thuTu ?? 50) - (b.thuTu ?? 50) || b.nangLuc - a.nangLuc;
}

/** Bảng các model HIỆN cho người dùng (không gồm mục ẩn dự phòng). */
export function bangModel(): readonly MucModel[] {
  return BANG.filter((m) => !m.an);
}

/** MỌI mục kể cả ẩn (dự phòng) — cho bảng trần chi tiêu / thống kê (mục ẩn vẫn tiêu tiền thật). */
export function bangTatCa(): readonly MucModel[] {
  return BANG;
}

/** Nhóm Classic (rambo) — 27/10/2026 ngừng dùng: luôn rỗng (giữ hàm cho chỗ đang import). */
export function bangClassic(): readonly MucModel[] {
  return BANG.filter((m) => m.cong === 'rambo');
}

/** DANH SÁCH CHO APP (27/10/2026): đúng 4 model, rambo không bao giờ hiện. */
export function bangChoApp(_ramboBatNay?: boolean): MucModel[] {
  return [...bangModel()];
}

/**
 * Mã cũ ⇒ mã mới. App cũ còn gửi `cl-*` (cổng chính hãng 17/10) và mã của bảng
 * modelapi/rambo cũ — đều phải chạy được, không bắt người dùng cài lại app.
 */
const BI_DANH: Record<string, string> = {
  'cm-tu-dong': MA_DEFAULT,
  /* Mã bảng rambo cũ (`models.ts`) + nhóm Classic ⇒ CuongMini Pro (27/10/2026 ngừng rambo). */
  ...Object.fromEntries(MODEL_AGENT_RIENG.map((m) => [m.id, MA_DEFAULT])),
  'cm-classic-optimum': MA_DEFAULT,
  'cm-classic-heshin': MA_DEFAULT,
  /* Model modelapi + Heshin của bảng 18/10 ⇒ CuongMini Pro. */
  'cm-heshin': MA_DEFAULT,
  'cm-nova': MA_DEFAULT,
  'cm-shin': MA_DEFAULT,
  'cm-eco': MA_DEFAULT,
  'cl-free': MA_DEFAULT,
  'cl-haiku-5-5': MA_DEFAULT,
  'cl-sonnet-5-5': 'cm-sonic',
  'cl-opus-5-5': 'cm-optimum',
  'cl-fable-5-1': 'cm-invisible',
  'gpt-sol': MA_DEFAULT,
  'gpt-6-sol': MA_DEFAULT,
  'gpt-5.6-sol': MA_DEFAULT,
  'gpt-6-luna': MA_DEFAULT,
  'gpt-5.6-luna': MA_DEFAULT,
};

/*
 * APP CŨ (desktop ≤ 0.5.200, CLI ≤ 0.5.0, extension ≤ 0.7.0) kiểm mã model bằng một z.enum CỐ ĐỊNH ⇒ nhận mã
 * `cm-*` là báo "Dữ liệu gửi lên không hợp lệ cho agent:datModel" (người dùng gặp 18/10/2026 ngay sau deploy).
 * App mới gửi `?bang=cm`. Không có ⇒ đổi mã về mã cũ app đó hiểu (máy chủ đổi ngược qua BI_DANH), model chưa có
 * mã cũ thì bỏ khỏi danh sách của app cũ.
 */
export const MA_CU: Record<string, string> = {
  'cm-solid': 'gpt-sol', 'cm-sonic': 'cl-sonnet-5-5', 'cm-optimum': 'cl-opus-5-5', 'cm-invisible': 'cl-fable-5-1', 'cm-heshin': 'cl-free',
  /* 27/10/2026: Default = Haiku 5.5 ⇒ app đời cũ nhận `cl-free` (BI_DANH đổi ngược về Default). */
  /* 19/10/2026 — mã cũ của CHÍNH các model rambo đó (app cũ nhận lại đúng model qua `BI_DANH`). Default ⇒ `sonnet-5`:
     app cũ mặc định gửi `sonnet-5` ⇒ rambo bật thì chạy rambo Sonnet thật, tắt/sập thì Solid — đúng hành vi Default. */
  'cm-default': 'cl-free',
};

/**
 * Mã `cm-*` mà app "bảng cm đời 1" (desktop 0.5.201–0.5.203, CLI ≤ 0.6.1, extension ≤ 0.8.1 — gửi `?bang=cm`) nhận
 * trong z.enum CỐ ĐỊNH (`desktop/src/shared/ipc.ts › modelAgentSchema`). Mã mới hơn (Default, Classic) phải đổi về
 * mã cũ cho app đó; app mới gửi `?bang=cm2`.
 */
const CM_DOI_1 = new Set(['cm-invisible', 'cm-optimum', 'cm-sonic', 'cm-solid', 'cm-nova', 'cm-shin', 'cm-heshin', 'cm-eco']);
export type BanApp = 'cu' | 'cm' | 'cm2';
export function docBanApp(bang: unknown): BanApp {
  return bang === 'cm2' ? 'cm2' : bang === 'cm' ? 'cm' : 'cu';
}
/** Đổi mã cho đúng đời app. Trùng mã sau khi đổi (Default + Classic Sonic cùng là `sonnet-5`) ⇒ giữ mục ĐẦU. */
export function maChoApp<T extends { id: string }>(ds: T[], ban: BanApp): T[] {
  if (ban === 'cm2') return ds;
  const thay = (id: string): string | null => {
    if (!id.startsWith('cm-')) return id;
    if (ban === 'cm' && CM_DOI_1.has(id)) return id;
    /* App "bảng cm đời 1" không có `cm-default` trong z.enum ⇒ gửi `cm-heshin` (BI_DANH đổi ngược về Default). */
    if (ban === 'cm' && id === MA_DEFAULT) return 'cm-heshin';
    return MA_CU[id] ?? null;
  };
  const daCo = new Set<string>();
  return ds.flatMap((m) => {
    const id = thay(m.id);
    if (!id || daCo.has(id)) return [];
    daCo.add(id);
    return [id === m.id ? m : { ...m, id }];
  });
}
/** Tên cũ (18/10): `appCu = true` ⇒ đời `cu`, `false` ⇒ giữ nguyên. */
export function maChoAppCu<T extends { id: string }>(ds: T[], appCu: boolean): T[] {
  return maChoApp(ds, appCu ? 'cu' : 'cm2');
}
/** Mã mặc định gửi cho đời app này. */
export function maMacDinhCho(ban: BanApp): string {
  return maChoApp([{ id: MA_MAC_DINH }], ban)[0]?.id ?? MA_SOLID;
}

/**
 * HẠN MỨC NHÓM (đợt 6, `hanMucNhom.ts`) chỉ chạy model FREE trên cổng của web (modelapi) — như thiết kế ghi ở
 * `docs/cuongmini-doi-chieu-nang-luc.md` mục 2f. QA đợt 6: trước đây lọc mỗi `khoa === 'free'` ⇒ Sonic 5.5 / Heshin 5.5
 * (cổng chính hãng) hiện trong /model của thành viên nhóm, chọn vào thì hạn mức chính hãng của người KHÔNG gói = 0 ⇒ lỗi
 * "hết hạn mức CuongMini Free" khó hiểu.
 */
/* 19/10/2026: hạn mức nhóm dùng được thêm nhóm Classic (rambo — gói trọn) và CuongMini Default. */
/* 27/10/2026: hạn mức nhóm chạy CuongMini Pro — lượt của nhóm đi đích ngầm `cm-solid` (modelapi, tiền trưởng nhóm). */
export function dungChoNhom(m: { khoa?: string; cong?: string; id?: string }): boolean {
  return m.id === MA_DEFAULT || m.id === MA_SOLID;
}
/** Tên các model dùng được bằng hạn mức nhóm (câu báo lỗi / giao diện). */
export function tenModelNhom(): string {
  return TEN_DEFAULT;
}

/** Mã có phải của bảng này (kể cả bí danh) không. */
export function laMaCuongMini(id: unknown): id is string {
  return typeof id === 'string' && (BANG.some((m) => m.id === id) || id in BI_DANH);
}

/** Mã (kể cả bí danh / trống) có phải CuongMini Default không — mã lạ KHÔNG tính (không mở cửa Free bằng mã rác). */
export function laDefault(id: unknown): boolean {
  if (id === undefined || id === null || id === '') return true;
  return typeof id === 'string' && (BI_DANH[id] ?? id) === MA_DEFAULT;
}

/**
 * Mã ⇒ mục SẼ CHẠY. Mã lạ / trống ⇒ CuongMini Default (không bao giờ `null`). Default ⇒ `giaiDefault()`.
 * Classic (rambo) khi admin TẮT rambo ⇒ lặng lẽ về Solid (không phải "cổng bận"). Rambo bật nhưng đang nghỉ ⇒ trả
 * đúng mục Classic để `turn.ts` tự chuyển cổng (có dòng mờ báo).
 */
export function timModel(id: unknown): MucModel {
  const ma = typeof id === 'string' && id ? (BI_DANH[id] ?? id) : MA_MAC_DINH;
  /* Mục ẨN (`cm-solid`) vẫn chạy được khi gọi NỘI BỘ (đích dự phòng, test cơ chế); yêu cầu từ APP bị đổi về Pro ở
     cửa vào `/agent/turn` + `/agent/compact` (`chuanHoaMaTuApp`). */
  const m = BANG.find((x) => x.id === ma) ?? MUC_DEFAULT;
  /* Classic khi rambo tắt (mặc định từ 27/10) ⇒ Pro. */
  return m.cong === 'rambo' && !congAgent() ? MUC_DEFAULT : m;
}

/** Mã model app gửi lên ⇒ mã được phép chọn: mục ẩn (dự phòng) và mã rác ⇒ CuongMini Pro. */
export function chuanHoaMaTuApp(id: unknown): string {
  const ma = typeof id === 'string' && id ? (BI_DANH[id] ?? id) : MA_DEFAULT;
  const m = BANG.find((x) => x.id === ma);
  return m && !m.an ? m.id : MA_DEFAULT;
}

export function mucTheoId(id: string): MucModel | undefined {
  return BANG.find((m) => m.id === id);
}

/** Model free tương đương ở cổng kia. `null` = không có (bảng hỏng). */
export function tuongDuongFree(m: MucModel): MucModel | null {
  const d = BANG.find((x) => x.id === m.tuongDuong);
  if (!d || d.khoa !== 'free' || d.cong === m.cong) return null;
  return d;
}

/** Hạng của sổ `anthropic_usage_logs` (hai trần nhóm free/cao đã có từ 17/10). */
export function hangSo(m: MucModel): 'free' | 'cao' {
  return m.khoa === 'free' ? 'free' : 'cao';
}

/** Model modelapi gọi được với khoá nhóm đang cắm? (Anthropic: kiểm kho key riêng.) */
export function modelapiGoiDuoc(m: MucModel): boolean {
  return m.cong !== 'modelapi' || goiDuocModel(m.model);
}

// ─── Cầu dao theo CỔNG (tự chuyển cổng, 18/10/2026) ───────────────────

/**
 * Cổng vừa hỏng ⇒ nghỉ 60 giây: lượt sau (bước kế của cùng việc) đi thẳng
 * model tương đương thay vì đâm đầu vào cổng hỏng rồi mới chuyển. Bộ nhớ tiến
 * trình là đủ — mất khi deploy chỉ là thử lại sớm hơn.
 */
const NGHI_MS = Math.max(10_000, Number(process.env.CUONGMINI_CONG_NGHI_MS) || 60_000);
const hongToi = new Map<CongModel, number>();

export function baoCongHong(c: CongModel, now = Date.now()): void { hongToi.set(c, now + NGHI_MS); }
export function baoCongOk(c: CongModel): void { hongToi.delete(c); }
export function congDangHong(c: CongModel, now = Date.now()): boolean { return (hongToi.get(c) ?? 0) > now; }

/**
 * Lỗi này có phải CỔNG hỏng (đáng tự chuyển cổng) không — khác lỗi do yêu cầu
 * sai (400 thường: chuyển cổng cũng hỏng y hệt).
 *   5xx · 408/409/429/529 · mất kết nối / hết giờ · hết credit / hết hạn ngạch ·
 *   cổng không có kênh cho model.
 */
export function laLoiCongHong(thong: string, code?: string): boolean {
  if (code && /^CONG_ANTHROPIC_(HET_KEY|HONG)$/.test(code)) return true;
  if (/credit|quota|insufficient|balance|billing|余额|额度|No available channel|unknown provider/i.test(thong)) return true;
  const ma = /HTTP (\d{3})/.exec(thong)?.[1];
  if (ma) return ['408', '409', '429', '529'].includes(ma) || ma.startsWith('5');
  return /aborted|ECONNRESET|ECONNREFUSED|socket hang up|terminated|fetch failed|ETIMEDOUT|timeout|EAI_AGAIN|network/i.test(thong);
}

/** Dòng mờ trong bảng ghi khi đã tự chuyển cổng (song ngữ). */
export function cauDoiCong(ten: string): { vi: string; en: string } {
  return { vi: `Đã chuyển sang ${ten} vì cổng bận`, en: `Switched to ${ten} because the gateway is busy` };
}

/**
 * Câu lỗi đi tới app KHÔNG được nhắc tên model thật / tên nhà cung cấp (QA 18/10/2026): cổng thường trả
 * `HTTP 503 No available channel for model gpt-6-sol …`, `unknown provider for model …`, và câu của cổng chính hãng
 * nói "cổng Claude chính hãng". Đổi tên thật ⇒ tên CuongMini (dài trước để `gpt-6-sol` không bị `gpt-6` nuốt dở).
 * THUẦN.
 */
export function anTenThat(text: string, them: Record<string, string> = {}): string {
  const cap: Array<[string, string]> = [
    ...BANG.map((m) => [m.model, m.ten] as [string, string]),
    /* Mọi model rambo cũ ⇒ tên CuongMini Pro. */
    ...MODEL_AGENT_RIENG.map((m) => [m.model, TEN_DEFAULT] as [string, string]),
    ...Object.entries(them),
  ].filter(([that]) => that).sort((a, b) => b[0].length - a[0].length);
  let ra = String(text ?? '');
  for (const [that, ten] of cap) ra = ra.split(that).join(ten);
  return ra
    .replace(/cổng Claude chính hãng/gi, 'CuongMini')
    .replace(/api\.anthropic\.com|modelapi(\.vn)?|rambo(\.ai\.vn)?/gi, 'CuongMini');
}
