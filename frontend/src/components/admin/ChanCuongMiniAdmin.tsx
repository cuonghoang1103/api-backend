'use client';

/**
 * Admin — DANH SÁCH CHẶN CUONGMINI (27/10/2026).
 * Hai phạm vi độc lập: AI Code + CLI + VS Code (chung một cửa) · CuongMini trong CT Work.
 * Backend: /api/v1/admin/cong-anthropic/chan (xem src/services/agent/cuongMiniChan.ts).
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Ban, Code2, Kanban, Loader2, LockOpen, Search, ShieldBan } from 'lucide-react';

type PhamVi = 'AI_CODE' | 'CTWORK';
interface DongChan {
  userId: number; username: string | null; email: string | null; ten: string | null;
  phamVi: PhamVi; lyDo: string | null; chanBoi: string | null; luc: string;
}

const API = '/api/v1/admin/cong-anthropic/chan';
async function goi<T>(duong: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${duong}`, {
    credentials: 'include', ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as T;
}

const PHAM_VI: Array<{ id: PhamVi; ten: string; mo: string; Icon: typeof Code2 }> = [
  { id: 'AI_CODE', ten: 'AI Code · CLI · VS Code', mo: 'Chặn dùng CuongMini trong app desktop AI Code, CuongMini CLI và extension VS Code.', Icon: Code2 },
  { id: 'CTWORK', ten: 'CT Work', mo: 'Chặn dùng CuongMini trong CT Work (hỏi đáp, thao tác thẻ, soát tài liệu, agent dựng sẵn).', Icon: Kanban },
];

const ngay = (s: string) => new Date(s).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

export default function ChanCuongMiniAdmin() {
  const [phamVi, setPhamVi] = useState<PhamVi>('AI_CODE');
  const [ds, setDs] = useState<DongChan[] | null>(null);
  const [q, setQ] = useState('');
  const [lyDo, setLyDo] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [loc, setLoc] = useState('');

  const nap = useCallback(async () => {
    setDs(null);
    try { setDs(await goi<DongChan[]>(`?phamVi=${phamVi}`)); } catch (e) { toast.error((e as Error).message); setDs([]); }
  }, [phamVi]);
  useEffect(() => { void nap(); }, [nap]);

  const chan = async () => {
    if (!q.trim()) return;
    setDangGui(true);
    try {
      setDs(await goi<DongChan[]>('', { method: 'POST', body: JSON.stringify({ q: q.trim(), phamVi, lyDo: lyDo.trim() || null }) }));
      toast.success(`Đã chặn ${q.trim()}`);
      setQ(''); setLyDo('');
    } catch (e) { toast.error((e as Error).message); } finally { setDangGui(false); }
  };

  const mo = async (d: DongChan) => {
    if (!window.confirm(`Mở khoá CuongMini (${PHAM_VI.find((p) => p.id === d.phamVi)?.ten}) cho ${d.username ?? d.email}?`)) return;
    try {
      setDs(await goi<DongChan[]>(`/${d.userId}/${d.phamVi}`, { method: 'DELETE' }));
      toast.success('Đã mở khoá');
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Email hoặc username"
            className="rounded-xl bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary" />
          <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (chỉ admin thấy) — vd: spam, xúc phạm"
            onKeyDown={(e) => { if (e.key === 'Enter') void chan(); }}
            className="rounded-xl bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary" />
          <button onClick={() => void chan()} disabled={dangGui || !q.trim()}
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
    </div>
  );
}
