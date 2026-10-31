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
import CuongMiniNgonNguAdmin from './CuongMiniNgonNguAdmin';
import AiThongKeAnthropic from './AiThongKeAnthropic';
import TaiTroAdminCongTac from '@/components/cuongmini/TaiTroAdminCongTac';
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
  /* 18/10/2026 — bảng CuongMini + khoá Invisible + trần theo model + công tắc rambo. */
  daBatMatKhauInvisible?: boolean;
  bangModel?: ModelCm[];
  tranModel?: Record<string, Record<'pro' | 'key_terminal', Cap>>;
  rambo?: TrangThaiRambo;
  /* 19/10/2026: nhóm CuongMini Classic + chống spam CuongMini Default. */
  bangClassic?: Array<{ id: string; ten: string; model: string; nangLuc: number; tuongDuong: string }>;
  defaultGioiHan?: GioiHanDefault;
}
interface TrangThaiRambo {
  bat: boolean; nguon: 'env' | 'admin'; coCauHinh: boolean;
  dangNghi?: boolean;
  kiemGanNhat?: { luc: string; song: boolean } | null;
  modelSonic?: string;
  dsModel?: { luc: string; ids: string[] } | null;
  thuGanNhat?: { luc: string; models: Array<{ model: string; ok: boolean; ms: number; loi?: string }> } | null;
}
interface GioiHanDefault { phutNguoi: number; ngayFree: number; ngayIp: number; buocNgayFree?: number }
interface TopDefault {
  nguoi: Array<{ userId: number; username: string | null; email: string | null; emailVerified: boolean; luot: number; buoc: number; token: number }>;
  ip: Array<{ ip: string; luot: number }>;
}
interface ModelCm {
  id: string; ten: string; model: string; cong: 'anthropic' | 'modelapi'; tenCong: string; khoa: 'free' | 'chung' | 'invisible';
  nangLuc: number; tuongDuong: string; cuaSoToken: number; maxRa: number; gia: { in: number; out: number };
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

const usd = (n: number | null | undefined, d = 2) => (n == null ? '∞' : `$${n.toLocaleString('en-US', { maximumFractionDigits: n > 0 && n < 0.01 ? Math.max(d, 4) : d, minimumFractionDigits: n > 0 && n < 0.01 ? 4 : 0 })}`);
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
            <b className="text-text-primary">CuongMini Code Max</b> = cổng Anthropic chính hãng (key của bạn); <b className="text-text-primary">CuongMini Core</b> =
            modelapi (cổng chính, mặc định CuongMini Solid). Người dùng chỉ thấy tên CuongMini. Model free: Pro dùng không cần khoá, luôn có trần.
            Model khác dùng <b className="text-text-primary">khoá chung</b>; CuongMini Invisible có <b className="text-text-primary">khoá riêng</b>. Vé sống
            48 giờ. Cổng hỏng ⇒ tự chuyển sang model free tương đương ở cổng kia. Admin không bị giới hạn.
          </p>
          <p className="text-xs">
            CuongMini Code Max = official Anthropic gateway; CuongMini Core = main gateway. Users only see CuongMini names. Free models need no key but are capped;
            others share one key, Invisible has its own. Tickets last 48 hours. A failing gateway auto-switches to the free equivalent on the other one.
          </p>
          <p className="text-amber-300/90">⚠ {tq.ghiChu}</p>
        </div>
      </div>

