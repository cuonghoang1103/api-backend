/**
 * ============================================================
 * TÌM WEB — `tim_web` (mọi cổng: rambo / modelapi / Claude chính hãng)
 * ============================================================
 *
 * Agent ĐỌC được một địa chỉ (`doc_web`, `web_mo`) nhưng trước bản đầu tiên
 * của file này KHÔNG TÌM được một địa chỉ. Hỏi "thư viện X bản mới nhất là gì"
 * là bó tay, vì nó không có đường nào để biết ngoài những gì đã học.
 *
 * ─── BA NGUỒN, THỬ LẦN LƯỢT (đợt 2, 18/10/2026) ───
 *  1. `searxng`   — SearXNG tự dựng trên VPS (`src/services/search/searxng.ts`),
 *                   MIỄN PHÍ, đã phục vụ AI Chat từ 08/2026. Trả rỗng ⇒ thử tiếp.
 *  2. `tavily`    — chỉ khi có `TAVILY_API_KEY`/`SEARCH_API_KEY`.
 *  3. `anthropic` — cổng Claude chính hãng: `claude-haiku-5-5` + server tool
 *                   `web_search` (bản cơ bản `_20250305` — Haiku không nhận bản
 *                   lọc động, xem `caiDat.kieuWebSearch`). TỐN TIỀN THẬT
 *                   ($10/1.000 lần tìm + token Haiku) ⇒ ghi sổ `AnthropicUsage`
 *                   (`viec: 'tim_web'`, `hang: 'free'` — tính vào trần CuongMini
 *                   Free của người dùng), trần số lần/ngày/người
 *                   (`AGENT_TIM_WEB_LUOT_NGAY`, mặc định 40). Admin không giới hạn.
 *  Đổi thứ tự / bỏ bớt: `AGENT_TIM_WEB_NGUON=searxng,tavily,anthropic`.
 *
 * Trước bản này cổng chính hãng có `web_search` server tool riêng (admin bật),
 * còn rambo/modelapi thì chỉ có Tavily — mà Tavily chưa từng được cắm khoá trên
 * prod. Nay MỌI cổng đi qua cùng một tool máy chủ này.
 *
 * ─── ⚠️ VÌ SAO CHẠY Ở MÁY CHỦ, KHÔNG Ở APP ───
 * `ring: 'server'`. Khoá dịch vụ tìm kiếm ở lại máy chủ và KHÔNG BAO GIỜ đi
 * xuống máy người dùng. App desktop tải về được, `.asar` mở bằng một lệnh.
 *
 * ─── ⚠️ KHÔNG TÌM ĐƯỢC THÌ NÓI THẲNG ───
 * Không cào trang kết quả của Google/Bing. Và không bao giờ biến "chưa cấu
 * hình" / "bị chặn" / "hết hạn mức" thành "không tìm thấy gì": model sẽ nói
 * với người dùng một câu sai mà nghe hợp lý.
 */
import { logger } from '../../utils/logger.js';
import { timWeb as timSearxngGoc, timWebBat as searxngBat } from '../search/searxng.js';
import { coKeyKhaDung } from './anthropicChinhHang/khoKey.js';
import { ghiDung, guiChinhHang, CongAnthropicLoi } from './anthropicChinhHang/goi.js';
import { kieuWebSearch } from './anthropicChinhHang/caiDat.js';
import { dauNgayVn, loiHetHanMucChinhHang, xemHanMucChinhHang } from './anthropicChinhHang/hanMuc.js';
import type { DungToken } from './anthropicChinhHang/gia.js';

/** Trần kết quả. Nhiều hơn 8 là nhồi ngữ cảnh mà gần như không thêm thông tin. */
const MAX_KETQUA = 8;
/** Trần chữ cho mỗi đoạn trích — cả trang thì đã có `doc_web`/`web_doc`. */
const MAX_CHU_MOI_MUC = 600;
/** Trần phần ghi chú tổng hợp của bộ tìm Anthropic. */
const MAX_GHI_CHU = 1500;
const HET_GIO_TAVILY_MS = 15_000;
const HET_GIO_ANTHROPIC_MS = 60_000;

/** Một kết quả ĐÃ CHUẨN HOÁ — mọi nguồn đều về dạng này. */
export interface MucTimWeb {
  tieuDe: string;
  url: string;
  /** Đoạn trích liên quan (có thể rỗng nếu nguồn không trả). */
  trich: string;
  /** Ngày đăng / tuổi trang nếu nguồn biết (`2026-09-01`, `3 days ago`…). */
  ngay: string | null;
}

