/**
 * ============================================================
 * BẢNG MODEL CUONGMINI — MỘT CHỖ DUY NHẤT (18/10/2026)
 * ============================================================
 *
 * Chủ app chốt (18/10/2026):
 *   • Cổng rambo.ai.vn bị gỡ khỏi danh sách chính (mã giữ, tắt bằng công tắc
 *     — `ramboBat()` ở `llm/gateway.ts`).
 *   • Cổng CHÍNH = modelapi ("CuongMini Core"), model mặc định = `gpt-6-sol`
 *     tên hiển thị "CuongMini Solid".
 *   • Cổng Anthropic chính hãng hiển thị là "CuongMini Code Max".
 *   • Pro dùng MIỄN PHÍ (không khoá, luôn có trần chi tiêu theo người): xem
 *     `khoa: 'free'` bên dưới.
 *   • Model còn lại dùng CHUNG một khoá (`chung`), riêng Invisible có khoá
 *     RIÊNG (`invisible`) vì quá đắt. Vé sống 48 giờ (`anthropicChinhHang/ve.ts`).
 *
 * App (desktop, CLI `/model`, extension VS Code) CHỈ hiện `ten` — không bao
 * giờ hiện `model` (tên thật) hay tên cổng thật. Thứ tự hiển thị (19/10/2026,
 * chủ app chốt): nhóm FREE lên trên, rồi nhóm cần khoá; TRONG mỗi nhóm xếp
 * `nangLuc` giảm dần (`thuTuHienThi`). Đổi thứ tự thì đổi con số, không đổi chỗ dòng.
 *
 * ⚠️ `mo`/`moEn` không được nhắc tên model thật hay tên cổng thật.
 */
import { congAgent, goiDuocModel, ramboDangNghi, ramboSonic } from '../llm/gateway.js';
import { MODEL_AGENT_RIENG } from './models.js';

/** Tên của model đắt nhất — chủ app viết "Invisable"; dùng chính tả đúng. Đổi ở ĐÂY là đủ. */
export const TEN_INVISIBLE = 'CuongMini Invisible 5.1';

/** `rambo` (19/10/2026) = nhóm "CuongMini Classic" — cổng rambo.ai.vn, gói trả trọn, chỉ có khi admin BẬT. */
export type CongModel = 'anthropic' | 'modelapi' | 'rambo';
/** `free` = Pro dùng không cần khoá · `chung` = khoá chung · `invisible` = khoá riêng của Invisible. */
export type LoaiKhoa = 'free' | 'chung' | 'invisible';

/** Tên CỔNG hiển thị — không lộ tên nhà cung cấp. */
export const TEN_CONG: Record<CongModel, string> = {
  anthropic: 'CuongMini Code Max',
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
  /** Năng lực tương đối (cao → đứng trên). */
  nangLuc: number;
  /** Cửa sổ ngữ cảnh THẬT (token). */
  cuaSoToken: number;
  /** Trần token RA thật của model. */
  maxRa: number;
  /**
   * Model FREE tương đương ở CỔNG KIA — đích khi cổng của model này hỏng
   * (5xx, mất kết nối, hết credit, hết giờ). Không bao giờ là model đắt hơn
   * người dùng đã chọn khi model đó trả phí (luật "không tự nâng").
   */
  tuongDuong: string;
  /** Đọc được ảnh thật (đo). */
  nhinAnh: boolean;
  /** Model đắt bất thường ⇒ app hỏi xác nhận. */
  dat?: boolean;
}

/*
 * Cửa sổ / trần ra:
 *   • Anthropic 5.5 + Fable 5.1: đo `GET /v1/models/{id}` 17/10/2026 = 1.000.000 / 128.000
 *     (máy chủ còn đọc lại mỗi ngày — `caiDat.ts › gioiHanModel`).
 *   • GPT trên modelapi: cổng không công khai ⇒ theo hãng cho họ GPT-5/6 (400K vào / 128K ra).
 *     Sai thì cổng trả 400 rõ ràng ("context length"), không hỏng câm.
 */
