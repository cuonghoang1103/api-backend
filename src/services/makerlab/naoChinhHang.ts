/**
 * ============================================================
 * Maker Lab — não robot Odin trên cổng Anthropic CHÍNH HÃNG (15/11/2026)
 * ============================================================
 *
 * Người dùng: "lấy cổng Anthropic chính hãng (đang cho CT Work + ngôn ngữ dùng)
 * thay cho Odin, model nhanh mà thông minh".
 *
 * Cùng một cửa với CT Work / Luyện nói: `goiVanBanChinhHang` (tự chuyển key, tự ghi
 * sổ `anthropic_usage`), chế độ NÓI NHANH (`nhanh` ⇒ không nghĩ, effort thấp, chữ
 * đầu sớm). Sổ riêng `viec = 'robot_voice'` + trần $/ngày riêng — không ăn trần AI
 * Code / CT Work của ai.
 *
 *   câu thường  ⇒ `claude-haiku-5-5`  (MAKERLAB_MODEL_CHINH_HANG)      — nhanh, rẻ
 *   câu khó     ⇒ `claude-sonnet-5-5` (MAKERLAB_MODEL_CHINH_HANG_KHO)  — thông minh hơn
 *
 * Tắt hẳn: `MAKERLAB_CHINH_HANG=0` ⇒ robot về chuỗi cũ (máy nhà → modelapi → Groq).
 * KHÔNG trần tiền mặc định (chủ web 15/11: "đừng giới hạn, mỗi mình tôi dùng") — thay vào đó
 * CHỈ robot do tài khoản ADMIN sở hữu mới đi cổng này (`chuLaAdmin`). Muốn có trần thì đặt
 * `MAKERLAB_CHINH_HANG_USD_NGAY` > 0 (giờ VN). Hỏng / chạm trần ⇒ chuỗi cũ đỡ ngay trong lượt.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export const NHAN_CHINH_HANG = 'anthropic';

function soEnv(ten: string, mac: number): number {
  const raw = process.env[ten]?.trim();
  if (!raw) return mac;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : mac;
}

/** Bật mặc định; chỉ `MAKERLAB_CHINH_HANG=0` mới tắt. THUẦN. */
export function chinhHangBat(): boolean {
  return process.env.MAKERLAB_CHINH_HANG?.trim() !== '0';
}

/** Model theo loại câu. THUẦN — test đọc. */
export function modelRobotChinhHang(kho: boolean): string {
  return kho
    ? process.env.MAKERLAB_MODEL_CHINH_HANG_KHO?.trim() || 'claude-sonnet-5-5'
    : process.env.MAKERLAB_MODEL_CHINH_HANG?.trim() || 'claude-haiku-5-5';
}

/** Trần $/ngày; 0 / để trống = KHÔNG trần. */
export function tranNgayUsd(): number {
  return soEnv('MAKERLAB_CHINH_HANG_USD_NGAY', 0);
}

/** Đã tiêu có còn trong trần không. THUẦN — test đọc. Trần 0 = không trần. */
export function trongTran(daTieu: number, tran = tranNgayUsd()): boolean {
  return !(tran > 0) || daTieu < tran;
}

// Nhớ 20 s: mỗi câu nói không cần một phép cộng sổ, mà vượt trần thì cũng chỉ lố vài câu.
let nhoSanSang: { den: number; ok: boolean } | null = null;

/** Cổng dùng được không: bật · không đang nghỉ · còn key · (nếu có đặt) còn trong trần ngày. */
export async function chinhHangSanSang(): Promise<boolean> {
  if (!chinhHangBat()) return false;
  if (nhoSanSang && nhoSanSang.den > Date.now()) return nhoSanSang.ok;
  let ok = false;
  try {
    const { congDangHong } = await import('../agent/bangModel.js');
    if (!congDangHong('anthropic')) {
      const { coKeyKhaDung } = await import('../agent/anthropicChinhHang/khoKey.js');
      if (await coKeyKhaDung('robot_voice')) {
        if (!(tranNgayUsd() > 0)) ok = true;
        else {
          const { dauNgayVn } = await import('../agent/anthropicChinhHang/hanMuc.js');
          const s = await prisma.anthropicUsage.aggregate({
            where: { viec: 'robot_voice', createdAt: { gte: dauNgayVn() } },
            _sum: { costUsd: true },
          });
          ok = trongTran(Number(s._sum.costUsd ?? 0));
          if (!ok) logger.warn('MakerLab não chính hãng chạm trần ngày — dùng chuỗi cũ', { tranUsd: tranNgayUsd() });
        }
      }
    }
  } catch (err) {
    // Sổ hỏng ⇒ KHÔNG dùng bậc trả tiền (an toàn về tiền) — chuỗi cũ vẫn đỡ.
    logger.warn('MakerLab không đọc được sổ cổng chính hãng — bỏ qua bậc này', { error: (err as Error).message });
  }
  nhoSanSang = { den: Date.now() + 20_000, ok };
  return ok;
}