export type NguonTim = 'searxng' | 'tavily' | 'anthropic';

export interface KetQuaTimWeb {
  content: string;
  summary: string;
}

// ─── Cấu hình ───────────────────────────────────────────────────────

/** Khoá Tavily. Đọc nhiều tên để không phải sửa mã khi đổi dịch vụ. */
function khoaTavily(): string | null {
  return process.env.TAVILY_API_KEY ?? process.env.SEARCH_API_KEY ?? null;
}

/** Tavily có khoá không — giữ tên cũ cho mã/kiểm cũ. */
export function timWebSanSang(): boolean {
  return khoaTavily() !== null;
}

export function thuTuNguon(): NguonTim[] {
  const raw = process.env.AGENT_TIM_WEB_NGUON?.trim();
  const hop: NguonTim[] = ['searxng', 'tavily', 'anthropic'];
  if (!raw) return hop;
  const ds = raw.split(/[\s,]+/).filter((x): x is NguonTim => (hop as string[]).includes(x));
  return ds.length ? [...new Set(ds)] : hop;
}

/** Trần số lần tìm qua cổng chính hãng mỗi ngày (giờ VN) cho MỘT người không phải admin. */
export function tranLuotNgay(): number {
  const n = Number(process.env.AGENT_TIM_WEB_LUOT_NGAY);
  return Number.isFinite(n) && n >= 0 && process.env.AGENT_TIM_WEB_LUOT_NGAY !== undefined ? Math.floor(n) : 40;
}

export function modelTimWeb(): string {
  return process.env.AGENT_TIM_WEB_MODEL?.trim() || 'claude-haiku-5-5';
}

const CHUA_CAU_HINH =
  'LỖI: tính năng tìm web CHƯA ĐƯỢC CẤU HÌNH trên máy chủ (SearXNG đang tắt, không có '
  + '`TAVILY_API_KEY`, và cổng Claude chính hãng chưa có key). Đây KHÔNG phải lỗi của bạn và cũng '
  + 'không phải "không tìm thấy gì" — hãy nói với người dùng rằng quản trị viên cần bật một nguồn tìm '
  + 'kiếm, rồi dùng `doc_web`/`web_mo` nếu bạn đã biết sẵn một địa chỉ cụ thể.';

// ─── Phụ thuộc (thay được trong test — không gọi mạng/CSDL thật) ──────

export interface PhuThuocTimWeb {
  searxng: (q: string, so: number) => Promise<MucTimWeb[]>;
  anthropic: {
    coKey: () => Promise<boolean>;
    /** `chan` ≠ null ⇒ không được dùng (kèm lý do nói được với người dùng). */
    quyen: (userId: number) => Promise<{ khongGioiHan: boolean; chan: string | null }>;
    demHomNay: (userId: number) => Promise<number>;
    gui: (o: { body: Record<string, unknown>; userId: number; model: string; signal: AbortSignal }) =>
      Promise<{ json: unknown; keyId: number | null; batDau: number; ttfbMs: number }>;
    ghi: (d: { userId: number; model: string; keyId: number | null; dung: DungToken; thoiGianMs: number; ttfbMs: number }) => Promise<number>;
  };
}

const THAT: PhuThuocTimWeb = {
  searxng: async (q, so) => {
    if (!searxngBat()) throw new NguonTat('SearXNG đang tắt (SEARXNG_ENABLED=false)');
    return (await timSearxngGoc(q, so)).map((k) => ({
      tieuDe: k.tieuDe, url: k.url, trich: k.tomTat, ngay: k.ngay ?? null,
    }));
  },
  anthropic: {
    coKey: () => coKeyKhaDung().catch(() => false),
    quyen: async (userId) => {
      const h = await xemHanMucChinhHang(userId, 'free');
      if (h.khongGioiHan) return { khongGioiHan: true, chan: null };
      if (h.goi === 'khac') {
        return { khongGioiHan: false, chan: 'tài khoản chưa có Pro hoặc key terminal nên không dùng được bộ tìm của cổng Claude chính hãng' };
      }
      return { khongGioiHan: false, chan: h.het ? loiHetHanMucChinhHang(h) : null };
    },
    demHomNay: async (userId) => {
      const { prisma } = await import('../../config/database.js');
      return prisma.anthropicUsage.count({
        where: { userId, viec: 'tim_web', thanhCong: true, createdAt: { gte: dauNgayVn() } },
      });
    },
    gui: async ({ body, userId, model, signal }) => {
      const r = await guiChinhHang({ body, signal, nguCanh: { userId, viec: 'tim_web', hang: 'free', model } });
      return { json: await r.res.json(), keyId: r.key.id, batDau: r.batDau, ttfbMs: r.ttfbMs };
    },
    ghi: (d) => ghiDung({
      userId: d.userId, viec: 'tim_web', hang: 'free', model: d.model, keyId: d.keyId,
      dung: d.dung, thanhCong: true, thoiGianMs: d.thoiGianMs, ttfbMs: d.ttfbMs,
    }),
  },
};

