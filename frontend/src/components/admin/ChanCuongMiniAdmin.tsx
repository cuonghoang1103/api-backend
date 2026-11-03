'use client';

/**
 * Admin — DANH SÁCH CHẶN CUONGMINI (27/10/2026).
 * Hai phạm vi độc lập: AI Code + CLI + VS Code (chung một cửa) · CuongMini trong CT Work.
 * Backend: /api/v1/admin/cong-anthropic/chan (xem src/services/agent/cuongMiniChan.ts).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { anhTuyetDoi } from '@/lib/anhTuyetDoi';
import { AlertTriangle, Ban, ChevronLeft, ChevronRight, Code2, Crown, Kanban, KeyRound, Loader2, LockOpen, Power, Search, ShieldBan, Users, X } from 'lucide-react';

type PhamVi = 'AI_CODE' | 'CTWORK';
interface DongChan {
  userId: number; username: string | null; email: string | null; ten: string | null;
  phamVi: PhamVi; lyDo: string | null; chanBoi: string | null; luc: string;
}

const API_GOC = '/api/v1/admin/cong-anthropic';
const API = `${API_GOC}/chan`;
async function goiTai<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    credentials: 'include', ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as T;
}
const goi = <T,>(duong: string, init?: RequestInit) => goiTai<T>(`${API}${duong}`, init);
const goiGoc = <T,>(duong: string, init?: RequestInit) => goiTai<T>(`${API_GOC}${duong}`, init);

/** Công tắc tổng bảo trì CuongMini. */
interface TrangThaiBaoTri { bat: boolean; nguon: 'env' | 'admin' }
/** Mức dùng key (USD tự đo). */
interface TokenGom { vao: number; ra: number; cacheDoc: number; cacheGhi: number }
interface DongKey { keyId: number | null; nhan: string; duoiKhoa: string | null; usd: number; luot: number; token: TokenGom }
interface DongViec { viec: string; usd: number; luot: number; token: TokenGom }
interface MucDungKey { soNgay: number; tu: string; theoKey: DongKey[]; theoViec: DongViec[] }

/** Nhãn tiếng Việt cho từng việc trong sổ cổng chính hãng (đồng bộ TEN_VIEC ở aiThongKe.ts). */
const TEN_VIEC: Record<string, string> = {
  agent_code: 'AI Code (app/CLI)', agent_taitro: 'AI Code — admin tài trợ', exam_tutor: 'CuongMini trong phòng thi',
  exam_grade: 'Chấm bài phòng thi', thu_ket_noi: 'Thử kết nối', tim_web: 'Tìm web', language_tutor: 'Trò chuyện ngoại ngữ',
  work_setup: 'Create with CuongMini (CT Work)', work_ai: 'Trợ lý CT Work', admin_thong_ke: 'AI thống kê (admin)',
};
const tenViec = (v: string) => TEN_VIEC[v] ?? v;
const KY = [7, 30, 90] as const;
const usd = (n: number) => `$${n.toFixed(n >= 1 ? 2 : 4)}`;
const soGon = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);

const PHAM_VI: Array<{ id: PhamVi; ten: string; mo: string; Icon: typeof Code2 }> = [
  { id: 'AI_CODE', ten: 'AI Code · CLI · VS Code', mo: 'Chặn dùng CuongMini trong app desktop AI Code, CuongMini CLI và extension VS Code.', Icon: Code2 },
  { id: 'CTWORK', ten: 'CT Work', mo: 'Chặn dùng CuongMini trong CT Work (hỏi đáp, thao tác thẻ, soát tài liệu, agent dựng sẵn).', Icon: Kanban },
];

/** Một người trong danh sách tìm/duyệt (GET /chan/nguoi-dung, 28/10/2026). */
interface NguoiDung {
  id: number; username: string; email: string; ten: string | null; avatarUrl: string | null;
  isPro: boolean; lastLoginAt: string | null; createdAt: string; daChan: boolean;
}
interface TrangNguoi { tong: number; trang: number; co: number; ds: NguoiDung[] }

