/**
 * AI Chat web + app desktop — ba bậc Claude đi THẲNG cổng Anthropic chính hãng ("CuongMini Code Max").
 *
 * 09/11/2026 — bộ model của trang `/chat` (và màn AI chat của app desktop, cùng gọi `POST /ai/chat`):
 *
 *   | Tên hiển thị       | Mã gửi lên         | Model thật           | Đè bằng env               |
 *   |--------------------|--------------------|----------------------|---------------------------|
 *   | CuongMini 3.11     | `cuongmini-3.11`   | Groq (như cũ)        | —                         |
 *   | CuongMini Pro      | `cuongmini-pro`    | `claude-haiku-5-5`   | `WEB_CHAT_MODEL_PRO`      |
 *   | CuongMini Pro 2    | `cuongmini-pro-2`  | `claude-sonnet-5-5`  | `WEB_CHAT_MODEL_PRO2`     |
 *   | CuongMini Max      | `cuongmini-max`    | `claude-opus-5-5`    | `WEB_CHAT_MODEL_MAX`      |
 *
 * KHÔNG qua modelapi / rambo. Cổng chính hãng hỏng, hết key, hoặc chạm trần ⇒ lượt đó lùi về CuongMini 3.11 (Groq) và
 * client nhận khung `model` có `fellBack: true` (giao diện tự đổi nút chọn model về mặc định + báo một dòng).
 *
 * Trần RIÊNG (sổ `anthropic_usage.viec = 'web_chat'`, không ăn trần AI Code / CT Work / chấm thi):
 *   `WEB_CHAT_CHINH_HANG_USD_NGAY`        (mặc định 30 $/ngày cả web; 0 = tắt hẳn ba bậc Claude)
 *   `WEB_CHAT_CHINH_HANG_USD_NGUOI_NGAY`  (mặc định 3 $/ngày mỗi người; 0 = không trần người)
 * Ngày tính theo giờ VN (`dauNgayVn`).
 */
import { logger } from '../utils/logger.js';

type GoiVanBan = (o: {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string | Array<Record<string, unknown>> }>;
  model: string;
  hang: 'free' | 'cao';
  maxTokens: number;
  userId: number;
  viec: 'web_chat';
  signal?: AbortSignal;
  onToken?: (d: string) => void;
}) => Promise<{ usd: number }>;

export type MaBacClaude = 'cuongmini-pro' | 'cuongmini-pro-2' | 'cuongmini-max';

const MAC_DINH: Record<MaBacClaude, { env: string; model: string }> = {
  'cuongmini-pro': { env: 'WEB_CHAT_MODEL_PRO', model: 'claude-haiku-5-5' },
  'cuongmini-pro-2': { env: 'WEB_CHAT_MODEL_PRO2', model: 'claude-sonnet-5-5' },
  'cuongmini-max': { env: 'WEB_CHAT_MODEL_MAX', model: 'claude-opus-5-5' },
};

/** Model thật của một bậc. Env đè phải là `claude-*` — tên khác bị bỏ qua (cổng này chỉ bán Claude). */
export function modelChinhHangCuaBac(bac: MaBacClaude): string {
  const d = MAC_DINH[bac];
  const env = process.env[d.env]?.trim();
  return env && /^claude-[\w.-]+$/.test(env) ? env : d.model;
}

/** Trần ra (token) theo bậc — câu trả lời dài (lời giải toán, code) không bị cắt. */
export function maxTokensCuaBac(bac: MaBacClaude): number {
  return bac === 'cuongmini-max' ? 32_000 : bac === 'cuongmini-pro-2' ? 24_000 : 16_000;
}

function soEnv(ten: string, mac: number): number {
  const raw = process.env[ten]?.trim();
  if (!raw) return mac;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : mac;
}

export function tranChatChinhHang(): { tong: number; nguoi: number } {
  return { tong: soEnv('WEB_CHAT_CHINH_HANG_USD_NGAY', 30), nguoi: soEnv('WEB_CHAT_CHINH_HANG_USD_NGUOI_NGAY', 3) };
}

