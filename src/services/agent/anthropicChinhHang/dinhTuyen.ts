/**
 * ĐỊNH TUYẾN cổng Claude chính hãng ("CuongMini Code Max"): quyền theo vé
 * (khoá chung / khoá Invisible), danh sách model CuongMini cho app, và lời gọi
 * VĂN BẢN đơn (CuongMini trong thi — `exam_tutor`, tóm tắt hội thoại AI Code).
 *
 * 18/10/2026: rambo tắt mặc định ⇒ AI Code đi theo bảng `../bangModel.ts`;
 * cổng hỏng thì `turn.ts` tự chuyển sang model free tương đương ở cổng kia.
 */
import type { LlmEndpoint } from '../../llm/gateway.js';
import { docThamSoTool, type LLMTool, type LLMToolCall } from '../../interview/llm/index.js';
import { logger } from '../../../utils/logger.js';
import {
  MA_FREE, dsModelChinhHangGoc, gocChinhHang,
  type HangChinhHang, type ModelChinhHang,
} from './cauHinh.js';
import { coKeyKhaDung } from './khoKey.js';
import { ganCache, ghiDung, guiChinhHang, type NguCanhGoi } from './goi.js';
import { dungThanChinhHang, thanAnToan, type ThanAnthropic } from './thanYeuCau.js';
import { daBatMatKhau, docBoVe } from './ve.js';
import {
  MA_DEFAULT, TEN_CONG, bangChoApp, bangModel, giaiDefault, hangSo, modelapiGoiDuoc, ramboChayDuoc, type LoaiKhoa, type MucModel,
} from '../bangModel.js';
import { congAgent } from '../../llm/gateway.js';

export const NHAN_CONG_ANTHROPIC = 'cong-anthropic';

/** Điểm cuối cho `turn.ts`. `key` để trống — khoá chọn theo lượt ở `guiChinhHang`. */
export function diemCuoiChinhHang(): LlmEndpoint {
  return { root: gocChinhHang(), key: undefined, local: false, label: NHAN_CONG_ANTHROPIC, giaoThuc: 'anthropic' };
}

async function laAdminNguoi(userId: number): Promise<boolean> {
  try {
    const { laAdmin } = await import('../../pro.service.js');
    return await laAdmin(userId);
  } catch {
    return false;
  }
}

export interface QuyenChinhHang {
  laAdmin: boolean;
  /** KHOÁ CHUNG mở (admin hoặc vé `ca` còn sống) — tên cũ giữ để mã 17/10 chạy. */
  modelCao: boolean;
  /** Khoá RIÊNG của Invisible mở (admin hoặc vé `ci`). */
  invisible: boolean;
}

export async function quyenChinhHang(userId: number, ve: unknown): Promise<QuyenChinhHang> {
  const laAdmin = await laAdminNguoi(userId);
  if (laAdmin) return { laAdmin, modelCao: true, invisible: true };
  const q = ve ? await docBoVe(userId, ve).catch(() => ({ chung: false, invisible: false })) : { chung: false, invisible: false };
  return { laAdmin, modelCao: q.chung, invisible: q.invisible };
}

/** Quyền ⇒ model này có mở chưa. Free luôn mở (trần chi tiêu kiểm riêng). */
export function daMoKhoa(m: MucModel, q: QuyenChinhHang): boolean {
  if (m.khoa === 'free') return true;
  return m.khoa === 'invisible' ? q.invisible : q.modelCao;
}

export interface ModelChoApp {
  id: string;
  ten: string;
  mo: string;
  moEn: string;
  /** Tên CỔNG hiển thị (CuongMini …) — không bao giờ là tên nhà cung cấp. */
  nhom: string;
  /** Định danh nội bộ của cổng (app dùng để nhóm, KHÔNG hiện): `anthropic` | `modelapi` | `rambo`. */
  cong: 'anthropic' | 'modelapi' | 'rambo';
  khoa: LoaiKhoa;
  /** Cần nhập khoá trước khi dùng (người thường chưa có vé loại này). App hiện tối hơn. */
  canMoKhoa: boolean;
  /** `chung` | `invisible` — loại khoá cần nhập (app gửi kèm khi mở khoá). */
  loaiKhoa?: 'chung' | 'invisible';
  dungDuoc: boolean;
  mienPhi: boolean;
  hang: HangChinhHang;
  dat?: boolean;
  /**
   * 19/10/2026: tài khoản FREE (không Pro, không hạn mức nhóm) chỉ chạy được CuongMini Default ⇒ mọi model khác
   * mang `canPro: true` + `dungDuoc: false`: app hiện ổ khoá + lời mời nâng cấp (không hỏi khoá).
   */
  canPro?: boolean;
}

/**
 * Danh sách model cho app (`/agent/tools`): nhóm FREE trước, rồi nhóm cần khoá; trong nhóm năng lực cao → thấp (19/10/2026).
 * KHÔNG có tên model thật. Rambo bật ⇒ thêm bảng rambo cũ ở cuối (nhóm "CuongMini Classic").
 */
