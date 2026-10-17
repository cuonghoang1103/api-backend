/**
 * ĐỐI CHIẾU số tự đo với số THẬT của Anthropic — tuỳ chọn.
 *
 * Key thường (`sk-ant-…`) KHÔNG đọc được số dư/credit. Chỉ Admin API key
 * (`sk-ant-admin01-…`) của TỔ CHỨC sở hữu key mới đọc được:
 *   GET /v1/organizations/api_keys                 — để khớp key ↔ `partial_key_hint`
 *   GET /v1/organizations/usage_report/messages    — token theo api_key_id (+ model), theo ngày
 *   GET /v1/organizations/cost_report              — USD thật của cả tổ chức (chuỗi thập phân, đơn vị CENT)
 *
 * Env `ANTHROPIC_ADMIN_KEY` — một hoặc nhiều khoá, phân tách bằng dấu phẩy
 * (hai key của chủ app có thể thuộc hai tổ chức khác nhau). Không đặt ⇒ trang
 * admin ẩn mục đối chiếu.
 *
 * ⚠️ Hình dạng phản hồi lấy theo tài liệu Admin API; đọc phòng thủ (thiếu
 * trường ⇒ 0) vì CHƯA đo thật bằng khoá admin nào (17/10/2026).
 */
import { logger } from '../../../utils/logger.js';
import { PHIEN_BAN_API, gocChinhHang } from './cauHinh.js';
import { tinhUsd } from './gia.js';

export function dsAdminKey(): string[] {
  return (process.env.ANTHROPIC_ADMIN_KEY ?? '').split(',').map((x) => x.trim()).filter(Boolean);
}

async function goiAdmin(khoa: string, duong: string, q: URLSearchParams): Promise<any> {
  const r = await fetch(`${gocChinhHang()}${duong}?${q.toString()}`, {
    headers: { 'x-api-key': khoa, 'anthropic-version': PHIEN_BAN_API },
    signal: AbortSignal.timeout(20_000),
  });
  const than = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status} ${than.slice(0, 200)}`);
  return JSON.parse(than);
}

/** Lật hết các trang (`has_more` + `next_page`), tối đa 10 trang. */
async function latTrang(khoa: string, duong: string, q: URLSearchParams): Promise<any[]> {
  const ra: any[] = [];
  for (let i = 0; i < 10; i++) {
    const j = await goiAdmin(khoa, duong, q);
    if (Array.isArray(j?.data)) ra.push(...j.data);
    if (!j?.has_more) break;
    if (j.next_page) q.set('page', String(j.next_page));
    else if (j.last_id) q.set('after_id', String(j.last_id));
    else break;
  }
  return ra;
}

export interface DoiChieuToChuc {
  /** 4 ký tự cuối của admin key — để biết tổ chức nào. */
  adminKeyDuoi: string;
  loi?: string;
  /** USD thật của cả tổ chức trong khoảng (cost_report). */
  usdThatToChuc: number | null;
  keys: Array<{
    apiKeyId: string;
    ten: string | null;
    goiY: string | null;
    /** Khớp với key nào trong kho (theo 4 ký tự cuối). */
    duoiKhop: string | null;
    token: { vao: number; ra: number; cacheDoc: number; cacheGhi: number };
    /** USD tính lại từ token Anthropic báo, theo bảng giá trong mã. */
    usdTuToken: number;
  }>;
}

export async function doiChieu(tu: Date, den: Date, duoiTrongKho: string[]): Promise<DoiChieuToChuc[]> {
  const ra: DoiChieuToChuc[] = [];
  for (const khoa of dsAdminKey()) {
    const muc: DoiChieuToChuc = { adminKeyDuoi: khoa.slice(-4), usdThatToChuc: null, keys: [] };
    try {
      const dsKey = await latTrang(khoa, '/v1/organizations/api_keys', new URLSearchParams({ limit: '100' }));
      const qUsage = new URLSearchParams({
        starting_at: tu.toISOString(), ending_at: den.toISOString(), bucket_width: '1d', limit: '31',
      });
      qUsage.append('group_by[]', 'api_key_id');
      qUsage.append('group_by[]', 'model');
      const usage = await latTrang(khoa, '/v1/organizations/usage_report/messages', qUsage);

      const theoKey = new Map<string, DoiChieuToChuc['keys'][number]>();
      for (const bucket of usage) {
        for (const r of (bucket?.results ?? []) as any[]) {
          const id = String(r.api_key_id ?? 'khong-ro');
          const info = dsKey.find((k: any) => k.id === id);
          const goiY: string | null = info?.partial_key_hint ?? null;
          const cu = theoKey.get(id) ?? {
            apiKeyId: id, ten: info?.name ?? null, goiY,
            duoiKhop: goiY ? duoiTrongKho.find((d) => goiY.endsWith(d)) ?? null : null,
            token: { vao: 0, ra: 0, cacheDoc: 0, cacheGhi: 0 }, usdTuToken: 0,
          };
          const t = {
            input: Number(r.uncached_input_tokens ?? 0),
            output: Number(r.output_tokens ?? 0),
            cacheDoc: Number(r.cache_read_input_tokens ?? 0),
            cacheGhi: Number(r.cache_creation?.ephemeral_5m_input_tokens ?? 0) + Number(r.cache_creation?.ephemeral_1h_input_tokens ?? 0),
          };
          cu.token.vao += t.input; cu.token.ra += t.output; cu.token.cacheDoc += t.cacheDoc; cu.token.cacheGhi += t.cacheGhi;
          cu.usdTuToken += tinhUsd(String(r.model ?? ''), t);
          theoKey.set(id, cu);
        }
      }
      muc.keys = [...theoKey.values()];

      const qCost = new URLSearchParams({ starting_at: tu.toISOString(), ending_at: den.toISOString(), limit: '31' });
      const cost = await latTrang(khoa, '/v1/organizations/cost_report', qCost);
      let cent = 0;
      for (const bucket of cost) for (const r of (bucket?.results ?? []) as any[]) cent += Number(r.amount ?? 0) || 0;
      muc.usdThatToChuc = Math.round(cent) / 100;
    } catch (err) {
      muc.loi = (err as Error).message.slice(0, 300);
      logger.warn('[anthropic] đối chiếu Admin API hỏng', { adminKeyDuoi: muc.adminKeyDuoi, loi: muc.loi });
    }
    ra.push(muc);
  }
  return ra;
}
