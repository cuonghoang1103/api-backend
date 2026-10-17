/**
 * Cài đặt động của cổng chính hãng (admin đổi trên trang, không cần deploy):
 *
 *  • SERVER TOOL của Anthropic — `web_search` và `code_execution` chạy TRÊN máy
 *    Anthropic. Mặc định TẮT (AI Code đã có tool web riêng chạy ở máy chủ mình).
 *    Bật thì tính tiền riêng: tìm web $10/1.000 lần (`gia.ts`); code execution
 *    tính theo giờ container — chỉ đếm số lần, không ước tiền.
 *  • GIỚI HẠN MODEL thật từ `GET /v1/models/{id}` (max_input_tokens, max_tokens)
 *    — nhớ 1 ngày; hỏi không được ⇒ 1.000.000 / 128.000 (đo 17/10/2026).
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { PHIEN_BAN_API, gocChinhHang } from './cauHinh.js';
import { keyKhaDung } from './khoKey.js';

const KHOA_SERVER_TOOL = 'anthropic_chinh_hang_server_tools';

export interface ServerToolBat { webSearch: boolean; codeExecution: boolean }

let nhoTool: { luc: number; v: ServerToolBat } | null = null;

export async function docServerTool(): Promise<ServerToolBat> {
  if (nhoTool && Date.now() - nhoTool.luc < 30_000) return nhoTool.v;
  let v: ServerToolBat = { webSearch: false, codeExecution: false };
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA_SERVER_TOOL } });
    if (r?.value) {
      const j = JSON.parse(r.value) as Partial<ServerToolBat>;
      v = { webSearch: j.webSearch === true, codeExecution: j.codeExecution === true };
    }
  } catch { /* hỏng ⇒ tắt */ }
  nhoTool = { luc: Date.now(), v };
  return v;
}

export async function datServerTool(d: Partial<ServerToolBat>): Promise<ServerToolBat> {
  const cu = await docServerTool();
  const v = {
    webSearch: typeof d.webSearch === 'boolean' ? d.webSearch : cu.webSearch,
    codeExecution: typeof d.codeExecution === 'boolean' ? d.codeExecution : cu.codeExecution,
  };
  const value = JSON.stringify(v);
  await prisma.appSetting.upsert({ where: { key: KHOA_SERVER_TOOL }, update: { value }, create: { key: KHOA_SERVER_TOOL, value } });
  nhoTool = { luc: Date.now(), v };
  return v;
}

/**
 * Khai báo server tool cho thân yêu cầu. `web_search_20260209` ĐÃ gồm lọc
 * động chạy bằng code execution bên trong — tài liệu Anthropic dặn KHÔNG khai
 * thêm `code_execution` khi đã có nó, nên bật cả hai thì chỉ khai web_search.
 */
export function khaiServerTool(v: ServerToolBat, model = ''): Array<Record<string, unknown>> {
  if (v.webSearch) return [{ type: kieuWebSearch(model), name: 'web_search', max_uses: 8 }];
  if (v.codeExecution) return [{ type: 'code_execution_20260521', name: 'code_execution' }];
  return [];
}

/**
 * Bản `web_search` hợp với model. `_20260209` (lọc động) CHỈ chạy trên Opus
 * 4.6–5.5 / Sonnet 4.6, 5, 5.5 (tài liệu Anthropic, bảng 06/10/2026) — Haiku
 * 5.5 (CuongMini Free, `tim_web`) và Fable phải dùng bản cơ bản `_20250305`,
 * gửi nhầm bản mới là 400 cả lượt. Model không nhận ra ⇒ bản cơ bản (an toàn).
 */
export function kieuWebSearch(model: string): string {
  return /^claude-(opus-(4-[678]|5|5-5)|sonnet-(4-6|5|5-5))$/.test(model)
    ? 'web_search_20260209'
    : 'web_search_20250305';
}

// ─── Giới hạn model ──────────────────────────────────────────────────

export interface GioiHanModel { maxInput: number; maxOutput: number; nguon: 'api' | 'mac_dinh' }
const MAC_DINH: GioiHanModel = { maxInput: 1_000_000, maxOutput: 128_000, nguon: 'mac_dinh' };
const nhoGioiHan = new Map<string, { luc: number; v: GioiHanModel }>();
const MOT_NGAY = 86_400_000;

export async function gioiHanModel(model: string): Promise<GioiHanModel> {
  const nho = nhoGioiHan.get(model);
  if (nho && Date.now() - nho.luc < (nho.v.nguon === 'api' ? MOT_NGAY : 10 * 60_000)) return nho.v;
  let v = MAC_DINH;
  try {
    const k = (await keyKhaDung())[0];
    if (k) {
      const r = await fetch(`${gocChinhHang()}/v1/models/${encodeURIComponent(model)}`, {
        headers: { 'x-api-key': k.khoa, 'anthropic-version': PHIEN_BAN_API },
        signal: AbortSignal.timeout(8_000),
      });
      if (r.ok) {
        const j = (await r.json()) as { max_input_tokens?: number; max_tokens?: number };
        v = {
          maxInput: Number(j.max_input_tokens) > 0 ? Number(j.max_input_tokens) : MAC_DINH.maxInput,
          maxOutput: Number(j.max_tokens) > 0 ? Number(j.max_tokens) : MAC_DINH.maxOutput,
          nguon: 'api',
        };
      }
    }
  } catch (err) {
    logger.debug?.('[anthropic] không đọc được giới hạn model', { model, error: (err as Error).message });
  }
  nhoGioiHan.set(model, { luc: Date.now(), v });
  return v;
}