/** Quên kết quả nhớ (sau khi cổng hỏng, để lượt sau hỏi lại). */
export function quenSanSang(): void {
  nhoSanSang = null;
}

const _chu = new Map<number, number | null>();
/** Chủ thiết bị — người được ghi sổ. Không có chủ ⇒ null (sổ vẫn ghi, userId trống). */
export async function chuThietBi(deviceId: number): Promise<number | null> {
  if (_chu.has(deviceId)) return _chu.get(deviceId) ?? null;
  const d = await prisma.makerDevice.findUnique({ where: { id: deviceId }, select: { ownerId: true } }).catch(() => null);
  const id = d?.ownerId ?? null;
  _chu.set(deviceId, id);
  return id;
}

type TinOpenAi = { role: 'system' | 'user' | 'assistant'; content: string };

/**
 * Tin kiểu OpenAI (system đứng đầu, user/assistant xen kẽ) ⇒ kiểu Anthropic. THUẦN — test đọc.
 * Mọi `system` gộp vào lời dặn hệ thống; tin rỗng bỏ; tin đầu phải là `user` (API bắt buộc).
 */
export function chuyenTin(tin: TinOpenAi[]): {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
} {
  const sys: string[] = [];
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const t of tin) {
    const c = (t.content ?? '').trim();
    if (!c) continue;
    if (t.role === 'system') sys.push(c);
    else messages.push({ role: t.role, content: c });
  }
  while (messages.length && messages[0].role !== 'user') messages.shift();
  return { system: sys.join('\n\n'), messages };
}

/** Mẩu chữ theo đúng dáng `chat.completions` stream — vòng nói của robot đọc `choices[0].delta.content`. */
export interface MauLuong {
  choices: Array<{ delta: { content?: string } }>;
}

/**
 * Chảy chữ từ cổng chính hãng thành async iterable dáng OpenAI.
 * Lỗi trước chữ đầu ⇒ ném (nơi gọi lùi về chuỗi cũ); nơi gọi thôi đọc ⇒ huỷ lời gọi (không trả tiền phần thừa).
 */
export async function* luongChinhHang(o: {
  tin: TinOpenAi[];
  model: string;
  maxTokens: number;
  deviceId: number;
}): AsyncGenerator<MauLuong, void, unknown> {
  const { goiVanBanChinhHang } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
  const { system, messages } = chuyenTin(o.tin);
  const userId = await chuThietBi(o.deviceId);
  const batDau = Date.now();
  let chuDauMs = 0;

  const hangDoi: string[] = [];
  let danhThuc: (() => void) | null = null;
  let xong = false;
  let loi: unknown = null;
  let usd = 0;
  const bao = () => { const f = danhThuc; danhThuc = null; f?.(); };
  const ctl = new AbortController();
  // Chữ đầu phải về trong 8 s, cả lượt trong 45 s — robot đứng "ĐANG NGHĨ" lâu hơn thế là hỏng với người nghe.
  const henChuDau = setTimeout(() => { if (!chuDauMs) ctl.abort(); }, 8_000);
  const henTong = setTimeout(() => ctl.abort(), 45_000);

  void goiVanBanChinhHang({
    system,
    messages,
    model: o.model,
    hang: 'free',
    // Thấp quá thì JSON {say, actions} bị cắt giữa chừng; trần độ dài thật nằm ở lời dặn độ dài trong prompt.
    maxTokens: Math.max(o.maxTokens, 400),
    userId: userId ?? 0,
    viec: 'robot_voice',
    nhanh: { effort: 'low' },
    signal: ctl.signal,
    onToken: (d) => {
      if (!chuDauMs) chuDauMs = Date.now() - batDau;
      hangDoi.push(d);
      bao();
    },
  })
    .then((r) => { usd = r.usd; })
    .catch((e) => { loi = e; })
    .finally(() => { xong = true; bao(); });

  try {
    for (;;) {
      if (hangDoi.length) {
        yield { choices: [{ delta: { content: hangDoi.splice(0, hangDoi.length).join('') } }] };
        continue;
      }
      if (xong) break;
      await new Promise<void>((r) => { danhThuc = r; });
    }
  } finally {
    clearTimeout(henChuDau);
    clearTimeout(henTong);
    if (!xong) ctl.abort();
  }
  if (loi) {
    quenSanSang();
    throw loi;
  }
  logger.info('MakerLab não chính hãng', {
    deviceId: o.deviceId,
    model: o.model,
    chuDauMs,
    tongMs: Date.now() - batDau,
    usd: Number(usd.toFixed(5)),
  });
}