let pt: PhuThuocTimWeb = THAT;

/** CHỈ cho bộ kiểm: thay phụ thuộc. `null` = trả về bản thật. */
export function _datPhuThuocTimWeb(p: PhuThuocTimWeb | null): void {
  pt = p ?? THAT;
}

/** Nguồn bị tắt / chưa cấu hình — khác hẳn "đã thử mà hỏng". */
class NguonTat extends Error {}

// ─── Từng nguồn ─────────────────────────────────────────────────────

async function quaTavily(q: string, so: number): Promise<MucTimWeb[]> {
  const khoa = khoaTavily();
  if (!khoa) throw new NguonTat('chưa có TAVILY_API_KEY');
  let res: Response;
  try {
    res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: khoa, query: q, max_results: so, search_depth: 'basic' }),
      signal: AbortSignal.timeout(HET_GIO_TAVILY_MS),
    });
  } catch (err) {
    const la = (err as Error).name === 'TimeoutError';
    throw new Error(la ? `Tavily quá ${HET_GIO_TAVILY_MS / 1000}s không phản hồi` : `không nối được Tavily (${(err as Error).message})`);
  }
  if (!res.ok) {
    /* Phân biệt SAI KHOÁ với HẾT LƯỢT — người dùng xử lý khác nhau. */
    throw new Error(res.status === 401 || res.status === 403
      ? 'khoá Tavily sai hoặc đã bị thu hồi'
      : res.status === 429 ? 'Tavily đã hết lượt của gói hiện tại' : `Tavily trả HTTP ${res.status}`);
  }
  const du = (await res.json()) as { results?: Array<Record<string, unknown>> };
  return (Array.isArray(du.results) ? du.results : []).map((r) => ({
    tieuDe: String(r.title ?? '(không tên)'),
    url: String(r.url ?? ''),
    trich: String(r.content ?? ''),
    ngay: typeof r.published_date === 'string' && r.published_date ? r.published_date.slice(0, 10) : null,
  }));
}

const HUONG_DAN_BO_TIM = [
  'Bạn là BỘ TÌM KIẾM cho một agent lập trình. Việc duy nhất: tìm web cho truy vấn của người dùng.',
  '1. Gọi web_search 1–2 lần với truy vấn tốt nhất (chủ đề kỹ thuật thì truy vấn tiếng Anh thường cho kết quả tốt hơn).',
  '2. Sau đó viết danh sách NGẮN các nguồn hữu ích nhất, mỗi nguồn một câu nói nó trả lời được gì cho truy vấn, CÓ TRÍCH DẪN.',
  'Không bịa, không thêm kiến thức ngoài kết quả tìm được. Không chào hỏi, không kết luận dài.',
].join('\n');

/** Thân yêu cầu `/v1/messages` cho bộ tìm. Thuần — để test. */
export function thanTimAnthropic(q: string, so: number, model = modelTimWeb()): Record<string, unknown> {
  return {
    model,
    max_tokens: 4000,
    stream: false,
    system: HUONG_DAN_BO_TIM,
    messages: [{ role: 'user', content: `Truy vấn: ${q}\nCần khoảng ${so} nguồn tốt nhất.` }],
    tools: [{ type: kieuWebSearch(model), name: 'web_search', max_uses: 2 }],
    /* Việc tra cứu đơn giản ⇒ effort thấp (Haiku 5.5 mặc định `medium`). */
    output_config: { effort: 'low' },
  };
}

/**
 * Chuẩn hoá phản hồi `/v1/messages` có server tool `web_search`. Thuần — để test.
 *  • `web_search_tool_result.content` là MẢNG `web_search_result` khi thành
 *    công, là MỘT object `{error_code}` khi lỗi (lỗi server tool KHÔNG ném — HTTP 200).
 *  • Đoạn trích lấy từ `citations[].cited_text` của các khối `text`
 *    (`encrypted_content` của kết quả không đọc được).
 */
