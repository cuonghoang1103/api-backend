'use client';

import { useEffect, useRef, useState } from 'react';
import { Ticket, Loader2, Send, Search, X, Check } from 'lucide-react';
import { myCodesApi, socialUserApi } from '@/lib/api';
import { toast } from 'sonner';

interface UserHit { id: number; username: string; displayName: string | null; avatarUrl: string | null }

export default function AdminUserCodesPage() {
  // User picker
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<UserHit | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Code fields
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [codeType, setCodeType] = useState<'DISCOUNT' | 'COURSE' | 'OTHER'>('DISCOUNT');
  const [expiresAt, setExpiresAt] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (selected) return;
    const q = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await socialUserApi.searchMentions(q, 8);
        setResults((res.data?.data as UserHit[]) || []);
      } catch { setResults([]); } finally { setSearching(false); }
    }, 250);
  }, [query, selected]);

  const grant = async () => {
    if (!selected) { toast.error('Chọn user trước'); return; }
    if (!label.trim() || !code.trim()) { toast.error('Nhập tên mã và mã'); return; }
    setSending(true);
    try {
      await myCodesApi.adminGrant({
        userId: selected.id,
        label: label.trim(),
        code: code.trim(),
        codeType,
        note: note.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      toast.success(`Đã cấp mã vào ví (My Code) của @${selected.username}`);
      setLabel(''); setCode(''); setNote(''); setExpiresAt('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cấp mã thất bại');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-1 flex items-center gap-2">
        <Ticket className="w-6 h-6 text-neon-violet" /> Cấp mã vào ví User (My Code)
      </h1>
      <p className="text-text-secondary text-sm mb-6">Tìm user theo tên rồi gán thẳng một mã (giảm giá / vào học) vào mục <b>My Code</b> của họ.</p>

      <div className="rounded-2xl border border-darkborder bg-darkcard p-5 space-y-4">
        {/* User picker */}
        <div>
          <label className="block text-xs text-text-muted mb-1">Chọn user</label>
          {selected ? (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-darkbg border border-neon-violet/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.username)}&size=32`} alt="" className="w-8 h-8 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">{selected.displayName || selected.username}</p>
                <p className="text-xs text-text-muted truncate">@{selected.username} · ID {selected.id}</p>
              </div>
              <button onClick={() => { setSelected(null); setQuery(''); }} className="p-1.5 rounded-lg text-text-muted hover:text-red-400" title="Đổi user"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Gõ username hoặc tên user…" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
              {query.trim() && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-darkborder bg-darkcard shadow-xl max-h-64 overflow-y-auto">
                  {searching ? (
                    <div className="px-4 py-3 text-sm text-text-muted flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Đang tìm…</div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-text-muted">Không tìm thấy user.</div>
                  ) : results.map((u) => (
                    <button key={u.id} onClick={() => { setSelected(u); setResults([]); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neon-violet/10 text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&size=32`} alt="" className="w-7 h-7 rounded-full" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-text-primary truncate">{u.displayName || u.username}</p>
                        <p className="text-xs text-text-muted truncate">@{u.username} · ID {u.id}</p>
                      </div>
                      <Check className="w-4 h-4 text-neon-violet opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-text-muted mb-1">Loại mã</label>
            <select value={codeType} onChange={(e) => setCodeType(e.target.value as typeof codeType)} className="w-full px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary">
              <option value="DISCOUNT">Mã giảm giá</option>
              <option value="COURSE">Mã vào học</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary mt-auto" title="Hạn dùng (tuỳ chọn)" />
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tên mã (VD: Giảm 20% Tết)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã (VD: TET20)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary font-mono" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary sm:col-span-2" />
        </div>
        <button onClick={grant} disabled={sending || !selected} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Cấp mã
        </button>
      </div>
    </div>
  );
}
