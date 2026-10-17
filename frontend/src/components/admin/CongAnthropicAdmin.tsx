'use client';

/**
 * Tab "Claude chính hãng" ở /admin/commerce?tab=anthropic (17/10/2026).
 * Backend: /api/v1/admin/cong-anthropic — xem docs/cong-anthropic-chinh-hang.md.
 *
 * ⚠️ Mọi số USD ở đây là SỐ TỰ ĐO (usage Anthropic trả × bảng giá trong mã),
 * không phải số dư thật. Key thường không đọc được số dư; chỉ Admin API key
 * (`ANTHROPIC_ADMIN_KEY`) mới đối chiếu được — mục cuối tab.
 * Khoá thô KHÔNG BAO GIỜ về tới trình duyệt: chỉ có 4 ký tự cuối.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  ArrowDown, ArrowUp, Info, Loader2, Plug, Plus, RefreshCw, Search, Trash2,
} from 'lucide-react';

const API = '/api/v1/admin/cong-anthropic';

type TrangThai = 'hoatDong' | 'hetCredit' | 'loi' | 'tat';
interface KeyRow {
  id: number; nhan: string; duoiKhoa: string; thuTu: number; trangThai: TrangThai;
  nganSachThangUsd: number; ngayLamMoi: number; hetHanLuc: string | null;
  loiCuoi: string | null; loiCuoiLuc: string | null; hetCreditLuc: string | null;
  chuKy: { tu: string; lamMoiLuc: string };
  daDungUsd: number; conLaiUocUsd: number | null; soLuot: number; soLoi: number;
  tbThoiGianMs: number | null; tbTtfbMs: number | null; boQua: 'hetHan' | 'chamNganSach' | null;
  tiLeTrungDem: number | null;
}
interface Cap { thang: number | null; ngay: number | null }
type TranGoi = Record<'pro' | 'key_terminal', { free: Cap; cao: Cap }>;
interface TongQuan {
  keys: KeyRow[]; daBatMatKhau: boolean; tranGoi: TranGoi; modelFree: string; coAdminKey: boolean; ghiChu: string;
  serverTool: { webSearch: boolean; codeExecution: boolean };
  thamSo: { effortMacDinh: string; maxTokensAgent: number; compactTokens: number; donTool: { trigger: number; keep: number; clearAtLeast: number }; tranKyTuHoiThoai: number };
  models: Array<{ id: string; model: string; ten: string; hang: 'free' | 'cao'; gia: { in: number; out: number; cacheDoc: number; cacheGhi: number } }>;
}
interface HanMuc { daDungThang: number; daDungNgay: number; tranThang: number | null; tranNgay: number | null; het: boolean; khongGioiHan: boolean; nguon: string }
interface NguoiTim {
  id: number; email: string; ten: string; goi: string; free: HanMuc; cao: HanMuc;
  rieng: { tranThangUsd: number | null; tranNgayUsd: number | null; freeThangUsd: number | null; freeNgayUsd: number | null; ghiChu: string | null } | null;
}
interface Dung {
  thangNay: { usd: number; luot: number; tiLeTrungDem: number | null };
  theoNguoi: Array<{ userId: number | null; email: string | null; ten: string | null; usd: number; usdFree: number; usdCao: number; luot: number }>;
  theoModel: Array<{ model: string; hang: string; usd: number; luot: number; tbThoiGianMs: number | null; tbTtfbMs: number | null; token: { vao: number; ra: number; cacheDoc: number; cacheGhi: number } }>;
  theoNgay: Array<{ ngay: string; hang: string; usd: number; luot: number }>;
}

const usd = (n: number | null | undefined, d = 2) => (n == null ? '∞' : `$${n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: n > 0 && n < 0.01 ? 4 : 0 })}`);
const ngayVN = (s: string | null) => (s ? new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const TEN_TT: Record<TrangThai, { ten: string; cls: string }> = {
  hoatDong: { ten: 'Hoạt động', cls: 'border-green-500/50 text-green-400' },
  hetCredit: { ten: 'Hết credit', cls: 'border-amber-500/50 text-amber-400' },
  loi: { ten: 'Lỗi', cls: 'border-red-500/50 text-red-400' },
  tat: { ten: 'Đã tắt', cls: 'border-darkborder text-text-muted' },
};
const o = 'px-2 py-1 rounded-lg bg-darkbg border border-darkborder text-text-primary text-sm';
const nut = 'px-3 py-1.5 rounded-lg text-xs border disabled:opacity-50';

async function goi<T>(duong: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${duong}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as T;
}

const soHoacNull = (s: string): number | null => (s.trim() === '' ? null : Number(s));

export default function CongAnthropicAdmin() {
  const [tq, setTq] = useState<TongQuan | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const nap = useCallback(async () => {
    setDangTai(true);
    try { setTq(await goi<TongQuan>('')); } catch (e) { toast.error((e as Error).message); }
    finally { setDangTai(false); }
  }, []);
  useEffect(() => { nap(); }, [nap]);

  if (dangTai && !tq) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-text-muted" /></div>;
  if (!tq) return <p className="text-text-muted text-sm">Không tải được.</p>;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 text-sm flex gap-3">
        <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="text-text-muted space-y-1">
          <p>
            <b className="text-text-primary">Cổng Claude chính hãng</b> gọi thẳng api.anthropic.com bằng key của bạn. Rambo hỏng ⇒ AI Code /
            CuongMini tự chuyển sang <b className="text-text-primary">CuongMini Free</b> (<code>{tq.modelFree}</code>, không cần mật khẩu, tính
            trần &ldquo;Free&rdquo;). Model cao (Sonnet 5.5 / Opus 5.5 / Fable 5.1) cần mật khẩu cổng ⇒ vé 30 ngày. Admin không bị giới hạn.
          </p>
          <p className="text-amber-300/90">⚠ {tq.ghiChu}</p>
        </div>
      </div>

      <KhoKey keys={tq.keys} onDoi={(keys) => setTq({ ...tq, keys })} onNap={nap} />
      <MatKhau daBat={tq.daBatMatKhau} onXong={nap} />
      <ThamSo tq={tq} onDoi={(serverTool) => setTq({ ...tq, serverTool })} />
      <TranGoiForm tranGoi={tq.tranGoi} onXong={(t) => setTq({ ...tq, tranGoi: t })} />
      <TranNguoi />
      <DoDung />
      {tq.coAdminKey && <DoiChieu />}
      <BangGia models={tq.models} />
    </div>
  );
}

function The({ tieuDe, phai, children }: { tieuDe: string; phai?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="p-4 rounded-xl border border-darkborder bg-darkcard text-sm space-y-3">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <b className="text-text-primary">{tieuDe}</b>
        {phai}
      </div>
      {children}
    </section>
  );
}

// ─── Kho key ───────────────────────────────────────────────────────────

function KhoKey({ keys, onDoi, onNap }: { keys: KeyRow[]; onDoi: (k: KeyRow[]) => void; onNap: () => void }) {
  const [moi, setMoi] = useState({ nhan: '', khoa: '', nganSach: '', ngay: '1', hetHan: '' });
  const [dangLam, setDangLam] = useState<string | null>(null);

  const lam = async (viec: string, fn: () => Promise<{ keys: KeyRow[] } & Record<string, unknown>>) => {
    setDangLam(viec);
    try {
      const d = await fn();
      onDoi(d.keys);
      return d;
    } catch (e) { toast.error((e as Error).message); return null; }
    finally { setDangLam(null); }
  };

  const them = async () => {
    const d = await lam('them', () => goi('/keys', {
      method: 'POST',
      body: JSON.stringify({
        nhan: moi.nhan, khoa: moi.khoa,
        nganSachThangUsd: Number(moi.nganSach || 0), ngayLamMoi: Number(moi.ngay || 1),
        ...(moi.hetHan ? { hetHanLuc: moi.hetHan } : {}),
      }),
    }));
    if (d) { toast.success('Đã thêm key (đã mã hoá trên máy chủ).'); setMoi({ nhan: '', khoa: '', nganSach: '', ngay: '1', hetHan: '' }); }
  };

  const sua = (k: KeyRow, patch: Record<string, unknown>) => lam(`sua${k.id}`, () => goi(`/keys/${k.id}`, { method: 'PATCH', body: JSON.stringify(patch) }));

  const doiCho = (i: number, j: number) => {
    const ids = keys.map((k) => k.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    lam('thuTu', () => goi('/keys/thu-tu', { method: 'PUT', body: JSON.stringify({ ids }) }));
  };

  const thu = async (k: KeyRow) => {
    const d = await lam(`thu${k.id}`, () => goi(`/keys/${k.id}/thu`, { method: 'POST' }));
    if (!d) return;
    const r = d as unknown as { ok: boolean; ms: number; loi: string | null; soModel: number; thieuModel: string[] };
    if (r.ok) toast.success(`Kết nối được (${r.ms} ms, ${r.soModel} model)${r.thieuModel.length ? ` — THIẾU: ${r.thieuModel.join(', ')}` : ''}`);
    else toast.error(`Không kết nối được: ${r.loi}`);
  };

  const suaSo = (k: KeyRow, truong: 'nganSachThangUsd' | 'ngayLamMoi', ten: string) => {
    const v = window.prompt(ten, String(k[truong]));
    if (v === null) return;
    sua(k, { [truong]: Number(v) });
  };

  return (
    <The tieuDe="🔑 Kho key Anthropic" phai={<button onClick={onNap} className={`${nut} border-darkborder text-text-muted`}><RefreshCw className="w-3 h-3 inline" /> Tải lại</button>}>
      <p className="text-text-muted text-xs">
        Dùng key <b>đang hoạt động có thứ tự cao nhất</b>. Hết credit ⇒ tự sang key kế và tự mở lại khi qua ngày làm mới.
        401/403 ⇒ đánh dấu Lỗi (bấm &ldquo;Thử&rdquo; thành công để mở lại). 429/529/5xx ⇒ thử key kế, không đánh dấu.
        Chạm ngân sách tháng (số tự đo) ⇒ bỏ qua key đó tới chu kỳ sau.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[860px]">
          <thead className="text-text-muted text-left">
            <tr>
              <th className="py-1">#</th><th>Key</th><th>Trạng thái</th><th>Chu kỳ này (tự đo)</th><th>Còn lại ước</th>
              <th>Lượt / lỗi</th><th>Trúng đệm</th><th>TB / chữ đầu</th><th>Làm mới</th><th>Hết hạn</th><th />
            </tr>
          </thead>
          <tbody>
            {keys.map((k, i) => {
              const pt = k.nganSachThangUsd > 0 ? Math.min(100, (k.daDungUsd / k.nganSachThangUsd) * 100) : 0;
              return (
                <tr key={k.id} className="border-t border-darkborder align-top">
                  <td className="py-2 pr-1 whitespace-nowrap">
                    <button disabled={i === 0 || !!dangLam} onClick={() => doiCho(i, i - 1)} className="disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                    <button disabled={i === keys.length - 1 || !!dangLam} onClick={() => doiCho(i, i + 1)} className="disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                  </td>
                  <td className="py-2">
                    <div className="text-text-primary font-medium">{k.nhan}</div>
                    <div className="text-text-muted font-mono">…{k.duoiKhoa}</div>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full border ${TEN_TT[k.trangThai].cls}`}>{TEN_TT[k.trangThai].ten}</span>
                    {k.boQua && <div className="text-amber-400 mt-1">{k.boQua === 'hetHan' ? 'Quá hạn — bỏ qua' : 'Chạm ngân sách — bỏ qua'}</div>}
                    {k.loiCuoi && <div className="text-text-muted mt-1 max-w-[220px] break-words" title={k.loiCuoi}>{ngayVN(k.loiCuoiLuc)}: {k.loiCuoi.slice(0, 90)}</div>}
                  </td>
                  <td className="py-2 min-w-[140px]">
                    <div className="text-text-primary">{usd(k.daDungUsd, 4)} / <button className="underline decoration-dotted" onClick={() => suaSo(k, 'nganSachThangUsd', 'Ngân sách USD mỗi tháng (0 = không đặt)')}>{k.nganSachThangUsd ? usd(k.nganSachThangUsd) : 'chưa đặt'}</button></div>
                    {k.nganSachThangUsd > 0 && <div className="h-1.5 mt-1 rounded bg-darkbg overflow-hidden"><div className={`h-full ${pt >= 90 ? 'bg-red-500' : pt >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pt}%` }} /></div>}
                    <div className="text-text-muted mt-1">từ {ngayVN(k.chuKy.tu)}</div>
                  </td>
                  <td className="py-2">{k.conLaiUocUsd == null ? '—' : usd(k.conLaiUocUsd)}</td>
                  <td className="py-2">{k.soLuot} / <span className={k.soLoi ? 'text-red-400' : ''}>{k.soLoi}</span></td>
                  <td className="py-2">{k.tiLeTrungDem == null ? '—' : `${Math.round(k.tiLeTrungDem * 100)}%`}</td>
                  <td className="py-2">{k.tbThoiGianMs != null ? `${(k.tbThoiGianMs / 1000).toFixed(1)}s` : '—'} / {k.tbTtfbMs != null ? `${(k.tbTtfbMs / 1000).toFixed(1)}s` : '—'}</td>
                  <td className="py-2">
                    <button className="underline decoration-dotted" onClick={() => suaSo(k, 'ngayLamMoi', 'Ngày làm mới trong tháng (1–28)')}>ngày {k.ngayLamMoi}</button>
                    <div className="text-text-muted">kế: {ngayVN(k.chuKy.lamMoiLuc)}</div>
                  </td>
                  <td className="py-2">
                    <input type="date" className={`${o} text-xs`} value={k.hetHanLuc ? k.hetHanLuc.slice(0, 10) : ''}
                      onChange={(e) => sua(k, { hetHanLuc: e.target.value || null })} />
                  </td>
                  <td className="py-2 whitespace-nowrap space-x-1">
                    <button disabled={!!dangLam} onClick={() => thu(k)} className={`${nut} border-sky-500/50 text-sky-400`} title="GET /v1/models — không tốn tiền">
                      {dangLam === `thu${k.id}` ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <Plug className="w-3 h-3 inline" />} Thử
                    </button>
                    <button disabled={!!dangLam} onClick={() => sua(k, { trangThai: k.trangThai === 'tat' ? 'hoatDong' : 'tat' })}
                      className={`${nut} border-darkborder text-text-muted`}>{k.trangThai === 'tat' ? 'Bật' : 'Tắt'}</button>
                    {(k.trangThai === 'hetCredit' || k.trangThai === 'loi') && (
                      <button disabled={!!dangLam} onClick={() => sua(k, { trangThai: 'hoatDong' })} className={`${nut} border-green-500/50 text-green-400`}>Mở lại</button>
                    )}
                    <button disabled={!!dangLam} onClick={() => { if (window.confirm(`Xoá key "${k.nhan}"? Sổ dùng cũ vẫn giữ.`)) lam('xoa', () => goi(`/keys/${k.id}`, { method: 'DELETE' })); }}
                      className={`${nut} border-red-500/40 text-red-400`}><Trash2 className="w-3 h-3 inline" /></button>
                  </td>
                </tr>
              );
            })}
            {!keys.length && <tr><td colSpan={11} className="py-4 text-center text-text-muted">Chưa có key. Thêm bên dưới, hoặc đặt ANTHROPIC_CHINH_HANG_KEYS trên máy chủ (chỉ nạp khi bảng rỗng).</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2 items-end pt-2 border-t border-darkborder">
        <label className="flex flex-col gap-1 text-xs text-text-muted">Nhãn<input className={o} value={moi.nhan} onChange={(e) => setMoi({ ...moi, nhan: e.target.value })} placeholder="Key 2 (100$)" /></label>
        <label className="flex flex-col gap-1 text-xs text-text-muted flex-1 min-w-[220px]">Key (dán vào — máy chủ mã hoá)
          <input type="password" autoComplete="off" className={o} value={moi.khoa} onChange={(e) => setMoi({ ...moi, khoa: e.target.value })} placeholder="sk-ant-…" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-text-muted w-28">Ngân sách $/tháng<input className={o} inputMode="decimal" value={moi.nganSach} onChange={(e) => setMoi({ ...moi, nganSach: e.target.value })} placeholder="100" /></label>
        <label className="flex flex-col gap-1 text-xs text-text-muted w-24">Ngày làm mới<input className={o} inputMode="numeric" value={moi.ngay} onChange={(e) => setMoi({ ...moi, ngay: e.target.value })} /></label>
        <label className="flex flex-col gap-1 text-xs text-text-muted">Hết hạn (tuỳ chọn)<input type="date" className={o} value={moi.hetHan} onChange={(e) => setMoi({ ...moi, hetHan: e.target.value })} /></label>
        <button disabled={!moi.khoa || !!dangLam} onClick={them} className={`${nut} border-neon-violet text-neon-violet`}><Plus className="w-3 h-3 inline" /> Thêm key</button>
      </div>
    </The>
  );
}

// ─── Mật khẩu ──────────────────────────────────────────────────────────

function MatKhau({ daBat, onXong }: { daBat: boolean; onXong: () => void }) {
  const [mk, setMk] = useState('');
  const [dang, setDang] = useState(false);
  const luu = async (matKhau: string | null) => {
    if (matKhau !== null && matKhau.length < 6) { toast.error('Mật khẩu tối thiểu 6 ký tự.'); return; }
    if (matKhau === null && !window.confirm('Tắt mật khẩu? Người thường không mở được model cao nữa (CuongMini Free vẫn chạy).')) return;
    setDang(true);
    try {
      await goi('/mat-khau', { method: 'PUT', body: JSON.stringify({ matKhau }) });
      toast.success(matKhau === null ? 'Đã tắt.' : 'Đã đặt mật khẩu — vé cũ (nếu có) hết hiệu lực.');
      setMk(''); onXong();
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  return (
    <The tieuDe="🔒 Mật khẩu model cao" phai={<span className={`px-2 py-0.5 rounded-full text-xs border ${daBat ? 'border-green-500/50 text-green-400' : 'border-darkborder text-text-muted'}`}>{daBat ? 'Đang bật' : 'Chưa đặt'}</span>}>
      <p className="text-text-muted text-xs">Người dùng nhập mật khẩu này (riêng, khác cổng dự phòng modelapi) để nhận vé 30 ngày mở Sonnet 5.5 / Opus 5.5 / Fable 5.1. Đổi mật khẩu = thu hồi mọi vé.</p>
      <div className="flex flex-wrap gap-2">
        <input type="password" autoComplete="new-password" className={`${o} flex-1 min-w-[200px]`} value={mk} onChange={(e) => setMk(e.target.value)}
          placeholder={daBat ? 'Mật khẩu mới (đổi = thu hồi vé cũ)' : 'Đặt mật khẩu để bật'} />
        <button disabled={dang || !mk} onClick={() => luu(mk)} className={`${nut} border-neon-violet text-neon-violet`}>{daBat ? 'Đổi' : 'Bật'}</button>
        {daBat && <button disabled={dang} onClick={() => luu(null)} className={`${nut} border-darkborder text-text-muted`}>Tắt</button>}
      </div>
    </The>
  );
}

// ─── Tham số gọi + server tool ──────────────────────────────────────────

function ThamSo({ tq, onDoi }: { tq: TongQuan; onDoi: (v: TongQuan['serverTool']) => void }) {
  const [dang, setDang] = useState(false);
  const doi = async (patch: Partial<TongQuan['serverTool']>) => {
    setDang(true);
    try { onDoi(await goi('/server-tools', { method: 'PUT', body: JSON.stringify(patch) })); toast.success('Đã lưu.'); }
    catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  const t = tq.thamSo;
  return (
    <The tieuDe="⚙️ Tham số gọi (chất lượng trước)">
      <ul className="text-xs text-text-muted list-disc pl-5 space-y-0.5">
        <li>thinking <code>adaptive</code>, giữ &amp; gửi lại khối thinking có chữ ký; effort theo đúng mức người dùng chọn (mặc định <b className="text-text-primary">{t.effortMacDinh}</b>).</li>
        <li>max_tokens lượt agent <b className="text-text-primary">{t.maxTokensAgent.toLocaleString('vi-VN')}</b> (kẹp theo giới hạn model thật).</li>
        <li>Compact phía máy chủ khi vào ≥ <b className="text-text-primary">{t.compactTokens ? t.compactTokens.toLocaleString('vi-VN') : 'tắt'}</b> token; dọn kết quả tool chỉ khi ≥ {t.donTool.trigger.toLocaleString('vi-VN')} token, giữ {t.donTool.keep} kết quả gần nhất.</li>
        <li>Model cao chọn tay: trần hội thoại {t.tranKyTuHoiThoai.toLocaleString('vi-VN')} ký tự, không lược kết quả tool cũ. Prompt caching 4 mốc.</li>
      </ul>
      <div className="flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-2"><input type="checkbox" disabled={dang} checked={tq.serverTool.webSearch} onChange={(e) => doi({ webSearch: e.target.checked })} />
          Server tool <b>web_search</b> của Anthropic ($10 / 1.000 lần tìm, tính riêng)</label>
        <label className="flex items-center gap-2"><input type="checkbox" disabled={dang} checked={tq.serverTool.codeExecution} onChange={(e) => doi({ codeExecution: e.target.checked })} />
          Server tool <b>code_execution</b> (tính theo giờ container — chỉ đếm, không ước tiền)</label>
      </div>
      <p className="text-text-muted text-xs">Mặc định TẮT — AI Code đã có tool web chạy ở máy chủ mình. Bật cả hai thì chỉ khai web_search (bản 20260209 đã gồm code execution để lọc).</p>
    </The>
  );
}

// ─── Trần theo gói ─────────────────────────────────────────────────────

const TEN_GOI = { pro: 'Pro', key_terminal: 'Free có key terminal' } as const;

function TranGoiForm({ tranGoi, onXong }: { tranGoi: TranGoi; onXong: (t: TranGoi) => void }) {
  const [nhap, setNhap] = useState(() => JSON.parse(JSON.stringify(tranGoi)) as TranGoi);
  const [dang, setDang] = useState(false);
  const o1 = (g: keyof TranGoi, h: 'free' | 'cao', k: keyof Cap) => (
    <input className={`${o} w-20`} inputMode="decimal" placeholder="∞" value={nhap[g][h][k] ?? ''}
      onChange={(e) => setNhap({ ...nhap, [g]: { ...nhap[g], [h]: { ...nhap[g][h], [k]: soHoacNull(e.target.value) } } })} />
  );
  const luu = async () => {
    setDang(true);
    try { const d = await goi<{ tranGoi: TranGoi }>('/tran/goi', { method: 'PUT', body: JSON.stringify(nhap) }); onXong(d.tranGoi); toast.success('Đã lưu trần theo gói.'); }
    catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  return (
    <The tieuDe="📏 Trần chi tiêu theo gói (USD)">
      <p className="text-text-muted text-xs">Tháng/ngày theo lịch giờ Việt Nam. Ô trống = không giới hạn. Admin luôn không giới hạn. Tài khoản không Pro, không key terminal ⇒ 0.</p>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead className="text-text-muted"><tr><th className="text-left pr-4">Gói</th><th>Free / tháng</th><th>Free / ngày</th><th>Model cao / tháng</th><th>Model cao / ngày</th></tr></thead>
          <tbody>
            {(Object.keys(TEN_GOI) as Array<keyof TranGoi>).map((g) => (
              <tr key={g}><td className="pr-4 py-1 text-text-primary">{TEN_GOI[g]}</td>
                <td className="px-1">{o1(g, 'free', 'thang')}</td><td className="px-1">{o1(g, 'free', 'ngay')}</td>
                <td className="px-1">{o1(g, 'cao', 'thang')}</td><td className="px-1">{o1(g, 'cao', 'ngay')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <button disabled={dang} onClick={luu} className={`${nut} border-neon-violet text-neon-violet`}>Lưu trần gói</button>
    </The>
  );
}

// ─── Trần riêng theo người ─────────────────────────────────────────────

function TranNguoi() {
  const [q, setQ] = useState('');
  const [kq, setKq] = useState<NguoiTim[]>([]);
  const [rieng, setRieng] = useState<Array<{ userId: number; email: string | null; ten: string | null; tranThangUsd: number | null; tranNgayUsd: number | null; freeThangUsd: number | null; freeNgayUsd: number | null; ghiChu: string | null; daDung: { freeThang: number; freeNgay: number; caoThang: number; caoNgay: number } }>>([]);
  const napRieng = useCallback(async () => {
    try { setRieng((await goi<{ rieng: typeof rieng }>('/tran')).rieng); } catch { /* bỏ qua */ }
  }, []);
  useEffect(() => { napRieng(); }, [napRieng]);
  const [daTim, setDaTim] = useState('');
  const tim = useCallback(async (chu = q) => {
    try {
      const ds = await goi<NguoiTim[]>(`/tran/tim?q=${encodeURIComponent(chu)}`);
      setKq(ds);
      setDaTim(chu);
    } catch (e) { toast.error((e as Error).message); }
  }, [q]);
  // Gõ tới đâu gợi ý tới đó (máy chủ cần ≥ 2 ký tự) — trước đây phải bấm Tìm/Enter mới chạy.
  useEffect(() => {
    const chu = q.trim();
    if (chu.length < 2) { setKq([]); setDaTim(''); return; }
    const h = setTimeout(() => { void tim(chu); }, 300);
    return () => clearTimeout(h);
  }, [q, tim]);
  return (
    <The tieuDe="👤 Trần riêng theo người (ghi đè gói)">
      <div className="flex gap-2">
        <input className={`${o} flex-1`} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void tim(); }} placeholder="Tìm email / username / tên / id" />
        <button onClick={() => void tim()} className={`${nut} border-darkborder text-text-muted`}><Search className="w-3 h-3 inline" /> Tìm</button>
      </div>
      {daTim && daTim === q.trim() && kq.length === 0 && (
        <p className="text-text-muted text-xs">Không thấy ai khớp “{daTim}” — thử email, username hoặc id.</p>
      )}
      {kq.map((n) => <NguoiSua key={n.id} n={n} onXong={() => { void tim(); napRieng(); }} />)}
      {rieng.length > 0 && (
        <div className="overflow-x-auto">
          <p className="text-text-muted text-xs mb-1">Đang có trần riêng ({rieng.length}):</p>
          <table className="w-full text-xs">
            <thead className="text-text-muted text-left"><tr><th>Người</th><th>Free tháng</th><th>Free ngày</th><th>Cao tháng</th><th>Cao ngày</th><th>Ghi chú</th></tr></thead>
            <tbody>
              {rieng.map((r) => (
                <tr key={r.userId} className="border-t border-darkborder">
                  <td className="py-1">{r.ten ?? '?'} <span className="text-text-muted">{r.email}</span></td>
                  <td>{usd(r.daDung.freeThang)} / {r.freeThangUsd == null ? 'gói' : usd(r.freeThangUsd)}</td>
                  <td>{usd(r.daDung.freeNgay)} / {r.freeNgayUsd == null ? 'gói' : usd(r.freeNgayUsd)}</td>
                  <td>{usd(r.daDung.caoThang)} / {r.tranThangUsd == null ? 'gói' : usd(r.tranThangUsd)}</td>
                  <td>{usd(r.daDung.caoNgay)} / {r.tranNgayUsd == null ? 'gói' : usd(r.tranNgayUsd)}</td>
                  <td className="text-text-muted">{r.ghiChu ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </The>
  );
}

function NguoiSua({ n, onXong }: { n: NguoiTim; onXong: () => void }) {
  const r = n.rieng;
  const [v, setV] = useState({
    freeThangUsd: r?.freeThangUsd?.toString() ?? '', freeNgayUsd: r?.freeNgayUsd?.toString() ?? '',
    tranThangUsd: r?.tranThangUsd?.toString() ?? '', tranNgayUsd: r?.tranNgayUsd?.toString() ?? '', ghiChu: r?.ghiChu ?? '',
  });
  const luu = async () => {
    try {
      await goi(`/tran/nguoi/${n.id}`, { method: 'PUT', body: JSON.stringify({
        freeThangUsd: soHoacNull(v.freeThangUsd), freeNgayUsd: soHoacNull(v.freeNgayUsd),
        tranThangUsd: soHoacNull(v.tranThangUsd), tranNgayUsd: soHoacNull(v.tranNgayUsd), ghiChu: v.ghiChu,
      }) });
      toast.success('Đã lưu trần riêng.'); onXong();
    } catch (e) { toast.error((e as Error).message); }
  };
  const xoa = async () => { try { await goi(`/tran/nguoi/${n.id}`, { method: 'DELETE' }); toast.success('Đã về trần gói.'); onXong(); } catch (e) { toast.error((e as Error).message); } };
  const dong = (h: HanMuc) => (h.khongGioiHan ? 'không giới hạn (admin)' : `tháng ${usd(h.daDungThang)}/${usd(h.tranThang)} · ngày ${usd(h.daDungNgay)}/${usd(h.tranNgay)}${h.het ? ' · HẾT' : ''}`);
  const f = (k: keyof typeof v, ph: string) => <input className={`${o} w-20 text-xs`} placeholder={ph} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />;
  return (
    <div className="p-3 rounded-lg border border-darkborder space-y-2">
      <div><b className="text-text-primary">{n.ten}</b> <span className="text-text-muted">{n.email} · #{n.id} · gói {n.goi}</span></div>
      <div className="text-xs text-text-muted">Free: {dong(n.free)} — Model cao: {dong(n.cao)}</div>
      {n.goi !== 'admin' && (
        <div className="flex flex-wrap gap-2 items-center text-xs text-text-muted">
          Free {f('freeThangUsd', 'tháng')}{f('freeNgayUsd', 'ngày')} · Cao {f('tranThangUsd', 'tháng')}{f('tranNgayUsd', 'ngày')}
          <input className={`${o} text-xs flex-1 min-w-[120px]`} placeholder="Ghi chú" value={v.ghiChu} onChange={(e) => setV({ ...v, ghiChu: e.target.value })} />
          <button onClick={luu} className={`${nut} border-neon-violet text-neon-violet`}>Lưu</button>
          {r && <button onClick={xoa} className={`${nut} border-darkborder text-text-muted`}>Về trần gói</button>}
        </div>
      )}
    </div>
  );
}

// ─── Đo dùng ───────────────────────────────────────────────────────────

function DoDung() {
  const [soNgay, setSoNgay] = useState(30);
  const [d, setD] = useState<Dung | null>(null);
  useEffect(() => {
    goi<Dung>(`/dung?soNgay=${soNgay}`).then(setD).catch((e) => toast.error((e as Error).message));
  }, [soNgay]);
  const bieuDo = useMemo(() => {
    const m = new Map<string, { ngay: string; free: number; cao: number }>();
    for (const r of d?.theoNgay ?? []) {
      const cu = m.get(r.ngay) ?? { ngay: r.ngay.slice(5), free: 0, cao: 0 };
      if (r.hang === 'free') cu.free += r.usd; else cu.cao += r.usd;
      m.set(r.ngay, cu);
    }
    return [...m.values()];
  }, [d]);
  return (
    <The tieuDe="📊 Đo dùng (số tự đo)" phai={
      <select className={`${o} text-xs`} value={soNgay} onChange={(e) => setSoNgay(Number(e.target.value))}>
        {[7, 30, 90].map((n) => <option key={n} value={n}>{n} ngày</option>)}
      </select>
    }>
      {!d ? <Loader2 className="w-4 h-4 animate-spin text-text-muted" /> : (
        <>
          <p className="text-text-muted text-xs">
            Tháng này: <b className="text-text-primary">{usd(d.thangNay.usd, 4)}</b> · {d.thangNay.luot} lượt gọi
            {d.thangNay.tiLeTrungDem != null && <> · trúng đệm <b className="text-text-primary">{Math.round(d.thangNay.tiLeTrungDem * 100)}%</b> token vào</>}.
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bieuDo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="ngay" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => usd(v, 4)} />
                <Legend />
                <Bar dataKey="free" name="CuongMini Free" stackId="a" fill="#38bdf8" />
                <Bar dataKey="cao" name="Model cao" stackId="a" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <p className="text-text-muted text-xs mb-1">Theo model</p>
              <table className="w-full text-xs">
                <thead className="text-text-muted text-left"><tr><th>Model</th><th>USD</th><th>Lượt</th><th>Đọc đệm / vào</th><th>TB</th></tr></thead>
                <tbody>{d.theoModel.map((m) => (
                  <tr key={m.model + m.hang} className="border-t border-darkborder">
                    <td className="py-1">{m.model} {m.hang === 'free' && <span className="text-sky-400">(Free)</span>}</td>
                    <td>{usd(m.usd, 4)}</td><td>{m.luot}</td>
                    <td>{m.token.vao + m.token.cacheDoc > 0 ? `${Math.round((m.token.cacheDoc / (m.token.vao + m.token.cacheDoc + m.token.cacheGhi)) * 100)}%` : '—'}</td>
                    <td>{m.tbThoiGianMs != null ? `${(m.tbThoiGianMs / 1000).toFixed(1)}s` : '—'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <p className="text-text-muted text-xs mb-1">Theo người (top 100)</p>
              <table className="w-full text-xs">
                <thead className="text-text-muted text-left"><tr><th>Người</th><th>Free</th><th>Cao</th><th>Lượt</th></tr></thead>
                <tbody>{d.theoNguoi.map((n) => (
                  <tr key={String(n.userId)} className="border-t border-darkborder">
                    <td className="py-1">{n.ten ?? (n.userId == null ? '(thử kết nối)' : `#${n.userId}`)} <span className="text-text-muted">{n.email}</span></td>
                    <td>{usd(n.usdFree, 4)}</td><td>{usd(n.usdCao, 4)}</td><td>{n.luot}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </The>
  );
}

// ─── Đối chiếu Admin API ───────────────────────────────────────────────

function DoiChieu() {
  const [d, setD] = useState<null | {
    tu: string; den: string;
    tuDo: Array<{ id: number; nhan: string; duoiKhoa: string; usd: number }>;
    toChuc: Array<{ adminKeyDuoi: string; loi?: string; usdThatToChuc: number | null; keys: Array<{ apiKeyId: string; ten: string | null; goiY: string | null; duoiKhop: string | null; usdTuToken: number }> }>;
  }>(null);
  const [dang, setDang] = useState(false);
  const nap = async () => {
    setDang(true);
    try { setD(await goi('/doi-chieu')); } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  return (
    <The tieuDe="🧾 Đối chiếu với số thật (Admin API)" phai={<button disabled={dang} onClick={nap} className={`${nut} border-sky-500/50 text-sky-400`}>{dang ? 'Đang hỏi…' : 'Đối chiếu tháng này'}</button>}>
      <p className="text-text-muted text-xs">Gọi Usage &amp; Cost API của Anthropic bằng ANTHROPIC_ADMIN_KEY. Cost report là USD thật của CẢ tổ chức; usage theo từng key được quy ra USD bằng bảng giá trong mã.</p>
      {d && d.toChuc.map((t) => (
        <div key={t.adminKeyDuoi} className="p-3 rounded-lg border border-darkborder text-xs space-y-1">
          <div>Tổ chức (admin key …{t.adminKeyDuoi}): {t.loi ? <span className="text-red-400">{t.loi}</span> : <>USD thật cả tổ chức <b className="text-text-primary">{usd(t.usdThatToChuc, 4)}</b></>}</div>
          {t.keys.map((k) => {
            const tuDo = d.tuDo.find((x) => k.duoiKhop && x.duoiKhoa === k.duoiKhop);
            return (
              <div key={k.apiKeyId} className="text-text-muted">
                {k.ten ?? k.apiKeyId} ({k.goiY ?? '?'}): Anthropic báo ≈ <b className="text-text-primary">{usd(k.usdTuToken, 4)}</b>
                {tuDo ? <> · tự đo ({tuDo.nhan}) {usd(tuDo.usd, 4)}</> : ' · không khớp key nào trong kho'}
              </div>
            );
          })}
        </div>
      ))}
    </The>
  );
}

function BangGia({ models }: { models: TongQuan['models'] }) {
  return (
    <The tieuDe="💲 Bảng giá đang dùng để tự tính (USD / 1 triệu token)">
      <p className="text-text-muted text-xs">Nguồn: bảng giá chính thức của Anthropic. Sửa bằng env ANTHROPIC_CHINH_HANG_GIA (JSON) — không cần sửa mã.</p>
      <table className="text-xs">
        <thead className="text-text-muted text-left"><tr><th className="pr-4">Model</th><th className="pr-3">Vào</th><th className="pr-3">Ra</th><th className="pr-3">Đọc đệm</th><th>Ghi đệm</th></tr></thead>
        <tbody>{models.map((m) => (
          <tr key={m.id}><td className="pr-4 py-0.5">{m.ten} <span className="text-text-muted">({m.model})</span></td>
            <td>{m.gia.in}</td><td>{m.gia.out}</td><td>{m.gia.cacheDoc}</td><td>{m.gia.cacheGhi}</td></tr>
        ))}</tbody>
      </table>
    </The>
  );
}