export function docKetQuaAnthropic(json: unknown): {
  ds: MucTimWeb[]; ghiChu: string; loi: string | null; soLanTim: number; dung: DungToken;
} {
  const j = (json && typeof json === 'object' ? json : {}) as Record<string, any>;
  const khoi: Array<Record<string, any>> = Array.isArray(j.content) ? j.content : [];
  const theoUrl = new Map<string, MucTimWeb>();
  const trich = new Map<string, string[]>();
  let ghiChu = '';
  let loi: string | null = null;
  for (const k of khoi) {
    if (k?.type === 'web_search_tool_result') {
      if (Array.isArray(k.content)) {
        for (const r of k.content) {
          if (r?.type !== 'web_search_result' || typeof r.url !== 'string' || theoUrl.has(r.url)) continue;
          theoUrl.set(r.url, {
            tieuDe: String(r.title ?? '(không tên)'), url: r.url, trich: '',
            ngay: typeof r.page_age === 'string' && r.page_age ? r.page_age : null,
          });
        }
      } else if (k.content && typeof k.content === 'object') {
        loi = String(k.content.error_code ?? 'loi_khong_ro');
      }
    } else if (k?.type === 'text' && typeof k.text === 'string') {
      ghiChu += k.text;
      for (const c of Array.isArray(k.citations) ? k.citations : []) {
        if (c?.type !== 'web_search_result_location' || typeof c.url !== 'string' || typeof c.cited_text !== 'string') continue;
        if (!theoUrl.has(c.url)) theoUrl.set(c.url, { tieuDe: String(c.title ?? '(không tên)'), url: c.url, trich: '', ngay: null });
        const ds = trich.get(c.url) ?? [];
        if (!ds.includes(c.cited_text)) ds.push(c.cited_text);
        trich.set(c.url, ds);
      }
    }
  }
  const ds = [...theoUrl.values()].map((m) => ({ ...m, trich: (trich.get(m.url) ?? []).join(' … ') }));
  /* Nguồn ĐƯỢC TRÍCH lên trước — đó là những nguồn bộ tìm thấy liên quan (sắp xếp ổn định). */
  ds.sort((a, b) => Number(Boolean(b.trich)) - Number(Boolean(a.trich)));
  const u = (j.usage ?? {}) as Record<string, any>;
  const soLanTim = Number(u.server_tool_use?.web_search_requests ?? 0) || 0;
  return {
    ds, ghiChu: ghiChu.trim(), loi, soLanTim,
    dung: {
      input: Number(u.input_tokens ?? 0) || 0,
      output: Number(u.output_tokens ?? 0) || 0,
      cacheDoc: Number(u.cache_read_input_tokens ?? 0) || 0,
      cacheGhi: Number(u.cache_creation_input_tokens ?? 0) || 0,
      timWeb: soLanTim,
    },
  };
}

async function quaAnthropic(q: string, so: number, userId: number | null): Promise<{ ds: MucTimWeb[]; ghiChu: string; usd: number }> {
  if (userId === null) throw new NguonTat('không có người dùng để tính hạn mức');
  if (!(await pt.anthropic.coKey())) throw new NguonTat('cổng Claude chính hãng chưa có key dùng được');
  const q2 = await pt.anthropic.quyen(userId);
  if (q2.chan) throw new Error(q2.chan);
  if (!q2.khongGioiHan) {
    const da = await pt.anthropic.demHomNay(userId);
    const tran = tranLuotNgay();
    if (da >= tran) throw new Error(`đã tìm web ${da}/${tran} lần hôm nay qua cổng Claude chính hãng — hạn làm mới lúc 0 giờ (giờ Việt Nam)`);
  }
  const model = modelTimWeb();
  let kq: Awaited<ReturnType<PhuThuocTimWeb['anthropic']['gui']>>;
  try {
    kq = await pt.anthropic.gui({ body: thanTimAnthropic(q, so, model), userId, model, signal: AbortSignal.timeout(HET_GIO_ANTHROPIC_MS) });
  } catch (err) {
    if ((err as Error).name === 'TimeoutError') throw new Error(`bộ tìm Claude quá ${HET_GIO_ANTHROPIC_MS / 1000}s không phản hồi`);
    if (err instanceof CongAnthropicLoi) throw new Error(err.message);
    throw new Error(`bộ tìm Claude lỗi: ${(err as Error).message.slice(0, 200)}`);
  }
  const doc = docKetQuaAnthropic(kq.json);
  const usd = await pt.anthropic.ghi({
    userId, model, keyId: kq.keyId, dung: doc.dung, thoiGianMs: Date.now() - kq.batDau, ttfbMs: kq.ttfbMs,
  }).catch(() => 0);
  if (doc.loi && !doc.ds.length) {
    throw new Error(doc.loi === 'max_uses_exceeded' ? 'bộ tìm Claude vượt số lần tìm' : `bộ tìm Claude báo lỗi "${doc.loi}"`);
  }
  return { ds: doc.ds, ghiChu: doc.ghiChu, usd };
}