/** THUẦN — test đọc. */
export function trongTranChat(daTieu: { ca: number; nguoi: number }): boolean {
  const t = tranChatChinhHang();
  if (!(t.tong > 0)) return false;
  if (daTieu.ca >= t.tong) return false;
  return !(t.nguoi > 0 && daTieu.nguoi >= t.nguoi);
}

export type LyDoKhongDung = 'tat' | 'cong_hong' | 'het_key' | 'cham_tran' | 'so_hong' | 'khach';

/**
 * Cổng chính hãng dùng được cho lượt này không. Trả `null` = được; còn lại là lý do (để log + gửi client).
 * Sổ hỏng ⇒ KHÔNG dùng (an toàn về tiền).
 */
export async function chatChinhHangSanSang(userId: number | undefined): Promise<LyDoKhongDung | null> {
  if (!userId) return 'khach';
  if (!(tranChatChinhHang().tong > 0)) return 'tat';
  const { congDangHong } = await import('./agent/bangModel.js');
  if (congDangHong('anthropic')) return 'cong_hong';
  const { coKeyKhaDung } = await import('./agent/anthropicChinhHang/khoKey.js');
  if (!(await coKeyKhaDung())) return 'het_key';
  try {
    const { prisma } = await import('../config/database.js');
    const { dauNgayVn } = await import('./agent/anthropicChinhHang/hanMuc.js');
    const tu = dauNgayVn();
    const [ca, nguoi] = await Promise.all([
      prisma.anthropicUsage.aggregate({ where: { viec: 'web_chat', createdAt: { gte: tu } }, _sum: { costUsd: true } }),
      prisma.anthropicUsage.aggregate({ where: { viec: 'web_chat', userId, createdAt: { gte: tu } }, _sum: { costUsd: true } }),
    ]);
    return trongTranChat({ ca: Number(ca._sum.costUsd ?? 0), nguoi: Number(nguoi._sum.costUsd ?? 0) }) ? null : 'cham_tran';
  } catch (err) {
    logger.warn('[web-chat] không đọc được sổ cổng chính hãng — bỏ qua ba bậc Claude', { error: (err as Error).message });
    return 'so_hong';
  }
}

/**
 * Chảy chữ từ cổng chính hãng dưới dạng async generator.
 *
 * `goiVanBanChinhHang` trả chữ qua callback `onToken` rồi resolve khi xong — ở đây nối callback đó vào một hàng đợi
 * để route SSE `for await` được như với Groq. Lỗi trước chữ đầu ⇒ ném (nơi gọi lùi về Groq); lỗi giữa chừng ⇒ ném
 * sau khi đã nhả phần đã có (nơi gọi giữ phần dở).
 */
export async function* streamChatChinhHang(o: {
  bac: MaBacClaude;
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string | Array<Record<string, unknown>> }>;
  userId: number;
  signal?: AbortSignal;
  /** Chỉ cho test: thay lời gọi cổng thật. */
  _goi?: GoiVanBan;
}): AsyncGenerator<string, { usd: number; model: string }, unknown> {
  const goiVanBanChinhHang: GoiVanBan = o._goi ?? (await import('./agent/anthropicChinhHang/dinhTuyen.js')).goiVanBanChinhHang;
  const model = modelChinhHangCuaBac(o.bac);
  const hang = o.bac === 'cuongmini-max' ? 'cao' : 'free';

  const hang_doi: string[] = [];
  let danhThuc: (() => void) | null = null;
  let xong = false;
  let loi: unknown = null;
  let usd = 0;
  const bao = () => { const f = danhThuc; danhThuc = null; f?.(); };

  void goiVanBanChinhHang({
    system: o.system,
    messages: o.messages,
    model,
    hang,
    maxTokens: maxTokensCuaBac(o.bac),
    userId: o.userId,
    viec: 'web_chat',
    signal: o.signal,
    onToken: (d) => { hang_doi.push(d); bao(); },
  }).then((r) => { usd = r.usd; }).catch((e) => { loi = e; }).finally(() => { xong = true; bao(); });

  for (;;) {
    if (hang_doi.length) { yield hang_doi.splice(0, hang_doi.length).join(''); continue; }
    if (xong) break;
    await new Promise<void>((r) => { danhThuc = r; });
  }
  if (loi) throw loi;
  return { usd, model };
}