/** Một mục cho app — THUẦN (test được): không có trường `model` (tên thật) nào đi ra. */
export function mucChoApp(m: MucModel, q: QuyenChinhHang, coKeyAnthropic: boolean): ModelChoApp {
  return {
    id: m.id,
    ten: m.ten,
    mo: m.mo,
    moEn: m.moEn,
    /* Default: không thuộc cổng nào cố định — nhóm "CuongMini", `cong` = cổng nó đang chạy lúc này. */
    nhom: m.id === MA_DEFAULT ? 'CuongMini' : TEN_CONG[m.cong],
    cong: m.id === MA_DEFAULT ? giaiDefault().cong : m.cong,
    khoa: m.khoa,
    canMoKhoa: !daMoKhoa(m, q),
    ...(m.khoa !== 'free' ? { loaiKhoa: m.khoa as 'chung' | 'invisible' } : {}),
    dungDuoc: m.id === MA_DEFAULT ? true : m.cong === 'anthropic' ? coKeyAnthropic : m.cong === 'rambo' ? Boolean(congAgent()) : modelapiGoiDuoc(m),
    mienPhi: m.khoa === 'free',
    hang: hangSo(m),
    ...(m.dat ? { dat: true } : {}),
  };
}

/**
 * 19/10/2026: Default → Classic (rambo, khi admin BẬT) → free → cần khoá (`bangChoApp`). `chiDefault` = tài khoản
 * FREE: chỉ Default dùng được (khi rambo sống), mọi model khác `canPro`.
 */
export async function dsModelChoApp(q: QuyenChinhHang, o: { chiDefault?: boolean } = {}): Promise<ModelChoApp[]> {
  const coKey = await coKeyKhaDung();
  return dsModelChoAppThuan(q, coKey, o);
}

/** THUẦN (test được): danh sách cho app theo trạng thái rambo hiện tại. */
export function dsModelChoAppThuan(q: QuyenChinhHang, coKey: boolean, o: { chiDefault?: boolean } = {}): ModelChoApp[] {
  return bangChoApp().map((m) => {
    const muc = mucChoApp(m, q, coKey);
    if (!o.chiDefault) return muc;
    if (m.id === MA_DEFAULT) {
      /* Free: Default chỉ chạy trên rambo (gói trọn) — rambo không sống ⇒ tạm bảo trì. */
      return { ...muc, dungDuoc: ramboChayDuoc() };
    }
    return { ...muc, canMoKhoa: false, canPro: true, dungDuoc: false };
  });
}

/** Tên cũ (17/10): chỉ phần cổng chính hãng. */
export async function dsModelChinhHang(q: QuyenChinhHang): Promise<ModelChoApp[]> {
  return (await dsModelChoApp(q)).filter((m) => m.cong === 'anthropic');
}

export interface CongNangCap {
  cong: 'anthropic' | 'modelapi';
  ten: string;
  /** Admin đã đặt mật khẩu cho cổng này chưa (chưa ⇒ người thường không mở được). */
  daBat: boolean;
  canMatKhau: boolean;
  models: Array<{ id: string; ten: string; mo: string; dat?: boolean; dungDuoc: boolean }>;
}

/**
 * Lời mời nâng cấp (17/10, khi rambo hỏng ⇒ Free). 18/10: rambo đã tắt nên
 * thẻ này hầu như không còn xuất hiện; giữ hình dạng cho app cũ, nội dung lấy
 * từ bảng chung (tên CuongMini, không còn "modelapi"/"Anthropic").
 */
export async function cacCongNangCap(userId: number, o: { veAnthropic?: unknown; veDuPhong?: unknown }): Promise<CongNangCap[]> {
  const q = await quyenChinhHang(userId, o.veAnthropic);
  const coKey = await coKeyKhaDung();
  return [{
    cong: 'anthropic',
    ten: TEN_CONG.anthropic,
    daBat: q.laAdmin || (await daBatMatKhau('chung')),
    canMatKhau: !q.modelCao,
    models: bangModel().filter((m) => m.cong === 'anthropic' && m.khoa === 'chung')
      .map((m) => ({ id: m.id, ten: m.ten, mo: m.mo, dungDuoc: coKey })),
  }];
}

export const CAU_DOI_CONG_FREE = 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.';

export function modelFreeChoApp(): ModelChinhHang {
  return dsModelChinhHangGoc().find((m) => m.id === MA_FREE)!;
}

/**
 * Một lời gọi VĂN BẢN có stream (không tool) — cho CuongMini trong thi.
 * Tự chuyển key, tự ghi sổ. Ném `CongAnthropicLoi` khi hết key.
 */