      <AiThongKeAnthropic />
      <KhoKey keys={tq.keys} onDoi={(keys) => setTq({ ...tq, keys })} onNap={nap} />
      {tq.bangModel && <BangModelCm models={tq.bangModel} tran={tq.tranModel ?? {}} onXong={(tranModel) => setTq({ ...tq, tranModel })} />}
      <MatKhau loai="chung" daBat={tq.daBatMatKhau} onXong={nap} />
      <MatKhau loai="invisible" daBat={tq.daBatMatKhauInvisible === true} onXong={nap} />
      <MaGiaHanTien />
      {tq.rambo && <CongTacRambo rambo={tq.rambo} classic={tq.bangClassic ?? []} onDoi={(rambo) => setTq({ ...tq, rambo })} />}
      {tq.defaultGioiHan && <ChongSpamDefault gh={tq.defaultGioiHan} onDoi={(defaultGioiHan) => setTq({ ...tq, defaultGioiHan })} />}
      {/* 22/10/2026: CuongMini trong CT Work — tài trợ theo Pro (người / trưởng nhóm) + chuỗi cổng. */}
      <CtWorkAiAdmin />
      {/* Đợt 8A: admin web tài trợ CuongMini cho mọi dự án CT Work mình tham gia (không trần $, chỉ chống spam). */}
      <TaiTroAdminCongTac />
      <ThamSo tq={tq} onDoi={(serverTool) => setTq({ ...tq, serverTool })} />
      <TranGoiForm tranGoi={tq.tranGoi} onXong={(t) => setTq({ ...tq, tranGoi: t })} />
      <CuongMiniNgonNguAdmin />
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

function MatKhau({ loai, daBat, onXong }: { loai: 'chung' | 'invisible'; daBat: boolean; onXong: () => void }) {
  const [mk, setMk] = useState('');
  const [dang, setDang] = useState(false);
  const laInv = loai === 'invisible';
  const luu = async (matKhau: string | null) => {
    if (matKhau !== null && matKhau.length < 6) { toast.error('Mật khẩu tối thiểu 6 ký tự. / At least 6 characters.'); return; }
    if (matKhau === null && !window.confirm(laInv
      ? 'Tắt khoá Invisible? Người thường không mở được CuongMini Invisible nữa. / Turn off the Invisible key?'
      : 'Tắt khoá chung? Người thường không mở được model cần khoá nữa (model free vẫn chạy). / Turn off the shared key?')) return;
    setDang(true);
    try {
      await goi(laInv ? '/mat-khau-invisible' : '/mat-khau', { method: 'PUT', body: JSON.stringify({ matKhau }) });
      toast.success(matKhau === null ? 'Đã tắt. / Turned off.' : 'Đã đặt — vé cũ của khoá này hết hiệu lực. / Set — old tickets revoked.');
      setMk(''); onXong();
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  return (
    <The tieuDe={laInv ? '🔐 Khoá riêng CuongMini Invisible (Invisible key)' : '🔒 Khoá chung (shared key)'}
      phai={<span className={`px-2 py-0.5 rounded-full text-xs border ${daBat ? 'border-green-500/50 text-green-400' : 'border-darkborder text-text-muted'}`}>{daBat ? 'Đang bật / On' : 'Chưa đặt / Not set'}</span>}>
      <p className="text-text-muted text-xs">
        {laInv
          ? 'Chỉ mở CuongMini Invisible (model đắt nhất). Phải khác khoá chung. Vé sống 48 giờ; đổi khoá = thu hồi mọi vé Invisible. / Opens only CuongMini Invisible; must differ from the shared key; tickets last 48 h.'
          : 'Mở mọi model không thuộc nhóm free (trừ Invisible). Vé sống 48 giờ; đổi khoá = thu hồi mọi vé; không đổi thì người dùng nhập lại vẫn vào. / Opens every non-free model except Invisible; tickets last 48 h.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <input type="password" autoComplete="new-password" className={`${o} flex-1 min-w-[200px]`} value={mk} onChange={(e) => setMk(e.target.value)}
          placeholder={daBat ? 'Khoá mới (đổi = thu hồi vé cũ) / New key' : 'Đặt khoá để bật / Set a key to enable'} />
        <button disabled={dang || !mk} onClick={() => luu(mk)} className={`${nut} border-neon-violet text-neon-violet`}>{daBat ? 'Đổi / Change' : 'Bật / Enable'}</button>
        {daBat && <button disabled={dang} onClick={() => luu(null)} className={`${nut} border-darkborder text-text-muted`}>Tắt / Off</button>}
      </div>
    </The>
  );
}

// ─── Mã gia hạn theo $ (19/10/2026) — src/services/agent/maGiaHanTien.ts ──

interface YeuCauGH {
  id: number; userId: number; username: string | null; ten: string | null; email?: string | null;
  tran: string; tenTran: string; ky: string; soUsd: number; lanThu: number; daDungUsd: number; tranUsd: number;
  trangThai: 'CHO_DUYET' | 'DA_CAP' | 'TU_CHOI' | 'HET_KY'; lyDoTuChoi: string | null; soLanDaCapKy: number; createdAt: string;
}
interface DuLieuGH { ma: { daBat: boolean; phienBan: number }; choDuyet: YeuCauGH[]; ganDay: YeuCauGH[] }
const TEN_TT_GH: Record<YeuCauGH['trangThai'], string> = {
  CHO_DUYET: 'Chờ duyệt / Pending', DA_CAP: 'Đã cấp / Granted', TU_CHOI: 'Từ chối / Rejected', HET_KY: 'Quá kỳ / Expired',
};

/**
 * Mục "Mã gia hạn": đặt/đổi mã (chỉ lưu BĂM — đổi là mã cũ chết ngay), bảng yêu cầu chờ duyệt (người, trần nào, đã dùng
 * bao nhiêu, đã gia hạn mấy lần trong kỳ) với Duyệt/Từ chối, và 50 lượt gần nhất. Yêu cầu mới ⇒ hộp thư admin + Telegram.
 */
function MaGiaHanTien() {
  const [d, setD] = useState<DuLieuGH | null>(null);
  const [ma, setMa] = useState('');
  const [dang, setDang] = useState(false);
  const nap = useCallback(async () => {
    try { setD(await goi<DuLieuGH>('/gia-han-tien')); } catch (e) { toast.error((e as Error).message); }
  }, []);
  useEffect(() => { void nap(); }, [nap]);
  const datMa = async (moi: string | null) => {
    if (moi !== null && moi.length < 6) { toast.error('Mã tối thiểu 6 ký tự. / At least 6 characters.'); return; }
    if (moi === null && !window.confirm('Tắt mã gia hạn? Người dùng chạm trần sẽ không còn ô nhập mã. / Turn extension codes off?')) return;
    setDang(true);
    try {
      await goi('/ma-gia-han', { method: 'PUT', body: JSON.stringify({ ma: moi }) });
      toast.success(moi === null ? 'Đã tắt. / Turned off.' : 'Đã đặt — mã cũ hết hiệu lực. / Set — the old code no longer works.');
      setMa(''); await nap();
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  const xuLy = async (id: number, dongY: boolean) => {
    const lyDo = dongY ? undefined : (window.prompt('Lý do từ chối (không bắt buộc) / Reason (optional)') ?? undefined);
    setDang(true);
    try {
      const r = await goi<DuLieuGH & { yeuCau: YeuCauGH }>(`/gia-han-tien/${id}`, { method: 'POST', body: JSON.stringify({ dongY, ...(lyDo ? { lyDo } : {}) }) });
      setD((cu) => (cu ? { ...cu, choDuyet: r.choDuyet, ganDay: r.ganDay } : cu));
      toast.success(dongY ? 'Đã duyệt — cộng thêm một mức. / Approved.' : 'Đã từ chối. / Rejected.');
    } catch (e) { toast.error((e as Error).message); await nap(); } finally { setDang(false); }
  };
  const nguoi = (y: YeuCauGH) => `@${y.username ?? y.userId}${y.email ? ` · ${y.email}` : ''}`;
  return (
    <The tieuDe="🎟️ Mã gia hạn theo $ (extension code)"
      phai={<span className={`px-2 py-0.5 rounded-full text-xs border ${d?.ma.daBat ? 'border-green-500/50 text-green-400' : 'border-darkborder text-text-muted'}`}>{d?.ma.daBat ? 'Đang bật / On' : 'Chưa đặt / Not set'}</span>}>
      <p className="text-text-muted text-xs">
        Áp cho mọi trần TIỀN người dùng chạm được: trần model × người, ví AI Code (5 giờ), nhóm free Code Max, hạn mức nhóm (từng người).
        Lần 1 trong kỳ của trần đó: mã đúng ⇒ cộng ngay một mức = mức gốc của trần. Lần 2+: tạo yêu cầu chờ duyệt ở đây (nhà tài trợ nhóm
        cũng duyệt được yêu cầu hạn mức nhóm). Model trả phí cần vé khoá trước. 5 lần sai / 15 phút ⇒ khoá. Mã chỉ lưu băm, không bao giờ ghi log.
        <br />Applies to every money cap: per-model, AI Code wallet, Code Max free group, team allowance (per member). First time per period ⇒
        +1 step at once; later ⇒ approval here. Paid models still need their key. Only the hash is stored.
      </p>
      <div className="flex flex-wrap gap-2">
        <input type="password" autoComplete="new-password" className={`${o} flex-1 min-w-[200px]`} value={ma} onChange={(e) => setMa(e.target.value)}
          placeholder={d?.ma.daBat ? 'Mã mới (đổi = mã cũ chết) / New code' : 'Đặt mã để bật / Set a code to enable'} />
        <button disabled={dang || !ma} onClick={() => datMa(ma)} className={`${nut} border-neon-violet text-neon-violet`}>{d?.ma.daBat ? 'Đổi / Change' : 'Bật / Enable'}</button>
        {d?.ma.daBat && <button disabled={dang} onClick={() => datMa(null)} className={`${nut} border-darkborder text-text-muted`}>Tắt / Off</button>}
        <button disabled={dang} onClick={() => void nap()} className={`${nut} border-darkborder text-text-muted`}><RefreshCw className="w-3 h-3 inline" /> Tải lại</button>
      </div>
      <div>
        <b className="text-text-primary text-xs">Chờ duyệt / Pending ({d?.choDuyet.length ?? 0})</b>
        {d?.choDuyet.length ? (
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead className="text-text-muted text-left">
                <tr><th className="pr-3">Người / User</th><th className="pr-3">Trần / Limit</th><th className="pr-3">Đã dùng / Used</th>
                  <th className="pr-3">Đã gia hạn trong kỳ</th><th className="pr-3">Lần / Attempt</th><th className="pr-3">Xin / Asks</th><th className="pr-3">Lúc / At</th><th /></tr>
              </thead>
              <tbody>
                {d.choDuyet.map((y) => (
                  <tr key={y.id}>
                    <td className="pr-3 py-1 text-text-primary">{nguoi(y)}</td>
                    <td className="pr-3">{y.tenTran}</td>
                    <td className="pr-3">{usd(y.daDungUsd)} / {usd(y.tranUsd)}</td>
                    <td className="pr-3">{y.soLanDaCapKy}×</td>
                    <td className="pr-3">{y.lanThu}</td>
                    <td className="pr-3">+{usd(y.soUsd)}</td>
                    <td className="pr-3">{ngayVN(y.createdAt)}</td>
                    <td className="whitespace-nowrap">
                      <button disabled={dang} onClick={() => void xuLy(y.id, true)} className={`${nut} border-green-500/50 text-green-400 mr-1`}>Duyệt / Approve</button>
                      <button disabled={dang} onClick={() => void xuLy(y.id, false)} className={`${nut} border-red-500/50 text-red-400`}>Từ chối / Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-text-muted text-xs">Không có yêu cầu nào. / Nothing pending.</p>}
      </div>
      {!!d?.ganDay.length && (
        <details>
          <summary className="text-text-muted text-xs cursor-pointer">Gần đây / Recent ({d.ganDay.length})</summary>
          <table className="text-xs w-full mt-2">
            <tbody>
              {d.ganDay.map((y) => (
                <tr key={y.id}>
                  <td className="pr-3 py-0.5">#{y.id}</td><td className="pr-3">{nguoi(y)}</td><td className="pr-3">{y.tenTran}</td>
                  <td className="pr-3">+{usd(y.soUsd)}</td><td className="pr-3">{TEN_TT_GH[y.trangThai] ?? y.trangThai}{y.lyDoTuChoi ? ` — ${y.lyDoTuChoi}` : ''}</td>
                  <td className="pr-3">{ngayVN(y.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </The>
  );
}

// ─── Bảng model CuongMini + trần theo model × người (18/10/2026) ──────

const TEN_KHOA = { free: 'Free (Pro)', chung: 'Khoá chung / shared key', invisible: 'Khoá riêng / own key' } as const;

function BangModelCm({ models, tran, onXong }: {
  models: ModelCm[];
  tran: Record<string, Record<'pro' | 'key_terminal', Cap>>;
  onXong: (t: Record<string, Record<'pro' | 'key_terminal', Cap>>) => void;
}) {
  const [nhap, setNhap] = useState(() => JSON.parse(JSON.stringify(tran)) as typeof tran);
  const [dang, setDang] = useState(false);
  const tenCua = (id: string) => models.find((m) => m.id === id)?.ten ?? id;
  const o1 = (id: string, g: 'pro' | 'key_terminal', k: keyof Cap) => (
    <input className={`${o} w-16`} inputMode="decimal" placeholder="∞" value={nhap[id]?.[g]?.[k] ?? ''}
      onChange={(e) => setNhap({ ...nhap, [id]: { ...nhap[id]!, [g]: { ...nhap[id]![g], [k]: soHoacNull(e.target.value) } } })} />
  );
  const luu = async () => {
    setDang(true);
    try {
      const d = await goi<{ tranModel: typeof tran }>('/tran-model', { method: 'PUT', body: JSON.stringify(nhap) });
      onXong(d.tranModel); toast.success('Đã lưu trần theo model. / Per-model caps saved.');
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  return (
    <The tieuDe="🧠 Bảng model CuongMini + trần theo người (USD) / CuongMini models + per-user caps">
      <p className="text-text-muted text-xs">
        Thứ tự = danh sách người dùng thấy: model FREE trước, rồi model cần khoá; trong mỗi nhóm năng lực cao → thấp (họ chỉ thấy tên CuongMini). Trần tính theo tháng/ngày lịch giờ Việt Nam
        trên sổ <code>interview_llm_call_logs</code> (feature agent, đúng model). Ô trống = không giới hạn. Cổng chính hãng còn trần nhóm free/cao bên dưới.
        <br />Order = what users see: free models first, then keyed ones; capability within each group. Empty = unlimited.
      </p>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead className="text-text-muted text-left">
            <tr><th className="pr-3">Tên / Name</th><th className="pr-3">Model thật</th><th className="pr-3">Cổng / Gateway</th><th className="pr-3">Khoá / Key</th>
              <th className="pr-3">Cửa sổ / Ra</th><th className="pr-3">Lùi sang / Fallback</th>
              <th>Pro / tháng</th><th>Pro / ngày</th><th>Key terminal / tháng</th><th>Key terminal / ngày</th></tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id}>
                <td className="pr-3 py-1 text-text-primary">{m.ten}</td>
                <td className="pr-3"><code>{m.model}</code></td>
                <td className="pr-3">{m.tenCong}</td>
                <td className="pr-3">{TEN_KHOA[m.khoa]}</td>
                <td className="pr-3">{(m.cuaSoToken / 1000).toLocaleString('vi-VN')}K / {(m.maxRa / 1000).toLocaleString('vi-VN')}K</td>
                <td className="pr-3">{tenCua(m.tuongDuong)}</td>
                <td className="px-1">{o1(m.id, 'pro', 'thang')}</td><td className="px-1">{o1(m.id, 'pro', 'ngay')}</td>
                <td className="px-1">{o1(m.id, 'key_terminal', 'thang')}</td><td className="px-1">{o1(m.id, 'key_terminal', 'ngay')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button disabled={dang} onClick={luu} className={`${nut} border-neon-violet text-neon-violet`}>Lưu trần theo model / Save caps</button>
    </The>
  );
}

// ─── Công tắc cổng rambo + tình trạng + nút Thử (19/10/2026) ─────────

function CongTacRambo({ rambo, classic, onDoi }: {
  rambo: TrangThaiRambo;
  classic: Array<{ id: string; ten: string; model: string }>;
  onDoi: (r: TrangThaiRambo) => void;
}) {
  const [dang, setDang] = useState(false);
  const [dangThu, setDangThu] = useState(false);
  const doi = async (bat: boolean) => {
    setDang(true);
    try { onDoi(await goi('/rambo', { method: 'PUT', body: JSON.stringify({ bat }) })); toast.success(bat ? 'Đã bật rambo. / Rambo on.' : 'Đã tắt rambo. / Rambo off.'); }
    catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  const thu = async () => {
    setDangThu(true);
    try {
      const r = await goi<{ ketQua: { models: Array<{ ok: boolean }> }; trangThai: TrangThaiRambo }>('/rambo/thu', { method: 'POST' });
      onDoi(r.trangThai);
      const ok = r.ketQua.models.filter((m) => m.ok).length;
      if (ok) toast.success(`Rambo trả lời ${ok}/${r.ketQua.models.length} model. / Rambo answered ${ok}/${r.ketQua.models.length}.`);
      else toast.error('Rambo không trả lời model nào. / Rambo answered none.');
    } catch (e) { toast.error((e as Error).message); } finally { setDangThu(false); }
  };
  const song = rambo.bat && rambo.coCauHinh && !rambo.dangNghi;
  const nhan = !rambo.bat ? { t: 'TẮT / Off', c: 'border-darkborder text-text-muted' }
    : !rambo.coCauHinh ? { t: 'Thiếu cấu hình / Not configured', c: 'border-red-500/50 text-red-400' }
      : rambo.dangNghi ? { t: 'SẬP — đang lùi / Down — falling back', c: 'border-red-500/50 text-red-400' }
        : { t: 'BẬT · đang chạy / On · up', c: 'border-green-500/50 text-green-400' };
  return (
    <The tieuDe="🔌 Cổng rambo — CuongMini Default / Classic"
      phai={<span className={`px-2 py-0.5 rounded-full text-xs border ${nhan.c}`}>{nhan.t}</span>}>
      <div className="text-text-muted text-xs space-y-1">
        <p>
          <b className="text-text-primary">Bật thì chuyện gì xảy ra:</b> rambo là gói trả trọn (rẻ nhất) nên thành MẶC ĐỊNH.
          AI Code (app, CLI, extension): <b className="text-text-primary">CuongMini Default</b> chạy Sonnet mới nhất của rambo
          ({rambo.modelSonic ?? '—'}), nhóm <b className="text-text-primary">CuongMini Classic</b> ({classic.map((m) => m.ten.replace(/^CuongMini /, '')).join(' · ') || '—'}) hiện ngay dưới Default;
          tài khoản FREE dùng được Default (chống spam ở thẻ dưới). Web: các việc có model Claude trong bản đồ (gia sư bài học, Code Lab, CT Work…) đi rambo;
          CT Work dùng Sonnet. Phòng Luyện nói giữ cổng chính hãng (nhanh hơn).
          Rambo sập ⇒ cầu dao mở: Pro tự lùi CuongMini Solid, web lùi gpt-6-sol, Free nhận câu &ldquo;đang bảo trì&rdquo;; rambo sống lại là tự về.
        </p>
        <p>
          When on, rambo (flat-rate, cheapest) becomes the DEFAULT: CuongMini Default runs rambo&apos;s newest Sonnet, the Classic group appears right below it,
          free accounts can use Default (anti-spam below), web features with a Claude model go through rambo (CT Work uses Sonnet; speaking room stays official).
          When it fails the breaker opens: Pro falls back to Solid, web to gpt-6-sol, free users see &ldquo;under maintenance&rdquo;; it comes back automatically.
        </p>
        {rambo.nguon === 'env' && <p className="text-amber-300/90">⚠ Đang bị env RAMBO_BAT ghi đè — công tắc không có tác dụng tới khi bỏ biến đó. / Forced by RAMBO_BAT env.</p>}
        {!rambo.coCauHinh && <p className="text-amber-300/90">⚠ Máy chủ chưa có AGENT_GATEWAY_BASE_URL/_API_KEY — bật cũng như tắt. / Missing gateway env.</p>}
        <p>
          Lần kiểm gần nhất / Last check: {rambo.kiemGanNhat ? `${ngayVN(rambo.kiemGanNhat.luc)} — ${rambo.kiemGanNhat.song ? 'sống / up' : 'không trả lời / down'}` : 'chưa có / none yet'}
          {rambo.dsModel && <> · Danh sách model ({ngayVN(rambo.dsModel.luc)}): {rambo.dsModel.ids.join(', ')}</>}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" disabled={dang || rambo.nguon === 'env'} checked={rambo.bat} onChange={(e) => doi(e.target.checked)} />
          Bật cổng rambo / Enable rambo
        </label>
        <button type="button" className={`${nut} border-sky-500/50 text-sky-300`} disabled={dangThu || !rambo.bat || !rambo.coCauHinh} onClick={thu}>
          {dangThu ? 'Đang thử… / Testing…' : 'Thử rambo / Test rambo'}
        </button>
        {song ? null : rambo.bat && <span className="text-xs text-red-400">Đang lùi về Solid / gpt-6-sol.</span>}
      </div>
      {rambo.thuGanNhat && (
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead><tr className="text-text-muted text-left"><th className="pr-3">Model</th><th className="pr-3">Kết quả / Result</th><th className="pr-3">ms</th><th>Lỗi / Error</th></tr></thead>
            <tbody>
              {rambo.thuGanNhat.models.map((m) => (
                <tr key={m.model}>
                  <td className="pr-3 font-mono">{m.model}</td>
                  <td className={`pr-3 ${m.ok ? 'text-green-400' : 'text-red-400'}`}>{m.ok ? 'OK' : 'Hỏng / Failed'}</td>
                  <td className="pr-3">{m.ms}</td>
                  <td className="text-text-muted break-all">{m.loi ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-text-muted mt-1">Thử lúc / Tested at {ngayVN(rambo.thuGanNhat.luc)} — mỗi model một lời gọi 1 token (gói trọn, không tốn tiền theo token).</p>
        </div>
      )}
    </The>
  );
}

// ─── CuongMini trong CT Work (22/10/2026) ───────────────────────────────

interface GioiHanCtw { phutNguoi: number; ngayNguoi: number; ngayIp: number }
/** 22/10/2026: thêm `bac` (chính hãng có 2 bậc: Sonnet rồi Haiku) + bảng đếm model trả markup gọi tool dạng chữ. */
interface BacCong { bac?: 'rambo' | 'chinh_hang_sonnet' | 'chinh_hang_haiku' | 'modelapi'; cong: 'rambo' | 'chinh_hang' | 'modelapi'; model: string; dungDuoc: boolean }
interface DemMarkup { cong: string; model: string; lan: number; cuoi: string }
const TEN_BAC: Record<string, string> = {
  rambo: 'Rambo (gói trọn)', chinh_hang: 'Chính hãng (Code Max)', chinh_hang_sonnet: 'Chính hãng Sonnet',
  chinh_hang_haiku: 'Chính hãng Haiku (dự phòng)', modelapi: 'modelapi (Core)',
};

function CtWorkAiAdmin() {
  const [d, setD] = useState<{ gioiHan: GioiHanCtw; chuoi: Record<string, BacCong[]>; markupTool?: DemMarkup[] } | null>(null);
  const [nhap, setNhap] = useState({ phutNguoi: '', ngayNguoi: '', ngayIp: '' });
  const [dang, setDang] = useState(false);
  const nap = useCallback(async () => {
    try {
      const v = await goi<{ gioiHan: GioiHanCtw; chuoi: Record<string, BacCong[]>; markupTool?: DemMarkup[] }>('/ctwork-ai');
      setD(v);
      setNhap({ phutNguoi: String(v.gioiHan.phutNguoi), ngayNguoi: String(v.gioiHan.ngayNguoi), ngayIp: String(v.gioiHan.ngayIp) });
    } catch (e) { toast.error((e as Error).message); }
  }, []);
  useEffect(() => { void nap(); }, [nap]);
  const luu = async () => {
    setDang(true);
    try {
      const gioiHan = await goi<GioiHanCtw>('/ctwork-ai-gioi-han', {
        method: 'PUT', body: JSON.stringify({ phutNguoi: Number(nhap.phutNguoi) || 0, ngayNguoi: Number(nhap.ngayNguoi) || 0, ngayIp: Number(nhap.ngayIp) || 0 }),
      });
      setD((x) => (x ? { ...x, gioiHan } : x));
      toast.success('Đã lưu. / Saved.');
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  const o1 = (k: keyof typeof nhap, nhanVi: string, nhanEn: string) => (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-text-muted">{nhanVi} / {nhanEn}</span>
      <input className={`${o} w-28`} type="number" min={0} value={nhap[k]} onChange={(e) => setNhap({ ...nhap, [k]: e.target.value })} />
    </label>
  );
  return (
    <The tieuDe="🗂 CuongMini trong CT Work — tài trợ Pro + chuỗi cổng / CT Work assistant">
      <p className="text-text-muted text-xs">
        Người hỏi có Pro, HOẶC dự án có trưởng nhóm (trưởng dự án / ADMIN dự án / chủ hoặc ADMIN không gian) là Pro ⇒ cả nhóm dùng CuongMini
        trong CT Work KHÔNG trần token/ngày. Lượt được tài trợ chỉ qua chống spam dưới đây (đếm CÂU HỎI, 0 = tắt) + trần tiền/ngày của cả web.
        Người khác giữ hạn mức thường.
        <br />Pro users, or every member of a project whose lead is Pro, have no daily token cap in CT Work — only these anti-spam limits.
      </p>
      {d && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            {o1('phutNguoi', 'Câu/phút/người', 'Per minute per user')}
            {o1('ngayNguoi', 'Câu/ngày/người', 'Per day per user')}
            {o1('ngayIp', 'Câu/ngày/IP', 'Per day per IP')}
            <button type="button" className={`${nut} border-sky-500/50 text-sky-300`} disabled={dang} onClick={luu}>Lưu / Save</button>
            <button type="button" className={`${nut} border-darkborder text-text-muted`} onClick={() => void nap()}><RefreshCw className="w-3 h-3 inline" /> Tải lại</button>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead><tr className="text-text-muted text-left"><th className="pr-3">Việc / Job</th><th className="pr-3">1 · chính</th><th className="pr-3">2 · lùi</th><th className="pr-3">3 · lùi</th><th>4 · lùi cuối</th></tr></thead>
              <tbody>
                {Object.entries(d.chuoi).map(([viec, bac]) => (
                  <tr key={viec}>
                    <td className="pr-3 font-mono">{viec}</td>
                    {bac.map((b) => (
                      <td key={b.bac ?? b.cong} className={`pr-3 ${b.dungDuoc ? 'text-green-400' : 'text-amber-400'}`} title={b.dungDuoc ? 'đang dùng được' : 'đang tắt / cầu dao mở / trần $ = 0'}>
                        {TEN_BAC[b.bac ?? b.cong] ?? b.cong}: <span className="font-mono">{b.model}</span>{b.dungDuoc ? '' : ' (tạm bỏ qua)'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-text-muted mt-1">Bậc hỏng (DNS/410/401/5xx/hết giờ/trả rỗng/câu báo lỗi của cổng/markup gọi tool dạng chữ) ⇒ tự sang bậc sau trong cùng lượt, người dùng không thấy lỗi; rambo sống lại ⇒ tự về. Chính hãng: Sonnet hỏng hoặc chạm trần (100 $/ngày, 10 $/người) ⇒ Haiku (thêm 20 $ / 2 $). Đổi thứ tự: env <code>CTWORK_CHUOI_CONG</code> (rambo, chinh_hang_sonnet, chinh_hang_haiku, modelapi). Đổi model: <code>CTWORK_RAMBO_MODEL</code> (fable-5), <code>CTWORK_RAMBO_MODEL_NANG</code>, <code>CTWORK_MODEL_CHINH_HANG(_NHE|_DU_PHONG)</code>, <code>LLM_MODEL_&lt;VIỆC&gt;</code>; tắt rambo riêng CT Work: <code>CTWORK_RAMBO=0</code>.</p>
            {d.markupTool?.length ? (
              <p className="text-[11px] text-amber-400 mt-1">Model trả lời gọi tool dạng chữ (DSML…, đã chặn + đổi cổng) từ khi máy chủ chạy: {d.markupTool.map((x) => `${x.cong}/${x.model}: ${x.lan} lần`).join(' · ')}</p>
            ) : null}
          </div>
        </>
      )}
    </The>
  );
}

// ─── Chống spam CuongMini Default + ai dùng nhiều nhất hôm nay ─────────

function ChongSpamDefault({ gh, onDoi }: { gh: GioiHanDefault; onDoi: (v: GioiHanDefault) => void }) {
  const [nhap, setNhap] = useState({ phutNguoi: String(gh.phutNguoi), ngayFree: String(gh.ngayFree), ngayIp: String(gh.ngayIp), buocNgayFree: String(gh.buocNgayFree ?? 10000) });
  const [dang, setDang] = useState(false);
  const [top, setTop] = useState<TopDefault | null>(null);
  const napTop = useCallback(async () => {
    try { setTop(await goi<TopDefault>('/default-top')); } catch (e) { toast.error((e as Error).message); }
  }, []);
  useEffect(() => { void napTop(); }, [napTop]);
  const luu = async () => {
    setDang(true);
    try {
      const v = await goi<GioiHanDefault>('/default-gioi-han', {
        method: 'PUT',
        body: JSON.stringify({ phutNguoi: Number(nhap.phutNguoi) || 0, ngayFree: Number(nhap.ngayFree) || 0, ngayIp: Number(nhap.ngayIp) || 0, buocNgayFree: Number(nhap.buocNgayFree) || 0 }),
      });
      onDoi(v);
      toast.success('Đã lưu. / Saved.');
    } catch (e) { toast.error((e as Error).message); } finally { setDang(false); }
  };
  const o1 = (k: keyof typeof nhap, nhanVi: string, nhanEn: string) => (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-text-muted">{nhanVi} / {nhanEn}</span>
      <input className={`${o} w-28`} type="number" min={0} value={nhap[k]} onChange={(e) => setNhap({ ...nhap, [k]: e.target.value })} />
    </label>
  );
  return (
    <The tieuDe="🛡 Chống spam CuongMini Default / Default anti-spam">
      <p className="text-text-muted text-xs">
        Default chạy trên rambo (gói trọn) cho MỌI tài khoản, gần như không giới hạn. Chỉ đếm câu hỏi MỚI (không đếm từng bước gọi tool). Free phải xác thực email.
        0 = tắt. Chạm giới hạn ⇒ câu thân thiện nói rõ khi nào dùng lại. ⚠ Rambo là gói của một nhà cung cấp — dùng quá đà có thể bị họ giới hạn khoá; xem bảng dưới để phát hiện sớm.
        <br />Counts new questions only. Free accounts need a verified email. 0 = off.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        {o1('phutNguoi', 'Lượt/phút/người (Free + Pro)', 'Per minute per user')}
        {o1('ngayFree', 'Lượt/ngày/người (Free)', 'Per day per free user')}
        {o1('ngayIp', 'Lượt/ngày/IP (Free)', 'Per day per IP')}
        {o1('buocNgayFree', 'Bước/ngày/người (Free, mọi lời gọi)', 'Steps per day per free user')}
        <button type="button" className={`${nut} border-sky-500/50 text-sky-300`} disabled={dang} onClick={luu}>Lưu / Save</button>
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-primary">Dùng Default nhiều nhất hôm nay / Top Default users today</h4>
        <button type="button" className={`${nut} border-darkborder text-text-muted`} onClick={() => void napTop()}><RefreshCw className="w-3 h-3 inline" /> Tải lại</button>
      </div>
      {top && (
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead><tr className="text-text-muted text-left"><th className="pr-3">Người dùng / User</th><th className="pr-3">Câu hỏi / Questions</th><th className="pr-3">Bước / Steps</th><th className="pr-3">Token</th><th>Email</th></tr></thead>
            <tbody>
              {top.nguoi.length === 0 && <tr><td colSpan={5} className="text-text-muted py-2">Chưa ai dùng hôm nay. / Nobody yet today.</td></tr>}
              {top.nguoi.map((n) => (
                <tr key={n.userId}>
                  <td className="pr-3">#{n.userId} {n.username ?? ''} <span className="text-text-muted">{n.email ?? ''}</span></td>
                  <td className="pr-3">{n.luot}</td>
                  <td className="pr-3">{n.buoc}</td>
                  <td className="pr-3">{n.token.toLocaleString('vi-VN')}</td>
                  <td className={n.emailVerified ? 'text-green-400' : 'text-amber-400'}>{n.emailVerified ? 'đã xác thực' : 'chưa'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {top.ip.length > 0 && (
            <p className="text-[11px] text-text-muted mt-2">IP đông nhất (Free, từ lúc máy chủ khởi động) / Busiest IPs: {top.ip.slice(0, 8).map((x) => `${x.ip} (${x.luot})`).join(' · ')}</p>
          )}
        </div>
      )}
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
