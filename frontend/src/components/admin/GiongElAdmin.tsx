'use client';

/**
 * Admin → Thương mại → tab "Giọng ElevenLabs" (15/11/2026).
 * Số dư THẬT của tài khoản ElevenLabs + dùng theo việc/ngày/người (sổ `giong_el_dung`) + công tắc, trần Pro,
 * quỹ giữ cho robot. Backend: `src/routes/giong.routes.ts` (`/api/v1/giong/admin/*`).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, RefreshCw, Mic, Save, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

type Viec = 'robot' | 'phong_van' | 'gia_su' | 'ai_chat' | 'ngoai_ngu' | 'khac';
type ViecWeb = Exclude<Viec, 'robot'>;
interface DongViec { luot: number; kyTu: number; credit: number; cache: number; loi: number }
interface CaiDat {
  bat: boolean; robot: boolean; web: boolean; viec: Record<ViecWeb, boolean>;
  tranProNgay: number; giuChoRobot: number; giongMacDinh: string; model: string; giongTheoNgonNgu: Record<string, string>;
}
interface ThongKe {
  soDu: { daDung: number; tran: number; conLai: number; lamMoi: string | null; goi: string | null } | null;
  caiDat: CaiDat;
  nhanViec: Record<Viec, string>;
  homNay: Record<Viec, DongViec>;
  bayNgay: Record<Viec, DongViec>;
  baMuoiNgay: Record<Viec, DongViec>;
  theoNgay: Array<{ ngay: string; viec: Viec; credit: number; luot: number }>;
  topNguoi: Array<{ userId: number; ten: string; credit: number; kyTu: number; luot: number }>;
  loiGanDay: Array<{ createdAt: string; viec: Viec; loi: string | null }>;
}

const VIEC: Viec[] = ['robot', 'phong_van', 'gia_su', 'ai_chat', 'ngoai_ngu', 'khac'];
const MAU: Record<Viec, string> = {
  robot: '#22d3ee', phong_van: '#a78bfa', gia_su: '#34d399', ai_chat: '#f472b6', ngoai_ngu: '#fbbf24', khac: '#94a3b8',
};
const so = (n: number) => n.toLocaleString('vi-VN');

function The({ tieuDe, phai, children }: { tieuDe: string; phai?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-darkborder bg-darkcard p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-text-primary">{tieuDe}</h3>
        {phai}
      </div>
      {children}
    </section>
  );
}

function CongTac({ bat, onDoi, nhan }: { bat: boolean; onDoi: (v: boolean) => void; nhan: string }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
      <input type="checkbox" className="w-4 h-4 accent-cyan-400" checked={bat} onChange={(e) => onDoi(e.target.checked)} />
      <span className="text-text-primary">{nhan}</span>
    </label>
  );
}

export default function GiongElAdmin() {
  const [tk, setTk] = useState<ThongKe | null>(null);
  const [cd, setCd] = useState<CaiDat | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await api.get('/giong/admin/thong-ke');
      setTk(r.data.data);
      setCd(r.data.data.caiDat);
    } catch (e) {
      toast.error((e as Error).message || 'Không tải được thống kê giọng');
    } finally {
      setDangTai(false);
    }
  }, []);
  useEffect(() => { void nap(); }, [nap]);

  const luu = async () => {
    if (!cd) return;
    setDangLuu(true);
    try {
      const r = await api.put('/giong/admin/cai-dat', cd);
      setCd(r.data.data);
      toast.success('Đã lưu — có hiệu lực trong ~30 giây');
    } catch (e) {
      toast.error((e as Error).message || 'Lưu hỏng');
    } finally {
      setDangLuu(false);
    }
  };

  const bieuDo = useMemo(() => {
    if (!tk) return [];
    const m = new Map<string, Record<string, number | string>>();
    for (const r of tk.theoNgay) {
      const o = m.get(r.ngay) ?? { ngay: r.ngay.slice(5) };
      o[r.viec] = ((o[r.viec] as number) ?? 0) + r.credit;
      m.set(r.ngay, o);
    }
    return [...m.values()];
  }, [tk]);

  if (dangTai && !tk) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-text-muted" /></div>;
  if (!tk || !cd) return <p className="text-text-muted text-sm">Không tải được.</p>;

  const sd = tk.soDu;
  const phanTram = sd && sd.tran ? Math.min(100, Math.round((sd.daDung / sd.tran) * 100)) : 0;
  const tongCredit = (d: Record<Viec, DongViec>) => VIEC.reduce((n, v) => n + (d[v]?.credit ?? 0), 0);

  return (
    <div className="space-y-6">
      <The
        tieuDe="Tài khoản ElevenLabs"
        phai={
          <button onClick={() => void nap()} className="text-xs flex items-center gap-1 text-text-muted hover:text-text-primary">
            <RefreshCw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} /> Làm mới
          </button>
        }
      >
        {sd ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
              <span className="text-text-muted">Gói <b className="text-text-primary uppercase">{sd.goi ?? '?'}</b></span>
              <span className="text-text-muted">Đã dùng <b className="text-text-primary">{so(sd.daDung)}</b> / {so(sd.tran)} credit</span>
              <span className="text-text-muted">Còn <b className={sd.conLai <= cd.giuChoRobot ? 'text-amber-400' : 'text-emerald-400'}>{so(sd.conLai)}</b></span>
              {sd.lamMoi && <span className="text-text-muted">Làm mới / hết hạn: {new Date(sd.lamMoi).toLocaleDateString('vi-VN')}</span>}
            </div>
            <div className="h-2 rounded-full bg-darkborder overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${phanTram}%` }} />
            </div>
            <p className="text-xs text-text-muted">
              Hôm nay {so(tongCredit(tk.homNay))} credit · 7 ngày {so(tongCredit(tk.bayNgay))} · 30 ngày {so(tongCredit(tk.baMuoiNgay))}
              {' '}(sổ của web — ước theo hệ số model; con số trên cùng là số THẬT của ElevenLabs).
            </p>
            {sd.conLai <= cd.giuChoRobot && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Quỹ còn dưới mức giữ cho robot ⇒ web đang dùng giọng cũ, chỉ robot còn ElevenLabs.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-400">Chưa đọc được số dư (thiếu ELEVENLABS_API_KEY trên máy chủ, hoặc ElevenLabs không trả lời).</p>
        )}
      </The>

      <The
        tieuDe="Điều khiển"
        phai={
          <button onClick={() => void luu()} disabled={dangLuu} className="text-sm px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1.5 disabled:opacity-50">
            {dangLuu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu
          </button>
        }
      >
        <div className="grid sm:grid-cols-3 gap-3">
          <CongTac nhan="Bật ElevenLabs (công tắc tổng)" bat={cd.bat} onDoi={(bat) => setCd({ ...cd, bat })} />
          <CongTac nhan="Robot Odin" bat={cd.robot} onDoi={(robot) => setCd({ ...cd, robot })} />
          <CongTac nhan="Web (admin + Pro)" bat={cd.web} onDoi={(web) => setCd({ ...cd, web })} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {(Object.keys(cd.viec) as ViecWeb[]).map((v) => (
            <CongTac key={v} nhan={tk.nhanViec[v]} bat={cd.viec[v]} onDoi={(b) => setCd({ ...cd, viec: { ...cd.viec, [v]: b } })} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 pt-2 text-sm">
          <label className="space-y-1">
            <span className="text-text-muted">Trần Pro (ký tự / người / ngày, 0 = Pro không dùng)</span>
            <input type="number" min={0} value={cd.tranProNgay} onChange={(e) => setCd({ ...cd, tranProNgay: Number(e.target.value) })}
              className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-1.5 text-text-primary" />
          </label>
          <label className="space-y-1">
            <span className="text-text-muted">Giữ quỹ cho robot (credit) — quỹ còn dưới mức này thì web ngưng</span>
            <input type="number" min={0} value={cd.giuChoRobot} onChange={(e) => setCd({ ...cd, giuChoRobot: Number(e.target.value) })}
              className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-1.5 text-text-primary" />
          </label>
          <label className="space-y-1">
            <span className="text-text-muted">Giọng mặc định (voice id)</span>
            <input value={cd.giongMacDinh} onChange={(e) => setCd({ ...cd, giongMacDinh: e.target.value.trim() })}
              className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-1.5 font-mono text-text-primary" />
          </label>
          <label className="space-y-1">
            <span className="text-text-muted">Model</span>
            <select value={cd.model} onChange={(e) => setCd({ ...cd, model: e.target.value })}
              className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-1.5 text-text-primary">
              <option value="eleven_v4_turbo">eleven_v4_turbo — nhanh nhất, 0,5 credit/ký tự (khuyên dùng)</option>
              <option value="eleven_v3_conversational">eleven_v3_conversational — hội thoại, 0,5</option>
              <option value="eleven_flash_v2_5">eleven_flash_v2_5 — 0,5 (tiếng Việt chậm hơn)</option>
              <option value="eleven_v3">eleven_v3 — biểu cảm nhất, 1 credit/ký tự</option>
            </select>
          </label>
          {['en', 'ja', 'zh'].map((l) => (
            <label key={l} className="space-y-1">
              <span className="text-text-muted">Giọng riêng cho <b>{l}</b> (trống = giọng mặc định)</span>
              <input value={cd.giongTheoNgonNgu[l] ?? ''} placeholder="voice id bản xứ (tuỳ chọn)"
                onChange={(e) => {
                  const g = { ...cd.giongTheoNgonNgu };
                  if (e.target.value.trim()) g[l] = e.target.value.trim(); else delete g[l];
                  setCd({ ...cd, giongTheoNgonNgu: g });
                }}
                className="w-full rounded-lg bg-darkbg border border-darkborder px-3 py-1.5 font-mono text-text-primary" />
            </label>
          ))}
        </div>
        <p className="text-xs text-text-muted">
          Ai dùng: robot (khi bật) · admin không trần · Pro theo trần ngày · Free giữ giọng cũ. Câu ≤ 400 ký tự đọc rồi được lưu R2 —
          lần sau phát lại không tốn credit (cột &ldquo;cache&rdquo;).
        </p>
      </The>

      <The tieuDe="Dùng theo việc">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-text-muted text-xs">
              <tr className="text-left">
                <th className="py-1.5 pr-3">Việc</th>
                <th className="pr-3">Hôm nay (credit · lượt)</th>
                <th className="pr-3">7 ngày</th>
                <th className="pr-3">30 ngày</th>
                <th className="pr-3">Cache 30 ngày</th>
                <th>Lỗi 30 ngày</th>
              </tr>
            </thead>
            <tbody>
              {VIEC.map((v) => (
                <tr key={v} className="border-t border-darkborder">
                  <td className="py-1.5 pr-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: MAU[v] }} />{tk.nhanViec[v]}
                  </td>
                  <td className="pr-3">{so(tk.homNay[v]?.credit ?? 0)} · {so(tk.homNay[v]?.luot ?? 0)}</td>
                  <td className="pr-3">{so(tk.bayNgay[v]?.credit ?? 0)}</td>
                  <td className="pr-3">{so(tk.baMuoiNgay[v]?.credit ?? 0)}</td>
                  <td className="pr-3">{so(tk.baMuoiNgay[v]?.cache ?? 0)}</td>
                  <td className={(tk.baMuoiNgay[v]?.loi ?? 0) > 0 ? 'text-amber-400' : ''}>{so(tk.baMuoiNgay[v]?.loi ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </The>

      <The tieuDe="Credit 14 ngày">
        {bieuDo.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bieuDo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="ngay" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                {VIEC.map((v) => <Bar key={v} dataKey={v} name={tk.nhanViec[v]} stackId="a" fill={MAU[v]} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-sm text-text-muted">Chưa có lượt nào.</p>}
      </The>

      <div className="grid lg:grid-cols-2 gap-6">
        <The tieuDe="Dùng nhiều nhất (7 ngày)">
          {tk.topNguoi.length ? (
            <ul className="text-sm space-y-1">
              {tk.topNguoi.map((t) => (
                <li key={t.userId} className="flex justify-between gap-3">
                  <span className="truncate">{t.ten}</span>
                  <span className="text-text-muted whitespace-nowrap">{so(t.credit)} credit · {so(t.luot)} lượt</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-text-muted">Chưa có.</p>}
        </The>
        <The tieuDe="Lỗi gần đây">
          {tk.loiGanDay.length ? (
            <ul className="text-xs space-y-1.5">
              {tk.loiGanDay.map((l, i) => (
                <li key={i} className="text-text-muted">
                  <span className="text-text-primary">{new Date(l.createdAt).toLocaleString('vi-VN')}</span> · {tk.nhanViec[l.viec] ?? l.viec} · {l.loi}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-text-muted flex items-center gap-1.5"><Mic className="w-4 h-4" /> Không có lỗi.</p>}
        </The>
      </div>
    </div>
  );
}