export async function goiVanBanChinhHang(o: {
  system: string;
  /** Chữ, hoặc khối nội dung kiểu Anthropic (chữ + ảnh base64) — 22/10/2026: trợ lý CT Work gửi ảnh người dùng dán. */
  messages: Array<{ role: 'user' | 'assistant'; content: string | Array<Record<string, unknown>> }>;
  model: string;
  hang: HangChinhHang;
  maxTokens: number;
  userId: number;
  viec: NguCanhGoi['viec'];
  onToken?: (delta: string) => void;
  signal?: AbortSignal;
  /**
   * Lượt NÓI NGẮN cần chữ đầu sớm (19/10/2026 — Trò chuyện cùng CuongMini): KHÔNG nghĩ
   * (`thinking: disabled`, Haiku 5.5 chỉ nhận ở effort ≤ high), `effort` thấp, đúng
   * `maxTokens` nơi gọi đặt (không nâng lên 16K), không tham số beta. Model từ chối
   * `disabled` ⇒ `banAnToan` gửi lại MỘT lần bằng adaptive + cùng effort.
   */
  nhanh?: { effort: 'low' | 'medium' };
  /** 22/10/2026 (trợ lý CT Work): tool gốc — model xin đọc dữ liệu dự án bằng tool call thay vì JSON trong chữ. */
  tools?: LLMTool[];
}): Promise<{ text: string; biCat: boolean; usd: number; ttfbMs: number; toolCalls?: LLMToolCall[] }> {
  const body: ThanAnthropic = {
    model: o.model,
    max_tokens: o.maxTokens,
    stream: true,
    system: o.system,
    messages: o.messages.filter((m) => (typeof m.content === 'string' ? m.content : m.content.length)).map((m) => ({ ...m })),
    ...(o.tools?.length ? { tools: o.tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters })) } : {}),
  };
  let beta: string[] = [];
  if (o.nhanh) {
    body.thinking = { type: 'disabled' };
    body.output_config = { effort: o.nhanh.effort };
    ganCache(body);
  } else {
    /* Không cắt câu trả lời: thinking cũng ăn vào max_tokens ⇒ tối thiểu 16K. */
    beta = await dungThanChinhHang(body, { laAgent: false, maxTokens: Math.max(o.maxTokens, 16_000) });
  }
  const nguCanh: NguCanhGoi = { userId: o.userId, viec: o.viec, hang: o.hang, model: o.model };
  const ctl = new AbortController();
  if (o.signal) o.signal.addEventListener('abort', () => ctl.abort(), { once: true });
  const g = await guiChinhHang({
    body, signal: ctl.signal, nguCanh, beta,
    banAnToan: () => (o.nhanh ? { ...body, thinking: { type: 'adaptive' } } : thanAnToan(body)),
  });

  let text = '';
  let stop: string | null = null;
  const tools = new Map<number, { name: string; args: string }>();
  const dung = { input: 0, output: 0, cacheDoc: 0, cacheGhi: 0 };
  let thanhCong = false;
  let usd = 0;
  try {
    const reader = g.res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const dong = buf.split('\n');
      buf = dong.pop() ?? '';
      for (const d of dong) {
        if (!d.startsWith('data: ')) continue;
        let j: any;
        try { j = JSON.parse(d.slice(6)); } catch { continue; }
        if (j.type === 'message_start') {
          const u = j.message?.usage ?? {};
          dung.input = u.input_tokens ?? 0;
          dung.cacheDoc = u.cache_read_input_tokens ?? 0;
          dung.cacheGhi = u.cache_creation_input_tokens ?? 0;
        } else if (j.type === 'content_block_delta' && j.delta?.type === 'text_delta' && typeof j.delta.text === 'string') {
          text += j.delta.text;
          o.onToken?.(j.delta.text);
        } else if (j.type === 'content_block_start' && j.content_block?.type === 'tool_use') {
          tools.set(j.index ?? tools.size, { name: String(j.content_block.name ?? ''), args: '' });
        } else if (j.type === 'content_block_delta' && j.delta?.type === 'input_json_delta') {
          const t = tools.get(j.index ?? -1);
          if (t) t.args += j.delta.partial_json ?? '';
        } else if (j.type === 'message_delta') {
          if (j.delta?.stop_reason) stop = j.delta.stop_reason;
          if (j.usage?.output_tokens) dung.output = j.usage.output_tokens;
        } else if (j.type === 'error') {
          throw new Error(`Cổng chính hãng trả lỗi: ${JSON.stringify(j.error ?? j).slice(0, 200)}`);
        }
      }
    }
    thanhCong = true;
  } finally {
    usd = await ghiDung({ ...nguCanh, keyId: g.key.id, dung, thanhCong, thoiGianMs: Date.now() - g.batDau, ttfbMs: g.ttfbMs });
    if (!thanhCong) logger.warn('[anthropic] luồng văn bản gãy giữa chừng', { model: o.model, usd });
  }
  const toolCalls = [...tools.entries()].sort((a, b) => a[0] - b[0]).filter(([, t]) => t.name).map(([, t]) => docThamSoTool(t.name, t.args));
  return { text, biCat: stop === 'max_tokens', usd, ttfbMs: g.ttfbMs, ...(toolCalls.length ? { toolCalls } : {}) };
}