const MOT_TRIEU = 1_000_000;
const GPT_CUA_SO = 400_000;
const RA_128K = 128_000;

/**
 * Mã model mặc định — cũng là đích của mọi mã lạ (19/10/2026): **CuongMini Default** (`cm-default`).
 * Không phải một model cố định mà là lựa chọn TỰ ĐỘNG (`giaiDefault`):
 *   • rambo BẬT và sống (cầu dao đóng) ⇒ CuongMini Classic Sonic (Sonnet mới nhất của rambo — gói trả trọn);
 *   • rambo tắt / cầu dao mở ⇒ CuongMini Solid (gpt-6-sol trên Core).
 * Đang chạy mà rambo lỗi ⇒ `turn.ts` tự chuyển cổng sang Solid (`tuongDuong`) như cơ chế 18/10.
 */
export const MA_DEFAULT = 'cm-default';
export const MA_MAC_DINH = MA_DEFAULT;
/** Model chắc chắn chạy được khi không có rambo. */
export const MA_SOLID = 'cm-solid';
/** Đích của CuongMini Default khi rambo sống. */
export const MA_CLASSIC_SONIC = 'cm-classic-sonic';
export const TEN_DEFAULT = 'CuongMini Default';
const RAMBO_CUA_SO = 200_000;
const RAMBO_RA = 16_000;