// ─── Trình bày ──────────────────────────────────────────────────────

const TEN_NGUON: Record<NguonTim, string> = {
  searxng: 'SearXNG', tavily: 'Tavily', anthropic: 'Claude web search (cổng chính hãng)',
};

/** Chữ thuần cho model — không JSON (mỗi dấu ngoặc thừa là token phải trả tiền). */
export function veKetQua(q: string, ds: MucTimWeb[], nguon: NguonTim, ghiChu = ''): string {
  const dong = ds.slice(0, MAX_KETQUA).map((r, i) => {
    const trich = r.trich.replace(/\s+/g, ' ').trim().slice(0, MAX_CHU_MOI_MUC);
    return `${i + 1}. ${r.tieuDe}\n   ${r.url}${r.ngay ? `\n   Ngày: ${r.ngay}` : ''}${trich ? `\n   ${trich}` : ''}`;
  });
  const gc = ghiChu ? `\n\nGhi chú của bộ tìm (tóm tắt máy, KIỂM bằng nguồn trước khi dùng):\n${ghiChu.slice(0, MAX_GHI_CHU)}` : '';
  return `Kết quả tìm cho "${q}" (nguồn: ${TEN_NGUON[nguon]}):\n\n${dong.join('\n\n')}${gc}\n\n`
    + 'Đây chỉ là TÓM TẮT. Trước khi khẳng định điều gì, MỞ trang liên quan để đọc kỹ (`web_mo` + `web_doc` '
    + 'nếu có trình duyệt, không thì `doc_web`). Khi trả lời người dùng, LUÔN ghi nguồn (URL) cho thông tin lấy từ web.';
}

// ─── Điểm vào ───────────────────────────────────────────────────────

export async function timWeb(args: Record<string, unknown>, userId: number | null = null): Promise<KetQuaTimWeb> {
  const cauHoi = typeof args.q === 'string' ? args.q.trim().slice(0, 400) : '';
  if (!cauHoi) return { content: 'LỖI: thiếu "q".', summary: 'thiếu câu hỏi' };
  const soMuc = Math.min(MAX_KETQUA, Math.max(1, typeof args.so === 'number' ? Math.floor(args.so) : 5));

  const ghi: string[] = [];
  let coNguonChay = false;
  for (const nguon of thuTuNguon()) {
    try {
      let ds: MucTimWeb[];
      let ghiChu = '';
      let usd = 0;
      if (nguon === 'searxng') ds = await pt.searxng(cauHoi, soMuc);
      else if (nguon === 'tavily') ds = await quaTavily(cauHoi, soMuc);
      else ({ ds, ghiChu, usd } = await quaAnthropic(cauHoi, soMuc, userId));
      coNguonChay = true;
      ds = ds.filter((m) => /^https?:\/\//i.test(m.url));
      if (!ds.length) { ghi.push(`${TEN_NGUON[nguon]}: 0 kết quả`); continue; }
      return {
        content: veKetQua(cauHoi, ds, nguon, ghiChu),
        summary: `${Math.min(ds.length, MAX_KETQUA)} kết quả · ${TEN_NGUON[nguon]}${usd > 0 ? ` · ~${usd.toFixed(3)} $` : ''}`,
      };
    } catch (err) {
      if (err instanceof NguonTat) continue;
      coNguonChay = true;
      ghi.push(`${TEN_NGUON[nguon]}: ${(err as Error).message}`);
      logger.warn(`tim_web: ${nguon} hỏng — ${(err as Error).message}`);
    }
  }
  if (!coNguonChay) return { content: CHUA_CAU_HINH, summary: 'chưa cấu hình' };
  const chiRong = ghi.every((g) => g.endsWith(': 0 kết quả'));
  if (chiRong) return { content: `Không có kết quả nào cho "${cauHoi}" (${ghi.join('; ')}). Thử diễn đạt khác hoặc ngắn hơn.`, summary: '0 kết quả' };
  return {
    content: `LỖI: không tìm được trên web — ${ghi.join('; ')}. Đây KHÔNG phải "không có kết quả": nói rõ lý do này với người dùng.`,
    summary: 'không tìm được',
  };
}
