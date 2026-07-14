'use client';

/**
 * /admin/pro-codes — manage Pro membership codes.
 * Create codes (lifetime or N-day), list/toggle/delete, grant Pro directly to a
 * user (no code), and revoke Pro. Mirrors the existing "Cấp mã cho user" flow.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Crown, Loader2, Plus, Trash2, Copy, Check, Search, ShieldOff, Infinity as InfinityIcon } from 'lucide-react';
import { proAdminApi, socialUserApi, type ProCode, type ProUser } from '@/lib/api';
import { toast } from 'sonner';

interface UserHit { id: number; username: string; displayName: string | null; avatarUrl: string | null }

const DURATIONS = [
  { label: 'Vĩnh viễn', days: null as number | null },
  { label: '30 ngày', days: 30 },
  { label: '90 ngày', days: 90 },
  { label: '1 năm', days: 365 },
];

export default function AdminProCodesPage() {
  const [codes, setCodes] = useState<ProCode[]>([]);
  const [users, setUsers] = useState<ProUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Create-code form
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [durIdx, setDurIdx] = useState(0);
  const [maxUses, setMaxUses] = useState(1);
  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      proAdminApi.listCodes().then((r) => setCodes(r.data.data)).catch(() => {}),
      proAdminApi.listUsers().then((r) => setUsers(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    setCreating(true);
    try {
      const r = await proAdminApi.createCode({
        code: code.trim() || undefined,
        label: label.trim() || undefined,
        durationDays: DURATIONS[durIdx].days,
        maxUses: Math.max(1, maxUses),
        note: note.trim() || undefined,
      });
      toast.success(`Đã tạo mã: ${r.data.data.code}`);
      setLabel(''); setCode(''); setNote(''); setMaxUses(1);
      load();
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Tạo mã thất bại');
    } finally { setCreating(false); }
  };

  const toggleActive = async (c: ProCode) => {
    await proAdminApi.updateCode(c.id, { isActive: !c.isActive }).catch(() => toast.error('Lỗi'));
    load();
  };
  const del = async (c: ProCode) => {
    if (!confirm(`Xoá mã ${c.code}?`)) return;
    await proAdminApi.deleteCode(c.id).catch(() => toast.error('Lỗi'));
    load();
  };
  const copy = (c: string) => { navigator.clipboard?.writeText(c); toast.success('Đã copy mã'); };

  return (
    <div className="p-4 md:p-6 text-white">
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Crown className="w-6 h-6 text-amber-400" /> Quản lý mã Pro</h1>
      <p className="text-slate-400 text-sm mb-6">Tạo mã để user tự kích hoạt Pro, hoặc cấp Pro trực tiếp cho user.</p>

      {/* Create code */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
        <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-300" /> Tạo mã Pro mới</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tên gợi nhớ (tuỳ chọn)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Mã (bỏ trống = tự sinh)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono" />
          <select value={durIdx} onChange={(e) => setDurIdx(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {DURATIONS.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 shrink-0">Số lượt</label>
            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(Math.max(1, Number(e.target.value) || 1))} className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <button onClick={create} disabled={creating} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-violet-500 text-white text-sm disabled:opacity-50">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tạo mã
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Codes list */}
          <div>
            <div className="text-sm font-semibold mb-2">Danh sách mã ({codes.length})</div>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {codes.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0">
                  <button onClick={() => copy(c.code)} title="Copy" className="font-mono text-sm text-amber-300 hover:underline inline-flex items-center gap-1"><Copy className="w-3 h-3" />{c.code}</button>
                  <div className="flex-1 min-w-0">
                    {c.label && <div className="text-xs text-slate-300 truncate">{c.label}</div>}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      {c.lifetime ? <span className="inline-flex items-center gap-0.5"><InfinityIcon className="w-3 h-3" /> vĩnh viễn</span> : `${c.durationDays} ngày`}
                      <span>· {c.usedCount}/{c.maxUses} lượt</span>
                    </div>
                  </div>
                  <button onClick={() => toggleActive(c)} className={`text-[11px] px-2 py-0.5 rounded ${c.isActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-400'}`}>{c.isActive ? 'BẬT' : 'TẮT'}</button>
                  <button onClick={() => del(c)} className="p-1.5 rounded text-red-400 hover:bg-white/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {!codes.length && <div className="px-3 py-4 text-sm text-slate-500">Chưa có mã nào.</div>}
            </div>
          </div>

          {/* Grant + Pro users */}
          <div className="space-y-6">
            <GrantPro onDone={load} />
            <div>
              <div className="text-sm font-semibold mb-2">User đang Pro ({users.length})</div>
              <div className="rounded-xl border border-white/10 overflow-hidden">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{u.fullName || u.username} <span className="text-slate-500">@{u.username}</span></div>
                      <div className="text-[11px] text-slate-500">
                        {u.lifetime ? 'vĩnh viễn' : u.expiresAt ? `đến ${new Date(u.expiresAt).toLocaleDateString('vi-VN')}` : ''}
                        {u.expired && <span className="text-red-400"> · đã hết hạn</span>}
                        {u.source && <span> · {u.source}</span>}
                      </div>
                    </div>
                    <button onClick={async () => { if (confirm(`Thu hồi Pro của @${u.username}?`)) { await proAdminApi.revoke(u.id).catch(() => toast.error('Lỗi')); load(); } }} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-red-500/10 text-red-300 hover:bg-red-500/20"><ShieldOff className="w-3 h-3" /> Thu hồi</button>
                  </div>
                ))}
                {!users.length && <div className="px-3 py-4 text-sm text-slate-500">Chưa có ai là Pro.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GrantPro({ onDone }: { onDone: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserHit[]>([]);
  const [selected, setSelected] = useState<UserHit | null>(null);
  const [durIdx, setDurIdx] = useState(0);
  const [granting, setGranting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected) return;
    const q = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await socialUserApi.searchMentions(q, 8);
        setResults((res.data?.data as UserHit[]) || []);
      } catch { setResults([]); }
    }, 250);
  }, [query, selected]);

  const grant = async () => {
    if (!selected) { toast.error('Chọn user'); return; }
    setGranting(true);
    try {
      await proAdminApi.grant(selected.id, DURATIONS[durIdx].days);
      toast.success(`Đã cấp Pro cho @${selected.username}`);
      setSelected(null); setQuery(''); setResults([]);
      onDone();
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cấp Pro thất bại');
    } finally { setGranting(false); }
  };

  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.05] p-4">
      <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Crown className="w-4 h-4 text-violet-300" /> Cấp Pro trực tiếp cho user</div>
      {selected ? (
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded bg-white/10 text-sm">@{selected.username}</span>
          <button onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-white">đổi</button>
        </div>
      ) : (
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm user…" className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm" />
          {results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1424] max-h-48 overflow-y-auto">
              {results.map((u) => (
                <button key={u.id} onClick={() => { setSelected(u); setResults([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                  {u.displayName || u.username} <span className="text-slate-500">@{u.username}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <select value={durIdx} onChange={(e) => setDurIdx(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
          {DURATIONS.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
        </select>
        <button onClick={grant} disabled={granting || !selected} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-200 border border-violet-500/40 text-sm disabled:opacity-50">
          {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Cấp Pro
        </button>
      </div>
    </div>
  );
}