/** Gõ chữ ⇒ đợi người dùng ngừng gõ rồi mới gọi API. */
function useDoi<T>(v: T, ms = 250): T {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

export default function ChanCuongMiniAdmin() {
  const [phamVi, setPhamVi] = useState<PhamVi>('AI_CODE');
  const [ds, setDs] = useState<DongChan[] | null>(null);
  const [q, setQ] = useState('');
  const [lyDo, setLyDo] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [loc, setLoc] = useState('');
  // Ô chặn: gợi ý khi gõ (khớp một phần username/email/tên/id) — chọn một gợi ý ⇒ chặn theo userId.
  const [chon, setChon] = useState<NguoiDung | null>(null);
  const [goiY, setGoiY] = useState<NguoiDung[]>([]);
  const [moGoiY, setMoGoiY] = useState(false);
  const qDoi = useDoi(q);
  const oChan = useRef<HTMLDivElement>(null);
  // Danh sách mọi người dùng (tìm + phân trang).
  const [timDs, setTimDs] = useState('');
  const timDoi = useDoi(timDs);
  const [trangDs, setTrangDs] = useState(1);
  const [dsNguoi, setDsNguoi] = useState<TrangNguoi | null>(null);
  // Công tắc tổng bảo trì + mức dùng key.
  const [baoTri, setBaoTri] = useState<TrangThaiBaoTri | null>(null);
  const [dangDoiBaoTri, setDangDoiBaoTri] = useState(false);
  const [kySoNgay, setKySoNgay] = useState<(typeof KY)[number]>(30);
  const [mucKey, setMucKey] = useState<MucDungKey | null>(null);

  useEffect(() => {
    goiGoc<TrangThaiBaoTri>('/bao-tri').then(setBaoTri).catch((e) => toast.error((e as Error).message));
  }, []);

  useEffect(() => {
    setMucKey(null);
    goiGoc<MucDungKey>(`/muc-dung-key?soNgay=${kySoNgay}`).then(setMucKey).catch((e) => toast.error((e as Error).message));
  }, [kySoNgay]);

  const doiBaoTri = async (bat: boolean) => {
    if (bat && !window.confirm('BẬT "Chặn tất cả"?\n\nMọi dịch vụ AI của NGƯỜI DÙNG THƯỜNG (trợ giảng, chat, codelab, thi, ngoại ngữ, ghi chú, phỏng vấn, AI Code…) sẽ bị chặn ngay. CHỈ còn admin và AI trong CT Work chạy được.')) return;
    setDangDoiBaoTri(true);
    try {
      setBaoTri(await goiGoc<TrangThaiBaoTri>('/bao-tri', { method: 'PUT', body: JSON.stringify({ bat }) }));
      toast.success(bat ? 'Đã BẬT chặn tất cả (trừ admin + CT Work)' : 'Đã TẮT — AI chạy lại bình thường');
    } catch (e) { toast.error((e as Error).message); } finally { setDangDoiBaoTri(false); }
  };

  const nap = useCallback(async () => {
    setDs(null);
    try { setDs(await goi<DongChan[]>(`?phamVi=${phamVi}`)); } catch (e) { toast.error((e as Error).message); setDs([]); }
  }, [phamVi]);
  useEffect(() => { void nap(); }, [nap]);

  const napNguoi = useCallback(async () => {
    try {
      setDsNguoi(await goi<TrangNguoi>(`/nguoi-dung?phamVi=${phamVi}&trang=${trangDs}&co=25&q=${encodeURIComponent(timDoi.trim())}`));
    } catch (e) { toast.error((e as Error).message); }
  }, [phamVi, trangDs, timDoi]);
  useEffect(() => { void napNguoi(); }, [napNguoi]);
  useEffect(() => { setTrangDs(1); }, [timDoi, phamVi]);

  useEffect(() => {
    if (chon || qDoi.trim().length < 1) { setGoiY([]); return; }
    let huy = false;
    goi<TrangNguoi>(`/nguoi-dung?phamVi=${phamVi}&co=8&q=${encodeURIComponent(qDoi.trim())}`)
      .then((r) => { if (!huy) { setGoiY(r.ds); setMoGoiY(true); } })
      .catch(() => { if (!huy) setGoiY([]); });
    return () => { huy = true; };
  }, [qDoi, phamVi, chon]);

  useEffect(() => {
    const dong = (e: MouseEvent) => { if (oChan.current && !oChan.current.contains(e.target as Node)) setMoGoiY(false); };
    document.addEventListener('mousedown', dong);
    return () => document.removeEventListener('mousedown', dong);
  }, []);

  const chan = async (nguoi?: NguoiDung) => {
    const ai = nguoi ?? chon;
    if (!ai && !q.trim()) return;
    const nhan = ai ? `@${ai.username}` : q.trim();
    if (nguoi && !window.confirm(`Chặn CuongMini (${PHAM_VI.find((p) => p.id === phamVi)?.ten}) cho ${nhan}?`)) return;
    setDangGui(true);
    try {
      const body = ai ? { userId: ai.id, phamVi, lyDo: lyDo.trim() || null } : { q: q.trim(), phamVi, lyDo: lyDo.trim() || null };
      setDs(await goi<DongChan[]>('', { method: 'POST', body: JSON.stringify(body) }));
      toast.success(`Đã chặn ${nhan}`);
      setQ(''); setLyDo(''); setChon(null); setGoiY([]);
      void napNguoi();
    } catch (e) { toast.error((e as Error).message); } finally { setDangGui(false); }
  };

  const mo = async (d: DongChan) => {
    if (!window.confirm(`Mở khoá CuongMini (${PHAM_VI.find((p) => p.id === d.phamVi)?.ten}) cho ${d.username ?? d.email}?`)) return;
    try {
      setDs(await goi<DongChan[]>(`/${d.userId}/${d.phamVi}`, { method: 'DELETE' }));
      toast.success('Đã mở khoá');
      void napNguoi();
    } catch (e) { toast.error((e as Error).message); }
  };

  const hien = (ds ?? []).filter((d) => !loc.trim() || `${d.username} ${d.email} ${d.ten} ${d.lyDo}`.toLowerCase().includes(loc.trim().toLowerCase()));
  const pv = PHAM_VI.find((p) => p.id === phamVi)!;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0"><ShieldBan className="w-5 h-5" /></div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Chặn CuongMini</h2>
          <p className="text-sm text-text-muted">Chặn người dùng lạm dụng, phụ thuộc quá mức hoặc xúc phạm CuongMini. Người bị chặn vẫn dùng mọi phần khác của web bình thường.</p>
        </div>
      </div>

      {/* ⛔ CÔNG TẮC TỔNG — chặn tất cả (trừ admin + CT Work) */}
      <div className={`rounded-2xl border p-4 ${baoTri?.bat ? 'border-red-500/60 bg-red-500/10' : 'border-darkborder bg-darkcard'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${baoTri?.bat ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}><Power className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-text-primary">⛔ Chặn tất cả (trừ admin + CT Work)</h3>
              {baoTri && (
                <span className={`text-[11px] font-semibold rounded-md px-1.5 py-0.5 ${baoTri.bat ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {baoTri.bat ? 'ĐANG BẬT' : 'Đang tắt'}
                </span>
              )}
              {baoTri?.nguon === 'env' && <span className="text-[11px] rounded-md bg-slate-500/20 text-slate-300 px-1.5 py-0.5">khoá cứng bằng env</span>}
            </div>
            <p className="text-sm text-text-muted mt-1">
              Khi BẬT: mọi dịch vụ AI cho người dùng thường (trợ giảng, chat, codelab, thi, ngoại ngữ, ghi chú, phỏng vấn, AI Code…)
              bị chặn ngay với câu <em>“CuongMini đã quá tải hoặc đang bảo trì xin vui lòng thử lại sau”</em>, không rơi về cổng dự phòng.
              <strong className="text-text-secondary"> Vẫn chạy:</strong> tài khoản admin · AI trong CT Work · AI thống kê của admin.
            </p>
            {baoTri?.bat && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Người dùng thường đang bị chặn — chỉ admin + CT Work dùng được.</span>
              </div>
            )}
          </div>
          <button
            onClick={() => void doiBaoTri(!baoTri?.bat)}
            disabled={dangDoiBaoTri || baoTri === null || baoTri?.nguon === 'env'}
            title={baoTri?.nguon === 'env' ? 'Đang bị khoá bằng biến môi trường CUONGMINI_BAO_TRI' : undefined}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 ${baoTri?.bat ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
            {dangDoiBaoTri ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
            {baoTri?.bat ? 'Tắt — mở lại AI' : 'Bật — chặn tất cả'}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {PHAM_VI.map((p) => (
          <button key={p.id} onClick={() => setPhamVi(p.id)}
            className={`text-left rounded-2xl border p-4 transition-colors ${phamVi === p.id ? 'border-blue-500/60 bg-blue-500/10' : 'border-darkborder bg-darkcard hover:border-text-muted/40'}`}>
            <div className="flex items-center gap-2 font-semibold text-text-primary"><p.Icon className="w-4 h-4 text-blue-400" /> {p.ten}</div>
            <p className="text-xs text-text-muted mt-1">{p.mo}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-darkborder bg-darkcard p-4 space-y-3">
        <div className="text-sm font-semibold text-text-primary">Chặn người dùng · {pv.ten}</div>
        <div className="grid md:grid-cols-[1fr_1.4fr_auto] gap-2">
          <div className="relative" ref={oChan}>
            {chon ? (
              <div className="flex items-center gap-2 rounded-xl bg-darkbg border border-blue-500/50 px-3 py-1.5 text-sm">
                <AnhDaiDien n={chon} />
                <span className="min-w-0 truncate text-text-primary">{chon.ten || chon.username} <span className="text-text-muted">@{chon.username}</span></span>
                <button onClick={() => { setChon(null); setQ(''); }} className="ml-auto text-text-muted hover:text-text-primary" aria-label="Bỏ chọn"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <input value={q} onChange={(e) => { setQ(e.target.value); setMoGoiY(true); }} onFocus={() => setMoGoiY(true)}
                placeholder="Gõ tên, username, email hoặc id…"
                onKeyDown={(e) => { if (e.key === 'Enter' && goiY.length === 1) { setChon(goiY[0]); setMoGoiY(false); } if (e.key === 'Escape') setMoGoiY(false); }}
                className="w-full rounded-xl bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary" />
            )}
            {!chon && moGoiY && q.trim() && (
              <div className="absolute z-20 mt-1 w-full max-h-80 overflow-auto rounded-xl border border-darkborder bg-darkcard shadow-xl">
                {goiY.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-text-muted">Không thấy ai khớp “{q.trim()}”.</div>
                ) : goiY.map((n) => (
                  <button key={n.id} onClick={() => { setChon(n); setMoGoiY(false); }} disabled={n.daChan}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-darkbg disabled:opacity-50">
                    <AnhDaiDien n={n} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-text-primary">{n.ten || n.username}{n.isPro && <Crown className="inline w-3.5 h-3.5 ml-1 text-amber-400" />}</span>
                      <span className="block truncate text-xs text-text-muted">@{n.username} · {n.email} · #{n.id}</span>
                    </span>
                    {n.daChan && <span className="text-[11px] rounded-md bg-red-500/15 text-red-400 px-1.5 py-0.5">Đã chặn</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (chỉ admin thấy) — vd: spam, xúc phạm"
            onKeyDown={(e) => { if (e.key === 'Enter') void chan(); }}
            className="rounded-xl bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary" />
          <button onClick={() => void chan()} disabled={dangGui || (!chon && !q.trim())}
            className="rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 flex items-center justify-center gap-2 disabled:opacity-50">
            {dangGui ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />} Chặn
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-darkborder">
          <div className="text-sm font-semibold text-text-primary">Đang bị chặn <span className="text-text-muted font-normal">({ds?.length ?? '…'})</span></div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-text-muted" />
            <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Lọc…"
              className="rounded-lg bg-darkbg border border-darkborder pl-8 pr-3 py-1.5 text-sm text-text-primary w-48" />
          </div>
        </div>
        {ds === null ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-text-muted" /></div>
        ) : hien.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">Chưa có ai bị chặn ở phạm vi này.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-text-muted bg-darkbg/60">
                <tr><th className="text-left px-4 py-2">Người dùng</th><th className="text-left px-4 py-2">Lý do</th><th className="text-left px-4 py-2">Chặn bởi</th><th className="text-left px-4 py-2">Lúc</th><th className="px-4 py-2" /></tr>
              </thead>
              <tbody>
                {hien.map((d) => (
                  <tr key={`${d.userId}-${d.phamVi}`} className="border-t border-darkborder">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-text-primary">{d.ten || d.username}</div>
                      <div className="text-xs text-text-muted">@{d.username} · {d.email}</div>
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">{d.lyDo || <span className="text-text-muted">—</span>}</td>
                    <td className="px-4 py-2.5 text-text-muted">{d.chanBoi ? `@${d.chanBoi}` : '—'}</td>
                    <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">{ngay(d.luc)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => void mo(d)} className="rounded-lg border border-darkborder hover:border-emerald-500/60 hover:text-emerald-400 text-text-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5">
                        <LockOpen className="w-3.5 h-3.5" /> Mở khoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-darkborder">
          <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Tất cả người dùng <span className="text-text-muted font-normal">({dsNguoi?.tong ?? '…'})</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-text-muted" />
            <input value={timDs} onChange={(e) => setTimDs(e.target.value)} placeholder="Tìm tên, username, email, id…"
              className="rounded-lg bg-darkbg border border-darkborder pl-8 pr-3 py-1.5 text-sm text-text-primary w-64" />
          </div>
        </div>
        {dsNguoi === null ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-text-muted" /></div>
        ) : dsNguoi.ds.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">Không có người dùng nào khớp.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-text-muted bg-darkbg/60">
                <tr><th className="text-left px-4 py-2">Người dùng</th><th className="text-left px-4 py-2">Gói</th><th className="text-left px-4 py-2">Đăng nhập gần nhất</th><th className="text-left px-4 py-2">Tham gia</th><th className="px-4 py-2" /></tr>
              </thead>
              <tbody>
                {dsNguoi.ds.map((n) => (
                  <tr key={n.id} className="border-t border-darkborder">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <AnhDaiDien n={n} />
                        <div className="min-w-0">
                          <div className="font-medium text-text-primary truncate">{n.ten || n.username}</div>
                          <div className="text-xs text-text-muted truncate">@{n.username} · {n.email} · #{n.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">{n.isPro ? <span className="text-xs rounded-md bg-amber-500/15 text-amber-400 px-1.5 py-0.5">Pro</span> : <span className="text-xs text-text-muted">Free</span>}</td>
                    <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">{n.lastLoginAt ? ngay(n.lastLoginAt) : '—'}</td>
                    <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">{ngay(n.createdAt)}</td>
                    <td className="px-4 py-2.5 text-right">
                      {n.daChan ? (
                        <span className="text-xs rounded-md bg-red-500/15 text-red-400 px-2 py-1">Đã chặn</span>
                      ) : (
                        <button onClick={() => void chan(n)} disabled={dangGui}
                          className="rounded-lg border border-darkborder hover:border-red-500/60 hover:text-red-400 text-text-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 disabled:opacity-50">
                          <Ban className="w-3.5 h-3.5" /> Chặn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dsNguoi && dsNguoi.tong > dsNguoi.co && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-darkborder text-xs text-text-muted">
            <span>Trang {dsNguoi.trang} / {Math.ceil(dsNguoi.tong / dsNguoi.co)}</span>
            <div className="flex gap-1.5">
              <button onClick={() => setTrangDs((t) => Math.max(1, t - 1))} disabled={dsNguoi.trang <= 1}
                className="rounded-lg border border-darkborder px-2 py-1 disabled:opacity-40" aria-label="Trang trước"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setTrangDs((t) => t + 1)} disabled={dsNguoi.trang >= Math.ceil(dsNguoi.tong / dsNguoi.co)}
                className="rounded-lg border border-darkborder px-2 py-1 disabled:opacity-40" aria-label="Trang sau"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* MỨC DÙNG KEY — theo key + theo việc (USD tự đo) */}
      <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-darkborder">
          <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-400" /> Mức dùng key
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-darkbg border border-darkborder p-0.5">
            {KY.map((k) => (
              <button key={k} onClick={() => setKySoNgay(k)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${kySoNgay === k ? 'bg-blue-500/20 text-blue-300' : 'text-text-muted hover:text-text-primary'}`}>
                {k} ngày
              </button>
            ))}
          </div>
        </div>
        <p className="px-4 pt-3 text-xs text-text-muted">
          USD tự đo (ước lượng — usage × bảng giá trong mã), không phải số dư thật. Chỉ gồm lưu lượng cổng Claude chính hãng + rambo
          (AI Code, thi, CT Work, AI thống kê…); lưu lượng modelapi (chat, gia sư…) ghi ở sổ khác.
        </p>
        {mucKey === null ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-text-muted" /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-text-muted mb-2">Theo key</div>
              {mucKey.theoKey.length === 0 ? (
                <div className="text-sm text-text-muted py-4">Chưa có lượt nào trong kỳ.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-text-muted">
                    <tr><th className="text-left py-1.5">Key</th><th className="text-right py-1.5">USD</th><th className="text-right py-1.5">Lượt</th><th className="text-right py-1.5">Token (vào/ra)</th></tr>
                  </thead>
                  <tbody>
                    {mucKey.theoKey.map((r) => (
                      <tr key={r.keyId ?? 'null'} className="border-t border-darkborder">
                        <td className="py-1.5 text-text-primary">{r.nhan}{r.duoiKhoa && <span className="text-text-muted"> ·…{r.duoiKhoa}</span>}</td>
                        <td className="py-1.5 text-right text-text-secondary tabular-nums">{usd(r.usd)}</td>
                        <td className="py-1.5 text-right text-text-muted tabular-nums">{r.luot}</td>
                        <td className="py-1.5 text-right text-text-muted tabular-nums">{soGon(r.token.vao)}/{soGon(r.token.ra)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-text-muted mb-2">Theo việc / dịch vụ</div>
              {mucKey.theoViec.length === 0 ? (
                <div className="text-sm text-text-muted py-4">Chưa có lượt nào trong kỳ.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-text-muted">
                    <tr><th className="text-left py-1.5">Việc</th><th className="text-right py-1.5">USD</th><th className="text-right py-1.5">Lượt</th><th className="text-right py-1.5">Token (vào/ra)</th></tr>
                  </thead>
                  <tbody>
                    {mucKey.theoViec.map((r) => (
                      <tr key={r.viec} className="border-t border-darkborder">
                        <td className="py-1.5 text-text-primary">{tenViec(r.viec)}</td>
                        <td className="py-1.5 text-right text-text-secondary tabular-nums">{usd(r.usd)}</td>
                        <td className="py-1.5 text-right text-text-muted tabular-nums">{r.luot}</td>
                        <td className="py-1.5 text-right text-text-muted tabular-nums">{soGon(r.token.vao)}/{soGon(r.token.ra)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnhDaiDien({ n }: { n: Pick<NguoiDung, 'avatarUrl' | 'username' | 'ten'> }) {
  const chu = (n.ten || n.username || '?').trim().charAt(0).toUpperCase();
  return n.avatarUrl
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={anhTuyetDoi(n.avatarUrl)} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
    : <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center shrink-0">{chu}</span>;
}