const BANG: readonly MucModel[] = Object.freeze(([
  {
    id: 'cm-invisible', model: 'claude-fable-5-1', ten: TEN_INVISIBLE,
    mo: '⚠ Đắt nhất — chỉ cho việc cực khó. Khoá riêng.',
    moEn: '⚠ Most expensive — only for extremely hard tasks. Separate key.',
    cong: 'anthropic', khoa: 'invisible', nangLuc: 100, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true, dat: true,
  },
  {
    id: 'cm-optimum', model: 'claude-opus-5-5', ten: 'CuongMini Optimum 5.5',
    mo: 'Mạnh — việc khó, refactor lớn, đọc cả kiến trúc. Cần khoá.',
    moEn: 'Strong — hard tasks, big refactors, whole-architecture reading. Needs a key.',
    cong: 'anthropic', khoa: 'chung', nangLuc: 90, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-sonic', model: 'claude-sonnet-5-5', ten: 'CuongMini Sonic 5.5',
    mo: 'Cân bằng — nhanh, giỏi code, ngữ cảnh 1 triệu token. Pro miễn phí.',
    moEn: 'Balanced — fast, strong at code, 1M-token context. Free on Pro.',
    cong: 'anthropic', khoa: 'free', nangLuc: 75, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-solid', model: 'gpt-6-sol', ten: 'CuongMini Solid',
    mo: 'Mặc định — chắc tay, nhìn được ảnh. Pro miễn phí.',
    moEn: 'Default — dependable, can see images. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 70, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    /* Đo 18/10/2026 trên vòng lặp agent (đọc 2 file + sửa 1 hàm + chạy test, 2 lượt): đúng 2/2,
       sổ cổng ~0,015 $/việc (≈ 0,85× Solid), 13–16 s. */
    id: 'cm-nova', model: 'gpt-6-luna', ten: 'CuongMini Nova',
    mo: 'Ngang Solid, rẻ hơn chút — nhanh. Pro miễn phí.',
    moEn: 'On par with Solid, slightly cheaper — fast. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 68, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    id: 'cm-shin', model: 'gpt-5.6-sol', ten: 'CuongMini Shin',
    mo: 'Thế hệ trước — ý kiến thứ hai (tốn ~2,5× Solid). Pro miễn phí.',
    moEn: 'Previous generation — a second opinion (~2.5× Solid cost). Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 60, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-sonic', nhinAnh: true,
  },
  {
    id: 'cm-heshin', model: 'claude-haiku-5-5', ten: 'CuongMini Heshin 5.5',
    mo: 'Nhẹ, nhanh — việc vặt, hỏi nhanh, sửa một file. Pro miễn phí.',
    moEn: 'Light and fast — small chores, quick questions, one-file edits. Free on Pro.',
    cong: 'anthropic', khoa: 'free', nangLuc: 50, cuaSoToken: MOT_TRIEU, maxRa: RA_128K,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    /* Đo 18/10/2026: đúng 2/2, sổ cổng ~0,005 $/việc (≈ 0,3× Solid) nhưng CHẬM: 3–5 phút cho việc nhỏ. */
    id: 'cm-eco', model: 'gpt-5.6-luna', ten: 'CuongMini Eco',
    mo: 'Rẻ nhất nhưng chậm (vài phút mỗi việc nhỏ) — việc không gấp. Pro miễn phí.',
    moEn: 'Cheapest but slow (minutes per small task) — for work that can wait. Free on Pro.',
    cong: 'modelapi', khoa: 'free', nangLuc: 45, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
    tuongDuong: 'cm-heshin', nhinAnh: true,
  },
  /*
   * ─── NHÓM CUONGMINI CLASSIC — cổng rambo (19/10/2026) ───
   * Chỉ hiện khi admin BẬT rambo (`congAgent()`); tắt ⇒ mã Classic tự về Solid (`timModel`). Gói trả trọn ⇒ KHÔNG
   * trừ trần $ (sổ vẫn ghi lượt + token, `costUsd = 0`). Cổng hỏng ⇒ tự chuyển Solid (`tuongDuong`).
   * `model` của Classic Sonic là GETTER: Sonnet mới nhất rambo có (`ramboSonic()` — 5.5 nếu cổng mở, giờ là 5).
   * Không ghi cửa sổ 1M: rambo chưa đo cửa sổ thật ⇒ 200K như bảng rambo cũ.
   */
  {
    id: 'cm-classic-optimum', model: 'claude-opus-5', ten: 'CuongMini Classic Optimum',
    mo: 'Mạnh nhất nhóm Classic — việc khó, refactor lớn. Gói trọn, Pro miễn phí.',
    moEn: 'Strongest of the Classic group — hard tasks, big refactors. Flat-rate, free on Pro.',
    cong: 'rambo', khoa: 'free', nangLuc: 88, cuaSoToken: RAMBO_CUA_SO, maxRa: RAMBO_RA,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-classic-sonic', get model() { return ramboSonic(); }, ten: 'CuongMini Classic Sonic',
    mo: 'Cân bằng — nhanh, giỏi code, chữ chảy dần. Gói trọn, Pro miễn phí.',
    moEn: 'Balanced — fast, strong at code, streams as it writes. Flat-rate, free on Pro.',
    cong: 'rambo', khoa: 'free', nangLuc: 78, cuaSoToken: RAMBO_CUA_SO, maxRa: RAMBO_RA,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
  {
    id: 'cm-classic-heshin', model: 'claude-haiku-4-5', ten: 'CuongMini Classic Heshin',
    mo: 'Nhẹ, nhanh — việc vặt, sửa một file. Gói trọn, Pro miễn phí.',
    moEn: 'Light and fast — small chores, one-file edits. Flat-rate, free on Pro.',
    cong: 'rambo', khoa: 'free', nangLuc: 48, cuaSoToken: RAMBO_CUA_SO, maxRa: RAMBO_RA,
    tuongDuong: 'cm-solid', nhinAnh: true,
  },
] as MucModel[]).sort(thuTuHienThi));

/**
 * CuongMini Default — mục HIỂN THỊ (không phải model thật; `model` rỗng). Lượt chạy dùng `giaiDefault()`.
 */
export const MUC_DEFAULT: MucModel = Object.freeze({
  id: MA_DEFAULT, model: '', ten: TEN_DEFAULT,
  mo: 'Khuyên dùng — tự chọn model tốt nhất đang chạy, tự chuyển khi cổng bận. Mọi tài khoản dùng được.',
  moEn: 'Recommended — picks the best model that is up, switches by itself when a gateway is busy. Every account can use it.',
  cong: 'modelapi', khoa: 'free', nangLuc: 1000, cuaSoToken: GPT_CUA_SO, maxRa: RA_128K,
  tuongDuong: 'cm-solid', nhinAnh: true,
}) as MucModel;

/** Rambo bật VÀ không đang nghỉ (cầu dao đóng). */
export function ramboChayDuoc(): boolean {
  return Boolean(congAgent()) && !ramboDangNghi();
}

/** CuongMini Default lúc này chạy model nào: Classic Sonic (rambo sống) hay Solid. */
export function giaiDefault(chayDuoc: boolean = ramboChayDuoc()): MucModel {
  return BANG.find((m) => m.id === (chayDuoc ? MA_CLASSIC_SONIC : MA_SOLID))!;
}

/**
 * THỨ TỰ HIỂN THỊ (19/10/2026, chủ app chốt): model FREE trước (Sonic 5.5 · Solid · Nova · Shin · Heshin 5.5 · Eco),
 * rồi model cần khoá (Invisible 5.1 · Optimum 5.5); trong mỗi nhóm năng lực cao → thấp. Trước đây chỉ theo năng lực ⇒
 * hai model cần khoá đứng đầu danh sách mà đa số người dùng không mở được.
 */
export function thuTuHienThi(a: { khoa: string; nangLuc: number; cong?: string; id?: string }, b: { khoa: string; nangLuc: number; cong?: string; id?: string }): number {
  /* 19/10/2026: Default → Classic (rambo) → free → cần khoá. */
  const nhom = (m: { khoa: string; cong?: string; id?: string }) => (m.id === MA_DEFAULT ? -2 : m.cong === 'rambo' ? -1 : m.khoa === 'free' ? 0 : 1);
  return nhom(a) - nhom(b) || b.nangLuc - a.nangLuc;
}

/**
 * Bảng các cổng TRẢ THEO TOKEN (Code Max + Core), đã xếp: free trước, trong nhóm năng lực cao → thấp. KHÔNG gồm
 * nhóm Classic (rambo — gói trọn, không có trần $) và mục Default — xem `bangChoApp()`.
 */
export function bangModel(): readonly MucModel[] {
  return BANG.filter((m) => m.cong !== 'rambo');
}

/** Nhóm CuongMini Classic (rambo) — luôn trả đủ, bất kể công tắc (danh sách cho app tự lọc theo `congAgent()`). */
export function bangClassic(): readonly MucModel[] {
  return BANG.filter((m) => m.cong === 'rambo');
}

/**
 * DANH SÁCH CHO APP, đúng thứ tự chủ app chốt (19/10/2026):
 *   rambo BẬT: Default → Classic (Optimum · Sonic · Heshin) → free (Sonic 5.5 · Solid · Nova · Shin · Heshin 5.5 · Eco) → cần khoá
 *   rambo TẮT: Default → free → cần khoá (Classic ẩn).
 */
export function bangChoApp(ramboBatNay: boolean = Boolean(congAgent())): MucModel[] {
  return [MUC_DEFAULT, ...(ramboBatNay ? bangClassic() : []), ...bangModel()];
}

/**
 * Mã cũ ⇒ mã mới. App cũ còn gửi `cl-*` (cổng chính hãng 17/10) và mã của bảng
 * modelapi/rambo cũ — đều phải chạy được, không bắt người dùng cài lại app.
 */
const BI_DANH: Record<string, string> = {
  /* 19/10/2026: tên đầu tiên của Default trong bản nháp. */
  'cm-tu-dong': MA_DEFAULT,
  /* Mã bảng rambo cũ (`models.ts`) ⇒ nhóm Classic. Rambo tắt ⇒ `timModel` đưa tiếp về Solid. */
  ...Object.fromEntries(MODEL_AGENT_RIENG.map((m) => [m.id, m.classic])),
  'cl-free': 'cm-heshin',
  'cl-haiku-5-5': 'cm-heshin',
  'cl-sonnet-5-5': 'cm-sonic',
  'cl-opus-5-5': 'cm-optimum',
  'cl-fable-5-1': 'cm-invisible',
  'gpt-sol': 'cm-solid',
  'gpt-6-sol': 'cm-solid',
  'gpt-5.6-sol': 'cm-shin',
  'gpt-6-luna': 'cm-nova',
  'gpt-5.6-luna': 'cm-eco',
};

/*
 * APP CŨ (desktop ≤ 0.5.200, CLI ≤ 0.5.0, extension ≤ 0.7.0) kiểm mã model bằng một z.enum CỐ ĐỊNH ⇒ nhận mã
 * `cm-*` là báo "Dữ liệu gửi lên không hợp lệ cho agent:datModel" (người dùng gặp 18/10/2026 ngay sau deploy).
 * App mới gửi `?bang=cm`. Không có ⇒ đổi mã về mã cũ app đó hiểu (máy chủ đổi ngược qua BI_DANH), model chưa có
 * mã cũ thì bỏ khỏi danh sách của app cũ.
 */
export const MA_CU: Record<string, string> = {
  'cm-solid': 'gpt-sol', 'cm-sonic': 'cl-sonnet-5-5', 'cm-optimum': 'cl-opus-5-5', 'cm-invisible': 'cl-fable-5-1', 'cm-heshin': 'cl-free',
  /* 19/10/2026 — mã cũ của CHÍNH các model rambo đó (app cũ nhận lại đúng model qua `BI_DANH`). Default ⇒ `sonnet-5`:
     app cũ mặc định gửi `sonnet-5` ⇒ rambo bật thì chạy rambo Sonnet thật, tắt/sập thì Solid — đúng hành vi Default. */
  'cm-default': 'sonnet-5', 'cm-classic-sonic': 'sonnet-5', 'cm-classic-heshin': 'haiku-4-5', 'cm-classic-optimum': 'opus-5',
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
export function dungChoNhom(m: { khoa?: string; cong?: string; id?: string }): boolean {
  return m.id === MA_DEFAULT || (m.khoa === 'free' && (m.cong === 'modelapi' || m.cong === 'rambo'));
}
/** Tên các model dùng được bằng hạn mức nhóm (câu báo lỗi / giao diện). */
export function tenModelNhom(): string {
  return bangChoApp().filter(dungChoNhom).map((m) => m.ten.replace(/^CuongMini /, '')).join(', ');
}

/** Mã có phải của bảng này (kể cả bí danh) không. */
export function laMaCuongMini(id: unknown): id is string {
  return typeof id === 'string' && (id === MA_DEFAULT || BANG.some((m) => m.id === id) || id in BI_DANH);
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
  const m = ma === MA_DEFAULT ? giaiDefault() : BANG.find((x) => x.id === ma) ?? giaiDefault();
  if (m.cong === 'rambo' && !congAgent()) return BANG.find((x) => x.id === MA_SOLID)!;
  return m;
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
  const tenClassic = (id: string) => BANG.find((m) => m.id === id)?.ten ?? TEN_CONG.rambo;
  const cap: Array<[string, string]> = [
    ...BANG.map((m) => [m.model, m.ten] as [string, string]),
    /* Mọi model rambo (kể cả mã cũ không còn mục riêng) ⇒ tên Classic. */
    ...MODEL_AGENT_RIENG.map((m) => [m.model, tenClassic(m.classic)] as [string, string]),
    ...Object.entries(them),
  ].filter(([that]) => that).sort((a, b) => b[0].length - a[0].length);
  let ra = String(text ?? '');
  for (const [that, ten] of cap) ra = ra.split(that).join(ten);
  return ra
    .replace(/cổng Claude chính hãng/gi, TEN_CONG.anthropic)
    .replace(/api\.anthropic\.com|modelapi(\.vn)?|rambo(\.ai\.vn)?/gi, 'CuongMini');
}
